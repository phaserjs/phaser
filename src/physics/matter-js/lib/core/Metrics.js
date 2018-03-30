// @if DEBUG
/**
* _Internal Class_, not generally used outside of the engine's internals.
*
*/

var Metrics = {};

module.exports = Metrics;

var Composite = require('../body/Composite');
var Common = require('./Common');

(function() {

    /**
     * Creates a new metrics.
     * @method create
     * @private
     * @return {metrics} A new metrics
     */
    Metrics.create = function(options) {
        var defaults = {
            extended: false,
            narrowDetections: 0,
            narrowphaseTests: 0,
            narrowReuse: 0,
            narrowReuseCount: 0,
            midphaseTests: 0,
            broadphaseTests: 0,
            narrowEff: 0.0001,
            midEff: 0.0001,
            broadEff: 0.0001,
            collisions: 0,
            buckets: 0,
            bodies: 0,
            pairs: 0
        };

        return Common.extend(defaults, false, options);
    };

    /**
     * Resets metrics.
     * @method reset
     * @private
     * @param {metrics} metrics
     */
    Metrics.reset = function(metrics) {
        if (metrics.extended) {
            metrics.narrowDetections = 0;
            metrics.narrowphaseTests = 0;
            metrics.narrowReuse = 0;
            metrics.narrowReuseCount = 0;
            metrics.midphaseTests = 0;
            metrics.broadphaseTests = 0;
            metrics.narrowEff = 0;
            metrics.midEff = 0;
            metrics.broadEff = 0;
            metrics.collisions = 0;
            metrics.buckets = 0;
            metrics.pairs = 0;
            metrics.bodies = 0;
        }
    };

    /**
     * Updates metrics.
     * @method update
     * @private
     * @param {metrics} metrics
     * @param {engine} engine
     */
    Metrics.update = function(metrics, engine) {
        if (metrics.extended) {
            var world = engine.world,
                bodies = Composite.allBodies(world);

            metrics.collisions = metrics.narrowDetections;
            metrics.pairs = engine.pairs.list.length;
            metrics.bodies = bodies.length;
            metrics.midEff = (metrics.narrowDetections / (metrics.midphaseTests || 1)).toFixed(2);
            metrics.narrowEff = (metrics.narrowDetections / (metrics.narrowphaseTests || 1)).toFixed(2);
            metrics.broadEff = (1 - (metrics.broadphaseTests / (bodies.length || 1))).toFixed(2);
            metrics.narrowReuse = (metrics.narrowReuseCount / (metrics.narrowphaseTests || 1)).toFixed(2);
            //var broadphase = engine.broadphase[engine.broadphase.current];
            //if (broadphase.instance)
            //    metrics.buckets = Common.keys(broadphase.instance.buckets).length;
        }
    };

})();
// @endif
