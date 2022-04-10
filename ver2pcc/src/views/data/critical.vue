/* eslint-disable use-isnan */
<template>
  <div style="margin:20px">
    <el-card>
      <div slot="header" class="clearfix">
        <el-form
          ref="firstTabForm"
          :rules="firstTab.formRules"
          :model="firstTab.form"
          :inline="true"
          size="small"
          label-width="80px"
        >
          <el-row>
            <el-col>
              <el-form-item label="项目类型:">
                <el-select
                  v-model="firstTab.form.category"
                  placeholder="请选择"
                  class="search-item"
                  autocomplete
                >
                  <el-option
                    v-for="item in testOptions"
                    :key="item.name"
                    :label="item.displayName"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="minValue" label="低于:">
                <el-input
                  v-model="firstTab.form.minValue"
                  type="number"
                  min="0"
                  class="search-item"
                  @keydown.native="inputLimit"
                /></el-form-item>
              <el-form-item prop="maxValue" label="高于:">
                <el-input
                  v-model="firstTab.form.maxValue"
                  type="number"
                  min="0"
                  class="search-item"
                  @keydown.native="inputLimit"
                /></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item prop="queryCondition" label="查询条件:">
                <el-input
                  v-model="firstTab.form.queryCondition"
                  placeholder="姓名/床号"
                  class="search-item"
                />
              </el-form-item>
              <!-- 科室选择 -->
              <el-form-item label="科室:">
                <div style="width:200px;height:32px">
                  <my-treeselect ref="selTree" :append-true="true" :mydata="deptOptions" :valuebb="departDefaultCodes" @changeSel="changeDepentSelHandle" @inputChanging="inoutDepentChangeHandle" />
                </div>
              </el-form-item>
              <el-form-item label="医生:">
                <el-select
                  v-model="firstTab.form.doctorCode"
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
            <el-col>
              <!-- 修改 -->
              <el-form-item
                prop="beginDate"
                label="开始日期:"
              >
                <el-date-picker
                  v-model="firstTab.form.beginDate"
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
                  v-model="firstTab.form.endDate"
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
                  style="margin-left:20px"
                  @click="onSearch"
                >查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <el-table
          v-loading="loading"
          :data="firstTab.tableData"
          style="width: 100%"
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
            prop="departmentName"
            label="科室"
            align="center"
          />
          <el-table-column
            prop="bed"
            label="床号"
            width="80"
            align="center"
          />

          <el-table-column
            prop="patientName"
            label="姓名"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              <el-link @click="clickNavigate(scope.row.patientId)">{{ scope.row.patientName }}</el-link>
            </template>

          </el-table-column>

          <el-table-column
            prop="categoryDisplay"
            label="项目类型"
            width="180"
            align="center"
          />
          <el-table-column
            v-if="hasPeriod"
            prop="periodName"
            label="检测时段"
            align="center"
          />
          <el-table-column

            prop="testValue"
            label="检测结果"
            width="140"
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

            prop="unit"
            label="单位"
            align="center"
          />
          <el-table-column
            prop="testUser"
            label="检测人"
            align="center"
          />
          <el-table-column
            prop="doctorName"
            label="住院医生"
            align="center"
          />

        </el-table>
      </div>
      <div style="margin:5px;float:right">
        <el-pagination
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next"
          :total="firstTab.total"
          :page-size.sync="firstTab.form.size"
          @size-change="firstTabHandleSizeChange"
          @current-change="firstTabHandleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getDepartments, queryDoctors } from '@/api/user'
import { criticalWarningQuery, getTestItems } from '@/api/test'
import { Message } from 'element-ui'
import MyTreeselect from '@/components/common/MyTreeselect.vue'
import moment from 'moment'

export default {
  name: 'Critical',
  components: { MyTreeselect },
  data () {
    return {
      activeName: 'first',
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'

      },
      loading: false,
      hasPeriod: false,
      doctorOptions: [],
      testOptions: [],
      // 默认值
      departDefaultCodes: null,
      firstTab: {
        tableData: [],
        total: 0,
        form: {
          category: 'GLU',
          departmentCode: '',
          departmentName: '',
          queryCondition: '',
          doctorCode: '',
          maxValue: null,
          minValue: null,
          beginDate: '',
          endDate: '',
          page: 1,
          size: 20
        },
        formRules: {
          // minValue: [
          //   { min: 0, max: 10000, message: '最小值只能是数字', trigger: 'blur' }
          // ],
          // maxValue: [
          //   { min: 0, max: 10000, message: '最大值只能是数字', trigger: 'blur' }
          // ]
        }
      }
    }
  },
  computed: {
    minValue () {
      return this.$route.query.minValue
    },
    maxValue () {
      return this.$route.query.maxValue
    },
    todayDate () {
      return moment(new Date()).format('yyyy-MM-DD')
    },
    ...mapGetters(['name', 'token', 'organizationName', 'departmentCode'])
  },
  mounted () {

  },
  created () {
    this.initOptions()
    // this.onSearch()
  },
  methods: {
    inputLimit (e) {
      const key = e.key
      // 不允许输入'e'和'.'、'+'、'-'、'Shift'
      if (key === 'e' || key === '+' || key === '-' || key === 'Shift') {
        e.returnValue = false
        return false
      }
      return true
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
        this.firstTab.form.departmentCode = this.departmentCode
        this.deptOptions = res.dataContent
        // 加载默认医生
        this.onQueryDoctors(this.departmentCode)
        // 更多跳转过来
        if (this.minValue !== undefined) {
          this.firstTab.form.beginDate = this.todayDate
          this.firstTab.form.endDate = this.todayDate
          this.firstTab.form.maxValue = String(this.maxValue)
          this.firstTab.form.minValue = String(this.minValue)
          this.onSearch()
        }
      }).catch(err => {
        console.log(err)
      })

      getTestItems().then(res => {
        this.testOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
    },
    mainTabClick (e) {
      console.log(e)
    },
    isValidDateArea () {
      if (this.firstTab.form.beginDate !== null && this.firstTab.form.beginDate.length > 0 &&
        this.firstTab.form.endDate !== null && this.firstTab.form.endDate.length > 0) {
        return moment(this.firstTab.form.beginDate).isSameOrBefore(this.firstTab.form.endDate)
      } else {
        return true
      }
    },
    onSearch () {
      this.firstTab.form.page = 1
      this.firstTabQuery()
    },
    firstTabQuery () {
      this.firstTab.tableData = []
      this.firstTab.total = 0
      this.$refs.firstTabForm.validate(valid => {
        if (valid) {
          if (!this.isValidDateArea()) {
            Message.error('开始日期必须小于结束日期')
            return
          }
          if (this.validateRangeValue()) {
            this.loading = true
            if (this.firstTab.form.category === 'GLU') {
              this.hasPeriod = true
            } else {
              this.hasPeriod = false
            }
            criticalWarningQuery(this.firstTab.form).then(res => {
              this.loading = false
              this.firstTab.tableData = res.dataContent.records
              this.firstTab.total = res.dataContent.total
            }).catch(err => {
              console.log(err)
              this.loading = false
              Message.error(err.message)
            })
          }
        }
      })
    },
    firstTabHandleSizeChange (val) {
      this.firstTab.form.size = val
      this.firstTabQuery()
    },
    // 科室选择
    changeDepentSelHandle (val) {
      this.handleNodeClear()
      this.firstTab.form.departmentCode = val.id
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
      this.firstTab.form.departmentCode = null
      this.firstTab.form.doctorCode = null
    },
    onQueryDoctors (code) {
      this.doctorOptions = []
      queryDoctors(code).then(res => {
        this.doctorOptions = res.dataContent
      }).catch(err => {
        console.log(err.message)
      })
    },
    firstTabHandleCurrentChange (val) {
      this.firstTab.form.page = val
      this.firstTabQuery()
    },
    categoryChanged (val) {
      this.firstTab.form.page = 1
      this.firstTabQuery()
    },
    validateRangeValue () {
      console.log(parseFloat(this.firstTab.form.minValue))
      console.log(parseFloat(this.firstTab.form.maxValue))
      const minValue = parseFloat(this.firstTab.form.minValue)
      const maxValue = parseFloat(this.firstTab.form.maxValue)
      if (isNaN(minValue) && isNaN(maxValue)) {
        Message.error('最低值和最高值必须输入一个')
        return false
      }
      if (!isNaN(minValue)) {
        if (minValue < 0) {
          this.firstTab.form.minValue = 0
        }
      }
      if (!isNaN(maxValue)) {
        if (maxValue < 0) {
          this.firstTab.form.maxValue = 0
        }
      }
      if (!isNaN(minValue) && !isNaN(maxValue)) {
        if (minValue >= maxValue) {
          Message.error('低值必须小于高值')
          return false
        }
      }
      return true
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
    }

  }
}
</script>
<style scoped>
.search-item{
  width:200px
}
.Low {
  color: blue;
}
.High {
  color: red;
}
</style>
