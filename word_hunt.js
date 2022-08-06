var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.findInternal = function (a, b, c) {
  a instanceof String && (a = String(a));
  for (var e = a.length, f = 0; f < e; f++) {
    var p = a[f];
    if (b.call(c, p, f, a)) return { i: f, v: p };
  }
  return { i: -1, v: void 0 };
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty =
  $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
    ? Object.defineProperty
    : function (a, b, c) {
        if (a == Array.prototype || a == Object.prototype) return a;
        a[b] = c.value;
        return a;
      };
$jscomp.getGlobal = function (a) {
  a = [
    "object" == typeof globalThis && globalThis,
    a,
    "object" == typeof window && window,
    "object" == typeof self && self,
    "object" == typeof global && global,
  ];
  for (var b = 0; b < a.length; ++b) {
    var c = a[b];
    if (c && c.Math == Math) return c;
  }
  throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE =
  "function" === typeof Symbol && "symbol" === typeof Symbol("x");

$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function (a, b) {
  var c = $jscomp.propertyToPolyfillSymbol[b];
  if (null == c) return a[b];
  c = a[c];
  return void 0 !== c ? c : a[b];
};
$jscomp.polyfill = function (a, b, c, e) {
  b &&
    ($jscomp.ISOLATE_POLYFILLS
      ? $jscomp.polyfillIsolated(a, b, c, e)
      : $jscomp.polyfillUnisolated(a, b, c, e));
};
$jscomp.polyfillUnisolated = function (a, b, c, e) {
  c = $jscomp.global;
  a = a.split(".");
  for (e = 0; e < a.length - 1; e++) {
    var f = a[e];
    if (!(f in c)) return;
    c = c[f];
  }
  a = a[a.length - 1];
  e = c[a];
  b = b(e);
  b != e &&
    null != b &&
    $jscomp.defineProperty(c, a, { configurable: !0, writable: !0, value: b });
};
$jscomp.polyfillIsolated = function (a, b, c, e) {
  var f = a.split(".");
  a = 1 === f.length;
  e = f[0];
  e = !a && e in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var p = 0; p < f.length - 1; p++) {
    var m = f[p];
    if (!(m in e)) return;
    e = e[m];
  }
  f = f[f.length - 1];
  c = $jscomp.IS_SYMBOL_NATIVE && "es6" === c ? e[f] : null;
  b = b(c);
  null != b &&
    (a
      ? $jscomp.defineProperty($jscomp.polyfills, f, {
          configurable: !0,
          writable: !0,
          value: b,
        })
      : b !== c &&
        (void 0 === $jscomp.propertyToPolyfillSymbol[f] &&
          ((c = (1e9 * Math.random()) >>> 0),
          ($jscomp.propertyToPolyfillSymbol[f] = $jscomp.IS_SYMBOL_NATIVE
            ? $jscomp.global.Symbol(f)
            : $jscomp.POLYFILL_PREFIX + c + "$" + f)),
        $jscomp.defineProperty(e, $jscomp.propertyToPolyfillSymbol[f], {
          configurable: !0,
          writable: !0,
          value: b,
        })));
};
$jscomp.polyfill(
  "Array.prototype.find",
  function (a) {
    return a
      ? a
      : function (b, c) {
          return $jscomp.findInternal(this, b, c).v;
        };
  },
  "es6",
  "es3"
);

$jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = !1;
$jscomp.ES6_CONFORMANCE =
  $jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS
$jscomp.arrayIteratorImpl = function (a) {
  var b = 0;
  return function () {
    return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
  };
};
$jscomp.arrayIterator = function (a) {
  return { next: $jscomp.arrayIteratorImpl(a) };
};
$jscomp.initSymbol = function () {};
$jscomp.polyfill(
  "Symbol",
  function (a) {
    if (a) return a;
    var b = function (p, m) {
      this.$jscomp$symbol$id_ = p;
      $jscomp.defineProperty(this, "description", {
        configurable: !0,
        writable: !0,
        value: m,
      });
    };
    b.prototype.toString = function () {
      return this.$jscomp$symbol$id_;
    };
    var c = "jscomp_symbol_" + ((1e9 * Math.random()) >>> 0) + "_",
      e = 0,
      f = function (p) {
        if (this instanceof f)
          throw new TypeError("Symbol is not a constructor");
        return new b(c + (p || "") + "_" + e++, p);
      };
    return f;
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Symbola.iterator",
  function (a) {
    if (a) return a;
    a = Symbol("Symbol.iterator");
    for (var b =
          "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(
            " "
          ),
        c = 0;
      c < b.length;
      c++
    ) {
      var e = $jscomp.global[b[c]];
      "function" === typeof e &&
        "function" != typeof e.prototype[a] &&
        $jscomp.defineProperty(e.prototype, a, {
          configurable: !0,
          writable: !0,
          value: function () {
            return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
          },
        });
    }
    return a;
  },
  "es6",
  "es3"
);
$jscomp.iteratorPrototype = function (a) {
  a = { next: a };
  a[Symbol.iterator] = function () {
    return this;
  };
  return a;
};
$jscomp.makeIterator = function (a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  return b ? b.call(a) : $jscomp.arrayIterator(a);
};
$jscomp.owns = function (a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
};
$jscomp.polyfill(
  "WeakMap",
  function (a) {
    function b() {
      if (!a || !Object.seal) return !1;
      try {
        var g = Object.seal({}),
          k = Object.seal({}),
          q = new a([
            [g, 2],
            [k, 3],
          ]);
        if (2 != q.get(g) || 3 != q.get(k)) return !1;
        q.delete(g);
        q.set(k, 4);
        return !q.has(g) && 4 == q.get(k);
      } catch (x) {
        return !1;
      }
    }
    function c() {}
    function e(g) {
      var k = typeof g;
      return ("object" === k && null !== g) || "function" === k;
    }
    function f(g) {
      if (!$jscomp.owns(g, m)) {
        var k = new c();
        $jscomp.defineProperty(g, m, { value: k });
      }
    }
    function p(g) {
      if (!$jscomp.ISOLATE_POLYFILLS) {
        var k = Object[g];
        k &&
          (Object[g] = function (q) {
            if (q instanceof c) return q;
            Object.isExtensible(q) && f(q);
            return k(q);
          });
      }
    }
    if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
      if (a && $jscomp.ES6_CONFORMANCE) return a;
    } else if (b()) return a;
    var m = "$jscomp_hidden_" + Math.random();
    p("freeze");
    p("preventExtensions");
    p("seal");
    var v = 0,
      l = function (g) {
        this.id_ = (v += Math.random() + 1).toString();
        if (g) {
          g = $jscomp.makeIterator(g);
          for (var k; !(k = g.next()).done; )
            (k = k.value), this.set(k[0], k[1]);
        }
      };
    l.prototype.set = function (g, k) {
      if (!e(g)) throw Error("Invalid WeakMap key");
      f(g);
      if (!$jscomp.owns(g, m)) throw Error("WeakMap key fail: " + g);
      g[m][this.id_] = k;
      return this;
    };
    l.prototype.get = function (g) {
      return e(g) && $jscomp.owns(g, m) ? g[m][this.id_] : void 0;
    };
    l.prototype.has = function (g) {
      return e(g) && $jscomp.owns(g, m) && $jscomp.owns(g[m], this.id_);
    };
    l.prototype.delete = function (g) {
      return e(g) && $jscomp.owns(g, m) && $jscomp.owns(g[m], this.id_)
        ? delete g[m][this.id_]
        : !1;
    };
    return l;
  },
  "es6",
  "es3"
);
$jscomp.MapEntry = function () {};
$jscomp.polyfill(
  "Map",
  function (a) {
    function b() {
      if (
        $jscomp.ASSUME_NO_NATIVE_MAP ||
        !a ||
        "function" != typeof a ||
        !a.prototype.entries ||
        "function" != typeof Object.seal
      )
        return !1;
      try {
        var l = Object.seal({ x: 4 }),
          g = new a($jscomp.makeIterator([[l, "s"]]));
        if (
          "s" != g.get(l) ||
          1 != g.size ||
          g.get({ x: 4 }) ||
          g.set({ x: 4 }, "t") != g ||
          2 != g.size
        )
          return !1;
        var k = g.entries(),
          q = k.next();
        if (q.done || q.value[0] != l || "s" != q.value[1]) return !1;
        q = k.next();
        return q.done ||
          4 != q.value[0].x ||
          "t" != q.value[1] ||
          !k.next().done
          ? !1
          : !0;
      } catch (x) {
        return !1;
      }
    }
    if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
      if (a && $jscomp.ES6_CONFORMANCE) return a;
    } else if (b()) return a;
    var c = new WeakMap(),
      e = function (l) {
        this.data_ = {};
        this.head_ = m();
        this.size = 0;
        if (l) {
          l = $jscomp.makeIterator(l);
          for (var g; !(g = l.next()).done; )
            (g = g.value), this.set(g[0], g[1]);
        }
      };
    e.prototype.set = function (l, g) {
      l = 0 === l ? 0 : l;
      var k = f(this, l);
      k.list || (k.list = this.data_[k.id] = []);
      k.entry
        ? (k.entry.value = g)
        : ((k.entry = {
            next: this.head_,
            previous: this.head_.previous,
            head: this.head_,
            key: l,
            value: g,
          }),
          k.list.push(k.entry),
          (this.head_.previous.next = k.entry),
          (this.head_.previous = k.entry),
          this.size++);
      return this;
    };
    e.prototype.delete = function (l) {
      l = f(this, l);
      return l.entry && l.list
        ? (l.list.splice(l.index, 1),
          l.list.length || delete this.data_[l.id],
          (l.entry.previous.next = l.entry.next),
          (l.entry.next.previous = l.entry.previous),
          (l.entry.head = null),
          this.size--,
          !0)
        : !1;
    };
    e.prototype.clear = function () {
      this.data_ = {};
      this.head_ = this.head_.previous = m();
      this.size = 0;
    };
    e.prototype.has = function (l) {
      return !!f(this, l).entry;
    };
    e.prototype.get = function (l) {
      return (l = f(this, l).entry) && l.value;
    };
    e.prototype.entries = function () {
      return p(this, function (l) {
        return [l.key, l.value];
      });
    };
    e.prototype.keys = function () {
      return p(this, function (l) {
        return l.key;
      });
    };
    e.prototype.values = function () {
      return p(this, function (l) {
        return l.value;
      });
    };
    e.prototype.forEach = function (l, g) {
      for (var k = this.entries(), q; !(q = k.next()).done; )
        (q = q.value), l.call(g, q[1], q[0], this);
    };
    e.prototype[Symbol.iterator] = e.prototype.entries;
    var f = function (l, g) {
        var k = g && typeof g;
        "object" == k || "function" == k
          ? c.has(g)
            ? (k = c.get(g))
            : ((k = "" + ++v), c.set(g, k))
          : (k = "p_" + g);
        var q = l.data_[k];
        if (q && $jscomp.owns(l.data_, k))
          for (l = 0; l < q.length; l++) {
            var x = q[l];
            if ((g !== g && x.key !== x.key) || g === x.key)
              return { id: k, list: q, index: l, entry: x };
          }
        return { id: k, list: q, index: -1, entry: void 0 };
      },
      p = function (l, g) {
        var k = l.head_;
        return $jscomp.iteratorPrototype(function () {
          if (k) {
            for (; k.head != l.head_; ) k = k.previous;
            for (; k.next != k.head; )
              return (k = k.next), { done: !1, value: g(k) };
            k = null;
          }
          return { done: !0, value: void 0 };
        });
      },
      m = function () {
        var l = {};
        return (l.previous = l.next = l.head = l);
      },
      v = 0;
    return e;
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Set",
  function (a) {
    function b() {
      if (
        $jscomp.ASSUME_NO_NATIVE_SET ||
        !a ||
        "function" != typeof a ||
        !a.prototype.entries ||
        "function" != typeof Object.seal
      )
        return !1;
      try {
        var e = Object.seal({ x: 4 }),
          f = new a($jscomp.makeIterator([e]));
        if (
          !f.has(e) ||
          1 != f.size ||
          f.add(e) != f ||
          1 != f.size ||
          f.add({ x: 4 }) != f ||
          2 != f.size
        )
          return !1;
        var p = f.entries(),
          m = p.next();
        if (m.done || m.value[0] != e || m.value[1] != e) return !1;
        m = p.next();
        return m.done ||
          m.value[0] == e ||
          4 != m.value[0].x ||
          m.value[1] != m.value[0]
          ? !1
          : p.next().done;
      } catch (v) {
        return !1;
      }
    }
    if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
      if (a && $jscomp.ES6_CONFORMANCE) return a;
    } else if (b()) return a;
    var c = function (e) {
      this.map_ = new Map();
      if (e) {
        e = $jscomp.makeIterator(e);
        for (var f; !(f = e.next()).done; ) this.add(f.value);
      }
      this.size = this.map_.size;
    };
    c.prototype.add = function (e) {
      e = 0 === e ? 0 : e;
      this.map_.set(e, e);
      this.size = this.map_.size;
      return this;
    };
    c.prototype.delete = function (e) {
      e = this.map_.delete(e);
      this.size = this.map_.size;
      return e;
    };
    c.prototype.clear = function () {
      this.map_.clear();
      this.size = 0;
    };
    c.prototype.has = function (e) {
      return this.map_.has(e);
    };
    c.prototype.entries = function () {
      return this.map_.entries();
    };
    c.prototype.values = function () {
      return this.map_.values();
    };
    c.prototype.keys = c.prototype.values;
    c.prototype[Symbol.iterator] = c.prototype.values;
    c.prototype.forEach = function (e, f) {
      var p = this;
      this.map_.forEach(function (m) {
        return e.call(f, m, m, p);
      });
    };
    return c;
  },
  "es6",
  "es3"
);
$jscomp.checkStringArgs = function (a, b, c) {
  if (null == a)
    throw new TypeError(
      "The 'this' value for String.prototype." +
        c +
        " must not be null or undefined"
    );
  if (b instanceof RegExp)
    throw new TypeError(
      "First argument to String.prototype." +
        c +
        " must not be a regular expression"
    );
  return a + "";
};
$jscomp.polyfill(
  "String.prototype.endsWith",
  function (a) {
    return a
      ? a
      : function (b, c) {
          var e = $jscomp.checkStringArgs(this, b, "endsWith");
          b += "";
          void 0 === c && (c = e.length);
          c = Math.max(0, Math.min(c | 0, e.length));
          for (var f = b.length; 0 < f && 0 < c; )
            if (e[--c] != b[--f]) return !1;
          return 0 >= f;
        };
  },
  "es6",
  "es3"
);