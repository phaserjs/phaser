var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('veg01', 'assets/tests/fruit/veg01.png');
    this.load.image('veg02', 'assets/tests/fruit/veg02.png');
    this.load.image('veg03', 'assets/tests/fruit/veg03.png');
    this.load.image('veg04', 'assets/tests/fruit/veg04.png');
    this.load.image('veg05', 'assets/tests/fruit/veg05.png');
    this.load.image('veg06', 'assets/tests/fruit/veg06.png');
    this.load.image('veg07', 'assets/tests/fruit/veg07.png');
    this.load.image('veg08', 'assets/tests/fruit/veg08.png');
    this.load.image('veg09', 'assets/tests/fruit/veg09.png');
    this.load.image('veg10', 'assets/tests/fruit/veg10.png');
    this.load.image('veg11', 'assets/tests/fruit/veg11.png');
    this.load.image('veg12', 'assets/tests/fruit/veg12.png');
    this.load.image('veg13', 'assets/tests/fruit/veg13.png');
    this.load.image('veg14', 'assets/tests/fruit/veg14.png');
    this.load.image('veg15', 'assets/tests/fruit/veg15.png');
    this.load.image('veg16', 'assets/tests/fruit/veg16.png');
    this.load.image('veg17', 'assets/tests/fruit/veg17.png');
    this.load.image('veg18', 'assets/tests/fruit/veg18.png');
    this.load.image('veg19', 'assets/tests/fruit/veg19.png');
    this.load.image('veg20', 'assets/tests/fruit/veg20.png');
    this.load.image('veg21', 'assets/tests/fruit/veg21.png');
    this.load.image('veg22', 'assets/tests/fruit/veg22.png');
    this.load.image('veg23', 'assets/tests/fruit/veg23.png');
    this.load.image('veg24', 'assets/tests/fruit/veg24.png');
    this.load.image('veg25', 'assets/tests/fruit/veg25.png');
    this.load.image('veg26', 'assets/tests/fruit/veg26.png');
    this.load.image('veg27', 'assets/tests/fruit/veg27.png');
    this.load.image('veg28', 'assets/tests/fruit/veg28.png');
    this.load.image('veg29', 'assets/tests/fruit/veg29.png');
    this.load.image('veg30', 'assets/tests/fruit/veg30.png');
    this.load.image('veg31', 'assets/tests/fruit/veg31.png');
    this.load.image('veg32', 'assets/tests/fruit/veg32.png');
    this.load.image('veg33', 'assets/tests/fruit/veg33.png');
    this.load.image('veg34', 'assets/tests/fruit/veg34.png');
    this.load.image('veg35', 'assets/tests/fruit/veg35.png');
    this.load.image('veg36', 'assets/tests/fruit/veg36.png');
    this.load.image('veg37', 'assets/tests/fruit/veg37.png');
}

function create ()
{
    var fruit = [];

    var test1 = 8;
    var test2 = 16;
    var test3 = 32;
    var test4 = 37;
    var test5 = 17;
    var test6 = 31;

    for (var i = 1; i < test3 + 1; i++)
    {
        fruit.push(this.add.sprite(0, 0, 'veg' + Phaser.Utils.String.Pad(i, 2, '0', 1)));
    }

    Phaser.Actions.GridAlign(fruit, {
        width: 8,
        height: 8,
        cellWidth: 64,
        cellHeight: 64,
        x: 100,
        y: 100
    });
}
