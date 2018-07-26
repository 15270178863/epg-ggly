export var KEY_BACK 		 = 0x0008;  // 返回/删除
export var KEY_ENTER 		 = 0x000D;  // 确定
export var KEY_PAGE_UP 	 = 0x0021;  // 上页
export var KEY_PAGE_DOWN	 = 0x0022;  // 下页
export var KEY_LEFT		 = 0x0025;  // 左
export var KEY_UP			 = 0x0026;  // 上
export var KEY_RIGHT 		 = 0x0027;  // 右
export var KEY_DOWN 		 = 0x0028;  // 下
export var KEY_0 			 = 0x0030;  // 0
export var KEY_1 			 = 0x0031;  // 1
export var KEY_2 			 = 0x0032;  // 2
export var KEY_3 			 = 0x0033;  // 3
export var KEY_4 			 = 0x0034;  // 4
export var KEY_5			 = 0x0035;  // 5
export var KEY_6 			 = 0x0036;  // 6 
export var KEY_7 			 = 0x0037;  // 7
export var KEY_8 			 = 0x0038;  // 8
export var KEY_9 			 = 0x0039;  // 9
export var KEY_VOL_UP		 = 0x0103;  // Vol+，音量加
export var KEY_VOL_DOWN 	 = 0x0104;  // Vol-，音量减
export var KEY_MUTE 		 = 0x0105;  // Mute，静音
export var KEY_TRACK 		 = 0x0106;  // Audio Track，切换音轨
export var KEY_PLAY_PAUSE   = 0x0107;  // >||，播放，暂停
export var KEY_FAST_FORWARD = 0x0108;  // >> ，快进
export var KEY_FAST_REWIND  = 0x0109;  // << ，快退
export var KEY_IPTV_EVENT   = 0x0300;  // 虚拟事件按键
export var KEY_RED 		 = 0x0113;  // 红色键
export var KEY_GREEN		 = 0x0114;  // 绿色键
export var KEY_YELLOW		 = 0x0115;  // 黄色键
export var KEY_BLUE		 = 0x0116;  // 蓝色键
export var KEY_DELETE		 = 0x0118;  // 删除键(中兴盒子)

export var EVENT_MEDIA_END  = 'EVENT_MEDIA_END';  //视频播放结束
export var EVENT_MEDIA_ERROR= 'EVENT_MEDIA_ERROR';  //视频播放错误
export var EVENT_MENU		 = 'EVENT_MENU'; //OTT的菜单虚拟键
export var EVENT_HOME		 = 'EVENT_HOME'; //OTT的主页虚拟键


/**
 * 根据ID获取某个元素
 * @param id
 * @returns
 */
export function G(id){return document.getElementById(id);}

/**
 * 显示一个元素
 * @param id
 */
export function S(id) {
	var temp = G(id);
	if(temp) temp.style.visibility = 'visible';
}
/**
 * 隐藏一个元素
 * @param id
 */
export function H(id) {
	var temp = G(id);
	if(temp) temp.style.visibility = 'hidden';
}

export var Epg = {
    call: function(fn, args) {
        if(typeof fn === 'string' && fn) {
            return eval('('+fn+')');
        }else if(typeof fn === 'function') {
            if(!(args instanceof Array)) {
				//注意，这里千万不要直接：args=[];然后对args操作，因为arguments存放的是args的引用，否则args会无限循环
				var temp = [];
				for(var i=1; i<arguments.length; i++) temp.push(arguments[i]);
				args = temp;
			}
			return fn.apply(null, args);
        }        
	},
	getParam: function(name, defaultValue) {
		defaultValue = defaultValue === undefined ? '' : defaultValue;
		var result = new RegExp('(\\?|&)'+name+'=(.*?)(&|$)', 'g').exec(location.search);
		return result ? result[2] : defaultValue;
	},
	getParamInt: function(name, defaultValue) {
		defaultValue = defaultValue === undefined ? 0 : defaultValue;
		return parseInt(Epg.getParam(name, defaultValue));
	}
};