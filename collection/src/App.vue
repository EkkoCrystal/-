<template>
  <div id="app">
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
      <el-form-item label="证件类型" prop="identityTypeText">
        <el-input v-model="ruleForm.identityTypeText" @focus="pickerCredHandle" />
      </el-form-item>
      <el-form-item label="证件号码" prop="identityCode">
        <el-input v-model="ruleForm.identityCode" placeholder="输入证件号码" />
      </el-form-item>
      <el-form-item label="性别" prop="genderText">
        <el-input
          v-model="ruleForm.genderText"
          placeholder="请选择性别"
          @focus="pickerGenderHandle" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="ruleForm.age" placeholder="输入年龄" />
      </el-form-item>
      <el-form-item label="手机号码:" prop="phoneNumber">
        <el-input
          v-model="ruleForm.phoneNumber"
          type="tel" />
      </el-form-item>
      <el-form-item label="地址" prop="goodAddress">
        <el-input
          v-model="ruleForm.goodAddress"
          placeholder="输入详细地址"
          @focus="pickerAddressHandle" />
      </el-form-item>
      <el-form-item label="常驻详细地址" prop="address">
        <el-input v-model="ruleForm.address" placeholder="输入详细地址" />
      </el-form-item>
      <div style="text-align:center;">
        <el-button style="width:80%;padding:8px;margin-left:10%" type="primary" @click="submitForm('ruleForm')">
          <svg-icon icon-class="qrcode" style="width:16px;height:16px;vertical-align:middle;" />
          生成预约码</el-button>
      </div>
    </el-form>

    <van-dialog v-model="visible" @close="closedHandle">
      <div style="text-align:center">
        <div style="padding: 10px">
          <span v-if="resDacontent.name !== null" style="color:orange;font-size:16px">{{ resDacontent.name }}</span>
          <span v-if="resDacontent.genderDisplay !== null" style="font-size:13px">{{ resDacontent.genderDisplay }}</span>
          <span v-if="resDacontent.age !== null" style="font-size:13px">{{ resDacontent.age }}岁</span>
        </div>
        <div v-if="resDacontent.identityCode !== null">{{ resDacontent.identityCode }}</div>
        <vue-qr
          v-if="resDacontent.id !== null"
          :text="resDacontent.id"
          :size="150" />
        <div style="font-size:13px">请截屏保存</div>
      </div>
    </van-dialog>

    <van-popup v-model="pickerShow" position="bottom" :style="{ height: '30%' }">
      <van-picker
        v-if="pickerType === 'one'"
        show-toolbar
        visible-item-count="3"
        item-height="25"
        :columns="credTypeColumns"
        :default-index="0"
        @confirm="onConfirmCred"
        @cancel="pickerShow = false" />
      <van-picker
        v-if="pickerType === 'two'"
        show-toolbar
        visible-item-count="3"
        :columns="genderColumns"
        :default-index="0"
        @confirm="onConfirmGender"
        @cancel="pickerShow = false" />
      <van-area
        v-if="pickerType === 'three'"
        title="请选择区域"
        visible-item-count="3"
        :area-list="areaList"
        @confirm="onConfirmArea"
        @cancel="pickerShow = false" />
    </van-popup>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import { areaList } from '@vant/area-data'
import { getIdentityTypes, collectInfo } from '@/api/user'
import { Message } from 'element-ui'
import vueQr from 'vue-qr'
export default {
  name: 'App',
  components: {
    vueQr
  },
  data () {
    const validateIphoneCode = (rule, value, callback) => {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (value === '' || value === undefined || value === null) {
        callback()
      } else {
        if ((!reg.test(value)) && value !== '') {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }
    }
    return {
      visible: false,
      pickerShow: false,
      idCode: null,
      areaList,
      pickerType: 'one',
      areaPicker: false,
      // credTypeColumns: ['居民身份证', '居民户口簿', '护照', '军官证', '驾驶证', '港澳居民来往内地通行证', '台湾居民来往内地通行证', '其他法定有效证件'],
      credTypeColumns: [],
      genderColumns: ['请选择性别', '女', '男'],
      ruleForm: {
        name: '',
        identityTypeText: '',
        identityType: '',
        identityCode: '',
        gender: '',
        genderText: '',
        age: '',
        phoneNumber: '',
        address: '',
        city: '',
        county: '',
        province: '',
        goodAddress: ''

      },
      rules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
        ],
        identityTypeText: [
          { required: true, message: '请选择证件类型', trigger: 'change' }
        ],
        identityCode: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        genderText: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateIphoneCode, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'change' }
        ],
        goodAddress: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      },
      resDacontent: {}
    }
  },
  mounted () {
    // this.onSearch()
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      getIdentityTypes().then(res => {
        console.log(res)
        if (res.dataContent !== null) {
          this.handleData(res.dataContent)
        }
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },
    handleData (data) {
      const arr = []
      this.credTypeColumns = []
      data.forEach(element => {
        const obj = {}
        obj.code = element.code
        obj.text = element.name
        arr.push(obj)
      })
      this.credTypeColumns = arr
    },
    pickerCredHandle () {
      this.pickerType = 'one'
      this.pickerShow = true
    },
    pickerGenderHandle () {
      this.pickerType = 'two'
      this.pickerShow = true
    },
    pickerAddressHandle () {
      this.pickerType = 'three'
      this.pickerShow = true
    },
    //
    onConfirmCred (value, index) {
      console.log(value)
      this.ruleForm.identityTypeText = value.text
      this.ruleForm.identityType = value.code
      this.pickerShow = false
    },
    onConfirmGender (value, index) {
      console.log(value)
      if (value === '请选择性别') {
        this.ruleForm.genderText = ''
      } else if (value === '男') {
        this.ruleForm.gender = 'Male'
        this.ruleForm.genderText = '男'
      } else {
        this.ruleForm.gender = 'Female'
        this.ruleForm.genderText = '女'
      }
      this.pickerShow = false
    },
    onConfirmArea (value) {
      // this.ruleForm.address = value
      console.log(value)
      if (value.length >= 0) {
        this.ruleForm.province = value[0].name
        this.ruleForm.city = value[1].name
        this.ruleForm.county = value[2].name
        this.ruleForm.goodAddress = value[0].name + value[1].name + value[2].name
      }
      this.pickerShow = false
    },

    submitForm: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          Dialog.alert({
            title: '注意',
            message: '请填写全部信息',
            confirmButtonColor: '#004B97'
          }).then(() => {
            // on close+
          })
        } else {
          const obj = {
            address: {
              address: this.ruleForm.address,
              city: this.ruleForm.city,
              county: this.ruleForm.county,
              province: this.ruleForm.province
            },
            age: this.ruleForm.age,
            gender: this.ruleForm.gender,
            identityCode: this.ruleForm.identityCode,
            identityType: this.ruleForm.identityType,
            name: this.ruleForm.name,
            phoneNumber: this.ruleForm.phoneNumber
          }
          collectInfo(obj).then(res => {
            this.resDacontent = {}
            this.resDacontent = res.dataContent
            this.visible = true
          }).catch(err => {
            console.log(err)
            if (err) {
              // Dialog.alert({
              //   title: '注意',
              //   message: '信息出错了，请重试'
              // }).then(() => {
              //   // on close+
              // })
            }
          })
        }
      })
    },
    closedHandle () {
      this.visible = false
    }
  }
}
</script>
