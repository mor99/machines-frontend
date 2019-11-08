// 饼图
export const Pie = {
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b}: {c} ({d}%)",
  },
  color: ['#3ba1ff', '#2fc25b', '#f9c802', '#f04864', '#8543e0', '#11c1c1',],
  legend: {
    orient: 'vertical',
    formatter: '{a|{name}}',
    textStyle: {
      rich: {
        a: {
          width: 128,
        },
        b: {
          padding: [0,0,0,10,],
          backgroundColor: "#fff",
          color: '#666',
        },
      },
    },
    align: 'left',
    type: 'scroll',
    right: 0,
    top: 10,
    bottom: 10,
    itemWidth: 7,
    itemHeight: 7,
    borderRadius: 3.5,
  },
  series: [
    {
      // name: '访问来源',
      type: 'pie',
      // radius: !isPie ? ['55%', '75%',] : '75%', // 环形图 or 扇形图
      radius: ['55%', '75%',],
      center: ['24%', '50%',],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center',
        },
        emphasis: {
          // show: !isPie, // 中间显示label
          show: true,
          textStyle: {
            fontSize: '16',
            fontWeight: 'bold',
          },
        },
      },
      labelLine: {
        normal: {
          show: false,
        },
      },
      data: [],
    },
  ],
};
// 柱形图
export const Bar = {
  color: ['#3ba1ff',],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  grid: {
    left: '3%',
    right: 0,
    top: '3%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true,
      },

    },
  ],
  yAxis: [
    {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
        },
      },
    },
  ],
  series: [
    {
      // name: '直接访问',
      type: 'bar',
      barWidth: '20%',
      // data: [10, 52, 200, 334, 390, 330, 220,],
    },
  ],
};
// 折线图
export const Line = {
  // color,
  color: '#3ba1ff',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    data: [],
  },
  dataZoom: [
    {
      type: 'inside',
    },
  ],
  yAxis: {
    type: 'value',
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
      },
    },
  },
  grid: {
    left: '3%',
    right: 0,
    top: '3%',
    bottom: '3%',
    containLabel: true,
  },
  series: [{
    data: [],
    type: 'line',
    areaStyle: {
      color: '#d7ecff',
      opacity: 1,
      // opacity: isFill ? 1 : 0, // 是否填充
    },
    itemStyle: {
      opacity: 1,
    },
    smooth: true,
  },],
};
