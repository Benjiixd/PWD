import { DraggableWindow } from '../window/window.js'

/**
 * Maps web component.
 * Extends DraggableWindow, all of the data is shown inside one
 */
class Maps extends DraggableWindow {
  /**
   * Constructor.
   * Creates the shadow DOM and appends the template to it.
   */
  constructor () {
    super()
    const mapsTemplate = document.createElement('template')
    mapsTemplate.innerHTML = `
    <style>
            .window-content {
                background-color: white; /* Correct CSS property */
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }

            iframe {
                width: 570px;
                height: 490px;
            }
        </style>
            
        `
    this.shadowRoot.appendChild(mapsTemplate.content.cloneNode(true))
    this.shadowRoot.querySelector('.window-title').innerHTML = 'Maps'
  }

  /**
   * Called when the element is added to the DOM.
   */
  connectedCallback () {
    super.connectedCallback() // Ensure the parent's connectedCallback is called
    // Additional initialization if needed
    const MapsContent = this.shadowRoot.querySelector('.window-content')
    MapsContent.appendChild(document.createElement('iframe'))
    const searchTemplate = document.createElement('template')
    searchTemplate.innerHTML = `
    <input type="text" id="search" name="search" placeholder="Search..">
            <input type="submit" value="Submit">
    `
    MapsContent.appendChild(searchTemplate.content.cloneNode(true))
    const search = this.shadowRoot.querySelector('#search')
    const submit = this.shadowRoot.querySelector('input[type="submit"]')
    let pos = {} // Position of the user
    navigator.geolocation.getCurrentPosition((position) => {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      const link = `https://dev.virtualearth.net/REST/v1/Imagery/Map/AerialWithLabels/${pos.lat},${pos.lng}/15?mapSize=570,490&key=AsChnuVNUPaEy_mOxVZoXbcatHRlqE85d0fDcrq0W6jHcG7dHwr1jVnqS0HNwPKU`
      MapsContent.querySelector('iframe').src = link // show the users location on open
    })
    submit.addEventListener('click', () => { // show the searched location
      const link = `https://dev.virtualearth.net/REST/v1/Imagery/Map/AerialWithLabels/${search.value}?mapSize=570,490&key=AsChnuVNUPaEy_mOxVZoXbcatHRlqE85d0fDcrq0W6jHcG7dHwr1jVnqS0HNwPKU`
      MapsContent.querySelector('iframe').src = link
    })
  }
}
customElements.define('maps-window', Maps) // Use a hyphenated name for custom elements
