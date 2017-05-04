<template>
  <div>

    <iframe class="bg" src="static/line/index.html"></iframe>

    <div class="repos" @click="showAddrSelector"></div>

    <div v-transfer-dom>
      <loading v-model="isLoadLocation" :text="locaionLoadingText"></loading>
    </div>

    <toast v-model="showTip" :type="reqStatus">{{tips}}</toast>

    <div v-transfer-dom>
      <popup v-model="showAddressSelector" height="100%">
        <div class="addrSelectorPopup">
          <group>
            <x-address :title="addrSelectorTitle" v-model="addrSelectorVal" raw-value :list="addressData" value-text-align="left"></x-address>
          </group>
          <div style="padding: 15px 15px;">
            <x-button type="primary" @click.native="applyThisCity">确定</x-button>
          </div>
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
      reqStatus: 'success',
      locaionLoadingText: '获取经纬度中...',

      addressData: ChinaAddressData,
      showAddressSelector: false,
      userAddress: [],
      addrSelectorTitle: '选择城市',
      addrSelectorVal: ['北京市', '市辖区', '朝阳区'],

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

      position: {},

      map: {}
    }
  },

  watch: {
    showTip (val) {
      if (val) {
        setTimeout(() => {
          this.showTip = false
        }, 2000)
      }
    }
  },

  methods: {

    applyThisCity () {
        this.weatherInfo.city = this.addrSelectorVal[this.addrSelectorVal.length - 1];
        this.showAddressSelector = false;
        this.getFutureWeatherData(true);
    },

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

      function showCityInfo(cb) {
        //实例化城市查询类
        var citysearch = new AMap.CitySearch();
        //自动获取用户IP，返回当前城市
        citysearch.getLocalCity(function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                if (result && result.city && result.bounds) {
                    var cityinfo = result.city;
                    var citybounds = result.bounds;
                    console.log('cityinfo', cityinfo);
                    if(cb) {
                      cb(cityinfo);
                    }
                }
            } else {
              self.showTip = true;
              self.isLoadLocation = false;
              self.tips = '无法获取位置信息，请手动选择';
              self.reqStatus = 'cancel';
              self.showAddressSelector = true;
            }
        });
      }

      var handleError = function() {
        //如果浏览器不支持geolocation api或用户阻止，尝试通过ip获取城市信息
        showCityInfo(function(cityinfo) {
          self.weatherInfo.city = cityinfo;
          self.getFutureWeatherData(true);          
        });
      }

      if(navigator.geolocation && document.domain == 'localhost') {
        //如果支持geolocation api 且本地运行，直接调用api
        navigator.geolocation.getCurrentPosition(function(position) {
          self.position = position;
          self.reqStatus = 'success';
          self.tips = '获取城市数据...';
          self.showTip = true;
          self.locaionLoadingText = '获取城市数据...';
          self.initMap();
        }, function(error) {
          handleError();
        });
      }else {
        handleError();
      }

    },

    initMap () {
      this.getFutureWeatherData();
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

    getFutureWeatherData (getByCity) {

      getByCity = getByCity || false;

      var self = this;

      AMap.service('AMap.Weather', function() {
          var weather = new AMap.Weather(),

            getLiveWeather = function(address) {
              self.weatherInfo.city = address;
              weather.getLive(self.weatherInfo.city, function(err, data) {
                  if (!err) {
                      self.tips = '获取成功 :)';
                      self.reqStatus = 'success';
                      self.isLoadLocation = false;

                      self.weatherInfo.city = data.city;
                      self.weatherInfo.weather = data.weather;
                      self.weatherInfo.temperature = data.temperature;
                      self.weatherInfo.windDirection = data.windDirection;
                      self.weatherInfo.windPower = data.windPower;

                      self.futureWeatherData.labels[0] = '今天';
                      self.futureWeatherData.datasets[0].data[0] = self.weatherInfo.temperature;

                      weather.getForecast(self.weatherInfo.city, function(err, data) {
                          if(err) {
                            self.tips = '获取失败，请重试 :(';
                            self.reqStatus = 'cancel';
                            return;
                          }

                          self.reqStatus = 'success';
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
                      self.tips = '获取失败，请重试 :(';
                      self.reqStatus = 'cancel';
                  }
              });

            };

          if(getByCity) {
            getLiveWeather(self.weatherInfo.city);
          }else {
            self.getAddressByCoords([self.position.coords.longitude, self.position.coords.latitude], getLiveWeather);
          }

      });

    },

    showAddrSelector () {
      this.showAddressSelector = true;
    },

    getAddressByCoords: function(lnglatXY, cb) {

      AMap.plugin('AMap.Geocoder', function(){
        //实例化Geocoder
        var geocoder = new AMap.Geocoder({
            city: "010"
        });

        geocoder.getAddress(lnglatXY, function(status, result) {
          if(status === 'complete' && result.info === 'OK') {
            if(cb) {
              cb(result.regeocode.addressComponent.city);
            }
          }else{
             //获取地址失败
            self.tips = '获取地址信息失败，请重试 :(';
            self.reqStatus = 'cancel';
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

.addrSelectorPopup {
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
  position: fixed;
  z-index: -1;
  width: 100%;
  height: calc(100vh + 180px);
}

.weather {
  font-size: .8em;
}

.weui-label {
  color: #000;
}

.vux-popup-picker-value {
  color: #000!important;
}

.repos {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: 0.3s;
  background-image: url('../assets/location.png');
}

.repos:hover {
  transform: scale(1.2);
}

</style>
