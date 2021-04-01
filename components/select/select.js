Component({
  properties:{
    optionsData:{
      type: Array
    },
    start:{
      type: String
    }
  },
  data:{
    // start: "小业主",
    isstart: false,
    choiceItem: 0,
    openimg: '../../images/icon/arrow.png',
    offimg:'../../images/icon/arrow-up.png'
  },
  methods: {
    opens: function(e){
      switch (e.currentTarget.dataset.item){
        case "1":
          if (this.data.isstart){
            this.setData({
              isstart: false
            })
          }
          else{
            this.setData({
              isstart:true
            })
          }
          break;
      }
    },
    onclicks1:function(e){
      var index = e.currentTarget.dataset.index;
      this.setData({
        choiceItem: index
      })
      let name = this.properties.optionsData[index].name;
      this.setData({
        isstart:false,
        isfinish:false,
        isdates:false,
        start: this.properties.optionsData[index].name,
        finish:"目的地"
      })
    }
  },
  
})