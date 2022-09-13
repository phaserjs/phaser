var config = {
    type: Phaser.AUTO,
    backgroundColor: 0xefefef,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {x: 100, y: 100}
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

var bunny;

function preload() {

    this.load.image('bunny', 'assets/sprites/bunny.png');

}

function create() {

    bunny = this.physics.add.sprite(400, 300, 'bunny').setOrigin(1);
    bunny.setBounce(1).setCollideWorldBounds(true);
    bunny.body.setOffset(0, -100);


}