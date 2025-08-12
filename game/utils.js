function switchDirection(direction) {
  return -direction;
}

function getDiscardMoveType(discardMoveEvt) {
  let firstCard = ctx.getEntityById(discardMoveEvt.data.cardIds[0]).card;
  return firstCard.name;
}
