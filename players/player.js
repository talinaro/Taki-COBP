const PlayerId = (i) => `Player#${i}`;
const PlayerIndex = (id) => parseInt(id.split("#").slice(-1)[0]);
