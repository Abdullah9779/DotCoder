document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signin-form');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const recaptchaToken = grecaptcha.getResponse();
        if (!recaptchaToken) {
            showMessage('Please complete the reCAPTCHA.', 'error');
            return;
        }
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = form.elements['remember'].checked;
        const signinBtn = document.getElementById('signin-btn');
        const signinBtnText = document.getElementById('signin-btn-text');
        const signinBtnSpinner = document.getElementById('signin-btn-spinner');
        if (!email || !password) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        signinBtn.disabled = true;
        signinBtnSpinner.classList.remove('hidden');
        signinBtnText.textContent = 'Signing In...';


        fetch('/api/auth/sign-in/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ email, password, remember, 'g-recaptcha-response': recaptchaToken })
        })
            .then(response => {
                return response.json().then(data => ({ data, success: response.ok }));
            })
            .then(({ data, success }) => {
                if (success) {
                    showMessage('Sign in successful! Redirecting to dashboard...', 'success');
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1500);
                } else {
                    showMessage(data.message || 'Sign in failed. Please try again.', 'error');
                    grecaptcha.reset();
                }
            })
            .catch(error => {
                showMessage('Failed to sign in. Please try again.', 'error');
            })
            .finally(() => {
                signinBtn.disabled = false;
                signinBtnSpinner.classList.add('hidden');
                signinBtnText.textContent = 'Sign In';
            });
    });

    function showMessage(message, type) {
        const messageBox = document.getElementById('message-box');
        const messageIcon = document.getElementById('message-icon');
        const messageText = document.getElementById('message-text');

        messageBox.classList.remove('hidden', 'bg-red-50', 'bg-green-50', 'bg-blue-50', 'border-red-200', 'border-green-200', 'border-blue-200', 'dark:bg-red-900/20', 'dark:bg-green-900/20', 'dark:bg-blue-900/20', 'dark:border-red-800', 'dark:border-green-800', 'dark:border-blue-800');
        messageText.classList.remove('text-red-800', 'text-green-800', 'text-blue-800', 'dark:text-red-400', 'dark:text-green-400', 'dark:text-blue-400');

        if (type === 'success') {
            messageBox.classList.add('bg-green-50', 'border-green-200', 'dark:bg-green-900/20', 'dark:border-green-800');
            messageText.classList.add('text-green-800', 'dark:text-green-400');
            messageIcon.innerHTML = '<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>';
        } else if (type === 'error') {
            messageBox.classList.add('bg-red-50', 'border-red-200', 'dark:bg-red-900/20', 'dark:border-red-800');
            messageText.classList.add('text-red-800', 'dark:text-red-400');
            messageIcon.innerHTML = '<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>';
        } else {
            messageBox.classList.add('bg-blue-50', 'border-blue-200', 'dark:bg-blue-900/20', 'dark:border-blue-800');
            messageText.classList.add('text-blue-800', 'dark:text-blue-400');
            messageIcon.innerHTML = '<svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>';
        }

        messageText.textContent = message;

        if (type === 'success') {
            setTimeout(() => {
                messageBox.classList.add('hidden');
            }, 5000);
        }
    }
});