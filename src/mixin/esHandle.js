	/**
		 * 规则:
		 * data:如下;
		 *  this.openAddXxxPannelVisible = false;  
		 *  this.openEditXxxPannelVisible = false;  
		 *  this.XxxListLoading = false ;
		 *  
		 * 
		 * methods: 如下;
		 *  openAddXxxPannel(){
		 * 		this.penAddXxxPannelVisible = true ;
		 * 		this.Xxx = defaultObj ;
		 * }
		 * createXxx(){ }
		 * editXxx(){}
		 * updateXxx(){}
		 * delXxx(){}
		 * 
		 * cancelEditXxx(){}
		 * getXxxList(){ }
		 *
		 */

function deepCopy( jsonObj ) {
	return JSON.parse( JSON.stringify(jsonObj));
}

export default function esHandle( esClassArr) {
	if(!esClassArr){
		return {}
	}
	esClassArr = esClassArr.forEach ? esClassArr : [ esClassArr];

	let methods = {};
	let data =  {}; 
	esClassArr.forEach(({esClass , defaultQ , defaultObj ={} }) => {
		let esClassLower = esClass.toLowerCase();
		 
		// prop name 
		let isCreateXxxPannelOpen = `isCreate${ esClass }PannelOpen`;
		let isUpdateXxxPannelOpen = `isUpdate${ esClass }PannelOpen`;
		let isXxxListLoading = `is${ esClass }ListLoading`;
		let pageDataXxx = `pageData${esClass}`;
		let tempXxx = `temp${esClass}` // 创建, 更新时用;

		// data 
		data[ isCreateXxxPannelOpen ] = false ;
		data[ isUpdateXxxPannelOpen] = false ;
		data[ isXxxListLoading] = false ;
		data[ pageDataXxx ] = [] ;
		data[ tempXxx] = {};
		
		// method name
		let openCreateXxxPannel = `openCreate${ esClass }Pannel`;
		let openUpdateXxxPannel = `openUpdate${ esClass }Pannel`;

		let getXxxPageData = `get${ esClass }PageData`;
		let createXxx = `create${ esClass }`; 
		let updateXxx = `update${ esClass }`;
		let cancelUpdateXxx = `cancelUpdate${ esClass }`
		let delXxx = `del${ esClass }`;
 

		// 获取列表;
		methods[ getXxxPageData ] =  async function( ){
			this[ isXxxListLoading] = true ;
			await sleep(1000); 
			let { data } = await $es[ esClassLower ].search({q:defaultQ});
			this[pageDataXxx] = data ;
			this[isXxxListLoading] = false ; 
		}
		// 打开创建 pannel ;
		methods[ openCreateXxxPannel] = async function ( ) {
			this[ tempXxx ]= deepCopy( defaultObj );
			this[ isCreateXxxPannelOpen ] = true ;
		}
		// 打开更新pannel ;
		methods[ openUpdateXxxPannel ] = async function (esSource , $index)  {  
			this[ pageDataXxx ] = this[pageDataXxx].map( (row , index ) => {
				if(index == $index){
					this[ tempXxx ]= deepCopy( row );
					row.edit = true ;
				}else {
					row.edit = false ;
				} 
				return row;
			}); 
		}

		// 创建;
		methods[ createXxx] = async function( )  {
			let obj = await $es[ esClassLower ].index( this[ tempXxx ] );
			console.log('ccccc' , obj );
			this[ isCreateXxxPannelOpen] = false ;
			this[getXxxPageData]();
		}
		// 更新;
		methods[ updateXxx ] = async function( esSource )  {
			await $es[ esClassLower ].update( esSource._id , esSource._source);
			this[getXxxPageData]();
		}
		// 取消更新;
		methods[ cancelUpdateXxx] = async function( row  , $index ) {
			this[ pageDataXxx ] = this[pageDataXxx].map( (row , i ) => {
				if( i == $index ){
					this[ tempXxx].edit = false ;
					return this[ tempXxx ]
				}else {
					row.edit = false ;
					return row;
				}
			}); 
		},
		// 删除;
		methods[ delXxx] = async function(esSource) {
			this.$alert(esSource._source.value || esSource._source.name  , `Delete ${ esClass }`, { 
				callback: async (action) => {
					if ("confirm" == action) {
						await $es[ esClassLower ].delById(esSource._id);
						await this[getXxxPageData]();
					}
				},
			});
		}

	})

	return {
		data(){
			return data
		},
		methods 
	}
	 
}