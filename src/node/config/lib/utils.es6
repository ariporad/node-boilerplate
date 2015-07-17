import { v1, v4 } from 'node-uuid';

export function generateSecret() {
  return v1() + v4();
}

export function fail(reason) {
  throw new Error(reason);
}

export function removeDuplicates(array) {
  return array.filter((elem, pos) => {
    return array.indexOf(elem) === pos;
  });
}

export function last(array) {
  return array[array.length - 1];
}
