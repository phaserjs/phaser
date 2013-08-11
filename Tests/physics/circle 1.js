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
    var b1;
    var b2;
    var b3;
    var b4;
    var b5;
    var b6;
    var b7;
    var b8;
    var b9;
    var b10;
    var c;
    var t;
    var ball;
    var carrot1;
    var carrot2;
    var carrot3;
    var carrot4;
    var carrot5;
    var carrot6;
    var carrot7;
    var carrot8;
    var carrot9;
    var carrot10;

    function create() {
        //this.ball = game.add.sprite(0, 0, 'ball');
        var f = [null, 'tommy', 'alice', 'mummy', 'tommy', 'alice', 'mummy', 'tommy', 'alice', 'mummy', 'tommy', 'alice', 'mummy', 'tommy', 'alice', 'mummy', 'tommy', 'alice', 'mummy'];

        for (var i = 1; i <= 10; i++) {
            this['carrot' + i] = game.add.sprite(0, 0, f[i]);

            //this['carrot' + i].scale.setTo(0.5, 0.5);
            this['b' + i] = game.add.aabb(game.stage.randomX, 200, 50, 50);
        }

        //this.c = game.add.circle(200, 200, 16);
        //  pos is center, not upper-left
        this.cells = [];

        var tid;

        for (var i = 0; i < 10; i++) {
            if (i % 2 == 0) {
                tid = Phaser.Physics.TileMapCell.TID_CONCAVEpn;
                //tid = Phaser.Physics.TileMapCell.TID_22DEGnnS;
            } else {
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

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            fx -= 0.2;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            fx += 0.2;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            fy -= 0.2 + 0.2;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            fy += 0.2;
        }

        for (var i = 1; i <= 10; i++) {
            this['b' + i].pos.x = this['b' + i].oldpos.x + Math.min(40, Math.max(-40, this['b' + i].pos.x - this['b' + i].oldpos.x + fx));
            this['b' + i].pos.y = this['b' + i].oldpos.y + Math.min(40, Math.max(-40, this['b' + i].pos.y - this['b' + i].oldpos.y + fy));
            this['b' + i].integrateVerlet();
        }

        for (var i = 0; i < this.cells.length; i++) {
            for (var ib = 1; ib <= 10; ib++) {
                this['b' + ib].collideAABBVsTile(this.cells[i]);
            }
        }

        for (var i = 1; i <= 10; i++) {
            this['b' + i].collideAABBVsWorldBounds();
        }

        for (var i = 1; i <= 10; i++) {
            this['carrot' + i].transform.centerOn(this['b' + i].pos.x, this['b' + i].pos.y);
        }
        //this.ball.transform.centerOn(this.c.pos.x, this.c.pos.y);
    }

    function render() {
        for (var i = 0; i < this.cells.length; i++) {
            this.cells[i].render(game.stage.context);
        }
    }
})();
