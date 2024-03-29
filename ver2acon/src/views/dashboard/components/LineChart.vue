<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler (val) {
        this.setOptions(val)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.chart = this.$echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions ({ expectedData, actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          type: 'category',
          data: expectedData,
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLabel: {
            showMaxLabel: true
          }
        },
        grid: {
          left: 30,
          right: 30,
          bottom: 20,
          top: 30
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10],
          formatter: '{b}<br/>' + '阳性' + ': {c} (人)'
        },
        yAxis: {
          show: true,
          axisLine: {
            show: true
          },
          axisTick: {
            show: false
          },
          type: 'value',
          scale: true
        },
        legend: {
          data: ['actual']
        },
        series: [{
          name: 'expected', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: actualData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      })
    }
  }
}
</script>
