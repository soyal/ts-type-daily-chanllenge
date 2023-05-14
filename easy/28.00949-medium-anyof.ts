/*
  949 - AnyOf
  -------
  by null (@kynefuk) #medium #array

  ### Question

  Implement Python liked `any` function in the type system. A type takes the Array and returns `true` if any element of the Array is true. If the Array is empty, return `false`.

  For example:

  ```ts
  type Sample1 = AnyOf<[1, '', false, [], {}]> // expected to be true.
  type Sample2 = AnyOf<[0, '', false, [], {}]> // expected to be false.
  ```

  > View on GitHub: https://tsch.js.org/949
*/

/* _____________ Your Code Here _____________ */

// type FalsyVal<V> = V extends [] | Record<string, never> | '' | 0 | false | undefined | null ? false : true



type AnyOf<T extends readonly any[]> = T[number] extends Record<string, never> | '' | 0 | false | undefined | null | [] ? false: true

type T1<T extends any[]> = T[number] extends [] ? true: false // T[number] 也会代指本身

type T2<T extends any[]> = T[number] extends 1 ? true: false

type a = T1<[[]]>
type b = AnyOf<[]>
type c1 = T2<[1,2]>
type c2 = T2<[1,1]>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<
    Equal<AnyOf<[1, "test", true, [1], { name: "test" }, { 1: "test" }]>, true>
  >,
  Expect<Equal<AnyOf<[1, "", false, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, "test", false, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, "", true, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, "", false, [1], {}]>, true>>,
  Expect<Equal<AnyOf<[0, "", false, [], { name: "test" }]>, true>>,
  Expect<Equal<AnyOf<[0, "", false, [], { 1: "test" }]>, true>>,
  Expect<
    Equal<AnyOf<[0, "", false, [], { name: "test" }, { 1: "test" }]>, true>
  >,
  Expect<Equal<AnyOf<[0, "", false, [], {}, undefined, null]>, false>>,
  Expect<Equal<AnyOf<[]>, false>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/949/answer
  > View solutions: https://tsch.js.org/949/solutions
  > More Challenges: https://tsch.js.org
*/
