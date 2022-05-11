// pages/Note/Note.js
import {
  formatTime,
  showToast
} from '../../utils/util'

import {
  HTTP_STATUS,
  MOON
} from '../../contant/index.js'
const app = getApp() // 获取应用实例

const DB = wx.cloud.database().collection('Note')

Page({
  data: {
    Time: '',
    formats: {},
    placeholder: '开始输入...',
    MOON,
    imageList: [],
    isLoading: false,
    title: '',
    type: '',
    id: ''
  },
  formValid (title, type) {
    if (!title || !type) {
      showToast(HTTP_STATUS.ERROR, '必须填标题噢')
      return false
    }
    return true
  },
  NoteSubmit (e) {
    try {
      const that = this
      console.log('e', e)
      const title = this.data.title
      const type = this.data.type
      this.editorCtx.getContents({
        success (res) {
          const content = res.text
          const dataIsValid = that.formValid(title, type)
          if (!dataIsValid && !that.data.id) {
            return
          }
          const noteData = {
            title,
            time: that.data.Time,
            type,
            content,
            img_id: that.data.imageList
          }
          const DBConfig = {
            data: noteData,
            success (res) {
              showToast(HTTP_STATUS.SUCCESS, '鲸鱼创建笔记成功！')
              wx.redirectTo({
                url: '/pages/mine/mine'
              })
            },
            fail (res) {
              console.log(res.errMsg)
              showToast(HTTP_STATUS.ERROR, '创建笔记失败！')
            }
          }
          if (that.data.id) {
            console.log(123)
            DB.doc(that.data.id).update(DBConfig)
          } else {
            DB.add(DBConfig)
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  },
  onShareAppMessage () {
    return {
      title: 'editor',
      path: 'page/component/pages/editor/editor'
    }
  },
  async onLoad (options) {
    const { id } = options
    this.canUse = true
    if (id) {
      const { data: [db] } = await DB.where({ _id: id }).get()
      console.log('note', db)
      this.setData({
        title: db.title,
        type: db.type,
        imageList: db.img_id,
        Time: db.time,
        id: db._id
      })
      this.editorCtx.insertText({
        text: db.content
      })
    } else {
      this.updateTime()
      const timer = setInterval(() => {
        this.updateTime()
      }, 1000)
      return () => clearInterval(timer)
    }
  },

  updateTime () {
    const Time = formatTime(new Date())
    this.setData({
      Time
    })
  },

  onEditorReady () {
    const that = this
    wx.createSelectorQuery().select('#editor')
      .context(function (res) {
        that.editorCtx = res.context
      })
      .exec()
  },

  undo () {
    this.editorCtx.undo()
  },
  redo () {
    this.editorCtx.redo()
  },
  format (e) {
    if (!this.canUse) {
      return
    }
    const {
      name,
      value
    } = e.target.dataset
    if (!name) {
      return
    }
    // console.log('format', name, value)
    this.editorCtx.format(name, value)
  },

  onStatusChange (e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },
  insertDivider () {
    this.editorCtx.insertDivider({
      success () {
        console.log('insert divider success')
      }
    })
  },
  clear () {
    this.editorCtx.clear({
      success () {
        showToast(HTTP_STATUS.SUCCESS, '清除成功！')
      }
    })
  },
  removeFormat () {
    this.editorCtx.removeFormat()
  },
  insertDate () {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },

  // 点击图片将图片插入富文本编辑器里面
  insertImage () {
    if (this.data.imageList.length >= 3) {
      showToast(HTTP_STATUS.ERROR, '图片应少于3个')
      return
    }

    const that = this
    wx.chooseImage({
      success: (chooseResult) => {
        that.setData({
          isLoading: true
        })
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: (new Date()).getTime() + Math.floor(9 * Math.random()) + '.jpg',
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          // 成功回调
          success: (res) => {
            const imgUrl = res.fileID
            that.setData({
              imageList: [...that.data.imageList, imgUrl]
            })
          },
          fail: (err) => {
            showToast(HTTP_STATUS.ERROR, '图片上传失败！')
          }
        })
      }
    })
  },
  imageLoaded () {
    this.setData({
      isLoading: false
    })
    showToast(HTTP_STATUS.SUCCESS, '图片上传成功！')
  },
  deleteImg ({currentTarget: {dataset: {index}}}) {
    this.data.imageList.splice(index, 1)
    this.setData({imageList: [...this.data.imageList]})
  },
  addTitle ({ detail: { value } }) {
    this.setData({
      title: value
    })
  },
  handleMoon ({ detail: { value } }) {
    this.setData({
      type: value
    })
  }

})