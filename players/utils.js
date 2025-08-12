function getNextPlayerIndex(gameTurnsEntity, increaseBy) {
  let playersNum = gameTurnsEntity.playersOrder.length;
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
