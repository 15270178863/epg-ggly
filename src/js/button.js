import {
    KEY_ENTER,
    KEY_LEFT,
    KEY_RIGHT,
    KEY_UP,
    KEY_DOWN,
    KEY_BACK,
    KEY_5,
    G,
    Epg
} from './keycode.js';

import {scrollScreen, scroll} from './scroll.js';

Epg.hasClass = function(obj, cls) {
    if(!obj) return;
    return obj.className.match(new RegExp('(\\s|^)' +cls+ '(\\s|$)'));
};
Epg.addClass = function(obj, cls) {
    if(!obj) return;
    var className = obj.className;
    if(!this.hasClass(obj, cls)) obj.className += (className? ' ' : '') + cls;
}
Epg.removeClass = function(obj, cls) {
    if(obj && this.hasClass(obj, cls)) {
        obj.className = obj.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'), function(m, $1, $2) {
            return ($1 && $2) ? ' ' : '';
        })
    }
}

var key = {
    keys: {
        KEY_5: function() {}
    },
    ids: {},
    set: function(code, action) {        
        if(typeof code === 'string' || action !== undefined) {
            var _code = code;
            code = {};
            code[_code] = action;
        }
        if(typeof code === 'object') {
            var obj = code;
            for(var i in obj) {
                if(i.indexOf('KEY_') === 0 || i.indexOf('EVENT_') === 0) {
                    this.keys[i] = obj[i];
                }else {
                    this.ids[i] = obj[i];
                }
            }
        }
        return this;        
    },
    add: function(code, action) {
        return this.set(code, action);
    },
    del: function(code) {
        if(!(code instanceof Array)) {
            code = [code];
        }
        for(var i = 0; i < code.length; i++) {
            if(this.ids[code[i]]) {
                this.ids[code[i]] = 'key.emptyFn()';
            }
            if(this.keys[code[i]]) {
                this.keys[code[i]] = 'key.emptyFn()';
            }
            return this;
        }
    },
    emptyFn: function(){},
    init: function() {
        Epg.eventHandler = function(code) {
            for(var i in key.ids) {
                if(parseInt(code) === parseInt(i)) {
                    //Epg.call(key.ids[i], code);
                    key.ids[i]();
                }
            }
            for(var i in key.keys) {
                if(parseInt(code) === parseInt(i)) {
                    //Epg.call(key.keys[i], code);
                    key.keys[i]();
                }
            }
        }
    }
}

var btn = {
    _buttonStore: {},
    config: {
        defaultButtonId: '', // 默认按钮
		buttons: [], // 按钮数组对象
		imagePath: '', // 默认图片路径
		initKeys: true, // 是否初始化默认6个按键的事件
		eager: false, // 是否提前加载光标图
    },
    init: function(defaultButtonId, buttons, imagePath, initKeys, eager) {        
        var config = defaultButtonId;
        if(arguments.length > 2) {
            config = {
                defaultButtonId: defaultButtonId,
                buttons: buttons,
                imagePath: imagePath,
                initKeys: initKeys,
                eager: eager,                
            };
        }
        for(var i in config) this.config[i] = config[i];
        config = this.config;

        if(config.initKeys) {            
            key.init();
            key.set(KEY_ENTER, this.click.bind(this));
            key.set(KEY_LEFT, this.move.bind(this, 'left'));
            key.set(KEY_RIGHT, this.move.bind(this, 'right'));
            key.set(KEY_UP, this.move.bind(this, 'up'));
            key.set(KEY_DOWN, this.move.bind(this, 'down'));            
        }
        this.previous = null;
        this._buttonStore = {};
        for(var i =0; i < config.buttons.length; i++) {
            var button = config.buttons[i];
            var _button = G(button.id); // DOM 对象
			
			// 主要是为了适配IE7莫名其妙的问题
			if(!button) continue;
			
			// 自动添加样式前缀，add 20160324
			button.focusClass = (button.focusClass && !/^btn_focus_.*$/g.test(button.focusClass) ? 'btn_focus_' : '') + button.focusClass;
			
			// 如果没有设置默认按钮，直接把图片的src用作按钮，要求必须写在window.onload里面，否则部分盒子获取不到src
			if(!button.linkImage && _button) button.linkImage = _button.src;

			//如果(配置了imagePath && 当前按钮配置了焦点图片 && 当前按钮没有配置autoPrefix=false && 焦点图片不是http开头)
			if(config.imagePath && button.focusImage && button.autoPrefix!==false && button.focusImage.indexOf('http')<0)
				button.focusImage = config.imagePath + button.focusImage;
			
			if(config.imagePath && button.linkImage && button.autoPrefix!==false && button.linkImage.indexOf('http')<0)
                button.linkImage = config.imagePath + button.linkImage;
            
            this._buttonStore[button.id] = button;
        }
        if(typeof config.defaultButtonId === 'string') {
            this.current = this.get(config.defaultButtonId);
        }else if(config.defaultButtonId instanceof Array) {
            for(var i = 0, max = config.defaultButtonId.length; i < max; i++) {
                var button = this.get(config.defaultButtonId[i]);
                if(button) {
                    this.current = button;
                    break;
                }
            }
        }
        this.update();

        var event_handler = function(e) {
            var keyCode = e.which || e.keyCode;
            if(keyCode === KEY_BACK) e.preventDefault();
            Epg.eventHandler(keyCode);
        }
        if(/webkit/g.test(navigator.userAgent.toLowerCase())) {
            document.onkeydown = event_handler;
        }else {
            document.onkeypress = event_handler;
        }
    },
    move: function(dir) {
        if(this.current.beforeMove && Epg.call(this.current.beforeMove, [dir, this.current]) === false) {
            return;
        }
        var button;
        var nextButtonId = this.current[dir];
        if(typeof nextButtonId === 'string') nextButtonId = [nextButtonId];
        if(nextButtonId instanceof Array) {
            for(var i = 0; i < nextButtonId.length; i++) {
                button = this.get(nextButtonId[i]);
                if(button) break;
            }
            this.previous = this.current;
            if(button) {
                this.current = button;

                if(button.scrollDir === 'x') {
                    this.current.scroll.repair.call(this.current.scroll, button);
                    this.update();
                    this.current.scroll.check.call(this.current.scroll, button, dir);
                }else {
                    scrollScreen.repair(button);
                    this.update();
                    scrollScreen.check(button, dir);
                }
                //this.update();
            }
        }
        Epg.call(this.current.moveHandler, [this.previous, this.current, dir]);
    },
    get: function(id) {
        if(id === undefined) id = this.current.id;
        if(G(id)) {
            var btn = this._buttonStore[id];
            if(btn && btn.disable !== true) return this._buttonStore[id];
        }
    },
    set: function(buttonId) {
        var btn = this.get(buttonId);
        if(!btn) return;
        this.previous = this.current;
        this.current = btn;
        this.update();
    },
    click: function(interceptor, btnId) {
        if(btnId && btnId !== this.current.id) this.set(btnId);
        if(interceptor) Epg.call(interceptor, [this.current]);
        Epg.call(this.current.action, [this.current]);
    },
    update: function() {
        var prev = this.previous;
        var current = this.current;
        if(prev && G(prev.id)) {
            var _prev = G(prev.id);
            if(prev.focusClass) Epg.removeClass(_prev, prev.focusClass);
            if(prev.linkImage) _prev.src = linkImage;
            Epg.call(prev.blurHandler, [prev]);
        }
        if(current) {
            var _current = G(current.id);
            if(current.focusClass) Epg.addClass(_current, current.focusClass);
            if(current.focusImage) _current.src = current.focusImage;
            Epg.call(current.focusHandler, [current]);
        }
    }
}

export {key, btn};
