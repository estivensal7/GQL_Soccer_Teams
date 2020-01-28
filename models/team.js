//importing dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//creating author model
const teamSchema = new Schema({
	name: String,
	logo: String,
	venue_name: String
});

module.exports = mongoose.model("Team", teamSchema);
