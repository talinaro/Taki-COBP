function switchDirection(direction) {
  return -direction;
}

function getDiscardMoveType(discardMoveEvtData) {
  let firstCard = ctx.getEntityById(discardMoveEvtData.cardIds[0]).card;
  return firstCard.symbol;
}

function getDiscardMoveAction(discardMoveEvtData) {
  let lastCard = ctx.getEntityById(
    discardMoveEvtData.cardIds.slice(-1)[0]
  ).card;
  return lastCard.symbol;
}

function isAfterInit() {
  return ctx.getEntityById(GAME_STATUS_ID).leadingCardId !== undefined;
}
