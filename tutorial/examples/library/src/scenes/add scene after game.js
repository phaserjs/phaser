class MyScene extends Phaser.Scene {

    constructor (config)
    {
        super(config);
    }

    preload ()
    {
        this.load.image('face', 'assets/pics/bw-face.png');
    }

    create (data)
    {
        this.face = this.add.image(data.x, data.y, 'face');
    }

}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);

game.scene.add('myScene', MyScene, true, { x: 400, y: 300 });
