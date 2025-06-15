/** Init requirements:
 * Define the playing order
 * Deal 8 cards to each player
 * Rest of the cards are the draw pile
 * Draw one card from the top of the draw pile to form the discard pile (the top card of the discard pile is the leading card).
 * - If the leading card is a special card, ignore the action and play according to the color and sign.
 */

/** Playing rules:
 * Each player at his turn can do one of the 4 options:
 * - discard a card of the same number or color as the leading card
 * - discard a special card of the same figure or color as the leading card (and play according to it)
 * - discard a special uncolored card (and play according to it)
 * - draw one card and his turn ends
 * Player left with one card must declare "Last card!". If he fails before next player made his move, he draws 4 crads.
 * - NOTE: No need to declare "Last card!" when the last card left is during a taki run, because it considered one turn.
 * First player that gets rid of all his cards, wins the game
 */

/** Special cards rules:
 * +2 - Next player must draw 2 cards from the pile and end his turn,
 *      unless he has a +2 card too and then the next player would take all the summed +2 cards, etc.
 *    - After they collected the cards, the last +2 card in the draw pile is free to be used as a color or a number.
 * + - Current player has another turn
 * stop - Next player loses his turn
 * change direction - Reverses the direction of the play
 * change color - Allows the user to determine the color to be played by the next player.
 *                This card may be played at any time except after +2 which is still active.
 * king - Grants the player an additional turn with no limitations on the cards, effectively resetting the game.
 *        NOTE: The player may win by playing king as it's last card, such as the additional turn is not obligating.
 *      - Can put on +3 and defend only yourself from drawing cards.
 * taki - Allows a player to follow with all the cards of the same color as the TAKI.
 *        NOTE: You may NOT play any other colors or uncolored cards during a Taki run except the color of the leading Taki card.
 *      - When finished, should decalre "Closed TAKI!"
 *        If didn't, the taki remains "opened" until any player declares of "Closed TAKI!", and the players may continue discrading
 *        cards of the same color.
 *      - The last card of the TAKI is played. All the special cards inbetween of the TAKI run are not activated.
 *      - A single TAKI card opens the run and cannot be closed
 * super taki - Same like taki, but adopts the color of the leading card.
 *            - If put on a king, the player can choose the color.
 * +3 - Forces every other player besides the player that placed it to draw 3 cards.
 *    - Alternatively, can be played in a sequence of +2, but in this case it adds 3 cards to the sequence instead of forcing 
 *      all the other players to draw 3 cards.
 *    - The leading color after +3 remains the last color below it.
 * break +3 - Can be placed without wasting a turn anytime one of the players places a +3 card, even if it's not the player's turn.
 *            It reverses the effects of the +3 card and makes the player who placed the +3 to draw 3 cards instead.
 *          - If put on +3 of a sequence of +2 cards, it forces the player who placed the +3 to draw the amount of cards according
 *            to the summed sequence.
 *          - Can get rid of this card in your turn without putting it on +3, and draw 3 cards instead.
//  * crazy card - any player passes his cards to the player sitting next to him in the direction chosen by the user
//  *            - this card is transparent, so the leading card remains the one underneath it
//  *            - the direction of the play after a crazy card has been played is the direction of the switch
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

bthread("dealer", function () {
  // init draw pile
  let allCards = ctx.runQuery(CardQueryNames.AllCards);
  let drawPileCardIds = new Set(allCards.map((card) => card.id));

  while (true) {
    let requestToDrawCardEvtData = sync({ waitFor: RequestToDrawCardES }).data;

    for (let i = 0; i < requestToDrawCardEvtData.amount; i++) {
      let drawPileEvents = Array.from(drawPileCardIds).map((cardId) =>
        createDealCardByRequestEvent(
          requestToDrawCardEvtData.requesterId,
          cardId
        )
      );

      let topDrawPileEvt = sync({
        request: drawPileEvents,
        block: allEventsExcept(drawPileEvents),
      });
      bp.log.info(`dealer -> draw pile top: ${topDrawPileEvt}`);

      // remove a drawn card from the draw pile
      drawPileCardIds.delete(topDrawPileEvt.data.cardId);
    }

    bp.log.info(`Draw pile (size=${drawPileCardIds.size}):`);
    bp.log.info(drawPileCardIds);
  }
});

// Requirement: The cards are shuffled and each player receives eight cards
ctx.bthread(
  "deal 8 cards to player",
  PlayerQueryNames.AllPlayers,
  function (playerEntity) {
    // while (playerEntity.cards.size < INIT_PLAYER_CARDS_NUM) {
    sync({
      request: createRequestToDrawCardEvent(
        playerEntity.id,
        INIT_PLAYER_CARDS_NUM
      ),
    });
    sync({ waitFor: DealtCardRequesterES(playerEntity.id) });

    bp.log.info(`${playerEntity.id} cards:`);
    bp.log.info(playerEntity);
  }
  // }
);

// Requirement:
// Draw one card from the top of the draw pile to form the discard pile (the top card of the discard pile is the leading card).
// - If the leading card is a special card, ignore the action and play according to the color and sign.
bthread("init leading card", function () {
  let gameStatusEntity = ctx.getEntityById(GAME_STATUS_ID);
  if (gameStatusEntity.leadingCardId === undefined) {
    sync({ request: createRequestToDrawCardEvent(GAME_STATUS_ID, 1) });
    let leadingCardId = sync({ waitFor: DealtCardRequesterES(GAME_STATUS_ID) })
      .data.cardId;
    sync({ request: createDiscardMoveEvent(GAME_STATUS_ID, [leadingCardId]) });

    bp.log.info(`Leading card: ${gameStatusEntity.leadingCardId}`);
  }
});

// Requirement:
// The players play one after another in clockwise order (index-growing).
// The direction or order may change on some cases as elaborated below.
// ctx.bthread("advance turns", GameQueryNames.GameTurns, function (gameEntity) {
//   while (true) {
//     let move = sync({ waitFor: AnyMove });
//     bp.log.info(move);

//     sync({
//       request: createChangePlayerEvent(
//         getNextPlayerIndex(gameEntity.current, gameEntity.direction)
//       ),
//       block: AnyMove,
//       waitFor: AnyChangePlayerES,
//     });
//   }
// });

// // Requirement: change direction - Reverses the direction of the play before advancing the turn
// bthread("change direction card", function () {
//   while (true) {
//     let move = sync({ waitFor: ChangeDirectionES });
//     bp.log.info(move);

//     // let evt = Event(
//     //   EventNames.ChangePlayer,
//     //   (gameEntity.current + gameEntity.direction * 2) % PLAYERS_NUM
//     // );
//     // sync({
//     //   request: evt,
//     //   block: [AnyChangePlayerES.except(evt), AnyMove],
//     // });

//     sync({
//       request: createChangeDirectionEvent(),
//       block: AnyChangePlayerES,
//     });
//   }
// });

// // Requirement: stop - Next player loses his turn
// ctx.bthread("stop card", GameQueryNames.GameTurns, function (gameEntity) {
//   let move = null;
//   let evt = null;

//   while (true) {
//     move = sync({ waitFor: StopES });
//     bp.log.info(move);

//     evt = createChangePlayerEvent(
//       getNextPlayerIndex(
//         getNextPlayerIndex(gameEntity.current, gameEntity.direction),
//         gameEntity.direction
//       )
//     );
//     sync({
//       request: evt,
//       block: AnyChangePlayerES.except(evt),
//     });

//     move = null;
//     evt = null;
//   }
// });

// // Requirement: + - Current player has another turn
// ctx.bthread("plus", GameQueryNames.GameTurns, function (gameEntity) {
//   while (true) {
//     let move = sync({
//       waitFor: PlusES,
//     });
//     bp.log.info(move);

//     let evt = createChangePlayerEvent(gameEntity.current);
//     sync({
//       request: evt,
//       block: AnyChangePlayerES.except(evt),
//     });
//   }
// });

// // Requirement: A player can finish his cards and leave the game, but the other players will continue to play.
// ctx.bthread("winner", PlayerQueryNames.NoCards, function (playerEntity) {
//   sync({
//     request: createWinEvent(playerEntity.id),
//     block: [AnyChangePlayerES, AnyMove],
//   });
// });

// // Requirement:
// //  Each player at his turn can do one of the 4 options:
// //  - discard a card of the same number or color as the leading card
// //  - discard a special card of the same figure or color as the leading card (and play according to it)
// //  - discard a special uncolored card (and play according to it)
// //  - draw one card and his turn ends
// let allPlayers = ctx.runQuery(PlayerQueryNames.AllPlayers);
// allPlayers.forEach((p) =>
//   ctx.bthread(
//     "generate all possible player moves",
//     PlayerQueryNames.PlayerTurn(p.id),
//     function (playerEntity) {}
//   )
// );
