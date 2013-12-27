/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A RenderTexture is a special texture that allows any displayObject to be rendered to it.
* @class Phaser.RenderTexture
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {string} key - Asset key for the render texture.
* @param {number} width - the width of the render texture.
* @param {number} height - the height of the render texture.
*/
Phaser.RenderTexture = function (game, key, width, height) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game. 
    */
    this.game = game;

    /**
    * @property {string} name - the name of the object. 
    */
    this.name = key;

    PIXI.EventTarget.call(this);

    /**
    * @property {number} width - the width. 
    */
    this.width = width || 100;
    
    /**
    * @property {number} height - the height. 
    */
    this.height = height || 100;

    /**
    * @property {PIXI.mat3} indetityMatrix - Matrix object. 
    */
    this.indetityMatrix = PIXI.mat3.create();

    /**
    * @property {PIXI.Rectangle} frame - The frame for this texture. 
    */
    this.frame = new PIXI.Rectangle(0, 0, this.width, this.height);

    /**
    * @property {number} type - Base Phaser object type. 
    */
    this.type = Phaser.RENDERTEXTURE;

    this._tempPoint = { x: 0, y: 0 };

    if (PIXI.gl)
    {
        this.initWebGL();
    }
    else
    {
        this.initCanvas();
    }
    
};

Phaser.RenderTexture.prototype = Object.create(PIXI.Texture.prototype);
Phaser.RenderTexture.prototype.constructor = PIXI.RenderTexture;

/**
* This function will draw the display object to the texture. If the display object is a Group or has children it will
* draw all children as well.
* 
* @method Phaser.RenderTexture#render
* @memberof Phaser.RenderTexture
* @param {DisplayObject} displayObject - The display object to render this texture on.
* @param {Phaser.Point} [position] - Where to draw the display object.
* @param {boolean} [clear=false] - If true the texture will be cleared before the displayObject is drawn.
* @param {boolean} [renderHidden=false] - If true displayObjects that have their visible property set to false will still be rendered.
*/
Phaser.RenderTexture.prototype.render = function(displayObject, position, clear, renderHidden) {

    if (typeof position === 'undefined') { position = false; }
    if (typeof clear === 'undefined') { clear = false; }
    if (typeof renderHidden === 'undefined') { renderHidden = false; }

    if (displayObject instanceof Phaser.Group)
    {
        displayObject = displayObject._container;
    }

    if (PIXI.gl)
    {
        this.renderWebGL(displayObject, position, clear, renderHidden);
    }
    else
    {
        this.renderCanvas(displayObject, position, clear, renderHidden);
    }

}

/**
* This function will draw the display object to the texture at the given x/y coordinates.
* If the display object is a Group or has children it will draw all children as well.
*
* @method Phaser.RenderTexture#renderXY
* @memberof Phaser.RenderTexture
* @param {DisplayObject} displayObject - The display object to render this texture on.
* @param {number} x - The x coordinate to draw the display object at.
* @param {number} y - The y coordinate to draw the display object at.
* @param {boolean} [clear=false] - If true the texture will be cleared before the displayObject is drawn.
* @param {boolean} [renderHidden=false] - If true displayObjects that have their visible property set to false will still be rendered.
*/
Phaser.RenderTexture.prototype.renderXY = function(displayObject, x, y, clear, renderHidden) {

    this._tempPoint.x = x;
    this._tempPoint.y = y;

    this.render(displayObject, this._tempPoint, clear, renderHidden);

}

/**
* Initializes the webgl data for this texture
*
* @method Phaser.RenderTexture#initWebGL
* @memberof Phaser.RenderTexture
* @private
*/
Phaser.RenderTexture.prototype.initWebGL = function() {

    var gl = PIXI.gl;
    this.glFramebuffer = gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer );

    this.glFramebuffer.width = this.width;
    this.glFramebuffer.height = this.height;

    this.baseTexture = new PIXI.BaseTexture();

    this.baseTexture.width = this.width;
    this.baseTexture.height = this.height;

    this.baseTexture._glTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.baseTexture._glTexture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  this.width,  this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.baseTexture.isRender = true;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer );
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.baseTexture._glTexture, 0);

    // create a projection matrix..
    this.projection = new PIXI.Point(this.width/2 , -this.height/2);

    // set the correct render function..
    // this.render = this.renderWebGL;
}

/**
* Resizes the RenderTexture.
*
* @method Phaser.RenderTexture#resize
* @memberof Phaser.RenderTexture
*/
Phaser.RenderTexture.prototype.resize = function(width, height)
{

    this.width = width;
    this.height = height;
    
    if(PIXI.gl)
    {
        this.projection.x = this.width/2
        this.projection.y = -this.height/2;
    
        var gl = PIXI.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.baseTexture._glTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  this.width,  this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    else
    {
        
        this.frame.width = this.width
        this.frame.height = this.height;
        this.renderer.resize(this.width, this.height);
    }
}

/**
* Initializes the canvas data for this texture
*
* @method Phaser.RenderTexture#initCanvas
* @memberof Phaser.RenderTexture
* @private
*/
Phaser.RenderTexture.prototype.initCanvas = function()
{
    this.renderer = new PIXI.CanvasRenderer(this.width, this.height, null, 0);

    this.baseTexture = new PIXI.BaseTexture(this.renderer.view);
    this.frame = new PIXI.Rectangle(0, 0, this.width, this.height);

    // this.render = this.renderCanvas;
}

/**
* This function will draw the display object to the texture.
*
* @method Phaser.RenderTexture#renderWebGL
* @memberof Phaser.RenderTexture
* @private
* @param {DisplayObject} displayObject - The display object to render this texture on.
* @param {Phaser.Point} [position] - Where to draw the display object.
* @param {boolean} [clear=false] - If true the texture will be cleared before the displayObject is drawn.
* @param {boolean} [renderHidden=false] - If true displayObjects that have their visible property set to false will still be rendered.
*/
Phaser.RenderTexture.prototype.renderWebGL = function(displayObject, position, clear, renderHidden)
{
    var gl = PIXI.gl;

    // enable the alpha color mask..
    gl.colorMask(true, true, true, true);

    gl.viewport(0, 0, this.width, this.height);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer );

    if (clear)
    {
        gl.clearColor(0,0,0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    // THIS WILL MESS WITH HIT TESTING!
    var children = displayObject.children;

    //TODO -? create a new one??? dont think so!
    var originalWorldTransform = displayObject.worldTransform;
    displayObject.worldTransform = PIXI.mat3.create();//sthis.indetityMatrix;
    // modify to flip...
    displayObject.worldTransform[4] = -1;
    displayObject.worldTransform[5] = this.projection.y * -2;

    if (position)
    {
        displayObject.worldTransform[2] = position.x;
        displayObject.worldTransform[5] -= position.y;
    }
    
    PIXI.visibleCount++;
    displayObject.vcount = PIXI.visibleCount;
    
    for (var i = 0, j = children.length; i < j; i++)
    {
        children[i].updateTransform();
    }

    var renderGroup = displayObject.__renderGroup;

    if (renderGroup)
    {
        if (displayObject == renderGroup.root)
        {
            renderGroup.render(this.projection, this.glFramebuffer);
        }
        else
        {
            renderGroup.renderSpecific(displayObject, this.projection, this.glFramebuffer);
        }
    }
    else
    {
        if (!this.renderGroup)
        {
            this.renderGroup = new PIXI.WebGLRenderGroup(gl);
        }

        this.renderGroup.setRenderable(displayObject);
        this.renderGroup.render(this.projection, this.glFramebuffer);
    }
    
    displayObject.worldTransform = originalWorldTransform;
}

/**
 * This function will draw the display object to the texture.
 *
* @method Phaser.RenderTexture#renderCanvas
* @memberof Phaser.RenderTexture
* @private
* @param {DisplayObject} displayObject - The display object to render this texture on.
* @param {Phaser.Point} [position] - Where to draw the display object.
* @param {boolean} [clear=false] - If true the texture will be cleared before the displayObject is drawn.
* @param {boolean} [renderHidden=false] - If true displayObjects that have their visible property set to false will still be rendered.
*/
Phaser.RenderTexture.prototype.renderCanvas = function(displayObject, position, clear, renderHidden)
{
    var children = displayObject.children;

    displayObject.worldTransform = PIXI.mat3.create();
    
    if (position)
    {
        displayObject.worldTransform[2] = position.x;
        displayObject.worldTransform[5] = position.y;
    }

    for (var i = 0, j = children.length; i < j; i++)
    {
        children[i].updateTransform();
    }

    if (clear)
    {
        this.renderer.context.clearRect(0, 0, this.width, this.height);
    }

    this.renderer.renderDisplayObject(displayObject, renderHidden);
    
    this.renderer.context.setTransform(1, 0, 0, 1, 0, 0);

}
