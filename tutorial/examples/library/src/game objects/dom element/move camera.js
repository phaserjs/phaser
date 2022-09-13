var config = {
    type: Phaser.AUTO,
    backgroundColor: '#2d2d2d',
    scale: {
        _mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        width: 800,
        height: 600
    },
    dom: {
        createContainer: true
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var controls;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('einstein', 'assets/pics/ra-einstein.png');
}

function create ()
{
    var smileys = [ '😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','😗','😙','😚','️🙂','🤗','🤩','🤔','🤨','😐','😑','😶','🙄','😏','😣','😥','😮','🤐','😯','😪','😫','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑','😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬','😰','😱','😳','🤪','😵','😡','😠','🤬','😷','🤒','🤕','🤢','🤮','🤧','😇','🤠','🤡','🤥','🤫','🤭','🧐','🤓','😈','👿','👹','👺','💀','👻','👽','🤖','💩','😺','😸','😹','😻','😼','😽','🙀','😿','😾' ];

    //  Create a bunch of random divs all over the place

    var sf = 0.5;
    var px = 64;

    for (var i = 1; i <= 100; i++)
    {
        var x = Phaser.Math.Between(100, 2000);
        var y = Phaser.Math.Between(100, 2000);

        var element = this.add.dom(x, y, 'div', 'font-size: ' + px + 'px', Phaser.Utils.Array.GetRandom(smileys)).setScrollFactor(sf);

        element.setPerspective(800);

        element.rotate3d.set(Math.random(), Math.random(), Math.random(), 0);

        this.tweens.add({
            targets: element.rotate3d,
            w: 180,
            duration: 2000,
            ease: 'Sine.easeInOut',
            loop: -1,
            yoyo: true
        });

        if (i % 50 === 0)
        {
            sf += 0.1;
            px += 32;
        }
    }

    this.cameras.main.setBounds(0, 0, 4000, 4000);

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        acceleration: 0.06,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
}

function update (time, delta)
{
    controls.update(delta);
}
