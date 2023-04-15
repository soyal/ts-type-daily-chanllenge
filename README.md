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