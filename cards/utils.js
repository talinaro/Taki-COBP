function isCardInList(card, cardsList) {
  return (
    cardsList &&
    cardsList.some(
      (currCard) =>
        currCard.name === card.name &&
        currCard.color === card.color &&
        currCard.status === card.status
    )
  );
}

function isSubCardsList(subCardsList, cardsList) {
  return (
    subCardsList && subCardsList.every((card) => isCardInList(card, cardsList))
  );
}
