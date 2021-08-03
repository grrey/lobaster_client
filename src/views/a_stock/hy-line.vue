<template>
    <div ref="echart" class="chart-cont">
        <div ref="el" class="chart"></div>
    </div>
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";

export default {
    name: "HyTreeMap",
    mixins: [resize],
    props: {
        opts: {
            type: Object,
            default: () => {
                {
                }
            },
        },
    },
    created() {},
    mounted() {
        let _this = this ;
        let hyLineOpts = {
            tooltip: {
                trigger: "axis",
                triggerOn:'click',
                // formatter:'{b0}: {c0}<br/>{b1}: {c1}',

                formatter: function (a) {
                    // cb( '{b0}: {c0}<br/>{b1}: {c1}')
                    // return 'loading!!'
                    _this.$emit('hyLineHover' , a );
                    let arr = a.map((b) => {
                        return `<td>${b.data.name}:${b.data.value}</td>`;
                    });
                    let str =
                        "<table>" +
                        _.chunk(arr, 3)
                            .map((c) => {
                                return "<tr>" + c.join("") + "</tr>";
                            })
                            .join("") +
                        "</table>";
 
                    return str;
                },
            },
            axisPointer: {
                link: { xAxisIndex: "all" },
            },
            xAxis: [
                {
                    type: "category",
                    show: false,
                },
                {
                    type: "category",
                    gridIndex: 1,
                    show: false,
                },
                {
                    type: "category",
                    gridIndex: 2,
                },
            ],
            yAxis: [
                {
                    type: "value",
                    scale: true,
                    splitLine: {
                        show: false,
                    },
                },
                {
                    type: "value",
                    gridIndex: 1,
                    splitLine: {
                        show: false,
                    },
                },
                {
                    type: "value",
                    gridIndex: 2,
                    splitLine: {
                        show: false,
                    },
                },
            ],
            grid: [
                {
                    top: "20",
                    bottom: "68%",
                },
                {
                    top: "45%",
                    bottom: "33%",
                },
                {
                    top: "77%",
                },
            ],
        };

        this.chart = this.chart || echarts.init(this.$refs.el);
        this.chart.setOption(hyLineOpts);
    },
    watch: {
        opts: function (val) {
            this.chart.setOption(val);
        },
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
    padding-bottom: 90%;
}
.chart {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>