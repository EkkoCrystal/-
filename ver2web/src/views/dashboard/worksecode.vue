<template>
  <div class="mmnn">
    <el-card>
      <el-form
        ref="formm"
        :model="form"
        :inline="true"
        size="small">
        <!-- <el-form-item label="园区:">
          <el-input v-model="form.condition" class="search-item" placeholder="请输入" />
        </el-form-item> -->
        <el-form-item>
          <!-- <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="restQuery">重置</el-button> -->
          <el-button
            type="primary"
            size="small"
            @click="handleAdd">新增园区</el-button>
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
            prop="name"
            label="园区名称"
            min-width="70"
            align="center" />

          <el-table-column
            prop="managerName"
            label="负责人"
            min-width="70"
            align="center" />
          <el-table-column
            prop="phoneNumber"
            label="电话"
            min-width="100"
            align="center" />

          <el-table-column
            align="center"
            label="操作"
            min-width="120">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                style="color:#1890FF"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="text"
                style="color:#D43030"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>

          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      title="园区信息"
      :visible.sync="dialogVisible"
      width="700px">
      <el-card>
        <div style="margin:20px">
          <el-form
            ref="parkForm"
            :rules="parkFormRules"
            :model="park"
            size="small"
            label-width="100px">
            <el-form-item
              label="园区名称:"
              prop="name">
              <el-input
                v-model="park.name"
                placeholder="请输入" />
            </el-form-item>
            <el-form-item
              label="负责人:"
              prop="managerName">
              <el-input
                v-model="park.managerName"
                placeholder="请输入" />
            </el-form-item>
            <el-form-item
              label="负责人电话:"
              prop="phoneNumber">
              <el-input
                v-model="park.phoneNumber"
                type="tel"
                placeholder="请输入" />
            </el-form-item>

          </el-form>
        </div>
      </el-card>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>

import { getWorkSections, addWorksection, modifyWorkSections } from '@/api/user'
import { Message } from 'element-ui'
// import moment from 'moment'

export default {
  name: 'Worksecode',

  data () {
    var checkPhone = (rule, value, callback) => {
      let regPone = null
      const mobile = /^((13|14|15|17|18)[0-9]{1}\d{8})$/
      const tel = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
      if (value !== null && value.charAt(0) === '0') {
        regPone = tel
      } else if (value !== null && value.charAt(0) !== '0') {
        regPone = mobile
      }
      if (regPone === null) {
        return callback(
          new Error('请输入电话')
        )
      } else if (!regPone.test(value)) {
        return callback(
          new Error("请输入正确的电话格式,其中座机格式'区号-座机号码'")
        )
      } else {
        callback()
      }
    }

    return {
      mapDialogVisible: false,
      tableData: [],
      loading: false,
      form: {
        condition: '',
        size: 20,
        page: 1
      },
      dialogVisible: false,
      park: {
        code: 0,
        name: '',
        managerName: '',
        phoneNumber: '',
        isEdit: false
      },
      parkFormRules: {
        name: [
          { required: true, message: '名称必须输入', trigger: 'blur' },
          { min: 2, max: 10, message: '姓名2-10位字符', trigger: 'blur' }
        ],
        managerName: [
          { required: true, message: '负责人必须输入', trigger: 'blur' },
          { min: 2, max: 10, message: '姓名2-10位字符', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '负责人电话必须输入', trigger: 'blur' },
          { validator: checkPhone, message: '请输入正确的电话', trigger: 'blur, change' }
        ]
      },
      total: 0
    }
  },
  created () {

  },
  mounted () {
    this.query()
  },
  methods: {
    query () {
      this.loading = true
      getWorkSections().then(res => {
        console.log('--------77777777777777777777----------')
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
      this.park = {
        code: row.code,
        name: row.name,
        managerName: row.managerName,
        phoneNumber: row.phoneNumber,
        isEdit: true
      }
      this.dialogVisible = true
    },
    handleSave () {
      this.loading = true
      this.$refs.parkForm.validate(valid => {
        if (valid) {
          if (this.park.isEdit) {
            modifyWorkSections(this.park).then(res => {
              this.loading = false
              Message.success('修改园区信息成功')
              this.query()
              this.clearData()
              this.dialogVisible = false
            }).catch(err => {
              console.log(err)
              Message.error(err.message)
              this.loading = false
            })
          } else {
            addWorksection(this.park).then(res => {
              if (res.code === '0') {
                this.loading = false
                Message.success('新增园区成功')
                this.query()
                this.clearData()
                this.dialogVisible = false
              } else {
                this.loading = false
                Message.error('新增园区失败')
              }
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
      this.$confirm('此操作将永久删除该园区, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Message.error('删除园区，请联系医疗软件部门进行删除!!')
        // deleteWorkSections(row.code).then(res => {
        //   if (res.code === '0') {
        //     this.query()
        //     Message.success('删除园区成功')
        //   } else {
        //     Message.success('操作失败')
        //   }
        // }).catch(err => {
        //   Message.error('删除园区失败:' + err.message)
        //   console.log(err)
        // })
      })
    },
    clearData () {
      this.park = {
        code: 0,
        name: '',
        managerName: '',
        phoneNumber: '',
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
