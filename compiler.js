import Watcher from './watcher.js'
export default class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.methods = vm.$methods
    this.compiler(vm.$el)
  }

  /**
   * 编译模板
   * @param {*} el
   */
  compiler(el) {
    const childNodes = el.childNodes
    ;[...childNodes].forEach(node => {
      if (this.isTextNode(node)) {
        // 文本节点
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        // 元素节点
        this.compileElement(node)
      }
      if (node.childNodes && node.childNodes.length > 0) {
        // 有子节点，递归调用
        this.compiler(node)
      }
    })
  }

  /**
   * 编译文本节点
   * @param {*} node
   */
  compileText(node) {
    // {{ msg }} 这种形式
    const reg = /\{\{(.+?)\}\}/
    const value = node.textContent

    if (reg.test(value)) {
      const key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])

      console.log('n', node)

      new Watcher(this.vm, key, newValue => {
        console.log('n1', node)
        node.textContent = newValue
      })
    }
  }

  /**
   * 编译元素节点
   * @param {*} node
   */
  compileElement(node) {
    if (node.attributes.length) {
      ;[...node.attributes].forEach(attr => {
        // 遍历元素节点的所有属性 (v-model, v-html, v-on:click)
        const attrName = attr.name
        if (this.isDirective(attrName)) {
          // 判断是啥指令
          let directiveName =
            attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2)
          let key = attr.value
          this.update(node, key, directiveName)
        }
      })
    }
  }

  /**
   * 更新元素
   * @param {*} node
   * @param {*} key
   * @param {*} directiveName
   */
  update(node, key, directiveName) {
    const updateFn = this[directiveName + 'Updater']
    updateFn && updateFn.call(this, node, this.vm[key], key, directiveName)
  }

  // 解析v-text
  textUpdater(node, value, key) {
    node.textContent = value
    console.log('node-text')
    new Watcher(this.vm, key, newValue => {
      console.log('node-text1')
      node.textContent = newValue
    })
  }

  // 解析v-model
  modelUpdater(node, value, key) {
    console.log('node-model', node)
    node.value = value
    new Watcher(this.vm, key, newValue => {
      node.value = newValue
    })

    node.addEventListener('input', () => {
      this.vm[key] = node.value
      console.log(22, this.vm)
    })
  }

  // 解析v-html
  htmlUpdater(node, value, key) {
    node.innerHTML = value
    new Watcher(this.vm, key, newValue => {
      node.innerHTML = newValue
    })
  }

  // 解析v-on
  clickUpdater(node, value, key, directiveName) {
    node.addEventListener(directiveName, this.methods[key])
  }

  /**
   * 是否是文本节点
   * @param {*} node
   * @returns
   */
  isTextNode(node) {
    return node.nodeType === 3
  }

  /**
   * 是否是元素节点
   * @param {*} node
   * @returns
   */
  isElementNode(node) {
    return node.nodeType === 1
  }

  /**
   * 是否是指令
   * @param {*} attrName
   */
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
}
