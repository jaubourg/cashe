"use strict";

var ObjectStore = require( "../" ).ObjectStore;

module.exports = {
	"basics": function( __ ) {
		var store = new ObjectStore();
		__.expect( 5 );
		__.strictEqual( store.has( "key" ), false, "key not present in store at first" );
		__.strictEqual( store.set( "key", "value" ), "value", "setting returns the value" );
		__.strictEqual( store.has( "key" ), true, "key is now present in store" );
		__.strictEqual( store.get( "key" ), "value", "value can be retrieved" );
		store.del( "key" );
		__.strictEqual( store.has( "key" ), false, "key not present in store after del" );
		__.done();
	}
};
