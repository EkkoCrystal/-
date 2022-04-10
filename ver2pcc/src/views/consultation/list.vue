/* eslint-disable vue/html-closing-bracket-newline */
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
          label-width="140px"
        >
          <el-row>
            <el-col>
              <el-form-item label="申请科室:" prop="departmentCode">
                <div style="width:200px;height:32px">
                  <my-treeselect ref="selRequestTree" :append-true="true" :mydata="deptOptions" :valuebb="departDefaultCodes" @changeSel="changeRequestDepSelHandle" @inputChanging="inoutRequestDepChangeHandle" />
                </div>
              </el-form-item>
              <!-- <el-form-item prop="departmentCode" label="申请科室:">
                <el-select
                  ref="selRequestTree"
                  v-model="conditionForm.departmentName"
                  class="small-form-item"
                  clearable
                  placeholder="请选择科室"
                  @change="handleChangeRequestDepartment"
                >
                  <el-option
                    :label="conditionForm.departmentName"
                    :value="conditionForm.departmentName"
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
              <el-form-item prop="queryCondition" label="姓名/住院号:">
                <el-input
                  v-model="conditionForm.queryCondition"
                  class="small-form-item"
                />
              </el-form-item>
              <el-form-item prop="beforeBreakfast" label="空腹血糖大于:">
                <el-input
                  v-model="conditionForm.beforeBreakfast"
                  type="number"

                  class="small-form-item"
                  :step="0.1"
                  :min="0"
                  :max="33.4"
                >
                  <template slot="append">mmol/L</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item prop="afterGlu" label="餐后血糖大于:">
                <el-input
                  v-model="conditionForm.afterGlu"
                  class="small-form-item"
                  type="number"
                  :step="0.1"
                  :min="0"
                  :max="33.4"
                >
                  <template slot="append">mmol/L</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="randomGlu" label="随机血糖大于:">
                <el-input
                  v-model="conditionForm.randomGlu"
                  type="number"
                  :step="0.1"
                  :min="0"
                  :max="33.4"
                  class="small-form-item"
                >
                  <template slot="append">mmol/L</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="allGluMaxValue" label="血糖小于:">
                <el-input
                  v-model="conditionForm.allGluMaxValue"
                  type="number"
                  :step="0.1"
                  class="small-form-item"
                  :min="0"
                  :max="33.4"
                >
                  <template slot="append">mmol/L</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item prop="ketValue" label="血酮大于:">
                <el-input
                  v-model="conditionForm.ketValue"
                  type="number"
                  :step="0.1"
                  :min="0"
                  :max="8.1"
                  class="small-form-item"
                >
                  <template slot="append">mmol/L</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="uaValue" label="尿酸大于:">
                <el-input
                  v-model="conditionForm.uaValue"
                  type="number"
                  class="small-form-item"
                  :min="0"
                  :max="1190"
                >
                  <template slot="append">mmol/L</template>
                </el-input>
              </el-form-item>
              <el-form-item label=" ">
                <el-button type="primary" @click="onSearch">查询</el-button>
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
            <el-table-column prop="departmentName" label="科室" align="center" />
            <el-table-column prop="hospitalizedNum" label="住院号" align="center" />
            <el-table-column prop="bed" label="床号" align="center" />
            <el-table-column
              prop="patientName"
              label="患者姓名"
              align="center"
            />

            <el-table-column prop="doctorName" label="医生" align="center" />

            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="handleNewRequest(scope.row)">发起会诊</el-button>
              </template>
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
      <el-dialog title="会诊申请" :visible.sync="dialogVisible" width="780px">
        <div style="width:660px">
          <el-row>
            <el-col :span="1"><div style="line-weight:10px">&nbsp;</div></el-col>

            <el-col :span="4"><b>姓名：</b>{{ patient.patientName }}</el-col>
            <el-col :span="3"><b>性别:</b> {{ patient.genderDisplay }}</el-col>
            <el-col :span="3"><b>年龄:</b> {{ patient.age }}</el-col>
            <el-col :span="4"><b>科室：</b>{{ patient.departmentName }}</el-col>
            <el-col :span="4"><b>床号：</b>{{ patient.bed }}</el-col>
            <el-col :span="4"><b>住院号:</b> {{ patient.hospitalizedNum }}</el-col>

          </el-row>
          <el-row>
            <el-col>
              <div style="padding-top:40px" />
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form
                ref="formConsultation"
                :model="consultation"
                :rules="consultationRules"
                label-width="100px"
                size="small"
              >
                <el-form-item label="会诊科室:" prop="consultationDepartmentCode">
                  <div style="width:300px;height:32px">
                    <my-treeselect ref="selConsultationTree" :append-true="false" :mydata="deptOptions" :valuebb="addDepartDefaultCodes" @changeSel="changeConsultationDepSelHandle" @inputChanging="inoutConsultationDepChangeHandle" />
                  </div>
                </el-form-item>
                <!-- <el-form-item label="会诊科室:" prop="consultationDepartmentCode">
                  <el-select
                    ref="selConsultationTree"
                    v-model="consultation.consultationDepartmentName"
                    class="dialog-form-item"
                    clearable
                    placeholder="请选择科室"
                    @change="handleChangeConsultationDepartment"
                    @clear="handleClearConsultationDepartment"
                  >
                    <el-option
                      :label="consultation.consultationDepartmentName"
                      :value="consultation.consultationDepartmentName"
                    />
                    <el-tree
                      highlight-current
                      default-expand-all
                      :expand-on-click-node="false"
                      :data="deptOptions"
                      :props="defaultProps"
                      @node-click="handleConsultationNodeClick"
                    />
                  </el-select>
                </el-form-item> -->
                <el-form-item prop="doctorCode" label="会诊医生:">
                  <el-select
                    v-model="consultation.doctorCode"
                    placeholder="请选择医生"
                    class="dialog-form-item"
                    clearable
                  >
                    <el-option
                      v-for="item in doctorSelOptions"
                      :key="item.doctorCode"
                      :label="item.doctorName"
                      :value="item.doctorCode"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item prop="requestTime" label="会诊时间:">
                  <el-date-picker
                    v-model="consultation.requestTime"
                    type="datetime"

                    placeholder="选择日期"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions"
                  />
                </el-form-item>
                <el-form-item prop="content" label="会诊描述:">
                  <el-input
                    v-model="consultation.content"
                    :rows="4"
                    maxlength="256"
                    show-word-limit
                    class="dialog-form-item"
                    type="textarea"
                  />
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleSave"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import moment from 'moment'
import { getDepartments, getDoctors, queryDoctors } from '@/api/user'

import { createConsultation, filterConsultation } from '@/api/patient'
// import { getPatient } from '@/api/patient'
// import { addPrintStyle } from '@/utils/index'
import { Message } from 'element-ui'
import MyTreeselect from '@/components/common/MyTreeselect.vue'

const validatorGluNumber = (rule, value, callback) => {
  if (value) {
    if (Number.isNaN(value)) {
      return callback(new Error('请输入数字'))
    } else {
      if (value < 0 || value > 33.3) {
        return callback(new Error('血糖范围:0-33.3'))
      }
    }
  } else {
    callback()
  }
}
const validatorKetNumber = (rule, value, callback) => {
  if (value) {
    if (Number.isNaN(value)) {
      return callback(new Error('请输入数字'))
    } else {
      if (value < 0 || value > 8.1) {
        return callback(new Error('血酮范围:0-8.1'))
      }
    }
  } else {
    callback()
  }
}
const validatorUaNumber = (rule, value, callback) => {
  if (value) {
    if (Number.isNaN(value)) {
      return callback(new Error('请输入数字'))
    } else {
      if (value < 0 || value > 1190) {
        return callback(new Error('尿酸范围:0-1190'))
      }
    }
  } else {
    callback()
  }
}

export default {
  name: 'List',
  components: { MyTreeselect },
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < (Date.now() - 86400000)
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      deptOptions: [],
      doctorOptions: [],
      doctorSelOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      patient: {},
      tableData: [],
      total: 0,
      loading: false,
      dialogVisible: false,
      // 默认值
      departDefaultCodes: null,
      // 新增默认null
      addDepartDefaultCodes: null,
      conditionForm: {
        departmentCode: '',
        departmentName: '',
        queryCondition: '',

        beforeBreakfast: null,
        afterGlu: null,
        randomGlu: null,
        allGluMaxValue: null,
        ketValue: null,
        uaValue: null,

        page: 1,
        size: 20
      },
      conditionFormRule: {
        requestDepartmentCode: [
          { required: true, message: '申请科室必须选择', trigger: 'change' }
        ],
        beforeBreakfast: [

          { validator: validatorGluNumber, message: '血糖范围0-33.4', trigger: 'blur,change' }
        ],
        afterGlu: [

          { validator: validatorGluNumber, message: '血糖范围0-33.4', trigger: 'blur,change' }
        ],
        randomGlu: [

          { validator: validatorGluNumber, message: '血糖范围0-33.4', trigger: 'blur,change' }
        ],
        allGluMaxValue: [

          { validator: validatorGluNumber, message: '血糖范围0-33.4', trigger: 'blur,change' }
        ],
        ketValue: [

          { validator: validatorKetNumber, message: '血酮范围0-8.1', trigger: 'blur,change' }
        ],
        uaValue: [

          { validator: validatorUaNumber, message: '尿酸范围0-1190', trigger: 'blur,change' }
        ]
      },
      consultation: {
        consultationDepartmentCode: '',
        consultationDepartmentName: '',
        doctorCode: '',
        requestTime: '',
        patientId: 0,
        content: ''

      },
      consultationRules: {
        consultationDepartmentCode: [
          { required: true, message: '会诊科室必须选择', trigger: 'change' }
        ],
        doctorCode: [
          { required: true, message: '会诊医生必须选择', trigger: 'change' }
        ],
        requestTime: [
          { required: true, message: '会诊时间必须选择', trigger: 'change' }
        ],
        content: [
          { required: true, message: '会诊描述必须输入', trigger: 'blur' }
        ]
      }

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
      this.conditionForm.departmentCode = this.departmentCode
      this.conditionForm.departmentName = this.departmentName
      getDepartments()
        .then(res => {
          // 默认值
          if (this.departmentCode !== null && this.departmentCode !== '') {
            this.departDefaultCodes = []
            this.departDefaultCodes.push(this.departmentCode)
          } else {
            this.departDefaultCodes = null
          }
          this.conditionForm.departmentCode = this.departmentCode
          this.deptOptions = res.dataContent
          this.onSearch()
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
    // 申请-选择科室
    changeRequestDepSelHandle (val) {
      this.handleRequestNodeClear()
      this.conditionForm.requestDepartmentCode = val.id
    },
    inoutRequestDepChangeHandle (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleRequestNodeClear()
      }
    },
    handleRequestNodeClear () {
      this.conditionForm.requestDepartmentCode = null
    },
    // handleChangeRequestDepartment (val) {
    //   this.conditionForm.departmentCode = ''
    //   this.conditionForm.departmentName = ''
    // },
    // handleReqeustNodeClick (data) {
    //   this.conditionForm.departmentCode = data.code
    //   this.conditionForm.departmentName = data.name
    //   this.$refs.selRequestTree.blur()
    //   this.$refs['conditionForm'].clearValidate()
    // },

    // handleChangeConsultationDepartment (val) {
    //   this.consultation.consultationDepartmentCode = ''
    //   this.consultation.consultationDepartmentName = ''
    // },
    // handleConsultationNodeClick (data) {
    //   this.consultation.consultationDepartmentCode = data.code
    //   this.consultation.consultationDepartmentName = data.name
    //   this.onQueryDoctors(data.code)
    //   this.$refs.selConsultationTree.blur()
    // },
    // handleClearConsultationDepartment (data) {
    //   this.doctorSelOptions = []
    //   this.consultation.doctorCode = null
    // },
    changeConsultationDepSelHandle (val) {
      this.handleConsultationNodeClear()
      this.consultation.consultationDepartmentCode = val.id
      this.onQueryDoctors(val.id)
    },
    inoutConsultationDepChangeHandle (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleConsultationNodeClear()
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
    handleConsultationNodeClear () {
      this.doctorSelOptions = []
      this.consultation.consultationDepartmentCode = null
      this.consultation.doctorCode = null
    },
    onQueryDoctors (code) {
      this.doctorSelOptions = []
      queryDoctors(code).then(res => {
        this.doctorSelOptions = res.dataContent
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
      })
    },
    onSearch () {
      this.query()
    },
    query () {
      this.$refs.conditionForm.validate(valid => {
        if (valid) {
          filterConsultation(this.conditionForm).then(res => {
            this.loading = false
            this.tableData = res.dataContent.records
            this.total = res.dataContent.total
          })
            .catch(err => {
              this.loading = false
              Message.error(err.message)
            })
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
    handleNewRequest (row) {
      // console.log(row)
      this.patient = row
      this.dialogVisible = true

      // this.$router.push({ path: '/consultation/editor', query: { id: row.id } })
    },

    navigateIndexPage () {
      this.$router.push({ path: '/consultation' })
    },

    handleSave () {
      this.consultation.patientId = this.patient.id

      this.$refs.formConsultation.validate(valid => {
        if (valid) {
          createConsultation(this.consultation).then(res => {
            this.dialogVisible = false

            this.navigateIndexPage()
          }).catch(err => {
            Message.error(err.message)
            console.log(err)
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.small-form-item {
  width: 200px;
}
.dialog-form-item {
  width:400px;
}
</style>

<style>
.el-dialog__header {
  border-bottom: 1px solid #e8eaec;
}
.el-dialog__footer {
  border-top: 1px solid #e8eaec;
}
</style>
