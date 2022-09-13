var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var atlasFrame;
var singleImage;

function preload() {

    this.load.image('atari', 'assets/sprites/atari130xe.png');
    this.load.atlas('atlas', 'assets/atlas/megaset-0.png', 'assets/atlas/megaset-0.json');

}

function create() {

    atlasFrame = this.add.image(0, 0, 'atlas', 'dragonwiz');
    singleImage = this.add.image(200, 0, 'atari');

}

function update() {

    singleImage.x += 4;

    if (singleImage.x > this.game.config.width)
    {
        singleImage.x = 0;
        singleImage.y += 64;
    }

    atlasFrame.x += 4;

    if (atlasFrame.x > this.game.config.width)
    {
        atlasFrame.x = 0;
        atlasFrame.y += 64;
    }

}
