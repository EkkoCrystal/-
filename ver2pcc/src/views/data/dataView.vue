<template>
  <div>
    <el-card>
      <el-form
        ref="coditionForm"
        v-model="conditionForm"
        :inline="true"
        label-width="120px"
        size="small"
      >
        <el-row>
          <el-col>
            <el-form-item prop="queryCondition" label="关键字:">
              <el-input
                v-model="conditionForm.queryCondition"
                class="search-item"
                maxlength="32"
                placeholder="姓名/床号/住院号"
              />
            </el-form-item>
            <el-form-item prop="departmentCode" label="科室:">
              <el-select
                ref="selTree"
                v-model="conditionForm.departmentName"
                class="search-item"
                placeholder="请选择科室"
                clearable
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
            </el-form-item>
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
                icon="el-icon-search"
                @click="loadData"
              >查询</el-button>
              <el-button
                v-print="'printContent'"
                size="small"

                type="primary"
              >打印</el-button>
              <el-button
                type="primary"
                size="small"

                @click="navigate"
              >标准数据</el-button>
            </el-form-item>

          </el-col>
        </el-row>

      </el-form>

    </el-card>
    <div id="printContent" style="margin:10px">
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
          prop="bed"
          width="80"
          align="center"
          label="床号"
        />
        <el-table-column prop="patientName" label="姓名" align="center" width="160" />
        <el-table-column
          prop="testTime"
          label="检测日期"
          width="160"
          align="center"
        />
        <el-table-column
          prop="periodName"
          label="时段"
          width="80"
          align="center"
        />
        <el-table-column
          prop="testValue"
          label="血糖值"
          width="80"
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
          prop="testUser"
          label="检测人"
          width="80"
          align="center"
        />
        <el-table-column
          prop="remark"
          label="备注"

          align="center"
        />
        <el-table-column align="center" width="200" label="操作">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit-outline"
              circle
              @click="editRow(scope.row)"
            />
            <el-button
              icon="el-icon-delete"
              circle
              @click="deleteRow(scope.row)"
            />
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
    <el-dialog :close-on-click-modal="false" title="修改血糖记录" :visible.sync="dialogVisible" width="700px">
      <el-card>
        <div style="margin:20px">
          <el-form ref="resultForm" :model="resultForm" :rules="resultFormRules" size="small" label-width="120px">
            <el-form-item label="姓名:">
              {{ resultForm.patientName }}
            </el-form-item>
            <el-form-item label="检测日期:">
              <el-date-picker
                v-model="resultForm.testTime"
                style="width:200px"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="检测时段:">
              <el-select
                v-model="resultForm.period"
                style="width:200px"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in periodOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="检测结果:">
              <div style="width:410px">
                <el-radio-group v-model="resultForm.unenforced" @change="groupChanged">
                  <el-radio :label="false">新增血糖值</el-radio>
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
                              :max="33.3"
                              :precision="2"
                              :step="0.1"
                              label="0.6~33.3"
                              @change="inputChanged"
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
  </div>
</template>

<script>
// import moment from 'moment'
// import { mapGetters } from 'vuex'
import {
  queryTestData,
  testResultChangeStatus,
  getPeriodOptions,
  getRejectReason,
  updateTestResult
} from '@/api/test'
import { getDoctors, getGenders, getDepartments } from '@/api/user'
import { Message } from 'element-ui'
import moment from 'moment'
export default {
  name: 'DataView',
  data () {
    return {
      loading: false,
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      genderOptions: [],
      doctorOptions: [],
      periodOptions: [],
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
      rejectOptions: [

      ],
      conditionForm: {
        category: 'GLU',
        queryCondition: '',
        beginDate: '',
        endDate: '',
        doctorCode: '',
        departmentCode: '',
        departmentName: '',

        page: 1,
        size: 10,
        total: 0
      },
      resultForm: {
        category: 'GLU',
        patientName: '',
        id: 0,
        patientId: 0,
        period: '',
        remark: '',
        testTime: '',
        result: '',
        unenforced: false
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
      normalValue: '0',
      textValue: '',
      rejectReason: '',

      tableData: [],
      dialogVisible: false
    }
  },
  created () {
    this.initOptions()
    this.loadData()
  },
  methods: {
    initOptions () {
      getDepartments().then(res => {
        this.deptOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
      getDoctors().then(res => {
        this.doctorOptions = res.dataContent
        // this.doctorOptions.unshift({ doctorCode: '', doctorName: '全部' })
      }).catch(err => {
        console.log(err)
      })

      getGenders().then(res => {
        this.genderOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })

      getPeriodOptions('LongStandards').then(res => {
        this.periodOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })

      getRejectReason().then(res => {
        this.rejectOptions = res.dataContent
      }).catch(err => {
        console.log(err)
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
    handleNodeClick (data) {
      this.conditionForm.departmentCode = data.code
      this.conditionForm.departmentName = data.name
      this.$refs.selTree.blur()
    },
    navigate () {
      this.$router.push({
        path: '/data/data'
      })
    },

    editRow (data) {
      this.resultForm = {
        category: data.category,
        id: data.id,
        patientId: data.patientId,
        patientName: data.patientName,
        period: data.period,
        remark: data.remark,
        testTime: data.testTime,
        result: data.result,
        unenforced: data.unenforced

      }
      if (data.testValue !== 'HIGH' && data.testValue !== 'LOW') {
        this.selType = true
        this.normalValue = data.testValue
      } else {
        this.selType = false
        this.textValue = data.testValue
      }
      if (data.unenforced) {
        this.rejectReason = data.unenforcedReasonCode
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
        })
      })
    },
    handleChange (val) {},
    groupChanged (val) {
      console.log(val)
      console.log(this.resultForm)
    },
    inputChanged (val) {
      this.resultForm.result = val
      this.$refs.resultForm.clearValidate()
    },
    selResultChanged (val) {
      this.resultForm.result = val
      this.$refs.resultForm.clearValidate()
    },
    selRejectChanged (val) {
      this.resultForm.result = val
      this.$refs.resultForm.clearValidate()
    },

    handleUpdateData () {
      this.$refs.resultForm.validate(valid => {
        if (valid) {
          let data = ''
          if (this.resultForm.unenforced) {
            data = this.rejectReason
          } else {
            if (this.selType) {
              data = this.normalValue
            } else {
              data = this.textValue
            }
          }
          updateTestResult({
            category: 'GLU',
            id: this.resultForm.id,
            patientId: this.resultForm.patientId,
            period: this.resultForm.period,
            remark: this.resultForm.remark,
            testTime: this.resultForm.testTime,
            result: data,
            unenforced: this.resultForm.unenforced

          }).then(res => {
            Message.success('修改检测记录成功')

            this.loadData()
            this.dialogVisible = false
          }).catch(err => {
            console.log(err)
            Message.error('修改检测记录失败:' + err.messsage)
          })
        }
      })
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
  width:200px;
}
</style>
