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

const DrawCardsES = bp.EventSet("draw-cards", function (e) {
  return e.name === EventNames.DrawCard;
});

const DrawCardByPlayerES = (player) =>
  bp.EventSet("draw-card-by-player", function (e) {
    return (
      e.name === EventNames.DrawCard && e.data.player.id === player.player.id
    );
  });

const DrawCardByOtherPlayersES = (drawingPlayer, drawnCard) =>
  bp.EventSet("draw-card-by-other-players", function (e) {
    if (e.name !== EventNames.DrawCard) return false;

    const eventPlayer = e.data.player;
    const eventCard = e.data.card;

    // other players trying to draw an already drawn card
    return (
      drawingPlayer.player.id !== eventPlayer.player.id &&
      drawnCard.card.id === eventCard.card.id
    );
  });

// const SpecificPlayerMovesES = (playerIndex) =>
//   bp.EventSet("specific-player-moves", function (e) {
//     if (e.name !== EventNames.Move) return false;

//     const moveCards = e.data.cards;
//     const playerCards = ctx.getEntityById(playerId(playerIndex)).cards;
//     return isSubCardsList(moveCards, playerCards);
//   });

// const AllRestPlayersMovesES = (playerIndex) =>
//   bp.EventSet("specific-player-moves", function (e) {
//     if (e.name !== EventNames.Move) return false;

//     const moveCards = e.data.cards;
//     const playerCards = ctx.getEntityById(playerId(playerIndex)).cards;
//     return !isSubCardsList(moveCards, playerCards);
//   });
