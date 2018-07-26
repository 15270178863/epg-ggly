import {Epg, G} from './keycode.js';

var scrollScreen = {
    init: function(option) {
        this.config.enable = true;
        for(var i in option) {
            if(option[i] !== undefined && option[i] !== '') {
                this.config[i] = option[i];
            }            
        }
        this.scroll(Epg.getParamInt('scrollTop', 0));
    },
    check: function(button, dir) {
        if(!this.config.enable) return;
        if(button.restoreScroll) {
            this.scroll(-this.config.scrollTop);
            return;
        }
        if(!this.config.enableToAllBtn && !button.scrollScreen) return;
        var id = button.id;
        var position = document.getElementById(id).getBoundingClientRect();
        var target = document.getElementById(this.config.wrapperId);
        var safePx = this.config.safePx;
        var wrapperPosition = document.getElementById(this.config.wrapperId).getBoundingClientRect();
        if(position.bottom >= (wrapperPosition.bottom - safePx)) {
            this.scroll((position.bottom + safePx - wrapperPosition.bottom));
        }else if(position.top - wrapperPosition.top < safePx) {
            this.scroll((wrapperPosition.top - position.top + safePx) * -1);
        }
    },
    repair: function(button) {
        if(!this.config.enable || !button.scrollScreen || !button.restoreScroll) return;
        var target = document.getElementById(this.config.wrapperId);
        if(this.config.scrollTop !== target.scrollTop) {
            target.scrollTop = this.config.scrollTop;
        }
    },
    scroll: function(addScrollTop) {
        var target = document.getElementById(this.config.wrapperId);
        this.config.scrollTop += addScrollTop;
        target.scrollTop = this.config.scrollTop;
    },
    config: {
        animate: true, // 必须此值与全局的CONFG.ANIMATE都为true时才会有动画
        enable: false, // 全局参数，这个为false时所有代码失效
        enableToAllBtn: false, // 是否针对页面所有按钮开启滚屏检测，也就是说光标落到任何按钮上都会检测一下是否需要滚屏
        wrapperId: 'wrapper', // 最外一层容器
        scrollTop: 0, // 记录滚动的距离
        safePx: 40, // 安全像素，即距离屏幕边缘最大距离
        topSafePx: 40 // 上滚top安全像素
    }
};

function scroll(option) {    
    this.init = function(option) {
        this.config.enable = true;
        for(var i in option) {
            if(option[i] !== undefined && option[i] !== '') {
                this.config[i] = option[i];
            }
        }
        this.scr(Epg.getParamInt('scrollLeft', 0));
        var children = Array.from(document.querySelector('.'+this.config.wrapperId).children);
        var width = document.querySelector('.'+this.config.wrapperId).offsetLeft + this.config.safePx;
        for(var i = 0, len = children.length; i < len; i++) {
            width += children[i].offsetWidth + parseInt(window.getComputedStyle(children[i])['marginRight'].slice(0, -2));
        }
        this.config.width = width;
    }
    this.check = function(button, dir) {
        if(!this.config.enable) return;
        if(button.restoreScroll) {
            this.scr(-this.config.scrollLeft);
            return;
        }
        if(!this.config.enableToAllBtn && !button.scrollScreen) return;
        var id = button.id;
        var position = document.getElementById(id).getBoundingClientRect();
        var wrapperPosition = document.getElementById(this.config.wrapperId).getBoundingClientRect();
        var safePx = this.config.safePx;
        console.log('--- ' + this.config.wrapperId);
        if((position.left + position.width / 2) != (wrapperPosition.width / 2 + wrapperPosition.left)) {
            if((position.left + position.width / 2) > (wrapperPosition.width / 2 + wrapperPosition.left)) {
                if(((wrapperPosition.width / 2) + position.left + position.width / 2 + this.config.scrollLeft) > this.config.width) {
                    this.config.scrollLeft = this.config.width - wrapperPosition.width;
                }else {
                    this.config.scrollLeft += position.left + position.width / 2 - (wrapperPosition.width / 2 + wrapperPosition.left);
                }
            }else if((position.left + position.width / 2) < (wrapperPosition.width / 2 + wrapperPosition.left)) {
                if((wrapperPosition.width / 2 + wrapperPosition.left - position.left - position.width / 2) > this.config.scrollLeft) {
                    this.config.scrollLeft = 0
                }else {
                    this.config.scrollLeft += position.left + position.width / 2 - (wrapperPosition.width / 2 + wrapperPosition.left);
                }
            }
            var target = document.getElementById(this.config.wrapperId);
            target.scrollLeft = this.config.scrollLeft;
        }
    }
    this.repair = function(button) {
        if(!this.config.enable || !button.scrollScreen || !button.restoreScroll) return;
        var target = document.getElementById(this.config.wrapperId);
        if(this.config.scrollLeft !== target.scrollLeft) {
            target.scrollLeft = this.config.scrollLeft;
        }
    }
    this.scr = function(addScrollLeft) {
        var target = document.getElementById(this.config.wrapperId);
        this.config.scrollLeft += addScrollLeft;
        target.scrollLeft = this.config.scrollLeft;
    }
    this.config = {
        animate: true,		// 此值与全局的CONFIG.ANIMATE都为true时才会有动画			
        enable: false,		// 全局参数，这个为false时所有代码失效
        enableToAllBtn: false,//是否针对页面所有按钮开启滚屏检测，也就是光标落到任何按钮上都会检测一下是否需要滚屏
        wrapperId: 'wrapper',// 最外层容器
        scrollLeft: 0,		// 记录滚动距离
        safePx: 40			// 安全像素，即距离屏幕边缘最大距离		
    }
    this.init(option);
}

// var scroll = {
//     init: function(option) {
//         this.config.enable = true;
//         for(var i in option) {
//             if(option[i] !== undefined && option[i] !== '') {
//                 this.config[i] = option[i];
//             }
//         }
//         this.scr(Epg.getParamInt('scrollLeft', 0));
//         var children = Array.from(document.querySelector('.'+this.config.wrapperId).children);
//         var width = document.querySelector('.'+this.config.wrapperId).offsetLeft + this.config.safePx;
//         for(var i = 0, len = children.length; i < len; i++) {
//             width += children[i].offsetWidth + parseInt(window.getComputedStyle(children[i])['marginRight'].slice(0, -2));
//         }
//         this.config.width = width;
//         console.log(this.config.width);
//     },
//     check: function(button, dir) {
//         if(!this.config.enable) return;
//         if(button.restoreScroll) {
//             this.scr(-this.config.scrollLeft);
//             return;
//         }
//         if(!this.config.enableToAllBtn && !button.scrollScreen) return;
//         var id = button.id;
//         var position = document.getElementById(id).getBoundingClientRect();
//         var wrapperPosition = document.getElementById(this.config.wrapperId).getBoundingClientRect();
//         var safePx = this.config.safePx;
//         // if(position.right >= (wrapperPosition.right - safePx)) {
//         //     this.scr((position.right + safePx - wrapperPosition.right));			
//         // }else if(position.left - wrapperPosition.left < safePx) {
//         //     this.scr((wrapperPosition.left - position.left + safePx) * -1);
//         // }

//         if((position.left + position.width / 2) != 640) {
//             if((position.left + position.width / 2) > 640) {
//                 if((640 + position.left + position.width / 2 + this.config.scrollLeft) > this.config.width) {
//                     this.config.scrollLeft = this.config.width - 1280;
//                 }else {
//                     this.config.scrollLeft += position.left + position.width / 2 - 640;
//                 }
//             }else if((position.left + position.width / 2) < 640) {
//                 if((640 - position.left - position.width / 2) > this.config.scrollLeft) {
//                     this.config.scrollLeft = 0
//                 }else {
//                     this.config.scrollLeft += position.left + position.width / 2 - 640;
//                 }
//             }
//             var target = document.getElementById(this.config.wrapperId);
//             target.scrollLeft = this.config.scrollLeft;
//         }
//     },
//     repair: function(button) {
//         if(!this.config.enable || !button.scrollScreen || !button.restoreScroll) return;
//         var target = document.getElementById(this.config.wrapperId);
//         if(this.config.scrollLeft !== target.scrollLeft) {
//             target.scrollLeft = this.config.scrollLeft;
//         }
//     },
//     scr: function(addScrollLeft) {
//         var target = document.getElementById(this.config.wrapperId);
//         this.config.scrollLeft += addScrollLeft;
//         target.scrollLeft = this.config.scrollLeft;
//     },
//     config: {
//         animate: true,		// 此值与全局的CONFIG.ANIMATE都为true时才会有动画			
//         enable: false,		// 全局参数，这个为false时所有代码失效
//         enableToAllBtn: false,//是否针对页面所有按钮开启滚屏检测，也就是光标落到任何按钮上都会检测一下是否需要滚屏
//         wrapperId: 'wrapper',// 最外层容器
//         scrollLeft: 0,		// 记录滚动距离
//         safePx: 40			// 安全像素，即距离屏幕边缘最大距离		
//     }
// }

export {scrollScreen, scroll};

