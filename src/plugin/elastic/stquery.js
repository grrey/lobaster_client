import base from './base';

export default class Stquery extends base {
	constructor() {
		super()
		// index ;
		this.indexName = "stquery";
		this.defaultTypeName = "stquery_"
 
		this.baseField = ['type', 'endity' , 'day'];
		
		this.pageSize = 200

	}
 
}