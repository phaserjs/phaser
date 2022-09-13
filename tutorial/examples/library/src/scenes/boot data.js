var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        key: 'test',
        init: init,
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function init (data)
{
    this.png = data.image;
}

function preload ()
{
    this.load.image('mech', 'assets/pics/' + this.png);
}

function create (data)
{
    this.add.image(data.x, data.y, 'mech');
}

game.scene.start('test', { image: 'titan-mech.png', x: 400, y: 300 });
