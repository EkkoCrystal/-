<template>
  <div>
    <el-card>
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
            <el-form-item prop="lotNum" label="控制液批号:">
              <el-input v-model="form.lotNum" class="form-item" />
            </el-form-item>

            <!-- <el-form-item prop="manufactor" label="生产厂家:">
              <el-select v-model="form.manufactor" clearable placeholder="请选择" class="form-item">
                <el-option
                  v-for="item in manufactorOptions"
                  :key="item.key"
                  :label="item.key"
                  :value="item.key"
                />
              </el-select>
            </el-form-item> -->
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item prop="isExpired" label="状态:">
              <el-select
                v-model="form.isExpired"
                clearable
                placeholder="请选择"
                class="form-item"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
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
                @click="handleNewReagent"
              >新增控制液</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div>
        <div style="margin: 10px">
          <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%"
            class="vue-print-table"
            stripe
            border
            highlight-current-row
            :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
          >
            <el-table-column
              prop="categoryDisplay"
              label="项目类型"
              width="140"
              align="center"
            />
            <el-table-column
              prop="lotNum"
              label="控制液批号"
              width="260"
              align="center"
            />
            <!-- <el-table-column prop="manufactorDisplay" label="生产厂家" width="180" align="center" /> -->
            <el-table-column
              prop="qualityReagentTypeDisplay"
              label="控制液类型"
              align="center"
            />
            <el-table-column
              prop="productDate"
              label="生产日期"
              align="center"
            />
            <el-table-column
              prop="expiredDate"
              label="失效日期"
              align="center"
            />
            <el-table-column
              prop="isExpired"
              label="状态"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.isExpired"> 失效 </span>
                <span v-else> 正常 </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  @click="handleDeleteReagent(scope.row)"
                >删除</el-link>
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
        title="新增控制液"
        :visible.sync="dialogVisible"
        width="600px"
        @close="closedReagenDialog"
      >
        <el-card>
          <div style="margin: 20px">
            <el-form
              ref="reagentForm"
              :model="reagent"
              :rules="reagentRules"
              size="small"
              label-width="100px"
            >
              <el-form-item label="项目类型:">
                <el-select
                  v-model="reagent.category"
                  placeholder="请选择"
                  autocomplete
                  class="small-form-item"
                >
                  <el-option
                    v-for="item in testOptions"
                    :key="item.name"
                    :label="item.displayName"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="控制液批号:" prop="lotNum">
                <el-input v-model="reagent.lotNum" class="form-item" />
              </el-form-item>
              <el-form-item label="控制液类型:" prop="qualityReagentType">
                <el-select
                  v-model="reagent.qualityReagentType"
                  placeholder="请选择"
                  class="form-item"
                >
                  <el-option
                    v-for="item in reagentTypeOptions"
                    :key="item.code"
                    :label="item.display"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="生产日期:" prop="productDate">
                <el-date-picker
                  v-model="reagent.productDate"
                  class="form-item"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  @change="validateHandle"
                />
              </el-form-item>
              <el-form-item label="失效日期:" prop="expiredDate">
                <el-date-picker
                  v-model="reagent.expiredDate"
                  class="form-item"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  @change="validateHandle"
                />
              </el-form-item>

              <!-- <el-form-item label="生产厂家:" prop="manufactor">
                <el-select v-model="reagent.manufactor" placeholder="请选择" class="form-item">
                  <el-option
                    v-for="item in manufactorOptions"
                    :key="item.key"
                    :label="item.key"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item> -->

              <!-- <el-form-item label="方差:" prop="sd">
                <el-input v-model="reagent.sd" class="form-item" />

              </el-form-item>
              <el-form-item label="靶值:" prop="targetValue">
                <el-input v-model="reagent.targetValue" class="form-item" />

              </el-form-item> -->
            </el-form>
          </div>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleCreateReagent"
          >确 定</el-button>
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
              <div style="margin:5px">控制液报表</div>
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
              <div class="table-td">控制液批号</div>
              <div class="table-td-lg">控制液类型</div>
              <div class="table-td">生产日期</div>
              <div class="table-td">失效日期</div>
              <div class="table-td">状态</div>
            </div>
            <div v-for="(item,index) in table" :key="index" class="table-tr">
              <div class="table-td">  {{ item.categoryDisplay }}</div>
              <div class="table-td">  {{ item.lotNum }}</div>
              <div class="table-td"> {{ item.qualityReagentTypeDisplay }}</div>
              <div class="table-td"> {{ item.productDate }}</div>
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
import { getTestItems } from '@/api/test'
// import { addPrintStyle } from '@/utils/index'
import {
  getManufacturer, queryQualityReagent,
  createQualityReagent, deleteQualityReagent, getQualityReagentTypes
} from '@/api/qc'

export default {
  name: 'QualityLiquid',
  data () {
    const validateLotnum = (rule, value, callback) => {
      const reg = /^\w{6,18}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback('批号信息必须输入，6-18位的字符')
      }
    }
    const validateDate = (rule, value, callback) => {
      if (this.reagent.expiredDate !== null &&
        this.reagent.productDate !== null) {
        if (moment(this.reagent.productDate).isSameOrAfter(this.reagent.expiredDate)) {
          callback('生产日期必须小于失效日期')
        } else {
          callback()
        }
      }
    }
    return {
      manufactorOptions: [],
      tableData: [],
      printTableData: [],
      loading: false,
      buttonLoading: false,
      printPageSize: 32,
      statusOptions: [
        {
          label: '正常',
          key: 'false'
        },

        {
          label: '失效',
          key: 'true'
        }

      ],
      reagentTypeOptions: [

      ],
      testOptions: [],
      reagent: {
        category: 'GLU',
        expiredDate: null,
        qualityReagentType: '',
        lotNum: '',
        manufactor: 'acon',
        productDate: null,
        sd: 0,
        targetValue: 0,
        scanDate: ''

      },
      reagentRules: {
        expiredDate: [
          { required: true, message: '失效日期必须输入', trigger: 'change' },
          { validator: validateDate, trigger: 'change' }
        ],
        lotNum: [
          // { required: true, message: '批号信息必须输入', trigger: 'blur' },
          // { min: 6, max: 18, message: '批号是 6 到 18 个字符', trigger: 'blur' }
          { required: true, validator: validateLotnum, trigger: 'blur' }
        ],
        productDate: [
          { required: true, message: '生产日期必须输入', trigger: 'change' },
          { validator: validateDate, trigger: 'change' }
        ],
        qualityReagentType: [
          { required: true, message: '测试条类型必须选择', trigger: 'change' }
        ]
        // manufactor: [
        //   { required: true, message: '生产厂家必须选择', trigger: 'blur' }
        // ],
        // sd: [
        //   { min: 0, max: 1000, message: '方差必须0-1000', trigger: 'blur' }
        // ],
        // targetValue: [
        //   { min: 0, max: 1000, message: '目标必须0-1000', trigger: 'blur' }
        // ]

      },
      dialogVisible: false,

      form: {
        category: 'GLU',
        isExpired: '',
        lotNum: '',
        manufactor: 'acon',
        status: '',
        page: 1,
        size: 20
      },
      total: 0
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
    this.onSearch()
  },
  methods: {
    validateHandle () {
      this.$refs.reagentForm.validateField(['expiredDate', 'productDate'])
    },
    initOptions () {
      getManufacturer().then(res => {
        this.manufactorOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })

      getTestItems().then(res => {
        this.testOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })

      getQualityReagentTypes().then(res => {
        this.reagentTypeOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
    },

    initData () {

    },

    onSearch () {
      this.form.page = 1
      this.query()
    },

    query () {
      this.loading = true
      // this.form.page = 1
      queryQualityReagent(this.form).then(res => {
        this.tableData = res.dataContent.records
        this.total = res.dataContent.total
        this.loading = false
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
        this.loading = false
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
      this.query()
    },
    handleCreateReagent () {
      this.$refs.reagentForm.validate(valid => {
        if (valid) {
          createQualityReagent(this.reagent).then(res => {
            Message.success('保存控制液信息成功')
            this.clearData()
            this.query()
            this.dialogVisible = false
          }).catch(err => {
            Message.error('保存控制液失败:' + err.message)
          })
        }
      })
    },
    closedReagenDialog () {
      this.$refs.reagentForm.resetFields()
      this.dialogVisible = false
    },
    handleDeleteReagent (row) {
      this.$confirm('您确认要删除当前的控制液记录吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          deleteQualityReagent(row.id).then(res => {
            Message.success('删除控制液成功')
            this.query()
          }).catch(err => {
            Message.error('删除控制液失败:' + err.message)
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

      // deleteQualityReagent(row.id).then(res => {
      //   Message.success('删除控制液成功')
      //   this.query()
      // }).catch(err => {
      //   Message.error('删除控制液失败:' + err.message)
      // })
    },
    handleNewReagent () {
      this.dialogVisible = true
      this.reagent.productDate = moment().format('YYYY-MM-DD')
      this.reagent.expiredDate = moment().add(1, 'Y').format('YYYY-MM-DD')
      this.reagent.scanDate = moment().format('YYYY-MM-DD')
      this.reagent.manufactor = 'acon'
    },
    clearData () {
      this.reagent = {
        category: 'GLU',
        qualityReagentType: '',
        expiredDate: '',
        lotNum: '',
        manufactor: 'acon',
        productDate: '',
        sd: 0,
        targetValue: 0,
        scanDate: ''

      }
    },
    async vuePrint () {
      // if (this.form.lotNum === null ||
      //       this.form.lotNum === undefined || this.form.lotNum === '') {
      //   Message.error('请输入控制液批号')
      //   return
      // }
      const url = this.$baseConfig.reportServiceUrl + '/report/reagentReport' +
        '?Category=' + this.form.category +
        '&LotNum=' + this.form.lotNum +
        '&IsExpired=' + this.form.isExpired +
        '&token=' + this.token
      window.open(url, '_blank')

      // category: this.form.category,
      //     isExpired: this.form.isExpired,
      //     lotNumber: this.form.lotNum,
      //     manufactor: 'acon',
      //     status: this.form.status,
      //     page: i,
      //     size: this.printPageSiz
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
