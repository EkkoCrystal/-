<template>
  <div class="mmnn">
    <el-card>
      <el-form ref="formm"
               :model="form"
               :inline="true"
               size="small">
        <el-form-item label="浙江省/杭州市:">

          <el-select v-model="form.county"
                     placeholder="请选择区"
                     clearable
                     @clear="cleanCounty"
                     @change="handleMyCityChange">
            <el-option v-for="item in counties"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id" />
          </el-select>

        </el-form-item>
        <el-form-item label="街道:">
          <el-select v-model="form.subdistrict"
                     placeholder="请选择街道"
                     clearable
                     class="edit-form-item">
            <el-option v-for="item in streets"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="培训点名:">
          <el-input v-model="form.condition"
                    clearable
                    class="search-item"
                    placeholder="请输入" />
        </el-form-item>
        <!-- <el-form-item label="宿舍名:">
          <el-select
            v-model="form.condition"
            placeholder="请选择宿舍"
            class="edit-form-item"
            clearable
          >
            <el-option
              v-for="item in dormData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary"
                     @click="onSearch">查询</el-button>

          <el-button type="primary"
                     size="small"
                     @click="handleAdd">新增培训点</el-button>
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
          <el-table-column prop="name"
                           label="培训点名称"
                           min-width="70"
                           align="center" />

          <!-- <el-table-column label="行政区域"
                           align="center">
            <template slot-scope="scope">
              <div>{{scope.row.province}}/{{scope.row.city}}/{{scope.row.county}}</div>
            </template>

          </el-table-column> -->

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
          <el-table-column prop="day"
                           label="培训天数"
                           min-width="70"
                           align="center" />
          <el-table-column prop="contactName"
                           label="负责人"
                           min-width="70"
                           align="center" />
          <el-table-column prop="phoneNumber"
                           label="电话"
                           min-width="80"
                           align="center" />

          <el-table-column prop="address"
                           label="地址"
                           min-width="80"
                           align="center" />
          <el-table-column align="center"
                           label="操作"
                           min-width="100">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="text"
                         style="color:#1890FF"
                         @click="handleCode(scope.row)">查看二维码</el-button>
              <el-button size="mini"
                         type="text"
                         style="color:#1890FF"
                         @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini"
                         type="text"
                         style="color:#D43030"
                         @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
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
    <el-dialog :close-on-click-modal="false"
               title="培训点信息"
               :visible.sync="dialogVisible"
               width="700px"
               @open="initStreets">
      <el-card>
        <div style="margin:20px">
          <el-form ref="dormForm"
                   :rules="dormFormRules"
                   :model="dorm"
                   size="small"
                   label-width="120px">
            <el-form-item label="浙江省/杭州市:">
              <el-select v-model="dorm.county"
                         placeholder="请选择区"
                         @change="handleMyCityChange">
                <el-option v-for="item in counties"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id" />
              </el-select>

            </el-form-item>
            <el-form-item label="街道:">
              <el-select v-model="dorm.subdistrict"
                         placeholder="请选择街道"
                         class="edit-form-item">
                <el-option v-for="item in streets"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="地址:"
                          prop="address">
              <el-input v-model="dorm.address"
                        placeholder="请输入地址" />
            </el-form-item>
            <el-form-item label="培训点名称:"
                          prop="name">
              <el-input v-model="dorm.name"
                        placeholder="请输入培训点名称" />
            </el-form-item>
            <el-form-item label="培训天数:"
                          prop="day">
              <el-input v-model="dorm.day"
                        placeholder="请输入培训天数" />
            </el-form-item>
            <el-form-item label="负责人:"
                          prop="contactName">
              <el-input v-model="dorm.contactName"
                        placeholder="请输入" />
            </el-form-item>
            <el-form-item label="负责人电话:"
                          prop="phoneNumber">
              <el-input v-model="dorm.phoneNumber"
                        type="tel"
                        placeholder="请输入" />
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="dorm.remark"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入" />
            </el-form-item>
            <!-- 新增定位 -->
            <el-form-item label="定位地址:"
                          prop="longitude">
              <el-input v-model="dorm.address"
                        style="width:50%"
                        :disabled="true" />
              <el-button size="mini"
                         type="text"
                         style="color:#1890FF"
                         @click="handleMark">定位</el-button>
              <!-- <el-button
                v-if="dorm.longitude === '' || dorm.longitude === null"
                type="warning">未定位</el-button>
              <el-button
                v-else
                type="success">已定位</el-button> -->

            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false"
               title="宿舍二维码"
               :visible.sync="codeDialogVisible"
               width="500px">
      <el-card>
        <div id="dormCodeID"
             style="text-align:center;margin: auto 0">

          <div class="ooppOne">培训点名：{{ dormCode.name }}</div>
          <div class="oopp">负责人：{{ dormCode.contactName }}</div>
          <div class="oopp">电话：{{ dormCode.phoneNumber }}</div>
          <div class="oopp">地址：{{ dormCode.address }}</div>
          <vue-qr :text="dormCode.code"
                  :size="400" />
        </div>
      </el-card>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="codeDialogVisible = false">取 消</el-button>
        <el-button v-print="dormPrintObj"
                   type="primary"
                   @click="handlePrintCode">打 印</el-button>
      </span>
    </el-dialog>
    <!-- 百度地图 -->
    <el-dialog :close-on-click-modal="false"
               title="选择地点"
               :visible.sync="mapDialogVisible"
               width="700px">
      <el-form ref="formm"
               :inline="true"
               size="small">
        <el-form-item label="输入地址:">
          <el-input v-model="dorm.address"
                    clearable
                    class="search-item"
                    placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="searchPlace()">查询</el-button>
          <el-button @click="mapDialogVisible = false">确 定</el-button>
        </el-form-item>
      </el-form>
      <el-input ref="sss"
                :disabled="true" />
      <baidu-map class="bm-view"
                 :center="mapCenter"
                 :zoom="mapZoom"
                 :scroll-wheel-zoom="true"
                 :auto-viewport="true"
                 style="width:100%;height:500px;"
                 @ready="handler">
        <bm-marker :position="mapCenter"
                   :dragging="true" />
      </baidu-map>
    </el-dialog>
  </div>
</template>
<script>

import {
  getQuarantineSites, addQuarantineSites, modifyQuarantineSites,
  getAreasSub, deleteDormitory
} from '@/api/user'
import { Message } from 'element-ui'
import vueQr from 'vue-qr'
// import moment from 'moment'
import { BaiduMap } from 'vue-baidu-map'
export default {
  name: 'Dorm',
  components: {
    vueQr,
    BaiduMap
  },
  data () {
    return {
      tableData: [

      ],
      counties: [],
      streets: [],
      loading: false,
      form: {
        condition: '',
        community: '',
        county: '',
        subdistrict: '',
        quarantineArea: false,
        size: 20,
        page: 1
      },

      dormData: [],
      dialogVisible: false,
      codeDialogVisible: false,
      dormCode: {
        code: '',
        name: '',
        contactName: '',
        phoneNumber: '',
        address: ''
      },
      dormPrintObj: {
        id: 'dormCodeID',
        popTitle: '宿舍二维码',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>,<style> #dormCodeID { text-align:center;height: auto !important; } <style>'
      },
      // 地图相关
      BMap: null,
      map: null,
      mapDialogVisible: false,
      mapCenter: { lng: 120.069338, lat: 30.326935 },
      mapZoom: 18,
      dorm: {
        id: 0,
        name: '',
        province: '330000',
        city: '330100',
        day: 7,

        county: '',
        subdistrict: '',
        community: '',
        address: '',
        contactName: '',
        phoneNumber: '',
        quarantineArea: false,
        remark: '',
        latitude: null,
        longitude: null,
        // location: '浙江省杭州市振中路210号',
        isEdit: false
      },
      dormFormRules: {
        county: [
          { required: true, message: '行政区必须选择', trigger: 'blur' }

        ],
        subdistrict: [
          { required: true, message: '行政街道必须选择', trigger: 'blur' }
        ],

        day: [
          { required: true, message: '培训天数必须输入', trigger: 'blur' }
        ],

        name: [
          { required: true, message: '宿舍名称必须输入', trigger: 'blur' },
          { min: 2, max: 30, message: '宿舍名称2-30位字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '地址必须选择', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '负责人必须输入', trigger: 'blur' },
          { min: 2, max: 10, message: '姓名2-10位字符', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '负责人电话必须输入', trigger: 'blur' },
          { min: 6, max: 11, message: '手机长度是8-18位数字', trigger: 'blur, change' }
        ],
        longitude: [
          { required: true, message: '点击左边的定位按钮为在地图上定位', trigger: 'blur' }
        ]
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
    initOptions () {
      getAreasSub('330100').then(res => {
        //         // 处理数据this.handleCity()
        this.counties = res.dataContent
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
      })
    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    cleanCounty () {
      this.streets = []
      this.form.subdistrict = ''
    },
    query () {
      this.loading = true

      getQuarantineSites(this.form).then(res => {
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

    handleMyCityChange (code) {
      if (code === undefined || code === null || code === '') {
        console.log('空的选择')
      } else {
        this.loadStreet(code)
      }

    },

    loadStreet (code) {
      getAreasSub(code).then(res => {
        console.log(res)
        if (res.dataContent !== null && res.dataContent.length > 0) {
          this.streets = res.dataContent
        }
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
      })
    },
    handleSave () {
      this.$refs.dormForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.dorm.isEdit) {
            modifyQuarantineSites(this.dorm).then(res => {
              this.loading = false
              Message.success('修改宿舍信息成功')
              this.query()
              this.clearData()
              this.dialogVisible = false
            }).catch(err => {
              console.log(err)
              Message.error(err.message)
              this.loading = false
            })
          } else {
            addQuarantineSites(this.dorm).then(res => {
              this.loading = false
              Message.success('新增宿舍成功')
              this.query()
              this.clearData()
              this.dialogVisible = false
            }).catch(err => {
              console.log(err)
              Message.error(err.message)
              this.loading = false
            })
          }
        }
      })
    },
    handleAdd () {
      this.clearData()
      this.dialogVisible = true
    },
    // 定位
    handleMark () {
      this.mapDialogVisible = true
    },
    handler ({ BMap, map }) {
      this.BMap = BMap
      this.map = map
      const that = this
      var myGeo = new BMap.Geocoder()
      if (this.dorm.longitude !== null && this.dorm.latitude !== null) {
        const point = new BMap.Point(this.dorm.longitude, this.dorm.latitude)
        this.mapCenter.lng = point.lng
        this.mapCenter.lat = point.lat
        this.mapZoom = 18
        map.clearOverlays()
        map.centerAndZoom(point, 18)
        var marker = new BMap.Marker(point, { title: that.dorm.address })
        map.addOverlay(marker)
        // myGeo.getLocation(point, function (rs) {
        //   console.log(rs)
        //   var addComp = rs.surroundingPois
        //   if (addComp !== null && addComp.length > 0) {
        //     map.clearOverlays()
        //     that.dorm.addressKeyword = addComp[0].title
        //     that.dorm.longitude = addComp[0].point.lng
        //     that.dorm.latitude = addComp[0].point.lat
        //     var marker = new BMap.Marker(new BMap.Point(that.dorm.longitude, that.dorm.latitude), { title: that.dorm.addressKeyword })
        //     map.addOverlay(marker)
        //   }
        // })
      } else {
        // 创建地址解析器实例
        myGeo.getPoint(this.dorm.address, function (point) {
          if (point) {
            console.log(point)
            map.clearOverlays()
            that.dorm.longitude = point.lng
            that.dorm.latitude = point.lat
            that.mapCenter.lng = point.lng
            that.mapCenter.lat = point.lat
            that.mapZoom = 18
            map.centerAndZoom(point, 18)
            map.addOverlay(new BMap.Marker(point, { title: that.dorm.address }))
          } else {
            Message.error('您选择的地址没有解析到结果！')
          }
        }, '杭州市')
      }

      map.addEventListener('click', function (e) {
        // 清除地图上所有的覆盖物
        map.clearOverlays()
        console.log(e)
        var pt = e.point
        console.log(pt)

        myGeo.getLocation(pt, function (rs) {
          console.log('-------------------------')
          console.log(rs)
          var addComp = rs.surroundingPois
          if (addComp !== null && addComp.length > 0) {
            that.dorm.address = addComp[0].title
            that.dorm.longitude = addComp[0].point.lng
            that.dorm.latitude = addComp[0].point.lat
            var marker = new BMap.Marker(new BMap.Point(pt.lng, pt.lat), { title: that.dorm.address })
            map.addOverlay(marker)
          }
        })
      })
    },
    searchPlace () {
      const that = this
      var myGeo = new that.BMap.Geocoder()
      // const map = new that.BMap()
      console.log(this.dorm.address)
      myGeo.getPoint(that.dorm.address, function (point) {
        if (point) {
          console.log(point)
          that.map.clearOverlays()
          that.mapCenter = point
          that.dorm.longitude = point.lng
          that.dorm.latitude = point.lat
          that.map.centerAndZoom(point, 18)
          that.map.addOverlay(new that.BMap.Marker(point, { title: that.dorm.address }))
        } else {
          alert('您选择的地址没有解析到结果！')
        }
      }, '杭州市')
    },
    // 查看二维码
    handleCode (row) {
      console.log(row.qrCode)
      console.log('查看二维码')
      if (row.qrCode === null || row.qrCode === 'undefined') {
        return
      }
      this.clearCodeData()
      this.dormCode = {
        code: row.qrCode,
        name: row.name,
        contactName: row.contactName,
        phoneNumber: row.phoneNumber,
        address: row.address
      }
      this.codeDialogVisible = true
    },
    handlePrintCode () {
      console.log('打印')
    },
    // 编辑加载街道
    initStreets () {
      if (this.dorm.isEdit) {
        this.loadStreet(this.dorm.county)
      }
    },
    handleEdit (row) {
      this.dorm = {
        id: row.id,
        day: row.day,
        name: row.name,
        address: row.address,
        county: parseInt(row.countyCode),
        subdistrict: parseInt(row.subdistrictCode),
        contactName: row.contactName,
        phoneNumber: row.phoneNumber,
        quarantineArea: false,
        latitude: row.latitude,
        longitude: row.longitude,
        community: row.community,
        // location: row.location,
        remark: row.remark,
        isEdit: true
      }
      this.dialogVisible = true
    },

    handleDelete (row) {
      console.log('删除')
      this.$confirm('此操作将永久删除该培训点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDormitory(row.id).then(res => {
          if (res.code === '0') {
            this.query()
            Message.success('删除培训点成功')
          } else {
            Message.success('操作失败')
          }
        }).catch(err => {
          Message.error('删除培训点失败:' + err.message)
          console.log(err)
        })
      })
    },
    clearData () {
      this.dorm = {
        id: 0,
        name: '',
        day: 0,
        province: '330000',
        city: '330100',
        address: '',
        contactName: '',
        phoneNumber: '',
        quarantineArea: false,
        community: '',
        remark: '',
        latitude: null,
        longitude: null,
        //  location: '浙江省杭州市振中路210号',
        isEdit: false
      }
    },
    clearCodeData () {
      this.dormCode = {
        code: '',
        name: '',
        contactName: '',
        phoneNumber: '',
        address: ''
      }
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
.oopp {
  margin-top: 10px;
}
</style>
