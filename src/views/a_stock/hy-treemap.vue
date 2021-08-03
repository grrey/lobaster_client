<template>  
    <div ref='echart' class='chart-cont' > 
        <div ref='el'  class='chart' ></div>
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
            default: () => {{}},
        },
    },
    created() {},
    mounted(){
        this.chart = this.chart || echarts.init(this.$refs.el);

        var formatUtil = echarts.format;
        this.chart.setOption({
                tooltip : {
                    
                    // formatter: function (info) {
                    //     var value = info.value;
                    //     var treePathInfo = info.treePathInfo;
                    //     var treePath = [];

                    //     for (var i = 1; i < treePathInfo.length; i++) {
                    //         treePath.push(treePathInfo[i].name);
                    //     }

                    //     return [
                    //         '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                    //         'Disk Usage: ' + formatUtil.addCommas(value) + ' KB',
                    //     ].join('');
                    // }
                },
                series:[]


        });
    },

    watch:{
        opts:function( opt ){
            this.chart.setOption({
                series:[{
                    name:  opt.name ,
                    type: 'treemap',
                    visibleMin: 300,
                    width:'100%',
                    height:'100%',
                    label: {
                        show: true,
                        formatter: '{b}'
                    },
                    data: opt.data ,
                    // data: d.hylist.map((d) => {
                    //     return  {
                    //         name: d.name +":"+ d.value ,
                    //         value: d.value
                    //     }
                    // })
                }]
            })
        }
    },
    methods: {
        

             
                // series :[
                //     {
                //         name: 'Disk Usage' + d.date ,
                //         type: 'treemap',
                //         visibleMin: 300,
                //         width:'100%',
                //         height:'100%',
                //         label: {
                //             show: true,
                //             formatter: '{b}'
                //         },
                //         data: d.hylist.map((d) => {

                //             return  {
                //                 name: d.name +":"+ d.value ,
                //                 value: d.value
                //             }
                //         })
                //     }
                // ] 
        }
        
 
};
</script>

<style scoped > 

.chart-cont{
    position:relative;
    /* width: 100%;
    height: 100%; */
}
.chart-cont::before{
    content: "";
    display: block;
    padding-bottom: 45%;
}
.chart {
    position: absolute;
    top:0;
    left: 0;
    width:100%; 
    height: 100%;
}
</style>