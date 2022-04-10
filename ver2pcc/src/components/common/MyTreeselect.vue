<template>
  <div>
    <treeselect
      v-model="departDefaultCodes"
      :options="dataArr"
      :normalizer="normalizer"
      placeholder="请选择科室"
      :clearable="false"
      no-options-text="暂时没有内容"
      no-children-text="暂时没有内容"
      no-results-text="没有匹配内容"
      :default-expand-level="Infinity"
      :append-to-body="appendIsTrue"
      @select="changeSelect"
      @input="inputChange"
    >
      <label slot="option-label" slot-scope="{ node }" style="color: #606266; font-size: 13px; font-weight: normal">
        {{ node.label }}
      </label>
    </treeselect>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
export default {
  name: 'MyTreeselect',
  components: {
    Treeselect
  },
  props: {
    valuebb: {
      type: Array,
      default () {
        return null
      }
    },
    appendTrue: {
      type: Boolean,
      default () {
        return false
      }
    },
    mydata: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      dataArr: this.mydata,
      appendIsTrue: this.appendTrue,
      departDefaultCodes: this.valuebb
    }
  },
  watch: {
    mydata: {
      handler (newvalue, oldvalue) {
        this.dataArr = this.changeDepsDataName(this.mydata)
      },
      immediate: true,
      deep: true
    },
    valuebb: {
      handler (newvalue, oldvalue) {
        this.departDefaultCodes = this.valuebb
      },
      immediate: true,
      deep: true
    },
    appendTrue: {
      handler (newvalue, oldvalue) {
        this.appendIsTrue = this.appendTrue
      },
      immediate: true,
      deep: true
    }
  },
  created () {
    // this.init()
  },
  methods: {
    // 处理默认值
    // 处理数据
    changeDepsDataName (resData) {
      const arr = [] // 定义空数组
      resData.forEach(item => {
        const objData = {}
        if (item.code === undefined) {
          objData.id = item.id
        } else {
          objData.id = item.code
        }
        // fix
        if (item.lable === undefined) {
          objData.label = item.name
        } else {
          objData.label = item.lable
        }
        // 全部加载(数据量小)
        if (item.children && item.children.length) {
          objData.children = this.changeDepsDataName(item.children)
        } else {
          delete objData.children
        }
        arr.push(objData) // 将获取的数据代入
      })
      return arr
    },
    changeSelect (n, i) {
      this.$emit('changeSel', n)
    },
    inputChange (n, i) {
      this.$emit('inputChanging', n)
    },

    normalizer (node) {
      if (node.children === null || node.children === 'null') {
        delete node.children
      }
      if (node.children && !node.children.length) {
        delete node.children
      }
      // return {
      //   id: node.id,
      //   label: node.name,
      //   code: node.code,
      //   children: node.children
      // }
    }
  }
}
</script>

<style scoped>
.vue-treeselect__control {
  height: 32px;
  line-height: 32px;
  padding-left: 10px;
}
</style>
