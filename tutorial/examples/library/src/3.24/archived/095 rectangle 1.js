var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create() {

    var r1 = new Phaser.Geom.Rectangle(0, 0, 100, 100);

    console.log(r1);

    var r2 = new Phaser.Geom.Rectangle(190, 90, 50, 50);

    console.log(r2);

    var overlaps = Phaser.Geom.Rectangle.Overlaps(r1, r2);

    console.log('overlaps?', overlaps);

    var area = Phaser.Geom.Rectangle.Area(r1);

    console.log('r1 area', area);

}
