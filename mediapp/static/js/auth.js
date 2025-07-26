
console.log('auth.js loaded!');

class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.checkExistingSession();
        this.setupEventListeners();
    }

    checkExistingSession() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            console.log("User is already logged in:", JSON.parse(user));
        } else {
            console.log("No active session found.");
        }
    }

    setupEventListeners() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(new FormData(loginForm));
            });
        }

        const togglePassword = document.getElementById('toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const passwordInput = document.getElementById('password');
                const icon = togglePassword.querySelector('i');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        }

        const signupLink = document.getElementById('signup-link');
        const signupModal = document.getElementById('signup-modal');
        const closeSignup = document.getElementById('close-signup');
        const signupForm = document.getElementById('signup-form');

        if (signupLink && signupModal) {
            signupLink.addEventListener('click', (e) => {
                e.preventDefault();
                signupModal.classList.remove('hidden');
            });
        }

        if (closeSignup && signupModal) {
            closeSignup.addEventListener('click', () => {
                signupModal.classList.add('hidden');
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup(new FormData(signupForm));
            });
        }

        if (signupModal) {
            signupModal.addEventListener('click', (e) => {
                if (e.target === signupModal) {
                    signupModal.classList.add('hidden');
                }
            });
        }
    }

    async handleLogin(formData) {
        const email = formData.get('email');
        const password = formData.get('password');
        const submitBtn = document.querySelector('#login-form button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing In...';
        submitBtn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (email && password) {
                const user = {
                    id: Date.now(),
                    email: email,
                    firstName: 'John',
                    lastName: 'Doe',
                    phone: '+1 (555) 123-4567',
                    dateOfBirth: '1988-05-15',
                    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
                    bloodType: 'O+',
                    emergencyContact: {
                        name: 'Jane Doe',
                        relationship: 'Spouse',
                        phone: '+1 (555) 123-4568'
                    },
                    medicalInfo: {
                        allergies: ['Peanuts', 'Shellfish'],
                        medications: ['Lisinopril 10mg', 'Metformin 500mg'],
                        conditions: ['Hypertension', 'Type 2 Diabetes'],
                        insuranceProvider: 'Blue Cross Blue Shield',
                        insuranceId: 'BC123456789'
                    },
                    preferences: {
                        language: 'English',
                        notifications: true,
                        dataSharing: false
                    },
                    loginTime: new Date().toISOString()
                };

                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = '/home_page/';
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            this.showError('Invalid email or password. Please try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleSignup(formData) {
        const data = {
            first_name: formData.get("firstName"),
            last_name: formData.get("lastName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            password: formData.get("password"),
            date_of_birth: formData.get("dateOfBirth"),
            username: formData.get("email")
        };

        fetch("/signup/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                alert("Signup successful!");
                document.getElementById("signup-modal").classList.add("hidden");
                location.reload();
            } else {
                return response.json().then(err => {
                    alert("Signup failed: " + err.error);
                });
            }
        });
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateUser(userData) {
        if (this.currentUser) {
            this.currentUser = { ...this.currentUser, ...userData };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(errorDiv);
        setTimeout(() => {
            errorDiv.classList.remove('translate-x-full');
        }, 100);
        setTimeout(() => {
            errorDiv.classList.add('translate-x-full');
            setTimeout(() => {
                errorDiv.remove();
            }, 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie) {
        document.cookie.split(';').forEach(cookie => {
            cookie = cookie.trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.slice(name.length + 1));
            }
        });
    }
    return cookieValue;
}
