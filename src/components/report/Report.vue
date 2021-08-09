<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报表管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 2.创建一个DOM -->
      <div id="main" style="width: 1000px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
//1.导入echarts
import * as echarts from 'echarts';
import _ from 'lodash';
export default {
  data() {
    return {
      //需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    };
  },
  //在mounted周期来渲染，此时页面元素已经渲染完毕
  async mounted() {
    //3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    let { data: res } = await this.$http.get('reports/type/1');
    if (res.meta.status !== 200) {
      return this.$message.error('错误');
    }

    // 4.准备数据和配置项,将得到的对象用merge合并
    let result = _.merge(res.data, this.options);
    // 5.展示数据
    myChart.setOption(result);
  },
  methods: {}
};
</script>
<style lang="scss" scoped></style>
