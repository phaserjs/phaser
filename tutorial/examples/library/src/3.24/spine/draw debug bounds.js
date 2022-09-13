var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            createToggle: createToggle
        },
        pack: {
            files: [
                { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/SpinePlugin.js', sceneKey: 'spine' }
            ]
        }
    }
};

var controls;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('on', 'assets/tests/scenes/toggle-on.png');
    this.load.image('off', 'assets/tests/scenes/toggle-off.png');

    this.load.setPath('assets/spine/demos/');

    this.load.spine('set1', 'demos.json', [ 'atlas1.atlas', 'atlas2.atlas', 'heroes.atlas' ], true);
}

function create ()
{
    var b = this.add.spine(500, 600, 'set1.greengirl').setScale(0.7);

    b.drawDebug = true;

    var anims = b.getAnimationList();

    b.play(anims[0], true);

    //  Our debug toggles
    this.createToggle(10, 10, 'Draw Bones', true, this.spine.setDebugBones.bind(this.spine));
    this.createToggle(10, 35, 'Draw Region Attachments', true, this.spine.setDebugRegionAttachments.bind(this.spine));
    this.createToggle(10, 60, 'Draw Bounding Boxes', true, this.spine.setDebugBoundingBoxes.bind(this.spine));
    this.createToggle(10, 85, 'Draw Mesh Hull', true, this.spine.setDebugMeshHull.bind(this.spine));
    this.createToggle(10, 110, 'Draw Mesh Triangles', true, this.spine.setDebugMeshTriangles.bind(this.spine));
    this.createToggle(10, 135, 'Draw Paths', true, this.spine.setDebugPaths.bind(this.spine));
    this.createToggle(10, 160, 'Draw Skeleton XY', false, this.spine.setDebugSkeletonXY.bind(this.spine));
    this.createToggle(10, 185, 'Draw Clipping', true, this.spine.setDebugClipping.bind(this.spine));

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        acceleration: 0.5,
        drag: 0.01,
        maxSpeed: 1.2
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
}

function update (time, delta)
{
    controls.update(delta);
}

function createToggle (x, y, label, enabled, callback)
{
    var button = this.add.image(x, y, (enabled) ? 'on' : 'off').setOrigin(0).setScrollFactor(0);

    var text = this.add.text(x + 90, y + 6, label, { font: '16px Courier', fill: '#ffffff' }).setShadow(1, 1).setScrollFactor(0);

    button.setInteractive();
    button.setData('enabled', enabled);
    button.setData('callback', callback);

    button.on('pointerdown', function () {

        if (button.getData('enabled'))
        {
            button.setData('enabled', false);
            button.setTexture('off');
            button.getData('callback')(false);
        }
        else
        {
            button.setData('enabled', true);
            button.setTexture('on');
            button.getData('callback')(true);
        }

    });
}
