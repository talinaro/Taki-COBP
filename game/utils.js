function switchDirection(direction) {
  return -direction;
}

function getDiscardMoveType(discardMoveEvtData) {
  let firstCard = ctx.getEntityById(discardMoveEvtData.cardIds[0]).card;
  return firstCard.symbol;
}
