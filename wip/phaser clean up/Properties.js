var Shapes;
(function (Shapes) {

    var Point = Shapes.Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.getDist = function () {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        };
        Point.origin = new Point(0, 0);
        return Point;
    })();

})(Shapes || (Shapes = {}));

var p = new Shapes.Point(3, 4);
var dist = p.getDist(); 
