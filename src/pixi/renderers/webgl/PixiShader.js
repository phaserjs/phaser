/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


PIXI.PixiShader = function()
{
	// the webGL program..
	this.program;
	
	this.fragmentSrc = [
	  "precision lowp float;",
	  "varying vec2 vTextureCoord;",
	  "varying float vColor;",
	  "uniform sampler2D uSampler;",
	  "void main(void) {",
	    "gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;",
	  "}"
	];
	
}

PIXI.PixiShader.prototype.init = function()
{
	var program = PIXI.compileProgram(this.vertexSrc || PIXI.PixiShader.defaultVertexSrc, this.fragmentSrc)
	
	var gl = PIXI.gl;

    gl.useProgram(program);
	
	// get and store the uniforms for the shader
	this.uSampler = gl.getUniformLocation(program, "uSampler");
	this.projectionVector = gl.getUniformLocation(program, "projectionVector");
	this.offsetVector = gl.getUniformLocation(program, "offsetVector");
    //this.dimensions = gl.getUniformLocation(this.program, "dimensions");
    
    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
	this.colorAttribute = gl.getAttribLocation(program, "aColor");
	this.aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");
	  
    // add those custom shaders!
    for (var key in this.uniforms)
    {
       
    	// get the uniform locations..
	//	program[key] = 
        this.uniforms[key].uniformLocation = gl.getUniformLocation(program, key);

      
    }
  
	this.program = program;
}

PIXI.PixiShader.prototype.syncUniforms = function()
{
	var gl = PIXI.gl;
	
	for (var key in this.uniforms) 
    {
    	//var 
    	var type = this.uniforms[key].type;
    	
    	// need to grow this!

/*
    http://www.khronos.org/registry/webgl/specs/latest/1.0/
    http://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf

    void uniform1f(WebGLUniformLocation? location, GLfloat x);
    void uniform1fv(WebGLUniformLocation? location, Float32Array v);
    void uniform1fv(WebGLUniformLocation? location, sequence<GLfloat> v);
    void uniform1i(WebGLUniformLocation? location, GLint x);
    void uniform1iv(WebGLUniformLocation? location, Int32Array v);
    void uniform1iv(WebGLUniformLocation? location, sequence<long> v);
    void uniform2f(WebGLUniformLocation? location, GLfloat x, GLfloat y);
    void uniform2fv(WebGLUniformLocation? location, Float32Array v);
    void uniform2fv(WebGLUniformLocation? location, sequence<GLfloat> v);
    void uniform2i(WebGLUniformLocation? location, GLint x, GLint y);
    void uniform2iv(WebGLUniformLocation? location, Int32Array v);
    void uniform2iv(WebGLUniformLocation? location, sequence<long> v);
    void uniform3f(WebGLUniformLocation? location, GLfloat x, GLfloat y, GLfloat z);
    void uniform3fv(WebGLUniformLocation? location, Float32Array v);
    void uniform3fv(WebGLUniformLocation? location, sequence<GLfloat> v);
    void uniform3i(WebGLUniformLocation? location, GLint x, GLint y, GLint z);
    void uniform3iv(WebGLUniformLocation? location, Int32Array v);
    void uniform3iv(WebGLUniformLocation? location, sequence<long> v);
    void uniform4f(WebGLUniformLocation? location, GLfloat x, GLfloat y, GLfloat z, GLfloat w);
    void uniform4fv(WebGLUniformLocation? location, Float32Array v);
    void uniform4fv(WebGLUniformLocation? location, sequence<GLfloat> v);
    void uniform4i(WebGLUniformLocation? location, GLint x, GLint y, GLint z, GLint w);
    void uniform4iv(WebGLUniformLocation? location, Int32Array v);
    void uniform4iv(WebGLUniformLocation? location, sequence<long> v);

    void uniformMatrix2fv(WebGLUniformLocation? location, GLboolean transpose, Float32Array value);
    void uniformMatrix2fv(WebGLUniformLocation? location, GLboolean transpose, sequence<GLfloat> value);
    void uniformMatrix3fv(WebGLUniformLocation? location, GLboolean transpose, Float32Array value);
    void uniformMatrix3fv(WebGLUniformLocation? location, GLboolean transpose, sequence<GLfloat> value);
    void uniformMatrix4fv(WebGLUniformLocation? location, GLboolean transpose, Float32Array value);
    void uniformMatrix4fv(WebGLUniformLocation? location, GLboolean transpose, sequence<GLfloat> value);
*/

    	if(type == "f")
    	{
			gl.uniform1f(this.uniforms[key].uniformLocation, this.uniforms[key].value);
    	}
    	if(type == "f2")
    	{
			gl.uniform2f(this.uniforms[key].uniformLocation, this.uniforms[key].value.x, this.uniforms[key].value.y);
    	}
        else if(type == "f3")
        {
            gl.uniform3f(this.uniforms[key].uniformLocation, this.uniforms[key].value.x, this.uniforms[key].value.y, this.uniforms[key].value.z);
        }
        else if(type == "f3v")
        {
            gl.uniform3fv(this.uniforms[key].uniformLocation, this.uniforms[key].value);
        }
        else if(type == "f4")
        {
            gl.uniform4fv(this.uniforms[key].uniformLocation, this.uniforms[key].value);
        }
    	else if(type == "mat4")
    	{
    		gl.uniformMatrix4fv(this.uniforms[key].uniformLocation, false, this.uniforms[key].value);
    	}
    	else if(type == "sampler2D")
    	{
            var texture = this.uniforms[key].value.baseTexture._glTexture;
    		var image = this.uniforms[key].value.baseTexture.source;
            var format = gl.RGBA;

            if (this.uniforms[key].format && this.uniforms[key].format == 'luminance')
            {
                format = gl.LUMINANCE;
            }

            gl.activeTexture(gl.TEXTURE1);

            if (this.uniforms[key].wrap)
            {
                if (this.uniforms[key].wrap == 'no-repeat' || this.uniforms[key].wrap === false)
                {
                    this.createGLTextureLinear(gl, image, texture);
                }
                else if (this.uniforms[key].wrap == 'repeat' || this.uniforms[key].wrap === true)
                {
                    this.createGLTexture(gl, image, format, texture);
                }
                else if (this.uniforms[key].wrap == 'nearest-repeat')
                {
                    this.createGLTextureNearestRepeat(gl, image, texture);
                }
                else if (this.uniforms[key].wrap == 'nearest')
                {
                    this.createGLTextureNearest(gl, image, texture);
                }
                else if (this.uniforms[key].wrap == 'audio')
                {
                    this.createAudioTexture(gl, texture);
                }
                else if (this.uniforms[key].wrap == 'keyboard')
                {
                    this.createKeyboardTexture(gl, texture);
                }
            }
            else
            {
                this.createGLTextureLinear(gl, image, texture);
            }

            gl.uniform1i(this.uniforms[key].uniformLocation, 1);
    		
    		// activate texture..
    		// gl.uniformMatrix4fv(this.program[key], false, this.uniforms[key].value);
    		// gl.uniformMatrix4fv(this.program[key], false, this.uniforms[key].value);
    	}
    }
    
};

PIXI.PixiShader.prototype.createGLTexture = function(gl, image, format, texture)
{
    gl.bindTexture(   gl.TEXTURE_2D, texture);
    gl.pixelStorei(   gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(    gl.TEXTURE_2D, 0, format, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.generateMipmap(gl.TEXTURE_2D);
}

PIXI.PixiShader.prototype.createGLTextureLinear = function(gl, image, texture)
{
    gl.bindTexture(  gl.TEXTURE_2D, texture);
    gl.pixelStorei(  gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(   gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

PIXI.PixiShader.prototype.createGLTextureNearestRepeat = function(gl, image, texture)
{
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
}

PIXI.PixiShader.prototype.createGLTextureNearest = function(gl, image, texture)
{
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

PIXI.PixiShader.prototype.createAudioTexture = function(gl, texture)
{
    gl.bindTexture(   gl.TEXTURE_2D, texture );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE) ;
    gl.texImage2D(    gl.TEXTURE_2D, 0, gl.LUMINANCE, 512, 2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, null);
}

PIXI.PixiShader.prototype.createKeyboardTexture = function(gl, texture)
{
    gl.bindTexture(   gl.TEXTURE_2D, texture );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE) ;
    gl.texImage2D(    gl.TEXTURE_2D, 0, gl.LUMINANCE, 256, 2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, null);
}

PIXI.PixiShader.defaultVertexSrc = [
  "attribute vec2 aVertexPosition;",
  "attribute vec2 aTextureCoord;",
  "attribute float aColor;",
  
  "uniform vec2 projectionVector;",
 "uniform vec2 offsetVector;",
  "varying vec2 vTextureCoord;",
  
  "varying float vColor;",

  "const vec2 center = vec2(-1.0, 1.0);",
  "void main(void) {",
    "gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);",
    "vTextureCoord = aTextureCoord;",
    "vColor = aColor;",
  "}"
];
