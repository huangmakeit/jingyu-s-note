// pages/NoteContent/NoteContent.js
import { showToast } from '../../utils/util'
import { HTTP_STATUS } from '../../contant/index'
const DB = wx.cloud.database().collection('Note')
Page({
  data: {
    content: '',
    time: '',
    title: '',
    id: '',
    type: '',
    imgId: [],
    showModal: false,
    currentPreviewImg: ''
  },
  onLoad: async function (options) {
    const { id } = options
    const { data } = await DB.doc(id).get()
    console.log('note', data)
    const { content, title, time, type, img_id: imgId } = data
    this.setData({
      content: decodeURIComponent(content).replace(/\<img/g, '<img style="width:100%;height:auto;display:block"'),
      time,
      title,
      id,
      type,
      imgId
    })
  },
  RemoveNote ({ currentTarget: { dataset: { id: removeId, imgid: removeImg } } }) {
    console.log(removeId, removeImg)
    DB.doc(removeId).remove({
      success (res) {
        showToast(HTTP_STATUS.SUCCESS, '删除笔记成功！')
        removeImg.length && wx.cloud.deleteFile({
          fileList: removeImg
        })
        wx.redirectTo({
          url: '/pages/NoteList/NoteList'
        })
      },
      fail (res) {
        showToast(HTTP_STATUS.ERROR, '删除笔记失败！')
      }
    })
  },
  handlePreview ({ currentTarget: { dataset: { imgid } } }) {
    wx.previewImage({
      urls: this.data.imgId,
      current: imgid,
      fail (error) {
        showToast(HTTP_STATUS.ERROR, error.errMsg)
      }
    })
  },
  editNote ({ currentTarget: { dataset: { id } } }) {
    wx.navigateTo({
      url: `/pages/Note/Note?id=${id}`
    })
  }
})
