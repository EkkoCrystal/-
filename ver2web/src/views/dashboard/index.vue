<template>
  <div>
    <el-card ref="todaySummary"
             v-model="todaySummary">
      <div slot="header">
        <span class="hhstyle">防控信息统计</span>
      </div>
      <el-row :gutter="3">
        <el-col :span="3">
          <div class="topTitleStyle">
            <span class="titleStyle">员工总数</span>
            <span class="numStyle"
                  style="color:#2A82E4">{{ todaySummary.userCount }}</span>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="topTitleStyle">
            <span class="titleStyle">管理员工</span>
            <span class="numStyle"
                  style="color:#2A82E4">{{ todaySummary.officeUserCount }}</span>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="topTitleStyle">
            <span class="titleStyle">生产员工</span>
            <span class="numStyle"
                  style="color:#2A82E4">{{ todaySummary.workerUserCount }}</span>
          </div>
        </el-col>

        <el-col :span="3">
          <div class="topTitleStyle">
            <span class="titleStyle">已统计行程码</span>
            <span class="numStyle"
                  style="color:#29A567">{{ todaySummary.applyTrackCodeUserCount }}</span>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="topTitleStyle">
            <span class="titleStyle">异常行程码</span>
            <span class="numStyle"
                  style="color:#FF5733">{{ todaySummary.abNormalTrackCodeCount }}</span>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="topTitleStyle">
            <span class="titleStyle">今日打卡</span>
            <span class="numStyle"
                  style="color:#29A567">{{ todaySummary.todayClockInCount }}</span>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="topTitleStyle">
            <span class="titleStyle">异常打卡</span>
            <span class="numStyle"
                  style="color:#FF5733">{{ todaySummary.todayAbNormalClockInCount }}</span>
          </div>
        </el-col>

        <!-- <el-col :span="3">
          <div class="topTitleStyle">
            <span class="titleStyle">封闭培训点</span>
            <span class="numStyle"
                  style="color:#FF5733">{{ todaySummary.quarantineSiteCount }}</span>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="topTitleStyle">
            <span class="titleStyle">封闭培训人员</span>
            <span class="numStyle"
                  style="color:#FF5733">{{ todaySummary.quarantinePersonCount }}</span>
          </div>
        </el-col> -->
      </el-row>
    </el-card>
    <el-row>
      <el-col :span="24">
        <el-card class="my-card">
          <div slot="header"
               class="clearfix"
               style="text-align: center">
            <span style="font-size:12pt">管理员工概况</span>
          </div>

          <div>
            <el-table v-loading="officeLoading"
                      :data="officeTableData"
                      style="width: 100%"
                      border
                      stripe
                      highlight-current-row
                      :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
              <el-table-column label="序号"
                               type="index"
                               width="60"
                               align="center" />
              <el-table-column prop="companyName"
                               label="公司"
                               min-width="60"
                               align="center" />
              <el-table-column prop="code"
                               label="部门编号"
                               min-width="60"
                               align="center" />
              <el-table-column prop="name"
                               label="部门"
                               min-width="160"
                               align="center" />
              <el-table-column prop="num"
                               label="编制人数"
                               min-width="60"
                               align="center" />
              <el-table-column prop="userCount"
                               label="总人数"
                               min-width="60"
                               align="center" />

              <el-table-column prop="todayClockInCount"
                               label="今日打卡"
                               align="center"
                               min-width="80" />

              <el-table-column prop="todayAbNormalClockInCount"
                               label="今日异常打卡"
                               align="center"
                               min-width="80" />
              <el-table-column prop="applyTrackCodeUserCount"
                               label="行程码"
                               min-width="90"
                               align="center" />
              <el-table-column prop="todayApplyTrackCodeUserCount"
                               label="今日行程码"
                               align="center"
                               min-width="90" />
              <el-table-column prop="abNormalTrackCodeCount"
                               align="center"
                               label="错误行程码"
                               min-width="120" />

            </el-table>
            <div style="margin:5px;float:right">
              <el-pagination :page-sizes="[10, 20, 30, 50]"
                             layout="total, sizes, prev, pager, next"
                             :total="officeForm.total"
                             :page-size.sync="officeForm.size"
                             @size-change="handleOfficeSizeChange"
                             @current-change="handleOfficeCurrentChange" />
            </div>
          </div>

        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="my-card">
          <div slot="header"
               class="clearfix"
               style="text-align: center">
            <span style="font-size:12pt">生产员工概况</span>
          </div>

          <div>
            <el-table v-loading="loading"
                      :data="workSectionSummary"
                      style="width: 100%"
                      border
                      stripe
                      highlight-current-row
                      :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
              <el-table-column label="序号"
                               type="index"
                               width="60"
                               align="center" />
              <el-table-column prop="name"
                               label="园区"
                               min-width="60"
                               align="center" />
              <el-table-column prop="userCount"
                               label="总人数"
                               min-width="60"
                               align="center" />

              <el-table-column prop="todayClockInCount"
                               label="今日打卡"
                               align="center"
                               min-width="80" />
              <el-table-column prop="todayAbNormalClockInCount"
                               label="今日异常打卡"
                               align="center"
                               min-width="80" />
              <el-table-column prop="applyTrackCodeUserCount"
                               label="总行程码"
                               min-width="90"
                               align="center" />
              <el-table-column prop="todayApplyTrackCodeUserCount"
                               label="今日行程码"
                               align="center"
                               min-width="90" />
              <el-table-column prop="abNormalTrackCodeCount"
                               align="center"
                               label="错误行程码"
                               min-width="120" />
              <el-table-column prop="managerName"
                               align="center"
                               label="防疫负责人"
                               min-width="120" />
              <el-table-column prop="phoneNumber"
                               align="center"
                               label="联系方式"
                               min-width="130" />
            </el-table>
          </div>

        </el-card>
      </el-col>

    </el-row>
    <el-row v-if="isAdmin()">
      <el-col :span="11">
        <el-card class="my-card">
          <div slot="header">
            <span>风险人员列表</span>
          </div>
          <div>
            <el-table v-loading="riskLoading"
                      :data="riskStaffTableData"
                      style="width: 100%;height:760px"
                      border
                      stripe
                      highlight-current-row
                      :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
              <el-table-column label="序号"
                               type="index"
                               width="60"
                               align="center" />
              <el-table-column prop="workSectionDisplay"
                               label="园区"
                               min-width="60"
                               align="center" />

              <el-table-column prop="workId"
                               align="center"
                               label="工号"
                               min-width="80" />
              <el-table-column prop="userName"
                               align="center"
                               label="姓名"
                               min-width="90" />
              <el-table-column prop="phoneNumber"
                               align="center"
                               label="联系方式"
                               min-width="100" />
              <el-table-column prop="inoculations"
                               align="center"
                               label="疫苗接种"
                               min-width="100" />
              <el-table-column prop="reason"
                               align="center"
                               label="风险原因"
                               min-width="130" />
            </el-table>
            <div style="margin:5px;float:right">
              <el-pagination :page-sizes="[10, 20, 30, 50]"
                             layout="total, sizes, prev, pager, next"
                             :total="riskForm.total"
                             :page-size.sync="riskForm.size"
                             @size-change="handleRiskSizeChange"
                             @current-change="handleRiskCurrentChange" />
            </div>

          </div>
        </el-card>
      </el-col>
      <el-col :span="13">
        <el-card class="my-card">
          <div slot="header">
            <span>异常打卡人员列表</span>
            <!-- <el-button style="float: right; padding: 3px 0"
                       type="text"
                       @click="clockMap">打卡分布图</el-button> -->
          </div>
          <div>
            <el-table v-loading="exceptionLoading"
                      :data="exceptionClockInTableData"
                      style="width: 100%;height:760px"
                      border
                      stripe
                      highlight-current-row
                      :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
              <el-table-column label="序号"
                               type="index"
                               width="60"
                               align="center" />
              <el-table-column prop="workSectionDisplay"
                               label="园区"
                               min-width="60"
                               align="center" />

              <el-table-column prop="workId"
                               align="center"
                               label="工号"
                               min-width="80" />
              <el-table-column prop="userName"
                               align="center"
                               label="姓名"
                               min-width="100" />
              <el-table-column prop="phoneNumber"
                               align="center"
                               label="联系方式"
                               min-width="110" />
              <el-table-column align="center"
                               prop="clockTime"
                               :formatter="formatDate"
                               label="打卡时间"
                               min-width="130" />
              <el-table-column align="center"
                               prop="clockTime"
                               label="打卡地点"
                               min-width="130">
                <template slot-scope="scope">
                  {{ scope.row.address.city }}{{ scope.row.address.county }}
                </template>
              </el-table-column>
              <el-table-column align="center"
                               prop="reason"
                               label="异常原因"
                               min-width="130" />
            </el-table>
            <div style="margin:5px;float:right">
              <el-pagination :page-sizes="[10, 20, 30, 50]"
                             layout="total, sizes, prev, pager, next"
                             :total="exceptionClockInForm.total"
                             :page-size.sync="exceptionClockInForm.size"
                             @size-change="handleExceptionSizeChange"
                             @current-change="handleExceptionCurrentChange" />
            </div>

          </div>
        </el-card>
      </el-col>

    </el-row>
    <el-row>

      <el-col :span="11">
        <el-card class="my-card">
          <div slot="header">
            <span>培训点概述</span>

          </div>
          <div>
            <el-table v-loading="quarantineLoading"
                      :data="quarantineTableData"
                      style="width: 100%;height:760px"
                      border
                      stripe
                      highlight-current-row
                      :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
              <el-table-column label="序号"
                               type="index"
                               width="60"
                               align="center" />
              <el-table-column prop="code"
                               label="培训点"
                               min-width="100"
                               align="center" />

              <el-table-column prop="userCount"
                               align="center"
                               label="总人数"
                               min-width="60" />

              <el-table-column prop="expireCount"
                               align="center"
                               label="到期人数"
                               min-width="60" />

              <el-table-column align="center"
                               prop="address"
                               label="地址"
                               min-width="130" />
            </el-table>
            <div style="margin:5px;float:right">
              <el-pagination :page-sizes="[10, 20, 30, 50]"
                             layout="total, sizes, prev, pager, next"
                             :total="quarantineForm.total"
                             :page-size.sync="quarantineForm.size"
                             @size-change="handleQuarantineSizeChange"
                             @current-change="handleQuarantineCurrentChange" />
            </div>

          </div>
        </el-card>
      </el-col>
      <el-col :span="13">
        <el-card class="my-card">
          <div slot="header">
            <span>宿舍概述</span>
          </div>
          <div>
            <el-table v-loading="dormLoading"
                      :data="dormTableData"
                      style="width: 100%;height:760px"
                      border
                      stripe
                      highlight-current-row
                      :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
              <el-table-column label="序号"
                               type="index"
                               width="60"
                               align="center" />
              <el-table-column prop="code"
                               label="宿命"
                               min-width="80"
                               align="center" />

              <el-table-column prop="userCount"
                               align="center"
                               label="入住人数"
                               min-width="50" />
              <el-table-column prop="userName"
                               align="center"
                               label="所在区域"
                               min-width="100">
                <template slot-scope="scope">
                  {{ scope.row.county }}/{{ scope.row.subdistrict }}
                </template>
              </el-table-column>
              <el-table-column prop="managerName"
                               align="center"
                               label="管理员"
                               min-width="60" />
              <el-table-column prop="address"
                               align="center"
                               label="地址"
                               min-width="120" />

            </el-table>
            <div style="margin:5px;float:right">
              <el-pagination :page-sizes="[10, 20, 30, 50]"
                             layout="total, sizes, prev, pager, next"
                             :total="dormForm.total"
                             :page-size.sync="dormForm.size"
                             @size-change="handleDormSizeChange"
                             @current-change="handleDormCurrentChange" />
            </div>

          </div>
        </el-card>
      </el-col>

    </el-row>

  </div>
</template>

<script>
// import moment from 'moment'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import {
  getTodaySummary, getUserClockTodayInRecords,
  getWorkSectionSummary, getUserDoubts,
  getDormitorySummary, getQuarantineSummary,
  getUserDepartmentSummary
} from '@/api/user'
import moment from 'moment'
// import { BaiduMap, BmMarker, BmLabel } from 'vue-baidu-map'

// import '../../node_modules/echarts/map/js/china.js' // 引入中国地图数据
export default {
  name: 'Dashboard',
  components: {
    // BaiduMap,
    // BmMarker,
    // BmLabel
  },
  data () {
    return {
      todaySummary: {},

      workSectionSummary: [],
      officeTableData: [],
      officeLoading: false,
      officeForm: {
        companyCode: null,
        page: 1,
        size: 10,
        total: 0

      },

      form: {
        page: 1,
        size: 20
      },
      riskForm: {
        condition: '',
        processed: false,
        reason: '',
        solution: '',
        level: 'Medium',
        size: 10,
        page: 1,
        total: 0
      },
      exceptionClockInForm: {
        size: 10,
        page: 1,
        total: 0
      },

      riskLoading: false,
      riskStaffTableData: [],

      exceptionLoading: false,
      exceptionClockInTableData: [],

      dormLoading: false,
      dormTableData: [],
      dormForm: {
        page: 1,
        size: 10,
        total: 0
      },

      quarantineLoading: false,
      quarantineTableData: [],

      quarantineForm: {
        page: 1,
        size: 10,
        total: 0

      },

      dialogVisible: false,
      // 打卡分布
      myIcon: {
        url: require('@/assets/images/map-marker.png'),
        size: {
          width: 20,
          height: 20
        }
      },
      // 地图相关
      mapDialogVisible: false,
      mapCenter: { lng: 120.069338, lat: 30.326935 },
      mapZoom: 8
    }
  },
  computed: {
    ...mapGetters(['roles', 'token'])
  },
  mounted () {
    this.onSearch()
    this.onSearchException()
    this.onSearchOffice()
    this.onSearchDorm()
    this.onSearchQuarantine()
  },
  created () {
    this.loadData()
  },

  methods: {

    loadData () {
      getTodaySummary().then(res => {
        this.todaySummary = res.dataContent
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
      })

      this.loading = true
      getWorkSectionSummary().then(res => {
        this.workSectionSummary = res.dataContent
        this.loading = false
      }).catch(err => {
        console.log(err.message)
        Message.error(err.message)
        this.loading = false
      })
    },
    isAdmin () {
      return this.roles.includes('admin')
    },
    onSearch () {
      this.riskForm.page = 1
      this.query()
    },
    query () {
      this.riskLoading = true
      getUserDoubts(this.riskForm).then(res => {
        this.riskStaffTableData = res.dataContent.records
        this.riskForm.total = res.dataContent.total
        this.riskLoading = false
        console.log(res.dataContent)
      }).catch(err => {
        Message.error(err.message)
        this.riskLoading = false
      })
    },

    onSearchException () {
      this.exceptionClockInForm.page = 1
      this.queryException()
    },
    queryException () {
      this.exceptionLoading = true
      getUserClockTodayInRecords(this.exceptionClockInForm).then(res => {
        this.exceptionClockInTableData = res.dataContent.records
        this.exceptionLoading = false
        this.exceptionClockInForm.total = res.dataContent.total
      }).catch(err => {
        console.log(err.message)
        this.exceptionLoading = false
      })
    },

    onSearchOffice () {
      this.officeForm.page = 1
      this.queryOffice()
    },
    queryOffice () {
      this.officeLoading = true
      getUserDepartmentSummary(this.officeForm).then(res => {
        this.officeTableData = res.dataContent.records
        this.officeForm.total = res.dataContent.total
        this.officeLoading = false
      }).catch(err => {
        this.officeLoading = false
        console.log(err.message)
      })
    },

    onSearchDorm () {
      this.dormForm.page = 1
      this.queryDorm()
    },

    queryDorm () {
      this.dormLoading = true

      getDormitorySummary(this.dormForm).then(res => {
        this.dormLoading = false
        this.dormTableData = res.dataContent.records
        this.dormForm.total = res.dataContent.total
      }).catch(err => {
        console.log(err.message)
        this.dormLoading = false
      })
    },

    onSearchQuarantine () {
      this.quarantineForm.page = 1
      this.queryQuarantine()
    },

    queryQuarantine () {
      this.quarantineLoading = true
      getQuarantineSummary(this.quarantineForm).then(res => {
        this.quarantineTableData = res.dataContent.records
        this.quarantineForm.total = res.dataContent.total
        this.quarantineLoading = false
      }).catch(err => {
        console.log(err.message)
        this.quarantineLoading = false
      })
    },

    handleRiskSizeChange (val) {
      this.riskForm.size = val
      this.query()
    },
    handleRiskCurrentChange (val) {
      this.riskForm.page = val
      this.query()
    },
    handleExceptionSizeChange (val) {
      this.exceptionClockInForm.sieze = val
      this.queryException()
    },
    handleExceptionCurrentChange (val) {
      this.exceptionClockInForm.page = val
      this.queryException()
    },

    handleOfficeSizeChange (val) {
      this.officeForm.size = val
      this.queryOffice()
    },
    handleOfficeCurrentChange (val) {
      this.officeForm.page = val
      this.queryOffice()
    },

    handleDormSizeChange (val) {
      this.dormForm.size = val
      this.queryDorm()
    },
    handleDormCurrentChange (val) {
      this.dormForm.page = val
      this.queryDorm()
    },
    handleQuarantineSizeChange (val) {
      this.quarantineForm.size = val
      this.queryQuarantine()
    },
    handleQuarantineCurrentChange (val) {
      this.quarantineForm.page = val
      this.queryQuarantine()
    },

    formatDate (d) {
      if (d !== undefined && d !== null && d !== '') {
        return moment(d.clockTime).format('YYYY-MM-DD HH:mm')
      } else {
        return ''
      }
    }

  }
}

</script>

<style>
.my-card {
  margin: 10px 20px 10px;
}

.hhstyle {
  color: #343331;
  font-size: 24px;
  font-style: normal;
  font-weight: bold;
}
.navClass {
  float: left;
}
.topTitleStyle {
  width: 150px;
  height: 70px;
  background-color: #f7f7f7;
  text-align: center;
  padding: 5px 7px 10px 10px;
}
.titleStyle {
  font: 14px;
  color: #545454;
  font-weight: bold;
  padding-bottom: 2px;
}
.numStyle {
  display: block;
  font-size: 180%;
  font-style: normal;
  font-weight: bold;
  margin-top: 3px;
  padding-bottom: 3px;
}
.box-card {
  width: 300px;
  height: 220px;
  float: left;
  margin: 5px 5px 5px 15px;
}
.txt-collapse {
  display: inline-block;
  width: 60px;
  font-size: 0.5em;
  text-align: left;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.txt-collapse-full {
  display: inline-block;
  width: 80px;
  font-size: 0.5em;
  text-align: left;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dialog .el-dialog__header {
  padding: 5;
}
.dialog .el-dialog__body {
  padding: 10px 10px;
}

.el-divider--horizontal {
  margin: 8px 0 10px 0;
}
.del-advice {
  color: rgb(202, 202, 202);
}
</style>
