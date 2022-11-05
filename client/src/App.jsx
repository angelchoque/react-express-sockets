import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket = io()
// const socket = io('http://localhost:4000')

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', message)
    const newMessage = {
      body: message,
      from: "Me"
    }
    setMessage('')
    setMessages(prev => [newMessage, ...prev])
  }

  useEffect(() => {
    const resMessage = message => {
      setMessages(prev => [message, ...prev])
    }
    socket.on('message', resMessage )
    return () => { socket.off('message', resMessage) }
  }, [messages])

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <h1 className='text-2xl font-bold my-2'>Chat Socket</h1>
        <input
          className='border-2 border-zinc-200 p-2 text-black w-full'
        value={message} onChange={e => setMessage(e.target.value)} />
        {/* <button className='bg-blue-500'>send</button> */}
        <ul className='h-80 overflow-y-auto'>
          {messages.map((message, index) =>
          <li key={index}
          className={`p-2 my-2 rounded-md text-sm table
          ${message.from === "Me"
          ? 'bg-sky-700 ml-auto'
          : 'bg-black'}`}>
            <p>{message.from}: {message.body}</p>
          </li>)}
        </ul>
      </form>
    </div>
  )
}

export default App
