//importing dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//creating book model
const playerSchema = new Schema({
	player_name: String,
	position: String,
	age: Number,
	team_id: String
});

module.exports = mongoose.model("Player", playerSchema);
