var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);
var fadeCamera;
var flashCamera;
var shakeCamera;
var camerasAdded = [];
var camerasRemoved = [];
var adding = false;
var scene;

function preload() {

    this.load.image('CherilPerils', 'assets/tests/camera/CherilPerils.png');
}

function create() {

    var image = this.add.image(0, 0, 'CherilPerils');

    this.cameras.main.setSize(400, 300);

    fadeCamera = this.cameras.add(400, 0, 400, 300);
    flashCamera = this.cameras.add(0, 300, 400, 300);
    shakeCamera = this.cameras.add(400, 300, 400, 300);

    fadeCamera.on('camerafadeoutcomplete', function () {
        fadeCamera.fade(1000);
    });
    fadeCamera.fade(1000);

    camerasAdded.push(fadeCamera, shakeCamera, flashCamera);
    scene = this;
    addAndRemove();
}

function update()
{
    flashCamera.flash(1000);
    shakeCamera.shake(1000);
}

function addAndRemove()
{
    if (adding)
    {
        if (camerasRemoved.length > 0)
        {
            var addingCamera = camerasRemoved.pop();
            camerasAdded.push(addingCamera);
            scene.cameras.addExisting(addingCamera);
        }
        else
        {
            adding = false;
        }
    }
    else
    {
        if (camerasAdded.length > 0)
        {
            var removingCamera = camerasAdded.pop();
            camerasRemoved.push(removingCamera);
            scene.cameras.remove(removingCamera);
        }
        else
        {
            adding = true;
        }
    }

    setTimeout(addAndRemove, 500);
}
