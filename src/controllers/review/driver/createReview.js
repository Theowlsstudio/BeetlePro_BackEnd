import Orders from "../../../models/Order.js";
import handleError from "../../../utils/ReturnError.js";
import config from '../../../../config.js';
import Reviews from "../../../models/Review.js";
import Users from "../../../models/User.js";
import calculateTotalRating from "../../../utils/getTotalRating.js";

const createReview = async (req, res) => {

    try {
        let driver = req.user;

        let { order_id, text, rating } = req.body;

        let order = await Orders.findOne({ order_id });

        if (!order) {
            return res.status(404).json({ msg: "Order not found!" });
        };

        if (order.order_status !== config.order_status.completed) {
            return res.status(400).json({ msg: "Order hasn't yet been completed", status: false })
        }

        if (order?.reviewed_by_driver && order?.review_id?.driver) {
            return res.status(400).json({ msg: "Order has already been reviewd", status: false })
        }

        let user = await Users.findOne({ _id: order.sender_id });

        let review = await Reviews.create(
            {
                userRef: {
                    id: user._id,
                    name: user?.name,
                    email: user?.email,
                    image: user?.image,
                    user_phone: user?.user_phone
                },
                orderRef: order._id,
                driverRef: {
                    id: driver._id,
                    name: driver?.name,
                    email: driver?.email,
                    image: driver?.image,
                    user_phone: driver?.user_phone
                },
                text,
                rating
            });

        await review.save();

        order.reviewed_by_driver = true;
        order.review_id.driver = review._id;
        await order.save();

        let reviewData = {
            id: review._id,
            rating,
            text
        }

        user.reviews = [...user.reviews, reviewData];
        let total_ratings = calculateTotalRating(user.reviews);

        user.total_ratings = total_ratings;

        await user.save();

        return res.status(200).json({ msg: "Review added successfuly", status: true })

    } catch (error) {
        const response = handleError(error);
        return res.status(response.statusCode).json({ msg: response.body, status: false });
    }
};

export default createReview;