var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('atlas', 'assets/atlas/megaset-3.png', 'assets/atlas/megaset-3.json');
}

function create ()
{
    //  Create a bunch of images and store some of them in a local array
    //  Works even with setDepth() added
    var image1 = this.add.image(100, 300, 'atlas', 'contra2');
    var image2 = this.add.image(200, 300, 'atlas', 'contra3');
    var image3 = this.add.image(300, 300, 'atlas', 'exocet_spaceman');
    var image4 = this.add.image(400, 300, 'atlas', 'helix');
    var image5 = this.add.image(500, 300, 'atlas', 'pacman_by_oz_28x28');
    var image6 = this.add.image(600, 300, 'atlas', 'profil-sad-plush');

    var test1 = [ image1, image2, image4 ];
    //  contra2 -> contra3 -> helix
    dump(test1);

    var test2 = [ image6, image4, image2 ];
    //  profil-sad-plush -> helix -> contra3
    dump(test2);

    var test3 = [ image6, image4, image2 ];
    this.children.sortGameObjects(test3);
    //  contra3 -> helix -> profil-sad-plush
    dump(test3);

    var test4 = [ image3, image1, image2, image1, image1, image6, image4 ];
    this.children.sortGameObjects(test4);
    //  contra2 -> contra2 -> contra2 -> contra3 -> exocet_spaceman -> helix -> profil-sad-plush
    dump(test4);
}

function dump (arr)
{
    var s = '';

    arr.forEach(function(e, i) {
        s = s.concat(e.frame.name);

        if (i < arr.length - 1)
        {
            s = s.concat(' -> ');
        }
    });

    console.log(s);
}