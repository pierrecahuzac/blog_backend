const Airtable = require("../config/api");
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;
const base = new Airtable({
  apiKey: AIRTABLE_API_KEY,
}).base(AIRTABLE_BASE_ID);

module.exports = base;
