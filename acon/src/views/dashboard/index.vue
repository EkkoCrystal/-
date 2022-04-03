<template>
  <div style="background-color: #F0F3F5">
    <!-- head -->
    <el-row>
      <el-col :span="12">
        <div class="leftNum">
          <span class="titleNum">现有阳性</span>
          <span v-if="totalObj.totalCount !== null" class="numNum">{{ totalObj.totalCount }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="rightNum">
          <span class="titleNum">昨日新增</span>
          <span v-if="totalObj.dayCount !== null" class="numNum">{{ totalObj.dayCount }}</span>
        </div>
      </el-col>
    </el-row>
    <!-- barline -->
    <el-row :xs="24" :sm="24" style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col>
        <el-card>
          <div slot="header" style="display: flex; justify-content: space-between">
            <span type="text" style="line-height:40px">阳性增长趋势</span>
            <el-radio-group v-model="tabPosition" @change="radioHandle">
              <el-radio-button label="left">近60日</el-radio-button>
              <el-radio-button label="middle">近30日</el-radio-button>
              <el-radio-button label="right">近7日</el-radio-button>
            </el-radio-group>
          </div>
          <div>
            <line-chart :chart-data="lineChartData" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="margin: 0px 20px" :xs="24" :sm="24">
        <el-card :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>疫情地图</span>
          </div>
          <map-chart :chart-data="areaData" />
          <!-- <div ref="echartsOnee" style="width:100%;height:700px;" /> -->
        </el-card>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" :gutter="15">
      <el-col :span="12" style="margin: 30px 10px 20px 20px">
        <el-card :body-style="{ padding: '0px' }">
          <div slot="header" style="text-align: center">
            <span>现有阳性分布</span>
          </div>
          <bar-chart :chart-data="totalAreaSumData" style="margin-left: 15px" />
        </el-card>
      </el-col>
      <el-col :span="12" style="margin: 30px 10px 20px 10px">
        <el-card :body-style="{ padding: '0px' }">
          <div slot="header" style="text-align: center">
            <span>昨日新增分布</span>
          </div>
          <bar-chart :chart-data="dayAreaSumData" style="margin-left: 15px" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LineChart from './components/LineChart'
import MapChart from './components/MapChart'
import BarChart from './components/BarChart.vue'
import { getTotalCount, getDayTrend, getTotalAreaSummary, getDayAreaSummary } from '@/api/user'
import moment from 'moment'
import { mapGetters } from 'vuex'
// import china from '@/views/dashboard/json/china.json'
// import hangzhou from '@/views/dashboard/json/province/hangzhou.json'
import tongweixian from '@/views/dashboard/json/province/tongweixian.json'

import { Message } from 'element-ui'
// import '../../node_modules/echarts/map/js/china.js' // 引入中国地图数据
export default {
  components: {
    LineChart,
    MapChart,
    BarChart
  },
  data () {
    return {
      totalObj: {
        totalCount: null,
        dayCount: null
      },
      myIcon: null,
      tabPosition: 'right',
      trendDay: 7,
      lineChartData: {},
      tableData: [],
      areaData: [],
      totalAreaSumData: {},
      dayAreaSumData: {},
      ffheight: ''

    }
  },
  computed: {
    ...mapGetters(['name', 'token'])
  },
  mounted () {

  },
  created () {
    this.initData()
    this.loadDat()
  },
  methods: {
    initData () {
      getTotalCount().then(res => {
        if (res.dataContent !== null) {
          this.totalObj = res.dataContent
        }
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
      // 趋势
      this.getTrendLine()
      // 地图统计
      getTotalAreaSummary().then(res => {
        if (res.dataContent !== null) {
          this.handleAreaData(res.dataContent)
          this.handleDaySumData(res.dataContent, true)
        }
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
      // 分布
      getDayAreaSummary().then(res => {
        if (res.dataContent !== null) {
          this.handleDaySumData(res.dataContent, false)
        }
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },
    getTrendLine () {
      getDayTrend(this.trendDay).then(res => {
        if (res.dataContent !== null) {
          // 处理数据
          this.handleTrend(res.dataContent)
        }
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },
    handleTrend (data) {
      this.lineChartData = []
      const xData = []
      const yData = []
      data.forEach(element => {
        xData.push(moment(element.day).format('MM-DD'))
        yData.push(element.count)
      })
      this.lineChartData = {
        expectedData: xData,
        actualData: yData
      }
    },
    handleAreaData (data) {
      this.areaData = []
      const pp = []
      data.forEach(element => {
        var json = {}
        json.name = element.county
        json.value = element.count
        pp.push(json)
      })
      this.areaData = pp
    },
    handleDaySumData (data, isTrue) {
      if (isTrue) {
        this.totalAreaSumData = {}
      } else {
        this.dayAreaSumData = {}
      }
      const xData = []
      const yData = []
      data.forEach(element => {
        xData.push(element.count)
        yData.push(element.county)
      })

      if (isTrue) {
        this.totalAreaSumData = {
          barColor: '#E93132',
          expectedData: xData,
          actualData: yData
        }
      } else {
        this.dayAreaSumData = {
          barColor: '#FF6956',
          expectedData: xData,
          actualData: yData
        }
      }
    },
    radioHandle (val) {
      this.tabPosition = val
      if (this.tabPosition === 'left') {
        this.trendDay = 60
      } else if (this.tabPosition === 'middle') {
        this.trendDay = 30
      } else {
        this.trendDay = 7
      }
      this.getTrendLine()
    },
    // randomValue () {
    //   return Math.round(Math.random() * 50)
    // },
    loadDat () {
      this.$echarts.registerMap('tongweixian', tongweixian)
    }

  }
}
</script>

<style scoped>
.leftNum {
  height: 90px;
  text-align: center;
  background-color: white;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 20px;
}
.leftNum span {
  display: block;
  width: 100%;
  height: 30px;
}
.leftNum .titleNum {
  color: #333333;
  font-size: 16px;
}
.leftNum .numNum {
  color: #FF6956;
  font-size: 20px;
}
.rightNum {
  height: 90px;
  text-align: center;
  background-color: white;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 20px 20px 0px;
}
.rightNum span {
  display: block;
  width: 100%;
  height: 30px;
}
.rightNum .titleNum {
  color: #333333;
  font-size: 16px;
}
.rightNum .numNum {
  color: #FF6956;
  font-size: 20px;
}
</style>
