var CompileShader = function (gl, shaderType, shaderSource)
{
    var shader = null;
    PHASER_ASSERT(shaderType === gl.VERTEX_SHADER || shaderType === gl.FRAGMENT_SHADER, 'Invalid Shader Type');
    shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    PHASER_ASSERT(gl.getShaderParameter(shader, gl.COMPILE_STATUS), 'Failed shader compilation. Error: \n' + gl.getShaderInfoLog(shader));
    return shader;
};

// Used by the constant buffer. Needed to simulate
// UBO
var ConstantElement = function (gl, shaderPipeline, descriptor)
{
    this.location = gl.getUniformLocation(shaderPipeline.programHandle, descriptor.name);
    this.transpose = descriptor.transpose ? true : false;
    this.dataReference = descriptor.dataReference;
    if (!ArrayBuffer.isView(this.dataReference))
    {
        console.error('Constant data reference must be a typed array.');
        return;
    }
    switch (descriptor.type)
    {
        case ConstantElement.TYPE_FLOAT:
            PHASER_ASSERT((this.dataReference instanceof Float32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniform1fv(this.location, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_INT:
            PHASER_ASSERT((this.dataReference instanceof Int32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniform1iv(this.location, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_BOOL:
            PHASER_ASSERT((this.dataReference instanceof Int32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniform1iv(this.location, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_FLOAT_VEC2:
            PHASER_ASSERT((this.dataReference instanceof Float32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniform2fv(this.location, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_INT_VEC2:
            PHASER_ASSERT((this.dataReference instanceof Int32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniform2iv(this.location, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_BOOL_VEC2:
            PHASER_ASSERT((this.dataReference instanceof Int32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniform2iv(this.location, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_FLOAT_VEC3:
            PHASER_ASSERT((this.dataReference instanceof Float32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniform3fv(this.location, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_INT_VEC3:
            PHASER_ASSERT((this.dataReference instanceof Int32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniform3iv(this.location, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_BOOL_VEC3:
            PHASER_ASSERT((this.dataReference instanceof Int32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniform3iv(this.location, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_FLOAT_VEC4:
            PHASER_ASSERT((this.dataReference instanceof Float32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniform4fv(this.location, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_INT_VEC4:
            PHASER_ASSERT((this.dataReference instanceof Int32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniform4iv(this.location, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_BOOL_VEC4:
            PHASER_ASSERT((this.dataReference instanceof Int32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniform4iv(this.location, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_MAT2:
            PHASER_ASSERT((this.dataReference instanceof Float32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniformMatrix2fv(this.location, this.transpose, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_MAT3:
            PHASER_ASSERT((this.dataReference instanceof Float32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniformMatrix3fv(this.location, this.transpose, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_MAT4:
            PHASER_ASSERT((this.dataReference instanceof Float32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniformMatrix4fv(this.location, this.transpose, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_SAMPLER_2D:
            PHASER_ASSERT((this.dataReference instanceof Int32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniform1iv(this.location, this.dataReference);
            };
            break;
        case ConstantElement.TYPE_SAMPLER_CUBE:
            PHASER_ASSERT((this.dataReference instanceof Int32Array), 'Invalid type for constant refenrece data');
            this.update = function ()
            {
                gl.uniform1iv(this.location, this.dataReference);
            };
            break;
    }
    if (descriptor.initialCopy) 
    {
        gl.useProgram(shaderPipeline.programHandle);
        this.update();
    }
};

ConstantElement.TYPE_FLOAT = 0;
ConstantElement.TYPE_INT = 1;
ConstantElement.TYPE_BOOL = 2;
ConstantElement.TYPE_FLOAT_VEC2 = 3;
ConstantElement.TYPE_INT_VEC2 = 4;
ConstantElement.TYPE_BOOL_VEC2 = 5;
ConstantElement.TYPE_FLOAT_VEC3 = 6;
ConstantElement.TYPE_INT_VEC3 = 7;
ConstantElement.TYPE_BOOL_VEC3 = 8;
ConstantElement.TYPE_FLOAT_VEC4 = 9;
ConstantElement.TYPE_INT_VEC4 = 10;
ConstantElement.TYPE_BOOL_VEC4 = 11;
ConstantElement.TYPE_MAT2 = 12;
ConstantElement.TYPE_MAT3 = 13;
ConstantElement.TYPE_MAT4 = 14;
ConstantElement.TYPE_SAMPLER_2D = 15;
ConstantElement.TYPE_SAMPLER_CUBE = 16;

// Describes a Constant buffer. This will try to
// simulate UBO.
var ConstantBuffer = function (gl, shaderPipeline, elementsDescArray)
{
    this.elements = [];
    for (var index = 0, length = elementsDescArray.length; index < length; ++index)
    {
        this.elements.push(new ConstantElement(gl, shaderPipeline, elementsDescArray[index]));
    }
    this.elementsCount = this.elements.length;
};

// Describes a Viewport
var Viewport = function (gl, descriptor)
{
    this.x = descriptor.x;
    this.y = descriptor.y;
    this.width = descriptor.width;
    this.height = descriptor.height;
    this.zNear = descriptor.zNear;
    this.zFar = descriptor.zFar;
};

// Describes a Shader Pipeline. This means a compiled and linked
// list of shaders
var ShaderPipeline = function (gl, descriptor)
{
    var program = gl.createProgram();
    var vertexShader = CompileShader(gl, gl.VERTEX_SHADER, descriptor.vertexShader);
    var fragmentShader = CompileShader(gl, gl.FRAGMENT_SHADER, descriptor.fragmentShader);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.validateProgram(program);
    PHASER_ASSERT(gl.getProgramParameter(program, gl.LINK_STATUS), 'Failed to link program. Error: \n' + gl.getProgramInfoLog(program));
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.programHandle = program;
};

// Describes a 2D texture. It'll contain it's own texture unit and dimensions
var Texture2D = function (gl, descriptor)
{
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, descriptor.wrapMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, descriptor.wrapMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, descriptor.filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, descriptor.filter);
    if (!ArrayBuffer.isView(descriptor.pixels))
    {
        gl.texImage2D(
            gl.TEXTURE_2D,
            descriptor.mipLevels,
            descriptor.internalFormat,
            descriptor.format,
            descriptor.type,
            descriptor.pixels
        );
    }
    else
    {
        gl.texImage2D(
            gl.TEXTURE_2D,
            descriptor.mipLevels,
            descriptor.internalFormat,
            descriptor.width,
            descriptor.height,
            descriptor.border,
            descriptor.format,
            descriptor.type,
            descriptor.pixels
        );
    }
    this.textureHandle = texture;
    this.unit = descriptor.unit;
    this.width = descriptor.width;
    this.height = descriptor.height;
};

// Describes a Vertex Buffer. It'll be used by the Vertex Input
var VertexBuffer = function (gl, descriptor)
{
    var buffer = gl.createBuffer();
    var bufferSize = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    if (descriptor.data && descriptor.initialCopy)
    {
        gl.bufferData(gl.ARRAY_BUFFER, descriptor.data, descriptor.usage);
        bufferSize = descriptor.data.byteLength;
    }
    else
    {
        gl.bufferData(gl.ARRAY_BUFFER, descriptor.bufferSize, descriptor.usage);
        bufferSize = descriptor.bufferSize;
    }
    this.bufferHandle = buffer;
    this.bufferSize = bufferSize;
};

// Describes a Index Buffer. It'll be used by the Vertex Input
var IndexBuffer = function (gl, descriptor)
{
    var buffer = gl.createBuffer();
    var bufferSize = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    if (descriptor.data && descriptor.initialCopy)
    {
        gl.bufferData(gl.ARRAY_BUFFER, descriptor.data, descriptor.usage);
        bufferSize = descriptor.data.byteLength;
    }
    else
    {
        gl.bufferData(gl.ARRAY_BUFFER, descriptor.bufferSize, descriptor.usage);
        bufferSize = descriptor.bufferSize;
    }
    this.bufferHandle = buffer;
    this.bufferSize = bufferSize;
    this.indexFormat = descriptor.indexFormat;
};

// Describes a Blend State. Functions, operations and equations.
var BlendState = function (gl, descriptor)
{
    this.enabled = descriptor.enabled;
    this.logicOperation = descriptor.logicOperation;
    this.rgbEquation = descriptor.rgbEquation;
    this.sourceRgb = descriptor.sourceRgb;
    this.destinationRgb = descriptor.destinationRgb;
    this.alphaEquation = descriptor.alphaEquation;
    this.sourceAlpha = descriptor.sourceAlpha;
    this.destinationAlpha = descriptor.destinationAlpha;
};

// Describes a Depth-Stencil State. Functions and operations
var DepthStencilState = function (gl, descriptor)
{
    this.stencilEnabled = descriptor.stencilEnabled;
    this.depthEnabled = descriptor.depthEnabled;
    this.depthFunction = descriptor.depthFunction;
    this.depthWriteMask = descriptor.depthWriteMask;
    this.stencilFunction = descriptor.stencilFunction;
    this.stencilFail = descriptor.stencilFail;
    this.stencilZFail = descriptor.stencilZFail;
    this.stencilZPass = descriptor.stencilZPass;
};

// Describes an Element Layout. Used by the Vertex Input.
// An element layout is how vertex attributes is display in GPU memory
var ElementLayout = function (gl, shaderPipeline, descriptor)
{
    this.location = gl.getAttribLocation(shaderPipeline.programHandle, descriptor.name);
    this.size = descriptor.size;
    this.offset = descriptor.offset;
    this.stride = descriptor.stride;
    this.format = descriptor.format;
};

// Describes a Input Layout. Input layout is a collection of element layout.
var InputLayout = function (gl, shaderPipeline, elementsDescArray)
{
    this.elements = [];
    for (var index = 0, length = elementsDescArray.length; index < length; ++index)
    {
        this.elements.push(new ElementLayout(gl, shaderPipeline, elementsDescArray[index]));
    }
    this.elementsCount = this.elements.length;
};

// Describes a Render Target. A render target has depth-stencil and color buffers
var RenderTarget = function (gl, descriptor) {};

// Describes a Vertex Input set. This is what WebGL will use to
// define how it handles vertex data. Vertex Input internally describes
// a primitive topology, vertex buffer, index buffer, input layout and
// a shader pipeline.
var VertexInput = function (gl, descriptor)
{
    var vertexBufferDescriptor = descriptor.vertexBuffer;
    var indexBufferDescriptor = descriptor.indexBuffer;
    var shaderPipelineDescriptor = descriptor.shaderPipeline;
    var inputLayoutDescriptor = descriptor.inputLayout;

    this.primitiveTopology = descriptor.primitiveTopology;
    this.vertexBuffer = vertexBufferDescriptor ? new VertexBuffer(gl, vertexBufferDescriptor) : null;
    this.indexBuffer = indexBufferDescriptor ? new IndexBuffer(gl, indexBufferDescriptor) : null;
    this.shaderPipeline = shaderPipelineDescriptor ? new ShaderPipeline(gl, shaderPipelineDescriptor) : null;
    this.inputLayout = inputLayoutDescriptor ? new InputLayout(gl, this.shaderPipeline, inputLayoutDescriptor) : null;
};

// Describes a Pipeline State. This is uploaded once to the GPU with
// vertex input, viewport, blend and depth-stencil states.
// Pipeline states are fixed states. This will reduce the need to sync
// GL states with GPU. This would give the potential of future optimizations
// like designing a pararllel renderer using a stateless render queue by simply
// passing a state-stamp with the draw call commands.
var PipelineState = function (gl, descriptor)
{
    var vertexInputDescriptor = descriptor.vertexInput;
    var viewportDescriptor = descriptor.viewport;
    var blendStateDescriptor = descriptor.blendState;
    var depthStencilStateDescriptor = descriptor.depthStencilState;
    var constantBufferDescriptor = descriptor.constantBuffer;

    this.vertexInput = vertexInputDescriptor ? new VertexInput(gl, vertexInputDescriptor) : null;
    this.viewport = viewportDescriptor ? new Viewport(gl, viewportDescriptor) : null;
    this.blendState = blendStateDescriptor ? new BlendState(gl, blendStateDescriptor) : null;
    this.depthStencilState = depthStencilStateDescriptor ? new DepthStencilState(gl, depthStencilStateDescriptor) : null;
    this.constantBuffer = constantBufferDescriptor ? new ConstantBuffer(gl, this.vertexInput.shaderPipeline, constantBufferDescriptor) : null;
};
