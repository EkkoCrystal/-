<template>
  <div class="mmnn">
    <el-card>
      <el-form ref="formm"
               :model="form"
               :inline="true"
               label-width="100px"
               size="small">
        <el-row>
          <el-col>
            <el-form-item label="关键字:">
              <el-input v-model="form.condition"
                        class="edit-form-item"
                        placeholder="工号/姓名" />
            </el-form-item>
            <el-form-item label="园区:">
              <el-select v-model="form.workSectionCode"
                         placeholder="请选择园区"
                         class="edit-form-item"
                         clearable>
                <el-option v-for="item in workSectionOptions"
                           :key="item.code"
                           :label="item.name"
                           :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item label="宿舍名:">

              <el-input v-model="form.dormitoryName"
                        placeholder="点击按钮选择宿舍"
                        readonly=""
                        class="edit-form-item"
                        @clear="handleFormDormClear">
                <!-- <el-select v-model="select"
                           slot="prepend"
                           placeholder="请选择">
                  <el-option label="餐厅名"
                             value="1"></el-option>
                  <el-option label="订单号"
                             value="2"></el-option>
                  <el-option label="用户电话"
                             value="3"></el-option>
                </el-select> -->
                <el-button slot="append"
                           icon="el-icon-search"
                           @click="handleSelectDorm" />
              </el-input>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="公司:">
              <el-select v-model="form.companyCode"
                         placeholder="请选择公司"
                         class="edit-form-item"
                         clearable
                         @change="handleCompanyChanged">
                <el-option v-for="item in companyOptions"
                           :key="item.code"
                           :label="item.name"
                           :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item label="部门:">
              <el-select v-model="form.departmentCode"
                         placeholder="请选择部门"
                         class="edit-form-item"
                         clearable>
                <el-option v-for="item in departmentOptions"
                           :key="item.code"
                           :label="item.name"
                           :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item label="员工类型:">
              <el-select v-model="form.userType"
                         placeholder="请选择员工类型"
                         class="edit-form-item"
                         clearable>
                <el-option v-for="item in userTypeOptions"
                           :key="item.code"
                           :label="item.name"
                           :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <div style="padding-left:50px">
                <el-button type="primary"
                           @click="onSearch">查询</el-button>
                <el-button @click="restQuery">重置</el-button>
              </div>

            </el-form-item>

          </el-col>
        </el-row>
        <el-row>
          <el-col />

        </el-row>

      </el-form>
    </el-card>
    <el-card>
      <div>
        <el-table v-loading="loading"
                  :data="tableData"
                  style="width: 100%"
                  border
                  highlight-current-row
                  :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
          <el-table-column prop="workSectionDisplay"
                           label="园区"
                           min-width="60"
                           align="center" />
          <el-table-column prop="companyName"
                           label="公司"
                           min-width="60"
                           align="center" />
          <el-table-column prop="departmentName"
                           label="部门"
                           min-width="90"
                           align="center" />

          <el-table-column prop="workId"
                           label="工号"
                           min-width="50"
                           align="center" />
          <el-table-column prop="userName"
                           label="姓名"
                           min-width="80"
                           align="center" />
          <el-table-column prop="userTypeDisplay"
                           label="员工类型"
                           min-width="80"
                           align="center" />
          <!-- <el-table-column label="员工类型"
                           min-width="80"
                           align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.userType==='Worker'">生产员工</span>
              <span v-else>管理员工</span>
            </template>
          </el-table-column> -->

          <el-table-column prop="phoneNumber"
                           label="联系方式"
                           min-width="80"
                           align="center" />

          <el-table-column prop="dormitoryName"
                           label="公司宿舍"
                           min-width="90"
                           align="center" />

        </el-table>
      </div>
      <div style="margin:5px;float:right">
        <el-pagination :page-sizes="[10, 20, 30, 50,100,200,500]"
                       layout="total, sizes, prev, pager, next"
                       :total="total"
                       :page-size.sync="form.size"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <div>

      <el-dialog :close-on-click-modal="false"
                 title="宿舍列表"
                 :visible.sync="dormDialogVisible"
                 width="50%">
        <el-card>
          <div style="margin: 5px">
            <el-form ref="dormForm"
                     size="small"
                     :inline="true"
                     label-width="60px">

              <el-form-item label="市区:"
                            prop="county">
                <el-select v-model="dormForm.countyCode"
                           placeholder="请选择市区"
                           clearable
                           class="edit-form-item"
                           @clear="handleDialogCountyClear"
                           @change="handleDialogCountyChanged">
                  <el-option v-for="item in dialogCountyOptions"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="街道:"
                            prop="subdistrict">
                <el-select v-model="dormForm.subdistrict"
                           placeholder="请选择街道"
                           clearable
                           class="edit-form-item">
                  <el-option v-for="item in dialogSubdistrictOptions"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="关键字:">
                <el-input v-model="dormForm.condition"
                          class="edit-form-item"
                          placeholder="请输入宿舍名称或者地址" />
              </el-form-item>
              <el-form-item>

                <el-button type="primary"
                           @click="onDialogDormSearch">查询</el-button>

              </el-form-item>

            </el-form>
            <el-table v-loading="dormLoading"
                      :data="dormTableData"
                      style="width: 100%"
                      border
                      highlight-current-row
                      :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">

              <el-table-column prop="name"
                               label="宿舍名称"
                               min-width="70"
                               align="center" />
              <el-table-column prop="county"
                               label="区县"
                               min-width="60"
                               align="center" />
              <el-table-column prop="subdistrict"
                               label="街道"
                               min-width="80"
                               align="center" />

              <el-table-column prop="userCount"
                               label="宿舍人数"
                               min-width="70"
                               align="center" />
              <el-table-column prop="contactName"
                               label="负责人"
                               min-width="70"
                               align="center" />

              <el-table-column prop="address"
                               label="地址"
                               min-width="80"
                               align="center" />
              <el-table-column min-width="70"
                               align="center">
                <template slot-scope="scope">
                  <el-button size="mini"
                             @click="handleDialogSelectedRow(scope.row)">选择</el-button>
                </template>
              </el-table-column>

            </el-table>
            <div style="margin:5px;float:right">
              <el-pagination :page-sizes="[10, 20, 30, 50,100,200,500]"
                             layout="total, sizes, prev, pager, next"
                             :total="dormForm.total"
                             :page-size.sync="dormForm.size"
                             @size-change="handleDialogDormSizeChange"
                             @current-change="handleDialogDormCurrentChange" />
            </div>
          </div>
        </el-card>
        <span slot="footer"
              class="dialog-footer">

          <el-button @click="dormDialogVisible = false">关闭</el-button>

        </span>
      </el-dialog>

    </div>

  </div>
</template>
<script>

import {
  allUserQuery, queryDormitoryList,
  getWorkSections,
  getCompanyList, getDepartmentList,
  getAreasRoot, getAreasSub
} from '@/api/user'
// import { queryOutPatient, reApplyHospitalization } from '@/api/patient'
import { Message } from 'element-ui'
import moment from 'moment'

export default {
  name: 'DormStaff',
  data () {
    return {
      workSectionOptions: [],
      provinceOptions: [],
      cityOptions: [],
      dialogCountyOptions: [],
      dialogSubdistrictOptions: [],
      userTypeOptions: [
        { name: '管理员工', code: 1 },
        { name: '生产员工', code: 0 }
      ],
      assignDialogVisable: false,
      workSectionForm: {
        workSectionCode: '',
        userId: 0
      },
      dormForm: {
        condition: '',

        province: '330000',
        city: '330100',
        county: '',
        subdistrict: '',
        page: 1,
        size: 10,
        total: 0
      },
      companyOptions: [],
      departmentOptions: [],
      tableData: [

      ],
      dormTableData: [],
      dormLoading: false,
      loading: false,
      form: {
        condition: '',
        dormitoryId: null,
        dormitoryName: '',
        provinceCode: '',
        userType: null,
        cityCode: '',
        workSectionCode: null,
        size: 20,
        page: 1
      },

      dormDialogVisible: false,

      total: 0
    }
  },
  created () {
    this.initOptions()
  },
  mounted () {
    this.onSearch()
  },
  methods: {

    // 判断null
    isNullRetu (val) {
      return val === null ? '' : val
    },
    formGend (row) {
      return row.gender === 'Male' ? '男' : '女'
    },

    formTrackTime (row) {
      if (row.trackCodeUpdateTime) {
        return moment(row.trackCodeUpdateTime).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    formUploadTime (val) {
      return val === null ? '' : moment(val).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterGend (val) {
      return val === 'Male' ? '男' : '女'
    },
    initOptions () {
      getWorkSections().then(res => {
        this.workSectionOptions = res.dataContent
      }).catch(err => {
        Message.error(err.message)
      })

      getCompanyList().then(res => {
        this.companyOptions = res.dataContent
      }).catch(err => {
        console.log(err.message)
        Message.error(err.message)
      })
      getAreasRoot().then(res => {
        this.provinceOptions = res.dataContent
      }).catch(err => {
        console.log(err.message)
        Message.error(err.message)
      })

      getAreasSub(this.dormForm.city).then(res => {
        this.dialogCountyOptions = res.dataContent
      }).catch(err => {
        console.log(err.message)
        Message.error(err.message)
      })
    },
    handleCompanyChanged (val) {
      getDepartmentList({ companyCode: val }).then(res => {
        this.departmentOptions = res.dataContent
      }).catch(err => {
        console.log(err.message)
        Message.error(err.message)
      })
    },
    handleDialogCountyChanged (val) {
      getAreasSub(val).then(res => {
        this.dialogSubdistrictOptions = res.dataContent
      }).catch(err => {
        console.log(err.message)
        Message.error(err.message)
      })
    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    restQuery () {
      this.form = {
        condition: '',
        dormitoryId: null,
        dormitoryName: '',
        provinceCode: '',
        userType: null,
        cityCode: '',
        workSectionCode: null,
        size: 20,
        page: 1
      }
      this.query()
    },
    query () {
      this.loading = true

      if (this.form.dormitoryId === '') {
        this.form.dormitoryId = null
      }
      allUserQuery(this.form).then(res => {
        this.tableData = res.dataContent.records
        this.total = res.dataContent.total
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },

    dormQuery () {
      this.dormLoading = true

      queryDormitoryList(this.dormForm).then(res => {
        this.dormTableData = res.dataContent.records
        this.dormForm.total = res.dataContent.total
        this.dormLoading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },

    onDialogDormSearch () {
      this.dormForm.page = 1
      this.dormQuery()
    },
    handleSizeChange (val) {
      this.form.size = val
      this.query()
    },
    handleDialogDormSizeChange (val) {
      this.dormForm.size = val
      this.dormQuery()
    },

    handleCurrentChange (val) {
      this.form.page = val
      this.query()
    },

    handleDialogDormCurrentChange (val) {
      this.dormForm.page = val
      this.dormQuery()
    },

    handleSelectDorm () {
      this.dormDialogVisible = true
      this.dormQuery()
    },

    handleSelectedDorm () {
      this.dormDialogVisible = false
    },

    handleClearProvince () {
      this.cityOptions = []
      this.form.city = ''
      this.form.province = ''
    },
    handleDialogCountyClear () {
      this.dormForm.subdistrict = ''
      this.dialogSubstrictOptions = []
    },
    handleChangeProvince (val) {
      getAreasSub(val).then(res => {
        this.cityOptions = res.dataContent
      }).catch(err => {
        console.log(err.message)
        Message.error(err.message)
      })
    },
    handleDialogSelectedRow (row) {
      this.form.dormitoryId = row.id
      this.form.dormitoryName = row.name

      this.dormDialogVisible = false
    },
    handleFormDormClear () {
      this.form.dormitoryId = null
      this.form.dormitoryName = ''
    }
  }
}
</script>

<style scoped>
.main {
  margin: 10px;
}
/* .el-formitemClass {
  margin-bottom: 8px;
} */
.mmnn /deep/ .myDialogClass .el-dialog .el-dialog__body {
  padding-top: 0px;
  padding-bottom: 0px;
}

.edit-form-item {
  width: 220px;
}
</style>
