<template>
  <div>
    <el-card>
      <el-form
        ref="formm"
        :model="form"
        :inline="true"
        size="small">
        <el-form-item label="关键词:">
          <el-input
            v-model="form.condition"
            class="search-item"
            placeholder="请输入" />
        </el-form-item>
        <!-- <el-form-item label="浙江省/杭州市:">
          <el-select
            v-model="form.county"
            placeholder="请选择区"
            @change="handleMyCityChange">
            <el-option
              v-for="item in counties"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>

        </el-form-item>
        <el-form-item label="街道:">
          <el-select
            v-model="form.subdistrict"
            placeholder="请选择街道"
            class="edit-form-item">
            <el-option
              v-for="item in streets"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button
            type="primary"
            @click="onSearch">查询</el-button>
          <el-button
            type="primary"
            @click="exportHandle">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div>
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          border
          highlight-current-row
          :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center" />
          <el-table-column
            prop="nickName"
            label="姓名"
            min-width="70"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.userInfo !== null">
                <span>{{ scope.row.userInfo.nickName }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="genderDisplay"
            label="姓别"
            min-width="70"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.userInfo !== null">
                <span>{{ scope.row.userInfo.genderDisplay }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="idCard"
            label="身份证号"
            min-width="120"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.userInfo !== null">
                <span>{{ scope.row.userInfo.idCard }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="phoneNumber"
            label="联系方式"
            min-width="100"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.userInfo !== null">
                <span>{{ scope.row.userInfo.phoneNumber }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="result"
            label="最新结果"
            min-width="70"
            align="center">
            <template slot-scope="scope">
              <div>
                <el-button
                  size="mini"
                  type="text"
                  style="color:#1890FF"
                  @click="handleEdit(scope.row.stripPath)">{{ scope.row.resultDisplay }}
                </el-button>
                <i v-if="scope.row.result !== null" class="el-icon-picture" style="color:rgba(24, 144, 255, 1)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="creationTime"
            label="自测时间"
            min-width="120"
            :formatter="timeForMatter"
            align="center" />
          <el-table-column
            prop="addressDisplay"
            label="测试地点"
            min-width="120"
            align="center" />
          <el-table-column
            label="户籍地址"
            min-width="120"
            :formatter="censusAddressMatter"
            align="center" />
          <el-table-column
            align="center"
            label="操作"
            min-width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                style="color:#1890FF"
                @click="handleDetail(scope.row)">详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin:5px;float:right">
        <el-pagination
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          :page-size.sync="form.size"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      title="检测结果"
      :visible.sync="codeDialogVisible"
      width="300px">
      <el-card>
        <el-image
          v-if="codeUrl !== null"
          :src="codeUrl"
          fit="fill">
          <div
            slot="placeholder"
            class="image-slot">
            加载中<span class="dot">...</span>
          </div>
          <div
            slot="error"
            class="image-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
        <div v-else>暂没有信息</div>
      </el-card>
    </el-dialog>
  </div>
</template>
<script>

import { getAffectedRecords } from '@/api/user'
import { Message } from 'element-ui'
// import vueQr from 'vue-qr'
import moment from 'moment'

export default {
  // components: {
  //   vueQr
  // },
  data () {
    return {
      tableData: [],
      counties: [],
      streets: [],
      loading: false,
      codeUrl: null,
      codeDialogVisible: false,
      form: {
        condition: '',
        // province: '330000',
        // city: '330100',
        // county: '',
        // province: '',
        // city: '',
        // county: '',
        size: 20,
        page: 1
      },
      pageSize: 30,
      exportTableData: [],
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
    censusAddressMatter (row) {
      if (row.userInfo.censusAddress !== null) {
        return this.testString(row.userInfo.censusAddress.province) +
        this.testString(row.userInfo.censusAddress.city) +
        this.testString(row.userInfo.censusAddress.county) +
        this.testString(row.userInfo.censusAddress.subdistrict) +
        this.testString(row.userInfo.censusAddress.address)
      }
    },
    testString (str) {
      return str !== null ? str : ''
    },
    timeForMatter (row) {
      return row.creationTime !== null ? moment(row.creationTime).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    initOptions () {

    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    query () {
      this.loading = true
      getAffectedRecords(this.form).then(res => {
        console.log(res)
        console.log('ssdadwew')
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
    },
    handleDetail (row) {
      this.$router.push({
        path: '/user/detail',
        query: { id: row.userInfo.userId }
      })
    },
    handleEdit (url) {
      this.codeUrl = url
      this.codeDialogVisible = true
    },
    exportHandle () {
      this.exportTableData = []
      const tHeader = ['姓名', '性别', '身份证号', '联系方式', '最新结果', '自测时间', '测试地点', '户籍地址']
      //
      const filterVal = ['nickName', 'genderDisplay', 'idCard', 'phoneNumber', 'result', 'creationTime', 'addressDisplay', 'censusAddress']
      const list = []
      const listData = []
      var pageCount = Math.ceil(this.total / this.pageSize)
      for (let index = 1; index < pageCount + 1; index++) {
        getAffectedRecords({
          condition: this.form.condition,
          page: index,
          size: this.pageSize
        }).then(res => {
          res.dataContent.records.forEach(item => {
            list.push(item)
          })
          if (list.length === this.total) {
            list.forEach(element => {
              const obj = {}
              obj.nickName = element.userInfo.nickName
              obj.genderDisplay = element.userInfo.genderDisplay
              obj.idCard = element.userInfo.idCard
              obj.phoneNumber = element.userInfo.phoneNumber
              obj.result = element.resultDisplay
              obj.creationTime = moment(element.creationTime).format('YYYY-MM-DD HH:mm:ss')
              obj.addressDisplay = element.addressDisplay
              obj.censusAddress = this.censusAddressMatter(element)
              listData.push(obj)
            })
            const data = this.formatJson(filterVal, listData)
            import('@/vendor/Export2Excel').then(excel => {
              excel.export_json_to_excel({
                header: tHeader, // 表头 必填
                data, // 具体数据 必填
                filename: 'excel-list', // 非必填
                autoWidth: true, // 非必填
                bookType: 'xlsx' // 非必填
              })
            }).catch(e => {})
          }
        }).catch(err => {
          Message.error(err.message)
          this.loading = false
        })
      }
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
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

</style>
