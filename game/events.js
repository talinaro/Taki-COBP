function createMoveEvent(playerId, steps) {
  return Event(EventNames.Move, { playerId, steps });
}

// function createStepEvent(card) {
//   return Event(EventNames.Step, { card });
// }

function createDealCardByRequestEvent(requesterId, cardId) {
  return Event(EventNames.DealCardByRequest, { requesterId, cardId });
}

function createRequestToDrawCardEvent(requesterId, amount) {
  return Event(EventNames.RequestToDrawCard, { requesterId, amount });
}

function createChangePlayerEvent(playerIndex) {
  return Event(EventNames.ChangePlayer, { playerIndex });
}

function createChangeDirectionEvent() {
  return Event(EventNames.ChangeDirection);
}

function createWinEvent(playerId) {
  return Event(EventNames.Win, { playerId });
}

function createDiscardMoveEvent(discarderId, cardIds) {
  return Event(EventNames.DiscardMove, { discarderId, cardIds });
}

/////////////// Event Sets ///////////////

const DealtCardRequesterES = (requesterId) =>
  bp.EventSet("dealt card requester eventset", function (e) {
    return (
      e.name === EventNames.DealCardByRequest &&
      e.data.requesterId === requesterId
    );
  });

const RequestToDrawCardES = bp.EventSet(
  "request to draw card eventset",
  function (e) {
    return e.name === EventNames.RequestToDrawCard;
  }
);

const AnyChangePlayerES = bp.EventSet(
  "any change player eventset",
  function (e) {
    return e.name === EventNames.ChangePlayer;
  }
);

const DiscardCardES = bp.EventSet(
  "discard card requests eventset",
  function (e) {
    return e.name === EventNames.DiscardMove;
  }
);

const allEventsExcept = (events) =>
  bp.EventSet(`all events except ${events}`, function (e) {
    return events.every((evt) => evt.name !== e.name);
  });
