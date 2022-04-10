<template>
  <div>
    <el-card>
      <el-form
        ref="conditionForm"
        v-model="conditionForm"
        size="small"
        :inline="true"
        label-width="80px"
      >
        <el-row>
          <el-col>
            <el-form-item label="科室:">
              <div style="width:200px;height:32px">
                <my-treeselect :append-true="true" :mydata="deptOptions" :valuebb="departDefaultCodes" @changeSel="changeDepentSelHandle" @inputChanging="inoutDepentChangeHandle" />
              </div>
            </el-form-item>
            <el-form-item label="质控分类:">
              <el-select
                v-model="conditionForm.itemCategory"
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
            <el-form-item
              prop="sn"
              label="仪器编号:"
            >
              <el-input
                v-model="conditionForm.sn"
                class="search-item"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item
              prop="beginDate"
              label="开始日期:"
            >
              <el-date-picker
                v-model="conditionForm.beginDate"
                type="date"
                class="search-item"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item
              prop="endDate"
              label="结束日期:"
            >
              <el-date-picker
                v-model="conditionForm.endDate"
                type="date"
                class="search-item"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>

            <el-form-item label="质控结果:">
              <el-select
                v-model="conditionForm.status"
                clearable
                placeholder="请选择"
                class="search-item"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="onSearch"
              >查询</el-button>
              <el-button
                size="small"
                type="primary"
                @click="vuePrint"
              >打印</el-button>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <el-card style="margin:5px;">
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
              prop="department"
              label="科室"
              width="180"
              align="center"
            />
            <el-table-column
              prop="testTime"
              label="质控日期"
              width="200"
              align="center"
            />
            <el-table-column
              prop="meter"
              label="仪器编号"
              align="center"
            />
            <el-table-column
              prop="categoryDisplay"
              label="质控分类"
              align="center"
            >
              <template slot-scope="scope">
                <!-- <div v-if="scope.row.category !== null">

                </div>
                <div v-else>
                  血糖/血酮/尿酸
                </div> -->
                {{ scope.row.categoryDisplay }}

              </template>
            </el-table-column>
            <el-table-column
              prop="result"
              label="质控结果"
              align="center"
            >
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.isPassed === false" class="item" effect="light" placement="right">
                  <div slot="content">
                    <div style="padding:5px;font-size:10pt">
                      失败原因: {{ scope.row.failureReason }}
                    </div>
                    <div style="padding:5px;font-size:10pt">
                      改进措施: {{ scope.row.solution }}
                    </div>
                  </div>
                  <div>
                    {{ scope.row.result }}
                  </div>
                </el-tooltip>
                <span v-else>{{ scope.row.result }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="qualityReagentLotNum"
              label="控制液批号"
              align="center"
            />
            <el-table-column
              prop="qualityReagentTypeDisplay"
              label="控制液类型"
              align="center"
            />
            <el-table-column
              prop="stripLotNum"
              label="测试条批号"
              align="center"
            />
            <el-table-column
              prop="testValue"
              label="检测值"
              align="center"
            />
            <el-table-column
              prop="range"
              label="范围"
              align="center"
            />
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
            <!-- <el-table-column
            prop="address"
            label="操作"

            align="center"
          >
            <template slot-scope="scope">
              <el-link type="primary" @click="handleEdit(scope.row)">修改</el-link>
            </template>
          </el-table-column> -->
          </el-table>
        </div>
        <div style="margin:5px;float:right">
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
    </el-card>
    <div>
      <el-dialog
        :close-on-click-modal="false"
        title="质控记录信息"
        :visible.sync="reagentDialogVisible"
        width="680px"
        @close="closedInstrucmentDialog"
      >
        <el-card>
          <div style="margin:5px">
            <el-form
              ref="instrumentQcForm"
              :rules="instrumentQcRules"
              :model="instrumentQc"
              size="small"
              label-width="100px"
            >
              <el-row>
                <el-col>
                  <el-form-item
                    label="项目类型:"
                    prop="category"
                  >
                    <el-select
                      v-model="instrumentQc.category"
                      placeholder="请选择"
                      autocomplete
                      class="form-item"
                      @change="qcTestSelectedChange"
                    >
                      <el-option
                        v-for="item in testOptions"
                        :key="item.name"
                        :label="item.displayName"
                        :value="item.name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="控制液批号:"
                    prop="qualityReagentLotNum"
                  >
                    <el-select
                      v-model="instrumentQc.qualityReagent"
                      value-key="id"
                      placeholder="请选择"
                      class="form-item"
                      :disabled="instrumentQc.qualityReagentDisabled"
                      @change="qualityReagentChanged"
                    >
                      <el-option
                        v-for="item in availableQualityReagentOptions"
                        :key="item.id"
                        :label="item.lotNum"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" />
              </el-row>
              <el-row>
                <!-- <el-col :span="12">
                  <el-form-item label="生产厂家:">
                    <span v-if="instrumentQc.qualityReagent !== null">{{ instrumentQc.qualityReagent.manufactor }}</span>
                  </el-form-item>

                </el-col> -->
                <el-col :span="12">
                  <el-form-item label="控制液类型:">
                    <span v-if="instrumentQc.qualityReagent !== null">{{ instrumentQc.qualityReagent.qualityReagentTypeDisplay }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="失效日期:">
                    <span v-if="instrumentQc.qualityReagent !== null">{{ instrumentQc.qualityReagent.expiredDate }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" />
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="测试条批号:"
                    prop="stripLotNum"
                  >
                    <el-select
                      v-model="instrumentQc.strip"
                      value="lotNum"
                      value-key="id"
                      placeholder="请选择"
                      class="form-item"
                      :disabled="instrumentQc.stripDisabled"
                      @change="stripChanged"
                    >
                      <el-option
                        v-for="item in availableTestStripOptions"
                        :key="item.id"
                        :label="item.lotNum"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" />
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="生产厂家:">
                    <span v-if="instrumentQc.strip !== null">{{ instrumentQc.strip.manufactor }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="失效日期:">
                    <span v-if="instrumentQc.strip !== null">{{ instrumentQc.strip.expiredDate }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="控制液范围:">
                    <span v-if="instrumentQc.qualityReagent && instrumentQc.strip">
                      <span v-if="instrumentQc.qualityReagent.qualityReagentType ==='First'">
                        {{ instrumentQc.strip.qreagentFirstMinValue }}~{{ instrumentQc.strip.qreagentFirstMaxValue }}
                        ({{ instrumentQc.qualityReagent.qualityReagentTypeDisplay }})
                      </span>
                      <span v-if="instrumentQc.qualityReagent.qualityReagentType ==='Second'">
                        {{ instrumentQc.strip.qreagentSecondMinValue }}~{{ instrumentQc.strip.qreagentSecondMaxValue }}
                        ({{ instrumentQc.qualityReagent.qualityReagentTypeDisplay }})
                      </span>
                      <span v-if="instrumentQc.qualityReagent.qualityReagentType ==='Third'">
                        {{ instrumentQc.strip.qreagentThirdMinValue }}~{{ instrumentQc.strip.qreagentThirdMaxValue }}
                        ({{ instrumentQc.qualityReagent.qualityReagentTypeDisplay }})
                      </span>
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="12" />
              </el-row>
              <el-divider />
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="质控日期:"
                    prop="testTime"
                  >
                    <el-date-picker
                      v-model="instrumentQc.testTime"
                      class="small-form-item"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="检测人:"
                    prop="testUserCode"
                  >
                    <el-select
                      v-model="instrumentQc.testUserCode"
                      placeholder="请选择"
                      autocomplete
                      class="small-form-item"
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
                <el-col :span="12">
                  <el-form-item
                    label="检测值:"
                    prop="result"
                  >
                    <el-input-number
                      v-model="instrumentQc.result"
                      class="small-form-item"
                      :precision="2"
                      :step="0.1"
                      @change="computeQC"
                    />
                  </el-form-item>

                </el-col>
                <el-col :span="12">
                  <el-form-item label="质控结果:">
                    <div v-show="instrumentQc.isPassed !==''">
                      <span v-if="instrumentQc.isPassed">合格</span>
                      <span
                        v-else
                        style="color:red"
                      >不合格</span>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注:">
                    <el-input
                      v-model="instrumentQc.remark"
                      class="small-form-demo"
                      type="textarea"
                      placeholder="请输入备注"
                      maxlength="60"
                      rows="6"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    v-show="instrumentQc.isPassed!=='' && !instrumentQc.isPassed"
                    label="改进措施:"
                  >
                    <el-input
                      v-model="instrumentQc.solution"
                      class="small-form-demo"
                      type="textarea"
                      placeholder="请输入改进措施"
                      maxlength="60"
                      rows="6"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="reagentDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleSaveQc"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div
      id="printContent"
      ref="printContent"
      style="margin:5px;display:none"
    >
      <div>

        <el-row>
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="12">
            <div style="text-align:center;font-size:16pt">
              <div>{{ organizationName }}</div>
              <div style="margin:5px">质控记录</div>
            </div>
          </el-col>
          <el-col :span="6">&nbsp;</el-col>
        </el-row>

      </div>
      <div style="margin:10px" />
      <div>
        <div
          v-for="(table,k) in printTableData"
          :key="k"
        >
          <div class="table">
            <div class="table-tr">
              <div class="table-td">科室</div>
              <div class="table-td-lg">质控日期</div>
              <div class="table-td">仪器编号</div>
              <div class="table-td">质控分类</div>
              <div class="table-td">质控结果</div>
              <div class="table-td">控制液批号</div>
              <div class="table-td">控制液类型</div>
              <div class="table-td">测试条批号</div>
              <div class="table-td">检测值</div>
              <div class="table-td">范围</div>
              <div class="table-td">单位</div>
              <div class="table-td">检测人</div>

            </div>
            <div
              v-for="(item,index) in table"
              :key="index"
              class="table-tr"
            >
              <div class="table-td"> {{ item.department }}</div>
              <div class="table-td"> {{ item.testTime }}</div>

              <div class="table-td"> {{ item.meter }}</div>
              <div class="table-td"> {{ item.categoryDisplay }}</div>
              <div class="table-td-lg">
                <!-- <span v-if="item.isPassed">合格</span>
                <span v-else style="color:red">不合格</span> -->
                {{ item.result }}
              </div>
              <div class="table-td"> {{ item.qualityReagentLotNum }}</div>
              <div class="table-td"> {{ item.qualityReagentTypeDisplay }}</div>
              <div class="table-td"> {{ item.stripLotNum }}</div>
              <div class="table-td"> {{ item.testValue }}</div>
              <div class="table-td"> {{ item.range }}</div>
              <div class="table-td"> {{ item.unit }}</div>
              <div class="table-td"> {{ item.testUser }}</div>

            </div>

          </div>
          <div class="print-footer">
            审核人:________________
          </div>

          <div
            calss="table-tr"
            style="page-break-after:always"
          />

        </div>

      </div>
      <iframe
        id="iframe"
        style="display:none;"
      />

    </div>
  </div>
</template>
<script>

import { mapGetters } from 'vuex'
import moment from 'moment'
import { } from '@/api/patient'
import { getDepartments, getDoctors } from '@/api/user'
import {
  qcQuery, qcUpdate,
  getAvailableQualityReagents, getAvailableTestStrips, getDeviceStatusTypes
} from '@/api/qc'
// import { addPrintStyle } from '@/utils/index'
import { getTestItems } from '@/api/test'
import { Message } from 'element-ui'
import MyTreeselect from '@/components/common/MyTreeselect.vue'

export default {
  name: 'QualityRecord',
  components: { MyTreeselect },
  data () {
    const validatorResult = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('质控结果必须输入'))
      } else {
        if (value > 0) {
          callback()
        } else {
          return callback(new Error('质控结果不正确'))
        }
      }
    }
    return {
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'

      },
      loading: false,
      buttonLoading: false,
      tableData: [],
      printTableData: [],
      printPageSize: 32,
      total: 0,
      // 默认值
      departDefaultCodes: null,
      conditionForm: {
        beginDate: '',
        endDate: '',
        departmentCode: '',
        departmentName: '',
        sn: '',
        status: '',
        itemCategory: 'GLU',
        page: 1,
        size: 20

      },
      availableTestStripOptions: [],
      availableQualityReagentOptions: [],
      doctorOptions: [],

      testOptions: [

      ],
      statusOptions: [

        {
          label: '合格',
          value: 'Qualified'
        },
        {
          label: '不合格',
          value: 'Unqualified'
        },
        {
          label: '未质控',
          value: 'None'
        }
      ],
      instrumentQc: {

        recordId: 0,
        category: 'GLU',
        testUserCode: '',

        isPassed: '',
        qualityReagentLotNum: '',
        qualityReagent: null,
        qualityReagentType: '',
        qualityReagentDisabled: true,
        stripDisabled: true,
        remark: '',
        result: 0,
        sn: '',
        solution: '',

        stripLotNum: '', // need
        strip: null,
        testTime: ''

      },
      instrumentQcRules: {
        category: [
          { required: true, message: '质控分类必须选择', trigger: 'change' }
        ],
        qualityReagentLotNum: [
          { required: true, message: '控制液批号必须选择', trigger: 'change' }
        ],
        stripLotNum: [
          { required: true, message: '测试条批号必须选择', trigger: 'change' }
        ],
        result: [
          { required: true, message: '质控结果必须输入', trigger: 'blur' },
          {
            required: true,
            validator: validatorResult,
            trigger: 'blur'
          }
        ],
        testTime: [
          { required: true, message: '检测日期必须输入', trigger: 'change' }
        ],
        testUserCode: [
          { required: true, message: '检测人必须选择', trigger: 'change' }
        ]
      },
      reagentDialogVisible: false

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
    this.intiData()
    this.initOptions()
  },
  mounted () {
    this.onSearch()
  },
  methods: {
    intiData () {
      this.conditionForm.endDate = moment().format('YYYY-MM-DD')
      this.conditionForm.beginDate = moment().subtract(1, 'M').format('YYYY-MM-DD')
      this.conditionForm.departmentName = this.departmentName
      this.conditionForm.departmentCode = this.departmentCode
    },
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
        this.onSearch()
      }).catch(err => {
        console.log(err)
      })
      getTestItems().then(res => {
        this.testOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
      getDoctors().then(res => {
        this.doctorOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })

      getDeviceStatusTypes().then(res => {
        this.deviceStatusOptions = res.dataContent
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

    onSearch () {
      this.conditionForm.page = 1
      this.loadData()
    },
    loadData () {
      if (this.isValidDateArea()) {
        this.loading = true
        qcQuery(this.conditionForm).then(res => {
          this.loading = false
          this.tableData = res.dataContent.records
          this.total = res.dataContent.total
        }).catch(err => {
          this.loading = false
          console.log(err)
          Message.error(err.message)
        })
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    },
    clearQcData () {
      this.instrumentQc = {
        recordId: 0,
        category: '',
        testUserCode: '',
        isPassed: '',
        qualityReagentLotNum: '',
        qualityReagent: null,
        qualityReagentType: '',
        qualityReagentDisabled: true,
        stripDisabled: true,
        remark: '',
        result: 0,
        sn: '',
        solution: '',
        stripLotNum: '', // need
        strip: null,
        testTime: ''
      }
    },
    changeDepentSelHandle (val) {
      this.handleNodeClear()
      this.conditionForm.departmentCode = val.id
    },
    inoutDepentChangeHandle (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleNodeClear()
      }
    },
    handleNodeClear () {
      this.conditionForm.departmentCode = null
    },
    // handleNodeClick (data) {
    //   this.conditionForm.departmentCode = data.code
    //   this.conditionForm.departmentName = data.name
    //   this.$refs.selTree.blur()
    // },
    handleCurrentChange (val) {
      this.conditionForm.page = val
      this.loadData()
    },
    handleSizeChange (val) {
      this.conditionForm.size = val
      this.loadData()
    },
    handleEdit (row) {
      this.clearQcData()
      this.instrumentQc.recordId = row.recordId
      this.instrumentQc.category = row.category
      this.instrumentQc.testUserCode = row.testUserCode
      this.instrumentQc.qualityReagentLotNum = row.qualityReagentLotNum
      this.instrumentQc.qualityReagentType = row.qualityReagentType
      this.instrumentQc.stripLotNum = row.stripLotNum
      this.instrumentQc.testTime = row.testTime
      this.instrumentQc.sn = row.meter
      this.instrumentQc.result = row.testValue
      // this.instrumentQc.result = row.result
      this.instrumentQc.isPassed = row.isPassed
      // this.instrumentQc.meter = row.meter

      this.refreshData()
      this.$nextTick(() => {
        this.reagentDialogVisible = true
      })
    },
    refreshData () {
      // availableTestStripOptions: [],
      // availableQualityReagentOptions: [],
      getAvailableQualityReagents(this.instrumentQc).then(res => {
        this.availableQualityReagentOptions = res.dataContent
        for (const index in this.availableQualityReagentOptions) {
          const element = this.availableQualityReagentOptions[index]
          if (element.lotNum === this.instrumentQc.qualityReagentLotNum) {
            this.instrumentQc.qualityReagentLotNum = element.lotNum
            this.instrumentQc.qualityReagentType = element.qualityReagentType
            this.instrumentQc.qualityReagent = element
          }
        }
        this.instrumentQc.qualityReagentDisabled = false
      }).catch(err => {
        console.log(err)
      })
      getAvailableTestStrips(this.instrumentQc).then(res => {
        this.availableTestStripOptions = res.dataContent
        for (const i in this.availableTestStripOptions) {
          const item = this.availableTestStripOptions[i]
          if (item.lotNum === this.instrumentQc.stripLotNum) {
            this.instrumentQc.strip = item
            this.instrumentQc.stripLotNum = item.lotNum
          }
        }
        this.instrumentQc.stripDisabled = false
      }).catch(err => {
        console.log(err)
      })
    },
    itemChanged (val) {
      this.conditionForm.page = 1
      this.loadData()
    },

    handleSaveQc () {
      this.$refs.instrumentQcForm.validate(valid => {
        if (valid) {
          console.log(this.instrumentQc)
          // this.instrumentQc.qualityReagentLotNum = this.instrumentQc.qualityReagent.lotNum
          // this.instrumentQc.qualityReagentType = this.instrumentQc.qualityReagent.qualityReagentType
          // this.instrumentQc.stripLotNum = this.instrumentQc.strip.lotNum

          // {
          //   qualityReagentLotNum: this.instrumentQc.qualityReagentLotNum,
          //   qualityReagentType: this.instrumentQc.qualityReagentType,
          //   recordId: this.instrumentQc.recordId,
          //   remark: this.instrumentQc.remark,
          //   result: this.instrumentQc.result,
          //   sn: this.instrumentQc.sn,
          //   stripLotNum: this.instrumentQc.stripLotNum,
          //   testTime: this.testTime
          // }
          qcUpdate(this.instrumentQc).then(res => {
            Message.success('保存质控更新记录成功')
            this.reagentDialogVisible = false
            this.clearQcData()
            this.loadData()
          }).catch(err => {
            console.log(err)
            Message.error(err.message)
          })
        }
      })
    },
    closedInstrucmentDialog () {
      this.$refs.instrumentQcForm.resetFields()
      this.reagentDialogVisible = false
    },
    computeQC () {
      console.log(this.instrumentQc)
      let isPass = false
      if (this.instrumentQc.strip !== null &&
        this.instrumentQc.qualityReagent !== null) {
        switch (this.instrumentQc.qualityReagent.qualityReagentType) {
          case 'First':
            isPass = this.instrumentQc.strip.qreagentFirstMinValue <= this.instrumentQc.result &&
              this.instrumentQc.strip.qreagentFirstMaxValue >= this.instrumentQc.result
            break
          case 'Second':
            isPass = this.instrumentQc.strip.qreagentSecondMinValue <= this.instrumentQc.result &&
              this.instrumentQc.strip.qreagentSecondMaxValue >= this.instrumentQc.result
            break
          case 'Third':
            isPass = this.instrumentQc.strip.qreagentThirdMinValue <= this.instrumentQc.result &&
              this.instrumentQc.strip.qreagentThirdMaxValue >= this.instrumentQc.result
            break
        }
      }
      this.instrumentQc.isPassed = isPass
    },
    qcTestSelectedChange (val) {
      this.instrumentQc.strip = null
      this.instrumentQc.qualityReagent = null
      this.instrumentQc.qualityReagentLotNum = ''
      this.instrumentQc.qualityReagentType = ''
      this.instrumentQc.stripLotNum = ''

      this.refreshData()
    },
    qualityReagentChanged (val) {
      this.instrumentQc.qualityReagentLotNum = val.lotNum
      this.instrumentQc.qualityReagentType = val.qualityReagentType
      this.$refs.instrumentQcForm.clearValidate()
      // this.$nextTick(() => this.$refs.ruleForm.clearValidate())
    },
    stripChanged (val) {
      this.instrumentQc.stripLotNum = val.lotNum
      this.$refs.instrumentQcForm.clearValidate()
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
        const url = this.$baseConfig.reportServiceUrl + '/report/QualityRecordReport' +
        '?Category=' + this.conditionForm.itemCategory +
        '&DepartmentCode=' + this.conditionForm.departmentCode +
        '&Status=' + this.conditionForm.status +
        '&Sn=' + this.conditionForm.sn +
        '&begin=' + this.conditionForm.beginDate +
        '&end=' + this.conditionForm.endDate +
        '&token=' + this.token
        window.open(url, '_blank')
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    }
  }
}
</script>
<style scoped>
.search-item {
  width: 200px;
}
.col-width1 {
  width: 50px;
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
