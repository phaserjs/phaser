/// <reference path="../../Phaser/_definitions.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);

    function preload() {

        game.load.image('ball', 'assets/sprites/shinyball.png');
        game.load.image('tommy', 'assets/tommy.png');
        game.load.image('alice', 'assets/alice.png');
        game.load.image('mummy', 'assets/mummy.png');

    }

    var cells;
    var b1: Phaser.Physics.AABB;
    var b2: Phaser.Physics.AABB;
    var b3: Phaser.Physics.AABB;
    var b4: Phaser.Physics.AABB;
    var b5: Phaser.Physics.AABB;
    var b6: Phaser.Physics.AABB;
    var b7: Phaser.Physics.AABB;
    var b8: Phaser.Physics.AABB;
    var b9: Phaser.Physics.AABB;
    var b10: Phaser.Physics.AABB;
    var c: Phaser.Physics.Circle;
    var t: Phaser.Physics.TileMapCell;
    var ball: Phaser.Sprite;
    var carrot1: Phaser.Sprite;
    var carrot2: Phaser.Sprite;
    var carrot3: Phaser.Sprite;
    var carrot4: Phaser.Sprite;
    var carrot5: Phaser.Sprite;
    var carrot6: Phaser.Sprite;
    var carrot7: Phaser.Sprite;
    var carrot8: Phaser.Sprite;
    var carrot9: Phaser.Sprite;
    var carrot10: Phaser.Sprite;

    function create() {

        //this.ball = game.add.sprite(0, 0, 'ball');

        var f = [null, 'tommy', 'alice', 'mummy', 'tommy', 'alice', 'mummy', 'tommy', 'alice', 'mummy', 'tommy', 'alice', 'mummy', 'tommy', 'alice', 'mummy', 'tommy', 'alice', 'mummy'];

        for (var i = 1; i <= 10; i++)
        {
            this['carrot' + i] = game.add.sprite(0, 0, f[i]);
            //this['carrot' + i].scale.setTo(0.5, 0.5);
            this['b' + i] = game.add.aabb(game.stage.randomX, 200, 50, 50);
        }

        //this.c = game.add.circle(200, 200, 16);

        //  pos is center, not upper-left
        this.cells = [];

        var tid;

        for (var i = 0; i < 10; i++)
        {
            if (i % 2 == 0)
            {
                tid = Phaser.Physics.TileMapCell.TID_CONCAVEpn;
                //tid = Phaser.Physics.TileMapCell.TID_22DEGnnS;
            }
            else
            {
                tid = Phaser.Physics.TileMapCell.TID_CONCAVEnn;
                //tid = Phaser.Physics.TileMapCell.TID_22DEGpnS;
            }

            this.cells.push(game.add.cell(100 + (i * 100), 400, 50, 50, tid));
            //this.cells.push(new TileMapCell(100 + (i * 100), 500, 50, 50).SetState(TileMapCell.TID_FULL));
            //this.cells.push(new TileMapCell(100 + (i * 100), 500, 50, 50).SetState(TileMapCell.TID_CONCAVEpn));
        }

    }

    function update() {

        var fx = 0;
        var fy = 0;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            fx -= 0.2;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            fx += 0.2;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            fy -= 0.2 + 0.2;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            fy += 0.2;
        }

        //  update circle
        //this.c.pos.x = this.c.oldpos.x + Math.min(20, Math.max(-20, this.c.pos.x - this.c.oldpos.x + fx));
        //this.c.pos.y = this.c.oldpos.y + Math.min(20, Math.max(-20, this.c.pos.y - this.c.oldpos.y + fy));
        //this.c.integrateVerlet();

        //  update box
        for (var i = 1; i <= 10; i++)
        {
            this['b' + i].pos.x = this['b' + i].oldpos.x + Math.min(40, Math.max(-40, this['b' + i].pos.x - this['b' + i].oldpos.x + fx));
            this['b' + i].pos.y = this['b' + i].oldpos.y + Math.min(40, Math.max(-40, this['b' + i].pos.y - this['b' + i].oldpos.y + fy));
            this['b' + i].integrateVerlet();
        }

        for (var i = 0; i < this.cells.length; i++)
        {
            //this.c.collideCircleVsTile(this.cells[i]);
            for (var ib = 1; ib <= 10; ib++)
            {
                this['b' + ib].collideAABBVsTile(this.cells[i]);
            }
        }

        for (var i = 1; i <= 10; i++)
        {
            this['b' + i].collideAABBVsWorldBounds();
        }

        //this.c.collideCircleVsWorldBounds();
        for (var i = 1; i <= 10; i++)
        {
            this['carrot' + i].transform.centerOn(this['b' + i].pos.x, this['b' + i].pos.y);
        }

        //this.ball.transform.centerOn(this.c.pos.x, this.c.pos.y);

    }

    function render() {

        //this.c.render(game.stage.context);
        //this.b.render(game.stage.context);

        for (var i = 0; i < this.cells.length; i++)
        {
            this.cells[i].render(game.stage.context);
        }

    }

})();
