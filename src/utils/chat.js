import Chats from "../models/Chat.js";
import Messages from "../models/Messages.js";
import mongoose from "mongoose";

const objectId = mongoose.Types.ObjectId;
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
export const conversation = async (loggedInUser, conversationId) => {
  const listChat = await Chats.aggregate([
    {
      $match: {
        _id: new objectId(conversationId),
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
                    $eq: ["$$item.senderId", new objectId(loggedInUser)],
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
  return listChat;
};

export const chatList = async () => {
  const list = await Chats.aggregate([
    {
      $match: {
        $or: [
          {
            driver: new objectId("6526d676dcee5acd6a28016d"),
          },
          {
            client: new objectId("6526d676dcee5acd6a28016d"),
          },
        ],
      },
    },
    {
      $lookup: {
        from: "drivers",
        localField: "driver",
        foreignField: "_id",
        as: "driver_data",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "client",
        foreignField: "_id",
        as: "client_data",
      },
    },
    {
      $set: {
        driver_details: {
          name: {
            $ifNull: [
              {
                $first: "$driver_data.name",
              },
              "",
            ],
          },
          image: {
            $ifNull: [
              {
                $first: "$driver_data.image",
              },
              "",
            ],
          },
        },
        client_details: {
          name: {
            $ifNull: [
              {
                $first: "$client_data.name",
              },
              "",
            ],
          },
          image: {
            $ifNull: [
              {
                $first: "$client_data.user_image",
              },
              "",
            ],
          },
        },
      },
    },
    {
      $set: {
        user_name: {
          $cond: [
            {
              $eq: [new objectId("6526d1ca76cec2d8d6d94f9f"), "$driver"],
            },
            "$client_details.name",
            "$driver_details.name",
          ],
        },
        user_image: {
          $cond: [
            {
              $eq: [new objectId("6526d1ca76cec2d8d6d94f9f"), "$driver"],
            },
            "$client_details.image",
            "$driver_details.image",
          ],
        },
        lastMessage: {
          $arrayElemAt: ["$messages", -1],
        },
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "lastMessage",
        foreignField: "_id",
        as: "lastMessage",
      },
    },
    {
      $set: {
        lastMessage: {
          $ifNull: [
            {
              $first: "$lastMessage",
            },
            null,
          ],
        },
      },
    },
    {
      $set: {
        time: {
          $ifNull: [
            {
              timeDifference: {
                $subtract: [
                  new Date(), // Current time
                  { $toDate: "$lastMessage.createdAt" }, // Convert the field to a date
                ],
              },
            },
            "",
          ],
        },
        dayOfWeek: {
          $dayOfWeek: { date: { $toDate: "$lastMessage.createdAt" } },
        },
      },
    },
    {
      $set: {
        date: {
          $trunc: {
            $divide: ["$time.timeDifference", 86400000],
          },
        },

        dayName: {
          $switch: {
            branches: [
              { case: { $eq: ["$dayOfWeek", 1] }, then: "Sunday" },
              { case: { $eq: ["$dayOfWeek", 2] }, then: "Monday" },
              { case: { $eq: ["$dayOfWeek", 3] }, then: "Tuesday" },
              { case: { $eq: ["$dayOfWeek", 4] }, then: "Wednesday" },
              { case: { $eq: ["$dayOfWeek", 5] }, then: "Thursday" },
              { case: { $eq: ["$dayOfWeek", 6] }, then: "Friday" },
              { case: { $eq: ["$dayOfWeek", 7] }, then: "Saturday" },
            ],
            default: "Sunday",
          },
        },
      },
    },
    {
      $set: {
        time: {
          $switch: {
            branches: [
              {
                case: { $lt: ["$date", 1] },
                then: {
                  $dateToString: {
                    format: "%H:%M",
                    date: { $toDate: "$lastMessage.createdAt" },
                  },
                },
              },
              { case: { $lt: ["$date", 2] }, then: "Yesterday" },
              { case: { $eq: ["$date", 3] }, then: "$dayName" },
              {
                case: { $gte: ["$date", 3] },
                then: {
                  $dateToString: {
                    format: "%m-%d-%Y", // Change format to "%B %d, %Y" for "month date year"
                    date: { $toDate: "$lastMessage.createdAt" },
                  },
                },
              },
            ],
            default: "",
          },
        },
      },
    },
    {
      $project: {
        user_name: 1,
        user_image: 1,
        lastMessage: {
          content: {
            $ifNull: ["$lastMessage.message", ""],
          },
          time: "$time",
        },
      },
    },
  ]);

  return list;
};
