var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    backgroundColor: '#ff00ff',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var logo;

function preload() {

    this.load.image('logo', 'assets/sprites/phaser2.png');

    console.log(this.game.config.backgroundColor);
    console.log(this.game.config.backgroundColor.rgba);

}

function create() {

    this.logo = this.add.image(0, 0, 'logo');

}

function update() {

    this.logo.x++;

}