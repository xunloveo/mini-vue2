import Dep from './dep.js'

export default class Observer {
  constructor(data) {
    this.traverse(data)
  }

  /**
   * 递归遍历data
   * @param {*} data
   */
  traverse(data) {
    if (!data || typeof data !== 'object') {
      return
    }

    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  /**
   * 给传入的数据设置 getter/setter
   * @param {*} obj
   * @param {*} key
   * @param {*} val
   */
  defineReactive(obj, key, val) {
    this.traverse(val)

    const that = this

    const dep = new Dep()

    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set(newValue) {
        if (newValue === val) return
        console.log('d', dep)
        val = newValue
        that.traverse(newValue) // 设置的时候可能设置了一个对象所以需要执行这个
        // 通知
        dep.notify()
      },
    })
  }
}
