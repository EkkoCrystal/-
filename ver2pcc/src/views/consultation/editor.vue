/* eslint-disable vue/html-closing-bracket-newline */ /* eslint-disable
vue/html-closing-bracket-newline */ /* eslint-disable
vue/max-attributes-per-line */
<template>
  <div class="main">
    <el-card>
      <div
        slot="header"
        class="clearfix"
      >
        <el-row>
          <el-col :span="1">
            <div style="line-weight: 10px">&nbsp;</div>
          </el-col>

          <el-col :span="4"><b>姓名：{{ patient.patientName }}</b></el-col>
          <el-col :span="3"><b>性别:{{ patient.genderDisplay }}</b>
          </el-col>
          <el-col :span="3"><b>年龄:</b> {{ patient.age }}</el-col>
          <el-col :span="4"><b>科室：</b>{{ patient.departmentName }}</el-col>
          <el-col :span="4"><b>床号：</b>{{ patient.bed }}</el-col>
          <el-col :span="4"><b>住院号:</b> {{ patient.hospitalizedNum }}</el-col>
        </el-row>
      </div>
      <div>

        <el-collapse>
          <el-collapse-item
            title="血糖记录"
            name="1"
          >
            <div style="margin: 10px">

              <el-table
                v-loading="gluLoading"
                :data="gluTableData"
                stripe
                border
                highlight-current-row
                :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
              >
                <el-table-column
                  prop="testTime"
                  label="检测日期"
                  width="200"
                  align="center"
                />

                <el-table-column
                  prop="periodName"
                  label="检测时段"
                  align="center"
                />
                <el-table-column
                  prop="testValue"
                  label="血糖值"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span :class="scope.row.determineType">
                      {{ scope.row.testValue }}&nbsp;&nbsp;<span v-if="scope.row.determineType === 'High'">↑</span>
                      <span v-if="scope.row.determineType === 'Low'">↓</span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="单位"
                  prop="unit"
                  width="80"
                  align="center"
                />
                <el-table-column
                  prop="testUser"
                  label="检测人"
                  align="center"
                />
                <el-table-column
                  prop="remark"
                  label="备注"
                  align="center"
                />
              </el-table>
              <div style="float: right; margin: 10px">
                <el-pagination
                  layout="total, sizes, prev, pager, next"
                  :total="gluFilter.total"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size.sync="gluFilter.size"
                  @size-change="handleGluSizeChange"
                  @current-change="handleGluCurrentChange"
                />
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item
            title="血酮记录"
            name="2"
          >
            <div style="margin: 10px">
              <el-table
                v-loading="ketLoading"
                :data="ketTableData"
                stripe
                border
                highlight-current-row
                :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
              >
                <el-table-column
                  prop="testTime"
                  label="检测日期"
                  align="center"
                />

                <el-table-column
                  label="血酮值"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span :class="scope.row.determineType">
                      {{ scope.row.testValue }} &nbsp;<span v-if="scope.row.determineType === 'High'">↑</span>
                      <span v-if="scope.row.determineType === 'Low'">↓</span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="unit"
                  label="单位"
                  align="center"
                />
                <el-table-column
                  prop="testUser"
                  label="检测人"
                  align="center"
                />
              </el-table>
              <div style="float: right; margin: 10px">
                <el-pagination
                  layout="total, sizes, prev, pager, next"
                  :total="ketFilter.total"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size.sync="ketFilter.size"
                  @size-change="handleKetSizeChange"
                  @current-change="handleKetCurrentChange"
                />
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item
            title="尿素记录"
            name="3"
          >
            <div style="margin: 10px">
              <el-table
                v-loading="uaLoading"
                :data="uaTableData"
                stripe
                border
                highlight-current-row
                :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
              >
                <el-table-column
                  prop="testTime"
                  label="检测日期"
                  align="center"
                />

                <el-table-column
                  label="尿素值"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span :class="scope.row.determineType">
                      {{ scope.row.testValue }} &nbsp;<span v-if="scope.row.determineType === 'High'">↑</span>
                      <span v-if="scope.row.determineType === 'Low'">↓</span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="unit"
                  label="单位"
                  align="center"
                />
                <el-table-column
                  prop="testUser"
                  label="检测人"
                  align="center"
                />
              </el-table>
              <div style="float: right; margin: 10px">
                <el-pagination
                  layout="total, sizes, prev, pager, next"
                  :total="uaFilter.total"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size.sync="uaFilter.size"
                  @size-change="handleUaSizeChange"
                  @current-change="handleUaCurrentChange"
                />
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>

      </div>

      <div>
        <div style="margin: 10px">
          <el-form
            ref="formConsultation"
            :modle="consultation"
            label-width="80px"
            size="small"
          >
            <el-form-item label="会诊记录:">
              <div class="block">
                <el-timeline>
                  <el-timeline-item
                    v-for="(activity, index) in activities"
                    :key="index"
                    :timestamp="activity.creationTime"
                    placement="top"
                  >
                    <el-row>

                      <el-col :span="3">{{ activity.doctorName }}({{
                        activity.departmentName
                      }}):</el-col>
                      <el-col :span="21">
                        <div style="font-size: 12pt;word-wrap:break-word;min-width:600px">
                          {{ activity.content }}
                        </div>
                      </el-col>
                    </el-row>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-form-item>
            <el-form-item
              v-if="!isClosed"
              prop="content"
              label="会诊描述:"
            >
              <el-input
                v-model="consultation.content"
                :rows="4"
                class="dialog-form-item"
                type="textarea"
                maxlength="256"
                show-word-limit
              />
            </el-form-item>
            <el-form-item>
              <el-button
                v-if="!isClosed"
                type="primary"
                @click="addConsultationLog"
              >回复</el-button>
              <el-button
                v-if="!isClosed"
                type="primary"
                @click="completedConsultation"
              >完成会诊</el-button>
              <el-button

                type="primary"
                @click="navigatorConsultation"
              >返回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import {
  getPatient,
  queryConsultationLogs,
  addConsultation,
  finishConsultation
} from '@/api/patient'
import { getDepartments, getDoctors } from '@/api/user'
import { queryTestDataByPatient } from '@/api/test'
import { Message } from 'element-ui'
export default {
  name: 'Editor',
  data () {
    return {
      deptOptions: [],
      doctorOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      activities: [],
      gluLoading: false,
      ketLoading: false,
      uaLoading: false,

      gluTableData: [],
      ketTableData: [],
      uaTableData: [],
      patient: {},
      gluFilter: {
        beginDate: '',
        endDate: '',
        page: 1,
        size: 10,
        category: 'GLU',
        total: 0
      },
      ketFilter: {
        beginDate: '',
        endDate: '',
        page: 1,
        size: 10,
        category: 'KET',
        total: 0
      },
      uaFilter: {
        beginDate: '',
        endDate: '',
        page: 1,
        size: 10,
        category: 'UA',
        total: 0
      },
      consultation: {
        consultationId: 0,
        content: ''
      }
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    patientId () {
      return this.$route.query.patientId
    },
    isClosed () {
      return this.$route.query.isClosed
    },
    ...mapGetters(['avatar', 'token', 'organizationName'])
  },
  created () {
    this.init()
    this.initData()
    // this.initFilter()
  },
  mounted () {
    this.onFilterGlu()
    this.onFilterKet()
    this.onFilterUa()
    this.onConsultationLog()
  },
  methods: {
    initFilter () {
      // this.gluFilter.beginDate = moment()
      //   .subtract(60, 'd')
      //   .format('YYYY-MM-DD')
      this.gluFilter.beginDate = moment(this.patient.hospitalizedDate).format('YYYY-MM-DD')
      this.gluFilter.endDate = moment()
        .add(1, 'd')
        .format('YYYY-MM-DD')
      // this.ketFilter.beginDate = moment()
      //   .subtract(60, 'd')
      //   .format('YYYY-MM-DD')
      this.gluFilter.beginDate = moment(this.patient.hospitalizedDate).format('YYYY-MM-DD')

      this.ketFilter.endDate = moment()
        .add(1, 'd')
        .format('YYYY-MM-DD')
      // this.uaFilter.beginDate = moment()
      //   .subtract(60, 'd')
      //   .format('YYYY-MM-DD')
      this.gluFilter.beginDate = moment(this.patient.hospitalizedDate).format('YYYY-MM-DD')

      this.uaFilter.endDate = moment()
        .add(1, 'd')
        .format('YYYY-MM-DD')
    },
    init () {
      if (this.id === undefined) {
        this.$router.push({
          path: '/'
        })
      }
    },
    async initData () {
      await getPatient(this.patientId).then(res => {
        // const p = res.dataContent
        // if (p === null || p === undefined) {
        //   Message.error('患者已经出院，无法查看,页面将自动关闭')
        //   setTimeout(this.closeWindow, 4000)
        // }
        // this.patient = res.dataContent

        this.patient = res.dataContent
        this.initFilter()
      })
      getDepartments()
        .then(res => {
          this.deptOptions = res.dataContent
        })
        .catch(err => {
          console.log(err)
          Message.error(err.message)
        })
      getDoctors()
        .then(res => {
          this.doctorOptions = res.dataContent
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleChangeConsultationDepartment (val) {
      this.consultation.consultationDepartmentCode = ''
      this.consultation.consultationDepartmentName = ''
    },
    handleConsultationNodeClick (data) {
      this.consultation.consultationDepartmentCode = data.code
      this.consultation.consultationDepartmentName = data.name
      this.$refs.selConsultationTree.blur()
    },
    handleGluSizeChange (val) {
      this.gluFilter.size = val
      this.onFilterGlu()
    },
    handleGluCurrentChange (val) {
      this.gluFilter.page = val
      this.onFilterGlu()
    },
    handleUaSizeChange (val) {
      this.uaFilter.size = val
      this.onFilterUa()
    },
    handleUaCurrentChange (val) {
      this.uaFilter.page = val
      this.onFilterUa()
    },
    handleKetSizeChange (val) {
      this.ketFilter.size = val
      this.onFilterKet()
    },
    handleKetCurrentChange (val) {
      this.ketFilter.page = val
      this.onFilterKet()
    },

    onFilterGlu () {
      this.gluLoading = true
      queryTestDataByPatient(this.patientId, this.gluFilter)
        .then(res => {
          this.gluFilter.total = res.dataContent.total
          this.gluTableData = res.dataContent.records
          this.gluLoading = false
        })
        .catch(err => {
          console.log(err)
          Message.error(err.message)
          this.gluLoading = false
        })
    },
    onFilterKet () {
      this.ketLoading = true
      queryTestDataByPatient(this.patientId, this.ketFilter)
        .then(res => {
          this.ketFilter.total = res.dataContent.total
          this.ketTableData = res.dataContent.records
          this.ketLoading = false
        })
        .catch(err => {
          console.log(err)
          Message.error(err.message)
          this.ketLoading = false
        })
    },
    onFilterUa () {
      this.uaLoading = true
      queryTestDataByPatient(this.patientId, this.uaFilter)
        .then(res => {
          this.uaFilter.total = res.dataContent.total
          this.uaTableData = res.dataContent.records
          this.uaLoading = false
        })
        .catch(err => {
          console.log(err)
          Message.error(err.message)
          this.uaLoading = false
        })
    },
    onConsultationLog () {
      queryConsultationLogs(this.id)
        .then(res => {
          console.log(res)
          this.activities = res.dataContent
        })
        .catch(err => {
          console.log(err)
          Message.error(err.message)
        })
    },
    addConsultationLog () {
      if (this.consultation.content === null ||
      this.consultation.content === '') {
        Message.error('必须输入会诊描述')
        return
      }
      this.consultation.consultationId = this.id

      addConsultation(this.consultation)
        .then(res => {
          this.onConsultationLog()
          Message.success('会诊记录保持成功')
          this.consultation.content = ''
        })
        .catch(err => {
          console.log(err)
          Message.error(err.message)
        })
    },
    completedConsultation () {
      finishConsultation(this.id)
        .then(res => {
          Message.success('会诊已经关闭')
          this.$router.push('/consultation')
        })
        .catch(err => {
          Message.error(err.message)
          console.log(err)
        })
    },
    navigatorConsultation () {
      this.$router.push('/consultation')
    }
  }
}
</script>
<style scoped>
.main {
  margin: 10px;
}
.High {
  color: red;
}
.Low {
  color: blue;
}
</style>
