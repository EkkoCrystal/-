<template>
  <div class="main">
    <el-card>
      <div slot="header" class="clearfix">
        <el-form v-model="form" :inline="true" size="small">
          <el-form-item label="科室:">
            <div style="width:200px;height:32px">
              <my-treeselect :append-true="true" :mydata="deptOptions" :valuebb="departDefaultCodes" @changeSel="changeDepentSelHandle" @inputChanging="inoutDepentChangeHandle" />
            </div>
          </el-form-item>
          <el-form-item prop="sn" label="仪器编号:">
            <el-input v-model="form.sn" class="search-item" /></el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="form.status" placeholder="请选择状态" clearable class="search-item">
              <el-option
                v-for="item in deviceStatusOptions"
                :key="item.name"
                :label="item.display"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button v-loading="buttonLoading" type="primary" @click="vuePrint">打印</el-button>
            <el-button type="primary" size="small" @click="handleNewInstrument">新增仪器</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <div style="margin:2px">
          <div style="margin:10px" />
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
              prop="department"
              label="科室"
              align="center"
            />
            <el-table-column
              prop="sn"
              label="仪器编号"
              align="center"
            >
              <template slot-scope="scope">
                <el-tooltip class="item" effect="light" placement="right">
                  <div slot="content">
                    <div v-for="item in scope.row.testNums" :key="item.category" style="padding:5px;font-size:12pt">
                      {{ item.categoryDisplay }}总计: {{ item.num }}
                    </div>
                  </div>
                  <div>
                    {{ scope.row.sn }}
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="manufactorDisplay"
              label="生产厂家"
              width="180"
              align="center"
            /> -->
            <!-- <el-table-column
              prop="deviceModel"
              label="仪器型号"
              align="center"
            /> -->
            <el-table-column
              prop="status"
              label="状态"
              align="center"
            />
            <el-table-column
              align="center"
              label="操作"
            >
              <!-- <template slot-scope="scope">
                <el-button type="text" @click="handleNewReagentQc(scope.row)">新增质控记录</el-button>
                <el-button type="text" @click="editInstrument(scope.row)">编辑</el-button>

              </template> -->
              <template slot-scope="scope">
                <el-button
                  type="text"
                  :disabled="scope.row.statusCode===2"
                  @click="handleNewReagentQc(scope.row)"
                >
                  新增质控记录
                </el-button>
                <el-button
                  type="text"
                  @click="editInstrument(scope.row)"
                >
                  仪器信息
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div style="margin:5px;float:right">
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
        title="仪器信息"
        :visible.sync="dialogVisible"
        width="600px"
        @close="closedInstrucDdialog"
      >
        <div style="margin:20px">
          <el-form ref="instrumentForm" :model="instrument" :rules="insturmentRules" size="small" label-width="100px">
            <el-form-item label="仪器编号:" prop="sn">
              <el-input v-model="instrument.sn" :disabled="instrument.isEdit" class="form-item" />
            </el-form-item>
            <!-- 科室 -->
            <el-form-item label="科室:">
              <div style="width:290px;height:32px">
                <my-treeselect ref="addTree" :append-true="false" :mydata="deptOptionsAdd" :valuebb="addDepartDefaultCodes" @changeSel="changeDepentSelHandleTwo" @inputChanging="inoutDepentChangeHandleTwo" />
              </div>
            </el-form-item>
            <!-- <el-form-item prop="departmentCode" label="科室:">
                <el-select
                  ref="selDialogTree"
                  v-model="instrument.department"
                  class="form-item"
                  placeholder="请选择科室"
                >
                  <el-option
                    :label="instrument.department"
                    :value="instrument.department"
                  />
                  <el-tree
                    highlight-current
                    default-expand-all
                    :expand-on-click-node="false"
                    :data="deptOptions"
                    :props="defaultProps"
                    @node-click="handleDialogNodeClick"
                  />
                </el-select>
              </el-form-item> -->

            <!-- <el-form-item label="生产厂家:" prop="manufactor">
                <el-select v-model="instrument.manufactor" placeholder="请选择" class="form-item">
                  <el-option
                    v-for="item in manufactorOptions"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item> -->

            <!-- <el-form-item label="仪器型号:" prop="deviceModel">
                <el-input v-model="instrument.deviceModel" class="form-item" />
              </el-form-item> -->
            <el-form-item v-show="instrument.isEdit" label="仪器状态:" prop="status">
              <el-row>
                <el-col>
                  <el-select v-model="instrument.status" placeholder="请选择" class="form-item">
                    <el-option
                      v-for="item in deviceStatusOptions"
                      :key="item.name"
                      :label="item.display"
                      :value="item.name"
                    />
                  </el-select>
                </el-col>
                <el-col>
                  <el-tag type="warning">注: 该操作执行完,请在分析仪端同步数据</el-tag>
                </el-col>
              </el-row>
            </el-form-item>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleCreateInstrument"
          >确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        title="新增质控记录"
        :visible.sync="reagentDialogVisible"
        width="680px"
        class="addDialog"
        @close="closedInstrucQcDialog"
      >
        <el-card class="addCardFormitem">
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
                  <el-form-item label="项目类型:" prop="category">
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
                  <el-form-item label="控制液批号:" prop="qualityReagentLotNum">
                    <el-select
                      v-model="instrumentQc.qualityReagent"
                      value-key="lotNum"
                      placeholder="请选择"
                      class="form-item"
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
                <el-col :span="12">
                  <el-form-item label="生产厂家:">
                    <span v-if="instrumentQc.qualityReagent !== null">{{ instrumentQc.qualityReagent.manufactor }}</span>
                  </el-form-item>

                </el-col>
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
                  <el-form-item label="测试条批号:" prop="stripLotNum">
                    <el-select
                      v-model="instrumentQc.strip"
                      value="id"
                      value-key="lotNum"
                      placeholder="请选择"
                      class="form-item"
                      @change="stripChanged"
                    >
                      <el-option
                        v-for="item in availableTestStripOptions"
                        :key="item.lotNum"
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
                <el-col :span="12">
                  <el-form-item label="测试条类型:">
                    <span v-if="instrumentQc.strip !== null">{{ instrumentQc.strip.stripTypeDisplay }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-divider />
              <el-row>
                <el-col :span="12">
                  <el-form-item label="质控日期:" prop="testTime">
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
                  <el-form-item label="检测人:" prop="testUserCode">
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
                  <el-form-item label="检测值:" prop="result">
                    <el-input-number v-model="instrumentQc.result" class="small-form-item" :precision="2" :step="0.1" @change="computeQC" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="质控结果:" prop="isPassed">
                    <div v-show="instrumentQc.isPassed !==null">
                      <span v-if="instrumentQc.isPassed">合格</span>
                      <span v-else style="color:red">不合格</span>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    v-if="instrumentQc.isPassed !== null && instrumentQc.isPassed !== '' && !instrumentQc.isPassed"
                    key="remark"
                    label="失败原因:"
                    prop="failureReason"
                  >
                    <el-input
                      v-model="instrumentQc.failureReason"
                      class="small-form-demo"
                      type="textarea"
                      placeholder="请输入"
                      maxlength="60"
                      rows="3"
                      show-word-limit
                    />
                  </el-form-item>
                  <el-form-item v-else label="备注:">
                    <el-input
                      v-model="instrumentQc.remark"
                      class="small-form-demo"
                      type="textarea"
                      placeholder="请输入"
                      maxlength="60"
                      rows="3"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    v-if="instrumentQc.isPassed !== null && instrumentQc.isPassed !== '' && !instrumentQc.isPassed"
                    label="改进措施:"
                    prop="solution"
                  >
                    <el-input
                      v-model="instrumentQc.solution"
                      class="small-form-demo"
                      type="textarea"
                      placeholder="请输入改进措施"
                      maxlength="60"
                      rows="3"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>

        <span slot="footer" class="dialog-footer">
          <el-button @click="reagentDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleSaveQc"
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
              <div style="margin:5px">仪器记录</div>
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
              <div class="table-td-lg">科室</div>
              <div class="table-td">仪器编号</div>
              <div class="table-td">状态</div>
            </div>
            <div v-for="(item,index) in table" :key="index" class="table-tr">
              <div class="table-td">  {{ item.department }}</div>
              <div class="table-td">  {{ item.sn }}</div>
              <div class="table-td"> {{ item.status }}</div>
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
import { getDepartments, getDoctors } from '@/api/user'
import { getTestItems } from '@/api/test'
// import { addPrintStyle } from '@/utils/index'
import { Message } from 'element-ui'
import { deviceQuery, getManufacturer, createInstrument, qcSave, updateInstrument,
  getAvailableQualityReagents, getAvailableTestStrips, getDeviceStatusTypes } from '@/api/qc'
import MyTreeselect from '@/components/common/MyTreeselect.vue'

export default {
  name: 'Instrument',
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
      deptOptionsAdd: [],
      defaultProps: {
        children: 'children',
        label: 'name'

      },
      loading: false,
      buttonLoading: false,
      printTableData: [],
      printPageSize: 32,
      testOptions: [

      ],
      deviceStatusOptions: [],

      doctorOptions: [],
      manufactorOptions: [],
      availableTestStripOptions: [],
      availableQualityReagentOptions: [],
      // 默认值
      departDefaultCodes: null,
      form: {
        departmentCode: '',
        departmentName: '',
        size: 20,
        page: 1,
        sn: '',
        status: ''
      },
      // 新增默认null
      addDepartDefaultCodes: [],
      instrument: {
        departmentCode: '',
        department: '',
        deviceModel: '',
        manufactor: 'acon',
        sn: '',
        status: '',

        isEdit: false

      },
      insturmentRules: {
        departmentCode: [
          { required: true, message: '科室必须选择', trigger: 'change' }
        ],
        deviceModel: [
          { required: true, message: '仪器型号必须输入', trigger: 'blur' },
          { min: 3, max: 32, message: '仪器类型长度3-32位' }
        ],
        manufactor: [
          { required: true, message: '厂家必须选择', trigger: 'blur' }
        ],
        sn: [
          // { required: true, validator: validateSN, trigger: 'blur' }
          { required: true, message: '仪器SN必须输入', trigger: 'blur' },
          { min: 3, max: 32, message: '仪器SN长度3-32位' }
        ]

      },

      instrumentQc: {
        category: 'GLU',
        testUserCode: '',
        isPassed: '',
        qualityReagentLotNum: '',
        qualityReagent: null,
        qualityReagentType: '',
        remark: '',
        failureReason: '',

        result: 0,
        sn: '',
        solution: '',
        stripType: '',
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
        ],
        isPassed: [
          { required: true, message: '质控无结果', trigger: 'blur' }
        ],
        failureReason: [
          { required: true, message: '失败原因必须输入', trigger: 'blur' }
        ],
        solution: [
          { required: true, message: '改进措施必须输入', trigger: 'blur' }
        ]

      },
      tableData: [],
      total: 0,
      dialogVisible: false,
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
    this.initOptions()
  },
  mounted () {
    this.onSearch()
  },
  methods: {
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
        this.form.departmentCode = this.departmentCode
        this.deptOptions = res.dataContent
        this.deptOptionsAdd = res.dataContent
        this.onSearch()
      }).catch(err => {
        console.log(err)
      })
      getManufacturer().then(res => {
        this.manufactorOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
      getDoctors().then(res => {
        this.doctorOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })

      getTestItems().then(res => {
        this.testOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
      getDeviceStatusTypes().then(res => {
        this.deviceStatusOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
    },

    initDialogData () {
      const data = {
        category: this.instrumentQc.category,
        sn: this.instrumentQc.sn
      }
      // availableTestStripOptions: [],
      // availableQualityReagentOptions: [],
      getAvailableQualityReagents(data).then(res => {
        this.availableQualityReagentOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })

      getAvailableTestStrips(data).then(res => {
        this.availableTestStripOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
    },

    // handleNodeClick (data) {
    //   this.form.departmentCode = data.code
    //   this.form.departmentName = data.name
    //   this.$refs.selTree.blur()
    // },
    changeDepentSelHandle (val) {
      this.handleNodeClear()
      this.form.departmentCode = val.id
    },
    inoutDepentChangeHandle (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleNodeClear()
      }
    },
    handleNodeClear () {
      this.form.departmentCode = null
    },

    // second科室选择
    changeDepentSelHandleTwo (val) {
      this.handleNodeClearTwo()
      this.instrument.departmentCode = val.id
    },
    inoutDepentChangeHandleTwo (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleNodeClearTwo()
      }
    },
    handleNodeClearTwo () {
      this.instrument.departmentCode = null
    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    query () {
      this.loading = true
      // this.form.page = 1
      deviceQuery(this.form).then(res => {
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
    // 新增
    handleNewInstrument () {
      this.clearData()
      this.instrument.manufactor = 'acon'
      this.instrument.departmentCode = this.departmentCode
      this.addDepartDefaultCodes = []
      this.addDepartDefaultCodes.push(this.departmentCode)
      this.dialogVisible = true
    },
    handleCreateInstrument () {
      this.$refs.instrumentForm.validate(valid => {
        if (valid) {
          if (this.instrument.isEdit) {
            updateInstrument(this.instrument).then(res => {
              this.dialogVisible = false
              Message.success('更新设备信息成功')
              this.clearData()
              this.query()
            }).catch(err => {
              Message.error(err.message)
              console.log(err)
            })
          } else {
            createInstrument(this.instrument).then(res => {
              this.dialogVisible = false
              Message.success('保存设备成功')
              this.clearData()
              this.query()
            }).catch(err => {
              Message.error(err.message)
              console.log(err)
            })
          }
        }
      })
    },
    closedInstrucDdialog () {
      this.$refs.instrumentForm.resetFields()
      this.dialogVisible = false
    },
    clearData () {
      this.instrument = {
        departmentCode: '',
        department: '',
        deviceModel: '',
        manufactor: 'acon',
        sn: '',
        status: '',
        isEdit: false

      }
    },
    clearQcData () {
      this.instrumentQc = {

        category: '',
        testUserCode: '',

        isPassed: null,
        qualityReagentLotNum: '',
        qualityReagent: null,
        qualityReagentType: '',
        remark: '',
        failureReason: '',
        result: 0,
        sn: '',
        solution: '',

        stripType: '',
        stripLotNum: '', // need
        strip: null,
        testTime: ''

      }
      this.availableTestStripOptions = []
      this.availableQualityReagentOptions = []
    },
    handleNewReagentQc (row) {
      this.clearQcData()
      this.reagentDialogVisible = true
      this.instrumentQc.testTime = moment().format('YYYY-MM-DD HH:mm:ss')
      this.instrumentQc.sn = row.sn

      // this.initDialogData(this.instrumentQc.category, this.instrumentQc.sn)
    },
    handleSaveQc () {
      this.$refs.instrumentQcForm.validate(valid => {
        if (valid) {
          // this.instrumentQc.qualityReagentLotNum = this.instrumentQc.qualityReagent.lotNum
          // this.instrumentQc.qualityReagentType = this.instrumentQc.qualityReagent.qualityReagentType
          // this.instrumentQc.stripLotNum = this.instrumentQc.strip.lotNum
          this.instrumentQc.stripType = this.instrumentQc.strip.stripType
          qcSave(this.instrumentQc).then(res => {
            Message.success('保存质控记录成功')
            this.reagentDialogVisible = false
            this.clearQcData()
          }).catch(err => {
            console.log(err)
            Message.error(err.message)
          })
        }
      })
    },
    closedInstrucQcDialog () {
      this.$refs.instrumentQcForm.resetFields()
      this.reagentDialogVisible = false
    },
    computeQC () {
      let isPass = null
      if (this.instrumentQc.result === 0 || this.instrumentQc.result === undefined) {
        this.instrumentQc.isPassed = null
        this.$refs.instrumentQcForm.clearValidate()
        return
      }
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
      this.$refs.instrumentQcForm.clearValidate()
      this.instrumentQc.isPassed = isPass
    },
    qcTestSelectedChange (val) {
      this.instrumentQc.strip = null
      this.instrumentQc.qualityReagent = null
      this.instrumentQc.qualityReagentLotNum = ''
      this.instrumentQc.qualityReagentType = ''
      this.instrumentQc.stripLotNum = ''

      this.initDialogData()
    },
    qualityReagentChanged (val) {
      this.instrumentQc.qualityReagentLotNum = val.lotNum
      this.instrumentQc.qualityReagentType = val.qualityReagentType
      this.computeQC()
      // this.$refs.instrumentQcForm.clearValidate()

    // this.$nextTick(() => this.$refs.ruleForm.clearValidate())
    },
    stripChanged (val) {
      this.instrumentQc.stripLotNum = val.lotNum
      this.computeQC()
      this.$refs.instrumentQcForm.clearValidate()
    },
    // 编辑
    editInstrument (row) {
      this.instrument = {
        departmentCode: row.departmentCode,
        department: row.department,
        deviceModel: row.deviceModel,
        manufactor: row.manufactor,
        sn: row.sn,
        status: row.statusName,
        isEdit: true
      }
      if (row.statusName === 'Locked') {
        this.instrument.status = ''
      }
      this.addDepartDefaultCodes = []
      this.addDepartDefaultCodes.push(row.departmentCode)
      this.dialogVisible = true
    },
    async vuePrint () {
      // DepartmentCode
      // if (this.form.departmentCode === null ||
      //       this.form.departmentCode === undefined || this.form.departmentCode === '') {
      //   Message.error('请选择科室')
      //   return
      // }
      const url = this.$baseConfig.reportServiceUrl + '/report/deviceReport' +
        '?DepartmentCode=' + this.form.departmentCode +
        '&Status=' + this.form.status +
        '&Sn=' + this.form.sn +
        '&token=' + this.token
      window.open(url, '_blank')
    }
  }
}
</script>
<style scoped>
.main {
    margin:10px;
}
.form-item{
  width:290px
}
::v-deep .addDialog .el-dialog .el-dialog__body {
  padding-top: 0px;
  padding-bottom: 0px;
}
.addCardFormitem .el-form-item{
    margin-bottom: 15px;
}
.el-divider--horizontal{
     margin: 5px;
 }
.small-form-item{
  width:200px
}

.small-form-demo{
  width: 260px;
}
@media print {

  .print-footer{
    display: block!important;
    page-break-before: auto;
    position:fixed;bottom:5px; right:10px

  }

}
</style>
