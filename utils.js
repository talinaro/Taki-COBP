function flat(list) {
  return list.reduce((l, x) => l.concat(x), []);
}

function range(n) {
  return Array.from({ length: n }, (_, index) => index);
}

function removeByValue(l, v) {
  l.splice(l.indexOf(v), 1);
  return l;
}
