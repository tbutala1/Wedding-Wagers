// Main application logic

let currentUser = null;
const QUESTIONS = 7;
let currentQuestionIndex = 1;

// Submissions automatically close at 12:00 AM (midnight) Eastern Time as the
// wedding day begins — Sept 5, 2026. September is EDT, so the offset is -04:00.
const SUBMISSION_CUTOFF = new Date('2026-09-05T00:00:00-04:00');

function submissionsClosed() {
    return new Date() >= SUBMISSION_CUTOFF;
}

// Initialize app
async function initApp() {
    // Ensure all screens start hidden
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.add('hidden'));
    
    // Auto-close: once the cutoff has passed, show the closed screen and stop.
    if (submissionsClosed()) {
        showScreen('closedScreen');
        return;
    }

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

    // Backstop in case the page was opened before the cutoff and left idle.
    if (submissionsClosed()) {
        showScreen('closedScreen');
        return;
    }

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    
    // Clear previous errors (safely)
    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    if (firstNameError) firstNameError.textContent = '';
    if (lastNameError) lastNameError.textContent = '';
    
    // Validation
    if (!firstName || !lastName) {
        if (!firstName && firstNameError) firstNameError.textContent = 'First name is required';
        if (!lastName && lastNameError) lastNameError.textContent = 'Last name is required';
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
        console.error('Registration error:', error);
        alert('Registration error: ' + error.message);
    }
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    // Backstop in case the page was opened before the cutoff and left idle.
    if (submissionsClosed()) {
        showScreen('closedScreen');
        return;
    }

    try {
        // Collect answers
        const answers = [];
        let missingFields = [];
        
        // Storage keys (q1..q7) differ from display order; see comments below.
        const q3 = document.querySelector('input[name="q3"]:checked')?.value;   // Q1: neckline
        const q4 = document.querySelector('input[name="q4"]:checked')?.value;   // Q2: first dance
        const q7 = document.getElementById('stevieMentions')?.value;            // Q3: Stevie mentions
        const q5_feet = document.getElementById('heightFeet')?.value;           // Q4: groomsmen height
        const q5_inches = document.getElementById('heightInches')?.value;
        const q2 = document.getElementById('johnCount')?.value;                 // Q5: guests named John
        const q1 = document.querySelector('input[name="q1"]:checked')?.value;   // Q6: outfit change
        const q6 = document.querySelector('input[name="q6"]:checked')?.value;   // Q7: non-signature cocktail

        // Log for debugging
        console.log('Question 1 (neckline):', q3 || 'MISSING');
        console.log('Question 2 (first dance):', q4 || 'MISSING');
        console.log('Question 3 (stevie mentions):', q7 || 'MISSING');
        console.log('Question 4a (height feet):', q5_feet || 'MISSING');
        console.log('Question 4b (height inches):', q5_inches || 'MISSING');
        console.log('Question 5 (guests named John):', q2 || 'MISSING');
        console.log('Question 6 (outfit change):', q1 || 'MISSING');
        console.log('Question 7 (non-signature cocktail):', q6 || 'MISSING');

        // Check each field
        if (!q3) missingFields.push('Question 1 (Neckline)');
        if (!q4) missingFields.push('Question 2 (First dance)');
        if (!q7 && q7 !== '0') missingFields.push('Question 3 (Stevie mentions)');
        if (!q5_feet) missingFields.push('Question 4 (Height - feet)');
        if (!q5_inches && q5_inches !== '0') missingFields.push('Question 4 (Height - inches)');
        if (!q2 && q2 !== '0') missingFields.push('Question 5 (Guests named John)');
        if (!q1) missingFields.push('Question 6 (Outfit change)');
        if (!q6) missingFields.push('Question 7 (Non-signature cocktail)');
        
        if (missingFields.length > 0) {
            console.error('Missing fields:', missingFields);
            alert('Please answer all questions:\n\n' + missingFields.join('\n'));
            return;
        }
        
        showLoading(true);
        
        const submissionAnswers = {
            q1: q1,                     // outfit change (Yes/No)
            q2: parseInt(q2),           // guests named John (count)
            q3: q3,                     // neckline
            q4: q4,                     // first dance duration
            q5_feet: parseInt(q5_feet), // groomsmen height
            q5_inches: parseInt(q5_inches),
            q6: q6,                     // non-signature cocktail
            q7: parseInt(q7)            // Stevie mentions
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
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        // Show full progress since all questions are visible at once
        const percentage = 100;
        progressFill.style.width = percentage + '%';
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
