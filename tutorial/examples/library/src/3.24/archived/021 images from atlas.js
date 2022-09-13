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

    this.load.atlas('atlas', 'assets/atlas/megasetHD-0.png', 'assets/atlas/megasetHD-0.json');

}

function create() {

    this.add.image(0, 0, 'atlas', 'aya_touhou_teng_soldier');
    this.add.image(260, 60, 'atlas', 'exocet_spaceman');
    this.add.image(120, 300, 'atlas', 'hotdog');

}
