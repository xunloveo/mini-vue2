/**
 * 发布订阅模式
 * 存储所有观察者
 * 每个观察者都有一个update方法
 */
export default class Dep {
  constructor() {
    // 存储所有的观察者
    this.subs = []
  }

  /**
   * 添加观察者
   * @param {*} watcher
   */
  addSub(watcher) {
    if (watcher && watcher.update) {
      this.subs.push(watcher)
    }
  }

  /**
   * 发送通知
   */
  notify() {
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}
