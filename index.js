import Vue from './vue.js'

const vm = new Vue({
  el: '#app',
  data: {
    msg: 'hello mini-vue2',
    testHtml: '<ul><li>哈哈哈</li></ul>',
    count: '100',
  },
  methods: {
    handler() {
      alert(111)
    },
  },
})

console.log(vm)
