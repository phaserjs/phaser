class MyScene extends Phaser.Scene {

    constructor ()
    {
        super('MEMLEAK');
    }

    create ()
    {
        console.log('create');

        const rt = this.add.renderTexture(0, 0, 800, 600).fill(0x990000);

        this.input.keyboard.once('keydown_SPACE', () => game.scene.start('MEMLEAK'));
    }

}

/*
var MyScene = new Phaser.Class({

  Extends: Phaser.Scene,

    initialize:

    function MyScene (config)
    {
        Phaser.Scene.call(this, config)
    },

    create: function () {

    console.log("CREATE SCENE");

    // instantiation of this object creates a leak
    const rTex = this.add.renderTexture(200, 150, 400, 300).fill(0x990000);

    /** 
    * you can manually destroy this texture here and the leak is still present
    * this makes no real difference as the texture is destroyed when the scene is restarted
    */
    // rtex.destroy();

    // PRESS SPACEBAR TO RECREATE THE SCENE AND CAUSE THE LEAK - COMPARE MEMORY SNAPSHOTS TO OBSERVE BEFORE/AFTER
    // this.input.keyboard.removeAllListeners();
    // this.input.keyboard.once('keydown_SPACE', () => game.scene.start('MEMLEAK'));
// }
// 
// });

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: MyScene
};

const game = new Phaser.Game(config);
