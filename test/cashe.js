"use strict";

var cashe = require( "../" );

module.exports = {
	"basics": function( __ ) {
		var cache = cashe( {
			create: function( key ) {
				__.ok( true, "create function called" );
				return key + "Value";
			}
		} );
		__.expect( 3 );
		__.strictEqual( cache( "key" ), "keyValue", "value properly retrieved the first time" );
		__.strictEqual( cache( "key" ), "keyValue", "value properly retrieved later on" );
		__.done();
	},
	"basics (function)": function( __ ) {
		var cache = cashe( function( key ) {
			__.ok( true, "create function called" );
			return key + "Value";
		} );
		__.expect( 3 );
		__.strictEqual( cache( "key" ), "keyValue", "value properly retrieved the first time" );
		__.strictEqual( cache( "key" ), "keyValue", "value properly retrieved later on" );
		__.done();
	},
	"key encoder": function( __ ) {
		var cache = cashe( {
			create: function( data ) {
				return data.key + "Value";
			},
			key: function( data ) {
				__.ok( true, "key encoder called" );
				return data.key;
			}
		} );
		__.expect( 4 );
		__.strictEqual( cache( {
			key: "key"
		} ), "keyValue", "value properly retrieved the first time" );
		__.strictEqual( cache( {
			key: "key"
		} ), "keyValue", "value properly retrieved later on" );
		__.done();
	},
	"custom store": function( __ ) {
		var store = new cashe.ObjectStore();
		var step = 0;
		var cache = cashe( {
			create: function( key ) {
				return key + "Value";
			},
			store: {
				has: function( key ) {
					step++;
					var result = store.has( key );
					__.strictEqual( key, "key", "expected key in 'has'" );
					__.strictEqual( step, result ? 3 : 1, "'has' called for proper step #" + step );
					return result;
				},
				set: function( key, data ) {
					step++;
					__.strictEqual( key, "key", "expected key in 'set'" );
					__.strictEqual( step, 2, "'set' called for proper step #" + step );
					return store.set( key, data );
				},
				get: function( key ) {
					step++;
					__.strictEqual( key, "key", "expected key in 'get'" );
					__.strictEqual( step, 4, "'get' called for proper step #" + step );
					return store.get( key );
				}
			}
		} );
		__.expect( 10 );
		__.strictEqual( cache( "key" ), "keyValue", "value properly retrieved the first time" );
		__.strictEqual( cache( "key" ), "keyValue", "value properly retrieved later on" );
		__.done();
	}
};
