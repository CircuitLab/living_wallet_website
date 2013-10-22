//<!--
$.fn.carrousel = function(options){
 //Flickable Carrousel - jQuery Plugin
 //options {"isIndicator", "isPrevNext"}
 //Example at http://vosegus.org/blog/2013/01/flickable-carrousel.html
 //Copyright Azuma Toshimitsu
 //License MIT
 //http://www.opensource.org/licenses/mit-license.php

 var $rootObj = $(this);
 var $box     = $rootObj.find(".box");
 var $target  = $rootObj.find(".main .inner");
 var $prev    = undefined;
 var $next    = undefined;
 var unitW    = $box.width();
 var len      = $box.length;
 var maxW     = unitW*len;
 var current  = 0;
 var options  = (options) ? options : 0;
 var indiElm  = undefined;
 var navElm   = undefined;
 var BGPSupportsTouches = ("createTouch" in document);
 var vMoveEvent  = BGPSupportsTouches ? "touchmove" : "mousemove";
 var vDowmEvent  = BGPSupportsTouches ? "touchstart" : "mousedown";
 var vUpEvent    = BGPSupportsTouches ? "touchend" : "mouseup";
 var vOutEvent   = BGPSupportsTouches ? "touchleave" : "mouseout";

 function init(){
  addView();
  dragMove();
  $target.css({"width":maxW+"px"});
 }
 //インジケータ表示
 function addView(){
  if(options.isIndicator){
   var put = $rootObj.find(".indicator");
   var str = "";
   for(var i=0;i<len;i++){
    str += "<div";
    if(i==0){
     str += ' class="current"';
    }
    str += "></div>"
   }
   put.html(str);
   indiElm = $rootObj.find(".indicator div");
   indiElm.bind("click",function(){
    current = indiElm.index(this);
    sliderAnimation();
   });
  }
 //前後ナビ表示
  if(options.isPrevNext){
   var put = $rootObj.find(".nav");
   var str = '<a data-num="0" class="prev"><div class="prev hide"><img src="/img/slide/slide_thumb_prev.png"></div></a><a data-num="1" class="next"><div class="next show"><img src="/img/slide/slide_thumb_next.png"></div></a>';
   put.html(str);
   navElm = $rootObj.find(".nav a");
   $prev  = $rootObj.find(".nav .prev");
   $next  = $rootObj.find(".nav .next");
   navElm.bind("click",function(event){
    current = $(this).attr("data-num");
    sliderAnimation();
    if(current <= 0){
     $target.stop().stop().animate({
     "margin-left": (unitW*0.4)+"px"
     },{"duration":100,"complete":function(){
      $(this).animate({"margin-left": "0"},200);
     }
    });
   }
     if(current >= len-1){
      $target.stop().stop().animate({
      "margin-left": ((unitW*(len-1)+unitW*0.4)*-1)+"px"
     },{"duration":100,"complete":function(){
      $(this).animate({"margin-left": (unitW*current*-1)+"px"},200);
     }
    });
   }
    return false;
   });
  }
 };
 //アニメーション
 function sliderAnimation(){
  updatePrevNext();
  $target.stop().stop().animate({
   "margin-left": (unitW*current*-1)+"px"
  },300);
 };
 //Prev Next 更新
 function updatePrevNext(){
  var setPrev;
  var setNext;
  current = Number(current);
  if(navElm || indiElm){
   //最初
   if(current <= 0){
    current = 0;
    setPrev = 0;
    setNext = 1;
   }
   //最後
   else if(current >= len-1){
    current = len-1;
    setPrev = current - 1;
    setNext = current;
   }
   //通常
   else{
    setPrev = current - 1;
    setNext = current + 1;
   }
   $prev.attr("data-num",setPrev);
   $next.attr("data-num",setNext);
   if(indiElm){
    indiElm.removeClass("current");
    indiElm.eq(current).addClass("current");
   }
  }
 };
 //ドラッグで移動
 function dragMove(){
  //マウスダウンした位置と、マウスを離した位置の差を計算一定以上の差があれば次のコマへ
  //マウスムーブで動いた距離分左右に移動
  var start   = 0;
  var end     = 0;
  var revmaxW = (maxW * -1) + unitW;
  var isDrag  = false;

  $target.bind(vDowmEvent,function(event){
   isDrag = true;
   if(BGPSupportsTouches){
    start = event.originalEvent.touches[0].pageX;
   }else{
    start = event.offsetX;
   }
   return false;
  });

  $target.bind(vUpEvent,function(event){
   isDrag = false;
   var set = start - end;
   if(set > 10){
    current++;
    sliderAnimation();
   }
   else if(set < -10){
    current--;
    sliderAnimation();
   }else{
    sliderAnimation();
   }
   retMove();
   return false;
  });

  $target.bind(vMoveEvent,function(event){
   if(isDrag){
    var cur = Number($(this).css("margin-left").replace("px",""));
    if(BGPSupportsTouches){
     end = event.originalEvent.touches[0].pageX;
    }else{
     end = event.offsetX;
    }
    var set = start - end;
    if(set > 6)
    set = 6;
    if(set < -6)
    set = -6;
    $target.css({"margin-left":(cur - set)+"px"});
    return false;
   }
  });

  $target.bind(vOutEvent,function(event){
   isDrag = false;
   sliderAnimation();
   retMove();
   return false;
  });

  function retMove(){
   var cur = Number($target.css("margin-left").replace("px",""));
   if(cur > 0){
    $target.stop().stop().animate({
     "margin-left": "0"
    },300);
   }
   if(cur < revmaxW) {
    $target.stop().stop().animate({
     "margin-left": revmaxW+"px"
    },300);
   }
  };

 }
 init();
};

$("#carrousel").carrousel({
 "isIndicator":true,
 "isPrevNext":true
});
//-->