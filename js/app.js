// Main application logic

let currentUser = null;
const QUESTIONS = 7;
let currentQuestionIndex = 1;

// Initialize app
async function initApp() {
    // Show registration screen by default
    showScreen('registrationScreen');
    
    // Set up event listeners
    document.getElementById('registrationForm').addEventListener('submit', handleRegistration);
    document.getElementById('questionsForm').addEventListener('submit', handleSubmit);
}

// Show/hide screens
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

// Handle registration
async function handleRegistration(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    
    // Clear previous errors
    document.getElementById('firstNameError').textContent = '';
    document.getElementById('lastNameError').textContent = '';
    
    // Validation
    if (!firstName || !lastName) {
        if (!firstName) document.getElementById('firstNameError').textContent = 'First name is required';
        if (!lastName) document.getElementById('lastNameError').textContent = 'Last name is required';
        return;
    }
    
    try {
        showLoading(true);
        
        // Check for duplicates
        const userExists = await db.userExists(firstName, lastName);
        if (userExists) {
            alert(`${firstName} ${lastName} has already participated. Please enter a different name or contact the admin.`);
            showLoading(false);
            return;
        }
        
        currentUser = { firstName, lastName };
        showLoading(false);
        
        // Show questions screen
        showScreen('questionsScreen');
        updateProgress();
        
        // Reset form
        document.getElementById('registrationForm').reset();
        
    } catch (error) {
        showLoading(false);
        alert('Error checking name: ' + error.message);
    }
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();
    
    try {
        showLoading(true);
        
        // Collect answers
        const answers = {
            q1: document.querySelector('input[name="q1"]:checked')?.value,
            q2: document.querySelector('input[name="q2"]:checked')?.value,
            q3: document.querySelector('input[name="q3"]:checked')?.value,
            q4: document.querySelector('input[name="q4"]:checked')?.value,
            q5_feet: parseInt(document.getElementById('heightFeet').value),
            q5_inches: parseInt(document.getElementById('heightInches').value),
            q6: document.querySelector('input[name="q6"]:checked')?.value,
            q7: parseInt(document.getElementById('stevieMentions').value)
        };
        
        // Validate all questions answered
        if (!Object.values(answers).every(val => val !== null && val !== undefined && val !== '' && !isNaN(val))) {
            alert('Please answer all questions before submitting');
            showLoading(false);
            return;
        }
        
        // Submit to database
        const response = await db.submitResponse(currentUser.firstName, currentUser.lastName, answers);
        
        showLoading(false);
        
        // Show success screen with leaderboard link
        showScreen('successScreen');
        
        // Reset form
        document.getElementById('questionsForm').reset();
        currentQuestionIndex = 1;
        
    } catch (error) {
        showLoading(false);
        alert('Error submitting predictions: ' + error.message);
    }
}

// Show loading indicator
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

// Update progress bar
function updateProgress() {
    // Show full progress since all questions are visible at once
    const percentage = 100;
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('currentQuestion').textContent = QUESTIONS;
    document.getElementById('totalQuestions').textContent = QUESTIONS;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
