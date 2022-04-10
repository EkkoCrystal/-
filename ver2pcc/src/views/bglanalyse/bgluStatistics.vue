<template>
  <div>
    <el-card>
      <el-form ref="conditionForm" v-model="conditionForm" :inline="true" size="small" label-width="100px">
        <el-row>
          <el-col>
            <el-form-item label="科室:">
              <div style="width:200px;height:32px">
                <my-treeselect :append-true="true" :mydata="deptOptions" :valuebb="departDefaultCodes" @changeSel="changeDepentSelHandle" @inputChanging="inoutDepentChangeHandle" />
              </div>
            </el-form-item>
            <el-form-item prop="beginDate" label="年份:">
              <el-date-picker
                v-model="conditionForm.begDate"
                type="year"
                class="search-item"
                placeholder="选择日期"
                format="yyyy"
                value-format="yyyy-MM-dd"
                @change="selectedDateHandle"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="margin-left:20px" @click="onSearch">查询</el-button>
              <el-button ref="dPrint" v-print="bgluAllChartsObj" type="primary" style="margin-left:20px;" @click="printBluCharts">打印</el-button>
              <el-button type="primary" style="margin-left:20px" @click="exportHandle">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div id="bgluAllCharts" class="haha" style="height:100%;width:100%">
      <el-card>
        <div>
          <h5 v-if="isShowTitle" class="chart-title" style="text-align: center;font-size: 16px;color: #333333;margin: 0px 0 15px 0;font-weight: bold;">{{ bgluTitle }}</h5>
        </div>
        <!-- 低血糖 -->
        <div style="margin:20px 0 100px 0">
          <div>
            <div
              ref="lowbgluChart"
              style="width:740px;height:260px;margin:5px auto 0"
            />
            <!-- <template>
              <el-table
                :data="transLowData"
                border
                style="width:800px;margin:0 auto"
                class="hahaTable"
                :cell-style="{ fontSize: '12px', padding:'0.1px 0.1px', height: '20px' }"
                :header-cell-style="{ background: '#c6d2e1', color: '#303843', fontSize: '12px', padding:'2px 0' }"
              >
                <el-table-column v-for="(item, index) in transTitle" :key="index" :label="item" align="center" :min-width="cellWidth(index)">
                  <template slot-scope="scope">
                    <span class="verticalAlign">{{ scope.row[index] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template> -->
            <table class="dataTablee" style="width:740px;height:125px;margin:0 auto">
              <tr>
                <th v-for="(item, index) in transTitle" :key="index" style="border:1px solid gray">{{ item }}</th>
              </tr>
              <tr v-for="(item, index) in transLowData" :key="index">
                <td v-for="(hh, i) in item" :key="i">{{ hh }}</td>
              </tr>
            </table>
          </div>
        </div>
        <!-- 高血糖 -->
        <div style="margin:30px 0 100px 0">
          <div>
            <div
              ref="heighBgluChart"
              style="width:740px;height:260px;margin:30px auto 0"
            />
            <!-- <template>
              <el-table
                :data="transHeighData"
                border
                style="width:740px;margin:0 auto"
                class="hahaTable"
                :cell-style="{ fontSize: '8px', padding:'2px 0' }"
                :header-cell-style="{ background: '#c6d2e1', color: '#303843', fontSize: '9px', padding:'2px 0' }"
              >
                <el-table-column v-for="(item, index) in transTitle" :key="index" :label="item" align="center" :min-width="cellWidth(index)">
                  <template slot-scope="scope">
                    <span class="verticalAlign">{{ scope.row[index] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template> -->
            <table class="dataTablee" style="width:740px;height:125px;margin:0 auto">
              <tr>
                <th v-for="(item, index) in transTitle" :key="index" style="border:1px solid gray">{{ item }}</th>
              </tr>
              <tr v-for="(item, index) in transHeighData" :key="index">
                <td v-for="(hh, i) in item" :key="i">{{ hh }}</td>
              </tr>
            </table>
          </div>
        </div>
        <!-- 异常血糖次数 -->
        <div style="margin:30px 0 100px 0">
          <div>
            <div
              ref="personBgluChart"
              style="width:740px;height:260px;margin:30px auto 0"
            />
            <!-- <template>
              <el-table
                :data="transPersonData"
                border
                style="width:700px;margin:0 auto"
                class="hahaTable"
                :cell-style="{ fontSize: '8px', padding:'2px 0' }"
                :header-cell-style="{ background: '#c6d2e1', color: '#303843', fontSize: '9px', padding:'2px 0' }"
              >
                <el-table-column v-for="(item, index) in transTitle" :key="index" :label="item" align="center" :min-width="cellWidth(index)">
                  <template slot-scope="scope">
                    <span class="verticalAlign">{{ scope.row[index] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template> -->
            <table class="dataTablee" style="width:740px;height:125px;margin:0 auto">
              <tr>
                <th v-for="(item, index) in transTitle" :key="index" style="border:1px solid gray">{{ item }}</th>
              </tr>
              <tr v-for="(item, index) in transPersonData" :key="index">
                <td v-for="(hh, i) in item" :key="i">{{ hh }}</td>
              </tr>
            </table>

          </div>
        </div>
        <!-- 达标比例 -->
        <div style="margin:30px 0 100px 0">
          <div>
            <div
              ref="standBgluChart"
              style="width:740px;height:260px;margin:30px auto 0"
            />
            <!-- <template>
              <el-table
                :data="transStanData"
                border
                style="width:700px;margin:0 auto"
                class="hahaTable"
                :cell-style="{ fontSize: '8px', padding:'2px 0' }"
                :header-cell-style="{ background: '#c6d2e1', color: '#303843', fontSize: '9px', padding:'2px 0' }"
              >
                <el-table-column v-for="(item, index) in transTitle" :key="index" :label="item" align="center" :min-width="cellWidth(index)">
                  <template slot-scope="scope">
                    <span class="verticalAlign">{{ scope.row[index] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template> -->
            <table class="dataTablee" style="width:740px;height:125px;margin:0 auto">
              <tr>
                <th v-for="(item, index) in transTitle" :key="index" style="border:1px solid gray">{{ item }}</th>
              </tr>
              <tr v-for="(item, index) in transStanData" :key="index">
                <td v-for="(hh, i) in item" :key="i">{{ hh }}</td>
              </tr>
            </table>

          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getDepartments } from '@/api/user'
import { gluYearAnalysisData, exportBlgData } from '@/api/analyse'
import { Message } from 'element-ui'
import moment from 'moment'
import { export_json_to_excel } from '@/vendor/Export2Excel'
import MyTreeselect from '@/components/common/MyTreeselect.vue'
// import html2canvas from 'html2canvas'
// import printJS from 'print-js'
export default {
  inject: ['reload'],
  name: 'BgluStatistics',
  components: { MyTreeselect },
  data () {
    return {
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      loading: false,
      // 默认值
      departDefaultCodes: null,
      conditionForm: {
        departmentCode: '',
        departmentName: '',
        begDate: moment(new Date()).format('yyyy-MM-DD')

      },
      tableData: [],
      printTableData: [],
      yearData: '',
      personCount: [],
      lowCount: [],
      lowRate: 1,
      highCount: [],
      standardsCount: [],

      transLowData: [],
      transHeighData: [],
      transPersonData: [],
      transStanData: [],
      lowDataTitle: ['测量次数', '低血糖次数', '危机低值次数', '低血糖比例', '危机低值比例'],
      heighDataTitle: ['测量次数', '高血糖次数', '危机高值次数', '高血糖比例', '危机高值比例'],
      personDataTitle: ['测量人数', '低血糖人数', '高血糖人数', '低血糖人数比例', '高血糖人数比例'],
      standardsDataTitle: ['测量次数', '达标次数', '未达标次数', '达标比例', '未达标比例'],
      transTitle: ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

      excelData: {},
      bgluTitle: '',
      isShowTitle: false,
      bgluAllChartsObj: {
        id: 'bgluAllCharts',
        popTitle: '血糖统计分析表',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>,<style> #bgluAllCharts { height: auto !important; } <style>',
        beforeOpenCallback (vue) {
          vue.printLoading = true
          vue.isShowTitle = true
        },
        openCallback (vue) {
          vue.printLoading = false
          vue.isShowTitle = true
        },
        closeCallback (vue) {
          vue.isShowTitle = false
        }
      }
    }
  },
  computed: {
    ...mapGetters([

      'avatar',
      'organizationName',
      'departmentCode',

      'departmentName',
      'token'
    ])

  },
  created () {
    this.initOptions()
    this.initData()
  },
  mounted () {
    this.onSearch()
  },
  methods: {
    cellWidth (index) {
      return index === 0 ? 90 : 60
    },
    // 添加标题
    printBluCharts () {
      this.isShowTitle = true
    },
    initData () {
      this.conditionForm.departmentCode = this.departmentCode
      this.conditionForm.departmentName = this.departmentName
    },
    initOptions () {
      getDepartments().then(res => {
        // 默认值
        if (this.departmentCode !== null && this.departmentCode !== '') {
          this.departDefaultCodes = []
          this.departDefaultCodes.push(this.departmentCode)
        } else {
          this.departDefaultCodes = null
        }
        this.conditionForm.departmentCode = this.departmentCode
        this.deptOptions = res.dataContent
        // this.onSearch()
      }).catch(err => {
        console.log(err)
      })
    },
    changeDepentSelHandle (val) {
      this.handleNodeClear()
      this.conditionForm.departmentCode = val.id
    },
    inoutDepentChangeHandle (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleNodeClear()
      }
    },
    handleNodeClear () {
      this.conditionForm.departmentCode = null
    },
    selectedDateHandle (val) {
      this.query()
    },
    onSearch () {
      this.query()
    },
    query () {
      if (this.conditionForm.begDate === null) {
        Message.error('查询日期必须输入')
        return
      }
      gluYearAnalysisData(this.conditionForm).then(res => {
        this.yearData = res.dataContent.year
        this.bgluTitle = this.conditionForm.departmentName + this.yearData + '年血糖统计分析表'
        this.lowCount = res.dataContent.lowCount
        this.personCount = res.dataContent.personCount
        this.highCount = res.dataContent.highCount
        this.standardsCount = res.dataContent.standardsCount
        this.transLowData = this.handleAllData(res.dataContent.lowCount, this.lowDataTitle, 1)
        this.transHeighData = this.handleAllData(res.dataContent.highCount, this.heighDataTitle, 2)
        this.transPersonData = this.handleAllData(res.dataContent.personCount, this.personDataTitle, 3)
        this.transStanData = this.handleAllData(res.dataContent.standardsCount, this.standardsDataTitle, 4)

        this.drawLowChart()
        this.drawHeighChart()
        this.drawStandardsChart()
        this.drawPersonChart()
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
        this.loading = false
      })
    },
    handleAllData (data, titleArr, num) {
      // 数组按矩阵思路, 变成转置矩阵
      if (data === undefined || data === null || data.length <= 0) {
        return
      }
      const matrixData = data.map((row) => {
        const arr = []
        for (const key in row) {
          if (key !== 'month') {
            if (key.includes('Rate')) {
              arr.push((row[key] * 100).toFixed(2) + '%')
            } else {
              arr.push(row[key])
            }
          }
        }
        return arr
      })
      // 加入标题拼接最终的数据
      const transData = matrixData[0].map((col, i) => {
        return [titleArr[i], ...matrixData.map((row) => {
          return row[i]
        })]
      })
      return transData
    },
    drawLowChart () {
      const myChart = this.$echarts.init(this.$refs.lowbgluChart)
      myChart.setOption({
        color: ['#54aaff', '#0054a7'],
        dataset: {
          // 提供一份数据。
          source: [
            ['type', '低血糖比例', '危机低值比例'],
            ['01月', this.lowCount[0].lowRate, this.lowCount[0].criticalLowRate],
            ['02月', this.lowCount[1].lowRate, this.lowCount[1].criticalLowRate],
            ['03月', this.lowCount[2].lowRate, this.lowCount[2].criticalLowRate],
            ['04月', this.lowCount[3].lowRate, this.lowCount[3].criticalLowRate],
            ['05月', this.lowCount[4].lowRate, this.lowCount[4].criticalLowRate],
            ['06月', this.lowCount[5].lowRate, this.lowCount[5].criticalLowRate],
            ['07月', this.lowCount[6].lowRate, this.lowCount[6].criticalLowRate],
            ['08月', this.lowCount[7].lowRate, this.lowCount[7].criticalLowRate],
            ['09月', this.lowCount[8].lowRate, this.lowCount[8].criticalLowRate],
            ['10月', this.lowCount[9].lowRate, this.lowCount[9].criticalLowRate],
            ['11月', this.lowCount[10].lowRate, this.lowCount[10].criticalLowRate],
            ['12月', this.lowCount[11].lowRate, this.lowCount[11].criticalLowRate]]

        },
        title: {
          text: '低血糖比例 ' + this.yearData + '年',
          left: 'center',
          top: '0',
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: 'black'
          }
        },
        // backgroundColor: '#344b58',
        // 提示框
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
          // formatter: function (params, ticket, callback) {
          //   var res = params[0].name + '<br/>' + params[0].seriesName + ' : ' + (params[0].value[1] * 100).toFixed(2) + '%' + '<br/>' + params[1].seriesName + ' : ' + (params[1].value[2] * 100).toFixed(2) + '%'
          //   return res
          // }
        },
        grid: {
          left: '50',
          bottom: '30',
          top: '80',
          right: '0'
        },
        legend: {
          top: '25',
          left: '5',
          textStyle: {
            color: 'red'
          }
        },
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'rgb(56, 45, 23, 1)',
              width: 0.5
            }
          },
          axisTick: {
            show: true,
            length: 30
          },
          axisLabel: {
            interval: 0
          }
        }],
        yAxis: [{
          type: 'value',
          scale: true,
          splitLine: {
            show: true,
            lineStyle: {
              // 使用深浅的间隔色
              color: 'black',
              width: 0.5
            }
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },

          axisTick: {
            show: true,
            length: 5
          },
          axisLabel: {
            interval: 0,
            margin: 8,
            color: '#90979c',
            formatter: function (value, index) {
              return (value * 100) + '%'
            }
          }

        }],
        series: [
          {
            type: 'bar'
          },
          {
            type: 'bar'
          }
        ]
      })
    },
    drawHeighChart () {
      const myChart = this.$echarts.init(this.$refs.heighBgluChart)
      myChart.setOption({
        color: ['#ff3636', '#b20000'],
        dataset: {
          // 提供一份数据。
          source: [
            ['type', '高血糖比例', '危机高值比例'],
            ['01月', this.highCount[0].highRate, this.highCount[0].criticalHighRate],
            ['02月', this.highCount[1].highRate, this.highCount[1].criticalHighRate],
            ['03月', this.highCount[2].highRate, this.highCount[2].criticalHighRate],
            ['04月', this.highCount[3].highRate, this.highCount[3].criticalHighRate],
            ['05月', this.highCount[4].highRate, this.highCount[4].criticalHighRate],
            ['06月', this.highCount[5].highRate, this.highCount[5].criticalHighRate],
            ['07月', this.highCount[6].highRate, this.highCount[6].criticalHighRate],
            ['08月', this.highCount[7].highRate, this.highCount[7].criticalHighRate],
            ['09月', this.highCount[8].highRate, this.highCount[8].criticalHighRate],
            ['10月', this.highCount[9].highRate, this.highCount[9].criticalHighRate],
            ['11月', this.highCount[10].highRate, this.highCount[10].criticalHighRate],
            ['12月', this.highCount[11].highRate, this.highCount[11].criticalHighRate]]
        },
        title: {
          text: '高血糖比例 ' + this.yearData + '年',
          left: 'center',
          top: '0',
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: 'black'
          }
        },
        // backgroundColor: '#344b58',
        // 提示框
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          },
          formatter: function (params, ticket, callback) {
            var res = params[0].name + '<br/>' + params[0].seriesName + ' : ' + (params[0].value[1] * 100).toFixed(2) + '%' + '<br/>' + params[1].seriesName + ' : ' + (params[1].value[2] * 100).toFixed(2) + '%'
            return res
          }
        },
        grid: {
          left: '50',
          bottom: '30',
          top: '80',
          right: '0'
        },
        legend: {
          top: '25',
          left: '5',
          textStyle: {
            color: 'red'
          }
        },
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'rgb(56, 45, 23, 1)',
              width: 0.5
            }
          },
          axisTick: {
            show: true,
            length: 30
          },
          axisLabel: {
            interval: 0
          }
        }],
        yAxis: [{
          type: 'value',
          scale: true,
          splitLine: {
            show: true,
            lineStyle: {
              // 使用深浅的间隔色
              color: 'black',
              width: 0.5
            }
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: true,
            length: 5
          },
          axisLabel: {
            interval: 0,
            color: '#90979c',
            formatter: function (value, index) {
              return (value * 100) + '%'
            }
          }

        }],
        series: [
          {
            type: 'bar'
          },
          {
            type: 'bar'
          }
        ]
      })
    },
    drawPersonChart () {
      const myChart = this.$echarts.init(this.$refs.personBgluChart)
      myChart.setOption({
        color: ['#54aaff', '#ff3636'],
        dataset: {
          // 提供一份数据。
          source: [
            ['type', '低血糖比例', '高血糖比例'],
            ['01月', this.personCount[0].lowRate, this.personCount[0].highRate],
            ['02月', this.personCount[1].lowRate, this.personCount[1].highRate],
            ['03月', this.personCount[2].lowRate, this.personCount[2].highRate],
            ['04月', this.personCount[3].lowRate, this.personCount[3].highRate],
            ['05月', this.personCount[4].lowRate, this.personCount[4].highRate],
            ['06月', this.personCount[5].lowRate, this.personCount[5].highRate],
            ['07月', this.personCount[6].lowRate, this.personCount[6].highRate],
            ['08月', this.personCount[7].lowRate, this.personCount[7].highRate],
            ['09月', this.personCount[8].lowRate, this.personCount[8].highRate],
            ['10月', this.personCount[9].lowRate, this.personCount[9].highRate],
            ['11月', this.personCount[10].lowRate, this.personCount[10].highRate],
            ['12月', this.personCount[11].lowRate, this.personCount[11].highRate]]
        },
        title: {
          text: '异常血糖人数比例 ' + this.yearData + '年',
          left: 'center',
          top: '0',
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: 'black'
          }
        },
        // backgroundColor: '#344b58',
        // 提示框
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          },
          formatter: function (params, ticket, callback) {
            var res = params[0].name + '<br/>' + params[0].seriesName + ' : ' + (params[0].value[1] * 100).toFixed(2) + '%' + '<br/>' + params[1].seriesName + ' : ' + (params[1].value[2] * 100).toFixed(2) + '%'
            return res
          }
        },
        grid: {
          left: '50',
          bottom: '30',
          top: '80',
          right: '0'
        },
        legend: {
          top: '25',
          left: '5',
          textStyle: {
            color: 'red'
          }
        },
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'rgb(56, 45, 23, 1)',
              width: 0.5
            }
          },
          axisTick: {
            show: true,
            length: 30
          },
          axisLabel: {
            interval: 0
          }
        }],
        yAxis: [{
          type: 'value',
          scale: true,
          splitLine: {
            show: true,
            lineStyle: {
              // 使用深浅的间隔色
              color: 'black',
              width: 0.5
            }
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: true,
            length: 5
          },
          axisLabel: {
            interval: 0,
            color: '#90979c',
            formatter: function (value, index) {
              return (value * 100) + '%'
            }
          }

        }],
        series: [
          {
            type: 'bar'
          },
          {
            type: 'bar'
          }
        ]
      })
    },
    drawStandardsChart () {
      const myChart = this.$echarts.init(this.$refs.standBgluChart)
      myChart.setOption({
        color: ['#43682b', '#4472c4'],
        dataset: {
          // 提供一份数据。
          source: [
            ['type', '达标比例', '未达标比例'],
            ['01月', this.standardsCount[0].normalRate, this.standardsCount[0].abnormalRate],
            ['02月', this.standardsCount[1].normalRate, this.standardsCount[1].abnormalRate],
            ['03月', this.standardsCount[2].normalRate, this.standardsCount[2].abnormalRate],
            ['04月', this.standardsCount[3].normalRate, this.standardsCount[3].abnormalRate],
            ['05月', this.standardsCount[4].normalRate, this.standardsCount[4].abnormalRate],
            ['06月', this.standardsCount[5].normalRate, this.standardsCount[5].abnormalRate],
            ['07月', this.standardsCount[6].normalRate, this.standardsCount[6].abnormalRate],
            ['08月', this.standardsCount[7].normalRate, this.standardsCount[7].abnormalRate],
            ['09月', this.standardsCount[8].normalRate, this.standardsCount[8].abnormalRate],
            ['10月', this.standardsCount[9].normalRate, this.standardsCount[9].abnormalRate],
            ['11月', this.standardsCount[10].normalRate, this.standardsCount[10].abnormalRate],
            ['12月', this.standardsCount[11].normalRate, this.standardsCount[11].abnormalRate]]
        },
        title: {
          text: '血糖值达标比例 ' + this.yearData + '年',
          left: 'center',
          top: '0',
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: 'black'
          }
        },
        // backgroundColor: '#344b58',
        // 提示框
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          },
          formatter: function (params, ticket, callback) {
            var res = params[0].name + '<br/>' + params[0].seriesName + ' : ' + (params[0].value[1] * 100).toFixed(2) + '%' + '<br/>' + params[1].seriesName + ' : ' + (params[1].value[2] * 100).toFixed(2) + '%'
            return res
          }
        },
        grid: {
          left: '50',
          bottom: '30',
          top: '80',
          right: '0'
        },
        legend: {
          top: '25',
          left: '5',
          textStyle: {
            color: 'red'
          }
        },
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'rgb(56, 45, 23, 1)',
              width: 0.5
            }
          },
          axisTick: {
            show: true,
            length: 30
          },
          axisLabel: {
            interval: 0
          }
        }],
        yAxis: [{
          type: 'value',
          scale: true,
          splitLine: {
            show: true,
            lineStyle: {
              // 使用深浅的间隔色
              color: 'black',
              width: 0.5
            }
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: true,
            length: 5
          },
          axisLabel: {
            interval: 0,
            color: '#90979c',
            formatter: function (value, index) {
              return (value * 100) + '%'
            }
          }

        }],
        series: [
          {
            type: 'bar'
          },
          {
            type: 'bar'
          }
        ]
      })
    },
    exportHandle () {
      if (this.conditionForm.begDate === null) {
        Message.error('查询日期必须输入')
        return
      }
      exportBlgData(this.conditionForm).then(res => {
        this.excelData = res.dataContent
        this.exportExcel()
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },
    // 导出Excel
    exportExcel () {
      require.ensure([], () => {
        const kk = this.conditionForm.departmentName + this.yearData + '年度血糖统计报告'
        // 设置Excel表格第一行的标题
        const title = ['日期', '测量次数', '高血糖次数', '危机高值次数', '低血糖次数', '危机低值次数', '达标次数', '未达标次数', '测量人数', '高血糖人数', '低血糖人数']
        const tHeader = [kk]
        // 设置标题对应的字段
        const filterVal = ['month', 'totalMeasureCount', 'highMeasureCount', 'criticalHighMeasureCount', 'lowMeasureCount', 'criticalLowMeasureCount', 'normalMeasureCount', 'abnormalMeasureCount', 'totalPersonCount', 'highPersonCount', 'lowPersonCount']
        const list = this.excelData.items
        const data = this.formatJson(filterVal, list)

        const merges = ['A1:K1'] // 合并单元格
        export_json_to_excel({
          header: tHeader,
          title: title,
          data,
          merges,
          filename: '血糖统计报告',
          myRowFont: '1'
        })
      })
    },

    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
<style>
.search-item {
  width:200px;
}
.dataTablee {
  border-collapse: collapse;
  font-size: 12px;
}
.dataTablee th {
  border:1px solid gray;
  height: 20px;
  line-height: 20px;
  vertical-align: middle;
}
/* .dataTablee tr th {
  width: 58px;
} */
.dataTablee tr th:first-child {
  width: 90px;
}
.dataTablee td {
  border:1px solid gray;
  height: 20px;
  line-height: 20px;
  text-align: center;
  vertical-align: middle;
}
@media print {
  @page {
    size: auto;
    margin: 3mm;
  }
}
</style>
