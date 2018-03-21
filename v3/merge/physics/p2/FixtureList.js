/* jshint noarg: false */

/**
* @author       Georgios Kaleadis https://github.com/georgiee
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Allow to access a list of created fixture (coming from Body#addPhaserPolygon)
* which itself parse the input from PhysicsEditor with the custom phaser exporter.
* You can access fixtures of a Body by a group index or even by providing a fixture Key.

* You can set the fixture key and also the group index for a fixture in PhysicsEditor.
* This gives you the power to create a complex body built of many fixtures and modify them
* during runtime (to remove parts, set masks, categories & sensor properties)
*
* @class Phaser.Physics.P2.FixtureList
* @constructor
* @param {Array} list - A list of fixtures (from Phaser.Physics.P2.Body#addPhaserPolygon)
*/
Phaser.Physics.P2.FixtureList = function (list) {

    if (!Array.isArray(list))
    {
        list = [list];
    }

    this.rawList = list;
    this.init();
    this.parse(this.rawList);

};

Phaser.Physics.P2.FixtureList.prototype = {
  
    /**
    * @method Phaser.Physics.P2.FixtureList#init
    */
    init: function () {

        /**
        * @property {object} namedFixtures - Collect all fixtures with a key
        * @private
        */
        this.namedFixtures = {};

        /**
        * @property {Array} groupedFixtures - Collect all given fixtures per group index. Notice: Every fixture with a key also belongs to a group
        * @private
        */
        this.groupedFixtures = [];

        /**
        * @property {Array} allFixtures - This is a list of everything in this collection
        * @private
        */
        this.allFixtures = [];

    },

    /**
    * @method Phaser.Physics.P2.FixtureList#setCategory
    * @param {number} bit - The bit to set as the collision group.
    * @param {string} fixtureKey - Only apply to the fixture with the given key.
    */
    setCategory: function (bit, fixtureKey) {

        var setter = function(fixture) {
            fixture.collisionGroup = bit;
        };

        this.getFixtures(fixtureKey).forEach(setter);

    },
  
    /**
    * @method Phaser.Physics.P2.FixtureList#setMask
    * @param {number} bit - The bit to set as the collision mask
    * @param {string} fixtureKey - Only apply to the fixture with the given key
    */
    setMask: function (bit, fixtureKey) {

        var setter = function(fixture) {
            fixture.collisionMask = bit;
        };

        this.getFixtures(fixtureKey).forEach(setter);

    },
  
    /**
    * @method Phaser.Physics.P2.FixtureList#setSensor
    * @param {boolean} value - sensor true or false
    * @param {string} fixtureKey - Only apply to the fixture with the given key
    */
    setSensor: function (value, fixtureKey) {

        var setter = function(fixture) {
            fixture.sensor = value;
        };

        this.getFixtures(fixtureKey).forEach(setter);

    },

    /**
    * @method Phaser.Physics.P2.FixtureList#setMaterial
    * @param {Object} material - The contact material for a fixture
    * @param {string} fixtureKey - Only apply to the fixture with the given key
    */
    setMaterial: function (material, fixtureKey) {

        var setter = function(fixture) {
            fixture.material = material;
        };

        this.getFixtures(fixtureKey).forEach(setter);

    },

    /**
    * Accessor to get either a list of specified fixtures by key or the whole fixture list
    * 
    * @method Phaser.Physics.P2.FixtureList#getFixtures
    * @param {array} keys - A list of fixture keys
    */
    getFixtures: function (keys) {

        var fixtures = [];

        if (keys)
        {
            if (!(keys instanceof Array))
            {
                keys = [keys];
            }

            var self = this;
            keys.forEach(function(key) {
                if (self.namedFixtures[key])
                {
                    fixtures.push(self.namedFixtures[key]);
                }
            });

            return this.flatten(fixtures);

        }
        else
        {
            return this.allFixtures;
        }

    },

    /**
    * Accessor to get either a single fixture by its key.
    * 
    * @method Phaser.Physics.P2.FixtureList#getFixtureByKey
    * @param {string} key - The key of the fixture.
    */
    getFixtureByKey: function (key) {

        return this.namedFixtures[key];

    },

    /**
    * Accessor to get a group of fixtures by its group index.
    * 
    * @method Phaser.Physics.P2.FixtureList#getGroup
    * @param {number} groupID - The group index.
    */
    getGroup: function (groupID) {

        return this.groupedFixtures[groupID];

    },
  
    /**
    * Parser for the output of Phaser.Physics.P2.Body#addPhaserPolygon
    * 
    * @method Phaser.Physics.P2.FixtureList#parse
    */
    parse: function () {

        var key, value, _ref, _results;
        _ref = this.rawList;
        _results = [];

        for (key in _ref)
        {
            value = _ref[key];

            if (!isNaN(key - 0))
            {
                this.groupedFixtures[key] = this.groupedFixtures[key] || [];
                this.groupedFixtures[key] = this.groupedFixtures[key].concat(value);
            }
            else
            {
                this.namedFixtures[key] = this.flatten(value);
            }

            _results.push(this.allFixtures = this.flatten(this.groupedFixtures));
        }

    },

    /**
    * A helper to flatten arrays. This is very useful as the fixtures are nested from time to time due to the way P2 creates and splits polygons.
    * 
    * @method Phaser.Physics.P2.FixtureList#flatten
    * @param {array} array - The array to flatten. Notice: This will happen recursive not shallow.
    */
    flatten: function (array) {

        var result, self;
        result = [];
        self = arguments.callee;
        
        array.forEach(function(item) {
            return Array.prototype.push.apply(result, (Array.isArray(item) ? self(item) : [item]));
        });

        return result;

    }

};