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
    symbol: number,
    isColored: true,
    amount: 2,
  })),
  // +2, stop, change direction, plus, taki - 2 of each color
  [
    // { symbol: CardSymbols.Plus2, isColored: true, amount: 2 },
    { symbol: CardSymbols.Stop, isColored: true, amount: 2 },
    { symbol: CardSymbols.ChangeDirection, isColored: true, amount: 2 },
    { symbol: CardSymbols.Plus, isColored: true, amount: 2 },
    { symbol: CardSymbols.Taki, isColored: true, amount: 2 },
    // change color - 4
    { symbol: CardSymbols.ChangeColor, isColored: false, amount: 4 },
    // super taki, king, +3, break +3 - 2 of each
    { symbol: CardSymbols.SuperTaki, isColored: false, amount: 2 },
    // { symbol: CardSymbols.King, isColored: false, amount: 2 },
    // { symbol: CardSymbols.Plus3, isColored: false, amount: 2 },
    // { symbol: CardSymbols.BreakPlus3, isColored: false, amount: 2 },
  ]
);

const AllCards = flat(
  CardsAmounts.map((card) => {
    // colored cards
    if (card.isColored)
      return flat(
        Object.values(CardColors).map((color) =>
          Array.from({ length: card.amount }, () => Card(card.symbol, color))
        )
      );

    // uncolored cards
    return Array.from({ length: card.amount }, () =>
      Card(card.symbol, undefined)
    );
  })
);

/////////////// Context ///////////////

const CardEntities = AllCards.map((card, i) =>
  ctx.Entity(CardId(card.symbol, card.color, i), CARD_TYPE, { card })
);

const PlayerEntities = PlayersIndexes.map(
  (i) => ctx.Entity(PlayerId(i), PLAYER_TYPE, { cards: undefined }) // when defined, cards type is Set
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
      cardSymbol: undefined,
      isActive: false, // TODO: should be separate isActive for TAKI, +2, +3? or maybe not bool, but "activeAction" that will be undefined or CardSymbols?
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

ctx.registerQuery(CardQueryNames.AllCards, function (entity) {
  return entity.type === CARD_TYPE;
});

ctx.registerQuery(PlayerQueryNames.AllPlayers, function (entity) {
  return entity.type === PLAYER_TYPE;
});

ctx.registerQuery(GameQueryNames.GameNoLeadingCard, function (entity) {
  let areAllPlayersInit = PlayerEntities.every((p) => isFullInitHand(p));

  return (
    entity.id === GAME_STATUS_ID &&
    entity.leadingCardId === undefined &&
    areAllPlayersInit
  );
});

PlayerEntities.forEach((p) => {
  ctx.registerQuery(PlayerQueryNames.PlayerTurn(p.id), function (entity) {
    return (
      isAfterInit() &&
      entity.id === p.id &&
      ctx.getEntityById(GAME_TURNS_ID).current === PlayerIndex(p.id)
    );
  });
});

ctx.registerQuery(PlayerQueryNames.NoCards, function (entity) {
  return (
    isAfterInit() && entity.type === PLAYER_TYPE && entity.cards.size === 0
  );
});

/////////////// Effects ///////////////

ctx.registerEffect(EventNames.DealCardByRequest, function (drawCardEvtData) {
  let requesterId = drawCardEvtData.requesterId;
  let cardId = drawCardEvtData.cardId;

  bp.log.info(`Envoke effect of dealing ${cardId} to ${requesterId}`);

  let requesterEntity = ctx.getEntityById(requesterId);
  let cardEntity = ctx.getEntityById(cardId);

  // deal card to player
  if (requesterEntity.type === PLAYER_TYPE) {
    if (requesterEntity.cards === undefined) {
      requesterEntity.cards = new Set();
    }
    requesterEntity.cards.add(cardId);
    bp.log.info(`${requesterId} has ${requesterEntity.cards.size} cards`);
    bp.log.info(requesterEntity);
  }
  // set leading card
  else if (requesterEntity.type === GAME_STATUS_ID) {
    requesterEntity.leadingCardId = cardEntity.id;
    requesterEntity.color = cardEntity.card.color;
    requesterEntity.cardSymbol = cardEntity.card.symbol;
    requesterEntity.isActive = false; // Requirement: V - If the leading card is a special card, ignore the action and play according to the color and sign.

    bp.log.info(`Leading card: ${requesterEntity.leadingCardId}`);

    bp.log.info("Init game status:");
    bp.log.info(requesterEntity);
  }
  // card cannot be requested by non-player or game status
  else {
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
      bp.log.info(`${discarderId} discarded ${cardId}`);
    });

    bp.log.info(`${discarderId} hand:`);
    bp.log.info(discarderEntity.cards);
  }

  // update game status with the last discarded card
  let lastCardEntity = ctx.getEntityById(cardIds.slice(-1)[0]);
  let gameStatusEntity = ctx.getEntityById(GAME_STATUS_ID);

  gameStatusEntity.leadingCardId = lastCardEntity.id;
  gameStatusEntity.color = lastCardEntity.card.color;
  gameStatusEntity.cardSymbol = lastCardEntity.card.symbol;
  gameStatusEntity.isActive = true;

  bp.log.info("Game status:");
  bp.log.info(gameStatusEntity);

  // change dirction effect
  if (
    getDiscardMoveAction(discardMoveEvtData) === CardSymbols.ChangeDirection
  ) {
    bp.log.info("Envoke effect of change direction card");

    let gameTurnsEntity = ctx.getEntityById(GAME_TURNS_ID);
    gameTurnsEntity.direction = switchDirection(gameTurnsEntity.direction);

    bp.log.info(`Turns direction: ${gameTurnsEntity.direction}`);
  }
});

ctx.registerEffect(EventNames.ChangePlayer, function (changePlayerEvtData) {
  let playerIndex = changePlayerEvtData.playerIndex;

  bp.log.info(`Envoke effect of change player to ${playerIndex}`);

  let gameTurnsEntity = ctx.getEntityById(GAME_TURNS_ID);
  gameTurnsEntity.current = playerIndex;

  bp.log.info(
    `Current player: ${gameTurnsEntity.playersOrder[gameTurnsEntity.current]}`
  );
});

ctx.registerEffect(EventNames.ChangeColor, function (changeColorEvtData) {
  bp.log.info(
    `Envoke effect of change color card -> change to ${changeColorEvtData.color}`
  );

  let gameStatusEntity = ctx.getEntityById(GAME_STATUS_ID);
  gameStatusEntity.color = changeColorEvtData.color;

  bp.log.info("Game status:");
  bp.log.info(gameStatusEntity);
});

ctx.registerEffect(EventNames.Win, function (winEvtData) {
  let winnerPlayerId = winEvtData.playerId;

  bp.log.info(`Envoke effect of the winner ${winnerPlayerId}`);

  let gameTurnsEntity = ctx.getEntityById(GAME_TURNS_ID);

  // calculate next turn
  let nextPlayerIndex = getNextPlayerIndex(1);
  let nextPlayerId = gameTurnsEntity.playersOrder[nextPlayerIndex];

  // winner exits the game
  removeByValue(gameTurnsEntity.playersOrder, winnerPlayerId);

  // update next turn
  gameTurnsEntity.current = gameTurnsEntity.playersOrder.indexOf(nextPlayerId);

  bp.log.info("Remaining players:");
  bp.log.info(gameTurnsEntity.playersOrder);
});
