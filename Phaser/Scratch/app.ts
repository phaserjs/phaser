module Phaser {

    export class Point1 {

        constructor(x: number = 0, y: number = 0) {

            //this.values = (typeof Float32Array !== 'undefined') ? new Float32Array(2) : new Array;
            this.x = x;
            this.y = y;

        }

        x: number;
        y: number;

        public add(dx: number, dy: number): Point1 {

            this.x += dx;
            this.y += dy;

            return this;

        }

    }

    export class Point2 {

        constructor(x: number = 0, y: number = 0) {

            this.values = new Float32Array(2);
            this.values[0] = x;
            this.values[1] = y;

        }

        get x(): number {
            return this.values[0];
        }

        get y(): number {
            return this.values[1];
        }

        set x(v: number) {
            this.values[0] = v;
        }

        set y(v: number) {
            this.values[1] = v;
        }

        values;

        public add(dx: number, dy: number): Point2 {

            this.values[0] += dx;
            this.values[1] += dy;

            return this;

        }

    }

}

window.onload = () => {

    var b = document.getElementById('start').onclick = test;
    var e = document.getElementById('content');

    function test() {

        var started = Date.now();

        var a = new Phaser.Point1(Math.random(), Math.random());

        for (var i = 0; i < 10000000; i++)
        {
            var b = new Phaser.Point1(Math.random(), Math.random());
            a.add(b.x, b.y);
        }

        var ended = Date.now();
        var duration = (ended - started) / 1000;

        var s = 'Test started: ' + started + '\n';
        s = s + 'Test ended: ' + ended + '\n';
        s = s + 'Duration: ' + duration + '\n';
        e.textContent = s;

    }

};