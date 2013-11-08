/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/fun/dotscreen.js
 */

/**
 * 
 * This filter applies a pixlate effect making display objects appear "blocky"
 * @class PixelateFilter
 * @contructor
 */
PIXI.DotScreenFilter = function()
{
	PIXI.AbstractFilter.call( this );

	this.passes = [this];
	
	// set the uniforms
	this.uniforms = {
		scale: {type: 'f', value:1},
		angle: {type: 'f', value:5},
		dimensions:   {type: 'f4', value:[0,0,0,0]}
	};

	this.fragmentSrc = [
	  "precision mediump float;",
	  "varying vec2 vTextureCoord;",
	  "varying float vColor;",
	  "uniform vec4 dimensions;",
	  "uniform sampler2D uSampler;",

	    "uniform float angle;",
	    "uniform float scale;",

	    "float pattern() {",
	    	"float s = sin(angle), c = cos(angle);",
	    	"vec2 tex = vTextureCoord * dimensions.xy;",
	    	"vec2 point = vec2(",
	    		"c * tex.x - s * tex.y,",
	    		"s * tex.x + c * tex.y",
	    	") * scale;",
	    	"return (sin(point.x) * sin(point.y)) * 4.0;",
	    "}",

	    "void main() {",
            "vec4 color = texture2D(uSampler, vTextureCoord);",
            "float average = (color.r + color.g + color.b) / 3.0;",
            "gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);",
        "}",
	];
}

PIXI.DotScreenFilter.prototype = Object.create( PIXI.DotScreenFilter.prototype );
PIXI.DotScreenFilter.prototype.constructor = PIXI.DotScreenFilter;

/**
 * 
 * This describes the the scale
 * @property scale
 * @type Number
 */
Object.defineProperty(PIXI.DotScreenFilter.prototype, 'scale', {
    get: function() {
        return this.uniforms.scale.value;
    },
    set: function(value) {
    	this.dirty = true;
    	this.uniforms.scale.value = value;
    }
});

/**
 * 
 * This radius describes angle
 * @property angle
 * @type Number
 */
Object.defineProperty(PIXI.DotScreenFilter.prototype, 'angle', {
    get: function() {
        return this.uniforms.angle.value;
    },
    set: function(value) {
    	this.dirty = true;
    	this.uniforms.angle.value = value;
    }
});