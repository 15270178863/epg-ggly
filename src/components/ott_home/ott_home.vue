<template>
    <div class="wrapper">
        <div class="logo" id="logoGif"></div>
        <div class="navs">
            <span class="nav_bg"></span>
            <div>
                <div id="nav_0"></div>
                <div class="nav_txt">热播</div>
            </div>
            <div>
                <div id="nav_1"></div>
                <div class="nav_txt">动画</div>
            </div>
            <div>
                <div id="nav_2"></div>
                <div class="nav_txt">早教</div>
            </div>
            <div>
                <div id="nav_3"></div>
                <div class="nav_txt">故事</div>
            </div>
            <div>
                <div id="nav_4"></div>
                <div class="nav_txt">故事</div>
            </div>
            <div>
                <div id="nav_5"></div>
                <div class="nav_txt">益智</div>
            </div>
            <div>
                <div id="nav_6"></div>
                <div class="nav_txt">专区</div>
            </div>
            <div>
                <div id="nav_7"></div>
                <div class="nav_txt">更多</div>
            </div>
        </div>

        <div id="nav2">
            <div>
                <div id="nav_order"></div>
            </div>
            <div>
                <div id="nav_search"></div>
            </div>
            <div>
                <div id="nav_history"></div>
            </div>
            <div class="nav">
                <div id="nav_fav"></div>
            </div>
        </div>

        <div id="recommends">
            <div class="recommends" v-if="groups.length > 0 && start_index.length > 0">
                <div v-for="(g, index) in groups" :style="{width: g.metadatas.length === 3 ? '439px' : '216px'}">
                    <div :id="`recommend_${start_index[index]['key'][0]}`" v-if="g.metadatas.length === 1"></div>
                    <span class="recommend_span" :style="{background: 'url('+IMAGE_PATH+g.metadatas[0].linkImageUri+')'}" v-if="g.metadatas.length === 1"></span>
                    <div :id="`recommend_${start_index[index]['key'][0]}_txt`" class="recommend_txt" v-if="g.metadatas.length === 1">{{g.metadatas[0].label}}</div>                    

                    <div class="recommend_small_0" v-if="g.metadatas.length === 2">
                        <div :id="`recommend_${start_index[index]['key'][0]}`"></div>
                        <span class="recommend_span" :style="{height: '228px', background: 'url('+IMAGE_PATH+g.metadatas[0].linkImageUri+')'}"></span>
                        <div :id="`recommend_${start_index[index]['key'][0]}_txt`" class="recommend_txt">{{g.metadatas[0].label}}</div>                        
                    </div>
                    <div class="recommend_small_1" v-if="g.metadatas.length === 2">
                        <div :id="`recommend_${start_index[index]['key'][1]}`"></div>
                        <span class="recommend_span" :style="{height: '172px', background: 'url('+IMAGE_PATH+g.metadatas[1].linkImageUri+')'}"></span>
                        <div :id="`recommend_${start_index[index]['key'][1]}_txt`" class="recommend_txt">{{g.metadatas[1].label}}</div>                        
                    </div>

                    <div class="recommend_big" :style="{position: 'absolute', width: '439px', height: '407px'}" v-if="g.metadatas.length === 3">
                        <div :id="`recommend_${start_index[index]['key'][0]}`"></div>
                        <span v-for="(m, i) in g.metadatas" :class="[i === carousel_index ? 'recommend_big_show' : '']" :style="{background: 'url('+IMAGE_PATH+m.linkImageUri+')'}"></span>
                        <div :id="`recommend_${start_index[index]['key'][0]}_txt`" class="recommend_txt" :style="{width: '433px'}">{{g.metadatas[carousel_index].label}}</div>
                        <ul>
                            <li v-for="(m, i) in g.metadatas" :class="[i === carousel_index ? 'recommend_dian' : '']"></li>
                        </ul>                        
                    </div>
                </div>
            </div>
        </div>

        <div id="ips">
            <div class="ips" v-if="ips.length > 0">
                <div v-for="(m, index) in ips[0].metadatas" :id="`ip_${index}`">
                    <div :id="`ip_${index}_0`"></div>
                    <div :id="`ip_${index}_1`"></div>
                    <div :id="`ip_${index}_2`" class="ip" :style="{background: 'url('+IMAGE_PATH+ips[0].metadatas[index].linkImageUri+')'}"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import {getEpg} from '../../api/index.js'
import {btn} from '../../js/button.js';
import autobtn from '../../js/button_extra.js';
import {scroll} from '../../js/scroll.js';

export default {    
    data() {
        return {
            IMAGE_PATH: 'http://112.74.16.243:8989/ott-ggly-epg-v6.0/',
            ips: [],
            groups: [],
            carousel_index: 0,
            start_index: [],
            buttons: [{id:'nav_0', focusClass:'nav'}]
        };
    },
    directives: {
        index: {
            bind: function(el, binding) {
                //binding.value.set();
            }
        }
    },
    // watch: {
    //     '$route' (to, from) {
    //         this.initHome();
    //     }
    // },
    methods: {
        // set: function() {
        //     this.$set(this.start_index, 0, ++this.start_index[0]);
        // },
        recommendClick(curr) {
            
        },
        navBeforeMoveHandler: function(dir, curr) {

        },
        navClick(curr) {
            var code = curr.code;
            this.$router.push({path:'/secondPage', query: {code: code}})
        },
        init() {
            var recommends = new scroll({wrapperId:'recommends'});

            var buttons = [
                {id:'nav_0', focusClass:'nav'},
                {id:'nav_1', code:'ggly_iptv_animation', beforeMove:this.navBeforeMoveHandler, action:this.navClick, focusClass:'nav'},
                {id:'nav_2', code:'ggly_iptv_early', beforeMove:this.navBeforeMoveHandler, action:this.navClick, focusClass:'nav'},
                {id:'nav_3', code:'ggly_iptv_song', beforeMove:this.navBeforeMoveHandler, action:this.navClick, focusClass:'nav'},
                {id:'nav_4', code:'ggly_iptv_story', beforeMove:this.navBeforeMoveHandler, action:this.navClick, focusClass:'nav'},
                {id:'nav_5', code:'ggly_iptv_puzzle', beforeMove:this.navBeforeMoveHandler, action:this.navClick, focusClass:'nav'},
                {id:'nav_6', code:'ggly_iptv_area', beforeMove:this.navBeforeMoveHandler, action:this.navClick, focusClass:'nav'},
                {id:'nav_7', code:'ggly_iptv_more', beforeMove:this.navBeforeMoveHandler, action:this.navClick, focusClass:'nav'},
                {id:'nav_order', code:'nav_order', beforeMove:this.navBeforeMoveHandler, action:this.navClick, focusClass:'nav_order'},
                {id:'nav_search', code:'nav_search', beforeMove:this.navBeforeMoveHandler, action:this.navClick, focusClass:'nav_search'},
                {id:'nav_history', code:'nav_history', beforeMove:this.navBeforeMoveHandler, action:this.navClick, focusClass:'nav_history'},
                {id:'nav_fav', code:'nav_fav', beforeMove:this.navBeforeMoveHandler, action:this.navClick, focusClass:'nav_fav'}
            ];

            for(var i = 0, len = this.groups.length; i < len; i++) {
                var metadatas = this.groups[i].metadatas;
                if(metadatas.length == 1) {
                    var obj = {
                        id: 'recommend_'+this.start_index[i]['key'][0],
                        type: metadatas[0].type, code: metadatas[0].value,
                        action: this.recommendClick,
                        focusClass: 'recommend_middle',
                        scrollDir: 'x', scrollScreen: true, scroll:recommends
                    };                    
                }else if(metadatas.length === 3) {
                    var obj = {
                        id: 'recommend_'+this.start_index[i]['key'][0],
                        type: metadatas[0].type, code: metadatas[0].value,
                        action: this.recommendClick,
                        focusClass: 'recommend_big',
                        scrollDir: 'x', scrollScreen: true, scroll:recommends
                    };
                }else {
                    var obj = {
                        id: 'recommend_'+this.start_index[i]['key'][0],
                        down: 'recommend_'+this.start_index[i]['key'][1],
                        type: metadatas[0].type, code: metadatas[0].value,
                        action: this.recommendClick,
                        focusClass: 'recommend_small_0',
                        scrollDir: 'x', scrollScreen: true, scroll:recommends
                    };
                    buttons.push(obj);
                    obj = {
                        id: 'recommend_'+this.start_index[i]['key'][1],
                        type: metadatas[1].type, code: metadatas[1].value,
                        action: this.recommendClick,
                        focusClass: 'recommend_small_1',
                        scrollDir: 'x', scrollScreen: true, scroll:recommends
                    };    
                }
                if(i === 0) {
                    obj['restoreScroll'] = true;
                }
                buttons.push(obj);
            }
            this.$set(this, 'buttons', buttons);
            autobtn(this.buttons);
            //console.log('--- ' +JSON.stringify(this.buttons));
            btn.init(['nav_0'], this.buttons, '', true, false);
            this.$set(this, 'carousel_index', 1);
        },
        initHome() {
            var self = this;
            getEpg({code: 'ggly_ott_home', appVersion: 'hd'}).then(function({body}) {
                if(body && body.code === 0) {
                    self.ips = body.epg.groups.slice(0, 1);
                    self.groups = body.epg.groups.slice(1);
                    for(var i = 0, k = 0, len = self.groups.length; i < len; i++, k++) {
                        var l = self.groups[i].metadatas.length;
                        if(l === 1 || l === 3) {
                            var obj = {'key': [k]};
                        }else {
                            var obj = {'key': [k, ++k]};
                        }                    
                        self.$set(self.start_index, i, obj);
                    }
                }                        
                setTimeout(function() {
                    self.init();
                }, 200);            
            });
        }
    },
    activated() {
        this.initHome();
    },
    created() {
        this.initHome();
    }   
}
</script>
<style src='./style/ott_home.css'></style>

