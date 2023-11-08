import { chatList } from "../../utils/chat.js"

// Chat Module
export const chat_module = (socket) => {
    // Get request for chat history for the loggedIn user
    socket.on('chat_history_request',async () => {
    // Send back chat history to the user 
        socket.emit('get_chat_list',{
            data:await chatList()
        })
    })
}