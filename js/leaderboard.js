// Leaderboard functionality

async function waitForDatabase() {
    let attempts = 0;
    while (typeof db === 'undefined' && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    return typeof db !== 'undefined';
}

async function initLeaderboard() {
    const dbReady = await waitForDatabase();
    if (!dbReady) {
        alert('Error: Database failed to initialize. Please refresh the page.');
        return;
    }

    await loadLeaderboard();
    document.getElementById('refreshBtn').addEventListener('click', loadLeaderboard);
}

async function loadLeaderboard() {
    const tbody = document.getElementById('leaderboardBody');

    try {
        showLoading(true);
        const leaderboard = await db.getLeaderboardWithCorrectCount();
        showLoading(false);

        if (!leaderboard || leaderboard.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center">No results yet.</td></tr>';
            return;
        }

        tbody.innerHTML = leaderboard.map((entry, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${entry.first_name} ${entry.last_name}</td>
                <td>${entry.correct_count !== undefined ? entry.correct_count + '/7' : '—'}</td>
            </tr>
        `).join('');

    } catch (error) {
        showLoading(false);
        console.error('Error loading leaderboard:', error);
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">Error loading results. Please refresh.</td></tr>';
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLeaderboard);
} else {
    initLeaderboard();
}
