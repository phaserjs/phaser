var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var text;
var text2;
var controls;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
}

function create ()
{
    for (var i = 0; i < 32; i++)
    {
        var x = Phaser.Math.Between(0, 2000);
        var y = Phaser.Math.Between(0, 2000);

        this.add.sprite(x, y, 'eye').setInteractive();
    }

    this.input.on('gameobjectover', function (pointer, gameObject) {

        gameObject.setTint(0xff0000);

    });

    this.input.on('gameobjectout', function (pointer, gameObject) {

        gameObject.clearTint();

    });

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

    // this.cameras.main.setBackgroundColor('rgba(255, 0, 0, 0.5)');
    // this.cameras.main.setZoom(0.8);
    // this.cameras.main.setRotation(Phaser.Math.DegToRad(10));

    text = this.add.text(100, 200, 'x: 0 y: 0', { font: '18px Courier', fill: '#00ff00' }).setScrollFactor(0);
    text2 = this.add.text(100, 400, '', { font: '18px Courier', fill: '#00ff00' }).setScrollFactor(0);

    this.input.keyboard.on('keydown_Z', function (event) {

        this.cameras.main.setRotation(this.cameras.main.rotation + 0.01);

    }, this);

    this.input.keyboard.on('keydown_X', function (event) {

        this.cameras.main.setRotation(this.cameras.main.rotation - 0.01);

    }, this);
}

function update (time, delta)
{
    controls.update(delta);

    var cam = this.cameras.main;

    //  Take a coordinate from screen space and convert it into World space within the Camera
    // var p = cam.screenToCamera({ x: this.input.x, y: this.input.y });

    var p = this.input.activePointer.positionToCamera(cam);

    text.setText([
        'cx: ' + cam.scrollX,
        'cy: ' + cam.scrollY,
        '',
        'sx: ' + this.input.x,
        'sy: ' + this.input.y,
        '',
        'px: ' + p.x,
        'py: ' + p.y
    ]);

    text2.setText([
        'a: ' + cam.matrix.matrix[0],
        'b: ' + cam.matrix.matrix[1],
        'c: ' + cam.matrix.matrix[2],
        'd: ' + cam.matrix.matrix[3],
        'tx: ' + cam.matrix.matrix[4],
        'ty: ' + cam.matrix.matrix[5]
    ]);
}
