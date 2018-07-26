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

        <div id="side_bg">
            <div id="sides">
                <div class="sides" v-if="groups.length > 0">
                    <span class="animation">
                        <div id="side_0" class="side_txt">精选推荐</div>
                    </span>
                    <span class="animation" v-for="(m, index) in groups[1].metadatas">
                        <div :id="`side_${index+1}`" class="side_txt">{{m.label}}</div>
                    </span>
                </div>
            </div>
            <div id="side_more"></div>
        </div>

        <div id="recommend_big" v-if="groups.length > 0">
            <span v-for="(m, index) in groups[0].metadatas.slice(0, 3)" :class="[index === carousel_index ? 'recommend_big_show' : '']" :style="{backgroundImage:'url('+IMAGE_PATH+m.linkImageUri+')'}"></span>
            <ul>
                <li v-for="(m, index) in groups[0].metadatas.slice(0, 3)" :class="[index === carousel_index ? 'recommend_dian' : '']"></li>
            </ul>
        </div>

        <div id="recommends2" v-if="groups.length > 0">
            <div v-for="(m, index) in groups[0].metadatas.slice(3, 8)" :style="{backgroundImage:'url('+IMAGE_PATH+m.linkImageUri+')'}">
                <div :id="`recommend_${index}`"></div>
                <div :id="`recommend_${index}_txt`" class="recommend_txt">{{m.label}}</div>
            </div>
        </div>
    </div>    
</template>
<script>
import {getEpg} from '../../api/index.js';
import {KEY_BACK} from '../../js/keycode.js';
import {btn, key} from '../../js/button.js';
import autobtn from '../../js/button_extra.js';
import {scrollScreen} from '../../js/scroll.js';
export default {
    data() {
        return {
            IMAGE_PATH: 'http://112.74.16.243:8989/ott-ggly-epg-v6.0/',
            groups: [],
            carousel_index: 0,
            buttons: []
        };
    },
    watch: {
        '$route' (to, from) {
            if(/secondPage/.test(to.path)) {
                this.initPage();
            }
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        navBeforeMoveHandler: function(dir, curr) {

        },
        navClick(curr) {
            var code = curr.code;
            this.$router.replace({path:'/secondPage', query:{code: code}});
        },
        sideClick(curr) {

        },
        recommendClick(curr) {
            var code = curr.code;
            this.$router.push({path: '/subSeries', query: {code: code}});
        },
        init() {
            var codes = {
                'ggly_iptv_animation': 'nav_1', 'ggly_iptv_early': 'nav_2',
                'ggly_iptv_song': 'nav_3', 'ggly_iptv_story': 'nav_4',
                'ggly_iptv_puzzle': 'nav_5', 'ggly_iptv_area': 'nav_6',
                'ggly_iptv_more': 'nav_7', 'nav_order': 'nav_order',
                'nav_search': 'nav_search', 'nav_history': 'nav_history'
            }
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
            buttons.push({id:'side_0', restoreScroll:true, index:0, action:this.sideClick, focusClass:'side'});
            for(var i = 0, len = this.groups[1].metadatas.length; i < len; i++) {
                buttons.push({id:'side_'+(i+1), scrollScreen:true, index:(i+1), action:this.sideClick, focusClass:'side'});
            }
            for(var i = 0, g = this.groups[0].metadatas.slice(3, 8); i < g.length; i++) {
                buttons.push({id:'recommend_'+i, type:g[i].type, code:g[i].value, action:this.recommendClick, focusClass:'recommend'});
            }
            this.$set(this, 'buttons', buttons);
            autobtn(this.buttons);
            btn.init([codes[this.$route.query.code]], this.buttons, '', true);
            //console.log(JSON.stringify(this.buttons));
            scrollScreen.init({wrapperId: 'sides'});
            key.set(KEY_BACK, this.back.bind(this));
        },
        initPage() {
            let self = this;
            let code = this.$route.query.code;
            getEpg({code:code, appVersion:'hd'}).then(function({body}) {
                if(body && body.code === 0) {
                    self.groups = body.epg.groups;
                }
                setTimeout(function() {
                    self.init();
                }, 200);
            })  
        }
    },
    activated() {
        this.initPage();
    },
    created() {
        this.initPage();
    }
}
</script>
<style src="./style/secondPage.css"></style>


