## vu2 面试题

### 1. 把你了解的 vue 响应式原理阐述一下

首先了解 vue 中的三个核心类：

- Observer: 给对象属性添加 getter、setter 用于依赖收集和派发更新
- Dep: 用于手机当前响应式对象的依赖关系，每个响应式都有一个 dep 实例
  dep.subs = watcher[]
  当数据发生变化的时候会通过 dep.notify()通知各个 watcher
- Watcher 观察者对象 有 render、computed、user watch

依赖关系：

- initState 对 computed 属性初始化时，会触发 computed Watcher 依赖手机
- initState 对监听属性初始化时，会触发 user Watcher 依赖手机
- render 函数触发 render Watcher 依赖收集

派发更新：

- 组件中对响应式数据进行修改触发 setter 调用 dep.notify()
  遍历所有的 subs 调用每一个 watcher 的 update 方法，更新视图

原理总结：

- 当创建完 vue 实例时，vue 遍历 data 里的属性，Object.defineProperty 为属性添加 getter、setter
  对数据进行劫持，getter 收集依赖，setter 派发更新

### 2. 计算属性原理

dep 实例上有一个 dirty 属性标记是否需要重新求值，当 computed 依赖的值改变后，就会通知订阅的 watcher 进行更新，对于 computed watcher 会将 dirty 属性设置为 true,并且进行计算属性方法的调用

### vue2 的简版，实现响应式更新

1. 文件结构

- index.html 主页面
- vue.js vue 主文件
- compiler.js 编译模板，解析指令 如 v-model v-html
- dep.js 收集依赖关系，存储观察者
- observer.js 数据劫持
- watcher.js 观察者对象类

2. 在 vue.js 文件中对传入的 el 进行简易判断

```js
 initRootElement(options) {
    if (typeof options.el === 'string') {
      this.$el = document.querySelector(options.el)
    } else if (options.el instanceof HTMLElement) {
      this.$el = options.el
    }

    if (!this.$el) {
      throw new Error('传入的el不合法，请传入selector或者htmlElement')
    }
  }
```

3. vue 里可以通过 this 来获取 data 里的属性

```js
/**
   * 利用Object.defineProperty将this.$data下数据注入到this下
   * @param {*} data
   */
  _proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (data[key] === newValue) return
          data[key] = newValue
        },
      })
    })
  }
```

4. 先声明核心类，后续在具体实现

- dep.js

```js
export default class Dep {
  constructor() {
    // 存储所有的观察者
    this.subs = []
  }

  /**
   * 添加观察者
   * @param {*} watcher
   */
  addSub(watcher) {}

  /**
   * 发送通知
   */
  notify() {}
}
```

- observer.js

```js
export default class Observer {
  constructor(data) {
    this.traverse(data)
  }

  /**
   * 递归遍历data
   * @param {*} data
   */
  traverse(data) {}

  /**
   * 给传入的数据设置 getter/setter
   * @param {*} obj
   * @param {*} key
   * @param {*} val
   */
  defineReactive(obj, key, val) {}
}
```

- watcher.js

```js
export default class Watcher {
  constructor(vm, key, cb) {}

  /**
   * 数据变化的时候 更新视图
   */
  update() {}
}
```

- compiler.js

```js
export default class Compiler {
  constructor(vm) {
    this.compiler(vm.$el)
  }

  /**
   * 编译模板
   * @param {*} el
   */
  compiler(el) {}
}
```
