## 重点关注
3.00011-easy-tuple-to-object.ts, 可以用T[number]来获取数组中元素类型集合
比如
```typescript
const arr = [1,'2'];
type X = (typeof arr)[number]
// type X = string | number
```