var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        create: create,
    }
};

var game = new Phaser.Game(config);

function create() 
{
    var t = this.add.text(100, 100, 'Phaser');

    console.log(t);
}
