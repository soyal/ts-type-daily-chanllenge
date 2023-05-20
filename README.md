# ts类型体操
https://github.com/type-challenges/type-challenges

## 重点关注
3.00011-easy-tuple-to-object.ts, 可以用T[number]来获取数组中元素类型集合
比如
```typescript
const arr = [1,'2'];
type X = (typeof arr)[number]
// type X = string | number
```

4.00009-medium-deep-readonly.ts，递归调用
```typescript
type DeepReadonly<T> = T extends Function ? T: {
    readonly [P in keyof T]: DeepReadonly<T[P]>
}
```
还有一点需要注意的是，Mapped types对基础类型(number, string)是无效的，比如
```typescript
type Test<T> = {
    [k in keyof T]: T[k]
}

type result = Test<number>
// type result = number
```

5.00002-medium-return-type.ts， 注意infer关键字的应用。infer关键字是用于推断泛型中的子变量类型，你可以理解为在泛型中定义类型变量的能力
```typescript
type MyReturnType<T extends Function> = T extends (...args: any) => infer R ? R : never
```
上面代码中，如果要推断函数的返回类型，必须使用infer对R进行定义，否则会报错 


6.00003-medium-omit.ts， 这里涉及到一个知识点，两个联合类型A,B用extends进行比较的时候，如果相等，返回三元表达式的第一个结果，这个是预期中的，但是如果不相等，其结果是一个联合类型，这个联合类型由A中的每个元素依次与B中的每个元素extends计算后得出，比如：
```typescript
type CustomType<A, B> = A extends B ? 'a': 'b'
type r1 = CustomType<'1' | '2', '2' | '3'>
// type  r1 = "b" | "a"
type r2 = CustomType<'1' | '2', '1' | '2'>
// type  r2 = 'a'
```

8.00012-medium-chainable-options.ts，需要注意两个知识点，一个是递归的应用
```typescript
type Chainable<T extends {} = {}> = {
    option<K extends string, V>(key: Exclude<K, keyof T>, value: V): Chainable<Overwrite<T, Record<K, V>>>
    get():  T
  }
```
还有一个就是函数的generic，调用的时候是可以不传的
```typescript
type D = <T extends string>() => void

const d:D = () => {}
```
上面的代码在类型校验时不会报错

9.00015-medium-last.ts 在类型的计算表达式中，是可以对数组进行解构操作的
```typescript
type Last<T> = T extends [...infer _, infer L] ? L: never;
```
要追加一个容易忽略的知识点，typescript的类型中，具体的值其实也是一个类型，比如
```typescript
const a = 1;
// a的类型是1
const a:number = 1;
// a的类型是number
```
因此在类型的计算中，也可以拿具体的值参与类型推断，所以这道题还有一种乍看比较奇特的解法
```typescript
type Last<T extends any[]> = [any, ...T][T["length"]];
```
这里T['length']可以直接拿到数组的length属性，但是因为类型推断中无法使用加法运算，所以这里无法表达T[T['length'] - 1]，所以这里才有[any, ...T]的操作


11.00020-medium-promise-all.ts  这里也有两个知识点，第一个是readonly的应用
```typescript
declare function foo<T extends any[]>(param: readonly [any, ...T]): T
const r = foo([1,2,3])
// type r = [number, number]
const r2 = foo([1,2,3] as const)
// type r2 = [2,3]
```
上面的foo类型的函数，如果传入的不是一个readonly的入参，则提取结果是[number, number]，而经过const转义后，其提取类型就会变成[2, 3]，其实仔细想想就能明白为什么ts有这样的设计，因为常量类型不会变化，因此可以推断出更精准的结果，而想要表明函数入参是一个常量，就需要readonly关键字。同时这里也要明白，readonly后面必须跟数组或者tuple，也就是必须这么写
```typescript
// 即使T本身为数组，也必须使用spread
declare function foo<T extends any[]>(param: readonly [...T]): T
// 下面这种写法会报错
declare function foo<T extends any[]>(param: readonly T): T
```
第二个知识点，Awaited的应用，可以用Awaited来提取Promise<Foo>中Foo的类型

`12.00062-medium-type-lookup.ts` distribute特性，跟题6是一样的底层逻辑，泛型中联合类型的extends运算，是依次拿被联合的每个元素去extends，将判断结果再次联合，举例
```typescript
type A = 'a' | 'b' | 'c'

type B = 'a'

type Test<T, B> = T extends B ? T: never

type C = Test<A, B>
// C = 'a'
```

`13.00106-medium-trimleft.ts` 类型表达式中，是可以用模板字符串的！注意下面的写法
```typescript
type Space = ' ' | '\t' | '\n'

type TrimLeft<S extends string> = S extends `${Space}${infer R}` ? TrimLeft<R> : S
```

`14.00110-medium-capitalize.ts` 也是类型表达式中对字符串的处理问题。也有两个知识点，1：ts中有内置的UpperCase工具来处理字符串小写转大写;
字符串的处理，是一种懒匹配模式，跟正则一样
```typescript
type Test<S extends string> = S extends `${infer F}${infer Tail}` ? F: never
type r = Test<'abc'>
// type r = 'a'
```


`18.00191-medium-append-argument.ts` 核心是用infer提取函数类型的入参和返回类型，只是有个写法需要注意，关于多个函数入参的解构类型
```typescript
type AppendArgument<Fn extends (...args: any) => any, A> = Fn extends (
  ...arags: infer P
) => infer R
  ? (...args: [...P, A]) => R
  : never;
```

`19.00296-medium-permutation.ts` 该题涉及的知识点较多
```typescript
type Permutation<T, K = T> = [T] extends [never]
  ? []
  : T extends T
  ? [T, ...Permutation<Exclude<K, T>>]
  : never;
```
首先，需要用到递归，这个在之前其实已经处理过很多次了
然后，注意 `[T] extends [never]`的操作，之所以会这么处理，是因为在ts的类型表达式中，如果想判断一个类型是不是never，用 `T extends never`来处理, 当T为never时，会得到never，可以简单理解成ts的语言特性，因为extends会默认做distribute的操作
```typescript
type asssetNever<T> = T extends never ? true : false;

type a = asssetNever<never>;
// type a = never
```
再然后，注意 `T extends T`的操作，这里是利用ts的distribute特性
```typescript
type UnionTypeTest<T> = T extends T ? [T, 1, 2] : never;
type c = UnionTypeTest<1 | 2>;
// type c = [1, 1, 2] | [2, 1, 2]
```
extends前的T和extends后的T不是同一个东西，前面的T是`1|2`这个unionType，后面的T是被distributed之后的联合类型中的元素 
最后，再看`[T, ...Permutation<Exclude<K, T>>]`，这里数组的spread运算涉及了联合类型
```typescript
type c = UnionTypeTest<1 | 2>;
type d = [...c, 999];
// type d = [1, 1, 2, 999] | [2, 1, 2, 999]
```
也就是，一个联合类型，其中每个元素如果都是数组，是可以被spread的，而且其spread结果计算逻辑是拿联合的每个元素单独spread，再将spread结果进行联合

`20.00298-medium-length-of-string.ts` 知识点：字符串的length属性，只会返回number这个类型，而数组的length属性会具体返回数字
```typescript
type Test1<S extends any[]> = S['length'];
type Test2<S extends string> = S['length'];

type b = Test1<['a', 'b']>
// type b = 2
type c = Test2<'abc'>
// type c = number
```


`21.00459-medium-flatten.ts` 知识点：提取数组中的元素，可以用`[infer L, ...infer R]`来解构。不过这道题更多的是在考察递归处理问题的思路

`22.00527-medium-append-to-object.ts` 知识点: 在对象属性的类型表达中，`key in Foo`中，如果Foo是一个string，那么等同于将Foo作为对象的key
```typescript
type Test<T extends string> = {
    [key in T]: 1
}
type a = Test<'233'>
// type a = { 233: 1 }
```
其实这里也可以把T当做联合类型，只不过是被联合的元素只有一个

`23.00529-medium-absolute.ts` 数字的操作其实都应该往字符串操作的方向上思考


`25.00599-medium-merge.ts` 知识点：有一个在使用&运算符时比较容易犯错的地方，A & B的时候，如果A和B都有一个a属性，但是类型不同，那么在合并后的结果中，a的类型将会是never

`26.00612-medium-kebabcase.ts`  ts对于字符串操作有内置的类型表达式，Uncapitalize, Capitalize

`27.00645-medium-diff.ts` 知识点：注意keyof运算符后面跟 `|`或者`&`时不同的表现
```typescript
type a = {
  name: string;
  age: number;
};

type b = {
  name: string;
  address: string;
};

type c = keyof (a | b);
// type c = "name"
type d = keyof (a & b)
// type d = "name" | "age" | "address"
```
keyof 后面跟`|` 是取其属性字段交集，keyof 后面跟`&` 是取其属性字段并集


`28.00949-medium-anyof.ts`  
知识点：
1. T为数组时，`T[number]`代指数组中的任意元素，也包括T数组本身
```typescript
type T1<T extends any[]> = T[number] extends [] ? true: false // T[number] 也会代指本身
type a = T1<[[]]>
// type a = true
```
2. 当拿`T[number]`去做extends判断的时候，比如 `T[number] extends 1 ? true: false`，意思是T数组中所有的元素都得满足条件，才会返回true
```typescript
type T2<T extends any[]> = T[number] extends 1 ? true: false
type c1 = T2<[1,2]> // type c1 = false
type c2 = T2<[1,1]> // type c2 = true
```

`30.01097-medium-isunion.ts`  这道题核心是考察unionType的distribute特性，有`A extends B`，当A为unionType的时候，会将A中的每个元素提取出来分别与B进行extends，然后将其结果进行`|`之后返回。
因此，下面的答案
```typescript
type IsUnion<T, C = T> = (
  T extends T ? (C extends T ? true : false) : false
) extends true
  ? false
  : true;
```
其中`T extends T ? (C extends T ? true : false) : false` 针对unionType，必然会返结果既包含true也包含false，是一个boolean类型，而对于非unionType，则只会是true