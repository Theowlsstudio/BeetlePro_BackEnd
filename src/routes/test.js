import express from 'express';
import Dummys from '../models/Dummy.js';
import scheduleOrder from '../utils/scheduleOrder.js';


const router = express.Router();


router.post('/schedule-order', async (req, res) => {
    try {
        // let { scheduled_time } = req.body;

        // let Dummy = await Dummys.create({ scheduled_time, order_status: "scheduled" })
        // await Dummy.save();

        // scheduleOrder();

        const cronTime = new Date("2023-10-13T12:18");
        let date = cronTime.getDate();
        let year = cronTime.getFullYear();
        let day = cronTime.getDay();
        let time = cronTime.getTime();
        let hours = cronTime.getHours();
        let minutes = cronTime.getMinutes();
        let seconds = cronTime.getSeconds();
        const period = hours < 12 ? 'AM' : 'PM';
        return res.status(200).json({ cronTime, period, seconds, time, minutes, hours, day, date, year})

    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
})

export default router;