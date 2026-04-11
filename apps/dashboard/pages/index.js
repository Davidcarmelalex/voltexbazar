import { useState } from 'react'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')

  const sendQuery = async () => {
    const res = await fetch('http://localhost:8000/ai-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
    const data = await res.json()
    setResponse(data.response)
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Voltex Dashboard</h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask Hermes..."
        style={{ width: '100%', height: 100 }}
      />

      <button onClick={sendQuery}>Run AI</button>

      <pre>{response}</pre>
    </div>
  )
}
