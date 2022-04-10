<template>
  <div class="kkl">
    <el-card>
      <el-form v-model="form"
               :inline="true"
               size="small"
               label-width="100px">
        <el-row>
          <el-col>
            <el-form-item label="地区:">
              <el-select v-model="form.province"
                         placeholder="请选择省份"
                         class="edit-form-item"
                         clearable>
                <el-option v-for="item in provinces"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id" />
              </el-select>
              <!-- <div style="width:200px;height:32px">
                <my-treeselect ref="selPlaceTree" :value="form.placeValue" :mydata="options" @changeSel="changePlaceSelHandle" @inputChanging="inoutPlaceChangeHandle" />
              </div> -->
            </el-form-item>
            <el-form-item label="风险等级:">
              <el-select v-model="form.dangerLevel"
                         placeholder="请选择"
                         class="edit-form-item"
                         clearable>
                <el-option v-for="item in dangerLevels"
                           :key="item.code"
                           :label="item.name"
                           :value="item.code" />
              </el-select>
              <!-- <div style="width:200px;height:32px">
                <my-treeselect ref="selPlaceTree" :value="form.placeValue" :mydata="options" @changeSel="changePlaceSelHandle" @inputChanging="inoutPlaceChangeHandle" />
              </div> -->
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         style="margin-left:20px"
                         @click="query">查询</el-button>

              <!-- <el-button
                v-loading="buttonLoading"
                type="primary"
                @click="vuePrint"
              >打印</el-button> -->
              <el-button type="primary"
                         size="small"
                         @click="handleNewReagent">新增风险地区</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <div style="margin: 10px">
          <el-table v-loading="loading"
                    :data="tableData"
                    style="width: 100%"
                    class="vue-print-table"
                    border
                    highlight-current-row
                    :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
            <el-table-column prop="province"
                             label="省"
                             min-width="140"
                             align="center" />
            <el-table-column prop="city"
                             label="市"
                             min-width="100"
                             align="center" />
            <el-table-column prop="county"
                             label="区/县"
                             min-width="100"
                             align="center" />
            <el-table-column prop="subdistrict"
                             label="街道"
                             align="center"
                             min-width="120" />
            <el-table-column prop="address"
                             label="详细地址"
                             align="center"
                             min-width="140" />
            <el-table-column prop="levelDisplay"
                             label="风险等级"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.level === 'High'"
                      style="color:red">
                  高风险
                </span>
                <span v-if="scope.row.level === 'Medium'"
                      style="color:#FFA500">
                  中风险
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="startDate"
                             label="追溯时间"
                             :formatter="formStartTime"
                             align="center"
                             min-width="120" />
            <el-table-column label="操作"
                             align="center"
                             min-width="100">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  style="color:#1890FF"
                  @click="handleEditLevel(scope.row)">编辑风险等级</el-button>
                <el-button size="mini"
                           type="text"
                           style="color:#D43030"
                           @click="handleDeleteReagent(scope.row)">删除</el-button>
              </template>
            </el-table-column>
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
    <div class="dialogAdd">
      <el-dialog :close-on-click-modal="false"
                 title="新增风险地区"
                 :visible.sync="dialogVisible"
                 width="700px">
        <el-card>
          <div>
            <el-form ref="riskAreaForm"
                     :model="riskArea"
                     :rules="riskAreaRules"
                     size="small"
                     label-width="110px">
              <el-form-item label="省/市:" prop="value">
                <!-- <div style="width:100%"> -->
                <!-- <my-treeselect ref="selAllSelTree" class="ggMyTree" :value="riskArea.placeValue" :mydata="options" @changeSel="changeAddSelHandle" @inputChanging="inoutAddChangeHandle" /> -->
                <el-cascader ref="cityCasc"
                             v-model="riskArea.value"
                             style="width:60%"
                             :props="props"
                             filterable
                             @change="handleMyCityChange" />
                <!-- </div> -->
              </el-form-item>
              <el-form-item label="区域:">
                <el-select v-model="riskArea.county"
                           placeholder="请选择区域"
                           class="edit-form-item"
                           label-in-value="true"
                           clearable
                           filterable
                           style="width:60%"
                           @blur="selectBlur"
                           @clear="selectClear"
                           @change="handleMyCountryChange">
                  <el-option v-for="item in countrys"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id" />
                </el-select>
              </el-form-item>
              <!-- :rules="{
                      required: true, message: '街道不能为空', trigger: 'blur'
                    }" -->
              <el-form-item v-for="(domain, index) in riskArea.subdistricts"
                            :key="domain.key" label="街道-详细地址:">
                <el-col :span="8">
                  <el-form-item
                    :prop="'subdistricts.' + index + '.subdistrict'">
                    <el-input v-model="domain.subdistrict" type="textarea" autosize />
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="1" style="text-align:center">-</el-col>
                <el-col :span="8">
                  <el-form-item>
                    <el-input v-model="domain.address" type="textarea" autosize />
                  </el-form-item>
                </el-col>
                <el-col :span="7" style="padding-left:8px">
                  <el-button v-if="index+1 === riskArea.subdistricts.length" size="mini" type="primary" @click="addItem">增加</el-button>
                  <el-button size="mini" @click.prevent="removeDomain(domain)">删除</el-button>
                </el-col>
              </el-form-item>
              <!-- </el-form-item> -->

              <el-form-item label="风险等级"
                            prop="level">
                <el-select v-model="riskArea.level"
                           placeholder="请选择风险等级"
                           style="width:60%">
                  <el-option v-for="item in dangerLevels"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code" />
                </el-select>
              </el-form-item>
              <el-form-item label="追溯日期"
                            prop="startDate">
                <el-date-picker v-model="riskArea.startDate"
                                style="width:60%"
                                type="date"
                                placeholder="选择日期" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="handleCreateReagent">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      title="修改风险等级"
      :visible.sync="dialogVisibleLevel"
      width="500px">
      <el-card>
        <div>
          <el-form ref="riskAreaForm"
                   :model="riskAreaLevel"
                   size="small"
                   label-width="100px">
            <el-form-item label="风险等级"
                          prop="level">
              <el-select v-model="riskAreaLevel.level"
                         placeholder="请选择风险等级"
                         style="width:60%">
                <el-option v-for="item in dangerLevels"
                           :key="item.code"
                           :label="item.name"
                           :value="item.code" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisibleLevel = false">取 消</el-button>
        <el-button type="primary"
                   @click="editLevel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { getAffectedArea,
  deleteAffectedArea,
  getAreasRoot, getAreasSub,
  getAffectlevels, addAffectedAreaBatch, modifyAffectedLevel
} from '@/api/user'
import moment from 'moment'
import { Message } from 'element-ui'
// import MyTreeselect from '@/components/common/MyTreeselect.vue'
// components: {
//   MyTreeselect
// },
// import { addPrintStyle } from '@/utils/index'
export default {
  name: 'Riskarea',

  data () {
    // const that = this
    return {
      value: [],
      options: [],
      provinces: [],
      dangerLevels: [
      ],
      // 省
      tableData: [],
      // 区域
      countrys: [],
      // 街道
      streets: [],
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      dynamicAddressTags: [],
      inputAddressVisible: false,
      inputAddressValue: '',
      countText: '',

      loading: false,
      form: {
        province: '',
        dangerLevel: '',
        size: 20,
        page: 1
      },
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          const { level } = node
          if (level === 0) {
            getAreasRoot().then(res => {
              const arrArr = res.dataContent
              if (arrArr !== null && arrArr !== undefined && arrArr.length >= 0) {
                const arr = arrArr.map((e) => ({ value: e.id, label: e.name, leaf: level >= 1 }))
                resolve(arr) // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              }
            }).catch(err => {
              console.log(err)
              Message.error(err.message)
              this.loading = false
            })
          } else {
            getAreasSub(node.value).then(res => {
              // 处理数据this.handleCity()
              const arrArr = res.dataContent
              if (arrArr !== null && arrArr !== undefined && arrArr.length >= 0) {
                const arr = arrArr.map((e) => ({ value: e.id, label: e.name, leaf: level >= 1 }))
                resolve(arr) // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                console.log(arr)
              }
            }).catch(err => {
              console.log(err)
              Message.error(err.message)
            })
          }
        }
      },
      total: 0,
      buttonLoading: false,
      riskArea: {
        value: [],
        province: '',
        city: '',
        county: '',
        level: '',
        startDate: '',
        subdistricts: [
          {
            subdistrict: '',
            address: ''
          }
        ]
      },
      riskAreaRules: {
        value: [
          { required: true, message: '省市必须输入', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '风险等级必须输入', trigger: 'blur' }
        ]
      },
      // riskAdreess: [
      //     { required: true, message: '详细地址必须输入', trigger: 'blur' }
      //   ],
      dialogVisible: false,
      // 风险等级
      dialogVisibleLevel: false,
      riskAreaLevel: {
        id: '',
        level: ''
      }
    }
  },
  computed: {

  },
  mounted () {
    this.onSearch()
  },
  created () {
    this.initData()
  },
  methods: {
    formStartTime (row) {
      if (row.startDate) {
        return moment(row.startDate).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    initData () {
      this.loading = true
      getAreasRoot().then(res => {
        this.provinces = res.dataContent
        this.options = this.changeDepsDataName(res.dataContent)
        this.loading = false
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
        this.loading = false
      })
      getAffectlevels().then(res => {
        if (res.dataContent !== null && res.dataContent.length > 0) {
          const newFilArr = res.dataContent.filter((item, i) => {
            return item.code !== 'Low'
          })
          this.dangerLevels = newFilArr
        }
        this.loading = false
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
        this.loading = false
      })
    },
    // 处理数据
    changeDepsDataName (resData) {
      const arr = [] // 定义空数组
      resData.forEach(item => {
        const objData = {}
        objData.id = item.id
        objData.label = item.name
        objData.level = item.level
        // 懒
        objData.children = null
        arr.push(objData)
      })
      return arr
    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    query () {
      this.loading = true
      getAffectedArea(this.form).then(res => {
        console.log(res)
        if (res.code === '0') {
          this.tableData = res.dataContent.records
          this.total = res.dataContent.total
          this.loading = false
        } else {
          Message.error('访问失败')
        }
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
        this.loading = false
      })
    },

    // 新增地区
    handleNewReagent () {
      this.clearData()
      this.dialogVisible = true
    },

    handleMyCityChange (node) {
      console.log(node)
      this.clearData()
      const nodeArr = this.$refs.cityCasc.getCheckedNodes()
      if (nodeArr && nodeArr.length > 0) {
        const nodeObj = nodeArr[0]
        if (nodeObj.level === 1) {
          this.riskArea.province = nodeObj.label
          this.riskArea.value.push(nodeObj.value)
        } else {
          const parent = nodeObj.parent
          this.riskArea.province = parent.label
          this.riskArea.city = nodeObj.label
          this.riskArea.value.push(parent.value)
          this.riskArea.value.push(nodeObj.value)
          // 加载区
          this.loadCountry(nodeObj.value)
        }
      }
    },
    // 区域选择
    handleMyCountryChange (node) {
      this.riskArea.subdistricts = [
        {
          subdistrict: '',
          address: ''
        }
      ]
      if (node !== null && node !== '') {
        let obj = {}
        obj = this.countrys.find(item => {
          return item.id === node
        })
        console.log(obj)
        this.riskArea.county = obj.name
      }
    },
    selectBlur (e) {
      this.riskArea.subdistricts = [
        {
          subdistrict: '',
          address: ''
        }
      ]
      // 意见类型
      if (e.target.value !== '') {
        this.riskArea.county = e.target.value
        this.$forceUpdate() // 强制更新
      }
    },
    selectClear () {
      this.riskArea.subdistricts = [
        {
          subdistrict: '',
          address: ''
        }
      ]
      this.riskArea.county = ''
      this.$forceUpdate()
    },

    loadCountry (code) {
      this.countrys = []
      getAreasSub(code).then(res => {
        if (res.dataContent !== null && res.dataContent.length > 0) {
          this.countrys = res.dataContent
        }
      }).catch(err => {
        Message.error(err.message)
      })
    },
    addItem () {
      this.riskArea.subdistricts.push({
        subdistrict: '',
        address: ''
      })
    },
    removeDomain (item) {
      console.log(item)
      if (this.riskArea.subdistricts.length === 1) {
        return
      }
      var index = this.riskArea.subdistricts.indexOf(item)
      if (index !== -1) {
        this.riskArea.subdistricts.splice(index, 1)
      }
    },
    unique (arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.subdistrict) && res.set(arr.address, 1))
    },
    handleCreateReagent () {
      this.$refs.riskAreaForm.validate(valid => {
        if (valid) {
          if (this.riskArea.startDate === null) {
            this.riskArea.startDate = ''
          }
          // 去重
          const arr = this.unique(this.riskArea.subdistricts)
          const obj = {
            province: this.riskArea.province,
            city: this.riskArea.city,
            county: this.riskArea.county,
            level: this.riskArea.level,
            startDate: this.riskArea.startDate,
            subdistricts: arr
          }
          addAffectedAreaBatch(obj).then(res => {
            if (res.code === '0') {
              Message.success('新增风险地区成功')
              this.query()
              this.clearData()
              this.dialogVisible = false
            }
          }).catch(err => {
            Message.error(err.message)
          })
        }
      })
    },
    handleEditLevel (row) {
      this.riskAreaLevel.id = row.id
      this.riskAreaLevel.level = row.level
      this.dialogVisibleLevel = true
    },
    editLevel () {
      modifyAffectedLevel(this.riskAreaLevel).then(res => {
        if (res.code === '0') {
          this.loading = false
          Message.success('风险等级修改成功')
          this.query()
          this.clearLevelData()
          this.dialogVisibleLevel = false
        }
      }).catch(err => {
        Message.error(err.message)
      })
    },
    clearLevelData () {
      this.riskAreaLevel = {
        id: '',
        level: ''
      }
    },
    handleDeleteReagent (row) {
      this.$confirm('删除该风险地区, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAffectedArea(row.id).then(res => {
          if (res.code === '0') {
            this.query()
            Message.success('删除风险地区成功')
          } else {
            Message.error('操作失败')
          }
        }).catch(err => {
          console.log(err)
          Message.error(err.message)
          this.loading = false
        })
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
    clearData () {
      this.riskArea = {
        value: [],
        province: '',
        city: '',
        county: '',
        level: '',
        startDate: moment(new Date()).format('yyyy-MM-DD'),
        subdistricts: [
          {
            subdistrict: '',
            address: ''
          }
        ]
      }
    }
    // async vuePrint () {
    //   console.log('打印')
    // }
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

@media print {
  .print-footer {
    display: block !important;
    page-break-before: auto;
    position: fixed;
    bottom: 5px;
    right: 10px;
  }
}
</style>
