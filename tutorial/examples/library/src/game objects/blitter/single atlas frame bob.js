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

    this.load.atlas('atlas', 'assets/atlas/megaset-2.png', 'assets/atlas/megaset-2.json');

}

function create() {

    var blitter = this.add.blitter(0, 0, 'atlas', 'hotdog');

    var bob = blitter.create(100, 100);

}
