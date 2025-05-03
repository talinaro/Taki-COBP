function createMoveEvent(cards) {
  return Event(EventNames.Move, { cards });
}

function createStepEvent(card) {
  return Event(EventNames.Step, { card });
}

function createDrawCardEvent(player, card) {
  return Event(EventNames.DrawCard, { player, card });
}

/////////////// Event Sets ///////////////

const SpecificPlayerMovesES = (playerIndex) =>
  bp.EventSet("specific-player-moves", function (e) {
    if (e.name !== EventNames.Move) return false;

    const moveCards = e.data.cards;
    const playerCards = ctx.getEntityById(playerId(playerIndex)).cards;
    return isSubCardsList(moveCards, playerCards);
  });

const AllRestPlayersMovesES = (playerIndex) =>
  bp.EventSet("specific-player-moves", function (e) {
    if (e.name !== EventNames.Move) return false;

    const moveCards = e.data.cards;
    const playerCards = ctx.getEntityById(playerId(playerIndex)).cards;
    return !isSubCardsList(moveCards, playerCards);
  });

const DrawPileCardsES = bp.EventSet("draw-pile-cards", function (e) {
  return e.name === EventNames.DrawCard;
});
