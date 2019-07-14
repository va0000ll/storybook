let arr = [
  {
    number: 2,
    name: 'person1'
  },
  {
    number: 4,
    name: 'person1'
  },
  {
    number: 1,
    name: 'person1'
  },
  {
    number: 6,
    name: 'person1'
  }
];

let arr1 = arr => arr.sort((a, c) => a.number - c.number);
let arr2 = arr =>
  arr.sort((a, c) => (a.number > c.number ? 1 : a.number < c.number ? 0 : -1));

let oarr1 = arr1(arr);
let oarr2 = arr2(arr);

console.log(oarr1);
console.log(oarr2);
