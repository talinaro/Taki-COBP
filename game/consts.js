const GAME_TURNS_ID = "game turns";
const GAME_TURNS_TYPE = "game turns";

const GAME_STATUS_ID = "game status";
const GAME_STATUS_TYPE = "game status";

const INIT_DIRECTION = 1;

/////////////// Event Names ///////////////

const EventNames = {
  RequestInitCards: "request init cards event",
  RequestToDrawCard: "request to draw card event",
  DealCardByRequest: "deal card by request event",
  DiscardMove: "discard move event",
  ChangePlayer: "change player event",
  ChangeColor: "change color event",
  ChangeDirection: "change direction event",
  Win: "win event",
};

/////////////// Query Names ///////////////

const GameQueryNames = {
  GameNoLeadingCard: "game no leading card query",
};
