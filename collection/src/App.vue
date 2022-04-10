<template>
  <div id="app">
    <div>
      <el-image
        alt="请截屏保存预约码"
        style="width: 100%;height:auto;"
        :src="require('@/assets/images/banner.png')" />
    </div>
    <van-tabs v-model="active" style="margin-top: -8px" @click="onClick">
      <van-tab title="生成预约码" name="a">
        <div style="padding:0 10px">
          <van-form
            :show-error-message="false"
            :show-error="false"
            input-align="right"
            @submit="onSubmit"
            @failed="onFailed">
            <van-field
              v-model="ruleForm.name"
              name="姓名"
              label="姓名"
              required
              placeholder="输入姓名"
              :rules="[{ required: true, message: '请填写姓名' }]" />
            <van-field
              readonly
              clickable
              name="人员类型"
              required
              :value="ruleForm.perTypeText"
              label="人员类型"
              placeholder="请选择人员类型"
              :rules="[{ required: true, message: '请选择人员类型' }]"
              @click="showPickerZero = true" />
            <van-popup v-model="showPickerZero" position="bottom">
              <van-picker
                show-toolbar
                :columns="perTypeColumns"
                @confirm="onConfirmPer"
                @cancel="showPickerZero = false" />
            </van-popup>
            <van-field
              readonly
              clickable
              name="picker"
              required
              :value="ruleForm.identityTypeText"
              label="证件类型"
              placeholder="请选择证件类型"
              :rules="[{ required: true, message: '请选择证件类型' }]"
              @click="showPickerOne = true" />
            <van-popup v-model="showPickerOne" position="bottom">
              <van-picker
                show-toolbar
                :columns="credTypeColumns"
                @confirm="onConfirmCred"
                @cancel="showPickerOne = false" />
            </van-popup>
            <van-field
              v-model="ruleForm.identityCode"
              name="证件号码"
              label="证件号码"
              required
              placeholder="输入证件号码"
              :rules="[{ required: true, message: '请填证件号码' },
                       {validator, message: '证件号码格式错误！'}]" />
            <van-field
              readonly
              clickable
              name="pickerGender"
              required
              :value="ruleForm.genderText"
              label="性别"
              placeholder="请选择性别"
              :rules="[{ required: true, message: '请选择性别' }]"
              @click="showPickerTwo = true" />
            <van-popup v-model="showPickerTwo" position="bottom">
              <van-picker
                show-toolbar
                :default-index="0"
                :columns="genderColumns"
                @confirm="onConfirmGender"
                @cancel="showPickerTwo = false" />
            </van-popup>
            <van-field
              v-model="ruleForm.age"
              name="年龄"
              label="年龄"
              type="digit"
              required
              placeholder="输入年龄"
              :rules="[{ required: true, message: '请填写年龄' },
                       { validator: validatorAge, message: '年龄最大不超过120' }
              ]" />
            <van-field
              v-model="ruleForm.phoneNumber"
              name="手机号码"
              label="手机号码"
              type="tel"
              required
              placeholder="输入手机号码"
              :rules="[
                { required: true, message: '请填写手机号码' },
                { validator: validatorPhone, message: '请输入正确的手机号' }
              ]" />
            <van-field
              readonly
              clickable
              name="pickerAddress"
              required
              :value="ruleForm.goodAddress"
              label="地址"
              placeholder="请选择地区"
              :rules="[{ required: true, message: '请选择地区' }]"
              @click="showPickerThree = true" />
            <van-popup v-model="showPickerThree" position="bottom">
              <van-area
                v-if="showPickerThree"
                title="请选择区域"
                :area-list="areaList"
                @confirm="onConfirmArea"
                @cancel="showPickerThree = false" />
            </van-popup>
            <van-field
              v-model="ruleForm.address"
              name="常住详细地址"
              label="常住详细地址"
              required
              placeholder="输入详细地址"
              :rules="[{ required: true, message: '请填写详细地址' }]" />
            <div style="margin: 16px;">
              <van-button
                block
                style="font-size:18px"
                type="info"
                native-type="submit">
                <van-icon name="qr" color="#ffffff" size="20" />
                生成预约码</van-button>
            </div>
          </van-form>
        </div>
      </van-tab>
      <van-tab title="预约历史" name="b">
        <form action="/">
          <van-search
            v-model="phoneValue"
            show-action
            clearable
            placeholder="请输入手机号码"
            @search="onSearch">
            <template #action>
              <div @click="onSearch">搜索</div>
            </template>
          </van-search>
        </form>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了">
          <van-cell
            v-for="item in list"
            :id="item.id"
            :key="item.id"
            center
            is-link
            value="查看预约码"
            @click="cellClick">
            <template #title>
              <div class="custom-title">姓名:&nbsp;&nbsp;{{ item.name }}</div>
              <div class="custom-title">手机号码:&nbsp;&nbsp;{{ item.phoneNumber }}</div>
              <div class="custom-title">预约时间:&nbsp;&nbsp;{{ formatterTime(item.orderTime) }}</div>
              <div style="font-size:12px;" class="custom-title">{{ item.identityTypeDisplay }}:{{ item.identityCode }}</div>
            </template>
          </van-cell>
        </van-list>
      </van-tab>
    </van-tabs>
    <van-dialog
      v-model="visible"
      confirm-button-color="#1997EF"
      theme="round-button"
      @close="closedHandle">
      <div style="text-align:center">
        <van-image
          fit="cover"
          style="width: 100%;height:auto;"
          :src="require('@/assets/images/qrtop.png')" />
        <vue-qr
          v-if="resDacontent.id !== null && resDacontent.id !== undefined"
          style="border:1px solid gray;margin-top:10px;"
          :text="resDacontent.id"
          :size="220" />
        <div style="margin:10px 0px;">
          <div v-if="resDacontent.name !== null && resDacontent.name !== undefined" style="font-size:20px;margin:10px 0px;">{{ resDacontent.name }}</div>
          <span v-if="resDacontent.genderDisplay !== null && resDacontent.genderDisplay !== undefined" style="font-size:15px">{{ resDacontent.genderDisplay }}</span>
          <span v-if="resDacontent.age !== null && resDacontent.age !== undefined" style="font-size:15px">{{ resDacontent.age }}岁</span>
          <span v-if="resDacontent.identityCode !== null && resDacontent.identityCode !== undefined" style="font-size:15px">{{ resDacontent.identityCode }}</span>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { Dialog } from 'vant'
// import { Toast } from 'vant'
// import { Icon } from 'vant'
import { areaList } from '@vant/area-data'
import { getIdentityTypes, collectInfo, getOrderInfo, getPersonTypes } from '@/api/user'
import { Message } from 'element-ui'
import moment from 'moment'
import vueQr from 'vue-qr'
export default {
  name: 'App',
  components: {
    vueQr
  },
  data () {
    return {
      visible: false,
      haha: false,
      active: 'a',
      list: [],
      phoneValue: '',
      loading: false,
      finished: false,
      showPickerZero: false,
      showPickerOne: false,
      showPickerTwo: false,
      showPickerThree: false,
      pickerShow: false,
      idCode: null,
      areaList,
      pickerType: 'one',
      areaPicker: false,
      // credTypeColumns: ['居民身份证', '居民户口簿', '护照', '军官证', '驾驶证', '港澳居民来往内地通行证', '台湾居民来往内地通行证', '其他法定有效证件'],
      credTypeColumns: [],
      perTypeColumns: [],
      genderColumns: ['请选择性别', '女', '男'],
      ruleForm: {
        name: '',
        perTypeText: '',
        perType: '',
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
    formatterTime (val) {
      return val !== null ? moment(val).format('yyyy-MM-DD') : ''
    },
    validator (val) {
      if (this.ruleForm.identityTypeText === '身份证') {
        const card15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/
        const card18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
        return card15.test(val) || card18.test(val)
      } else {
        const card5 = /[\u4E00-\u9FA5]/g
        return !card5.test(val)
      }
    },
    validatorAge (val) {
      console.log(val)
      if (val > 120) {
        return false
      } else {
        return true
      }
    },
    validatorPhone (val) {
      const card = /^[1][3,4,5,7,8][0-9]{9}$/
      return card.test(val)
    },
    init () {
      getIdentityTypes().then(res => {
        if (res.dataContent !== null) {
          this.handleData(res.dataContent)
        }
      }).catch(err => {
        Message.error(err.message)
      })
      getPersonTypes().then(res => {
        if (res.dataContent !== null) {
          this.handlePerTypeData(res.dataContent)
        }
      }).catch(err => {
        Message.error(err.message)
      })
    },
    handlePerTypeData (data) {
      console.log(data)
      const arr = []
      this.perTypeColumns = []
      data.forEach(element => {
        const obj = {}
        obj.code = element.code
        obj.text = element.name
        arr.push(obj)
      })
      this.perTypeColumns = arr
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
    //
    onClick (name, title) {
      if (name === 'b') {
        this.loading = false
        this.finished = true
      }
    },
    // 人员类型
    onConfirmPer (value, index) {
      this.ruleForm.perTypeText = value.text
      this.ruleForm.perType = value.code
      this.showPickerZero = false
    },
    //
    onConfirmCred (value, index) {
      this.ruleForm.identityTypeText = value.text
      this.ruleForm.identityType = value.code
      this.showPickerOne = false
    },
    onConfirmGender (value, index) {
      if (value === '请选择性别') {
        this.ruleForm.genderText = ''
      } else if (value === '男') {
        this.ruleForm.gender = 'Male'
        this.ruleForm.genderText = '男'
      } else {
        this.ruleForm.gender = 'Female'
        this.ruleForm.genderText = '女'
      }
      this.showPickerTwo = false
    },
    onConfirmArea (value) {
      // this.ruleForm.address = value
      if (value.length >= 0) {
        this.ruleForm.province = value[0].name
        this.ruleForm.city = value[1].name
        this.ruleForm.county = value[2].name
        this.ruleForm.goodAddress = value[0].name + value[1].name + value[2].name
      }
      this.showPickerThree = false
    },
    onSubmit (values) {
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
        personType: this.ruleForm.perType,
        name: this.ruleForm.name,
        phoneNumber: this.ruleForm.phoneNumber
      }
      collectInfo(obj).then(res => {
        this.resDacontent = {}
        this.resDacontent = res.dataContent
        this.visible = true
      }).catch(err => {
        if (err) {
          Dialog.alert({
            title: '注意',
            message: err.message
          }).then(() => {
            // on close+
          })
        }
      })
    },
    onFailed (errorInfo) {
      // errorInfo: { values: object, errors: object[] }
      if (errorInfo.errors.length > 0) {
        Dialog.alert({
          title: '注意',
          message: (errorInfo.errors)[0].message,
          confirmButtonColor: '#004B97'
        }).then(() => {
        // on close+
        })
      }
    },
    closedHandle () {
      this.cleanFormData()
      this.resDacontent = {}
      this.visible = false
    },
    cleanFormData () {
      this.ruleForm = {
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
      }
    },
    onSearch () {
      this.loading = true
      if (this.validatorPhone(this.phoneValue)) {
        getOrderInfo(this.phoneValue).then(res => {
          console.log(res)
          if (res.dataContent !== null) {
            this.list = res.dataContent
          }
          this.loading = false
        }).catch(err => {
          Message.error(err.message)
          this.loading = false
        })
      } else {
        Dialog.alert({
          title: '注意',
          message: '请输入正确手机号码',
          confirmButtonColor: '#004B97'
        }).then(() => {
          this.list = []
        // on close+
        })
      }
    },
    cellClick (e) {
      this.resDacontent.id = e.currentTarget.id
      this.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.van-field {
  font-size: 16px;
}
</style>
