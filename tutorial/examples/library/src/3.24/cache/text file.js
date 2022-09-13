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

    this.load.text('data', 'assets/loader-tests/test.txt');

}

function create() {

    console.log(this.cache.text.get('data'));

}
