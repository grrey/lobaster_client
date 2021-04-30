<template>
    <!-- <div 
		:class="className"
		:style="{ height: height, width: width }"
	/> -->
    <div class="chart" v-in-screen="ins">
        <div ref="el" style="width: 80%; height: 100%; float: left"></div>
        <div style="width: 20%; float: left">
            <el-button size="mini" @click="showYue()">{{
                hisDataSize
            }}</el-button>
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
import inScreen from "@/directive/dom/InScreen";
import once from "lodash/once";

let sizeMap = {
    s: "200",
    m: "400",
    l: "1000",
};

export default {
    mixins: [resize],
    directives: { inScreen },
    props: {
        className: {
            type: String,
            default: "chart",
        },
        index: {
            type: Number,
            default: 0,
        },

        marketCode: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            showMore: false,
            chart: null,
            chartSizeType: 0,
        };
    },
    computed: {
        ins() {
            return {
                inHandler: once(() => {
                    this.initChart();
                }),
            };
        },
        hisDataSize() {
            // 0 : 80 , 1: 250 , 3: all(1000)
            let mp = {
                0: 80,
                1: 250,
                2: 1000,
            };
            return mp[this.chartSizeType];
        },
    },
    mounted() {},
    beforeDestroy() {
        clearTimeout(this.timeout);

        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    },
    watch: {
        marketCode: function (code) {
            this.initChart();
        },
    },
    methods: {
        async initChart() {
            this.cache = this.cache || {};
            let size = this.hisDataSize;

            let data;
            if (this.cache[size]) {
                data = this.cache[size];
            } else {
                let params = {
                    luceneStr: `marketCode:${this.marketCode} AND k:*`,
                    sort: `date:desc`,
                    size,
                    fields2return: ["date", "k", "boll"],
                };
                if (size == 1000) {
                    params.fields2return = ["date", "k.close", "k.amount"];
                }

                data = await $es.his.search(params);
                this.cache[size] = data;
            }

            let opt = getLineOpt([].concat(data.data).reverse());
            if (!opt.lineArr || !opt.lineArr.length) {
                return;
            }
            this.chart = this.chart || echarts.init(this.$refs.el);
            console.log("his data = ", this.marketCode, data, opt);

            let subtext =
                (((opt.maxVal - opt.minVal) / opt.minVal) * 100).toFixed(1) +
                "% -- " +
                opt.dateArr.length;

            var upColor = "#ec0000";
            var downColor =  "#00da3c";

            let options = {
                // backgroundColor: "#020202",

                title: {
                    // text: '雨量流量关系图'+  opt.dateArr.length,
                    subtext: subtext,
                    left: "center",
                    subtextStyle: {
                        color: "#000",
                        fontWeight: "bold",
                    },
                },
                xAxis: [
                    {
                        type: "category",
                        data: opt.dateArr,
                        show: false,
                    },
                    {
                        type: "category",
                        gridIndex: 1,
                        data: opt.dateArr,
                        show: false,
                    },
                ],
                yAxis: [
                    {
                        // type: "value",
                        scale: true,
                        splitLine: {
                            show: false,
                        },
                    },
                    {
                        // type: "value",
                        scale: true,
                        gridIndex: 1,
                        splitLine: {
                            show: false,
                        },
                    },
                ],

                grid: [
                    {
                        top: "5%",
                        left: 0,
                        right: 0,
                        height: "70%",
                    },
                    {
                        left: "0",
                        right: "0",
                        top: "75%",
                        height: "25%",
                    },
                ],

                // tooltip: {
                //     trigger: "axis",
                //     axisPointer: {
                //         type: "cross",
                //     },
                //     borderWidth: 1,
                //     borderColor: "#ccc",
                //     padding: 10,
                //     textStyle: {
                //         color: "#000",
                //     },
                //     position: function (pos, params, el, elRect, size) {
                //         var obj = { top: 10 };
                //         obj[
                //             ["left", "right"][+(pos[0] < size.viewSize[0] / 2)]
                //         ] = 30;
                //         return obj;
                //     },
                //     // extraCssText: 'width: 170px'
                // },
                
                axisPointer: {
                    link: { xAxisIndex: "all" },
                    label: {
                        backgroundColor: "#777",
                    },
                },

                visualMap: {
                    show: false,
                    seriesIndex: 0,
                    dimension: 2,
                    pieces: [
                        {
                            value: 1,
                            color: upColor,
                        },
                        {
                            value: -1,
                            color: downColor,
                        },
                    ],
                },

                series: [
                    {
                        type: "bar",
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: opt.amountArr,
                    },
                ],
            };

            if (size === 1000) {
                options.series.push({
                    data: opt.closeArr,
                    type: "line",
                    smoth: true,
                    lineStyle: {
                        width: 1,
                    },
                });
            } else {
                options.series.push(
                    ...[
                        {
                            type: "candlestick",
                            data: opt.lineArr,
                            itemStyle: {
                                color: upColor,
                                color0: downColor,
                                borderColor: null,
                                borderColor0: null,
                            },
                        },
                        {
                            data: opt.bollU,
                            type: "line",
                            smoth: true,
                            lineStyle: {
                                width: 1,
                            },
                        },
                        {
                            data: opt.bollM,
                            type: "line",
                            smoth: true,
                            lineStyle: {
                                width: 1,
                            },
                        },
                        {
                            data: opt.bollD,
                            type: "line",
                            smoth: true,
                            lineStyle: {
                                width: 1,
                            },
                        },
                    ]
                );
            }

            console.log("zzzz", options);
            this.chart.setOption(options, true);
        },

        showYue() {
            this.chartSizeType = (this.chartSizeType + 1) % 3;
            this.initChart();
        },
    },
};

function getLineOpt(esArr) {
    let dateArr = [],
        lineArr = [],
        closeArr = [],
        amountArr = [],
        bollU = [],
        bollM = [],
        bollD = [];

    let maxVal = 0,
        minVal = 0;

    esArr.forEach((o, i) => {
        let { k, date, boll } = o._source;
        //[open, close, lowest, highest] （即：[开盘值, 收盘值, 最低值, 最高值]）
        lineArr.push([k.open, k.close, k.low, k.high]);
        closeArr.push(k.close);
        dateArr.push(date);
        amountArr.push([i, k.amount, k.close > k.open ? 1 : -1]);

        maxVal = maxVal || k.close;
        minVal = minVal || k.close;
        maxVal = Math.max(maxVal, k.close);
        minVal = Math.min(minVal, k.close);

        if (boll) {
            let { m, u, d } = boll;
            bollU.push(u);
            bollM.push(m);
            bollD.push(d);
        }
    });
    return {
        dateArr,
        lineArr,
        closeArr,
        amountArr,

        maxVal,
        minVal,

        bollU,
        bollM,
        bollD,
    };
}
</script>

<style scoped>
.chart {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
}
</style>


