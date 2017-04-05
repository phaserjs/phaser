var Resources = require('./resources');
var GL = require('./GL');

var ResourceManager = function (gl) 
{
    this.gl = gl;
    /* Maybe add pooling here */
    this.shaderCache = {};
};

ResourceManager.prototype.constructor = ResourceManager;

ResourceManager.prototype = {

    createRenderTarget: function (width, height, colorBuffer, depthStencilBuffer) 
    {
        var gl = this.gl;
        var framebufferObject = gl.createFramebuffer();
        var depthStencilRenderbufferObject = null;
        var colorRenderbufferObject = null;
        var complete = 0;

        gl.bindFramebuffer(GL.FRAMEBUFFER, framebufferObject)

        if (depthStencilBuffer !== undefined && depthStencilBuffer !== null) 
        {
            depthStencilBuffer.isRenderTexture = true;
            gl.framebufferTexture2D(GL.FRAMEBUFFER, GL.DEPTH_STENCIL_ATTACHMENT, GL.TEXTURE_2D, depthStencilBuffer.texture, depthStencilBuffer.mipLevel);
        }
        else
        {
            depthStencilRenderbufferObject = gl.createRenderbuffer();
            gl.bindRenderbuffer(GL.RENDERBUFFER, depthStencilRenderbufferObject);
            gl.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_STENCIL, width, height);
            gl.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_STENCIL_ATTACHMENT, GL.RENDERBUFFER, depthStencilRenderbufferObject);
        }

        if (colorBuffer !== undefined && colorBuffer !== null) 
        {
            colorBuffer.isRenderTexture = true;
            gl.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, colorBuffer.texture, colorBuffer.mipLevel);
        } 
        else
        {
            colorRenderbufferObject = gl.createRenderbuffer();
            gl.bindRenderbuffer(GL.RENDERBUFFER, colorRenderbufferObject);
            gl.renderbufferStorage(GL.RENDERBUFFER, GL.RGBA4, width, height);
            gl.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.RENDERBUFFER, colorRenderbufferObject);
        }

        complete = gl.checkFramebufferStatus(GL.FRAMEBUFFER);

        if (complete !== GL.FRAMEBUFFER_COMPLETE) 
        {
            var errors = {
                36054: 'Incomplete Attachment',
                36055: 'Missing Attachment',
                36057: 'Incomplete Dimensions',
                36061: 'Framebuffer Unsupported'
            };

            throw new Error('Framebuffer incomplete. Framebuffer status: ' + errors[complete]);
        }

        gl.bindFramebuffer(GL.FRAMEBUFFER, null);

        return new Resources.RenderTarget(
            framebufferObject,
            width, height,
            (colorBuffer === undefined ? null : colorBuffer),
            (depthStencilBuffer === undefined ? null : depthStencilBuffer)
        );
    },

    createBuffer: function (target, initialDataOrSize, bufferUsage) 
    {
        var gl = this.gl;
        var bufferObject = gl.createBuffer();
        gl.bindBuffer(target, bufferObject);
        gl.bufferData(target, initialDataOrSize, bufferUsage);

        switch (target) 
        {
            case GL.ARRAY_BUFFER:
                return new Resources.VertexBuffer(gl, bufferObject);
            case GL.ELEMENT_ARRAY_BUFFER:
                return new Resources.IndexBuffer(gl, bufferObject);
            default:
                throw new Error('Invalid Buffer Target');
        }

        return null;
    },

    createTexture: function (mipLevel, minFilter, magFilter, wrapT, wrapS, format, pixels, width, height) 
    {
        var gl = this.gl;
        var texture = gl.createTexture();

        gl.bindTexture(GL.TEXTURE_2D, texture);
        gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, wrapT);

        if (pixels === null || pixels === undefined) 
        {
            gl.texImage2D(GL.TEXTURE_2D, mipLevel, format, width, height, 0, format, GL.UNSIGNED_BYTE, null);
        } 
        else 
        {
            gl.texImage2D(GL.TEXTURE_2D, mipLevel, format, format, GL.UNSIGNED_BYTE, pixels);
            width = pixels.width;
            height = pixels.height;
        }

        return new Resources.Texture(texture, width, height);
    },

    createShader: function (shaderName, shaderSources) 
    {
        if (!(shaderName in this.shaderCache))
        {
            var gl = this.gl;
            var program = gl.createProgram();
            var vertShader = gl.createShader(GL.VERTEX_SHADER);
            var fragShader = gl.createShader(GL.FRAGMENT_SHADER);
            var error;
            var shader;

            gl.shaderSource(vertShader, shaderSources.vert);
            gl.shaderSource(fragShader, shaderSources.frag);

            gl.compileShader(vertShader);
            gl.compileShader(fragShader);

            error = gl.getShaderInfoLog(vertShader);

            if (error.length > 0) 
            {
                throw new Error('Vertex Shader Compilation Error.\n' + error);
            }

            error = gl.getShaderInfoLog(fragShader);

            if (error.length > 0) 
            {
                throw new Error('Fragment Shader Compilation Error.\n' + error);
            }

            gl.attachShader(program, vertShader);
            gl.attachShader(program, fragShader);
            gl.linkProgram(program);

            error = gl.getProgramParameter(program, GL.LINK_STATUS);

            if (error === 0)
            {
                error = gl.getProgramInfoLog(program);

                throw new Error('Program Linking Error.\n' + error);
            }

            shader = new Resources.Shader(shaderName, gl, program, vertShader, fragShader);
            this.shaderCache[shaderName] = shader;
            return  shader;
        }
        else
        {
            return this.shaderCache[shaderName];   
        }
    },

    createOutputStage: function () 
    {
        var outputStage = new Resources.OutputStage();

        outputStage.setDefaultDepthStencilState();
        outputStage.setNoBlending();

        return outputStage;
    },

    deleteShader: function (shader)
    {
        var storedShader = this.shaderCache[shader.name]
        var gl = this.gl;
        if (storedShader !== undefined)
        {
            delete this.shaderCache;
        }
        gl.deleteShader(shader.vertexShader);
        gl.deleteShader(shader.fragmentShader);
        gl.deleteProgram(shader.program);
        shader.vertexShader = null;
        shader.fragmentShader = null;
        shader.program = null;
        shader.name = null;
    },

    deleteBuffer: function (buffer)
    {
        var gl = this.gl;

        gl.deleteBuffer(buffer.bufferObject);
    }

};

module.exports = ResourceManager;
