function createMoveEvent(cards) {
  return Event(EventNames.Move, { cards });
}

function createStepEvent(card) {
  return Event(EventNames.Step, { card });
}

function createDrawableCardEvent(card) {
  return Event(EventNames.DrawableCard, { card });
}

function createMoveDrawCardEvent(card, player) {
  return Event(MoveEventNames.DrawCard, { card, player });
}

function createDrawLeadingCardEvent(card) {
  return Event(EventNames.DrawLeadingCard, { card });
}

/////////////// Event Sets ///////////////

const DrawableCardsES = bp.EventSet("drawable cards", function (e) {
  return e.name === EventNames.DrawableCard;

  // if (e.name === EventNames.DrawableCard) {
  //   bp.log.info(`Drawable event data: `);
  //   bp.log.info(e.data);
  //   return true;
  // }
  // return false;
});

const DeprecatedDrawableCardsES = bp.EventSet(
  "deprecated drawable cards",
  function (e) {
    return (
      e.name === EventNames.DrawableCard &&
      e.data.card.card.status !== CardStatus.DrawPile
    );
  }
);

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
