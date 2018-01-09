var Class = require('../../../utils/Class');

var BaseRenderer = new Class({

	initialize: 

	function BaseRenderer(config)
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
		this.topology = config.gl.TRIANGLES;
		this.viewMatrix = new Float32Array([
			+2.0 / this.width,
			+0.0,	
			+0.0,
			+0.0,
			
			+0.0,
			-2.0 / this.height,
			+0.0,
			+0.0,

			+0.0,
			+0.0,
			+1.0,
			+1.0,

			-1.0,
			+1.0,
			+0.0,
			+0.0
		]);
	
		this.init(config);

	},

	init: function (config)
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

		return this;
	},

	begin: function (renderTarget, program)
	{
		if (this.currentRenderTarget !== null ||
			this.currentProgram !== null)
		{
			this.end();
		}

		this.currentRenderTarget = (renderTarget || null);
		this.currentProgram = (program || this.program);

		return this;
	},

	end: function ()
	{
		var renderTarget = this.currentRenderTarget;
		var program = this.currentProgram;
		var gl = this.glContext;
		var vertexCount = this.vertexCount;
		var viewMatrix = this.viewMatrix;
		var vertexBuffer = this.vertexBuffer;
		var vertexData = this.vertexData;
		var topology = this.topology;

		this.currentRenderTarget = null;
		this.program = null;
		this.vertexCount = 0;

		if (vertexCount === 0) return;

		viewMatrix[0] = +2.0 / this.width;
		viewMatrix[5] = -2.0 / this.height;

		program.bind();
		vertexBuffer.bind();
		vertexBuffer.updateResource(vertexData, 0);

		gl.bindFramebuffer(gl.FRAMEBUFFER, renderTarget.framebufferObject);
		gl.uniformMatrix4fv(gl.getUniformLocation(program.program, 'u_view_matrix'), false, viewMatrix);
		gl.drawArrays(topology, 0, vertexCount);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

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
