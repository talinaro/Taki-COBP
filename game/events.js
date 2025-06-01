// function createMoveEvent(cards) {
//   return Event(EventNames.Move, { cards });
// }

// function createStepEvent(card) {
//   return Event(EventNames.Step, { card });
// }

function createDrawPileEvent(cardId) {
  return Event(EventNames.DrawPile, { cardId });
}

function createRequestToDrawCardEvent(requesterId) {
  return Event(EventNames.RequestToDrawCard, { requesterId });
}

function createDrawCardEvent(requesterId, cardId) {
  return Event(EventNames.DrawCard, { requesterId, cardId });
}

/////////////// Event Sets ///////////////

const DrawPileES = bp.EventSet("draw pile eventset", function (e) {
  return e.name === EventNames.DrawPile;
});

const RequestToDrawCardES = bp.EventSet(
  "request to draw card eventset",
  function (e) {
    return e.name === EventNames.RequestToDrawCard;
  }
);

const DrawCardES = bp.EventSet("draw card requests eventset", function (e) {
  return e.name === EventNames.DrawCard;
});

// const SpecificPlayerMovesES = (playerIndex) =>
//   bp.EventSet("specific-player-moves", function (e) {
//     if (e.name !== EventNames.Move) return false;

//     const moveCards = e.data.cards;
//     const playerCards = ctx.getEntityById(PlayerId(playerIndex)).cards;
//     return isSubCardsList(moveCards, playerCards);
//   });

// const AllRestPlayersMovesES = (playerIndex) =>
//   bp.EventSet("specific-player-moves", function (e) {
//     if (e.name !== EventNames.Move) return false;

//     const moveCards = e.data.cards;
//     const playerCards = ctx.getEntityById(PlayerId(playerIndex)).cards;
//     return !isSubCardsList(moveCards, playerCards);
//   });
