import Inventory from '../dist/extensions/Inventory.js'
import { equal, deepEqual } from 'assert'

describe('arrays should work as expected', () => {
  it('.get and .at should access the correct element', () => {
    const arr = Array.from([1, 2, 3])
    const binArr = Inventory.from(arr)

    deepEqual(arr[0], binArr.get(0))
    deepEqual(arr[1], binArr.get(1))
    deepEqual(arr[2], binArr.get(2))

    deepEqual(arr.at(-1), binArr.at(-1))
    deepEqual(arr.at(-2), binArr.at(-2))
    deepEqual(arr.at(-3), binArr.at(-3))

    deepEqual(arr.at(0), binArr.at(0))
    deepEqual(arr.at(1), binArr.at(1))
    deepEqual(arr.at(2), binArr.at(2))
  })

  it('.push, .pop, .unshift, .shift, .set should modify the collection the same', () => {
    const arr = Array.from([1, 2, 3])
    const binArr = Inventory.from(arr)

    deepEqual([...binArr], arr)

    binArr.push(6, 7, 8)
    binArr.set(3, binArr.pop())
    binArr.unshift(5, 4, 1)
    binArr.shift()

    arr.push(6, 7, 8)
    arr[3] = arr.pop()
    arr.unshift(5, 4, 1)
    arr.shift()

    deepEqual([...binArr], arr)
    deepEqual(arr.length, binArr.length)
  })

  it('.length should modify the collection the same', () => {
    const arr = Array.from([1, 2, 3])
    const binArr = Inventory.from(arr)
    deepEqual(arr.length, binArr.length)
    binArr.length = 2
    arr.length = 2
    deepEqual(arr.length, binArr.length)
    deepEqual([...binArr], arr)
  })
  it('.filter should work exactly like Array.prototype.filter', () => {
    const isPrime = (num) => {
      for (let i = 2; num > i; i++) if (num % i === 0) return false
      return num > 1
    }
    const array1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

    deepEqual(
      array1.filter(isPrime),
      Inventory.from(array1).filter(isPrime).items
    )

    let arrayInvalidEntries = 0
    let brrryArrayInvalidEntries = 0
    const array2 = [
      { id: 15 },
      { id: -1 },
      { id: 0 },
      { id: 3 },
      { id: 12.2 },
      {},
      { id: null },
      { id: NaN },
      { id: 'undefined' },
    ]
    deepEqual(
      array2.filter((item) => {
        if (Number.isFinite(item.id) && item.id !== 0) return true
        arrayInvalidEntries++
        return false
      }),
      Inventory.from(array2).filter((item) => {
        if (Number.isFinite(item.id) && item.id !== 0) return true
        brrryArrayInvalidEntries++
        return false
      }).items
    )
    deepEqual(arrayInvalidEntries, brrryArrayInvalidEntries)

    const fruits = ['apple', 'banana', 'grapes', 'mango', 'orange']
    const brrryFruits = Inventory.from(fruits)

    const filterItems = (arr, query) =>
      arr.filter((el) => el.toLowerCase().includes(query.toLowerCase()))
    deepEqual(filterItems(fruits, 'ap'), filterItems(brrryFruits, 'ap').items) // ['apple', 'grapes']
    deepEqual(filterItems(fruits, 'an'), filterItems(brrryFruits, 'an').items) // ['banana', 'mango', 'orange']

    const numbers = [1, 2, 3, 4, 5]
    deepEqual(
      Inventory.from(numbers).filter((x) => x % 2 === 0).items,
      numbers.filter((x) => x % 2 === 0)
    )
    deepEqual(
      Inventory.from(numbers).filter((x) => x % 2 === 0).items,
      numbers.filter((x) => x % 2 === 0)
    )
    deepEqual(
      Inventory.from([]).filter((x) => x % 2 === 0).items,
      [].filter((x) => x % 2 === 0)
    )
    deepEqual(
      Inventory.from(numbers).filter((x, i) => x === i + 1).items,
      numbers.filter((x, i) => x === i + 1)
    )
    deepEqual(
      Inventory.from(numbers).filter((x, i, arr) => x === arr.get(i)).items,
      numbers.filter((x, i, arr) => x === arr[i])
    )
  })

  it('operations 1 .map, .filter, .mergeSort, .reverse, .slice, .reduce, .flat should modify the collection the same', () => {
    const arr = [4, 1, 1, 2, 3, 8, 7]
    const binArr = Inventory.from(arr)

    const rasultBrrryArray = binArr
      .map((i) => i * i)
      .filter((i) => i > 3)
      .mergeSort((a, b) => a - b)
      .reverse()
      .slice(1)

    const resultArray = arr
      .map((i) => i * i)
      .filter((i) => i > 3)
      .sort((a, b) => a - b)
      .reverse()
      .slice(1)

    deepEqual([...rasultBrrryArray], resultArray)
    deepEqual(resultArray.length, rasultBrrryArray.length)

    const flatBinArr = rasultBrrryArray.concat(
      Inventory.from([
        51,
        12,
        33,
        Inventory.from([
          Inventory.from([1, 2, 3, 4, 5, Inventory.from([1, 2, 3, 4]), 1]),
          Inventory.from([2, 3, 4, 5]),
          Inventory.from([23, Inventory.from([222, 33, 1, 2])]),
        ]),
      ]).flat(3)
    )
    const flatArr = resultArray.concat(
      [
        51,
        12,
        33,
        [
          [1, 2, 3, 4, 5, [1, 2, 3, 4], 1],
          [2, 3, 4, 5],
          [23, [222, 33, 1, 2]],
        ],
      ].flat(3)
    )
    deepEqual([...flatBinArr], flatArr)
    deepEqual(
      flatBinArr.reduce((acc, i) => acc + i, 1),
      flatArr.reduce((acc, i) => acc + i, 1)
    )
    deepEqual(flatArr.length, flatBinArr.length)

    const infiniteArrNest = [
      [
        [[1, 2, 3, 4], [1, 2, 3, 4], 3, 4],
        [1, [1, 2, [1, 2, 3, 4], 4], 3, 4],
      ],
      [
        [1, 2, 3, 4],
        [1, 2, 3, 4],
      ],
    ]

    const infiniteBinNest = Inventory.from([
      Inventory.from([
        Inventory.from([
          Inventory.from([1, 2, 3, 4]),
          Inventory.from([1, 2, 3, 4]),
          3,
          4,
        ]),
        Inventory.from([
          1,
          Inventory.from([1, 2, Inventory.from([1, 2, 3, 4]), 4]),
          3,
          4,
        ]),
      ]),
      Inventory.from([
        Inventory.from([1, 2, 3, 4]),
        Inventory.from([1, 2, 3, 4]),
      ]),
    ])

    deepEqual(
      infiniteBinNest.flat(Infinity).items,
      infiniteArrNest.flat(Infinity)
    )
    deepEqual(infiniteArrNest.length, infiniteBinNest.length)
    deepEqual(
      infiniteArrNest.flat(Infinity).length,
      infiniteBinNest.flat(Infinity).items.length
    )
  })

  it('operations 2 .map, .filter, .mergeSort, .reverse, .slice, .reduce, .flat should modify the collection the same', () => {
    const arr = [4, 1, 1, 2, 3, 8, 7]
    const binArr = Inventory.from(arr)

    const rasultBrrryArray = binArr
      .map((i) => i ** i)
      .reverse()
      .mergeSort((a, b) => a + b)
      .slice(2)

    const resultArray = arr
      .map((i) => i ** i)
      .reverse()
      .sort((a, b) => a + b)
      .slice(2)

    deepEqual([...rasultBrrryArray], resultArray)
    deepEqual(resultArray.length, rasultBrrryArray.length)
  })
  it('.flat, flatten should work the same way', () => {
    const arr = [4, 1, 1, 2, 3, 8, 7]
    const binArr = Inventory.from(arr)
    const rasultBrrryArray = binArr.map((i) => i ** i + 10 - 2)
    const resultArray = arr.map((i) => i ** i + 10 - 2)
    const flatBinArr = rasultBrrryArray.concat(
      Inventory.from([
        51,
        12,
        33,
        Inventory.from([
          Inventory.from([
            1,
            2,
            3,
            4,
            5,
            rasultBrrryArray,
            [...Inventory.from([1, 2, 3, 4]).reverse().splice(1, 2)],
            1,
          ]),
          Inventory.from([2, 3, 4, 5]).slice(2, 4),
          Inventory.from([23, Inventory.from([222, 33, 1, 2])]),
        ]),
      ])
        .reverse()
        .flat(2)
    )

    const flatArr = resultArray.concat(
      [
        51,
        12,
        33,
        [
          [1, 2, 3, 4, 5, resultArray, [1, 2, 3, 4].reverse().splice(1, 2), 1],
          [2, 3, 4, 5].slice(2, 4),
          [23, [222, 33, 1, 2]],
        ],
      ]
        .reverse()
        .flat(2)
    )

    deepEqual(flatBinArr.items, flatArr)
    deepEqual(flatArr.length, flatBinArr.length)

    const flatMapArray = [[1, 2, 3, 4], [1, 2, 3, 4].reverse()]
    const flatMapBrrryArray = Inventory.from([
      Inventory.from([1, 2, 3, 4]),
      Inventory.from([1, 2, 3, 4]).reverse(),
    ])

    deepEqual(
      flatMapBrrryArray.flatten((x) => x * 10 + 4).items,
      flatMapArray.flatMap((item) => item.map((x) => x * 10 + 4))
    )
    deepEqual(
      [1, 2, [3, 4]].flat(),
      new Inventory().with(1, 2, new Inventory().with(3, 4)).flat().items
    )

    deepEqual(
      [1, 2, [3, 4, [5, 6]]].flat(),
      new Inventory()
        .with(1, 2, new Inventory().with(3, 4, new Inventory().with(5, 6)))
        .flat().items
    )
    deepEqual(
      [1, 2, [3, 4, [5, 6]]].flat(2),
      new Inventory()
        .with(1, 2, new Inventory().with(3, 4, new Inventory().with(5, 6)))
        .flat(2).items
    )
    deepEqual(
      [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]].flat(Infinity),
      new Inventory()
        .with(
          1,
          2,
          new Inventory().with(
            3,
            4,
            new Inventory().with(
              5,
              6,
              new Inventory().with(7, 8, new Inventory().with(9, 10))
            )
          )
        )
        .flat(Infinity).items
    )
    // ignore this case for now
    // deepEqual([1, 2, , 4, 5].flat(),
    //   Inventory.from([1, 2, , 4, 5]).flat().items
    // )
  })
  it('.reverse should modify the collection the same', () => {
    const arr1 = [4, 1, 1, 2, 3, 8, 7]
    const binArr1 = Inventory.from(arr1)
    deepEqual(binArr1.reverse().items, arr1.reverse())
    deepEqual(binArr1.reverse().reverse().items, arr1.reverse().reverse())
    deepEqual(arr1.length, binArr1.length)

    const arr2 = [4, 1, 1, 2, 3, 8, 7, 8]
    const binArr2 = Inventory.from(arr2)
    deepEqual(binArr2.reverse().items, arr2.reverse())
    deepEqual(binArr2.reverse().reverse().items, arr2.reverse().reverse())
    deepEqual(binArr2.length, arr2.length)
  })

  it('.slice should create a new collection from the same range', () => {
    const numbers = [1, 2, 3, 4, 5]
    const brrr = Inventory.from(numbers)
    deepEqual(brrr.slice().items, numbers.slice())
    deepEqual(brrr.slice(2).items, numbers.slice(2))
    deepEqual(brrr.slice(0, 3).items, numbers.slice(0, 3))
    deepEqual(brrr.slice(-2, -1).items, numbers.slice(-2, -1))
    deepEqual(brrr.slice(2, 1).items, numbers.slice(2, 1))

    const arr = [4, 1, 1, 2, 3, 8, 7]
    const binArr = Inventory.from(arr)
    deepEqual(binArr.slice(1).items, arr.slice(1))
    deepEqual(binArr.slice(1, 2).items, arr.slice(1, 2))
    deepEqual(binArr.slice(3).items, arr.slice(3))
    deepEqual(binArr.slice(2, 5).items, arr.slice(2, 5))
    deepEqual(binArr.slice(4, 5).items, arr.slice(4, 5))

    const favFruits = [
      'apple',
      'mango',
      'banana',
      'grapes',
      'blueberry',
      'kiwi',
      'papaya',
    ]
    const brrrFruites = Inventory.from(favFruits)
    deepEqual(brrrFruites.slice(-5, -1).items, favFruits.slice(-5, -1))
    deepEqual(brrrFruites.slice(-2, -1).items, favFruits.slice(-2, -1))
    deepEqual(brrrFruites.slice(-1, -1).items, favFruits.slice(-1, -1))
    deepEqual(brrrFruites.slice(-1, -2).items, favFruits.slice(-1, -2))
    deepEqual(brrrFruites.slice(-3, -2).items, favFruits.slice(-3, -2))
  })

  it('.splice should modify the array in place', () => {
    const months = ['Jan', 'March', 'April', 'June']
    const binMonths = Inventory.from(months)
    deepEqual(months.splice(1, 0, 'Feb'), [...binMonths.splice(1, 0, 'Feb')])
    deepEqual(months, [...binMonths])
    deepEqual(months.length, binMonths.length)
    deepEqual(months.splice(4, 1, 'May'), [...binMonths.splice(4, 1, 'May')])
    deepEqual(months, [...binMonths])
    deepEqual(months.length, binMonths.length)

    const arr = [1, 2, 3, 4, 5, 6]
    const binArr = Inventory.from(arr)

    deepEqual(arr.splice(2, 3, 'a', 'b', 'c'), [
      ...binArr.splice(2, 3, 'a', 'b', 'c'),
    ])
    deepEqual(arr, [...binArr])
    deepEqual(arr.length, binArr.length)
  })

  it('.addTo shoud update the size of the array if index is bigger than the current array size', () => {
    const arr = [4, 1, 1, 2, 3, 8, 7]
    const binArr = Inventory.from(arr)
    arr[20] = 10
    binArr.addTo(20, 10)
    deepEqual(Array.from(arr), binArr.items)
    equal(arr[15], binArr.get(15))
    equal(arr.length, binArr.length)
  })

  it('.join should return deepEqualed array', () => {
    const string = '0101010101.01010101010101000.010101001.01.0101001.010.101'
    equal(
      Inventory.from(string)
        .filter((x) => x !== '.')
        .join('.'),
      Array.from(string)
        .filter((x) => x !== '.')
        .join('.')
    )
  })

  it('.includes should return deepEqualed array', () => {
    const arr = ['apple', 'orange', 'peach', 'lemon']
    const binArr = Inventory.from(arr)
    equal(binArr.includes('orange'), arr.includes('orange'))
    equal(binArr.includes('lemon'), arr.includes('lemon'))
    equal(binArr.includes('pomegranate'), arr.includes('pomegranate'))

    equal([1, 2, 3].includes(2), Inventory.from([1, 2, 3]).includes(2))
    equal([1, 2, 3].includes(4), Inventory.from([1, 2, 3]).includes(4))
    equal([1, 2, 3].includes(3, 3), Inventory.from([1, 2, 3]).includes(3, 3))
    equal([1, 2, 3].includes(3, -1), Inventory.from([1, 2, 3]).includes(3, -1))
    equal([1, 2, NaN].includes(NaN), Inventory.from([1, 2, NaN]).includes(NaN))
    equal(
      ['1', '2', '3'].includes(3),
      Inventory.from(['1', '2', '3']).includes(3)
    )
  })

  it('.find should return deepEqualed array', () => {
    const isPrime = (num) => {
      for (let i = 2; num > i; i++) if (num % i === 0) return false
      return num > 1
    }
    const arr = ['apple', 'orange', 'peach', 'lemon']
    const binArr = Inventory.from(arr)
    equal(
      binArr.find((item) => item === 'orange'),
      arr.find((item) => item === 'orange')
    )
    equal(
      binArr.find((item) => item === 'lemon'),
      arr.find((item) => item === 'lemon')
    )
    equal(
      binArr.find((item) => item === 'pomegranate'),
      arr.find((item) => item === 'pomegranate')
    )
    equal(binArr.indexOf('orange'), arr.indexOf('orange'))
    equal(binArr.indexOf('lemon'), arr.indexOf('lemon'))
    equal(binArr.indexOf('pomegranate'), arr.indexOf('pomegranate'))

    const lastArr1 = [4, 6, 8, 12]
    const lastArr2 = [4, 5, 7, 8, 9, 11, 12]
    const lastBin1 = Inventory.from(lastArr1)
    const lastBin2 = Inventory.from(lastArr2)
    // Todo use Array.prototype.findLast once it is available in node
    deepEqual([...lastArr1].reverse().find(isPrime), lastBin1.findLast(isPrime)) // undefined, not found
    deepEqual([...lastArr2].reverse().find(isPrime), lastBin2.findLast(isPrime)) // 11
    deepEqual(
      [...lastArr1].reverse().find(isPrime),
      lastBin1.reverse().find(isPrime)
    ) // undefined, not found
    deepEqual(
      [...lastArr2].reverse().find(isPrime),
      lastBin2.reverse().find(isPrime)
    ) // 11
  })

  it('.splice should return deepEqualed array', () => {
    const arr1 = ['angel', 'clown', 'mandarin', 'sturgeon']
    const ba1 = Inventory.from(arr1)
    deepEqual(arr1.splice(2, 0, 'drum'), ba1.splice(2, 0, 'drum').items)
    deepEqual(arr1, ba1.items)

    const arr2 = ['angel', 'clown', 'mandarin', 'sturgeon']
    const ba2 = Inventory.from(arr2)
    deepEqual(
      ba2.splice(2, 0, 'drum', 'guitar').items,
      arr2.splice(2, 0, 'drum', 'guitar')
    )
    deepEqual(arr2, ba2.items)
    const arr3 = ['angel', 'clown', 'drum', 'mandarin', 'sturgeon']
    const ba3 = Inventory.from(arr3)
    deepEqual(ba3.splice(3, 1).items, arr3.splice(3, 1))
    deepEqual(arr3, ba3.items)

    const arr4 = ['angel', 'clown', 'trumpet', 'sturgeon']
    const ba4 = Inventory.from(arr4)
    deepEqual(
      ba4.splice(0, 2, 'parrot', 'anemone', 'blue').items,
      arr4.splice(0, 2, 'parrot', 'anemone', 'blue')
    )
    deepEqual(arr4, ba4.items)

    const arr5 = ['parrot', 'anemone', 'blue', 'trumpet', 'sturgeon']
    const ba5 = Inventory.from(arr5)
    deepEqual(ba5.splice(2, 2).items, arr5.splice(2, 2))
    deepEqual(arr5, ba5.items)

    const arr6 = ['angel', 'clown', 'mandarin', 'sturgeon']
    const ba6 = Inventory.from(arr6)
    deepEqual(ba6.splice(2).items, arr6.splice(2))
    deepEqual(arr6, ba6.items)

    const arr7 = ['angel', 'clown', 'mandarin', 'sturgeon']
    const ba7 = Inventory.from(arr7)
    deepEqual(ba7.splice(-2, 1).items, arr7.splice(-2, 1))
    deepEqual(arr7, ba7.items)

    const arr8 = ['angel', 'clown', 'drum', 'sturgeon']
    const ba8 = Inventory.from(arr8)

    deepEqual(arr8.splice(2, 1, 'trumpet'), ba8.splice(2, 1, 'trumpet').items)
    deepEqual(arr8, ba8.items)
  })

  it('.every should work like array.every', () => {
    const isBigEnough = (element) => element >= 10
    equal(
      Inventory.from([12, 5, 8, 130, 44]).every(isBigEnough),
      [12, 5, 8, 130, 44].every(isBigEnough)
    )
    equal(
      Inventory.from([12, 54, 18, 130, 44]).every(isBigEnough),
      [12, 54, 18, 130, 44].every(isBigEnough)
    )

    const isSubset = (array1, array2) =>
      array2.every((element) => array1.includes(element))

    equal(
      isSubset(
        Inventory.from([1, 2, 3, 4, 5, 6, 7]),
        Inventory.from([5, 7, 6])
      ),
      isSubset([1, 2, 3, 4, 5, 6, 7], [5, 7, 6])
    ) // true
    equal(
      isSubset(
        Inventory.from([1, 2, 3, 4, 5, 6, 7]),
        Inventory.from([5, 8, 7])
      ),
      isSubset([1, 2, 3, 4, 5, 6, 7], [5, 8, 7])
    ) // false

    equal(
      Inventory.from([1, undefined, 3]).every((x) => x !== undefined),
      [1, undefined, 3].every((x) => x !== undefined)
    ) // true
    equal(
      Inventory.from([2, undefined, 3]).every((x) => x === 2),
      [2, undefined, 2].every((x) => x === 2)
    ) // true
    // ---------------
    // Modifying items
    // ---------------
    const arr = [1, 2, 3, 4]
    let out1 = ''
    arr.every((elem, index, arr) => {
      arr[index + 1]--
      out1 += `[${arr}][${index}] -> ${elem}`
      return elem < 2
    })
    const brrr = Inventory.from([1, 2, 3, 4])
    let out2 = ''
    brrr.every((elem, index, arr) => {
      arr.set(index + 1, arr.get(index + 1) - 1)
      out2 += `[${arr.items}][${index}] -> ${elem}`
      return elem < 2
    })
    equal(out1, out2)
    // Loop runs for 3 iterations, but would
    // have run 2 iterations without any modification
    //
    // 1st iteration: [1,1,3,4][0] -> 1
    // 2nd iteration: [1,1,2,4][1] -> 1
    // 3rd iteration: [1,1,2,3][2] -> 2
    // ---------------
    // Appending items
    // ---------------
    const arr2 = [1, 2, 3]
    let out3 = ''
    arr2.every((elem, index, arr) => {
      arr.push('new')
      out3 += `[${arr}][${index}] -> ${elem}`
      return elem < 4
    })
    const brrr2 = Inventory.from([1, 2, 3])
    let out4 = ''
    brrr2.every((elem, index, arr) => {
      arr.push('new')
      out4 += `[${arr.items}][${index}] -> ${elem}`
      return elem < 4
    })
    equal(out3, out4)
    // Loop runs for 3 iterations, even after appending new items
    //
    // 1st iteration: [1, 2, 3, new][0] -> 1
    // 2nd iteration: [1, 2, 3, new, new][1] -> 2
    // 3rd iteration: [1, 2, 3, new, new, new][2] -> 3
    // ---------------
    // Deleting items
    // ---------------
    const arr3 = [1, 2, 3, 4]
    let out5 = ''
    arr3.every((elem, index, arr) => {
      arr.pop()
      out5 += `[${arr}][${index}] -> ${elem}`
      return elem < 4
    })

    const brrr3 = Inventory.from([1, 2, 3, 4])
    let out6 = ''
    brrr3.every((elem, index, arr) => {
      arr.pop()
      out6 += `[${arr.items}][${index}] -> ${elem}`
      return elem < 4
    })

    equal(out5, out6)

    // Loop runs for 2 iterations only, as the remaining
    // items are `pop()`ed off
    //
    // 1st iteration: [1,2,3][0] -> 1
    // 2nd iteration: [1,2][1] -> 2

    const numbers = [1, 2, 3, 4, 5]

    equal(
      Inventory.from(numbers).every((x) => x > 0),
      numbers.every((x) => x > 0)
    )
    equal(
      Inventory.from(numbers).every((x) => x % 2 === 0),
      numbers.every((x) => x % 2 === 0)
    )
    equal(
      Inventory.from([]).every((x) => x % 2 === 0),
      [].every((x) => x % 2 === 0)
    )
    equal(
      Inventory.from(numbers).every((x, i) => x === i + 1),
      numbers.every((x, i) => x === i + 1)
    )
    equal(
      Inventory.from(numbers).every((x, i, arr) => x === arr.get(i)),
      numbers.every((x, i, arr) => x === arr[i])
    )

    equal(
      Inventory.from(numbers).some((x) => x > 0),
      numbers.some((x) => x > 0)
    )
    equal(
      Inventory.from(numbers).some((x) => x % 2 === 0),
      numbers.some((x) => x % 2 === 0)
    )
    equal(
      Inventory.from([]).some((x) => x % 2 === 0),
      [].some((x) => x % 2 === 0)
    )
    equal(
      Inventory.from(numbers).some((x, i) => x === i + 1),
      numbers.some((x, i) => x === i + 1)
    )
    equal(
      Inventory.from(numbers).some((x, i, arr) => x === arr.get(i)),
      numbers.some((x, i, arr) => x === arr[i])
    )
  })

  function isBiggerThan10(element, index, array) {
    return element > 10
  }
  equal(
    [2, 5, 8, 1, 4].some(isBiggerThan10),
    Inventory.from([2, 5, 8, 1, 4]).some(isBiggerThan10)
  ) // false
  equal(
    [12, 5, 8, 1, 4].some(isBiggerThan10),
    Inventory.from([12, 5, 8, 1, 4]).some(isBiggerThan10)
  ) // true
  equal(
    [2, 5, 8, 1, 4].some((x) => x > 10),
    Inventory.from([2, 5, 8, 1, 4]).some((x) => x > 10)
  ) // false
  equal(
    [12, 5, 8, 1, 4].some((x) => x > 10),
    Inventory.from([12, 5, 8, 1, 4]).some((x) => x > 10)
  ) // true
  it('.rotate should work', () => {
    const arr1 = [1, 2, 3]
    deepEqual(Inventory.from(arr1).copy().rotate(0, 1).items, [1, 2, 3])
    deepEqual(Inventory.from(arr1).copy().rotate(1, 1).items, [3, 1, 2])
    deepEqual(Inventory.from(arr1).copy().rotate(2, 1).items, [2, 3, 1])
    deepEqual(Inventory.from(arr1).copy().rotate(3, 1).items, [1, 2, 3])
    deepEqual(Inventory.from(arr1).copy().rotate(4, 1).items, [3, 1, 2])
    deepEqual(Inventory.from(arr1).copy().rotate(6, 1).items, [1, 2, 3])
    deepEqual(Inventory.from(arr1).copy().rotate(0, -1).items, [1, 2, 3])
    deepEqual(Inventory.from(arr1).copy().rotate(1, -1).items, [2, 3, 1])
    deepEqual(Inventory.from(arr1).copy().rotate(2, -1).items, [3, 1, 2])
    deepEqual(Inventory.from(arr1).copy().rotate(3, -1).items, [1, 2, 3])
    deepEqual(Inventory.from(arr1).copy().rotate(4, -1).items, [2, 3, 1])
    deepEqual(Inventory.from(arr1).copy().rotate(6, -1).items, [1, 2, 3])

    const arr2 = [1, 2, 3, 4]

    deepEqual(Inventory.from(arr2).copy().rotate(0, 1).items, [1, 2, 3, 4])
    deepEqual(Inventory.from(arr2).copy().rotate(1, 1).items, [4, 1, 2, 3])
    deepEqual(Inventory.from(arr2).copy().rotate(2, 1).items, [3, 4, 1, 2])
    deepEqual(Inventory.from(arr2).copy().rotate(3, 1).items, [2, 3, 4, 1])
    deepEqual(Inventory.from(arr2).copy().rotate(4, 1).items, [1, 2, 3, 4])
  })

  it('.compact should work', () => {
    deepEqual(
      new Inventory().with(1, 0, 0, 4, '', false, undefined, 3, 4).compact()
        .items,
      [1, 4, 3, 4]
    )
  })

  it('.unique should work', () => {
    deepEqual(
      new Inventory().with(1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3).unique().items,
      [1, 2, 3]
    )
  })

  it('.duplicates should work', () => {
    deepEqual(
      new Inventory()
        .with(1, 2, 2, 0, 2, 5, 2, 9, 3, 3, 3, 4, 8, 9)
        .duplicates()
        .mergeSort().items,
      [2, 2, 2, 2, 3, 3, 3, 9, 9]
    )
  })

  it('.partition should work', () => {
    deepEqual(
      new Inventory().with(1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3).partition(3).items,
      [
        [1, 1, 1],
        [1, 2, 2],
        [2, 2, 3],
        [3, 3],
      ]
    )
  })

  it('.swap should work', () => {
    const arr = new Inventory().with(1, 2, 3)
    arr.swap(0, 2)
    deepEqual([...arr], [3, 2, 1])
    arr.swap(0, 2)
    deepEqual([...arr], [1, 2, 3])
  })

  it('.scan should work', () => {
    const out = []
    new Inventory()
      .with(1, 2, 3)
      .scan((x) => out.push(x))
      .scan((x) => out.push(x * 2))
      .scan((x) => out.push(x * 3))
    deepEqual(out, [1, 2, 3, 2, 4, 6, 3, 6, 9])
  })

  it('.append, .prepend, .tail, .head, .insertLeft, .insertRight should work', () => {
    const arr = new Inventory().with(1, 2, 3)
    deepEqual(
      arr.append(4).append(5).prepend(0).prepend(-1).prepend(-2).items,
      [-2, -1, 0, 1, 2, 3, 4, 5]
    )
    deepEqual(arr.tail().head().tail().head().items, [0, 1, 2, 3])
    equal(arr.cut(), 3)
    deepEqual(arr.items, [0, 1, 2])
    equal(arr.chop(), 0)
    deepEqual(arr.items, [1, 2])
    equal(arr.chop(), 1)
    equal(arr.chop(), 2)
    deepEqual(
      new Inventory().insertLeft(-2, -1).insertRight(0, 1, 2, 3, 4).items,
      [-2, -1, 0, 1, 2, 3, 4]
    )
  })

  it('.balance should work', () => {
    const arr = new Inventory().with(6, 6, 6)
    arr.push(-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    arr.unshift(-3, -4)
    equal(arr.length, 18)
    arr.balance()
    deepEqual(arr.offsetLeft * -1, arr.offsetRight)
    equal(arr.length, 18)
  })

  it('.removeFrom and .addAt should work', () => {
    deepEqual(
      new Inventory()
        .with(-2, -1, 0, 1, 2, 3, 4, 5, 2, 3, 4, 5)
        .removeFrom(0, 0).items,
      [-2, -1, 0, 1, 2, 3, 4, 5, 2, 3, 4, 5]
    )
    deepEqual(
      new Inventory()
        .with(-2, -1, 0, 1, 2, 3, 4, 5, 2, 3, 4, 5)
        .removeFrom(0, 1).items,
      [-1, 0, 1, 2, 3, 4, 5, 2, 3, 4, 5]
    )
    deepEqual(
      new Inventory()
        .with(-2, -1, 0, 1, 2, 3, 4, 5, 2, 3, 4, 5)
        .removeFrom(0, 2).items,
      [0, 1, 2, 3, 4, 5, 2, 3, 4, 5]
    )
    deepEqual(
      new Inventory()
        .with(-2, -1, 0, 1, 2, 3, 4, 5, 2, 3, 4, 5)
        .removeFrom(1, 1).items,
      [-2, 0, 1, 2, 3, 4, 5, 2, 3, 4, 5]
    )
    deepEqual(
      new Inventory()
        .with(-2, -1, 0, 1, 2, 3, 4, 5, 2, 3, 4, 5)
        .removeFrom(2, 1).items,
      [-2, -1, 1, 2, 3, 4, 5, 2, 3, 4, 5]
    )
    deepEqual(
      new Inventory()
        .with(-2, -1, 0, 1, 2, 3, 4, 5, 2, 3, 4, 5)
        .removeFrom(2, 4).items,
      [-2, -1, 4, 5, 2, 3, 4, 5]
    )
    const arr = [1, 2, 3, 4, 5, 6, 7]
    deepEqual(Inventory.from(arr).copy().removeFrom(1, 3).items, [1, 5, 6, 7])
    deepEqual(Inventory.from(arr).copy().removeFrom(1, arr.length).items, [1])
    deepEqual(
      Inventory.from(arr).copy().removeFrom(3, 1).items,
      [1, 2, 3, 5, 6, 7]
    )
    deepEqual(
      Inventory.from(arr).copy().removeFrom(3, 0).items,
      [1, 2, 3, 4, 5, 6, 7]
    )
    deepEqual(Inventory.from(arr).copy().removeFrom(0, arr.length).items, [])

    deepEqual(
      Inventory.of(1, 2, 3, 4).addAt(2, '#1', '#2', '#3').removeFrom(1, 3)
        .items,
      [1, '#3', 3, 4]
    )

    deepEqual(Inventory.of(1, 2, 3, 4).addAt(3, '#1', '#2', '#3').items, [
      1,
      2,
      3,
      '#1',
      '#2',
      '#3',
      4,
    ])
    deepEqual(Inventory.of(1, 2, 3, 4).addAt(4, '#1', '#2', '#3').items, [
      1,
      2,
      3,
      4,
      '#1',
      '#2',
      '#3',
    ])
    deepEqual(Inventory.of(1, 2, 3, 4).addAt(0, '#1', '#2', '#3').items, [
      '#1',
      '#2',
      '#3',
      1,
      2,
      3,
      4,
    ])
    deepEqual(
      Inventory.of(1, 2, 3, 4)
        .addAt(2, '#1', '#2', '#3', '#4')
        .addAt(1, '#0')
        .removeFrom(1, 1)
        .removeFrom(2, 4).items,
      [1, 2, 3, 4]
    )

    deepEqual(Inventory.of(1, 2, 3, 4).removeFrom(3, 1).items, [1, 2, 3])
    deepEqual(Inventory.of(1, 2, 3, 4).removeFrom(3, 5).items, [1, 2, 3])
  })

  it('.group should work', () => {
    const group = new Inventory()
      .with(1, 2, 3, 4, 4, 5, 8, 9, 1, 2, 32, 222, 2)
      .group((item) => (item % 2 == 0 ? 'even' : 'odd'))

    deepEqual(
      group,
      new Map([
        ['odd', Inventory.of(1, 3, 5, 9, 1)],
        ['even', Inventory.of(2, 4, 4, 8, 2, 32, 222, 2)],
      ])
    )
  })

  it('.isSorted should work', () => {
    equal(Inventory.of(1, 2, 3, 4, 5).isSorted(), true)
    equal(Inventory.of(1, 2, 8, 9, 9).isSorted(), true)
    equal(Inventory.of(1, 2, 2, 3, 2).isSorted(), false)
    equal(Inventory.of('a', 'b', 'c').isSorted(), true)
    equal(Inventory.of('a', 'c', 'b').isSorted(), false)
    equal(Inventory.of('c', 'b', 'a').isSorted(), false)
    equal(Inventory.of('c', 'b', 'a').isSorted(false), true)
    equal(Inventory.of(1, 2, 3, 4).quickSort(1).isSorted(1), true)
    equal(Inventory.of(1, 2, 3, 4).quickSort(-1).isSorted(-1), true)
    equal(Inventory.of(1, 2, 3, 4).quickSort(1).isSorted(-1), false)
    equal(Inventory.of(1, 2, 3, 4).quickSort(-1).isSorted(1), false)
    equal(
      Inventory.from([
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 4 },
      ]).isSorted(
        (current, index, arr) => !index || arr.at(index - 1).key <= current.key
      ),
      true
    )
    equal(
      Inventory.from([
        { key: 'b', value: 1 },
        { key: 'a', value: 8 },
        { key: 'c', value: 9 },
      ]).isSorted(
        (current, index, arr) => !index || arr.at(index - 1).key <= current.key
      ),
      false
    )
  })

  it('.quickSort should work', () => {
    deepEqual(
      Inventory.from([3, 1, 8, 5, 9, 1, 2, 4]).quickSort(1).items,
      [1, 1, 2, 3, 4, 5, 8, 9]
    )
    deepEqual(
      Inventory.from([3, 1, 8, 5, 9, 1, 2, 4]).quickSort(-1).items,
      [1, 1, 2, 3, 4, 5, 8, 9].reverse()
    )
  })

  it('.search should work', () => {
    equal(Inventory.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).search(3), 3)
    equal(Inventory.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).search(9), 9)
    equal(Inventory.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).search(11), undefined)
    const searchKey = 'd'
    const objectTarget = { key: searchKey, value: 7 }
    deepEqual(
      Inventory.from([
        { key: 'f', value: 14 },
        { key: 'g', value: 24 },
        { key: 'g', value: 14 },
        { key: 'b', value: 2 },
        { key: 'c', value: 43 },
        objectTarget,
        { key: 'e', value: 24 },
        { key: 'a', value: 1 },
        { key: 'm', value: 24 },
        { key: 'l', value: 43 },
      ])
        .mergeSort((a, b) => (a.key > b.key ? 1 : -1))
        .search(searchKey, (current) => current.key),
      objectTarget
    )

    const input = [1, 2, 3, 2, 3, 7, 1, 2, 3, 2, 3, 7, 13]
    deepEqual(
      new Inventory()
        .with(...input)
        .unique()
        .map((x, i) => ({ key: x + '-' + i, x }))
        .mergeSort((a, b) => (a.key.localeCompare(b.key) ? 1 : -1))
        .search(
          '3-2',
          (current) => current.key,
          (current) => current.key.localeCompare('3-2')
        ),
      { key: '3-2', x: 3 }
    )
    deepEqual(
      new Inventory()
        .with(...input)
        .unique()
        .map((x, i) => ({ key: x + '-' + i, x }))
        .mergeSort((a, b) => (a.key.localeCompare(b.key) ? -1 : 1))
        .search(
          '3-2',
          (current) => current.key,
          (current) => current.key.localeCompare('3-2')
        ),
      { key: '3-2', x: 3 }
    )

    const dateTarget = new Date('1970-01-01T00:00:00.002Z')
    deepEqual(
      new Inventory()
        .with(...input)
        .unique()
        .map((x, i) => ({ date: new Date(i), x }))
        .mergeSort((a, b) => (a.date.getTime() > b.date.getTime() ? -1 : 1))
        .search(
          dateTarget.getTime(),
          (current) => current.date.getTime(),
          (current) => current.date.getTime() > dateTarget.getTime()
        ),
      { date: dateTarget, x: 3 }
    )
  })

  it('.without should work', () => {
    const items = [2, 1, 2, 3]
    const binArr = Inventory.from(items)
    deepEqual(binArr.without(1, 2).items, [3])
    deepEqual(binArr.without(1).items, [2, 2, 3])
    deepEqual(binArr.without(3).items, [2, 1, 2])
  })

  it('.isInBouds and .getInBounds should work', () => {
    const binArr = new Inventory().with(0, 1, 2, 3)
    equal(binArr.isInBounds(4), false)
    equal(binArr.isInBounds(-1), false)
    equal(binArr.isInBounds(2), true)
    equal(binArr.getInBounds(2), 2)
    equal(binArr.getInBounds(192), 3)
    equal(binArr.getInBounds(0), 0)
    equal(binArr.getInBounds(-100), 0)
  })

  it('.take and .takeRight should work', () => {
    deepEqual(Inventory.from([1, 2, 3]).take().items, [1])
    deepEqual(Inventory.from([1, 2, 3]).take(2).items, [1, 2])
    deepEqual(Inventory.from([1, 2, 3]).take(5).items, [1, 2, 3])
    deepEqual(Inventory.from([]).take(0).items, [])

    deepEqual(Inventory.from([1, 2, 3]).takeRight().items, [3])
    deepEqual(Inventory.from([2, 3]).takeRight(2).items, [2, 3])
    deepEqual(Inventory.from([1, 2, 3]).takeRight(5).items, [1, 2, 3])
    deepEqual(Inventory.from([]).takeRight(0).items, [])
  })
  it('.swapRemove should work', () => {
    const arr = new Inventory().with(1, 2, 3, 4, 5)
    arr.swapRemoveLeft(2)
    deepEqual(arr.items, [2, 3, 1, 5])
    arr.swapRemoveRight(2)
    deepEqual(arr.items, [2, 3, 5])
  })
  it('.to should work', () => {
    equal(
      Inventory.from('(())')
        .to((acc, x) =>
          x === '('
            ? acc.prepend(x)
            : acc.first === '('
            ? acc.tail()
            : acc.append(x)
        )
        .isEmpty(),
      true
    )

    equal(
      Inventory.from('101234')
        .map(Number)
        .to((acc, item) => (acc += item), 0),
      11
    )
  })
  it('.zeroes and .ones should work', () => {
    deepEqual(Inventory.zeroes(4).items, [0, 0, 0, 0])
    deepEqual(Inventory.ones(8).items, [1, 1, 1, 1, 1, 1, 1, 1])
  })
  it('.shape should work', () => {
    deepEqual(Inventory.of(1, 1, 1, 1).shape, [4])
    deepEqual(
      Inventory.of(Inventory.of(1, 1, 1), Inventory.of(1, 1, 1)).shape,
      [[3], [3]]
    )
    deepEqual(
      Inventory.of(
        Inventory.of(
          Inventory.of(1, 1),
          Inventory.of(
            Inventory.of(1, 1, 1),
            Inventory.of(1, 1),
            Inventory.of(1)
          ),
          Inventory.of(1, 1, 1, 1, 1, 1)
        ),
        Inventory.of(1, 1, 1)
      ).shape,
      [[[2], [[3], [2], [1]], [6]], [3]]
    )
  })
  it('.reject should work exactly like and inverse of Array.prototype.filter', () => {
    const isPrime = (num) => {
      for (let i = 2; num > i; i++) if (num % i === 0) return false
      return num > 1
    }
    const array1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

    deepEqual(
      array1.filter((x) => !isPrime(x)),
      Inventory.from(array1).reject(isPrime).items
    )

    const array2 = [
      { id: 15 },
      { id: -1 },
      { id: 0 },
      { id: 3 },
      { id: 12.2 },
      {},
      { id: null },
      { id: NaN },
      { id: 'undefined' },
    ]
    deepEqual(
      array2.filter((item) => {
        if (!(Number.isFinite(item.id) && item.id !== 0)) return true
        return false
      }),
      Inventory.from(array2).reject((item) => {
        if (Number.isFinite(item.id) && item.id !== 0) return true
        return false
      }).items
    )
  })
  it('.merge should work', () => {
    const arr = Inventory.of(1, 2, 3, 4)
    deepEqual(
      arr.merge(arr.copy(), arr.copy(), arr.copy(), arr.copy()).items,
      [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]
    )
    deepEqual(
      Inventory.of(1, 2, 3, 4).merge(
        Inventory.of(5, 6, 7, 8),
        Inventory.of(9, 10)
      ).items,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    )
  })
  it('.isCompact and .isSparce should work', () => {
    equal(Inventory.of(1, 2, 3, 4).isCompact(), true)
    equal(Inventory.of(1, 2, 3, 4).isSparce(), false)
    equal(Inventory.of(1, 2, 3, undefined, 4).isCompact(), false)
    equal(Inventory.of(1, 2, 3, undefined, 4).isSparce(), true)
  })
  it('.isEqual should work', () => {
    equal(Inventory.of(1, 2, 3, 4).isEqual(Inventory.of(1, 2, 3, 4)), true)
    equal(Inventory.of(1, 2, 3, 4).isEqual(Inventory.of(1, 2, 5, 4)), false)
    equal(Inventory.of(1, 2, 3, 4).isEqual(Inventory.of(1, 2, 3, 4, 5)), false)
    equal(
      Inventory.of(1, [1, 2, 3], {
        x: 1,
        y: Inventory.of(1, 2, { a: [1, 2, 3] }),
      }).isEqual(
        Inventory.of(1, [1, 2, 3], {
          x: 1,
          y: Inventory.of(1, 2, { a: [1, 2, 3] }),
        })
      ),
      true
    )
    equal(
      Inventory.of(1, [1, 2, 3], {
        x: 1,
        y: Inventory.of(1, 2, { a: [1, 2, 3] }),
      }).isEqual(
        Inventory.of(1, [1, 2, 3], {
          m: 1,
          y: Inventory.of(1, 2, { a: [1, 2, 3] }),
        })
      ),
      false
    )
    equal(
      Inventory.of(1, [1, 2, 3], {
        x: 1,
        y: Inventory.of(1, 2, { a: [2, 2, 3] }),
      }).isEqual(
        Inventory.of(1, [1, 2, 3], {
          x: 1,
          y: Inventory.of(1, 2, { a: [1, 2, 3] }),
        })
      ),
      false
    )
    equal(
      Inventory.of(1, [1, 2, 3], 3, {
        x: 1,
        y: Inventory.of(1, 2, { a: [1, 2, 3] }),
      }).isEqual(
        Inventory.of(1, [1, 2, 3], {
          x: 1,
          y: Inventory.of(1, 2, { a: [1, 2, 3] }),
        })
      ),
      false
    )
  })

  it(`.imbalance should work`, () => {
    const a = Inventory.of(1, 2, 3, 4).imbalance(-1).reflection
    const b = Inventory.of(1, 2, 3, 4).imbalance(1).reflection
    equal(a.left.length, 5)
    equal(a.right.length, 0)
    equal(b.left.length, 1)
    equal(b.right.length, 4)
    deepEqual(a.left.slice(1), [4, 3, 2, 1])
    deepEqual(a.right, [])
    deepEqual(b.left.slice(1), [])
    deepEqual(b.right, [1, 2, 3, 4])
  })
  it(`.uniform should work`, () => {
    deepEqual(Inventory.of(1, 2, 3, 4).uniform(), new Set([1, 2, 3, 4]))
    deepEqual(Inventory.of(2, 3, 3, 3, 4).uniform(), new Set([2, 3, 4]))
  })
})
