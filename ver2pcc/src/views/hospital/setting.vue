<template>
  <div>
    <el-card>
      <div style="margin:2px">
        <el-tabs v-model="activeName" type="border-card" @tab-click="tabHandleClick">
          <el-tab-pane label="医院信息" name="hospital">
            <el-form
              ref="formHospital"
              :model="hospital.form"
              :rules="hospital.formRules"
              size="small"
              label-width="120px"
            >
              <el-form-item label="医院名称:" prop="tenantName">
                <el-input v-model="hospital.form.tenantName" style="width:200px" placeholder="请输入医院名称" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveHospital">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="通信设置" name="commication">
            <el-form ref="formCommunication" :model="communication.form" :rules="communication.formRules" size="small" label-width="120px">
              <el-form-item label="服务端地址:" prop="address">
                <el-input v-model="communication.form.address" style="width:200px" placeholder="请输入服务器地址" />
              </el-form-item>
              <el-form-item label="服务端端口:" prop="port">
                <el-input v-model="communication.form.port" style="width:200px" placeholder="请输入服务器端口" />
              </el-form-item>
              <el-form-item label="HIS/LIS:">
                <el-checkbox v-model="communication.form.enable">启用HL7通讯服务</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveCommunication">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="血糖时段" name="glu">
            <div>
              <el-table
                v-loading="glu.loading"
                :data="glu.tableData"
                style="width: 100%"
                stripe
                border
                highlight-current-row
                :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
              >
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"
                />
                <el-table-column
                  prop="code"
                  label="代码"
                  align="center"
                />
                <el-table-column
                  prop="name"
                  label="名称"
                  align="center"
                />
                <el-table-column
                  prop="startTime"
                  label="开始时间"
                  align="center"
                />
                <el-table-column
                  prop="endTime"
                  label="结束时间"
                  align="center"
                />
                <el-table-column
                  label="操作"
                  align="center"
                  width="180"
                >
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleGluEdit(scope.row)">修改</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="胰岛素时段" name="insulin">
            <div style="float:right;margin:2px">
              <el-button type="primary" size="mini" @click="handleInsulinNew">新增</el-button>
            </div>
            <div>
              <el-table
                v-loading="insulin.loading"
                :data="insulin.tableData"
                style="width: 100%"
                stripe
                border
                highlight-current-row
                :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
              >
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"
                />
                <el-table-column
                  prop="code"
                  label="代码"
                  align="center"
                />
                <el-table-column
                  prop="name"
                  label="名称"
                  align="center"
                />
                <el-table-column
                  prop="startTime"
                  label="开始时间"
                  align="center"
                />
                <el-table-column
                  prop="endTime"
                  label="结束时间"
                  align="center"
                />

                <el-table-column
                  label="操作"
                  align="center"
                  width="180"
                >
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleInsulinEdit(scope.row)">修改</el-button>
                    <el-button type="text" @click="handleInsulinDelete(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="单位设置" name="unit">
            <div style="float:right;margin:2px">
              <el-button type="primary" size="mini" @click="handleUnitNew">新增</el-button>
            </div>
            <div>
              <el-table
                v-loading="unit.loading"
                :data="unit.tableData"
                style="width: 100%"
                stripe
                border
                highlight-current-row
                :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
              >
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"
                />
                <el-table-column
                  prop="code"
                  label="单位"

                  align="center"
                />
                <el-table-column
                  label="操作"
                  align="center"
                  width="180"
                >
                  <template slot-scope="scope">
                    <!-- <el-button type="text" @click="handleEdit(scope.row)">修改</el-button> -->
                    <el-button type="text" @click="handleUnitDelete(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="margin:5px;float:right">
              <el-pagination
                :page-sizes="[10, 20, 30, 50]"
                layout="total, sizes, prev, pager, next"
                :total="unit.searchForm.total"
                :page-size.sync="unit.searchForm.size"
                @size-change="handleUnitSizeChange"
                @current-change="handleUnitCurrentChange"
              />
            </div>
          </el-tab-pane>
          <!-- 靶值设置 -->
          <el-tab-pane
            label="靶值设置"
            value="targetValue"
            name="targetValue"
          >
            <div style="margin: 20px">
              <el-form
                ref="targetvalueForm"
                :rules="targetvalueRules"
                :model="targetvalue"
                size="small"
                label-width="120px"
              >
                <el-form-item label="测试条类型:" prop="stripType">
                  <el-select
                    ref="selTargetValue"
                    v-model="targetvalue.stripType"
                    placeholder="请选择"
                    autocomplete
                    class="small-form-item"
                    @change="initTargetValue"
                    @clear="handleTargetValueClear"
                  >
                    <el-option
                      v-for="item in stripTypes"
                      :key="item.name"
                      :label="item.display"
                      :value="item.name"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="控制液0的SD值:" label-width="150px" prop="qreagentFirstSd" style="margin-top: 20px">
                  <el-input-number
                    v-model="targetvalue.qreagentFirstSd"
                    class="control-input"
                    :precision="2"
                    :min="0"
                  />
                </el-form-item>
                <el-form-item label="控制液0的靶值:" label-width="150px" prop="qreagentFirstTargetValue" style="margin-top: 20px">
                  <el-input-number
                    v-model="targetvalue.qreagentFirstTargetValue"
                    class="control-input"
                    :precision="2"
                    :min="0"
                  />
                </el-form-item>
                <el-form-item label="控制液1的SD值:" label-width="150px" prop="qreagentSecondSd" style="margin-top: 20px">
                  <el-input-number
                    v-model="targetvalue.qreagentSecondSd"
                    class="control-input"
                    :precision="2"
                    :min="0"
                  />
                </el-form-item>
                <el-form-item label="控制液1的靶值:" label-width="150px" prop="qreagentSecondTargetValue" style="margin-top: 20px">
                  <el-input-number
                    v-model="targetvalue.qreagentSecondTargetValue"
                    class="control-input"
                    :precision="2"
                    :min="0"
                  />
                </el-form-item>
                <el-form-item label="控制液2的SD值:" label-width="150px" prop="qreagentThirdSd" style="margin-top: 20px">
                  <el-input-number
                    v-model="targetvalue.qreagentThirdSd"
                    class="control-input"
                    :precision="2"
                    :min="0"
                  />
                </el-form-item>
                <el-form-item label="控制液2的靶值:" label-width="150px" prop="qreagentThirdTargetValue" style="margin-top: 20px">
                  <el-input-number
                    v-model="targetvalue.qreagentThirdTargetValue"
                    class="control-input"
                    :precision="2"
                    :min="0"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" style="margin-top: 20px" @click="saveTargetvalue">
                    保存
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <!-- 危机值设置 -->
          <el-tab-pane
            label="危机值设置"
            value="criticalValue"
            name="criticalValue"
          >
            <div style="margin: 20px">
              <el-form
                ref="criticalValueForm"
                :model="criticalValue"
                :rules="criticalValueRules"
                size="small"
                label-width="120px"
              >
                <el-form-item label="项目类型:">
                  <el-select
                    v-model="criticalValue.category"
                    placeholder="请选择"
                    autocomplete
                    class="small-form-item"
                    @change="initCriticalValue"
                  >
                    <el-option
                      v-for="item in productOptions"
                      :key="item.name"
                      :label="item.displayName"
                      :value="item.name"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="危机低值:" label-width="120px" prop="minValue">
                  <el-input-number
                    v-model="criticalValue.minValue"
                    class="control-input"
                    :precision="1"
                    :min="0"
                  />&nbsp;&nbsp;(mmol/L)
                </el-form-item>
                <el-form-item label="危机低值颜色:" label-width="120px" prop="minColor">
                  <el-color-picker v-model="criticalValue.minColor" />
                </el-form-item>
                <el-form-item label="危机高值:" label-width="120px" prop="maxValue">
                  <el-input-number
                    v-model="criticalValue.maxValue"
                    class="control-input"
                    :precision="1"
                    :min="0"
                  />&nbsp;&nbsp;(mmol/L)
                </el-form-item>
                <el-form-item label="危机高值颜色:" label-width="120px" prop="maxColor">
                  <el-color-picker v-model="criticalValue.maxColor" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="saveCriticalValue">
                    保存
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <!-- APP参数设置 -->
          <el-tab-pane
            label="仪器参数设置"
            value="parValue"
            name="parValue"
          >
            <div>
              <el-table
                v-loading="parConfig.loading"
                :data="parConfig.tableData"
                style="width: 100%"
                stripe
                border
                highlight-current-row
                :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
              >
                <el-table-column
                  prop="value"
                  label="字典键值"
                  align="center"
                />
                <el-table-column
                  prop="remark"
                  label="描述信息"
                  align="left"
                />
                <el-table-column
                  label="操作"
                  align="center"
                  width="180"
                >
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleAPPEdit(scope.row)">修改</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <!-- 自动会诊设置 -->
          <el-tab-pane
            label="自动会诊设置"
            value="consultation"
            name="consultation"
          >
            <div style="margin: 20px">
              <el-form
                ref="consultationForm"
                :model="consultation"
                :rules="consultationRules"
                size="small"
                label-width="120px"
              >
                <el-form-item label="自动会诊:">
                  <el-switch
                    v-model="consultation.auto"
                    active-color="#13ce66"
                    @change="conSwitch"
                  />
                </el-form-item>
                <el-form-item
                  v-if="consultation.auto"
                  label="会诊医生:"
                  prop="doctorCode"
                >
                  <el-select
                    v-model="consultation.doctorCode"
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
                <el-form-item>
                  <el-button type="primary" @click="saveAutoConsultationInfo">
                    保存
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
    <div>
      <el-dialog
        title="单位编辑"
        :visible.sync="unit.dialogVisible"
        width="30%"
        :close-on-click-modal="false"
        @close="closedUnitDialog"
      >
        <div>
          <el-form
            ref="unitForm"
            style="width:100%"
            :model="unit.unitForm"
            :rules="unit.unitFormRules"

            size="mini"
            label-width="80px"
          >
            <el-form-item label="单位:" prop="code">
              <el-input v-model="unit.unitForm.code" placeholder="请输入单位" style="width:260px" />
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="unit.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleUnitSave">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        title="血糖时段"
        :visible.sync="glu.dialogVisible"
        width="700px"
        @close="closedGluDialog"
      >
        <div slot="title">血糖时段信息</div>
        <div style="padding:5px">
          <el-form
            ref="gluForm"
            :model="glu.form"
            :rules="glu.formRules"
            label-width="120px"
          >
            <el-form-item label="编码:" prop="code">
              <el-input
                v-model="glu.form.code"
                class="form-item"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="名称:" prop="name">
              <el-input v-model="glu.form.name" class="form-item" />
            </el-form-item>
            <el-form-item label="开始时间:" prop="startTime">
              <el-time-picker
                v-model="glu.form.startTime"
                class="form-item"
                type="time"
                format="HH:mm"
                value-format="HH:mm"
                :picker-options="{
                  start: '00:00',
                  step: '00:01',
                  end: '23:59',

                }"
              />
            </el-form-item>
            <el-form-item label="结束时间:" prop="endTime">
              <el-time-picker
                v-model="glu.form.endTime"
                class="form-item"
                type="time"
                format="HH:mm"
                value-format="HH:mm"
                :picker-options="{
                  start: '00:00',
                  step: '00:01',
                  end: '23:59',

                }"
              />
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="glu.dialogVisible = false"
          >取 消</el-button>
          <el-button
            type="primary"
            @click="handleGluSave"
          >确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        title="胰岛素时段"
        :visible.sync="insulin.dialogVisible"
        width="700px"
        @close="closedInsulinDialog"
      >
        <div slot="title">胰岛素时段信息</div>
        <div style="padding:5px">
          <el-form
            ref="formInsulin"
            :model="insulin.form"
            :rules="insulin.formRules"
            label-width="120px"
          >
            <el-form-item label="编码:" prop="code">
              <el-input v-model="insulin.form.code" class="form-item" />
            </el-form-item>
            <el-form-item label="名称:" prop="name">
              <el-input v-model="insulin.form.name" class="form-item" />
            </el-form-item>
            <el-form-item label="开始时间:" prop="startTime">
              <el-time-picker
                v-model="insulin.form.startTime"
                class="form-item"
                type="time"
                format="HH:mm"
                value-format="HH:mm"
                :picker-options="{
                  start: '00:00',
                  step: '00:01',
                  end: '23:59',

                }"
              />
            </el-form-item>
            <el-form-item label="结束时间:" prop="endTime">
              <el-time-picker
                v-model="insulin.form.endTime"
                class="form-item"
                type="time"
                format="HH:mm"
                value-format="HH:mm"
                :picker-options="{
                  start: '00:00',
                  step: '00:01',
                  end: '23:59',

                }"
              />
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="insulin.dialogVisible = false"
          >取 消</el-button>
          <el-button
            type="primary"
            @click="handleInsulinSave"
          >确 定</el-button>
        </span>
      </el-dialog>

      <!-- APP参数设置 -->
      <el-dialog
        :close-on-click-modal="false"
        title="仪器参数设置"
        :visible.sync="parConfig.dialogVisible"
        width="700px"
        @close="closedParDialog"
      >
        <div slot="title">仪器参数信息</div>
        <div style="padding:5px">
          <el-form
            ref="parForm"
            :model="parConfig.form"
            :rules="parConfig.formRules"
            label-width="120px"
          >
            <!-- <el-form-item label="字典名称:" prop="key">
              <el-input v-model="parConfig.form.key" class="form-item" />
            </el-form-item> -->
            <el-form-item label="字典键值:" prop="value">
              <el-input v-model="parConfig.form.value" class="form-item" />
            </el-form-item>
            <el-form-item label="描述信息:" prop="remark">
              <el-input v-model="parConfig.form.remark" type="textarea" class="form-item" :disabled="true" />
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="parConfig.dialogVisible = false"
          >取 消</el-button>
          <el-button
            type="primary"
            @click="handleParConfigSave"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { getLisConfig, setLisConfig, saveHospital, getTargetValueInfo,
  saveTargetValueInfo, getCrisisValueInfo, saveCrisisValueInfo,
  parConfigInfo, saveParConfigInfo, getDoctors, getAutoConsultation, saveAutoConsultation
} from '@/api/user'
import { queryUnit, createUnit, deleteUnit,
  getInsulinTimePeriodList, updateInsulinTimePeriod, deleteInsulinTimePeriod,
  getGluPeriodList, updateGluPeriod, createInsulinTimePeriod
} from '@/api/patient'
import { getStripTypesItems, getTestItems } from '@/api/test'

import moment from 'moment'
export default {
  name: 'Setting',
  data () {
    const validateIp = (rule, value, callback) => {
      var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/

      if (!reg.test(value)) {
        callback('IP 地址格式错误')
      } else {
        callback()
      }
    }
    const validatePort = (rule, value, callback) => {
      var reg = /^\d{1,6}$/
      if (!reg.test(value)) {
        callback('服务器端口是1-6位整数')
      } else {
        callback()
      }
    }
    const validatestripType = (rule, value, callback) => {
      if (!value || value === '') {
        callback('测试条类型必须输入，不能为空')
      } else {
        callback()
      }
    }
    return {
      activeName: 'hospital',
      hospital: {
        form: {
          tenantName: ''
        },
        formRules: {
          tenantName: [
            { required: true, message: '医院名称必须输入', trigger: 'blur' },
            { min: 2, max: 50, message: '医院名称长度2-50个字符', trigger: 'blur' }
          ]
        }
      },
      communication: {
        form: {
          address: '127.0.0.1',
          port: 9011,
          enable: false
        },
        formRules: {
          address: [
            { required: true, message: '服务器地址必须输入', trigger: 'blur' },
            { validator: validateIp, trigger: 'blur' }
          ],
          port: [
            { required: true, validator: validatePort, trigger: 'blur' }
          ]
        }
      },
      unit: {
        loading: false,
        searchForm: {
          queryCondition: '',
          page: 1,
          size: 20,
          total: 0
        },
        unitForm: {
          code: '',
          isEdit: false
        },
        unitFormRules: {
          code: [
            { required: true, message: '单位必须输入', trigger: 'blur' },
            { min: 1, max: 12, message: '单位长度1-12位字符', trigger: 'blur' }
          ]
        },
        dialogVisible: false,
        tableData: []
      },
      glu: {
        loading: false,
        dialogVisible: false,
        tableData: [],
        form: {
          code: '',
          name: '',
          startTime: '',
          endTime: ''
        },
        formRules: {
          code: [
            { required: true, message: '编码必须输入', trigger: 'blur' },
            { min: 1, max: 12, message: '编码1-12个字符' }
          ],
          name: [
            { required: true, message: '名称必须输入', trigger: 'blur' },
            { min: 1, max: 12, message: '名称1-12个字符' }
          ]
        }
      },
      insulin: {
        loading: false,
        dialogVisible: false,
        tableData: [],
        form: {
          code: '',
          name: '',
          startTime: '',
          endTime: '',
          isEdit: false
        },
        formRules: {
          code: [
            { required: true, message: '编码必须输入', trigger: 'blur' },
            { min: 1, max: 12, message: '编码1-12个字符' }
          ],
          name: [
            { required: true, message: '名称必须输入', trigger: 'blur' },
            { min: 1, max: 12, message: '名称1-12个字符' }
          ]
        }
      },

      stripTypes: [],
      targetvalue: {
        stripType: 'OCA',
        qreagentFirstSd: null,
        qreagentFirstTargetValue: null,
        qreagentSecondSd: null,
        qreagentSecondTargetValue: null,
        qreagentThirdSd: null,
        qreagentThirdTargetValue: null
      },
      targetvalueRules: {
        stripType: [
          { required: true, message: '测试条类型必须输入', trigger: 'change' },
          { validator: validatestripType, trigger: 'change' }
        ],
        qreagentFirstSd: [
          { required: true, message: '控制液0的SD值不能空，如果没有该控制液请输入0', trigger: 'blur' }
        ],
        qreagentFirstTargetValue: [
          { required: true, message: '控制液0的靶值不能空，如果没有该控制液请输入0', trigger: 'blur' }
        ],
        qreagentSecondSd: [
          { required: true, message: '控制液1的SD值不能空，如果没有该控制液请输入0', trigger: 'blur' }
        ],
        qreagentSecondTargetValue: [
          { required: true, message: '控制液1的靶值不能空，如果没有该控制液请输入0', trigger: 'blur' }
        ],
        qreagentThirdSd: [
          { required: true, message: '控制液2的SD值不能空，如果没有该控制液请输入0', trigger: 'blur' }
        ],
        qreagentThirdTargetValue: [
          { required: true, message: '控制液2的靶值不能空，如果没有该控制液请输入0', trigger: 'blur' }
        ]
      },
      // 危机值
      criticalValue: {
        category: 'GLU',
        minValue: null,
        maxValue: null,
        minColor: null,
        maxColor: null
      },
      productOptions: [],
      criticalValueRules: {
        minValue: [
          { required: true, message: '危机低值不能空', trigger: 'blur' }
        ],
        maxValue: [
          { required: true, message: '危机高值不能空', trigger: 'blur' }
        ],
        minColor: [
          { required: true, message: '请选择危机低值颜色', trigger: 'blur' }
        ],
        maxColor: [
          { required: true, message: '请选择危机高值颜色', trigger: 'blur' }
        ]
      },
      // App参数
      parConfig: {
        loading: false,
        dialogVisible: false,
        tableData: [],
        form: {
          key: '',
          value: '',
          remark: '',
          type: 'APP'
        },
        formRules: {
          value: [
            { required: true, message: '字典键值必须输入', trigger: 'blur' }
          ]
        }
      },
      // 会诊
      consultation: {
        auto: false,
        doctorCode: null
      },
      consultationRules: {
        doctorCode: [
          { required: true, message: '请选择会诊医生', trigger: 'change' }
        ]
      },
      doctorOptions: []
    }
  },
  computed: {
    ...mapGetters(['organizationName', 'token'])
  },
  created () {
    this.initData()
    this.initStriptypes()
  },
  methods: {
    initData () {
      getLisConfig().then(res => {
        const address = res.dataContent.address
        this.communication.form.address = address.address
        this.communication.form.port = address.port
        this.communication.form.enable = res.dataContent.enable
      }).catch(err => {
        console.log(err)
      })
      this.hospital.form.tenantName = this.organizationName
      // 加载医生
      getDoctors().then(res => {
        this.doctorOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
      // 加载项目
      // 项目类型
      getTestItems().then(res => {
        this.productOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
    },
    tabHandleClick (tab) {
      if (tab.name === 'unit') {
        this.onUnitSearch()
      }
      if (tab.name === 'insulin') {
        this.insulinSearch()
      }
      if (tab.name === 'glu') {
        this.gluSearch()
      }
      if (tab.name === 'targetValue') {
        this.initStriptypes()
      }
      if (tab.name === 'criticalValue') {
        // 危机之默认值
        this.initCriticalValue('GLU')
      }
      if (tab.name === 'parValue') {
        this.parSearch()
      }
      if (tab.name === 'consultation') {
        this.initAutoConsultation()
      }
    },
    handleUnitNew () {
      this.unit.unitForm.code = ''
      this.unit.dialogVisible = true
    },
    handleUnitDelete (row) {
      this.$confirm('此操作将永久删除该单位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUnit(row.id).then(res => {
          Message.success('删除单位成功')
          this.onUnitSearch()
        }).catch(err => {
          console.log(err)
          Message.error(err.message)
        })
      })
    },
    handleUnitSizeChange (val) {
      this.unit.searchForm.size = val
      this.unitQuery()
    },
    handleUnitCurrentChange (val) {
      this.unit.searchForm.page = val
      this.unitQuery()
    },
    handleUnitSave () {
      this.$refs.unitForm.validate(valid => {
        if (valid) {
          createUnit(this.unit.unitForm).then(res => {
            this.unit.dialogVisible = false
            this.onUnitSearch()
          }).catch(err => {
            console.log(err.message)
            Message.error(err.message)
          })
        }
      })
    },
    closedUnitDialog () {
      this.$refs.unitForm.resetFields()
      this.unit.dialogVisible = false
    },
    onUnitSearch () {
      this.unit.searchForm.page = 1
      this.unitQuery()
    },
    unitQuery () {
      this.unit.loading = true
      // this.searchForm.page = 1
      queryUnit(this.unit.searchForm).then(res => {
        this.unit.tableData = res.dataContent
        this.unit.searchForm.total = res.dataContent.total
        this.unit.loading = false
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
        this.unit.loading = false
      })
    },
    saveCommunication () {
      this.$refs.formCommunication.validate(valid => {
        if (valid) {
          setLisConfig({
            address: {
              address: this.communication.form.address,
              port: this.communication.form.port
            },
            enable: this.communication.form.enable
          }).then(res => {
            Message.success('保存通信设置成功')
          }).catch(err => {
            console.log(err)
            Message.error(err.message)
          })
        }
      })
    },
    saveHospital () {
      this.$refs.formHospital.validate(valid => {
        if (valid) {
          saveHospital(this.hospital.form).then(res => {
            this.$store.dispatch('user/getInfo').then(() => {
              this.initData()
            })
            Message.success('设置信息成功')
          }).catch(err => {
            Message.error(err.message)
          })
        }
      })
    },
    handleInsulinEdit (row) {
      this.insulin.dialogVisible = true
      this.insulin.form.code = row.code
      this.insulin.form.name = row.name
      this.insulin.form.startTime = row.startTime
      this.insulin.form.endTime = row.endTime
      this.insulin.form.isEdit = true
    },
    handleInsulinNew () {
      this.insulin.isEdit = false
      this.insulin.dialogVisible = true
      this.insulin.form.code = null
      this.insulin.form.name = null
      this.insulin.startTime = null
      this.insulin.endTime = null
    },
    handleInsulinSave () {
      this.$refs.formInsulin.validate(valid => {
        if (valid && this.isValidFormTimeRange(this.insulin.form)) {
          if (this.insulin.form.isEdit) {
            updateInsulinTimePeriod(this.insulin.form).then(res => {
              Message.success('时段更新成功')
              this.insulin.dialogVisible = false
              this.insulinSearch()
            }).catch(err => {
              Message.error(err.message)
              console.log(err.message)
            })
          } else {
            createInsulinTimePeriod(this.insulin.form).then(res => {
              Message.success('新增时段成功')
              this.insulin.dialogVisible = false
              this.insulinSearch()
            }).catch(err => {
              Message.error(err.message)
            })
          }
        }
      })
    },
    closedInsulinDialog () {
      this.$refs.formInsulin.resetFields()
      this.insulin.dialogVisible = false
    },
    handleInsulinDelete (row) {
      this.$confirm('此操作将永久删除该时段, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteInsulinTimePeriod(row.code).then(res => {
          Message.success('删除时段成功')
          this.insulinSearch()
        }).catch(err => {
          console.log(err)
          Message.error(err.message)
        })
      })
    },
    insulinSearch () {
      this.insulin.loading = true
      getInsulinTimePeriodList().then(res => {
        this.insulin.tableData = res.dataContent
        this.insulin.loading = false
      }).catch(err => {
        this.insulin.loading = false
        console.log(err.message)
      })
    },
    handleGluEdit (row) {
      this.glu.dialogVisible = true
      this.glu.form.code = row.code
      this.glu.form.name = row.name
      this.glu.form.startTime = row.startTime
      this.glu.form.endTime = row.endTime
    },
    gluSearch () {
      this.glu.loading = true
      getGluPeriodList().then(res => {
        this.glu.tableData = res.dataContent
        this.glu.loading = false
      }).catch(err => {
        this.glu.loading = false
        console.log(err.message)
      })
    },
    handleGluSave () {
      this.$refs.gluForm.validate(valid => {
        if (valid && this.isValidFormTimeRange(this.glu.form)) {
          updateGluPeriod(this.glu.form).then(res => {
            Message.success('更新血糖时段成功')
            this.glu.dialogVisible = false
            this.gluSearch()
          }).catch(err => {
            console.log(err.message)
          })
        }
      })
    },
    closedGluDialog () {
      this.$refs.gluForm.resetFields()
      this.glu.dialogVisible = false
    },
    isValidFormTimeRange (form) {
      const startTime = moment(form.startTime, 'HH:mm')

      const endTime = moment(form.endTime, 'HH:mm')
      if (startTime.isValid() && endTime.isValid()) {
        const diff = startTime.diff(endTime, 'seconds')

        if (diff < 0) {
          return true
        } else {
          Message.error('开始时间必须小于结束时间')
          return false
        }
      } else {
        return true
      }
    },

    initTargetValue (val) {
      // 靶值
      getTargetValueInfo(val).then(res => {
        this.clearDataQreagent(val)
        if (res.dataContent !== null) {
          this.targetvalue = res.dataContent
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleTargetValueClear (val) {
      this.clearDataQreagent(val)
    },
    initStriptypes () {
      // 测试条类型
      getStripTypesItems().then(res => {
        if (res.dataContent !== null) {
          this.stripTypes = res.dataContent
          if (this.stripTypes.length > 0) {
            // 加载默认靶值
            const kk = this.stripTypes[0]
            this.targetvalue.stripType = kk.name
            // 靶值
            this.initTargetValue(this.targetvalue.stripType)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    saveTargetvalue () {
      this.$refs.targetvalueForm.validate(valid => {
        if (valid) {
          saveTargetValueInfo(this.targetvalue).then(res => {
            Message.success('保存靶值信息成功')
          }).catch(err => {
            Message.error('保存靶值信息出错:' + err)
          })
        }
      })
    },
    clearData () {
      this.targetvalue = {
        stripType: '',
        qreagentFirstSd: undefined,
        qreagentFirstTargetValue: undefined,
        qreagentSecondSd: undefined,
        qreagentSecondTargetValue: undefined,
        qreagentThirdSd: undefined,
        qreagentThirdTargetValue: undefined

      }
    },
    clearDataQreagent (val) {
      this.targetvalue = {
        stripType: val,
        qreagentFirstSd: undefined,
        qreagentFirstTargetValue: undefined,
        qreagentSecondSd: undefined,
        qreagentSecondTargetValue: undefined,
        qreagentThirdSd: undefined,
        qreagentThirdTargetValue: undefined

      }
    },

    // 危机值
    initCriticalValue (val) {
      getCrisisValueInfo(val).then(res => {
        this.clearCrisisValueData(val)
        if (res.dataContent !== null) {
          this.criticalValue = res.dataContent
        }
      }).catch(err => {
        Message.error(err.message)
      })
    },
    isValidCriticalValue () {
      if (this.criticalValue.minValue !== null && this.criticalValue.maxValue !== null) {
        return !(this.criticalValue.minValue >= this.criticalValue.maxValue)
      } else {
        return true
      }
    },
    saveCriticalValue () {
      if (this.isValidCriticalValue()) {
        this.$refs.criticalValueForm.validate(valid => {
          if (valid) {
            saveCrisisValueInfo(this.criticalValue).then(res => {
              Message.success('保存危机值设置成功')
            // this.initCriticalValue('GLU')
            }).catch(err => {
              Message.error('保存危机值设置信息出错:' + err.message)
            })
          }
        })
      } else {
        Message.error('危机低值必须小于危机高值')
      }
    },
    clearCrisisValueData (val) {
      this.criticalValue = {
        category: 'GLU',
        minValue: undefined,
        maxValue: undefined,
        minColor: null,
        maxColor: null
      }
    },

    // APP参数设置
    parSearch () {
      this.parConfig.loading = true
      parConfigInfo().then(res => {
        this.parConfig.tableData = res.dataContent
        this.parConfig.loading = false
      }).catch(err => {
        this.parConfig.loading = false
        console.log(err.message)
      })
    },
    handleAPPEdit (row) {
      this.parConfig.dialogVisible = true
      this.parConfig.form.key = row.key
      this.parConfig.form.value = row.value
      this.parConfig.form.remark = row.remark
    },
    handleParConfigSave () {
      this.$refs.parForm.validate(valid => {
        if (valid) {
          saveParConfigInfo(this.parConfig.form).then(res => {
            Message.success('更新仪器参数成功')
            this.parConfig.dialogVisible = false
            this.parSearch()
          }).catch(err => {
            console.log(err.message)
          })
        }
      })
    },
    closedParDialog () {
      this.$refs.parForm.resetFields()
      this.parConfig.dialogVisible = false
    },
    // 自动会诊
    initAutoConsultation () {
      getAutoConsultation().then(res => {
        if (res.dataContent !== null) {
          this.consultation = res.dataContent
        }
      }).catch(err => {
        Message.error(err.message)
      })
    },
    conSwitch (val) {
      this.consultation.doctorCode = null
    },
    saveAutoConsultationInfo () {
      this.$refs.consultationForm.validate(valid => {
        if (valid) {
          saveAutoConsultation(this.consultation).then(res => {
            Message.success('自动会诊设置成功')
            this.initAutoConsultation()
          }).catch(err => {
            Message.error(err.message)
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.control-input {
  width: 140px;
}
.targetValueFormDiv el-form-item {
  margin-top: 90px;
}
::v-deep .el-table .cell {
  white-space: pre-line;
}
</style>
