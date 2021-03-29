// Task 2:
// 1) Track real-time CPU utilization of the node server and on 70% usage restart the server.
// 2) Create a post-service that takes the message, day, and time in body parameters and it inserts that message into DB at that particular day and time.

var router = require("express").Router();
var schedule = require('node-schedule');
module.exports = function (arrg) {

    // 1 - in Controller file at line 23-25

    // 2 - Supposing Message Model-Schema with message fields.
    router.post("/scheduleMessage", (req, res, next) => {
        let { message, date, time } = req.body;
        date = new Date(date);
        let rule = new schedule.RecurrenceRule();
        rule.year = date.getFullYear();
        rule.month = date.getMonth();
        rule.date = date.getDate();
        rule.hour = time.getHour();
        rule.minute = time.getMinute();

        schedule.scheduleJob(rule, function () {
            Message.create({ "message": message }).then(message_sent => {
                res.send({ msg: message_sent })
            }).catch(() => {
                return res.status(422).send({ content: "Can't create the message entry as scheduled" });
            })
        })
    })



    // Task 2 => ii ) This task is independent of the above task. You can have two collections collection and collection 2. On post request, a message and timestamp will get saved into the collection and a job will be scheduled on the timestamp which transfers the message from collection 1 to collection 2

    router.post("/shiftingMessage", (req, res, next) => {
        const { message, timestamp } = req.body;

        let time_given = new Date(timestamp);

        let rule = new schedule.RecurrenceRule();
        rule.year = time_given.getFullYear();
        rule.month = time_given.getMonth();
        rule.date = time_given.getDate();
        rule.hour = time_given.getHour();
        rule.minute = time_given.getMinute();

        Collection_One.create({ message, timestamp }).then(data_in_collection_1 => {
            schedule.scheduleJob(rule, function () {
                Collection_Two.create({ 'message': data_in_collection_1.message });
                Collection_one.findOneAndRemove({ 'message': data_in_collection_1.message });
            })
        }).catch(() => {
            return res.status(422).send({ content: "Can't create the message" });
        });
    });
    return router;
}