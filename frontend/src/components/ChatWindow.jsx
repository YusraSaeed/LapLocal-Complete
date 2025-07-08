

// "use client"
// import { useState } from "react"
// import { X, Maximize2, Minimize2 } from "lucide-react"
// import ReactMarkdown from "react-markdown"
// import { useAppContext } from "../context/AppContext"

// const ChatWindow = ({ isOpen, onClose }) => {
//   const { userData } = useAppContext()
//   console.log(userData)
//   console.log(userData?._id)

//   const [chatMessages, setChatMessages] = useState([
//     {
//       type: "bot",
//       message: "Hi, How can I help you?",
//     },
//   ])
//   const [chatInput, setChatInput] = useState("")
//   const [isTyping, setIsTyping] = useState(false)
//   const [isFullscreen, setIsFullscreen] = useState(false)

//   const handleSendMessage = async () => {
//     const input = chatInput.trim()
//     if (!input) return

//     setChatMessages((prev) => [...prev, { type: "user", message: input }])
//     setChatInput("")
//     setIsTyping(true)

//     try {
//       const response = await fetch("http://localhost:5000/api/v1/chatbot/chatbot", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           question: input,
//           user_id: userData?._id, // Pass user_id to backend
//         }),
//       })

//       if (!response.ok) {
//         const error = await response.text()
//         throw new Error(error || "Server error")
//       }

//       const data = await response.json()

//       setChatMessages((prev) => [...prev, { type: "bot", message: data.response }])
//     } catch (error) {
//       console.error("Chatbot fetch error:", error.message)
//       setChatMessages((prev) => [...prev, { type: "bot", message: "❌ Sorry, something went wrong. Try again later." }])
//     } finally {
//       setIsTyping(false)
//     }
//   }

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSendMessage()
//     }
//   }

//   const toggleFullscreen = () => {
//     setIsFullscreen(!isFullscreen)
//   }

//   if (!isOpen) return null

//   return (
//     <div className={`fixed z-50 ${isFullscreen ? "inset-0 p-4" : "bottom-6 right-22"}`}>
//       <div className={`bg-white rounded-2xl shadow-xl flex flex-col ${isFullscreen ? "w-full h-full" : "w-80 h-96"}`}>
//         {/* Chat Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200">
//           <h3 className="font-semibold text-gray-900">Chat Support</h3>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={toggleFullscreen}
//               className="p-1 hover:bg-gray-100 rounded-full"
//               title={isFullscreen ? "Minimize" : "Fullscreen"}
//             >
//               {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
//             </button>
//             <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Chat Messages */}
//         <div className="flex-1 p-4 overflow-y-auto space-y-4">
//           {chatMessages.map((msg, index) => (
//             <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
//               <div className="flex items-start gap-2 max-w-xs">
//                 {msg.type === "bot" && (
//                   <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
//                     <span className="text-white text-xs font-bold">🤖</span>
//                   </div>
//                 )}
//                 <div
//                   className={`px-4 py-2 rounded-2xl text-sm ${
//                     msg.type === "user" ? "bg-gray-900 text-white" : "bg-orange-500 text-white"
//                   }`}
//                 >
//                   {msg.type === "bot" ? <ReactMarkdown>{msg.message}</ReactMarkdown> : <p>{msg.message}</p>}
//                 </div>
//                 {msg.type === "user" && (
//                   <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
//                     <span className="text-white text-xs font-bold">👤</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {/* Typing Indicator */}
//           {isTyping && (
//             <div className="flex justify-start">
//               <div className="flex items-start gap-2 max-w-xs">
//                 <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
//                   <span className="text-white text-xs font-bold">🤖</span>
//                 </div>
//                 <div className="px-4 py-2 rounded-2xl text-sm bg-orange-500 text-white">
//                   <p>Bot is typing...</p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Chat Input */}
//         <div className="p-4 border-t border-gray-200">
//           <div className="flex items-center gap-2">
//             <input
//               type="text"
//               value={chatInput}
//               onChange={(e) => setChatInput(e.target.value)}
//               placeholder="Ask Question"
//               className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//               onKeyPress={handleKeyPress}
//               disabled={isTyping}
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={isTyping}
//               className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l7 7-7 7M5 12h14" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ChatWindow


// above is v0 ver

"use client"

import { useState } from "react"
import { X, Maximize, Minimize, Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useAppContext } from "../context/AppContext"

const ChatWindow = ({ isOpen, onClose }) => {
  const { userData } = useAppContext();
  const [chatMessages, setChatMessages] = useState([
    { type: "bot", message: "Hi, How can I help you?" },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  const handleSendMessage = async () => {
    const input = chatInput.trim()
    if (!input) return

    setChatMessages((prev) => [...prev, { type: "user", message: input }])
    setChatInput("")
    setIsTyping(true)

    try {
      const response = await fetch("http://localhost:5000/api/v1/chatbot/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          user_id: userData?._id,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || "Server error")
      }

      const data = await response.json()

      setChatMessages((prev) => [
        ...prev,
        { type: "bot", message: data.response },
      ])
    } catch (error) {
      console.error("Chatbot fetch error:", error.message)
      setChatMessages((prev) => [
        ...prev,
        { type: "bot", message: "❌ Sorry, something went wrong. Try again later." },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage()
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed ${isFullScreen ? "inset-0" : "bottom-6 right-22"} z-50`}
    >
      <div className={`bg-white rounded-2xl shadow-xl ${isFullScreen ? "w-full h-full" : "w-80 h-96"} flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Chat Support</h3>
          <div className="flex gap-2 items-center">
            <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-1 hover:bg-gray-100 rounded-full">
              {isFullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-2 ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              {msg.type === "bot" && <Bot className="w-4 h-4 mt-1 text-orange-500" />}
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  msg.type === "user" ? "bg-gray-900 text-white" : "bg-orange-500 text-white"
                }`}
              >
                {msg.type === "bot" ? (
                  <ReactMarkdown>{msg.message}</ReactMarkdown>
                ) : (
                  <p>{msg.message}</p>
                )}
              </div>
              {msg.type === "user" && <User className="w-4 h-4 mt-1 text-gray-800" />}
            </div>
          ))}
          {isTyping && (
            <div className="text-xs text-gray-500 italic mt-2">Bot is typing...</div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Question"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSendMessage}
              className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5l7 7-7 7M5 12h14" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow


