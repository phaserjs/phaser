var DrawCommand = require('../commands/DrawCommand');
var UpdateBufferResourceCommand = require('../commands/UpdateBufferResourceCommand');
var UntexturedAndTintedShader = require('../shaders/UntexturedAndTintedShader');
var GL = require('../GL');
var TransformMatrix = require('../../../components/TransformMatrix');
var GlobalCommandList = require('../../GlobalCommandList');

var ShapeRenderer = function (game, maxSprites, commandList) 
{
    // Vertex Structure
    // ---------------------
    // struct Vertex {
    //     float32 a_position[2];   // 8 bytes
    //     uint32 a_color;          // 4 bytes
    //     float32 a_alpha;         // 4 bytes
    // };
    // ---------------------

    // Internal use
    this.vertexSize = 16;
    this.maxVertices = 6 * (maxSprites !== undefined ? maxSprites : 1);
    this.vertexCount = 0;
    this.bufferResource = new ArrayBuffer(this.maxVertices * this.vertexSize);
    this.float32View = new Float32Array(this.bufferResource);
    this.uint32View = new Uint32Array(this.bufferResource);
    this.tempMatrix = new TransformMatrix();

    // Save resource manager and command list
    this.resourceManager = game.renderDevice.resourceManager;
    this.commandList = commandList !== undefined ? commandList : GlobalCommandList.commandList;

    // Resource Creation
    this.drawCommand = new DrawCommand();
    this.updateBufferResourceCommand = new UpdateBufferResourceCommand();
    this.shaderPipeline = this.resourceManager.createShaderPipeline('UntexturedAndTintedShader', UntexturedAndTintedShader);
    this.vertexBuffer = this.resourceManager.createBuffer(GL.ARRAY_BUFFER, this.bufferResource, GL.STREAM_DRAW);
    this.outputStage = this.resourceManager.createOutputStage();

    // Setup output stage
    this.outputStage.enableBlending = true;
    this.outputStage.setDefaultBlending();

    // Vertex Attribute Definition
    this.vertexBuffer.setInputElement(0, 2, GL.FLOAT, false, this.vertexSize, 0);
    this.vertexBuffer.setInputElement(1, 4, GL.UNSIGNED_BYTE, true, this.vertexSize, 8);
    this.vertexBuffer.setInputElement(2, 1, GL.FLOAT, false, this.vertexSize, 12);

    // Draw call setup
    this.drawCommand.setTopology(GL.TRIANGLES);
    this.drawCommand.setShaderPipeline(this.shaderPipeline);
    this.drawCommand.setOutputStage(this.outputStage);
    this.drawCommand.setVertexBuffer(this.vertexBuffer);
    this.drawCommand.setVertexCount(0, 0);

    // Update buffer resource setup
    this.updateBufferResourceCommand.setBuffer(this.vertexBuffer);
    this.updateBufferResourceCommand.setBufferData(this.bufferResource, 0);

    // Set Clipping Martrix
    this.setClippingRect(
        game.config.width * game.config.resolution, 
        game.config.height * game.config.resolution
    );
};

ShapeRenderer.prototype.constructor = ShapeRenderer;

ShapeRenderer.prototype = {

    setClippingRect: function (w, h)
    {
        this.shaderPipeline.setConstantMatrix4x4(
            this.shaderPipeline.getUniformLocation('u_view_matrix'),
            new Float32Array([
                2 / w, 0, 0, 0,
                0, -2 / h, 0, 0,
                0, 0, 1, 1,
                -1, 1, 0, 0
            ])
        );
    },

    begin: function ()
    {
        this.vertexCount = 0;
    },

    end: function ()
    {
        this.drawCommand.setVertexCount(0, this.vertexCount);
        this.commandList.addCommand(this.updateBufferResourceCommand);
        this.commandList.addCommand(this.drawCommand);
    },

    render: function (gameObject, camera)
    {
        
    }

};

module.exports = ShapeRenderer;
