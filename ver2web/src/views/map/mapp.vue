<template>
  <div>
    <el-row>
      <!-- <el-col :span="12">
        <el-card :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>风险区域人数统计</span>
          </div>
          <div ref="echartsOnee" style="width:100%;height:700px;" />
        </el-card>
      </el-col> -->
      <el-col :span="24">
        <el-card :body-style="{ padding: '0px' }">
          <div slot="header">
            <span id="myOneLine">个人轨迹</span>
            <span id="myTwoLine">{{ mySa }}}}</span>

          </div>
          <div ref="mapDiv">
            <baidu-map
              class="bm-view"
              :center="mapCenter"
              :zoom="mapZoom"
              style="width:100%;height:700px;"
              @ready="handler"
            >
              <!-- <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" /> -->

              <!-- <bm-driving start="艾康生物技术" end="西溪银泰" :panel="false" :auto-viewport="true" @searchcomplete="handleSearchComplete" /> -->
              <!-- <bml-lushu
                :path="path"
                :icon="icon"
                :play="play"
                :rotation="true"
                @stop="reset"
              /> -->
              <!-- 驾驶路线 -->
              <!-- <bm-driving
                start="新街口"
                end="新街口"
                start-city="北京"
                end-city="南京"
                :auto-viewport="true"
                :waypoints="['呼和浩特', {lng: 112.53, lat: 37.87}, '陕西兵马俑']"
              /> -->
              <!-- 划弧线 -->
              <bml-curve-line
                :points="points"
                stroke-color="red"
                stroke-weight="5"
                stroke-opacity="0.5"
                stroke-style="solid"
                :clicking="strokeClick"
                :editing="false"
                @lineupdate="update"
              />
            </baidu-map>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import moment from 'moment'
import { mapGetters } from 'vuex'
import china from '@/views/map/json/china.json'
// import { BmlMarkerClusterer } from 'vue-baidu-map'
// import { BmlLushu } from 'vue-baidu-map'
import { BmlCurveLine } from 'vue-baidu-map'
// import { Message } from 'element-ui'
// import '../../node_modules/echarts/map/js/china.js' // 引入中国地图数据
export default {
  name: 'Mapp',
  components: {
    BmlCurveLine
  },
  data () {
    return {
      tableData: [],
      mapCenter: { lng: 0, lat: 0 },
      mapZoom: 3,
      play: true,
      path: [],
      icon: {
        url: 'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
        size: { width: 52, height: 26 },
        opts: { anchor: { width: 27, height: 13 } }
      },
      mySa: '',
      points: [
        { lng: 116.432045, lat: 39.910683 },
        { lng: 120.129721, lat: 30.314429 },
        { lng: 121.491121, lat: 25.127053 }
      ],
      dataList: [
        { name: '南海诸岛', value: 0 },
        { name: '北京', value: this.randomValue() },
        { name: '天津', value: this.randomValue() },
        { name: '上海', value: this.randomValue() },
        { name: '重庆', value: this.randomValue() },
        { name: '河北', value: this.randomValue() },
        { name: '河南', value: this.randomValue() },
        { name: '云南', value: this.randomValue() },
        { name: '辽宁', value: this.randomValue() },
        { name: '黑龙江', value: this.randomValue() },
        { name: '湖南', value: this.randomValue() },
        { name: '安徽', value: this.randomValue() },
        { name: '山东', value: this.randomValue() },
        { name: '新疆', value: this.randomValue() },
        { name: '江苏', value: this.randomValue() },
        { name: '浙江', value: this.randomValue() },
        { name: '江西', value: this.randomValue() },
        { name: '湖北', value: this.randomValue() },
        { name: '广西', value: this.randomValue() },
        { name: '甘肃', value: this.randomValue() },
        { name: '山西', value: this.randomValue() },
        { name: '内蒙古', value: this.randomValue() },
        { name: '陕西', value: this.randomValue() },
        { name: '吉林', value: this.randomValue() },
        { name: '福建', value: this.randomValue() },
        { name: '贵州', value: this.randomValue() },
        { name: '广东', value: this.randomValue() },
        { name: '青海', value: this.randomValue() },
        { name: '西藏', value: this.randomValue() },
        { name: '四川', value: this.randomValue() },
        { name: '宁夏', value: this.randomValue() },
        { name: '海南', value: this.randomValue() },
        { name: '台湾', value: this.randomValue() },
        { name: '香港', value: this.randomValue() },
        { name: '澳门', value: this.randomValue() }
      ]

    }
  },
  computed: {
    ...mapGetters(['name', 'token'])
  },
  mounted () {
    // this.drawBarChart(this.lineOneData, this.$refs.echartsOnee)
  },
  created () {
    this.loadDat()
  },
  methods: {
    randomValue () {
      return Math.round(Math.random() * 1000)
    },
    loadDat () {
      this.$echarts.registerMap('china', china)
    },
    // echart地图
    drawBarChart (dataArr, myRef) {
      const myChartDay = this.$echarts.init(myRef)
      myChartDay.setOption({
        tooltip: {
          trigger: 'item'

        },
        visualMap: {
          min: 0,
          max: 1500,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          inRange: {
            color: ['#e0ffff', '#006edd']
          },
          show: true
        },
        label: {
          normal: { show: true },
          emphasis: { show: true }
        },
        geo: {
          map: 'china',
          roam: false,
          zoom: 1.23,
          label: {
            normal: {
              show: true,
              fontSize: '10',
              color: 'rgba(0,0,0,0.7)'
            }
          },
          itemStyle: {
            normal: {
              borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
              areaColor: '#F3B329',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        series: [{
          name: '信息量',
          type: 'map',
          geoIndex: 0,
          data: this.dataList
        }]
      })
    },
    update (e) {
      console.log(e)
      console.log('--------------')
      this.points = e.target.cornerPoints
    },
    // 百度地图
    handler ({ BMap, map }) {
      console.log(BMap, map)
      console.log('999999999999999999')
      // this.mapCenter = BMap.ce
      this.mapCenter.lng = 116.301934
      this.mapCenter.lat = 39.977552
      this.mapZoom = 15
      // 规划路线
      // var p1 = new BMap.Point(116.301934, 39.977552)
      // var p2 = new BMap.Point(116.508328, 39.919141)

      // this.drawRoadLine({ BMap, map }, p1, p2)
    },
    strokeClick () {
      console.log('==')
    },
    // 纯js写法，非组件写法
    drawRoadLine ({ BMap, map }, start, end) {
      // 清楚地图上所有覆盖物
      // map.clearOverlays()
      const diving = new BMap.DrivingRoute(map, {
        renderOptions: {
          map: map,
          panel: 'myLine',
          // 起终点可进行拖拽
          enableDragging: true,
          // 线路绘制后自动调整地图视野层级
          autoViewport: true
        },
        // 驾驶策略
        policy: 'BMAP_DRIVING_POLICY_DEFAULT',
        onSearchComplete: (result) => {
          const plan = result.getPlan(0)
          if (plan) {
            var ss = []
            // 获取线路上所有关键坐标点
            for (let index = 0; index < plan.getNumRoutes().length; index++) {
              // 返回方案包含的线路的个数
              // const element+ = plan.getNumRoutes()
              const route = plan.getRoute(index)
              // 返回路线的地理坐标点数组
              ss = ss.concat(route.getPath())
            }
            // 获取总公里数
            var dis = plan.getDistance(false)
            // /获取总耗时
            var t = plan.getDuration(false)
            this.mySa = '距离：' + ((dis / 1000).toFixed(2)) + '总耗时：' + ((t / 3600).toFixed(2))
          }
        },
        onPolylinesSet: function (routes) {
          // 设置线条样式，线路分为几段
          for (var i = 0; i < routes.length; i++) {
            routes[i].getPolyline().setStrokeWeight(8)
            routes[i].getPolyline().setStrokeOpacity(1)
            routes[i].getPolyline().setStrokeColor('#5298ff')
          }
        },
        onMarkersSet: (pois) => {
          console.log('-----------------------------')

          console.log(pois)
          console.log('-----------------------------')
          // 清除原有标注
          // routes[0] 是起点
          // routes[routes.length-1] 是终点
          // routes[i].Um 是途经点
          for (var i = 0; i < pois.length; i++) {
            if (i === 0 || i === pois.length - 1) {
              map.removeOverlay(pois[i].marker)
            } else {
              map.removeOverlay(pois[i].Um)
            }
          }
          // // 调用添加自定义标注方法，实现禁止标注拖拽
          // this.addMarker(BMap, map, start, '起点', '<%=basePath%>/images/icon-mapStart.png')
          // this.addMarker(BMap, map, end, '终点', '<%=basePath%>/images/icon-mapEnd.png')
          // for (var j = 0; j < wayPoints.length; j++) {
          //   this.addMarker(BMap, map, wayPoints[i], '途', '<%=basePath%>/images/icon-mapOn.png')
          // }
        }
      })
      // 发起检索
      diving.search(start, end)
    }
    /*
**point：添加标注的点
**name：标注名称（这里没用到）
** imgUrl:自定义标注图标地址
*/
    // addMarker (BMap, map, point, name, imgUrl) {
    //   var myIcon = new BMap.Icon(imgUrl, new BMap.Size(30, 42))// 添加自定义图标
    //   myIcon.setImageSize(new BMap.Size(30, 42))// 设置图标大小
    //   var marker = new BMap.Marker(point, { icon: myIcon })
    //   marker.disableDragging()// 禁止拖拽
    //   map.addOverlay(marker)
    // },
    // reset () {
    //   this.play = false
    // },
    // handleSearchComplete (res) {
    //   this.path = res.getPlan(0).getRoute(0).getPath()
    // }
  }
}

</script>

<style>

</style>
