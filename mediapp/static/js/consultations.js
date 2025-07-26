class ConsultationsManager {
    constructor() {
        this.doctors = [];
        this.init();
    }

    init() {
        this.loadDoctorsData();
    }

    async loadDoctorsData() {
        try {
            const response = await fetch('/api/doctors/');
            if (!response.ok) {
                throw new Error('HTTP error! Status: ${response.status}');
            }

            const data = await response.json();

            this.doctors = data.doctors.map(doctor => ({
                id: doctor.id,
                name: doctor.name,
                specialty: doctor.specialization,
                image: doctor.image || 'https://via.placeholder.com/100',
                rating: 4.5,
                price: '$50/consultation',
                availability: 'Available',
            }));

            this.renderDoctors();

        } catch (error) {
            console.error('Error fetching doctors:', error.message);
        }
    }

    renderDoctors() {
        const container = document.getElementById("doctors-list");
        if (!container) {
            console.error("Doctors list container not found");
            return;
        }

        // Sanitize HTML to prevent XSS
        const sanitizeHTML = (str) => {
            const div = document.createElement("div");
            div.textContent = str;
            return div.innerHTML;
        };

        // Generate HTML for all doctors
        const cards = this.doctors
            .map((doctor) => `
                <div class="doctor-card bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                    <img src="${sanitizeHTML(doctor.image)}" alt="${sanitizeHTML(doctor.name)}" class="w-16 h-16 object-cover rounded-full mb-2 ring-2 ring-green-500 ring-opacity-75">
                    <h3 class="text-lg font-semibold text-gray-900">${sanitizeHTML(doctor.name)}</h3>
                    <p class="text-sm text-gray-600"><strong>Specialty:</strong> ${sanitizeHTML(doctor.specialty)}</p>
                    <p class="text-sm text-gray-600"><strong>Rating:</strong> ${doctor.rating} ⭐</p>
                    <p class="text-sm text-gray-600 flex items-center">
                        <strong>Availability:</strong> ${sanitizeHTML(doctor.availability)}
                        ${doctor.availability === 'Available' ? '<span class="w-3 h-3 bg-green-500 rounded-full ml-2"></span>' : ''}
                    </p>
                    <p class="text-sm text-gray-600"><strong>Price:</strong> ${sanitizeHTML(doctor.price)}</p>
                    <button class="book-btn mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" data-doctor-id="${doctor.id}">Book Now</button>
                </div>
            `)
            .join("");

        container.innerHTML = cards;

        // Add event listeners for booking buttons
        container.querySelectorAll(".book-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const doctorId = button.dataset.doctorId;
                const doctor = this.doctors.find((d) => d.id == doctorId);
                alert(`Booking ${sanitizeHTML(doctor.name)}`); // Replace with booking logic
            });
        });
    }
}



document.addEventListener("DOMContentLoaded", () => {
    new ConsultationsManager();
});