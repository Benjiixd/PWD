let globalZIndexCounter = 1000 // Global z-index counter

/**
 * Class for a draggable window to be used for other components later.
 */
export class DraggableWindow extends HTMLElement {
  /**
   * Constructor for the draggable window.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
  <style>
    .window-template {
      border: 1px solid #000;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      height: 600px;
      width: 600px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #0A64A4; /* Blue gradient start */
      background-image: linear-gradient(to right, #0A64A4, #3C7FB1); /* Blue gradient */
      }
    .window-header {
      background-color: #0A64A4; /* Blue gradient start */
      background-image: linear-gradient(to right, #0A64A4, #3C7FB1); /* Blue gradient */
      color: white;
      cursor: move;
      user-select: none;
      padding: 5px 10px;
      display: flex;
      justify-content: space-between; /* For title and control buttons */
      align-items: center;
      border-top-left-radius: 4px; /* Rounded corners */
      border-top-right-radius: 4px;
                }
      .window-content {
        width: 580px;
        height: 530px;
        background-color: blue;
        overflow: auto;
                }

        .window-close {
          background-color: red;
          border: none;
          color: white;
          padding: 5px;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin-left: 5px;
          cursor: pointer;
          border-radius: 5px;
          text-align: center;
                }
            </style>
            <div class="window-template">
                <div class="window">
                    <div class="window-header">
                        <span class="window-title">Window Title</span>
                        <button class="window-close">X</button>
                    </div>
                    <div class="window-content">
                        
                    </div>
                </div>
            </div>
        `
  }

  /**
   * Called when the element is added to the DOM.
   */
  connectedCallback () {
    this.makeDraggable()
    this.setupCloseButton()
    this.style.position = 'absolute'
    this.style.zIndex = globalZIndexCounter++
  }

  /**
   * Function to make the window draggable.
   */
  makeDraggable () {
    let isDown = false
    let offset = [0, 0]
    const header = this.shadowRoot.querySelector('.window-header')
    header.addEventListener('mousedown', (e) => { // Mouse down event listener
      isDown = true // Set isDown to true
      const rect = this.getBoundingClientRect() // take offset
      offset = [
        e.clientX - rect.left,
        e.clientY - rect.top
      ]
      this.style.zIndex = ++globalZIndexCounter
    })
    document.addEventListener('mouseup', () => { // When mouse is realeased stop dragging
      isDown = false
    })
    document.addEventListener('mousemove', (event) => { // Mouse move event listener
      event.preventDefault()
      if (isDown) {
        this.style.left = (event.clientX - offset[0]) + 'px'
        this.style.top = (event.clientY - offset[1]) + 'px'
      }
    })
  }

  /**
   * Function to setup the close button.
   */
  setupCloseButton () {
    const closeButton = this.shadowRoot.querySelector('.window-close')
    closeButton.addEventListener('click', () => {
      this.remove()
    })
  }
}

customElements.define('draggable-window', DraggableWindow)
