import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [{
        senderType: {
            type: String,  // 'Driver' or 'Client'
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const Chats = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);

export default Chats;
