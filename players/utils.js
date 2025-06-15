function getNextPlayerIndex(currentPlayerIndex, direction) {
  /**
   * @param {number} currentPlayerIndex - from 0 to PlayersNumber-1
   * @param {number} direction - +1 or -1
   */
  return (currentPlayerIndex + direction + PlayersNumber) % PlayersNumber;
}
