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
var d = 0;

function preload() {

    this.load.image('atari', 'assets/sprites/atari130xe.png');
    this.load.atlas('atlas', 'assets/atlas/megaset-0.png', 'assets/atlas/megaset-0.json');

}

function create() {

    atlasFrame = this.add.image(0, 0, 'atlas', 'dragonwiz');
    singleImage = this.add.image(0, 400, 'atari');

    atlasFrame.scale = 0;
    singleImage.scale = 0;

}

function update() {

    if (d === 0)
    {
        atlasFrame.scale += 0.01;
        singleImage.scale += 0.01;

        if (singleImage.scale >= 4)
        {
            d = 1;
        }
    }
    else
    {
        atlasFrame.scale -= 0.01;
        singleImage.scale -= 0.01;

        if (singleImage.scale <= 0)
        {
            d = 0;
        }
    }

}
