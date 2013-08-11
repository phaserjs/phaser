/// <reference path="../../Phaser/Game.ts" />
var Physics = (function () {
    function Physics() {
        this.max_bodies = 512;
        this.max_vertices = 1024;
        this.max_edges = 1024;
        this.max_body_vertices = 64;
        this.max_body_edges = 64;
        this.vertices = [];
        this.edges = [];
        this.bodies = [];
    }
    Physics.prototype.updateForces = //  Sets the force on each vertex to the gravity force. You could of course apply other forces like magnetism etc.
    function () {
        for(var i = 0; i < this.vertexCount; i++) {
            this.vertices[i].acceleration = this.gravity;
        }
    };
    Physics.prototype.updateVerlet = //  Updates the vertex position
    function () {
        for(var i = 0; i < this.vertexCount; i++) {
            var v = this.vertices[i];
            var temp = v.position;
            //v.position.mutableAdd(
            //v.position += v.position - v.oldPosition + v.acceleration * this.timestep * this.timestep;
                    }
    };
    Physics.prototype.updateEdges = function () {
    };
    Physics.prototype.iterateCollisions = function () {
    };
    Physics.prototype.detectCollision = function (body1, body2) {
    };
    Physics.prototype.processCollision = function () {
    };
    Physics.prototype.intervalDistance = function (minA, maxA, minB, maxB) {
    };
    Physics.prototype.bodiesOverlap = function (body1, body2) {
    };
    Physics.prototype.update = //  CollisionInfo
    //  depth, normal, edge, vertex
    function () {
    };
    Physics.prototype.render = function () {
    };
    Physics.prototype.addBody = function (body) {
        this.bodies.push(body);
        this.bodyCount = this.bodies.length;
    };
    Physics.prototype.addEdge = function (edge) {
        this.edges.push(edge);
        this.edgeCount = this.edges.length;
    };
    Physics.prototype.addVertex = function (vertex) {
        this.vertices.push(vertex);
        this.vertexCount = this.vertices.length;
    };
    Physics.prototype.findVertex = function (x, y) {
    };
    return Physics;
})();
var PhysicsBody = (function () {
    function PhysicsBody() {
        this.vertices = [];
        this.edges = [];
    }
    PhysicsBody.prototype.addEdge = function (edge) {
    };
    PhysicsBody.prototype.addVertex = function (vertex) {
    };
    PhysicsBody.prototype.projectToAxis = function (axis, min, max) {
    };
    PhysicsBody.prototype.calculateCenter = function () {
    };
    PhysicsBody.prototype.createBox = function (x, y, width, height) {
    };
    return PhysicsBody;
})();
var Vertex = (function () {
    function Vertex(body, posX, posY) {
    }
    return Vertex;
})();
var Edge = (function () {
    function Edge(body, pV1, pV2, pBoundary) {
    }
    return Edge;
})();
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        myGame.loader.addImageFile('atari1', 'assets/sprites/atari130xe.png');
        myGame.loader.load();
    }
    function create() {
        var p = new Physics();
        //p.max_bodies
            }
    function update() {
    }
    function render() {
        //myGame.stage.context.strokeStyle = 'rgb(0,255,0)';
        //myGame.stage.context.beginPath();
        //myGame.stage.context.moveTo(poly1.points[0].x + poly1.pos.x, poly1.points[0].y + poly1.pos.y);
        //for (var i = 1; i < poly1.points.length; i++)
        //{
        //    myGame.stage.context.lineTo(poly1.points[i].x + poly1.pos.x, poly1.points[i].y + poly1.pos.y);
        //}
        //myGame.stage.context.lineTo(poly1.points[0].x + poly1.pos.x, poly1.points[0].y + poly1.pos.y);
        //myGame.stage.context.stroke();
        //myGame.stage.context.closePath();
            }
})();
