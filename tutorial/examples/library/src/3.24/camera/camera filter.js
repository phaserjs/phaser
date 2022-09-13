var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var camlist;

var UI_CAM_1;
var UI_CAM_2;

var image;
var UIText1;
var UIText2;
var UIText3;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('einstein', 'assets/pics/ra-einstein.png');
}

function create() {
    image = this.add.image(400, 300, 'einstein');

    UIText1 = this.add.text(0, 32, '0');
    UIText2 = this.add.text(0, 64, '0');
    UIText3 = this.add.text(500, 64, '0');

    UI_CAM_1 = this.cameras.add();
    UI_CAM_2 = this.cameras.add();

    //list of all cameras
    camlist = this.cameras.cameras;

    //exclude gameobject to some camera
    UIText1.cameraFilter = setCamera(UI_CAM_1);
    UIText2.cameraFilter = setCamera(UI_CAM_1);
    UIText3.cameraFilter = setCamera(UI_CAM_2);

    image.cameraFilter = setCamera(this.cameras.main);

}

function update() {
    UIText1.setText("UI Camera 1");
    UIText2.setText("Main camera rotation: " + this.cameras.main.rotation);
    UIText3.setText("UI Camera 2");

    UI_CAM_1.scrollY = Math.sin(this.time.now / 100) * 10;
    UI_CAM_2.scrollX = Math.sin(this.time.now / 100) * 10;

    this.cameras.main.setZoom(Math.abs(Math.sin(this.cameras.main.rotation)) * 0.5 + 1);
    this.cameras.main.rotation += 0.01;
}

function setCamera(cam) {

    let l = (1 << camlist.length) - 1;

    return l & ~cam.id;
}
