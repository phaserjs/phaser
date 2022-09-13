var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var rt;
var container;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('lemming', 'assets/sprites/lemming.png');
}

function create ()
{
    container = this.add.container(400, 300).setVisible(false);

    //  Add some sprites - positions are relative to the Container x/y
    var sprite0 = this.add.sprite(0, 0, 'lemming');
    var sprite1 = this.add.sprite(-100, -100, 'lemming');
    var sprite2 = this.add.sprite(100, -100, 'lemming');
    var sprite3 = this.add.sprite(100, 100, 'lemming');
    var sprite4 = this.add.sprite(-100, 100, 'lemming');

    container.add([ sprite0, sprite1, sprite2, sprite3, sprite4 ]);

    rt = this.add.renderTexture(0, 0, 800, 600);

    rt.draw(container);
}

function update ()
{
    rt.camera.rotation -= 0.01;

    rt.clear();

    rt.draw(container);
}
