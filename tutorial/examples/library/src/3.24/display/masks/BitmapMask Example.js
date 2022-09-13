var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 640,
    height: 480,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {

    this.load.image('bunny', 'assets/sprites/bunny.png');
    this.load.image('phaser2', 'assets/sprites/phaser2.png');
    this.load.image('checker', 'assets/pics/checker.png');

}

function create() {

	var checker = this.make.image({
		x: game.config.width / 2,
		y: game.config.height / 2,
		key: 'checker',
		add: true
	});

    var bunny = this.make.sprite({
    	x: game.config.width / 2, 
    	y: game.config.height / 2, 
    	key: 'bunny',
    	add: true
    });

    var phaser2 = this.make.sprite({
    	x: game.config.width / 2,
    	y: game.config.height / 2,
    	key: 'phaser2',
    	add: false
    });

    bunny.mask = new Phaser.Display.Masks.BitmapMask(this, phaser2);

    this.input.on('pointermove', function (pointer) {

    	phaser2.x = pointer.x;
    	phaser2.y = pointer.y;

    });

}
