document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signup-form');
    const firstName = document.getElementById('first-name');
    const lastName = document.getElementById('last-name');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');

    // Username validation
    username.addEventListener('input', function () {
        const value = this.value;
        const invalidChars = /[^a-zA-Z0-9_-]/;
        if (invalidChars.test(value)) {
            this.setCustomValidity('Username can only contain letters, numbers, underscore (_) and hyphen (-)');
        } else {
            this.setCustomValidity('');
        }
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const recaptchaToken = grecaptcha.getResponse();
        if (!recaptchaToken) {
            showMessage('Please complete the reCAPTCHA.', 'error');
            return;
        }
        const signupBtn = document.getElementById('signup-btn');
        const signupBtnText = document.getElementById('signup-btn-text');
        const signupBtnSpinner = document.getElementById('signup-btn-spinner');

        signupBtn.disabled = true;
        signupBtnSpinner.classList.remove('hidden');
        signupBtnText.textContent = 'Creating...';

        const invalidChars = /[^a-zA-Z0-9_-]/;
        if (invalidChars.test(username.value)) {
            showMessage('Username can only contain letters, numbers, underscore (_) and hyphen (-)', 'error');
            username.focus();
            signupBtn.disabled = false;
            signupBtnSpinner.classList.add('hidden');
            signupBtnText.textContent = 'Create Account';
            return;
        }

        if (password.value !== confirmPassword.value) {
            showMessage('Passwords do not match!', 'error');
            confirmPassword.focus();
            signupBtn.disabled = false;
            signupBtnSpinner.classList.add('hidden');
            signupBtnText.textContent = 'Create Account';
            return;
        }

        const formData = {
            first_name: firstName.value,
            last_name: lastName.value,
            username: username.value,
            email: email.value,
            password: password.value,
            'g-recaptcha-response': recaptchaToken,
        };

        try {
            const response = await fetch('/api/auth/sign-up/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (response.ok) {
                showVerificationSection(email.value);
                showMessage('Account created successfully! Please check your email for verification.', 'success');
            } else {
                showMessage(result.message, 'error');
                grecaptcha.reset();
            }
        } catch (error) {
            showMessage('Failed to create account. Please try again.', 'error');
        } finally {
            signupBtn.disabled = false;
            signupBtnSpinner.classList.add('hidden');
            signupBtnText.textContent = 'Create Account';
        }
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
        }

        messageText.textContent = message;

        if (type === 'success') {
            setTimeout(() => {
                messageBox.classList.add('hidden');
            }, 5000);
        }
    }

    function showVerificationSection(userEmail) {
        document.querySelector('.form-container').style.display = 'none';
        document.getElementById('user-email').textContent = userEmail;
        document.getElementById('verification-section').classList.remove('hidden');
        window.userEmail = userEmail;
    }

    document.getElementById('open-gmail-btn').addEventListener('click', function () {
        window.open('https://mail.google.com', '_blank');
    });

    let resendTimer = null;

    function showResendMessage(message, type) {
        const resendMessage = document.getElementById('resend-message');
        const resendMessageText = document.getElementById('resend-message-text');

        resendMessage.classList.remove('hidden', 'text-green-600', 'text-red-600', 'text-blue-600', 'dark:text-green-400', 'dark:text-red-400', 'dark:text-blue-400');

        if (type === 'success') {
            resendMessage.classList.add('text-green-600', 'dark:text-green-400');
        } else if (type === 'error') {
            resendMessage.classList.add('text-red-600', 'dark:text-red-400');
        } else {
            resendMessage.classList.add('text-blue-600', 'dark:text-blue-400');
        }

        resendMessageText.textContent = message;
    }

    function hideResendMessage() {
        document.getElementById('resend-message').classList.add('hidden');
    }

    function startResendTimer() {
        const resendBtn = document.getElementById('resend-btn');
        const resendText = document.getElementById('resend-text');
        let timeLeft = 60;

        resendBtn.disabled = true;
        showResendMessage(`Please wait ${timeLeft} seconds before resending`, 'info');

        resendTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                resendText.textContent = `Wait ${timeLeft}s`;
                showResendMessage(`Please wait ${timeLeft} seconds before resending`, 'info');
            } else {
                clearInterval(resendTimer);
                resendBtn.disabled = false;
                resendText.textContent = 'Resend verification email';
                hideResendMessage();
            }
        }, 1000);
    }

    document.getElementById('resend-btn').addEventListener('click', async function () {
        const resendBtn = this;
        const resendText = document.getElementById('resend-text');
        const resendIcon = document.getElementById('resend-icon');
        const resendSpinner = document.getElementById('resend-spinner');

        resendBtn.disabled = true;
        resendIcon.classList.add('hidden');
        resendSpinner.classList.remove('hidden');
        resendText.textContent = 'Sending...';

        try {
            const response = await fetch('/api/auth/resend-email-verification-link/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    email: window.userEmail
                })
            });

            const result = await response.json();

            if (response.ok) {
                showResendMessage('Verification email sent successfully!', 'success');
                setTimeout(() => startResendTimer(), 2000);
            } else {
                showResendMessage(result.message || 'Failed to resend email. Please try again.', 'error');
                resendBtn.disabled = false;
                resendText.textContent = 'Resend verification email';
            }
        } catch (error) {
            showResendMessage('Failed to resend email. Please try again.', 'error');
            resendBtn.disabled = false;
            resendText.textContent = 'Resend verification email';
        } finally {
            resendIcon.classList.remove('hidden');
            resendSpinner.classList.add('hidden');
        }
    });
});