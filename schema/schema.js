//  Dependencies
const graphql = require("graphql");
const _ = require("lodash");
const Player = require("../models/player");
const Team = require("../models/team");

// Grabbing variables from graphql using destructuring
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull
} = graphql;

// defining a Player Type
const PlayerType = new GraphQLObjectType({
	name: "Player",
	fields: () => ({
		id: { type: GraphQLString },
		player_name: { type: GraphQLString },
		position: { type: GraphQLString },
		age: { type: GraphQLInt },
		team_id: { type: GraphQLID },
		team: {
			type: TeamType,
			resolve(parent, args) {
				return Team.findById(parent.team_id);
			}
		}
	})
});

// defining a Team Type
const TeamType = new GraphQLObjectType({
	name: "Team",
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		logo: { type: GraphQLString },
		venue_name: { type: GraphQLString },
		players: {
			type: new GraphQLList(PlayerType),
			resolve(parent, args) {
				return Player.find({ team_id: parent.id });
			}
		}
	})
});

//  defining our Root Query
const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		player: {
			type: PlayerType,
			args: {
				id: { type: GraphQLID }
			},
			resolve(parent, args) {
				return Player.findById(args.id);
			}
		},
		team: {
			type: TeamType,
			args: {
				id: { type: GraphQLID }
			},
			resolve(parent, args) {
				return Team.findById(args.id);
			}
		},
		players: {
			type: GraphQLList(PlayerType),
			resolve(parent, args) {
				return Player.find({});
			}
		},
		teams: {
			type: GraphQLList(TeamType),
			resolve(parent, args) {
				return Team.find({});
			}
		}
	}
});

// defining Mutations
const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addTeam: {
			type: TeamType,
			args: {
				name: {
					type: new GraphQLNonNull(GraphQLString)
				},
				logo: {
					type: new GraphQLNonNull(GraphQLString)
				},
				venue_name: {
					type: new GraphQLNonNull(GraphQLString)
				}
			},
			resolve(parent, args) {
				let team = new Team({
					name: args.name,
					logo: args.logo,
					venue_name: args.venue_name
				});

				return team.save();
			}
		},
		addPlayer: {
			type: PlayerType,
			args: {
				player_name: {
					type: new GraphQLNonNull(GraphQLString)
				},
				position: {
					type: new GraphQLNonNull(GraphQLString)
				},
				age: {
					type: new GraphQLNonNull(GraphQLInt)
				},
				team_id: {
					type: new GraphQLNonNull(GraphQLID)
				}
			},
			resolve(parent, args) {
				let player = new Player({
					player_name: args.player_name,
					position: args.position,
					age: args.age,
					team_id: args.team_id
				});

				return player.save();
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
