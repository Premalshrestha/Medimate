// Profile management functionality
class ProfileManager {
    constructor() {
        this.isEditing = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserProfile();
    }

    setupEventListeners() {
        // Profile dropdown
        const profileBtn = document.getElementById('profile-btn');
        const profileDropdown = document.getElementById('profile-dropdown');
        
        if (profileBtn && profileDropdown) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('hidden');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                profileDropdown.classList.add('hidden');
            });
        }

        // Profile modal triggers
        const viewProfileBtns = [
            document.getElementById('view-profile'),
            document.getElementById('view-full-profile')
        ];

        viewProfileBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this.showProfileModal();
                    if (profileDropdown) profileDropdown.classList.add('hidden');
                });
            }
        });

        // Edit profile button
        const editProfileBtn = document.getElementById('edit-profile');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                this.showProfileModal();
                this.toggleEditMode(true);
                if (profileDropdown) profileDropdown.classList.add('hidden');
            });
        }

        // Modal controls
        const closeProfileModal = document.getElementById('close-profile-modal');
        const profileModal = document.getElementById('profile-modal');

        if (closeProfileModal && profileModal) {
            closeProfileModal.addEventListener('click', () => {
                profileModal.classList.add('hidden');
                this.toggleEditMode(false);
            });

            profileModal.addEventListener('click', (e) => {
                if (e.target === profileModal) {
                    profileModal.classList.add('hidden');
                    this.toggleEditMode(false);
                }
            });
        }

        // Edit mode controls
        const editProfileModalBtn = document.getElementById('edit-profile-btn');
        const saveProfileBtn = document.getElementById('save-profile-btn');
        const cancelEditBtn = document.getElementById('cancel-edit-btn');

        if (editProfileModalBtn) {
            editProfileModalBtn.addEventListener('click', () => {
                this.toggleEditMode(true);
            });
        }

        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => {
                this.saveProfile();
            });
        }

        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => {
                this.toggleEditMode(false);
                this.loadUserProfile(); // Reload original data
            });
        }

// Logout
logoutBtn.addEventListener('click', () => {
    console.log("Logout button clicked");  // Check if this prints
    if (window.authManager) {
        console.log("Logging out...");  // Check if this prints
        window.authManager.logout();
    } else {
        console.log("authManager not defined.");
    }
});

        // Settings
        const settingsBtn = document.getElementById('settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showNotification('Settings feature coming soon!', 'info');
                if (profileDropdown) profileDropdown.classList.add('hidden');
            });
        }
    }

async loadUserProfile() {

    try {
        const response = await fetch('/api/get-profile/', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include'  // ← Important for session auth
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const user = await response.json();
        console.log("Loaded user profile:", user);
        window.authManager = {
            getCurrentUser: () => user,
            updateUser: (newData) => Object.assign(user, newData)
        };
        this.populateProfileModal(user);

        // Update dashboard UI
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const dashboardName = document.getElementById('dashboard-name');
        const dashboardEmail = document.getElementById('dashboard-email');
        const dashboardAvatar = document.getElementById('dashboard-avatar');
        const dashboardAge = document.getElementById('dashboard-age');

        if (userAvatar) userAvatar.src = user.avatar || '';
        if (userName) userName.textContent = user.firstName;
        if (dashboardName) dashboardName.textContent = `${user.firstName} ${user.lastName}`;
        if (dashboardEmail) dashboardEmail.textContent = user.email;
        if (dashboardAvatar) dashboardAvatar.src = user.avatar || '';
        if (dashboardAge && user.dateOfBirth) {
            const age = this.calculateAge(user.dateOfBirth);
            dashboardAge.textContent = `Age: ${age}`;
        }

    } catch (err) {
        console.error('Profile load error:', err);
        this.showNotification('Could not load profile data', 'error');
    }
}

    populateProfileModal(user) {
        // Basic info
        const profileAvatar = document.getElementById('profile-avatar');
        const profileFullName = document.getElementById('profile-full-name');
        const profileEmailDisplay = document.getElementById('profile-email-display');
        const memberSince = document.getElementById('member-since');
        const lastLogin = document.getElementById('last-login');

        if (profileAvatar) profileAvatar.src = user.avatar;
        if (profileFullName) profileFullName.textContent = `${user.firstName} ${user.lastName}`;
        if (profileEmailDisplay) profileEmailDisplay.textContent = user.email;
        if (memberSince) memberSince.textContent = new Date(user.loginTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (lastLogin) lastLogin.textContent = this.formatLastLogin(user.loginTime);

        // Form fields
        const editFirstName = document.getElementById('edit-first-name');
        const editLastName = document.getElementById('edit-last-name');
        const editEmail = document.getElementById('edit-email');
        const editPhone = document.getElementById('edit-phone');
        const editDob = document.getElementById('edit-dob');
        const editBloodType = document.getElementById('edit-blood-type');

        if (editFirstName) editFirstName.value = user.firstName || '';
        if (editLastName) editLastName.value = user.lastName || '';
        if (editEmail) editEmail.value = user.email || '';
        if (editPhone) editPhone.value = user.phone || '';
        if (editDob) editDob.value = user.dateOfBirth || '';
        if (editBloodType) editBloodType.value = user.bloodType || '';

        // Emergency contact
        const emergencyName = document.getElementById('emergency-name');
        const emergencyRelationship = document.getElementById('emergency-relationship');
        const emergencyPhone = document.getElementById('emergency-phone');

        if (emergencyName) emergencyName.value = user.emergencyContact?.name || '';
        if (emergencyRelationship) emergencyRelationship.value = user.emergencyContact?.relationship || '';
        if (emergencyPhone) emergencyPhone.value = user.emergencyContact?.phone || '';

        // Medical info
        this.populateAllergies(user.medicalInfo?.allergies || []);
        this.populateMedications(user.medicalInfo?.medications || []);
        this.populateConditions(user.medicalInfo?.conditions || []);
    }

    populateAllergies(allergies) {
        const container = document.getElementById('allergies-list');
        if (!container) return;

        container.innerHTML = allergies.map(allergy => `
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                ${allergy}
                <button type="button" class="ml-2 text-red-600 hover:text-red-800" onclick="profileManager.removeAllergy('${allergy}')">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </span>
        `).join('');
    }

    populateMedications(medications) {
        const container = document.getElementById('medications-list');
        if (!container) return;

        container.innerHTML = medications.map(medication => `
            <div class="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span class="text-sm">${medication}</span>
                <button type="button" class="text-red-600 hover:text-red-800" onclick="profileManager.removeMedication('${medication}')">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        `).join('');
    }

    populateConditions(conditions) {
        const container = document.getElementById('conditions-list');
        if (!container) return;

        container.innerHTML = conditions.map(condition => `
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                ${condition}
                <button type="button" class="ml-2 text-yellow-600 hover:text-yellow-800" onclick="profileManager.removeCondition('${condition}')">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </span>
        `).join('');
    }

    showProfileModal() {
        const modal = document.getElementById('profile-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.loadUserProfile(); // Refresh data
        }
    }

    toggleEditMode(enable) {
        this.isEditing = enable;
        
        const editBtn = document.getElementById('edit-profile-btn');
        const saveBtn = document.getElementById('save-profile-btn');
        const cancelBtn = document.getElementById('cancel-edit-btn');

        const inputs = document.querySelectorAll('#profile-modal input, #profile-modal select');

        if (enable) {
            // Show save/cancel buttons, hide edit button
            if (editBtn) editBtn.classList.add('hidden');
            if (saveBtn) saveBtn.classList.remove('hidden');
            if (cancelBtn) cancelBtn.classList.remove('hidden');

            // Enable inputs
            inputs.forEach(input => {
                input.removeAttribute('readonly');
                input.removeAttribute('disabled');
                input.classList.remove('bg-gray-100');
            });
        } else {
            // Show edit button, hide save/cancel buttons
            if (editBtn) editBtn.classList.remove('hidden');
            if (saveBtn) saveBtn.classList.add('hidden');
            if (cancelBtn) cancelBtn.classList.add('hidden');

            // Disable inputs
            inputs.forEach(input => {
                if (input.type === 'select-one') {
                    input.setAttribute('disabled', 'disabled');
                } else {
                    input.setAttribute('readonly', 'readonly');
                }
                input.classList.add('bg-gray-100');
            });
        }
    }

    async saveProfile() {
        const user = window.authManager?.getCurrentUser();
        if (!user) return;

        // Show loading state
        const saveBtn = document.getElementById('save-profile-btn');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
        saveBtn.disabled = true;

        try {
            // Collect form data
            const updatedUser = {
                ...user,
                firstName: document.getElementById('edit-first-name').value,
                lastName: document.getElementById('edit-last-name').value,
                email: document.getElementById('edit-email').value,
                phone: document.getElementById('edit-phone').value,
                dateOfBirth: document.getElementById('edit-dob').value,
                bloodType: document.getElementById('edit-blood-type').value,
                emergencyContact: {
                    name: document.getElementById('emergency-name').value,
                    relationship: document.getElementById('emergency-relationship').value,
                    phone: document.getElementById('emergency-phone').value
                }
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update user data
            window.authManager.updateUser(updatedUser);
            
            // Refresh UI
            this.loadUserProfile();
            this.toggleEditMode(false);
            
            this.showNotification('Profile updated successfully!', 'success');

        } catch (error) {
            this.showNotification('Failed to update profile. Please try again.', 'error');
        } finally {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }
    }

    removeAllergy(allergy) {
        if (!this.isEditing) return;
        
        const user = window.authManager?.getCurrentUser();
        if (user && user.medicalInfo) {
            user.medicalInfo.allergies = user.medicalInfo.allergies.filter(a => a !== allergy);
            this.populateAllergies(user.medicalInfo.allergies);
        }
    }

    removeMedication(medication) {
        if (!this.isEditing) return;
        
        const user = window.authManager?.getCurrentUser();
        if (user && user.medicalInfo) {
            user.medicalInfo.medications = user.medicalInfo.medications.filter(m => m !== medication);
            this.populateMedications(user.medicalInfo.medications);
        }
    }

    removeCondition(condition) {
        if (!this.isEditing) return;
        
        const user = window.authManager?.getCurrentUser();
        if (user && user.medicalInfo) {
            user.medicalInfo.conditions = user.medicalInfo.conditions.filter(c => c !== condition);
            this.populateConditions(user.medicalInfo.conditions);
        }
    }

    calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    formatLastLogin(loginTime) {
        const now = new Date();
        const login = new Date(loginTime);
        const diffTime = Math.abs(now - login);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Today';
        } else if (diffDays === 2) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return login.toLocaleDateString();
        }
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500'
        };

        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});