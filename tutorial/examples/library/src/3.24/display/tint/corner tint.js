var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pixel', 'assets/sprites/16x16.png');
}

function create ()
{
    //  top left, top right, bottom left, bottom right

    //  Different colors per corner, blended together
    this.add.image(400, 300, 'pixel').setScale(16).setTint(0xff0000, 0x00ff00, 0x0000ff, 0xff0000);

    //  Vertical tint from top to bottom (red on the top, blue on the bottom)
    // this.add.image(400, 300, 'pixel').setScale(16).setTint(0xff0000, 0xff0000, 0x0000ff, 0x0000ff);

    //  Horizontal tint from left to right (red on the left, blue on the right)
    // this.add.image(400, 300, 'pixel').setScale(16).setTint(0xff0000, 0x0000ff, 0xff0000, 0x0000ff);
}
