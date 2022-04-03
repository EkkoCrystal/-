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
            placeholder="请输入姓名或手机号" />
        </el-form-item>
        <el-form-item label="省/市/区:" prop="valueData">
          <el-cascader
            ref="cityCasc"
            v-model="form.valueData"
            :props="props"
            filterable
            clearable
            @change="handleMyCityChange" />
        </el-form-item>
        <el-form-item label="检测结果:">
          <el-select
            v-model="form.value"
            placeholder="请选择">
            <el-option
              v-for="item in results"
              :key="item.value"
              :label="item.name"
              :value="item.value" />
          </el-select>
        </el-form-item>
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
            prop="person"
            label="姓名"
            min-width="70"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.person !== null">
                <span>{{ scope.row.person.name }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="genderDisplay"
            label="姓别"
            min-width="70"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.person !== null">
                <span>{{ scope.row.person.genderDisplay }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="idCard"
            label="身份证号"
            min-width="120"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.person !== null">
                <span>{{ scope.row.person.idCard }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="phoneNumber"
            label="联系方式"
            min-width="100"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.person !== null">
                <span>{{ scope.row.person.phoneNumber }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="resultDisplay"
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

import { getAffectedRecords, getAreasRoot, getAreasSub } from '@/api/user'
import { Message } from 'element-ui'
// import vueQr from 'vue-qr'
import moment from 'moment'
// import MyTreeselect from '@/components/common/MyTreeselect.vue'

export default {
  // components: {
  //   MyTreeselect
  // },
  data () {
    return {
      dd: true,
      tableData: [],
      counties: [],
      streets: [],
      loading: false,
      codeUrl: null,
      codeDialogVisible: false,
      form: {
        valueData: [],
        condition: '',
        province: '',
        city: '',
        county: '',
        value: '',
        size: 20,
        page: 1
      },
      results: [
        {
          value: '',
          name: '所有'
        },
        {
          value: 'Neg',
          name: '阴性'
        },
        {
          value: 'Pos',
          name: '阳性'
        }
      ],
      pageSize: 30,
      exportTableData: [],
      total: 0,
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          const { level } = node
          if (level === 0) {
            getAreasRoot().then(res => {
              const arrArr = res.dataContent
              if (arrArr !== null && arrArr !== undefined && arrArr.length >= 0) {
                const arr = arrArr.map((e) => ({ value: e.id, label: e.name, leaf: level >= 2 }))
                resolve(arr) // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              }
            }).catch(err => {
              Message.error(err.message)
            })
          } else {
            getAreasSub(node.value).then(res => {
              // 处理数据this.handleCity()
              const arrArr = res.dataContent
              if (arrArr !== null && arrArr !== undefined && arrArr.length >= 0) {
                const arr = arrArr.map((e) => ({ value: e.id, label: e.name, leaf: level >= 2 }))
                resolve(arr) // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              }
            }).catch(err => {
              Message.error(err.message)
            })
          }
        }
      }
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
      if (row.person.censusAddress !== null) {
        return this.testString(row.person.censusAddress.province) +
        this.testString(row.person.censusAddress.city) +
        this.testString(row.person.censusAddress.county) +
        this.testString(row.person.censusAddress.subdistrict) +
        this.testString(row.person.censusAddress.address)
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
    handleMyCityChange (node) {
      const nodeArr = this.$refs.cityCasc.getCheckedNodes()
      console.log(nodeArr)
      console.log('444444444444444')
      this.form.province = ''
      this.form.city = ''
      this.form.county = ''
      if (nodeArr && nodeArr.length > 0) {
        const nodeObj = nodeArr[0].pathLabels
        console.log(nodeObj)
        console.log(nodeObj[0])
        this.form.province = nodeObj[0]
        this.form.city = nodeObj[1]
        this.form.county = nodeObj[2]
      }
    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    query () {
      this.loading = true
      getAffectedRecords(this.form).then(res => {
        console.log(res)
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
        query: { id: row.person.userId, isUser: 'false' }
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
      const filterVal = ['name', 'genderDisplay', 'idCard', 'phoneNumber', 'result', 'creationTime', 'addressDisplay', 'censusAddress']
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
              obj.name = element.person.name
              obj.genderDisplay = element.person.genderDisplay
              obj.idCard = element.person.idCard
              obj.phoneNumber = element.person.phoneNumber
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
