const {
  JudgeUserAnswer,
  GetWrongSet,
  SetWrongSet,
  RefreshWrongSet
} = require("../../utils/answerhandler")
const {
  GetEvedayLog, RefreshEverydayLog, ChangeEverydayLog
} = require("../../utils/everydayquetion")
const {
  AddTestHistory
} = require("../../utils/testhandler")
const {
  AddRainbowCoin
} = require("../../utils/userinfo")
// pages/question/question.js
const {
  GetQuestion,
  GetOrderedWrongQuestion,
  GenerateQuestionByMode,
  FinshQuestion
} = require("../../utils/questions")

const appInstance = getApp()
const correctAudio = wx.createInnerAudioContext()
correctAudio.autoplay = false
correctAudio.src = "/static/correct.mp3"
correctAudio.volume = 0.6

const wrongAudio = wx.createInnerAudioContext()
wrongAudio.autoplay = false
wrongAudio.src = "/static/wrong.mp3"
wrongAudio.volume = 0.6

Page({
  /*页面的初始数据*/
  data: {
    second: 100,
    oneButton: [{
      text: '确认'
    }],
    question: {
      question_type: 0,
      expression: ' ',
      result: 0
    },
    questiontype: -1,
    questionNum: 50,
    finished: 49,
    result: '?',
    isAccomplishTest: false,
    isTimeOver: false,
    timer1: NaN,
    timer2: NaN
  },
  /* 用户处理函数 */
  clickKeyBoard: function (e) {
    if (this.data.result.length < 4) {
      this.setData({
        result: this.data.result === '?' ? e.currentTarget.id : this.data.result + e.currentTarget.id
      })
    }
  },
  deleteChar: function () {
    if (this.data.result.length === 1) {
      this.setData({
        result: '?'
      })
    } else {
      let str = this.data.result
      this.setData({
        result: str.slice(0, str.length - 1)
      })
    }
  },
  submit: function () {
    if (this.data.result === '?') {
      wx.showToast({
        icon: 'none',
        title: '请输入答案'
      })
      return
    }
    let result = parseInt(this.data.result)
    if (JudgeUserAnswer(this.data.question, result)) {
      appInstance.globalData.correctNum++
      correctAudio.play()
      wx.showToast({
        icon: 'none',
        title: '回答正确',
        duration: 500
      })
      FinshQuestion(this.data.questiontype, appInstance.globalData.exeMode)
    } else {
      appInstance.globalData.wrongNum++
      wrongAudio.play()
      wx.showToast({
        icon: 'none',
        title: '回答错误',
        duration: 500
      })
      FinshQuestion(this.data.questiontype, appInstance.globalData.exeMode)
    }
    let finished = this.data.questionNum - this.data.finished
    if (finished != 0) {
      if (appInstance.globalData.exeMode === 0) {
        let practicequestion = GetQuestion(appInstance.globalData.typeMode)
        console.log(practicequestion)
        this.setData({
          question: practicequestion.question,
          questiontype: practicequestion.type,
          finished: this.data.finished + 1,
          result: '?'
        })
      } else if (appInstance.globalData.exeMode === 1) {
        this.setData({
          question: GenerateQuestionByMode(appInstance.globalData.typeModeForTest),
          finished: this.data.finished + 1,
          result: '?'
        })
      } else {
        let wrongSet = GetWrongSet()
        wrongSet[this.data.finished - 1].reviewTimes++
        RefreshWrongSet()
        console.log(wrongSet)
        SetWrongSet(wrongSet)
        this.setData({
          question: wrongSet[this.data.finished].question,
          finished: this.data.finished + 1,
          result: '?'
        })
      }
    } else {
      /* 完成测试，做完所有题目,显示对话框 */
      this.setData({
        isAccomplishTest: true
      })
      let coins = 1
      if (appInstance.globalData.exeMode === 1) {
        coins = 5
      } else if (appInstance.globalData.exeMode === 2) {
        let wrongSet = GetWrongSet()
        wrongSet[this.data.finished - 1].reviewTimes++
        RefreshWrongSet()
        SetWrongSet(wrongSet)
        coins = 0
      }
      console.log(coins)
      for (; coins > 0; coins--) {
        AddRainbowCoin()
      }
      if (appInstance.globalData.exeMode === 1) {
        AddTestHistory(appInstance.globalData.correctNum * 2)
      }
    }
  },
  quitTest: function () {
    this.setData({
      isAccomplishTest: true
    })
    if (appInstance.globalData.exeMode === 1) {
      console.log("exeMode")
      AddTestHistory(appInstance.globalData.correctNum * 2)
    }
  },

  /* 前往结果页面 */
  tapDialogButton: function () {
    console.log("leave que Page")
    if (this.data.timer1 !== NaN) {
      clearTimeout(this.data.timer1)
    }
    if (this.data.timer2 !== NaN) {
      clearTimeout(this.data.timer2)
    }
    wx.navigateTo({
      url: '/pages/result/result',
    })
    /* 需要完成定向到结果页面的 */
  },
  /* 倒计时 当超时时，显示对话框*/
  countdown: function (that) {
    let second = that.data.second
    if (second === 0) {
      that.setData({
        isTimeOver: true
      })
      if (appInstance.globalData.exeMode === 1) {
        AddTestHistory(appInstance.globalData.correctNum * 2)
      }
      return
    }
    this.setData({
      timer2: setTimeout(function () {
        console.log("timing ing")
        that.setData({
          second: second - 1
        })
        that.countdown(that)
      }, 1000)
    })
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {
    appInstance.globalData.bgmAudio.stop()
    appInstance.globalData.wrongNum = 0
    appInstance.globalData.correctNum = 0
    if (appInstance.globalData.exeMode === 0) {
      let practicequestion = GetQuestion(appInstance.globalData.typeMode)
      this.setData({
        question: practicequestion.question,
        questiontype: practicequestion.type,
        questionNum: GetEvedayLog().needQuestions + GetEvedayLog().needWrongAnswers,
        finished: 1,
        result: '?',
        second: '--'
      })
    } else if (appInstance.globalData.exeMode === 1) {
      this.setData({
        question: GenerateQuestionByMode(appInstance.globalData.typeModeForTest),
        questionNum: 50,
        finished: 1,
        result: '?',
        second: 500
      })
    } else {
      this.setData({
        question: GetOrderedWrongQuestion(0).question,
        questionNum: GetWrongSet().length,
        finished: 1,
        result: '?',
        second: '--'
      })
    }

    if (appInstance.globalData.exeMode === 1) {
      this.countdown(this)
    }
  },
  onUnload: function(){
    RefreshWrongSet()
    let everydayLog = GetEvedayLog()
    ChangeEverydayLog(everydayLog.needQuestions, Math.min(everydayLog.needWrongAnswers,GetWrongSet().length),new Date().getDate())
    console.log(GetWrongSet())
    console.log(GetEvedayLog())
  }
})