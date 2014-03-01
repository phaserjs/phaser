(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Phaser.Utils.PhysicsDebug = (function(_super) {
    __extends(PhysicsDebug, _super);

    function PhysicsDebug(game) {
      this.removeBody = __bind(this.removeBody, this);
      this.registerBody = __bind(this.registerBody, this);
      this.togglePolygon = __bind(this.togglePolygon, this);
      PhysicsDebug.__super__.constructor.call(this, game);
      this.game = game;
      this.bodies = [];
      this.init();
    }

    PhysicsDebug.prototype.init = function() {
      var _this = this;
      this.physicsWorld = this.game.physics.world;
      this.physicsWorld.on("addBody", function(e) {
        return _this.registerBody(e.body);
      });
      this.physicsWorld.on("removedBody", function(e) {
        return _this.removeBody(e.body);
      });
      this.initDrawer();
      this.invalidate(true);
      return this.registerKeys();
    };

    PhysicsDebug.prototype.registerKeys = function() {
      this.key_p = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
      return this.key_p.onDown.add(this.togglePolygon);
    };

    PhysicsDebug.prototype.togglePolygon = function() {
      this.drawer.settings.debugPolygons = !this.drawer.settings.debugPolygons;
      return this.invalidate();
    };

    PhysicsDebug.prototype.initDrawer = function() {
      var drawingOptions;
      drawingOptions = {
        debugPolygons: false,
        drawingAlpha: 0.5,
        pixelsPerLengthUnit: 20
      };
      this.drawer = new Phaser.Utils.PhysicsDrawer(this.game, drawingOptions);
      this.add(this.drawer);
      return this.interactive = new Phaser.Utils.PhysicsInteractive(this.game, this.drawer);
    };

    PhysicsDebug.prototype.invalidate = function(rebuild) {
      var body, _i, _len, _ref;
      if (rebuild == null) {
        rebuild = true;
      }
      this.removeAll();
      if (rebuild) {
        _ref = this.physicsWorld.bodies;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          body = _ref[_i];
          this.registerBody(body);
        }
      }
      this.drawer.redrawAll();
      return this.ensureFrontPosition();
    };

    PhysicsDebug.prototype.redrawBody = function(body) {
      return this.drawer.redrawBody(body);
    };

    PhysicsDebug.prototype.ensureFrontPosition = function() {
      return this.game.world.bringToTop(this);
    };

    PhysicsDebug.prototype.removeAll = function() {
      var _results;
      _results = [];
      while (this.bodies.length > 0) {
        _results.push(this.removeBody(this.bodies[0]));
      }
      return _results;
    };

    PhysicsDebug.prototype.registerBody = function(body) {
      if (body instanceof p2.Body) {
        if (body.shapes.length) {
          this.bodies.push(body);
          return this.drawer.addRenderable(body);
        }
      } else {
        throw new Error("You can only add p2.body");
      }
    };

    PhysicsDebug.prototype.removeBody = function(body) {
      var i;
      if (body instanceof p2.Body) {
        i = this.bodies.indexOf(body);
        if (i !== -1) {
          this.bodies.splice(i, 1);
          return this.drawer.removeRenderable(body);
        }
      } else {
        throw new Error("No p2 body given");
      }
    };

    return PhysicsDebug;

  })(Phaser.Group);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Phaser.Utils.PhysicsDrawer = (function(_super) {
    __extends(PhysicsDrawer, _super);

    PhysicsDrawer.prototype.settings = {
      debugPolygons: false,
      pixelsPerLengthUnit: 20,
      drawingAlpha: 0.5
    };

    function PhysicsDrawer(game, options) {
      if (options == null) {
        options = {};
      }
      PhysicsDrawer.__super__.constructor.call(this, game);
      this.settings = Phaser.Utils.extend(this.settings, options);
      this.alpha = this.settings.drawingAlpha;
    }

    PhysicsDrawer.prototype.removeRenderable = function(body) {
      var item;
      item = this.bodyToItem(body);
      return this.remove(item);
    };

    PhysicsDrawer.prototype.addRenderable = function(body) {
      var item;
      item = new Phaser.Utils.PhysicsItem(this.game, body, this.settings);
      return this.add(item);
    };

    PhysicsDrawer.prototype.redrawAll = function() {
      var item, _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(item.draw());
      }
      return _results;
    };

    PhysicsDrawer.prototype.redrawBody = function(body) {
      var item;
      item = this.bodyToItem(body);
      return item.draw();
    };

    PhysicsDrawer.prototype.bodyToItem = function(body) {
      var item, _i, _len, _ref;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.body === body) {
          return item;
        }
      }
    };

    return PhysicsDrawer;

  })(Phaser.Group);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Phaser.Utils.PhysicsInteractive = (function() {
    function PhysicsInteractive(game, drawer) {
      this.handlePointerDown = __bind(this.handlePointerDown, this);
      this.game = game;
      this.drawer = drawer;
      this.physicsWorld = game.physics.world;
      this.init();
    }

    PhysicsInteractive.prototype.init = function() {
      this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
      this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      return this.game.input.onDown.add(this.handlePointerDown);
    };

    PhysicsInteractive.prototype.handlePointerDown = function(pointer) {
      var body, speed;
      if (Math.random() > 0.5) {
        body = this.createRectangle(pointer.x, pointer.y);
      } else {
        body = this.createCircle(pointer.x, pointer.y);
      }
      speed = 1000;
      if (this.upKey.isDown) {
        return this.addVelocity(body, speed);
      } else if (this.downKey.isDown) {
        return this.addVelocity(body, speed, Math.PI);
      } else if (this.leftKey.isDown) {
        return this.addVelocity(body, speed, -Math.PI / 2);
      } else if (this.rightKey.isDown) {
        return this.addVelocity(body, speed, Math.PI / 2);
      }
    };

    PhysicsInteractive.prototype.addVelocity = function(body, speed, angle) {
      var magnitude;
      if (angle == null) {
        angle = 0;
      }
      magnitude = this.px2pi(-speed);
      angle = angle + Math.PI / 2;
      body.velocity[0] = magnitude * Math.cos(angle);
      return body.velocity[1] = magnitude * Math.sin(angle);
    };

    PhysicsInteractive.prototype.createRectangle = function(x, y, w, h) {
      var body, rectangle;
      if (w == null) {
        w = 50;
      }
      if (h == null) {
        h = 50;
      }
      rectangle = new p2.Rectangle(this.px2p(w), this.px2p(h));
      body = this.getBody(x, y);
      body.addShape(rectangle);
      this.physicsWorld.addBody(body);
      return body;
    };

    PhysicsInteractive.prototype.createCircle = function(x, y, r) {
      var body, circle;
      if (r == null) {
        r = 20;
      }
      circle = new p2.Circle(this.px2p(r));
      body = this.getBody(x, y);
      body.addShape(circle);
      this.physicsWorld.addBody(body);
      return body;
    };

    PhysicsInteractive.prototype.getBody = function(x, y) {
      var body;
      body = new p2.Body({
        mass: 1,
        position: [this.px2pi(x), this.px2pi(y)]
      });
      return body;
    };

    PhysicsInteractive.prototype.px2p = function(value) {
      return this.game.math.px2p(value);
    };

    PhysicsInteractive.prototype.px2pi = function(value) {
      return this.game.math.px2pi(value);
    };

    return PhysicsInteractive;

  })();

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Phaser.Utils.PhysicsItem = (function(_super) {
    __extends(PhysicsItem, _super);

    PhysicsItem.prototype.settings = {
      pixelsPerLengthUnit: 20,
      debugPolygons: true,
      lineWidth: 1
    };

    function PhysicsItem(game, body, settings) {
      if (settings == null) {
        settings = {};
      }
      PhysicsItem.__super__.constructor.call(this, game);
      this.settings = Phaser.Utils.extend(this.settings, settings);
      this.ppu = this.settings.pixelsPerLengthUnit;
      this.ppu = -1 * this.ppu;
      this.body = body;
      this.canvas = new Phaser.Graphics(game);
      this.add(this.canvas);
      this.draw();
    }

    PhysicsItem.prototype.prepareDragable = function() {
      return;
      this.texture = new Phaser.RenderTexture(this.game, this.body.aabb, 50);
      this.outputSprite = game.add.sprite(0, 0, this.texture);
      this.outputSprite.inputEnabled = true;
      this.outputSprite.input.enableDrag(false, void 0, void 0, void 0, void 0);
      return this.add(this.outputSprite);
    };

    PhysicsItem.prototype.update = function() {
      return this.updateSpriteTransform();
    };

    PhysicsItem.prototype.updateSpriteTransform = function() {
      this.position.x = this.body.position[0] * this.ppu;
      this.position.y = this.body.position[1] * this.ppu;
      return this.rotation = this.body.angle;
    };

    PhysicsItem.prototype.draw = function() {
      var angle, child, color, i, j, lineColor, lw, obj, offset, sprite, v, verts, vrot, _i, _j, _ref, _ref1, _results;
      obj = this.body;
      sprite = this.canvas;
      sprite.clear();
      color = parseInt(this.randomPastelHex(), 16);
      lineColor = 0xff0000;
      lw = this.lineWidth;
      if (obj instanceof p2.Body && obj.shapes.length) {
        _results = [];
        for (i = _i = 0, _ref = obj.shapes.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          child = obj.shapes[i];
          offset = obj.shapeOffsets[i];
          angle = obj.shapeAngles[i];
          offset = offset || zero;
          angle = angle || 0;
          if (child instanceof p2.Circle) {
            _results.push(this.drawCircle(sprite, offset[0] * this.ppu, -offset[1] * this.ppu, angle, child.radius * this.ppu, color, lw));
          } else if (child instanceof p2.Convex) {
            verts = [];
            vrot = p2.vec2.create();
            for (j = _j = 0, _ref1 = child.vertices.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
              v = child.vertices[j];
              p2.vec2.rotate(vrot, v, angle);
              verts.push([(vrot[0] + offset[0]) * this.ppu, -(vrot[1] + offset[1]) * this.ppu]);
            }
            _results.push(this.drawConvex(sprite, verts, child.triangles, lineColor, color, lw, this.settings.debugPolygons, [offset[0] * this.ppu, -offset[1] * this.ppu]));
          } else if (child instanceof p2.Plane) {
            _results.push(this.drawPlane(sprite, offset[0] * this.ppu, -offset[1] * this.ppu, color, lineColor, lw * 5, lw * 10, lw * 10, this.ppu * 100, angle));
          } else if (child instanceof p2.Line) {
            _results.push(this.drawLine(sprite, child.length * this.ppu, lineColor, lw));
          } else if (child instanceof p2.Rectangle) {
            _results.push(this.drawRectangle(sprite, offset[0] * this.ppu, -offset[1] * this.ppu, angle, child.width * this.ppu, child.height * this.ppu, lineColor, color, lw));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    PhysicsItem.prototype.drawRectangle = function(g, x, y, angle, w, h, color, fillColor, lineWidth) {
      var _ref, _ref1;
      lineWidth = (_ref = typeof lineWidth === "number") != null ? _ref : {
        lineWidth: 1
      };
      color = (_ref1 = typeof color === "undefined") != null ? _ref1 : {
        0x000000: color
      };
      g.lineStyle(lineWidth, color, 1);
      g.beginFill(fillColor);
      return g.drawRect(x - w / 2, y - h / 2, w, h);
    };

    PhysicsItem.prototype.drawCircle = function(g, x, y, angle, radius, color, lineWidth) {
      lineWidth = (typeof lineWidth === "number" ? lineWidth : 1);
      color = (typeof color === "number" ? color : 0xffffff);
      g.lineStyle(lineWidth, 0x000000, 1);
      g.beginFill(color, 1.0);
      g.drawCircle(x, y, -radius);
      g.endFill();
      g.moveTo(x, y);
      return g.lineTo(x + radius * Math.cos(-angle), y + radius * Math.sin(-angle));
    };

    PhysicsItem.prototype.drawLine = function(g, len, color, lineWidth) {
      lineWidth = (typeof lineWidth === "number" ? lineWidth : 1);
      color = (typeof color === "undefined" ? 0x000000 : color);
      g.lineStyle(lineWidth * 5, color, 1);
      g.moveTo(-len / 2, 0);
      return g.lineTo(len / 2, 0);
    };

    PhysicsItem.prototype.drawConvex = function(g, verts, triangles, color, fillColor, lineWidth, debug, offset) {
      var colors, i, v, v0, v1, x, x0, x1, y, y0, y1;
      lineWidth = (typeof lineWidth === "number" ? lineWidth : 1);
      color = (typeof color === "undefined" ? 0x000000 : color);
      if (!debug) {
        g.lineStyle(lineWidth, color, 1);
        g.beginFill(fillColor);
        i = 0;
        while (i !== verts.length) {
          v = verts[i];
          x = v[0];
          y = v[1];
          if (i === 0) {
            g.moveTo(x, -y);
          } else {
            g.lineTo(x, -y);
          }
          i++;
        }
        g.endFill();
        if (verts.length > 2) {
          g.moveTo(verts[verts.length - 1][0], -verts[verts.length - 1][1]);
          return g.lineTo(verts[0][0], -verts[0][1]);
        }
      } else {
        colors = [0xff0000, 0x00ff00, 0x0000ff];
        i = 0;
        while (i !== verts.length + 1) {
          v0 = verts[i % verts.length];
          v1 = verts[(i + 1) % verts.length];
          x0 = v0[0];
          y0 = v0[1];
          x1 = v1[0];
          y1 = v1[1];
          g.lineStyle(lineWidth, colors[i % colors.length], 1);
          g.moveTo(x0, -y0);
          g.lineTo(x1, -y1);
          g.drawCircle(x0, -y0, lineWidth * 2);
          i++;
        }
        g.lineStyle(lineWidth, 0x000000, 1);
        return g.drawCircle(offset[0], offset[1], lineWidth * 2);
      }
    };

    PhysicsItem.prototype.drawPath = function(g, path, color, fillColor, lineWidth) {
      var area, i, lastx, lasty, p1x, p1y, p2x, p2y, p3x, p3y, v, x, y;
      lineWidth = (typeof lineWidth === "number" ? lineWidth : 1);
      color = (typeof color === "undefined" ? 0x000000 : color);
      g.lineStyle(lineWidth, color, 1);
      if (typeof fillColor === "number") {
        g.beginFill(fillColor);
      }
      lastx = null;
      lasty = null;
      i = 0;
      while (i < path.length) {
        v = path[i];
        x = v[0];
        y = v[1];
        if (x !== lastx || y !== lasty) {
          if (i === 0) {
            g.moveTo(x, y);
          } else {
            p1x = lastx;
            p1y = lasty;
            p2x = x;
            p2y = y;
            p3x = path[(i + 1) % path.length][0];
            p3y = path[(i + 1) % path.length][1];
            area = ((p2x - p1x) * (p3y - p1y)) - ((p3x - p1x) * (p2y - p1y));
            if (area !== 0) {
              g.lineTo(x, y);
            }
          }
          lastx = x;
          lasty = y;
        }
        i++;
      }
      if (typeof fillColor === "number") {
        g.endFill();
      }
      if (path.length > 2 && typeof fillColor === "number") {
        g.moveTo(path[path.length - 1][0], path[path.length - 1][1]);
        return g.lineTo(path[0][0], path[0][1]);
      }
    };

    PhysicsItem.prototype.drawPlane = function(g, x0, x1, color, lineColor, lineWidth, diagMargin, diagSize, maxLength, angle) {
      var max, xd, yd;
      lineWidth = (typeof lineWidth === "number" ? lineWidth : 1);
      color = (typeof color === "undefined" ? 0xffffff : color);
      g.lineStyle(lineWidth, lineColor, 11);
      g.beginFill(color);
      max = maxLength;
      g.moveTo(x0, -x1);
      xd = x0 + Math.cos(angle) * this.game.width;
      yd = x1 + Math.sin(angle) * this.game.height;
      g.lineTo(xd, -yd);
      g.moveTo(x0, -x1);
      xd = x0 + Math.cos(angle) * -this.game.width;
      yd = x1 + Math.sin(angle) * -this.game.height;
      return g.lineTo(xd, -yd);
    };

    PhysicsItem.prototype.randomPastelHex = function() {
      var blue, green, mix, red;
      mix = [255, 255, 255];
      red = Math.floor(Math.random() * 256);
      green = Math.floor(Math.random() * 256);
      blue = Math.floor(Math.random() * 256);
      red = Math.floor((red + 3 * mix[0]) / 4);
      green = Math.floor((green + 3 * mix[1]) / 4);
      blue = Math.floor((blue + 3 * mix[2]) / 4);
      return this.rgbToHex(red, green, blue);
    };

    PhysicsItem.prototype.rgbToHex = function(r, g, b) {
      return this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    };

    PhysicsItem.prototype.componentToHex = function(c) {
      var hex;
      hex = c.toString(16);
      if (hex.len === 2) {
        return hex;
      } else {
        return hex + '0';
      }
    };

    return PhysicsItem;

  })(Phaser.Group);

}).call(this);
(function() {


}).call(this);
