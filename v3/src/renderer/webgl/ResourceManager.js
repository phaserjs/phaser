var Resources = require('./resources');

var ResourceManager = function (gl) 
{
    this.gl = gl;
    /* Maybe add pooling here */
    this.shaderCache = {};
    this.shaderCount = 0;
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

        gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferObject)

        if (depthStencilBuffer !== undefined && depthStencilBuffer !== null) 
        {
            depthStencilBuffer.isRenderTexture = true;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, depthStencilBuffer.texture, depthStencilBuffer.mipLevel);
        }
        else
        {
            depthStencilRenderbufferObject = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilRenderbufferObject);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depthStencilRenderbufferObject);
        }

        if (colorBuffer !== undefined && colorBuffer !== null) 
        {
            colorBuffer.isRenderTexture = true;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorBuffer.texture, colorBuffer.mipLevel);
        } 
        else
        {
            colorRenderbufferObject = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, colorRenderbufferObject);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA4, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, colorRenderbufferObject);
        }

        complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

        if (complete !== gl.FRAMEBUFFER_COMPLETE) 
        {
            var errors = {
                36054: 'Incomplete Attachment',
                36055: 'Missing Attachment',
                36057: 'Incomplete Dimensions',
                36061: 'Framebuffer Unsupported'
            };
            throw new Error('Framebuffer incomplete. Framebuffer status: ' + errors[complete]);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

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
            case gl.ARRAY_BUFFER:
                return new Resources.VertexBuffer(gl, bufferObject);
            case gl.ELEMENT_ARRAY_BUFFER:
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

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);

        if (pixels === null || pixels === undefined) 
        {
            gl.texImage2D(gl.TEXTURE_2D, mipLevel, format, width, height, 0, format, gl.UNSIGNED_BYTE, null);
        } 
        else 
        {
            gl.texImage2D(gl.TEXTURE_2D, mipLevel, format, format, gl.UNSIGNED_BYTE, pixels);
            width = pixels.width;
            height = pixels.height;
        }
        gl.bindTexture(gl.TEXTURE_2D, null);

        return new Resources.Texture(texture, width, height);
    },

    createShader: function (shaderName, shaderSources) 
    {
        if (shaderName === null || shaderName === undefined)
        {
            shaderName += 'Shader' + this.shaderCount;
            this.shaderCount += 1;
        }
        if (!(shaderName in this.shaderCache))
        {
            var gl = this.gl;
            var program;
            var vertShader;
            var fragShader;
            var status;
            var error;
            var shader;

            vertShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertShader, shaderSources.vert);
            gl.compileShader(vertShader);

            error = gl.getShaderInfoLog(vertShader);
            status = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);

            if (!status && error && error.length > 0) 
            {
                throw new Error('Vertex Shader Compilation Error. Shader name: ' + shaderName + '.\n' + error + '\n\n Shader source:\n' + shaderSources.vert);
            }
            else if (error && error.length > 0)
            {
                console.warn('Vertex Shader Compilation Warning. Shader name: ' + shaderName + '.\n' + error + '\n\n Shader source:\n' + shaderSources.vert);
            }

            fragShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragShader, shaderSources.frag);
            gl.compileShader(fragShader);

            error = gl.getShaderInfoLog(fragShader);
            status = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);

            if (!status && error && error.length > 0) 
            {
                throw new Error('Fragment Shader Compilation Error. Shader name: ' + shaderName + '.\n' + error + '\n\n Shader source:\n' + shaderSources.frag);
            }
            else if (error && error.length > 0)
            {
                console.warn('Fragment Shader Compilation Warning. Shader name: ' + shaderName + '.\n' + error + '\n\n Shader source:\n' + shaderSources.frag);
            }

            program = gl.createProgram();
            gl.attachShader(program, vertShader);
            gl.attachShader(program, fragShader);
            gl.linkProgram(program);
            gl.validateProgram(program);

            error = gl.getProgramParameter(program, gl.LINK_STATUS);

            if (error === 0)
            {
                error = gl.getProgramInfoLog(program);

                throw new Error('Program Linking Error. Shader name: ' + shaderName + '.\n' + error);
            }
            
            error = gl.getProgramParameter(program, gl.VALIDATE_STATUS);
            if (error === 0)
            {
                error = gl.getProgramInfoLog(program);
                throw new Error('Program Validation Error. Shader name: ' + shaderName + '.\n' + error);
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
