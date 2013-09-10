Phaser.RenderTexture = function (game, width, height) {

    //  If exists = false then the Sprite isn't updated by the core game loop or physics subsystem at all
    this.exists = true;

    //  This is a handy little var your game can use to determine if a sprite is alive or not, it doesn't effect rendering
    this.alive = true;

    this.group = null;

    this.name = '';

	this.game = game;

	PIXI.EventTarget.call( this );

	this.width = width || 100;
	this.height = height || 100;

	this.indetityMatrix = PIXI.mat3.create();

	this.frame = new PIXI.Rectangle(0, 0, this.width, this.height);	

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
