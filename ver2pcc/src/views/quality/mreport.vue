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
              <el-button v-print="'#mprintContent'" type="primary">打印</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div id="mprintContent" style="margin:auto;width:1060px">
          <div style="text-align:center;font-size:16pt;padding:10px">
            {{ organizationName }}<BR />{{ qc.categoryDisplay }}质控月报
          </div>
          <div>

            <table border="1" style="width:100%;padding:5px" class="table">
              <tr>
                <td colspan="32" align="center">
                  质控图表
                </td>
              </tr>

              <tr>
                <td colspan="8">
                  医院
                </td>
                <td colspan="8">
                  {{ qc.tenant }}
                </td>
                <td colspan="8">
                  科室
                </td>
                <td colspan="8">
                  {{ qc.department }}
                </td>

              </tr>
              <tr>
                <td colspan="8">
                  厂商
                </td>
                <td colspan="8">
                  {{ qc.manufactor }}
                </td>
                <td colspan="8">
                  仪器编号
                </td>
                <td colspan="8">
                  {{ qc.sn }}
                </td>

              </tr>

              <tr>
                <td colspan="32">
                &nbsp;
                </td>
              </tr>
              <tr>
                <td colspan="8">
                  本月质控结果
                </td>
                <td colspan="8">
                  均值(X)
                </td>
                <td colspan="8">
                  标准偏差
                </td>
                <td colspan="8">
                  变异系数%
                </td>
              </tr>
              <tr v-for="item in items" :key="item.reagentTypeDisplay">
                <td colspan="8">
                  {{ item.reagentTypeDisplay }}
                </td>
                <td colspan="8">
                  {{ item.x }}
                </td>
                <td colspan="8">
                  {{ item.sd }}
                </td>
                <td colspan="8">
                  {{ item.cv }}
                </td>

              </tr>
              <tr>
                <td colspan="32">
                &nbsp;
                </td>
              </tr>
              <tr>
                <td colspan="32" />
              </tr>
            </table>

            <table border="1" style="width:100%;font-size:7px;padding:5px" class="table">
              <tr>
                <td>日期</td>
                <td v-for="(index,item) in days" :key="index">
                  {{ item+1 }}
                </td>
              </tr>
              <tr v-for="item in items" :key="item.reagentType">
                <td>
                  {{ item.reagentTypeDisplay }}
                </td>
                <td v-for="t in item.values" :key="t.day">

                  <span v-if="t.testValue !== null">
                    <span :class="analyseClass(t.isPassed)"> {{ t.testValue }}</span>
                  </span>

                </td>

              </tr>
              <tr v-if=" items === undefined || !items || items.length===0">
                <td :colspan="days+1">暂时无数据</td>
              </tr>
              <tr v-if="unit!==null && unit!==undefined">
                <td :colspan="days+1">
                  <div class="table" style="text-align:left;margin:5px">数据单位:{{ unit }}</div>
                </td>
              </tr>
            </table>
          </div>

          <div style="width:100%">
            <div v-for="c in charts" :key="c.key">

              <div
                v-show="c.show"
                :id="c.name"
                style="width:100%;height:300px;padding:5px"
              />

            </div>
            <!-- <div

              ref="chartTrend1"
              style="width:100%;height:300px"
            />
            <div

              ref="chartTrend2"
              style="width:100%;height:300px"
            />
            <div

              ref="chartTrend3"
              style="width:100%;height:300px"
            /> -->
          </div>

        </div>

      </el-card>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { qcMonthReport } from '@/api/qc'
import { getTestItems } from '@/api/test'
import { Message } from 'element-ui'
export default {
  name: 'MReport',
  data () {
    return {
      form: {
        month: '',
        sn: '',
        itemCategory: 'GLU'

      },
      testOptions: [],
      days: 30,
      unit: '',
      qc: {},
      items: [],
      charts: [
        {
          key: 'First',

          min: 0,
          max: 6,
          name: 'chartTrend1',

          show: true
        },
        {
          key: 'Second',
          min: 0,
          max: 18,
          name: 'chartTrend2',

          show: true
        },
        {
          key: 'Third',
          min: 0,
          max: 1190,
          name: 'chartTrend3',

          show: true
        }
      ]

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
    // this.initChartSettings()
    this.query()
  },
  methods: {

    initData () {
      this.form.sn = this.$route.query.id
      this.form.month = moment().format('YYYY-MM-DD')
      this.days = moment().daysInMonth()
    },

    initOptions () {
      getTestItems().then(res => {
        this.testOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
    },

    initChartSettings () {
      this.charts = [

      ]
    },
    query () {
      console.log(this.form)
      console.log('this.form')

      if (this.form.month === null) {
        Message.error('日期不能为空')
        return
      }
      console.log(moment(this.form.month).daysInMonth())
      console.log('zzzzzzzzzzzzz')

      this.days = moment(this.form.month).daysInMonth()
      this.clearChart()
      console.log('tttttttttttttttttttttttt')

      qcMonthReport(this.form).then(res => {
        console.log(res)
        console.log('wwwwwwwwwwwwwwwww')
        this.qc = res.dataContent
        this.items = res.dataContent.result
        this.unit = res.dataContent.unit

        if (this.items !== null && this.items !== undefined &&
        this.items.length > 0) {
          for (let i = 0; i < this.charts.length; i++) {
            this.charts[i].show = false
            for (let j = 0; j < this.items.length; j++) {
              if (this.charts[i].key === this.items[j].reagentType) {
                const data = this.items[j].values.filter(k => {
                  return k.testValue !== null
                })

                this.charts[i].show = true

                this.$nextTick(() => {
                  this.drawChart(this.items[j].reagentTypeDisplay, this.charts[i], data, this.unit)
                })
              }
            }
          }
        }
      }).catch(err => {
        Message.error(err.message)
      })
    },

    clearChart () {
      console.log(this.charts)
      console.log('ccccccccccccccccccccccccc')

      for (var i = 0; i < this.charts.length; i++) {
        const myChartDay = this.$echarts.init(document.getElementById(this.charts[i].name))
        console.log(myChartDay)

        console.log('kkkkkkkkkkkkkkkkk')
        if (myChartDay !== undefined && myChartDay !== null) {
          console.log('7878787878')
          myChartDay.clear()
          //  myChartDay.resize()
        }
      }
    },
    drawChart (title, chartSetting, data, unit) {
      const myChartDay = this.$echarts.init(document.getElementById(chartSetting.name))
      myChartDay.setOption({
        title: {
          text: title,
          left: 'center',
          padding: 10
        },
        dataset: {
          // 提供一份数据。
          source: data
        },
        xAxis: [
          {
            type: 'value',

            // axisTick: { show: true },
            min: 1,
            max: 31,
            interval: 1
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '单位：' + unit,
            gridIndex: 0,
            max: (value) => {
              return value.max + 5
            },
            min: chartSetting.min,
            axisLine: { onZero: false },
            axisTick: { show: true }
          }
        ],
        series: [
          {
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            encode: { x: 'day', y: 'testValue' }
          }
        ],
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let showHtm = ''
            if (params.length > 0) {
              const data = params[0].data
              // console.log(data)
              showHtm = '检测日期：' + data.testDate + '<BR>' + '检测结果:' + data.testValue
            }
            return showHtm
          }
        }
      })
    },
    analyseClass (isPass) {
      if (isPass) {
        return 'pass'
      } else {
        return 'no-pass'
      }
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
  padding: 20px 80px 50px 80px;
  width: 100%;
  height: 100%;
}
table {
  border: 1px solid #ddd;
  border-collapse: collapse;
  font-size:10px;
  text-align: center;
}
td {
  padding: 8px 6px;
  text-align: center;
  color: #333;
  border: 1px solid #ddd;
  border-collapse: collapse;
  background-color: #fff;
  font-size:7px
}
.pass{
  color:green
}
.no-pass{
  color:red
}
</style>
