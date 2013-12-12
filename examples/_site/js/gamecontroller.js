/* HTML5 Virtual Game Controller
 * Courtesy of Austin Hallock
 * https://github.com/austinhallock/html5-virtual-game-controller/
 * Copyright (c) 2013 Clay.io
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Helpers 
 */
( function(exports) {
	var __slice = [].slice;
	var __hasProp = {}.hasOwnProperty;
	var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
	/* $.extend functionality */
	function extend( target, src )
	{
		var options, name, copy, copyIsArray, clone,
			i = 1,
			length = 2,
			deep = true;
	
		// Handle a deep copy situation
		if( typeof target === "boolean" )
		{
			deep = target;
			// skip the boolean and the target
			i = 2;
		}
	
		// Handle case when target is a string or something( possible in deep copy )
		if( typeof target !== "object" && !typeof target === 'function' )
		{
			target = {};
		}
		// Only deal with non-null/undefined values
		if( options = src )
		{
			// Extend the base object
			for( name in options )
			{
				src = target[name];
				copy = options[name];
	
				// Prevent never-ending loop
				if( target === copy )
				{
					continue;
				}
				// Recurse if we're merging plain objects or arrays
				if( deep &&( typeof copy == 'object' ||( copyIsArray = Object.prototype.toString.call(  copy  ) === '[object Array]' ) ) ) 
				{
					if( copyIsArray ) 
					{
						copyIsArray = false;
						clone = src && Object.prototype.toString.call(  src  ) === '[object Array]' ? src : [];
	
					} 
					else 
					{
						clone = src && typeof src == 'object' ? src : {};
					}
					// Never move original objects, clone them
					target[name] = extend( clone, copy );
	
					// Don't bring in undefined values
				} 
				else if( typeof copy !== 'undefined' ) 
				{
					target[name] = copy;
				}
			}
		}
		return target;
	}
	
	// Make available to window
	exports.GameController = {
		
		// Default options,
		options: {
			left: { 
				type: 'dpad', 
				position: { left: '13%', bottom: '22%' },
				dpad: {
					up: {
						width: '7%',
						height: '15%',
						stroke: 2,
						touchStart: function() {
							GameController.simulateKeyEvent( 'press', 38 );
							GameController.simulateKeyEvent( 'down', 38 );
						},
						touchEnd: function() {
							GameController.simulateKeyEvent( 'up', 38 );
						}
					},
					left: {
						width: '15%',
						height: '7%',
						stroke: 2,
						touchStart: function() {
							GameController.simulateKeyEvent( 'press', 37 );
							GameController.simulateKeyEvent( 'down', 37 );
						},
						touchEnd: function() {
							GameController.simulateKeyEvent( 'up', 37 );
						}
					},
					down: {
						width: '7%',
						height: '15%',
						stroke: 2,
						touchStart: function() {
							GameController.simulateKeyEvent( 'press', 40 );
							GameController.simulateKeyEvent( 'down', 40 );
						},
						touchEnd: function() {
							GameController.simulateKeyEvent( 'up', 40 );
						}
					},
					right: {
						width: '15%',
						height: '7%',
						stroke: 2,
						touchStart: function() {
							GameController.simulateKeyEvent( 'press', 39 );
							GameController.simulateKeyEvent( 'down', 39 );
						},
						touchEnd: function() {
							GameController.simulateKeyEvent( 'up', 39 );
						}
					}
				},
				joystick: {
					radius: 60,
					touchMove: function( e ) {
						console.log( e );
					}
				}
			},
			right: { 
				type: 'buttons', 
				position: { right: '17%', bottom: '28%' }, 
				buttons: [
					{ offset: { x: '-13%', y: 0 }, label: 'X', radius: '7%', stroke: 2, backgroundColor: 'blue', fontColor: '#fff', touchStart: function() {
						// Blue is currently mapped to up button
						GameController.simulateKeyEvent( 'press', 88 ); // x key
						GameController.simulateKeyEvent( 'down', 88 );
					}, touchEnd: function() {
						GameController.simulateKeyEvent( 'up', 88 );	
					} },
					{ offset: { x: 0, y: '-11%' }, label: 'Y', radius: '7%', stroke: 2, backgroundColor: 'yellow', fontColor: '#fff', touchStart: function() {
						GameController.simulateKeyEvent( 'press', 70 ); // f key
						GameController.simulateKeyEvent( 'down', 70 );
					}, touchEnd: function() {
						GameController.simulateKeyEvent( 'up', 70 );						
					}  },
					{ offset: { x: '13%', y: 0 }, label: 'B', radius: '7%', stroke: 2, backgroundColor: 'red', fontColor: '#fff', touchStart: function() {
						GameController.simulateKeyEvent( 'press', 90 ); // z key
						GameController.simulateKeyEvent( 'down', 90 );
					}, touchEnd: function() {
						GameController.simulateKeyEvent( 'up', 90 );						
					} },
					{ offset: { x: 0, y: '11%' }, label: 'A', radius: '7%', stroke: 2, backgroundColor: 'green', fontColor: '#fff', touchStart: function() {
						GameController.simulateKeyEvent( 'press', 67 ); // a key
						GameController.simulateKeyEvent( 'down', 67 );
					}, touchEnd: function() {
						GameController.simulateKeyEvent( 'up', 67 );	
					}  }
				],
				dpad: {
					up: {
						width: '7%',
						height: '15%',
						stroke: 2
					},
					left: {
						width: '15%',
						height: '7%',
						stroke: 2
					},
					down: {
						width: '7%',
						height: '15%',
						stroke: 2
					},
					right: {
						width: '15%',
						height: '7%',
						stroke: 2
					}
				},
				joystick: {
					radius: 60,
					touchMove: function( e ) {
						console.log( e );
					}
				}
			},
			touchRadius: 45
		},
		
		// Areas (objects) on the screen that can be touched
		touchableAreas: [],
		touchableAreasCount: 0,
		
		// Multi-touch
		touches: [],
		
		// Canvas offset on page (for coverting touch coordinates)
		offsetX: 0,
		offsetY: 0,
		
		// Bounding box - used for clearRect - first we determine which areas of the canvas are actually drawn to
		bound: {
			left: false,
			right: false,
			top: false,
			bottom: false
		},
		
		// Heavy sprites (with gradients) are cached as a canvas to improve performance
		cachedSprites: {},
		
		paused: false,
		
		init: function( options ) {
			
			// Don't do anything if there's no touch support
			if( ! 'ontouchstart' in document.documentElement )
				return;
				
	
			// Merge default options and specified options
			options = options || {};
			extend( this.options, options );	
			
			var userAgent = navigator.userAgent.toLowerCase();
			// See if we should run the performanceFriendly version (for slower CPUs)
			this.performanceFriendly = ( userAgent.indexOf( 'iphone' ) !== -1 || userAgent.indexOf( 'android' ) !== -1 || this.options.forcePerformanceFriendly );
			
			// Grab the canvas if one wasn't passed
			var ele;
			if( !this.options.canvas || !( ele = document.getElementById( this.options.canvas ) ) )
			{
				this.options.canvas = document.getElementsByTagName( 'canvas' )[0];
			}
			else if( ele )
			{
				this.options.canvas = ele;
			}
			
			this.options.ctx = this.options.canvas.getContext( '2d' );
			
			// Create a canvas that goes directly on top of the game canvas
			this.createOverlayCanvas();
		},
		
		/**
		 * Finds the actual 4 corners of canvas that are being used (so we don't have to clear the entire canvas each render) 
		 * Called when each new touchableArea is added in
		 * @param {object} options - x, y, width, height
		 */
		boundingSet: function( options ) {
			var directions = ['left', 'right'];
			
			// Square - pivot is top left
			if( options.width )
			{
				var width = this.getPixels( options.width );
				var height = this.getPixels( options.height );
				var left = this.getPixels( options.x );
				var top = this.getPixels( options.y );
			}
			// Circle - pivot is center
			else
			{
				if( this.options.touchRadius )
					var radius = this.getPixels( options.radius ) * 2 + ( this.getPixels( this.options.touchRadius ) / 2 ); // size of the box the joystick can go to
				else
					var radius = options.radius;
				var width = height = ( radius + this.getPixels( options.stroke ) ) * 2;
				var left = this.getPixels( options.x ) - ( width / 2 );
				var top = this.getPixels( options.y ) - ( height / 2 );
			}
			var right = left + width;
			var bottom = top + height;
			
			if( this.bound.left === false || left < this.bound.left )
				this.bound.left = left;
			if( this.bound.right === false || right > this.bound.right )
				this.bound.right = right;
			if( this.bound.top === false || top < this.bound.top )
				this.bound.top = top;
			if( this.bound.bottom === false || bottom > this.bound.bottom )
				this.bound.bottom = bottom;
		},
		
		/**
		 * Creates the canvas that sits on top of the game's canvas and holds game controls 
		 */
		createOverlayCanvas: function() {
			this.canvas = document.createElement( 'canvas' );
			
			// Scale to same size as original canvas
			this.resize( true );
			
			document.getElementsByTagName( 'body' )[0].appendChild( this.canvas );
			this.ctx = this.canvas.getContext( '2d' );
			
			var _this = this;
			window.addEventListener( 'resize', function() {
				// Wait for any other events to finish
				setTimeout( function() { GameController.resize.call( _this ); }, 1 );
			} );
			
			
			// Set the touch events for this new canvas
			this.setTouchEvents();
			
			// Load in the initial UI elements
			this.loadSide( 'left' );
			this.loadSide( 'right' );
			
			// Starts up the rendering / drawing
			this.render();
			
			if( ! this.touches || this.touches.length == 0 )
				this.paused = true; // pause until a touch event
		},
		
		pixelRatio: 1,
		resize: function( firstTime ) {
			// Scale to same size as original canvas
			this.canvas.width = this.options.canvas.width;
			this.canvas.height = this.options.canvas.height;
			
			this.offsetX = GameController.options.canvas.offsetLeft + document.body.scrollLeft;
			this.offsetY = GameController.options.canvas.offsetTop + document.body.scrollTop;
			
			// Get in on this retina action
			if( this.options.canvas.style.width && this.options.canvas.style.height && this.options.canvas.style.height.indexOf( 'px' ) !== -1 ) 
			{
				this.canvas.style.width = this.options.canvas.style.width;
				this.canvas.style.height = this.options.canvas.style.height;
				this.pixelRatio = this.canvas.width / parseInt( this.canvas.style.width );
			}
			
			this.canvas.style.position = 'absolute';
			this.canvas.style.zIndex = '5';
			this.canvas.style.left = this.options.canvas.offsetLeft + 'px';
			this.canvas.style.top = this.options.canvas.offsetTop + 'px';
			this.canvas.setAttribute( 'style', this.canvas.getAttribute( 'style' ) +' -ms-touch-action: none;' );
			
			if( !firstTime )
			{
				// Remove all current buttons
				this.touchableAreas = [];
				// Clear out the cached sprites
				this.cachedSprites = [];
				// Reload in the initial UI elements
				this.reloadSide( 'left' );
				this.reloadSide( 'right' );
			}
		},
		
		/**
		 * Returns the scaled pixels. Given the value passed
		 * @param {int/string} value - either an integer for # of pixels, or 'x%' for relative
		 * @param {char} axis - x, y
		 */
		getPixels: function( value, axis )
		{
			if( typeof value === 'undefined' )
				return 0
			else if( typeof value === 'number' )
				return value;
			else // a percentage
			{
				if( axis == 'x' )
					return ( parseInt( value ) / 100 ) * this.canvas.width;
				else
					return ( parseInt( value ) / 100 ) * this.canvas.height;
			}
		},
		
		/**
		 * Simulates a key press
		 * @param {string} eventName - 'down', 'up'
		 * @param {char} character
		 */
		simulateKeyEvent: function( eventName, keyCode ) {
			if( typeof window.onkeydown === 'undefined' ) // No keyboard, can't simulate...
				return false;
				
			/* If they have jQuery, use it because it works better for mobile safari */
			if( typeof jQuery !== 'undefined' )
			{
				var press = jQuery.Event( 'key' + eventName );
				press.ctrlKey = false;
				press.which = keyCode;
				press.keyCode = keyCode;
				// Keypress on just the canvas instead of the document
				$( this.options.canvas ).trigger( press );
				return;
			}
	
			var oEvent = document.createEvent( 'KeyboardEvent' );
			
			// Chromium Hack
			if( navigator.userAgent.toLowerCase().indexOf( 'chrome' ) !== -1 )
			{
				Object.defineProperty( oEvent, 'keyCode', {
					get : function() {
						return this.keyCodeVal;
					}
				} );	 
				Object.defineProperty( oEvent, 'which', {
					get : function() {
						return this.keyCodeVal;
					}
				} );
			}
				
			if( oEvent.initKeyboardEvent )
			{
				oEvent.initKeyboardEvent( 'key' + eventName, true, true, document.defaultView, false, false, false, false, keyCode, keyCode );
			}
			else
			{
				oEvent.initKeyEvent( 'key' + eventName, true, true, document.defaultView, false, false, false, false, keyCode, keyCode );
			}
		
			oEvent.keyCodeVal = keyCode;
		
		},
		
		setTouchEvents: function() {
			var _this = this;
			var touchStart = function( e ) {
				if( _this.paused )
				{
					_this.paused = false;
				}
					
				e.preventDefault();
	
				// Microsoft always has to have their own stuff...
				if( window.navigator.msPointerEnabled && e.clientX && e.pointerType == e.MSPOINTER_TYPE_TOUCH )
				{
					_this.touches[ e.pointerId ] = { clientX: e.clientX, clientY: e.clientY };
				}
				else
				{
					_this.touches = e.touches || [];
				}
			};
	
			this.canvas.addEventListener( 'touchstart', touchStart, false );
			
			var touchEnd = function( e ) {			
				e.preventDefault();
			
				if( window.navigator.msPointerEnabled && e.pointerType == e.MSPOINTER_TYPE_TOUCH )
				{
					delete _this.touches[ e.pointerId ];
				}
				else
				{	
					_this.touches = e.touches || [];
				}
				
				if( !e.touches || e.touches.length == 0 )
				{
					// Draw once more to remove the touch area
					_this.render();
					_this.paused = true;
				}
			};
			this.canvas.addEventListener( 'touchend', touchEnd );
	
			var touchMove = function( e ) {
				e.preventDefault();
				
				if( window.navigator.msPointerEnabled && e.clientX && e.pointerType == e.MSPOINTER_TYPE_TOUCH )
				{
					_this.touches[ e.pointerId ] = { clientX: e.clientX, clientY: e.clientY };				
				}
				else
				{
					_this.touches = e.touches || [];
				}
			};
			this.canvas.addEventListener( 'touchmove', touchMove );
			
			if( window.navigator.msPointerEnabled )
			{
				this.canvas.addEventListener( 'MSPointerDown', touchStart );
				this.canvas.addEventListener( 'MSPointerUp', touchEnd );
				this.canvas.addEventListener( 'MSPointerMove', touchMove );
			}
		},
		
		/**
		 * Adds the area to a list of touchable areas, draws
		 * @param {object} options with properties: x, y, width, height, touchStart, touchEnd, touchMove
		 */
		addTouchableDirection: function( options ) {
			
			var direction = new TouchableDirection( options );
			
			direction.id = this.touchableAreas.push( direction );
			this.touchableAreasCount++;
			
			this.boundingSet( options );
		},
		
		/**
		 * Adds the circular area to a list of touchable areas, draws	
		 * @param {object} options with properties: x, y, width, height, touchStart, touchEnd, touchMove
		 */
		addJoystick: function( options ) { //x, y, radius, backgroundColor, touchStart, touchEnd ) {
			
			var joystick = new TouchableJoystick( options );
			
			joystick.id = this.touchableAreas.push( joystick );
			this.touchableAreasCount++;
			
			this.boundingSet( options );
		},
		
		/**
		 * Adds the circular area to a list of touchable areas, draws	 
		 * @param {object} options with properties: x, y, width, height, touchStart, touchEnd, touchMove
		 */
		addButton: function( options ) { //x, y, radius, backgroundColor, touchStart, touchEnd ) {
			
			var button = new TouchableButton( options );
			
			button.id = this.touchableAreas.push( button );
			this.touchableAreasCount++;
			
			this.boundingSet( options );
		},
		
		addTouchableArea: function( check, callback ) {
		},
		
		loadButtons: function( side ) {
			var buttons = this.options[ side ].buttons;
			var _this = this;
			for( var i = 0, j = buttons.length; i < j; i++ )
			{
				if( typeof buttons[i] === 'undefined' || typeof buttons[i].offset === 'undefined' )
					continue;
					
				var posX = this.getPositionX( side );
				var posY = this.getPositionY( side );
							
				buttons[i].x = posX + this.getPixels( buttons[i].offset.x, 'y' );
				buttons[i].y = posY + this.getPixels( buttons[i].offset.y, 'y' );
	
				this.addButton( buttons[i] );
			}
		},
		
		loadDPad: function( side ) {
			var dpad = this.options[ side ].dpad || {};
			
			// Centered value is at this.options[ side ].position
			
			var _this = this;
			
			var posX = this.getPositionX( side );
			var posY = this.getPositionY( side );
			
			
			// If they have all 4 directions, add a circle to the center for looks
			if( dpad.up && dpad.left && dpad.down && dpad.right )
			{
				var options = {
					x: posX,
					y: posY,
					radius: dpad.right.height
				}
				var center = new TouchableCircle( options ); 
				this.touchableAreas.push( center );
				this.touchableAreasCount++;
			}
	
			// Up arrow
			if( dpad.up !== false )
			{
				dpad.up.x = posX - this.getPixels( dpad.up.width, 'y' ) / 2;
				dpad.up.y = posY - ( this.getPixels( dpad.up.height, 'y' ) +  this.getPixels( dpad.left.height, 'y' ) / 2 );
				dpad.up.direction = 'up';
				this.addTouchableDirection( dpad.up );
			}
	
			// Left arrow
			if( dpad.left !== false )
			{
				dpad.left.x = posX - ( this.getPixels( dpad.left.width, 'y' ) + this.getPixels( dpad.up.width, 'y' ) / 2 );
				dpad.left.y = posY - ( this.getPixels( dpad.left.height, 'y' ) / 2 );
				dpad.left.direction = 'left';
				this.addTouchableDirection( dpad.left );
			}
	
			// Down arrow
			if( dpad.down !== false )
			{
				dpad.down.x = posX - this.getPixels( dpad.down.width, 'y' ) / 2;
				dpad.down.y = posY + ( this.getPixels( dpad.left.height, 'y' ) / 2 );
				dpad.down.direction = 'down';
				this.addTouchableDirection( dpad.down );
			}
			
			// Right arrow
			if( dpad.right !== false )
			{
				dpad.right.x = posX + ( this.getPixels( dpad.up.width, 'y' ) / 2 );
				dpad.right.y = posY - this.getPixels( dpad.right.height, 'y' ) / 2;
				dpad.right.direction = 'right';
				this.addTouchableDirection( dpad.right );
			}
			
		},
		
		loadJoystick: function( side ) {
			var joystick = this.options[ side ].joystick;
			joystick.x = this.getPositionX( side );
			joystick.y = this.getPositionY( side );
	
			this.addJoystick( joystick );
		},
		
		/**
		 * Used for resizing. Currently is just an alias for loadSide
		 */
		reloadSide: function( side ) {
			// Load in new ones
			this.loadSide( side );
		},
		
		loadSide: function( side ) {
			if( this.options[ side ].type === 'dpad' )
			{
				this.loadDPad( side );
			}
			else if( this.options[ side ].type === 'joystick' )
			{
				this.loadJoystick( side );
			}
			else if( this.options[ side ].type === 'buttons' )
			{
				this.loadButtons( side );
			}
		},
		
		/**
		 * Normalize touch positions by the left and top offsets
		 * @param {int} x
		 */
		normalizeTouchPositionX: function( x )
		{
			return ( x - this.offsetX ) * ( this.pixelRatio );
		},
		
		/**
		 * Normalize touch positions by the left and top offsets
		 * @param {int} y
		 */
		normalizeTouchPositionY: function( y )
		{
			return ( y - this.offsetY ) * ( this.pixelRatio );
		},
		
		/**
		 * Returns the x position when given # of pixels from right (based on canvas size)
		 * @param {int} right 
		 */
		getXFromRight: function( right ) {
			return this.canvas.width - right;
		},
		
		
		/**
		 * Returns the y position when given # of pixels from bottom (based on canvas size)
		 * @param {int} right 
		 */
		getYFromBottom: function( bottom ) {
			return this.canvas.height - bottom;
		},
		
		/**
		 * Grabs the x position of either the left or right side/controls
		 * @param {string} side - 'left', 'right' 
		 */
		getPositionX: function( side ) {
			if( typeof this.options[ side ].position.left !== 'undefined' )
				return this.getPixels( this.options[ side ].position.left, 'x' );
			else
				return this.getXFromRight( this.getPixels( this.options[ side ].position.right, 'x' ) );
		},
		
		/**
		 * Grabs the y position of either the left or right side/controls
		 * @param {string} side - 'left', 'right' 
		 */
		getPositionY: function( side ) {
			if( typeof this.options[ side ].position.top !== 'undefined' )
				return this.getPixels( this.options[ side ].position.top, 'y' );
			else
				return this.getYFromBottom( this.getPixels( this.options[ side ].position.bottom, 'y' ) );
		},

		/**
		 * Processes the info for each touchableArea 
		 */
		renderAreas: function() {
			for( var i = 0, j = this.touchableAreasCount; i < j; i++ )
			{
				var area = this.touchableAreas[ i ];				
				
				if( typeof area === 'undefined' )
					continue;

				area.draw();
					
				// Go through all touches to see if any hit this area
				var touched = false;
				for( var k = 0, l = this.touches.length; k < l; k++ )
				{
					var touch = this.touches[ k ];
					if( typeof touch === 'undefined' )
						continue;
	
					var x = this.normalizeTouchPositionX( touch.clientX ), y = this.normalizeTouchPositionY( touch.clientY );
													
					// Check that it's in the bounding box/circle
					if( ( area.check( x, y ) ) !== false )
					{
						if( !touched )
							touched = this.touches[ k ];
					}
				}

				if( touched )
				{
					if( !area.active )
						area.touchStartWrapper( touched );
					area.touchMoveWrapper( touched );
				}
				else if( area.active )
				{
					area.touchEndWrapper( touched );
				}
			}
		},
		
		render: function() {
			if( ! this.paused || ! this.performanceFriendly )
				this.ctx.clearRect( this.bound.left, this.bound.top, this.bound.right - this.bound.left, this.bound.bottom - this.bound.top );
	
			// Draw feedback for when screen is being touched
			// When no touch events are happening, this enables 'paused' mode, which skips running this
			// This isn't run at all in performanceFriendly mode
			if( ! this.paused && ! this.performanceFriendly )
			{
				var cacheId = 'touch-circle';
				var cached = this.cachedSprites[ cacheId ];
				
				if( ! cached && this.options.touchRadius )
				{
					var subCanvas = document.createElement( 'canvas' );
					var ctx = subCanvas.getContext( '2d' );
					subCanvas.width = 2 * this.options.touchRadius;
					subCanvas.height = 2 * this.options.touchRadius;
		
					var center = this.options.touchRadius;
					var gradient = ctx.createRadialGradient( center, center, 1, center, center, this.options.touchRadius ); // 10 = end radius
					gradient.addColorStop( 0, 'rgba( 200, 200, 200, 1 )' );
					gradient.addColorStop( 1, 'rgba( 200, 200, 200, 0 )' );
					ctx.beginPath();
					ctx.fillStyle = gradient;
					ctx.arc( center, center, this.options.touchRadius, 0 , 2 * Math.PI, false );
					ctx.fill();
				
					cached = GameController.cachedSprites[ cacheId ] = subCanvas;
				}
				// Draw the current touch positions if any
				for( var i = 0, j = this.touches.length; i < j; i++ )
				{
					var touch = this.touches[ i ];
					if( typeof touch === 'undefined' )
						continue;
					var x = this.normalizeTouchPositionX( touch.clientX ), y = this.normalizeTouchPositionY( touch.clientY );
					if( x - this.options.touchRadius > this.bound.left && x + this.options.touchRadius < this.bound.right &&  
						y - this.options.touchRadius > this.bound.top && y + this.options.touchRadius < this.bound.bottom )
					this.ctx.drawImage( cached, x - this.options.touchRadius, y - this.options.touchRadius );
				}
			}
			
			// Render if the game isn't paused, or we're not in performanceFriendly mode (running when not paused keeps the semi-transparent gradients looking better for some reason)
			if( ! this.paused || ! this.performanceFriendly )
			{
				// Process all the info for each touchable area
				this.renderAreas();
			}

			window.requestAnimationFrame( this.renderWrapper );
		},
		/**
		 * So we can keep scope, and don't have to create a new obj every requestAnimationFrame (bad for garbage collection) 
		 */
		renderWrapper: function() {
			GameController.render();
		},	
	}
	
	/**
	 * Superclass for touchable stuff 
	 */
	var TouchableArea = ( function() {
		
		function TouchableArea() 
		{
		}
		
		// Called when this direction is being touched
		TouchableArea.prototype.touchStart = null;
		
		// Called when this direction is being moved
		TouchableArea.prototype.touchMove = null;
		
		// Called when this direction is no longer being touched
		TouchableArea.prototype.touchEnd = null;
		
		TouchableArea.prototype.type = 'area';
		TouchableArea.prototype.id = false;
		TouchableArea.prototype.active = false;
		
		/**
		 * Sets the user-specified callback for this direction being touched
		 * @param {function} callback 
		 */
		TouchableArea.prototype.setTouchStart = function( callback ) {
			this.touchStart = callback;
		};
		
		/**
		 * Called when this direction is no longer touched 
		 */
		TouchableArea.prototype.touchStartWrapper = function( e ) {
			// Fire the user specified callback
			if( this.touchStart )
				this.touchStart();
			
			// Mark this direction as active
			this.active = true;
		};
		
		/**
		 * Sets the user-specified callback for this direction no longer being touched
		 * @param {function} callback 
		 */
		TouchableArea.prototype.setTouchMove = function( callback ) {
			this.touchMove = callback;
		};
		
		/**
		 * Called when this direction is moved. Make sure it's actually changed before passing to developer
		 */
		TouchableArea.prototype.lastPosX = 0;
		TouchableArea.prototype.lastPosY = 0;
		TouchableArea.prototype.touchMoveWrapper = function( e ) {
			// Fire the user specified callback
			if( this.touchMove && ( e.clientX != TouchableArea.prototype.lastPosX || e.clientY != TouchableArea.prototype.lastPosY ) )
			{
				this.touchMove();
				this.lastPosX = e.clientX;
				this.lastPosY = e.clientY;
			}
			// Mark this direction as active
			this.active = true;
		};
		
		/**
		 * Sets the user-specified callback for this direction no longer being touched
		 * @param {function} callback 
		 */
		TouchableArea.prototype.setTouchEnd = function( callback ) {
			this.touchEnd = callback;
		};
		
		/**
		 * Called when this direction is first touched 
		 */
		TouchableArea.prototype.touchEndWrapper = function( e ) {
			// Fire the user specified callback
			if( this.touchEnd )
				this.touchEnd();
			
			// Mark this direction as inactive
			this.active = false;
			
			GameController.render();
		};
		
		return TouchableArea;
		
	} )();
	
	var TouchableDirection = ( function( __super ) {
		__extends( TouchableDirection, __super );
		
		function TouchableDirection( options ) 
		{
			for( var i in options )
			{
				if( i == 'x' )
					this[i] = GameController.getPixels( options[i], 'x' );
				else if( i == 'y' || i == 'height' || i == 'width' )
					this[i] = GameController.getPixels( options[i], 'y' );
				else
					this[i] = options[i];
			}
			
			this.draw();
		}
	
		TouchableDirection.prototype.type = 'direction';
		
		/**
		 * Checks if the touch is within the bounds of this direction 
		 */
		TouchableDirection.prototype.check = function( touchX, touchY ) {
			var distanceX, distanceY;
			if( ( Math.abs( touchX - this.x ) < ( GameController.options.touchRadius / 2 ) || ( touchX > this.x ) ) && // left
				( Math.abs( touchX - ( this.x + this.width ) ) < ( GameController.options.touchRadius / 2 ) || ( touchX < this.x + this.width ) ) && // right
				( Math.abs( touchY - this.y ) < ( GameController.options.touchRadius / 2 ) || ( touchY > this.y ) ) && // top
				( Math.abs( touchY - ( this.y + this.height ) ) < ( GameController.options.touchRadius / 2 ) || ( touchY < this.y + this.height ) ) // bottom
			)
				return true;
				
			return false;
		};
		
		TouchableDirection.prototype.draw = function() {
			var cacheId = this.type + '' + this.id + '' + this.active;
			var cached = GameController.cachedSprites[ cacheId ];
			if( ! cached )
			{
				var subCanvas = document.createElement( 'canvas' );
				var ctx = subCanvas.getContext( '2d' );
				subCanvas.width = this.width + 2 * this.stroke;
				subCanvas.height = this.height + 2 * this.stroke;
	
				var opacity = this.opacity || 0.9;
				
				if( ! this.active ) // Direction currently being touched
					opacity *= 0.5;
					
				switch( this.direction )
				{
					case 'up':
						var gradient = ctx.createLinearGradient( 0, 0, 0, this.height );
						gradient.addColorStop( 0, 'rgba( 0, 0, 0, ' + ( opacity * 0.5 ) + ' )' );
						gradient.addColorStop( 1, 'rgba( 0, 0, 0, ' + opacity + ' )' );   
						break;
					case 'left':
						var gradient = ctx.createLinearGradient( 0, 0, this.width, 0 );
						gradient.addColorStop( 0, 'rgba( 0, 0, 0, ' + ( opacity * 0.5 ) + ' )' );
						gradient.addColorStop( 1, 'rgba( 0, 0, 0, ' + opacity + ' )' );   
						break;
					case 'right':
						var gradient = ctx.createLinearGradient( 0, 0, this.width, 0 );
						gradient.addColorStop( 0, 'rgba( 0, 0, 0, ' + opacity + ' )' );
						gradient.addColorStop( 1, 'rgba( 0, 0, 0, ' + ( opacity * 0.5 ) + ' )' );  
						break;
					case 'down':
					default:
						var gradient = ctx.createLinearGradient( 0, 0, 0, this.height );
						gradient.addColorStop( 0, 'rgba( 0, 0, 0, ' + opacity + ' )' );
						gradient.addColorStop( 1, 'rgba( 0, 0, 0, ' + ( opacity * 0.5 ) + ' )' );   
				}
				ctx.fillStyle = gradient;
		
				ctx.fillRect( 0, 0, this.width, this.height );
				ctx.lineWidth = this.stroke;
				ctx.strokeStyle = 'rgba( 255, 255, 255, 0.1 )';
				ctx.strokeRect( 0, 0, this.width, this.height );
				
				cached = GameController.cachedSprites[ cacheId ] = subCanvas;
			}
			
			GameController.ctx.drawImage( cached, this.x, this.y );
				
	
		};
		
		return TouchableDirection;
	} )( TouchableArea );
	
	var TouchableButton = ( function( __super ) {
		__extends( TouchableButton, __super );
		
		function TouchableButton( options ) //x, y, radius, backgroundColor )
		{
			for( var i in options )
			{
				if( i == 'x' )
					this[i] = GameController.getPixels( options[i], 'x' );
				else if( i == 'x' || i == 'radius' )
					this[i] = GameController.getPixels( options[i], 'y' );
				else
					this[i] = options[i];
			}
			
			this.draw();
		}
		
		TouchableButton.prototype.type = 'button';
		
		/**
		 * Checks if the touch is within the bounds of this direction 
		 */
		TouchableButton.prototype.check = function( touchX, touchY ) {
			if( 
				( Math.abs( touchX - this.x ) < this.radius + ( GameController.options.touchRadius / 2 ) ) &&
				( Math.abs( touchY - this.y ) < this.radius + ( GameController.options.touchRadius / 2 ) )
			)
				return true;
				
			return false;
		};
		
		TouchableButton.prototype.draw = function() {
			var cacheId = this.type + '' + this.id + '' + this.active;
			var cached = GameController.cachedSprites[ cacheId ];
			if( ! cached )
			{
				var subCanvas = document.createElement( 'canvas' );
				var ctx = subCanvas.getContext( '2d' );
				ctx.lineWidth = this.stroke;
				subCanvas.width = subCanvas.height = 2 * ( this.radius + ctx.lineWidth );
				
				
				var gradient = ctx.createRadialGradient( this.radius, this.radius, 1, this.radius, this.radius, this.radius );
				var textShadowColor;
				switch( this.backgroundColor )
				{
					case 'blue':
						gradient.addColorStop( 0, 'rgba(123, 181, 197, 0.6)' );
						gradient.addColorStop( 1, '#105a78' );
						textShadowColor = '#0A4861';
						break;
					case 'green':
						gradient.addColorStop( 0, 'rgba(29, 201, 36, 0.6)' );
						gradient.addColorStop( 1, '#107814' );
						textShadowColor = '#085C0B';
						break;
					case 'red':
						gradient.addColorStop( 0, 'rgba(165, 34, 34, 0.6)' );
						gradient.addColorStop( 1, '#520101' );
						textShadowColor = '#330000';
						break;
					case 'yellow':
						gradient.addColorStop( 0, 'rgba(219, 217, 59, 0.6)' );
						gradient.addColorStop( 1, '#E8E10E' );
						textShadowColor = '#BDB600';
						break;
					case 'white':
					default:
						gradient.addColorStop( 0, 'rgba( 255,255,255,.3 )' );
						gradient.addColorStop( 1, '#eee' );
						break;
				}
					
				if( this.active )			
					ctx.fillStyle = textShadowColor;
				else	
					ctx.fillStyle = gradient;
	
				ctx.strokeStyle = textShadowColor;			
		
				ctx.beginPath();
				//ctx.arc( this.x, this.y, this.radius, 0 , 2 * Math.PI, false );
				ctx.arc( subCanvas.width / 2, subCanvas.width / 2, this.radius, 0 , 2 * Math.PI, false );
				ctx.fill();
				ctx.stroke();
				
				if( this.label )
				{
					// Text Shadow
					ctx.fillStyle = textShadowColor;
					ctx.font = 'bold ' + ( this.fontSize || subCanvas.height * 0.35 ) + 'px Verdana';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText( this.label, subCanvas.height / 2 + 2, subCanvas.height / 2 + 2 );
		
		
					ctx.fillStyle = this.fontColor;
					ctx.font = 'bold ' + ( this.fontSize || subCanvas.height * 0.35 ) + 'px Verdana';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText( this.label, subCanvas.height / 2, subCanvas.height / 2 );
				}
				
				cached = GameController.cachedSprites[ cacheId ] = subCanvas;
			}

			GameController.ctx.drawImage( cached, this.x, this.y );
			
			
		};
		
		return TouchableButton;
	} )( TouchableArea );
	
	var TouchableJoystick = ( function( __super ) {
		__extends( TouchableJoystick, __super );
		
		function TouchableJoystick( options ) //x, y, radius, backgroundColor )
		{
			for( var i in options )
				this[i] = options[i];
				
			this.currentX = this.currentX || this.x;
			this.currentY = this.currentY || this.y;
		}
		
		TouchableJoystick.prototype.type = 'joystick';
		
		/**
		 * Checks if the touch is within the bounds of this direction 
		 */
		TouchableJoystick.prototype.check = function( touchX, touchY ) {
			if( 
				( Math.abs( touchX - this.x ) < this.radius + ( GameController.getPixels( GameController.options.touchRadius ) / 2 ) ) &&
				( Math.abs( touchY - this.y ) < this.radius + ( GameController.getPixels( GameController.options.touchRadius ) / 2 ) )
			)
				return true;
				
			return false;
		};
		
		/**
		 * details for the joystick move event, stored here so we're not constantly creating new objs for garbage. The object has params:
		 * dx - the number of pixels the current joystick center is from the base center in x direction
		 * dy - the number of pixels the current joystick center is from the base center in y direction
		 * max - the maximum number of pixels dx or dy can be
		 * normalizedX - a number between -1 and 1 relating to how far left or right the joystick is
		 * normalizedY - a number between -1 and 1 relating to how far up or down the joystick is
		 */
		TouchableJoystick.prototype.moveDetails = {};
		
		/**
		 * Called when this joystick is moved
		 */
		TouchableJoystick.prototype.touchMoveWrapper = function( e ) {
			this.currentX = GameController.normalizeTouchPositionX( e.clientX );	
			this.currentY = GameController.normalizeTouchPositionY( e.clientY );
			
			// Fire the user specified callback
			if( this.touchMove )
			{
				if( this.moveDetails.dx != this.currentX - this.x && this.moveDetails.dy != this.y - this.currentY )
				{
					this.moveDetails.dx = this.currentX - this.x; // reverse so right is positive
					this.moveDetails.dy = this.y - this.currentY;
					this.moveDetails.max = this.radius + ( GameController.options.touchRadius / 2 );
					this.moveDetails.normalizedX = this.moveDetails.dx / this.moveDetails.max;
					this.moveDetails.normalizedY = this.moveDetails.dy / this.moveDetails.max;
						
					this.touchMove( this.moveDetails );
				}
			}
				
			
			// Mark this direction as inactive
			this.active = true;
		};
		
		TouchableJoystick.prototype.draw = function() {
			if( ! this.id ) // wait until id is set
				return false;
				
			var cacheId = this.type + '' + this.id + '' + this.active;
			var cached = GameController.cachedSprites[ cacheId ];
			if( ! cached )
			{
				var subCanvas = document.createElement( 'canvas' );
				this.stroke = this.stroke || 2;
				subCanvas.width = subCanvas.height = 2 * ( this.radius + ( GameController.options.touchRadius ) + this.stroke );
				
				var ctx = subCanvas.getContext( '2d' );
				ctx.lineWidth = this.stroke;
				if( this.active ) // Direction currently being touched
				{
					var gradient = ctx.createRadialGradient( 0, 0, 1, 0, 0, this.radius );
					gradient.addColorStop( 0, 'rgba( 200,200,200,.5 )' );
					gradient.addColorStop( 1, 'rgba( 200,200,200,.9 )' );
					ctx.strokeStyle = '#000';
				}	
				else
				{
					// STYLING FOR BUTTONS
					var gradient = ctx.createRadialGradient( 0, 0, 1, 0, 0, this.radius );
					gradient.addColorStop( 0, 'rgba( 200,200,200,.2 )' );
					gradient.addColorStop( 1, 'rgba( 200,200,200,.4 )' );
					ctx.strokeStyle = 'rgba( 0,0,0,.4 )';
				}
				ctx.fillStyle = gradient;
				// Actual joystick part that is being moved
				ctx.beginPath();
				ctx.arc( this.radius, this.radius, this.radius, 0 , 2 * Math.PI, false );
				ctx.fill();
				ctx.stroke();
				
				cached = GameController.cachedSprites[ cacheId ] = subCanvas;
			}
			
			// Draw the base that stays static
			GameController.ctx.fillStyle = '#444';
			GameController.ctx.beginPath();
			GameController.ctx.arc( this.x, this.y, this.radius * 0.7, 0 , 2 * Math.PI, false );
			GameController.ctx.fill();
			GameController.ctx.stroke();
			
			GameController.ctx.drawImage( cached, this.currentX - this.radius, this.currentY - this.radius );
			
			
		};
		
		return TouchableJoystick;
	} )( TouchableArea );
	
	
	var TouchableCircle = ( function( __super ) {
		__extends( TouchableCircle, __super );
		
		function TouchableCircle( options )
		{
			for( var i in options )
			{
				if( i == 'x' )
					this[i] = GameController.getPixels( options[i], 'x' );
				else if( i == 'x' || i == 'radius' )
					this[i] = GameController.getPixels( options[i], 'y' );
				else
					this[i] = options[i];
			}
	
			this.draw();
		}
		
		/**
		 * No touch for this fella 
		 */
		TouchableCircle.prototype.check = function( touchX, touchY ) {
			return false;
		};
		
		TouchableCircle.prototype.draw = function() {
	
			// STYLING FOR BUTTONS
			GameController.ctx.fillStyle = 'rgba( 0, 0, 0, 0.5 )';
			
			// Actual joystick part that is being moved
			GameController.ctx.beginPath();
			GameController.ctx.arc( this.x, this.y, this.radius, 0 , 2 * Math.PI, false );
			GameController.ctx.fill();
	
		};
		
		return TouchableCircle;
	} )( TouchableArea );
	
	/**
	 * Shim for requestAnimationFrame 
	 */
	( function() {
	  if (typeof module !== "undefined") return
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x )
		{
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
										 || window[vendors[x]+'CancelRequestAnimationFrame'];
		}
	 
		if ( !window.requestAnimationFrame )
			window.requestAnimationFrame = function( callback, element ) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
				var id = window.setTimeout( function() { callback(currTime + timeToCall); }, 
					timeToCall );
				lastTime = currTime + timeToCall;
				return id;
			};
	 
		if ( !window.cancelAnimationFrame )
			window.cancelAnimationFrame = function( id ) {
				clearTimeout( id );
			};
	}() );
} )(typeof module !== "undefined" ? module.exports : window)
