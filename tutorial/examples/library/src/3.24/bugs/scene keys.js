class SceneA extends Phaser.Scene {
  constructor ()
  {
    super('sceneA');
    this.hotdog;
  }
  
    preload ()
    {
      this.load.image('pic', 'assets/pics/case.jpg');
      this.load.image('hotdog', 'assets/sprites/hotdog.png');
    }


    create ()
    {
        this.add.image(400, 300, 'pic');

        this.hotdog = this.add.image(400, 300, 'hotdog');

        this.add.text(10, 10, 'Scene A. Hold down to move image then click to change Scene.');

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.on('pointerup', function () {

            console.log('down');
            this.scene.pause();
            this.scene.run('sceneB');

        }, this);

    }

    update ()
    {
        if (this.cursors.up.isDown)
        {
            this.hotdog.y -= 4;
        }
        else if (this.cursors.down.isDown)
        {
            this.hotdog.y += 4;
        }
    }

}

class SceneB extends Phaser.Scene {

    constructor ()
    {
        super('sceneB');

        this.hotdog;
    }

    create ()
    {
        var graphics = this.add.graphics();

        graphics.fillStyle(0x000000, 0.5);
        graphics.fillRect(0, 0, 800, 600);

        this.add.text(10, 30, 'Scene B. SPACE to change back.', { font: '16px Courier', fill: '#00ff00' });

        this.input.keyboard.once('keydown_SPACE', function (event) {

            this.scene.stop();
            this.scene.resume('sceneA');

        }, this);
    }

}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ SceneA, SceneB ]
};

var game = new Phaser.Game(config);
