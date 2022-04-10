<template>
  <div class="dashboard-editor-container">
    <!-- head -->

    <el-row style="margin: 20px 0;">
      <el-col :span="24">
        <div class="leftNum" style="height:50px;padding: 5px 0;">
          <el-date-picker
            v-model="formTable.day"
            type="date"
            class="search-item"
            :clearable="false"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="changeDay" />
        </div>
      </el-col>

    </el-row>
    <el-row style="margin: 20px 0;">
      <el-col :span="8">
        <div class="leftNum">
          <span class="titleNum">现有阳性</span>
          <span v-if="totalObj.totalPosCount !== null" class="oneNum">{{ totalObj.totalPosCount }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="leftNum">
          <span class="titleNum">新增阳性</span>
          <span v-if="totalObj.posCount !== null" class="twoNum">{{ totalObj.posCount }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="leftNum">
          <span class="titleNum">当日检测</span>
          <span v-if="totalObj.testCount !== null" class="threeNum">{{ totalObj.testCount }}</span>
        </div>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <div slot="header" style="text-align: center">
        <div style="font-size:16px;font-weight: bold;">检测人员分布</div>
      </div>
      <el-row>
        <el-col :span="8">
          <div class="leftNum">
            <span class="titleNum">居家隔离医学观察人员</span>
            <span v-if="totalObjSummary.homeQuarantine !== null" class="fourNum">{{ totalObjSummary.homeQuarantine }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="leftNum">
            <span class="titleNum">居家健康监测人员</span>
            <span v-if="totalObjSummary.homeHealthMonitoring !== null" class="fourNum">{{ totalObjSummary.homeHealthMonitoring }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="leftNum">
            <span class="titleNum">医疗机构工作人员</span>
            <span v-if="totalObjSummary.medicalStaff !== null" class="fourNum">{{ totalObjSummary.medicalStaff }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="leftNum">
            <span class="titleNum">住院患者</span>
            <span v-if="totalObjSummary.inpatient !== null" class="fourNum">{{ totalObjSummary.inpatient }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="leftNum">
            <span class="titleNum">住院患者陪护</span>
            <span v-if="totalObjSummary.accompany !== null" class="fourNum">{{ totalObjSummary.accompany }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="leftNum">
            <span class="titleNum">门诊就诊人员</span>
            <span v-if="totalObjSummary.outpatient !== null" class="fourNum">{{ totalObjSummary.outpatient }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="8">
          <div class="leftNum">
            <span class="titleNum">自测人员</span>
            <span v-if="totalObjSummary.selfCheck !== null" class="fourNum">{{ totalObjSummary.selfCheck }}</span>
          </div>
        </el-col> -->
        <el-col :span="8">
          <div class="leftNum">
            <span class="titleNum">其他</span>
            <span v-if="totalObjSummary.other !== null" class="fourNum">{{ totalObjSummary.other }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- barline -->
    <el-card>
      <div slot="header" style="text-align: center">
        <div style="font-size:16px;font-weight: bold;">各机构检测人员分布（
          <span style="color:red;">阳性</span>/
          <span style="color:#10ADB6;">检测人员</span>）
        </div>
      </div>
      <div>
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          border
          highlight-current-row
          show-summary
          :summary-method="getSummaries"
          :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
          <el-table-column
            prop="name"
            label="机构"
            min-width="170"
            align="center" />
          <el-table-column
            prop="posHomeQuarantine"
            label="居家隔离医学观察人员"
            min-width="140"
            align="center">
            <template slot-scope="scope">
              <span style="color:#E93132;">{{ scope.row.posHomeQuarantine }}&nbsp;</span>
              <span>/</span>
              <span style="color:#10ADB6;">&nbsp;{{ scope.row.homeQuarantine }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="posHomeHealthMonitoring"
            label="居家健康监测人员"
            min-width="140"
            align="center">
            <template slot-scope="scope">
              <span style="color:#E93132;">{{ scope.row.posHomeHealthMonitoring }}&nbsp;</span>
              <span>/</span>
              <span style="color:#10ADB6;">&nbsp;{{ scope.row.homeHealthMonitoring }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="posMedicalStaff"
            label="医疗机构工作人员"
            min-width="130"
            align="center">
            <template slot-scope="scope">
              <span style="color:#E93132;">{{ scope.row.posMedicalStaff }}&nbsp;</span>
              <span>/</span>
              <span style="color:#10ADB6;">&nbsp;{{ scope.row.medicalStaff }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="posInpatient"
            label="住院患者"
            min-width="130"
            align="center">
            <template slot-scope="scope">
              <span style="color:#E93132;">{{ scope.row.posInpatient }}&nbsp;</span>
              <span>/</span>
              <span style="color:#10ADB6;">&nbsp;{{ scope.row.inpatient }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="posAccompany"
            label="住院患者陪护"
            min-width="130"
            align="center">
            <template slot-scope="scope">
              <span style="color:#E93132;">{{ scope.row.posAccompany }}&nbsp;</span>
              <span>/</span>
              <span style="color:#10ADB6;">&nbsp;{{ scope.row.accompany }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="posOutpatient"
            label="门诊就诊人员"
            min-width="130"
            align="center">
            <template slot-scope="scope">
              <span style="color:#E93132;">{{ scope.row.posOutpatient }}&nbsp;</span>
              <span>/</span>
              <span style="color:#10ADB6;">&nbsp;{{ scope.row.outpatient }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="posOther"
            label="其他"
            min-width="80"
            align="center">
            <template slot-scope="scope">
              <span style="color:#E93132;">{{ scope.row.posOther }}&nbsp;</span>
              <span>/</span>
              <span style="color:#10ADB6;">&nbsp;{{ scope.row.other }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="posCount"
            label="统计"
            min-width="80"
            align="center">
            <template slot-scope="scope">
              <span style="color:#E93132;">{{ scope.row.posCount }}&nbsp;</span>
              <span>/</span>
              <span style="color:#10ADB6;">&nbsp;{{ scope.row.personCount }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin:5px;float:right">
        <el-pagination
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          :page-size.sync="formTable.size"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script>
// import LineChart from './components/LineChart'
// import MapChart from './components/MapChart'
// import BarChart from './components/BarChart.vue'
import { getTotalCount, getOrganizationSummary, getTotalPersonSummary } from '@/api/user'
import moment from 'moment'
import { mapGetters } from 'vuex'
// import china from '@/views/dashboard/json/china.json'
// import hangzhou from '@/views/dashboard/json/province/hangzhou.json'
// import tongweixian from '@/views/dashboard/json/province/tongweixian.json'

import { Message } from 'element-ui'
// import '../../node_modules/echarts/map/js/china.js' // 引入中国地图数据
export default {
  components: {

  },
  data () {
    return {
      totalObj: {
        totalPosCount: '',
        posCount: '',
        testCount: ''
      },
      totalObjSummary: {
        homeQuarantine: '',
        homeHealthMonitoring: '', // 居家健康监测
        medicalStaff: '',
        inpatient: '',
        accompany: '',
        outpatient: '',
        selfCheck: '',
        other: ''

      },
      form: {
        day: moment().format('YYYY-MM-DD'),
        tenant: '',
        size: 20,
        page: 1
      },
      loading: false,
      myIcon: null,
      tabPosition: 'right',
      trendDay: 7,
      lineChartData: {},
      tableData1: [
        {
          name: 'qq',
          num1: 11,
          num: 10,
          num2: 1,
          num3: 5
        },
        {
          name: 'qq',
          num1: 12,
          num: 20,
          num2: 2,
          num3: 10
        },
        {
          name: 'qq',
          num1: 13,
          num: 30,
          num2: 3,
          num3: 15
        },
        {
          name: 'qq',
          num1: 14,
          num: 40,
          num2: 4,
          num3: 20
        },
        {
          name: 'qq',
          num1: 15,
          num: 50,
          num2: 5,
          num3: 25
        }
      ],
      areaData: [],
      totalAreaSumData: {},
      dayAreaSumData: {},
      ffheight: '',
      tableData: [],
      formTable: {
        day: moment().format('YYYY-MM-DD'),
        tenant: '',
        size: 20,
        page: 1
      },
      total: 0
    }
  },
  computed: {
    ...mapGetters(['name', 'token', 'organizationName'])
  },
  mounted () {
    this.onSearch()
  },
  created () {
    this.initData()
  },
  methods: {
    getSummaries (param) {
      const { columns, data } = param
      console.log(param)
      console.log('111111111111111')
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        let values1 = []
        switch (index) {
          case 1:
            values1 = data.map(item => Number(item['homeQuarantine']))
            break
          case 2:
            values1 = data.map(item => Number(item['homeHealthMonitoring']))
            break
          case 3:
            values1 = data.map(item => Number(item['medicalStaff']))
            break
          case 4:
            values1 = data.map(item => Number(item['inpatient']))
            break
          case 5:
            values1 = data.map(item => Number(item['accompany']))
            break
          case 6:
            values1 = data.map(item => Number(item['outpatient']))
            break
          case 7:
            values1 = data.map(item => Number(item['other']))
            break
          case 8:
            values1 = data.map(item => Number(item['personCount']))
            break
          default:
            break
        }
        if (!values.every(value => isNaN(value)) && !values1.every(value => isNaN(value))) {
          const num1 = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          const num2 = values1.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = (() => {
            const num = <div>
              <span style='color:#E93132;'>{num1}&nbsp;</span>
              <span>/</span>
              <span style='color:#10ADB6;'>&nbsp;{num2}</span>
            </div>
            return num
          })()
        } else {
          sums[index] = ' '
        }
      })
      console.log(sums)
      return sums
    },
    initData () {
      this.formTable.tenant = this.organizationName
      getTotalCount(this.formTable).then(res => {
        console.log(res)
        console.log('qqqqqqqqqqqqqqq')
        if (res.dataContent !== null) {
          this.totalObj = res.dataContent
        }
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
      //
      getTotalPersonSummary(this.formTable).then(res => {
        console.log(res)
        console.log('rrrrrrrrrrrrrrrrrrrr')
        if (res.dataContent !== null) {
          this.totalObjSummary = res.dataContent
        }
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
      this.onSearch()
    },
    changeDay (val) {
      this.cleanAllData()
      this.tableData = []
      this.initData()
    },
    cleanAllData () {
      this.totalObj = {
        totalPosCount: '',
        posCount: '',
        testCount: ''
      }
      this.totalObjSummary = {
        homeQuarantine: '',
        homeHealthMonitoring: '', // 居家健康监测
        medicalStaff: '',
        inpatient: '',
        accompany: '',
        outpatient: '',
        selfCheck: '',
        other: ''
      }
    },
    // 表格数据
    onSearch () {
      this.formTable.page = 1
      this.query()
    },
    query () {
      this.formTable.tenant = this.organizationName
      this.loading = true
      console.log(this.formTable)
      getOrganizationSummary(this.formTable).then(res => {
        console.log(res)
        console.log('22222222222222222222222')
        this.tableData = res.dataContent.records
        this.total = res.dataContent.total
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.formTable.size = val
      this.query()
    },
    handleCurrentChange (val) {
      this.formTable.page = val
      this.query()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
}
.leftNum {
  height: 80px;
  text-align: center;
  background-color: white;
  padding: 15px 0;

  span {
    display: block;
    width: 100%;
    height: 30px;
  }
  .titleNum {
    color: #333333;
    font-size: 16px;
  }
  .oneNum {
    color: #E93132;
    font-size: 20px;
  }
  .twoNum {
    color: #FF6956;
    font-size: 20px;
  }
  .threeNum {
    color: #476DA0;
    font-size: 20px;
  }
  .fourNum {
    color: #10ADB6;
    font-size: 20px;
  }
  .count_row {
    color: red;
  }
}

</style>
