import React from 'react'

const Destruccture = () => {
    const arr1 = [1, 2, 3, 4];
    const arr2 = [4, 5, 6, 7, 8];
    // arr2.add(9)
    const arr3 = new Set([...arr1, ...arr2]);
    const [a, b, ...rest] = arr1;
    console.log(rest);
    console.log(...arr3);

    const obj = {a:1 , b:2 , c:3};
    const obj2 = {c:4 , d:5 , e:6};
    const obj3 = Object.assign(obj2,obj)
    console.log(Object.keys(obj))
    console.log(Object.values(obj));
    console.log(obj3);
    console.log(obj);

  return (
    <>
    </>
  )
}

export default Destruccture;