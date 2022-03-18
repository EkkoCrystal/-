<template>
  <div>
    <el-card>
      <el-form
        ref="formm"
        :model="form"
        :inline="true"
        size="small">
        <!-- <el-form-item label="关键词:">
          <el-input
            v-model="form.condition"
            class="search-item"
            placeholder="请输入" />
        </el-form-item> -->
        <el-form-item>
          <!-- <el-button
            type="primary"
            @click="onSearch">查询</el-button> -->
          <el-button
            type="primary"
            size="small"
            @click="handleNewOrganization">新增组织机构</el-button>
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
            prop="code"
            label="组织机构编码"
            min-width="90"
            align="center" />
          <el-table-column
            prop="name"
            label="组织机构名称"
            min-width="90"
            align="center" />
          <el-table-column
            prop="contactName"
            label="负责人"
            min-width="90"
            align="center" />
          <el-table-column
            prop="contactPhoneNumber"
            label="负责人电话"
            min-width="90"
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
                @click="handleEdit(scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="text"
                style="color:#1890FF"
                @click="handleResetPassword(scope.row)">重置密码
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
    <div class="kk">
      <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="520px"
        @close="closedDialog">
        <span slot="title">
          <span v-if="!organization.isEdit">新增组织机构</span>
          <span v-else>编辑组织机构</span>
        </span>
        <el-card class="box-card" shadow="never">
          <el-form
            ref="organizationForm"
            style="width: 100%"
            :rules="organizationRules"
            :model="organization"
            size="mini"
            label-width="120px">
            <el-form-item label="组织机构编码:" prop="code">
              <el-input v-model="organization.code" />
            </el-form-item>
            <el-form-item label="组织机构名称:" prop="name">
              <el-input v-model="organization.name" />
            </el-form-item>
            <el-form-item label="负责人:" prop="contactName">
              <el-input v-model="organization.contactName" />
            </el-form-item>
            <el-form-item label="负责人手机号:" prop="contactPhoneNumber">
              <el-input v-model="organization.contactPhoneNumber" />
            </el-form-item>
          </el-form>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button
            size="small"
            plain
            type="primary"
            @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            size="small"
            :loading="addHandle"
            @click="handleSave">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>

import { getOrganizations, creatOrganization, modifyOrganization, resetPassword } from '@/api/user'
import { Message } from 'element-ui'
import { encrypt } from '@/utils/encrypt'

export default {
  data () {
    return {
      tableData: [],
      loading: false,
      form: {
        // condition: '',
        size: 20,
        page: 1
      },
      dialogVisible: false,
      addHandle: false,
      organization: {
        id: '',
        code: '',
        contactName: '',
        contactPhoneNumber: '',
        name: '',
        isEdit: false

      },
      organizationRules: {
        name: [
          { required: true, message: '组织机构名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '组织机构编码不能为空', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '负责人不能为空', trigger: 'blur' }
        ],
        contactPhoneNumber: [
          { required: true, message: '负责人电话不能为空', trigger: 'blur' }
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

    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    query () {
      this.loading = true
      getOrganizations(this.form).then(res => {
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
    handleNewOrganization () {
      this.cleanOrigion()
      this.dialogVisible = true
    },
    handleSave () {
      this.$refs.organizationForm.validate(valid => {
        if (valid) {
          this.addHandle = true
          if (this.organization.isEdit) {
            modifyOrganization(this.organization).then(res => {
              this.addHandle = false
              this.dialogVisible = false
              Message.success('组织机构修改成功')
              this.cleanOrigion()
              this.query()
            }).catch(err => {
              console.log(err)
              this.addHandle = false
              Message.error(err.message)
            })
          } else {
            creatOrganization(this.organization).then(res => {
              this.addHandle = false
              this.dialogVisible = false
              Message.success('创建组织机构成功')
              this.query()
            }).catch(err => {
              this.addHandle = false
              console.log(err)
              Message.error(err.message)
            })
          }
        }
      })
    },
    handleEdit (row) {
      this.cleanOrigion()
      this.organization = {
        id: row.id,
        name: row.name,
        code: row.code,
        contactName: row.contactName,
        contactPhoneNumber: row.contactPhoneNumber,
        isEdit: true
      }
      this.dialogVisible = true
    },
    handleResetPassword (row) {
      const password = encrypt('acon123')
      // this.passwordDialogVisible = true
      this.$confirm('此操作将该用户的密码修改为acon123, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // resetPassword({
        //   newPassword: password,
        //   userId: row.id
        // }).then(res => {
        //   Message.success('重置密码成功,请通知用户登录后及时修改密码')
        //   this.passwordDialogVisible = false
        // }).catch(err => {
        //   console.log(err)
        //   Message.error(err.message)
        // })
      })
    },
    cleanOrigion () {
      this.organization = {
        id: '',
        code: '',
        contactName: '',
        contactPhoneNumber: '',
        name: '',
        isEdit: false
      }
    },
    closedDialog () {
      this.$refs.organizationForm.resetFields()
      this.dialogVisible = false
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
