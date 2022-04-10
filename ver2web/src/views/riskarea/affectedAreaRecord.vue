<template>
  <div class="mmnn">
    <el-card>
      <div slot="header"
           class="clearfix">
        <el-form v-model="form"
                 :inline="true"
                 size="small">

          <el-form-item label="关键字:">
            <el-input v-model="form.condition"
                      class="search-item"
                      placeholder="工号/姓名" />
          </el-form-item>
          <el-form-item label="风险等级:">
            <el-select v-model="form.level"
                       placeholder="请选择"
                       class="edit-form-item"
                       clearable>
              <el-option v-for="item in affectlevels"
                         :key="item.code"
                         :label="item.name"
                         :value="item.code" />
            </el-select>
          </el-form-item>

          <el-form-item label="处理措施:">
            <el-select v-model="form.solution"
                       placeholder="请选择"
                       class="edit-form-item"
                       clearable>
              <el-option v-for="item in affectSolutions"
                         :key="item.code"
                         :label="item.name"
                         :value="item.code" />
            </el-select>

          </el-form-item>
          <el-form-item label="风险原因:">
            <el-select v-model="form.reason"
                       placeholder="请选择"
                       class="edit-form-item"
                       clearable>
              <el-option v-for="item in affectReasons"
                         :key="item.code"
                         :label="item.name"
                         :value="item.code" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button style="margin-left: 20px"
                       type="primary"
                       @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table v-loading="loading"
                  :data="tableData"
                  style="width: 100%"
                  border
                  highlight-current-row
                  :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
          <el-table-column prop="workSectionDisplay"
                           label="园区"
                           min-width="50"
                           align="center" />
          <el-table-column prop="workId"
                           label="工号"
                           min-width="70"
                           align="center" />

          <el-table-column prop="userName"
                           label="姓名"
                           min-width="70"
                           align="center" />
          <el-table-column prop="gender"
                           label="性别"
                           :formatter="formGend"
                           min-width="50"
                           align="center" />

          <el-table-column prop="inoculations"
                           label="疫苗接种"
                           min-width="100"
                           align="center" />

          <el-table-column prop="levelDes"
                           label="风险等级"
                           min-width="50"
                           align="center" />
          <el-table-column prop="reason"
                           label="风险原因"
                           min-width="130"
                           align="center" />
          <el-table-column prop="reliveReason"
                           label="解除原因"
                           min-width="80"
                           align="center" />
          <el-table-column prop="solutionDes"
                           label="处理措施"
                           min-width="80"
                           align="center" />

        </el-table>
      </div>
      <div style="margin:5px;float:right">
        <el-pagination :page-sizes="[10, 20, 30, 50]"
                       layout="total, sizes, prev, pager, next"
                       :total="total"
                       :page-size.sync="form.size"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange" />
      </div>
    </el-card>

  </div>
</template>
<script>
import { getaffectedAreaRecord, getAffectlevels, getAffectSolutions, getAffectReason, getReliveReasons } from '@/api/user'

import { Message } from 'element-ui'
import moment from 'moment'

export default {
  name: 'AffectedAreaRecord',
  data () {
    return {
      tableData: [],
      loading: false,
      form: {
        condition: '',
        reason: '',
        solution: '',
        level: '',
        size: 20,
        page: 1
      },
      dialogVisible: false,
      staffObj: {},
      activePaneName: 'first',
      affectlevels: [],
      affectSolutions: [],
      affectReasons: [],
      reliveReasons: [],
      reaDialogVisible: false,
      reliveRea: {
        id: '',
        reason: ''
      },
      reliveReaRules: {
        reason: [
          { required: true, message: '排除风险原因必须输入', trigger: 'blur' }
        ]
      },
      staff: {
        id: '',
        workId: '',
        userName: '',
        gender: '',
        birthday: '',
        idCard: '',
        phoneNumber: '',
        trackCodeUpdateTime: '',
        hasWarn: '',
        travelCities: '',
        relations: [],
        censusAddress: '',
        residenceAddress: '',
        trackCode: ''
      },
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
    formatterProcessed (row) {
      return row.processed === false ? '待处理' : '已处理'
    },
    formTravels (row) {
      var city = ''
      if (row.userTravels) {
        row.userTravels.forEach(element => {
          city += element.province + element.city + '\n'
        })
      }
      return city
    },
    formattPeo1 (arr) {
      if (arr !== undefined && arr !== null && (arr instanceof Array)) {
        if (arr.length >= 1) {
          return arr[0].name
        }
      }
    },
    formattPeo2 (arr) {
      if (arr !== undefined && arr !== null && (arr instanceof Array)) {
        if (arr.length >= 1) {
          return arr[1].name
        }
      }
    },
    formatterAdress (obj) {
      if (obj !== undefined && obj !== null && (obj instanceof Object)) {
        const string = this.isNullRetu(obj.province) + this.isNullRetu(obj.city) + this.isNullRetu(obj.county) + this.isNullRetu(obj.address) + this.isNullRetu(obj.subdistrict)
        return string
      }
    },
    // 判断null
    isNullRetu (val) {
      return val === null ? '' : val
    },
    formGend (row) {
      return row.gender === 'Male' ? '男' : '女'
    },
    formatterLevel (row) {
      if (row.level === 'High') {
        return '高风险'
      }
    },
    formTrackTime (row) {
      if (row.birthday) {
        return moment(row.birthday).format('YYYY-MM-DD')
      }
    },
    formUploadTime (val) {
      return val === null ? '' : moment(val).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterGend (val) {
      return val === 'Male' ? '男' : '女'
    },
    initOptions () {
      this.loading = true
      getAffectlevels().then(res => {
        this.affectlevels = res.dataContent
        this.loading = false
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
        this.loading = false
      })
      getAffectSolutions().then(res => {
        this.affectSolutions = res.dataContent
        this.loading = false
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
        this.loading = false
      })
      getAffectReason().then(res => {
        this.affectReasons = res.dataContent
        this.loading = false
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
        this.loading = false
      })
      getReliveReasons().then(res => {
        this.reliveReasons = res.dataContent
        this.loading = false
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
        this.loading = false
      })
    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    query () {
      this.loading = true
      getaffectedAreaRecord(this.form).then(res => {
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
    }
  }
}
</script>
<style scoped>
.main {
  margin: 10px;
}
.el-formitemClass {
  margin-bottom: 1px;
}
.mmnn /deep/ .myDialogClass .el-dialog .el-dialog__body {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
