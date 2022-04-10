<template>
  <div>
    <el-card>
      <div>
        <div style="margin: 10px">
          <el-table v-loading="loading"
                    :data="tableData"
                    style="width: 100%"
                    class="vue-print-table"
                    stripe
                    border
                    highlight-current-row
                    :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
            <el-table-column label="序号"
                             type="index"
                             width="50"
                             align="center" />
            <el-table-column prop="workSectionDisplay"
                             label="园区"
                             min-width="60"
                             align="center" />
            <el-table-column prop="workId"
                             label="工号"
                             min-width="60"
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

            <el-table-column prop="phoneNumber"
                             label="联系方式"
                             min-width="90"
                             align="center" />
            <el-table-column prop="idCard"
                             label="身份证号"
                             min-width="130"
                             align="center" />
            <el-table-column prop="inoculations"
                             label="是否接种疫苗"
                             min-width="100"
                             align="center" />

            <el-table-column prop="reason"
                             label="异常原因"
                             min-width="130"
                             align="center" />
          </el-table>
        </div>
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

import { Message } from 'element-ui'
// import moment from 'moment'
import { getExceptions } from '@/api/user'

// import { Message } from 'element-ui'
// import { addPrintStyle } from '@/utils/index'
export default {
  name: 'Exception',
  data () {
    return {
      loading: false,
      tableData: [

      ],
      form: {
        size: 20,
        page: 1
      },
      dialogVisible: false,
      total: 0
    }
  },
  computed: {

  },
  created () {
    this.initData()
  },
  mounted () {
    this.onSearch()
  },
  methods: {
    formatterAdress (obj) {
      if (obj.residenceAddress) {
        if (obj.residenceAddress !== undefined && obj.residenceAddress !== null && (obj.residenceAddress instanceof Object)) {
          const string = this.isNullRetu(obj.residenceAddress.province) + this.isNullRetu(obj.residenceAddress.city) + this.isNullRetu(obj.residenceAddress.county) + this.isNullRetu(obj.residenceAddress.subdistrict) + this.isNullRetu(obj.residenceAddress.address)
          return string
        }
      }
      if (obj.censusAddress) {
        if (obj.censusAddress !== undefined && obj.censusAddress !== null && (obj.censusAddress instanceof Object)) {
          const string = this.isNullRetu(obj.censusAddress.province) + this.isNullRetu(obj.censusAddress.city) + this.isNullRetu(obj.censusAddress.county) + this.isNullRetu(obj.censusAddress.subdistrict) + this.isNullRetu(obj.censusAddress.address)
          return string
        }
      }
    },
    // 判断null
    isNullRetu (val) {
      return val === null ? '' : val
    },
    formGend (row) {
      return row.gender === 'Male' ? '男' : '女'
    },

    initData () {
    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    query () {
      this.loading = true
      getExceptions(this.form).then(res => {
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
.form-item {
  width: 200px;
}
</style>
