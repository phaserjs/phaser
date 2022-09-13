var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        pack: {
            files: [
                { type: 'image', key: 'bear', url: 'assets/pics/alex-bear.png' }
            ]
        }
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.add.image(400, 300, 'bear').setScale(2);

    var progress = this.add.graphics();
    
    progress.fillStyle(0xffffff);

    //  3 progress bars, one per file.

    this.load.on('fileprogress', function (file, value) {

        // progress.clear();

        if (file.key === 'goldrunner')
        {
            progress.fillRect(400, 500 - (value * 400), 60, value * 400);
        }
        else if (file.key === 'heroquest')
        {
            progress.fillRect(510, 500 - (value * 400), 60, value * 400);
        }
        else if (file.key === 'goa')
        {
            progress.fillRect(620, 500 - (value * 400), 60, value * 400);
        }

    });

    this.load.audio('goldrunner', 'assets/audio/Scyphe-Goldrunner_(Maccie_Pimp_Me Up_Remix).mp3');
    this.load.audio('heroquest', 'assets/audio/Totta-HeroQuest-Pophousedub-remix.mp3');
    this.load.audio('goa', 'assets/audio/tommy_in_goa.mp3');
}

function create ()
{
    var music = this.sound.add('goa');

    music.play();
}
