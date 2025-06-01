const CardId = (name, color, i) =>
  color !== undefined ? `Card#${i}-${name}-${color}` : `Card#${i}-${name}`;

function Card(name, color) {
  return { name, color };
}
