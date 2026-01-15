document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('reset-form');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');
    const messageBox = document.getElementById('message-box');
    const successSection = document.getElementById('success-section');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        if (!email) {
            showMessage('Please enter your email address', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitSpinner.classList.remove('hidden');
        submitText.textContent = 'Sending...';
        hideMessage();

        try {
            const response = await fetch('/api/auth/get-password-reset-link/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({ email: email })
            });

            const result = await response.json();

            if (response.ok) {
                showSuccessSection(email);
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Failed to send reset email. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitSpinner.classList.add('hidden');
            submitText.textContent = 'Send Reset Link';
        }
    });

    function showMessage(message, type) {
        const messageIcon = document.getElementById('message-icon');
        const messageText = document.getElementById('message-text');

        messageBox.classList.remove('hidden', 'bg-red-50', 'bg-green-50', 'border-red-200', 'border-green-200', 'dark:bg-red-900/20', 'dark:bg-green-900/20', 'dark:border-red-800', 'dark:border-green-800');
        messageText.classList.remove('text-red-800', 'text-green-800', 'dark:text-red-400', 'dark:text-green-400');

        if (type === 'success') {
            messageBox.classList.add('bg-green-50', 'border-green-200', 'dark:bg-green-900/20', 'dark:border-green-800');
            messageText.classList.add('text-green-800', 'dark:text-green-400');
            messageIcon.innerHTML = '<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>';
        } else {
            messageBox.classList.add('bg-red-50', 'border-red-200', 'dark:bg-red-900/20', 'dark:border-red-800');
            messageText.classList.add('text-red-800', 'dark:text-red-400');
            messageIcon.innerHTML = '<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>';
        }

        messageText.textContent = message;
    }

    function hideMessage() {
        messageBox.classList.add('hidden');
    }

    function showSuccessSection(email) {
        document.querySelector('.form-container').style.display = 'none';
        document.getElementById('sent-email').textContent = email;
        successSection.classList.remove('hidden');
    }

    document.getElementById('open-gmail-btn').addEventListener('click', function () {
        window.open('https://mail.google.com', '_blank');
    });

    document.getElementById('send-another-btn').addEventListener('click', function () {
        successSection.classList.add('hidden');
        document.querySelector('.form-container').style.display = 'block';
        emailInput.value = '';
        hideMessage();
    });
});