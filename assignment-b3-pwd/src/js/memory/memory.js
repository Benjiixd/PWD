import { DraggableWindow } from '../window/window.js'

const activeCard = [] // Really stupid code made by stupid me to make events work across shadow DOMS
const score = []
const attempts = []
const winScore = []
const canSelect = []
/**
 * Memory card custom element, works as a button
 */
class Memorycard extends HTMLElement {
  /**
   * This is required for attributeChangedCallback to work.
   *
   * @returns {string[]} With the color attribute.
   */
  static get observedAttributes () {
    return ['color'] // This line is required for attributeChangedCallback to work
  }

  /**
   * Constructor for the Memorycard custom element.
   * Creates a shadow root and appends a template to it.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
        <style>
        .memory-card {
            width: 100px;
            height: 100px;
            background-image: url(${localStorage.getItem('memoryImage')});
            border: 1px solid black;
            background-size: cover;   /* This will cover the entire area of the card, could also be a specific size like 400px 400px */
            background-position: center;
        }

        
        </style>
        <div class="memory-card"></div>
        `
    this.clicked = false
    this.matched = false
  }

  /**
   * Function that handles a card click.
   * handles the game logic and communicates with the window.
   */
  cardClick () {
    const card = this.shadowRoot.querySelector('.memory-card')
    const Color = getComputedStyle(card).getPropertyValue('--background-color')
    const parent = this.getAttribute('parent')
    if (!canSelect[parent] || this.clicked || this.matched) { // check so it is not already clicked or matched, or if it is not the players turn
      return
    }
    this.clicked = true
    card.style.backgroundImage = 'none' // Remove the image
    card.style.backgroundColor = Color // Set the color
    if (!activeCard[parent]) {
      activeCard[parent] = this // If there is no active card, set this as the active card
    } else {
      canSelect[parent] = false // If there is an active card, set the player to not be able to do a turn
      if (this.id === activeCard[parent].id) { // If the cards match
        score[parent]++ // Add one to the score
        attempts[parent]++ // Add one to the attempts
        document.dispatchEvent(new CustomEvent('correctMemory', { detail: { score: score[parent], parent } })) // Tell the window to update the score
        document.dispatchEvent(new CustomEvent('attemptMemory', { detail: { attempts: attempts[parent], parent } }))
        activeCard[parent] = undefined // Remove the active card
        canSelect[parent] = true // Set the player to be able to do a turn
      } else { // if the cards do not match
        setTimeout(() => { // Wait 1 second and reset the cards to original state
          if (activeCard[parent]) {
            activeCard[parent].shadowRoot.querySelector('.memory-card').style.backgroundImage = `url(${localStorage.getItem('memoryImage')})`
            activeCard[parent].shadowRoot.querySelector('.memory-card').style.backgroundColor = 'white'
            attempts[parent]++
            document.dispatchEvent(new CustomEvent('attemptMemory', { detail: { attempts: attempts[parent], parent } }))
          }
          card.style.backgroundImage = `url(${localStorage.getItem('memoryImage')})`
          card.style.backgroundColor = 'white'
          if (activeCard[parent]) {
            activeCard[parent].clicked = false
          }
          activeCard[parent] = undefined
          this.clicked = false
          canSelect[parent] = true
        }, 1000)
      }
      if (score[parent] === winScore[parent]) { // If the player has won
        const restartButton = document.createElement('button') // Really stupid button that appears in middle of board
        restartButton.innerHTML = 'Restart'
        this.shadowRoot.appendChild(restartButton)
        alert('You won!') // Tell the player they won
        restartButton.addEventListener('click', () => {
          document.dispatchEvent(new CustomEvent('restartMemory', { detail: { parent } }))
        })
      }
    }
  }

  /**
   * Connected Callback called when the element is added to the DOM.
   * Handles all of the game logic.
   */
  connectedCallback () {
    const card = this.shadowRoot.querySelector('.memory-card')
    const parent = this.getAttribute('parent')
    canSelect[parent] = true
    card.setAttribute('tabindex', '0') // Make the card focusable
    card.addEventListener('keydown', (event) => {
      if (event.key === 'e' || event.key === 'E') {
        this.cardClick()
      }
    })
    card.addEventListener('click', () => { // When a card is clicked
      this.cardClick()
    })
  }

  /**
   * Called when an attribute is changed, removed, or added to the element.
   *
   * @param {string} name The name of the attribute that changed
   * @param {string} oldValue The old value of the attribute
   * @param {string} newValue The new value of the attribute
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'color') {
      this.shadowRoot.querySelector('.memory-card').style.setProperty('--background-color', newValue)
    }
  }
}
customElements.define('memory-card', Memorycard)

/**
 * Memory board custom element.
 * Handles very little game logic.
 * Mainly creates the cards and handles the outputs
 */
class Memory extends DraggableWindow {
  /**
   * Constructor for the Memory board custom element.
   */
  constructor () {
    super()
    const style = document.createElement('style')
    style.textContent = `
      .window-content {
          background-color: white; /* Correct CSS property */
          display: flex;
          align-items: center;
          justify-content: center;
      }
      .window-content select {
        height: 30px;
        width: 100px;
      }
      .window-content button{
        background: green;
        border-bottom: 6px inset rgba(0,0,0,.5);
        border-left: 6px inset rgba(0,0,0,.5);
        border-right: 6px inset rgba(255,255,255,.5);
        box-sizing: border-box;
        color: white;
        cursor: pointer;
        display: inline-block;
        font-size: 2.2rem;
        margin: 1rem;
        min-width: 200px;
        padding: .5rem;
        text-transform: uppercase;
        width: auto;
        
        &:focus,
        &:hover {
          background: #BCBCBC;
        }
      }
      
      input[type="file"] {
        outline: none;
        padding: 4px;
        margin: -4px;
      }
      
      input[type="file"]:focus-within::file-selector-button,
      input[type="file"]:focus::file-selector-button {
        outline: 2px solid #0964b0;
        outline-offset: 2px;
      }
      
      input[type="file"]::before {
        top: 16px;
      }
      
      input[type="file"]::after {
        top: 14px;
      }
      
      /* ------- From Step 2 ------- */
      
      input[type="file"] {
        position: relative;
      }
      
      input[type="file"]::file-selector-button {
        width: 136px;
        color: transparent;
      }
      
      /* Faked label styles and icon */
      input[type="file"]::before {
        position: absolute;
        pointer-events: none;
        /*   top: 11px; */
        left: 40px;
        color: #0964b0;
        content: "Upload File";
      }
      
      input[type="file"]::after {
        position: absolute;
        pointer-events: none;
        /*   top: 10px; */
        left: 16px;
        height: 20px;
        width: 20px;
        content: "";
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230964B0'%3E%3Cpath d='M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z'/%3E%3C/svg%3E");
      }
      
      /* ------- From Step 1 ------- */
      
      /* file upload button */
      input[type="file"]::file-selector-button {
        border-radius: 4px;
        padding: 0 16px;
        height: 40px;
        cursor: pointer;
        background-color: white;
        border: 1px solid rgba(0, 0, 0, 0.16);
        box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.05);
        margin-right: 16px;
        transition: background-color 200ms;
      }
      
      /* file upload button hover state */
      input[type="file"]::file-selector-button:hover {
        background-color: #f3f4f6;
      }
      
      /* file upload button active state */
      input[type="file"]::file-selector-button:active {
        background-color: #e5e7eb;
        border-top: 6px inset rgba(255,255,255,.5);
      }
      `
    this.shadowRoot.appendChild(style)

    document.addEventListener('correctMemory', (event) => { // When a card is matched
      if (event.detail.parent === this.parent) {
        this.updateScore(event.detail.score)
      }
    })
    document.addEventListener('attemptMemory', (event) => { // When a attempt is made
      if (event.detail.parent === this.parent) {
        this.updateAttempts(event.detail.attempts)
      }
    })
  }

  /**
   * Connected Callback called when the element is added to the DOM.
   */
  connectedCallback () {
    super.connectedCallback()
    this.initGame()
    document.addEventListener('restartMemory', (event) => {
      if (event.detail.parent === this.parent) { // If the correct restart button is clicked
        this.initGame()
      }
    })
  }

  /**
   * Initializes the game and creates all of the memory cards.
   */
  initGame () {
    this.shadowRoot.querySelector('.window-content').innerHTML = '' // Clear existing content
    this.shadowRoot.querySelector('.window-title').innerHTML = 'Memory'
    const imageSelect = document.createElement('input') // Create the image select
    imageSelect.setAttribute('type', 'file')
    imageSelect.setAttribute('accept', '.jpg, .jpeg')
    if (localStorage.getItem('memoryImage')) { // If there is a image in local storage, set it as the value
      imageSelect.setAttribute('value', localStorage.getItem('memoryImage'))
    }

    imageSelect.addEventListener('change', (event) => { // When a image is selected
      const reader = new FileReader()
      /**
       * Function that loads the image into local storage.
       *
       * @param {string} e the event
       */
      reader.onload = (e) => {
        const base64String = e.target.result
        localStorage.setItem('memoryImage', base64String) // Set the image in local storage
      }

      reader.readAsDataURL(event.target.files[0])
    })

    this.shadowRoot.querySelector('.window-content').appendChild(imageSelect)
    const startButton = document.createElement('button')
    startButton.innerHTML = 'Start'
    this.shadowRoot.querySelector('.window-content').appendChild(document.createElement('br'))
    this.shadowRoot.querySelector('.window-content').appendChild(startButton)
    this.gridPicker = document.createElement('select')
    this.gridPicker.innerHTML = `
      <option value="16">4x4</option>
      <option value="8">4x2</option>
      <option value="4">2x2</option>
      <option value="20">5x4</option>
    `
    this.shadowRoot.querySelector('.window-content').appendChild(this.gridPicker)
    startButton.addEventListener('click', () => this.startGame()) // When the start button is clicked
  }

  /**
   * Starts the game by setting all the scores and values.
   */
  startGame () {
    if (!localStorage.getItem('memoryImage')) {
      localStorage.setItem('memoryImage', 'https://i.imgur.com/5qyCZrD.png') // set a default image if none is selected
    }
    const choice = this.gridPicker.value // Get the grid size
    this.parent = this.getAttribute('parent') // set the parent
    score[this.parent] = 0 // reset all the scores
    attempts[this.parent] = 0
    winScore[this.parent] = choice / 2
    this.populateCards(choice) // Populate the cards
  }

  /**
   * Populates the board with the cards.
   *
   * @param {number} choice The chosen grid size.
   */
  populateCards (choice) {
    const memoryContent = this.shadowRoot.querySelector('.window-content')
    memoryContent.innerHTML = `
      <style>
      .memory-container {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          height: 100%;
          align-content: center;
          justify-content: center;
      }
      </style>
      <p>Score: <span id="score">0</span></p>
      <p>Attempts: <span id="attempts">0</span></p>
      <div class="memory-container"></div>
    `
    const memoryContainer = memoryContent.querySelector('.memory-container')
    const colors = ['red', 'grey', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white']
    colors.length = choice / 2 // Set the amount of colors to the grid size
    const cards = []

    colors.forEach((color, index) => { // create all of the card objects
      cards.push({ id: index, color })
      cards.push({ id: index, color })
    })

    /**
     * Shuffles an array.
     *
     * @param {Array} array the cards.
     */
    function shuffleArray (array) { // Shuffle the cards
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]] // Swap elements
      }
    }
    shuffleArray(cards)

    cards.forEach(card => { // for each card, create a memory-card element and give it the attributes
      const cardElement = document.createElement('memory-card')
      cardElement.setAttribute('color', card.color)
      cardElement.setAttribute('id', card.id)
      cardElement.setAttribute('parent', this.parent) // if necessary
      memoryContainer.appendChild(cardElement)
    })
  }

  /**
   * Updates the score that is shown.
   *
   * @param {number} newScore The new score.
   */
  updateScore (newScore) {
    const scoreElement = this.shadowRoot.querySelector('#score')
    if (scoreElement) {
      scoreElement.textContent = newScore
    }
  }

  /**
   * Updates the attempts that is shown.
   *
   * @param {number} newAttempts The new attempts.
   */
  updateAttempts (newAttempts) {
    const attemptsElement = this.shadowRoot.querySelector('#attempts')
    if (attemptsElement) {
      attemptsElement.textContent = newAttempts
    }
  }
}

customElements.define('memory-window', Memory)
