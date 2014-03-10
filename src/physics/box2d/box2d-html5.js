var COMPILED = !0,
    goog = goog || {};
goog.global = this;
goog.DEBUG = !1;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.provide = function (a) {
    if (!COMPILED) {
        if (goog.isProvided_(a)) throw Error('Namespace "' + a + '" already declared.');
        delete goog.implicitNamespaces_[a];
        for (var b = a;
            (b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) goog.implicitNamespaces_[b] = !0
    }
    goog.exportPath_(a)
};
goog.setTestOnly = function (a) {
    if (COMPILED && !goog.DEBUG) throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
};
COMPILED || (goog.isProvided_ = function (a) {
    return !goog.implicitNamespaces_[a] && !! goog.getObjectByName(a)
}, goog.implicitNamespaces_ = {});
goog.exportPath_ = function (a, b, c) {
    a = a.split(".");
    c = c || goog.global;
    a[0] in c || !c.execScript || c.execScript("var " + a[0]);
    for (var e; a.length && (e = a.shift());)!a.length && goog.isDef(b) ? c[e] = b : c = c[e] ? c[e] : c[e] = {}
};
goog.getObjectByName = function (a, b) {
    for (var c = a.split("."), e = b || goog.global, d; d = c.shift();)
        if (goog.isDefAndNotNull(e[d])) e = e[d];
        else return null;
    return e
};
goog.globalize = function (a, b) {
    var c = b || goog.global,
        e;
    for (e in a) c[e] = a[e]
};
goog.addDependency = function (a, b, c) {
    if (!COMPILED) {
        var e;
        a = a.replace(/\\/g, "/");
        for (var d = goog.dependencies_, f = 0; e = b[f]; f++) d.nameToPath[e] = a, a in d.pathToNames || (d.pathToNames[a] = {}), d.pathToNames[a][e] = !0;
        for (e = 0; b = c[e]; e++) a in d.requires || (d.requires[a] = {}), d.requires[a][b] = !0
    }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function (a) {
    if (!COMPILED && !goog.isProvided_(a)) {
        if (goog.ENABLE_DEBUG_LOADER) {
            var b = goog.getPathFromDeps_(a);
            if (b) {
                goog.included_[b] = !0;
                goog.writeScripts_();
                return
            }
        }
        a = "goog.require could not find: " + a;
        goog.global.console && goog.global.console.error(a);
        throw Error(a);
    }
};
goog.basePath = "";
goog.nullFunction = function () {};
goog.identityFunction = function (a, b) {
    return a
};
goog.abstractMethod = function () {
    throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function (a) {
    a.getInstance = function () {
        if (a.instance_) return a.instance_;
        goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
        return a.instance_ = new a
    }
};
goog.instantiatedSingletons_ = [];
!COMPILED && goog.ENABLE_DEBUG_LOADER && (goog.included_ = {}, goog.dependencies_ = {
    pathToNames: {},
    nameToPath: {},
    requires: {},
    visited: {},
    written: {}
}, goog.inHtmlDocument_ = function () {
    var a = goog.global.document;
    return "undefined" != typeof a && "write" in a
}, goog.findBasePath_ = function () {
    if (goog.global.CLOSURE_BASE_PATH) goog.basePath = goog.global.CLOSURE_BASE_PATH;
    else if (goog.inHtmlDocument_())
        for (var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1; 0 <= b; --b) {
            var c = a[b].src,
                e = c.lastIndexOf("?"),
                e = -1 == e ? c.length : e;
            if ("base.js" == c.substr(e - 7, 7)) {
                goog.basePath = c.substr(0, e - 7);
                break
            }
        }
}, goog.importScript_ = function (a) {
    var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function (a) {
    if (goog.inHtmlDocument_()) {
        var b = goog.global.document;
        if ("complete" == b.readyState) {
            if (/\bdeps.js$/.test(a)) return !1;
            throw Error('Cannot write "' + a + '" after document load');
        }
        b.write('<script type="text/javascript" src="' +
            a + '">\x3c/script>');
        return !0
    }
    return !1
}, goog.writeScripts_ = function () {
    function a(d) {
        if (!(d in e.written)) {
            if (!(d in e.visited) && (e.visited[d] = !0, d in e.requires))
                for (var g in e.requires[d])
                    if (!goog.isProvided_(g))
                        if (g in e.nameToPath) a(e.nameToPath[g]);
                        else throw Error("Undefined nameToPath for " + g);
            d in c || (c[d] = !0, b.push(d))
        }
    }
    var b = [],
        c = {}, e = goog.dependencies_,
        d;
    for (d in goog.included_) e.written[d] || a(d);
    for (d = 0; d < b.length; d++)
        if (b[d]) goog.importScript_(goog.basePath + b[d]);
        else throw Error("Undefined script input");
}, goog.getPathFromDeps_ = function (a) {
    return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function (a) {
    var b = typeof a;
    if ("object" == b)
        if (a) {
            if (a instanceof Array) return "array";
            if (a instanceof Object) return b;
            var c = Object.prototype.toString.call(a);
            if ("[object Window]" == c) return "object";
            if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";
            if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function"
        } else return "null";
        else if ("function" == b && "undefined" == typeof a.call) return "object";
    return b
};
goog.isDef = function (a) {
    return void 0 !== a
};
goog.isNull = function (a) {
    return null === a
};
goog.isDefAndNotNull = function (a) {
    return null != a
};
goog.isArray = function (a) {
    return "array" == goog.typeOf(a)
};
goog.isArrayLike = function (a) {
    var b = goog.typeOf(a);
    return "array" == b || "object" == b && "number" == typeof a.length
};
goog.isDateLike = function (a) {
    return goog.isObject(a) && "function" == typeof a.getFullYear
};
goog.isString = function (a) {
    return "string" == typeof a
};
goog.isBoolean = function (a) {
    return "boolean" == typeof a
};
goog.isNumber = function (a) {
    return "number" == typeof a
};
goog.isFunction = function (a) {
    return "function" == goog.typeOf(a)
};
goog.isObject = function (a) {
    var b = typeof a;
    return "object" == b && null != a || "function" == b
};
goog.getUid = function (a) {
    return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function (a) {
    "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
    try {
        delete a[goog.UID_PROPERTY_]
    } catch (b) {}
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function (a) {
    var b = goog.typeOf(a);
    if ("object" == b || "array" == b) {
        if (a.clone) return a.clone();
        var b = "array" == b ? [] : {}, c;
        for (c in a) b[c] = goog.cloneObject(a[c]);
        return b
    }
    return a
};
goog.bindNative_ = function (a, b, c) {
    return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function (a, b, c) {
    if (!a) throw Error();
    if (2 < arguments.length) {
        var e = Array.prototype.slice.call(arguments, 2);
        return function () {
            var c = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(c, e);
            return a.apply(b, c)
        }
    }
    return function () {
        return a.apply(b, arguments)
    }
};
goog.bind = function (a, b, c) {
    Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
    return goog.bind.apply(null, arguments)
};
goog.partial = function (a, b) {
    var c = Array.prototype.slice.call(arguments, 1);
    return function () {
        var b = Array.prototype.slice.call(arguments);
        b.unshift.apply(b, c);
        return a.apply(this, b)
    }
};
goog.mixin = function (a, b) {
    for (var c in b) a[c] = b[c]
};
goog.now = goog.TRUSTED_SITE && Date.now || function () {
    return +new Date
};
goog.globalEval = function (a) {
    if (goog.global.execScript) goog.global.execScript(a, "JavaScript");
    else if (goog.global.eval)
        if (null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) goog.global.eval(a);
        else {
            var b = goog.global.document,
                c = b.createElement("script");
            c.type = "text/javascript";
            c.defer = !1;
            c.appendChild(b.createTextNode(a));
            b.body.appendChild(c);
            b.body.removeChild(c)
        } else throw Error("goog.globalEval not available");
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function (a, b) {
    var c = function (a) {
        return goog.cssNameMapping_[a] || a
    }, e = function (a) {
            a = a.split("-");
            for (var b = [], e = 0; e < a.length; e++) b.push(c(a[e]));
            return b.join("-")
        }, e = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : e : function (a) {
            return a
        };
    return b ? a + "-" + e(b) : e(a)
};
goog.setCssNameMapping = function (a, b) {
    goog.cssNameMapping_ = a;
    goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function (a, b) {
    var c = b || {}, e;
    for (e in c) {
        var d = ("" + c[e]).replace(/\$/g, "$$$$");
        a = a.replace(RegExp("\\{\\$" + e + "\\}", "gi"), d)
    }
    return a
};
goog.getMsgWithFallback = function (a, b) {
    return a
};
goog.exportSymbol = function (a, b, c) {
    goog.exportPath_(a, b, c)
};
goog.exportProperty = function (a, b, c) {
    a[b] = c
};
goog.inherits = function (a, b) {
    function c() {}
    c.prototype = b.prototype;
    a.superClass_ = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a
};
goog.base = function (a, b, c) {
    var e = arguments.callee.caller;
    if (e.superClass_) return e.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1));
    for (var d = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor; g; g = g.superClass_ && g.superClass_.constructor)
        if (g.prototype[b] === e) f = !0;
        else if (f) return g.prototype[b].apply(a, d);
    if (a[b] === e) return a.constructor.prototype[b].apply(a, d);
    throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function (a) {
    a.call(goog.global)
};
var box2d = {
    b2Settings: {}
};
Object.defineProperty || (Object.defineProperty = function (a, b, c) {
    Object.__defineGetter__ && ("get" in c ? a.__defineGetter__(b, c.get) : "value" in c && a.__defineGetter__(b, c.value));
    Object.__defineSetter__ && ("set" in c ? a.__defineSetter__(b, c.set) : "value" in c && a.__defineSetter__(b, c.value))
});
box2d.DEBUG = !1;
goog.exportSymbol("box2d.DEBUG", box2d.DEBUG);
box2d.ENABLE_ASSERTS = box2d.DEBUG;
goog.exportSymbol("box2d.ENABLE_ASSERTS", box2d.ENABLE_ASSERTS);
box2d.b2Assert = function (a, b, c) {
    if (box2d.DEBUG && !a) debugger
};
goog.exportSymbol("box2d.b2Assert", box2d.b2Assert);
box2d.b2_maxFloat = 1E37;
goog.exportSymbol("box2d.b2_maxFloat", box2d.b2_maxFloat);
box2d.b2_epsilon = 1E-5;
goog.exportSymbol("box2d.b2_epsilon", box2d.b2_epsilon);
box2d.b2_epsilon_sq = box2d.b2_epsilon * box2d.b2_epsilon;
goog.exportSymbol("box2d.b2_epsilon_sq", box2d.b2_epsilon_sq);
box2d.b2_pi = Math.PI;
goog.exportSymbol("box2d.b2_pi", box2d.b2_pi);
box2d.b2_maxManifoldPoints = 2;
goog.exportSymbol("box2d.b2_maxManifoldPoints", box2d.b2_maxManifoldPoints);
box2d.b2_maxPolygonVertices = 8;
goog.exportSymbol("box2d.b2_maxPolygonVertices", box2d.b2_maxPolygonVertices);
box2d.b2_aabbExtension = 0.1;
goog.exportSymbol("box2d.b2_aabbExtension", box2d.b2_aabbExtension);
box2d.b2_aabbMultiplier = 2;
goog.exportSymbol("box2d.b2_aabbMultiplier", box2d.b2_aabbMultiplier);
box2d.b2_linearSlop = 0.008;
goog.exportSymbol("box2d.b2_linearSlop", box2d.b2_linearSlop);
box2d.b2_angularSlop = 2 / 180 * box2d.b2_pi;
goog.exportSymbol("box2d.b2_angularSlop", box2d.b2_angularSlop);
box2d.b2_polygonRadius = 2 * box2d.b2_linearSlop;
goog.exportSymbol("box2d.b2_polygonRadius", box2d.b2_polygonRadius);
box2d.b2_maxSubSteps = 8;
goog.exportSymbol("box2d.b2_maxSubSteps", box2d.b2_maxSubSteps);
box2d.b2_maxTOIContacts = 32;
goog.exportSymbol("box2d.b2_maxTOIContacts", box2d.b2_maxTOIContacts);
box2d.b2_velocityThreshold = 1;
goog.exportSymbol("box2d.b2_velocityThreshold", box2d.b2_velocityThreshold);
box2d.b2_maxLinearCorrection = 0.2;
goog.exportSymbol("box2d.b2_maxLinearCorrection", box2d.b2_maxLinearCorrection);
box2d.b2_maxAngularCorrection = 8 / 180 * box2d.b2_pi;
goog.exportSymbol("box2d.b2_maxAngularCorrection", box2d.b2_maxAngularCorrection);
box2d.b2_maxTranslation = 2;
goog.exportSymbol("box2d.b2_maxTranslation", box2d.b2_maxTranslation);
box2d.b2_maxTranslationSquared = box2d.b2_maxTranslation * box2d.b2_maxTranslation;
goog.exportSymbol("box2d.b2_maxTranslationSquared", box2d.b2_maxTranslationSquared);
box2d.b2_maxRotation = 0.5 * box2d.b2_pi;
goog.exportSymbol("box2d.b2_maxRotation", box2d.b2_maxRotation);
box2d.b2_maxRotationSquared = box2d.b2_maxRotation * box2d.b2_maxRotation;
goog.exportSymbol("box2d.b2_maxRotationSquared", box2d.b2_maxRotationSquared);
box2d.b2_baumgarte = 0.2;
goog.exportSymbol("box2d.b2_baumgarte", box2d.b2_baumgarte);
box2d.b2_toiBaumgarte = 0.75;
goog.exportSymbol("box2d.b2_toiBaumgarte", box2d.b2_toiBaumgarte);
box2d.b2_timeToSleep = 0.5;
goog.exportSymbol("box2d.b2_timeToSleep", box2d.b2_timeToSleep);
box2d.b2_linearSleepTolerance = 0.01;
goog.exportSymbol("box2d.b2_linearSleepTolerance", box2d.b2_linearSleepTolerance);
box2d.b2_angularSleepTolerance = 2 / 180 * box2d.b2_pi;
goog.exportSymbol("box2d.b2_angularSleepTolerance", box2d.b2_angularSleepTolerance);
box2d.b2Alloc = function (a) {
    return null
};
goog.exportSymbol("box2d.b2Alloc", box2d.b2Alloc);
box2d.b2Free = function (a) {};
goog.exportSymbol("box2d.b2Free", box2d.b2Free);
box2d.b2Log = function (a) {
    goog.global.console.log.apply(null, arguments)
};
goog.exportSymbol("box2d.b2Log", box2d.b2Log);
box2d.b2Version = function (a, b, c) {
    this.major = a || 0;
    this.minor = b || 0;
    this.revision = c || 0
};
goog.exportSymbol("box2d.b2Version", box2d.b2Version);
box2d.b2Version.prototype.major = 0;
goog.exportProperty(box2d.b2Version.prototype, "major", box2d.b2Version.prototype.major);
box2d.b2Version.prototype.minor = 0;
goog.exportProperty(box2d.b2Version.prototype, "minor", box2d.b2Version.prototype.minor);
box2d.b2Version.prototype.revision = 0;
goog.exportProperty(box2d.b2Version.prototype, "revision", box2d.b2Version.prototype.revision);
box2d.b2Version.prototype.toString = function () {
    return this.major + "." + this.minor + "." + this.revision
};
goog.exportProperty(box2d.b2Version.prototype, "toString", box2d.b2Version.prototype.toString);
box2d.b2_version = new box2d.b2Version(2, 3, 0);
goog.exportSymbol("box2d.b2_version", box2d.b2_version);
box2d.b2_changelist = 278;
goog.exportSymbol("box2d.b2_changelist", box2d.b2_changelist);
box2d.b2ParseInt = function (a) {
    return parseInt(a, 10)
};
goog.exportSymbol("box2d.b2ParseInt", box2d.b2ParseInt);
box2d.b2ParseUInt = function (a) {
    return box2d.b2Abs(parseInt(a, 10))
};
goog.exportSymbol("box2d.b2ParseUInt", box2d.b2ParseUInt);
box2d.b2MakeArray = function (a, b) {
    void 0 === a && (a = 0);
    var c = Array(a);
    if (void 0 !== b)
        for (var e = 0; e < a; ++e) c[e] = b(e);
    return c
};
goog.exportSymbol("box2d.b2MakeArray", box2d.b2MakeArray);
box2d.b2MakeNumberArray = function (a) {
    return box2d.b2MakeArray(a, function (a) {
        return 0
    })
};
goog.exportSymbol("box2d.b2MakeNumberArray", box2d.b2MakeNumberArray);
box2d.b2Math = {};
box2d.b2_pi_over_180 = box2d.b2_pi / 180;
goog.exportSymbol("box2d.b2_pi_over_180", box2d.b2_pi_over_180);
box2d.b2_180_over_pi = 180 / box2d.b2_pi;
goog.exportSymbol("box2d.b2_180_over_pi", box2d.b2_180_over_pi);
box2d.b2_two_pi = 2 * box2d.b2_pi;
goog.exportSymbol("box2d.b2_two_pi", box2d.b2_two_pi);
box2d.b2Abs = function (a) {
    return 0 > a ? -a : a
};
goog.exportSymbol("box2d.b2Abs", box2d.b2Abs);
box2d.b2Min = function (a, b) {
    return a < b ? a : b
};
goog.exportSymbol("box2d.b2Min", box2d.b2Min);
box2d.b2Max = function (a, b) {
    return a > b ? a : b
};
goog.exportSymbol("box2d.b2Max", box2d.b2Max);
box2d.b2Clamp = function (a, b, c) {
    return a < b ? b : a > c ? c : a
};
goog.exportSymbol("box2d.b2Clamp", box2d.b2Clamp);
box2d.b2Swap = function (a, b) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
    var c = a[0];
    a[0] = b[0];
    b[0] = c
};
goog.exportSymbol("box2d.b2Swap", box2d.b2Swap);
box2d.b2IsValid = function (a) {
    return isFinite(a)
};
goog.exportSymbol("box2d.b2IsValid", box2d.b2IsValid);
box2d.b2Sq = function (a) {
    return a * a
};
goog.exportSymbol("box2d.b2Sq", box2d.b2Sq);
box2d.b2InvSqrt = function (a) {
    return 1 / Math.sqrt(a)
};
goog.exportSymbol("box2d.b2InvSqrt", box2d.b2InvSqrt);
box2d.b2Sqrt = function (a) {
    return Math.sqrt(a)
};
goog.exportSymbol("box2d.b2Sqrt", box2d.b2Sqrt);
box2d.b2Pow = function (a, b) {
    return Math.pow(a, b)
};
goog.exportSymbol("box2d.b2Pow", box2d.b2Pow);
box2d.b2DegToRad = function (a) {
    return a * box2d.b2_pi_over_180
};
goog.exportSymbol("box2d.b2DegToRad", box2d.b2DegToRad);
box2d.b2RadToDeg = function (a) {
    return a * box2d.b2_180_over_pi
};
goog.exportSymbol("box2d.b2RadToDeg", box2d.b2RadToDeg);
box2d.b2Cos = function (a) {
    return Math.cos(a)
};
goog.exportSymbol("box2d.b2Cos", box2d.b2Cos);
box2d.b2Sin = function (a) {
    return Math.sin(a)
};
goog.exportSymbol("box2d.b2Sin", box2d.b2Sin);
box2d.b2Acos = function (a) {
    return Math.acos(a)
};
goog.exportSymbol("box2d.b2Acos", box2d.b2Acos);
box2d.b2Asin = function (a) {
    return Math.asin(a)
};
goog.exportSymbol("box2d.b2Asin", box2d.b2Asin);
box2d.b2Atan2 = function (a, b) {
    return Math.atan2(a, b)
};
goog.exportSymbol("box2d.b2Atan2", box2d.b2Atan2);
box2d.b2NextPowerOfTwo = function (a) {
    a |= a >> 1 & 2147483647;
    a |= a >> 2 & 1073741823;
    a |= a >> 4 & 268435455;
    a |= a >> 8 & 16777215;
    return (a | a >> 16 & 65535) + 1
};
goog.exportSymbol("box2d.b2NextPowerOfTwo", box2d.b2NextPowerOfTwo);
box2d.b2IsPowerOfTwo = function (a) {
    return 0 < a && 0 === (a & a - 1)
};
goog.exportSymbol("box2d.b2IsPowerOfTwo", box2d.b2IsPowerOfTwo);
box2d.b2Random = function () {
    return 2 * Math.random() - 1
};
goog.exportSymbol("box2d.b2Random", box2d.b2Random);
box2d.b2RandomRange = function (a, b) {
    return (b - a) * Math.random() + a
};
goog.exportSymbol("box2d.b2RandomRange", box2d.b2RandomRange);
box2d.b2Vec2 = function (a, b) {
    this.x = a || 0;
    this.y = b || 0
};
goog.exportSymbol("box2d.b2Vec2", box2d.b2Vec2);
box2d.b2Vec2.prototype.x = 0;
goog.exportProperty(box2d.b2Vec2.prototype, "x", box2d.b2Vec2.prototype.x);
box2d.b2Vec2.prototype.y = 0;
goog.exportProperty(box2d.b2Vec2.prototype, "y", box2d.b2Vec2.prototype.y);
box2d.b2Vec2_zero = new box2d.b2Vec2;
goog.exportSymbol("box2d.b2Vec2_zero", box2d.b2Vec2_zero);
box2d.b2Vec2.ZERO = new box2d.b2Vec2;
goog.exportProperty(box2d.b2Vec2, "ZERO", box2d.b2Vec2.ZERO);
box2d.b2Vec2.UNITX = new box2d.b2Vec2(1, 0);
goog.exportProperty(box2d.b2Vec2, "UNITX", box2d.b2Vec2.UNITX);
box2d.b2Vec2.UNITY = new box2d.b2Vec2(0, 1);
goog.exportProperty(box2d.b2Vec2, "UNITY", box2d.b2Vec2.UNITY);
box2d.b2Vec2.s_t0 = new box2d.b2Vec2;
goog.exportProperty(box2d.b2Vec2, "s_t0", box2d.b2Vec2.s_t0);
box2d.b2Vec2.s_t1 = new box2d.b2Vec2;
goog.exportProperty(box2d.b2Vec2, "s_t1", box2d.b2Vec2.s_t1);
box2d.b2Vec2.s_t2 = new box2d.b2Vec2;
goog.exportProperty(box2d.b2Vec2, "s_t2", box2d.b2Vec2.s_t2);
box2d.b2Vec2.s_t3 = new box2d.b2Vec2;
goog.exportProperty(box2d.b2Vec2, "s_t3", box2d.b2Vec2.s_t3);
box2d.b2Vec2.MakeArray = function (a) {
    return box2d.b2MakeArray(a, function (a) {
        return new box2d.b2Vec2
    })
};
goog.exportProperty(box2d.b2Vec2, "MakeArray", box2d.b2Vec2.MakeArray);
box2d.b2Vec2.prototype.Clone = function () {
    return new box2d.b2Vec2(this.x, this.y)
};
goog.exportProperty(box2d.b2Vec2.prototype, "Clone", box2d.b2Vec2.prototype.Clone);
box2d.b2Vec2.prototype.SetZero = function () {
    this.y = this.x = 0;
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SetZero", box2d.b2Vec2.prototype.SetZero);
box2d.b2Vec2.prototype.SetXY = function (a, b) {
    this.x = a;
    this.y = b;
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SetXY", box2d.b2Vec2.prototype.SetXY);
box2d.b2Vec2.prototype.Copy = function (a) {
    this.x = a.x;
    this.y = a.y;
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "Copy", box2d.b2Vec2.prototype.Copy);
box2d.b2Vec2.prototype.SelfAdd = function (a) {
    this.x += a.x;
    this.y += a.y;
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfAdd", box2d.b2Vec2.prototype.SelfAdd);
box2d.b2Vec2.prototype.SelfAddXY = function (a, b) {
    this.x += a;
    this.y += b;
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfAddXY", box2d.b2Vec2.prototype.SelfAddXY);
box2d.b2Vec2.prototype.SelfSub = function (a) {
    this.x -= a.x;
    this.y -= a.y;
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfSub", box2d.b2Vec2.prototype.SelfSub);
box2d.b2Vec2.prototype.SelfSubXY = function (a, b) {
    this.x -= a;
    this.y -= b;
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfSubXY", box2d.b2Vec2.prototype.SelfSubXY);
box2d.b2Vec2.prototype.SelfMul = function (a) {
    this.x *= a;
    this.y *= a;
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfMul", box2d.b2Vec2.prototype.SelfMul);
box2d.b2Vec2.prototype.SelfMulAdd = function (a, b) {
    this.x += a * b.x;
    this.y += a * b.y;
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfMulAdd", box2d.b2Vec2.prototype.SelfMulAdd);
box2d.b2Vec2.prototype.SelfMulSub = function (a, b) {
    this.x -= a * b.x;
    this.y -= a * b.y;
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfMulSub", box2d.b2Vec2.prototype.SelfMulSub);
box2d.b2Vec2.prototype.Dot = function (a) {
    return this.x * a.x + this.y * a.y
};
goog.exportProperty(box2d.b2Vec2.prototype, "Dot", box2d.b2Vec2.prototype.Dot);
box2d.b2Vec2.prototype.Cross = function (a) {
    return this.x * a.y - this.y * a.x
};
goog.exportProperty(box2d.b2Vec2.prototype, "Cross", box2d.b2Vec2.prototype.Cross);
box2d.b2Vec2.prototype.Length = function () {
    var a = this.x,
        b = this.y;
    return Math.sqrt(a * a + b * b)
};
goog.exportProperty(box2d.b2Vec2.prototype, "Length", box2d.b2Vec2.prototype.Length);
box2d.b2Vec2.prototype.GetLength = box2d.b2Vec2.prototype.Length;
goog.exportProperty(box2d.b2Vec2.prototype, "GetLength", box2d.b2Vec2.prototype.GetLength);
box2d.b2Vec2.prototype.LengthSquared = function () {
    var a = this.x,
        b = this.y;
    return a * a + b * b
};
goog.exportProperty(box2d.b2Vec2.prototype, "LengthSquared", box2d.b2Vec2.prototype.LengthSquared);
box2d.b2Vec2.prototype.GetLengthSquared = box2d.b2Vec2.prototype.LengthSquared;
goog.exportProperty(box2d.b2Vec2.prototype, "GetLengthSquared", box2d.b2Vec2.prototype.GetLengthSquared);
box2d.b2Vec2.prototype.Normalize = function () {
    var a = this.GetLength();
    if (a >= box2d.b2_epsilon) {
        var b = 1 / a;
        this.x *= b;
        this.y *= b
    }
    return a
};
goog.exportProperty(box2d.b2Vec2.prototype, "Normalize", box2d.b2Vec2.prototype.Normalize);
box2d.b2Vec2.prototype.SelfNormalize = function () {
    var a = this.GetLength();
    a >= box2d.b2_epsilon && (a = 1 / a, this.x *= a, this.y *= a);
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfNormalize", box2d.b2Vec2.prototype.SelfNormalize);
box2d.b2Vec2.prototype.SelfRotate = function (a, b) {
    var c = this.x,
        e = this.y;
    this.x = a * c - b * e;
    this.y = b * c + a * e;
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfRotate", box2d.b2Vec2.prototype.SelfRotate);
box2d.b2Vec2.prototype.SelfRotateRadians = function (a) {
    return this.SelfRotate(Math.cos(a), Math.sin(a))
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfRotateRadians", box2d.b2Vec2.prototype.SelfRotateRadians);
box2d.b2Vec2.prototype.SelfRotateDegrees = function (a) {
    return this.SelfRotateRadians(box2d.b2DegToRad(a))
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfRotateDegrees", box2d.b2Vec2.prototype.SelfRotateDegrees);
box2d.b2Vec2.prototype.IsValid = function () {
    return isFinite(this.x) && isFinite(this.y)
};
goog.exportProperty(box2d.b2Vec2.prototype, "IsValid", box2d.b2Vec2.prototype.IsValid);
box2d.b2Vec2.prototype.SelfCrossVS = function (a) {
    var b = this.x;
    this.x = a * this.y;
    this.y = -a * b;
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfCrossVS", box2d.b2Vec2.prototype.SelfCrossVS);
box2d.b2Vec2.prototype.SelfCrossSV = function (a) {
    var b = this.x;
    this.x = -a * this.y;
    this.y = a * b;
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfCrossSV", box2d.b2Vec2.prototype.SelfCrossSV);
box2d.b2Vec2.prototype.SelfMinV = function (a) {
    this.x = box2d.b2Min(this.x, a.x);
    this.y = box2d.b2Min(this.y, a.y);
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfMinV", box2d.b2Vec2.prototype.SelfMinV);
box2d.b2Vec2.prototype.SelfMaxV = function (a) {
    this.x = box2d.b2Max(this.x, a.x);
    this.y = box2d.b2Max(this.y, a.y);
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfMaxV", box2d.b2Vec2.prototype.SelfMaxV);
box2d.b2Vec2.prototype.SelfAbs = function () {
    this.x = box2d.b2Abs(this.x);
    this.y = box2d.b2Abs(this.y);
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfAbs", box2d.b2Vec2.prototype.SelfAbs);
box2d.b2Vec2.prototype.SelfNeg = function () {
    this.x = -this.x;
    this.y = -this.y;
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfNeg", box2d.b2Vec2.prototype.SelfNeg);
box2d.b2Vec2.prototype.SelfSkew = function () {
    var a = this.x;
    this.x = -this.y;
    this.y = a;
    return this
};
goog.exportProperty(box2d.b2Vec2.prototype, "SelfSkew", box2d.b2Vec2.prototype.SelfSkew);
box2d.b2AbsV = function (a, b) {
    b.x = box2d.b2Abs(a.x);
    b.y = box2d.b2Abs(a.y);
    return b
};
goog.exportSymbol("box2d.b2AbsV", box2d.b2AbsV);
box2d.b2MinV = function (a, b, c) {
    c.x = box2d.b2Min(a.x, b.x);
    c.y = box2d.b2Min(a.y, b.y);
    return c
};
goog.exportSymbol("box2d.b2MinV", box2d.b2MinV);
box2d.b2MaxV = function (a, b, c) {
    c.x = box2d.b2Max(a.x, b.x);
    c.y = box2d.b2Max(a.y, b.y);
    return c
};
goog.exportSymbol("box2d.b2MaxV", box2d.b2MaxV);
box2d.b2ClampV = function (a, b, c, e) {
    e.x = box2d.b2Clamp(a.x, b.x, c.x);
    e.y = box2d.b2Clamp(a.y, b.y, c.y);
    return e
};
goog.exportSymbol("box2d.b2ClampV", box2d.b2ClampV);
box2d.b2RotateV = function (a, b, c, e) {
    var d = a.x;
    a = a.y;
    e.x = b * d - c * a;
    e.y = c * d + b * a;
    return e
};
goog.exportSymbol("box2d.b2RotateV", box2d.b2RotateV);
box2d.b2RotateRadiansV = function (a, b, c) {
    return box2d.b2RotateV(a, Math.cos(b), Math.sin(b), c)
};
goog.exportSymbol("box2d.b2RotateRadiansV", box2d.b2RotateRadiansV);
box2d.b2RotateDegreesV = function (a, b, c) {
    return box2d.b2RotateRadiansV(a, box2d.b2DegToRad(b), c)
};
goog.exportSymbol("box2d.b2RotateDegreesV", box2d.b2RotateDegreesV);
box2d.b2DotVV = function (a, b) {
    return a.x * b.x + a.y * b.y
};
goog.exportSymbol("box2d.b2DotVV", box2d.b2DotVV);
box2d.b2CrossVV = function (a, b) {
    return a.x * b.y - a.y * b.x
};
goog.exportSymbol("box2d.b2CrossVV", box2d.b2CrossVV);
box2d.b2CrossVS = function (a, b, c) {
    var e = a.x;
    c.x = b * a.y;
    c.y = -b * e;
    return c
};
goog.exportSymbol("box2d.b2CrossVS", box2d.b2CrossVS);
box2d.b2CrossVOne = function (a, b) {
    var c = a.x;
    b.x = a.y;
    b.y = -c;
    return b
};
goog.exportSymbol("box2d.b2CrossVOne", box2d.b2CrossVOne);
box2d.b2CrossSV = function (a, b, c) {
    var e = b.x;
    c.x = -a * b.y;
    c.y = a * e;
    return c
};
goog.exportSymbol("box2d.b2CrossSV", box2d.b2CrossSV);
box2d.b2CrossOneV = function (a, b) {
    var c = a.x;
    b.x = -a.y;
    b.y = c;
    return b
};
goog.exportSymbol("box2d.b2CrossOneV", box2d.b2CrossOneV);
box2d.b2AddVV = function (a, b, c) {
    c.x = a.x + b.x;
    c.y = a.y + b.y;
    return c
};
goog.exportSymbol("box2d.b2AddVV", box2d.b2AddVV);
box2d.b2SubVV = function (a, b, c) {
    c.x = a.x - b.x;
    c.y = a.y - b.y;
    return c
};
goog.exportSymbol("box2d.b2SubVV", box2d.b2SubVV);
box2d.b2MulSV = function (a, b, c) {
    c.x = b.x * a;
    c.y = b.y * a;
    return c
};
goog.exportSymbol("box2d.b2MulSV", box2d.b2MulSV);
box2d.b2AddVMulSV = function (a, b, c, e) {
    e.x = a.x + b * c.x;
    e.y = a.y + b * c.y;
    return e
};
goog.exportSymbol("box2d.b2AddVMulSV", box2d.b2AddVMulSV);
box2d.b2SubVMulSV = function (a, b, c, e) {
    e.x = a.x - b * c.x;
    e.y = a.y - b * c.y;
    return e
};
goog.exportSymbol("box2d.b2SubVMulSV", box2d.b2SubVMulSV);
box2d.b2AddVCrossSV = function (a, b, c, e) {
    var d = c.x;
    e.x = a.x - b * c.y;
    e.y = a.y + b * d;
    return e
};
goog.exportSymbol("box2d.b2AddVCrossSV", box2d.b2AddVCrossSV);
box2d.b2MidVV = function (a, b, c) {
    c.x = 0.5 * (a.x + b.x);
    c.y = 0.5 * (a.y + b.y);
    return c
};
goog.exportSymbol("box2d.b2MidVV", box2d.b2MidVV);
box2d.b2ExtVV = function (a, b, c) {
    c.x = 0.5 * (b.x - a.x);
    c.y = 0.5 * (b.y - a.y);
    return c
};
goog.exportSymbol("box2d.b2ExtVV", box2d.b2ExtVV);
box2d.b2IsEqualToV = function (a, b) {
    return a.x === b.x && a.y === b.y
};
goog.exportSymbol("box2d.b2IsEqualToV", box2d.b2IsEqualToV);
box2d.b2DistanceVV = function (a, b) {
    var c = a.x - b.x,
        e = a.y - b.y;
    return Math.sqrt(c * c + e * e)
};
goog.exportSymbol("box2d.b2DistanceVV", box2d.b2DistanceVV);
box2d.b2DistanceSquaredVV = function (a, b) {
    var c = a.x - b.x,
        e = a.y - b.y;
    return c * c + e * e
};
goog.exportSymbol("box2d.b2DistanceSquaredVV", box2d.b2DistanceSquaredVV);
box2d.b2NegV = function (a, b) {
    b.x = -a.x;
    b.y = -a.y;
    return b
};
goog.exportSymbol("box2d.b2NegV", box2d.b2NegV);
box2d.b2Vec3 = function (a, b, c) {
    this.x = a || 0;
    this.y = b || 0;
    this.z = c || 0
};
goog.exportSymbol("box2d.b2Vec3", box2d.b2Vec3);
box2d.b2Vec3.prototype.x = 0;
goog.exportProperty(box2d.b2Vec3.prototype, "x", box2d.b2Vec3.prototype.x);
box2d.b2Vec3.prototype.y = 0;
goog.exportProperty(box2d.b2Vec3.prototype, "y", box2d.b2Vec3.prototype.y);
box2d.b2Vec3.prototype.z = 0;
goog.exportProperty(box2d.b2Vec3.prototype, "z", box2d.b2Vec3.prototype.z);
box2d.b2Vec3.ZERO = new box2d.b2Vec3;
goog.exportProperty(box2d.b2Vec3, "ZERO", box2d.b2Vec3.ZERO);
box2d.b2Vec3.s_t0 = new box2d.b2Vec3;
goog.exportProperty(box2d.b2Vec3, "s_t0", box2d.b2Vec3.s_t0);
box2d.b2Vec3.prototype.Clone = function () {
    return new box2d.b2Vec3(this.x, this.y, this.z)
};
goog.exportProperty(box2d.b2Vec3.prototype, "Clone", box2d.b2Vec3.prototype.Clone);
box2d.b2Vec3.prototype.SetZero = function () {
    this.z = this.y = this.x = 0;
    return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SetZero", box2d.b2Vec3.prototype.SetZero);
box2d.b2Vec3.prototype.SetXYZ = function (a, b, c) {
    this.x = a;
    this.y = b;
    this.z = c;
    return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SetXYZ", box2d.b2Vec3.prototype.SetXYZ);
box2d.b2Vec3.prototype.Copy = function (a) {
    this.x = a.x;
    this.y = a.y;
    this.z = a.z;
    return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "Copy", box2d.b2Vec3.prototype.Copy);
box2d.b2Vec3.prototype.SelfNeg = function () {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SelfNeg", box2d.b2Vec3.prototype.SelfNeg);
box2d.b2Vec3.prototype.SelfAdd = function (a) {
    this.x += a.x;
    this.y += a.y;
    this.z += a.z;
    return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SelfAdd", box2d.b2Vec3.prototype.SelfAdd);
box2d.b2Vec3.prototype.SelfAddXYZ = function (a, b, c) {
    this.x += a;
    this.y += b;
    this.z += c;
    return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SelfAddXYZ", box2d.b2Vec3.prototype.SelfAddXYZ);
box2d.b2Vec3.prototype.SelfSub = function (a) {
    this.x -= a.x;
    this.y -= a.y;
    this.z -= a.z;
    return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SelfSub", box2d.b2Vec3.prototype.SelfSub);
box2d.b2Vec3.prototype.SelfSubXYZ = function (a, b, c) {
    this.x -= a;
    this.y -= b;
    this.z -= c;
    return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SelfSubXYZ", box2d.b2Vec3.prototype.SelfSubXYZ);
box2d.b2Vec3.prototype.SelfMul = function (a) {
    this.x *= a;
    this.y *= a;
    this.z *= a;
    return this
};
goog.exportProperty(box2d.b2Vec3.prototype, "SelfMul", box2d.b2Vec3.prototype.SelfMul);
box2d.b2DotV3V3 = function (a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z
};
goog.exportSymbol("box2d.b2DotV3V3", box2d.b2DotV3V3);
box2d.b2CrossV3V3 = function (a, b, c) {
    var e = a.x,
        d = a.y;
    a = a.z;
    var f = b.x,
        g = b.y;
    b = b.z;
    c.x = d * b - a * g;
    c.y = a * f - e * b;
    c.z = e * g - d * f;
    return c
};
goog.exportSymbol("box2d.b2CrossV3V3", box2d.b2CrossV3V3);
box2d.b2Mat22 = function () {
    this.ex = new box2d.b2Vec2(1, 0);
    this.ey = new box2d.b2Vec2(0, 1)
};
goog.exportSymbol("box2d.b2Mat22", box2d.b2Mat22);
box2d.b2Mat22.prototype.ex = null;
goog.exportProperty(box2d.b2Mat22.prototype, "ex", box2d.b2Mat22.prototype.ex);
box2d.b2Mat22.prototype.ey = null;
goog.exportProperty(box2d.b2Mat22.prototype, "ey", box2d.b2Mat22.prototype.ey);
box2d.b2Mat22.IDENTITY = new box2d.b2Mat22;
goog.exportProperty(box2d.b2Mat22, "IDENTITY", box2d.b2Mat22.IDENTITY);
box2d.b2Mat22.prototype.Clone = function () {
    return (new box2d.b2Mat22).Copy(this)
};
goog.exportProperty(box2d.b2Mat22.prototype, "Clone", box2d.b2Mat22.prototype.Clone);
box2d.b2Mat22.FromVV = function (a, b) {
    return (new box2d.b2Mat22).SetVV(a, b)
};
goog.exportProperty(box2d.b2Mat22, "FromVV", box2d.b2Mat22.FromVV);
box2d.b2Mat22.FromSSSS = function (a, b, c, e) {
    return (new box2d.b2Mat22).SetSSSS(a, b, c, e)
};
goog.exportProperty(box2d.b2Mat22, "FromSSSS", box2d.b2Mat22.FromSSSS);
box2d.b2Mat22.FromAngleRadians = function (a) {
    return (new box2d.b2Mat22).SetAngleRadians(a)
};
goog.exportProperty(box2d.b2Mat22, "FromAngleRadians", box2d.b2Mat22.FromAngleRadians);
box2d.b2Mat22.prototype.SetSSSS = function (a, b, c, e) {
    this.ex.SetXY(a, c);
    this.ey.SetXY(b, e);
    return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SetSSSS", box2d.b2Mat22.prototype.SetSSSS);
box2d.b2Mat22.prototype.SetVV = function (a, b) {
    this.ex.Copy(a);
    this.ey.Copy(b);
    return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SetVV", box2d.b2Mat22.prototype.SetVV);
box2d.b2Mat22.prototype.SetAngle = function (a) {
    var b = Math.cos(a);
    a = Math.sin(a);
    this.ex.SetXY(b, a);
    this.ey.SetXY(-a, b);
    return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SetAngle", box2d.b2Mat22.prototype.SetAngle);
box2d.b2Mat22.prototype.SetAngleRadians = box2d.b2Mat22.prototype.SetAngle;
box2d.b2Mat22.prototype.SetAngleDegrees = function (a) {
    return this.SetAngle(box2d.b2DegToRad(a))
};
box2d.b2Mat22.prototype.Copy = function (a) {
    this.ex.Copy(a.ex);
    this.ey.Copy(a.ey);
    return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "Copy", box2d.b2Mat22.prototype.Copy);
box2d.b2Mat22.prototype.SetIdentity = function () {
    this.ex.SetXY(1, 0);
    this.ey.SetXY(0, 1);
    return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SetIdentity", box2d.b2Mat22.prototype.SetIdentity);
box2d.b2Mat22.prototype.SetZero = function () {
    this.ex.SetZero();
    this.ey.SetZero();
    return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SetZero", box2d.b2Mat22.prototype.SetZero);
box2d.b2Mat22.prototype.GetAngle = function () {
    return Math.atan2(this.ex.y, this.ex.x)
};
goog.exportProperty(box2d.b2Mat22.prototype, "GetAngle", box2d.b2Mat22.prototype.GetAngle);
box2d.b2Mat22.prototype.GetAngleRadians = box2d.b2Mat22.prototype.GetAngle;
box2d.b2Mat22.prototype.GetInverse = function (a) {
    var b = this.ex.x,
        c = this.ey.x,
        e = this.ex.y,
        d = this.ey.y,
        f = b * d - c * e;
    0 !== f && (f = 1 / f);
    a.ex.x = f * d;
    a.ey.x = -f * c;
    a.ex.y = -f * e;
    a.ey.y = f * b;
    return a
};
goog.exportProperty(box2d.b2Mat22.prototype, "GetInverse", box2d.b2Mat22.prototype.GetInverse);
box2d.b2Mat22.prototype.Solve = function (a, b, c) {
    var e = this.ex.x,
        d = this.ey.x,
        f = this.ex.y,
        g = this.ey.y,
        h = e * g - d * f;
    0 !== h && (h = 1 / h);
    c.x = h * (g * a - d * b);
    c.y = h * (e * b - f * a);
    return c
};
goog.exportProperty(box2d.b2Mat22.prototype, "Solve", box2d.b2Mat22.prototype.Solve);
box2d.b2Mat22.prototype.SelfAbs = function () {
    this.ex.SelfAbs();
    this.ey.SelfAbs();
    return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SelfAbs", box2d.b2Mat22.prototype.SelfAbs);
box2d.b2Mat22.prototype.SelfInv = function () {
    return this.GetInverse(this)
};
goog.exportProperty(box2d.b2Mat22.prototype, "SelfInv", box2d.b2Mat22.prototype.SelfInv);
box2d.b2Mat22.prototype.SelfAddM = function (a) {
    this.ex.SelfAdd(a.ex);
    this.ey.SelfAdd(a.ey);
    return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SelfAddM", box2d.b2Mat22.prototype.SelfAddM);
box2d.b2Mat22.prototype.SelfSubM = function (a) {
    this.ex.SelfSub(a.ex);
    this.ey.SelfSub(a.ey);
    return this
};
goog.exportProperty(box2d.b2Mat22.prototype, "SelfSubM", box2d.b2Mat22.prototype.SelfSubM);
box2d.b2AbsM = function (a, b) {
    var c = a.ex,
        e = a.ey;
    b.ex.x = box2d.b2Abs(c.x);
    b.ex.y = box2d.b2Abs(c.y);
    b.ey.x = box2d.b2Abs(e.x);
    b.ey.y = box2d.b2Abs(e.y);
    return b
};
goog.exportSymbol("box2d.b2AbsM", box2d.b2AbsM);
box2d.b2MulMV = function (a, b, c) {
    var e = a.ex;
    a = a.ey;
    var d = b.x;
    b = b.y;
    c.x = e.x * d + a.x * b;
    c.y = e.y * d + a.y * b;
    return c
};
goog.exportSymbol("box2d.b2MulMV", box2d.b2MulMV);
box2d.b2MulTMV = function (a, b, c) {
    var e = a.ex;
    a = a.ey;
    var d = b.x;
    b = b.y;
    c.x = e.x * d + e.y * b;
    c.y = a.x * d + a.y * b;
    return c
};
goog.exportSymbol("box2d.b2MulTMV", box2d.b2MulTMV);
box2d.b2AddMM = function (a, b, c) {
    var e = a.ex;
    a = a.ey;
    var d = b.ex;
    b = b.ey;
    c.ex.x = e.x + d.x;
    c.ex.y = e.y + d.y;
    c.ey.x = a.x + b.x;
    c.ey.y = a.y + b.y;
    return c
};
goog.exportSymbol("box2d.b2AddMM", box2d.b2AddMM);
box2d.b2MulMM = function (a, b, c) {
    var e = a.ex.x,
        d = a.ex.y,
        f = a.ey.x;
    a = a.ey.y;
    var g = b.ex.x,
        h = b.ex.y,
        l = b.ey.x;
    b = b.ey.y;
    c.ex.x = e * g + f * h;
    c.ex.y = d * g + a * h;
    c.ey.x = e * l + f * b;
    c.ey.y = d * l + a * b;
    return c
};
goog.exportSymbol("box2d.b2MulMM", box2d.b2MulMM);
box2d.b2MulTMM = function (a, b, c) {
    var e = a.ex.x,
        d = a.ex.y,
        f = a.ey.x;
    a = a.ey.y;
    var g = b.ex.x,
        h = b.ex.y,
        l = b.ey.x;
    b = b.ey.y;
    c.ex.x = e * g + d * h;
    c.ex.y = f * g + a * h;
    c.ey.x = e * l + d * b;
    c.ey.y = f * l + a * b;
    return c
};
goog.exportSymbol("box2d.b2MulTMM", box2d.b2MulTMM);
box2d.b2Mat33 = function () {
    this.ex = new box2d.b2Vec3(1, 0, 0);
    this.ey = new box2d.b2Vec3(0, 1, 0);
    this.ez = new box2d.b2Vec3(0, 0, 1)
};
goog.exportSymbol("box2d.b2Mat33", box2d.b2Mat33);
box2d.b2Mat33.prototype.ex = null;
goog.exportProperty(box2d.b2Mat33.prototype, "ex", box2d.b2Mat33.prototype.ex);
box2d.b2Mat33.prototype.ey = null;
goog.exportProperty(box2d.b2Mat33.prototype, "ey", box2d.b2Mat33.prototype.ey);
box2d.b2Mat33.prototype.ez = null;
goog.exportProperty(box2d.b2Mat33.prototype, "ez", box2d.b2Mat33.prototype.ez);
box2d.b2Mat33.IDENTITY = new box2d.b2Mat33;
goog.exportProperty(box2d.b2Mat33, "IDENTITY", box2d.b2Mat33.IDENTITY);
box2d.b2Mat33.prototype.Clone = function () {
    return (new box2d.b2Mat33).Copy(this)
};
goog.exportProperty(box2d.b2Mat33.prototype, "Clone", box2d.b2Mat33.prototype.Clone);
box2d.b2Mat33.prototype.SetVVV = function (a, b, c) {
    this.ex.Copy(a);
    this.ey.Copy(b);
    this.ez.Copy(c);
    return this
};
goog.exportProperty(box2d.b2Mat33.prototype, "SetVVV", box2d.b2Mat33.prototype.SetVVV);
box2d.b2Mat33.prototype.Copy = function (a) {
    this.ex.Copy(a.ex);
    this.ey.Copy(a.ey);
    this.ez.Copy(a.ez);
    return this
};
goog.exportProperty(box2d.b2Mat33.prototype, "Copy", box2d.b2Mat33.prototype.Copy);
box2d.b2Mat33.prototype.SetIdentity = function () {
    this.ex.SetXYZ(1, 0, 0);
    this.ey.SetXYZ(0, 1, 0);
    this.ez.SetXYZ(0, 0, 1);
    return this
};
goog.exportProperty(box2d.b2Mat33.prototype, "SetIdentity", box2d.b2Mat33.prototype.SetIdentity);
box2d.b2Mat33.prototype.SetZero = function () {
    this.ex.SetZero();
    this.ey.SetZero();
    this.ez.SetZero();
    return this
};
goog.exportProperty(box2d.b2Mat33.prototype, "SetZero", box2d.b2Mat33.prototype.SetZero);
box2d.b2Mat33.prototype.SelfAddM = function (a) {
    this.ex.SelfAdd(a.ex);
    this.ey.SelfAdd(a.ey);
    this.ez.SelfAdd(a.ez);
    return this
};
goog.exportProperty(box2d.b2Mat33.prototype, "SelfAddM", box2d.b2Mat33.prototype.SelfAddM);
box2d.b2Mat33.prototype.Solve33 = function (a, b, c, e) {
    var d = this.ex.x,
        f = this.ex.y,
        g = this.ex.z,
        h = this.ey.x,
        l = this.ey.y,
        k = this.ey.z,
        m = this.ez.x,
        n = this.ez.y,
        p = this.ez.z,
        q = d * (l * p - k * n) + f * (k * m - h * p) + g * (h * n - l * m);
    0 !== q && (q = 1 / q);
    e.x = q * (a * (l * p - k * n) + b * (k * m - h * p) + c * (h * n - l * m));
    e.y = q * (d * (b * p - c * n) + f * (c * m - a * p) + g * (a * n - b * m));
    e.z = q * (d * (l * c - k * b) + f * (k * a - h * c) + g * (h * b - l * a));
    return e
};
goog.exportProperty(box2d.b2Mat33.prototype, "Solve33", box2d.b2Mat33.prototype.Solve33);
box2d.b2Mat33.prototype.Solve22 = function (a, b, c) {
    var e = this.ex.x,
        d = this.ey.x,
        f = this.ex.y,
        g = this.ey.y,
        h = e * g - d * f;
    0 !== h && (h = 1 / h);
    c.x = h * (g * a - d * b);
    c.y = h * (e * b - f * a);
    return c
};
goog.exportProperty(box2d.b2Mat33.prototype, "Solve22", box2d.b2Mat33.prototype.Solve22);
box2d.b2Mat33.prototype.GetInverse22 = function (a) {
    var b = this.ex.x,
        c = this.ey.x,
        e = this.ex.y,
        d = this.ey.y,
        f = b * d - c * e;
    0 !== f && (f = 1 / f);
    a.ex.x = f * d;
    a.ey.x = -f * c;
    a.ex.z = 0;
    a.ex.y = -f * e;
    a.ey.y = f * b;
    a.ey.z = 0;
    a.ez.x = 0;
    a.ez.y = 0;
    a.ez.z = 0
};
goog.exportProperty(box2d.b2Mat33.prototype, "GetInverse22", box2d.b2Mat33.prototype.GetInverse22);
box2d.b2Mat33.prototype.GetSymInverse33 = function (a) {
    var b = box2d.b2DotV3V3(this.ex, box2d.b2CrossV3V3(this.ey, this.ez, box2d.b2Vec3.s_t0));
    0 !== b && (b = 1 / b);
    var c = this.ex.x,
        e = this.ey.x,
        d = this.ez.x,
        f = this.ey.y,
        g = this.ez.y,
        h = this.ez.z;
    a.ex.x = b * (f * h - g * g);
    a.ex.y = b * (d * g - e * h);
    a.ex.z = b * (e * g - d * f);
    a.ey.x = a.ex.y;
    a.ey.y = b * (c * h - d * d);
    a.ey.z = b * (d * e - c * g);
    a.ez.x = a.ex.z;
    a.ez.y = a.ey.z;
    a.ez.z = b * (c * f - e * e)
};
goog.exportProperty(box2d.b2Mat33.prototype, "GetSymInverse33", box2d.b2Mat33.prototype.GetSymInverse33);
box2d.b2MulM33V3 = function (a, b, c) {
    var e = b.x,
        d = b.y;
    b = b.z;
    c.x = a.ex.x * e + a.ey.x * d + a.ez.x * b;
    c.y = a.ex.y * e + a.ey.y * d + a.ez.y * b;
    c.z = a.ex.z * e + a.ey.z * d + a.ez.z * b;
    return c
};
goog.exportSymbol("box2d.b2MulM33V3", box2d.b2MulM33V3);
box2d.b2MulM33XYZ = function (a, b, c, e, d) {
    d.x = a.ex.x * b + a.ey.x * c + a.ez.x * e;
    d.y = a.ex.y * b + a.ey.y * c + a.ez.y * e;
    d.z = a.ex.z * b + a.ey.z * c + a.ez.z * e;
    return d
};
goog.exportSymbol("box2d.b2MulM33XYZ", box2d.b2MulM33XYZ);
box2d.b2MulM33V2 = function (a, b, c) {
    var e = b.x;
    b = b.y;
    c.x = a.ex.x * e + a.ey.x * b;
    c.y = a.ex.y * e + a.ey.y * b;
    return c
};
goog.exportSymbol("box2d.b2MulM33V2", box2d.b2MulM33V2);
box2d.b2MulM33XY = function (a, b, c, e) {
    e.x = a.ex.x * b + a.ey.x * c;
    e.y = a.ex.y * b + a.ey.y * c;
    return e
};
goog.exportSymbol("box2d.b2MulM33XY", box2d.b2MulM33XY);
box2d.b2Rot = function (a) {
    a && (this.angle = a, this.s = Math.sin(a), this.c = Math.cos(a))
};
goog.exportSymbol("box2d.b2Rot", box2d.b2Rot);
box2d.b2Rot.prototype.angle = 0;
goog.exportProperty(box2d.b2Rot.prototype, "angle", box2d.b2Rot.prototype.angle);
box2d.b2Rot.prototype.s = 0;
goog.exportProperty(box2d.b2Rot.prototype, "s", box2d.b2Rot.prototype.s);
box2d.b2Rot.prototype.c = 1;
goog.exportProperty(box2d.b2Rot.prototype, "c", box2d.b2Rot.prototype.c);
box2d.b2Rot.IDENTITY = new box2d.b2Rot;
goog.exportProperty(box2d.b2Rot, "IDENTITY", box2d.b2Rot.IDENTITY);
box2d.b2Rot.prototype.Clone = function () {
    return (new box2d.b2Rot).Copy(this)
};
goog.exportProperty(box2d.b2Rot.prototype, "Clone", box2d.b2Rot.prototype.Clone);
box2d.b2Rot.prototype.Copy = function (a) {
    this.angle = a.angle;
    this.s = a.s;
    this.c = a.c;
    return this
};
goog.exportProperty(box2d.b2Rot.prototype, "Copy", box2d.b2Rot.prototype.Copy);
box2d.b2Rot.prototype.SetAngle = function (a) {
    this.angle !== a && (this.angle = a, this.s = Math.sin(a), this.c = Math.cos(a));
    return this
};
goog.exportProperty(box2d.b2Rot.prototype, "SetAngle", box2d.b2Rot.prototype.SetAngle);
box2d.b2Rot.prototype.SetAngleRadians = box2d.b2Rot.prototype.SetAngle;
box2d.b2Rot.prototype.SetAngleDegrees = function (a) {
    return this.SetAngle(box2d.b2DegToRad(a))
};
box2d.b2Rot.prototype.SetIdentity = function () {
    this.s = this.angle = 0;
    this.c = 1;
    return this
};
goog.exportProperty(box2d.b2Rot.prototype, "SetIdentity", box2d.b2Rot.prototype.SetIdentity);
box2d.b2Rot.prototype.GetAngle = function () {
    return this.angle
};
goog.exportProperty(box2d.b2Rot.prototype, "GetAngle", box2d.b2Rot.prototype.GetAngle);
box2d.b2Rot.prototype.GetAngleRadians = box2d.b2Rot.prototype.GetAngle;
box2d.b2Rot.prototype.GetAngleDegrees = function () {
    return box2d.b2RadToDeg(this.GetAngle())
};
box2d.b2Rot.prototype.GetXAxis = function (a) {
    a.x = this.c;
    a.y = this.s;
    return a
};
goog.exportProperty(box2d.b2Rot.prototype, "GetXAxis", box2d.b2Rot.prototype.GetXAxis);
box2d.b2Rot.prototype.GetYAxis = function (a) {
    a.x = -this.s;
    a.y = this.c;
    return a
};
goog.exportProperty(box2d.b2Rot.prototype, "GetYAxis", box2d.b2Rot.prototype.GetYAxis);
box2d.b2MulRR = function (a, b, c) {
    var e = a.c,
        d = a.s,
        f = b.c,
        g = b.s;
    c.s = d * f + e * g;
    c.c = e * f - d * g;
    for (c.angle = a.angle + b.angle; c.angle < -box2d.b2_pi;) c.angle += box2d.b2_two_pi;
    for (; c.angle >= box2d.b2_pi;) c.angle -= box2d.b2_two_pi;
    return c
};
goog.exportSymbol("box2d.b2MulRR", box2d.b2MulRR);
box2d.b2MulTRR = function (a, b, c) {
    var e = a.c,
        d = a.s,
        f = b.c,
        g = b.s;
    c.s = e * g - d * f;
    c.c = e * f + d * g;
    for (c.angle = a.angle - b.angle; c.angle < -box2d.b2_pi;) c.angle += box2d.b2_two_pi;
    for (; c.angle >= box2d.b2_pi;) c.angle -= box2d.b2_two_pi;
    return c
};
goog.exportSymbol("box2d.b2MulTRR", box2d.b2MulTRR);
box2d.b2MulRV = function (a, b, c) {
    var e = a.c;
    a = a.s;
    var d = b.x;
    b = b.y;
    c.x = e * d - a * b;
    c.y = a * d + e * b;
    return c
};
goog.exportSymbol("box2d.b2MulRV", box2d.b2MulRV);
box2d.b2MulTRV = function (a, b, c) {
    var e = a.c;
    a = a.s;
    var d = b.x;
    b = b.y;
    c.x = e * d + a * b;
    c.y = -a * d + e * b;
    return c
};
goog.exportSymbol("box2d.b2MulTRV", box2d.b2MulTRV);
box2d.b2Transform = function () {
    this.p = new box2d.b2Vec2;
    this.q = new box2d.b2Rot
};
goog.exportSymbol("box2d.b2Transform", box2d.b2Transform);
box2d.b2Transform.prototype.p = null;
goog.exportProperty(box2d.b2Transform.prototype, "p", box2d.b2Transform.prototype.p);
box2d.b2Transform.prototype.q = null;
goog.exportProperty(box2d.b2Transform.prototype, "q", box2d.b2Transform.prototype.q);
box2d.b2Transform.IDENTITY = new box2d.b2Transform;
goog.exportProperty(box2d.b2Transform, "IDENTITY", box2d.b2Transform.IDENTITY);
box2d.b2Transform.prototype.Clone = function () {
    return (new box2d.b2Transform).Copy(this)
};
goog.exportProperty(box2d.b2Transform.prototype, "Clone", box2d.b2Transform.prototype.Clone);
box2d.b2Transform.prototype.Copy = function (a) {
    this.p.Copy(a.p);
    this.q.Copy(a.q);
    return this
};
goog.exportProperty(box2d.b2Transform.prototype, "Copy", box2d.b2Transform.prototype.Copy);
box2d.b2Transform.prototype.SetIdentity = function () {
    this.p.SetZero();
    this.q.SetIdentity();
    return this
};
goog.exportProperty(box2d.b2Transform.prototype, "SetIdentity", box2d.b2Transform.prototype.SetIdentity);
box2d.b2Transform.prototype.SetPositionRotation = function (a, b) {
    this.p.Copy(a);
    this.q.Copy(b);
    return this
};
goog.exportProperty(box2d.b2Transform.prototype, "SetPositionRotation", box2d.b2Transform.prototype.SetPositionRotation);
box2d.b2Transform.prototype.SetPositionAngleRadians = function (a, b) {
    this.p.Copy(a);
    this.q.SetAngleRadians(b);
    return this
};
goog.exportProperty(box2d.b2Transform.prototype, "SetPositionAngleRadians", box2d.b2Transform.prototype.SetPositionAngleRadians);
box2d.b2Transform.prototype.SetPosition = function (a) {
    this.p.Copy(a);
    return this
};
goog.exportProperty(box2d.b2Transform.prototype, "SetPosition", box2d.b2Transform.prototype.SetPosition);
box2d.b2Transform.prototype.SetPositionXY = function (a, b) {
    this.p.SetXY(a, b);
    return this
};
goog.exportProperty(box2d.b2Transform.prototype, "SetPositionXY", box2d.b2Transform.prototype.SetPositionXY);
box2d.b2Transform.prototype.SetRotation = function (a) {
    this.q.Copy(a);
    return this
};
goog.exportProperty(box2d.b2Transform.prototype, "SetRotation", box2d.b2Transform.prototype.SetRotation);
box2d.b2Transform.prototype.SetRotationAngleRadians = function (a) {
    this.q.SetAngleRadians(a);
    return this
};
goog.exportProperty(box2d.b2Transform.prototype, "SetRotationAngleRadians", box2d.b2Transform.prototype.SetRotationAngleRadians);
box2d.b2Transform.prototype.GetPosition = function () {
    return this.p
};
goog.exportProperty(box2d.b2Transform.prototype, "GetPosition", box2d.b2Transform.prototype.GetPosition);
box2d.b2Transform.prototype.GetRotation = function () {
    return this.q
};
goog.exportProperty(box2d.b2Transform.prototype, "GetRotation", box2d.b2Transform.prototype.GetRotation);
box2d.b2Transform.prototype.GetRotationAngle = function () {
    return this.q.GetAngle()
};
goog.exportProperty(box2d.b2Transform.prototype, "GetRotationAngle", box2d.b2Transform.prototype.GetRotationAngle);
box2d.b2Transform.prototype.GetRotationAngleRadians = box2d.b2Transform.prototype.GetRotationAngle;
box2d.b2Transform.prototype.GetAngle = function () {
    return this.q.GetAngle()
};
goog.exportProperty(box2d.b2Transform.prototype, "GetAngle", box2d.b2Transform.prototype.GetAngle);
box2d.b2Transform.prototype.GetAngleRadians = box2d.b2Transform.prototype.GetAngle;
box2d.b2MulXV = function (a, b, c) {
    var e = a.q.c,
        d = a.q.s,
        f = b.x;
    b = b.y;
    c.x = e * f - d * b + a.p.x;
    c.y = d * f + e * b + a.p.y;
    return c
};
goog.exportSymbol("box2d.b2MulXV", box2d.b2MulXV);
box2d.b2MulTXV = function (a, b, c) {
    var e = a.q.c,
        d = a.q.s,
        f = b.x - a.p.x;
    a = b.y - a.p.y;
    c.x = e * f + d * a;
    c.y = -d * f + e * a;
    return c
};
goog.exportSymbol("box2d.b2MulTXV", box2d.b2MulTXV);
box2d.b2MulXX = function (a, b, c) {
    box2d.b2MulRR(a.q, b.q, c.q);
    box2d.b2AddVV(box2d.b2MulRV(a.q, b.p, c.p), a.p, c.p);
    return c
};
goog.exportSymbol("box2d.b2MulXX", box2d.b2MulXX);
box2d.b2MulTXX = function (a, b, c) {
    box2d.b2MulTRR(a.q, b.q, c.q);
    box2d.b2MulTRV(a.q, box2d.b2SubVV(b.p, a.p, c.p), c.p);
    return c
};
goog.exportSymbol("box2d.b2MulTXX", box2d.b2MulTXX);
box2d.b2Sweep = function () {
    this.localCenter = new box2d.b2Vec2;
    this.c0 = new box2d.b2Vec2;
    this.c = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2Sweep", box2d.b2Sweep);
box2d.b2Sweep.prototype.localCenter = null;
goog.exportProperty(box2d.b2Sweep.prototype, "localCenter", box2d.b2Sweep.prototype.localCenter);
box2d.b2Sweep.prototype.c0 = null;
goog.exportProperty(box2d.b2Sweep.prototype, "c0", box2d.b2Sweep.prototype.c0);
box2d.b2Sweep.prototype.c = null;
goog.exportProperty(box2d.b2Sweep.prototype, "c", box2d.b2Sweep.prototype.c);
box2d.b2Sweep.prototype.a0 = 0;
goog.exportProperty(box2d.b2Sweep.prototype, "a0", box2d.b2Sweep.prototype.a0);
box2d.b2Sweep.prototype.a = 0;
goog.exportProperty(box2d.b2Sweep.prototype, "a", box2d.b2Sweep.prototype.a);
box2d.b2Sweep.prototype.alpha0 = 0;
goog.exportProperty(box2d.b2Sweep.prototype, "alpha0", box2d.b2Sweep.prototype.alpha0);
box2d.b2Sweep.prototype.Clone = function () {
    return (new box2d.b2Sweep).Copy(this)
};
goog.exportProperty(box2d.b2Sweep.prototype, "Clone", box2d.b2Sweep.prototype.Clone);
box2d.b2Sweep.prototype.Copy = function (a) {
    this.localCenter.Copy(a.localCenter);
    this.c0.Copy(a.c0);
    this.c.Copy(a.c);
    this.a0 = a.a0;
    this.a = a.a;
    this.alpha0 = a.alpha0;
    return this
};
goog.exportProperty(box2d.b2Sweep.prototype, "Copy", box2d.b2Sweep.prototype.Copy);
box2d.b2Sweep.prototype.GetTransform = function (a, b) {
    var c = 1 - b;
    a.p.x = c * this.c0.x + b * this.c.x;
    a.p.y = c * this.c0.y + b * this.c.y;
    a.q.SetAngleRadians(c * this.a0 + b * this.a);
    a.p.SelfSub(box2d.b2MulRV(a.q, this.localCenter, box2d.b2Vec2.s_t0));
    return a
};
goog.exportProperty(box2d.b2Sweep.prototype, "GetTransform", box2d.b2Sweep.prototype.GetTransform);
box2d.b2Sweep.prototype.Advance = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(1 > this.alpha0);
    var b = (a - this.alpha0) / (1 - this.alpha0);
    this.c0.x += b * (this.c.x - this.c0.x);
    this.c0.y += b * (this.c.y - this.c0.y);
    this.a0 += b * (this.a - this.a0);
    this.alpha0 = a
};
goog.exportProperty(box2d.b2Sweep.prototype, "Advance", box2d.b2Sweep.prototype.Advance);
box2d.b2Sweep.prototype.Normalize = function () {
    var a = box2d.b2_two_pi * Math.floor(this.a0 / box2d.b2_two_pi);
    this.a0 -= a;
    this.a -= a
};
goog.exportProperty(box2d.b2Sweep.prototype, "Normalize", box2d.b2Sweep.prototype.Normalize);
box2d.b2ControllerEdge = function () {};
goog.exportSymbol("box2d.b2ControllerEdge", box2d.b2ControllerEdge);
box2d.b2ControllerEdge.prototype.controller = null;
goog.exportProperty(box2d.b2ControllerEdge.prototype, "controller", box2d.b2ControllerEdge.prototype.controller);
box2d.b2ControllerEdge.prototype.body = null;
goog.exportProperty(box2d.b2ControllerEdge.prototype, "body", box2d.b2ControllerEdge.prototype.body);
box2d.b2ControllerEdge.prototype.prevBody = null;
goog.exportProperty(box2d.b2ControllerEdge.prototype, "prevBody", box2d.b2ControllerEdge.prototype.prevBody);
box2d.b2ControllerEdge.prototype.nextBody = null;
goog.exportProperty(box2d.b2ControllerEdge.prototype, "nextBody", box2d.b2ControllerEdge.prototype.nextBody);
box2d.b2ControllerEdge.prototype.prevController = null;
goog.exportProperty(box2d.b2ControllerEdge.prototype, "prevController", box2d.b2ControllerEdge.prototype.prevController);
box2d.b2ControllerEdge.prototype.nextController = null;
goog.exportProperty(box2d.b2ControllerEdge.prototype, "nextController", box2d.b2ControllerEdge.prototype.nextController);
box2d.b2Controller = function () {};
goog.exportSymbol("box2d.b2Controller", box2d.b2Controller);
box2d.b2Controller.prototype.m_world = null;
goog.exportProperty(box2d.b2Controller.prototype, "m_world", box2d.b2Controller.prototype.m_world);
box2d.b2Controller.prototype.m_bodyList = null;
goog.exportProperty(box2d.b2Controller.prototype, "m_bodyList", box2d.b2Controller.prototype.m_bodyList);
box2d.b2Controller.prototype.m_bodyCount = 0;
goog.exportProperty(box2d.b2Controller.prototype, "m_bodyCount", box2d.b2Controller.prototype.m_bodyCount);
box2d.b2Controller.prototype.m_prev = null;
goog.exportProperty(box2d.b2Controller.prototype, "m_prev", box2d.b2Controller.prototype.m_prev);
box2d.b2Controller.prototype.m_next = null;
goog.exportProperty(box2d.b2Controller.prototype, "m_next", box2d.b2Controller.prototype.m_next);
box2d.b2Controller.prototype.Step = function (a) {};
goog.exportProperty(box2d.b2Controller.prototype, "Step", box2d.b2Controller.prototype.Step);
box2d.b2Controller.prototype.Draw = function (a) {};
goog.exportProperty(box2d.b2Controller.prototype, "Draw", box2d.b2Controller.prototype.Draw);
box2d.b2Controller.prototype.GetNext = function () {
    return this.m_next
};
goog.exportProperty(box2d.b2Controller.prototype, "GetNext", box2d.b2Controller.prototype.GetNext);
box2d.b2Controller.prototype.GetPrev = function () {
    return this.m_prev
};
goog.exportProperty(box2d.b2Controller.prototype, "GetPrev", box2d.b2Controller.prototype.GetPrev);
box2d.b2Controller.prototype.GetWorld = function () {
    return this.m_world
};
goog.exportProperty(box2d.b2Controller.prototype, "GetWorld", box2d.b2Controller.prototype.GetWorld);
box2d.b2Controller.prototype.GetBodyList = function () {
    return this.m_bodyList
};
goog.exportProperty(box2d.b2Controller.prototype, "GetBodyList", box2d.b2Controller.prototype.GetBodyList);
box2d.b2Controller.prototype.AddBody = function (a) {
    var b = new box2d.b2ControllerEdge;
    b.body = a;
    b.controller = this;
    b.nextBody = this.m_bodyList;
    b.prevBody = null;
    this.m_bodyList && (this.m_bodyList.prevBody = b);
    this.m_bodyList = b;
    ++this.m_bodyCount;
    b.nextController = a.m_controllerList;
    b.prevController = null;
    a.m_controllerList && (a.m_controllerList.prevController = b);
    a.m_controllerList = b;
    ++a.m_controllerCount
};
goog.exportProperty(box2d.b2Controller.prototype, "AddBody", box2d.b2Controller.prototype.AddBody);
box2d.b2Controller.prototype.RemoveBody = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_bodyCount);
    for (var b = this.m_bodyList; b && b.body !== a;) b = b.nextBody;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(null !== b);
    b.prevBody && (b.prevBody.nextBody = b.nextBody);
    b.nextBody && (b.nextBody.prevBody = b.prevBody);
    this.m_bodyList === b && (this.m_bodyList = b.nextBody);
    --this.m_bodyCount;
    b.nextController && (b.nextController.prevController = b.prevController);
    b.prevController && (b.prevController.nextController = b.nextController);
    a.m_controllerList === b && (a.m_controllerList = b.nextController);
    --a.m_controllerCount
};
goog.exportProperty(box2d.b2Controller.prototype, "RemoveBody", box2d.b2Controller.prototype.RemoveBody);
box2d.b2Controller.prototype.Clear = function () {
    for (; this.m_bodyList;) this.RemoveBody(this.m_bodyList.body);
    this.m_bodyCount = 0
};
goog.exportProperty(box2d.b2Controller.prototype, "Clear", box2d.b2Controller.prototype.Clear);
box2d.b2ConstantAccelController = function () {
    box2d.b2Controller.call(this);
    this.A = new box2d.b2Vec2(0, 0)
};
goog.inherits(box2d.b2ConstantAccelController, box2d.b2Controller);
goog.exportSymbol("box2d.b2ConstantAccelController", box2d.b2ConstantAccelController);
box2d.b2ConstantAccelController.prototype.A = null;
goog.exportProperty(box2d.b2ConstantAccelController.prototype, "A", box2d.b2ConstantAccelController.prototype.A);
box2d.b2ConstantAccelController.prototype.Step = function (a) {
    a = box2d.b2MulSV(a.dt, this.A, box2d.b2ConstantAccelController.prototype.Step.s_dtA);
    for (var b = this.m_bodyList; b; b = b.nextBody) {
        var c = b.body;
        c.IsAwake() && c.SetLinearVelocity(box2d.b2AddVV(c.GetLinearVelocity(), a, box2d.b2Vec2.s_t0))
    }
};
goog.exportProperty(box2d.b2ConstantAccelController.prototype, "Step", box2d.b2ConstantAccelController.prototype.Step);
box2d.b2ConstantAccelController.prototype.Step.s_dtA = new box2d.b2Vec2;
box2d.b2JointType = {
    e_unknownJoint: 0,
    e_revoluteJoint: 1,
    e_prismaticJoint: 2,
    e_distanceJoint: 3,
    e_pulleyJoint: 4,
    e_mouseJoint: 5,
    e_gearJoint: 6,
    e_wheelJoint: 7,
    e_weldJoint: 8,
    e_frictionJoint: 9,
    e_ropeJoint: 10,
    e_motorJoint: 11,
    e_areaJoint: 12
};
goog.exportSymbol("box2d.b2JointType", box2d.b2JointType);
goog.exportProperty(box2d.b2JointType, "e_unknownJoint", box2d.b2JointType.e_unknownJoint);
goog.exportProperty(box2d.b2JointType, "e_revoluteJoint", box2d.b2JointType.e_revoluteJoint);
goog.exportProperty(box2d.b2JointType, "e_prismaticJoint", box2d.b2JointType.e_prismaticJoint);
goog.exportProperty(box2d.b2JointType, "e_distanceJoint", box2d.b2JointType.e_distanceJoint);
goog.exportProperty(box2d.b2JointType, "e_pulleyJoint", box2d.b2JointType.e_pulleyJoint);
goog.exportProperty(box2d.b2JointType, "e_mouseJoint", box2d.b2JointType.e_mouseJoint);
goog.exportProperty(box2d.b2JointType, "e_gearJoint", box2d.b2JointType.e_gearJoint);
goog.exportProperty(box2d.b2JointType, "e_wheelJoint", box2d.b2JointType.e_wheelJoint);
goog.exportProperty(box2d.b2JointType, "e_weldJoint", box2d.b2JointType.e_weldJoint);
goog.exportProperty(box2d.b2JointType, "e_frictionJoint", box2d.b2JointType.e_frictionJoint);
goog.exportProperty(box2d.b2JointType, "e_ropeJoint", box2d.b2JointType.e_ropeJoint);
goog.exportProperty(box2d.b2JointType, "e_motorJoint", box2d.b2JointType.e_motorJoint);
goog.exportProperty(box2d.b2JointType, "e_areaJoint", box2d.b2JointType.e_areaJoint);
box2d.b2LimitState = {
    e_inactiveLimit: 0,
    e_atLowerLimit: 1,
    e_atUpperLimit: 2,
    e_equalLimits: 3
};
goog.exportSymbol("box2d.b2LimitState", box2d.b2LimitState);
goog.exportProperty(box2d.b2LimitState, "e_inactiveLimit", box2d.b2LimitState.e_inactiveLimit);
goog.exportProperty(box2d.b2LimitState, "e_atLowerLimit", box2d.b2LimitState.e_atLowerLimit);
goog.exportProperty(box2d.b2LimitState, "e_atUpperLimit", box2d.b2LimitState.e_atUpperLimit);
goog.exportProperty(box2d.b2LimitState, "e_equalLimits", box2d.b2LimitState.e_equalLimits);
box2d.b2Jacobian = function () {
    this.linear = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2Jacobian", box2d.b2Jacobian);
box2d.b2Jacobian.prototype.linear = null;
goog.exportProperty(box2d.b2Jacobian.prototype, "linear", box2d.b2Jacobian.prototype.linear);
box2d.b2Jacobian.prototype.angularA = 0;
goog.exportProperty(box2d.b2Jacobian.prototype, "angularA", box2d.b2Jacobian.prototype.angularA);
box2d.b2Jacobian.prototype.angularB = 0;
goog.exportProperty(box2d.b2Jacobian.prototype, "angularB", box2d.b2Jacobian.prototype.angularB);
box2d.b2Jacobian.prototype.SetZero = function () {
    this.linear.SetZero();
    this.angularB = this.angularA = 0;
    return this
};
goog.exportProperty(box2d.b2Jacobian.prototype, "SetZero", box2d.b2Jacobian.prototype.SetZero);
box2d.b2Jacobian.prototype.Set = function (a, b, c) {
    this.linear.Copy(a);
    this.angularA = b;
    this.angularB = c;
    return this
};
goog.exportProperty(box2d.b2Jacobian.prototype, "Set", box2d.b2Jacobian.prototype.Set);
box2d.b2JointEdge = function () {};
goog.exportSymbol("box2d.b2JointEdge", box2d.b2JointEdge);
box2d.b2JointEdge.prototype.other = null;
goog.exportProperty(box2d.b2JointEdge.prototype, "other", box2d.b2JointEdge.prototype.other);
box2d.b2JointEdge.prototype.joint = null;
goog.exportProperty(box2d.b2JointEdge.prototype, "joint", box2d.b2JointEdge.prototype.joint);
box2d.b2JointEdge.prototype.prev = null;
goog.exportProperty(box2d.b2JointEdge.prototype, "prev", box2d.b2JointEdge.prototype.prev);
box2d.b2JointEdge.prototype.next = null;
goog.exportProperty(box2d.b2JointEdge.prototype, "next", box2d.b2JointEdge.prototype.next);
box2d.b2JointDef = function (a) {
    this.type = a
};
goog.exportSymbol("box2d.b2JointDef", box2d.b2JointDef);
box2d.b2JointDef.prototype.type = box2d.b2JointType.e_unknownJoint;
goog.exportProperty(box2d.b2JointDef.prototype, "type", box2d.b2JointDef.prototype.type);
box2d.b2JointDef.prototype.userData = null;
goog.exportProperty(box2d.b2JointDef.prototype, "userData", box2d.b2JointDef.prototype.userData);
box2d.b2JointDef.prototype.bodyA = null;
goog.exportProperty(box2d.b2JointDef.prototype, "bodyA", box2d.b2JointDef.prototype.bodyA);
box2d.b2JointDef.prototype.bodyB = null;
goog.exportProperty(box2d.b2JointDef.prototype, "bodyB", box2d.b2JointDef.prototype.bodyB);
box2d.b2JointDef.prototype.collideConnected = !1;
goog.exportProperty(box2d.b2JointDef.prototype, "collideConnected", box2d.b2JointDef.prototype.collideConnected);
box2d.b2Joint = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a.bodyA !== a.bodyB);
    this.m_type = a.type;
    this.m_edgeA = new box2d.b2JointEdge;
    this.m_edgeB = new box2d.b2JointEdge;
    this.m_bodyA = a.bodyA;
    this.m_bodyB = a.bodyB;
    this.m_collideConnected = a.collideConnected;
    this.m_userData = a.userData
};
goog.exportSymbol("box2d.b2Joint", box2d.b2Joint);
box2d.b2Joint.prototype.m_type = box2d.b2JointType.e_unknownJoint;
goog.exportProperty(box2d.b2Joint.prototype, "m_type", box2d.b2Joint.prototype.m_type);
box2d.b2Joint.prototype.m_prev = null;
goog.exportProperty(box2d.b2Joint.prototype, "m_prev", box2d.b2Joint.prototype.m_prev);
box2d.b2Joint.prototype.m_next = null;
goog.exportProperty(box2d.b2Joint.prototype, "m_next", box2d.b2Joint.prototype.m_next);
box2d.b2Joint.prototype.m_edgeA = null;
goog.exportProperty(box2d.b2Joint.prototype, "m_edgeA", box2d.b2Joint.prototype.m_edgeA);
box2d.b2Joint.prototype.m_edgeB = null;
goog.exportProperty(box2d.b2Joint.prototype, "m_edgeB", box2d.b2Joint.prototype.m_edgeB);
box2d.b2Joint.prototype.m_bodyA = null;
goog.exportProperty(box2d.b2Joint.prototype, "m_bodyA", box2d.b2Joint.prototype.m_bodyA);
box2d.b2Joint.prototype.m_bodyB = null;
goog.exportProperty(box2d.b2Joint.prototype, "m_bodyB", box2d.b2Joint.prototype.m_bodyB);
box2d.b2Joint.prototype.m_index = 0;
goog.exportProperty(box2d.b2Joint.prototype, "m_index", box2d.b2Joint.prototype.m_index);
box2d.b2Joint.prototype.m_islandFlag = !1;
goog.exportProperty(box2d.b2Joint.prototype, "m_islandFlag", box2d.b2Joint.prototype.m_islandFlag);
box2d.b2Joint.prototype.m_collideConnected = !1;
goog.exportProperty(box2d.b2Joint.prototype, "m_collideConnected", box2d.b2Joint.prototype.m_collideConnected);
box2d.b2Joint.prototype.m_userData = null;
goog.exportProperty(box2d.b2Joint.prototype, "m_userData", box2d.b2Joint.prototype.m_userData);
box2d.b2Joint.prototype.GetAnchorA = function (a) {
    return a.SetZero()
};
goog.exportProperty(box2d.b2Joint.prototype, "GetAnchorA", box2d.b2Joint.prototype.GetAnchorA);
box2d.b2Joint.prototype.GetAnchorB = function (a) {
    return a.SetZero()
};
goog.exportProperty(box2d.b2Joint.prototype, "GetAnchorB", box2d.b2Joint.prototype.GetAnchorB);
box2d.b2Joint.prototype.GetReactionForce = function (a, b) {
    return b.SetZero()
};
goog.exportProperty(box2d.b2Joint.prototype, "GetReactionForce", box2d.b2Joint.prototype.GetReactionForce);
box2d.b2Joint.prototype.GetReactionTorque = function (a) {
    return 0
};
goog.exportProperty(box2d.b2Joint.prototype, "GetReactionTorque", box2d.b2Joint.prototype.GetReactionTorque);
box2d.b2Joint.prototype.InitVelocityConstraints = function (a) {};
goog.exportProperty(box2d.b2Joint.prototype, "InitVelocityConstraints", box2d.b2Joint.prototype.InitVelocityConstraints);
box2d.b2Joint.prototype.SolveVelocityConstraints = function (a) {};
goog.exportProperty(box2d.b2Joint.prototype, "SolveVelocityConstraints", box2d.b2Joint.prototype.SolveVelocityConstraints);
box2d.b2Joint.prototype.SolvePositionConstraints = function (a) {
    return !1
};
goog.exportProperty(box2d.b2Joint.prototype, "SolvePositionConstraints", box2d.b2Joint.prototype.SolvePositionConstraints);
box2d.b2Joint.prototype.GetType = function () {
    return this.m_type
};
goog.exportProperty(box2d.b2Joint.prototype, "GetType", box2d.b2Joint.prototype.GetType);
box2d.b2Joint.prototype.GetBodyA = function () {
    return this.m_bodyA
};
goog.exportProperty(box2d.b2Joint.prototype, "GetBodyA", box2d.b2Joint.prototype.GetBodyA);
box2d.b2Joint.prototype.GetBodyB = function () {
    return this.m_bodyB
};
goog.exportProperty(box2d.b2Joint.prototype, "GetBodyB", box2d.b2Joint.prototype.GetBodyB);
box2d.b2Joint.prototype.GetNext = function () {
    return this.m_next
};
goog.exportProperty(box2d.b2Joint.prototype, "GetNext", box2d.b2Joint.prototype.GetNext);
box2d.b2Joint.prototype.GetUserData = function () {
    return this.m_userData
};
goog.exportProperty(box2d.b2Joint.prototype, "GetUserData", box2d.b2Joint.prototype.GetUserData);
box2d.b2Joint.prototype.SetUserData = function (a) {
    this.m_userData = a
};
goog.exportProperty(box2d.b2Joint.prototype, "SetUserData", box2d.b2Joint.prototype.SetUserData);
box2d.b2Joint.prototype.GetCollideConnected = function () {
    return this.m_collideConnected
};
goog.exportProperty(box2d.b2Joint.prototype, "GetCollideConnected", box2d.b2Joint.prototype.GetCollideConnected);
box2d.b2Joint.prototype.Dump = function () {
    box2d.DEBUG && box2d.b2Log("// Dump is not supported for this joint type.\n")
};
goog.exportProperty(box2d.b2Joint.prototype, "Dump", box2d.b2Joint.prototype.Dump);
box2d.b2Joint.prototype.IsActive = function () {
    return this.m_bodyA.IsActive() && this.m_bodyB.IsActive()
};
goog.exportProperty(box2d.b2Joint.prototype, "IsActive", box2d.b2Joint.prototype.IsActive);
box2d.b2Joint.prototype.ShiftOrigin = function (a) {};
goog.exportProperty(box2d.b2Joint.prototype, "ShiftOrigin", box2d.b2Joint.prototype.ShiftOrigin);
box2d.b2RevoluteJointDef = function () {
    box2d.b2JointDef.call(this, box2d.b2JointType.e_revoluteJoint);
    this.localAnchorA = new box2d.b2Vec2(0, 0);
    this.localAnchorB = new box2d.b2Vec2(0, 0)
};
goog.inherits(box2d.b2RevoluteJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2RevoluteJointDef", box2d.b2RevoluteJointDef);
box2d.b2RevoluteJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "localAnchorA", box2d.b2RevoluteJointDef.prototype.localAnchorA);
box2d.b2RevoluteJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "localAnchorB", box2d.b2RevoluteJointDef.prototype.localAnchorB);
box2d.b2RevoluteJointDef.prototype.referenceAngle = 0;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "referenceAngle", box2d.b2RevoluteJointDef.prototype.referenceAngle);
box2d.b2RevoluteJointDef.prototype.enableLimit = !1;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "enableLimit", box2d.b2RevoluteJointDef.prototype.enableLimit);
box2d.b2RevoluteJointDef.prototype.lowerAngle = 0;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "lowerAngle", box2d.b2RevoluteJointDef.prototype.lowerAngle);
box2d.b2RevoluteJointDef.prototype.upperAngle = 0;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "upperAngle", box2d.b2RevoluteJointDef.prototype.upperAngle);
box2d.b2RevoluteJointDef.prototype.enableMotor = !1;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "enableMotor", box2d.b2RevoluteJointDef.prototype.enableMotor);
box2d.b2RevoluteJointDef.prototype.motorSpeed = 0;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "motorSpeed", box2d.b2RevoluteJointDef.prototype.motorSpeed);
box2d.b2RevoluteJointDef.prototype.maxMotorTorque = 0;
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "maxMotorTorque", box2d.b2RevoluteJointDef.prototype.maxMotorTorque);
box2d.b2RevoluteJointDef.prototype.Initialize = function (a, b, c) {
    this.bodyA = a;
    this.bodyB = b;
    this.bodyA.GetLocalPoint(c, this.localAnchorA);
    this.bodyB.GetLocalPoint(c, this.localAnchorB);
    this.referenceAngle = this.bodyB.GetAngleRadians() - this.bodyA.GetAngleRadians()
};
goog.exportProperty(box2d.b2RevoluteJointDef.prototype, "Initialize", box2d.b2RevoluteJointDef.prototype.Initialize);
box2d.b2RevoluteJoint = function (a) {
    box2d.b2Joint.call(this, a);
    this.m_localAnchorA = new box2d.b2Vec2;
    this.m_localAnchorB = new box2d.b2Vec2;
    this.m_impulse = new box2d.b2Vec3;
    this.m_rA = new box2d.b2Vec2;
    this.m_rB = new box2d.b2Vec2;
    this.m_localCenterA = new box2d.b2Vec2;
    this.m_localCenterB = new box2d.b2Vec2;
    this.m_mass = new box2d.b2Mat33;
    this.m_qA = new box2d.b2Rot;
    this.m_qB = new box2d.b2Rot;
    this.m_lalcA = new box2d.b2Vec2;
    this.m_lalcB = new box2d.b2Vec2;
    this.m_K = new box2d.b2Mat22;
    this.m_localAnchorA.Copy(a.localAnchorA);
    this.m_localAnchorB.Copy(a.localAnchorB);
    this.m_referenceAngle = a.referenceAngle;
    this.m_impulse.SetZero();
    this.m_motorImpulse = 0;
    this.m_lowerAngle = a.lowerAngle;
    this.m_upperAngle = a.upperAngle;
    this.m_maxMotorTorque = a.maxMotorTorque;
    this.m_motorSpeed = a.motorSpeed;
    this.m_enableLimit = a.enableLimit;
    this.m_enableMotor = a.enableMotor;
    this.m_limitState = box2d.b2LimitState.e_inactiveLimit
};
goog.inherits(box2d.b2RevoluteJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2RevoluteJoint", box2d.b2RevoluteJoint);
box2d.b2RevoluteJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_localAnchorA", box2d.b2RevoluteJoint.prototype.m_localAnchorA);
box2d.b2RevoluteJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_localAnchorB", box2d.b2RevoluteJoint.prototype.m_localAnchorB);
box2d.b2RevoluteJoint.prototype.m_impulse = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_impulse", box2d.b2RevoluteJoint.prototype.m_impulse);
box2d.b2RevoluteJoint.prototype.m_motorImpulse = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_motorImpulse", box2d.b2RevoluteJoint.prototype.m_motorImpulse);
box2d.b2RevoluteJoint.prototype.m_enableMotor = !1;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_enableMotor", box2d.b2RevoluteJoint.prototype.m_enableMotor);
box2d.b2RevoluteJoint.prototype.m_maxMotorTorque = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_maxMotorTorque", box2d.b2RevoluteJoint.prototype.m_maxMotorTorque);
box2d.b2RevoluteJoint.prototype.m_motorSpeed = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_motorSpeed", box2d.b2RevoluteJoint.prototype.m_motorSpeed);
box2d.b2RevoluteJoint.prototype.m_enableLimit = !1;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_enableLimit", box2d.b2RevoluteJoint.prototype.m_enableLimit);
box2d.b2RevoluteJoint.prototype.m_referenceAngle = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_referenceAngle", box2d.b2RevoluteJoint.prototype.m_referenceAngle);
box2d.b2RevoluteJoint.prototype.m_lowerAngle = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_lowerAngle", box2d.b2RevoluteJoint.prototype.m_lowerAngle);
box2d.b2RevoluteJoint.prototype.m_upperAngle = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_upperAngle", box2d.b2RevoluteJoint.prototype.m_upperAngle);
box2d.b2RevoluteJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_indexA", box2d.b2RevoluteJoint.prototype.m_indexA);
box2d.b2RevoluteJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_indexB", box2d.b2RevoluteJoint.prototype.m_indexB);
box2d.b2RevoluteJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_rA", box2d.b2RevoluteJoint.prototype.m_rA);
box2d.b2RevoluteJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_rB", box2d.b2RevoluteJoint.prototype.m_rB);
box2d.b2RevoluteJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_localCenterA", box2d.b2RevoluteJoint.prototype.m_localCenterA);
box2d.b2RevoluteJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_localCenterB", box2d.b2RevoluteJoint.prototype.m_localCenterB);
box2d.b2RevoluteJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_invMassA", box2d.b2RevoluteJoint.prototype.m_invMassA);
box2d.b2RevoluteJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_invMassB", box2d.b2RevoluteJoint.prototype.m_invMassB);
box2d.b2RevoluteJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_invIA", box2d.b2RevoluteJoint.prototype.m_invIA);
box2d.b2RevoluteJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_invIB", box2d.b2RevoluteJoint.prototype.m_invIB);
box2d.b2RevoluteJoint.prototype.m_mass = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_mass", box2d.b2RevoluteJoint.prototype.m_mass);
box2d.b2RevoluteJoint.prototype.m_motorMass = 0;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_motorMass", box2d.b2RevoluteJoint.prototype.m_motorMass);
box2d.b2RevoluteJoint.prototype.m_limitState = box2d.b2LimitState.e_inactiveLimit;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_limitState", box2d.b2RevoluteJoint.prototype.m_limitState);
box2d.b2RevoluteJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_qA", box2d.b2RevoluteJoint.prototype.m_qA);
box2d.b2RevoluteJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_qB", box2d.b2RevoluteJoint.prototype.m_qB);
box2d.b2RevoluteJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_lalcA", box2d.b2RevoluteJoint.prototype.m_lalcA);
box2d.b2RevoluteJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_lalcB", box2d.b2RevoluteJoint.prototype.m_lalcB);
box2d.b2RevoluteJoint.prototype.m_K = null;
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "m_K", box2d.b2RevoluteJoint.prototype.m_K);
box2d.b2RevoluteJoint.prototype.InitVelocityConstraints = function (a) {
    this.m_indexA = this.m_bodyA.m_islandIndex;
    this.m_indexB = this.m_bodyB.m_islandIndex;
    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
    this.m_invMassA = this.m_bodyA.m_invMass;
    this.m_invMassB = this.m_bodyB.m_invMass;
    this.m_invIA = this.m_bodyA.m_invI;
    this.m_invIB = this.m_bodyB.m_invI;
    var b = a.positions[this.m_indexA].a,
        c = a.velocities[this.m_indexA].v,
        e = a.velocities[this.m_indexA].w,
        d = a.positions[this.m_indexB].a,
        f = a.velocities[this.m_indexB].v,
        g = a.velocities[this.m_indexB].w,
        h = this.m_qA.SetAngleRadians(b),
        l = this.m_qB.SetAngleRadians(d);
    box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
    box2d.b2MulRV(h, this.m_lalcA, this.m_rA);
    box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    box2d.b2MulRV(l, this.m_lalcB, this.m_rB);
    var h = this.m_invMassA,
        l = this.m_invMassB,
        k = this.m_invIA,
        m = this.m_invIB,
        n = 0 === k + m;
    this.m_mass.ex.x = h + l + this.m_rA.y * this.m_rA.y * k + this.m_rB.y *
        this.m_rB.y * m;
    this.m_mass.ey.x = -this.m_rA.y * this.m_rA.x * k - this.m_rB.y * this.m_rB.x * m;
    this.m_mass.ez.x = -this.m_rA.y * k - this.m_rB.y * m;
    this.m_mass.ex.y = this.m_mass.ey.x;
    this.m_mass.ey.y = h + l + this.m_rA.x * this.m_rA.x * k + this.m_rB.x * this.m_rB.x * m;
    this.m_mass.ez.y = this.m_rA.x * k + this.m_rB.x * m;
    this.m_mass.ex.z = this.m_mass.ez.x;
    this.m_mass.ey.z = this.m_mass.ez.y;
    this.m_mass.ez.z = k + m;
    this.m_motorMass = k + m;
    0 < this.m_motorMass && (this.m_motorMass = 1 / this.m_motorMass);
    if (!1 === this.m_enableMotor || n) this.m_motorImpulse = 0;
    this.m_enableLimit && !1 === n ? (b = d - b - this.m_referenceAngle, box2d.b2Abs(this.m_upperAngle - this.m_lowerAngle) < 2 * box2d.b2_angularSlop ? this.m_limitState = box2d.b2LimitState.e_equalLimits : b <= this.m_lowerAngle ? (this.m_limitState !== box2d.b2LimitState.e_atLowerLimit && (this.m_impulse.z = 0), this.m_limitState = box2d.b2LimitState.e_atLowerLimit) : b >= this.m_upperAngle ? (this.m_limitState !== box2d.b2LimitState.e_atUpperLimit && (this.m_impulse.z = 0), this.m_limitState = box2d.b2LimitState.e_atUpperLimit) : (this.m_limitState = box2d.b2LimitState.e_inactiveLimit,
        this.m_impulse.z = 0)) : this.m_limitState = box2d.b2LimitState.e_inactiveLimit;
    a.step.warmStarting ? (this.m_impulse.SelfMul(a.step.dtRatio), this.m_motorImpulse *= a.step.dtRatio, b = box2d.b2RevoluteJoint.prototype.InitVelocityConstraints.s_P.SetXY(this.m_impulse.x, this.m_impulse.y), c.SelfMulSub(h, b), e -= k * (box2d.b2CrossVV(this.m_rA, b) + this.m_motorImpulse + this.m_impulse.z), f.SelfMulAdd(l, b), g += m * (box2d.b2CrossVV(this.m_rB, b) + this.m_motorImpulse + this.m_impulse.z)) : (this.m_impulse.SetZero(), this.m_motorImpulse =
        0);
    a.velocities[this.m_indexA].w = e;
    a.velocities[this.m_indexB].w = g
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "InitVelocityConstraints", box2d.b2RevoluteJoint.prototype.InitVelocityConstraints);
box2d.b2RevoluteJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints = function (a) {
    var b = a.velocities[this.m_indexA].v,
        c = a.velocities[this.m_indexA].w,
        e = a.velocities[this.m_indexB].v,
        d = a.velocities[this.m_indexB].w,
        f = this.m_invMassA,
        g = this.m_invMassB,
        h = this.m_invIA,
        l = this.m_invIB,
        k = 0 === h + l;
    if (this.m_enableMotor && this.m_limitState !== box2d.b2LimitState.e_equalLimits && !1 === k) {
        var m = d - c - this.m_motorSpeed,
            m = -this.m_motorMass * m,
            n = this.m_motorImpulse,
            p = a.step.dt * this.m_maxMotorTorque;
        this.m_motorImpulse = box2d.b2Clamp(this.m_motorImpulse +
            m, -p, p);
        m = this.m_motorImpulse - n;
        c -= h * m;
        d += l * m
    }
    this.m_enableLimit && this.m_limitState !== box2d.b2LimitState.e_inactiveLimit && !1 === k ? (k = box2d.b2SubVV(box2d.b2AddVCrossSV(e, d, this.m_rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2Vec2.s_t1), box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_Cdot1), m = this.m_mass.Solve33(k.x, k.y, d - c, box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_impulse3).SelfNeg(), this.m_limitState === box2d.b2LimitState.e_equalLimits ? this.m_impulse.SelfAdd(m) :
        this.m_limitState === box2d.b2LimitState.e_atLowerLimit ? (n = this.m_impulse.z + m.z, 0 > n ? (n = -k.x + this.m_impulse.z * this.m_mass.ez.x, k = -k.y + this.m_impulse.z * this.m_mass.ez.y, k = this.m_mass.Solve22(n, k, box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_reduced), m.x = k.x, m.y = k.y, m.z = -this.m_impulse.z, this.m_impulse.x += k.x, this.m_impulse.y += k.y, this.m_impulse.z = 0) : this.m_impulse.SelfAdd(m)) : this.m_limitState === box2d.b2LimitState.e_atUpperLimit && (n = this.m_impulse.z + m.z, 0 < n ? (n = -k.x + this.m_impulse.z * this.m_mass.ez.x,
            k = -k.y + this.m_impulse.z * this.m_mass.ez.y, k = this.m_mass.Solve22(n, k, box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_reduced), m.x = k.x, m.y = k.y, m.z = -this.m_impulse.z, this.m_impulse.x += k.x, this.m_impulse.y += k.y, this.m_impulse.z = 0) : this.m_impulse.SelfAdd(m)), k = box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_P.SetXY(m.x, m.y), b.SelfMulSub(f, k), c -= h * (box2d.b2CrossVV(this.m_rA, k) + m.z), e.SelfMulAdd(g, k), d += l * (box2d.b2CrossVV(this.m_rB, k) + m.z)) : (m = box2d.b2SubVV(box2d.b2AddVCrossSV(e, d, this.m_rB,
        box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2Vec2.s_t1), box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_Cdot), m = this.m_mass.Solve22(-m.x, -m.y, box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_impulse2), this.m_impulse.x += m.x, this.m_impulse.y += m.y, b.SelfMulSub(f, m), c -= h * box2d.b2CrossVV(this.m_rA, m), e.SelfMulAdd(g, m), d += l * box2d.b2CrossVV(this.m_rB, m));
    a.velocities[this.m_indexA].w = c;
    a.velocities[this.m_indexB].w = d
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "SolveVelocityConstraints", box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints);
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_Cdot = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_Cdot1 = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_impulse3 = new box2d.b2Vec3;
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_reduced = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.SolveVelocityConstraints.s_impulse2 = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.SolvePositionConstraints = function (a) {
    var b = a.positions[this.m_indexA].c,
        c = a.positions[this.m_indexA].a,
        e = a.positions[this.m_indexB].c,
        d = a.positions[this.m_indexB].a,
        f = this.m_qA.SetAngleRadians(c),
        g = this.m_qB.SetAngleRadians(d),
        h = 0,
        l = 0,
        l = 0 === this.m_invIA + this.m_invIB;
    if (this.m_enableLimit && this.m_limitState !== box2d.b2LimitState.e_inactiveLimit && !1 === l) {
        var k = d - c - this.m_referenceAngle,
            l = 0;
        this.m_limitState === box2d.b2LimitState.e_equalLimits ? (k = box2d.b2Clamp(k - this.m_lowerAngle, -box2d.b2_maxAngularCorrection, box2d.b2_maxAngularCorrection), l = -this.m_motorMass * k, h = box2d.b2Abs(k)) : this.m_limitState === box2d.b2LimitState.e_atLowerLimit ? (k -= this.m_lowerAngle, h = -k, k = box2d.b2Clamp(k + box2d.b2_angularSlop, -box2d.b2_maxAngularCorrection, 0), l = -this.m_motorMass * k) : this.m_limitState === box2d.b2LimitState.e_atUpperLimit && (h = k -= this.m_upperAngle, k = box2d.b2Clamp(k - box2d.b2_angularSlop, 0, box2d.b2_maxAngularCorrection), l = -this.m_motorMass * k);
        c -= this.m_invIA * l;
        d += this.m_invIB * l
    }
    f.SetAngleRadians(c);
    g.SetAngleRadians(d);
    box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
    f = box2d.b2MulRV(f, this.m_lalcA, this.m_rA);
    box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    var g = box2d.b2MulRV(g, this.m_lalcB, this.m_rB),
        k = box2d.b2SubVV(box2d.b2AddVV(e, g, box2d.b2Vec2.s_t0), box2d.b2AddVV(b, f, box2d.b2Vec2.s_t1), box2d.b2RevoluteJoint.prototype.SolvePositionConstraints.s_C),
        l = k.GetLength(),
        m = this.m_invMassA,
        n = this.m_invMassB,
        p = this.m_invIA,
        q = this.m_invIB,
        r = this.m_K;
    r.ex.x = m + n +
        p * f.y * f.y + q * g.y * g.y;
    r.ex.y = -p * f.x * f.y - q * g.x * g.y;
    r.ey.x = r.ex.y;
    r.ey.y = m + n + p * f.x * f.x + q * g.x * g.x;
    k = r.Solve(k.x, k.y, box2d.b2RevoluteJoint.prototype.SolvePositionConstraints.s_impulse).SelfNeg();
    b.SelfMulSub(m, k);
    c -= p * box2d.b2CrossVV(f, k);
    e.SelfMulAdd(n, k);
    d += q * box2d.b2CrossVV(g, k);
    a.positions[this.m_indexA].a = c;
    a.positions[this.m_indexB].a = d;
    return l <= box2d.b2_linearSlop && h <= box2d.b2_angularSlop
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "SolvePositionConstraints", box2d.b2RevoluteJoint.prototype.SolvePositionConstraints);
box2d.b2RevoluteJoint.prototype.SolvePositionConstraints.s_C = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.SolvePositionConstraints.s_impulse = new box2d.b2Vec2;
box2d.b2RevoluteJoint.prototype.GetAnchorA = function (a) {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetAnchorA", box2d.b2RevoluteJoint.prototype.GetAnchorA);
box2d.b2RevoluteJoint.prototype.GetAnchorB = function (a) {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetAnchorB", box2d.b2RevoluteJoint.prototype.GetAnchorB);
box2d.b2RevoluteJoint.prototype.GetReactionForce = function (a, b) {
    return b.SetXY(a * this.m_impulse.x, a * this.m_impulse.y)
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetReactionForce", box2d.b2RevoluteJoint.prototype.GetReactionForce);
box2d.b2RevoluteJoint.prototype.GetReactionTorque = function (a) {
    return a * this.m_impulse.z
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetReactionTorque", box2d.b2RevoluteJoint.prototype.GetReactionTorque);
box2d.b2RevoluteJoint.prototype.GetLocalAnchorA = function (a) {
    return a.Copy(this.m_localAnchorA)
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetLocalAnchorA", box2d.b2RevoluteJoint.prototype.GetLocalAnchorA);
box2d.b2RevoluteJoint.prototype.GetLocalAnchorB = function (a) {
    return a.Copy(this.m_localAnchorB)
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetLocalAnchorB", box2d.b2RevoluteJoint.prototype.GetLocalAnchorB);
box2d.b2RevoluteJoint.prototype.GetReferenceAngle = function () {
    return this.m_referenceAngle
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetReferenceAngle", box2d.b2RevoluteJoint.prototype.GetReferenceAngle);
box2d.b2RevoluteJoint.prototype.GetJointAngleRadians = function () {
    return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetJointAngleRadians", box2d.b2RevoluteJoint.prototype.GetJointAngleRadians);
box2d.b2RevoluteJoint.prototype.GetJointSpeed = function () {
    return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetJointSpeed", box2d.b2RevoluteJoint.prototype.GetJointSpeed);
box2d.b2RevoluteJoint.prototype.IsMotorEnabled = function () {
    return this.m_enableMotor
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "IsMotorEnabled", box2d.b2RevoluteJoint.prototype.IsMotorEnabled);
box2d.b2RevoluteJoint.prototype.EnableMotor = function (a) {
    this.m_enableMotor !== a && (this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_enableMotor = a)
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "EnableMotor", box2d.b2RevoluteJoint.prototype.EnableMotor);
box2d.b2RevoluteJoint.prototype.GetMotorTorque = function (a) {
    return a * this.m_motorImpulse
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetMotorTorque", box2d.b2RevoluteJoint.prototype.GetMotorTorque);
box2d.b2RevoluteJoint.prototype.GetMotorSpeed = function () {
    return this.m_motorSpeed
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetMotorSpeed", box2d.b2RevoluteJoint.prototype.GetMotorSpeed);
box2d.b2RevoluteJoint.prototype.SetMaxMotorTorque = function (a) {
    this.m_maxMotorTorque = a
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "SetMaxMotorTorque", box2d.b2RevoluteJoint.prototype.SetMaxMotorTorque);
box2d.b2RevoluteJoint.prototype.GetMaxMotorTorque = function () {
    return this.m_maxMotorTorque
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetMaxMotorTorque", box2d.b2RevoluteJoint.prototype.GetMaxMotorTorque);
box2d.b2RevoluteJoint.prototype.IsLimitEnabled = function () {
    return this.m_enableLimit
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "IsLimitEnabled", box2d.b2RevoluteJoint.prototype.IsLimitEnabled);
box2d.b2RevoluteJoint.prototype.EnableLimit = function (a) {
    a !== this.m_enableLimit && (this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_enableLimit = a, this.m_impulse.z = 0)
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "EnableLimit", box2d.b2RevoluteJoint.prototype.EnableLimit);
box2d.b2RevoluteJoint.prototype.GetLowerLimit = function () {
    return this.m_lowerAngle
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetLowerLimit", box2d.b2RevoluteJoint.prototype.GetLowerLimit);
box2d.b2RevoluteJoint.prototype.GetUpperLimit = function () {
    return this.m_upperAngle
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "GetUpperLimit", box2d.b2RevoluteJoint.prototype.GetUpperLimit);
box2d.b2RevoluteJoint.prototype.SetLimits = function (a, b) {
    if (a !== this.m_lowerAngle || b !== this.m_upperAngle) this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_impulse.z = 0, this.m_lowerAngle = a, this.m_upperAngle = b
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "SetLimits", box2d.b2RevoluteJoint.prototype.SetLimits);
box2d.b2RevoluteJoint.prototype.SetMotorSpeed = function (a) {
    this.m_motorSpeed !== a && (this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_motorSpeed = a)
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "SetMotorSpeed", box2d.b2RevoluteJoint.prototype.SetMotorSpeed);
box2d.b2RevoluteJoint.prototype.Dump = function () {
    if (box2d.DEBUG) {
        var a = this.m_bodyA.m_islandIndex,
            b = this.m_bodyB.m_islandIndex;
        box2d.b2Log("  /*box2d.b2RevoluteJointDef*/ var jd = new box2d.b2RevoluteJointDef();\n");
        box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
        box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
        box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
        box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
        box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n",
            this.m_localAnchorB.x, this.m_localAnchorB.y);
        box2d.b2Log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
        box2d.b2Log("  jd.enableLimit = %s;\n", this.m_enableLimit ? "true" : "false");
        box2d.b2Log("  jd.lowerAngle = %.15f;\n", this.m_lowerAngle);
        box2d.b2Log("  jd.upperAngle = %.15f;\n", this.m_upperAngle);
        box2d.b2Log("  jd.enableMotor = %s;\n", this.m_enableMotor ? "true" : "false");
        box2d.b2Log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
        box2d.b2Log("  jd.maxMotorTorque = %.15f;\n", this.m_maxMotorTorque);
        box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
    }
};
goog.exportProperty(box2d.b2RevoluteJoint.prototype, "Dump", box2d.b2RevoluteJoint.prototype.Dump);
box2d.b2PrismaticJointDef = function () {
    box2d.b2JointDef.call(this, box2d.b2JointType.e_prismaticJoint);
    this.localAnchorA = new box2d.b2Vec2;
    this.localAnchorB = new box2d.b2Vec2;
    this.localAxisA = new box2d.b2Vec2(1, 0)
};
goog.inherits(box2d.b2PrismaticJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2PrismaticJointDef", box2d.b2PrismaticJointDef);
box2d.b2PrismaticJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "localAnchorA", box2d.b2PrismaticJointDef.prototype.localAnchorA);
box2d.b2PrismaticJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "localAnchorB", box2d.b2PrismaticJointDef.prototype.localAnchorB);
box2d.b2PrismaticJointDef.prototype.localAxisA = null;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "localAxisA", box2d.b2PrismaticJointDef.prototype.localAxisA);
box2d.b2PrismaticJointDef.prototype.referenceAngle = 0;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "referenceAngle", box2d.b2PrismaticJointDef.prototype.referenceAngle);
box2d.b2PrismaticJointDef.prototype.enableLimit = !1;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "enableLimit", box2d.b2PrismaticJointDef.prototype.enableLimit);
box2d.b2PrismaticJointDef.prototype.lowerTranslation = 0;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "lowerTranslation", box2d.b2PrismaticJointDef.prototype.lowerTranslation);
box2d.b2PrismaticJointDef.prototype.upperTranslation = 0;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "upperTranslation", box2d.b2PrismaticJointDef.prototype.upperTranslation);
box2d.b2PrismaticJointDef.prototype.enableMotor = !1;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "enableMotor", box2d.b2PrismaticJointDef.prototype.enableMotor);
box2d.b2PrismaticJointDef.prototype.maxMotorForce = 0;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "maxMotorForce", box2d.b2PrismaticJointDef.prototype.maxMotorForce);
box2d.b2PrismaticJointDef.prototype.motorSpeed = 0;
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "motorSpeed", box2d.b2PrismaticJointDef.prototype.motorSpeed);
box2d.b2PrismaticJointDef.prototype.Initialize = function (a, b, c, e) {
    this.bodyA = a;
    this.bodyB = b;
    this.bodyA.GetLocalPoint(c, this.localAnchorA);
    this.bodyB.GetLocalPoint(c, this.localAnchorB);
    this.bodyA.GetLocalVector(e, this.localAxisA);
    this.referenceAngle = this.bodyB.GetAngleRadians() - this.bodyA.GetAngleRadians()
};
goog.exportProperty(box2d.b2PrismaticJointDef.prototype, "Initialize", box2d.b2PrismaticJointDef.prototype.Initialize);
box2d.b2PrismaticJoint = function (a) {
    box2d.b2Joint.call(this, a);
    this.m_localAnchorA = a.localAnchorA.Clone();
    this.m_localAnchorB = a.localAnchorB.Clone();
    this.m_localXAxisA = a.localAxisA.Clone().SelfNormalize();
    this.m_localYAxisA = box2d.b2CrossOneV(this.m_localXAxisA, new box2d.b2Vec2);
    this.m_referenceAngle = a.referenceAngle;
    this.m_impulse = new box2d.b2Vec3(0, 0, 0);
    this.m_lowerTranslation = a.lowerTranslation;
    this.m_upperTranslation = a.upperTranslation;
    this.m_maxMotorForce = a.maxMotorForce;
    this.m_motorSpeed = a.motorSpeed;
    this.m_enableLimit = a.enableLimit;
    this.m_enableMotor = a.enableMotor;
    this.m_localCenterA = new box2d.b2Vec2;
    this.m_localCenterB = new box2d.b2Vec2;
    this.m_axis = new box2d.b2Vec2(0, 0);
    this.m_perp = new box2d.b2Vec2(0, 0);
    this.m_K = new box2d.b2Mat33;
    this.m_K3 = new box2d.b2Mat33;
    this.m_K2 = new box2d.b2Mat22;
    this.m_qA = new box2d.b2Rot;
    this.m_qB = new box2d.b2Rot;
    this.m_lalcA = new box2d.b2Vec2;
    this.m_lalcB = new box2d.b2Vec2;
    this.m_rA = new box2d.b2Vec2;
    this.m_rB = new box2d.b2Vec2
};
goog.inherits(box2d.b2PrismaticJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2PrismaticJoint", box2d.b2PrismaticJoint);
box2d.b2PrismaticJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_localAnchorA", box2d.b2PrismaticJoint.prototype.m_localAnchorA);
box2d.b2PrismaticJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_localAnchorB", box2d.b2PrismaticJoint.prototype.m_localAnchorB);
box2d.b2PrismaticJoint.prototype.m_localXAxisA = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_localXAxisA", box2d.b2PrismaticJoint.prototype.m_localXAxisA);
box2d.b2PrismaticJoint.prototype.m_localYAxisA = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_localYAxisA", box2d.b2PrismaticJoint.prototype.m_localYAxisA);
box2d.b2PrismaticJoint.prototype.m_referenceAngle = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_referenceAngle", box2d.b2PrismaticJoint.prototype.m_referenceAngle);
box2d.b2PrismaticJoint.prototype.m_impulse = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_impulse", box2d.b2PrismaticJoint.prototype.m_impulse);
box2d.b2PrismaticJoint.prototype.m_motorImpulse = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_motorImpulse", box2d.b2PrismaticJoint.prototype.m_motorImpulse);
box2d.b2PrismaticJoint.prototype.m_lowerTranslation = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_lowerTranslation", box2d.b2PrismaticJoint.prototype.m_lowerTranslation);
box2d.b2PrismaticJoint.prototype.m_upperTranslation = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_upperTranslation", box2d.b2PrismaticJoint.prototype.m_upperTranslation);
box2d.b2PrismaticJoint.prototype.m_maxMotorForce = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_maxMotorForce", box2d.b2PrismaticJoint.prototype.m_maxMotorForce);
box2d.b2PrismaticJoint.prototype.m_motorSpeed = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_motorSpeed", box2d.b2PrismaticJoint.prototype.m_motorSpeed);
box2d.b2PrismaticJoint.prototype.m_enableLimit = !1;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_enableLimit", box2d.b2PrismaticJoint.prototype.m_enableLimit);
box2d.b2PrismaticJoint.prototype.m_enableMotor = !1;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_enableMotor", box2d.b2PrismaticJoint.prototype.m_enableMotor);
box2d.b2PrismaticJoint.prototype.m_limitState = box2d.b2LimitState.e_inactiveLimit;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_limitState", box2d.b2PrismaticJoint.prototype.m_limitState);
box2d.b2PrismaticJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_indexA", box2d.b2PrismaticJoint.prototype.m_indexA);
box2d.b2PrismaticJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_indexB", box2d.b2PrismaticJoint.prototype.m_indexB);
box2d.b2PrismaticJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_localCenterA", box2d.b2PrismaticJoint.prototype.m_localCenterA);
box2d.b2PrismaticJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_localCenterB", box2d.b2PrismaticJoint.prototype.m_localCenterB);
box2d.b2PrismaticJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_invMassA", box2d.b2PrismaticJoint.prototype.m_invMassA);
box2d.b2PrismaticJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_invMassB", box2d.b2PrismaticJoint.prototype.m_invMassB);
box2d.b2PrismaticJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_invIA", box2d.b2PrismaticJoint.prototype.m_invIA);
box2d.b2PrismaticJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_invIB", box2d.b2PrismaticJoint.prototype.m_invIB);
box2d.b2PrismaticJoint.prototype.m_axis = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_axis", box2d.b2PrismaticJoint.prototype.m_axis);
box2d.b2PrismaticJoint.prototype.m_perp = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_perp", box2d.b2PrismaticJoint.prototype.m_perp);
box2d.b2PrismaticJoint.prototype.m_s1 = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_s1", box2d.b2PrismaticJoint.prototype.m_s1);
box2d.b2PrismaticJoint.prototype.m_s2 = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_s2", box2d.b2PrismaticJoint.prototype.m_s2);
box2d.b2PrismaticJoint.prototype.m_a1 = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_a1", box2d.b2PrismaticJoint.prototype.m_a1);
box2d.b2PrismaticJoint.prototype.m_a2 = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_a2", box2d.b2PrismaticJoint.prototype.m_a2);
box2d.b2PrismaticJoint.prototype.m_K = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_K", box2d.b2PrismaticJoint.prototype.m_K);
box2d.b2PrismaticJoint.prototype.m_K3 = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_K3", box2d.b2PrismaticJoint.prototype.m_K3);
box2d.b2PrismaticJoint.prototype.m_K2 = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_K2", box2d.b2PrismaticJoint.prototype.m_K2);
box2d.b2PrismaticJoint.prototype.m_motorMass = 0;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_motorMass", box2d.b2PrismaticJoint.prototype.m_motorMass);
box2d.b2PrismaticJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_qA", box2d.b2PrismaticJoint.prototype.m_qA);
box2d.b2PrismaticJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_qB", box2d.b2PrismaticJoint.prototype.m_qB);
box2d.b2PrismaticJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_lalcA", box2d.b2PrismaticJoint.prototype.m_lalcA);
box2d.b2PrismaticJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_lalcB", box2d.b2PrismaticJoint.prototype.m_lalcB);
box2d.b2PrismaticJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_rA", box2d.b2PrismaticJoint.prototype.m_rA);
box2d.b2PrismaticJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "m_rB", box2d.b2PrismaticJoint.prototype.m_rB);
box2d.b2PrismaticJoint.prototype.InitVelocityConstraints = function (a) {
    this.m_indexA = this.m_bodyA.m_islandIndex;
    this.m_indexB = this.m_bodyB.m_islandIndex;
    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
    this.m_invMassA = this.m_bodyA.m_invMass;
    this.m_invMassB = this.m_bodyB.m_invMass;
    this.m_invIA = this.m_bodyA.m_invI;
    this.m_invIB = this.m_bodyB.m_invI;
    var b = a.positions[this.m_indexA].c,
        c = a.velocities[this.m_indexA].v,
        e = a.velocities[this.m_indexA].w,
        d = a.positions[this.m_indexB].c,
        f = a.positions[this.m_indexB].a,
        g = a.velocities[this.m_indexB].v,
        h = a.velocities[this.m_indexB].w,
        l = this.m_qA.SetAngleRadians(a.positions[this.m_indexA].a),
        f = this.m_qB.SetAngleRadians(f);
    box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
    var k = box2d.b2MulRV(l, this.m_lalcA, this.m_rA);
    box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    var m = box2d.b2MulRV(f, this.m_lalcB, this.m_rB),
        n = box2d.b2AddVV(box2d.b2SubVV(d, b, box2d.b2Vec2.s_t0), box2d.b2SubVV(m,
            k, box2d.b2Vec2.s_t1), box2d.b2PrismaticJoint.prototype.InitVelocityConstraints.s_d),
        b = this.m_invMassA,
        d = this.m_invMassB,
        f = this.m_invIA,
        p = this.m_invIB;
    box2d.b2MulRV(l, this.m_localXAxisA, this.m_axis);
    this.m_a1 = box2d.b2CrossVV(box2d.b2AddVV(n, k, box2d.b2Vec2.s_t0), this.m_axis);
    this.m_a2 = box2d.b2CrossVV(m, this.m_axis);
    this.m_motorMass = b + d + f * this.m_a1 * this.m_a1 + p * this.m_a2 * this.m_a2;
    0 < this.m_motorMass && (this.m_motorMass = 1 / this.m_motorMass);
    box2d.b2MulRV(l, this.m_localYAxisA, this.m_perp);
    this.m_s1 = box2d.b2CrossVV(box2d.b2AddVV(n,
        k, box2d.b2Vec2.s_t0), this.m_perp);
    this.m_s2 = box2d.b2CrossVV(m, this.m_perp);
    this.m_K.ex.x = b + d + f * this.m_s1 * this.m_s1 + p * this.m_s2 * this.m_s2;
    this.m_K.ex.y = f * this.m_s1 + p * this.m_s2;
    this.m_K.ex.z = f * this.m_s1 * this.m_a1 + p * this.m_s2 * this.m_a2;
    this.m_K.ey.x = this.m_K.ex.y;
    this.m_K.ey.y = f + p;
    0 === this.m_K.ey.y && (this.m_K.ey.y = 1);
    this.m_K.ey.z = f * this.m_a1 + p * this.m_a2;
    this.m_K.ez.x = this.m_K.ex.z;
    this.m_K.ez.y = this.m_K.ey.z;
    this.m_K.ez.z = b + d + f * this.m_a1 * this.m_a1 + p * this.m_a2 * this.m_a2;
    this.m_enableLimit ? (l = box2d.b2DotVV(this.m_axis,
        n), box2d.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * box2d.b2_linearSlop ? this.m_limitState = box2d.b2LimitState.e_equalLimits : l <= this.m_lowerTranslation ? this.m_limitState !== box2d.b2LimitState.e_atLowerLimit && (this.m_limitState = box2d.b2LimitState.e_atLowerLimit, this.m_impulse.z = 0) : l >= this.m_upperTranslation ? this.m_limitState !== box2d.b2LimitState.e_atUpperLimit && (this.m_limitState = box2d.b2LimitState.e_atUpperLimit, this.m_impulse.z = 0) : (this.m_limitState = box2d.b2LimitState.e_inactiveLimit,
        this.m_impulse.z = 0)) : (this.m_limitState = box2d.b2LimitState.e_inactiveLimit, this.m_impulse.z = 0);
    !1 === this.m_enableMotor && (this.m_motorImpulse = 0);
    a.step.warmStarting ? (this.m_impulse.SelfMul(a.step.dtRatio), this.m_motorImpulse *= a.step.dtRatio, l = box2d.b2AddVV(box2d.b2MulSV(this.m_impulse.x, this.m_perp, box2d.b2Vec2.s_t0), box2d.b2MulSV(this.m_motorImpulse + this.m_impulse.z, this.m_axis, box2d.b2Vec2.s_t1), box2d.b2PrismaticJoint.prototype.InitVelocityConstraints.s_P), k = this.m_impulse.x * this.m_s1 + this.m_impulse.y +
        (this.m_motorImpulse + this.m_impulse.z) * this.m_a1, m = this.m_impulse.x * this.m_s2 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a2, c.SelfMulSub(b, l), e -= f * k, g.SelfMulAdd(d, l), h += p * m) : (this.m_impulse.SetZero(), this.m_motorImpulse = 0);
    a.velocities[this.m_indexA].w = e;
    a.velocities[this.m_indexB].w = h
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "InitVelocityConstraints", box2d.b2PrismaticJoint.prototype.InitVelocityConstraints);
box2d.b2PrismaticJoint.prototype.InitVelocityConstraints.s_d = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints = function (a) {
    var b = a.velocities[this.m_indexA].v,
        c = a.velocities[this.m_indexA].w,
        e = a.velocities[this.m_indexB].v,
        d = a.velocities[this.m_indexB].w,
        f = this.m_invMassA,
        g = this.m_invMassB,
        h = this.m_invIA,
        l = this.m_invIB;
    if (this.m_enableMotor && this.m_limitState !== box2d.b2LimitState.e_equalLimits) {
        var k = box2d.b2DotVV(this.m_axis, box2d.b2SubVV(e, b, box2d.b2Vec2.s_t0)) + this.m_a2 * d - this.m_a1 * c,
            k = this.m_motorMass * (this.m_motorSpeed - k),
            m = this.m_motorImpulse,
            n = a.step.dt * this.m_maxMotorForce;
        this.m_motorImpulse = box2d.b2Clamp(this.m_motorImpulse + k, -n, n);
        k = this.m_motorImpulse - m;
        m = box2d.b2MulSV(k, this.m_axis, box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_P);
        n = k * this.m_a1;
        k *= this.m_a2;
        b.SelfMulSub(f, m);
        c -= h * n;
        e.SelfMulAdd(g, m);
        d += l * k
    }
    var n = box2d.b2DotVV(this.m_perp, box2d.b2SubVV(e, b, box2d.b2Vec2.s_t0)) + this.m_s2 * d - this.m_s1 * c,
        p = d - c;
    this.m_enableLimit && this.m_limitState !== box2d.b2LimitState.e_inactiveLimit ? (k = box2d.b2DotVV(this.m_axis, box2d.b2SubVV(e,
        b, box2d.b2Vec2.s_t0)) + this.m_a2 * d - this.m_a1 * c, m = box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_f1.Copy(this.m_impulse), k = this.m_K.Solve33(-n, -p, -k, box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_df3), this.m_impulse.SelfAdd(k), this.m_limitState === box2d.b2LimitState.e_atLowerLimit ? this.m_impulse.z = box2d.b2Max(this.m_impulse.z, 0) : this.m_limitState === box2d.b2LimitState.e_atUpperLimit && (this.m_impulse.z = box2d.b2Min(this.m_impulse.z, 0)), n = this.m_K.Solve22(-n - (this.m_impulse.z - m.z) *
        this.m_K.ez.x, -p - (this.m_impulse.z - m.z) * this.m_K.ez.y, box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_f2r), n.x += m.x, n.y += m.y, this.m_impulse.x = n.x, this.m_impulse.y = n.y, k.x = this.m_impulse.x - m.x, k.y = this.m_impulse.y - m.y, k.z = this.m_impulse.z - m.z, m = box2d.b2AddVV(box2d.b2MulSV(k.x, this.m_perp, box2d.b2Vec2.s_t0), box2d.b2MulSV(k.z, this.m_axis, box2d.b2Vec2.s_t1), box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_P), n = k.x * this.m_s1 + k.y + k.z * this.m_a1, k = k.x * this.m_s2 + k.y + k.z * this.m_a2) : (k =
        this.m_K.Solve22(-n, -p, box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_df2), this.m_impulse.x += k.x, this.m_impulse.y += k.y, m = box2d.b2MulSV(k.x, this.m_perp, box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_P), n = k.x * this.m_s1 + k.y, k = k.x * this.m_s2 + k.y);
    b.SelfMulSub(f, m);
    c -= h * n;
    e.SelfMulAdd(g, m);
    a.velocities[this.m_indexA].w = c;
    a.velocities[this.m_indexB].w = d + l * k
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "SolveVelocityConstraints", box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints);
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_f2r = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_f1 = new box2d.b2Vec3;
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_df3 = new box2d.b2Vec3;
box2d.b2PrismaticJoint.prototype.SolveVelocityConstraints.s_df2 = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.SolvePositionConstraints = function (a) {
    var b = a.positions[this.m_indexA].c,
        c = a.positions[this.m_indexA].a,
        e = a.positions[this.m_indexB].c,
        d = a.positions[this.m_indexB].a,
        f = this.m_qA.SetAngleRadians(c),
        g = this.m_qB.SetAngleRadians(d),
        h = this.m_invMassA,
        l = this.m_invMassB,
        k = this.m_invIA,
        m = this.m_invIB,
        n = box2d.b2MulRV(f, this.m_lalcA, this.m_rA),
        p = box2d.b2MulRV(g, this.m_lalcB, this.m_rB),
        q = box2d.b2SubVV(box2d.b2AddVV(e, p, box2d.b2Vec2.s_t0), box2d.b2AddVV(b, n, box2d.b2Vec2.s_t1), box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_d),
        r = box2d.b2MulRV(f, this.m_localXAxisA, this.m_axis),
        t = box2d.b2CrossVV(box2d.b2AddVV(q, n, box2d.b2Vec2.s_t0), r),
        g = box2d.b2CrossVV(p, r),
        f = box2d.b2MulRV(f, this.m_localYAxisA, this.m_perp),
        s = box2d.b2CrossVV(box2d.b2AddVV(q, n, box2d.b2Vec2.s_t0), f),
        u = box2d.b2CrossVV(p, f),
        v = box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_impulse,
        y = box2d.b2DotVV(f, q),
        D = d - c - this.m_referenceAngle,
        n = box2d.b2Abs(y),
        p = box2d.b2Abs(D),
        x = !1,
        w = 0;
    this.m_enableLimit && (q = box2d.b2DotVV(r, q), box2d.b2Abs(this.m_upperTranslation -
        this.m_lowerTranslation) < 2 * box2d.b2_linearSlop ? (w = box2d.b2Clamp(q, -box2d.b2_maxLinearCorrection, box2d.b2_maxLinearCorrection), n = box2d.b2Max(n, box2d.b2Abs(q)), x = !0) : q <= this.m_lowerTranslation ? (w = box2d.b2Clamp(q - this.m_lowerTranslation + box2d.b2_linearSlop, -box2d.b2_maxLinearCorrection, 0), n = box2d.b2Max(n, this.m_lowerTranslation - q), x = !0) : q >= this.m_upperTranslation && (w = box2d.b2Clamp(q - this.m_upperTranslation - box2d.b2_linearSlop, 0, box2d.b2_maxLinearCorrection), n = box2d.b2Max(n, q - this.m_upperTranslation),
        x = !0));
    if (x) {
        var q = k * s + m * u,
            C = k * s * t + m * u * g,
            x = k + m;
        0 === x && (x = 1);
        var A = k * t + m * g,
            E = h + l + k * t * t + m * g * g,
            B = this.m_K3;
        B.ex.SetXYZ(h + l + k * s * s + m * u * u, q, C);
        B.ey.SetXYZ(q, x, A);
        B.ez.SetXYZ(C, A, E);
        v = B.Solve33(-y, -D, -w, v)
    } else q = k * s + m * u, x = k + m, 0 === x && (x = 1), w = this.m_K2, w.ex.SetXY(h + l + k * s * s + m * u * u, q), w.ey.SetXY(q, x), y = w.Solve(-y, -D, box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_impulse1), v.x = y.x, v.y = y.y, v.z = 0;
    r = box2d.b2AddVV(box2d.b2MulSV(v.x, f, box2d.b2Vec2.s_t0), box2d.b2MulSV(v.z, r, box2d.b2Vec2.s_t1), box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_P);
    t = v.x * s + v.y + v.z * t;
    g = v.x * u + v.y + v.z * g;
    b.SelfMulSub(h, r);
    c -= k * t;
    e.SelfMulAdd(l, r);
    a.positions[this.m_indexA].a = c;
    a.positions[this.m_indexB].a = d + m * g;
    return n <= box2d.b2_linearSlop && p <= box2d.b2_angularSlop
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "SolvePositionConstraints", box2d.b2PrismaticJoint.prototype.SolvePositionConstraints);
box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_d = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_impulse = new box2d.b2Vec3;
box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_impulse1 = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.GetAnchorA = function (a) {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetAnchorA", box2d.b2PrismaticJoint.prototype.GetAnchorA);
box2d.b2PrismaticJoint.prototype.GetAnchorB = function (a) {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetAnchorB", box2d.b2PrismaticJoint.prototype.GetAnchorB);
box2d.b2PrismaticJoint.prototype.GetReactionForce = function (a, b) {
    return b.SetXY(a * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x), a * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y))
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetReactionForce", box2d.b2PrismaticJoint.prototype.GetReactionForce);
box2d.b2PrismaticJoint.prototype.GetReactionTorque = function (a) {
    return a * this.m_impulse.y
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetReactionTorque", box2d.b2PrismaticJoint.prototype.GetReactionTorque);
box2d.b2PrismaticJoint.prototype.GetLocalAnchorA = function (a) {
    return a.Copy(this.m_localAnchorA)
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetLocalAnchorA", box2d.b2PrismaticJoint.prototype.GetLocalAnchorA);
box2d.b2PrismaticJoint.prototype.GetLocalAnchorB = function (a) {
    return a.Copy(this.m_localAnchorB)
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetLocalAnchorB", box2d.b2PrismaticJoint.prototype.GetLocalAnchorB);
box2d.b2PrismaticJoint.prototype.GetLocalAxisA = function (a) {
    return a.Copy(this.m_localXAxisA)
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetLocalAxisA", box2d.b2PrismaticJoint.prototype.GetLocalAxisA);
box2d.b2PrismaticJoint.prototype.GetReferenceAngle = function () {
    return this.m_referenceAngle
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetReferenceAngle", box2d.b2PrismaticJoint.prototype.GetReferenceAngle);
box2d.b2PrismaticJoint.prototype.GetJointTranslation = function () {
    var a = this.m_bodyA.GetWorldPoint(this.m_localAnchorA, box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_pA),
        b = this.m_bodyB.GetWorldPoint(this.m_localAnchorB, box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_pB),
        a = box2d.b2SubVV(b, a, box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_d),
        b = this.m_bodyA.GetWorldVector(this.m_localXAxisA, box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_axis);
    return box2d.b2DotVV(a, b)
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetJointTranslation", box2d.b2PrismaticJoint.prototype.GetJointTranslation);
box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_pA = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_pB = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_d = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.GetJointTranslation.s_axis = new box2d.b2Vec2;
box2d.b2PrismaticJoint.prototype.GetJointSpeed = function () {
    var a = this.m_bodyA,
        b = this.m_bodyB;
    box2d.b2SubVV(this.m_localAnchorA, a.m_sweep.localCenter, this.m_lalcA);
    var c = box2d.b2MulRV(a.m_xf.q, this.m_lalcA, this.m_rA);
    box2d.b2SubVV(this.m_localAnchorB, b.m_sweep.localCenter, this.m_lalcB);
    var e = box2d.b2MulRV(b.m_xf.q, this.m_lalcB, this.m_rB),
        d = box2d.b2AddVV(a.m_sweep.c, c, box2d.b2Vec2.s_t0),
        f = box2d.b2AddVV(b.m_sweep.c, e, box2d.b2Vec2.s_t1),
        d = box2d.b2SubVV(f, d, box2d.b2Vec2.s_t2),
        f = a.GetWorldVector(this.m_localXAxisA,
            this.m_axis),
        g = a.m_linearVelocity,
        h = b.m_linearVelocity,
        a = a.m_angularVelocity,
        b = b.m_angularVelocity;
    return box2d.b2DotVV(d, box2d.b2CrossSV(a, f, box2d.b2Vec2.s_t0)) + box2d.b2DotVV(f, box2d.b2SubVV(box2d.b2AddVCrossSV(h, b, e, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(g, a, c, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t0))
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetJointSpeed", box2d.b2PrismaticJoint.prototype.GetJointSpeed);
box2d.b2PrismaticJoint.prototype.IsLimitEnabled = function () {
    return this.m_enableLimit
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "IsLimitEnabled", box2d.b2PrismaticJoint.prototype.IsLimitEnabled);
box2d.b2PrismaticJoint.prototype.EnableLimit = function (a) {
    a !== this.m_enableLimit && (this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_enableLimit = a, this.m_impulse.z = 0)
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "EnableLimit", box2d.b2PrismaticJoint.prototype.EnableLimit);
box2d.b2PrismaticJoint.prototype.GetLowerLimit = function () {
    return this.m_lowerTranslation
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetLowerLimit", box2d.b2PrismaticJoint.prototype.GetLowerLimit);
box2d.b2PrismaticJoint.prototype.GetUpperLimit = function () {
    return this.m_upperTranslation
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetUpperLimit", box2d.b2PrismaticJoint.prototype.GetUpperLimit);
box2d.b2PrismaticJoint.prototype.SetLimits = function (a, b) {
    if (a !== this.m_lowerTranslation || b !== this.m_upperTranslation) this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_lowerTranslation = a, this.m_upperTranslation = b, this.m_impulse.z = 0
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "SetLimits", box2d.b2PrismaticJoint.prototype.SetLimits);
box2d.b2PrismaticJoint.prototype.IsMotorEnabled = function () {
    return this.m_enableMotor
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "IsMotorEnabled", box2d.b2PrismaticJoint.prototype.IsMotorEnabled);
box2d.b2PrismaticJoint.prototype.EnableMotor = function (a) {
    this.m_bodyA.SetAwake(!0);
    this.m_bodyB.SetAwake(!0);
    this.m_enableMotor = a
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "EnableMotor", box2d.b2PrismaticJoint.prototype.EnableMotor);
box2d.b2PrismaticJoint.prototype.SetMotorSpeed = function (a) {
    this.m_bodyA.SetAwake(!0);
    this.m_bodyB.SetAwake(!0);
    this.m_motorSpeed = a
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "SetMotorSpeed", box2d.b2PrismaticJoint.prototype.SetMotorSpeed);
box2d.b2PrismaticJoint.prototype.GetMotorSpeed = function () {
    return this.m_motorSpeed
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetMotorSpeed", box2d.b2PrismaticJoint.prototype.GetMotorSpeed);
box2d.b2PrismaticJoint.prototype.SetMaxMotorForce = function (a) {
    this.m_bodyA.SetAwake(!0);
    this.m_bodyB.SetAwake(!0);
    this.m_maxMotorForce = a
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "SetMaxMotorForce", box2d.b2PrismaticJoint.prototype.SetMaxMotorForce);
box2d.b2PrismaticJoint.prototype.GetMaxMotorForce = function () {
    return this.m_maxMotorForce
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetMaxMotorForce", box2d.b2PrismaticJoint.prototype.GetMaxMotorForce);
box2d.b2PrismaticJoint.prototype.GetMotorForce = function (a) {
    return a * this.m_motorImpulse
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "GetMotorForce", box2d.b2PrismaticJoint.prototype.GetMotorForce);
box2d.b2PrismaticJoint.prototype.Dump = function () {
    if (box2d.DEBUG) {
        var a = this.m_bodyA.m_islandIndex,
            b = this.m_bodyB.m_islandIndex;
        box2d.b2Log("  /*box2d.b2PrismaticJointDef*/ var jd = new box2d.b2PrismaticJointDef();\n");
        box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
        box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
        box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
        box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
        box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n",
            this.m_localAnchorB.x, this.m_localAnchorB.y);
        box2d.b2Log("  jd.localAxisA.SetXY(%.15f, %.15f);\n", this.m_localXAxisA.x, this.m_localXAxisA.y);
        box2d.b2Log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
        box2d.b2Log("  jd.enableLimit = %s;\n", this.m_enableLimit ? "true" : "false");
        box2d.b2Log("  jd.lowerTranslation = %.15f;\n", this.m_lowerTranslation);
        box2d.b2Log("  jd.upperTranslation = %.15f;\n", this.m_upperTranslation);
        box2d.b2Log("  jd.enableMotor = %s;\n", this.m_enableMotor ? "true" : "false");
        box2d.b2Log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
        box2d.b2Log("  jd.maxMotorForce = %.15f;\n", this.m_maxMotorForce);
        box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
    }
};
goog.exportProperty(box2d.b2PrismaticJoint.prototype, "Dump", box2d.b2PrismaticJoint.prototype.Dump);
box2d.b2GearJointDef = function () {
    box2d.b2JointDef.call(this, box2d.b2JointType.e_gearJoint)
};
goog.inherits(box2d.b2GearJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2GearJointDef", box2d.b2GearJointDef);
box2d.b2GearJointDef.prototype.joint1 = null;
goog.exportProperty(box2d.b2GearJointDef.prototype, "joint1", box2d.b2GearJointDef.prototype.joint1);
box2d.b2GearJointDef.prototype.joint2 = null;
goog.exportProperty(box2d.b2GearJointDef.prototype, "joint2", box2d.b2GearJointDef.prototype.joint2);
box2d.b2GearJointDef.prototype.ratio = 1;
goog.exportProperty(box2d.b2GearJointDef.prototype, "ratio", box2d.b2GearJointDef.prototype.ratio);
box2d.b2GearJoint = function (a) {
    box2d.b2Joint.call(this, a);
    this.m_joint1 = a.joint1;
    this.m_joint2 = a.joint2;
    this.m_localAnchorA = new box2d.b2Vec2;
    this.m_localAnchorB = new box2d.b2Vec2;
    this.m_localAnchorC = new box2d.b2Vec2;
    this.m_localAnchorD = new box2d.b2Vec2;
    this.m_localAxisC = new box2d.b2Vec2;
    this.m_localAxisD = new box2d.b2Vec2;
    this.m_lcA = new box2d.b2Vec2;
    this.m_lcB = new box2d.b2Vec2;
    this.m_lcC = new box2d.b2Vec2;
    this.m_lcD = new box2d.b2Vec2;
    this.m_JvAC = new box2d.b2Vec2;
    this.m_JvBD = new box2d.b2Vec2;
    this.m_qA =
        new box2d.b2Rot;
    this.m_qB = new box2d.b2Rot;
    this.m_qC = new box2d.b2Rot;
    this.m_qD = new box2d.b2Rot;
    this.m_lalcA = new box2d.b2Vec2;
    this.m_lalcB = new box2d.b2Vec2;
    this.m_lalcC = new box2d.b2Vec2;
    this.m_lalcD = new box2d.b2Vec2;
    this.m_typeA = this.m_joint1.GetType();
    this.m_typeB = this.m_joint2.GetType();
    box2d.ENABLE_ASSERTS && box2d.b2Assert(this.m_typeA === box2d.b2JointType.e_revoluteJoint || this.m_typeA === box2d.b2JointType.e_prismaticJoint);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(this.m_typeB === box2d.b2JointType.e_revoluteJoint ||
        this.m_typeB === box2d.b2JointType.e_prismaticJoint);
    var b, c;
    this.m_bodyC = this.m_joint1.GetBodyA();
    this.m_bodyA = this.m_joint1.GetBodyB();
    b = this.m_bodyA.m_xf;
    var e = this.m_bodyA.m_sweep.a;
    c = this.m_bodyC.m_xf;
    var d = this.m_bodyC.m_sweep.a;
    this.m_typeA === box2d.b2JointType.e_revoluteJoint ? (c = a.joint1, this.m_localAnchorC.Copy(c.m_localAnchorA), this.m_localAnchorA.Copy(c.m_localAnchorB), this.m_referenceAngleA = c.m_referenceAngle, this.m_localAxisC.SetZero(), b = e - d - this.m_referenceAngleA) : (d = a.joint1, this.m_localAnchorC.Copy(d.m_localAnchorA),
        this.m_localAnchorA.Copy(d.m_localAnchorB), this.m_referenceAngleA = d.m_referenceAngle, this.m_localAxisC.Copy(d.m_localXAxisA), e = this.m_localAnchorC, b = box2d.b2MulTRV(c.q, box2d.b2AddVV(box2d.b2MulRV(b.q, this.m_localAnchorA, box2d.b2Vec2.s_t0), box2d.b2SubVV(b.p, c.p, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), b = box2d.b2DotVV(box2d.b2SubVV(b, e, box2d.b2Vec2.s_t0), this.m_localAxisC));
    this.m_bodyD = this.m_joint2.GetBodyA();
    this.m_bodyB = this.m_joint2.GetBodyB();
    c = this.m_bodyB.m_xf;
    var d = this.m_bodyB.m_sweep.a,
        e = this.m_bodyD.m_xf,
        f = this.m_bodyD.m_sweep.a;
    this.m_typeB === box2d.b2JointType.e_revoluteJoint ? (c = a.joint2, this.m_localAnchorD.Copy(c.m_localAnchorA), this.m_localAnchorB.Copy(c.m_localAnchorB), this.m_referenceAngleB = c.m_referenceAngle, this.m_localAxisD.SetZero(), c = d - f - this.m_referenceAngleB) : (d = a.joint2, this.m_localAnchorD.Copy(d.m_localAnchorA), this.m_localAnchorB.Copy(d.m_localAnchorB), this.m_referenceAngleB = d.m_referenceAngle, this.m_localAxisD.Copy(d.m_localXAxisA), d = this.m_localAnchorD, c = box2d.b2MulTRV(e.q,
        box2d.b2AddVV(box2d.b2MulRV(c.q, this.m_localAnchorB, box2d.b2Vec2.s_t0), box2d.b2SubVV(c.p, e.p, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), c = box2d.b2DotVV(box2d.b2SubVV(c, d, box2d.b2Vec2.s_t0), this.m_localAxisD));
    this.m_ratio = a.ratio;
    this.m_constant = b + this.m_ratio * c;
    this.m_impulse = 0
};
goog.inherits(box2d.b2GearJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2GearJoint", box2d.b2GearJoint);
box2d.b2GearJoint.prototype.m_joint1 = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_joint1", box2d.b2GearJoint.prototype.m_joint1);
box2d.b2GearJoint.prototype.m_joint2 = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_joint2", box2d.b2GearJoint.prototype.m_joint2);
box2d.b2GearJoint.prototype.m_typeA = box2d.b2JointType.e_unknownJoint;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_typeA", box2d.b2GearJoint.prototype.m_typeA);
box2d.b2GearJoint.prototype.m_typeB = box2d.b2JointType.e_unknownJoint;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_typeB", box2d.b2GearJoint.prototype.m_typeB);
box2d.b2GearJoint.prototype.m_bodyC = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_bodyC", box2d.b2GearJoint.prototype.m_bodyC);
box2d.b2GearJoint.prototype.m_bodyD = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_bodyD", box2d.b2GearJoint.prototype.m_bodyD);
box2d.b2GearJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_localAnchorA", box2d.b2GearJoint.prototype.m_localAnchorA);
box2d.b2GearJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_localAnchorB", box2d.b2GearJoint.prototype.m_localAnchorB);
box2d.b2GearJoint.prototype.m_localAnchorC = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_localAnchorC", box2d.b2GearJoint.prototype.m_localAnchorC);
box2d.b2GearJoint.prototype.m_localAnchorD = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_localAnchorD", box2d.b2GearJoint.prototype.m_localAnchorD);
box2d.b2GearJoint.prototype.m_localAxisC = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_localAxisC", box2d.b2GearJoint.prototype.m_localAxisC);
box2d.b2GearJoint.prototype.m_localAxisD = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_localAxisD", box2d.b2GearJoint.prototype.m_localAxisD);
box2d.b2GearJoint.prototype.m_referenceAngleA = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_referenceAngleA", box2d.b2GearJoint.prototype.m_referenceAngleA);
box2d.b2GearJoint.prototype.m_referenceAngleB = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_referenceAngleB", box2d.b2GearJoint.prototype.m_referenceAngleB);
box2d.b2GearJoint.prototype.m_constant = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_constant", box2d.b2GearJoint.prototype.m_constant);
box2d.b2GearJoint.prototype.m_ratio = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_ratio", box2d.b2GearJoint.prototype.m_ratio);
box2d.b2GearJoint.prototype.m_impulse = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_impulse", box2d.b2GearJoint.prototype.m_impulse);
box2d.b2GearJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_indexA", box2d.b2GearJoint.prototype.m_indexA);
box2d.b2GearJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_indexB", box2d.b2GearJoint.prototype.m_indexB);
box2d.b2GearJoint.prototype.m_indexC = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_indexC", box2d.b2GearJoint.prototype.m_indexC);
box2d.b2GearJoint.prototype.m_indexD = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_indexD", box2d.b2GearJoint.prototype.m_indexD);
box2d.b2GearJoint.prototype.m_lcA = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lcA", box2d.b2GearJoint.prototype.m_lcA);
box2d.b2GearJoint.prototype.m_lcB = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lcB", box2d.b2GearJoint.prototype.m_lcB);
box2d.b2GearJoint.prototype.m_lcC = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lcC", box2d.b2GearJoint.prototype.m_lcC);
box2d.b2GearJoint.prototype.m_lcD = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lcD", box2d.b2GearJoint.prototype.m_lcD);
box2d.b2GearJoint.prototype.m_mA = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_mA", box2d.b2GearJoint.prototype.m_mA);
box2d.b2GearJoint.prototype.m_mB = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_mB", box2d.b2GearJoint.prototype.m_mB);
box2d.b2GearJoint.prototype.m_mC = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_mC", box2d.b2GearJoint.prototype.m_mC);
box2d.b2GearJoint.prototype.m_mD = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_mD", box2d.b2GearJoint.prototype.m_mD);
box2d.b2GearJoint.prototype.m_iA = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_iA", box2d.b2GearJoint.prototype.m_iA);
box2d.b2GearJoint.prototype.m_iB = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_iB", box2d.b2GearJoint.prototype.m_iB);
box2d.b2GearJoint.prototype.m_iC = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_iC", box2d.b2GearJoint.prototype.m_iC);
box2d.b2GearJoint.prototype.m_iD = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_iD", box2d.b2GearJoint.prototype.m_iD);
box2d.b2GearJoint.prototype.m_JvAC = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_JvAC", box2d.b2GearJoint.prototype.m_JvAC);
box2d.b2GearJoint.prototype.m_JvBD = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_JvBD", box2d.b2GearJoint.prototype.m_JvBD);
box2d.b2GearJoint.prototype.m_JwA = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_JwA", box2d.b2GearJoint.prototype.m_JwA);
box2d.b2GearJoint.prototype.m_JwB = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_JwB", box2d.b2GearJoint.prototype.m_JwB);
box2d.b2GearJoint.prototype.m_JwC = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_JwC", box2d.b2GearJoint.prototype.m_JwC);
box2d.b2GearJoint.prototype.m_JwD = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_JwD", box2d.b2GearJoint.prototype.m_JwD);
box2d.b2GearJoint.prototype.m_mass = 0;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_mass", box2d.b2GearJoint.prototype.m_mass);
box2d.b2GearJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_qA", box2d.b2GearJoint.prototype.m_qA);
box2d.b2GearJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_qB", box2d.b2GearJoint.prototype.m_qB);
box2d.b2GearJoint.prototype.m_qC = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_qC", box2d.b2GearJoint.prototype.m_qC);
box2d.b2GearJoint.prototype.m_qD = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_qD", box2d.b2GearJoint.prototype.m_qD);
box2d.b2GearJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lalcA", box2d.b2GearJoint.prototype.m_lalcA);
box2d.b2GearJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lalcB", box2d.b2GearJoint.prototype.m_lalcB);
box2d.b2GearJoint.prototype.m_lalcC = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lalcC", box2d.b2GearJoint.prototype.m_lalcC);
box2d.b2GearJoint.prototype.m_lalcD = null;
goog.exportProperty(box2d.b2GearJoint.prototype, "m_lalcD", box2d.b2GearJoint.prototype.m_lalcD);
box2d.b2GearJoint.prototype.InitVelocityConstraints = function (a) {
    this.m_indexA = this.m_bodyA.m_islandIndex;
    this.m_indexB = this.m_bodyB.m_islandIndex;
    this.m_indexC = this.m_bodyC.m_islandIndex;
    this.m_indexD = this.m_bodyD.m_islandIndex;
    this.m_lcA.Copy(this.m_bodyA.m_sweep.localCenter);
    this.m_lcB.Copy(this.m_bodyB.m_sweep.localCenter);
    this.m_lcC.Copy(this.m_bodyC.m_sweep.localCenter);
    this.m_lcD.Copy(this.m_bodyD.m_sweep.localCenter);
    this.m_mA = this.m_bodyA.m_invMass;
    this.m_mB = this.m_bodyB.m_invMass;
    this.m_mC =
        this.m_bodyC.m_invMass;
    this.m_mD = this.m_bodyD.m_invMass;
    this.m_iA = this.m_bodyA.m_invI;
    this.m_iB = this.m_bodyB.m_invI;
    this.m_iC = this.m_bodyC.m_invI;
    this.m_iD = this.m_bodyD.m_invI;
    var b = a.velocities[this.m_indexA].v,
        c = a.velocities[this.m_indexA].w,
        e = a.positions[this.m_indexB].a,
        d = a.velocities[this.m_indexB].v,
        f = a.velocities[this.m_indexB].w,
        g = a.positions[this.m_indexC].a,
        h = a.velocities[this.m_indexC].v,
        l = a.velocities[this.m_indexC].w,
        k = a.positions[this.m_indexD].a,
        m = a.velocities[this.m_indexD].v,
        n = a.velocities[this.m_indexD].w,
        p = this.m_qA.SetAngleRadians(a.positions[this.m_indexA].a),
        e = this.m_qB.SetAngleRadians(e),
        q = this.m_qC.SetAngleRadians(g),
        g = this.m_qD.SetAngleRadians(k);
    this.m_mass = 0;
    this.m_typeA === box2d.b2JointType.e_revoluteJoint ? (this.m_JvAC.SetZero(), this.m_JwC = this.m_JwA = 1, this.m_mass += this.m_iA + this.m_iC) : (k = box2d.b2MulRV(q, this.m_localAxisC, box2d.b2GearJoint.prototype.InitVelocityConstraints.s_u), box2d.b2SubVV(this.m_localAnchorC, this.m_lcC, this.m_lalcC), q = box2d.b2MulRV(q, this.m_lalcC, box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rC),
        box2d.b2SubVV(this.m_localAnchorA, this.m_lcA, this.m_lalcA), p = box2d.b2MulRV(p, this.m_lalcA, box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rA), this.m_JvAC.Copy(k), this.m_JwC = box2d.b2CrossVV(q, k), this.m_JwA = box2d.b2CrossVV(p, k), this.m_mass += this.m_mC + this.m_mA + this.m_iC * this.m_JwC * this.m_JwC + this.m_iA * this.m_JwA * this.m_JwA);
    this.m_typeB === box2d.b2JointType.e_revoluteJoint ? (this.m_JvBD.SetZero(), this.m_JwD = this.m_JwB = this.m_ratio, this.m_mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD)) : (k =
        box2d.b2MulRV(g, this.m_localAxisD, box2d.b2GearJoint.prototype.InitVelocityConstraints.s_u), box2d.b2SubVV(this.m_localAnchorD, this.m_lcD, this.m_lalcD), p = box2d.b2MulRV(g, this.m_lalcD, box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rD), box2d.b2SubVV(this.m_localAnchorB, this.m_lcB, this.m_lalcB), e = box2d.b2MulRV(e, this.m_lalcB, box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rB), box2d.b2MulSV(this.m_ratio, k, this.m_JvBD), this.m_JwD = this.m_ratio * box2d.b2CrossVV(p, k), this.m_JwB = this.m_ratio * box2d.b2CrossVV(e,
            k), this.m_mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * this.m_JwD * this.m_JwD + this.m_iB * this.m_JwB * this.m_JwB);
    this.m_mass = 0 < this.m_mass ? 1 / this.m_mass : 0;
    a.step.warmStarting ? (b.SelfMulAdd(this.m_mA * this.m_impulse, this.m_JvAC), c += this.m_iA * this.m_impulse * this.m_JwA, d.SelfMulAdd(this.m_mB * this.m_impulse, this.m_JvBD), f += this.m_iB * this.m_impulse * this.m_JwB, h.SelfMulSub(this.m_mC * this.m_impulse, this.m_JvAC), l -= this.m_iC * this.m_impulse * this.m_JwC, m.SelfMulSub(this.m_mD * this.m_impulse, this.m_JvBD),
        n -= this.m_iD * this.m_impulse * this.m_JwD) : this.m_impulse = 0;
    a.velocities[this.m_indexA].w = c;
    a.velocities[this.m_indexB].w = f;
    a.velocities[this.m_indexC].w = l;
    a.velocities[this.m_indexD].w = n
};
box2d.b2GearJoint.prototype.InitVelocityConstraints.s_u = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rA = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rB = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rC = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.InitVelocityConstraints.s_rD = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.SolveVelocityConstraints = function (a) {
    var b = a.velocities[this.m_indexA].v,
        c = a.velocities[this.m_indexA].w,
        e = a.velocities[this.m_indexB].v,
        d = a.velocities[this.m_indexB].w,
        f = a.velocities[this.m_indexC].v,
        g = a.velocities[this.m_indexC].w,
        h = a.velocities[this.m_indexD].v,
        l = a.velocities[this.m_indexD].w,
        k = box2d.b2DotVV(this.m_JvAC, box2d.b2SubVV(b, f, box2d.b2Vec2.s_t0)) + box2d.b2DotVV(this.m_JvBD, box2d.b2SubVV(e, h, box2d.b2Vec2.s_t0)),
        k = k + (this.m_JwA * c - this.m_JwC * g + (this.m_JwB * d - this.m_JwD *
            l)),
        k = -this.m_mass * k;
    this.m_impulse += k;
    b.SelfMulAdd(this.m_mA * k, this.m_JvAC);
    c += this.m_iA * k * this.m_JwA;
    e.SelfMulAdd(this.m_mB * k, this.m_JvBD);
    d += this.m_iB * k * this.m_JwB;
    f.SelfMulSub(this.m_mC * k, this.m_JvAC);
    g -= this.m_iC * k * this.m_JwC;
    h.SelfMulSub(this.m_mD * k, this.m_JvBD);
    l -= this.m_iD * k * this.m_JwD;
    a.velocities[this.m_indexA].w = c;
    a.velocities[this.m_indexB].w = d;
    a.velocities[this.m_indexC].w = g;
    a.velocities[this.m_indexD].w = l
};
box2d.b2GearJoint.prototype.SolvePositionConstraints = function (a) {
    var b = a.positions[this.m_indexA].c,
        c = a.positions[this.m_indexA].a,
        e = a.positions[this.m_indexB].c,
        d = a.positions[this.m_indexB].a,
        f = a.positions[this.m_indexC].c,
        g = a.positions[this.m_indexC].a,
        h = a.positions[this.m_indexD].c,
        l = a.positions[this.m_indexD].a,
        k = this.m_qA.SetAngleRadians(c),
        m = this.m_qB.SetAngleRadians(d),
        n = this.m_qC.SetAngleRadians(g),
        p = this.m_qD.SetAngleRadians(l),
        q = this.m_JvAC,
        r = this.m_JvBD,
        t, s, u = 0;
    if (this.m_typeA === box2d.b2JointType.e_revoluteJoint) q.SetZero(),
    k = t = 1, u += this.m_iA + this.m_iC, n = c - g - this.m_referenceAngleA;
    else {
        s = box2d.b2MulRV(n, this.m_localAxisC, box2d.b2GearJoint.prototype.SolvePositionConstraints.s_u);
        t = box2d.b2MulRV(n, this.m_lalcC, box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rC);
        var v = box2d.b2MulRV(k, this.m_lalcA, box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rA);
        q.Copy(s);
        k = box2d.b2CrossVV(t, s);
        t = box2d.b2CrossVV(v, s);
        u += this.m_mC + this.m_mA + this.m_iC * k * k + this.m_iA * t * t;
        s = this.m_lalcC;
        n = box2d.b2MulTRV(n, box2d.b2AddVV(v, box2d.b2SubVV(b,
            f, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0);
        n = box2d.b2DotVV(box2d.b2SubVV(n, s, box2d.b2Vec2.s_t0), this.m_localAxisC)
    } if (this.m_typeB === box2d.b2JointType.e_revoluteJoint) r.SetZero(), m = s = this.m_ratio, u += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD), p = d - l - this.m_referenceAngleB;
    else {
        s = box2d.b2MulRV(p, this.m_localAxisD, box2d.b2GearJoint.prototype.SolvePositionConstraints.s_u);
        var y = box2d.b2MulRV(p, this.m_lalcD, box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rD),
            v = box2d.b2MulRV(m,
                this.m_lalcB, box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rB);
        box2d.b2MulSV(this.m_ratio, s, r);
        m = this.m_ratio * box2d.b2CrossVV(y, s);
        s = this.m_ratio * box2d.b2CrossVV(v, s);
        u += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * m * m + this.m_iB * s * s;
        y = this.m_lalcD;
        p = box2d.b2MulTRV(p, box2d.b2AddVV(v, box2d.b2SubVV(e, h, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0);
        p = box2d.b2DotVV(box2d.b2SubVV(p, y, box2d.b2Vec2.s_t0), this.m_localAxisD)
    }
    p = n + this.m_ratio * p - this.m_constant;
    n = 0;
    0 < u && (n = -p /
        u);
    b.SelfMulAdd(this.m_mA * n, q);
    c += this.m_iA * n * t;
    e.SelfMulAdd(this.m_mB * n, r);
    d += this.m_iB * n * s;
    f.SelfMulSub(this.m_mC * n, q);
    g -= this.m_iC * n * k;
    h.SelfMulSub(this.m_mD * n, r);
    l -= this.m_iD * n * m;
    a.positions[this.m_indexA].a = c;
    a.positions[this.m_indexB].a = d;
    a.positions[this.m_indexC].a = g;
    a.positions[this.m_indexD].a = l;
    return 0 < box2d.b2_linearSlop
};
goog.exportProperty(box2d.b2GearJoint.prototype, "SolvePositionConstraints", box2d.b2GearJoint.prototype.SolvePositionConstraints);
box2d.b2GearJoint.prototype.SolvePositionConstraints.s_u = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rA = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rB = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rC = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.SolvePositionConstraints.s_rD = new box2d.b2Vec2;
box2d.b2GearJoint.prototype.GetAnchorA = function (a) {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2GearJoint.prototype, "GetAnchorA", box2d.b2GearJoint.prototype.GetAnchorA);
box2d.b2GearJoint.prototype.GetAnchorB = function (a) {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2GearJoint.prototype, "GetAnchorB", box2d.b2GearJoint.prototype.GetAnchorB);
box2d.b2GearJoint.prototype.GetReactionForce = function (a, b) {
    return box2d.b2MulSV(a * this.m_impulse, this.m_JvAC, b)
};
goog.exportProperty(box2d.b2GearJoint.prototype, "GetReactionForce", box2d.b2GearJoint.prototype.GetReactionForce);
box2d.b2GearJoint.prototype.GetReactionTorque = function (a) {
    return a * this.m_impulse * this.m_JwA
};
goog.exportProperty(box2d.b2GearJoint.prototype, "GetReactionTorque", box2d.b2GearJoint.prototype.GetReactionTorque);
box2d.b2GearJoint.prototype.GetJoint1 = function () {
    return this.m_joint1
};
goog.exportProperty(box2d.b2GearJoint.prototype, "GetJoint1", box2d.b2GearJoint.prototype.GetJoint1);
box2d.b2GearJoint.prototype.GetJoint2 = function () {
    return this.m_joint2
};
goog.exportProperty(box2d.b2GearJoint.prototype, "GetJoint2", box2d.b2GearJoint.prototype.GetJoint2);
box2d.b2GearJoint.prototype.GetRatio = function () {
    return this.m_ratio
};
goog.exportProperty(box2d.b2GearJoint.prototype, "GetRatio", box2d.b2GearJoint.prototype.GetRatio);
box2d.b2GearJoint.prototype.SetRatio = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a));
    this.m_ratio = a
};
goog.exportProperty(box2d.b2GearJoint.prototype, "SetRatio", box2d.b2GearJoint.prototype.SetRatio);
box2d.b2GearJoint.prototype.Dump = function () {
    if (box2d.DEBUG) {
        var a = this.m_bodyA.m_islandIndex,
            b = this.m_bodyB.m_islandIndex,
            c = this.m_joint1.m_index,
            e = this.m_joint2.m_index;
        box2d.b2Log("  /*box2d.b2GearJointDef*/ var jd = new box2d.b2GearJointDef();\n");
        box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
        box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
        box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
        box2d.b2Log("  jd.joint1 = joints[%d];\n", c);
        box2d.b2Log("  jd.joint2 = joints[%d];\n",
            e);
        box2d.b2Log("  jd.ratio = %.15f;\n", this.m_ratio);
        box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
    }
};
goog.exportProperty(box2d.b2GearJoint.prototype, "Dump", box2d.b2GearJoint.prototype.Dump);
box2d.b2DistanceProxy = function () {
    this.m_buffer = box2d.b2Vec2.MakeArray(2)
};
goog.exportSymbol("box2d.b2DistanceProxy", box2d.b2DistanceProxy);
box2d.b2DistanceProxy.prototype.m_buffer = null;
goog.exportProperty(box2d.b2DistanceProxy.prototype, "m_buffer", box2d.b2DistanceProxy.prototype.m_buffer);
box2d.b2DistanceProxy.prototype.m_vertices = null;
goog.exportProperty(box2d.b2DistanceProxy.prototype, "m_vertices", box2d.b2DistanceProxy.prototype.m_vertices);
box2d.b2DistanceProxy.prototype.m_count = 0;
goog.exportProperty(box2d.b2DistanceProxy.prototype, "m_count", box2d.b2DistanceProxy.prototype.m_count);
box2d.b2DistanceProxy.prototype.m_radius = 0;
goog.exportProperty(box2d.b2DistanceProxy.prototype, "m_radius", box2d.b2DistanceProxy.prototype.m_radius);
box2d.b2DistanceProxy.prototype.Reset = function () {
    this.m_vertices = null;
    this.m_radius = this.m_count = 0;
    return this
};
goog.exportProperty(box2d.b2DistanceProxy.prototype, "Reset", box2d.b2DistanceProxy.prototype.Reset);
box2d.b2DistanceProxy.prototype.SetShape = function (a, b) {
    a.SetupDistanceProxy(this, b)
};
goog.exportProperty(box2d.b2DistanceProxy.prototype, "SetShape", box2d.b2DistanceProxy.prototype.SetShape);
box2d.b2DistanceProxy.prototype.GetSupport = function (a) {
    for (var b = 0, c = box2d.b2DotVV(this.m_vertices[0], a), e = 1; e < this.m_count; ++e) {
        var d = box2d.b2DotVV(this.m_vertices[e], a);
        d > c && (b = e, c = d)
    }
    return b
};
goog.exportProperty(box2d.b2DistanceProxy.prototype, "GetSupport", box2d.b2DistanceProxy.prototype.GetSupport);
box2d.b2DistanceProxy.prototype.GetSupportVertex = function (a, b) {
    for (var c = 0, e = box2d.b2DotVV(this.m_vertices[0], a), d = 1; d < this.m_count; ++d) {
        var f = box2d.b2DotVV(this.m_vertices[d], a);
        f > e && (c = d, e = f)
    }
    return b.Copy(this.m_vertices[c])
};
goog.exportProperty(box2d.b2DistanceProxy.prototype, "GetSupportVertex", box2d.b2DistanceProxy.prototype.GetSupportVertex);
box2d.b2DistanceProxy.prototype.GetVertexCount = function () {
    return this.m_count
};
goog.exportProperty(box2d.b2DistanceProxy.prototype, "GetVertexCount", box2d.b2DistanceProxy.prototype.GetVertexCount);
box2d.b2DistanceProxy.prototype.GetVertex = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= a && a < this.m_count);
    return this.m_vertices[a]
};
goog.exportProperty(box2d.b2DistanceProxy.prototype, "GetVertex", box2d.b2DistanceProxy.prototype.GetVertex);
box2d.b2SimplexCache = function () {
    this.indexA = box2d.b2MakeNumberArray(3);
    this.indexB = box2d.b2MakeNumberArray(3)
};
goog.exportSymbol("box2d.b2SimplexCache", box2d.b2SimplexCache);
box2d.b2SimplexCache.prototype.metric = 0;
goog.exportProperty(box2d.b2SimplexCache.prototype, "metric", box2d.b2SimplexCache.prototype.metric);
box2d.b2SimplexCache.prototype.count = 0;
goog.exportProperty(box2d.b2SimplexCache.prototype, "count", box2d.b2SimplexCache.prototype.count);
box2d.b2SimplexCache.prototype.indexA = null;
goog.exportProperty(box2d.b2SimplexCache.prototype, "indexA", box2d.b2SimplexCache.prototype.indexA);
box2d.b2SimplexCache.prototype.indexB = null;
goog.exportProperty(box2d.b2SimplexCache.prototype, "indexB", box2d.b2SimplexCache.prototype.indexB);
box2d.b2SimplexCache.prototype.Reset = function () {
    this.count = this.metric = 0;
    return this
};
goog.exportProperty(box2d.b2SimplexCache.prototype, "Reset", box2d.b2SimplexCache.prototype.Reset);
box2d.b2DistanceInput = function () {
    this.proxyA = new box2d.b2DistanceProxy;
    this.proxyB = new box2d.b2DistanceProxy;
    this.transformA = new box2d.b2Transform;
    this.transformB = new box2d.b2Transform
};
goog.exportSymbol("box2d.b2DistanceInput", box2d.b2DistanceInput);
box2d.b2DistanceInput.prototype.proxyA = null;
goog.exportProperty(box2d.b2DistanceInput.prototype, "proxyA", box2d.b2DistanceInput.prototype.proxyA);
box2d.b2DistanceInput.prototype.proxyB = null;
goog.exportProperty(box2d.b2DistanceInput.prototype, "proxyB", box2d.b2DistanceInput.prototype.proxyB);
box2d.b2DistanceInput.prototype.transformA = null;
goog.exportProperty(box2d.b2DistanceInput.prototype, "transformA", box2d.b2DistanceInput.prototype.transformA);
box2d.b2DistanceInput.prototype.transformB = null;
goog.exportProperty(box2d.b2DistanceInput.prototype, "transformB", box2d.b2DistanceInput.prototype.transformB);
box2d.b2DistanceInput.prototype.useRadii = !1;
goog.exportProperty(box2d.b2DistanceInput.prototype, "useRadii", box2d.b2DistanceInput.prototype.useRadii);
box2d.b2DistanceInput.prototype.Reset = function () {
    this.proxyA.Reset();
    this.proxyB.Reset();
    this.transformA.SetIdentity();
    this.transformB.SetIdentity();
    this.useRadii = !1;
    return this
};
goog.exportProperty(box2d.b2DistanceInput.prototype, "Reset", box2d.b2DistanceInput.prototype.Reset);
box2d.b2DistanceOutput = function () {
    this.pointA = new box2d.b2Vec2;
    this.pointB = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2DistanceOutput", box2d.b2DistanceOutput);
box2d.b2DistanceOutput.prototype.pointA = null;
goog.exportProperty(box2d.b2DistanceOutput.prototype, "pointA", box2d.b2DistanceOutput.prototype.pointA);
box2d.b2DistanceOutput.prototype.pointB = null;
goog.exportProperty(box2d.b2DistanceOutput.prototype, "pointB", box2d.b2DistanceOutput.prototype.pointB);
box2d.b2DistanceOutput.prototype.distance = 0;
goog.exportProperty(box2d.b2DistanceOutput.prototype, "distance", box2d.b2DistanceOutput.prototype.distance);
box2d.b2DistanceOutput.prototype.iterations = 0;
goog.exportProperty(box2d.b2DistanceOutput.prototype, "iterations", box2d.b2DistanceOutput.prototype.iterations);
box2d.b2DistanceOutput.prototype.Reset = function () {
    this.pointA.SetZero();
    this.pointB.SetZero();
    this.iterations = this.distance = 0;
    return this
};
goog.exportProperty(box2d.b2DistanceOutput.prototype, "Reset", box2d.b2DistanceOutput.prototype.Reset);
box2d.b2_gjkCalls = 0;
goog.exportSymbol("box2d.b2_gjkCalls", box2d.b2_gjkCalls);
box2d.b2_gjkIters = 0;
goog.exportSymbol("box2d.b2_gjkIters", box2d.b2_gjkIters);
box2d.b2_gjkMaxIters = 0;
goog.exportSymbol("box2d.b2_gjkMaxIters", box2d.b2_gjkMaxIters);
box2d.b2SimplexVertex = function () {
    this.wA = new box2d.b2Vec2;
    this.wB = new box2d.b2Vec2;
    this.w = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2SimplexVertex", box2d.b2SimplexVertex);
box2d.b2SimplexVertex.prototype.wA = null;
goog.exportProperty(box2d.b2SimplexVertex.prototype, "wA", box2d.b2SimplexVertex.prototype.wA);
box2d.b2SimplexVertex.prototype.wB = null;
goog.exportProperty(box2d.b2SimplexVertex.prototype, "wB", box2d.b2SimplexVertex.prototype.wB);
box2d.b2SimplexVertex.prototype.w = null;
goog.exportProperty(box2d.b2SimplexVertex.prototype, "w", box2d.b2SimplexVertex.prototype.w);
box2d.b2SimplexVertex.prototype.a = 0;
goog.exportProperty(box2d.b2SimplexVertex.prototype, "a", box2d.b2SimplexVertex.prototype.a);
box2d.b2SimplexVertex.prototype.indexA = 0;
goog.exportProperty(box2d.b2SimplexVertex.prototype, "indexA", box2d.b2SimplexVertex.prototype.indexA);
box2d.b2SimplexVertex.prototype.indexB = 0;
goog.exportProperty(box2d.b2SimplexVertex.prototype, "indexB", box2d.b2SimplexVertex.prototype.indexB);
box2d.b2SimplexVertex.prototype.Copy = function (a) {
    this.wA.Copy(a.wA);
    this.wB.Copy(a.wB);
    this.w.Copy(a.w);
    this.a = a.a;
    this.indexA = a.indexA;
    this.indexB = a.indexB;
    return this
};
goog.exportProperty(box2d.b2SimplexVertex.prototype, "Copy", box2d.b2SimplexVertex.prototype.Copy);
box2d.b2Simplex = function () {
    this.m_v1 = new box2d.b2SimplexVertex;
    this.m_v2 = new box2d.b2SimplexVertex;
    this.m_v3 = new box2d.b2SimplexVertex;
    this.m_vertices = Array(3);
    this.m_vertices[0] = this.m_v1;
    this.m_vertices[1] = this.m_v2;
    this.m_vertices[2] = this.m_v3
};
goog.exportSymbol("box2d.b2Simplex", box2d.b2Simplex);
box2d.b2Simplex.prototype.m_v1 = null;
goog.exportProperty(box2d.b2Simplex.prototype, "m_v1", box2d.b2Simplex.prototype.m_v1);
box2d.b2Simplex.prototype.m_v2 = null;
goog.exportProperty(box2d.b2Simplex.prototype, "m_v2", box2d.b2Simplex.prototype.m_v2);
box2d.b2Simplex.prototype.m_v3 = null;
goog.exportProperty(box2d.b2Simplex.prototype, "m_v3", box2d.b2Simplex.prototype.m_v3);
box2d.b2Simplex.prototype.m_vertices = null;
goog.exportProperty(box2d.b2Simplex.prototype, "m_vertices", box2d.b2Simplex.prototype.m_vertices);
box2d.b2Simplex.prototype.m_count = 0;
goog.exportProperty(box2d.b2Simplex.prototype, "m_count", box2d.b2Simplex.prototype.m_count);
box2d.b2Simplex.prototype.ReadCache = function (a, b, c, e, d) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= a.count && 3 >= a.count);
    this.m_count = a.count;
    for (var f = this.m_vertices, g = 0; g < this.m_count; ++g) {
        var h = f[g];
        h.indexA = a.indexA[g];
        h.indexB = a.indexB[g];
        var l = b.GetVertex(h.indexA),
            k = e.GetVertex(h.indexB);
        box2d.b2MulXV(c, l, h.wA);
        box2d.b2MulXV(d, k, h.wB);
        box2d.b2SubVV(h.wB, h.wA, h.w);
        h.a = 0
    }
    1 < this.m_count && (a = a.metric, g = this.GetMetric(), g < 0.5 * a || 2 * a < g || g < box2d.b2_epsilon) && (this.m_count = 0);
    0 === this.m_count && (h = f[0],
        h.indexA = 0, h.indexB = 0, l = b.GetVertex(0), k = e.GetVertex(0), box2d.b2MulXV(c, l, h.wA), box2d.b2MulXV(d, k, h.wB), box2d.b2SubVV(h.wB, h.wA, h.w), this.m_count = h.a = 1)
};
goog.exportProperty(box2d.b2Simplex.prototype, "ReadCache", box2d.b2Simplex.prototype.ReadCache);
box2d.b2Simplex.prototype.WriteCache = function (a) {
    a.metric = this.GetMetric();
    a.count = this.m_count;
    for (var b = this.m_vertices, c = 0; c < this.m_count; ++c) a.indexA[c] = b[c].indexA, a.indexB[c] = b[c].indexB
};
goog.exportProperty(box2d.b2Simplex.prototype, "WriteCache", box2d.b2Simplex.prototype.WriteCache);
box2d.b2Simplex.prototype.GetSearchDirection = function (a) {
    switch (this.m_count) {
    case 1:
        return box2d.b2NegV(this.m_v1.w, a);
    case 2:
        var b = box2d.b2SubVV(this.m_v2.w, this.m_v1.w, a);
        return 0 < box2d.b2CrossVV(b, box2d.b2NegV(this.m_v1.w, box2d.b2Vec2.s_t0)) ? box2d.b2CrossOneV(b, a) : box2d.b2CrossVOne(b, a);
    default:
        return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), a.SetZero()
    }
};
goog.exportProperty(box2d.b2Simplex.prototype, "GetSearchDirection", box2d.b2Simplex.prototype.GetSearchDirection);
box2d.b2Simplex.prototype.GetClosestPoint = function (a) {
    switch (this.m_count) {
    case 0:
        return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), a.SetZero();
    case 1:
        return a.Copy(this.m_v1.w);
    case 2:
        return a.SetXY(this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x, this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y);
    case 3:
        return a.SetZero();
    default:
        return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), a.SetZero()
    }
};
goog.exportProperty(box2d.b2Simplex.prototype, "GetClosestPoint", box2d.b2Simplex.prototype.GetClosestPoint);
box2d.b2Simplex.prototype.GetWitnessPoints = function (a, b) {
    switch (this.m_count) {
    case 0:
        box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
        break;
    case 1:
        a.Copy(this.m_v1.wA);
        b.Copy(this.m_v1.wB);
        break;
    case 2:
        a.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x;
        a.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y;
        b.x = this.m_v1.a * this.m_v1.wB.x + this.m_v2.a * this.m_v2.wB.x;
        b.y = this.m_v1.a * this.m_v1.wB.y + this.m_v2.a * this.m_v2.wB.y;
        break;
    case 3:
        b.x = a.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x +
            this.m_v3.a * this.m_v3.wA.x;
        b.y = a.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y + this.m_v3.a * this.m_v3.wA.y;
        break;
    default:
        box2d.ENABLE_ASSERTS && box2d.b2Assert(!1)
    }
};
goog.exportProperty(box2d.b2Simplex.prototype, "GetWitnessPoints", box2d.b2Simplex.prototype.GetWitnessPoints);
box2d.b2Simplex.prototype.GetMetric = function () {
    switch (this.m_count) {
    case 0:
        return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), 0;
    case 1:
        return 0;
    case 2:
        return box2d.b2DistanceVV(this.m_v1.w, this.m_v2.w);
    case 3:
        return box2d.b2CrossVV(box2d.b2SubVV(this.m_v2.w, this.m_v1.w, box2d.b2Vec2.s_t0), box2d.b2SubVV(this.m_v3.w, this.m_v1.w, box2d.b2Vec2.s_t1));
    default:
        return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), 0
    }
};
goog.exportProperty(box2d.b2Simplex.prototype, "GetMetric", box2d.b2Simplex.prototype.GetMetric);
box2d.b2Simplex.prototype.Solve2 = function () {
    var a = this.m_v1.w,
        b = this.m_v2.w,
        c = box2d.b2SubVV(b, a, box2d.b2Simplex.s_e12),
        a = -box2d.b2DotVV(a, c);
    0 >= a ? this.m_count = this.m_v1.a = 1 : (b = box2d.b2DotVV(b, c), 0 >= b ? (this.m_count = this.m_v2.a = 1, this.m_v1.Copy(this.m_v2)) : (c = 1 / (b + a), this.m_v1.a = b * c, this.m_v2.a = a * c, this.m_count = 2))
};
goog.exportProperty(box2d.b2Simplex.prototype, "Solve2", box2d.b2Simplex.prototype.Solve2);
box2d.b2Simplex.prototype.Solve3 = function () {
    var a = this.m_v1.w,
        b = this.m_v2.w,
        c = this.m_v3.w,
        e = box2d.b2SubVV(b, a, box2d.b2Simplex.s_e12),
        d = box2d.b2DotVV(a, e),
        f = box2d.b2DotVV(b, e),
        d = -d,
        g = box2d.b2SubVV(c, a, box2d.b2Simplex.s_e13),
        h = box2d.b2DotVV(a, g),
        l = box2d.b2DotVV(c, g),
        h = -h,
        k = box2d.b2SubVV(c, b, box2d.b2Simplex.s_e23),
        m = box2d.b2DotVV(b, k),
        k = box2d.b2DotVV(c, k),
        m = -m,
        g = box2d.b2CrossVV(e, g),
        e = g * box2d.b2CrossVV(b, c),
        c = g * box2d.b2CrossVV(c, a),
        a = g * box2d.b2CrossVV(a, b);
    0 >= d && 0 >= h ? this.m_count = this.m_v1.a = 1 : 0 < f &&
        0 < d && 0 >= a ? (l = 1 / (f + d), this.m_v1.a = f * l, this.m_v2.a = d * l, this.m_count = 2) : 0 < l && 0 < h && 0 >= c ? (f = 1 / (l + h), this.m_v1.a = l * f, this.m_v3.a = h * f, this.m_count = 2, this.m_v2.Copy(this.m_v3)) : 0 >= f && 0 >= m ? (this.m_count = this.m_v2.a = 1, this.m_v1.Copy(this.m_v2)) : 0 >= l && 0 >= k ? (this.m_count = this.m_v3.a = 1, this.m_v1.Copy(this.m_v3)) : 0 < k && 0 < m && 0 >= e ? (f = 1 / (k + m), this.m_v2.a = k * f, this.m_v3.a = m * f, this.m_count = 2, this.m_v1.Copy(this.m_v3)) : (f = 1 / (e + c + a), this.m_v1.a = e * f, this.m_v2.a = c * f, this.m_v3.a = a * f, this.m_count = 3)
};
goog.exportProperty(box2d.b2Simplex.prototype, "Solve3", box2d.b2Simplex.prototype.Solve3);
box2d.b2Simplex.s_e12 = new box2d.b2Vec2;
box2d.b2Simplex.s_e13 = new box2d.b2Vec2;
box2d.b2Simplex.s_e23 = new box2d.b2Vec2;
box2d.b2Distance = function (a, b, c) {
    ++box2d.b2_gjkCalls;
    var e = c.proxyA,
        d = c.proxyB,
        f = c.transformA,
        g = c.transformB,
        h = box2d.b2Distance.s_simplex;
    h.ReadCache(b, e, f, d, g);
    for (var l = h.m_vertices, k = box2d.b2Distance.s_saveA, m = box2d.b2Distance.s_saveB, n = 0, p = 0; 20 > p;) {
        for (var n = h.m_count, q = 0; q < n; ++q) k[q] = l[q].indexA, m[q] = l[q].indexB;
        switch (h.m_count) {
        case 1:
            break;
        case 2:
            h.Solve2();
            break;
        case 3:
            h.Solve3();
            break;
        default:
            box2d.ENABLE_ASSERTS && box2d.b2Assert(!1)
        }
        if (3 === h.m_count) break;
        var r = h.GetClosestPoint(box2d.b2Distance.s_p);
        r.GetLengthSquared();
        q = h.GetSearchDirection(box2d.b2Distance.s_d);
        if (q.GetLengthSquared() < box2d.b2_epsilon_sq) break;
        r = l[h.m_count];
        r.indexA = e.GetSupport(box2d.b2MulTRV(f.q, box2d.b2NegV(q, box2d.b2Vec2.s_t0), box2d.b2Distance.s_supportA));
        box2d.b2MulXV(f, e.GetVertex(r.indexA), r.wA);
        r.indexB = d.GetSupport(box2d.b2MulTRV(g.q, q, box2d.b2Distance.s_supportB));
        box2d.b2MulXV(g, d.GetVertex(r.indexB), r.wB);
        box2d.b2SubVV(r.wB, r.wA, r.w);
        ++p;
        ++box2d.b2_gjkIters;
        for (var t = !1, q = 0; q < n; ++q)
            if (r.indexA === k[q] && r.indexB ===
                m[q]) {
                t = !0;
                break
            }
        if (t) break;
        ++h.m_count
    }
    box2d.b2_gjkMaxIters = box2d.b2Max(box2d.b2_gjkMaxIters, p);
    h.GetWitnessPoints(a.pointA, a.pointB);
    a.distance = box2d.b2DistanceVV(a.pointA, a.pointB);
    a.iterations = p;
    h.WriteCache(b);
    c.useRadii && (b = e.m_radius, d = d.m_radius, a.distance > b + d && a.distance > box2d.b2_epsilon ? (a.distance -= b + d, c = box2d.b2SubVV(a.pointB, a.pointA, box2d.b2Distance.s_normal), c.Normalize(), a.pointA.SelfMulAdd(b, c), a.pointB.SelfMulSub(d, c)) : (r = box2d.b2MidVV(a.pointA, a.pointB, box2d.b2Distance.s_p), a.pointA.Copy(r),
        a.pointB.Copy(r), a.distance = 0))
};
goog.exportSymbol("box2d.b2Distance", box2d.b2Distance);
box2d.b2Distance.s_simplex = new box2d.b2Simplex;
box2d.b2Distance.s_saveA = box2d.b2MakeNumberArray(3);
box2d.b2Distance.s_saveB = box2d.b2MakeNumberArray(3);
box2d.b2Distance.s_p = new box2d.b2Vec2;
box2d.b2Distance.s_d = new box2d.b2Vec2;
box2d.b2Distance.s_normal = new box2d.b2Vec2;
box2d.b2Distance.s_supportA = new box2d.b2Vec2;
box2d.b2Distance.s_supportB = new box2d.b2Vec2;
box2d.b2WeldJointDef = function () {
    box2d.b2JointDef.call(this, box2d.b2JointType.e_weldJoint);
    this.localAnchorA = new box2d.b2Vec2;
    this.localAnchorB = new box2d.b2Vec2
};
goog.inherits(box2d.b2WeldJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2WeldJointDef", box2d.b2WeldJointDef);
box2d.b2WeldJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2WeldJointDef.prototype, "localAnchorA", box2d.b2WeldJointDef.prototype.localAnchorA);
box2d.b2WeldJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2WeldJointDef.prototype, "localAnchorB", box2d.b2WeldJointDef.prototype.localAnchorB);
box2d.b2WeldJointDef.prototype.referenceAngle = 0;
goog.exportProperty(box2d.b2WeldJointDef.prototype, "referenceAngle", box2d.b2WeldJointDef.prototype.referenceAngle);
box2d.b2WeldJointDef.prototype.frequencyHz = 0;
goog.exportProperty(box2d.b2WeldJointDef.prototype, "frequencyHz", box2d.b2WeldJointDef.prototype.frequencyHz);
box2d.b2WeldJointDef.prototype.dampingRatio = 0;
goog.exportProperty(box2d.b2WeldJointDef.prototype, "dampingRatio", box2d.b2WeldJointDef.prototype.dampingRatio);
box2d.b2WeldJointDef.prototype.Initialize = function (a, b, c) {
    this.bodyA = a;
    this.bodyB = b;
    this.bodyA.GetLocalPoint(c, this.localAnchorA);
    this.bodyB.GetLocalPoint(c, this.localAnchorB);
    this.referenceAngle = this.bodyB.GetAngleRadians() - this.bodyA.GetAngleRadians()
};
goog.exportProperty(box2d.b2WeldJointDef.prototype, "Initialize", box2d.b2WeldJointDef.prototype.Initialize);
box2d.b2WeldJoint = function (a) {
    box2d.b2Joint.call(this, a);
    this.m_frequencyHz = a.frequencyHz;
    this.m_dampingRatio = a.dampingRatio;
    this.m_localAnchorA = a.localAnchorA.Clone();
    this.m_localAnchorB = a.localAnchorB.Clone();
    this.m_referenceAngle = a.referenceAngle;
    this.m_impulse = new box2d.b2Vec3(0, 0, 0);
    this.m_rA = new box2d.b2Vec2;
    this.m_rB = new box2d.b2Vec2;
    this.m_localCenterA = new box2d.b2Vec2;
    this.m_localCenterB = new box2d.b2Vec2;
    this.m_mass = new box2d.b2Mat33;
    this.m_qA = new box2d.b2Rot;
    this.m_qB = new box2d.b2Rot;
    this.m_lalcA =
        new box2d.b2Vec2;
    this.m_lalcB = new box2d.b2Vec2;
    this.m_K = new box2d.b2Mat33
};
goog.inherits(box2d.b2WeldJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2WeldJoint", box2d.b2WeldJoint);
box2d.b2WeldJoint.prototype.m_frequencyHz = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_frequencyHz", box2d.b2WeldJoint.prototype.m_frequencyHz);
box2d.b2WeldJoint.prototype.m_dampingRatio = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_dampingRatio", box2d.b2WeldJoint.prototype.m_dampingRatio);
box2d.b2WeldJoint.prototype.m_bias = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_bias", box2d.b2WeldJoint.prototype.m_bias);
box2d.b2WeldJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_localAnchorA", box2d.b2WeldJoint.prototype.m_localAnchorA);
box2d.b2WeldJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_localAnchorB", box2d.b2WeldJoint.prototype.m_localAnchorB);
box2d.b2WeldJoint.prototype.m_referenceAngle = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_referenceAngle", box2d.b2WeldJoint.prototype.m_referenceAngle);
box2d.b2WeldJoint.prototype.m_gamma = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_gamma", box2d.b2WeldJoint.prototype.m_gamma);
box2d.b2WeldJoint.prototype.m_impulse = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_impulse", box2d.b2WeldJoint.prototype.m_impulse);
box2d.b2WeldJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_indexA", box2d.b2WeldJoint.prototype.m_indexA);
box2d.b2WeldJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_indexB", box2d.b2WeldJoint.prototype.m_indexB);
box2d.b2WeldJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_rA", box2d.b2WeldJoint.prototype.m_rA);
box2d.b2WeldJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_rB", box2d.b2WeldJoint.prototype.m_rB);
box2d.b2WeldJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_localCenterA", box2d.b2WeldJoint.prototype.m_localCenterA);
box2d.b2WeldJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_localCenterB", box2d.b2WeldJoint.prototype.m_localCenterB);
box2d.b2WeldJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_invMassA", box2d.b2WeldJoint.prototype.m_invMassA);
box2d.b2WeldJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_invMassB", box2d.b2WeldJoint.prototype.m_invMassB);
box2d.b2WeldJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_invIA", box2d.b2WeldJoint.prototype.m_invIA);
box2d.b2WeldJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_invIB", box2d.b2WeldJoint.prototype.m_invIB);
box2d.b2WeldJoint.prototype.m_mass = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_mass", box2d.b2WeldJoint.prototype.m_mass);
box2d.b2WeldJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_qA", box2d.b2WeldJoint.prototype.m_qA);
box2d.b2WeldJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_qB", box2d.b2WeldJoint.prototype.m_qB);
box2d.b2WeldJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_lalcA", box2d.b2WeldJoint.prototype.m_lalcA);
box2d.b2WeldJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_lalcB", box2d.b2WeldJoint.prototype.m_lalcB);
box2d.b2WeldJoint.prototype.m_K = null;
goog.exportProperty(box2d.b2WeldJoint.prototype, "m_K", box2d.b2WeldJoint.prototype.m_K);
box2d.b2WeldJoint.prototype.InitVelocityConstraints = function (a) {
    this.m_indexA = this.m_bodyA.m_islandIndex;
    this.m_indexB = this.m_bodyB.m_islandIndex;
    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
    this.m_invMassA = this.m_bodyA.m_invMass;
    this.m_invMassB = this.m_bodyB.m_invMass;
    this.m_invIA = this.m_bodyA.m_invI;
    this.m_invIB = this.m_bodyB.m_invI;
    var b = a.positions[this.m_indexA].a,
        c = a.velocities[this.m_indexA].v,
        e = a.velocities[this.m_indexA].w,
        d = a.positions[this.m_indexB].a,
        f = a.velocities[this.m_indexB].v,
        g = a.velocities[this.m_indexB].w,
        h = this.m_qA.SetAngleRadians(b),
        l = this.m_qB.SetAngleRadians(d);
    box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
    box2d.b2MulRV(h, this.m_lalcA, this.m_rA);
    box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    box2d.b2MulRV(l, this.m_lalcB, this.m_rB);
    var h = this.m_invMassA,
        l = this.m_invMassB,
        k = this.m_invIA,
        m = this.m_invIB,
        n = this.m_K;
    n.ex.x = h + l + this.m_rA.y * this.m_rA.y * k + this.m_rB.y *
        this.m_rB.y * m;
    n.ey.x = -this.m_rA.y * this.m_rA.x * k - this.m_rB.y * this.m_rB.x * m;
    n.ez.x = -this.m_rA.y * k - this.m_rB.y * m;
    n.ex.y = n.ey.x;
    n.ey.y = h + l + this.m_rA.x * this.m_rA.x * k + this.m_rB.x * this.m_rB.x * m;
    n.ez.y = this.m_rA.x * k + this.m_rB.x * m;
    n.ex.z = n.ez.x;
    n.ey.z = n.ez.y;
    n.ez.z = k + m;
    if (0 < this.m_frequencyHz) {
        n.GetInverse22(this.m_mass);
        var n = k + m,
            p = 0 < n ? 1 / n : 0,
            b = d - b - this.m_referenceAngle,
            d = 2 * box2d.b2_pi * this.m_frequencyHz,
            q = p * d * d,
            r = a.step.dt;
        this.m_gamma = r * (2 * p * this.m_dampingRatio * d + r * q);
        this.m_gamma = 0 !== this.m_gamma ? 1 / this.m_gamma :
            0;
        this.m_bias = b * r * q * this.m_gamma;
        n += this.m_gamma;
        this.m_mass.ez.z = 0 !== n ? 1 / n : 0
    } else n.GetSymInverse33(this.m_mass), this.m_bias = this.m_gamma = 0;
    a.step.warmStarting ? (this.m_impulse.SelfMul(a.step.dtRatio), n = box2d.b2WeldJoint.prototype.InitVelocityConstraints.s_P.SetXY(this.m_impulse.x, this.m_impulse.y), c.SelfMulSub(h, n), e -= k * (box2d.b2CrossVV(this.m_rA, n) + this.m_impulse.z), f.SelfMulAdd(l, n), g += m * (box2d.b2CrossVV(this.m_rB, n) + this.m_impulse.z)) : this.m_impulse.SetZero();
    a.velocities[this.m_indexA].w = e;
    a.velocities[this.m_indexB].w =
        g
};
box2d.b2WeldJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2WeldJoint.prototype.SolveVelocityConstraints = function (a) {
    var b = a.velocities[this.m_indexA].v,
        c = a.velocities[this.m_indexA].w,
        e = a.velocities[this.m_indexB].v,
        d = a.velocities[this.m_indexB].w,
        f = this.m_invMassA,
        g = this.m_invMassB,
        h = this.m_invIA,
        l = this.m_invIB;
    if (0 < this.m_frequencyHz) {
        var k = -this.m_mass.ez.z * (d - c + this.m_bias + this.m_gamma * this.m_impulse.z);
        this.m_impulse.z += k;
        c -= h * k;
        d += l * k;
        k = box2d.b2SubVV(box2d.b2AddVCrossSV(e, d, this.m_rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2Vec2.s_t1),
            box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_Cdot1);
        k = box2d.b2MulM33XY(this.m_mass, k.x, k.y, box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_impulse1).SelfNeg();
        this.m_impulse.x += k.x;
        this.m_impulse.y += k.y;
        b.SelfMulSub(f, k);
        c -= h * box2d.b2CrossVV(this.m_rA, k);
        e.SelfMulAdd(g, k);
        d += l * box2d.b2CrossVV(this.m_rB, k)
    } else {
        var k = box2d.b2SubVV(box2d.b2AddVCrossSV(e, d, this.m_rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2Vec2.s_t1), box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_Cdot1),
            m = box2d.b2MulM33XYZ(this.m_mass, k.x, k.y, d - c, box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_impulse).SelfNeg();
        this.m_impulse.SelfAdd(m);
        k = box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_P.SetXY(m.x, m.y);
        b.SelfMulSub(f, k);
        c -= h * (box2d.b2CrossVV(this.m_rA, k) + m.z);
        e.SelfMulAdd(g, k);
        d += l * (box2d.b2CrossVV(this.m_rB, k) + m.z)
    }
    a.velocities[this.m_indexA].w = c;
    a.velocities[this.m_indexB].w = d
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "SolveVelocityConstraints", box2d.b2WeldJoint.prototype.SolveVelocityConstraints);
box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_Cdot1 = new box2d.b2Vec2;
box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_impulse1 = new box2d.b2Vec2;
box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_impulse = new box2d.b2Vec3;
box2d.b2WeldJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2WeldJoint.prototype.SolvePositionConstraints = function (a) {
    var b = a.positions[this.m_indexA].c,
        c = a.positions[this.m_indexA].a,
        e = a.positions[this.m_indexB].c,
        d = a.positions[this.m_indexB].a,
        f = this.m_qA.SetAngleRadians(c),
        g = this.m_qB.SetAngleRadians(d),
        h = this.m_invMassA,
        l = this.m_invMassB,
        k = this.m_invIA,
        m = this.m_invIB;
    box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
    var n = box2d.b2MulRV(f, this.m_lalcA, this.m_rA);
    box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    var p = box2d.b2MulRV(g, this.m_lalcB, this.m_rB),
        q = this.m_K;
    q.ex.x = h + l + n.y * n.y * k + p.y * p.y * m;
    q.ey.x = -n.y * n.x * k - p.y * p.x * m;
    q.ez.x = -n.y * k - p.y * m;
    q.ex.y = q.ey.x;
    q.ey.y = h + l + n.x * n.x * k + p.x * p.x * m;
    q.ez.y = n.x * k + p.x * m;
    q.ex.z = q.ez.x;
    q.ey.z = q.ez.y;
    q.ez.z = k + m;
    if (0 < this.m_frequencyHz) {
        var r = box2d.b2SubVV(box2d.b2AddVV(e, p, box2d.b2Vec2.s_t0), box2d.b2AddVV(b, n, box2d.b2Vec2.s_t1), box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_C1),
            g = r.GetLength(),
            f = 0,
            q = q.Solve22(r.x, r.y, box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_P).SelfNeg();
        b.SelfMulSub(h, q);
        c -= k * box2d.b2CrossVV(n, q);
        e.SelfMulAdd(l, q);
        d += m * box2d.b2CrossVV(p, q)
    } else r = box2d.b2SubVV(box2d.b2AddVV(e, p, box2d.b2Vec2.s_t0), box2d.b2AddVV(b, n, box2d.b2Vec2.s_t1), box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_C1), n = d - c - this.m_referenceAngle, g = r.GetLength(), f = box2d.b2Abs(n), n = q.Solve33(r.x, r.y, n, box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_impulse).SelfNeg(), q = box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_P.SetXY(n.x, n.y), b.SelfMulSub(h, q), c -= k * (box2d.b2CrossVV(this.m_rA,
        q) + n.z), e.SelfMulAdd(l, q), d += m * (box2d.b2CrossVV(this.m_rB, q) + n.z);
    a.positions[this.m_indexA].a = c;
    a.positions[this.m_indexB].a = d;
    return g <= box2d.b2_linearSlop && f <= box2d.b2_angularSlop
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "SolvePositionConstraints", box2d.b2WeldJoint.prototype.SolvePositionConstraints);
box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_C1 = new box2d.b2Vec2;
box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2;
box2d.b2WeldJoint.prototype.SolvePositionConstraints.s_impulse = new box2d.b2Vec3;
box2d.b2WeldJoint.prototype.GetAnchorA = function (a) {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetAnchorA", box2d.b2WeldJoint.prototype.GetAnchorA);
box2d.b2WeldJoint.prototype.GetAnchorB = function (a) {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetAnchorB", box2d.b2WeldJoint.prototype.GetAnchorB);
box2d.b2WeldJoint.prototype.GetReactionForce = function (a, b) {
    return b.SetXY(a * this.m_impulse.x, a * this.m_impulse.y)
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetReactionForce", box2d.b2WeldJoint.prototype.GetReactionForce);
box2d.b2WeldJoint.prototype.GetReactionTorque = function (a) {
    return a * this.m_impulse.z
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetReactionTorque", box2d.b2WeldJoint.prototype.GetReactionTorque);
box2d.b2WeldJoint.prototype.GetLocalAnchorA = function (a) {
    return a.Copy(this.m_localAnchorA)
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetLocalAnchorA", box2d.b2WeldJoint.prototype.GetLocalAnchorA);
box2d.b2WeldJoint.prototype.GetLocalAnchorB = function (a) {
    return a.Copy(this.m_localAnchorB)
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetLocalAnchorB", box2d.b2WeldJoint.prototype.GetLocalAnchorB);
box2d.b2WeldJoint.prototype.GetReferenceAngle = function () {
    return this.m_referenceAngle
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetReferenceAngle", box2d.b2WeldJoint.prototype.GetReferenceAngle);
box2d.b2WeldJoint.prototype.SetFrequency = function (a) {
    this.m_frequencyHz = a
};
box2d.b2WeldJoint.prototype.GetFrequency = function () {
    return this.m_frequencyHz
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetFrequency", box2d.b2WeldJoint.prototype.GetFrequency);
box2d.b2WeldJoint.prototype.SetDampingRatio = function (a) {
    this.m_dampingRatio = a
};
box2d.b2WeldJoint.prototype.GetDampingRatio = function () {
    return this.m_dampingRatio
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "GetDampingRatio", box2d.b2WeldJoint.prototype.GetDampingRatio);
box2d.b2WeldJoint.prototype.Dump = function () {
    if (box2d.DEBUG) {
        var a = this.m_bodyA.m_islandIndex,
            b = this.m_bodyB.m_islandIndex;
        box2d.b2Log("  /*box2d.b2WeldJointDef*/ var jd = new box2d.b2WeldJointDef();\n");
        box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
        box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
        box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
        box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
        box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n",
            this.m_localAnchorB.x, this.m_localAnchorB.y);
        box2d.b2Log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
        box2d.b2Log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
        box2d.b2Log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
        box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
    }
};
goog.exportProperty(box2d.b2WeldJoint.prototype, "Dump", box2d.b2WeldJoint.prototype.Dump);
box2d.b2RopeJointDef = function () {
    box2d.b2JointDef.call(this, box2d.b2JointType.e_ropeJoint);
    this.localAnchorA = new box2d.b2Vec2(-1, 0);
    this.localAnchorB = new box2d.b2Vec2(1, 0)
};
goog.inherits(box2d.b2RopeJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2RopeJointDef", box2d.b2RopeJointDef);
box2d.b2RopeJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2RopeJointDef.prototype, "localAnchorA", box2d.b2RopeJointDef.prototype.localAnchorA);
box2d.b2RopeJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2RopeJointDef.prototype, "localAnchorB", box2d.b2RopeJointDef.prototype.localAnchorB);
box2d.b2RopeJointDef.prototype.maxLength = 0;
goog.exportProperty(box2d.b2RopeJointDef.prototype, "maxLength", box2d.b2RopeJointDef.prototype.maxLength);
box2d.b2RopeJoint = function (a) {
    box2d.b2Joint.call(this, a);
    this.m_localAnchorA = a.localAnchorA.Clone();
    this.m_localAnchorB = a.localAnchorB.Clone();
    this.m_maxLength = a.maxLength;
    this.m_u = new box2d.b2Vec2;
    this.m_rA = new box2d.b2Vec2;
    this.m_rB = new box2d.b2Vec2;
    this.m_localCenterA = new box2d.b2Vec2;
    this.m_localCenterB = new box2d.b2Vec2;
    this.m_qA = new box2d.b2Rot;
    this.m_qB = new box2d.b2Rot;
    this.m_lalcA = new box2d.b2Vec2;
    this.m_lalcB = new box2d.b2Vec2
};
goog.inherits(box2d.b2RopeJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2RopeJoint", box2d.b2RopeJoint);
box2d.b2RopeJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_localAnchorA", box2d.b2RopeJoint.prototype.m_localAnchorA);
box2d.b2RopeJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_localAnchorB", box2d.b2RopeJoint.prototype.m_localAnchorB);
box2d.b2RopeJoint.prototype.m_maxLength = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_maxLength", box2d.b2RopeJoint.prototype.m_maxLength);
box2d.b2RopeJoint.prototype.m_length = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_length", box2d.b2RopeJoint.prototype.m_length);
box2d.b2RopeJoint.prototype.m_impulse = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_impulse", box2d.b2RopeJoint.prototype.m_impulse);
box2d.b2RopeJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_indexA", box2d.b2RopeJoint.prototype.m_indexA);
box2d.b2RopeJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_indexB", box2d.b2RopeJoint.prototype.m_indexB);
box2d.b2RopeJoint.prototype.m_u = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_u", box2d.b2RopeJoint.prototype.m_u);
box2d.b2RopeJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_rA", box2d.b2RopeJoint.prototype.m_rA);
box2d.b2RopeJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_rB", box2d.b2RopeJoint.prototype.m_rB);
box2d.b2RopeJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_localCenterA", box2d.b2RopeJoint.prototype.m_localCenterA);
box2d.b2RopeJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_localCenterB", box2d.b2RopeJoint.prototype.m_localCenterB);
box2d.b2RopeJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_invMassA", box2d.b2RopeJoint.prototype.m_invMassA);
box2d.b2RopeJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_invMassB", box2d.b2RopeJoint.prototype.m_invMassB);
box2d.b2RopeJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_invIA", box2d.b2RopeJoint.prototype.m_invIA);
box2d.b2RopeJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_invIB", box2d.b2RopeJoint.prototype.m_invIB);
box2d.b2RopeJoint.prototype.m_mass = 0;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_mass", box2d.b2RopeJoint.prototype.m_mass);
box2d.b2RopeJoint.prototype.m_state = box2d.b2LimitState.e_inactiveLimit;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_state", box2d.b2RopeJoint.prototype.m_state);
box2d.b2RopeJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_qA", box2d.b2RopeJoint.prototype.m_qA);
box2d.b2RopeJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_qB", box2d.b2RopeJoint.prototype.m_qB);
box2d.b2RopeJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_lalcA", box2d.b2RopeJoint.prototype.m_lalcA);
box2d.b2RopeJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2RopeJoint.prototype, "m_lalcB", box2d.b2RopeJoint.prototype.m_lalcB);
box2d.b2RopeJoint.prototype.InitVelocityConstraints = function (a) {
    this.m_indexA = this.m_bodyA.m_islandIndex;
    this.m_indexB = this.m_bodyB.m_islandIndex;
    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
    this.m_invMassA = this.m_bodyA.m_invMass;
    this.m_invMassB = this.m_bodyB.m_invMass;
    this.m_invIA = this.m_bodyA.m_invI;
    this.m_invIB = this.m_bodyB.m_invI;
    var b = a.positions[this.m_indexA].c,
        c = a.velocities[this.m_indexA].v,
        e = a.velocities[this.m_indexA].w,
        d = a.positions[this.m_indexB].c,
        f = a.positions[this.m_indexB].a,
        g = a.velocities[this.m_indexB].v,
        h = a.velocities[this.m_indexB].w,
        l = this.m_qA.SetAngleRadians(a.positions[this.m_indexA].a),
        f = this.m_qB.SetAngleRadians(f);
    box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
    box2d.b2MulRV(l, this.m_lalcA, this.m_rA);
    box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    box2d.b2MulRV(f, this.m_lalcB, this.m_rB);
    this.m_u.Copy(d).SelfAdd(this.m_rB).SelfSub(b).SelfSub(this.m_rA);
    this.m_length =
        this.m_u.GetLength();
    this.m_state = 0 < this.m_length - this.m_maxLength ? box2d.b2LimitState.e_atUpperLimit : box2d.b2LimitState.e_inactiveLimit;
    this.m_length > box2d.b2_linearSlop ? (this.m_u.SelfMul(1 / this.m_length), b = box2d.b2CrossVV(this.m_rA, this.m_u), d = box2d.b2CrossVV(this.m_rB, this.m_u), b = this.m_invMassA + this.m_invIA * b * b + this.m_invMassB + this.m_invIB * d * d, this.m_mass = 0 !== b ? 1 / b : 0, a.step.warmStarting ? (this.m_impulse *= a.step.dtRatio, b = box2d.b2MulSV(this.m_impulse, this.m_u, box2d.b2RopeJoint.prototype.InitVelocityConstraints.s_P),
        c.SelfMulSub(this.m_invMassA, b), e -= this.m_invIA * box2d.b2CrossVV(this.m_rA, b), g.SelfMulAdd(this.m_invMassB, b), h += this.m_invIB * box2d.b2CrossVV(this.m_rB, b)) : this.m_impulse = 0, a.velocities[this.m_indexA].w = e, a.velocities[this.m_indexB].w = h) : (this.m_u.SetZero(), this.m_impulse = this.m_mass = 0)
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "InitVelocityConstraints", box2d.b2RopeJoint.prototype.InitVelocityConstraints);
box2d.b2RopeJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2RopeJoint.prototype.SolveVelocityConstraints = function (a) {
    var b = a.velocities[this.m_indexA].v,
        c = a.velocities[this.m_indexA].w,
        e = a.velocities[this.m_indexB].v,
        d = a.velocities[this.m_indexB].w,
        f = box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_vpA),
        g = box2d.b2AddVCrossSV(e, d, this.m_rB, box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_vpB),
        h = this.m_length - this.m_maxLength,
        f = box2d.b2DotVV(this.m_u, box2d.b2SubVV(g, f, box2d.b2Vec2.s_t0));
    0 > h && (f += a.step.inv_dt *
        h);
    h = -this.m_mass * f;
    f = this.m_impulse;
    this.m_impulse = box2d.b2Min(0, this.m_impulse + h);
    h = this.m_impulse - f;
    h = box2d.b2MulSV(h, this.m_u, box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_P);
    b.SelfMulSub(this.m_invMassA, h);
    c -= this.m_invIA * box2d.b2CrossVV(this.m_rA, h);
    e.SelfMulAdd(this.m_invMassB, h);
    d += this.m_invIB * box2d.b2CrossVV(this.m_rB, h);
    a.velocities[this.m_indexA].w = c;
    a.velocities[this.m_indexB].w = d
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "SolveVelocityConstraints", box2d.b2RopeJoint.prototype.SolveVelocityConstraints);
box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_vpA = new box2d.b2Vec2;
box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_vpB = new box2d.b2Vec2;
box2d.b2RopeJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2RopeJoint.prototype.SolvePositionConstraints = function (a) {
    var b = a.positions[this.m_indexA].c,
        c = a.positions[this.m_indexA].a,
        e = a.positions[this.m_indexB].c,
        d = a.positions[this.m_indexB].a,
        f = this.m_qA.SetAngleRadians(c),
        g = this.m_qB.SetAngleRadians(d);
    box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
    f = box2d.b2MulRV(f, this.m_lalcA, this.m_rA);
    box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    var g = box2d.b2MulRV(g, this.m_lalcB, this.m_rB),
        h = this.m_u.Copy(e).SelfAdd(g).SelfSub(b).SelfSub(f),
        l = h.Normalize(),
        k = l - this.m_maxLength,
        k = box2d.b2Clamp(k, 0, box2d.b2_maxLinearCorrection),
        h = box2d.b2MulSV(-this.m_mass * k, h, box2d.b2RopeJoint.prototype.SolvePositionConstraints.s_P);
    b.SelfMulSub(this.m_invMassA, h);
    c -= this.m_invIA * box2d.b2CrossVV(f, h);
    e.SelfMulAdd(this.m_invMassB, h);
    d += this.m_invIB * box2d.b2CrossVV(g, h);
    a.positions[this.m_indexA].a = c;
    a.positions[this.m_indexB].a = d;
    return l - this.m_maxLength < box2d.b2_linearSlop
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "SolvePositionConstraints", box2d.b2RopeJoint.prototype.SolvePositionConstraints);
box2d.b2RopeJoint.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2;
box2d.b2RopeJoint.prototype.GetAnchorA = function (a) {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetAnchorA", box2d.b2RopeJoint.prototype.GetAnchorA);
box2d.b2RopeJoint.prototype.GetAnchorB = function (a) {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetAnchorB", box2d.b2RopeJoint.prototype.GetAnchorB);
box2d.b2RopeJoint.prototype.GetReactionForce = function (a, b) {
    return box2d.b2MulSV(a * this.m_impulse, this.m_u, b)
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetReactionForce", box2d.b2RopeJoint.prototype.GetReactionForce);
box2d.b2RopeJoint.prototype.GetReactionTorque = function (a) {
    return 0
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetReactionTorque", box2d.b2RopeJoint.prototype.GetReactionTorque);
box2d.b2RopeJoint.prototype.GetLocalAnchorA = function (a) {
    return a.Copy(this.m_localAnchorA)
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetLocalAnchorA", box2d.b2RopeJoint.prototype.GetLocalAnchorA);
box2d.b2RopeJoint.prototype.GetLocalAnchorB = function (a) {
    return a.Copy(this.m_localAnchorB)
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetLocalAnchorB", box2d.b2RopeJoint.prototype.GetLocalAnchorB);
box2d.b2RopeJoint.prototype.SetMaxLength = function (a) {
    this.m_maxLength = a
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "SetMaxLength", box2d.b2RopeJoint.prototype.SetMaxLength);
box2d.b2RopeJoint.prototype.GetMaxLength = function () {
    return this.m_maxLength
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetMaxLength", box2d.b2RopeJoint.prototype.GetMaxLength);
box2d.b2RopeJoint.prototype.GetLimitState = function () {
    return this.m_state
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "GetLimitState", box2d.b2RopeJoint.prototype.GetLimitState);
box2d.b2RopeJoint.prototype.Dump = function () {
    if (box2d.DEBUG) {
        var a = this.m_bodyA.m_islandIndex,
            b = this.m_bodyB.m_islandIndex;
        box2d.b2Log("  /*box2d.b2RopeJointDef*/ var jd = new box2d.b2RopeJointDef();\n");
        box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
        box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
        box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
        box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
        box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n",
            this.m_localAnchorB.x, this.m_localAnchorB.y);
        box2d.b2Log("  jd.maxLength = %.15f;\n", this.m_maxLength);
        box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
    }
};
goog.exportProperty(box2d.b2RopeJoint.prototype, "Dump", box2d.b2RopeJoint.prototype.Dump);
box2d.b2GravityController = function () {
    box2d.b2Controller.call(this)
};
goog.inherits(box2d.b2GravityController, box2d.b2Controller);
goog.exportSymbol("box2d.b2GravityController", box2d.b2GravityController);
box2d.b2GravityController.prototype.G = 1;
goog.exportProperty(box2d.b2GravityController.prototype, "G", box2d.b2GravityController.prototype.G);
box2d.b2GravityController.prototype.invSqr = !0;
goog.exportProperty(box2d.b2GravityController.prototype, "invSqr", box2d.b2GravityController.prototype.invSqr);
box2d.b2GravityController.prototype.Step = function (a) {
    if (this.invSqr)
        for (a = this.m_bodyList; a; a = a.nextBody)
            for (var b = a.body, c = b.GetWorldCenter(), e = b.GetMass(), d = this.m_bodyList; d !== a; d = d.nextBody) {
                var f = d.body,
                    g = f.GetWorldCenter(),
                    h = f.GetMass(),
                    l = g.x - c.x,
                    k = g.y - c.y,
                    m = l * l + k * k;
                m < box2d.b2_epsilon || (l = box2d.b2GravityController.prototype.Step.s_f.SetXY(l, k), l.SelfMul(this.G / m / box2d.b2Sqrt(m) * e * h), b.IsAwake() && b.ApplyForce(l, c), f.IsAwake() && f.ApplyForce(l.SelfMul(-1), g))
            } else
                for (a = this.m_bodyList; a; a = a.nextBody)
                    for (b =
                        a.body, c = b.GetWorldCenter(), e = b.GetMass(), d = this.m_bodyList; d !== a; d = d.nextBody) f = d.body, g = f.GetWorldCenter(), h = f.GetMass(), l = g.x - c.x, k = g.y - c.y, m = l * l + k * k, m < box2d.b2_epsilon || (l = box2d.b2GravityController.prototype.Step.s_f.SetXY(l, k), l.SelfMul(this.G / m * e * h), b.IsAwake() && b.ApplyForce(l, c), f.IsAwake() && f.ApplyForce(l.SelfMul(-1), g))
};
goog.exportProperty(box2d.b2GravityController.prototype, "Step", box2d.b2GravityController.prototype.Step);
box2d.b2GravityController.prototype.Step.s_f = new box2d.b2Vec2;
box2d.b2Profile = function () {};
goog.exportSymbol("box2d.b2Profile", box2d.b2Profile);
box2d.b2Profile.prototype.step = 0;
goog.exportProperty(box2d.b2Profile.prototype, "step", box2d.b2Profile.prototype.step);
box2d.b2Profile.prototype.collide = 0;
goog.exportProperty(box2d.b2Profile.prototype, "collide", box2d.b2Profile.prototype.collide);
box2d.b2Profile.prototype.solve = 0;
goog.exportProperty(box2d.b2Profile.prototype, "solve", box2d.b2Profile.prototype.solve);
box2d.b2Profile.prototype.solveInit = 0;
goog.exportProperty(box2d.b2Profile.prototype, "solveInit", box2d.b2Profile.prototype.solveInit);
box2d.b2Profile.prototype.solveVelocity = 0;
goog.exportProperty(box2d.b2Profile.prototype, "solveVelocity", box2d.b2Profile.prototype.solveVelocity);
box2d.b2Profile.prototype.solvePosition = 0;
goog.exportProperty(box2d.b2Profile.prototype, "solvePosition", box2d.b2Profile.prototype.solvePosition);
box2d.b2Profile.prototype.broadphase = 0;
goog.exportProperty(box2d.b2Profile.prototype, "broadphase", box2d.b2Profile.prototype.broadphase);
box2d.b2Profile.prototype.solveTOI = 0;
goog.exportProperty(box2d.b2Profile.prototype, "solveTOI", box2d.b2Profile.prototype.solveTOI);
box2d.b2Profile.prototype.Reset = function () {
    this.solveTOI = this.broadphase = this.solvePosition = this.solveVelocity = this.solveInit = this.solve = this.collide = this.step = 0;
    return this
};
goog.exportProperty(box2d.b2Profile.prototype, "Reset", box2d.b2Profile.prototype.Reset);
box2d.b2TimeStep = function () {};
goog.exportSymbol("box2d.b2TimeStep", box2d.b2TimeStep);
box2d.b2TimeStep.prototype.dt = 0;
goog.exportProperty(box2d.b2TimeStep.prototype, "dt", box2d.b2TimeStep.prototype.dt);
box2d.b2TimeStep.prototype.inv_dt = 0;
goog.exportProperty(box2d.b2TimeStep.prototype, "inv_dt", box2d.b2TimeStep.prototype.inv_dt);
box2d.b2TimeStep.prototype.dtRatio = 0;
goog.exportProperty(box2d.b2TimeStep.prototype, "dtRatio", box2d.b2TimeStep.prototype.dtRatio);
box2d.b2TimeStep.prototype.velocityIterations = 0;
goog.exportProperty(box2d.b2TimeStep.prototype, "velocityIterations", box2d.b2TimeStep.prototype.velocityIterations);
box2d.b2TimeStep.prototype.positionIterations = 0;
goog.exportProperty(box2d.b2TimeStep.prototype, "positionIterations", box2d.b2TimeStep.prototype.positionIterations);
box2d.b2TimeStep.prototype.warmStarting = !1;
goog.exportProperty(box2d.b2TimeStep.prototype, "warmStarting", box2d.b2TimeStep.prototype.warmStarting);
box2d.b2TimeStep.prototype.Copy = function (a) {
    this.dt = a.dt;
    this.inv_dt = a.inv_dt;
    this.dtRatio = a.dtRatio;
    this.positionIterations = a.positionIterations;
    this.velocityIterations = a.velocityIterations;
    this.warmStarting = a.warmStarting;
    return this
};
goog.exportProperty(box2d.b2TimeStep.prototype, "Copy", box2d.b2TimeStep.prototype.Copy);
box2d.b2Position = function () {
    this.c = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2Position", box2d.b2Position);
box2d.b2Position.prototype.c = null;
goog.exportProperty(box2d.b2Position.prototype, "c", box2d.b2Position.prototype.c);
box2d.b2Position.prototype.a = 0;
goog.exportProperty(box2d.b2Position.prototype, "a", box2d.b2Position.prototype.a);
box2d.b2Position.MakeArray = function (a) {
    return box2d.b2MakeArray(a, function (a) {
        return new box2d.b2Position
    })
};
goog.exportProperty(box2d.b2Position, "MakeArray", box2d.b2Position.MakeArray);
box2d.b2Velocity = function () {
    this.v = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2Velocity", box2d.b2Velocity);
box2d.b2Velocity.prototype.v = null;
goog.exportProperty(box2d.b2Velocity.prototype, "v", box2d.b2Velocity.prototype.v);
box2d.b2Velocity.prototype.w = 0;
goog.exportProperty(box2d.b2Velocity.prototype, "w", box2d.b2Velocity.prototype.w);
box2d.b2Velocity.MakeArray = function (a) {
    return box2d.b2MakeArray(a, function (a) {
        return new box2d.b2Velocity
    })
};
goog.exportProperty(box2d.b2Velocity, "MakeArray", box2d.b2Velocity.MakeArray);
box2d.b2SolverData = function () {
    this.step = new box2d.b2TimeStep
};
goog.exportSymbol("box2d.b2SolverData", box2d.b2SolverData);
box2d.b2SolverData.prototype.step = null;
goog.exportProperty(box2d.b2SolverData.prototype, "step", box2d.b2SolverData.prototype.step);
box2d.b2SolverData.prototype.positions = null;
goog.exportProperty(box2d.b2SolverData.prototype, "positions", box2d.b2SolverData.prototype.positions);
box2d.b2SolverData.prototype.velocities = null;
goog.exportProperty(box2d.b2SolverData.prototype, "velocities", box2d.b2SolverData.prototype.velocities);
box2d.b2Collision = {};
box2d.b2ContactFeatureType = {
    e_vertex: 0,
    e_face: 1
};
goog.exportSymbol("box2d.b2ContactFeatureType", box2d.b2ContactFeatureType);
goog.exportProperty(box2d.b2ContactFeatureType, "e_vertex", box2d.b2ContactFeatureType.e_vertex);
goog.exportProperty(box2d.b2ContactFeatureType, "e_face", box2d.b2ContactFeatureType.e_face);
box2d.b2ContactFeature = function (a) {
    this._id = a
};
goog.exportSymbol("box2d.b2ContactFeature", box2d.b2ContactFeature);
box2d.b2ContactFeature.prototype._id = null;
goog.exportProperty(box2d.b2ContactFeature.prototype, "_id", box2d.b2ContactFeature.prototype._id);
box2d.b2ContactFeature.prototype._indexA = 0;
goog.exportProperty(box2d.b2ContactFeature.prototype, "_indexA", box2d.b2ContactFeature.prototype._indexA);
box2d.b2ContactFeature.prototype._indexB = 0;
goog.exportProperty(box2d.b2ContactFeature.prototype, "_indexB", box2d.b2ContactFeature.prototype._indexB);
box2d.b2ContactFeature.prototype._typeA = 0;
goog.exportProperty(box2d.b2ContactFeature.prototype, "_typeA", box2d.b2ContactFeature.prototype._typeA);
box2d.b2ContactFeature.prototype._typeB = 0;
goog.exportProperty(box2d.b2ContactFeature.prototype, "_typeB", box2d.b2ContactFeature.prototype._typeB);
Object.defineProperty(box2d.b2ContactFeature.prototype, "indexA", {
    enumerable: !1,
    configurable: !0,
    get: function () {
        return this._indexA
    },
    set: function (a) {
        this._indexA = a;
        this._id._key = this._id._key & 4294967040 | this._indexA & 255
    }
});
Object.defineProperty(box2d.b2ContactFeature.prototype, "indexB", {
    enumerable: !1,
    configurable: !0,
    get: function () {
        return this._indexB
    },
    set: function (a) {
        this._indexB = a;
        this._id._key = this._id._key & 4294902015 | this._indexB << 8 & 65280
    }
});
Object.defineProperty(box2d.b2ContactFeature.prototype, "typeA", {
    enumerable: !1,
    configurable: !0,
    get: function () {
        return this._typeA
    },
    set: function (a) {
        this._typeA = a;
        this._id._key = this._id._key & 4278255615 | this._typeA << 16 & 16711680
    }
});
Object.defineProperty(box2d.b2ContactFeature.prototype, "typeB", {
    enumerable: !1,
    configurable: !0,
    get: function () {
        return this._typeB
    },
    set: function (a) {
        this._typeB = a;
        this._id._key = this._id._key & 16777215 | this._typeB << 24 & 4278190080
    }
});
box2d.b2ContactID = function () {
    this.cf = new box2d.b2ContactFeature(this)
};
goog.exportSymbol("box2d.b2ContactID", box2d.b2ContactID);
box2d.b2ContactID.prototype.cf = null;
goog.exportProperty(box2d.b2ContactID.prototype, "cf", box2d.b2ContactID.prototype.cf);
box2d.b2ContactID.prototype.key = 0;
goog.exportProperty(box2d.b2ContactID.prototype, "key", box2d.b2ContactID.prototype.key);
box2d.b2ContactID.prototype.Copy = function (a) {
    this.key = a.key;
    return this
};
goog.exportProperty(box2d.b2ContactID.prototype, "Copy", box2d.b2ContactID.prototype.Copy);
box2d.b2ContactID.prototype.Clone = function () {
    return (new box2d.b2ContactID).Copy(this)
};
goog.exportProperty(box2d.b2ContactID.prototype, "Clone", box2d.b2ContactID.prototype.Clone);
Object.defineProperty(box2d.b2ContactID.prototype, "key", {
    enumerable: !1,
    configurable: !0,
    get: function () {
        return this._key
    },
    set: function (a) {
        this._key = a;
        this.cf._indexA = this._key & 255;
        this.cf._indexB = this._key >> 8 & 255;
        this.cf._typeA = this._key >> 16 & 255;
        this.cf._typeB = this._key >> 24 & 255
    }
});
box2d.b2ManifoldPoint = function () {
    this.localPoint = new box2d.b2Vec2;
    this.id = new box2d.b2ContactID
};
goog.exportSymbol("box2d.b2ManifoldPoint", box2d.b2ManifoldPoint);
box2d.b2ManifoldPoint.prototype.localPoint = null;
goog.exportProperty(box2d.b2ManifoldPoint.prototype, "localPoint", box2d.b2ManifoldPoint.prototype.localPoint);
box2d.b2ManifoldPoint.prototype.normalImpulse = 0;
goog.exportProperty(box2d.b2ManifoldPoint.prototype, "normalImpulse", box2d.b2ManifoldPoint.prototype.normalImpulse);
box2d.b2ManifoldPoint.prototype.tangentImpulse = 0;
goog.exportProperty(box2d.b2ManifoldPoint.prototype, "tangentImpulse", box2d.b2ManifoldPoint.prototype.tangentImpulse);
box2d.b2ManifoldPoint.prototype.id = null;
goog.exportProperty(box2d.b2ManifoldPoint.prototype, "id", box2d.b2ManifoldPoint.prototype.id);
box2d.b2ManifoldPoint.MakeArray = function (a) {
    return box2d.b2MakeArray(a, function (a) {
        return new box2d.b2ManifoldPoint
    })
};
goog.exportProperty(box2d.b2ManifoldPoint, "MakeArray", box2d.b2ManifoldPoint.MakeArray);
box2d.b2ManifoldPoint.prototype.Reset = function () {
    this.localPoint.SetZero();
    this.tangentImpulse = this.normalImpulse = 0;
    this.id.key = 0
};
goog.exportProperty(box2d.b2ManifoldPoint.prototype, "Reset", box2d.b2ManifoldPoint.prototype.Reset);
box2d.b2ManifoldPoint.prototype.Copy = function (a) {
    this.localPoint.Copy(a.localPoint);
    this.normalImpulse = a.normalImpulse;
    this.tangentImpulse = a.tangentImpulse;
    this.id.Copy(a.id);
    return this
};
goog.exportProperty(box2d.b2ManifoldPoint.prototype, "Copy", box2d.b2ManifoldPoint.prototype.Copy);
box2d.b2ManifoldType = {
    e_unknown: -1,
    e_circles: 0,
    e_faceA: 1,
    e_faceB: 2
};
goog.exportSymbol("box2d.b2ManifoldType", box2d.b2ManifoldType);
goog.exportProperty(box2d.b2ManifoldType, "e_unknown", box2d.b2ManifoldType.e_unknown);
goog.exportProperty(box2d.b2ManifoldType, "e_circles", box2d.b2ManifoldType.e_circles);
goog.exportProperty(box2d.b2ManifoldType, "e_faceA", box2d.b2ManifoldType.e_faceA);
goog.exportProperty(box2d.b2ManifoldType, "e_faceB", box2d.b2ManifoldType.e_faceB);
box2d.b2Manifold = function () {
    this.points = box2d.b2ManifoldPoint.MakeArray(box2d.b2_maxManifoldPoints);
    this.localNormal = new box2d.b2Vec2;
    this.localPoint = new box2d.b2Vec2;
    this.type = box2d.b2ManifoldType.e_unknown;
    this.pointCount = 0
};
goog.exportSymbol("box2d.b2Manifold", box2d.b2Manifold);
box2d.b2Manifold.prototype.points = null;
goog.exportProperty(box2d.b2Manifold.prototype, "points", box2d.b2Manifold.prototype.points);
box2d.b2Manifold.prototype.localNormal = null;
goog.exportProperty(box2d.b2Manifold.prototype, "localNormal", box2d.b2Manifold.prototype.localNormal);
box2d.b2Manifold.prototype.localPoint = null;
goog.exportProperty(box2d.b2Manifold.prototype, "localPoint", box2d.b2Manifold.prototype.localPoint);
box2d.b2Manifold.prototype.type = box2d.b2ManifoldType.e_unknown;
goog.exportProperty(box2d.b2Manifold.prototype, "type", box2d.b2Manifold.prototype.type);
box2d.b2Manifold.prototype.pointCount = 0;
goog.exportProperty(box2d.b2Manifold.prototype, "pointCount", box2d.b2Manifold.prototype.pointCount);
box2d.b2Manifold.prototype.Reset = function () {
    for (var a = 0, b = box2d.b2_maxManifoldPoints; a < b; ++a) this.points[a].Reset();
    this.localNormal.SetZero();
    this.localPoint.SetZero();
    this.type = box2d.b2ManifoldType.e_unknown;
    this.pointCount = 0
};
goog.exportProperty(box2d.b2Manifold.prototype, "Reset", box2d.b2Manifold.prototype.Reset);
box2d.b2Manifold.prototype.Copy = function (a) {
    this.pointCount = a.pointCount;
    for (var b = 0, c = box2d.b2_maxManifoldPoints; b < c; ++b) this.points[b].Copy(a.points[b]);
    this.localNormal.Copy(a.localNormal);
    this.localPoint.Copy(a.localPoint);
    this.type = a.type;
    return this
};
goog.exportProperty(box2d.b2Manifold.prototype, "Copy", box2d.b2Manifold.prototype.Copy);
box2d.b2Manifold.prototype.Clone = function () {
    return (new box2d.b2Manifold).Copy(this)
};
goog.exportProperty(box2d.b2Manifold.prototype, "Clone", box2d.b2Manifold.prototype.Clone);
box2d.b2WorldManifold = function () {
    this.normal = new box2d.b2Vec2;
    this.points = box2d.b2Vec2.MakeArray(box2d.b2_maxManifoldPoints);
    this.separations = box2d.b2MakeNumberArray(box2d.b2_maxManifoldPoints)
};
goog.exportSymbol("box2d.b2WorldManifold", box2d.b2WorldManifold);
box2d.b2WorldManifold.prototype.normal = null;
goog.exportProperty(box2d.b2WorldManifold.prototype, "normal", box2d.b2WorldManifold.prototype.normal);
box2d.b2WorldManifold.prototype.points = null;
goog.exportProperty(box2d.b2WorldManifold.prototype, "points", box2d.b2WorldManifold.prototype.points);
box2d.b2WorldManifold.prototype.separations = null;
goog.exportProperty(box2d.b2WorldManifold.prototype, "separations", box2d.b2WorldManifold.prototype.separations);
box2d.b2WorldManifold.prototype.Initialize = function (a, b, c, e, d) {
    if (0 !== a.pointCount) switch (a.type) {
    case box2d.b2ManifoldType.e_circles:
        this.normal.SetXY(1, 0);
        b = box2d.b2MulXV(b, a.localPoint, box2d.b2WorldManifold.prototype.Initialize.s_pointA);
        a = box2d.b2MulXV(e, a.points[0].localPoint, box2d.b2WorldManifold.prototype.Initialize.s_pointB);
        box2d.b2DistanceSquaredVV(b, a) > box2d.b2_epsilon_sq && box2d.b2SubVV(a, b, this.normal).SelfNormalize();
        var f = box2d.b2AddVMulSV(b, c, this.normal, box2d.b2WorldManifold.prototype.Initialize.s_cA),
            g = box2d.b2SubVMulSV(a, d, this.normal, box2d.b2WorldManifold.prototype.Initialize.s_cB);
        box2d.b2MidVV(f, g, this.points[0]);
        this.separations[0] = box2d.b2DotVV(box2d.b2SubVV(g, f, box2d.b2Vec2.s_t0), this.normal);
        break;
    case box2d.b2ManifoldType.e_faceA:
        box2d.b2MulRV(b.q, a.localNormal, this.normal);
        for (var h = box2d.b2MulXV(b, a.localPoint, box2d.b2WorldManifold.prototype.Initialize.s_planePoint), l = 0, k = a.pointCount; l < k; ++l) {
            var m = box2d.b2MulXV(e, a.points[l].localPoint, box2d.b2WorldManifold.prototype.Initialize.s_clipPoint),
                f = c - box2d.b2DotVV(box2d.b2SubVV(m, h, box2d.b2Vec2.s_t0), this.normal),
                f = box2d.b2AddVMulSV(m, f, this.normal, box2d.b2WorldManifold.prototype.Initialize.s_cA),
                g = box2d.b2SubVMulSV(m, d, this.normal, box2d.b2WorldManifold.prototype.Initialize.s_cB);
            box2d.b2MidVV(f, g, this.points[l]);
            this.separations[l] = box2d.b2DotVV(box2d.b2SubVV(g, f, box2d.b2Vec2.s_t0), this.normal)
        }
        break;
    case box2d.b2ManifoldType.e_faceB:
        box2d.b2MulRV(e.q, a.localNormal, this.normal);
        h = box2d.b2MulXV(e, a.localPoint, box2d.b2WorldManifold.prototype.Initialize.s_planePoint);
        l = 0;
        for (k = a.pointCount; l < k; ++l) m = box2d.b2MulXV(b, a.points[l].localPoint, box2d.b2WorldManifold.prototype.Initialize.s_clipPoint), f = d - box2d.b2DotVV(box2d.b2SubVV(m, h, box2d.b2Vec2.s_t0), this.normal), g = box2d.b2AddVMulSV(m, f, this.normal, box2d.b2WorldManifold.prototype.Initialize.s_cB), f = box2d.b2SubVMulSV(m, c, this.normal, box2d.b2WorldManifold.prototype.Initialize.s_cA), box2d.b2MidVV(f, g, this.points[l]), this.separations[l] = box2d.b2DotVV(box2d.b2SubVV(f, g, box2d.b2Vec2.s_t0), this.normal);
        this.normal.SelfNeg()
    }
};
goog.exportProperty(box2d.b2WorldManifold.prototype, "Initialize", box2d.b2WorldManifold.prototype.Initialize);
box2d.b2WorldManifold.prototype.Initialize.s_pointA = new box2d.b2Vec2;
box2d.b2WorldManifold.prototype.Initialize.s_pointB = new box2d.b2Vec2;
box2d.b2WorldManifold.prototype.Initialize.s_cA = new box2d.b2Vec2;
box2d.b2WorldManifold.prototype.Initialize.s_cB = new box2d.b2Vec2;
box2d.b2WorldManifold.prototype.Initialize.s_planePoint = new box2d.b2Vec2;
box2d.b2WorldManifold.prototype.Initialize.s_clipPoint = new box2d.b2Vec2;
box2d.b2PointState = {
    b2_nullState: 0,
    b2_addState: 1,
    b2_persistState: 2,
    b2_removeState: 3
};
goog.exportSymbol("box2d.b2PointState", box2d.b2PointState);
goog.exportProperty(box2d.b2PointState, "b2_nullState   ", box2d.b2PointState.b2_nullState);
goog.exportProperty(box2d.b2PointState, "b2_addState    ", box2d.b2PointState.b2_addState);
goog.exportProperty(box2d.b2PointState, "b2_persistState", box2d.b2PointState.b2_persistState);
goog.exportProperty(box2d.b2PointState, "b2_removeState ", box2d.b2PointState.b2_removeState);
box2d.b2GetPointStates = function (a, b, c, e) {
    for (var d = 0, f = c.pointCount; d < f; ++d) {
        var g = c.points[d].id,
            g = g.key;
        a[d] = box2d.b2PointState.b2_removeState;
        for (var h = 0, l = e.pointCount; h < l; ++h)
            if (e.points[h].id.key === g) {
                a[d] = box2d.b2PointState.b2_persistState;
                break
            }
    }
    for (f = box2d.b2_maxManifoldPoints; d < f; ++d) a[d] = box2d.b2PointState.b2_nullState;
    d = 0;
    for (f = e.pointCount; d < f; ++d)
        for (g = e.points[d].id, g = g.key, b[d] = box2d.b2PointState.b2_addState, h = 0, l = c.pointCount; h < l; ++h)
            if (c.points[h].id.key === g) {
                b[d] = box2d.b2PointState.b2_persistState;
                break
            }
    for (f = box2d.b2_maxManifoldPoints; d < f; ++d) b[d] = box2d.b2PointState.b2_nullState
};
goog.exportSymbol("box2d.b2GetPointStates", box2d.b2GetPointStates);
box2d.b2ClipVertex = function () {
    this.v = new box2d.b2Vec2;
    this.id = new box2d.b2ContactID
};
goog.exportSymbol("box2d.b2ClipVertex", box2d.b2ClipVertex);
box2d.b2ClipVertex.prototype.v = null;
goog.exportProperty(box2d.b2ClipVertex.prototype, "v", box2d.b2ClipVertex.prototype.v);
box2d.b2ClipVertex.prototype.id = null;
goog.exportProperty(box2d.b2ClipVertex.prototype, "id", box2d.b2ClipVertex.prototype.id);
box2d.b2ClipVertex.MakeArray = function (a) {
    return box2d.b2MakeArray(a, function (a) {
        return new box2d.b2ClipVertex
    })
};
goog.exportProperty(box2d.b2ClipVertex, "MakeArray", box2d.b2ClipVertex.MakeArray);
box2d.b2ClipVertex.prototype.Copy = function (a) {
    this.v.Copy(a.v);
    this.id.Copy(a.id);
    return this
};
goog.exportProperty(box2d.b2ClipVertex.prototype, "Copy", box2d.b2ClipVertex.prototype.Copy);
box2d.b2RayCastInput = function () {
    this.p1 = new box2d.b2Vec2;
    this.p2 = new box2d.b2Vec2;
    this.maxFraction = 1
};
goog.exportSymbol("box2d.b2RayCastInput", box2d.b2RayCastInput);
box2d.b2RayCastInput.prototype.p1 = null;
goog.exportProperty(box2d.b2RayCastInput.prototype, "p1", box2d.b2RayCastInput.prototype.p1);
box2d.b2RayCastInput.prototype.p2 = null;
goog.exportProperty(box2d.b2RayCastInput.prototype, "p2", box2d.b2RayCastInput.prototype.p2);
box2d.b2RayCastInput.prototype.maxFraction = 1;
goog.exportProperty(box2d.b2RayCastInput.prototype, "maxFraction", box2d.b2RayCastInput.prototype.maxFraction);
box2d.b2RayCastInput.prototype.Copy = function (a) {
    this.p1.Copy(a.p1);
    this.p2.Copy(a.p2);
    this.maxFraction = a.maxFraction;
    return this
};
goog.exportProperty(box2d.b2RayCastInput.prototype, "Copy", box2d.b2RayCastInput.prototype.Copy);
box2d.b2RayCastOutput = function () {
    this.normal = new box2d.b2Vec2;
    this.fraction = 0
};
goog.exportSymbol("box2d.b2RayCastOutput", box2d.b2RayCastOutput);
box2d.b2RayCastOutput.prototype.normal = null;
goog.exportProperty(box2d.b2RayCastOutput.prototype, "normal", box2d.b2RayCastOutput.prototype.normal);
box2d.b2RayCastOutput.prototype.fraction = 0;
goog.exportProperty(box2d.b2RayCastOutput.prototype, "fraction", box2d.b2RayCastOutput.prototype.fraction);
box2d.b2RayCastOutput.prototype.Copy = function (a) {
    this.normal.Copy(a.normal);
    this.fraction = a.fraction;
    return this
};
goog.exportProperty(box2d.b2RayCastOutput.prototype, "Copy", box2d.b2RayCastOutput.prototype.Copy);
box2d.b2AABB = function () {
    this.lowerBound = new box2d.b2Vec2;
    this.upperBound = new box2d.b2Vec2;
    this.m_out_center = new box2d.b2Vec2;
    this.m_out_extent = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2AABB", box2d.b2AABB);
box2d.b2AABB.prototype.lowerBound = null;
goog.exportProperty(box2d.b2AABB.prototype, "lowerBound", box2d.b2AABB.prototype.lowerBound);
box2d.b2AABB.prototype.upperBound = null;
goog.exportProperty(box2d.b2AABB.prototype, "upperBound", box2d.b2AABB.prototype.upperBound);
box2d.b2AABB.prototype.m_out_center = null;
goog.exportProperty(box2d.b2AABB.prototype, "m_out_center", box2d.b2AABB.prototype.m_out_center);
box2d.b2AABB.prototype.m_out_extent = null;
goog.exportProperty(box2d.b2AABB.prototype, "m_out_extent", box2d.b2AABB.prototype.m_out_extent);
box2d.b2AABB.prototype.Copy = function (a) {
    this.lowerBound.Copy(a.lowerBound);
    this.upperBound.Copy(a.upperBound);
    return this
};
goog.exportProperty(box2d.b2AABB.prototype, "Copy", box2d.b2AABB.prototype.Copy);
box2d.b2AABB.prototype.IsValid = function () {
    var a = this.upperBound.y - this.lowerBound.y;
    return a = (a = 0 <= this.upperBound.x - this.lowerBound.x && 0 <= a) && this.lowerBound.IsValid() && this.upperBound.IsValid()
};
goog.exportProperty(box2d.b2AABB.prototype, "IsValid", box2d.b2AABB.prototype.IsValid);
box2d.b2AABB.prototype.GetCenter = function () {
    return box2d.b2MidVV(this.lowerBound, this.upperBound, this.m_out_center)
};
goog.exportProperty(box2d.b2AABB.prototype, "GetCenter", box2d.b2AABB.prototype.GetCenter);
box2d.b2AABB.prototype.GetExtents = function () {
    return box2d.b2ExtVV(this.lowerBound, this.upperBound, this.m_out_extent)
};
goog.exportProperty(box2d.b2AABB.prototype, "GetExtents", box2d.b2AABB.prototype.GetExtents);
box2d.b2AABB.prototype.GetPerimeter = function () {
    return 2 * (this.upperBound.x - this.lowerBound.x + (this.upperBound.y - this.lowerBound.y))
};
goog.exportProperty(box2d.b2AABB.prototype, "GetPerimeter", box2d.b2AABB.prototype.GetPerimeter);
box2d.b2AABB.prototype.Combine1 = function (a) {
    this.lowerBound.x = box2d.b2Min(this.lowerBound.x, a.lowerBound.x);
    this.lowerBound.y = box2d.b2Min(this.lowerBound.y, a.lowerBound.y);
    this.upperBound.x = box2d.b2Max(this.upperBound.x, a.upperBound.x);
    this.upperBound.y = box2d.b2Max(this.upperBound.y, a.upperBound.y);
    return this
};
goog.exportProperty(box2d.b2AABB.prototype, "Combine1", box2d.b2AABB.prototype.Combine1);
box2d.b2AABB.prototype.Combine2 = function (a, b) {
    this.lowerBound.x = box2d.b2Min(a.lowerBound.x, b.lowerBound.x);
    this.lowerBound.y = box2d.b2Min(a.lowerBound.y, b.lowerBound.y);
    this.upperBound.x = box2d.b2Max(a.upperBound.x, b.upperBound.x);
    this.upperBound.y = box2d.b2Max(a.upperBound.y, b.upperBound.y);
    return this
};
goog.exportProperty(box2d.b2AABB.prototype, "Combine2", box2d.b2AABB.prototype.Combine2);
box2d.b2AABB.Combine = function (a, b, c) {
    c.Combine2(a, b);
    return c
};
goog.exportProperty(box2d.b2AABB, "Combine", box2d.b2AABB.Combine);
box2d.b2AABB.prototype.Contains = function (a) {
    var b;
    return b = (b = (b = (b = this.lowerBound.x <= a.lowerBound.x) && this.lowerBound.y <= a.lowerBound.y) && a.upperBound.x <= this.upperBound.x) && a.upperBound.y <= this.upperBound.y
};
goog.exportProperty(box2d.b2AABB.prototype, "Contains", box2d.b2AABB.prototype.Contains);
box2d.b2AABB.prototype.RayCast = function (a, b) {
    var c = -box2d.b2_maxFloat,
        e = box2d.b2_maxFloat,
        d = b.p1.x,
        f = b.p1.y,
        g = b.p2.x - b.p1.x,
        h = b.p2.y - b.p1.y,
        l = box2d.b2Abs(g),
        k = box2d.b2Abs(h),
        m = a.normal;
    if (l < box2d.b2_epsilon) {
        if (d < this.lowerBound.x || this.upperBound.x < d) return !1
    } else if (l = 1 / g, g = (this.lowerBound.x - d) * l, d = (this.upperBound.x - d) * l, l = -1, g > d && (l = g, g = d, d = l, l = 1), g > c && (m.x = l, m.y = 0, c = g), e = box2d.b2Min(e, d), c > e) return !1;
    if (k < box2d.b2_epsilon) {
        if (f < this.lowerBound.y || this.upperBound.y < f) return !1
    } else if (l = 1 / h, g =
        (this.lowerBound.y - f) * l, d = (this.upperBound.y - f) * l, l = -1, g > d && (l = g, g = d, d = l, l = 1), g > c && (m.x = 0, m.y = l, c = g), e = box2d.b2Min(e, d), c > e) return !1;
    if (0 > c || b.maxFraction < c) return !1;
    a.fraction = c;
    return !0
};
goog.exportProperty(box2d.b2AABB.prototype, "RayCast", box2d.b2AABB.prototype.RayCast);
box2d.b2AABB.prototype.TestOverlap = function (a) {
    var b = a.lowerBound.y - this.upperBound.y,
        c = this.lowerBound.y - a.upperBound.y;
    return 0 < a.lowerBound.x - this.upperBound.x || 0 < b || 0 < this.lowerBound.x - a.upperBound.x || 0 < c ? !1 : !0
};
goog.exportProperty(box2d.b2AABB.prototype, "TestOverlap", box2d.b2AABB.prototype.TestOverlap);
box2d.b2TestOverlapAABB = function (a, b) {
    var c = b.lowerBound.y - a.upperBound.y,
        e = a.lowerBound.y - b.upperBound.y;
    return 0 < b.lowerBound.x - a.upperBound.x || 0 < c || 0 < a.lowerBound.x - b.upperBound.x || 0 < e ? !1 : !0
};
goog.exportSymbol("box2d.b2TestOverlapAABB", box2d.b2TestOverlapAABB);
box2d.b2ClipSegmentToLine = function (a, b, c, e, d) {
    var f = 0,
        g = b[0];
    b = b[1];
    var h = box2d.b2DotVV(c, g.v) - e;
    c = box2d.b2DotVV(c, b.v) - e;
    0 >= h && a[f++].Copy(g);
    0 >= c && a[f++].Copy(b);
    0 > h * c && (c = h / (h - c), e = a[f].v, e.x = g.v.x + c * (b.v.x - g.v.x), e.y = g.v.y + c * (b.v.y - g.v.y), a = a[f].id, a.cf.indexA = d, a.cf.indexB = g.id.cf.indexB, a.cf.typeA = box2d.b2ContactFeatureType.e_vertex, a.cf.typeB = box2d.b2ContactFeatureType.e_face, ++f);
    return f
};
goog.exportSymbol("box2d.b2ClipSegmentToLine", box2d.b2ClipSegmentToLine);
box2d.b2TestOverlapShape = function (a, b, c, e, d, f) {
    var g = box2d.b2TestOverlapShape.s_input.Reset();
    g.proxyA.SetShape(a, b);
    g.proxyB.SetShape(c, e);
    g.transformA.Copy(d);
    g.transformB.Copy(f);
    g.useRadii = !0;
    a = box2d.b2TestOverlapShape.s_simplexCache.Reset();
    a.count = 0;
    b = box2d.b2TestOverlapShape.s_output.Reset();
    box2d.b2Distance(b, a, g);
    return b.distance < 10 * box2d.b2_epsilon
};
goog.exportSymbol("box2d.b2TestOverlapShape", box2d.b2TestOverlapShape);
box2d.b2TestOverlapShape.s_input = new box2d.b2DistanceInput;
box2d.b2TestOverlapShape.s_simplexCache = new box2d.b2SimplexCache;
box2d.b2TestOverlapShape.s_output = new box2d.b2DistanceOutput;
box2d.b2Timer = function () {
    this.m_start = (new Date).getTime()
};
goog.exportSymbol("box2d.b2Timer", box2d.b2Timer);
box2d.b2Timer.prototype.m_start = 0;
goog.exportProperty(box2d.b2Timer.prototype, "m_start", box2d.b2Timer.prototype.m_start);
box2d.b2Timer.prototype.Reset = function () {
    this.m_start = (new Date).getTime();
    return this
};
goog.exportProperty(box2d.b2Timer.prototype, "Reset", box2d.b2Timer.prototype.Reset);
box2d.b2Timer.prototype.GetMilliseconds = function () {
    return (new Date).getTime() - this.m_start
};
goog.exportProperty(box2d.b2Timer.prototype, "GetMilliseconds", box2d.b2Timer.prototype.GetMilliseconds);
box2d.b2Counter = function () {};
goog.exportSymbol("box2d.b2Counter", box2d.b2Counter);
box2d.b2Counter.prototype.m_count = 0;
goog.exportProperty(box2d.b2Counter.prototype, "m_count", box2d.b2Counter.prototype.m_count);
box2d.b2Counter.prototype.m_min_count = 0;
goog.exportProperty(box2d.b2Counter.prototype, "m_min_count", box2d.b2Counter.prototype.m_min_count);
box2d.b2Counter.prototype.m_max_count = 0;
goog.exportProperty(box2d.b2Counter.prototype, "m_max_count", box2d.b2Counter.prototype.m_max_count);
box2d.b2Counter.prototype.GetCount = function () {
    return this.m_count
};
goog.exportProperty(box2d.b2Counter.prototype, "GetCount", box2d.b2Counter.prototype.GetCount);
box2d.b2Counter.prototype.GetMinCount = function () {
    return this.m_min_count
};
goog.exportProperty(box2d.b2Counter.prototype, "GetMinCount", box2d.b2Counter.prototype.GetMinCount);
box2d.b2Counter.prototype.GetMaxCount = function () {
    return this.m_max_count
};
goog.exportProperty(box2d.b2Counter.prototype, "GetMaxCount", box2d.b2Counter.prototype.GetMaxCount);
box2d.b2Counter.prototype.ResetCount = function () {
    var a = this.m_count;
    this.m_count = 0;
    return a
};
goog.exportProperty(box2d.b2Counter.prototype, "ResetCount", box2d.b2Counter.prototype.ResetCount);
box2d.b2Counter.prototype.ResetMinCount = function () {
    this.m_min_count = 0
};
goog.exportProperty(box2d.b2Counter.prototype, "ResetMinCount", box2d.b2Counter.prototype.ResetMinCount);
box2d.b2Counter.prototype.ResetMaxCount = function () {
    this.m_max_count = 0
};
goog.exportProperty(box2d.b2Counter.prototype, "ResetMaxCount", box2d.b2Counter.prototype.ResetMaxCount);
box2d.b2Counter.prototype.Increment = function () {
    this.m_count++;
    this.m_max_count < this.m_count && (this.m_max_count = this.m_count)
};
goog.exportProperty(box2d.b2Counter.prototype, "Increment", box2d.b2Counter.prototype.Increment);
box2d.b2Counter.prototype.Decrement = function () {
    this.m_count--;
    this.m_min_count > this.m_count && (this.m_min_count = this.m_count)
};
goog.exportProperty(box2d.b2Counter.prototype, "Decrement", box2d.b2Counter.prototype.Decrement);
box2d.b2_toiTime = 0;
goog.exportSymbol("box2d.b2_toiTime", box2d.b2_toiTime);
box2d.b2_toiMaxTime = 0;
goog.exportSymbol("box2d.b2_toiMaxTime", box2d.b2_toiMaxTime);
box2d.b2_toiCalls = 0;
goog.exportSymbol("box2d.b2_toiCalls", box2d.b2_toiCalls);
box2d.b2_toiIters = 0;
goog.exportSymbol("box2d.b2_toiIters", box2d.b2_toiIters);
box2d.b2_toiMaxIters = 0;
goog.exportSymbol("box2d.b2_toiMaxIters", box2d.b2_toiMaxIters);
box2d.b2_toiRootIters = 0;
goog.exportSymbol("box2d.b2_toiRootIters", box2d.b2_toiRootIters);
box2d.b2_toiMaxRootIters = 0;
goog.exportSymbol("box2d.b2_toiMaxRootIters", box2d.b2_toiMaxRootIters);
box2d.b2TOIInput = function () {
    this.proxyA = new box2d.b2DistanceProxy;
    this.proxyB = new box2d.b2DistanceProxy;
    this.sweepA = new box2d.b2Sweep;
    this.sweepB = new box2d.b2Sweep
};
goog.exportSymbol("box2d.b2TOIInput", box2d.b2TOIInput);
box2d.b2TOIInput.prototype.proxyA = null;
goog.exportProperty(box2d.b2TOIInput.prototype, "proxyA", box2d.b2TOIInput.prototype.proxyA);
box2d.b2TOIInput.prototype.proxyB = null;
goog.exportProperty(box2d.b2TOIInput.prototype, "proxyB", box2d.b2TOIInput.prototype.proxyB);
box2d.b2TOIInput.prototype.sweepA = null;
goog.exportProperty(box2d.b2TOIInput.prototype, "sweepA", box2d.b2TOIInput.prototype.sweepA);
box2d.b2TOIInput.prototype.sweepB = null;
goog.exportProperty(box2d.b2TOIInput.prototype, "sweepB", box2d.b2TOIInput.prototype.sweepB);
box2d.b2TOIInput.prototype.tMax = 0;
goog.exportProperty(box2d.b2TOIInput.prototype, "tMax", box2d.b2TOIInput.prototype.tMax);
box2d.b2TOIOutputState = {
    e_unknown: 0,
    e_failed: 1,
    e_overlapped: 2,
    e_touching: 3,
    e_separated: 4
};
goog.exportSymbol("box2d.b2TOIOutputState", box2d.b2TOIOutputState);
goog.exportProperty(box2d.b2TOIOutputState, "e_unknown", box2d.b2TOIOutputState.e_unknown);
goog.exportProperty(box2d.b2TOIOutputState, "e_failed", box2d.b2TOIOutputState.e_failed);
goog.exportProperty(box2d.b2TOIOutputState, "e_overlapped", box2d.b2TOIOutputState.e_overlapped);
goog.exportProperty(box2d.b2TOIOutputState, "e_touching", box2d.b2TOIOutputState.e_touching);
goog.exportProperty(box2d.b2TOIOutputState, "e_separated", box2d.b2TOIOutputState.e_separated);
box2d.b2TOIOutput = function () {};
goog.exportSymbol("box2d.b2TOIOutput", box2d.b2TOIOutput);
box2d.b2TOIOutput.prototype.state = box2d.b2TOIOutputState.e_unknown;
goog.exportProperty(box2d.b2TOIOutput.prototype, "state", box2d.b2TOIOutput.prototype.state);
box2d.b2TOIOutput.prototype.t = 0;
goog.exportProperty(box2d.b2TOIOutput.prototype, "t", box2d.b2TOIOutput.prototype.t);
box2d.b2SeparationFunctionType = {
    e_unknown: -1,
    e_points: 0,
    e_faceA: 1,
    e_faceB: 2
};
goog.exportSymbol("box2d.b2SeparationFunctionType", box2d.b2SeparationFunctionType);
goog.exportProperty(box2d.b2SeparationFunctionType, "e_unknown", box2d.b2SeparationFunctionType.e_unknown);
goog.exportProperty(box2d.b2SeparationFunctionType, "e_points", box2d.b2SeparationFunctionType.e_points);
goog.exportProperty(box2d.b2SeparationFunctionType, "e_faceA", box2d.b2SeparationFunctionType.e_faceA);
goog.exportProperty(box2d.b2SeparationFunctionType, "e_faceB", box2d.b2SeparationFunctionType.e_faceB);
box2d.b2SeparationFunction = function () {
    this.m_sweepA = new box2d.b2Sweep;
    this.m_sweepB = new box2d.b2Sweep;
    this.m_localPoint = new box2d.b2Vec2;
    this.m_axis = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2SeparationFunction", box2d.b2SeparationFunction);
box2d.b2SeparationFunction.prototype.m_proxyA = null;
goog.exportProperty(box2d.b2SeparationFunction.prototype, "m_proxyA", box2d.b2SeparationFunction.prototype.m_proxyA);
box2d.b2SeparationFunction.prototype.m_proxyB = null;
goog.exportProperty(box2d.b2SeparationFunction.prototype, "m_proxyB", box2d.b2SeparationFunction.prototype.m_proxyB);
box2d.b2SeparationFunction.prototype.m_sweepA = null;
goog.exportProperty(box2d.b2SeparationFunction.prototype, "m_sweepA", box2d.b2SeparationFunction.prototype.m_sweepA);
box2d.b2SeparationFunction.prototype.m_sweepB = null;
goog.exportProperty(box2d.b2SeparationFunction.prototype, "m_sweepB", box2d.b2SeparationFunction.prototype.m_sweepB);
box2d.b2SeparationFunction.prototype.m_type = box2d.b2SeparationFunctionType.e_unknown;
goog.exportProperty(box2d.b2SeparationFunction.prototype, "m_type", box2d.b2SeparationFunction.prototype.m_type);
box2d.b2SeparationFunction.prototype.m_localPoint = null;
goog.exportProperty(box2d.b2SeparationFunction.prototype, "m_localPoint", box2d.b2SeparationFunction.prototype.m_localPoint);
box2d.b2SeparationFunction.prototype.m_axis = null;
goog.exportProperty(box2d.b2SeparationFunction.prototype, "m_axis", box2d.b2SeparationFunction.prototype.m_axis);
box2d.b2SeparationFunction.prototype.Initialize = function (a, b, c, e, d, f) {
    this.m_proxyA = b;
    this.m_proxyB = e;
    b = a.count;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < b && 3 > b);
    this.m_sweepA.Copy(c);
    this.m_sweepB.Copy(d);
    c = box2d.b2TimeOfImpact.s_xfA;
    d = box2d.b2TimeOfImpact.s_xfB;
    this.m_sweepA.GetTransform(c, f);
    this.m_sweepB.GetTransform(d, f);
    1 === b ? (this.m_type = box2d.b2SeparationFunctionType.e_points, b = this.m_proxyA.GetVertex(a.indexA[0]), a = this.m_proxyB.GetVertex(a.indexB[0]), c = box2d.b2MulXV(c, b, box2d.b2TimeOfImpact.s_pointA),
        d = box2d.b2MulXV(d, a, box2d.b2TimeOfImpact.s_pointB), box2d.b2SubVV(d, c, this.m_axis), a = this.m_axis.Normalize()) : (a.indexA[0] === a.indexA[1] ? (this.m_type = box2d.b2SeparationFunctionType.e_faceB, b = this.m_proxyB.GetVertex(a.indexB[0]), e = this.m_proxyB.GetVertex(a.indexB[1]), box2d.b2CrossVOne(box2d.b2SubVV(e, b, box2d.b2Vec2.s_t0), this.m_axis).SelfNormalize(), f = box2d.b2MulRV(d.q, this.m_axis, box2d.b2TimeOfImpact.s_normal), box2d.b2MidVV(b, e, this.m_localPoint), d = box2d.b2MulXV(d, this.m_localPoint, box2d.b2TimeOfImpact.s_pointB),
        b = this.m_proxyA.GetVertex(a.indexA[0]), c = box2d.b2MulXV(c, b, box2d.b2TimeOfImpact.s_pointA), a = box2d.b2DotVV(box2d.b2SubVV(c, d, box2d.b2Vec2.s_t0), f)) : (this.m_type = box2d.b2SeparationFunctionType.e_faceA, b = this.m_proxyA.GetVertex(a.indexA[0]), e = this.m_proxyA.GetVertex(a.indexA[1]), box2d.b2CrossVOne(box2d.b2SubVV(e, b, box2d.b2Vec2.s_t0), this.m_axis).SelfNormalize(), f = box2d.b2MulRV(c.q, this.m_axis, box2d.b2TimeOfImpact.s_normal), box2d.b2MidVV(b, e, this.m_localPoint), c = box2d.b2MulXV(c, this.m_localPoint, box2d.b2TimeOfImpact.s_pointA),
        a = this.m_proxyB.GetVertex(a.indexB[0]), d = box2d.b2MulXV(d, a, box2d.b2TimeOfImpact.s_pointB), a = box2d.b2DotVV(box2d.b2SubVV(d, c, box2d.b2Vec2.s_t0), f)), 0 > a && (this.m_axis.SelfNeg(), a = -a));
    return a
};
goog.exportProperty(box2d.b2SeparationFunction.prototype, "Initialize", box2d.b2SeparationFunction.prototype.Initialize);
box2d.b2SeparationFunction.prototype.FindMinSeparation = function (a, b, c) {
    var e = box2d.b2TimeOfImpact.s_xfA,
        d = box2d.b2TimeOfImpact.s_xfB;
    this.m_sweepA.GetTransform(e, c);
    this.m_sweepB.GetTransform(d, c);
    switch (this.m_type) {
    case box2d.b2SeparationFunctionType.e_points:
        var f = box2d.b2MulTRV(e.q, this.m_axis, box2d.b2TimeOfImpact.s_axisA),
            g = box2d.b2MulTRV(d.q, box2d.b2NegV(this.m_axis, box2d.b2Vec2.s_t0), box2d.b2TimeOfImpact.s_axisB);
        a[0] = this.m_proxyA.GetSupport(f);
        b[0] = this.m_proxyB.GetSupport(g);
        a = this.m_proxyA.GetVertex(a[0]);
        b = this.m_proxyB.GetVertex(b[0]);
        e = box2d.b2MulXV(e, a, box2d.b2TimeOfImpact.s_pointA);
        d = box2d.b2MulXV(d, b, box2d.b2TimeOfImpact.s_pointB);
        return b = box2d.b2DotVV(box2d.b2SubVV(d, e, box2d.b2Vec2.s_t0), this.m_axis);
    case box2d.b2SeparationFunctionType.e_faceA:
        return c = box2d.b2MulRV(e.q, this.m_axis, box2d.b2TimeOfImpact.s_normal), e = box2d.b2MulXV(e, this.m_localPoint, box2d.b2TimeOfImpact.s_pointA), g = box2d.b2MulTRV(d.q, box2d.b2NegV(c, box2d.b2Vec2.s_t0), box2d.b2TimeOfImpact.s_axisB), a[0] = -1, b[0] = this.m_proxyB.GetSupport(g),
        b = this.m_proxyB.GetVertex(b[0]), d = box2d.b2MulXV(d, b, box2d.b2TimeOfImpact.s_pointB), b = box2d.b2DotVV(box2d.b2SubVV(d, e, box2d.b2Vec2.s_t0), c);
    case box2d.b2SeparationFunctionType.e_faceB:
        return c = box2d.b2MulRV(d.q, this.m_axis, box2d.b2TimeOfImpact.s_normal), d = box2d.b2MulXV(d, this.m_localPoint, box2d.b2TimeOfImpact.s_pointB), f = box2d.b2MulTRV(e.q, box2d.b2NegV(c, box2d.b2Vec2.s_t0), box2d.b2TimeOfImpact.s_axisA), b[0] = -1, a[0] = this.m_proxyA.GetSupport(f), a = this.m_proxyA.GetVertex(a[0]), e = box2d.b2MulXV(e, a, box2d.b2TimeOfImpact.s_pointA),
        b = box2d.b2DotVV(box2d.b2SubVV(e, d, box2d.b2Vec2.s_t0), c);
    default:
        return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), a[0] = -1, b[0] = -1, 0
    }
};
goog.exportProperty(box2d.b2SeparationFunction.prototype, "FindMinSeparation", box2d.b2SeparationFunction.prototype.FindMinSeparation);
box2d.b2SeparationFunction.prototype.Evaluate = function (a, b, c) {
    var e = box2d.b2TimeOfImpact.s_xfA,
        d = box2d.b2TimeOfImpact.s_xfB;
    this.m_sweepA.GetTransform(e, c);
    this.m_sweepB.GetTransform(d, c);
    switch (this.m_type) {
    case box2d.b2SeparationFunctionType.e_points:
        return a = this.m_proxyA.GetVertex(a), b = this.m_proxyB.GetVertex(b), e = box2d.b2MulXV(e, a, box2d.b2TimeOfImpact.s_pointA), d = box2d.b2MulXV(d, b, box2d.b2TimeOfImpact.s_pointB), e = box2d.b2DotVV(box2d.b2SubVV(d, e, box2d.b2Vec2.s_t0), this.m_axis);
    case box2d.b2SeparationFunctionType.e_faceA:
        return c =
            box2d.b2MulRV(e.q, this.m_axis, box2d.b2TimeOfImpact.s_normal), e = box2d.b2MulXV(e, this.m_localPoint, box2d.b2TimeOfImpact.s_pointA), b = this.m_proxyB.GetVertex(b), d = box2d.b2MulXV(d, b, box2d.b2TimeOfImpact.s_pointB), e = box2d.b2DotVV(box2d.b2SubVV(d, e, box2d.b2Vec2.s_t0), c);
    case box2d.b2SeparationFunctionType.e_faceB:
        return c = box2d.b2MulRV(d.q, this.m_axis, box2d.b2TimeOfImpact.s_normal), d = box2d.b2MulXV(d, this.m_localPoint, box2d.b2TimeOfImpact.s_pointB), a = this.m_proxyA.GetVertex(a), e = box2d.b2MulXV(e, a, box2d.b2TimeOfImpact.s_pointA),
        e = box2d.b2DotVV(box2d.b2SubVV(e, d, box2d.b2Vec2.s_t0), c);
    default:
        return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), 0
    }
};
goog.exportProperty(box2d.b2SeparationFunction.prototype, "Evaluate", box2d.b2SeparationFunction.prototype.Evaluate);
box2d.b2TimeOfImpact = function (a, b) {
    var c = box2d.b2TimeOfImpact.s_timer.Reset();
    ++box2d.b2_toiCalls;
    a.state = box2d.b2TOIOutputState.e_unknown;
    a.t = b.tMax;
    var e = b.proxyA,
        d = b.proxyB,
        f = box2d.b2TimeOfImpact.s_sweepA.Copy(b.sweepA),
        g = box2d.b2TimeOfImpact.s_sweepB.Copy(b.sweepB);
    f.Normalize();
    g.Normalize();
    var h = b.tMax,
        l = box2d.b2Max(box2d.b2_linearSlop, e.m_radius + d.m_radius - 3 * box2d.b2_linearSlop),
        k = 0.25 * box2d.b2_linearSlop;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(l > k);
    var m = 0,
        n = 0,
        p = box2d.b2TimeOfImpact.s_cache;
    p.count = 0;
    var q = box2d.b2TimeOfImpact.s_distanceInput;
    q.proxyA = b.proxyA;
    q.proxyB = b.proxyB;
    for (q.useRadii = !1;;) {
        var r = box2d.b2TimeOfImpact.s_xfA,
            t = box2d.b2TimeOfImpact.s_xfB;
        f.GetTransform(r, m);
        g.GetTransform(t, m);
        q.transformA.Copy(r);
        q.transformB.Copy(t);
        r = box2d.b2TimeOfImpact.s_distanceOutput;
        box2d.b2Distance(r, p, q);
        if (0 >= r.distance) {
            a.state = box2d.b2TOIOutputState.e_overlapped;
            a.t = 0;
            break
        }
        if (r.distance < l + k) {
            a.state = box2d.b2TOIOutputState.e_touching;
            a.t = m;
            break
        }
        r = box2d.b2TimeOfImpact.s_fcn;
        r.Initialize(p,
            e, f, d, g, m);
        for (var t = !1, s = h, u = 0;;) {
            var v = box2d.b2TimeOfImpact.s_indexA,
                y = box2d.b2TimeOfImpact.s_indexB,
                D = r.FindMinSeparation(v, y, s);
            if (D > l + k) {
                a.state = box2d.b2TOIOutputState.e_separated;
                a.t = h;
                t = !0;
                break
            }
            if (D > l - k) {
                m = s;
                break
            }
            var x = r.Evaluate(v[0], y[0], m);
            if (x < l - k) {
                a.state = box2d.b2TOIOutputState.e_failed;
                a.t = m;
                t = !0;
                break
            }
            if (x <= l + k) {
                a.state = box2d.b2TOIOutputState.e_touching;
                a.t = m;
                t = !0;
                break
            }
            for (var w = 0, C = m, A = s;;) {
                var E = 0,
                    E = w & 1 ? C + (l - x) * (A - C) / (D - x) : 0.5 * (C + A);
                ++w;
                ++box2d.b2_toiRootIters;
                var B = r.Evaluate(v[0],
                    y[0], E);
                if (box2d.b2Abs(B - l) < k) {
                    s = E;
                    break
                }
                B > l ? (C = E, x = B) : (A = E, D = B);
                if (50 === w) break
            }
            box2d.b2_toiMaxRootIters = box2d.b2Max(box2d.b2_toiMaxRootIters, w);
            ++u;
            if (u === box2d.b2_maxPolygonVertices) break
        }++n;
        ++box2d.b2_toiIters;
        if (t) break;
        if (20 === n) {
            a.state = box2d.b2TOIOutputState.e_failed;
            a.t = m;
            break
        }
    }
    box2d.b2_toiMaxIters = box2d.b2Max(box2d.b2_toiMaxIters, n);
    c = c.GetMilliseconds();
    box2d.b2_toiMaxTime = box2d.b2Max(box2d.b2_toiMaxTime, c);
    box2d.b2_toiTime += c
};
goog.exportSymbol("box2d.b2TimeOfImpact", box2d.b2TimeOfImpact);
box2d.b2TimeOfImpact.s_timer = new box2d.b2Timer;
box2d.b2TimeOfImpact.s_cache = new box2d.b2SimplexCache;
box2d.b2TimeOfImpact.s_distanceInput = new box2d.b2DistanceInput;
box2d.b2TimeOfImpact.s_distanceOutput = new box2d.b2DistanceOutput;
box2d.b2TimeOfImpact.s_xfA = new box2d.b2Transform;
box2d.b2TimeOfImpact.s_xfB = new box2d.b2Transform;
box2d.b2TimeOfImpact.s_indexA = box2d.b2MakeNumberArray(1);
box2d.b2TimeOfImpact.s_indexB = box2d.b2MakeNumberArray(1);
box2d.b2TimeOfImpact.s_fcn = new box2d.b2SeparationFunction;
box2d.b2TimeOfImpact.s_sweepA = new box2d.b2Sweep;
box2d.b2TimeOfImpact.s_sweepB = new box2d.b2Sweep;
box2d.b2TimeOfImpact.s_pointA = new box2d.b2Vec2;
box2d.b2TimeOfImpact.s_pointB = new box2d.b2Vec2;
box2d.b2TimeOfImpact.s_normal = new box2d.b2Vec2;
box2d.b2TimeOfImpact.s_axisA = new box2d.b2Vec2;
box2d.b2TimeOfImpact.s_axisB = new box2d.b2Vec2;
box2d.b2MixFriction = function (a, b) {
    return box2d.b2Sqrt(a * b)
};
goog.exportSymbol("box2d.b2MixFriction", box2d.b2MixFriction);
box2d.b2MixRestitution = function (a, b) {
    return a > b ? a : b
};
goog.exportSymbol("box2d.b2MixRestitution", box2d.b2MixRestitution);
box2d.b2ContactEdge = function () {};
goog.exportSymbol("box2d.b2ContactEdge", box2d.b2ContactEdge);
box2d.b2ContactEdge.prototype.other = null;
goog.exportProperty(box2d.b2ContactEdge.prototype, "other", box2d.b2ContactEdge.prototype.other);
box2d.b2ContactEdge.prototype.contact = null;
goog.exportProperty(box2d.b2ContactEdge.prototype, "contact", box2d.b2ContactEdge.prototype.contact);
box2d.b2ContactEdge.prototype.prev = null;
goog.exportProperty(box2d.b2ContactEdge.prototype, "prev", box2d.b2ContactEdge.prototype.prev);
box2d.b2ContactEdge.prototype.next = null;
goog.exportProperty(box2d.b2ContactEdge.prototype, "next", box2d.b2ContactEdge.prototype.next);
box2d.b2ContactFlag = {
    e_none: 0,
    e_islandFlag: 1,
    e_touchingFlag: 2,
    e_enabledFlag: 4,
    e_filterFlag: 8,
    e_bulletHitFlag: 16,
    e_toiFlag: 32
};
goog.exportProperty(box2d.b2ContactFlag, "e_none", box2d.b2ContactFlag.e_none);
goog.exportProperty(box2d.b2ContactFlag, "e_islandFlag", box2d.b2ContactFlag.e_islandFlag);
goog.exportProperty(box2d.b2ContactFlag, "e_touchingFlag", box2d.b2ContactFlag.e_touchingFlag);
goog.exportProperty(box2d.b2ContactFlag, "e_enabledFlag", box2d.b2ContactFlag.e_enabledFlag);
goog.exportProperty(box2d.b2ContactFlag, "e_filterFlag", box2d.b2ContactFlag.e_filterFlag);
goog.exportProperty(box2d.b2ContactFlag, "e_bulletHitFlag", box2d.b2ContactFlag.e_bulletHitFlag);
goog.exportProperty(box2d.b2ContactFlag, "e_toiFlag", box2d.b2ContactFlag.e_toiFlag);
box2d.b2Contact = function () {
    this.m_nodeA = new box2d.b2ContactEdge;
    this.m_nodeB = new box2d.b2ContactEdge;
    this.m_manifold = new box2d.b2Manifold;
    this.m_oldManifold = new box2d.b2Manifold
};
goog.exportSymbol("box2d.b2Contact", box2d.b2Contact);
box2d.b2Contact.prototype.m_flags = box2d.b2ContactFlag.e_none;
goog.exportProperty(box2d.b2Contact.prototype, "m_flags", box2d.b2Contact.prototype.m_flags);
box2d.b2Contact.prototype.m_prev = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_prev", box2d.b2Contact.prototype.m_prev);
box2d.b2Contact.prototype.m_next = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_next", box2d.b2Contact.prototype.m_next);
box2d.b2Contact.prototype.m_nodeA = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_nodeA", box2d.b2Contact.prototype.m_nodeA);
box2d.b2Contact.prototype.m_nodeB = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_nodeB", box2d.b2Contact.prototype.m_nodeB);
box2d.b2Contact.prototype.m_fixtureA = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_fixtureA", box2d.b2Contact.prototype.m_fixtureA);
box2d.b2Contact.prototype.m_fixtureB = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_fixtureB", box2d.b2Contact.prototype.m_fixtureB);
box2d.b2Contact.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2Contact.prototype, "m_indexA", box2d.b2Contact.prototype.m_indexA);
box2d.b2Contact.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2Contact.prototype, "m_indexB", box2d.b2Contact.prototype.m_indexB);
box2d.b2Contact.prototype.m_manifold = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_manifold", box2d.b2Contact.prototype.m_manifold);
box2d.b2Contact.prototype.m_toiCount = 0;
goog.exportProperty(box2d.b2Contact.prototype, "m_toiCount", box2d.b2Contact.prototype.m_toiCount);
box2d.b2Contact.prototype.m_toi = 0;
goog.exportProperty(box2d.b2Contact.prototype, "m_toi", box2d.b2Contact.prototype.m_toi);
box2d.b2Contact.prototype.m_friction = 0;
goog.exportProperty(box2d.b2Contact.prototype, "m_friction", box2d.b2Contact.prototype.m_friction);
box2d.b2Contact.prototype.m_restitution = 0;
goog.exportProperty(box2d.b2Contact.prototype, "m_restitution", box2d.b2Contact.prototype.m_restitution);
box2d.b2Contact.prototype.m_tangentSpeed = 0;
goog.exportProperty(box2d.b2Contact.prototype, "m_tangentSpeed", box2d.b2Contact.prototype.m_tangentSpeed);
box2d.b2Contact.prototype.m_oldManifold = null;
goog.exportProperty(box2d.b2Contact.prototype, "m_oldManifold", box2d.b2Contact.prototype.m_oldManifold);
box2d.b2Contact.prototype.GetManifold = function () {
    return this.m_manifold
};
goog.exportProperty(box2d.b2Contact.prototype, "GetManifold", box2d.b2Contact.prototype.GetManifold);
box2d.b2Contact.prototype.GetWorldManifold = function (a) {
    var b = this.m_fixtureA.GetBody(),
        c = this.m_fixtureB.GetBody(),
        e = this.m_fixtureA.GetShape(),
        d = this.m_fixtureB.GetShape();
    a.Initialize(this.m_manifold, b.GetTransform(), e.m_radius, c.GetTransform(), d.m_radius)
};
goog.exportProperty(box2d.b2Contact.prototype, "GetWorldManifold", box2d.b2Contact.prototype.GetWorldManifold);
box2d.b2Contact.prototype.IsTouching = function () {
    return (this.m_flags & box2d.b2ContactFlag.e_touchingFlag) === box2d.b2ContactFlag.e_touchingFlag
};
goog.exportProperty(box2d.b2Contact.prototype, "IsTouching", box2d.b2Contact.prototype.IsTouching);
box2d.b2Contact.prototype.SetEnabled = function (a) {
    this.m_flags = a ? this.m_flags | box2d.b2ContactFlag.e_enabledFlag : this.m_flags & ~box2d.b2ContactFlag.e_enabledFlag
};
goog.exportProperty(box2d.b2Contact.prototype, "SetEnabled", box2d.b2Contact.prototype.SetEnabled);
box2d.b2Contact.prototype.IsEnabled = function () {
    return (this.m_flags & box2d.b2ContactFlag.e_enabledFlag) === box2d.b2ContactFlag.e_enabledFlag
};
goog.exportProperty(box2d.b2Contact.prototype, "IsEnabled", box2d.b2Contact.prototype.IsEnabled);
box2d.b2Contact.prototype.GetNext = function () {
    return this.m_next
};
goog.exportProperty(box2d.b2Contact.prototype, "GetNext", box2d.b2Contact.prototype.GetNext);
box2d.b2Contact.prototype.GetFixtureA = function () {
    return this.m_fixtureA
};
goog.exportProperty(box2d.b2Contact.prototype, "GetFixtureA", box2d.b2Contact.prototype.GetFixtureA);
box2d.b2Contact.prototype.GetChildIndexA = function () {
    return this.m_indexA
};
goog.exportProperty(box2d.b2Contact.prototype, "GetChildIndexA", box2d.b2Contact.prototype.GetChildIndexA);
box2d.b2Contact.prototype.GetFixtureB = function () {
    return this.m_fixtureB
};
goog.exportProperty(box2d.b2Contact.prototype, "GetFixtureB", box2d.b2Contact.prototype.GetFixtureB);
box2d.b2Contact.prototype.GetChildIndexB = function () {
    return this.m_indexB
};
goog.exportProperty(box2d.b2Contact.prototype, "GetChildIndexB", box2d.b2Contact.prototype.GetChildIndexB);
box2d.b2Contact.prototype.Evaluate = function (a, b, c) {};
goog.exportProperty(box2d.b2Contact.prototype, "Evaluate", box2d.b2Contact.prototype.Evaluate);
box2d.b2Contact.prototype.FlagForFiltering = function () {
    this.m_flags |= box2d.b2ContactFlag.e_filterFlag
};
goog.exportProperty(box2d.b2Contact.prototype, "FlagForFiltering", box2d.b2Contact.prototype.FlagForFiltering);
box2d.b2Contact.prototype.SetFriction = function (a) {
    this.m_friction = a
};
goog.exportProperty(box2d.b2Contact.prototype, "SetFriction", box2d.b2Contact.prototype.SetFriction);
box2d.b2Contact.prototype.GetFriction = function () {
    return this.m_friction
};
goog.exportProperty(box2d.b2Contact.prototype, "GetFriction", box2d.b2Contact.prototype.GetFriction);
box2d.b2Contact.prototype.ResetFriction = function () {
    this.m_friction = box2d.b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction)
};
goog.exportProperty(box2d.b2Contact.prototype, "ResetFriction", box2d.b2Contact.prototype.ResetFriction);
box2d.b2Contact.prototype.SetRestitution = function (a) {
    this.m_restitution = a
};
goog.exportProperty(box2d.b2Contact.prototype, "SetRestitution", box2d.b2Contact.prototype.SetRestitution);
box2d.b2Contact.prototype.GetRestitution = function () {
    return this.m_restitution
};
goog.exportProperty(box2d.b2Contact.prototype, "GetRestitution", box2d.b2Contact.prototype.GetRestitution);
box2d.b2Contact.prototype.ResetRestitution = function () {
    this.m_restitution = box2d.b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution)
};
goog.exportProperty(box2d.b2Contact.prototype, "ResetRestitution", box2d.b2Contact.prototype.ResetRestitution);
box2d.b2Contact.prototype.SetTangentSpeed = function (a) {
    this.m_tangentSpeed = a
};
goog.exportProperty(box2d.b2Contact.prototype, "SetTangentSpeed", box2d.b2Contact.prototype.SetTangentSpeed);
box2d.b2Contact.prototype.GetTangentSpeed = function () {
    return this.m_tangentSpeed
};
goog.exportProperty(box2d.b2Contact.prototype, "GetTangentSpeed", box2d.b2Contact.prototype.GetTangentSpeed);
box2d.b2Contact.prototype.Reset = function (a, b, c, e) {
    this.m_flags = box2d.b2ContactFlag.e_enabledFlag;
    this.m_fixtureA = a;
    this.m_fixtureB = c;
    this.m_indexA = b;
    this.m_indexB = e;
    this.m_manifold.pointCount = 0;
    this.m_next = this.m_prev = null;
    this.m_nodeA.contact = null;
    this.m_nodeA.prev = null;
    this.m_nodeA.next = null;
    this.m_nodeA.other = null;
    this.m_nodeB.contact = null;
    this.m_nodeB.prev = null;
    this.m_nodeB.next = null;
    this.m_nodeB.other = null;
    this.m_toiCount = 0;
    this.m_friction = box2d.b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction);
    this.m_restitution = box2d.b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution)
};
goog.exportProperty(box2d.b2Contact.prototype, "Reset", box2d.b2Contact.prototype.Reset);
box2d.b2Contact.prototype.Update = function (a) {
    var b = this.m_oldManifold;
    this.m_oldManifold = this.m_manifold;
    this.m_manifold = b;
    this.m_flags |= box2d.b2ContactFlag.e_enabledFlag;
    var c = !1,
        b = (this.m_flags & box2d.b2ContactFlag.e_touchingFlag) === box2d.b2ContactFlag.e_touchingFlag,
        e = this.m_fixtureA.IsSensor(),
        d = this.m_fixtureB.IsSensor(),
        e = e || d,
        d = this.m_fixtureA.GetBody(),
        f = this.m_fixtureB.GetBody(),
        c = d.GetTransform(),
        g = f.GetTransform();
    if (e) d = this.m_fixtureA.GetShape(), f = this.m_fixtureB.GetShape(), c = box2d.b2TestOverlapShape(d,
        this.m_indexA, f, this.m_indexB, c, g), this.m_manifold.pointCount = 0;
    else {
        this.Evaluate(this.m_manifold, c, g);
        c = 0 < this.m_manifold.pointCount;
        for (g = 0; g < this.m_manifold.pointCount; ++g) {
            var h = this.m_manifold.points[g];
            h.normalImpulse = 0;
            h.tangentImpulse = 0;
            for (var l = h.id, k = 0; k < this.m_oldManifold.pointCount; ++k) {
                var m = this.m_oldManifold.points[k];
                if (m.id.key === l.key) {
                    h.normalImpulse = m.normalImpulse;
                    h.tangentImpulse = m.tangentImpulse;
                    break
                }
            }
        }
        c !== b && (d.SetAwake(!0), f.SetAwake(!0))
    }
    this.m_flags = c ? this.m_flags | box2d.b2ContactFlag.e_touchingFlag :
        this.m_flags & ~box2d.b2ContactFlag.e_touchingFlag;
    !1 === b && !0 === c && a && a.BeginContact(this);
    !0 === b && !1 === c && a && a.EndContact(this);
    !1 === e && c && a && a.PreSolve(this, this.m_oldManifold)
};
goog.exportProperty(box2d.b2Contact.prototype, "Update", box2d.b2Contact.prototype.Update);
box2d.b2Contact.prototype.ComputeTOI = function (a, b) {
    var c = box2d.b2Contact.prototype.ComputeTOI.s_input;
    c.proxyA.SetShape(this.m_fixtureA.GetShape(), this.m_indexA);
    c.proxyB.SetShape(this.m_fixtureB.GetShape(), this.m_indexB);
    c.sweepA.Copy(a);
    c.sweepB.Copy(b);
    c.tMax = box2d.b2_linearSlop;
    var e = box2d.b2Contact.prototype.ComputeTOI.s_output;
    box2d.b2TimeOfImpact(e, c);
    return e.t
};
goog.exportProperty(box2d.b2Contact.prototype, "ComputeTOI", box2d.b2Contact.prototype.ComputeTOI);
box2d.b2Contact.prototype.ComputeTOI.s_input = new box2d.b2TOIInput;
box2d.b2Contact.prototype.ComputeTOI.s_output = new box2d.b2TOIOutput;
box2d.b2PolygonAndCircleContact = function () {
    box2d.b2Contact.call(this)
};
goog.inherits(box2d.b2PolygonAndCircleContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2PolygonAndCircleContact", box2d.b2PolygonAndCircleContact);
box2d.b2PolygonAndCircleContact.Create = function (a) {
    return new box2d.b2PolygonAndCircleContact
};
goog.exportProperty(box2d.b2PolygonAndCircleContact, "Create", box2d.b2PolygonAndCircleContact.Create);
box2d.b2PolygonAndCircleContact.Destroy = function (a, b) {};
goog.exportProperty(box2d.b2PolygonAndCircleContact, "Destroy", box2d.b2PolygonAndCircleContact.Destroy);
box2d.b2PolygonAndCircleContact.prototype.Reset = function (a, b, c, e) {
    box2d.b2PolygonAndCircleContact.superClass_.Reset.call(this, a, b, c, e);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a.GetType() === box2d.b2ShapeType.e_polygonShape);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(c.GetType() === box2d.b2ShapeType.e_circleShape)
};
goog.exportProperty(box2d.b2PolygonAndCircleContact.prototype, "Reset", box2d.b2PolygonAndCircleContact.prototype.Reset);
box2d.b2PolygonAndCircleContact.prototype.Evaluate = function (a, b, c) {
    var e = this.m_fixtureA.GetShape(),
        d = this.m_fixtureB.GetShape();
    box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2PolygonShape);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2CircleShape);
    box2d.b2CollidePolygonAndCircle(a, e instanceof box2d.b2PolygonShape ? e : null, b, d instanceof box2d.b2CircleShape ? d : null, c)
};
goog.exportProperty(box2d.b2PolygonAndCircleContact.prototype, "Evaluate", box2d.b2PolygonAndCircleContact.prototype.Evaluate);
box2d.b2EdgeAndPolygonContact = function () {
    box2d.b2Contact.call(this)
};
goog.inherits(box2d.b2EdgeAndPolygonContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2EdgeAndPolygonContact", box2d.b2EdgeAndPolygonContact);
box2d.b2EdgeAndPolygonContact.Create = function (a) {
    return new box2d.b2EdgeAndPolygonContact
};
goog.exportProperty(box2d.b2EdgeAndPolygonContact, "Create", box2d.b2EdgeAndPolygonContact.Create);
box2d.b2EdgeAndPolygonContact.Destroy = function (a, b) {};
goog.exportProperty(box2d.b2EdgeAndPolygonContact, "Destroy", box2d.b2EdgeAndPolygonContact.Destroy);
box2d.b2EdgeAndPolygonContact.prototype.Reset = function (a, b, c, e) {
    box2d.b2EdgeAndPolygonContact.superClass_.Reset.call(this, a, b, c, e);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a.GetType() === box2d.b2ShapeType.e_edgeShape);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(c.GetType() === box2d.b2ShapeType.e_polygonShape)
};
goog.exportProperty(box2d.b2EdgeAndPolygonContact.prototype, "Reset", box2d.b2EdgeAndPolygonContact.prototype.Reset);
box2d.b2EdgeAndPolygonContact.prototype.Evaluate = function (a, b, c) {
    var e = this.m_fixtureA.GetShape(),
        d = this.m_fixtureB.GetShape();
    box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2EdgeShape);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2PolygonShape);
    box2d.b2CollideEdgeAndPolygon(a, e instanceof box2d.b2EdgeShape ? e : null, b, d instanceof box2d.b2PolygonShape ? d : null, c)
};
goog.exportProperty(box2d.b2EdgeAndPolygonContact.prototype, "Evaluate", box2d.b2EdgeAndPolygonContact.prototype.Evaluate);
box2d.b2MassData = function () {
    this.center = new box2d.b2Vec2(0, 0)
};
goog.exportSymbol("box2d.b2MassData", box2d.b2MassData);
box2d.b2MassData.prototype.mass = 0;
goog.exportProperty(box2d.b2MassData.prototype, "mass", box2d.b2MassData.prototype.mass);
box2d.b2MassData.prototype.center = null;
goog.exportProperty(box2d.b2MassData.prototype, "center", box2d.b2MassData.prototype.center);
box2d.b2MassData.prototype.I = 0;
goog.exportProperty(box2d.b2MassData.prototype, "I", box2d.b2MassData.prototype.I);
box2d.b2ShapeType = {
    e_unknown: -1,
    e_circleShape: 0,
    e_edgeShape: 1,
    e_polygonShape: 2,
    e_chainShape: 3,
    e_shapeTypeCount: 4
};
goog.exportSymbol("box2d.b2ShapeType", box2d.b2ShapeType);
goog.exportProperty(box2d.b2ShapeType, "e_unknown", box2d.b2ShapeType.e_unknown);
goog.exportProperty(box2d.b2ShapeType, "e_circleShape", box2d.b2ShapeType.e_circleShape);
goog.exportProperty(box2d.b2ShapeType, "e_edgeShape", box2d.b2ShapeType.e_edgeShape);
goog.exportProperty(box2d.b2ShapeType, "e_polygonShape", box2d.b2ShapeType.e_polygonShape);
goog.exportProperty(box2d.b2ShapeType, "e_chainShape", box2d.b2ShapeType.e_chainShape);
goog.exportProperty(box2d.b2ShapeType, "e_shapeTypeCount", box2d.b2ShapeType.e_shapeTypeCount);
box2d.b2Shape = function (a, b) {
    this.m_type = a;
    this.m_radius = b
};
goog.exportSymbol("box2d.b2Shape", box2d.b2Shape);
box2d.b2Shape.prototype.m_type = box2d.b2ShapeType.e_unknown;
goog.exportProperty(box2d.b2Shape.prototype, "m_type", box2d.b2Shape.prototype.m_type);
box2d.b2Shape.prototype.m_radius = 0;
goog.exportProperty(box2d.b2Shape.prototype, "m_radius", box2d.b2Shape.prototype.m_radius);
box2d.b2Shape.prototype.Clone = function () {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
    return null
};
goog.exportProperty(box2d.b2Shape.prototype, "Clone", box2d.b2Shape.prototype.Clone);
box2d.b2Shape.prototype.Copy = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(this.m_type === a.m_type);
    this.m_radius = a.m_radius;
    return this
};
goog.exportProperty(box2d.b2Shape.prototype, "Copy", box2d.b2Shape.prototype.Copy);
box2d.b2Shape.prototype.GetType = function () {
    return this.m_type
};
goog.exportProperty(box2d.b2Shape.prototype, "GetType", box2d.b2Shape.prototype.GetType);
box2d.b2Shape.prototype.GetChildCount = function () {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
    return 0
};
goog.exportProperty(box2d.b2Shape.prototype, "GetChildCount", box2d.b2Shape.prototype.GetChildCount);
box2d.b2Shape.prototype.TestPoint = function (a, b) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
    return !1
};
goog.exportProperty(box2d.b2Shape.prototype, "TestPoint", box2d.b2Shape.prototype.TestPoint);
box2d.b2Shape.prototype.RayCast = function (a, b, c, e) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
    return !1
};
goog.exportProperty(box2d.b2Shape.prototype, "RayCast", box2d.b2Shape.prototype.RayCast);
box2d.b2Shape.prototype.ComputeAABB = function (a, b, c) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual")
};
goog.exportProperty(box2d.b2Shape.prototype, "ComputeAABB", box2d.b2Shape.prototype.ComputeAABB);
box2d.b2Shape.prototype.ComputeMass = function (a, b) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual")
};
goog.exportProperty(box2d.b2Shape.prototype, "ComputeMass", box2d.b2Shape.prototype.ComputeMass);
box2d.b2Shape.prototype.SetupDistanceProxy = function (a, b) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual")
};
box2d.b2Shape.prototype.ComputeSubmergedArea = function (a, b, c, e) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual");
    return 0
};
goog.exportProperty(box2d.b2Shape.prototype, "ComputeSubmergedArea", box2d.b2Shape.prototype.ComputeSubmergedArea);
box2d.b2Shape.prototype.Dump = function () {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1, "pure virtual")
};
goog.exportProperty(box2d.b2Shape.prototype, "Dump", box2d.b2Shape.prototype.Dump);
box2d.b2PolygonShape = function () {
    box2d.b2Shape.call(this, box2d.b2ShapeType.e_polygonShape, box2d.b2_polygonRadius);
    this.m_centroid = new box2d.b2Vec2(0, 0);
    this.m_vertices = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
    this.m_normals = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices)
};
goog.inherits(box2d.b2PolygonShape, box2d.b2Shape);
goog.exportSymbol("box2d.b2PolygonShape", box2d.b2PolygonShape);
box2d.b2PolygonShape.prototype.m_centroid = null;
goog.exportProperty(box2d.b2PolygonShape.prototype, "m_centroid", box2d.b2PolygonShape.prototype.m_centroid);
box2d.b2PolygonShape.prototype.m_vertices = null;
goog.exportProperty(box2d.b2PolygonShape.prototype, "m_vertices", box2d.b2PolygonShape.prototype.m_vertices);
box2d.b2PolygonShape.prototype.m_normals = null;
goog.exportProperty(box2d.b2PolygonShape.prototype, "m_normals", box2d.b2PolygonShape.prototype.m_normals);
box2d.b2PolygonShape.prototype.m_count = 0;
goog.exportProperty(box2d.b2PolygonShape.prototype, "m_count", box2d.b2PolygonShape.prototype.m_count);
box2d.b2PolygonShape.prototype.Clone = function () {
    return (new box2d.b2PolygonShape).Copy(this)
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "Clone", box2d.b2PolygonShape.prototype.Clone);
box2d.b2PolygonShape.prototype.Copy = function (a) {
    box2d.b2PolygonShape.superClass_.Copy.call(this, a);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a instanceof box2d.b2PolygonShape);
    this.m_centroid.Copy(a.m_centroid);
    this.m_count = a.m_count;
    for (var b = 0, c = this.m_count; b < c; ++b) this.m_vertices[b].Copy(a.m_vertices[b]), this.m_normals[b].Copy(a.m_normals[b]);
    return this
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "Copy", box2d.b2PolygonShape.prototype.Copy);
box2d.b2PolygonShape.prototype.SetAsBox = function (a, b) {
    this.m_count = 4;
    this.m_vertices[0].SetXY(-a, -b);
    this.m_vertices[1].SetXY(a, -b);
    this.m_vertices[2].SetXY(a, b);
    this.m_vertices[3].SetXY(-a, b);
    this.m_normals[0].SetXY(0, -1);
    this.m_normals[1].SetXY(1, 0);
    this.m_normals[2].SetXY(0, 1);
    this.m_normals[3].SetXY(-1, 0);
    this.m_centroid.SetZero();
    return this
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "SetAsBox", box2d.b2PolygonShape.prototype.SetAsBox);
box2d.b2PolygonShape.prototype.SetAsOrientedBox = function (a, b, c, e) {
    this.m_count = 4;
    this.m_vertices[0].SetXY(-a, -b);
    this.m_vertices[1].SetXY(a, -b);
    this.m_vertices[2].SetXY(a, b);
    this.m_vertices[3].SetXY(-a, b);
    this.m_normals[0].SetXY(0, -1);
    this.m_normals[1].SetXY(1, 0);
    this.m_normals[2].SetXY(0, 1);
    this.m_normals[3].SetXY(-1, 0);
    this.m_centroid.Copy(c);
    a = new box2d.b2Transform;
    a.SetPosition(c);
    a.SetRotationAngleRadians(e);
    c = 0;
    for (e = this.m_count; c < e; ++c) box2d.b2MulXV(a, this.m_vertices[c], this.m_vertices[c]),
    box2d.b2MulRV(a.q, this.m_normals[c], this.m_normals[c]);
    return this
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "SetAsOrientedBox", box2d.b2PolygonShape.prototype.SetAsOrientedBox);
box2d.b2PolygonShape.prototype.Set = function (a, b) {
    void 0 === b && (b = a.length);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= b && b <= box2d.b2_maxPolygonVertices);
    if (3 > b) return this.SetAsBox(1, 1);
    for (var c = box2d.b2Min(b, box2d.b2_maxPolygonVertices), e = box2d.b2PolygonShape.prototype.Set.s_ps, d = 0, f = 0; f < c; ++f) {
        for (var g = a[f], h = !0, l = 0; l < d; ++l)
            if (box2d.b2DistanceSquaredVV(g, e[l]) < 0.5 * box2d.b2_linearSlop) {
                h = !1;
                break
            }
        h && e[d++].Copy(g)
    }
    c = d;
    if (3 > c) return box2d.ENABLE_ASSERTS && box2d.b2Assert(!1), this.SetAsBox(1, 1);
    d = 0;
    g =
        e[0].x;
    for (f = 1; f < c; ++f)
        if (l = e[f].x, l > g || l === g && e[f].y < e[d].y) d = f, g = l;
    for (var k = box2d.b2PolygonShape.prototype.Set.s_hull, h = 0, f = d;;) {
        k[h] = f;
        for (var m = 0, l = 1; l < c; ++l)
            if (m === f) m = l;
            else {
                var n = box2d.b2SubVV(e[m], e[k[h]], box2d.b2PolygonShape.prototype.Set.s_r),
                    g = box2d.b2SubVV(e[l], e[k[h]], box2d.b2PolygonShape.prototype.Set.s_v),
                    p = box2d.b2CrossVV(n, g);
                0 > p && (m = l);
                0 === p && g.GetLengthSquared() > n.GetLengthSquared() && (m = l)
            }++h;
        f = m;
        if (m === d) break
    }
    this.m_count = h;
    for (f = 0; f < h; ++f) this.m_vertices[f].Copy(e[k[f]]);
    f =
        0;
    for (c = h; f < c; ++f) e = box2d.b2SubVV(this.m_vertices[(f + 1) % c], this.m_vertices[f], box2d.b2Vec2.s_t0), box2d.ENABLE_ASSERTS && box2d.b2Assert(e.GetLengthSquared() > box2d.b2_epsilon_sq), box2d.b2CrossVOne(e, this.m_normals[f]).SelfNormalize();
    box2d.b2PolygonShape.ComputeCentroid(this.m_vertices, h, this.m_centroid);
    return this
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "Set", box2d.b2PolygonShape.prototype.Set);
box2d.b2PolygonShape.prototype.Set.s_ps = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
box2d.b2PolygonShape.prototype.Set.s_hull = box2d.b2MakeNumberArray(box2d.b2_maxPolygonVertices);
box2d.b2PolygonShape.prototype.Set.s_r = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.Set.s_v = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.SetAsVector = function (a, b) {
    this.Set(a, b);
    return this
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "SetAsVector", box2d.b2PolygonShape.prototype.SetAsVector);
box2d.b2PolygonShape.prototype.SetAsArray = function (a, b) {
    this.Set(a, b);
    return this
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "SetAsArray", box2d.b2PolygonShape.prototype.SetAsArray);
box2d.b2PolygonShape.prototype.GetChildCount = function () {
    return 1
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "GetChildCount", box2d.b2PolygonShape.prototype.GetChildCount);
box2d.b2PolygonShape.prototype.TestPoint = function (a, b) {
    for (var c = box2d.b2MulTXV(a, b, box2d.b2PolygonShape.prototype.TestPoint.s_pLocal), e = 0, d = this.m_count; e < d; ++e)
        if (0 < box2d.b2DotVV(this.m_normals[e], box2d.b2SubVV(c, this.m_vertices[e], box2d.b2Vec2.s_t0))) return !1;
    return !0
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "TestPoint", box2d.b2PolygonShape.prototype.TestPoint);
box2d.b2PolygonShape.prototype.TestPoint.s_pLocal = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.RayCast = function (a, b, c, e) {
    e = box2d.b2MulTXV(c, b.p1, box2d.b2PolygonShape.prototype.RayCast.s_p1);
    for (var d = box2d.b2MulTXV(c, b.p2, box2d.b2PolygonShape.prototype.RayCast.s_p2), d = box2d.b2SubVV(d, e, box2d.b2PolygonShape.prototype.RayCast.s_d), f = 0, g = b.maxFraction, h = -1, l = 0, k = this.m_count; l < k; ++l) {
        var m = box2d.b2DotVV(this.m_normals[l], box2d.b2SubVV(this.m_vertices[l], e, box2d.b2Vec2.s_t0)),
            n = box2d.b2DotVV(this.m_normals[l], d);
        if (0 === n) {
            if (0 > m) return !1
        } else 0 > n && m < f * n ? (f = m / n, h =
            l) : 0 < n && m < g * n && (g = m / n); if (g < f) return !1
    }
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= f && f <= b.maxFraction);
    return 0 <= h ? (a.fraction = f, box2d.b2MulRV(c.q, this.m_normals[h], a.normal), !0) : !1
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "RayCast", box2d.b2PolygonShape.prototype.RayCast);
box2d.b2PolygonShape.prototype.RayCast.s_p1 = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.RayCast.s_p2 = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.RayCast.s_d = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeAABB = function (a, b, c) {
    c = box2d.b2MulXV(b, this.m_vertices[0], a.lowerBound);
    a = a.upperBound.Copy(c);
    for (var e = 0, d = this.m_count; e < d; ++e) {
        var f = box2d.b2MulXV(b, this.m_vertices[e], box2d.b2PolygonShape.prototype.ComputeAABB.s_v);
        box2d.b2MinV(f, c, c);
        box2d.b2MaxV(f, a, a)
    }
    b = this.m_radius;
    c.SelfSubXY(b, b);
    a.SelfAddXY(b, b)
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "ComputeAABB", box2d.b2PolygonShape.prototype.ComputeAABB);
box2d.b2PolygonShape.prototype.ComputeAABB.s_v = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeMass = function (a, b) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= this.m_count);
    for (var c = box2d.b2PolygonShape.prototype.ComputeMass.s_center.SetZero(), e = 0, d = 0, f = box2d.b2PolygonShape.prototype.ComputeMass.s_s.SetZero(), g = 0, h = this.m_count; g < h; ++g) f.SelfAdd(this.m_vertices[g]);
    f.SelfMul(1 / this.m_count);
    for (var l = 1 / 3, g = 0, h = this.m_count; g < h; ++g) {
        var k = box2d.b2SubVV(this.m_vertices[g], f, box2d.b2PolygonShape.prototype.ComputeMass.s_e1),
            m = box2d.b2SubVV(this.m_vertices[(g + 1) %
                h], f, box2d.b2PolygonShape.prototype.ComputeMass.s_e2),
            n = box2d.b2CrossVV(k, m),
            p = 0.5 * n,
            e = e + p;
        c.SelfAdd(box2d.b2MulSV(p * l, box2d.b2AddVV(k, m, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t1));
        var p = k.x,
            k = k.y,
            q = m.x,
            m = m.y,
            d = d + 0.25 * l * n * (p * p + q * p + q * q + (k * k + m * k + m * m))
    }
    a.mass = b * e;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(e > box2d.b2_epsilon);
    c.SelfMul(1 / e);
    box2d.b2AddVV(c, f, a.center);
    a.I = b * d;
    a.I += a.mass * (box2d.b2DotVV(a.center, a.center) - box2d.b2DotVV(c, c))
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "ComputeMass", box2d.b2PolygonShape.prototype.ComputeMass);
box2d.b2PolygonShape.prototype.ComputeMass.s_center = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeMass.s_s = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeMass.s_e1 = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeMass.s_e2 = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.Validate = function () {
    for (var a = 0; a < this.m_count; ++a)
        for (var b = a, c = (a + 1) % this.m_count, e = this.m_vertices[b], d = box2d.b2SubVV(this.m_vertices[c], e, box2d.b2PolygonShape.prototype.Validate.s_e), f = 0; f < this.m_count; ++f)
            if (f !== b && f !== c) {
                var g = box2d.b2SubVV(this.m_vertices[f], e, box2d.b2PolygonShape.prototype.Validate.s_v);
                if (0 > box2d.b2CrossVV(d, g)) return !1
            }
    return !0
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "Validate", box2d.b2PolygonShape.prototype.Validate);
box2d.b2PolygonShape.prototype.Validate.s_e = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.Validate.s_v = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.SetupDistanceProxy = function (a, b) {
    a.m_vertices = this.m_vertices;
    a.m_count = this.m_count;
    a.m_radius = this.m_radius
};
box2d.b2PolygonShape.prototype.ComputeSubmergedArea = function (a, b, c, e) {
    var d = box2d.b2MulTRV(c.q, a, box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_normalL),
        f = b - box2d.b2DotVV(a, c.p),
        g = box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_depths,
        h = 0,
        l = -1;
    b = -1;
    var k = !1;
    a = 0;
    for (var m = this.m_count; a < m; ++a) {
        g[a] = box2d.b2DotVV(d, this.m_vertices[a]) - f;
        var n = g[a] < -box2d.b2_epsilon;
        0 < a && (n ? k || (l = a - 1, h++) : k && (b = a - 1, h++));
        k = n
    }
    switch (h) {
    case 0:
        return k ? (a = box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_md,
            this.ComputeMass(a, 1), box2d.b2MulXV(c, a.center, e), a.mass) : 0;
    case 1:
        -1 === l ? l = this.m_count - 1 : b = this.m_count - 1
    }
    a = (l + 1) % this.m_count;
    d = (b + 1) % this.m_count;
    f = (0 - g[l]) / (g[a] - g[l]);
    g = (0 - g[b]) / (g[d] - g[b]);
    l = box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_intoVec.SetXY(this.m_vertices[l].x * (1 - f) + this.m_vertices[a].x * f, this.m_vertices[l].y * (1 - f) + this.m_vertices[a].y * f);
    b = box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_outoVec.SetXY(this.m_vertices[b].x * (1 - g) + this.m_vertices[d].x * g, this.m_vertices[b].y *
        (1 - g) + this.m_vertices[d].y * g);
    g = 0;
    f = box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_center.SetZero();
    h = this.m_vertices[a];
    for (k = null; a !== d;) a = (a + 1) % this.m_count, k = a === d ? b : this.m_vertices[a], m = 0.5 * ((h.x - l.x) * (k.y - l.y) - (h.y - l.y) * (k.x - l.x)), g += m, f.x += m * (l.x + h.x + k.x) / 3, f.y += m * (l.y + h.y + k.y) / 3, h = k;
    f.SelfMul(1 / g);
    box2d.b2MulXV(c, f, e);
    return g
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "ComputeSubmergedArea", box2d.b2PolygonShape.prototype.ComputeSubmergedArea);
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_normalL = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_depths = box2d.b2MakeNumberArray(box2d.b2_maxPolygonVertices);
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_md = new box2d.b2MassData;
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_intoVec = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_outoVec = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.ComputeSubmergedArea.s_center = new box2d.b2Vec2;
box2d.b2PolygonShape.prototype.Dump = function () {
    box2d.b2Log("    /*box2d.b2PolygonShape*/ var shape = new box2d.b2PolygonShape();\n");
    box2d.b2Log("    /*box2d.b2Vec2[]*/ var vs = box2d.b2Vec2.MakeArray(%d);\n", box2d.b2_maxPolygonVertices);
    for (var a = 0; a < this.m_count; ++a) box2d.b2Log("    vs[%d].SetXY(%.15f, %.15f);\n", a, this.m_vertices[a].x, this.m_vertices[a].y);
    box2d.b2Log("    shape.Set(vs, %d);\n", this.m_count)
};
goog.exportProperty(box2d.b2PolygonShape.prototype, "Dump", box2d.b2PolygonShape.prototype.Dump);
box2d.b2PolygonShape.ComputeCentroid = function (a, b, c) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= b);
    c.SetZero();
    for (var e = 0, d = box2d.b2PolygonShape.ComputeCentroid.s_pRef.SetZero(), f = 1 / 3, g = 0; g < b; ++g) {
        var h = d,
            l = a[g],
            k = a[(g + 1) % b],
            m = box2d.b2SubVV(l, h, box2d.b2PolygonShape.ComputeCentroid.s_e1),
            n = box2d.b2SubVV(k, h, box2d.b2PolygonShape.ComputeCentroid.s_e2),
            m = 0.5 * box2d.b2CrossVV(m, n),
            e = e + m;
        c.x += m * f * (h.x + l.x + k.x);
        c.y += m * f * (h.y + l.y + k.y)
    }
    box2d.ENABLE_ASSERTS && box2d.b2Assert(e > box2d.b2_epsilon);
    c.SelfMul(1 / e);
    return c
};
goog.exportProperty(box2d.b2PolygonShape, "ComputeCentroid", box2d.b2PolygonShape.ComputeCentroid);
box2d.b2PolygonShape.ComputeCentroid.s_pRef = new box2d.b2Vec2;
box2d.b2PolygonShape.ComputeCentroid.s_e1 = new box2d.b2Vec2;
box2d.b2PolygonShape.ComputeCentroid.s_e2 = new box2d.b2Vec2;
box2d.b2CollideEdge = {};
box2d.b2CollideEdgeAndCircle = function (a, b, c, e, d) {
    a.pointCount = 0;
    c = box2d.b2MulTXV(c, box2d.b2MulXV(d, e.m_p, box2d.b2Vec2.s_t0), box2d.b2CollideEdgeAndCircle.s_Q);
    var f = b.m_vertex1,
        g = b.m_vertex2,
        h = box2d.b2SubVV(g, f, box2d.b2CollideEdgeAndCircle.s_e),
        l = box2d.b2DotVV(h, box2d.b2SubVV(g, c, box2d.b2Vec2.s_t0)),
        k = box2d.b2DotVV(h, box2d.b2SubVV(c, f, box2d.b2Vec2.s_t0)),
        m = b.m_radius + e.m_radius;
    d = box2d.b2CollideEdgeAndCircle.s_id;
    d.cf.indexB = 0;
    d.cf.typeB = box2d.b2ContactFeatureType.e_vertex;
    if (0 >= k) {
        var n = f,
            l = box2d.b2SubVV(c,
                n, box2d.b2CollideEdgeAndCircle.s_d),
            l = box2d.b2DotVV(l, l);
        if (!(l > m * m)) {
            if (b.m_hasVertex0 && (b = box2d.b2SubVV(f, b.m_vertex0, box2d.b2CollideEdgeAndCircle.s_e1), 0 < box2d.b2DotVV(b, box2d.b2SubVV(f, c, box2d.b2Vec2.s_t0)))) return;
            d.cf.indexA = 0;
            d.cf.typeA = box2d.b2ContactFeatureType.e_vertex;
            a.pointCount = 1;
            a.type = box2d.b2ManifoldType.e_circles;
            a.localNormal.SetZero();
            a.localPoint.Copy(n);
            a.points[0].id.Copy(d);
            a.points[0].localPoint.Copy(e.m_p)
        }
    } else if (0 >= l) {
        if (n = g, l = box2d.b2SubVV(c, n, box2d.b2CollideEdgeAndCircle.s_d),
            l = box2d.b2DotVV(l, l), !(l > m * m)) {
            if (b.m_hasVertex3 && (f = box2d.b2SubVV(b.m_vertex3, g, box2d.b2CollideEdgeAndCircle.s_e2), 0 < box2d.b2DotVV(f, box2d.b2SubVV(c, g, box2d.b2Vec2.s_t0)))) return;
            d.cf.indexA = 1;
            d.cf.typeA = box2d.b2ContactFeatureType.e_vertex;
            a.pointCount = 1;
            a.type = box2d.b2ManifoldType.e_circles;
            a.localNormal.SetZero();
            a.localPoint.Copy(n);
            a.points[0].id.Copy(d);
            a.points[0].localPoint.Copy(e.m_p)
        }
    } else b = box2d.b2DotVV(h, h), box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < b), n = box2d.b2CollideEdgeAndCircle.s_P,
    n.x = 1 / b * (l * f.x + k * g.x), n.y = 1 / b * (l * f.y + k * g.y), l = box2d.b2SubVV(c, n, box2d.b2CollideEdgeAndCircle.s_d), l = box2d.b2DotVV(l, l), l > m * m || (n = box2d.b2CollideEdgeAndCircle.s_n.SetXY(-h.y, h.x), 0 > box2d.b2DotVV(n, box2d.b2SubVV(c, f, box2d.b2Vec2.s_t0)) && n.SetXY(-n.x, -n.y), n.Normalize(), d.cf.indexA = 0, d.cf.typeA = box2d.b2ContactFeatureType.e_face, a.pointCount = 1, a.type = box2d.b2ManifoldType.e_faceA, a.localNormal.Copy(n), a.localPoint.Copy(f), a.points[0].id.Copy(d), a.points[0].localPoint.Copy(e.m_p))
};
goog.exportSymbol("box2d.b2CollideEdgeAndCircle", box2d.b2CollideEdgeAndCircle);
box2d.b2CollideEdgeAndCircle.s_Q = new box2d.b2Vec2;
box2d.b2CollideEdgeAndCircle.s_e = new box2d.b2Vec2;
box2d.b2CollideEdgeAndCircle.s_d = new box2d.b2Vec2;
box2d.b2CollideEdgeAndCircle.s_e1 = new box2d.b2Vec2;
box2d.b2CollideEdgeAndCircle.s_e2 = new box2d.b2Vec2;
box2d.b2CollideEdgeAndCircle.s_P = new box2d.b2Vec2;
box2d.b2CollideEdgeAndCircle.s_n = new box2d.b2Vec2;
box2d.b2CollideEdgeAndCircle.s_id = new box2d.b2ContactID;
box2d.b2EPAxisType = {
    e_unknown: 0,
    e_edgeA: 1,
    e_edgeB: 2
};
goog.exportSymbol("box2d.b2EPAxisType", box2d.b2EPAxisType);
goog.exportProperty(box2d.b2EPAxisType, "e_unknown", box2d.b2EPAxisType.e_unknown);
goog.exportProperty(box2d.b2EPAxisType, "e_edgeA", box2d.b2EPAxisType.e_edgeA);
goog.exportProperty(box2d.b2EPAxisType, "e_edgeB", box2d.b2EPAxisType.e_edgeB);
box2d.b2EPAxis = function () {};
goog.exportSymbol("box2d.b2EPAxis", box2d.b2EPAxis);
box2d.b2EPAxis.prototype.type = box2d.b2EPAxisType.e_unknown;
goog.exportProperty(box2d.b2EPAxis.prototype, "type", box2d.b2EPAxis.prototype.type);
box2d.b2EPAxis.prototype.index = 0;
goog.exportProperty(box2d.b2EPAxis.prototype, "index", box2d.b2EPAxis.prototype.index);
box2d.b2EPAxis.prototype.separation = 0;
goog.exportProperty(box2d.b2EPAxis.prototype, "separation", box2d.b2EPAxis.prototype.separation);
box2d.b2TempPolygon = function () {
    this.vertices = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
    this.normals = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
    this.count = 0
};
goog.exportSymbol("box2d.b2TempPolygon", box2d.b2TempPolygon);
box2d.b2TempPolygon.prototype.vertices = null;
goog.exportProperty(box2d.b2TempPolygon.prototype, "vertices", box2d.b2TempPolygon.prototype.vertices);
box2d.b2TempPolygon.prototype.normals = null;
goog.exportProperty(box2d.b2TempPolygon.prototype, "normals", box2d.b2TempPolygon.prototype.normals);
box2d.b2TempPolygon.prototype.count = 0;
goog.exportProperty(box2d.b2TempPolygon.prototype, "count", box2d.b2TempPolygon.prototype.count);
box2d.b2ReferenceFace = function () {
    this.i2 = this.i1 = 0;
    this.v1 = new box2d.b2Vec2;
    this.v2 = new box2d.b2Vec2;
    this.normal = new box2d.b2Vec2;
    this.sideNormal1 = new box2d.b2Vec2;
    this.sideOffset1 = 0;
    this.sideNormal2 = new box2d.b2Vec2;
    this.sideOffset2 = 0
};
goog.exportSymbol("box2d.b2ReferenceFace", box2d.b2ReferenceFace);
box2d.b2ReferenceFace.prototype.i1 = 0;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "i1", box2d.b2ReferenceFace.prototype.i1);
box2d.b2ReferenceFace.prototype.i2 = 0;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "i2", box2d.b2ReferenceFace.prototype.i2);
box2d.b2ReferenceFace.prototype.v1 = null;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "v1", box2d.b2ReferenceFace.prototype.v1);
box2d.b2ReferenceFace.prototype.v2 = null;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "v2", box2d.b2ReferenceFace.prototype.v2);
box2d.b2ReferenceFace.prototype.normal = null;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "normal", box2d.b2ReferenceFace.prototype.normal);
box2d.b2ReferenceFace.prototype.sideNormal1 = null;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "sideNormal1", box2d.b2ReferenceFace.prototype.sideNormal1);
box2d.b2ReferenceFace.prototype.sideOffset1 = 0;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "sideOffset1", box2d.b2ReferenceFace.prototype.sideOffset1);
box2d.b2ReferenceFace.prototype.sideNormal2 = null;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "sideNormal2", box2d.b2ReferenceFace.prototype.sideNormal2);
box2d.b2ReferenceFace.prototype.sideOffset2 = 0;
goog.exportProperty(box2d.b2ReferenceFace.prototype, "sideOffset2", box2d.b2ReferenceFace.prototype.sideOffset2);
box2d.b2EPColliderVertexType = {
    e_isolated: 0,
    e_concave: 1,
    e_convex: 2
};
goog.exportSymbol("box2d.b2EPColliderVertexType", box2d.b2EPColliderVertexType);
goog.exportProperty(box2d.b2EPColliderVertexType, "e_isolated", box2d.b2EPColliderVertexType.e_isolated);
goog.exportProperty(box2d.b2EPColliderVertexType, "e_concave", box2d.b2EPColliderVertexType.e_concave);
goog.exportProperty(box2d.b2EPColliderVertexType, "e_convex", box2d.b2EPColliderVertexType.e_convex);
box2d.b2EPCollider = function () {
    this.m_polygonB = new box2d.b2TempPolygon;
    this.m_xf = new box2d.b2Transform;
    this.m_centroidB = new box2d.b2Vec2;
    this.m_v0 = new box2d.b2Vec2;
    this.m_v1 = new box2d.b2Vec2;
    this.m_v2 = new box2d.b2Vec2;
    this.m_v3 = new box2d.b2Vec2;
    this.m_normal0 = new box2d.b2Vec2;
    this.m_normal1 = new box2d.b2Vec2;
    this.m_normal2 = new box2d.b2Vec2;
    this.m_normal = new box2d.b2Vec2;
    this.m_type2 = this.m_type1 = box2d.b2EPColliderVertexType.e_isolated;
    this.m_lowerLimit = new box2d.b2Vec2;
    this.m_upperLimit = new box2d.b2Vec2;
    this.m_radius = 0;
    this.m_front = !1
};
goog.exportSymbol("box2d.b2EPCollider", box2d.b2EPCollider);
box2d.b2EPCollider.prototype.m_polygonB = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_polygonB", box2d.b2EPCollider.prototype.m_polygonB);
box2d.b2EPCollider.prototype.m_xf = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_xf", box2d.b2EPCollider.prototype.m_xf);
box2d.b2EPCollider.prototype.m_centroidB = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_centroidB", box2d.b2EPCollider.prototype.m_centroidB);
box2d.b2EPCollider.prototype.m_v0 = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_v0", box2d.b2EPCollider.prototype.m_v0);
box2d.b2EPCollider.prototype.m_v1 = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_v1", box2d.b2EPCollider.prototype.m_v1);
box2d.b2EPCollider.prototype.m_v2 = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_v2", box2d.b2EPCollider.prototype.m_v2);
box2d.b2EPCollider.prototype.m_v3 = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_v3", box2d.b2EPCollider.prototype.m_v3);
box2d.b2EPCollider.prototype.m_normal0 = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_normal0", box2d.b2EPCollider.prototype.m_normal0);
box2d.b2EPCollider.prototype.m_normal1 = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_normal1", box2d.b2EPCollider.prototype.m_normal1);
box2d.b2EPCollider.prototype.m_normal2 = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_normal2", box2d.b2EPCollider.prototype.m_normal2);
box2d.b2EPCollider.prototype.m_normal = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_normal", box2d.b2EPCollider.prototype.m_normal);
box2d.b2EPCollider.prototype.m_type1 = box2d.b2EPColliderVertexType.e_isolated;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_type1", box2d.b2EPCollider.prototype.m_type1);
box2d.b2EPCollider.prototype.m_type2 = box2d.b2EPColliderVertexType.e_isolated;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_type2", box2d.b2EPCollider.prototype.m_type2);
box2d.b2EPCollider.prototype.m_lowerLimit = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_lowerLimit", box2d.b2EPCollider.prototype.m_lowerLimit);
box2d.b2EPCollider.prototype.m_upperLimit = null;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_upperLimit", box2d.b2EPCollider.prototype.m_upperLimit);
box2d.b2EPCollider.prototype.m_radius = 0;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_radius", box2d.b2EPCollider.prototype.m_radius);
box2d.b2EPCollider.prototype.m_front = !1;
goog.exportProperty(box2d.b2EPCollider.prototype, "m_front", box2d.b2EPCollider.prototype.m_front);
box2d.b2EPCollider.prototype.Collide = function (a, b, c, e, d) {
    box2d.b2MulTXX(c, d, this.m_xf);
    box2d.b2MulXV(this.m_xf, e.m_centroid, this.m_centroidB);
    this.m_v0.Copy(b.m_vertex0);
    this.m_v1.Copy(b.m_vertex1);
    this.m_v2.Copy(b.m_vertex2);
    this.m_v3.Copy(b.m_vertex3);
    c = b.m_hasVertex0;
    b = b.m_hasVertex3;
    d = box2d.b2SubVV(this.m_v2, this.m_v1, box2d.b2EPCollider.s_edge1);
    d.Normalize();
    this.m_normal1.SetXY(d.y, -d.x);
    var f = box2d.b2DotVV(this.m_normal1, box2d.b2SubVV(this.m_centroidB, this.m_v1, box2d.b2Vec2.s_t0)),
        g = 0,
        h = 0,
        l = !1,
        k = !1;
    c && (g = box2d.b2SubVV(this.m_v1, this.m_v0, box2d.b2EPCollider.s_edge0), g.Normalize(), this.m_normal0.SetXY(g.y, -g.x), l = 0 <= box2d.b2CrossVV(g, d), g = box2d.b2DotVV(this.m_normal0, box2d.b2SubVV(this.m_centroidB, this.m_v0, box2d.b2Vec2.s_t0)));
    b && (h = box2d.b2SubVV(this.m_v3, this.m_v2, box2d.b2EPCollider.s_edge2), h.Normalize(), this.m_normal2.SetXY(h.y, -h.x), k = 0 < box2d.b2CrossVV(d, h), h = box2d.b2DotVV(this.m_normal2, box2d.b2SubVV(this.m_centroidB, this.m_v2, box2d.b2Vec2.s_t0)));
    c && b ? l && k ? (this.m_front = 0 <= g ||
        0 <= f || 0 <= h) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal0), this.m_upperLimit.Copy(this.m_normal2)) : (this.m_normal.Copy(this.m_normal1).SelfNeg(), this.m_lowerLimit.Copy(this.m_normal1).SelfNeg(), this.m_upperLimit.Copy(this.m_normal1).SelfNeg()) : l ? (this.m_front = 0 <= g || 0 <= f && 0 <= h) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal0), this.m_upperLimit.Copy(this.m_normal1)) : (this.m_normal.Copy(this.m_normal1).SelfNeg(), this.m_lowerLimit.Copy(this.m_normal2).SelfNeg(),
        this.m_upperLimit.Copy(this.m_normal1).SelfNeg()) : k ? (this.m_front = 0 <= h || 0 <= g && 0 <= f) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal1), this.m_upperLimit.Copy(this.m_normal2)) : (this.m_normal.Copy(this.m_normal1).SelfNeg(), this.m_lowerLimit.Copy(this.m_normal1).SelfNeg(), this.m_upperLimit.Copy(this.m_normal0).SelfNeg()) : (this.m_front = 0 <= g && 0 <= f && 0 <= h) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal1), this.m_upperLimit.Copy(this.m_normal1)) : (this.m_normal.Copy(this.m_normal1).SelfNeg(),
        this.m_lowerLimit.Copy(this.m_normal2).SelfNeg(), this.m_upperLimit.Copy(this.m_normal0).SelfNeg()) : c ? l ? ((this.m_front = 0 <= g || 0 <= f) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal0)) : (this.m_normal.Copy(this.m_normal1).SelfNeg(), this.m_lowerLimit.Copy(this.m_normal1)), this.m_upperLimit.Copy(this.m_normal1).SelfNeg()) : (this.m_front = 0 <= g && 0 <= f) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal1), this.m_upperLimit.Copy(this.m_normal1).SelfNeg()) : (this.m_normal.Copy(this.m_normal1).SelfNeg(),
        this.m_lowerLimit.Copy(this.m_normal1), this.m_upperLimit.Copy(this.m_normal0).SelfNeg()) : b ? k ? (this.m_front = 0 <= f || 0 <= h) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal1).SelfNeg(), this.m_upperLimit.Copy(this.m_normal2)) : (this.m_normal.Copy(this.m_normal1).SelfNeg(), this.m_lowerLimit.Copy(this.m_normal1).SelfNeg(), this.m_upperLimit.Copy(this.m_normal1)) : ((this.m_front = 0 <= f && 0 <= h) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal1).SelfNeg()) : (this.m_normal.Copy(this.m_normal1).SelfNeg(),
        this.m_lowerLimit.Copy(this.m_normal2).SelfNeg()), this.m_upperLimit.Copy(this.m_normal1)) : (this.m_front = 0 <= f) ? (this.m_normal.Copy(this.m_normal1), this.m_lowerLimit.Copy(this.m_normal1).SelfNeg(), this.m_upperLimit.Copy(this.m_normal1).SelfNeg()) : (this.m_normal.Copy(this.m_normal1).SelfNeg(), this.m_lowerLimit.Copy(this.m_normal1), this.m_upperLimit.Copy(this.m_normal1));
    this.m_polygonB.count = e.m_count;
    f = 0;
    for (g = e.m_count; f < g; ++f) box2d.b2MulXV(this.m_xf, e.m_vertices[f], this.m_polygonB.vertices[f]), box2d.b2MulRV(this.m_xf.q,
        e.m_normals[f], this.m_polygonB.normals[f]);
    this.m_radius = 2 * box2d.b2_polygonRadius;
    a.pointCount = 0;
    c = this.ComputeEdgeSeparation(box2d.b2EPCollider.s_edgeAxis);
    if (!(c.type === box2d.b2EPAxisType.e_unknown || c.separation > this.m_radius || (b = this.ComputePolygonSeparation(box2d.b2EPCollider.s_polygonAxis), b.type !== box2d.b2EPAxisType.e_unknown && b.separation > this.m_radius))) {
        c = b.type === box2d.b2EPAxisType.e_unknown ? c : b.separation > 0.98 * c.separation + 0.001 ? b : c;
        d = box2d.b2EPCollider.s_ie;
        b = box2d.b2EPCollider.s_rf;
        if (c.type ===
            box2d.b2EPAxisType.e_edgeA) {
            a.type = box2d.b2ManifoldType.e_faceA;
            h = 0;
            l = box2d.b2DotVV(this.m_normal, this.m_polygonB.normals[0]);
            f = 1;
            for (g = this.m_polygonB.count; f < g; ++f) k = box2d.b2DotVV(this.m_normal, this.m_polygonB.normals[f]), k < l && (l = k, h = f);
            g = h;
            f = (g + 1) % this.m_polygonB.count;
            h = d[0];
            h.v.Copy(this.m_polygonB.vertices[g]);
            h.id.cf.indexA = 0;
            h.id.cf.indexB = g;
            h.id.cf.typeA = box2d.b2ContactFeatureType.e_face;
            h.id.cf.typeB = box2d.b2ContactFeatureType.e_vertex;
            g = d[1];
            g.v.Copy(this.m_polygonB.vertices[f]);
            g.id.cf.indexA =
                0;
            g.id.cf.indexB = f;
            g.id.cf.typeA = box2d.b2ContactFeatureType.e_face;
            g.id.cf.typeB = box2d.b2ContactFeatureType.e_vertex;
            this.m_front ? (b.i1 = 0, b.i2 = 1, b.v1.Copy(this.m_v1), b.v2.Copy(this.m_v2), b.normal.Copy(this.m_normal1)) : (b.i1 = 1, b.i2 = 0, b.v1.Copy(this.m_v2), b.v2.Copy(this.m_v1), b.normal.Copy(this.m_normal1).SelfNeg())
        } else a.type = box2d.b2ManifoldType.e_faceB, h = d[0], h.v.Copy(this.m_v1), h.id.cf.indexA = 0, h.id.cf.indexB = c.index, h.id.cf.typeA = box2d.b2ContactFeatureType.e_vertex, h.id.cf.typeB = box2d.b2ContactFeatureType.e_face,
        g = d[1], g.v.Copy(this.m_v2), g.id.cf.indexA = 0, g.id.cf.indexB = c.index, g.id.cf.typeA = box2d.b2ContactFeatureType.e_vertex, g.id.cf.typeB = box2d.b2ContactFeatureType.e_face, b.i1 = c.index, b.i2 = (b.i1 + 1) % this.m_polygonB.count, b.v1.Copy(this.m_polygonB.vertices[b.i1]), b.v2.Copy(this.m_polygonB.vertices[b.i2]), b.normal.Copy(this.m_polygonB.normals[b.i1]);
        b.sideNormal1.SetXY(b.normal.y, -b.normal.x);
        b.sideNormal2.Copy(b.sideNormal1).SelfNeg();
        b.sideOffset1 = box2d.b2DotVV(b.sideNormal1, b.v1);
        b.sideOffset2 = box2d.b2DotVV(b.sideNormal2,
            b.v2);
        f = box2d.b2EPCollider.s_clipPoints1;
        h = box2d.b2EPCollider.s_clipPoints2;
        g = 0;
        g = box2d.b2ClipSegmentToLine(f, d, b.sideNormal1, b.sideOffset1, b.i1);
        if (!(g < box2d.b2_maxManifoldPoints || (g = box2d.b2ClipSegmentToLine(h, f, b.sideNormal2, b.sideOffset2, b.i2), g < box2d.b2_maxManifoldPoints))) {
            c.type === box2d.b2EPAxisType.e_edgeA ? (a.localNormal.Copy(b.normal), a.localPoint.Copy(b.v1)) : (a.localNormal.Copy(e.m_normals[b.i1]), a.localPoint.Copy(e.m_vertices[b.i1]));
            f = e = 0;
            for (g = box2d.b2_maxManifoldPoints; f < g; ++f) box2d.b2DotVV(b.normal,
                box2d.b2SubVV(h[f].v, b.v1, box2d.b2Vec2.s_t0)) <= this.m_radius && (d = a.points[e], c.type === box2d.b2EPAxisType.e_edgeA ? (box2d.b2MulTXV(this.m_xf, h[f].v, d.localPoint), d.id = h[f].id) : (d.localPoint.Copy(h[f].v), d.id.cf.typeA = h[f].id.cf.typeB, d.id.cf.typeB = h[f].id.cf.typeA, d.id.cf.indexA = h[f].id.cf.indexB, d.id.cf.indexB = h[f].id.cf.indexA), ++e);
            a.pointCount = e
        }
    }
};
goog.exportProperty(box2d.b2EPCollider.prototype, "Collide", box2d.b2EPCollider.prototype.Collide);
box2d.b2EPCollider.s_edge1 = new box2d.b2Vec2;
box2d.b2EPCollider.s_edge0 = new box2d.b2Vec2;
box2d.b2EPCollider.s_edge2 = new box2d.b2Vec2;
box2d.b2EPCollider.s_ie = box2d.b2ClipVertex.MakeArray(2);
box2d.b2EPCollider.s_rf = new box2d.b2ReferenceFace;
box2d.b2EPCollider.s_clipPoints1 = box2d.b2ClipVertex.MakeArray(2);
box2d.b2EPCollider.s_clipPoints2 = box2d.b2ClipVertex.MakeArray(2);
box2d.b2EPCollider.s_edgeAxis = new box2d.b2EPAxis;
box2d.b2EPCollider.s_polygonAxis = new box2d.b2EPAxis;
box2d.b2EPCollider.prototype.ComputeEdgeSeparation = function (a) {
    a.type = box2d.b2EPAxisType.e_edgeA;
    a.index = this.m_front ? 0 : 1;
    a.separation = box2d.b2_maxFloat;
    for (var b = 0, c = this.m_polygonB.count; b < c; ++b) {
        var e = box2d.b2DotVV(this.m_normal, box2d.b2SubVV(this.m_polygonB.vertices[b], this.m_v1, box2d.b2Vec2.s_t0));
        e < a.separation && (a.separation = e)
    }
    return a
};
goog.exportProperty(box2d.b2EPCollider.prototype, "ComputeEdgeSeparation", box2d.b2EPCollider.prototype.ComputeEdgeSeparation);
box2d.b2EPCollider.prototype.ComputePolygonSeparation = function (a) {
    a.type = box2d.b2EPAxisType.e_unknown;
    a.index = -1;
    a.separation = -box2d.b2_maxFloat;
    for (var b = box2d.b2EPCollider.s_perp.SetXY(-this.m_normal.y, this.m_normal.x), c = 0, e = this.m_polygonB.count; c < e; ++c) {
        var d = box2d.b2NegV(this.m_polygonB.normals[c], box2d.b2EPCollider.s_n),
            f = box2d.b2DotVV(d, box2d.b2SubVV(this.m_polygonB.vertices[c], this.m_v1, box2d.b2Vec2.s_t0)),
            g = box2d.b2DotVV(d, box2d.b2SubVV(this.m_polygonB.vertices[c], this.m_v2, box2d.b2Vec2.s_t0)),
            f = box2d.b2Min(f, g);
        if (f > this.m_radius) {
            a.type = box2d.b2EPAxisType.e_edgeB;
            a.index = c;
            a.separation = f;
            break
        }
        if (0 <= box2d.b2DotVV(d, b)) {
            if (box2d.b2DotVV(box2d.b2SubVV(d, this.m_upperLimit, box2d.b2Vec2.s_t0), this.m_normal) < -box2d.b2_angularSlop) continue
        } else if (box2d.b2DotVV(box2d.b2SubVV(d, this.m_lowerLimit, box2d.b2Vec2.s_t0), this.m_normal) < -box2d.b2_angularSlop) continue;
        f > a.separation && (a.type = box2d.b2EPAxisType.e_edgeB, a.index = c, a.separation = f)
    }
    return a
};
goog.exportProperty(box2d.b2EPCollider.prototype, "ComputePolygonSeparation", box2d.b2EPCollider.prototype.ComputePolygonSeparation);
box2d.b2EPCollider.s_n = new box2d.b2Vec2;
box2d.b2EPCollider.s_perp = new box2d.b2Vec2;
box2d.b2CollideEdgeAndPolygon = function (a, b, c, e, d) {
    box2d.b2CollideEdgeAndPolygon.s_collider.Collide(a, b, c, e, d)
};
goog.exportSymbol("box2d.b2CollideEdgeAndPolygon", box2d.b2CollideEdgeAndPolygon);
box2d.b2CollideEdgeAndPolygon.s_collider = new box2d.b2EPCollider;
box2d.b2EdgeShape = function () {
    box2d.b2Shape.call(this, box2d.b2ShapeType.e_edgeShape, box2d.b2_polygonRadius);
    this.m_vertex1 = new box2d.b2Vec2;
    this.m_vertex2 = new box2d.b2Vec2;
    this.m_vertex0 = new box2d.b2Vec2;
    this.m_vertex3 = new box2d.b2Vec2
};
goog.inherits(box2d.b2EdgeShape, box2d.b2Shape);
goog.exportSymbol("box2d.b2EdgeShape", box2d.b2EdgeShape);
box2d.b2EdgeShape.prototype.m_vertex1 = null;
goog.exportProperty(box2d.b2EdgeShape.prototype, "m_vertex1", box2d.b2EdgeShape.prototype.m_vertex1);
box2d.b2EdgeShape.prototype.m_vertex2 = null;
goog.exportProperty(box2d.b2EdgeShape.prototype, "m_vertex2", box2d.b2EdgeShape.prototype.m_vertex2);
box2d.b2EdgeShape.prototype.m_vertex0 = null;
goog.exportProperty(box2d.b2EdgeShape.prototype, "m_vertex0", box2d.b2EdgeShape.prototype.m_vertex0);
box2d.b2EdgeShape.prototype.m_vertex3 = null;
goog.exportProperty(box2d.b2EdgeShape.prototype, "m_vertex3", box2d.b2EdgeShape.prototype.m_vertex3);
box2d.b2EdgeShape.prototype.m_hasVertex0 = !1;
goog.exportProperty(box2d.b2EdgeShape.prototype, "m_hasVertex0", box2d.b2EdgeShape.prototype.m_hasVertex0);
box2d.b2EdgeShape.prototype.m_hasVertex3 = !1;
goog.exportProperty(box2d.b2EdgeShape.prototype, "m_hasVertex3", box2d.b2EdgeShape.prototype.m_hasVertex3);
box2d.b2EdgeShape.prototype.Set = function (a, b) {
    this.m_vertex1.Copy(a);
    this.m_vertex2.Copy(b);
    this.m_hasVertex3 = this.m_hasVertex0 = !1;
    return this
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "Set", box2d.b2EdgeShape.prototype.Set);
box2d.b2EdgeShape.prototype.SetAsEdge = box2d.b2EdgeShape.prototype.Set;
box2d.b2EdgeShape.prototype.Clone = function () {
    return (new box2d.b2EdgeShape).Copy(this)
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "Clone", box2d.b2EdgeShape.prototype.Clone);
box2d.b2EdgeShape.prototype.Copy = function (a) {
    box2d.b2EdgeShape.superClass_.Copy.call(this, a);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a instanceof box2d.b2EdgeShape);
    this.m_vertex1.Copy(a.m_vertex1);
    this.m_vertex2.Copy(a.m_vertex2);
    this.m_vertex0.Copy(a.m_vertex0);
    this.m_vertex3.Copy(a.m_vertex3);
    this.m_hasVertex0 = a.m_hasVertex0;
    this.m_hasVertex3 = a.m_hasVertex3;
    return this
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "Copy", box2d.b2EdgeShape.prototype.Copy);
box2d.b2EdgeShape.prototype.GetChildCount = function () {
    return 1
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "GetChildCount", box2d.b2EdgeShape.prototype.GetChildCount);
box2d.b2EdgeShape.prototype.TestPoint = function (a, b) {
    return !1
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "TestPoint", box2d.b2EdgeShape.prototype.TestPoint);
box2d.b2EdgeShape.prototype.RayCast = function (a, b, c, e) {
    var d = box2d.b2MulTXV(c, b.p1, box2d.b2EdgeShape.prototype.RayCast.s_p1);
    e = box2d.b2MulTXV(c, b.p2, box2d.b2EdgeShape.prototype.RayCast.s_p2);
    var f = box2d.b2SubVV(e, d, box2d.b2EdgeShape.prototype.RayCast.s_d);
    e = this.m_vertex1;
    var g = this.m_vertex2,
        h = box2d.b2SubVV(g, e, box2d.b2EdgeShape.prototype.RayCast.s_e),
        l = a.normal.SetXY(h.y, -h.x).SelfNormalize(),
        h = box2d.b2DotVV(l, box2d.b2SubVV(e, d, box2d.b2Vec2.s_t0)),
        l = box2d.b2DotVV(l, f);
    if (0 === l) return !1;
    l = h / l;
    if (0 >
        l || b.maxFraction < l) return !1;
    b = box2d.b2AddVMulSV(d, l, f, box2d.b2EdgeShape.prototype.RayCast.s_q);
    d = box2d.b2SubVV(g, e, box2d.b2EdgeShape.prototype.RayCast.s_r);
    g = box2d.b2DotVV(d, d);
    if (0 === g) return !1;
    e = box2d.b2DotVV(box2d.b2SubVV(b, e, box2d.b2Vec2.s_t0), d) / g;
    if (0 > e || 1 < e) return !1;
    a.fraction = l;
    box2d.b2MulRV(c.q, a.normal, a.normal);
    0 < h && a.normal.SelfNeg();
    return !0
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "RayCast", box2d.b2EdgeShape.prototype.RayCast);
box2d.b2EdgeShape.prototype.RayCast.s_p1 = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.RayCast.s_p2 = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.RayCast.s_d = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.RayCast.s_e = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.RayCast.s_q = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.RayCast.s_r = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.ComputeAABB = function (a, b, c) {
    c = box2d.b2MulXV(b, this.m_vertex1, box2d.b2EdgeShape.prototype.ComputeAABB.s_v1);
    b = box2d.b2MulXV(b, this.m_vertex2, box2d.b2EdgeShape.prototype.ComputeAABB.s_v2);
    box2d.b2MinV(c, b, a.lowerBound);
    box2d.b2MaxV(c, b, a.upperBound);
    b = this.m_radius;
    a.lowerBound.SelfSubXY(b, b);
    a.upperBound.SelfAddXY(b, b)
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "ComputeAABB", box2d.b2EdgeShape.prototype.ComputeAABB);
box2d.b2EdgeShape.prototype.ComputeAABB.s_v1 = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.ComputeAABB.s_v2 = new box2d.b2Vec2;
box2d.b2EdgeShape.prototype.ComputeMass = function (a, b) {
    a.mass = 0;
    box2d.b2MidVV(this.m_vertex1, this.m_vertex2, a.center);
    a.I = 0
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "ComputeMass", box2d.b2EdgeShape.prototype.ComputeMass);
box2d.b2EdgeShape.prototype.SetupDistanceProxy = function (a, b) {
    a.m_vertices = Array(2);
    a.m_vertices[0] = this.m_vertex1;
    a.m_vertices[1] = this.m_vertex2;
    a.m_count = 2;
    a.m_radius = this.m_radius
};
box2d.b2EdgeShape.prototype.ComputeSubmergedArea = function (a, b, c, e) {
    e.SetZero();
    return 0
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "ComputeSubmergedArea", box2d.b2EdgeShape.prototype.ComputeSubmergedArea);
box2d.b2EdgeShape.prototype.Dump = function () {
    box2d.b2Log("    /*box2d.b2EdgeShape*/ var shape = new box2d.b2EdgeShape();\n");
    box2d.b2Log("    shape.m_radius = %.15f;\n", this.m_radius);
    box2d.b2Log("    shape.m_vertex0.SetXY(%.15f, %.15f);\n", this.m_vertex0.x, this.m_vertex0.y);
    box2d.b2Log("    shape.m_vertex1.SetXY(%.15f, %.15f);\n", this.m_vertex1.x, this.m_vertex1.y);
    box2d.b2Log("    shape.m_vertex2.SetXY(%.15f, %.15f);\n", this.m_vertex2.x, this.m_vertex2.y);
    box2d.b2Log("    shape.m_vertex3.SetXY(%.15f, %.15f);\n",
        this.m_vertex3.x, this.m_vertex3.y);
    box2d.b2Log("    shape.m_hasVertex0 = %s;\n", this.m_hasVertex0);
    box2d.b2Log("    shape.m_hasVertex3 = %s;\n", this.m_hasVertex3)
};
goog.exportProperty(box2d.b2EdgeShape.prototype, "Dump", box2d.b2EdgeShape.prototype.Dump);
box2d.b2ChainShape = function () {
    box2d.b2Shape.call(this, box2d.b2ShapeType.e_chainShape, box2d.b2_polygonRadius);
    this.m_prevVertex = new box2d.b2Vec2;
    this.m_nextVertex = new box2d.b2Vec2
};
goog.inherits(box2d.b2ChainShape, box2d.b2Shape);
goog.exportSymbol("box2d.b2ChainShape", box2d.b2ChainShape);
box2d.b2ChainShape.prototype.m_vertices = null;
goog.exportProperty(box2d.b2ChainShape.prototype, "m_vertices", box2d.b2ChainShape.prototype.m_vertices);
box2d.b2ChainShape.prototype.m_count = 0;
goog.exportProperty(box2d.b2ChainShape.prototype, "m_count", box2d.b2ChainShape.prototype.m_count);
box2d.b2ChainShape.prototype.m_prevVertex = null;
goog.exportProperty(box2d.b2ChainShape.prototype, "m_prevVertex", box2d.b2ChainShape.prototype.m_prevVertex);
box2d.b2ChainShape.prototype.m_nextVertex = null;
goog.exportProperty(box2d.b2ChainShape.prototype, "m_nextVertex", box2d.b2ChainShape.prototype.m_nextVertex);
box2d.b2ChainShape.prototype.m_hasPrevVertex = !1;
goog.exportProperty(box2d.b2ChainShape.prototype, "m_hasPrevVertex", box2d.b2ChainShape.prototype.m_hasPrevVertex);
box2d.b2ChainShape.prototype.m_hasNextVertex = !1;
goog.exportProperty(box2d.b2ChainShape.prototype, "m_hasNextVertex", box2d.b2ChainShape.prototype.m_hasNextVertex);
box2d.b2ChainShape.prototype.CreateLoop = function (a, b) {
    b = b || a.length;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(null === this.m_vertices && 0 === this.m_count);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= b);
    if (box2d.ENABLE_ASSERTS)
        for (var c = 1; c < b; ++c) box2d.b2Assert(box2d.b2DistanceSquaredVV(a[c - 1], a[c]) > box2d.b2_linearSlop * box2d.b2_linearSlop);
    this.m_count = b + 1;
    this.m_vertices = box2d.b2Vec2.MakeArray(this.m_count);
    for (c = 0; c < b; ++c) this.m_vertices[c].Copy(a[c]);
    this.m_vertices[b].Copy(this.m_vertices[0]);
    this.m_prevVertex.Copy(this.m_vertices[this.m_count -
        2]);
    this.m_nextVertex.Copy(this.m_vertices[1]);
    this.m_hasNextVertex = this.m_hasPrevVertex = !0;
    return this
};
goog.exportProperty(box2d.b2ChainShape.prototype, "CreateLoop", box2d.b2ChainShape.prototype.CreateLoop);
box2d.b2ChainShape.prototype.CreateChain = function (a, b) {
    b = b || a.length;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(null === this.m_vertices && 0 === this.m_count);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(2 <= b);
    if (box2d.ENABLE_ASSERTS)
        for (var c = 1; c < b; ++c) box2d.b2Assert(box2d.b2DistanceSquaredVV(a[c - 1], a[c]) > box2d.b2_linearSlop * box2d.b2_linearSlop);
    this.m_count = b;
    this.m_vertices = box2d.b2Vec2.MakeArray(b);
    for (c = 0; c < b; ++c) this.m_vertices[c].Copy(a[c]);
    this.m_hasNextVertex = this.m_hasPrevVertex = !1;
    this.m_prevVertex.SetZero();
    this.m_nextVertex.SetZero();
    return this
};
goog.exportProperty(box2d.b2ChainShape.prototype, "CreateChain", box2d.b2ChainShape.prototype.CreateChain);
box2d.b2ChainShape.prototype.SetPrevVertex = function (a) {
    this.m_prevVertex.Copy(a);
    this.m_hasPrevVertex = !0;
    return this
};
goog.exportProperty(box2d.b2ChainShape.prototype, "SetPrevVertex", box2d.b2ChainShape.prototype.SetPrevVertex);
box2d.b2ChainShape.prototype.SetNextVertex = function (a) {
    this.m_nextVertex.Copy(a);
    this.m_hasNextVertex = !0;
    return this
};
goog.exportProperty(box2d.b2ChainShape.prototype, "SetNextVertex", box2d.b2ChainShape.prototype.SetNextVertex);
box2d.b2ChainShape.prototype.Clone = function () {
    return (new box2d.b2ChainShape).Copy(this)
};
goog.exportProperty(box2d.b2ChainShape.prototype, "Clone", box2d.b2ChainShape.prototype.Clone);
box2d.b2ChainShape.prototype.Copy = function (a) {
    box2d.b2ChainShape.superClass_.Copy.call(this, a);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a instanceof box2d.b2ChainShape);
    this.CreateChain(a.m_vertices, a.m_count);
    this.m_prevVertex.Copy(a.m_prevVertex);
    this.m_nextVertex.Copy(a.m_nextVertex);
    this.m_hasPrevVertex = a.m_hasPrevVertex;
    this.m_hasNextVertex = a.m_hasNextVertex;
    return this
};
goog.exportProperty(box2d.b2ChainShape.prototype, "Copy", box2d.b2ChainShape.prototype.Copy);
box2d.b2ChainShape.prototype.GetChildCount = function () {
    return this.m_count - 1
};
goog.exportProperty(box2d.b2ChainShape.prototype, "GetChildCount", box2d.b2ChainShape.prototype.GetChildCount);
box2d.b2ChainShape.prototype.GetChildEdge = function (a, b) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= b && b < this.m_count - 1);
    a.m_type = box2d.b2ShapeType.e_edgeShape;
    a.m_radius = this.m_radius;
    a.m_vertex1.Copy(this.m_vertices[b]);
    a.m_vertex2.Copy(this.m_vertices[b + 1]);
    0 < b ? (a.m_vertex0.Copy(this.m_vertices[b - 1]), a.m_hasVertex0 = !0) : (a.m_vertex0.Copy(this.m_prevVertex), a.m_hasVertex0 = this.m_hasPrevVertex);
    b < this.m_count - 2 ? (a.m_vertex3.Copy(this.m_vertices[b + 2]), a.m_hasVertex3 = !0) : (a.m_vertex3.Copy(this.m_nextVertex),
        a.m_hasVertex3 = this.m_hasNextVertex)
};
goog.exportProperty(box2d.b2ChainShape.prototype, "GetChildEdge", box2d.b2ChainShape.prototype.GetChildEdge);
box2d.b2ChainShape.prototype.TestPoint = function (a, b) {
    return !1
};
goog.exportProperty(box2d.b2ChainShape.prototype, "TestPoint", box2d.b2ChainShape.prototype.TestPoint);
box2d.b2ChainShape.prototype.RayCast = function (a, b, c, e) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(e < this.m_count);
    var d = box2d.b2ChainShape.s_edgeShape;
    d.m_vertex1.Copy(this.m_vertices[e]);
    d.m_vertex2.Copy(this.m_vertices[(e + 1) % this.m_count]);
    return d.RayCast(a, b, c, 0)
};
goog.exportProperty(box2d.b2ChainShape.prototype, "RayCast", box2d.b2ChainShape.prototype.RayCast);
box2d.b2ChainShape.s_edgeShape = new box2d.b2EdgeShape;
goog.exportProperty(box2d.b2ChainShape, "s_edgeShape", box2d.b2ChainShape.s_edgeShape);
box2d.b2ChainShape.prototype.ComputeAABB = function (a, b, c) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(c < this.m_count);
    var e = this.m_vertices[(c + 1) % this.m_count];
    c = box2d.b2MulXV(b, this.m_vertices[c], box2d.b2ChainShape.prototype.ComputeAABB.s_v1);
    b = box2d.b2MulXV(b, e, box2d.b2ChainShape.prototype.ComputeAABB.s_v2);
    box2d.b2MinV(c, b, a.lowerBound);
    box2d.b2MaxV(c, b, a.upperBound)
};
goog.exportProperty(box2d.b2ChainShape.prototype, "ComputeAABB", box2d.b2ChainShape.prototype.ComputeAABB);
box2d.b2ChainShape.prototype.ComputeAABB.s_v1 = new box2d.b2Vec2;
goog.exportProperty(box2d.b2ChainShape.prototype.ComputeAABB, "s_v1", box2d.b2ChainShape.prototype.ComputeAABB.s_v1);
box2d.b2ChainShape.prototype.ComputeAABB.s_v2 = new box2d.b2Vec2;
goog.exportProperty(box2d.b2ChainShape.prototype.ComputeAABB, "s_v2", box2d.b2ChainShape.prototype.ComputeAABB.s_v2);
box2d.b2ChainShape.prototype.ComputeMass = function (a, b) {
    a.mass = 0;
    a.center.SetZero();
    a.I = 0
};
goog.exportProperty(box2d.b2ChainShape.prototype, "ComputeMass", box2d.b2ChainShape.prototype.ComputeMass);
box2d.b2ChainShape.prototype.SetupDistanceProxy = function (a, b) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= b && b < this.m_count);
    a.m_buffer[0].Copy(this.m_vertices[b]);
    b + 1 < this.m_count ? a.m_buffer[1].Copy(this.m_vertices[b + 1]) : a.m_buffer[1].Copy(this.m_vertices[0]);
    a.m_vertices = a.m_buffer;
    a.m_count = 2;
    a.m_radius = this.m_radius
};
box2d.b2ChainShape.prototype.ComputeSubmergedArea = function (a, b, c, e) {
    e.SetZero();
    return 0
};
goog.exportProperty(box2d.b2ChainShape.prototype, "ComputeSubmergedArea", box2d.b2ChainShape.prototype.ComputeSubmergedArea);
box2d.b2ChainShape.prototype.Dump = function () {
    box2d.b2Log("    /*box2d.b2ChainShape*/ var shape = new box2d.b2ChainShape();\n");
    box2d.b2Log("    /*box2d.b2Vec2[]*/ var vs = box2d.b2Vec2.MakeArray(%d);\n", box2d.b2_maxPolygonVertices);
    for (var a = 0; a < this.m_count; ++a) box2d.b2Log("    vs[%d].SetXY(%.15f, %.15f);\n", a, this.m_vertices[a].x, this.m_vertices[a].y);
    box2d.b2Log("    shape.CreateChain(vs, %d);\n", this.m_count);
    box2d.b2Log("    shape.m_prevVertex.SetXY(%.15f, %.15f);\n", this.m_prevVertex.x, this.m_prevVertex.y);
    box2d.b2Log("    shape.m_nextVertex.SetXY(%.15f, %.15f);\n", this.m_nextVertex.x, this.m_nextVertex.y);
    box2d.b2Log("    shape.m_hasPrevVertex = %s;\n", this.m_hasPrevVertex ? "true" : "false");
    box2d.b2Log("    shape.m_hasNextVertex = %s;\n", this.m_hasNextVertex ? "true" : "false")
};
goog.exportProperty(box2d.b2ChainShape.prototype, "Dump", box2d.b2ChainShape.prototype.Dump);
box2d.b2ChainAndPolygonContact = function () {
    box2d.b2Contact.call(this)
};
goog.inherits(box2d.b2ChainAndPolygonContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2ChainAndPolygonContact", box2d.b2ChainAndPolygonContact);
box2d.b2ChainAndPolygonContact.Create = function (a) {
    return new box2d.b2ChainAndPolygonContact
};
goog.exportProperty(box2d.b2ChainAndPolygonContact, "Create", box2d.b2ChainAndPolygonContact.Create);
box2d.b2ChainAndPolygonContact.Destroy = function (a, b) {};
goog.exportProperty(box2d.b2ChainAndPolygonContact, "Destroy", box2d.b2ChainAndPolygonContact.Destroy);
box2d.b2ChainAndPolygonContact.prototype.Reset = function (a, b, c, e) {
    box2d.b2ChainAndPolygonContact.superClass_.Reset.call(this, a, b, c, e);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a.GetType() === box2d.b2ShapeType.e_chainShape);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(c.GetType() === box2d.b2ShapeType.e_polygonShape)
};
goog.exportProperty(box2d.b2ChainAndPolygonContact.prototype, "Reset", box2d.b2ChainAndPolygonContact.prototype.Reset);
box2d.b2ChainAndPolygonContact.prototype.Evaluate = function (a, b, c) {
    var e = this.m_fixtureA.GetShape(),
        d = this.m_fixtureB.GetShape();
    box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2ChainShape);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2PolygonShape);
    var f = box2d.b2ChainAndPolygonContact.prototype.Evaluate.s_edge;
    (e instanceof box2d.b2ChainShape ? e : null).GetChildEdge(f, this.m_indexA);
    box2d.b2CollideEdgeAndPolygon(a, f, b, d instanceof box2d.b2PolygonShape ? d : null, c)
};
goog.exportProperty(box2d.b2ChainAndPolygonContact.prototype, "Evaluate", box2d.b2ChainAndPolygonContact.prototype.Evaluate);
box2d.b2ChainAndPolygonContact.prototype.Evaluate.s_edge = new box2d.b2EdgeShape;
box2d.b2CollidePolygon = {};
box2d.b2FindMaxSeparation = function (a, b, c, e, d) {
    var f = b.m_count,
        g = e.m_count,
        h = b.m_normals;
    b = b.m_vertices;
    e = e.m_vertices;
    c = box2d.b2MulTXX(d, c, box2d.b2FindMaxSeparation.s_xf);
    d = 0;
    for (var l = -box2d.b2_maxFloat, k = 0; k < f; ++k) {
        for (var m = box2d.b2MulRV(c.q, h[k], box2d.b2FindMaxSeparation.s_n), n = box2d.b2MulXV(c, b[k], box2d.b2FindMaxSeparation.s_v1), p = box2d.b2_maxFloat, q = 0; q < g; ++q) {
            var r = box2d.b2DotVV(m, box2d.b2SubVV(e[q], n, box2d.b2Vec2.s_t0));
            r < p && (p = r)
        }
        p > l && (l = p, d = k)
    }
    a[0] = d;
    return l
};
goog.exportSymbol("box2d.b2FindMaxSeparation", box2d.b2FindMaxSeparation);
box2d.b2FindMaxSeparation.s_xf = new box2d.b2Transform;
box2d.b2FindMaxSeparation.s_n = new box2d.b2Vec2;
box2d.b2FindMaxSeparation.s_v1 = new box2d.b2Vec2;
box2d.b2FindIncidentEdge = function (a, b, c, e, d, f) {
    var g = b.m_count,
        h = b.m_normals,
        l = d.m_count;
    b = d.m_vertices;
    d = d.m_normals;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= e && e < g);
    c = box2d.b2MulTRV(f.q, box2d.b2MulRV(c.q, h[e], box2d.b2Vec2.s_t0), box2d.b2FindIncidentEdge.s_normal1);
    for (var g = 0, h = box2d.b2_maxFloat, k = 0; k < l; ++k) {
        var m = box2d.b2DotVV(c, d[k]);
        m < h && (h = m, g = k)
    }
    d = g;
    l = (d + 1) % l;
    c = a[0];
    box2d.b2MulXV(f, b[d], c.v);
    c = c.id.cf;
    c.indexA = e;
    c.indexB = d;
    c.typeA = box2d.b2ContactFeatureType.e_face;
    c.typeB = box2d.b2ContactFeatureType.e_vertex;
    a = a[1];
    box2d.b2MulXV(f, b[l], a.v);
    f = a.id.cf;
    f.indexA = e;
    f.indexB = l;
    f.typeA = box2d.b2ContactFeatureType.e_face;
    f.typeB = box2d.b2ContactFeatureType.e_vertex
};
goog.exportSymbol("box2d.b2FindIncidentEdge", box2d.b2FindIncidentEdge);
box2d.b2FindIncidentEdge.s_normal1 = new box2d.b2Vec2;
box2d.b2CollidePolygons = function (a, b, c, e, d) {
    a.pointCount = 0;
    var f = b.m_radius + e.m_radius,
        g = box2d.b2CollidePolygons.s_edgeA;
    g[0] = 0;
    var h = box2d.b2FindMaxSeparation(g, b, c, e, d);
    if (!(h > f)) {
        var l = box2d.b2CollidePolygons.s_edgeB;
        l[0] = 0;
        var k = box2d.b2FindMaxSeparation(l, e, d, b, c);
        if (!(k > f)) {
            var m = 0,
                n = 0;
            k > 0.98 * h + 0.001 ? (h = e, e = b, b = d, m = l[0], a.type = box2d.b2ManifoldType.e_faceB, n = 1) : (h = b, b = c, c = d, m = g[0], a.type = box2d.b2ManifoldType.e_faceA, n = 0);
            g = box2d.b2CollidePolygons.s_incidentEdge;
            box2d.b2FindIncidentEdge(g, h, b,
                m, e, c);
            d = h.m_vertices;
            var l = m,
                h = (m + 1) % h.m_count,
                p = d[l],
                q = d[h],
                m = box2d.b2SubVV(q, p, box2d.b2CollidePolygons.s_localTangent);
            m.Normalize();
            d = box2d.b2CrossVOne(m, box2d.b2CollidePolygons.s_localNormal);
            e = box2d.b2MidVV(p, q, box2d.b2CollidePolygons.s_planePoint);
            var k = box2d.b2MulRV(b.q, m, box2d.b2CollidePolygons.s_tangent),
                m = box2d.b2CrossVOne(k, box2d.b2CollidePolygons.s_normal),
                p = box2d.b2MulXV(b, p, box2d.b2CollidePolygons.s_v11),
                r = box2d.b2MulXV(b, q, box2d.b2CollidePolygons.s_v12);
            b = box2d.b2DotVV(m, p);
            var q = -box2d.b2DotVV(k, p) + f,
                r = box2d.b2DotVV(k, r) + f,
                t = box2d.b2CollidePolygons.s_clipPoints1,
                p = box2d.b2CollidePolygons.s_clipPoints2,
                s = box2d.b2NegV(k, box2d.b2CollidePolygons.s_ntangent),
                g = box2d.b2ClipSegmentToLine(t, g, s, q, l);
            if (!(2 > g || (g = box2d.b2ClipSegmentToLine(p, t, k, r, h), 2 > g))) {
                a.localNormal.Copy(d);
                a.localPoint.Copy(e);
                for (l = g = 0; l < box2d.b2_maxManifoldPoints; ++l) d = p[l], box2d.b2DotVV(m, d.v) - b <= f && (h = a.points[g], box2d.b2MulTXV(c, d.v, h.localPoint), h.id.Copy(d.id), n && (d = h.id.cf, h.id.cf.indexA = d.indexB, h.id.cf.indexB =
                    d.indexA, h.id.cf.typeA = d.typeB, h.id.cf.typeB = d.typeA), ++g);
                a.pointCount = g
            }
        }
    }
};
goog.exportSymbol("box2d.b2CollidePolygons", box2d.b2CollidePolygons);
box2d.b2CollidePolygons.s_incidentEdge = box2d.b2ClipVertex.MakeArray(2);
box2d.b2CollidePolygons.s_clipPoints1 = box2d.b2ClipVertex.MakeArray(2);
box2d.b2CollidePolygons.s_clipPoints2 = box2d.b2ClipVertex.MakeArray(2);
box2d.b2CollidePolygons.s_edgeA = box2d.b2MakeNumberArray(1);
box2d.b2CollidePolygons.s_edgeB = box2d.b2MakeNumberArray(1);
box2d.b2CollidePolygons.s_localTangent = new box2d.b2Vec2;
box2d.b2CollidePolygons.s_localNormal = new box2d.b2Vec2;
box2d.b2CollidePolygons.s_planePoint = new box2d.b2Vec2;
box2d.b2CollidePolygons.s_normal = new box2d.b2Vec2;
box2d.b2CollidePolygons.s_tangent = new box2d.b2Vec2;
box2d.b2CollidePolygons.s_ntangent = new box2d.b2Vec2;
box2d.b2CollidePolygons.s_v11 = new box2d.b2Vec2;
box2d.b2CollidePolygons.s_v12 = new box2d.b2Vec2;
box2d.b2PolygonContact = function () {
    box2d.b2Contact.call(this)
};
goog.inherits(box2d.b2PolygonContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2PolygonContact", box2d.b2PolygonContact);
box2d.b2PolygonContact.Create = function (a) {
    return new box2d.b2PolygonContact
};
goog.exportProperty(box2d.b2PolygonContact, "Create", box2d.b2PolygonContact.Create);
box2d.b2PolygonContact.Destroy = function (a, b) {};
goog.exportProperty(box2d.b2PolygonContact, "Destroy", box2d.b2PolygonContact.Destroy);
box2d.b2PolygonContact.prototype.Reset = function (a, b, c, e) {
    box2d.b2PolygonContact.superClass_.Reset.call(this, a, b, c, e)
};
goog.exportProperty(box2d.b2PolygonContact.prototype, "Reset", box2d.b2PolygonContact.prototype.Reset);
box2d.b2PolygonContact.prototype.Evaluate = function (a, b, c) {
    var e = this.m_fixtureA.GetShape(),
        d = this.m_fixtureB.GetShape();
    box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2PolygonShape);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2PolygonShape);
    box2d.b2CollidePolygons(a, e instanceof box2d.b2PolygonShape ? e : null, b, d instanceof box2d.b2PolygonShape ? d : null, c)
};
goog.exportProperty(box2d.b2PolygonContact.prototype, "Evaluate", box2d.b2PolygonContact.prototype.Evaluate);
box2d.b2CollideCircle = {};
box2d.b2CollideCircles = function (a, b, c, e, d) {
    a.pointCount = 0;
    c = box2d.b2MulXV(c, b.m_p, box2d.b2CollideCircles.s_pA);
    d = box2d.b2MulXV(d, e.m_p, box2d.b2CollideCircles.s_pB);
    d = box2d.b2DistanceSquaredVV(c, d);
    c = b.m_radius + e.m_radius;
    d > c * c || (a.type = box2d.b2ManifoldType.e_circles, a.localPoint.Copy(b.m_p), a.localNormal.SetZero(), a.pointCount = 1, a.points[0].localPoint.Copy(e.m_p), a.points[0].id.key = 0)
};
goog.exportSymbol("box2d.b2CollideCircles", box2d.b2CollideCircles);
box2d.b2CollideCircles.s_pA = new box2d.b2Vec2;
box2d.b2CollideCircles.s_pB = new box2d.b2Vec2;
box2d.b2CollidePolygonAndCircle = function (a, b, c, e, d) {
    a.pointCount = 0;
    d = box2d.b2MulXV(d, e.m_p, box2d.b2CollidePolygonAndCircle.s_c);
    c = box2d.b2MulTXV(c, d, box2d.b2CollidePolygonAndCircle.s_cLocal);
    var f = 0,
        g = -box2d.b2_maxFloat;
    d = b.m_radius + e.m_radius;
    var h = b.m_count,
        l = b.m_vertices;
    b = b.m_normals;
    for (var k = 0; k < h; ++k) {
        var m = box2d.b2DotVV(b[k], box2d.b2SubVV(c, l[k], box2d.b2Vec2.s_t0));
        if (m > d) return;
        m > g && (g = m, f = k)
    }
    k = f;
    m = l[k];
    h = l[(k + 1) % h];
    g < box2d.b2_epsilon ? (a.pointCount = 1, a.type = box2d.b2ManifoldType.e_faceA, a.localNormal.Copy(b[f]),
        box2d.b2MidVV(m, h, a.localPoint), a.points[0].localPoint.Copy(e.m_p), a.points[0].id.key = 0) : (g = box2d.b2DotVV(box2d.b2SubVV(c, m, box2d.b2Vec2.s_t0), box2d.b2SubVV(h, m, box2d.b2Vec2.s_t1)), f = box2d.b2DotVV(box2d.b2SubVV(c, h, box2d.b2Vec2.s_t0), box2d.b2SubVV(m, h, box2d.b2Vec2.s_t1)), 0 >= g ? box2d.b2DistanceSquaredVV(c, m) > d * d || (a.pointCount = 1, a.type = box2d.b2ManifoldType.e_faceA, box2d.b2SubVV(c, m, a.localNormal).SelfNormalize(), a.localPoint.Copy(m), a.points[0].localPoint.Copy(e.m_p), a.points[0].id.key = 0) : 0 >= f ? box2d.b2DistanceSquaredVV(c,
        h) > d * d || (a.pointCount = 1, a.type = box2d.b2ManifoldType.e_faceA, box2d.b2SubVV(c, h, a.localNormal).SelfNormalize(), a.localPoint.Copy(h), a.points[0].localPoint.Copy(e.m_p), a.points[0].id.key = 0) : (f = box2d.b2MidVV(m, h, box2d.b2CollidePolygonAndCircle.s_faceCenter), g = box2d.b2DotVV(box2d.b2SubVV(c, f, box2d.b2Vec2.s_t1), b[k]), g > d || (a.pointCount = 1, a.type = box2d.b2ManifoldType.e_faceA, a.localNormal.Copy(b[k]).SelfNormalize(), a.localPoint.Copy(f), a.points[0].localPoint.Copy(e.m_p), a.points[0].id.key = 0)))
};
goog.exportSymbol("box2d.b2CollidePolygonAndCircle", box2d.b2CollidePolygonAndCircle);
box2d.b2CollidePolygonAndCircle.s_c = new box2d.b2Vec2;
box2d.b2CollidePolygonAndCircle.s_cLocal = new box2d.b2Vec2;
box2d.b2CollidePolygonAndCircle.s_faceCenter = new box2d.b2Vec2;
box2d.b2CircleContact = function () {
    box2d.b2Contact.call(this)
};
goog.inherits(box2d.b2CircleContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2CircleContact", box2d.b2CircleContact);
box2d.b2CircleContact.Create = function (a) {
    return new box2d.b2CircleContact
};
goog.exportProperty(box2d.b2CircleContact, "Create", box2d.b2CircleContact.Create);
box2d.b2CircleContact.Destroy = function (a, b) {};
goog.exportProperty(box2d.b2CircleContact, "Destroy", box2d.b2CircleContact.Destroy);
box2d.b2CircleContact.prototype.Reset = function (a, b, c, e) {
    box2d.b2CircleContact.superClass_.Reset.call(this, a, b, c, e)
};
goog.exportProperty(box2d.b2CircleContact.prototype, "Reset", box2d.b2CircleContact.prototype.Reset);
box2d.b2CircleContact.prototype.Evaluate = function (a, b, c) {
    var e = this.m_fixtureA.GetShape(),
        d = this.m_fixtureB.GetShape();
    box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2CircleShape);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2CircleShape);
    box2d.b2CollideCircles(a, e instanceof box2d.b2CircleShape ? e : null, b, d instanceof box2d.b2CircleShape ? d : null, c)
};
goog.exportProperty(box2d.b2CircleContact.prototype, "Evaluate", box2d.b2CircleContact.prototype.Evaluate);
box2d.b2ChainAndCircleContact = function () {
    box2d.b2Contact.call(this)
};
goog.inherits(box2d.b2ChainAndCircleContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2ChainAndCircleContact", box2d.b2ChainAndCircleContact);
box2d.b2ChainAndCircleContact.Create = function (a) {
    return new box2d.b2ChainAndCircleContact
};
goog.exportProperty(box2d.b2ChainAndCircleContact, "Create", box2d.b2ChainAndCircleContact.Create);
box2d.b2ChainAndCircleContact.Destroy = function (a, b) {};
goog.exportProperty(box2d.b2ChainAndCircleContact, "Destroy", box2d.b2ChainAndCircleContact.Destroy);
box2d.b2ChainAndCircleContact.prototype.Reset = function (a, b, c, e) {
    box2d.b2ChainAndCircleContact.superClass_.Reset.call(this, a, b, c, e);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a.GetType() === box2d.b2ShapeType.e_chainShape);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(c.GetType() === box2d.b2ShapeType.e_circleShape)
};
goog.exportProperty(box2d.b2ChainAndCircleContact.prototype, "Reset", box2d.b2ChainAndCircleContact.prototype.Reset);
box2d.b2ChainAndCircleContact.prototype.Evaluate = function (a, b, c) {
    var e = this.m_fixtureA.GetShape(),
        d = this.m_fixtureB.GetShape();
    box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2ChainShape);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2CircleShape);
    var f = box2d.b2ChainAndCircleContact.prototype.Evaluate.s_edge;
    (e instanceof box2d.b2ChainShape ? e : null).GetChildEdge(f, this.m_indexA);
    box2d.b2CollideEdgeAndCircle(a, f, b, d instanceof box2d.b2CircleShape ? d : null, c)
};
goog.exportProperty(box2d.b2ChainAndCircleContact.prototype, "Evaluate", box2d.b2ChainAndCircleContact.prototype.Evaluate);
box2d.b2ChainAndCircleContact.prototype.Evaluate.s_edge = new box2d.b2EdgeShape;
box2d.b2EdgeAndCircleContact = function () {
    box2d.b2Contact.call(this)
};
goog.inherits(box2d.b2EdgeAndCircleContact, box2d.b2Contact);
goog.exportSymbol("box2d.b2EdgeAndCircleContact", box2d.b2EdgeAndCircleContact);
box2d.b2EdgeAndCircleContact.Create = function (a) {
    return new box2d.b2EdgeAndCircleContact
};
goog.exportProperty(box2d.b2EdgeAndCircleContact, "Create", box2d.b2EdgeAndCircleContact.Create);
box2d.b2EdgeAndCircleContact.Destroy = function (a, b) {};
goog.exportProperty(box2d.b2EdgeAndCircleContact, "Destroy", box2d.b2EdgeAndCircleContact.Destroy);
box2d.b2EdgeAndCircleContact.prototype.Reset = function (a, b, c, e) {
    box2d.b2EdgeAndCircleContact.superClass_.Reset.call(this, a, b, c, e);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a.GetType() === box2d.b2ShapeType.e_edgeShape);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(c.GetType() === box2d.b2ShapeType.e_circleShape)
};
goog.exportProperty(box2d.b2EdgeAndCircleContact.prototype, "Reset", box2d.b2EdgeAndCircleContact.prototype.Reset);
box2d.b2EdgeAndCircleContact.prototype.Evaluate = function (a, b, c) {
    var e = this.m_fixtureA.GetShape(),
        d = this.m_fixtureB.GetShape();
    box2d.ENABLE_ASSERTS && box2d.b2Assert(e instanceof box2d.b2EdgeShape);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2CircleShape);
    box2d.b2CollideEdgeAndCircle(a, e instanceof box2d.b2EdgeShape ? e : null, b, d instanceof box2d.b2CircleShape ? d : null, c)
};
goog.exportProperty(box2d.b2EdgeAndCircleContact.prototype, "Evaluate", box2d.b2EdgeAndCircleContact.prototype.Evaluate);
box2d.b2VelocityConstraintPoint = function () {
    this.rA = new box2d.b2Vec2;
    this.rB = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2VelocityConstraintPoint", box2d.b2VelocityConstraintPoint);
box2d.b2VelocityConstraintPoint.prototype.rA = null;
goog.exportProperty(box2d.b2VelocityConstraintPoint.prototype, "rA", box2d.b2VelocityConstraintPoint.prototype.rA);
box2d.b2VelocityConstraintPoint.prototype.rB = null;
goog.exportProperty(box2d.b2VelocityConstraintPoint.prototype, "rB", box2d.b2VelocityConstraintPoint.prototype.rB);
box2d.b2VelocityConstraintPoint.prototype.normalImpulse = 0;
goog.exportProperty(box2d.b2VelocityConstraintPoint.prototype, "normalImpulse", box2d.b2VelocityConstraintPoint.prototype.normalImpulse);
box2d.b2VelocityConstraintPoint.prototype.tangentImpulse = 0;
goog.exportProperty(box2d.b2VelocityConstraintPoint.prototype, "tangentImpulse", box2d.b2VelocityConstraintPoint.prototype.tangentImpulse);
box2d.b2VelocityConstraintPoint.prototype.normalMass = 0;
goog.exportProperty(box2d.b2VelocityConstraintPoint.prototype, "normalMass", box2d.b2VelocityConstraintPoint.prototype.normalMass);
box2d.b2VelocityConstraintPoint.prototype.tangentMass = 0;
goog.exportProperty(box2d.b2VelocityConstraintPoint.prototype, "tangentMass", box2d.b2VelocityConstraintPoint.prototype.tangentMass);
box2d.b2VelocityConstraintPoint.prototype.velocityBias = 0;
goog.exportProperty(box2d.b2VelocityConstraintPoint.prototype, "velocityBias", box2d.b2VelocityConstraintPoint.prototype.velocityBias);
box2d.b2VelocityConstraintPoint.MakeArray = function (a) {
    return box2d.b2MakeArray(a, function (a) {
        return new box2d.b2VelocityConstraintPoint
    })
};
goog.exportProperty(box2d.b2VelocityConstraintPoint, "MakeArray", box2d.b2VelocityConstraintPoint.MakeArray);
box2d.b2ContactVelocityConstraint = function () {
    this.points = box2d.b2VelocityConstraintPoint.MakeArray(box2d.b2_maxManifoldPoints);
    this.normal = new box2d.b2Vec2;
    this.tangent = new box2d.b2Vec2;
    this.normalMass = new box2d.b2Mat22;
    this.K = new box2d.b2Mat22
};
goog.exportSymbol("box2d.b2ContactVelocityConstraint", box2d.b2ContactVelocityConstraint);
box2d.b2ContactVelocityConstraint.prototype.points = null;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "points", box2d.b2ContactVelocityConstraint.prototype.points);
box2d.b2ContactVelocityConstraint.prototype.normal = null;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "normal", box2d.b2ContactVelocityConstraint.prototype.normal);
box2d.b2ContactVelocityConstraint.prototype.tangent = null;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "tangent", box2d.b2ContactVelocityConstraint.prototype.tangent);
box2d.b2ContactVelocityConstraint.prototype.normalMass = null;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "normalMass", box2d.b2ContactVelocityConstraint.prototype.normalMass);
box2d.b2ContactVelocityConstraint.prototype.K = null;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "K", box2d.b2ContactVelocityConstraint.prototype.K);
box2d.b2ContactVelocityConstraint.prototype.indexA = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "indexA", box2d.b2ContactVelocityConstraint.prototype.indexA);
box2d.b2ContactVelocityConstraint.prototype.indexB = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "indexB", box2d.b2ContactVelocityConstraint.prototype.indexB);
box2d.b2ContactVelocityConstraint.prototype.invMassA = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "invMassA", box2d.b2ContactVelocityConstraint.prototype.invMassA);
box2d.b2ContactVelocityConstraint.prototype.invMassB = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "invMassB", box2d.b2ContactVelocityConstraint.prototype.invMassB);
box2d.b2ContactVelocityConstraint.prototype.invIA = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "invIA", box2d.b2ContactVelocityConstraint.prototype.invIA);
box2d.b2ContactVelocityConstraint.prototype.invIB = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "invIB", box2d.b2ContactVelocityConstraint.prototype.invIB);
box2d.b2ContactVelocityConstraint.prototype.friction = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "friction", box2d.b2ContactVelocityConstraint.prototype.friction);
box2d.b2ContactVelocityConstraint.prototype.restitution = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "restitution", box2d.b2ContactVelocityConstraint.prototype.restitution);
box2d.b2ContactVelocityConstraint.prototype.tangentSpeed = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "tangentSpeed", box2d.b2ContactVelocityConstraint.prototype.tangentSpeed);
box2d.b2ContactVelocityConstraint.prototype.pointCount = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "pointCount", box2d.b2ContactVelocityConstraint.prototype.pointCount);
box2d.b2ContactVelocityConstraint.prototype.contactIndex = 0;
goog.exportProperty(box2d.b2ContactVelocityConstraint.prototype, "contactIndex", box2d.b2ContactVelocityConstraint.prototype.contactIndex);
box2d.b2ContactVelocityConstraint.MakeArray = function (a) {
    return box2d.b2MakeArray(a, function (a) {
        return new box2d.b2ContactVelocityConstraint
    })
};
goog.exportProperty(box2d.b2ContactVelocityConstraint, "MakeArray", box2d.b2ContactVelocityConstraint.MakeArray);
box2d.b2ContactPositionConstraint = function () {
    this.localPoints = box2d.b2Vec2.MakeArray(box2d.b2_maxManifoldPoints);
    this.localNormal = new box2d.b2Vec2;
    this.localPoint = new box2d.b2Vec2;
    this.localCenterA = new box2d.b2Vec2;
    this.localCenterB = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2ContactPositionConstraint", box2d.b2ContactPositionConstraint);
box2d.b2ContactPositionConstraint.prototype.localPoints = null;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "localPoints", box2d.b2ContactPositionConstraint.prototype.localPoints);
box2d.b2ContactPositionConstraint.prototype.localNormal = null;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "localNormal", box2d.b2ContactPositionConstraint.prototype.localNormal);
box2d.b2ContactPositionConstraint.prototype.localPoint = null;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "localPoint", box2d.b2ContactPositionConstraint.prototype.localPoint);
box2d.b2ContactPositionConstraint.prototype.indexA = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "indexA", box2d.b2ContactPositionConstraint.prototype.indexA);
box2d.b2ContactPositionConstraint.prototype.indexB = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "indexB", box2d.b2ContactPositionConstraint.prototype.indexB);
box2d.b2ContactPositionConstraint.prototype.invMassA = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "invMassA", box2d.b2ContactPositionConstraint.prototype.invMassA);
box2d.b2ContactPositionConstraint.prototype.invMassB = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "invMassB", box2d.b2ContactPositionConstraint.prototype.invMassB);
box2d.b2ContactPositionConstraint.prototype.localCenterA = null;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "localCenterA", box2d.b2ContactPositionConstraint.prototype.localCenterA);
box2d.b2ContactPositionConstraint.prototype.localCenterB = null;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "localCenterB", box2d.b2ContactPositionConstraint.prototype.localCenterB);
box2d.b2ContactPositionConstraint.prototype.invIA = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "invIA", box2d.b2ContactPositionConstraint.prototype.invIA);
box2d.b2ContactPositionConstraint.prototype.invIB = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "invIB", box2d.b2ContactPositionConstraint.prototype.invIB);
box2d.b2ContactPositionConstraint.prototype.type = box2d.b2ManifoldType.e_unknown;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "type", box2d.b2ContactPositionConstraint.prototype.type);
box2d.b2ContactPositionConstraint.prototype.radiusA = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "radiusA", box2d.b2ContactPositionConstraint.prototype.radiusA);
box2d.b2ContactPositionConstraint.prototype.radiusB = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "radiusB", box2d.b2ContactPositionConstraint.prototype.radiusB);
box2d.b2ContactPositionConstraint.prototype.pointCount = 0;
goog.exportProperty(box2d.b2ContactPositionConstraint.prototype, "pointCount", box2d.b2ContactPositionConstraint.prototype.pointCount);
box2d.b2ContactPositionConstraint.MakeArray = function (a) {
    return box2d.b2MakeArray(a, function (a) {
        return new box2d.b2ContactPositionConstraint
    })
};
goog.exportProperty(box2d.b2ContactPositionConstraint, "MakeArray", box2d.b2ContactPositionConstraint.MakeArray);
box2d.b2ContactSolverDef = function () {
    this.step = new box2d.b2TimeStep
};
goog.exportSymbol("box2d.b2ContactSolverDef", box2d.b2ContactSolverDef);
box2d.b2ContactSolverDef.prototype.step = null;
goog.exportProperty(box2d.b2ContactSolverDef.prototype, "step", box2d.b2ContactSolverDef.prototype.step);
box2d.b2ContactSolverDef.prototype.contacts = null;
goog.exportProperty(box2d.b2ContactSolverDef.prototype, "contacts", box2d.b2ContactSolverDef.prototype.contacts);
box2d.b2ContactSolverDef.prototype.count = 0;
goog.exportProperty(box2d.b2ContactSolverDef.prototype, "count", box2d.b2ContactSolverDef.prototype.count);
box2d.b2ContactSolverDef.prototype.positions = null;
goog.exportProperty(box2d.b2ContactSolverDef.prototype, "positions", box2d.b2ContactSolverDef.prototype.positions);
box2d.b2ContactSolverDef.prototype.velocities = null;
goog.exportProperty(box2d.b2ContactSolverDef.prototype, "velocities", box2d.b2ContactSolverDef.prototype.velocities);
box2d.b2ContactSolverDef.prototype.allocator = null;
goog.exportProperty(box2d.b2ContactSolverDef.prototype, "allocator", box2d.b2ContactSolverDef.prototype.allocator);
box2d.b2ContactSolver = function () {
    this.m_step = new box2d.b2TimeStep;
    this.m_positionConstraints = box2d.b2ContactPositionConstraint.MakeArray(1024);
    this.m_velocityConstraints = box2d.b2ContactVelocityConstraint.MakeArray(1024)
};
goog.exportSymbol("box2d.b2ContactSolver", box2d.b2ContactSolver);
box2d.b2ContactSolver.prototype.m_step = null;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_step", box2d.b2ContactSolver.prototype.m_step);
box2d.b2ContactSolver.prototype.m_positions = null;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_positions", box2d.b2ContactSolver.prototype.m_positions);
box2d.b2ContactSolver.prototype.m_velocities = null;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_velocities", box2d.b2ContactSolver.prototype.m_velocities);
box2d.b2ContactSolver.prototype.m_allocator = null;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_allocator", box2d.b2ContactSolver.prototype.m_allocator);
box2d.b2ContactSolver.prototype.m_positionConstraints = null;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_positionConstraints", box2d.b2ContactSolver.prototype.m_positionConstraints);
box2d.b2ContactSolver.prototype.m_velocityConstraints = null;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_velocityConstraints", box2d.b2ContactSolver.prototype.m_velocityConstraints);
box2d.b2ContactSolver.prototype.m_contacts = null;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_contacts", box2d.b2ContactSolver.prototype.m_contacts);
box2d.b2ContactSolver.prototype.m_count = 0;
goog.exportProperty(box2d.b2ContactSolver.prototype, "m_count", box2d.b2ContactSolver.prototype.m_count);
box2d.b2ContactSolver.prototype.Initialize = function (a) {
    this.m_step.Copy(a.step);
    this.m_allocator = a.allocator;
    this.m_count = a.count;
    if (this.m_positionConstraints.length < this.m_count) {
        var b = box2d.b2Max(2 * this.m_positionConstraints.length, this.m_count);
        for (box2d.DEBUG && window.console.log("box2d.b2ContactSolver.m_positionConstraints: " + b); this.m_positionConstraints.length < b;) this.m_positionConstraints[this.m_positionConstraints.length] = new box2d.b2ContactPositionConstraint
    }
    if (this.m_velocityConstraints.length <
        this.m_count)
        for (b = box2d.b2Max(2 * this.m_velocityConstraints.length, this.m_count), box2d.DEBUG && window.console.log("box2d.b2ContactSolver.m_velocityConstraints: " + b); this.m_velocityConstraints.length < b;) this.m_velocityConstraints[this.m_velocityConstraints.length] = new box2d.b2ContactVelocityConstraint;
    this.m_positions = a.positions;
    this.m_velocities = a.velocities;
    this.m_contacts = a.contacts;
    var c, e, d, f, g, h, l, k;
    a = 0;
    for (b = this.m_count; a < b; ++a)
        for (d = this.m_contacts[a], f = d.m_fixtureA, g = d.m_fixtureB, c = f.GetShape(),
            e = g.GetShape(), c = c.m_radius, e = e.m_radius, h = f.GetBody(), l = g.GetBody(), g = d.GetManifold(), k = g.pointCount, box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < k), f = this.m_velocityConstraints[a], f.friction = d.m_friction, f.restitution = d.m_restitution, f.tangentSpeed = d.m_tangentSpeed, f.indexA = h.m_islandIndex, f.indexB = l.m_islandIndex, f.invMassA = h.m_invMass, f.invMassB = l.m_invMass, f.invIA = h.m_invI, f.invIB = l.m_invI, f.contactIndex = a, f.pointCount = k, f.K.SetZero(), f.normalMass.SetZero(), d = this.m_positionConstraints[a], d.indexA =
            h.m_islandIndex, d.indexB = l.m_islandIndex, d.invMassA = h.m_invMass, d.invMassB = l.m_invMass, d.localCenterA.Copy(h.m_sweep.localCenter), d.localCenterB.Copy(l.m_sweep.localCenter), d.invIA = h.m_invI, d.invIB = l.m_invI, d.localNormal.Copy(g.localNormal), d.localPoint.Copy(g.localPoint), d.pointCount = k, d.radiusA = c, d.radiusB = e, d.type = g.type, c = 0, e = k; c < e; ++c) h = g.points[c], k = f.points[c], this.m_step.warmStarting ? (k.normalImpulse = this.m_step.dtRatio * h.normalImpulse, k.tangentImpulse = this.m_step.dtRatio * h.tangentImpulse) :
            (k.normalImpulse = 0, k.tangentImpulse = 0), k.rA.SetZero(), k.rB.SetZero(), k.normalMass = 0, k.tangentMass = 0, k.velocityBias = 0, d.localPoints[c].Copy(h.localPoint);
    return this
};
goog.exportProperty(box2d.b2ContactSolver.prototype, "Initialize", box2d.b2ContactSolver.prototype.Initialize);
box2d.b2ContactSolver.prototype.InitializeVelocityConstraints = function () {
    var a, b, c, e, d, f, g, h, l, k, m, n, p, q, r, t, s, u, v, y, D = box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_xfA,
        x = box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_xfB,
        w = box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_worldManifold;
    a = 0;
    for (b = this.m_count; a < b; ++a) {
        d = this.m_velocityConstraints[a];
        f = this.m_positionConstraints[a];
        c = f.radiusA;
        e = f.radiusB;
        g = this.m_contacts[d.contactIndex].GetManifold();
        h = d.indexA;
        l = d.indexB;
        k = d.invMassA;
        m = d.invMassB;
        n = d.invIA;
        p = d.invIB;
        q = f.localCenterA;
        r = f.localCenterB;
        f = this.m_positions[h].c;
        t = this.m_positions[h].a;
        s = this.m_velocities[h].v;
        h = this.m_velocities[h].w;
        u = this.m_positions[l].c;
        v = this.m_positions[l].a;
        y = this.m_velocities[l].v;
        l = this.m_velocities[l].w;
        box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < g.pointCount);
        D.q.SetAngleRadians(t);
        x.q.SetAngleRadians(v);
        box2d.b2SubVV(f, box2d.b2MulRV(D.q, q, box2d.b2Vec2.s_t0), D.p);
        box2d.b2SubVV(u, box2d.b2MulRV(x.q, r, box2d.b2Vec2.s_t0),
            x.p);
        w.Initialize(g, D, c, x, e);
        d.normal.Copy(w.normal);
        box2d.b2CrossVOne(d.normal, d.tangent);
        e = d.pointCount;
        for (c = 0; c < e; ++c) g = d.points[c], box2d.b2SubVV(w.points[c], f, g.rA), box2d.b2SubVV(w.points[c], u, g.rB), q = box2d.b2CrossVV(g.rA, d.normal), r = box2d.b2CrossVV(g.rB, d.normal), q = k + m + n * q * q + p * r * r, g.normalMass = 0 < q ? 1 / q : 0, r = d.tangent, q = box2d.b2CrossVV(g.rA, r), r = box2d.b2CrossVV(g.rB, r), q = k + m + n * q * q + p * r * r, g.tangentMass = 0 < q ? 1 / q : 0, g.velocityBias = 0, q = box2d.b2DotVV(d.normal, box2d.b2SubVV(box2d.b2AddVCrossSV(y, l, g.rB,
            box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(s, h, g.rA, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t0)), q < -box2d.b2_velocityThreshold && (g.velocityBias += -d.restitution * q);
        2 === d.pointCount && (s = d.points[0], u = d.points[1], f = box2d.b2CrossVV(s.rA, d.normal), s = box2d.b2CrossVV(s.rB, d.normal), h = box2d.b2CrossVV(u.rA, d.normal), l = box2d.b2CrossVV(u.rB, d.normal), u = k + m + n * f * f + p * s * s, y = k + m + n * h * h + p * l * l, k = k + m + n * f * h + p * s * l, u * u < 1E3 * (u * y - k * k) ? (d.K.ex.SetXY(u, k), d.K.ey.SetXY(k, y), d.K.GetInverse(d.normalMass)) : d.pointCount = 1)
    }
};
goog.exportProperty(box2d.b2ContactSolver.prototype, "InitializeVelocityConstraints", box2d.b2ContactSolver.prototype.InitializeVelocityConstraints);
box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_xfA = new box2d.b2Transform;
box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_xfB = new box2d.b2Transform;
box2d.b2ContactSolver.prototype.InitializeVelocityConstraints.s_worldManifold = new box2d.b2WorldManifold;
box2d.b2ContactSolver.prototype.WarmStart = function () {
    var a, b, c, e, d, f, g, h, l, k, m, n, p, q, r, t, s, u, v = box2d.b2ContactSolver.prototype.WarmStart.s_P;
    a = 0;
    for (b = this.m_count; a < b; ++a) {
        d = this.m_velocityConstraints[a];
        f = d.indexA;
        g = d.indexB;
        h = d.invMassA;
        l = d.invIA;
        k = d.invMassB;
        m = d.invIB;
        e = d.pointCount;
        n = this.m_velocities[f].v;
        p = this.m_velocities[f].w;
        q = this.m_velocities[g].v;
        r = this.m_velocities[g].w;
        t = d.normal;
        s = d.tangent;
        for (c = 0; c < e; ++c) u = d.points[c], box2d.b2AddVV(box2d.b2MulSV(u.normalImpulse, t, box2d.b2Vec2.s_t0),
            box2d.b2MulSV(u.tangentImpulse, s, box2d.b2Vec2.s_t1), v), p -= l * box2d.b2CrossVV(u.rA, v), n.SelfMulSub(h, v), r += m * box2d.b2CrossVV(u.rB, v), q.SelfMulAdd(k, v);
        this.m_velocities[f].w = p;
        this.m_velocities[g].w = r
    }
};
goog.exportProperty(box2d.b2ContactSolver.prototype, "WarmStart", box2d.b2ContactSolver.prototype.WarmStart);
box2d.b2ContactSolver.prototype.WarmStart.s_P = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints = function () {
    var a, b, c, e, d, f, g, h, l, k, m, n, p, q, r, t, s, u, v, y = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv,
        D = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv1,
        x = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv2,
        w, C, A = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P,
        E = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_a,
        B = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_b,
        z = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_x,
        G = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_d,
        F = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P1,
        H = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P2,
        I = box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P1P2;
    a = 0;
    for (b = this.m_count; a < b; ++a) {
        d = this.m_velocityConstraints[a];
        f = d.indexA;
        g = d.indexB;
        h = d.invMassA;
        l = d.invIA;
        k = d.invMassB;
        m = d.invIB;
        n = d.pointCount;
        p = this.m_velocities[f].v;
        q = this.m_velocities[f].w;
        r = this.m_velocities[g].v;
        t = this.m_velocities[g].w;
        s = d.normal;
        u = d.tangent;
        v = d.friction;
        box2d.ENABLE_ASSERTS && box2d.b2Assert(1 === n || 2 === n);
        c = 0;
        for (e = n; c < e; ++c) n = d.points[c], box2d.b2SubVV(box2d.b2AddVCrossSV(r, t, n.rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(p, q, n.rA, box2d.b2Vec2.s_t1), y), w = box2d.b2DotVV(y, u) - d.tangentSpeed, w = n.tangentMass * -w, C = v * n.normalImpulse, C = box2d.b2Clamp(n.tangentImpulse + w, -C, C), w = C - n.tangentImpulse, n.tangentImpulse = C, box2d.b2MulSV(w, u, A), p.SelfMulSub(h, A), q -= l * box2d.b2CrossVV(n.rA, A), r.SelfMulAdd(k, A), t += m * box2d.b2CrossVV(n.rB,
            A);
        if (1 === d.pointCount) n = d.points[0], box2d.b2SubVV(box2d.b2AddVCrossSV(r, t, n.rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(p, q, n.rA, box2d.b2Vec2.s_t1), y), d = box2d.b2DotVV(y, s), w = -n.normalMass * (d - n.velocityBias), C = box2d.b2Max(n.normalImpulse + w, 0), w = C - n.normalImpulse, n.normalImpulse = C, box2d.b2MulSV(w, s, A), p.SelfMulSub(h, A), q -= l * box2d.b2CrossVV(n.rA, A), r.SelfMulAdd(k, A), t += m * box2d.b2CrossVV(n.rB, A);
        else
            for (c = d.points[0], u = d.points[1], E.SetXY(c.normalImpulse, u.normalImpulse), box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <=
                E.x && 0 <= E.y), box2d.b2SubVV(box2d.b2AddVCrossSV(r, t, c.rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(p, q, c.rA, box2d.b2Vec2.s_t1), D), box2d.b2SubVV(box2d.b2AddVCrossSV(r, t, u.rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(p, q, u.rA, box2d.b2Vec2.s_t1), x), v = box2d.b2DotVV(D, s), n = box2d.b2DotVV(x, s), B.x = v - c.velocityBias, B.y = n - u.velocityBias, B.SelfSub(box2d.b2MulMV(d.K, E, box2d.b2Vec2.s_t0));;) {
                box2d.b2MulMV(d.normalMass, B, z).SelfNeg();
                if (0 <= z.x && 0 <= z.y) {
                    box2d.b2SubVV(z, E, G);
                    box2d.b2MulSV(G.x, s, F);
                    box2d.b2MulSV(G.y, s,
                        H);
                    box2d.b2AddVV(F, H, I);
                    p.SelfMulSub(h, I);
                    q -= l * (box2d.b2CrossVV(c.rA, F) + box2d.b2CrossVV(u.rA, H));
                    r.SelfMulAdd(k, I);
                    t += m * (box2d.b2CrossVV(c.rB, F) + box2d.b2CrossVV(u.rB, H));
                    c.normalImpulse = z.x;
                    u.normalImpulse = z.y;
                    break
                }
                z.x = -c.normalMass * B.x;
                z.y = 0;
                n = d.K.ex.y * z.x + B.y;
                if (0 <= z.x && 0 <= n) {
                    box2d.b2SubVV(z, E, G);
                    box2d.b2MulSV(G.x, s, F);
                    box2d.b2MulSV(G.y, s, H);
                    box2d.b2AddVV(F, H, I);
                    p.SelfMulSub(h, I);
                    q -= l * (box2d.b2CrossVV(c.rA, F) + box2d.b2CrossVV(u.rA, H));
                    r.SelfMulAdd(k, I);
                    t += m * (box2d.b2CrossVV(c.rB, F) + box2d.b2CrossVV(u.rB,
                        H));
                    c.normalImpulse = z.x;
                    u.normalImpulse = z.y;
                    break
                }
                z.x = 0;
                z.y = -u.normalMass * B.y;
                v = d.K.ey.x * z.y + B.x;
                if (0 <= z.y && 0 <= v) {
                    box2d.b2SubVV(z, E, G);
                    box2d.b2MulSV(G.x, s, F);
                    box2d.b2MulSV(G.y, s, H);
                    box2d.b2AddVV(F, H, I);
                    p.SelfMulSub(h, I);
                    q -= l * (box2d.b2CrossVV(c.rA, F) + box2d.b2CrossVV(u.rA, H));
                    r.SelfMulAdd(k, I);
                    t += m * (box2d.b2CrossVV(c.rB, F) + box2d.b2CrossVV(u.rB, H));
                    c.normalImpulse = z.x;
                    u.normalImpulse = z.y;
                    break
                }
                z.x = 0;
                z.y = 0;
                v = B.x;
                n = B.y;
                if (0 <= v && 0 <= n) {
                    box2d.b2SubVV(z, E, G);
                    box2d.b2MulSV(G.x, s, F);
                    box2d.b2MulSV(G.y, s, H);
                    box2d.b2AddVV(F,
                        H, I);
                    p.SelfMulSub(h, I);
                    q -= l * (box2d.b2CrossVV(c.rA, F) + box2d.b2CrossVV(u.rA, H));
                    r.SelfMulAdd(k, I);
                    t += m * (box2d.b2CrossVV(c.rB, F) + box2d.b2CrossVV(u.rB, H));
                    c.normalImpulse = z.x;
                    u.normalImpulse = z.y;
                    break
                }
                break
            }
        this.m_velocities[f].w = q;
        this.m_velocities[g].w = t
    }
};
goog.exportProperty(box2d.b2ContactSolver.prototype, "SolveVelocityConstraints", box2d.b2ContactSolver.prototype.SolveVelocityConstraints);
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv1 = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_dv2 = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_a = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_b = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_x = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_d = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P1 = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P2 = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveVelocityConstraints.s_P1P2 = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.StoreImpulses = function () {
    var a, b, c, e, d, f;
    a = 0;
    for (b = this.m_count; a < b; ++a)
        for (d = this.m_velocityConstraints[a], f = this.m_contacts[d.contactIndex].GetManifold(), c = 0, e = d.pointCount; c < e; ++c) f.points[c].normalImpulse = d.points[c].normalImpulse, f.points[c].tangentImpulse = d.points[c].tangentImpulse
};
goog.exportProperty(box2d.b2ContactSolver.prototype, "StoreImpulses", box2d.b2ContactSolver.prototype.StoreImpulses);
box2d.b2PositionSolverManifold = function () {
    this.normal = new box2d.b2Vec2;
    this.point = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2PositionSolverManifold", box2d.b2PositionSolverManifold);
box2d.b2PositionSolverManifold.prototype.normal = null;
goog.exportProperty(box2d.b2PositionSolverManifold.prototype, "normal", box2d.b2PositionSolverManifold.prototype.normal);
box2d.b2PositionSolverManifold.prototype.point = null;
goog.exportProperty(box2d.b2PositionSolverManifold.prototype, "point", box2d.b2PositionSolverManifold.prototype.point);
box2d.b2PositionSolverManifold.prototype.separation = 0;
goog.exportProperty(box2d.b2PositionSolverManifold.prototype, "separation", box2d.b2PositionSolverManifold.prototype.separation);
box2d.b2PositionSolverManifold.prototype.Initialize = function (a, b, c, e) {
    var d = box2d.b2PositionSolverManifold.prototype.Initialize.s_pointA,
        f = box2d.b2PositionSolverManifold.prototype.Initialize.s_pointB,
        g = box2d.b2PositionSolverManifold.prototype.Initialize.s_planePoint,
        h = box2d.b2PositionSolverManifold.prototype.Initialize.s_clipPoint;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < a.pointCount);
    switch (a.type) {
    case box2d.b2ManifoldType.e_circles:
        box2d.b2MulXV(b, a.localPoint, d);
        box2d.b2MulXV(c, a.localPoints[0],
            f);
        box2d.b2SubVV(f, d, this.normal).SelfNormalize();
        box2d.b2MidVV(d, f, this.point);
        this.separation = box2d.b2DotVV(box2d.b2SubVV(f, d, box2d.b2Vec2.s_t0), this.normal) - a.radiusA - a.radiusB;
        break;
    case box2d.b2ManifoldType.e_faceA:
        box2d.b2MulRV(b.q, a.localNormal, this.normal);
        box2d.b2MulXV(b, a.localPoint, g);
        box2d.b2MulXV(c, a.localPoints[e], h);
        this.separation = box2d.b2DotVV(box2d.b2SubVV(h, g, box2d.b2Vec2.s_t0), this.normal) - a.radiusA - a.radiusB;
        this.point.Copy(h);
        break;
    case box2d.b2ManifoldType.e_faceB:
        box2d.b2MulRV(c.q,
            a.localNormal, this.normal), box2d.b2MulXV(c, a.localPoint, g), box2d.b2MulXV(b, a.localPoints[e], h), this.separation = box2d.b2DotVV(box2d.b2SubVV(h, g, box2d.b2Vec2.s_t0), this.normal) - a.radiusA - a.radiusB, this.point.Copy(h), this.normal.SelfNeg()
    }
};
goog.exportProperty(box2d.b2PositionSolverManifold.prototype, "Initialize", box2d.b2PositionSolverManifold.prototype.Initialize);
box2d.b2PositionSolverManifold.prototype.Initialize.s_pointA = new box2d.b2Vec2;
box2d.b2PositionSolverManifold.prototype.Initialize.s_pointB = new box2d.b2Vec2;
box2d.b2PositionSolverManifold.prototype.Initialize.s_planePoint = new box2d.b2Vec2;
box2d.b2PositionSolverManifold.prototype.Initialize.s_clipPoint = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolvePositionConstraints = function () {
    var a, b, c, e, d, f, g, h, l, k, m, n, p, q, r, t, s, u = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_xfA,
        v = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_xfB,
        y = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_psm,
        D, x, w, C = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_rA,
        A = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_rB,
        E, B = box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_P,
        z =
            0;
    a = 0;
    for (b = this.m_count; a < b; ++a) {
        d = this.m_positionConstraints[a];
        f = d.indexA;
        g = d.indexB;
        h = d.localCenterA;
        l = d.invMassA;
        k = d.invIA;
        m = d.localCenterB;
        n = d.invMassB;
        p = d.invIB;
        e = d.pointCount;
        q = this.m_positions[f].c;
        r = this.m_positions[f].a;
        t = this.m_positions[g].c;
        s = this.m_positions[g].a;
        for (c = 0; c < e; ++c) u.q.SetAngleRadians(r), v.q.SetAngleRadians(s), box2d.b2SubVV(q, box2d.b2MulRV(u.q, h, box2d.b2Vec2.s_t0), u.p), box2d.b2SubVV(t, box2d.b2MulRV(v.q, m, box2d.b2Vec2.s_t0), v.p), y.Initialize(d, u, v, c), D = y.normal, x = y.point,
        w = y.separation, box2d.b2SubVV(x, q, C), box2d.b2SubVV(x, t, A), z = box2d.b2Min(z, w), x = box2d.b2Clamp(box2d.b2_baumgarte * (w + box2d.b2_linearSlop), -box2d.b2_maxLinearCorrection, 0), w = box2d.b2CrossVV(C, D), E = box2d.b2CrossVV(A, D), w = l + n + k * w * w + p * E * E, x = 0 < w ? -x / w : 0, box2d.b2MulSV(x, D, B), q.SelfMulSub(l, B), r -= k * box2d.b2CrossVV(C, B), t.SelfMulAdd(n, B), s += p * box2d.b2CrossVV(A, B);
        this.m_positions[f].a = r;
        this.m_positions[g].a = s
    }
    return z > -3 * box2d.b2_linearSlop
};
goog.exportProperty(box2d.b2ContactSolver.prototype, "SolvePositionConstraints", box2d.b2ContactSolver.prototype.SolvePositionConstraints);
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_xfA = new box2d.b2Transform;
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_xfB = new box2d.b2Transform;
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_psm = new box2d.b2PositionSolverManifold;
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_rA = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_rB = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints = function (a, b) {
    var c, e, d, f, g, h, l, k, m, n, p, q, r, t, s, u, v, y = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_xfA,
        D = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_xfB,
        x = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_psm,
        w, C, A, E = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_rA,
        B = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_rB,
        z, G = box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_P,
        F = 0;
    c = 0;
    for (e = this.m_count; c < e; ++c) {
        g = this.m_positionConstraints[c];
        h = g.indexA;
        l = g.indexB;
        k = g.localCenterA;
        m = g.localCenterB;
        f = g.pointCount;
        p = n = 0;
        if (h === a || h === b) n = g.invMassA, p = g.invIA;
        r = q = 0;
        if (l === a || l === b) q = g.invMassB, r = g.invIB;
        t = this.m_positions[h].c;
        s = this.m_positions[h].a;
        u = this.m_positions[l].c;
        v = this.m_positions[l].a;
        for (d = 0; d < f; ++d) y.q.SetAngleRadians(s), D.q.SetAngleRadians(v), box2d.b2SubVV(t, box2d.b2MulRV(y.q, k, box2d.b2Vec2.s_t0), y.p), box2d.b2SubVV(u, box2d.b2MulRV(D.q, m, box2d.b2Vec2.s_t0),
            D.p), x.Initialize(g, y, D, d), w = x.normal, C = x.point, A = x.separation, box2d.b2SubVV(C, t, E), box2d.b2SubVV(C, u, B), F = box2d.b2Min(F, A), C = box2d.b2Clamp(box2d.b2_toiBaumgarte * (A + box2d.b2_linearSlop), -box2d.b2_maxLinearCorrection, 0), A = box2d.b2CrossVV(E, w), z = box2d.b2CrossVV(B, w), A = n + q + p * A * A + r * z * z, C = 0 < A ? -C / A : 0, box2d.b2MulSV(C, w, G), t.SelfMulSub(n, G), s -= p * box2d.b2CrossVV(E, G), u.SelfMulAdd(q, G), v += r * box2d.b2CrossVV(B, G);
        this.m_positions[h].a = s;
        this.m_positions[l].a = v
    }
    return F >= -1.5 * box2d.b2_linearSlop
};
goog.exportProperty(box2d.b2ContactSolver.prototype, "SolveTOIPositionConstraints", box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints);
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_xfA = new box2d.b2Transform;
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_xfB = new box2d.b2Transform;
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_psm = new box2d.b2PositionSolverManifold;
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_rA = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_rB = new box2d.b2Vec2;
box2d.b2ContactSolver.prototype.SolveTOIPositionConstraints.s_P = new box2d.b2Vec2;
box2d.b2WorldCallbacks = {};
box2d.b2DestructionListener = function () {};
goog.exportSymbol("box2d.b2DestructionListener", box2d.b2DestructionListener);
box2d.b2DestructionListener.prototype.SayGoodbyeJoint = function (a) {};
goog.exportProperty(box2d.b2DestructionListener.prototype, "SayGoodbyeJoint", box2d.b2DestructionListener.prototype.SayGoodbyeJoint);
box2d.b2DestructionListener.prototype.SayGoodbyeFixture = function (a) {};
goog.exportProperty(box2d.b2DestructionListener.prototype, "SayGoodbyeFixture", box2d.b2DestructionListener.prototype.SayGoodbyeFixture);
box2d.b2ContactFilter = function () {};
goog.exportSymbol("box2d.b2ContactFilter", box2d.b2ContactFilter);
box2d.b2ContactFilter.prototype.ShouldCollide = function (a, b) {
    var c = a.GetFilterData(),
        e = b.GetFilterData();
    return c.groupIndex === e.groupIndex && 0 !== c.groupIndex ? 0 < c.groupIndex : 0 !== (c.maskBits & e.categoryBits) && 0 !== (c.categoryBits & e.maskBits)
};
goog.exportProperty(box2d.b2ContactFilter.prototype, "ShouldCollide", box2d.b2ContactFilter.prototype.ShouldCollide);
box2d.b2ContactFilter.b2_defaultFilter = new box2d.b2ContactFilter;
box2d.b2ContactImpulse = function () {
    this.normalImpulses = box2d.b2MakeNumberArray(box2d.b2_maxManifoldPoints);
    this.tangentImpulses = box2d.b2MakeNumberArray(box2d.b2_maxManifoldPoints)
};
goog.exportSymbol("box2d.b2ContactImpulse", box2d.b2ContactImpulse);
box2d.b2ContactImpulse.prototype.normalImpulses = null;
box2d.b2ContactImpulse.prototype.tangentImpulses = null;
box2d.b2ContactImpulse.prototype.count = 0;
box2d.b2ContactListener = function () {};
goog.exportSymbol("box2d.b2ContactListener", box2d.b2ContactListener);
box2d.b2ContactListener.prototype.BeginContact = function (a) {};
goog.exportProperty(box2d.b2ContactListener.prototype, "BeginContact", box2d.b2ContactListener.prototype.BeginContact);
box2d.b2ContactListener.prototype.EndContact = function (a) {};
goog.exportProperty(box2d.b2ContactListener.prototype, "EndContact", box2d.b2ContactListener.prototype.EndContact);
box2d.b2ContactListener.prototype.PreSolve = function (a, b) {};
goog.exportProperty(box2d.b2ContactListener.prototype, "PreSolve", box2d.b2ContactListener.prototype.PreSolve);
box2d.b2ContactListener.prototype.PostSolve = function (a, b) {};
goog.exportProperty(box2d.b2ContactListener.prototype, "PostSolve", box2d.b2ContactListener.prototype.PostSolve);
box2d.b2ContactListener.b2_defaultListener = new box2d.b2ContactListener;
goog.exportProperty(box2d.b2ContactListener, "b2_defaultListener", box2d.b2ContactListener.b2_defaultListener);
box2d.b2QueryCallback = function () {};
goog.exportSymbol("box2d.b2QueryCallback", box2d.b2QueryCallback);
box2d.b2QueryCallback.prototype.ReportFixture = function (a) {
    return !0
};
goog.exportProperty(box2d.b2QueryCallback.prototype, "ReportFixture", box2d.b2QueryCallback.prototype.ReportFixture);
box2d.b2RayCastCallback = function () {};
goog.exportSymbol("box2d.b2RayCastCallback", box2d.b2RayCastCallback);
box2d.b2RayCastCallback.prototype.ReportFixture = function (a, b, c, e) {
    return e
};
goog.exportProperty(box2d.b2RayCastCallback.prototype, "ReportFixture", box2d.b2RayCastCallback.prototype.ReportFixture);
box2d.b2Island = function () {
    this.m_bodies = Array(1024);
    this.m_contacts = Array(1024);
    this.m_joints = Array(1024);
    this.m_positions = box2d.b2Position.MakeArray(1024);
    this.m_velocities = box2d.b2Velocity.MakeArray(1024)
};
goog.exportSymbol("box2d.b2Island", box2d.b2Island);
box2d.b2Island.prototype.m_allocator = null;
goog.exportProperty(box2d.b2Island.prototype, "m_allocator", box2d.b2Island.prototype.m_allocator);
box2d.b2Island.prototype.m_listener = null;
goog.exportProperty(box2d.b2Island.prototype, "m_listener", box2d.b2Island.prototype.m_listener);
box2d.b2Island.prototype.m_bodies = null;
goog.exportProperty(box2d.b2Island.prototype, "m_bodies", box2d.b2Island.prototype.m_bodies);
box2d.b2Island.prototype.m_contacts = null;
goog.exportProperty(box2d.b2Island.prototype, "m_contacts", box2d.b2Island.prototype.m_contacts);
box2d.b2Island.prototype.m_joints = null;
goog.exportProperty(box2d.b2Island.prototype, "m_joints", box2d.b2Island.prototype.m_joints);
box2d.b2Island.prototype.m_positions = null;
goog.exportProperty(box2d.b2Island.prototype, "m_positions", box2d.b2Island.prototype.m_positions);
box2d.b2Island.prototype.m_velocities = null;
goog.exportProperty(box2d.b2Island.prototype, "m_velocities", box2d.b2Island.prototype.m_velocities);
box2d.b2Island.prototype.m_bodyCount = 0;
goog.exportProperty(box2d.b2Island.prototype, "m_bodyCount", box2d.b2Island.prototype.m_bodyCount);
box2d.b2Island.prototype.m_jointCount = 0;
goog.exportProperty(box2d.b2Island.prototype, "m_jointCount", box2d.b2Island.prototype.m_jointCount);
box2d.b2Island.prototype.m_contactCount = 0;
goog.exportProperty(box2d.b2Island.prototype, "m_contactCount", box2d.b2Island.prototype.m_contactCount);
box2d.b2Island.prototype.m_bodyCapacity = 0;
goog.exportProperty(box2d.b2Island.prototype, "m_bodyCapacity", box2d.b2Island.prototype.m_bodyCapacity);
box2d.b2Island.prototype.m_contactCapacity = 0;
goog.exportProperty(box2d.b2Island.prototype, "m_contactCapacity", box2d.b2Island.prototype.m_contactCapacity);
box2d.b2Island.prototype.m_jointCapacity = 0;
goog.exportProperty(box2d.b2Island.prototype, "m_jointCapacity", box2d.b2Island.prototype.m_jointCapacity);
box2d.b2Island.prototype.Initialize = function (a, b, c, e, d) {
    this.m_bodyCapacity = a;
    this.m_contactCapacity = b;
    this.m_jointCapacity = c;
    this.m_jointCount = this.m_contactCount = this.m_bodyCount = 0;
    this.m_allocator = e;
    for (this.m_listener = d; this.m_bodies.length < a;) this.m_bodies[this.m_bodies.length] = null;
    for (; this.m_contacts.length < b;) this.m_contacts[this.m_contacts.length] = null;
    for (; this.m_joints.length < c;) this.m_joints[this.m_joints.length] = null;
    if (this.m_positions.length < a)
        for (b = box2d.b2Max(2 * this.m_positions.length,
            a), box2d.DEBUG && window.console.log("box2d.b2Island.m_positions: " + b); this.m_positions.length < b;) this.m_positions[this.m_positions.length] = new box2d.b2Position;
    if (this.m_velocities.length < a)
        for (b = box2d.b2Max(2 * this.m_velocities.length, a), box2d.DEBUG && window.console.log("box2d.b2Island.m_velocities: " + b); this.m_velocities.length < b;) this.m_velocities[this.m_velocities.length] = new box2d.b2Velocity
};
goog.exportProperty(box2d.b2Island.prototype, "Initialize", box2d.b2Island.prototype.Initialize);
box2d.b2Island.prototype.Clear = function () {
    this.m_jointCount = this.m_contactCount = this.m_bodyCount = 0
};
goog.exportProperty(box2d.b2Island.prototype, "Clear", box2d.b2Island.prototype.Clear);
box2d.b2Island.prototype.AddBody = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(this.m_bodyCount < this.m_bodyCapacity);
    a.m_islandIndex = this.m_bodyCount;
    this.m_bodies[this.m_bodyCount++] = a
};
goog.exportProperty(box2d.b2Island.prototype, "AddBody", box2d.b2Island.prototype.AddBody);
box2d.b2Island.prototype.AddContact = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(this.m_contactCount < this.m_contactCapacity);
    this.m_contacts[this.m_contactCount++] = a
};
goog.exportProperty(box2d.b2Island.prototype, "AddContact", box2d.b2Island.prototype.AddContact);
box2d.b2Island.prototype.AddJoint = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(this.m_jointCount < this.m_jointCapacity);
    this.m_joints[this.m_jointCount++] = a
};
goog.exportProperty(box2d.b2Island.prototype, "AddJoint", box2d.b2Island.prototype.AddJoint);
box2d.b2Island.prototype.Solve = function (a, b, c, e) {
    for (var d = box2d.b2Island.s_timer.Reset(), f = b.dt, g = 0; g < this.m_bodyCount; ++g) {
        var h = this.m_bodies[g],
            l = this.m_positions[g].c.Copy(h.m_sweep.c),
            k = h.m_sweep.a,
            m = this.m_velocities[g].v.Copy(h.m_linearVelocity),
            n = h.m_angularVelocity;
        h.m_sweep.c0.Copy(h.m_sweep.c);
        h.m_sweep.a0 = h.m_sweep.a;
        h.m_type === box2d.b2BodyType.b2_dynamicBody && (m.x += f * (h.m_gravityScale * c.x + h.m_invMass * h.m_force.x), m.y += f * (h.m_gravityScale * c.y + h.m_invMass * h.m_force.y), n += f * h.m_invI * h.m_torque,
            m.SelfMul(1 / (1 + f * h.m_linearDamping)), n *= 1 / (1 + f * h.m_angularDamping));
        this.m_positions[g].a = k;
        this.m_velocities[g].w = n
    }
    d.Reset();
    h = box2d.b2Island.s_solverData;
    h.step.Copy(b);
    h.positions = this.m_positions;
    h.velocities = this.m_velocities;
    g = box2d.b2Island.s_contactSolverDef;
    g.step.Copy(b);
    g.contacts = this.m_contacts;
    g.count = this.m_contactCount;
    g.positions = this.m_positions;
    g.velocities = this.m_velocities;
    g.allocator = this.m_allocator;
    c = box2d.b2Island.s_contactSolver.Initialize(g);
    c.InitializeVelocityConstraints();
    b.warmStarting && c.WarmStart();
    for (g = 0; g < this.m_jointCount; ++g) this.m_joints[g].InitVelocityConstraints(h);
    a.solveInit = d.GetMilliseconds();
    d.Reset();
    for (g = 0; g < b.velocityIterations; ++g) {
        for (k = 0; k < this.m_jointCount; ++k) this.m_joints[k].SolveVelocityConstraints(h);
        c.SolveVelocityConstraints()
    }
    c.StoreImpulses();
    a.solveVelocity = d.GetMilliseconds();
    for (g = 0; g < this.m_bodyCount; ++g) {
        var l = this.m_positions[g].c,
            k = this.m_positions[g].a,
            m = this.m_velocities[g].v,
            n = this.m_velocities[g].w,
            p = box2d.b2MulSV(f, m, box2d.b2Island.s_translation);
        box2d.b2DotVV(p, p) > box2d.b2_maxTranslationSquared && (p = box2d.b2_maxTranslation / p.GetLength(), m.SelfMul(p));
        p = f * n;
        p * p > box2d.b2_maxRotationSquared && (p = box2d.b2_maxRotation / box2d.b2Abs(p), n *= p);
        l.x += f * m.x;
        l.y += f * m.y;
        k += f * n;
        this.m_positions[g].a = k;
        this.m_velocities[g].w = n
    }
    d.Reset();
    l = !1;
    for (g = 0; g < b.positionIterations; ++g) {
        m = c.SolvePositionConstraints();
        n = !0;
        for (k = 0; k < this.m_jointCount; ++k) p = this.m_joints[k].SolvePositionConstraints(h), n = n && p;
        if (m && n) {
            l = !0;
            break
        }
    }
    for (g = 0; g < this.m_bodyCount; ++g) b = this.m_bodies[g],
    b.m_sweep.c.Copy(this.m_positions[g].c), b.m_sweep.a = this.m_positions[g].a, b.m_linearVelocity.Copy(this.m_velocities[g].v), b.m_angularVelocity = this.m_velocities[g].w, b.SynchronizeTransform();
    a.solvePosition = d.GetMilliseconds();
    this.Report(c.m_velocityConstraints);
    if (e) {
        a = box2d.b2_maxFloat;
        e = box2d.b2_linearSleepTolerance * box2d.b2_linearSleepTolerance;
        d = box2d.b2_angularSleepTolerance * box2d.b2_angularSleepTolerance;
        for (g = 0; g < this.m_bodyCount; ++g) h = this.m_bodies[g], h.GetType() !== box2d.b2BodyType.b2_staticBody &&
            (0 === (h.m_flags & box2d.b2BodyFlag.e_autoSleepFlag) || h.m_angularVelocity * h.m_angularVelocity > d || box2d.b2DotVV(h.m_linearVelocity, h.m_linearVelocity) > e ? a = h.m_sleepTime = 0 : (h.m_sleepTime += f, a = box2d.b2Min(a, h.m_sleepTime)));
        if (a >= box2d.b2_timeToSleep && l)
            for (g = 0; g < this.m_bodyCount; ++g) h = this.m_bodies[g], h.SetAwake(!1)
    }
};
goog.exportProperty(box2d.b2Island.prototype, "Solve", box2d.b2Island.prototype.Solve);
box2d.b2Island.prototype.SolveTOI = function (a, b, c) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(b < this.m_bodyCount);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(c < this.m_bodyCount);
    for (var e = 0; e < this.m_bodyCount; ++e) {
        var d = this.m_bodies[e];
        this.m_positions[e].c.Copy(d.m_sweep.c);
        this.m_positions[e].a = d.m_sweep.a;
        this.m_velocities[e].v.Copy(d.m_linearVelocity);
        this.m_velocities[e].w = d.m_angularVelocity
    }
    e = box2d.b2Island.s_contactSolverDef;
    e.contacts = this.m_contacts;
    e.count = this.m_contactCount;
    e.allocator = this.m_allocator;
    e.step.Copy(a);
    e.positions = this.m_positions;
    e.velocities = this.m_velocities;
    d = box2d.b2Island.s_contactSolver.Initialize(e);
    for (e = 0; e < a.positionIterations && !d.SolveTOIPositionConstraints(b, c); ++e);
    this.m_bodies[b].m_sweep.c0.Copy(this.m_positions[b].c);
    this.m_bodies[b].m_sweep.a0 = this.m_positions[b].a;
    this.m_bodies[c].m_sweep.c0.Copy(this.m_positions[c].c);
    this.m_bodies[c].m_sweep.a0 = this.m_positions[c].a;
    d.InitializeVelocityConstraints();
    for (e = 0; e < a.velocityIterations; ++e) d.SolveVelocityConstraints();
    a = a.dt;
    for (e = 0; e < this.m_bodyCount; ++e) {
        b = this.m_positions[e].c;
        c = this.m_positions[e].a;
        var f = this.m_velocities[e].v,
            g = this.m_velocities[e].w,
            h = box2d.b2MulSV(a, f, box2d.b2Island.s_translation);
        box2d.b2DotVV(h, h) > box2d.b2_maxTranslationSquared && (h = box2d.b2_maxTranslation / h.GetLength(), f.SelfMul(h));
        h = a * g;
        h * h > box2d.b2_maxRotationSquared && (h = box2d.b2_maxRotation / box2d.b2Abs(h), g *= h);
        b.SelfMulAdd(a, f);
        c += a * g;
        this.m_positions[e].a = c;
        this.m_velocities[e].w = g;
        h = this.m_bodies[e];
        h.m_sweep.c.Copy(b);
        h.m_sweep.a =
            c;
        h.m_linearVelocity.Copy(f);
        h.m_angularVelocity = g;
        h.SynchronizeTransform()
    }
    this.Report(d.m_velocityConstraints)
};
goog.exportProperty(box2d.b2Island.prototype, "SolveTOI", box2d.b2Island.prototype.SolveTOI);
box2d.b2Island.prototype.Report = function (a) {
    if (null !== this.m_listener)
        for (var b = 0; b < this.m_contactCount; ++b) {
            var c = this.m_contacts[b];
            if (c) {
                var e = a[b],
                    d = box2d.b2Island.s_impulse;
                d.count = e.pointCount;
                for (var f = 0; f < e.pointCount; ++f) d.normalImpulses[f] = e.points[f].normalImpulse, d.tangentImpulses[f] = e.points[f].tangentImpulse;
                this.m_listener.PostSolve(c, d)
            }
        }
};
goog.exportProperty(box2d.b2Island.prototype, "Report", box2d.b2Island.prototype.Report);
box2d.b2Island.s_timer = new box2d.b2Timer;
box2d.b2Island.s_solverData = new box2d.b2SolverData;
box2d.b2Island.s_contactSolverDef = new box2d.b2ContactSolverDef;
box2d.b2Island.s_contactSolver = new box2d.b2ContactSolver;
box2d.b2Island.s_translation = new box2d.b2Vec2;
box2d.b2Island.s_impulse = new box2d.b2ContactImpulse;
box2d.b2ContactRegister = function () {};
goog.exportSymbol("box2d.b2ContactRegister", box2d.b2ContactRegister);
box2d.b2ContactRegister.prototype.createFcn = null;
box2d.b2ContactRegister.prototype.destroyFcn = null;
box2d.b2ContactRegister.prototype.primary = !1;
box2d.b2ContactFactory = function (a) {
    this.m_allocator = a;
    this.InitializeRegisters()
};
goog.exportSymbol("box2d.b2ContactFactory", box2d.b2ContactFactory);
box2d.b2ContactFactory.prototype.m_allocator = null;
box2d.b2ContactFactory.prototype.AddType = function (a, b, c, e) {
    var d = box2d.b2MakeArray(256, function (b) {
        return a()
    });
    b = function (b) {
        return 0 < d.length ? d.pop() : a(b)
    };
    var f = function (a, b) {
        d.push(a)
    };
    this.m_registers[c][e].pool = d;
    this.m_registers[c][e].createFcn = b;
    this.m_registers[c][e].destroyFcn = f;
    this.m_registers[c][e].primary = !0;
    c !== e && (this.m_registers[e][c].pool = d, this.m_registers[e][c].createFcn = b, this.m_registers[e][c].destroyFcn = f, this.m_registers[e][c].primary = !1)
};
goog.exportProperty(box2d.b2ContactFactory.prototype, "AddType", box2d.b2ContactFactory.prototype.AddType);
box2d.b2ContactFactory.prototype.InitializeRegisters = function () {
    this.m_registers = Array(box2d.b2ShapeType.e_shapeTypeCount);
    for (var a = 0; a < box2d.b2ShapeType.e_shapeTypeCount; a++) {
        this.m_registers[a] = Array(box2d.b2ShapeType.e_shapeTypeCount);
        for (var b = 0; b < box2d.b2ShapeType.e_shapeTypeCount; b++) this.m_registers[a][b] = new box2d.b2ContactRegister
    }
    this.AddType(box2d.b2CircleContact.Create, box2d.b2CircleContact.Destroy, box2d.b2ShapeType.e_circleShape, box2d.b2ShapeType.e_circleShape);
    this.AddType(box2d.b2PolygonAndCircleContact.Create,
        box2d.b2PolygonAndCircleContact.Destroy, box2d.b2ShapeType.e_polygonShape, box2d.b2ShapeType.e_circleShape);
    this.AddType(box2d.b2PolygonContact.Create, box2d.b2PolygonContact.Destroy, box2d.b2ShapeType.e_polygonShape, box2d.b2ShapeType.e_polygonShape);
    this.AddType(box2d.b2EdgeAndCircleContact.Create, box2d.b2EdgeAndCircleContact.Destroy, box2d.b2ShapeType.e_edgeShape, box2d.b2ShapeType.e_circleShape);
    this.AddType(box2d.b2EdgeAndPolygonContact.Create, box2d.b2EdgeAndPolygonContact.Destroy, box2d.b2ShapeType.e_edgeShape,
        box2d.b2ShapeType.e_polygonShape);
    this.AddType(box2d.b2ChainAndCircleContact.Create, box2d.b2ChainAndCircleContact.Destroy, box2d.b2ShapeType.e_chainShape, box2d.b2ShapeType.e_circleShape);
    this.AddType(box2d.b2ChainAndPolygonContact.Create, box2d.b2ChainAndPolygonContact.Destroy, box2d.b2ShapeType.e_chainShape, box2d.b2ShapeType.e_polygonShape)
};
goog.exportProperty(box2d.b2ContactFactory.prototype, "InitializeRegisters", box2d.b2ContactFactory.prototype.InitializeRegisters);
box2d.b2ContactFactory.prototype.Create = function (a, b, c, e) {
    var d = a.GetType(),
        f = c.GetType();
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= d && d < box2d.b2ShapeType.e_shapeTypeCount);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= f && f < box2d.b2ShapeType.e_shapeTypeCount);
    d = this.m_registers[d][f];
    f = d.createFcn;
    return null !== f ? (d.primary ? (d = f(this.m_allocator), d.Reset(a, b, c, e)) : (d = f(this.m_allocator), d.Reset(c, e, a, b)), d) : null
};
goog.exportProperty(box2d.b2ContactFactory.prototype, "Create", box2d.b2ContactFactory.prototype.Create);
box2d.b2ContactFactory.prototype.Destroy = function (a) {
    var b = a.m_fixtureA,
        c = a.m_fixtureB;
    0 < a.m_manifold.pointCount && !1 === b.IsSensor() && !1 === c.IsSensor() && (b.GetBody().SetAwake(!0), c.GetBody().SetAwake(!0));
    b = b.GetType();
    c = c.GetType();
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= b && c < box2d.b2ShapeType.e_shapeTypeCount);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= b && c < box2d.b2ShapeType.e_shapeTypeCount);
    c = this.m_registers[b][c].destroyFcn;
    c(a, this.m_allocator)
};
goog.exportProperty(box2d.b2ContactFactory.prototype, "Destroy", box2d.b2ContactFactory.prototype.Destroy);
box2d.b2GrowableStack = function (a) {
    this.m_stack = Array(a)
};
goog.exportSymbol("box2d.b2GrowableStack", box2d.b2GrowableStack);
box2d.b2GrowableStack.prototype.m_stack = null;
goog.exportProperty(box2d.b2GrowableStack.prototype, "m_stack", box2d.b2GrowableStack.prototype.m_stack);
box2d.b2GrowableStack.prototype.m_count = 0;
goog.exportProperty(box2d.b2GrowableStack.prototype, "m_count", box2d.b2GrowableStack.prototype.m_count);
box2d.b2GrowableStack.prototype.Reset = function () {
    this.m_count = 0;
    return this
};
goog.exportProperty(box2d.b2GrowableStack.prototype, "Reset", box2d.b2GrowableStack.prototype.Reset);
box2d.b2GrowableStack.prototype.Push = function (a) {
    this.m_stack[this.m_count] = a;
    ++this.m_count
};
goog.exportProperty(box2d.b2GrowableStack.prototype, "Push", box2d.b2GrowableStack.prototype.Push);
box2d.b2GrowableStack.prototype.Pop = function () {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_count);
    --this.m_count;
    var a = this.m_stack[this.m_count];
    this.m_stack[this.m_count] = null;
    return a
};
goog.exportProperty(box2d.b2GrowableStack.prototype, "Pop", box2d.b2GrowableStack.prototype.Pop);
box2d.b2GrowableStack.prototype.GetCount = function () {
    return this.m_count
};
goog.exportProperty(box2d.b2GrowableStack.prototype, "GetCount", box2d.b2GrowableStack.prototype.GetCount);
box2d.b2TreeNode = function (a) {
    this.m_id = a || 0;
    this.aabb = new box2d.b2AABB
};
goog.exportSymbol("box2d.b2TreeNode", box2d.b2TreeNode);
box2d.b2TreeNode.prototype.m_id = 0;
goog.exportProperty(box2d.b2TreeNode.prototype, "m_id", box2d.b2TreeNode.prototype.m_id);
box2d.b2TreeNode.prototype.aabb = null;
goog.exportProperty(box2d.b2TreeNode.prototype, "aabb", box2d.b2TreeNode.prototype.aabb);
box2d.b2TreeNode.prototype.userData = null;
goog.exportProperty(box2d.b2TreeNode.prototype, "userData", box2d.b2TreeNode.prototype.userData);
box2d.b2TreeNode.prototype.parent = null;
goog.exportProperty(box2d.b2TreeNode.prototype, "parent", box2d.b2TreeNode.prototype.parent);
box2d.b2TreeNode.prototype.child1 = null;
goog.exportProperty(box2d.b2TreeNode.prototype, "child1", box2d.b2TreeNode.prototype.child1);
box2d.b2TreeNode.prototype.child2 = null;
goog.exportProperty(box2d.b2TreeNode.prototype, "child2", box2d.b2TreeNode.prototype.child2);
box2d.b2TreeNode.prototype.height = 0;
goog.exportProperty(box2d.b2TreeNode.prototype, "height", box2d.b2TreeNode.prototype.height);
box2d.b2TreeNode.prototype.IsLeaf = function () {
    return null === this.child1
};
goog.exportProperty(box2d.b2TreeNode.prototype, "IsLeaf", box2d.b2TreeNode.prototype.IsLeaf);
box2d.b2DynamicTree = function () {};
goog.exportSymbol("box2d.b2DynamicTree", box2d.b2DynamicTree);
box2d.b2DynamicTree.prototype.m_root = null;
goog.exportProperty(box2d.b2DynamicTree.prototype, "m_root", box2d.b2DynamicTree.prototype.m_root);
box2d.b2DynamicTree.prototype.m_freeList = null;
goog.exportProperty(box2d.b2DynamicTree.prototype, "m_freeList", box2d.b2DynamicTree.prototype.m_freeList);
box2d.b2DynamicTree.prototype.m_path = 0;
goog.exportProperty(box2d.b2DynamicTree.prototype, "m_path", box2d.b2DynamicTree.prototype.m_path);
box2d.b2DynamicTree.prototype.m_insertionCount = 0;
goog.exportProperty(box2d.b2DynamicTree.prototype, "m_insertionCount", box2d.b2DynamicTree.prototype.m_insertionCount);
box2d.b2DynamicTree.s_stack = new box2d.b2GrowableStack(256);
box2d.b2DynamicTree.s_r = new box2d.b2Vec2;
box2d.b2DynamicTree.s_v = new box2d.b2Vec2;
box2d.b2DynamicTree.s_abs_v = new box2d.b2Vec2;
box2d.b2DynamicTree.s_segmentAABB = new box2d.b2AABB;
box2d.b2DynamicTree.s_subInput = new box2d.b2RayCastInput;
box2d.b2DynamicTree.s_combinedAABB = new box2d.b2AABB;
box2d.b2DynamicTree.s_aabb = new box2d.b2AABB;
box2d.b2DynamicTree.prototype.GetUserData = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(null !== a);
    return a.userData
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "GetUserData", box2d.b2DynamicTree.prototype.GetUserData);
box2d.b2DynamicTree.prototype.GetFatAABB = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(null !== a);
    return a.aabb
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "GetFatAABB", box2d.b2DynamicTree.prototype.GetFatAABB);
box2d.b2DynamicTree.prototype.Query = function (a, b) {
    if (null !== this.m_root) {
        var c = box2d.b2DynamicTree.s_stack.Reset();
        for (c.Push(this.m_root); 0 < c.GetCount();) {
            var e = c.Pop();
            if (null !== e && e.aabb.TestOverlap(b))
                if (e.IsLeaf()) {
                    if (!1 === a(e)) break
                } else c.Push(e.child1), c.Push(e.child2)
        }
    }
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "Query", box2d.b2DynamicTree.prototype.Query);
box2d.b2DynamicTree.prototype.RayCast = function (a, b) {
    if (null !== this.m_root) {
        var c = b.p1,
            e = b.p2,
            d = box2d.b2SubVV(e, c, box2d.b2DynamicTree.s_r);
        box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < d.GetLengthSquared());
        d.Normalize();
        var d = box2d.b2CrossOneV(d, box2d.b2DynamicTree.s_v),
            f = box2d.b2AbsV(d, box2d.b2DynamicTree.s_abs_v),
            g = b.maxFraction,
            h = box2d.b2DynamicTree.s_segmentAABB,
            l = c.x + g * (e.x - c.x),
            k = c.y + g * (e.y - c.y);
        h.lowerBound.x = box2d.b2Min(c.x, l);
        h.lowerBound.y = box2d.b2Min(c.y, k);
        h.upperBound.x = box2d.b2Max(c.x, l);
        h.upperBound.y =
            box2d.b2Max(c.y, k);
        var m = box2d.b2DynamicTree.s_stack.Reset();
        for (m.Push(this.m_root); 0 < m.GetCount();)
            if (l = m.Pop(), null !== l && !1 !== box2d.b2TestOverlapAABB(l.aabb, h)) {
                var k = l.aabb.GetCenter(),
                    n = l.aabb.GetExtents();
                if (!(0 < box2d.b2Abs(box2d.b2DotVV(d, box2d.b2SubVV(c, k, box2d.b2Vec2.s_t0))) - box2d.b2DotVV(f, n)))
                    if (l.IsLeaf()) {
                        k = box2d.b2DynamicTree.s_subInput;
                        k.p1.Copy(b.p1);
                        k.p2.Copy(b.p2);
                        k.maxFraction = g;
                        l = a(k, l);
                        if (0 === l) break;
                        0 < l && (g = l, l = c.x + g * (e.x - c.x), k = c.y + g * (e.y - c.y), h.lowerBound.x = box2d.b2Min(c.x,
                            l), h.lowerBound.y = box2d.b2Min(c.y, k), h.upperBound.x = box2d.b2Max(c.x, l), h.upperBound.y = box2d.b2Max(c.y, k))
                    } else m.Push(l.child1), m.Push(l.child2)
            }
    }
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "RayCast", box2d.b2DynamicTree.prototype.RayCast);
box2d.b2DynamicTree.prototype.AllocateNode = function () {
    if (this.m_freeList) {
        var a = this.m_freeList;
        this.m_freeList = a.parent;
        a.parent = null;
        a.child1 = null;
        a.child2 = null;
        a.height = 0;
        a.userData = null;
        return a
    }
    return new box2d.b2TreeNode(box2d.b2DynamicTree.prototype.s_node_id++)
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "AllocateNode", box2d.b2DynamicTree.prototype.AllocateNode);
box2d.b2DynamicTree.prototype.s_node_id = 0;
box2d.b2DynamicTree.prototype.FreeNode = function (a) {
    a.parent = this.m_freeList;
    a.height = -1;
    this.m_freeList = a
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "FreeNode", box2d.b2DynamicTree.prototype.FreeNode);
box2d.b2DynamicTree.prototype.CreateProxy = function (a, b) {
    var c = this.AllocateNode(),
        e = box2d.b2_aabbExtension,
        d = box2d.b2_aabbExtension;
    c.aabb.lowerBound.x = a.lowerBound.x - e;
    c.aabb.lowerBound.y = a.lowerBound.y - d;
    c.aabb.upperBound.x = a.upperBound.x + e;
    c.aabb.upperBound.y = a.upperBound.y + d;
    c.userData = b;
    c.height = 0;
    this.InsertLeaf(c);
    return c
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "CreateProxy", box2d.b2DynamicTree.prototype.CreateProxy);
box2d.b2DynamicTree.prototype.DestroyProxy = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a.IsLeaf());
    this.RemoveLeaf(a);
    this.FreeNode(a)
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "DestroyProxy", box2d.b2DynamicTree.prototype.DestroyProxy);
box2d.b2DynamicTree.prototype.MoveProxy = function (a, b, c) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a.IsLeaf());
    if (a.aabb.Contains(b)) return !1;
    this.RemoveLeaf(a);
    var e = box2d.b2_aabbExtension + box2d.b2_aabbMultiplier * (0 < c.x ? c.x : -c.x);
    c = box2d.b2_aabbExtension + box2d.b2_aabbMultiplier * (0 < c.y ? c.y : -c.y);
    a.aabb.lowerBound.x = b.lowerBound.x - e;
    a.aabb.lowerBound.y = b.lowerBound.y - c;
    a.aabb.upperBound.x = b.upperBound.x + e;
    a.aabb.upperBound.y = b.upperBound.y + c;
    this.InsertLeaf(a);
    return !0
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "MoveProxy", box2d.b2DynamicTree.prototype.MoveProxy);
box2d.b2DynamicTree.prototype.InsertLeaf = function (a) {
    ++this.m_insertionCount;
    if (null === this.m_root) this.m_root = a, this.m_root.parent = null;
    else {
        var b = a.aabb;
        b.GetCenter();
        for (var c = this.m_root, e, d; !1 === c.IsLeaf();) {
            e = c.child1;
            d = c.child2;
            var f = c.aabb.GetPerimeter(),
                g = box2d.b2DynamicTree.s_combinedAABB;
            g.Combine2(c.aabb, b);
            var h = g.GetPerimeter(),
                g = 2 * h,
                h = 2 * (h - f),
                l = box2d.b2DynamicTree.s_aabb,
                k, m;
            e.IsLeaf() ? (l.Combine2(b, e.aabb), f = l.GetPerimeter() + h) : (l.Combine2(b, e.aabb), k = e.aabb.GetPerimeter(), m = l.GetPerimeter(),
                f = m - k + h);
            d.IsLeaf() ? (l.Combine2(b, d.aabb), h = l.GetPerimeter() + h) : (l.Combine2(b, d.aabb), k = d.aabb.GetPerimeter(), m = l.GetPerimeter(), h = m - k + h);
            if (g < f && g < h) break;
            c = f < h ? e : d
        }
        e = c.parent;
        d = this.AllocateNode();
        d.parent = e;
        d.userData = null;
        d.aabb.Combine2(b, c.aabb);
        d.height = c.height + 1;
        e ? (e.child1 === c ? e.child1 = d : e.child2 = d, d.child1 = c, d.child2 = a, c.parent = d, a.parent = d) : (d.child1 = c, d.child2 = a, c.parent = d, this.m_root = a.parent = d);
        for (c = a.parent; null !== c;) c = this.Balance(c), e = c.child1, d = c.child2, box2d.ENABLE_ASSERTS && box2d.b2Assert(null !==
            e), box2d.ENABLE_ASSERTS && box2d.b2Assert(null !== d), c.height = 1 + box2d.b2Max(e.height, d.height), c.aabb.Combine2(e.aabb, d.aabb), c = c.parent
    }
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "InsertLeaf", box2d.b2DynamicTree.prototype.InsertLeaf);
box2d.b2DynamicTree.prototype.RemoveLeaf = function (a) {
    if (a === this.m_root) this.m_root = null;
    else {
        var b = a.parent,
            c = b.parent;
        a = b.child1 === a ? b.child2 : b.child1;
        if (c)
            for (c.child1 === b ? c.child1 = a : c.child2 = a, a.parent = c, this.FreeNode(b), b = c; b;) b = this.Balance(b), c = b.child1, a = b.child2, b.aabb.Combine2(c.aabb, a.aabb), b.height = 1 + box2d.b2Max(c.height, a.height), b = b.parent;
        else this.m_root = a, a.parent = null, this.FreeNode(b)
    }
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "RemoveLeaf", box2d.b2DynamicTree.prototype.RemoveLeaf);
box2d.b2DynamicTree.prototype.Balance = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(null !== a);
    if (a.IsLeaf() || 2 > a.height) return a;
    var b = a.child1,
        c = a.child2,
        e = c.height - b.height;
    if (1 < e) {
        var e = c.child1,
            d = c.child2;
        c.child1 = a;
        c.parent = a.parent;
        a.parent = c;
        null !== c.parent ? c.parent.child1 === a ? c.parent.child1 = c : (box2d.ENABLE_ASSERTS && box2d.b2Assert(c.parent.child2 === a), c.parent.child2 = c) : this.m_root = c;
        e.height > d.height ? (c.child2 = e, a.child2 = d, d.parent = a, a.aabb.Combine2(b.aabb, d.aabb), c.aabb.Combine2(a.aabb,
            e.aabb), a.height = 1 + box2d.b2Max(b.height, d.height), c.height = 1 + box2d.b2Max(a.height, e.height)) : (c.child2 = d, a.child2 = e, e.parent = a, a.aabb.Combine2(b.aabb, e.aabb), c.aabb.Combine2(a.aabb, d.aabb), a.height = 1 + box2d.b2Max(b.height, e.height), c.height = 1 + box2d.b2Max(a.height, d.height));
        return c
    }
    return -1 > e ? (e = b.child1, d = b.child2, b.child1 = a, b.parent = a.parent, a.parent = b, null !== b.parent ? b.parent.child1 === a ? b.parent.child1 = b : (box2d.ENABLE_ASSERTS && box2d.b2Assert(b.parent.child2 === a), b.parent.child2 = b) : this.m_root =
        b, e.height > d.height ? (b.child2 = e, a.child1 = d, d.parent = a, a.aabb.Combine2(c.aabb, d.aabb), b.aabb.Combine2(a.aabb, e.aabb), a.height = 1 + box2d.b2Max(c.height, d.height), b.height = 1 + box2d.b2Max(a.height, e.height)) : (b.child2 = d, a.child1 = e, e.parent = a, a.aabb.Combine2(c.aabb, e.aabb), b.aabb.Combine2(a.aabb, d.aabb), a.height = 1 + box2d.b2Max(c.height, e.height), b.height = 1 + box2d.b2Max(a.height, d.height)), b) : a
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "Balance", box2d.b2DynamicTree.prototype.Balance);
box2d.b2DynamicTree.prototype.GetHeight = function () {
    return null === this.m_root ? 0 : this.m_root.height
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "GetHeight", box2d.b2DynamicTree.prototype.GetHeight);
box2d.b2DynamicTree.prototype.GetAreaRatio = function () {
    if (null === this.m_root) return 0;
    var a = this.m_root.aabb.GetPerimeter(),
        b = function (a) {
            if (null === a || a.IsLeaf()) return 0;
            var e = a.aabb.GetPerimeter(),
                e = e + b(a.child1);
            return e += b(a.child2)
        };
    return b(this.m_root) / a
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "GetAreaRatio", box2d.b2DynamicTree.prototype.GetAreaRatio);
box2d.b2DynamicTree.prototype.ComputeHeightNode = function (a) {
    if (a.IsLeaf()) return 0;
    var b = this.ComputeHeightNode(a.child1);
    a = this.ComputeHeightNode(a.child2);
    return 1 + box2d.b2Max(b, a)
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "ComputeHeightNode", box2d.b2DynamicTree.prototype.ComputeHeightNode);
box2d.b2DynamicTree.prototype.ComputeHeight = function () {
    return this.ComputeHeightNode(this.m_root)
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "ComputeHeight", box2d.b2DynamicTree.prototype.ComputeHeight);
box2d.b2DynamicTree.prototype.ValidateStructure = function (a) {
    if (null !== a) {
        a === this.m_root && box2d.ENABLE_ASSERTS && box2d.b2Assert(null === a.parent);
        var b = a.child1,
            c = a.child2;
        a.IsLeaf() ? (box2d.ENABLE_ASSERTS && box2d.b2Assert(null === b), box2d.ENABLE_ASSERTS && box2d.b2Assert(null === c), box2d.ENABLE_ASSERTS && box2d.b2Assert(0 === a.height)) : (box2d.ENABLE_ASSERTS && box2d.b2Assert(b.parent === a), box2d.ENABLE_ASSERTS && box2d.b2Assert(c.parent === a), this.ValidateStructure(b), this.ValidateStructure(c))
    }
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "ValidateStructure", box2d.b2DynamicTree.prototype.ValidateStructure);
box2d.b2DynamicTree.prototype.ValidateMetrics = function (a) {
    if (null !== a) {
        var b = a.child1,
            c = a.child2;
        if (a.IsLeaf()) box2d.ENABLE_ASSERTS && box2d.b2Assert(null === b), box2d.ENABLE_ASSERTS && box2d.b2Assert(null === c), box2d.ENABLE_ASSERTS && box2d.b2Assert(0 === a.height);
        else {
            var e;
            e = 1 + box2d.b2Max(b.height, c.height);
            box2d.ENABLE_ASSERTS && box2d.b2Assert(a.height === e);
            e = box2d.b2DynamicTree.s_aabb;
            e.Combine2(b.aabb, c.aabb);
            box2d.ENABLE_ASSERTS && box2d.b2Assert(e.lowerBound === a.aabb.lowerBound);
            box2d.ENABLE_ASSERTS &&
                box2d.b2Assert(e.upperBound === a.aabb.upperBound);
            this.ValidateMetrics(b);
            this.ValidateMetrics(c)
        }
    }
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "ValidateMetrics", box2d.b2DynamicTree.prototype.ValidateMetrics);
box2d.b2DynamicTree.prototype.Validate = function () {
    this.ValidateStructure(this.m_root);
    this.ValidateMetrics(this.m_root);
    for (var a = 0, b = this.m_freeList; null !== b;) b = b.parent, ++a;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(this.GetHeight() === this.ComputeHeight())
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "Validate", box2d.b2DynamicTree.prototype.Validate);
box2d.b2DynamicTree.prototype.GetMaxBalance = function () {
    var a;
    a = this.m_root;
    null === a ? a = 0 : 1 >= a.height ? a = 0 : (box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 === a.IsLeaf()), a = box2d.b2Abs(a.child2.height - a.child1.height), a = box2d.b2Max(0, a));
    return a
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "GetMaxBalance", box2d.b2DynamicTree.prototype.GetMaxBalance);
box2d.b2DynamicTree.prototype.RebuildBottomUp = function () {
    this.Validate()
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "RebuildBottomUp", box2d.b2DynamicTree.prototype.RebuildBottomUp);
box2d.b2DynamicTree.prototype.ShiftOrigin = function (a) {
    var b = function (a, e) {
        if (null !== a && !(1 >= a.height)) {
            box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 === a.IsLeaf());
            var d = a.child2;
            b(a.child1, e);
            b(d, e);
            a.aabb.lowerBound.SelfSub(e);
            a.aabb.upperBound.SelfSub(e)
        }
    };
    b(this.m_root, a)
};
goog.exportProperty(box2d.b2DynamicTree.prototype, "ShiftOrigin", box2d.b2DynamicTree.prototype.ShiftOrigin);
box2d.b2Pair = function () {};
goog.exportSymbol("box2d.b2Pair", box2d.b2Pair);
box2d.b2Pair.prototype.proxyA = null;
goog.exportProperty(box2d.b2Pair.prototype, "proxyA", box2d.b2Pair.prototype.proxyA);
box2d.b2Pair.prototype.proxyB = null;
goog.exportProperty(box2d.b2Pair.prototype, "proxyB", box2d.b2Pair.prototype.proxyB);
box2d.b2BroadPhase = function () {
    this.m_tree = new box2d.b2DynamicTree;
    this.m_moveBuffer = [];
    this.m_pairBuffer = []
};
goog.exportSymbol("box2d.b2BroadPhase", box2d.b2BroadPhase);
box2d.b2BroadPhase.prototype.m_tree = null;
goog.exportProperty(box2d.b2BroadPhase.prototype, "m_tree", box2d.b2BroadPhase.prototype.m_tree);
box2d.b2BroadPhase.prototype.m_proxyCount = 0;
goog.exportProperty(box2d.b2BroadPhase.prototype, "m_proxyCount", box2d.b2BroadPhase.prototype.m_proxyCount);
box2d.b2BroadPhase.prototype.m_moveCount = 0;
goog.exportProperty(box2d.b2BroadPhase.prototype, "m_moveCount", box2d.b2BroadPhase.prototype.m_moveCount);
box2d.b2BroadPhase.prototype.m_moveBuffer = null;
goog.exportProperty(box2d.b2BroadPhase.prototype, "m_moveBuffer", box2d.b2BroadPhase.prototype.m_moveBuffer);
box2d.b2BroadPhase.prototype.m_pairCount = 0;
goog.exportProperty(box2d.b2BroadPhase.prototype, "m_pairCount", box2d.b2BroadPhase.prototype.m_pairCount);
box2d.b2BroadPhase.prototype.m_pairBuffer = null;
goog.exportProperty(box2d.b2BroadPhase.prototype, "m_pairBuffer", box2d.b2BroadPhase.prototype.m_pairBuffer);
box2d.b2BroadPhase.prototype.CreateProxy = function (a, b) {
    var c = this.m_tree.CreateProxy(a, b);
    ++this.m_proxyCount;
    this.BufferMove(c);
    return c
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "CreateProxy", box2d.b2BroadPhase.prototype.CreateProxy);
box2d.b2BroadPhase.prototype.DestroyProxy = function (a) {
    this.UnBufferMove(a);
    --this.m_proxyCount;
    this.m_tree.DestroyProxy(a)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "DestroyProxy", box2d.b2BroadPhase.prototype.DestroyProxy);
box2d.b2BroadPhase.prototype.MoveProxy = function (a, b, c) {
    this.m_tree.MoveProxy(a, b, c) && this.BufferMove(a)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "MoveProxy", box2d.b2BroadPhase.prototype.MoveProxy);
box2d.b2BroadPhase.prototype.TouchProxy = function (a) {
    this.BufferMove(a)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "TouchProxy", box2d.b2BroadPhase.prototype.TouchProxy);
box2d.b2BroadPhase.prototype.GetFatAABB = function (a) {
    return this.m_tree.GetFatAABB(a)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "GetFatAABB", box2d.b2BroadPhase.prototype.GetFatAABB);
box2d.b2BroadPhase.prototype.GetUserData = function (a) {
    return this.m_tree.GetUserData(a)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "GetUserData", box2d.b2BroadPhase.prototype.GetUserData);
box2d.b2BroadPhase.prototype.TestOverlap = function (a, b) {
    var c = this.m_tree.GetFatAABB(a),
        e = this.m_tree.GetFatAABB(b);
    return box2d.b2TestOverlapAABB(c, e)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "TestOverlap", box2d.b2BroadPhase.prototype.TestOverlap);
box2d.b2BroadPhase.prototype.GetProxyCount = function () {
    return this.m_proxyCount
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "GetProxyCount", box2d.b2BroadPhase.prototype.GetProxyCount);
box2d.b2BroadPhase.prototype.GetTreeHeight = function () {
    return this.m_tree.GetHeight()
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "GetTreeHeight", box2d.b2BroadPhase.prototype.GetTreeHeight);
box2d.b2BroadPhase.prototype.GetTreeBalance = function () {
    return this.m_tree.GetMaxBalance()
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "GetTreeBalance", box2d.b2BroadPhase.prototype.GetTreeBalance);
box2d.b2BroadPhase.prototype.GetTreeQuality = function () {
    return this.m_tree.GetAreaRatio()
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "GetTreeQuality", box2d.b2BroadPhase.prototype.GetTreeQuality);
box2d.b2BroadPhase.prototype.ShiftOrigin = function (a) {
    this.m_tree.ShiftOrigin(a)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "ShiftOrigin", box2d.b2BroadPhase.prototype.ShiftOrigin);
box2d.b2BroadPhase.prototype.UpdatePairs = function (a) {
    for (var b = this.m_pairCount = 0; b < this.m_moveCount; ++b) {
        var c = this.m_moveBuffer[b];
        if (null !== c) {
            var e = this,
                d = this.m_tree.GetFatAABB(c);
            this.m_tree.Query(function (a) {
                if (a.m_id === c.m_id) return !0;
                e.m_pairCount === e.m_pairBuffer.length && (e.m_pairBuffer[e.m_pairCount] = new box2d.b2Pair);
                var b = e.m_pairBuffer[e.m_pairCount];
                a.m_id < c.m_id ? (b.proxyA = a, b.proxyB = c) : (b.proxyA = c, b.proxyB = a);
                ++e.m_pairCount;
                return !0
            }, d)
        }
    }
    this.m_moveCount = 0;
    this.m_pairBuffer.length =
        this.m_pairCount;
    this.m_pairBuffer.sort(box2d.b2PairLessThan);
    for (b = 0; b < this.m_pairCount;) {
        var d = this.m_pairBuffer[b],
            f = this.m_tree.GetUserData(d.proxyA),
            g = this.m_tree.GetUserData(d.proxyB);
        a.AddPair(f, g);
        for (++b; b < this.m_pairCount;) {
            f = this.m_pairBuffer[b];
            if (f.proxyA.m_id !== d.proxyA.m_id || f.proxyB.m_id !== d.proxyB.m_id) break;
            ++b
        }
    }
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "UpdatePairs", box2d.b2BroadPhase.prototype.UpdatePairs);
box2d.b2BroadPhase.prototype.Query = function (a, b) {
    this.m_tree.Query(a, b)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "Query", box2d.b2BroadPhase.prototype.Query);
box2d.b2BroadPhase.prototype.RayCast = function (a, b) {
    this.m_tree.RayCast(a, b)
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "RayCast", box2d.b2BroadPhase.prototype.RayCast);
box2d.b2BroadPhase.prototype.BufferMove = function (a) {
    this.m_moveBuffer[this.m_moveCount] = a;
    ++this.m_moveCount
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "BufferMove", box2d.b2BroadPhase.prototype.BufferMove);
box2d.b2BroadPhase.prototype.UnBufferMove = function (a) {
    a = this.m_moveBuffer.indexOf(a);
    this.m_moveBuffer[a] = null
};
goog.exportProperty(box2d.b2BroadPhase.prototype, "UnBufferMove", box2d.b2BroadPhase.prototype.UnBufferMove);
box2d.b2PairLessThan = function (a, b) {
    return a.proxyA.m_id === b.proxyA.m_id ? a.proxyB.m_id - b.proxyB.m_id : a.proxyA.m_id - b.proxyA.m_id
};
box2d.b2ContactManager = function () {
    this.m_broadPhase = new box2d.b2BroadPhase;
    this.m_contactFactory = new box2d.b2ContactFactory(this.m_allocator)
};
box2d.b2ContactManager.prototype.m_broadPhase = null;
goog.exportSymbol("box2d.b2ContactManager.prototype.m_broadPhase", box2d.b2ContactManager.prototype.m_broadPhase);
box2d.b2ContactManager.prototype.m_contactList = null;
goog.exportSymbol("box2d.b2ContactManager.prototype.m_contactList", box2d.b2ContactManager.prototype.m_contactList);
box2d.b2ContactManager.prototype.m_contactCount = 0;
goog.exportSymbol("box2d.b2ContactManager.prototype.m_contactCount", box2d.b2ContactManager.prototype.m_contactCount);
box2d.b2ContactManager.prototype.m_contactFilter = box2d.b2ContactFilter.b2_defaultFilter;
goog.exportSymbol("box2d.b2ContactManager.prototype.m_contactFilter", box2d.b2ContactManager.prototype.m_contactFilter);
box2d.b2ContactManager.prototype.m_contactListener = box2d.b2ContactListener.b2_defaultListener;
goog.exportSymbol("box2d.b2ContactManager.prototype.m_contactListener", box2d.b2ContactManager.prototype.m_contactListener);
box2d.b2ContactManager.prototype.m_allocator = null;
goog.exportSymbol("box2d.b2ContactManager.prototype.m_allocator", box2d.b2ContactManager.prototype.m_allocator);
box2d.b2ContactManager.prototype.m_contactFactory = null;
goog.exportSymbol("box2d.b2ContactManager.prototype.m_contactFactory", box2d.b2ContactManager.prototype.m_contactFactory);
box2d.b2ContactManager.prototype.Destroy = function (a) {
    var b = a.GetFixtureA(),
        c = a.GetFixtureB(),
        b = b.GetBody(),
        c = c.GetBody();
    this.m_contactListener && a.IsTouching() && this.m_contactListener.EndContact(a);
    a.m_prev && (a.m_prev.m_next = a.m_next);
    a.m_next && (a.m_next.m_prev = a.m_prev);
    a === this.m_contactList && (this.m_contactList = a.m_next);
    a.m_nodeA.prev && (a.m_nodeA.prev.next = a.m_nodeA.next);
    a.m_nodeA.next && (a.m_nodeA.next.prev = a.m_nodeA.prev);
    a.m_nodeA === b.m_contactList && (b.m_contactList = a.m_nodeA.next);
    a.m_nodeB.prev &&
        (a.m_nodeB.prev.next = a.m_nodeB.next);
    a.m_nodeB.next && (a.m_nodeB.next.prev = a.m_nodeB.prev);
    a.m_nodeB === c.m_contactList && (c.m_contactList = a.m_nodeB.next);
    this.m_contactFactory.Destroy(a);
    --this.m_contactCount
};
goog.exportSymbol("box2d.b2ContactManager.prototype.Destroy", box2d.b2ContactManager.prototype.Destroy);
box2d.b2ContactManager.prototype.Collide = function () {
    for (var a = this.m_contactList; a;) {
        var b = a.GetFixtureA(),
            c = a.GetFixtureB(),
            e = a.GetChildIndexA(),
            d = a.GetChildIndexB(),
            f = b.GetBody(),
            g = c.GetBody();
        if (a.m_flags & box2d.b2ContactFlag.e_filterFlag) {
            if (!1 === g.ShouldCollide(f)) {
                b = a;
                a = b.m_next;
                this.Destroy(b);
                continue
            }
            if (this.m_contactFilter && !1 === this.m_contactFilter.ShouldCollide(b, c)) {
                b = a;
                a = b.m_next;
                this.Destroy(b);
                continue
            }
            a.m_flags &= ~box2d.b2ContactFlag.e_filterFlag
        }
        f = f.IsAwake() && f.m_type !== box2d.b2BodyType.b2_staticBody;
        g = g.IsAwake() && g.m_type !== box2d.b2BodyType.b2_staticBody;
        !1 === f && !1 === g ? a = a.m_next : !1 === this.m_broadPhase.TestOverlap(b.m_proxies[e].proxy, c.m_proxies[d].proxy) ? (b = a, a = b.m_next, this.Destroy(b)) : (a.Update(this.m_contactListener), a = a.m_next)
    }
};
goog.exportSymbol("box2d.b2ContactManager.prototype.Collide", box2d.b2ContactManager.prototype.Collide);
box2d.b2ContactManager.prototype.FindNewContacts = function () {
    this.m_broadPhase.UpdatePairs(this)
};
goog.exportSymbol("box2d.b2ContactManager.prototype.FindNewContacts", box2d.b2ContactManager.prototype.FindNewContacts);
box2d.b2ContactManager.prototype.AddPair = function (a, b) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a instanceof box2d.b2FixtureProxy);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(b instanceof box2d.b2FixtureProxy);
    var c = a.fixture,
        e = b.fixture,
        d = a.childIndex,
        f = b.childIndex,
        g = c.GetBody(),
        h = e.GetBody();
    if (g !== h) {
        for (var l = h.GetContactList(); l;) {
            if (l.other === g) {
                var k = l.contact.GetFixtureA(),
                    m = l.contact.GetFixtureB(),
                    n = l.contact.GetChildIndexA(),
                    p = l.contact.GetChildIndexB();
                if (k === c && m === e && n === d && p === f || k === e && m === c &&
                    n === f && p === d) return
            }
            l = l.next
        }!1 === h.ShouldCollide(g) || this.m_contactFilter && !1 === this.m_contactFilter.ShouldCollide(c, e) || (d = this.m_contactFactory.Create(c, d, e, f), null !== d && (c = d.GetFixtureA(), e = d.GetFixtureB(), d.GetChildIndexA(), d.GetChildIndexB(), g = c.m_body, h = e.m_body, d.m_prev = null, d.m_next = this.m_contactList, null !== this.m_contactList && (this.m_contactList.m_prev = d), this.m_contactList = d, d.m_nodeA.contact = d, d.m_nodeA.other = h, d.m_nodeA.prev = null, d.m_nodeA.next = g.m_contactList, null !== g.m_contactList &&
            (g.m_contactList.prev = d.m_nodeA), g.m_contactList = d.m_nodeA, d.m_nodeB.contact = d, d.m_nodeB.other = g, d.m_nodeB.prev = null, d.m_nodeB.next = h.m_contactList, null !== h.m_contactList && (h.m_contactList.prev = d.m_nodeB), h.m_contactList = d.m_nodeB, !1 === c.IsSensor() && !1 === e.IsSensor() && (g.SetAwake(!0), h.SetAwake(!0)), ++this.m_contactCount))
    }
};
goog.exportSymbol("box2d.b2ContactManager.prototype.AddPair", box2d.b2ContactManager.prototype.AddPair);
box2d.b2JointFactory = {};
box2d.b2JointFactory.Create = function (a, b) {
    var c = null;
    switch (a.type) {
    case box2d.b2JointType.e_distanceJoint:
        c = new box2d.b2DistanceJoint(a instanceof box2d.b2DistanceJointDef ? a : null);
        break;
    case box2d.b2JointType.e_mouseJoint:
        c = new box2d.b2MouseJoint(a instanceof box2d.b2MouseJointDef ? a : null);
        break;
    case box2d.b2JointType.e_prismaticJoint:
        c = new box2d.b2PrismaticJoint(a instanceof box2d.b2PrismaticJointDef ? a : null);
        break;
    case box2d.b2JointType.e_revoluteJoint:
        c = new box2d.b2RevoluteJoint(a instanceof box2d.b2RevoluteJointDef ?
            a : null);
        break;
    case box2d.b2JointType.e_pulleyJoint:
        c = new box2d.b2PulleyJoint(a instanceof box2d.b2PulleyJointDef ? a : null);
        break;
    case box2d.b2JointType.e_gearJoint:
        c = new box2d.b2GearJoint(a instanceof box2d.b2GearJointDef ? a : null);
        break;
    case box2d.b2JointType.e_wheelJoint:
        c = new box2d.b2WheelJoint(a instanceof box2d.b2WheelJointDef ? a : null);
        break;
    case box2d.b2JointType.e_weldJoint:
        c = new box2d.b2WeldJoint(a instanceof box2d.b2WeldJointDef ? a : null);
        break;
    case box2d.b2JointType.e_frictionJoint:
        c = new box2d.b2FrictionJoint(a instanceof box2d.b2FrictionJointDef ? a : null);
        break;
    case box2d.b2JointType.e_ropeJoint:
        c = new box2d.b2RopeJoint(a instanceof box2d.b2RopeJointDef ? a : null);
        break;
    case box2d.b2JointType.e_motorJoint:
        c = new box2d.b2MotorJoint(a instanceof box2d.b2MotorJointDef ? a : null);
        break;
    case box2d.b2JointType.e_areaJoint:
        c = new box2d.b2AreaJoint(a instanceof box2d.b2AreaJointDef ? a : null);
        break;
    default:
        box2d.ENABLE_ASSERTS && box2d.b2Assert(!1)
    }
    return c
};
goog.exportSymbol("box2d.b2JointFactory.Create", box2d.b2JointFactory.Create);
box2d.b2JointFactory.Destroy = function (a, b) {};
goog.exportSymbol("box2d.b2JointFactory.Destroy", box2d.b2JointFactory.Destroy);
box2d.b2Color = function (a, b, c) {
    this.r = a;
    this.g = b;
    this.b = c
};
goog.exportSymbol("box2d.b2Color", box2d.b2Color);
box2d.b2Color.prototype.r = 0.5;
goog.exportProperty(box2d.b2Color.prototype, "r", box2d.b2Color.prototype.r);
box2d.b2Color.prototype.g = 0.5;
goog.exportProperty(box2d.b2Color.prototype, "g", box2d.b2Color.prototype.g);
box2d.b2Color.prototype.b = 0.5;
goog.exportProperty(box2d.b2Color.prototype, "b", box2d.b2Color.prototype.b);
box2d.b2Color.prototype.SetRGB = function (a, b, c) {
    this.r = a;
    this.g = b;
    this.b = c;
    return this
};
goog.exportProperty(box2d.b2Color.prototype, "SetRGB", box2d.b2Color.prototype.SetRGB);
box2d.b2Color.prototype.MakeStyleString = function (a) {
    var b = Math.round(Math.max(0, Math.min(255, 255 * this.r))),
        c = Math.round(Math.max(0, Math.min(255, 255 * this.g))),
        e = Math.round(Math.max(0, Math.min(255, 255 * this.b)));
    a = "undefined" === typeof a ? 1 : Math.max(0, Math.min(1, a));
    return box2d.b2Color.MakeStyleString(b, c, e, a)
};
goog.exportProperty(box2d.b2Color.prototype, "MakeStyleString", box2d.b2Color.prototype.MakeStyleString);
box2d.b2Color.MakeStyleString = function (a, b, c, e) {
    return 1 > e ? "rgba(" + a + "," + b + "," + c + "," + e + ")" : "rgb(" + a + "," + b + "," + c + ")"
};
goog.exportProperty(box2d.b2Color, "MakeStyleString", box2d.b2Color.MakeStyleString);
box2d.b2Color.RED = new box2d.b2Color(1, 0, 0);
goog.exportProperty(box2d.b2Color, "RED", box2d.b2Color.RED);
box2d.b2Color.GREEN = new box2d.b2Color(0, 1, 0);
goog.exportProperty(box2d.b2Color, "GREEN", box2d.b2Color.GREEN);
box2d.b2Color.BLUE = new box2d.b2Color(0, 0, 1);
goog.exportProperty(box2d.b2Color, "BLUE", box2d.b2Color.BLUE);
box2d.b2DrawFlags = {
    e_none: 0,
    e_shapeBit: 1,
    e_jointBit: 2,
    e_aabbBit: 4,
    e_pairBit: 8,
    e_centerOfMassBit: 16,
    e_controllerBit: 32,
    e_all: 63
};
goog.exportSymbol("box2d.b2DrawFlags", box2d.b2DrawFlags);
goog.exportProperty(box2d.b2DrawFlags, "e_none", box2d.b2DrawFlags.e_none);
goog.exportProperty(box2d.b2DrawFlags, "e_shapeBit", box2d.b2DrawFlags.e_shapeBit);
goog.exportProperty(box2d.b2DrawFlags, "e_jointBit", box2d.b2DrawFlags.e_jointBit);
goog.exportProperty(box2d.b2DrawFlags, "e_aabbBit", box2d.b2DrawFlags.e_aabbBit);
goog.exportProperty(box2d.b2DrawFlags, "e_pairBit", box2d.b2DrawFlags.e_pairBit);
goog.exportProperty(box2d.b2DrawFlags, "e_centerOfMassBit", box2d.b2DrawFlags.e_centerOfMassBit);
goog.exportProperty(box2d.b2DrawFlags, "e_controllerBit", box2d.b2DrawFlags.e_controllerBit);
goog.exportProperty(box2d.b2DrawFlags, "e_all", box2d.b2DrawFlags.e_all);
box2d.b2Draw = function () {};
goog.exportSymbol("box2d.b2Draw", box2d.b2Draw);
box2d.b2Draw.prototype.m_drawFlags = box2d.b2DrawFlags.e_none;
goog.exportProperty(box2d.b2Draw.prototype, "m_drawFlags", box2d.b2Draw.prototype.m_drawFlags);
box2d.b2Draw.prototype.SetFlags = function (a) {
    this.m_drawFlags = a
};
goog.exportProperty(box2d.b2Draw.prototype, "SetFlags", box2d.b2Draw.prototype.SetFlags);
box2d.b2Draw.prototype.GetFlags = function () {
    return this.m_drawFlags
};
goog.exportProperty(box2d.b2Draw.prototype, "GetFlags", box2d.b2Draw.prototype.GetFlags);
box2d.b2Draw.prototype.AppendFlags = function (a) {
    this.m_drawFlags |= a
};
goog.exportProperty(box2d.b2Draw.prototype, "AppendFlags", box2d.b2Draw.prototype.AppendFlags);
box2d.b2Draw.prototype.ClearFlags = function (a) {
    this.m_drawFlags &= ~a
};
goog.exportProperty(box2d.b2Draw.prototype, "ClearFlags", box2d.b2Draw.prototype.ClearFlags);
box2d.b2Draw.prototype.PushTransform = function (a) {};
goog.exportProperty(box2d.b2Draw.prototype, "PushTransform", box2d.b2Draw.prototype.PushTransform);
box2d.b2Draw.prototype.PopTransform = function (a) {};
goog.exportProperty(box2d.b2Draw.prototype, "PopTransform", box2d.b2Draw.prototype.PopTransform);
box2d.b2Draw.prototype.DrawPolygon = function (a, b, c) {};
goog.exportProperty(box2d.b2Draw.prototype, "DrawPolygon", box2d.b2Draw.prototype.DrawPolygon);
box2d.b2Draw.prototype.DrawSolidPolygon = function (a, b, c) {};
goog.exportProperty(box2d.b2Draw.prototype, "DrawSolidPolygon", box2d.b2Draw.prototype.DrawSolidPolygon);
box2d.b2Draw.prototype.DrawCircle = function (a, b, c) {};
goog.exportProperty(box2d.b2Draw.prototype, "DrawCircle", box2d.b2Draw.prototype.DrawCircle);
box2d.b2Draw.prototype.DrawSolidCircle = function (a, b, c, e) {};
goog.exportProperty(box2d.b2Draw.prototype, "DrawSolidCircle", box2d.b2Draw.prototype.DrawSolidCircle);
box2d.b2Draw.prototype.DrawSegment = function (a, b, c) {};
goog.exportProperty(box2d.b2Draw.prototype, "DrawSegment", box2d.b2Draw.prototype.DrawSegment);
box2d.b2Draw.prototype.DrawTransform = function (a) {};
goog.exportProperty(box2d.b2Draw.prototype, "DrawTransform", box2d.b2Draw.prototype.DrawTransform);
box2d.b2Filter = function () {};
goog.exportSymbol("box2d.b2Filter", box2d.b2Filter);
box2d.b2Filter.prototype.categoryBits = 1;
goog.exportProperty(box2d.b2Filter.prototype, "categoryBits", box2d.b2Filter.prototype.categoryBits);
box2d.b2Filter.prototype.maskBits = 65535;
goog.exportProperty(box2d.b2Filter.prototype, "maskBits", box2d.b2Filter.prototype.maskBits);
box2d.b2Filter.prototype.groupIndex = 0;
goog.exportProperty(box2d.b2Filter.prototype, "groupIndex", box2d.b2Filter.prototype.groupIndex);
box2d.b2Filter.prototype.Clone = function () {
    return (new box2d.b2Filter).Copy(this)
};
goog.exportProperty(box2d.b2Filter.prototype, "Clone", box2d.b2Filter.prototype.Clone);
box2d.b2Filter.prototype.Copy = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(this !== a);
    this.categoryBits = a.categoryBits;
    this.maskBits = a.maskBits;
    this.groupIndex = a.groupIndex;
    return this
};
goog.exportProperty(box2d.b2Filter.prototype, "Copy", box2d.b2Filter.prototype.Copy);
box2d.b2FixtureDef = function () {
    this.filter = new box2d.b2Filter
};
goog.exportSymbol("box2d.b2FixtureDef", box2d.b2FixtureDef);
box2d.b2FixtureDef.prototype.shape = null;
goog.exportProperty(box2d.b2FixtureDef.prototype, "shape", box2d.b2FixtureDef.prototype.shape);
box2d.b2FixtureDef.prototype.userData = null;
goog.exportProperty(box2d.b2FixtureDef.prototype, "userData", box2d.b2FixtureDef.prototype.userData);
box2d.b2FixtureDef.prototype.friction = 0.2;
goog.exportProperty(box2d.b2FixtureDef.prototype, "friction", box2d.b2FixtureDef.prototype.friction);
box2d.b2FixtureDef.prototype.restitution = 0;
goog.exportProperty(box2d.b2FixtureDef.prototype, "restitution", box2d.b2FixtureDef.prototype.restitution);
box2d.b2FixtureDef.prototype.density = 0;
goog.exportProperty(box2d.b2FixtureDef.prototype, "density", box2d.b2FixtureDef.prototype.density);
box2d.b2FixtureDef.prototype.isSensor = !1;
goog.exportProperty(box2d.b2FixtureDef.prototype, "isSensor", box2d.b2FixtureDef.prototype.isSensor);
box2d.b2FixtureDef.prototype.filter = null;
goog.exportProperty(box2d.b2FixtureDef.prototype, "filter", box2d.b2FixtureDef.prototype.filter);
box2d.b2FixtureProxy = function () {
    this.aabb = new box2d.b2AABB
};
goog.exportSymbol("box2d.b2FixtureProxy", box2d.b2FixtureProxy);
box2d.b2FixtureProxy.prototype.aabb = null;
goog.exportProperty(box2d.b2FixtureProxy.prototype, "aabb", box2d.b2FixtureProxy.prototype.aabb);
box2d.b2FixtureProxy.prototype.fixture = null;
goog.exportProperty(box2d.b2FixtureProxy.prototype, "fixture", box2d.b2FixtureProxy.prototype.fixture);
box2d.b2FixtureProxy.prototype.childIndex = 0;
goog.exportProperty(box2d.b2FixtureProxy.prototype, "childIndex", box2d.b2FixtureProxy.prototype.childIndex);
box2d.b2FixtureProxy.prototype.proxy = null;
goog.exportProperty(box2d.b2FixtureProxy.prototype, "proxy", box2d.b2FixtureProxy.prototype.proxy);
box2d.b2FixtureProxy.MakeArray = function (a) {
    return box2d.b2MakeArray(a, function (a) {
        return new box2d.b2FixtureProxy
    })
};
goog.exportProperty(box2d.b2FixtureProxy, "MakeArray", box2d.b2FixtureProxy.MakeArray);
box2d.b2Fixture = function () {
    this.m_proxyCount = 0;
    this.m_filter = new box2d.b2Filter
};
goog.exportSymbol("box2d.b2Fixture", box2d.b2Fixture);
box2d.b2Fixture.prototype.m_density = 0;
goog.exportProperty(box2d.b2Fixture.prototype, "m_density", box2d.b2Fixture.prototype.m_density);
box2d.b2Fixture.prototype.m_next = null;
goog.exportProperty(box2d.b2Fixture.prototype, "m_next", box2d.b2Fixture.prototype.m_next);
box2d.b2Fixture.prototype.m_body = null;
goog.exportProperty(box2d.b2Fixture.prototype, "m_body", box2d.b2Fixture.prototype.m_body);
box2d.b2Fixture.prototype.m_shape = null;
goog.exportProperty(box2d.b2Fixture.prototype, "m_shape", box2d.b2Fixture.prototype.m_shape);
box2d.b2Fixture.prototype.m_friction = 0;
goog.exportProperty(box2d.b2Fixture.prototype, "m_friction", box2d.b2Fixture.prototype.m_friction);
box2d.b2Fixture.prototype.m_restitution = 0;
goog.exportProperty(box2d.b2Fixture.prototype, "m_restitution", box2d.b2Fixture.prototype.m_restitution);
box2d.b2Fixture.prototype.m_proxies = null;
goog.exportProperty(box2d.b2Fixture.prototype, "m_proxies", box2d.b2Fixture.prototype.m_proxies);
box2d.b2Fixture.prototype.m_proxyCount = 0;
goog.exportProperty(box2d.b2Fixture.prototype, "m_proxyCount", box2d.b2Fixture.prototype.m_proxyCount);
box2d.b2Fixture.prototype.m_filter = null;
goog.exportProperty(box2d.b2Fixture.prototype, "m_filter", box2d.b2Fixture.prototype.m_filter);
box2d.b2Fixture.prototype.m_isSensor = !1;
goog.exportProperty(box2d.b2Fixture.prototype, "m_isSensor", box2d.b2Fixture.prototype.m_isSensor);
box2d.b2Fixture.prototype.m_userData = null;
goog.exportProperty(box2d.b2Fixture.prototype, "m_userData", box2d.b2Fixture.prototype.m_userData);
box2d.b2Fixture.prototype.GetType = function () {
    return this.m_shape.GetType()
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetType", box2d.b2Fixture.prototype.GetType);
box2d.b2Fixture.prototype.GetShape = function () {
    return this.m_shape
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetShape", box2d.b2Fixture.prototype.GetShape);
box2d.b2Fixture.prototype.IsSensor = function () {
    return this.m_isSensor
};
goog.exportProperty(box2d.b2Fixture.prototype, "IsSensor", box2d.b2Fixture.prototype.IsSensor);
box2d.b2Fixture.prototype.GetFilterData = function () {
    return this.m_filter
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetFilterData", box2d.b2Fixture.prototype.GetFilterData);
box2d.b2Fixture.prototype.GetUserData = function () {
    return this.m_userData
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetUserData", box2d.b2Fixture.prototype.GetUserData);
box2d.b2Fixture.prototype.SetUserData = function (a) {
    this.m_userData = a
};
goog.exportProperty(box2d.b2Fixture.prototype, "SetUserData", box2d.b2Fixture.prototype.SetUserData);
box2d.b2Fixture.prototype.GetBody = function () {
    return this.m_body
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetBody", box2d.b2Fixture.prototype.GetBody);
box2d.b2Fixture.prototype.GetNext = function () {
    return this.m_next
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetNext", box2d.b2Fixture.prototype.GetNext);
box2d.b2Fixture.prototype.SetDensity = function (a) {
    this.m_density = a
};
goog.exportProperty(box2d.b2Fixture.prototype, "SetDensity", box2d.b2Fixture.prototype.SetDensity);
box2d.b2Fixture.prototype.GetDensity = function () {
    return this.m_density
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetDensity", box2d.b2Fixture.prototype.GetDensity);
box2d.b2Fixture.prototype.GetFriction = function () {
    return this.m_friction
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetFriction", box2d.b2Fixture.prototype.GetFriction);
box2d.b2Fixture.prototype.SetFriction = function (a) {
    this.m_friction = a
};
goog.exportProperty(box2d.b2Fixture.prototype, "SetFriction", box2d.b2Fixture.prototype.SetFriction);
box2d.b2Fixture.prototype.GetRestitution = function () {
    return this.m_restitution
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetRestitution", box2d.b2Fixture.prototype.GetRestitution);
box2d.b2Fixture.prototype.SetRestitution = function (a) {
    this.m_restitution = a
};
goog.exportProperty(box2d.b2Fixture.prototype, "SetRestitution", box2d.b2Fixture.prototype.SetRestitution);
box2d.b2Fixture.prototype.TestPoint = function (a) {
    return this.m_shape.TestPoint(this.m_body.GetTransform(), a)
};
goog.exportProperty(box2d.b2Fixture.prototype, "TestPoint", box2d.b2Fixture.prototype.TestPoint);
box2d.b2Fixture.prototype.RayCast = function (a, b, c) {
    return this.m_shape.RayCast(a, b, this.m_body.GetTransform(), c)
};
goog.exportProperty(box2d.b2Fixture.prototype, "RayCast", box2d.b2Fixture.prototype.RayCast);
box2d.b2Fixture.prototype.GetMassData = function (a) {
    a = a || new box2d.b2MassData;
    this.m_shape.ComputeMass(a, this.m_density);
    return a
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetMassData", box2d.b2Fixture.prototype.GetMassData);
box2d.b2Fixture.prototype.GetAABB = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 <= a && a < this.m_proxyCount);
    return this.m_proxies[a].aabb
};
goog.exportProperty(box2d.b2Fixture.prototype, "GetAABB", box2d.b2Fixture.prototype.GetAABB);
box2d.b2Fixture.prototype.Create = function (a, b) {
    this.m_userData = b.userData;
    this.m_friction = b.friction;
    this.m_restitution = b.restitution;
    this.m_body = a;
    this.m_next = null;
    this.m_filter.Copy(b.filter);
    this.m_isSensor = b.isSensor;
    this.m_shape = b.shape.Clone();
    this.m_proxies = box2d.b2FixtureProxy.MakeArray(this.m_shape.GetChildCount());
    this.m_proxyCount = 0;
    this.m_density = b.density
};
goog.exportProperty(box2d.b2Fixture.prototype, "Create", box2d.b2Fixture.prototype.Create);
box2d.b2Fixture.prototype.Destroy = function () {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 === this.m_proxyCount);
    this.m_shape = null
};
goog.exportProperty(box2d.b2Fixture.prototype, "Destroy", box2d.b2Fixture.prototype.Destroy);
box2d.b2Fixture.prototype.CreateProxies = function (a, b) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 === this.m_proxyCount);
    this.m_proxyCount = this.m_shape.GetChildCount();
    for (var c = 0; c < this.m_proxyCount; ++c) {
        var e = this.m_proxies[c];
        this.m_shape.ComputeAABB(e.aabb, b, c);
        e.proxy = a.CreateProxy(e.aabb, e);
        e.fixture = this;
        e.childIndex = c
    }
};
goog.exportProperty(box2d.b2Fixture.prototype, "CreateProxies", box2d.b2Fixture.prototype.CreateProxies);
box2d.b2Fixture.prototype.DestroyProxies = function (a) {
    for (var b = 0; b < this.m_proxyCount; ++b) {
        var c = this.m_proxies[b];
        a.DestroyProxy(c.proxy);
        c.proxy = null
    }
    this.m_proxyCount = 0
};
goog.exportProperty(box2d.b2Fixture.prototype, "DestroyProxies", box2d.b2Fixture.prototype.DestroyProxies);
box2d.b2Fixture.prototype.Synchronize = function (a, b, c) {
    if (0 !== this.m_proxyCount)
        for (var e = 0; e < this.m_proxyCount; ++e) {
            var d = this.m_proxies[e],
                f = box2d.b2Fixture.prototype.Synchronize.s_aabb1,
                g = box2d.b2Fixture.prototype.Synchronize.s_aabb2;
            this.m_shape.ComputeAABB(f, b, e);
            this.m_shape.ComputeAABB(g, c, e);
            d.aabb.Combine2(f, g);
            f = box2d.b2SubVV(c.p, b.p, box2d.b2Fixture.prototype.Synchronize.s_displacement);
            a.MoveProxy(d.proxy, d.aabb, f)
        }
};
goog.exportProperty(box2d.b2Fixture.prototype, "Synchronize", box2d.b2Fixture.prototype.Synchronize);
box2d.b2Fixture.prototype.Synchronize.s_aabb1 = new box2d.b2AABB;
box2d.b2Fixture.prototype.Synchronize.s_aabb2 = new box2d.b2AABB;
box2d.b2Fixture.prototype.Synchronize.s_displacement = new box2d.b2Vec2;
box2d.b2Fixture.prototype.SetFilterData = function (a) {
    this.m_filter.Copy(a);
    this.Refilter()
};
goog.exportProperty(box2d.b2Fixture.prototype, "SetFilterData", box2d.b2Fixture.prototype.SetFilterData);
box2d.b2Fixture.prototype.Refilter = function () {
    if (!this.m_body) {
        for (var a = this.m_body.GetContactList(); a;) {
            var b = a.contact,
                c = b.GetFixtureA(),
                e = b.GetFixtureB();
            c !== this && e !== this || b.FlagForFiltering();
            a = a.next
        }
        a = this.m_body.GetWorld();
        if (null !== a)
            for (a = a.m_contactManager.m_broadPhase, b = 0; b < this.m_proxyCount; ++b) a.TouchProxy(this.m_proxies[b].proxy)
    }
};
goog.exportProperty(box2d.b2Fixture.prototype, "Refilter", box2d.b2Fixture.prototype.Refilter);
box2d.b2Fixture.prototype.SetSensor = function (a) {
    a !== this.m_isSensor && (this.m_body.SetAwake(!0), this.m_isSensor = a)
};
goog.exportProperty(box2d.b2Fixture.prototype, "SetSensor", box2d.b2Fixture.prototype.SetSensor);
box2d.b2Fixture.prototype.Dump = function (a) {
    box2d.DEBUG && (box2d.b2Log("    /*box2d.b2FixtureDef*/ var fd = new box2d.b2FixtureDef();\n"), box2d.b2Log("    fd.friction = %.15f;\n", this.m_friction), box2d.b2Log("    fd.restitution = %.15f;\n", this.m_restitution), box2d.b2Log("    fd.density = %.15f;\n", this.m_density), box2d.b2Log("    fd.isSensor = %s;\n", this.m_isSensor ? "true" : "false"), box2d.b2Log("    fd.filter.categoryBits = %d;\n", this.m_filter.categoryBits), box2d.b2Log("    fd.filter.maskBits = %d;\n",
        this.m_filter.maskBits), box2d.b2Log("    fd.filter.groupIndex = %d;\n", this.m_filter.groupIndex), this.m_shape.Dump(), box2d.b2Log("\n"), box2d.b2Log("    fd.shape = shape;\n"), box2d.b2Log("\n"), box2d.b2Log("    bodies[%d].CreateFixture(fd);\n", a))
};
goog.exportProperty(box2d.b2Fixture.prototype, "Dump", box2d.b2Fixture.prototype.Dump);
box2d.b2BodyType = {
    b2_unknown: -1,
    b2_staticBody: 0,
    b2_kinematicBody: 1,
    b2_dynamicBody: 2,
    b2_bulletBody: 3
};
goog.exportSymbol("box2d.b2BodyType", box2d.b2BodyType);
goog.exportProperty(box2d.b2BodyType, "b2_unknown", box2d.b2BodyType.b2_unknown);
goog.exportProperty(box2d.b2BodyType, "b2_staticBody", box2d.b2BodyType.b2_staticBody);
goog.exportProperty(box2d.b2BodyType, "b2_kinematicBody", box2d.b2BodyType.b2_kinematicBody);
goog.exportProperty(box2d.b2BodyType, "b2_dynamicBody", box2d.b2BodyType.b2_dynamicBody);
goog.exportProperty(box2d.b2BodyType, "b2_bulletBody", box2d.b2BodyType.b2_bulletBody);
box2d.b2BodyDef = function () {
    this.position = new box2d.b2Vec2(0, 0);
    this.linearVelocity = new box2d.b2Vec2(0, 0)
};
goog.exportSymbol("box2d.b2BodyDef", box2d.b2BodyDef);
box2d.b2BodyDef.prototype.type = box2d.b2BodyType.b2_staticBody;
goog.exportProperty(box2d.b2BodyDef.prototype, "type", box2d.b2BodyDef.prototype.type);
box2d.b2BodyDef.prototype.position = null;
goog.exportProperty(box2d.b2BodyDef.prototype, "position", box2d.b2BodyDef.prototype.position);
box2d.b2BodyDef.prototype.angle = 0;
goog.exportProperty(box2d.b2BodyDef.prototype, "angle", box2d.b2BodyDef.prototype.angle);
box2d.b2BodyDef.prototype.linearVelocity = null;
goog.exportProperty(box2d.b2BodyDef.prototype, "linearVelocity", box2d.b2BodyDef.prototype.linearVelocity);
box2d.b2BodyDef.prototype.angularVelocity = 0;
goog.exportProperty(box2d.b2BodyDef.prototype, "angularVelocity", box2d.b2BodyDef.prototype.angularVelocity);
box2d.b2BodyDef.prototype.linearDamping = 0;
goog.exportProperty(box2d.b2BodyDef.prototype, "linearDamping", box2d.b2BodyDef.prototype.linearDamping);
box2d.b2BodyDef.prototype.angularDamping = 0;
goog.exportProperty(box2d.b2BodyDef.prototype, "angularDamping", box2d.b2BodyDef.prototype.angularDamping);
box2d.b2BodyDef.prototype.allowSleep = !0;
goog.exportProperty(box2d.b2BodyDef.prototype, "allowSleep", box2d.b2BodyDef.prototype.allowSleep);
box2d.b2BodyDef.prototype.awake = !0;
goog.exportProperty(box2d.b2BodyDef.prototype, "awake", box2d.b2BodyDef.prototype.awake);
box2d.b2BodyDef.prototype.fixedRotation = !1;
goog.exportProperty(box2d.b2BodyDef.prototype, "fixedRotation", box2d.b2BodyDef.prototype.fixedRotation);
box2d.b2BodyDef.prototype.bullet = !1;
goog.exportProperty(box2d.b2BodyDef.prototype, "bullet", box2d.b2BodyDef.prototype.bullet);
box2d.b2BodyDef.prototype.active = !0;
goog.exportProperty(box2d.b2BodyDef.prototype, "active", box2d.b2BodyDef.prototype.active);
box2d.b2BodyDef.prototype.userData = null;
goog.exportProperty(box2d.b2BodyDef.prototype, "userData", box2d.b2BodyDef.prototype.userData);
box2d.b2BodyDef.prototype.gravityScale = 1;
goog.exportProperty(box2d.b2BodyDef.prototype, "gravityScale", box2d.b2BodyDef.prototype.gravityScale);
box2d.b2BodyFlag = {
    e_none: 0,
    e_islandFlag: 1,
    e_awakeFlag: 2,
    e_autoSleepFlag: 4,
    e_bulletFlag: 8,
    e_fixedRotationFlag: 16,
    e_activeFlag: 32,
    e_toiFlag: 64
};
goog.exportProperty(box2d.b2BodyFlag, "e_none", box2d.b2BodyFlag.e_none);
goog.exportProperty(box2d.b2BodyFlag, "e_islandFlag", box2d.b2BodyFlag.e_islandFlag);
goog.exportProperty(box2d.b2BodyFlag, "e_awakeFlag", box2d.b2BodyFlag.e_awakeFlag);
goog.exportProperty(box2d.b2BodyFlag, "e_autoSleepFlag", box2d.b2BodyFlag.e_autoSleepFlag);
goog.exportProperty(box2d.b2BodyFlag, "e_bulletFlag", box2d.b2BodyFlag.e_bulletFlag);
goog.exportProperty(box2d.b2BodyFlag, "e_fixedRotationFlag", box2d.b2BodyFlag.e_fixedRotationFlag);
goog.exportProperty(box2d.b2BodyFlag, "e_activeFlag", box2d.b2BodyFlag.e_activeFlag);
goog.exportProperty(box2d.b2BodyFlag, "e_toiFlag", box2d.b2BodyFlag.e_toiFlag);
box2d.b2Body = function (a, b) {
    this.m_xf = new box2d.b2Transform;
    this.m_out_xf = new box2d.b2Transform;
    this.m_sweep = new box2d.b2Sweep;
    this.m_out_sweep = new box2d.b2Sweep;
    this.m_linearVelocity = new box2d.b2Vec2;
    this.m_out_linearVelocity = new box2d.b2Vec2;
    this.m_force = new box2d.b2Vec2;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a.position.IsValid());
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a.linearVelocity.IsValid());
    box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.angle));
    box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.angularVelocity));
    box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.gravityScale) && 0 <= a.gravityScale);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.angularDamping) && 0 <= a.angularDamping);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.linearDamping) && 0 <= a.linearDamping);
    this.m_flags = box2d.b2BodyFlag.e_none;
    a.bullet && (this.m_flags |= box2d.b2BodyFlag.e_bulletFlag);
    a.fixedRotation && (this.m_flags |= box2d.b2BodyFlag.e_fixedRotationFlag);
    a.allowSleep && (this.m_flags |= box2d.b2BodyFlag.e_autoSleepFlag);
    a.awake &&
        (this.m_flags |= box2d.b2BodyFlag.e_awakeFlag);
    a.active && (this.m_flags |= box2d.b2BodyFlag.e_activeFlag);
    this.m_world = b;
    this.m_xf.p.Copy(a.position);
    this.m_xf.q.SetAngleRadians(a.angle);
    this.m_sweep.localCenter.SetZero();
    this.m_sweep.c0.Copy(this.m_xf.p);
    this.m_sweep.c.Copy(this.m_xf.p);
    this.m_sweep.a0 = a.angle;
    this.m_sweep.a = a.angle;
    this.m_sweep.alpha0 = 0;
    this.m_linearVelocity.Copy(a.linearVelocity);
    this.m_angularVelocity = a.angularVelocity;
    this.m_linearDamping = a.linearDamping;
    this.m_angularDamping = a.angularDamping;
    this.m_gravityScale = a.gravityScale;
    this.m_force.SetZero();
    this.m_sleepTime = this.m_torque = 0;
    this.m_type = a.type;
    this.m_invMass = a.type === box2d.b2BodyType.b2_dynamicBody ? this.m_mass = 1 : this.m_mass = 0;
    this.m_invI = this.m_I = 0;
    this.m_userData = a.userData;
    this.m_fixtureList = null;
    this.m_fixtureCount = 0;
    this.m_controllerList = null;
    this.m_controllerCount = 0
};
goog.exportSymbol("box2d.b2Body", box2d.b2Body);
box2d.b2Body.prototype.m_flags = box2d.b2BodyFlag.e_none;
goog.exportProperty(box2d.b2Body.prototype, "m_flags", box2d.b2Body.prototype.m_flags);
box2d.b2Body.prototype.m_islandIndex = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_islandIndex", box2d.b2Body.prototype.m_islandIndex);
box2d.b2Body.prototype.m_world = null;
goog.exportProperty(box2d.b2Body.prototype, "m_world", box2d.b2Body.prototype.m_world);
box2d.b2Body.prototype.m_xf = null;
goog.exportProperty(box2d.b2Body.prototype, "m_xf", box2d.b2Body.prototype.m_xf);
box2d.b2Body.prototype.m_out_xf = null;
goog.exportProperty(box2d.b2Body.prototype, "m_out_xf", box2d.b2Body.prototype.m_out_xf);
box2d.b2Body.prototype.m_sweep = null;
goog.exportProperty(box2d.b2Body.prototype, "m_sweep", box2d.b2Body.prototype.m_sweep);
box2d.b2Body.prototype.m_out_sweep = null;
goog.exportProperty(box2d.b2Body.prototype, "m_out_sweep", box2d.b2Body.prototype.m_out_sweep);
box2d.b2Body.prototype.m_jointList = null;
goog.exportProperty(box2d.b2Body.prototype, "m_jointList", box2d.b2Body.prototype.m_jointList);
box2d.b2Body.prototype.m_contactList = null;
goog.exportProperty(box2d.b2Body.prototype, "m_contactList", box2d.b2Body.prototype.m_contactList);
box2d.b2Body.prototype.m_prev = null;
goog.exportProperty(box2d.b2Body.prototype, "m_prev", box2d.b2Body.prototype.m_prev);
box2d.b2Body.prototype.m_next = null;
goog.exportProperty(box2d.b2Body.prototype, "m_next", box2d.b2Body.prototype.m_next);
box2d.b2Body.prototype.m_linearVelocity = null;
goog.exportProperty(box2d.b2Body.prototype, "m_linearVelocity", box2d.b2Body.prototype.m_linearVelocity);
box2d.b2Body.prototype.m_out_linearVelocity = null;
goog.exportProperty(box2d.b2Body.prototype, "m_out_linearVelocity", box2d.b2Body.prototype.m_out_linearVelocity);
box2d.b2Body.prototype.m_angularVelocity = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_angularVelocity", box2d.b2Body.prototype.m_angularVelocity);
box2d.b2Body.prototype.m_linearDamping = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_linearDamping", box2d.b2Body.prototype.m_linearDamping);
box2d.b2Body.prototype.m_angularDamping = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_angularDamping", box2d.b2Body.prototype.m_angularDamping);
box2d.b2Body.prototype.m_gravityScale = 1;
goog.exportProperty(box2d.b2Body.prototype, "m_gravityScale", box2d.b2Body.prototype.m_gravityScale);
box2d.b2Body.prototype.m_force = null;
goog.exportProperty(box2d.b2Body.prototype, "m_force", box2d.b2Body.prototype.m_force);
box2d.b2Body.prototype.m_torque = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_torque", box2d.b2Body.prototype.m_torque);
box2d.b2Body.prototype.m_sleepTime = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_sleepTime", box2d.b2Body.prototype.m_sleepTime);
box2d.b2Body.prototype.m_type = box2d.b2BodyType.b2_staticBody;
goog.exportProperty(box2d.b2Body.prototype, "m_type", box2d.b2Body.prototype.m_type);
box2d.b2Body.prototype.m_mass = 1;
goog.exportProperty(box2d.b2Body.prototype, "m_mass", box2d.b2Body.prototype.m_mass);
box2d.b2Body.prototype.m_invMass = 1;
goog.exportProperty(box2d.b2Body.prototype, "m_invMass", box2d.b2Body.prototype.m_invMass);
box2d.b2Body.prototype.m_I = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_I", box2d.b2Body.prototype.m_I);
box2d.b2Body.prototype.m_invI = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_invI", box2d.b2Body.prototype.m_invI);
box2d.b2Body.prototype.m_userData = null;
goog.exportProperty(box2d.b2Body.prototype, "m_userData", box2d.b2Body.prototype.m_userData);
box2d.b2Body.prototype.m_fixtureList = null;
goog.exportProperty(box2d.b2Body.prototype, "m_fixtureList", box2d.b2Body.prototype.m_fixtureList);
box2d.b2Body.prototype.m_fixtureCount = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_fixtureCount", box2d.b2Body.prototype.m_fixtureCount);
box2d.b2Body.prototype.m_controllerList = null;
goog.exportProperty(box2d.b2Body.prototype, "m_controllerList", box2d.b2Body.prototype.m_controllerList);
box2d.b2Body.prototype.m_controllerCount = 0;
goog.exportProperty(box2d.b2Body.prototype, "m_controllerCount", box2d.b2Body.prototype.m_controllerCount);
box2d.b2Body.prototype.CreateFixture = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 === this.m_world.IsLocked());
    if (!0 === this.m_world.IsLocked()) return null;
    var b = new box2d.b2Fixture;
    b.Create(this, a);
    this.m_flags & box2d.b2BodyFlag.e_activeFlag && b.CreateProxies(this.m_world.m_contactManager.m_broadPhase, this.m_xf);
    b.m_next = this.m_fixtureList;
    this.m_fixtureList = b;
    ++this.m_fixtureCount;
    b.m_body = this;
    0 < b.m_density && this.ResetMassData();
    this.m_world.m_flags |= box2d.b2WorldFlag.e_newFixture;
    return b
};
goog.exportProperty(box2d.b2Body.prototype, "CreateFixture", box2d.b2Body.prototype.CreateFixture);
box2d.b2Body.prototype.CreateFixture2 = function (a, b) {
    void 0 === b && (b = 0);
    var c = box2d.b2Body.prototype.CreateFixture2.s_def;
    c.shape = a;
    c.density = b;
    return this.CreateFixture(c)
};
goog.exportProperty(box2d.b2Body.prototype, "CreateFixture2", box2d.b2Body.prototype.CreateFixture2);
box2d.b2Body.prototype.CreateFixture2.s_def = new box2d.b2FixtureDef;
box2d.b2Body.prototype.DestroyFixture = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 === this.m_world.IsLocked());
    if (!0 !== this.m_world.IsLocked()) {
        box2d.ENABLE_ASSERTS && box2d.b2Assert(a.m_body === this);
        box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_fixtureCount);
        for (var b = this.m_fixtureList, c = null, e = !1; null !== b;) {
            if (b === a) {
                c ? c.m_next = a.m_next : this.m_fixtureList = a.m_next;
                e = !0;
                break
            }
            c = b;
            b = b.m_next
        }
        box2d.ENABLE_ASSERTS && box2d.b2Assert(e);
        for (b = this.m_contactList; b;) {
            var c = b.contact,
                b = b.next,
                e = c.GetFixtureA(),
                d = c.GetFixtureB();
            a !== e && a !== d || this.m_world.m_contactManager.Destroy(c)
        }
        this.m_flags & box2d.b2BodyFlag.e_activeFlag && a.DestroyProxies(this.m_world.m_contactManager.m_broadPhase);
        a.Destroy();
        a.m_body = null;
        a.m_next = null;
        --this.m_fixtureCount;
        this.ResetMassData()
    }
};
goog.exportProperty(box2d.b2Body.prototype, "DestroyFixture", box2d.b2Body.prototype.DestroyFixture);
box2d.b2Body.prototype.SetTransformVecRadians = function (a, b) {
    this.SetTransformXYRadians(a.x, a.y, b)
};
goog.exportProperty(box2d.b2Body.prototype, "SetTransformVecRadians", box2d.b2Body.prototype.SetTransformVecRadians);
box2d.b2Body.prototype.SetTransformXYRadians = function (a, b, c) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 === this.m_world.IsLocked());
    if (!0 !== this.m_world.IsLocked() && (this.m_xf.p.x !== a || this.m_xf.p.y !== b || this.m_xf.q.GetAngleRadians() !== c))
        for (this.m_xf.q.SetAngleRadians(c), this.m_xf.p.SetXY(a, b), box2d.b2MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c), this.m_sweep.a = c, this.m_sweep.c0.Copy(this.m_sweep.c), this.m_sweep.a0 = c, a = this.m_world.m_contactManager.m_broadPhase, b = this.m_fixtureList; b; b = b.m_next) b.Synchronize(a,
            this.m_xf, this.m_xf)
};
goog.exportProperty(box2d.b2Body.prototype, "SetTransformXYRadians", box2d.b2Body.prototype.SetTransformXYRadians);
box2d.b2Body.prototype.SetTransform = function (a) {
    this.SetTransformVecRadians(a.p, a.GetAngleRadians())
};
goog.exportProperty(box2d.b2Body.prototype, "SetTransform", box2d.b2Body.prototype.SetTransform);
box2d.b2Body.prototype.GetTransform = function (a) {
    a = a || this.m_out_xf;
    return a.Copy(this.m_xf)
};
goog.exportProperty(box2d.b2Body.prototype, "GetTransform", box2d.b2Body.prototype.GetTransform);
box2d.b2Body.prototype.GetPosition = function (a) {
    a = a || this.m_out_xf.p;
    return a.Copy(this.m_xf.p)
};
goog.exportProperty(box2d.b2Body.prototype, "GetPosition", box2d.b2Body.prototype.GetPosition);
box2d.b2Body.prototype.SetPosition = function (a) {
    this.SetTransformVecRadians(a, this.GetAngleRadians())
};
goog.exportProperty(box2d.b2Body.prototype, "SetPosition", box2d.b2Body.prototype.SetPosition);
box2d.b2Body.prototype.SetPositionXY = function (a, b) {
    this.SetTransformXYRadians(a, b, this.GetAngleRadians())
};
goog.exportProperty(box2d.b2Body.prototype, "SetPositionXY", box2d.b2Body.prototype.SetPositionXY);
box2d.b2Body.prototype.GetAngle = function () {
    return this.m_sweep.a
};
goog.exportProperty(box2d.b2Body.prototype, "GetAngle", box2d.b2Body.prototype.GetAngle);
box2d.b2Body.prototype.GetAngleRadians = box2d.b2Body.prototype.GetAngle;
box2d.b2Body.prototype.GetAngleDegrees = function () {
    return box2d.b2RadToDeg(this.GetAngle())
};
box2d.b2Body.prototype.SetAngle = function (a) {
    this.SetTransformVecRadians(this.GetPosition(), a)
};
goog.exportProperty(box2d.b2Body.prototype, "SetAngle", box2d.b2Body.prototype.SetAngle);
box2d.b2Body.prototype.SetAngleRadians = box2d.b2Body.prototype.SetAngle;
box2d.b2Body.prototype.SetAngleDegrees = function (a) {
    this.SetAngle(box2d.b2DegToRad(a))
};
box2d.b2Body.prototype.GetWorldCenter = function (a) {
    a = a || this.m_out_sweep.c;
    return a.Copy(this.m_sweep.c)
};
goog.exportProperty(box2d.b2Body.prototype, "GetWorldCenter", box2d.b2Body.prototype.GetWorldCenter);
box2d.b2Body.prototype.GetLocalCenter = function (a) {
    a = a || this.m_out_sweep.localCenter;
    return a.Copy(this.m_sweep.localCenter)
};
goog.exportProperty(box2d.b2Body.prototype, "GetLocalCenter", box2d.b2Body.prototype.GetLocalCenter);
box2d.b2Body.prototype.SetLinearVelocity = function (a) {
    this.m_type !== box2d.b2BodyType.b2_staticBody && (0 < box2d.b2DotVV(a, a) && this.SetAwake(!0), this.m_linearVelocity.Copy(a))
};
goog.exportProperty(box2d.b2Body.prototype, "SetLinearVelocity", box2d.b2Body.prototype.SetLinearVelocity);
box2d.b2Body.prototype.GetLinearVelocity = function (a) {
    a = a || this.m_out_linearVelocity;
    return a.Copy(this.m_linearVelocity)
};
goog.exportProperty(box2d.b2Body.prototype, "GetLinearVelocity", box2d.b2Body.prototype.GetLinearVelocity);
box2d.b2Body.prototype.SetAngularVelocity = function (a) {
    this.m_type !== box2d.b2BodyType.b2_staticBody && (0 < a * a && this.SetAwake(!0), this.m_angularVelocity = a)
};
goog.exportProperty(box2d.b2Body.prototype, "SetAngularVelocity", box2d.b2Body.prototype.SetAngularVelocity);
box2d.b2Body.prototype.GetAngularVelocity = function () {
    return this.m_angularVelocity
};
goog.exportProperty(box2d.b2Body.prototype, "GetAngularVelocity", box2d.b2Body.prototype.GetAngularVelocity);
box2d.b2Body.prototype.GetDefinition = function (a) {
    a.type = this.GetType();
    a.allowSleep = (this.m_flags & box2d.b2BodyFlag.e_autoSleepFlag) === box2d.b2BodyFlag.e_autoSleepFlag;
    a.angle = this.GetAngleRadians();
    a.angularDamping = this.m_angularDamping;
    a.gravityScale = this.m_gravityScale;
    a.angularVelocity = this.m_angularVelocity;
    a.fixedRotation = (this.m_flags & box2d.b2BodyFlag.e_fixedRotationFlag) === box2d.b2BodyFlag.e_fixedRotationFlag;
    a.bullet = (this.m_flags & box2d.b2BodyFlag.e_bulletFlag) === box2d.b2BodyFlag.e_bulletFlag;
    a.awake = (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) === box2d.b2BodyFlag.e_awakeFlag;
    a.linearDamping = this.m_linearDamping;
    a.linearVelocity.Copy(this.GetLinearVelocity());
    a.position.Copy(this.GetPosition());
    a.userData = this.GetUserData();
    return a
};
goog.exportProperty(box2d.b2Body.prototype, "GetDefinition", box2d.b2Body.prototype.GetDefinition);
box2d.b2Body.prototype.ApplyForce = function (a, b, c) {
    this.m_type === box2d.b2BodyType.b2_dynamicBody && (0 === (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) && this.SetAwake(!0), this.m_flags & box2d.b2BodyFlag.e_awakeFlag && (this.m_force.x += a.x, this.m_force.y += a.y, this.m_torque += (b.x - this.m_sweep.c.x) * a.y - (b.y - this.m_sweep.c.y) * a.x))
};
goog.exportProperty(box2d.b2Body.prototype, "ApplyForce", box2d.b2Body.prototype.ApplyForce);
box2d.b2Body.prototype.ApplyForceToCenter = function (a, b) {
    this.m_type === box2d.b2BodyType.b2_dynamicBody && (0 === (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) && this.SetAwake(!0), this.m_flags & box2d.b2BodyFlag.e_awakeFlag && (this.m_force.x += a.x, this.m_force.y += a.y))
};
goog.exportProperty(box2d.b2Body.prototype, "ApplyForceToCenter", box2d.b2Body.prototype.ApplyForceToCenter);
box2d.b2Body.prototype.ApplyTorque = function (a, b) {
    this.m_type === box2d.b2BodyType.b2_dynamicBody && (0 === (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) && this.SetAwake(!0), this.m_flags & box2d.b2BodyFlag.e_awakeFlag && (this.m_torque += a))
};
goog.exportProperty(box2d.b2Body.prototype, "ApplyTorque", box2d.b2Body.prototype.ApplyTorque);
box2d.b2Body.prototype.ApplyLinearImpulse = function (a, b, c) {
    this.m_type === box2d.b2BodyType.b2_dynamicBody && (0 === (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) && this.SetAwake(!0), this.m_flags & box2d.b2BodyFlag.e_awakeFlag && (this.m_linearVelocity.x += this.m_invMass * a.x, this.m_linearVelocity.y += this.m_invMass * a.y, this.m_angularVelocity += this.m_invI * ((b.x - this.m_sweep.c.x) * a.y - (b.y - this.m_sweep.c.y) * a.x)))
};
goog.exportProperty(box2d.b2Body.prototype, "ApplyLinearImpulse", box2d.b2Body.prototype.ApplyLinearImpulse);
box2d.b2Body.prototype.ApplyAngularImpulse = function (a, b) {
    this.m_type === box2d.b2BodyType.b2_dynamicBody && (0 === (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) && this.SetAwake(!0), this.m_flags & box2d.b2BodyFlag.e_awakeFlag && (this.m_angularVelocity += this.m_invI * a))
};
goog.exportProperty(box2d.b2Body.prototype, "ApplyAngularImpulse", box2d.b2Body.prototype.ApplyAngularImpulse);
box2d.b2Body.prototype.GetMass = function () {
    return this.m_mass
};
goog.exportProperty(box2d.b2Body.prototype, "GetMass", box2d.b2Body.prototype.GetMass);
box2d.b2Body.prototype.GetInertia = function () {
    return this.m_I + this.m_mass * box2d.b2DotVV(this.m_sweep.localCenter, this.m_sweep.localCenter)
};
goog.exportProperty(box2d.b2Body.prototype, "GetInertia", box2d.b2Body.prototype.GetInertia);
box2d.b2Body.prototype.GetMassData = function (a) {
    a.mass = this.m_mass;
    a.I = this.m_I + this.m_mass * box2d.b2DotVV(this.m_sweep.localCenter, this.m_sweep.localCenter);
    a.center.Copy(this.m_sweep.localCenter);
    return a
};
goog.exportProperty(box2d.b2Body.prototype, "GetMassData", box2d.b2Body.prototype.GetMassData);
box2d.b2Body.prototype.SetMassData = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 === this.m_world.IsLocked());
    if (!0 !== this.m_world.IsLocked() && this.m_type === box2d.b2BodyType.b2_dynamicBody) {
        this.m_invI = this.m_I = this.m_invMass = 0;
        this.m_mass = a.mass;
        0 >= this.m_mass && (this.m_mass = 1);
        this.m_invMass = 1 / this.m_mass;
        0 < a.I && 0 === (this.m_flags & box2d.b2BodyFlag.e_fixedRotationFlag) && (this.m_I = a.I - this.m_mass * box2d.b2DotVV(a.center, a.center), box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_I), this.m_invI = 1 / this.m_I);
        var b = box2d.b2Body.prototype.SetMassData.s_oldCenter.Copy(this.m_sweep.c);
        this.m_sweep.localCenter.Copy(a.center);
        box2d.b2MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
        this.m_sweep.c0.Copy(this.m_sweep.c);
        box2d.b2AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, box2d.b2SubVV(this.m_sweep.c, b, box2d.b2Vec2.s_t0), this.m_linearVelocity)
    }
};
goog.exportProperty(box2d.b2Body.prototype, "SetMassData", box2d.b2Body.prototype.SetMassData);
box2d.b2Body.prototype.SetMassData.s_oldCenter = new box2d.b2Vec2;
box2d.b2Body.prototype.ResetMassData = function () {
    this.m_invI = this.m_I = this.m_invMass = this.m_mass = 0;
    this.m_sweep.localCenter.SetZero();
    if (this.m_type === box2d.b2BodyType.b2_staticBody || this.m_type === box2d.b2BodyType.b2_kinematicBody) this.m_sweep.c0.Copy(this.m_xf.p), this.m_sweep.c.Copy(this.m_xf.p), this.m_sweep.a0 = this.m_sweep.a;
    else {
        box2d.ENABLE_ASSERTS && box2d.b2Assert(this.m_type === box2d.b2BodyType.b2_dynamicBody);
        for (var a = box2d.b2Body.prototype.ResetMassData.s_localCenter.SetZero(), b = this.m_fixtureList; b; b =
            b.m_next)
            if (0 !== b.m_density) {
                var c = b.GetMassData(box2d.b2Body.prototype.ResetMassData.s_massData);
                this.m_mass += c.mass;
                a.x += c.center.x * c.mass;
                a.y += c.center.y * c.mass;
                this.m_I += c.I
            }
        0 < this.m_mass ? (this.m_invMass = 1 / this.m_mass, a.x *= this.m_invMass, a.y *= this.m_invMass) : this.m_invMass = this.m_mass = 1;
        0 < this.m_I && 0 === (this.m_flags & box2d.b2BodyFlag.e_fixedRotationFlag) ? (this.m_I -= this.m_mass * box2d.b2DotVV(a, a), box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_I), this.m_invI = 1 / this.m_I) : this.m_invI = this.m_I = 0;
        b = box2d.b2Body.prototype.ResetMassData.s_oldCenter.Copy(this.m_sweep.c);
        this.m_sweep.localCenter.Copy(a);
        box2d.b2MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
        this.m_sweep.c0.Copy(this.m_sweep.c);
        box2d.b2AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, box2d.b2SubVV(this.m_sweep.c, b, box2d.b2Vec2.s_t0), this.m_linearVelocity)
    }
};
goog.exportProperty(box2d.b2Body.prototype, "ResetMassData", box2d.b2Body.prototype.ResetMassData);
box2d.b2Body.prototype.ResetMassData.s_localCenter = new box2d.b2Vec2;
box2d.b2Body.prototype.ResetMassData.s_oldCenter = new box2d.b2Vec2;
box2d.b2Body.prototype.ResetMassData.s_massData = new box2d.b2MassData;
box2d.b2Body.prototype.GetWorldPoint = function (a, b) {
    return box2d.b2MulXV(this.m_xf, a, b)
};
goog.exportProperty(box2d.b2Body.prototype, "GetWorldPoint", box2d.b2Body.prototype.GetWorldPoint);
box2d.b2Body.prototype.GetWorldVector = function (a, b) {
    return box2d.b2MulRV(this.m_xf.q, a, b)
};
goog.exportProperty(box2d.b2Body.prototype, "GetWorldVector", box2d.b2Body.prototype.GetWorldVector);
box2d.b2Body.prototype.GetLocalPoint = function (a, b) {
    return box2d.b2MulTXV(this.m_xf, a, b)
};
goog.exportProperty(box2d.b2Body.prototype, "GetLocalPoint", box2d.b2Body.prototype.GetLocalPoint);
box2d.b2Body.prototype.GetLocalVector = function (a, b) {
    return box2d.b2MulTRV(this.m_xf.q, a, b)
};
goog.exportProperty(box2d.b2Body.prototype, "GetLocalVector", box2d.b2Body.prototype.GetLocalVector);
box2d.b2Body.prototype.GetLinearVelocityFromWorldPoint = function (a, b) {
    return box2d.b2AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, box2d.b2SubVV(a, this.m_sweep.c, box2d.b2Vec2.s_t0), b)
};
goog.exportProperty(box2d.b2Body.prototype, "GetLinearVelocityFromWorldPoint", box2d.b2Body.prototype.GetLinearVelocityFromWorldPoint);
box2d.b2Body.prototype.GetLinearVelocityFromLocalPoint = function (a, b) {
    return this.GetLinearVelocityFromWorldPoint(this.GetWorldPoint(a, b), b)
};
goog.exportProperty(box2d.b2Body.prototype, "GetLinearVelocityFromLocalPoint", box2d.b2Body.prototype.GetLinearVelocityFromLocalPoint);
box2d.b2Body.prototype.GetLinearDamping = function () {
    return this.m_linearDamping
};
goog.exportProperty(box2d.b2Body.prototype, "GetLinearDamping", box2d.b2Body.prototype.GetLinearDamping);
box2d.b2Body.prototype.SetLinearDamping = function (a) {
    this.m_linearDamping = a
};
goog.exportProperty(box2d.b2Body.prototype, "SetLinearDamping", box2d.b2Body.prototype.SetLinearDamping);
box2d.b2Body.prototype.GetAngularDamping = function () {
    return this.m_angularDamping
};
goog.exportProperty(box2d.b2Body.prototype, "GetAngularDamping", box2d.b2Body.prototype.GetAngularDamping);
box2d.b2Body.prototype.SetAngularDamping = function (a) {
    this.m_angularDamping = a
};
goog.exportProperty(box2d.b2Body.prototype, "SetAngularDamping", box2d.b2Body.prototype.SetAngularDamping);
box2d.b2Body.prototype.GetGravityScale = function () {
    return this.m_gravityScale
};
goog.exportProperty(box2d.b2Body.prototype, "GetGravityScale", box2d.b2Body.prototype.GetGravityScale);
box2d.b2Body.prototype.SetGravityScale = function (a) {
    this.m_gravityScale = a
};
goog.exportProperty(box2d.b2Body.prototype, "SetGravityScale", box2d.b2Body.prototype.SetGravityScale);
box2d.b2Body.prototype.SetType = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 === this.m_world.IsLocked());
    if (!0 !== this.m_world.IsLocked() && this.m_type !== a) {
        this.m_type = a;
        this.ResetMassData();
        this.m_type === box2d.b2BodyType.b2_staticBody && (this.m_linearVelocity.SetZero(), this.m_angularVelocity = 0, this.m_sweep.a0 = this.m_sweep.a, this.m_sweep.c0.Copy(this.m_sweep.c), this.SynchronizeFixtures());
        this.SetAwake(!0);
        this.m_force.SetZero();
        this.m_torque = 0;
        for (a = this.m_contactList; a;) {
            var b = a;
            a = a.next;
            this.m_world.m_contactManager.Destroy(b.contact)
        }
        this.m_contactList =
            null;
        a = this.m_world.m_contactManager.m_broadPhase;
        for (b = this.m_fixtureList; b; b = b.m_next)
            for (var c = b.m_proxyCount, e = 0; e < c; ++e) a.TouchProxy(b.m_proxies[e].proxy)
    }
};
goog.exportProperty(box2d.b2Body.prototype, "SetType", box2d.b2Body.prototype.SetType);
box2d.b2Body.prototype.GetType = function () {
    return this.m_type
};
goog.exportProperty(box2d.b2Body.prototype, "GetType", box2d.b2Body.prototype.GetType);
box2d.b2Body.prototype.SetBullet = function (a) {
    this.m_flags = a ? this.m_flags | box2d.b2BodyFlag.e_bulletFlag : this.m_flags & ~box2d.b2BodyFlag.e_bulletFlag
};
goog.exportProperty(box2d.b2Body.prototype, "SetBullet", box2d.b2Body.prototype.SetBullet);
box2d.b2Body.prototype.IsBullet = function () {
    return (this.m_flags & box2d.b2BodyFlag.e_bulletFlag) === box2d.b2BodyFlag.e_bulletFlag
};
goog.exportProperty(box2d.b2Body.prototype, "IsBullet", box2d.b2Body.prototype.IsBullet);
box2d.b2Body.prototype.SetSleepingAllowed = function (a) {
    a ? this.m_flags |= box2d.b2BodyFlag.e_autoSleepFlag : (this.m_flags &= ~box2d.b2BodyFlag.e_autoSleepFlag, this.SetAwake(!0))
};
goog.exportProperty(box2d.b2Body.prototype, "SetSleepingAllowed", box2d.b2Body.prototype.SetSleepingAllowed);
box2d.b2Body.prototype.IsSleepingAllowed = function () {
    return (this.m_flags & box2d.b2BodyFlag.e_autoSleepFlag) === box2d.b2BodyFlag.e_autoSleepFlag
};
goog.exportProperty(box2d.b2Body.prototype, "IsSleepingAllowed", box2d.b2Body.prototype.IsSleepingAllowed);
box2d.b2Body.prototype.SetAwake = function (a) {
    a ? 0 === (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) && (this.m_flags |= box2d.b2BodyFlag.e_awakeFlag, this.m_sleepTime = 0) : (this.m_flags &= ~box2d.b2BodyFlag.e_awakeFlag, this.m_sleepTime = 0, this.m_linearVelocity.SetZero(), this.m_angularVelocity = 0, this.m_force.SetZero(), this.m_torque = 0)
};
goog.exportProperty(box2d.b2Body.prototype, "SetAwake", box2d.b2Body.prototype.SetAwake);
box2d.b2Body.prototype.IsAwake = function () {
    return (this.m_flags & box2d.b2BodyFlag.e_awakeFlag) === box2d.b2BodyFlag.e_awakeFlag
};
goog.exportProperty(box2d.b2Body.prototype, "IsAwake", box2d.b2Body.prototype.IsAwake);
box2d.b2Body.prototype.SetActive = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 === this.m_world.IsLocked());
    if (a !== this.IsActive())
        if (a) {
            this.m_flags |= box2d.b2BodyFlag.e_activeFlag;
            a = this.m_world.m_contactManager.m_broadPhase;
            for (var b = this.m_fixtureList; b; b = b.m_next) b.CreateProxies(a, this.m_xf)
        } else {
            this.m_flags &= ~box2d.b2BodyFlag.e_activeFlag;
            a = this.m_world.m_contactManager.m_broadPhase;
            for (b = this.m_fixtureList; b; b = b.m_next) b.DestroyProxies(a);
            for (a = this.m_contactList; a;) b = a, a = a.next, this.m_world.m_contactManager.Destroy(b.contact);
            this.m_contactList = null
        }
};
goog.exportProperty(box2d.b2Body.prototype, "SetActive", box2d.b2Body.prototype.SetActive);
box2d.b2Body.prototype.IsActive = function () {
    return (this.m_flags & box2d.b2BodyFlag.e_activeFlag) === box2d.b2BodyFlag.e_activeFlag
};
goog.exportProperty(box2d.b2Body.prototype, "IsActive", box2d.b2Body.prototype.IsActive);
box2d.b2Body.prototype.SetFixedRotation = function (a) {
    (this.m_flags & box2d.b2BodyFlag.e_fixedRotationFlag) === box2d.b2BodyFlag.e_fixedRotationFlag !== a && (this.m_flags = a ? this.m_flags | box2d.b2BodyFlag.e_fixedRotationFlag : this.m_flags & ~box2d.b2BodyFlag.e_fixedRotationFlag, this.m_angularVelocity = 0, this.ResetMassData())
};
goog.exportProperty(box2d.b2Body.prototype, "SetFixedRotation", box2d.b2Body.prototype.SetFixedRotation);
box2d.b2Body.prototype.IsFixedRotation = function () {
    return (this.m_flags & box2d.b2BodyFlag.e_fixedRotationFlag) === box2d.b2BodyFlag.e_fixedRotationFlag
};
goog.exportProperty(box2d.b2Body.prototype, "IsFixedRotation", box2d.b2Body.prototype.IsFixedRotation);
box2d.b2Body.prototype.GetFixtureList = function () {
    return this.m_fixtureList
};
goog.exportProperty(box2d.b2Body.prototype, "GetFixtureList", box2d.b2Body.prototype.GetFixtureList);
box2d.b2Body.prototype.GetJointList = function () {
    return this.m_jointList
};
goog.exportProperty(box2d.b2Body.prototype, "GetJointList", box2d.b2Body.prototype.GetJointList);
box2d.b2Body.prototype.GetContactList = function () {
    return this.m_contactList
};
goog.exportProperty(box2d.b2Body.prototype, "GetContactList", box2d.b2Body.prototype.GetContactList);
box2d.b2Body.prototype.GetNext = function () {
    return this.m_next
};
goog.exportProperty(box2d.b2Body.prototype, "GetNext", box2d.b2Body.prototype.GetNext);
box2d.b2Body.prototype.GetUserData = function () {
    return this.m_userData
};
goog.exportProperty(box2d.b2Body.prototype, "GetUserData", box2d.b2Body.prototype.GetUserData);
box2d.b2Body.prototype.SetUserData = function (a) {
    this.m_userData = a
};
goog.exportProperty(box2d.b2Body.prototype, "SetUserData", box2d.b2Body.prototype.SetUserData);
box2d.b2Body.prototype.GetWorld = function () {
    return this.m_world
};
goog.exportProperty(box2d.b2Body.prototype, "GetWorld", box2d.b2Body.prototype.GetWorld);
box2d.b2Body.prototype.SynchronizeFixtures = function () {
    var a = box2d.b2Body.prototype.SynchronizeFixtures.s_xf1;
    a.q.SetAngleRadians(this.m_sweep.a0);
    box2d.b2MulRV(a.q, this.m_sweep.localCenter, a.p);
    box2d.b2SubVV(this.m_sweep.c0, a.p, a.p);
    for (var b = this.m_world.m_contactManager.m_broadPhase, c = this.m_fixtureList; c; c = c.m_next) c.Synchronize(b, a, this.m_xf)
};
goog.exportProperty(box2d.b2Body.prototype, "SynchronizeFixtures", box2d.b2Body.prototype.SynchronizeFixtures);
box2d.b2Body.prototype.SynchronizeFixtures.s_xf1 = new box2d.b2Transform;
box2d.b2Body.prototype.SynchronizeTransform = function () {
    this.m_xf.q.SetAngleRadians(this.m_sweep.a);
    box2d.b2MulRV(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
    box2d.b2SubVV(this.m_sweep.c, this.m_xf.p, this.m_xf.p)
};
goog.exportProperty(box2d.b2Body.prototype, "SynchronizeTransform", box2d.b2Body.prototype.SynchronizeTransform);
box2d.b2Body.prototype.ShouldCollide = function (a) {
    if (this.m_type !== box2d.b2BodyType.b2_dynamicBody && a.m_type !== box2d.b2BodyType.b2_dynamicBody) return !1;
    for (var b = this.m_jointList; b; b = b.next)
        if (b.other === a && !1 === b.joint.m_collideConnected) return !1;
    return !0
};
goog.exportProperty(box2d.b2Body.prototype, "ShouldCollide", box2d.b2Body.prototype.ShouldCollide);
box2d.b2Body.prototype.Advance = function (a) {
    this.m_sweep.Advance(a);
    this.m_sweep.c.Copy(this.m_sweep.c0);
    this.m_sweep.a = this.m_sweep.a0;
    this.m_xf.q.SetAngleRadians(this.m_sweep.a);
    box2d.b2MulRV(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
    box2d.b2SubVV(this.m_sweep.c, this.m_xf.p, this.m_xf.p)
};
goog.exportProperty(box2d.b2Body.prototype, "Advance", box2d.b2Body.prototype.Advance);
box2d.b2Body.prototype.Dump = function () {
    if (box2d.DEBUG) {
        var a = this.m_islandIndex;
        box2d.b2Log("if (true)\n");
        box2d.b2Log("{\n");
        box2d.b2Log("  /*box2d.b2BodyDef*/ var bd = new box2d.b2BodyDef();\n");
        var b = "";
        switch (this.m_type) {
        case box2d.b2BodyType.b2_staticBody:
            b = "box2d.b2BodyType.b2_staticBody";
            break;
        case box2d.b2BodyType.b2_kinematicBody:
            b = "box2d.b2BodyType.b2_kinematicBody";
            break;
        case box2d.b2BodyType.b2_dynamicBody:
            b = "box2d.b2BodyType.b2_dynamicBody";
            break;
        default:
            box2d.ENABLE_ASSERTS && box2d.b2Assert(!1)
        }
        box2d.b2Log("  bd.type = %s;\n",
            b);
        box2d.b2Log("  bd.position.SetXY(%.15f, %.15f);\n", this.m_xf.p.x, this.m_xf.p.y);
        box2d.b2Log("  bd.angle = %.15f;\n", this.m_sweep.a);
        box2d.b2Log("  bd.linearVelocity.SetXY(%.15f, %.15f);\n", this.m_linearVelocity.x, this.m_linearVelocity.y);
        box2d.b2Log("  bd.angularVelocity = %.15f;\n", this.m_angularVelocity);
        box2d.b2Log("  bd.linearDamping = %.15f;\n", this.m_linearDamping);
        box2d.b2Log("  bd.angularDamping = %.15f;\n", this.m_angularDamping);
        box2d.b2Log("  bd.allowSleep = %s;\n", this.m_flags & box2d.b2BodyFlag.e_autoSleepFlag ?
            "true" : "false");
        box2d.b2Log("  bd.awake = %s;\n", this.m_flags & box2d.b2BodyFlag.e_awakeFlag ? "true" : "false");
        box2d.b2Log("  bd.fixedRotation = %s;\n", this.m_flags & box2d.b2BodyFlag.e_fixedRotationFlag ? "true" : "false");
        box2d.b2Log("  bd.bullet = %s;\n", this.m_flags & box2d.b2BodyFlag.e_bulletFlag ? "true" : "false");
        box2d.b2Log("  bd.active = %s;\n", this.m_flags & box2d.b2BodyFlag.e_activeFlag ? "true" : "false");
        box2d.b2Log("  bd.gravityScale = %.15f;\n", this.m_gravityScale);
        box2d.b2Log("\n");
        box2d.b2Log("  bodies[%d] = this.m_world.CreateBody(bd);\n",
            this.m_islandIndex);
        box2d.b2Log("\n");
        for (b = this.m_fixtureList; b; b = b.m_next) box2d.b2Log("  if (true)\n"), box2d.b2Log("  {\n"), b.Dump(a), box2d.b2Log("  }\n");
        box2d.b2Log("}\n")
    }
};
goog.exportProperty(box2d.b2Body.prototype, "Dump", box2d.b2Body.prototype.Dump);
box2d.b2Body.prototype.GetControllerList = function () {
    return this.m_controllerList
};
goog.exportProperty(box2d.b2Body.prototype, "GetControllerList", box2d.b2Body.prototype.GetControllerList);
box2d.b2Body.prototype.GetControllerCount = function () {
    return this.m_controllerCount
};
goog.exportProperty(box2d.b2Body.prototype, "GetControllerCount", box2d.b2Body.prototype.GetControllerCount);
box2d.b2WorldFlag = {
    e_none: 0,
    e_newFixture: 1,
    e_locked: 2,
    e_clearForces: 4
};
goog.exportSymbol("box2d.b2WorldFlag", box2d.b2WorldFlag);
goog.exportProperty(box2d.b2WorldFlag, "e_none", box2d.b2WorldFlag.e_none);
goog.exportProperty(box2d.b2WorldFlag, "e_newFixture", box2d.b2WorldFlag.e_newFixture);
goog.exportProperty(box2d.b2WorldFlag, "e_locked", box2d.b2WorldFlag.e_locked);
goog.exportProperty(box2d.b2WorldFlag, "e_clearForces", box2d.b2WorldFlag.e_clearForces);
box2d.b2World = function (a) {
    this.m_flags = box2d.b2WorldFlag.e_clearForces;
    this.m_contactManager = new box2d.b2ContactManager;
    this.m_gravity = a.Clone();
    this.m_out_gravity = new box2d.b2Vec2;
    this.m_allowSleep = !0;
    this.m_debugDraw = this.m_destructionListener = null;
    this.m_continuousPhysics = this.m_warmStarting = !0;
    this.m_subStepping = !1;
    this.m_stepComplete = !0;
    this.m_profile = new box2d.b2Profile;
    this.m_island = new box2d.b2Island;
    this.s_stack = []
};
goog.exportSymbol("box2d.b2World", box2d.b2World);
box2d.b2World.prototype.m_flags = box2d.b2WorldFlag.e_none;
goog.exportProperty(box2d.b2World.prototype, "m_flags", box2d.b2World.prototype.m_flags);
box2d.b2World.prototype.m_contactManager = null;
goog.exportProperty(box2d.b2World.prototype, "m_contactManager", box2d.b2World.prototype.m_contactManager);
box2d.b2World.prototype.m_bodyList = null;
goog.exportProperty(box2d.b2World.prototype, "m_bodyList", box2d.b2World.prototype.m_bodyList);
box2d.b2World.prototype.m_jointList = null;
goog.exportProperty(box2d.b2World.prototype, "m_jointList", box2d.b2World.prototype.m_jointList);
box2d.b2World.prototype.m_bodyCount = 0;
goog.exportProperty(box2d.b2World.prototype, "m_bodyCount", box2d.b2World.prototype.m_bodyCount);
box2d.b2World.prototype.m_jointCount = 0;
goog.exportProperty(box2d.b2World.prototype, "m_jointCount", box2d.b2World.prototype.m_jointCount);
box2d.b2World.prototype.m_gravity = null;
goog.exportProperty(box2d.b2World.prototype, "m_gravity", box2d.b2World.prototype.m_gravity);
box2d.b2World.prototype.m_out_gravity = null;
goog.exportProperty(box2d.b2World.prototype, "m_out_gravity", box2d.b2World.prototype.m_out_gravity);
box2d.b2World.prototype.m_allowSleep = !0;
goog.exportProperty(box2d.b2World.prototype, "m_allowSleep", box2d.b2World.prototype.m_allowSleep);
box2d.b2World.prototype.m_destructionListener = null;
goog.exportProperty(box2d.b2World.prototype, "m_destructionListener", box2d.b2World.prototype.m_destructionListener);
box2d.b2World.prototype.m_debugDraw = null;
goog.exportProperty(box2d.b2World.prototype, "m_debugDraw", box2d.b2World.prototype.m_debugDraw);
box2d.b2World.prototype.m_inv_dt0 = 0;
goog.exportProperty(box2d.b2World.prototype, "m_inv_dt0", box2d.b2World.prototype.m_inv_dt0);
box2d.b2World.prototype.m_warmStarting = !0;
goog.exportProperty(box2d.b2World.prototype, "m_warmStarting", box2d.b2World.prototype.m_warmStarting);
box2d.b2World.prototype.m_continuousPhysics = !0;
goog.exportProperty(box2d.b2World.prototype, "m_continuousPhysics", box2d.b2World.prototype.m_continuousPhysics);
box2d.b2World.prototype.m_subStepping = !1;
goog.exportProperty(box2d.b2World.prototype, "m_subStepping", box2d.b2World.prototype.m_subStepping);
box2d.b2World.prototype.m_stepComplete = !0;
goog.exportProperty(box2d.b2World.prototype, "m_stepComplete", box2d.b2World.prototype.m_stepComplete);
box2d.b2World.prototype.m_profile = null;
goog.exportProperty(box2d.b2World.prototype, "m_profile", box2d.b2World.prototype.m_profile);
box2d.b2World.prototype.m_island = null;
goog.exportProperty(box2d.b2World.prototype, "m_island", box2d.b2World.prototype.m_island);
box2d.b2World.prototype.s_stack = null;
goog.exportProperty(box2d.b2World.prototype, "s_stack", box2d.b2World.prototype.s_stack);
box2d.b2World.prototype.m_controllerList = null;
goog.exportProperty(box2d.b2World.prototype, "m_controllerList", box2d.b2World.prototype.m_controllerList);
box2d.b2World.prototype.m_controllerCount = 0;
goog.exportProperty(box2d.b2World.prototype, "m_controllerCount", box2d.b2World.prototype.m_controllerCount);
box2d.b2World.prototype.SetAllowSleeping = function (a) {
    if (a !== this.m_allowSleep && (this.m_allowSleep = a, !1 === this.m_allowSleep))
        for (a = this.m_bodyList; a; a = a.m_next) a.SetAwake(!0)
};
goog.exportProperty(box2d.b2World.prototype, "SetAllowSleeping", box2d.b2World.prototype.SetAllowSleeping);
box2d.b2World.prototype.GetAllowSleeping = function () {
    return this.m_allowSleep
};
goog.exportProperty(box2d.b2World.prototype, "GetAllowSleeping", box2d.b2World.prototype.GetAllowSleeping);
box2d.b2World.prototype.SetWarmStarting = function (a) {
    this.m_warmStarting = a
};
goog.exportProperty(box2d.b2World.prototype, "SetWarmStarting", box2d.b2World.prototype.SetWarmStarting);
box2d.b2World.prototype.GetWarmStarting = function () {
    return this.m_warmStarting
};
goog.exportProperty(box2d.b2World.prototype, "GetWarmStarting", box2d.b2World.prototype.GetWarmStarting);
box2d.b2World.prototype.SetContinuousPhysics = function (a) {
    this.m_continuousPhysics = a
};
goog.exportProperty(box2d.b2World.prototype, "SetContinuousPhysics", box2d.b2World.prototype.SetContinuousPhysics);
box2d.b2World.prototype.GetContinuousPhysics = function () {
    return this.m_continuousPhysics
};
goog.exportProperty(box2d.b2World.prototype, "GetContinuousPhysics", box2d.b2World.prototype.GetContinuousPhysics);
box2d.b2World.prototype.SetSubStepping = function (a) {
    this.m_subStepping = a
};
goog.exportProperty(box2d.b2World.prototype, "SetSubStepping", box2d.b2World.prototype.SetSubStepping);
box2d.b2World.prototype.GetSubStepping = function () {
    return this.m_subStepping
};
goog.exportProperty(box2d.b2World.prototype, "GetSubStepping", box2d.b2World.prototype.GetSubStepping);
box2d.b2World.prototype.GetBodyList = function () {
    return this.m_bodyList
};
goog.exportProperty(box2d.b2World.prototype, "GetBodyList", box2d.b2World.prototype.GetBodyList);
box2d.b2World.prototype.GetJointList = function () {
    return this.m_jointList
};
goog.exportProperty(box2d.b2World.prototype, "GetJointList", box2d.b2World.prototype.GetJointList);
box2d.b2World.prototype.GetContactList = function () {
    return this.m_contactManager.m_contactList
};
goog.exportProperty(box2d.b2World.prototype, "GetContactList", box2d.b2World.prototype.GetContactList);
box2d.b2World.prototype.GetBodyCount = function () {
    return this.m_bodyCount
};
goog.exportProperty(box2d.b2World.prototype, "GetBodyCount", box2d.b2World.prototype.GetBodyCount);
box2d.b2World.prototype.GetJointCount = function () {
    return this.m_jointCount
};
goog.exportProperty(box2d.b2World.prototype, "GetJointCount", box2d.b2World.prototype.GetJointCount);
box2d.b2World.prototype.GetContactCount = function () {
    return this.m_contactManager.m_contactCount
};
goog.exportProperty(box2d.b2World.prototype, "GetContactCount", box2d.b2World.prototype.GetContactCount);
box2d.b2World.prototype.SetGravity = function (a, b) {
    b = b || !0;
    if (this.m_gravity.x !== a.x || this.m_gravity.y !== a.y)
        if (this.m_gravity.Copy(a), b)
            for (var c = this.m_bodyList; c; c = c.m_next) c.SetAwake(!0)
};
goog.exportProperty(box2d.b2World.prototype, "SetGravity", box2d.b2World.prototype.SetGravity);
box2d.b2World.prototype.GetGravity = function (a) {
    a = a || this.m_out_gravity;
    return a.Copy(this.m_gravity)
};
goog.exportProperty(box2d.b2World.prototype, "GetGravity", box2d.b2World.prototype.GetGravity);
box2d.b2World.prototype.IsLocked = function () {
    return 0 < (this.m_flags & box2d.b2WorldFlag.e_locked)
};
goog.exportProperty(box2d.b2World.prototype, "IsLocked", box2d.b2World.prototype.IsLocked);
box2d.b2World.prototype.SetAutoClearForces = function (a) {
    this.m_flags = a ? this.m_flags | box2d.b2WorldFlag.e_clearForces : this.m_flags & ~box2d.b2WorldFlag.e_clearForces
};
goog.exportProperty(box2d.b2World.prototype, "SetAutoClearForces", box2d.b2World.prototype.SetAutoClearForces);
box2d.b2World.prototype.GetAutoClearForces = function () {
    return (this.m_flags & box2d.b2WorldFlag.e_clearForces) === box2d.b2WorldFlag.e_clearForces
};
goog.exportProperty(box2d.b2World.prototype, "GetAutoClearForces", box2d.b2World.prototype.GetAutoClearForces);
box2d.b2World.prototype.GetContactManager = function () {
    return this.m_contactManager
};
goog.exportProperty(box2d.b2World.prototype, "GetContactManager", box2d.b2World.prototype.GetContactManager);
box2d.b2World.prototype.GetProfile = function () {
    return this.m_profile
};
goog.exportProperty(box2d.b2World.prototype, "GetProfile", box2d.b2World.prototype.GetProfile);
box2d.b2World.prototype.SetDestructionListener = function (a) {
    this.m_destructionListener = a
};
goog.exportProperty(box2d.b2World.prototype, "SetDestructionListener", box2d.b2World.prototype.SetDestructionListener);
box2d.b2World.prototype.SetContactFilter = function (a) {
    this.m_contactManager.m_contactFilter = a
};
goog.exportProperty(box2d.b2World.prototype, "SetContactFilter", box2d.b2World.prototype.SetContactFilter);
box2d.b2World.prototype.SetContactListener = function (a) {
    this.m_contactManager.m_contactListener = a
};
goog.exportProperty(box2d.b2World.prototype, "SetContactListener", box2d.b2World.prototype.SetContactListener);
box2d.b2World.prototype.SetDebugDraw = function (a) {
    this.m_debugDraw = a
};
goog.exportProperty(box2d.b2World.prototype, "SetDebugDraw", box2d.b2World.prototype.SetDebugDraw);
box2d.b2World.prototype.CreateBody = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 === this.IsLocked());
    if (this.IsLocked()) return null;
    a = new box2d.b2Body(a, this);
    a.m_prev = null;
    if (a.m_next = this.m_bodyList) this.m_bodyList.m_prev = a;
    this.m_bodyList = a;
    ++this.m_bodyCount;
    return a
};
goog.exportProperty(box2d.b2World.prototype, "CreateBody", box2d.b2World.prototype.CreateBody);
box2d.b2World.prototype.DestroyBody = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_bodyCount);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 === this.IsLocked());
    if (!this.IsLocked()) {
        for (var b = a.m_jointList; b;) {
            var c = b,
                b = b.next;
            this.m_destructionListener && this.m_destructionListener.SayGoodbyeJoint(c.joint);
            this.DestroyJoint(c.joint);
            a.m_jointList = b
        }
        a.m_jointList = null;
        for (b = a.m_controllerList; b;) c = b, b = b.nextController, c.controller.RemoveBody(a);
        for (b = a.m_contactList; b;) c = b, b = b.next, this.m_contactManager.Destroy(c.contact);
        a.m_contactList = null;
        for (b = a.m_fixtureList; b;) c = b, b = b.m_next, this.m_destructionListener && this.m_destructionListener.SayGoodbyeFixture(c), c.DestroyProxies(this.m_contactManager.m_broadPhase), c.Destroy(), a.m_fixtureList = b, a.m_fixtureCount -= 1;
        a.m_fixtureList = null;
        a.m_fixtureCount = 0;
        a.m_prev && (a.m_prev.m_next = a.m_next);
        a.m_next && (a.m_next.m_prev = a.m_prev);
        a === this.m_bodyList && (this.m_bodyList = a.m_next);
        --this.m_bodyCount
    }
};
goog.exportProperty(box2d.b2World.prototype, "DestroyBody", box2d.b2World.prototype.DestroyBody);
box2d.b2World.prototype.CreateJoint = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 === this.IsLocked());
    if (this.IsLocked()) return null;
    var b = box2d.b2JointFactory.Create(a, null);
    b.m_prev = null;
    if (b.m_next = this.m_jointList) this.m_jointList.m_prev = b;
    this.m_jointList = b;
    ++this.m_jointCount;
    b.m_edgeA.joint = b;
    b.m_edgeA.other = b.m_bodyB;
    b.m_edgeA.prev = null;
    if (b.m_edgeA.next = b.m_bodyA.m_jointList) b.m_bodyA.m_jointList.prev = b.m_edgeA;
    b.m_bodyA.m_jointList = b.m_edgeA;
    b.m_edgeB.joint = b;
    b.m_edgeB.other = b.m_bodyA;
    b.m_edgeB.prev = null;
    if (b.m_edgeB.next = b.m_bodyB.m_jointList) b.m_bodyB.m_jointList.prev = b.m_edgeB;
    b.m_bodyB.m_jointList = b.m_edgeB;
    var c = a.bodyA,
        e = a.bodyB;
    if (!1 === a.collideConnected)
        for (a = e.GetContactList(); a;) a.other === c && a.contact.FlagForFiltering(), a = a.next;
    return b
};
goog.exportProperty(box2d.b2World.prototype, "CreateJoint", box2d.b2World.prototype.CreateJoint);
box2d.b2World.prototype.DestroyJoint = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 === this.IsLocked());
    if (!this.IsLocked()) {
        var b = a.m_collideConnected;
        a.m_prev && (a.m_prev.m_next = a.m_next);
        a.m_next && (a.m_next.m_prev = a.m_prev);
        a === this.m_jointList && (this.m_jointList = a.m_next);
        var c = a.m_bodyA,
            e = a.m_bodyB;
        c.SetAwake(!0);
        e.SetAwake(!0);
        a.m_edgeA.prev && (a.m_edgeA.prev.next = a.m_edgeA.next);
        a.m_edgeA.next && (a.m_edgeA.next.prev = a.m_edgeA.prev);
        a.m_edgeA === c.m_jointList && (c.m_jointList = a.m_edgeA.next);
        a.m_edgeA.prev = null;
        a.m_edgeA.next = null;
        a.m_edgeB.prev && (a.m_edgeB.prev.next = a.m_edgeB.next);
        a.m_edgeB.next && (a.m_edgeB.next.prev = a.m_edgeB.prev);
        a.m_edgeB === e.m_jointList && (e.m_jointList = a.m_edgeB.next);
        a.m_edgeB.prev = null;
        a.m_edgeB.next = null;
        box2d.b2JointFactory.Destroy(a, null);
        box2d.ENABLE_ASSERTS && box2d.b2Assert(0 < this.m_jointCount);
        --this.m_jointCount;
        if (!1 === b)
            for (a = e.GetContactList(); a;) a.other === c && a.contact.FlagForFiltering(), a = a.next
    }
};
goog.exportProperty(box2d.b2World.prototype, "DestroyJoint", box2d.b2World.prototype.DestroyJoint);
box2d.b2World.prototype.Solve = function (a) {
    for (var b = this.m_controllerList; b; b = b.m_next) b.Step(a);
    this.m_profile.solveInit = 0;
    this.m_profile.solveVelocity = 0;
    this.m_profile.solvePosition = 0;
    b = this.m_island;
    b.Initialize(this.m_bodyCount, this.m_contactManager.m_contactCount, this.m_jointCount, null, this.m_contactManager.m_contactListener);
    for (var c = this.m_bodyList; c; c = c.m_next) c.m_flags &= ~box2d.b2BodyFlag.e_islandFlag;
    for (var e = this.m_contactManager.m_contactList; e; e = e.m_next) e.m_flags &= ~box2d.b2ContactFlag.e_islandFlag;
    for (e = this.m_jointList; e; e = e.m_next) e.m_islandFlag = !1;
    for (var e = this.m_bodyCount, d = this.s_stack, f = this.m_bodyList; f; f = f.m_next)
        if (!(f.m_flags & box2d.b2BodyFlag.e_islandFlag) && !1 !== f.IsAwake() && !1 !== f.IsActive() && f.GetType() !== box2d.b2BodyType.b2_staticBody) {
            b.Clear();
            var g = 0;
            d[g++] = f;
            for (f.m_flags |= box2d.b2BodyFlag.e_islandFlag; 0 < g;)
                if (c = d[--g], box2d.ENABLE_ASSERTS && box2d.b2Assert(!0 === c.IsActive()), b.AddBody(c), c.SetAwake(!0), c.GetType() !== box2d.b2BodyType.b2_staticBody) {
                    for (var h = c.m_contactList; h; h =
                        h.next) {
                        var l = h.contact;
                        if (!(l.m_flags & box2d.b2ContactFlag.e_islandFlag) && !1 !== l.IsEnabled() && !1 !== l.IsTouching()) {
                            var k = l.m_fixtureB.m_isSensor;
                            l.m_fixtureA.m_isSensor || k || (b.AddContact(l), l.m_flags |= box2d.b2ContactFlag.e_islandFlag, l = h.other, l.m_flags & box2d.b2BodyFlag.e_islandFlag || (box2d.ENABLE_ASSERTS && box2d.b2Assert(g < e), d[g++] = l, l.m_flags |= box2d.b2BodyFlag.e_islandFlag))
                        }
                    }
                    for (c = c.m_jointList; c; c = c.next)!0 !== c.joint.m_islandFlag && (l = c.other, !1 !== l.IsActive() && (b.AddJoint(c.joint), c.joint.m_islandFlag = !0, l.m_flags & box2d.b2BodyFlag.e_islandFlag || (box2d.ENABLE_ASSERTS && box2d.b2Assert(g < e), d[g++] = l, l.m_flags |= box2d.b2BodyFlag.e_islandFlag)))
                }
            c = new box2d.b2Profile;
            b.Solve(c, a, this.m_gravity, this.m_allowSleep);
            this.m_profile.solveInit += c.solveInit;
            this.m_profile.solveVelocity += c.solveVelocity;
            this.m_profile.solvePosition += c.solvePosition;
            for (g = 0; g < b.m_bodyCount; ++g) c = b.m_bodies[g], c.GetType() === box2d.b2BodyType.b2_staticBody && (c.m_flags &= ~box2d.b2BodyFlag.e_islandFlag)
        }
    for (g = 0; g < d.length && d[g]; ++g) d[g] =
        null;
    a = new box2d.b2Timer;
    for (c = this.m_bodyList; c; c = c.m_next) 0 !== (c.m_flags & box2d.b2BodyFlag.e_islandFlag) && c.GetType() !== box2d.b2BodyType.b2_staticBody && c.SynchronizeFixtures();
    this.m_contactManager.FindNewContacts();
    this.m_profile.broadphase = a.GetMilliseconds()
};
goog.exportProperty(box2d.b2World.prototype, "Solve", box2d.b2World.prototype.Solve);
box2d.b2World.prototype.SolveTOI = function (a) {
    var b = this.m_island;
    b.Initialize(2 * box2d.b2_maxTOIContacts, box2d.b2_maxTOIContacts, 0, null, this.m_contactManager.m_contactListener);
    if (this.m_stepComplete) {
        for (var c = this.m_bodyList; c; c = c.m_next) c.m_flags &= ~box2d.b2BodyFlag.e_islandFlag, c.m_sweep.alpha0 = 0;
        for (var e = this.m_contactManager.m_contactList; e; e = e.m_next) e.m_flags &= ~(box2d.b2ContactFlag.e_toiFlag | box2d.b2ContactFlag.e_islandFlag), e.m_toiCount = 0, e.m_toi = 1
    }
    for (;;) {
        for (var d = null, c = 1, e = this.m_contactManager.m_contactList; e; e =
            e.m_next)
            if (!1 !== e.IsEnabled() && !(e.m_toiCount > box2d.b2_maxSubSteps)) {
                var f = 1;
                if (e.m_flags & box2d.b2ContactFlag.e_toiFlag) f = e.m_toi;
                else {
                    var g = e.GetFixtureA(),
                        h = e.GetFixtureB();
                    if (g.IsSensor() || h.IsSensor()) continue;
                    var f = g.GetBody(),
                        l = h.GetBody(),
                        k = f.m_type,
                        m = l.m_type;
                    box2d.ENABLE_ASSERTS && box2d.b2Assert(k === box2d.b2BodyType.b2_dynamicBody || m === box2d.b2BodyType.b2_dynamicBody);
                    var n = f.IsAwake() && k !== box2d.b2BodyType.b2_staticBody,
                        p = l.IsAwake() && m !== box2d.b2BodyType.b2_staticBody;
                    if (!1 === n && !1 === p) continue;
                    k = f.IsBullet() || k !== box2d.b2BodyType.b2_dynamicBody;
                    m = l.IsBullet() || m !== box2d.b2BodyType.b2_dynamicBody;
                    if (!1 === k && !1 === m) continue;
                    m = f.m_sweep.alpha0;
                    f.m_sweep.alpha0 < l.m_sweep.alpha0 ? (m = l.m_sweep.alpha0, f.m_sweep.Advance(m)) : l.m_sweep.alpha0 < f.m_sweep.alpha0 && (m = f.m_sweep.alpha0, l.m_sweep.Advance(m));
                    box2d.ENABLE_ASSERTS && box2d.b2Assert(1 > m);
                    n = e.GetChildIndexA();
                    p = e.GetChildIndexB();
                    k = box2d.b2World.prototype.SolveTOI.s_toi_input;
                    k.proxyA.SetShape(g.GetShape(), n);
                    k.proxyB.SetShape(h.GetShape(), p);
                    k.sweepA.Copy(f.m_sweep);
                    k.sweepB.Copy(l.m_sweep);
                    k.tMax = 1;
                    f = box2d.b2World.prototype.SolveTOI.s_toi_output;
                    box2d.b2TimeOfImpact(f, k);
                    l = f.t;
                    f = f.state === box2d.b2TOIOutputState.e_touching ? box2d.b2Min(m + (1 - m) * l, 1) : 1;
                    e.m_toi = f;
                    e.m_flags |= box2d.b2ContactFlag.e_toiFlag
                }
                f < c && (d = e, c = f)
            }
        if (null === d || 1 - 10 * box2d.b2_epsilon < c) {
            this.m_stepComplete = !0;
            break
        }
        g = d.GetFixtureA();
        h = d.GetFixtureB();
        f = g.GetBody();
        l = h.GetBody();
        e = box2d.b2World.prototype.SolveTOI.s_backup1.Copy(f.m_sweep);
        g = box2d.b2World.prototype.SolveTOI.s_backup2.Copy(l.m_sweep);
        f.Advance(c);
        l.Advance(c);
        d.Update(this.m_contactManager.m_contactListener);
        d.m_flags &= ~box2d.b2ContactFlag.e_toiFlag;
        ++d.m_toiCount;
        if (!1 === d.IsEnabled() || !1 === d.IsTouching()) d.SetEnabled(!1), f.m_sweep.Copy(e), l.m_sweep.Copy(g), f.SynchronizeTransform(), l.SynchronizeTransform();
        else {
            f.SetAwake(!0);
            l.SetAwake(!0);
            b.Clear();
            b.AddBody(f);
            b.AddBody(l);
            b.AddContact(d);
            f.m_flags |= box2d.b2BodyFlag.e_islandFlag;
            l.m_flags |= box2d.b2BodyFlag.e_islandFlag;
            d.m_flags |= box2d.b2ContactFlag.e_islandFlag;
            for (d = 0; 2 >
                d; ++d)
                if (e = 0 === d ? f : l, e.m_type === box2d.b2BodyType.b2_dynamicBody)
                    for (g = e.m_contactList; g && b.m_bodyCount !== b.m_bodyCapacity && b.m_contactCount !== b.m_contactCapacity; g = g.next) h = g.contact, h.m_flags & box2d.b2ContactFlag.e_islandFlag || (m = g.other, m.m_type === box2d.b2BodyType.b2_dynamicBody && !1 === e.IsBullet() && !1 === m.IsBullet()) || (k = h.m_fixtureB.m_isSensor, h.m_fixtureA.m_isSensor || k || (k = box2d.b2World.prototype.SolveTOI.s_backup.Copy(m.m_sweep), 0 === (m.m_flags & box2d.b2BodyFlag.e_islandFlag) && m.Advance(c), h.Update(this.m_contactManager.m_contactListener), !1 === h.IsEnabled() ? (m.m_sweep.Copy(k), m.SynchronizeTransform()) : !1 === h.IsTouching() ? (m.m_sweep.Copy(k), m.SynchronizeTransform()) : (h.m_flags |= box2d.b2ContactFlag.e_islandFlag, b.AddContact(h), m.m_flags & box2d.b2BodyFlag.e_islandFlag || (m.m_flags |= box2d.b2BodyFlag.e_islandFlag, m.m_type !== box2d.b2BodyType.b2_staticBody && m.SetAwake(!0), b.AddBody(m)))));
            d = box2d.b2World.prototype.SolveTOI.s_subStep;
            d.dt = (1 - c) * a.dt;
            d.inv_dt = 1 / d.dt;
            d.dtRatio = 1;
            d.positionIterations = 20;
            d.velocityIterations = a.velocityIterations;
            d.warmStarting = !1;
            b.SolveTOI(d, f.m_islandIndex, l.m_islandIndex);
            for (d = 0; d < b.m_bodyCount; ++d)
                if (e = b.m_bodies[d], e.m_flags &= ~box2d.b2BodyFlag.e_islandFlag, e.m_type === box2d.b2BodyType.b2_dynamicBody)
                    for (e.SynchronizeFixtures(), g = e.m_contactList; g; g = g.next) g.contact.m_flags &= ~(box2d.b2ContactFlag.e_toiFlag | box2d.b2ContactFlag.e_islandFlag);
            this.m_contactManager.FindNewContacts();
            if (this.m_subStepping) {
                this.m_stepComplete = !1;
                break
            }
        }
    }
};
goog.exportProperty(box2d.b2World.prototype, "SolveTOI", box2d.b2World.prototype.SolveTOI);
box2d.b2World.prototype.SolveTOI.s_subStep = new box2d.b2TimeStep;
box2d.b2World.prototype.SolveTOI.s_backup = new box2d.b2Sweep;
box2d.b2World.prototype.SolveTOI.s_backup1 = new box2d.b2Sweep;
box2d.b2World.prototype.SolveTOI.s_backup2 = new box2d.b2Sweep;
box2d.b2World.prototype.SolveTOI.s_toi_input = new box2d.b2TOIInput;
box2d.b2World.prototype.SolveTOI.s_toi_output = new box2d.b2TOIOutput;
box2d.b2World.prototype.Step = function (a, b, c) {
    var e = new box2d.b2Timer;
    this.m_flags & box2d.b2WorldFlag.e_newFixture && (this.m_contactManager.FindNewContacts(), this.m_flags &= ~box2d.b2WorldFlag.e_newFixture);
    this.m_flags |= box2d.b2WorldFlag.e_locked;
    var d = box2d.b2World.prototype.Step.s_step;
    d.dt = a;
    d.velocityIterations = b;
    d.positionIterations = c;
    d.inv_dt = 0 < a ? 1 / a : 0;
    d.dtRatio = this.m_inv_dt0 * a;
    d.warmStarting = this.m_warmStarting;
    a = new box2d.b2Timer;
    this.m_contactManager.Collide();
    this.m_profile.collide = a.GetMilliseconds();
    this.m_stepComplete && 0 < d.dt && (a = new box2d.b2Timer, this.Solve(d), this.m_profile.solve = a.GetMilliseconds());
    this.m_continuousPhysics && 0 < d.dt && (a = new box2d.b2Timer, this.SolveTOI(d), this.m_profile.solveTOI = a.GetMilliseconds());
    0 < d.dt && (this.m_inv_dt0 = d.inv_dt);
    this.m_flags & box2d.b2WorldFlag.e_clearForces && this.ClearForces();
    this.m_flags &= ~box2d.b2WorldFlag.e_locked;
    this.m_profile.step = e.GetMilliseconds()
};
goog.exportProperty(box2d.b2World.prototype, "Step", box2d.b2World.prototype.Step);
box2d.b2World.prototype.Step.s_step = new box2d.b2TimeStep;
box2d.b2World.prototype.ClearForces = function () {
    for (var a = this.m_bodyList; a; a = a.m_next) a.m_force.SetZero(), a.m_torque = 0
};
goog.exportProperty(box2d.b2World.prototype, "ClearForces", box2d.b2World.prototype.ClearForces);
box2d.b2World.prototype.QueryAABB = function (a, b) {
    var c = this.m_contactManager.m_broadPhase;
    c.Query(function (b) {
        b = c.GetUserData(b);
        box2d.ENABLE_ASSERTS && box2d.b2Assert(b instanceof box2d.b2FixtureProxy);
        b = b.fixture;
        return a instanceof box2d.b2QueryCallback ? a.ReportFixture(b) : a(b)
    }, b)
};
goog.exportProperty(box2d.b2World.prototype, "QueryAABB", box2d.b2World.prototype.QueryAABB);
box2d.b2World.prototype.QueryShape = function (a, b, c) {
    var e = this.m_contactManager.m_broadPhase,
        d = box2d.b2World.prototype.QueryShape.s_aabb;
    b.ComputeAABB(d, c, 0);
    e.Query(function (d) {
        d = e.GetUserData(d);
        box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2FixtureProxy);
        d = d.fixture;
        return box2d.b2TestOverlapShape(b, 0, d.GetShape(), 0, c, d.GetBody().GetTransform()) ? a instanceof box2d.b2QueryCallback ? a.ReportFixture(d) : a(d) : !0
    }, d)
};
goog.exportProperty(box2d.b2World.prototype, "QueryShape", box2d.b2World.prototype.QueryShape);
box2d.b2World.prototype.QueryShape.s_aabb = new box2d.b2AABB;
box2d.b2World.prototype.QueryPoint = function (a, b) {
    var c = this.m_contactManager.m_broadPhase,
        e = box2d.b2World.prototype.QueryPoint.s_aabb;
    e.lowerBound.SetXY(b.x - box2d.b2_linearSlop, b.y - box2d.b2_linearSlop);
    e.upperBound.SetXY(b.x + box2d.b2_linearSlop, b.y + box2d.b2_linearSlop);
    c.Query(function (d) {
        d = c.GetUserData(d);
        box2d.ENABLE_ASSERTS && box2d.b2Assert(d instanceof box2d.b2FixtureProxy);
        d = d.fixture;
        return d.TestPoint(b) ? a instanceof box2d.b2QueryCallback ? a.ReportFixture(d) : a(d) : !0
    }, e)
};
goog.exportProperty(box2d.b2World.prototype, "QueryPoint", box2d.b2World.prototype.QueryPoint);
box2d.b2World.prototype.QueryPoint.s_aabb = new box2d.b2AABB;
box2d.b2World.prototype.RayCast = function (a, b, c) {
    var e = this.m_contactManager.m_broadPhase,
        d = box2d.b2World.prototype.RayCast.s_input;
    d.maxFraction = 1;
    d.p1.Copy(b);
    d.p2.Copy(c);
    e.RayCast(function (d, g) {
        var h = e.GetUserData(g);
        box2d.ENABLE_ASSERTS && box2d.b2Assert(h instanceof box2d.b2FixtureProxy);
        var l = h.fixture,
            k = box2d.b2World.prototype.RayCast.s_output;
        if (l.RayCast(k, d, h.childIndex)) {
            var h = k.fraction,
                m = box2d.b2World.prototype.RayCast.s_point;
            m.SetXY((1 - h) * b.x + h * c.x, (1 - h) * b.y + h * c.y);
            return a instanceof
            box2d.b2RayCastCallback ? a.ReportFixture(l, m, k.normal, h) : a(l, m, k.normal, h)
        }
        return d.maxFraction
    }, d)
};
goog.exportProperty(box2d.b2World.prototype, "RayCast", box2d.b2World.prototype.RayCast);
box2d.b2World.prototype.RayCast.s_input = new box2d.b2RayCastInput;
box2d.b2World.prototype.RayCast.s_output = new box2d.b2RayCastOutput;
box2d.b2World.prototype.RayCast.s_point = new box2d.b2Vec2;
box2d.b2World.prototype.RayCastOne = function (a, b) {
    var c = null,
        e = 1;
    this.RayCast(function (a, b, g, h) {
        h < e && (e = h, c = a);
        return e
    }, a, b);
    return c
};
goog.exportProperty(box2d.b2World.prototype, "RayCastOne", box2d.b2World.prototype.RayCastOne);
box2d.b2World.prototype.RayCastAll = function (a, b, c) {
    c.length = 0;
    this.RayCast(function (a, b, f, g) {
        c.push(a);
        return 1
    }, a, b);
    return c
};
goog.exportProperty(box2d.b2World.prototype, "RayCastAll", box2d.b2World.prototype.RayCastAll);
box2d.b2World.prototype.DrawShape = function (a, b) {
    var c = a.GetShape();
    switch (c.m_type) {
    case box2d.b2ShapeType.e_circleShape:
        c = c instanceof box2d.b2CircleShape ? c : null;
        this.m_debugDraw.DrawSolidCircle(c.m_p, c.m_radius, box2d.b2Vec2.UNITX, b);
        break;
    case box2d.b2ShapeType.e_edgeShape:
        var e = c instanceof box2d.b2EdgeShape ? c : null,
            c = e.m_vertex1,
            d = e.m_vertex2;
        this.m_debugDraw.DrawSegment(c, d, b);
        break;
    case box2d.b2ShapeType.e_chainShape:
        var c = c instanceof box2d.b2ChainShape ? c : null,
            e = c.m_count,
            f = c.m_vertices,
            c = f[0];
        this.m_debugDraw.DrawCircle(c, 0.05, b);
        for (var g = 1; g < e; ++g) d = f[g], this.m_debugDraw.DrawSegment(c, d, b), this.m_debugDraw.DrawCircle(d, 0.05, b), c = d;
        break;
    case box2d.b2ShapeType.e_polygonShape:
        e = c instanceof box2d.b2PolygonShape ? c : null, c = e.m_count, f = e.m_vertices, this.m_debugDraw.DrawSolidPolygon(f, c, b)
    }
};
goog.exportProperty(box2d.b2World.prototype, "DrawShape", box2d.b2World.prototype.DrawShape);
box2d.b2World.prototype.DrawJoint = function (a) {
    var b = a.GetBodyA(),
        c = a.GetBodyB(),
        e = b.m_xf.p,
        d = c.m_xf.p,
        c = a.GetAnchorA(box2d.b2World.prototype.DrawJoint.s_p1),
        b = a.GetAnchorB(box2d.b2World.prototype.DrawJoint.s_p2),
        f = box2d.b2World.prototype.DrawJoint.s_color.SetRGB(0.5, 0.8, 0.8);
    switch (a.m_type) {
    case box2d.b2JointType.e_distanceJoint:
        this.m_debugDraw.DrawSegment(c, b, f);
        break;
    case box2d.b2JointType.e_pulleyJoint:
        e = a instanceof box2d.b2PulleyJoint ? a : null;
        a = e.GetGroundAnchorA(box2d.b2World.prototype.DrawJoint.s_s1);
        e = e.GetGroundAnchorB(box2d.b2World.prototype.DrawJoint.s_s2);
        this.m_debugDraw.DrawSegment(a, c, f);
        this.m_debugDraw.DrawSegment(e, b, f);
        this.m_debugDraw.DrawSegment(a, e, f);
        break;
    case box2d.b2JointType.e_mouseJoint:
        this.m_debugDraw.DrawSegment(c, b, f);
        break;
    default:
        this.m_debugDraw.DrawSegment(e, c, f), this.m_debugDraw.DrawSegment(c, b, f), this.m_debugDraw.DrawSegment(d, b, f)
    }
};
goog.exportProperty(box2d.b2World.prototype, "DrawJoint", box2d.b2World.prototype.DrawJoint);
box2d.b2World.prototype.DrawJoint.s_p1 = new box2d.b2Vec2;
box2d.b2World.prototype.DrawJoint.s_p2 = new box2d.b2Vec2;
box2d.b2World.prototype.DrawJoint.s_color = new box2d.b2Color(0.5, 0.8, 0.8);
box2d.b2World.prototype.DrawJoint.s_s1 = new box2d.b2Vec2;
box2d.b2World.prototype.DrawJoint.s_s2 = new box2d.b2Vec2;
box2d.b2World.prototype.DrawDebugData = function () {
    if (null !== this.m_debugDraw) {
        var a = this.m_debugDraw.GetFlags(),
            b = box2d.b2World.prototype.DrawDebugData.s_color.SetRGB(0, 0, 0);
        if (a & box2d.b2DrawFlags.e_shapeBit)
            for (var c = this.m_bodyList; c; c = c.m_next) {
                var e = c.m_xf;
                this.m_debugDraw.PushTransform(e);
                for (var d = c.GetFixtureList(); d; d = d.m_next)!1 === c.IsActive() ? b.SetRGB(0.5, 0.5, 0.3) : c.GetType() === box2d.b2BodyType.b2_staticBody ? b.SetRGB(0.5, 0.9, 0.5) : c.GetType() === box2d.b2BodyType.b2_kinematicBody ? b.SetRGB(0.5,
                    0.5, 0.9) : !1 === c.IsAwake() ? b.SetRGB(0.6, 0.6, 0.6) : b.SetRGB(0.9, 0.7, 0.7), this.DrawShape(d, b);
                this.m_debugDraw.PopTransform(e)
            }
        if (a & box2d.b2DrawFlags.e_jointBit)
            for (c = this.m_jointList; c; c = c.m_next) this.DrawJoint(c);
        if (a & box2d.b2DrawFlags.e_aabbBit) {
            b.SetRGB(0.9, 0.3, 0.9);
            for (var e = this.m_contactManager.m_broadPhase, f = box2d.b2World.prototype.DrawDebugData.s_vs, c = this.m_bodyList; c; c = c.m_next)
                if (!1 !== c.IsActive())
                    for (d = c.GetFixtureList(); d; d = d.m_next)
                        for (var g = 0; g < d.m_proxyCount; ++g) {
                            var h = e.GetFatAABB(d.m_proxies[g].proxy);
                            f[0].SetXY(h.lowerBound.x, h.lowerBound.y);
                            f[1].SetXY(h.upperBound.x, h.lowerBound.y);
                            f[2].SetXY(h.upperBound.x, h.upperBound.y);
                            f[3].SetXY(h.lowerBound.x, h.upperBound.y);
                            this.m_debugDraw.DrawPolygon(f, 4, b)
                        }
        }
        if (a & box2d.b2DrawFlags.e_centerOfMassBit)
            for (c = this.m_bodyList; c; c = c.m_next) e = box2d.b2World.prototype.DrawDebugData.s_xf, e.q.Copy(c.m_xf.q), e.p.Copy(c.GetWorldCenter()), this.m_debugDraw.DrawTransform(e);
        if (a & box2d.b2DrawFlags.e_controllerBit)
            for (a = this.m_controllerList; a; a = a.m_next) a.Draw(this.m_debugDraw)
    }
};
goog.exportProperty(box2d.b2World.prototype, "DrawDebugData", box2d.b2World.prototype.DrawDebugData);
box2d.b2World.prototype.DrawDebugData.s_color = new box2d.b2Color(0, 0, 0);
box2d.b2World.prototype.DrawDebugData.s_vs = box2d.b2Vec2.MakeArray(4);
box2d.b2World.prototype.DrawDebugData.s_xf = new box2d.b2Transform;
box2d.b2World.prototype.SetBroadPhase = function (a) {
    var b = this.m_contactManager.m_broadPhase;
    this.m_contactManager.m_broadPhase = a;
    for (var c = this.m_bodyList; c; c = c.m_next)
        for (var e = c.m_fixtureList; e; e = e.m_next) e.m_proxy = a.CreateProxy(b.GetFatAABB(e.m_proxy), e)
};
goog.exportProperty(box2d.b2World.prototype, "SetBroadPhase", box2d.b2World.prototype.SetBroadPhase);
box2d.b2World.prototype.GetProxyCount = function () {
    return this.m_contactManager.m_broadPhase.GetProxyCount()
};
goog.exportProperty(box2d.b2World.prototype, "GetProxyCount", box2d.b2World.prototype.GetProxyCount);
box2d.b2World.prototype.GetTreeHeight = function () {
    return this.m_contactManager.m_broadPhase.GetTreeHeight()
};
goog.exportProperty(box2d.b2World.prototype, "GetTreeHeight", box2d.b2World.prototype.GetTreeHeight);
box2d.b2World.prototype.GetTreeBalance = function () {
    return this.m_contactManager.m_broadPhase.GetTreeBalance()
};
goog.exportProperty(box2d.b2World.prototype, "GetTreeBalance", box2d.b2World.prototype.GetTreeBalance);
box2d.b2World.prototype.GetTreeQuality = function () {
    return this.m_contactManager.m_broadPhase.GetTreeQuality()
};
goog.exportProperty(box2d.b2World.prototype, "GetTreeQuality", box2d.b2World.prototype.GetTreeQuality);
box2d.b2World.prototype.ShiftOrigin = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1 === this.IsLocked());
    if (!this.IsLocked()) {
        for (var b = this.m_bodyList; b; b = b.m_next) b.m_xf.p.SelfSub(a), b.m_sweep.c0.SelfSub(a), b.m_sweep.c.SelfSub(a);
        for (b = this.m_jointList; b; b = b.m_next) b.ShiftOrigin(a);
        this.m_contactManager.m_broadPhase.ShiftOrigin(a)
    }
};
goog.exportProperty(box2d.b2World.prototype, "ShiftOrigin", box2d.b2World.prototype.ShiftOrigin);
box2d.b2World.prototype.Dump = function () {
    if (box2d.DEBUG && (this.m_flags & box2d.b2WorldFlag.e_locked) !== box2d.b2WorldFlag.e_locked) {
        box2d.b2Log("/** @type {box2d.b2Vec2} */ var g = new box2d.b2Vec2(%.15f, %.15f);\n", this.m_gravity.x, this.m_gravity.y);
        box2d.b2Log("this.m_world.SetGravity(g);\n");
        box2d.b2Log("/** @type {Array.<box2d.b2Body>} */ var bodies = new Array(%d);\n", this.m_bodyCount);
        box2d.b2Log("/** @type {Array.<box2d.b2Joint>} */ var joints = new Array(%d);\n", this.m_jointCount);
        for (var a = 0,
                b = this.m_bodyList; b; b = b.m_next) b.m_islandIndex = a, b.Dump(), ++a;
        a = 0;
        for (b = this.m_jointList; b; b = b.m_next) b.m_index = a, ++a;
        for (b = this.m_jointList; b; b = b.m_next) b.m_type !== box2d.b2JointType.e_gearJoint && (box2d.b2Log("if (true)\n"), box2d.b2Log("{\n"), b.Dump(), box2d.b2Log("}\n"));
        for (b = this.m_jointList; b; b = b.m_next) b.m_type === box2d.b2JointType.e_gearJoint && (box2d.b2Log("if (true)\n"), box2d.b2Log("{\n"), b.Dump(), box2d.b2Log("}\n"))
    }
};
goog.exportProperty(box2d.b2World.prototype, "Dump", box2d.b2World.prototype.Dump);
box2d.b2World.prototype.AddController = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(null === a.m_world, "Controller can only be a member of one world");
    a.m_world = this;
    a.m_next = this.m_controllerList;
    a.m_prev = null;
    this.m_controllerList && (this.m_controllerList.m_prev = a);
    this.m_controllerList = a;
    ++this.m_controllerCount;
    return a
};
goog.exportProperty(box2d.b2World.prototype, "AddController", box2d.b2World.prototype.AddController);
box2d.b2World.prototype.RemoveController = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a.m_world === this, "Controller is not a member of this world");
    a.m_prev && (a.m_prev.m_next = a.m_next);
    a.m_next && (a.m_next.m_prev = a.m_prev);
    this.m_controllerList === a && (this.m_controllerList = a.m_next);
    --this.m_controllerCount;
    a.m_prev = null;
    a.m_next = null;
    a.m_world = null
};
goog.exportProperty(box2d.b2World.prototype, "RemoveController", box2d.b2World.prototype.RemoveController);
box2d.b2AreaJointDef = function () {
    box2d.b2JointDef.call(this, box2d.b2JointType.e_areaJoint);
    this.bodies = []
};
goog.inherits(box2d.b2AreaJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2AreaJointDef", box2d.b2AreaJointDef);
box2d.b2AreaJointDef.prototype.world = null;
goog.exportProperty(box2d.b2AreaJointDef.prototype, "world", box2d.b2AreaJointDef.prototype.world);
box2d.b2AreaJointDef.prototype.bodies = null;
goog.exportProperty(box2d.b2AreaJointDef.prototype, "bodies", box2d.b2AreaJointDef.prototype.bodies);
box2d.b2AreaJointDef.prototype.frequencyHz = 0;
goog.exportProperty(box2d.b2AreaJointDef.prototype, "frequencyHz", box2d.b2AreaJointDef.prototype.frequencyHz);
box2d.b2AreaJointDef.prototype.dampingRatio = 0;
goog.exportProperty(box2d.b2AreaJointDef.prototype, "dampingRatio", box2d.b2AreaJointDef.prototype.dampingRatio);
box2d.b2AreaJointDef.prototype.AddBody = function (a) {
    this.bodies.push(a);
    1 === this.bodies.length ? this.bodyA = a : 2 === this.bodies.length && (this.bodyB = a)
};
goog.exportProperty(box2d.b2AreaJointDef.prototype, "AddBody", box2d.b2AreaJointDef.prototype.AddBody);
box2d.b2AreaJoint = function (a) {
    box2d.b2Joint.call(this, a);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= a.bodies.length, "You cannot create an area joint with less than three bodies.");
    this.m_bodies = a.bodies;
    this.m_frequencyHz = a.frequencyHz;
    this.m_dampingRatio = a.dampingRatio;
    this.m_targetLengths = box2d.b2MakeNumberArray(a.bodies.length);
    this.m_normals = box2d.b2Vec2.MakeArray(a.bodies.length);
    this.m_joints = Array(a.bodies.length);
    this.m_deltas = box2d.b2Vec2.MakeArray(a.bodies.length);
    this.m_delta = new box2d.b2Vec2;
    var b = new box2d.b2DistanceJointDef;
    b.frequencyHz = a.frequencyHz;
    b.dampingRatio = a.dampingRatio;
    for (var c = this.m_targetArea = 0, e = this.m_bodies.length; c < e; ++c) {
        var d = this.m_bodies[c],
            f = this.m_bodies[(c + 1) % e],
            g = d.GetWorldCenter(),
            h = f.GetWorldCenter();
        this.m_targetLengths[c] = box2d.b2DistanceVV(g, h);
        this.m_targetArea += box2d.b2CrossVV(g, h);
        b.Initialize(d, f, g, h);
        this.m_joints[c] = a.world.CreateJoint(b)
    }
    this.m_targetArea *= 0.5
};
goog.inherits(box2d.b2AreaJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2AreaJoint", box2d.b2AreaJoint);
box2d.b2AreaJoint.prototype.m_bodies = null;
goog.exportProperty(box2d.b2AreaJoint.prototype, "m_bodies", box2d.b2AreaJoint.prototype.m_bodies);
box2d.b2AreaJoint.prototype.m_frequencyHz = 0;
goog.exportProperty(box2d.b2AreaJoint.prototype, "m_frequencyHz", box2d.b2AreaJoint.prototype.m_frequencyHz);
box2d.b2AreaJoint.prototype.m_dampingRatio = 0;
goog.exportProperty(box2d.b2AreaJoint.prototype, "m_dampingRatio", box2d.b2AreaJoint.prototype.m_dampingRatio);
box2d.b2AreaJoint.prototype.m_impulse = 0;
goog.exportProperty(box2d.b2AreaJoint.prototype, "m_impulse", box2d.b2AreaJoint.prototype.m_impulse);
box2d.b2AreaJoint.prototype.m_targetLengths = null;
box2d.b2AreaJoint.prototype.m_targetArea = 0;
box2d.b2AreaJoint.prototype.m_normals = null;
box2d.b2AreaJoint.prototype.m_joints = null;
box2d.b2AreaJoint.prototype.m_deltas = null;
box2d.b2AreaJoint.prototype.m_delta = null;
box2d.b2AreaJoint.prototype.GetAnchorA = function (a) {
    return a.SetZero()
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "GetAnchorA", box2d.b2AreaJoint.prototype.GetAnchorA);
box2d.b2AreaJoint.prototype.GetAnchorB = function (a) {
    return a.SetZero()
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "GetAnchorB", box2d.b2AreaJoint.prototype.GetAnchorB);
box2d.b2AreaJoint.prototype.GetReactionForce = function (a, b) {
    return b.SetZero()
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "GetReactionForce", box2d.b2AreaJoint.prototype.GetReactionForce);
box2d.b2AreaJoint.prototype.GetReactionTorque = function (a) {
    return 0
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "GetReactionTorque", box2d.b2AreaJoint.prototype.GetReactionTorque);
box2d.b2AreaJoint.prototype.SetFrequency = function (a) {
    this.m_frequencyHz = a;
    for (var b = 0, c = this.m_joints.length; b < c; ++b) this.m_joints[b].SetFrequency(a)
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "SetFrequency", box2d.b2AreaJoint.prototype.SetFrequency);
box2d.b2AreaJoint.prototype.GetFrequency = function () {
    return this.m_frequencyHz
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "GetFrequency", box2d.b2AreaJoint.prototype.GetFrequency);
box2d.b2AreaJoint.prototype.SetDampingRatio = function (a) {
    this.m_dampingRatio = a;
    for (var b = 0, c = this.m_joints.length; b < c; ++b) this.m_joints[b].SetDampingRatio(a)
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "SetDampingRatio", box2d.b2AreaJoint.prototype.SetDampingRatio);
box2d.b2AreaJoint.prototype.GetDampingRatio = function () {
    return this.m_dampingRatio
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "GetDampingRatio", box2d.b2AreaJoint.prototype.GetDampingRatio);
box2d.b2AreaJoint.prototype.Dump = function () {
    box2d.DEBUG && box2d.b2Log("Area joint dumping is not supported.\n")
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "Dump", box2d.b2AreaJoint.prototype.Dump);
box2d.b2AreaJoint.prototype.InitVelocityConstraints = function (a) {
    for (var b = 0, c = this.m_bodies.length; b < c; ++b) {
        var e = this.m_deltas[b];
        box2d.b2SubVV(a.positions[this.m_bodies[(b + 1) % c].m_islandIndex].c, a.positions[this.m_bodies[(b + c - 1) % c].m_islandIndex].c, e)
    }
    if (a.step.warmStarting)
        for (this.m_impulse *= a.step.dtRatio, b = 0, c = this.m_bodies.length; b < c; ++b) {
            var d = this.m_bodies[b],
                f = a.velocities[d.m_islandIndex].v,
                e = this.m_deltas[b];
            f.x += d.m_invMass * e.y * 0.5 * this.m_impulse;
            f.y += d.m_invMass * -e.x * 0.5 * this.m_impulse
        } else this.m_impulse =
            0
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "InitVelocityConstraints", box2d.b2AreaJoint.prototype.InitVelocityConstraints);
box2d.b2AreaJoint.prototype.SolveVelocityConstraints = function (a) {
    for (var b = 0, c = 0, e = 0, d = this.m_bodies.length; e < d; ++e) var f = this.m_bodies[e],
    g = a.velocities[f.m_islandIndex].v, h = this.m_deltas[e], b = b + h.GetLengthSquared() / f.GetMass(), c = c + box2d.b2CrossVV(g, h);
    b = -2 * c / b;
    this.m_impulse += b;
    e = 0;
    for (d = this.m_bodies.length; e < d; ++e) f = this.m_bodies[e], g = a.velocities[f.m_islandIndex].v, h = this.m_deltas[e], g.x += f.m_invMass * h.y * 0.5 * b, g.y += f.m_invMass * -h.x * 0.5 * b
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "SolveVelocityConstraints", box2d.b2AreaJoint.prototype.SolveVelocityConstraints);
box2d.b2AreaJoint.prototype.SolvePositionConstraints = function (a) {
    for (var b = 0, c = 0, e = 0, d = this.m_bodies.length; e < d; ++e) {
        var f = this.m_bodies[e],
            f = a.positions[f.m_islandIndex].c,
            g = a.positions[this.m_bodies[(e + 1) % d].m_islandIndex].c,
            h = box2d.b2SubVV(g, f, this.m_delta),
            l = h.GetLength();
        l < box2d.b2_epsilon && (l = 1);
        this.m_normals[e].x = h.y / l;
        this.m_normals[e].y = -h.x / l;
        b += l;
        c += box2d.b2CrossVV(f, g)
    }
    b = 0.5 * (this.m_targetArea - 0.5 * c) / b;
    c = !0;
    e = 0;
    for (d = this.m_bodies.length; e < d; ++e) f = this.m_bodies[e], f = a.positions[f.m_islandIndex].c,
    h = box2d.b2AddVV(this.m_normals[e], this.m_normals[(e + 1) % d], this.m_delta), h.SelfMul(b), g = h.GetLengthSquared(), g > box2d.b2Sq(box2d.b2_maxLinearCorrection) && h.SelfMul(box2d.b2_maxLinearCorrection / box2d.b2Sqrt(g)), g > box2d.b2Sq(box2d.b2_linearSlop) && (c = !1), f.x += h.x, f.y += h.y;
    return c
};
goog.exportProperty(box2d.b2AreaJoint.prototype, "SolvePositionConstraints", box2d.b2AreaJoint.prototype.SolvePositionConstraints);
box2d.b2BuoyancyController = function () {
    box2d.b2Controller.call(this);
    this.normal = new box2d.b2Vec2(0, 1);
    this.velocity = new box2d.b2Vec2(0, 0);
    this.gravity = new box2d.b2Vec2(0, 0)
};
goog.inherits(box2d.b2BuoyancyController, box2d.b2Controller);
goog.exportSymbol("box2d.b2BuoyancyController", box2d.b2BuoyancyController);
box2d.b2BuoyancyController.prototype.normal = null;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "normal", box2d.b2BuoyancyController.prototype.normal);
box2d.b2BuoyancyController.prototype.offset = 0;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "offset", box2d.b2BuoyancyController.prototype.offset);
box2d.b2BuoyancyController.prototype.density = 0;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "density", box2d.b2BuoyancyController.prototype.density);
box2d.b2BuoyancyController.prototype.velocity = null;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "velocity", box2d.b2BuoyancyController.prototype.velocity);
box2d.b2BuoyancyController.prototype.linearDrag = 0;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "linearDrag", box2d.b2BuoyancyController.prototype.linearDrag);
box2d.b2BuoyancyController.prototype.angularDrag = 0;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "angularDrag", box2d.b2BuoyancyController.prototype.angularDrag);
box2d.b2BuoyancyController.prototype.useDensity = !1;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "useDensity", box2d.b2BuoyancyController.prototype.useDensity);
box2d.b2BuoyancyController.prototype.useWorldGravity = !0;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "useWorldGravity", box2d.b2BuoyancyController.prototype.useWorldGravity);
box2d.b2BuoyancyController.prototype.gravity = null;
goog.exportProperty(box2d.b2BuoyancyController.prototype, "gravity", box2d.b2BuoyancyController.prototype.gravity);
box2d.b2BuoyancyController.prototype.Step = function (a) {
    if (this.m_bodyList)
        for (this.useWorldGravity && this.gravity.Copy(this.GetWorld().GetGravity()), a = this.m_bodyList; a; a = a.nextBody) {
            var b = a.body;
            if (!1 !== b.IsAwake()) {
                for (var c = new box2d.b2Vec2, e = new box2d.b2Vec2, d = 0, f = 0, g = b.GetFixtureList(); g; g = g.m_next) {
                    var h = new box2d.b2Vec2,
                        l = g.GetShape().ComputeSubmergedArea(this.normal, this.offset, b.GetTransform(), h),
                        d = d + l;
                    c.x += l * h.x;
                    c.y += l * h.y;
                    var k = 0,
                        k = this.useDensity ? g.GetDensity() : 1,
                        f = f + l * k;
                    e.x += l * h.x * k;
                    e.y +=
                        l * h.y * k
                }
                c.x /= d;
                c.y /= d;
                e.x /= f;
                e.y /= f;
                d < box2d.b2_epsilon || (f = box2d.b2NegV(this.gravity, new box2d.b2Vec2), f.SelfMul(this.density * d), b.ApplyForce(f, e), e = b.GetLinearVelocityFromWorldPoint(c, new box2d.b2Vec2), e.SelfSub(this.velocity), e.SelfMul(-this.linearDrag * d), b.ApplyForce(e, c), b.ApplyTorque(-b.GetInertia() / b.GetMass() * d * b.GetAngularVelocity() * this.angularDrag))
            }
        }
};
goog.exportProperty(box2d.b2BuoyancyController.prototype, "Step", box2d.b2BuoyancyController.prototype.Step);
box2d.b2BuoyancyController.prototype.Draw = function (a) {
    var b = new box2d.b2Vec2,
        c = new box2d.b2Vec2;
    b.x = this.normal.x * this.offset + 100 * this.normal.y;
    b.y = this.normal.y * this.offset - 100 * this.normal.x;
    c.x = this.normal.x * this.offset - 100 * this.normal.y;
    c.y = this.normal.y * this.offset + 100 * this.normal.x;
    var e = new box2d.b2Color(0, 0, 0.8);
    a.DrawSegment(b, c, e)
};
goog.exportProperty(box2d.b2BuoyancyController.prototype, "Draw", box2d.b2BuoyancyController.prototype.Draw);
box2d.b2TensorDampingController = function () {
    box2d.b2Controller.call(this);
    this.T = new box2d.b2Mat22;
    this.maxTimestep = 0
};
goog.inherits(box2d.b2TensorDampingController, box2d.b2Controller);
goog.exportSymbol("box2d.b2TensorDampingController", box2d.b2TensorDampingController);
box2d.b2TensorDampingController.prototype.T = new box2d.b2Mat22;
goog.exportProperty(box2d.b2TensorDampingController.prototype, "T", box2d.b2TensorDampingController.prototype.T);
box2d.b2TensorDampingController.prototype.maxTimestep = 0;
goog.exportProperty(box2d.b2TensorDampingController.prototype, "maxTimestep", box2d.b2TensorDampingController.prototype.maxTimestep);
box2d.b2TensorDampingController.prototype.Step = function (a) {
    a = a.dt;
    if (!(a <= box2d.b2_epsilon)) {
        a > this.maxTimestep && 0 < this.maxTimestep && (a = this.maxTimestep);
        for (var b = this.m_bodyList; b; b = b.nextBody) {
            var c = b.body;
            if (c.IsAwake()) {
                var e = c.GetWorldVector(box2d.b2MulMV(this.T, c.GetLocalVector(c.GetLinearVelocity(), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t1), box2d.b2TensorDampingController.prototype.Step.s_damping);
                c.SetLinearVelocity(box2d.b2AddVV(c.GetLinearVelocity(), box2d.b2MulSV(a, e, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t1))
            }
        }
    }
};
box2d.b2TensorDampingController.prototype.Step.s_damping = new box2d.b2Vec2;
box2d.b2TensorDampingController.prototype.SetAxisAligned = function (a, b) {
    this.T.ex.x = -a;
    this.T.ex.y = 0;
    this.T.ey.x = 0;
    this.T.ey.y = -b;
    this.maxTimestep = 0 < a || 0 < b ? 1 / box2d.b2Max(a, b) : 0
};
box2d.b2DistanceJointDef = function () {
    box2d.b2JointDef.call(this, box2d.b2JointType.e_distanceJoint);
    this.localAnchorA = new box2d.b2Vec2;
    this.localAnchorB = new box2d.b2Vec2
};
goog.inherits(box2d.b2DistanceJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2DistanceJointDef", box2d.b2DistanceJointDef);
box2d.b2DistanceJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2DistanceJointDef.prototype, "localAnchorA", box2d.b2DistanceJointDef.prototype.localAnchorA);
box2d.b2DistanceJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2DistanceJointDef.prototype, "localAnchorB", box2d.b2DistanceJointDef.prototype.localAnchorB);
box2d.b2DistanceJointDef.prototype.length = 1;
goog.exportProperty(box2d.b2DistanceJointDef.prototype, "length", box2d.b2DistanceJointDef.prototype.length);
box2d.b2DistanceJointDef.prototype.frequencyHz = 0;
goog.exportProperty(box2d.b2DistanceJointDef.prototype, "frequencyHz", box2d.b2DistanceJointDef.prototype.frequencyHz);
box2d.b2DistanceJointDef.prototype.dampingRatio = 0;
goog.exportProperty(box2d.b2DistanceJointDef.prototype, "dampingRatio", box2d.b2DistanceJointDef.prototype.dampingRatio);
box2d.b2DistanceJointDef.prototype.Initialize = function (a, b, c, e) {
    this.bodyA = a;
    this.bodyB = b;
    this.bodyA.GetLocalPoint(c, this.localAnchorA);
    this.bodyB.GetLocalPoint(e, this.localAnchorB);
    this.length = box2d.b2DistanceVV(c, e);
    this.dampingRatio = this.frequencyHz = 0
};
goog.exportProperty(box2d.b2DistanceJointDef.prototype, "Initialize", box2d.b2DistanceJointDef.prototype.Initialize);
box2d.b2DistanceJoint = function (a) {
    box2d.b2Joint.call(this, a);
    this.m_u = new box2d.b2Vec2;
    this.m_rA = new box2d.b2Vec2;
    this.m_rB = new box2d.b2Vec2;
    this.m_localCenterA = new box2d.b2Vec2;
    this.m_localCenterB = new box2d.b2Vec2;
    this.m_qA = new box2d.b2Rot;
    this.m_qB = new box2d.b2Rot;
    this.m_lalcA = new box2d.b2Vec2;
    this.m_lalcB = new box2d.b2Vec2;
    this.m_frequencyHz = a.frequencyHz;
    this.m_dampingRatio = a.dampingRatio;
    this.m_localAnchorA = a.localAnchorA.Clone();
    this.m_localAnchorB = a.localAnchorB.Clone();
    this.m_length = a.length
};
goog.inherits(box2d.b2DistanceJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2DistanceJoint", box2d.b2DistanceJoint);
box2d.b2DistanceJoint.prototype.m_frequencyHz = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_frequencyHz", box2d.b2DistanceJoint.prototype.m_frequencyHz);
box2d.b2DistanceJoint.prototype.m_dampingRatio = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_dampingRatio", box2d.b2DistanceJoint.prototype.m_dampingRatio);
box2d.b2DistanceJoint.prototype.m_bias = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_bias", box2d.b2DistanceJoint.prototype.m_bias);
box2d.b2DistanceJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_localAnchorA", box2d.b2DistanceJoint.prototype.m_localAnchorA);
box2d.b2DistanceJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_localAnchorB", box2d.b2DistanceJoint.prototype.m_localAnchorB);
box2d.b2DistanceJoint.prototype.m_gamma = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_gamma", box2d.b2DistanceJoint.prototype.m_gamma);
box2d.b2DistanceJoint.prototype.m_impulse = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_impulse", box2d.b2DistanceJoint.prototype.m_impulse);
box2d.b2DistanceJoint.prototype.m_length = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_length", box2d.b2DistanceJoint.prototype.m_length);
box2d.b2DistanceJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_indexA", box2d.b2DistanceJoint.prototype.m_indexA);
box2d.b2DistanceJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_indexB", box2d.b2DistanceJoint.prototype.m_indexB);
box2d.b2DistanceJoint.prototype.m_u = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_u", box2d.b2DistanceJoint.prototype.m_u);
box2d.b2DistanceJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_rA", box2d.b2DistanceJoint.prototype.m_rA);
box2d.b2DistanceJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_rB", box2d.b2DistanceJoint.prototype.m_rB);
box2d.b2DistanceJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_localCenterA", box2d.b2DistanceJoint.prototype.m_localCenterA);
box2d.b2DistanceJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_localCenterB", box2d.b2DistanceJoint.prototype.m_localCenterB);
box2d.b2DistanceJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_invMassA", box2d.b2DistanceJoint.prototype.m_invMassA);
box2d.b2DistanceJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_invMassB", box2d.b2DistanceJoint.prototype.m_invMassB);
box2d.b2DistanceJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_invIA", box2d.b2DistanceJoint.prototype.m_invIA);
box2d.b2DistanceJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_invIB", box2d.b2DistanceJoint.prototype.m_invIB);
box2d.b2DistanceJoint.prototype.m_mass = 0;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_mass", box2d.b2DistanceJoint.prototype.m_mass);
box2d.b2DistanceJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_qA", box2d.b2DistanceJoint.prototype.m_qA);
box2d.b2DistanceJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_qB", box2d.b2DistanceJoint.prototype.m_qB);
box2d.b2DistanceJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_lalcA", box2d.b2DistanceJoint.prototype.m_lalcA);
box2d.b2DistanceJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2DistanceJoint.prototype, "m_lalcB", box2d.b2DistanceJoint.prototype.m_lalcB);
box2d.b2DistanceJoint.prototype.GetAnchorA = function (a) {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetAnchorA", box2d.b2DistanceJoint.prototype.GetAnchorA);
box2d.b2DistanceJoint.prototype.GetAnchorB = function (a) {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetAnchorB", box2d.b2DistanceJoint.prototype.GetAnchorB);
box2d.b2DistanceJoint.prototype.GetReactionForce = function (a, b) {
    return b.SetXY(a * this.m_impulse * this.m_u.x, a * this.m_impulse * this.m_u.y)
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetReactionForce", box2d.b2DistanceJoint.prototype.GetReactionForce);
box2d.b2DistanceJoint.prototype.GetReactionTorque = function (a) {
    return 0
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetReactionTorque", box2d.b2DistanceJoint.prototype.GetReactionTorque);
box2d.b2DistanceJoint.prototype.GetLocalAnchorA = function (a) {
    return a.Copy(this.m_localAnchorA)
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetLocalAnchorA", box2d.b2DistanceJoint.prototype.GetLocalAnchorA);
box2d.b2DistanceJoint.prototype.GetLocalAnchorB = function (a) {
    return a.Copy(this.m_localAnchorB)
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetLocalAnchorB", box2d.b2DistanceJoint.prototype.GetLocalAnchorB);
box2d.b2DistanceJoint.prototype.SetLength = function (a) {
    this.m_length = a
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "SetLength", box2d.b2DistanceJoint.prototype.SetLength);
box2d.b2DistanceJoint.prototype.GetLength = function () {
    return this.m_length
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetLength", box2d.b2DistanceJoint.prototype.GetLength);
box2d.b2DistanceJoint.prototype.SetFrequency = function (a) {
    this.m_frequencyHz = a
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "SetFrequency", box2d.b2DistanceJoint.prototype.SetFrequency);
box2d.b2DistanceJoint.prototype.GetFrequency = function () {
    return this.m_frequencyHz
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetFrequency", box2d.b2DistanceJoint.prototype.GetFrequency);
box2d.b2DistanceJoint.prototype.SetDampingRatio = function (a) {
    this.m_dampingRatio = a
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "SetDampingRatio", box2d.b2DistanceJoint.prototype.SetDampingRatio);
box2d.b2DistanceJoint.prototype.GetDampingRatio = function () {
    return this.m_dampingRatio
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "GetDampingRatio", box2d.b2DistanceJoint.prototype.GetDampingRatio);
box2d.b2DistanceJoint.prototype.Dump = function () {
    if (box2d.DEBUG) {
        var a = this.m_bodyA.m_islandIndex,
            b = this.m_bodyB.m_islandIndex;
        box2d.b2Log("  /*box2d.b2DistanceJointDef*/ var jd = new box2d.b2DistanceJointDef();\n");
        box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
        box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
        box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
        box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
        box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n",
            this.m_localAnchorB.x, this.m_localAnchorB.y);
        box2d.b2Log("  jd.length = %.15f;\n", this.m_length);
        box2d.b2Log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
        box2d.b2Log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
        box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
    }
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "Dump", box2d.b2DistanceJoint.prototype.Dump);
box2d.b2DistanceJoint.prototype.InitVelocityConstraints = function (a) {
    this.m_indexA = this.m_bodyA.m_islandIndex;
    this.m_indexB = this.m_bodyB.m_islandIndex;
    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
    this.m_invMassA = this.m_bodyA.m_invMass;
    this.m_invMassB = this.m_bodyB.m_invMass;
    this.m_invIA = this.m_bodyA.m_invI;
    this.m_invIB = this.m_bodyB.m_invI;
    var b = a.positions[this.m_indexA].c,
        c = a.velocities[this.m_indexA].v,
        e = a.velocities[this.m_indexA].w,
        d = a.positions[this.m_indexB].c,
        f = a.positions[this.m_indexB].a,
        g = a.velocities[this.m_indexB].v,
        h = a.velocities[this.m_indexB].w,
        l = this.m_qA.SetAngleRadians(a.positions[this.m_indexA].a),
        f = this.m_qB.SetAngleRadians(f);
    box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
    box2d.b2MulRV(l, this.m_lalcA, this.m_rA);
    box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    box2d.b2MulRV(f, this.m_lalcB, this.m_rB);
    this.m_u.x = d.x + this.m_rB.x - b.x - this.m_rA.x;
    this.m_u.y = d.y + this.m_rB.y -
        b.y - this.m_rA.y;
    d = this.m_u.GetLength();
    d > box2d.b2_linearSlop ? this.m_u.SelfMul(1 / d) : this.m_u.SetZero();
    b = box2d.b2CrossVV(this.m_rA, this.m_u);
    l = box2d.b2CrossVV(this.m_rB, this.m_u);
    b = this.m_invMassA + this.m_invIA * b * b + this.m_invMassB + this.m_invIB * l * l;
    this.m_mass = 0 !== b ? 1 / b : 0;
    if (0 < this.m_frequencyHz) {
        var d = d - this.m_length,
            l = 2 * box2d.b2_pi * this.m_frequencyHz,
            f = this.m_mass * l * l,
            k = a.step.dt;
        this.m_gamma = k * (2 * this.m_mass * this.m_dampingRatio * l + k * f);
        this.m_gamma = 0 !== this.m_gamma ? 1 / this.m_gamma : 0;
        this.m_bias = d * k *
            f * this.m_gamma;
        b += this.m_gamma;
        this.m_mass = 0 !== b ? 1 / b : 0
    } else this.m_bias = this.m_gamma = 0;
    a.step.warmStarting ? (this.m_impulse *= a.step.dtRatio, b = box2d.b2MulSV(this.m_impulse, this.m_u, box2d.b2DistanceJoint.prototype.InitVelocityConstraints.s_P), c.SelfMulSub(this.m_invMassA, b), e -= this.m_invIA * box2d.b2CrossVV(this.m_rA, b), g.SelfMulAdd(this.m_invMassB, b), h += this.m_invIB * box2d.b2CrossVV(this.m_rB, b)) : this.m_impulse = 0;
    a.velocities[this.m_indexA].w = e;
    a.velocities[this.m_indexB].w = h
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "InitVelocityConstraints", box2d.b2DistanceJoint.prototype.InitVelocityConstraints);
box2d.b2DistanceJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2DistanceJoint.prototype.SolveVelocityConstraints = function (a) {
    var b = a.velocities[this.m_indexA].v,
        c = a.velocities[this.m_indexA].w,
        e = a.velocities[this.m_indexB].v,
        d = a.velocities[this.m_indexB].w,
        f = box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_vpA),
        g = box2d.b2AddVCrossSV(e, d, this.m_rB, box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_vpB),
        f = box2d.b2DotVV(this.m_u, box2d.b2SubVV(g, f, box2d.b2Vec2.s_t0)),
        f = -this.m_mass * (f + this.m_bias + this.m_gamma *
            this.m_impulse);
    this.m_impulse += f;
    f = box2d.b2MulSV(f, this.m_u, box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_P);
    b.SelfMulSub(this.m_invMassA, f);
    c -= this.m_invIA * box2d.b2CrossVV(this.m_rA, f);
    e.SelfMulAdd(this.m_invMassB, f);
    d += this.m_invIB * box2d.b2CrossVV(this.m_rB, f);
    a.velocities[this.m_indexA].w = c;
    a.velocities[this.m_indexB].w = d
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "SolveVelocityConstraints", box2d.b2DistanceJoint.prototype.SolveVelocityConstraints);
box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_vpA = new box2d.b2Vec2;
box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_vpB = new box2d.b2Vec2;
box2d.b2DistanceJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2DistanceJoint.prototype.SolvePositionConstraints = function (a) {
    if (0 < this.m_frequencyHz) return !0;
    var b = a.positions[this.m_indexA].c,
        c = a.positions[this.m_indexA].a,
        e = a.positions[this.m_indexB].c,
        d = a.positions[this.m_indexB].a;
    this.m_qA.SetAngleRadians(c);
    this.m_qB.SetAngleRadians(d);
    var f = box2d.b2MulRV(this.m_qA, this.m_lalcA, this.m_rA),
        g = box2d.b2MulRV(this.m_qB, this.m_lalcB, this.m_rB),
        h = this.m_u;
    h.x = e.x + g.x - b.x - f.x;
    h.y = e.y + g.y - b.y - f.y;
    var l = this.m_u.Normalize() - this.m_length,
        l = box2d.b2Clamp(l, -box2d.b2_maxLinearCorrection, box2d.b2_maxLinearCorrection),
        h = box2d.b2MulSV(-this.m_mass * l, h, box2d.b2DistanceJoint.prototype.SolvePositionConstraints.s_P);
    b.SelfMulSub(this.m_invMassA, h);
    c -= this.m_invIA * box2d.b2CrossVV(f, h);
    e.SelfMulAdd(this.m_invMassB, h);
    d += this.m_invIB * box2d.b2CrossVV(g, h);
    a.positions[this.m_indexA].a = c;
    a.positions[this.m_indexB].a = d;
    return box2d.b2Abs(l) < box2d.b2_linearSlop
};
goog.exportProperty(box2d.b2DistanceJoint.prototype, "SolvePositionConstraints", box2d.b2DistanceJoint.prototype.SolvePositionConstraints);
box2d.b2DistanceJoint.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2;
box2d.b2FrictionJointDef = function () {
    box2d.b2JointDef.call(this, box2d.b2JointType.e_frictionJoint);
    this.localAnchorA = new box2d.b2Vec2;
    this.localAnchorB = new box2d.b2Vec2
};
goog.inherits(box2d.b2FrictionJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2FrictionJointDef", box2d.b2FrictionJointDef);
box2d.b2FrictionJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2FrictionJointDef.prototype, "localAnchorA", box2d.b2FrictionJointDef.prototype.localAnchorA);
box2d.b2FrictionJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2FrictionJointDef.prototype, "localAnchorB", box2d.b2FrictionJointDef.prototype.localAnchorB);
box2d.b2FrictionJointDef.prototype.maxForce = 0;
goog.exportProperty(box2d.b2FrictionJointDef.prototype, "maxForce", box2d.b2FrictionJointDef.prototype.maxForce);
box2d.b2FrictionJointDef.prototype.maxTorque = 0;
goog.exportProperty(box2d.b2FrictionJointDef.prototype, "maxTorque", box2d.b2FrictionJointDef.prototype.maxTorque);
box2d.b2FrictionJointDef.prototype.Initialize = function (a, b, c) {
    this.bodyA = a;
    this.bodyB = b;
    this.bodyA.GetLocalPoint(c, this.localAnchorA);
    this.bodyB.GetLocalPoint(c, this.localAnchorB)
};
goog.exportProperty(box2d.b2FrictionJointDef.prototype, "Initialize", box2d.b2FrictionJointDef.prototype.Initialize);
box2d.b2FrictionJoint = function (a) {
    box2d.b2Joint.call(this, a);
    this.m_localAnchorA = a.localAnchorA.Clone();
    this.m_localAnchorB = a.localAnchorB.Clone();
    this.m_linearImpulse = (new box2d.b2Vec2).SetZero();
    this.m_maxForce = a.maxForce;
    this.m_maxTorque = a.maxTorque;
    this.m_rA = new box2d.b2Vec2;
    this.m_rB = new box2d.b2Vec2;
    this.m_localCenterA = new box2d.b2Vec2;
    this.m_localCenterB = new box2d.b2Vec2;
    this.m_linearMass = (new box2d.b2Mat22).SetZero();
    this.m_qA = new box2d.b2Rot;
    this.m_qB = new box2d.b2Rot;
    this.m_lalcA = new box2d.b2Vec2;
    this.m_lalcB = new box2d.b2Vec2;
    this.m_K = new box2d.b2Mat22
};
goog.inherits(box2d.b2FrictionJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2FrictionJoint", box2d.b2FrictionJoint);
box2d.b2FrictionJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_localAnchorA", box2d.b2FrictionJoint.prototype.m_localAnchorA);
box2d.b2FrictionJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_localAnchorB", box2d.b2FrictionJoint.prototype.m_localAnchorB);
box2d.b2FrictionJoint.prototype.m_linearImpulse = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_linearImpulse", box2d.b2FrictionJoint.prototype.m_linearImpulse);
box2d.b2FrictionJoint.prototype.m_angularImpulse = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_angularImpulse", box2d.b2FrictionJoint.prototype.m_angularImpulse);
box2d.b2FrictionJoint.prototype.m_maxForce = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_maxForce", box2d.b2FrictionJoint.prototype.m_maxForce);
box2d.b2FrictionJoint.prototype.m_maxTorque = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_maxTorque", box2d.b2FrictionJoint.prototype.m_maxTorque);
box2d.b2FrictionJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_indexA", box2d.b2FrictionJoint.prototype.m_indexA);
box2d.b2FrictionJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_indexB", box2d.b2FrictionJoint.prototype.m_indexB);
box2d.b2FrictionJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_rA", box2d.b2FrictionJoint.prototype.m_rA);
box2d.b2FrictionJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_rB", box2d.b2FrictionJoint.prototype.m_rB);
box2d.b2FrictionJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_localCenterA", box2d.b2FrictionJoint.prototype.m_localCenterA);
box2d.b2FrictionJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_localCenterB", box2d.b2FrictionJoint.prototype.m_localCenterB);
box2d.b2FrictionJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_invMassA", box2d.b2FrictionJoint.prototype.m_invMassA);
box2d.b2FrictionJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_invMassB", box2d.b2FrictionJoint.prototype.m_invMassB);
box2d.b2FrictionJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_invIA", box2d.b2FrictionJoint.prototype.m_invIA);
box2d.b2FrictionJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_invIB", box2d.b2FrictionJoint.prototype.m_invIB);
box2d.b2FrictionJoint.prototype.m_linearMass = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_linearMass", box2d.b2FrictionJoint.prototype.m_linearMass);
box2d.b2FrictionJoint.prototype.m_angularMass = 0;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_angularMass", box2d.b2FrictionJoint.prototype.m_angularMass);
box2d.b2FrictionJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_qA", box2d.b2FrictionJoint.prototype.m_qA);
box2d.b2FrictionJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_qB", box2d.b2FrictionJoint.prototype.m_qB);
box2d.b2FrictionJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_lalcA", box2d.b2FrictionJoint.prototype.m_lalcA);
box2d.b2FrictionJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_lalcB", box2d.b2FrictionJoint.prototype.m_lalcB);
box2d.b2FrictionJoint.prototype.m_K = null;
goog.exportProperty(box2d.b2FrictionJoint.prototype, "m_K", box2d.b2FrictionJoint.prototype.m_K);
box2d.b2FrictionJoint.prototype.InitVelocityConstraints = function (a) {
    this.m_indexA = this.m_bodyA.m_islandIndex;
    this.m_indexB = this.m_bodyB.m_islandIndex;
    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
    this.m_invMassA = this.m_bodyA.m_invMass;
    this.m_invMassB = this.m_bodyB.m_invMass;
    this.m_invIA = this.m_bodyA.m_invI;
    this.m_invIB = this.m_bodyB.m_invI;
    var b = a.velocities[this.m_indexA].v,
        c = a.velocities[this.m_indexA].w,
        e = a.positions[this.m_indexB].a,
        d = a.velocities[this.m_indexB].v,
        f = a.velocities[this.m_indexB].w,
        g = this.m_qA.SetAngleRadians(a.positions[this.m_indexA].a),
        e = this.m_qB.SetAngleRadians(e);
    box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
    g = box2d.b2MulRV(g, this.m_lalcA, this.m_rA);
    box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    var h = box2d.b2MulRV(e, this.m_lalcB, this.m_rB),
        e = this.m_invMassA,
        l = this.m_invMassB,
        k = this.m_invIA,
        m = this.m_invIB,
        n = this.m_K;
    n.ex.x = e + l + k * g.y * g.y + m * h.y * h.y;
    n.ex.y = -k * g.x * g.y -
        m * h.x * h.y;
    n.ey.x = n.ex.y;
    n.ey.y = e + l + k * g.x * g.x + m * h.x * h.x;
    n.GetInverse(this.m_linearMass);
    this.m_angularMass = k + m;
    0 < this.m_angularMass && (this.m_angularMass = 1 / this.m_angularMass);
    a.step.warmStarting ? (this.m_linearImpulse.SelfMul(a.step.dtRatio), this.m_angularImpulse *= a.step.dtRatio, g = this.m_linearImpulse, b.SelfMulSub(e, g), c -= k * (box2d.b2CrossVV(this.m_rA, g) + this.m_angularImpulse), d.SelfMulAdd(l, g), f += m * (box2d.b2CrossVV(this.m_rB, g) + this.m_angularImpulse)) : (this.m_linearImpulse.SetZero(), this.m_angularImpulse =
        0);
    a.velocities[this.m_indexA].w = c;
    a.velocities[this.m_indexB].w = f
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "InitVelocityConstraints", box2d.b2FrictionJoint.prototype.InitVelocityConstraints);
box2d.b2FrictionJoint.prototype.SolveVelocityConstraints = function (a) {
    var b = a.velocities[this.m_indexA].v,
        c = a.velocities[this.m_indexA].w,
        e = a.velocities[this.m_indexB].v,
        d = a.velocities[this.m_indexB].w,
        f = this.m_invMassA,
        g = this.m_invMassB,
        h = this.m_invIA,
        l = this.m_invIB,
        k = a.step.dt,
        m, n = -this.m_angularMass * (d - c),
        p = this.m_angularImpulse;
    m = k * this.m_maxTorque;
    this.m_angularImpulse = box2d.b2Clamp(this.m_angularImpulse + n, -m, m);
    n = this.m_angularImpulse - p;
    c -= h * n;
    d += l * n;
    m = box2d.b2SubVV(box2d.b2AddVCrossSV(e, d, this.m_rB,
        box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2Vec2.s_t1), box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_Cdot);
    n = box2d.b2MulMV(this.m_linearMass, m, box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_impulseV).SelfNeg();
    p = box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_oldImpulseV.Copy(this.m_linearImpulse);
    this.m_linearImpulse.SelfAdd(n);
    m = k * this.m_maxForce;
    this.m_linearImpulse.GetLengthSquared() > m * m && (this.m_linearImpulse.Normalize(), this.m_linearImpulse.SelfMul(m));
    box2d.b2SubVV(this.m_linearImpulse, p, n);
    b.SelfMulSub(f, n);
    c -= h * box2d.b2CrossVV(this.m_rA, n);
    e.SelfMulAdd(g, n);
    d += l * box2d.b2CrossVV(this.m_rB, n);
    a.velocities[this.m_indexA].w = c;
    a.velocities[this.m_indexB].w = d
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "SolveVelocityConstraints", box2d.b2FrictionJoint.prototype.SolveVelocityConstraints);
box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_Cdot = new box2d.b2Vec2;
box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_impulseV = new box2d.b2Vec2;
box2d.b2FrictionJoint.prototype.SolveVelocityConstraints.s_oldImpulseV = new box2d.b2Vec2;
box2d.b2FrictionJoint.prototype.SolvePositionConstraints = function (a) {
    return !0
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "SolvePositionConstraints", box2d.b2FrictionJoint.prototype.SolvePositionConstraints);
box2d.b2FrictionJoint.prototype.GetAnchorA = function (a) {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetAnchorA", box2d.b2FrictionJoint.prototype.GetAnchorA);
box2d.b2FrictionJoint.prototype.GetAnchorB = function (a) {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetAnchorB", box2d.b2FrictionJoint.prototype.GetAnchorB);
box2d.b2FrictionJoint.prototype.GetReactionForce = function (a, b) {
    return b.SetXY(a * this.m_linearImpulse.x, a * this.m_linearImpulse.y)
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetReactionForce", box2d.b2FrictionJoint.prototype.GetReactionForce);
box2d.b2FrictionJoint.prototype.GetReactionTorque = function (a) {
    return a * this.m_angularImpulse
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetReactionTorque", box2d.b2FrictionJoint.prototype.GetReactionTorque);
box2d.b2FrictionJoint.prototype.GetLocalAnchorA = function (a) {
    return a.Copy(this.m_localAnchorA)
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetLocalAnchorA", box2d.b2FrictionJoint.prototype.GetLocalAnchorA);
box2d.b2FrictionJoint.prototype.GetLocalAnchorB = function (a) {
    return a.Copy(this.m_localAnchorB)
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetLocalAnchorB", box2d.b2FrictionJoint.prototype.GetLocalAnchorB);
box2d.b2FrictionJoint.prototype.SetMaxForce = function (a) {
    this.m_maxForce = a
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "SetMaxForce", box2d.b2FrictionJoint.prototype.SetMaxForce);
box2d.b2FrictionJoint.prototype.GetMaxForce = function () {
    return this.m_maxForce
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetMaxForce", box2d.b2FrictionJoint.prototype.GetMaxForce);
box2d.b2FrictionJoint.prototype.SetMaxTorque = function (a) {
    this.m_maxTorque = a
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "SetMaxTorque", box2d.b2FrictionJoint.prototype.SetMaxTorque);
box2d.b2FrictionJoint.prototype.GetMaxTorque = function () {
    return this.m_maxTorque
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "GetMaxTorque", box2d.b2FrictionJoint.prototype.GetMaxTorque);
box2d.b2FrictionJoint.prototype.Dump = function () {
    if (box2d.DEBUG) {
        var a = this.m_bodyA.m_islandIndex,
            b = this.m_bodyB.m_islandIndex;
        box2d.b2Log("  /*box2d.b2FrictionJointDef*/ var jd = new box2d.b2FrictionJointDef();\n");
        box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
        box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
        box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
        box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
        box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n",
            this.m_localAnchorB.x, this.m_localAnchorB.y);
        box2d.b2Log("  jd.maxForce = %.15f;\n", this.m_maxForce);
        box2d.b2Log("  jd.maxTorque = %.15f;\n", this.m_maxTorque);
        box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
    }
};
goog.exportProperty(box2d.b2FrictionJoint.prototype, "Dump", box2d.b2FrictionJoint.prototype.Dump);
box2d.b2MouseJointDef = function () {
    box2d.b2JointDef.call(this, box2d.b2JointType.e_mouseJoint);
    this.target = new box2d.b2Vec2
};
goog.inherits(box2d.b2MouseJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2MouseJointDef", box2d.b2MouseJointDef);
box2d.b2MouseJointDef.prototype.target = null;
goog.exportProperty(box2d.b2MouseJointDef.prototype, "target", box2d.b2MouseJointDef.prototype.target);
box2d.b2MouseJointDef.prototype.maxForce = 0;
goog.exportProperty(box2d.b2MouseJointDef.prototype, "maxForce", box2d.b2MouseJointDef.prototype.maxForce);
box2d.b2MouseJointDef.prototype.frequencyHz = 5;
goog.exportProperty(box2d.b2MouseJointDef.prototype, "frequencyHz", box2d.b2MouseJointDef.prototype.frequencyHz);
box2d.b2MouseJointDef.prototype.dampingRatio = 0.7;
goog.exportProperty(box2d.b2MouseJointDef.prototype, "dampingRatio", box2d.b2MouseJointDef.prototype.dampingRatio);
box2d.b2MouseJoint = function (a) {
    box2d.b2Joint.call(this, a);
    this.m_localAnchorB = new box2d.b2Vec2;
    this.m_targetA = new box2d.b2Vec2;
    this.m_impulse = new box2d.b2Vec2;
    this.m_rB = new box2d.b2Vec2;
    this.m_localCenterB = new box2d.b2Vec2;
    this.m_mass = new box2d.b2Mat22;
    this.m_C = new box2d.b2Vec2;
    this.m_qB = new box2d.b2Rot;
    this.m_lalcB = new box2d.b2Vec2;
    this.m_K = new box2d.b2Mat22;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a.target.IsValid());
    box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.maxForce) && 0 <= a.maxForce);
    box2d.ENABLE_ASSERTS &&
        box2d.b2Assert(box2d.b2IsValid(a.frequencyHz) && 0 <= a.frequencyHz);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a.dampingRatio) && 0 <= a.dampingRatio);
    this.m_targetA.Copy(a.target);
    box2d.b2MulTXV(this.m_bodyB.GetTransform(), this.m_targetA, this.m_localAnchorB);
    this.m_maxForce = a.maxForce;
    this.m_impulse.SetZero();
    this.m_frequencyHz = a.frequencyHz;
    this.m_dampingRatio = a.dampingRatio;
    this.m_gamma = this.m_beta = 0
};
goog.inherits(box2d.b2MouseJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2MouseJoint", box2d.b2MouseJoint);
box2d.b2MouseJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_localAnchorB", box2d.b2MouseJoint.prototype.m_localAnchorB);
box2d.b2MouseJoint.prototype.m_targetA = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_targetA", box2d.b2MouseJoint.prototype.m_targetA);
box2d.b2MouseJoint.prototype.m_frequencyHz = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_frequencyHz", box2d.b2MouseJoint.prototype.m_frequencyHz);
box2d.b2MouseJoint.prototype.m_dampingRatio = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_dampingRatio", box2d.b2MouseJoint.prototype.m_dampingRatio);
box2d.b2MouseJoint.prototype.m_beta = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_beta", box2d.b2MouseJoint.prototype.m_beta);
box2d.b2MouseJoint.prototype.m_impulse = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_impulse", box2d.b2MouseJoint.prototype.m_impulse);
box2d.b2MouseJoint.prototype.m_maxForce = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_maxForce", box2d.b2MouseJoint.prototype.m_maxForce);
box2d.b2MouseJoint.prototype.m_gamma = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_gamma", box2d.b2MouseJoint.prototype.m_gamma);
box2d.b2MouseJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_indexA", box2d.b2MouseJoint.prototype.m_indexA);
box2d.b2MouseJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_indexB", box2d.b2MouseJoint.prototype.m_indexB);
box2d.b2MouseJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_rB", box2d.b2MouseJoint.prototype.m_rB);
box2d.b2MouseJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_localCenterB", box2d.b2MouseJoint.prototype.m_localCenterB);
box2d.b2MouseJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_invMassB", box2d.b2MouseJoint.prototype.m_invMassB);
box2d.b2MouseJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_invIB", box2d.b2MouseJoint.prototype.m_invIB);
box2d.b2MouseJoint.prototype.m_mass = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_mass", box2d.b2MouseJoint.prototype.m_mass);
box2d.b2MouseJoint.prototype.m_C = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_C", box2d.b2MouseJoint.prototype.m_C);
box2d.b2MouseJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_qB", box2d.b2MouseJoint.prototype.m_qB);
box2d.b2MouseJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_lalcB", box2d.b2MouseJoint.prototype.m_lalcB);
box2d.b2MouseJoint.prototype.m_K = null;
goog.exportProperty(box2d.b2MouseJoint.prototype, "m_K", box2d.b2MouseJoint.prototype.m_K);
box2d.b2MouseJoint.prototype.SetTarget = function (a) {
    !1 === this.m_bodyB.IsAwake() && this.m_bodyB.SetAwake(!0);
    this.m_targetA.Copy(a)
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "SetTarget", box2d.b2MouseJoint.prototype.SetTarget);
box2d.b2MouseJoint.prototype.GetTarget = function (a) {
    return a.Copy(this.m_targetA)
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetTarget", box2d.b2MouseJoint.prototype.GetTarget);
box2d.b2MouseJoint.prototype.SetMaxForce = function (a) {
    this.m_maxForce = a
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "SetMaxForce", box2d.b2MouseJoint.prototype.SetMaxForce);
box2d.b2MouseJoint.prototype.GetMaxForce = function () {
    return this.m_maxForce
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetMaxForce", box2d.b2MouseJoint.prototype.GetMaxForce);
box2d.b2MouseJoint.prototype.SetFrequency = function (a) {
    this.m_frequencyHz = a
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "SetFrequency", box2d.b2MouseJoint.prototype.SetFrequency);
box2d.b2MouseJoint.prototype.GetFrequency = function () {
    return this.m_frequencyHz
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetFrequency", box2d.b2MouseJoint.prototype.GetFrequency);
box2d.b2MouseJoint.prototype.SetDampingRatio = function (a) {
    this.m_dampingRatio = a
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "SetDampingRatio", box2d.b2MouseJoint.prototype.SetDampingRatio);
box2d.b2MouseJoint.prototype.GetDampingRatio = function () {
    return this.m_dampingRatio
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetDampingRatio", box2d.b2MouseJoint.prototype.GetDampingRatio);
box2d.b2MouseJoint.prototype.InitVelocityConstraints = function (a) {
    this.m_indexB = this.m_bodyB.m_islandIndex;
    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
    this.m_invMassB = this.m_bodyB.m_invMass;
    this.m_invIB = this.m_bodyB.m_invI;
    var b = a.positions[this.m_indexB].c,
        c = a.velocities[this.m_indexB].v,
        e = a.velocities[this.m_indexB].w,
        d = this.m_qB.SetAngleRadians(a.positions[this.m_indexB].a),
        f = this.m_bodyB.GetMass(),
        g = 2 * box2d.b2_pi * this.m_frequencyHz,
        h = 2 * f * this.m_dampingRatio * g,
        f = f * g * g,
        g = a.step.dt;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(h + g * f > box2d.b2_epsilon);
    this.m_gamma = g * (h + g * f);
    0 !== this.m_gamma && (this.m_gamma = 1 / this.m_gamma);
    this.m_beta = g * f * this.m_gamma;
    box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    box2d.b2MulRV(d, this.m_lalcB, this.m_rB);
    d = this.m_K;
    d.ex.x = this.m_invMassB + this.m_invIB * this.m_rB.y * this.m_rB.y + this.m_gamma;
    d.ex.y = -this.m_invIB * this.m_rB.x * this.m_rB.y;
    d.ey.x = d.ex.y;
    d.ey.y = this.m_invMassB + this.m_invIB * this.m_rB.x * this.m_rB.x + this.m_gamma;
    d.GetInverse(this.m_mass);
    this.m_C.x = b.x + this.m_rB.x - this.m_targetA.x;
    this.m_C.y = b.y + this.m_rB.y - this.m_targetA.y;
    this.m_C.SelfMul(this.m_beta);
    e *= 0.98;
    a.step.warmStarting ? (this.m_impulse.SelfMul(a.step.dtRatio), c.x += this.m_invMassB * this.m_impulse.x, c.y += this.m_invMassB * this.m_impulse.y, e += this.m_invIB * box2d.b2CrossVV(this.m_rB, this.m_impulse)) : this.m_impulse.SetZero();
    a.velocities[this.m_indexB].w = e
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "InitVelocityConstraints", box2d.b2MouseJoint.prototype.InitVelocityConstraints);
box2d.b2MouseJoint.prototype.SolveVelocityConstraints = function (a) {
    var b = a.velocities[this.m_indexB].v,
        c = a.velocities[this.m_indexB].w,
        e = box2d.b2AddVCrossSV(b, c, this.m_rB, box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_Cdot),
        e = box2d.b2MulMV(this.m_mass, box2d.b2AddVV(e, box2d.b2AddVV(this.m_C, box2d.b2MulSV(this.m_gamma, this.m_impulse, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0).SelfNeg(), box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_impulse),
        d = box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_oldImpulse.Copy(this.m_impulse);
    this.m_impulse.SelfAdd(e);
    var f = a.step.dt * this.m_maxForce;
    this.m_impulse.GetLengthSquared() > f * f && this.m_impulse.SelfMul(f / this.m_impulse.GetLength());
    box2d.b2SubVV(this.m_impulse, d, e);
    b.SelfMulAdd(this.m_invMassB, e);
    c += this.m_invIB * box2d.b2CrossVV(this.m_rB, e);
    a.velocities[this.m_indexB].w = c
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "SolveVelocityConstraints", box2d.b2MouseJoint.prototype.SolveVelocityConstraints);
box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_Cdot = new box2d.b2Vec2;
box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_impulse = new box2d.b2Vec2;
box2d.b2MouseJoint.prototype.SolveVelocityConstraints.s_oldImpulse = new box2d.b2Vec2;
box2d.b2MouseJoint.prototype.SolvePositionConstraints = function (a) {
    return !0
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "SolvePositionConstraints", box2d.b2MouseJoint.prototype.SolvePositionConstraints);
box2d.b2MouseJoint.prototype.GetAnchorA = function (a) {
    return a.Copy(this.m_targetA)
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetAnchorA", box2d.b2MouseJoint.prototype.GetAnchorA);
box2d.b2MouseJoint.prototype.GetAnchorB = function (a) {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetAnchorB", box2d.b2MouseJoint.prototype.GetAnchorB);
box2d.b2MouseJoint.prototype.GetReactionForce = function (a, b) {
    return box2d.b2MulSV(a, this.m_impulse, b)
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetReactionForce", box2d.b2MouseJoint.prototype.GetReactionForce);
box2d.b2MouseJoint.prototype.GetReactionTorque = function (a) {
    return 0
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "GetReactionTorque", box2d.b2MouseJoint.prototype.GetReactionTorque);
box2d.b2MouseJoint.prototype.Dump = function () {
    box2d.DEBUG && box2d.b2Log("Mouse joint dumping is not supported.\n")
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "Dump", box2d.b2MouseJoint.prototype.Dump);
box2d.b2MouseJoint.prototype.ShiftOrigin = function (a) {
    this.m_targetA.SelfSub(a)
};
goog.exportProperty(box2d.b2MouseJoint.prototype, "ShiftOrigin", box2d.b2MouseJoint.prototype.ShiftOrigin);
box2d.b2ConstantForceController = function () {
    box2d.b2Controller.call(this);
    this.F = new box2d.b2Vec2(0, 0)
};
goog.inherits(box2d.b2ConstantForceController, box2d.b2Controller);
goog.exportSymbol("box2d.b2ConstantForceController", box2d.b2ConstantForceController);
box2d.b2ConstantAccelController.prototype.F = null;
goog.exportProperty(box2d.b2ConstantAccelController.prototype, "F", box2d.b2ConstantAccelController.prototype.F);
box2d.b2ConstantForceController.prototype.Step = function (a) {
    for (a = this.m_bodyList; a; a = a.nextBody) {
        var b = a.body;
        b.IsAwake() && b.ApplyForce(this.F, b.GetWorldCenter())
    }
};
goog.exportProperty(box2d.b2ConstantForceController.prototype, "Step", box2d.b2ConstantForceController.prototype.Step);
box2d.b2_minPulleyLength = 2;
goog.exportSymbol("box2d.b2_minPulleyLength", box2d.b2_minPulleyLength);
box2d.b2PulleyJointDef = function () {
    box2d.b2JointDef.call(this, box2d.b2JointType.e_pulleyJoint);
    this.collideConnected = !0;
    this.groundAnchorA = new box2d.b2Vec2(-1, 1);
    this.groundAnchorB = new box2d.b2Vec2(1, 1);
    this.localAnchorA = new box2d.b2Vec2(-1, 0);
    this.localAnchorB = new box2d.b2Vec2(1, 0)
};
goog.inherits(box2d.b2PulleyJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2PulleyJointDef", box2d.b2PulleyJointDef);
box2d.b2PulleyJointDef.prototype.groundAnchorA = null;
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "groundAnchorA", box2d.b2PulleyJointDef.prototype.groundAnchorA);
box2d.b2PulleyJointDef.prototype.groundAnchorB = null;
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "groundAnchorB", box2d.b2PulleyJointDef.prototype.groundAnchorB);
box2d.b2PulleyJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "localAnchorA", box2d.b2PulleyJointDef.prototype.localAnchorA);
box2d.b2PulleyJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "localAnchorB", box2d.b2PulleyJointDef.prototype.localAnchorB);
box2d.b2PulleyJointDef.prototype.lengthA = 0;
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "lengthA", box2d.b2PulleyJointDef.prototype.lengthA);
box2d.b2PulleyJointDef.prototype.lengthB = 0;
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "lengthB", box2d.b2PulleyJointDef.prototype.lengthB);
box2d.b2PulleyJointDef.prototype.ratio = 1;
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "ratio", box2d.b2PulleyJointDef.prototype.ratio);
box2d.b2PulleyJointDef.prototype.Initialize = function (a, b, c, e, d, f, g) {
    this.bodyA = a;
    this.bodyB = b;
    this.groundAnchorA.Copy(c);
    this.groundAnchorB.Copy(e);
    this.bodyA.GetLocalPoint(d, this.localAnchorA);
    this.bodyB.GetLocalPoint(f, this.localAnchorB);
    this.lengthA = box2d.b2DistanceVV(d, c);
    this.lengthB = box2d.b2DistanceVV(f, e);
    this.ratio = g;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(this.ratio > box2d.b2_epsilon)
};
goog.exportProperty(box2d.b2PulleyJointDef.prototype, "Initialize", box2d.b2PulleyJointDef.prototype.Initialize);
box2d.b2PulleyJoint = function (a) {
    box2d.b2Joint.call(this, a);
    this.m_groundAnchorA = new box2d.b2Vec2;
    this.m_groundAnchorB = new box2d.b2Vec2;
    this.m_localAnchorA = new box2d.b2Vec2;
    this.m_localAnchorB = new box2d.b2Vec2;
    this.m_uA = new box2d.b2Vec2;
    this.m_uB = new box2d.b2Vec2;
    this.m_rA = new box2d.b2Vec2;
    this.m_rB = new box2d.b2Vec2;
    this.m_localCenterA = new box2d.b2Vec2;
    this.m_localCenterB = new box2d.b2Vec2;
    this.m_qA = new box2d.b2Rot;
    this.m_qB = new box2d.b2Rot;
    this.m_lalcA = new box2d.b2Vec2;
    this.m_lalcB = new box2d.b2Vec2;
    this.m_groundAnchorA.Copy(a.groundAnchorA);
    this.m_groundAnchorB.Copy(a.groundAnchorB);
    this.m_localAnchorA.Copy(a.localAnchorA);
    this.m_localAnchorB.Copy(a.localAnchorB);
    this.m_lengthA = a.lengthA;
    this.m_lengthB = a.lengthB;
    box2d.ENABLE_ASSERTS && box2d.b2Assert(0 !== a.ratio);
    this.m_ratio = a.ratio;
    this.m_constant = a.lengthA + this.m_ratio * a.lengthB;
    this.m_impulse = 0
};
goog.inherits(box2d.b2PulleyJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2PulleyJoint", box2d.b2PulleyJoint);
box2d.b2PulleyJoint.prototype.m_groundAnchorA = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_groundAnchorA", box2d.b2PulleyJoint.prototype.m_groundAnchorA);
box2d.b2PulleyJoint.prototype.m_groundAnchorB = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_groundAnchorB", box2d.b2PulleyJoint.prototype.m_groundAnchorB);
box2d.b2PulleyJoint.prototype.m_lengthA = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_lengthA", box2d.b2PulleyJoint.prototype.m_lengthA);
box2d.b2PulleyJoint.prototype.m_lengthB = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_lengthB", box2d.b2PulleyJoint.prototype.m_lengthB);
box2d.b2PulleyJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_localAnchorA", box2d.b2PulleyJoint.prototype.m_localAnchorA);
box2d.b2PulleyJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_localAnchorB", box2d.b2PulleyJoint.prototype.m_localAnchorB);
box2d.b2PulleyJoint.prototype.m_constant = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_constant", box2d.b2PulleyJoint.prototype.m_constant);
box2d.b2PulleyJoint.prototype.m_ratio = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_ratio", box2d.b2PulleyJoint.prototype.m_ratio);
box2d.b2PulleyJoint.prototype.m_impulse = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_impulse", box2d.b2PulleyJoint.prototype.m_impulse);
box2d.b2PulleyJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_indexA", box2d.b2PulleyJoint.prototype.m_indexA);
box2d.b2PulleyJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_indexB", box2d.b2PulleyJoint.prototype.m_indexB);
box2d.b2PulleyJoint.prototype.m_uA = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_uA", box2d.b2PulleyJoint.prototype.m_uA);
box2d.b2PulleyJoint.prototype.m_uB = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_uB", box2d.b2PulleyJoint.prototype.m_uB);
box2d.b2PulleyJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_rA", box2d.b2PulleyJoint.prototype.m_rA);
box2d.b2PulleyJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_rB", box2d.b2PulleyJoint.prototype.m_rB);
box2d.b2PulleyJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_localCenterA", box2d.b2PulleyJoint.prototype.m_localCenterA);
box2d.b2PulleyJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_localCenterB", box2d.b2PulleyJoint.prototype.m_localCenterB);
box2d.b2PulleyJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_invMassA", box2d.b2PulleyJoint.prototype.m_invMassA);
box2d.b2PulleyJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_invMassB", box2d.b2PulleyJoint.prototype.m_invMassB);
box2d.b2PulleyJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_invIA", box2d.b2PulleyJoint.prototype.m_invIA);
box2d.b2PulleyJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_invIB", box2d.b2PulleyJoint.prototype.m_invIB);
box2d.b2PulleyJoint.prototype.m_mass = 0;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_mass", box2d.b2PulleyJoint.prototype.m_mass);
box2d.b2PulleyJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_qA", box2d.b2PulleyJoint.prototype.m_qA);
box2d.b2PulleyJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_qB", box2d.b2PulleyJoint.prototype.m_qB);
box2d.b2PulleyJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_lalcA", box2d.b2PulleyJoint.prototype.m_lalcA);
box2d.b2PulleyJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2PulleyJoint.prototype, "m_lalcB", box2d.b2PulleyJoint.prototype.m_lalcB);
box2d.b2PulleyJoint.prototype.InitVelocityConstraints = function (a) {
    this.m_indexA = this.m_bodyA.m_islandIndex;
    this.m_indexB = this.m_bodyB.m_islandIndex;
    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
    this.m_invMassA = this.m_bodyA.m_invMass;
    this.m_invMassB = this.m_bodyB.m_invMass;
    this.m_invIA = this.m_bodyA.m_invI;
    this.m_invIB = this.m_bodyB.m_invI;
    var b = a.positions[this.m_indexA].c,
        c = a.velocities[this.m_indexA].v,
        e = a.velocities[this.m_indexA].w,
        d = a.positions[this.m_indexB].c,
        f = a.positions[this.m_indexB].a,
        g = a.velocities[this.m_indexB].v,
        h = a.velocities[this.m_indexB].w,
        l = this.m_qA.SetAngleRadians(a.positions[this.m_indexA].a),
        f = this.m_qB.SetAngleRadians(f);
    box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
    box2d.b2MulRV(l, this.m_lalcA, this.m_rA);
    box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    box2d.b2MulRV(f, this.m_lalcB, this.m_rB);
    this.m_uA.Copy(b).SelfAdd(this.m_rA).SelfSub(this.m_groundAnchorA);
    this.m_uB.Copy(d).SelfAdd(this.m_rB).SelfSub(this.m_groundAnchorB);
    b = this.m_uA.GetLength();
    d = this.m_uB.GetLength();
    b > 10 * box2d.b2_linearSlop ? this.m_uA.SelfMul(1 / b) : this.m_uA.SetZero();
    d > 10 * box2d.b2_linearSlop ? this.m_uB.SelfMul(1 / d) : this.m_uB.SetZero();
    b = box2d.b2CrossVV(this.m_rA, this.m_uA);
    d = box2d.b2CrossVV(this.m_rB, this.m_uB);
    this.m_mass = this.m_invMassA + this.m_invIA * b * b + this.m_ratio * this.m_ratio * (this.m_invMassB + this.m_invIB * d * d);
    0 < this.m_mass && (this.m_mass = 1 / this.m_mass);
    a.step.warmStarting ? (this.m_impulse *= a.step.dtRatio, b = box2d.b2MulSV(-this.m_impulse, this.m_uA,
        box2d.b2PulleyJoint.prototype.InitVelocityConstraints.s_PA), d = box2d.b2MulSV(-this.m_ratio * this.m_impulse, this.m_uB, box2d.b2PulleyJoint.prototype.InitVelocityConstraints.s_PB), c.SelfMulAdd(this.m_invMassA, b), e += this.m_invIA * box2d.b2CrossVV(this.m_rA, b), g.SelfMulAdd(this.m_invMassB, d), h += this.m_invIB * box2d.b2CrossVV(this.m_rB, d)) : this.m_impulse = 0;
    a.velocities[this.m_indexA].w = e;
    a.velocities[this.m_indexB].w = h
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "InitVelocityConstraints", box2d.b2PulleyJoint.prototype.InitVelocityConstraints);
box2d.b2PulleyJoint.prototype.InitVelocityConstraints.s_PA = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.InitVelocityConstraints.s_PB = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.SolveVelocityConstraints = function (a) {
    var b = a.velocities[this.m_indexA].v,
        c = a.velocities[this.m_indexA].w,
        e = a.velocities[this.m_indexB].v,
        d = a.velocities[this.m_indexB].w,
        f = box2d.b2AddVCrossSV(b, c, this.m_rA, box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_vpA),
        g = box2d.b2AddVCrossSV(e, d, this.m_rB, box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_vpB),
        f = -box2d.b2DotVV(this.m_uA, f) - this.m_ratio * box2d.b2DotVV(this.m_uB, g),
        g = -this.m_mass * f;
    this.m_impulse += g;
    f =
        box2d.b2MulSV(-g, this.m_uA, box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_PA);
    g = box2d.b2MulSV(-this.m_ratio * g, this.m_uB, box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_PB);
    b.SelfMulAdd(this.m_invMassA, f);
    c += this.m_invIA * box2d.b2CrossVV(this.m_rA, f);
    e.SelfMulAdd(this.m_invMassB, g);
    d += this.m_invIB * box2d.b2CrossVV(this.m_rB, g);
    a.velocities[this.m_indexA].w = c;
    a.velocities[this.m_indexB].w = d
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "SolveVelocityConstraints", box2d.b2PulleyJoint.prototype.SolveVelocityConstraints);
box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_vpA = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_vpB = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_PA = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.SolveVelocityConstraints.s_PB = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.SolvePositionConstraints = function (a) {
    var b = a.positions[this.m_indexA].c,
        c = a.positions[this.m_indexA].a,
        e = a.positions[this.m_indexB].c,
        d = a.positions[this.m_indexB].a,
        f = this.m_qA.SetAngleRadians(c),
        g = this.m_qB.SetAngleRadians(d);
    box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
    f = box2d.b2MulRV(f, this.m_lalcA, this.m_rA);
    box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    var g = box2d.b2MulRV(g, this.m_lalcB, this.m_rB),
        h = this.m_uA.Copy(b).SelfAdd(f).SelfSub(this.m_groundAnchorA),
        l = this.m_uB.Copy(e).SelfAdd(g).SelfSub(this.m_groundAnchorB),
        k = h.GetLength(),
        m = l.GetLength();
    k > 10 * box2d.b2_linearSlop ? h.SelfMul(1 / k) : h.SetZero();
    m > 10 * box2d.b2_linearSlop ? l.SelfMul(1 / m) : l.SetZero();
    var n = box2d.b2CrossVV(f, h),
        p = box2d.b2CrossVV(g, l),
        n = this.m_invMassA + this.m_invIA * n * n + this.m_ratio * this.m_ratio * (this.m_invMassB + this.m_invIB * p * p);
    0 < n && (n = 1 / n);
    m = this.m_constant - k - this.m_ratio * m;
    k = box2d.b2Abs(m);
    m *= -n;
    h = box2d.b2MulSV(-m, h, box2d.b2PulleyJoint.prototype.SolvePositionConstraints.s_PA);
    l = box2d.b2MulSV(-this.m_ratio *
        m, l, box2d.b2PulleyJoint.prototype.SolvePositionConstraints.s_PB);
    b.SelfMulAdd(this.m_invMassA, h);
    c += this.m_invIA * box2d.b2CrossVV(f, h);
    e.SelfMulAdd(this.m_invMassB, l);
    d += this.m_invIB * box2d.b2CrossVV(g, l);
    a.positions[this.m_indexA].a = c;
    a.positions[this.m_indexB].a = d;
    return k < box2d.b2_linearSlop
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "SolvePositionConstraints", box2d.b2PulleyJoint.prototype.SolvePositionConstraints);
box2d.b2PulleyJoint.prototype.SolvePositionConstraints.s_PA = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.SolvePositionConstraints.s_PB = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.GetAnchorA = function (a) {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetAnchorA", box2d.b2PulleyJoint.prototype.GetAnchorA);
box2d.b2PulleyJoint.prototype.GetAnchorB = function (a) {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetAnchorB", box2d.b2PulleyJoint.prototype.GetAnchorB);
box2d.b2PulleyJoint.prototype.GetReactionForce = function (a, b) {
    return b.SetXY(a * this.m_impulse * this.m_uB.x, a * this.m_impulse * this.m_uB.y)
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetReactionForce", box2d.b2PulleyJoint.prototype.GetReactionForce);
box2d.b2PulleyJoint.prototype.GetReactionTorque = function (a) {
    return 0
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetReactionTorque", box2d.b2PulleyJoint.prototype.GetReactionTorque);
box2d.b2PulleyJoint.prototype.GetGroundAnchorA = function (a) {
    return a.Copy(this.m_groundAnchorA)
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetGroundAnchorA", box2d.b2PulleyJoint.prototype.GetGroundAnchorA);
box2d.b2PulleyJoint.prototype.GetGroundAnchorB = function (a) {
    return a.Copy(this.m_groundAnchorB)
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetGroundAnchorB", box2d.b2PulleyJoint.prototype.GetGroundAnchorB);
box2d.b2PulleyJoint.prototype.GetLengthA = function () {
    return this.m_lengthA
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetLengthA", box2d.b2PulleyJoint.prototype.GetLengthA);
box2d.b2PulleyJoint.prototype.GetLengthB = function () {
    return this.m_lengthB
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetLengthB", box2d.b2PulleyJoint.prototype.GetLengthB);
box2d.b2PulleyJoint.prototype.GetRatio = function () {
    return this.m_ratio
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetRatio", box2d.b2PulleyJoint.prototype.GetRatio);
box2d.b2PulleyJoint.prototype.GetCurrentLengthA = function () {
    var a = this.m_bodyA.GetWorldPoint(this.m_localAnchorA, box2d.b2PulleyJoint.prototype.GetCurrentLengthA.s_p);
    return box2d.b2DistanceVV(a, this.m_groundAnchorA)
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetCurrentLengthA", box2d.b2PulleyJoint.prototype.GetCurrentLengthA);
box2d.b2PulleyJoint.prototype.GetCurrentLengthA.s_p = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.GetCurrentLengthB = function () {
    var a = this.m_bodyB.GetWorldPoint(this.m_localAnchorB, box2d.b2PulleyJoint.prototype.GetCurrentLengthB.s_p);
    return box2d.b2DistanceVV(a, this.m_groundAnchorB)
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "GetCurrentLengthB", box2d.b2PulleyJoint.prototype.GetCurrentLengthB);
box2d.b2PulleyJoint.prototype.GetCurrentLengthB.s_p = new box2d.b2Vec2;
box2d.b2PulleyJoint.prototype.Dump = function () {
    if (box2d.DEBUG) {
        var a = this.m_bodyA.m_islandIndex,
            b = this.m_bodyB.m_islandIndex;
        box2d.b2Log("  /*box2d.b2PulleyJointDef*/ var jd = new box2d.b2PulleyJointDef();\n");
        box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
        box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
        box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
        box2d.b2Log("  jd.groundAnchorA.SetXY(%.15f, %.15f);\n", this.m_groundAnchorA.x, this.m_groundAnchorA.y);
        box2d.b2Log("  jd.groundAnchorB.SetXY(%.15f, %.15f);\n",
            this.m_groundAnchorB.x, this.m_groundAnchorB.y);
        box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
        box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
        box2d.b2Log("  jd.lengthA = %.15f;\n", this.m_lengthA);
        box2d.b2Log("  jd.lengthB = %.15f;\n", this.m_lengthB);
        box2d.b2Log("  jd.ratio = %.15f;\n", this.m_ratio);
        box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
    }
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "Dump", box2d.b2PulleyJoint.prototype.Dump);
box2d.b2PulleyJoint.prototype.ShiftOrigin = function (a) {
    this.m_groundAnchorA.SelfSub(a);
    this.m_groundAnchorB.SelfSub(a)
};
goog.exportProperty(box2d.b2PulleyJoint.prototype, "ShiftOrigin", box2d.b2PulleyJoint.prototype.ShiftOrigin);
box2d.b2CircleShape = function (a) {
    box2d.b2Shape.call(this, box2d.b2ShapeType.e_circleShape, a || 0);
    this.m_p = new box2d.b2Vec2
};
goog.inherits(box2d.b2CircleShape, box2d.b2Shape);
goog.exportSymbol("box2d.b2CircleShape", box2d.b2CircleShape);
box2d.b2CircleShape.prototype.m_p = null;
goog.exportProperty(box2d.b2CircleShape.prototype, "m_p", box2d.b2CircleShape.prototype.m_p);
box2d.b2CircleShape.prototype.Clone = function () {
    return (new box2d.b2CircleShape).Copy(this)
};
goog.exportProperty(box2d.b2CircleShape.prototype, "Clone", box2d.b2CircleShape.prototype.Clone);
box2d.b2CircleShape.prototype.Copy = function (a) {
    box2d.b2CircleShape.superClass_.Copy.call(this, a);
    box2d.ENABLE_ASSERTS && box2d.b2Assert(a instanceof box2d.b2CircleShape);
    this.m_p.Copy(a.m_p);
    return this
};
goog.exportProperty(box2d.b2CircleShape.prototype, "Copy", box2d.b2CircleShape.prototype.Copy);
box2d.b2CircleShape.prototype.GetChildCount = function () {
    return 1
};
goog.exportProperty(box2d.b2CircleShape.prototype, "GetChildCount", box2d.b2CircleShape.prototype.GetChildCount);
box2d.b2CircleShape.prototype.TestPoint = function (a, b) {
    var c = box2d.b2MulXV(a, this.m_p, box2d.b2CircleShape.prototype.TestPoint.s_center),
        c = box2d.b2SubVV(b, c, box2d.b2CircleShape.prototype.TestPoint.s_d);
    return box2d.b2DotVV(c, c) <= box2d.b2Sq(this.m_radius)
};
goog.exportProperty(box2d.b2CircleShape.prototype, "TestPoint", box2d.b2CircleShape.prototype.TestPoint);
box2d.b2CircleShape.prototype.TestPoint.s_center = new box2d.b2Vec2;
box2d.b2CircleShape.prototype.TestPoint.s_d = new box2d.b2Vec2;
box2d.b2CircleShape.prototype.RayCast = function (a, b, c, e) {
    c = box2d.b2MulXV(c, this.m_p, box2d.b2CircleShape.prototype.RayCast.s_position);
    c = box2d.b2SubVV(b.p1, c, box2d.b2CircleShape.prototype.RayCast.s_s);
    var d = box2d.b2DotVV(c, c) - box2d.b2Sq(this.m_radius);
    e = box2d.b2SubVV(b.p2, b.p1, box2d.b2CircleShape.prototype.RayCast.s_r);
    var f = box2d.b2DotVV(c, e),
        g = box2d.b2DotVV(e, e),
        d = f * f - g * d;
    if (0 > d || g < box2d.b2_epsilon) return !1;
    f = -(f + box2d.b2Sqrt(d));
    return 0 <= f && f <= b.maxFraction * g ? (f /= g, a.fraction = f, box2d.b2AddVMulSV(c,
        f, e, a.normal).SelfNormalize(), !0) : !1
};
goog.exportProperty(box2d.b2CircleShape.prototype, "RayCast", box2d.b2CircleShape.prototype.RayCast);
box2d.b2CircleShape.prototype.RayCast.s_position = new box2d.b2Vec2;
box2d.b2CircleShape.prototype.RayCast.s_s = new box2d.b2Vec2;
box2d.b2CircleShape.prototype.RayCast.s_r = new box2d.b2Vec2;
box2d.b2CircleShape.prototype.ComputeAABB = function (a, b, c) {
    b = box2d.b2MulXV(b, this.m_p, box2d.b2CircleShape.prototype.ComputeAABB.s_p);
    a.lowerBound.SetXY(b.x - this.m_radius, b.y - this.m_radius);
    a.upperBound.SetXY(b.x + this.m_radius, b.y + this.m_radius)
};
goog.exportProperty(box2d.b2CircleShape.prototype, "ComputeAABB", box2d.b2CircleShape.prototype.ComputeAABB);
box2d.b2CircleShape.prototype.ComputeAABB.s_p = new box2d.b2Vec2;
box2d.b2CircleShape.prototype.ComputeMass = function (a, b) {
    var c = box2d.b2Sq(this.m_radius);
    a.mass = b * box2d.b2_pi * c;
    a.center.Copy(this.m_p);
    a.I = a.mass * (0.5 * c + box2d.b2DotVV(this.m_p, this.m_p))
};
goog.exportProperty(box2d.b2CircleShape.prototype, "ComputeMass", box2d.b2CircleShape.prototype.ComputeMass);
box2d.b2CircleShape.prototype.SetupDistanceProxy = function (a, b) {
    a.m_vertices = [1, !0];
    a.m_vertices[0] = this.m_p;
    a.m_count = 1;
    a.m_radius = this.m_radius
};
box2d.b2CircleShape.prototype.ComputeSubmergedArea = function (a, b, c, e) {
    c = box2d.b2MulXV(c, this.m_p, new box2d.b2Vec2);
    var d = -(box2d.b2DotVV(a, c) - b);
    if (d < -this.m_radius + box2d.b2_epsilon) return 0;
    if (d > this.m_radius) return e.Copy(c), box2d.b2_pi * this.m_radius * this.m_radius;
    b = this.m_radius * this.m_radius;
    var f = d * d,
        d = b * (box2d.b2Asin(d / this.m_radius) + box2d.b2_pi / 2) + d * box2d.b2Sqrt(b - f);
    b = -2 / 3 * box2d.b2Pow(b - f, 1.5) / d;
    e.x = c.x + a.x * b;
    e.y = c.y + a.y * b;
    return d
};
goog.exportProperty(box2d.b2CircleShape.prototype, "ComputeSubmergedArea", box2d.b2CircleShape.prototype.ComputeSubmergedArea);
box2d.b2CircleShape.prototype.Dump = function () {
    box2d.b2Log("    /*box2d.b2CircleShape*/ var shape = new box2d.b2CircleShape();\n");
    box2d.b2Log("    shape.m_radius = %.15f;\n", this.m_radius);
    box2d.b2Log("    shape.m_p.SetXY(%.15f, %.15f);\n", this.m_p.x, this.m_p.y)
};
goog.exportProperty(box2d.b2CircleShape.prototype, "Dump", box2d.b2CircleShape.prototype.Dump);
box2d.b2RopeDef = function () {
    this.vertices = [];
    this.masses = [];
    this.gravity = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2RopeDef", box2d.b2RopeDef);
box2d.b2RopeDef.prototype.vertices = null;
box2d.b2RopeDef.prototype.count = 0;
box2d.b2RopeDef.prototype.masses = null;
box2d.b2RopeDef.prototype.gravity = null;
box2d.b2RopeDef.prototype.damping = 0.1;
box2d.b2RopeDef.prototype.k2 = 0.9;
box2d.b2RopeDef.prototype.k3 = 0.1;
box2d.b2Rope = function () {
    this.m_gravity = new box2d.b2Vec2
};
goog.exportSymbol("box2d.b2Rope", box2d.b2Rope);
box2d.b2Rope.prototype.m_count = 0;
box2d.b2Rope.prototype.m_ps = null;
box2d.b2Rope.prototype.m_p0s = null;
box2d.b2Rope.prototype.m_vs = null;
box2d.b2Rope.prototype.m_ims = null;
box2d.b2Rope.prototype.m_Ls = null;
box2d.b2Rope.prototype.m_as = null;
box2d.b2Rope.prototype.m_gravity = null;
box2d.b2Rope.prototype.m_damping = 0;
box2d.b2Rope.prototype.m_k2 = 1;
box2d.b2Rope.prototype.m_k3 = 0.1;
box2d.b2Rope.prototype.GetVertexCount = function () {
    return this.m_count
};
goog.exportProperty(box2d.b2Rope.prototype, "GetVertexCount", box2d.b2Rope.prototype.GetVertexCount);
box2d.b2Rope.prototype.GetVertices = function () {
    return this.m_ps
};
goog.exportProperty(box2d.b2Rope.prototype, "GetVertices", box2d.b2Rope.prototype.GetVertices);
box2d.b2Rope.prototype.Initialize = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(3 <= a.count);
    this.m_count = a.count;
    this.m_ps = box2d.b2Vec2.MakeArray(this.m_count);
    this.m_p0s = box2d.b2Vec2.MakeArray(this.m_count);
    this.m_vs = box2d.b2Vec2.MakeArray(this.m_count);
    this.m_ims = box2d.b2MakeNumberArray(this.m_count);
    for (var b = 0; b < this.m_count; ++b) {
        this.m_ps[b].Copy(a.vertices[b]);
        this.m_p0s[b].Copy(a.vertices[b]);
        this.m_vs[b].SetZero();
        var c = a.masses[b];
        this.m_ims[b] = 0 < c ? 1 / c : 0
    }
    var e = this.m_count - 1,
        c = this.m_count -
            2;
    this.m_Ls = box2d.b2MakeNumberArray(e);
    this.m_as = box2d.b2MakeNumberArray(c);
    for (b = 0; b < e; ++b) {
        var d = this.m_ps[b],
            f = this.m_ps[b + 1];
        this.m_Ls[b] = box2d.b2DistanceVV(d, f)
    }
    for (b = 0; b < c; ++b) d = this.m_ps[b], f = this.m_ps[b + 1], e = this.m_ps[b + 2], d = box2d.b2SubVV(f, d, box2d.b2Vec2.s_t0), e = box2d.b2SubVV(e, f, box2d.b2Vec2.s_t1), f = box2d.b2CrossVV(d, e), d = box2d.b2DotVV(d, e), this.m_as[b] = box2d.b2Atan2(f, d);
    this.m_gravity.Copy(a.gravity);
    this.m_damping = a.damping;
    this.m_k2 = a.k2;
    this.m_k3 = a.k3
};
goog.exportProperty(box2d.b2Rope.prototype, "Initialize", box2d.b2Rope.prototype.Initialize);
box2d.b2Rope.prototype.Step = function (a, b) {
    if (0 !== a) {
        for (var c = Math.exp(-a * this.m_damping), e = 0; e < this.m_count; ++e) this.m_p0s[e].Copy(this.m_ps[e]), 0 < this.m_ims[e] && this.m_vs[e].SelfMulAdd(a, this.m_gravity), this.m_vs[e].SelfMul(c), this.m_ps[e].SelfMulAdd(a, this.m_vs[e]);
        for (e = 0; e < b; ++e) this.SolveC2(), this.SolveC3(), this.SolveC2();
        c = 1 / a;
        for (e = 0; e < this.m_count; ++e) box2d.b2MulSV(c, box2d.b2SubVV(this.m_ps[e], this.m_p0s[e], box2d.b2Vec2.s_t0), this.m_vs[e])
    }
};
goog.exportProperty(box2d.b2Rope.prototype, "Step", box2d.b2Rope.prototype.Step);
box2d.b2Rope.prototype.SolveC2 = function () {
    for (var a = this.m_count - 1, b = 0; b < a; ++b) {
        var c = this.m_ps[b],
            e = this.m_ps[b + 1],
            d = box2d.b2SubVV(e, c, box2d.b2Rope.s_d),
            f = d.Normalize(),
            g = this.m_ims[b],
            h = this.m_ims[b + 1];
        if (0 !== g + h) {
            var l = h / (g + h);
            c.SelfMulSub(g / (g + h) * this.m_k2 * (this.m_Ls[b] - f), d);
            e.SelfMulAdd(this.m_k2 * l * (this.m_Ls[b] - f), d)
        }
    }
};
goog.exportProperty(box2d.b2Rope.prototype, "SolveC2", box2d.b2Rope.prototype.SolveC2);
box2d.b2Rope.s_d = new box2d.b2Vec2;
box2d.b2Rope.prototype.SetAngleRadians = function (a) {
    for (var b = this.m_count - 2, c = 0; c < b; ++c) this.m_as[c] = a
};
goog.exportProperty(box2d.b2Rope.prototype, "SetAngleRadians", box2d.b2Rope.prototype.SetAngleRadians);
box2d.b2Rope.prototype.SolveC3 = function () {
    for (var a = this.m_count - 2, b = 0; b < a; ++b) {
        var c = this.m_ps[b],
            e = this.m_ps[b + 1],
            d = this.m_ps[b + 2],
            f = this.m_ims[b],
            g = this.m_ims[b + 1],
            h = this.m_ims[b + 2],
            l = box2d.b2SubVV(e, c, box2d.b2Rope.s_d1),
            k = box2d.b2SubVV(d, e, box2d.b2Rope.s_d2),
            m = l.GetLengthSquared(),
            n = k.GetLengthSquared();
        if (0 !== m * n) {
            var p = box2d.b2CrossVV(l, k),
                q = box2d.b2DotVV(l, k),
                p = box2d.b2Atan2(p, q),
                l = box2d.b2MulSV(-1 / m, l.SelfSkew(), box2d.b2Rope.s_Jd1),
                m = box2d.b2MulSV(1 / n, k.SelfSkew(), box2d.b2Rope.s_Jd2),
                k = box2d.b2NegV(l,
                    box2d.b2Rope.s_J1),
                n = box2d.b2SubVV(l, m, box2d.b2Rope.s_J2),
                l = m,
                m = f * box2d.b2DotVV(k, k) + g * box2d.b2DotVV(n, n) + h * box2d.b2DotVV(l, l);
            if (0 !== m) {
                m = 1 / m;
                for (q = p - this.m_as[b]; q > box2d.b2_pi;) p -= 2 * box2d.b2_pi, q = p - this.m_as[b];
                for (; q < -box2d.b2_pi;) p += 2 * box2d.b2_pi, q = p - this.m_as[b];
                p = -this.m_k3 * m * q;
                c.SelfMulAdd(f * p, k);
                e.SelfMulAdd(g * p, n);
                d.SelfMulAdd(h * p, l)
            }
        }
    }
};
goog.exportProperty(box2d.b2Rope.prototype, "SolveC3", box2d.b2Rope.prototype.SolveC3);
box2d.b2Rope.s_d1 = new box2d.b2Vec2;
box2d.b2Rope.s_d2 = new box2d.b2Vec2;
box2d.b2Rope.s_Jd1 = new box2d.b2Vec2;
box2d.b2Rope.s_Jd2 = new box2d.b2Vec2;
box2d.b2Rope.s_J1 = new box2d.b2Vec2;
box2d.b2Rope.s_J2 = new box2d.b2Vec2;
box2d.b2Rope.prototype.Draw = function (a) {
    for (var b = new box2d.b2Color(0.4, 0.5, 0.7), c = 0; c < this.m_count - 1; ++c) a.DrawSegment(this.m_ps[c], this.m_ps[c + 1], b)
};
goog.exportProperty(box2d.b2Rope.prototype, "Draw", box2d.b2Rope.prototype.Draw);
box2d.b2WheelJointDef = function () {
    box2d.b2JointDef.call(this, box2d.b2JointType.e_wheelJoint);
    this.localAnchorA = new box2d.b2Vec2(0, 0);
    this.localAnchorB = new box2d.b2Vec2(0, 0);
    this.localAxisA = new box2d.b2Vec2(1, 0)
};
goog.inherits(box2d.b2WheelJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2WheelJointDef", box2d.b2WheelJointDef);
box2d.b2WheelJointDef.prototype.localAnchorA = null;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "localAnchorA", box2d.b2WheelJointDef.prototype.localAnchorA);
box2d.b2WheelJointDef.prototype.localAnchorB = null;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "localAnchorB", box2d.b2WheelJointDef.prototype.localAnchorB);
box2d.b2WheelJointDef.prototype.localAxisA = null;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "localAxisA", box2d.b2WheelJointDef.prototype.localAxisA);
box2d.b2WheelJointDef.prototype.enableMotor = !1;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "enableMotor", box2d.b2WheelJointDef.prototype.enableMotor);
box2d.b2WheelJointDef.prototype.maxMotorTorque = 0;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "maxMotorTorque", box2d.b2WheelJointDef.prototype.maxMotorTorque);
box2d.b2WheelJointDef.prototype.motorSpeed = 0;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "motorSpeed", box2d.b2WheelJointDef.prototype.motorSpeed);
box2d.b2WheelJointDef.prototype.frequencyHz = 2;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "frequencyHz", box2d.b2WheelJointDef.prototype.frequencyHz);
box2d.b2WheelJointDef.prototype.dampingRatio = 0.7;
goog.exportProperty(box2d.b2WheelJointDef.prototype, "dampingRatio", box2d.b2WheelJointDef.prototype.dampingRatio);
box2d.b2WheelJointDef.prototype.Initialize = function (a, b, c, e) {
    this.bodyA = a;
    this.bodyB = b;
    this.bodyA.GetLocalPoint(c, this.localAnchorA);
    this.bodyB.GetLocalPoint(c, this.localAnchorB);
    this.bodyA.GetLocalVector(e, this.localAxisA)
};
goog.exportProperty(box2d.b2WheelJointDef.prototype, "Initialize", box2d.b2WheelJointDef.prototype.Initialize);
box2d.b2WheelJoint = function (a) {
    box2d.b2Joint.call(this, a);
    this.m_frequencyHz = a.frequencyHz;
    this.m_dampingRatio = a.dampingRatio;
    this.m_localAnchorA = a.localAnchorA.Clone();
    this.m_localAnchorB = a.localAnchorB.Clone();
    this.m_localXAxisA = a.localAxisA.Clone();
    this.m_localYAxisA = box2d.b2CrossOneV(this.m_localXAxisA, new box2d.b2Vec2);
    this.m_maxMotorTorque = a.maxMotorTorque;
    this.m_motorSpeed = a.motorSpeed;
    this.m_enableMotor = a.enableMotor;
    this.m_localCenterA = new box2d.b2Vec2;
    this.m_localCenterB = new box2d.b2Vec2;
    this.m_ax = new box2d.b2Vec2;
    this.m_ay = new box2d.b2Vec2;
    this.m_qA = new box2d.b2Rot;
    this.m_qB = new box2d.b2Rot;
    this.m_lalcA = new box2d.b2Vec2;
    this.m_lalcB = new box2d.b2Vec2;
    this.m_rA = new box2d.b2Vec2;
    this.m_rB = new box2d.b2Vec2;
    this.m_ax.SetZero();
    this.m_ay.SetZero()
};
goog.inherits(box2d.b2WheelJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2WheelJoint", box2d.b2WheelJoint);
box2d.b2WheelJoint.prototype.m_frequencyHz = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_frequencyHz", box2d.b2WheelJoint.prototype.m_frequencyHz);
box2d.b2WheelJoint.prototype.m_dampingRatio = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_dampingRatio", box2d.b2WheelJoint.prototype.m_dampingRatio);
box2d.b2WheelJoint.prototype.m_localAnchorA = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_localAnchorA", box2d.b2WheelJoint.prototype.m_localAnchorA);
box2d.b2WheelJoint.prototype.m_localAnchorB = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_localAnchorB", box2d.b2WheelJoint.prototype.m_localAnchorB);
box2d.b2WheelJoint.prototype.m_localXAxisA = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_localXAxisA", box2d.b2WheelJoint.prototype.m_localXAxisA);
box2d.b2WheelJoint.prototype.m_localYAxisA = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_localYAxisA", box2d.b2WheelJoint.prototype.m_localYAxisA);
box2d.b2WheelJoint.prototype.m_impulse = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_impulse", box2d.b2WheelJoint.prototype.m_impulse);
box2d.b2WheelJoint.prototype.m_motorImpulse = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_motorImpulse", box2d.b2WheelJoint.prototype.m_motorImpulse);
box2d.b2WheelJoint.prototype.m_springImpulse = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_springImpulse", box2d.b2WheelJoint.prototype.m_springImpulse);
box2d.b2WheelJoint.prototype.m_maxMotorTorque = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_maxMotorTorque", box2d.b2WheelJoint.prototype.m_maxMotorTorque);
box2d.b2WheelJoint.prototype.m_motorSpeed = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_motorSpeed", box2d.b2WheelJoint.prototype.m_motorSpeed);
box2d.b2WheelJoint.prototype.m_enableMotor = !1;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_enableMotor", box2d.b2WheelJoint.prototype.m_enableMotor);
box2d.b2WheelJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_indexA", box2d.b2WheelJoint.prototype.m_indexA);
box2d.b2WheelJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_indexB", box2d.b2WheelJoint.prototype.m_indexB);
box2d.b2WheelJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_localCenterA", box2d.b2WheelJoint.prototype.m_localCenterA);
box2d.b2WheelJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_localCenterB", box2d.b2WheelJoint.prototype.m_localCenterB);
box2d.b2WheelJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_invMassA", box2d.b2WheelJoint.prototype.m_invMassA);
box2d.b2WheelJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_invMassB", box2d.b2WheelJoint.prototype.m_invMassB);
box2d.b2WheelJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_invIA", box2d.b2WheelJoint.prototype.m_invIA);
box2d.b2WheelJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_invIB", box2d.b2WheelJoint.prototype.m_invIB);
box2d.b2WheelJoint.prototype.m_ax = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_ax", box2d.b2WheelJoint.prototype.m_ax);
box2d.b2WheelJoint.prototype.m_ay = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_ay", box2d.b2WheelJoint.prototype.m_ay);
box2d.b2WheelJoint.prototype.m_sAx = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_sAx", box2d.b2WheelJoint.prototype.m_sAx);
box2d.b2WheelJoint.prototype.m_sBx = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_sBx", box2d.b2WheelJoint.prototype.m_sBx);
box2d.b2WheelJoint.prototype.m_sAy = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_sAy", box2d.b2WheelJoint.prototype.m_sAy);
box2d.b2WheelJoint.prototype.m_sBy = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_sBy", box2d.b2WheelJoint.prototype.m_sBy);
box2d.b2WheelJoint.prototype.m_mass = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_mass", box2d.b2WheelJoint.prototype.m_mass);
box2d.b2WheelJoint.prototype.m_motorMass = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_motorMass", box2d.b2WheelJoint.prototype.m_motorMass);
box2d.b2WheelJoint.prototype.m_springMass = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_springMass", box2d.b2WheelJoint.prototype.m_springMass);
box2d.b2WheelJoint.prototype.m_bias = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_bias", box2d.b2WheelJoint.prototype.m_bias);
box2d.b2WheelJoint.prototype.m_gamma = 0;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_gamma", box2d.b2WheelJoint.prototype.m_gamma);
box2d.b2WheelJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_qA", box2d.b2WheelJoint.prototype.m_qA);
box2d.b2WheelJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_qB", box2d.b2WheelJoint.prototype.m_qB);
box2d.b2WheelJoint.prototype.m_lalcA = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_lalcA", box2d.b2WheelJoint.prototype.m_lalcA);
box2d.b2WheelJoint.prototype.m_lalcB = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_lalcB", box2d.b2WheelJoint.prototype.m_lalcB);
box2d.b2WheelJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_rA", box2d.b2WheelJoint.prototype.m_rA);
box2d.b2WheelJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2WheelJoint.prototype, "m_rB", box2d.b2WheelJoint.prototype.m_rB);
box2d.b2WheelJoint.prototype.GetMotorSpeed = function () {
    return this.m_motorSpeed
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetMotorSpeed", box2d.b2WheelJoint.prototype.GetMotorSpeed);
box2d.b2WheelJoint.prototype.GetMaxMotorTorque = function () {
    return this.m_maxMotorTorque
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetMaxMotorTorque", box2d.b2WheelJoint.prototype.GetMaxMotorTorque);
box2d.b2WheelJoint.prototype.SetSpringFrequencyHz = function (a) {
    this.m_frequencyHz = a
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "SetSpringFrequencyHz", box2d.b2WheelJoint.prototype.SetSpringFrequencyHz);
box2d.b2WheelJoint.prototype.GetSpringFrequencyHz = function () {
    return this.m_frequencyHz
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetSpringFrequencyHz", box2d.b2WheelJoint.prototype.GetSpringFrequencyHz);
box2d.b2WheelJoint.prototype.SetSpringDampingRatio = function (a) {
    this.m_dampingRatio = a
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "SetSpringDampingRatio", box2d.b2WheelJoint.prototype.SetSpringDampingRatio);
box2d.b2WheelJoint.prototype.GetSpringDampingRatio = function () {
    return this.m_dampingRatio
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetSpringDampingRatio", box2d.b2WheelJoint.prototype.GetSpringDampingRatio);
box2d.b2WheelJoint.prototype.InitVelocityConstraints = function (a) {
    this.m_indexA = this.m_bodyA.m_islandIndex;
    this.m_indexB = this.m_bodyB.m_islandIndex;
    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
    this.m_invMassA = this.m_bodyA.m_invMass;
    this.m_invMassB = this.m_bodyB.m_invMass;
    this.m_invIA = this.m_bodyA.m_invI;
    this.m_invIB = this.m_bodyB.m_invI;
    var b = this.m_invMassA,
        c = this.m_invMassB,
        e = this.m_invIA,
        d = this.m_invIB,
        f = a.positions[this.m_indexA].c,
        g = a.velocities[this.m_indexA].v,
        h = a.velocities[this.m_indexA].w,
        l = a.positions[this.m_indexB].c,
        k = a.positions[this.m_indexB].a,
        m = a.velocities[this.m_indexB].v,
        n = a.velocities[this.m_indexB].w,
        p = this.m_qA.SetAngleRadians(a.positions[this.m_indexA].a),
        q = this.m_qB.SetAngleRadians(k);
    box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
    k = box2d.b2MulRV(p, this.m_lalcA, this.m_rA);
    box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    q = box2d.b2MulRV(q, this.m_lalcB, this.m_rB);
    f =
        box2d.b2SubVV(box2d.b2AddVV(l, q, box2d.b2Vec2.s_t0), box2d.b2AddVV(f, k, box2d.b2Vec2.s_t1), box2d.b2WheelJoint.prototype.InitVelocityConstraints.s_d);
    box2d.b2MulRV(p, this.m_localYAxisA, this.m_ay);
    this.m_sAy = box2d.b2CrossVV(box2d.b2AddVV(f, k, box2d.b2Vec2.s_t0), this.m_ay);
    this.m_sBy = box2d.b2CrossVV(q, this.m_ay);
    this.m_mass = b + c + e * this.m_sAy * this.m_sAy + d * this.m_sBy * this.m_sBy;
    0 < this.m_mass && (this.m_mass = 1 / this.m_mass);
    this.m_gamma = this.m_bias = this.m_springMass = 0;
    0 < this.m_frequencyHz ? (box2d.b2MulRV(p, this.m_localXAxisA,
        this.m_ax), this.m_sAx = box2d.b2CrossVV(box2d.b2AddVV(f, k, box2d.b2Vec2.s_t0), this.m_ax), this.m_sBx = box2d.b2CrossVV(q, this.m_ax), b = b + c + e * this.m_sAx * this.m_sAx + d * this.m_sBx * this.m_sBx, 0 < b && (this.m_springMass = 1 / b, c = box2d.b2DotVV(f, this.m_ax), p = 2 * box2d.b2_pi * this.m_frequencyHz, f = this.m_springMass * p * p, l = a.step.dt, this.m_gamma = l * (2 * this.m_springMass * this.m_dampingRatio * p + l * f), 0 < this.m_gamma && (this.m_gamma = 1 / this.m_gamma), this.m_bias = c * l * f * this.m_gamma, this.m_springMass = b + this.m_gamma, 0 < this.m_springMass &&
        (this.m_springMass = 1 / this.m_springMass))) : this.m_springImpulse = 0;
    this.m_enableMotor ? (this.m_motorMass = e + d, 0 < this.m_motorMass && (this.m_motorMass = 1 / this.m_motorMass)) : this.m_motorImpulse = this.m_motorMass = 0;
    a.step.warmStarting ? (this.m_impulse *= a.step.dtRatio, this.m_springImpulse *= a.step.dtRatio, this.m_motorImpulse *= a.step.dtRatio, e = box2d.b2AddVV(box2d.b2MulSV(this.m_impulse, this.m_ay, box2d.b2Vec2.s_t0), box2d.b2MulSV(this.m_springImpulse, this.m_ax, box2d.b2Vec2.s_t1), box2d.b2WheelJoint.prototype.InitVelocityConstraints.s_P),
        d = this.m_impulse * this.m_sAy + this.m_springImpulse * this.m_sAx + this.m_motorImpulse, b = this.m_impulse * this.m_sBy + this.m_springImpulse * this.m_sBx + this.m_motorImpulse, g.SelfMulSub(this.m_invMassA, e), h -= this.m_invIA * d, m.SelfMulAdd(this.m_invMassB, e), n += this.m_invIB * b) : this.m_motorImpulse = this.m_springImpulse = this.m_impulse = 0;
    a.velocities[this.m_indexA].w = h;
    a.velocities[this.m_indexB].w = n
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "InitVelocityConstraints", box2d.b2WheelJoint.prototype.InitVelocityConstraints);
box2d.b2WheelJoint.prototype.InitVelocityConstraints.s_d = new box2d.b2Vec2;
box2d.b2WheelJoint.prototype.InitVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2WheelJoint.prototype.SolveVelocityConstraints = function (a) {
    var b = this.m_invMassA,
        c = this.m_invMassB,
        e = this.m_invIA,
        d = this.m_invIB,
        f = a.velocities[this.m_indexA].v,
        g = a.velocities[this.m_indexA].w,
        h = a.velocities[this.m_indexB].v,
        l = a.velocities[this.m_indexB].w,
        k = box2d.b2DotVV(this.m_ax, box2d.b2SubVV(h, f, box2d.b2Vec2.s_t0)) + this.m_sBx * l - this.m_sAx * g,
        k = -this.m_springMass * (k + this.m_bias + this.m_gamma * this.m_springImpulse);
    this.m_springImpulse += k;
    var m = box2d.b2MulSV(k, this.m_ax, box2d.b2WheelJoint.prototype.SolveVelocityConstraints.s_P),
        n = k * this.m_sAx,
        k = k * this.m_sBx;
    f.SelfMulSub(b, m);
    g -= e * n;
    h.SelfMulAdd(c, m);
    l += d * k;
    k = l - g - this.m_motorSpeed;
    k *= -this.m_motorMass;
    m = this.m_motorImpulse;
    n = a.step.dt * this.m_maxMotorTorque;
    this.m_motorImpulse = box2d.b2Clamp(this.m_motorImpulse + k, -n, n);
    k = this.m_motorImpulse - m;
    g -= e * k;
    l += d * k;
    k = box2d.b2DotVV(this.m_ay, box2d.b2SubVV(h, f, box2d.b2Vec2.s_t0)) + this.m_sBy * l - this.m_sAy * g;
    k *= -this.m_mass;
    this.m_impulse += k;
    m = box2d.b2MulSV(k, this.m_ay, box2d.b2WheelJoint.prototype.SolveVelocityConstraints.s_P);
    n = k * this.m_sAy;
    k *= this.m_sBy;
    f.SelfMulSub(b, m);
    g -= e * n;
    h.SelfMulAdd(c, m);
    a.velocities[this.m_indexA].w = g;
    a.velocities[this.m_indexB].w = l + d * k
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "SolveVelocityConstraints", box2d.b2WheelJoint.prototype.SolveVelocityConstraints);
box2d.b2WheelJoint.prototype.SolveVelocityConstraints.s_P = new box2d.b2Vec2;
box2d.b2WheelJoint.prototype.SolvePositionConstraints = function (a) {
    var b = a.positions[this.m_indexA].c,
        c = a.positions[this.m_indexA].a,
        e = a.positions[this.m_indexB].c,
        d = a.positions[this.m_indexB].a,
        f = this.m_qA.SetAngleRadians(c),
        g = this.m_qB.SetAngleRadians(d);
    box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
    var h = box2d.b2MulRV(f, this.m_lalcA, this.m_rA);
    box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    var g = box2d.b2MulRV(g, this.m_lalcB, this.m_rB),
        l = box2d.b2AddVV(box2d.b2SubVV(e,
            b, box2d.b2Vec2.s_t0), box2d.b2SubVV(g, h, box2d.b2Vec2.s_t1), box2d.b2WheelJoint.prototype.SolvePositionConstraints.s_d),
        f = box2d.b2MulRV(f, this.m_localYAxisA, this.m_ay),
        h = box2d.b2CrossVV(box2d.b2AddVV(l, h, box2d.b2Vec2.s_t0), f),
        g = box2d.b2CrossVV(g, f),
        l = box2d.b2DotVV(l, this.m_ay),
        k = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_sAy * this.m_sAy + this.m_invIB * this.m_sBy * this.m_sBy,
        k = 0 !== k ? -l / k : 0,
        f = box2d.b2MulSV(k, f, box2d.b2WheelJoint.prototype.SolvePositionConstraints.s_P),
        h = k * h,
        g = k * g;
    b.SelfMulSub(this.m_invMassA,
        f);
    c -= this.m_invIA * h;
    e.SelfMulAdd(this.m_invMassB, f);
    d += this.m_invIB * g;
    a.positions[this.m_indexA].a = c;
    a.positions[this.m_indexB].a = d;
    return box2d.b2Abs(l) <= box2d.b2_linearSlop
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "SolvePositionConstraints", box2d.b2WheelJoint.prototype.SolvePositionConstraints);
box2d.b2WheelJoint.prototype.SolvePositionConstraints.s_d = new box2d.b2Vec2;
box2d.b2WheelJoint.prototype.SolvePositionConstraints.s_P = new box2d.b2Vec2;
box2d.b2WheelJoint.prototype.GetDefinition = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(!1);
    return a
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetDefinition", box2d.b2WheelJoint.prototype.GetDefinition);
box2d.b2WheelJoint.prototype.GetAnchorA = function (a) {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, a)
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetAnchorA", box2d.b2WheelJoint.prototype.GetAnchorA);
box2d.b2WheelJoint.prototype.GetAnchorB = function (a) {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, a)
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetAnchorB", box2d.b2WheelJoint.prototype.GetAnchorB);
box2d.b2WheelJoint.prototype.GetReactionForce = function (a, b) {
    b.x = a * (this.m_impulse * this.m_ay.x + this.m_springImpulse * this.m_ax.x);
    b.y = a * (this.m_impulse * this.m_ay.y + this.m_springImpulse * this.m_ax.y);
    return b
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetReactionForce", box2d.b2WheelJoint.prototype.GetReactionForce);
box2d.b2WheelJoint.prototype.GetReactionTorque = function (a) {
    return a * this.m_motorImpulse
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetReactionTorque", box2d.b2WheelJoint.prototype.GetReactionTorque);
box2d.b2WheelJoint.prototype.GetLocalAnchorA = function (a) {
    return a.Copy(this.m_localAnchorA)
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetLocalAnchorA", box2d.b2WheelJoint.prototype.GetLocalAnchorA);
box2d.b2WheelJoint.prototype.GetLocalAnchorB = function (a) {
    return a.Copy(this.m_localAnchorB)
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetLocalAnchorB", box2d.b2WheelJoint.prototype.GetLocalAnchorB);
box2d.b2WheelJoint.prototype.GetLocalAxisA = function (a) {
    return a.Copy(this.m_localXAxisA)
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetLocalAxisA", box2d.b2WheelJoint.prototype.GetLocalAxisA);
box2d.b2WheelJoint.prototype.GetJointTranslation = function () {
    var a = this.m_bodyA,
        b = this.m_bodyB,
        c = a.GetWorldPoint(this.m_localAnchorA, new box2d.b2Vec2),
        b = b.GetWorldPoint(this.m_localAnchorB, new box2d.b2Vec2),
        c = box2d.b2SubVV(b, c, new box2d.b2Vec2),
        a = a.GetWorldVector(this.m_localXAxisA, new box2d.b2Vec2);
    return box2d.b2DotVV(c, a)
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetJointTranslation", box2d.b2WheelJoint.prototype.GetJointTranslation);
box2d.b2WheelJoint.prototype.GetJointSpeed = function () {
    return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetJointSpeed", box2d.b2WheelJoint.prototype.GetJointSpeed);
box2d.b2WheelJoint.prototype.IsMotorEnabled = function () {
    return this.m_enableMotor
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "IsMotorEnabled", box2d.b2WheelJoint.prototype.IsMotorEnabled);
box2d.b2WheelJoint.prototype.EnableMotor = function (a) {
    this.m_bodyA.SetAwake(!0);
    this.m_bodyB.SetAwake(!0);
    this.m_enableMotor = a
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "EnableMotor", box2d.b2WheelJoint.prototype.EnableMotor);
box2d.b2WheelJoint.prototype.SetMotorSpeed = function (a) {
    this.m_bodyA.SetAwake(!0);
    this.m_bodyB.SetAwake(!0);
    this.m_motorSpeed = a
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "SetMotorSpeed", box2d.b2WheelJoint.prototype.SetMotorSpeed);
box2d.b2WheelJoint.prototype.SetMaxMotorTorque = function (a) {
    this.m_bodyA.SetAwake(!0);
    this.m_bodyB.SetAwake(!0);
    this.m_maxMotorTorque = a
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "SetMaxMotorTorque", box2d.b2WheelJoint.prototype.SetMaxMotorTorque);
box2d.b2WheelJoint.prototype.GetMotorTorque = function (a) {
    return a * this.m_motorImpulse
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "GetMotorTorque", box2d.b2WheelJoint.prototype.GetMotorTorque);
box2d.b2WheelJoint.prototype.Dump = function () {
    if (box2d.DEBUG) {
        var a = this.m_bodyA.m_islandIndex,
            b = this.m_bodyB.m_islandIndex;
        box2d.b2Log("  /*box2d.b2WheelJointDef*/ var jd = new box2d.b2WheelJointDef();\n");
        box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
        box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
        box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
        box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
        box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n",
            this.m_localAnchorB.x, this.m_localAnchorB.y);
        box2d.b2Log("  jd.localAxisA.Set(%.15f, %.15f);\n", this.m_localXAxisA.x, this.m_localXAxisA.y);
        box2d.b2Log("  jd.enableMotor = %s;\n", this.m_enableMotor ? "true" : "false");
        box2d.b2Log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
        box2d.b2Log("  jd.maxMotorTorque = %.15f;\n", this.m_maxMotorTorque);
        box2d.b2Log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
        box2d.b2Log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
        box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n",
            this.m_index)
    }
};
goog.exportProperty(box2d.b2WheelJoint.prototype, "Dump", box2d.b2WheelJoint.prototype.Dump);
box2d.b2MotorJointDef = function () {
    box2d.b2JointDef.call(this, box2d.b2JointType.e_motorJoint);
    this.linearOffset = new box2d.b2Vec2(0, 0)
};
goog.inherits(box2d.b2MotorJointDef, box2d.b2JointDef);
goog.exportSymbol("box2d.b2MotorJointDef", box2d.b2MotorJointDef);
box2d.b2MotorJointDef.prototype.linearOffset = null;
goog.exportProperty(box2d.b2MotorJointDef.prototype, "linearOffset", box2d.b2MotorJointDef.prototype.linearOffset);
box2d.b2MotorJointDef.prototype.angularOffset = 0;
goog.exportProperty(box2d.b2MotorJointDef.prototype, "angularOffset", box2d.b2MotorJointDef.prototype.angularOffset);
box2d.b2MotorJointDef.prototype.maxForce = 1;
goog.exportProperty(box2d.b2MotorJointDef.prototype, "maxForce", box2d.b2MotorJointDef.prototype.maxForce);
box2d.b2MotorJointDef.prototype.maxTorque = 1;
goog.exportProperty(box2d.b2MotorJointDef.prototype, "maxTorque", box2d.b2MotorJointDef.prototype.maxTorque);
box2d.b2MotorJointDef.prototype.correctionFactor = 0.3;
goog.exportProperty(box2d.b2MotorJointDef.prototype, "correctionFactor", box2d.b2MotorJointDef.prototype.correctionFactor);
box2d.b2MotorJointDef.prototype.Initialize = function (a, b) {
    this.bodyA = a;
    this.bodyB = b;
    this.bodyA.GetLocalPoint(this.bodyB.GetPosition(), this.linearOffset);
    var c = this.bodyA.GetAngleRadians();
    this.angularOffset = this.bodyB.GetAngleRadians() - c
};
goog.exportProperty(box2d.b2MotorJointDef.prototype, "Initialize", box2d.b2MotorJointDef.prototype.Initialize);
box2d.b2MotorJoint = function (a) {
    box2d.b2Joint.call(this, a);
    this.m_linearOffset = a.linearOffset.Clone();
    this.m_linearImpulse = new box2d.b2Vec2(0, 0);
    this.m_maxForce = a.maxForce;
    this.m_maxTorque = a.maxTorque;
    this.m_correctionFactor = a.correctionFactor;
    this.m_rA = new box2d.b2Vec2(0, 0);
    this.m_rB = new box2d.b2Vec2(0, 0);
    this.m_localCenterA = new box2d.b2Vec2(0, 0);
    this.m_localCenterB = new box2d.b2Vec2(0, 0);
    this.m_linearError = new box2d.b2Vec2(0, 0);
    this.m_linearMass = new box2d.b2Mat22;
    this.m_qA = new box2d.b2Rot;
    this.m_qB =
        new box2d.b2Rot;
    this.m_K = new box2d.b2Mat22
};
goog.inherits(box2d.b2MotorJoint, box2d.b2Joint);
goog.exportSymbol("box2d.b2MotorJoint", box2d.b2MotorJoint);
box2d.b2MotorJoint.prototype.m_linearOffset = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_linearOffset", box2d.b2MotorJoint.prototype.m_linearOffset);
box2d.b2MotorJoint.prototype.m_angularOffset = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_angularOffset", box2d.b2MotorJoint.prototype.m_angularOffset);
box2d.b2MotorJoint.prototype.m_linearImpulse = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_linearImpulse", box2d.b2MotorJoint.prototype.m_linearImpulse);
box2d.b2MotorJoint.prototype.m_angularImpulse = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_angularImpulse", box2d.b2MotorJoint.prototype.m_angularImpulse);
box2d.b2MotorJoint.prototype.m_maxForce = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_maxForce", box2d.b2MotorJoint.prototype.m_maxForce);
box2d.b2MotorJoint.prototype.m_maxTorque = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_maxTorque", box2d.b2MotorJoint.prototype.m_maxTorque);
box2d.b2MotorJoint.prototype.m_correctionFactor = 0.3;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_correctionFactor", box2d.b2MotorJoint.prototype.m_correctionFactor);
box2d.b2MotorJoint.prototype.m_indexA = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_indexA", box2d.b2MotorJoint.prototype.m_indexA);
box2d.b2MotorJoint.prototype.m_indexB = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_indexB", box2d.b2MotorJoint.prototype.m_indexB);
box2d.b2MotorJoint.prototype.m_rA = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_rA", box2d.b2MotorJoint.prototype.m_rA);
box2d.b2MotorJoint.prototype.m_rB = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_rB", box2d.b2MotorJoint.prototype.m_rB);
box2d.b2MotorJoint.prototype.m_localCenterA = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_localCenterA", box2d.b2MotorJoint.prototype.m_localCenterA);
box2d.b2MotorJoint.prototype.m_localCenterB = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_localCenterB", box2d.b2MotorJoint.prototype.m_localCenterB);
box2d.b2MotorJoint.prototype.m_linearError = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_linearError", box2d.b2MotorJoint.prototype.m_linearError);
box2d.b2MotorJoint.prototype.m_angularError = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_angularError", box2d.b2MotorJoint.prototype.m_angularError);
box2d.b2MotorJoint.prototype.m_invMassA = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_invMassA", box2d.b2MotorJoint.prototype.m_invMassA);
box2d.b2MotorJoint.prototype.m_invMassB = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_invMassB", box2d.b2MotorJoint.prototype.m_invMassB);
box2d.b2MotorJoint.prototype.m_invIA = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_invIA", box2d.b2MotorJoint.prototype.m_invIA);
box2d.b2MotorJoint.prototype.m_invIB = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_invIB", box2d.b2MotorJoint.prototype.m_invIB);
box2d.b2MotorJoint.prototype.m_linearMass = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_linearMass", box2d.b2MotorJoint.prototype.m_linearMass);
box2d.b2MotorJoint.prototype.m_angularMass = 0;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_angularMass", box2d.b2MotorJoint.prototype.m_angularMass);
box2d.b2MotorJoint.prototype.m_qA = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_qA", box2d.b2MotorJoint.prototype.m_qA);
box2d.b2MotorJoint.prototype.m_qB = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_qB", box2d.b2MotorJoint.prototype.m_qB);
box2d.b2MotorJoint.prototype.m_K = null;
goog.exportProperty(box2d.b2MotorJoint.prototype, "m_K", box2d.b2MotorJoint.prototype.m_K);
box2d.b2MotorJoint.prototype.GetAnchorA = function (a) {
    return this.m_bodyA.GetPosition(a)
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetAnchorA", box2d.b2MotorJoint.prototype.GetAnchorA);
box2d.b2MotorJoint.prototype.GetAnchorB = function (a) {
    return this.m_bodyB.GetPosition(a)
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetAnchorB", box2d.b2MotorJoint.prototype.GetAnchorB);
box2d.b2MotorJoint.prototype.GetReactionForce = function (a, b) {
    return box2d.b2MulSV(a, this.m_linearImpulse, b)
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetReactionForce", box2d.b2MotorJoint.prototype.GetReactionForce);
box2d.b2MotorJoint.prototype.GetReactionTorque = function (a) {
    return a * this.m_angularImpulse
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetReactionTorque", box2d.b2MotorJoint.prototype.GetReactionTorque);
box2d.b2MotorJoint.prototype.SetCorrectionFactor = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a) && 0 <= a && 1 >= a);
    this._correctionFactor = a
};
box2d.b2MotorJoint.prototype.GetCorrectionFactor = function () {
    return this.m_correctionFactor
};
box2d.b2MotorJoint.prototype.SetLinearOffset = function (a) {
    box2d.b2IsEqualToV(a, this.m_linearOffset) || (this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_linearOffset.Copy(a))
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "SetLinearOffset", box2d.b2MotorJoint.prototype.SetLinearOffset);
box2d.b2MotorJoint.prototype.GetLinearOffset = function (a) {
    return a.Copy(this.m_linearOffset)
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetLinearOffset", box2d.b2MotorJoint.prototype.GetLinearOffset);
box2d.b2MotorJoint.prototype.SetAngularOffset = function (a) {
    a !== this.m_angularOffset && (this.m_bodyA.SetAwake(!0), this.m_bodyB.SetAwake(!0), this.m_angularOffset = a)
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "SetAngularOffset", box2d.b2MotorJoint.prototype.SetAngularOffset);
box2d.b2MotorJoint.prototype.GetAngularOffset = function () {
    return this.m_angularOffset
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetAngularOffset", box2d.b2MotorJoint.prototype.GetAngularOffset);
box2d.b2MotorJoint.prototype.SetMaxForce = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a) && 0 <= a);
    this.m_maxForce = a
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "SetMaxForce", box2d.b2MotorJoint.prototype.SetMaxForce);
box2d.b2MotorJoint.prototype.GetMaxForce = function () {
    return this.m_maxForce
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetMaxForce", box2d.b2MotorJoint.prototype.GetMaxForce);
box2d.b2MotorJoint.prototype.SetMaxTorque = function (a) {
    box2d.ENABLE_ASSERTS && box2d.b2Assert(box2d.b2IsValid(a) && 0 <= a);
    this.m_maxTorque = a
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "SetMaxTorque", box2d.b2MotorJoint.prototype.SetMaxTorque);
box2d.b2MotorJoint.prototype.GetMaxTorque = function () {
    return this.m_maxTorque
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "GetMaxTorque", box2d.b2MotorJoint.prototype.GetMaxTorque);
box2d.b2MotorJoint.prototype.InitVelocityConstraints = function (a) {
    this.m_indexA = this.m_bodyA.m_islandIndex;
    this.m_indexB = this.m_bodyB.m_islandIndex;
    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
    this.m_invMassA = this.m_bodyA.m_invMass;
    this.m_invMassB = this.m_bodyB.m_invMass;
    this.m_invIA = this.m_bodyA.m_invI;
    this.m_invIB = this.m_bodyB.m_invI;
    var b = a.positions[this.m_indexA].c,
        c = a.positions[this.m_indexA].a,
        e = a.velocities[this.m_indexA].v,
        d = a.velocities[this.m_indexA].w,
        f = a.positions[this.m_indexB].c,
        g = a.positions[this.m_indexB].a,
        h = a.velocities[this.m_indexB].v,
        l = a.velocities[this.m_indexB].w,
        k = this.m_qA.SetAngleRadians(c),
        m = this.m_qB.SetAngleRadians(g),
        n = box2d.b2MulRV(k, box2d.b2NegV(this.m_localCenterA, box2d.b2Vec2.s_t0), this.m_rA),
        m = box2d.b2MulRV(m, box2d.b2NegV(this.m_localCenterB, box2d.b2Vec2.s_t0), this.m_rB),
        p = this.m_invMassA,
        q = this.m_invMassB,
        r = this.m_invIA,
        t = this.m_invIB,
        s = this.m_K;
    s.ex.x = p + q + r * n.y * n.y + t * m.y * m.y;
    s.ex.y = -r * n.x *
        n.y - t * m.x * m.y;
    s.ey.x = s.ex.y;
    s.ey.y = p + q + r * n.x * n.x + t * m.x * m.x;
    s.GetInverse(this.m_linearMass);
    this.m_angularMass = r + t;
    0 < this.m_angularMass && (this.m_angularMass = 1 / this.m_angularMass);
    box2d.b2SubVV(box2d.b2SubVV(box2d.b2AddVV(f, m, box2d.b2Vec2.s_t0), box2d.b2AddVV(b, n, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t2), box2d.b2MulRV(k, this.m_linearOffset, box2d.b2Vec2.s_t3), this.m_linearError);
    this.m_angularError = g - c - this.m_angularOffset;
    a.step.warmStarting ? (this.m_linearImpulse.SelfMul(a.step.dtRatio), this.m_angularImpulse *=
        a.step.dtRatio, b = this.m_linearImpulse, e.SelfMulSub(p, b), d -= r * (box2d.b2CrossVV(n, b) + this.m_angularImpulse), h.SelfMulAdd(q, b), l += t * (box2d.b2CrossVV(m, b) + this.m_angularImpulse)) : (this.m_linearImpulse.SetZero(), this.m_angularImpulse = 0);
    a.velocities[this.m_indexA].w = d;
    a.velocities[this.m_indexB].w = l
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "InitVelocityConstraints", box2d.b2MotorJoint.prototype.InitVelocityConstraints);
box2d.b2MotorJoint.prototype.SolveVelocityConstraints = function (a) {
    var b = a.velocities[this.m_indexA].v,
        c = a.velocities[this.m_indexA].w,
        e = a.velocities[this.m_indexB].v,
        d = a.velocities[this.m_indexB].w,
        f = this.m_invMassA,
        g = this.m_invMassB,
        h = this.m_invIA,
        l = this.m_invIB,
        k = a.step.dt,
        m = a.step.inv_dt,
        n = d - c + m * this.m_correctionFactor * this.m_angularError,
        n = -this.m_angularMass * n,
        p = this.m_angularImpulse,
        q = k * this.m_maxTorque;
    this.m_angularImpulse = box2d.b2Clamp(this.m_angularImpulse + n, -q, q);
    var n = this.m_angularImpulse -
        p,
        c = c - h * n,
        d = d + l * n,
        r = this.m_rA,
        t = this.m_rB,
        n = box2d.b2AddVV(box2d.b2SubVV(box2d.b2AddVV(e, box2d.b2CrossSV(d, t, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), box2d.b2AddVV(b, box2d.b2CrossSV(c, r, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t2), box2d.b2MulSV(m * this.m_correctionFactor, this.m_linearError, box2d.b2Vec2.s_t3), box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_Cdot),
        n = box2d.b2MulMV(this.m_linearMass, n, box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_impulse).SelfNeg(),
        p = box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_oldImpulse.Copy(this.m_linearImpulse);
    this.m_linearImpulse.SelfAdd(n);
    q = k * this.m_maxForce;
    this.m_linearImpulse.GetLengthSquared() > q * q && (this.m_linearImpulse.Normalize(), this.m_linearImpulse.SelfMul(q));
    box2d.b2SubVV(this.m_linearImpulse, p, n);
    b.SelfMulSub(f, n);
    c -= h * box2d.b2CrossVV(r, n);
    e.SelfMulAdd(g, n);
    d += l * box2d.b2CrossVV(t, n);
    a.velocities[this.m_indexA].w = c;
    a.velocities[this.m_indexB].w = d
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "SolveVelocityConstraints", box2d.b2MotorJoint.prototype.SolveVelocityConstraints);
box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_Cdot = new box2d.b2Vec2;
box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_impulse = new box2d.b2Vec2;
box2d.b2MotorJoint.prototype.SolveVelocityConstraints.s_oldImpulse = new box2d.b2Vec2;
box2d.b2MotorJoint.prototype.SolvePositionConstraints = function (a) {
    return !0
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "SolvePositionConstraints", box2d.b2MotorJoint.prototype.SolvePositionConstraints);
box2d.b2MotorJoint.prototype.Dump = function () {
    if (box2d.DEBUG) {
        var a = this.m_bodyA.m_islandIndex,
            b = this.m_bodyB.m_islandIndex;
        box2d.b2Log("  /*box2d.b2MotorJointDef*/ var jd = new box2d.b2MotorJointDef();\n");
        box2d.b2Log("  jd.bodyA = bodies[%d];\n", a);
        box2d.b2Log("  jd.bodyB = bodies[%d];\n", b);
        box2d.b2Log("  jd.collideConnected = %s;\n", this.m_collideConnected ? "true" : "false");
        box2d.b2Log("  jd.linearOffset.SetXY(%.15f, %.15f);\n", this.m_linearOffset.x, this.m_linearOffset.y);
        box2d.b2Log("  jd.angularOffset = %.15f;\n",
            this.m_angularOffset);
        box2d.b2Log("  jd.maxForce = %.15f;\n", this.m_maxForce);
        box2d.b2Log("  jd.maxTorque = %.15f;\n", this.m_maxTorque);
        box2d.b2Log("  jd.correctionFactor = %.15f;\n", this.m_correctionFactor);
        box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index)
    }
};
goog.exportProperty(box2d.b2MotorJoint.prototype, "Dump", box2d.b2MotorJoint.prototype.Dump);