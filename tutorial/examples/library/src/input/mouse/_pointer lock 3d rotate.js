var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);
var text;
var mesh;
var graphics;
var cursor;

function preload ()
{
    // Source: https://www.youmagine.com/designs/low-poly-pikachu
    this.load.obj('pikachu', 'assets/obj/pikachu.obj');

    // Source: Font Awesome
    this.load.image('cursor-rotate', 'assets/sprites/cursor-rotate.png');
}

function create ()
{
    graphics = this.add.graphics();

    mesh = graphics.createMesh('pikachu', 0, 0.3, 8);
    mesh.rotation.x = Phaser.Math.DegToRad(180);
    mesh.thickness = 2;
    mesh.setFillColor(0xffda1f);
    mesh.setStrokeColor(0x6b5900);
    graphics.fillMesh(mesh);
    graphics.strokeMesh(mesh);

    cursor = this.add.sprite(0, 0, 'cursor-rotate');

    // Pointer lock will only work after an 'engagement gesture', e.g. mousedown, keypress, etc.
    game.canvas.addEventListener('mousedown', function () {
        game.input.mouse.requestPointerLock();
        cursor.x = this.input.x;
        cursor.y = this.input.y;
    }.bind(this));

    // When locked, you will have to use the movementX and movementY properties of the pointer
    // (since a locked cursor's xy position does not update)
    this.input.on('pointermove', function (pointer) {
        if (this.input.mouse.locked)
        {
            mesh.rotation.x += pointer.movementY * 0.01;
            mesh.rotation.y += pointer.movementX * 0.01;

            graphics.clear();
            graphics.fillMesh(mesh);
            graphics.strokeMesh(mesh);
            updateLockText();

            cursor.x += pointer.movementX;
            cursor.y += pointer.movementY;

            // Force the cursor to stay on screen by wrapping around at the edges
            cursor.x = Phaser.Math.Wrap(cursor.x, 0, game.renderer.width);
            cursor.y = Phaser.Math.Wrap(cursor.y, 0, game.renderer.height);

            updateLockText(true);
        }
    }, this);

    game.input.on('POINTER_LOCK_CHANGE_EVENT', function (event) {
        updateLockText(event.isPointerLocked);
    }, 0, this);

    text = this.add.text(16, 16, '', { fontSize: '20px', fill: '#ffffff' });
    updateLockText(false);
}

function updateLockText (isLocked)
{
    var xRotation = Phaser.Math.Wrap(mesh.rotation.x * 180 / Math.PI, 0, 360).toFixed(1);
    var yRotation = Phaser.Math.Wrap(mesh.rotation.y * 180 / Math.PI, 0, 360).toFixed(1);
    var zRotation = Phaser.Math.Wrap(mesh.rotation.z * 180 / Math.PI, 0, 360).toFixed(1);
    text.setText([
        isLocked ? 'Move cursor to rotate.' : 'Click to edit rotation.',
        'Current rotation: (' + xRotation + ', ' + yRotation + ', ' + zRotation + ')'
    ]);
}
