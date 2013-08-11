/// <reference path="../../Phaser/_definitions.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create, update, render);

    function preload() {
        game.load.image('ball', 'assets/sprites/shinyball.png');
        game.load.image('card', 'assets/sprites/mana_card.png');
    }

    var cells;
    var b;
    var c;
    var t;
    var ball;
    var card;

    function create() {
        this.ball = game.add.sprite(0, 0, 'ball');

        this.card = game.add.sprite(0, 0, 'card');
        this.card.rotation = 30;

        this.c = game.add.circle(200, 200, 16);
        this.b = game.add.aabb(400, 200, 74, 128);

        //  pos is center, not upper-left
        this.cells = [];

        var tid;

        for (var i = 0; i < 10; i++) {
            if (i % 2 == 0) {
                tid = Phaser.Physics.TileMapCell.TID_CONCAVEpn;
            } else {
                tid = Phaser.Physics.TileMapCell.TID_CONCAVEnn;
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

        //  update circle
        this.c.pos.x = this.c.oldpos.x + Math.min(20, Math.max(-20, this.c.pos.x - this.c.oldpos.x + fx));
        this.c.pos.y = this.c.oldpos.y + Math.min(20, Math.max(-20, this.c.pos.y - this.c.oldpos.y + fy));
        this.c.IntegrateVerlet();

        //  update box
        this.b.pos.x = this.b.oldpos.x + Math.min(40, Math.max(-40, this.b.pos.x - this.b.oldpos.x + fx));
        this.b.pos.y = this.b.oldpos.y + Math.min(40, Math.max(-40, this.b.pos.y - this.b.oldpos.y + fy));
        this.b.IntegrateVerlet();

        for (var i = 0; i < this.cells.length; i++) {
            this.c.CollideCircleVsTile(this.cells[i]);
            this.b.CollideAABBVsTile(this.cells[i]);
        }

        this.c.CollideCircleVsWorldBounds();
        this.b.CollideAABBVsWorldBounds();

        this.ball.transform.centerOn(this.c.pos.x, this.c.pos.y);
        this.card.transform.centerOn(this.b.pos.x, this.b.pos.y);
    }

    function render() {
        this.c.render(game.stage.context);
        this.b.render(game.stage.context);

        for (var i = 0; i < this.cells.length; i++) {
            this.cells[i].render(game.stage.context);
        }
    }
})();
