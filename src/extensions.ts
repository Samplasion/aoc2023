declare global {
  interface Array<T> {
    get(index: number): T;
  }
}

Array.prototype.get = function (index: number) {
  if (index < 0) {
    index = this.length + index;
  }
  return this[index];
}