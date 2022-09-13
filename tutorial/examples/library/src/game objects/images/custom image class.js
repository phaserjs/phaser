var EnemyRobot = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function EnemyRobot (scene, x, y)
    {
        Phaser.GameObjects.Image.call(this, scene);

        this.setTexture('contra');
        this.setPosition(x, y);
        this.setScale(2);
    }

});

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
    this.load.image('contra', 'assets/pics/contra3.png');
}

function create ()
{
    this.children.add(new EnemyRobot(this, 264, 250));
    this.children.add(new EnemyRobot(this, 464, 350));
    this.children.add(new EnemyRobot(this, 664, 450));
}
