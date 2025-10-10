const PLAYER_TYPE = "player";

// define number of players
const PLAYERS_NUMBER = 3;
const PlayersIndexes = range(PLAYERS_NUMBER);

const INIT_PLAYER_CARDS_NUM = 8;

/////////////// Query Names ///////////////

const PlayerQueryNames = {
  AllPlayers: "all players query",
  PlayerTurn: (id) => `player.turn.${id} query`,
  NoCards: "player with no cards query",
};
