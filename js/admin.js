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

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
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
        
        const answers = {
            q1: document.querySelector('input[name="answer1"]:checked')?.value,
            q2: document.querySelector('input[name="answer2"]:checked')?.value,
            q3: document.querySelector('input[name="answer3"]:checked')?.value,
            q4: document.querySelector('input[name="answer4"]:checked')?.value,
            q5_feet: parseInt(document.getElementById('answer5Feet').value) || null,
            q5_inches: parseInt(document.getElementById('answer5Inches').value) || null,
            q6: document.querySelector('input[name="answer6"]:checked')?.value,
            q7: parseInt(document.getElementById('answer7').value) || null
        };
        
        console.log('Admin saving answers:', answers);
        
        // Check if at least one answer is provided
        const hasAnyAnswer = Object.values(answers).some(val => val !== null && val !== undefined && val !== '');
        if (!hasAnyAnswer) {
            alert('Please enter at least one answer');
            showLoading(false);
            return;
        }
        
        // Count completed answers
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

async function loadAdminData() {
    try {
        showLoading(true);
        
        // Load correct answers into form
        const correctAnswers = await db.getCorrectAnswers();
        if (correctAnswers) {
            document.querySelector(`input[name="answer1"][value="${correctAnswers.q1}"]`).checked = true;
            document.querySelector(`input[name="answer2"][value="${correctAnswers.q2}"]`).checked = true;
            document.querySelector(`input[name="answer3"][value="${correctAnswers.q3}"]`).checked = true;
            document.querySelector(`input[name="answer4"][value="${correctAnswers.q4}"]`).checked = true;
            document.getElementById('answer5Feet').value = correctAnswers.q5_feet;
            document.getElementById('answer5Inches').value = correctAnswers.q5_inches;
            document.querySelector(`input[name="answer6"][value="${correctAnswers.q6}"]`).checked = true;
            document.getElementById('answer7').value = correctAnswers.q7;
        }
        
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
        const leaderboard = await db.getLeaderboard();
        
        const tbody = document.getElementById('adminLeaderboardBody');
        
        if (leaderboard.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">No scored entries yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = leaderboard.map((entry, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${entry.first_name} ${entry.last_name}</td>
                <td>${entry.score !== null ? '?' : '-'}</td>
                <td>${entry.score !== null ? entry.score + '%' : 'Pending'}</td>
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
