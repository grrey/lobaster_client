<template>
	<div class="app-container">
		<!-- query base list  ------------------------------------------------------------------------------>
		<div style="margin: 0 0 5px 20px">
			<el-button type="primary" @click="openCreateStqueryPannel()">
				Add StQuery
			</el-button>
			Fixed header, sorted by header order,
		</div>
		<div class="app-container">
			<el-table
				v-loading="isStqueryListLoading"
				:data="pageDataStquery"
				border
				fit
				highlight-current-row
				style="width: 100%"
			>
				<el-table-column type="index" width="50"> </el-table-column>

				<el-table-column align="center" label="name" width="180"> 
					<template slot-scope="{ row }">
						<template v-if="row.edit">
							<el-input
								v-model="row._source.name"
								class="edit-input"
								size="small"
							/>
						</template>
						<span v-else>{{ row._source.name }}</span>
					</template>

				</el-table-column>
 

				<el-table-column min-width="300px" label="Value">
					<template slot-scope="{ row }">
						<template v-if="row.edit">
							<el-input
								v-model="row._source.value"
								class="edit-input"
								size="small"
							/>
						</template>
						<span v-else>{{ row._source.value }}</span>
					</template>
				</el-table-column>

				<el-table-column align="center" label="Actions" width="140">
					<template slot-scope="{ row, $index }">
						<span
							v-if="row.edit"
							class="link-type mx"
							@click="updateStquery(row, $index)"
							>OK</span
						>
						<span
							v-else
							class="link-type mx"
							@click="openUpdateStqueryPannel(row, $index)"
							>Edit</span
						>

						<span
							v-if="row.edit"
							class="link-type mx"
							@click="cancelUpdateStquery(row, $index)"
							>Cancel</span
						>
						<span
							class="link-type mx"
							@click="delStquery(row, $index)"
							>Del</span
						>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- query stquery  add ----------------------->
		<el-dialog
			:title="'query base add'"
			:visible.sync="isCreateStqueryPannelOpen"
		>
			<el-form
				ref="dataForm"
				:model="tempStquery"
				label-position="left"
				label-width="150px"
				style="padding: 0 50px"
			>
				<el-form-item label="Desc" prop="desc">
					<el-input v-model="tempStquery.desc" placeholder="desc" />
				</el-form-item>

				<el-form-item label="Value" prop="value">
					<el-input v-model="tempStquery.value" placeholder="desc" />
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="isCreateStqueryPannelOpen = false">
					Cancel
				</el-button>
				<el-button type="primary" @click="createStquery()">
					Confirm
				</el-button>
			</div>
		</el-dialog>

		<!-- query base list  ----------------------------------------------------------------------------->

		<div style="margin: 0 0 5px 20px">
			<el-button type="primary" @click="openCreateSttagPannel()">
				Add StTag
			</el-button>
			Fixed header, sorted by header order,
		</div>
		<div class="app-container">
			<el-table
				v-loading="isSttagListLoading"
				:data="pageDataSttag"
				border
				fit
				highlight-current-row
				style="width: 100%"
			>
				<el-table-column type="index" width="50"> </el-table-column>

				<el-table-column align="center" label="name" width="80">
					<template slot-scope="{ row }">
						<span>{{ row._source.name }}</span>
					</template>
				</el-table-column>

				<el-table-column align="center" label="desc" width="80">
					<template slot-scope="{ row }">
						<span>{{ row._source.desc }}</span>
					</template>
				</el-table-column>

				<el-table-column min-width="300px" label="Value">
					<template slot-scope="{ row }">
						<template v-if="row.edit">
							<el-input
								v-model="row._source.value"
								class="edit-input"
								size="small"
							/>
						</template>
						<span v-else>{{ row._source.value }}</span>
					</template>
				</el-table-column>

				<el-table-column align="center" label="Actions" width="140">
					<template slot-scope="{ row, $index }">
						<span
							v-if="row.edit"
							class="link-type mx"
							@click="updateSttag(row, $index)"
							>OK</span
						>
						<span
							v-else
							class="link-type mx"
							@click="openUpdateSttagPannel(row, $index)"
							>Edit</span
						>

						<span
							v-if="row.edit"
							class="link-type mx"
							@click="cancelUpdateSttag(row, $index)"
							>Cancel</span
						>
						<span
							class="link-type mx"
							@click="delSttag(row, $index)"
							>Del</span
						>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- query tag  add ----------------------->
		<el-dialog
			:title="'StTag add'"
			:visible.sync="isCreateSttagPannelOpen"
		>
			<el-form
				ref="dataForm"
				:model="tempStquery"
				label-position="left"
				label-width="150px"
				style="padding: 0 50px"
			>
				<el-form-item label="Desc" prop="desc">
					<el-input v-model="tempSttag.desc" placeholder="desc" />
				</el-form-item>

				<el-form-item label="Value" prop="value">
					<el-input v-model="tempSttag.value" placeholder="value" />
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="isCreateSttagPannelOpen = false">
					Cancel
				</el-button>
				<el-button type="primary" @click="createSttag()">
					Confirm
				</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
const defaultFormThead = ["apple", "banana"];

import { fetchList } from "@/api/article";
import settings from "@/settings";

import Sortable from "sortablejs";
import esHandle from "@/mixin/esHandle";

export default {
	mixins: [esHandle([
		{ esClass: "Stquery" },
		{ esClass: "Sttag" }
	])],
	data() {
		return {
			addQueryFormVisible: false,
			tempQuery: {},
			queryDataList: null,

			list: null,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 10,
			},
		};
	},
	created() {
		// 获取query list
		this.getStqueryPageData();
		this.getSttagPageData();

	},
	watch: {
		 
	},
  
	methods: { 

	},
};
</script>

<style scoped>
.mx {
	margin: 0 5px;
}
</style>