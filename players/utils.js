function getNextPlayerIndex(increaseBy) {
  let gameTurnsEntity = ctx.getEntityById(GAME_TURNS_ID);
  let playersNum = gameTurnsEntity.playersOrder.length;

  bp.log.info(
    `Calculate next player index when current=${gameTurnsEntity.current}, direction=${gameTurnsEntity.direction}`
  );

  return (
    (gameTurnsEntity.current +
      gameTurnsEntity.direction * increaseBy +
      playersNum) %
    playersNum
  );
}

function isFullInitHand(player) {
  return player.cards.size === INIT_PLAYER_CARDS_NUM;
}
