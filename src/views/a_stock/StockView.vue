<template>
  <div class="app-container">
    <!--  
 <div style="width:300px; heigh:300"> 
    <iframe src="http://open.iqiyi.com/developer/player_js/coopPlayerIndex.html?vid=4a33fd30be3599a20fa387fa1ec1772c&tvId=9749821000&accessToken=2.ef9c39d6c7f1d5b44768e38e5243157d&appKey=8c634248790d4343bcae1f66129c1010&appId=1368&height=100%&width=100%" frameborder="0" allowfullscreen="true" width="100%" height="100%"></iframe>
 </div> -->

    <el-row class="filter-container" type="flex">
      <el-col :sm="24">
        <el-input
          v-model="listQuery.title"
          placeholder="name-biss-code-pinin-jyfw"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </el-col>

      <!-- <el-select
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
			</el-select> -->

      <el-col :sm="24">
        <el-select
          v-model="listQuery.sttagArr"
          placeholder="sttag"
          clearable
          multiple
          class="filter-item"
          style="width: 100%"
        >
          <el-option
            v-for="(item, i) in sttag"
            :key="i"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>
      <!-- <el-select
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
			</el-select> -->
      <el-col>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          Search
        </el-button>
      </el-col>
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
    </el-row>

    total: {{ total }}

    <el-row>
      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="8"
        :xl="4"
        v-for="(item, i) in list"
        :key="item._id"
        style="margin-bottom: 10px"
      > 
          <span>{{ item._id + "-" + item._source.name }}</span>

          <div class="chartcard">
            <stock-line
              :marketCode="item._source.marketCode"
              :index="i"
            ></stock-line>
          </div> 
      </el-col>

      <el-alert
        title="更多~"
        :center="true"
        :closable="false"
        type="info"
        v-in-screen="inScreen"
      >
      </el-alert>
    </el-row>

    <!-- <pagination
			v-show="total > 0"
			:total="total"
			:page.sync="listQuery.page"
			:limit.sync="listQuery.limit"
			@pagination="getList"
		/> -->
    <!-- ================================== update dialog ======================================= -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
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
          <el-checkbox v-model="temp._source.watchVal.curr">Enable</el-checkbox>
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
          <el-checkbox v-model="temp._source.watchVal.his">Enable</el-checkbox>
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
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button type="primary" @click="updateData()"> Confirm </el-button>
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

import inScreen from "@/directive/dom/InScreen";
import StockLine from "./stock-line";

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
const stockFieldHolder = !/field=true/.test(location.href);

const getSource = (params) => {
  return params._source;
};

export default {
  name: "StockView",
  components: { Pagination, StockLine },
  directives: { waves, inScreen },
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

  computed: {
    inScreen() {
      return {
        inHandler: this.moreDomin,
      };
    },
  },

  data() {
    return {
      stockFieldHolder,
      stquery: [],
      sttag: [
        "xiangti",
        "close_up_3",
        "close_up_3_a4",
        "close_up_3_a8",
        "close_up_3_a10",
        "close_up_5",
        "close_up_5_a4",
        "close_up_5_a8",
        "close_up_5_a10",
      ],

      page: 0,
      listQuery: {
        stqueryArr: [],
        sttagArr: ['close_up_3_a8'],
        title: "",
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: "+id",
      },

      tableKey: 0,
      list: [],
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
  created() {},
  methods: {
    // 获取列表;
    async getList(pageNo = 1) {
      this.listLoading = true;
      //   fetchList(this.listQuery).then(response => {
      //     this.list = response.data.items
      //     this.total = response.data.total

      //     // Just to simulate the time of the request
      //     setTimeout(() => {
      //       this.listLoading = false
      //     }, 1.5 * 1000)
      //   })
      let params = [];
      let { title, stqueryArr, sttagArr } = this.listQuery;
      // title ;
      if (title) {
        params.push(`( name:*${title}* OR code: *${title}* OR JYFW: ${title} OR pinyin: *${title}* OR SSBK: ${title} OR hy:${title} ) `)
        // params.push(`( name:*${title}* )`);
      }
      // stquery
      stqueryArr.forEach((query) => {
        params.push(query);
      });

      // sttag
      if (sttagArr.length) {
        params.push(`tag:${sttagArr.join(",")}`);
      }

      let luceneStr = params.join(" AND ");

      let response = await $es.stock.search({
        luceneStr: luceneStr,
        page: pageNo,
      });
      console.log("search list = ", response);
      this.list = this.list.concat(response.data); //response.data;
      this.total = response.total;
      this.listLoading = false;
    },

    handleFilter() {
      this.page = 1;
      this.list = [];
      this.getList(this.page);
    },

    updateData() {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          const tempData = this.temp;
          await $es.stock.update(tempData._id, tempData._source);

          const index = this.list.findIndex((v) => v._id === this.temp._id);
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

    moreDomin() {
      this.page++;
      this.getList(this.page);
    },
  },
};
</script>

<style scoped >
.chartcard:before {
  display: inline-block;
  content: "";
  margin-top: 50%;
}
.chartcard {
  position: relative;
}
</style>