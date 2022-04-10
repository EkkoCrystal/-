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
          <el-form-item v-if="form.processed"
                        label="处理措施:">
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
      <!-- 标签页 -->
      <el-tabs v-model="activeName"
               type="card"
               @tab-click="handleClick">
        <el-tab-pane label="待处理"
                     name="first">
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
                               min-width="60"
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
              <el-table-column prop="phoneNumber"
                               label="联系方式"
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

              <el-table-column prop="userTravels"
                               label="途径区域"
                               align="center"
                               width="130">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.userTravels"
                       :key="item.city">
                    <span />{{ item.province }}{{ item.city }}
                  </div>

                </template>
              </el-table-column>
              <el-table-column label="操作"
                               align="center"
                               min-width="130">
                <template slot-scope="scope">
                  <el-button size="mini"
                             type="text"
                             style="color:#1890FF"
                             @click="handleDetail(scope.row)">详情
                  </el-button>
                  <el-button size="mini"
                             type="text"
                             style="color:#29A567"
                             @click="handleExcludeRiskDia(scope.row)">排除风险
                  </el-button>
                  <el-dropdown @command="handleCommand($event, scope.row)">
                    <span class="el-dropdown-link"
                          style="color:#1890FF">
                      操作<i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(item, index) in affectSolutions"
                                        :key="index"
                                        :command="item.code">{{ item.name }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
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
        </el-tab-pane>
        <el-tab-pane label="已处理"
                     name="second">
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
                               min-width="60"
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
              <el-table-column prop="phoneNumber"
                               label="联系方式"
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

              <el-table-column prop="performedStatus"
                               label="状态"
                               min-width="80"
                               align="center" />

              <el-table-column label="操作"
                               align="center"
                               min-width="80">
                <template slot-scope="scope">
                  <el-button size="mini"
                             type="text"
                             style="color:#1890FF"
                             @click="handleDetail(scope.row)">详情
                  </el-button>
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
        </el-tab-pane>
      </el-tabs>

    </el-card>

    <el-dialog class="myDialogClass"
               title="员工详情"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               width="720px"
               height="600px"
               center>
      <el-tabs v-model="detailActiveName"
               type="border-card">
        <el-tab-pane label="详细信息"
                     name="first">
          <el-form ref="staff"
                   style="width:100%;height:300px;"
                   :model="staffObj"
                   size="mini"
                   label-width="90px">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="工号:"
                              class="el-formitemClass">
                  <span>{{ staffObj.workId }}</span>
                </el-form-item>
                <el-form-item label="姓名:"
                              class="el-formitemClass">
                  <span>{{ staffObj.userName }}</span>
                </el-form-item>
                <el-form-item label="联系方式:"
                              class="el-formitemClass">
                  <span>{{ staffObj.phoneNumber }}</span>
                </el-form-item>
                <el-form-item label="身份证号:"
                              class="el-formitemClass">
                  <span>{{ staffObj.idCard }}</span>
                </el-form-item>
                <el-form-item label="性别:"
                              class="el-formitemClass">
                  <span>{{ formatterGend(staffObj.gender) }}</span>
                </el-form-item>

                <el-form-item label="现住址:"
                              class="el-formitemClass">
                  <span>{{ formatterAdress(staffObj.residenceAddress) }}</span>
                </el-form-item>
                <el-form-item label="籍贯:"
                              class="el-formitemClass">
                  <span>{{ formatterAdress(staffObj.censusAddress) }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-for="item in staffObj.relations"
                              :key="item.relationType"
                              :label="item.relationType">
                  {{ item.name }}(电话:{{ item.phoneNumber }})
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="途径区域"
                     name="second">
          <el-timeline v-if="staffObj.userTravels !== null"
                       style="margin-top: 10px;height:300px;">
            <el-timeline-item v-for="(activity, index) in staffObj.userTravels"
                              :key="index"
                              style="font-size: 9px">
              {{ activity.province }}{{ activity.city }}
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
        <el-tab-pane label="行程轨迹"
                     name="third">
          <el-timeline style="margin-top: 10px;height:300px;">
            <el-timeline-item v-for="(activity, index) in suerPeoTravels"
                              :key="index"
                              style="font-size: 9px"
                              :timestamp="acFormatter(activity.time)">
              {{ activity.province }}{{ activity.city }}{{ activity.county }}{{ activity.address }}
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
        <el-tab-pane label="查看行程码"
                     name="four">
          <el-image v-if="staffObj.trackCode !== null"
                    style="width: 50%; height:50%"
                    :src="staffObj.trackCode"
                    fit="fill">
            <div slot="placeholder"
                 class="image-slot">
              加载中<span class="dot">...</span>
            </div>
            <div slot="error"
                 class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
          <div v-else>用户没有上传行程码图片</div>
        </el-tab-pane>

        <el-tab-pane label="查看核酸报告"
                     name="firday">
          <el-image v-if="staffObj.nucleicsAcidReportUrl !== null"
                    style="width: 50%; height:50%"
                    :src="staffObj.nucleicsAcidReportUrl"
                    fit="fill">
            <div slot="placeholder"
                 class="image-slot">
              加载中<span class="dot">...</span>
            </div>
            <div slot="error"
                 class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
          <div v-else>没有上传核酸检测报告</div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer"
            class="dialog-footer">
        <span />
      </span>
    </el-dialog>
    <!-- 排除风险 -->
    <el-dialog :close-on-click-modal="false"
               title="排除风险"
               :visible.sync="reaDialogVisible"
               width="600px">
      <el-card>
        <div style="margin: 20px">
          <el-form ref="riskAreaForm"
                   :model="reliveRea"
                   :rules="reliveReaRules"
                   size="small"
                   label-width="100px">
            <el-form-item label="原因:"
                          prop="reason">
              <el-select v-model="reliveRea.reason"
                         placeholder="请选择"
                         class="edit-form-item"
                         clearable>
                <el-option v-for="item in reliveReasons"
                           :key="item"
                           :label="item"
                           :value="item" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="reaDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="handleExcludeRisk">排除风险</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import {
  getUserDoubts, getUserDetal, relieveWarn, getAffectlevels,
  getAffectHandle, getAffectSolutions, getAffectReason, getReliveReasons
} from '@/api/user'
import { Message } from 'element-ui'
import moment from 'moment'

export default {
  name: 'Riskareaquery',
  data () {
    return {
      detailActiveName: 'first',
      tableData: [],
      loading: false,
      activeName: 'first',
      form: {
        condition: '',
        processed: false,
        reason: '',
        solution: '',
        level: 'Medium',
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
      suerPeoTravels: [],
      procevaluessed: [
        {
          value: true,
          name: '已处理'
        },
        {
          value: false,
          name: '待处理'
        }
      ],
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

    formattPeo1 (arr) {
      if (arr !== undefined && arr !== null && (arr instanceof Array)) {
        if (arr.length >= 1) {
          return arr[0].name
        }
      }
    },
    formattPeo2 (arr) {
      if (arr !== undefined && arr !== null && (arr instanceof Array)) {
        if (arr.length >= 2) {
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
      getUserDoubts(this.form).then(res => {
        this.tableData = res.dataContent.records
        this.total = res.dataContent.total
        this.loading = false
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
        this.loading = false
      })
    },
    handleClick (tab, event) {
      console.log(tab, event)
      console.log('++++++++++++++')
      if (tab.name === 'second') {
        this.form.processed = true
      } else {
        this.form.processed = false
      }
      this.query()
    },

    handleDetail (row) {
      this.detailActiveName = 'first'
      getUserDetal(row.id).then(res => {
        this.staffObj = {}
        if (res.dataContent !== null) {
          this.staffObj = res.dataContent
          this.dialogVisible = true
        } else {
          Message.error('加载数据失败')
        }
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },

    handleCommand (command, row) {
      console.log(row)
      const obj = {
        id: row.id,
        solution: command
      }
      getAffectHandle(obj).then(res => {
        if (res.code === '0') {
          Message.success('成功')
          this.query()
        } else {
          Message.error('操作失败')
        }
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },
    handleExcludeRiskDia (row) {
      this.reliveRea = {
        id: row.id
      }
      this.reaDialogVisible = true
    },
    handleExcludeRisk (row) {
      this.loading = true
      relieveWarn(this.reliveRea).then(res => {
        if (res.code === '0') {
          this.clearReaData()
          this.reaDialogVisible = false
          this.query()
          Message.success('排除风险成功')
        } else {
          Message.error('操作失败')
        }
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },
    clearReaData () {
      this.reliveRea = {
        id: '',
        reason: ''
      }
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
.mmnn /deep/ .myDialogClass .el-dialog .el-dialog__body {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
