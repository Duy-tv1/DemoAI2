import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Format message content để hiển thị markdown cơ bản
  const formatMessage = (content) => {
    // Convert markdown tables to HTML
    const lines = content.split('\n');
    let inTable = false;
    let formattedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect table start (line with |)
      if (line.includes('|') && !inTable) {
        inTable = true;
        formattedLines.push('<table>');
        
        // Process header row
        const headerCells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
        formattedLines.push('<thead><tr>');
        headerCells.forEach(cell => {
          formattedLines.push(`<th>${cell}</th>`);
        });
        formattedLines.push('</tr></thead><tbody>');
        
        // Skip separator line (next line with |---|)
        if (i + 1 < lines.length && lines[i + 1].includes('|') && lines[i + 1].includes('-')) {
          i++;
        }
      }
      // Process table rows
      else if (line.includes('|') && inTable) {
        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
        if (cells.length > 0) {
          formattedLines.push('<tr>');
          cells.forEach(cell => {
            formattedLines.push(`<td>${cell}</td>`);
          });
          formattedLines.push('</tr>');
        }
      }
      // End table when no more | lines
      else if (!line.includes('|') && inTable) {
        inTable = false;
        formattedLines.push('</tbody></table>');
        if (line) formattedLines.push(line);
      }
      // Regular lines
      else if (!inTable) {
        formattedLines.push(line);
      }
    }
    
    // Close table if still open
    if (inTable) {
      formattedLines.push('</tbody></table>');
    }
    
    content = formattedLines.join('\n');
    
    // Replace code blocks với <pre><code>
    content = content.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
    
    // Replace inline code với <code>
    content = content.replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Replace **bold** với <strong>
    content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    
    // Replace *italic* với <em>
    content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    
    // Convert line breaks to <br> for better formatting
    content = content.replace(/\n/g, '<br>')
    
    return content
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = { role: 'user', content: inputMessage }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch(import.meta.env.VITE_GPT_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GPT_API_KEY}`
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_GPT_MODEL,
          messages: [...messages, userMessage],
          max_tokens: 1000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const assistantMessage = {
        role: 'assistant',
        content: data.choices[0].message.content
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'Xin lỗi, đã có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-app">
      <div className="chat-header">
        <h1>Chat với GPT-OSS-120B</h1>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            Chào bạn! Tôi là GPT-OSS-120B. Hãy gửi tin nhắn để bắt đầu cuộc trò chuyện.
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div 
              className="message-content"
              dangerouslySetInnerHTML={{ 
                __html: formatMessage(message.content) 
              }}
            />
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant">
            <div className="message-content loading">
              Đang soạn tin nhắn...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn của bạn..."
          disabled={isLoading}
          rows="3"
        />
        <button 
          onClick={sendMessage} 
          disabled={isLoading || !inputMessage.trim()}
        >
          {isLoading ? 'Đang gửi...' : 'Gửi'}
        </button>
      </div>
    </div>
  )
}

export default App
