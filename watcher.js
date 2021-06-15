import Dep from './dep.js'

export default class Watcher {
  /**
   *
   * @param {*} vm vue实例
   * @param {*} key data中的属性名
   * @param {*} cb 负责更新视图的回调函数
   */
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb

    // 同一时间只维持一个watcher
    Dep.target = this

    // 触发get方法，在get方法里会去做一些操作
    this.oldValue = vm[key]

    Dep.target = null
  }

  /**
   * 数据变化的时候 更新视图
   */
  update() {
    let newValue = this.vm[this.key]
    console.log(newValue, this.oldValue)
    if (this.oldValue === newValue) return
    this.cb(newValue)
  }
}
