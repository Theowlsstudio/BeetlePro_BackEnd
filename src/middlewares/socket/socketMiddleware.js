import jwt from "jsonwebtoken";
import Users from '../../models/User.js';

const socketMiddleware = async (socket, next) => {
    const token = socket.handshake.query.token;
    try {

        if (!token) {
            return next(new Error('Authentication error'));
        };
        const { _id, email } = jwt.verify(token, process.env.JWT_SECRET);
        if (!_id || !email) {
            return next(new Error('Authentication error'));
        }
        let user = await Users.findOne({ _id: _id }).select('-password').lean().exec();
        if (!user) {
            return next(new Error('User not found'));
        }
        next();

    } catch (error) {
        return next(new Error('Authentication middleware error'));
    }
};

export default socketMiddleware;