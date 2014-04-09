/*jslint node: true */
'use strict';

/**
 * A Sample Plugin demonstrating how to hook into the Phaser plugin system.
 */

function initWatchVal() {}

Phaser.Plugin.HUDManager = function(game, parent, name, pollRate) {

    Phaser.Plugin.call(this, game, parent);

    this.pollRate = pollRate || 100;
    this.digestTimer = this.game.time.events.loop(this.pollRate, this.$digest, this);
    this.digestTimer.timer.start();
    this.$$watchers = [];
    this.$$lastDirtyWatch = null;
    this.name = name || Phaser.Plugin.HUDManager.hudCounter++;
};

Phaser.Plugin.HUDManager.huds = {};
Phaser.Plugin.HUDManager.hudCounter = 0;

Phaser.Plugin.HUDManager.HEALTHBAR = function(percent) {
    if (percent <= 0.25) {
        return '#ff7474'; //red
    }
    if (percent <= 0.75) {
        return '#eaff74'; //yellow
    }
    return '#74ff74'; //green
};


Phaser.Plugin.HUDManager.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.HUDManager.prototype.constructor = Phaser.Plugin.HUDManager;



Phaser.Plugin.HUDManager.create = function(game, parent, name, pollrate) {

    var hud = Phaser.Plugin.HUDManager.huds[name];
    if ( !! hud) {
        return hud;
    }
    name = name || Phaser.Plugin.HUDManager.hudCounter++;
    hud = new Phaser.Plugin.HUDManager(game, parent, name, pollrate);
    Phaser.Plugin.HUDManager.huds[name] = hud;
    return hud;
};

Phaser.Plugin.HUDManager.get = function(name) {
    var hud = Phaser.Plugin.HUDManager.huds[name];
    if (hud) {
        return hud;
    } else {
        throw 'HUD "' + name + '" not found';
    }
};


Phaser.Plugin.HUDManager.prototype.destroy = function() {
    delete Phaser.Plugin.HUDManager.huds[this.name];
    this.$$watchers = [];
};

Phaser.Plugin.HUDManager.prototype.$watch = function(watchFn, listenerFn) {
    var watcher = {
        watchFn: watchFn,
        listenerFn: listenerFn || function() {},
        last: initWatchVal
    };
    this.$$watchers.push(watcher);
    this.$$lastDirtyWatch = null;
    var self = this;
    return function() {
        var index = self.$$watchers.indexOf(watcher);
        if (index >= 0) {
            self.$$watchers.splice(index, 1);
        }
    };
};



Phaser.Plugin.HUDManager.prototype.$digestOnce = function() {
    var newValue, oldValue, dirty;
    this.$$watchers.forEach(function(watcher) {
        newValue = watcher.watchFn(this);
        oldValue = watcher.last;
        if (newValue !== oldValue) {
            this.$$lastDirtyWatch = watcher;
            watcher.last = newValue;
            watcher.listenerFn(newValue, (oldValue == initWatchVal ? newValue : oldValue), this);
            dirty = true;
        } else if (this.$$lastDirtyWatch === watcher) {
            return false;
        }
    }, this);
    return dirty;
};

Phaser.Plugin.HUDManager.prototype.$digest = function() {
    var ttl = 10;

    var self = this;

    this.$$lastDirtyWatch = null;

    function digest() {
        var dirty = self.$digestOnce();
        if (dirty && !(ttl--)) {
            throw "10 Digest Iterations Reached";
        }
        if (dirty) {
            setTimeout(digest, 0);
        }
    }
    setTimeout(digest, 0);

};

Phaser.Plugin.HUDManager.prototype.addText = function(x, y, label, style, watched, context) {
    var text = this.game.add.text(x, y, label, style);
    context = context || window;
    var dereg = this.$watch(function() {
        return context[watched];
    }, function() {
        text.setText(label + context[watched]);
    });
    return {
        text: text,
        deregister: dereg
    };
};

Phaser.Plugin.HUDManager.prototype.addBar = function(x, y, width, height, max, watched, context, color, backgroundColor) {
    max = max || 100;

    color = color || 'white';
    backgroundColor = backgroundColor || '#999';

    var colorFunction = function() {
        return color;
    };

    if (typeof color === 'function') {
        colorFunction = color;
    }


    var bmd = this.game.add.bitmapData(width, height);
    context = context || window;
    var bar = this.game.add.sprite(x, y, bmd);
    var dereg = this.$watch(function() {
        return context[watched];
    }, function(newVal) {
        var percent = newVal / max;
        if ((percent <= 1 && percent >= 0)) {
            bmd.clear();
            bmd.ctx.beginPath();
            bmd.ctx.moveTo(0, 0);
            bmd.ctx.rect(0, 0, width, height);
            bmd.ctx.closePath();
            bmd.ctx.fillStyle = backgroundColor;
            bmd.ctx.fill();
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, width * percent, height);
            bmd.ctx.fillStyle = colorFunction(percent);
            bmd.ctx.fill();
            bmd.ctx.closePath();
            bmd.render();
            bmd.refreshBuffer();
        }
    });

    return {
        bar: bar,
        deregister: dereg
    };
};


Phaser.Plugin.HUDManager.prototype.addWatch = function(watched, watchedContext, callback, callbackContext) {
    watchedContext = watchedContext || window;
    callbackContext = callbackContext || window;
    var dereg = this.$watch(function() {
        return watchedContext[watched];
    }, function(newVal, oldVal) {
        callback.call(callbackContext, newVal, oldVal);
    });
    return dereg;
};
