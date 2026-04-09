// Main application logic

let currentUser = null;
const QUESTIONS = 7;
let currentQuestionIndex = 1;

// Initialize app
async function initApp() {
    // Ensure all screens start hidden
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.add('hidden'));
    
    // Show registration screen by default
    showScreen('registrationScreen');
    
    // Set up event listeners
    document.getElementById('registrationForm').addEventListener('submit', handleRegistration);
    document.getElementById('questionsForm').addEventListener('submit', handleSubmit);
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
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
        // Collect answers
        const answers = [];
        let missingFields = [];
        
        const q1 = document.querySelector('input[name="q1"]:checked')?.value;
        const q2 = document.querySelector('input[name="q2"]:checked')?.value;
        const q3 = document.querySelector('input[name="q3"]:checked')?.value;
        const q4 = document.querySelector('input[name="q4"]:checked')?.value;
        const q5_feet = document.getElementById('heightFeet')?.value;
        const q5_inches = document.getElementById('heightInches')?.value;
        const q6 = document.querySelector('input[name="q6"]:checked')?.value;
        const q7 = document.getElementById('stevieMentions')?.value;
        
        // Log for debugging
        console.log('Question 1 (rain):', q1 || 'MISSING');
        console.log('Question 2 (tim cry):', q2 || 'MISSING');
        console.log('Question 3 (neckline):', q3 || 'MISSING');
        console.log('Question 4 (first dance):', q4 || 'MISSING');
        console.log('Question 5a (height feet):', q5_feet || 'MISSING');
        console.log('Question 5b (height inches):', q5_inches || 'MISSING');
        console.log('Question 6 (best man speech):', q6 || 'MISSING');
        console.log('Question 7 (stevie mentions):', q7 || 'MISSING');
        
        // Check each field
        if (!q1) missingFields.push('Question 1 (rain)');
        if (!q2) missingFields.push('Question 2 (Tim crying)');
        if (!q3) missingFields.push('Question 3 (Neckline)');
        if (!q4) missingFields.push('Question 4 (First dance)');
        if (!q5_feet) missingFields.push('Question 5 (Height - feet)');
        if (!q5_inches && q5_inches !== '0') missingFields.push('Question 5 (Height - inches)');
        if (!q6) missingFields.push('Question 6 (Best man speech)');
        if (!q7 && q7 !== '0') missingFields.push('Question 7 (Stevie mentions)');
        
        if (missingFields.length > 0) {
            console.error('Missing fields:', missingFields);
            alert('Please answer all questions:\n\n' + missingFields.join('\n'));
            return;
        }
        
        showLoading(true);
        
        const submissionAnswers = {
            q1: q1,
            q2: q2,
            q3: q3,
            q4: q4,
            q5_feet: parseInt(q5_feet),
            q5_inches: parseInt(q5_inches),
            q6: q6,
            q7: parseInt(q7)
        };
        
        console.log('Submitting:', submissionAnswers);
        
        // Submit to database
        const response = await db.submitResponse(currentUser.firstName, currentUser.lastName, submissionAnswers);
        
        showLoading(false);
        
        // Show success screen with leaderboard link
        showScreen('successScreen');
        
        // Reset form
        document.getElementById('questionsForm').reset();
        currentQuestionIndex = 1;
        
    } catch (error) {
        showLoading(false);
        console.error('Submission error:', error);
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
