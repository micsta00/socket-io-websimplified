import { useState } from 'react'

function App() {


  return (
    <div id="main-container">
      <div id="message-container"></div>
      <form id="send-container">
        <input type="text" id="message-input" />
        <button type="submit" id="send-button">Send</button>
      </form>
    </div>
  )
}

export default App
