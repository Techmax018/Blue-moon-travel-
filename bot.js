document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const chatbotMicBtn = document.getElementById('chatbot-mic-btn');

    // Initialize chatbot with greeting
    function initChatbot() {
        addMessage('bot', "Hi! I'm Blue, your travel assistant. How can I help you with your travel plans today?");
    }

    // Add message to chat
    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender + '-message');
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        
        messageElement.appendChild(messageContent);
        
        // Add timestamp
        const timestamp = new Date().toLocaleTimeString([], { 
            hour: '2-digit', minute: '2-digit' 
        });
        const timestampElement = document.createElement('div');
        timestampElement.className = 'message-timestamp';
        timestampElement.textContent = timestamp;
        messageElement.appendChild(timestampElement);
        
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    let typingIndicatorElement = null;

    function showTypingIndicator() {
        if (!typingIndicatorElement) {
            typingIndicatorElement = document.createElement('div');
            typingIndicatorElement.className = 'typing-indicator';
            typingIndicatorElement.innerHTML = `
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span>Blue is typing...</span>
            `;
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

    // Simple response logic
    function getBotResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();

        // Greetings
        if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hey')) {
            return "Hello there! Nice to meet you. What destination are you thinking about for your next trip?";
        }
        
        // Booking related
        else if (lowerCaseMessage.includes('book') || lowerCaseMessage.includes('reservation')) {
            return "I can help you book a trip! We have amazing destinations like Japan, Bali, Greece, and Italy. Which destination interests you?";
        }
        
        // Destinations
        else if (lowerCaseMessage.includes('destination') || lowerCaseMessage.includes('where') || lowerCaseMessage.includes('place')) {
            return "We specialize in Japan, Bali, Greece, Italy, Switzerland, Thailand, Maldives, and Dubai! Each offers unique experiences. Which one catches your eye?";
        }
        
        // Flights
        else if (lowerCaseMessage.includes('flight') || lowerCaseMessage.includes('airline') || lowerCaseMessage.includes('fly')) {
            return "I can help with flight information! Are you looking for international or domestic flights?";
        }
        
        // Hotels
        else if (lowerCaseMessage.includes('hotel') || lowerCaseMessage.includes('accommodation') || lowerCaseMessage.includes('stay')) {
            return "We have great hotel partnerships worldwide! What type of accommodation are you looking for? Luxury, budget, or something in between?";
        }
        
        // Price/cost
        else if (lowerCaseMessage.includes('price') || lowerCaseMessage.includes('cost') || lowerCaseMessage.includes('how much')) {
            return "Prices vary based on destination, season, and accommodation type. Could you tell me more about your travel preferences so I can give you better estimates?";
        }
        
        // Help
        else if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('support')) {
            return "I'm here to help with travel planning! You can ask me about destinations, bookings, flights, hotels, or travel tips. What do you need assistance with?";
        }
        
        // Thank you
        else if (lowerCaseMessage.includes('thank') || lowerCaseMessage.includes('thanks')) {
            return "You're welcome! Is there anything else I can help you with regarding your travel plans?";
        }
        
        // Goodbye
        else if (lowerCaseMessage.includes('bye') || lowerCaseMessage.includes('goodbye') || lowerCaseMessage.includes('see you')) {
            return "Goodbye! Feel free to come back if you need more travel assistance. Safe travels! 🌍";
        }
        
        // Default response for unrecognized messages
        else {
            return "I'd love to help you with your travel plans! Could you tell me more about what you're looking for? For example, you could ask about destinations, booking, flights, or hotels.";
        }
    }

    // Main message function
    function sendMessage() {
        const userMessage = chatbotInput.value.trim();
        if (userMessage !== '') {
            addMessage('user', userMessage);
            chatbotInput.value = '';
            setInputState(false);

            showTypingIndicator();

            // Simulate typing delay
            setTimeout(() => {
                hideTypingIndicator();
                const botResponse = getBotResponse(userMessage);
                addMessage('bot', botResponse);
                setInputState(true);
                chatbotInput.focus();
            }, 1500);
        }
    }

    function setInputState(enabled) {
        chatbotInput.disabled = !enabled;
        chatbotSendBtn.disabled = !enabled;
        chatbotMicBtn.disabled = !enabled;
    }

    // Event Listeners
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

    chatbotSendBtn.addEventListener('click', sendMessage);

    chatbotInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Initialize the chatbot
    initChatbot();
});