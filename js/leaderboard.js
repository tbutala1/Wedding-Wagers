// Leaderboard functionality

// Wait for db to be available
async function waitForDatabase() {
    console.log('Waiting for database to initialize...');
    let attempts = 0;
    const maxAttempts = 50; // Wait up to 5 seconds (50 * 100ms)
    
    while (typeof db === 'undefined' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
        if (attempts % 10 === 0) {
            console.log(`Still waiting for db... (${attempts * 100}ms)`);
        }
    }
    
    if (typeof db === 'undefined') {
        console.error('Database failed to initialize after 5 seconds');
        console.error('Check if config.js and db.js loaded correctly');
        console.error('window.__CONFIG__:', window.__CONFIG__);
        alert('Error: Database failed to initialize. Please refresh the page.');
        return false;
    }
    
    console.log('✓ Database initialized successfully');
    return true;
}

async function initLeaderboard() {
    // Wait for database to be ready
    const dbReady = await waitForDatabase();
    if (!dbReady) return;
    
    // Initial load
    await loadLeaderboard();
    
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', loadLeaderboard);
}

function countGradedQuestions(correctAnswers) {
    if (!correctAnswers) return 0;
    let count = 0;
    if (correctAnswers.q1 != null) count++;
    if (correctAnswers.q2 != null) count++;
    if (correctAnswers.q3 != null) count++;
    if (correctAnswers.q4 != null) count++;
    if (correctAnswers.q5_feet != null && correctAnswers.q5_inches != null) count++;
    if (correctAnswers.q6 != null) count++;
    if (correctAnswers.q7 != null) count++;
    return count;
}

async function loadLeaderboard() {
    try {
        if (typeof db === 'undefined') {
            console.error('Database not initialized yet');
            return;
        }

        showLoading(true);

        console.log('Loading leaderboard...');
        const [leaderboard, correctAnswers] = await Promise.all([
            db.getLeaderboardWithCorrectCount(),
            db.getCorrectAnswers()
        ]);
        console.log('Leaderboard data:', leaderboard);

        showLoading(false);

        const tbody = document.getElementById('leaderboardBody');
        const noScoresMsg = document.getElementById('noScoresMessage');
        const gradingStatus = document.getElementById('gradingStatus');

        const gradedCount = countGradedQuestions(correctAnswers);
        if (gradingStatus) {
            gradingStatus.textContent = `${gradedCount} of 7 questions graded so far`;
        }

        if (leaderboard.length === 0) {
            console.log('No leaderboard entries found');
            tbody.innerHTML = '';
            document.getElementById('leaderboardContainer').classList.add('hidden');
            noScoresMsg.classList.remove('hidden');
            return;
        }
        
        console.log(`Displaying ${leaderboard.length} entries on leaderboard`);
        document.getElementById('leaderboardContainer').classList.remove('hidden');
        noScoresMsg.classList.add('hidden');
        
        // Populate table
        tbody.innerHTML = leaderboard.map((entry, index) => {
            console.log(`Entry ${index + 1}: ${entry.first_name} ${entry.last_name} - Correct: ${entry.correct_count}`);
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${entry.first_name} ${entry.last_name}</td>
                    <td>${entry.correct_count !== undefined ? entry.correct_count + '/7' : '—'}</td>
                </tr>
            `;
        }).join('');
        
    } catch (error) {
        showLoading(false);
        console.error('Error loading leaderboard:', error);
    }
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLeaderboard);
} else {
    initLeaderboard();
}
