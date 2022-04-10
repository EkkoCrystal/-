<template>
  <div class="main">
    <el-card>
      <div slot="header" class="clearfix">
        <el-form v-model="form" :inline="true" size="small" label-width="120px">
          <el-row>
            <el-col>
              <el-form-item label="项目类型:">
                <el-select
                  v-model="form.category"
                  placeholder="请选择"
                  autocomplete
                  class="form-item"
                  @change="itemChanged"
                >
                  <el-option
                    v-for="item in testOptions"
                    :key="item.name"
                    :label="item.displayName"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <!-- <el-form-item prop="manufactor" label="生产厂家:">
                <el-select v-model="form.manufactor" placeholder="请选择" clearable class="form-item">
                  <el-option
                    v-for="item in manufactorOptions"
                    :key="item.key"
                    :label="item.key"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item> -->

              <el-form-item prop="lotNum" label="测试条批号：">
                <el-input
                  v-model="form.lotNum"
                  place-holder="输入测试条批号"
                  class="form-item"
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSearch">查询</el-button>
                <el-button
                  v-loading="buttonLoading"
                  type="primary"
                  @click="vuePrint"
                >打印</el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="handleNewStrip"
                >新增测试条</el-button>
              </el-form-item>
            </el-col></el-row>
        </el-form>
      </div>
      <div>
        <div id="printContent" style="margin: 2px">
          <div class="print-header-content" style="display: none">
            <el-row>
              <el-col :span="6">&nbsp;</el-col>
              <el-col :span="12">
                <div style="text-align: center; font-size: 16pt">
                  <div>{{ organizationName }}</div>
                  <div style="margin: 5px">测试条报表</div>
                </div>
              </el-col>
              <el-col :span="6">&nbsp;</el-col>
            </el-row>
          </div>
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
            <el-table-column
              prop="categoryDisplay"
              label="项目类型"
              width="120"
              align="center"
            />
            <el-table-column
              prop="stripTypeDisplay"
              label="测试条类型"
              width="120"
              align="center"
            />
            <el-table-column

              label="测试条批号"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <el-tooltip class="item" effect="light" placement="right">
                  <div slot="content" style="font-size:12pt">已测次数：{{ scope.row.testNum }}</div>
                  <span>{{ scope.row.lotNum }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="productDate"

              label="生产日期"
              align="center"
            />
            <el-table-column label="控制液0范围" align="center">
              <template slot-scope="scope">
                {{ scope.row.qreagentFirstMinValue }}~{{
                  scope.row.qreagentFirstMaxValue
                }}
              </template>
            </el-table-column>
            <el-table-column label="控制液1范围" align="center">
              <template slot-scope="scope">
                {{ scope.row.qreagentSecondMinValue }}~{{
                  scope.row.qreagentSecondMaxValue
                }}
              </template>
            </el-table-column>
            <el-table-column label="控制液2范围" align="center">
              <template slot-scope="scope">
                {{ scope.row.qreagentThirdMinValue }}~{{
                  scope.row.qreagentThirdMaxValue
                }}
              </template>
            </el-table-column>
            <el-table-column label="单位" prop="unit" width="80" align="center" />

            <el-table-column
              prop="expiredDate"
              label="失效日期"

              align="center"
            />
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="!scope.row.isExpired"> 正常 </span>
                <span v-else>失效</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleDeleteStrip(scope.row)">删除</el-link>
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
          :page-size.sync="form.size"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <div>
      <el-dialog
        :close-on-click-modal="false"
        title="新增测试条"
        :visible.sync="dialogVisible"
        width="700px"
        @close="dialogDismissClick"
      >
        <el-card>
          <div style="margin: 20px">
            <el-form
              ref="stripForm"
              :rules="stripRules"
              :model="strip"
              size="small"
              label-width="120px"
            >
              <el-form-item label="项目类型:" prop="category">
                <el-select
                  v-model="strip.category"
                  placeholder="请选择"
                  autocomplete
                  class="small-form-item"
                  @change="categoryChanged"
                >
                  <el-option
                    v-for="item in testOptions"
                    :key="item.name"
                    :label="item.displayName"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="测试条类型:" prop="stripType">
                <el-select
                  v-model="strip.stripType"
                  placeholder="请选择"
                  autocomplete
                  class="small-form-item"
                >
                  <el-option
                    v-for="item in stripTypes"
                    :key="item.name"
                    :label="item.display"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="测试条批号:" prop="lotNum">
                <el-input v-model="strip.lotNum" class="form-item" />
              </el-form-item>
              <el-form-item label="生产日期:" prop="productDate">
                <el-date-picker
                  v-model="strip.productDate"
                  class="small-form-item"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  @change="validateHandle"
                />
              </el-form-item>
              <el-form-item label="失效日期:" prop="expiredDate">
                <el-date-picker
                  v-model="strip.expiredDate"
                  value-format="yyyy-MM-dd"
                  class="form-item"
                  type="date"
                  placeholder="选择日期"
                  @change="validateHandle"
                />
              </el-form-item>

              <!-- <el-form-item label="生产厂家:" prop="manufactor">
                <el-select v-model="strip.manufactor" placeholder="请选择" class="form-item">
                  <el-option
                    v-for="item in manufactorOptions"
                    :key="item.key"
                    :label="item.key"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item> -->

              <el-form-item label="控制液0:" prop="qreagentFirstMinValue">
                <el-input-number
                  v-model="strip.qreagentFirstMinValue"
                  class="control-input"
                  :min="0"
                  :max="1000"
                />
                <el-input-number
                  v-model="strip.qreagentFirstMaxValue"
                  :min="0"
                  :max="1000"
                  class="control-input"
                />&nbsp;&nbsp;{{ strip.unit }}
              </el-form-item>
              <el-form-item label="控制液1:" prop="qreagentSecondMinValue">
                <el-input-number
                  v-model="strip.qreagentSecondMinValue"
                  :min="0"
                  :max="1000"
                  class="control-input"
                />
                <el-input-number
                  v-model="strip.qreagentSecondMaxValue"
                  class="control-input"
                  :min="0"
                  :max="1000"
                />&nbsp;&nbsp;{{ strip.unit }}
              </el-form-item>
              <el-form-item label="控制液2:" prop="qreagentThirdMinValue">
                <el-input-number
                  v-model="strip.qreagentThirdMinValue"
                  class="control-input"
                  :min="0"
                  :max="1000"
                />
                <el-input-number
                  v-model="strip.qreagentThirdMaxValue"
                  class="control-input"
                  :min="0"
                  :max="1000"
                />&nbsp;&nbsp;{{ strip.unit }}
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCreateStrip">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div id="printContent" ref="printContent" style="margin:5px;display:none">
      <div>
        <el-row>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="12">
            <div style="text-align:center;font-size:16pt">
              <div>{{ organizationName }}</div>
              <div style="margin:5px">测试条报表</div>
            </div>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>
      </div>
      <div style="margin:10px" />
      <div>
        <div v-for="(table,k) in printTableData" :key="k">
          <div class="table">
            <div class="table-tr">
              <div class="table-td">项目类型</div>
              <div class="table-td">测试条类型</div>
              <div class="table-td">测试条批号</div>
              <div class="table-td">生产日期</div>
              <div class="table-td-lg">控制液0范围</div>
              <div class="table-td-lg">控制液1范围</div>
              <div class="table-td-lg">控制液2范围</div>
              <div class="table-td">单位</div>
              <div class="table-td">失效日期</div>
              <div class="table-td">状态</div>
            </div>
            <div v-for="(item,index) in table" :key="index" class="table-tr">
              <div class="table-td">  {{ item.categoryDisplay }}</div>
              <div class="table-td">  {{ item.stripTypeDisplay }}</div>
              <div class="table-td">  {{ item.lotNum }}</div>
              <div class="table-td"> {{ item.productDate }}</div>

              <div class="table-td">
                {{ item.qreagentSecondMinValue }}~{{
                  item.qreagentSecondMaxValue
                }}
              </div>
              <div class="table-td">
                {{ item.qreagentSecondMinValue }}~{{
                  item.qreagentSecondMaxValue
                }}
              </div>
              <div class="table-td">
                {{ item.qreagentSecondMinValue }}~{{
                  item.qreagentSecondMaxValue
                }}
              </div>
              <div class="table-td"> {{ item.unit }}</div>
              <div class="table-td"> {{ item.expiredDate }}</div>
              <div class="table-td">
                <span v-if="item.isExpired"> 失效 </span>
                <span v-else> 正常 </span>
              </div>
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
import { mapGetters } from 'vuex'
import moment from 'moment'
import { Message } from 'element-ui'
import { getTestItems, getCategoryStripTypesItems } from '@/api/test'
// import { addPrintStyle } from '@/utils/index'
import { getManufacturer, queryTestStrip, createStrip, deleteStrip } from '@/api/qc'
export default {
  name: 'Strips',
  data () {
    const validateDate = (rule, value, callback) => {
      if (this.strip.expiredDate !== null &&
        this.strip.productDate !== null) {
        if (moment(this.strip.productDate).isSameOrAfter(this.strip.expiredDate)) {
          callback('生产日期必须小于失效日期')
        } else {
          callback()
        }
      }
    }
    const validatestripType = (rule, value, callback) => {
      if (!value || value === '') {
        callback('测试条类型必须输入，不能为空')
      } else {
        callback()
      }
    }
    const validateLotnum = (rule, value, callback) => {
      const reg = /^\w{6,18}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback('批号信息必须输入，6-18位的字符')
      }
    }
    const validateFirst = (rule, value, callback) => {
      if (this.strip.qreagentFirstMinValue > 0 ||
        this.strip.qreagentFirstMaxValue > 0) {
        if (this.strip.qreagentFirstMinValue < this.strip.qreagentFirstMaxValue) {
          callback()
        } else {
          callback('最小值必须小于最大值')
        }
      } else {
        // callback('控制液范围必须输入')
        callback()
      }
    }
    const validateSecond = (rule, value, callback) => {
      if (this.strip.qreagentSecondMinValue > 0 ||
        this.strip.qreagentSecondMaxValue > 0) {
        if (this.strip.qreagentSecondMinValue < this.strip.qreagentSecondMaxValue) {
          callback()
        } else {
          callback('最小值必须小于最大值')
        }
      } else {
        // callback('控制液范围必须输入')
        callback()
      }
    }
    const validateThird = (rule, value, callback) => {
      if (this.strip.qreagentThirdMinValue > 0 ||
        this.strip.qreagentThirdMaxValue > 0) {
        if (this.strip.qreagentThirdMinValue < this.strip.qreagentThirdMaxValue) {
          callback()
        } else {
          callback('最小值必须小于最大值')
        }
      } else {
        // callback('控制液范围必须输入')
        callback()
      }
    }
    return {
      manufactorOptions: [],
      testOptions: [],
      stripTypes: [],

      form: {
        category: 'GLU',
        stripType: '',
        isExpired: '',
        lotNum: '',
        manufactor: 'acon',
        status: '',
        page: 1,
        size: 20

      },
      printTableData: [],
      printPageSize: 32,
      buttonLoading: false,
      total: 0,
      strip: {
        category: 'GLU',
        stripType: '',
        expiredDate: null,
        lotNum: '',
        manufactor: 'acon',
        productDate: null,
        qreagentFirstMaxValue: 0,
        qreagentFirstMinValue: 0,
        qreagentSecondMaxValue: 0,
        qreagentSecondMinValue: 0,
        qreagentThirdMaxValue: 0,
        qreagentThirdMinValue: 0,
        scanDate: '',
        uint: ''

      },
      stripRules: {
        expiredDate: [
          { required: true, message: '失效日期必须输入', trigger: 'change' },
          { validator: validateDate, trigger: 'change' }
        ],
        stripType: [
          { required: true, message: '测试条类型必须输入', trigger: 'change' },
          { validator: validatestripType, trigger: 'change' }
        ],
        lotNum: [
          { required: true, message: '批号信息必须输入', trigger: 'blur' },
          // { min: 6, max: 18, message: '批号是 6 到 18 个字符', trigger: 'blur' }
          { validator: validateLotnum, trigger: 'blur' }
        ],
        productDate: [
          { required: true, message: '生产日期必须输入', trigger: 'change' },
          { validator: validateDate, trigger: 'change' }
        ],
        // manufactor: [
        //   { required: true, message: '生产厂家必须选择', trigger: 'blur' }
        // ],

        qreagentFirstMinValue: [

          { validator: validateFirst, trigger: 'blur' }
        ],
        qreagentSecondMinValue: [

          { validator: validateSecond, trigger: 'blur' }
        ],
        qreagentThirdMinValue: [
          { validator: validateThird, trigger: 'blur' }
        ]
      },

      dialogVisible: false,
      tableData: [],
      loading: false

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
    this.initData()
    this.initOptions()
  },
  mounted () {
    this.onSearch()
  },
  methods: {
    validateHandle () {
      this.$refs.stripForm.validateField(['expiredDate', 'productDate'])
    },
    initData () {
      // this.strip.expiredDate = moment().format('yyyy-MM-dd')
      this.strip.expiredDate = moment().add(1, 'Y').format('YYYY-MM-DD')
      this.strip.productDate = moment().format('YYYY-MM-DD')
      this.strip.scanDate = moment().format('YYYY-MM-DD')
    },
    initOptions () {
      getManufacturer().then(res => {
        this.manufactorOptions = res.dataContent
      })
      getTestItems().then(res => {
        this.testOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
      // 加载默认的
      this.getCatStripTypes(this.strip.category)
    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    query () {
      this.loading = true
      //
      queryTestStrip(this.form).then(res => {
        this.loading = false
        this.tableData = res.dataContent.records
        this.total = res.dataContent.total
      }).catch(err => {
        Message.error('查询出错:' + err.message)
      })
    },
    handleSizeChange (val) {
      this.form.size = val
      this.query()
    },
    handleCurrentChange (val) {
      this.form.page = val
      this.query()
    },
    itemChanged (val) {
      this.form.page = 1
      // this.query()
    },
    handleNewStrip () {
      this.clearData()
      this.strip.scanDate = moment().format('YYYY-MM-DD HH:mm:ss')
      this.strip.manufactor = 'acon'
      getCategoryStripTypesItems('GLU').then(res => {
        this.stripTypes = res.dataContent
        this.dialogVisible = true
      }).catch(err => {
        console.log(err)
        Message.error('数据异常:' + err)
      })
    },
    //  点击取消按钮
    dialogDismissClick () {
      this.$refs.stripForm.clearValidate()
      this.dialogVisible = false
    },
    handleCreateStrip () {
      this.$refs.stripForm.validate(valid => {
        if (valid && this.validateQReagent()) {
          createStrip(this.strip).then(res => {
            Message.success('保存测试条信息成功')
            this.query()
            this.dialogVisible = false
            this.clearData()
          }).catch(err => {
            Message.error('保存测试条信息出错:' + err.message)
          })
        }
      })
    },
    handleDeleteStrip (row) {
      this.$confirm('您确认要删除当前的测试条记录吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          deleteStrip(row.id).then(res => {
            Message.success('删除测试条成功')
            this.query()
          }).catch(err => {
            Message.error('删除测试条失败:' + err.message)
          })
        })
        .catch(action => {
          // this.$message({
          //   type: 'info',
          //   message: action === 'cancel'
          //     ? '确认将删除当前的控制液'
          //     : '取消放弃当前操作'
          // })
        })
    },
    validateQReagent () {
      const first = this.strip.qreagentFirstMinValue > 0 && this.strip.qreagentFirstMaxValue > 0
      const second = this.strip.qreagentSecondMinValue > 0 && this.strip.qreagentSecondMaxValue > 0
      const third = this.strip.qreagentThirdMinValue > 0 && this.strip.qreagentThirdMaxValue > 0

      const result = first || second || third
      if (!result) {
        Message.error('测试条的控制液范围必须输入一个，必须确保最小值和最大值都输入了')
      }
      return result
    },

    clearData () {
      this.strip = {
        category: 'GLU',
        stripType: '',
        expiredDate: moment().add(1, 'Y').format('YYYY-MM-DD'),
        lotNum: '',
        manufactor: 'acon',
        productDate: moment().format('YYYY-MM-DD'),
        qreagentFirstMaxValue: 0,
        qreagentFirstMinValue: 0,
        qreagentSecondMaxValue: 0,
        qreagentSecondMinValue: 0,
        qreagentThirdMaxValue: 0,
        qreagentThirdMinValue: 0,
        scanDate: '',
        unit: 'mmol/L'

      }
    },
    categoryChanged (val) {
      if (val !== 'UA') {
        this.strip.unit = 'mmol/L'
      } else {
        this.strip.unit = 'μmol/L'
      }

      this.getCatStripTypes(val)
    },
    getCatStripTypes (val) {
      this.strip.stripType = ''
      this.strip.lotNum = ''
      this.stripTypes = []
      getCategoryStripTypesItems(val).then(res => {
        this.stripTypes = res.dataContent
      }).catch(err => {
        console.log(err)
      })
    },
    async vuePrint () {
      const url = this.$baseConfig.reportServiceUrl + '/report/teststripreport' +
        '?Category=' + this.form.category +
        '&LotNum=' + this.form.lotNum +
        '&IsExpired=' + this.form.isExpired +
        '&token=' + this.token
      window.open(url, '_blank')
    }
  }
}
</script>
<style scoped>
.main {
  margin: 10px;
}
.form-item {
  width: 200px;
}
.control-input {
  width: 140px;
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
