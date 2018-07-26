<template>
    <div class="mp_wrapper"></div>
</template>
<script>
import {getEpg} from '../../api/index.js'
import {btn, key} from '../../js/button.js';
import {KEY_BACK} from '../../js/keycode.js';
import autobtn from '../../js/button_extra.js';
import {scroll} from '../../js/scroll.js';
import Mp from '../../js/mp.js';

export default {
    data() {
        return {
            rtspTest: "http://61.liuxianan.cn/media/xihuanni.mp4"
        };
    },
    methods: {
        back() {
            Mp.destroy();
            this.$router.go(-1);
        },
        init() {
            var buttons = [
                {id:'mp_wrapper', action:this.back}
            ];
            btn.init(['mp_wrapper'], buttons, '', true);
            key.set(KEY_BACK, this.back);
        }
    },
    created() {
        Mp.init(true);
        Mp.fullscreenPlay(this.rtspTest);
        this.init();        
    }
}
</script>
<style src="./style/mp.css"></style>


