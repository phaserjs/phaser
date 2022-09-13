var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create() {

    console.log(Phaser.Math.Between(10, 20));
    console.log(Phaser.Math.Average([3, 6, 1, 43, 20, 8]));

}
