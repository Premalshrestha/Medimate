// AI Diagnosis functionality
class AIDiagnosisManager {
    constructor() {
        this.symptoms = '';
        this.imageData = null;
        this.analysisHistory = [];
        this.init();
    }

    init() {
        this.setupImageUpload();
        this.setupAnalysis();
        this.loadSymptomDatabase();
    }

    setupImageUpload() {
        const imageUpload = document.getElementById('image-upload');
        const imagePreview = document.getElementById('image-preview');
        const previewImg = document.getElementById('preview-img');

        if (imageUpload) {
            imageUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.imageData = event.target.result;
                        previewImg.src = event.target.result;
                        imagePreview.classList.remove('hidden');
                        this.checkAnalysisReady();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    setupAnalysis() {
        const analyzeBtn = document.getElementById('analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.performAnalysis();
            });
        }
    }

    checkAnalysisReady() {
        const analyzeBtn = document.getElementById('analyze-btn');
        const hasSymptoms = window.speechManager?.getTranscribedText()?.trim().length > 0;
        const hasImage = this.imageData !== null;

        if (analyzeBtn) {
            analyzeBtn.disabled = !(hasSymptoms || hasImage);
        }
    }

    async performAnalysis() {
        const analyzeBtn = document.getElementById('analyze-btn');
        const resultsContainer = document.getElementById('analysis-results');
        const diagnosisContent = document.getElementById('diagnosis-content');

        // Show loading state
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing...';
        analyzeBtn.disabled = true;

        // Get input data
        const symptoms = window.speechManager?.getTranscribedText() || '';
        const hasImage = this.imageData !== null;

        try {
            // Simulate AI analysis delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Perform mock analysis
            const analysis = this.mockAIAnalysis(symptoms, hasImage);

            // Display results
            this.displayResults(analysis);
            resultsContainer.classList.remove('hidden');

            // Save to history
            this.analysisHistory.push({
                timestamp: new Date(),
                symptoms,
                hasImage,
                analysis
            });

        } catch (error) {
            console.error('Analysis error:', error);
            this.showError('Analysis failed. Please try again.');
        } finally {
            // Reset button
            analyzeBtn.innerHTML = '<i class="fas fa-brain mr-2"></i>Analyze Symptoms';
            analyzeBtn.disabled = false;
        }
    }

    mockAIAnalysis(symptoms, hasImage) {
        // Mock AI analysis based on keywords
        const symptomLower = symptoms.toLowerCase();
        let conditions = [];
        let confidence = 0;
        let recommendations = [];

        // Simple keyword matching for demonstration
        if (symptomLower.includes('fever') || symptomLower.includes('temperature')) {
            conditions.push({
                name: 'Viral Infection',
                probability: 75,
                description: 'Common viral infection with fever as primary symptom'
            });
            confidence = 75;
        }

        if (symptomLower.includes('cough')) {
            conditions.push({
                name: 'Upper Respiratory Infection',
                probability: 65,
                description: 'Infection affecting the upper respiratory tract'
            });
            confidence = Math.max(confidence, 65);
        }

        if (symptomLower.includes('headache')) {
            conditions.push({
                name: 'Tension Headache',
                probability: 60,
                description: 'Common type of headache caused by stress or tension'
            });
            confidence = Math.max(confidence, 60);
        }

        if (symptomLower.includes('rash') || hasImage) {
            conditions.push({
                name: 'Skin Irritation',
                probability: 70,
                description: 'Possible allergic reaction or dermatitis'
            });
            confidence = Math.max(confidence, 70);
        }

        // Default condition if no matches
        if (conditions.length === 0) {
            conditions.push({
                name: 'General Malaise',
                probability: 50,
                description: 'General feeling of discomfort or illness'
            });
            confidence = 50;
        }

        // Generate recommendations
        recommendations = [
            'Monitor symptoms for 24-48 hours',
            'Stay hydrated and get adequate rest',
            'Consult a healthcare provider if symptoms worsen',
            'Consider over-the-counter medications for symptom relief'
        ];

        if (confidence > 70) {
            recommendations.unshift('Schedule a consultation with a doctor');
        }

        return {
            confidence,
            conditions,
            recommendations,
            analysis: {
                inputType: hasImage ? 'Multimodal (Speech + Image)' : 'Speech Only',
                processingTime: '1.8 seconds',
                modelUsed: 'MediMate AI v2.1'
            }
        };
    }

    displayResults(analysis) {
        const diagnosisContent = document.getElementById('diagnosis-content');
        
        const resultsHTML = `
            <div class="space-y-6">
                <!-- Confidence Score -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="font-semibold text-gray-900">Confidence Score</h3>
                        <span class="text-2xl font-bold ${this.getConfidenceColor(analysis.confidence)}">${analysis.confidence}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="h-2 rounded-full ${this.getConfidenceBarColor(analysis.confidence)}" style="width: ${analysis.confidence}%"></div>
                    </div>
                </div>

                <!-- Potential Conditions -->
                <div>
                    <h3 class="font-semibold text-gray-900 mb-3">Potential Conditions</h3>
                    <div class="space-y-3">
                        ${analysis.conditions.map(condition => `
                            <div class="border border-gray-200 rounded-lg p-4">
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-medium text-gray-900">${condition.name}</h4>
                                    <span class="text-sm font-semibold text-primary">${condition.probability}%</span>
                                </div>
                                <p class="text-sm text-gray-600">${condition.description}</p>
                                <div class="mt-2 w-full bg-gray-200 rounded-full h-1">
                                    <div class="h-1 rounded-full bg-primary" style="width: ${condition.probability}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Recommendations -->
                <div>
                    <h3 class="font-semibold text-gray-900 mb-3">Recommendations</h3>
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <ul class="space-y-2">
                            ${analysis.recommendations.map(rec => `
                                <li class="flex items-start">
                                    <i class="fas fa-check-circle text-yellow-500 mr-2 mt-0.5"></i>
                                    <span class="text-sm text-gray-700">${rec}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>

                <!-- Analysis Details -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 class="font-semibold text-gray-900 mb-3">Analysis Details</h3>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-gray-600">Input Type:</span>
                            <span class="ml-2 font-medium">${analysis.analysis.inputType}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Processing Time:</span>
                            <span class="ml-2 font-medium">${analysis.analysis.processingTime}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Model Used:</span>
                            <span class="ml-2 font-medium">${analysis.analysis.modelUsed}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Timestamp:</span>
                            <span class="ml-2 font-medium">${new Date().toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex space-x-4">
                    <button class="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fas fa-user-md mr-2"></i>
                        Consult Doctor
                    </button>
                    <button class="flex-1 bg-secondary text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                        <i class="fas fa-save mr-2"></i>
                        Save to Records
                    </button>
                </div>

                <!-- Disclaimer -->
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div class="flex items-start">
                        <i class="fas fa-exclamation-triangle text-red-500 mr-2 mt-0.5"></i>
                        <div class="text-sm text-red-700">
                            <strong>Important:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.
                        </div>
                    </div>
                </div>
            </div>
        `;

        diagnosisContent.innerHTML = resultsHTML;
    }

    getConfidenceColor(confidence) {
        if (confidence >= 80) return 'text-green-600';
        if (confidence >= 60) return 'text-yellow-600';
        return 'text-red-600';
    }

    getConfidenceBarColor(confidence) {
        if (confidence >= 80) return 'bg-green-500';
        if (confidence >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    }

    showError(message) {
        const diagnosisContent = document.getElementById('diagnosis-content');
        diagnosisContent.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex items-center">
                    <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
                    <span class="text-red-700">${message}</span>
                </div>
            </div>
        `;
    }

    loadSymptomDatabase() {
        // This would typically load from a medical database
        this.symptomDatabase = {
            fever: ['viral infection', 'bacterial infection', 'flu'],
            cough: ['cold', 'bronchitis', 'pneumonia'],
            headache: ['tension headache', 'migraine', 'sinus infection'],
            rash: ['allergic reaction', 'eczema', 'dermatitis']
        };
    }
}

// Initialize AI diagnosis manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiDiagnosis = new AIDiagnosisManager();
});