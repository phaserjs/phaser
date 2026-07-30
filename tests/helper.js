/**
 * Phaser Test Helper
 *
 * Provides a real headless Phaser Game instance for tests that need
 * actual Game Objects (Sprites, Images, etc.) rather than mock objects.
 *
 * Usage in a test file:
 *
 *   var helper = require('../helper');  // adjust path as needed
 *
 *   describe('MyTest', function ()
 *   {
 *       var scene;
 *
 *       beforeEach(async function ()
 *       {
 *           scene = await helper.createGame();
 *       });
 *
 *       afterEach(function ()
 *       {
 *           helper.destroyGame();
 *       });
 *
 *       it('should create a real sprite', function ()
 *       {
 *           var sprite = scene.add.sprite(100, 200, '__DEFAULT');
 *           expect(sprite.x).toBe(100);
 *           expect(sprite.y).toBe(200);
 *           expect(sprite.type).toBe('Sprite');
 *       });
 *   });
 *
 * For pure math/geometry/utility tests, you don't need this helper at all.
 * Just require() the source file directly.
 */

// Load the built Phaser from dist (includes all webpack flags and bundling)
require('../dist/phaser.js');

var Phaser = global.Phaser;

var currentGame = null;
var sceneCounter = 0;

/**
 * Creates a headless Phaser Game and returns a Promise that resolves
 * with the active Scene once it's fully booted and ready.
 *
 * @param {object} [gameConfig] - Optional overrides for the Game config.
 * @return {Promise<Phaser.Scene>} The active test scene.
 */
function createGame (gameConfig)
{
    return new Promise(function (resolve)
    {
        // Clean up any existing game
        if (currentGame)
        {
            try { currentGame.destroy(true); } catch (e) {}
            currentGame = null;
        }

        sceneCounter++;

        var sceneKey = 'test_' + sceneCounter;

        var config = Object.assign({
            type: Phaser.HEADLESS,
            width: 800,
            height: 600,
            parent: 'game',
            banner: false,
            audio: { noAudio: true },
            scene: {
                key: sceneKey,
                create: function ()
                {
                    resolve(this);
                }
            }
        }, gameConfig || {});

        currentGame = new Phaser.Game(config);
    });
}

/**
 * Destroys the current Game instance and cleans up.
 * Call this in afterEach() to prevent state leaking between tests.
 */
function destroyGame ()
{
    if (currentGame)
    {
        try { currentGame.destroy(true); } catch (e) {}
        currentGame = null;
    }
}

/**
 * Returns the current Phaser Game instance, or null if none exists.
 *
 * @return {?Phaser.Game}
 */
function getGame ()
{
    return currentGame;
}

module.exports = {
    Phaser: Phaser,
    createGame: createGame,
    destroyGame: destroyGame,
    getGame: getGame
};
