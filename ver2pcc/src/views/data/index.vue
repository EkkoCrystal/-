<template>
  <div>
    <div>
      <el-card>
        <el-form
          ref="coditionForm"
          v-model="conditionForm"
          size="small"
          :inline="true"
          label-width="80px"
        >
          <el-row>
            <el-col>
              <el-form-item
                prop="queryCondition"
                label="查询条件:"
              >
                <el-input
                  v-model="conditionForm.queryCondition"
                  class="search-item"
                  maxlength="32"
                  placeholder="姓名/床号/住院号"
                />
              </el-form-item>
              <!-- 科室选择 -->
              <el-form-item label="科室:">
                <div style="width:200px;height:32px">
                  <my-treeselect ref="selTree" :append-true="true" :mydata="deptOptions" :valuebb="departDefaultCodes" @changeSel="changeDepentSelHandle" @inputChanging="inoutDepentChangeHandle" />
                </div>
              </el-form-item>
              <!-- <el-form-item
                prop="departmentCode"
                label="科室:"
              >
                <el-select
                  ref="selTree"
                  v-model="conditionForm.departmentName"
                  clearable
                  class="search-item"
                  placeholder="请选择科室"
                  @clear="handleNodeClear"
                  @change="handleChangeDepartment"
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
              <el-form-item
                prop="doctorCode"
                label="医生:"
              >
                <el-select
                  v-model="conditionForm.doctorCode"
                  class="search-item"
                  clearable
                  placeholder="请选择医生"
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
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="onSearch"
                >查询</el-button>
                <el-button
                  v-show="!isDataView"
                  v-loading="buttonLoading"
                  type="primary"
                  size="small"
                  @click="vuePrint"
                >打印</el-button>
                <el-button
                  v-show="isDataView"
                  v-loading="buttonLoading"
                  type="primary"
                  size="small"
                  @click="vueAllPrint"
                >打印</el-button>
                <el-button
                  v-loading="loading"
                  type="primary"
                  size="small"
                  @click="changeDataView"
                >
                  <span v-if="isDataView">标准数据</span>
                  <span v-else>全部数据</span>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card style="margin:5px;">
        <div v-show="!isDataView">
          <div
            id="printContent"
            style="margin:5px;"
            class="print-content"
          >
            <div style="margin:10px" />
            <span style="color:'#303843';line-weight:13px;font-size:13px;padding:8px">（血糖值单位：mmol/L）</span>

            <el-table
              ref="tt"
              v-loading="loading"
              :data="tableData"
              style="width:100%"
              class="vue-print-table"
              stripe
              border
              highlight-current-row
              :header-cell-style="rowClass"
              :span-method="objectSpanMethod"
            >
              <el-table-column
                prop="testDay"
                align="center"
                min-width="100"
                label="检测日期"
              />
              <el-table-column
                prop="patient.departmentName"
                min-width="80"
                align="center"
                label="科室"
              />

              <el-table-column
                prop="patient.bed"
                min-width="70"
                align="center"
                label="床号"
              />
              <el-table-column
                prop="patient.hospitalizedNum"
                min-width="80"
                align="center"
                label="住院号"
              />

              <el-table-column
                prop="patient.patientName"
                align="center"
                label="姓名"
                min-width="80"
              >
                <template slot-scope="scope">
                  <el-link type="primary" @click="clickNavigate(scope.row.patient.id)">{{ scope.row.patient.patientName }}</el-link>
                </template>
              </el-table-column>

              <el-table-column
                label="凌晨"
                align="center"
                min-width="70"
                width="'10%'"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.dayBreak !== null">
                    <span :class="scope.row.dayBreak.determineType">
                      {{
                        scope.row.dayBreak.testValue
                      }}
                      <!-- <span class="unit">{{ scope.row.dayBreak.unit }}</span> -->
                      &nbsp;<span v-if="scope.row.dayBreak.determineType==='High'">↑</span>
                      <span v-if="scope.row.dayBreak.determineType==='Low'">↓</span>
                    </span>
                  </span></template>
              </el-table-column>
              <el-table-column
                label="空腹"
                align="center"
                min-width="70"
                width="'10%'"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.beforeBreakfast !== null">
                    <span :class="scope.row.beforeBreakfast.determineType">
                      {{
                        scope.row.beforeBreakfast.testValue
                      }}
                      <!-- <span class="unit">{{ scope.row.beforeBreakfast.unit }}</span> -->
                      &nbsp;<span v-if="scope.row.beforeBreakfast.determineType==='High'">↑</span>
                      <span v-if="scope.row.beforeBreakfast.determineType==='Low'">↓</span>
                    </span>
                  </span></template>
              </el-table-column>
              <el-table-column
                label="早餐后"
                align="center"
                min-width="70"
                width="'10%'"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.afterBreakfast !== null">
                    <span :class="scope.row.afterBreakfast.determineType">
                      {{
                        scope.row.afterBreakfast.testValue
                      }}
                      <!-- <span class="unit">{{ scope.row.afterBreakfast.unit }}</span> -->
                      &nbsp;<span v-if="scope.row.afterBreakfast.determineType==='High'">↑</span>
                      <span v-if="scope.row.afterBreakfast.determineType==='Low'">↓</span>
                    </span>
                  </span></template>
              </el-table-column>
              <el-table-column
                label="午餐前"
                align="center"
                min-width="70"
                width="'10%'"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.beforeLunch !== null">
                    <span :class="scope.row.beforeLunch.determineType">
                      {{
                        scope.row.beforeLunch.testValue
                      }}
                      <!-- <span class="unit">{{ scope.row.beforeLunch.unit }}</span> -->
                      &nbsp;<span v-if="scope.row.beforeLunch.determineType==='High'">↑</span>
                      <span v-if="scope.row.beforeLunch.determineType==='Low'">↓</span>
                    </span>
                  </span></template>
              </el-table-column>
              <el-table-column
                label="午餐后"
                align="center"
                min-width="70"
                width="'10%'"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.afterLunch !== null">
                    <span :class="scope.row.afterLunch.determineType">
                      {{
                        scope.row.afterLunch.testValue
                      }}
                      <!-- {{ scope.row.afterLunch.unit }} -->
                      &nbsp;<span v-if="scope.row.afterLunch.determineType==='High'">↑</span>
                      <span v-if="scope.row.afterLunch.determineType==='Low'">↓</span>
                    </span>
                  </span></template>
              </el-table-column>
              <el-table-column
                label="晚餐前"
                align="center"
                min-width="70"
                width="'10%'"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.beforeDinner !== null">
                    <span :class="scope.row.beforeDinner.determineType">
                      {{
                        scope.row.beforeDinner.testValue
                      }}
                      <!-- <span class="unit">{{ scope.row.beforeDinner.unit }}</span> -->
                      &nbsp;<span v-if="scope.row.beforeDinner.determineType==='High'">↑</span>
                      <span v-if="scope.row.beforeDinner.determineType==='Low'">↓</span>
                    </span>
                  </span></template>
              </el-table-column>
              <el-table-column
                label="晚餐后"
                align="center"
                min-width="70"
                width="'10%'"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.afterDinner !== null">
                    <span :class="scope.row.afterDinner.determineType">
                      {{
                        scope.row.afterDinner.testValue
                      }}
                      <!-- {{ scope.row.afterDinner.unit }} -->
                      &nbsp;<span v-if="scope.row.afterDinner.determineType==='High'">↑</span>
                      <span v-if="scope.row.afterDinner.determineType==='Low'">↓</span>
                    </span>
                  </span></template>
              </el-table-column>
              <el-table-column
                label="睡前"
                align="center"
                min-width="70"
                width="'10%'"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.beforeBed !== null">
                    <span :class="scope.row.beforeBed.determineType">
                      {{
                        scope.row.beforeBed.testValue
                      }}
                      <!-- {{ scope.row.beforeBed.unit }} -->
                      &nbsp;<span v-if="scope.row.beforeBed.determineType==='High'">↑</span>
                      <span v-if="scope.row.beforeBed.determineType==='Low'">↓</span>
                    </span>
                  </span></template>
              </el-table-column>
              <el-table-column label="随机" width="80" align="center">
                <el-table-column min-width="70" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.records !== null && scope.row.records.length >= 1"
                    >
                      <span v-for="(item,index) in scope.row.records" :key="index">
                        <span v-if="index === 0">
                          <span
                            v-if="item.testTime.includes(':') === false"
                            :class="item.determineType"
                          >
                            {{ jjFormateDate(item.testTime) }}
                            <!-- <span class="unit">{{ item.unit }}</span> -->
                            <span v-if="item.determineType ==='High'">↑</span>
                            <span v-if="item.determineType ==='Low'">↓</span>
                          </span>
                          <span v-else>
                            {{ jjFormateDate(item.testTime) }}
                          </span>
                        </span>
                      </span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column min-width="70" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.records !== null && scope.row.records.length >= 2"
                    >
                      <span v-for="(item,index) in scope.row.records" :key="index">
                        <span v-if="index === 1">
                          <span
                            v-if="item.testTime.includes(':') === false"
                            :class="item.determineType"
                          >
                            {{ jjFormateDate(item.testTime) }}
                            <!-- <span class="unit">{{ item.unit }}</span> -->
                            <span v-if="item.determineType ==='High'">↑</span>
                            <span v-if="item.determineType ==='Low'">↓</span>
                          </span>
                          <span v-else>
                            {{ jjFormateDate(item.testTime) }}
                          </span>
                        </span>
                      </span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column min-width="70" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.records !== null && scope.row.records.length === 3"
                    >
                      <span v-for="(item,index) in scope.row.records" :key="index">
                        <span v-if="index === 2">
                          <span
                            v-if="item.testTime.includes(':') === false"
                            :class="item.determineType"
                          >
                            {{ jjFormateDate(item.testTime) }}
                            <!-- <span class="unit">{{ item.unit }}</span> -->
                            <span v-if="item.determineType ==='High'">↑</span>
                            <span v-if="item.determineType ==='Low'">↓</span>
                          </span>
                          <span v-else>
                            {{ jjFormateDate(item.testTime) }}
                          </span>
                        </span>
                      </span>
                    </span>
                    <span
                      v-if="scope.row.records !== null && scope.row.records.length > 3"
                    >
                      <el-button type="text" size="small" @click="bgluMoreHandleClick(scope.row)">{{ moreFormate(scope.$index) }}</el-button>
                    </span>
                  </template>
                </el-table-column>

              </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-show="isDataView">
          <div
            id="printDataContent"
            style="margin:5px"
          >
            <el-table
              v-loading="loading"
              :data="tableAllData"
              class="vue-print-table"
              stripe
              border
              highlight-current-row
              :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
            >
              <el-table-column
                prop="testTime"
                label="检测日期"
                width="200"
                align="center"
              />
              <el-table-column
                prop="departmentName"
                width="120"
                align="center"
                label="科室"
              />

              <el-table-column
                prop="bed"
                width="120"
                align="center"
                label="床号"
              />
              <el-table-column
                prop="patientName"
                label="姓名"
                align="center"
              >
                <template slot-scope="scope">
                  <el-link type="primary" @click="clickNavigate(scope.row.patientId)">{{ scope.row.patientName }}</el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="periodName"
                label="检测时段"
                align="center"
              />
              <el-table-column
                prop="testValue"
                label="血糖值"
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
                label="单位"
                prop="unit"
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
              <el-table-column
                align="center"
                label="操作"
              >
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
        </div>
        <div style="float:right;margin:10px">
          <el-pagination
            layout="total, sizes, prev, pager, next"
            :total="conditionForm.total"
            :page-sizes="[10, 20, 30, 50]"
            :current-page.sync="conditionForm.page"
            :page-size.sync="conditionForm.size"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
      <!-- 更多血糖记录数据弹窗 -->
      <el-dialog
        :close-on-click-modal="false"
        title="随机血糖"
        border
        :visible.sync="dialogVisibleMore"
        width="700px"
      >
        <el-card>
          <div>
            <span style="color:'#303843';line-weight:13px;font-size:13px;padding:8px">（血糖值单位：mmol/L）</span>
            <el-table
              :data="moreTableData"
              style="width:100%"
              border
              stripe
              highlight-current-row
              :show-header="false"
            >
              <el-table-column v-for="(item, index) in moreTableData[0]" :key="index" align="center">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row[index].includes(':') === false"
                    :class="HLClass(scope.row[index])"
                  >
                    {{ scope.row[index] }}
                  </span>
                  <span v-else>
                    {{ scope.row[index] }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-dialog>

      <el-dialog
        title="修改血糖记录"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="700px"
        @close="closedFormDialog"
      >
        <el-card>
          <div style="margin:20px">
            <el-form
              ref="resultForm"
              :model="resultForm"
              :rules="resultFormRules"
              size="small"
              label-width="120px"
            >
              <el-form-item label="姓名:">
                {{ resultForm.patientName }}
              </el-form-item>
              <el-form-item
                label="检测日期:"
                prop="testTime"
              >
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
              <el-form-item
                label="检测结果:"
                prop="result"
              >
                <div style="width:410px">
                  <el-radio-group
                    v-model="resultForm.unenforced"
                    @change="groupChanged"
                  >
                    <el-radio :label="false">血糖值</el-radio>
                    <el-radio :label="true">未测原因</el-radio>
                  </el-radio-group>
                  <el-card>
                    <div v-if="!resultForm.unenforced">
                      <el-radio-group
                        v-model="selType"
                        style="width:100%;"
                      >
                        <el-row>
                          <el-col :span="8">
                            <el-radio :label="true">可测范围</el-radio>
                          </el-col>
                          <el-col :span="8">
                            <div v-if="selType">
                              <el-input-number
                                v-model="normalValue"
                                :min="0.6"
                                :max="33.3"
                                :precision="1"
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

                      <div
                        v-if="rejectReason==='Other'"
                        style="padding:10px"
                      >
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
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleUpdateData"
          >确 定</el-button>
        </span>
      </el-dialog>
      <div>
        <div
          id="printContent"
          ref="printContent"
          style="margin:5px;display:none"
        >
          <div style="margin:10px" />
          <div>
            <div
              v-for="(table,k) in printTableData"
              :key="k"
            >
              <div class="print-header-content">
                <el-row>
                  <el-col :span="6">&nbsp;</el-col>
                  <el-col :span="12">
                    <div style="text-align:center;font-size:16pt">
                      <div>{{ organizationName }}</div>
                      <div style="margin:5px">血糖检测记录表</div>
                    </div>
                  </el-col>
                  <el-col :span="6">&nbsp;</el-col>
                </el-row>
              </div>
              <table class="table" style="width: 100%">
                <thead>
                  <th>床号</th>
                  <th style="width: 70px">姓名</th>
                  <th style="width: 120px">日期</th>
                  <th>凌晨</th>
                  <th>空腹</th>
                  <th>早餐后</th>
                  <th>午餐前</th>
                  <th>午餐后</th>
                  <th>晚餐前</th>
                  <th>晚餐后</th>
                  <th>睡前</th>
                  <th colspan="6">随机血糖</th>
                </thead>
                <tbody>
                  <div v-for="(item, index) in table" :key="index">
                    <tr v-for="(itemm, indexx) in ((item.records === null | item.records.length <= 0) ? 2:Math.ceil(item.records.length / 6) * 2)" :key="indexx">
                      <!-- 如果indexx = 0 -->
                      <td v-if="indexx === 0" :rowspan="(item.records === null | item.records.length <= 0) ? 2:Math.ceil(item.records.length / 6) * 2">{{ item.patient.bed }}</td>
                      <!-- <td v-else>{{ item.bed }}</td> -->
                      <td v-if="indexx === 0" :rowspan="(item.records === null | item.records.length <= 0) ? 2:Math.ceil(item.records.length / 6) * 2">{{ item.patient.patientName }}</td>
                      <!-- <td v-else>{{ item.patientName }}</td> -->
                      <!-- <td v-else>{{ item.doctorName }}</td> -->
                      <td v-if="indexx === 0" :rowspan="(item.records === null | item.records.length <= 0) ? 2:Math.ceil(item.records.length / 6) * 2">{{ item.testDay }}</td>
                      <!-- <td v-else>{{ item.hospitalizedDate }}</td> -->

                      <td v-if="indexx %2=== 0" rowspan="2">
                        <span v-if="item.dayBreak !== null && indexx === 0">
                          <span :class="item.dayBreak.determineType">
                            {{
                              item.dayBreak.testValue
                            }}
                            <span v-if="item.dayBreak.determineType==='High'">↑</span>
                            <span v-if="item.dayBreak.determineType==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0" rowspan="2">
                        <span v-if="item.beforeBreakfast !== null && indexx === 0">
                          <span :class="item.beforeBreakfast.determineType">
                            {{
                              item.beforeBreakfast.testValue
                            }}
                            <span v-if="item.beforeBreakfast.determineType==='High'">↑</span>
                            <span v-if="item.beforeBreakfast.determineType==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0" rowspan="2">
                        <span v-if="item.afterBreakfast !== null && indexx === 0">
                          <span :class="item.afterBreakfast.determineType">
                            {{
                              item.afterBreakfast.testValue
                            }}
                            <span v-if="item.afterBreakfast.determineType==='High'">↑</span>
                            <span v-if="item.afterBreakfast.determineType==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0" rowspan="2">
                        <span v-if="item.beforeLunch !== null && indexx === 0">
                          <span :class="item.beforeLunch.determineType">
                            {{
                              item.beforeLunch.testValue
                            }}
                            <span v-if="item.beforeLunch.determineType==='High'">↑</span>
                            <span v-if="item.beforeLunch.determineType==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0" rowspan="2">
                        <span v-if="item.afterLunch !== null && indexx === 0">
                          <span :class="item.afterLunch.determineType">
                            {{
                              item.afterLunch.testValue
                            }}
                            <span v-if="item.afterLunch.determineType==='High'">↑</span>
                            <span v-if="item.afterLunch.determineType==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0" rowspan="2">
                        <span v-if="item.beforeDinner !== null && indexx === 0">
                          <span :class="item.beforeDinner.determineType">
                            {{
                              item.beforeDinner.testValue
                            }}
                            <span v-if="item.beforeDinner.determineType==='High'">↑</span>
                            <span v-if="item.beforeDinner.determineType==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0" rowspan="2">
                        <span v-if="item.afterDinner !== null && indexx === 0">
                          <span :class="item.afterDinner.determineType">
                            {{
                              item.afterDinner.testValue
                            }}
                            <span v-if="item.afterDinner.determineType==='High'">↑</span>
                            <span v-if="item.afterDinner.determineType==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0" rowspan="2">
                        <span v-if="item.beforeBed !== null && indexx === 0">
                          <span :class="item.beforeBed.determineType">
                            {{
                              item.beforeBed.testValue
                            }}
                            <span v-if="item.beforeBed.determineType==='High'">↑</span>
                            <span v-if="item.beforeBed.determineType==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0">
                        <span v-if="item.records !== null && item.records.length > 0">
                          {{ formatterValue(item.records, parseInt(indexx / 2) * 6, true) }}
                        </span>
                      </td>
                      <!-- 0~  0-1 = 0-5
                    1~  2-3 = 7-12
                    2~  4-5 = 13-18 -->
                      <td v-else>
                        <span v-if="item.records !== null && item.records.length > 0">
                          <span :class="formatterTypeValue(item.records, parseInt(indexx / 2) * 6)">
                            {{ formatterValue(item.records, parseInt(indexx / 2) * 6, false) }}
                            <!-- <span class="unit">{{ item.unit }}</span> -->
                            <span v-if="formatterTypeValue(item.records, parseInt(indexx / 2) * 6) ==='High'">↑</span>
                            <span v-if="formatterTypeValue(item.records, parseInt(indexx / 2) * 6) ==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0">
                        <span v-if="item.records !== null && item.records.length > 0">
                          {{ formatterValue(item.records, parseInt(indexx / 2) * 6 + 1, true) }}
                        </span>
                      </td>
                      <td v-else>
                        <span v-if="item.records !== null && item.records.length > 0">
                          <span :class="formatterTypeValue(item.records, parseInt(indexx / 2) * 6 + 1)">
                            {{ formatterValue(item.records, parseInt(indexx / 2) * 6 + 1, false) }}
                            <!-- <span class="unit">{{ item.unit }}</span> -->
                            <span v-if="formatterTypeValue(item.records, parseInt(indexx / 2) * 6 + 1) ==='High'">↑</span>
                            <span v-if="formatterTypeValue(item.records, parseInt(indexx / 2) * 6 + 1) ==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0">
                        <span v-if="item.records !== null && item.records.length > 0">
                          {{ formatterValue(item.records, parseInt(indexx / 2) * 6 + 2, true) }}
                        </span>
                      </td>
                      <td v-else>
                        <span v-if="item.records !== null && item.records.length > 0">
                          <span :class="formatterTypeValue(item.records, parseInt(indexx / 2) * 6 + 2)">
                            {{ formatterValue(item.records, parseInt(indexx / 2) * 6 + 2, false) }}
                            <!-- <span class="unit">{{ item.unit }}</span> -->
                            <span v-if="formatterTypeValue(item.records, parseInt(indexx / 2) * 6 + 2) ==='High'">↑</span>
                            <span v-if="formatterTypeValue(item.records, parseInt(indexx / 2) * 6 + 2) ==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0">
                        <span v-if="item.records !== null && item.records.length > 0">
                          {{ formatterValue(item.records, parseInt(indexx / 2) * 6 + 3, true) }}
                        </span>
                      </td>
                      <td v-else>
                        <span v-if="item.records !== null && item.records.length > 0">
                          <span :class="formatterTypeValue(item.records, parseInt(indexx / 2) * 6 + 3)">
                            {{ formatterValue(item.records, parseInt(indexx / 2) * 6 + 3, false) }}
                            <!-- <span class="unit">{{ item.unit }}</span> -->
                            <span v-if="formatterTypeValue(item.records, parseInt(indexx / 2) * 6 + 3) ==='High'">↑</span>
                            <span v-if="formatterTypeValue(item.records, parseInt(indexx / 2) * 6 + 3) ==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0">
                        <span v-if="item.records !== null && item.records.length > 0">
                          {{ formatterValue(item.records, parseInt(indexx / 2) * 6 + 4, true) }}
                        </span>
                      </td>
                      <td v-else>
                        <span v-if="item.records !== null && item.records.length > 0">
                          <span :class="formatterTypeValue(item.records, parseInt(indexx / 2) * 6 + 4)">
                            {{ formatterValue(item.records, parseInt(indexx / 2) * 6 + 4, false) }}
                            <!-- <span class="unit">{{ item.unit }}</span> -->
                            <span v-if="formatterTypeValue(item.records, parseInt(indexx / 2) * 6 + 4) ==='High'">↑</span>
                            <span v-if="formatterTypeValue(item.records, parseInt(indexx / 2) * 6 + 4) ==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0">
                        <span v-if="item.records !== null && item.records.length > 0">
                          {{ formatterValue(item.records, parseInt(indexx / 2) * 6 + 5, true) }}
                        </span>
                      </td>
                      <td v-else>
                        <span v-if="item.records !== null && item.records.length > 0">
                          <span :class="formatterTypeValue(item.records, parseInt(indexx / 2) * 6 + 5)">
                            {{ formatterValue(item.records, parseInt(indexx / 2) * 6 + 5, false) }}
                            <!-- <span class="unit">{{ item.unit }}</span> -->
                            <span v-if="formatterTypeValue(item.records, parseInt(indexx / 2) * 6 + 5) ==='High'">↑</span>
                            <span v-if="formatterTypeValue(item.records, parseInt(indexx / 2) * 6 + 5) ==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                    </tr>
                  </div>
                </tbody>
              </table>
              <div class="print-footerleft">
                <div style="font-size: 10px">
                  注: 血糖单位为mmol/L
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
        </div>
        <div
          id="printContentAll"
          ref="printContentAll"
          style="margin:5px;display:none"
        >
          <div class="print-header-content">
            <el-row>
              <el-col :span="6">&nbsp;</el-col>
              <el-col :span="12">
                <div style="text-align:center;font-size:16pt">
                  <div>{{ organizationName }}</div>
                  <div style="margin:5px">血糖检测记录表</div>
                </div>
              </el-col>
              <el-col :span="6">&nbsp;</el-col>
            </el-row>
          </div>
          <div style="margin:10px" />
          <div>
            <div
              v-for="(table,k) in printTableDataAll"
              :key="k"
            >
              <div class="table">
                <div class="table-tr">
                  <div class="table-td-xlg">检测日期</div>
                  <div class="table-td">床号</div>
                  <div class="table-td">姓名</div>
                  <div class="table-td">检测时段</div>
                  <div class="table-td">血糖值</div>
                  <div class="table-td">单位</div>
                  <div class="table-td">检测人</div>
                  <div class="table-td">备注</div>
                </div>
                <div
                  v-for="(item,index) in table"
                  :key="index"
                  class="table-tr"
                >
                  <div class="table-td"> {{ item.testTime }}</div>
                  <div class="table-td"> {{ item.bed }}</div>
                  <div class="table-td"> {{ item.patientName }}</div>
                  <div class="table-td"> {{ item.periodName }}</div>
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
              <div
                calss="table-tr"
                style="page-break-after:always"
              />
            </div>
          </div>
        </div>
        <iframe
          id="iframe"
          style="display:none;"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { queryTestDataByPivot, queryTestData, testResultChangeStatus, updateTestResult, getPeriodOptions, getRejectReason } from '@/api/test'
import { queryDoctors, getGenders, getDepartments } from '@/api/user'
import { addPrintStyle } from '@/utils/index'
import { Message } from 'element-ui'
import MyTreeselect from '@/components/common/MyTreeselect.vue'

export default {
  name: 'Data',
  components: { MyTreeselect },
  data () {
    return {
      loading: false,
      isDataView: false,
      buttonLoading: false,

      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'

      },
      genderOptions: [],
      doctorOptions: [

      ],
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
      periodOptions: [],
      dialogVisible: false,
      // 默认值
      departDefaultCodes: null,
      conditionForm: {
        category: 'GLU',

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
      tableData: [],
      dialogVisibleMore: false,
      moreTableData: [],
      tableAllData: [],
      printTableData: [],
      printTableDataOne: [],

      printTableDataAll: [],
      printPageSize: 16,
      resultForm: {
        category: 'GLU',
        patientName: '',
        id: 0,
        patientId: 0,
        period: '',
        remark: '',
        testTime: '',
        result: '',
        unenforced: false,
        cause: ''
      },
      resultFormRules: {
        patientId: [

          { required: true, message: '病人ID不能为空', trigger: 'blur' }

        ],
        period: [
          { required: true, message: '请选择检测时段', trigger: 'blur' }
        ],
        testTime: [
          { required: true, message: '请选择检测日期', trigger: 'blur' }
        ],
        result: [
          { required: true, message: '请输入检测结果或者拒测原因', trigger: 'blur' }
        ]
      },
      selType: true,
      normalValue: 0.6,
      textValue: '',
      rejectReason: ''

    }
  },
  computed: {
    ...mapGetters(['name', 'token', 'organizationName', 'departmentCode'])
  },
  mounted () {
    // this.onSearch()
  },
  created () {
    this.initOptions()
  },
  methods: {
    kkLog (item) {
      console.log(item)
    },
    formatterTypeValue (arr, index) {
      if (arr.length > index) {
        return arr[index].determineType
      }
    },
    formatterValue (arr, index, isTime) {
      if (arr.length > index) {
        return isTime === true ? moment(arr[index].testTime).format('HH:mm') : arr[index].testValue
      }
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
    onSearch () {
      this.conditionForm.page = 1
      this.loadData()
    },
    loadData () {
      if (this.isValidDateArea()) {
        this.loading = true
        if (this.isDataView) {
          queryTestData(this.conditionForm).then(res => {
            this.tableAllData = res.dataContent.records
            this.conditionForm.total = res.dataContent.total
            this.loading = false
          }).catch(err => {
            Message.error(err.message)
            this.loading = false
          })
        } else {
          queryTestDataByPivot(this.conditionForm).then(res => {
            // 处理数据
            if (res.dataContent.records !== null && res.dataContent.records.length > 0) {
              this.kk(res.dataContent.records)
            } else {
              this.tableData = res.dataContent.records
            }
            this.conditionForm.total = res.dataContent.total
            this.loading = false
          }).catch(err => {
            this.loading = false
            Message.error(err)
          })
        }
      } else {
        if (this.loading === true) {
          this.loading = false
        }
        Message.error('开始日期必须小于结束日期')
      }
    },
    // 血糖记录数据
    kk (resArr) {
      this.tableData = []
      const pp = JSON.parse(JSON.stringify(resArr))
      const uu = JSON.parse(JSON.stringify(resArr))
      pp.forEach(i => {
        i.records.forEach(j => {
          const ss = j.testTime
          j.testTime = j.testValue
          j.testValue = ss
          // Vue.set(j, j.testTime, j.testValu)
        })
      })
      uu.forEach(i => {
        pp.forEach(j => {
          if (j.testDay === i.testDay && j.patient.id === i.patient.id) {
            this.tableData.push(i)
            this.tableData.push(j)
          }
        })
      })
    },
    jjFormateDate (date) {
      return date.includes(':') === true ? moment(date).format('HH:mm') : date
    },
    // more
    bgluMoreHandleClick (dataVal) {
      if (dataVal === null) {
        return
      }
      this.dialogVisibleMore = true
      const data = JSON.parse(JSON.stringify(dataVal))
      data.records.forEach(i => {
        if (i.testValue.includes(':')) {
          const ss = i.testTime
          i.testTime = i.testValue
          i.testValue = ss
        }
      })
      data.records.sort(function (a, b) {
        var x = a['testTime']
        var y = b['testTime']
        return ((x < y) ? -1 : ((x < y) ? 1 : 0))
      })
      const matrixData = data.records.map((row) => {
        const arr = []
        for (const key in row) {
          if (key === 'testTime') {
            if (row[key].includes(':')) {
              arr.push(moment(row[key]).format('HH:mm'))
            }
          }
          if (key === 'testValue') {
            if (row['determineType'] === 'High') {
              arr.push(row[key] + '↑')
            } else if (row['determineType'] === 'Low') {
              arr.push(row[key] + '↓')
            } else {
              arr.push(row[key])
            }
          }
        }
        return arr
      })
      const transData = matrixData[0].map((col, i) => {
        return [...matrixData.map((row) => {
          return row[i]
        })]
      })
      this.moreTableData = transData
    },
    moreFormate (index) {
      return index % 2 === 0 ? '更多' : '. . .'
    },
    HLClass (val) {
      if (val.includes('↑')) {
        return 'High'
      }
      if (val.includes('↓')) {
        return 'Low'
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 13) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    rowClass ({ row, column, rowIndex, columnIndex }) {
      this.$nextTick(() => {
        if (document.getElementsByClassName(column.id).length !== 0) {
          document.getElementsByClassName(column.id)[0].setAttribute('rowSpan', 6)
          return false
        }
      })
      return "{ background: '#008767',color: '#F8F8FF',height: '20px',padding: '2px'}"
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
    formatTestDate (d) {
      return moment(d).format('HH:mm')
    },
    navigate () {
      this.$router.push({
        path: '/data/view'

      })
    },

    changeDataView () {
      this.conditionForm.page = 1
      this.conditionForm.toal = 0
      this.isDataView = !this.isDataView
      this.loading = true

      this.loadData()
    },
    handleCurrentChange (val) {
      this.conditionForm.page = val
      this.loadData()
    },
    handleSizeChange (val) {
      this.conditionForm.size = val
      this.loadData()
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
        cause: '',
        result: null,
        unenforced: data.unenforced

      }
      if (data.unenforced) {
        this.rejectReason = data.unenforcedReasonCode
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
          Message.error(err.message)
        })
      }).catch(err => {
        Message.error(err.message)
      })
    },
    groupChanged (val) {

    },
    inputChanged (val) {

    },
    selResultChanged (val) {

    },
    selRejectChanged (val) {

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
            console.log(err)
            Message.error('修改检测记录失败:' + err.message)
          })
        }
      })
    },
    closedFormDialog () {
      this.$refs.resultForm.resetFields()
      this.dialogVisible = false
    },
    async vuePrint () {
      // this.buttonLoading = true

      // const url = this.$baseConfig.reportServiceUrl + '/report/deppivotRecordReport' +
      //   '?QueryCondition=' + this.conditionForm.queryCondition +
      //   '&Begin=' + this.conditionForm.beginDate +
      //   '&End=' + this.conditionForm.endDate +
      //   '&DepartmentCode' + this.conditionForm.departmentCode +
      //   '&DoctorCode' + this.conditionForm.doctorCode +
      //   '&token=' + this.token
      // window.open(url, '_blank')
      // this.buttonLoading = false
      if (this.isValidDateArea()) {
        this.buttonLoading = true

        this.printTableData = []
        this.printTableDataAll = []
        const allData = []
        var pageCount = Math.ceil(this.conditionForm.total / this.printPageSize)
        for (var k = 1; k < pageCount + 1; k++) {
          await queryTestDataByPivot({
            category: 'GLU',
            queryCondition: this.conditionForm.queryCondition,
            beginDate: this.conditionForm.beginDate,
            endDate: this.conditionForm.endDate,
            doctorCode: this.conditionForm.doctorCode,
            departmentCode: this.conditionForm.departmentCode,
            page: k,
            size: this.printPageSize

          }).then(res => {
            if (res.dataContent.records !== null && res.dataContent.records.length > 0) {
              const arr = res.dataContent.records
              arr.forEach(item => {
                allData.push(item)
              })
              if (allData.length === this.conditionForm.total) {
                let currentRows = 0
                let cTable = []
                for (var e = 0; e < allData.length; e++) {
                  const obj = allData[e]
                  if (obj.records !== undefined && obj.records !== null && obj.records.length > 0) {
                    obj.rows = Math.ceil(obj.records.length / 6)
                  } else {
                    obj.rows = 1
                  }
                  if (currentRows === 0) {
                    cTable = []
                  }
                  currentRows = currentRows + obj.rows
                  if (e !== allData.length - 1) {
                    if (currentRows > 12) {
                      this.printTableData.push(cTable)
                      cTable = []
                      cTable.push(obj)
                      currentRows = 0
                      currentRows = currentRows + obj.rows
                    } else {
                      cTable.push(obj)
                    }
                  } else {
                    if (currentRows > 12) {
                      this.printTableData.push(cTable)
                      cTable = []
                      cTable.push(obj)
                      this.printTableData.push(cTable)
                    } else {
                      cTable.push(obj)
                      this.printTableData.push(cTable)
                    }
                  }
                }
              }
            }
          })
        }
        const iframe = window.frames[0]
        iframe.document.body.innerHTML = this.$refs.printContent.innerHTML
        addPrintStyle(iframe)
        iframe.window.print()
        this.buttonLoading = false
      } else {
        Message.error('开始日期必须小于结束日期')
      }
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
    async vueAllPrint () {
      if (!this.checkFormDate(this.conditionForm)) {
        return
      }
      if (this.isValidDateArea()) {
        this.buttonLoading = true
        const url = this.$baseConfig.reportServiceUrl + '/report/depRecordReport' +
        '?QueryCondition=' + this.conditionForm.queryCondition +
        '&Begin=' + this.conditionForm.beginDate +
        '&End=' + this.conditionForm.endDate +
        '&Category=' + this.conditionForm.category +
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
<style>
.Low {
  color: blue;
}
.High {
  color: red;
}
.tb {
  border-right: 1px dotted;
}

.dotline {
  border-top: 1px dotted;
}
.padding {
  padding: 4px;
}

.search-item {
  width: 220px;
}
.unit {
  padding-top: 5px;
  font-size: 3px;
}
@media print {
  .no-print {
    display: none !important;
  }

  .print-footer {
    position: fixed;
    bottom: 5px;
    right: 10px;
  }

}

</style>
