/**
 * Chat bubble web component.
 * The bubble that displays a message in the chat.
 */
export class ChatBubble extends HTMLElement {
  /**
   * Constructor.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }

  /**
   * Called when the element is added to the DOM.
   */
  connectedCallback () {
    this.shadowRoot.innerHTML = `
        <style>
        .chat-bubble {
            width: 300px;
            height: 40px;
            background-color: white;
            border: 1px solid black;
            border-radius: 5px;
        }
        .username {
            width: 20px
            height: 40px;
            background-color: white;
            border: 1px solid black;
            border-radius: 5px;
        }
        </style>
        <div class="username">
        
        </div>
        <div class="chat-bubble">
        </div>
        `
    this.shadowRoot.querySelector('.chat-bubble').innerHTML = this.getAttribute('data') // Set the message and username
    this.shadowRoot.querySelector('.username').innerHTML = this.getAttribute('username')
  }
}
customElements.define('chat-bubble', ChatBubble)
