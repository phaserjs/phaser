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

var image;
var cont;
var UICam;
var UIText1;
var UIText2;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('einstein', 'assets/pics/ra-einstein.png');
}

function create() {
    image = this.add.image(400, 300, 'einstein');

    UIText1 = this.add.text(0, 32, '0');
    UIText2 = this.add.text(0, 64, '0');

    cont = this.add.container();

    cont.add([UIText1, UIText2]);

    //  Add in a new camera, the same size and position as the main camera
    UICam = this.cameras.add(0, 0, 800, 600);

    //  The main camera will not render the container
    this.cameras.main.ignore(cont);

    //  The new UI Camera will not render the background image
    UICam.ignore(image);
}

function update() {
    UIText1.setText("Main camera rotation: " + this.cameras.main.rotation);
    UIText2.setText("Main camera zoom: " + this.cameras.main.zoom);

    //wobble the container
    cont.y = Math.sin(this.time.now / 100) * 10;

    this.cameras.main.setZoom(Math.abs(Math.sin(this.cameras.main.rotation)) * 0.5 + 1);
    this.cameras.main.rotation += 0.01;
}
