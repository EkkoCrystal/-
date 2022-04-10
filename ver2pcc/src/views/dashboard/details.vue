<template>
  <div
    id="divRoot"
    class="divRoot"
  >
    <div>
      <div id="patient-info">
        <span style="font-size:16pt">{{ patient.patientName }}</span>
        <span style="font-size:12pt;margin-left:15px">{{
          patient.genderDisplay
        }}</span>
        <span style="margin:5px">|</span>
        <span style="font-size:12pt">{{ patient.age }}岁</span>
        <span style="margin:5px">|</span>
        <span style="font-size:12pt">{{ patient.departmentName }}</span>
      </div>
      <el-divider />
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="tabHandleClick"
      >
        <el-tab-pane
          label="基本信息"
          name="zero"
        >
          <el-card>
            <el-form
              ref="patientForm"
              :model="patient"
              style="margin: 50px 10px 50px 50px;width:100%"
              :inline="true"
              size="small"
              :rules="patientFormRules"
              label-width="120px"
            >
              <el-row :gutter="4">
                <el-col :span="10">
                  <el-form-item
                    label="姓名:"
                    prop="patientName"
                  >
                    <el-input
                      v-model="patient.patientName"
                      class="edit-form-item"
                      :disabled="isOutpatient"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item
                    label="性别:"
                    prop="gender"
                    :disabled="isOutpatient"
                  >
                    <el-select
                      v-model="patient.gender"
                      placeholder="请选择性别"
                      class="edit-form-item"
                      :disabled="isOutpatient"
                    >
                      <el-option
                        v-for="item in gendersOptions"
                        :key="item.name"
                        :label="item.display"
                        :value="item.name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="4">
                <el-col :span="10">
                  <el-form-item
                    label="出生日期:"
                    prop="birthday"
                  >
                    <el-date-picker
                      v-model="patient.birthday"
                      class="edit-form-item"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :disabled="isOutpatient"
                      @change="changeGetAge"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="年龄:">
                    <el-input
                      v-model="patient.age"
                      class="edit-form-item"
                      readonly
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="4">
                <el-col :span="10">
                  <el-form-item
                    label="身份证:"
                    prop="idCard"
                  >
                    <el-input
                      v-model="patient.idCard"
                      class="edit-form-item"
                      :disabled="isOutpatient"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item
                    label="联系方式:"
                    prop="phoneNumber"
                  >
                    <el-input
                      v-model="patient.phoneNumber"
                      type="tel"
                      class="edit-form-item"
                      :disabled="isOutpatient"
                    />
                  </el-form-item>

                </el-col>
              </el-row>
              <el-row :gutter="4">
                <el-col :span="10">
                  <el-form-item
                    label="入院日期:"
                    prop="hospitalizedDate"
                  >
                    <el-date-picker
                      v-model="patient.hospitalizedDate"
                      class="edit-form-item"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :disabled="isOutpatient"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item
                    label="住院号:"
                    prop="hospitalizedNum"
                  >
                    <el-input
                      v-model="patient.hospitalizedNum"
                      class="edit-form-item"
                      :disabled="isOutpatient"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="4">
                <el-col :span="10">
                  <el-form-item
                    label="腕带码:"
                    prop="code"
                  >
                    <el-input
                      v-model="patient.code"
                      class="edit-form-item"
                      :disabled="isOutpatient"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item
                    label="床号:"
                    prop="bed"
                  >
                    <el-input
                      v-model="patient.bed"
                      class="edit-form-item"
                      :disabled="isOutpatient"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="4">
                <el-col :span="10">
                  <el-form-item
                    label="科室"
                    prop="departmentCode"
                    :disabled="isOutpatient"
                  >
                    <div style="width:250px;height:32px">
                      <my-treeselect v-if="!isOutpatient" ref="selPatientTree" :append-true="true" :valuebb="departDefaultCodes" :mydata="deptOptions" @changeSel="changeDepentSelHandle" @inputChanging="inoutDepentChangeHandle" />
                      <el-input
                        v-else
                        v-model="patient.departmentName"
                        :disabled="isOutpatient"
                      />
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item
                    label="医生:"
                    prop="doctorCode"
                  >
                    <el-select
                      v-model="patient.doctorCode"
                      class="edit-form-item"
                      default-first-option
                      placeholder="请选择医生"
                      no-match-text="没有医生"
                      no-data-text="没有医生"
                      :disabled="isOutpatient"
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
                <el-col :span="6">
                  &nbsp;
                </el-col>
                <el-col :span="6">
                  <el-button
                    v-if="!isOutpatient"
                    type="primary"
                    @click="zeroTabSave"
                  >保存</el-button>
                  <el-button
                    v-if="!isOutpatient"
                    type="primary"
                    @click="zeroTabDischarge"
                  >出院</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </el-tab-pane>
        <el-tab-pane
          label="血糖"
          name="glu"
        >
          <el-tabs
            v-model="gluActiveName"
            @tab-click="gluTabHandleClick"
          >
            <el-tab-pane
              label="血糖记录"
              name="first"
            >
              <el-card>
                <div slot="header">
                  <el-form
                    v-model="firstTab.form"
                    :inline="true"
                    size="small"
                    label-width="80px"
                  >
                    <el-form-item label="开始日期:">
                      <el-date-picker
                        v-model="firstTab.form.beginDate"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                      />
                    </el-form-item>
                    <el-form-item label="结束日期:">
                      <el-date-picker
                        v-model="firstTab.form.endDate"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        @click="onFirstTabQuery"
                      >查询</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        v-if="!firstTab.dataView"
                        v-loading="firstTab.buttonLoading"
                        type="primary"
                        @click="vuePrintGLUPivot"
                      >打印</el-button>
                      <el-button
                        v-else
                        v-loading="firstTab.buttonLoading"
                        type="primary"
                        @click="vuePrintGLU"
                      >打印</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        @click="firstTabchangeView"
                      >
                        <span v-if="firstTab.dataView">标准数据</span>
                        <span v-else>全部数据</span>
                      </el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        v-if="!isOutpatient"
                        type="primary"
                        size="small"
                        @click="handleNewGluData"
                      >新增血糖</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div
                  v-show="!firstTab.dataView"
                  style="width:100%;margin:auto"
                >
                  <!-- 血糖记录 -->
                  <div
                    id="firstTabPrintContent"
                    style="width:100%;margin:auto"
                  >
                    <span style="color:'#303843';line-weight:13px;font-size:13px;padding:8px">（血糖值单位：mmol/L）</span>
                    <el-table
                      v-loading="firstTab.loading"
                      :data="firstTab.tableData"
                      stripe
                      border
                      highlight-current-row
                      :header-cell-style="rowClass"
                      :span-method="objectSpanMethod"
                      :cell-style="cellStyleMethod"
                    >
                      <el-table-column
                        prop="testDay"
                        label="检测日期"
                        min-width="100"
                        align="center"
                      />
                      <el-table-column
                        label="凌晨"
                        min-width="70"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span
                            v-if="scope.row.dayBreak !== null"
                            :class="scope.row.dayBreak.determineType"
                          >
                            {{ scope.row.dayBreak.testValue }}
                            <!-- <span class="unit">{{ scope.row.dayBreak.unit }}</span> -->
                            <span v-if="scope.row.dayBreak.determineType==='High'">↑</span>
                            <span v-if="scope.row.dayBreak.determineType==='Low'">↓</span>
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="空腹"
                        min-width="70"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span
                            v-if="scope.row.beforeBreakfast !== null"
                            :class="scope.row.beforeBreakfast.determineType"
                          >
                            {{ scope.row.beforeBreakfast.testValue }}
                            <!-- <span class="unit">{{ scope.row.beforeBreakfast.unit }}</span> -->
                            <span v-if="scope.row.beforeBreakfast.determineType==='High'">↑</span>
                            <span v-if="scope.row.beforeBreakfast.determineType==='Low'">↓</span>
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="早餐后"
                        min-width="70"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span
                            v-if="scope.row.afterBreakfast !== null"
                            :class="scope.row.afterBreakfast.determineType"
                          >
                            {{ scope.row.afterBreakfast.testValue }}
                            <!-- <span class="unit">{{ scope.row.afterBreakfast.unit }}</span> -->
                            <span v-if="scope.row.afterBreakfast.determineType==='High'">↑</span>
                            <span v-if="scope.row.afterBreakfast.determineType==='Low'">↓</span>
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="午餐前"
                        min-width="70"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span
                            v-if="scope.row.beforeLunch !== null"
                            :class="scope.row.beforeLunch.determineType"
                          >
                            {{ scope.row.beforeLunch.testValue }}
                            <!-- <span class="unit">{{ scope.row.beforeLunch.unit }}</span> -->
                            <span v-if="scope.row.beforeLunch.determineType==='High'">↑</span>
                            <span v-if="scope.row.beforeLunch.determineType==='Low'">↓</span>
                          </span>
                        </template>
                      </el-table-column>

                      <el-table-column
                        label="午餐后"
                        min-width="70"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span
                            v-if="scope.row.afterLunch !== null"
                            :class="scope.row.afterLunch.determineType"
                          >
                            {{ scope.row.afterLunch.testValue }}
                            <!-- <span class="unit">{{ scope.row.afterLunch.unit }}</span> -->
                            <span v-if="scope.row.afterLunch.determineType==='High'">↑</span>
                            <span v-if="scope.row.afterLunch.determineType==='Low'">↓</span>
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="晚餐前"
                        min-width="70"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span
                            v-if="scope.row.beforeDinner !== null"
                            :class="scope.row.beforeDinner.determineType"
                          >
                            {{ scope.row.beforeDinner.testValue }}
                            <!-- <span class="unit">{{ scope.row.beforeDinner.unit }}</span> -->
                            <span v-if="scope.row.beforeDinner.determineType==='High'">↑</span>
                            <span v-if="scope.row.beforeDinner.determineType==='Low'">↓</span>
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="晚餐后"
                        min-width="70"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span
                            v-if="scope.row.afterDinner !== null"
                            :class="scope.row.afterDinner.determineType"
                          >
                            {{ scope.row.afterDinner.testValue }}
                            <!-- <span class="unit">{{ scope.row.afterDinner.unit }}</span> -->
                            <span v-if="scope.row.afterDinner.determineType==='High'">↑</span>
                            <span v-if="scope.row.afterDinner.determineType==='Low'">↓</span>
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="睡前"
                        min-width="70"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span
                            v-if="scope.row.beforeBed !== null"
                            :class="scope.row.beforeBed.determineType"
                          >
                            {{ scope.row.beforeBed.testValue }}
                            <!-- <span class="unit">{{ scope.row.beforeBed.unit }}</span> -->
                            <span v-if="scope.row.beforeBed.determineType==='High'">↑</span>
                            <span v-if="scope.row.beforeBed.determineType==='Low'">↓</span>
                          </span>
                        </template>
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
                              v-if="scope.row.records !== null && scope.row.records.length >= 3"
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
                          </template>
                        </el-table-column>
                        <el-table-column min-width="70" align="center">
                          <template slot-scope="scope">
                            <span
                              v-if="scope.row.records !== null && scope.row.records.length >= 4 "
                            >
                              <span v-for="(item,index) in scope.row.records" :key="index">
                                <span v-if="index === 3">
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
                              v-if="scope.row.records !== null && scope.row.records.length === 5"
                            >
                              <span v-for="(item,index) in scope.row.records" :key="index">
                                <span v-if="index === 4">
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
                              v-if="scope.row.records !== null && scope.row.records.length > 5"
                            >
                              <el-button type="text" size="small" @click="bgluMoreHandleClick(scope.row)">{{ moreFormate(scope.$index) }}</el-button>
                            </span>
                          </template>
                        </el-table-column>
                      </el-table-column>
                    </el-table>

                    <!-- <table class="dataTablee" style="width:100%;height:100%;margin:0 auto">
                      <tr>
                        <th v-for="(item, index) in transTitle" :key="index" style="border:1px solid red">{{ item }}</th>
                      </tr>
                      <tr v-for="(item, index) in transPersonData" :key="index">
                        <td v-for="(hh, i) in item" :key="i">{{ hh }}</td>
                      </tr>
                    </table> -->
                  </div>
                </div>
                <div
                  v-show="firstTab.dataView"
                  style="width:1024px;margin:auto"
                >
                  <div
                    id="firstTabDataViewPrintContent"
                    style="width:980px;margin:auto"
                  >

                    <el-table
                      v-loading="firstTab.loading"
                      :data="firstTab.tableAllData"
                      stripe
                      border
                      highlight-current-row
                      :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
                    >
                      <el-table-column
                        prop="testTime"
                        label="检测日期"
                        align="center"
                      />
                      <el-table-column
                        prop="periodName"
                        label="检测时段"
                        align="center"
                      />
                      <el-table-column
                        label="血糖值"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span :class="scope.row.determineType">
                            {{ scope.row.testValue }}<span v-if="scope.row.determineType==='High'">↑</span>
                            <span v-if="scope.row.determineType==='Low'">↓</span>
                          </span>
                        </template>

                      </el-table-column>
                      <el-table-column
                        label="单位"
                        prop="unit"
                        align="center"
                      />
                      <el-table-column
                        prop="testUser"
                        label="检测人"
                        align="center"
                      />
                    </el-table>
                  </div>
                </div>
                <div style="float:right;margin:10px;pading-right:20px">
                  <el-pagination
                    :hide-on-single-page="false"
                    :page-sizes="[10, 20, 30, 50]"
                    :current-page.sync="firstTab.form.page"
                    :page-size="firstTab.form.size"
                    layout="total,sizes,prev,pager, next"
                    :total="firstTab.total"
                    @size-change="firstTabHandleSizeChange"
                    @current-change="firstTabHandleCurrentChange"
                  />
                </div>
              </el-card>
            </el-tab-pane>
            <el-tab-pane
              label="血糖分析"
              name="second"
            >
              <div style="margin:5px">
                <el-tabs
                  v-model="secondTab.activeName"
                  type="card"
                  @tab-click="secondTabClick"
                >
                  <el-tab-pane
                    label="血糖报告"
                    name="report"
                  >
                    <el-card>
                      <div slot="header">
                        <el-form
                          :inline="true"
                          :model="secondTab.report.form"
                          size="small"
                          label-width="80px"
                        >
                          <el-form-item
                            prop="beginDate"
                            label="开始日期:"
                          >
                            <el-date-picker
                              v-model="secondTab.report.form.beginDate"
                              type="date"
                              placeholder="选择日期"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              :clearable="false"
                            />
                          </el-form-item>
                          <el-form-item
                            prop="endDate"
                            label="结束日期:"
                          >
                            <el-date-picker
                              v-model="secondTab.report.form.endDate"
                              type="date"
                              placeholder="选择日期"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              :clearable="false"
                            />
                          </el-form-item>

                          <el-form-item>
                            <el-button
                              type="primary"
                              @click="secondTabReportQuery"
                            >查询</el-button>
                          </el-form-item>
                          <el-form-item>
                            <el-button
                              type="primary"
                              @click="bgluRepPrintHandle"
                            >打印</el-button>
                          </el-form-item>
                        </el-form>
                      </div>
                      <div
                        id="secondReportContent"
                        style="width:1024px;margin:auto"
                      >
                        <div style="margin:auto;text-align:center;width:800px">
                          <div style="padding:10px;font-size:18px">
                            <div>{{ organizationName }}</div>
                            <div style="margin-top:10px">血糖检测报告</div>
                          </div>
                          <div style="margin:5px;float:right;margin-right:10px">
                            <span v-if="secondTab.report.form.beginDate !== null && secondTab.report.form.endDate !== null && isValidDateArea(secondTab.report.form)">
                              报告日期： {{ secondTab.report.form.beginDate }} ~~
                              {{ secondTab.report.form.endDate }}
                            </span>
                            <span v-else>
                              报告日期：
                            </span>
                          </div>
                          <div class="line" />
                          <div style="padding-top:10px">
                            <el-row>
                              <el-col :span="6">姓名：{{ patient.patientName }}</el-col>
                              <el-col :span="6">性别：{{ patient.genderDisplay }}</el-col>
                              <el-col :span="6">年龄：{{ patient.age }}</el-col>
                            </el-row>
                          </div>
                          <div class="dotline" />
                          <div style="margin-top:20px">
                            <el-row>
                              <el-col :span="6">
                                检测天数：
                                <span
                                  v-if="
                                    secondTab.report.summary !== null &&
                                      secondTab.report.summary !== undefined
                                  "
                                >{{ secondTab.report.summary.testDays }}</span>
                                <span v-else>0</span>
                              </el-col>
                              <el-col :span="9">
                                检测次数：
                                <span
                                  v-if="
                                    secondTab.report.summary !== null &&
                                      secondTab.report.summary !== undefined
                                  "
                                >{{ secondTab.report.summary.testCount }}</span>
                                <span v-else>0</span>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="6">
                                平均血糖值：
                                <span
                                  v-if="
                                    secondTab.report.summary !== null &&
                                      secondTab.report.summary !== undefined
                                  "
                                >{{ secondTab.report.summary.avgResult }}</span>
                                <span v-else>0</span>&nbsp;mmol/L
                              </el-col>
                              <el-col :span="9">
                                标准差：
                                <span
                                  v-if="
                                    secondTab.report.summary !== null &&
                                      secondTab.report.summary !== undefined
                                  "
                                >{{ secondTab.report.summary.sdResult }}</span>
                                <span v-else>0</span>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="6">
                                最高血糖值：
                                <span
                                  v-if="
                                    secondTab.report.summary !== null &&
                                      secondTab.report.summary !== undefined
                                  "
                                >{{ secondTab.report.summary.maxResult }}</span>
                                <span v-else>0</span>&nbsp;mmol/L
                              </el-col>
                              <el-col :span="9">
                                最低血糖值：
                                <span
                                  v-if="
                                    secondTab.report.summary !== null &&
                                      secondTab.report.summary !== undefined
                                  "
                                >{{ secondTab.report.summary.minResult }}</span>
                                <span v-else>0</span>&nbsp;mmol/L
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                        <div style="margin:auto;width:800px;padding-top:20px">
                          <el-table
                            :data="secondTab.report.tableData"
                            style="width: 99%; border:1px solid #EBEEF5; border-color: #868686"
                            :cell-style="tableCellStyle"
                            :header-cell-style="tableHeaderCellStyle"
                          >
                            <el-table-column
                              prop="periodName"
                              label="时段"
                              align="center"
                            />
                            <el-table-column
                              prop="count"
                              label="检测次数"
                              align="center"
                            />
                            <el-table-column
                              prop="avg"
                              label="平均值"
                              align="center"
                            />
                            <el-table-column
                              label="达标"
                              align="center"
                            >
                              <el-table-column
                                prop="normalRate"
                                label="%"
                                width="70"
                                align="center"
                              />
                              <el-table-column
                                prop="normalCount"
                                label="次数"
                                width="60"
                                align="center"
                              />
                            </el-table-column>
                            <el-table-column
                              label="高于目标范围"
                              align="center"
                            >
                              <el-table-column
                                prop="highRate"
                                label="%"
                                width="70"
                                align="center"
                              />
                              <el-table-column
                                prop="highCount"
                                label="次数"
                                width="60"
                                align="center"
                              />
                            </el-table-column>
                            <el-table-column
                              label="低于目标范围"
                              align="center"
                            >
                              <el-table-column
                                prop="lowRate"
                                label="%"
                                width="70"
                                align="center"
                              />
                              <el-table-column
                                prop="lowCount"
                                label="次数"
                                width="60"
                                align="center"
                              />
                            </el-table-column>

                            <el-table-column
                              label="目标范围"
                              width="130"
                              align="center"
                            >
                              <template slot-scope="scope">{{ scope.row.rangeMin }}~
                                {{ scope.row.rangeMax }}&nbsp;mmol/L</template>
                            </el-table-column>
                          </el-table>
                        </div>
                        <div
                          style="display:none"
                          class="print-footer"
                        >
                          审核人:________________
                        </div>
                      </div>
                    </el-card>
                  </el-tab-pane>
                  <el-tab-pane
                    label="血糖趋势图"
                    name="trend"
                  >
                    <el-form
                      v-model="secondTab.trend.form"
                      :inline="true"
                      size="small"
                      label-width="80px"
                    >
                      <el-form-item label="日期:">
                        <el-date-picker
                          v-model="secondTab.trend.form.searchDate"
                          type="date"
                          placeholder="选择日期"
                          :clearable="false"
                        />
                      </el-form-item>
                      <el-form-item label="检测时段:">
                        <el-select
                          v-model="secondTab.trend.form.period"
                          style="width:200px"
                          clearable
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
                      <el-form-item>
                        <el-button
                          type="primary"
                          @click="handleSecondTabTrendQuery"
                        >查询</el-button>
                      </el-form-item>
                      <el-form-item>
                        <el-button
                          type="primary"
                          @click="bgluTrendHandle"
                        >打印</el-button>
                      </el-form-item>
                    </el-form>

                    <el-row>
                      <el-col>
                        <div
                          id="scondTabTrendPrintContent"
                          style="margin:auto;width:1024px"
                        >
                          <div
                            id="printHeadArea"
                            style="padding:20px;display:none"
                            class="print"
                          >

                            <el-row>
                              <el-col :span="6">&nbsp;</el-col>
                              <el-col :span="12">
                                <div style="text-align:center;font-size:16pt">
                                  <div>{{ organizationName }}</div>
                                  <div style="margin:5px">患者血糖趋势图</div>
                                </div>
                              </el-col>
                              <el-col :span="6">&nbsp;</el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="4">姓名:{{ patient.patientName }}</el-col>
                              <el-col :span="4">性别:{{ patient.genderDisplay }}</el-col>
                              <el-col :span="4">年龄:{{ patient.age }}</el-col>
                              <el-col :span="4">科室:{{ patient.departmentName }}</el-col>
                              <el-col :span="4">床号:{{ patient.bed }}</el-col>
                              <el-col :span="4">住院号:{{ patient.hospitalizedNum }}</el-col>
                            </el-row>
                          </div>
                          <div style="padding:10px">
                            <el-card>
                              <div slot="header">
                                <span>个人血糖趋势图-3天</span>
                              </div>
                              <div>
                                <div
                                  ref="chartTrend3"
                                  style="width:100%;height:300px"
                                />
                              </div>
                            </el-card>
                          </div>
                          <div style="padding:10px">
                            <el-card>
                              <div slot="header">
                                <span>个人血糖趋势图-7天</span>
                              </div>
                              <div>
                                <div
                                  ref="chartTrend7"
                                  style="width:100%;height:300px"
                                />
                              </div>
                            </el-card>
                          </div>
                          <div style="padding:10px">
                            <el-card>
                              <div slot="header">
                                <span>个人血糖趋势图-14天</span>
                              </div>
                              <div>
                                <div
                                  ref="chartTrend14"
                                  style="width:100%;height:300px"
                                />
                              </div>
                            </el-card>
                          </div>
                          <div
                            style="display:none"
                            class="print-footer"
                          >
                            审核人:________________
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </el-tab-pane>
                  <el-tab-pane
                    label="血糖图谱"
                    name="graph"
                  >
                    <el-card>
                      <div>
                        <el-form
                          v-model="secondTab.graph.form"
                          :inline="true"
                          size="small"
                          label-width="80px"
                        >
                          <el-form-item label="日期:">
                            <el-date-picker
                              v-model="secondTab.graph.form.searchDate"
                              type="date"
                              :disabled="secondTab.graph.form.days===0"
                              placeholder="选择日期"
                              :clearable="false"
                            />
                          </el-form-item>
                          <el-form-item label="范围:">
                            <el-select
                              v-model="secondTab.graph.form.days"
                              placeholder="请选择范围"
                            >
                              <el-option
                                v-for="item in secondTab.graph.form.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-form-item>
                          <el-form-item>
                            <el-button
                              type="primary"
                              @click="secondTabGraphQuery"
                            >查询</el-button>
                          </el-form-item>
                          <el-form-item>
                            <el-button
                              type="primary"
                              @click="bgluAtlasHandle"
                            >打印</el-button>
                          </el-form-item>
                        </el-form>
                      </div>
                      <div
                        id="scondTabGrapPrintContent"
                        style="margin:auto;width:1024px"
                      >
                        <div
                          id="printHeadArea"
                          style="padding:20px;display:none"
                          class="print"
                        >

                          <el-row>
                            <el-col :span="6">&nbsp;</el-col>
                            <el-col :span="12">
                              <div style="text-align:center;font-size:16pt">
                                <div>{{ organizationName }}</div>
                                <div style="margin:5px">患者血糖图谱</div>
                              </div>
                            </el-col>
                            <el-col :span="6">&nbsp;</el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="4">姓名:{{ patient.patientName }}</el-col>
                            <el-col :span="4">性别:{{ patient.genderDisplay }}</el-col>
                            <el-col :span="4">年龄:{{ patient.age }}</el-col>
                            <el-col :span="4">科室:{{ patient.departmentName }}</el-col>
                            <el-col :span="4">床号:{{ patient.bed }}</el-col>
                            <el-col :span="4">住院号:{{ patient.hospitalizedNum }}</el-col>
                          </el-row>
                        </div>
                        <el-card>
                          <div
                            slot="header"
                            style="text-align:center"
                          >
                            <span style="padding:10px;font-size:16px">标准24小时图谱（{{ secondTab.graph.form.beginDate }}~{{ secondTab.graph.form.endDate }}）</span>
                          </div>
                          <div style="margin:atuo">
                            <div
                              ref="chartGraph"
                              style="width:1020px;height:500px"
                            />
                          </div>
                        </el-card>
                        <div
                          style="display:none"
                          class="print-footer"
                        >
                          审核人:________________
                        </div>
                      </div>
                    </el-card>
                  </el-tab-pane>
                  <el-tab-pane
                    label="血糖波动"
                    name="varGlu"
                  >
                    <div>
                      <el-form
                        v-model="secondTab.varGlu.form"
                        :inline="true"
                        size="small"
                        label-width="80px"
                      >
                        <el-form-item label="日期:">
                          <el-date-picker
                            v-model="secondTab.varGlu.form.searchDate"
                            type="date"
                            placeholder="选择日期"
                            :disabled="secondTab.varGlu.form.days===0"
                            :clearable="false"
                          />
                        </el-form-item>
                        <el-form-item label="范围:">
                          <el-select
                            v-model="secondTab.varGlu.form.days"
                            placeholder="请选择范围"
                          >
                            <el-option
                              v-for="item in secondTab.varGlu.form.options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </el-form-item>
                        <el-form-item>
                          <el-button
                            type="primary"
                            @click="secondTabVarGLUQuery"
                          >查询</el-button>
                        </el-form-item>
                        <el-form-item>
                          <el-button
                            type="primary"
                            @click="bgluFluctuationHandle"
                          >打印</el-button>
                        </el-form-item>
                      </el-form>
                    </div>

                    <el-row>
                      <el-col>
                        <div
                          id="scondTabVarGLUPrintContent"
                          style="margin:auto;width:1024px"
                        >
                          <div
                            id="printHeadArea"
                            style="padding:20px;display:none"
                            class="print"
                          >

                            <el-row>
                              <el-col :span="6">&nbsp;</el-col>
                              <el-col :span="12">
                                <div style="text-align:center;font-size:16pt">
                                  <div>{{ organizationName }}</div>
                                  <div style="margin:5px">患者血糖波动图</div>
                                </div>
                              </el-col>
                              <el-col :span="6">&nbsp;</el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="4">姓名:{{ patient.patientName }}</el-col>
                              <el-col :span="4">性别:{{ patient.genderDisplay }}</el-col>
                              <el-col :span="4">年龄:{{ patient.age }}</el-col>
                              <el-col :span="4">科室:{{ patient.departmentName }}</el-col>
                              <el-col :span="4">床号:{{ patient.bed }}</el-col>
                              <el-col :span="4">住院号:{{ patient.hospitalizedNum }}</el-col>
                            </el-row>
                          </div>
                          <div style="padding:10px">
                            <el-card>
                              <div slot="header">
                                <span>个人血糖波动 - PPGE({{ secondTab.varGlu.form.beginDate }}~{{ secondTab.varGlu.form.endDate }})</span>
                              </div>
                              <div>
                                <div
                                  ref="chartPPGE"
                                  style="width:100%;height:300px"
                                />
                                <div style="margin-left:20px;font-size:9pt">
                                  注：PPGE（餐后血糖波动幅度）为三餐后2h血糖与其相应餐前血糖差值绝对值的平均值，正常参考值为&lt;2.2mmol/L
                                </div>
                              </div>
                            </el-card>
                          </div>
                          <div style="margin:10px">
                            <el-card>
                              <div slot="header">
                                <span>个人血糖波动 - LAGE({{ secondTab.varGlu.form.beginDate }}~{{ secondTab.varGlu.form.endDate }})</span>
                              </div>
                              <div>
                                <div
                                  ref="chartLAGE"
                                  style="width:100%;height:300px"
                                />
                              </div>
                              <div style="margin-left:30px;font-size:9pt">
                                注：LAGE为日内最大和最小血糖值之差，正常参考值为&lt;4.4mmol/L
                              </div>
                            </el-card>
                          </div>
                          <div style="margin:10px">
                            <el-card>
                              <div slot="header">
                                <span>个人血糖波动 - SDBG({{ secondTab.varGlu.form.beginDate }}~{{ secondTab.varGlu.form.endDate }})</span>
                              </div>
                              <div>
                                <div
                                  ref="chartSDBG"
                                  style="width:100%;height:300px"
                                />
                              </div>
                              <div style="margin-left:30px;font-size:9pt">
                                注：SDBG为1日内多点血糖的标准差，正常参考值为&lt;2.0mmol/L
                              </div>
                            </el-card>
                            <div
                              style="display:none"
                              class="print-footer"
                            >
                              审核人:________________
                            </div>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </el-tab-pane>
                  <el-tab-pane
                    label="达标范围"
                    name="range"
                  >
                    <div style="width:1024px;">
                      <el-form
                        :mode="secondTab.range.form"
                        :inline="true"
                        label-width="100px"
                        size="small"
                      >
                        <el-col
                          v-for="item in ranges"
                          :key="item.period"
                          :span="10"
                        >
                          <el-form-item :label="item.periodName">
                            <el-col :span="10">
                              <el-input-number
                                v-model="item.minValue"
                                style="width:100px"
                                :min="0.0"
                                :precision="1"
                                :controls="false"
                                :disabled="isOutpatient"
                              />
                            </el-col>
                            <el-col :span="2">
                              &nbsp;&nbsp;-
                            </el-col>
                            <el-col :span="10">
                              <!-- <el-input
                                v-model="item.maxValue"
                                style="width:100px"
                                :disabled="isOutpatient"
                              /> -->
                              <el-input-number
                                v-model="item.maxValue"
                                style="width:100px"
                                :min="0.0"
                                :precision="1"
                                :controls="false"
                                :disabled="isOutpatient"
                              />
                            </el-col>
                            <el-col :span="2">
                              &nbsp;mmol/L
                            </el-col>
                          </el-form-item>
                        </el-col>
                      </el-form>
                      <div style="clear:both;margin:20px;padding-left:100px">
                        <el-button
                          v-if="!isOutpatient"
                          v-loading="secondTab.range.loading"
                          type="primary"
                          size="small"
                          @click="secodeTabRangeSave"
                        >保存</el-button>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane
          label="血酮"
          name="ket"
        >
          <el-tabs
            v-model="ket.ketActiveName"
            @tab-click="ketTabHandleClick"
          >
            <el-tab-pane
              label="血酮记录"
              name="ketData"
            >
              <el-card>
                <div slot="header">
                  <el-form
                    :inline="true"
                    :model="ket.form"
                    size="small"
                    label-width="80px"
                  >
                    <el-form-item
                      prop="beginDate"
                      label="开始日期:"
                    >
                      <el-date-picker
                        v-model="ket.ketData.form.beginDate"
                        type="date"
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
                        v-model="ket.ketData.form.endDate"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        @click="ketDataQuery"
                      >查询</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        v-loading="ket.ketData.buttonLoading"
                        type="primary"
                        @click="vueKetPrint"
                      >打印</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        v-if="!isOutpatient"
                        type="primary"
                        size="small"
                        @click="handleNewKetData"
                      >新增血酮</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div style="width:1024px;margin:auto">
                  <div
                    id="ketPrintContent"
                    style="width:1024px;margin:auto"
                  >
                    <el-table
                      :data="ket.ketData.tableData"
                      border
                      style="width: 900px"
                      :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
                    >
                      <el-table-column
                        prop="testTime"
                        label="检测日期"
                        align="center"
                      />
                      <el-table-column
                        label="血酮值"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span :class="scope.row.determineType">
                            {{ scope.row.testValue }} &nbsp;<span v-if="scope.row.determineType==='High'">↑</span>
                            <span v-if="scope.row.determineType==='Low'">↓</span>
                          </span>
                        </template>
                      </el-table-column>
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
                    </el-table>
                  </div>
                </div>
                <div style="float:right;margin:10px;pading-right:20px">
                  <el-pagination
                    :hide-on-single-page="false"
                    :page-sizes="[10, 20, 30, 50]"
                    :current-page.sync="ket.ketData.form.page"
                    :page-size="ket.ketData.form.size"
                    layout="total,sizes,prev,pager, next"
                    :total="ket.ketData.total"
                    @size-change="ketDataTabHandleSizeChange"
                    @current-change="ketDataTabHandleCurrentChange"
                  />
                </div>
              </el-card>
            </el-tab-pane>
            <el-tab-pane
              label="趋势图"
              name="ketTrend"
            >
              <el-card>
                <div
                  slot="header"
                  class="clearfix"
                >
                  <el-form
                    v-model="ket.ketTrend.form"
                    :inline="true"
                    size="small"
                  >

                    <el-form-item label="开始日期:">
                      <el-date-picker
                        v-model="ket.ketTrend.form.beginDate"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                      />
                    </el-form-item>
                    <el-form-item label="结束日期:">
                      <el-date-picker
                        v-model="ket.ketTrend.form.endDate"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                      />
                    </el-form-item>

                    <el-form-item>
                      <el-button
                        type="primary"
                        @click="ketTrendQuery"
                      >查询</el-button>
                      <el-button
                        type="primary"
                        @click="gluKetTrendHandle"
                      >打印</el-button>
                    </el-form-item>

                  </el-form>
                </div>
                <div
                  id="ketTrendprintContent"
                  style="margin:auto;width:1024px"
                >
                  <div
                    id="printHeadArea"
                    style="padding:20px;display:none"
                    class="print"
                  >

                    <el-row>
                      <el-col :span="6">&nbsp;</el-col>
                      <el-col :span="12">
                        <div style="text-align:center;font-size:16pt">
                          <div>{{ organizationName }}</div>
                          <div style="margin:5px">患者血酮趋势图</div>
                        </div>
                      </el-col>
                      <el-col :span="6">&nbsp;</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">姓名:{{ patient.patientName }}</el-col>
                      <el-col :span="4">性别:{{ patient.genderDisplay }}</el-col>
                      <el-col :span="4">年龄:{{ patient.age }}</el-col>
                      <el-col :span="4">科室:{{ patient.departmentName }}</el-col>
                      <el-col :span="4">床号:{{ patient.bed }}</el-col>
                      <el-col :span="4">住院号:{{ patient.hospitalizedNum }}</el-col>
                    </el-row>
                  </div>

                  <div style="padding:10px">
                    <el-card>
                      <div slot="header">
                        <span>个人血酮趋势图</span>
                      </div>
                      <div>
                        <div
                          ref="ketChart"
                          style="width:100%;height:500px"
                        />
                      </div>
                    </el-card>
                    <div
                      style="display:none"
                      class="print-footer"
                    >
                      审核人:________________
                    </div>
                  </div>

                </div>
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane
          label="尿酸"
          name="ua"
        >
          <el-tabs
            v-model="ua.uaActiveName"
            @tab-click="uaTabHandleClick"
          >
            <el-tab-pane
              label="尿酸记录"
              name="uaData"
            >
              <el-card>
                <div slot="header">
                  <el-form
                    :inline="true"
                    :model="ua.uaData.form"
                    size="small"
                    label-width="80px"
                  >
                    <el-form-item
                      prop="beginDate"
                      label="开始日期:"
                    >
                      <el-date-picker
                        v-model="ua.uaData.form.beginDate"
                        type="date"
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
                        v-model="ua.uaData.form.endDate"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                      />
                    </el-form-item>

                    <el-form-item>
                      <el-button
                        type="primary"
                        @click="uaDataQuery"
                      >查询</el-button>

                    </el-form-item>
                    <el-form-item>
                      <el-button
                        v-loading="ua.uaData.buttonLoading"
                        type="primary"
                        @click="vueUaPrint"
                      >打印</el-button>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        v-if="!isOutpatient"
                        type="primary"
                        size="small"
                        @click="handleNewUaData"
                      >新增尿酸</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div style="width:1024px;margin:auto">
                  <div id="uaPrintContent">
                    <el-table
                      :data="ua.uaData.tableData"
                      border
                      style="width: 100%"
                      :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
                    >
                      <el-table-column
                        prop="testTime"
                        label="检测日期"
                        align="center"
                      />
                      <el-table-column
                        label="尿酸值"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <span :class="scope.row.determineType">
                            {{ scope.row.testValue }}&nbsp;<span v-if="scope.row.determineType==='High'">↑</span>
                            <span v-if="scope.row.determineType==='Low'">↓</span>
                          </span>
                        </template>
                      </el-table-column>
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
                    </el-table>
                  </div>
                </div>
                <div style="float:right;margin:10px;pading-right:20px">
                  <el-pagination
                    :hide-on-single-page="false"
                    :page-sizes="[10, 20, 30, 50]"
                    :current-page.sync="ua.uaData.form.page"
                    :page-size="ua.uaData.form.size"
                    layout="total,sizes,prev,pager, next"
                    :total="ua.uaData.total"
                    @size-change="uaDataTabHandleSizeChange"
                    @current-change="uaDataTabHandleCurrentChange"
                  />
                </div>
              </el-card>
            </el-tab-pane>
            <el-tab-pane
              label="趋势图"
              name="uaTrend"
            >
              <el-card>
                <div
                  slot="header"
                  class="clearfix"
                >
                  <el-form
                    v-model="ua.uaTrend.form"
                    :inline="true"
                    size="small"
                  >
                    <el-form-item label="开始日期:">
                      <el-date-picker
                        v-model="ua.uaTrend.form.beginDate"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                      />
                    </el-form-item>
                    <el-form-item label="结束日期:">
                      <el-date-picker
                        v-model="ua.uaTrend.form.endDate"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                      />
                    </el-form-item>

                    <el-form-item>
                      <el-button
                        type="primary"
                        @click="uaTrendQuery"
                      >查询</el-button>
                      <el-button
                        type="primary"
                        @click="uaTrendPrintHandle"
                      >打印</el-button>
                    </el-form-item>

                  </el-form>
                </div>
                <div
                  id="uaTrendPrintContent"
                  style="margin:auto;width:1024px"
                >
                  <div
                    id="printHeadArea"
                    style="padding:10px;display:none"
                    class="print"
                  >
                    <el-row>
                      <el-col :span="6">&nbsp;</el-col>
                      <el-col :span="12">
                        <div style="text-align:center;font-size:16pt">
                          <div>{{ organizationName }}</div>
                          <div style="margin:5px">患者尿酸趋势图</div>
                        </div>
                      </el-col>
                      <el-col :span="6">&nbsp;</el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">姓名:{{ patient.patientName }}</el-col>
                      <el-col :span="4">性别:{{ patient.genderDisplay }}</el-col>
                      <el-col :span="4">年龄:{{ patient.age }}</el-col>
                      <el-col :span="4">科室:{{ patient.departmentName }}</el-col>
                      <el-col :span="4">床号:{{ patient.bed }}</el-col>
                      <el-col :span="4">住院号:{{ patient.hospitalizedNum }}</el-col>
                    </el-row>
                  </div>
                  <div style="padding:10px">
                    <el-card>
                      <div slot="header">
                        <span>个人尿酸势图</span>
                      </div>
                      <div>
                        <div
                          ref="uaChart"
                          style="width:100%;height:500px"
                        />
                      </div>
                    </el-card>
                    <div
                      style="display:none"
                      class="print-footer"
                    >
                      审核人:________________
                    </div>
                  </div>
                </div>
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane
          label="测量医嘱"
          name="third"
        >
          <el-card>
            <div slot="header">
              <el-form
                :inline="true"
                size="small"
                :v-model="thirdTab.form"
              >
                <el-form-item label="医嘱分类:">
                  <el-select
                    v-model="thirdTab.form.category"
                    placeholder="请选择"
                    autocomplete
                    clearable
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
                <el-form-item label="医嘱名称:">
                  <el-input
                    v-model="thirdTab.form.adviceName"
                    place-holder="请输入医嘱的名称"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="thirdTabQuery"
                  >查询</el-button>
                  <el-button
                    v-if="!isOutpatient"
                    type="primary"
                    size="small"
                    @click="thirdTabHandleNew"
                  >新增医嘱</el-button>
                  <el-button
                    v-loading="thirdTab.buttonLoading"
                    type="primary"
                    @click="vueThirdPrint"
                  >打印</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <div
                id="advicePrintContent"
                class="print-content"
              >
                <div style="margin:auto;">
                  <el-table
                    v-loading="thirdTab.loading"
                    :data="thirdTab.tableData"
                    style="width:100%"
                    border
                    stripe
                    highlight-current-row
                    :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
                  >
                    <el-table-column
                      label="序号"
                      type="index"
                      width="80"
                      align="center"
                    />
                    <el-table-column
                      prop="name"
                      label="医嘱名称"
                      width="140"
                      align="center"
                    />
                    <el-table-column
                      prop="categoryDisplay"
                      label="医嘱分类"
                      width="120"
                      align="center"
                    />
                    <el-table-column
                      prop="adviceTypeDisplay"
                      label="医嘱类别"
                      width="120"
                      align="center"
                    />
                    <el-table-column
                      prop="beginDate"
                      label="开始日期"
                      width="160"
                      align="center"
                    />
                    <el-table-column
                      prop="endDate"
                      label="结束日期"
                      width="160"
                      align="center"
                    />
                    <el-table-column
                      label="医嘱明细"
                      width="200"
                      prop="enabled"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <div>
                          <el-tag
                            v-for="(item,index) in scope.row.contents"
                            :key="index"
                          >
                            <span
                              v-if="item.name !== undefined"
                              style="margin-left:3px"
                            >{{ item.name }}</span>
                            <span
                              v-else
                              style="margin-left:3px"
                            >{{ item.time }}</span>
                          </el-tag>
                        </div>

                      </template>
                    </el-table-column>
                    <el-table-column
                      label="状态"
                      width="120"
                      prop="enabled"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <div v-if="scope.row.status">使用中</div>
                        <div v-else>已停止</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="remark"
                      label="备注"
                      width="100"
                      align="center"
                    />

                    <el-table-column
                      label="操作"
                      align="center"
                      class="nonePrint"
                    >
                      <template slot-scope="scope">
                        <!-- <el-button
                          v-if="scope.row.status"
                          type="text"
                          @click="thirdHandleViewAdvice(scope.row)"
                        >查看</el-button> -->
                        <el-button
                          v-if="scope.row.status"
                          type="text"
                          @click="thirdHandleStopAdvice(scope.row)"
                        >停止</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div style="clear:both;right:15px;float:right">
                <el-pagination
                  :page-sizes="[10, 20, 30, 50]"
                  layout="total, sizes, prev, pager, next"
                  :total="thirdTab.total"
                  :page-size.sync="thirdTab.form.size"
                  @size-change="thirdTabHandleSizeChange"
                  @current-change="thirdTabHandleCurrentChange"
                />
              </div>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane
          v-if="checkPermission(['tenant_admin', 'doctor', 'nurse'])"
          label="用药医嘱"
          name="drug"
        >
          <el-card>
            <div slot="header">
              <el-form
                :inline="true"
                size="small"
                :v-model="drug.form"
              >
                <el-form-item label="医嘱名称:">
                  <el-input
                    v-model="drug.form.adviceName"
                    place-holder="请输入医嘱的名称"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    v-loading="drug.loading"
                    type="primary"
                    @click="drugOnSearch"
                  >查询</el-button>
                  <el-button
                    v-if="!isOutpatient"
                    type="primary"
                    size="small"
                    @click="durgHandleNew"
                  >新增用药医嘱</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <div
                id="advicePrintContent"
                class="print-content"
              >
                <div style="margin:auto;">
                  <el-table
                    v-loading="drug.loading"
                    :data="drug.tableData"
                    style="100%"
                    class="vue-print-table"
                    border
                    stripe
                    highlight-current-row
                    :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
                  >
                    <el-table-column
                      label="序号"
                      type="index"
                      width="80"
                      align="center"
                    />
                    <el-table-column
                      label="医嘱名称"
                      width="120"
                      align="center"
                      prop="status"
                    >
                      <template slot-scope="scope">
                        <el-link
                          v-if="scope.row.status"
                          type="primary"
                          @click="drugHandleView(scope.row)"
                        >{{ scope.row.name }}</el-link>

                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="beginDate"
                      label="开始日期"
                      width="160"
                      align="center"
                    />
                    <el-table-column
                      prop="endDate"
                      label="结束日期"
                      width="160"
                      align="center"
                    />
                    <el-table-column
                      label="状态"
                      width="120"
                      prop="enabled"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <div v-if="scope.row.status">使用中</div>
                        <div v-else>已停止</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="remark"
                      label="备注"
                      align="center"
                    />

                    <el-table-column
                      label="操作"
                      width="120"
                      align="center"
                      prop="status"
                    >
                      <template slot-scope="scope">
                        <el-button
                          v-if="scope.row.status"
                          type="text"
                          @click="drugHandleStop(scope.row)"
                        >停止</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div style="clear:both;right:15px;float:right">
                <el-pagination
                  :page-sizes="[10, 20, 30, 50]"
                  layout="total, sizes, prev, pager, next"
                  :total="drug.form.total"
                  :page-size.sync="drug.form.size"
                  @size-change="drugHandleSizeChange"
                  @current-change="drugHandleCurrentChange"
                />
              </div>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane
          v-if="checkPermission(['tenant_admin', 'doctor', 'nurse'])"
          label="会诊信息"
          name="consultation"
        >
          <el-card>
            <div
              slot="header"
              class="clearfix"
            >
              <el-form
                ref="conditionForm"
                :model="consultation.conditionForm"
                :inline="true"
                size="small"
                label-width="80px"
              >

                <el-form-item
                  prop="isFinished"
                  label="会诊状态:"
                >
                  <el-select
                    v-model="consultation.conditionForm.isFinished"
                    placeholder="请选择会诊状态"
                    class="small-form-item"
                    clearable
                  >
                    <el-option
                      v-for="item in consultation.status"
                      :key="item.key"
                      :label="item.name"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  prop="beginDate"
                  label="开始日期:"
                >
                  <el-date-picker
                    v-model="consultation.conditionForm.beginDate"
                    type="date"
                    class="small-form-item"
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
                    v-model="consultation.conditionForm.endDate"
                    type="date"
                    class="small-form-item"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="onSearchConsultation"
                  >查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <div style="margin: 2px">
                <div style="margin: 10px" />
                <el-table
                  v-loading="consultation.loading"
                  :data="consultation.tableData"
                  style="width: 100%"
                  stripe
                  border
                  highlight-current-row
                  :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
                >

                  <el-table-column
                    prop="requestDepartmentName"
                    label="申请科室"
                    align="center"
                  />
                  <el-table-column
                    prop="requestDoctorName"
                    label="申请医生"
                    align="center"
                  />
                  <el-table-column
                    prop="requestTime"
                    label="申请时间"
                    align="center"
                  />
                  <el-table-column
                    prop="consultationDepartmentName"
                    label="会诊科室"
                    align="center"
                  />
                  <el-table-column
                    prop="consultationDoctorName"
                    label="会诊医生"
                    align="center"
                  />
                  <el-table-column
                    prop="department"
                    label="会诊状态"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.isClosed">结束</span>
                      <span v-else>会诊中</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    align="center"
                    label="操作"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        @click="handleConsultation(scope.row)"
                      >会诊</el-button>

                    </template>

                    <template />
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div style="margin: 5px; float: right">
              <el-pagination
                :page-sizes="[10, 20, 30, 50]"
                layout="total, sizes, prev, pager, next"
                :total="consultation.conditionForm.total"
                :page-size.sync="consultation.conditionForm.size"
                @size-change="consultationHandleSizeChange"
                @current-change="consultationHandleCurrentChange"
              />
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <!-- 更多血糖记录数据弹窗 -->
      <el-dialog
        :close-on-click-modal="false"
        title="随机血糖"
        border
        :visible.sync="firstTab.dialogVisibleMore"
        width="700px"
      >
        <el-card>
          <div>
            <span style="color:'#303843';line-weight:13px;font-size:13px;padding:8px">（血糖值单位：mmol/L）</span>
            <el-table
              :data="firstTab.moreTableData"
              style="width:100%"
              border
              stripe
              highlight-current-row
              :show-header="false"
            >
              <el-table-column v-for="(item, index) in firstTab.moreTableData[0]" :key="index" align="center">
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
        :close-on-click-modal="false"
        title="新增血糖记录"
        :visible.sync="firstTab.dialogVisible"
        width="700px"
        @close="closedFirstTablDialog"
      >
        <el-card>
          <div style="margin:20px">
            <el-form
              ref="firstTabResultForm"
              :rules="firstTab.resultFormRules"
              :model="firstTab.resultForm"
              size="small"
              label-width="120px"
            >
              <el-form-item label="姓名:">
                {{ firstTab.resultForm.patientName }}
              </el-form-item>
              <el-form-item
                label="检测日期:"
                prop="testTime"
              >
                <el-date-picker
                  v-model="firstTab.resultForm.testTime"
                  style="width:410px"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期日期"
                />
              </el-form-item>
              <el-form-item
                label="检测时段:"
                prop="period"
              >
                <el-select
                  v-model="firstTab.resultForm.period"
                  style="width:410px"
                  placeholder="请选择检测时段"
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
                  <el-radio-group v-model="firstTab.resultForm.unenforced">
                    <el-radio :label="false">新增血糖值</el-radio>
                    <el-radio :label="true">未测原因</el-radio>
                  </el-radio-group>
                  <el-card>
                    <div v-if="!firstTab.resultForm.unenforced">
                      <el-radio-group
                        v-model="firstTab.resultForm.selType"
                        style="width:100%"
                      >
                        <el-row>
                          <el-col :span="8">
                            <el-radio :label="true">可测范围</el-radio>
                          </el-col>
                          <el-col :span="8">
                            <div v-if="firstTab.resultForm.selType">
                              <el-input-number
                                v-model="firstTab.resultForm.normalValue"
                                :min="0.6"
                                :max="33.3"
                                :precision="1"
                                :step="1"
                                label="0.6~33.3"
                                @change="firstTabInputChanged"
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
                            <div v-if="!firstTab.resultForm.selType">
                              <el-select
                                v-model="firstTab.resultForm.textValue"
                                placeholder="请选择范围"
                                autocomplete
                                @change="firstTabSelResultChanged"
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
                          v-model="firstTab.resultForm.rejectReason"
                          style="width:200px"
                          placeholder="请选择拒绝原因"
                          autocomplete
                          @change="firstTabSelRejectChanged"
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
                        v-if="firstTab.resultForm.rejectReason==='Other'"
                        style="padding:10px"
                      >
                        <el-input
                          v-model="firstTab.resultForm.cause"
                          style="width:200px"
                          :rows="2"
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
                    v-model="firstTab.resultForm.remark"
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
          <el-button
            @click="firstTab.dialogVisible = false"
          >取 消</el-button>
          <el-button
            type="primary"
            :loading="firstTab.addHandle"
            @click="firstTabHandleUpdateData"
          >确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        title="新增血酮记录"
        :visible.sync="ket.ketData.dialogVisible"
        width="700px"
        @close="closedKetDialog"
      >
        <el-card>
          <div style="margin:20px">
            <el-form
              ref="ketDataResultForm"
              :model="ket.ketData.resultForm"
              :rules="ket.ketData.resultFormRules"
              size="small"
              label-width="120px"
            >
              <el-form-item label="姓名:">
                {{ ket.ketData.resultForm.patientName }}
              </el-form-item>
              <el-form-item
                label="检测日期:"
                prop="testTime"
              >
                <el-date-picker
                  v-model="ket.ketData.resultForm.testTime"
                  style="width:410px"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期日期"
                />
              </el-form-item>

              <el-form-item
                label="检测结果:"
                prop="result"
              >
                <div style="width:410px">
                  <el-radio-group v-model="ket.ketData.resultForm.unenforced">
                    <el-radio :label="false">新增血酮值</el-radio>
                    <el-radio :label="true">未测原因</el-radio>
                  </el-radio-group>
                  <el-card>
                    <div v-if="!ket.ketData.resultForm.unenforced">
                      <el-radio-group
                        v-model="ket.ketData.resultForm.selType"
                        style="width:100%"
                      >

                        <el-row>
                          <el-col :span="8">

                            <el-radio :label="true">可测范围</el-radio>

                          </el-col>
                          <el-col :span="8">
                            <div v-if="ket.ketData.resultForm.selType">
                              <el-input-number
                                v-model="ket.ketData.resultForm.normalValue"
                                :min="0"
                                :max="8"
                                :precision="1"
                                :step="1"
                                @change="ketDataTabInputChanged"
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
                            <div v-if="!ket.ketData.resultForm.selType">
                              <el-select
                                v-model="ket.ketData.resultForm.textValue"
                                placeholder="请选择范围"
                                autocomplete
                                @change="ketDataSelResultChanged"
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
                          v-model="ket.ketData.resultForm.rejectReason"
                          style="width:200px"
                          placeholder="请选择拒绝原因"
                          autocomplete
                          @change="ketDataTabSelRejectChanged"
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
                        v-if="ket.ketData.resultForm.rejectReason==='Other'"
                        style="padding:10px"
                      >
                        <el-input
                          v-model="ket.ketData.resultForm.cause"
                          style="width:200px"
                          :rows="2"
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
                    v-model="ket.ketData.resultForm.remark"
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
          <el-button @click="ket.ketData.dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="ketDataTabHandleUpdateData"
          >确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        title="新增尿酸记录"
        :visible.sync="ua.uaData.dialogVisible"
        width="700px"
        @close="closedUaDialog"
      >
        <el-card>
          <div style="margin:20px">
            <el-form
              ref="uaDataResultForm"
              :model="ua.uaData.resultForm"
              :rules="ua.uaData.resultFormRules"
              size="small"
              label-width="120px"
            >
              <el-form-item label="姓名:">
                {{ ua.uaData.resultForm.patientName }}
              </el-form-item>
              <el-form-item
                label="检测日期:"
                prop="testTime"
              >
                <el-date-picker
                  v-model="ua.uaData.resultForm.testTime"
                  style="width:410px"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期日期"
                />
              </el-form-item>

              <el-form-item
                label="检测结果:"
                prop="result"
              >
                <div style="width:410px">
                  <el-radio-group v-model="ua.uaData.resultForm.unenforced">
                    <el-radio :label="false">新增尿酸值</el-radio>
                    <el-radio :label="true">未测原因</el-radio>
                  </el-radio-group>
                  <el-card>
                    <div v-if="!ua.uaData.resultForm.unenforced">
                      <el-radio-group
                        v-model="ua.uaData.resultForm.selType"
                        style="width:100%"
                      >
                        <el-row>
                          <el-col :span="8">
                            <el-radio :label="true">可测范围</el-radio>
                          </el-col>
                          <el-col :span="8">
                            <div v-if="ua.uaData.resultForm.selType">
                              <el-input-number
                                v-model="ua.uaData.resultForm.normalValue"
                                :min="179"
                                :max="1189"
                                :precision="0"
                                :step="1"
                                @change="uaDataTabInputChanged"
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
                            <div v-if="!ua.uaData.resultForm.selType">
                              <el-select
                                v-model="ua.uaData.resultForm.textValue"
                                placeholder="请选择范围"
                                autocomplete
                                @change="uaDataSelResultChanged"
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
                          v-model="ua.uaData.resultForm.rejectReason"
                          style="width:200px"
                          placeholder="请选择拒绝原因"
                          autocomplete
                          @change="uaDataTabSelRejectChanged"
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
                        v-if="ua.uaData.resultForm.rejectReason==='Other'"
                        style="padding:10px"
                      >
                        <el-input
                          v-model="ua.uaData.resultForm.cause"
                          style="width:200px"
                          :rows="2"
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
                    v-model="ua.uaData.resultForm.remark"
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
          <el-button @click="ua.uaData.dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="uaDataTabHandleUpdateData"
          >确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        title="检验医嘱信息"
        :visible.sync="thirdTab.dialogVisible"
        width="700px"
        @close="closedThirdTabDialog"
      >
        <div slot="title">医嘱信息</div>
        <div style="padding:5px">
          <el-form
            ref="dialogForm"
            :model="thirdTab.dialogForm"
            :rules="thirdTab.dialogFormRules"
            label-width="120px"
          >
            <el-form-item
              label="医嘱名称:"
              prop="name"
            >
              <el-input
                v-model="thirdTab.dialogForm.name"
                class="form-item"
                :disabled="thirdTab.dialogForm.isView"
              />
            </el-form-item>

            <el-form-item label="医嘱分类">
              <el-select
                v-model="thirdTab.dialogForm.category"
                placeholder="请选择医嘱分类"
                class="form-item"
                autocomplete
                :disabled="thirdTab.dialogForm.isView"
                @change="thirdTabDialogTestSelecteChanged"
              >
                <el-option
                  v-for="item in testOptions"
                  :key="item.name"
                  :label="item.displayName"
                  :value="item.name"
                />
              </el-select>

            </el-form-item>
            <el-form-item label="医嘱类型">
              <el-select
                v-model="thirdTab.dialogForm.adviceType"
                placeholder="请选择医嘱类型"
                class="form-item"
                autocomplete
                :disabled="thirdTab.dialogForm.category!=='GLU'"
                @change="thirdTabDialogSelecteChanged"
              >
                <el-option
                  v-for="item in adviceTemplateTypeOptions"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>

            </el-form-item>
            <el-form-item
              v-show="thirdTab.dialogForm.adviceType==='LongStandards'"
              label="是否自定义"
            >
              <el-checkbox
                v-model="thirdTab.dialogForm.isCustomer"
                :disabled="thirdTab.dialogForm.isView"
                @change="thirdTabDialogCheckChanged"
              >自定义模板</el-checkbox>
            </el-form-item>
            <el-form-item
              v-show="thirdTab.dialogForm.adviceType!=='Temporary'"
              label="医嘱模板:"
              prop="templateId"
            >
              <el-select
                v-model="thirdTab.dialogForm.adviceTemplate"
                value-key="id"
                class="form-item"
                :disabled="thirdTab.dialogForm.isCustomer"
                @change="thirdTabDialogTemplateChanged"
              >
                <el-option
                  v-for="item in adviceTemplateListOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                />
              </el-select>

            </el-form-item>

            <el-form-item
              v-show="thirdTab.dialogForm.adviceType==='LongStandards'"
              label="医嘱内容:"
              prop="contents"
            >
              <el-checkbox-group v-model="thirdTab.dialogForm.contents">
                <el-checkbox
                  v-for="item in adviceTemplatePeriodOptions"
                  :key="item.code"
                  :label="item.code"
                  :disabled="!thirdTab.dialogForm.isCustomer"
                >{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item
              v-show="thirdTab.dialogForm.adviceType==='Temporary'"
              label="医嘱内容:"
              prop="tmpContents"
            >

              <el-row>
                <el-col>
                  <div
                    v-for="item in thirdTab.dialogForm.tmpContents"
                    :key="item.key"
                  >

                    <el-time-picker
                      v-model="item.data"
                      value-format="HH:mm"
                      :disabled="thirdTab.dialogForm.isView"
                      format="HH:mm"
                      :picker-options="{
                        start: '00:00',
                        step: '00:01',
                        end: '23:59',
                        minTime: thirdTab.dialogForm.beginDate
                      }"
                    > />
                    </el-time-picker>
                    <el-button
                      icon="el-icon-delete"
                      circle
                      @click="thirdTabDialogRemoveClick(item.key)"
                    />
                  </div>

                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-button
                    icon="el-icon-plus"
                    circle
                    @click="thirdTabDialogPlusClick"
                  />

                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item
              label="开始日期:"
              prop="beginDate"
            >
              <el-date-picker
                v-model="thirdTab.dialogForm.beginDate"
                class="form-item"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="thirdTab.dialogForm.isView"
              />
            </el-form-item>
            <el-form-item
              v-show="thirdTab.dialogForm.adviceType!=='Temporary'"
              label="结束日期:"
              prop="endDate"
            >
              <el-date-picker
                v-model="thirdTab.dialogForm.endDate"
                class="form-item"
                type="date"
                format="yyyy-MM-dd "
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="thirdTab.dialogForm.isView"
              />
            </el-form-item>
            <el-form-item label="备注:">
              <el-input
                v-model="thirdTab.dialogForm.remark"
                class="form-item"
                type="textarea"
                placeholder="请输入内容"
                maxlength="30"
                rows="5"
                show-word-limit
                :disabled="thirdTab.dialogForm.isView"
              />
            </el-form-item>

          </el-form>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="thirdTab.dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="thirdTabDialogHandleSave"
          >确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        title="用药医嘱信息"
        :visible.sync="drug.drugForm.dialogVisible"
        width="800px"
        @close="closedDrugDialog"
      >
        <div slot="title">用药医嘱信息</div>
        <div style="padding:5px">
          <el-form
            ref="dialogDrugForm"
            :model="drug.drugForm"
            :rules="drug.drugFormRule"
            label-width="120px"
          >
            <el-form-item
              label="医嘱名称:"
              prop="name"
            >
              <el-input
                v-model="drug.drugForm.name"
                class="form-item"
                :disabled="drug.drugForm.isView"
              />
            </el-form-item>
            <el-form-item label="医嘱内容:">
              <el-button
                v-if="!drug.drugForm.isView"
                style="float:right"
                icon="el-icon-s-order"
                type="primary"
                size="mini"
                @click="drugHandleNewData"
              >新增用药</el-button>
              <el-table
                :data="drug.drugForm.contents"
                style="width: 100%"
                stripe
                border
              >
                <el-table-column
                  prop="code"
                  label="编码"
                  align="center"
                  width="100"
                  :disabled="drug.drugForm.isView"
                />
                <el-table-column
                  prop="name"
                  align="center"
                  label="名称"
                  :disabled="drug.drugForm.isView"
                />
                <el-table-column
                  align="center"
                  label="时段"
                  width="140"
                >
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.periodCode"
                      value-key="id"
                      size="mini"
                      :disabled="drug.drugForm.isView"
                      @change="selectDrugPeriodHandle"
                    >
                      <el-option
                        v-for="item in drug.periodOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      />
                    </el-select>

                  </template>

                </el-table-column>
                <el-table-column
                  align="center"
                  label="数量"
                  width="160"
                >
                  <template slot-scope="scope">

                    <el-input-number
                      v-model="scope.row.dosage"
                      :min="1"
                      :max="100"
                      size="mini"
                      :disabled="drug.drugForm.isView"
                    />

                  </template>
                </el-table-column>
                <el-table-column
                  prop="unit"
                  align="center"
                  width="60"
                  label="单位"
                />
                <el-table-column
                  align="right"
                  width="60"
                >
                  <template slot-scope="scope">

                    <el-button
                      v-if="!drug.drugForm.isView"
                      size="mini"
                      type="danger"
                      icon="el-icon-delete-solid"
                      @click="dialogDrugHandleDelete(scope.row)"
                    />
                  </template>

                </el-table-column>

              </el-table>
            </el-form-item>

            <el-dialog
              width="50%"
              title="药物列表"
              :visible.sync="drug.drugForm.innerDialogVisible"
              :close-on-click-modal="false"
              append-to-body
            >
              <el-tabs
                v-model="drug.activeName"
                type="border-card"
                @tab-click="drugTabHandleClick"
              >
                <el-tab-pane
                  v-for="category in drug.drugCategories"
                  :key="category.code"
                  :value="category.code"
                  :label="category.name"
                  :name="category.code"
                >
                  <el-form
                    ref="dialogQueryConditionForm"
                    :model="drug.queryConditionForm"
                    size="mini"
                    :inline="true"
                    label-width="80px"
                  >
                    <el-form-item
                      label="关键字:"
                      prop="queryCondition"
                    >
                      <el-input
                        v-model="drug.queryConditionForm.queryCondition"
                        class="small-form-item"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        v-loading="drug.drugTableDataLoading"
                        @click="drugOnSearchByCategory"
                      >查询</el-button>
                    </el-form-item>
                  </el-form>
                  <el-table
                    ref="drugDialogTable"
                    v-loading="drug.drugTableDataLoading"
                    :data="drug.drugTableData"
                    style="width: 100%"
                    stripe
                    border
                    @select-all="drugHandleTableSelectedAll"
                    @selection-change="drugHandleTableSelectChanged"
                  >
                    <el-table-column
                      type="selection"
                      align="center"
                      width="55"
                    />
                    <el-table-column
                      prop="code"
                      label="编码"
                      align="center"
                      width="180"
                    />
                    <el-table-column
                      prop="name"
                      align="center"
                      label="名称"
                    />
                    <el-table-column
                      prop="unit"
                      align="center"
                      width="80"
                      label="单位"
                    />
                  </el-table>
                  <div style="margin:5px;float:right">
                    <el-pagination
                      :page-sizes="[10, 20, 30, 50]"
                      layout="total, sizes, prev, pager, next"
                      :total="drug.queryConditionForm.total"
                      :page-size.sync="drug.queryConditionForm.size"
                      @size-change="drugTableHandleSize"
                      @current-change="drugTableHandlePage"
                    />
                  </div>
                </el-tab-pane>

              </el-tabs>
              <span
                slot="footer"
                class="dialog-footer"
              >
                <el-button @click="drug.drugForm.innerDialogVisible = false">取 消</el-button>
                <el-button
                  type="primary"
                  @click="drugHandleDialogOk"
                >确 定</el-button>
              </span>

            </el-dialog>

            <el-form-item
              label="开始日期:"
              prop="beginDate"
            >
              <el-date-picker
                v-model="drug.drugForm.beginDate"
                class="form-item"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="pickerOptions"
                :disabled="drug.drugForm.isView"
              />
            </el-form-item>
            <el-form-item
              label="结束日期:"
              prop="endDate"
            >
              <el-date-picker
                v-model="drug.drugForm.endDate"
                class="form-item"
                type="date"
                format="yyyy-MM-dd "
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="drug.drugForm.isView"
              />
            </el-form-item>
            <el-form-item label="备注:">
              <el-input
                v-model="drug.drugForm.remark"
                class="form-item"
                type="textarea"
                placeholder="请输入内容"
                maxlength="30"
                rows="5"
                :disabled="drug.drugForm.isView"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="drug.drugForm.dialogVisible = false">取 消</el-button>
          <el-button
            v-if="!drug.drugForm.isView"
            type="primary"
            @click="drugHandleCreate"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div>
      <div
        id="printContentGLUPivot"
        ref="printContentGLUPivot"
        style="margin:5px;display:none"
      >
        <div
          id="printHeadArea"
          style="padding:10px"
        />
        <div>
          <div
            v-for="(table,k) in firstTab.printTableDataPivot"
            :key="k"
          >
            <div style="margin-bottom:15px">
              <div style="width:900px;text-align:center;line-weight:16pt;font-size:16pt">
                <div>{{ organizationName }}</div>
                <div style="padding:5px">血糖检测记录表</div>
              </div>
            </div>
            <div style="display:table-row">
              <div class="head-td">姓名:{{ patient.patientName }}</div>
              <div class="head-td">性别:{{ patient.genderDisplay }}</div>
              <div class="head-td">年龄:{{ patient.age }}</div>
              <div class="head-td">科室:{{ patient.departmentName }}</div>
              <div class="head-td">床号:{{ patient.bed }}</div>
              <div class="head-td">住院号:{{ patient.hospitalizedNum }}</div>
            </div>
            <table class="table" style="width: 100%">
              <thead>
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
                  <template>
                    <tr v-for="(itemm, indexx) in ((item.records === null | item.records.length <= 0) ? 2:Math.ceil(item.records.length / 6) * 2)" :key="indexx">
                      <!-- 如果indexx = 0 -->
                      <td v-if="indexx === 0" :rowspan="(item.records === null | item.records.length <= 0) ? 2:Math.ceil(item.records.length / 6) * 2">{{ item.testDay }}</td>
                      <td v-if="indexx % 2=== 0 " rowspan="2">
                        <span v-if="item.dayBreak !== null && indexx === 0">
                          <span :class="item.dayBreak.determineType">
                            {{ item.dayBreak.testValue }}
                            <span v-if="item.dayBreak.determineType==='High'">↑</span>
                            <span v-if="item.dayBreak.determineType==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx % 2 === 0" rowspan="2">
                        <span v-if="item.beforeBreakfast !== null && indexx === 0">
                          <span :class="item.beforeBreakfast.determineType">
                            {{ item.beforeBreakfast.testValue }}
                            <span v-if="item.beforeBreakfast.determineType==='High'">↑</span>
                            <span v-if="item.beforeBreakfast.determineType==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0" rowspan="2">
                        <span v-if="item.afterBreakfast !== null && indexx === 0">
                          <span :class="item.afterBreakfast.determineType">
                            {{ item.afterBreakfast.testValue }}
                            <span v-if="item.afterBreakfast.determineType==='High'">↑</span>
                            <span v-if="item.afterBreakfast.determineType==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0" rowspan="2">
                        <span v-if="item.beforeLunch !== null && indexx === 0">
                          <span :class="item.beforeLunch.determineType">
                            {{ item.beforeLunch.testValue }}
                            <span v-if="item.beforeLunch.determineType==='High'">↑</span>
                            <span v-if="item.beforeLunch.determineType==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0" rowspan="2">
                        <span v-if="item.afterLunch !== null && indexx === 0">
                          <span :class="item.afterLunch.determineType">
                            {{ item.afterLunch.testValue }}
                            <span v-if="item.afterLunch.determineType==='High'">↑</span>
                            <span v-if="item.afterLunch.determineType==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0" rowspan="2">
                        <span v-if="item.beforeDinner !== null && indexx === 0">
                          <span :class="item.beforeDinner.determineType">
                            {{ item.beforeDinner.testValue }}
                            <span v-if="item.beforeDinner.determineType==='High'">↑</span>
                            <span v-if="item.beforeDinner.determineType==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0" rowspan="2">
                        <span v-if="item.afterDinner !== null && indexx === 0">
                          <span :class="item.afterDinner.determineType">
                            {{ item.afterDinner.testValue }}
                            <span v-if="item.afterDinner.determineType==='High'">↑</span>
                            <span v-if="item.afterDinner.determineType==='Low'">↓</span>
                          </span>
                        </span>
                      </td>
                      <td v-if="indexx %2 === 0" rowspan="2">
                        <span v-if="item.beforeBed !== null && indexx === 0">
                          <span :class="item.beforeBed.determineType">
                            {{ item.beforeBed.testValue }}
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
                          </span>                        </span>
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
                  </template>
                </div>
              </tbody>
            </table>

            <!-- <div class="table">
              <div class="table-tr">
                <div class="table-td-lg">检测日期</div>

                <div class="table-td">凌晨</div>
                <div class="table-td">空腹</div>
                <div class="table-td">早餐后</div>
                <div class="table-td">午餐前</div>
                <div class="table-td">午餐后</div>
                <div class="table-td">晚餐前</div>
                <div class="table-td">晚餐后</div>
                <div class="table-td">睡前</div>
              </div>
              <div
                v-for="(item,index) in table"
                :key="index"
                class="table-tr"
              >
                <div class="table-td"> {{ item.testDay }}</div>

                <div class="table-td-lg">
                  <span v-if="item.dayBreak !== null">
                    <span :class="item.dayBreak.determineType">
                      {{
                        item.dayBreak.testValue
                      }}
                      <span class="unit">{{ item.dayBreak.unit }}</span>
                      &nbsp;<span v-if="item.dayBreak.determineType==='High'">↑</span><span v-if="item.dayBreak.determineType==='Low'">↓</span>

                    </span>
                  </span>
                </div>
                <div class="table-td-lg">
                  <span v-if="item.beforeBreakfast !== null">
                    <span :class="item.beforeBreakfast.determineType">
                      {{
                        item.beforeBreakfast.testValue
                      }}
                      <span class="unit">{{ item.beforeBreakfast.unit }}</span>
                      &nbsp;<span v-if="item.beforeBreakfast.determineType==='High'">↑</span><span v-if="item.beforeBreakfast.determineType==='Low'">↓</span>

                    </span>
                  </span>
                </div>
                <div class="table-td-lg">
                  <span v-if="item.afterBreakfast !== null">
                    <span :class="item.afterBreakfast.determineType">
                      {{
                        item.afterBreakfast.testValue
                      }}
                      <span class="unit">{{ item.afterBreakfast.unit }}</span>
                      &nbsp;<span v-if="item.afterBreakfast.determineType==='High'">↑</span><span v-if="item.afterBreakfast.determineType==='Low'">↓</span>

                    </span>
                  </span>
                </div>
                <div class="table-td-lg">
                  <span v-if="item.beforeLunch !== null">
                    <span :class="item.beforeLunch.determineType">
                      {{
                        item.beforeLunch.testValue
                      }}
                      <span class="unit">{{ item.beforeLunch.unit }}</span>
                      &nbsp;<span v-if="item.beforeLunch.determineType==='High'">↑</span><span v-if="item.beforeLunch.determineType==='Low'">↓</span>

                    </span>
                  </span>
                </div>
                <div class="table-td-lg">
                  <span v-if="item.afterLunch !== null">
                    <span :class="item.afterLunch.determineType">
                      {{
                        item.afterLunch.testValue
                      }}
                      <span class="unit">{{ item.afterLunch.unit }}</span>
                      &nbsp;<span v-if="item.afterLunch.determineType==='High'">↑</span><span v-if="item.afterLunch.determineType==='Low'">↓</span>

                    </span>
                  </span>
                </div>
                <div class="table-td-lg">
                  <span v-if="item.beforeDinner !== null">
                    <span :class="item.beforeDinner.determineType">
                      {{
                        item.beforeDinner.testValue
                      }}
                      <span class="unit">{{ item.beforeDinner.unit }}</span>
                      &nbsp;<span v-if="item.beforeDinner.determineType==='High'">↑</span><span v-if="item.beforeDinner.determineType==='Low'">↓</span>

                    </span>
                  </span>
                </div>
                <div class="table-td-lg">
                  <span v-if="item.afterDinner !== null">
                    <span :class="item.afterDinner.determineType">
                      {{
                        item.afterDinner.testValue
                      }}
                      <span class="unit">{{ item.afterDinner.unit }}</span>
                      &nbsp;<span v-if="item.afterDinner.determineType==='High'">↑</span><span v-if="item.afterDinner.determineType==='Low'">↓</span>

                    </span>
                  </span>
                </div>
                <div class="table-td-lg">
                  <span v-if="item.beforeBed !== null">
                    <span :class="item.beforeBed.determineType">
                      {{
                        item.beforeBed.testValue
                      }}
                      <span class="unit">{{ item.beforeBed.unit }}</span>
                      &nbsp;<span v-if="item.beforeBed.determineType==='High'">↑</span><span v-if="item.beforeBed.determineType==='Low'">↓</span>
                    </span>
                  </span>
                </div>
              </div>
            </div> -->
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
        id="printContentGLU"
        ref="printContentGLU"
        style="margin:5px;display:none"
      >
        <div
          id="printHeadArea"
          style="padding:10px"
        >
          <div>
            <div style="width:900px;text-align:center;line-weight:16pt;font-size:16pt">
              <div>{{ organizationName }}</div>
              <div style="padding:5px">血糖检测记录表</div>
            </div>
          </div>
          <div style="display:table-row">
            <div class="head-td">姓名:{{ patient.patientName }}</div>
            <div class="head-td">性别:{{ patient.genderDisplay }}</div>
            <div class="head-td">年龄:{{ patient.age }}</div>
            <div class="head-td">科室:{{ patient.departmentName }}</div>
            <div class="head-td">床号:{{ patient.bed }}</div>
            <div class="head-td">住院号:{{ patient.hospitalizedNum }}</div>
          </div>
        </div>
        <div>
          <div
            v-for="(table,k) in firstTab.printTableData"
            :key="k"
          >
            <div class="table">
              <div class="table-tr">
                <div class="table-td-lg">检测日期</div>
                <div class="table-td">检测时段</div>
                <div class="table-td">血糖值</div>
                <div class="table-td">单位</div>
                <div class="table-td">检测人</div>
              </div>
              <div
                v-for="(item,index) in table"
                :key="index"
                class="table-tr"
              >
                <div class="table-td"> {{ item.testTime }}</div>
                <div class="table-td"> {{ item.periodName }}</div>
                <div class="table-td-lg">
                  <span :class="item.determineType">
                    {{ item.testValue }}<span v-if="item.determineType==='High'">↑</span>
                    <span v-if="item.determineType==='Low'">↓</span>
                  </span>
                </div>
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
      </div>
      <div
        id="printContentKET"
        ref="printContentKET"
        style="margin:5px;display:none"
      >
        <div
          id="printHeadArea"
          style="padding:10px"
        >

          <div>

            <div style="width:900px;text-align:center;line-weight:16pt;font-size:16pt">
              <div>{{ organizationName }}</div>
              <div style="padding:5px">血酮检测记录表</div>
            </div>

          </div>
          <div style="display:table-row">
            <div class="head-td">姓名:{{ patient.patientName }}</div>
            <div class="head-td">性别:{{ patient.genderDisplay }}</div>
            <div class="head-td">年龄:{{ patient.age }}</div>
            <div class="head-td">科室:{{ patient.departmentName }}</div>
            <div class="head-td">床号:{{ patient.bed }}</div>
            <div class="head-td">住院号:{{ patient.hospitalizedNum }}</div>
          </div>
        </div>

        <div>
          <div
            v-for="(table,k) in ket.ketData.printTableData"
            :key="k"
          >
            <div class="table">
              <div class="table-tr">
                <div class="table-td-lg">检测日期</div>

                <div class="table-td">血酮值</div>
                <div class="table-td">单位</div>
                <div class="table-td">检测人</div>

              </div>
              <div
                v-for="(item,index) in table"
                :key="index"
                class="table-tr"
              >
                <div class="table-td"> {{ item.testTime }}</div>

                <div class="table-td-lg">
                  <span :class="item.determineType">
                    {{ item.testValue }}<span v-if="item.determineType==='High'">↑</span>
                    <span v-if="item.determineType==='Low'">↓</span>
                  </span>
                </div>
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

      </div>
      <div
        id="printContentUA"
        ref="printContentUA"
        style="margin:5px;display:none"
      >
        <div
          id="printHeadArea"
          style="padding:10px"
        >

          <div>

            <div style="width:900px;text-align:center;line-weight:16pt;font-size:16pt">
              <div>{{ organizationName }}</div>
              <div style="padding:5px">尿酸检测记录表</div>
            </div>

          </div>
          <div style="display:table-row">
            <div class="head-td">姓名:{{ patient.patientName }}</div>
            <div class="head-td">性别:{{ patient.genderDisplay }}</div>
            <div class="head-td">年龄:{{ patient.age }}</div>
            <div class="head-td">科室:{{ patient.departmentName }}</div>
            <div class="head-td">床号:{{ patient.bed }}</div>
            <div class="head-td">住院号:{{ patient.hospitalizedNum }}</div>
          </div>
        </div>

        <div>
          <div
            v-for="(table,k) in ua.uaData.printTableData"
            :key="k"
          >
            <div class="table">
              <div class="table-tr">
                <div class="table-td-lg">检测日期</div>

                <div class="table-td">血酮值</div>
                <div class="table-td">单位</div>
                <div class="table-td">检测人</div>

              </div>
              <div
                v-for="(item,index) in table"
                :key="index"
                class="table-tr"
              >
                <div class="table-td"> {{ item.testTime }}</div>

                <div class="table-td-lg">
                  <span :class="item.determineType">
                    {{ item.testValue }}<span v-if="item.determineType==='High'">↑</span>
                    <span v-if="item.determineType==='Low'">↓</span>
                  </span>
                </div>
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

      </div>
      <div
        id="printContentAdvice"
        ref="printContentAdvice"
        style="margin:5px;display:none"
      >
        <div
          id="printHeadArea"
          style="padding:10px"
        >

          <div>

            <div style="width:900px;text-align:center;line-weight:16pt;font-size:16pt">
              <div>{{ organizationName }}</div>
              <div style="padding:5px">患者医嘱</div>
            </div>

          </div>
          <div style="display:table-row">
            <div class="head-td">姓名:{{ patient.patientName }}</div>
            <div class="head-td">性别:{{ patient.genderDisplay }}</div>
            <div class="head-td">年龄:{{ patient.age }}</div>
            <div class="head-td">科室:{{ patient.departmentName }}</div>
            <div class="head-td">床号:{{ patient.bed }}</div>
            <div class="head-td">住院号:{{ patient.hospitalizedNum }}</div>
          </div>
        </div>

        <div>
          <div
            v-for="(table,k) in thirdTab.printTableData"
            :key="k"
          >
            <div class="table">
              <div class="table-tr">
                <div class="table-td-lg">医嘱名称</div>

                <div class="table-td">医嘱分类</div>
                <div class="table-td">医嘱类别</div>
                <div class="table-td">开始日期</div>
                <div class="table-td">结束日期</div>
                <div class="table-td">状态</div>
                <div class="table-td">备注</div>

              </div>
              <div
                v-for="(item,index) in table"
                :key="index"
                class="table-tr"
              >
                <div class="table-td"> {{ item.name }}</div>
                <div class="table-td"> {{ item.categoryDisplay }}</div>
                <div class="table-td"> {{ item.adviceTypeDisplay }}</div>
                <div class="table-td"> {{ item.beginDate }}</div>
                <div class="table-td"> {{ item.endDate }}</div>

                <div class="table-td">
                  <div v-if="item.status">使用中</div>
                  <div v-else>已停止</div>
                </div>
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
</template>

<script>
import { Message } from 'element-ui'
import {
  queryTestDataByPivotAndPatient,
  queryTestDataByPatient,
  bloodGlucoseReport,
  bloodGlucoseTrend,
  bloodGlucoseMap,
  bloodGlucoseFluctuation,
  saveProfileRange, queryProfileRange, dataTrend,

  getRejectReason,
  createTestResult,
  getTestItems
} from '@/api/test'
import {
  getPatient,
  patientDischarge,
  updatePatient,
  queryPatientConsultation,
  createDrugAdvice,
  stopDrugAdvice,
  queryDrugAdvice,
  getMedicationCategories,
  queryMedication,
  getInsulinTimePeriodList
} from '@/api/patient'
import {
  getPeriodOptions, getPatientAdviceList,
  getPatientAdviceTypes, getTemplateList, createPatientAdvice, suspendPatientAdvice
} from '@/api/advice'

import { getGenders, getDoctors, queryDoctors, getDepartments } from '@/api/user'
import { addPrintStyle } from '@/utils/index'
import moment from 'moment'
import { mapGetters } from 'vuex'
// import router from '@/router'
import checkPermission from '@/utils/permission' // 权限判断函数
import MyTreeselect from '@/components/common/MyTreeselect.vue'
export default {
  name: 'PatientDetail',
  components: {
    MyTreeselect
  },

  data () {
    const validateTmpAdviceContent = (rule, value, callback) => {
      console.log('validateTmpAdviceContent')
      if (this.thirdTab.dialogForm.adviceType === 'Temporary') {
        if (!value) {
          return callback(new Error('请选择医嘱内容'))
        } else {
          if (value.length === 0) {
            callback('必须为临时医嘱添加检测时间')
          } else {
            for (let i = 0; i < value.length; i++) {
              console.log(value[i])
              if (value[i] === undefined || value[i] === null || value[i] === '') {
                callback('必须为临时医嘱添加检测时间')
              }

              if (value[i].data === undefined || value[i].data === null || value[i].data.ylength === 0) {
                callback('临时医嘱时间格式有错误')
              }
            }
            callback()
          }
        }
      } else {
        callback()
      }
    }
    const validateTemplateId = (rule, value, callback) => {
      console.log('validateTmplateId')
      console.log(this.thirdTab.dialogForm)
      if (this.thirdTab.dialogForm.adviceType !== 'Temporary' &&
        !this.thirdTab.dialogForm.isCustomer) {
        if (value === 0) {
          callback('必须选择一个模板')
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validateAdviceContent = (rule, value, callback) => {
      if (this.thirdTab.dialogForm.isCustomer) {
        if (!value) {
          return callback(new Error('请选择医嘱内容'))
        } else {
          if (value.length === 0) {
            return callback(new Error('请选择最少一个医嘱内容'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }

    const validateIdCard = (rule, value, callback) => {
      console.log('validateIDCArd')
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
      console.log('validateCode')
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
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < (Date.now() - 86400000)
        }
        // shortcuts: [{
        //   text: '今天',
        //   onClick (picker) {
        //     picker.$emit('pick', new Date())
        //   }
        // }, {
        //   text: '昨天',
        //   onClick (picker) {
        //     const date = new Date()
        //     date.setTime(date.getTime() - 3600 * 1000 * 24)
        //     picker.$emit('pick', date)
        //   }
        // }, {
        //   text: '一周前',
        //   onClick (picker) {
        //     const date = new Date()
        //     date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
        //     picker.$emit('pick', date)
        //   }
        // }]
      },
      // 存储默认的科室
      departDefaultCodes: [],
      patient: {
        patientId: 0,
        patientName: '',
        gender: '',
        genderDisplay: '',
        birthday: '',
        age: 0,
        idCard: '',
        phoneNumber: '',
        hospitalizedDate: '',
        hospitalizedNum: '',
        code: '',
        bed: '',
        doctorCode: '',
        doctorName: '',
        departmentCode: '',
        departmentName: ''

      },
      patientFormRules: {
        patientName: [
          { required: true, message: '姓名必须输入', trigger: 'blur' },
          { min: 2, max: 10, message: '姓名长度2到10个字符', trigger: 'blur' }

        ],
        bed: [
          { required: true, message: '床号必须输入', trigger: 'blur' },
          { min: 1, max: 12, message: '床号长度在 1 到 12 个字符', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '性别必须选择', trigger: 'change' }
        ],
        code: [
          { min: 3, max: 32, message: '腕带码长度在 3 到 32 个字符', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' }
        ],
        idCard: [
          { min: 15, max: 18, message: '身份证长度在 15 到 18 个字符', trigger: 'blur' },
          { validator: validateIdCard, trigger: 'blur' }
        ],

        birthday: [
          { required: true, trigger: 'change', message: '出生日期必须输入' }
        ],
        hospitalizedNum: [
          { required: true, trigger: 'blur', message: '住院号必须输入' },
          { min: 4, max: 18, message: '住院号 4 到18 个字符', trigger: 'blur' }
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
      ranges: [],
      gendersOptions: [],
      doctorOptions: [],
      periodOptions: [],

      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'

      },
      adviceTemplatePeriodOptions: [],
      adviceTemplateTypeOptions: [],
      adviceTemplateListOptions: [],
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

      ],
      rejectOptions: [

      ],

      zeroTab: {

      },
      // 血糖数据
      firstTab: {
        tableData: [],
        dialogVisibleMore: false,
        moreTableData: [],
        tableAllData: [],
        printTableData: [],
        printTableDataPivot: [],
        buttonLoading: false,
        printPageSize: 16,
        dataView: false,
        total: 0,
        resultForm: {
          category: 'GLU',
          patientId: 0,
          period: '',
          remark: '',
          result: 0.6,
          testTime: '',
          unenforced: false,
          selType: true,
          normalValue: 0.6,
          textValue: '',
          cause: ''
        },
        resultFormRules: {
          patientId: [
            { required: true, message: '病人ID不能为空', trigger: 'blur' }
          ],
          period: [
            { required: true, message: '检测时段必须输入', trigger: 'change' }
          ],
          testTime: [
            { required: true, message: '检测日期必须输入', trigger: 'change' }
          ],
          result: [
            { required: true, message: '检测结果或拒测原因必须输入', trigger: 'blur' }
          ]
        },
        dialogVisible: false,
        form: {
          beginDate: null,
          endDate: null,
          page: 1,
          size: 20,
          category: 'GLU'
        },
        loading: false,
        addHandle: false
      },
      secondTab: {
        report: {
          form: {
            beginDate: null,
            endDate: null,
            tableData: []
          },
          summary: {},
          tableData: []
        },
        trend: {
          form: {
            period: '',
            searchDate: new Date()
          }
        },
        graph: {
          form: {
            searchDate: new Date(),
            beginDate: null,
            endDate: null,
            days: 3,
            options: [
              {
                label: '3天',
                value: 3
              },
              {
                label: '7天',
                value: 7
              },
              {
                label: '14天',
                value: 14
              },
              {
                label: '全部数据',
                value: 0
              }
            ]
          }
        },
        varGlu: {
          form: {
            searchDate: new Date(),
            days: 3,
            beginDate: null,
            endDate: null,
            options: [
              {
                label: '3天',
                value: 3
              },
              {
                label: '7天',
                value: 7
              },
              {
                label: '14天',
                value: 14
              },
              {
                label: '全部数据',
                value: 0
              }
            ]
          }
        },
        range: {
          loading: false,
          form: {
            ranges: []
          }
        },
        third: {
          form: {
            name: ''
          }
        },
        activeName: 'report'
      },
      thirdTab: {
        tableData: [],
        dialogVisible: false,
        form: {
          category: '',
          adviceName: '',
          patientId: 0,
          page: 1,
          size: 10
        },
        loading: false,
        total: 0,
        printTableData: [],
        printPageSize: 32,
        buttonLoading: false,

        dialogForm: {
          patientId: 0,
          name: '',
          isCustomer: false,
          templateId: 0,
          adviceTemplate: {},
          adviceType: 'LongStandards',
          category: 'GLU',
          contents: [],
          content: '',
          beginDate: '',
          endDate: '',
          remark: '',
          tmpContents: [],
          index: 0,
          isView: false

        },
        dialogFormRules: {
          name: [
            { required: true, message: '医嘱名称必须输入', trigger: 'blur' },
            {
              min: 2,
              max: 12,
              message: '医嘱名称在 2 到 12 个字符',
              trigger: 'blur'
            }
          ],
          // userCode: [
          //   { required: true, message: '必须有医生账号', trigger: 'blur' },
          //   {
          //     min: 1,
          //     max: 18,
          //     message: '医生账号在 2 到 18 个字符',
          //     trigger: 'blur'
          //   }
          // ],
          beginDate: [
            { required: true, message: '开始日期必须选择', trigger: 'change' }
          ],
          // endDate: [
          //   { validator: validateEndDate, trigger: 'blur' }
          // ],
          templateId: [
            { validator: validateTemplateId, trigger: 'blur' }
          ],
          contents: [{ validator: validateAdviceContent, trigger: 'blur' }],
          tmpContents: [
            { validator: validateTmpAdviceContent, trigger: 'blur' }
          ]
        }
      },
      ket: {
        ketData: {
          form: {
            category: 'KET',
            beginDate: '',
            endDate: '',
            page: 1,
            size: 10
          },
          total: 0,
          tableData: [],
          printTableData: [],
          printPageSize: 32,
          buttonLoading: false,
          resultForm: {
            category: 'KET',
            patientId: 0,
            period: '',
            remark: '',
            result: 0,
            testTime: '',
            unenforced: false,
            selType: true,
            normalValue: 0,
            textValue: '',
            cause: ''

          },
          resultFormRules: {
            patientId: [

              { required: true, message: '病人ID不能为空', trigger: 'blur' }

            ],

            testTime: [
              { required: true, message: '检测日期必须选择', trigger: 'change' }
            ],
            result: [
              { required: true, message: '检测结果或者拒测原因必须输入', trigger: 'blur' }
            ]
          },
          dialogVisible: false
        },
        ketTrend: {
          form: {
            beginDate: '',
            endDate: '',
            category: 'KET',
            patientId: 0
          }
        },
        ketActiveName: 'ketData'
      },
      ua: {
        uaData: {
          form: {
            category: 'UA',
            beginDate: '',
            endDate: '',
            page: 1,
            size: 10
          },
          total: 0,
          tableData: [],
          printTableData: [],
          printPageSize: 32,
          buttonLoading: false,
          resultForm: {
            category: 'UA',
            patientId: 0,
            period: '',
            remark: '',
            result: 179,
            testTime: '',
            unenforced: false,
            selType: true,
            normalValue: 179,
            textValue: '',
            rejectReason: '',
            cause: ''

          },
          resultFormRules: {
            patientId: [
              { required: true, message: '病人ID不能为空', trigger: 'blur' }
            ],
            testTime: [
              { required: true, message: '检测日期必须输入', trigger: 'change' }
            ],
            result: [
              { required: true, message: '检测结果或拒测原因必须输入', trigger: 'blur' }
            ]
          },
          dialogVisible: false
        },
        uaTrend: {
          form: {
            beginDate: '',
            endDate: '',
            category: 'UA',
            patientId: 0
          }
        },
        uaActiveName: 'uaData'
      },
      consultation: {
        conditionForm: {
          beginDate: '',
          endDate: '',
          isFinished: '',
          patientId: 0,
          page: 1,
          size: 10,
          total: 0
        },
        loading: false,
        status: [{ name: '会诊中', key: false }, { name: '结束', key: true }]
      },
      drug: {
        periodOptions: [],
        form: {
          adviceName: '',
          page: 1,
          size: 10,
          patientId: 0,
          total: 0
        },
        activeName: '',
        loading: false,
        tableData: [],

        drugForm: {
          name: '',
          contents: [],
          tmpTableData: [],

          beginDate: '',
          endDate: '',
          remark: '',

          patientId: '',
          isView: false,
          dialogVisible: false,
          innerDialogVisible: false
        },
        drugFormRule: {
          name: [
            { required: true, message: '用药医嘱名称必须输入', trigger: 'blur' },
            { min: 2, max: 12, message: '用药医嘱名称是2-12位' }
          ],

          beginDate: [{
            required: true, message: '用药医嘱开始时间必须选择', trigger: 'blur'
          }]
        },
        queryConditionForm: {
          categoryCode: '',
          queryCondition: '',
          page: 1,
          size: 10,
          total: 0
        },
        drugCategories: [],
        drugTableData: [],
        drugSelections: [],
        drugTableDataLoading: false
      },
      activeName: 'glu',
      gluActiveName: 'first'
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    isOutpatient () {
      return this.$route.query.isOutpatient === 'true'
    },
    ...mapGetters(['avatar', 'token', 'organizationName'])
  },
  created () {
    this.init()
    this.initInitData()
  },
  mounted () {

  },

  methods: {
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
    checkPermission,
    init () {
      if (this.id === undefined) {
        this.$router.push({
          path: '/'

        })
      }
      getDepartments().then(res => {
        this.deptOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
      getGenders().then(res => {
        this.gendersOptions = res.dataContent
      })
      getDoctors().then(res => {
        this.doctorOptions = res.dataContent
      })

      getPeriodOptions('LongStandards').then(res => {
        this.periodOptions = res.dataContent
      })

      getPatientAdviceTypes().then(res => {
        this.adviceTemplateTypeOptions = res.dataContent
      })

      getRejectReason().then(res => {
        this.rejectOptions = res.dataContent
      })

      this.secondTab.report.form.beginDate = moment()
        .subtract(7, 'day')
        .format('YYYY-MM-DD')
      this.secondTab.report.form.endDate = moment().format('YYYY-MM-DD')

      queryProfileRange(this.id).then(res => {
        this.ranges = res.dataContent.filter(item => item.category === 'GLU')
      })
      getTestItems().then(res => {
        this.testOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
    },
    async initInitData () {
      await getPatient(this.id).then(res => {
        const p = res.dataContent
        this.onQueryDoctor(p.departmentCode)
        // 默认的科室
        if (p.departmentCode !== null && p.departmentCode !== '') {
          this.departDefaultCodes = []
          this.departDefaultCodes.push(p.departmentCode)
        } else {
          this.departDefaultCodes = null
        }
        this.patient = {
          patientId: p.id,
          patientName: p.patientName,
          gender: p.gender,
          genderDisplay: p.genderDisplay,
          birthday: p.birthday,
          age: p.age,
          idCard: p.idCard,
          phoneNumber: p.phoneNumber,
          hospitalizedDate: p.hospitalizedDate,
          hospitalizedNum: p.hospitalizedNum,
          code: p.code,
          bed: p.bed,
          doctorCode: p.doctorCode,
          doctorName: p.doctorName,
          departmentCode: p.departmentCode,
          departmentName: p.departmentName
        }
        this.firstTab.form.beginDate = moment(this.patient.hospitalizedDate)
          //  .subtract(1, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
        this.firstTab.form.endDate = moment().format('YYYY-MM-DD HH:mm:ss')
        this.initKetData()
        this.initUaData()
        this.initThirdTabData()
        this.initConsultationData()
        this.onFirstTabQuery()

        this.drugInitData()
      }).catch(err => {
        Message.error(err.message)
      })
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
      this.patient.age = age
    },
    queryTemplateList (t) {
      getTemplateList(t).then(res => {
        this.adviceTemplateListOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
    },

    async initZeroData () {
      await getPatient(this.id).then(res => {
        const p = res.dataContent
        // if (p === null || p === undefined) {
        //   Message.error('患者已经出院，无法查看,页面将自动关闭')
        //   setTimeout(this.closeWindow, 4000)
        // }
        // this.patient = res.dataContent
        this.onQueryDoctor(p.departmentCode)
        // 默认的科室
        if (p.departmentCode !== null && p.departmentCode !== '') {
          this.departDefaultCodes = []
          this.departDefaultCodes.push(p.departmentCode)
        } else {
          this.departDefaultCodes = null
        }
        this.patient = {
          patientId: p.id,
          patientName: p.patientName,
          gender: p.gender,
          genderDisplay: p.genderDisplay,
          birthday: p.birthday,
          age: p.age,
          idCard: p.idCard,
          phoneNumber: p.phoneNumber,
          hospitalizedDate: p.hospitalizedDate,
          hospitalizedNum: p.hospitalizedNum,
          code: p.code,
          bed: p.bed,
          doctorCode: p.doctorCode,
          doctorName: p.doctorName,
          departmentCode: p.departmentCode,
          departmentName: p.departmentName
        }

        this.firstTab.form.beginDate = moment(this.patient.hospitalizedDate)
          //  .subtract(1, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
        this.firstTab.form.endDate = moment().format('YYYY-MM-DD HH:mm:ss')
        this.initKetData()
        this.initUaData()
        this.initThirdTabData()
        this.initConsultationData()
        this.drugInitData()
      })
    },

    closeWindow () {
      window.close()
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
    isValidDateArea (form) {
      if (form.beginDate !== null && form.beginDate.length > 0 &&
        form.endDate !== null && form.endDate.length > 0) {
        return moment(form.beginDate).isSameOrBefore(form.endDate)
      } else {
        return true
      }
    },
    tabHandleClick (e) {
      if (e.name === 'zero') {
        this.initZeroData()
      }
      if (e.name === 'glu') {
        this.onFirstTabQuery()
      }
      if (e.name === 'ua') {
        this.uaDataQuery()
      }
      if (e.name === 'ket') {
        this.ketDataQuery()
      }
      if (e.name === 'third') {
        this.thirdTabQuery()
      }
      if (e.name === 'consultation') {
        this.onSearchConsultation()
      }
      if (e.name === 'drug') {
        this.drugOnSearch()
      }
    },
    gluTabHandleClick (e) {
      if (e.name === 'second') {
        this.secondTabReportQuery()
      }
    },
    // hh--
    secondTabClick (e) {
      if (e.name === 'report') {
        this.secondTabReportQuery()
      }
      if (e.name === 'trend') {
        this.handleSecondTabTrendQuery()
      }
      if (e.name === 'graph') {
        this.secondTabGraphQuery()
      }
      if (e.name === 'varGlu') {
        this.secondTabVarGLUQuery()
      }
    },

    zeroTabSave () {
      console.log(this.patient)
      this.$refs.patientForm.validate(valid => {
        if (valid) {
          if (this.patient.code === null || this.patient.code === '' || this.patient.code.length === 0) {
            this.patient.code = null
          }
          if (this.patient.idCard === null || this.patient.idCard === '' || this.patient.idCard.length === 0) {
            this.patient.idCard = null
          }
          updatePatient(this.patient).then(res => {
            Message.success('保存患者信息成功')
          }).catch(err => {
            console.log(err)
            Message.error(err.message)
          })
        }
      })
    },

    zeroDoctorClear () {
      this.patient.doctorCode = null
    },
    // 科室选择
    changeDepentSelHandle (val) {
      this.handleNodeClear()
      this.patient.departmentCode = val.id
      this.onQueryDoctor(val.id)
    },
    inoutDepentChangeHandle (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleNodeClear()
      } else {
        if (Array.isArray(val)) {
          if (val.length > 0) {
            this.onQueryDoctor(val[0])
          }
        } else {
          this.onQueryDoctor(val)
        }
      }
    },
    handleNodeClear () {
      this.doctorOptions = []
      this.patient.departmentCode = null
      this.patient.doctorCode = null
    },
    onQueryDoctor (departCode) {
      this.doctorOptions = []
      queryDoctors(departCode).then(res => {
        this.doctorOptions = res.dataContent
      }).catch(err => {
        console.log(err.message)
      })
    },
    zeroTabDischarge () {
      this.$confirm('您确定患者要出院, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        patientDischarge(this.id).then(res => {
          Message.success('出院成功')
          this.$router.go(-1)
          setTimeout(function () { window.close() }, 1000)
        }).catch(err => {
          Message.error('出院失败:' + err.message)
        })
      })
    },

    firstTabInputChanged (val) {
      this.firstTab.resultForm.result = val
      this.$refs.firstTabResultForm.clearValidate()
    },
    firstTabSelResultChanged (val) {
      this.firstTab.resultForm.result = val
      this.$refs.firstTabResultForm.clearValidate()
    },
    firstTabSelRejectChanged (val) {
      this.firstTab.resultForm.result = val
      this.$refs.firstTabResultForm.clearValidate()
    },
    async vuePrintGLUPivot () {
      // this.firstTab.buttonLoading = true
      // const url = this.$baseConfig.reportServiceUrl + '/report/pivotreport' +
      //   '?patientId=' + this.id + '&begin=' + this.firstTab.form.beginDate +
      //   '&end=' + this.firstTab.form.endDate +
      //   '&token=' + this.token
      // window.open(url, '_blank')
      // this.firstTab.buttonLoading = false
      if (this.isValidDateArea(this.firstTab.form)) {
        this.firstTab.buttonLoading = true
        this.firstTab.printTableDataPivot = []
        var pageCount = Math.ceil(this.firstTab.total / this.firstTab.printPageSize)
        const allData = []
        for (var k = 1; k < pageCount + 1; k++) {
          await queryTestDataByPivotAndPatient(this.id, {
            beginDate: this.firstTab.form.beginDate,
            endDate: this.firstTab.form.endDate,
            page: k,
            category: 'GLU',
            size: this.firstTab.printPageSize

          }).then(res => {
          // 处理数据
            if (res.dataContent.records !== null && res.dataContent.records.length > 0) {
              const arr = res.dataContent.records
              arr.forEach(item => {
                allData.push(item)
              })
              if (allData.length === this.firstTab.total) {
                let currentRows = 0
                let cTable = []
                // this.printTableData.add(cTable)
                for (var e = 0; e < allData.length; e++) {
                  // allData.forEach((obj, w) => {
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
                      this.firstTab.printTableDataPivot.push(cTable)
                      cTable = []
                      cTable.push(obj)
                      currentRows = 0
                      currentRows = currentRows + obj.rows
                    } else {
                      cTable.push(obj)
                    }
                  } else {
                    if (currentRows > 12) {
                      this.firstTab.printTableDataPivot.push(cTable)
                      cTable = []
                      cTable.push(obj)
                      this.firstTab.printTableDataPivot.push(cTable)
                    } else {
                      cTable.push(obj)
                      this.firstTab.printTableDataPivot.push(cTable)
                    }
                  }
                }
              }
            }
          })
        }
        const iframe = window.frames[0]
        iframe.document.body.innerHTML = this.$refs.printContentGLUPivot.innerHTML
        addPrintStyle(iframe)
        iframe.window.print()
        this.firstTab.buttonLoading = false
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    },
    // 打印
    async vuePrintGLU () {
      if (this.checkFormDate(this.firstTab.form)) {
        if (this.isValidDateArea(this.firstTab.form)) {
          this.firstTab.buttonLoading = true
          const url = this.$baseConfig.reportServiceUrl + '/report/recordreport' +
          '?patientId=' + this.id +
          '&Category=GLU ' +
          '&begin=' + this.firstTab.form.beginDate +
          '&end=' + this.firstTab.form.endDate +
          '&token=' + this.token
          window.open(url, '_blank')
          this.firstTab.buttonLoading = false
        } else {
          Message.error('开始日期必须小于结束日期')
        }
      }
    },

    async bgluRepPrintHandle () {
      if (!this.checkFormDate(this.secondTab.report.form)) {
        return
      }
      if (this.isValidDateArea(this.secondTab.report.form)) {
        this.secondTab.buttonLoading = true
        const url = this.$baseConfig.reportServiceUrl + '/areport/gluSummaryReport' +
          '?patientId=' + this.id +
          '&begin=' + this.secondTab.report.form.beginDate +
          '&end=' + this.secondTab.report.form.endDate +
          '&token=' + this.token
        window.open(url, '_blank')
        this.secondTab.buttonLoading = false
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    },

    async bgluTrendHandle () {
      if (this.secondTab.trend.form.searchDate === null) {
        Message.error('查询日期必须输入')
        return
      }
      var m = moment(this.secondTab.trend.form.searchDate)
      var date = m.format('yyyy-MM-DD')
      const url = this.$baseConfig.reportServiceUrl + '/areport/GluTrendReport' +
        '?patientId=' + this.id +
        '&Day=' + date +
        '&Periods=' + this.secondTab.trend.form.period +
        '&token=' + this.token
      window.open(url, '_blank')
    },
    // hh-
    async bgluAtlasHandle () {
      var end = ''
      var start = ''
      if (this.secondTab.graph.form.days === 0) {
        start = moment(this.patient.hospitalizedDate).format('YYYY-MM-DD HH:mm:ss')
        end = moment().format('YYYY-MM-DD')
      } else {
        if (this.secondTab.graph.form.searchDate === null) {
          Message.error('日期必须输入')
          return
        }
        var m = moment(this.secondTab.graph.form.searchDate)
        end = m.format('YYYY-MM-DD')

        start = m
          .subtract(this.secondTab.graph.form.days - 1, 'day')
          .format('YYYY-MM-DD')
      }
      const url = this.$baseConfig.reportServiceUrl + '/areport/GLU24MapReport' +
        '?patientId=' + this.id +
        '&begin=' + start +
        '&end=' + end +
        '&token=' + this.token
      window.open(url, '_blank')
    },

    async bgluFluctuationHandle () {
      var end = ''
      var start = ''
      if (this.secondTab.varGlu.form.days === 0) {
        start = moment(this.patient.hospitalizedDate).format('YYYY-MM-DD')
        end = moment().format('YYYY-MM-DD')
      } else {
        if (
          this.secondTab.varGlu.form.searchDate === null || this.secondTab.varGlu.form.searchDate.length === 0) {
          Message.error('日期必须输入')
          return
        }
        var m = moment(this.secondTab.varGlu.form.searchDate)
        end = m.format('YYYY-MM-DD')
        start = m
          .subtract(this.secondTab.varGlu.form.days - 1, 'day')
          .format('YYYY-MM-DD')
      }
      const url = this.$baseConfig.reportServiceUrl + '/areport/GluFluctuationReport' +
        '?patientId=' + this.id +
        '&begin=' + start +
        '&end=' + end +
        '&token=' + this.token
      window.open(url, '_blank')
    },

    onFirstTabQuery () {
      this.firstTab.form.page = 1
      this.firstTabQuery()
    },

    firstTabQuery () {
      // if (!this.checkFormDate(this.firstTab.form)) {
      //   return
      // }
      if (this.isValidDateArea(this.firstTab.form)) {
        this.firstTab.loading = true
        // this.firstTab.page = 1
        if (this.firstTab.dataView) {
          queryTestDataByPatient(this.id, this.firstTab.form)
            .then(res => {
              this.firstTab.tableAllData = res.dataContent.records
              this.firstTab.total = res.dataContent.total
              this.firstTab.loading = false
            })
            .catch(err => {
              Message.error(err.message)
            })
        } else {
          queryTestDataByPivotAndPatient(this.id, this.firstTab.form)
            .then(res => {
              // 处理数据
              if (res.dataContent.records !== null && res.dataContent.records.length > 0) {
                this.kk(res.dataContent.records)
              } else {
                this.firstTab.tableData = res.dataContent.records
              }
              this.firstTab.total = res.dataContent.total
              this.firstTab.loading = false
            })
            .catch(err => {
              this.firstTab.loading = false
              Message.error(err.message)
            })
        }
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    },
    // 血糖记录数据
    kk (resArr) {
      this.firstTab.tableData = []
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
          if (j.testDay === i.testDay) {
            this.firstTab.tableData.push(i)
            this.firstTab.tableData.push(j)
          }
        })
      })
    },
    jjFormateDate (date) {
      return date.includes(':') === true ? moment(date).format('HH:mm') : date
    },
    // more
    bgluMoreHandleClick (dataVal) {
      if (dataVal === null || dataVal.length <= 0) {
        Message.warning('没有更多数据')
        return
      }
      this.firstTab.dialogVisibleMore = true

      const data = JSON.parse(JSON.stringify(dataVal))
      data.records.forEach(i => {
        if (i.testValue.includes(':')) {
          const ss = i.testTime
          i.testTime = i.testValue
          i.testValue = ss
        }
      })
      // data.records.sort(function (a, b) {
      //   var x = a['testTime']
      //   var y = b['testTime']
      //   return ((x < y) ? -1 : ((x < y) ? 1 : 0))
      // })
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
              arr.push(row[key] + ' ↑')
            } else if (row['determineType'] === 'Low') {
              arr.push(row[key] + ' ↓')
            } else if (row['determineType'] === 'Normal') {
              arr.push(row[key])
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
      this.firstTab.moreTableData = transData
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
      if (columnIndex < 9) {
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
    // 单元格
    cellStyleMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex >= 9) {
        return ' padding: 3px 0; '
      } else {
        return ' padding: 9px 0; '
      }
    },
    firstTabchangeView () {
      this.firstTab.dataView = !this.firstTab.dataView
      this.onFirstTabQuery()
    },

    firstTabHandleSizeChange (val) {
      this.firstTab.form.size = val
      this.firstTabQuery()
    },
    firstTabHandleCurrentChange (val) {
      this.firstTab.form.page = val
      this.firstTabQuery()
    },
    // 新增血糖
    handleNewGluData () {
      this.cleartGLUData()
      this.firstTab.resultForm.testTime = moment().format('YYYY-MM-DD HH:mm:ss')
      this.firstTab.resultForm.patientName = this.patient.patientName
      this.firstTab.dialogVisible = true
    },
    closedFirstTablDialog () {
      this.$refs.firstTabResultForm.resetFields()
      this.firstTab.dialogVisible = false
    },
    cleartGLUData () {
      this.firstTab.resultForm = {
        category: 'GLU',
        patientId: 0,
        period: '',
        remark: '',
        result: 0.6,
        testTime: '',
        unenforced: false,
        selType: true,
        // 可测值
        normalValue: 0.6,
        // 不可测
        textValue: '',
        rejectReason: '',
        cause: ''

      }
    },
    // 新增血糖
    firstTabHandleUpdateData () {
      if (this.firstTab.resultForm.unenforced) {
        // 判断验证信息
        if (this.firstTab.resultForm.rejectReason === null || this.firstTab.resultForm.rejectReason === '') {
          this.firstTab.resultForm.result = ''
        }
      } else if (!this.firstTab.resultForm.selType) {
        // 判断验证信息
        if (this.firstTab.resultForm.textValue === null || this.firstTab.resultForm.textValue === '') {
          this.firstTab.resultForm.result = ''
        }
      } else {
        console.log('验证信息')
      }

      this.$refs.firstTabResultForm.validate(valid => {
        if (valid) {
          let value
          let casey
          if (this.firstTab.resultForm.unenforced) {
            value = this.firstTab.resultForm.rejectReason
            casey = this.firstTab.resultForm.case
          } else if (this.firstTab.resultForm.selType) {
            value = (this.firstTab.resultForm.normalValue * 10 / 10).toFixed(1)
            casey = ''
          } else {
            value = this.firstTab.resultForm.textValue
            casey = ''
          }
          const data = {
            category: 'GLU',
            patientId: this.id,
            period: this.firstTab.resultForm.period,
            remark: this.firstTab.resultForm.remark,
            testTime: this.firstTab.resultForm.testTime,
            result: value,
            unenforced: this.firstTab.resultForm.unenforced,
            cause: casey
          }
          this.firstTab.addHandle = true
          createTestResult(data).then(res => {
            this.onFirstTabQuery()
            Message.success('新增血糖记录成功')
            this.firstTab.addHandle = false
            this.firstTab.dialogVisible = false
            this.cleartGLUData()
          }).catch(err => {
            console.log(err)
            this.firstTab.addHandle = false
            Message.error('新增血糖记录失败:' + err.message)
          })
        }
      })
    },
    secondTabReportQuery (e) {
      // if (this.secondTab.report.form.beginDate === null || this.secondTab.report.form.endDate === null) {
      //   Message.error('开始日期或者结束日期必须输入')
      //   return
      // }
      this.secondTab.report.tableData = []
      this.secondTab.report.summary = {}
      if (!this.checkFormDate(this.secondTab.report.form)) {
        return
      }
      if (this.isValidDateArea(this.secondTab.report.form)) {
        bloodGlucoseReport(
          this.id,
          this.secondTab.report.form.beginDate,
          this.secondTab.report.form.endDate
        )
          .then(res => {
            this.secondTab.report.summary = {
              testDays: res.dataContent.dayNums,
              avgResult: res.dataContent.avg,
              maxResult: res.dataContent.maxValue,
              minResult: res.dataContent.minValue,
              sdResult: res.dataContent.sd,
              testCount: res.dataContent.testCount
            }
            this.secondTab.report.tableData = res.dataContent.items
          })
          .catch(err => {
            Message.error(err.message)
          })
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    },

    handleSecondTabTrendQuery () {
      if (this.secondTab.trend.form.searchDate === null) {
        Message.error('查询日期必须输入')
        return
      }
      this.querySecondTabTrendData(3, this.$refs.chartTrend3, 4)
      this.querySecondTabTrendData(7, this.$refs.chartTrend7, 7)
      this.querySecondTabTrendData(14, this.$refs.chartTrend14, 14)
    },

    querySecondTabTrendData (days, myRef, splitNumber) {
      var m = moment(this.secondTab.trend.form.searchDate)
      var ended = m.add(1, 'd').format('YYYY-MM-DD')
      var started = m.subtract(days, 'day').format('YYYY-MM-DD')
      bloodGlucoseTrend(this.id, this.secondTab.trend.form.period, started, ended)
        .then(res => {
          this.drawSecondTabTrend(
            res.dataContent,
            myRef,
            started,
            ended,
            splitNumber
          )
        })
        .catch(err => {
          Message.error(err.message)
          console.log(err)
        })
    },

    drawSecondTabTrend (data, myRef, started, ended, splitNumber) {
      const myChartDay = this.$echarts.init(myRef)
      myChartDay.setOption({
        dataset: {
          // 提供一份数据。
          source: data
        },
        xAxis: [
          {
            type: 'time',
            axisTick: { show: true },
            axisLabel: {
              formatter: function (category) {
                return moment(category).format('MM-DD')
              }
            },
            splitNumber: splitNumber,
            min: started,
            max: ended
          }
        ],

        yAxis: [
          {
            type: 'value',
            gridIndex: 0,

            max: 35,
            min: 0,
            name: '单位：mmol/L',
            axisLine: { onZero: false },
            axisTick: { show: true },
            splitNumber: 5
          }
          // { type: 'value', gridIndex: 1 }
        ],
        series: [
          {
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            encode: { x: 'testTime', y: 'testValue' },
            markLine: {
              // 标线
              symbol: ['none', 'none'], // 去掉箭头
              emphasis: {
                // disabled: false,
                lineStyle: {
                  width: 1
                }
              },
              data: [
                {
                  silent: false, // 鼠标悬停事件  true没有，false有
                  lineStyle: {
                    // 警戒线的样式  ，虚实  颜色
                    type: 'dotted',
                    color: '#3398DB'
                  },
                  label: {
                    position: 'end',
                    formatter: '7'
                  },
                  name: '最低值',
                  yAxis: 7
                },
                {
                  name: '最高值',
                  lineStyle: {
                    // 警戒线的样式  ，虚实  颜色
                    type: 'dotted',
                    color: 'orange'
                  },
                  label: {
                    position: 'end',
                    formatter: '10.1'
                  },

                  yAxis: 10.1
                }
              ]
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',
          formatter: function (params) {
            let showHtm = ''
            if (params.componentType !== 'series') {
              return showHtm
            }

            const data = params.data
            const testTime = moment(data.testTime).format('HH:mm')
            const testValue = data.testValue
            const period = data.periodName
            // showHtm += '检测日期:' + testTime + '<BR>' + '检测时段:' + period + '<BR>检测结果:' + testValue + '<br>'
            showHtm = testTime + '&nbsp;&nbsp;' + testValue
            if (period !== null && period !== undefined && period !== '') {
              showHtm = showHtm + '(' + period + ')'
            }

            return showHtm
          }

          // axisPointer: {
          //   type: 'cross'
          // }
        }
      })
    },

    secondTabGraphQuery () {
      var end = ''
      var start = ''
      if (this.secondTab.graph.form.days === 0) {
        start = moment(this.patient.hospitalizedDate).format('YYYY-MM-DD HH:mm:ss')
        end = moment().format('YYYY-MM-DD HH:mm:ss')
      } else {
        if (this.secondTab.graph.form.searchDate === null) {
          Message.error('查询日期必须输入')
          return
        }
        var m = moment(this.secondTab.graph.form.searchDate)
        end = m.format('YYYY-MM-DD HH:mm:ss')

        start = m
          .subtract(this.secondTab.graph.form.days - 1, 'day')
          .format('YYYY-MM-DD HH:mm:ss')
      }

      var mm = moment()
      bloodGlucoseMap(this.id, start, end)
        .then(res => {
          console.log(res)
          this.secondTab.graph.form.beginDate = moment(start).format('YYYY-MM-DD')
          this.secondTab.graph.form.endDate = moment(end).format('YYYY-MM-DD')
          res.dataContent.forEach(element => {
            element.testTime = moment(element.testTime)
              .year(mm.get('year'))
              .month(mm.get('month'))
              .date(mm.get('date'))
              .format('YYYY-MM-DD HH:mm')
          })
          this.drawScatterGraph(res.dataContent)
        })
        .catch(err => {
          console.log(err)
        })
    },
    drawScatterGraph (data) {
      var m = moment()
      var min = m
        .hour(0)
        .minute(0)
        .second(0)
        .format('YYYY-MM-DD HH:mm:ss')
      var max = m
        .hour(24)
        .minute(0)
        .second(0)
        .format('YYYY-MM-DD HH:mm:ss')

      const chartGraph = this.$echarts.init(this.$refs.chartGraph)
      chartGraph.setOption({
        noDataLoadingOption: {
          text: '暂无数据',
          effect: 'bubble',
          effectOption: {
            effect: {
              n: 0
            }
          }
        },
        dataset: {
          // 提供一份数据。
          source: data
        },
        xAxis: {
          type: 'time',
          min: new Date(min),
          max: new Date(max),
          splitNumber: 12,

          // data: [
          //   '00:00', '20:00'

          // ]
          axisTick: { show: true },
          axisLabel: {
            formatter: function (category) {
              return moment(category).format('HH:mm')
            }
          }
        },

        yAxis: {
          type: 'value',
          gridIndex: 0,

          max: 35,
          min: 0,

          name: '单位：mmol/L',
          axisLine: { onZero: false },
          axisTick: { show: true }
        }, // { type: 'value', gridIndex: 1 }

        series: [
          {
            type: 'scatter',
            itemStyle: {
              color: '#3398DB'
            },
            // xAxisIndex: 0,
            // yAxisIndex: 0,
            encode: { x: 'testTime', y: 'testValue' },
            markLine: {
              // 标线
              symbol: ['none', 'none'], // 去掉箭头
              emphasis: {
                // disabled: false,
                lineStyle: {
                  width: 1
                }
              },
              // itemStyle: {

              //   // normal: {
              //   //   lineStyle: { // 全局的样式
              //   //     // type: 'solid',
              //   //     type: 'dotted',
              //   //     width: 1
              //   //   },
              //   //   label: { show: false, position: 'left' }
              //   // }
              // },
              // label: {
              //   show: true
              // },
              data: [
                {
                  silent: false, // 鼠标悬停事件  true没有，false有
                  lineStyle: {
                    // 警戒线的样式  ，虚实  颜色
                    type: 'dotted',
                    color: '#3398DB'
                  },
                  label: {
                    position: 'end',
                    formatter: '3.9'
                  },
                  name: '最低值',
                  title: 'asdfsad',
                  yAxis: 3.9
                },
                {
                  name: '最高值',
                  lineStyle: {
                    // 警戒线的样式  ，虚实  颜色
                    type: 'dotted',
                    color: 'orange'
                  },
                  label: {
                    position: 'end',
                    formatter: '10.1'
                  },

                  yAxis: 10.1
                }
              ]
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',

          formatter: function (params) {
            console.log(params)
            if (params.componentType === 'series') {
              let showHtm = ''

              const data = params.data
              const testTime = moment(data.testTime).format('HH:mm')
              const testValue = data.testValue
              const period = data.periodName
              // showHtm += '检测日期:' + testTime + '<BR>' + '检测时段:' + period + '<BR>检测结果:' + testValue + '<br>'
              showHtm = testTime + '&nbsp;&nbsp;' + testValue
              if (period !== null && period !== undefined && period !== '') {
                showHtm = showHtm + '(' + period + ')'
              }
              return showHtm
            }
          }
        }
      })
    },

    secondTabVarGLUQuery () {
      var end = ''
      var start = ''
      if (this.secondTab.varGlu.form.days === 0) {
        start = moment(this.patient.hospitalizedDate).format('YYYY-MM-DD')
        end = moment().format('YYYY-MM-DD')
      } else {
        if (
          this.secondTab.varGlu.form.searchDate === null || this.secondTab.varGlu.form.searchDate.length === 0) {
          Message.error('查询日期必须输入')
          return
        }
        var m = moment(this.secondTab.varGlu.form.searchDate)
        end = m.format('YYYY-MM-DD')
        start = m
          .subtract(this.secondTab.varGlu.form.days - 1, 'day')
          .format('YYYY-MM-DD')
      }

      bloodGlucoseFluctuation(this.id, start, end).then(res => {
        this.secondTab.varGlu.form.beginDate = start
        this.secondTab.varGlu.form.endDate = end
        this.drawVarGLU(
          this.$refs.chartPPGE,
          res.dataContent,
          start,
          end,
          this.secondTab.varGlu.form.days,
          'ppge',
          2.2
        )
        this.drawVarGLU(
          this.$refs.chartLAGE,
          res.dataContent,
          start,
          end,
          this.secondTab.varGlu.form.days,
          'lage',
          4.4
        )
        this.drawVarGLU(
          this.$refs.chartSDBG,
          res.dataContent,
          start,
          end,
          this.secondTab.varGlu.form.days,
          'sdbg',
          2.0
        )
      })
    },

    drawVarGLU (chartId, data, started, ended, splitNumber, column, line) {
      const myChartDay = this.$echarts.init(chartId)
      myChartDay.setOption({
        dataset: {
          // 提供一份数据。
          source: data
        },
        xAxis: [
          {
            type: 'time',
            axisTick: { show: true },
            axisLabel: {
              formatter: function (category) {
                return moment(category).format('MM-DD')
              }

            },
            splitNumber: splitNumber,
            min: started,
            max: ended
          }
          //  {
          //   type: 'time',
          //   axisTick: { show: true },
          //   axisLabel: {
          //     formatter: function (category) {
          //       return moment(category).format('MM-DD')
          //     }
          //   },
          //   splitNumber: splitNumber,
          //   min: started,
          //   max: ended
          // }
        ],
        yAxis: [
          {
            type: 'value',
            gridIndex: 0,

            // max: 35,
            max: function (value) {
              if (value.max < 5) { return 5 } else { return value.max + 1 }
            },
            min: 0,
            name: '单位：mmol/L'
            // axisLine: { onZero: false },
            // axisTick: { show: true }
            // splitNumber: 5
          }
          // { type: 'value', gridIndex: 1 }
        ],
        series: [
          {
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            encode: { x: 'date', y: column },
            markLine: {
              // 标线
              symbol: ['none', 'none'], // 去掉箭头
              emphasis: {
                // disabled: false,
                lineStyle: {
                  width: 1
                }
              },
              // itemStyle: {

              //   // normal: {
              //   //   lineStyle: { // 全局的样式
              //   //     // type: 'solid',
              //   //     type: 'dotted',
              //   //     width: 1
              //   //   },
              //   //   label: { show: false, position: 'left' }
              //   // }
              // },
              // label: {
              //   show: true
              // },
              data: [
                {
                  silent: false, // 鼠标悬停事件  true没有，false有
                  lineStyle: {
                    // 警戒线的样式  ，虚实  颜色
                    type: 'dotted',
                    color: '#3398DB'
                  },
                  // label: {
                  //   position: 'end',
                  //   formatter: '7'
                  // },
                  // name: '最低值',
                  yAxis: line
                }
              ]
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',
          formatter: function (params) {
            let showHtm = ''
            if (params.componentType !== 'series') {
              return showHtm
            }
            const data = params.data
            // const testTime = moment(data.testTime).format('HH:MM')
            // const testValue = data.testValue
            // const period = data.periodName
            // showHtm += '检测日期:' + testTime + '<BR>' + '检测时段:' + period + '<BR>检测结果:' + testValue + '<br>'
            // showHtm = testTime + '&nbsp;&nbsp;' + testValue + '(' + period + ')'
            showHtm = data[column]
            return showHtm
          }
        }
      })
    },

    secodeTabRangeSave () {
      for (let i = 0; i < this.ranges.length; i++) {
        const item = this.ranges[i]
        if (item.minValue > 0 && item.maxValue > 0) {
          if (item.minValue >= item.maxValue) {
            const message = item.periodName + '最小值必须小于最大值,请检测后再保存'
            Message.error(message)
            return
          }
        } else {
          const errorMessage = item.periodName + '最小值和最大值都必须输入，并且大于0。请检查后再保存'
          Message.error(errorMessage)
          return
        }
      }
      this.secondTab.range.loading = true
      saveProfileRange({
        patientId: this.id,
        ranges: this.ranges
      }).then(res => {
        this.secondTab.range.loading = false
        Message.success('保存达标范围成功')
      }).catch(err => {
        this.secondTab.range.loading = false
        Message({
          message: err.message,
          type: 'error',
          duration: 5 * 1000
        })
      })
    },

    initThirdTabData () {
      this.thirdTab.form.patientId = this.id
      this.thirdTab.form.beginDate = moment().format('YYYY-MM-DD')
    },
    thirdTabHandleSizeChange (val) {
      this.thirdTab.form.size = val
      this.thirdTabQuery()
    },
    thirdTabHandleCurrentChange (val) {
      this.thirdTab.form.page = val
      this.thirdTabQuery()
    },
    thirdTabHandleNew () {
      this.clearThirdTabDialog()
      this.thirdTab.dialogForm.isView = false
      this.thirdTab.dialogForm.patientId = this.id
      this.thirdTab.dialogForm.beginDate = moment().format('YYYY-MM-DD')
      this.thirdTabDialogInit(this.thirdTab.dialogForm.adviceType)
      this.thirdTab.dialogVisible = true
    },
    thirdTabDialogCheckChanged (val) {
      this.thirdTab.dialogForm.contents = []
      if (!val) {
        if (this.thirdTab.dialogForm.adviceTemplate) {
          this.thirdTabDialogTemplateChanged(this.thirdTab.dialogForm.adviceTemplate)
        }
      }
    },

    thirdTabDialogInit (val) {
      this.queryTemplateList(val)
      if (val !== 'Temporary') {
        getPeriodOptions(val).then(res => {
          this.adviceTemplatePeriodOptions = res.dataContent
        })
      }
    },

    // 医嘱类型
    thirdTabDialogSelecteChanged (val) {
      this.thirdTab.dialogForm.contents = []
      this.thirdTab.dialogForm.tmpContents = []
      if (val !== 'Temporary') {
        this.thirdTabDialogInit(val)
      }
      this.thirdTab.dialogForm.isCustomer = false
    },
    thirdTabDialogTestSelecteChanged (val) {
      // this.thirdTabDialogInit(val)

      if (val !== 'GLU') {
        this.thirdTab.dialogForm.adviceType = 'Temporary'
      }
    },

    thirdTabDialogTemplateChanged (val) {
      this.thirdTab.dialogForm.templateId = val.id
      this.thirdTab.dialogForm.contents = []
      if (this.thirdTab.dialogForm.adviceType === 'LongStandards') {
        val.contents.forEach(k => {
          this.thirdTab.dialogForm.contents.push(k.code)
        })
      }
    },

    // Temporary
    thirdTabDialogPlusClick () {
      this.thirdTab.dialogForm.index++
      this.thirdTab.dialogForm.tmpContents.push({
        key: this.thirdTab.dialogForm.index,
        data: ''
      })
    },
    thirdTabDialogRemoveClick (index) {
      for (let i = 0; i < this.thirdTab.dialogForm.tmpContents.length; i++) {
        if (this.thirdTab.dialogForm.tmpContents[i].key === index) {
          this.thirdTab.dialogForm.tmpContents.splice(i)
          break
        }
      }
    },
    thirdTabHandleChangeTmpAdvice (val) {
      this.thirdTab.dialogForm.contents = []
      this.thirdTab.dialogForm.contents.push(val)
    },

    thirdHandleViewAdvice (row) {
      this.thirdTab.dialogVisible = true
      this.thirdTab.dialogForm.isView = true
      this.thirdTab.dialogForm.patientId = row.patientId
      this.thirdTab.dialogForm.name = row.name
      this.thirdTab.dialogForm.adviceType = row.adviceType
      this.thirdTab.dialogForm.category = row.category
      this.thirdTab.dialogForm.isCustomer = row.isCustomer
      this.thirdTab.dialogForm.beginDate = row.beginDate
      this.thirdTab.dialogForm.endDate = row.endDate
      this.thirdTab.dialogForm.contents = row.contents
      this.thirdTab.dialogForm.tmpContents = row.contents
    },

    thirdHandleStopAdvice (row) {
      this.$confirm('此操作将停止这个医嘱, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        suspendPatientAdvice(row.id).then(res => {
          Message.success('停止医嘱成功')
          this.thirdTabQuery()
        }).catch(err => {
          console.log(err)
          Message.error(err.message)
        })
      })
    },

    clearThirdTabDialog () {
      this.thirdTab.dialogForm = {
        patientId: 0,
        name: '',
        isCustomer: false,
        templateId: 0,
        adviceTemplate: {},
        adviceType: 'LongStandards',
        category: 'GLU',
        contents: [],
        beginDate: '',
        endDate: '',
        remark: '',
        tmpContents: [],
        index: 0

      }
    },
    async vueThirdPrint () {
      const url = this.$baseConfig.reportServiceUrl + '/report/advicereport' +
        '?PatientId=' + this.id +
        '&Category=' + this.thirdTab.form.category +
        '&AdviceName=' + this.thirdTab.form.adviceName +
        '&token=' + this.token
      window.open(url, '_blank')
    },

    thirdTabQuery () {
      this.thirdTab.loading = true
      // this.thirdTab.form.page = 1
      getPatientAdviceList(this.thirdTab.form).then(res => {
        this.thirdTab.tableData = res.dataContent.records
        this.thirdTab.total = res.dataContent.total
        this.thirdTab.loading = false
      }).catch(err => {
        console.log(err)
        this.thirdTab.loading = false
      })
    },
    closedThirdTabDialog () {
      this.$refs.dialogForm.resetFields()
      this.thirdTab.dialogVisible = false
    },
    thirdTabDialogHandleSave () {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          // if (!this.thirdTab.dialogForm.isCustomer) {
          //   this.thirdTab.dialogForm.templateId = this.thirdTab.dialogForm.adviceType.templateId
          // }
          if (this.thirdTab.dialogForm.adviceType === 'Temporary') {
            this.thirdTab.dialogForm.tmpContents.forEach(k => {
              if (k.data !== '') {
                this.thirdTab.dialogForm.contents.push(k.data)
              }
            })
          }

          createPatientAdvice(this.thirdTab.dialogForm).then(res => {
            Message.success('保存医嘱成功')
            this.thirdTab.dialogVisible = false
            this.clearThirdTabDialog()
            this.thirdTabQuery()
          }).catch(err => {
            console.log(err)
            Message.error(err.message)
          })
        } else {
          // Message.error('数据格式错误，无法提交')
          console.log('数据格式错误')
          console.log(this.thirdTab.dialogForm)
        }
      })
    },

    initKetData () {
      this.ket.ketData.form.beginDate = moment(this.patient.hospitalizedDate).format('YYYY-MM-DD') // moment().subtract(30, 'd').format('YYYY-MM-DD')
      this.ket.ketData.form.endDate = moment().format('YYYY-MM-DD')
      this.ket.ketTrend.form.beginDate = moment(this.patient.hospitalizedDate).format('YYYY-MM-DD') // moment().subtract(30, 'd').format('YYYY-MM-DD')
      this.ket.ketTrend.form.endDate = moment().add(1, 'd').format('YYYY-MM-DD')
      this.ket.ketTrend.form.patientId = this.id
    },
    ketDataQuery () {
      // if (!this.checkFormDate(this.ket.ketData.form)) {
      //   return
      // }
      this.ket.ketData.tableData = []
      if (this.isValidDateArea(this.ket.ketData.form)) {
        // this.ket.ketData.form.page = 1
        queryTestDataByPatient(this.id, this.ket.ketData.form).then(res => {
          this.ket.ketData.tableData = res.dataContent.records
          this.ket.ketData.total = res.dataContent.total
        }).catch(err => {
          console.log(err)
          Message.error(err.message)
        })
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    },
    async vueKetPrint () {
      if (!this.checkFormDate(this.ket.ketData.form)) {
        return
      }
      if (this.isValidDateArea(this.ket.ketData.form)) {
        this.ket.ketData.buttonLoading = true
        const url = this.$baseConfig.reportServiceUrl + '/report/recordreport' +
        '?patientId=' + this.id +
        '&Category=KET ' +
        '&begin=' + this.ket.ketData.form.beginDate +
        '&end=' + this.ket.ketData.form.endDate +
        '&token=' + this.token
        window.open(url, '_blank')
        this.ket.ketData.buttonLoading = false
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    },

    async gluKetTrendHandle () {
      if (!this.checkFormDate(this.ket.ketTrend.form)) {
        return
      }
      if (this.isValidDateArea(this.ket.ketTrend.form)) {
        const url = this.$baseConfig.reportServiceUrl + '/areport/TestTrendReport' +
        '?patientId=' + this.id +
        '&Category=KET ' +
        '&begin=' + this.ket.ketTrend.form.beginDate +
        '&end=' + this.ket.ketTrend.form.endDate +
        '&token=' + this.token
        window.open(url, '_blank')
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    },

    ketTabHandleClick (e) {
      if (e.name === 'ketData') {
        this.ketDataQuery()
      }
      if (e.name === 'ketTrend') {
        this.ketTrendQuery()
      }
    },
    ketDataTabHandleSizeChange (val) {
      this.ket.ketData.form.size = val
      this.ketDataQuery()
    },
    ketDataTabHandleCurrentChange (val) {
      this.ket.ketData.form.page = val
      this.ketDataQuery()
    },
    ketDataTabInputChanged (val) {
      this.ket.ketData.resultForm.result = val

      this.$refs.ketDataResultForm.clearValidate()
    },
    ketDataSelResultChanged (val) {
      this.ket.ketData.resultForm.result = val

      this.$refs.ketDataResultForm.clearValidate()
    },
    ketDataTabSelRejectChanged (val) {
      this.ket.ketData.resultForm.result = val

      this.$refs.ketDataResultForm.clearValidate()
    },
    handleNewKetData () {
      this.clearKetData()
      this.ket.ketData.resultForm.patientName = this.patient.patientName
      this.ket.ketData.resultForm.testTime = moment().format('yyyy-MM-DD HH:mm:ss')
      this.ket.ketData.dialogVisible = true
    },
    closedKetDialog () {
      this.$refs.ketDataResultForm.resetFields()
      this.ket.ketData.dialogVisible = false
    },
    clearKetData () {
      this.ket.ketData.resultForm = {
        category: 'KET',
        patientId: 0,
        period: '',
        remark: '',
        result: 0,
        testTime: '',
        unenforced: false,
        selType: true,
        normalValue: 0,
        textValue: '',
        rejectReason: '',
        cause: ''
      }
    },
    ketDataTabHandleUpdateData () {
      if (this.ket.ketData.resultForm.unenforced) {
        // 判断验证信息
        if (this.ket.ketData.resultForm.rejectReason === null || this.ket.ketData.resultForm.rejectReason === '') {
          this.ket.ketData.resultForm.result = ''
        }
      } else if (!this.ket.ketData.resultForm.selType) {
        // 判断验证信息
        if (this.ket.ketData.resultForm.textValue === null || this.ket.ketData.resultForm.textValue === '') {
          this.ket.ketData.resultForm.result = ''
        }
      } else {
        console.log('验证信息')
      }
      this.$refs.ketDataResultForm.validate(valid => {
        if (valid) {
          let value
          let casey
          if (this.ket.ketData.resultForm.unenforced) {
            value = this.ket.ketData.resultForm.rejectReason
            casey = this.ket.ketData.resultForm.case
          } else if (this.ket.ketData.resultForm.selType) {
            value = (this.ket.ketData.resultForm.normalValue * 10 / 10).toFixed(1)
            casey = ''
          } else {
            value = this.ket.ketData.resultForm.textValue
            casey = ''
          }
          const a = {
            category: 'KET',
            patientId: this.id,
            // period: this.ket.ketData.resultForm.period,
            remark: this.ket.ketData.resultForm.remark,
            testTime: this.ket.ketData.resultForm.testTime,
            result: value,
            unenforced: this.ket.ketData.resultForm.unenforced,
            cause: casey
          }
          createTestResult(a).then(res => {
            this.ketDataQuery()
            Message.success('新增血酮记录成功')
            this.ket.ketData.dialogVisible = false
            this.clearKetData()
          }).catch(err => {
            Message.error('新增血酮记录失败:' + err.message)
          })
        }
      })
    },
    ketTrendQuery () {
      if (!this.checkFormDate(this.ket.ketTrend.form)) {
        return
      }
      if (this.isValidDateArea(this.ket.ketTrend.form)) {
        dataTrend(this.ket.ketTrend.form).then(res => {
          console.log(res)
          this.drawKetChart(res.dataContent)
        })
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    },
    drawKetChart (data) {
      const myChart = this.$echarts.init(this.$refs.ketChart)
      myChart.setOption({
        title: {
          text: '血酮趋势图',
          left: 'center'
        },
        legend: {},

        dataset: {
          // 提供一份数据。
          source: data
        },
        xAxis: [
          {
            type: 'time',
            axisTick: { show: true },
            axisLabel: {
              formatter: function (category) {
                return moment(category).format('MM-DD')
              }
            },
            min: this.ket.ketTrend.form.beginDate,
            max: this.ket.ketTrend.form.endDate
          }
        ],
        yAxis: [
          {
            type: 'value',
            gridIndex: 0,
            name: '单位：mmol/L',
            max: function (value) {
              return value.max + 5
            },
            min: 0
          }
        ],
        series: [
          {
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            encode: { x: 'testTime', y: 'testValue' }
          }
        ],
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',
          formatter: function (params) {
            let showHtm = ''
            if (params.componentType !== 'series') {
              return showHtm
            }
            const data = params.data
            const testTime = moment(data.testTime).format('MM-DD HH:mm')
            const testValue = data.testValue
            // const period = data.periodName
            showHtm = testTime + '&nbsp;&nbsp;' + testValue
            return showHtm
          }
        }
      })
    },
    initUaData () {
      this.ua.uaData.form.beginDate = moment(this.patient.hospitalizedDate).format('YYYY-MM-DD') // moment().subtract(30, 'd').format('YYYY-MM-DD')
      this.ua.uaData.form.endDate = moment().format('YYYY-MM-DD')
      this.ua.uaTrend.form.beginDate = moment(this.patient.hospitalizedDate).format('YYYY-MM-DD') // moment().subtract(30, 'd').format('YYYY-MM-DD')
      this.ua.uaTrend.form.endDate = moment().format('YYYY-MM-DD')
      this.ua.uaTrend.form.patientId = this.id
    },
    async vueUaPrint () {
      if (!this.checkFormDate(this.ua.uaData.form)) {
        return
      }
      if (this.isValidDateArea(this.ua.uaData.form)) {
        this.ua.uaData.buttonLoading = true
        const url = this.$baseConfig.reportServiceUrl + '/report/recordreport' +
        '?patientId=' + this.id +
        '&Category=UA ' +
        '&begin=' + this.ua.uaData.form.beginDate +
        '&end=' + this.ua.uaData.form.endDate +
        '&token=' + this.token
        window.open(url, '_blank')
        this.ua.uaData.buttonLoading = false
      }
    },
    async uaTrendPrintHandle () {
      if (!this.checkFormDate(this.ua.uaTrend.form)) {
        return
      }
      if (this.isValidDateArea(this.ua.uaTrend.form)) {
        const url = this.$baseConfig.reportServiceUrl + '/areport/TestTrendReport' +
        '?patientId=' + this.id +
        '&Category=UA ' +
        '&begin=' + this.ua.uaTrend.form.beginDate +
        '&end=' + this.ua.uaTrend.form.endDate +
        '&token=' + this.token
        window.open(url, '_blank')
      }
    },

    uaDataQuery () {
      // if (!this.checkFormDate(this.ua.uaData.form)) {
      //   return
      // }
      this.ua.uaData.tableData = []
      if (this.isValidDateArea(this.ua.uaData.form)) {
        // this.ua.uaData.form.page = 1
        queryTestDataByPatient(this.id, this.ua.uaData.form).then(res => {
          this.ua.uaData.tableData = res.dataContent.records
          this.ua.uaData.total = res.dataContent.total
        }).catch(err => {
          console.log(err)
          Message.error(err.message)
        })
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    },
    uaDataTabHandleSizeChange (val) {
      this.ua.uaData.form.size = val
      this.uaDataQuery()
    },
    uaDataTabHandleCurrentChange (val) {
      this.ua.uaData.form.page = val
      this.uaDataQuery()
    },
    uaDataTabInputChanged (val) {
      this.ua.uaData.resultForm.result = val

      this.$refs.uaDataResultForm.clearValidate()
    },
    uaDataSelResultChanged (val) {
      this.ua.uaData.resultForm.result = val

      this.$refs.uaDataResultForm.clearValidate()
    },
    uaDataTabSelRejectChanged (val) {
      this.ua.uaData.resultForm.result = val

      this.$refs.uaDataResultForm.clearValidate()
    },
    clearUAData () {
      this.ua.uaData.resultForm = {
        category: 'UA',
        patientId: 0,
        period: '',
        remark: '',
        result: 179,
        testTime: '',
        unenforced: false,
        selType: true,
        normalValue: 179,
        textValue: '',
        rejectReason: '',
        cause: ''

      }
    },
    handleNewUaData () {
      this.clearUAData()
      this.ua.uaData.resultForm.patientName = this.patient.patientName
      this.ua.uaData.resultForm.testTime = moment().format('yyyy-MM-DD HH:mm:ss')
      this.ua.uaData.dialogVisible = true
    },
    closedUaDialog () {
      this.$refs.uaDataResultForm.resetFields()
      this.ua.uaData.dialogVisible = false
    },
    uaDataTabHandleUpdateData () {
      if (this.ua.uaData.resultForm.unenforced) {
        // 判断验证信息
        if (this.ua.uaData.resultForm.rejectReason === null || this.ua.uaData.resultForm.rejectReason === '') {
          this.ua.uaData.resultForm.result = ''
        }
      } else if (!this.ua.uaData.resultForm.selType) {
        // 判断验证信息
        if (this.ua.uaData.resultForm.textValue === null || this.ua.uaData.resultForm.textValue === '') {
          this.ua.uaData.resultForm.result = ''
        }
      } else {
        console.log('验证信息')
      }
      this.$refs.uaDataResultForm.validate(valid => {
        if (valid) {
          let value
          let casey
          if (this.ua.uaData.resultForm.unenforced) {
            value = this.ua.uaData.resultForm.rejectReason
            casey = this.ua.uaData.resultForm.case
          } else if (this.ua.uaData.resultForm.selType) {
            value = this.ua.uaData.resultForm.normalValue
            casey = ''
          } else {
            value = this.ua.uaData.resultForm.textValue
            casey = ''
          }
          const data = {
            category: 'UA',
            patientId: this.id,
            // period: this.ket.ketData.resultForm.period,
            remark: this.ua.uaData.resultForm.remark,
            testTime: this.ua.uaData.resultForm.testTime,
            result: value,
            unenforced: this.ua.uaData.resultForm.unenforced,
            cause: casey
          }
          createTestResult(data).then(res => {
            this.uaDataQuery()
            Message.success('新增尿酸记录成功')
            this.ua.uaData.dialogVisible = false
            this.clearUAData()
          }).catch(err => {
            Message.error('新增尿酸记录失败:' + err.message)
          })
        }
      })
    },
    uaTrendQuery () {
      if (!this.checkFormDate(this.ua.uaTrend.form)) {
        return
      }
      if (this.isValidDateArea(this.ua.uaTrend.form)) {
        dataTrend(this.ua.uaTrend.form).then(res => {
          this.drawUaChart(res.dataContent)
        }).catch(err => {
          console.log(err)
          Message.error(err.message)
        })
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    },
    drawUaChart (data) {
      const myChart = this.$echarts.init(this.$refs.uaChart)

      myChart.setOption({

        title: {
          // show: Object.keys(data).length === 0,

          // extStyle: {
          //   color: 'grey',

          //   fontSize: 20

          // },

          text: '尿酸趋势图',
          left: 'center'
          // top: 'center'

        },
        legend: {},

        dataset: {
          // 提供一份数据。
          source: data
        },

        xAxis: [
          {
            type: 'time',
            axisTick: { show: true },
            axisLabel: {
              formatter: function (category) {
                return moment(category).format('MM-DD')
              }
            },

            min: this.ua.uaTrend.form.beginDate,
            max: this.ua.uaTrend.form.endDate
          }
        ],

        yAxis: [
          {
            type: 'value',
            gridIndex: 0,
            name: '单位：μmol/L',

            max: value => {
              return value.max + 10
            },
            min: 0,

            axisLine: { onZero: false },
            axisTick: { show: true }

          }
          // { type: 'value', gridIndex: 1 }
        ],

        series: [
          {
            type: 'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            encode: { x: 'testTime', y: 'testValue' }

          }
        ],
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',

          formatter: function (params) {
            let showHtm = ''
            if (params.componentType !== 'series') {
              return showHtm
            }

            const data = params.data
            const testTime = moment(data.testTime).format('MM-DD HH:mm')
            const testValue = data.testValue
            // const period = data.periodName

            showHtm = testTime + '&nbsp;&nbsp;' + testValue

            return showHtm
          }
        }
      })
    },
    uaTabHandleClick (e) {
      if (e.name === 'uaData') {
        this.uaDataQuery()
      }
      if (e.name === 'uaTrend') {
        this.uaTrendQuery()
      }
    },

    searchConsultation () {
      this.consultation.tableData = []
      if (this.isValidDateArea(this.consultation.conditionForm)) {
        this.consultation.loading = true
        this.consultation.tableData = []
        this.consultation.conditionForm.patientId = this.id
        queryPatientConsultation(this.consultation.conditionForm).then(res => {
          this.consultation.tableData = res.dataContent.records
          this.consultation.conditionForm.total = res.dataContent.total
          this.consultation.loading = false
        }).catch(err => {
          console.log(err)
          this.consultation.loading = false
        })
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    },

    onSearchConsultation () {
      this.consultation.conditionForm.page = 1
      this.searchConsultation()
    },

    handleConsultation (row) {
      this.$router.push({ path: '/editor', query: { id: row.id, patientId: row.patientId, isClosed: row.isClosed } })
    },
    consultationHandleSizeChange (val) {
      this.consultation.conditionForm.size = val

      this.searchConsultation()
    },
    consultationHandleCurrentChange (val) {
      this.consultation.conditionForm.page = val
      this.searchConsultation()
    },
    initConsultationData () {
      this.consultation.conditionForm.beginDate = moment(this.patient.hospitalizedDate).format('YYYY-MM-DD')
      this.consultation.conditionForm.endDate = moment().format('YYYY-MM-DD')
    },

    drugInitData () {
      this.drug.form.patientId = this.id
      this.drug.drugForm.patientId = this.id
      getMedicationCategories().then(res => {
        this.drug.drugCategories = res.dataContent
        if (res.dataContent.length > 0) {
          this.drug.activeName = res.dataContent[0].code
          this.drug.queryConditionForm.categoryCode = res.dataContent[0].code
          this.drugOnSearchByCategory()
        }
      }).catch(err => {
        console.log(err.message)
      })
      getInsulinTimePeriodList().then(res => {
        this.drug.periodOptions = res.dataContent
      }).catch(err => {
        console.log(err.message)
      })
    },
    drugSearch () {
      this.drug.loading = true
      queryDrugAdvice(this.drug.form).then(res => {
        this.drug.loading = false
        this.drug.tableData = res.dataContent.records
        this.drug.form.total = res.dataContent.total
        this.drug.loading = false
      }).catch(err => {
        this.drug.loading = false
        console.log(err.message)
      })
    },
    drugSearchByCategory () {
      this.drug.drugTableDataLoading = true

      queryMedication(this.drug.queryConditionForm).then(res => {
        this.drug.drugTableData = res.dataContent.records
        this.drug.queryConditionForm.total = res.dataContent.total
        this.drug.drugTableDataLoading = false
      }).catch(err => {
        this.drug.drugTableDataLoading = false
        console.log(err.message)
      })
    },

    drugOnSearchByCategory () {
      this.drug.queryConditionForm.page = 1

      this.drugSearchByCategory()
    },
    drugOnSearch () {
      this.drug.form.page = 1
      this.drugSearch()
    },

    drugTabHandleClick (tab, event) {
      this.drug.queryConditionForm.categoryCode = tab.name
      this.drugOnSearchByCategory()
    },

    drugTableHandleSize (val) {
      this.drug.queryConditionForm.size = val
      this.drugSearchByCategory()
    },

    drugTableHandlePage (val) {
      this.drug.queryConditionForm.page = val
      this.drugSearchByCategory()
    },

    drugHandleCreate () {
      this.$refs.dialogDrugForm.validate(valid => {
        if (valid) {
          if (this.drug.drugForm.contents === null ||
            this.drug.drugForm.contents.length === 0) {
            Message.error('没有任何医嘱内容')
            return
          }
          const hasNullPeriod = this.drug.drugForm.contents.some((item, i) => {
            return item.periodCode === undefined || item.periodCode === null ||
              item.periodCode.length === 0
          })
          if (hasNullPeriod) {
            Message.error('必须为用药选择用药时段')
            return
          }
          let hasRepeatDrug = false
          this.drug.drugForm.contents.map((item, index) => {
            const sameIndex = this.drug.drugForm.contents.findIndex((other, num) =>
              index !== num && other.periodCode === item.periodCode && other.code === item.code
            )
            if (sameIndex !== -1) {
              hasRepeatDrug = true
            }
          })
          if (hasRepeatDrug === true) {
            Message.error('用药选择重复')
            return
          }
          const hasNullDosage = this.drug.drugForm.contents.some((item, i) => {
            return item.dosage === undefined || item.dosage === null || item.dosage === 0
          })
          if (hasNullDosage) {
            Message.error('用药数量不能为空')
            return
          }
          if (this.isValidDateArea(this.drug.drugForm)) {
            createDrugAdvice(this.drug.drugForm).then(res => {
              this.drug.drugForm.dialogVisible = false

              Message.success('新增用药医嘱成功')
              this.drugSearch()
            }).catch(err => {
              Message.error(err.message)
              console.log(err)
            })
          } else {
            Message.error('开始日期必须小于结束日期')
          }
        }
      })
    },

    drugHandleStop (row) {
      this.$confirm('此操作将停止这个用药医嘱, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stopDrugAdvice(row.id).then(res => {
          Message.success('停止用药医嘱成功')
          this.drugSearch()
        }).catch(err => {
          console.log(err)
          Message.error(err.message)
        })
      })
    },
    drugHandleCurrentChange (val) {
      this.form.page = val
      this.drugSearch()
    },
    drugHandleSizeChange (val) {
      this.form.size = val
      this.drugSearch()
    },
    durgHandleNew () {
      this.drugClearData()
      this.drug.drugForm.dialogVisible = true
      this.drug.drugForm.isView = false
    },
    drugHandleView (row) {
      this.drug.drugForm.isView = true
      this.drug.drugForm.name = row.name
      this.drug.drugForm.contents = []
      // hh
      row.contents.forEach((item, index) => {
        const data = JSON.parse(JSON.stringify(item))
        data.periodCode = item.period
        data.code = item.medicationCode
        data.name = item.medicationName
        this.drug.drugForm.contents.push(data)
      })
      this.drug.drugForm.remark = row.remark
      this.drug.drugForm.beginDate = row.beginDate
      this.drug.drugForm.endDate = row.endDate
      this.drug.drugForm.dialogVisible = true
    },
    selectDrugPeriodHandle () {
      console.log(this.drug.drugForm.contents)
    },
    drugHandleNewData () {
      const hasNullPeriod = this.drug.drugForm.contents.some((item, i) => {
        return item.periodCode === undefined || item.periodCode === null ||
              item.periodCode.length === 0
      })
      if (hasNullPeriod) {
        this.drug.drugForm.innerDialogVisible = false
        Message.error('必须为用药选择用药时段')
        return
      }

      this.drug.drugForm.innerDialogVisible = true
      this.drug.drugSelections = []

      this.$nextTick(() => {
        console.log(this.$refs.drugDialogTable)
        for (let i = 0; i < this.$refs.drugDialogTable.length; i++) {
          this.$refs.drugDialogTable[i].clearSelection()
        }
      })
    },
    closedDrugDialog () {
      this.$refs.dialogDrugForm.resetFields()
      this.drug.drugForm.dialogVisible = false
    },
    drugClearData () {
      this.drug.drugForm.name = ''

      this.drug.drugForm.contents = []
      this.drug.drugForm.remark = ''
      this.drug.drugForm.beginDate = moment().format('YYYY-MM-DD')
      this.drug.drugForm.endDate = null
    },

    dialogDrugHandleDelete (row) {
      for (let i = 0; i < this.drug.drugForm.contents.length; i++) {
        var item = this.drug.drugForm.contents[i]
        if (item.code === row.code) {
          this.drug.drugForm.contents.splice(i, 1)
          break
        }
      }
    },

    drugHandleTableSelectedAll (selection) {
      this.drug.drugSelections = selection
    },

    drugHandleTableSelectChanged (selection) {
      this.drug.drugSelections = selection
    },

    drugHandleDialogOk () {
      for (let i = 0; i < this.drug.drugSelections.length; i++) {
        var item = this.drug.drugSelections[i]

        // item.medicationCode = item.code
        var data = JSON.parse(JSON.stringify(item))
        data.medicationCode = data.code
        data.dosage = 1
        data.periodCode = null
        // const result = this.drug.drugForm.contents.find(k => k.code === item.code)
        // if (result === undefined) {
        //   this.drug.drugForm.contents.push(data)
        // }
        this.drug.drugForm.contents.push(data)
      }
      this.drug.drugForm.innerDialogVisible = false
    },

    // 修改 table cell边框的背景色
    tableCellStyle () {
      return 'border-color: #868686;'
    },
    // 修改 table header cell的背景色
    tableHeaderCellStyle () {
      return 'border-color: #868686; color: #606266;'
    }

  }
}
</script>

<style>
.el-container {
  margin: 5px;
}

.txt-col {
  font-size: 16px;
}

.tt {
  color: #70796f;
}

.divRoot {
  margin: 50px;
  font-size: 14px;
}

.el-row {
  margin-top: 15px;
}

.line {
  border-bottom: 1px solid #000;
  height: 50px;
  width: 800px;
}

.dotline {
  border-bottom: 1px dotted #000;
  height: 50px;
  width: 800px;
}
.High {
  color: red;
}
.Low {
  color: blue;
}

.form-item {
  width: 300px;
}

.small-form-item {
  width: 200px;
}

.edit-form-item {
  width: 400px;
}

.box {
  display: flex;
}
.content {
  width: 33%;
}
.unit {
  font-size: 4px;
}

.no-print {
  display: none;
}

.my-table-header {
  height: 5px;
}

@media print {
  .print-footer {
    position: fixed;
    bottom: 5px;
    right: 10px;
    display: block !important;
  }

  .print {
    display: block !important;
  }
}
</style>
