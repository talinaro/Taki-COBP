function isCardInList(card, cardsList) {
  return cardsList && cardsList.some((currCard) => currCard.id === card.id);
}

function isSubCardsList(subCardsList, cardsList) {
  return (
    subCardsList && subCardsList.every((card) => isCardInList(card, cardsList))
  );
}
