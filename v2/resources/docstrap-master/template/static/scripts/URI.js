/*!
 * URI.js - Mutating URLs
 *
 * Version: 1.8.3
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.com/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */
(function(root, factory) {
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof exports === 'object') {
    // Node
    module.exports = factory(require('./punycode'), require('./IPv6'), require('./SecondLevelDomains'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['./punycode', './IPv6', './SecondLevelDomains'], factory);
  } else {
    // Browser globals (root is window)
    root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains);
  }
}(this, function(punycode, IPv6, SLD) {
  "use strict";

  function URI(url, base) {
    // Allow instantiation without the 'new' keyword
    if (!(this instanceof URI)) {
      return new URI(url, base);
    }
    if (url === undefined) {
      if (typeof location !== 'undefined') {
        url = location.href + "";
      } else {
        url = "";
      }
    }
    this.href(url);
    // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
    if (base !== undefined) {
      return this.absoluteTo(base);
    }
    return this;
  };
  var p = URI.prototype;
  var hasOwn = Object.prototype.hasOwnProperty;

  function escapeRegEx(string) {
    // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }

  function isArray(obj) {
    return String(Object.prototype.toString.call(obj)) === "[object Array]";
  }

  function filterArrayValues(data, value) {
    var lookup = {};
    var i, length;
    if (isArray(value)) {
      for (i = 0, length = value.length; i < length; i++) {
        lookup[value[i]] = true;
      }
    } else {
      lookup[value] = true;
    }
    for (i = 0, length = data.length; i < length; i++) {
      if (lookup[data[i]] !== undefined) {
        data.splice(i, 1);
        length--;
        i--;
      }
    }
    return data;
  }
  URI._parts = function() {
    return {
      protocol: null,
      username: null,
      password: null,
      hostname: null,
      urn: null,
      port: null,
      path: null,
      query: null,
      fragment: null,
      // state
      duplicateQueryParameters: URI.duplicateQueryParameters
    };
  };
  // state: allow duplicate query parameters (a=1&a=1)
  URI.duplicateQueryParameters = false;
  // static properties
  URI.protocol_expression = /^[a-z][a-z0-9-+-]*$/i;
  URI.idn_expression = /[^a-z0-9\.-]/i;
  URI.punycode_expression = /(xn--)/i;
  // well, 333.444.555.666 matches, but it sure ain't no IPv4 - do we care?
  URI.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  // credits to Rich Brown
  // source: http://forums.intermapper.com/viewtopic.php?p=1096#1096
  // specification: http://www.ietf.org/rfc/rfc4291.txt
  URI.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
  // gruber revised expression - http://rodneyrehm.de/t/url-regex.html
  URI.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
  // http://www.iana.org/assignments/uri-schemes.html
  // http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports
  URI.defaultPorts = {
    http: "80",
    https: "443",
    ftp: "21",
    gopher: "70",
    ws: "80",
    wss: "443"
  };
  // allowed hostname characters according to RFC 3986
  // ALPHA DIGIT "-" "." "_" "~" "!" "$" "&" "'" "(" ")" "*" "+" "," ";" "=" %encoded
  // I've never seen a (non-IDN) hostname other than: ALPHA DIGIT . -
  URI.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/;
  // encoding / decoding according to RFC3986

  function strictEncodeURIComponent(string) {
    // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent
    return encodeURIComponent(string).replace(/[!'()*]/g, escape).replace(/\*/g, "%2A");
  }
  URI.encode = strictEncodeURIComponent;
  URI.decode = decodeURIComponent;
  URI.iso8859 = function() {
    URI.encode = escape;
    URI.decode = unescape;
  };
  URI.unicode = function() {
    URI.encode = strictEncodeURIComponent;
    URI.decode = decodeURIComponent;
  };
  URI.characters = {
    pathname: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
        map: {
          // -._~!'()*
          "%24": "$",
          "%26": "&",
          "%2B": "+",
          "%2C": ",",
          "%3B": ";",
          "%3D": "=",
          "%3A": ":",
          "%40": "@"
        }
      },
      decode: {
        expression: /[\/\?#]/g,
        map: {
          "/": "%2F",
          "?": "%3F",
          "#": "%23"
        }
      }
    },
    reserved: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
        map: {
          // gen-delims
          "%3A": ":",
          "%2F": "/",
          "%3F": "?",
          "%23": "#",
          "%5B": "[",
          "%5D": "]",
          "%40": "@",
          // sub-delims
          "%21": "!",
          "%24": "$",
          "%26": "&",
          "%27": "'",
          "%28": "(",
          "%29": ")",
          "%2A": "*",
          "%2B": "+",
          "%2C": ",",
          "%3B": ";",
          "%3D": "="
        }
      }
    }
  };
  URI.encodeQuery = function(string) {
    return URI.encode(string + "").replace(/%20/g, '+');
  };
  URI.decodeQuery = function(string) {
    return URI.decode((string + "").replace(/\+/g, '%20'));
  };
  URI.recodePath = function(string) {
    var segments = (string + "").split('/');
    for (var i = 0, length = segments.length; i < length; i++) {
      segments[i] = URI.encodePathSegment(URI.decode(segments[i]));
    }
    return segments.join('/');
  };
  URI.decodePath = function(string) {
    var segments = (string + "").split('/');
    for (var i = 0, length = segments.length; i < length; i++) {
      segments[i] = URI.decodePathSegment(segments[i]);
    }
    return segments.join('/');
  };
  // generate encode/decode path functions
  var _parts = {
    'encode': 'encode',
    'decode': 'decode'
  };
  var _part;
  var generateAccessor = function(_group, _part) {
    return function(string) {
      return URI[_part](string + "").replace(URI.characters[_group][_part].expression, function(c) {
        return URI.characters[_group][_part].map[c];
      });
    };
  };
  for (_part in _parts) {
    URI[_part + "PathSegment"] = generateAccessor("pathname", _parts[_part]);
  }
  URI.encodeReserved = generateAccessor("reserved", "encode");
  URI.parse = function(string, parts) {
    var pos, t;
    if (!parts) {
      parts = {};
    }
    // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]
    // extract fragment
    pos = string.indexOf('#');
    if (pos > -1) {
      // escaping?
      parts.fragment = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    }
    // extract query
    pos = string.indexOf('?');
    if (pos > -1) {
      // escaping?
      parts.query = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    }
    // extract protocol
    if (string.substring(0, 2) === '//') {
      // relative-scheme
      parts.protocol = '';
      string = string.substring(2);
      // extract "user:pass@host:port"
      string = URI.parseAuthority(string, parts);
    } else {
      pos = string.indexOf(':');
      if (pos > -1) {
        parts.protocol = string.substring(0, pos);
        if (parts.protocol && !parts.protocol.match(URI.protocol_expression)) {
          // : may be within the path
          parts.protocol = undefined;
        } else if (parts.protocol === 'file') {
          // the file scheme: does not contain an authority
          string = string.substring(pos + 3);
        } else if (string.substring(pos + 1, pos + 3) === '//') {
          string = string.substring(pos + 3);
          // extract "user:pass@host:port"
          string = URI.parseAuthority(string, parts);
        } else {
          string = string.substring(pos + 1);
          parts.urn = true;
        }
      }
    }
    // what's left must be the path
    parts.path = string;
    // and we're done
    return parts;
  };
  URI.parseHost = function(string, parts) {
    // extract host:port
    var pos = string.indexOf('/');
    var bracketPos;
    var t;
    if (pos === -1) {
      pos = string.length;
    }
    if (string[0] === "[") {
      // IPv6 host - http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6
      // I claim most client software breaks on IPv6 anyways. To simplify things, URI only accepts
      // IPv6+port in the format [2001:db8::1]:80 (for the time being)
      bracketPos = string.indexOf(']');
      parts.hostname = string.substring(1, bracketPos) || null;
      parts.port = string.substring(bracketPos + 2, pos) || null;
    } else if (string.indexOf(':') !== string.lastIndexOf(':')) {
      // IPv6 host contains multiple colons - but no port
      // this notation is actually not allowed by RFC 3986, but we're a liberal parser
      parts.hostname = string.substring(0, pos) || null;
      parts.port = null;
    } else {
      t = string.substring(0, pos).split(':');
      parts.hostname = t[0] || null;
      parts.port = t[1] || null;
    }
    if (parts.hostname && string.substring(pos)[0] !== '/') {
      pos++;
      string = "/" + string;
    }
    return string.substring(pos) || '/';
  };
  URI.parseAuthority = function(string, parts) {
    string = URI.parseUserinfo(string, parts);
    return URI.parseHost(string, parts);
  };
  URI.parseUserinfo = function(string, parts) {
    // extract username:password
    var pos = string.indexOf('@');
    var firstSlash = string.indexOf('/');
    var t;
    // authority@ must come before /path
    if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
      t = string.substring(0, pos).split(':');
      parts.username = t[0] ? URI.decode(t[0]) : null;
      t.shift();
      parts.password = t[0] ? URI.decode(t.join(':')) : null;
      string = string.substring(pos + 1);
    } else {
      parts.username = null;
      parts.password = null;
    }
    return string;
  };
  URI.parseQuery = function(string) {
    if (!string) {
      return {};
    }
    // throw out the funky business - "?"[name"="value"&"]+
    string = string.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '');
    if (!string) {
      return {};
    }
    var items = {};
    var splits = string.split('&');
    var length = splits.length;
    var v, name, value;
    for (var i = 0; i < length; i++) {
      v = splits[i].split('=');
      name = URI.decodeQuery(v.shift());
      // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters
      value = v.length ? URI.decodeQuery(v.join('=')) : null;
      if (items[name]) {
        if (typeof items[name] === "string") {
          items[name] = [items[name]];
        }
        items[name].push(value);
      } else {
        items[name] = value;
      }
    }
    return items;
  };
  URI.build = function(parts) {
    var t = "";
    if (parts.protocol) {
      t += parts.protocol + ":";
    }
    if (!parts.urn && (t || parts.hostname)) {
      t += '//';
    }
    t += (URI.buildAuthority(parts) || '');
    if (typeof parts.path === "string") {
      if (parts.path[0] !== '/' && typeof parts.hostname === "string") {
        t += '/';
      }
      t += parts.path;
    }
    if (typeof parts.query === "string" && parts.query) {
      t += '?' + parts.query;
    }
    if (typeof parts.fragment === "string" && parts.fragment) {
      t += '#' + parts.fragment;
    }
    return t;
  };
  URI.buildHost = function(parts) {
    var t = "";
    if (!parts.hostname) {
      return "";
    } else if (URI.ip6_expression.test(parts.hostname)) {
      if (parts.port) {
        t += "[" + parts.hostname + "]:" + parts.port;
      } else {
        // don't know if we should always wrap IPv6 in []
        // the RFC explicitly says SHOULD, not MUST.
        t += parts.hostname;
      }
    } else {
      t += parts.hostname;
      if (parts.port) {
        t += ':' + parts.port;
      }
    }
    return t;
  };
  URI.buildAuthority = function(parts) {
    return URI.buildUserinfo(parts) + URI.buildHost(parts);
  };
  URI.buildUserinfo = function(parts) {
    var t = "";
    if (parts.username) {
      t += URI.encode(parts.username);
      if (parts.password) {
        t += ':' + URI.encode(parts.password);
      }
      t += "@";
    }
    return t;
  };
  URI.buildQuery = function(data, duplicates) {
    // according to http://tools.ietf.org/html/rfc3986 or http://labs.apache.org/webarch/uri/rfc/rfc3986.html
    // being »-._~!$&'()*+,;=:@/?« %HEX and alnum are allowed
    // the RFC explicitly states ?/foo being a valid use case, no mention of parameter syntax!
    // URI.js treats the query string as being application/x-www-form-urlencoded
    // see http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type
    var t = "";
    var unique, key, i, length;
    for (key in data) {
      if (hasOwn.call(data, key) && key) {
        if (isArray(data[key])) {
          unique = {};
          for (i = 0, length = data[key].length; i < length; i++) {
            if (data[key][i] !== undefined && unique[data[key][i] + ""] === undefined) {
              t += "&" + URI.buildQueryParameter(key, data[key][i]);
              if (duplicates !== true) {
                unique[data[key][i] + ""] = true;
              }
            }
          }
        } else if (data[key] !== undefined) {
          t += '&' + URI.buildQueryParameter(key, data[key]);
        }
      }
    }
    return t.substring(1);
  };
  URI.buildQueryParameter = function(name, value) {
    // http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type -- application/x-www-form-urlencoded
    // don't append "=" for null values, according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#url-parameter-serialization
    return URI.encodeQuery(name) + (value !== null ? "=" + URI.encodeQuery(value) : "");
  };
  URI.addQuery = function(data, name, value) {
    if (typeof name === "object") {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          URI.addQuery(data, key, name[key]);
        }
      }
    } else if (typeof name === "string") {
      if (data[name] === undefined) {
        data[name] = value;
        return;
      } else if (typeof data[name] === "string") {
        data[name] = [data[name]];
      }
      if (!isArray(value)) {
        value = [value];
      }
      data[name] = data[name].concat(value);
    } else {
      throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
    }
  };
  URI.removeQuery = function(data, name, value) {
    var i, length, key;
    if (isArray(name)) {
      for (i = 0, length = name.length; i < length; i++) {
        data[name[i]] = undefined;
      }
    } else if (typeof name === "object") {
      for (key in name) {
        if (hasOwn.call(name, key)) {
          URI.removeQuery(data, key, name[key]);
        }
      }
    } else if (typeof name === "string") {
      if (value !== undefined) {
        if (data[name] === value) {
          data[name] = undefined;
        } else if (isArray(data[name])) {
          data[name] = filterArrayValues(data[name], value);
        }
      } else {
        data[name] = undefined;
      }
    } else {
      throw new TypeError("URI.addQuery() accepts an object, string as the first parameter");
    }
  };
  URI.commonPath = function(one, two) {
    var length = Math.min(one.length, two.length);
    var pos;
    // find first non-matching character
    for (pos = 0; pos < length; pos++) {
      if (one[pos] !== two[pos]) {
        pos--;
        break;
      }
    }
    if (pos < 1) {
      return one[0] === two[0] && one[0] === '/' ? '/' : '';
    }
    // revert to last /
    if (one[pos] !== '/') {
      pos = one.substring(0, pos).lastIndexOf('/');
    }
    return one.substring(0, pos + 1);
  };
  URI.withinString = function(string, callback) {
    // expression used is "gruber revised" (@gruber v2) determined to be the best solution in
    // a regex sprint we did a couple of ages ago at
    // * http://mathiasbynens.be/demo/url-regex
    // * http://rodneyrehm.de/t/url-regex.html
    return string.replace(URI.find_uri_expression, callback);
  };
  URI.ensureValidHostname = function(v) {
    // Theoretically URIs allow percent-encoding in Hostnames (according to RFC 3986)
    // they are not part of DNS and therefore ignored by URI.js
    if (v.match(URI.invalid_hostname_characters)) {
      // test punycode
      if (!punycode) {
        throw new TypeError("Hostname '" + v + "' contains characters other than [A-Z0-9.-] and Punycode.js is not available");
      }
      if (punycode.toASCII(v).match(URI.invalid_hostname_characters)) {
        throw new TypeError("Hostname '" + v + "' contains characters other than [A-Z0-9.-]");
      }
    }
  };
  p.build = function(deferBuild) {
    if (deferBuild === true) {
      this._deferred_build = true;
    } else if (deferBuild === undefined || this._deferred_build) {
      this._string = URI.build(this._parts);
      this._deferred_build = false;
    }
    return this;
  };
  p.clone = function() {
    return new URI(this);
  };
  p.valueOf = p.toString = function() {
    return this.build(false)._string;
  };
  // generate simple accessors
  _parts = {
    protocol: 'protocol',
    username: 'username',
    password: 'password',
    hostname: 'hostname',
    port: 'port'
  };
  generateAccessor = function(_part) {
    return function(v, build) {
      if (v === undefined) {
        return this._parts[_part] || "";
      } else {
        this._parts[_part] = v;
        this.build(!build);
        return this;
      }
    };
  };
  for (_part in _parts) {
    p[_part] = generateAccessor(_parts[_part]);
  }
  // generate accessors with optionally prefixed input
  _parts = {
    query: '?',
    fragment: '#'
  };
  generateAccessor = function(_part, _key) {
    return function(v, build) {
      if (v === undefined) {
        return this._parts[_part] || "";
      } else {
        if (v !== null) {
          v = v + "";
          if (v[0] === _key) {
            v = v.substring(1);
          }
        }
        this._parts[_part] = v;
        this.build(!build);
        return this;
      }
    };
  };
  for (_part in _parts) {
    p[_part] = generateAccessor(_part, _parts[_part]);
  }
  // generate accessors with prefixed output
  _parts = {
    search: ['?', 'query'],
    hash: ['#', 'fragment']
  };
  generateAccessor = function(_part, _key) {
    return function(v, build) {
      var t = this[_part](v, build);
      return typeof t === "string" && t.length ? (_key + t) : t;
    };
  };
  for (_part in _parts) {
    p[_part] = generateAccessor(_parts[_part][1], _parts[_part][0]);
  }
  p.pathname = function(v, build) {
    if (v === undefined || v === true) {
      var res = this._parts.path || (this._parts.urn ? '' : '/');
      return v ? URI.decodePath(res) : res;
    } else {
      this._parts.path = v ? URI.recodePath(v) : "/";
      this.build(!build);
      return this;
    }
  };
  p.path = p.pathname;
  p.href = function(href, build) {
    var key;
    if (href === undefined) {
      return this.toString();
    }
    this._string = "";
    this._parts = URI._parts();
    var _URI = href instanceof URI;
    var _object = typeof href === "object" && (href.hostname || href.path);
    // window.location is reported to be an object, but it's not the sort
    // of object we're looking for: 
    // * location.protocol ends with a colon
    // * location.query != object.search
    // * location.hash != object.fragment
    // simply serializing the unknown object should do the trick 
    // (for location, not for everything...)
    if (!_URI && _object && Object.prototype.toString.call(href) !== "[object Object]") {
      href = href.toString();
    }
    if (typeof href === "string") {
      this._parts = URI.parse(href, this._parts);
    } else if (_URI || _object) {
      var src = _URI ? href._parts : href;
      for (key in src) {
        if (hasOwn.call(this._parts, key)) {
          this._parts[key] = src[key];
        }
      }
    } else {
      throw new TypeError("invalid input");
    }
    this.build(!build);
    return this;
  };
  // identification accessors
  p.is = function(what) {
    var ip = false;
    var ip4 = false;
    var ip6 = false;
    var name = false;
    var sld = false;
    var idn = false;
    var punycode = false;
    var relative = !this._parts.urn;
    if (this._parts.hostname) {
      relative = false;
      ip4 = URI.ip4_expression.test(this._parts.hostname);
      ip6 = URI.ip6_expression.test(this._parts.hostname);
      ip = ip4 || ip6;
      name = !ip;
      sld = name && SLD && SLD.has(this._parts.hostname);
      idn = name && URI.idn_expression.test(this._parts.hostname);
      punycode = name && URI.punycode_expression.test(this._parts.hostname);
    }
    switch (what.toLowerCase()) {
    case 'relative':
      return relative;
    case 'absolute':
      return !relative;
      // hostname identification
    case 'domain':
    case 'name':
      return name;
    case 'sld':
      return sld;
    case 'ip':
      return ip;
    case 'ip4':
    case 'ipv4':
    case 'inet4':
      return ip4;
    case 'ip6':
    case 'ipv6':
    case 'inet6':
      return ip6;
    case 'idn':
      return idn;
    case 'url':
      return !this._parts.urn;
    case 'urn':
      return !!this._parts.urn;
    case 'punycode':
      return punycode;
    }
    return null;
  };
  // component specific input validation
  var _protocol = p.protocol;
  var _port = p.port;
  var _hostname = p.hostname;
  p.protocol = function(v, build) {
    if (v !== undefined) {
      if (v) {
        // accept trailing ://
        v = v.replace(/:(\/\/)?$/, '');
        if (v.match(/[^a-zA-z0-9\.+-]/)) {
          throw new TypeError("Protocol '" + v + "' contains characters other than [A-Z0-9.+-]");
        }
      }
    }
    return _protocol.call(this, v, build);
  };
  p.scheme = p.protocol;
  p.port = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }
    if (v !== undefined) {
      if (v === 0) {
        v = null;
      }
      if (v) {
        v += "";
        if (v[0] === ":") {
          v = v.substring(1);
        }
        if (v.match(/[^0-9]/)) {
          throw new TypeError("Port '" + v + "' contains characters other than [0-9]");
        }
      }
    }
    return _port.call(this, v, build);
  };
  p.hostname = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }
    if (v !== undefined) {
      var x = {};
      URI.parseHost(v, x);
      v = x.hostname;
    }
    return _hostname.call(this, v, build);
  };
  // compound accessors
  p.host = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }
    if (v === undefined) {
      return this._parts.hostname ? URI.buildHost(this._parts) : "";
    } else {
      URI.parseHost(v, this._parts);
      this.build(!build);
      return this;
    }
  };
  p.authority = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }
    if (v === undefined) {
      return this._parts.hostname ? URI.buildAuthority(this._parts) : "";
    } else {
      URI.parseAuthority(v, this._parts);
      this.build(!build);
      return this;
    }
  };
  p.userinfo = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }
    if (v === undefined) {
      if (!this._parts.username) {
        return "";
      }
      var t = URI.buildUserinfo(this._parts);
      return t.substring(0, t.length - 1);
    } else {
      if (v[v.length - 1] !== '@') {
        v += '@';
      }
      URI.parseUserinfo(v, this._parts);
      this.build(!build);
      return this;
    }
  };
  p.resource = function(v, build) {
    var parts;
    if (v === undefined) {
      return this.path() + this.search() + this.hash();
    }
    parts = URI.parse(v);
    this._parts.path = parts.path;
    this._parts.query = parts.query;
    this._parts.fragment = parts.fragment;
    this.build(!build);
    return this;
  };
  // fraction accessors
  p.subdomain = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }
    // convenience, return "www" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return "";
      }
      // grab domain and add another segment
      var end = this._parts.hostname.length - this.domain().length - 1;
      return this._parts.hostname.substring(0, end) || "";
    } else {
      var e = this._parts.hostname.length - this.domain().length;
      var sub = this._parts.hostname.substring(0, e);
      var replace = new RegExp('^' + escapeRegEx(sub));
      if (v && v[v.length - 1] !== '.') {
        v += ".";
      }
      if (v) {
        URI.ensureValidHostname(v);
      }
      this._parts.hostname = this._parts.hostname.replace(replace, v);
      this.build(!build);
      return this;
    }
  };
  p.domain = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }
    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    }
    // convenience, return "example.org" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return "";
      }
      // if hostname consists of 1 or 2 segments, it must be the domain
      var t = this._parts.hostname.match(/\./g);
      if (t && t.length < 2) {
        return this._parts.hostname;
      }
      // grab tld and add another segment
      var end = this._parts.hostname.length - this.tld(build).length - 1;
      end = this._parts.hostname.lastIndexOf('.', end - 1) + 1;
      return this._parts.hostname.substring(end) || "";
    } else {
      if (!v) {
        throw new TypeError("cannot set domain empty");
      }
      URI.ensureValidHostname(v);
      if (!this._parts.hostname || this.is('IP')) {
        this._parts.hostname = v;
      } else {
        var replace = new RegExp(escapeRegEx(this.domain()) + "$");
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }
      this.build(!build);
      return this;
    }
  };
  p.tld = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }
    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    }
    // return "org" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return "";
      }
      var pos = this._parts.hostname.lastIndexOf('.');
      var tld = this._parts.hostname.substring(pos + 1);
      if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
        return SLD.get(this._parts.hostname) || tld;
      }
      return tld;
    } else {
      var replace;
      if (!v) {
        throw new TypeError("cannot set TLD empty");
      } else if (v.match(/[^a-zA-Z0-9-]/)) {
        if (SLD && SLD.is(v)) {
          replace = new RegExp(escapeRegEx(this.tld()) + "$");
          this._parts.hostname = this._parts.hostname.replace(replace, v);
        } else {
          throw new TypeError("TLD '" + v + "' contains characters other than [A-Z0-9]");
        }
      } else if (!this._parts.hostname || this.is('IP')) {
        throw new ReferenceError("cannot set TLD on non-domain host");
      } else {
        replace = new RegExp(escapeRegEx(this.tld()) + "$");
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }
      this.build(!build);
      return this;
    }
  };
  p.directory = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }
    if (v === undefined || v === true) {
      if (!this._parts.path && !this._parts.hostname) {
        return '';
      }
      if (this._parts.path === '/') {
        return '/';
      }
      var end = this._parts.path.length - this.filename().length - 1;
      var res = this._parts.path.substring(0, end) || (this._parts.hostname ? "/" : "");
      return v ? URI.decodePath(res) : res;
    } else {
      var e = this._parts.path.length - this.filename().length;
      var directory = this._parts.path.substring(0, e);
      var replace = new RegExp('^' + escapeRegEx(directory));
      // fully qualifier directories begin with a slash
      if (!this.is('relative')) {
        if (!v) {
          v = '/';
        }
        if (v[0] !== '/') {
          v = "/" + v;
        }
      }
      // directories always end with a slash
      if (v && v[v.length - 1] !== '/') {
        v += '/';
      }
      v = URI.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);
      this.build(!build);
      return this;
    }
  };
  p.filename = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }
    if (v === undefined || v === true) {
      if (!this._parts.path || this._parts.path === '/') {
        return "";
      }
      var pos = this._parts.path.lastIndexOf('/');
      var res = this._parts.path.substring(pos + 1);
      return v ? URI.decodePathSegment(res) : res;
    } else {
      var mutatedDirectory = false;
      if (v[0] === '/') {
        v = v.substring(1);
      }
      if (v.match(/\.?\//)) {
        mutatedDirectory = true;
      }
      var replace = new RegExp(escapeRegEx(this.filename()) + "$");
      v = URI.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);
      if (mutatedDirectory) {
        this.normalizePath(build);
      } else {
        this.build(!build);
      }
      return this;
    }
  };
  p.suffix = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }
    if (v === undefined || v === true) {
      if (!this._parts.path || this._parts.path === '/') {
        return "";
      }
      var filename = this.filename();
      var pos = filename.lastIndexOf('.');
      var s, res;
      if (pos === -1) {
        return "";
      }
      // suffix may only contain alnum characters (yup, I made this up.)
      s = filename.substring(pos + 1);
      res = (/^[a-z0-9%]+$/i).test(s) ? s : "";
      return v ? URI.decodePathSegment(res) : res;
    } else {
      if (v[0] === '.') {
        v = v.substring(1);
      }
      var suffix = this.suffix();
      var replace;
      if (!suffix) {
        if (!v) {
          return this;
        }
        this._parts.path += '.' + URI.recodePath(v);
      } else if (!v) {
        replace = new RegExp(escapeRegEx("." + suffix) + "$");
      } else {
        replace = new RegExp(escapeRegEx(suffix) + "$");
      }
      if (replace) {
        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);
      }
      this.build(!build);
      return this;
    }
  };
  p.segment = function(segment, v, build) {
    var separator = this._parts.urn ? ':' : '/';
    var path = this.path();
    var absolute = path.substring(0, 1) === '/';
    var segments = path.split(separator);
    if (typeof segment !== 'number') {
      build = v;
      v = segment;
      segment = undefined;
    }
    if (segment !== undefined && typeof segment !== 'number') {
      throw new Error("Bad segment '" + segment + "', must be 0-based integer");
    }
    if (absolute) {
      segments.shift();
    }
    if (segment < 0) {
      // allow negative indexes to address from the end
      segment = Math.max(segments.length + segment, 0);
    }
    if (v === undefined) {
      return segment === undefined ? segments : segments[segment];
    } else if (segment === null || segments[segment] === undefined) {
      if (isArray(v)) {
        segments = v;
      } else if (v || (typeof v === "string" && v.length)) {
        if (segments[segments.length - 1] === "") {
          // empty trailing elements have to be overwritten
          // to prefent results such as /foo//bar
          segments[segments.length - 1] = v;
        } else {
          segments.push(v);
        }
      }
    } else {
      if (v || (typeof v === "string" && v.length)) {
        segments[segment] = v;
      } else {
        segments.splice(segment, 1);
      }
    }
    if (absolute) {
      segments.unshift("");
    }
    return this.path(segments.join(separator), build);
  };
  // mutating query string
  var q = p.query;
  p.query = function(v, build) {
    if (v === true) {
      return URI.parseQuery(this._parts.query);
    } else if (v !== undefined && typeof v !== "string") {
      this._parts.query = URI.buildQuery(v, this._parts.duplicateQueryParameters);
      this.build(!build);
      return this;
    } else {
      return q.call(this, v, build);
    }
  };
  p.addQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query);
    URI.addQuery(data, name, value === undefined ? null : value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters);
    if (typeof name !== "string") {
      build = value;
    }
    this.build(!build);
    return this;
  };
  p.removeQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query);
    URI.removeQuery(data, name, value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters);
    if (typeof name !== "string") {
      build = value;
    }
    this.build(!build);
    return this;
  };
  p.addSearch = p.addQuery;
  p.removeSearch = p.removeQuery;
  // sanitizing URLs
  p.normalize = function() {
    if (this._parts.urn) {
      return this.normalizeProtocol(false).normalizeQuery(false).normalizeFragment(false).build();
    }
    return this.normalizeProtocol(false).normalizeHostname(false).normalizePort(false).normalizePath(false).normalizeQuery(false).normalizeFragment(false).build();
  };
  p.normalizeProtocol = function(build) {
    if (typeof this._parts.protocol === "string") {
      this._parts.protocol = this._parts.protocol.toLowerCase();
      this.build(!build);
    }
    return this;
  };
  p.normalizeHostname = function(build) {
    if (this._parts.hostname) {
      if (this.is('IDN') && punycode) {
        this._parts.hostname = punycode.toASCII(this._parts.hostname);
      } else if (this.is('IPv6') && IPv6) {
        this._parts.hostname = IPv6.best(this._parts.hostname);
      }
      this._parts.hostname = this._parts.hostname.toLowerCase();
      this.build(!build);
    }
    return this;
  };
  p.normalizePort = function(build) {
    // remove port of it's the protocol's default
    if (typeof this._parts.protocol === "string" && this._parts.port === URI.defaultPorts[this._parts.protocol]) {
      this._parts.port = null;
      this.build(!build);
    }
    return this;
  };
  p.normalizePath = function(build) {
    if (this._parts.urn) {
      return this;
    }
    if (!this._parts.path || this._parts.path === '/') {
      return this;
    }
    var _was_relative;
    var _was_relative_prefix;
    var _path = this._parts.path;
    var _parent, _pos;
    // handle relative paths
    if (_path[0] !== '/') {
      if (_path[0] === '.') {
        _was_relative_prefix = _path.substring(0, _path.indexOf('/'));
      }
      _was_relative = true;
      _path = '/' + _path;
    }
    // resolve simples
    _path = _path.replace(/(\/(\.\/)+)|\/{2,}/g, '/');
    // resolve parents
    while (true) {
      _parent = _path.indexOf('/../');
      if (_parent === -1) {
        // no more ../ to resolve
        break;
      } else if (_parent === 0) {
        // top level cannot be relative...
        _path = _path.substring(3);
        break;
      }
      _pos = _path.substring(0, _parent).lastIndexOf('/');
      if (_pos === -1) {
        _pos = _parent;
      }
      _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
    }
    // revert to relative
    if (_was_relative && this.is('relative')) {
      if (_was_relative_prefix) {
        _path = _was_relative_prefix + _path;
      } else {
        _path = _path.substring(1);
      }
    }
    _path = URI.recodePath(_path);
    this._parts.path = _path;
    this.build(!build);
    return this;
  };
  p.normalizePathname = p.normalizePath;
  p.normalizeQuery = function(build) {
    if (typeof this._parts.query === "string") {
      if (!this._parts.query.length) {
        this._parts.query = null;
      } else {
        this.query(URI.parseQuery(this._parts.query));
      }
      this.build(!build);
    }
    return this;
  };
  p.normalizeFragment = function(build) {
    if (!this._parts.fragment) {
      this._parts.fragment = null;
      this.build(!build);
    }
    return this;
  };
  p.normalizeSearch = p.normalizeQuery;
  p.normalizeHash = p.normalizeFragment;
  p.iso8859 = function() {
    // expect unicode input, iso8859 output
    var e = URI.encode;
    var d = URI.decode;
    URI.encode = escape;
    URI.decode = decodeURIComponent;
    this.normalize();
    URI.encode = e;
    URI.decode = d;
    return this;
  };
  p.unicode = function() {
    // expect iso8859 input, unicode output
    var e = URI.encode;
    var d = URI.decode;
    URI.encode = strictEncodeURIComponent;
    URI.decode = unescape;
    this.normalize();
    URI.encode = e;
    URI.decode = d;
    return this;
  };
  p.readable = function() {
    var uri = this.clone();
    // removing username, password, because they shouldn't be displayed according to RFC 3986
    uri.username("").password("").normalize();
    var t = '';
    if (uri._parts.protocol) {
      t += uri._parts.protocol + '://';
    }
    if (uri._parts.hostname) {
      if (uri.is('punycode') && punycode) {
        t += punycode.toUnicode(uri._parts.hostname);
        if (uri._parts.port) {
          t += ":" + uri._parts.port;
        }
      } else {
        t += uri.host();
      }
    }
    if (uri._parts.hostname && uri._parts.path && uri._parts.path[0] !== '/') {
      t += '/';
    }
    t += uri.path(true);
    if (uri._parts.query) {
      var q = '';
      for (var i = 0, qp = uri._parts.query.split('&'), l = qp.length; i < l; i++) {
        var kv = (qp[i] || "").split('=');
        q += '&' + URI.decodeQuery(kv[0]).replace(/&/g, '%26');
        if (kv[1] !== undefined) {
          q += "=" + URI.decodeQuery(kv[1]).replace(/&/g, '%26');
        }
      }
      t += '?' + q.substring(1);
    }
    t += uri.hash();
    return t;
  };
  // resolving relative and absolute URLs
  p.absoluteTo = function(base) {
    var resolved = this.clone();
    var properties = ['protocol', 'username', 'password', 'hostname', 'port'];
    var basedir, i, p;
    if (this._parts.urn) {
      throw new Error('URNs do not have any generally defined hierachical components');
    }
    if (this._parts.hostname) {
      return resolved;
    }
    if (!(base instanceof URI)) {
      base = new URI(base);
    }
    for (i = 0, p; p = properties[i]; i++) {
      resolved._parts[p] = base._parts[p];
    }
    properties = ['query', 'path'];
    for (i = 0, p; p = properties[i]; i++) {
      if (!resolved._parts[p] && base._parts[p]) {
        resolved._parts[p] = base._parts[p];
      }
    }
    if (resolved.path()[0] !== '/') {
      basedir = base.directory();
      resolved._parts.path = (basedir ? (basedir + '/') : '') + resolved._parts.path;
      resolved.normalizePath();
    }
    resolved.build();
    return resolved;
  };
  p.relativeTo = function(base) {
    var relative = this.clone();
    var properties = ['protocol', 'username', 'password', 'hostname', 'port'];
    var common, _base, _this, _base_diff, _this_diff;
    if (this._parts.urn) {
      throw new Error('URNs do not have any generally defined hierachical components');
    }
    if (!(base instanceof URI)) {
      base = new URI(base);
    }
    if (this.path()[0] !== '/' || base.path()[0] !== '/') {
      throw new Error('Cannot calculate common path from non-relative URLs');
    }
    // determine common sub path
    common = URI.commonPath(relative.path(), base.path());
    // no relation if there's nothing in common 
    if (!common || common === '/') {
      return relative;
    }
    // relative paths don't have authority
    for (var i = 0, p; p = properties[i]; i++) {
      relative._parts[p] = null;
    }
    _base = base.directory();
    _this = this.directory();
    // base and this are on the same level
    if (_base === _this) {
      relative._parts.path = './' + relative.filename();
      return relative.build();
    }
    _base_diff = _base.substring(common.length);
    _this_diff = _this.substring(common.length);
    // this is a descendant of base
    if (_base + '/' === common) {
      if (_this_diff) {
        _this_diff += '/';
      }
      relative._parts.path = './' + _this_diff + relative.filename();
      return relative.build();
    }
    // this is a descendant of base
    var parents = '../';
    var _common = new RegExp('^' + escapeRegEx(common));
    var _parents = _base.replace(_common, '/').match(/\//g).length - 1;
    while (_parents--) {
      parents += '../';
    }
    relative._parts.path = relative._parts.path.replace(_common, parents);
    return relative.build();
  };
  // comparing URIs
  p.equals = function(uri) {
    var one = this.clone();
    var two = new URI(uri);
    var one_map = {};
    var two_map = {};
    var checked = {};
    var one_query, two_query, key;
    one.normalize();
    two.normalize();
    // exact match
    if (one.toString() === two.toString()) {
      return true;
    }
    // extract query string
    one_query = one.query();
    two_query = two.query();
    one.query("");
    two.query("");
    // definitely not equal if not even non-query parts match
    if (one.toString() !== two.toString()) {
      return false;
    }
    // query parameters have the same length, even if they're permutated
    if (one_query.length !== two_query.length) {
      return false;
    }
    one_map = URI.parseQuery(one_query);
    two_map = URI.parseQuery(two_query);
    for (key in one_map) {
      if (hasOwn.call(one_map, key)) {
        if (!isArray(one_map[key])) {
          if (one_map[key] !== two_map[key]) {
            return false;
          }
        } else {
          if (!isArray(two_map[key])) {
            return false;
          }
          // arrays can't be equal if they have different amount of content
          if (one_map[key].length !== two_map[key].length) {
            return false;
          }
          one_map[key].sort();
          two_map[key].sort();
          for (var i = 0, l = one_map[key].length; i < l; i++) {
            if (one_map[key][i] !== two_map[key][i]) {
              return false;
            }
          }
        }
        checked[key] = true;
      }
    }
    for (key in two_map) {
      if (hasOwn.call(two_map, key)) {
        if (!checked[key]) {
          // two contains a parameter not present in one
          return false;
        }
      }
    }
    return true;
  };
  // state
  p.duplicateQueryParameters = function(v) {
    this._parts.duplicateQueryParameters = !! v;
    return this;
  };
  return URI;
}));