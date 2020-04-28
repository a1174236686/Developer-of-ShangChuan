
const computedBehavior = require('miniprogram-computed')

Component({
  behaviors: [computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    disabled: { type: Boolean, value: false },
    score: { type: Number,value: 1.7},
    onColor: {type: String,value: '#FFCE0C'},
    offColor: {type: String,value: 'rgb(198, 209, 222)'},
    size: {type: String,value: '27rpx'},
    count: {type: Number,value: 5},
    changeCallBack: {type: Function,value: () => null },
    flag:null
  },

  computed: {
    scoreInteger: function (data) {
      const { score } = data;
      const int = Math.ceil(score);
      return int
    },
    scoreDecimal: function (data) {
      let { score } = data;
      score += "";
      const index = score.indexOf(".");
      if (index === -1) return 0;
      else {
        return score.substring(index + 1, index + 2)
      };
    },
    starsArr: function (data) {
      const { count } = data;
      const starsArr = [];
      for (let i = 0; i < count; i++) {
        starsArr.push(i)
      }
      return starsArr;
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    scoreChange: function (e) {
      const { disabled,changeCallBack,flag } = this.data;
      if (disabled) return;
      changeCallBack({flag,e});
    },
  }
})
