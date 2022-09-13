class EnemyRobot extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y)
    {
        super(scene, x, y);

        this.setTexture('contra');
        this.setScale(2);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        this.rotation += 0.01;
    }

}

let config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: {
        init: init,
        preload: preload,
        create: create
    }
};

let game = new Phaser.Game(config);

function init ()
{
    Phaser.GameObjects.GameObjectFactory.register('robot', function (x, y)
    {
        let sprite = new EnemyRobot(this.scene, x, y);

        this.displayList.add(sprite);
        this.updateList.add(sprite);

        return sprite;
    });
}

function preload ()
{
    this.load.image('contra', 'assets/pics/contra3.png');
}

function create ()
{
    this.add.robot(200, 200);
    this.add.robot(400, 300);
    this.add.robot(600, 400);
}
