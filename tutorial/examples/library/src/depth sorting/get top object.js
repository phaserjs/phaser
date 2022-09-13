class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('atlas', 'assets/atlas/megaset-3.png', 'assets/atlas/megaset-3.json');
    }

    create ()
    {
        //  Create a bunch of images and store some of them in a local array
        //  Works even with setDepth() added
        const image1 = this.add.image(100, 300, 'atlas', 'contra2');
        const image2 = this.add.image(200, 300, 'atlas', 'contra3');
        const image3 = this.add.image(300, 300, 'atlas', 'exocet_spaceman');
        const image4 = this.add.image(400, 300, 'atlas', 'helix');
        const image5 = this.add.image(500, 300, 'atlas', 'pacman_by_oz_28x28');
        const image6 = this.add.image(600, 300, 'atlas', 'profil-sad-plush');

        const test1 = [ image1, image2, image4 ];
        //  contra2 -> contra3 -> helix
        this.dump(test1);

        const test2 = [ image6, image4, image2 ];
        //  profil-sad-plush -> helix -> contra3
        this.dump(test2);

        const test3 = [ image6, image4, image2 ];
        //  contra3 -> helix -> profil-sad-plush
        this.children.depthSort(test3);
        this.dump(test3);

        const test4 = [ image3, image1, image2, image1, image1, image6, image4 ];
        this.children.depthSort(test4);
        //  contra2 -> contra2 -> contra2 -> contra3 -> exocet_spaceman -> helix -> profil-sad-plush
        this.dump(test4);
    }

    dump (arr)
    {
        let s = '';
        arr.forEach(function(e, i) {
            s = s.concat(e.frame.name);

            if (i < arr.length - 1)
            {
                s = s.concat(' -> ');
            }
        });
        console.log(s);
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
