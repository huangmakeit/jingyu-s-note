// pages/component/PreviewModal.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      value: '1',
      type: String
    }
  },
  lifetimes: {
    attached () {
      console.log('src', this.properties.src)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    closePreview () {

    }
  }
})
