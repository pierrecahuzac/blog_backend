const Airtable = require("airtable");
require("dotenv").config();
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;
var base = new Airtable({
  apiKey: AIRTABLE_API_KEY,
}).base(AIRTABLE_BASE_ID);

module.exports = Airtable;
