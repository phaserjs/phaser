/// <reference path="../../Game.ts" />
/// <reference path="../../geom/Point.ts" />
/// <reference path="../../geom/Circle.ts" />

/**
 *	Input - Finger
 *
 *	@desc 		A Finger object used by the Touch manager
 *
 *	@version 	1.1 - 27th February 2013
 *	@author 	Richard Davey
 *
 *  @todo       Lots
 */

class Finger {

    /** 
    * Constructor
    * @param {Kiwi.Game} game.
    * @return {Kiwi.Input.Finger} This object.
    */
    constructor(game: Game) {

        this._game = game;
        this.active = false;

    }

    /** 
    * 
    * @property _game
    * @type Kiwi.Game
    * @private
    **/
    private _game: Game;

    /**
    * An identification number for each touch point. When a touch point becomes active, it must be assigned an identifier that is distinct from any other active touch point. While the touch point remains active, all events that refer to it must assign it the same identifier.
    * @property identifier
    * @type Number
    */
    public identifier: number;

    /**
    *
    * @property active
    * @type Boolean
    */
    public active: bool;

    /** 
    * 
    * @property point
    * @type Point
    **/
    public point: Point = null;

    /** 
    * 
    * @property circle
    * @type Circle
    **/
    public circle: Circle = null;

    /**
    *
    * @property withinGame
    * @type Boolean
    */
    public withinGame: bool = false;

    /**
    * The horizontal coordinate of point relative to the viewport in pixels, excluding any scroll offset
    * @property clientX
    * @type Number
    */
    public clientX: number = -1;

    //  
    /**
    * The vertical coordinate of point relative to the viewport in pixels, excluding any scroll offset
    * @property clientY
    * @type Number
    */
    public clientY: number = -1;

    //  
    /**
    * The horizontal coordinate of point relative to the viewport in pixels, including any scroll offset
    * @property pageX
    * @type Number
    */
    public pageX: number = -1;

    /**
    * The vertical coordinate of point relative to the viewport in pixels, including any scroll offset
    * @property pageY
    * @type Number
    */
    public pageY: number = -1;

    /**
    * The horizontal coordinate of point relative to the screen in pixels
    * @property screenX
    * @type Number
    */
    public screenX: number = -1;

    /**
    * The vertical coordinate of point relative to the screen in pixels
    * @property screenY
    * @type Number
    */
    public screenY: number = -1;

    /**
    * The horizontal coordinate of point relative to the game element
    * @property x
    * @type Number
    */
    public x: number = -1;

    /**
    * The vertical coordinate of point relative to the game element
    * @property y
    * @type Number
    */
    public y: number = -1;

    /**
    * The Element on which the touch point started when it was first placed on the surface, even if the touch point has since moved outside the interactive area of that element.
    * @property target
    * @type Any
    */
    public target;

    /** 
    * 
    * @property isDown
    * @type Boolean
    **/
    public isDown: bool = false;

    /** 
    * 
    * @property isUp
    * @type Boolean
    **/
    public isUp: bool = false;

    /** 
    * 
    * @property timeDown
    * @type Number
    **/
    public timeDown: number = 0;

    /** 
    * 
    * @property duration
    * @type Number
    **/
    public duration: number = 0;

    /** 
    * 
    * @property timeUp
    * @type Number
    **/
    public timeUp: number = 0;

    /** 
    * 
    * @property justPressedRate
    * @type Number
    **/
    public justPressedRate: number = 200;

    /** 
    * 
    * @property justReleasedRate
    * @type Number
    **/
    public justReleasedRate: number = 200;

    /**
    * 
    * @method start
    * @param {Any} event
    */
    public start(event) {

        this.identifier = event.identifier;
        this.target = event.target;

        //  populate geom objects
        if (this.point === null)
        {
            this.point = new Point();
        }

        if (this.circle === null)
        {
            this.circle = new Circle(0, 0, 44);
        }

        this.move(event);

        this.active = true;
        this.withinGame = true;
        this.isDown = true;
        this.isUp = false;
        this.timeDown = this._game.time.now;

    }

    /**
    * 
    * @method move
    * @param {Any} event
    */
    public move(event) {

        this.clientX = event.clientX;
        this.clientY = event.clientY;
        this.pageX = event.pageX;
        this.pageY = event.pageY;
        this.screenX = event.screenX;
        this.screenY = event.screenY;

        this.x = this.pageX - this._game.stage.offset.x;
        this.y = this.pageY - this._game.stage.offset.y;

        this.point.setTo(this.x, this.y);
        this.circle.setTo(this.x, this.y, 44);

        //  Droppings history (used for gestures and motion tracking)

        this.duration = this._game.time.now - this.timeDown;

    }

    /**
    * 
    * @method leave
    * @param {Any} event
    */
    public leave(event) {

        this.withinGame = false;
        this.move(event);

    }

    /**
    * 
    * @method stop
    * @param {Any} event
    */
    public stop(event) {

        this.active = false;
        this.withinGame = false;

        this.isDown = false;
        this.isUp = true;
        this.timeUp = this._game.time.now;
        this.duration = this.timeUp - this.timeDown;

    }

    /** 
    * 
    * @method justPressed
    * @param {Number} [duration]. 
    * @return {Boolean}
    */
    public justPressed(duration?: number = this.justPressedRate): bool {

        if (this.isDown === true && (this.timeDown + duration) > this._game.time.now)
        {
            return true;
        }
        else
        {
            return false;
        }

    }

    /** 
    * 
    * @method justReleased
    * @param {Number} [duration]. 
    * @return {Boolean}
    */
    public justReleased(duration?: number = this.justReleasedRate): bool {

        if (this.isUp === true && (this.timeUp + duration) > this._game.time.now)
        {
            return true;
        }
        else
        {
            return false;
        }

    }

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {string} a string representation of the instance.
     **/
    public toString(): string {

        return "[{Finger (identifer=" + this.identifier + " active=" + this.active + " duration=" + this.duration + " withinGame=" + this.withinGame + " x=" + this.x + " y=" + this.y + " clientX=" + this.clientX + " clientY=" + this.clientY + " screenX=" + this.screenX + " screenY=" + this.screenY + " pageX=" + this.pageX + " pageY=" + this.pageY + ")}]";

    }

}

