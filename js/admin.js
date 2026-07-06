// Admin dashboard functionality

let isLoggedIn = false;

async function initAdmin() {
    // Ensure all screens start hidden
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.add('hidden'));
    
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('answersForm').addEventListener('submit', handleSaveAnswers);
    
    // Check if already logged in (session storage)
    if (sessionStorage.getItem('adminLoggedIn')) {
        isLoggedIn = true;
        showAdminDashboard();
        await loadAdminData();
    } else {
        // Show login screen
        document.getElementById('loginScreen').classList.remove('hidden');
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        sessionStorage.setItem('adminLoggedIn', 'true');
        document.getElementById('passwordError').textContent = '';
        document.getElementById('loginForm').reset();
        showAdminDashboard();
        loadAdminData();
    } else {
        document.getElementById('passwordError').textContent = 'Invalid password';
    }
}

function logout() {
    isLoggedIn = false;
    sessionStorage.removeItem('adminLoggedIn');
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('loginForm').reset();
}

function showAdminDashboard() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
}

function switchTab(tabName, evt) {
    // Hide all tabs (both 'active' and 'hidden' are toggled; '.hidden' uses !important
    // so it must be removed for the selected tab to actually show)
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.add('hidden');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    const target = document.getElementById(tabName + 'Tab');
    target.classList.add('active');
    target.classList.remove('hidden');
    if (evt && evt.target) evt.target.classList.add('active');

    // Load tab-specific data
    if (tabName === 'users') {
        loadUsers();
    } else if (tabName === 'leaderboard') {
        loadLeaderboardPreview();
    }
}

async function handleSaveAnswers(e) {
    e.preventDefault();
    
    try {
        showLoading(true);
        
        const johnValue = document.getElementById('answerJohn').value;
        const answers = {
            q1: document.querySelector('input[name="answer1"]:checked')?.value,   // outfit change
            // guests named John: stored as a string to fit the VARCHAR(10) column; scoring parses it
            q2: johnValue === '' ? null : johnValue,
            q3: document.querySelector('input[name="answer3"]:checked')?.value,   // neckline
            q4: document.querySelector('input[name="answer4"]:checked')?.value,   // first dance
            q5_feet: parseInt(document.getElementById('answer5Feet').value) || null,
            q5_inches: parseInt(document.getElementById('answer5Inches').value) || null,
            q6: document.querySelector('input[name="answer6"]:checked')?.value,   // non-signature cocktail
            q7: parseInt(document.getElementById('answer7').value) || null        // Stevie mentions
        };
        
        console.log('Admin saving answers:', answers);

        // Count completed answers (saving with none filled in is allowed — use Clear
        // to wipe everything; a partial save only updates the fields you provide)
        const completedCount = Object.values(answers).filter(val => val !== null && val !== undefined && val !== '').length;
        console.log(`Saving ${completedCount} answers...`);
        
        await db.saveCorrectAnswers(answers);
        console.log('Answers saved, now calculating scores...');
        
        // Recalculate scores (only for questions that are complete)
        await db.calculateScores();
        console.log('Scores calculated');
        
        showLoading(false);
        alert(`✅ Saved! ${completedCount} question(s) answered.\nYou can update more answers later as you learn them.`);
        
        // Refresh all data
        loadAdminData();
        
    } catch (error) {
        showLoading(false);
        console.error('Error saving answers:', error);
        alert('Error saving answers: ' + error.message);
    }
}

// Reset the on-screen answers form only (no backend changes)
function resetAnswersForm() {
    document.getElementById('answersForm').reset();
}

// Clear ALL saved correct answers on the backend and reset the leaderboard.
// Wipes every question in the correct_answers table, then recalculates scores
// (which become null since nothing is answered) so both leaderboards update.
async function clearAnswers() {
    if (!confirm('Clear all saved correct answers? This wipes them on the backend and resets the leaderboard for everyone.')) {
        return;
    }

    try {
        showLoading(true);

        resetAnswersForm();
        await db.clearCorrectAnswers();
        await db.calculateScores();

        showLoading(false);
        alert('✅ All correct answers cleared. The leaderboard has been reset.');

        // Refresh users + leaderboard preview
        loadAdminData();

    } catch (error) {
        showLoading(false);
        console.error('Error clearing answers:', error);
        alert('Error clearing answers: ' + error.message);
    }
}

async function loadAdminData() {
    try {
        showLoading(true);

        // The answers form always starts blank (blank slate). Saving performs a
        // partial update, so leaving a question blank never overwrites what's already
        // stored — the admin only fills in answers as they become known.
        resetAnswersForm();

        await loadUsers();
        await loadLeaderboardPreview();

        showLoading(false);

    } catch (error) {
        showLoading(false);
        console.error('Error loading admin data:', error);
    }
}

async function loadUsers() {
    try {
        const responses = await db.getAllResponses();
        
        const tbody = document.getElementById('usersTableBody');
        
        if (responses.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center">No users yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = responses.map(response => `
            <tr>
                <td>${response.first_name} ${response.last_name}</td>
                <td>${new Date(response.submitted_at).toLocaleString()}</td>
                <td>
                    <button onclick="deleteUser('${response.id}')" class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.9em;">Delete</button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
        showLoading(true);
        await db.deleteResponse(id);
        showLoading(false);
        alert('User entry deleted successfully');
        await loadUsers();
    } catch (error) {
        showLoading(false);
        alert('Error deleting user: ' + error.message);
    }
}

async function loadLeaderboardPreview() {
    try {
        const leaderboard = await db.getLeaderboardWithCorrectCount();
        
        const tbody = document.getElementById('adminLeaderboardBody');
        
        if (leaderboard.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center">No entries yet</td></tr>';
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
        console.error('Error loading leaderboard preview:', error);
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
    document.addEventListener('DOMContentLoaded', initAdmin);
} else {
    initAdmin();
}
