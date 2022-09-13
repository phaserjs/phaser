var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('mushroom', 'assets/particles/glass.png');
}

function create ()
{
    //  top left, top right, bottom left, bottom right

    //  Different colors per corner, blended together
    this.add.image(200, 300, 'mushroom');
    this.add.image(400, 300, 'mushroom').setTint(0xff00ff);
    this.add.image(600, 300, 'mushroom').setTintFill(0xff00ff);

    //  Vertical tint from top to bottom (red on the top, blue on the bottom)
    // this.add.image(400, 300, 'mushroom').setScale(16).setTint(0xff0000, 0xff0000, 0x0000ff, 0x0000ff);

    //  Horizontal tint from left to right (red on the left, blue on the right)
    // this.add.image(400, 300, 'mushroom').setScale(16).setTint(0xff0000, 0x0000ff, 0xff0000, 0x0000ff);
}
