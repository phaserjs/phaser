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

var iter = 0;
var image;
var camera0, camera1, camera2, camera3;
var game = new Phaser.Game(config);

function preload() {

    this.load.image('einstein', 'assets/pics/ra-einstein.png');

}

function create() {

    image = this.add.image(200, 150, 'einstein');

    this.cameras.main.setSize(400, 300);

    camera0 = this.cameras.main;
    camera1 = this.cameras.add(400, 0, 400, 300);
    camera2 = this.cameras.add(0, 300, 400, 300);
    camera3 = this.cameras.add(400, 300, 400, 300);
}

function update()
{
    camera0.zoom = 0.5 + Math.abs(Math.sin(iter));
    camera0.scrollX = Math.sin(iter) * 400;
        
    camera1.rotation = iter;

    camera2.scrollX = Math.cos(iter) * 100;
    camera2.scrollY = Math.sin(iter) * 100;
    camera2.zoom = 0.5 + Math.abs(Math.sin(iter));
    camera2.rotation = -iter;

    camera3.zoom = 0.5 + Math.abs(Math.sin(iter));
    iter += 0.01;
}
