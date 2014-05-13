"use strict";

var ObjectStore = require( "./ObjectStore" );

function cashe( options ) {
	if ( typeof options === "function" ) {
		options = {
			create: options
		};
	}
	var store = options.store || new ObjectStore();
	var keyFunction = options.key || function( x ) {
		return x;
	};
	var create = options.create;
	function output( id ) {
		var key = keyFunction( id );
		return store.has( key ) ? store.get( key ) : store.set( key, create( id, key ) );
	}
	output.store = store;
	return output;
}

cashe.ObjectStore = ObjectStore;

module.exports = cashe;
