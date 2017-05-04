<template>
  <div>

    <div v-transfer-dom>
      <loading v-model="isLoadLocation" :text="locaionLoadingText"></loading>
    </div>

    <div v-transfer-dom>
      <popup v-model="showTip" position="top" :show-mask="false">
        <div class="position-vertical-demo">
        {{tips}}
        </div>
      </popup>
    </div>

    <div v-transfer-dom>
      <popup v-model="showAddressSelector" height="50%">
        <div class="popup1">
          <group>
            <x-address title="位置信息" v-model="showAddressSelector" :list="addressData" placeholder="请选择地址" inline-desc="请选择地址"></x-address>
          </group>
        </div>
      </popup>
    </div>

    <group title="cell demo">
      <cell title="Vux" value="Cool" is-link></cell>
    </group>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import { Loading, XSwitch, XButton, TransferDomDirective as TransferDom } from 'vux'
import { Popup, Scroller, Toast, XAddress, ChinaAddressData } from 'vux'

export default {
  components: {
    Group,
    Cell,
    Loading,
    Group,
    XSwitch,
    XButton,
    Scroller,
    Toast,
    XAddress,
    XButton,
    Popup
  },

  directives: {
    TransferDom
  },

  mounted () {
    this.getLocation();
  },

  data () {
    return {
      isLoadLocation: true,
      showTip: false,      
      tips: '抱歉，无法获取您的位置信息，请手动选择',
      locaionLoadingText: '获取位置信息...',

      addressData: ChinaAddressData,
      showAddressSelector: false
    }
  },

  watch: {
    showTip (val) {
      if (val) {
        setTimeout(() => {
          this.showTip = false
        }, 1500)
      }
    }
  },

  methods: {

    getLocation () {

      var self = this;

      if(!navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log(position);
          self.tips = '获取位置信息成功，正在获取天气数据';
          self.showTip = true;
          self.locaionLoadingText = '获取天气数据...';
        });
      }else {
        this.showTip = true;
        this.isLoadLocation = false;
        this.tips = '抱歉，无法获取您的位置信息，请手动选择';
        this.showAddressSelector = true;
      }

    }

  }

}
</script>

<style>

.popup0 {
  padding-bottom:15px;
  height:200px;
}

.popup1 {
  width:100%;
  height:100%;
}

.popup2 {
  padding-bottom:15px;
  height:400px;
}

.position-vertical-demo {
  background-color: #ffe26d;
  color: #000;
  text-align: center;
  padding: 15px;
}

.position-horizontal-demo {
  position: relative;
  height: 100%;
}

.vux-close {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%) scale(4);
  color: #000;
}

</style>
