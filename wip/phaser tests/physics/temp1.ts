/// <reference path="../../Phaser/Game.ts" />

class Physics {

    constructor() {

        this.vertices = [];
        this.edges = [];
        this.bodies = [];

    }

    public gravity: Phaser.Vector2;

    public max_bodies: number = 512;
    public max_vertices: number = 1024;
    public max_edges: number = 1024;
    public max_body_vertices: number = 64;
    public max_body_edges: number = 64;

    public bodyCount: number;
    public vertexCount: number;
    public edgeCount: number;
    public timestep: number;
    public iterations;

    public vertices: Vertex[];
    public edges: Edge[];
    public bodies: PhysicsBody[];

    //  Sets the force on each vertex to the gravity force. You could of course apply other forces like magnetism etc.
    public updateForces() {

        for (var i:number = 0; i < this.vertexCount; i++)
        {
            this.vertices[i].acceleration = this.gravity;
        }
    }

    //  Updates the vertex position
    public updateVerlet() {

        for (var i:number = 0; i < this.vertexCount; i++)
        {
            var v:Vertex = this.vertices[i];
            var temp: Phaser.Vector2 = v.position;
            //v.position.mutableAdd(
            //v.position += v.position - v.oldPosition + v.acceleration * this.timestep * this.timestep;
        }

    }

    public updateEdges() {
    }

    public iterateCollisions() {
    }

    public detectCollision(body1, body2) {
    }

    public processCollision() {
    }

    public intervalDistance(minA, maxA, minB, maxB) {
    }

    public bodiesOverlap(body1, body2) {
    }

    //  CollisionInfo
    //  depth, normal, edge, vertex

    public update() {
    }

    public render() {
    }

    public addBody(body:PhysicsBody) {
        this.bodies.push(body);
        this.bodyCount = this.bodies.length;
    }

    public addEdge(edge:Edge) {
        this.edges.push(edge);
        this.edgeCount = this.edges.length;
    }

    public addVertex(vertex:Vertex) {
        this.vertices.push(vertex);
        this.vertexCount = this.vertices.length;
    }

    public findVertex(x, y) {
    }

}

class PhysicsBody {

    constructor() {
    }

    center: Phaser.Vector2;
    minX;
    minY;
    maxX;
    maxY;
    vertextCount;
    edgeCount;

    vertices = [];
    edges = [];

    public addEdge(edge) {
    }

    public addVertex(vertex) {

    }

    public projectToAxis(axis, min, max) {
    }

    public calculateCenter() {
    }

    public createBox(x, y, width, height) {
    }

}

class Vertex {

    constructor(body, posX, posY) {
    }

    position: Phaser.Vector2;
    oldPosition: Phaser.Vector2;
    acceleration: Phaser.Vector2;
    parent: PhysicsBody;
}

class Edge {

    constructor(body, pV1, pV2, pBoundary) {
    }

    v1: Vertex;
    v2: Vertex;
    length;
    boundary;
    parent: PhysicsBody;

}

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
