//Update Price function  
import Orders from "../models/Order.js"
import Chats from "../models/Chat.js";

const updatePrice = async (order) => {
    console.log("updatePrice function");

    if(!order){
        return {
            status : "error",
            message : "request parameter error"
        };
    }
    
    try {

        const order_subtotal_price = calculatePrice(order);
        const result = await Orders.updateOne(
            {order_id : order.order_id},
            {$set : { order_subtotal_price }}
        );

        if (result.nModified === 0) {
            return {
                status : "error",
                message : "update price error"
            };
        }

        return {
            status : "success",
            data : {
                ...order,
                order_subtotal_price : order_subtotal_price
            }
        };
    }
    catch (err) {
        return {
            status : "error",
            message : err
        };
    }
}

const updateOrder = async (order) => {

    if(!order){
        return {
            status : "error",
            message : "request parameter error"
        };
    }
    
    try {

        const order_subtotal_price = calculatePrice(order);
        const result = await Orders.updateOne(
            {order_id : order.order_id},
            {$set : { order_status : "1" }}
        );

        if (result.nModified === 0) {
            return {
                status : "error",
                message : "update order error"
            };
        }

        return {
            status : "success",
            data : {
                ...order,
                order_subtotal_price : order_subtotal_price
            }
        };
    }
    catch (err) {
        return {
            status : "error",
            message : err
        };
    }

}

const insertChatHistory = async ({driverId, clientId, senderType, content}) => {
    try {
        let chat = await Chats.findOne({ driver: driverId, client: clientId });

        if (!chat) {
            chat = new Chats({ driver: driverId, client: clientId, messages: [] });
        }

        chat.messages.push({ senderType, content });
        
        chat.lastUpdated = Date.now();
        return await chat.save();
    } catch (error) {
        throw error;
    }
};


// Calculates the minimum amount as per the policy
const calculatePrice = (order) => {
    //------------body -------------

    return 100;
}

export {
    updatePrice,
    updateOrder,
    insertChatHistory
};