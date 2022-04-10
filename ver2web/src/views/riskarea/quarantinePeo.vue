<template>
  <div class="mmnn">
    <el-card>
      <el-form ref="formm"
               :model="form"
               :inline="true"
               label-width="80px"
               size="small">
        <el-form-item label="关键字:">
          <el-input v-model="form.condition"
                    class="search-item"
                    placeholder="工号/姓名" />
        </el-form-item>

        <el-form-item label="培训点:">
          <el-select v-model="form.quarantineSiteId"
                     placeholder="请选择培训点"
                     class="edit-form-item"
                     clearable>
            <el-option v-for="item in quarSites"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="培训时间:">
          <el-checkbox v-model="form.isFinished">到期</el-checkbox>

        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSearch">查询</el-button>
          <el-button @click="restQuery">重置</el-button>
          <!-- <el-button type="primary" @click="addHandle">新增</el-button> -->
        </el-form-item>
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
          <el-table-column label="序号"
                           type="index"
                           width="50"
                           align="center" />
          <el-table-column prop="workId"
                           label="工号"
                           min-width="70"
                           align="center" />
          <el-table-column prop="userName"
                           label="姓名"
                           min-width="80"
                           align="center" />
          <el-table-column prop="gender"
                           label="性别"
                           :formatter="formGend"
                           min-width="50"
                           align="center" />

          <el-table-column prop="name"
                           label="培训点"
                           min-width="100"
                           align="center" />
          <el-table-column prop="phoneNumber"
                           label="电话"
                           min-width="100"
                           align="center" />
          <el-table-column prop="remainingDay"
                           label="剩余天数"
                           min-width="80"
                           align="center" />
          <el-table-column prop="startTime"
                           label="开始时间"
                           :formatter="formTrackTime"
                           min-width="120"
                           align="center" />
          <el-table-column prop="endTime"
                           label="结束时间"
                           :formatter="formTrackTime"
                           min-width="120"
                           align="center" />

          <el-table-column prop="address"
                           label="详细地址"
                           min-width="130"
                           align="center" />
          <!-- np -->
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

import { getQuarantineUser, getQuarSites } from '@/api/user'
import { Message } from 'element-ui'
import moment from 'moment'

export default {
  name: 'QuarantinePeo',
  data () {
    return {
      tableData: [

      ],
      loading: false,
      quarSites: [],
      form: {
        quarantineSiteId: null,
        day: 0,
        isFinished: true,
        size: 20,
        page: 1
      },
      dialogVisible: false,
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
    formGend (row) {
      return row.gender === 'Male' ? '男' : '女'
    },
    formTrackTime (row) {
      if (row.startTime) {
        return moment(row.startTime).format('YYYY-MM-DD HH:mm:ss')
      }
      if (row.birthday) {
        return moment(row.birthday).format('YYYY-MM-DD HH:mm:ss')
      }
      if (row.endTime) {
        return moment(row.endTime).format('YYYY-MM-DD HH:mm:ss')
      }
    },

    formatterGend (val) {
      return val === 'Male' ? '男' : '女'
    },
    initOptions () {
      // this.onSearch()
      getQuarSites(this.form).then(res => {
        this.quarSites = res.dataContent
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    restQuery () {
      this.form = {
        quarantineSiteId: 0,
        size: 20,
        page: 1
      }
      this.query()
    },
    query () {
      this.loading = true
      if (this.form.isFinished) {
        this.form.day = 1
      } else {
        this.form.day = 0
      }
      getQuarantineUser(this.form).then(res => {
        console.log(res)
        console.log('---------545454545---------')
        this.tableData = res.dataContent.records
        this.total = res.dataContent.total
        this.loading = false
      }).catch(err => {
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
