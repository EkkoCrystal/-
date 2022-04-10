<template>
  <div class="main">
    <el-tabs v-model="activeName" @tab-click="mainTabClick">
      <el-tab-pane label="质控月报" name="first">
        <el-card>
          <div slot="header" class="clearfix">
            <el-form v-model="firstTab.form" :inline="true" size="small" label-width="80px">
              <el-row>
                <el-col>
                  <!-- 科室1 -->
                  <el-form-item label="科室:">
                    <div style="width:200px;height:32px">
                      <my-treeselect ref="selTree" :append-true="true" :mydata="deptOptions" :valuebb="departDefaultCodes" @changeSel="changeDepentSelHandle" @inputChanging="inoutDepentChangeHandle" />
                    </div>
                  </el-form-item>
                  <el-form-item prop="sn" label="仪器编号:">
                    <el-input v-model="firstTab.form.sn" class="search-item" /></el-form-item>
                  <el-form-item label="状态:">
                    <el-select v-model="firstTab.form.status" clearable placeholder="请选择状态" class="search-item">
                      <el-option
                        v-for="item in deviceStatusOptions"
                        :key="item.name"
                        :label="item.display"
                        :value="item.name"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onFirstSearch">查询</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div>
            <el-table
              v-loading="firstTab.loading"
              :data="firstTab.tableData"
              style="width: 100%"
              stripe
              border
              highlight-current-row
              :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
            >
              <el-table-column
                prop="department"
                label="科室"
                width="260"
                align="center"
              />
              <el-table-column
                prop="sn"
                label="仪器编号"
                width="450"
                align="center"
              />
              <!-- <el-table-column
                prop="manufactor"
                label="生产厂家"
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
                <template slot-scope="scope">
                  <router-link :to="{path: '/quality/m/report',query:{id:scope.row.sn}}">
                    <el-link type="primary">质控月报</el-link>
                  </router-link>
                </template>
              </el-table-column>
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
      </el-tab-pane>
      <el-tab-pane label="质控曲线" name="second">
        <el-card>
          <div slot="header" class="clearfix">
            <el-form v-model="secondTab.form" :inline="true" size="small">
              <!-- 科室2 -->
              <el-form-item label="科室:">
                <div style="width:200px;height:32px">
                  <my-treeselect ref="selSecondTree" :append-true="true" :mydata="deptOptions" :valuebb="departDefaultCodesTwo" @changeSel="changeDepentSelHandleTwo" @inputChanging="inoutDepentChangeHandleTwo" />
                </div>
              </el-form-item>
              <!-- <el-form-item prop="departmentCode" label="科室:">
                <el-select
                  ref="selSecondTree"
                  v-model="secondTab.form.departmentName"
                  clearable
                  placeholder="请选择科室"

                  @change="handleSecondChangeDepartment"
                >
                  <el-option :label="secondTab.form.departmentName" :value="secondTab.form.departmentName" />
                  <el-tree
                    highlight-current
                    default-expand-all
                    :expand-on-click-node="false"
                    :data="deptOptions"
                    :props="defaultProps"
                    @node-click="secondTabHandleNodeClick"
                  />
                </el-select>
              </el-form-item> -->
              <el-form-item prop="sn" label="仪器编号:">
                <el-input v-model="secondTab.form.sn" class="search-item" /></el-form-item>
              <el-form-item label="状态:">
                <el-select v-model="secondTab.form.status" clearable placeholder="请选择状态" class="search-item">
                  <el-option
                    v-for="item in deviceStatusOptions"
                    :key="item.name"
                    :label="item.display"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSecondSearch">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-table
              v-loading="secondTab.loading"
              :data="secondTab.tableData"
              style="width: 100%"
              stripe
              border
              highlight-current-row
              :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
            >
              <el-table-column
                prop="department"
                label="科室"
                width="280"
                align="center"
              />
              <el-table-column
                prop="sn"
                label="仪器编号"
                width="420"
                align="center"
              />
              <!-- <el-table-column
                prop="manufactor"
                label="生产厂家"
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
                <template slot-scope="scope">
                  <router-link :to="{path: '/quality/ljreport',query:{id:scope.row.sn}}">
                    <el-link type="primary">质控曲线</el-link>
                  </router-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="margin:5px;float:right">
            <el-pagination
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next"
              :total="secondTab.total"
              :page-size.sync="secondTab.form.size"
              @size-change="secondTabHandleSizeChange"
              @current-change="secondTabHandleCurrentChange"
            />
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="质控统计" name="third">
        <el-card>
          <div slot="header" class="clearfix">
            <el-form v-model="thirdTab.form" :inline="true" size="small" label-width="80px">
              <!-- 科室3 -->
              <el-form-item label="科室:">
                <div style="width:200px;height:32px">
                  <my-treeselect ref="selThirdTree" :append-true="true" :mydata="deptOptions" :valuebb="departDefaultCodesThree" @changeSel="changeDepentSelHandleThree" @inputChanging="inoutDepentChangeHandleThree" />
                </div>
              </el-form-item>
              <!-- <el-form-item prop="departmentCode" label="科室:">
                <el-select
                  ref="selThirdTree"
                  v-model="thirdTab.form.departmentName"

                  placeholder="请选择科室"
                >
                  <el-option :label="thirdTab.form.departmentName" :value="thirdTab.form.departmentName" />
                  <el-tree
                    highlight-current
                    default-expand-all
                    :expand-on-click-node="false"
                    :data="deptOptions"
                    :props="defaultProps"
                    @node-click="thirdTabHandleNodeClick"
                  />
                </el-select>
              </el-form-item> -->
              <el-form-item prop="beginDate" label="开始日期:">
                <el-date-picker
                  v-model="thirdTab.form.beginDate"
                  type="date"
                  class="search-item"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item prop="endDate" label="结束日期:">
                <el-date-picker
                  v-model="thirdTab.form.endDate"
                  type="date"
                  class="search-item"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onThirdSearch">查询</el-button>
              </el-form-item>

            </el-form>
          </div>
          <div>
            <el-table
              v-loading="thirdTab.loading"
              :data="thirdTab.tableData"
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
                prop="totalCount"
                label="质控次数"
                width="180"
                align="center"
              />
              <el-table-column
                prop="successCount"
                label="质控合格次数"
                align="center"
              />
              <el-table-column
                prop="failCount"
                label="质控不合格次数"
                align="center"
              />
              <el-table-column
                prop="lastTestTime"
                label="最后一次质控日期"
                align="center"
              />

            </el-table>
          </div>
          <div style="margin:5px;float:right">
            <el-pagination
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next"
              :total="thirdTab.total"
              :page-size.sync="thirdTab.form.size"
              @size-change="thirdTabHandleSizeChange"
              @current-change="thirdTabHandleCurrentChange"
            />
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="质控策略" name="fourth">
        <el-card>
          <div v-for="item in fourthTab.qcRules" :key="item.ruleCode">
            <div v-if="item.ruleCode==='W1P2SD'">
              <el-checkbox v-model="item.checked" @change="ruleChanged">{{ item.des }}</el-checkbox>

            </div>
            <div v-else>
              <el-checkbox v-if="fourthTab.hasDetail" v-model="item.checked">{{ item.des }}</el-checkbox>
            </div>

          </div>
          <div style="margin:10px">
            <el-button type="primary" @click="fourthSave">保存</el-button>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { getDepartments } from '@/api/user'
import { deviceQuery, qcControlStatistics, getWestGuardRules, saveWestGuardRules, getDeviceStatusTypes } from '@/api/qc'
import MyTreeselect from '@/components/common/MyTreeselect.vue'

export default {
  name: 'QualityAnalyse',
  components: { MyTreeselect },
  data () {
    return {
      deviceStatusOptions: [

      ],
      activeName: 'first',
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'

      },
      // 默认值
      departDefaultCodes: null,
      firstTab: {
        form: {
          departmentCode: '',
          departmentName: '',
          sn: '',
          deviceModel: '',
          manufactor: '',
          status: '',
          page: 1,
          size: 20

        },
        loading: false,
        tableData: [],
        total: 0

      },
      // 默认值
      departDefaultCodesTwo: null,
      secondTab: {
        form: {
          departmentCode: '',
          departmentName: '',
          status: '',
          sn: '',
          page: 1,
          size: 20
        },
        total: 0,
        loading: false,

        tableData: []

      },
      // 默认值
      departDefaultCodesThree: null,
      thirdTab: {
        form: {
          departmentCode: '',
          departmentName: '',
          beginDate: '',
          endDate: '',
          page: 1,
          size: 20
        },
        loading: false,
        tableData: [],
        total: 0

      },
      fourthTab: {
        qcRules: [

        ],
        hasDetail: false

      }

    }
  },
  computed: {
    ...mapGetters(['avatar', 'departmentName', 'departmentCode'])

  },
  created () {
    this.initOptions()
    this.initData()
  },
  mounted () {
    this.onFirstSearch()
  },
  methods: {
    initOptions () {
      getDepartments().then(res => {
        // 默认值
        if (this.departmentCode !== null && this.departmentCode !== '') {
          this.departDefaultCodes = []
          this.departDefaultCodes.push(this.departmentCode)
          this.departDefaultCodesTwo = []
          this.departDefaultCodesTwo.push(this.departmentCode)
          this.departDefaultCodesThree = []
          this.departDefaultCodesThree.push(this.departmentCode)
        } else {
          this.departDefaultCodes = null
          this.departDefaultCodesTwo = null
          this.departDefaultCodesThree = null
        }
        this.firstTab.form.departmentCode = this.departmentCode
        this.secondTab.form.departmentCode = this.departmentCode
        this.thirdTab.form.departmentCode = this.departmentCode

        this.deptOptions = res.dataContent
        this.onFirstSearch()
      }).catch(err => {
        console.log(err)
      })
      getWestGuardRules().then(res => {
        this.fourthTab.qcRules = res.dataContent

        const rule = this.fourthTab.qcRules.find(q => q.ruleCode === 'W1P2SD')
        this.fourthTab.hasDetail = rule.checked
      }).catch(err => {
        console.log(err)
      })
      getDeviceStatusTypes().then(res => {
        this.deviceStatusOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
    },
    initData () {
      this.thirdTab.form.beginDate = moment().subtract(30, 'd').format('YYYY-MM-DD')
      this.thirdTab.form.endDate = moment().format('YYYY-MM-DD')
      this.thirdTab.form.departmentCode = this.departmentCode
      this.thirdTab.form.departmentName = this.departmentName
    },
    mainTabClick (e) {
      if (e.name === 'first') {
        this.firstTabQuery()
      } else if (e.name === 'second') {
        this.secondTabQuery()
      } else if (e.name === 'third') {
        this.thirdTabQuery()
      }
    },
    // firstTabHandleNodeClick (data) {
    //   this.firstTab.form.departmentCode = data.code
    //   this.firstTab.form.departmentName = data.name
    //   this.$refs.selFirstTree.blur()
    // },
    // first科室选择
    changeDepentSelHandle (val) {
      this.handleNodeClear()
      this.firstTab.form.departmentCode = val.id
    },
    inoutDepentChangeHandle (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleNodeClear()
      }
    },
    handleNodeClear () {
      this.firstTab.form.departmentCode = null
    },
    onFirstSearch () {
      this.firstTab.form.page = 1
      this.firstTabQuery()
    },
    firstTabQuery () {
      this.firstTab.loading = true
      // this.firstTab.form.page = 1
      deviceQuery(this.firstTab.form).then(res => {
        this.firstTab.loading = false
        this.firstTab.tableData = res.dataContent.records
        this.firstTab.total = res.dataContent.total
      }).catch(err => {
        console.log(err)
        this.firstTab.loading = false
        Message.error(err.message)
      })
    },
    firstTabHandleSizeChange (val) {
      this.firstTab.form.size = val
      this.firstTabQuery()
    },
    firstTabHandleCurrentChange (val) {
      this.firstTab.form.page = val
      this.firstTabQuery()
    },
    // secondTabHandleNodeClick (data) {
    //   this.secondTab.form.departmentCode = data.code
    //   this.secondTab.form.departmentName = data.name
    //   this.$refs.selSecondTree.blur()
    // },
    // second科室选择
    changeDepentSelHandleTwo (val) {
      this.handleNodeClearTwo()
      this.secondTab.form.departmentCode = val.id
    },
    inoutDepentChangeHandleTwo (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleNodeClearTwo()
      }
    },
    handleNodeClearTwo () {
      this.secondTab.form.departmentCode = null
    },
    onSecondSearch () {
      this.secondTab.form.page = 1
      this.secondTabQuery()
    },
    secondTabQuery () {
      this.secondTab.loading = true
      // this.secondTab.form.page = 1
      deviceQuery(this.secondTab.form).then(res => {
        this.secondTab.loading = false
        this.secondTab.tableData = res.dataContent.records
        this.secondTab.total = res.dataContent.total
      }).catch(err => {
        this.secondTab.loading = false
        console.log(err)
        Message.error(err.message)
      })
    },
    secondTabHandleSizeChange (val) {
      this.secondTab.form.size = val
      this.secondTabQuery()
    },
    secondTabHandleCurrentChange (val) {
      this.secondTab.form.page = val
      this.secondTabQuery()
    },
    // thirdTabHandleNodeClick (data) {
    //   this.thirdTab.form.departmentCode = data.code
    //   this.thirdTab.form.departmentName = data.name
    //   this.$refs.selThirdTree.blur()
    // },
    // third科室选择
    changeDepentSelHandleThree (val) {
      this.handleNodeClearThree()
      this.thirdTab.form.departmentCode = val.id
    },
    inoutDepentChangeHandleThree (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleNodeClearThree()
      }
    },
    handleNodeClearThree () {
      this.thirdTab.form.departmentCode = null
    },
    isValidDateArea (form) {
      if (form.beginDate !== null && form.beginDate.length > 0 &&
        form.endDate !== null && form.endDate.length > 0) {
        return moment(form.beginDate).isSameOrBefore(form.endDate)
      } else {
        return true
      }
    },
    onThirdSearch () {
      this.thirdTab.form.page = 1
      this.thirdTabQuery()
    },
    thirdTabQuery () {
      if (this.isValidDateArea(this.thirdTab.form)) {
        this.thirdTab.loading = true
        // this.thirdTab.form.page = 1
        qcControlStatistics(this.thirdTab.form).then(res => {
          this.thirdTab.tableData = res.dataContent.records
          this.thirdTab.total = res.dataContent.total
          this.thirdTab.loading = false
        }).catch(err => {
          this.thirdTab.loading = false
          console.log(err)
          Message.error(err.message)
        })
      } else {
        Message.error('开始日期必须小于结束日期')
      }
    },
    thirdTabHandleSizeChange (val) {
      this.thirdTab.form.size = val
      this.thirdTabQuery()
    },
    thirdTabHandleCurrentChange (val) {
      this.thirdTab.form.page = val
      this.thirdTabQuery()
    },

    fourthSave () {
      const rules = []

      this.fourthTab.qcRules.map(k => {
        rules.push({
          checked: k.checked,
          rule: k.ruleCode
        })
      })

      saveWestGuardRules(rules).then(res => {
        Message.success('保存QC策略成功')
      }).catch(err => {
        console.log(err)
        Message.error('保存QC策略失败' + err.message)
      })
    },

    // handleFirstChangeDepartment (val) {
    //   this.firstTab.form.departmentCode = ''
    //   this.firstTab.form.departmentName = ''
    // },

    handleSecondChangeDepartment (val) {
      this.secondTab.form.departmentCode = ''
      this.secondTab.form.departmentName = ''
    },
    ruleChanged (val) {
      this.fourthTab.hasDetail = val
    }

  }
}
</script>

<style scoped>
.main{
    margin:20px;

}
.search-item{
  width:200px
}
</style>
