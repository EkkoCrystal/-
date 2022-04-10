<template>
  <div class="main">
    <el-card>
      <div slot="header" class="clearfix">
        <el-form
          ref="conditionForm"
          :model="conditionForm"
          :rules="conditionFormRule"
          :inline="true"
          size="small"
          label-width="100px"
        >
          <el-row>
            <el-col>
              <el-form-item label="申请科室:" prop="requestDepartmentCode">
                <div style="width:200px;height:32px">
                  <my-treeselect ref="selRequestTree" :append-true="true" :mydata="deptOptions" :valuebb="departDefaultCodes" @changeSel="changeRequestDepSelHandle" @inputChanging="inoutRequestDepChangeHandle" />
                </div>
              </el-form-item>
              <!-- <el-form-item prop="requestDepartmentCode" label="申请科室:">
                <el-select
                  ref="selRequestTree"
                  v-model="conditionForm.requestDepartmentName"
                  class="small-form-item"
                  clearable
                  placeholder="请选择科室"
                  @change="handleChangeRequestDepartment"
                  @clear="handleRequestNodeClear"
                >
                  <el-option
                    :label="conditionForm.requestDepartmentName"
                    :value="conditionForm.requestDepartmentName"
                  />
                  <el-tree
                    highlight-current
                    default-expand-all
                    :expand-on-click-node="false"
                    :data="deptOptions"
                    :props="defaultProps"
                    @node-click="handleReqeustNodeClick"
                  />
                </el-select>
              </el-form-item> -->

              <el-form-item prop="doctorCode" label="申请医生:">
                <el-select
                  v-model="conditionForm.requestDoctorCode"
                  placeholder="请选择医生"
                  class="small-form-item"
                  clearable
                >
                  <el-option
                    v-for="item in requestDoctorOptions"
                    :key="item.doctorCode"
                    :label="item.doctorName"
                    :value="item.doctorCode"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="会诊科室:" prop="departmentCode">
                <div style="width:200px;height:32px">
                  <my-treeselect ref="selConsultationTree" :append-true="true" :mydata="deptOptions" :valuebb="addDepartDefaultCodes" @changeSel="changeConsultationDepSelHandle" @inputChanging="inoutConsultationDepChangeHandle" />
                </div>
              </el-form-item>
              <!-- <el-form-item prop="departmentCode" label="会诊科室:">
                <el-select
                  ref="selConsultationTree"
                  v-model="conditionForm.consultationDepartmentName"
                  class="small-form-item"
                  clearable
                  placeholder="请选择科室"
                  @change="handleChangeConsuDepartment"
                  @clear="handleConsultationNodeClear"
                >
                  <el-option
                    :label="conditionForm.consultationDepartmentName"
                    :value="conditionForm.consultationDepartmentName"
                  />
                  <el-tree
                    highlight-current
                    default-expand-all
                    :expand-on-click-node="false"
                    :data="deptOptions"
                    :props="defaultProps"
                    @node-click="handleConsulationNodeClick"
                  />
                </el-select>
              </el-form-item> -->
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item prop="doctorCode" label="会诊医生:">
                <el-select
                  v-model="conditionForm.consultationDoctorCode"
                  placeholder="请选择医生"
                  class="small-form-item"
                  clearable
                >
                  <el-option
                    v-for="item in consultationDoctorOptions"
                    :key="item.doctorCode"
                    :label="item.doctorName"
                    :value="item.doctorCode"
                  />
                </el-select>
              </el-form-item>

              <el-form-item prop="queryCondition" label="姓名/住院号:">
                <el-input
                  v-model="conditionForm.queryCondition"
                  class="small-form-item"
                />
              </el-form-item>

              <el-form-item prop="isFinished" label="会诊状态:">
                <el-select
                  v-model="conditionForm.isFinished"
                  placeholder="请选择会诊状态"
                  class="small-form-item"
                  clearable
                  @change="onStatusChanged"
                >
                  <el-option
                    v-for="item in status"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item prop="beginDate" label="开始日期:">
                <el-date-picker
                  v-model="conditionForm.beginDate"
                  type="date"
                  class="small-form-item"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                />
              </el-form-item>
              <el-form-item prop="endDate" label="结束日期:">
                <el-date-picker
                  v-model="conditionForm.endDate"
                  type="date"
                  class="small-form-item"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                />
              </el-form-item>
              <el-form-item label=" ">
                <el-button type="primary" @click="onSearch">查询</el-button>

                <el-button type="primary" @click="gotoNew">新增会诊</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <div style="margin: 2px">
          <div style="margin: 10px" />
          <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%"

            stripe
            border
            highlight-current-row
            :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
          >
            <el-table-column prop="hospitalizedNum" label="住院号" align="center" />

            <el-table-column prop="bedNo" label="床号" align="center" />
            <el-table-column
              prop="patientName"
              label="患者姓名"
              align="center"
            />
            <el-table-column
              prop="requestDepartmentName"
              label="申请科室"
              align="center"
            />
            <el-table-column
              prop="requestDoctorName"
              label="申请医生"
              align="center"
            />
            <el-table-column
              prop="requestTime"
              label="申请时间"
              align="center"
            />
            <el-table-column
              prop="consultationDepartmentName"
              label="会诊科室"
              align="center"
            />
            <el-table-column
              prop="consultationDoctorName"
              label="会诊医生"
              align="center"
            />
            <el-table-column

              label="会诊状态"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.isClosed">结束</span>
                <span v-else>会诊中</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="handleConsultation(scope.row)">会诊</el-button>

              </template>

              <template />
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div style="margin: 5px; float: right">
        <el-pagination
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          :page-size.sync="conditionForm.size"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <div>
      <el-dialog
        title="新增质控记录"
        :visible.sync="dialogVisible"
        width="680px"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { getDepartments, getDoctors, queryDoctors } from '@/api/user'
import { queryConsultation } from '@/api/patient'
// import { addPrintStyle } from '@/utils/index'
import { Message } from 'element-ui'
import MyTreeselect from '@/components/common/MyTreeselect.vue'

export default {
  name: 'Consultation',
  components: { MyTreeselect },
  data () {
    // const validateSN = (rule, value, callback) => {
    //   const reg = /^\w{6,18}$/
    //   if (!reg.test(value)) {
    //     callback('仪器SN必须是6-18位')
    //   } else {
    //     callback()
    //   }
    // }
    return {
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      loading: false,
      buttonLoading: false,
      printTableData: [],
      printPageSize: 32,

      doctorOptions: [],
      requestDoctorOptions: [],
      consultationDoctorOptions: [],
      // 默认值
      departDefaultCodes: null,
      addDepartDefaultCodes: null,
      conditionForm: {
        consultationDepartmentCode: '',
        consultationDepartmentName: '',
        consultationDoctorCode: '',
        requestDepartmentCode: '',
        requestDepartmentName: '',
        requestDoctorCode: '',
        isFinished: '',
        departmentName: '',
        beginDate: '',
        endDate: '',
        queryCondition: '',

        size: 20,
        page: 1,
        status: ''
      },
      conditionFormRule: {
        beginDate: [
          { required: true, message: '开始日期必须输入', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '结束日期必须输入', trigger: 'blur' }
        ]
      },
      status: [{ name: '会诊中', key: false }, { name: '结束', key: true }],

      tableData: [],
      total: 0,
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'organizationName',
      'departmentCode',

      'departmentName'
    ])
  },
  created () {
    this.initOptions()
  },
  mounted () {
    this.onSearch()
  },
  methods: {
    initOptions () {
      this.conditionForm.beginDate = moment()
        .subtract(7, 'd')
        .format('YYYY-MM-DD')
      this.conditionForm.endDate = moment()
        .add(14, 'd')
        .format('YYYY-MM-DD')
      getDepartments()
        .then(res => {
          if (this.departmentCode !== null && this.departmentCode !== '') {
            this.departDefaultCodes = []
            this.departDefaultCodes.push(this.departmentCode)
          } else {
            this.departDefaultCodes = null
          }
          this.conditionForm.departmentCode = this.departmentCode
          this.deptOptions = res.dataContent
          this.onQueryRequestDoctor(this.departmentCode)
        })
        .catch(err => {
          console.log(err)
        })

      getDoctors()
        .then(res => {
          this.doctorOptions = res.dataContent
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 申请-选择科室
    changeRequestDepSelHandle (val) {
      this.handleRequestNodeClear()
      this.conditionForm.requestDepartmentCode = val.id
      this.onQueryRequestDoctor(val.id)
    },
    inoutRequestDepChangeHandle (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleRequestNodeClear()
      } else {
        if (Array.isArray(val)) {
          if (val.length > 0) {
            this.onQueryRequestDoctor(val[0])
          }
        } else {
          this.onQueryRequestDoctor(val)
        }
      }
    },
    handleRequestNodeClear () {
      this.requestDoctorOptions = []
      this.conditionForm.requestDepartmentCode = null
      this.conditionForm.requestDoctorCode = null
    },
    changeConsultationDepSelHandle (val) {
      this.handleConsultationNodeClear()
      this.conditionForm.consultationDepartmentCode = val.id
      this.onQueryConsultationDoctor(val.id)
    },
    inoutConsultationDepChangeHandle (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleConsultationNodeClear()
      } else {
        if (Array.isArray(val)) {
          if (val.length > 0) {
            this.onQueryConsultationDoctor(val[0])
          }
        } else {
          this.onQueryConsultationDoctor(val)
        }
      }
    },
    handleConsultationNodeClear () {
      this.consultationDoctorOptions = []
      this.conditionForm.consultationDepartmentCode = null
      this.conditionForm.consultationDoctorCode = null
    },

    onQueryRequestDoctor (doctorCode) {
      this.requestDoctorOptions = []
      queryDoctors(doctorCode).then(res => {
        this.requestDoctorOptions = res.dataContent
      }).catch(err => {
        console.log(err.message)
      })
    },
    onQueryConsultationDoctor (doctorCode) {
      this.consultationDoctorOptions = []
      queryDoctors(doctorCode).then(res => {
        this.consultationDoctorOptions = res.dataContent
      }).catch(err => {
        console.log(err.message)
      })
    },
    onSearch () {
      this.conditionForm.page = 1
      this.query()
    },
    query () {
      this.tableData = []
      this.total = 0
      this.$refs.conditionForm.validate(valid => {
        if (valid) {
          if (this.isValidDateArea()) {
            this.loading = true
            queryConsultation(this.conditionForm)
              .then(res => {
                this.tableData = res.dataContent.records
                this.total = res.dataContent.total
                this.loading = false
              })
              .catch(err => {
                console.log(err)
                Message.error(err.message)
                this.loading = false
              })
          } else {
            Message.error('开始日期必须小于结束日期')
          }
        }
      })
    },
    handleSizeChange (val) {
      this.conditionForm.size = val
      this.query()
    },
    handleCurrentChange (val) {
      this.conditionForm.page = val
      this.query()
    },
    isValidDateArea () {
      if (
        this.conditionForm.beginDate !== null &&
        this.conditionForm.beginDate.length > 0 &&
        this.conditionForm.endDate !== null &&
        this.conditionForm.endDate.length > 0
      ) {
        return moment(this.conditionForm.beginDate).isSameOrBefore(
          this.conditionForm.endDate
        )
      } else {
        return true
      }
    },
    gotoNew () {
      this.$router.push('/list')
    },
    handleConsultation (row) {
      this.$router.push({ path: '/editor', query: { id: row.id, patientId: row.patientId, isClosed: row.isClosed } })
    },
    onStatusChanged (val) {
      // console.log(val)
      // this.conditionForm.isFinished = val
    }
  }
}
</script>
<style scoped>
.main {
  margin: 10px;
}
.form-item {
  width: 290px;
}

.small-form-item {
  width: 200px;
}

.small-form-demo {
  width: 260px;
}
@media print {
  .print-footer {
    display: block !important;
    page-break-before: auto;
    position: fixed;
    bottom: 5px;
    right: 10px;
  }
}
</style>
