import './window/window.js'
import './memory/memory.js'
import './chat/chat.js'
import './maps/maps.js'

let parent = 0

document.querySelector('#memorybutton').addEventListener('click', () => { // when the memory button is clicked
  const memoryWindow = document.createElement('memory-window')
  document.body.appendChild(memoryWindow)
  console.log(parent)
  memoryWindow.setAttribute('parent', parent)
  parent++
})

document.querySelector('#chatbutton').addEventListener('click', () => { // when the chat button is clicked
  if (document.querySelector('chat-window') == null) { // if there is no chat window
    const chatWindow = document.createElement('chat-window') // create a new chat window
    document.body.appendChild(chatWindow)
  // eslint-disable-next-line eqeqeq
  } else if (localStorage.getItem('username') == undefined) { // if there is a chat window but no username
    // Dont do anything
  } else {
    const chatWindow = document.createElement('chat-window') // if there is a chat window and a username
    document.body.appendChild(chatWindow)
  }
})

document.querySelector('#mapsbutton').addEventListener('click', () => { // when the maps button is clicked
  const mapsWindow = document.createElement('maps-window')
  document.body.appendChild(mapsWindow)
})

document.addEventListener('reloadChat', () => { // when the reloadChat event is fired
  document.querySelectorAll('chat-window').forEach((chat) => {
    chat.remove()
  })
  const chatWindow = document.createElement('chat-window') // create a new chat window
  document.body.appendChild(chatWindow)
})

const clock = document.querySelector('#clock')
/**
 * Clock function because it was fun to make.
 */
function updateClock () {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const timeString = `${hours}:${minutes}:${seconds}`
  clock.textContent = timeString
}

setInterval(updateClock, 1000)
