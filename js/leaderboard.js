// Leaderboard functionality

let refreshInterval;

async function initLeaderboard() {
    // Initial load
    await loadLeaderboard();
    
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', loadLeaderboard);
    
    // Auto-refresh every 10 seconds
    refreshInterval = setInterval(loadLeaderboard, 10000);
}

async function loadLeaderboard() {
    try {
        showLoading(true);
        
        console.log('Loading leaderboard...');
        const leaderboard = await db.getLeaderboardWithCorrectCount();
        console.log('Leaderboard data:', leaderboard);
        
        showLoading(false);
        
        const tbody = document.getElementById('leaderboardBody');
        const noScoresMsg = document.getElementById('noScoresMessage');
        
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
            const isScored = entry.score !== null && entry.score !== undefined;
            console.log(`Entry ${index + 1}: ${entry.first_name} ${entry.last_name} - Correct: ${entry.correct_count}, Score: ${entry.score}`);
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${entry.first_name} ${entry.last_name}</td>
                    <td>${isScored ? entry.correct_count + '/7' : '—'}</td>
                    <td>${isScored ? '✓ Graded' : '⏳ Pending'}</td>
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

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (refreshInterval) clearInterval(refreshInterval);
});
