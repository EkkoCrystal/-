<template>
  <div>

    <el-card>
      <el-tabs
        v-model="activeName"

        type="border-card"
        @tab-click="drugTabHandleClick"
      >
        <el-tab-pane
          v-for="category in drugCategories"
          :key="category.code"
          :value="category.code"
          :label="category.name"
          :name="category.code"
        >
          <el-form
            ref="dialogQueryConditionForm"
            :model="queryConditionForm"
            size="mini"
            :inline="true"

            label-width="80px"
          >
            <el-form-item label="关键字:" prop="queryCondition">
              <el-input v-model="queryConditionForm.queryCondition" placeholder="简码/名称" clearable class="small-form-item" />
            </el-form-item>
            <el-form-item>
              <el-button v-loading="drugTableDataLoading" type="primary" @click="drugOnSearchByCategory">查询</el-button>
              <el-button type="primary" size="mini" @click="drugAddClick">新增</el-button>
            </el-form-item>
          </el-form>

          <el-table
            ref="drugDialogTable"
            v-loading="drugTableDataLoading"
            :data="drugTableData"
            style="width: 100%"
            stripe
            border
          >
            <!-- <el-table-column
              type="selection"
              align="center"
              width="55"
            /> -->
            <el-table-column
              type="index"
              width="50"
              label="序号"
              align="center"
            />
            <el-table-column
              prop="code"
              label="编码"
              align="center"
              width="180"
            />
            <el-table-column
              prop="shortCode"
              label="简码"
              align="center"
              width="180"
            />
            <el-table-column
              prop="name"
              align="center"
              label="名称"
            />
            <el-table-column
              prop="unit"
              align="center"
              width="100"
              label="单位"
            />
            <el-table-column
              align="center"
              label="操作"
              width="160"
            >
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="drugEditClick(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="drugDeleteClick(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:5px;float:right">
            <el-pagination
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next"
              :total="queryConditionForm.total"
              :page-size.sync="queryConditionForm.size"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <div>
      <el-dialog
        title="药品管理 "
        :visible.sync="dialogVisible"
        width="400px"
        :close-on-click-modal="false"
        @close="closedDrugDialog"
      >

        <div>
          <el-form
            ref="drugForm"
            :model="drug"
            :rules="drugRules"
            size="mini"

            label-width="80px"
          >
            <el-form-item label="分类:" prop="categoryCode">
              <el-tag>{{ drug.categoryDisplay }}</el-tag>
            </el-form-item>
            <el-form-item label="编号:" prop="code">
              <el-input v-model="drug.code" class="small-form-item" />
            </el-form-item>
            <el-form-item label="简写:" prop="shortCode">
              <el-input v-model="drug.shortCode" class="small-form-item" />
            </el-form-item>

            <el-form-item label="名称:" prop="name">
              <el-input v-model="drug.name" class="small-form-item" />
            </el-form-item>

            <el-form-item label="单位:" prop="unit">
              <el-select v-model="drug.unit" placeholder="请选择" class="small-form-item">
                <el-option
                  v-for="item in unitOptions"
                  :key="item.key"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDrugAdd">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  createMedication,
  deleteMedication,
  updateMedication,
  getMedicationCategories,
  queryMedication } from '@/api/patient'

import { Message } from 'element-ui'
export default {
  name: 'Drug',
  data () {
    return {
      dialogVisible: false,
      activeName: '',
      drugCategories: [],
      drugTableData: [],
      drugSelections: [],
      drugTableDataLoading: false,
      queryConditionForm: {
        categoryCode: '',
        queryCondition: '',
        page: 1,
        size: 20,
        total: 0

      },
      drug: {
        categoryCode: '',
        categoryDisplay: '',
        code: '',
        name: '',
        shortCode: '',
        unit: '',
        isEdited: true

      },
      drugRules: {
        categoryCode: [
          { required: true, message: '分类编号必须输入', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '编号必须输入', trigger: 'blur' },
          { min: 2, max: 12, message: '长度是2-12个字符', trigger: 'blur' }
        ],
        shortCode: [

          { min: 2, max: 12, message: '长度是2-12个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称必须输入', trigger: 'blur' },
          { min: 2, max: 32, message: '长度是2-32个字符' }
        ],
        unit: [
          { required: true, message: '单位必须选择', trigger: 'change' }
        ]

      },
      unitOptions: [
        { key: 'U', name: 'U' },
        { key: 'K', name: '颗' }
      ]
    }
  },
  mounted () {

  },
  created () {
    this.drugInitData()
  },
  methods: {
    drugInitData () {
      getMedicationCategories().then(res => {
        this.drugCategories = res.dataContent

        if (res.dataContent.length > 0) {
          this.activeName = res.dataContent[0].code
          this.drug.categoryCode = res.dataContent[0].code
          this.drug.categoryDisplay = res.dataContent[0].name
          this.queryConditionForm.categoryCode = res.dataContent[0].code

          this.drugOnSearchByCategory()
        }
      })
    },
    drugSearchByCategory () {
      this.drugTableDataLoading = true
      queryMedication(this.queryConditionForm).then(res => {
        this.queryConditionForm.total = res.dataContent.total
        this.drugTableData = res.dataContent.records
        this.drugTableDataLoading = false
      }).catch(err => {
        this.drugTableDataLoading = false
        console.log(err)
      })
    },

    drugOnSearchByCategory () {
      this.queryConditionForm.page = 1

      this.drugSearchByCategory()
    },
    drugTabHandleClick (tab, event) {
      this.queryConditionForm.categoryCode = tab.name
      this.drug.categoryCode = tab.name
      this.drug.categoryDisplay = tab.label
      this.drugOnSearchByCategory()
    },
    handleSizeChange (val) {
      this.queryConditionForm.size = val
      this.drugSearchByCategory()
    },
    handleCurrentChange (val) {
      this.queryConditionForm.page = val
      this.drugSearchByCategory()
    },
    drugAddClick () {
      this.dialogVisible = true
      this.drug.code = null
      this.drug.name = null
      this.drug.shortCode = null
      this.drug.isEdited = false
    },
    drugEditClick (row) {
      this.drug.code = row.code
      this.drug.name = row.name
      this.drug.shortCode = row.shortCode
      this.drug.unit = row.unit
      this.drug.isEdited = true
      this.dialogVisible = true
    },
    drugQueryClean () {
      this.queryConditionForm.queryCondition = ''
      this.queryConditionForm.page = 1
      this.queryConditionForm.total = 0
    },
    drugDeleteClick (row) {
      this.$confirm('确认要删除药物吗？')
        .then(_ => {
          deleteMedication(row.id).then(res => {
            Message.success('药物删除成功!')
            this.drugOnSearchByCategory()
          }).catch(err => {
            Message.error(err.message)
          })
        })
    },

    handleDrugAdd () {
      this.$refs.drugForm.validate(valid => {
        if (valid) {
          if (this.drug.isEdited) {
            updateMedication(this.drug).then(res => {
              Message.success('更新药品成功!')
              this.dialogVisible = false
              this.drugOnSearchByCategory()
            }).catch(err => {
              Message.error(err.message)
            })
          } else {
            createMedication(this.drug).then(res => {
              Message.success('新增药品成功')
              this.dialogVisible = false
              this.drugQueryClean()
              this.drugOnSearchByCategory()
            }).catch(err => {
              Message.error(err.message)
            })
          }
        }
      })
    },
    closedDrugDialog () {
      this.$refs.drugForm.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
.small-form-item{
  width:260px;
}
</style>
