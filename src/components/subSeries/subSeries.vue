<template>
    <div class="sub_wrapper">
        <div class="subSeriesPage">
            <div id="subSeriesPageTotal">
                <div class="subSeriesPageTotal">
                    <div :id="`subSeriesPage_${i-1}`" v-for="i in pageCount" :class="[(i-1) === subSeries_page_idx ? 'focusSeriesPage' : '']">
                        {{(18*(i-1)+1) +'-'+ ((18*(i-1)+18) > rowCount ? rowCount : (18*(i-1)+18))}}
                    </div>                    
                </div>
            </div>
        </div>

        <div class="subSeries">
            <div id="subSeriesTotal">
                <div class="subSeriesTotal">
                    <div v-for="i in rowCount">
                        <div :id="`subSeries_${i-1}`">{{i}}</div>
                    </div>
                </div>
            </div>
            <div id="subSeriesLeft" :style="{visibility: isShowLeft ? 'visible' : 'hidden'}"></div>
            <div id="subSeriesRight" :style="{visibility: isShowRight ? 'visible' : 'hidden'}"></div>
        </div>

        <div class="recommend_name">精彩推荐</div>
        <div id="recommends3">
            <div class="recommends3">
                <div v-for="(d, index) in dataList" :style="{backgroundImage: 'url('+IMAGE_PATH+d.thumbHD+')'}">
                    <div :id="`buttomSeresScore_${index}`" class="butttomSeriesScore" v-if="d.score">
                        <div class="butttomSeriesScore_score">{{d.score}}</div>
                    </div>                    
                    <div :id="`recommend_${index}`"></div>
                    <div :id="`recommend_${index}_txt`" class="recommend_txt">{{d.name}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {getVideoList, getEpg, getProgram} from '../../api/index.js';
import {KEY_BACK, G} from '../../js/keycode.js';
import {btn, key} from '../../js/button.js';
import autobtn from '../../js/button_extra.js';
import {scroll} from '../../js/scroll.js';

export default {
    data() {
        return {
            IMAGE_PATH: 'http://112.74.16.243:8989/ott-ggly-epg-v6.0/',
            pageCount: 0,
            rowCount: 0,
            dataList: [],
            buttons: [],
            subSeries_page_idx: 0,      // 当前显示的页码下标
            isShowLeft: false,
            isShowRight: false
        };
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        updateLeftAndRight() {            
            this.isShowLeft = this.subSeries_page_idx > 0 ? true : false;
            this.isShowRight = this.subSeries_page_idx < (this.pageCount - 1) ? true : false;
        },
        subSeriesFocusHandler(curr) {
            // var position = G(curr.id).getBoundingClientRect();
            // var wrapperPosition = G('subSeriesTotal').getBoundingClientRect();
            // if(position.right > wrapperPosition.right) {
            //     this.subSeries_page_idx++;
            //     this.updateLeftAndRight();
            //     G('subSeriesTotal').scrollLeft += 1176;
            // }else if(position.left < wrapperPosition.left) {
            //     this.subSeries_page_idx--;
            //     this.updateLeftAndRight();
            //     G('subSeriesTotal').scrollLeft -= 1176;
            // }
            var id = curr.id;
            this.subSeries_page_idx = Math.floor(parseInt(id.slice(10)) / 18);
            this.updateLeftAndRight();
        },
        subSeriesAction() {
            this.$router.push('/mp');
        },
        init() {
            var subSeriesTotal = new scroll({wrapperId:'subSeriesTotal'});

            var buttons = [];
            for(var i = 0; i < this.rowCount; i++) {
                var obj = {
                    id:'subSeries_'+i, focusHandler:this.subSeriesFocusHandler.bind(this), action:this.subSeriesAction.bind(this), focusClass:'subSeries', scrollDir:'x', scrollScreen:true, scroll:subSeriesTotal
                };
                if(i === 0) {
                    obj['restoreScroll'] = true;
                }
                buttons.push(obj);
            }
            for(var i = 0; i < this.pageCount; i++) {
                buttons.push({id:'subSeriesPage_'+i, focusClass:'subSeriesPage'});
            }
            var recommends3 = new scroll({wrapperId:'recommends3'});
            for(var i = 0; i < this.dataList.length; i++) {
                var obj = {
                    id:'recommend_'+i, code:this.dataList[i].code, focusClass:'recommend', scrollDir:'x', scrollScreen:true, scroll: recommends3
                };
                if(i === 0) {
                    obj['restoreScroll'] = true;
                }
                buttons.push(obj);
            }
            this.$set(this, 'buttons', buttons);
            autobtn(buttons);
            btn.init(['subSeries_0'], this.buttons, '', true);
            key.set(KEY_BACK, this.back);
        },
        initSubSeries() {
            var self = this;
            getVideoList({seriesCode:this.$route.query.code, appVersion:'hd', platform:'hw-20', format:'ts-hd', pageSize:1000, pageable:true}).then(function({body}) {
                if(body && body.code === 0) {
                    self.rowCount = body.pb.rowCount;
                    self.pageCount = Math.ceil(self.rowCount / 18);
                }
            })
            getEpg({code:'ggly_iptv_series_recommend', appVersion:'hd'}).then(function({body}) {
                if(body && body.code === 0) {
                    let programId = body.epg.groups[0].metadatas[0].value;
                    getProgram({id:programId, current:1, pageSize:50}).then(function({body}) {
                        if(body && body.code === 0) {
                            self.dataList = body.pb.dataList;
                        }
                        setTimeout(function() {
                            self.init();
                        }, 200);
                    });
                }
            })  
        },
    },
    created() {
        this.initSubSeries();
    }
}
</script>
<style src='./style/subSeries.css'></style>


