class SceneF extends Phaser.Scene {

    constructor ()
    {
        super('SceneF');

        this.mines = [];
    }

    create ()
    {
        this.cameras.main.setViewport(0, 136, 1024, 465);

        for (let i = 0; i < 8; i++)
        {
            let x = Phaser.Math.Between(400, 1400);
            let y = Phaser.Math.Between(0, 460);

            let mine = this.add.sprite(x, y, 'mine').play('mine');

            mine.setData('vx', Phaser.Math.FloatBetween(0.08, 0.14));

            this.mines.push(mine);
        }
    }

    update (time, delta)
    {
        for (let i = 0; i < this.mines.length; i++)
        {
            let mine = this.mines[i];

            mine.x -= mine.getData('vx') * delta;

            if (mine.x <= -100)
            {
                mine.x = 1224;
                mine.y = Phaser.Math.Between(0, 460);
            }
        }
    }

}
