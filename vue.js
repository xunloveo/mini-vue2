import Observer from './observer.js'
import Compiler from './compiler.js'

/**
 * vue的构造函数 接收各种配置的参数等等
 */
export default class Vue {
  /**
   *
   * @param {*} options 配置参数
   */
  constructor(options = {}) {
    this.$options = options
    this.$data = options.data
    this.$methods = options.methods

    this.initRootElement(options)
    // 利用Object.defineProperty将this.$data注入到this下
    this._proxyData(this.$data)

    // 实例化observer对象，监听数据变化
    new Observer(this.$data)

    // 实例化compiler对象，解析指令和模板表达式
    new Compiler(this)
  }

  /**
   * 获取根元素，并存储到vue实例，简单检查一下传入的el是否合规
   * @param {*} options
   */
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
}
