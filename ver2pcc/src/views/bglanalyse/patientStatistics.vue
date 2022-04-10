<template>
  <div>
    <div>
      <el-card>
        <el-form ref="conditionForm" v-model="conditionForm" :inline="true" size="small" label-width="100px">
          <el-row>
            <el-col>
              <el-form-item label="科室:">
                <div style="width:200px;height:32px">
                  <my-treeselect :append-true="true" :mydata="deptOptions" :valuebb="departDefaultCodes" @changeSel="changeDepentSelHandle" @inputChanging="inoutDepentChangeHandle" />
                </div>
              </el-form-item>
              <!-- <el-form-item prop="departmentCode" label="科室:">
                <el-select
                  ref="selTree"
                  v-model="conditionForm.departmentName"
                  clearable
                  placeholder="请选择科室"

                  @change="handleChangeDepartment"
                >
                  <el-option :label="conditionForm.departmentName" :value="conditionForm.departmentName" />
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
              <el-form-item prop="queryCondition" label="查询条件:">
                <el-input
                  v-model="conditionForm.queryCondition"
                  class="search-item"
                  maxlength="32"
                  placeholder="姓名/床号/住院号"
                />
              </el-form-item>
              <el-form-item label="患者类型:">
                <el-select v-model="conditionForm.hospitalizedType" clearable placeholder="患者类型" class="search-item">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
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
                <el-button type="primary" style="margin-left:20px" @click="onSearch">查询</el-button>
                <el-button ref="dPrint" type="primary" style="margin-left:20px;" @click="vuePrint">打印</el-button>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <div style="margin:10">
          <el-table
            ref="table"
            v-loading="loading"
            :data="tableData"
            stripe
            border
            highlight-current-row
            :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
          >
            <el-table-column
              prop="bed"
              label="床号"
              align="center"
            />
            <el-table-column
              prop="patientName"
              label="姓名"
              align="center"
            />
            <el-table-column
              prop="hospitalizedNum"
              label="住院号"
              align="center"
            />
            <el-table-column
              prop="inHospitalizedDate"
              label="入院日期"
              align="center"
            />
            <el-table-column
              prop="gluCount"
              label="血糖检测次数"
              align="center"
            />
            <el-table-column
              prop="ketCount"
              label="血酮检测次数"
              align="center"
            />
            <el-table-column
              prop="uaCount"
              label="尿酸检测次数"
              align="center"
            />
            <el-table-column
              prop="gluLowCount"
              label="低血糖次数"
              align="center"
            />
            <el-table-column
              prop="gluHighCount"
              label="高血糖次数"
              align="center"
            />
            <el-table-column
              prop="gluCriticalMeasureCount"
              label="危血糖次数"
              align="center"
            />
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
      <div id="printContent" ref="printContent" style="margin:10;display:none" class="print-content">
        <div class="print-header-content">
          <el-row>
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="12">
              <div style="text-align:center;font-size:16pt">
                <div>{{ organizationName }}</div>
                <div style="margin:5px">患者统计列表</div>
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
                <div class="table-td">床号</div>
                <div class="table-td">姓名</div>
                <div class="table-td">住院号</div>
                <div class="table-td">入院日期</div>
                <div class="table-td">血糖检测次数</div>
                <div class="table-td">血酮检测次数</div>
                <div class="table-td">尿酸检测次数</div>
                <div class="table-td">低血糖次数</div>
                <div class="table-td">高血糖次数</div>
                <div class="table-td">危血糖次数</div>
              </div>
              <div v-for="(item,index) in table" :key="index" class="table-tr">
                <div class="table-td"> {{ item.bed }}</div>
                <div class="table-td"> {{ item.patientName }}</div>
                <div class="table-td"> {{ item.hospitalizedNum }}</div>
                <div class="table-td">  {{ item.inHospitalizedDate }}</div>
                <div class="table-td">  {{ item.gluLowCount }}</div>
                <div class="table-td">  {{ item.gluHighCount }}</div>
                <div class="table-td">  {{ item.gluCriticalMeasureCount }}</div>
                <div class="table-td"> {{ item.gluCount }}</div>
                <div class="table-td"> {{ item.ketCount }}</div>
                <div class="table-td"> {{ item.uaCount }}</div>

              </div>

            </div>
            <div calss="table-tr" style="page-break-after:always" />

          </div>

        </div>
      </div>
      <iframe id="iframe" style="display:none;" />

    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getDepartments } from '@/api/user'
import { patientStatistics } from '@/api/patient'
// import { addPrintStyle } from '@/utils/index'
import { Message } from 'element-ui'
import moment from 'moment'
import MyTreeselect from '@/components/common/MyTreeselect.vue'

export default {
  inject: ['reload'],
  name: 'PatientStatistics',
  components: { MyTreeselect },
  data () {
    return {
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      statusOptions: [
        {
          label: '住院',
          value: 'In'
        },
        {
          label: '出院',
          value: 'Out'
        }
      ],
      loading: false,
      isPrintView: true,
      // 默认值
      departDefaultCodes: null,
      conditionForm: {
        departmentCode: '',
        departmentName: '',
        queryCondition: '',
        beginDate: '',
        endDate: '',
        hospitalizedType: '',
        page: 1,
        size: 10

      },
      tableData: [],
      printTableData: [],
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
    handleSizeChange (val) {
      this.conditionForm.size = val
      this.query()
    },
    handleCurrentChange (val) {
      this.conditionForm.page = val
      this.query()
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
      this.query()
    },
    query () {
      if (this.isValidDateArea()) {
        this.loading = true
        // this.conditionForm.page = 1
        patientStatistics(this.conditionForm).then(res => {
          this.tableData = res.dataContent.records
          this.total = res.dataContent.total
          this.loading = false
        }).catch(err => {
          Message.error(err.message)
          this.loading = false
        })
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
    async vuePrint () {
      if (!this.checkFormDate(this.conditionForm)) {
        return
      }
      if (this.isValidDateArea()) {
        const url = this.$baseConfig.reportServiceUrl + '/report/TestSummaryReport' +
        '?DepartmentCode=' + this.conditionForm.departmentCode +
        '&HospitalizedType=' + this.conditionForm.hospitalizedType +
        '&QueryCodition=' + this.conditionForm.queryCondition +
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
  width:200px;
}

</style>
