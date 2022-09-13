var config2 = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload2,
        create: create2
    }
};

function preload2 ()
{
    this.load.image('map', 'assets/tests/camera/earthbound-scarab.png');
}

function create2 ()
{
    this.cameras.main.setBounds(0, 0, 1024, 2048);
    
    this.add.image(0, 0, 'map').setOrigin(0);

    this.cameras.main.centerOn(0, 0);

    this.add.text(0, 0).setText('Game 2').setScrollFactor(0).setShadow(1, 1, '#000000', 2);

    var pos = 0;

    this.input.on('pointerdown', function () {

        var cam = this.cameras.main;

        if (pos === 0)
        {
            cam.pan(767, 1096, 2000, 'Power2');
            pos++;
        }
        else if (pos === 1)
        {
            cam.pan(703, 1621, 2000, 'Elastic');
            pos++;
        }
        else if (pos === 2)
        {
            cam.pan(256, 623, 2000, 'Sine.easeInOut');
            pos++;
        }
        else if (pos === 3)
        {
            cam.pan(166, 304, 2000);
            pos++;
        }
        else if (pos === 4)
        {
            cam.pan(624, 158, 2000);
            pos++;
        }
        else if (pos === 5)
        {
            cam.pan(680, 330, 2000);
            pos++;
        }
        else if (pos === 6)
        {
            cam.pan(748, 488, 2000);
            pos++;
        }
        else if (pos === 7)
        {
            cam.pan(1003, 1719, 2000);
            pos = 0;
        }

    }, this);
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

function preload ()
{
    this.load.image('map', 'assets/tests/camera/earthbound-scarab.png');
}

function create ()
{
    this.cameras.main.setBounds(0, 0, 1024, 2048);
    
    this.add.image(0, 0, 'map').setOrigin(0);

    this.cameras.main.centerOn(0, 0);

    this.add.text(0, 0).setText('Game 1').setScrollFactor(0).setShadow(1, 1, '#000000', 2);

    var pos = 0;

    this.input.on('pointerdown', function () {

        var cam = this.cameras.main;

        if (pos === 0)
        {
            cam.pan(767, 1096, 2000, 'Power2');
            pos++;
        }
        else if (pos === 1)
        {
            cam.pan(703, 1621, 2000, 'Elastic');
            pos++;
        }
        else if (pos === 2)
        {
            this.game.canvas.parentNode.removeChild(this.game.canvas);

            var game2 = new Phaser.Game(config2);
        }

    }, this);
}

var game1 = new Phaser.Game(config);
