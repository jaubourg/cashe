[![Build Status](https://travis-ci.org/jaubourg/cashe.svg?branch=master)](https://travis-ci.org/jaubourg/cashe)
[![Coverage Status](https://img.shields.io/coveralls/jaubourg/cashe.svg)](https://coveralls.io/r/jaubourg/cashe)
[![Dependency Status](https://david-dm.org/jaubourg/cashe.svg)](https://david-dm.org/jaubourg/cashe)
[![devDependency Status](https://david-dm.org/jaubourg/cashe/dev-status.svg)](https://david-dm.org/jaubourg/cashe#info=devDependencies)
[![Gittip](https://img.shields.io/gittip/jaubourg.svg)](https://www.gittip.com/jaubourg/)

[![NPM](https://nodei.co/npm/cashe.png?downloads=true&stars=true)](https://www.npmjs.org/package/cashe)
# cashe

`cashe` is a simple "get from cache or create if not in yet" little utility for NodeJS.

It seems I always need something like this in my projects as of late so I figured others probably do too and I decided to extract it into its own tiny module.

## Install

`npm install cashe --save`

## Usage

The most basic use of cashe is by giving it a function that will create something given a key.

```javascript
var cache = cashe( function( key ) {
	return key + "value";
} );
```

You'd use it as follows:

```javascript
cache( "firstKey" ); // calls function, returns firstKeyValue
cache( "secondKey" ); // calls function, returns secondKeyValue
cache( "firstKey" ); // does NOT call function, returns firstKeyValue
```

You can go the verbose way and use an options object.

```javascript
var cache = cashe( {
	create: function( key ) {
		return key + "value";
	}
} );
```

### Custom store

By default, `cashe` will store values in a plain object. You may wanna use your own store for this as follows:

```javascript
var cache = cashe( {
	create: createFunction,
	store: myStore
} );
```

A store must implement the following interface:

- `has( <key> )`: returns `true` if a value is associated to the key, `false` otherwise
- `get( <key> )`: returns the value associated to the key. What happens if no value is associated to the key is unspecified: `cashe` will never call `get` if `has` returned `false`
- `set( <key>, <value> )`: associates the value to the key and returns the value. What happens if a value is already associated to the key is unspecified: `cashe` will never call `set` if `has` returned `true`

It is recommended that a store also implements the following optional method:

- `del( <key> )`: removes value associated with key. What happens if no value is associated to the key is unspecified: `del` should only be called if `has` returned true. If the store doesn't support deleting entries yet implements `del` then `del` must throw an exception

`cashe` does _not_ use `del` internally but it can prove useful in order to implement advanced logic on your end.

As an example, here is the code of the default store:

```javascript
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
```

You can access the default `ObjectStore` through `cashe.ObjectStore` and use it as a base for your own stores if you so desire.

The store of a cache is exposed as its `store`field:

```javascript
var cache = cashe( {
	create: createFunction,
	store: myStore
} );

cache.store === myStore; // true
```

### Complex input data for creation

Sometimes, a simple string is not enough as an input to `create`. Let's take some stupid greeting messages as an example:

```javascript
function createGreeting( person ) {
	return "Hello, " + person.firstName + " " + person.lastName;
}

var cache = cashe( createGreeting );

cache( JulianData ); // returns "Hello, Julian Aubourg"
cache( CoreyData ); // returns "Hello, Julian Aubourg" !!!!
```

What happens here is that, `cache` uses the default `ObjectStore` which considers whatever is given to it as key to be a string... which means both `JulianData` and `CoreyData` will have the same underlying key: `[object Object]`.

To avoid this, you could provide a custom store but that seems like a lot of work for nothing.

That's why there is a `key` option that you can provide to get a key out of whatever data the cache function will be given:

```javascript
var cache = cashe( {
	create: createGreeting,
	key: function( personData ) {
		return personData.id;
	}
} );

cache( JulianData ); // returns "Hello, Julian Aubourg"
cache( CoreyData ); // returns "Hello, Corey Frang"
```

In fact, the function can return any type of data as long as it is compatible with what the associated store expects as keys.

As a convenience, the `create` function is given whatever the `key` function returned as a second argument:

```javascript
function createGreeting( person, key ) {
	person.id === key; // true
}
```

## OMG! THIS IS NOT ASYNCHRONOUS-AWARE! WHAT THE WHAT?!?

Everything in `cashe` is synchronous: the `create` function must return synchronously and so do all the methods of a custom `store`.

If you wanna handle asynchronous stuff behind `cashe` __then__ (hint hint) use promises (I use [JQDeferred](https://github.com/jaubourg/jquery-deferred-for-node) extensively myself with great success).

## License

Copyright (c) 2012 - 2014 [Julian Aubourg](mailto:j@ubourg.net)
Licensed under the [MIT license](https://raw.githubusercontent.com/jaubourg/cashe/master/LICENSE-MIT).
