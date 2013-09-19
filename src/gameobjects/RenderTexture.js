Phaser.RenderTexture = function (game, key, width, height) {

	this.game = game;

    this.name = key;

	PIXI.EventTarget.call( this );

	this.width = width || 100;
	this.height = height || 100;

	this.identityMatrix = PIXI.mat3.create();

	this.frame = new PIXI.Rectangle(0, 0, this.width, this.height);	

	this.type = Phaser.RENDERTEXTURE;

	if (PIXI.gl)
	{
		this.initWebGL();
	}
	else
	{
		this.initCanvas();
	}
	
};

Phaser.RenderTexture.prototype = Phaser.Utils.extend(true, PIXI.RenderTexture.prototype);
Phaser.RenderTexture.prototype.constructor = Phaser.RenderTexture;
