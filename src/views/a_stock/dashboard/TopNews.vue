<template>
	<el-table :data="stockList" style="width: 100%;" size="mini"  >
		<el-table-column label="Order_No"  >
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
	name: "TopNews",
	components: {},
	data() {
		return {
			stockList: [],
		};
	},
	computed: {},
	created() {
		this.getTopNewsData();
	},
	methods: {
		async getTopNewsData() {
			let today = moment().format("YYYY-MM-DD");
			let data = await $es.his.search({
				q: `news.total_nlp_positive:* AND date:${today} `,
				sort: "news.total_nlp_positive:desc",
				page: 1,
				size: 20,
			});
			this.stockList = data.data;
		},
	},
};
</script>
