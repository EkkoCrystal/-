<template>
  <div class="mainClassStyle">
    <el-card>
      <el-container>
        <el-aside width="300px" class="tree-containerStyle">
          <div style="margin:10px;border-left:1px solid #303843" class="tree-container">
            <el-tree
              ref="tree"
              class="tree filter-tree"
              :data="deptData"
              :props="defaultProps"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span :dataType="data.type">
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </div>
        </el-aside>
        <el-main class="tree-containerMainStyle">
          <div>
            <div>
              <el-button type="primary" size="small" @click="createNewRoot">新增科室</el-button>
            </div>
            <el-table
              :data="tableData"
              row-key="id"
              size="small"
              style="width:96%"
              :header-cell-style="{ background: '#c6d2e1', color: '#303843' }"
              border
              default-expand-all
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            >
              <el-table-column prop="name" label="科室名称" align="center" />
              <el-table-column prop="channelCode" label="his编码" align="center" />

              <el-table-column
                prop="createTime"
                label="创建日期"
                align="center"
              />
              <el-table-column
                fixed="right"
                width="220"
                label="操作"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="handleNew(scope.row)"
                  >新建子科室</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="handleEdit(scope.row)"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="handleDelete(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-main>
      </el-container>
    </el-card>
    <el-dialog
      title="科室信息"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      @close="closedDepartDialog"
    >
      <el-form
        ref="departmentForm"
        :model="department"
        :rules="departmentRules"
        label-width="100px"
      >
        <el-form-item label="上级科室:" prop="parentName">
          <!-- <el-input v-model="storeData.storeName" maxlength="32"></el-input> -->
          <el-tag>{{ department.parentName }}</el-tag>
        </el-form-item>

        <el-form-item label="科室名称:" prop="name">
          <el-input v-model="department.name" />
        </el-form-item>
        <el-form-item label="his编码:" prop="channelCode">
          <el-input v-model="department.channelCode" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { getDepartments, createDepartment, updateDepartment, deleteDepartment, getSubDepartment } from '@/api/user'
import { Message } from 'element-ui'
export default {
  name: 'Department',
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'

      },
      page: 1,
      size: 10,
      total: 0,
      dialogVisible: false,
      deptData: [],
      tableData: [],
      makeDepartCode: null,
      department: {
        id: 0,
        code: '',
        name: '',
        parentCode: 0,
        parentName: '无科室',
        channelCode: '',
        isEdit: false
      },
      departmentRules: {
        code: [
          { required: true, message: '科室编号必须输入', tirgger: 'blur' }
        ],
        name: [
          {
            required: true, message: '科室名称必须输入', tirgger: 'blur'
          },
          { min: 2, max: 18, message: '科室名称是2到18位字符', trigger: 'blur' }
        ]
      },
      firstLoading: true
    }
  },
  created () {
    this.initOptions()
  },
  methods: {
    initOptions () {
      getDepartments().then(res => {
        this.deptData = res.dataContent
        if (this.firstLoading && this.deptData.length > 0) {
          this.handleNodeClick(this.deptData[0])
        }
      }).catch(err => {
        Message.error(err.message)
      })
    },
    handleNodeClick (data) {
      this.makeDepartCode = null
      this.tableData = []
      if (data !== null && data.code !== null) {
        console.log(data)
        this.makeDepartCode = data.code
        this.loadSubDepartments(data.code)
      } else {
        Message.error('暂无数据')
      }
    },
    loadSubDepartments (code) {
      this.tableData = []
      getSubDepartment(code).then(res => {
        this.tableData = res.dataContent
      }).catch(err => {
        Message.error(err.message)
      })
    },
    handleNew (row) {
      this.department = {
        // id: row.id,
        parentCode: row.code,
        // name: row.name,
        parentName: row.name,
        channelCode: '',
        isEdit: false

      }
      this.dialogVisible = true
    },
    handleEdit (row) {
      this.department = {
        id: row.id,
        parentCode: row.parentCode,
        parentName: row.parentName,
        code: row.code,
        name: row.name,
        channelCode: row.channelCode,
        isEdit: true
      }
      row.parentCode === null ? (this.department.parentName = '无部门') : (this.department.parentName = row.parentName)
      this.dialogVisible = true
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除该科室, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDepartment(row.id).then(res => {
          this.firstLoading = false
          this.initOptions()
          this.loadSubDepartments(this.makeDepartCode)
          Message.success('删除科室成功')
        }).catch(err => {
          Message.error('删除科室失败:' + err.message)
        })
      })
    },
    handleSave () {
      this.$refs.departmentForm.validate(valid => {
        if (valid) {
          if (this.department.isEdit) {
            updateDepartment(this.department).then(res => {
              this.firstLoading = false
              this.initOptions()
              this.clearData()
              this.loadSubDepartments(this.makeDepartCode)
              this.dialogVisible = false
              Message.success('修改科室信息成功')
            }).catch(err => {
              Message.error('修改科室信息失败:' + err.message)
            })
          } else {
            createDepartment(this.department).then(res => {
              this.firstLoading = false
              this.initOptions()
              this.clearData()
              this.loadSubDepartments(this.makeDepartCode)
              Message.success('新增科室信息成功')
              this.dialogVisible = false
            }).catch(err => {
              Message.error('新增科室信息失败:' + err.message)
            })
          }
        }
      })
    },
    closedDepartDialog () {
      this.$refs.departmentForm.resetFields()
      this.dialogVisible = false
    },
    createNewRoot () {
      this.clearData()
      this.department.parentName = '无部门'
      this.dialogVisible = true
    },
    clearData () {
      this.department = {
        id: 0,
        parentId: 0,
        code: '',
        name: '',
        parentCode: '',
        parentName: '',
        channelCode: '',
        isEdit: false
      }
    }
  }
}
</script>

<style scoped>
.box-card{
  margin:10px;
  min-height: 760px;
}
.tree-containerStyle {
  height: calc(100vh - 50px - 40px);
}
.tree-containerMainStyle {
  height: calc(100vh - 50px - 40px)
}
.mainClassStyle {
  height: 100%;
}
.tree-container /deep/ .el-tree-node.is-expanded > .el-tree-node__children {
    display: inline;
  }
</style>
<style>

 .tree .el-tree-node {
    position: relative;
    padding-left: 16px;
  }

  .tree .el-tree-node__children {
    padding-left: 16px;
  }

  .tree .el-tree-node :last-child:before {
    height: 38px;
  }

  .tree .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .tree-container .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .tree .el-tree-node__children .el-tree-node:before {
    content: '';
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree .el-tree-node:after {
    content: '';
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree .el-tree-node__expand-icon.is-leaf {
    display: none;
  }

  .tree .el-tree-node:before {
    border-left: 1px dashed #dddddd;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  .tree .el-tree-node:after {
    border-top: 1px dashed #dddddd;
    height: 20px;
    top: 12px;
    width: 24px;
  }
  .tree .custom-tree-node {
    padding-left: 10px;
  }

</style>

