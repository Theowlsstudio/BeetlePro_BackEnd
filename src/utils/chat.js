import Chats from "../models/Chat.js";
import Messages from "../models/Messages.js";
import mongoose from 'mongoose'

const objectId = mongoose.Types.ObjectId
// Create topic each order 
export const create_topic = async (driver, client, order) => {
  try {
    const topic = await Chats.findOne({ driver, client, order });
    if (topic) {
      return topic._id;
    } else {
      const new_topic = new Chats({
        driver,
        client,
        order,
      });
      const saveTopic = await new_topic.save();
      return saveTopic._id;
    }
  } catch (error) {
    return error;
  }
};

// Aggregation function for Chat

//Create message / Send message
export const create_message = async (senderType, senderId, message, chatId) => {
  try {
    const newMessage = new Messages({
      senderType,
      senderId,
      message,
    });
    const savedMessage = await newMessage.save();
    await Chats.findByIdAndUpdate(
      {
        _id: chatId,
      },
      {
        $push: {
          messages: savedMessage._id,
        },
      }
    );
    return savedMessage;
  } catch (error) {
    return error?.message;
  }
};

// It will fetch conversation of an order of driver and users
export const conversation = async () => {
  const listChat = await Chats.aggregate([
    {
      $match: {
        _id: new objectId("654930bbf7bccb4d695a6956"),
      },
    },
    {
      $lookup: {
        from: "drivers",
        localField: "driver",
        foreignField: "_id",
        as: "driver",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "client",
        foreignField: "_id",
        as: "client",
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "messages",
        foreignField: "_id",
        as: "messages",
      },
    },
    {
      $set: {
        driver: {
          $ifNull: [
            {
              $first: "$driver.name",
            },
            "",
          ],
        },
        client: {
          $ifNull: [
            {
              $first: "$client.name",
            },
            "",
          ],
        },
      },
    },
    {
      $addFields: {
        messages: {
          $map: {
            input: "$messages",
            as: "item",
            in: {
              $mergeObjects: [
                "$$item",
                {
                  own: {
                    $eq: [
                      "$$item.senderId",
                      new objectId("6526d1ca76cec2d8d6d94f9f"),
                    ],
                  },
                  realDateTime: {
                    $dateToString: {
                      format: "%H:%M",
                      date: {
                        $toDate: "$$item.createdAt",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  ]);
  return listChat
};
