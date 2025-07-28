document.addEventListener("DOMContentLoaded", () => {
    class Chatbox {
        constructor() {
            this.args = {
                openButton: document.querySelector('.chatbox__button'),
                chatBox: document.querySelector('.chatbox__support'),
                sendButton: document.querySelector('.send__button')
            };

            this.state = false;
            this.messages = [];
        }

        display() {
            const { openButton, chatBox, sendButton } = this.args;

            if (openButton) {
                openButton.addEventListener('click', () => this.toggleState(chatBox));
            }
            if (sendButton) {
                sendButton.addEventListener('click', () => this.onSendButton(chatBox));
            }

            const inputNode = chatBox?.querySelector('input');
            if (inputNode) {
                inputNode.addEventListener("keyup", ({ key }) => {
                    if (key === "Enter") {
                        this.onSendButton(chatBox);
                    }
                });
            }
        }

        toggleState(chatbox) {
            this.state = !this.state;
            chatbox.classList.toggle('chatbox--active', this.state);
        }

        async onSendButton(chatbox) {
            const textField = chatbox.querySelector('input');
            const text1 = textField.value.trim();
            if (text1 === "") return;

            const msg1 = { name: "User", message: text1 };
            this.messages.push(msg1);
            this.updateChatText(chatbox);

            try {
                const response = await fetch('http://127.0.0.1:5000/predict', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: text1 })
                });

                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }

                const data = await response.json();
                const msg2 = { name: "Nova", message: data.answer || "No response received" };
                this.messages.push(msg2);
            } catch (error) {
                console.error('Fetch error:', error);
                this.messages.push({ name: "Nova", message: "Oops! Couldn't connect to server. Please try again later." });
            }

            this.updateChatText(chatbox);
            textField.value = '';
        }

        updateChatText(chatbox) {
            const chatmessage = chatbox.querySelector('.chatbox__messages');
            chatmessage.innerHTML = this.messages.slice().reverse().map(item => {
                const className = item.name === "User" ? "messages__item--visitor" : "messages__item--operator";
                return `<div class="messages__item ${className}">${item.message}</div>`;
            }).join('');
        }
    }

    const chatbox = new Chatbox();
    chatbox.display();
});
