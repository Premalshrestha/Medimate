// Main application logic
class MedimateApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupModals();
        this.populateDashboard();
        this.setupQuickActions();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');

        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetSection = e.target.id.replace('nav-', '') + '-section';
                this.showSection(targetSection);
                
                // Update active nav button
                navButtons.forEach(b => b.classList.remove('text-primary', 'font-semibold'));
                btn.classList.add('text-primary', 'font-semibold');
            });
        });

        // Set default active state
        document.getElementById('nav-dashboard').classList.add('text-primary', 'font-semibold');
    }

    showSection(sectionId) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId.replace('-section', '');
        }
    }

    setupModals() {
        // Emergency modal
        const emergencyBtn = document.getElementById('emergency-btn');
        const emergencyModal = document.getElementById('emergency-modal');
        const closeEmergency = document.getElementById('close-emergency');

        emergencyBtn.addEventListener('click', () => {
            emergencyModal.classList.remove('hidden');
        });

        closeEmergency.addEventListener('click', () => {
            emergencyModal.classList.add('hidden');
        });

        // Family modal
        const addFamilyBtn = document.getElementById('add-family-member');
        const familyModal = document.getElementById('family-modal');
        const closeFamilyModal = document.getElementById('close-family-modal');

        addFamilyBtn.addEventListener('click', () => {
            familyModal.classList.remove('hidden');
        });

        closeFamilyModal.addEventListener('click', () => {
            familyModal.classList.add('hidden');
        });

        // Close modals on outside click
        [emergencyModal, familyModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }

    setupQuickActions() {
        document.getElementById('quick-diagnosis').addEventListener('click', () => {
            this.showSection('diagnosis-section');
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('text-primary', 'font-semibold'));
            document.getElementById('nav-diagnosis').classList.add('text-primary', 'font-semibold');
        });

        document.getElementById('quick-family').addEventListener('click', () => {
            this.showSection('family-section');
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('text-primary', 'font-semibold'));
            document.getElementById('nav-family').classList.add('text-primary', 'font-semibold');
        });

        document.getElementById('quick-consultation').addEventListener('click', () => {
            this.showSection('consultations-section');
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('text-primary', 'font-semibold'));
            document.getElementById('nav-consultations').classList.add('text-primary', 'font-semibold');
        });

        document.getElementById('quick-emergency').addEventListener('click', () => {
            document.getElementById('emergency-modal').classList.remove('hidden');
        });
    }

    populateDashboard() {
        const healthActivity = document.getElementById('health-activity');

        fetch('/mediapp/api/activities/')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const activities = data.activities;
                healthActivity.innerHTML = activities.map(activity => `
                    <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div class="flex-shrink-0">
                            <i class="fas ${activity.icon} ${activity.color} text-xl"></i>
                        </div>
                        <div class="ml-4 flex-1">
                            <h3 class="text-sm font-semibold text-gray-900">${activity.title}</h3>
                            <p class="text-sm text-gray-600">${activity.description}</p>
                            <p class="text-xs text-gray-500 mt-1">${activity.time}</p>
                        </div>
                    </div>
                `).join('');
            })
            .catch(error => console.error("Error fetching activities:", error));
    }
}

// Add CSS for sections
const style = document.createElement('style');
style.textContent = `
    .section {
        display: none;
    }
    .section.active {
        display: block;
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MedimateApp();
});