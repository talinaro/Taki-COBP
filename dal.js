/////////////// Init ///////////////

/** Init requirements:
 * Taki cards deck consists of 116 cards:
 * - each number card - 2 of each color
 * - +2, stop, change direction, plus, taki - 2 of each color
 * - change color - 4 (uncolored)
 * - super taki, king, +3, break +3 - 2 of each (uncolored)
 * define number of players
 * define the playing order     // TODO: should be bthread?
 * deal 8 cards to each player
 * rest of the cards are the draw pile
 * draw one card from the top of the draw pile to form the discard pile (the top card of the discard pile is the leading card)
 * statring clockwise
 */

const CardsAmounts = [].concat(
  // each number card - 2 of each color
  CardNumbers.map((number) => ({
    name: number,
    isColored: true,
    amount: 2,
  })),
  // +2, stop, change direction, plus, taki - 2 of each color
  [
    { name: CardNames.Plus2, isColored: true, amount: 2 },
    { name: CardNames.Stop, isColored: true, amount: 2 },
    { name: CardNames.ChangeDirection, isColored: true, amount: 2 },
    { name: CardNames.Plus, isColored: true, amount: 2 },
    { name: CardNames.Taki, isColored: true, amount: 2 },
    // change color - 4
    { name: CardNames.ChangeColor, isColored: false, amount: 4 },
    // super taki, king, +3, break +3 - 2 of each
    { name: CardNames.SuperTaki, isColored: false, amount: 2 },
    { name: CardNames.King, isColored: false, amount: 2 },
    { name: CardNames.Plus3, isColored: false, amount: 2 },
    { name: CardNames.BreakPlus3, isColored: false, amount: 2 },
  ]
);

const AllCards = flat(
  CardsAmounts.map((card) => {
    // colored cards
    if (card.isColored)
      return flat(
        Object.values(CardColors).map((color) =>
          Array.from({ length: card.amount }, () =>
            Card(card.name, color, CardStatus.DrawPile, undefined)
          )
        )
      );

    // uncolored cards
    return Array.from({ length: card.amount }, () =>
      Card(card.name, undefined, CardStatus.DrawPile, undefined)
    );
  })
);

/////////////// Context ///////////////

/** Context:
 * all the cards
 * players
 * cards of each player
 * draw pile
 * discard pile
 * leading card
 * turns direction (+1/-1) - default +1
 */

const CardEntities = AllCards.map((card, i) =>
  ctx.Entity(cardId(card.name, card.color, i), CARD_TYPE, { card })
);

const PlayerEntities = PlayersIndexes.map((i) =>
  ctx.Entity(playerId(i), PLAYER_TYPE, Player(i))
);

ctx.populateContext(
  [].concat(
    // all cards
    CardEntities,
    // players
    PlayerEntities,
    // turns direction (+1/-1) - default +1
    ctx.Entity(DIRECTION_ID, DIRECTION_TYPE, { direction: 1 })
  )
);

/////////////// Queries ///////////////

/** Queries:
 * current player's cards:
 * - separate query for each type card (to know how to create the move events in separate bthreads) ?
 * is player's last card
 * is player emptied his hand
 * is +2 sequence (and how many till now)
 * is +3 sequence (and how many till now)
 * is opened taki sequence
 * current color
 */

ctx.registerQuery(CardQueryNames.AllCards, function (entity) {
  return entity.type === CARD_TYPE;
});

ctx.registerQuery(PlayerQueryNames.AllPlayers, function (entity) {
  return entity.type === PLAYER_TYPE;
});

ctx.registerQuery(CardQueryNames.DrawPileCards, function (entity) {
  return (
    entity.type === CARD_TYPE && entity.card.status === CardStatus.DrawPile
  );
});

// ctx.registerQuery(PlayerQueryNames.WithCards, function (entity) {
//   return entity.type === PLAYER_TYPE && playerHasCards(entity);
// });

/////////////// Effects ///////////////

ctx.registerEffect(EventNames.DrawCard, function (drawCardEvtData) {
  let player = drawCardEvtData.player;
  let card = drawCardEvtData.card;

  bp.log.info(`Envoke effect of ${player.id} drawing ${card.id}`);

  card.card.status = CardStatus.PlayerHand;
  card.card.player = player;

  bp.log.info(card); // TODO: remove
});
