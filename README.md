# ts 类型体操

https://github.com/type-challenges/type-challenges

## 重点关注

3.00011-easy-tuple-to-object.ts, 可以用 T[number]来获取数组中元素类型集合
比如

```typescript
const arr = [1, "2"];
type X = (typeof arr)[number];
// type X = string | number
```

4.00009-medium-deep-readonly.ts，递归调用

```typescript
type DeepReadonly<T> = T extends Function
  ? T
  : {
      readonly [P in keyof T]: DeepReadonly<T[P]>;
    };
```

还有一点需要注意的是，Mapped types 对基础类型(number, string)是无效的，比如

```typescript
type Test<T> = {
  [k in keyof T]: T[k];
};

type result = Test<number>;
// type result = number
```

5.00002-medium-return-type.ts， 注意 infer 关键字的应用。infer 关键字是用于推断泛型中的子变量类型，你可以理解为在泛型中定义类型变量的能力

```typescript
type MyReturnType<T extends Function> = T extends (...args: any) => infer R
  ? R
  : never;
```

上面代码中，如果要推断函数的返回类型，必须使用 infer 对 R 进行定义，否则会报错

6.00003-medium-omit.ts， 这里涉及到一个知识点，两个联合类型 A,B 用 extends 进行比较的时候，如果相等，返回三元表达式的第一个结果，这个是预期中的，但是如果不相等，其结果是一个联合类型，这个联合类型由 A 中的每个元素依次与 B 中的每个元素 extends 计算后得出，比如：

```typescript
type CustomType<A, B> = A extends B ? "a" : "b";
type r1 = CustomType<"1" | "2", "2" | "3">;
// type  r1 = "b" | "a"
type r2 = CustomType<"1" | "2", "1" | "2">;
// type  r2 = 'a'
```

8.00012-medium-chainable-options.ts，需要注意两个知识点，一个是递归的应用

```typescript
type Chainable<T extends {} = {}> = {
  option<K extends string, V>(
    key: Exclude<K, keyof T>,
    value: V
  ): Chainable<Overwrite<T, Record<K, V>>>;
  get(): T;
};
```

还有一个就是函数的 generic，调用的时候是可以不传的

```typescript
type D = <T extends string>() => void;

const d: D = () => {};
```

上面的代码在类型校验时不会报错

9.00015-medium-last.ts 在类型的计算表达式中，是可以对数组进行解构操作的

```typescript
type Last<T> = T extends [...infer _, infer L] ? L : never;
```

要追加一个容易忽略的知识点，typescript 的类型中，具体的值其实也是一个类型，比如

```typescript
const a = 1;
// a的类型是1
const a: number = 1;
// a的类型是number
```

因此在类型的计算中，也可以拿具体的值参与类型推断，所以这道题还有一种乍看比较奇特的解法

```typescript
type Last<T extends any[]> = [any, ...T][T["length"]];
```

这里 T['length']可以直接拿到数组的 length 属性，但是因为类型推断中无法使用加法运算，所以这里无法表达 T[T['length'] - 1]，所以这里才有[any, ...T]的操作

11.00020-medium-promise-all.ts 这里也有两个知识点，第一个是 readonly 的应用

```typescript
declare function foo<T extends any[]>(param: readonly [any, ...T]): T;
const r = foo([1, 2, 3]);
// type r = [number, number]
const r2 = foo([1, 2, 3] as const);
// type r2 = [2,3]
```

上面的 foo 类型的函数，如果传入的不是一个 readonly 的入参，则提取结果是[number, number]，而经过 const 转义后，其提取类型就会变成[2, 3]，其实仔细想想就能明白为什么 ts 有这样的设计，因为常量类型不会变化，因此可以推断出更精准的结果，而想要表明函数入参是一个常量，就需要 readonly 关键字。同时这里也要明白，readonly 后面必须跟数组或者 tuple，也就是必须这么写

```typescript
// 即使T本身为数组，也必须使用spread
declare function foo<T extends any[]>(param: readonly [...T]): T;
// 下面这种写法会报错
declare function foo<T extends any[]>(param: readonly T): T;
```

第二个知识点，Awaited 的应用，可以用 Awaited 来提取 Promise<Foo>中 Foo 的类型

`12.00062-medium-type-lookup.ts` distribute 特性，跟题 6 是一样的底层逻辑，泛型中联合类型的 extends 运算，是依次拿被联合的每个元素去 extends，将判断结果再次联合，举例

```typescript
type A = "a" | "b" | "c";

type B = "a";

type Test<T, B> = T extends B ? T : never;

type C = Test<A, B>;
// C = 'a'
```

`13.00106-medium-trimleft.ts` 类型表达式中，是可以用模板字符串的！注意下面的写法

```typescript
type Space = " " | "\t" | "\n";

type TrimLeft<S extends string> = S extends `${Space}${infer R}`
  ? TrimLeft<R>
  : S;
```

`14.00110-medium-capitalize.ts` 也是类型表达式中对字符串的处理问题。也有两个知识点，1：ts 中有内置的 UpperCase 工具来处理字符串小写转大写;
字符串的处理，是一种懒匹配模式，跟正则一样

```typescript
type Test<S extends string> = S extends `${infer F}${infer Tail}` ? F : never;
type r = Test<"abc">;
// type r = 'a'
```

`18.00191-medium-append-argument.ts` 核心是用 infer 提取函数类型的入参和返回类型，只是有个写法需要注意，关于多个函数入参的解构类型

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
然后，注意 `[T] extends [never]`的操作，之所以会这么处理，是因为在 ts 的类型表达式中，如果想判断一个类型是不是 never，用 `T extends never`来处理, 当 T 为 never 时，会得到 never，可以简单理解成 ts 的语言特性，因为 extends 会默认做 distribute 的操作

```typescript
type asssetNever<T> = T extends never ? true : false;

type a = asssetNever<never>;
// type a = never
```

再然后，注意 `T extends T`的操作，这里是利用 ts 的 distribute 特性

```typescript
type UnionTypeTest<T> = T extends T ? [T, 1, 2] : never;
type c = UnionTypeTest<1 | 2>;
// type c = [1, 1, 2] | [2, 1, 2]
```

extends 前的 T 和 extends 后的 T 不是同一个东西，前面的 T 是`1|2`这个 unionType，后面的 T 是被 distributed 之后的联合类型中的元素
最后，再看`[T, ...Permutation<Exclude<K, T>>]`，这里数组的 spread 运算涉及了联合类型

```typescript
type c = UnionTypeTest<1 | 2>;
type d = [...c, 999];
// type d = [1, 1, 2, 999] | [2, 1, 2, 999]
```

也就是，一个联合类型，其中每个元素如果都是数组，是可以被 spread 的，而且其 spread 结果计算逻辑是拿联合的每个元素单独 spread，再将 spread 结果进行联合

`20.00298-medium-length-of-string.ts` 知识点：字符串的 length 属性，只会返回 number 这个类型，而数组的 length 属性会具体返回数字

```typescript
type Test1<S extends any[]> = S["length"];
type Test2<S extends string> = S["length"];

type b = Test1<["a", "b"]>;
// type b = 2
type c = Test2<"abc">;
// type c = number
```

`21.00459-medium-flatten.ts` 知识点：提取数组中的元素，可以用`[infer L, ...infer R]`来解构。不过这道题更多的是在考察递归处理问题的思路

`22.00527-medium-append-to-object.ts` 知识点: 在对象属性的类型表达中，`key in Foo`中，如果 Foo 是一个 string，那么等同于将 Foo 作为对象的 key

```typescript
type Test<T extends string> = {
  [key in T]: 1;
};
type a = Test<"233">;
// type a = { 233: 1 }
```

其实这里也可以把 T 当做联合类型，只不过是被联合的元素只有一个

`23.00529-medium-absolute.ts` 数字的操作其实都应该往字符串操作的方向上思考

`25.00599-medium-merge.ts` 知识点：有一个在使用&运算符时比较容易犯错的地方，A & B 的时候，如果 A 和 B 都有一个 a 属性，但是类型不同，那么在合并后的结果中，a 的类型将会是 never

`26.00612-medium-kebabcase.ts` ts 对于字符串操作有内置的类型表达式，Uncapitalize, Capitalize

`27.00645-medium-diff.ts` 知识点：注意 keyof 运算符后面跟 `|`或者`&`时不同的表现

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
type d = keyof (a & b);
// type d = "name" | "age" | "address"
```

keyof 后面跟`|` 是取其属性字段交集，keyof 后面跟`&` 是取其属性字段并集

`28.00949-medium-anyof.ts`  
知识点：

1. T 为数组时，`T[number]`代指数组中的任意元素，也包括 T 数组本身

```typescript
type T1<T extends any[]> = T[number] extends [] ? true : false; // T[number] 也会代指本身
type a = T1<[[]]>;
// type a = true
```

2. 当拿`T[number]`去做 extends 判断的时候，比如 `T[number] extends 1 ? true: false`，意思是 T 数组中所有的元素都得满足条件，才会返回 true

```typescript
type T2<T extends any[]> = T[number] extends 1 ? true : false;
type c1 = T2<[1, 2]>; // type c1 = false
type c2 = T2<[1, 1]>; // type c2 = true
```

`30.01097-medium-isunion.ts` 这道题核心是考察 unionType 的 distribute 特性，有`A extends B`，当 A 为 unionType 的时候，会将 A 中的每个元素提取出来分别与 B 进行 extends，然后将其结果进行`|`之后返回。
因此，下面的答案

```typescript
type IsUnion<T, C = T> = (
  T extends T ? (C extends T ? true : false) : false
) extends true
  ? false
  : true;
```

其中`T extends T ? (C extends T ? true : false) : false` 针对 unionType，必然会返结果既包含 true 也包含 false，是一个 boolean 类型，而对于非 unionType，则只会是 true

`31.01130-medium-replacekeys.ts` 知识点：自动 distribute，如下

```typescript
type Test2<T1> = {
  [P in keyof T1]: T1[P];
};

type b = Test2<{ a: 1 } | { b: 2 }>;
// type b = Test2<{
//     a: 1;
// }> | Test2<{
//     b: 2;
// }>
```

当类型函数直接返回一个对象时，传入的入参如果是一个 unionType，会发生自动 distribute，不需要写`T1 extends any`来手动 distribute

`32.01367-medium-remove-index-signature.ts`
知识点：
1.Key Remapping ，可用于属性过滤，用法

```typescript
type Test<T> = {
  [P in keyof T as P extends "a" ? P : never]: T[P];
};

type a = Test<{
  a: 1;
  b: 2;
}>;
```

上面用于将除了 a 属性外的所有属性都过滤掉

2. 名词 Index Signature，指的是非具体的属性名

```typescript
type a = {
  [key: string]: string;
  foo(): void;
};
```

其中这个 key: string 就是指的 index signature

`36.02688-medium-startswith.ts` 知识点：在字符串操作中，如果只关心某部分字符串，不关心的部分可以直接声明为 string

```typescript
type StartsWith<T extends string, U extends string> = T extends `${U}${string}`
  ? true
  : false;
```

比如上面的例子，我们只关心前缀部分，剩余的字符串部分直接声明为 string 即可

`38.02757-medium-partialbykeys.ts` 知识点：将联合类型转变成一个对象

```typescript
// 如果我们有两个类型A和B
type A = {
  a: string;
};
type B = {
  b: number;
};

// 正常情况下联合后会得到一个联合类型
type C = A & B;

// 虽然一般我们认为 A & B 这个联合类型同 { a: string, b: number } 没有什么区别，但是在类型系统中他们是不同的
// 如果我们想将其转化成一个完整的key value类型，可以用Omit never的形式
type C = Omit<A & B, never>;
// type C = {
//     a: string;
//     b: number;
// }
```

`39.02759-medium-requiredbykeys.ts` 知识点：index signature 中声明 required，可以使用`-?`符号

```typescript
type A = { name?: string };

// 如果想将a中的name属性变更为required
type MyRequired<T> = {
  [P in keyof T]-?: T[P];
};
```

`40.02793-medium-mutable.ts` 知识点：如果想让只读属性变成 mutable 的，可以在属性前加`-`

```typescript
type Mutable<T extends object> = {
  -readonly [P in keyof T]: T[P];
};
```

`42.02946-medium-objectentries.ts`
知识点：

- 1.将对象的值转换成联合类型，可以通过`T[keyof T]`的方式进行实现

```typescript
type ObjectToUnion<T> = T[keyof T];
type a = ObjectToUnion<{ a: number; b: string }>;
// type a = string | number
```

- 2.`Partial`会给属性的值新增 undefined 的类型，`Required`会在属性值仅为 undefined 的时候将其转换成 never

```typescript
type a = Partial<{ key: number }>;
// type a = {
//     key?: number | undefined;
// }

type b = Required<{ key?: undefined }>;
// type b = {
//     key: never;
// }
```

`43.03188-medium-tuple-to-nested-object`
知识点：

- 1.如果想实现 Test<'a', number> = { 'a': number }，可以直接用`in`关键字

```typescript
type Test<K extends string, V> = {
  [P in K]: V;
};
```

- 2.如果某些情况下，无法限定 K 为 string，可以直接用`&`来表示`K extends tring ? K: never`

```typescript
type Test<K, V> = {
  [P in K & string]: V;
};
```

`49.04179-medium-flip`
知识点：
在定义Object的key的类型时，可以使用`as`关键字追加运算
比如，这道题是要交换object的key，value，我们在使用 `key in keyof T`取到key的类型后，可以用as再次追加`T[key]`取到T的值
因此才有答案
```typescript
type Flip<T extends Record<string, number | string | boolean>> = {
  [K in keyof T as `${T[K]}`]: K;
};
```
