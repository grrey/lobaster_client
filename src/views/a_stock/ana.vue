<template>
  <div>
    <el-input
						v-model="marketCode" 
						placeholder="max"
					/>
      <button @click="dra">fffff</button>
    <div ref="line" :style="{ height: '500px', width: '800px' }"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import _ from "lodash";

import StockLine from "./stock-line";

let sizeMap = {
  s: "200",
  m: "400",
  l: "1000",
};

export default {
  mixins: [],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    index: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: "s", // 1:s , 2:m , 3: l
    },
    // marketCode: {
    //   type: String,
    //   default: "sh600585",
    // },
  },
  data() {
    return {
      chart: null,
      marketCode:"sh603505"
    };
  },
  mounted() {
    this.initChart();
  },

  methods: {

dra(){
  this.initChart();
},

    async initChart() {
      let data = await $es.his.search({
        luceneStr: `marketCode:${this.marketCode} AND k:*`,
        sort: `date:desc`,
        size: 200,
      });

      let stData = await  $es.stock.getById( this.marketCode );
 

      let zdSer = [];
      let  label = [ 'close' ] ;
      for( let d  in  stData._source.zheDian ){
          let arr = stData._source.zheDian[d].map((d) => {
            return [ d.date , d.close ];
          })
          label.push( 'd'+d );
        zdSer.push({
            name: "d"+ d ,
            data: arr,
            type: "line",
            show:false ,
            smooth: false,
            lineStyle: {
              width: 1,
            },

        })
      }  

      let hisArr = data.data.reverse();
      let opt = getLineOpt(hisArr);

      if (!opt.lineArr || !opt.lineArr.length) {
        return;
      }

      this.chart = this.chart ||  echarts.init(this.$refs.line); 
      console.log("his data = ", this.marketCode, data, opt);




      let subtext =
        (((opt.maxVal - opt.minVal) / opt.minVal) * 100).toFixed(1) +
        "% -- " +
        opt.dateArr.length;

      this.chart.setOption({
        // backgroundColor: "#020202",
        title: {
          // text: '雨量流量关系图',
          // subtext: subtext,
          left: "center",
          subtextStyle: {
            color: "#000",
            fontWeight: "bold",
          },
        },
        xAxis: {
          type: "category",
          data: opt.dateArr,
          show: false,
        },
        yAxis: {
          type: "value",
          scale: false, 
          splitLine: {
            show: false,
          },
        },
        tooltip: {
          show: false,
          trigger: "axis",
          position: ["50%", "50%"],
        },
        legend: {
            data:  label
        },

        series: [
          {
            name: "close",
            data: opt.closeArr,
            type: "line",
            smooth: false,
            lineStyle: {
              width: 1,
            },
          },
          ...zdSer
          // {
          //   name: "KKK",
          //   type: "line",
          //   data: [
          //     ["2020-06-11", 6],
          //     ["2020-09-07", 5],
          //   ],
          //   lineStyle: {
          //     width: 1,
          //   },
          // },
        ],
      });
    },
  },
};

function getLineOpt(esArr) {
  let dateArr = [],
    lineArr = [],
    closeArr = [],
    maArr = [];

  let avgArr = [];

  let total_smooth = 0;
  esArr.forEach((o, i) => {
    let { k, date, boll, ma = {} } = o._source;

    lineArr.push([k.open, k.close, k.low, k.high]);

    closeArr.push(k.close);

    dateArr.push(date);
    maArr.push(ma.ma10);
  });

  return {
    dateArr,
    lineArr,
    closeArr,
    maArr,
    avgArr,
  };
}

// 分析;
</script>


