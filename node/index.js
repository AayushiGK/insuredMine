const config = require('./Config/config');
const models = require('./MongoDb/schema')().model;
const arrg = { config , models};
require('./Controllers/controller')(arrg);
require('./Controllers/worker')(arrg);