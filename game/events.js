// function createMoveEvent(cards) {
//   return Event(EventNames.Move, { cards });
// }

// function createStepEvent(card) {
//   return Event(EventNames.Step, { card });
// }

function createDrawableCardEvent(drawableCardId) {
  return Event(EventNames.DrawableCard, { drawableCardId });
}

function createRequestToDrawCardEvent(requesterId) {
  return Event(EventNames.RequestToDrawCard, { requesterId });
}

function createDealCardEvent(drawableCardId, requesterId) {
  return Event(EventNames.DealCard, { drawableCardId, requesterId });
}

function createDrawLeadingCardEvent(drawableCardId) {
  return Event(EventNames.DrawLeadingCard, { drawableCardId });
}

/////////////// Event Sets ///////////////

const DrawCardRequestES = bp.EventSet(
  "draw card requests eventset",
  function (e) {
    return e.name === EventNames.RequestToDrawCard;
  }
);

const DrawableCardsES = bp.EventSet("drawable cards eventset", function (e) {
  return e.name === EventNames.DrawableCard;
});

const DealCardES = bp.EventSet("deal card eventset", function (e) {
  return e.name === EventNames.DealCard;
});

// TODO: remove
// const DrawCardByPlayerES = (player) =>
//   bp.EventSet("draw-card-by-player", function (e) {
//     return (
//       e.name === EventNames.DrawCard && e.data.player.id === player.player.id
//     );
//   });

// TODO: remove
// const DrawCardByOtherPlayersES = (drawingPlayer, drawnCard) =>
//   bp.EventSet("draw-card-by-other-players", function (e) {
//     if (e.name !== EventNames.DrawCard) return false;

//     const eventPlayer = e.data.player;
//     const eventCard = e.data.card;

//     // other players trying to draw an already drawn card
//     return (
//       drawingPlayer.player.id !== eventPlayer.player.id &&
//       drawnCard.card.id === eventCard.card.id
//     );
//   });

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
