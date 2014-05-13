"use strict";

var exec = require( "child_process" ).exec;
var packageJSON = require( "./package" );
var exclude = require( "./.travis.exclude" );

var packages = [];

[ packageJSON.dependencies || {}, packageJSON.devDependencies || {} ].forEach( function( version ) {
	for ( var name in version ) {
		if ( !exclude[ name ] ) {
			packages.push( name + "@" + version[ name ] );
		}
	}
} );

exec( "npm install " + packages.join( " " ), function( error ) {
	if ( error ) {
		throw error;
	}
} );
