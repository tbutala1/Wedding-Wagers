// Database operations using Supabase

// Table: responses
// Columns: id, first_name, last_name, answers (jsonb), submitted_at, score, created_at

// Table: correct_answers
// Columns: id, q1, q2, q3, q4, q5_feet, q5_inches, q6, q7, created_at, updated_at

class Database {
    constructor() {
        this.supabase = supabaseClient;
        // Log connection info for debugging
        console.log('Database initialized with:');
        console.log('- Supabase URL:', SUPABASE_URL);
        console.log('- Has API Key:', !!SUPABASE_ANON_KEY);
    }

    // Check if user already exists
    async userExists(firstName, lastName) {
        try {
            console.log(`Checking if user ${firstName} ${lastName} exists...`);
            const { data, error } = await this.supabase
                .from('responses')
                .select('id')
                .eq('first_name', firstName)
                .eq('last_name', lastName)
                .limit(1);

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }
            console.log(`Query successful. Found: ${data && data.length > 0 ? 'yes' : 'no'}`);
            return data && data.length > 0;
        } catch (error) {
            console.error('Error checking user:', error);
            // Provide more detailed error info
            if (error.message?.includes('Failed to fetch')) {
                console.error('Network/CORS Error - Check:');
                console.error('1. Is Supabase URL correct?', SUPABASE_URL);
                console.error('2. Is API key valid?');
                console.error('3. Are you online?');
                console.error('4. Check browser Network tab for CORS errors');
            }
            throw error;
        }
    }

    // Submit user responses
    async submitResponse(firstName, lastName, answers) {
        try {
            const { data, error } = await this.supabase
                .from('responses')
                .insert({
                    first_name: firstName,
                    last_name: lastName,
                    answers: answers,
                    submitted_at: new Date().toISOString()
                })
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error submitting response:', error);
            throw error;
        }
    }

    // Get all responses (for admin)
    async getAllResponses() {
        try {
            const { data, error } = await this.supabase
                .from('responses')
                .select('*')
                .order('submitted_at', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching responses:', error);
            throw error;
        }
    }

    // Delete a response (for admin testing)
    async deleteResponse(id) {
        try {
            const { error } = await this.supabase
                .from('responses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting response:', error);
            throw error;
        }
    }

    // Save correct answers (admin function) - allows partial updates
    async saveCorrectAnswers(answers) {
        try {
            // Build update object - only include fields that have values (not null/undefined)
            const updateData = {};
            if (answers.q1 !== null && answers.q1 !== undefined) updateData.q1 = answers.q1;
            if (answers.q2 !== null && answers.q2 !== undefined) updateData.q2 = answers.q2;
            if (answers.q3 !== null && answers.q3 !== undefined) updateData.q3 = answers.q3;
            if (answers.q4 !== null && answers.q4 !== undefined) updateData.q4 = answers.q4;
            if (answers.q5_feet !== null && answers.q5_feet !== undefined) updateData.q5_feet = answers.q5_feet;
            if (answers.q5_inches !== null && answers.q5_inches !== undefined) updateData.q5_inches = answers.q5_inches;
            if (answers.q6 !== null && answers.q6 !== undefined) updateData.q6 = answers.q6;
            if (answers.q7 !== null && answers.q7 !== undefined) updateData.q7 = answers.q7;
            
            updateData.updated_at = new Date().toISOString();
            
            console.log('Saving answers (partial update):', updateData);
            
            // First, try to get existing answers
            const { data: existingData, error: fetchError } = await this.supabase
                .from('correct_answers')
                .select('id')
                .limit(1);

            if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

            let result;
            if (existingData && existingData.length > 0) {
                // Update existing - only update provided fields
                const { data, error } = await this.supabase
                    .from('correct_answers')
                    .update(updateData)
                    .eq('id', existingData[0].id)
                    .select();

                if (error) throw error;
                result = data[0];
            } else {
                // Insert new - include all fields for first insert
                const insertData = {
                    q1: answers.q1 || null,
                    q2: answers.q2 || null,
                    q3: answers.q3 || null,
                    q4: answers.q4 || null,
                    q5_feet: answers.q5_feet || null,
                    q5_inches: answers.q5_inches || null,
                    q6: answers.q6 || null,
                    q7: answers.q7 || null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                
                const { data, error } = await this.supabase
                    .from('correct_answers')
                    .insert(insertData)
                    .select();

                if (error) throw error;
                result = data[0];
            }

            return result;
        } catch (error) {
            console.error('Error saving answers:', error);
            throw error;
        }
    }

    // Get correct answers
    async getCorrectAnswers() {
        try {
            const { data, error } = await this.supabase
                .from('correct_answers')
                .select('*')
                .limit(1);

            if (error && error.code !== 'PGRST116') throw error;
            return data && data.length > 0 ? data[0] : null;
        } catch (error) {
            console.error('Error fetching correct answers:', error);
            return null;
        }
    }

    // Calculate scores for all responses
    async calculateScores() {
        try {
            console.log('Starting calculateScores...');
            const correctAnswers = await this.getCorrectAnswers();
            console.log('Correct answers:', correctAnswers);
            
            if (!correctAnswers) {
                console.warn('No correct answers found');
                return [];
            }

            const responses = await this.getAllResponses();
            console.log(`Found ${responses.length} responses`);

            const scoredResponses = responses.map(response => {
                let correctCount = 0;
                let totalAnswered = 0;

                // Q1: Yes/No - only check if admin has provided answer
                if (correctAnswers.q1 !== null && correctAnswers.q1 !== undefined) {
                    totalAnswered++;
                    if (response.answers.q1 === correctAnswers.q1) correctCount++;
                }

                // Q2: Yes/No
                if (correctAnswers.q2 !== null && correctAnswers.q2 !== undefined) {
                    totalAnswered++;
                    if (response.answers.q2 === correctAnswers.q2) correctCount++;
                }

                // Q3: Neckline
                if (correctAnswers.q3 !== null && correctAnswers.q3 !== undefined) {
                    totalAnswered++;
                    if (response.answers.q3 === correctAnswers.q3) correctCount++;
                }

                // Q4: Duration
                if (correctAnswers.q4 !== null && correctAnswers.q4 !== undefined) {
                    totalAnswered++;
                    if (response.answers.q4 === correctAnswers.q4) correctCount++;
                }

                // Q5: Height (allow 1 inch tolerance)
                if (correctAnswers.q5_feet !== null && correctAnswers.q5_feet !== undefined &&
                    correctAnswers.q5_inches !== null && correctAnswers.q5_inches !== undefined) {
                    totalAnswered++;
                    const userHeightInches = response.answers.q5_feet * 12 + response.answers.q5_inches;
                    const correctHeightInches = correctAnswers.q5_feet * 12 + correctAnswers.q5_inches;
                    if (Math.abs(userHeightInches - correctHeightInches) <= 1) correctCount++;
                }

                // Q6: Duration
                if (correctAnswers.q6 !== null && correctAnswers.q6 !== undefined) {
                    totalAnswered++;
                    if (response.answers.q6 === correctAnswers.q6) correctCount++;
                }

                // Q7: Mentions (allow within 2)
                if (correctAnswers.q7 !== null && correctAnswers.q7 !== undefined) {
                    totalAnswered++;
                    if (Math.abs(response.answers.q7 - correctAnswers.q7) <= 2) correctCount++;
                }

                // Calculate score based on only answered questions
                const score = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : null;
                
                console.log(`${response.first_name} ${response.last_name}: ${correctCount}/${totalAnswered} correct = ${score}%`);

                return {
                    ...response,
                    correct_count: correctCount,
                    total_answered: totalAnswered,
                    score: score
                };
            });

            // Sort by score (descending) and update database
            scoredResponses.sort((a, b) => {
                // Handle null scores (put them at bottom)
                if (a.score === null && b.score === null) return 0;
                if (a.score === null) return 1;
                if (b.score === null) return -1;
                return b.score - a.score;
            });

            console.log(`Updating ${scoredResponses.length} responses with scores`);
            
            // Update scores in database
            for (const response of scoredResponses) {
                console.log(`Updating ${response.first_name} ${response.last_name}: score=${response.score}, correct_count=${response.correct_count}`);
                const { error } = await this.supabase
                    .from('responses')
                    .update({ 
                        score: response.score
                    })
                    .eq('id', response.id);
                
                if (error) {
                    console.error(`Error updating response ${response.id}:`, error);
                }
            }

            console.log('Score calculation complete');
            return scoredResponses;
        } catch (error) {
            console.error('Error calculating scores:', error);
            throw error;
        }
    }

    // Get leaderboard
    async getLeaderboard() {
        try {
            const { data, error } = await this.supabase
                .from('responses')
                .select('first_name, last_name, score, submitted_at')
                .order('score', { ascending: false, nullsLast: true })
                .order('submitted_at', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
    }
}

// Create global database instance
const db = new Database();
