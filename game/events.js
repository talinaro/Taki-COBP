// function createMoveEvent(cards) {
//   return Event(EventNames.Move, { cards });
// }

// function createStepEvent(card) {
//   return Event(EventNames.Step, { card });
// }

function createDealCardByRequestEvent(requesterId, cardId) {
  return Event(EventNames.DealCardByRequest, { requesterId, cardId });
}

function createRequestToDrawCardEvent(requesterId) {
  return Event(EventNames.RequestToDrawCard, { requesterId });
}

/////////////// Event Sets ///////////////

const DealtCardRequesterES = (requesterId) =>
  bp.EventSet("dealt card requester eventset", function (e) {
    return (
      e.name === EventNames.DealCardByRequest &&
      e.data.requesterId === requesterId
    );
  });

const RequestToDrawCardES = bp.EventSet(
  "request to draw card eventset",
  function (e) {
    return e.name === EventNames.RequestToDrawCard;
  }
);

const DrawCardES = bp.EventSet("draw card requests eventset", function (e) {
  return e.name === EventNames.StepTypes.DrawCard;
});

// const SpecificPlayerMovesES = (playerIndex) =>
//   bp.EventSet("specific player moves eventset", function (e) {
//     if (e.name !== EventNames.Move) return false;

//     const moveCards = e.data.cards;
//     const playerCards = ctx.getEntityById(PlayerId(playerIndex)).cards;
//     return isSubCardsList(moveCards, playerCards);
//   });

// const AllRestPlayersMovesES = (playerIndex) =>
//   bp.EventSet("all rest player moves eventset", function (e) {
//     if (e.name !== EventNames.Move) return false;

//     const moveCards = e.data.cards;
//     const playerCards = ctx.getEntityById(PlayerId(playerIndex)).cards;
//     return !isSubCardsList(moveCards, playerCards);
//   });
