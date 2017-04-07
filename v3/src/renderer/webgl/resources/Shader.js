var Shader = function(name, gl, program, vertexShader, fragmentShader) 
{
    this.gl = gl;
    this.program = program;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.name = name;
};

Shader.prototype.constructor = Shader;

/* For WebGL2 this won't be necessary */
Shader.prototype = {

    getUniformLocation: function(name) 
    {
        return this.gl.getUniformLocation(this.program, name);
    },

    getAttribLocation: function (name)
    {
        return this.gl.getAttribLocation(this.program, name);
    },  

    setConstantFloat1: function(location, x) 
    {
        this.gl.useProgram(this.program);
        this.gl.uniform1f(location, x);
        return this;
    },
    
    setConstantFloat2: function(location, x, y) 
    {
        this.gl.useProgram(this.program);
        this.gl.uniform2f(location, x, y);
        return this;
    },
    
    setConstantFloat3: function(location, x, y, z) {
        this.gl.useProgram(this.program);
        this.gl.uniform3f(location, x, y, z);
        return this;
    },
    
    setConstantFloat4: function(location, x, y, z, w) {
        this.gl.useProgram(this.program);
        this.gl.uniform4f(location, x, y, z, w);
        return this;
    },
    
    setConstantInt1: function(location, x) {
        this.gl.useProgram(this.program);
        this.gl.uniform1i(location, x);
        return this;
    },
    
    setConstantInt2: function(location, x, y) {
        this.gl.useProgram(this.program);
        this.gl.uniform2i(location, x, y);
        return this;
    },
    
    setConstantInt3: function(location, x, y, z) {
        this.gl.useProgram(this.program);
        this.gl.uniform3i(location, x, y, z);
        return this;
    },
    
    setConstantInt4: function(location, x, y, z, w) {
        this.gl.useProgram(this.program);
        this.gl.uniform4i(location, x, y, z, w);
        return this;
    },
    
    setConstantMatrix2x2: function(location, floatArray) {
        this.gl.useProgram(this.program);
        this.gl.uniformMatrix2fv(location, false, floatArray);
        return this;
    },
    
    setConstantMatrix3x3: function(location, floatArray) {
        this.gl.useProgram(this.program);
        this.gl.uniformMatrix3fv(location, false, floatArray);
        return this;
    },
    
    setConstantMatrix4x4: function(location, floatArray) {
        this.gl.useProgram(this.program);
        this.gl.uniformMatrix4fv(location, false, floatArray);
        return this;
    },

    bind: function ()
    {
        this.gl.useProgram(this.program);
        return this;
    }
    
};

module.exports = Shader;
