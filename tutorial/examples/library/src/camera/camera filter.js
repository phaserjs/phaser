var UI_CAM_1;
var UI_CAM_2;

var UIText1;
var UIText2;
var UIText3;

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('einstein', 'assets/pics/ra-einstein.png');
    }

    create ()
    {
        const image = this.add.image(400, 300, 'einstein');

        UIText1 = this.add.text(0, 32, '0');
        UIText2 = this.add.text(0, 64, '0');
        UIText3 = this.add.text(500, 64, '0');

        UI_CAM_1 = this.cameras.add();
        UI_CAM_2 = this.cameras.add();

        //list of all cameras
        this.camlist = this.cameras.cameras;

        //exclude gameobject to some camera
        UIText1.cameraFilter = this.setCamera(UI_CAM_1);
        UIText2.cameraFilter = this.setCamera(UI_CAM_1);
        UIText3.cameraFilter = this.setCamera(UI_CAM_2);

        image.cameraFilter = this.setCamera(this.cameras.main);
    }

    update ()
    {
        UIText1.setText("UI Camera 1");
        UIText2.setText("Main camera rotation: " + this.cameras.main.rotation);
        UIText3.setText("UI Camera 2");

        UI_CAM_1.scrollY = Math.sin(this.time.now / 100) * 10;
        UI_CAM_2.scrollX = Math.sin(this.time.now / 100) * 10;

        this.cameras.main.setZoom(Math.abs(Math.sin(this.cameras.main.rotation)) * 0.5 + 1);
        this.cameras.main.rotation += 0.01;
    }

    setCamera(cam)
    {
        let l = (1 << this.camlist.length) - 1;
        return l & ~cam.id;
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
