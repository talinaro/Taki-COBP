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

ctx.bthread("print all cards", CardQueryNames.AllCards, function (cardEntity) {
  bp.log.info(cardEntity);
});

ctx.bthread(
  "print all players",
  PlayerQueryNames.AllPlayers,
  function (playerEntity) {
    bp.log.info(playerEntity);
  }
);

ctx.bthread(
  "generate all draw cards events",
  CardQueryNames.DrawPileCards,
  function (cardEntity) {
    let playersEntities = PlayersIndexes.map((i) =>
      ctx.getEntityById(playerId(i))
    );

    // create DrawCard event for each card in draw pile with every player
    for (let playerEntity of playersEntities)
      sync({ request: createDrawCardEvent(playerEntity, cardEntity) });
  }
);

// bthread(
//   "test that all the events from 'generate all draw cards events' are generated",
//   function () {
//     for (let i = 0; i < 500; i++) {
//       let drawCardEvt = sync({ waitFor: DrawCardsES });
//       bp.log.info(
//         `Drawn card ${drawCardEvt.data.card.id} by ${drawCardEvt.data.player.id}`
//       );
//     }
//   }
// );

// Requirement: The cards are shuffled and each player receives eight
ctx.bthread(
  "deal 8 cards to player",
  PlayerQueryNames.AllPlayers,
  function (playerEntity) {
    while (playerEntity.player.cards.length < INIT_PLAYER_CARDS_NUM)
      sync({ waitFor: DrawCardByPlayerES(playerEntity) });

    while (true) sync({ block: DrawCardByPlayerES(playerEntity) });
  }
);

ctx.bthread(
  "avoid other players from trying to draw an already drawn cards",
  CardQueryNames.PlayerHandCards,
  function (cardEntity) {
    let playersEntities = PlayersIndexes.map((i) =>
      ctx.getEntityById(playerId(i))
    );

    for (let playerEntity of playersEntities)
      if (!playerEntity.player.cards.includes(cardEntity))
        sync({
          block: DrawCardByOtherPlayersES(playerEntity, cardEntity),
        });
  }
);

/*
ctx.bthread(
  "generate all possible moves when player put his cards",
  PlayerQueryNames.WithCards,
  function (playerEntity) {
    let playerCards = playerEntity.cards;
    // TODO: generate multi moves that strat with `card`
    let moves = playerCards.map((card) => createMoveEvent([card])); // only single cards meanwhile
    sync({ request: moves });
  }
);

ctx.bthread(
  "generate all possible draw cards moves",
  CardQueryNames.DrawPileCards,
  function (cardEntity) {
    let drawCard = cardEntity.card;
    sync({ request: createMoveEvent([drawCard]) }); // TODO: maybe draw event is different from card event?
  }
);

// Requirement:
// The players play one after another in clockwise order (index-growing).
// The direction may change if any player puts the "change direction" card.
// A player can finish his cards and leave the game, but the other players will 0continue to play.
bthread("define players order", function () {
  let currentPlayerIndex = 0;

  while (true) {
    let direction = ctx.getEntityById(DIRECTION_ID).direction;
    let move = sync({
      waitFor: SpecificPlayerMovesES(currentPlayerIndex),
      block: AllRestPlayersMovesES(currentPlayerIndex),
    });
    bp.log.info(move);

    currentPlayerIndex = getNextPlayerIndex(currentPlayerIndex, direction);
  }
});
*/
