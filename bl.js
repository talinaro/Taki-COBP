/** Playing rules:
 * Each player at his turn can do one of the 3 options:
 * - discard a card of the same number or color as the leading card
 * - discard a special card of the same figure or color as the leading card (and play according to it)
 * - discard a special uncolored card (and play according to it)
 * Player that cannot play any card, would draw one card and his turn ends
 * Player left with one card must declare "Last card!". If he fails before next player made his move, he draws 4 crads.
 * First player that gets rid of all his cards, wins the game
 */

/** Special cards rules:
 * +2 - next player must draw 2 cards from the pile and end his turn,
 *      unless he has a +2 card too and then the next player would take all the summed +2 cards
 * + - current player has another turn
 * stop - next player loses his turn
 * change direction - opposite direction of the players' turns
 * change color - can be put on any card except +2, and allow the current player to choose the color the next player should play with
//  * crazy card - any player passes his cards to the player sitting next to him in the direction chosen by the user
//  *            - this card is transparent, so the leading card remains the one underneath it
//  *            - the direction of the play after a crazy card has been played is the direction of the switch
 * king - cancel the leading card (including +2) and give the current player another turn without any limitation
 * taki - taki of specific color allows the current player to discard all his cards of this color (uncolored cards allowed too)
 *      - when he finished, should decalre "Closed TAKI!"
 *        if he didn't, the taki remains "opened" until any player declares of "Closed TAKI!", and the players may continue discrading
 * super taki - same like taki, but adopts the color of the leading card
 * +3 - same as +2, but next player draws 3 cards instead of 2 and so on...
 *    - the leading card after a sequence of +3 cards is the last non-+3 card that were in the discard pile
 * break +3 - can be placed without wasting a turn anytime one of the players places a +3 card, even if it's not the placer's turn
 *          - it reverses the effects of the +3 card and makes the player who placed the +3 to draw 3 cards instead
 */

ctx.bthread("print all cards", CardQueryNames.AllCards, function (e) {
  bp.log.info(e);
});

ctx.bthread("print all players", PlayerQueryNames.AllPlayers, function (e) {
  bp.log.info(e);
});

bthread("define players order", function () {
  // TODO: how?
});
