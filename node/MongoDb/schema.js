module.exports = function () {
    var mongoose = require('mongoose');
    const AutoIncrement = require('mongoose-sequence')(mongoose);
    const { db } = require('../Config/config');
    mongoose.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true });
    var dbconnect = mongoose.connection;
    dbconnect.once('open', () => {
        console.log('Connected');
    })
    dbconnect.on('err', console.error.bind(console, 'db Error'));
    mongoose.set('useFindAndModify', false);


    // agent
    // account_name 
    // category_name
    // company_name
    // email	gender	firstname 	phone	address     state	zip     dob	    city     userType
    // policy_mode	producer	policy_number	premium_amount	policy_type		policy_start_date	policy_end_date	    csr     account_type

    AgentSchema = mongoose.Schema({
        agent_name: {
            type: String,
            unique: true
        }
    });

    UserAccountSchema = mongoose.Schema({
        account_name: {
            type: String,
            unique: true
        }
    });

    PolicyCategorySchema = mongoose.Schema({
        category_name: {
            type: String,
            unique: true
        }
    });

    PolicyCarrierSchema = mongoose.Schema({
        company_name: {
            type: String,
            unique: true
        }
    });

    UserSchema = mongoose.Schema({
        first_name: String,
        dob: Date,
        address: String,
        phone_number: String,
        state: String,
        zip_code: String,
        email: {
            type: String,
            unique: true
          },
        gender: String,
        user_type: String
    });

    var PolicySchema = mongoose.Schema({
        producer: String,
        policy_number: {
            type: String,
            unique: true
          },
        policy_start_date: Date,
        policy_end_date: Date,
        policy_category: String,
        collection_id: Number,
        company_collection_id: Number,
        premium_amount: Number,
        account_type: String,
        csr: String,
        user_id: String,
    });

    UserSchema.plugin(AutoIncrement, { inc_field: 'id' });
    var Agents = mongoose.model('agents', AgentSchema);
    var Users = mongoose.model('users', UserSchema);
    var UserAccounts = mongoose.model('user_accounts', UserAccountSchema);
    var PolicyCategories = mongoose.model('policy_categories', PolicyCategorySchema);
    var PolicyCarriers = mongoose.model('policy_carriers', PolicyCarrierSchema);
    var Policies = mongoose.model('policies', PolicySchema);
    return {
        model: {
            Agents,
            Users,
            UserAccounts,
            PolicyCategories,
            PolicyCarriers,
            Policies,
        }
    }
}