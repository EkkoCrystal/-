<template>
  <div>
    <el-card>
      <el-form
        ref="searchForm"
        v-model="searchForm"
        size="small"
        :inline="true"
        label-width="80px"
      >
        <el-form-item prop="queryCondition" label="查询条件:">
          <el-input
            v-model="searchForm.queryCondition"
            width="280px"
            maxlength="32"
            placeholder="姓名/床号/住院号"
          />
        </el-form-item>
        <!-- 科室 -->
        <el-form-item label="科室:">
          <div style="width:200px;height:32px">
            <my-treeselect ref="selTree" :append-true="true" :mydata="deptOptions" :valuebb="departDefaultCodes" @changeSel="changeDepentSelHandle" @inputChanging="inoutDepentChangeHandle" />
          </div>
        </el-form-item>
        <el-form-item prop="doctorCode" label="医生:">
          <el-select
            v-model="searchForm.doctorCode"
            placeholder="请选择医生"
            clearable
          >
            <el-option
              v-for="item in doctorOptions"
              :key="item.doctorCode"
              :label="item.doctorName"
              :value="item.doctorCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleNewPatient"
          >新增患者</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-row>
      <el-col :span="7">
        <el-card style="margin: 10px">
          <div slot="header" class="clearfix">
            <span>本日危机值监控</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="moreHandle">更多</el-button>
          </div>
          <div>
            <el-table
              v-loading="loading"
              :data="crisisValues"
              style="width: 100%"
              stripe
              border
              highlight-current-row
              :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
            >
              <el-table-column
                prop="bed"
                label="床号"
                align="center"
                width="80"
              />
              <el-table-column
                prop="patientName"
                align="center"
                label="姓名"
                width="80"
              />
              <el-table-column label="检测结果" align="center" prop="records">
                <template slot-scope="scope" align="left">
                  <div v-for="(item, index) in scope.row.records" :key="index">
                    <el-row :span="12">
                      <span v-if="item.determineType === 'Low'" :style="{'color': criticalValueInfo.minColor}">
                        {{ item.periodName }}&nbsp;&nbsp;{{ item.testValue }}&nbsp;mmol/L&nbsp;↓
                      </span>
                      <span v-if="item.determineType === 'High'" :style="{'color': criticalValueInfo.maxColor}">
                        {{ item.periodName }}&nbsp;&nbsp;{{ item.testValue }}&nbsp;mmol/L&nbsp;↑
                      </span>
                    </el-row>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="17">
        <el-card v-model="tableData" style="height: 100%; margin: 10px">
          <div slot="header" class="clearfix">
            <span>患者列表</span>
          </div>
          <div style="margin-bottom:20px">
            <div>
              <div style="min-height: 700px">
                <el-link
                  v-for="(item, index) in tableData.myList"
                  :key="index"
                  :underline="false"
                  @click="clickNavigate(item.id)"
                >
                  <el-card v-loading="loading" class="box-card">
                    <div slot="header" style="padding: 5px">
                      <div>
                        <el-row>
                          <el-col :span="12">
                            <div style="font-size: 16px; font-weight: bold">
                              {{ item.bed }}床
                            </div>
                          </el-col>
                          <el-col :span="12">
                            <div
                              style="
                                font-size: 20px;
                                font-weight: bold;
                                text-align: right;
                              "
                            >
                              {{ item.patientName }}
                            </div>
                          </el-col>
                        </el-row>
                        <!-- <el-row>
                          <el-col>&nbsp;</el-col>
                        </el-row> -->
                        <el-row style="margin-top:15px">
                          <el-col :span="12">
                            <div style="font-size: 12px">
                              {{ item.hospitalizedNum }}({{
                                item.departmentName
                              }})
                            </div>
                          </el-col>
                          <el-col :span="12">
                            <div
                              style="
                                font-size: 12px;
                                font-weight: bold;
                                text-align: right;
                              "
                            >
                              {{ item.genderDisplay }} &nbsp;&nbsp;{{
                                item.age
                              }}岁
                            </div>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                    <div
                      style="margin: 2px; color: #000000ae; font-size: 12px"
                    >
                      <span style="font-size: 18px">
                        <span
                          v-if="item.lastTestRecord !== null"
                          :class="item.lastTestRecord.determineType"
                        >
                          <div style="margin: 5px">
                            <span v-if="item.lastTestRecord.unenforced">
                              {{ item.lastTestRecord.categoryDisplay }}&nbsp;{{
                                item.lastTestRecord.periodName
                              }}&nbsp;{{ item.lastTestRecord.testValue }}
                            </span>
                            <span v-else>
                              {{ item.lastTestRecord.categoryDisplay }} &nbsp;{{
                                item.lastTestRecord.periodName
                              }}&nbsp;{{ item.lastTestRecord.testValue }}
                              <span
                                v-show="
                                  item.lastTestRecord.testValue !== 'LOW' &&
                                    item.lastTestRecord.testValue !== 'HIGH'
                                "
                                style="margin: 4px"
                              >
                                mmol/L &nbsp;
                                <span
                                  v-if="
                                    item.lastTestRecord.determineType === 'High'
                                  "
                                >↑</span>
                                <span
                                  v-if="
                                    item.lastTestRecord.determineType === 'Low'
                                  "
                                >↓</span>
                              </span>
                            </span>
                          </div>
                          <div style="margin: 5px">
                            {{ item.lastTestRecord.testTime | dateFormate }}
                          </div>
                        </span>
                        <span v-else>--</span>
                      </span>
                    </div>
                  </el-card>
                </el-link>
                <div v-if="tableData.myList.length === 0">
                  <el-card class="box-card">暂无数据</el-card>
                </div>
              </div>
              <div
                style="
                  position: absolute;
                  bottom: 5px;
                  margin: 10px;
                  right: 5px;
                "
              >
                <el-pagination
                  :page-sizes="[10, 20, 30, 50]"
                  layout="total, sizes, prev, pager, next"
                  :total="total"
                  :page-size.sync="searchForm.size"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="kk">
      <el-dialog
        title="新增患者"
        :visible.sync="dialogVisible"
        width="720px"
        class="dialog"
        :close-on-click-modal="false"
        @close="closedDialog"
      >
        <el-divider />
        <span>
          <el-form
            ref="patientForm"
            style="width: 100%"
            :rules="patientFormRules"
            :model="patientForm"
            size="mini"
            label-width="90px"
          >
            <el-row :gutter="4">
              <el-col :span="10">
                <el-form-item label="姓名" prop="patientName">
                  <el-input v-model="patientForm.patientName" />
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="性别" prop="gender">
                  <el-select
                    v-model="patientForm.gender"
                    placeholder="请选择性别"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in genderOptions"
                      :key="item.code"
                      :label="item.display"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="4">
              <el-col :span="10">
                <el-form-item label="出生日期" prop="birthday">
                  <el-date-picker
                    v-model="patientForm.birthday"
                    style="width: 100%"
                    type="date"
                    placeholder="选择出生日期"
                    :picker-options="pickerOptions"
                    @change="changeGetAge"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="年龄">
                  <el-input
                    v-model="patientForm.age"
                    readonly
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="4">
              <el-col :span="10">
                <el-form-item label="身份证" prop="idCard" @change="handleNull">
                  <el-input v-model="patientForm.idCard" />
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="住院号" prop="hospitalizedNum">
                  <el-input v-model="patientForm.hospitalizedNum" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="4">
              <el-col :span="10">
                <el-form-item label="入院日期" prop="hospitalizedDate">
                  <el-date-picker
                    v-model="patientForm.hospitalizedDate"
                    style="width: 100%"
                    type="date"
                    placeholder="选择住院日期"
                    :picker-options="pickerOptions"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="腕带码" prop="code">
                  <el-input v-model="patientForm.code" @change="handleNull" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="4">
              <el-col :span="10">
                <el-form-item label="床号" prop="bed">
                  <el-input v-model="patientForm.bed" style="width: 100%" />
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="联系方式" prop="phoneNumber">
                  <el-input
                    v-model="patientForm.phoneNumber"
                    type="tel"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="4">
              <el-col :span="10">
                <el-form-item prop="departmentCode" label="科室:">
                  <div style="width:200px;height:30px" class="pp">
                    <my-treeselect ref="selPatientTree" :append-true="false" :valuebb="addDepartDefaultCodes" :mydata="addDeptOptions" @changeSel="changePatientSelHandle" @inputChanging="inoutPatientChangeHandle" />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="医生" prop="doctorCode">
                  <el-select
                    v-model="patientForm.doctorCode"
                    clearable
                    placeholder="请选择医生"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in patientDoctorOptions"
                      :key="item.doctorCode"
                      :label="item.doctorName"
                      :value="item.doctorCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button
            size="small"
            plain
            type="primary"
            @click="dialogVisible = false"
          >取 消</el-button>
          <el-button
            type="primary"
            size="small"
            :loading="addHandle"
            @click="handleCreatePatient"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { findPatient, createPatient, findCrisisValue } from '@/api/patient'
// import { getTodayJobCount } from '@/api/advice'
import { getGenders, getDepartments, queryDoctors, getCrisisValueInfo } from '@/api/user'
import { Message } from 'element-ui'
import MyTreeselect from '@/components/common/MyTreeselect.vue'

export default {
  name: 'Dashboard',
  components: { MyTreeselect },
  filters: {
    dateFormate (val) {
      return moment(val).format('MM-DD HH:mm')
    }
  },
  data () {
    const validateIdCard = (rule, value, callback) => {
      if (value === null || value === '' || value.length === 0) {
        value = null
        callback()
      } else {
        // 15-18
        if (value.length < 15 || value.length > 18) {
          callback('身份证长度必须是15-18位')
        } else {
          callback()
        }
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value === null || value === '' || value.length === 0) {
        value = null
        callback()
      } else {
        // 15-18
        if (value.length < 3 || value.length > 32) {
          callback('腕带码长度必须是3-32')
        } else {
          callback()
        }
      }
    }
    const validateIphoneCode = (rule, value, callback) => {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (value === '' || value === undefined || value === null) {
        callback()
      } else {
        if ((!reg.test(value)) && value !== '') {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }
    }
    return {
      timer: null,
      tableData: {
        myList: []
      },
      crisisValues: [],
      criticalValueInfo: {},
      taskDetail: null,
      caption: '',
      loading: false,
      total: 0,
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'

      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      genderOptions: [],
      doctorOptions: [

      ],
      patientDoctorOptions: [],
      searchForm: {
        queryCondition: '',
        doctorCode: '',
        departmentCode: null,
        page: 1,
        size: 10,
        total: 0
      },
      // 默认值
      departDefaultCodes: null,
      // 新增默认null
      addDepartDefaultCodes: null,
      addDeptOptions: [],
      dialogVisible: false,
      addHandle: false,
      patientForm: {
        patientName: '',
        gender: '',
        birthday: '',
        idCard: null,
        hospitalizedNum: '',
        phoneNumber: '',
        hospitalizedDate: '',
        code: null,
        departmentCode: null,
        departmentName: null,
        bed: '',
        doctorCode: '',
        age: null

      },
      patientFormRules: {
        patientName: [
          { required: true, message: '姓名必须输入', trigger: 'blur' },
          { min: 2, max: 10, message: '姓名2-10位字符', trigger: 'blur' }

        ],
        bed: [
          { required: true, message: '床号必须输入', trigger: 'blur' },
          { min: 1, max: 12, message: '床号长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '性别必须选择', trigger: 'change' }
        ],
        code: [
          // { min: 3, max: 32, message: '腕带码长度在 3 到 32 个字符', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' }
        ],
        idCard: [
          // { min: 15, max: 18, message: '身份证长度在 15 到 18 个字符', trigger: 'blur' },
          { validator: validateIdCard, trigger: 'blur' }
        ],

        birthday: [
          { required: true, trigger: 'change', message: '出生日期必须输入' }
        ],
        hospitalizedNum: [
          { min: 4, max: 18, message: '住院号 4 到18 个字符', trigger: 'blur' },
          { required: true, trigger: 'blur', message: '住院号必须输入' }
        ],
        departmentCode: [
          { required: true, trigger: 'change', message: '科室必须选择' }
        ],
        doctorCode: [
          { required: true, trigger: 'change', message: '医生必须选择' }

        ],
        phoneNumber: [
          { validator: validateIphoneCode, trigger: 'blur' }
        ]
        // hospitalizedDate: [
        //   { required: true, trigger: 'blur', message: '出生日期必须输入' }
        // ]
      },

      // define the default value
      value: null
      // define options
    }
  },
  computed: {
    ...mapGetters(['name', 'token', 'departmentCode', 'departmentName'])

  },
  mounted () {
    // this.onSearch()
  },
  created () {
    this.init()
  },

  methods: {
    init () {
      this.initOptions()
    },
    onSearch () {
      this.searchForm.page = 1
      this.loadData()
      // 危机值
      this.initCrisisData('GLU')
    },
    loadData () {
      this.loading = true
      this.tableData.myList = []
      findPatient(this.searchForm).then(res => {
        this.tableData.myList = res.dataContent.records
        this.total = res.dataContent.total
        this.loading = false
      }).catch(err => {
        this.loading = false
        Message.error(err.message)
      })
      // 本日危机值检测
      findCrisisValue(this.searchForm).then(res => {
        this.crisisValues = res.dataContent
        this.loading = false
      }).catch(err => {
        this.loading = false
        Message.error(err.message)
      })
    },
    // 跳转血糖统计
    // fix: 菜单判断
    moreHandle () {
      this.$router.push({
        path: '/data/critical',
        query: {
          minValue: this.criticalValueInfo.minValue,
          maxValue: this.criticalValueInfo.maxValue
        }
      })
    },
    initOptions () {
      getDepartments().then(res => {
        // 默认值
        if (this.departmentCode !== null && this.departmentCode !== '') {
          this.departDefaultCodes = []
          this.departDefaultCodes.push(this.departmentCode)
          this.addDepartDefaultCodes = []
          this.addDepartDefaultCodes.push(this.departmentCode)
        } else {
          this.departDefaultCodes = null
          this.addDepartDefaultCodes = null
        }
        this.searchForm.departmentCode = this.departmentCode
        this.deptOptions = res.dataContent
        this.addDeptOptions = res.dataContent
        // 加载默认医生
        this.onQueryDoctors(this.departmentCode)
        this.onSearch()
      }).catch(err => {
        console.log(err)
      })

      getGenders().then(res => {
        this.genderOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
    },

    // fix: 如果接口失败,需要设置默认值吗
    initCrisisData (val) {
      // 危急值配置
      getCrisisValueInfo(val).then(res => {
        this.criticalValueInfo = res.dataContent
      }).catch(err => {
        console.log(err)
      })
    },
    // 患者查询-选择科室
    changeDepentSelHandle (val) {
      this.handleNodeClear()
      this.searchForm.departmentCode = val.id
      this.onQueryDoctors(val.id)
    },
    inoutDepentChangeHandle (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleNodeClear()
      } else {
        if (Array.isArray(val)) {
          if (val.length > 0) {
            this.onQueryDoctors(val[0])
          }
        } else {
          this.onQueryDoctors(val)
        }
      }
    },
    handleNodeClear () {
      this.doctorOptions = []
      this.searchForm.departmentCode = null
      this.searchForm.doctorCode = null
    },
    // 新增患者=选择科室
    changePatientSelHandle (val) {
      this.handlePatientNodeClear()
      this.patientForm.departmentCode = val.id
      this.onQueryPatientDoctors(val.id)
    },
    inoutPatientChangeHandle (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handlePatientNodeClear()
      } else {
        if (Array.isArray(val)) {
          if (val.length > 0) {
            this.onQueryPatientDoctors(val[0])
          }
        } else {
          this.onQueryPatientDoctors(val)
        }
      }
    },
    handlePatientNodeClear () {
      this.patientDoctorOptions = []
      this.patientForm.departmentCode = null
      this.patientForm.doctorCode = null
    },
    clickNavigate (id) {
      // const routeUrl = this.$router.resolve({
      //   path: '/detail',
      //   query: { id: id }
      // })

      // window.open(routeUrl.href, '_blank')
      this.$router.push({
        path: '/detail',
        query: { id: id, isOutpatient: 'false' }
      })
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      this.loadData()
    },
    handleSizeChange (val) {
      this.searchForm.size = val
      this.loadData()
    },
    onQueryDoctors (code) {
      this.doctorOptions = []
      queryDoctors(code).then(res => {
        this.doctorOptions = res.dataContent
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
      })
    },
    onQueryPatientDoctors (code) {
      this.patientDoctorOptions = []
      queryDoctors(code).then(res => {
        this.patientDoctorOptions = res.dataContent
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
      })
    },
    handleNewPatient () {
      // 加载默认值
      this.patientForm = {
        patientName: '',
        gender: '',
        birthday: '',
        idCard: null,
        hospitalizedNum: '',
        phoneNumber: '',
        hospitalizedDate: '',
        code: null,
        departmentCode: this.departmentCode,
        departmentName: null,
        bed: '',
        doctorCode: '',
        age: null
      }
      this.addDepartDefaultCodes = []
      this.addDepartDefaultCodes.push(this.departmentCode)
      this.onQueryPatientDoctors(this.departmentCode)

      this.dialogVisible = true
    },
    changeGetAge (e) {
      var date = moment(new Date()).format('YYYY-MM-DD')
      var date1 = new Date(date)
      var eDate = moment(e).format('YYYY-MM-DD')
      var eDate1 = new Date(eDate)
      const age =
          date1.getFullYear() -
          eDate1.getFullYear() -
          (date1.getMonth() < eDate1.getMonth() ||
          (date1.getMonth() === eDate1.getMonth() &&
          date1.getDate() < eDate1.getDate())
            ? 1
            : 0)
      this.patientForm.age = age
    },
    handleCreatePatient () {
      this.$refs.patientForm.validate(valid => {
        if (valid) {
          if (this.patientForm.code === null || this.patientForm.code === '') {
            this.patientForm.code = null
          }
          if (this.patientForm.idCard === null || this.patientForm.idCard === '') {
            this.patientForm.idCard = null
          }
          this.addHandle = true
          createPatient(this.patientForm).then(res => {
            this.addHandle = false
            this.dialogVisible = false
            Message.success('创建患者信息成功')
            this.loadData()
          }).catch(err => {
            console.log(err)
            this.addHandle = false
            Message.error(err.message)
          })
        }
      })
    },
    closedDialog () {
      this.$refs.patientForm.resetFields()
      this.dialogVisible = false
    },
    handleNull (val) {

    }
  }
}

</script>

<style>
.box-card {
  width: 300px;
  /* height: 242px; */
  height: 220px;
  float: left;
  margin: 5px 5px 5px 15px;
}
.txt-collapse {
    display: inline-block;
    width:60px;
    font-size:0.5em;
    text-align: left;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.txt-collapse-full {
    display: inline-block;
    width:80px;
    font-size:0.5em;
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
.Low {
  color: blue;
}
.High {
  color: red;
}
.lowColor {
  color: blue;
}
.highColor {
  color: red;
}
.del-advice {
  color:rgb(202, 202, 202)
}

</style>
