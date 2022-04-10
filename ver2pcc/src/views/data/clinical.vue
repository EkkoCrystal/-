<template>
  <div>
    <el-card>
      <el-form
        ref="coditionForm"
        v-model="conditionForm"
        :inline="true"
        size="small"
        label-width="80px"
      >
        <el-row>
          <el-col>
            <el-form-item label="项目类型:">
              <el-select
                v-model="conditionForm.category"
                placeholder="请选择"
                class="search-item"
                autocomplete
              >
                <el-option
                  v-for="item in testOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <!-- 科室选择 -->
            <el-form-item label="科室:">
              <div style="width:200px;height:32px">
                <my-treeselect ref="selTree" :append-true="true" :mydata="deptOptions" :valuebb="departDefaultCodes" @changeSel="changeDepentSelHandle" @inputChanging="inoutDepentChangeHandle" />
              </div>
            </el-form-item>
            <!-- <el-form-item prop="departmentCode" label="科室:">
              <el-select
                ref="selTree"
                v-model="conditionForm.departmentName"
                class="search-item"
                placeholder="请选择科室"
                clearable
                @change="handleChangeDepartment"
                @clear="handleNodeClear"
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
                  @node-click="handleNodeClick"
                />
              </el-select>
            </el-form-item> -->
            <el-form-item prop="doctorCode" label="医生:">
              <el-select
                v-model="conditionForm.doctorCode"
                placeholder="请选择医生"
                clearable
                class="search-item"
              >
                <el-option
                  v-for="item in doctorOptions"
                  :key="item.doctorCode"
                  :label="item.doctorName"
                  :value="item.doctorCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item prop="queryCondition" label="查询条件:">
              <el-input
                v-model="conditionForm.queryCondition"
                class="search-item"
                maxlength="32"
                placeholder="姓名/床号"
              />
            </el-form-item>
            <el-form-item prop="beginDate" label="开始日期:">
              <el-date-picker
                v-model="conditionForm.beginDate"
                type="date"
                class="search-item"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item prop="endDate" label="结束日期:">
              <el-date-picker
                v-model="conditionForm.endDate"
                type="date"
                class="search-item"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onSearch"
              >查询</el-button>
              <el-button
                v-loading="buttonLoading"
                size="small"
                type="primary"
                @click="vuePrint"
              >打印</el-button>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div style="margin:5px">
      <el-table
        v-loading="loading"
        :data="tableData"

        style="width: 100%"
        stripe
        border
        highlight-current-row
        :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
      >
        <el-table-column
          prop="testTime"
          label="检测日期"
          width="250"
          align="center"
        />
        <el-table-column
          prop="departmentName"
          width="180"
          align="center"
          label="科室"
        />

        <el-table-column
          prop="bed"
          width="180"
          align="center"
          label="床号"
        />
        <el-table-column prop="patientName" label="姓名" align="center" width="130">
          <template slot-scope="scope">
            <el-link @click="clickNavigate(scope.row.patientId)">{{ scope.row.patientName }}</el-link>
          </template>
        </el-table-column>

        <el-table-column
          prop="categoryDisplay"
          label="项目类型"
          width="180"
          align="center"
        />

        <el-table-column

          prop="testValue"
          label="检测结果"

          align="center"
        >
          <template slot-scope="scope">
            <span :class="scope.row.determineType">
              {{ scope.row.testValue }}&nbsp;&nbsp;<span v-if="scope.row.determineType==='High'">↑</span>
              <span v-if="scope.row.determineType==='Low'">↓</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="unit"
          label="单位"
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
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="editRow(scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              @click="deleteRow(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div style="clear:both;float:right;margin:10px">
      <el-pagination
        layout="total,sizes,  prev, pager, next"
        :total="conditionForm.total"
        :page-sizes="[10, 20, 30, 50]"
        :page-size.sync="conditionForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="dialogVisible" width="700px">
      <el-card>
        <div style="margin:20px">
          <el-form ref="resultForm" :rules="resultFormRules" :model="resultForm" size="small" label-width="120px">
            <el-form-item label="姓名:">
              {{ resultForm.patientName }}
            </el-form-item>
            <el-form-item label="检测日期:" prop="testTime">
              <el-date-picker
                v-model="resultForm.testTime"
                style="width:200px"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期日期"
              />
            </el-form-item>

            <el-form-item label="检测结果:" prop="result">
              <div style="width:410px">
                <el-radio-group v-model="resultForm.unenforced" @change="groupChanged">
                  <el-radio :label="false">{{ itemName }}值</el-radio>
                  <el-radio :label="true">未测原因</el-radio>
                </el-radio-group>
                <el-card>
                  <div v-if="!resultForm.unenforced">
                    <el-radio-group v-model="selType" style="width:100%">

                      <el-row>
                        <el-col :span="8">

                          <el-radio :label="true">可测范围</el-radio>

                        </el-col>
                        <el-col :span="8">
                          <div v-if="selType">
                            <el-input-number
                              v-model="normalValue"
                              :min="0"
                              :max="1000"
                            />
                          </div>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col>&nbsp;</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8">
                          <el-radio :label="false">不可测范围</el-radio>
                        </el-col>
                        <el-col :span="8">
                          <div v-if="!selType">
                            <el-select
                              v-model="textValue"
                              placeholder="请选择"
                              autocomplete
                              @change="selResultChanged"
                            >
                              <el-option
                                v-for="item in resultOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </div>
                        </el-col>
                      </el-row>
                    </el-radio-group>

                  </div>
                  <div v-else>
                    <div style="padding:10px">

                      <el-select
                        v-model="rejectReason"
                        style="width:200px"
                        placeholder="请选择"

                        autocomplete
                        @change="selRejectChanged"
                      >
                        <el-option
                          v-for="item in rejectOptions"
                          :key="item.key"
                          :label="item.name"
                          :value="item.key"
                        />
                      </el-select>
                    </div>

                    <div v-if="rejectReason==='Other'" style="padding:10px">
                      <el-input
                        v-model="resultForm.cause"
                        style="width:200px"
                        :rows="4"
                        type="textarea"
                        placeholder="请输入其他原因"
                        maxlength="18"
                        show-word-limit
                      />
                    </div>
                  </div>
                </el-card>
              </div>
            </el-form-item>
            <el-form-item label="备注:">
              <div>
                <el-input
                  v-model="resultForm.remark"
                  style="width:410px"
                  :rows="6"
                  type="textarea"
                  placeholder="请输入内容"
                  maxlength="60"
                  show-word-limit
                />
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleUpdateData"
        >确 定</el-button>
      </span>
    </el-dialog>
    <div id="printContent" ref="printContent" style="margin:5px;display:none">
      <div class="print-header-content">
        <el-row>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="12">
            <div style="text-align:center;font-size:16pt">
              <div>{{ organizationName }}</div>
              <div style="margin:5px">慢病检测记录表</div>
            </div>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>

      </div>
      <div style="margin:10px" />
      <div>
        <div v-for="table in printTableData" :key="table.key">

          <div class="table">
            <div class="table-tr">
              <div class="table-td-xlg">检测日期</div>
              <div class="table-td">床号</div>

              <div class="table-td">姓名</div>

              <div class="table-td">项目类型</div>
              <div class="table-td">检测结果</div>
              <div class="table-td">单位</div>
              <div class="table-td">检测人</div>
              <div class="table-td">备注</div>

            </div>
            <div v-for="(item,index) in table.data" :key="index" class="table-tr">
              <div class="table-td">  {{ item.testTime }}</div>
              <div class="table-td">  {{ item.bed }}</div>

              <div class="table-td"> {{ item.patientName }}</div>
              <div class="table-td"> {{ item.categoryDisplay }}</div>
              <div class="table-td-lg">
                <span :class="item.determineType">
                  {{ item.testValue }}&nbsp;&nbsp;<span v-if="item.determineType==='High'">↑</span>
                  <span v-if="item.determineType==='Low'">↓</span>
                </span>
              </div>
              <div class="table-td"> {{ item.unit }}</div>
              <div class="table-td"> {{ item.testUser }}</div>
              <div class="table-td"> {{ item.remark }}</div>

            </div>

          </div>

          <div class="print-footer">
            审核人:________________
          </div>

          <div calss="table-tr" style="page-break-after:always" />

        </div>

      </div>

    </div>
    <iframe id="iframe" style="display:none;" />
  </div>
</template>

<script>
// import moment from 'moment'
import { mapGetters } from 'vuex'
import {
  queryTestData,
  testResultChangeStatus,
  getPeriodOptions,
  getRejectReason,
  updateTestResult
} from '@/api/test'
import { queryDoctors, getGenders, getDepartments } from '@/api/user'
// import { addPrintStyle } from '@/utils/index'
import { Message } from 'element-ui'
import moment from 'moment'
import MyTreeselect from '@/components/common/MyTreeselect.vue'

export default {
  name: 'Clinical',
  components: { MyTreeselect },
  data () {
    return {
      loading: false,
      buttonLoading: false,
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      precision: 1,
      defaultValue: 10,

      genderOptions: [],
      doctorOptions: [],
      periodOptions: [],
      printTableData: [],
      printPageSize: 32,
      printPageCount: 0,
      resultOptions: [
        {
          label: 'LOW',
          value: 'LOW'
        },
        {
          label: 'HIGH',
          value: 'HIGH'
        }
      ],
      testOptions: [
        {
          code: 'KET',
          name: '血酮'
        },
        {
          code: 'UA',
          name: '尿酸'
        }
      ],
      rejectOptions: [

      ],
      // 默认值
      departDefaultCodes: null,
      conditionForm: {
        category: 'KET',
        queryCondition: '',
        beginDate: '',
        endDate: '',
        doctorCode: '',
        departmentCode: '',
        departmentName: '',

        page: 1,
        size: 20,
        total: 0
      },
      title: '',
      itemName: '',
      resultForm: {
        patientName: '',
        category: '',
        id: 0,
        patientId: 0,
        period: '',
        remark: '',
        testTime: '',
        result: '',
        unenforced: '',
        cause: ''
      },
      resultFormRules: {
        patientId: [

          { required: true, message: '病人ID不能为空', trigger: 'blur' }

        ],
        period: [
          { required: true, message: '请选择检测时段', trigger: 'change' }
        ],
        testTime: [
          { required: true, message: '请选择检测日期', trigger: 'change' }
        ],
        result: [
          { required: true, message: '请输入检测结果或者拒测原因', trigger: 'blur' }
        ]
      },
      selType: true,
      normalValue: 0,
      textValue: '',
      rejectReason: '',

      tableData: [],
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['name', 'token', 'organizationName', 'departmentCode'])
  },
  created () {
    this.initOptions()
  },

  methods: {
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
        // 加载默认医生
        this.onQueryDoctors(this.departmentCode)
        this.onSearch()
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
      })

      getGenders().then(res => {
        this.genderOptions = res.dataContent
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
      })

      getPeriodOptions('LongStandards').then(res => {
        this.periodOptions = res.dataContent
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
      })

      getRejectReason().then(res => {
        this.rejectOptions = res.dataContent
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
      })
    },
    isValidDateArea () {
      if (this.conditionForm.beginDate !== null && this.conditionForm.beginDate.length > 0 &&
        this.conditionForm.endDate !== null && this.conditionForm.endDate.length > 0) {
        return moment(this.conditionForm.beginDate).isSameOrBefore(this.conditionForm.endDate)
      } else {
        return true
      }
    },
    onSearch () {
      this.conditionForm.page = 1
      this.loadData()
    },
    loadData () {
      if (this.isValidDateArea()) {
        this.loading = true
        // this.conditionForm.page = 1
        queryTestData(this.conditionForm).then(res => {
          this.tableData = res.dataContent.records
          this.conditionForm.total = res.dataContent.total
          this.loading = false
        }).catch(err => {
          console.log(err)
          this.loading = false
          Message.error(err.message)
        })
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    },
    handleCurrentChange (val) {
      this.conditionForm.page = val
      this.loadData()
    },
    handleSizeChange (val) {
      this.conditionForm.size = val
      this.loadData()
    },
    // 科室选择
    changeDepentSelHandle (val) {
      this.handleNodeClear()
      this.conditionForm.departmentCode = val.id
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
      this.conditionForm.departmentCode = null
      this.conditionForm.doctorCode = null
    },

    onQueryDoctors (code) {
      this.doctorOptions = []
      queryDoctors(code).then(res => {
        this.doctorOptions = res.dataContent
      }).catch(err => {
        console.log(err.message)
      })
    },

    editRow (data) {
      if (data.category === 'KET') {
        this.itemName = '血酮'
        this.title = '修改血酮记录'
        this.precision = 1
      } else {
        this.precision = 0
        this.itemName = '尿酸'
        this.title = '修改尿酸记录'
      }

      this.resultForm = {
        category: data.category,
        id: data.id,
        patientName: data.patientName,
        patientId: data.patientId,
        period: data.period,
        remark: data.remark,
        testTime: data.testTime,
        cause: '',
        result: null,

        unenforced: data.unenforced

      }

      if (data.unenforced) {
        this.rejectReason = data.unenforcedReasonCode
        this.resultForm.result = data.unenforcedReasonCode
        this.resultForm.cause = data.testValue
      } else {
        if (data.testValue !== 'HIGH' && data.testValue !== 'LOW') {
          this.selType = true
          this.normalValue = data.testValue
          this.resultForm.result = data.testValue
        } else {
          this.selType = false
          this.textValue = data.testValue
          this.resultForm.result = data.testValue
        }
      }

      this.dialogVisible = true
    },

    deleteRow (data) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        testResultChangeStatus(data.id, false).then(res => {
          Message.success('删除成功')
          this.loadData()
        }).catch(err => {
          console.log(err)
          Message.error(err.message)
        })
      })
    },

    groupChanged (val) {

    },
    inputChanged (val) {
      // this.resultForm.result = val

      // this.$refs.resultForm.clearValidate()
    },
    selResultChanged (val) {
      // this.$refs.resultForm.clearValidate()
    },
    selRejectChanged (val) {
      // this.$refs.resultForm.clearValidate()
    },
    selectedChange (val) {
      if (val === 'TEK') {
        this.title = '血酮值(mmol/L)'
      }
      if (val === 'UA') {
        this.title = '尿酸值(μmmol/L)'
      }
      // if (val === 'TEK') {
      //   this.precision = 1
      // } else {
      //   this.precision = 0
      // }
      this.conditionForm.page = 1

      this.loadData()
    },

    handleUpdateData () {
      if (this.resultForm.unenforced) {
        this.resultForm.result = this.rejectReason
      } else {
        if (this.selType) {
          this.resultForm.result = this.normalValue
        } else {
          this.resultForm.result = this.textValue
        }
      }
      this.$refs.resultForm.validate(valid => {
        if (valid) {
          updateTestResult(this.resultForm).then(res => {
            Message.success('修改检测记录成功')
            this.loadData()
            this.dialogVisible = false
          }).catch(err => {
            Message.error('修改检测记录失败:' + err.messsage)
          })
        }
      })
    },
    clickNavigate (id) {
      // const routeUrl = this.$router.resolve({
      //   path: '/detail',
      //   query: { id: id, isOutpatient: 'false' }
      // })

      // window.open(routeUrl.href, '_blank')
      this.$router.push({
        path: '/detail',
        query: { id: id, isOutpatient: 'false' }
      })
    },
    checkFormDate (form) {
      if (form.beginDate === null || form.beginDate === '') {
        Message.error('开始日期必须输入')
        return false
      }
      if (form.endDate === null || form.endDate === '') {
        Message.error('结束日期必须输入')
        return false
      }
      return true
    },
    async vuePrint () {
      if (!this.checkFormDate(this.conditionForm)) {
        return
      }
      if (this.isValidDateArea()) {
        this.buttonLoading = true
        // Category require
        const url = this.$baseConfig.reportServiceUrl + '/report/depRecordReport' +
        '?Category=' + this.conditionForm.category +
        '&QueryCondition=' + this.conditionForm.queryCondition +
        '&Begin=' + this.conditionForm.beginDate +
        '&End=' + this.conditionForm.endDate +
        '&DepartmentCode=' + this.conditionForm.departmentCode +
        '&DoctorCode=' + this.conditionForm.doctorCode +
        '&token=' + this.token
        window.open(url, '_blank')
        this.buttonLoading = false
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    }
  }
}
</script>
<style scoped>
.Low {
  color: blue;
}
.High {
  color: red;
}
.search-item{
    width:200px
}
@media print {

  .no-print{
    display:none!important;
  }

  .print-footer{

    position:fixed;bottom:5px; right:10px

  }

}

</style>
