<template>
  <div class="mmnn">
    <el-card>
      <el-form ref="formm"
               :model="form"
               :rules="formqueryRules"
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
                         @clear="handleComanyClear"
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

          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="省:">

              <el-select v-model="form.provinceCode"
                         placeholder="请选择居住/籍贯/途径省"
                         class="edit-form-item"
                         clearable
                         @clear="handleClearProvince"
                         @change="handleChangeProvince">
                <el-option v-for="item in provinceOptions"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id" />
              </el-select>

            </el-form-item>
            <el-form-item label="市:">

              <el-select v-model="form.cityCode"
                         placeholder="请选择居住/籍贯/途径市"
                         class="edit-form-item"
                         clearable>
                <el-option v-for="item in cityOptions"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id" />
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
          <!-- <el-table-column label="序号"
                           type="index"
                           width="50"
                           align="center" /> -->
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
          <el-table-column prop="roleName"
                           label="岗位"
                           min-width="50"
                           align="center" />

          <el-table-column prop="phoneNumber"
                           label="联系方式"
                           min-width="80"
                           align="center" />
          <el-table-column prop="idCard"
                           label="身份证号"
                           min-width="120"
                           align="center" />
          <el-table-column prop="inoculations"
                           label="接种疫苗"
                           min-width="80"
                           align="center" />

          <el-table-column prop="userTravels"
                           label="途径区域"
                           width="130">
            <template slot-scope="scope">
              <div v-for="item in scope.row.userTravels"
                   :key="item.city">
                <span />{{ item.province }}{{ item.city }}
              </div>

            </template>
          </el-table-column>
          <el-table-column label="籍贯地"
                           width="120">
            <template slot-scope="scope">
              <div>
                {{ scope.row.censusAddress.province }}{{ scope.row.censusAddress.city }}
              </div>

            </template>
          </el-table-column>
          <el-table-column label="现住地"
                           width="120">
            <template slot-scope="scope">
              <div>
                {{ scope.row.residenceAddress.province }}{{ scope.row.residenceAddress.city }}
              </div>

            </template>
          </el-table-column>

          <el-table-column prop="dormitoryName"
                           label="公司宿舍"
                           min-width="90"
                           align="center" />

          <el-table-column align="center"
                           label="操作"
                           min-width="100">
            <template slot-scope="scope">

              <!-- <el-button
                size="mini"
                type="text"
                style="color:#1890FF"
                @click="handle(scope.row)"
              >查看核酸报告</el-button> -->
              <div>
                <el-button size="mini"
                           type="text"
                           style="color:#1890FF"
                           @click="handleDetail(scope.row)">详情</el-button>
                <el-button size="mini"
                           type="text"
                           @click="handleExcludeRiskDia(scope.row)">标记风险

                </el-button>

              </div>
              <div>
                <el-button size="mini"
                           type="text"
                           @click="handleAssignClick(scope.row)">分配岗位

                </el-button>
                <el-button size="mini"
                           type="text"
                           @click="handleRemoveClick(scope.row)">移除岗位
                </el-button>

              </div>
              <div>
                <el-button size="mini"
                           type="text"
                           @click="handleAssignDepartment(scope.row)">分配部门

                </el-button>
                <el-button size="mini"
                           type="text"
                           @click="handleSubscribeDepartment(scope.row)">订阅部门

                </el-button>
                <el-button size="mini"
                           type="text"
                           @click="handleRestPassword(scope.row)">修改密码
                </el-button>
                <el-button size="mini"
                           type="text"
                           @click="handleDeledate(scope.row)">注销账号
                </el-button>
              </div>

            </template>
          </el-table-column>
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
      <el-dialog class="myDialogClass"
                 title="员工详情"
                 :visible.sync="dialogVisible"
                 :close-on-click-modal="false"
                 width="720px"
                 height="600px"
                 center>
        <el-tabs v-model="activeName"
                 type="border-card"
                 @tab-click="handleClick">
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
            <el-timeline style="margin-top: 10px;height:300px;">
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
            <el-image v-if="trackCodeObj.trackCode !== null"
                      style="width: 50%; height:50%"
                      :src="trackCodeObj.trackCode"
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
              class="dialog-footer" />
      </el-dialog>
      <!-- 排除风险 -->
      <el-dialog :close-on-click-modal="false"
                 title="标记风险"
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
          <el-button @click="reaDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="handleExcludeRisk">标记风险</el-button>

        </span>
      </el-dialog>

      <!--分配岗位-->
      <el-dialog :close-on-click-modal="false"
                 title="分配岗位"
                 :visible.sync="assignDialogVisable"
                 width="600px">
        <el-card>
          <div style="margin: 20px">
            <el-form ref="workSectionForm"
                     :model="workSectionForm"
                     :rules="workSectionFormRules"
                     size="small"
                     label-width="100px">

              <el-form-item label="园区:"
                            prop="workSectionCode">
                <el-select v-model="workSectionForm.workSectionCode"
                           placeholder="请选择"
                           class="edit-form-item"
                           clearable>
                  <el-option v-for="item in workSectionOptions"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code" />
                </el-select>
              </el-form-item>
              <el-form-item label="岗位:">
                组长
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <span slot="footer"
              class="dialog-footer">

          <el-button @click="assignDialogVisable = false">取 消</el-button>
          <el-button type="primary"
                     @click="handleSaveGroupLeader">确定</el-button>

        </span>
      </el-dialog>
      <!-- 订阅管理 -->
      <el-dialog :close-on-click-modal="false"
                 title="订阅管理"
                 :visible.sync="subscribeDialogVisable"
                 width="600px">
        <el-card>
          <div>
            <el-form :model="subscribeForm">
              <el-form-item label="部门编号">
                <el-input v-model="subscribeForm.departmentCode" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary"
                           @click="onSubscribeCreate">立即创建</el-button>

              </el-form-item>
            </el-form>
          </div>
          <div style="margin: 20px">
            <el-table v-loading="subscribeTablebeLoading"
                      :data="tableDataSubscribe"
                      style="width: 100%"
                      border
                      highlight-current-row
                      :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
              <el-table-column label="公司"
                               align="center"
                               prop="companyName" />
              <el-table-column label="部门编号"
                               align="center"
                               prop="code" />
              <el-table-column label="部门"
                               align="center"
                               prop="name" />
              <el-table-column label="部门人数"
                               align="center"
                               prop="num" />
              <el-table-column label="操作"
                               align="center">
                <template slot-scope="scope">
                  <el-button type="primary"
                             @click="handleRemoveSubscribeDepartment(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

          </div>
        </el-card>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="subscribeDialogVisable = false">关闭</el-button>

        </span>
      </el-dialog>
      <el-dialog :close-on-click-modal="false"
                 title="分配部门"
                 :visible.sync="departmentDialogVisable"
                 width="600px">
        <el-card>
          <div style="margin: 20px">
            <el-form ref="departmentForm"
                     :model="departmentForm"
                     :rules="departmentFormRule"
                     size="small"
                     label-width="100px">

              <el-form-item label="公司:"
                            prop="companyCode">
                <el-select v-model="departmentForm.companyCode"
                           placeholder="请选择公司"
                           class="edit-form-item"
                           clearable
                           @change="handleFormDepartmentChanged">
                  <el-option v-for="item in companyOptions"
                             :key="item.code"
                             :label="item.name"
                             :value="item.code" />
                </el-select>
              </el-form-item>
              <el-form ref="departmentForm"
                       :model="departmentForm"
                       :rules="departmentFormRule"
                       size="small"
                       label-width="100px">

                <el-form-item label="部门:"
                              prop="departmentCode">
                  <el-select v-model="departmentForm.departmentCode"
                             placeholder="请选择部门"
                             class="edit-form-item"
                             clearable>
                    <el-option v-for="item in formDepartmentOptions"
                               :key="item.code"
                               :label="item.name"
                               :value="item.code" />
                  </el-select>
                </el-form-item>
              </el-form>
            </el-form>
          </div>
        </el-card>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="handleRemoveDepartment">移除部门</el-button>
          <el-button @click="departmentDialogVisable = false">取 消</el-button>
          <el-button type="primary"
                     @click="handleSaveUserDepartment">确定</el-button>

        </span>
      </el-dialog>
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

              <!-- <el-form-item label="市区:"
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
              </el-form-item> -->
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
    <el-dialog
      :visible.sync="passwordDialogVisible"
      :close-on-click-modal="false"
      width="520px"
      @close="closedDialog">
      <span slot="title">
        <span>修改密码</span>
      </span>
      <el-card shadow="never">
        <el-form
          ref="passwordObjForm"
          style="width: 100%"
          :rules="passwordObjRules"
          :model="passwordObj"
          size="mini"
          label-width="120px">
          <el-form-item label="新密码:" prop="password">
            <el-input v-model="passwordObj.password" />
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          plain
          type="primary"
          @click="passwordDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="handlePassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import {
  allUserQuery, markWarn, getUserDetal,
  getAffectReason, getTrackCodeRecords,
  getDormitoryList, getUserTravel,
  getWorkSections,
  createGroupLeader, removeGroupLeader,
  getCompanyList, getDepartmentList,
  setUserDepartment, departmentSubscribe, departmentRemoveSubscribe, getSubscribeDepartment,
  getAreasRoot, getAreasSub, queryDormitoryList, deleteUsers, resetPasswordHandle
} from '@/api/user'
// import { queryOutPatient, reApplyHospitalization } from '@/api/patient'
import { Message } from 'element-ui'
import moment from 'moment'

export default {
  name: 'Staff',
  data () {
    return {
      dormDialogVisible: false,
      activeName: 'first',
      reliveReasons: [],
      workSectionOptions: [],
      provinceOptions: [],
      cityOptions: [],
      reaDialogVisible: false,
      departmentDialogVisable: false,
      subscribeTablebeLoading: false,
      tableDataSubscribe: [],
      subscribeDialogVisable: false,
      departmentForm: {
        companyCode: '',
        departmentCode: ''
      },
      departmentFormRule: {
        companyCode: [{
          required: true, message: '公司必须选择 ', trigger: 'blur'
        }
        ],
        departmentCode: [
          {
            required: true, message: '部门必须选择 ', trigger: 'blur'
          }
        ]

      },
      userTypeOptions: [
        { name: '管理员工', code: 1 },
        { name: '生产员工', code: 0 }
      ],
      assignDialogVisable: false,
      workSectionForm: {
        workSectionCode: '',
        userId: 0
      },
      workSectionFormRules: {
        workSectionCode: [
          { required: true, message: '园区必须选择', trigger: 'blur' }
        ]

      },

      reliveRea: {
        id: '',
        reason: '',
        isMark: false
      },
      reliveReaRules: {
        reason: [
          { required: true, message: '排除风险原因必须输入', trigger: 'blur' }
        ]
      },
      deptOptions: [],
      genderOptions: [],
      companyOptions: [],
      departmentOptions: [],
      formDepartmentOptions: [],
      tableData: [

      ],
      // 个人轨迹
      suerPeoTravels: [],

      dormData: [],
      loading: false,
      activePaneName: 'first',
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
      formqueryRules: {
        queryPhoneNum: [
          { min: 8, max: 18, message: '手机长度是8-18位数字', trigger: 'blur, change' }
        ],
        queryName: [
          { min: 2, max: 18, message: '姓名是2-18位字符', trigger: 'blur, change' }
        ],
        queryIdnum: [
          { min: 15, max: 18, message: '身份证长度在 15 到 18 个字符', trigger: 'blur, change' }
          // { validator: validateIdCard, trigger: 'blur' }
        ]

      },
      subscribeForm: {
        userId: '',
        departmentCode: ''
      },
      dialogVisible: false,
      staffObj: {},
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
      staffRules: {
        staffName: [
          { required: true, message: '姓名必须输入', trigger: 'blur' },
          { min: 2, max: 10, message: '姓名2-10位字符', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '性别必须选择', trigger: 'blur' }
        ],
        idCard: [
          { min: 5, max: 18, message: '身份证长度在 5 到 18 个字符', trigger: 'blur' }
        ],
        birthday: [
          { required: true, trigger: 'blur', message: '出生日期必须输入' }
        ],
        phoneNumber: [
          { min: 8, max: 32, message: '联系方式长度在 8 到 32 个字符', trigger: 'blur' }
        ]
      },
      // 行程码
      trackCodeObj: {

      },
      total: 0,

      dormDialogVisable: false,
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
      dormLoading: false,
      dormTableData: [],
      // 密码
      passwordDialogVisible: false,
      passwordObj: {
        userId: '',
        password: ''
      },
      passwordObjRules: {
        password: [
          { required: true, message: '新密码必须输入', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度6-12位', trigger: 'blur' }
        ]
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
    acFormatter (val) {
      return val === null ? '' : moment(val).format('YYYY-MM-DD HH:mm')
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
      const peo = []
      if (arr !== undefined && arr !== null && (arr instanceof Array)) {
        if (arr.length >= 1) {
          arr.forEach(element => {
            if (element.relationType === '宿管') {
              const peo1 = element.name + element.phoneNumber
              peo.push(peo1)
            }
          })
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
      // this.onSearch()
      getDormitoryList(this.form).then(res => {
        console.log(res)
        console.log('-----------wwwww-------')
        this.dormData = res.dataContent
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })

      getAffectReason().then(res => {
        this.reliveReasons = res.dataContent
      }).catch(err => {
        Message.error(err.message)
      })

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
    },
    handleCompanyChanged (val) {
      getDepartmentList({ companyCode: val }).then(res => {
        this.departmentOptions = res.dataContent
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
        size: 20,
        page: 1
      }
      this.query()
    },
    query () {
      this.loading = true
      console.log(this.form)
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
    handleSizeChange (val) {
      this.form.size = val
      this.query()
    },
    handleCurrentChange (val) {
      this.form.page = val
      this.query()
    },
    handleClick (tab, event) {
      console.log(tab)
      console.log(event)
      console.log('----------------')
      if (tab.name === 'four') {
        getTrackCodeRecords(this.staffObj.id).then(res => {
          console.log(res)
          this.trackCodeObj = res.dataContent
          this.loading = false
        }).catch(err => {
          Message.error(err.message)
          this.loading = false
        })
      }
    },
    // 详情
    handleDetail (row) {
      this.activeName = 'first'
      getUserDetal(row.id).then(res => {
        // this.query()

        this.staffObj = res.dataContent
        this.loading = false
        this.dialogVisible = true
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
      // 行程轨迹
      getUserTravel(row.id).then(res => {
        this.suerPeoTravels = res.dataContent
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },
    handleExcludeRiskDia (row) {
      this.reaDialogVisible = true
    },
    // 标记风险
    handleExcludeRisk () {
      this.loading = true

      // relieveWarn(this.reliveRea).then(res => {
      //   Message.success('排除风险成功')
      //   this.query()
      // }).catch(err => {
      //   console.log(err.message)
      //   Message.error(err.message)
      // })
      markWarn(this.reliveRea).then(res => {
        Message.success('标记风险成功')

        this.this.reaDialogVisible = false
        this.query()
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },

    handleAssignClick (row) {
      this.assignDialogVisable = true

      this.workSectionForm.userId = row.id
    },
    handleRemoveClick (row) {
      removeGroupLeader(row.id).then(res => {
        Message.success('移除用户岗位成功')
        this.onSearch()
      }).catch(err => {
        Message.error(err.message)
      })
    },
    handleSaveGroupLeader () {
      this.$refs.workSectionForm.validate(valid => {
        if (valid) {
          createGroupLeader(this.workSectionForm).then(res => {
            this.assignDialogVisable = false
            this.workSectionForm.workSectionCode = null
            this.workSectionForm.userId = null
            this.onSearch()
          }).catch(err => {
            Message.error(err.message)
          })
        }
      })
    },

    handleFormDepartmentChanged (val) {
      if (val !== undefined && val !== null) {
        getDepartmentList({ companyCode: val }).then(res => {
          this.formDepartmentOptions = res.dataContent
        }).catch(err => {
          console.log(err.message)
        })
      }
    },
    handleAssignDepartment (row) {
      this.departmentForm.userId = row.id
      this.departmentForm.departmentCode = row.departmentCode
      this.departmentForm.companyCode = ''
      this.departmentDialogVisable = true
    },

    handleSaveUserDepartment () {
      this.$refs.departmentForm.validate(valid => {
        if (valid) {
          setUserDepartment(this.departmentForm).then(res => {
            this.departmentDialogVisable = false
            this.query()
          }).catch(err => {
            console.log(err.message)
            Message.error(err.message)
          })
        }
      })
    },
    handleRemoveDepartment () {
      this.departmentForm.departmentCode = '999'
      console.log('--------------------------')
      setUserDepartment(this.departmentForm).then(res => {
        this.departmentDialogVisable = false
        this.query()
        Message.success('移除部门成功')
      }).catch(err => {
        console.log(err.message)
        Message.error(err.message)
      })
    },

    handleSubscribeDepartment (row) {
      getSubscribeDepartment(row.id).then(res => {
        this.tableDataSubscribe = res.dataContent
      }).catch(err => {
        console.log(err.message)
        Message.error(err.message)
      })
      this.subscribeForm.userId = row.id
      this.subscribeDialogVisable = true
    },
    onSubscribeCreate () {
      this.subscribeForm.departmentCodes = [this.subscribeForm.departmentCode]
      departmentSubscribe(this.subscribeForm).then(res => {
        console.log(res.message)
      }).catch(err => {
        Message.error(err.message)
      })
    },
    handleRemoveSubscribeDepartment (row) {
      this.subscribeForm.departmentCode = row.code

      departmentRemoveSubscribe(this.subscribeForm).then(res => {
        Message.success('移除订阅成功')
      }).catch(err => {
        Message.error(err.message)
        console.log(err.message)
      })
    },

    handleClearProvince () {
      this.cityOptions = []
      this.form.cityCode = null
      this.form.provinceCode = null
    },
    handleChangeProvince (val) {
      if (val !== undefined && val !== null && (val.length > 0 || val > 0)) {
        getAreasSub(val).then(res => {
          this.cityOptions = res.dataContent
        }).catch(err => {
          console.log(err.message)
          Message.error(err.message)
        })
      }
    },
    handleComanyClear () {
      this.departmentOptions = []
      this.form.departmentCode = null
    },
    handleDialogDormSizeChange (val) {
      this.dormForm.size = val
      this.dormQuery()
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
    handleDialogCountyClear () {
      this.dormForm.subdistrict = ''
      this.dialogSubstrictOptions = []
    },
    handleDialogSelectedRow (row) {
      this.form.dormitoryId = row.id
      this.form.dormitoryName = row.name

      this.dormDialogVisible = false
    },
    handleFormDormClear () {
      this.form.dormitoryId = null
      this.form.dormitoryName = ''
    },
    handleDeledate (row) {
      this.$confirm('此操作将注销账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUsers(row.id).then(res => {
          this.query()
          Message.success('员工注销成功')
        }).catch(err => {
          Message.error(err.message)
        })
      })
    },
    handleRestPassword (row) {
      this.cleanPassObj()
      this.passwordObj.userId = row.id
      this.passwordDialogVisible = true
    },
    handlePassword () {
      this.$refs.passwordObjForm.validate(valid => {
        if (valid) {
          const obj = {
            userId: this.passwordObj.userId,
            password: this.passwordObj.password
          }
          resetPasswordHandle(obj).then(res => {
            Message.success('修改密码成功')
            this.cleanPassObj()
            this.query()
            this.passwordDialogVisible = false
          }).catch(err => {
            Message.error(err.message)
          })
        }
      })
    },
    cleanPassObj () {
      this.passwordObj = {
        userId: '',
        password: ''
      }
    },
    dormQuery () {
      this.dormLoading = true
      queryDormitoryList(this.dormForm).then(res => {
        this.dormTableData = res.dataContent.records
        this.dormForm.total = res.dataContent.total
        this.dormLoading = false
      }).catch(err => {
        Message.error(err.message)
        this.dormLoading = false
      })
    },
    onDialogDormSearch () {
      this.dormForm.page = 1
      this.dormQuery()
    },

    clearData () {
      this.staff = {
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
      }
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
