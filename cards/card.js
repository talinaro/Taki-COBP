const CardId = (symbol, color, i) =>
  color !== undefined ? `Card#${i}-${symbol}-${color}` : `Card#${i}-${symbol}`;

function Card(symbol, color) {
  return { symbol, color };
}
