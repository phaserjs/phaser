var Class = require('../../../utils/Class');

var Pipeline = new Class({

	initialize: 

	function Pipeline(config)
	{

		this.name = config.name;
		this.game = config.game;
		this.view = config.game.canvas;
		this.resolution = config.game.config.resolution;
		this.width = config.game.config.width * this.resolution;
		this.height = config.game.config.height * this.resolution;
		this.glContext = config.gl;
		this.vertexCount = 0;
		this.vertexCapacity = config.vertexCapacity;
		this.manager = config.manager;
		this.resources = config.manager.resourceManager;
		this.vertexData = new ArrayBuffer(config.vertexCapacity * config.vertexSize);
		this.vertexBuffer = null;
		this.program = null;
		this.vertexLayout = config.vertexLayout;
		this.vertexSize = config.vertexSize;
		this.currentRenderTarget = null;
		this.currentProgram = null;
		this.topology = config.topology;
		
		// Initialize Shaders and Buffers
		{
			var gl = this.glContext;
			var resources = this.resources;
			var vertexSize = this.vertexSize;
			var vertexLayout = this.vertexLayout;
			var program = resources.createShader(this.name, config.shader);
			var vertexBuffer = resources.createBuffer(gl.ARRAY_BUFFER, this.vertexCapacity, gl.STREAM_DRAW);

			for (var key in vertexLayout)
			{
				var element = vertexLayout[key];

				vertexBuffer.addAttribute(
					program.getAttribLocation(key),
					element.size,
					element.type,
					element.normalize,
					vertexSize,
					element.offset
				);
			}

			this.vertexBuffer = vertexBuffer;
			this.program = program;
		}
	},

	beginDraw: function (renderTarget, program)
	{
		if (this.currentRenderTarget !== null ||
			this.currentProgram !== null)
		{
			this.draw();
			this.endDraw();
		}

		this.currentRenderTarget = (renderTarget || null);
		this.currentProgram = (program || this.program);
		this.currentProgram.bind();
		this.vertexBuffer.bind();

		gl.bindFramebuffer(gl.FRAMEBUFFER, this.currentRenderTarget.framebufferObject);

		return this;
	},

	draw: function ()
	{
		var gl = this.glContext;
		var vertexCount = this.vertexCount;
		var vertexBuffer = this.vertexBuffer;
		var vertexData = this.vertexData;
		var topology = this.topology;

		if (vertexCount === 0) return;

		vertexBuffer.updateResource(vertexData, 0);
		gl.drawArrays(topology, 0, vertexCount);

		this.vertexCount = 0;

		return this;
	},

	endDraw: function ()
	{
		var renderTarget = this.currentRenderTarget;
		var program = this.currentProgram;

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		this.currentRenderTarget = null;
		this.program = null;
		this.vertexCount = 0;

		return this;
	},

	destroy: function ()
	{
		var resources = this.resources;

        resources.deleteShader(this.program);
		resources.deleteBuffer(this.vertexBuffer);

		this.program = null;
		this.vertexBuffer = null;

		return this;
	}

});

module.exports = BaseRenderer;
