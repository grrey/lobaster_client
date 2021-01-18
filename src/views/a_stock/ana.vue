<template> 
	<div>

		<!-- <div 
			:class="className"
			:style="{ height: height, width: width }"
		/> -->
		<!-- <div :style="{ height: '200px', width: '500px' }"></div> -->
	</div>
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
import _ from 'lodash'

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
			default: "sh600235",
		}
	},
	data() {
		return {
			chart: null,
		};
	},
	mounted() {
		this.initChart();
	},
 
	methods: {
		async initChart() {
			let data = await  $es.his.search({ 
				luceneStr:`marketCode:${ this.marketCode} AND k:*`,
				sort:`date:desc`,
				size:250
			}) 
			let opt = getLineOpt( data.data.reverse() );
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
					// // k 线
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
						// markLine: {
			            //     symbol: ['none', 'none'], 
			            //     data: [
						// 		{type:"min" , label: { position:"start" } },
						// 		{type:'max', label: { position:"start" } }, 
			            //     ]
			            // },
					},

					// {
					// 	data:opt.bollU ,
					// 	type:'line',
					// 	smoth:true ,
					// 	lineStyle: { 
			        //         width: 1
					// 	},
					// },
					// {
					// 	data:opt.bollM ,
					// 	type:'line',
					// 	smoth:true ,
					// 	lineStyle: { 
			        //         width: 1
					// 	},
					// },
					// {
					// 	data:opt.bollD ,
					// 	type:'line',
					// 	smoth:true ,
					// 	lineStyle: { 
			        //         width: 1
					// 	},
					// }

					//chg_smooth
					// {
					// 	data:opt.chg_smooth ,
					// 	type:'line',
					// 	smoth:true ,
					// 	lineStyle: { 
			        //         width: 1
					// 	},
					// }

				]
			});
		},
	},
 
}



function  getLineOpt(esArr){
	let dateArr = [] ,
		lineArr = [],
		closeArr = [],

		bollU = [] ,
		bollM = [] ,
		bollD = [] ;

	let	m30 =[] ;
	let chg_smooth = [];

	let maxVal = 0 , minVal = 0 ;

	let total_smooth = 0 ;
	esArr.forEach((o , i )=>{
		let { k , date , boll } = o._source ;
		//[open, close, lowest, highest] （即：[开盘值, 收盘值, 最低值, 最高值]）
		lineArr.push( [ k.open ,  k.close , k.low , k.high ] );
		closeArr.push( k.close );
		dateArr.push( date );
 
		maxVal = maxVal || k.close ;
		minVal =  minVal || k.close ;
		maxVal = Math.max( maxVal , k.close );
		minVal = Math.min( minVal , k.close );

		if( boll ){
			let { m , u , d  } =  boll;
			bollU.push(u);
			bollM.push(m)
			bollD.push(d)
		}
		// smooth ;
		let size = 30 ; 
		let path = '_source.k.chg';

		total_smooth += _.get( o , path ,  0);
		chg_smooth.push( total_smooth )

		// if( true || i > size ){
		// 	let total = 0 ;
		// 	for(let j = 0 ; j < size ; ++j){ 
		// 		total += _.get( esArr[ i - j ] ,  path , 0 )
		// 	}
		// 	chg_smooth.push(  +( total/size ).toFixed(2) ); 
		// }else{
		// 	chg_smooth.push(  _.get(o, path ) ); 
		// }


	})




	return {
		dateArr ,
		lineArr ,
		closeArr ,

		maxVal ,
		minVal ,

		bollU ,
		bollM ,
		bollD , 

		chg_smooth
	}
}
 

</script>


