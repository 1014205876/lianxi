/*
 * @Author: Thunderball.Wu 
 * @Date: 2017-09-27 16:12:38 
 * @Last Modified by: Thunderball.Wu
 * @Last Modified time: 2017-10-19 14:04:17
 * https://github.com/bobiscool/wxDraw/blob/master/wxDraw/src/animation/animationFrame.js?1528457213384
 * 帧动画控制器
 */

//todo cancelRequestAnimationFrame 
// cancel setTimeOut
export const AnimationFrame = function(){
    if(typeof requestAnimationFrame!=='undefined'){
       return requestAnimationFrame;
    }else{
        return fakeAnimationFrame;
    }
    
}

function fakeAnimationFrame(callback){
    var start,
        finish;
    setTimeout(function(){
      start = +new Date();
      callback(start);
      finish = +new Date();

    //   //console.log(finish - start);
    
    },16);
}
