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

async function loadLeaderboard() {
    try {
        if (typeof db === 'undefined') {
            console.error('Database not initialized yet');
            return;
        }

        showLoading(true);

        console.log('Loading leaderboard...');
        const leaderboard = await db.getLeaderboardWithCorrectCount();
        console.log('Leaderboard data:', leaderboard);

        showLoading(false);

        const tbody = document.getElementById('leaderboardBody');

        if (leaderboard.length === 0) {
            console.log('No leaderboard entries found');
            tbody.innerHTML = '<tr><td colspan="3" class="text-center">No predictions submitted yet.</td></tr>';
            return;
        }

        console.log(`Displaying ${leaderboard.length} entries on leaderboard`);
        document.getElementById('leaderboardContainer').classList.remove('hidden');
        
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
