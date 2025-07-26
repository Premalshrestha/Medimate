// Speech recognition functionality
class SpeechRecognitionManager {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.init();
    }

    init() {
        // Check for browser support
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            this.recognition = new SpeechRecognition();
        } else {
            console.warn('Speech recognition not supported in this browser');
            this.showFallbackInput();
            return;
        }

        this.setupRecognition();
        this.setupEventListeners();
    }

    setupRecognition() {
        if (!this.recognition) return;

        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI('listening');
        };

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            this.displayTranscript(finalTranscript || interimTranscript);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI('stopped');
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            this.updateUI('error');
        };
    }

    setupEventListeners() {
        const speechBtn = document.getElementById('speech-btn');
        if (speechBtn) {
            speechBtn.addEventListener('click', () => {
                this.toggleRecording();
            });
        }
    }

    toggleRecording() {
        if (!this.recognition) {
            this.showFallbackInput();
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    updateUI(state) {
        const speechBtn = document.getElementById('speech-btn');
        const speechBtnText = document.getElementById('speech-btn-text');

        if (!speechBtn || !speechBtnText) return;

        switch (state) {
            case 'listening':
                speechBtn.classList.remove('bg-primary', 'hover:bg-blue-600');
                speechBtn.classList.add('bg-red-500', 'hover:bg-red-600', 'animate-pulse');
                speechBtnText.textContent = 'Listening...';
                break;
            case 'stopped':
                speechBtn.classList.remove('bg-red-500', 'hover:bg-red-600', 'animate-pulse');
                speechBtn.classList.add('bg-primary', 'hover:bg-blue-600');
                speechBtnText.textContent = 'Start Recording';
                this.enableAnalysis();
                break;
            case 'error':
                speechBtn.classList.remove('bg-red-500', 'hover:bg-red-600', 'animate-pulse');
                speechBtn.classList.add('bg-primary', 'hover:bg-blue-600');
                speechBtnText.textContent = 'Try Again';
                break;
        }
    }

    displayTranscript(transcript) {
        const speechResult = document.getElementById('speech-result');
        const speechText = document.getElementById('speech-text');

        if (speechResult && speechText) {
            speechResult.classList.remove('hidden');
            speechText.textContent = transcript;
        }
    }

    enableAnalysis() {
        const analyzeBtn = document.getElementById('analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.disabled = false;
        }
    }

    showFallbackInput() {
        const speechContainer = document.querySelector('.bg-white.rounded-lg.shadow-md.p-6');
        if (speechContainer) {
            speechContainer.innerHTML = `
                <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <i class="fas fa-keyboard text-primary mr-2"></i>
                    Describe Symptoms
                </h2>
                <textarea
                    id="symptoms-textarea"
                    class="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Please describe your symptoms in detail..."
                ></textarea>
                <p class="text-sm text-gray-500 mt-2">Speech recognition not available. Please type your symptoms.</p>
            `;

            // Enable analysis when text is entered
            const textarea = document.getElementById('symptoms-textarea');
            if (textarea) {
                textarea.addEventListener('input', (e) => {
                    const analyzeBtn = document.getElementById('analyze-btn');
                    if (analyzeBtn) {
                        analyzeBtn.disabled = e.target.value.trim().length === 0;
                    }
                });
            }
        }
    }

    getTranscribedText() {
        const speechText = document.getElementById('speech-text');
        const symptomsTextarea = document.getElementById('symptoms-textarea');
        
        if (speechText && speechText.textContent) {
            return speechText.textContent;
        } else if (symptomsTextarea && symptomsTextarea.value) {
            return symptomsTextarea.value;
        }
        
        return '';
    }
}

// Initialize speech recognition when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.speechManager = new SpeechRecognitionManager();
});