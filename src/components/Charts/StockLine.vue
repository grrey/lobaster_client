<template>
	<!-- <div 
		:class="className"
		:style="{ height: height, width: width }"
	/> -->
	<div :style="{ height: '100px', width: '200px' }"></div>
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";

let sizeMap = {
	s:'200' ,
	m:'400' ,
	l:'1000'
}

 


export default {
	mixins: [resize],
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
		marketCode: {
			type: String,
			default: "",
		}
	},
	data() {
		return {
			chart: null,
		};
	},
	mounted() {
		this.timeout = setTimeout(() => {
			this.initChart();
		}, this.index * 80 );
	},
	beforeDestroy() {
		clearTimeout(this.timeout);

		if (!this.chart) {
			return;
		}
		this.chart.dispose();
		this.chart = null;
	},
	methods: {
		async initChart() {
			let data = await  $es.his.search({ 
				luceneStr:`marketCode:${ this.marketCode}`,
				sort:`date:-`
			}) 
			let opt = getLineOpt( data.data );
			if( !opt.lineArr || !opt.lineArr.length ){
				return ;
			} 
			this.chart = echarts.init( this.$el ); 
			console.log( 'his data = ' , this.marketCode , data  , opt );

			let subtext =   ( ( opt.maxVal - opt.minVal )/opt.minVal *100).toFixed(1) +  "% -- "+ opt.dateArr.length
			this.chart.setOption({
				// backgroundColor: "#020202",
				title: {
			        // text: '雨量流量关系图',
			        subtext: subtext ,
					left: 'center', 
					subtextStyle:{
						color:'#000',
						fontWeight :'bold'
					}
			    },
			  	xAxis: {
			        type: 'category',
			        data:  opt.dateArr
			        // show:false, 
			    },
			    yAxis: {
					type: 'value',
					scale:true ,
					splitLine:{ 
						show:false,
					}, 
			        
			    },
			    grid:{ 
			        left:0,
			        right:0,
			        bottom:1,
			        top:0
				},
				tooltip:{
					show:true ,
					trigger:'axis',
					position: ['50%', '50%']
				},
				series: [
					// { 
					// k 线
					// type: 'candlestick',
					// data: opt.lineArr,
					// } ,
					{ 
						data:  opt.closeArr,
				        type: 'line',
						smooth: true ,
						lineStyle: { 
			                width: 1
						},
						markLine: {
			                symbol: ['none', 'none'], 
			                data: [
								{type:"min" , label: { position:"start" } },
								{type:'max', label: { position:"start" } }, 
			                ]
			            },
					}
				]
			});
		},
	},
}



function  getLineOpt(esArr){
	let dateArr = [] ,
		lineArr = [],
		closeArr = [];
	let maxVal = 0 , minVal = 0 ;

	esArr.forEach((o)=>{
		let { k , date} = o._source ;
		//[open, close, lowest, highest] （即：[开盘值, 收盘值, 最低值, 最高值]）
		lineArr.push( [ k.open ,  k.close , k.low , k.high ] );
		closeArr.push( k.close );
		dateArr.push( date );
		maxVal = maxVal || k.close ;
		minVal =  minVal || k.close ;
		maxVal = Math.max( maxVal , k.close );
		minVal = Math.min( minVal , k.close );

	})
	return {
		dateArr ,
		lineArr ,
		closeArr ,
		maxVal ,
		minVal
	}
}
 

</script>


