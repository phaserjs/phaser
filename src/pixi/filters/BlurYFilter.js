/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */



PIXI.BlurYFilter = function()
{
	PIXI.AbstractFilter.call( this );
	
	this.passes = [this];
	
	// set the uniforms
	this.uniforms = {
		blur: {type: 'f', value: 1/512},
	};
	
	this.fragmentSrc = [
	  "precision mediump float;",
	  "varying vec2 vTextureCoord;",
	  "varying float vColor;",
	  "uniform float blur;",
	  "uniform sampler2D uSampler;",
	    "void main(void) {",
	  	"vec4 sum = vec4(0.0);",

	  	"sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 4.0*blur)) * 0.05;",
	    "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 3.0*blur)) * 0.09;",
	    "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 2.0*blur)) * 0.12;",
	    "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - blur)) * 0.15;",
	    "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;",
	    "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + blur)) * 0.15;",
	    "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 2.0*blur)) * 0.12;",
	    "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 3.0*blur)) * 0.09;",
	    "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 4.0*blur)) * 0.05;",
	 
		"gl_FragColor = sum;",

	  "}"
	];
}

PIXI.BlurYFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.BlurYFilter.prototype.constructor = PIXI.BlurYFilter;

Object.defineProperty(PIXI.BlurYFilter.prototype, 'blur', {
    get: function() {
        return this.uniforms.blur.value / (1/7000);
    },
    set: function(value) {
    	//this.padding = value;
    	this.uniforms.blur.value = (1/7000) * value;
    }
});
