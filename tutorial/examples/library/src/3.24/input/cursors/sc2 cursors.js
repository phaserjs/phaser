var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#003a7b',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/input/cursors/sc2/logo.png');
    this.load.image('folder', 'assets/input/cursors/sc2/starcraft2-mac-folder-by-gazol-d3d7ctl.png');
}

function create ()
{
    this.input.setDefaultCursor('url(assets/input/cursors/sc2/SC2-cursor.cur), pointer');

    this.add.image(400, 100, 'logo');

    //  Create some custom cursor folders

    this.add.sprite(100, 300, 'folder').setInteractive({ cursor: 'url(assets/input/cursors/sc2/SC2-cursor-busy-protoss.cur), pointer' });
    this.add.sprite(300, 300, 'folder').setInteractive({ cursor: 'url(assets/input/cursors/sc2/SC2-cursor-zerg.cur), pointer' });
    this.add.sprite(500, 300, 'folder').setInteractive({ cursor: 'url(assets/input/cursors/sc2/SC2-hyperlink.cur), pointer' });
    this.add.sprite(700, 300, 'folder').setInteractive({ cursor: 'url(assets/input/cursors/sc2/SC2-target-none.cur), pointer' });

    this.add.sprite(100, 450, 'folder').setInteractive({ cursor: 'url(assets/input/cursors/sc2/SC2-cursor-busy-zerg.cur), pointer' });
    this.add.sprite(300, 450, 'folder').setInteractive({ cursor: 'url(assets/input/cursors/sc2/SC2-cursor-protoss.cur), pointer' });
    this.add.sprite(500, 450, 'folder').setInteractive({ cursor: 'url(assets/input/cursors/sc2/SC2-ibeam.cur), pointer' });
    this.add.sprite(700, 450, 'folder').setInteractive({ cursor: 'url(assets/input/cursors/sc2/SC2-resize-diagonal-right.cur), pointer' });
}
