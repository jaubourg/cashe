"use strict";

function ObjectStore() {
	this.object = {};
}

ObjectStore.prototype = {
	has: function( key ) {
		return this.object.hasOwnProperty( key );
	},
	get: function( key ) {
		return this.object[ key ];
	},
	set: function( key, data ) {
		return ( this.object[ key ] =  data );
	},
	del: function( key ) {
		delete this.object[ key ];
	}
};

module.exports = ObjectStore;
