var Shader = function(name, gl, program, vertexShader, fragmentShader) 
{
    this.context = gl;
    this.program = program;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.name = name;
};

Shader.prototype.constructor = Shader;

/* For WebGL2 this won't be necessary because of UBOs */
Shader.prototype = {

    getUniformLocation: function(name) 
    {
        return this.context.getUniformLocation(this.program, name);
    },

    setConstantFloat1: function(location, x) 
    {
        this.context.useProgram(this.program);
        this.context.uniform1f(location, x);
        return this;
    },
    
    setConstantFloat2: function(location, x, y) 
    {
        this.context.useProgram(this.program);
        this.context.uniform2f(location, x, y);
        return this;
    },
    
    setConstantFloat3: function(location, x, y, z) 
    {
        this.context.useProgram(this.program);
        this.context.uniform3f(location, x, y, z);
        return this;
    },
    
    setConstantFloat4: function(location, x, y, z, w) 
    {
        this.context.useProgram(this.program);
        this.context.uniform4f(location, x, y, z, w);
        return this;
    },
    
    setConstantInt1: function(location, x) 
    {
        this.context.useProgram(this.program);
        this.context.uniform1i(location, x);
        return this;
    },
    
    setConstantInt2: function(location, x, y) 
    {
        this.context.useProgram(this.program);
        this.context.uniform2i(location, x, y);
        return this;
    },
    
    setConstantInt3: function(location, x, y, z) 
    {
        this.context.useProgram(this.program);
        this.context.uniform3i(location, x, y, z);
        return this;
    },
    
    setConstantInt4: function(location, x, y, z, w) 
    {
        this.context.useProgram(this.program);
        this.context.uniform4i(location, x, y, z, w);
        return this;
    },
    
    setConstantMatrix2x2: function(location, floatArray) 
    {
        this.context.useProgram(this.program);
        this.context.uniformMatrix2fv(location, false, floatArray);
        return this;
    },
    
    setConstantMatrix3x3: function(location, floatArray) 
    {
        this.context.useProgram(this.program);
        this.context.uniformMatrix3fv(location, false, floatArray);
        return this;
    },
    
    setConstantMatrix4x4: function(location, floatArray) 
    {
        this.context.useProgram(this.program);
        this.context.uniformMatrix4fv(location, false, floatArray);
        return this;
    }
    
};

module.exports = Shader;