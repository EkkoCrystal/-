<template>
  <div class="mmnn">
    <el-card>
      <el-form ref="formm"
               :model="form"
               :inline="true"
               size="small">
        <el-form-item label="公司:">
          <el-select v-model="form.companyCode"
                     placeholder="请选择公司"
                     class="edit-form-item"
                     clearable>
            <el-option v-for="item in companys"
                       :key="item.code"
                       :label="item.name"
                       :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSearch">查询</el-button>
          <el-button type="primary"
                     size="small"
                     @click="handleAdd">新增部门</el-button>
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
                  :default-sort="{prop: 'code', order: 'ascending'}"
                  :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
          <el-table-column label="序号"
                           type="index"
                           width="50"
                           align="center" />
          <el-table-column prop="code"
                           label="部门编码"
                           min-width="70"
                           align="center" />
          <el-table-column prop="name"
                           label="部门名称"
                           min-width="70"
                           align="center" />
          <el-table-column prop="num"
                           label="部门人数"
                           min-width="70"
                           align="center" />
          <!-- <el-table-column
            prop="createTime"
            label="创建时间"
            min-width="70"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.createTime !== null">{{timeFormatter(scope.row.createTime)}}</span>
            </template>
          </el-table-column> -->
          <el-table-column align="center"
                           label="操作"
                           min-width="120">
            <template slot-scope="scope">
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
    </el-card>
    <el-dialog :close-on-click-modal="false"
               title="部门信息"
               :visible.sync="dialogVisible"
               width="700px">
      <el-card>
        <div style="margin:20px">
          <el-form ref="departmentForm"
                   :rules="departmentFormRules"
                   :model="department"
                   size="small"
                   label-width="100px">
            <el-form-item label="公司:"
                          prop="parentId">
              <el-select v-model="department.parentId"
                         placeholder="请选择公司"
                         class="edit-form-item"
                         clearable>
                <el-option v-for="item in companys"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="部门代码:"
                          prop="code">
              <el-input v-model="department.code"
                        placeholder="请输入" />
            </el-form-item>
            <el-form-item label="部门名称:"
                          prop="name">
              <el-input v-model="department.name"
                        placeholder="请输入" />
            </el-form-item>
            <el-form-item label="部门人数:"
                          prop="num">
              <el-input v-model="department.num"
                        type="number"
                        placeholder="请输入" />
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

  </div>
</template>
<script>

import { getDepartmentList, addDepartment, modifyDepartment, getCompanyList, deleteDepartment } from '@/api/user'
import { Message } from 'element-ui'
// import moment from 'moment'

export default {
  name: 'Department',

  data () {
    return {
      tableData: [],
      companys: [],
      loading: false,
      form: {
        companyCode: 'Aconbio'
      },
      dialogVisible: false,
      department: {
        code: '',
        name: '',
        level: 2,
        parentId: null,
        num: null,
        isEdit: false
      },
      departmentFormRules: {
        name: [
          { required: true, message: '名称必须输入', trigger: 'blur' },
          { min: 2, max: 30, message: '姓名2-30位字符', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '公司必须选择', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门代码必须输入', trigger: 'blur' }
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
    // timeFormatter (val) {
    //   return val === null ? '' : moment(val).format('YYYY-MM-DD')
    // },
    initOptions () {
      getCompanyList().then(res => {
        console.log('--------888888888----------')
        console.log(res)
        this.companys = res.dataContent
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },
    onSearch () {
      this.query()
    },
    query () {
      this.loading = true
      console.log(this.form)
      getDepartmentList(this.form).then(res => {
        console.log('--------77777777777777777777----------')
        console.log(res)
        this.tableData = res.dataContent
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },

    // 新增
    handleAdd () {
      this.clearData()
      this.dialogVisible = true
    },
    // 编辑
    handleEdit (row) {
      console.log('编辑')
      console.log()
      this.department = {
        code: row.code,
        name: row.name,
        level: row.level,
        parentId: row.parentId,
        num: row.num,
        isEdit: true
      }
      this.dialogVisible = true
    },
    handleSave () {
      console.log(this.department)
      console.log('212121221222')
      this.$refs.departmentForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.department.isEdit) {
            modifyDepartment(this.department).then(res => {
              this.loading = false
              Message.success('修改部门信息成功')
              this.query()
              this.clearData()
              this.dialogVisible = false
            }).catch(err => {
              console.log(err)
              Message.error(err.message)
              this.loading = false
            })
          } else {
            addDepartment(this.department).then(res => {
              Message.success('新增部门成功')
              this.query()
              this.clearData()
              this.dialogVisible = false
              this.loading = false
            }).catch(err => {
              console.log(err)
              Message.error(err.message)
              this.loading = false
            })
          }
        }
      })
    },
    // 删除
    handleDelete (row) {
      console.log('删除')
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDepartment(row.code).then(res => {
          Message.success('删除部门成功')
          this.query()
        }).catch(err => {
          Message.error('删除部门失败:' + err.message)
          console.log(err)
        })
      })
    },
    clearData () {
      this.department = {
        code: '',
        name: '',
        level: 2,
        parentId: null,
        num: null,
        isEdit: false
      }
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
