//  There is only ever one instance of a MasterClock per game, and it belongs to the Game.

var MasterClock = function (game)
{
    this.game = game;

    /**
    * The `performance.now()` value when the time was last updated.
    * @property {float} time
    * @protected
    */
    this.time = 0;

    /**
    * The `now` when the previous update occurred.
    * @property {float} prevTime
    * @protected
    */
    this.prevTime = 0;

    /**
    * Elapsed time since the last time update, in milliseconds, based on `now`.
    *
    * This value _may_ include time that the game is paused/inactive.
    *
    * _Note:_ This is updated only once per game loop - even if multiple logic update steps are done.
    * Use {@link Lazer.Timer#physicsTime physicsTime} as a basis of game/logic calculations instead.
    *
    * @property {number} elapsed
    * @see Lazer.Time.time
    * @protected
    */
    this.elapsed = 0;

    
};

MasterClock.prototype.constructor = MasterClock;

MasterClock.prototype = {

    step: function (timestamp)
    {
        this.prevTime = this.time;

        this.time = timestamp;

        
    }

};

module.exports = MasterClock;
