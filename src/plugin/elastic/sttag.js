import base from './base';

export default class Stquery extends base {
	constructor() {
		super()
		// index ;
		this.indexName = "sttag";
		this.defaultTypeName = "sttag_"
 
		this.baseField = ['type', 'endity' , 'day'];
		
		this.pageSize = 200

	}
 
}