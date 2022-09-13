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
var cont1;
var cont2;
var group;

var UIText1;
var UIText2;
var UIText3;

var UICam;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('einstein', 'assets/pics/ra-einstein.png');
}

function create() {
    image = this.add.image(400, 300, 'einstein');

    UIText1 = this.add.text(0, 32, '0');
    UIText2 = this.add.text(0, 64, '0');
    UIText3 = this.add.text(540, 64, '3');

    cont1 = this.add.container();
    cont2 = this.add.container();

    cont1.add(UIText1);
    cont1.add(UIText2);
    cont2.add(UIText3);

    group = this.add.group();
    group.add(cont1);
    group.add(cont2);
    //  Add in a new camera, the same size and position as the main camera
    UICam = this.cameras.add(0, 0, 800, 600);

    //  The main camera will not render the children
    this.cameras.main.ignore(group.getChildren());

    //  The new UI Camera will not render the background image
    UICam.ignore(image);
}

function update() {
    UIText1.setText("Main camera rotation: " + this.cameras.main.rotation);
    UIText2.setText("Main camera zoom: " + this.cameras.main.zoom);
    UIText3.setText("lol: " + cont2.y);

    //wobble the container
    cont2.y = Math.sin(this.time.now / 100) * 10;

    this.cameras.main.setZoom(Math.abs(Math.sin(this.cameras.main.rotation)) * 0.5 + 1);
    this.cameras.main.rotation += 0.01;
}
