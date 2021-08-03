<template>
    <div class="app-container">
        <el-row>
            <el-col :span="4">
                <el-radio-group v-model="days" size="mini" @change="rangeLine">
                    <el-radio-button label="100"></el-radio-button>
                    <el-radio-button label="50"></el-radio-button>
                </el-radio-group>
            </el-col>
            <el-col :span="8">
                <el-slider
                    v-model="value"
                    range
                    :max="maxV"
                    :min="minV"
                    @change="rangeLine"
                >
                </el-slider>
            </el-col>
            <el-col :scope="3">
                {{ this.lineNum }}
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="16">
                <HyLine :opts="hyLineOpts" @hyLineHover="lineHover"></HyLine>
            </el-col>
            <el-col :span="8">
                <HyTreeMap :opts="hyTreeOpt"></HyTreeMap>
            </el-col>
        </el-row>
 
    </div>
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";

import HyLine from "./hy-line";
import HyTreeMap from "./hy-treemap";
import _ from "lodash";

export default {
    name: "StockView",
    mixins: [resize],
    components: { HyLine, HyTreeMap },

    data() {
        return {
            days: "100",

            value: [0, 0],
            maxV: 0,
            minV: 0,

            lineNum: 0,

            hyLineOpts: {},
            hyTreeOpt : {}
        };
    },
    created() {
        this.rawDataByDays ; 
        this.dateArr ;
        this.seriesList ; 

    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            let data = await $es.his.hyData(100); 
            data = data.reverse();

            let dateArr = [],
                seriesListMap = {};

            let maxV = 0,
                minV = 10000000000;
            data.forEach((d) => {
                dateArr.push(d.date.substr(0, 10));
                d.hylist.forEach((h) => {
                    seriesListMap[h.name] = seriesListMap[h.name] || {
                        type: "line",
                        name: h.name,
                        showSymbol: true,
                        smooth: false,
                        lineStyle: {
                            width: 1,
                        },
                        data: [],

                        _maxV: 0,
                        _minV: 1000000000,
                    };
                    let ss = seriesListMap[h.name];
                    ss._maxV = Math.max(ss._maxV, h.value);
                    ss._minV = Math.min(ss._minV, h.value);
                    maxV = Math.max(maxV, h.value);
                    minV = Math.min(minV, h.value);
                    seriesListMap[h.name].data.push(h);
                });
            });

            this.maxV = maxV + 2;
            this.minV = minV - 2;
            this.value = [minV + (maxV - minV) / 4, minV + (maxV - minV) / 2];

            this.dateArr = dateArr;
            this.rawDataByDays = data ;
            this.seriesList = Object.values(seriesListMap).sort((a, b) => {
                return b._maxV - a._maxV;
            });
            this.rangeLine();
        },

        rangeLine() {
            let seriesList = this.seriesList
                .filter((b) => {
                    return b._maxV <= this.value[1] && b._maxV >= this.value[0];
                })
                .map((b) => {
                    return Object.assign({}, b, {
                        data: _.takeRight(b.data, this.days),
                    });
                });
            let xAxisData = _.takeRight(this.dateArr, this.days);

            let seriesListArr = _.chunk(
                seriesList,
                Math.floor(seriesList.length / 3) + 1
            );

            seriesListArr.forEach((v, i) => {
                v.forEach((l) => {
                    l.xAxisIndex = i;
                    l.yAxisIndex = i;
                });
            }); 
            this.lineNum = seriesList.length;

            this.hyLineOpts = {
                 xAxis: [
                    {
                        type: "category",
                        data: xAxisData,
                        show: false,
                    },
                    {
                        type: "category",
                        data: xAxisData,
                        gridIndex: 1,
                        show: false,
                    },
                    {
                        type: "category",
                        data: xAxisData,
                        gridIndex: 2,
                    },
                ], 
                series: seriesList 
            }
 
        },

        lineHover(data){
            let d = data[0];
            let { axisValue , dataIndex } = data[0];
            dataIndex = this.days == '50' ? ( 50 + dataIndex) : dataIndex ;

            // data 不是全部的数据; 
            console.log(11 ,dataIndex , this.rawDataByDays[ dataIndex ] ); 
            this.hyTreeOpt = {
                name: axisValue ,
                data: this.rawDataByDays[ dataIndex ].hylist
            }  ;
        }
    },
};
</script>

<style scoped >
.chart-cont {
    position: relative;
    /* width: 100%;
    height: 100%; */
}
.chart-cont::before {
    content: "";
    display: block;
    padding-bottom: 45%;
}
.chart {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>