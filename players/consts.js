const PLAYER_TYPE = "player";

// define number of players
const PlayersNumber = 3;
const PlayersIndexes = range(PlayersNumber);

const INIT_PLAYER_CARDS_NUM = 8;

/////////////// Query Names ///////////////

const PlayerQueryNames = {
  AllPlayers: "all players query",
  PlayerTurn: (id) => `player.turn.${id}`,
  NoCards: "player with no cards query",
};
