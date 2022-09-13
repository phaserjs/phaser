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

var image0;
var image1;
var image2;
var image3;
var image4;
var camera0;
var mainCamera;

var mouse = { x: 0, y: 0 };

function preload() {

    this.load.image('atari', 'assets/sprites/atari130xe.png');

}

function create() {

    image0 = this.add.image(0, 0, 'atari');
    image1 = this.add.image(100, 108, 'atari');
    image2 = this.add.image(100, 108, 'atari');
    image3 = this.add.image(100, 108, 'atari');
    image4 = this.add.image(100, 108, 'atari');

    image0.transform.add(image1.transform);
    image1.transform.add(image2.transform);
    image2.transform.add(image3.transform);
    image3.transform.add(image4.transform);

    document.getElementsByTagName('canvas')[0].onmousemove = function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };

    mainCamera = this.cameras.main;
    camera0 = this.cameras.add(0, 300, 200, 200);
    mainCamera.x = 200;
}

function update()
{
    // main camera
    if (image0.transform.hasPoint(mouse.x, mouse.y, mainCamera))
    {
        console.log('point over image0 on mainCamera');
    }
     if (image1.transform.hasPoint(mouse.x, mouse.y, mainCamera))
    {
        console.log('point over image1 on mainCamera');
    }
     if (image2.transform.hasPoint(mouse.x, mouse.y, mainCamera))
    {
        console.log('point over image2 on mainCamera');
    }
     if (image3.transform.hasPoint(mouse.x, mouse.y, mainCamera))
    {
        console.log('point over image3 on mainCamera');
    }
     if (image4.transform.hasPoint(mouse.x, mouse.y, mainCamera))
    {
        console.log('point over image4 on mainCamera');
    }

    // second camera
    if (image0.transform.hasPoint(mouse.x, mouse.y, camera0))
    {
        console.log('point over image0 on camera0');
    }
     if (image1.transform.hasPoint(mouse.x, mouse.y, camera0))
    {
        console.log('point over image1 on camera0');
    }
     if (image2.transform.hasPoint(mouse.x, mouse.y, camera0))
    {
        console.log('point over image2 on camera0');
    }
     if (image3.transform.hasPoint(mouse.x, mouse.y, camera0))
    {
        console.log('point over image3 on camera0');
    }
     if (image4.transform.hasPoint(mouse.x, mouse.y, camera0))
    {
        console.log('point over image4 on camera0');
    }
}


