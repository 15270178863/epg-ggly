import {Epg, G} from './keycode.js';

var mp;
var PCMP = {
    init(defaultTip) {
        var type = defaultTip === false ? 'audio' : 'video';
        if(!mp) {
            mp = document.createElement(type);
            mp.controls = false;
            mp.autoplay = true;
            document.body.insertBefore(mp, document.body.firstElementChild);            
        }
    },
    fullscreenPlay(url) {
        if(arguments.length === 2) {
            url = arguments[1];
        }
        this.smallvodPlay(url, 0, 0, 1280, 720);
    },
    smallvodPlay(url, left, top, width, height) {
        mp.style.marginLeft = left + 'px';
        mp.style.marginTop = top + 'px';
        mp.style.width = width + 'px';
        mp.style.height = height + 'px';
        mp.src = url;
    },
    /** 暂停 */
	pause: function(callback) {
		this.speed = 1;
		this.state = 'pause';
		//try一下的目的是为了电脑上不报错
		try{mp.pause();}catch(e){}
		Epg.call(callback, [this]);
	},
	
	/** 从暂停、快进、快退中恢复 */
	resume: function(callback) {
		this.speed = 1;
		this.state = 'play';
		//try一下的目的是为了电脑上不报错
		try{mp.resume();}catch(e){}
		Epg.call(callback, [this]);
	},
	
	/** 播放或暂停 */
	playOrPause: function(callback) {
		if(this.state=='play')
			this.pause();
		else
			this.resume();
		Epg.call(callback, [this.state, this]);
	},
    /** 定点播放 */
    playByTime: function(second) {
        mp.currentTime = second;
    },
    
    //获取当前播放时间，以前没有的方法
    getCurrentPlayTime: function() {
        if(mp) return Math.round(mp.currentTime || 0);
        else return 0;
    },
    
    //获取总时长，以前没有的方法
    getMediaDuration: function() {
        if(mp) return Math.round(mp.duration || 0);//还没加载时此值为NaN
        else return 0;
    },
    
    //获取当前声道
    getCurrentAudioChannel: function() {
        this.currentChannel = this.currentChannel || 'Stereo';
        return this.currentChannel;
    },
    
    /** 切换声道 */
    switchAudioChannel: function(callback) {
        this.currentChannel = this.getCurrentAudioChannel() === 'Stereo' ? 'Left' : 'Stereo';
        Epg.call(callback, [this.getCurrentAudioChannel(), this]);
    },
    //销毁播放器
    destroy: function() {
        if(mp) mp.pause();//暂停可能会有一些问题，暂时不管了，反正不是正式代码
    }
}

export default PCMP;