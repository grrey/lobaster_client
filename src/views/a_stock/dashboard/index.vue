<template>
	<div class="dashboard-container">
		currentRole ={{ currentRole }} roles ={{ roles }}

		 
		<el-row :gutter="8">
			<el-col
				:xs="{ span: 24 }" 
				:md="{ span: 12 }"
				:lg="{ span: 8 }"
				style="padding-right: 8px; margin-bottom: 30px"
			>
				<!-- <TopNews></TopNews> -->
			</el-col>
			 

			 <TopTrade></TopTrade>
		</el-row>

		<component :is="currentRole" />
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import adminDashboard from "./admin";

import TopNews from "./TopNews";
import TopTrade from "./TopTrade";

export default {
	name: "Dashboard",
	components: {
		adminDashboard,
		TopNews,
		TopTrade
	},
	data() {
		return {
			currentRole: "adminDashboard",
		};
	},
	computed: {
		...mapGetters(["roles"]),
	},
	created() {
		// if (!this.roles.includes('admin')) {
		//   this.currentRole = 'editorDashboard'
		// }
	},
};
</script>


<style scoped>
.dashboard-container{
	padding: 16px;  
	background-color: rgb(240, 242, 245);
	position: relative;
}
</style>