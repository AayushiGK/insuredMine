//woker over readstream
module.exports = function (arrg) {
    var fs = require('fs');
    var parse = require('csv-parse');
    var parser = parse({ columns: true }, function (err, records) { });
    var readerStream = fs.createReadStream(__dirname + '/data-sheet.csv').pipe(parser);
    readerStream.on('data', function (data) {
        updateDb(data, arrg);
    })
}

// Task 1:
// 1) Create API to upload the attached XLSX/CSV data into MongoDB. (Please accomplish this using worker threads)
// 4) Consider each info as a different collection in MongoDB (Agent, User, User's Account, LOB, Carrier, Policy).
function updateDb(newReading, arrg) {
    const { Agents, Users, UserAccounts, PolicyCategories, PolicyCarriers, Policies } = arrg.models;
    let users = new Users({
        'first_name': newReading.firstname,
        'dob': newReading.dob,
        'address': newReading.address,
        'phone_number': newReading.phone,
        'state': newReading.state,
        'zip_code': newReading.zip,
        'email': newReading.email,
        'gender': newReading.gender,
        'user_type': newReading.userType
    });
    let policies = new Policies({
        'producer': newReading.producer,
        'policy_number': newReading.policy_number,
        'policy_start_date': newReading.policy_start_date,
        'policy_end_date': newReading.policy_end_date,
        'policy_category': newReading.policy_type,
        'collection_id': newReading.policy_mode,
        'premium_amount': newReading.premium_amount,
        'account_type': newReading.account_type,
        'csr': newReading.csr,
        'user_id': newReading.email,
    });
    Agents.findOne({ 'agent_name': newReading.agent }).then(data => {
        if (!data) {
            Agents.create({ 'agent_name': newReading.agent });
        }
    }, err => { if (err && err.code === 11000) { console.log('Duplicate') } });
    UserAccounts.findOne({ 'account_name': newReading.account_name }).then(data => {
        if (!data) {
            UserAccounts.create({ 'account_name': newReading.account_name });
        }
    }, err => { if (err && err.code === 11000) { console.log('Duplicate') } });
    PolicyCategories.findOne({ 'category_name': newReading.category_name }).then(data => {
        if (!data) {
            PolicyCategories.create({ 'category_name': newReading.category_name });
        }
    }, err => { if (err && err.code === 11000) { console.log('Duplicate') } });
    PolicyCarriers.findOne({ 'company_name': newReading.company_name }).then(data => {
        if (!data) {
            PolicyCarriers.create({ 'company_name': newReading.company_name });
        }
    }, err => { if (err && err.code === 11000) { console.log('Duplicate') } });
    Users.findOne({ 'email': newReading.email }).then(data => {
        if (!data) {
            users.save().then(data => { }, err => { console.log(err.stack) });
        }
    }, err => { if (err && err.code === 11000) { console.log('Duplicate') } });
    Policies.findOne({ 'policy_number': newReading.policy_number }).then(data => {
        if (!data) {
            policies.save().then(data => { }, err => { console.log(err.stack) });
        }
    }, err => { if (err && err.code === 11000) { console.log('Duplicate') } });
}