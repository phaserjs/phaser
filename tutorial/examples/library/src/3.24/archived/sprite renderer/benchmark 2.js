var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var ufo;
var scene = null;
var addUfo = false;
var random = Math.random;

function preload() {

    this.load.image('ufo', 'assets/sprites/ufo.png');

}

function create() {

    scene = this;

    for (var i = 0; i < 50; ++i)
    {
        scene.add.image(random() * scene.game.config.width, random() * scene.game.config.height, 'ufo');
    }

}

function update() {

    this.cameras.main.scrollX += 2;
    if (this.cameras.main.scrollX > 800)
    {
        this.cameras.main.scrollX = -800;
    }
    if (addUfo)
    {
        for (var i = 0; i < 50; ++i)
        {
            scene.add.image(random() * scene.game.config.width, random() * scene.game.config.height, 'ufo');
        }
    }

}

window.onmousedown = function ()
{
    addUfo = true;
};

window.onmouseup = function ()
{
    addUfo = false;
    console.log(scene.sys.displayList.length);
};
