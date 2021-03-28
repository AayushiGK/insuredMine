// Task 1:
// 2) Search API to find policy info with the help of username.
// 3) API to provide aggregated policy by each user.

var router = require("express").Router();
module.exports = function (arrg) {
    const { Users, Policies } = arrg.models;

    //2
    router.get("/searchPolicy", (req, res, next) => {
        let { firstname } = req.body.firstname;
        Users.findOne({ 'first_name': firstname }).then(user_data => {
            if (user_data) {
                Policies.findAll({ "user_id": user_data.email }).then(policy_data => {
                    res.send({ data: policy_data });
                }).catch(() => {
                    return res.status(422).send({ content: "Encounter Error While getting policy info" });
                })
            }
        }).catch(() => {
            return res.status(422).send({ content: "Can't find user" });
        });
    })

    //3
    router.get("/aggregatedPolicy", (req, res, next) => {
        Users.aggregate([
            {
                $lookup:
                {
                    from: Policies,
                    localField: "email",
                    foreignField: "user_id",
                    as: "policy_details"
                }
            }
        ]).then(user_n_policy_data => {
            res.send({ data: user_n_policy_data });
        }).catch(() => {
            return res.status(422).send({ content: "Encounter Error While getting policy info" });
        })
    });

return router;
}