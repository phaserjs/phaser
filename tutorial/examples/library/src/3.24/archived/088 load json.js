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

    this.load.json('data', 'assets/atlas/megasetHD-0.json');

}

function create() {

    console.log('json loaded?');

}
