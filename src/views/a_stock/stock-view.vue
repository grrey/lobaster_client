<template>
	<div class="app-container">
		<div class="filter-container">
			<el-input
				v-model="listQuery.title"
				placeholder="name-biss-code-pinin-jyfw"
				style="width: 250px"
				class="filter-item"
				@keyup.enter.native="handleFilter"
			/>

			<el-select
				v-model="listQuery.stqueryArr"
				placeholder="Query"
				multiple
				clearable
				style="width: 300px"
				class="filter-item"
			>
				<el-option
					v-for="item in stquery"
					:key="item.value"
					:label="item.name"
					:value="item.value"
				/>
			</el-select>

			<el-select
				v-model="listQuery.sttag"
				placeholder="sttag"
				clearable
				multiple
				class="filter-item"
				style="width: 300px"
			>
				<el-option
					v-for="item in sttag"
					:key="item.value"
					:label="item.name"
					:value="item.value"
				/>
			</el-select>

			<el-select
				v-model="listQuery.sort"
				style="width: 140px"
				class="filter-item"
				@change="handleFilter"
			>
				<el-option
					v-for="item in sortOptions"
					:key="item.key"
					:label="item.label"
					:value="item.key"
				/>
			</el-select>

			<el-button
				v-waves
				class="filter-item"
				type="primary"
				icon="el-icon-search"
				@click="handleFilter"
			>
				Search
			</el-button>
			<!--
		<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
	        Add
	      </el-button>
	      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
	        Export
	      </el-button>
	      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
	        reviewer
	      </el-checkbox>
	  -->
		</div>
 
			listQuery = {{ listQuery }}
  
		<el-table 
			:key="tableKey"
			v-loading="listLoading"
			:data="list"
			border
			fit
			highlight-current-row
			style="width: 100%" 
		>
			<el-table-column
		      type="index"
		      width="50">
		    </el-table-column>

			<el-table-column type="expand">
				<template slot-scope="{ row }">
					<el-form
						label-position="left"
						inline
						class="demo-table-expand"
					>
						<el-form-item label="商品名称">
							<span>{{ row.name }}</span>
						</el-form-item>
						<el-form-item label="所属店铺">
							<span>{{ row.shop }}</span>
						</el-form-item>
						<el-form-item label="商品 ID">
							<span>{{ row.id }}</span>
						</el-form-item>
						<el-form-item label="店铺 ID">
							<span>{{ row.shopId }}</span>
						</el-form-item>
						<el-form-item label="商品分类">
							<span>{{ row.category }}</span>
						</el-form-item>
						<el-form-item label="店铺地址">
							<span>{{ row.address }}</span>
						</el-form-item>
						<el-form-item label="商品描述">
							<span>{{ row.desc }}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>

			<el-table-column
				label="ID"
				prop="id"
				sortable="custom"
				align="center"
				width="80"
				:class-name="getSortClass('id')"
			>
				<template slot-scope="{ row }">
					<span>{{ stockFieldHolder ||  row._id}}</span>
				</template>
			</el-table-column>

			<el-table-column label="Name" width="110px" align="center">
				<template slot-scope="{ row }">
					<span>{{ row._source.name }}</span>
				</template>
			</el-table-column>

			<el-table-column label="JYFW" min-width="150px">
				<template slot-scope="{ row }">
					<span>{{ stockFieldHolder || row._source.JYFW }}</span>
				</template>
			</el-table-column>

			<el-table-column label="Tag" width="150px">
				<template slot-scope="{ row }">
					<el-tag v-for="(tag, i) in row._source.tag" :key="i">{{
						tag
					}}</el-tag>
				</template>
			</el-table-column>

			<el-table-column label="Bussness" width="180">
				<template slot-scope="{ row }">
					<el-popover trigger="hover" placement="top" width="300">
						<p>{{ stockFieldHolder || row._source.JYFW }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag size="mini">{{ "bussness" }}</el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column>

			<el-table-column label="HisChart" width="220px">
				<template slot-scope="{ row, $index }">
					  <stock-line   :marketCode=" row._source.marketCode " :index="$index"></stock-line>  
				</template>
			</el-table-column>

			<!-- <el-table-column label="HisChart" width="220px">
				<template slot-scope="{ row, $index }">
					  <stock-line :marketCode=" row._source.marketCode " :index="$index"></stock-line>  
				</template>
			</el-table-column> -->

			<!-- <el-table-column label="Title" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="deforeUpdateData(row)">{{ row.title }}</span>
          <el-tag>{{ row._source.JYFW  }}</el-tag>
        </template>
      </el-table-column> -->

			<!--
	  <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Title" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="deforeUpdateData(row)">{{ row.title }}</span>
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Imp" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column> -->

			<el-table-column label="Action" align="center" width="95">
				<template slot-scope="{ row }">
					<span class="link-type" @click="deforeUpdateData(row)"
						>Edit</span
					>
				</template>
			</el-table-column>

			<!--
			<el-table-column
				label="Actions"
				align="center"
				width="100"
				class-name="small-padding fixed-width"
			>
				<template slot-scope="{ row, }">
					<el-button
						type="primary"
						size="mini"
						@click="deforeUpdateData(row)"
					>
						Edit
					</el-button>

					 <el-button
						v-if="row.status != 'published'"
						size="mini"
						type="success"
						@click="handleModifyStatus(row, 'published')"
					>
						Publish
					</el-button>
					<el-button
						v-if="row.status != 'draft'"
						size="mini"
						@click="handleModifyStatus(row, 'draft')"
					>
						Draft
					</el-button>
					<el-button
						v-if="row.status != 'deleted'"
						size="mini"
						type="danger"
						@click="handleDelete(row, $index)"
					>
						Delete
					</el-button> 
				</template>
			</el-table-column>
			-->
		</el-table>

		<pagination
			v-show="total > 0"
			:total="total"
			:page.sync="listQuery.page"
			:limit.sync="listQuery.limit"
			@pagination="getList"
		/>
		<!-- ================================== update dialog ======================================= -->
		<el-dialog
			:title="textMap[dialogStatus]"
			:visible.sync="dialogFormVisible"
		>
			<el-form
				ref="dataForm"
				:model="temp"
				label-position="left"
				label-width="150px"
				style="padding: 0 50px"
			>
				<el-form-item label="Watch_current" prop="watch_current">
					<el-input
						v-model="temp._source.watchVal.curr_high"
						type="number"
						placeholder="max"
					/>
					<el-input
						v-model="temp._source.watchVal.curr_low"
						type="number"
						placeholder="min"
					/>
					<el-checkbox v-model="temp._source.watchVal.curr"
						>Enable</el-checkbox
					>
				</el-form-item>

				<el-form-item label="Watch_his" prop="watch_his">
					<el-input
						v-model="temp._source.watchVal.his_high"
						type="number"
						placeholder="max"
					/>
					<el-input
						v-model="temp._source.watchVal.his_low"
						type="number"
						placeholder="min"
					/>
					<el-checkbox v-model="temp._source.watchVal.his"
						>Enable</el-checkbox
					>
				</el-form-item>

				<el-form-item label="Tag" prop="tag">
					<el-select
						v-model="temp.tag"
						placeholder="tag"
						multiple
						clearable
						style="width: 100%"
					>
						<el-option
							v-for="item in importanceOptions"
							:key="item"
							:label="item"
							:value="item"
						/>
					</el-select>
				</el-form-item>

				<!-- 
			<el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item> 
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item> 
		-->
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">
					Cancel
				</el-button>
				<el-button
					type="primary"
					@click=" updateData()"
				>
					Confirm
				</el-button>
			</div>
			
		</el-dialog>

		<!-- ========================================================================= -->
		<el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
			<el-table
				:data="pvData"
				border
				fit
				highlight-current-row
				style="width: 100%"
			>
				<el-table-column prop="key" label="Channel" />
				<el-table-column prop="pv" label="Pv" />
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogPvVisible = false"
					>Confirm</el-button
				>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	fetchList,
	fetchPv,
	createArticle,
	updateArticle,
} from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

import StockLine from "@/components/Charts/StockLine";

const calendarTypeOptions = [
	{ key: "CN", display_name: "China" },
	{ key: "US", display_name: "USA" },
	{ key: "JP", display_name: "Japan" },
	{ key: "EU", display_name: "Eurozone" },
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
	acc[cur.key] = cur.display_name;
	return acc;
}, {});


// 显示 stock 字段;
const  stockFieldHolder =  true  ;

const  getSource = (params) => {
	return params._source
}

export default {
	name: "StockView",
	components: { Pagination, StockLine },
	directives: { waves },
	filters: {
		statusFilter(status) {
			const statusMap = {
				published: "success",
				draft: "info",
				deleted: "danger",
			};
			return statusMap[status];
		},
		typeFilter(type) {
			return calendarTypeKeyValue[type];
		},
	},
	data() {
		return { 
			stockFieldHolder,
			stquery:[] ,
			sttag:[],
			listQuery: {
				page: 1,
				stqueryArr:[],
				title:"",
				
				// importance: undefined,
				// title: undefined,
				// type: undefined,
				// sort: "+id",
			},


			tableKey: 0,
			list: null,
			total: 0,
			listLoading: true,
			importanceOptions: [1, 2, 3],
			calendarTypeOptions,
			sortOptions: [
				{ label: "ID Ascending", key: "+id" },
				{ label: "ID Descending", key: "-id" },
			],
			statusOptions: ["published", "draft", "deleted"],
			showReviewer: false,
			temp: {
				_id: undefined,
				_source: {
					watchVal: {},
					tag: [],
				},
			},
			dialogFormVisible: false,
			dialogStatus: "",
			textMap: {
				update: "Edit",
				create: "Create",
			},
			dialogPvVisible: false,
			pvData: [],

			//   rules: {
			//     type: [{ required: true, message: 'type is required', trigger: 'change' }],
			//     timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
			//     title: [{ required: true, message: 'title is required', trigger: 'blur' }]
			//   },

			downloadLoading: false,
		};
	},
	created() {
		this.initData();
	},
	methods: {
		// 获取列表;
		async getList() {
			this.listLoading = true;
			//   fetchList(this.listQuery).then(response => {
			//     this.list = response.data.items
			//     this.total = response.data.total

			//     // Just to simulate the time of the request
			//     setTimeout(() => {
			//       this.listLoading = false
			//     }, 1.5 * 1000)
			//   })
			let params = [] ;
			let { title , stqueryArr } = this.listQuery;
			// title ;
			if( title ){
				// params.push(`( name:*${title}* OR code: *${title}* OR JYFW: ${title} OR pinyin: ${title}* OR SSBK: ${title} )`)
				params.push(`( name:*${title}* )`)
			}
			// stquery
			stqueryArr.forEach((query) => {
				params.push( query )
			})


			let luceneStr = params.join(' AND ')

			let response = await $es.stock.search({
				luceneStr: luceneStr ,
				page: 1,
			});
			console.log("search list = ", response);
			this.list = response.data;
			this.total = response.total;
			this.listLoading = false;
		},
		// 获取过滤参数;
		async initData(){

			this.getList();
			let  stquery = await $es.stquery.search();
			let  sttag = await $es.sttag.search();

			this.stquery = stquery.data.map(getSource) ;
			this.sttag = sttag.data.map(getSource) ;

		},
 
		handleFilter() {
			this.listQuery.page = 1;
			this.getList();
		},
 

		deforeUpdateData(row) {
			let _source = row._source;
			this.temp = {
				_id: row._id,
				_source: {
					watchVal: _source.watchVal || {},
					tag: _source.tag,
				},
			};

			this.dialogStatus = "update";
			this.dialogFormVisible = true;
			this.$nextTick(() => {
				this.$refs["dataForm"].clearValidate();
			});
		},
		updateData() {
			this.$refs["dataForm"].validate(async (valid) => {
				if (valid) {
					const tempData = this.temp;
					await $es.stock.update(tempData._id, tempData._source);

					const index = this.list.findIndex(
						(v) => v._id === this.temp._id
					);
					this.list.splice(index, 1, this.temp);
					this.dialogFormVisible = false;
					this.$notify({
						title: "Success",
						message: "Update Successfully",
						type: "success",
						duration: 2000,
					});
				}
			});
		},


		getSortClass: function (key) {
			const sort = this.listQuery.sort;
			return sort === `+${key}` ? "ascending" : "descending";
		},
	},
};
</script>

<style>
.demo-table-expand {
	font-size: 0;
}
.demo-table-expand label {
	width: 90px;
	color: #99a9bf;
}
.demo-table-expand .el-form-item {
	margin-right: 0;
	margin-bottom: 0;
	width: 50%;
}
</style>