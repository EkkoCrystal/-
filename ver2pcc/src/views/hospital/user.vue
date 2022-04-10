<template>
  <div>
    <div>
      <el-card>
        <el-form ref="searchForm" v-model="searchForm" :inline="true" size="small" label-width="80px">
          <el-row>
            <el-col>
              <!-- 科室 -->
              <el-form-item label="科室:">
                <div style="width:200px;height:32px">
                  <my-treeselect :append-true="true" :mydata="deptOptions" :valuebb="departDefaultCodes" @changeSel="changeDepentSelHandle" @inputChanging="inoutDepentChangeHandle" />
                </div>
              </el-form-item>

              <el-form-item label="状态:">
                <el-select v-model="searchForm.isActive" clearable class="search-item">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item prop="name" label="查询条件:">
                <el-input
                  v-model="searchForm.queryCondition"
                  class="search-item"
                  maxlength="32"
                  placeholder="请输入姓名/用户名"
                />
              </el-form-item>
              <el-form-item>
                <el-button class="search-btn" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                <el-button type="primary" size="small" @click="handleNew">新增员工</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div>
          <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%"
            stripe
            border
            highlight-current-row
            :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
          >
            <el-table-column
              prop="nickName"
              label="姓名"
              width="100"
              align="center"
            />
            <el-table-column
              prop="userName"
              label="用户名"
              width="100"
              align="center"
            />
            <el-table-column
              prop="genderDisplay"
              label="性别"
              width="100"
              align="center"
            />
            <el-table-column
              prop="departmentName"
              width="100"
              label="科室"
              align="center"
            />
            <el-table-column
              prop="phoneNumber"
              label="手机号"
              align="center"
            />
            <!-- <el-table-column
              prop="email"
              label="邮箱"
              align="center"
            /> -->
            <el-table-column
              label="角色"
              align="center"
            >
              <template slot-scope="scope">
                <el-tag v-for="item in scope.row.roles" :key="item.name">{{ item.displayName }}&nbsp;</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              align="center"
              width="80"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.isActive">正常</span>
                <span v-else>停用</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="expiredTime"
              label="有效期至"
              align="center"
            />
            <el-table-column
              label="操作"
              align="center"
              width="180"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="handleResetPassword(scope.row)">重置密码</el-button>
                <el-button type="text" @click="handleEdit(scope.row)">修改</el-button>
                <el-button type="text" @click="handleDeleteUser(scope.row)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
        <div style="margin:5px;float:right">
          <el-pagination
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next"
            :total="total"
            :page-size.sync="searchForm.size"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
    <el-dialog
      title="员工信息"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="720px"
      class="dialog"
      @close="closedUserFormDialog"
    >
      <el-divider />
      <span>
        <el-form
          ref="userForm"
          style="width:100%"
          :model="user"
          :rules="userRules"
          size="mini"
          label-width="90px"
        >
          <el-row :gutter="4">
            <el-col :span="10">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="user.userName" :disabled="user.isEdit" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="密码" prop="password">
                <el-input v-model="user.password" show-password :disabled="user.isEdit" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="4">
            <el-col :span="10">
              <el-form-item label="姓名" prop="nickName">
                <el-input v-model="user.nickName" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="性别" prop="gender">
                <el-select
                  v-model="user.gender"
                  placeholder="请选择性别"
                  style="width:100%"
                >
                  <el-option
                    v-for="item in genderOptions"
                    :key="item.name"
                    :label="item.display"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="4">
            <el-col :span="10">
              <el-form-item label="状态" prop="isActive">
                <el-checkbox v-model="user.isActive">启用</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="departmentCode" label="科室:">
                <div style="width:200px;height:32px" class="pp">
                  <my-treeselect :append-true="false" :valuebb="addDepartDefaultCodes" :mydata="deptOptions" @changeSel="changeDepentSelHandleTwo" @inputChanging="inoutDepentChangeHandleTwo" />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="4">
            <el-col :span="10">
              <el-form-item label="手机" prop="phoneNumber">
                <el-input v-model="user.phoneNumber" type="tel" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="user.email" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="4">
            <el-col :span="10">
              <el-form-item label="有效期至">
                <el-date-picker
                  v-model="user.expiredTime"
                  type="date"
                  style="width: 100%"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="角色" prop="roleNames">
                <el-checkbox-group v-model="user.roleNames">
                  <el-checkbox
                    v-for="item in roleOptions"
                    :key="item.roleId"
                    :label="item.name"
                  >{{
                    item.displayName
                  }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" plain type="primary" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="密码修改"
      :visible.sync="passwordDialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          ref="passwordForm"
          style="width:100%"
          :model="user"
          :rules="passwordRule"
          size="mini"
          label-width="120px"
        >
          <el-form-item label="用户名:">
            {{ user.userName }}
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input v-model="user.password" placeholder="请输入密码" show-password />
          </el-form-item>
          <el-form-item label="密码规则:">
            <ol>
              <li>最短6位，最长12位 {6,12}</li>
            </ol>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSavePassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { mapGetters } from 'vuex'
import { getDepartments, getGenders, queryUsers,
  getRoles, updateUser, createUser, deleteUser, changePassword } from '@/api/user'
import { encrypt } from '@/utils/encrypt'
import { Message } from 'element-ui'
import MyTreeselect from '@/components/common/MyTreeselect.vue'

export default {
  name: 'User',
  components: { MyTreeselect },
  data () {
    // const validateUserName = (rule, value, callback) => {
    //   const reg = /^\w{5,12}$/
    //   if (reg.test(value)) {
    //     callback()
    //   } else {
    //     callback('用户名是5-12位字符')
    //   }
    // }

    const validateIphoneCode = (rule, value, callback) => {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (value === '' || value === undefined || value === null) {
        callback()
      } else {
        if ((!reg.test(value)) && value !== '') {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }
    }
    return {
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      loading: false,
      statusOptions: [
        {
          label: '正常',
          value: 'true'
        },
        {
          label: '停用',
          value: 'false'
        }
      ],

      roleOptions: [],
      genderOptions: [],
      // 默认值
      departDefaultCodes: null,
      searchForm: {
        departmentCode: '',
        departmentName: '',
        queryCondition: '',
        isActive: '',
        page: 1,
        size: 20

      },
      // 新增默认null
      addDepartDefaultCodes: [],
      user: {
        nickName: '',
        userName: '',
        password: '',
        gender: '',
        isActiveDisplay: '',
        isActive: 'true',
        departmentCode: '',
        departmentName: '',
        phoneNumber: '',
        email: '',
        expiredTime: '',
        roleNames: [],
        isEdit: false

      },
      passwordRule: {
        password: [
          { required: true, message: '密码必须输入', trigger: 'blur' }
        ]
      },
      userRules: {
        nickName: [
          { required: true, message: '姓名必须输入', trigger: 'blur' },
          { min: 2, max: 18, message: '姓名长度2-18位字符', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '用户名必须输入', trigger: 'blur' },
          { min: 5, max: 12, message: '用户名长度5-12位字符', trigger: 'blur' }
          // { required: true, validator: validateUserName, trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '性别必须输入', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码必须输入', trigger: 'blur' },
          { min: 6, max: 12, message: '密码的长度是6-12位字符', trigger: 'blur' }
        ],
        departmentCode: [
          { required: true, message: '科室必须选择', trigger: 'change' }
        ],
        departmentName: [
          { required: true, message: '科室必须选择', trigger: 'change' }
        ],
        roleNames: [
          { required: true, message: '角色必须选择', trigger: 'change' }
        ],
        phoneNumber: [
          { validator: validateIphoneCode, trigger: 'blur' }
        ],
        email: [
          { min: 8, max: 32, message: '邮箱长度是8-32位字符', trigger: 'blur' }
        ]

      },
      dialogVisible: false,
      passwordDialogVisible: false,
      tableData: [],
      total: 0,
      roleNames: []

    }
  },
  computed: {
    ...mapGetters(['departmentCode', 'departmentName'])

  },
  created () {
    this.initOptions()
    this.initData()
  },
  mounted () {
    this.onSearch()
  },
  methods: {
    initData () {
      this.searchForm.departmentCode = this.departmentCode
      this.searchForm.departmentName = this.departmentName
    },
    initOptions () {
      getDepartments().then(res => {
        // 默认值
        if (this.departmentCode !== null && this.departmentCode !== '') {
          this.departDefaultCodes = []
          this.departDefaultCodes.push(this.departmentCode)
          this.addDepartDefaultCodes = []
          this.addDepartDefaultCodes.push(this.departmentCode)
        } else {
          this.departDefaultCodes = null
          this.addDepartDefaultCodes = null
        }
        this.searchForm.departmentCode = this.departmentCode
        this.deptOptions = res.dataContent
        this.onSearch()
      }).catch(err => {
        console.log(err)
      })
      getGenders().then(res => {
        this.genderOptions = res.dataContent
      })
      getRoles().then(res => {
        console.log(res)
        console.log('jjjjjjjjjjjjjjjjjj')
        this.roleOptions = res.dataContent
      })
    },

    // handleNodeClick (data) {
    //   console.log(data)
    //   this.searchForm.departmentCode = data.code
    //   this.searchForm.departmentName = data.name
    //   this.$refs.selTree.blur()
    // },
    // 选择科室
    changeDepentSelHandle (val) {
      this.handleNodeClear()
      this.searchForm.departmentCode = val.id
    },
    inoutDepentChangeHandle (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleNodeClear()
      }
    },
    handleNodeClear () {
      this.searchForm.departmentCode = null
    },
    // dialogHandleNodeClick (data) {
    //   this.user.departmentName = data.name
    //   this.user.departmentCode = data.code
    //   this.$refs.selDialogTree.blur()
    // },
    // 新增科室选择
    changeDepentSelHandleTwo (val) {
      this.handleNodeClearTwo()
      this.user.departmentCode = val.id
    },
    inoutDepentChangeHandleTwo (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleNodeClearTwo()
      }
    },
    handleNodeClearTwo () {
      this.user.departmentCode = null
    },
    handleSizeChange (val) {
      this.searchForm.size = val
      this.query()
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      this.query()
    },
    onSearch () {
      this.searchForm.page = 1
      this.query()
    },
    query () {
      this.loading = true
      // this.searchForm.page = 1
      queryUsers(this.searchForm).then(res => {
        this.tableData = res.dataContent.records
        this.total = res.dataContent.total
        this.loading = false
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
        this.loading = false
      })
    },

    handleResetPassword (row) {
      this.user.userName = row.userName
      this.user.password = encrypt('111111')
      // this.passwordDialogVisible = true

      this.$confirm('此操作将该用户的密码修改为111111, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changePassword({
          password: this.user.password,
          userName: this.user.userName
        }).then(res => {
          Message.success('重置密码成功,请通知用户登录后及时修改密码')
          this.passwordDialogVisible = false
        }).catch(err => {
          console.log(err)
          Message.error(err.message)
        })
      })
    },
    handleSavePassword () {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          const pattern = /^\w{6,12}$/
          if (pattern.test(this.user.password)) {
            changePassword({
              password: this.encrypt(this.user.password),
              userName: this.user.userName
            }).then(res => {
              Message.success('重置密码成功')
              this.passwordDialogVisible = false
            }).catch(err => {
              console.log(err)
              Message.error(err.message)
            })
          } else {
            Message.error('密码格式不正确')
          }
        }
      })
      // const pattern = /^.*(?=.{6,12})(?=.*\d)(?=.*[A-Z]{2,})(?=.*[a-z]{2,})(?=.*[!@#$%^&*?\(\)]).*$/
    },
    handleEdit (userRow) {
      this.cleartUser()
      this.user.nickName = userRow.nickName
      this.user.userName = userRow.userName
      this.user.gender = userRow.gender
      this.user.password = 'Abcd123'

      this.user.isActive = userRow.isActive
      this.user.departmentCode = userRow.departmentCode
      this.user.departmentName = userRow.departmentName
      this.user.phoneNumber = userRow.phoneNumber
      this.user.email = userRow.email
      this.user.expiredTime = userRow.expiredTime
      this.user.isEdit = true
      userRow.roles.map(k => {
        this.user.roleNames.push(k.name)
      })
      // 编辑
      this.addDepartDefaultCodes = []
      this.addDepartDefaultCodes.push(userRow.departmentCode)

      this.dialogVisible = true
    //  this.$refs.userForm.clearValidate()
      // this.user = userRow
    },
    cleartUser () {
      this.user = {
        nickName: '',
        password: '',
        userName: '',
        gender: '',
        isActiveDisplay: '',
        isActive: true,
        departmentCode: this.departmentCode,
        departmentName: '',
        phoneNumber: null,
        email: null,
        expiredTime: null,
        roleNames: [],
        isEdit: false
      }
      this.addDepartDefaultCodes = []
      this.addDepartDefaultCodes.push(this.departmentCode)
      //  this.$refs.userForm.clearValidate()
    },
    // 新增
    handleNew () {
      this.cleartUser()
      this.dialogVisible = true
    },
    handleDeleteUser (row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.userName).then(res => {
          Message.success('删除用户成功')
          this.query()
        }).catch(err => {
          console.log(err)
          Message.error(err.message)
        })
      })
    },
    handleSave () {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (this.user.phoneNumber !== undefined) {
            if (this.user.phoneNumber !== null && this.user.phoneNumber.length === 0) {
              this.user.phoneNumber = null
            }
          }
          if (this.user.email !== undefined) {
            if (this.user.email !== null && this.user.email.length === 0) {
              this.user.email = null
            }
          }
          const userData = {

            departmentCode: this.user.departmentCode,

            email: this.user.email,
            gender: this.user.gender,
            isActive: this.user.isActive,
            expiredTime: this.user.expiredTime,
            nickName: this.user.nickName,
            phoneNumber: this.user.phoneNumber,
            roles: this.user.roleNames,
            userName: this.user.userName,
            password: encrypt(this.user.password)
          }
          if (this.user.isEdit) {
            updateUser(userData).then(res => {
              Message.success('更新用户成功')
              this.cleartUser()
              this.dialogVisible = false
              this.query()
            }).catch(err => [
              Message.error(err.message)
            ])
          } else {
            // userData.password = 'Abcd123'
            createUser(userData).then(res => {
              Message.success('创建用户成功')
              this.cleartUser()
              this.query()
              this.dialogVisible = false
            }).catch(err => [
              Message.error(err.message)
            ])
          }
        }
      })
    },
    closedUserFormDialog () {
      this.$refs.userForm.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
.search-item{
  width:200px;
}
.search-btn {
    margin-left: 20px;
}
</style>
