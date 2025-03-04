function flat(list) {
  return list.reduce((l, x) => l.concat(x), []);
}
