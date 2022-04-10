<template>
  <div>
    <el-card>
      <el-form ref="searchForm" v-model="searchForm" :inline="true" size="small" label-width="80px">
        <!-- <el-row>
          <el-col>
            <el-form-item prop="name" label="菜单名称:">
              <el-input
                v-model="searchForm.menuName"
                class="search-item"
                maxlength="32"
                placeholder="请输入菜单名称"
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
              <el-button type="primary" size="small" @click="handleNew">添加菜单</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="myExpandDiv">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          row-key="id"
          stripe
          border
          class="expandClass"
          :tree-props="{children: 'children'}"
          highlight-current-row
          :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
        >
          <el-table-column
            prop="lable"
            label="菜单名称"
            min-width="130"
            align="center"
          />
          <el-table-column
            prop="path"
            label="路径"
            min-width="150"
            align="center"
          />
          <el-table-column
            prop="component"
            label="组件"
            min-width="150"
            align="center"
          />
          <el-table-column
            prop="icon"
            label="图标"
            min-width="100"
            align="center"
          />
          <el-table-column
            label="状态"
            align="center"
            min-width="80"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isEnable">正常</span>
              <span v-else>停用</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            min-width="180"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="handleEdit(scope.row)">修改</el-button>
              <el-button v-if="scope.row.children === null || scope.row.children.length <= 0" type="text" @click="handleDeleteMenu(scope.row)">删除</el-button>
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
      @close="closedMenuDialog"
    >
      <el-divider />
      <div style="margin: 10px">
        <el-form
          ref="menuForm"
          style="width:100%"
          :model="menu"
          :rules="menuRules"
          size="small"
          label-width="90px"
        >
          <el-form-item label="菜单名称:" prop="lable">
            <el-input v-model="menu.lable" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="上级菜单:" prop="parentId">
            <div style="width:200px;height:32px">
              <my-treeselect ref="selTree" :append-true="false" :mydata="menuOptions" :valuebb="menuDefaultCodes" @changeSel="changeMenuSelHandle" @inputChanging="inoutMenuChangeHandle" />
            </div>
          </el-form-item>
          <el-form-item label="路径:" prop="path">
            <el-input v-model="menu.path" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="组件:" prop="component">
            <el-input v-model="menu.component" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="图标:" prop="icon">
            <el-input v-model="menu.icon" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="排序:" prop="sortBy">
            <el-input-number v-model="menu.sortBy" controls-position="right" :min="0" :max="100" />
          </el-form-item>
          <el-form-item label="是否隐藏" prop="hidden">
            <el-select
              v-model="menu.hidden"
            >
              <el-option
                v-for="item in isHiddleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="isEnable">
            <el-select
              v-model="menu.isEnable"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注:">
            <div>
              <el-input
                v-model="menu.des"
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
  </div>
</template>
<script>

import { mapGetters } from 'vuex'
import { getMenus, addMenus, updateMenus, deleteMenus } from '@/api/user'
import { Message } from 'element-ui'
import MyTreeselect from '@/components/common/MyTreeselect.vue'

export default {
  name: 'Menu',
  components: { MyTreeselect },
  data () {
    return {
      menuOptions: [],
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
      isHiddleOptions: [
        {
          label: '否',
          value: false
        },
        {
          label: '是',
          value: true
        }

      ],
      // 默认值
      menuDefaultCodes: null,
      searchForm: {
        menuName: '',
        isEnable: true,
        page: 1,
        size: 20

      },
      menu: {
        parentId: 0,
        id: '',
        des: '',
        lable: '',
        path: '',
        component: '',
        icon: '',
        sortBy: 0,
        hidden: false,
        isEnable: true,
        isEdit: false
      },
      menuRules: {
        lable: [
          { required: true, message: '菜单必须输入', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '上级菜单', trigger: 'change' }
        ],
        path: [
          { required: true, message: '路径必须输入', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '组件必须输入', trigger: 'blur' }
        ]

      },
      dialogVisible: false,
      dialogTitle: '菜单',
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
      getMenus().then(res => {
        this.tableData = res.dataContent
        this.total = res.dataContent.total
        this.loading = false
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
        this.loading = false
      })
    },
    // 新增菜单选择
    changeMenuSelHandle (val) {
      this.handleNodeClearTwo()
      this.menu.parentId = val.id
    },
    inoutMenuChangeHandle (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handleNodeClearTwo()
      }
    },
    handleNodeClearTwo () {
      this.menu.parentId = null
    },
    handleSizeChange (val) {
      this.searchForm.size = val
      this.query()
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      this.query()
    },
    // 修改
    handleEdit (row) {
      this.cleartMenu()
      this.menu.parentId = row.parentId
      this.menu.id = row.id
      this.menu.isEnable = row.isEnable
      this.menu.lable = row.lable
      this.menu.path = row.path
      this.menu.component = row.component
      this.menu.icon = row.icon
      this.menu.sortBy = row.sortBy
      this.menu.des = row.des
      this.menu.hidden = row.hidden
      this.menu.isEdit = true
      this.menuOptions = []
      getMenus().then(res => {
        const obj = {}
        obj.id = 0
        obj.lable = '根菜单'
        obj.children = res.dataContent
        this.menuOptions.unshift(obj)
        this.menuDefaultCodes = []
        this.menuDefaultCodes.push(row.parentId)
        this.dialogTitle = '修改菜单'
        this.dialogVisible = true
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
      })
    },
    cleartMenu () {
      this.menu = {
        parentId: 0,
        id: '',
        des: '',
        lable: '',
        path: '',
        component: '',
        icon: '',
        sortBy: 0,
        hidden: false,
        isEnable: true,
        isEdit: false
      }
      this.menuDefaultCodes = []
      this.menuDefaultCodes.push(0)
    },
    // 新增
    handleNew () {
      this.cleartMenu()
      this.menuOptions = []
      getMenus().then(res => {
        const obj = {}
        obj.id = 0
        obj.lable = '根菜单'
        obj.children = res.dataContent
        this.menuOptions.unshift(obj)
        this.menuDefaultCodes = []
        this.menuDefaultCodes.push(0)
        this.dialogTitle = '新增菜单'
        this.dialogVisible = true
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
      })
    },
    handleSave () {
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          if (this.menu.isEdit) {
            updateMenus(this.menu).then(res => {
              Message.success('更新菜单成功')
              this.cleartMenu()
              this.dialogVisible = false
              this.query()
            }).catch(err => [
              Message.error(err.message)
            ])
          } else {
            addMenus(this.menu).then(res => {
              Message.success('添加菜单成功')
              this.cleartMenu()
              this.query()
              this.dialogVisible = false
            }).catch(err => [
              Message.error(err.message)
            ])
          }
        }
      })
    },
    closedMenuDialog () {
      this.$refs.menuForm.resetFields()
      this.dialogVisible = false
    },
    handleDeleteMenu (row) {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenus(row.id).then(res => {
          Message.success('删除菜单成功')
          this.query()
        }).catch(err => {
          console.log(err)
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
::v-deep .myExpandDiv .expandClass .el-table__expand-icon {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
::v-deep .myExpandDiv .expandClass .el-table__expand-icon .el-icon-arrow-right:before{
  content: '\e6d9';
  border: 1px solid #ccc;
  padding: 1px;
}
::v-deep .myExpandDiv .expandClass .el-table__expand-icon--expanded .el-icon-arrow-right:before{
  content: '\e6d8'
}

</style>
