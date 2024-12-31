import { DraggableWindow } from '../window/window.js'
import './chatBubble.js'
/**
 * Chat class.
 * Creates a chat window and sets up a websocket.
 * Extends Draggablewindow, only resides in the window-content area.
 */
class Chat extends DraggableWindow {
  /**
   * Constructor.
   */
  constructor () {
    super()
    const style = document.createElement('style')
    style.textContent = `
            .window-content {
                background-color: gray; /* Correct CSS property */
            }
        `
    this.shadowRoot.querySelector('.window-title').innerHTML = 'Chat'
    this.shadowRoot.appendChild(style)
  }

  /**
   * Called when the element is added to the DOM.
   */
  connectedCallback () {
    super.connectedCallback()
    // eslint-disable-next-line eqeqeq
    if (localStorage.getItem('username') == undefined) { // If there is no username
      const chatcontent = this.shadowRoot.querySelector('.window-content')
      chatcontent.innerHTML = `
            <style>
            .chat-container {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
            </style>

            <div class="chat-container">
            <input type="text" id="username" placeholder="Enter your username here">
            <input type="submit" id="submitUsr" value="Send">
            </div>
            `
      this.shadowRoot.querySelector('#submitUsr').addEventListener('click', () => { // Listen for the submit button
        localStorage.setItem('username', this.shadowRoot.querySelector('#username').value)
        this.startChat()
      })
    } else { // If there is a username
      this.startChat()
    }
  }

  /**
   * Function to start the chat.
   * Creates the chat window and sets up the socket.
   */
  startChat () {
    const chatContent = this.shadowRoot.querySelector('.window-content')
    chatContent.innerHTML = `
        <style>
        .chat-container {
            
            width: 100%;
            height: 100%;
            position: relative;
        }
        .messages-container {
            width: 100%;
            
            position: absolute;
            bottom: 0;
        }
        #message {
            width: 80%;
            height: 30px;
            border: none;
            outline: none;
            font-size: 1.5em;
            background-color: white;
        }
        chat-bubble {
            height: 40px;
            margin: 5px;
        }
        .incoming-messages-container {
            height: 480px;
            overflow: auto;
        }       
        </style>        
        <div class="chat-container">
            <div class="incoming-messages-container">
            </div>
            <div class="messages-container">
            <input type="text" id="message" placeholder="Enter your message here">
            <input type="text" id="channel" placeholder="Enter your channel here" value = "all">
            <input type="button" id="usernameChange" value="Change Username">
            <input type="submit" id="submit" value="Send">
            </div>
        </div>
        `
    const socket = new WebSocket('wss://courselab.lnu.se/message-app/socket')
    const message = {
      type: 'message',
      data: 'The message text is sent using the data property',
      username: 'MyFancyUsername',
      channel: 'my, not so secret, channel',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }

    message.channel = this.shadowRoot.querySelector('#channel').value
    this.shadowRoot.querySelector('#channel').addEventListener('input', () => { // Listen for changes in the channel input.
      message.channel = this.shadowRoot.querySelector('#channel').value
    })

    this.shadowRoot.querySelector('#submit').addEventListener('click', () => { // When message is sent
      message.data = this.shadowRoot.querySelector('#message').value // Set the message data to the input value
      message.username = localStorage.getItem('username') // Set the username to the localstorage username
      message.channel = this.shadowRoot.querySelector('#channel').value // Set the channel to the input value
      const messageToSend = JSON.stringify(message) // Stringify the message
      socket.send(messageToSend) // Send
    })
    const chatContainer = chatContent.querySelector('.incoming-messages-container')
    /**
     * Called when a message is received.
     *
     * @param {JSON} event the message received.
     */
    socket.onmessage = function (event) {
      const incomingMessage = event.data
      const parsedMessage = JSON.parse(incomingMessage)
      if ((parsedMessage.channel === message.channel || message.channel === 'all') && parsedMessage.type !== 'heartbeat') { // If the message is in the same channel as the user or the user is in all channels and it isnt a heartbeat
        const chatBubble = document.createElement('chat-bubble') // Create a chatbubble
        chatBubble.setAttribute('data', parsedMessage.data) // Set the data to the message data
        chatBubble.setAttribute('username', parsedMessage.username) // Set the username to the message username
        chatContainer.appendChild(chatBubble) // Append i
        chatContainer.scrollTop = chatContainer.scrollHeight // Scroll to the bottom
      }
    }
    this.shadowRoot.querySelector('#usernameChange').addEventListener('click', () => { // When the username change button is clicked
      localStorage.removeItem('username')
      document.dispatchEvent(new Event('reloadChat'))
    })
  }
}
customElements.define('chat-window', Chat)
