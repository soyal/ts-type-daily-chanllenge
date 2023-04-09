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