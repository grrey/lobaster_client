<template>
	<el-table :data="stockList" style="width: 100%;" size="mini"  >
		<el-table-column label="TopTrade"  >
			<template slot-scope="{row}">
				{{  row._source.marketCode_ }}
			</template>
		</el-table-column>
		<el-table-column label="val+"   >
			<template slot-scope="{row}">
				{{  (+row._source.news.total_nlp_positive).toFixed(2) }}
			</template>
		</el-table-column>
		<el-table-column label="val-" >
			<template slot-scope="{row}">
				{{  (+row._source.news.total_nlp_negative ).toFixed(2)  }}
			</template>
		</el-table-column>
			<el-table-column label="size"    >
			<template slot-scope="{row}">
				{{  row._source.news.list.length }}
			</template>
		</el-table-column>
	</el-table>
</template>

<script>
import _ from "lodash";
import moment from "moment";

export default {
	name: "TopTrade",
	components: {},
	data() {
		return {
			stockList: [],
		};
	},
	computed: {},
	created() {
		this.getTopTrade();
	},
	methods: {
		async getTopTrade() {
			let today = moment().format("YYYY-MM-DD");
			let valL = 200 ;

			var arr = [] ;
			for(let i = 1; i <=2; ++i){
				arr.push( `current.buy${i}_l>${valL}` );
				arr.push( `current.sell${i}_l>${valL}` );
			}
			arr.push( `current.data:${today}` )

			let data = await $es.stock.search({
				q:  arr.join(' AND ') ,
				sort: "current.buy1_l:desc",
				page: 1,
				size: 20,
			});
			this.stockList = data.data;
		},
	},
};
</script>
