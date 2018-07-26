import {Epg, G} from './keycode.js';

var positions = {};

function getBtn(cid, dir) {
    var current = positions[cid];
    var store = []; // 存放符合条件的临时按钮：{id,distance,deg}
    var leftOrRight = (dir === 'left' || dir === 'right');
    var hasFindDegIsZero = false; // 标记是否已经找到了deg为0的按钮
    for(var i in positions) {
        if(i === cid) continue; // 如果是自己，直接忽略
        var next = positions[i]; //下一个需要判断的目标按钮
        if( (dir === 'left' && next.left >= current.left)
            || (dir === 'right' && next.right <= current.right)
            || (dir === 'up' && next.top >= current.top)
            || (dir === 'down' && next.bottom <= current.bottom) )
            continue; // 不在一个方向的按钮统统过滤
        if( leftOrRight && 
            ( (next.centerY >= current.top && next.centerY <= current.bottom) // 目标按钮的Y中点在当前按钮的top和bottom之间
            || (next.top <= current.centerY && next.bottom >= current.bottom) // 目标按钮的top在当前按钮的中线之上，bottom在当前按钮的bottom之下
            || (next.top <= current.top && next.bottom >= current.centerY) ) // 目标按钮的top在当前按钮的top之上，bottom在当前按钮的中线之下
        ){
           store.push({id: i, distance: next.left, deg: 0}); // 把大致处于同一水平线的按钮的角度deg看成0
           hasFindDegIsZero = true;
       }
       else if( !leftOrRight && 
                ( (next.centerX >= current.left && next.centerX <= current.right) 
               || (next.left <= current.centerX && next.right >= current.right)
               || (next.left <= current.left && next.right >= current.centerX) ) 
        ){
           store.push({id: i, distance: next.top, deg: 0});
           hasFindDegIsZero = true;
       }
       // 否则，计算剩下所有按钮与当前按钮的中点角度
       // 为了减少多余的计算，如果已经找到了deg为0的按钮就不需要再计算角度了
       else if(!hasFindDegIsZero) {
           var key1 = leftOrRight ? dir : 'centerX';
           var key2 = !leftOrRight ? (dir == 'up' ? 'top' : 'bottom') : 'centerY';
           var tan = (next[key1] - current[key1]) / (next[key2] - current[key2]);
           // 策略修改，原先是计算2个按钮的中点之间的角度，现在改成跟方向有关
           // 比如如果dir==down，那么计算2个按钮bottom的中点的角度，这样可以大大减少很多不需要的结果
           // var tan = (next.centerX - current.centerX) / (next.centerY - current.centerY);
           var cdeg = Math.abs(Math.atan(leftOrRight ? (1 / tan) : tan) * 360 / 2 / Math.PI);
           store.push({id: i, distance: next[leftOrRight?'left':'top'], deg: cdeg});
       }
    }
    var tidu = [0, 30, 45, 60, 85]; // 预设几个搜索梯度
    var _store = [];
    // 按梯度分别获取符合条件的按钮，去掉不合条件的
    for(var i=0; i<tidu.length; i++) {
        _store = [];
        for(var j=0; j<store.length; j++) if(store[j].deg <= tidu[i]) _store.push(store[j]);
        if(_store.length > 0) break;
    }
    store = _store.length ? _store : [];
    //对符合条件的按钮进行升序或者降序排序
    store.sort(function(a, b) {
        var desc = (dir === 'left' || dir === 'up') ? -1 : 1 ; // 默认升序，如果降序需要乘以-1
        return (a.distance < b.distance ? -1 : (a.distance > b.distance ? 1 : 0)) * desc;
    });
    // 此时绝大多数情况下，store[0].id就是我们要的结果，但是有时候会出现多个按钮distance一样的情况，
    // 以向右移动为例，可能2个目标按钮的left一样，此时我们取top离当前按钮top值最接近的那个按钮
    var nearest; // 最近的
    var result = '';
    var key = leftOrRight ? 'top' : 'left';
    for(var i=0; i<store.length; i++) {
        if(i>0 && store[i].distance != store[0].distance) break; // 不存在相同的情况直接跳出循环
        var distance = Math.abs(positions[store[i].id][key]-current[key]);//距离
        if(nearest === undefined || distance < nearest) {
            nearest = distance;
            result = store[i].id;
        }
    }
    return result;//没有找到符合条件的按钮时直接返回空字符串
}

function getAbsolutePosition(elem) {
    if(elem == null) return {left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0};
    var left = elem.offsetLeft,
        top = elem.offsetTop,
        width = elem.offsetWidth,
        height = elem.offsetHeight;
    while(elem = elem.offsetParent) {
        left += elem.offsetLeft;
        top += elem.offsetTop;
    }
    return {left: left, top: top, width: width, height: height, right: left + width, bottom: top + height};
};

export default function autoMakeBtnDir(allButtons) {
    var start = new Date().getTime();
    var btnGroups = {};
    for(var i = 0; i < allButtons.length; i++) {
        if(allButtons[i].autoDirGroup === false) continue;
        var gname = 'group_'+(allButtons[i].autoDirGroup === undefined ? 'default' : allButtons[i].autoDirGroup);
        btnGroups[gname] = btnGroups[gname] || [];
        btnGroups[gname].push(allButtons[i]);
    }
    for(var gname in btnGroups) {
        positions = {};
        var btns = btnGroups[gname];
        for(var i = 0; i < btns.length; i++) {
            if(btns[i].autoDir === false) continue;
            var id = btns[i].id;
            var obj = document.getElementById(id);
            var position = getAbsolutePosition(obj);
            position.obj = obj;
            position.centerX = position.left + position.width / 2;
            position.centerY = position.top + position.height / 2;
            positions[id] = position;
        }
        var dirs = ['left', 'right', 'up', 'down'];
        for(var i = 0; i < btns.length; i++) {
            for(var j = 0; j < dirs.length; j++) {
                btns[i][dirs[j]] = btns[i][dirs[j]] || getBtn(btns[i].id, dirs[j]);
            }
        }
    }
    var end = new Date().getTime();
    console.log('自动生成按钮耗时: '+(end-start)+'毫秒');
}