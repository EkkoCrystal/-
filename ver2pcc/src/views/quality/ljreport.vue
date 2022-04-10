<template>
  <div class="bgMain">
    <div class="my-card">
      <el-card>
        <div>
          <el-form
            v-model="form"
            :inline="true"
            size="small"
            label-width="100px"
          >
            <el-form-item label="项目类型:">
              <el-select
                v-model="form.itemCategory"
                placeholder="请选择"
                autocomplete
                class="search-item"
              >
                <el-option
                  v-for="item in testOptions"
                  :key="item.name"
                  :label="item.displayName"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="month" label="质控日期:">
              <el-date-picker
                v-model="form.month"
                type="month"
                class="search-item"
                placeholder="选择日期"
                format="yyyy-MM"
                value-format="yyyy-MM"
                :clearable="false"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">查询</el-button>
              <el-button v-print="'mjprintcontent'" type="primary">打印</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div id="mjprintcontent" style="width:1040px;margin:auto">
          <div style="padding:5px;text-align:center;font-size:16pt">
            {{ organizationName }}<BR />{{ lj.categoryDisplay }}质控曲线
            <el-divider />
          </div>
          <div style="padding:5px;font-size:10pt">

            <el-row>
              <el-col :span="12">
                <div>仪器编号：{{ id }}</div>
              </el-col>
              <el-col :span="12">
                <div style="text-align:right">质控日期:{{ form.month }}</div>
              </el-col>
            </el-row>
            <el-row v-for="item in lj.items" :key="item.reagentTypeDisplay" :gutter="1">
              <el-col :span="7">
                <div>本月{{ item.reagentTypeDisplay }}平均值：{{ item.x_c }}</div>
              </el-col>
              <el-col :span="7">
                <div>本月{{ item.reagentTypeDisplay }}SD值:{{ item.sd_c }}</div>
              </el-col>
              <el-col :span="7">
                <div>本月{{ item.reagentTypeDisplay }}CV:{{ item.cv_c }}%</div>
              </el-col>
            </el-row>
          </div>
          <div>
            <table border="1" style="width:100%;" class="table">
              <tr>
                <td style="width:60px">日期</td>
                <td v-for="(index,item) in days" :key="index">
                  {{ item+1 }}
                </td>
              </tr>
              <tr v-for="item in lj.items" :key="item.reagentType">
                <td>
                  {{ item.reagentTypeDisplay }}
                </td>
                <td v-for="t in item.values" :key="t.day">
                  <span v-if="t.testValue !== null">{{ t.testValue }}</span>
                </td>
              </tr>
              <tr v-if=" lj.items === undefined || !lj.items || lj.items.length===0">
                <td :colspan="days+1">暂时无数据</td>
              </tr>
              <tr v-if="lj.items !== undefined && lj.items !== null && lj.unit!==null && lj.unit!==undefined">
                <td :colspan="days+1">
                  <div class="table" style="text-align:left;margin:5px">数据单位:{{ lj.unit }}</div>
                </td>
              </tr>
            </table>
          </div>
          <div style="margin:20px;width:100%">
            <div
              ref="chart"
              style="width:100%;height:300px"
            />
          </div>
          <div style="padding:50px;text-align:center;color:red">
            {{ lj.message }}
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import moment from 'moment'
import { getTestItems } from '@/api/test'
import { ljReport } from '@/api/qc'
export default {
  name: 'LJReport',
  data () {
    return {
      form: {
        month: '',
        sn: '',
        itemCategory: 'GLU'
      },
      colors: ['#1A1AE6', '#42E61A', '#FF0033'],
      days: 30,
      // unit: '',
      // items: [],
      testOptions: [],
      // resultMessage: '',
      lj: {}
    }
  },

  computed: {
    ...mapGetters(['name', 'token', 'organizationName']),
    id () {
      return this.$route.query.id
    }
  },
  created () {
    this.initData()
    this.initOptions()
  },
  mounted () {
    this.query()
  },
  methods: {

    initData () {
      this.form.sn = this.$route.query.id
      this.form.month = moment().format('YYYY-MM')
      this.days = moment().daysInMonth()
    },
    initOptions () {
      getTestItems().then(res => {
        this.testOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
    },

    query () {
      const myChart = this.$echarts.init(this.$refs.chart)
      myChart.clear()
      this.lj = {}
      if (this.form.month === null) {
        Message.error('日期不能为空')
        return
      }
      this.days = moment(this.form.month).daysInMonth()
      ljReport(this.form).then(res => {
        // this.summary = res.dataContent
        // this.items = res.dataContent.items
        // this.unit = res.dataContent.unit
        // this.resultMessage = res.dataContent.message
        this.lj = res.dataContent
        if (this.lj.items !== null && this.lj.items !== undefined &&
        this.lj.items.length > 0) {
          const dataset = []
          const series = []
          for (let index = 0; index < this.lj.items.length; index++) {
            var element = this.lj.items[index]
            const c = this.getColor(element.reagentType)
            const data = []
            for (let k = 0; k < element.values.length; k++) {
              if (element.values[k].sdValue !== null) {
                data.push(element.values[k])
              }
            }
            dataset.push({
              source: data
            })
            series.push({
              name: element.reagentTypeDisplay,
              datasetIndex: index,
              type: 'line',
              symbol: 'emptyCircle', // 折点设定为实心点
              symbolSize: 10, // 设定实心点的大小
              // stack: '总量',
              itemStyle: {
                normal: {
                  color: c, // 改变折线点的颜色
                  lineStyle: {
                    // color: '#8cd5c2' // 改变折线颜色
                    color: c
                  }
                }
              },
              // xAxisIndex: 0,
              //  yAxisIndex: 0,
              encode: { x: 'day', y: 'sdValue' }
            })
          }
          this.drawChart(dataset, series, res.dataContent.message)
        }
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
      })
    },
    getColor (reagentType) {
      if (reagentType === 'First') {
        return '#1A1AE6'
      } else if (reagentType === 'Second') {
        return '#42E61A'
      } else if (reagentType === 'Third') {
        return '#FF0033'
      } else {
        return ''
      }
    },
    drawChart (data, series, title) {
      const myChart = this.$echarts.init(this.$refs.chart)

      myChart.setOption({
        legend: {},
        dataset: data,
        xAxis: [
          {
            type: 'value',
            // axisTick: { show: true },
            min: 1,
            max: 31,
            interval: 1,
            show: true
          }
        ],
        yAxis: [
          {
            type: 'value',
            gridIndex: 0,
            min: -6,
            max: 6
            // scale: true
            // max: (value) => {
            //   return value.max + 3
            // },
            // min: (value) => {
            //   return value.min - 3
            // }
            // axisLine: { onZero: false },
            // axisTick: { show: true }
          }
          // { type: 'value', gridIndex: 1 }
        ],
        series: series,
        // series: [
        //   {
        //     type: 'line',
        //     xAxisIndex: 0,
        //     yAxisIndex: 0,
        //     encode: { x: 'day', y: 'sdValue' }
        //   }
        // ],
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            // console.log(params)
            let showHtm = '  '
            showHtm = params.seriesName + ':&nbsp;&nbsp;' + params.data.sdValue + '<BR>'
            // for (let i = 0; i < params.length; i++) {
            //   if (params[i].data.sdValue !== null) {
            //     showHtm = params[i].seriesName + ':&nbsp;&nbsp;' + params[i].data.sdValue + '<BR>'
            //   }
            // }
            // const testTime = moment(data.testTime).format('HH:MM')
            // const testValue = data.testValue
            // const period = data.periodName
            // // showHtm += '检测日期:' + testTime + '<BR>' + '检测时段:' + period + '<BR>检测结果:' + testValue + '<br>'
            // showHtm = testTime + '&nbsp;&nbsp;' + testValue + '(' + period + ')'
            //  console.log(showHtm)

            return showHtm
          }

          // axisPointer: {
          //   type: 'cross'
          // }
        }
      })
    }
  }
}
</script>

<style scoped>
.bgMain {
  width: 1280px;
  height: 100%;
  background: #f2f2f2f2;
}
.my-card {
  padding: 20px 100px 50px 100px;
  width: 100%;
  height: 100%;
}
table {
  border: 1px solid #ddd;
  border-collapse: collapse;
  font-size:8px;
  text-align: center;
}
td {
  padding: 2px 2px;
  text-align: center;
  color: #333;
  border: 1px solid #ddd;
  border-collapse: collapse;
  background-color: #fff;
  font-size:7px
}

.el-row{
  margin-top:5px;
}
</style>
