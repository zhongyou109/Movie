// pages/films/films.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:wx.getSystemInfoSync().windowHeight,
    topFilms:[],
    wrapH:0,
    movieH:0,
    scrollTop:0,
    comings:[],
    switchHotLeft:0,//switch_hot距离屏幕左边距离
    redHot:46,
    data_active:'.n-hot',
    num:1,
    hasmore:0
  },
  hotClick(e){
    const query = wx.createSelectorQuery()
    query.select('#'+e.target.id).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec((res)=>{
      if(res[0] !==null && res[0].id !="switch_hot"){
        const bid = res[0].dataset.bid;
        if(bid=='.n-hot') this.setData({data_active:bid,num:1});
        else if(bid=='.cinema') this.setData({data_active:bid,num:2});
        else if(bid=='.f-hot') this.setData({data_active:bid,num:3});
        else if(bid=='.classic') this.setData({data_active:bid,num:4});
      }     
    })
  },
  movieScroll(e){ 
    console.log(e);
    var that=this;
    var wrapH = this.data.wrapH;
    var movieH = this.data.movieH;
    const query = wx.createSelectorQuery();
      query.select('#list-wrap').boundingClientRect();
      query.exec(function(res){
        console.log(res);
      })
    if(wrapH==0){
      const query = wx.createSelectorQuery();
      query.select('#page-wrap').boundingClientRect();
      query.exec(function(res){
        that.setData({wrapH:res[0].height});
      })
    }
    if(movieH==0){
      const query2 = wx.createSelectorQuery();
      query2.select('#movie').boundingClientRect()
      query2.exec(function(res){
        console.log(res)
        that.setData({movieH:res[0].height});
      })
    }
    var scrollTop = e.detail.scrollTop;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var cutStr = getApp().cutStr;
      var that=this;
      wx.request({
        url: 'https://m.maoyan.com/#movie',
        success (res) {
          //最受好评电影列表
          var arr = [];
          var topFilms = [];
          var str = res.data;
          cutStr(str,'top-rated-item','</a>',arr,1);
          if(arr.length!=0){
            for(var i=0;i<arr.length;i++){
              var temp=[];
              cutStr(arr[i],'<img src=','  onerror',temp,0);
              cutStr(arr[i],'rated-score">','<',temp,0);
              cutStr(arr[i],'line-ellipsis">','<',temp,0);
              if(temp.length>2){
                topFilms.push({img:temp[0],score:temp[1],name:temp[2]});
              }
              else{
                cutStr(arr[i],'wish-num">','<',temp,0);
                topFilms.push({img:temp[0],wish_num:temp[2],name:temp[1]});
              }
            }
          }  
          that.setData({topFilms:topFilms}); 
          //热映电影列表
          arr=[];//清空截取的数据
          cutStr(str,'list-wrap" data-movie-ids="','"',arr,0);
          arr = arr[0].split(',');
          var arrlen = arr.length;
          //可以拉取的页数
          var page = arrlen%10;
          var url = 'https://m.maoyan.com/ajax/moreComingList?token=&movieIds='+arr.slice(0,10).join(',')+'&optimus_uuid=DFF0AD00D61911EAAE44F3F3884AD3612FD767F755BC426A99BE95A02BFB91E7&optimus_risk_level=71&optimus_code=10';
          wx.request({
            url: url,
            success (res) {
              var comings = res.data.coming;
              //json返回的图片做处理
              for(var i=0;i<comings.length;i++){
                var temp = [];
                cutStr(comings[i].img,'/w.h/','.',temp,0);
                comings[i].img = 'https://p0.meituan.net/'+
                temp[0]+'.jpg@1l_1e_1c_128w_180h';
              }
              that.setData({comings:comings});
            }
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取switch_hot距离屏幕左边距离
    const switchHotLeft = this.data.switchHotLeft;
    if(switchHotLeft==0){
      const query = wx.createSelectorQuery();
      query.select('#switch_hot').boundingClientRect();
      query.exec((res)=>{
        this.setData({switchHotLeft:res[0].left});
      });
    }

  },
  onPageScroll:function(e){
    console.log(123);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
console.log(111111);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(123);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})