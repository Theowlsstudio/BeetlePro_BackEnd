import cron from 'node-cron';

let scheduleOrder = () => {
    let task = cron.schedule('* * * * * *', () => {
        console.log('running a task every minute');
    });
    task.stop();
};

export default scheduleOrder;