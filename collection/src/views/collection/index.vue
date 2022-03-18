<template>
  <div>
    <div>
      <el-image
        alt="预约码30天有效,请截屏保存"
        style="width: 100%;height:auto;"
        :src="require('@/assets/images/top.png')" />
    </div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      style="padding-right: 20px"
      size="mini"
      :show-message="false">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name" placeholder="输入姓名" type="text" style="text-align:right" />
      </el-form-item>
      <el-form-item label="证件类型" prop="credType">
        <el-input v-model="ruleForm.credType" />
      </el-form-item>
      <el-form-item label="证件号码" prop="idCard">
        <el-input v-model="ruleForm.idCard" placeholder="输入证件号码" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="ruleForm.gender" placeholder="请选择性别">
          <el-option label="男" value="male" />
          <el-option label="女" value="female" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="ruleForm.age" placeholder="输入年龄" />
      </el-form-item>
      <el-form-item label="手机号码:" prop="phoneNumber">
        <el-input
          v-model="ruleForm.phoneNumber"
          type="tel" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          v-model="ruleForm.address"
          placeholder="输入详细地址"
          @focus="pickerHandle" />
      </el-form-item>
      <el-form-item label="常驻详细地址" prop="goodAddress">
        <el-input v-model="ruleForm.goodAddress" placeholder="输入详细地址" />
      </el-form-item>
      <div style="text-align:center;">
        <el-button style="width:85%;padding:8px;" type="primary" @click="submitForm('ruleForm')">
          <svg-icon icon-class="qrcode" style="width:16px;height:16px;vertical-align:middle;" />
          生成预约码</el-button>
      </div>
    </el-form>

    <el-dialog :visible.sync="visible" @close="closedDialog">
      <div>
        <div>{{ ruleForm.name }}</div>
        <div id="qrcode" style="width:250px; height:250px; margin-top:15px;" />
      </div>
    </el-dialog>
    <van-popup v-model="pickerShow" position="bottom" :style="{ height: '30%' }">
      <van-picker
        title="标题"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
        @change="onChange" />
    </van-popup>

  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { addPrintStyle } from '@/utils/index'
import { Message } from 'element-ui'
import MyTreeselect from '@/components/common/MyTreeselect.vue'

export default {
  // components: { MyTreeselect },
  data () {
    return {
      visible: false,
      pickerShow: false,
      qrcode: null,
      itemList: [],
      ruleForm: {
        name: '',
        credType: '居民身份证',
        idCard: '',
        gender: '',
        age: '',
        phoneNumber: '',
        goodAddress: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
        ],
        credType: [
          { required: true, message: '请选择证件类型', trigger: 'change' }
        ],
        idCard: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'change' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'change' }
        ],
        goodAddress: [
          { required: true, message: '请输入详细地址', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['name', 'token', 'organizationName', 'departmentCode'])
  },
  mounted () {
    // this.onSearch()
  },
  created () {
  },
  methods: {
    pickerHandle () {
      this.pickerShow = true
    },
    submitForm: function (formName) {
      this.$refs[formName].validate((valid) => {
        // if (valid) {
        console.log(this.ruleForm.name)
        this.visible = true
        this.qrcode = new QRCode(document.getElementById('qrcode'), {
          width: 100,
          height: 100
        })
        this.qrcode.makeCode('hhahahahhahahah')
        // } else {
        //   console.log('error submit!!');
        //   return false;
        // }
      })
    },

    closedDialog () {
      this.qrcode.clear()
      document.getElementById('qrcode').innerHTML = ''
      this.dialogVisible = false
    }
  }
}
</script>
<style>

.Low {
  color: blue;
}
.High {
  color: red;
}
.tb {
  border-right: 1px dotted;
}

.dotline {
  border-top: 1px dotted;
}
.padding {
  padding: 4px;
}

.search-item {
  width: 220px;
}
.unit {
  padding-top: 5px;
  font-size: 3px;
}
@media print {
  .no-print {
    display: none !important;
  }

  .print-footer {
    position: fixed;
    bottom: 5px;
    right: 10px;
  }

}

</style>
