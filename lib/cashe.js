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
	return function( id ) {
		var key = keyFunction( id );
		return store.has( key ) ? store.get( key ) : store.set( key, create( id ) );
	};
}

cashe.ObjectStore = ObjectStore;

module.exports = cashe;
