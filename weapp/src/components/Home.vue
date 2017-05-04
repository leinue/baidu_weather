<template>
  <div>

    <iframe class="bg" src="static/line/index.html"></iframe>

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
            <x-address title="位置信息" v-model="userAddress" :list="addressData" placeholder="请选择地址" inline-desc="请选择地址"></x-address>
          </group>
        </div>
      </popup>
    </div>

    <div class="weather-content">
      <div class="weather-header">
        <h2>{{weatherInfo.city}}</h2>
        <h3>{{weatherInfo.weather}}</h3>
        <h1>{{weatherInfo.degree}} ℃</h1>
      </div>

      <div class="weather-content">
        <div class="content-header">
          <div class="grid">
            <div class="grid-cell">
              今天 <span class="sub-title">未来三小时</span>
            </div>
            <div class="grid-cell" style="text-align:right">
              <span style="margin-right:10px">28</span> <span class="sub-title">20</span>
            </div>
          </div>
        </div>
        <div class="content-footer">
          <div class="grid">
            <div class="grid-cell">
              <p>现在</p>
              <div>ss</div>
              <p>23</p>
            </div>
            <div class="grid-cell">
              <p>12时</p>
              <div>ss</div>
              <p>23</p>              
            </div>
            <div class="grid-cell">
              <p>13时</p>
              <div>ss</div>
              <p>23</p>              
            </div>
            <div class="grid-cell">
              <p>14时</p>
              <div>ss</div>
              <p>23</p>              
            </div>
          </div>
        </div>
      </div>

      <div class="weather-footer">
        <div class="content-header">
          未来5天气温变化情况
        </div>
        <canvas style="margin-top:10px" id="myChart" width="400" height="400"></canvas>
      </div>
    </div>

  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import { Loading, XSwitch, XButton, TransferDomDirective as TransferDom } from 'vux'
import { Popup, Scroller, Toast, XAddress, ChinaAddressData } from 'vux'

import Chart from 'chart.js';

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
    Popup,
  },

  directives: {
    TransferDom
  },

  mounted () {
    // this.getLocation();
    Chart.defaults.global.defaultColor = '#fff';
    Chart.defaults.global.defaultFontColor = '#fff';
    Chart.defaults.global.defaultFontFamily = '"Avenir", Helvetica, Arial, sans-serif';
    Chart.defaults.global.elements.line.borderColor = '#fff';
    Chart.defaults.global.elements.line.borderWidth = 2;    
    Chart.defaults.global.elements.point.borderColor = '#fff';
    Chart.defaults.global.elements.point.backgroundColor = '#fff';
    Chart.defaults.global.elements.point.radius = 2;    

    var ctx = document.getElementById("myChart").getContext("2d");
    var data = {
      labels : ["23日","24日","25日","26日","27日"],
      datasets : [
        {
          fillColor : "rgba(220,220,220,0.5)",
          strokeColor : "#ff3dff",
          backgroundColor: 'rgba(75,192,192,0.4)',
          pointColor : "#ffffff",
          pointStrokeColor : "#ffffff",
          data : [65,59,90,81,56,55,40],
          label: '23日'
        },
        {
          fillColor : "rgba(151,187,205,0.5)",
          strokeColor : "#ffffff",
          backgroundColor: 'rgba(75,192,192,0.1)',
          pointColor : "#ffffff",
          pointStrokeColor : "#ffffff",
          data : [28,48,40,19,96,27,100],
          label: '24日'
        }
      ]
    };

    var myNewChart = new Chart(ctx, {
      type: 'line',
      data: data
    }, {
      scaleLineColor: 'rgba(255, 255, 255,.1)',
      scaleFontColor : "#fff",
      scaleGridLineColor : "rgba(255, 255, 255,.1)"
    });
  },

  data () {
    return {
      isLoadLocation: false,
      showTip: false,      
      tips: '抱歉，无法获取您的位置信息，请手动选择',
      locaionLoadingText: '获取位置信息...',

      addressData: ChinaAddressData,
      showAddressSelector: false,
      userAddress: '',

      weatherInfo: {
        city: '--',
        weather: '--',
        degree: '--'
      }
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

      if(navigator.geolocation) {
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

body {
  color: #ffffff;
}

h1,h2,h3,h4,h5,h6 {
  font-weight: 200;
}

.weather-header {
  text-align: center;
  padding: 30px;
}

.weather-header h1 {
  font-size: 3em;
}

.weather-header h2 {
  font-size: 1.8em;
}

.weather-header h3 {
  font-size: 1.3em;
}

.content-header, .content-footer {
  padding-left: 15px;
  padding-right: 15px;
}

.sub-title {
  color: #d0cfd0;
}

.content-footer {
  border-top: 1px solid #ffffff;
  border-bottom: 1px solid #ffffff;
  max-height: 80px;
  height: 80px;
  margin-top: 5px;
  text-align: center;
  padding-top: 8px;
}

.weather-footer {
  margin-top: 5px;
}

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

.grid {
  display: flex;
}

.grid-cell {
  flex: 1;
}

.bg {
  border: 0px;
  position: absolute;
  z-index: -1;
  width: 100%;
  height: calc(100vh + 180px);
}

</style>
