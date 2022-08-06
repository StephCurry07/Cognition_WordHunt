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


var filter_term = "",
filter_startswith = "",
filter_relatedto = "",
filter_rhymeswith = "",
filter_soundslike = "",

filter_stresspattern = "",
filter_numberofletters = "",
filter_numberofsyllables = "",
filter_relatedto_original = "",
requested_lang = "",
full_api_query = "",
panelToStartIndex = [],
sortOrderCode = "rv1",
sortTopN = 100,
viz_mode = !1,
selected_res = null,
query_cluster_title = null,
COLORS = {
  blue: "lightblue",
  pink: "pink",
  red: "red",
  green: "lightgreen",
  yellow: "yellow",
  brown: "brown",
  orange: "orange",
  purple: "purple",
  gold: "gold",
},
MAX_TOPDEF_LENGTH_CHARS = 250,
STRESS_PATTERNS = "/ /x x/ // /xx x/x xx/ /xxx x/xx xx/x xxx/".split(" "),
SYLLABLE_COUNTS = "123456789".split(""),
LETTER_COUNTS = "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20+".split(
  " "
),
VOWEL_SOUND_PROTOTYPES =
  "a (as in ball);a (as in bat);a (as in bay);e (as in bet);e (as in bee);i (as in bit);i (as in bite);o (as in bob);o (as in boat);oo (as in book);oo (as in boo);ou (as in bout);oy (as in boy);er (as in burr);u (as in but)".split(
    ";"
  ),
resultData = [];
function getUrlVars() {
for (
  var a = [],
    b = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&"),
    c = 0;
  c < b.length;
  c++
) {
  var e = b[c].split("=");
  a.push(e[0]);
  a[e[0]] = decodeURIComponent(e[1]);
}
return a;
}
function isBot() {
return /(bot|crawler)/i.test(navigator.userAgent);
}
function is_touch_device() {
return (
  "ontouchstart" in window ||
  0 < navigator.MaxTouchPoints ||
  0 < navigator.msMaxTouchPoints
);
}
function showOrHideFilters() {
var a = areFiltersActive(),
  b = filtersAreOpen();
((a && !b) || (!a && b)) && toggleFilters();
}
function thesInit(a) {
var b = getUrlVars();
a = b[a];
var c = $("#thesinput");
clearFilters();
"undefined" != typeof b.lang
  ? (requested_lang = b.lang)
  : window.location.href.match(/\/tesauro/) && (requested_lang = "es");
beta_mode = window.location.href.match(/\/thesaurus-beta/) ? !0 : !1;
"undefined" != typeof a &&
  ((filter_term = a.replace(/[+]/gm, " ").replace(/[<>=]/gm, "")),
  "undefined" != typeof b.f_sw && (filter_startswith = b.f_sw),
  "undefined" != typeof b.f_sl && (filter_soundslike = b.f_sl),
  "undefined" != typeof b.f_nl && (filter_numberofletters = b.f_nl),
  "undefined" != typeof b.f_ns && (filter_numberofsyllables = b.f_ns),
  "undefined" != typeof b.f_rw && (filter_rhymeswith = b.f_rw),
  "undefined" != typeof b.f_stress && (filter_stresspattern = b.f_stress),
  "undefined" != typeof b.f_rt && (filter_relatedto = b.f_rt),
  "undefined" != typeof b.viz && (viz_mode = !0),
  "undefined" != typeof b.sortby &&
    ((sortOrderCode = b.sortby),
    $("#sortOrderControl").val(sortOrderCode),
    "rv1" === sortOrderCode
      ? $("#rerank_topn").hide()
      : $("#rerank_topn").show()),
  "undefined" != typeof b.sorttopn &&
    ((sortTopN = parseInt(b.sorttopn)),
    $("#sortTopNControl").val(b.sorttopn)),
  0 < c.length &&
    (currentQueryIsClusterQuery() ? c.val("") : c.val(filter_term),
    (document.title = makeTitle(filter_term)),
    c[0].focus()),
  setHelplineSpinner(),
  lookup(),
  setFilters(),
  showOrHideFilters());
"" === $("#helpline1").val() &&
  "undefined" === typeof THESAURUS_SUPPRESS_BASE_HELPLINE &&
  setHelpline("<i>" + locText("ENTER_HELP") + "</i>");
$("#tabs").hide();
$("#info").show();
$("#sortOrderControl").selectmenu({ width: 220 });
$("#sortTopNControl").selectmenu({ width: 140 });
$("#sortOrderControl").on("selectmenuchange", function () {
  sortOrderCode = this.value;
  if (currentQueryHasWildcard() || currentQueryIsClusterQuery())
    sortTopN = 1e3;
  filter_relatedto_original = filter_relatedto;
  filter_relatedto = "";
  rerank();
  "rv1" === sortOrderCode ||
  currentQueryHasWildcard() ||
  currentQueryIsClusterQuery()
    ? $("#rerank_topn").hide()
    : $("#rerank_topn").show();
});
$("#sortTopNControl").on("selectmenuchange", function () {
  sortTopN = parseInt(this.value);
  rerank();
});
$("body").click(globalOnclick);
$(document).tooltip({ show: { delay: 800 } });
}
function makeTooltip(a, b, c, e, f, p, m, v) {
var l = "",
  g = a.toLowerCase(),
  k =
    g in b
      ? THESAURUS_QUICKLINK_TEMPLATE
      : THESAURUS_QUICKLINK_TEMPLATE_NO_DEFS;
"undefined" != typeof k &&
  "" !== k &&
  (l +=
    "<div class='thes_ql'>" +
    k.replace(/%s/g, a).replace(/%o/g, makeCurrentUrl(a)) +
    "</div> ");
k = !1;
if (g in b) {
  b = b[g];
  c = c[g] ? c[g] : a;
  var q = e[g];
  null == q && (q = e[c]);
  e = format_defs(b, f, c, p[g], m[g], q, v);
  "" !== e &&
    ((l +=
      "<div class='thes_defs'>" +
      e +
      "</div><div class='dynamic-def-content'></div>"),
    (k = !0));
}
"" !== l &&
  (k ||
    (l +=
      "<div class='thes_defs'><b class='thes_ql_title'><i>" +
      a +
      "</i></b><div class='dynamic-def-content'></div></div>"));
return l;
}
function showdoc() {
$("#info").show();
for (var a = 0; 5 > a; a++) $("#zone" + a.toString()).html("");
$("#heading1").html("");
$("#heading2").html("");
}
function makeTitle(a) {
return a + ": OneLook Thesaurus";
}
function vizButtonStr(a, b) {
return (
  '<button id="vizbutton" onClick="viz_mode_' + a + '();">' + b + "</button>"
);
}
function rerank() {
panelToStartIndex = [];
layoutResults(0);
$("#rerank").append(
  '<img src="/img/0.gif?q=' + sortOrderCode + "-" + sortTopN.toString() + '">'
);
saveWindowState(!1);
}
function viz_mode_on() {
viz_mode = !0;
layoutResults(0);
$("#vizspan").html(vizButtonStr("off", locText("VIZ_BUTTON_OFF")));
saveWindowState(!0);
}
function viz_mode_off() {
viz_mode = !1;
layoutResults(0);
$("#vizspan").html(vizButtonStr("on", locText("VIZ_BUTTON_ON")));
saveWindowState(!0);
}
function click_meter_filter(a) {
filt_meter(a);
showOrHideFilters();
inputBlur($("#filter_stresspattern")[0], "Meter");
}
function addFilterHiddenParam(a, b, c) {
var e = $("#form1");
if ("undefined" != typeof e) {
  var f = $("#rzform_filt_" + a);
  "undefined" != typeof f && f.remove();
  "" !== c &&
    e.append(
      '<input id="rzform_filt_' +
        a +
        '" type="hidden" name="' +
        b +
        '" value="' +
        c +
        '">'
    );
}
}
function filt_meter(a) {
filter_stresspattern = a;
filter_numberofsyllables = "";
clearFilter("numberofsyllables", "Num. syllables");
filter_soundslike = "";
clearFilter("soundslike", "Sounds like");
$("#filter_stresspattern").val(filter_stresspattern);
getResults(!1);
}
function filt_sylcount(a) {
filter_numberofsyllables = a;
filter_soundslike = "";
clearFilter("soundslike", "Sounds like");
filter_stresspattern = "";
clearFilter("stresspattern", "Stress");
getResults(!1);
}
function filt_lettercount(a) {
filter_numberofletters = a;
getResults(!1);
}
function filt_vowels(a) {
filter_soundslike = "";
clearFilter("soundslike", "Sounds like");
filter_numberofsyllables = "";
clearFilter("numberofsyllables", "Num. syllables");
filter_stresspattern = "";
clearFilter("stresspattern", "Stress");
getResults(!1);
}
function makeCurrentUrl(a) {
urlPath = "?s=" + encodeURIComponent(filter_term);
"" !== filter_startswith &&
  (urlPath += "&f_sw=" + encodeURIComponent(filter_startswith));
null !== a
  ? (urlPath += "&f_rt=" + encodeURIComponent(a))
  : "" !== filter_relatedto &&
    (urlPath += "&f_rt=" + encodeURIComponent(filter_relatedto));
"" !== filter_rhymeswith &&
  (urlPath += "&f_rw=" + encodeURIComponent(filter_rhymeswith));
"" !== filter_soundslike &&
  (urlPath += "&f_sl=" + encodeURIComponent(filter_soundslike));
"" !== filter_stresspattern &&
  (urlPath += "&f_stress=" + encodeURIComponent(filter_stresspattern));
"" !== filter_numberofletters &&
  (urlPath += "&f_nl=" + encodeURIComponent(filter_numberofletters));
"" !== filter_numberofsyllables &&
  (urlPath += "&f_ns=" + encodeURIComponent(filter_numberofsyllables));
"rv1" !== sortOrderCode && (urlPath += "&sortby=" + sortOrderCode);
100 !== sortTopN && (urlPath += "&sorttopn=" + sortTopN.toString());
viz_mode && (urlPath += "&viz=1");
"es" === requested_lang && (urlPath += "&lang=es");
return urlPath;
}
function saveWindowState(a) {
if (!(0 >= $("#thesinput").length)) {
  var b = makeTitle(filter_term);
  if (currentQueryIsClusterQuery())
    if (query_cluster_title) b = makeTitle(query_cluster_title);
    else return;
  var c = makeCurrentUrl(null);
  try {
    a && window.history && window.history.pushState
      ? window.history.pushState({}, b, c)
      : window.history && window.history.replaceState
      ? window.history.replaceState({}, b, c)
      : (window.location.hash = c),
      (document.title = b);
  } catch (e) {}
}
}
function setHelpline(a) {
var b = $("#helpline1");
0 < b.length && b.html(a);
}
function setHelplineSpinner() {
var a = $("#helpline1");
0 < a.length && a.html('<div class="loader"></div>');
}
function areFiltersActive() {
return (
  "" !== filter_startswith ||
  ("" !== filter_relatedto && !currentQueryIsClusterQuery()) ||
  "" !== filter_rhymeswith ||
  "" !== filter_soundslike ||
  "" !== filter_numberofsyllables ||
  "" !== filter_stresspattern ||
  "" !== filter_numberofletters
);
}
function setBaseHelpline(a) {
if ("undefined" != typeof THESAURUS_SUPPRESS_BASE_HELPLINE) setHelpline(" ");
else {
  a = locText("SHOWING_1");
  areFiltersActive() && (a = locText("SHOWING_2"));
  var b = locText("SORT_" + sortOrderCode);
  if ("" !== filter_term) {
    var c = filter_term;
    hasWildcard(filter_term)
      ? setHelpline(
          "<i>" +
            a +
            " " +
            locText("SHOWING_PATTERN") +
            " <b>" +
            c +
            "</b>, " +
            locText("SHOWING_RANKED") +
            " " +
            b +
            ".</i>"
        )
      : ((c = "<b>" + c + "</b>"),
        "" !== filter_relatedto &&
          "rv1" === rankStr &&
          (b =
            locText("SHOWING_BY_SIM_TO") +
            " <b>" +
            filter_relatedto +
            "</b>"),
        setHelpline(
          "<i>" +
            a +
            " " +
            locText("SHOWING_RELATED_TO") +
            " " +
            c +
            ", " +
            locText("SHOWING_RANKED") +
            " " +
            b +
            "</b>.</i>"
        ));
  } else
    areFiltersActive() &&
      setHelpline(
        "<i>" + a + ", " + locText("SHOWING_RANKED") + " " + b + ".</i>"
      );
}
}
function prevMouseOver() {}
function firstPageMouseOver() {}
function nextMouseOver() {}
function clearFilter(a, b) {
a = $("#filter_" + a);
a.val("");
inputBlur(a[0], b);
}
function hasWildcard(a) {
return (
  -1 != a.indexOf("*") ||
  -1 != a.indexOf("@") ||
  -1 != a.indexOf("//") ||
  -1 != a.indexOf("#") ||
  (-1 < a.indexOf("?") && a.indexOf("?") < a.length - 1)
);
}
function currentQueryHasWildcard() {
return hasWildcard(filter_term) || "" === filter_term;
}
function currentQueryIsClusterQuery() {
return filter_term.match(/^cluster:/);
}
function setFilter(a, b, c) {
a = $("#filter_" + a);
a.val(c);
inputBlur(a[0], b);
}
function setFilters() {
setFilter("startswith", "Starts with", filter_startswith);
setFilter("soundslike", "Sounds like", filter_soundslike);
setFilter("stresspattern", "Meter", filter_stresspattern);
setFilter("numberofletters", "Letters", filter_numberofletters);
setFilter("numberofsyllables", "Syllables", filter_numberofsyllables);
setFilter("rhymeswith", "Rhymes with", filter_rhymeswith);
setFilter("relatedto", "Related to", filter_relatedto);
}

function addFilterHiddenParams() {
    addFilterHiddenParam("startswith", "f_sw", filter_startswith);
    addFilterHiddenParam("soundslike", "f_sl", filter_soundslike);
    addFilterHiddenParam("stresspattern", "f_stress", filter_stresspattern);
    addFilterHiddenParam("numberofletters", "f_nl", filter_numberofletters);
    addFilterHiddenParam("numberofsyllables", "f_ns", filter_numberofsyllables);
    addFilterHiddenParam("rhymeswith", "f_rw", filter_rhymeswith);
    addFilterHiddenParam("relatedto", "f_rt", filter_relatedto);
  }
  function clearFilters() {
    filter_startswith =
      filter_relatedto =
      filter_rhymeswith =
      filter_stresspattern =
      filter_soundslike =
      filter_numberofsyllables =
      filter_numberofletters =
        "";
    clearFilter("soundslike", "Sounds like");
    clearFilter("stresspattern", "Meter");
    clearFilter("startswith", "Starts with");
    clearFilter("relatedto", "Related to");
    clearFilter("rhymeswith", "Rhymes with");
    clearFilter("numberofletters", "Num. letters");
    clearFilter("numberofsyllables", "Num. syllables");
  }
  function getResults(a) {
    $("#info").hide();
    $(this);
    var b = $(this.element),
      c = b.data("jqXHR");
    c && c.abort();
    panelToStartIndex = [];
    setHelplineSpinner();
    if ((c = lookup()))
      b.data("jqXHR", c), 0 < $("#thesinput").length && saveWindowState(a);
  }
  function layoutResults(a) {
    var b = [],
      c = {},
      e = [],
      f = THESAURUS_MAX_ITEMS_PER_PAGE / THESAURUS_MAX_COLUMNS,
      p = {},
      m = {},
      v = {},
      l = {},
      g = {},
      k = {},
      q = "lightgrey",
      x = null,
      D = [],
      y = {},
      A = [],
      B = [],
      H = {},
      C = {},
      E = {},
      F = {};
    if (viz_mode)
      console.log("viz_mode"),
        $("#content").html(
          '<center><div id="root"></div></center>\n<script type="module"> \n import render from "https://onelook.com/thesaurus/viz/assets/brainstorming-viz.es.js?v=1"; window.viz_render = render; window.viz_result_data = resultData; window.viz_render(); \x3c/script>'
        ),
        $("#content").show(),
        $("#tabs").hide(),
        $("#rerank").hide(),
        $("#filtertitle").hide(),
        $("#content").addClass("content-with-viz"),
        $("#vizspan").html(vizButtonStr("off", locText("VIZ_BUTTON_OFF"))),
        document
          .getElementById("root")
          .scrollIntoView({
            inline: "center",
            block: "center",
            behavior: "smooth",
          });
    else {
      for (var h = 0; h < resultData.length; h++) {
        var t = resultData[h].word;
        if (h > sortTopN && "rv1" !== sortOrderCode) break;
        var u =
          "undefined" == typeof resultData[h].tags
            ? ["all"]
            : ["all"].concat(resultData[h].tags);
        t in COLORS && "" === q && (q = COLORS[t]);
        for (var n = 1; n < u.length; n++)
          "syn" === u[n]
            ? (p[t] = 1)
            : "prop" === u[n]
            ? (l[t] = 1)
            : "ant" === u[n]
            ? (m[t] = 1)
            : u[n].match(/^f:/)
            ? (v[t] = Number(parseFloat(u[n].replace("f:", "")).toPrecision(2)))
            : u[n].match(/^cluster:/)
            ? (H[t] = u[n].replace("cluster:", ""))
            : u[n].match(/^year_avg:/)
            ? (C[t] = Number(parseFloat(u[n].replace("year_avg:", ""))))
            : u[n].match(/^f_lyr:/)
            ? (E[t] = Number(parseFloat(u[n].replace("f_lyr:", ""))))
            : u[n].match(/^f_legal:/)
            ? (F[t] = Number(parseFloat(u[n].replace("f_legal:", ""))))
            : u[n].match(/^cluster_titles:/)
            ? (y = JSON.parse(u[n].replace("cluster_titles:", "")))
            : u[n].match(/^cluster_top:/)
            ? (A = JSON.parse(u[n].replace("cluster_top:", "")))
            : u[n].match(/^def_clusters:/) &&
              (B = JSON.parse(u[n].replace("def_clusters:", "")));
        "undefined" != typeof resultData[h].defs &&
          ((g[t] = resultData[h].defs),
          "undefined" != typeof resultData[h].defHeadword &&
            (k[t] = resultData[h].defHeadword));
        null != x ||
          null == resultData[h].defs ||
          currentQueryIsClusterQuery() ||
          (x = resultData[h]);
        if (-1 !== $.inArray("query", u)) {
          if (!areFiltersActive() && "undefined" != typeof resultData[h].tags)
            for (n = 0; n < resultData[h].tags.length; n++)
              (t = resultData[h].tags[n]),
                t.match(/^spellcor:/) &&
                  ((t = t.replace("spellcor:", "")), D.push(t));
        } else {
          var G = 0;
          for (n = 0; n < u.length; n++) {
            var w = u[n];
            if (
              "all" === w ||
              "adj" === w ||
              "n" === w ||
              "v" === w ||
              "adv" === w
            )
              if (
                (w in c
                  ? (panelId = c[w])
                  : ((c[w] = e.length), (b[e.length] = w), (panelId = e.length)),
                e[panelId] ? e[panelId].push(t) : (e[panelId] = [t]),
                (G += 1),
                2 == G)
              )
                break;
          }
        }
      }
      if (
        4 <= e.length &&
        ((h = b[1]),
        (c = b[2]),
        (n = ""),
        "n" === h && (n = "adj"),
        "adj" === h && (n = "n"),
        "v" === h && (n = "adv"),
        "adv" === h && (n = "v"),
        "" !== n && n !== c)
      )
        for (h = 3; h < e.length; h++)
          if (b[h] === n) {
            b[h] = b[2];
            b[2] = n;
            t = e[2];
            e[2] = e[h];
            e[h] = t;
            break;
          }
      c = 0;
      $("#tabs").empty();
      $("#content").empty();
      for (h = 0; h < e.length; h++)
        if (
          ((c = h + 1),
          (n = "<b>" + panelHeader(b[h]) + "</b>"),
          "<b>Uncategorized</b>" !== n || 2 != e.length)
        ) {
          $("#tabs").append(
            '<li><a href="#" name="zone' + c.toString() + '">' + n + "</a></li>"
          );
          d = $("#zone" + c.toString());
          content = '<div class="thesaurus_results">';
          content += "<table width=100%><tr><td valign=top>";
          panelToStartIndex.length <= h && (panelToStartIndex[h] = 0);
          u = panelToStartIndex[h];
          G = Math.min(e[h].length, u + THESAURUS_MAX_ITEMS_PER_PAGE);
          "rv1" !== sortOrderCode &&
            ((n = sortOrderCode.substring(0, 2)),
            e[h].sort(
              {
                le: function (r, z) {
                  return r.length - z.length;
                },
                al: function (r, z) {
                  return r.localeCompare(z);
                },
                co: function (r, z) {
                  return (v[r] || 0) - (v[z] || 0);
                },
                mo: function (r, z) {
                  return (C[r] || 0) - (C[z] || 0);
                },
                lg: function (r, z) {
                  return (F[r] || 0) - (F[z] || 0);
                },
                ly: function (r, z) {
                  return (E[r] || 0) - (E[z] || 0);
                },
              }[n]
            ),
            "1" === sortOrderCode.charAt(2) && e[h].reverse(),
            "mo" === n &&
              (e[h] = e[h]
                .filter(function (r) {
                  return null != C[r];
                })
                .concat(
                  e[h].filter(function (r) {
                    return null == C[r];
                  })
                )),
            "co" === n &&
              (e[h] = e[h]
                .filter(function (r) {
                  return null != v[r];
                })
                .concat(
                  e[h].filter(function (r) {
                    return null == v[r];
                  })
                )),
            "ly" === n &&
              ((e[h] = e[h]
                .filter(function (r) {
                  return null != E[r];
                })
                .concat(
                  e[h].filter(function (r) {
                    return null == E[r];
                  })
                )),
              (e[h] = e[h]
                .filter(function (r) {
                  return 0.1 <= v[r];
                })
                .concat(
                  e[h].filter(function (r) {
                    return 0.1 > v[r];
                  })
                ))),
            "lg" === n &&
              ((e[h] = e[h]
                .filter(function (r) {
                  return null != F[r];
                })
                .concat(
                  e[h].filter(function (r) {
                    return null == F[r];
                  })
                )),
              (e[h] = e[h]
                .filter(function (r) {
                  return 0.1 <= v[r];
                })
                .concat(
                  e[h].filter(function (r) {
                    return 0.1 > v[r];
                  })
                ))));
          for (n = u; n < G; n++)
            (t = e[h][n]),
              (w = "res"),
              1 == p[t] ? (w = "ressyn") : 1 == m[t] && (w = "resant"),
              1 == l[t] && (t = toTitleCase(t)),
              (w =
                "<span class='resnum'>" +
                (n + 1).toString() +
                ".</span> <div resid='" +
                (n + 1).toString() +
                "' thesw='" +
                encodeURIComponent(t) +
                "' class='res " +
                w +
                "'>" +
                thesianchor(t, b[h], n)),
              (tooltip = makeTooltip(t, g, k, H, b[h], C, v, y)),
              (w +=
                "<div class='more-info'><div class= 'actual-info'>" +
                tooltip +
                "</div></div>"),
              (w += "<br></div>"),
              (content += w + "<br>"),
              n % f == f - 1 && (content += "</td><td valign=top>");
          content += "</td></tr></table>";
          content += "</div>";
          n = "#previous_page_marker_" + h.toString();
          t = "#next_page_marker_" + h.toString();
          0 < u &&
            (u > THESAURUS_MAX_ITEMS_PER_PAGE &&
              (content +=
                '<span onClick="pageChange(' +
                (h.toString() + ',0);" class="prevlink firstlink" id=') +
                n +
                "><button>&lt;&lt;&lt; First page&nbsp;&nbsp;</button></span>&nbsp;&nbsp;"),
            (w =
              "pageChange(" +
              h.toString() +
              "," +
              Math.max(0, u - THESAURUS_MAX_ITEMS_PER_PAGE) +
              ");"),
            (content +=
              '<span onClick="' +
              w +
              '" class="prevlink" id=' +
              n +
              "><button>&lt;&lt; " +
              locText("PREVIOUS_RESULTS") +
              "</button></span>"),
            $(".prevlink").mouseover(prevMouseOver));
          G < e[h].length &&
            ((w =
              "pageChange(" +
              h.toString() +
              "," +
              (u + THESAURUS_MAX_ITEMS_PER_PAGE) +
              ");"),
            (content +=
              '<span onClick="' +
              w +
              '" class="nextlink" id=' +
              t +
              "><button>" +
              locText("NEXT_RESULTS") +
              " &gt;&gt;</button></span>"),
            $(".nextlink").mouseover(nextMouseOver));
          $("#content").append(
            '<div id="zone' + c.toString() + '">' + content + "</div>"
          );
        }
      0 === e.length
        ? 0 < D.length
          ? showDidYouMean(D, !1)
          : currentQueryHasWildcard()
          ? showDidYouMean([], !1)
          : fetchSpellCorsAndShowDym(!1)
        : 0 < D.length && showDidYouMean(D, !0);
      areFiltersActive() &&
        ((h =
          "<center><span class='filterinnertitle' id='clearfilter'><a onClick='clearFilters(); getResults(false);'><button id=\"clearfilterbutton\">" +
          locText("CLEAR_FILTERS") +
          "</button></a></span></center>"),
        $("#filtertitle").html(h));
      $("#tabs li:nth-child(" + (a + 1).toString() + ")").attr("id", "current");
      $("#content").find("[id^='zone']").hide();
      $("#content #zone" + (a + 1).toString()).show();
      $("#tabs a").click(function (r) {
        r.preventDefault();
        "current" !== $(this).closest("li").attr("id") &&
          ($("#content").find("[id^='zone']").hide(),
          $("#tabs li").attr("id", ""),
          $(this).parent().attr("id", "current"),
          $("#" + $(this).attr("name")).show());
      });
      0 !== e.length && $("#tabs").show();
      $("#content").removeClass("content-with-viz");
      $("#content").show();
      $("#filtertitle").show();
      $("#rerank").show();
      showOrHideFilters();
    }
    viz_mode
      ? setHelpline(" ")
      : null != y && currentQueryIsClusterQuery()
      ? ((window.query_cluster_title = y[filter_term.replace("cluster:", "")][0]),
        saveWindowState(!1),
        (help_text =
          'Showing terms in the concept cluster <b>"' +
          window.query_cluster_title +
          '"</b>'),
        setHelpline(help_text),
        (filter_relatedto_original = filter_relatedto),
        (filter_relatedto = ""),
        clearFilter("relatedto"))
      : null != y &&
        0 !== e.length &&
        setHelpline("Tip:  Click on a word to see more details.");
    a = $("#defbox");
    if (0 < a.length && (a.empty(), null != x)) {
      h = x.defs;
      var I;
      "undefined" != typeof h
        ? (I = format_compact_defs(h, "all", k[x.word] ? k[x.word] : x.word, m))
        : filter_term.match(/[ #@?*,\/]/) ||
          (I = format_compact_defs([], "all", x.word, m));
      tooltip = makeTooltip(x.word, g, k, H, "all", C, v, y);
      tooltip =
        '<div class="query-res-spacer"></div><span resid=\'0\' class="res query-res" thesw="' +
        x.word +
        "\">&nbsp;More &#9654;<div class='more-info'><div class='actual-info'>" +
        tooltip +
        "</div></div></span>";
      a.append(
        "<div class='def-box-info'><div class='def-box-defs'>" +
          I +
          tooltip +
          "</div></div>"
      );
    }
    if (0 < $("#clusterbox").length) {
      m = "";
      if (viz_mode)
        m =
          "<br><center>This is an experimental feature to help you brainstorm ideas about any topic.  We've grouped words and phrases into thousands of clusters based on a statistical analysis of how they are used in writing.  This page lets you explore the clusters that pertain to your search query.  The blue box contains the words most similar to your search query, and the green boxes show closely related concepts.  Click on a box to bring it to the center, or click on a word within the center box to see more information about the word.  Note:  The names of the clusters (in <font color=red>red</font>) were written automatically and may not precisely describe every word within the cluster.";
      else if (0 < A.length) {
        g = new Set();
        m = "";
        if (0 < B.length && !currentQueryIsClusterQuery()) {
          m += "<br>Found in concepts: &nbsp;";
          for (h = 0; h < B.length; h++)
            0 < h && (m += " "),
              g.has(B[h]) ||
                ((k = clusterlink(y, B[h])),
                null != k &&
                  ((k = k.replace("thescls2", "thescls4")),
                  (m += k),
                  g.add(B[h])));
          m += "<br>";
        }
        x = !1;
        for (h = 0; h < Math.min(A.length, 12); h++)
          g.has(A[h][0]) ||
            (0 < h && (m += " "),
            (k = clusterlink(y, A[h][0])),
            null != k &&
              (x || ((m += "<br>Related concepts: &nbsp;"), (x = !0)),
              (m += k + " "),
              g.add(B[h])));
        viz_url = makeCurrentUrl(null) + "&viz=1";
        m +=
          '<br><br><center><button id=viz-teaser-button onClick="viz_mode_on();">Idea Map (beta)</center>';
      }
      currentQueryIsClusterQuery() &&
        !viz_mode &&
        (m +=
          "<br><center><i>Concept clusters like this one are an experimental OneLook feature.  We've grouped words and phrases into thousands of clusters based on a statistical analysis of how they are used in writing.  Some of the words and concepts may be vulgar or offensive. The names of the clusters were written automatically and may not precisely describe every word within the cluster.  Click on a word to see a list of definitions; the first definition in the list is the sense in which it belongs to the concept cluster.</i></center>");
      $("#clusterbox").html(m);
    }
    a = $("#quickfilters");
    if (0 < a.length) {
      y = locText("RESTRICT_TO_METER") + ":<br>";
      for (h = 0; h < STRESS_PATTERNS.length; h++)
        (A = STRESS_PATTERNS[h]),
          (B =
            filter_stresspattern === A
              ? "meter_btn_selected"
              : "meter_btn_unselected"),
          (m = filter_stresspattern === A ? "" : A),
          (n =
            "'/' means stressed, 'x' means unstressed.  Click a button to find words that match a certain meter."),
          (y +=
            '<button title="' +
            n +
            '" class="' +
            B +
            '" onClick=\'click_meter_filter("' +
            m +
            "\");'>" +
            A +
            "</button>");
      a.html(y);
    }
    addFilterHiddenParams();
    a = $(".shadow-box");
    0 < a.length &&
      ((y = ""),
      "" === q || viz_mode || (y = "0 0 10px 5px " + q),
      a.css("-webkit-box-shadow", y),
      a.css("-moz-box-shadow", y),
      a.css("box-shadow", y));
    a = $("#thesinput");
    0 < a.length && $("#thesinput").autocomplete("close");
    $(".res").click(clickres);
    a = $(".logo-img");
    0 < a.length && a.addClass("logo-img-results-page");
    a = $("#olthes_intro_text");
    0 < a.length && a.hide();
    0 < $("#filter_startswith").length &&
      0 < $("#filter_numberofletters").length &&
      (hasWildcard(filter_term)
        ? ($("#filter_startswith").hide(),
          $("#filter_numberofletters").hide(),
          $("#filter_numberofsyllables").hide(),
          $("#filter_stresspattern").hide())
        : ($("#filter_startswith").show(),
          $("#filter_numberofletters").show(),
          $("#filter_numberofsyllables").show(),
          $("#filter_stresspattern").show()));
  }
  function pageChange(a, b) {
    panelToStartIndex[a] = b;
    layoutResults(a);
  }
  function theslink(a) {
    return THESAURUS_BASE_URL + encodeURIComponent(a);
  }
  function panelHeader(a) {
    return "all" === a
      ? locText("POS_ALL")
      : "adj" === a
      ? locText("POS_ADJECTIVES")
      : "n" === a
      ? locText("POS_NOUNS")
      : "v" === a
      ? locText("POS_VERBS")
      : "adv" === a
      ? locText("POS_ADVERBS")
      : locText("POS_UNCATEGORIZED");
  }
  function toggleres(a) {
    var b = $(a).find(".more-info");
    b.hasClass("more-info-selected")
      ? (b.removeClass("more-info-selected"), (selected_res = null))
      : (b.addClass("more-info-selected"), (selected_res = a));
  }
  function globalOnclick(a) {
    null !== selected_res && toggleres(selected_res);
  }
  function clickres(a) {
    a.stopPropagation();
    a = a.target;
    if (null !== selected_res)
      if ($(selected_res).is($(a))) {
        var b = decodeURIComponent($(selected_res).attr("thesw"));
        window.location.href = THESAURUS_RELATED_TEMPLATE.replace(/%s/g, b);
      } else if ($.contains(selected_res, a)) {
        if ($(a).hasClass("defgloss"))
          (window.examples_topic = $(a).text()),
            (window.examples_pos = $(a).attr("thespos")),
            $(".defgloss_selected").removeClass("defgloss_selected"),
            $(a).addClass("defgloss_selected");
        else return;
        a = selected_res;
      } else toggleres(selected_res);
    $(selected_res).is($(a)) ||
      (toggleres(a),
      (window.example_span_id = "example_" + new Date().getTime()),
      (window.selected_headword = $(a)
        .attr("thesw")
        .replace("%20", "_")
        .replace(" ", "_")),
      currentQueryIsClusterQuery()
        ? (window.examples_topic = window.query_cluster_title)
        : filter_term === selected_headword || currentQueryHasWildcard()
        ? (window.examples_topic = null)
        : (window.examples_topic = filter_term),
      (window.examples_pos = null));
    a =
      '<span id="' +
      window.example_span_id +
      '"></span><script type="module"> \n import gen_sentences from "https://onelook.com/thesaurus/example_sentences.js"; window.gen_sentences = gen_sentences;  window.gen_sentences(window.selected_headword, "' +
      getApiBaseUrl() +
      '", "#" + window.example_span_id, false, "<br><hr><br><i>Usage examples:</i><br><br>", 10, false, window.examples_topic, window.examples_pos);\x3c/script>';
    $(selected_res).find(".dynamic-def-content").html(a);
  }
  function thesianchor(a, b, c) {
    var e = a;
    30 < e.length
      ? (b && 0 < c && (e = e.replace(b, "...")),
        40 < e.length && (e = e.substring(0, 29) + "..."),
        (a = THESAURUS_CLICKABLE_ENTRIES
          ? '<a title="' + a + '" href="' + theslink(a) + '">' + e + "</a>"
          : e))
      : (a = THESAURUS_CLICKABLE_ENTRIES
          ? '<a href="' + theslink(a) + '">' + e + "</a>"
          : e);
    return a;
  }
  function clusterlink(a, b) {
    a = a[b][0];
    return a.match(/^Untitled/) || filter_term === "cluster:" + b.toString()
      ? null
      : ((url = currentQueryIsClusterQuery()
          ? makeCurrentUrl(filter_relatedto_original) + "&loc=thescls3"
          : makeCurrentUrl(filter_term) + "&loc=thescls2"),
        (url = url.replace(/s=[^&]*([&]|$)/, "s=cluster:" + b + "$1")),
        (url = url + "&concept=" + encodeURIComponent(a)),
        (clslink =
          '<a href="' +
          url +
          '"><button class="top-cluster">' +
          a +
          "</button></a>"));
  }
  function format_defs(a, b, c, e, f, p, m) {
    s = "";
    for (var v = 0; v < a.length; v++) {
      var l = a[v].split("\t");
      if (1 < l.length) {
        var g = l[0];
        if ("all" === b || b === g)
          "" === s &&
            (s =
              "undefined" != typeof c
                ? "<b class='thes_ql_title'><i>" + c + "</i></b>:<br><br><ul>"
                : "<ul>"),
            (s +=
              '<li><span class="defgloss" thespos="' +
              g +
              '"> ' +
              l[1] +
              "</span><br>");
      } else
        "" === s &&
          (s =
            "undefined" != typeof c
              ? "Definitions for <i>" + c + "</i>:<br><br><ul>"
              : "<ul>"),
          (s +=
            '<li><span class="defgloss" thespos="' +
            b +
            '"> ' +
            a[v] +
            "</span><br>");
    }
    "" !== s && (s += "</ul>");
    f &&
      ((a =
        0.1 > f
          ? "very rare"
          : 0.5 > f
          ? "rare"
          : 1 > f
          ? "moderately low"
          : 3 > f
          ? "moderate"
          : 10 > f
          ? "moderately high"
          : 25 > f
          ? "common"
          : 35 > f
          ? "very common"
          : "extremely common"),
      (f = f.toString() + " times per million words in books."),
      e &&
        (1900 > e
          ? (a += ", outdated")
          : 1930 > e
          ? (a += ", old-fashioned")
          : 2010 < e
          ? (a += ", very recent")
          : 2e3 < e && (a += ", modern"),
        (f += " Median year of use: " + Math.round(e).toString())),
      (s +=
        '<br><span class="thes_usage" title="' +
        f +
        ' ">Usage: <b>' +
        a +
        "</b></span>"));
    null != p &&
      "0" != p &&
      p in m &&
      ((e = m[p][0]),
      e.match(/^Untitled/) ||
        ((url = makeCurrentUrl(c) + "&loc=thescls"),
        (url = url.replace(/s=[^&]*([&]|$)/, "s=cluster:" + p + "$1")),
        (url = url + "&concept=" + encodeURIComponent(e)),
        (clslink =
          '<a class="thes_usage_cluster" href="' + url + '">' + e + "</a>"),
        (s +=
          '<br><br>More words related to: <span class="thes_usage"><b>' +
          clslink +
          "</b></span>")));
    return s;
  }
  function format_compact_defs(a, b, c, e) {
    s = "";
    for (var f = !1, p = 0; p < a.length; p++) {
      var m = a[p].split("\t");
      if (1 < m.length) {
        var v = m[0];
        "adj" === v && (f = !0);
        if ("all" === b || b === v)
          "" === s &&
            (s = "undefined" != typeof c ? "<b><i>" + c + "</i></b>: " : ""),
            (s += "  " + m[1]),
            (s += "; ");
      }
      if (s.length > MAX_TOPDEF_LENGTH_CHARS) break;
    }
    s.length > MAX_TOPDEF_LENGTH_CHARS &&
      (s = s.substring(0, MAX_TOPDEF_LENGTH_CHARS) + "... ");
    window.antonym_headword = c;
    if (!$.isEmptyObject(e) || f)
      (s += '<span id="thesaurus_ants">' + formatAntonyms(e) + "</span>"),
        (s +=
          ' <button id="thesaurus_ants_button" onClick="clickAntonyms();">opposite</button>');
    return s;
  }
  
  function lookup() {
    var a = filter_term;
    if ("" !== full_api_query) var b = full_api_query;
    else
      (b = getApiBaseUrl() + "/words?k=olt_test2&max=1000&qe=ml&rif=1&md=dpfy"),
        "" !== a &&
          "*" !== a &&
          (b += "&ml=" + encodeURIComponent(a.replace(/[:].*/, ""))),
        "" !== requested_lang &&
          (b += "&v=" + encodeURIComponent(requested_lang));
    var c = "";
    "" !== filter_numberofletters
      ? ((c = parseInt(filter_numberofletters)),
        (c = Math.min(c, 20)),
        (c =
          "" !== filter_startswith
            ? filter_startswith +
              Array(c - filter_startswith.length + 1).join("?")
            : Array(c + 1).join("?")),
        filter_numberofletters.endsWith("+") && (c += "*"))
      : "" !== filter_startswith && (c = filter_startswith + "*");
    "" !== c && (b += "&sp=" + encodeURIComponent(c));
    "" !== filter_relatedto &&
      (b += "&topics=" + encodeURIComponent(filter_relatedto));
    "" !== filter_rhymeswith &&
      (b += "&sl=rhy:" + encodeURIComponent(filter_rhymeswith));
    "" !== filter_soundslike
      ? (b += "&sl=" + encodeURIComponent(filter_soundslike))
      : "" !== filter_stresspattern
      ? ((c = filter_stresspattern.replace(/[xX]/g, "0").replace(/[/]/g, "1")),
        (b += "&sl=stress:" + encodeURIComponent(c)))
      : "" !== filter_numberofsyllables &&
        ((c = parseInt(filter_numberofsyllables)),
        (c = Math.min(c, 20)),
        (c = Array(c + 1).join("?")),
        (b += "&sl=pp:" + encodeURIComponent(c)));
    if ("undefined" === typeof THESAURUS_RESULTS || areFiltersActive())
      return $.ajax({
        dataType: "json",
        type: "Get",
        url: b,
        error: function (e, f, p) {
          e = "Sorry, we could not connect to the database.";
          f = THESAURUS_FALLBACK_URL + encodeURIComponent(a.replace(/[:].*/, ""));
          e += ' <a href="' + f + '">' + THESAURUS_FALLBACK_MSG + "</a>";
          setHelpline(e);
        },
        success: function (e) {
          resultData = e;
          layoutResults(0);
        },
      });
    resultData = THESAURUS_RESULTS;
    rerank();
  }
  function inputFocus(a) {
    var b = $(a);
    b.addClass("activefilter");
    -1 !== a.value.indexOf(":")
      ? (a.value = b.data("prev"))
      : a.value == a.defaultValue && (a.value = "");
    b = "<b>" + locText("FILT_HELP_HEADER") + "</b>: ";
    var c = "";
    "Starts with..." === a.defaultValue
      ? (c = locText("FILT_HELP_STARTS_WITH"))
      : "Letter count..." === a.defaultValue
      ? (c = locText("FILT_HELP_NUM_LETTERS"))
      : "Also related to..." === a.defaultValue
      ? (c = locText("FILT_HELP_ALSO_RELATED"))
      : "Rhymes with..." === a.defaultValue
      ? (c = locText("FILT_HELP_RHYMES"))
      : "Sounds like..." === a.defaultValue
      ? (c = locText("FILT_HELP_SOUNDS_LIKE"))
      : "Primary vowel..." === a.defaultValue
      ? (c =
          "" === filter_term
            ? locText("FILT_HELP_NEEDS_TOPIC")
            : locText("FILT_HELP_VOWELS_LIKE"))
      : "Meter..." === a.defaultValue
      ? (c =
          "" === filter_term
            ? locText("FILT_HELP_NEEDS_TOPIC")
            : locText("FILT_HELP_METER"))
      : "Syllable count..." === a.defaultValue &&
        (c =
          "" === filter_term
            ? locText("FILT_HELP_NEEDS_TOPIC")
            : locText("FILT_HELP_NUM_SYLLABLES"));
    "" !== c && setHelpline(b + "<i>" + c + "</i>");
    "Meter..." === a.defaultValue &&
      $("#filter_stresspattern").autocomplete("search", "");
    "Letter count..." === a.defaultValue &&
      $("#filter_numberofletters").autocomplete("search", "");
    "Syllable count..." === a.defaultValue &&
      $("#filter_numberofsyllables").autocomplete("search", "");
  }
  function inputBlur(a, b) {
    var c = $(a);
    "" === a.value
      ? ((a.value = a.defaultValue),
        c.removeClass("activefilter"),
        c.addClass("inactivefilter"))
      : (c.data("prev", a.value),
        (a.value = b + ": " + a.value),
        19 < a.value.length && (a.value = a.value.substring(0, 16) + "..."),
        c.removeClass("inactivefilter"),
        c.addClass("activefilter"));
  }
  function thesInputBlur(a) {
    a = $(a);
    if (a.val() || !currentQueryIsClusterQuery()) filter_term = a.val();
    full_api_query = getApiUrl(filter_term, !1);
  }
  function endsWith(a, b) {
    return -1 !== a.indexOf(b, a.length - b.length);
  }
  function getApiBaseUrl() {
    return THESAURUS_API_URL;
  }
  function getApiUrl(a, b) {
    var c = getApiBaseUrl();
    10 < a.length &&
      endsWith(a, "?") &&
      !hasWildcard(a.substring(0, a.length - 1)) &&
      (a = a.substring(0, a.length - 1));
    var e = -1 != a.indexOf(",") && !a.match(/[^, ]+[ ]+[^, ]+[ ]+[^, ]+/);
    if (a.match(/^cluster:/)) {
      a = a.split(":");
      c += "/words?rel_cls=" + a[1] + "&rand=" + Math.random().toString();
      var f = "5";
    } else
      hasWildcard(a)
        ? ((a = a.split(":")),
          1 < a.length
            ? ((f = "2"),
              (c +=
                "/words?sp=" +
                encodeURIComponent(a[0]) +
                "&ml=" +
                encodeURIComponent(a[1])))
            : ((f = "1"),
              (c += "/words?v=ol_gte2&sp=" + encodeURIComponent(a[0]))))
        : ((a = a.replace(":", "")),
          b
            ? ((f = "3"),
              (c += "/sug?v=ol_gte2_suggest&s=" + encodeURIComponent(a)))
            : ((f = "4"),
              (c += "/words?ml=" + encodeURIComponent(a)),
              e || (c += "&qe=ml"),
              a.toLowerCase().match(/^rhymes( of | with | for )/) &&
                ((f = a.toLowerCase().replace(/^rhymes( of | with | for )/, "")),
                (c = c.replace(
                  "/words?ml=" + encodeURIComponent(a),
                  "/words?arhy=1&sl=" + encodeURIComponent(f)
                )),
                (f = "6"))));
    e && (c += "&awv=1");
    c = b
      ? c + ("&max=10&k=olthes_ac" + f)
      : c + ("&md=dpfcy&max=501&rif=1&csm=100&k=olthes_r" + f);
    "" !== requested_lang &&
      ((c += "&v=" + encodeURIComponent(requested_lang)),
      (c = c.replace("md=dpfcy", "md=dpfy")));
    isBot() &&
      ((c = c.replace("k=", "k=bot-")), (c = c.replace("max=1000", "max=995")));
    return c;
  }
  function toTitleCase(a) {
    return a.replace(/\w\S*/g, function (b) {
      return b.charAt(0).toUpperCase() + b.substr(1).toLowerCase();
    });
  }
  function filtersAreOpen() {
    return "block" === document.getElementById("filteroptions").style.display;
  }
  function toggleFilters(a) {
    filtersAreOpen()
      ? ($("#filteroptions").hide(),
        $("#filtertitle").html(
          '<center><span class="filterinnertitle"><button id="filterbutton">' +
            locText("SHOW_FILTERS") +
            "</button></span></center>"
        ))
      : ($("#filteroptions").show(),
        $("#filtertitle").html(""),
        (more_info =
          '(<a target="_blank" href="https://onelook.com/thesaurus/whatsnew/?fh=1#filters">' +
          locText("HELP") +
          "</a>)"),
        "" === filter_term
          ? setHelpline("")
          : areFiltersActive()
          ? setHelpline("")
          : setHelpline(locText("FILT_HELP_TOP") + " " + more_info + "</i>"),
        $("#filterpane").show());
  }
  $(function () {
    $("#filter_startswith").autocomplete({
      minLength: 0,
      delay: 200,
      source: function (a, b) {
        filter_startswith = a.term;
        getResults(!1);
      },
    });
    $("#filter_relatedto").autocomplete({
      minLength: 0,
      delay: 200,
      source: function (a, b) {
        filter_relatedto = a.term;
        getResults(!1);
      },
    });
    $("#filter_rhymeswith").autocomplete({
      minLength: 0,
      delay: 200,
      source: function (a, b) {
        filter_rhymeswith = a.term;
        getResults(!1);
      },
    });
    $("#filter_soundslike").autocomplete({
      minLength: 0,
      delay: 200,
      source: function (a, b) {
        filter_soundslike = a.term;
        filter_numberofsyllables = "";
        clearFilter("numberofsyllables", "Num. syllables");
        getResults(!1);
      },
    });
  
    $("#filter_stresspattern").autocomplete({
      minLength: 0,
      delay: 0,
      source: function (a, b) {
        var c = STRESS_PATTERNS.concat(["Pick or type a stress pattern"]);
        b(c);
        "" !== a.term && filt_meter(a.term);
      },
      search: function (a, b) {
        "" === $("#filter_stresspattern").val() &&
          "" !== filter_stresspattern &&
          filt_meter("");
      },
      select: function (a, b) {
        b.item.value.match("Pick")
          ? (b.item.value = $("#filter_stresspattern").val())
          : ($("#filter_stresspattern").val(b.item.value),
            filt_meter(b.item.value));
      },
    });
    $("#filter_numberofletters").autocomplete({
      minLength: 0,
      delay: 0,
      source: function (a, b) {
        var c = LETTER_COUNTS.concat([
          "Pick or type a letter count.  5+ means '5 or more'",
        ]);
        b(c);
        "" !== a.term && filt_lettercount(a.term);
      },
      search: function (a, b) {
        "" === $("#filter_numberofletters").val() &&
          "" !== filter_numberofletters &&
          filt_lettercount("");
      },
      select: function (a, b) {
        b.item.value.match("Pick")
          ? (b.item.value = $("#filter_numberofletters").val())
          : ($("#filter_numberofletters").val(b.item.value),
            filt_lettercount(b.item.value));
      },
    });
    $("#filter_numberofsyllables").autocomplete({
      minLength: 0,
      delay: 0,
      source: function (a, b) {
        var c = SYLLABLE_COUNTS.concat(["Pick or type a syllable count"]);
        b(c);
        "" !== a.term && filt_sylcount(a.term);
      },
      search: function (a, b) {
        "" === $("#filter_numberofsyllables").val() &&
          "" !== filter_numberofsyllables &&
          filt_sylcount("");
      },
      select: function (a, b) {
        b.item.value.match("Pick")
          ? (b.item.value = $("#filter_numberofsyllables").val())
          : ($("#filter_numberofsyllables").val(b.item.value),
            filt_sylcount(b.item.value));
      },
    });
  });
  function fetchSpellCorsAndShowDym(a) {
    var b =
      getApiBaseUrl() +
      "/words?k=olt_spellcheck&max=1&sp=" +
      encodeURIComponent(filter_term);
    return $.ajax({
      dataType: "json",
      type: "Get",
      url: b,
      success: function (c) {
        for (var e = [], f = 0; f < c.length; f++)
          c[f].word !== filter_term && e.push(c[f].word);
        showDidYouMean(e, a);
      },
    });
  }
  function showDidYouMean(a, b) {
    var c = "";
    b || ((c = "No results found."), setHelpline(" "));
    if (0 < a.length && !areFiltersActive()) {
      c += "<br>" + locText("DID_YOU_MEAN") + ": ";
      for (var e = 0; e < a.length; e++) {
        var f = THESAURUS_RELATED_TEMPLATE.replace(
          /%s/g,
          encodeURIComponent(a[e])
        );
        "" !== requested_lang && (f += "&lang=" + requested_lang);
        f += "&loc=jsdym";
        b && (f += "2");
        0 < e && (c += " or ");
        c += ' <a href="' + f + '">' + a[e] + "</a>";
      }
      c += "?";
    }
    "" !== c &&
      $("#content").append('<div class="nonefound" id="zone1">' + c + "</div><br>");
  }
  