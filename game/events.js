function createMoveEvent(playerId, steps) {
  return Event(EventNames.Move, { playerId, steps });
}

function createDealCardByRequestEvent(requesterId, cardId) {
  return Event(EventNames.DealCardByRequest, { requesterId, cardId });
}

function createRequestInitCardsEvent(requesterId, amount) {
  return Event(EventNames.RequestInitCards, { requesterId, amount });
}

function createRequestToDrawCardEvent(requesterId, amount) {
  return Event(EventNames.RequestToDrawCard, { requesterId, amount });
}

function createChangePlayerEvent(playerIndex) {
  return Event(EventNames.ChangePlayer, { playerIndex });
}

function createChangeColorEvent(color) {
  return Event(EventNames.ChangeColor, { color });
}

function createWinEvent(playerId) {
  return Event(EventNames.Win, { playerId });
}

function createDiscardMoveEvent(discarderId, cardIds) {
  return Event(EventNames.DiscardMove, { discarderId, cardIds });
}

function createInitLeadingCardEvent(cardId) {
  return Event(EventNames.InitLeadingCard, { cardId });
}

function createInitializedPlayerHandEvent(playerId) {
  return Event(EventNames.InitializedPlayerHand, { playerId });
}

/////////////// Event Sets ///////////////

const DealtCardRequesterES = (requesterId) =>
  bp.EventSet("dealt card requester eventset", function (e) {
    return (
      e.name === EventNames.DealCardByRequest &&
      e.data.requesterId === requesterId
    );
  });

const RequestCardsFromDealerES = bp.EventSet(
  "request to draw card eventset",
  function (e) {
    return (
      e.name === EventNames.RequestToDrawCard ||
      e.name === EventNames.RequestInitCards
    );
  }
);

const AnyChangePlayerES = bp.EventSet(
  "any change player eventset",
  function (e) {
    return e.name === EventNames.ChangePlayer;
  }
);

const allEventsExcept = (events) =>
  bp.EventSet(`all events except ${events}`, function (e) {
    return events.every((evt) => evt.name !== e.name);
  });

const eventSetsDiff = (mainES, subES) =>
  bp.EventSet(`events in ${mainES} except ${subES}`, function (e) {
    return mainES.contains(e) && !subES.contains(e);
  });

const AnyMoveES = bp.EventSet("any move eventset", function (e) {
  return (
    e.name === EventNames.RequestToDrawCard || e.name === EventNames.DiscardMove
  );
});

const DiscardMovesOfTypeES = (cardName) =>
  bp.EventSet(`discard moves of type ${cardName} eventset`, function (e) {
    return (
      e.name === EventNames.DiscardMove &&
      getDiscardMoveType(e.data) === cardName
    );
  });

const InitializedObjectsES = bp.EventSet(
  "initialized objects eventset",
  function (e) {
    return (
      e.name === EventNames.InitializedPlayerHand ||
      e.name === EventNames.InitLeadingCard
    );
  }
);
