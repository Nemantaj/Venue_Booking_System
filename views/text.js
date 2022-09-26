const arr1 = [1, 5, 7];

const arr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// arr1.foreach((element) => {
//   if ((arr2[element] = 5)) {
//     arr2[element] = "works";
//   }
// });

for (const elem of arr1) {
  let v1 = arr2[elem];
  console.log(v1);
  if (v1 == 6) {
    arr2[elem] = "works";
  }
}
console.log(arr2);
