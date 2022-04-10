/* eslint-disable vue/require-v-for-key */
<template>

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
                placeholder="姓名/床号"
              />
            </el-form-item>
            <!-- 科室选择 -->
            <el-form-item label="科室:">
              <div style="width:200px;height:32px">
                <my-treeselect ref="selTree" :append-true="true" :mydata="deptOptions" :valuebb="departDefaultCodes" @changeSel="changeDepentSelHandle" @inputChanging="inoutDepentChangeHandle" />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="onSearch"
              >查询</el-button>
              <el-button
                v-loading="buttonLoading"
                type="primary"
                size="small"
                @click="vuePrint"
              >打印</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </el-card>
    <el-card>
      <section ref="print">
        <div
          id="printContent"
          ref="printTable"
          class="print-content"
        >
          <el-table
            ref="tt"
            v-loading="loading"
            :data="tableData"
            style="width:100%"
            class="vue-print-table"
            stripe
            border
            highlight-current-row
            :cell-style="{ padding:'5px 5px', height: '20px' }"
            :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
            :span-method="objectSpanMethod"
          >
            <el-table-column
              prop="bed"
              min-width="70"
              align="center"
              label="床号"
            />
            <el-table-column
              prop="patientName"
              align="center"
              label="姓名"
              min-width="80"
            />
            <el-table-column
              prop="doctorName"
              min-width="100"
              align="center"
              label="住院医生"
            />
            <el-table-column
              prop="hospitalizedDate"
              align="center"
              min-width="100"
              label="检测日期"
            />
            <el-table-column
              label="凌晨"
              align="center"
              min-width="70"
              width="'10%'"
            >
              <template slot-scope="scope">
                <span v-if="scope.$index % 2 === 0">
                  <div v-if="scope.row.taskPeriods !== null && scope.row.taskPeriods.length > 0">
                    <span v-if="scope.row.taskPeriods[0].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </span>
                <div v-else style="text-align: left;">
                  <div v-if="scope.row.taskTimes !== null && scope.row.taskTimes.length > 0">
                    <span v-for="item in scope.row.taskTimes" :key="item.name">
                      {{ item.name }} &nbsp;&nbsp;
                    </span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="空腹"
              align="center"
              min-width="70"
              width="'10%'"
            >
              <template slot-scope="scope">
                <span v-if="scope.$index % 2 === 0">
                  <div v-if="scope.row.taskPeriods !== null && scope.row.taskPeriods.length > 0">
                    <span v-if="scope.row.taskPeriods[1].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </span>
                <!-- <div v-else style="text-align: left;">
                  <div v-if="scope.row.taskTimes !== null && scope.row.taskTimes.length > 0">
                    <span v-for="item in scope.row.taskTimes" :key="item.name">
                      {{ item.name }} &nbsp;&nbsp;
                    </span>
                  </div>
                </div> -->
              </template>
            </el-table-column>
            <el-table-column
              label="早餐后"
              align="center"
              min-width="70"
              width="'10%'"
            >
              <template slot-scope="scope">
                <span v-if="scope.$index % 2 === 0">
                  <div v-if="scope.row.taskPeriods !== null && scope.row.taskPeriods.length > 0">
                    <span v-if="scope.row.taskPeriods[2].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </span>
                <!-- <div v-else style="text-align: left;">
                  <div v-if="scope.row.taskTimes !== null && scope.row.taskTimes.length > 0">
                    <span v-for="item in scope.row.taskTimes" :key="item.name">
                      {{ item.name }} &nbsp;&nbsp;
                    </span>
                  </div>
                </div> -->
              </template>
            </el-table-column>
            <el-table-column
              label="午餐前"
              align="center"
              min-width="70"
              width="'10%'"
            >
              <template slot-scope="scope">
                <span v-if="scope.$index % 2 === 0">
                  <div v-if="scope.row.taskPeriods !== null && scope.row.taskPeriods.length > 0">
                    <span v-if="scope.row.taskPeriods[3].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </span>
                <!-- <div v-else style="text-align: left;">
                  <div v-if="scope.row.taskTimes !== null && scope.row.taskTimes.length > 0">
                    <span v-for="item in scope.row.taskTimes" :key="item.name">
                      {{ item.name }} &nbsp;&nbsp;
                    </span>
                  </div>
                </div> -->
              </template>
            </el-table-column>
            <el-table-column
              label="午餐后"
              align="center"
              min-width="70"
              width="'10%'"
            >
              <template slot-scope="scope">
                <span v-if="scope.$index % 2 === 0">
                  <div v-if="scope.row.taskPeriods !== null && scope.row.taskPeriods.length > 0">
                    <span v-if="scope.row.taskPeriods[4].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </span>
                <!-- <div v-else style="text-align: left;">
                  <div v-if="scope.row.taskTimes !== null && scope.row.taskTimes.length > 0">
                    <span v-for="item in scope.row.taskTimes" :key="item.name">
                      {{ item.name }} &nbsp;&nbsp;
                    </span>
                  </div>
                </div> -->
              </template>
            </el-table-column>
            <el-table-column
              label="晚餐前"
              align="center"
              min-width="70"
              width="'10%'"
            >
              <template slot-scope="scope">
                <span v-if="scope.$index % 2 === 0">
                  <div v-if="scope.row.taskPeriods !== null && scope.row.taskPeriods.length > 0">
                    <span v-if="scope.row.taskPeriods[5].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </span>
                <!-- <div v-else style="text-align: left;">
                  <div v-if="scope.row.taskTimes !== null && scope.row.taskTimes.length > 0">
                    <span v-for="item in scope.row.taskTimes" :key="item.name">
                      {{ item.name }} &nbsp;&nbsp;
                    </span>
                  </div>
                </div> -->
              </template>
            </el-table-column>
            <el-table-column
              label="晚餐后"
              align="center"
              min-width="70"
              width="'10%'"
            >
              <template slot-scope="scope">
                <span v-if="scope.$index % 2 === 0">
                  <div v-if="scope.row.taskPeriods !== null && scope.row.taskPeriods.length > 0">
                    <span v-if="scope.row.taskPeriods[6].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </span>
                <!-- <div v-else style="text-align: left;">
                  <div v-if="scope.row.taskTimes !== null && scope.row.taskTimes.length > 0">
                    <span v-for="item in scope.row.taskTimes" :key="item.name">
                      {{ item.name }} &nbsp;&nbsp;
                    </span>
                  </div>
                </div> -->
              </template>
            </el-table-column>
            <el-table-column
              label="睡前"
              align="center"
              min-width="70"
              width="'10%'"
            >
              <template slot-scope="scope">
                <span v-if="scope.$index % 2 === 0">
                  <div v-if="scope.row.taskPeriods !== null && scope.row.taskPeriods.length > 0">
                    <span v-if="scope.row.taskPeriods[7].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </span>
                <!-- <div v-else style="text-align: left;">
                  <div v-if="scope.row.taskTimes !== null && scope.row.taskTimes.length > 0">
                    <span v-for="item in scope.row.taskTimes" :key="item.name">
                      {{ item.name }} &nbsp;&nbsp;
                    </span>
                  </div>
                </div> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
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
    <div>
      <div
        id="printContent"
        ref="printContent"
        style="margin:5px;display:none"
      >
        <div class="print-header-content">
          <el-row>
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="12">
              <div style="text-align:center;font-size:16pt">
                <div>{{ organizationName }}</div>
                <div style="margin:5px">今日任务</div>
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
            <table class="table" style="width: 100%">
              <tr>
                <th>床号</th>
                <th>姓名</th>
                <th style="width: 130px">住院医生</th>
                <th style="width: 130px">日期</th>
                <th>凌晨</th>
                <th>空腹</th>
                <th>早餐后</th>
                <th>午餐前</th>
                <th>午餐后</th>
                <th>晚餐前</th>
                <th>晚餐后</th>
                <th>睡前</th>
              </tr>
              <tr v-for="(item,index) in table" :key="index">
                <td v-if="index %2 === 0" rowspan="2">{{ item.bed }}</td>
                <!-- <td v-else>{{ item.bed }}</td> -->
                <td v-if="index %2 === 0" rowspan="2">{{ item.patientName }}</td>
                <!-- <td v-else>{{ item.patientName }}</td> -->
                <td v-if="index %2 === 0" rowspan="2">{{ item.doctorName }}</td>
                <!-- <td v-else>{{ item.doctorName }}</td> -->
                <td v-if="index %2 === 0" rowspan="2">{{ item.hospitalizedDate }}</td>
                <!-- <td v-else>{{ item.hospitalizedDate }}</td> -->
                <td v-if="index %2 === 0">
                  <div v-if="item.taskPeriods !== null && item.taskPeriods.length > 0">
                    <span v-if="item.taskPeriods[0].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </td>
                <td v-else colspan="8">
                  <div v-if="item.taskTimes !== null && item.taskTimes.length > 0" style="text-align:left">
                    <span v-for="itemee in item.taskTimes" :key="itemee.name">
                      &nbsp;&nbsp; {{ itemee.name }} &nbsp;&nbsp;
                    </span>
                  </div>
                </td>
                <td v-if="index %2 === 0">
                  <div v-if="item.taskPeriods !== null && item.taskPeriods.length > 0">
                    <span v-if="item.taskPeriods[1].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </td>
                <td v-if="index %2 === 0">
                  <div v-if="item.taskPeriods !== null && item.taskPeriods.length > 0">
                    <span v-if="item.taskPeriods[2].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </td>
                <td v-if="index %2 === 0">
                  <div v-if="item.taskPeriods !== null && item.taskPeriods.length > 0">
                    <span v-if="item.taskPeriods[3].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </td>
                <td v-if="index %2 === 0">
                  <div v-if="item.taskPeriods !== null && item.taskPeriods.length > 0">
                    <span v-if="item.taskPeriods[4].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </td>
                <td v-if="index %2 === 0">
                  <div v-if="item.taskPeriods !== null && item.taskPeriods.length > 0">
                    <span v-if="item.taskPeriods[5].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </td>
                <td v-if="index %2 === 0">
                  <div v-if="item.taskPeriods !== null && item.taskPeriods.length > 0">
                    <span v-if="item.taskPeriods[6].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </td>
                <td v-if="index %2 === 0">
                  <div v-if="item.taskPeriods !== null && item.taskPeriods.length > 0">
                    <span v-if="item.taskPeriods[7].enable" />
                    <span v-else>
                      - &nbsp;&nbsp;
                    </span>
                  </div>
                </td>
              </tr>
            </table>
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
    <!-- <div>
      <div
        id="printContent"
        ref="printContent"
        style="margin:5px;display:none"
      >
        <div class="print-header-content">
          <el-row>
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="12">
              <div style="text-align:center;font-size:16pt">
                <div>{{ organizationName }}</div>
                <div style="margin:5px">今日任务</div>
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
                <div class="table-td">床号</div>
                <div class="table-td">姓名</div>
                <div class="table-td">住院医生</div>
                <div class="table-td-lg">日期</div>
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
                <div class="table-td"> {{ item.bed }}</div>
                <div class="table-td"> {{ item.patientName }}</div>
                <div class="table-td"> {{ item.doctorName }}</div>
                <div class="table-td"> {{ item.hospitalizedDate }}</div>
                <div class="table-td" style="padding: 0px; border-left-style: none;border-right-style: none">
                  <div style="height: 50%;width:80px">
                    <span v-if="item.taskPeriods[0].enable" />
                    <span v-else> - </span>
                  </div>
                  <div
                    style="display: table-cell;line-height: 1px;border: 1px solid gray;width: 80px;"
                  />
                  <div style="height: 50%;width:80px">
                    <span> - </span>

                  </div>
                </div>
                <div class="table-td" style="padding: 0px; border-left-style: none;border-right-style: none">
                  <span v-if="item.taskPeriods[1].enable" />
                  <span v-else> - </span>
                  <div
                    style="display: table-cell;line-height: 20px;border: 1px solid gray;width: 80px;"
                  />
                  <span> - </span>
                </div>
                <div class="table-td" style="padding: 0px; border-left-style: none;border-right-style: none">
                  <span v-if="item.taskPeriods[2].enable" />
                  <span v-else> - </span>
                </div>
                <div class="table-td" style="padding: 0px; border-left-style: none;border-right-style: none">
                  <span v-if="item.taskPeriods[3].enable" />
                  <span v-else> - </span>
                  <div
                    style="display: table-cell;line-height: 20px;border: 1px solid gray;width: 80px;"
                  />
                  <span> - </span>
                </div>
                <div class="table-td" style="padding: 0px; border-left-style: none;border-right-style: none">
                  <span v-if="item.taskPeriods[4].enable" />
                  <span v-else> - </span>
                  <div
                    style="display: table-cell;line-height: 20px;border: 1px solid gray;width: 80px;"
                  />
                  <span> - </span>
                </div>
                <div class="table-td" style="padding: 0px; border-left-style: none;border-right-style: none">
                  <span v-if="item.taskPeriods[5].enable" />
                  <span v-else> - </span>
                </div>
                <div class="table-td" style="padding: 0px; border-left-style: none;border-right-style: none">
                  <span v-if="item.taskPeriods[6].enable" />
                  <span v-else> - </span>
                  <div
                    style="display: table-cell;line-height: 20px;border: 1px solid gray;width: 80px;"
                  />
                  <span> - </span>
                </div>
                <div class="table-td" style="padding: 0px; border-left-style: none;border-right-style: none">
                  <span v-if="item.taskPeriods[7].enable" />
                  <span v-else> - </span>
                  <div
                    style="display: table-cell;line-height: 20px;border: 1px solid gray;width: 80px;"
                  />
                  <span> - </span>
                </div>
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
    </div> -->
  </div>
</template>

<script>
// import moment from 'moment'
import { mapGetters } from 'vuex'
import { queryTodayTask } from '@/api/patient'
import { getDepartments } from '@/api/user'
import { addPrintStyle } from '@/utils/index'
import { Message } from 'element-ui'
import MyTreeselect from '@/components/common/MyTreeselect.vue'

export default {
  name: 'Todaywork',
  components: { MyTreeselect },
  data () {
    return {
      loading: false,
      buttonLoading: false,
      deptOptions: [],
      dialogVisible: false,
      // 默认值
      departDefaultCodes: null,
      conditionForm: {
        queryCondition: '',
        departmentCode: '',

        page: 1,
        size: 20,
        total: 0
      },
      tableData: [],
      printTableData: [],
      printPageSize: 16,
      dialogVisibleMore: false,
      todayworkObj: {
        id: 'printContent',
        popTitle: '今日任务',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>,<style> #printContent { height: auto !important; } <style>',
        beforeOpenCallback (vue) {
          vue.buttonLoading = true
          vue.isShowTitle = true
        },
        openCallback (vue) {
          vue.buttonLoading = false
          vue.isShowTitle = true
        },
        closeCallback (vue) {
          vue.isShowTitle = false
        }
      }

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
    },

    onSearch () {
      this.conditionForm.page = 1
      this.loadData()
    },
    loadData () {
      this.loading = true
      this.tableData = []
      this.conditionForm.total = 0
      queryTodayTask(this.conditionForm).then(res => {
        if (res.dataContent.records !== null && res.dataContent.records.length > 0) {
          this.kk(res.dataContent.records)
        } else {
          this.tableData = res.dataContent.records
        }
        this.conditionForm.total = res.dataContent.total
        this.loading = false
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
        this.loading = false
      })
    },
    // 血糖记录数据
    kk (resArr) {
      this.tableData = []
      const pp = JSON.parse(JSON.stringify(resArr))
      const uu = JSON.parse(JSON.stringify(resArr))
      uu.forEach(i => {
        pp.forEach(j => {
          if (j.id === i.id) {
            this.tableData.push(i)
            this.tableData.push(j)
          }
        })
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 4) {
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
      } else {
        if (rowIndex % 2 !== 0) {
          return {
            rowspan: 1,
            colspan: 8
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
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
    handleCurrentChange (val) {
      this.conditionForm.page = val
      this.loadData()
    },
    handleSizeChange (val) {
      this.conditionForm.size = val
      this.loadData()
    },

    vuePrint1 () {
      this.$print(this.$refs.print)
    },
    async vuePrint () {
      this.printTableData = []
      this.buttonLoading = true
      var pageCount = Math.ceil(this.conditionForm.total / this.printPageSize)

      for (var i = 1; i < pageCount + 1; i++) {
        await queryTodayTask({
          queryCondition: this.conditionForm.queryCondition,
          departmentCode: this.conditionForm.departmentCode,
          page: i,
          size: this.printPageSize

        }).then(res => {
          if (res.dataContent.records !== null && res.dataContent.records.length > 0) {
            const uutableData = []
            const pp = JSON.parse(JSON.stringify(res.dataContent.records))
            const uu = JSON.parse(JSON.stringify(res.dataContent.records))
            uu.forEach(i => {
              pp.forEach(j => {
                if (j.id === i.id) {
                  uutableData.push(i)
                  uutableData.push(j)
                }
              })
            })
            this.printTableData.push(uutableData)
          }
        })
      }
      const iframe = window.frames[0]
      iframe.document.body.innerHTML = this.$refs.printContent.innerHTML
      addPrintStyle(iframe)
      iframe.window.print()
      this.buttonLoading = false
    }

  }
}
</script>
<style scoped>
	::v-deep .print-content .el-table td>.cell{
    height: 22px;
  }
</style>
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
