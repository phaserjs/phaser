/**
 * The MIT License (MIT)

 * Copyright (c) 2014 Raphaël Roux

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * 
 *
 */

/**
 * @author       Raphaël Roux
 * @copyright    2014 Raphaël Roux
 * @license      {@link http://opensource.org/licenses/MIT}
 */

/**
* AStar is a phaser pathfinding plugin based on an A* kind of algorythm 
* It works with the Phaser.Tilemap
*
* @class Phaser.Plugin.AStar
* @constructor
* @param {Any} parent - The object that owns this plugin, usually Phaser.PluginManager.
*/
Phaser.Plugin.AStar = function (parent)
{

    /**
    * @property {Any} parent - The parent of this plugin. If added to the PluginManager the parent will be set to that, otherwise it will be null.
    */
    this.parent = parent;

    /**
    * @property {Phaser.Tilemap} _tilemap - A reference to the tilemap used to store astar nodes according to the Phaser.Tilemap structure.
    */
    this._tilemap;

    /**
    * @property {number} _layerIndex - The layer index of the tilemap that is used to store astar nodes.
    */
    this._layerIndex;

    /**
    * @property {number} _tilesetIndex - The tileset index of the tileset that handle tiles properties.
    */
    this._tilesetIndex;
   
    /**
    * @property {array} _open - An array that references nodes to be considered by the search path algorythm.
    */
    this._open; 

    /**
    * @property {array} _closed - An array that references nodes not to consider anymore.
    */
    this._closed; 
   
    /**
    * @property {array} _visited - Internal array of visited tiles, use for debug pupose.
    */
    this._visited; 

    /**
    * @property {boolean} _useDiagonal - Does the astar algorythm can use tile diagonal?
    * @default true
    */
    this._useDiagonal = true;

    /**
    * @property {boolean} _findClosest - Does the findPath algorythm must calculate the closest result if destination is unreachable. If not findPath will return an empty array
    * @default true
    */
    this._findClosest = true;

    /**
    * @property {string} _walkablePropName - Wich name have the walkable propertiy in your tileset.
    * @default 'walkable'
    */
    this._walkablePropName = 'walkable';

    /**
    * @property {function} _distanceFunction - The function used to calculate distance.
    */
    this._distanceFunction = Phaser.Plugin.AStar.DISTANCE_EUCLIDIAN;

    /**
    * @property {Phaser.Plugin.AStar.AStarPath} _lastPath - The last path calculated by astar.
    */
    this._lastPath = null; 

    /**
    * @property {boolean} _debug - Boolean to debug mode, stores visited nodes, and have a cost. Disable in production.
    * @default false
    */
    this._debug = true;
};

Phaser.Plugin.AStar.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.AStar.prototype.constructor = Phaser.Plugin.AStar;


Phaser.Plugin.AStar.VERSION = '0.0.101';
Phaser.Plugin.AStar.COST_ORTHOGONAL = 1;
Phaser.Plugin.AStar.COST_DIAGONAL = Phaser.Plugin.AStar.COST_ORTHOGONAL*Math.sqrt(2);
Phaser.Plugin.AStar.DISTANCE_MANHATTAN = 'distManhattan';
Phaser.Plugin.AStar.DISTANCE_EUCLIDIAN = 'distEuclidian';

/**
 * Sets the Phaser.Tilemap used to searchPath into.
 * @method Phaser.Plugin.AStar#setAStarMap
 * @public
 * @param {Phaser.Tilemap} map - the Phaser.Tilemap used to searchPath into. It must have a tileset with tile porperties to know if tiles are walkable or not.
 * @param {string} layerName - The name of the layer that handle tiles.
 * @param {string} tilesetName - The name of the tileset that have walkable properties.
 * @return {Phaser.Plugin.AStar} The Phaser.Plugin.AStar itself.
 */
Phaser.Plugin.AStar.prototype.setAStarMap = function(map, layerName, tilesetName)
{
    this._tilemap = map;
    this._layerIndex = this._tilemap.getLayerIndex(layerName);;
    this._tilesetIndex = this._tilemap.getTilesetIndex(tilesetName);

    this.updateMap();

    return this;
};


/**
 * Sets the Phaser.Tilemap used to searchPath into.
 * @method Phaser.Plugin.AStar-setAStarMap
 * @private
 * @return {void} The Phaser.Plugin.AStar itself.
 */
 Phaser.Plugin.AStar.prototype.updateMap = function()
{
    var tile;
    var walkable;

    //for each tile, add a default AStarNode with x, y and walkable properties according to the tilemap/tileset datas
    for(var y=0; y < this._tilemap.height; y++)
    {
        for(var x=0; x < this._tilemap.width; x++)
        {
            tile = this._tilemap.layers[this._layerIndex].data[y][x];
            walkable = this._tilemap.tilesets[this._tilesetIndex].tileProperties[tile.index - 1][this._walkablePropName] !== "false" ? true : false;
            tile.properties.astarNode = new Phaser.Plugin.AStar.AStarNode(x, y, walkable);
        }
    }

};


/**
 * Find a path between to tiles coordinates
 * @method Phaser.Plugin.AStar#findPath
 * @public
 * @param {Phaser.Point} startPoint - The start point x, y in tiles coordinates to search a path.
 * @param {Phaser.Point} goalPoint - The goal point x, y in tiles coordinates that you trying to reach.
 * @return {Phaser.Plugin.AStar.AStarPath} The Phaser.Plugin.AStar.AStarPath that results
 */
Phaser.Plugin.AStar.prototype.findPath = function(startPoint, goalPoint)
{
    var path = new Phaser.Plugin.AStar.AStarPath();

    var start = this._tilemap.layers[this._layerIndex].data[startPoint.y][startPoint.x].properties.astarNode; //:AStarNode;
    var goal = this._tilemap.layers[this._layerIndex].data[goalPoint.y][goalPoint.x].properties.astarNode

    path.start = start;
    path.goal = goal;

    this._open = [];
    this._closed = [];
    this._visited = [];
   
    this._open.push(start);
    
    start.g = 0;
    start.h = this[this._distanceFunction](start, goal);
    start.f = start.h;
    start.parent = null;                    
   
    //Loop until there are no more nodes to search
    while(this._open.length > 0) 
    {
        //Find lowest f in this._open
        var f = Infinity;
        var x;
        for (var i=0; i<this._open.length; i++) 
        {
            if (this._open[i].f < f) 
            {
                x = this._open[i];
                f = x.f;
            }
        }
       
        //Solution found, return solution
        if (x == goal) 
        {
            path.nodes = this.reconstructPath(goal);
            this._lastPath = path;
            if(this._debug === true) path.visited = this._visited;
            return path;
        }    
       
        //Close current node
        this._open.splice(this._open.indexOf(x), 1);
        this._closed.push(x);
       
        //Then get its neighbors       
        var n = this.neighbors(x);

        for(var yIndex=0; yIndex < n.length; yIndex++) 
        {

            var y = n[yIndex];
               
            if (-1 != this._closed.indexOf(y))
                continue;
           
            var g = x.g + y.travelCost;
            var better = false;
           
            //Add the node for being considered next loop.
            if (-1 == this._open.indexOf(y)) 
            {
                    this._open.push(y);
                    better = true;
                    if(this._debug === true) this.visit(y);
            } 
            else if (g < y.g) 
            {
                    better = true;
            }

            if (better) {
                    y.parent = x;
                    y.g = g;
                    y.h = this[this._distanceFunction](y, goal);
                    y.f = y.g + y.h;
            }
               
        }
           
    }

    //If no solution found, does A* try to return the closest result?
    if(this._findClosest === true)
    {
        var min = Infinity;
        var closestGoal, node, dist;
        for(var i=0, ii=this._closed.length; i<ii; i++) 
        {
            node = this._closed[i];

            var dist = this[this._distanceFunction](goal, node);
            if (dist < min) 
            {
                min = dist;
                closestGoal = node;
            }
        }

        //Reconstruct a path a path from the closestGoal
        path.nodes = this.reconstructPath(closestGoal);
        if(this._debug === true) path.visited = this._visited;
    }

    this._lastPath = path;

    return path;                              
};


/**
 * Reconstruct the result path backwards from the goal point, crawling its parents. Internal method.
 * @method Phaser.Plugin.AStar-reconstructPath
 * @private
 * @param {Phaser.Plugin.AStar.AStarNode} n - The astar node from wich you want to rebuild the path.
 * @return {array} An array of Phaser.Plugin.AStar.AStarNode
 */ 
Phaser.Plugin.AStar.prototype.reconstructPath = function(n) 
{
    var solution = [];
    var nn = n;
    while(nn.parent) {
            solution.push({x: nn.x, y: nn.y});
            nn = nn.parent;
    }
    return solution;
};

 
/**
 * Add a node into visited if it is not already in. Debug only.
 * @method Phaser.Plugin.AStar-visit
 * @private
 * @param {Phaser.Plugin.AStar.AStarNode} node - The astar node you want to register as visited
 * @return {void}
 */ 
Phaser.Plugin.AStar.prototype.visit = function(node)
{
    for(var i in this._visited)
    {
        if (this._visited[i] == node) return;
    }

    this._visited.push(node);
};
   

/**
 * Add a node into visited if it is not already in. Debug only.
 * @method Phaser.Plugin.AStar-neighbors
 * @private
 * @param {Phaser.Plugin.AStar.AStarNode} n - The astar node you want to register as visited
 * @return {void}
 */
Phaser.Plugin.AStar.prototype.neighbors = function(node)
{
    var x = node.x;
    var y = node.y;
    var n = null;
    var neighbors = [];
   
    var map = this._tilemap.layers[this._layerIndex].data;

    //West
    if (x > 0) {
           
        n = map[y][x-1].properties.astarNode;
        if (n.walkable) {
            n.travelCost = Phaser.Plugin.AStar.COST_ORTHOGONAL;
            neighbors.push(n);
        }
    }
    //East
    if (x < this._tilemap.width-1) {
        n = map[y][x+1].properties.astarNode;
        if (n.walkable) {
            n.travelCost = Phaser.Plugin.AStar.COST_ORTHOGONAL;
            neighbors.push(n);
        }
    }
    //North
    if (y > 0) {
        n = map[y-1][x].properties.astarNode;
        if (n.walkable) {
            n.travelCost = Phaser.Plugin.AStar.COST_ORTHOGONAL;
            neighbors.push(n);
        }
    }
    //South
    if (y < this._tilemap.height-1) {
        n = map[y+1][x].properties.astarNode;
        if (n.walkable) {
            n.travelCost = Phaser.Plugin.AStar.COST_ORTHOGONAL;
            neighbors.push(n);
        }
    }
   
    //If diagonals aren't used do not search for other neighbors and return orthogonal search result
    if(this._useDiagonal === false)
        return neighbors;
   
    //NorthWest
    if (x > 0 && y > 0) {
        n = map[y-1][x-1].properties.astarNode;
        if (n.walkable
            && map[y][x-1].properties.astarNode.walkable
            && map[y-1][x].properties.astarNode.walkable
        ) {                                            
            n.travelCost = Phaser.Plugin.AStar.COST_DIAGONAL;
            neighbors.push(n);
        }
    }
    //NorthEast
    if (x < this._tilemap.width-1 && y > 0) {
        n = map[y-1][x+1].properties.astarNode;
        if (n.walkable
            && map[y][x+1].properties.astarNode.walkable
            && map[y-1][x].properties.astarNode.walkable
        ) {
            n.travelCost = Phaser.Plugin.AStar.COST_DIAGONAL;
            neighbors.push(n);
        }
    }
    //SouthWest
    if (x > 0 && y < this._tilemap.height-1) {
        n = map[y+1][x-1].properties.astarNode;
        if (n.walkable
            && map[y][x-1].properties.astarNode.walkable
            && map[y+1][x].properties.astarNode.walkable
        ) {
            n.travelCost = Phaser.Plugin.AStar.COST_DIAGONAL;
            neighbors.push(n);
        }
    }
    //SouthEast
    if (x < this._tilemap.width-1 && y < this._tilemap.height-1) {
        n = map[y+1][x+1].properties.astarNode;
        if (n.walkable
            && map[y][x+1].properties.astarNode.walkable
            && map[y+1][x].properties.astarNode.walkable
        ) {
            n.travelCost = Phaser.Plugin.AStar.COST_DIAGONAL;
            neighbors.push(n);
        }
    }
   
    return neighbors;
};


/**
 * Calculate a distance between tow astar nodes coordinates according to the Manhattan method
 * @method Phaser.Plugin.AStar-distManhattan
 * @private
 * @param {Phaser.Plugin.AStar.AStarNode} nodeA - The A node.
 * @param {Phaser.Plugin.AStar.AStarNode} nodeB - The B node.
 * @return {number} The distance between nodeA and nodeB
 */
Phaser.Plugin.AStar.prototype.distManhattan = function (nodeA, nodeB) 
{
    return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
};

/**
 * Calculate a distance between tow astar nodes coordinates according to the Euclidian method. More accurate
 * @method Phaser.Plugin.AStar-distEuclidian
 * @private
 * @param {Phaser.Plugin.AStar.AStarNode} nodeA - The A node.
 * @param {Phaser.Plugin.AStar.AStarNode} nodeB - The B node.
 * @return {number} The distance between nodeA and nodeB
 */
Phaser.Plugin.AStar.prototype.distEuclidian = function(nodeA, nodeB)
{
    return Math.sqrt(Math.pow((nodeA.x - nodeB.x), 2) + Math.pow((nodeA.y  -nodeB.y), 2));
};


/**
 * Tells if a tile is walkable from its tilemap coordinates
 * @method Phaser.Plugin.AStar-isWalkable
 * @public
 * @param {number} x - The x coordiante of the tile in tilemap's coordinate.
 * @param {number} y - The y coordinate of the tile in tilemap's coordinate.
 * @return {boolean} The distance between nodeA and nodeB
 */
Phaser.Plugin.AStar.prototype.isWalkable = function(x, y)
{  
    return this._tilemap.layers[this._layerIndex].data[y][x].properties.astarNode.walkable;
};


/**
 * @properties {string} version - The version number of Phaser.Plugin.AStar read only
 */
Object.defineProperty(Phaser.Plugin.AStar.prototype, "version", {
    
    get: function () {
        return Phaser.Plugin.AStar.VERSION;
    }

});

        
/**
* AStarNode is an object that stores AStar value. Each tile have an AStarNode in their properties
* @class Phaser.Plugin.AStar.AStarNode
* @constructor
* @param {number} x - The x coordinate of the tile.
* @param {number} y - The y coordinate of the tile.
* @param {boolean} isWalkable - Is this tile is walkable?
*/
Phaser.Plugin.AStar.AStarNode = function(x, y, isWalkable)
{

    /**
    * @property {number} x - The x coordinate of the tile.
    */
    this.x = x;
    
    /**
    * @property {number} y - The y coordinate of the tile.
    */
    this.y = y;

    /**
    * @property {number} g - The total travel cost from the start point. Sum of COST_ORTHOGONAL and COST_DIAGONAL
    */
    this.g = 0;

    /**
    * @property {number} h - The remaing distance as the crow flies between this node and the goal.
    */
    this.h = 0;

    /**
    * @property {number} f - The weight. Sum of g + h.
    */
    this.f = 0;

    /**
     * @property {Phaser.Plugin.AStar.AStarNode} parent - Where do we come from? It's an AStarNode reference needed to reconstruct a path backwards (from goal to start point)
     */
    this.parent; 

    /**
     * @property {boolean} walkable - Is this node is walkable?
     */
    this.walkable = isWalkable;

    /**
     * @property {number} travelCost - The cost to travel to this node, COST_ORTHOGONAL or COST_DIAGONAL 
     */
    this.travelCost;
};


/**
* AStarPath is an object that stores a searchPath result.
* @class Phaser.Plugin.AStar.AStarPath
* @constructor
* @param {array} nodes - An array of nodes coordinates sorted backward from goal to start point.
* @param {Phaser.Plugin.AStarNode} start - The start AStarNode used for the searchPath.
* @param {Phaser.Plugin.AStarNode} goal - The goal AStarNode used for the searchPath.
*/
Phaser.Plugin.AStar.AStarPath = function(nodes, start, goal)
{
    /**
     * @property {array} nodes - Array of AstarNodes x, y coordiantes that are the path solution from goal to start point. 
     */
    this.nodes = nodes || [];

    /**
     * @property {Phaser.Plugin.Astar.AStarNode} start - Reference to the start point used by findPath. 
     */
    this.start = start || null;

    /**
     * @property {Phaser.Plugin.Astar.AStarNode} goal - Reference to the goal point used by findPath. 
     */
    this.goal = goal || null;

    /**
     * @property {array} visited - Array of AStarNodes that the findPath algorythm has visited. Used for debug only.
     */
    this.visited = [];
};


/**
* Debug method to draw the last calculated path by AStar
* @method Phaser.Utils.Debug.AStar
* @param {Phaser.Plugin.AStar} astar- The AStar plugin that you want to debug.
* @param {number} x - X position on camera for debug display.
* @param {number} y - Y position on camera for debug display.
* @param {string} color - Color to stroke the path line.
* @return {void}
*/
Phaser.Utils.Debug.prototype.AStar = function(astar, x, y, color, showVisited)
{
    if (this.context == null)
    {
        return;
    }
    
    var pathLength = 0;
    if(astar._lastPath !== null)
    {
        pathLength = astar._lastPath.nodes.length;
    }

    color = color || 'rgb(255,255,255)';

    game.debug.start(x, y, color);


    if(pathLength > 0)
    {
        var node = astar._lastPath.nodes[0];
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo((node.x * astar._tilemap.tileWidth) + (astar._tilemap.tileWidth/2) - game.camera.view.x, (node.y * astar._tilemap.tileHeight) + (astar._tilemap.tileHeight/2) - game.camera.view.y);

        for(var i=0; i<pathLength; i++)
        {
            node = astar._lastPath.nodes[i];
            this.context.lineTo((node.x * astar._tilemap.tileWidth) + (astar._tilemap.tileWidth/2) - game.camera.view.x, (node.y * astar._tilemap.tileHeight) + (astar._tilemap.tileHeight/2) - game.camera.view.y);
        }

        this.context.lineTo((astar._lastPath.start.x * astar._tilemap.tileWidth) + (astar._tilemap.tileWidth/2) - game.camera.view.x, (astar._lastPath.start.y * astar._tilemap.tileHeight) + (astar._tilemap.tileHeight/2) - game.camera.view.y);

        this.context.stroke(); 

        //Draw circles on visited nodes
        if(showVisited !== false)
        {
            var visitedNode;
            for(var j=0; j < astar._lastPath.visited.length; j++)
            {
                visitedNode = astar._lastPath.visited[j];
                this.context.beginPath();
                this.context.arc((visitedNode.x * astar._tilemap.tileWidth) + (astar._tilemap.tileWidth/2) - game.camera.view.x, (visitedNode.y * astar._tilemap.tileHeight) + (astar._tilemap.tileHeight/2) - game.camera.view.y, 2, 0, Math.PI*2, true);
                this.context.stroke(); 
            }
        }
    }

    this.line('Path length: ' + pathLength);
    this.line('Distance func: ' + astar._distanceFunction);
    this.line('Use diagonal: ' + astar._useDiagonal);
    this.line('Find Closest: ' + astar._findClosest);

    game.debug.stop();
};




