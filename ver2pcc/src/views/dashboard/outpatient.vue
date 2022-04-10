<template>
  <div class="main">
    <el-card>
      <div slot="header" class="clearfix">
        <el-form v-model="form" :inline="true" size="small">
          <el-form-item prop="queryCondition" label="查询条件:">
            <el-input v-model="form.queryCondition" class="search-item" placeholder="姓名/住院号" /></el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
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
            prop="patientName"
            label="姓名"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              <el-link type="primary" @click="clickNavigate(scope.row.id)">{{ scope.row.patientName }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="genderDisplay"
            label="性别"
            width="180"
            align="center"
          />
          <el-table-column
            prop="age"
            label="年龄"
            align="center"
          />
          <el-table-column
            prop="phoneNumber"
            label="联系方式"
            align="center"
          />
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-link type="primary" @click="handleNewPatient(scope.row)">再入院</el-link>
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
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog
      title="添加患者"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="720px"
      class="dialog"
      @close="closedPatientDialog"
    >
      <el-divider />
      <span>
        <el-form ref="patientForm" style="width:100%" :rules="patientFormRules" :model="patientForm" size="mini" label-width="90px">
          <el-row :gutter="4">
            <el-col :span="10">
              <el-form-item label="姓名" prop="patientName">
                <el-input v-model="patientForm.patientName" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="patientForm.gender" placeholder="请选择性别" style="width:100%">
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
              <el-form-item label="出生日期" prop="birthday">
                <el-date-picker
                  v-model="patientForm.birthday"
                  style="width:100%"
                  type="date"
                  placeholder="选择出生日期"
                  @change="changeGetAge"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="年龄">
                <el-input v-model="patientForm.age" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="4">
            <el-col :span="10">
              <el-form-item label="身份证" prop="idCard">
                <el-input v-model="patientForm.idCard" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="联系方式" prop="phoneNumber">
                <el-input v-model="patientForm.phoneNumber" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="4">
            <el-col :span="10">
              <el-form-item label="入院日期" prop="hospitalizedDate">
                <el-date-picker
                  v-model="patientForm.hospitalizedDate"
                  style="width:100%"
                  type="date"
                  placeholder="选择入院日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="住院号" prop="hospitalizedNum">
                <el-input v-model="patientForm.hospitalizedNum" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="4">
            <el-col :span="10">
              <el-form-item label="腕带码" prop="code">
                <el-input v-model="patientForm.code" />
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="床号" prop="bed">
                <el-input v-model="patientForm.bed" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="4">
            <el-col :span="10">
              <el-form-item prop="departmentCode" label="科室:">
                <div style="width:200px;height:32px" class="pp">
                  <my-treeselect ref="selPatientTree" :append-true="false" :valuebb="addDepartDefaultCodes" :mydata="deptOptions" @changeSel="changePatientSelHandle" @inputChanging="inoutPatientChangeHandle" />
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="医生" prop="doctorCode">
                <el-select v-model="patientForm.doctorCode" placeholder="请选择医生" style="width:100%">
                  <el-option
                    v-for="item in doctorOptions"
                    :key="item.doctorCode"
                    :label="item.doctorName"
                    :value="item.doctorCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" plain type="primary" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleCreatePatient">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { getGenders, getDepartments, queryDoctors } from '@/api/user'
import { queryOutPatient, reApplyHospitalization } from '@/api/patient'
import { Message } from 'element-ui'
import MyTreeselect from '@/components/common/MyTreeselect.vue'

export default {
  name: 'Instrument',
  components: { MyTreeselect },
  data () {
    return {
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name'

      },
      loading: false,
      genderOptions: [],
      doctorOptions: [

      ],

      form: {

        queryCondition: '',
        size: 20,
        page: 1

      },
      dialogVisible: false,
      // 默认值
      addDepartDefaultCodes: null,
      patientForm: {
        id: 0,
        patientName: '',
        gender: '',
        birthday: '',
        idCard: null,
        hospitalizedNum: '',
        phoneNumber: '',
        hospitalizedDate: '',
        code: null,
        departmentCode: '',
        departmentName: '',
        bed: '',
        doctorCode: '',
        age: null
      },
      patientFormRules: {
        patientName: [
          { required: true, message: '姓名必须输入', trigger: 'blur' },
          { min: 2, max: 10, message: '姓名2-10位字符', trigger: 'blur' }

        ],
        gender: [
          { required: true, message: '性别必须选择', trigger: 'change' }
        ],
        bed: [
          { required: true, message: '床号必须输入', trigger: 'blur' },
          { min: 1, max: 12, message: '床号长度在 1 到 12 个字符', trigger: 'blur' }

        ],
        code: [
          { min: 5, max: 18, message: '腕带码长度在 5 到 18 个字符', trigger: 'blur' }
        ],
        idCard: [
          { min: 5, max: 18, message: '身份证长度在 5 到 18 个字符', trigger: 'blur' }
        ],

        birthday: [
          { required: true, trigger: 'change', message: '出生日期必须输入' }
        ],
        hospitalizedNum: [
          { required: true, trigger: 'blur', message: '住院号必须输入' },
          { min: 4, max: 18, message: '住院号 4 到18 个字符', trigger: 'blur' }
        ],
        departmentCode: [
          { required: true, trigger: 'change', message: '科室必须选择' }
        ],
        doctorCode: [
          { required: true, trigger: 'change', message: '医生必须选择' }

        ],
        phoneNumber: [
          { min: 8, max: 32, message: '联系方式长度在 8 到 32 个字符', trigger: 'blur' }

        ]
        // hospitalizedDate: [
        //   { required: true, trigger: 'blur', message: '出生日期必须输入' }
        // ]
      },
      tableData: [],
      total: 0

    }
  },
  computed: {
    ...mapGetters(['name', 'token', 'departmentCode', 'departmentName'])

  },
  created () {
    this.initOptions()
    this.onSearch()
  },
  methods: {
    onSearch () {
      this.form.page = 1
      this.query()
    },

    query () {
      // this.form.page = 1
      this.loading = true
      queryOutPatient(this.form).then(res => {
        this.tableData = res.dataContent.records
        this.total = res.dataContent.total
        this.loading = false
      }).catch(err => {
        console.log(err)
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
    initOptions () {
      getDepartments().then(res => {
        // 默认值
        if (this.departmentCode !== null && this.departmentCode !== '') {
          this.addDepartDefaultCodes = []
          this.addDepartDefaultCodes.push(this.departmentCode)
        } else {
          this.addDepartDefaultCodes = null
        }
        this.deptOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
      // getDoctors().then(res => {
      //   this.doctorOptions = res.dataContent
      //   // this.doctorOptions.unshift({ doctorCode: '', doctorName: '全部' })
      // }).catch(err => {
      //   console.log(err)
      // })

      getGenders().then(res => {
        this.genderOptions = res.dataContent
      }).catch(err => {
        console.log(err)
      })
    },
    handleNewPatient (patient) {
      this.patientForm = {
        id: patient.id,
        patientName: patient.patientName,
        gender: patient.gender,
        birthday: patient.birthday,
        idCard: patient.idCard,
        hospitalizedNum: '',
        phoneNumber: patient.phoneNumber,
        hospitalizedDate: '',
        code: null,
        departmentCode: this.departmentCode,
        departmentName: '',
        bed: '',
        doctorCode: '',
        age: patient.age

      }
      this.addDepartDefaultCodes = []
      this.addDepartDefaultCodes.push(this.departmentCode)
      this.onQueryPatientDoctors(this.departmentCode)
      this.dialogVisible = true
    },
    closedPatientDialog () {
      this.$refs.patientForm.resetFields()
      this.dialogVisible = false
    },
    clickNavigate (id) {
      this.$router.push({
        path: '/detail',
        query: { id: id, isOutpatient: 'true' }
      })
    },
    // 新增患者=选择科室
    changePatientSelHandle (val) {
      this.handlePatientNodeClear()
      this.patientForm.departmentCode = val.id
      this.onQueryPatientDoctors(val.id)
    },
    inoutPatientChangeHandle (val) {
      // 清空
      if (val === undefined || val === '' || val === null) {
        this.handlePatientNodeClear()
      } else {
        if (Array.isArray(val)) {
          if (val.length > 0) {
            this.onQueryPatientDoctors(val[0])
          }
        } else {
          this.onQueryPatientDoctors(val)
        }
      }
    },
    handlePatientNodeClear () {
      this.doctorOptions = []
      this.patientForm.departmentCode = null
      this.patientForm.doctorCode = null
    },
    onQueryPatientDoctors (code) {
      this.doctorOptions = []
      queryDoctors(code).then(res => {
        this.doctorOptions = res.dataContent
      }).catch(err => {
        console.log(err.message)
      })
    },
    changeGetAge (e) {
      var date = moment(new Date()).format('YYYY-MM-DD')
      var date1 = new Date(date)
      var eDate = moment(e).format('YYYY-MM-DD')
      var eDate1 = new Date(eDate)
      const age =
          date1.getFullYear() -
          eDate1.getFullYear() -
          (date1.getMonth() < eDate1.getMonth() ||
          (date1.getMonth() === eDate1.getMonth() &&
          date1.getDate() < eDate1.getDate())
            ? 1
            : 0)
      this.patientForm.age = age
    },
    handleCreatePatient () {
      // console.log(this.patientForm)
      this.$refs.patientForm.validate(valid => {
        if (valid) {
          reApplyHospitalization(this.patientForm).then(res => {
            this.dialogVisible = false
            Message.success('再入院成功')

            this.clearData()
            this.query()
          }).catch(err => {
            Message.error(err.message)
            console.log(err)
          })
        }
      })
    },
    clearData () {
      this.patientForm = {
        id: 0,
        patientName: '',
        gender: '',
        birthday: '',
        idCard: null,
        hospitalizedNum: '',
        phoneNumber: '',
        hospitalizedDate: '',
        code: null,
        departmentCode: '',
        departmentName: '',
        bed: '',
        doctorCode: ''

      }
    }

  }
}
</script>
<style scoped>
.main {
    margin:10px;
}
</style>
