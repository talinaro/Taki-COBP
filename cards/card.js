const cardId = (name, color, i) =>
  color !== undefined ? `Card#${i}-${name}-${color}` : `Card#${i}-${name}`;

function Card(name, color, status, player) {
  return { name, color, status, player };
}
