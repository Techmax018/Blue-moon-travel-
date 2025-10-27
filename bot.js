document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const chatbotMicBtn = document.getElementById('chatbot-mic-btn');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    let isListening = false;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isListening = true;
            // No direct icon animation, can add a class to the button or image if needed
            chatbotMicBtn.classList.add('listening-active'); // Add class for visual feedback
            chatbotInput.placeholder = "Listening...";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatbotInput.value = transcript;
            sendMessage();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            chatbotInput.placeholder = "Error listening. Try again.";
            isListening = false;
            chatbotMicBtn.classList.remove('listening-active');
            setTimeout(() => {
                chatbotInput.placeholder = "Type your message...";
            }, 1500);
        };

        recognition.onend = () => {
            isListening = false;
            chatbotMicBtn.classList.remove('listening-active');
            if (chatbotInput.placeholder === "Listening...") {
                chatbotInput.placeholder = "Type your message...";
            }
        };

        chatbotMicBtn.addEventListener('click', () => {
            if (isListening) {
                recognition.stop();
            } else {
                try {
                    recognition.start();
                } catch (e) {
                    console.error('Recognition start error:', e);
                    chatbotInput.placeholder = "Microphone error. Ensure permissions are granted.";
                    isListening = false;
                    chatbotMicBtn.classList.remove('listening-active');
                }
            }
        });
    } else {
        chatbotMicBtn.style.display = 'none';
        console.warn('Web Speech API is not supported by this browser.');
    }

    chatbotToggleBtn.addEventListener('click', () => {
        chatbotWindow.classList.toggle('visible');
        chatbotWindow.classList.toggle('hidden');
        if (chatbotWindow.classList.contains('visible')) {
            chatbotInput.focus();
        }
    });

    chatbotCloseBtn.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
        chatbotWindow.classList.remove('visible');
    });

    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender + '-message');
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    let typingIndicatorElement = null;

    function showTypingIndicator() {
        if (!typingIndicatorElement) {
            typingIndicatorElement = document.createElement('div');
            typingIndicatorElement.classList.add('typing-indicator');
            typingIndicatorElement.innerHTML = '<span></span><span></span><span></span>';
            chatbotMessages.appendChild(typingIndicatorElement);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    }

    function hideTypingIndicator() {
        if (typingIndicatorElement) {
            chatbotMessages.removeChild(typingIndicatorElement);
            typingIndicatorElement = null;
        }
    }

    function sendMessage() {
        const userMessage = chatbotInput.value.trim();
        if (userMessage !== '') {
            addMessage('user', userMessage);
            chatbotInput.value = '';

            showTypingIndicator();

            setTimeout(() => {
                hideTypingIndicator();

                let botResponse = "I'm blue, a simple bot. How can I help you with BlueMoonJourneys?";
                const lowerCaseMessage = userMessage.toLowerCase();

                if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
                    botResponse = "Hello there!Am blue, How can I assist you with your travel plans today?";
                } else if (lowerCaseMessage.includes('booking') || lowerCaseMessage.includes('book')) {
                    botResponse = "You can book your trip on our 'Booking' page. Would you like a link to it?";
                } else if (lowerCaseMessage.includes('destinations') || lowerCaseMessage.includes('where to go')) {
                    botResponse = "We offer trips to amazing places like Japan, New Zealand, Greece, and Kenya! Check out our 'Destinations' section for more.";
                } else if (lowerCaseMessage.includes('services')) {
                    botResponse = "We offer personalized itinerary planning, flight & accommodation booking, group travel, adventure packages, visa assistance, and 24/7 local support.";
                } else if (lowerCaseMessage.includes('contact')) {
                    botResponse = "You can reach us via email at info@bluemoonjourneys.com or call us at +1 (234) 567-890.";
                } else if (lowerCaseMessage.includes('thank you') || lowerCaseMessage.includes('thanks')) {
                    botResponse = "You're most welcome! Is there anything else I can help you with?";
                } else if (lowerCaseMessage.includes('bye') || lowerCaseMessage.includes('goodbye')) {
                    botResponse = "Goodbye! Have a great day and we hope to help you plan your next journey soon!";
                }

                addMessage('bot', botResponse);
            }, 800);
        }
    }

    chatbotSendBtn.addEventListener('click', sendMessage);

    chatbotInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});