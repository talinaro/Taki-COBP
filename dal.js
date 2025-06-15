/////////////// Init ///////////////

/** Init setup:
 * Taki cards deck consists of 116 cards:
 * - each number card - 2 of each color
 * - +2, stop, change direction, plus, taki - 2 of each color
 * - change color - 4 (uncolored)
 * - super taki, king, +3, break +3 - 2 of each (uncolored)
 * define number of players
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
          Array.from({ length: card.amount }, () => Card(card.name, color))
        )
      );

    // uncolored cards
    return Array.from({ length: card.amount }, () =>
      Card(card.name, undefined)
    );
  })
);

/////////////// Context ///////////////

const CardEntities = AllCards.map((card, i) =>
  ctx.Entity(CardId(card.name, card.color, i), CARD_TYPE, { card })
);

const PlayerEntities = PlayersIndexes.map((i) =>
  ctx.Entity(PlayerId(i), PLAYER_TYPE, { cards: new Set() })
);

ctx.populateContext(
  [].concat(
    // all cards
    CardEntities,
    // players
    PlayerEntities,
    // game status
    ctx.Entity(GAME_STATUS_ID, GAME_STATUS_TYPE, {
      leadingCardId: undefined,
      color: undefined,
      cardName: undefined,
      isActive: false, // TODO: should be separate isActive for TAKI, +2, +3? or maybe not bool, but "activeAction" that will be undefined or CardNames
    }),
    // turns order
    ctx.Entity(GAME_TURNS_ID, GAME_TURNS_TYPE, {
      playersOrder: PlayerEntities.map((p) => p.id),
      current: 0,
      direction: INIT_DIRECTION,
    })
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

ctx.registerQuery(GameQueryNames.GameTurns, function (entity) {
  return entity.name === GAME_TURNS_ID;
});

PlayerEntities.forEach((p) => {
  ctx.registerQuery(PlayerQueryNames.PlayerTurn(p.id), function (entity) {
    return (
      entity.id === p.id && ctx.getEntityById(GAME_TURNS_ID).current === p.id
    );
  });
});

ctx.registerQuery(PlayerQueryNames.NoCards, function (entity) {
  return entity.type === PLAYER_TYPE && entity.cards.size === 0;
});

/////////////// Effects ///////////////

ctx.registerEffect(EventNames.DealCardByRequest, function (drawCardEvtData) {
  let requesterId = drawCardEvtData.requesterId;
  let cardId = drawCardEvtData.cardId;

  bp.log.info(`Envoke effect of draw ${cardId} to ${requesterId}`);

  let requesterEntity = ctx.getEntityById(requesterId);

  // deal card to player
  if (requesterEntity.type === PLAYER_TYPE) {
    requesterEntity.cards.add(cardId);
    bp.log.info(`${requesterId} has ${requesterEntity.cards.size} cards`);
    bp.log.info(requesterEntity);
  }
  // set leading card
  else if (requesterEntity.type === GAME_STATUS_ID) {
    requesterEntity.leadingCardId = cardId;
  } else {
    bp.log.info(`Ivalid draw card requester ${requesterId}`);
  }
});

ctx.registerEffect(EventNames.DiscardMove, function (discardMoveEvtData) {
  let cardIds = discardMoveEvtData.cardIds;
  let discarderId = discardMoveEvtData.discarderId;

  bp.log.info(`Envoke effect of ${discarderId} discarding ${cardIds}`);

  let discarderEntity = ctx.getEntityById(discarderId);

  // remove the cards from player's hand
  if (discarderEntity.type === PLAYER_TYPE) {
    cardIds.forEach((cardId) => {
      discarderEntity.cards.delete(cardId);
      bp.log.info(`${discarderId} discarded ${cardEntity.id}`);
    });
    bp.log.info(`${discarderId} hand: ${discarderEntity.cards}`);
  }

  // update game status with the last discarded card
  let lastCardEntity = ctx.getEntityById(cardIds.slice(-1)[0]);
  let gameStatusEntity = ctx.getEntityById(GAME_STATUS_ID);

  gameStatusEntity.leadingCardId = lastCardEntity.id;
  gameStatusEntity.color = lastCardEntity.card.color;
  gameStatusEntity.cardName = lastCardEntity.card.name;
  gameStatusEntity.isActive = true; // TODO: ?

  bp.log.info("Game status:");
  bp.log.info(gameStatusEntity);
});

ctx.registerEffect(EventNames.ChangePlayer, function (changePlayerEvtData) {
  let playerIndex = changePlayerEvtData.playerIndex;
  let gameTurnsEntity = ctx.getEntityById(GAME_TURNS_ID);
  gameTurnsEntity.current = playerIndex;
});

ctx.registerEffect(EventNames.ChangeDirection, function (data) {
  bp.log.info("Envoke effect of change direction card");

  let gameTurnsEntity = ctx.getEntityById(GAME_TURNS_ID);
  gameTurnsEntity.direction = switchDirection(gameTurnsEntity.direction);

  bp.log.info(`Turns direction: ${gameTurnsEntity.direction}`);
});

ctx.registerEffect(EventNames.Win, function (winEvtData) {
  let winnerPlayerId = winEvtData.PlayerId;
  let gameTurnsEntity = ctx.getEntityById(GAME_TURNS_ID);

  // calculate next turn
  let nextPlayerIndex = getNextPlayerIndex(
    gameTurnsEntity.current,
    gameTurnsEntity.direction
  );
  let nextPlayerId = gameTurnsEntity.playersOrder[nextPlayerIndex];

  // winner exits the game
  removeByValue(gameTurnsEntity.playersOrder, winnerPlayerId);

  // update next turn
  gameTurnsEntity.current = gameTurnsEntity.playersOrder.indexOf(nextPlayerId);
});
