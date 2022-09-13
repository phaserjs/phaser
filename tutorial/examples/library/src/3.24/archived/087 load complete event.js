var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {

    this.load.image('logo', 'assets/atlas/megasetHD-0.png');
    // this.load.image('logo', 'http://examples.phaser.io/assets/atlas/megasetSD-0.png');

}

function create() {

    this.add.image(0, 0, 'logo');

}
