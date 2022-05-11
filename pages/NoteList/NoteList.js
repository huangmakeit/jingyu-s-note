import { showToast } from '../../utils/util'
import { HTTP_STATUS } from '../../contant/index'
const DB = wx.cloud.database().collection('Note')

const prePage = 10

Page({
  data: {
    note: [],
    page: 0,
    hasMore: true
  },
  // onload查询数据
  onLoad () {
    this.getData()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    wx.reLaunch({
      url: '/pages/NoteList/NoteList'
    })
  },

  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    this.getData()
  },

  // 跳转笔记详情页面
  noteContent ({ currentTarget: { dataset: { id } } }) {
    wx.navigateTo({
      url: `/pages/NoteContent/NoteContent?id=${id}`
    })
  },
  // 查询数据
  getData () {
    if (!this.data.hasMore) {return}
    const that = this
    wx.showLoading({
      title: '刷新中！'
    })
    DB.orderBy('time', 'desc').limit(prePage)
      .skip(prePage * this.data.page)
      .get({
        success (res) {
          that.setData({
            note: [...that.data.note, ...res.data],
            page: that.data.page + 1,
            hasMore: res.data.length >= prePage
          })
          wx.hideLoading()
        },
        fail (res) {
          showToast(HTTP_STATUS.ERROR, '读数据失败')
          console.log('读数据失败', res)
        }
      })
  }
})