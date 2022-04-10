<template>
  <div>
    <div>
      <el-card>
        <el-form ref="searchForm" v-model="searchForm" :inline="true" size="small" label-width="120px">

          <el-row>

            <el-col>
              <el-form-item label="医嘱类型:">
                <el-select v-model="searchForm.adviceType" placeholder="状态" class="search-item">
                  <el-option
                    v-for="item in templateTypeOptions"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="状态:">
                <el-select v-model="searchForm.isActive" clearable placeholder="状态" class="search-item">
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
              <el-form-item prop="name" label="医嘱模板名称:">
                <el-input
                  v-model="searchForm.templateName"
                  class="search-item"
                  maxlength="32"
                  placeholder="请输入医嘱模板名称"
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" style="margin-left:20px" icon="el-icon-search" @click="onSearch">查询</el-button>
                <el-button type="primary" size="small" @click="handleCreateTemplate">新增医嘱模板</el-button>
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
              prop="name"
              label="医嘱模板名称"

              align="center"
            />
            <el-table-column
              prop="adviceTypeDisplay"
              label="医嘱类型"

              align="center"
            />

            <el-table-column

              label="状态"
              width="180"
              align="center"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.isActive">正常</div>
                <div v-else>停用</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="inHospitalizedDate"
              label="操作"
              width="180"
              align="center"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.row)">修改</el-button>
                <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
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
    <div>
      <el-dialog
        :close-on-click-modal="false"
        title="医嘱模板信息"
        :visible.sync="dialogVisible"
        width="700px"
        @close="closedTemplateDialog"
      >
        <el-card>
          <div style="margin:20px">
            <el-form
              ref="templateForm"
              :model="template"
              :rules="templateRules"
              label-width="120px"
              style="width:100%"
            >
              <el-form-item label="医嘱模板名称:" prop="name">
                <el-input v-model="template.name" class="form-item" />
              </el-form-item>

              <el-form-item label="医嘱模板类型:" prop="adviceType">
                <el-select v-model="template.adviceType" placeholder="请选择" :disabled="template.isEdit" class="form-item" @change="handleSelectChange">
                  <el-option
                    v-for="item in templateTypeOptions"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-show="template.adviceType==='LongStandards'" label="医嘱模板内容:" prop="contents">
                <el-checkbox-group
                  v-model="template.contents"
                  class="form-item"
                  @change="checkboxChanged"
                >
                  <el-checkbox v-for="item in periodOptions" :key="item.code" :label="item.code">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item v-show="template.adviceType!=='LongStandards'" label="医嘱模板内容:" prop="contents">
                <el-select
                  v-model="template.tmpContent"

                  class="form-item"
                  @change="handleChangeTmpAdvice"
                >
                  <el-option v-for="item in periodOptions" :key="item.code" :value="item.code" :label="item.name" />
                </el-select>

              </el-form-item>
              <el-form-item v-show="template.isEdit" label="状态" prop="isActive">
                <el-checkbox v-model="template.isActive">启用</el-checkbox>

              </el-form-item>

            </el-form>
          </div>
        </el-card>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="saveData"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
// import moment from 'moment'
import { Message } from 'element-ui'

import { queryTemplate,

  getTemplateTypes, getPeriodOptions, createTemplate, updateTemplate, deleteTemplate

} from '@/api/advice'
export default {
  name: 'AdviceTemplate',
  data () {
    return {
      templateTypeOptions: [],
      loading: false,

      statusOptions: [

        {
          label: '正常',
          value: 'True'
        },
        {
          label: '停用',
          value: 'False'
        }
      ],
      searchForm: {

        adviceType: 'LongStandards',
        templateName: '',
        isActive: '',

        page: 1,
        size: 20

      },
      tableData: [],
      total: 0,
      template: {
        id: 0,

        name: '',
        adviceType: 'LongStandards',
        contents: [],
        tmpContent: '',
        isEdit: false,
        isActive: true

      },
      templateRules: {
        name: [
          { required: true, message: '医嘱模板名称必须输入', trigger: 'blur' },
          {
            min: 2,
            max: 12,
            message: '医嘱模板名称在 2 到 12 个字符',
            trigger: 'blur'
          }

        ],
        adviceType: [
          { required: true, message: '请选择模板类型', trigger: 'change' }

        ],
        contents: [
          { required: true, message: '请选择模板内容', trigger: 'blur' }
        ]

      },
      periodOptions: [],
      dialogVisible: false

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
      getTemplateTypes().then(res => {
        this.templateTypeOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
    },

    queryPeriod (t) {
      getPeriodOptions(t).then(res => {
        this.periodOptions = res.dataContent
      }).catch(err => {
        Message.error(err.message)
      })
    },

    checkboxChanged (val) {
      console.log(val)

      console.log(this.template)
    },

    handleSizeChange (val) {
      this.searchForm.size = val
      this.query()
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      this.query()
    },

    handleSelectChange (val) {
      this.queryPeriod(val)
    },
    handleChangeTmpAdvice (val) {
      this.template.contents = []
      this.template.contents.push(val)
    },
    onSearch () {
      this.searchForm.page = 1
      this.query()
    },
    query () {
      this.loading = true
      // this.searchForm.page = 1
      queryTemplate(this.searchForm).then(res => {
        this.tableData = res.dataContent.records
        this.total = res.dataContent.total
        this.loading = false
      }).catch(err => {
        console.log(err)
        Message.error(err.message)
        this.loading = false
      })
    },
    handleCreateTemplate () {
      this.clearData()
      this.dialogVisible = true
      this.queryPeriod(this.template.adviceType)
    },

    saveData () {
      this.$refs.templateForm.validate(valid => {
        if (valid) {
          if (this.template.isEdit) {
            updateTemplate(this.template).then(res => {
              Message.success('保存医嘱模板成功')
              this.dialogVisible = false
              this.query()
            }).catch(err => {
              Message.error(err.message)
            })
          } else {
            createTemplate(this.template).then(res => {
              Message.success('保存医嘱模板成功')
              this.dialogVisible = false
              this.query()
            }).catch(err => {
              Message.error(err.message)
            })
          }
        }
      })
    },
    closedTemplateDialog () {
      this.$refs.templateForm.resetFields()
      this.dialogVisible = false
    },
    handleEdit (row) {
      this.clearData()
      this.template.id = row.id
      this.template.name = row.name
      this.template.adviceType = row.adviceType
      this.template.isActive = row.isActive

      // this.template.contents = row.contents
      if (row.adviceType === 'LongStandards') {
        row.contents.forEach(k => {
          this.template.contents.push(k.code

          )
        })
      } else {
        this.template.tmpContent = row.content.code
      }
      this.template.isEdit = true
      this.queryPeriod(this.template.adviceType)
      this.dialogVisible = true
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTemplate(row.id).then(res => {
          Message.success('删除模板成功')
          this.query()
        }).catch(err => {
          console.log(err)
          Message.error(err.message)
        })
      })
    },
    clearData () {
      this.template = {
        id: 0,
        name: '',
        adviceType: 'LongStandards',
        contents: [],
        isEdit: false,
        isActive: true

      }
    }

  }
}
</script>
<style scoped>
.search-item{
  width:200px;
}
.form-item{
  width:400px
}

.box{
    display: flex;
    flex-warp: wrap;
}
.content{
    width: 33%;
}
</style>
