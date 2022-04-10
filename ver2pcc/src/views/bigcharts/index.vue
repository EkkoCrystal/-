<template>
  <div class="dashboard-container">
    <div class="top-content">
      <h2 style="margin: 0px">院内血糖数据监控</h2>
    </div>
    <el-container style="margin: 30px 20px">
      <el-aside width="300px" style="background-color: rgb(15, 19, 33)">
        <div v-for="(item, index) in totalDic" :key="index" class="menu">
          <div class="menu-left">{{ item.title }}</div>
          <div class="menu-right">{{ item.num }}</div>
        </div>
      </el-aside>
      <el-container style="margin-left: 25px">
        <el-main style="padding: 0px;background-color: rgb(15, 19, 33)">
          <el-container>
            <el-aside width="500px" style="background-color: rgb(15, 19, 33)" class="right-content-bottom-left">
              <div class="topTextLittle">
                <div class="topTextLittleText">一周血糖分布</div>
              </div>
              <div class="chartContent">
                <div ref="chartTrend5" style="width:100%;height:250px" />
              </div>
            </el-aside>
            <el-main class="right-content-top">
              <el-header style="text-align: center; background: rgba(0,0,0 , 0.3);height: 30px">
                <div class="topTextLittle">
                  <div class="topTextLittleText">一周血糖数据</div>
                </div>
              </el-header>
              <el-main style="background-color: rgb(15, 19, 33)">
                <img src="@/assets/images/changetu.png" alt="" class="btnn" @click="resetActive">
                <div class="chartContent">
                  <div ref="chartTrend3" style="width:100%;height:250px" />
                </div>
              </el-main>
            </el-main>
          </el-container>
          <el-container style="margin-top:20px">
            <el-aside width="500px" style="background-color: rgb(15, 19, 33)" class="right-content-bottom-left">
              <div class="topTextLittle">
                <div class="topTextLittleText">今日血糖分布</div>
              </div>
              <div class="chartContent">
                <div ref="chartTrend4" style="width:100%;height:300px" />
              </div>
            </el-aside>
            <el-main class="right-content-bottom-right">
              <div class="todayStatistics">
                <div class="titleDiv">
                  <span v-for="(item, index) in measureTypes" :key="index">{{ item }}</span>
                </div>
                <vue-seamless-scroll :data="departments" class="seamless-warp" :class-option="classOption">
                  <ul>
                    <li v-for="(item, index) in departments" :key="index" class="liiStyle">
                      <span style="width:120px;">{{ item.departmentName }}</span>
                      <span>{{ item.measureCount }}</span>
                      <span>{{ Math.floor(item.criticalMeasureRate * 100) }}%</span>
                      <span>{{ Math.floor(item.highMeasureRate * 100) }}%</span>
                      <span>{{ Math.floor(item.normalMeasureRate * 100) }}%</span>
                      <span>{{ Math.floor(item.lowMeasureRate * 100) }}%</span>
                    </li>
                  </ul>
                </vue-seamless-scroll>
              </div>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { bigscreenData } from '@/api/bigscreen'
import vueSeamlessScroll from 'vue-seamless-scroll'
export default {
  name: 'Bigcharts',
  components: {
    vueSeamlessScroll
  },
  data () {
    return {
      isActive: true,
      dataDic: '',
      totalDic: [],
      lineOneData: [],
      lineTwoData: {},
      dayPiaData: '',
      weekPiaData: '',

      measureTypes: ['科室名称', '测量次数', '危血糖比例', '高血糖比例', '正常值比例', '低血糖比例'],
      departments: []
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    classOption () {
      return {
        step: 0.9,
        hoverStop: true,
        limitMoveNum: 2,
        direction: 1,
        openWatch: true,
        singleHeight: 30,
        singleWidth: 0,
        waitTime: 1000
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    resetActive () {
      this.isActive = !this.isActive
      if (!this.isActive) {
        this.drawLineChart(this.lineOneData, this.$refs.chartTrend3)
      } else {
        this.drawBarChart(this.lineOneData, this.$refs.chartTrend3)
      }
    },
    init () {
      bigscreenData().then((result) => {
        this.dataDic = result.dataContent
        this.handleata()
      }).catch((err) => {
        console.log(err)
      })
    },
    handleata () {
      if (this.dataDic !== null || this.dataDic !== '') {
        this.totalDic.push({ title: '周测量人数', num: this.dataDic.measurePersonCount })
        this.totalDic.push({ title: '周测量次数', num: this.dataDic.measureCount })
        this.totalDic.push({ title: '今日测量次数', num: this.dataDic.todaySummary.measureCount })
        this.totalDic.push({ title: '今日正常值次数', num: this.dataDic.todaySummary.normalMeasureConut })
        this.totalDic.push({ title: '今日低血糖次数', num: this.dataDic.todaySummary.lowMeasureCount })
        this.totalDic.push({ title: '今日高血糖次数', num: this.dataDic.todaySummary.highMeasureCount })
        this.totalDic.push({ title: '今日危血糖次数', num: this.dataDic.todaySummary.criticalMeasureCount })

        this.departments = this.dataDic.todayDepartmentSummary
        this.weekPiaData = this.dataDic.weeklySummary
        this.dayPiaData = this.dataDic.todaySummary
        const types = ['product', '危血糖比例', '高血糖比例', '正常值比例', '低血糖比例']
        this.lineOneData.push(types)
        for (let index = 0; index < this.dataDic.tread.length; index++) {
          const element = this.dataDic.tread[index]
          const dateStr = element.date.substring(5)
          const kk = []
          kk.push(dateStr)
          kk.push(Math.floor(element.lowMeasureRate * 100))
          kk.push(Math.floor(element.normalMeasureRate * 100))
          kk.push(Math.floor(element.highMeasureRate * 100))
          kk.push(Math.floor(element.criticalMeasureRate * 100))
          this.lineOneData.push(kk)
        }
        this.drawBarChart(this.lineOneData, this.$refs.chartTrend3)
        this.drawPiaChart(this.dayPiaData, this.$refs.chartTrend4)
        this.drawPiaWeekChart(this.weekPiaData, this.$refs.chartTrend5)
      }
    },
    drawBarChart (data, myRef) {
      const myChartDay = this.$echarts.init(myRef)
      myChartDay.setOption({
        dataset: {
          // 提供一份数据。
          source: data
        },
        // backgroundColor: '#344b58',
        // 提示框
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          },
          formatter: function (params, ticket, callback) {
            console.log(params)
            var res = params[0].name
            console.log(' name' + params[0].name)
            for (var i = 0; i < params.length; i++) {
              res += '<br/>' + params[i].seriesName + ' : ' + params[i].value[i + 1] + '%'// 要填充的内容
            }
            return res
          }
          // formatter: '{a}: {c}<br />' + '%'
        },
        grid: {
          left: '10%',
          right: '20%',
          borderWidth: 0,
          top: 15,
          bottom: 25,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          top: '20%',
          right: '5%',
          textStyle: {
            color: '#fff'
          },
          icon: 'circle',
          itemWidth: 10,
          itemGap: 20,
          orient: 'vertical',
          data: ['危血糖比例', '高血糖比例', '正常值比例', '低血糖比例']
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'rgb(255, 255, 255, 1)',
              width: 0.5
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0
          }
        }],
        yAxis: [{
          type: 'value',
          scale: true,
          splitLine: {
            show: true,
            lineStyle: {
              // 使用深浅的间隔色
              color: '#fff',
              width: 0.5
            }
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            color: '#fff',
            formatter: function (value, index) {
              return value + '%'
            }
          },
          splitArea: {
            show: false
          }
        }],
        series: [{
          name: '低血糖比例',
          type: 'bar',
          stack: 'total',
          symbolSize: 10,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'rgba(24,133,242,1)'
            }
          }
        },
        {
          name: '正常值比例',
          type: 'bar',
          stack: 'total',
          symbolSize: 10,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'rgba(13,214,103,1)'
            }
          }
        },
        {
          name: '高血糖比例',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(240,12,12,1)'
            }
          }
        },
        {
          name: '危血糖比例',
          type: 'bar',
          stack: 'total',
          barMaxWidth: 12,
          barGap: '10%',
          animation: true,
          itemStyle: {
            normal: {
              color: 'rgba(173,12,93,1)'
            }
          }
        }
        ]
      })
    },
    drawLineChart (data, myRef) {
      const myChartDay = this.$echarts.init(myRef)
      myChartDay.setOption({
        dataset: {
          // 提供一份数据。
          source: data
        },
        // backgroundColor: '#344b58',
        // 提示框
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '10%',
          right: '20%',
          borderWidth: 0,
          top: 15,
          bottom: 25,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          top: '20%',
          right: '5%',
          textStyle: {
            color: '#fff'
          },
          icon: 'circle',
          itemWidth: 10,
          itemGap: 10,
          orient: 'vertical',
          data: ['危血糖比例', '高血糖比例', '正常值比例', '低血糖比例']
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'rgb(255, 255, 255, 1)',
              width: 0.5
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0
          }
        }],
        yAxis: [{
          type: 'value',
          scale: true,
          splitLine: {
            show: true,
            lineStyle: {
              // 使用深浅的间隔色
              color: '#fff',
              width: 0.5
            }
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            color: '#fff',
            formatter: function (value, index) {
              return value + '%'
            }
          },
          splitArea: {
            show: false
          }
        }],
        series: [{
          name: '危血糖比例',
          type: 'line',
          stack: 'total',
          animation: true,
          itemStyle: {
            normal: {
              color: 'rgba(173,12,93,1)'
            }
          }
        },
        {
          name: '高血糖比例',
          type: 'line',
          stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(240,12,12,1)'
            }
          }
        },
        {
          name: '正常值比例',
          type: 'line',
          stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(13,214,103,1)'
            }
          }
        },
        {
          name: '低血糖比例',
          type: 'line',
          stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(24,133,242,1)'
            }
          }
        }
        ]
      })
    },
    drawPiaWeekChart (data, myRef) {
      // this.chart = echarts.init(this.$el, 'macarons')
      const myChartDay = this.$echarts.init(myRef, 'macaronsweek')
      myChartDay.setOption({
        title: [
          // {
          //   text: '危血糖',
          //   left: '25%',
          //   top: 'middle',
          //   textAlign: 'center',
          //   textStyle: {
          //     fontSize: 14,
          //     color: '#fff'
          //   }
          // },
          // {
          //   text: '血糖',
          //   left: '75%',
          //   top: 'middle',
          //   textAlign: 'center',
          //   textStyle: {
          //     fontSize: 14,
          //     color: '#fff'
          //   }
          // }
        ],
        legend: {
          bottom: 0,
          left: 'center',
          textStyle: {
            color: '#fff'
          },
          icon: 'circle',
          itemWidth: 10,
          itemGap: 20,
          orient: 'horizontal',
          data: [
            { name: '危血糖' },
            { name: '非危血糖' },
            { name: '高血糖' },
            { name: '正常值' },
            { name: '低血糖' }]
        },
        series: [
          {
            type: 'pie',
            radius: ['45%', '75%'],
            // legendHoverLink: false,
            // minAngle: 3,
            // avoidLabelOverlap: true,
            // hoverAnimation: false,
            // silent: true,
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: 'rgb(15, 19, 33)'
              // borderWidth: 2
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '15',
                fontWeight: 'bold'
              }
            },
            label: {
              show: true,
              position: 'inner',
              formatter: '{b}: {d}%'
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: data.criticalMeasureRate,
                name: '危血糖',
                itemStyle: {
                  color: 'rgba(173,12,93,1)'
                }
              },
              {
                value: (1 - data.criticalMeasureRate),
                name: '非危血糖',
                itemStyle: {
                  color: 'rgba(69,139,0,1)'
                }
              }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            left: '5%',
            right: '55%',
            top: 0,
            bottom: 0
          },
          {
            type: 'pie',
            radius: ['45%', '75%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: 'rgb(15, 19, 33)'
              // borderWidth: 2
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '15',
                fontWeight: 'bold'
              }
            },
            label: {
              show: true,
              position: 'inner',
              formatter: '{b}: {d}%'
            },
            data: [
              {
                value: data.highMeasureRate,
                name: '高血糖',
                itemStyle: {
                  color: 'rgba(240,12,12,1)'
                }
              },
              {
                value: data.normalMeasureRate,
                name: '正常值',
                itemStyle: {
                  color: 'rgba(13,214,103,1)'
                }
              },
              {
                value: data.lowMeasureRate,
                name: '低血糖',
                itemStyle: {
                  color: 'rgba(24,133,242,1)'
                }
              }
            ],
            animationEasing: 'cubicInOut',
            // animationDuration: 2600,
            right: '5%',
            left: '55%',
            top: 0,
            bottom: 0
          }
        ]
      })
    },
    drawPiaChart (data, myRef) {
      // this.chart = echarts.init(this.$el, 'macarons')
      const myChartDay = this.$echarts.init(myRef, 'macarons')
      myChartDay.setOption({
        title: [
          // {
          //   text: '一周',
          //   left: '25%',
          //   top: 'middle',
          //   textAlign: 'center',
          //   textStyle: {
          //     fontSize: 14,
          //     color: '#fff'
          //   }
          // },
          // {
          //   text: '今日',
          //   left: '75%',
          //   top: 'middle',
          //   textAlign: 'center',
          //   textStyle: {
          //     fontSize: 14,
          //     color: '#fff'
          //   }
          // }
        ],
        legend: {
          bottom: 0,
          left: 'center',
          textStyle: {
            color: '#fff'
          },
          icon: 'circle',
          itemWidth: 10,
          itemGap: 20,
          orient: 'horizontal',
          data: [
            { name: '危血糖' },
            { name: '非危血糖' },
            { name: '高血糖' },
            { name: '正常值' },
            { name: '低血糖' }]
        },
        series: [
          {
            type: 'pie',
            radius: ['45%', '75%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: 'rgb(15, 19, 33)'
              // borderWidth: 2
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '15',
                fontWeight: 'bold'
              }
            },
            label: {
              show: true,
              position: 'inner',
              formatter: '{b}: {d}%'
            },
            labelLine: {
              show: true,
              length: 4,
              legend2: 3
            },
            data: [
              {
                value: data.criticalMeasureRate,
                name: '危血糖',
                itemStyle: {
                  color: 'rgba(173,12,93,1)'
                }
              },
              {
                value: 1 - data.criticalMeasureRate,
                name: '非危血糖',
                itemStyle: {
                  color: 'rgba(69,139,0,1)'
                }
              }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            left: '5%',
            right: '55%',
            top: 0,
            bottom: 0
          },
          {
            type: 'pie',
            radius: ['45%', '75%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: 'rgb(15, 19, 33)'
              // borderWidth: 2
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '15',
                fontWeight: 'bold'
              }
            },
            label: {
              show: true,
              position: 'inner',
              formatter: '{b}: {d}%'
            },
            labelLine: {
              show: true,
              length: 4,
              legend2: 3
            },
            data: [

              {
                value: data.highMeasureRate,
                name: '高血糖',
                itemStyle: {
                  color: 'rgba(240,12,12,1)'
                }
              },
              {
                value: data.normalMeasureRate,
                name: '正常值',
                itemStyle: {
                  color: 'rgba(13,214,103,1)'
                }
              },
              {
                value: data.lowMeasureRate,
                name: '低血糖',
                itemStyle: {
                  color: 'rgba(24,133,242,1)'
                }
              }
            ],
            animationEasing: 'cubicInOut',
            // animationDuration: 2600,
            right: '5%',
            left: '55%',
            top: 0,
            bottom: 0
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  background-color: rgb(15, 19, 33);
  margin: 0px;
  height: 100%;
  width: 100%;
  padding: 0;
}
.top-content {
  height:50px;
  line-height: 50px;
  width: 200px;
  text-align: center;
  /* 居中条件 */
  margin: 0 auto;
  background: linear-gradient(180deg, rgba(17, 25, 51, 1) 0%, rgba(38, 43, 61, 1) 100%);
  background: url(../../assets/images/titleImage.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  // opacity: 0.7;
}
.top-content h2 {
  color: #ffffff;
  font-size: 18px;
}

.menu {
  color: white;
  margin-bottom: 40px;
  width: 100%;
  height: 70px;
  line-height: 70px;
  background: linear-gradient(180deg, rgba(17, 25, 51, 1) 0%, rgba(38, 43, 61, 1) 100%);
  border: 1px solid rgba(65, 81, 133, 1);
  border-radius: 10px;
  border-image: linear-gradient(-180deg, rgba(255,255,255,0) 15%,#00BBF2 70%, rgba(255,255,255,0) 85%) 0 0 0 2;
}
.menu .menu-left {
  float: left;
  margin-left: 15px;
}
.menu .menu-right {
  float: right;
  font-size: 20px;
  font-weight: bold;
  margin-right: 15px;
}

.right-content-top {
  background: linear-gradient(180deg, rgba(17, 25, 51, 1) 0%, rgba(38, 43, 61, 1) 100%);
  border: 1px solid rgba(65, 81, 133, 1);
  border-radius: 10px;
  padding: 0px;
  position: relative;
  margin-left: 30px;
}
.right-content-top .btnn {
  position: absolute;
  top: 20px;
  right: 10px;
  width: 80px;
  height: 25px;
}

.dashboard-container .right-content-bottom-left {
  background: linear-gradient(180deg, rgba(17, 25, 51, 1) 0%, rgba(38, 43, 61, 1) 100%);
  border: 1px solid rgba(65, 81, 133, 1);
  border-radius: 10px;
}
.dashboard-container .right-content-bottom-right {
  background: linear-gradient(180deg, rgba(17, 25, 51, 1) 0%, rgba(38, 43, 61, 1) 100%);
  border: 1px solid rgba(65, 81, 133, 1);
  border-radius: 10px;
  margin-left: 30px;
}
.topTextLittle {
  width: 100%;
  height: 30px;
  text-align: center;
  line-height: 30px;
  margin-top: 0px;
}
.topTextLittle .topTextLittleText {
  height: 30px;
  width: 120px;
  font-size: 15px;
  color: #ffffff;
  /* 居中条件 */
  margin: 0 auto;
  background: linear-gradient(180deg, rgba(17, 25, 51, 1) 0%, rgba(38, 43, 61, 1) 100%);
  background: url(../../assets/images/titleImage.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  opacity: 0.9;
}
.chartContent {
  // margin: 20px;
  // padding: 20px;
  // background-color: red;
  // width: calc(100% - 40px);
  // height: calc(100% - 20px - 20px - 20px);
}

/* 板块4 */
.todayStatistics {

}
.todayStatistics .titleDiv {
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-radius: 7px;
  background: linear-gradient(180deg, rgba(11, 17, 36, 1) 0%, rgba(29, 34, 54, 1) 100%);
  display: flex;
}
.todayStatistics .titleDiv span {
  flex: 1;
  text-align: center;
  color: #ffffff;
}
.seamless-warp {
  width: 100%;
  height: 320px;
  overflow: hidden;
}
.todayStatistics .seamless-warp ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.todayStatistics .seamless-warp ul li {
  height: 30px;
  line-height: 30px;
  width: 100%;
  display: flex;
}
.seamless-warp .liiStyle span {
  text-align: center;
  flex: 1;
  font-size: 13px;
  color: #ffffff;
}

</style>
