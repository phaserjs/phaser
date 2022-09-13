class Brain extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y)
    {
        super(scene, x, y);

        this.setTexture('brain');
        this.setPosition(x, y);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        this.rotation += 0.01;
    }

}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('brain', 'assets/sprites/brain.png');
}

function create ()
{
    this.add.existing(new Brain(this, 264, 250));
    this.add.existing(new Brain(this, 464, 350));
    this.add.existing(new Brain(this, 664, 450));
}
