const playerId = (i) => `Player#${i}`;

function Player(i) {
  return { i, cards: [] };
}

function playerHasCards(player) {
  return player.cards.length > 0;
}
