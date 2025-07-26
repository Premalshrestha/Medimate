// Family health management


class FamilyHealthManager {
    constructor() {
        this.familyMembers = [];
        this.init();
    }
getCSRFToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        if (cookie.trim().startsWith(name + '=')) {
            return decodeURIComponent(cookie.trim().substring(name.length + 1));
        }
    }
    return '';
}
    init() {
        // this.loadFamilyData();
        this.renderFamilyMembers();
        this.setupFamilyForm();
        this.loadMembersFromAPI(); 
    }

    loadFamilyData() {
        // Load from localStorage or use default data
        const savedData = localStorage.getItem('familyMembers');
        if (savedData) {
            this.familyMembers = JSON.parse(savedData);
        } else {
            // Default family members for demonstration
            this.familyMembers = [
                {
                    id: 1,
                    name: 'John Doe',
                    relationship: 'self',
                    age: 35,
                    healthScore: 85,
                    medications: ['Blood Pressure Medication'],
                    allergies: ['Peanuts'],
                    conditions: ['Hypertension'],
                    lastCheckup: '2024-01-15',
                    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
                },
                {
                    id: 2,
                    name: 'Jane Doe',
                    relationship: 'spouse',
                    age: 32,
                    healthScore: 92,
                    medications: ['Vitamins'],
                    allergies: ['Shellfish'],
                    conditions: [],
                    lastCheckup: '2024-02-10',
                    avatar: 'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
                },
                {
                    id: 3,
                    name: 'Alex Doe',
                    relationship: 'child',
                    age: 8,
                    healthScore: 95,
                    medications: [],
                    allergies: [],
                    conditions: [],
                    lastCheckup: '2024-01-20',
                    avatar: 'https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
                }
            ];
            //this.saveFamilyData();
        }
    }

    saveFamilyData() {
        localStorage.setItem('familyMembers', JSON.stringify(this.familyMembers));
    }

    renderFamilyMembers() {
        const container = document.getElementById('family-members');
        if (!container) return;

        container.innerHTML = this.familyMembers.map(member => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div class="p-6">
                    <div class="flex items-center mb-4">
                        <img src="${member.avatar}" alt="${member.name}" class="w-16 h-16 rounded-full object-cover mr-4">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">${member.name}</h3>
                            <p class="text-gray-600 capitalize">${member.relationship} • ${member.age} years old</p>
                        </div>
                    </div>

                    <!-- Health Score -->
                    <div class="mb-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-medium text-gray-700">Health Score</span>
                            <span class="text-lg font-bold ${this.getHealthScoreColor(member.healthScore)}">${member.healthScore}</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="h-2 rounded-full ${this.getHealthScoreBarColor(member.healthScore)}" style="width: ${member.healthScore}%"></div>
                        </div>
                    </div>

                    <!-- Quick Info -->
                    <div class="space-y-2 mb-4">
                        <div class="flex items-center text-sm text-gray-600">
                            <i class="fas fa-pills w-4 mr-2"></i>
                            <span>${member.medications.length} medications</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <i class="fas fa-exclamation-triangle w-4 mr-2"></i>
                            <span>${member.allergies.length} allergies</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <i class="fas fa-calendar w-4 mr-2"></i>
                            <span>Last checkup: ${this.formatDate(member.lastCheckup)}</span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex space-x-2">
                        <button class="flex-1 bg-primary text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors"
                                onclick="familyHealth.viewMemberDetails(${member.id})">
                            View Details
                        </button>
                        <button class="flex-1 bg-secondary text-white py-2 px-3 rounded text-sm hover:bg-green-600 transition-colors"
                                onclick="familyHealth.editMember(${member.id})">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    if (data.status === 'success') {
    this.showNotification('Family member added successfully!', 'success');
    this.loadMembersFromAPI();  // instead of renderFamilyMembers()
}
    }

    setupFamilyForm() {
        const form = document.getElementById('family-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addFamilyMember(new FormData(form));
            });
        }
    }

    addFamilyMember(formData) {
    const newMember = {
        name: document.querySelector("#nameInput").value,
        age: parseInt(document.querySelector("#ageInput").value),
        sex: document.querySelector("#sexInput").value,
        family_id: document.querySelector("#familyIdInput").value || null,
        show_age: document.querySelector("#showAgeCheckbox").checked
    };

    fetch('/add-member/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),  // ensure this function works
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(result => {
    console.log(result);
})
        .catch(error => console.error('Error:', error));
        


    // Close modal and reset form
    document.getElementById('family-modal').classList.add('hidden');
    document.getElementById('family-form').reset();
}

    viewMemberDetails(memberId) {
        const member = this.familyMembers.find(m => m.id === memberId);
        if (!member) return;

        // Create and show member details modal
        const modalHTML = `
            <div id="member-details-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-6">
                            <div class="flex items-center">
                                <img src="${member.avatar}" alt="${member.name}" class="w-20 h-20 rounded-full object-cover mr-4">
                                <div>
                                    <h2 class="text-2xl font-bold text-gray-900">${member.name}</h2>
                                    <p class="text-gray-600 capitalize">${member.relationship} • ${member.age} years old</p>
                                </div>
                            </div>
                            <button onclick="this.closest('#member-details-modal').remove()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Health Score -->
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h3 class="font-semibold text-gray-900 mb-2">Health Score</h3>
                                <div class="text-center">
                                    <div class="text-3xl font-bold ${this.getHealthScoreColor(member.healthScore)} mb-2">${member.healthScore}</div>
                                    <div class="w-full bg-gray-200 rounded-full h-2">
                                        <div class="h-2 rounded-full ${this.getHealthScoreBarColor(member.healthScore)}" style="width: ${member.healthScore}%"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Medications -->
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h3 class="font-semibold text-gray-900 mb-2">Medications</h3>
                                ${member.medications.length > 0 ? 
                                    member.medications.map(med => `<div class="bg-white rounded p-2 mb-2 text-sm">${med}</div>`).join('') :
                                    '<p class="text-gray-600 text-sm">No medications recorded</p>'
                                }
                            </div>

                            <!-- Allergies -->
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h3 class="font-semibold text-gray-900 mb-2">Allergies</h3>
                                ${member.allergies.length > 0 ? 
                                    member.allergies.map(allergy => `<div class="bg-red-100 text-red-800 rounded p-2 mb-2 text-sm">${allergy}</div>`).join('') :
                                    '<p class="text-gray-600 text-sm">No allergies recorded</p>'
                                }
                            </div>

                            <!-- Conditions -->
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h3 class="font-semibold text-gray-900 mb-2">Medical Conditions</h3>
                                ${member.conditions.length > 0 ? 
                                    member.conditions.map(condition => `<div class="bg-yellow-100 text-yellow-800 rounded p-2 mb-2 text-sm">${condition}</div>`).join('') :
                                    '<p class="text-gray-600 text-sm">No conditions recorded</p>'
                                }
                            </div>
                        </div>

                        <div class="mt-6 flex space-x-3">
                            <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                <i class="fas fa-edit mr-2"></i>Edit Profile
                            </button>
                            <button class="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                                <i class="fas fa-stethoscope mr-2"></i>AI Diagnosis
                            </button>
                            <button class="bg-accent text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors">
                                <i class="fas fa-user-md mr-2"></i>Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    editMember(memberId) {
        // Implementation for editing member details
        this.showNotification('Edit functionality coming soon!', 'info');
    }

    getHealthScoreColor(score) {
        if (score >= 90) return 'text-green-600';
        if (score >= 75) return 'text-yellow-600';
        return 'text-red-600';
    }

    getHealthScoreBarColor(score) {
        if (score >= 90) return 'bg-green-500';
        if (score >= 75) return 'bg-yellow-500';
        return 'bg-red-500';
    }

    formatDate(dateString) {
        if (!dateString) return 'Not scheduled';
        return new Date(dateString).toLocaleDateString();
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

// Initialize family health manager when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const addBtn = document.getElementById("addMemberBtn");

  addBtn.addEventListener("click", function () {
    const name = document.getElementById("memberName").value;
    const relationship = document.getElementById("memberRelationship").value;
    const age = document.getElementById("memberAge").value;

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch("/add_family_member/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        name: name,
        relationship: relationship,
        age: age,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          // Create a new card and append to DOM
          const card = `
            <div class="card mb-2 p-2">
              <h5>${data.member.name}</h5>
              <p>Relationship: ${data.member.relationship}</p>
              <p>Age: ${data.member.age}</p>
            </div>
          `;
          document.getElementById("familyCardsContainer").insertAdjacentHTML("beforeend", card);

          // Close modal and clear form
          document.getElementById("memberName").value = "";
          document.getElementById("memberRelationship").value = "";
          document.getElementById("memberAge").value = "";
          $('#addFamilyMemberModal').modal('hide');
        } else {
          alert("Failed to add member.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});


