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
        <h1>{{weatherInfo.temperature}} ℃</h1>
      </div>

      <div class="weather-content">
        <div class="content-header">
          <div class="grid">
            <div class="grid-cell">
              五天 <span class="sub-title">气温情况</span>
            </div>
            <div class="grid-cell" style="text-align:right">
              <span style="margin-right:10px">{{weatherInfo.windDirection}} 风</span> <span class="sub-title">{{weatherInfo.windPower}} 级</span>
            </div>
          </div>
        </div>
        <div class="content-footer">
          <div class="grid">
            <div class="grid-cell">
              <p>今天</p>
              <span class="weather">{{weatherInfo.weather}}</span>
              <p>{{weatherInfo.temperature}}</p>
            </div>
            <div class="grid-cell" v-for="dayTemp in weatherForecasts">
              <p>{{dayTemp.week | weekFilter}}</p>
              <span class="weather">{{dayTemp.dayWeather}}</span>
              <p>{{dayTemp.dayTemp}}</p>              
            </div>
          </div>
        </div>
      </div>

      <div class="weather-footer">
        <div class="content-header">
          五天 <span class="sub-title">气温情况统计图</span>
        </div>
        <canvas style="margin-top:10px" id="myChart" width="400" height="400"></canvas>
        <div style="display:none" id="map-container"></div>
      </div>
    </div>

  </div>
</template>

<script>

import Vue from 'vue';
import { Group, Cell } from 'vux'
import { Loading, XSwitch, XButton, TransferDomDirective as TransferDom } from 'vux'
import { Popup, Scroller, Toast, XAddress, ChinaAddressData } from 'vux'
import Chart from 'chart.js';

Vue.filter('weekFilter', function(value) {

  var weekFilter = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '日'
  }

  return '周' + weekFilter[value];
});

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
    this.getLocation();
    this.initChartOptions();
  },

  data () {
    return {
      isLoadLocation: true,
      showTip: false,      
      tips: '抱歉，无法获取您的位置信息，请手动选择',
      locaionLoadingText: '获取经纬度中...',

      addressData: ChinaAddressData,
      showAddressSelector: false,
      userAddress: [],

      weatherInfo: {
        city: '--',
        weather: '--',
        temperature: '--',
        windDirection: '--',
        windPower: '--'
      },

      weatherForecasts: [],

      futureWeatherData: {
        labels: ["今天", "-", "-", "-", "-"],
        datasets: [{
          fillColor: "rgba(220,220,220,0.5)",
          strokeColor: "#ff3dff",
          backgroundColor: 'rgba(75,192,192,0.4)',
          pointColor: "#ffffff",
          pointStrokeColor: "#ffffff",
          data: [0, 0, 0, 0, 0],
          label: '气温'
        }]
      },

      position: {}
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

    initChartOptions () {
      Chart.defaults.global.defaultColor = '#fff';
      Chart.defaults.global.defaultFontColor = '#fff';
      Chart.defaults.global.defaultFontFamily = '"Avenir", Helvetica, Arial, sans-serif';
      Chart.defaults.global.elements.line.borderColor = '#fff';
      Chart.defaults.global.elements.line.borderWidth = 2;    
      Chart.defaults.global.elements.point.borderColor = '#fff';
      Chart.defaults.global.elements.point.backgroundColor = '#fff';
      Chart.defaults.global.elements.point.radius = 2;
    },

    getLocation () {

      var self = this;

      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log(position);
          self.position = position;
          self.tips = '获取经纬度成功，正在获取城市数据';
          self.showTip = true;
          self.locaionLoadingText = '获取城市数据...';
          self.initMap();
        });
      }else {
        this.showTip = true;
        this.isLoadLocation = false;
        this.tips = '抱歉，无法获取您的位置信息，请手动选择';
        this.showAddressSelector = true;
      }

    },

    initMap () {
      var self = this,

      map = new AMap.Map('map-container', {
          resizeEnable: true,
          center: [self.position.coords.longitude, self.position.coords.latitude],
          zoom: 12
      });

      this.getFutureWeatherData(map);
    },

    initLineChart () {

      var futureWeatherData = this.futureWeatherData,
          ctx = document.getElementById("myChart").getContext("2d"),

          futureWeatherDataLineChart = new Chart(ctx, {
            type: 'line',
            data: futureWeatherData
          }, {
            scaleLineColor: 'rgba(255, 255, 255,.1)',
            scaleFontColor : "#fff",
            scaleGridLineColor : "rgba(255, 255, 255,.1)"
          });

    },

    getFutureWeatherData (map) {

      var self = this;

      AMap.service('AMap.Weather', function() {
          var weather = new AMap.Weather(),

            getLiveWeather = function(address) {

              console.log(address);

              weather.getLive(address, function(err, data) {
                  if (!err) {
                      self.tips = '获取天气信息成功 :)';
                      self.isLoadLocation = false;

                      self.weatherInfo.city = data.city;
                      self.weatherInfo.weather = data.weather;
                      self.weatherInfo.temperature = data.temperature;
                      self.weatherInfo.windDirection = data.windDirection;
                      self.weatherInfo.windPower = data.windPower;

                      self.futureWeatherData.labels[0] = '今天';
                      self.futureWeatherData.datasets[0].data[0] = self.weatherInfo.temperature;

                      weather.getForecast(data.city, function(err, data) {
                          if(err) {
                            self.tips = '获取天气预报信息失败，请重试 :(';
                            return;
                          }

                          self.weatherForecasts = data.forecasts;

                          for (var i = 0, dayWeather; i < data.forecasts.length; i++) {
                              dayWeather = data.forecasts[i];
                              console.log(dayWeather);
                              self.futureWeatherData.labels[i + 1] = dayWeather.week;
                              self.futureWeatherData.datasets[0].data[i + 1] = dayWeather.dayTemp;
                          }

                          self.initLineChart();

                          console.log(self.futureWeatherData);
                      });

                  }else {
                      self.tips = '获取天气信息失败，请重试 :(';
                  }
              });

            };

          // getLiveWeather();
          self.getAddressByCoords([self.position.coords.longitude, self.position.coords.latitude], getLiveWeather);
      });

    },

    getAddressByCoords: function(lnglatXY, cb) {

      AMap.plugin('AMap.Geocoder', function(){
        //实例化Geocoder
        var geocoder = new AMap.Geocoder({
            city: "010"
        });

        console.log(geocoder);

        geocoder.getAddress(lnglatXY, function(status, result) {
          console.log(status, result);
          if(status === 'complete' && result.info === 'OK') {
            if(cb) {
              cb(result.regeocode.addressComponent.city);
            }
          }else{
             //获取地址失败
            self.tips = '获取地址信息失败，请重试 :(';
          }
        });

      });

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

.weather {
  font-size: .8em;
}

</style>
