Phaser.RenderTexture = function (game, key, width, height) {

	this.game = game;

    this.name = key;

	PIXI.EventTarget.call( this );

	this.width = width || 100;
	this.height = height || 100;

	//	I know this has a typo in it, but it's because the PIXI.RenderTexture does and we need to pair-up with it
	//	once they update pixi to fix the typo, we'll fix it here too :)
	this.indetityMatrix = PIXI.mat3.create();

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
