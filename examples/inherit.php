<!DOCTYPE HTML>
<html>
<head>
	<title>phaser.js - a new beginning</title>
	<?php
		//require('js.php');
	?>
</head>
<body>

<script type="text/javascript">

function isPlainObject ( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if (typeof(obj) !== "object" || obj.nodeType || obj === obj.window) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			if ( obj.constructor &&
					!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	}

function extend () {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	console.log('extending',length,options,deep);

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];
				console.log('extending',src,copy);

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = Array.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];

					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

Bob = {};

Bob.Coke = function (x, y) {
	this.x = x;
	this.y = y;
}

Bob.Coke.prototype = {

	fizz: function () {
		console.log('fizz', this.x, this.y);
	}

}

Bob.Sprite = function (x, y) {
	this.x = x;
	this.y = y;
}

Bob.Sprite.prototype = {

	test: function () {
		console.log('bob', this.x, this.y);
	},

	nipples: function () {
		console.log('bob nipples');
	}

}

Bob.Extra = function (x, y) {
	Bob.Sprite.call(this, x, y);
	// Bob.Coke.call(this, x, y);

}

// Bob.Extra.prototype = Object.create(Bob.Sprite.prototype);
Bob.Extra.prototype.solid = function () {
	console.log('extra solids');
}

Bob.Extra.prototype = extend(true, Bob.Extra.prototype, Bob.Sprite.prototype, Bob.Coke.prototype);



var rich = new Bob.Extra(99,100);
console.log(rich);

var sus = new Bob.Extra(500,123);
console.log(sus);

rich.test();
rich.solid();
rich.fizz();
console.log('ssssss');
sus.test();
sus.solid();
sus.fizz();


</script>

</body>
</html>