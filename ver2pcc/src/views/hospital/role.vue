<template>
  <div>
    <el-card>
      <el-form ref="searchForm" v-model="searchForm" :inline="true" size="small" label-width="80px">
        <!-- <el-row>
          <el-col>
            <el-form-item prop="name" label="角色名称:">
              <el-input
                v-model="searchForm.roleName"
                class="search-item"
                maxlength="32"
                placeholder="请输入角色名称"
              />
            </el-form-item>
            <el-form-item label="状态:">
              <el-select v-model="searchForm.isEnable" clearable class="search-item">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col>
            <el-form-item>
              <!-- <el-button class="search-btn" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button> -->
              <el-button type="primary" size="small" @click="handleNew">添加角色</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="myExpandDiv">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          stripe
          border
          class="expandClass"
          highlight-current-row
          :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
        >
          <el-table-column
            prop="displayName"
            label="角色名称"
            min-width="100"
            align="center"
          />
          <!-- <el-table-column
            label="状态"
            align="center"
            min-width="80"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.static">正常</span>
              <span v-else>停用</span>
            </template>
          </el-table-column> -->
          <el-table-column
            label="操作"
            align="center"
            min-width="180"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="handleAssignper(scope.row)">分配权限</el-button>
              <el-button type="text" @click="handleEdit(scope.row)">修改</el-button>
              <el-button type="text" @click="handleDeleteMenu(scope.row)">删除</el-button>
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
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="500px"
      class="dialog"
      @close="closedRoleDialog"
    >
      <el-divider />
      <div style="margin: 10px">
        <el-form
          ref="roleForm"
          style="width:100%"
          :model="role"
          :rules="roleRules"
          size="small"
          label-width="90px"
        >
          <el-form-item label="角色编码:" prop="name">
            <el-input v-model="role.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="角色名称:" prop="displayName">
            <el-input v-model="role.displayName" placeholder="请输入" />
          </el-form-item>

          <!-- <el-form-item label="状态" prop="static">
            <el-select
              v-model="role.static"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="备注:">
            <div>
              <el-input
                v-model="role.des"
                :rows="2"
                type="textarea"
                placeholder="请输入内容"
                maxlength="60"
                show-word-limit
              />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" plain type="primary" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :close-on-click-modal="false"
      :visible.sync="dialogVisibleAssign"
      width="500px"
      class="dialog"
    >
      <div style="margin: 10px">
        <el-form
          style="width:100%"
          :model="role"
          size="small"
          label-width="90px"
        >
          <el-tree
            ref="treeMenu"
            :data="menuOptions"
            show-checkbox
            node-key="id"
            :default-expanded-keys="menuIds"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            :check-strictly="checkStrictly"
          />
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" plain type="primary" @click="dialogVisibleAssign=false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleSaveAsign">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { mapGetters } from 'vuex'
import { getRoles, addRoles, updateRoles, deleteRoles, getMenus, getRolesAuthority, saveRolesAuthority } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'Role',
  data () {
    return {
      menuOptions: [],
      menuIds: [],
      checkStrictly: false,
      authorityObj: {
        roleId: '',
        menuIds: []
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      loading: false,
      statusOptions: [
        {
          label: '正常',
          value: true
        },
        {
          label: '停用',
          value: false
        }
      ],
      // 默认值
      roleDefaultCodes: null,
      searchForm: {
        roleName: '',
        isEnable: true,
        page: 1,
        size: 20

      },
      role: {
        id: '',
        des: '',
        name: '',
        displayName: '',
        isEdit: false
      },
      roleRules: {
        name: [
          { required: true, message: '角色名字必须输入', trigger: 'blur' }
        ],
        displayName: [
          { required: true, message: '角色编码必须输入', trigger: 'blur' }
        ]
      },
      dialogVisibleAssign: false,
      dialogVisible: false,
      dialogTitle: '角色',
      tableData: [],
      total: 0
    }
  },
  computed: {
    ...mapGetters(['departmentCode', 'departmentName'])

  },
  created () {
    this.initOptions()
  },
  mounted () {
    this.onSearch()
  },
  methods: {
    initOptions () {
      console.log('s')
    },
    onSearch () {
      this.searchForm.page = 1
      this.query()
    },
    query () {
      this.loading = true
      // this.searchForm.page = 1
      getRoles().then(res => {
        this.tableData = res.dataContent
        this.total = res.dataContent.total
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.searchForm.size = val
      this.query()
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      this.query()
    },
    // 分配权限
    handleAssignper (row) {
      this.authorityObj = {
        roleId: row.roleId,
        menuIds: []
      }
      getMenus().then(res => {
        if (res.dataContent !== null && res.dataContent.length > 0) {
          this.menuOptions = this.changeDepsData(res.dataContent)
          this.initRolesAuthoritys(row.roleId)
        }
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
      })
    },
    initRolesAuthoritys (id) {
      this.menuIds = []
      getRolesAuthority(id).then(res => {
        if (res.dataContent !== null && res.dataContent.length > 0) {
          this.checkStrictly = true
          this.$nextTick(() => {
            setTimeout(() => {
              // 渲染
              this.menuIds = res.dataContent
              this.$refs.treeMenu.setCheckedNodes(this.menuIds) // 给树节点赋值
              this.checkStrictly = false // 赋值完成后设置为false
            }, 0)
          })
        } else {
          this.menuIds = []
        }
        this.dialogVisibleAssign = true
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
      })
    },
    handleSaveAsign () {
      let nodeArr = []
      let kkArr = []
      nodeArr = this.$refs.treeMenu.getCheckedNodes(false, true)
      if (nodeArr.length > 0) {
        nodeArr.forEach(element => {
          kkArr.push(element.id)
        })
      } else {
        kkArr = []
      }
      this.authorityObj.menuIds = kkArr
      saveRolesAuthority(this.authorityObj).then(res => {
        Message.success('分配权限成功')
        this.cleanAuthorityObj()
        this.dialogVisibleAssign = false
        this.query()
      }).catch(err => {
        Message.error(err.message)
      })
    },
    cleanAuthorityObj () {
      this.authorityObj = {
        roleId: '',
        menuIds: []
      }
    },
    changeDepsData (resData) {
      const arr = [] // 定义空数组
      resData.forEach(item => {
        const objData = {}
        objData.id = item.id
        objData.label = item.lable
        // 全部加载(数据量小)
        if (item.children && item.children.length) {
          objData.children = this.changeDepsData(item.children)
        } else {
          delete objData.children
        }
        arr.push(objData) // 将获取的数据代入
      })
      return arr
    },
    // 修改
    handleEdit (row) {
      this.cleartRole()
      this.role = {
        id: row.id,
        des: row.des,
        name: row.name,
        displayName: row.displayName,
        isEdit: true
      }
      this.dialogTitle = '修改角色'
      this.dialogVisible = true
    },
    cleartRole () {
      this.role = {
        id: '',
        des: '',
        name: '',
        displayName: '',
        isEdit: false
      }
    },
    // 新增
    handleNew () {
      this.cleartRole()
      this.dialogTitle = '添加角色'
      this.dialogVisible = true
    },
    handleSave () {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          if (this.role.isEdit) {
            updateRoles(this.role).then(res => {
              Message.success('更新角色成功')
              this.cleartRole()
              this.dialogVisible = false
              this.query()
            }).catch(err => [
              Message.error(err.message)
            ])
          } else {
            addRoles(this.role).then(res => {
              Message.success('添加角色成功')
              this.cleartRole()
              this.query()
              this.dialogVisible = false
            }).catch(err => [
              Message.error(err.message)
            ])
          }
        }
      })
    },
    closedRoleDialog () {
      this.$refs.roleForm.resetFields()
      this.dialogVisible = false
    },
    handleDeleteMenu (row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoles(row.id).then(res => {
          Message.success('删除角色成功')
          this.query()
        }).catch(err => {
          Message.error(err.message)
        })
      })
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
