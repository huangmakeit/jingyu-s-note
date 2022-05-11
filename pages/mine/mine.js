// pages/mine/mine.js
let app = getApp()
Page({
  data: {

  },
  onLoad (options) {
  },
  ToNotePage () {
    wx.navigateTo({
      url: '/pages/Note/Note'
    })
  },
  ToNoteList () {
    wx.navigateTo({
      url: '/pages/NoteList/NoteList'
    })
  }

})
