<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const chatbotMicBtn = document.getElementById('chatbot-mic-btn');

    // Backend API URL - Update this to your actual backend URL
    const CHAT_API_URL = 'http://localhost:3001/api/chat'; // For local testing
    // const CHAT_API_URL = 'https://yourwebsite.com/api/chat'; // For production
    
    // Customer Service Context
    const customerServiceContext = [
        {
            role: "system",
            content: `You are BlueMoonJourneys Customer Service Assistant, a professional travel service bot.

COMPANY INFORMATION:
- Name: BlueMoonJourneys Premium Travel
- Services: Custom itineraries, flight/hotel booking, visa assistance, travel insurance, 24/7 support
- Destinations: Japan, Bali, Greece, Italy, Switzerland, Thailand, Maldives, Dubai
- Contact: support@bluemoonjourneys.com | +1 (555) 123-4567
- Hours: 24/7 emergency support

GUIDELINES:
- Be professional, helpful, and travel-focused
- Provide accurate information only
- For complex issues, suggest contacting human support
- Keep responses concise but informative
- Use friendly but professional tone`

        }
    ];

    let conversationHistory = [...customerServiceContext];
    let isOnline = true;

    // Quick Actions
    const quickActions = [
        { label: '📅 Book a Trip', value: 'I want to book a new trip' },
        { label: '✈️ Flight Info', value: 'I have questions about flights' },
        { label: '🏨 Accommodation', value: 'I need help with hotel booking' },
        { label: '🌍 Destinations', value: 'What destinations do you recommend?' }
    ];

    // Initialize chatbot
    function initChatbot() {
        addMessage('bot', `Welcome to BlueMoonJourneys! 🌟 I'm your AI travel assistant. 

How can I help you with:
• Booking new trips
• Flight information  
• Hotel accommodations
• Destination advice
• Travel insurance
• Visa requirements

What would you like to know?`);
        showQuickActions();
        
        // Test backend connection
        testBackendConnection();
    }

    // Test backend connection
    async function testBackendConnection() {
        try {
            const response = await fetch(CHAT_API_URL.replace('/chat', '/health'));
            if (response.ok) {
                console.log('✅ Backend connection successful');
            }
        } catch (error) {
            console.log('❌ Backend connection failed:', error);
            addMessage('bot', "⚠️ Note: I'm currently in demo mode. Some features may be limited.");
        }
    }

    // Show quick action buttons
    function showQuickActions() {
        // Remove existing quick actions
        const existingActions = document.querySelector('.quick-actions');
        if (existingActions) {
            existingActions.remove();
        }

        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'quick-actions';
        
        quickActions.forEach(action => {
            const button = document.createElement('button');
            button.className = 'quick-action-btn';
            button.innerHTML = action.label;
            button.addEventListener('click', () => {
                chatbotInput.value = action.value;
                sendMessage();
            });
            actionsContainer.appendChild(button);
        });
        
        chatbotMessages.appendChild(actionsContainer);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Message handling
    function addMessage(sender, message, showActions = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = formatMessage(message);
        
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
        
        if (showActions) {
            setTimeout(showQuickActions, 500);
        }
        
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function formatMessage(message) {
        return message.replace(/\n/g, '<br>');
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
                <span>BlueMoonJourneys AI is typing...</span>
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

    // AI Response with your backend
    async function getAIResponse(userMessage) {
        try {
            // Add user message to conversation
            conversationHistory.push({ role: "user", content: userMessage });

            // Manage conversation history length
            if (conversationHistory.length > 15) {
                conversationHistory = [
                    conversationHistory[0], // Keep system message
                    ...conversationHistory.slice(-13) // Keep last 13 messages
                ];
            }

            console.log('Sending to backend:', { messageCount: conversationHistory.length });

            const response = await fetch(CHAT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: conversationHistory
                })
            });

            if (!response.ok) {
                throw new Error(`Backend error: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (data.choices && data.choices[0] && data.choices[0].message) {
                const botResponse = data.choices[0].message.content;
                
                // Add to conversation history
                conversationHistory.push({ role: "assistant", content: botResponse });
                
                return botResponse;
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('API call failed:', error);
            return getFallbackResponse(userMessage);
        }
    }

    function getFallbackResponse(userMessage) {
        return `I apologize, but I'm having trouble connecting right now. 

For immediate assistance with "${userMessage}", please:
• Call: +254 703 161 031
• Email: underworldahacker7@gmail.com

Our travel experts are ready to help you!`;
    }

    // Main message function
    async function sendMessage() {
        const userMessage = chatbotInput.value.trim();
        if (userMessage !== '') {
            addMessage('user', userMessage);
            chatbotInput.value = '';
            setInputState(false);

            showTypingIndicator();

            try {
                const botResponse = await getAIResponse(userMessage);
                hideTypingIndicator();
                
                const shouldShowActions = !botResponse.includes('call') && 
                                        !botResponse.includes('email') &&
                                        !botResponse.includes('phone');
                
                addMessage('bot', botResponse, shouldShowActions);
                
            } catch (error) {
                hideTypingIndicator();
                console.error('Error in sendMessage:', error);
                addMessage('bot', getFallbackResponse(userMessage), true);
            } finally {
                setInputState(true);
                chatbotInput.focus();
            }
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

    // Initialize
    initChatbot();
=======
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
>>>>>>> 676803109615414ebf9c410a83be4176decf8442
});