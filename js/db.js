// Database operations using Supabase

// Table: responses
// Columns: id, first_name, last_name, answers (jsonb), submitted_at, score, created_at

// Table: correct_answers
// Columns: id, q1, q2, q3, q4, q5_feet, q5_inches, q6, q7, created_at, updated_at

class Database {
    constructor() {
        this.supabase = supabaseClient;
    }

    // Check if user already exists
    async userExists(firstName, lastName) {
        try {
            const { data, error } = await this.supabase
                .from('responses')
                .select('id')
                .eq('first_name', firstName)
                .eq('last_name', lastName)
                .limit(1);

            if (error) throw error;
            return data && data.length > 0;
        } catch (error) {
            console.error('Error checking user:', error);
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

    // Save correct answers (admin function)
    async saveCorrectAnswers(answers) {
        try {
            // First, try to get existing answers
            const { data: existingData, error: fetchError } = await this.supabase
                .from('correct_answers')
                .select('id')
                .limit(1);

            if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

            let result;
            if (existingData && existingData.length > 0) {
                // Update existing
                const { data, error } = await this.supabase
                    .from('correct_answers')
                    .update({
                        q1: answers.q1,
                        q2: answers.q2,
                        q3: answers.q3,
                        q4: answers.q4,
                        q5_feet: answers.q5_feet,
                        q5_inches: answers.q5_inches,
                        q6: answers.q6,
                        q7: answers.q7,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingData[0].id)
                    .select();

                if (error) throw error;
                result = data[0];
            } else {
                // Insert new
                const { data, error } = await this.supabase
                    .from('correct_answers')
                    .insert({
                        q1: answers.q1,
                        q2: answers.q2,
                        q3: answers.q3,
                        q4: answers.q4,
                        q5_feet: answers.q5_feet,
                        q5_inches: answers.q5_inches,
                        q6: answers.q6,
                        q7: answers.q7,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
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
            const correctAnswers = await this.getCorrectAnswers();
            if (!correctAnswers) return [];

            const responses = await this.getAllResponses();

            const scoredResponses = responses.map(response => {
                let correctCount = 0;

                // Q1: Yes/No
                if (response.answers.q1 === correctAnswers.q1) correctCount++;

                // Q2: Yes/No
                if (response.answers.q2 === correctAnswers.q2) correctCount++;

                // Q3: Neckline
                if (response.answers.q3 === correctAnswers.q3) correctCount++;

                // Q4: Duration
                if (response.answers.q4 === correctAnswers.q4) correctCount++;

                // Q5: Height (allow 1 inch tolerance)
                const userHeightInches = response.answers.q5_feet * 12 + response.answers.q5_inches;
                const correctHeightInches = correctAnswers.q5_feet * 12 + correctAnswers.q5_inches;
                if (Math.abs(userHeightInches - correctHeightInches) <= 1) correctCount++;

                // Q6: Duration
                if (response.answers.q6 === correctAnswers.q6) correctCount++;

                // Q7: Mentions (allow within 2)
                if (Math.abs(response.answers.q7 - correctAnswers.q7) <= 2) correctCount++;

                const score = Math.round((correctCount / 7) * 100);

                return {
                    ...response,
                    correct_count: correctCount,
                    score: score
                };
            });

            // Sort by score (descending) and update database
            scoredResponses.sort((a, b) => b.score - a.score);

            // Update scores in database
            for (const response of scoredResponses) {
                await this.supabase
                    .from('responses')
                    .update({ score: response.score })
                    .eq('id', response.id);
            }

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
                .not('score', 'is', null)
                .order('score', { ascending: false })
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
