/**
 * @file: 判断某个dom是否进入了可视区
 *  
 * 使用示例：
 *     <div v-in-screen="screenInfo"></div>
 *
 *     screenInfo支持的选项： {
 *       inHandler :  handler ,
 *       outHandler : out handler ,
 *       once :  是否 once , ( in / out )
 *     }
 */


import _ from 'lodash';

const ctx = '@@i71IsInScreen'; 
const confList = [];

window.addEventListener('scroll', _.debounce(() => {
    confList.forEach(doCheck);
}, 100));




function isInScreen(elem) {
    const rect = elem.getBoundingClientRect();
    const clientHeight = (window.innerHeight || document.documentElement.clientHeight);
    const clientWidth = (window.innerWidth || document.documentElement.clientWidth);
    return (
        rect.top <= (clientHeight ) // 不在可视区下边
        &&
        rect.left <= clientWidth // 不在可视区右边
        &&
        rect.bottom >= (0 ) // 不在可视区上边
        &&
        rect.right >= 0 // 不在可视区左边
    );
};

function  removeConf( conf ){
  let index =  confList.indexOf( conf);
  confList.splice(index ,1);
}


function doCheck( conf ) { 
    let {modifiers , el , inHandler ,outHandler ,  hasCallIn ,hasCallOut  } = conf ;
    if ( isInScreen(conf.el)  ) {   
        if(conf.modifiers.once  ){
          if( conf.isIn == false && !conf.hasCallIn){ 
            conf.hasCallIn = true;
            conf.isIn = true ;
            inHandler && inHandler(); 
          }
        } else if( conf.isIn == false ){
          conf.hasCallIn = true ;
          conf.isIn = true ;
          inHandler && inHandler(); 
        } 
    } else { 
        // conf.modifiers.once , 只处罚一次 inHandler ;
        if(conf.modifiers.once){
          if( conf.isIn == true  && !conf.hasCallOut){ 
            conf.hasCallOut = true;
            conf.isIn = false ;
            outHandler && outHandler(); 
          } 
        } else  if( conf.isIn == true ){
            conf.hasCallOut = true;
            conf.isIn = false ;
            outHandler && outHandler(); 
        }
    } 
    if( modifiers.once && hasCallIn && hasCallOut ){
      removeConf(conf )
    }

}

export default {
    inserted(el, binding, vnode) {
        el[ctx] = {
            el ,  
            isIn: false ,
            hasCallIn: false ,
            hasCallOut: false , 
            inHandler: binding.value.inHandler ,
            modifiers: binding.modifiers 

        };
        confList.push(el[ctx]);
        doCheck(el[ctx]);
    }
}