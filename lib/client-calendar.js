globalThis.__dshPowerdeskChunks__ = globalThis.__dshPowerdeskChunks__ || {};
globalThis.__dshPowerdeskChunks__["calendar"] = (require) => {
	var module = { exports: {} };
	var exports = module.exports;
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
	let react = require("react");
	let react_jsx_runtime = require("react/jsx-runtime");
	//#region node_modules/.pnpm/preact@10.29.8/node_modules/preact/dist/preact.module.js
	var n$1;
	var l$3;
	var u$3;
	var t$3;
	var i$3;
	var r$2;
	var o$2;
	var e$2;
	var f$3;
	var c$2;
	var a$2;
	var s$2;
	var h$3;
	var p$3;
	var v$2;
	var y$3;
	var d$3 = {};
	var w$3 = [];
	var _$2 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
	var g$3 = Array.isArray;
	function m$3(n, l) {
		for (var u in l) n[u] = l[u];
		return n;
	}
	function b$2(n) {
		n && n.parentNode && n.parentNode.removeChild(n);
	}
	function k$2(l, u, t) {
		var i, r, o, e = {};
		for (o in u) "key" == o ? i = u[o] : "ref" == o ? r = u[o] : e[o] = u[o];
		if (arguments.length > 2 && (e.children = arguments.length > 3 ? n$1.call(arguments, 2) : t), "function" == typeof l && null != l.defaultProps) for (o in l.defaultProps) void 0 === e[o] && (e[o] = l.defaultProps[o]);
		return x$3(l, e, i, r, null);
	}
	function x$3(n, t, i, r, o) {
		var e = {
			type: n,
			props: t,
			key: i,
			ref: r,
			__k: null,
			__: null,
			__b: 0,
			__e: null,
			__c: null,
			constructor: void 0,
			__v: null == o ? ++u$3 : o,
			__i: -1,
			__u: 0
		};
		return null == o && null != l$3.vnode && l$3.vnode(e), e;
	}
	function S$1(n) {
		return n.children;
	}
	function C$1(n, l) {
		this.props = n, this.context = l;
	}
	function $$1(n, l) {
		if (null == l) return n.__ ? $$1(n.__, n.__i + 1) : null;
		for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
		return "function" == typeof n.type ? $$1(n) : null;
	}
	function I(n) {
		if (n.__P && n.__d) {
			var u = n.__v, t = u.__e, i = [], r = [], o = m$3({}, u);
			o.__v = u.__v + 1, l$3.vnode && l$3.vnode(o), q$2(n.__P, o, u, n.__n, n.__P.namespaceURI, 32 & u.__u ? [t] : null, i, null == t ? $$1(u) : t, !!(32 & u.__u), r), o.__v = u.__v, o.__.__k[o.__i] = o, D$1(i, o, r), u.__e = u.__ = null, o.__e != t && P$1(o);
		}
	}
	function P$1(n) {
		if (null != (n = n.__) && null != n.__c) return n.__e = n.__c.base = null, n.__k.some(function(l) {
			if (null != l && null != l.__e) return n.__e = n.__c.base = l.__e;
		}), P$1(n);
	}
	function A$3(n) {
		(!n.__d && (n.__d = !0) && i$3.push(n) && !H$1.__r++ || r$2 != l$3.debounceRendering) && ((r$2 = l$3.debounceRendering) || o$2)(H$1);
	}
	function H$1() {
		try {
			for (var n, l = 1; i$3.length;) i$3.length > l && i$3.sort(e$2), n = i$3.shift(), l = i$3.length, I(n);
		} finally {
			i$3.length = H$1.__r = 0;
		}
	}
	function L(n, l, u, t, i, r, o, e, f, c, a) {
		var s, h, p, v, y, _, g = t && t.__k || w$3, m = l.length;
		for (f = T$3(u, l, g, f, m), s = 0; s < m; s++) null != (p = u.__k[s]) && (h = -1 != p.__i && g[p.__i] || d$3, p.__i = s, _ = q$2(n, p, h, i, r, o, e, f, c, a), v = p.__e, p.ref && h.ref != p.ref && (h.ref && J$1(h.ref, null, p), a.push(p.ref, p.__c || v, p)), null == y && null != v && (y = v), 4 & p.__u ? (f = j$3(p, f, n), h.__e && (h.__e = null)) : "function" == typeof p.type && void 0 !== _ ? f = _ : v && (f = v.nextSibling), p.__u &= -7);
		return u.__e = y, f;
	}
	function T$3(n, l, u, t, i) {
		var r, o, e, f, c, a = u.length, s = a, h = 0;
		for (n.__k = new Array(i), r = 0; r < i; r++) null != (o = l[r]) && "boolean" != typeof o && "function" != typeof o ? ("string" == typeof o || "number" == typeof o || "bigint" == typeof o || o.constructor == String ? o = n.__k[r] = x$3(null, o, null, null, null) : g$3(o) ? o = n.__k[r] = x$3(S$1, { children: o }, null, null, null) : void 0 === o.constructor && o.__b > 0 ? o = n.__k[r] = x$3(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v) : n.__k[r] = o, f = r + h, o.__ = n, o.__b = n.__b + 1, e = null, -1 != (c = o.__i = O$1(o, u, f, s)) && (s--, (e = u[c]) && (e.__u |= 2)), null == e || null == e.__v ? (-1 == c && (i > a ? h-- : i < a && h++), "function" != typeof o.type && (o.__u |= 4)) : c != f && (c == f - 1 ? h-- : c == f + 1 ? h++ : (c > f ? h-- : h++, o.__u |= 4))) : n.__k[r] = null;
		if (s) for (r = 0; r < a; r++) null != (e = u[r]) && 0 == (2 & e.__u) && (e.__e == t && (t = $$1(e)), K$1(e, e));
		return t;
	}
	function j$3(n, l, u) {
		var t, i;
		if ("function" == typeof n.type) {
			for (t = n.__k, i = 0; t && i < t.length; i++) t[i] && (t[i].__ = n, l = j$3(t[i], l, u));
			return l;
		}
		n.__e != l && (l && n.type && !l.parentNode && (l = $$1(n)), l = u.insertBefore(n.__e, l || null));
		do
			l = l && l.nextSibling;
		while (null != l && 8 == l.nodeType);
		return l;
	}
	function F$1(n, l) {
		return l = l || [], null == n || "boolean" == typeof n || (g$3(n) ? n.some(function(n) {
			F$1(n, l);
		}) : l.push(n)), l;
	}
	function O$1(n, l, u, t) {
		var i, r, o, e = n.key, f = n.type, c = l[u], a = null != c && 0 == (2 & c.__u);
		if (null === c && null == e || a && e == c.key && f == c.type) return u;
		if (t > (a ? 1 : 0)) {
			for (i = u - 1, r = u + 1; i >= 0 || r < l.length;) if (null != (c = l[o = i >= 0 ? i-- : r++]) && 0 == (2 & c.__u) && e == c.key && f == c.type) return o;
		}
		return -1;
	}
	function z$1(n, l, u) {
		"-" == l[0] ? n.setProperty(l, null == u ? "" : u) : n[l] = null == u ? "" : "number" != typeof u || _$2.test(l) ? u : u + "px";
	}
	function N(n, l, u, t, i) {
		var r, o;
		n: if ("style" == l) if ("string" == typeof u) n.style.cssText = u;
		else {
			if ("string" == typeof t && (n.style.cssText = t = ""), t) for (l in t) u && l in u || z$1(n.style, l, "");
			if (u) for (l in u) t && u[l] == t[l] || z$1(n.style, l, u[l]);
		}
		else if ("o" == l[0] && "n" == l[1]) r = l != (l = l.replace(s$2, "$1")), o = l.toLowerCase(), l = o in n || "onFocusOut" == l || "onFocusIn" == l ? o.slice(2) : l.slice(2), n.l || (n.l = {}), n.l[l + r] = u, u ? t ? u[a$2] = t[a$2] : (u[a$2] = h$3, n.addEventListener(l, r ? v$2 : p$3, r)) : n.removeEventListener(l, r ? v$2 : p$3, r);
		else {
			if ("http://www.w3.org/2000/svg" == i) l = l.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
			else if ("width" != l && "height" != l && "href" != l && "list" != l && "form" != l && "tabIndex" != l && "download" != l && "rowSpan" != l && "colSpan" != l && "role" != l && "popover" != l && l in n) try {
				n[l] = null == u ? "" : u;
				break n;
			} catch (n) {}
			"function" == typeof u || (null == u || !1 === u && "-" != l[4] ? n.removeAttribute(l) : n.setAttribute(l, "popover" == l && 1 == u ? "" : u));
		}
	}
	function V$1(n) {
		return function(u) {
			if (this.l) {
				var t = this.l[u.type + n];
				if (null == u[c$2]) u[c$2] = h$3++;
				else if (u[c$2] < t[a$2]) return;
				return t(l$3.event ? l$3.event(u) : u);
			}
		};
	}
	function q$2(n, u, t, i, r, o, e, f, c, a) {
		var s, h, p, v, y, d, _, k, x, M, I, P, A, H, T, j, F = u.type;
		if (void 0 !== u.constructor) return null;
		128 & t.__u && (c = !!(32 & t.__u), o = [f = u.__e = t.__e]), (s = l$3.__b) && s(u);
		n: if ("function" == typeof F) {
			h = e.length;
			try {
				if (x = u.props, M = F.prototype && F.prototype.render, I = (s = F.contextType) && i[s.__c], P = s ? I ? I.props.value : s.__ : i, t.__c ? k = (p = u.__c = t.__c).__ = p.__E : (M ? u.__c = p = new F(x, P) : (u.__c = p = new C$1(x, P), p.constructor = F, p.render = Q$1), I && I.sub(p), p.state || (p.state = {}), p.__n = i, v = p.__d = !0, p.__h = [], p._sb = []), M && null == p.__s && (p.__s = p.state), M && null != F.getDerivedStateFromProps && (p.__s == p.state && (p.__s = m$3({}, p.__s)), m$3(p.__s, F.getDerivedStateFromProps(x, p.__s))), y = p.props, d = p.state, p.__v = u, v) M && null == F.getDerivedStateFromProps && null != p.componentWillMount && p.componentWillMount(), M && null != p.componentDidMount && p.__h.push(p.componentDidMount);
				else {
					if (M && null == F.getDerivedStateFromProps && x !== y && null != p.componentWillReceiveProps && p.componentWillReceiveProps(x, P), u.__v == t.__v || !p.__e && null != p.shouldComponentUpdate && !1 === p.shouldComponentUpdate(x, p.__s, P)) {
						u.__v != t.__v && (p.props = x, p.state = p.__s, p.__d = !1), u.__e = t.__e, u.__k = t.__k, u.__k.some(function(n) {
							n && (n.__ = u);
						}), w$3.push.apply(p.__h, p._sb), p._sb = [], p.__h.length && e.push(p), f = $$1(t);
						break n;
					}
					null != p.componentWillUpdate && p.componentWillUpdate(x, p.__s, P), M && null != p.componentDidUpdate && p.__h.push(function() {
						p.componentDidUpdate(y, d, _);
					});
				}
				if (p.context = P, p.props = x, p.__P = n, p.__e = !1, A = l$3.__r, H = 0, M) p.state = p.__s, p.__d = !1, A && A(u), s = p.render(p.props, p.state, p.context), w$3.push.apply(p.__h, p._sb), p._sb = [];
				else do
					p.__d = !1, A && A(u), s = p.render(p.props, p.state, p.context), p.state = p.__s;
				while (p.__d && ++H < 25);
				p.state = p.__s, null != p.getChildContext && (i = m$3(m$3({}, i), p.getChildContext())), M && !v && null != p.getSnapshotBeforeUpdate && (_ = p.getSnapshotBeforeUpdate(y, d)), T = null != s && s.type === S$1 && null == s.key ? E$2(s.props.children) : s, f = L(n, g$3(T) ? T : [T], u, t, i, r, o, e, f, c, a), p.base = u.__e, u.__u &= -161, p.__h.length && e.push(p), k && (p.__E = p.__ = null);
			} catch (n) {
				if (e.length = h, u.__v = null, c || null != o) {
					if (n.then) {
						for (u.__u |= c ? 160 : 128; f && 8 == f.nodeType && f.nextSibling;) f = f.nextSibling;
						null != o && (o[o.indexOf(f)] = null), u.__e = f;
					} else if (null != o) for (j = o.length; j--;) b$2(o[j]);
				} else u.__e = t.__e;
				u.__k ??= t.__k || [], n.then || B$2(u), l$3.__e(n, u, t);
			}
		} else null == o && u.__v == t.__v ? (u.__k = t.__k, u.__e = t.__e) : f = u.__e = G$1(t.__e, u, t, i, r, o, e, c, a);
		return (s = l$3.diffed) && s(u), 128 & u.__u ? void 0 : f;
	}
	function B$2(n) {
		n && (n.__c && (n.__c.__e = !0), n.__k && n.__k.some(B$2));
	}
	function D$1(n, u, t) {
		for (var i = 0; i < t.length; i++) J$1(t[i], t[++i], t[++i]);
		l$3.__c && l$3.__c(u, n), n.some(function(u) {
			try {
				n = u.__h, u.__h = [], n.some(function(n) {
					n.call(u);
				});
			} catch (n) {
				l$3.__e(n, u.__v);
			}
		});
	}
	function E$2(n) {
		return "object" != typeof n || null == n || n.__b > 0 ? n : g$3(n) ? n.map(E$2) : void 0 !== n.constructor ? null : m$3({}, n);
	}
	function G$1(u, t, i, r, o, e, f, c, a) {
		var s, h, p, v, y, w, _, m = i.props || d$3, k = t.props, x = t.type;
		if ("svg" == x ? o = "http://www.w3.org/2000/svg" : "math" == x ? o = "http://www.w3.org/1998/Math/MathML" : o || (o = "http://www.w3.org/1999/xhtml"), null != e) {
			for (s = 0; s < e.length; s++) if ((y = e[s]) && "setAttribute" in y == !!x && (x ? y.localName == x : 3 == y.nodeType)) {
				u = y, e[s] = null;
				break;
			}
		}
		if (null == u) {
			if (null == x) return document.createTextNode(k);
			u = document.createElementNS(o, x, k.is && k), c && (l$3.__m && l$3.__m(t, e), c = !1), e = null;
		}
		if (null == x) m === k || c && u.data == k || (u.data = k);
		else {
			if (e = "textarea" == x && null != k.defaultValue ? null : e && n$1.call(u.childNodes), !c && null != e) for (m = {}, s = 0; s < u.attributes.length; s++) m[(y = u.attributes[s]).name] = y.value;
			for (s in m) y = m[s], "dangerouslySetInnerHTML" == s ? p = y : "children" == s || s in k || "value" == s && "defaultValue" in k || "checked" == s && "defaultChecked" in k || N(u, s, null, y, o);
			for (s in k) y = k[s], "children" == s ? v = y : "dangerouslySetInnerHTML" == s ? h = y : "value" == s ? w = y : "checked" == s ? _ = y : c && "function" != typeof y || m[s] === y || N(u, s, y, m[s], o);
			if (h) c || p && (h.__html == p.__html || h.__html == u.innerHTML) || (u.innerHTML = h.__html), t.__k = [];
			else if (p && (u.innerHTML = ""), L("template" == t.type ? u.content : u, g$3(v) ? v : [v], t, i, r, "foreignObject" == x ? "http://www.w3.org/1999/xhtml" : o, e, f, e ? e[0] : i.__k && $$1(i, 0), c, a), null != e) for (s = e.length; s--;) b$2(e[s]);
			c && "textarea" != x || (s = "value", "progress" == x && null == w ? u.removeAttribute("value") : null != w && (w !== u[s] || "progress" == x && !w || "option" == x && w != m[s]) && N(u, s, w, m[s], o), s = "checked", null != _ && _ != u[s] && N(u, s, _, m[s], o));
		}
		return u;
	}
	function J$1(n, u, t) {
		try {
			if ("function" == typeof n) {
				var i = "function" == typeof n.__u;
				i && n.__u(), i && null == u || (n.__u = n(u));
			} else n.current = u;
		} catch (n) {
			l$3.__e(n, t);
		}
	}
	function K$1(n, u, t) {
		var i, r;
		if (l$3.unmount && l$3.unmount(n), (i = n.ref) && (i.current && i.current != n.__e || J$1(i, null, u)), null != (i = n.__c)) {
			if (i.componentWillUnmount) try {
				i.componentWillUnmount();
			} catch (n) {
				l$3.__e(n, u);
			}
			i.base = i.__P = i.__n = null;
		}
		if (i = n.__k) for (r = 0; r < i.length; r++) i[r] && K$1(i[r], u, t || "function" != typeof n.type);
		t || b$2(n.__e), n.__c = n.__ = n.__e = void 0;
	}
	function Q$1(n, l, u) {
		return this.constructor(n, u);
	}
	function R(u, t, i) {
		var r, o, e, f;
		t == document && (t = document.documentElement), l$3.__ && l$3.__(u, t), o = (r = "function" == typeof i) ? null : i && i.__k || t.__k, e = [], f = [], q$2(t, u = (!r && i || t).__k = k$2(S$1, null, [u]), o || d$3, d$3, t.namespaceURI, !r && i ? [i] : o ? null : t.firstChild ? n$1.call(t.childNodes) : null, e, !r && i ? i : o ? o.__e : t.firstChild, r, f), D$1(e, u, f), u.props.children = null;
	}
	function X$1(n) {
		function l(n) {
			var u, t;
			return this.getChildContext || (u = /* @__PURE__ */ new Set(), (t = {})[l.__c] = this, this.getChildContext = function() {
				return t;
			}, this.componentWillUnmount = function() {
				u = null;
			}, this.shouldComponentUpdate = function(n) {
				this.props.value != n.value && u.forEach(function(n) {
					n.__e = !0, A$3(n);
				});
			}, this.sub = function(n) {
				u.add(n);
				var l = n.componentWillUnmount;
				n.componentWillUnmount = function() {
					u && u.delete(n), l && l.call(n);
				};
			}), n.children;
		}
		return l.__c = "__cC" + y$3++, l.__ = n, l.Provider = l.__l = (l.Consumer = function(n, l) {
			return n.children(l);
		}).contextType = l, l;
	}
	n$1 = w$3.slice, l$3 = { __e: function(n, l, u, t) {
		for (var i, r, o; l = l.__;) if ((i = l.__c) && !i.__) try {
			if ((r = i.constructor) && null != r.getDerivedStateFromError && (i.setState(r.getDerivedStateFromError(n)), o = i.__d), null != i.componentDidCatch && (i.componentDidCatch(n, t || {}), o = i.__d), o) return i.__E = i;
		} catch (l) {
			n = l;
		}
		throw n;
	} }, u$3 = 0, t$3 = function(n) {
		return null != n && void 0 === n.constructor;
	}, C$1.prototype.setState = function(n, l) {
		var u = null != this.__s && this.__s != this.state ? this.__s : this.__s = m$3({}, this.state);
		"function" == typeof n && (n = n(m$3({}, u), this.props)), n && m$3(u, n), null != n && this.__v && (l && this._sb.push(l), A$3(this));
	}, C$1.prototype.forceUpdate = function(n) {
		this.__v && (this.__e = !0, n && this.__h.push(n), A$3(this));
	}, C$1.prototype.render = S$1, i$3 = [], o$2 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e$2 = function(n, l) {
		return n.__v.__b - l.__v.__b;
	}, H$1.__r = 0, f$3 = Math.random().toString(8), c$2 = "__d" + f$3, a$2 = "__a" + f$3, s$2 = /(PointerCapture)$|Capture$/i, h$3 = 0, p$3 = V$1(!1), v$2 = V$1(!0), y$3 = 0;
	//#endregion
	//#region node_modules/.pnpm/preact@10.29.8/node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
	var f$2 = 0;
	Array.isArray;
	function u$2(e, t, n, o, i, u) {
		t || (t = {});
		var a, c, p = t;
		if ("ref" in p) for (c in p = {}, t) "ref" == c ? a = t[c] : p[c] = t[c];
		var l = {
			type: e,
			props: p,
			key: n,
			ref: a,
			__k: null,
			__: null,
			__b: 0,
			__e: null,
			__c: null,
			constructor: void 0,
			__v: --f$2,
			__i: -1,
			__u: 0,
			__source: i,
			__self: u
		};
		if ("function" == typeof e && (a = e.defaultProps)) for (c in a) void 0 === p[c] && (p[c] = a[c]);
		return l$3.vnode && l$3.vnode(l), l;
	}
	//#endregion
	//#region node_modules/.pnpm/preact@10.29.8/node_modules/preact/hooks/dist/hooks.module.js
	var t$2;
	var r$1;
	var u$1;
	var i$1;
	var o$1 = 0;
	var f$1 = [];
	var c$1 = l$3;
	var e$1 = c$1.__b;
	var a$1 = c$1.__r;
	var v$1 = c$1.diffed;
	var l$2 = c$1.__c;
	var m$2 = c$1.unmount;
	var p$2 = c$1.__;
	function s$1(n, t) {
		c$1.__h && c$1.__h(r$1, n, o$1 || t), o$1 = 0;
		var u = r$1.__H || (r$1.__H = {
			__: [],
			__h: []
		});
		return n >= u.__.length && u.__.push({}), u.__[n];
	}
	function d$2(n) {
		return o$1 = 1, y$2(D, n);
	}
	function y$2(n, u, i) {
		var o = s$1(t$2++, 2);
		if (o.t = n, !o.__c && (o.__ = [i ? i(u) : D(void 0, u), function(n) {
			var t = o.__N ? o.__N[0] : o.__[0], r = o.t(t, n);
			t !== r && (o.__N = [r, o.__[1]], o.__c.setState({}));
		}], o.__c = r$1, !r$1.__f)) {
			var f = function(n, t, r) {
				if (!o.__c.__H) return !0;
				var u = !1, i = o.__c.props !== n;
				if (o.__c.__H.__.some(function(n) {
					if (n.__N) {
						u = !0;
						var t = n.__[0];
						n.__ = n.__N, n.__N = void 0, t !== n.__[0] && (i = !0);
					}
				}), c) {
					var f = c.call(this, n, t, r);
					return u ? f || i : f;
				}
				return !u || i;
			};
			r$1.__f = !0;
			var c = r$1.shouldComponentUpdate, e = r$1.componentWillUpdate;
			r$1.componentWillUpdate = function(n, t, r) {
				if (this.__e) {
					var u = c;
					c = void 0, f(n, t, r), c = u;
				}
				e && e.call(this, n, t, r);
			}, r$1.shouldComponentUpdate = f;
		}
		return o.__N || o.__;
	}
	function h$2(n, u) {
		var i = s$1(t$2++, 3);
		!c$1.__s && C(i.__H, u) && (i.__ = n, i.u = u, r$1.__H.__h.push(i));
	}
	function A$2(n) {
		return o$1 = 5, T$2(function() {
			return { current: n };
		}, []);
	}
	function T$2(n, r) {
		var u = s$1(t$2++, 7);
		return C(u.__H, r) && (u.__ = n(), u.__H = r, u.__h = n), u.__;
	}
	function x$2(n) {
		var u = r$1.context[n.__c], i = s$1(t$2++, 9);
		return i.c = n, u ? (i.__ ?? (i.__ = !0, u.sub(r$1)), u.props.value) : n.__;
	}
	function j$2() {
		for (var n; n = f$1.shift();) {
			var t = n.__H;
			if (n.__P && t) try {
				t.__h.some(z), t.__h.some(B$1), t.__h = [];
			} catch (r) {
				t.__h = [], c$1.__e(r, n.__v);
			}
		}
	}
	c$1.__b = function(n) {
		r$1 = null, e$1 && e$1(n);
	}, c$1.__ = function(n, t) {
		n && t.__k && t.__k.__m && (n.__m = t.__k.__m), p$2 && p$2(n, t);
	}, c$1.__r = function(n) {
		a$1 && a$1(n), t$2 = 0;
		var i = (r$1 = n.__c).__H;
		i && (u$1 === r$1 ? (i.__h = [], r$1.__h = [], i.__.some(function(n) {
			n.__N && (n.__ = n.__N), n.u = n.__N = void 0;
		})) : (i.__h.some(z), i.__h.some(B$1), i.__h = [], t$2 = 0)), u$1 = r$1;
	}, c$1.diffed = function(n) {
		v$1 && v$1(n);
		var t = n.__c;
		t && t.__H && (t.__H.__h.length && (1 !== f$1.push(t) && i$1 === c$1.requestAnimationFrame || ((i$1 = c$1.requestAnimationFrame) || w$2)(j$2)), t.__H.__.some(function(n) {
			n.u && (n.__H = n.u, n.u = void 0);
		})), u$1 = r$1 = null;
	}, c$1.__c = function(n, t) {
		t.some(function(n) {
			try {
				n.__h.some(z), n.__h = n.__h.filter(function(n) {
					return !n.__ || B$1(n);
				});
			} catch (r) {
				t.some(function(n) {
					n.__h && (n.__h = []);
				}), t = [], c$1.__e(r, n.__v);
			}
		}), l$2 && l$2(n, t);
	}, c$1.unmount = function(n) {
		m$2 && m$2(n);
		var t, r = n.__c;
		r && r.__H && (r.__H.__.some(function(n) {
			try {
				z(n);
			} catch (n) {
				t = n;
			}
		}), r.__H = void 0, t && c$1.__e(t, r.__v));
	};
	var k$1 = "function" == typeof requestAnimationFrame;
	function w$2(n) {
		var t, r = function() {
			clearTimeout(u), k$1 && cancelAnimationFrame(t), setTimeout(n);
		}, u = setTimeout(r, 35);
		k$1 && (t = requestAnimationFrame(r));
	}
	function z(n) {
		var t = r$1, u = n.__c;
		"function" == typeof u && (n.__c = void 0, u()), r$1 = t;
	}
	function B$1(n) {
		var t = r$1;
		n.__c = n.__(), r$1 = t;
	}
	function C(n, t) {
		return !n || n.length !== t.length || t.some(function(t, r) {
			return t !== n[r];
		});
	}
	function D(n, t) {
		return "function" == typeof t ? t(n) : t;
	}
	//#endregion
	//#region node_modules/.pnpm/preact@10.29.8/node_modules/preact/compat/dist/compat.module.js
	function g$2(n, t) {
		for (var e in t) n[e] = t[e];
		return n;
	}
	function E$1(n, t) {
		for (var e in n) if ("__source" !== e && !(e in t)) return !0;
		for (var r in t) if ("__source" !== r && n[r] !== t[r]) return !0;
		return !1;
	}
	function M(n, t) {
		this.props = n, this.context = t;
	}
	(M.prototype = new C$1()).isPureReactComponent = !0, M.prototype.shouldComponentUpdate = function(n, t) {
		return E$1(this.props, n) || E$1(this.state, t);
	};
	var T$1 = l$3.__b;
	l$3.__b = function(n) {
		n.type && n.type.__f && n.ref && (n.props.ref = n.ref, n.ref = null), T$1 && T$1(n);
	};
	"undefined" != typeof Symbol && Symbol.for;
	var O = l$3.__e;
	l$3.__e = function(n, t, e, r) {
		if (n.then) {
			for (var u, o = t; o = o.__;) if ((u = o.__c) && u.__c) return t.__e ?? (t.__e = e.__e, t.__k = e.__k || []), u.__c(n, t);
		}
		O(n, t, e, r);
	};
	var U = l$3.unmount;
	function V(n, t, e) {
		return n && (n.__c && n.__c.__H && (n.__c.__H.__.forEach(function(n) {
			"function" == typeof n.__c && n.__c();
		}), n.__c.__H = null), null != (n = g$2({}, n)).__c && (n.__c.__P === e && (n.__c.__P = t), n.__c.__e = !0, n.__c = null), n.__k = n.__k && n.__k.map(function(n) {
			return V(n, t, e);
		})), n;
	}
	function W(n, t, e) {
		return n && e && (n.__v = null, n.__k = n.__k && n.__k.map(function(n) {
			return W(n, t, e);
		}), n.__c && n.__c.__P === t && (n.__e && e.appendChild(n.__e), n.__c.__e = !0, n.__c.__P = e)), n;
	}
	function P() {
		this.__u = 0, this.o = null, this.__b = null;
	}
	function j$1(n) {
		var t = n.__ && n.__.__c;
		return t && t.__a && t.__a(n);
	}
	function B() {
		this.i = null, this.l = null;
	}
	l$3.unmount = function(n) {
		var t = n.__c;
		t && (t.__z = !0), t && t.__R && t.__R(), t && 32 & n.__u && (n.type = null), U && U(n);
	}, (P.prototype = new C$1()).__c = function(n, t) {
		var e = t.__c, r = this;
		r.o ??= [], r.o.push(e);
		var u = j$1(r.__v), o = !1, i = function() {
			o || r.__z || (o = !0, e.__R = null, u ? u(f) : f());
		};
		e.__R = i;
		var l = e.__P;
		e.__P = null;
		var f = function() {
			if (!--r.__u) {
				if (r.state.__a) {
					var n = r.state.__a;
					r.__v.__k[0] = W(n, n.__c.__P, n.__c.__O);
				}
				var t;
				for (r.setState({ __a: r.__b = null }); t = r.o.pop();) t.__P = l, t.forceUpdate();
			}
		};
		r.__u++ || 32 & t.__u || r.setState({ __a: r.__b = r.__v.__k[0] }), n.then(i, i);
	}, P.prototype.componentWillUnmount = function() {
		this.o = [];
	}, P.prototype.render = function(n, e) {
		if (this.__b) {
			if (this.__v.__k) {
				var r = document.createElement("div"), o = this.__v.__k[0].__c;
				this.__v.__k[0] = V(this.__b, r, o.__O = o.__P);
			}
			this.__b = null;
		}
		var i = e.__a && k$2(S$1, null, n.fallback);
		return i && (i.__u &= -33), [k$2(S$1, null, e.__a ? null : n.children), i];
	};
	var H = function(n, t, e) {
		if (++e[1] === e[0] && n.l.delete(t), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.l.size)) for (e = n.i; e;) {
			for (; e.length > 3;) e.pop()();
			if (e[1] < e[0]) break;
			n.i = e = e[2];
		}
	};
	function Z(n) {
		return this.getChildContext = function() {
			return n.context;
		}, n.children;
	}
	function Y(n) {
		var e = this, r = n.h;
		if (e.componentWillUnmount = function() {
			R(null, e.v), e.v = null, e.h = null;
		}, e.h && e.h !== r && e.componentWillUnmount(), !e.v) {
			for (var u = e.__v; null !== u && !u.__m && null !== u.__;) u = u.__;
			e.h = r, e.v = {
				nodeType: 1,
				parentNode: r,
				childNodes: [],
				__k: { __m: u.__m },
				contains: function() {
					return !0;
				},
				namespaceURI: r.namespaceURI,
				insertBefore: function(n, t) {
					this.childNodes.push(n), e.h.insertBefore(n, t);
				},
				removeChild: function(n) {
					this.childNodes.splice(this.childNodes.indexOf(n) >>> 1, 1), e.h.removeChild(n);
				}
			};
		}
		R(k$2(Z, { context: e.context }, n.__v), e.v);
	}
	function $(n, e) {
		var r = k$2(Y, {
			__v: n,
			h: e
		});
		return r.containerInfo = e, r;
	}
	(B.prototype = new C$1()).__a = function(n) {
		var t = this, e = j$1(t.__v), r = t.l.get(n);
		return r[0]++, function(u) {
			var o = function() {
				t.props.revealOrder ? (r.push(u), H(t, n, r)) : u();
			};
			e ? e(o) : o();
		};
	}, B.prototype.render = function(n) {
		this.i = null, this.l = /* @__PURE__ */ new Map();
		var t = F$1(n.children);
		n.revealOrder && "b" === n.revealOrder[0] && t.reverse();
		for (var e = t.length; e--;) this.l.set(t[e], this.i = [
			1,
			0,
			this.i
		]);
		return n.children;
	}, B.prototype.componentDidUpdate = B.prototype.componentDidMount = function() {
		var n = this;
		this.l.forEach(function(t, e) {
			H(n, e, t);
		});
	};
	var q$1 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
	var G = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
	var J = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
	var K = /[A-Z0-9]/g;
	var Q = "undefined" != typeof document;
	var X = function(n) {
		return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n);
	};
	C$1.prototype.isReactComponent = !0, [
		"componentWillMount",
		"componentWillReceiveProps",
		"componentWillUpdate"
	].forEach(function(t) {
		Object.defineProperty(C$1.prototype, t, {
			configurable: !0,
			get: function() {
				return this["UNSAFE_" + t];
			},
			set: function(n) {
				Object.defineProperty(this, t, {
					configurable: !0,
					writable: !0,
					value: n
				});
			}
		});
	});
	var en$1 = l$3.event;
	l$3.event = function(n) {
		return en$1 && (n = en$1(n)), n.persist = function() {}, n.isPropagationStopped = function() {
			return this.cancelBubble;
		}, n.isDefaultPrevented = function() {
			return this.defaultPrevented;
		}, n.nativeEvent = n;
	};
	var un = {
		configurable: !0,
		get: function() {
			return this.class;
		}
	};
	var on = l$3.vnode;
	l$3.vnode = function(n) {
		"string" == typeof n.type && function(n) {
			var t = n.props, e = n.type, u = {}, o = -1 == e.indexOf("-");
			for (var i in t) {
				var l = t[i];
				if (!("value" === i && "defaultValue" in t && null == l || Q && "children" === i && "noscript" === e || "class" === i || "className" === i)) {
					var f = i.toLowerCase();
					"defaultValue" === i && "value" in t && null == t.value ? i = "value" : "download" === i && !0 === l ? l = "" : "translate" === f && "no" === l ? l = !1 : "o" === f[0] && "n" === f[1] ? "ondoubleclick" === f ? i = "ondblclick" : "onchange" !== f || "input" !== e && "textarea" !== e || X(t.type) ? "onfocus" === f ? i = "onfocusin" : "onblur" === f ? i = "onfocusout" : J.test(i) && (i = f) : f = i = "oninput" : o && G.test(i) ? i = i.replace(K, "-$&").toLowerCase() : null === l && (l = void 0), "oninput" === f && u[i = f] && (i = "oninputCapture"), u[i] = l;
				}
			}
			"select" == e && (u.multiple && Array.isArray(u.value) && (u.value = F$1(t.children).forEach(function(n) {
				n.props.selected = -1 != u.value.indexOf(n.props.value);
			})), null != u.defaultValue && (u.value = F$1(t.children).forEach(function(n) {
				n.props.selected = u.multiple ? -1 != u.defaultValue.indexOf(n.props.value) : u.defaultValue == n.props.value;
			}))), t.class && !t.className ? (u.class = t.class, Object.defineProperty(u, "className", un)) : t.className && (u.class = u.className = t.className), n.props = u;
		}(n), n.$$typeof = q$1, on && on(n);
	};
	var ln = l$3.__r;
	l$3.__r = function(n) {
		ln && ln(n), n.__c;
	};
	var fn = l$3.diffed;
	l$3.diffed = function(n) {
		fn && fn(n);
		var t = n.props, e = n.__e;
		null != e && "textarea" === n.type && "value" in t && t.value !== e.value && (e.value = null == t.value ? "" : t.value);
	};
	//#endregion
	//#region node_modules/.pnpm/@preact+signals-core@1.14.4/node_modules/@preact/signals-core/dist/signals-core.module.js
	var i = Symbol.for("preact-signals");
	function t$1() {
		if (!(v > 1)) {
			var i, t = !1;
			(function() {
				var i = c;
				c = void 0;
				while (void 0 !== i) {
					var t = i.S;
					if (t.v === i.v) {
						for (var n = t.t; void 0 !== n; n = n.x) if (n.i === i.i) n.i = t.i;
					}
					i = i.o;
				}
			})();
			while (void 0 !== h$1) {
				var n = h$1;
				h$1 = void 0;
				s++;
				while (void 0 !== n) {
					var r = n.u;
					n.u = void 0;
					n.f &= -3;
					if (!(8 & n.f) && w$1(n)) try {
						n.c();
					} catch (n) {
						if (!t) {
							i = n;
							t = !0;
						}
					}
					n = r;
				}
			}
			s = 0;
			v--;
			if (t) throw i;
		} else v--;
	}
	function n(i) {
		if (v > 0) return i();
		e = ++u;
		v++;
		try {
			return i();
		} finally {
			t$1();
		}
	}
	var r;
	var o = void 0;
	function f(i) {
		var t = o, n = r;
		o = void 0;
		r = void 0;
		try {
			return i();
		} finally {
			o = t;
			r = n;
		}
	}
	var h$1 = void 0;
	var v = 0;
	var s = 0;
	var u = 0;
	var e = 0;
	var c = void 0;
	var d$1 = 0;
	function a(i) {
		if (void 0 !== o) {
			var t = i.n;
			if (void 0 === t || t.t !== o) {
				t = {
					i: 0,
					S: i,
					p: o.s,
					n: void 0,
					t: o,
					e: void 0,
					x: void 0,
					r: t
				};
				if (void 0 !== o.s) o.s.n = t;
				o.s = t;
				i.n = t;
				if (32 & o.f) i.S(t);
				return t;
			} else if (-1 === t.i) {
				t.i = 0;
				if (void 0 !== t.n) {
					t.n.p = t.p;
					if (void 0 !== t.p) t.p.n = t.n;
					t.p = o.s;
					t.n = void 0;
					o.s.n = t;
					o.s = t;
				}
				return t;
			}
		}
	}
	function l$1(i, t) {
		this.v = i;
		this.i = 0;
		this.n = void 0;
		this.t = void 0;
		this.l = 0;
		this.W = null == t ? void 0 : t.watched;
		this.Z = null == t ? void 0 : t.unwatched;
		this.name = null == t ? void 0 : t.name;
	}
	l$1.prototype.brand = i;
	l$1.prototype.h = function() {
		return !0;
	};
	l$1.prototype.S = function(i) {
		var t = this, n = this.t;
		if (n !== i && void 0 === i.e) {
			i.x = n;
			this.t = i;
			if (void 0 !== n) n.e = i;
			else f(function() {
				var i;
				null == (i = t.W) || i.call(t);
			});
		}
	};
	l$1.prototype.U = function(i) {
		var t = this;
		if (void 0 !== this.t) {
			var n = i.e, r = i.x;
			if (void 0 !== n) {
				n.x = r;
				i.e = void 0;
			}
			if (void 0 !== r) {
				r.e = n;
				i.x = void 0;
			}
			if (i === this.t) {
				this.t = r;
				if (void 0 === r) f(function() {
					var i;
					null == (i = t.Z) || i.call(t);
				});
			}
		}
	};
	l$1.prototype.subscribe = function(i) {
		var t = this;
		return j(function() {
			var n = t.value;
			f(function() {
				return i(n);
			});
		}, { name: "sub" });
	};
	l$1.prototype.valueOf = function() {
		return this.value;
	};
	l$1.prototype.toString = function() {
		return this.value + "";
	};
	l$1.prototype.toJSON = function() {
		return this.value;
	};
	l$1.prototype.peek = function() {
		var i = this;
		return f(function() {
			return i.value;
		});
	};
	Object.defineProperty(l$1.prototype, "value", {
		get: function() {
			var i = a(this);
			if (void 0 !== i) i.i = this.i;
			return this.v;
		},
		set: function(i) {
			if (i !== this.v) {
				if (s > 100) throw new Error("Cycle detected");
				(function(i) {
					if (0 !== v && 0 === s) {
						if (i.l !== e) {
							i.l = e;
							c = {
								S: i,
								v: i.v,
								i: i.i,
								o: c
							};
						}
					}
				})(this);
				this.v = i;
				this.i++;
				d$1++;
				v++;
				try {
					for (var n = this.t; void 0 !== n; n = n.x) n.t.N();
				} finally {
					t$1();
				}
			}
		}
	});
	function y$1(i, t) {
		return new l$1(i, t);
	}
	function w$1(i) {
		for (var t = i.s; void 0 !== t; t = t.n) if (t.S.i !== t.i || !t.S.h() || t.S.i !== t.i) return !0;
		return !1;
	}
	function _$1(i) {
		for (var t = i.s; void 0 !== t; t = t.n) {
			var n = t.S.n;
			if (void 0 !== n) t.r = n;
			t.S.n = t;
			t.i = -1;
			if (void 0 === t.n) {
				i.s = t;
				break;
			}
		}
	}
	function b$1(i) {
		var t = i.s, n = void 0;
		while (void 0 !== t) {
			var r = t.p;
			if (-1 === t.i) {
				t.S.U(t);
				if (void 0 !== r) r.n = t.n;
				if (void 0 !== t.n) t.n.p = r;
			} else n = t;
			t.S.n = t.r;
			if (void 0 !== t.r) t.r = void 0;
			t = r;
		}
		i.s = n;
	}
	function p$1(i, t) {
		l$1.call(this, void 0, t);
		this.x = i;
		this.s = void 0;
		this.g = d$1 - 1;
		this.f = 4;
	}
	p$1.prototype = new l$1();
	p$1.prototype.h = function() {
		this.f &= -3;
		if (1 & this.f) return !1;
		if (32 == (36 & this.f)) return !0;
		this.f &= -5;
		if (this.g === d$1) return !0;
		this.g = d$1;
		this.f |= 1;
		if (this.i > 0 && !w$1(this)) {
			this.f &= -2;
			return !0;
		}
		var i = o;
		try {
			_$1(this);
			o = this;
			var t = this.x();
			if (16 & this.f || this.v !== t || 0 === this.i) {
				this.v = t;
				this.f &= -17;
				this.i++;
			}
		} catch (i) {
			this.v = i;
			this.f |= 16;
			this.i++;
		}
		o = i;
		b$1(this);
		this.f &= -2;
		return !0;
	};
	p$1.prototype.S = function(i) {
		if (void 0 === this.t) {
			this.f |= 36;
			for (var t = this.s; void 0 !== t; t = t.n) t.S.S(t);
		}
		l$1.prototype.S.call(this, i);
	};
	p$1.prototype.U = function(i) {
		if (void 0 !== this.t) {
			l$1.prototype.U.call(this, i);
			if (void 0 === this.t) {
				this.f &= -33;
				for (var t = this.s; void 0 !== t; t = t.n) t.S.U(t);
			}
		}
	};
	p$1.prototype.N = function() {
		if (!(2 & this.f)) {
			this.f |= 6;
			for (var i = this.t; void 0 !== i; i = i.x) i.t.N();
		}
	};
	Object.defineProperty(p$1.prototype, "value", { get: function() {
		if (1 & this.f) throw new Error("Cycle detected");
		var i = a(this);
		this.h();
		if (void 0 !== i) i.i = this.i;
		if (16 & this.f) throw this.v;
		return this.v;
	} });
	function g$1(i, t) {
		return new p$1(i, t);
	}
	function S(i) {
		var n = i.m;
		i.m = void 0;
		if ("function" == typeof n) {
			v++;
			var r = o;
			o = void 0;
			try {
				n();
			} catch (t) {
				i.f &= -2;
				i.f |= 8;
				m$1(i);
				throw t;
			} finally {
				o = r;
				t$1();
			}
		}
	}
	function m$1(i) {
		for (var t = i.s; void 0 !== t; t = t.n) t.S.U(t);
		i.x = void 0;
		i.s = void 0;
		S(i);
	}
	function x$1(i) {
		if (o !== this) throw new Error("Out-of-order effect");
		b$1(this);
		o = i;
		this.f &= -2;
		if (8 & this.f) m$1(this);
		t$1();
	}
	function E(i, t) {
		this.x = i;
		this.m = void 0;
		this.s = void 0;
		this.u = void 0;
		this.f = 32;
		this.name = null == t ? void 0 : t.name;
		if (r) r.push(this);
	}
	E.prototype.c = function() {
		var i = this.S();
		try {
			if (8 & this.f) return;
			if (void 0 === this.x) return;
			var t = this.x();
			if ("function" == typeof t) this.m = t;
		} finally {
			i();
		}
	};
	E.prototype.S = function() {
		if (1 & this.f) throw new Error("Cycle detected");
		this.f |= 1;
		this.f &= -9;
		S(this);
		_$1(this);
		v++;
		var i = o;
		o = this;
		return x$1.bind(this, i);
	};
	E.prototype.N = function() {
		if (!(2 & this.f)) {
			this.f |= 2;
			this.u = h$1;
			h$1 = this;
		}
	};
	E.prototype.d = function() {
		this.f |= 8;
		if (!(1 & this.f)) m$1(this);
	};
	E.prototype.dispose = function() {
		this.d();
	};
	function j(i, t) {
		var n = new E(i, t);
		try {
			n.c();
		} catch (i) {
			n.d();
			throw i;
		}
		var r = n.d.bind(n);
		r[Symbol.dispose] = r;
		return r;
	}
	//#endregion
	//#region node_modules/.pnpm/@preact+signals@2.11.1_preact@10.29.8/node_modules/@preact/signals/dist/signals.module.js
	var l;
	var h;
	var d;
	var p = "undefined" != typeof window && !!window.__PREACT_SIGNALS_DEVTOOLS__;
	var m = [];
	var _ = [];
	j(function() {
		l = this.N;
	})();
	function g(i, r) {
		l$3[i] = r.bind(null, l$3[i] || function() {});
	}
	function b(i) {
		if (d) {
			var n = d;
			d = void 0;
			n();
		}
		d = i && i.S();
	}
	function y(i) {
		var n = this, t = i.data, f = useSignal(t);
		f.name = "ReactiveDom";
		f.value = t;
		var e = T$2(function() {
			var i = n, t = n.__v;
			while (t = t.__) if (t.__c) {
				t.__c.__$f |= 4;
				break;
			}
			var o = g$1(function() {
				var i = f.value.value;
				return 0 === i ? 0 : !0 === i ? "" : i || "";
			}), e = g$1(function() {
				return !Array.isArray(o.value) && !t$3(o.value);
			}), a = j(function() {
				this.N = F;
				if (e.value) {
					var n = o.value;
					if (i.__v && i.__v.__e && 3 === i.__v.__e.nodeType) i.__v.__e.data = n;
				}
			}), v = n.__$u.d;
			n.__$u.d = function() {
				a();
				v.call(this);
			};
			return [e, o];
		}, []), a = e[0], v = e[1];
		return a.value ? v.peek() : v.value;
	}
	y.displayName = "ReactiveTextNode";
	Object.defineProperties(l$1.prototype, {
		constructor: {
			configurable: !0,
			value: void 0
		},
		type: {
			configurable: !0,
			value: y
		},
		props: {
			configurable: !0,
			get: function() {
				var i = this;
				return { data: { get value() {
					return i.value;
				} } };
			}
		},
		__b: {
			configurable: !0,
			value: 1
		}
	});
	g("__b", function(i, n) {
		if ("string" == typeof n.type) {
			var r, t = n.props;
			for (var o in t) if ("children" !== o) {
				var f = t[o];
				if (f instanceof l$1) {
					if (!r) n.__np = r = {};
					r[o] = f;
					t[o] = f.peek();
				}
			}
		}
		i(n);
	});
	g("__r", function(i, n) {
		i(n);
		if (n.type !== S$1) {
			b();
			var r, o = n.__c;
			if (o) {
				o.__$f &= -2;
				if (void 0 === (r = o.__$u)) o.__$u = r = function(i, n) {
					var r;
					j(function() {
						r = this;
					}, { name: n });
					r.c = i;
					return r;
				}(function(i) {
					return function() {
						var n;
						if (p) null == (n = this.y) || n.call(this);
						i.__$f |= 1;
						i.setState({});
					};
				}(o), "function" == typeof n.type ? n.type.displayName || n.type.name : "");
			}
			h = o;
			b(r);
		}
	});
	g("__e", function(i, n, r, t) {
		b();
		h = void 0;
		i(n, r, t);
	});
	g("diffed", function(i, n) {
		b();
		h = void 0;
		var r;
		if ("string" == typeof n.type && (r = n.__e)) {
			var t = n.__np, o = n.props, f = r.U;
			if (f) for (var e in f) {
				var u = f[e];
				if (!(void 0 === u || t && e in t)) {
					u.d();
					f[e] = void 0;
				}
			}
			if (t) {
				if (!f) {
					f = {};
					r.U = f;
				}
				for (var a in t) {
					var c = f[a], v = t[a];
					if (void 0 === c) {
						c = w(r, a, v, o);
						f[a] = c;
					} else c.o(v, o);
				}
			}
		}
		i(n);
	});
	function w(i, n, r, t) {
		var o = n in i && void 0 === i.ownerSVGElement, f = y$1(r);
		return {
			o: function(i, n) {
				f.value = i;
				t = n;
			},
			d: j(function() {
				this.N = F;
				var r = f.value.value;
				if (t[n] !== r) {
					t[n] = r;
					if (o) i[n] = r;
					else if (null != r && (!1 !== r || "-" === n[4])) i.setAttribute(n, r);
					else i.removeAttribute(n);
				}
			})
		};
	}
	g("unmount", function(i, n) {
		if ("string" == typeof n.type) {
			var r = n.__e;
			if (r) {
				var t = r.U;
				if (t) {
					r.U = void 0;
					for (var o in t) {
						var f = t[o];
						if (f) f.d();
					}
				}
			}
			var e = n.__np;
			if (e) {
				var u = n.props;
				for (var a in e) u[a] = e[a];
			}
			n.__np = void 0;
		} else {
			var c = n.__c;
			if (c) {
				var v = c.__$u;
				if (v) {
					c.__$u = void 0;
					v.d();
				}
			}
		}
		i(n);
	});
	g("__h", function(i, n, r, t) {
		if (t < 3) n.__$f |= 2;
		i(n, r, t);
	});
	C$1.prototype.shouldComponentUpdate = function(i, n) {
		if (this.__R) return !0;
		var r = this.__$u, t = r && void 0 !== r.s;
		for (var o in n) return !0;
		if (this.__f || "boolean" == typeof this.u && !0 === this.u) {
			var f = 2 & this.__$f;
			if (!(t || f || 4 & this.__$f)) return !0;
			if (1 & this.__$f) return !0;
		} else {
			if (!(t || 4 & this.__$f)) return !0;
			if (3 & this.__$f) return !0;
		}
		for (var e in i) if ("__source" !== e && i[e] !== this.props[e]) return !0;
		for (var u in this.props) if (!(u in i)) return !0;
		return !1;
	};
	function useSignal(i, n) {
		return T$2(function() {
			return y$1(i, n);
		}, []);
	}
	function useComputed(i, n) {
		var r = A$2(i);
		r.current = i;
		h.__$f |= 4;
		return T$2(function() {
			return g$1(function() {
				return r.current();
			}, n);
		}, []);
	}
	var k = "undefined" == typeof requestAnimationFrame ? setTimeout : function(i) {
		var n = function() {
			clearTimeout(r);
			cancelAnimationFrame(t);
			i();
		}, r = setTimeout(n, 35), t = requestAnimationFrame(n);
	};
	var q = function(i) {
		queueMicrotask(function() {
			queueMicrotask(i);
		});
	};
	function A() {
		n(function() {
			var i;
			while (i = m.shift()) l.call(i);
		});
	}
	function T() {
		if (1 === m.push(this)) (l$3.requestAnimationFrame || k)(A);
	}
	function x() {
		n(function() {
			var i;
			while (i = _.shift()) l.call(i);
		});
	}
	function F() {
		if (1 === _.push(this)) (l$3.requestAnimationFrame || q)(x);
	}
	function useSignalEffect(i, n) {
		var r = A$2(i);
		r.current = i;
		h$2(function() {
			return j(function() {
				this.N = T;
				return r.current();
			}, n);
		}, []);
	}
	//#endregion
	//#region node_modules/.pnpm/@schedule-x+calendar@4.6.1_@preact+signals@2.11.1_preact@10.29.8__preact@10.29.8_temporal-polyfill@0.3.0/node_modules/@schedule-x/calendar/dist/core.js
	const AppContext$1 = X$1({});
	var img = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e%3c!-- Uploaded to: SVG Repo%2c www.svgrepo.com%2c Generator: SVG Repo Mixer Tools --%3e%3csvg width='800px' height='800px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M6 9L12 15L18 9' stroke='%23B8B5B8' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e";
	/**
	* Can be used for generating a random id for an entity
	* Should, however, never be used in potentially resource intense loops,
	* since the performance cost of this compared to new Date().getTime() is ca x4 in v8
	* */
	const randomStringId = () => "s" + Math.random().toString(36).substring(2, 11);
	const isKeyEnterOrSpace = (keyboardEvent) => keyboardEvent.key === "Enter" || keyboardEvent.key === " ";
	function AppInput() {
		const datePickerInputId = randomStringId();
		const datePickerLabelId = randomStringId();
		const inputWrapperId = randomStringId();
		const $app = x$2(AppContext$1);
		const [wrapperClasses, setWrapperClasses] = d$2([]);
		const setInputElement = () => {
			const inputWrapperEl = document.getElementById(inputWrapperId);
			$app.datePickerState.inputWrapperElement.value = inputWrapperEl instanceof HTMLDivElement ? inputWrapperEl : void 0;
		};
		h$2(() => {
			if ($app.config.teleportTo) setInputElement();
			const newClasses = ["sx__date-input-wrapper"];
			if ($app.datePickerState.isOpen.value) newClasses.push("sx__date-input--active");
			setWrapperClasses(newClasses);
		}, [$app.datePickerState.isOpen.value]);
		const handleKeyUp = (event) => {
			if (event.key === "Enter") handleInputValue(event);
		};
		const handleInputValue = (event) => {
			event.stopPropagation();
			try {
				$app.datePickerState.handleInput(event.target.value);
				$app.datePickerState.close();
			} catch (e) {
				console.log("Error setting input value:" + e);
			}
		};
		h$2(() => {
			const inputElement = typeof document !== "undefined" && document.getElementById(datePickerInputId);
			if (typeof HTMLElement === "undefined" || !(inputElement instanceof HTMLElement)) return;
			inputElement.addEventListener("change", handleInputValue);
			return () => inputElement.removeEventListener("change", handleInputValue);
		});
		h$2(() => {
			if ($app.config.hasPlaceholder) $app.datePickerState.inputDisplayedValue.value = $app.translate("MM/DD/YYYY");
		}, []);
		const handleClick = () => {
			$app.datePickerState.open();
		};
		const handleButtonKeyDown = (keyboardEvent) => {
			if (isKeyEnterOrSpace(keyboardEvent)) {
				keyboardEvent.preventDefault();
				$app.datePickerState.open();
				setTimeout(() => {
					const element = document.querySelector("[data-focus=\"true\"]");
					if (element instanceof HTMLElement) element.focus();
				}, 50);
			}
		};
		return u$2(S$1, { children: u$2("div", {
			className: wrapperClasses.join(" "),
			id: inputWrapperId,
			children: [
				u$2("label", {
					for: datePickerInputId,
					id: datePickerLabelId,
					className: "sx__date-input-label",
					children: $app.config.label || $app.translate("Date")
				}),
				u$2("input", {
					id: datePickerInputId,
					tabIndex: $app.datePickerState.isDisabled.value ? -1 : 0,
					name: $app.config.name || "date",
					"aria-describedby": datePickerLabelId,
					value: $app.datePickerState.inputDisplayedValue.value,
					"data-testid": "date-picker-input",
					className: "sx__date-input",
					onClick: handleClick,
					onKeyUp: handleKeyUp,
					type: "text"
				}),
				u$2("button", {
					type: "button",
					tabIndex: $app.datePickerState.isDisabled.value ? -1 : 0,
					"aria-label": $app.translate("Choose Date"),
					onKeyDown: handleButtonKeyDown,
					onClick: () => $app.datePickerState.open(),
					className: "sx__button sx__date-input-chevron-wrapper",
					children: u$2("img", {
						className: "sx__date-input-chevron",
						src: img,
						alt: ""
					})
				})
			]
		}) });
	}
	var DatePickerView;
	(function(DatePickerView) {
		DatePickerView["MONTH_DAYS"] = "month-days";
		DatePickerView["YEARS"] = "years";
	})(DatePickerView || (DatePickerView = {}));
	const YEARS_VIEW = "years-view";
	const MONTH_VIEW = "months-view";
	const DATE_PICKER_WEEK = "date-picker-week";
	const toLocalizedMonth = (date, locale) => {
		return date.toLocaleString(locale, { month: "long" });
	};
	const toLocalizedDateString = (date, locale) => {
		return date.toLocaleString(locale, {
			month: "numeric",
			day: "numeric",
			year: "numeric"
		});
	};
	const getOneLetterDayNames = (week, locale) => {
		return week.map((date) => {
			return date.toLocaleString(locale, { weekday: "short" }).charAt(0);
		});
	};
	const getDayNameShort = (date, locale) => {
		if (locale === "he-IL") return date.toLocaleString(locale, { weekday: "narrow" });
		return date.toLocaleString(locale, { weekday: "short" });
	};
	const getDayNamesShort = (week, locale) => {
		return week.map((date) => getDayNameShort(date, locale));
	};
	const getOneLetterOrShortDayNames = (week, locale) => {
		if ([
			"zh-cn",
			"zh-tw",
			"ca-es",
			"he-il"
		].includes(locale.toLowerCase())) return getDayNamesShort(week, locale);
		return getOneLetterDayNames(week, locale);
	};
	const DateFormats = {
		DATE_STRING: /^\d{4}-\d{2}-\d{2}$/,
		DATE_TIME_STRING: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/
	};
	var InvalidDateTimeError = class extends Error {
		constructor(dateTimeSpecification) {
			super(`Invalid date time specification: ${dateTimeSpecification}`);
		}
	};
	const toJSDate = (dateTimeSpecification) => {
		if (!DateFormats.DATE_TIME_STRING.test(dateTimeSpecification) && !DateFormats.DATE_STRING.test(dateTimeSpecification)) throw new InvalidDateTimeError(dateTimeSpecification);
		return new Date(Number(dateTimeSpecification.slice(0, 4)), Number(dateTimeSpecification.slice(5, 7)) - 1, Number(dateTimeSpecification.slice(8, 10)), Number(dateTimeSpecification.slice(11, 13)), Number(dateTimeSpecification.slice(14, 16)));
	};
	const toIntegers = (dateTimeSpecification) => {
		const hours = dateTimeSpecification.slice(11, 13), minutes = dateTimeSpecification.slice(14, 16);
		return {
			year: Number(dateTimeSpecification.slice(0, 4)),
			month: Number(dateTimeSpecification.slice(5, 7)) - 1,
			date: Number(dateTimeSpecification.slice(8, 10)),
			hours: hours !== "" ? Number(hours) : void 0,
			minutes: minutes !== "" ? Number(minutes) : void 0
		};
	};
	var NumberRangeError = class extends Error {
		constructor(min, max) {
			super(`Number must be between ${min} and ${max}.`);
			Object.defineProperty(this, "min", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: min
			});
			Object.defineProperty(this, "max", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: max
			});
		}
	};
	const doubleDigit = (number) => {
		if (number < 0 || number > 99) throw new NumberRangeError(0, 99);
		return String(number).padStart(2, "0");
	};
	const toDateString$1 = (date) => {
		return `${date.year}-${doubleDigit(date.month)}-${doubleDigit(date.day)}`;
	};
	const addMonths = (to, nMonths) => {
		if (nMonths < 0) return to.subtract({ months: -nMonths });
		return to.add({ months: nMonths });
	};
	const addDays = (to, nDays) => {
		if (nDays < 0) return to.subtract({ days: -nDays });
		return to.add({ days: nDays });
	};
	const getFirstDayOPreviousMonth = (date) => {
		return addMonths(date, -1).with({ day: 1 });
	};
	const getFirstDayOfNextMonth = (date) => {
		return addMonths(date, 1).with({ day: 1 });
	};
	function Chevron({ direction, onClick, buttonText, disabled = false }) {
		const handleKeyDown = (keyboardEvent) => {
			if (isKeyEnterOrSpace(keyboardEvent)) onClick();
		};
		return u$2("button", {
			type: "button",
			disabled,
			className: "sx__button sx__chevron-wrapper sx__ripple",
			onMouseUp: onClick,
			onKeyDown: handleKeyDown,
			tabIndex: 0,
			children: u$2("i", {
				className: `sx__chevron sx__chevron--${direction}`,
				children: buttonText
			})
		});
	}
	function MonthViewHeader({ setYearsView }) {
		const $app = x$2(AppContext$1);
		const dateStringToLocalizedMonthName = (selectedDate) => {
			return toLocalizedMonth(selectedDate, $app.config.locale.value);
		};
		const getYearFrom = (datePickerDate) => {
			return datePickerDate.year;
		};
		const [selectedDateMonthName, setSelectedDateMonthName] = d$2(dateStringToLocalizedMonthName($app.datePickerState.datePickerDate.value));
		const [datePickerYear, setDatePickerYear] = d$2(getYearFrom($app.datePickerState.datePickerDate.value));
		const setPreviousMonth = () => {
			$app.datePickerState.datePickerDate.value = getFirstDayOPreviousMonth($app.datePickerState.datePickerDate.value);
		};
		const setNextMonth = () => {
			$app.datePickerState.datePickerDate.value = getFirstDayOfNextMonth($app.datePickerState.datePickerDate.value);
		};
		h$2(() => {
			setSelectedDateMonthName(dateStringToLocalizedMonthName($app.datePickerState.datePickerDate.value));
			setDatePickerYear(getYearFrom($app.datePickerState.datePickerDate.value));
		}, [$app.datePickerState.datePickerDate.value]);
		const handleOpenYearsView = (e) => {
			e.stopPropagation();
			setYearsView();
		};
		return u$2(S$1, { children: u$2("header", {
			className: "sx__date-picker__month-view-header",
			children: [
				u$2(Chevron, {
					direction: "previous",
					onClick: () => setPreviousMonth(),
					buttonText: $app.translate("Previous month")
				}),
				u$2("button", {
					type: "button",
					className: "sx__button sx__date-picker__month-view-header__month-year",
					onClick: (event) => handleOpenYearsView(event),
					children: selectedDateMonthName + " " + datePickerYear
				}),
				u$2(Chevron, {
					direction: "next",
					onClick: () => setNextMonth(),
					buttonText: $app.translate("Next month")
				})
			]
		}) });
	}
	function DayNames() {
		const $app = x$2(AppContext$1);
		const aWeek = $app.timeUnitsImpl.getWeekFor($app.datePickerState.datePickerDate.value);
		return u$2("div", {
			className: "sx__date-picker__day-names",
			children: getOneLetterOrShortDayNames(aWeek, $app.config.locale.value).map((dayName) => u$2("span", {
				"data-testid": "day-name",
				className: "sx__date-picker__day-name",
				children: dayName
			}))
		});
	}
	const isToday = (date, timezone) => {
		const today = Temporal.Now.zonedDateTimeISO(timezone);
		return date.day === today.day && date.month === today.month && date.year === today.year;
	};
	const isSameMonth = (date1, date2) => {
		return date1.month === date2.month && date1.year === date2.year;
	};
	const isSameDay = (date1, date2) => {
		return date1.day === date2.day && date1.month === date2.month && date1.year === date2.year;
	};
	/**
	* Origin of SVG: https://www.svgrepo.com/svg/506771/time
	* License: PD License
	* Author Salah Elimam
	* Author website: https://www.figma.com/@salahelimam
	* */
	function TimeIcon({ strokeColor }) {
		return u$2(S$1, { children: u$2("svg", {
			className: "sx__event-icon",
			viewBox: "0 0 24 24",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			children: [
				u$2("g", {
					id: "SVGRepo_bgCarrier",
					"stroke-width": "0"
				}),
				u$2("g", {
					id: "SVGRepo_tracerCarrier",
					"stroke-linecap": "round",
					"stroke-linejoin": "round"
				}),
				u$2("g", {
					id: "SVGRepo_iconCarrier",
					children: [u$2("path", {
						d: "M12 8V12L15 15",
						stroke: strokeColor,
						"stroke-width": "2",
						"stroke-linecap": "round"
					}), u$2("circle", {
						cx: "12",
						cy: "12",
						r: "9",
						stroke: strokeColor,
						"stroke-width": "2"
					})]
				})
			]
		}) });
	}
	/**
	* Origin of SVG: https://www.svgrepo.com/svg/506772/user
	* License: PD License
	* Author Salah Elimam
	* Author website: https://www.figma.com/@salahelimam
	* */
	function UserIcon({ strokeColor }) {
		return u$2(S$1, { children: u$2("svg", {
			className: "sx__event-icon",
			viewBox: "0 0 24 24",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			children: [
				u$2("g", {
					id: "SVGRepo_bgCarrier",
					"stroke-width": "0"
				}),
				u$2("g", {
					id: "SVGRepo_tracerCarrier",
					"stroke-linecap": "round",
					"stroke-linejoin": "round"
				}),
				u$2("g", {
					id: "SVGRepo_iconCarrier",
					children: [u$2("path", {
						d: "M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7Z",
						stroke: strokeColor,
						"stroke-width": "2"
					}), u$2("path", {
						d: "M5 19.5C5 15.9101 7.91015 13 11.5 13H12.5C16.0899 13 19 15.9101 19 19.5V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V19.5Z",
						stroke: strokeColor,
						"stroke-width": "2"
					})]
				})
			]
		}) });
	}
	/**
	* Origin of SVG: https://www.svgrepo.com/svg/489502/location-pin
	* License: PD License
	* Author: Dariush Habibpour
	* Author website: https://redl.ink/dariush/links?ref=svgrepo.com
	* */
	function LocationPinIcon({ strokeColor }) {
		return u$2(S$1, { children: u$2("svg", {
			className: "sx__event-icon",
			viewBox: "0 0 24 24",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			children: [
				u$2("g", {
					id: "SVGRepo_bgCarrier",
					"stroke-width": "0"
				}),
				u$2("g", {
					id: "SVGRepo_tracerCarrier",
					"stroke-linecap": "round",
					"stroke-linejoin": "round"
				}),
				u$2("g", {
					id: "SVGRepo_iconCarrier",
					children: [u$2("g", {
						"clip-path": "url(#clip0_429_11046)",
						children: [u$2("rect", {
							x: "12",
							y: "11",
							width: "0.01",
							height: "0.01",
							stroke: strokeColor,
							"stroke-width": "2",
							"stroke-linejoin": "round"
						}), u$2("path", {
							d: "M12 22L17.5 16.5C20.5376 13.4624 20.5376 8.53757 17.5 5.5C14.4624 2.46244 9.53757 2.46244 6.5 5.5C3.46244 8.53757 3.46244 13.4624 6.5 16.5L12 22Z",
							stroke: strokeColor,
							"stroke-width": "2",
							"stroke-linejoin": "round"
						})]
					}), u$2("defs", { children: u$2("clipPath", {
						id: "clip0_429_11046",
						children: u$2("rect", {
							width: "24",
							height: "24",
							fill: "white"
						})
					}) })]
				})
			]
		}) });
	}
	var InvalidTimeStringError = class extends Error {
		constructor(timeString) {
			super(`Invalid time string: ${timeString}`);
		}
	};
	const timeStringRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]/;
	const minuteTimePointMultiplier = 1.6666666666666667;
	const timePointsFromString = (timeString) => {
		if (!timeStringRegex.test(timeString) && timeString !== "24:00") throw new InvalidTimeStringError(timeString);
		const [hoursInt, minutesInt] = timeString.split(":").map((time) => parseInt(time, 10));
		let minutePoints = (minutesInt * minuteTimePointMultiplier).toString();
		if (minutePoints.split(".")[0].length < 2) minutePoints = `0${minutePoints}`;
		return Number(hoursInt + minutePoints);
	};
	const timeStringFromTimePoints = (timePoints) => {
		const hours = Math.floor(timePoints / 100);
		const minutes = Math.round(timePoints % 100 / minuteTimePointMultiplier);
		return `${doubleDigit(hours)}:${doubleDigit(minutes)}`;
	};
	const addTimePointsToDateTime = (dateTime, pointsToAdd) => {
		const minutesToAdd = Math.round(pointsToAdd / minuteTimePointMultiplier);
		return dateTime.add({ minutes: minutesToAdd });
	};
	const dateFromDateTime = (dateTime) => {
		return dateTime.slice(0, 10);
	};
	const timeFromDateTime = (dateTime) => {
		return dateTime.slice(11);
	};
	var WeekDay;
	(function(WeekDay) {
		WeekDay[WeekDay["MONDAY"] = 1] = "MONDAY";
		WeekDay[WeekDay["TUESDAY"] = 2] = "TUESDAY";
		WeekDay[WeekDay["WEDNESDAY"] = 3] = "WEDNESDAY";
		WeekDay[WeekDay["THURSDAY"] = 4] = "THURSDAY";
		WeekDay[WeekDay["FRIDAY"] = 5] = "FRIDAY";
		WeekDay[WeekDay["SATURDAY"] = 6] = "SATURDAY";
		WeekDay[WeekDay["SUNDAY"] = 7] = "SUNDAY";
	})(WeekDay || (WeekDay = {}));
	const DEFAULT_LOCALE = "en-US";
	const DEFAULT_FIRST_DAY_OF_WEEK = WeekDay.MONDAY;
	const DEFAULT_EVENT_COLOR_NAME = "primary";
	var CalendarEventImpl = class {
		constructor(_config, id, _start, _end, title, people, location, description, calendarId, _options = void 0, _customContent = {}, _foreignProperties = {}, resourceId) {
			Object.defineProperty(this, "_config", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _config
			});
			Object.defineProperty(this, "id", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: id
			});
			Object.defineProperty(this, "_start", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _start
			});
			Object.defineProperty(this, "_end", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _end
			});
			Object.defineProperty(this, "title", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: title
			});
			Object.defineProperty(this, "people", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: people
			});
			Object.defineProperty(this, "location", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: location
			});
			Object.defineProperty(this, "description", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: description
			});
			Object.defineProperty(this, "calendarId", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: calendarId
			});
			Object.defineProperty(this, "_options", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _options
			});
			Object.defineProperty(this, "_customContent", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _customContent
			});
			Object.defineProperty(this, "_foreignProperties", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _foreignProperties
			});
			Object.defineProperty(this, "resourceId", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: resourceId
			});
			Object.defineProperty(this, "_previousConcurrentEvents", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "_totalConcurrentEvents", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "_maxConcurrentEvents", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "_nDaysInGrid", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "_createdAt", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "_originalTimezone", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "_eventFragments", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: {}
			});
			this._originalTimezone = this._start instanceof Temporal.ZonedDateTime ? this._start.timeZoneId : void 0;
		}
		get start() {
			if (this._start instanceof Temporal.PlainDate) return this._start;
			return this._start.withTimeZone(this._config.timezone.value);
		}
		set start(value) {
			this._start = value instanceof Temporal.ZonedDateTime ? value.withTimeZone(this._originalTimezone) : value;
		}
		get end() {
			if (this._end instanceof Temporal.PlainDate) return this._end;
			return this._end.withTimeZone(this._config.timezone.value);
		}
		set end(value) {
			this._end = value instanceof Temporal.ZonedDateTime ? value.withTimeZone(this._originalTimezone) : value;
		}
		get _isSingleDayTimed() {
			if (this.start instanceof Temporal.PlainDate || this.end instanceof Temporal.PlainDate) return false;
			return dateFromDateTime(this.start.toString()) === dateFromDateTime(this.end.toString());
		}
		get _isSingleDayFullDay() {
			return dateFromDateTime(this.start.toString()) === dateFromDateTime(this.end.toString()) && this.start instanceof Temporal.PlainDate && this.end instanceof Temporal.PlainDate;
		}
		get _isMultiDayTimed() {
			if (this.start instanceof Temporal.PlainDate || this.end instanceof Temporal.PlainDate) return false;
			return dateFromDateTime(this.start.toString()) !== dateFromDateTime(this.end.toString());
		}
		get _isMultiDayFullDay() {
			const startDate = dateFromDateTime(this.start.toString());
			const endDate = dateFromDateTime(this.end.toString());
			return this.start instanceof Temporal.PlainDate && this.end instanceof Temporal.PlainDate && startDate !== endDate;
		}
		get _isSingleHybridDayTimed() {
			if (!this._config.isHybridDay) return false;
			if (this.start instanceof Temporal.PlainDate || this.end instanceof Temporal.PlainDate) return false;
			const startDate = dateFromDateTime(this.start.toString());
			const endDate = dateFromDateTime(this.end.toString());
			const endDateMinusOneDay = toDateString$1(Temporal.PlainDate.from(endDate).subtract({ days: 1 }));
			if (startDate !== endDate && startDate !== endDateMinusOneDay) return false;
			const dayBoundaries = this._config.dayBoundaries.value;
			const eventStartTimePoints = timePointsFromString(timeFromDateTime(this.start.toString()));
			const eventEndTimePoints = timePointsFromString(timeFromDateTime(this.end.toString()));
			const eventIsFullyInFirstDayOfBoundary = eventEndTimePoints > eventStartTimePoints && startDate === endDate;
			return eventStartTimePoints >= dayBoundaries.start && (eventEndTimePoints <= dayBoundaries.end || eventIsFullyInFirstDayOfBoundary) || eventStartTimePoints < dayBoundaries.end && eventEndTimePoints <= dayBoundaries.end;
		}
		get _color() {
			if (this.calendarId && this._config.calendars.value && this.calendarId in this._config.calendars.value) return this._config.calendars.value[this.calendarId].colorName;
			return DEFAULT_EVENT_COLOR_NAME;
		}
		_getForeignProperties() {
			return this._foreignProperties;
		}
		_getExternalEvent() {
			return {
				id: this.id,
				start: this._start,
				end: this._end,
				title: this.title,
				people: this.people,
				location: this.location,
				description: this.description,
				calendarId: this.calendarId,
				resourceId: this.resourceId,
				_options: this._options,
				...this._getForeignProperties()
			};
		}
	};
	var CalendarEventBuilder = class {
		constructor(_config, id, start, end) {
			Object.defineProperty(this, "_config", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _config
			});
			Object.defineProperty(this, "id", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: id
			});
			Object.defineProperty(this, "start", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: start
			});
			Object.defineProperty(this, "end", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: end
			});
			Object.defineProperty(this, "people", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "location", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "description", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "title", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "calendarId", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "resourceId", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "_foreignProperties", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: {}
			});
			Object.defineProperty(this, "_options", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "_customContent", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: {}
			});
		}
		build() {
			return new CalendarEventImpl(this._config, this.id, this.start, this.end, this.title, this.people, this.location, this.description, this.calendarId, this._options, this._customContent, this._foreignProperties, this.resourceId);
		}
		withTitle(title) {
			this.title = title;
			return this;
		}
		withPeople(people) {
			this.people = people;
			return this;
		}
		withLocation(location) {
			this.location = location;
			return this;
		}
		withDescription(description) {
			this.description = description;
			return this;
		}
		withForeignProperties(foreignProperties) {
			this._foreignProperties = foreignProperties;
			return this;
		}
		withCalendarId(calendarId) {
			this.calendarId = calendarId;
			return this;
		}
		withOptions(options) {
			this._options = options;
			return this;
		}
		withCustomContent(customContent) {
			this._customContent = customContent;
			return this;
		}
		withResourceId(resourceId) {
			this.resourceId = resourceId;
			return this;
		}
	};
	const deepCloneEvent = (calendarEvent, $app) => {
		const calendarEventInternal = new CalendarEventBuilder($app.config, calendarEvent.id, calendarEvent._start, calendarEvent._end).withTitle(calendarEvent.title).withPeople(calendarEvent.people).withCalendarId(calendarEvent.calendarId).withForeignProperties(JSON.parse(JSON.stringify(calendarEvent._getForeignProperties()))).withLocation(calendarEvent.location).withDescription(calendarEvent.description).withOptions(calendarEvent._options).withCustomContent(calendarEvent._customContent).build();
		calendarEventInternal._nDaysInGrid = calendarEvent._nDaysInGrid;
		return calendarEventInternal;
	};
	const getTimeGridEventCopyElementId = (id) => {
		return "time-grid-event-copy-" + id;
	};
	const isUIEventTouchEvent = (event) => {
		return "touches" in event && typeof event.touches === "object";
	};
	const getEventCoordinates = (uiEvent) => {
		const actualEvent = isUIEventTouchEvent(uiEvent) ? uiEvent.touches[0] : uiEvent;
		return {
			clientX: actualEvent.clientX,
			clientY: actualEvent.clientY
		};
	};
	const concatenatePeople = (people) => {
		return people.reduce((acc, person, index) => {
			if (index === 0) return person;
			if (index === people.length - 1) return `${acc} & ${person}`;
			return `${acc}, ${person}`;
		}, "");
	};
	const dateFn = (dateTime, locale) => {
		return dateTime.toLocaleString(locale, {
			day: "numeric",
			month: "long",
			year: "numeric"
		});
	};
	const getLocalizedDate$1 = dateFn;
	const timeFn = (dateTime, locale) => {
		const dateTimeString = dateTime.toString();
		const { year, month, date, hours, minutes } = toIntegers(dateTimeString);
		return new Date(year, month, date, hours, minutes).toLocaleTimeString(locale, {
			hour: "numeric",
			minute: "numeric"
		});
	};
	const getTimeStamp = (calendarEvent, locale, delimiter = "–") => {
		var _a, _b, _c, _d;
		const eventTime = {
			start: calendarEvent.start,
			end: calendarEvent.end
		};
		if (calendarEvent._isSingleDayFullDay) return dateFn(eventTime.start, locale);
		if (calendarEvent._isMultiDayFullDay) return `${dateFn(eventTime.start, locale)} ${delimiter} ${dateFn(eventTime.end, locale)}`;
		if (calendarEvent._isSingleDayTimed && ((_a = eventTime.start) === null || _a === void 0 ? void 0 : _a.toString()) !== ((_b = eventTime.end) === null || _b === void 0 ? void 0 : _b.toString())) return `${dateFn(eventTime.start, locale)} <span aria-hidden="true">⋅</span> ${timeFn(eventTime.start, locale)} ${delimiter} ${timeFn(eventTime.end, locale)}`;
		if (calendarEvent._isSingleDayTimed && ((_c = calendarEvent.start) === null || _c === void 0 ? void 0 : _c.toString()) === ((_d = calendarEvent.end) === null || _d === void 0 ? void 0 : _d.toString())) return `${dateFn(eventTime.start, locale)}, ${timeFn(eventTime.start, locale)}`;
		return `${dateFn(eventTime.start, locale)}, ${timeFn(eventTime.start, locale)} ${delimiter} ${dateFn(eventTime.end, locale)}, ${timeFn(eventTime.end, locale)}`;
	};
	/**
	* Push a task to the end of the current call stack
	* */
	const nextTick = (cb) => {
		setTimeout(() => {
			cb();
		});
	};
	const focusModal = ($app) => {
		const calendarWrapper = $app.elements.calendarWrapper;
		if (!(calendarWrapper instanceof HTMLElement)) return;
		const eventModal = calendarWrapper.querySelector(".sx__event-modal");
		if (!(eventModal instanceof HTMLElement)) return;
		setTimeout(() => {
			eventModal.focus();
		}, 100);
	};
	const invokeOnEventClickCallback = ($app, calendarEvent, e) => {
		if ($app.config.callbacks.onEventClick) $app.config.callbacks.onEventClick(calendarEvent._getExternalEvent(), e);
	};
	const invokeOnEventDoubleClickCallback = ($app, calendarEvent, e) => {
		if ($app.config.callbacks.onDoubleClickEvent) $app.config.callbacks.onDoubleClickEvent(calendarEvent._getExternalEvent(), e);
	};
	const timePointToPercentage = (timePointsInDay, dayBoundaries, timePoint) => {
		if (timePoint < dayBoundaries.start) return (timePoint + (2400 - dayBoundaries.start)) / timePointsInDay * 100;
		return (timePoint - dayBoundaries.start) / timePointsInDay * 100;
	};
	const getYCoordinateInTimeGrid = (dateTime, dayBoundaries, pointsPerDay) => {
		return timePointToPercentage(pointsPerDay, dayBoundaries, timePointsFromString(timeFromDateTime(dateTime.toString())));
	};
	var PluginName;
	(function(PluginName) {
		PluginName["DragAndDrop"] = "dragAndDrop";
		PluginName["EventModal"] = "eventModal";
		PluginName["ScrollController"] = "scrollController";
		PluginName["EventRecurrence"] = "eventRecurrence";
		PluginName["Resize"] = "resize";
		PluginName["CalendarControls"] = "calendarControls";
		PluginName["CurrentTime"] = "currentTime";
	})(PluginName || (PluginName = {}));
	const AppContext = X$1({});
	var PreactView = class {
		constructor(config) {
			Object.defineProperty(this, "randomId", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: randomStringId()
			});
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "label", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "Component", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "setDateRange", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "hasSmallScreenCompat", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "hasWideScreenCompat", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "backwardForwardFn", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "backwardForwardUnits", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			this.name = config.name;
			this.label = config.label;
			this.Component = config.Component;
			this.setDateRange = config.setDateRange;
			this.hasSmallScreenCompat = config.hasSmallScreenCompat;
			this.hasWideScreenCompat = config.hasWideScreenCompat;
			this.backwardForwardFn = config.backwardForwardFn;
			this.backwardForwardUnits = config.backwardForwardUnits;
		}
		render(onElement, $app) {
			R(k$2(this.Component, {
				$app,
				id: this.randomId
			}), onElement);
		}
		destroy() {
			const el = document.getElementById(this.randomId);
			if (el) el.remove();
		}
	};
	const createPreactView = (config) => {
		return new PreactView(config);
	};
	function MonthViewWeek({ week }) {
		const $app = x$2(AppContext$1);
		const weekDays = week.map((day) => {
			const classes = ["sx__date-picker__day"];
			if (isToday(day, $app.config.timezone.value)) classes.push("sx__date-picker__day--today");
			if (isSameDay(day, $app.datePickerState.selectedDate.value)) classes.push("sx__date-picker__day--selected");
			if (!isSameMonth(day, $app.datePickerState.datePickerDate.value)) classes.push("is-leading-or-trailing");
			return {
				day: day.toPlainDate(),
				classes
			};
		});
		const isDateSelectable = (date) => {
			return date.toString() >= $app.config.min.toString() && date.toString() <= $app.config.max.toString();
		};
		const selectDate = (date) => {
			$app.datePickerState.selectedDate.value = date;
			$app.datePickerState.close();
		};
		const hasFocus = (weekDay) => isSameDay(weekDay.day, $app.datePickerState.datePickerDate.value);
		const handleKeyDown = (event) => {
			if (event.key === "Enter") {
				$app.datePickerState.selectedDate.value = $app.datePickerState.datePickerDate.value;
				$app.datePickerState.close();
				return;
			}
			const keyMapDaysToAdd = /* @__PURE__ */ new Map([
				["ArrowDown", 7],
				["ArrowUp", -7],
				["ArrowLeft", -1],
				["ArrowRight", 1]
			]);
			$app.datePickerState.datePickerDate.value = addDays($app.datePickerState.datePickerDate.value, keyMapDaysToAdd.get(event.key) || 0);
		};
		return u$2(S$1, { children: u$2("div", {
			"data-testid": DATE_PICKER_WEEK,
			className: "sx__date-picker__week",
			children: weekDays.map((weekDay) => u$2("button", {
				type: "button",
				tabIndex: hasFocus(weekDay) ? 0 : -1,
				disabled: !isDateSelectable(weekDay.day),
				"aria-label": getLocalizedDate$1($app.datePickerState.datePickerDate.value, $app.config.locale.value),
				className: `sx__button ${weekDay.classes.join(" ")}`,
				"data-focus": hasFocus(weekDay) ? "true" : void 0,
				onClick: () => selectDate(weekDay.day),
				onKeyDown: handleKeyDown,
				children: weekDay.day.day
			}))
		}) });
	}
	function MonthView({ seatYearsView }) {
		const elementId = randomStringId();
		const $app = x$2(AppContext$1);
		const [month, setMonth] = d$2([]);
		const renderMonth = () => {
			const newDatePickerDate = $app.datePickerState.datePickerDate.value;
			setMonth($app.timeUnitsImpl.getMonthWithTrailingAndLeadingDays(newDatePickerDate.year, newDatePickerDate.month));
		};
		h$2(() => {
			renderMonth();
		}, [$app.datePickerState.datePickerDate.value]);
		h$2(() => {
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					const mutatedElement = mutation.target;
					if (mutatedElement.dataset.focus === "true") mutatedElement.focus();
				});
			});
			const monthViewElement = document.getElementById(elementId);
			observer.observe(monthViewElement, {
				childList: true,
				subtree: true,
				attributes: true
			});
			return () => observer.disconnect();
		}, []);
		return u$2(S$1, { children: u$2("div", {
			id: elementId,
			"data-testid": MONTH_VIEW,
			className: "sx__date-picker__month-view",
			children: [
				u$2(MonthViewHeader, { setYearsView: seatYearsView }),
				u$2(DayNames, {}),
				month.map((week) => u$2(MonthViewWeek, { week }))
			]
		}) });
	}
	function YearsViewAccordion({ year, setYearAndMonth, isExpanded, expand }) {
		const $app = x$2(AppContext$1);
		const yearWithDates = $app.timeUnitsImpl.getMonthsFor(year);
		const handleClickOnMonth = (event, month) => {
			event.stopPropagation();
			setYearAndMonth(year, month.month);
		};
		return u$2(S$1, { children: u$2("li", {
			className: isExpanded ? "sx__is-expanded" : "",
			children: [u$2("button", {
				type: "button",
				className: "sx__button sx__date-picker__years-accordion__expand-button sx__ripple--wide",
				onClick: () => expand(year),
				children: year
			}), isExpanded && u$2("div", {
				className: "sx__date-picker__years-view-accordion__panel",
				children: yearWithDates.map((month) => u$2("button", {
					type: "button",
					className: "sx__button sx__date-picker__years-view-accordion__month",
					onClick: (event) => handleClickOnMonth(event, month),
					children: toLocalizedMonth(month, $app.config.locale.value)
				}))
			})]
		}) });
	}
	function YearsView({ setMonthView }) {
		const $app = x$2(AppContext$1);
		const minYear = $app.config.min.year;
		const maxYear = $app.config.max.year;
		const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
		const selectedYear = $app.datePickerState.selectedDate.value.year;
		const [expandedYear, setExpandedYear] = d$2(selectedYear);
		const setNewDatePickerDate = (year, month) => {
			$app.datePickerState.datePickerDate.value = Temporal.PlainDate.from({
				year,
				month,
				day: 1
			});
			setMonthView();
		};
		h$2(() => {
			var _a;
			const initiallyExpandedYear = (_a = document.querySelector(".sx__date-picker__years-view")) === null || _a === void 0 ? void 0 : _a.querySelector(".sx__is-expanded");
			if (!initiallyExpandedYear) return;
			initiallyExpandedYear.scrollIntoView({ block: "center" });
		}, []);
		return u$2(S$1, { children: u$2("ul", {
			className: "sx__date-picker__years-view",
			"data-testid": YEARS_VIEW,
			children: years.map((year) => u$2(YearsViewAccordion, {
				year,
				setYearAndMonth: (year, month) => setNewDatePickerDate(year, month),
				isExpanded: expandedYear === year,
				expand: (year) => setExpandedYear(year)
			}))
		}) });
	}
	const isScrollable = (el) => {
		if (el) {
			const hasScrollableContent = el.scrollHeight > el.clientHeight;
			const isOverflowHidden = window.getComputedStyle(el).overflowY.indexOf("hidden") !== -1;
			return hasScrollableContent && !isOverflowHidden;
		}
		return true;
	};
	const getScrollableParents = (el, acc = []) => {
		if (!el || el === document.body || el.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
			acc.push(window);
			return acc;
		}
		if (isScrollable(el)) acc.push(el);
		return getScrollableParents(el.assignedSlot ? el.assignedSlot.parentNode : el.parentNode, acc);
	};
	const POPUP_CLASS_NAME = "sx__date-picker-popup";
	function AppPopup({ wrapperEl }) {
		const $app = x$2(AppContext$1);
		const [datePickerView, setDatePickerView] = d$2(DatePickerView.MONTH_DAYS);
		const classList = T$2(() => {
			const returnValue = [
				POPUP_CLASS_NAME,
				$app.datePickerState.isDark.value ? "is-dark" : "",
				$app.config.teleportTo ? "is-teleported" : ""
			];
			if ($app.config.placement && !$app.config.teleportTo && wrapperEl) {
				const placement = $app.config.placement instanceof Function ? $app.config.placement(wrapperEl) : $app.config.placement;
				returnValue.push(placement);
			}
			return returnValue;
		}, [
			$app.datePickerState.isDark.value,
			$app.config.placement,
			$app.config.teleportTo
		]);
		const clickOutsideListener = (event) => {
			if (!event.target.closest(`.${POPUP_CLASS_NAME}`)) $app.datePickerState.close();
		};
		const escapeKeyListener = (e) => {
			if (e.key === "Escape") {
				if ($app.config.listeners.onEscapeKeyDown) $app.config.listeners.onEscapeKeyDown($app);
				else $app.datePickerState.close();
			}
		};
		h$2(() => {
			document.addEventListener("click", clickOutsideListener);
			document.addEventListener("keydown", escapeKeyListener);
			return () => {
				document.removeEventListener("click", clickOutsideListener);
				document.removeEventListener("keydown", escapeKeyListener);
			};
		}, []);
		const remSize = Number(getComputedStyle(document.documentElement).fontSize.split("px")[0]);
		const popupHeight = 362;
		const popupWidth = 332;
		const getFixedPositionStyles = () => {
			const inputWrapperEl = $app.datePickerState.inputWrapperElement.value;
			const inputRect = inputWrapperEl === null || inputWrapperEl === void 0 ? void 0 : inputWrapperEl.getBoundingClientRect();
			if (inputWrapperEl === void 0 || !(inputRect instanceof DOMRect)) return void 0;
			const resolvedPlacement = typeof $app.config.placement === "function" ? wrapperEl ? $app.config.placement(wrapperEl) : "bottom-end" : $app.config.placement;
			if (!resolvedPlacement) return void 0;
			return {
				top: resolvedPlacement.includes("bottom") ? inputRect.height + inputRect.y + 1 : inputRect.y - remSize - popupHeight,
				left: resolvedPlacement.includes("start") ? inputRect.x : inputRect.x + inputRect.width - popupWidth,
				width: popupWidth,
				position: "fixed"
			};
		};
		const [fixedPositionStyle, setFixedPositionStyle] = d$2(getFixedPositionStyles());
		h$2(() => {
			const inputWrapper = $app.datePickerState.inputWrapperElement.value;
			if (inputWrapper === void 0) return;
			const scrollableParents = getScrollableParents(inputWrapper);
			const scrollListener = () => setFixedPositionStyle(getFixedPositionStyles());
			scrollableParents.forEach((parent) => parent.addEventListener("scroll", scrollListener));
			return () => scrollableParents.forEach((parent) => parent.removeEventListener("scroll", scrollListener));
		}, []);
		return u$2(S$1, { children: u$2("div", {
			style: $app.config.teleportTo ? fixedPositionStyle : void 0,
			"data-testid": "date-picker-popup",
			className: classList.join(" "),
			children: datePickerView === DatePickerView.MONTH_DAYS ? u$2(MonthView, { seatYearsView: () => setDatePickerView(DatePickerView.YEARS) }) : u$2(YearsView, { setMonthView: () => setDatePickerView(DatePickerView.MONTH_DAYS) })
		}) });
	}
	function AppWrapper({ $app }) {
		const initialClassList = ["sx__date-picker-wrapper"];
		const [classList, setClassList] = d$2(initialClassList);
		const elementRef = A$2(null);
		h$2(() => {
			if (elementRef && elementRef.current instanceof HTMLDivElement) $app.elements = { DatePickerWrapper: elementRef.current };
		}, []);
		h$2(() => {
			var _a;
			const list = [...initialClassList];
			if ($app.datePickerState.isDark.value) list.push("is-dark");
			if ((_a = $app.config.style) === null || _a === void 0 ? void 0 : _a.fullWidth) list.push("has-full-width");
			if ($app.datePickerState.isDisabled.value) list.push("is-disabled");
			setClassList(list);
		}, [$app.datePickerState.isDark.value, $app.datePickerState.isDisabled.value]);
		let appPopupJSX = u$2(AppPopup, { wrapperEl: elementRef.current });
		if ($app.config.teleportTo) appPopupJSX = $(appPopupJSX, $app.config.teleportTo);
		return u$2(S$1, { children: u$2("div", {
			ref: elementRef,
			className: classList.join(" "),
			children: u$2(AppContext$1.Provider, {
				value: $app,
				children: [u$2(AppInput, {}), $app.datePickerState.isOpen.value && appPopupJSX]
			})
		}) });
	}
	var DatePickerAppSingletonImpl = class {
		constructor(datePickerState, config, timeUnitsImpl, translate, elements = {}) {
			Object.defineProperty(this, "datePickerState", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: datePickerState
			});
			Object.defineProperty(this, "config", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: config
			});
			Object.defineProperty(this, "timeUnitsImpl", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: timeUnitsImpl
			});
			Object.defineProperty(this, "translate", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: translate
			});
			Object.defineProperty(this, "elements", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: elements
			});
		}
	};
	var DatePickerAppSingletonBuilder = class {
		constructor() {
			Object.defineProperty(this, "datePickerState", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "config", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "timeUnitsImpl", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "translate", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
		}
		build() {
			return new DatePickerAppSingletonImpl(this.datePickerState, this.config, this.timeUnitsImpl, this.translate);
		}
		withDatePickerState(datePickerState) {
			this.datePickerState = datePickerState;
			return this;
		}
		withConfig(config) {
			this.config = config;
			return this;
		}
		withTimeUnitsImpl(timeUnitsImpl) {
			this.timeUnitsImpl = timeUnitsImpl;
			return this;
		}
		withTranslate(translate) {
			this.translate = translate;
			return this;
		}
	};
	var InternalViewName;
	(function(InternalViewName) {
		InternalViewName["Day"] = "day";
		InternalViewName["Week"] = "week";
		InternalViewName["MonthGrid"] = "month-grid";
		InternalViewName["MonthAgenda"] = "month-agenda";
		InternalViewName["WeekAgenda"] = "week-agenda";
		InternalViewName["List"] = "list";
	})(InternalViewName || (InternalViewName = {}));
	const getLocaleStringMonthArgs = ($app) => {
		return [$app.config.locale.value, { month: "long" }];
	};
	const getLocaleStringYearArgs = ($app) => {
		return [$app.config.locale.value, { year: "numeric" }];
	};
	const getMonthAndYearForDateRange = ($app, rangeStart, rangeEnd) => {
		const startDateMonth = rangeStart.toLocaleString(...getLocaleStringMonthArgs($app));
		const startDateYear = rangeStart.toLocaleString(...getLocaleStringYearArgs($app));
		const endDateMonth = rangeEnd.toLocaleString(...getLocaleStringMonthArgs($app));
		const endDateYear = rangeEnd.toLocaleString(...getLocaleStringYearArgs($app));
		if (startDateMonth === endDateMonth && startDateYear === endDateYear) return `${startDateMonth} ${startDateYear}`;
		else if (startDateMonth !== endDateMonth && startDateYear === endDateYear) return `${startDateMonth} – ${endDateMonth} ${startDateYear}`;
		return `${startDateMonth} ${startDateYear} – ${endDateMonth} ${endDateYear}`;
	};
	const getMonthAndYearForSelectedDate = ($app) => {
		return `${$app.datePickerState.selectedDate.value.toLocaleString(...getLocaleStringMonthArgs($app))} ${$app.datePickerState.selectedDate.value.toLocaleString(...getLocaleStringYearArgs($app))}`;
	};
	function RangeHeading() {
		const $app = x$2(AppContext);
		const [currentHeading, setCurrentHeading] = d$2("");
		useSignalEffect(() => {
			if ($app.calendarState.view.value === InternalViewName.Week || $app.calendarState.view.value === InternalViewName.WeekAgenda) setCurrentHeading(getMonthAndYearForDateRange($app, $app.calendarState.range.value.start, $app.calendarState.range.value.end));
			if ($app.calendarState.view.value === InternalViewName.MonthGrid || $app.calendarState.view.value === InternalViewName.Day || $app.calendarState.view.value === InternalViewName.MonthAgenda) setCurrentHeading(getMonthAndYearForSelectedDate($app));
		});
		return u$2("span", {
			className: "sx__range-heading",
			children: currentHeading
		});
	}
	function TodayButton() {
		const $app = x$2(AppContext);
		const setToday = () => {
			$app.datePickerState.selectedDate.value = Temporal.PlainDate.from(Temporal.Now.plainDateISO($app.config.timezone.value));
		};
		return u$2("button", {
			type: "button",
			className: "sx__button sx__today-button sx__ripple",
			onClick: setToday,
			children: $app.translate("Today")
		});
	}
	function ViewSelection() {
		const $app = x$2(AppContext);
		const viewSelectId = randomStringId();
		const viewLabelId = randomStringId();
		const [availableViews, setAvailableViews] = d$2([]);
		useSignalEffect(() => {
			if ($app.calendarState.isCalendarSmall.value) setAvailableViews($app.config.views.value.filter((view) => view.hasSmallScreenCompat));
			else setAvailableViews($app.config.views.value.filter((view) => view.hasWideScreenCompat));
		});
		const getInitialSelectedViewLabel = () => {
			const selectedView = $app.config.views.value.find((view) => view.name === $app.calendarState.view.value);
			return selectedView ? $app.translate(selectedView.label) : "";
		};
		const [selectedViewLabel, setSelectedViewLabel] = d$2(getInitialSelectedViewLabel());
		useSignalEffect(() => {
			const selectedView = $app.config.views.value.find((view) => view.name === $app.calendarState.view.value);
			if (!selectedView) return;
			setSelectedViewLabel($app.translate(selectedView.label));
		});
		const [isOpen, setIsOpen] = d$2(false);
		const clickOutsideListener = (event) => {
			const target = event.target;
			if (target instanceof HTMLElement && !target.closest(".sx__view-selection")) setIsOpen(false);
		};
		h$2(() => {
			document.addEventListener("click", clickOutsideListener);
			return () => document.removeEventListener("click", clickOutsideListener);
		}, []);
		const handleClickOnSelectionItem = (viewName) => {
			setIsOpen(false);
			$app.calendarState.setView(viewName, $app.datePickerState.selectedDate.value);
		};
		const [viewSelectionItems, setViewSelectionItems] = d$2();
		const [focusedViewIndex, setFocusedViewIndex] = d$2(0);
		const handleSelectedViewKeyDown = (keyboardEvent) => {
			if (isKeyEnterOrSpace(keyboardEvent)) {
				keyboardEvent.preventDefault();
				setIsOpen(!isOpen);
			}
			setTimeout(() => {
				var _a;
				const allOptions = (_a = $app.elements.calendarWrapper) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".sx__view-selection-item");
				if (!allOptions) return;
				setViewSelectionItems(allOptions);
				const firstOption = allOptions[0];
				if (firstOption instanceof HTMLElement) {
					setFocusedViewIndex(0);
					firstOption.focus();
				}
			}, 50);
		};
		const navigateUpOrDown = (keyboardEvent, viewName) => {
			if (!viewSelectionItems) return;
			if (keyboardEvent.key === "ArrowDown") {
				const nextOption = viewSelectionItems[focusedViewIndex + 1];
				if (nextOption instanceof HTMLElement) {
					setFocusedViewIndex(focusedViewIndex + 1);
					nextOption.focus();
				}
			} else if (keyboardEvent.key === "ArrowUp") {
				const prevOption = viewSelectionItems[focusedViewIndex - 1];
				if (prevOption instanceof HTMLElement) {
					setFocusedViewIndex(focusedViewIndex - 1);
					prevOption.focus();
				}
			} else if (isKeyEnterOrSpace(keyboardEvent)) handleClickOnSelectionItem(viewName);
		};
		return u$2("div", {
			className: `sx__view-selection ${isOpen ? "is-open" : ""}`,
			children: [
				u$2("label", {
					for: viewSelectId,
					id: viewLabelId,
					className: "sx__view-selection-label",
					children: $app.translate("View")
				}),
				u$2("button", {
					id: viewSelectId,
					type: "button",
					"aria-describedby": viewLabelId,
					"aria-label": $app.translate("Select View"),
					className: "sx__view-selection-selected-item sx__ripple",
					onClick: () => setIsOpen(!isOpen),
					onKeyDown: handleSelectedViewKeyDown,
					children: [selectedViewLabel, u$2("img", {
						className: "sx__view-selection-chevron",
						src: img,
						alt: ""
					})]
				}),
				isOpen && u$2("ul", {
					"data-testid": "view-selection-items",
					className: "sx__view-selection-items",
					children: availableViews.map((view) => u$2("li", { children: u$2("button", {
						type: "button",
						"aria-label": $app.translate("Select View") + " " + $app.translate(view.label),
						tabIndex: -1,
						onKeyDown: (keyboardEvent) => navigateUpOrDown(keyboardEvent, view.name),
						onClick: () => handleClickOnSelectionItem(view.name),
						className: "sx__view-selection-item" + (view.name === $app.calendarState.view.value ? " is-selected" : ""),
						children: $app.translate(view.label)
					}) }, view.name))
				})
			]
		});
	}
	function ForwardBackwardNavigation() {
		var _a;
		const $app = x$2(AppContext);
		const navigate = (direction) => {
			const currentView = $app.config.views.value.find((view) => view.name === $app.calendarState.view.value);
			if (!currentView) return;
			$app.datePickerState.selectedDate.value = currentView.backwardForwardFn($app.datePickerState.selectedDate.value, direction === "forwards" ? currentView.backwardForwardUnits : -currentView.backwardForwardUnits);
		};
		const [localizedRange, setLocalizedRange] = d$2("");
		useSignalEffect(() => {
			setLocalizedRange(`${getLocalizedDate$1($app.calendarState.range.value.start, $app.config.locale.value)} ${$app.translate("to")} ${getLocalizedDate$1($app.calendarState.range.value.end, $app.config.locale.value)}`);
		});
		const [rangeEndMinusOneRange, setRangeEndMinusOneRange] = d$2(null);
		const [rangeStartPlusOneRange, setRangeStartPlusOneRange] = d$2(null);
		useSignalEffect(() => {
			const selectedView = $app.config.views.value.find((view) => view.name === $app.calendarState.view.value);
			if (!selectedView) return;
			setRangeEndMinusOneRange(selectedView.setDateRange({
				range: $app.calendarState.range,
				calendarConfig: $app.config,
				timeUnitsImpl: $app.timeUnitsImpl,
				date: (() => {
					const result = selectedView.backwardForwardFn($app.datePickerState.selectedDate.value, -selectedView.backwardForwardUnits);
					return result instanceof Temporal.ZonedDateTime ? result.toPlainDate() : result;
				})()
			}).end);
			setRangeStartPlusOneRange(selectedView.setDateRange({
				range: $app.calendarState.range,
				calendarConfig: $app.config,
				timeUnitsImpl: $app.timeUnitsImpl,
				date: (() => {
					const result = selectedView.backwardForwardFn($app.datePickerState.selectedDate.value, selectedView.backwardForwardUnits);
					return result instanceof Temporal.ZonedDateTime ? result.toPlainDate() : result;
				})()
			}).start);
		});
		return u$2(S$1, { children: u$2("div", {
			className: "sx__forward-backward-navigation",
			"aria-label": localizedRange,
			"aria-live": "polite",
			children: [u$2(Chevron, {
				disabled: !!($app.config.minDate.value && dateFromDateTime((_a = rangeEndMinusOneRange === null || rangeEndMinusOneRange === void 0 ? void 0 : rangeEndMinusOneRange.toString()) !== null && _a !== void 0 ? _a : "") < $app.config.minDate.value.toString()),
				onClick: () => navigate("backwards"),
				direction: "previous",
				buttonText: $app.translate("Previous period")
			}), u$2(Chevron, {
				disabled: !!($app.config.maxDate.value && rangeStartPlusOneRange && dateFromDateTime(rangeStartPlusOneRange.toString()) > $app.config.maxDate.value.toString()),
				onClick: () => navigate("forwards"),
				direction: "next",
				buttonText: $app.translate("Next period")
			})]
		}) });
	}
	/**
	* Get an element in the DOM by their custom component id
	* */
	const getElementByCCID = (customComponentId) => document.querySelector(`[data-ccid="${customComponentId}"]`);
	const getEventHeight = (start, end, dayBoundaries, pointsPerDay) => {
		if (Temporal.ZonedDateTime.compare(start, end) === 0) return timePointToPercentage(pointsPerDay, dayBoundaries, timePointsFromString(timeFromDateTime(addTimePointsToDateTime(end, 50).toString()))) - timePointToPercentage(pointsPerDay, dayBoundaries, timePointsFromString(timeFromDateTime(start.toString())));
		return timePointToPercentage(pointsPerDay, dayBoundaries, timePointsFromString(timeFromDateTime(end.toString()))) - timePointToPercentage(pointsPerDay, dayBoundaries, timePointsFromString(timeFromDateTime(start.toString())));
	};
	const getInlineStartRule = (calendarEvent, eventWidth) => {
		if (!calendarEvent._maxConcurrentEvents || calendarEvent._previousConcurrentEvents === void 0) return 0;
		return calendarEvent._previousConcurrentEvents / calendarEvent._maxConcurrentEvents * eventWidth;
	};
	const getWidthRule = (leftRule, eventWidth, maxConcurrentEvents, eventOverlap) => {
		if (eventOverlap || !maxConcurrentEvents) return eventWidth - leftRule;
		return eventWidth / maxConcurrentEvents;
	};
	const getBorderRule = (calendarEvent) => {
		if (!calendarEvent._previousConcurrentEvents) return 0;
		return "1px solid #fff";
	};
	function useEventInteractions($app) {
		const [eventCopy, setEventCopy] = d$2();
		const updateCopy = (newCopy) => {
			if (!newCopy) return setEventCopy(void 0);
			setEventCopy(deepCloneEvent(newCopy, $app));
		};
		const [dragStartTimeout, setDragStartTimeout] = d$2();
		const createDragStartTimeout = (callback, uiEvent) => {
			setDragStartTimeout(setTimeout(() => callback(uiEvent), 150));
		};
		const setClickedEvent = (uiEvent, calendarEvent) => {
			if (isUIEventTouchEvent(uiEvent) && uiEvent.touches.length === 0) return;
			if (!$app.config.plugins.eventModal) return;
			const eventTarget = uiEvent.target;
			if (!(eventTarget instanceof HTMLElement)) return;
			const calendarEventElement = eventTarget.classList.contains("sx__event") ? eventTarget : eventTarget.closest(".sx__event");
			if (calendarEventElement instanceof HTMLElement) {
				$app.config.plugins.eventModal.calendarEventElement.value = calendarEventElement;
				$app.config.plugins.eventModal.setCalendarEvent(calendarEvent, calendarEventElement.getBoundingClientRect());
			}
		};
		const setClickedEventIfNotDragging = (calendarEvent, uiEvent) => {
			if (dragStartTimeout) {
				clearTimeout(dragStartTimeout);
				setClickedEvent(uiEvent, calendarEvent);
			}
			setDragStartTimeout(void 0);
		};
		return {
			eventCopy,
			updateCopy,
			createDragStartTimeout,
			setClickedEventIfNotDragging,
			setClickedEvent
		};
	}
	const getCCID = (customComponent, isCopy) => {
		let customComponentId = customComponent ? "custom-time-grid-event-" + randomStringId() : void 0;
		if (customComponentId && isCopy) customComponentId += "-copy";
		return customComponentId;
	};
	const wasEventAddedInLastSecond = (calendarEvent) => {
		return calendarEvent._createdAt && Date.now() - calendarEvent._createdAt.getTime() < 1e3;
	};
	function TimeGridEvent({ calendarEvent, dayBoundariesDateTime, isCopy, setMouseDown }) {
		var _a, _b, _c, _d, _e;
		const $app = x$2(AppContext);
		const eventRef = A$2(null);
		const [isCompact, setIsCompact] = d$2(false);
		const { eventCopy, updateCopy, createDragStartTimeout, setClickedEventIfNotDragging, setClickedEvent } = useEventInteractions($app);
		const localizeArgs = [$app.config.locale.value, {
			hour: "numeric",
			minute: "numeric"
		}];
		const getEventTime = (start, end) => {
			const localizedStartTime = start.toLocaleString(...localizeArgs);
			if (Temporal.ZonedDateTime.compare(start, end) === 0) return localizedStartTime;
			return `${localizedStartTime} – ${end.toLocaleString(...localizeArgs)}`;
		};
		const eventCSSVariables = {
			borderInlineStart: `4px solid var(--sx-color-${calendarEvent._color})`,
			textColor: `var(--sx-color-on-${calendarEvent._color}-container)`,
			backgroundColor: `var(--sx-color-${calendarEvent._color}-container)`,
			iconStroke: `var(--sx-color-on-${calendarEvent._color}-container)`
		};
		const insetInlineStart = getInlineStartRule(calendarEvent, $app.config.weekOptions.value.eventWidth);
		const handleStartDrag = (uiEvent) => {
			var _a;
			if (isUIEventTouchEvent(uiEvent)) uiEvent.preventDefault();
			if (isCopy) return;
			if (!uiEvent.target) return;
			if (!$app.config.plugins.dragAndDrop) return;
			if ((_a = calendarEvent._options) === null || _a === void 0 ? void 0 : _a.disableDND) return;
			if (realStartIsBeforeDayBoundaryStart) return;
			const newEventCopy = deepCloneEvent(calendarEvent, $app);
			updateCopy(newEventCopy);
			$app.config.plugins.dragAndDrop.startTimeGridDrag({
				$app,
				eventCoordinates: getEventCoordinates(uiEvent),
				updateCopy,
				eventCopy: newEventCopy
			}, dayBoundariesDateTime);
		};
		const customComponent = $app.config._customComponentFns.timeGridEvent;
		const customComponentId = A$2(getCCID(customComponent, isCopy));
		h$2(() => {
			if (!customComponent) return;
			customComponent(getElementByCCID(customComponentId.current), { calendarEvent: calendarEvent._getExternalEvent() });
			return () => {
				var _a, _b;
				(_b = (_a = $app.config)._destroyCustomComponentInstance) === null || _b === void 0 || _b.call(_a, customComponentId.current);
			};
		}, [calendarEvent, eventCopy]);
		h$2(() => {
			if (!eventRef.current) return;
			const checkHeight = () => {
				const element = eventRef.current;
				if (!element) return;
				const shouldBeCompact = element.offsetHeight < 36;
				setIsCompact(shouldBeCompact);
			};
			checkHeight();
			const resizeObserver = new ResizeObserver(checkHeight);
			resizeObserver.observe(eventRef.current);
			return () => {
				resizeObserver.disconnect();
			};
		}, [calendarEvent, eventCopy]);
		const handleOnClick = (e) => {
			e.stopPropagation();
			invokeOnEventClickCallback($app, calendarEvent, e);
		};
		const handleOnDoubleClick = (e) => {
			e.stopPropagation();
			invokeOnEventDoubleClickCallback($app, calendarEvent, e);
		};
		const handleKeyDown = (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.stopPropagation();
				setClickedEvent(e, calendarEvent);
				invokeOnEventClickCallback($app, calendarEvent, e);
				nextTick(() => {
					focusModal($app);
				});
			}
		};
		const startResize = (e) => {
			setMouseDown(true);
			e.stopPropagation();
			if (isCopy) return;
			if ($app.config.plugins.resize) {
				const eventCopy = deepCloneEvent(calendarEvent, $app);
				updateCopy(eventCopy);
				$app.config.plugins.resize.createTimeGridEventResizer(eventCopy, updateCopy, e, dayBoundariesDateTime);
			}
		};
		const borderRule = getBorderRule(calendarEvent);
		const classNames = ["sx__time-grid-event", "sx__event"];
		if (wasEventAddedInLastSecond(calendarEvent)) classNames.push("is-event-new");
		if (isCopy) classNames.push("is-event-copy");
		if (!$app.config.weekOptions.value.eventOverlap && calendarEvent._maxConcurrentEvents && calendarEvent._maxConcurrentEvents > 1) classNames.push("is-event-overlap");
		if ((_a = calendarEvent._options) === null || _a === void 0 ? void 0 : _a.additionalClasses) classNames.push(...calendarEvent._options.additionalClasses);
		const handlePointerDown = (e) => {
			setMouseDown(true);
			createDragStartTimeout(handleStartDrag, e);
		};
		const handlePointerUp = (e) => {
			nextTick(() => setMouseDown(false));
			setClickedEventIfNotDragging(calendarEvent, e);
		};
		const hasCustomContent = (_b = calendarEvent._customContent) === null || _b === void 0 ? void 0 : _b.timeGrid;
		const realStartIsBeforeDayBoundaryStart = dayBoundariesDateTime && calendarEvent.start.toString() < dayBoundariesDateTime.start.toString() && calendarEvent.end.toString() >= dayBoundariesDateTime.start.toString();
		const relativeStartWithinDayBoundary = realStartIsBeforeDayBoundaryStart ? dayBoundariesDateTime === null || dayBoundariesDateTime === void 0 ? void 0 : dayBoundariesDateTime.start : calendarEvent.start;
		return u$2(S$1, { children: [u$2("div", {
			ref: eventRef,
			id: isCopy ? getTimeGridEventCopyElementId(calendarEvent.id) : void 0,
			"data-event-id": calendarEvent.id,
			onClick: handleOnClick,
			onDblClick: handleOnDoubleClick,
			onKeyDown: handleKeyDown,
			onMouseDown: handlePointerDown,
			onMouseUp: handlePointerUp,
			onTouchStart: handlePointerDown,
			onTouchEnd: handlePointerUp,
			className: classNames.join(" "),
			tabIndex: 0,
			role: "button",
			style: {
				top: `${getYCoordinateInTimeGrid(relativeStartWithinDayBoundary, $app.config.dayBoundaries.value, $app.config.timePointsPerDay)}%`,
				height: `${getEventHeight(relativeStartWithinDayBoundary, calendarEvent.end, $app.config.dayBoundaries.value, $app.config.timePointsPerDay)}%`,
				zIndex: (_c = calendarEvent._previousConcurrentEvents) !== null && _c !== void 0 ? _c : 0,
				insetInlineStart: `${insetInlineStart}%`,
				width: `${getWidthRule(insetInlineStart, isCopy ? 100 : $app.config.weekOptions.value.eventWidth, calendarEvent._maxConcurrentEvents, $app.config.weekOptions.value.eventOverlap)}%`,
				backgroundColor: customComponent ? void 0 : eventCSSVariables.backgroundColor,
				color: customComponent ? void 0 : eventCSSVariables.textColor,
				borderTop: borderRule,
				borderInlineEnd: borderRule,
				borderBottom: borderRule,
				borderInlineStart: customComponent ? void 0 : eventCSSVariables.borderInlineStart,
				padding: customComponent ? "0" : void 0
			},
			children: u$2("div", {
				"data-ccid": customComponentId.current,
				className: "sx__time-grid-event-inner",
				children: [
					!customComponent && !hasCustomContent && u$2(S$1, { children: [
						isCompact && calendarEvent.title && u$2("div", {
							className: "sx__title-and-time-compact",
							children: [u$2("div", {
								className: "sx__time-grid-event-title",
								children: calendarEvent.title
							}), u$2("div", {
								className: "sx__time-grid-event-time",
								children: timeFn(calendarEvent.start, $app.config.locale.value)
							})]
						}),
						!isCompact && calendarEvent.title && u$2("div", {
							className: "sx__time-grid-event-title",
							children: calendarEvent.title
						}),
						(!isCompact || isCompact && !calendarEvent.title) && u$2("div", {
							className: "sx__time-grid-event-time",
							children: [u$2(TimeIcon, { strokeColor: eventCSSVariables.iconStroke }), getEventTime(calendarEvent.start, calendarEvent.end)]
						}),
						calendarEvent.people && calendarEvent.people.length > 0 && u$2("div", {
							className: "sx__time-grid-event-people",
							children: [u$2(UserIcon, { strokeColor: eventCSSVariables.iconStroke }), concatenatePeople(calendarEvent.people)]
						}),
						calendarEvent.location && u$2("div", {
							className: "sx__time-grid-event-location",
							children: [u$2(LocationPinIcon, { strokeColor: eventCSSVariables.iconStroke }), calendarEvent.location]
						})
					] }),
					hasCustomContent && u$2("div", { dangerouslySetInnerHTML: { __html: ((_d = calendarEvent._customContent) === null || _d === void 0 ? void 0 : _d.timeGrid) || "" } }),
					$app.config.plugins.resize && !((_e = calendarEvent._options) === null || _e === void 0 ? void 0 : _e.disableResize) && u$2("div", {
						className: "sx__time-grid-event-resize-handle",
						onMouseDown: startResize,
						onTouchStart: startResize
					})
				]
			})
		}), eventCopy && u$2(TimeGridEvent, {
			calendarEvent: eventCopy,
			isCopy: true,
			setMouseDown,
			dayBoundariesDateTime
		})] });
	}
	const sortEventsByStartAndEnd = (a, b) => {
		if (a.start.toString() === b.start.toString()) {
			if (a.end.toString() < b.end.toString()) return 1;
			if (a.end.toString() > b.end.toString()) return -1;
			return 0;
		}
		if (a.start.toString() < b.start.toString()) return -1;
		if (a.start.toString() > b.start.toString()) return 1;
		return 0;
	};
	const sortEventsForMonthGrid = (a, b) => {
		const aStartDate = dateFromDateTime(a.start.toString());
		const bStartDate = dateFromDateTime(b.start.toString());
		const aEndDate = dateFromDateTime(a.end.toString());
		const bEndDate = dateFromDateTime(b.end.toString());
		/**
		* For events that start and end at the same day, sort them by their start time.
		* If they only start on the same day but end on different days, the function needs to move on;
		* an event that starts on 5am today, but ends in 5 days, needs to be placed before an event that starts
		* today at 1am and ends later today. That way we avoid empty gaps in the grid.
		* */
		if (aStartDate === bStartDate && aEndDate === bEndDate) {
			if (a.start.toString() < b.start.toString()) return -1;
		}
		if (aStartDate === bStartDate) {
			if (aEndDate < bEndDate) return 1;
			if (aEndDate > bEndDate) return -1;
			return 0;
		}
		if (aStartDate < bStartDate) return -1;
		if (aStartDate > bStartDate) return 1;
		return 0;
	};
	const areSameMinute = (start, end) => {
		return start.year === end.year && start.month === end.month && start.day === end.day && start.hour === end.hour && start.minute === end.minute;
	};
	const isEvent0Minutes = (e) => {
		return (e === null || e === void 0 ? void 0 : e.start) instanceof Temporal.ZonedDateTime && (e === null || e === void 0 ? void 0 : e.end) instanceof Temporal.ZonedDateTime && areSameMinute(e.start, e.end);
	};
	const areEvents0MinutesAndConcurrent = (e1, e2) => {
		return isEvent0Minutes(e1) && isEvent0Minutes(e2) && (e1 === null || e1 === void 0 ? void 0 : e1.start) instanceof Temporal.ZonedDateTime && (e2 === null || e2 === void 0 ? void 0 : e2.start) instanceof Temporal.ZonedDateTime && areSameMinute(e1.start, e2.start);
	};
	const handleEventConcurrency = (sortedEvents, concurrentEventsCache = [], currentIndex = 0) => {
		for (let i = currentIndex; i < sortedEvents.length; i++) {
			const event = sortedEvents[i];
			const nextEvent = sortedEvents[i + 1];
			const areBothEventsZeroMinutes = areEvents0MinutesAndConcurrent(event, nextEvent);
			const everyConcurrentEventEndsBeforeNextEvent = nextEvent && concurrentEventsCache.every((e) => e.end.epochNanoseconds <= nextEvent.start.epochNanoseconds);
			const currentEventOverlapsWithNextEvent = nextEvent && event.end.epochNanoseconds > nextEvent.start.epochNanoseconds;
			if (concurrentEventsCache.length && (!nextEvent || everyConcurrentEventEndsBeforeNextEvent && !currentEventOverlapsWithNextEvent && !areBothEventsZeroMinutes)) {
				concurrentEventsCache.push(event);
				let maxColumnInBatch = 0;
				for (let ii = 0; ii < concurrentEventsCache.length; ii++) {
					const currentEvent = concurrentEventsCache[ii];
					const takenColumns = /* @__PURE__ */ new Set();
					for (let j = 0; j < ii; j++) {
						const cachedEvent = concurrentEventsCache[j];
						if ((areEvents0MinutesAndConcurrent(cachedEvent, currentEvent) || cachedEvent.start.epochNanoseconds <= currentEvent.start.epochNanoseconds && cachedEvent.end.epochNanoseconds > currentEvent.start.epochNanoseconds) && cachedEvent._previousConcurrentEvents !== void 0) takenColumns.add(cachedEvent._previousConcurrentEvents);
					}
					let column = 0;
					while (takenColumns.has(column)) column++;
					maxColumnInBatch = Math.max(maxColumnInBatch, column);
					const NpreviousConcurrentEvents = column;
					currentEvent._totalConcurrentEvents = NpreviousConcurrentEvents + concurrentEventsCache.filter((cachedEvent, index) => {
						if (cachedEvent === currentEvent || index < ii) return false;
						if (areEvents0MinutesAndConcurrent(cachedEvent, currentEvent)) return true;
						return cachedEvent.start.epochNanoseconds < currentEvent.end.epochNanoseconds && cachedEvent.end.epochNanoseconds >= currentEvent.start.epochNanoseconds;
					}).length + 1;
					currentEvent._previousConcurrentEvents = NpreviousConcurrentEvents;
				}
				for (const evt of concurrentEventsCache) evt._maxConcurrentEvents = maxColumnInBatch + 1;
				concurrentEventsCache = [];
				return handleEventConcurrency(sortedEvents, concurrentEventsCache, i + 1);
			}
			if (nextEvent && event.end.epochNanoseconds > nextEvent.start.epochNanoseconds || concurrentEventsCache.some((e) => e.end.epochNanoseconds > event.start.epochNanoseconds) || areBothEventsZeroMinutes) {
				concurrentEventsCache.push(event);
				return handleEventConcurrency(sortedEvents, concurrentEventsCache, i + 1);
			}
			event._totalConcurrentEvents = 1;
			event._previousConcurrentEvents = 0;
			event._maxConcurrentEvents = 1;
		}
		return sortedEvents;
	};
	const getClickDateTime = (e, $app, dayStartDateTime) => {
		if (!(e.target instanceof HTMLElement)) return;
		const dayGridElement = e.target.classList.contains("sx__time-grid-day") ? e.target : e.target.closest(".sx__time-grid-day");
		const clickPercentageOfDay = (e.clientY - dayGridElement.getBoundingClientRect().top) / dayGridElement.getBoundingClientRect().height * 100;
		const clickTimePointsIntoDay = Math.round($app.config.timePointsPerDay / 100 * clickPercentageOfDay);
		return addTimePointsToDateTime(dayStartDateTime, clickTimePointsIntoDay);
	};
	const getClassNameForWeekday = (weekday) => {
		switch (weekday) {
			case 1: return "sx__monday";
			case 2: return "sx__tuesday";
			case 3: return "sx__wednesday";
			case 4: return "sx__thursday";
			case 5: return "sx__friday";
			case 6: return "sx__saturday";
			case 7: return "sx__sunday";
			default: throw new Error(`Invalid weekday ${weekday}`);
		}
	};
	function TimeGridBackgroundEvent({ backgroundEvent, date }) {
		const $app = x$2(AppContext);
		let start = backgroundEvent.start;
		let end = backgroundEvent.end;
		const startIsAnotherDate = !isSameDay(start, Temporal.PlainDate.from(date));
		const endIsAnotherDate = !isSameDay(end, Temporal.PlainDate.from(date));
		if (startIsAnotherDate || start instanceof Temporal.PlainDate) start = Temporal.ZonedDateTime.from({
			year: Temporal.PlainDate.from(date).year,
			month: Temporal.PlainDate.from(date).month,
			day: Temporal.PlainDate.from(date).day,
			hour: 0,
			minute: 0,
			second: 0,
			timeZone: $app.config.timezone.value
		});
		if (endIsAnotherDate || end instanceof Temporal.PlainDate) end = Temporal.ZonedDateTime.from({
			year: Temporal.PlainDate.from(date).year,
			month: Temporal.PlainDate.from(date).month,
			day: Temporal.PlainDate.from(date).day,
			hour: 23,
			minute: 59,
			second: 59,
			timeZone: $app.config.timezone.value
		});
		const startHour = start.hour;
		const startMinute = start.minute;
		const formattedStart = `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
		if (timePointsFromString(formattedStart) < $app.config.dayBoundaries.value.start) {
			const updatedStart = timeStringFromTimePoints($app.config.dayBoundaries.value.start);
			const updatedStartHour = updatedStart.split(":")[0];
			const updatedStartMinute = updatedStart.split(":")[1];
			start = Temporal.ZonedDateTime.from({
				year: Temporal.PlainDate.from(date).year,
				month: Temporal.PlainDate.from(date).month,
				day: Temporal.PlainDate.from(date).day,
				hour: +updatedStartHour,
				minute: +updatedStartMinute,
				second: 0,
				timeZone: $app.config.timezone.value
			});
		}
		if (start.toString() === end.toString()) return null;
		return u$2(S$1, { children: u$2("div", {
			class: "sx__time-grid-background-event",
			title: backgroundEvent.title,
			style: {
				...backgroundEvent.style,
				position: "absolute",
				zIndex: 0,
				top: `${getYCoordinateInTimeGrid(start, $app.config.dayBoundaries.value, $app.config.timePointsPerDay)}%`,
				height: `${getEventHeight(start, end, $app.config.dayBoundaries.value, $app.config.timePointsPerDay)}%`,
				width: "100%"
			}
		}) });
	}
	function TimeGridDay({ calendarEvents, date, backgroundEvents }) {
		/**
		* The time grid day needs to keep track of whether the mousedown event happened on a calendar event, in order to prevent
		* click events from firing when dragging an event.
		* */
		const [mouseDownOnChild, setMouseDownOnChild] = d$2(false);
		const $app = x$2(AppContext);
		const timeStringFromDayBoundary = timeStringFromTimePoints($app.config.dayBoundaries.value.start);
		const timeStringFromDayBoundaryEnd = timeStringFromTimePoints($app.config.dayBoundaries.value.end);
		const dayStartDateTime = date.with({
			hour: +timeStringFromDayBoundary.split(":")[0],
			minute: +timeStringFromDayBoundary.split(":")[1]
		});
		const endHour = +timeStringFromDayBoundaryEnd.split(":")[0];
		const endWithAdjustedTime = date.with({
			hour: endHour === 24 ? 23 : endHour,
			minute: endHour === 24 ? 59 : +timeStringFromDayBoundaryEnd.split(":")[1],
			second: endHour === 24 ? 59 : 0
		});
		const dayBoundariesDateTime = {
			start: dayStartDateTime,
			end: $app.config.isHybridDay ? addDays(endWithAdjustedTime, 1) : endWithAdjustedTime
		};
		const eventsWithConcurrency = T$2(() => {
			const sortedEvents = calendarEvents.sort(sortEventsByStartAndEnd);
			return handleEventConcurrency(sortedEvents);
		}, [calendarEvents]);
		const handleOnClick = (e, callback) => {
			if (!callback || mouseDownOnChild) return;
			const clickDateTime = getClickDateTime(e, $app, dayStartDateTime);
			if (clickDateTime) callback(clickDateTime, e);
		};
		const handleMouseDown = (e) => {
			const callback = $app.config.callbacks.onMouseDownDateTime;
			if (!callback || mouseDownOnChild) return;
			const clickDateTime = getClickDateTime(e, $app, dayStartDateTime);
			if (clickDateTime) callback(clickDateTime, e);
		};
		const handlePointerUp = () => {
			setTimeout(() => {
				setMouseDownOnChild(false);
			}, 10);
		};
		const baseClasses = ["sx__time-grid-day", getClassNameForWeekday(date.dayOfWeek)];
		return u$2("div", {
			className: useComputed(() => {
				const newClassNames = [...baseClasses];
				if (isSameDay($app.datePickerState.selectedDate.value, date)) newClassNames.push("is-selected");
				return newClassNames;
			}).value.join(" "),
			"data-time-grid-date": toDateString$1(date),
			onClick: (e) => handleOnClick(e, $app.config.callbacks.onClickDateTime),
			onDblClick: (e) => handleOnClick(e, $app.config.callbacks.onDoubleClickDateTime),
			"aria-label": getLocalizedDate$1(date, $app.config.locale.value),
			onMouseLeave: () => setMouseDownOnChild(false),
			onMouseUp: handlePointerUp,
			onTouchEnd: handlePointerUp,
			onMouseDown: handleMouseDown,
			children: [backgroundEvents.map((event) => u$2(S$1, { children: u$2(TimeGridBackgroundEvent, {
				backgroundEvent: event,
				date: date.toString()
			}) })), eventsWithConcurrency.map((event) => u$2(TimeGridEvent, {
				calendarEvent: event,
				dayBoundariesDateTime,
				setMouseDown: setMouseDownOnChild
			}, event.id))]
		});
	}
	const getTimeAxisHours = ({ start, end }, isHybridDay) => {
		const hours = [];
		let hour = Math.floor(start / 100);
		if (isHybridDay) {
			while (hour < 24) {
				hours.push(hour);
				hour += 1;
			}
			hour = 0;
		}
		const lastHour = end === 0 ? 24 : Math.ceil(end / 100);
		while (hour < lastHour) {
			hours.push(hour);
			hour += 1;
		}
		return hours;
	};
	const computeGridSteps = (dayBoundaries, isHybridDay, gridStep) => {
		const hourSteps = getTimeAxisHours(dayBoundaries, isHybridDay);
		const result = [];
		hourSteps.forEach((hour) => {
			if (gridStep === 180) {
				if (hour % 3 === 0) result.push({
					hour,
					minute: 0
				});
			} else if (gridStep === 120) {
				if (hour % 2 === 0) result.push({
					hour,
					minute: 0
				});
			} else if (gridStep === 60) result.push({
				hour,
				minute: 0
			});
			else if (gridStep === 30) result.push({
				hour,
				minute: 0
			}, {
				hour,
				minute: 30
			});
			else if (gridStep === 15) result.push({
				hour,
				minute: 0
			}, {
				hour,
				minute: 15
			}, {
				hour,
				minute: 30
			}, {
				hour,
				minute: 45
			});
		});
		return result;
	};
	function TimeAxis() {
		const $app = x$2(AppContext);
		const [gridSteps, setGridSteps] = d$2(() => computeGridSteps($app.config.dayBoundaries.value, $app.config.isHybridDay, $app.config.weekOptions.value.gridStep));
		useSignalEffect(() => {
			const result = computeGridSteps($app.config.dayBoundaries.value, $app.config.isHybridDay, $app.config.weekOptions.value.gridStep);
			setGridSteps(result);
			const pixelsPerGridStep = $app.config.weekOptions.value.gridHeight / result.length;
			document.documentElement.style.setProperty("--sx-week-grid-hour-height", `${pixelsPerGridStep}px`);
		});
		const formatter = new Intl.DateTimeFormat($app.config.locale.value, $app.config.weekOptions.value.timeAxisFormatOptions);
		const hourCustomComponentFn = $app.config._customComponentFns.weekGridHour;
		const hourCCIDs = T$2(() => {
			if (!hourCustomComponentFn) return [];
			return gridSteps.map(() => `custom-week-grid-hour-${randomStringId()}`);
		}, [gridSteps]);
		h$2(() => {
			if (hourCustomComponentFn && hourCCIDs.length) gridSteps.forEach((gridStep, idx) => {
				const el = document.querySelector(`[data-ccid="${hourCCIDs[idx]}"]`);
				if (!(el instanceof HTMLElement)) return console.warn("Could not find element for custom component weekGridHour");
				hourCustomComponentFn(el, {
					hour: gridStep.hour,
					gridStep
				});
			});
		}, [gridSteps, hourCCIDs]);
		return u$2(S$1, { children: u$2("div", {
			className: "sx__week-grid__time-axis",
			children: gridSteps.map((gridStep, index) => u$2("div", {
				className: "sx__week-grid__hour",
				children: [hourCustomComponentFn && hourCCIDs.length && u$2("div", { "data-ccid": hourCCIDs[index] }), !hourCustomComponentFn && u$2("span", {
					className: "sx__week-grid__hour-text",
					children: formatter.format(new Date(0, 0, 0, gridStep.hour, gridStep.minute))
				})]
			}))
		}) });
	}
	function DateAxis({ week }) {
		const $app = x$2(AppContext);
		const getClassNames = (date) => {
			const classNames = ["sx__week-grid__date", getClassNameForWeekday(date.dayOfWeek)];
			if (isToday(date, $app.config.timezone.value)) classNames.push("sx__week-grid__date--is-today");
			return classNames.join(" ");
		};
		const weekGridDateCustomComponentFn = $app.config._customComponentFns.weekGridDate;
		const weekGridDateCCIDs = d$2(() => Array.from({ length: 7 }, () => `custom-week-grid-date-${randomStringId()}`));
		h$2(() => {
			if (weekGridDateCustomComponentFn) week.forEach((date, idx) => {
				const el = document.querySelector(`[data-ccid="${weekGridDateCCIDs[0][idx]}"]`);
				if (!(el instanceof HTMLElement)) return console.warn("Could not find element for custom component weekGridDate");
				weekGridDateCustomComponentFn(el, { date: toDateString$1(date) });
			});
		}, [week]);
		return u$2(S$1, { children: u$2("div", {
			className: "sx__week-grid__date-axis",
			children: week.map((date, idx) => u$2("div", {
				className: getClassNames(date),
				"data-date": toDateString$1(date),
				children: [weekGridDateCustomComponentFn && u$2("div", { "data-ccid": weekGridDateCCIDs[0][idx] }), !weekGridDateCustomComponentFn && u$2(S$1, { children: [u$2("div", {
					className: "sx__week-grid__day-name",
					children: getDayNameShort(date, $app.config.locale.value)
				}), u$2("div", {
					className: "sx__week-grid__date-number",
					children: date.day
				})] })]
			}))
		}) });
	}
	const sortEventsForWeekView = (allCalendarEvents) => {
		const dateGridEvents = [];
		const timeGridEvents = [];
		for (const event of allCalendarEvents) {
			if (event._isSingleDayTimed || event._isSingleHybridDayTimed) {
				timeGridEvents.push(event);
				continue;
			}
			if (event._isSingleDayFullDay || event._isMultiDayFullDay || event._isMultiDayTimed) dateGridEvents.push(event);
		}
		return {
			timeGridEvents,
			dateGridEvents
		};
	};
	const createOneDay = (week, date) => {
		const dateString = toDateString$1(date);
		week[dateString] = {
			date: dateString,
			timeGridEvents: [],
			dateGridEvents: {},
			backgroundEvents: []
		};
		return week;
	};
	const createWeek = ($app) => {
		if ($app.calendarState.view.value === InternalViewName.Day) return createOneDay({}, $app.calendarState.range.value.start);
		return $app.timeUnitsImpl.getWeekFor($app.datePickerState.selectedDate.value).slice(0, $app.config.weekOptions.value.nDays).reduce(createOneDay, {});
	};
	const positionInTimeGrid = (timeGridEvents, week, $app) => {
		var _a;
		for (const event of timeGridEvents) {
			const range = $app.calendarState.range.value;
			if (event.start.epochNanoseconds >= range.start.epochNanoseconds && event.end.epochNanoseconds <= range.end.epochNanoseconds) {
				let date = dateFromDateTime(event.start.toString());
				if ($app.config.isHybridDay) {
					const { year, month, date: day } = toIntegers(date);
					const previousDayStart = `${addDays(Temporal.PlainDate.from({
						year,
						month: month + 1,
						day
					}), -1)} ${timeStringFromTimePoints($app.config.dayBoundaries.value.start)}`;
					const previousDayEnd = `${date} ${timeStringFromTimePoints($app.config.dayBoundaries.value.end)}`;
					const actualDayStart = `${date} ${timeStringFromTimePoints($app.config.dayBoundaries.value.start)}`;
					const eventStartZDT = event.start;
					const eventStartFloating = `${eventStartZDT.year}-${doubleDigit(eventStartZDT.month)}-${doubleDigit(eventStartZDT.day)} ${doubleDigit(eventStartZDT.hour)}:${doubleDigit(eventStartZDT.minute)}`;
					if (eventStartFloating > previousDayStart && eventStartFloating < previousDayEnd && eventStartFloating < actualDayStart) {
						const { year, month, date: day } = toIntegers(date);
						date = dateFromDateTime(addDays(Temporal.PlainDate.from({
							year,
							month: month + 1,
							day
						}), -1).toString());
					}
				}
				(_a = week[date]) === null || _a === void 0 || _a.timeGridEvents.push(event);
			}
		}
		return week;
	};
	InternalViewName.Week;
	const DEFAULT_DAY_BOUNDARIES = {
		start: 0,
		end: 2400
	};
	const DEFAULT_WEEK_GRID_HEIGHT = 1600;
	const DATE_GRID_BLOCKER = "blocker";
	/**
	* Create a table-like representation of the week, where each cell can hold a full-day event or multiple-day-timed event.
	* If an event lasts more than one day, it creates blockers in the grid for its subsequent days, so that events don't collide.
	* For example:
	*
	* |  Mo    | Tue    |   We   |  Thu   |  Fri   | Sat    | Sun    |
	* | e1     | blocker| blocker| blocker| blocker| blocker| blocker|
	* |        |  e2    | blocker|        |  e4    |        |        |
	* |        |        |  e3    |        |        |        |        |
	* */
	const positionInDateGrid = (sortedDateGridEvents, week) => {
		const weekDates = Object.keys(week).sort();
		const firstDateOfWeek = weekDates[0];
		const lastDateOfWeek = weekDates[weekDates.length - 1];
		const occupiedLevels = /* @__PURE__ */ new Set();
		for (const event of sortedDateGridEvents) {
			const eventOriginalStartDate = dateFromDateTime(event.start.toString());
			const eventOriginalEndDate = dateFromDateTime(event.end.toString());
			const isEventStartInWeek = !!week[eventOriginalStartDate];
			let isEventInWeek = isEventStartInWeek;
			if (!isEventStartInWeek && eventOriginalStartDate < firstDateOfWeek && eventOriginalEndDate >= firstDateOfWeek) isEventInWeek = true;
			if (!isEventInWeek) continue;
			const firstDateOfEvent = isEventStartInWeek ? eventOriginalStartDate : firstDateOfWeek;
			const lastDateOfEvent = eventOriginalEndDate <= lastDateOfWeek ? eventOriginalEndDate : lastDateOfWeek;
			const eventDays = Object.values(week).filter((day) => {
				return day.date >= firstDateOfEvent && day.date <= lastDateOfEvent;
			});
			let levelInWeekForEvent;
			let testLevel = 0;
			while (levelInWeekForEvent === void 0) if (eventDays.every((day) => {
				return !day.dateGridEvents[testLevel];
			})) {
				levelInWeekForEvent = testLevel;
				occupiedLevels.add(testLevel);
			} else testLevel++;
			for (const [eventDayIndex, eventDay] of eventDays.entries()) if (eventDayIndex === 0) {
				event._nDaysInGrid = eventDays.length;
				eventDay.dateGridEvents[levelInWeekForEvent] = event;
			} else eventDay.dateGridEvents[levelInWeekForEvent] = DATE_GRID_BLOCKER;
		}
		for (const level of Array.from(occupiedLevels)) for (const [, day] of Object.entries(week)) if (!day.dateGridEvents[level]) day.dateGridEvents[level] = void 0;
		return week;
	};
	const getWidthToSubtract = (hasOverflowLeft, hasOverflowRight, enableOverflowSubtraction) => {
		let widthToSubtract = 2;
		const eventOverflowMargin = 10;
		if (hasOverflowLeft && enableOverflowSubtraction) widthToSubtract += eventOverflowMargin;
		if (hasOverflowRight && enableOverflowSubtraction) widthToSubtract += eventOverflowMargin;
		return widthToSubtract;
	};
	const getBorderRadius = (hasOverflowLeft, hasOverflowRight, forceZeroRule) => {
		return {
			borderBottomLeftRadius: hasOverflowLeft || forceZeroRule ? 0 : void 0,
			borderTopLeftRadius: hasOverflowLeft || forceZeroRule ? 0 : void 0,
			borderBottomRightRadius: hasOverflowRight || forceZeroRule ? 0 : void 0,
			borderTopRightRadius: hasOverflowRight || forceZeroRule ? 0 : void 0
		};
	};
	function DateGridEvent({ calendarEvent, gridRow, isCopy }) {
		var _a, _b, _c, _d;
		const $app = x$2(AppContext);
		const { eventCopy, updateCopy, createDragStartTimeout, setClickedEventIfNotDragging, setClickedEvent } = useEventInteractions($app);
		const eventCSSVariables = {
			borderInlineStart: `4px solid var(--sx-color-${calendarEvent._color})`,
			color: `var(--sx-color-on-${calendarEvent._color}-container)`,
			backgroundColor: `var(--sx-color-${calendarEvent._color}-container)`
		};
		const handleStartDrag = (uiEvent) => {
			var _a;
			if (!$app.config.plugins.dragAndDrop) return;
			if ((_a = calendarEvent._options) === null || _a === void 0 ? void 0 : _a.disableDND) return;
			if (isUIEventTouchEvent(uiEvent)) uiEvent.preventDefault();
			const newEventCopy = deepCloneEvent(calendarEvent, $app);
			updateCopy(newEventCopy);
			$app.config.plugins.dragAndDrop.startDateGridDrag({
				eventCoordinates: getEventCoordinates(uiEvent),
				eventCopy: newEventCopy,
				updateCopy,
				$app
			});
		};
		const rangeStartForComparison = calendarEvent.start instanceof Temporal.ZonedDateTime ? $app.calendarState.range.value.start.toString() : Temporal.PlainDate.from({
			year: $app.calendarState.range.value.start.year,
			month: $app.calendarState.range.value.start.month,
			day: $app.calendarState.range.value.start.day
		}).toString();
		const rangeEndForComparison = calendarEvent.end instanceof Temporal.ZonedDateTime ? $app.calendarState.range.value.end.toString() : Temporal.PlainDate.from({
			year: $app.calendarState.range.value.end.year,
			month: $app.calendarState.range.value.end.month,
			day: $app.calendarState.range.value.end.day
		}).toString();
		const startsBeforeWeek = calendarEvent.start.toString() < rangeStartForComparison;
		const endsAfterWeek = calendarEvent.end.toString() > rangeEndForComparison;
		const hasOverflowLeft = T$2(() => {
			if ($app.config.direction === "ltr") return startsBeforeWeek;
			return endsAfterWeek;
		}, [startsBeforeWeek, endsAfterWeek]);
		const hasOverflowRight = T$2(() => {
			if ($app.config.direction === "ltr") return endsAfterWeek;
			return startsBeforeWeek;
		}, [startsBeforeWeek, endsAfterWeek]);
		const overflowStyles = { backgroundColor: eventCSSVariables.backgroundColor };
		const customComponent = $app.config._customComponentFns.dateGridEvent;
		const customComponentId = A$2(customComponent ? "custom-date-grid-event-" + randomStringId() : void 0);
		if (isCopy && customComponentId.current) customComponentId.current += "-copy";
		h$2(() => {
			if (!customComponent) return;
			customComponent(getElementByCCID(customComponentId.current), { calendarEvent: calendarEvent._getExternalEvent() });
			return () => {
				var _a, _b;
				(_b = (_a = $app.config)._destroyCustomComponentInstance) === null || _b === void 0 || _b.call(_a, customComponentId.current);
			};
		}, [calendarEvent, eventCopy]);
		const startResize = (mouseEvent) => {
			mouseEvent.stopPropagation();
			const eventCopy = deepCloneEvent(calendarEvent, $app);
			updateCopy(eventCopy);
			$app.config.plugins.resize.createDateGridEventResizer(eventCopy, updateCopy, mouseEvent);
		};
		const handleKeyDown = (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.stopPropagation();
				setClickedEvent(e, calendarEvent);
				invokeOnEventClickCallback($app, calendarEvent, e);
				nextTick(() => {
					focusModal($app);
				});
			}
		};
		const eventClasses = [
			"sx__event",
			"sx__date-grid-event",
			"sx__date-grid-cell"
		];
		if (isCopy) eventClasses.push("sx__date-grid-event--copy");
		if (wasEventAddedInLastSecond(calendarEvent)) eventClasses.push("is-event-new");
		if (hasOverflowLeft) eventClasses.push("sx__date-grid-event--overflow-left");
		if (hasOverflowRight) eventClasses.push("sx__date-grid-event--overflow-right");
		if ((_a = calendarEvent._options) === null || _a === void 0 ? void 0 : _a.additionalClasses) eventClasses.push(...calendarEvent._options.additionalClasses);
		const borderInlineStartNonCustom = startsBeforeWeek ? "none" : eventCSSVariables.borderInlineStart;
		const hasCustomContent = (_b = calendarEvent._customContent) === null || _b === void 0 ? void 0 : _b.dateGrid;
		return u$2(S$1, { children: [u$2("div", {
			id: isCopy ? getTimeGridEventCopyElementId(calendarEvent.id) : void 0,
			tabIndex: 0,
			"aria-label": calendarEvent.title + " " + getTimeStamp(calendarEvent, $app.config.locale.value, $app.translate("to")),
			role: "button",
			"data-ccid": customComponentId.current,
			"data-event-id": calendarEvent.id,
			onMouseDown: (e) => createDragStartTimeout(handleStartDrag, e),
			onMouseUp: (e) => setClickedEventIfNotDragging(calendarEvent, e),
			onTouchStart: (e) => createDragStartTimeout(handleStartDrag, e),
			onTouchEnd: (e) => setClickedEventIfNotDragging(calendarEvent, e),
			onClick: (e) => invokeOnEventClickCallback($app, calendarEvent, e),
			onDblClick: (e) => invokeOnEventDoubleClickCallback($app, calendarEvent, e),
			onKeyDown: handleKeyDown,
			className: eventClasses.join(" "),
			style: {
				width: `calc(${calendarEvent._nDaysInGrid * 100}% - ${getWidthToSubtract(hasOverflowLeft, hasOverflowRight, !customComponent)}px)`,
				gridRow,
				display: eventCopy ? "none" : "flex",
				padding: customComponent ? "0px" : void 0,
				borderInlineStart: customComponent ? void 0 : borderInlineStartNonCustom,
				color: customComponent ? void 0 : eventCSSVariables.color,
				backgroundColor: customComponent ? void 0 : eventCSSVariables.backgroundColor,
				...getBorderRadius(hasOverflowLeft, hasOverflowRight, !!customComponent)
			},
			children: [
				!customComponent && !hasCustomContent && u$2(S$1, { children: [
					hasOverflowLeft && u$2("div", {
						className: "sx__date-grid-event--left-overflow",
						style: overflowStyles
					}),
					u$2("span", {
						className: "sx__date-grid-event-text",
						children: [
							calendarEvent.title,
							" \xA0",
							calendarEvent.start instanceof Temporal.ZonedDateTime && u$2("span", {
								className: "sx__date-grid-event-time",
								children: timeFn(calendarEvent.start, $app.config.locale.value)
							})
						]
					}),
					hasOverflowRight && u$2("div", {
						className: "sx__date-grid-event--right-overflow",
						style: overflowStyles
					})
				] }),
				hasCustomContent && u$2("div", { dangerouslySetInnerHTML: { __html: ((_c = calendarEvent._customContent) === null || _c === void 0 ? void 0 : _c.dateGrid) || "" } }),
				$app.config.plugins.resize && !((_d = calendarEvent._options) === null || _d === void 0 ? void 0 : _d.disableResize) && !endsAfterWeek && u$2("div", {
					className: "sx__date-grid-event-resize-handle",
					onMouseDown: startResize,
					onTouchStart: startResize
				})
			]
		}), eventCopy && u$2(DateGridEvent, {
			calendarEvent: eventCopy,
			gridRow,
			isCopy: true
		})] });
	}
	function DateGridDay({ calendarEvents, date, backgroundEvents }) {
		const $app = x$2(AppContext);
		const dateStart = Temporal.ZonedDateTime.from({
			year: Temporal.PlainDate.from(date).year,
			month: Temporal.PlainDate.from(date).month,
			day: Temporal.PlainDate.from(date).day,
			hour: $app.config.dayBoundaries.value.start === 0 ? 0 : $app.config.dayBoundaries.value.start / 100,
			minute: 0,
			second: 0,
			timeZone: $app.config.timezone.value
		});
		let dateEnd = Temporal.ZonedDateTime.from({
			year: Temporal.PlainDate.from(date).year,
			month: Temporal.PlainDate.from(date).month,
			day: Temporal.PlainDate.from(date).day,
			hour: $app.config.dayBoundaries.value.end === 2400 ? 23 : $app.config.dayBoundaries.value.end / 100,
			minute: $app.config.dayBoundaries.value.end === 2400 ? 59 : 0,
			second: $app.config.dayBoundaries.value.end === 2400 ? 59 : 0,
			timeZone: $app.config.timezone.value
		});
		if ($app.config.isHybridDay) dateEnd = dateEnd.add({ days: 1 });
		const fullDayBackgroundEvent = backgroundEvents.find((event) => {
			const eventStartWithTime = event.start instanceof Temporal.PlainDate ? event.start.toZonedDateTime($app.config.timezone.value) : event.start;
			const eventEndWithTime = event.end instanceof Temporal.PlainDate ? event.end.toZonedDateTime($app.config.timezone.value).with({
				hour: 23,
				minute: 59,
				second: 59
			}) : event.end;
			return eventStartWithTime.toString() <= dateStart.toString() && eventEndWithTime.toString() >= dateEnd.toString();
		});
		const handleMouseDown = (e) => {
			const callback = $app.config.callbacks.onMouseDownDateGridDate;
			if (!callback) return;
			callback(Temporal.PlainDate.from(date), e);
		};
		return u$2("div", {
			className: "sx__date-grid-day",
			"data-date-grid-date": date,
			children: [
				fullDayBackgroundEvent && u$2("div", {
					className: "sx__date-grid-background-event",
					title: fullDayBackgroundEvent.title,
					style: { ...fullDayBackgroundEvent.style }
				}),
				Object.values(calendarEvents).map((event, index) => {
					if (event === DATE_GRID_BLOCKER || !event) return u$2("div", {
						className: "sx__date-grid-cell",
						style: { gridRow: index + 1 },
						onMouseDown: handleMouseDown
					});
					return u$2(DateGridEvent, {
						calendarEvent: event,
						gridRow: index + 1
					}, event.start.toString() + event.end.toString() + index);
				}),
				u$2("div", {
					className: "sx__spacer",
					onMouseDown: handleMouseDown
				})
			]
		});
	}
	const filterByRange = (events, range, timezone) => {
		return events.filter((event) => {
			const rangeStart = range.start;
			const rangeEnd = range.end;
			let eventStart = event.start;
			let eventEnd = event.end;
			if (eventStart instanceof Temporal.PlainDate) eventStart = eventStart.toZonedDateTime(timezone);
			if (eventEnd instanceof Temporal.PlainDate) eventEnd = eventEnd.toZonedDateTime(timezone).with({
				hour: 23,
				minute: 59,
				second: 59,
				millisecond: 999,
				microsecond: 999,
				nanosecond: 999
			});
			const eventStartsInRange = eventStart.epochNanoseconds >= rangeStart.epochNanoseconds && eventStart.epochNanoseconds <= rangeEnd.epochNanoseconds;
			const eventEndInRange = eventEnd.epochNanoseconds >= rangeStart.epochNanoseconds && eventEnd.epochNanoseconds <= rangeEnd.epochNanoseconds;
			const eventStartBeforeAndEventEndAfterRange = eventStart.epochNanoseconds < rangeStart.epochNanoseconds && eventEnd.epochNanoseconds > rangeEnd.epochNanoseconds;
			return eventStartsInRange || eventEndInRange || eventStartBeforeAndEventEndAfterRange;
		});
	};
	const WeekWrapper = ({ $app, id }) => {
		document.documentElement.style.setProperty("--sx-week-grid-height", `${$app.config.weekOptions.value.gridHeight}px`);
		const week = useComputed(() => {
			var _a, _b;
			const rangeStart = (_a = $app.calendarState.range.value) === null || _a === void 0 ? void 0 : _a.start;
			const rangeEnd = (_b = $app.calendarState.range.value) === null || _b === void 0 ? void 0 : _b.end;
			if (!rangeStart || !rangeEnd) return {};
			let newWeek = createWeek($app);
			const filteredEvents = $app.calendarEvents.filterPredicate.value ? $app.calendarEvents.list.value.filter($app.calendarEvents.filterPredicate.value) : $app.calendarEvents.list.value;
			const { dateGridEvents, timeGridEvents } = sortEventsForWeekView(filteredEvents);
			newWeek = positionInDateGrid(dateGridEvents.sort(sortEventsByStartAndEnd), newWeek);
			Object.entries(newWeek).forEach(([date, day]) => {
				const plainDate = Temporal.PlainDate.from(date);
				const rangeStartDateTime = Temporal.ZonedDateTime.from({
					year: plainDate.year,
					month: plainDate.month,
					day: plainDate.day,
					hour: $app.config.dayBoundaries.value.start === 0 ? 0 : $app.config.dayBoundaries.value.start / 100,
					minute: 0,
					second: 0,
					timeZone: $app.config.timezone.value
				});
				let rangeEndDateTime = Temporal.ZonedDateTime.from({
					year: plainDate.year,
					month: plainDate.month,
					day: plainDate.day,
					hour: $app.config.dayBoundaries.value.end === 2400 ? 23 : $app.config.dayBoundaries.value.end / 100,
					minute: $app.config.dayBoundaries.value.end === 2400 ? 59 : 0,
					second: $app.config.dayBoundaries.value.end === 2400 ? 59 : 0,
					timeZone: $app.config.timezone.value
				});
				if ($app.config.isHybridDay) rangeEndDateTime = rangeEndDateTime.add({ days: 1 });
				day.backgroundEvents = filterByRange($app.calendarEvents.backgroundEvents.value, {
					start: rangeStartDateTime,
					end: rangeEndDateTime
				}, $app.config.timezone.value);
			});
			newWeek = positionInTimeGrid(timeGridEvents, newWeek, $app);
			return newWeek;
		});
		return u$2(S$1, { children: u$2(AppContext.Provider, {
			value: $app,
			children: u$2("div", {
				className: "sx__week-wrapper",
				id,
				children: [u$2("div", {
					className: "sx__week-header",
					children: u$2("div", {
						className: "sx__week-header-content",
						children: [
							u$2(DateAxis, { week: Object.values(week.value).map((day) => {
								const plainDate = Temporal.PlainDate.from(day.date);
								return Temporal.ZonedDateTime.from({
									year: plainDate.year,
									month: plainDate.month,
									day: plainDate.day,
									timeZone: $app.config.timezone.value
								});
							}) }),
							u$2("div", {
								className: "sx__date-grid",
								"aria-label": $app.translate("Full day- and multiple day events"),
								children: Object.values(week.value).map((day) => u$2(DateGridDay, {
									date: day.date,
									calendarEvents: day.dateGridEvents,
									backgroundEvents: day.backgroundEvents
								}, day.date))
							}),
							u$2("div", { className: "sx__week-header-border" })
						]
					})
				}), u$2("div", {
					className: "sx__week-grid",
					children: [u$2(TimeAxis, {}), Object.values(week.value).map((day) => {
						const { year, month, date } = toIntegers(day.date);
						const zonedDateTime = Temporal.ZonedDateTime.from({
							year,
							month: month + 1,
							day: date,
							timeZone: $app.config.timezone.value
						});
						return u$2(TimeGridDay, {
							calendarEvents: day.timeGridEvents,
							backgroundEvents: day.backgroundEvents,
							date: zonedDateTime
						}, day.date);
					})]
				})]
			})
		}) });
	};
	const getRangeStartGivenDayBoundaries = (calendarConfig, date) => {
		const timeString = timeStringFromTimePoints(calendarConfig.dayBoundaries.value.start);
		return Temporal.ZonedDateTime.from({
			year: date.year,
			month: date.month,
			day: date.day,
			hour: +timeString.split(":")[0],
			minute: +timeString.split(":")[1],
			timeZone: calendarConfig.timezone.value
		});
	};
	const getRangeEndGivenDayBoundaries = (calendarConfig, date) => {
		let dayEndTimeString = timeStringFromTimePoints(calendarConfig.dayBoundaries.value.end);
		let newRangeEndDate = date;
		if (calendarConfig.isHybridDay) newRangeEndDate = addDays(newRangeEndDate, 1);
		if (calendarConfig.dayBoundaries.value.end === 2400) dayEndTimeString = "23:59";
		return Temporal.ZonedDateTime.from({
			year: newRangeEndDate.year,
			month: newRangeEndDate.month,
			day: newRangeEndDate.day,
			hour: +dayEndTimeString.split(":")[0],
			minute: +dayEndTimeString.split(":")[1],
			timeZone: calendarConfig.timezone.value
		});
	};
	const setRangeForWeek = (config) => {
		const weekForDate = config.timeUnitsImpl.getWeekFor(config.date).slice(0, config.calendarConfig.weekOptions.value.nDays);
		return {
			start: getRangeStartGivenDayBoundaries(config.calendarConfig, weekForDate[0]),
			end: getRangeEndGivenDayBoundaries(config.calendarConfig, weekForDate[weekForDate.length - 1])
		};
	};
	const setRangeForMonth = (config) => {
		const monthForDate = config.timeUnitsImpl.getMonthWithTrailingAndLeadingDays(config.date.year, config.date.month);
		return {
			start: monthForDate[0][0],
			end: monthForDate[monthForDate.length - 1][monthForDate[monthForDate.length - 1].length - 1].with({
				hour: 23,
				minute: 59
			})
		};
	};
	const setRangeForDay = (config) => {
		let date = config.date;
		if (date instanceof Temporal.PlainDate) date = date.toZonedDateTime({ timeZone: config.calendarConfig.timezone.value });
		return {
			start: getRangeStartGivenDayBoundaries(config.calendarConfig, date),
			end: getRangeEndGivenDayBoundaries(config.calendarConfig, date)
		};
	};
	const viewWeek = createPreactView({
		name: InternalViewName.Week,
		label: "Week",
		Component: WeekWrapper,
		setDateRange: setRangeForWeek,
		hasSmallScreenCompat: false,
		hasWideScreenCompat: true,
		backwardForwardFn: addDays,
		backwardForwardUnits: 7
	});
	const DayWrapper = ({ $app, id }) => {
		return u$2(WeekWrapper, {
			"$app": $app,
			id
		});
	};
	const viewDay = createPreactView({
		name: InternalViewName.Day,
		label: "Day",
		setDateRange: setRangeForDay,
		hasWideScreenCompat: true,
		hasSmallScreenCompat: true,
		Component: DayWrapper,
		backwardForwardFn: addDays,
		backwardForwardUnits: 1
	});
	const getWeekNumber = (d, firstDayOfWeek) => {
		const zonedDate = d instanceof Temporal.PlainDate ? d.toZonedDateTime("UTC") : d.toInstant().toZonedDateTimeISO("UTC");
		const dayOffset = (zonedDate.dayOfWeek - firstDayOfWeek + 7) % 7;
		const adjustedDate = zonedDate.subtract({ days: dayOffset - 3 });
		const yearStart = Temporal.ZonedDateTime.from({
			year: adjustedDate.year,
			month: 1,
			day: 1,
			timeZone: "UTC"
		});
		const yearStartOffset = (yearStart.dayOfWeek - firstDayOfWeek + 7) % 7;
		const adjustedYearStart = yearStart.subtract({ days: yearStartOffset });
		const daysDiff = adjustedDate.until(adjustedYearStart, { largestUnit: "days" }).days;
		const weekNo = Math.ceil((Math.abs(daysDiff) + 1) / 7);
		const nextYearStart = Temporal.ZonedDateTime.from({
			year: adjustedDate.year + 1,
			month: 1,
			day: 1,
			timeZone: "UTC"
		});
		const nextYearStartOffset = (nextYearStart.dayOfWeek - firstDayOfWeek + 7) % 7;
		const adjustedNextYearStart = nextYearStart.subtract({ days: nextYearStartOffset });
		if (Temporal.ZonedDateTime.compare(adjustedDate, adjustedNextYearStart) >= 0) return 1;
		return weekNo;
	};
	function WeekNumber() {
		const $app = x$2(AppContext);
		return u$2("div", {
			className: "sx__calendar-header__week-number",
			children: $app.translate("CW", { week: getWeekNumber($app.datePickerState.selectedDate.value, $app.config.firstDayOfWeek.value) })
		});
	}
	function CalendarHeader() {
		const $app = x$2(AppContext);
		const datePickerAppSingleton = new DatePickerAppSingletonBuilder().withDatePickerState($app.datePickerState).withConfig($app.datePickerConfig).withTranslate($app.translate).withTimeUnitsImpl($app.timeUnitsImpl).build();
		const headerContent = $app.config._customComponentFns.headerContent;
		const headerContentId = d$2(headerContent ? randomStringId() : void 0)[0];
		const headerContentLeftPrepend = $app.config._customComponentFns.headerContentLeftPrepend;
		const headerContentLeftPrependId = d$2(headerContentLeftPrepend ? randomStringId() : void 0)[0];
		const headerContentLeftAppend = $app.config._customComponentFns.headerContentLeftAppend;
		const headerContentLeftAppendId = d$2(headerContentLeftAppend ? randomStringId() : void 0)[0];
		const headerContentRightPrepend = $app.config._customComponentFns.headerContentRightPrepend;
		const headerContentRightPrependId = d$2(headerContentRightPrepend ? randomStringId() : void 0)[0];
		const headerContentRightAppend = $app.config._customComponentFns.headerContentRightAppend;
		const headerContentRightAppendId = d$2(headerContentRightAppend ? randomStringId() : void 0)[0];
		h$2(() => {
			if (headerContent) headerContent(getElementByCCID(headerContentId), { $app });
			if (headerContentLeftPrepend && headerContentLeftPrependId) headerContentLeftPrepend(getElementByCCID(headerContentLeftPrependId), { $app });
			if (headerContentLeftAppend) headerContentLeftAppend(getElementByCCID(headerContentLeftAppendId), { $app });
			if (headerContentRightPrepend) headerContentRightPrepend(getElementByCCID(headerContentRightPrependId), { $app });
			if (headerContentRightAppend) headerContentRightAppend(getElementByCCID(headerContentRightAppendId), { $app });
		}, [
			$app.datePickerState.selectedDate.value,
			$app.calendarState.range.value,
			$app.calendarState.isDark.value,
			$app.calendarState.isCalendarSmall.value,
			$app.calendarState.range.value,
			$app.calendarState.view.value,
			$app.calendarState.isCalendarSmall.value
		]);
		const keyForRerenderingOnLocaleChange = $app.config.locale.value;
		const isDayOrWeekView = T$2(() => {
			return [viewWeek.name, viewDay.name].includes($app.calendarState.view.value);
		}, [$app.calendarState.view.value]);
		return u$2("header", {
			className: "sx__calendar-header",
			"data-ccid": headerContentId,
			children: !headerContent && u$2(S$1, { children: [u$2("div", {
				className: "sx__calendar-header-content",
				children: [
					headerContentLeftPrependId && u$2("div", { "data-ccid": headerContentLeftPrependId }),
					u$2(TodayButton, {}),
					u$2(ForwardBackwardNavigation, {}),
					u$2(RangeHeading, {}, $app.config.locale.value),
					$app.config.showWeekNumbers.value && isDayOrWeekView && u$2(WeekNumber, {}),
					headerContentLeftAppendId && u$2("div", { "data-ccid": headerContentLeftAppendId })
				]
			}), u$2("div", {
				className: "sx__calendar-header-content",
				children: [
					headerContentRightPrependId && u$2("div", { "data-ccid": headerContentRightPrependId }),
					$app.config.plugins.timezoneSelect && $app.config.plugins.timezoneSelect.isEnabled.value && u$2($app.config.plugins.timezoneSelect.ComponentFn, { "$app": $app }),
					$app.config.views.value.length > 1 && u$2(ViewSelection, {}, keyForRerenderingOnLocaleChange + "-view-selection"),
					u$2(AppWrapper, { "$app": datePickerAppSingleton }),
					headerContentRightAppendId && u$2("div", { "data-ccid": headerContentRightAppendId })
				]
			})] })
		});
	}
	const setWrapperElement = ($app, calendarId) => {
		$app.elements.calendarWrapper = document.getElementById(calendarId);
	};
	const setScreenSizeCompatibleView = ($app, isSmall) => {
		const currentView = $app.config.views.value.find((view) => view.name === $app.calendarState.view.value);
		if (isSmall) {
			if (currentView.hasSmallScreenCompat) return;
			const smallScreenCompatibleView = $app.config.views.value.find((view) => view.hasSmallScreenCompat);
			if (smallScreenCompatibleView) $app.calendarState.setView(smallScreenCompatibleView.name, $app.datePickerState.selectedDate.value);
		} else {
			if (currentView.hasWideScreenCompat) return;
			const wideScreenCompatibleView = $app.config.views.value.find((view) => view.hasWideScreenCompat);
			if (wideScreenCompatibleView) $app.calendarState.setView(wideScreenCompatibleView.name, $app.datePickerState.selectedDate.value);
		}
	};
	const handleWindowResize = ($app) => {
		const documentRoot = document.documentElement;
		const calendarRoot = $app.elements.calendarWrapper;
		const smallCalendarBreakpoint = 700 / (16 / +window.getComputedStyle(documentRoot).fontSize.split("p")[0]);
		if (!calendarRoot) return;
		const isSmall = $app.config.callbacks.isCalendarSmall ? $app.config.callbacks.isCalendarSmall($app) : calendarRoot.clientWidth < smallCalendarBreakpoint;
		if (!(isSmall !== $app.calendarState.isCalendarSmall.value)) return;
		$app.calendarState.isCalendarSmall.value = isSmall;
		setScreenSizeCompatibleView($app, isSmall);
	};
	const getClassForView = ($app) => {
		return `is-${$app.calendarState.view.value}-view`;
	};
	function useWrapperClasses($app) {
		const calendarWrapperClass = "sx__calendar-wrapper";
		const [wrapperClasses, setWrapperClasses] = d$2([calendarWrapperClass, getClassForView($app)]);
		useSignalEffect(() => {
			const classes = [calendarWrapperClass];
			if ($app.calendarState.isCalendarSmall.value) classes.push("sx__is-calendar-small");
			if ($app.calendarState.isDark.value) classes.push("is-dark");
			if ($app.config.theme === "shadcn") classes.push("is-shadcn");
			classes.push(getClassForView($app));
			setWrapperClasses(classes);
		});
		return wrapperClasses;
	}
	const externalEventToInternal = (event, config) => {
		const { id, start, end, title, description, location, people, _options, ...foreignProperties } = event;
		return new CalendarEventBuilder(config, id, start, end).withTitle(title).withDescription(description).withLocation(location).withPeople(people).withCalendarId(event.calendarId).withOptions(_options).withForeignProperties(foreignProperties).withCustomContent(event._customContent).withResourceId(event.resourceId).build();
	};
	const rangeToString = (range) => {
		if (!range) return null;
		return `${range.start.toString()}-${range.end.toString()}`;
	};
	function useFetchEvents($app) {
		const hasCalledFetchEventsOnRenderRef = A$2(false);
		const lastFetchedRangeRef = A$2(null);
		const fetchAndSetEvents = async () => {
			var _a, _b, _c;
			if (!((_a = $app.config.callbacks) === null || _a === void 0 ? void 0 : _a.fetchEvents) || !$app.calendarState.range.value) return;
			const currentRangeString = rangeToString($app.calendarState.range.value);
			if (currentRangeString === lastFetchedRangeRef.current) return;
			lastFetchedRangeRef.current = currentRangeString;
			const events = await $app.config.callbacks.fetchEvents($app.calendarState.range.value);
			$app.calendarEvents.list.value = events.map((event) => externalEventToInternal(event, $app.config));
			const currentRange = $app.calendarState.range.value;
			if (currentRange) (_c = (_b = $app.config.plugins.eventRecurrence) === null || _b === void 0 ? void 0 : _b.onRangeUpdate) === null || _c === void 0 || _c.call(_b, currentRange);
		};
		h$2(() => {
			var _a;
			if (((_a = $app.config.callbacks) === null || _a === void 0 ? void 0 : _a.fetchEvents) && $app.calendarState.range.value && !hasCalledFetchEventsOnRenderRef.current) {
				hasCalledFetchEventsOnRenderRef.current = true;
				fetchAndSetEvents();
			}
		}, []);
		useSignalEffect(() => {
			var _a;
			if (!((_a = $app.config.callbacks) === null || _a === void 0 ? void 0 : _a.fetchEvents) || !$app.calendarState.range.value || !hasCalledFetchEventsOnRenderRef.current) return;
			fetchAndSetEvents();
		});
	}
	const initPlugins = ($app) => {
		Object.values($app.config.plugins).forEach((plugin) => {
			if (plugin === null || plugin === void 0 ? void 0 : plugin.onRender) plugin.onRender($app);
		});
	};
	const destroyPlugins = ($app) => {
		Object.values($app.config.plugins).forEach((plugin) => {
			if (plugin === null || plugin === void 0 ? void 0 : plugin.destroy) plugin.destroy();
		});
	};
	const invokePluginsBeforeRender = ($app) => {
		Object.values($app.config.plugins).forEach((plugin) => {
			if (plugin === null || plugin === void 0 ? void 0 : plugin.beforeRender) plugin.beforeRender($app);
		});
	};
	function CalendarWrapper({ $app }) {
		var _a;
		const calendarId = randomStringId();
		const viewContainerId = randomStringId();
		useFetchEvents($app);
		h$2(() => {
			var _a;
			setWrapperElement($app, calendarId);
			initPlugins($app);
			if ((_a = $app.config.callbacks) === null || _a === void 0 ? void 0 : _a.onRender) $app.config.callbacks.onRender($app);
			return () => destroyPlugins($app);
		}, []);
		const onResize = () => {
			handleWindowResize($app);
		};
		h$2(() => {
			if ($app.config.isResponsive) {
				onResize();
				window.addEventListener("resize", onResize);
				return () => window.removeEventListener("resize", onResize);
			}
		}, []);
		const wrapperClasses = useWrapperClasses($app);
		const [currentView, setCurrentView] = d$2();
		useSignalEffect(() => {
			const newView = $app.config.views.value.find((view) => view.name === $app.calendarState.view.value);
			const viewElement = document.getElementById(viewContainerId);
			if (!newView || !viewElement || newView.name === (currentView === null || currentView === void 0 ? void 0 : currentView.name)) return;
			if (currentView) currentView.destroy();
			setCurrentView(newView);
			newView.render(viewElement, $app);
		});
		const [previousRangeStart, setPreviousRangeStart] = d$2("");
		const [transitionClass, setTransitionClass] = d$2("");
		useSignalEffect(() => {
			var _a, _b;
			if ($app.calendarState.view.value === InternalViewName.List) return;
			if ($app.config.skipAnimations) return;
			const newRangeStartIsLaterThanPrevious = (((_a = $app.calendarState.range.value) === null || _a === void 0 ? void 0 : _a.start.toString()) || "") > previousRangeStart;
			setTransitionClass(newRangeStartIsLaterThanPrevious ? "sx__slide-left" : "sx__slide-right");
			setTimeout(() => {
				setTransitionClass("");
			}, 300);
			setPreviousRangeStart(((_b = $app.calendarState.range.value) === null || _b === void 0 ? void 0 : _b.start.toString()) || "");
		});
		useSignalEffect(() => {
			$app.datePickerConfig.locale.value = $app.config.locale.value;
		});
		return u$2(S$1, { children: u$2("div", {
			className: wrapperClasses.join(" "),
			id: calendarId,
			children: u$2("div", {
				className: "sx__calendar",
				children: u$2(AppContext.Provider, {
					value: $app,
					children: [
						u$2(CalendarHeader, {}),
						u$2("div", {
							className: ["sx__view-container", transitionClass].join(" "),
							id: viewContainerId
						}),
						$app.config.plugins.eventModal && $app.config.plugins.eventModal.calendarEvent.value && u$2($app.config.plugins.eventModal.ComponentFn, { "$app": $app }, (_a = $app.config.plugins.eventModal.calendarEvent.value) === null || _a === void 0 ? void 0 : _a.id)
					]
				})
			})
		}) });
	}
	var EventsFacadeImpl = class {
		constructor($app) {
			Object.defineProperty(this, "$app", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: $app
			});
		}
		set(events) {
			this.$app.calendarEvents.list.value = events.map((event) => externalEventToInternal(event, this.$app.config));
		}
		add(event) {
			const newEvent = externalEventToInternal(event, this.$app.config);
			newEvent._createdAt = /* @__PURE__ */ new Date();
			const copiedEvents = [...this.$app.calendarEvents.list.value];
			copiedEvents.push(newEvent);
			this.$app.calendarEvents.list.value = copiedEvents;
		}
		get(id) {
			var _a;
			return (_a = this.$app.calendarEvents.list.value.find((event) => event.id === id)) === null || _a === void 0 ? void 0 : _a._getExternalEvent();
		}
		getAll() {
			return this.$app.calendarEvents.list.value.map((event) => event._getExternalEvent());
		}
		remove(id) {
			const index = this.$app.calendarEvents.list.value.findIndex((event) => event.id === id);
			const copiedEvents = [...this.$app.calendarEvents.list.value];
			copiedEvents.splice(index, 1);
			this.$app.calendarEvents.list.value = copiedEvents;
		}
		update(event) {
			const index = this.$app.calendarEvents.list.value.findIndex((e) => e.id === event.id);
			const copiedEvents = [...this.$app.calendarEvents.list.value];
			copiedEvents.splice(index, 1, externalEventToInternal(event, this.$app.config));
			this.$app.calendarEvents.list.value = copiedEvents;
		}
	};
	var CalendarApp = class {
		constructor($app) {
			var _a;
			Object.defineProperty(this, "$app", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: $app
			});
			Object.defineProperty(this, "events", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "calendarContainerEl", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			this.events = new EventsFacadeImpl(this.$app);
			invokePluginsBeforeRender(this.$app);
			Object.values(this.$app.config.plugins).forEach((plugin) => {
				if (!(plugin === null || plugin === void 0 ? void 0 : plugin.name)) return;
				this[plugin.name] = plugin;
			});
			if ((_a = $app.config.callbacks) === null || _a === void 0 ? void 0 : _a.beforeRender) $app.config.callbacks.beforeRender($app);
		}
		render(el) {
			this.calendarContainerEl = el;
			R(k$2(CalendarWrapper, { $app: this.$app }), el);
		}
		destroy() {
			Object.values(this.$app.config.plugins || {}).forEach((plugin) => {
				if (!plugin || !plugin.destroy) return;
				plugin.destroy();
			});
			if (this.calendarContainerEl) R(null, this.calendarContainerEl);
		}
		setTheme(theme) {
			this.$app.calendarState.isDark.value = theme === "dark";
		}
		getTheme() {
			return this.$app.calendarState.isDark.value ? "dark" : "light";
		}
		/**
		* @internal
		* Purpose: To be consumed by framework adapters for custom component rendering.
		* */
		_setCustomComponentFn(fnId, fn) {
			this.$app.config._customComponentFns[fnId] = fn;
		}
		_setDestroyCustomComponentInstance(cb) {
			this.$app.config._destroyCustomComponentInstance = cb;
		}
	};
	var CalendarAppSingletonImpl = class {
		constructor(config, timeUnitsImpl, calendarState, datePickerState, translate, datePickerConfig, calendarEvents, elements = { calendarWrapper: void 0 }) {
			Object.defineProperty(this, "config", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: config
			});
			Object.defineProperty(this, "timeUnitsImpl", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: timeUnitsImpl
			});
			Object.defineProperty(this, "calendarState", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: calendarState
			});
			Object.defineProperty(this, "datePickerState", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: datePickerState
			});
			Object.defineProperty(this, "translate", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: translate
			});
			Object.defineProperty(this, "datePickerConfig", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: datePickerConfig
			});
			Object.defineProperty(this, "calendarEvents", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: calendarEvents
			});
			Object.defineProperty(this, "elements", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: elements
			});
		}
	};
	var CalendarAppSingletonBuilder = class {
		constructor() {
			Object.defineProperty(this, "config", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "timeUnitsImpl", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "datePickerState", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "calendarState", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "translate", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "datePickerConfig", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "calendarEvents", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
		}
		build() {
			return new CalendarAppSingletonImpl(this.config, this.timeUnitsImpl, this.calendarState, this.datePickerState, this.translate, this.datePickerConfig, this.calendarEvents);
		}
		withConfig(config) {
			this.config = config;
			return this;
		}
		withTimeUnitsImpl(timeUnitsImpl) {
			this.timeUnitsImpl = timeUnitsImpl;
			return this;
		}
		withDatePickerState(datePickerState) {
			this.datePickerState = datePickerState;
			return this;
		}
		withCalendarState(calendarState) {
			this.calendarState = calendarState;
			return this;
		}
		withTranslate(translate) {
			this.translate = translate;
			return this;
		}
		withDatePickerConfig(datePickerConfig) {
			this.datePickerConfig = datePickerConfig;
			return this;
		}
		withCalendarEvents(calendarEvents) {
			this.calendarEvents = calendarEvents;
			return this;
		}
	};
	var DateFormatDelimiter;
	(function(DateFormatDelimiter) {
		DateFormatDelimiter["SLASH"] = "/";
		DateFormatDelimiter["DASH"] = "-";
		DateFormatDelimiter["PERIOD"] = ".";
	})(DateFormatDelimiter || (DateFormatDelimiter = {}));
	var DateFormatOrder;
	(function(DateFormatOrder) {
		DateFormatOrder["DMY"] = "DMY";
		DateFormatOrder["MDY"] = "MDY";
		DateFormatOrder["YMD"] = "YMD";
	})(DateFormatOrder || (DateFormatOrder = {}));
	const formatRules = {
		slashMDY: {
			delimiter: DateFormatDelimiter.SLASH,
			order: DateFormatOrder.MDY
		},
		slashDMY: {
			delimiter: DateFormatDelimiter.SLASH,
			order: DateFormatOrder.DMY
		},
		slashYMD: {
			delimiter: DateFormatDelimiter.SLASH,
			order: DateFormatOrder.YMD
		},
		periodDMY: {
			delimiter: DateFormatDelimiter.PERIOD,
			order: DateFormatOrder.DMY
		},
		dashYMD: {
			delimiter: DateFormatDelimiter.DASH,
			order: DateFormatOrder.YMD
		},
		dashDMY: {
			delimiter: DateFormatDelimiter.DASH,
			order: DateFormatOrder.DMY
		}
	};
	const dateFormatLocalizedRules = /* @__PURE__ */ new Map([
		["ca-ES", formatRules.slashDMY],
		["cs-CZ", formatRules.periodDMY],
		["da-DK", formatRules.periodDMY],
		["de-DE", formatRules.periodDMY],
		["en-GB", formatRules.slashDMY],
		["en-US", formatRules.slashMDY],
		["es-ES", formatRules.slashDMY],
		["et-EE", formatRules.periodDMY],
		["fi-FI", formatRules.periodDMY],
		["fr-FR", formatRules.slashDMY],
		["fr-CH", formatRules.periodDMY],
		["hr-HR", formatRules.periodDMY],
		["id-ID", formatRules.slashDMY],
		["it-IT", formatRules.slashDMY],
		["ja-JP", formatRules.slashYMD],
		["ko-KR", formatRules.slashYMD],
		["ky-KG", formatRules.slashDMY],
		["lt-LT", formatRules.dashYMD],
		["mk-MK", formatRules.periodDMY],
		["nl-NL", formatRules.dashDMY],
		["pl-PL", formatRules.periodDMY],
		["pt-BR", formatRules.slashDMY],
		["ro-RO", formatRules.periodDMY],
		["ru-RU", formatRules.periodDMY],
		["sk-SK", formatRules.periodDMY],
		["sl-SI", formatRules.periodDMY],
		["sr-Latn-RS", formatRules.periodDMY],
		["sr-RS", formatRules.periodDMY],
		["sv-SE", formatRules.dashYMD],
		["tr-TR", formatRules.periodDMY],
		["uk-UA", formatRules.periodDMY],
		["zh-CN", formatRules.slashYMD],
		["zh-TW", formatRules.slashYMD]
	]);
	var LocaleNotSupportedError = class extends Error {
		constructor(locale) {
			super(`Locale not supported: ${locale}`);
		}
	};
	var InvalidDateFormatError = class extends Error {
		constructor(dateFormat, locale) {
			super(`Invalid date format: ${dateFormat} for locale: ${locale}`);
		}
	};
	const _getMatchesOrThrow = (format, matcher, locale) => {
		const matches = format.match(matcher);
		if (!matches) throw new InvalidDateFormatError(format, locale);
		return matches;
	};
	const toDateString = (format, locale) => {
		if (/^\d{4}-\d{2}-\d{2}$/.test(format)) return format;
		const localeDateFormatRule = dateFormatLocalizedRules.get(locale);
		if (!localeDateFormatRule) throw new LocaleNotSupportedError(locale);
		const { order, delimiter } = localeDateFormatRule;
		const pattern224Slashed = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
		const pattern224Dotted = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
		const pattern442Slashed = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
		if (order === DateFormatOrder.DMY && delimiter === DateFormatDelimiter.SLASH) {
			const [, day, month, year] = _getMatchesOrThrow(format, pattern224Slashed, locale);
			return `${year}-${doubleDigit(+month)}-${doubleDigit(+day)}`;
		}
		if (order === DateFormatOrder.MDY && delimiter === DateFormatDelimiter.SLASH) {
			const [, month, day, year] = _getMatchesOrThrow(format, pattern224Slashed, locale);
			return `${year}-${doubleDigit(+month)}-${doubleDigit(+day)}`;
		}
		if (order === DateFormatOrder.YMD && delimiter === DateFormatDelimiter.SLASH) {
			const [, year, month, day] = _getMatchesOrThrow(format, pattern442Slashed, locale);
			return `${year}-${doubleDigit(+month)}-${doubleDigit(+day)}`;
		}
		if (order === DateFormatOrder.DMY && delimiter === DateFormatDelimiter.PERIOD) {
			const [, day, month, year] = _getMatchesOrThrow(format, pattern224Dotted, locale);
			return `${year}-${doubleDigit(+month)}-${doubleDigit(+day)}`;
		}
		throw new InvalidDateFormatError(format, locale);
	};
	const getLocalizedDate = (date, locale) => {
		return toLocalizedDateString(date, locale);
	};
	const createDatePickerState = (config, selectedDateParam) => {
		var _a;
		const initialSelectedDate = selectedDateParam instanceof Temporal.PlainDate ? selectedDateParam : Temporal.Now.plainDateISO();
		const isOpen = y$1(false);
		const isDisabled = y$1(config.disabled || false);
		const datePickerView = y$1(DatePickerView.MONTH_DAYS);
		const selectedDate = y$1(initialSelectedDate);
		const datePickerDate = y$1(initialSelectedDate);
		const isDark = y$1(((_a = config.style) === null || _a === void 0 ? void 0 : _a.dark) || false);
		const inputDisplayedValue = y$1(toLocalizedDateString(initialSelectedDate, config.locale.value));
		const lastValidDisplayedValue = y$1(inputDisplayedValue.value);
		const handleInput = (newInputValue) => {
			try {
				const newValue = toDateString(newInputValue, config.locale.value);
				if (newValue < config.min.toString() || newValue > config.max.toString()) {
					inputDisplayedValue.value = lastValidDisplayedValue.value;
					return;
				}
				const { year, month, date: day } = toIntegers(newValue);
				const newPlainDate = Temporal.PlainDate.from({
					year,
					month: month + 1,
					day
				});
				selectedDate.value = newPlainDate;
				datePickerDate.value = newPlainDate;
				lastValidDisplayedValue.value = inputDisplayedValue.value;
			} catch (_e) {}
		};
		j(() => {
			inputDisplayedValue.value = getLocalizedDate(selectedDate.value, config.locale.value);
		});
		let wasInitialized = false;
		const handleOnChange = (selectedDate) => {
			if (!wasInitialized) return wasInitialized = true;
			config.listeners.onChange(selectedDate);
		};
		j(() => {
			var _a;
			if ((_a = config.listeners) === null || _a === void 0 ? void 0 : _a.onChange) handleOnChange(selectedDate.value);
		});
		return {
			inputWrapperElement: y$1(void 0),
			isOpen,
			isDisabled,
			datePickerView,
			selectedDate,
			datePickerDate,
			inputDisplayedValue,
			handleInput,
			isDark,
			open: () => isOpen.value = true,
			close: () => isOpen.value = false,
			toggle: () => isOpen.value = !isOpen.value,
			setView: (view) => datePickerView.value = view
		};
	};
	const datePickerArEG = {
		Date: "التاريخ",
		"MM/DD/YYYY": "DD/MM/YYYY",
		"Next month": "الشهر القادم",
		"Previous month": "الشهر السابق",
		"Choose Date": "اختر التاريخ"
	};
	const timePickerArEG = {
		Time: "الوقت",
		AM: "ص",
		PM: "م",
		Cancel: "إلغاء",
		OK: "موافق",
		"Select time": "اختر الوقت"
	};
	const arEG = {
		Today: "اليوم",
		Month: "الشهر",
		Week: "الأسبوع",
		Day: "اليوم",
		List: "القائمة",
		"Select View": "اختر العرض",
		"+ {{n}} events": "+ {{n}} الأحداث",
		"+ 1 event": "+ 1 حدث",
		"No events": "لا توجد أحداث",
		"Next period": "الفترة التالية",
		"Previous period": "الفترة السابقة",
		to: "إلى",
		"Full day- and multiple day events": "أحداث ليوم كامل أو لعدة أيام",
		"Link to {{n}} more events on {{date}}": "رابط إلى {{n}} أحداث أخرى في {{date}}",
		"Link to 1 more event on {{date}}": "رابط إلى حدث آخر في {{date}}",
		CW: "الأسبوع {{week}}",
		View: "عرض",
		...datePickerArEG,
		...timePickerArEG
	};
	const datePickerDeDE = {
		Date: "Datum",
		"MM/DD/YYYY": "TT.MM.JJJJ",
		"Next month": "Nächster Monat",
		"Previous month": "Vorheriger Monat",
		"Choose Date": "Datum auswählen"
	};
	const calendarDeDE = {
		Today: "Heute",
		Month: "Monat",
		Week: "Woche",
		Day: "Tag",
		List: "Liste",
		"Select View": "Ansicht auswählen",
		View: "Ansicht",
		"+ {{n}} events": "+ {{n}} Ereignisse",
		"+ 1 event": "+ 1 Ereignis",
		"No events": "Keine Ereignisse",
		"Next period": "Nächster Zeitraum",
		"Previous period": "Vorheriger Zeitraum",
		to: "bis",
		"Full day- and multiple day events": "Ganztägige und mehrtägige Termine",
		"Link to {{n}} more events on {{date}}": "Link zu {{n}} weiteren Terminen am {{date}}",
		"Link to 1 more event on {{date}}": "Link zu 1 weiterem Termin am {{date}}",
		CW: "KW {{week}}"
	};
	const timePickerDeDE = {
		Time: "Uhrzeit",
		AM: "AM",
		PM: "PM",
		Cancel: "Abbrechen",
		OK: "OK",
		"Select time": "Uhrzeit auswählen"
	};
	const deDE = {
		...datePickerDeDE,
		...calendarDeDE,
		...timePickerDeDE
	};
	const datePickerEnUS = {
		Date: "Date",
		"MM/DD/YYYY": "MM/DD/YYYY",
		"Next month": "Next month",
		"Previous month": "Previous month",
		"Choose Date": "Choose Date"
	};
	const calendarEnUS = {
		Today: "Today",
		Month: "Month",
		Week: "Week",
		Day: "Day",
		List: "List",
		"Select View": "Select View",
		View: "View",
		"+ {{n}} events": "+ {{n}} events",
		"+ 1 event": "+ 1 event",
		"No events": "No events",
		"Next period": "Next period",
		"Previous period": "Previous period",
		to: "to",
		"Full day- and multiple day events": "Full day- and multiple day events",
		"Link to {{n}} more events on {{date}}": "Link to {{n}} more events on {{date}}",
		"Link to 1 more event on {{date}}": "Link to 1 more event on {{date}}",
		CW: "Week {{week}}"
	};
	const timePickerEnUS = {
		Time: "Time",
		AM: "AM",
		PM: "PM",
		Cancel: "Cancel",
		OK: "OK",
		"Select time": "Select time"
	};
	const enUS = {
		...datePickerEnUS,
		...calendarEnUS,
		...timePickerEnUS
	};
	const datePickerItIT = {
		Date: "Data",
		"MM/DD/YYYY": "DD/MM/YYYY",
		"Next month": "Mese successivo",
		"Previous month": "Mese precedente",
		"Choose Date": "Scegli la data"
	};
	const calendarItIT = {
		Today: "Oggi",
		Month: "Mese",
		Week: "Settimana",
		Day: "Giorno",
		List: "Lista",
		"Select View": "Seleziona la vista",
		View: "Vista",
		"+ {{n}} events": "+ {{n}} eventi",
		"+ 1 event": "+ 1 evento",
		"No events": "Nessun evento",
		"Next period": "Periodo successivo",
		"Previous period": "Periodo precedente",
		to: "a",
		"Full day- and multiple day events": "Eventi della giornata e plurigiornalieri",
		"Link to {{n}} more events on {{date}}": "Link a {{n}} eventi in più il {{date}}",
		"Link to 1 more event on {{date}}": "Link a 1 evento in più il {{date}}",
		CW: "Settimana {{week}}"
	};
	const timePickerItIT = {
		Time: "Ora",
		AM: "AM",
		PM: "PM",
		Cancel: "Annulla",
		OK: "OK",
		"Select time": "Seleziona ora"
	};
	const itIT = {
		...datePickerItIT,
		...calendarItIT,
		...timePickerItIT
	};
	const datePickerEnGB = {
		Date: "Date",
		"MM/DD/YYYY": "DD/MM/YYYY",
		"Next month": "Next month",
		"Previous month": "Previous month",
		"Choose Date": "Choose Date"
	};
	const calendarEnGB = {
		Today: "Today",
		Month: "Month",
		Week: "Week",
		Day: "Day",
		List: "List",
		"Select View": "Select View",
		"+ {{n}} events": "+ {{n}} events",
		"+ 1 event": "+ 1 event",
		"No events": "No events",
		"Next period": "Next period",
		"Previous period": "Previous period",
		to: "to",
		"Full day- and multiple day events": "Full day- and multiple day events",
		"Link to {{n}} more events on {{date}}": "Link to {{n}} more events on {{date}}",
		"Link to 1 more event on {{date}}": "Link to 1 more event on {{date}}",
		CW: "Week {{week}}",
		View: "View"
	};
	const timePickerEnGB = {
		Time: "Time",
		AM: "AM",
		PM: "PM",
		Cancel: "Cancel",
		OK: "OK",
		"Select time": "Select time"
	};
	const enGB = {
		...datePickerEnGB,
		...calendarEnGB,
		...timePickerEnGB
	};
	const datePickerSvSE = {
		Date: "Datum",
		"MM/DD/YYYY": "ÅÅÅÅ-MM-DD",
		"Next month": "Nästa månad",
		"Previous month": "Föregående månad",
		"Choose Date": "Välj datum"
	};
	const calendarSvSE = {
		Today: "Idag",
		Month: "Månad",
		Week: "Vecka",
		Day: "Dag",
		List: "Lista",
		"Select View": "Välj vy",
		View: "Vy",
		"+ {{n}} events": "+ {{n}} händelser",
		"+ 1 event": "+ 1 händelse",
		"No events": "Inga händelser",
		"Next period": "Nästa period",
		"Previous period": "Föregående period",
		to: "till",
		"Full day- and multiple day events": "Heldags- och flerdagshändelser",
		"Link to {{n}} more events on {{date}}": "Länk till {{n}} fler händelser den {{date}}",
		"Link to 1 more event on {{date}}": "Länk till 1 händelse till den {{date}}",
		CW: "Vecka {{week}}"
	};
	const timePickerSvSE = {
		Time: "Tid",
		AM: "FM",
		PM: "EM",
		Cancel: "Avbryt",
		OK: "OK",
		"Select time": "Välj tid"
	};
	const svSE = {
		...datePickerSvSE,
		...calendarSvSE,
		...timePickerSvSE
	};
	const datePickerZhCN = {
		Date: "日期",
		"MM/DD/YYYY": "年/月/日",
		"Next month": "下个月",
		"Previous month": "上个月",
		"Choose Date": "选择日期"
	};
	const calendarZhCN = {
		Today: "今天",
		Month: "月",
		Week: "周",
		Day: "日",
		List: "列表",
		"Select View": "选择视图",
		View: "视图",
		"+ {{n}} events": "+ {{n}} 场活动",
		"+ 1 event": "+ 1 活动",
		"No events": "没有活动",
		"Next period": "下一段时间",
		"Previous period": "上一段时间",
		to: "至",
		"Full day- and multiple day events": "全天和多天活动",
		"Link to {{n}} more events on {{date}}": "链接到{{date}}上的{{n}}个更多活动",
		"Link to 1 more event on {{date}}": "链接到{{date}}上的1个更多活动",
		CW: "第{{week}}周"
	};
	const timePickerZhCN = {
		Time: "时间",
		AM: "上午",
		PM: "下午",
		Cancel: "取消",
		OK: "确定",
		"Select time": "选择时间"
	};
	const zhCN = {
		...datePickerZhCN,
		...calendarZhCN,
		...timePickerZhCN
	};
	const datePickerZhTW = {
		Date: "日期",
		"MM/DD/YYYY": "年/月/日",
		"Next month": "下個月",
		"Previous month": "上個月",
		"Choose Date": "選擇日期"
	};
	const calendarZhTW = {
		Today: "今天",
		Month: "月",
		Week: "周",
		Day: "日",
		List: "列表",
		"Select View": "選擇檢視模式",
		View: "檢視",
		"+ {{n}} events": "+ {{n}} 場活動",
		"+ 1 event": "+ 1 活動",
		"No events": "沒有活動",
		"Next period": "下一段時間",
		"Previous period": "上一段時間",
		to: "到",
		"Full day- and multiple day events": "全天和多天活動",
		"Link to {{n}} more events on {{date}}": "連接到{{date}}上的{{n}}個更多活動",
		"Link to 1 more event on {{date}}": "連接到{{date}}上的1個更多活動",
		CW: "第{{week}}周"
	};
	const timePickerZhTW = {
		Time: "時間",
		AM: "上午",
		PM: "下午",
		Cancel: "取消",
		OK: "確定",
		"Select time": "選擇時間"
	};
	const zhTW = {
		...datePickerZhTW,
		...calendarZhTW,
		...timePickerZhTW
	};
	const datePickerJaJP = {
		Date: "日付",
		"MM/DD/YYYY": "年/月/日",
		"Next month": "次の月",
		"Previous month": "前の月",
		"Choose Date": "日付を選択"
	};
	const calendarJaJP = {
		Today: "今日",
		Month: "月",
		Week: "週",
		Day: "日",
		List: "リスト",
		"Select View": "ビューを選択",
		View: "ビュー",
		"+ {{n}} events": "+ {{n}} イベント",
		"+ 1 event": "+ 1 イベント",
		"No events": "イベントなし",
		"Next period": "次の期間",
		"Previous period": "前の期間",
		to: "から",
		"Full day- and multiple day events": "終日および複数日イベント",
		"Link to {{n}} more events on {{date}}": "{{date}} に{{n}}件のイベントへのリンク",
		"Link to 1 more event on {{date}}": "{{date}} に1件のイベントへのリンク",
		CW: "週 {{week}}"
	};
	const timePickerJaJP = {
		Time: "時間",
		AM: "午前",
		PM: "午後",
		Cancel: "キャンセル",
		OK: "OK",
		"Select time": "時間を選択"
	};
	const jaJP = {
		...datePickerJaJP,
		...calendarJaJP,
		...timePickerJaJP
	};
	const datePickerRuRU = {
		Date: "Дата",
		"MM/DD/YYYY": "ММ/ДД/ГГГГ",
		"Next month": "Следующий месяц",
		"Previous month": "Прошлый месяц",
		"Choose Date": "Выберите дату"
	};
	const calendarRuRU = {
		Today: "Сегодня",
		Month: "Месяц",
		Week: "Неделя",
		Day: "День",
		List: "Список",
		"Select View": "Выберите вид",
		"+ {{n}} events": "+ {{n}} события",
		"+ 1 event": "+ 1 событие",
		"No events": "Нет событий",
		"Next period": "Следующий период",
		"Previous period": "Прошлый период",
		to: "по",
		"Full day- and multiple day events": "События на целый день и несколько дней подряд",
		"Link to {{n}} more events on {{date}}": "Ссылка на {{n}} дополнительных событий на {{date}}",
		"Link to 1 more event on {{date}}": "Ссылка на 1 дополнительное событие на {{date}}",
		CW: "Неделя {{week}}",
		View: "Вид"
	};
	const timePickerRuRU = {
		Time: "Время",
		AM: "AM",
		PM: "PM",
		Cancel: "Отмена",
		OK: "ОК",
		"Select time": "Выберите время"
	};
	const ruRU = {
		...datePickerRuRU,
		...calendarRuRU,
		...timePickerRuRU
	};
	const datePickerKoKR = {
		Date: "일자",
		"MM/DD/YYYY": "년/월/일",
		"Next month": "다음 달",
		"Previous month": "이전 달",
		"Choose Date": "날짜 선택"
	};
	const calendarKoKR = {
		Today: "오늘",
		Month: "월",
		Week: "주",
		Day: "일",
		List: "목록",
		"Select View": "보기 선택",
		"+ {{n}} events": "+ {{n}} 일정들",
		"+ 1 event": "+ 1 일정",
		"No events": "일정 없음",
		"Next period": "다음",
		"Previous period": "이전",
		to: "부터",
		"Full day- and multiple day events": "종일 및 복수일 일정",
		"Link to {{n}} more events on {{date}}": "{{date}}에 {{n}}개 이상의 이벤트로 이동",
		"Link to 1 more event on {{date}}": "{{date}}에 1개 이상의 이벤트로 이동",
		CW: "{{week}}주",
		View: "보기"
	};
	const timePickerKoKR = {
		Time: "시간",
		AM: "오전",
		PM: "오후",
		Cancel: "취소",
		OK: "확인",
		"Select time": "시간 선택"
	};
	const koKR = {
		...datePickerKoKR,
		...calendarKoKR,
		...timePickerKoKR
	};
	const datePickerFrFR = {
		Date: "Date",
		"MM/DD/YYYY": "JJ/MM/AAAA",
		"Next month": "Mois suivant",
		"Previous month": "Mois précédent",
		"Choose Date": "Choisir une date"
	};
	const calendarFrFR = {
		Today: "Aujourd'hui",
		Month: "Mois",
		Week: "Semaine",
		Day: "Jour",
		List: "Liste",
		"Select View": "Sélectionner la vue",
		View: "Vue",
		"+ {{n}} events": "+ {{n}} événements",
		"+ 1 event": "+ 1 événement",
		"No events": "Aucun événement",
		"Next period": "Période suivante",
		"Previous period": "Période précédente",
		to: "au",
		"Full day- and multiple day events": "Événements sur une journée ou plusieurs jours",
		"Link to {{n}} more events on {{date}}": "Lien vers {{n}} événements supplémentaires le {{date}}",
		"Link to 1 more event on {{date}}": "Lien vers 1 événement supplémentaire le {{date}}",
		CW: "S{{week}}"
	};
	const timePickerFrFR = {
		Time: "Heure",
		AM: "AM",
		PM: "PM",
		Cancel: "Annuler",
		OK: "OK",
		"Select time": "Sélectionner l'heure"
	};
	const frFR = {
		...datePickerFrFR,
		...calendarFrFR,
		...timePickerFrFR
	};
	const datePickerDaDK = {
		Date: "Dato",
		"MM/DD/YYYY": "ÅÅÅÅ-MM-DD",
		"Next month": "Næste måned",
		"Previous month": "Foregående måned",
		"Choose Date": "Vælg dato"
	};
	const calendarDaDK = {
		Today: "I dag",
		Month: "Måned",
		Week: "Uge",
		Day: "Dag",
		List: "Liste",
		"Select View": "Vælg visning",
		"+ {{n}} events": "+ {{n}} begivenheder",
		"+ 1 event": "+ 1 begivenhed",
		"No events": "Ingen begivenheder",
		"Next period": "Næste periode",
		"Previous period": "Forgående periode",
		to: "til",
		"Full day- and multiple day events": "Heldagsbegivenheder og flerdagsbegivenheder",
		"Link to {{n}} more events on {{date}}": "Link til {{n}} flere begivenheder den {{date}}",
		"Link to 1 more event on {{date}}": "Link til 1 mere begivenhed den {{date}}",
		CW: "Uge {{week}}",
		View: "Visning"
	};
	const timePickerDaDK = {
		Time: "Tid",
		AM: "AM",
		PM: "PM",
		Cancel: "Annuller",
		OK: "OK",
		"Select time": "Vælg tid"
	};
	const daDK = {
		...datePickerDaDK,
		...calendarDaDK,
		...timePickerDaDK
	};
	const datePickerPlPL = {
		Date: "Data",
		"MM/DD/YYYY": "DD/MM/YYYY",
		"Next month": "Następny miesiąc",
		"Previous month": "Poprzedni miesiąc",
		"Choose Date": "Wybiewrz datę"
	};
	const calendarPlPL = {
		Today: "Dzisiaj",
		Month: "Miesiąc",
		Week: "Tydzień",
		Day: "Dzień",
		List: "Lista",
		"Select View": "Wybierz widok",
		"+ {{n}} events": "+ {{n}} wydarzenia",
		"+ 1 event": "+ 1 wydarzenie",
		"No events": "Brak wydarzeń",
		"Next period": "Następny okres",
		"Previous period": "Poprzedni okres",
		to: "do",
		"Full day- and multiple day events": "Wydarzenia całodniowe i wielodniowe",
		"Link to {{n}} more events on {{date}}": "Link do {{n}} kolejnych wydarzeń w dniu {{date}}",
		"Link to 1 more event on {{date}}": "Link do 1 kolejnego wydarzenia w dniu {{date}}",
		CW: "Tydzień {{week}}",
		View: "Widok"
	};
	const timePickerPlPL = {
		Time: "Godzina",
		AM: "AM",
		PM: "PM",
		Cancel: "Anuluj",
		OK: "OK",
		"Select time": "Wybierz godzinę"
	};
	const plPL = {
		...datePickerPlPL,
		...calendarPlPL,
		...timePickerPlPL
	};
	const datePickerEsES = {
		Date: "Fecha",
		"MM/DD/YYYY": "DD/MM/YYYY",
		"Next month": "Siguiente mes",
		"Previous month": "Mes anterior",
		"Choose Date": "Seleccione una fecha"
	};
	const calendarEsES = {
		Today: "Hoy",
		Month: "Mes",
		Week: "Semana",
		Day: "Día",
		List: "Lista",
		"Select View": "Seleccionar vista",
		View: "Vista",
		"+ {{n}} events": "+ {{n}} eventos",
		"+ 1 event": "+ 1 evento",
		"No events": "No hay eventos",
		"Next period": "Siguiente período",
		"Previous period": "Período anterior",
		to: "a",
		"Full day- and multiple day events": "Día completo y eventos de múltiples días",
		"Link to {{n}} more events on {{date}}": "Enlace a {{n}} eventos más el {{date}}",
		"Link to 1 more event on {{date}}": "Enlace a 1 evento más el {{date}}",
		CW: "Semana {{week}}"
	};
	const timePickerEsES = {
		Time: "Hora",
		AM: "AM",
		PM: "PM",
		Cancel: "Cancelar",
		OK: "Aceptar",
		"Select time": "Seleccionar hora"
	};
	const esES = {
		...datePickerEsES,
		...calendarEsES,
		...timePickerEsES
	};
	const calendarNlNL = {
		Today: "Vandaag",
		Month: "Maand",
		Week: "Week",
		Day: "Dag",
		List: "Lijst",
		"Select View": "Kies weergave",
		"+ {{n}} events": "+ {{n}} gebeurtenissen",
		"+ 1 event": "+ 1 gebeurtenis",
		"No events": "Geen gebeurtenissen",
		"Next period": "Volgende periode",
		"Previous period": "Vorige periode",
		to: "tot",
		"Full day- and multiple day events": "Evenementen van een hele dag en meerdere dagen",
		"Link to {{n}} more events on {{date}}": "Link naar {{n}} meer evenementen op {{date}}",
		"Link to 1 more event on {{date}}": "Link naar 1 meer evenement op {{date}}",
		CW: "Week {{week}}",
		View: "Weergave"
	};
	const datePickerNlNL = {
		Date: "Datum",
		"MM/DD/YYYY": "DD-MM-JJJJ",
		"Next month": "Volgende maand",
		"Previous month": "Vorige maand",
		"Choose Date": "Kies datum"
	};
	const timePickerNlNL = {
		Time: "Tijd",
		AM: "AM",
		PM: "PM",
		Cancel: "Annuleren",
		OK: "OK",
		"Select time": "Selecteer tijd"
	};
	const nlNL = {
		...datePickerNlNL,
		...calendarNlNL,
		...timePickerNlNL
	};
	const datePickerPtBR = {
		Date: "Data",
		"MM/DD/YYYY": "DD/MM/YYYY",
		"Next month": "Mês seguinte",
		"Previous month": "Mês anterior",
		"Choose Date": "Escolha uma data"
	};
	const calendarPtBR = {
		Today: "Hoje",
		Month: "Mês",
		Week: "Semana",
		Day: "Dia",
		List: "Lista",
		"Select View": "Selecione uma visualização",
		"+ {{n}} events": "+ {{n}} eventos",
		"+ 1 event": "+ 1 evento",
		"No events": "Sem eventos",
		"Next period": "Período seguinte",
		"Previous period": "Período anterior",
		to: "a",
		"Full day- and multiple day events": "Dia inteiro e eventos de vários dias",
		"Link to {{n}} more events on {{date}}": "Link para mais {{n}} eventos em {{date}}",
		"Link to 1 more event on {{date}}": "Link para mais 1 evento em {{date}}",
		CW: "Semana {{week}}",
		View: "Visualização"
	};
	const timePickerPtBR = {
		Time: "Hora",
		AM: "AM",
		PM: "PM",
		Cancel: "Cancelar",
		OK: "OK",
		"Select time": "Selecionar hora"
	};
	const ptBR = {
		...datePickerPtBR,
		...calendarPtBR,
		...timePickerPtBR
	};
	const datePickerSkSK = {
		Date: "Dátum",
		"MM/DD/YYYY": "DD/MM/YYYY",
		"Next month": "Ďalší mesiac",
		"Previous month": "Predchádzajúci mesiac",
		"Choose Date": "Vyberte dátum"
	};
	const calendarSkSK = {
		Today: "Dnes",
		Month: "Mesiac",
		Week: "Týždeň",
		Day: "Deň",
		List: "Zoznam",
		"Select View": "Vyberte zobrazenie",
		"+ {{n}} events": "+ {{n}} udalosti",
		"+ 1 event": "+ 1 udalosť",
		"No events": "Žiadne udalosti",
		"Next period": "Ďalšie obdobie",
		"Previous period": "Predchádzajúce obdobie",
		to: "do",
		"Full day- and multiple day events": "Celodenné a viacdňové udalosti",
		"Link to {{n}} more events on {{date}}": "Odkaz na {{n}} ďalších udalostí dňa {{date}}",
		"Link to 1 more event on {{date}}": "Odkaz na 1 ďalšiu udalosť dňa {{date}}",
		CW: "{{week}}. týždeň",
		View: "Zobrazenie"
	};
	const timePickerSkSK = {
		Time: "Čas",
		AM: "AM",
		PM: "PM",
		Cancel: "Zrušiť",
		OK: "OK",
		"Select time": "Vybrať čas"
	};
	const skSK = {
		...datePickerSkSK,
		...calendarSkSK,
		...timePickerSkSK
	};
	const datePickerMkMK = {
		Date: "Датум",
		"MM/DD/YYYY": "DD/MM/YYYY",
		"Next month": "Следен месец",
		"Previous month": "Претходен месец",
		"Choose Date": "Избери Датум"
	};
	const calendarMkMK = {
		Today: "Денес",
		Month: "Месец",
		Week: "Недела",
		Day: "Ден",
		List: "Листа",
		"Select View": "Избери Преглед",
		"+ {{n}} events": "+ {{n}} настани",
		"+ 1 event": "+ 1 настан",
		"No events": "Нема настани",
		"Next period": "Следен период",
		"Previous period": "Претходен период",
		to: "до",
		"Full day- and multiple day events": "Целодневни и повеќедневни настани",
		"Link to {{n}} more events on {{date}}": "Линк до {{n}} повеќе настани на {{date}}",
		"Link to 1 more event on {{date}}": "Линк до 1 повеќе настан на {{date}}",
		CW: "Недела {{week}}",
		View: "Преглед"
	};
	const timePickerMkMK = {
		Time: "Време",
		AM: "AM",
		PM: "PM",
		Cancel: "Откажи",
		OK: "У реду",
		"Select time": "Избери време"
	};
	const mkMK = {
		...datePickerMkMK,
		...calendarMkMK,
		...timePickerMkMK
	};
	const datePickerNbNO = {
		Date: "Dato",
		"MM/DD/YYYY": "DD.MM.YYYY",
		"Next month": "Neste måned",
		"Previous month": "Forrige måned",
		"Choose Date": "Velg dato"
	};
	const calendarNbNO = {
		Today: "I dag",
		Month: "Måned",
		Week: "Uke",
		Day: "Dag",
		List: "Liste",
		"Select View": "Velg visning",
		View: "Visning",
		"+ {{n}} events": "+ {{n}} hendelser",
		"+ 1 event": "+ 1 hendelse",
		"No events": "Ingen hendelser",
		"Next period": "Neste periode",
		"Previous period": "Forrige periode",
		to: "til",
		"Full day- and multiple day events": "Heldags- og flerdagshendelser",
		"Link to {{n}} more events on {{date}}": "Lenke til {{n}} flere hendelser på {{date}}",
		"Link to 1 more event on {{date}}": "Lenke til 1 hendelse til på {{date}}",
		CW: "Uke {{week}}"
	};
	const timePickerNbNO = {
		Time: "Tid",
		AM: "AM",
		PM: "PM",
		Cancel: "Avbryt",
		OK: "OK",
		"Select time": "Velg tid"
	};
	const nbNO = {
		...datePickerNbNO,
		...calendarNbNO,
		...timePickerNbNO
	};
	const datePickerTrTR = {
		Date: "Tarih",
		"MM/DD/YYYY": "GG/AA/YYYY",
		"Next month": "Sonraki ay",
		"Previous month": "Önceki ay",
		"Choose Date": "Tarih Seç"
	};
	const calendarTrTR = {
		Today: "Bugün",
		Month: "Aylık",
		Week: "Haftalık",
		Day: "Günlük",
		List: "Liste",
		"Select View": "Görünüm Seç",
		"+ {{n}} events": "+ {{n}} etkinlikler",
		"+ 1 event": "+ 1 etkinlik",
		"No events": "Etkinlik yok",
		"Next period": "Sonraki dönem",
		"Previous period": "Önceki dönem",
		to: "dan",
		"Full day- and multiple day events": "Tüm gün ve çoklu gün etkinlikleri",
		"Link to {{n}} more events on {{date}}": "{{date}} tarihinde {{n}} etkinliğe bağlantı",
		"Link to 1 more event on {{date}}": "{{date}} tarihinde 1 etkinliğe bağlantı",
		CW: "{{week}}. Hafta",
		View: "Görünüm"
	};
	const timePickerTrTR = {
		Time: "Zaman",
		AM: "ÖÖ",
		PM: "ÖS",
		Cancel: "İptal",
		OK: "Tamam",
		"Select time": "Zamanı seç"
	};
	const trTR = {
		...datePickerTrTR,
		...calendarTrTR,
		...timePickerTrTR
	};
	const datePickerKyKG = {
		Date: "Датасы",
		"MM/DD/YYYY": "АА/КК/ЖЖЖЖ",
		"Next month": "Кийинки ай",
		"Previous month": "Өткөн ай",
		"Choose Date": "Күндү тандаңыз"
	};
	const calendarKyKG = {
		Today: "Бүгүн",
		Month: "Ай",
		Week: "Апта",
		Day: "Күн",
		List: "Тизме",
		"Select View": "Көрүнүштү тандаңыз",
		"+ {{n}} events": "+ {{n}} Окуялар",
		"+ 1 event": "+ 1 Окуя",
		"No events": "Окуя жок",
		"Next period": "Кийинки мезгил",
		"Previous period": "Өткөн мезгил",
		to: "чейин",
		"Full day- and multiple day events": "Күн бою жана бир нече күн катары менен болгон окуялар",
		"Link to {{n}} more events on {{date}}": "{{date}} күнүндө {{n}} окуяга байланыш",
		"Link to 1 more event on {{date}}": "{{date}} күнүндө 1 окуяга байланыш",
		CW: "Апта {{week}}",
		View: "Көрүнүш"
	};
	const timePickerKyKG = {
		Time: "Убакты",
		AM: "AM",
		PM: "PM",
		Cancel: "Болбой",
		OK: "Ооба",
		"Select time": "Убакты тандаңыз"
	};
	const kyKG = {
		...datePickerKyKG,
		...calendarKyKG,
		...timePickerKyKG
	};
	const datePickerIdID = {
		Date: "Tanggal",
		"MM/DD/YYYY": "DD.MM.YYYY",
		"Next month": "Bulan depan",
		"Previous month": "Bulan sebelumnya",
		"Choose Date": "Pilih tanggal"
	};
	const calendarIdID = {
		Today: "Hari Ini",
		Month: "Bulan",
		Week: "Minggu",
		Day: "Hari",
		List: "Daftar",
		"Select View": "Pilih tampilan",
		"+ {{n}} events": "+ {{n}} Acara",
		"+ 1 event": "+ 1 Acara",
		"No events": "Tidak ada acara",
		"Next period": "Periode selanjutnya",
		"Previous period": "Periode sebelumnya",
		to: "sampai",
		"Full day- and multiple day events": "Sepanjang hari dan acara beberapa hari ",
		"Link to {{n}} more events on {{date}}": "Tautan ke {{n}} acara lainnya pada {{date}}",
		"Link to 1 more event on {{date}}": "Tautan ke 1 acara lainnya pada {{date}}",
		CW: "Minggu {{week}}",
		View: "Tampilan"
	};
	const timePickerIdID = {
		Time: "Waktu",
		AM: "AM",
		PM: "PM",
		Cancel: "Batalkan",
		OK: "OK",
		"Select time": "Pilih waktu"
	};
	const idID = {
		...datePickerIdID,
		...calendarIdID,
		...timePickerIdID
	};
	const datePickerCsCZ = {
		Date: "Datum",
		"MM/DD/YYYY": "DD/MM/YYYY",
		"Next month": "Další měsíc",
		"Previous month": "Předchozí měsíc",
		"Choose Date": "Vyberte datum"
	};
	const calendarCsCZ = {
		Today: "Dnes",
		Month: "Měsíc",
		Week: "Týden",
		Day: "Den",
		List: "Seznam",
		"Select View": "Vyberte zobrazení",
		"+ {{n}} events": "+ {{n}} události",
		"+ 1 event": "+ 1 událost",
		"No events": "Žádné události",
		"Next period": "Příští období",
		"Previous period": "Předchozí období",
		to: "do",
		"Full day- and multiple day events": "Celodenní a vícedenní události",
		"Link to {{n}} more events on {{date}}": "Odkaz na {{n}} dalších událostí dne {{date}}",
		"Link to 1 more event on {{date}}": "Odkaz na 1 další událost dne {{date}}",
		CW: "Týden {{week}}",
		View: "Zobrazení"
	};
	const timePickerCsCZ = {
		Time: "Čas",
		AM: "Dopoledne",
		PM: "Odpoledne",
		Cancel: "Zrušit",
		OK: "OK",
		"Select time": "Vyberte čas"
	};
	const csCZ = {
		...datePickerCsCZ,
		...calendarCsCZ,
		...timePickerCsCZ
	};
	const datePickerEtEE = {
		Date: "Kuupäev",
		"MM/DD/YYYY": "PP.KK.AAAA",
		"Next month": "Järgmine kuu",
		"Previous month": "Eelmine kuu",
		"Choose Date": "Vali kuupäev"
	};
	const calendarEtEE = {
		Today: "Täna",
		Month: "Kuu",
		Week: "Nädal",
		Day: "Päev",
		List: "Nimekiri",
		"Select View": "Vali vaade",
		"+ {{n}} events": "+ {{n}} sündmused",
		"+ 1 event": "+ 1 sündmus",
		"No events": "Pole sündmusi",
		"Next period": "Järgmine periood",
		"Previous period": "Eelmine periood",
		to: "kuni",
		"Full day- and multiple day events": "Täispäeva- ja mitmepäevasündmused",
		"Link to {{n}} more events on {{date}}": "Link {{n}} rohkematele sündmustele kuupäeval {{date}}",
		"Link to 1 more event on {{date}}": "Link ühele lisasündmusele kuupäeval {{date}}",
		CW: "Nädala number {{week}}",
		View: "Vaade"
	};
	const timePickerEtEE = {
		Time: "Aeg",
		AM: "AM",
		PM: "PM",
		Cancel: "Loobu",
		OK: "OK",
		"Select time": "Vali aeg"
	};
	const etEE = {
		...datePickerEtEE,
		...calendarEtEE,
		...timePickerEtEE
	};
	const datePickerUkUA = {
		Date: "Дата",
		"MM/DD/YYYY": "ММ/ДД/РРРР",
		"Next month": "Наступний місяць",
		"Previous month": "Минулий місяць",
		"Choose Date": "Виберіть дату"
	};
	const calendarUkUA = {
		Today: "Сьогодні",
		Month: "Місяць",
		Week: "Тиждень",
		Day: "День",
		List: "Список",
		"Select View": "Виберіть вигляд",
		"+ {{n}} events": "+ {{n}} події",
		"+ 1 event": "+ 1 подія",
		"No events": "Немає подій",
		"Next period": "Наступний період",
		"Previous period": "Минулий період",
		to: "по",
		"Full day- and multiple day events": "Події на цілий день і кілька днів поспіль",
		"Link to {{n}} more events on {{date}}": "Посилання на {{n}} додаткові події на {{date}}",
		"Link to 1 more event on {{date}}": "Посилання на 1 додаткову подію на {{date}}",
		CW: "Тиждень {{week}}",
		View: "Вигляд"
	};
	const timePickerUkUA = {
		Time: "Час",
		AM: "AM",
		PM: "PM",
		Cancel: "Скасувати",
		OK: "Гаразд",
		"Select time": "Виберіть час"
	};
	const ukUA = {
		...datePickerUkUA,
		...calendarUkUA,
		...timePickerUkUA
	};
	const datePickerSrLatnRS = {
		Date: "Datum",
		"MM/DD/YYYY": "DD/MM/YYYY",
		"Next month": "Sledeći mesec",
		"Previous month": "Prethodni mesec",
		"Choose Date": "Izaberite datum"
	};
	const calendarSrLatnRS = {
		Today: "Danas",
		Month: "Mesec",
		Week: "Nedelja",
		Day: "Dan",
		List: "Lista",
		"Select View": "Odaberite pregled",
		"+ {{n}} events": "+ {{n}} Događaji",
		"+ 1 event": "+ 1 Događaj",
		"No events": "Nema događaja",
		"Next period": "Naredni period",
		"Previous period": "Prethodni period",
		to: "do",
		"Full day- and multiple day events": "Celodnevni i višednevni događaji",
		"Link to {{n}} more events on {{date}}": "Link do još {{n}} događaja na {{date}}",
		"Link to 1 more event on {{date}}": "Link do jednog događaja na {{date}}",
		CW: "Nedelja {{week}}",
		View: "Pregled"
	};
	const timePickerSrLatnRS = {
		Time: "Vrijeme",
		AM: "AM",
		PM: "PM",
		Cancel: "Otkaži",
		OK: "U redu",
		"Select time": "Odaberi vrijeme"
	};
	const srLatnRS = {
		...datePickerSrLatnRS,
		...calendarSrLatnRS,
		...timePickerSrLatnRS
	};
	const datePickerCaES = {
		Date: "Data",
		"MM/DD/YYYY": "DD/MM/YYYY",
		"Next month": "Següent mes",
		"Previous month": "Mes anterior",
		"Choose Date": "Selecciona una data"
	};
	const calendarCaES = {
		Today: "Avui",
		Month: "Mes",
		Week: "Setmana",
		Day: "Dia",
		List: "Llista",
		"Select View": "Selecciona una vista",
		"+ {{n}} events": "+ {{n}} Esdeveniments",
		"+ 1 event": "+ 1 Esdeveniment",
		"No events": "Sense esdeveniments",
		"Next period": "Següent període",
		"Previous period": "Període anterior",
		to: "a",
		"Full day- and multiple day events": "Esdeveniments de dia complet i de múltiples dies",
		"Link to {{n}} more events on {{date}}": "Enllaç a {{n}} esdeveniments més el {{date}}",
		"Link to 1 more event on {{date}}": "Enllaç a 1 esdeveniment més el {{date}}",
		CW: "Setmana {{week}}",
		View: "Vista"
	};
	const timePickerCaES = {
		Time: "Hora",
		AM: "AM",
		PM: "PM",
		Cancel: "Cancel·lar",
		OK: "Acceptar",
		"Select time": "Selecciona una hora"
	};
	const caES = {
		...datePickerCaES,
		...calendarCaES,
		...timePickerCaES
	};
	const datePickerSrRS = {
		Date: "Датум",
		"MM/DD/YYYY": "DD/MM/YYYY",
		"Next month": "Следећи месец",
		"Previous month": "Претходни месец",
		"Choose Date": "Изаберите Датум"
	};
	const calendarSrRS = {
		Today: "Данас",
		Month: "Месец",
		Week: "Недеља",
		Day: "Дан",
		List: "Листа",
		"Select View": "Изаберите преглед",
		"+ {{n}} events": "+ {{n}} Догађаји",
		"+ 1 event": "+ 1 Догађај",
		"No events": "Нема догађаја",
		"Next period": "Следећи период",
		"Previous period": "Претходни период",
		to: "да",
		"Full day- and multiple day events": "Целодневни и вишедневни догађаји",
		"Link to {{n}} more events on {{date}}": "Линк до још {{n}} догађаја на {{date}}",
		"Link to 1 more event on {{date}}": "Линк до још 1 догађаја {{date}}",
		CW: "Недеља {{week}}",
		View: "Преглед"
	};
	const timePickerSrRS = {
		Time: "Време",
		AM: "AM",
		PM: "PM",
		Cancel: "Откажи",
		OK: "У реду",
		"Select time": "Изабери време"
	};
	const srRS = {
		...datePickerSrRS,
		...calendarSrRS,
		...timePickerSrRS
	};
	const datePickerLtLT = {
		Date: "Data",
		"MM/DD/YYYY": "MMMM-MM-DD",
		"Next month": "Kitas mėnuo",
		"Previous month": "Ankstesnis mėnuo",
		"Choose Date": "Pasirinkite datą"
	};
	const calendarLtLT = {
		Today: "Šiandien",
		Month: "Mėnuo",
		Week: "Savaitė",
		Day: "Diena",
		List: "Sąrašas",
		"Select View": "Pasirinkite vaizdą",
		"+ {{n}} events": "+ {{n}} įvykiai",
		"+ 1 event": "+ 1 įvykis",
		"No events": "Įvykių nėra",
		"Next period": "Kitas laikotarpis",
		"Previous period": "Ankstesnis laikotarpis",
		to: "iki",
		"Full day- and multiple day events": "Visos dienos ir kelių dienų įvykiai",
		"Link to {{n}} more events on {{date}}": "Nuoroda į dar {{n}} įvykius {{date}}",
		"Link to 1 more event on {{date}}": "Nuoroda į dar 1 vieną įvykį {{date}}",
		CW: "{{week}} savaitė",
		View: "Vaizdas"
	};
	const timePickerLtLT = {
		Time: "Laikas",
		AM: "AM",
		PM: "PM",
		Cancel: "Atšaukti",
		OK: "Gerai",
		"Select time": "Pasirinkite laiką"
	};
	const ltLT = {
		...datePickerLtLT,
		...calendarLtLT,
		...timePickerLtLT
	};
	const datePickerHrHR = {
		Date: "Datum",
		"MM/DD/YYYY": "DD/MM/YYYY",
		"Next month": "Sljedeći mjesec",
		"Previous month": "Prethodni mjesec",
		"Choose Date": "Izaberite datum"
	};
	const calendarHrHR = {
		Today: "Danas",
		Month: "Mjesec",
		Week: "Nedjelja",
		Day: "Dan",
		List: "Lista",
		"Select View": "Odaberite pregled",
		"+ {{n}} events": "+ {{n}} Događaji",
		"+ 1 event": "+ 1 Događaj",
		"No events": "Nema događaja",
		"Next period": "Sljedeći period",
		"Previous period": "Prethodni period",
		to: "do",
		"Full day- and multiple day events": "Cjelodnevni i višednevni događaji",
		"Link to {{n}} more events on {{date}}": "Link do još {{n}} događaja na {{date}}",
		"Link to 1 more event on {{date}}": "Link do još jednog događaja na {{date}}",
		CW: "{{week}}. tjedan",
		View: "Pregled"
	};
	const timePickerHrHR = {
		Time: "Vrijeme",
		AM: "AM",
		PM: "PM",
		Cancel: "Otkaži",
		OK: "U redu",
		"Select time": "Odaberi vrijeme"
	};
	const hrHR = {
		...datePickerHrHR,
		...calendarHrHR,
		...timePickerHrHR
	};
	const datePickerSlSI = {
		Date: "Datum",
		"MM/DD/YYYY": "MM.DD.YYYY",
		"Next month": "Naslednji mesec",
		"Previous month": "Prejšnji mesec",
		"Choose Date": "Izberi datum"
	};
	const calendarSlSI = {
		Today: "Danes",
		Month: "Mesec",
		Week: "Teden",
		Day: "Dan",
		List: "Seznam",
		"Select View": "Izberi pogled",
		"+ {{n}} events": "+ {{n}} dogodki",
		"+ 1 event": "+ 1 dogodek",
		"No events": "Ni dogodkov",
		"Next period": "Naslednji dogodek",
		"Previous period": "Prejšnji dogodek",
		to: "do",
		"Full day- and multiple day events": "Celodnevni in večdnevni dogodki",
		"Link to {{n}} more events on {{date}}": "Povezava do {{n}} drugih dogodkov dne {{date}}",
		"Link to 1 more event on {{date}}": "Povezava do še enega dogodka dne {{date}}",
		CW: "Teden {{week}}",
		View: "Pogled"
	};
	const timePickerSlSI = {
		Time: "Čas",
		AM: "AM",
		PM: "PM",
		Cancel: "Prekliči",
		OK: "V redu",
		"Select time": "Izberite čas"
	};
	const slSI = {
		...datePickerSlSI,
		...calendarSlSI,
		...timePickerSlSI
	};
	const datePickerFiFI = {
		Date: "Päivämäärä",
		"MM/DD/YYYY": "VVVV-KK-PP",
		"Next month": "Seuraava kuukausi",
		"Previous month": "Edellinen kuukausi",
		"Choose Date": "Valitse päivämäärä"
	};
	const calendarFiFI = {
		Today: "Tänään",
		Month: "Kuukausi",
		Week: "Viikko",
		Day: "Päivä",
		List: "Lista",
		"Select View": "Valitse näkymä",
		"+ {{n}} events": "+ {{n}} tapahtumaa",
		"+ 1 event": "+ 1 tapahtuma",
		"No events": "Ei tapahtumia",
		"Next period": "Seuraava ajanjakso",
		"Previous period": "Edellinen ajanjakso",
		to: "-",
		"Full day- and multiple day events": "Koko ja usean päivän tapahtumat",
		"Link to {{n}} more events on {{date}}": "Linkki {{n}} lisätapahtumaan päivämäärällä {{date}}",
		"Link to 1 more event on {{date}}": "Linkki 1 lisätapahtumaan päivämäärällä {{date}}",
		CW: "Viikko {{week}}",
		View: "Näkymä"
	};
	const timePickerFiFI = {
		Time: "Aika",
		AM: "ap.",
		PM: "ip.",
		Cancel: "Peruuta",
		OK: "OK",
		"Select time": "Valitse aika"
	};
	const fiFI = {
		...datePickerFiFI,
		...calendarFiFI,
		...timePickerFiFI
	};
	const datePickerRoRO = {
		Date: "Data",
		"MM/DD/YYYY": "LL/ZZ/AAAA",
		"Next month": "Luna următoare",
		"Previous month": "Luna anterioară",
		"Choose Date": "Alege data"
	};
	const calendarRoRO = {
		Today: "Astăzi",
		Month: "Lună",
		Week: "Săptămână",
		Day: "Zi",
		List: "Listă",
		"Select View": "Selectează vizualizarea",
		"+ {{n}} events": "+ {{n}} evenimente",
		"+ 1 event": "+ 1 eveniment",
		"No events": "Fără evenimente",
		"Next period": "Perioada următoare",
		"Previous period": "Perioada anterioară",
		to: "până la",
		"Full day- and multiple day events": "Evenimente pe durata întregii zile și pe durata mai multor zile",
		"Link to {{n}} more events on {{date}}": "Link către {{n}} evenimente suplimentare pe {{date}}",
		"Link to 1 more event on {{date}}": "Link către 1 eveniment suplimentar pe {{date}}",
		CW: "Săptămâna {{week}}",
		View: "Vizualizare"
	};
	const timePickerRoRO = {
		Time: "Timp",
		AM: "AM",
		PM: "PM",
		Cancel: "Anulează",
		OK: "OK",
		"Select time": "Selectați ora"
	};
	const roRO = {
		...datePickerRoRO,
		...calendarRoRO,
		...timePickerRoRO
	};
	const datePickerFaIR = {
		Date: "تاریخ",
		"MM/DD/YYYY": "MM/DD/YYYY",
		"Next month": "ماه بعد",
		"Previous month": "ماه قبل",
		"Choose Date": "انتخاب تاریخ"
	};
	const calendarFaIR = {
		Today: "امروز",
		Month: "ماه",
		Week: "هفته",
		Day: "روز",
		List: "لیست",
		"Select View": "انتخاب نما",
		"+ {{n}} events": "+ {{n}} رویدادها",
		"+ 1 event": "+ 1 رویداد",
		"No events": "رویدادی وجود ندارد",
		"Next period": "دوره بعدی",
		"Previous period": "دوره قبلی",
		to: "تا",
		"Full day- and multiple day events": "رویدادهای تمام روز و چند روزه",
		"Link to {{n}} more events on {{date}}": "لینک به {{n}} رویداد بیشتر در تاریخ {{date}}",
		"Link to 1 more event on {{date}}": "لینک به 1 رویداد بیشتر در تاریخ {{date}}",
		CW: "هفته {{week}}",
		View: "نمایش"
	};
	const timePickerFaIR = {
		Time: "زمان",
		AM: "ق.ظ",
		PM: "ب.ظ",
		Cancel: "لغو",
		OK: "تایید",
		"Select time": "انتخاب زمان"
	};
	const faIR = {
		...datePickerFaIR,
		...calendarFaIR,
		...timePickerFaIR
	};
	var InvalidLocaleError = class extends Error {
		constructor(locale) {
			super(`Invalid locale: ${locale}`);
		}
	};
	const translate = (locale, languages) => (key, translationVariables) => {
		if (!/^[a-z]{2}-[A-Z]{2}$/.test(locale.value) && "sr-Latn-RS" !== locale.value) throw new InvalidLocaleError(locale.value);
		const deHyphenatedLocale = locale.value.replaceAll("-", "");
		const language = languages.value[deHyphenatedLocale];
		if (!language) return key;
		let translation = language[key] || key;
		Object.keys(translationVariables || {}).forEach((variable) => {
			const value = String(translationVariables === null || translationVariables === void 0 ? void 0 : translationVariables[variable]);
			if (!value) return;
			translation = translation.replace(`{{${variable}}}`, value);
		});
		return translation;
	};
	const datePickerHeIL = {
		Date: "תַאֲרִיך",
		"MM/DD/YYYY": "MM/DD/YYYY",
		"Next month": "חודש הבא",
		"Previous month": "חודש קודם",
		"Choose Date": "בחר תאריך"
	};
	const calendarHeIL = {
		Today: "הַיוֹם",
		Month: "חוֹדֶשׁ",
		Week: "שָׁבוּעַ",
		Day: "יוֹם",
		List: "רשימה",
		"Select View": "בחר תצוגה",
		"+ {{n}} events": "+ {{n}} אירועים",
		"+ 1 event": "+ 1 אירוע",
		"No events": "אין אירועים",
		"Next period": "תקופה הבאה",
		"Previous period": "תקופה קודמת",
		to: "עד",
		"Full day- and multiple day events": "אירועים לכל היום ולמספר ימים",
		"Link to {{n}} more events on {{date}}": "קישור לעוד {{n}} אירועים ב-{{date}}",
		"Link to 1 more event on {{date}}": "קישור לאירוע נוסף ב-{{date}}",
		CW: "{{week}} שָׁבוּעַ",
		View: "תצוגה"
	};
	const timePickerHeIL = {
		Time: "שעה",
		AM: "לפנה\"צ",
		PM: "אחה\"צ",
		Cancel: "ביטול",
		OK: "אישור",
		"Select time": "בחר שעה"
	};
	const translations = {
		deDE,
		enUS,
		itIT,
		enGB,
		svSE,
		zhCN,
		zhTW,
		jaJP,
		ruRU,
		koKR,
		frFR,
		daDK,
		mkMK,
		nbNO,
		plPL,
		heIL: {
			...datePickerHeIL,
			...calendarHeIL,
			...timePickerHeIL
		},
		esES,
		nlNL,
		ptBR,
		skSK,
		trTR,
		kyKG,
		idID,
		csCZ,
		etEE,
		ukUA,
		caES,
		srLatnRS,
		srRS,
		ltLT,
		hrHR,
		slSI,
		fiFI,
		roRO,
		faIR,
		arEG
	};
	var EventColors = class {
		constructor(config) {
			Object.defineProperty(this, "config", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: config
			});
		}
		setLight() {
			Object.entries(this.config.calendars.value || {}).forEach(([calendarName, calendar]) => {
				if (!calendar.lightColors) {
					console.warn(`No light colors defined for calendar ${calendarName}`);
					return;
				}
				this.setColors(calendar.colorName, calendar.lightColors);
			});
		}
		setDark() {
			Object.entries(this.config.calendars.value || {}).forEach(([calendarName, calendar]) => {
				if (!calendar.darkColors) {
					console.warn(`No dark colors defined for calendar ${calendarName}`);
					return;
				}
				this.setColors(calendar.colorName, calendar.darkColors);
			});
		}
		setColors(colorName, colorDefinition) {
			document.documentElement.style.setProperty(`--sx-color-${colorName}`, colorDefinition.main);
			document.documentElement.style.setProperty(`--sx-color-${colorName}-container`, colorDefinition.container);
			document.documentElement.style.setProperty(`--sx-color-on-${colorName}-container`, colorDefinition.onContainer);
		}
	};
	const createCalendarState = (calendarConfig, timeUnitsImpl, selectedDate) => {
		var _a;
		const _view = y$1(((_a = calendarConfig.views.value.find((view) => view.name === calendarConfig.defaultView)) === null || _a === void 0 ? void 0 : _a.name) || calendarConfig.views.value[0].name);
		const view = g$1(() => {
			return _view.value;
		});
		const range = y$1(null);
		let wasInitialized = false;
		let lastRangeEmitted__NEEDED_TO_PREVENT_RECURSION_IN_EVENT_RECURRENCE_PACKAGE_WHICH_CAUSES_RANGE_TO_UPDATE_AND_THUS_CAUSES_A_CYCLE = null;
		const callOnRangeUpdate = (_range) => {
			const lastRange = lastRangeEmitted__NEEDED_TO_PREVENT_RECURSION_IN_EVENT_RECURRENCE_PACKAGE_WHICH_CAUSES_RANGE_TO_UPDATE_AND_THUS_CAUSES_A_CYCLE;
			if (!_range.value) return;
			if ((lastRange === null || lastRange === void 0 ? void 0 : lastRange.start.toString()) === _range.value.start.toString() && (lastRange === null || lastRange === void 0 ? void 0 : lastRange.end.toString()) === _range.value.end.toString()) return;
			if (!wasInitialized) return wasInitialized = true;
			if (calendarConfig.callbacks.onRangeUpdate && _range.value) calendarConfig.callbacks.onRangeUpdate(_range.value);
			Object.values(calendarConfig.plugins || {}).forEach((plugin) => {
				var _a;
				(_a = plugin === null || plugin === void 0 ? void 0 : plugin.onRangeUpdate) === null || _a === void 0 || _a.call(plugin, _range.value);
				lastRangeEmitted__NEEDED_TO_PREVENT_RECURSION_IN_EVENT_RECURRENCE_PACKAGE_WHICH_CAUSES_RANGE_TO_UPDATE_AND_THUS_CAUSES_A_CYCLE = _range.value;
			});
		};
		j(() => {
			if (range.value) callOnRangeUpdate(range);
		});
		const setRange = (date) => {
			var _a, _b;
			const newRange = calendarConfig.views.value.find((availableView) => availableView.name === _view.value).setDateRange({
				calendarConfig,
				date,
				range,
				timeUnitsImpl
			});
			if (newRange.start.toString() === ((_a = range.value) === null || _a === void 0 ? void 0 : _a.start.toString()) && newRange.end.toString() === ((_b = range.value) === null || _b === void 0 ? void 0 : _b.end.toString())) return;
			range.value = newRange;
		};
		setRange(selectedDate || Temporal.PlainDate.from(Temporal.Now.plainDateISO(calendarConfig.timezone.value)));
		const isCalendarSmall = y$1(void 0);
		const isDark = y$1(calendarConfig.isDark.value || false);
		j(() => {
			const eventColors = new EventColors(calendarConfig);
			if (isDark.value) eventColors.setDark();
			else eventColors.setLight();
		});
		return {
			view,
			isDark,
			setRange,
			range,
			isCalendarSmall,
			setView: (newView, selectedDate) => {
				n(() => {
					_view.value = newView;
					setRange(selectedDate);
				});
			}
		};
	};
	const createCalendarEventsImpl = (events, backgroundEvents, config) => {
		return {
			list: y$1(events.map((event) => {
				return externalEventToInternal(event, config);
			})),
			filterPredicate: y$1(void 0),
			backgroundEvents: y$1(backgroundEvents)
		};
	};
	const timePointsPerDay = (dayStart, dayEnd, isHybridDay) => {
		if (dayStart === dayEnd) return 2400;
		if (isHybridDay) return 2400 - dayStart + dayEnd;
		return dayEnd - dayStart;
	};
	const getDirection = () => {
		const html = document.querySelector("html");
		if (!html) return "ltr";
		if (html.getAttribute("dir") === "rtl") return "rtl";
		return "ltr";
	};
	var CalendarConfigImpl = class {
		constructor(locale = DEFAULT_LOCALE, firstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK, defaultView = InternalViewName.Week, views = [], dayBoundaries = DEFAULT_DAY_BOUNDARIES, weekOptions, calendars = {}, plugins = {}, isDark = false, isResponsive = true, callbacks = {}, _customComponentFns = {}, minDate = void 0, maxDate = void 0, monthGridOptions = { nEventsPerDay: 4 }, monthAgendaOptions = { nEventIndicatorsPerDay: 3 }, theme = void 0, translations = {}, showWeekNumbers = false, timezone = "UTC", resources = [], resourceGridOptions = { nDays: 7 }, skipAnimations = false) {
			Object.defineProperty(this, "defaultView", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: defaultView
			});
			Object.defineProperty(this, "plugins", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: plugins
			});
			Object.defineProperty(this, "isResponsive", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: isResponsive
			});
			Object.defineProperty(this, "callbacks", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: callbacks
			});
			Object.defineProperty(this, "_customComponentFns", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _customComponentFns
			});
			Object.defineProperty(this, "firstDayOfWeek", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "views", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "dayBoundaries", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "weekOptions", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "calendars", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "isDark", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "minDate", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "maxDate", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "monthGridOptions", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "monthAgendaOptions", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "locale", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: y$1(DEFAULT_LOCALE)
			});
			Object.defineProperty(this, "theme", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "translations", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "showWeekNumbers", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: y$1(false)
			});
			Object.defineProperty(this, "direction", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: "ltr"
			});
			Object.defineProperty(this, "timezone", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "skipAnimations", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "resources", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "resourceGridOptions", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "_destroyCustomComponentInstance", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			this.locale = y$1(locale);
			this.firstDayOfWeek = y$1(firstDayOfWeek);
			this.views = y$1(views);
			this.dayBoundaries = y$1(dayBoundaries);
			this.weekOptions = y$1(weekOptions);
			this.calendars = y$1(calendars);
			this.isDark = y$1(isDark);
			this.minDate = y$1(minDate);
			this.maxDate = y$1(maxDate);
			this.monthGridOptions = y$1(monthGridOptions);
			this.monthAgendaOptions = y$1(monthAgendaOptions);
			this.theme = theme;
			this.translations = y$1(translations);
			this.showWeekNumbers = y$1(showWeekNumbers);
			this.direction = getDirection();
			this.timezone = y$1(timezone);
			this.resources = y$1(resources);
			this.resourceGridOptions = y$1(resourceGridOptions);
			this.skipAnimations = skipAnimations;
		}
		get isHybridDay() {
			return this.dayBoundaries.value.start > this.dayBoundaries.value.end || this.dayBoundaries.value.start !== 0 && this.dayBoundaries.value.start === this.dayBoundaries.value.end;
		}
		get timePointsPerDay() {
			return timePointsPerDay(this.dayBoundaries.value.start, this.dayBoundaries.value.end, this.isHybridDay);
		}
	};
	var CalendarConfigBuilder = class {
		constructor() {
			Object.defineProperty(this, "locale", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "firstDayOfWeek", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "defaultView", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "views", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "dayBoundaries", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "weekOptions", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: {
					gridHeight: DEFAULT_WEEK_GRID_HEIGHT,
					nDays: 7,
					eventWidth: 100,
					timeAxisFormatOptions: { hour: "numeric" },
					eventOverlap: true,
					gridStep: 60
				}
			});
			Object.defineProperty(this, "monthGridOptions", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "monthAgendaOptions", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "calendars", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "plugins", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: {}
			});
			Object.defineProperty(this, "isDark", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: false
			});
			Object.defineProperty(this, "isResponsive", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: true
			});
			Object.defineProperty(this, "callbacks", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "minDate", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "maxDate", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "backgroundEvents", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "timezone", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "theme", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "translations", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "showWeekNumbers", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "resources", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: []
			});
			Object.defineProperty(this, "resourceGridOptions", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: { nDays: 7 }
			});
			Object.defineProperty(this, "skipAnimations", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: false
			});
		}
		build() {
			const minDate = this.minDate ? Temporal.PlainDate.from(this.minDate) : void 0;
			const maxDate = this.maxDate ? Temporal.PlainDate.from(this.maxDate) : void 0;
			return new CalendarConfigImpl(this.locale || DEFAULT_LOCALE, typeof this.firstDayOfWeek === "number" ? this.firstDayOfWeek : DEFAULT_FIRST_DAY_OF_WEEK, this.defaultView || InternalViewName.Week, this.views || [], this.dayBoundaries || DEFAULT_DAY_BOUNDARIES, this.weekOptions, this.calendars, this.plugins, this.isDark, this.isResponsive, this.callbacks, {}, minDate, maxDate, this.monthGridOptions, this.monthAgendaOptions, this.theme, this.translations, this.showWeekNumbers, this.timezone, this.resources, this.resourceGridOptions, this.skipAnimations);
		}
		withLocale(locale) {
			this.locale = locale;
			return this;
		}
		withTranslations(translation) {
			this.translations = translation;
			return this;
		}
		withFirstDayOfWeek(firstDayOfWeek) {
			this.firstDayOfWeek = firstDayOfWeek;
			return this;
		}
		withDefaultView(defaultView) {
			this.defaultView = defaultView;
			return this;
		}
		withViews(views) {
			this.views = views;
			return this;
		}
		withDayBoundaries(dayBoundaries) {
			if (!dayBoundaries) return this;
			this.dayBoundaries = {
				start: timePointsFromString(dayBoundaries.start),
				end: timePointsFromString(dayBoundaries.end)
			};
			return this;
		}
		withWeekOptions(userDefinedWeekOptions) {
			this.weekOptions = {
				...this.weekOptions,
				...userDefinedWeekOptions
			};
			if (this.weekOptions.gridStep !== 60 && (userDefinedWeekOptions === null || userDefinedWeekOptions === void 0 ? void 0 : userDefinedWeekOptions.timeAxisFormatOptions) === void 0) this.weekOptions.timeAxisFormatOptions = {
				hour: "numeric",
				minute: "numeric"
			};
			return this;
		}
		withCalendars(calendars) {
			this.calendars = calendars;
			return this;
		}
		withPlugins(plugins) {
			if (!plugins) return this;
			plugins.forEach((plugin) => {
				this.plugins[plugin.name] = plugin;
			});
			return this;
		}
		withIsDark(isDark) {
			this.isDark = isDark;
			return this;
		}
		withIsResponsive(isResponsive) {
			this.isResponsive = isResponsive;
			return this;
		}
		withCallbacks(listeners) {
			this.callbacks = listeners;
			return this;
		}
		withMinDate(minDate) {
			this.minDate = minDate;
			return this;
		}
		withMaxDate(maxDate) {
			this.maxDate = maxDate;
			return this;
		}
		withMonthGridOptions(monthOptions) {
			this.monthGridOptions = monthOptions;
			return this;
		}
		withMonthAgendaOptions(monthAgendaOptions) {
			this.monthAgendaOptions = monthAgendaOptions;
			return this;
		}
		withBackgroundEvents(backgroundEvents) {
			this.backgroundEvents = backgroundEvents;
			return this;
		}
		withTheme(theme) {
			this.theme = theme;
			return this;
		}
		withWeekNumbers(showWeekNumbers) {
			this.showWeekNumbers = showWeekNumbers;
			return this;
		}
		withTimezone(timezone) {
			this.timezone = timezone;
			return this;
		}
		withResources(resources) {
			if (resources) this.resources = resources;
			return this;
		}
		withResourceGridOptions(resourceGridOptions) {
			this.resourceGridOptions = {
				...this.resourceGridOptions,
				...resourceGridOptions
			};
			return this;
		}
		withSkipAnimations(skipAnimations) {
			this.skipAnimations = skipAnimations !== null && skipAnimations !== void 0 ? skipAnimations : false;
			return this;
		}
	};
	const createInternalConfig = (config, plugins) => {
		return new CalendarConfigBuilder().withLocale(config.locale).withFirstDayOfWeek(config.firstDayOfWeek).withDefaultView(config.defaultView).withViews(config.views).withDayBoundaries(config.dayBoundaries).withWeekOptions(config.weekOptions).withCalendars(config.calendars).withPlugins(plugins).withIsDark(config.isDark).withIsResponsive(config.isResponsive).withCallbacks(config.callbacks).withMinDate(config.minDate ? config.minDate.toString() : void 0).withMaxDate(config.maxDate ? config.maxDate.toString() : void 0).withMonthGridOptions(config.monthGridOptions).withMonthAgendaOptions(config.monthAgendaOptions).withBackgroundEvents(config.backgroundEvents).withTheme(config.theme).withTranslations(config.translations || translations).withWeekNumbers(config.showWeekNumbers).withTimezone(config.timezone).withResources(config.resources).withResourceGridOptions(config.resourceGridOptions).withSkipAnimations(config.skipAnimations).build();
	};
	var Month;
	(function(Month) {
		Month[Month["JANUARY"] = 1] = "JANUARY";
		Month[Month["FEBRUARY"] = 2] = "FEBRUARY";
		Month[Month["MARCH"] = 3] = "MARCH";
		Month[Month["APRIL"] = 4] = "APRIL";
		Month[Month["MAY"] = 5] = "MAY";
		Month[Month["JUNE"] = 6] = "JUNE";
		Month[Month["JULY"] = 7] = "JULY";
		Month[Month["AUGUST"] = 8] = "AUGUST";
		Month[Month["SEPTEMBER"] = 9] = "SEPTEMBER";
		Month[Month["OCTOBER"] = 10] = "OCTOBER";
		Month[Month["NOVEMBER"] = 11] = "NOVEMBER";
		Month[Month["DECEMBER"] = 12] = "DECEMBER";
	})(Month || (Month = {}));
	var NoYearZeroError = class extends Error {
		constructor() {
			super("Year zero does not exist in the Gregorian calendar.");
		}
	};
	var TimeUnitsImpl = class {
		constructor(config) {
			Object.defineProperty(this, "config", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: config
			});
		}
		get firstDayOfWeek() {
			return this.config.firstDayOfWeek.value;
		}
		set firstDayOfWeek(firstDayOfWeek) {
			this.config.firstDayOfWeek.value = firstDayOfWeek;
		}
		getMonth(year, month) {
			if (year === 0) throw new NoYearZeroError();
			const firstDateOfMonth = Temporal.PlainDate.from({
				year,
				month,
				day: 1
			});
			const lastDateOfMonth = firstDateOfMonth.toPlainYearMonth().toPlainDate({ day: firstDateOfMonth.toPlainYearMonth().daysInMonth });
			const dates = [];
			let currentDate = firstDateOfMonth;
			while (Temporal.PlainDate.compare(currentDate, lastDateOfMonth) <= 0) {
				dates.push(currentDate.toZonedDateTime(this.config.timezone.value));
				currentDate = currentDate.add({ days: 1 });
			}
			return dates;
		}
		getMonthWithTrailingAndLeadingDays(year, month) {
			if (year === 0) throw new NoYearZeroError();
			const firstDateOfMonth = Temporal.PlainDate.from({
				year,
				month,
				day: 1
			});
			const monthWithDates = [this.getWeekForTemporal(firstDateOfMonth)];
			let isInMonth = true;
			let currentWeekStart = monthWithDates[0][0];
			while (isInMonth) {
				const nextWeekStart = currentWeekStart.add({ days: 7 });
				const nextWeekDates = this.getWeekForTemporal(nextWeekStart);
				if (nextWeekDates.some((date) => date.month === month)) {
					monthWithDates.push(nextWeekDates);
					currentWeekStart = nextWeekStart;
				} else isInMonth = false;
			}
			return monthWithDates.map((week) => week.map((plainDate) => plainDate.toZonedDateTime(this.config.timezone.value)));
		}
		getWeekFor(date) {
			const plainDate = date instanceof Temporal.PlainDate ? date : date.toPlainDate();
			const week = [this.getFirstDateOfWeekTemporal(plainDate).toZonedDateTime(this.config.timezone.value)];
			while (week.length < 7) {
				const nextDateOfWeek = week[week.length - 1].add({ days: 1 });
				week.push(nextDateOfWeek);
			}
			return week;
		}
		getMonthsFor(year) {
			if (year === 0) throw new NoYearZeroError();
			return Object.values(Month).filter((month) => !isNaN(Number(month))).map((month) => Temporal.PlainDate.from({
				year,
				month: Number(month),
				day: 1
			}));
		}
		getWeekForTemporal(date) {
			const week = [this.getFirstDateOfWeekTemporal(date)];
			while (week.length < 7) {
				const nextDateOfWeek = week[week.length - 1].add({ days: 1 });
				week.push(nextDateOfWeek);
			}
			return week;
		}
		getFirstDateOfWeekTemporal(date) {
			const dateIsNthDayOfWeek = date.dayOfWeek - this.firstDayOfWeek;
			if (dateIsNthDayOfWeek === 0) return date;
			else if (dateIsNthDayOfWeek > 0) return date.subtract({ days: dateIsNthDayOfWeek });
			else return date.subtract({ days: 7 + dateIsNthDayOfWeek });
		}
	};
	var TimeUnitsBuilder = class {
		constructor() {
			Object.defineProperty(this, "config", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
		}
		build() {
			return new TimeUnitsImpl(this.config);
		}
		withConfig(config) {
			this.config = config;
			return this;
		}
	};
	const createTimeUnitsImpl = (internalConfig) => {
		return new TimeUnitsBuilder().withConfig(internalConfig).build();
	};
	var Placement;
	(function(Placement) {
		Placement["TOP_START"] = "top-start";
		Placement["TOP_END"] = "top-end";
		Placement["BOTTOM_START"] = "bottom-start";
		Placement["BOTTOM_END"] = "bottom-end";
	})(Placement || (Placement = {}));
	var ConfigImpl = class {
		constructor(locale = DEFAULT_LOCALE, firstDayOfWeek = DEFAULT_FIRST_DAY_OF_WEEK, timezone = "UTC", min = Temporal.PlainDate.from({
			year: 1970,
			month: 1,
			day: 1
		}), max = Temporal.PlainDate.from({
			year: (/* @__PURE__ */ new Date()).getFullYear() + 50,
			month: 11,
			day: 31
		}), placement = Placement.BOTTOM_START, listeners = {}, style = {}, teleportTo, label, name, disabled, hasPlaceholder) {
			Object.defineProperty(this, "min", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: min
			});
			Object.defineProperty(this, "max", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: max
			});
			Object.defineProperty(this, "placement", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: placement
			});
			Object.defineProperty(this, "listeners", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: listeners
			});
			Object.defineProperty(this, "style", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: style
			});
			Object.defineProperty(this, "teleportTo", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: teleportTo
			});
			Object.defineProperty(this, "label", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: label
			});
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: name
			});
			Object.defineProperty(this, "disabled", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: disabled
			});
			Object.defineProperty(this, "hasPlaceholder", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: hasPlaceholder
			});
			Object.defineProperty(this, "locale", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "firstDayOfWeek", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "timezone", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			this.locale = y$1(locale);
			this.firstDayOfWeek = y$1(firstDayOfWeek);
			this.timezone = y$1(timezone);
		}
	};
	var ConfigBuilder = class {
		constructor() {
			Object.defineProperty(this, "locale", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "firstDayOfWeek", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "timezone", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "min", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "max", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "placement", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "listeners", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "style", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "teleportTo", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "label", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "disabled", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "hasPlaceholder", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
		}
		build() {
			return new ConfigImpl(this.locale, this.firstDayOfWeek, this.timezone, this.min, this.max, this.placement, this.listeners, this.style, this.teleportTo, this.label, this.name, this.disabled, this.hasPlaceholder);
		}
		withLocale(locale) {
			this.locale = locale;
			return this;
		}
		withFirstDayOfWeek(firstDayOfWeek) {
			this.firstDayOfWeek = firstDayOfWeek;
			return this;
		}
		withTimezone(timezone) {
			this.timezone = timezone;
			return this;
		}
		withMin(min) {
			this.min = min;
			return this;
		}
		withMax(max) {
			this.max = max;
			return this;
		}
		withPlacement(placement) {
			this.placement = placement;
			return this;
		}
		withListeners(listeners) {
			this.listeners = listeners;
			return this;
		}
		withStyle(style) {
			this.style = style;
			return this;
		}
		withTeleportTo(teleportTo) {
			this.teleportTo = teleportTo;
			return this;
		}
		withLabel(label) {
			this.label = label;
			return this;
		}
		withName(name) {
			this.name = name;
			return this;
		}
		withDisabled(disabled) {
			this.disabled = disabled;
			return this;
		}
		withHasPlaceholder(hasPlaceholder) {
			this.hasPlaceholder = hasPlaceholder;
			return this;
		}
	};
	const createDatePickerConfig = (config, dateSelectionCallback) => {
		var _a, _b;
		let teleportTo;
		if ((_a = config.datePicker) === null || _a === void 0 ? void 0 : _a.teleportTo) teleportTo = config.datePicker.teleportTo;
		const dynamicPlacement = (datePickerWrapper) => {
			if (datePickerWrapper) {
				const rect = datePickerWrapper.getBoundingClientRect();
				const viewportCenterX = window.innerWidth / 2;
				return rect.x + rect.width / 2 <= viewportCenterX ? Placement.BOTTOM_START : Placement.BOTTOM_END;
			}
			return Placement.BOTTOM_END;
		};
		return new ConfigBuilder().withLocale(config.locale).withFirstDayOfWeek(config.firstDayOfWeek).withTimezone(config.timezone).withMin(config.minDate).withMax(config.maxDate).withTeleportTo(teleportTo).withStyle((_b = config.datePicker) === null || _b === void 0 ? void 0 : _b.style).withPlacement(dynamicPlacement).withListeners({ onChange: dateSelectionCallback }).build();
	};
	const createDateSelectionCallback = (calendarState, config) => {
		let lastEmittedDate = null;
		return (date) => {
			var _a;
			calendarState.setRange(date);
			if (((_a = config.callbacks) === null || _a === void 0 ? void 0 : _a.onSelectedDateUpdate) && date.toString() !== (lastEmittedDate === null || lastEmittedDate === void 0 ? void 0 : lastEmittedDate.toString())) {
				lastEmittedDate = date;
				config.callbacks.onSelectedDateUpdate(date);
			}
		};
	};
	/**
	* TODO v3: remove this when removing plugin over the config object
	* */
	const validatePlugins = (configPlugins, pluginArg) => {
		if (configPlugins && pluginArg) throw new Error("You cannot provide plugins over the config object and as an argument to createCalendar.");
	};
	const validateConfig = (config) => {
		var _a, _b, _c, _d;
		if (config.selectedDate && !(config.selectedDate instanceof Temporal.PlainDate)) throw new Error("[Schedule-X error]: selectedDate must be a temporal plain date");
		if (config.minDate && !(config.minDate instanceof Temporal.PlainDate)) throw new Error("[Schedule-X error]: minDate must be a temporal plain date");
		if (config.maxDate && !(config.maxDate instanceof Temporal.PlainDate)) throw new Error("[Schedule-X error]: maxDate must be a temporal plain date");
		if (typeof config.firstDayOfWeek !== "undefined" && (config.firstDayOfWeek < 1 || config.firstDayOfWeek > 7)) throw new Error("[Schedule-X error]: firstDayOfWeek must be a number between 1 and 7");
		if (typeof ((_a = config.weekOptions) === null || _a === void 0 ? void 0 : _a.gridHeight) !== "undefined" && config.weekOptions.gridHeight < 0) throw new Error("[Schedule-X error]: weekOptions.gridHeight must be a positive number");
		if (typeof ((_b = config.weekOptions) === null || _b === void 0 ? void 0 : _b.nDays) !== "undefined" && (config.weekOptions.nDays < 1 || config.weekOptions.nDays > 7)) throw new Error("[Schedule-X error]: weekOptions.nDays must be a number between 1 and 7");
		if (typeof ((_c = config.weekOptions) === null || _c === void 0 ? void 0 : _c.eventWidth) !== "undefined" && (config.weekOptions.eventWidth < 1 || config.weekOptions.eventWidth > 100)) throw new Error("[Schedule-X error]: weekOptions.eventWidth must be an integer between 1 and 100");
		if (typeof ((_d = config.monthGridOptions) === null || _d === void 0 ? void 0 : _d.nEventsPerDay) !== "undefined" && config.monthGridOptions.nEventsPerDay < 0) throw new Error("[Schedule-X error]: monthGridOptions.nEventsPerDay must be a positive number");
		const dayBoundaryPattern = /^\d{2}:00$/;
		if (typeof config.dayBoundaries !== "undefined") {
			const startFormatIsInvalid = !dayBoundaryPattern.test(config.dayBoundaries.start);
			const endFormatIsInvalid = !dayBoundaryPattern.test(config.dayBoundaries.end);
			if (startFormatIsInvalid || endFormatIsInvalid) throw new Error("[Schedule-X error]: dayBoundaries must be an object with \"start\"- and \"end\" properties, each as a whole hour in the format HH:00 (e.g. 08:00, 19:00)");
		}
	};
	const validateEvents = (events = []) => {
		events === null || events === void 0 || events.forEach((event) => {
			if (!(event.start instanceof Temporal.ZonedDateTime) && !(event.start instanceof Temporal.PlainDate)) throw new Error(`[Schedule-X error]: Event start time needs to be a Temporal.ZonedDateTime or Temporal.PlainDate.`);
			if (!(event.end instanceof Temporal.ZonedDateTime) && !(event.end instanceof Temporal.PlainDate)) throw new Error(`[Schedule-X error]: Event end time needs to be a Temporal.ZonedDateTime or Temporal.PlainDate.`);
			if (typeof event.id === "number" && event.id % 1 !== 0) throw new Error(`[Schedule-X error]: Event id ${event.id} is not a valid id. Only non-unicode characters that can be used by document.querySelector is allowed, see: https://developer.mozilla.org/en-US/docs/Web/CSS/ident. We recommend using uuids or integers.`);
			if (typeof event.id === "string" && !/^[a-zA-Z0-9_-]*$/.test(event.id)) throw new Error(`[Schedule-X error]: Event id ${event.id} is not a valid id. Only non-unicode characters that can be used by document.querySelector is allowed, see: https://developer.mozilla.org/en-US/docs/Web/CSS/ident. We recommend using uuids or integers.`);
			if (typeof event.id !== "string" && typeof event.id !== "number") throw new Error(`[Schedule-X error]: Event id ${event.id} is not a valid id. Only non-unicode characters that can be used by document.querySelector is allowed, see: https://developer.mozilla.org/en-US/docs/Web/CSS/ident. We recommend using uuids or integers.`);
		});
	};
	const createCalendarAppSingleton = (config, plugins) => {
		var _a;
		const internalConfig = createInternalConfig(config, plugins);
		const timeUnitsImpl = createTimeUnitsImpl(internalConfig);
		const calendarState = createCalendarState(internalConfig, timeUnitsImpl, config.selectedDate);
		const dateSelectionCallback = createDateSelectionCallback(calendarState, config);
		const datePickerConfig = createDatePickerConfig(config, (date) => dateSelectionCallback(date));
		const datePickerState = createDatePickerState(datePickerConfig, config.selectedDate || ((_a = config.datePicker) === null || _a === void 0 ? void 0 : _a.selectedDate));
		const calendarEvents = createCalendarEventsImpl(config.events || [], config.backgroundEvents || [], internalConfig);
		return new CalendarAppSingletonBuilder().withConfig(internalConfig).withTimeUnitsImpl(timeUnitsImpl).withDatePickerState(datePickerState).withCalendarEvents(calendarEvents).withDatePickerConfig(datePickerConfig).withCalendarState(calendarState).withTranslate(translate(internalConfig.locale, internalConfig.translations)).build();
	};
	const createCalendar = (config, plugins) => {
		validatePlugins(config.plugins, plugins);
		if (config.skipValidation !== true) {
			validateEvents(config.events);
			validateConfig(config);
		}
		return new CalendarApp(createCalendarAppSingleton(config, plugins || config.plugins || []));
	};
	const createWeekForMonth = (week, day) => {
		week.push({
			date: Temporal.ZonedDateTime.from(day.toString()).toPlainDate(),
			events: {},
			backgroundEvents: []
		});
		return week;
	};
	const createMonth = (date, timeUnitsImpl) => {
		const monthWithDates = timeUnitsImpl.getMonthWithTrailingAndLeadingDays(date.year, date.month);
		const month = [];
		for (const week of monthWithDates) month.push(week.reduce(createWeekForMonth, []));
		return month;
	};
	function MonthGridEvent({ gridRow, calendarEvent, date, isFirstWeek, isLastWeek }) {
		var _a, _b, _c, _d, _e;
		const $app = x$2(AppContext);
		const hasOverflowLeft = isFirstWeek && ((_a = $app.calendarState.range.value) === null || _a === void 0 ? void 0 : _a.start) && calendarEvent.start.toString() < $app.calendarState.range.value.start.toString();
		const hasOverflowRight = isLastWeek && ((_b = $app.calendarState.range.value) === null || _b === void 0 ? void 0 : _b.end) && calendarEvent.end.toString() > $app.calendarState.range.value.end.toString();
		const { createDragStartTimeout, setClickedEventIfNotDragging, setClickedEvent } = useEventInteractions($app);
		const plainDate = Temporal.PlainDate.from(date).toString();
		const hasStartDate = dateFromDateTime(calendarEvent.start.toString()) === plainDate;
		const nDays = calendarEvent._eventFragments[date];
		const eventCSSVariables = {
			borderInlineStart: hasStartDate ? `4px solid var(--sx-color-${calendarEvent._color})` : void 0,
			color: `var(--sx-color-on-${calendarEvent._color}-container)`,
			backgroundColor: `var(--sx-color-${calendarEvent._color}-container)`,
			width: `calc(${nDays * 100 + "%"} + ${nDays}px - 10px)`
		};
		const handleStartDrag = (uiEvent) => {
			var _a;
			if (isUIEventTouchEvent(uiEvent)) uiEvent.preventDefault();
			if (!uiEvent.target) return;
			if (!$app.config.plugins.dragAndDrop || ((_a = calendarEvent._options) === null || _a === void 0 ? void 0 : _a.disableDND)) return;
			$app.config.plugins.dragAndDrop.startMonthGridDrag(calendarEvent, $app);
		};
		const customComponent = $app.config._customComponentFns.monthGridEvent;
		const customComponentId = A$2(customComponent ? "custom-month-grid-event-" + randomStringId() : void 0);
		h$2(() => {
			if (!customComponent) return;
			customComponent(getElementByCCID(customComponentId.current), {
				calendarEvent: calendarEvent._getExternalEvent(),
				hasStartDate
			});
			return () => {
				var _a, _b;
				(_b = (_a = $app.config)._destroyCustomComponentInstance) === null || _b === void 0 || _b.call(_a, customComponentId.current);
			};
		}, [calendarEvent]);
		const handleOnClick = (e) => {
			e.stopPropagation();
			invokeOnEventClickCallback($app, calendarEvent, e);
		};
		const handleOnDoubleClick = (e) => {
			e.stopPropagation();
			invokeOnEventDoubleClickCallback($app, calendarEvent, e);
		};
		const handleKeyDown = (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.stopPropagation();
				setClickedEvent(e, calendarEvent);
				invokeOnEventClickCallback($app, calendarEvent, e);
				nextTick(() => {
					focusModal($app);
				});
			}
		};
		const classNames = [
			"sx__event",
			"sx__month-grid-event",
			"sx__month-grid-cell"
		];
		if ((_c = calendarEvent._options) === null || _c === void 0 ? void 0 : _c.additionalClasses) classNames.push(...calendarEvent._options.additionalClasses);
		if (wasEventAddedInLastSecond(calendarEvent)) classNames.push("is-event-new");
		if (hasOverflowLeft) classNames.push("sx__month-grid-event--overflow-left");
		if (hasOverflowRight) classNames.push("sx__month-grid-event--overflow-right");
		const hasCustomContent = (_d = calendarEvent._customContent) === null || _d === void 0 ? void 0 : _d.monthGrid;
		return u$2("div", {
			draggable: !!$app.config.plugins.dragAndDrop,
			"data-event-id": calendarEvent.id,
			"data-ccid": customComponentId.current,
			onMouseDown: (e) => createDragStartTimeout(handleStartDrag, e),
			onMouseUp: (e) => setClickedEventIfNotDragging(calendarEvent, e),
			onTouchStart: (e) => createDragStartTimeout(handleStartDrag, e),
			onTouchEnd: (e) => setClickedEventIfNotDragging(calendarEvent, e),
			onClick: handleOnClick,
			onDblClick: handleOnDoubleClick,
			onKeyDown: handleKeyDown,
			className: classNames.join(" "),
			style: {
				gridRow,
				width: eventCSSVariables.width,
				padding: customComponent ? "0px" : void 0,
				borderInlineStart: customComponent ? void 0 : eventCSSVariables.borderInlineStart,
				color: customComponent ? void 0 : eventCSSVariables.color,
				backgroundColor: customComponent ? void 0 : eventCSSVariables.backgroundColor
			},
			tabIndex: 0,
			role: "button",
			children: [!customComponent && !hasCustomContent && u$2(S$1, { children: [calendarEvent.start instanceof Temporal.ZonedDateTime && u$2("div", {
				className: "sx__month-grid-event-time",
				children: timeFn(calendarEvent.start, $app.config.locale.value)
			}), u$2("div", {
				className: "sx__month-grid-event-title",
				children: calendarEvent.title
			})] }), hasCustomContent && u$2("div", { dangerouslySetInnerHTML: { __html: ((_e = calendarEvent._customContent) === null || _e === void 0 ? void 0 : _e.monthGrid) || "" } })]
		});
	}
	function MonthGridDay({ day, isFirstWeek, isLastWeek }) {
		const $app = x$2(AppContext);
		const nEventsInDay = Object.values(day.events).filter((event) => typeof event === "object" || event === DATE_GRID_BLOCKER).length;
		const getEventTranslationSingularOrPlural = (nOfAdditionalEvents) => {
			if (nOfAdditionalEvents === 1) return $app.translate("+ 1 event");
			return $app.translate("+ {{n}} events", { n: nOfAdditionalEvents });
		};
		const getAriaLabelSingularOrPlural = (nOfAdditionalEvents) => {
			if (nOfAdditionalEvents === 1) return $app.translate("Link to 1 more event on {{date}}", { date: getLocalizedDate$1(day.date, $app.config.locale.value) });
			return $app.translate("Link to {{n}} more events on {{date}}", {
				date: getLocalizedDate$1(day.date, $app.config.locale.value),
				n: nEventsInDay - $app.config.monthGridOptions.value.nEventsPerDay
			});
		};
		const handleClickAdditionalEvents = (e) => {
			e.stopPropagation();
			if ($app.config.callbacks.onClickPlusEvents) {
				$app.config.callbacks.onClickPlusEvents(day.date, e);
				return;
			}
			if (!$app.config.views.value.find((view) => view.name === InternalViewName.Day)) return;
			setTimeout(() => {
				$app.datePickerState.selectedDate.value = day.date;
				$app.calendarState.setView(InternalViewName.Day, day.date);
			}, 250);
		};
		const dateClassNames = ["sx__month-grid-day__header-date"];
		const dayDate = day.date;
		if (isToday(dayDate.toZonedDateTime($app.config.timezone.value), $app.config.timezone.value)) dateClassNames.push("sx__is-today");
		const selectedDateMonth = $app.datePickerState.selectedDate.value.month;
		const dayMonth = day.date.month;
		const baseClasses = ["sx__month-grid-day", getClassNameForWeekday(dayDate.dayOfWeek)];
		const [wrapperClasses, setWrapperClasses] = d$2(baseClasses);
		h$2(() => {
			const classes = [...baseClasses];
			if (dayMonth !== selectedDateMonth) classes.push("is-leading-or-trailing");
			if (isSameDay($app.datePickerState.selectedDate.value, day.date)) classes.push("is-selected");
			setWrapperClasses(classes);
		}, [$app.datePickerState.selectedDate.value]);
		const getNumberOfNonDisplayedEvents = () => {
			return Object.values(day.events).slice($app.config.monthGridOptions.value.nEventsPerDay).filter((event) => event === DATE_GRID_BLOCKER || typeof event === "object").length;
		};
		const numberOfNonDisplayedEvents = getNumberOfNonDisplayedEvents();
		const dayStartDateTime = Temporal.ZonedDateTime.from({
			year: day.date.year,
			month: day.date.month,
			day: day.date.day,
			hour: 0,
			minute: 0,
			second: 0,
			timeZone: $app.config.timezone.value
		});
		const dayEndDateTime = Temporal.ZonedDateTime.from({
			year: day.date.year,
			month: day.date.month,
			day: day.date.day,
			hour: 23,
			minute: 59,
			second: 59,
			timeZone: $app.config.timezone.value
		});
		const fullDayBackgroundEvent = day.backgroundEvents.find((event) => {
			const eventStartWithTime = event.start instanceof Temporal.PlainDate ? event.start.toZonedDateTime($app.config.timezone.value) : event.start;
			const eventEndWithTime = event.end instanceof Temporal.PlainDate ? event.end.toZonedDateTime($app.config.timezone.value).with({
				hour: 23,
				minute: 59,
				second: 59
			}) : event.end;
			return eventStartWithTime.toString() <= dayStartDateTime.toString() && eventEndWithTime.toString() >= dayEndDateTime.toString();
		});
		const handleMouseDown = (e) => {
			if (!e.target.classList.contains("sx__month-grid-day")) return;
			const callback = $app.config.callbacks.onMouseDownMonthGridDate;
			if (callback) callback(day.date, e);
		};
		const monthGridDayNameCustomComponent = $app.config._customComponentFns.monthGridDayName;
		const monthGridDayNameCCID = d$2(monthGridDayNameCustomComponent ? randomStringId() : "")[0];
		h$2(() => {
			if (!monthGridDayNameCustomComponent) return;
			const dayNameEl = document.querySelector(`[data-ccid="${monthGridDayNameCCID}"]`);
			if (!(dayNameEl instanceof HTMLElement)) return;
			monthGridDayNameCustomComponent(dayNameEl, { day: toJSDate(day.date.toString()).getDay() });
		}, [day]);
		const monthGridDateCustomComponent = $app.config._customComponentFns.monthGridDate;
		const monthGridDateCCID = d$2(monthGridDateCustomComponent ? randomStringId() : "")[0];
		h$2(() => {
			if (!monthGridDateCustomComponent) return;
			const dateEl = document.querySelector(`[data-ccid="${monthGridDateCCID}"]`);
			if (!(dateEl instanceof HTMLElement)) return;
			monthGridDateCustomComponent(dateEl, {
				date: toJSDate(day.date.toString()).getDate(),
				jsDate: toJSDate(day.date.toString())
			});
		}, [day]);
		return u$2("div", {
			className: wrapperClasses.join(" "),
			"data-date": toDateString$1(day.date),
			onClick: (e) => $app.config.callbacks.onClickDate && $app.config.callbacks.onClickDate(day.date, e),
			"aria-label": getLocalizedDate$1(day.date, $app.config.locale.value),
			onDblClick: (e) => {
				var _a, _b;
				return (_b = (_a = $app.config.callbacks).onDoubleClickDate) === null || _b === void 0 ? void 0 : _b.call(_a, day.date, e);
			},
			onMouseDown: handleMouseDown,
			children: [
				fullDayBackgroundEvent && u$2(S$1, { children: u$2("div", {
					className: "sx__month-grid-background-event",
					title: fullDayBackgroundEvent.title,
					style: { ...fullDayBackgroundEvent.style }
				}) }),
				u$2("div", {
					className: "sx__month-grid-day__header",
					children: [isFirstWeek ? u$2(S$1, { children: monthGridDayNameCustomComponent ? u$2("div", { "data-ccid": monthGridDayNameCCID }) : u$2("div", {
						className: "sx__month-grid-day__header-day-name",
						children: getDayNameShort(dayDate, $app.config.locale.value)
					}) }) : null, monthGridDateCCID ? u$2("div", { "data-ccid": monthGridDateCCID }) : u$2("div", {
						className: dateClassNames.join(" "),
						children: dayDate.day
					})]
				}),
				u$2("div", {
					className: "sx__month-grid-day__events",
					children: Object.values(day.events).slice(0, $app.config.monthGridOptions.value.nEventsPerDay).map((event, index) => {
						if (typeof event !== "object") return u$2("div", {
							className: "sx__month-grid-blocker sx__month-grid-cell",
							style: { gridRow: index + 1 }
						});
						return u$2(MonthGridEvent, {
							gridRow: index + 1,
							calendarEvent: event,
							date: day.date.toString(),
							isFirstWeek,
							isLastWeek
						});
					})
				}),
				numberOfNonDisplayedEvents > 0 ? u$2("button", {
					type: "button",
					className: "sx__button sx__month-grid-day__events-more sx__ripple--wide",
					"aria-label": getAriaLabelSingularOrPlural(numberOfNonDisplayedEvents),
					onClick: handleClickAdditionalEvents,
					children: getEventTranslationSingularOrPlural(numberOfNonDisplayedEvents)
				}) : null
			]
		});
	}
	function MonthGridWeek({ week, isFirstWeek, isLastWeek }) {
		const $app = x$2(AppContext);
		return u$2("div", {
			className: "sx__month-grid-week",
			children: [$app.config.showWeekNumbers.value && u$2("div", {
				className: "sx__month-grid-week__week-number",
				children: getWeekNumber(week[0].date, $app.config.firstDayOfWeek.value)
			}), week.map((day) => {
				/**
				* The day component keeps internal state, and needs to be thrown away once the day changes.
				* */
				return u$2(MonthGridDay, {
					day,
					isFirstWeek,
					isLastWeek
				}, toDateString$1(day.date));
			})]
		});
	}
	const positionInMonthWeek = (sortedEvents, week) => {
		const weekDates = Object.keys(week).sort();
		const firstDateOfWeek = weekDates[0];
		const lastDateOfWeek = weekDates[weekDates.length - 1];
		const occupiedLevels = /* @__PURE__ */ new Set();
		for (const event of sortedEvents) {
			const eventOriginalStartDate = dateFromDateTime(event.start.toString());
			const eventOriginalEndDate = dateFromDateTime(event.end.toString());
			const isEventStartInWeek = !!week[eventOriginalStartDate];
			let isEventInWeek = isEventStartInWeek;
			if (!isEventStartInWeek && eventOriginalStartDate < firstDateOfWeek && eventOriginalEndDate >= firstDateOfWeek) isEventInWeek = true;
			if (!isEventInWeek) continue;
			const firstDateOfEvent = isEventStartInWeek ? eventOriginalStartDate : firstDateOfWeek;
			const lastDateOfEvent = eventOriginalEndDate <= lastDateOfWeek ? eventOriginalEndDate : lastDateOfWeek;
			const eventDays = Object.values(week).filter((day) => {
				const plainDate = Temporal.PlainDate.from(day.date).toString();
				return plainDate >= firstDateOfEvent && plainDate <= lastDateOfEvent;
			});
			let levelInWeekForEvent;
			let testLevel = 0;
			while (levelInWeekForEvent === void 0) if (eventDays.every((day) => {
				return !day.events[testLevel];
			})) {
				levelInWeekForEvent = testLevel;
				occupiedLevels.add(testLevel);
			} else testLevel++;
			for (const [eventDayIndex, eventDay] of eventDays.entries()) if (eventDayIndex === 0) {
				event._eventFragments[firstDateOfEvent] = eventDays.length;
				eventDay.events[levelInWeekForEvent] = event;
			} else eventDay.events[levelInWeekForEvent] = DATE_GRID_BLOCKER;
		}
		for (const level of Array.from(occupiedLevels)) for (const [, day] of Object.entries(week)) if (!day.events[level]) day.events[level] = void 0;
		return week;
	};
	const positionInMonth = (month, sortedEvents) => {
		const weeks = [];
		month.forEach((week) => {
			const weekMap = {};
			week.forEach((day) => {
				const plainDate = Temporal.PlainDate.from(day.date);
				weekMap[plainDate.toString()] = day;
			});
			weeks.push(weekMap);
		});
		weeks.forEach((week) => positionInMonthWeek(sortedEvents, week));
		return month;
	};
	const MonthGridWrapper = ({ $app, id }) => {
		const [month, setMonth] = d$2([]);
		useSignalEffect(() => {
			$app.calendarEvents.list.value.forEach((event) => {
				event._eventFragments = {};
			});
			const newMonth = createMonth(Temporal.PlainDate.from($app.datePickerState.selectedDate.value), $app.timeUnitsImpl);
			newMonth.forEach((week) => {
				week.forEach((day) => {
					const plainDate = Temporal.PlainDate.from(day.date);
					const rangeStartDateTime = Temporal.ZonedDateTime.from({
						year: plainDate.year,
						month: plainDate.month,
						day: plainDate.day,
						hour: 0,
						minute: 0,
						second: 0,
						timeZone: $app.config.timezone.value
					});
					const rangeEndDateTime = Temporal.ZonedDateTime.from({
						year: plainDate.year,
						month: plainDate.month,
						day: plainDate.day,
						hour: 23,
						minute: 59,
						second: 59,
						timeZone: $app.config.timezone.value
					});
					day.backgroundEvents = filterByRange($app.calendarEvents.backgroundEvents.value, {
						start: rangeStartDateTime,
						end: rangeEndDateTime
					}, $app.config.timezone.value);
				});
			});
			const filteredEvents = $app.calendarEvents.filterPredicate.value ? $app.calendarEvents.list.value.filter($app.calendarEvents.filterPredicate.value) : $app.calendarEvents.list.value;
			setMonth(positionInMonth(newMonth, filteredEvents.sort(sortEventsForMonthGrid)));
		});
		return u$2(AppContext.Provider, {
			value: $app,
			children: u$2("div", {
				id,
				className: "sx__month-grid-wrapper",
				children: month.map((week, index) => u$2(MonthGridWeek, {
					week,
					isFirstWeek: index === 0,
					isLastWeek: index === month.length - 1
				}, index))
			})
		});
	};
	const viewMonthGrid = createPreactView({
		name: InternalViewName.MonthGrid,
		label: "Month",
		setDateRange: setRangeForMonth,
		Component: MonthGridWrapper,
		hasWideScreenCompat: true,
		hasSmallScreenCompat: false,
		backwardForwardFn: addMonths,
		backwardForwardUnits: 1
	});
	const createAgendaMonth = (date, timeUnitsImpl) => {
		return { weeks: timeUnitsImpl.getMonthWithTrailingAndLeadingDays(date.year, date.month).map((week) => {
			return week.map((date) => {
				return {
					date: Temporal.PlainDate.from(date),
					events: []
				};
			});
		}) };
	};
	function MonthAgendaDay({ day, isActive, setActiveDate, isLeadingOrTrailing }) {
		const $app = x$2(AppContext);
		const monthAgendaDateDotsCustomComponent = $app.config._customComponentFns.monthAgendaDateDots;
		const monthAgendaDateDotsCCID = d$2(monthAgendaDateDotsCustomComponent ? randomStringId() : "")[0];
		h$2(() => {
			if (!monthAgendaDateDotsCustomComponent) return;
			const dotsEl = document.querySelector(`[data-ccid="${monthAgendaDateDotsCCID}"]`);
			if (!(dotsEl instanceof HTMLElement)) return;
			monthAgendaDateDotsCustomComponent(dotsEl, {
				date: toJSDate(day.date.toString()).getDate(),
				jsDate: toJSDate(day.date.toString()),
				events: day.events.slice(0, $app.config.monthAgendaOptions.value.nEventIndicatorsPerDay).map((calendarEvent) => calendarEvent._getExternalEvent())
			});
		}, [day]);
		const dayClasses = ["sx__month-agenda-day", getClassNameForWeekday(day.date.dayOfWeek)];
		if (isActive) dayClasses.push("sx__month-agenda-day--active");
		if (isLeadingOrTrailing) dayClasses.push("is-leading-or-trailing");
		const handleClick = (e, callback) => {
			setActiveDate(day.date);
			if (!callback) return;
			callback(day.date, e);
		};
		const hasFocus = (weekDay) => weekDay.date.toString() === $app.datePickerState.selectedDate.value.toString();
		const handleKeyDown = (event) => {
			const keyMapDaysToAdd = /* @__PURE__ */ new Map([
				["ArrowDown", 7],
				["ArrowUp", -7],
				["ArrowLeft", -1],
				["ArrowRight", 1]
			]);
			$app.datePickerState.selectedDate.value = Temporal.PlainDate.from(addDays($app.datePickerState.selectedDate.value, keyMapDaysToAdd.get(event.key) || 0));
		};
		const isBeforeMinDate = !!($app.config.minDate.value && day.date.toString() < $app.config.minDate.value.toString());
		const isPastMaxDate = !!($app.config.maxDate.value && day.date.toString() > $app.config.maxDate.value.toString());
		return u$2("button", {
			type: "button",
			className: `sx__button ${dayClasses.join(" ")}`,
			onClick: (e) => handleClick(e, $app.config.callbacks.onClickAgendaDate),
			onDblClick: (e) => handleClick(e, $app.config.callbacks.onDoubleClickAgendaDate),
			disabled: isBeforeMinDate || isPastMaxDate,
			"aria-label": getLocalizedDate$1(day.date, $app.config.locale.value),
			tabIndex: hasFocus(day) ? 0 : -1,
			"data-agenda-focus": hasFocus(day) ? "true" : void 0,
			onKeyDown: handleKeyDown,
			children: [u$2("div", { children: day.date.day }), u$2("div", {
				className: "sx__month-agenda-day__event-icons",
				children: monthAgendaDateDotsCustomComponent ? u$2("div", { "data-ccid": monthAgendaDateDotsCCID }) : u$2(S$1, { children: day.events.slice(0, $app.config.monthAgendaOptions.value.nEventIndicatorsPerDay).map((event) => u$2("div", {
					style: { backgroundColor: `var(--sx-color-${event._color})` },
					className: "sx__month-agenda-day__event-icon"
				}, event.id)) })
			})]
		});
	}
	function MonthAgendaWeek({ week, setActiveDate, activeDate, isLeadingOrTrailing }) {
		const $app = x$2(AppContext);
		return u$2("div", {
			className: "sx__month-agenda-week",
			children: [$app.config.showWeekNumbers.value && u$2("div", {
				className: "sx__month-agenda-week__week-number",
				children: getWeekNumber(Temporal.PlainDate.from(week[0].date), $app.config.firstDayOfWeek.value)
			}), week.map((day, index) => u$2(MonthAgendaDay, {
				setActiveDate,
				day,
				isActive: isSameDay(activeDate, day.date),
				isLeadingOrTrailing: isLeadingOrTrailing === null || isLeadingOrTrailing === void 0 ? void 0 : isLeadingOrTrailing(day.date)
			}, index + day.date.toString()))]
		});
	}
	function MonthAgendaDayNames({ week }) {
		const $app = x$2(AppContext);
		const localizedShortDayNames = getOneLetterOrShortDayNames(week.map((day) => day.date), $app.config.locale.value);
		return u$2("div", {
			className: T$2(() => {
				const ret = ["sx__month-agenda-day-names"];
				if ($app.config.showWeekNumbers.value) ret.push("sx__has-week-numbers");
				return ret.join(" ");
			}, [$app.config.showWeekNumbers.value]),
			children: localizedShortDayNames.map((oneLetterDayName) => u$2("div", {
				className: "sx__month-agenda-day-name",
				children: oneLetterDayName
			}))
		});
	}
	function MonthAgendaEvent({ calendarEvent, customComponentKey = "monthAgendaEvent", customContentKey = "monthAgenda" }) {
		var _a, _b, _c;
		const $app = x$2(AppContext);
		const { setClickedEvent } = useEventInteractions($app);
		const eventCSSVariables = {
			backgroundColor: `var(--sx-color-${calendarEvent._color}-container)`,
			color: `var(--sx-color-on-${calendarEvent._color}-container)`,
			borderInlineStart: `4px solid var(--sx-color-${calendarEvent._color})`
		};
		const customComponent = $app.config._customComponentFns[customComponentKey];
		const customComponentId = A$2(customComponent ? "custom-month-agenda-event-" + randomStringId() : void 0);
		h$2(() => {
			if (!customComponent) return;
			customComponent(getElementByCCID(customComponentId.current), { calendarEvent: calendarEvent._getExternalEvent() });
			return () => {
				var _a, _b;
				(_b = (_a = $app.config)._destroyCustomComponentInstance) === null || _b === void 0 || _b.call(_a, customComponentId.current);
			};
		}, [calendarEvent]);
		const onClick = (e) => {
			setClickedEvent(e, calendarEvent);
			invokeOnEventClickCallback($app, calendarEvent, e);
		};
		const onDoubleClick = (e) => {
			setClickedEvent(e, calendarEvent);
			invokeOnEventDoubleClickCallback($app, calendarEvent, e);
		};
		const onKeyDown = (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.stopPropagation();
				setClickedEvent(e, calendarEvent);
				invokeOnEventClickCallback($app, calendarEvent, e);
				nextTick(() => {
					focusModal($app);
				});
			}
		};
		const hasCustomContent = (_a = calendarEvent._customContent) === null || _a === void 0 ? void 0 : _a[customContentKey];
		const classNames = ["sx__event", "sx__month-agenda-event"];
		if ((_b = calendarEvent._options) === null || _b === void 0 ? void 0 : _b.additionalClasses) classNames.push(...calendarEvent._options.additionalClasses);
		if (wasEventAddedInLastSecond(calendarEvent)) classNames.push("is-event-new");
		return u$2("div", {
			className: classNames.join(" "),
			"data-ccid": customComponentId.current,
			"data-event-id": calendarEvent.id,
			style: {
				backgroundColor: customComponent ? void 0 : eventCSSVariables.backgroundColor,
				color: customComponent ? void 0 : eventCSSVariables.color,
				borderInlineStart: customComponent ? void 0 : eventCSSVariables.borderInlineStart,
				padding: customComponent ? "0px" : void 0
			},
			onClick: (e) => onClick(e),
			onDblClick: (e) => onDoubleClick(e),
			onKeyDown,
			tabIndex: 0,
			role: "button",
			children: [!customComponent && !hasCustomContent && u$2(S$1, { children: [u$2("div", {
				className: "sx__month-agenda-event__title",
				children: calendarEvent.title
			}), u$2("div", {
				className: "sx__month-agenda-event__time sx__month-agenda-event__has-icon",
				children: [u$2(TimeIcon, { strokeColor: `var(--sx-color-on-${calendarEvent._color}-container)` }), u$2("div", { dangerouslySetInnerHTML: { __html: getTimeStamp(calendarEvent, $app.config.locale.value) } })]
			})] }), hasCustomContent && u$2("div", { dangerouslySetInnerHTML: { __html: ((_c = calendarEvent._customContent) === null || _c === void 0 ? void 0 : _c[customContentKey]) || "" } })]
		});
	}
	function MonthAgendaEvents({ events, customComponentKey, customContentKey }) {
		const $app = x$2(AppContext);
		return u$2("div", {
			className: "sx__month-agenda-events",
			children: events.length ? events.map((event) => u$2(MonthAgendaEvent, {
				calendarEvent: event,
				customComponentKey,
				customContentKey
			}, event.id)) : u$2("div", {
				className: "sx__month-agenda-events__empty",
				children: $app.translate("No events")
			})
		});
	}
	const getAllEventDates = (startDate, endDate) => {
		let currentDate = startDate;
		const dates = [currentDate];
		while (currentDate < endDate) {
			currentDate = addDays(Temporal.PlainDate.from(currentDate), 1).toString();
			dates.push(currentDate);
		}
		return dates;
	};
	const placeEventInDay = (allDaysMap) => (event) => {
		getAllEventDates(dateFromDateTime(event.start.toString()), dateFromDateTime(event.end.toString())).forEach((date) => {
			if (allDaysMap[date]) allDaysMap[date].events.push(event);
		});
	};
	const positionEventsInAgenda = (agenda, eventsSortedByStart) => {
		const allDaysMap = agenda.weeks.reduce((acc, week) => {
			week.forEach((day) => {
				acc[day.date.toString()] = day;
			});
			return acc;
		}, {});
		eventsSortedByStart.forEach(placeEventInDay(allDaysMap));
		return agenda;
	};
	function useAgenda($app, createGrid) {
		const getAgenda = () => {
			const filteredEvents = $app.calendarEvents.filterPredicate.value ? $app.calendarEvents.list.value.filter($app.calendarEvents.filterPredicate.value) : $app.calendarEvents.list.value;
			return positionEventsInAgenda(createGrid($app.datePickerState.selectedDate.value.toZonedDateTime($app.config.timezone.value), $app.timeUnitsImpl), filteredEvents.sort(sortEventsByStartAndEnd));
		};
		const [agenda, setAgenda] = d$2(getAgenda());
		h$2(() => {
			setAgenda(getAgenda());
		}, [
			$app.datePickerState.selectedDate.value,
			$app.calendarEvents.list.value,
			$app.calendarEvents.filterPredicate.value
		]);
		return agenda;
	}
	const MonthAgendaWrapper = ({ $app, id }) => {
		var _a;
		const agenda = useAgenda($app, createAgendaMonth);
		const selectedMonth = $app.datePickerState.selectedDate.value.month;
		h$2(() => {
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					const mutatedElement = mutation.target;
					if (mutatedElement.dataset.agendaFocus === "true") mutatedElement.focus();
				});
			});
			const monthViewElement = document.getElementById(id);
			observer.observe(monthViewElement, {
				childList: true,
				subtree: true,
				attributes: true
			});
			return () => observer.disconnect();
		}, []);
		return u$2(AppContext.Provider, {
			value: $app,
			children: u$2("div", {
				id,
				className: "sx__month-agenda-wrapper",
				children: [
					u$2(MonthAgendaDayNames, { week: agenda.weeks[0] }),
					u$2("div", {
						className: "sx__month-agenda-weeks",
						children: agenda.weeks.map((week, index) => u$2(MonthAgendaWeek, {
							week,
							setActiveDate: (date) => $app.datePickerState.selectedDate.value = date,
							activeDate: $app.datePickerState.selectedDate.value,
							isLeadingOrTrailing: (date) => date.month !== selectedMonth
						}, index))
					}),
					u$2(MonthAgendaEvents, { events: ((_a = agenda.weeks.flat().find((day) => isSameDay(day.date, $app.datePickerState.selectedDate.value))) === null || _a === void 0 ? void 0 : _a.events) || [] }, $app.datePickerState.selectedDate.value)
				]
			})
		});
	};
	createPreactView({
		name: InternalViewName.MonthAgenda,
		label: "Month",
		setDateRange: setRangeForMonth,
		Component: MonthAgendaWrapper,
		hasSmallScreenCompat: true,
		hasWideScreenCompat: false,
		backwardForwardFn: addMonths,
		backwardForwardUnits: 1
	});
	const createAgendaWeek = (date, timeUnitsImpl) => {
		return { weeks: [timeUnitsImpl.getWeekFor(date).map((date) => {
			return {
				date: date.toPlainDate(),
				events: []
			};
		})] };
	};
	const WeekAgendaWrapper = ({ $app, id }) => {
		var _a;
		const agenda = useAgenda($app, createAgendaWeek);
		h$2(() => {
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					const mutatedElement = mutation.target;
					if (mutatedElement.dataset.agendaFocus === "true") mutatedElement.focus();
				});
			});
			const viewElement = document.getElementById(id);
			observer.observe(viewElement, {
				childList: true,
				subtree: true,
				attributes: true
			});
			return () => observer.disconnect();
		}, []);
		return u$2(AppContext.Provider, {
			value: $app,
			children: u$2("div", {
				id,
				className: "sx__month-agenda-wrapper sx__week-agenda-wrapper",
				children: [u$2("div", {
					className: "sx__week-agenda-header",
					children: [u$2(MonthAgendaDayNames, { week: agenda.weeks[0] }), u$2("div", {
						className: "sx__month-agenda-weeks",
						children: agenda.weeks.map((week, index) => u$2(MonthAgendaWeek, {
							week,
							setActiveDate: (date) => $app.datePickerState.selectedDate.value = date,
							activeDate: $app.datePickerState.selectedDate.value
						}, index))
					})]
				}), u$2(MonthAgendaEvents, {
					events: ((_a = agenda.weeks.flat().find((day) => isSameDay(day.date, $app.datePickerState.selectedDate.value))) === null || _a === void 0 ? void 0 : _a.events) || [],
					customComponentKey: "weekAgendaEvent",
					customContentKey: "weekAgenda"
				}, $app.datePickerState.selectedDate.value)]
			})
		});
	};
	createPreactView({
		name: InternalViewName.WeekAgenda,
		label: "Week Agenda",
		setDateRange: setRangeForWeek,
		Component: WeekAgendaWrapper,
		hasSmallScreenCompat: true,
		hasWideScreenCompat: false,
		backwardForwardFn: addDays,
		backwardForwardUnits: 7
	});
	const scrollOnDateSelection = ($app, wrapperRef) => {
		if (!wrapperRef.current) return;
		const selectedDate = $app.datePickerState.selectedDate.value;
		const selectedDayElement = wrapperRef.current.querySelector(`.sx__list-day[data-date="${selectedDate}"]`);
		if (selectedDayElement instanceof HTMLElement) requestAnimationFrame(() => {
			selectedDayElement.scrollIntoView({
				behavior: "instant",
				block: "start"
			});
		});
	};
	/**
	* Checks if there are any infinite recurring events (events with RRULE that has no COUNT or UNTIL)
	*/
	const hasInfiniteRecurringEvents = (events) => {
		return events.some((event) => {
			var _a;
			if (event.isCopy) return false;
			const rrule = (_a = event._getForeignProperties()) === null || _a === void 0 ? void 0 : _a.rrule;
			if (!rrule || typeof rrule !== "string") return false;
			return !rrule.includes("COUNT") && !rrule.includes("UNTIL");
		});
	};
	/**
	* Performs the actual range expansion for infinite recurring events.
	* This is the shared logic used by both visibility detection methods.
	*/
	const performRangeExpansion = ({ $app, wrapperRef, lastDateInList, lastRangeExpansionRef, isExpandingRangeRef, scrollPositionBeforeExpansionRef }) => {
		const currentRange = $app.calendarState.range.value;
		if (!currentRange) return;
		const oneYearFromLast = Temporal.PlainDate.from(lastDateInList).toZonedDateTime({
			timeZone: $app.config.timezone.value,
			plainTime: Temporal.PlainTime.from({
				hour: 23,
				minute: 59
			})
		}).add({ years: 1 });
		const rangeEndString = oneYearFromLast.toString();
		if (oneYearFromLast.epochNanoseconds > currentRange.end.epochNanoseconds && lastRangeExpansionRef.current !== rangeEndString) {
			if (wrapperRef.current) {
				scrollPositionBeforeExpansionRef.current = wrapperRef.current.scrollTop;
				isExpandingRangeRef.current = true;
			}
			const extendedRange = {
				start: currentRange.start,
				end: oneYearFromLast
			};
			lastRangeExpansionRef.current = rangeEndString;
			$app.calendarState.range.value = extendedRange;
		}
	};
	/**
	* Expands the calendar range if we're at the bottom of the list and have infinite recurring events.
	* This allows the recurrence plugin to generate more occurrences.
	* Uses DOM-based visibility checking (getBoundingClientRect).
	*/
	const expandInfiniteRecurringEventsIfNeeded = ({ $app, wrapperRef, filteredEvents, lastRangeExpansionRef, isExpandingRangeRef, scrollPositionBeforeExpansionRef }) => {
		if (!hasInfiniteRecurringEvents(filteredEvents) || filteredEvents.length === 0) return;
		if (!wrapperRef.current) return;
		const allDayElements = Array.from(wrapperRef.current.querySelectorAll(".sx__list-day"));
		if (allDayElements.length === 0) return;
		const lastDayElement = allDayElements[allDayElements.length - 1];
		const rect = lastDayElement.getBoundingClientRect();
		const wrapperRect = wrapperRef.current.getBoundingClientRect();
		if (rect.top >= wrapperRect.top && rect.bottom <= wrapperRect.bottom && rect.top < wrapperRect.bottom) {
			const lastDate = lastDayElement.getAttribute("data-date");
			if (lastDate) {
				const allDates = filteredEvents.map((e) => dateFromDateTime(e.end.toString())).sort();
				const lastDateInList = allDates[allDates.length - 1];
				if (lastDate === lastDateInList) performRangeExpansion({
					$app,
					wrapperRef,
					lastDateInList,
					lastRangeExpansionRef,
					isExpandingRangeRef,
					scrollPositionBeforeExpansionRef
				});
			}
		}
	};
	/**
	* Checks if we need to expand infinite recurring events based on visible days in the viewport.
	* Used by IntersectionObserver callback.
	* Uses IntersectionObserver's visibleDates Set for visibility checking.
	*/
	const checkAndExpandInfiniteRecurringEvents = ({ $app, wrapperRef, filteredEvents, visibleDates, lastRangeExpansionRef, isExpandingRangeRef, scrollPositionBeforeExpansionRef }) => {
		if (!hasInfiniteRecurringEvents(filteredEvents) || visibleDates.size === 0) return;
		const allDates = filteredEvents.map((e) => dateFromDateTime(e.end.toString())).sort();
		if (allDates.length === 0) return;
		const visibleDatesArray = Array.from(visibleDates).sort();
		const lastVisibleDate = visibleDatesArray[visibleDatesArray.length - 1];
		const lastDateInList = allDates[allDates.length - 1];
		if (allDates.slice(-2).includes(lastVisibleDate)) performRangeExpansion({
			$app,
			wrapperRef,
			lastDateInList,
			lastRangeExpansionRef,
			isExpandingRangeRef,
			scrollPositionBeforeExpansionRef
		});
	};
	const ListWrapper = ({ $app, id }) => {
		const [daysWithEvents, setDaysWithEvents] = d$2([]);
		const wrapperRef = A$2(null);
		const { setClickedEvent } = useEventInteractions($app);
		/**
		* "hack" for preventing the onScrollDayIntoView callback from being called just after events have changed
		* any ideas for how to improve this are welcome
		* */
		const blockOnScrollDayIntoViewCallback = A$2(false);
		const blockTimeoutRef = A$2(null);
		const lastRangeExpansionRef = A$2(null);
		const isExpandingRangeRef = A$2(false);
		const scrollPositionBeforeExpansionRef = A$2(null);
		const minDate = $app.config.minDate.value ? dateFromDateTime($app.config.minDate.value.toString()) : null;
		const maxDate = $app.config.maxDate.value ? dateFromDateTime($app.config.maxDate.value.toString()) : null;
		const updateDaysWithEvents = (events) => {
			const daysWithEventsMap = events.reduce((acc, event) => {
				const startDate = dateFromDateTime(event.start.toString());
				const endDate = dateFromDateTime(event.end.toString());
				let currentDate = startDate;
				while (currentDate <= endDate) {
					if (!acc[currentDate]) acc[currentDate] = [];
					acc[currentDate].push(event);
					currentDate = addDays(Temporal.PlainDate.from(currentDate), 1).toString();
				}
				return acc;
			}, {});
			const sortedDays = Object.entries(daysWithEventsMap).map(([date, events]) => ({
				date,
				events: events.sort((a, b) => a.start.toString().localeCompare(b.start.toString()))
			})).sort((a, b) => a.date.localeCompare(b.date));
			setDaysWithEvents(sortedDays);
			if (blockTimeoutRef.current) clearTimeout(blockTimeoutRef.current);
			blockTimeoutRef.current = setTimeout(() => {
				blockOnScrollDayIntoViewCallback.current = false;
				blockTimeoutRef.current = null;
			}, 100);
		};
		h$2(() => {
			const filteredEvents = $app.calendarEvents.list.value.filter((event) => {
				const startDate = dateFromDateTime(event.start.toString());
				const endDate = dateFromDateTime(event.end.toString());
				if (minDate && endDate < minDate) return false;
				if (maxDate && startDate > maxDate) return false;
				return true;
			});
			/**
			* onScrollDayIntoView can never be allowed to be called as a side effect of events changing.
			* Otherwise, implementers will have to write custom logic to prevent infinite recursion.
			*
			* Open to any ideas for how to improve this and make do without a timeout.
			* */
			blockOnScrollDayIntoViewCallback.current = true;
			updateDaysWithEvents(filteredEvents);
			nextTick(() => {
				expandInfiniteRecurringEventsIfNeeded({
					$app,
					wrapperRef,
					filteredEvents,
					lastRangeExpansionRef,
					isExpandingRangeRef,
					scrollPositionBeforeExpansionRef
				});
			});
		}, [$app.calendarEvents.list.value]);
		h$2(() => {
			const handleScroll = () => {
				if (blockTimeoutRef.current) {
					clearTimeout(blockTimeoutRef.current);
					blockTimeoutRef.current = null;
					blockOnScrollDayIntoViewCallback.current = false;
				}
			};
			const wrapper = wrapperRef.current;
			if (wrapper) {
				wrapper.addEventListener("scroll", handleScroll);
				return () => {
					wrapper.removeEventListener("scroll", handleScroll);
				};
			}
		}, []);
		const [interSectionObserver, setIntersectionObserver] = d$2(null);
		h$2(() => {
			if (!wrapperRef.current) return;
			if (interSectionObserver) interSectionObserver.disconnect();
			const _observer = new IntersectionObserver((entries) => {
				const visibleDates = /* @__PURE__ */ new Set();
				entries.forEach((entry) => {
					if (entry.isIntersecting && entry.intersectionRatio > 0) {
						const date = entry.target.getAttribute("data-date");
						if (date) visibleDates.add(date);
					}
				});
				entries.forEach((entry) => {
					if (entry.isIntersecting && entry.intersectionRatio > 0) {
						const date = entry.target.getAttribute("data-date");
						if (date && $app.config.callbacks.onScrollDayIntoView && !blockOnScrollDayIntoViewCallback.current) $app.config.callbacks.onScrollDayIntoView(Temporal.PlainDate.from(date));
					}
				});
				if (visibleDates.size > 0 && daysWithEvents.length > 0) checkAndExpandInfiniteRecurringEvents({
					$app,
					wrapperRef,
					filteredEvents: $app.calendarEvents.list.value.filter((event) => {
						const startDate = dateFromDateTime(event.start.toString());
						const endDate = dateFromDateTime(event.end.toString());
						if (minDate && endDate < minDate) return false;
						if (maxDate && startDate > maxDate) return false;
						return true;
					}),
					visibleDates,
					lastRangeExpansionRef,
					isExpandingRangeRef,
					scrollPositionBeforeExpansionRef
				});
			}, {
				root: wrapperRef.current,
				rootMargin: "0px",
				threshold: [
					0,
					.1,
					1
				]
			});
			wrapperRef.current.querySelectorAll(".sx__list-day").forEach((dayElement) => {
				_observer.observe(dayElement);
			});
			setIntersectionObserver(_observer);
			return () => {
				_observer.disconnect();
			};
		}, [daysWithEvents]);
		h$2(() => {
			if (isExpandingRangeRef.current && scrollPositionBeforeExpansionRef.current !== null) nextTick(() => {
				if (wrapperRef.current && scrollPositionBeforeExpansionRef.current !== null) {
					wrapperRef.current.scrollTop = scrollPositionBeforeExpansionRef.current;
					scrollPositionBeforeExpansionRef.current = null;
					isExpandingRangeRef.current = false;
				}
			});
			else scrollOnDateSelection($app, wrapperRef);
		}, [daysWithEvents, $app.datePickerState.selectedDate.value]);
		const renderEventTimes = (event, dayDate) => {
			const eventStartDate = dateFromDateTime(event.start.toString());
			const eventEndDate = dateFromDateTime(event.end.toString());
			const isFirstDay = eventStartDate === dayDate;
			const isLastDay = eventEndDate === dayDate;
			const isMultiDay = eventStartDate !== eventEndDate;
			const timeOptions = {
				hour: "numeric",
				minute: "numeric",
				hour12: $app.config.locale.value === "en-US"
			};
			const startZDT = Temporal.ZonedDateTime.from({
				year: event.start.year,
				month: event.start.month,
				day: event.start.day,
				hour: event.start instanceof Temporal.ZonedDateTime ? event.start.hour : 0,
				minute: event.start instanceof Temporal.ZonedDateTime ? event.start.minute : 0,
				timeZone: $app.config.timezone.value
			});
			const endZDT = Temporal.ZonedDateTime.from({
				year: event.end.year,
				month: event.end.month,
				day: event.end.day,
				hour: event.end instanceof Temporal.ZonedDateTime ? event.end.hour : 0,
				minute: event.end instanceof Temporal.ZonedDateTime ? event.end.minute : 0,
				timeZone: $app.config.timezone.value
			});
			if (!isMultiDay) return u$2(S$1, { children: [u$2("div", {
				className: "sx__list-event-start-time",
				children: startZDT.toLocaleString($app.config.locale.value, timeOptions)
			}), event.end && u$2("div", {
				className: "sx__list-event-end-time",
				children: endZDT.toLocaleString($app.config.locale.value, timeOptions)
			})] });
			if (isFirstDay) return u$2(S$1, { children: [u$2("div", {
				className: "sx__list-event-start-time",
				children: startZDT.toLocaleString($app.config.locale.value, timeOptions)
			}), u$2("div", {
				className: "sx__list-event-arrow",
				children: "→"
			})] });
			if (isLastDay) return u$2(S$1, { children: [u$2("div", {
				className: "sx__list-event-arrow",
				children: "←"
			}), u$2("div", {
				className: "sx__list-event-end-time",
				children: endZDT.toLocaleString($app.config.locale.value, timeOptions)
			})] });
			return u$2("div", {
				className: "sx__list-event-arrow",
				children: "↔"
			});
		};
		const handleEventClick = (e, event) => {
			setClickedEvent(e, event);
			invokeOnEventClickCallback($app, event, e);
		};
		const handleEventDoubleClick = (e, event) => {
			setClickedEvent(e, event);
			invokeOnEventDoubleClickCallback($app, event, e);
		};
		const handleEventKeyDown = (e, event) => {
			if (e.key === "Enter" || e.key === " ") {
				e.stopPropagation();
				setClickedEvent(e, event);
				invokeOnEventClickCallback($app, event, e);
				nextTick(() => {
					focusModal($app);
				});
			}
		};
		return u$2(AppContext.Provider, {
			value: $app,
			children: u$2("div", {
				id,
				className: "sx__list-wrapper",
				ref: wrapperRef,
				children: daysWithEvents.length === 0 ? u$2("div", {
					className: "sx__list-no-events",
					children: $app.translate("No events")
				}) : daysWithEvents.map((day) => u$2("div", {
					className: "sx__list-day",
					"data-date": day.date,
					children: [
						u$2("div", {
							className: "sx__list-day-header",
							children: u$2("div", {
								className: "sx__list-day-date",
								children: toJSDate(day.date).toLocaleDateString($app.config.locale.value, {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric"
								})
							})
						}),
						u$2("div", {
							className: "sx__list-day-events",
							children: day.events.map((event) => {
								var _a;
								const classNames = ["sx__event", "sx__list-event"];
								if ((_a = event._options) === null || _a === void 0 ? void 0 : _a.additionalClasses) classNames.push(...event._options.additionalClasses);
								return u$2("div", {
									className: classNames.join(" "),
									onClick: (e) => handleEventClick(e, event),
									onDblClick: (e) => handleEventDoubleClick(e, event),
									onKeyDown: (e) => handleEventKeyDown(e, event),
									tabIndex: 0,
									role: "button",
									children: [u$2("div", {
										className: `sx__list-event-color-line`,
										style: { backgroundColor: `var(--sx-color-${event._color})` }
									}), u$2("div", {
										className: "sx__list-event-content",
										children: [u$2("div", {
											className: "sx__list-event-title",
											children: event.title
										}), u$2("div", {
											className: "sx__list-event-times",
											children: renderEventTimes(event, day.date)
										})]
									})]
								}, event.id);
							})
						}),
						u$2("div", { className: "sx__list-day-margin" })
					]
				}, day.date))
			})
		});
	};
	createPreactView({
		name: InternalViewName.List,
		label: "List",
		setDateRange: setRangeForMonth,
		Component: ListWrapper,
		hasSmallScreenCompat: true,
		hasWideScreenCompat: true,
		backwardForwardFn: addMonths,
		backwardForwardUnits: 1
	});
	//#endregion
	//#region \0dsh-css:/home/zteng/work/Tools/dsh-powerdesk/node_modules/.pnpm/@schedule-x+theme-default@4.6.1/node_modules/@schedule-x/theme-default/dist/index.css.mjs
	const css$1 = ".sx__calendar-wrapper ul,\n.sx__date-picker-wrapper ul,\n.sx__date-picker-popup ul {\n  list-style: none;\n  padding: 0;\n}\n.sx__calendar-wrapper input,\n.sx__calendar-wrapper button,\n.sx__date-picker-wrapper input,\n.sx__date-picker-wrapper button,\n.sx__date-picker-popup input,\n.sx__date-picker-popup button {\n  font-family: inherit;\n  outline: none;\n}\n\n.sx__button {\n  background-color: inherit;\n  outline: 0;\n  border: none;\n  cursor: pointer;\n}\n\n:root {\n  --sx-color-primary: #6750a4;\n  --sx-color-on-primary: #fff;\n  --sx-color-primary-container: #eaddff;\n  --sx-color-on-primary-container: #21005e;\n  --sx-color-secondary: #625b71;\n  --sx-color-on-secondary: #fff;\n  --sx-color-secondary-container: #e8def8;\n  --sx-color-on-secondary-container: #1e192b;\n  --sx-color-tertiary: #7d5260;\n  --sx-color-on-tertiary: #fff;\n  --sx-color-tertiary-container: #ffd8e4;\n  --sx-color-on-tertiary-container: #370b1e;\n  --sx-color-surface: #fef7ff;\n  --sx-color-surface-dim: #ded8e1;\n  --sx-color-surface-bright: #fef7ff;\n  --sx-color-on-surface: #1c1b1f;\n  --sx-color-surface-container: #f3edf7;\n  --sx-color-surface-container-low: #f7f2fa;\n  --sx-color-surface-container-high: #ece6f0;\n  --sx-color-background: #fff;\n  --sx-color-on-background: #1c1b1f;\n  --sx-color-outline: #79747e;\n  --sx-color-outline-variant: #c4c7c5;\n  --sx-color-shadow: #000;\n  --sx-color-surface-tint: #6750a4;\n  --sx-color-neutral: var(--sx-color-outline);\n  --sx-color-neutral-variant: var(--sx-color-outline-variant);\n  --sx-internal-color-gray-ripple-background: #e0e0e0;\n  --sx-internal-color-light-gray: #fafafa;\n  --sx-internal-color-text: #000;\n}\n\n.is-dark {\n  --sx-color-primary: #d0bcff;\n  --sx-color-on-primary: #371e73;\n  --sx-color-primary-container: #4f378b;\n  --sx-color-on-primary-container: #eaddff;\n  --sx-color-secondary: #ccc2dc;\n  --sx-color-on-secondary: #332d41;\n  --sx-color-secondary-container: #4a4458;\n  --sx-color-on-secondary-container: #e8def8;\n  --sx-color-tertiary: #efb8c8;\n  --sx-color-on-tertiary: #492532;\n  --sx-color-tertiary-container: #633b48;\n  --sx-color-on-tertiary-container: #ffd8e4;\n  --sx-color-surface: #141218;\n  --sx-color-surface-dim: #141218;\n  --sx-color-surface-bright: #3b383e;\n  --sx-color-on-surface: #e6e1e5;\n  --sx-color-surface-container: #211f26;\n  --sx-color-surface-container-low: #1d1b20;\n  --sx-color-surface-container-high: #2b2930;\n  --sx-color-background: #141218;\n  --sx-color-on-background: #e6e1e5;\n  --sx-color-outline: #938f99;\n  --sx-color-outline-variant: #444746;\n  --sx-color-shadow: #000;\n  --sx-color-surface-tint: #d0bcff;\n  --sx-internal-color-text: #fff;\n}\n\n:root {\n  --sx-spacing-padding1: 4px;\n  --sx-spacing-padding2: 8px;\n  --sx-spacing-padding3: 12px;\n  --sx-spacing-padding4: 16px;\n  --sx-spacing-padding6: 24px;\n  --sx-spacing-modal-padding: 16px;\n}\n\n:root {\n  --sx-box-shadow-level3: 0 3px 6px 0 rgb(0 0 0 / 16%),\n    0 3px 6px 0 rgb(0 0 0 / 23%);\n  --sx-rounding-extra-small: 4px;\n  --sx-rounding-small: 8px;\n  --sx-rounding-extra-large: 28px;\n  --sx-border: 1px solid var(--sx-color-outline-variant);\n}\n\n.is-dark {\n  --sx-border: 1px solid var(--sx-color-outline-variant);\n}\n\n:root {\n  --sx-font-small: 0.875rem;\n  --sx-font-extra-small: 0.75rem;\n  --sx-font-large: 1.125rem;\n  --sx-font-extra-large: 1.25rem;\n}\n\n:root {\n  --sx-z-index-week-header: 100;\n  --sx-z-index-event-modal: 101;\n  --sx-calendar-header-popup-z-index: 102;\n}\n\n@keyframes sx-ripple {\n  0% {\n    width: 0;\n    height: 0;\n    opacity: 0.16;\n  }\n  40% {\n    width: 100px;\n    height: 100px;\n    opacity: 0.08;\n  }\n  100% {\n    width: 150px;\n    height: 150px;\n    opacity: 0;\n  }\n}\n.sx__ripple {\n  position: relative;\n  overflow: hidden;\n}\n.sx__ripple::before {\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 0;\n  height: 0;\n  transform: translate(-50%, -50%);\n  border-radius: 50%;\n  background-color: currentcolor;\n  opacity: 0.1;\n  visibility: hidden;\n  z-index: 2;\n}\n.sx__ripple:active::before {\n  visibility: visible;\n}\n.sx__ripple:not(:active)::before {\n  animation: sx-ripple 0.75s cubic-bezier(0, 0.1, 0.8, 1);\n  transition: visibility 0.75s step-end;\n}\n\n@keyframes sx-ripple-wide {\n  0% {\n    width: 0;\n    height: 0;\n    opacity: 0.16;\n  }\n  40% {\n    width: 300px;\n    height: 100px;\n    opacity: 0.08;\n  }\n  100% {\n    width: 450px;\n    height: 150px;\n    opacity: 0;\n  }\n}\n.sx__ripple--wide {\n  position: relative;\n  overflow: hidden;\n}\n.sx__ripple--wide::before {\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 0;\n  height: 0;\n  transform: translate(-50%, -50%);\n  border-radius: 50%;\n  background-color: currentcolor;\n  opacity: 0.1;\n  visibility: hidden;\n  z-index: 2;\n}\n.sx__ripple--wide:active::before {\n  visibility: visible;\n}\n.sx__ripple--wide::before {\n  border-radius: var(--sx-rounding-small);\n}\n.sx__ripple--wide:not(:active)::before {\n  animation: sx-ripple-wide 0.75s cubic-bezier(0, 0.1, 0.8, 1);\n  transition: visibility 0.75s step-end;\n}\n\n.sx__chevron-wrapper {\n  position: relative;\n  border-radius: 50%;\n  min-height: 48px;\n  min-width: 48px;\n  cursor: pointer;\n  transition: background-color 0.2s ease-in-out;\n  font-size: 0;\n}\n.sx__chevron-wrapper:active {\n  background-color: var(--sx-internal-color-gray-ripple-background);\n}\n.sx__chevron-wrapper:disabled {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n.sx__chevron-wrapper:hover, .sx__chevron-wrapper:focus {\n  background-color: var(--sx-color-surface-dim);\n}\n.is-dark .sx__chevron-wrapper:hover, .is-dark .sx__chevron-wrapper:focus {\n  background-color: var(--sx-color-surface-container-high);\n}\n.sx__chevron-wrapper .sx__chevron {\n  position: absolute;\n  top: 50%;\n  width: 0.6rem;\n  height: 0.6rem;\n  border-width: 0.2rem 0.2rem 0 0;\n  border-style: solid;\n  border-color: var(--sx-internal-color-text);\n}\n\n.sx__chevron--previous {\n  left: calc(50% + 0.125rem);\n  transform: translate(-50%, -50%) rotate(225deg);\n}\n[dir=rtl] .sx__chevron--previous {\n  left: calc(50% - 0.125rem);\n  transform: translate(-50%, -50%) rotate(45deg);\n}\n\n.sx__chevron--next {\n  left: calc(50% - 0.125rem);\n  transform: translate(-50%, -50%) rotate(45deg);\n}\n[dir=rtl] .sx__chevron--next {\n  left: calc(50% + 0.125rem);\n  transform: translate(-50%, -50%) rotate(225deg);\n}\n\n.sx__date-picker-wrapper {\n  position: relative;\n  color: var(--sx-color-on-background);\n  width: fit-content;\n}\n.sx__date-picker-wrapper.has-full-width {\n  width: 100%;\n}\n.sx__date-picker-wrapper.is-disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.sx__date-picker-wrapper * {\n  color: var(--sx-color-on-background);\n  box-sizing: border-box;\n}\n\n.sx__date-input-wrapper {\n  position: relative;\n}\n\n.sx__date-input-chevron-wrapper {\n  position: absolute;\n  top: 50%;\n  right: 1rem;\n  transform: translateY(-50%);\n  display: flex;\n  align-items: center;\n  padding: 0;\n  transition: transform 0.2s ease-in-out;\n}\n.sx__date-input-chevron-wrapper:focus {\n  border: 2px solid var(--sx-color-primary);\n}\n.is-disabled .sx__date-input-chevron-wrapper {\n  pointer-events: none;\n  cursor: not-allowed;\n}\n.sx__date-input--active .sx__date-input-chevron-wrapper {\n  transform: translateY(-50%) rotate(180deg);\n}\n[dir=rtl] .sx__date-input-chevron-wrapper {\n  left: 1rem;\n  right: auto;\n}\n\n.sx__date-input-chevron {\n  width: 1rem;\n  height: 1rem;\n  pointer-events: none;\n  filter: brightness(0.7);\n}\n\n.sx__date-input {\n  font-size: 1rem;\n  padding: var(--sx-spacing-padding4);\n  border: var(--sx-border);\n  border-radius: var(--sx-rounding-extra-small);\n  cursor: pointer;\n  background-color: var(--sx-color-background);\n  width: 100%;\n}\n.is-disabled .sx__date-input {\n  pointer-events: none;\n}\n.sx__date-input--active .sx__date-input {\n  border-color: var(--sx-color-primary);\n  outline: 1px solid var(--sx-color-primary);\n}\n\n.sx__date-input-label {\n  position: absolute;\n  top: 0;\n  inset-inline-start: 12px;\n  padding: 0 var(--sx-spacing-padding1);\n  background-color: var(--sx-color-background);\n  font-size: 0.75rem;\n  color: var(--sx-color-neutral);\n  line-height: 1rem;\n  transform: translateY(-50%);\n  transition: transform 0.2s ease-in-out;\n  pointer-events: none;\n}\n.sx__date-input--active .sx__date-input-label {\n  color: var(--sx-color-primary);\n}\n.is-dark .sx__date-input-label {\n  display: none;\n}\n\n.sx__date-picker-popup {\n  position: absolute;\n  height: fit-content;\n  z-index: 1;\n  top: calc(100% + 1px);\n  width: 20.75rem;\n  max-width: 500px;\n  max-height: 400px;\n  overflow: scroll;\n  box-shadow: var(--sx-box-shadow-level3);\n  padding: var(--sx-spacing-modal-padding);\n  background-color: var(--sx-color-background);\n  color: var(--sx-internal-color-text);\n}\n.sx__date-picker-popup.is-dark {\n  background-color: var(--sx-color-surface-container-high);\n}\n.sx__date-picker-popup.bottom-end {\n  left: auto;\n  right: 0;\n  transform: translateX(0);\n}\n.sx__date-picker-popup.bottom-end[dir=rtl] {\n  right: auto;\n  left: 0;\n  transform: translateX(0);\n}\n.sx__date-picker-popup.bottom-start {\n  left: 0;\n  right: auto;\n  transform: translateX(0);\n}\n.sx__date-picker-popup.bottom-start[dir=rtl] {\n  left: auto;\n  right: 0;\n  transform: translateX(0);\n}\n.sx__date-picker-popup.top-start {\n  inset: auto auto calc(100% + 1rem) 0;\n  transform: translateX(0);\n}\n.sx__date-picker-popup.top-end {\n  inset: auto 0 calc(100% + 1rem) auto;\n  transform: translateX(0);\n}\n\n.sx__date-picker__years-view {\n  margin: 0;\n}\n\n.sx__date-picker__years-accordion__expand-button {\n  width: 100%;\n  border-radius: 0;\n  background-color: transparent;\n  font-size: 1rem;\n  padding: 1em;\n  transition: background-color 0.2s ease-in-out;\n  color: var(--sx-internal-color-text);\n}\n.sx__is-expanded .sx__date-picker__years-accordion__expand-button {\n  background-color: var(--sx-color-surface-container);\n}\n.sx__date-picker__years-accordion__expand-button:hover {\n  background-color: var(--sx-color-surface-dim);\n}\n.sx__date-picker__years-accordion__expand-button:active {\n  background-color: var(--sx-internal-color-gray-ripple-background);\n}\n\n.sx__date-picker__years-view-accordion__panel {\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.sx__date-picker__years-view-accordion__month {\n  flex: 1 0 33.3333%;\n  background-color: transparent;\n  border: 0;\n  font-size: 0.9rem;\n  padding: 0.5em 0;\n  border-radius: 25px;\n  color: var(--sx-internal-color-text);\n}\n.sx__date-picker__years-view-accordion__month:hover {\n  background-color: var(--sx-color-primary);\n  color: var(--sx-color-on-primary);\n}\n\n.sx__date-picker__day-names {\n  display: flex;\n  width: 100%;\n  justify-content: space-evenly;\n  margin-bottom: 0.5em;\n}\n.sx__date-picker__day-names .sx__date-picker__day,\n.sx__date-picker__day-names .sx__date-picker__day-name {\n  flex: 1;\n  text-align: center;\n}\n\n.sx__date-picker__day-name {\n  font-weight: 700;\n  color: var(--sx-color-neutral-variant);\n}\n\n.sx__date-picker__month-view-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 1em;\n}\n.sx__date-picker__month-view-header .sx__chevron-wrapper:hover {\n  background-color: var(--sx-color-surface-dim);\n}\n\n.sx__date-picker__month-view-header__month-year {\n  font-size: 1.5rem;\n  font-weight: 300;\n  color: var(--sx-internal-color-text);\n}\n.sx__date-picker__month-view-header__month-year:hover {\n  color: var(--sx-color-primary);\n  text-decoration: underline;\n}\n\n.sx__date-picker__week {\n  display: flex;\n  width: 100%;\n  justify-content: space-evenly;\n  margin-bottom: 0.5em;\n}\n.sx__date-picker__week .sx__date-picker__day,\n.sx__date-picker__week .sx__date-picker__day-name {\n  flex: 1;\n  text-align: center;\n}\n\n.sx__date-picker__day {\n  background-color: transparent;\n  border-radius: 50%;\n  width: 2.5rem;\n  height: 2.5rem;\n  color: var(--sx-internal-color-text);\n}\n.sx__date-picker__day:hover {\n  background-color: var(--sx-color-surface-dim);\n}\n.sx__date-picker__day:focus {\n  outline-offset: -2px;\n  outline: 2px solid var(--sx-color-primary);\n}\n.sx__date-picker__day:disabled {\n  color: var(--sx-color-neutral-variant);\n  cursor: not-allowed;\n}\n.sx__date-picker__day.is-leading-or-trailing {\n  color: var(--sx-color-neutral-variant);\n}\n.sx__date-picker__day.sx__date-picker__day--selected {\n  background-color: var(--sx-color-primary-container);\n  color: var(--sx-color-on-primary-container);\n}\n.sx__date-picker__day.sx__date-picker__day--today {\n  background-color: var(--sx-color-primary);\n  color: var(--sx-color-on-primary);\n}\n\n:root {\n  --sx-calendar-header-input-font-size: clamp(12px, 0.875rem, 28px);\n  --sx-calendar-week-grid-padding-left: 75px;\n}\n:root .sx__date-picker-popup.is-teleported {\n  z-index: 3;\n}\n\n.sx__calendar-wrapper {\n  height: 100%;\n  display: flex;\n  color: var(--sx-internal-color-text);\n}\n.sx__calendar-wrapper * {\n  box-sizing: border-box;\n}\n\n.sx__calendar {\n  position: relative;\n  flex: 1;\n  height: 100%;\n  border: var(--sx-border);\n  border-radius: var(--sx-rounding-small);\n  display: flex;\n  flex-flow: column;\n  background-color: var(--sx-color-background);\n  overflow: hidden;\n}\n\n.sx__view-container {\n  position: relative;\n  flex: 1;\n  overflow-y: auto;\n  scroll-behavior: smooth;\n}\n\n.sx__slide-left {\n  animation: sx-slide-left 0.3s ease-out;\n}\n\n@keyframes sx-slide-left {\n  0% {\n    transform: translateX(8%);\n    filter: blur(0.25rem);\n    opacity: 0.1;\n  }\n  100% {\n    transform: translateX(0);\n    filter: blur(0);\n    opacity: 1;\n  }\n}\n.sx__slide-right {\n  animation: sx-slide-right 0.3s ease-out;\n}\n\n@keyframes sx-slide-right {\n  0% {\n    transform: translateX(-8%);\n    filter: blur(0.25rem);\n    opacity: 0.1;\n  }\n  100% {\n    transform: translateX(0);\n    filter: blur(0);\n    opacity: 1;\n  }\n}\n.sx__calendar-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  padding: var(--sx-spacing-padding4);\n  gap: var(--sx-spacing-padding4);\n  flex-wrap: wrap;\n}\n.sx__calendar-header .sx__date-input {\n  padding: var(--sx-spacing-padding3) var(--sx-spacing-padding4);\n  font-size: var(--sx-calendar-header-input-font-size);\n}\n.sx__calendar-header .sx__date-picker-popup {\n  z-index: var(--sx-calendar-header-popup-z-index);\n}\n\n.sx__calendar-header-content {\n  display: flex;\n  align-items: center;\n  gap: var(--sx-spacing-padding4);\n  flex-wrap: wrap;\n  min-width: 0;\n}\n\n.sx__forward-backward-navigation {\n  height: 45px;\n}\n.sx__is-calendar-small .sx__forward-backward-navigation, .is-list-view .sx__forward-backward-navigation {\n  display: none;\n}\n\n.sx__calendar-header__week-number {\n  border-radius: 4px;\n  background-color: #eceef1;\n  color: var(--sx-color-on-surface);\n  padding: var(--sx-spacing-padding1) var(--sx-spacing-padding2);\n  font-size: 0.75rem;\n  font-weight: 500;\n}\n.is-dark .sx__calendar-header__week-number {\n  background-color: #4a4458;\n}\n\n.sx__range-heading {\n  font-size: clamp(16px, 1.25rem, 24px);\n  max-width: 12.5rem; /* 200px with a browser using standard font size */\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.sx__is-calendar-small .sx__range-heading {\n  font-size: 16px;\n}\n.is-list-view .sx__range-heading {\n  display: none;\n}\n\n.sx__today-button {\n  padding: var(--sx-spacing-padding3) var(--sx-spacing-padding4);\n  border-radius: var(--sx-rounding-extra-small);\n  font-size: var(--sx-calendar-header-input-font-size);\n  color: var(--sx-internal-color-text);\n}\n.sx__today-button:active {\n  background-color: var(--sx-internal-color-gray-ripple-background);\n}\n.sx__is-calendar-small .sx__today-button {\n  display: none;\n}\n.sx__calendar-header .sx__today-button {\n  border: var(--sx-border);\n}\n.sx__today-button:hover, .sx__today-button:focus {\n  background-color: var(--sx-internal-color-light-gray);\n}\n.is-dark .sx__today-button:hover, .is-dark .sx__today-button:focus {\n  background-color: var(--sx-color-surface-container-low);\n}\n\n.sx__view-selection {\n  position: relative;\n  font-size: var(--sx-calendar-header-input-font-size);\n}\n\n.sx__view-selection-label {\n  position: absolute;\n  top: 0;\n  inset-inline-start: 12px;\n  padding: 0 var(--sx-spacing-padding1);\n  background-color: var(--sx-color-background);\n  font-size: 0.75rem;\n  color: var(--sx-color-neutral);\n  line-height: 1rem;\n  transform: translateY(-50%);\n  transition: transform 0.2s ease-in-out;\n  pointer-events: none;\n  z-index: 1;\n}\n.is-dark .sx__view-selection-label {\n  display: none;\n}\n\n.sx__view-selection-selected-item {\n  background-color: inherit;\n  height: 100%;\n  width: fit-content;\n  padding: var(--sx-spacing-padding3) var(--sx-spacing-padding4);\n  cursor: pointer;\n  border-radius: var(--sx-rounding-extra-small);\n  border: var(--sx-border);\n  display: flex;\n  align-items: center;\n  gap: var(--sx-spacing-padding2);\n}\n.sx__view-selection-selected-item:hover {\n  background-color: var(--sx-internal-color-light-gray);\n}\n.is-dark .sx__view-selection-selected-item:hover {\n  background-color: var(--sx-color-surface-container-low);\n}\n\n.sx__view-selection-chevron {\n  width: 1rem;\n  height: 1rem;\n  pointer-events: none;\n  filter: brightness(0.7);\n  transition: transform 0.2s ease-in-out;\n}\n\n.sx__view-selection.is-open .sx__view-selection-chevron {\n  transform: rotate(180deg);\n}\n\n.sx__view-selection-items {\n  position: absolute;\n  top: 100%;\n  box-shadow: var(--sx-box-shadow-level3);\n  margin: 0;\n  background-color: var(--sx-color-background);\n  z-index: var(--sx-calendar-header-popup-z-index);\n}\n.is-dark .sx__view-selection-items {\n  background-color: var(--sx-color-surface-container-high);\n}\n\n.sx__view-selection-item {\n  display: block;\n  width: 100%;\n  text-align: inherit;\n  background-color: inherit;\n  padding: var(--sx-spacing-padding4) var(--sx-spacing-padding6);\n  cursor: pointer;\n}\n.sx__view-selection-item:hover, .sx__view-selection-item:focus {\n  background-color: var(--sx-color-primary);\n  color: var(--sx-color-on-primary);\n}\n.sx__view-selection-item.is-selected {\n  background-color: var(--sx-color-surface-dim);\n}\n.sx__view-selection-item.is-selected:hover, .sx__view-selection-item.is-selected:focus {\n  background-color: var(--sx-color-primary);\n  color: var(--sx-color-on-primary);\n}\n\n.sx__month-grid-wrapper {\n  display: flex;\n  flex-flow: column;\n  height: 100%;\n}\n\n.sx__month-grid-week__week-number {\n  display: flex;\n  justify-content: center;\n  padding-top: 12px;\n  background-color: #eceef1;\n  color: var(--sx-color-on-surface);\n  width: 1.5rem;\n  font-size: 0.75rem;\n}\n.is-dark .sx__month-grid-week__week-number {\n  background-color: #4a4458;\n}\n\n.sx__month-grid-week {\n  border-top: var(--sx-border);\n  flex: 1;\n  display: flex;\n}\n.sx__month-grid-week:first-child .sx__month-grid-week__week-number {\n  padding-top: 26px;\n}\n\n.sx__month-grid-day {\n  position: relative;\n  padding: var(--sx-spacing-padding2) 0;\n  flex: 1;\n}\n.sx__month-grid-day:not(:last-child) {\n  border-inline-end: var(--sx-border);\n}\n\n.sx__month-grid-day--dragover {\n  background-color: var(--sx-color-surface-container);\n}\n\n.sx__month-grid-day__header {\n  display: flex;\n  flex-flow: column;\n  align-items: center;\n}\n\n.sx__month-grid-day__header-day-name {\n  font-size: 11px;\n  text-transform: uppercase;\n  color: var(--sx-color-neutral);\n}\n\n.sx__month-grid-day__header-date {\n  font-size: var(--sx-font-extra-small);\n  margin-bottom: var(--sx-spacing-padding1);\n  border-radius: 50%;\n  height: 24px;\n  width: 24px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.sx__month-grid-day__header-date.sx__is-today {\n  background-color: var(--sx-color-primary);\n  color: var(--sx-color-on-primary);\n}\n\n.sx__month-grid-day__events-more {\n  width: calc(100% - 10px);\n  font-size: var(--sx-font-extra-small);\n  color: var(--sx-color-neutral);\n  margin: var(--sx-spacing-padding1) 0;\n  padding: var(--sx-spacing-padding1);\n  border-radius: var(--sx-rounding-extra-small);\n  cursor: pointer;\n  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;\n}\n.sx__month-grid-day__events-more:hover {\n  background-color: var(--sx-color-surface-container);\n  color: var(--sx-color-on-surface);\n}\n\n.sx__month-grid-background-event {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n}\n\n.sx__month-grid-day__events {\n  display: grid;\n  grid-gap: 4px;\n}\n\n.sx__month-grid-cell {\n  height: clamp(20px, 1.25rem, 24px);\n}\n\n.sx__month-grid-event {\n  position: relative;\n  display: flex;\n  align-items: center;\n  padding: var(--sx-spacing-padding1);\n  border-radius: var(--sx-rounding-extra-small);\n  font-size: clamp(12px, var(--sx-font-extra-small), 14px);\n  overflow: hidden;\n  white-space: nowrap;\n  z-index: 1;\n}\n.sx__month-grid-event.is-event-new {\n  animation: sx-grow-event 0.3s ease-in-out forwards;\n}\n@keyframes sx-grow-event {\n  0% {\n    transform: scale(0);\n    opacity: 0;\n  }\n  100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n\n.sx__month-grid-event-time {\n  margin-right: 4px;\n}\n\n.sx__month-grid-blocker {\n  pointer-events: none;\n}\n\n.sx__month-agenda-week {\n  display: flex;\n}\n.sx__month-agenda-week:not(:first-child) {\n  border-top: var(--sx-border);\n}\n\n.sx__month-agenda-week__week-number {\n  text-align: center;\n  background-color: #eceef1;\n  color: var(--sx-color-on-surface);\n  width: 1.5rem;\n  font-size: 0.75rem;\n  padding-top: 9px;\n}\n.is-dark .sx__month-agenda-week__week-number {\n  background-color: #4a4458;\n}\n\n.sx__month-agenda-day {\n  padding: var(--sx-spacing-padding2);\n  flex: 1;\n  display: flex;\n  flex-flow: column;\n  align-items: center;\n  height: 3rem;\n  border-radius: var(--sx-rounding-extra-small);\n  color: var(--sx-internal-color-text);\n}\n\n.sx__month-agenda-day--active {\n  box-shadow: inset 0 0 0 3px var(--sx-color-primary);\n}\n\n.sx__month-agenda-day__event-icons {\n  margin-top: 4px;\n  display: flex;\n  grid-gap: 3px;\n}\n\n.sx__month-agenda-day__event-icon {\n  height: 6px;\n  width: 6px;\n  border-radius: 50%;\n  filter: brightness(1.6);\n}\n.is-dark .sx__month-agenda-day__event-icon {\n  filter: initial;\n}\n\n.sx__month-agenda-day-names {\n  display: flex;\n  padding: var(--sx-spacing-padding2) 0;\n  font-size: var(--sx-font-extra-small);\n  color: var(--sx-color-neutral);\n}\n.sx__month-agenda-day-names.sx__has-week-numbers {\n  padding-inline-start: 1.5rem;\n}\n\n.sx__month-agenda-day-name {\n  flex: 1;\n  display: flex;\n  justify-content: center;\n}\n\n.sx__month-agenda-events {\n  padding: 0 var(--sx-spacing-padding2);\n}\n\n.sx__month-agenda-event {\n  padding: var(--sx-spacing-padding2);\n  margin-bottom: var(--sx-spacing-padding2);\n  border-radius: var(--sx-rounding-extra-small);\n  font-size: var(--sx-font-small);\n}\n.sx__month-agenda-event.is-event-new {\n  animation: sx-grow-event 0.3s ease-in-out forwards;\n}\n@keyframes sx-grow-event {\n  0% {\n    transform: scale(0);\n    opacity: 0;\n  }\n  100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n.sx__month-agenda-event:first-child {\n  margin-top: var(--sx-spacing-padding2);\n}\n\n.sx__month-agenda-event__title {\n  font-weight: 600;\n}\n\n.sx__month-agenda-event__has-icon {\n  display: flex;\n  align-items: center;\n}\n\n.sx__month-agenda-events__empty {\n  margin-top: var(--sx-spacing-padding4);\n  display: flex;\n  justify-content: center;\n}\n\n.sx__week-agenda-header {\n  position: sticky;\n  top: 0;\n  z-index: 1;\n  background-color: var(--sx-color-background);\n}\n\n.sx__week-wrapper {\n  position: relative;\n}\n\n.sx__week-grid {\n  position: relative;\n  padding-left: var(--sx-calendar-week-grid-padding-left);\n  display: flex;\n  height: var(--sx-week-grid-height);\n  overflow: hidden;\n}\n\n.sx__week-header {\n  position: sticky;\n  top: 0;\n  z-index: var(--sx-z-index-week-header);\n  background-color: var(--sx-color-background);\n}\n\n.sx__week-header-content {\n  position: relative;\n}\n\n.sx__week-header-border {\n  position: absolute;\n  width: 100%;\n  bottom: 0;\n  border-bottom: var(--sx-border);\n  border-left: 250px solid transparent;\n}\n\n.sx__list-wrapper {\n  padding: 0;\n  background-color: var(--sx-color-background);\n  height: 100%;\n  overflow-y: auto;\n  position: relative;\n  scroll-behavior: smooth;\n}\n\n.sx__list-day {\n  padding: 0;\n  background-color: var(--sx-color-background);\n  will-change: opacity;\n  transform: translateZ(0);\n}\n\n.sx__list-day-header {\n  padding: var(--sx-spacing-padding2) var(--sx-spacing-padding4);\n  background-color: var(--sx-color-surface-container-low);\n  position: sticky;\n  top: 0;\n  z-index: 1;\n}\n\n.sx__list-day-date {\n  font-size: var(--sx-font-extra-small);\n  font-weight: 600;\n  color: var(--sx-color-neutral);\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n\n.sx__list-day-events {\n  padding: 0 16px;\n  background: var(--sx-color-background);\n}\n\n.sx__list-event {\n  padding: 0.75rem 0;\n  display: flex;\n  align-items: flex-start;\n  gap: 0.75rem;\n}\n\n.sx__list-event:not(:first-child) {\n  border-top: var(--sx-border);\n}\n\n.sx__list-event-color-line {\n  width: 3px;\n  height: 24px;\n  border-radius: 2px;\n  flex-shrink: 0;\n}\n\n.sx__list-event-content {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  width: 100%;\n}\n\n.sx__list-event-title {\n  font-size: 1em;\n  color: var(--sx-color-on-background);\n  flex: 1;\n}\n\n.sx__list-event-times {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  min-width: 80px;\n  gap: 2px;\n}\n\n.sx__list-event-start-time {\n  font-size: 0.85em;\n  color: var(--sx-color-on-background);\n}\n\n.sx__list-event-end-time {\n  font-size: 0.85em;\n  color: var(--sx-color-neutral);\n}\n\n.sx__list-event-arrow {\n  font-size: 0.85em;\n  color: var(--sx-color-neutral);\n  line-height: 1;\n}\n\n.sx__list-event-all-day {\n  font-size: 0.85em;\n  color: var(--sx-color-neutral);\n}\n\n.sx__list-day-margin {\n  height: 16px;\n}\n\n.sx__list-no-events {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  color: var(--sx-color-neutral);\n  font-size: var(--sx-font-extra-small);\n  text-align: center;\n}\n\n.sx__week-grid__time-axis {\n  display: flex;\n  flex-flow: column;\n  position: absolute;\n  right: 0;\n  top: var(--sx-week-grid-offset-top);\n  width: calc(100% - 60px);\n}\n\n.sx__week-grid__hour {\n  position: relative;\n  height: var(--sx-week-grid-hour-height);\n  border-top: var(--sx-border);\n  font-size: var(--sx-font-extra-small);\n}\n.sx__week-grid__hour:first-child {\n  visibility: hidden;\n}\n\n.sx__week-grid__hour-text {\n  position: absolute;\n  left: -43px;\n  top: -0.75em;\n  color: var(--sx-color-neutral);\n}\n\n.sx__time-grid-day {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  border-left: var(--sx-border);\n}\n\n.sx__week-grid__date-axis {\n  padding-left: var(--sx-calendar-week-grid-padding-left);\n  display: flex;\n}\n\n.sx__week-grid__date {\n  flex: 1;\n  display: flex;\n  flex-flow: column;\n  align-items: center;\n  padding: var(--sx-spacing-padding3) 0;\n  gap: var(--sx-spacing-padding1);\n}\n\n.sx__week-grid__day-name {\n  text-transform: uppercase;\n  font-size: var(--sx-font-extra-small);\n  color: var(--sx-color-neutral);\n  font-weight: 500;\n}\n.sx__week-grid__date--is-today .sx__week-grid__day-name {\n  color: var(--sx-color-primary);\n  font-weight: 700;\n}\n\n.sx__week-grid__date-number {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: var(--sx-font-extra-large);\n  font-weight: 500;\n  color: var(--sx-color-neutral);\n  height: 2em;\n  width: 2em;\n}\n.sx__week-grid__date--is-today .sx__week-grid__date-number {\n  background-color: var(--sx-color-primary);\n  color: var(--sx-color-on-primary);\n  border-radius: 50%;\n}\n\n.sx__time-grid-event {\n  width: calc(100% - 10px);\n  padding: var(--sx-spacing-padding1);\n  position: absolute;\n  border-radius: var(--sx-rounding-extra-small);\n  font-size: var(--sx-font-extra-small);\n  overflow: hidden;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.sx__time-grid-event.is-event-copy {\n  opacity: 0.5;\n  box-shadow: var(--sx-box-shadow-level3);\n  z-index: 1;\n  transition: transform 0.15s ease-in-out;\n}\n.sx__time-grid-event.is-event-new {\n  animation: sx-grow-event 0.3s ease-in-out forwards;\n}\n@keyframes sx-grow-event {\n  0% {\n    transform: scale(0);\n    opacity: 0;\n  }\n  100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n\n[data-has-dnd=true] .sx__time-grid-event {\n  touch-action: none;\n}\n\n.sx__is-resizing .sx__time-grid-event:has(+ .is-event-copy) {\n  opacity: 0;\n}\n.sx__is-resizing .is-event-copy {\n  opacity: 1;\n}\n\n.sx__time-grid-event-inner {\n  position: relative;\n  height: 100%;\n}\n\n.sx__time-grid-event-resize-handle {\n  display: block;\n  position: absolute;\n  width: 100%;\n  bottom: 0;\n  cursor: ns-resize;\n  height: clamp(10px, 20px, 50%);\n  touch-action: none;\n}\n\n.sx__time-grid-event-title {\n  font-weight: 600;\n}\n\n.sx__time-grid-event-time,\n.sx__time-grid-event-people,\n.sx__time-grid-event-location {\n  display: flex;\n  align-items: center;\n  white-space: nowrap;\n}\n\n.sx__title-and-time-compact {\n  display: flex;\n  align-items: center;\n  gap: var(--sx-spacing-padding2);\n}\n.sx__title-and-time-compact .sx__time-grid-event-title {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.sx__title-and-time-compact .sx__time-grid-event-time {\n  flex-shrink: 0;\n}\n\n.sx__event-icon {\n  min-width: 15px;\n  min-height: 15px;\n  max-width: 15px;\n  max-height: 15px;\n  margin-inline-end: var(--sx-spacing-padding2);\n}\n\n.sx__date-grid {\n  display: flex;\n  padding-left: var(--sx-calendar-week-grid-padding-left);\n}\n\n.sx__date-grid-day {\n  position: relative;\n  width: 100%;\n  display: grid;\n  grid-gap: 2px;\n  /* needed for the draw plugin */\n}\n.sx__date-grid-day .sx__spacer {\n  display: var(--sx-draw-plugin-spacer-display, none);\n  height: var(--sx-draw-plugin-spacer);\n}\n\n.sx__date-grid-event {\n  z-index: 1;\n  position: relative;\n  display: flex;\n  align-items: center;\n  padding: var(--sx-spacing-padding1);\n  border-radius: var(--sx-rounding-extra-small);\n  font-size: clamp(12px, var(--sx-font-extra-small), 14px);\n  font-weight: 600;\n  user-select: none;\n}\n.sx__date-grid-event:has(.sx__date-grid-event--left-overflow) {\n  margin-left: 10px;\n}\n.sx__date-grid-event:has(.sx__date-grid-event--right-overflow) {\n  margin-right: 10px;\n}\n.sx__date-grid-event.is-event-new {\n  animation: sx-grow-event 0.3s ease-in-out forwards;\n}\n@keyframes sx-grow-event {\n  0% {\n    transform: scale(0);\n    opacity: 0;\n  }\n  100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n.sx__date-grid-event .sx__date-grid-event--left-overflow {\n  position: absolute;\n  z-index: 1;\n  width: 10px;\n  height: 100%;\n  left: -10px;\n  clip-path: polygon(100% 0, 0 50%, 100% 100%, 100% 0);\n}\n.sx__date-grid-event .sx__date-grid-event--right-overflow {\n  position: absolute;\n  z-index: 1;\n  width: 10px;\n  height: 100%;\n  right: -10px;\n  clip-path: polygon(0 0, 100% 50%, 0 100%, 0 0);\n}\n.sx__date-grid-event.sx__date-grid-event--copy {\n  z-index: 2;\n  box-shadow: var(--sx-box-shadow-level3);\n  transition-property: transform, width;\n  transition-duration: 0.15s;\n  transition-timing-function: ease-in-out;\n}\n\n.sx__date-grid-event-text {\n  width: calc(100% - var(--sx-spacing-padding1) * 2);\n  left: var(--sx-spacing-padding1);\n  position: absolute;\n  text-overflow: ellipsis;\n  overflow-x: hidden;\n  white-space: nowrap;\n}\n.sx__date-grid-event-text .sx__date-grid-event-time {\n  font-weight: initial;\n}\n\n.sx__date-grid-cell {\n  height: clamp(20px, 1.25rem, 24px);\n}\n\n.sx__date-grid-event-resize-handle {\n  position: absolute;\n  right: 0;\n  height: 100%;\n  width: clamp(10px, 15px, 50%);\n  cursor: ew-resize;\n  z-index: 1;\n  touch-action: none;\n}\n[dir=rtl] .sx__date-grid-event-resize-handle {\n  left: 0;\n  right: auto;\n}\n\n.sx__date-grid-background-event {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  top: 0;\n  left: 0;\n  z-index: -1;\n}\n\n:root {\n  --sx-week-grid-height: 0;\n  --sx-time-axis-height: 0;\n  --sx-week-grid-hour-height: 0;\n  --sx-week-grid-offset-top: 0;\n}\n\n.sx__event-modal {\n  visibility: hidden;\n  position: fixed;\n  top: var(--sx-event-modal-top);\n  left: var(--sx-event-modal-left);\n  width: 400px;\n  max-width: 100%;\n  height: fit-content;\n  background-color: var(--sx-color-background);\n  z-index: var(--sx-z-index-event-modal);\n}\n.sx__event-modal.is-open {\n  animation: slide-sideways;\n  animation-duration: 0.3s;\n  visibility: initial;\n}\n.is-dark .sx__event-modal {\n  background-color: var(--sx-color-surface-container-high);\n}\n\n.sx__event-modal-default {\n  padding: var(--sx-spacing-padding6);\n  background-color: var(--sx-color-background);\n  box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2);\n  border-radius: var(--sx-rounding-small);\n  max-height: 250px;\n  overflow-y: scroll;\n}\n\n@keyframes slide-sideways {\n  from {\n    opacity: 0;\n    transform: translateX(var(--sx-event-modal-animation-start));\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n.sx__event-modal .sx__event-icon {\n  min-width: 16px;\n  min-height: 16px;\n  max-width: 16px;\n  max-height: 16px;\n  margin-inline-end: var(--sx-spacing-padding2);\n}\n\n.sx__event-modal__color-icon {\n  display: inline-block;\n  width: 16px;\n  height: 16px;\n  border-radius: 25%;\n  margin-inline-end: var(--sx-spacing-padding3);\n}\n\n.sx__has-icon {\n  display: grid;\n  align-items: flex-start;\n  grid-template-columns: 30px 1fr;\n  margin-bottom: var(--sx-spacing-padding2);\n}\n.sx__has-icon .sx__event-icon {\n  margin-top: 2px;\n}\n.sx__has-icon .sx__event-modal__color-icon {\n  margin-top: 4px;\n}\n\n.sx__event-modal__title {\n  font-size: var(--sx-font-large);\n}\n\n.sx__event-modal__time {\n  font-size: var(--sx-font-small);\n}\n\n.sx__current-time-indicator {\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: 2px;\n  background-color: #f00;\n  z-index: 0;\n}\n.sx__current-time-indicator::before {\n  content: \"\";\n  position: absolute;\n  left: -5px;\n  top: -4px;\n  width: 10px;\n  height: 10px;\n  border-radius: 50%;\n  background-color: #f00;\n}\n\n.sx__current-time-indicator-full-week {\n  width: calc(100% - var(--sx-calendar-week-grid-padding-left));\n  position: absolute;\n  inset: 0 0 0 var(--sx-calendar-week-grid-padding-left);\n  height: 2px;\n  background-color: rgba(255, 0, 0, 0.38);\n}\n";
	const tagId$1 = "dsh-powerdesk/index.css";
	if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
		const tag = document.createElement("style");
		tag.dataset.plugin = "dsh-powerdesk";
		tag.dataset.pluginCss = tagId$1;
		tag.textContent = css$1;
		document.head.appendChild(tag);
	}
	//#endregion
	//#region src/client/api.ts
	/**
	* Typed fetch wrapper over the /restty JSON API and the WebSocket URL builders.
	* Every call posts to `/powerdesk/api/<method>` with the sessionId (and the
	* session's cwd when known). Failures surface as {@link ResttyApiError} with
	* the wire code.
	*/
	/** One wire failure. */
	var ResttyApiError = class extends Error {
		code;
		constructor(code, message) {
			super(message);
			this.code = code;
		}
	};
	async function call(method, payload, signal) {
		let response;
		try {
			response = await fetch(`/powerdesk/api/${method}`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(payload),
				signal
			});
		} catch (error) {
			throw new ResttyApiError("network", error instanceof Error ? error.message : String(error));
		}
		const parsed = await response.json().catch(() => null);
		if (!response.ok || parsed === null || parsed.ok !== true || parsed.value === void 0) throw new ResttyApiError(parsed?.error?.code ?? "http", parsed?.error?.message ?? `HTTP ${response.status}`);
		return parsed.value;
	}
	/** Fold a scope into a JSON payload ({cwd} only when present). */
	function scopePayload(scope, extra) {
		return {
			sessionId: scope.sessionId,
			...scope.cwd !== void 0 && scope.cwd !== "" ? { cwd: scope.cwd } : {},
			...extra
		};
	}
	/** The restty API surface (session scope threaded through every call). */
	const api = {
		/** Resolve the session's authoritative cwd (used by the standalone panel
		*  when the client list summary has no cwd). */
		sessionCwd: (scope, signal) => call("session.cwd", scopePayload(scope, {}), signal),
		/** Release a terminal's process immediately (tab closed while the WS was
		*  down; the close frame may be unreachable, so the host also accepts this
		*  explicit route). */
		ptyClose: (scope, tab) => call("pty.close", scopePayload(scope, { tab })),
		/** Native pty dependency status: after a WS close 1011 with reason
		*  `powerdesk-pty-deps-missing` the view fetches the full repair details here. */
		terminalDeps: () => call("terminal.deps", {}),
		/** Probe a URL's response headers (the browser tab's embeddability check;
		*  see the host's browser.probe route). Returns whether the target site
		*  forbids being embedded (X-Frame-Options / frame-ancestors). */
		browserProbe: (url, signal) => call("browser.probe", { url }, signal),
		/** List one directory's immediate children (Explorer tab). */
		fsList: (path, signal) => call("fs.list", { path }, signal),
		/** Read one file's content, capped server-side at a few MB (Editor tab). */
		fsRead: (path, signal) => call("fs.read", { path }, signal),
		/** Overwrite one file's content (Editor tab save). */
		fsWrite: (path, content) => call("fs.write", {
			path,
			content
		}),
		/** Create a NEW empty file; fails if it already exists (Notes "new note"). */
		fsCreate: (path) => call("fs.create", { path }),
		/** Create a directory, including missing parents (Notes "new folder"). */
		fsMkdir: (path) => call("fs.mkdir", { path }),
		/** Rename/move a file or folder (Notes rename). */
		fsRename: (from, to) => call("fs.rename", {
			from,
			to
		}),
		/** Delete a file or folder, recursively (Notes delete). */
		fsDelete: (path) => call("fs.delete", { path }),
		/** The recursive `.md` tree over a bound folder (Notes tab). */
		fsListMarkdownTree: (path, signal) => call("fs.listMarkdownTree", { path }, signal),
		/** The host's home directory (the folder-picker modal's starting point). */
		fsHome: (signal) => call("fs.home", {}, signal),
		/** Content search over a directory via ripgrep (Search tab). `options` are
		*  the search box's modifier toggles ("Aa" / "ab" / ".*"). */
		searchGrep: (path, query, options, signal) => call("search.grep", {
			path,
			query,
			...options
		}, signal),
		/** Ripgrep dependency status: fetched when the Search tab needs to show a
		*  repair banner (no `/powerdesk/ws/*` upgrade to close-marker off of here
		*  — search is a plain buffered POST, so the client just checks this
		*  directly rather than reacting to a socket close). */
		searchDeps: (signal) => call("search.deps", {}, signal),
		/** List all calendar events, earliest first (Calendar tab). */
		calendarList: (signal) => call("calendar.list", {}, signal),
		/** Create a calendar event (Calendar tab). Returns the created event. */
		calendarCreate: (event, signal) => call("calendar.create", { ...event }, signal),
		/** Update a calendar event by id (Calendar tab). Returns the changed-row count. */
		calendarUpdate: (event, signal) => call("calendar.update", { ...event }, signal),
		/** Delete a calendar event by id (Calendar tab). Returns the changed-row count. */
		calendarDelete: (id, signal) => call("calendar.delete", { id }, signal),
		/** SQLite native-binary dependency status: fetched when the Calendar tab
		*  needs to show a repair banner (same pattern as searchDeps). */
		calendarDeps: (signal) => call("calendar.deps", {}, signal),
		/** Installed extensions plus the config gate (answers even when disabled,
		*  so the settings card can explain why nothing loads). */
		extList: (signal) => call("ext.list", {}, signal),
		/** Install an uploaded archive. `id`/`title` are only consulted when the
		*  upload turns out to be a bare script with no manifest of its own. */
		extInstall: (upload) => call("ext.install", { ...upload }),
		/** Uninstall one extension (removing an absent id is a no-op). */
		extRemove: (id) => call("ext.remove", { id })
	};
	//#endregion
	//#region src/client/theme.ts
	/**
	* Live theme access for the restty terminal surface. restty themes are set
	* at construction; this module reads the resolved scheme and token values so
	* {@link ./ResttyTerminal.tsx} can pick a builtin restty theme that matches
	* the app's scheme and override its surface colors from the DSH tokens, and
	* re-theme on a scheme flip. Mirrors dsh-better-sidebar's theme helpers
	* (behavioral copy — the app's scheme flips via a body attribute).
	*/
	/** Whether the app shell resolved to the dark scheme. */
	function isDarkScheme() {
		if (typeof document === "undefined") return true;
		if (document.documentElement.style.colorScheme !== "") return document.body.hasAttribute("data-ds-dark-theme");
		return typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches;
	}
	/** Subscribe to color-scheme flips (the presenter toggles the body attribute). */
	function subscribeColorScheme(callback) {
		if (typeof document === "undefined") return () => {};
		const observer = new MutationObserver(() => {
			callback();
		});
		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ["data-ds-dark-theme"]
		});
		return () => {
			observer.disconnect();
		};
	}
	//#endregion
	//#region src/client/locales.ts
	const en = {
		tabTitle: "Terminal",
		terminal: "Terminal",
		loading: "Loading…",
		disconnected: "Disconnected. Reconnecting…",
		terminalError: "Terminal error",
		terminalRetry: "Retry",
		terminalConnectFailed: "Could not connect to the terminal",
		terminalDepsFailed: "Native PTY unavailable",
		terminalDepsHint: "The Rust PTY native module failed to load. Run the repair command where your DSH profile lives, then retry:",
		terminalDepsProfile: " (profile: {profile})",
		copy: "Copy",
		copied: "Copied",
		standaloneToggle: "Toggle terminal",
		close: "Close",
		newTab: "New tab",
		newPane: "New page",
		newPaneHeading: "Start a new page",
		newPaneSubheading: "Pick a tool to open in this pane",
		cardTerminalDesc: "Run commands in an embedded terminal",
		cardExplorerDesc: "Browse and open files in the workspace",
		cardNotesDesc: "Write and keep scratch notes",
		cardBrowserDesc: "Open a web page in a preview browser",
		cardLayoutLabel: "Layout",
		layoutHorizontal: "Side by side (horizontal split)",
		layoutVertical: "Stacked (vertical split)",
		closePane: "Close pane",
		searchTabTitle: "Search",
		searchPlaceholder: "Search",
		searchNoResults: "No results",
		searchNoQuery: "Type to search file contents",
		searchResultsSummary: "{matches} results in {files} files",
		searchTruncated: " (showing the first {matches})",
		searchDepsFailed: "ripgrep unavailable",
		searchDepsHint: "ripgrep could not be located. Run the repair command where your DSH profile lives, then retry:",
		calendarTabTitle: "Calendar",
		calendarDepsFailed: "SQLite unavailable",
		calendarDepsHint: "The Rust SQLite native module failed to load. Run the repair command where your DSH profile lives, then retry:",
		calendarNewEvent: "New event",
		calendarNewEventPrompt: "Event title:",
		calendarUntitledEvent: "Untitled event",
		calendarDeleteConfirm: "Delete \"{title}\"?",
		searchMatchCase: "Match Case",
		searchWholeWord: "Match Whole Word",
		searchUseRegex: "Use Regular Expression",
		collapse: "Collapse sidebar",
		expand: "Expand sidebar",
		collapseBottom: "Collapse bottom panel",
		expandBottom: "Expand bottom panel",
		standaloneNoSession: "No active session. Open a conversation to use the terminal.",
		settingsFontFamilyTitle: "Font family",
		settingsFontFamilyDesc: "Custom font for the terminal (empty = theme code font)",
		settingsFontFamilyPlaceholder: "e.g. \"JetBrains Mono\", monospace",
		settingsFontSizeTitle: "Font size",
		settingsFontSizeDesc: "Terminal font size in pixels",
		settingsBackendTitle: "PTY backend",
		settingsBackendDesc: "own = the Rust /powerdesk/ws/terminal; better-sidebar = reuse dsh-better-sidebar's terminal backend",
		settingsThemeTitle: "Theme",
		settingsThemeDesc: "Builtin restty theme name (empty = follow the app scheme)",
		browser: "Browser",
		browserTabTitle: "Browser",
		browserPlaceholder: "Enter a URL, e.g. example.com",
		browserGo: "Go",
		browserBack: "Back",
		browserForward: "Forward",
		refresh: "Refresh",
		browserStart: "Enter a URL to start browsing (sandbox mode)",
		browserChecking: "Checking if this site can be embedded…",
		browserBlockedScheme: "Blocked: only http/https URLs are allowed",
		browserBlockedLoopback: "Blocked: local and internal addresses cannot be browsed here",
		browserInvalid: "Invalid URL",
		browserOpenExternal: "Open in browser",
		browserNoSandboxWarning: "Sandbox off: the current page runs with full GUI privileges (re-enable in settings)",
		browserEmbedBlocked: "{host} refused to be embedded",
		browserEmbedBlockedDesc: "This site forbids being displayed inside other pages (X-Frame-Options / frame-ancestors), so it cannot load in the sidebar. Open it in your browser instead.",
		browserEmbedAnyway: "Load anyway",
		sandboxStatusOn: "Sandbox on: pages cannot access the GUI's data or local files; logins and third-party cookies may not work",
		sandboxUnlock: "Unlock (unsafe)",
		sandboxRestore: "Restore sandbox",
		standaloneToggleBrowser: "Toggle browser",
		standaloneSurfaceTerminal: "Terminal",
		standaloneSurfaceBrowser: "Browser",
		settingsNav: "Powerdesk",
		settingsIntro: "A GPU-accelerated terminal and a sandboxed browser for DSH, surfaced as tabs in the Powerdesk sidebar.",
		settingsOpenTerminal: "Open Terminal",
		settingsOpenBrowser: "Open Browser",
		settingsSidebarMissing: "The Powerdesk sidebar is available via the toggle at the top-right corner of the window.",
		settingsOpenedHint: "Opened in the sidebar.",
		settingsEnableTab: "Enable this tab",
		settingsDisableTab: "Disable this tab",
		extHeading: "Extensions",
		extIntro: "Install your own React components as sidebar tabs. Upload a .tgz containing powerdesk.json and bundle.js, or a single bundle script.",
		extDisabled: "Extensions are turned off. Set \"extensionsEnabled\": true in the dsh-powerdesk plugin config to enable them.",
		extStaleHost: "The running DSH server does not have the extensions API. Its host half predates this feature — restart DSH (the client half updates on refresh, but the server keeps the old code in memory until it restarts).",
		extUnreachable: "Could not reach the extensions API: {error}",
		extWarning: "An extension runs with the same privileges as this page — full access to the DOM, your session, and the network. Only install extensions you trust.",
		extEmpty: "No extensions installed yet.",
		extUpload: "Upload extension…",
		extInstalling: "Installing…",
		extRemove: "Remove",
		extRemoveConfirm: "Remove this extension? Its files are deleted from disk.",
		extReload: "Reload",
		extBroken: "Failed to load",
		extInstalled: "Installed {when}",
		extSource: "from {file}",
		extDir: "Location",
		extIdLabel: "Extension id",
		extIdPlaceholder: "my-extension",
		extTitleLabel: "Display name",
		extTitlePlaceholder: "My Extension",
		extBareHint: "This file is a single script with no powerdesk.json. Give it an id and a name.",
		extConfirmInstall: "Install",
		extCancel: "Cancel",
		extInstalledOk: "Installed \"{title}\". Open it from the sidebar + menu.",
		appearanceHeading: "Appearance",
		appearanceIntro: "Pick a font, weight, size, and themes for the terminal and the code editor. Terminal changes apply immediately to any open terminal (a brief reconnect, same session); the editor theme applies to any open editor.",
		appearanceFontFamily: "Font",
		appearanceFontFamilyAuto: "System default",
		appearanceFontFamilyManual: "Type a font name…",
		appearanceFontsLoading: "Loading fonts…",
		appearanceFontWeight: "Weight",
		appearanceFontSize: "Size",
		appearanceTheme: "Terminal theme",
		appearanceEditorTheme: "Codemirror theme",
		appearanceFontHint: "Lists your installed system fonts (incl. Nerd Fonts). On browsers without the Local Font Access API (Firefox/Safari), type the family name instead.",
		appearanceThemeHint: "“System default” follows light/dark.",
		themeAuto: "System default",
		themeTokyoNight: "Tokyo Night",
		themeTokyoNightStorm: "Tokyo Night Storm",
		themeTokyoNightMoon: "Tokyo Night Moon",
		themeDracula: "Dracula",
		themeDraculaPlus: "Dracula+",
		themeHighContrast: "High contrast",
		themeNord: "Nord",
		themeGruvbox: "Gruvbox",
		themeCatppuccinMocha: "Catppuccin Mocha",
		themeGithubDark: "GitHub Dark",
		themeGithubLight: "GitHub Light",
		themeOneDark: "One Dark",
		themeSolarizedDark: "Solarized Dark",
		themeSolarizedLight: "Solarized Light",
		themeRosePine: "Rosé Pine",
		explorerTabTitle: "Explorer",
		explorerAddFolder: "Add folder",
		explorerRemoveFolder: "Remove",
		explorerEmptyDir: "Empty folder",
		explorerCopyRelative: "Copy relative path",
		explorerCopyAbsolute: "Copy absolute path",
		explorerCopied: "Copied",
		editorTabTitle: "Editor",
		editorUnsaved: "Unsaved",
		notesTabTitle: "Notes",
		notesBindPrompt: "Bind a local folder to browse and edit its markdown notes.",
		notesBindButton: "Bind folder",
		notesRebindHint: "{folder} — click to choose a different folder",
		notesNewNote: "New note",
		notesNewFolder: "New folder",
		notesNewNotePrompt: "Note name (.md added automatically)",
		notesNewFolderPrompt: "Folder name",
		notesRenamePrompt: "New name",
		notesRename: "Rename",
		notesDelete: "Delete",
		notesDeleteConfirm: "Delete \"{name}\"? This cannot be undone.",
		notesEmptyFolder: "No markdown files in this folder yet — create one with \"New note\".",
		notesSelectFile: "Select a note to view or edit it.",
		cancel: "Cancel",
		folderPickerTitle: "Choose a folder",
		folderPickerSelect: "Select this folder",
		folderPickerUp: "Up",
		folderPickerEmpty: "No subfolders here"
	};
	const dicts = {
		en,
		zh: {
			tabTitle: "终端",
			terminal: "终端",
			loading: "加载中…",
			disconnected: "已断开，正在重连…",
			terminalError: "终端错误",
			terminalRetry: "重试",
			terminalConnectFailed: "无法连接到终端",
			terminalDepsFailed: "原生 PTY 不可用",
			terminalDepsHint: "Rust PTY 原生模块加载失败。请在 DSH profile 所在环境运行修复命令，然后重试：",
			terminalDepsProfile: "（profile：{profile}）",
			copy: "复制",
			copied: "已复制",
			standaloneToggle: "切换终端",
			close: "关闭",
			newTab: "新建标签页",
			newPane: "新建页面",
			newPaneHeading: "开启新页面",
			newPaneSubheading: "选择要在该面板打开的工具",
			cardTerminalDesc: "在嵌入式终端中运行命令",
			cardExplorerDesc: "浏览并打开工作区文件",
			cardNotesDesc: "撰写和保存随手笔记",
			cardBrowserDesc: "在预览浏览器中打开网页",
			cardLayoutLabel: "布局",
			layoutHorizontal: "并排显示（水平分割）",
			layoutVertical: "上下堆叠（垂直分割）",
			closePane: "关闭面板",
			searchTabTitle: "搜索",
			searchPlaceholder: "搜索",
			searchNoResults: "无结果",
			searchNoQuery: "输入以搜索文件内容",
			searchResultsSummary: "在 {files} 个文件中找到 {matches} 处结果",
			searchTruncated: "（仅显示前 {matches} 处）",
			searchDepsFailed: "ripgrep 不可用",
			searchDepsHint: "未能找到 ripgrep。请在 DSH profile 所在环境运行修复命令，然后重试：",
			calendarTabTitle: "日历",
			calendarDepsFailed: "SQLite 不可用",
			calendarDepsHint: "Rust SQLite 原生模块加载失败。请在 DSH profile 所在环境运行修复命令，然后重试：",
			calendarNewEvent: "新建事件",
			calendarNewEventPrompt: "事件标题：",
			calendarUntitledEvent: "未命名事件",
			calendarDeleteConfirm: "删除「{title}」？",
			searchMatchCase: "区分大小写",
			searchWholeWord: "全字匹配",
			searchUseRegex: "使用正则表达式",
			collapse: "收起侧边栏",
			expand: "展开侧边栏",
			collapseBottom: "收起底部面板",
			expandBottom: "展开底部面板",
			standaloneNoSession: "没有活动会话。请先打开一个对话再使用终端。",
			settingsFontFamilyTitle: "字体",
			settingsFontFamilyDesc: "终端自定义字体（留空 = 主题代码字体）",
			settingsFontFamilyPlaceholder: "例如 \"JetBrains Mono\", monospace",
			settingsFontSizeTitle: "字号",
			settingsFontSizeDesc: "终端字号（像素）",
			settingsBackendTitle: "PTY 后端",
			settingsBackendDesc: "own = Rust /powerdesk/ws/terminal；better-sidebar = 复用 dsh-better-sidebar 终端后端",
			settingsThemeTitle: "主题",
			settingsThemeDesc: "内置 restty 主题名（留空 = 跟随应用明暗）",
			browser: "浏览器",
			browserTabTitle: "浏览器",
			browserPlaceholder: "输入网址，例如 example.com",
			browserGo: "前往",
			browserBack: "后退",
			browserForward: "前进",
			refresh: "刷新",
			browserStart: "输入网址开始浏览（沙箱模式）",
			browserChecking: "正在检查该站点是否可嵌入…",
			browserBlockedScheme: "已阻止：仅支持 http/https 链接",
			browserBlockedLoopback: "已阻止：不允许在浏览器中访问本机或内部地址",
			browserInvalid: "无效的网址",
			browserOpenExternal: "在浏览器中打开",
			browserNoSandboxWarning: "沙箱已关闭：当前页面与界面同源，拥有完整会话权限（可在设置中恢复）",
			browserEmbedBlocked: "{host} 拒绝了嵌入请求",
			browserEmbedBlockedDesc: "该站点通过 X-Frame-Options / frame-ancestors 禁止在其它页面中显示，无法在侧边栏内加载。可在浏览器中直接打开",
			browserEmbedAnyway: "仍然加载",
			sandboxStatusOn: "沙箱模式：已启用 · 页面无法访问界面数据与本地文件，登录态与第三方 Cookie 可能不可用",
			sandboxUnlock: "临时解锁（不安全）",
			sandboxRestore: "恢复沙箱",
			standaloneToggleBrowser: "切换浏览器",
			standaloneSurfaceTerminal: "终端",
			standaloneSurfaceBrowser: "浏览器",
			settingsNav: "Powerdesk",
			settingsIntro: "面向 DSH 的 GPU 加速终端与沙箱浏览器，以标签页形式在 Powerdesk 侧边栏中打开。",
			settingsOpenTerminal: "打开终端",
			settingsOpenBrowser: "打开浏览器",
			settingsSidebarMissing: "Powerdesk 侧边栏可通过窗口右上角的切换按钮打开。",
			settingsOpenedHint: "已在侧边栏打开。",
			settingsEnableTab: "启用此标签页",
			settingsDisableTab: "禁用此标签页",
			extHeading: "扩展",
			extIntro: "将你自己的 React 组件安装为侧边栏标签页。上传包含 powerdesk.json 与 bundle.js 的 .tgz，或单个打包脚本。",
			extDisabled: "扩展功能已关闭。在 dsh-powerdesk 插件配置中设置 \"extensionsEnabled\": true 以启用。",
			extStaleHost: "当前运行的 DSH 服务没有扩展 API，其宿主端代码早于此功能——请重启 DSH（客户端会在刷新时更新，但服务端在重启前仍保留旧代码）。",
			extUnreachable: "无法访问扩展 API：{error}",
			extWarning: "扩展与本页面拥有相同权限——可完全访问 DOM、你的会话与网络。请只安装你信任的扩展。",
			extEmpty: "尚未安装任何扩展。",
			extUpload: "上传扩展…",
			extInstalling: "正在安装…",
			extRemove: "移除",
			extRemoveConfirm: "确定移除此扩展？其文件将从磁盘删除。",
			extReload: "重新加载",
			extBroken: "加载失败",
			extInstalled: "安装于 {when}",
			extSource: "来源 {file}",
			extDir: "位置",
			extIdLabel: "扩展 ID",
			extIdPlaceholder: "my-extension",
			extTitleLabel: "显示名称",
			extTitlePlaceholder: "我的扩展",
			extBareHint: "此文件是单个脚本，不含 powerdesk.json。请为其指定 ID 与名称。",
			extConfirmInstall: "安装",
			extCancel: "取消",
			extInstalledOk: "已安装“{title}”。可从侧边栏 + 菜单打开。",
			appearanceHeading: "外观",
			appearanceIntro: "选择终端与代码编辑器的字体、字重、字号与主题。终端更改会立即应用到已打开的终端（短暂重连，同一会话）；编辑器主题更改会立即应用到已打开的编辑器。",
			appearanceFontFamily: "字体",
			appearanceFontFamilyAuto: "系统默认",
			appearanceFontFamilyManual: "输入字体名…",
			appearanceFontsLoading: "正在加载字体…",
			appearanceFontWeight: "字重",
			appearanceFontSize: "字号",
			appearanceTheme: "终端主题",
			appearanceEditorTheme: "Codemirror 主题",
			appearanceFontHint: "列出你系统中已安装的字体（含 Nerd Fonts）。在不支持本地字体访问 API 的浏览器（Firefox/Safari）上，请改为手动输入字体名。",
			appearanceThemeHint: "“系统默认”跟随明暗模式。",
			themeAuto: "系统默认",
			themeTokyoNight: "Tokyo Night",
			themeTokyoNightStorm: "Tokyo Night Storm",
			themeTokyoNightMoon: "Tokyo Night Moon",
			themeDracula: "Dracula",
			themeDraculaPlus: "Dracula+",
			themeHighContrast: "高对比度",
			themeNord: "Nord",
			themeGruvbox: "Gruvbox",
			themeCatppuccinMocha: "Catppuccin Mocha",
			themeGithubDark: "GitHub Dark",
			themeGithubLight: "GitHub Light",
			themeOneDark: "One Dark",
			themeSolarizedDark: "Solarized Dark",
			themeSolarizedLight: "Solarized Light",
			themeRosePine: "Rosé Pine",
			explorerTabTitle: "文件",
			explorerAddFolder: "添加文件夹",
			explorerRemoveFolder: "移除",
			explorerEmptyDir: "空文件夹",
			explorerCopyRelative: "复制相对路径",
			explorerCopyAbsolute: "复制绝对路径",
			explorerCopied: "已复制",
			editorTabTitle: "编辑器",
			editorUnsaved: "未保存",
			notesTabTitle: "笔记",
			notesBindPrompt: "绑定一个本地文件夹，浏览和编辑其中的 markdown 笔记。",
			notesBindButton: "绑定文件夹",
			notesRebindHint: "{folder} — 点击选择其他文件夹",
			notesNewNote: "新建笔记",
			notesNewFolder: "新建文件夹",
			notesNewNotePrompt: "笔记名称（自动加 .md 后缀）",
			notesNewFolderPrompt: "文件夹名称",
			notesRenamePrompt: "新名称",
			notesRename: "重命名",
			notesDelete: "删除",
			notesDeleteConfirm: "删除 \"{name}\"？此操作不可撤销。",
			notesEmptyFolder: "此文件夹里还没有 markdown 文件——点\"新建笔记\"创建一个。",
			notesSelectFile: "选择一篇笔记查看或编辑。",
			cancel: "取消",
			folderPickerTitle: "选择文件夹",
			folderPickerSelect: "选择这个文件夹",
			folderPickerUp: "上一级",
			folderPickerEmpty: "没有子文件夹"
		}
	};
	/** The active locale ('en' by default; updated by {@link attachLocale}). */
	let activeLocale = "en";
	/** Resolve the active dictionary (falls back to English). */
	function activeDict() {
		return dicts[activeLocale] ?? en;
	}
	/** Translate one key, substituting `{param}` placeholders. */
	function t(key, params) {
		const raw = activeDict()[key] ?? en[key] ?? key;
		if (params === void 0) return raw;
		return raw.replace(/\{(\w+)\}/g, (_m, name) => params[name] ?? `{${name}}`);
	}
	//#endregion
	//#region \0dsh-css:/home/zteng/work/Tools/dsh-powerdesk/src/client/sidebar.module.css.mjs
	const css = ".Kvd2vq_toggleCluster{z-index:45;flex-direction:row;gap:4px;display:flex;position:fixed;top:3px;right:10px}.Kvd2vq_panel:not(.Kvd2vq_panelHidden) .Kvd2vq_tabBar{padding-right:72px}.Kvd2vq_toggleButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out), color var(--ds-transition-duration-slow) var(--ds-ease-in-out);background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;display:flex}.Kvd2vq_toggleButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_toggleButton:disabled{opacity:.4;cursor:default}.Kvd2vq_panel{z-index:41;background:var(--dsw-alias-bg-layer-1);border-left:1px solid var(--dsw-alias-border-l2);transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), width var(--ds-transition-duration-slow) var(--ds-ease-in-out);flex-direction:column;display:flex;position:fixed;top:0;bottom:0;right:0}.Kvd2vq_panelHidden{pointer-events:none;visibility:hidden;transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), width var(--ds-transition-duration-slow) var(--ds-ease-in-out), visibility 0s linear var(--ds-transition-duration-slow);transform:translate(102%)}.Kvd2vq_panel[data-dragging]{transition:none}.Kvd2vq_panelResize{cursor:col-resize;z-index:2;touch-action:none;width:8px;position:absolute;top:0;bottom:0;left:-4px}.Kvd2vq_panelResizeActive{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_panelBody{flex:1;min-width:0;min-height:0;display:flex}.Kvd2vq_bottomPanel{z-index:40;background:var(--dsw-alias-bg-layer-1);border-top:1px solid var(--dsw-alias-border-l2);transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), height var(--ds-transition-duration-slow) var(--ds-ease-in-out);flex-direction:column;display:flex;position:fixed;bottom:0;right:0}.Kvd2vq_bottomPanelHidden{pointer-events:none;visibility:hidden;transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), height var(--ds-transition-duration-slow) var(--ds-ease-in-out), visibility 0s linear var(--ds-transition-duration-slow);transform:translateY(102%)}.Kvd2vq_bottomPanel[data-dragging]{transition:none}.Kvd2vq_bottomResize{cursor:row-resize;z-index:2;touch-action:none;height:8px;position:absolute;top:-4px;left:0;right:0}.Kvd2vq_bottomResizeActive{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_bottomClose{z-index:4;width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex;position:absolute;top:3px;right:6px}.Kvd2vq_bottomClose:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_bottomPanel .Kvd2vq_tabBar{padding-right:40px}body[data-dsh-title-bar-compat] .Kvd2vq_panel{padding-top:var(--dsh-title-bar-strip,40px)}.Kvd2vq_cornerHandle{left:-6px;bottom:calc(var(--dsh-sidebar-height,0px) + 6px);z-index:2;cursor:nwse-resize;touch-action:none;width:12px;height:12px;position:absolute}.Kvd2vq_cornerHandle:hover,.Kvd2vq_cornerHandle[data-dragging]{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_iconButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.Kvd2vq_iconButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_iconButton:disabled{opacity:.4;cursor:default}.Kvd2vq_workbench,.Kvd2vq_split{flex:1;min-width:0;min-height:0;display:flex}.Kvd2vq_splitRow{flex-direction:row}.Kvd2vq_splitCol{flex-direction:column}.Kvd2vq_splitChild{display:flex;position:relative;overflow:hidden}.Kvd2vq_divider{z-index:3;touch-action:none;flex:none;position:relative}.Kvd2vq_dividerRow:after,.Kvd2vq_dividerCol:after{content:\"\";background:var(--dsw-alias-border-l2);transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out);position:absolute}.Kvd2vq_dividerRow{cursor:col-resize;width:7px;margin:0 -2px}.Kvd2vq_dividerRow:after{width:1px;top:0;bottom:0;left:50%;transform:translate(-50%)}.Kvd2vq_dividerCol{cursor:row-resize;height:7px;margin:-2px 0}.Kvd2vq_dividerCol:after{height:1px;top:50%;left:0;right:0;transform:translateY(-50%)}.Kvd2vq_divider:hover:after,.Kvd2vq_dividerActive:after{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_pane{background:var(--dsw-alias-bg-base);flex-direction:column;flex:1;min-width:0;min-height:0;display:flex;position:relative}.Kvd2vq_paneDrop{outline:1px solid var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-1px}.Kvd2vq_dropOverlay{z-index:6;pointer-events:none;background:var(--dsw-alias-interactive-bg-hover-accent);opacity:.5;position:absolute}.Kvd2vq_dropLeft{width:25%;top:0;bottom:0;left:0}.Kvd2vq_dropRight{width:25%;top:0;bottom:0;right:0}.Kvd2vq_dropUp{height:25%;top:0;left:0;right:0}.Kvd2vq_dropDown{height:25%;bottom:0;left:0;right:0}.Kvd2vq_dropCenter{outline:2px dashed var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-2px;background:0 0;inset:25%}.Kvd2vq_paneContent{flex-direction:column;flex:1;min-height:0;display:flex;overflow:hidden}.Kvd2vq_paneTab{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex}.Kvd2vq_paneTabHidden{display:none}.Kvd2vq_paneEmptyCards{flex-direction:column;flex:1;gap:20px;min-height:0;padding:28px 20px 20px;display:flex;overflow:hidden}.Kvd2vq_paneEmptyHeader{text-align:left;flex-direction:row;flex:none;justify-content:space-between;align-items:flex-start;gap:12px;display:flex}.Kvd2vq_paneEmptyHeaderText{flex-direction:column;gap:4px;min-width:0;display:flex}.Kvd2vq_paneEmptyHeading{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);margin:0;line-height:1.3}.Kvd2vq_paneEmptySubheading{font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-tertiary);margin:0;line-height:1.4}.Kvd2vq_paneLayoutRadio{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:8px;flex:none;align-items:center;gap:2px;padding:2px;display:inline-flex}.Kvd2vq_paneLayoutOption{width:28px;height:28px;color:var(--dsw-alias-label-tertiary);cursor:pointer;transition:background .12s var(--dsh-ease-in-out,ease), color .12s var(--dsh-ease-in-out,ease);background:0 0;border:none;border-radius:6px;justify-content:center;align-items:center;display:inline-flex}.Kvd2vq_paneLayoutOption:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_paneLayoutOptionSelected,.Kvd2vq_paneLayoutOptionSelected:hover{background:var(--dsw-alias-interactive-bg-active);color:var(--dsw-alias-brand-primary)}.Kvd2vq_paneEmptyControls{flex:none;align-items:center;gap:8px;display:inline-flex}.Kvd2vq_paneCardGrid{flex:1;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));align-content:start;gap:12px;min-height:0;display:grid}.Kvd2vq_paneCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);min-width:0;color:var(--dsw-alias-label-secondary);cursor:pointer;text-align:left;transition:background .12s var(--dsh-ease-in-out,ease), border-color .12s var(--dsh-ease-in-out,ease), transform .12s var(--dsh-ease-in-out,ease), box-shadow .12s var(--dsh-ease-in-out,ease);border-radius:10px;flex-direction:row;align-items:flex-start;gap:12px;padding:14px;display:flex}.Kvd2vq_paneCardIcon{background:var(--dsw-alias-interactive-bg-hover-accent);width:36px;height:36px;color:var(--dsw-alias-brand-primary);border-radius:8px;flex:none;justify-content:center;align-items:center;font-size:16px;display:flex}.Kvd2vq_paneCardText{flex-direction:column;gap:2px;min-width:0;display:flex}.Kvd2vq_paneCardLabel{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.Kvd2vq_paneCardDesc{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.4;display:-webkit-box;overflow:hidden}.Kvd2vq_paneCard:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l2);transform:translateY(-1px);box-shadow:0 2px 8px #0000001f}.Kvd2vq_paneCard:hover:not(:disabled) .Kvd2vq_paneCardIcon{background:var(--dsw-alias-interactive-bg-active)}.Kvd2vq_paneCard:active:not(:disabled){box-shadow:none;transform:translateY(0)}.Kvd2vq_paneCard:disabled{opacity:.45;cursor:default}.Kvd2vq_tabBar{border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);flex:none;align-items:stretch;height:34px;display:flex}.Kvd2vq_tabBarDrop{outline:1px dashed var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-1px}.Kvd2vq_tabList{scrollbar-width:none;flex:1;min-width:0;display:flex;overflow-x:auto}.Kvd2vq_tabList::-webkit-scrollbar{display:none}.Kvd2vq_tab{min-width:64px;max-width:160px;font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);border-right:1px solid var(--dsw-alias-border-l1);cursor:pointer;user-select:none;background:0 0;flex:none;align-items:center;gap:4px;padding:0 4px 0 10px;display:flex}.Kvd2vq_tab:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_tabActive{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-active)}.Kvd2vq_tabTitle{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.Kvd2vq_tabBadge{min-width:16px;height:15px;font:var(--dsw-font-xxxs-strong-11);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-brand-primary);border-radius:8px;flex:none;justify-content:center;align-items:center;padding:0 4px;display:inline-flex}.Kvd2vq_tabClose{width:18px;height:18px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:4px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.Kvd2vq_tabClose:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_tabBarPlus{background:var(--dsw-alias-bg-layer-1);width:22px;height:22px;color:var(--dsw-alias-label-tertiary);cursor:pointer;border:none;border-radius:5px;flex:none;justify-content:center;align-self:center;align-items:center;margin:0 6px;padding:0;display:inline-flex;position:sticky;right:0}.Kvd2vq_tabBarPlus:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_explorer{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex}.Kvd2vq_explorerHeader{flex:none;align-items:center;gap:8px;height:36px;padding:0 8px 0 12px;display:flex}.Kvd2vq_explorerHeaderPath{flex:1;align-items:center;gap:2px;min-width:0;display:flex}.Kvd2vq_explorerHeaderActions{flex:none;align-items:center;gap:4px;display:flex}.Kvd2vq_explorerRoot{min-width:0;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-secondary);text-overflow:ellipsis;white-space:nowrap;text-align:left;flex:1;display:block;overflow:hidden}.Kvd2vq_explorerBody{flex:1;min-width:0;min-height:0;padding:2px 6px 8px;overflow:hidden auto}.Kvd2vq_explorerRow{box-sizing:border-box;width:100%;min-width:0;height:34px;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);text-align:left;cursor:pointer;white-space:nowrap;animation:Kvd2vq_dsh-row-in .15s var(--ds-ease-in-out);background:0 0;border:none;border-radius:8px;align-items:center;gap:6px;padding:0 8px;display:flex;overflow:hidden}.Kvd2vq_explorerRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_explorerDir{font:var(--dsw-font-s-strong-14)}.Kvd2vq_explorerRowActive{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_explorerHidden{opacity:.45}.Kvd2vq_explorerSymlink{color:var(--dsw-alias-label-tertiary);flex:none}.Kvd2vq_explorerBroken .Kvd2vq_explorerName{color:var(--dsw-alias-state-error-primary)}.Kvd2vq_explorerName{text-overflow:ellipsis;flex:1;min-width:0;overflow:hidden}.Kvd2vq_explorerRef{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);height:20px;color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;border-radius:999px;flex:none;align-items:center;padding:0 8px;display:none}.Kvd2vq_explorerRef:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_explorerRow:hover .Kvd2vq_explorerRef,.Kvd2vq_explorerRow:focus-within .Kvd2vq_explorerRef{display:inline-flex}.Kvd2vq_explorerPill{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);height:20px;color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;border-radius:999px;flex:none;align-items:center;padding:0 8px;display:inline-flex}.Kvd2vq_explorerPill:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_explorerPill:disabled{opacity:.4;cursor:default}.Kvd2vq_explorerPillActive{background:var(--dsw-alias-interactive-bg-active);color:var(--dsw-alias-brand-primary)}.Kvd2vq_explorerCopied{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);flex:none}.Kvd2vq_explorerError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);cursor:default}@keyframes Kvd2vq_dsh-row-in{0%{opacity:0}}.Kvd2vq_explorerEmpty{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-align:center;padding:16px}.Kvd2vq_searchSummary{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);padding:8px 12px 4px}.Kvd2vq_searchGroup{margin-bottom:4px}.Kvd2vq_searchMatchRow{cursor:pointer;text-align:left;background:0 0;border:none;border-radius:8px;align-items:flex-start;gap:8px;width:100%;min-width:0;min-height:26px;padding:4px 8px 4px 30px;display:flex}.Kvd2vq_searchMatchRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_searchMatchLine{min-width:24px;font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);text-align:right;user-select:none;flex:none;padding-top:1px}.Kvd2vq_searchMatchText{white-space:pre-wrap;overflow-wrap:anywhere;min-width:0;color:var(--dsw-alias-label-secondary);flex:1;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:1.5}.Kvd2vq_searchMatchHighlight{background:color-mix(in srgb, var(--dsw-alias-state-warn-primary) 55%, transparent);color:var(--dsw-alias-label-primary);border-radius:2px}.Kvd2vq_searchModifiers{flex:none;align-items:center;gap:2px;display:flex}.Kvd2vq_searchModifierButton{width:22px;height:22px;color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;background:0 0;border:none;border-radius:5px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.Kvd2vq_searchModifierButton:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_searchModifierUnderline{text-decoration:underline}.Kvd2vq_editor{flex-direction:column;flex:1;min-height:0;display:flex}.Kvd2vq_dirtyDot{background:var(--dsw-alias-state-warn-primary);border-radius:50%;flex:none;width:7px;height:7px}.Kvd2vq_editorPlaceholder{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-align:center;flex:1;justify-content:center;align-items:center;padding:16px;display:flex}.Kvd2vq_orphanedType{opacity:.7;overflow-wrap:anywhere;margin-top:8px;font-size:12px;display:block}.Kvd2vq_editorBinary{text-align:center;flex-direction:column;flex:1;justify-content:center;align-items:center;gap:12px;padding:24px 16px;display:flex}.Kvd2vq_editorBinaryNotice{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_editorDownloadLink{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-strong-12);cursor:pointer;transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out), border-color var(--ds-transition-duration-slow) var(--ds-ease-in-out);border-radius:6px;align-items:center;gap:6px;padding:6px 14px;text-decoration:none;display:inline-flex}.Kvd2vq_editorDownloadLink:hover{background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-border-l2)}.Kvd2vq_editorError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);padding:12px 16px}.Kvd2vq_editorBanner{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex:none;padding:4px 12px}.Kvd2vq_sandboxStatus{font:var(--dsw-font-xxxs-11);flex:none;align-items:center;gap:8px;padding:4px 10px;display:flex}.Kvd2vq_sandboxStatusOn{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border-bottom:1px solid var(--dsw-alias-border-l1)}.Kvd2vq_sandboxStatusOff{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);border-bottom:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 45%, transparent)}.Kvd2vq_sandboxDot{background:var(--dsw-alias-state-success-primary);border-radius:50%;flex:none;width:6px;height:6px}.Kvd2vq_sandboxStatusOff .Kvd2vq_sandboxDot{background:var(--dsw-alias-state-error-primary)}.Kvd2vq_sandboxStatusText{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.Kvd2vq_sandboxAction{border:1px solid var(--dsw-alias-border-l2);font:inherit;color:inherit;cursor:pointer;background:0 0;border-radius:6px;flex:none;padding:2px 8px}.Kvd2vq_sandboxAction:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_editorHtml{background:var(--dsw-alias-bg-base);border:none;flex:1;width:100%;min-height:0}.Kvd2vq_browser{flex-direction:column;flex:1;min-height:0;display:flex}.Kvd2vq_browserBar{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;align-items:center;gap:4px;padding:6px 8px;display:flex}.Kvd2vq_browserInput{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);min-width:0;height:28px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:6px;flex:1;padding:0 10px}.Kvd2vq_browserInput:focus{border-color:var(--dsw-alias-border-l2);outline:none}.Kvd2vq_browserMessage{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex:none;padding:4px 12px}.Kvd2vq_browserFrame{background:var(--dsw-alias-bg-base);border:none;flex:1;width:100%;min-height:0}.Kvd2vq_browserStart{text-align:center;min-height:0;font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-tertiary);flex:1;justify-content:center;align-items:center;padding:20px;display:flex}.Kvd2vq_browserBlocked{text-align:center;min-height:0;color:var(--dsw-alias-state-warn-primary);flex-direction:column;flex:1;justify-content:center;align-items:center;gap:6px;padding:24px;display:flex}.Kvd2vq_browserBlockedTitle{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-primary)}.Kvd2vq_browserBlockedDesc{max-width:280px;font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-secondary)}.Kvd2vq_browserBlockedActions{gap:8px;margin-top:6px;display:flex}.Kvd2vq_browserBlockedButton{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxxs-11);cursor:pointer;border-radius:6px;padding:4px 12px}.Kvd2vq_browserBlockedButton:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_editorCm{background:0 0;flex:1;min-height:0;overflow:hidden}.Kvd2vq_editorCmHidden{display:none}.Kvd2vq_editorCm .cm-editor{height:100%}.Kvd2vq_editorCm .cm-editor.cm-focused{outline:none}.Kvd2vq_editorModeToggle{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:6px;flex:none;align-items:center;gap:2px;padding:2px;display:inline-flex}.Kvd2vq_editorModeButton{color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-11);cursor:pointer;background:0 0;border:none;border-radius:4px;padding:2px 8px}.Kvd2vq_editorModeButton:hover{color:var(--dsw-alias-label-primary)}.Kvd2vq_editorModeActive{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}.Kvd2vq_editorImageWrap{flex:1;justify-content:center;align-items:center;min-height:0;padding:12px;display:flex;overflow:auto}.Kvd2vq_editorImage{object-fit:contain;max-width:100%;max-height:100%}.Kvd2vq_editorMd{min-height:0;font:var(--dsw-font-xs-13);flex:1;padding:10px 14px;overflow-y:auto}.Kvd2vq_selectionPopup{z-index:60;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);height:28px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxxs-strong-11);white-space:nowrap;cursor:pointer;border-radius:6px;align-items:center;padding:0 10px;display:inline-flex;position:fixed;transform:translate(-50%,calc(-100% - 8px))}.Kvd2vq_selectionPopup:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_editorPdf{background:var(--dsw-alias-bg-base);flex-direction:column;flex:1;min-height:0;display:flex}.Kvd2vq_editorPdfToolbar{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;justify-content:flex-end;padding:6px 8px;display:flex}.Kvd2vq_editorPdfStage{flex:1;min-height:0;display:flex;position:relative}.Kvd2vq_editorPdfFrame{background:var(--dsw-alias-bg-base);border:none;flex:1;width:100%;min-height:0}.Kvd2vq_editorPdfFrameBlocked{pointer-events:none}.Kvd2vq_editorPdfDragShield{z-index:4;pointer-events:none;background:0 0;position:absolute;inset:0}.Kvd2vq_editorPdfDragShieldActive{pointer-events:auto}body[data-dsh-tab-dragging] .Kvd2vq_editorPdfFrame{pointer-events:none!important}body[data-dsh-tab-dragging] .Kvd2vq_editorPdfDragShield{pointer-events:auto!important}.Kvd2vq_terminalWrap{background:var(--dsw-alias-bg-base);flex-direction:column;flex:1;min-height:0;display:flex;position:relative}.Kvd2vq_terminal{flex:1;min-height:0;padding:6px 4px 6px 8px}.Kvd2vq_terminal .xterm{height:100%}.Kvd2vq_terminalBanner{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex-wrap:wrap;flex:none;align-items:center;gap:8px;padding:3px 10px;display:flex}.Kvd2vq_terminalBannerUrl{word-break:break-all;opacity:.85;flex-basis:100%;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.Kvd2vq_boundaryError{z-index:50;background:var(--dsw-alias-bg-layer-1);border-left:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);flex-direction:column;align-items:flex-start;gap:8px;padding:16px;display:flex;position:fixed;top:0;bottom:0;right:0;overflow:auto}.Kvd2vq_terminalRetry{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;border-radius:999px;flex:none;padding:1px 8px}.Kvd2vq_terminalRetry:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_terminalDepsBanner{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex-direction:column;flex:none;gap:6px;padding:10px;display:flex}.Kvd2vq_terminalDepsTitle{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-state-warn-primary)}.Kvd2vq_terminalDepsHint{opacity:.9}.Kvd2vq_terminalDepsCommandRow{align-items:flex-start;gap:8px;display:flex}.Kvd2vq_terminalRepairCommand{white-space:pre-wrap;word-break:break-all;user-select:text;min-width:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:4px;flex:1;max-height:160px;margin:0;padding:6px 8px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.5;overflow:auto}.Kvd2vq_terminalDepsNote{opacity:.85}.Kvd2vq_terminalDepsActions{align-items:center;gap:8px;display:flex}.Kvd2vq_tabBoundaryError{min-height:0;font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);flex-direction:column;flex:1;align-items:flex-start;gap:8px;padding:12px 16px;display:flex;overflow:auto}.Kvd2vq_git{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex;overflow:hidden auto}.Kvd2vq_gitHeader{flex:none;align-items:center;gap:8px;height:36px;padding:0 8px 0 12px;display:flex}.Kvd2vq_gitBranchSelect{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);min-width:0;height:26px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:6px;flex:1;padding:0 6px}.Kvd2vq_gitSection{border-top:1px solid var(--dsw-alias-border-l1)}.Kvd2vq_gitSectionHeader{font:var(--dsw-font-xxxs-strong-11);color:var(--dsw-alias-label-tertiary);text-transform:uppercase;justify-content:space-between;align-items:center;padding:6px 12px 4px;display:flex}.Kvd2vq_gitLink{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-brand-primary);cursor:pointer;background:0 0;border:none;padding:0}.Kvd2vq_gitLink:hover:not(:disabled){text-decoration:underline}.Kvd2vq_gitLink:disabled{opacity:.4;cursor:default}.Kvd2vq_gitRow{min-height:34px;animation:Kvd2vq_dsh-row-in .15s var(--ds-ease-in-out);border-radius:8px;align-items:center;gap:6px;margin:0 6px;padding:0 8px;display:flex}.Kvd2vq_gitRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_gitRowSelected{background:var(--dsw-alias-interactive-bg-active)}.Kvd2vq_gitRowMain{cursor:pointer;text-align:left;background:0 0;border:none;flex:1;align-items:center;gap:8px;min-width:0;padding:3px 0;display:flex}.Kvd2vq_gitBadge{width:20px;height:16px;font:var(--dsw-font-xxxs-strong-11);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary);border-radius:4px;flex:none;justify-content:center;align-items:center;display:inline-flex}.Kvd2vq_gitName{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);flex:1;overflow:hidden}.Kvd2vq_gitEmpty{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);padding:4px 12px 8px}.Kvd2vq_gitPlaceholder{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-align:center;padding:16px}.Kvd2vq_gitError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);white-space:pre-wrap;padding:8px 12px}.Kvd2vq_gitDiff{border-top:1px solid var(--dsw-alias-border-l1);padding:8px}.Kvd2vq_gitDiffTab{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex;overflow:hidden auto}.Kvd2vq_gitDiffTabHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;align-items:center;gap:8px;height:36px;padding:0 8px 0 12px;display:flex}.Kvd2vq_gitDiffTabTitle{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-primary);flex:1;overflow:hidden}.Kvd2vq_gitDiffFile{align-items:baseline;gap:6px;padding:8px 2px 2px;display:flex}.Kvd2vq_gitDiffFilePath{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-primary);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Kvd2vq_gitDiffFileOld{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;flex:none;max-width:40%;overflow:hidden}.Kvd2vq_gitDiffFileTag{border:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-xxxs-strong-11);color:var(--dsw-alias-label-secondary);border-radius:999px;flex:none;padding:0 6px}.Kvd2vq_gitDiffHunk{font:var(--dsw-font-markdown-code-block-small);color:var(--dsw-alias-label-tertiary);gap:8px;padding:3px 2px;display:flex}.Kvd2vq_gitDiffHunkHeader{color:var(--dsw-alias-label-secondary);flex:none}.Kvd2vq_gitDiffHunkSection{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Kvd2vq_gitDiffLine{font:var(--dsw-font-markdown-code-block-small);white-space:pre-wrap;overflow-wrap:anywhere;align-items:stretch;min-width:0;line-height:20px;display:flex}.Kvd2vq_gitDiffNum{text-align:right;width:36px;color:var(--dsw-alias-label-tertiary);user-select:none;flex:none;padding-right:8px}.Kvd2vq_gitDiffCode{flex:1;min-width:0;overflow:visible}.Kvd2vq_gitDiffCtx{color:var(--dsw-alias-label-primary)}.Kvd2vq_gitDiffDel{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent)}.Kvd2vq_gitDiffAdd{color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 12%, transparent)}.Kvd2vq_gitDiffMeta{padding-left:2px}.Kvd2vq_gitDiffMetaText{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);font-style:italic}.Kvd2vq_gitDiffExpand{width:100%;font:var(--dsw-font-xxs-12);color:var(--dsw-alias-brand-primary);cursor:pointer;text-align:center;background:0 0;border:none;margin:4px 0;display:block}.Kvd2vq_gitDiffExpand:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_gitConfirmDesc{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);white-space:pre-wrap;margin:0}.Kvd2vq_gitCommit{border-top:1px solid var(--dsw-alias-border-l1);align-items:center;gap:6px;padding:8px 12px;display:flex}.Kvd2vq_gitCommitInput{flex:1;min-width:0}.Kvd2vq_gitCommitButton{background:var(--dsw-alias-button-primary-fill);height:26px;color:var(--dsw-alias-label-primary-inverted);font:var(--dsw-font-xxs-strong-12);cursor:pointer;border:none;border-radius:6px;flex:none;padding:0 12px}.Kvd2vq_gitCommitButton:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}.Kvd2vq_gitCommitButton:disabled{opacity:.45;cursor:default}.Kvd2vq_gitLogRow{cursor:pointer;border-radius:8px;flex-direction:column;gap:2px;padding:5px 12px;display:flex}.Kvd2vq_gitLogRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_gitLogLine1{align-items:baseline;gap:8px;min-width:0;display:flex}.Kvd2vq_gitLogHash{font:var(--dsw-font-markdown-code-block-small);color:var(--dsw-alias-label-tertiary);flex:none}.Kvd2vq_gitLogLine2{flex-wrap:wrap;align-items:center;gap:6px;min-width:0;display:flex}.Kvd2vq_gitLogRef{border:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-xxxs-strong-11);color:var(--dsw-alias-brand-primary);white-space:nowrap;border-radius:999px;flex:none;padding:0 5px}.Kvd2vq_gitLogSubject{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);flex:1;overflow:hidden}.Kvd2vq_gitLogMeta{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_gitLogMore{border:1px solid var(--dsw-alias-border-l2);width:calc(100% - 24px);font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border-radius:6px;margin:4px 12px 8px;padding:6px 0;display:block}.Kvd2vq_gitLogMore:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_gitLogMore:disabled{opacity:.5;cursor:default}.Kvd2vq_producedRow{flex-wrap:wrap;align-items:center;gap:8px;padding:4px 0;display:flex}.Kvd2vq_producedLabel{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_producedChip{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);max-width:200px;color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxs-12);cursor:pointer;border-radius:999px;align-items:center;gap:4px;padding:2px 8px;display:inline-flex;overflow:hidden}.Kvd2vq_producedChip:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_producedChip span{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Kvd2vq_producedMore{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_toggleButton:focus-visible,.Kvd2vq_bottomClose:focus-visible,.Kvd2vq_iconButton:focus-visible,.Kvd2vq_tab:focus-visible,.Kvd2vq_tabClose:focus-visible,.Kvd2vq_tabBarPlus:focus-visible,.Kvd2vq_paneCard:focus-visible,.Kvd2vq_paneLayoutOption:focus-visible,.Kvd2vq_explorerRow:focus-visible,.Kvd2vq_explorerRef:focus-visible,.Kvd2vq_gitRowMain:focus-visible,.Kvd2vq_gitLink:focus-visible,.Kvd2vq_gitCommitButton:focus-visible,.Kvd2vq_gitLogRow:focus-visible,.Kvd2vq_gitLogMore:focus-visible,.Kvd2vq_gitDiffExpand:focus-visible,.Kvd2vq_terminalRetry:focus-visible,.Kvd2vq_editorModeButton:focus-visible,.Kvd2vq_editorDownloadLink:focus-visible,.Kvd2vq_editorPptxButton:focus-visible,.Kvd2vq_editorDocxZoomRange:focus-visible{outline:2px solid var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-1px}@media (prefers-reduced-motion:reduce){.Kvd2vq_panel,.Kvd2vq_panelHidden,.Kvd2vq_bottomPanel,.Kvd2vq_bottomPanelHidden,.Kvd2vq_toggleCluster,.Kvd2vq_toggleButton,.Kvd2vq_tab,.Kvd2vq_tabBarPlus,.Kvd2vq_paneCard,.Kvd2vq_explorerRow,.Kvd2vq_gitRow,.Kvd2vq_divider,.Kvd2vq_dividerRow:after,.Kvd2vq_dividerCol:after{transition:none;animation:none}}@media (width<=767px){.Kvd2vq_panel:not(.Kvd2vq_panelHidden) .Kvd2vq_tabBar{padding-right:40px}.Kvd2vq_tab{min-width:48px;max-width:128px}}.Kvd2vq_settingsIntro{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-secondary);margin:0 0 12px}.Kvd2vq_settingsGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;display:grid}.Kvd2vq_settingsCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);cursor:pointer;text-align:left;transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out);border-radius:12px;flex-direction:column;gap:8px;padding:14px;display:flex;position:relative}.Kvd2vq_settingsCard:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_settingsCardIcon{background:var(--dsw-alias-bg-layer-2);width:32px;height:32px;color:var(--dsw-alias-label-primary);border-radius:9px;justify-content:center;align-items:center;display:flex}.Kvd2vq_settingsCardTitle{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary)}.Kvd2vq_settingsCardSubtitle{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_settingsCardToggle{border:1px solid var(--dsw-alias-border-l2);color:#0000;cursor:pointer;background:0 0;border-radius:50%;justify-content:center;align-items:center;width:22px;height:22px;display:flex;position:absolute;top:12px;right:12px}.Kvd2vq_settingsCardToggleOn{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-base);border-color:#0000}.Kvd2vq_settingsHint{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);margin:12px 0 0}.Kvd2vq_settingsMissing{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border-radius:10px;margin:0;padding:12px}.Kvd2vq_notesRoot{flex:1;min-height:0;display:flex}.Kvd2vq_notesTree{flex-direction:column;flex:none;min-width:0;display:flex;overflow:hidden}.Kvd2vq_notesEditor{flex-direction:column;flex:1;min-width:0;display:flex}.Kvd2vq_notesBindPrompt{text-align:center;flex-direction:column;flex:1;justify-content:center;align-items:center;gap:10px;padding:24px;display:flex}.Kvd2vq_folderPickerPath{border-bottom:1px solid var(--dsw-alias-border-l1);align-items:center;gap:8px;margin-bottom:4px;padding-bottom:10px;display:flex}.Kvd2vq_folderPickerList{height:320px;overflow:hidden auto}.Kvd2vq_folderPickerFooter{justify-content:flex-end;gap:8px;display:flex}.Kvd2vq_extSection{border-top:1px solid var(--dsw-alias-border-l1);margin-top:20px;padding-top:16px}.Kvd2vq_extHeading{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);margin:0 0 8px}.Kvd2vq_extWarning{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:10px;margin:0 0 12px;padding:10px 12px}.Kvd2vq_extActions{gap:8px;margin-bottom:12px;display:flex}.Kvd2vq_extActions button,.Kvd2vq_extPromptActions button{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);cursor:pointer;border-radius:8px;padding:6px 12px}.Kvd2vq_extActions button:disabled,.Kvd2vq_extPromptActions button:disabled{opacity:.5;cursor:default}.Kvd2vq_extPromptPrimary{background:var(--dsw-alias-label-primary)!important;color:var(--dsw-alias-bg-base)!important;border-color:#0000!important}.Kvd2vq_extList{flex-direction:column;gap:8px;display:flex}.Kvd2vq_extRow{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:10px;align-items:flex-start;gap:10px;padding:10px 12px;display:flex}.Kvd2vq_extRowIcon{background:var(--dsw-alias-bg-layer-2);border-radius:8px;flex:none;justify-content:center;align-items:center;width:28px;height:28px;font-size:15px;line-height:1;display:flex}.Kvd2vq_extRowBody{flex-direction:column;flex:auto;gap:2px;min-width:0;display:flex}.Kvd2vq_extRowTitle{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary)}.Kvd2vq_extRowMeta{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere}.Kvd2vq_extRowPath{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);opacity:.75;overflow-wrap:anywhere}.Kvd2vq_extRowRemove{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxs-12);cursor:pointer;background:0 0;border-radius:8px;flex:none;align-self:center;padding:5px 10px}.Kvd2vq_extRowRemove:disabled{opacity:.5;cursor:default}.Kvd2vq_extEmpty{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);margin:0}.Kvd2vq_extError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);overflow-wrap:anywhere;border-radius:10px;margin:12px 0 0;padding:10px 12px}.Kvd2vq_extPrompt{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:10px;flex-direction:column;gap:8px;margin-bottom:12px;padding:12px;display:flex}.Kvd2vq_extPromptHint{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);margin:0}.Kvd2vq_extPromptFile{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere;margin:0}.Kvd2vq_extPromptField{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);flex-direction:column;gap:4px;display:flex}.Kvd2vq_extPromptField input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:8px;padding:6px 10px}.Kvd2vq_extPromptActions{justify-content:flex-end;gap:8px;display:flex}.Kvd2vq_appearanceSection{border-top:1px solid var(--dsw-alias-border-l1);margin-top:20px;padding-top:16px}.Kvd2vq_appearanceHeading{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);margin:0 0 8px}.Kvd2vq_appearanceGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:12px;display:grid}.Kvd2vq_appearanceFieldFull{grid-column:1/-1}.Kvd2vq_appearanceField{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);flex-direction:column;gap:4px;display:flex}.Kvd2vq_appearanceFieldLabel{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary)}.Kvd2vq_appearanceControl{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:var(--dsw-font-s-14);box-sizing:border-box;border-radius:8px;width:100%;padding:6px 10px}.Kvd2vq_appearanceControl:focus{border-color:var(--dsw-alias-border-l3,var(--dsw-alias-border-l2));outline:none}.Kvd2vq_appearanceSelectTrigger{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:var(--dsw-font-s-14);box-sizing:border-box;cursor:pointer;text-align:left;border-radius:8px;justify-content:space-between;align-items:center;gap:8px;width:100%;padding:6px 10px;display:flex}.Kvd2vq_appearanceSelectTrigger:hover{border-color:var(--dsw-alias-border-l3,var(--dsw-alias-border-l2))}.Kvd2vq_appearanceSelectTrigger:focus-visible{border-color:var(--dsw-alias-border-l3,var(--dsw-alias-border-l2));box-shadow:0 0 0 2px var(--dsw-alias-interactive-bg-active,transparent);outline:none}.Kvd2vq_appearanceSelectTrigger[data-placeholder]{color:var(--dsw-alias-label-tertiary)}.Kvd2vq_appearanceSelectTrigger:disabled{opacity:.6;cursor:default}.Kvd2vq_appearanceSelectCaret{color:var(--dsw-alias-label-tertiary);flex-shrink:0;align-items:center;display:inline-flex}.Kvd2vq_appearanceSelectContent{min-width:var(--radix-select-trigger-width);max-height:var(--radix-select-content-available-height,280px);border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-elevated,var(--dsw-alias-bg-base));z-index:1000;border-radius:8px;overflow:hidden;box-shadow:0 6px 24px #0000002e}.Kvd2vq_appearanceSelectViewport{padding:4px}.Kvd2vq_appearanceSelectItem{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);cursor:pointer;user-select:none;border-radius:6px;outline:none;align-items:center;gap:6px;padding:6px 8px;display:flex}.Kvd2vq_appearanceSelectItem[data-highlighted]{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_appearanceSelectItem[data-disabled]{opacity:.5;cursor:default}.Kvd2vq_appearanceSelectIndicator{color:var(--dsw-alias-label-primary);flex-shrink:0;align-items:center;display:inline-flex}.Kvd2vq_appearanceInlineToggle{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);cursor:pointer;text-underline-offset:2px;background:0 0;border:none;align-self:flex-start;margin-top:2px;padding:0;text-decoration:underline}.Kvd2vq_appearanceInlineToggle:hover{color:var(--dsw-alias-label-secondary)}.Kvd2vq_appearanceHint{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);margin:8px 0 0}";
	const tagId = "dsh-powerdesk/sidebar.module.css";
	if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
		const tag = document.createElement("style");
		tag.dataset.plugin = "dsh-powerdesk";
		tag.dataset.pluginCss = tagId;
		tag.textContent = css;
		document.head.appendChild(tag);
	}
	var sidebar_module_css_default = {
		"gitSectionHeader": "Kvd2vq_gitSectionHeader",
		"appearanceSection": "Kvd2vq_appearanceSection",
		"gitHeader": "Kvd2vq_gitHeader",
		"tabActive": "Kvd2vq_tabActive",
		"searchModifierUnderline": "Kvd2vq_searchModifierUnderline",
		"explorerEmpty": "Kvd2vq_explorerEmpty",
		"editorPdfDragShieldActive": "Kvd2vq_editorPdfDragShieldActive",
		"appearanceSelectContent": "Kvd2vq_appearanceSelectContent",
		"notesBindPrompt": "Kvd2vq_notesBindPrompt",
		"extRowTitle": "Kvd2vq_extRowTitle",
		"paneCardGrid": "Kvd2vq_paneCardGrid",
		"settingsCardIcon": "Kvd2vq_settingsCardIcon",
		"paneDrop": "Kvd2vq_paneDrop",
		"settingsCard": "Kvd2vq_settingsCard",
		"editorCm": "Kvd2vq_editorCm",
		"extPromptFile": "Kvd2vq_extPromptFile",
		"sandboxStatusText": "Kvd2vq_sandboxStatusText",
		"editorPdfStage": "Kvd2vq_editorPdfStage",
		"panel": "Kvd2vq_panel",
		"splitChild": "Kvd2vq_splitChild",
		"appearanceHeading": "Kvd2vq_appearanceHeading",
		"explorerError": "Kvd2vq_explorerError",
		"terminalBannerUrl": "Kvd2vq_terminalBannerUrl",
		"paneEmptyHeader": "Kvd2vq_paneEmptyHeader",
		"extError": "Kvd2vq_extError",
		"gitLogLine2": "Kvd2vq_gitLogLine2",
		"settingsMissing": "Kvd2vq_settingsMissing",
		"gitDiffNum": "Kvd2vq_gitDiffNum",
		"gitEmpty": "Kvd2vq_gitEmpty",
		"gitError": "Kvd2vq_gitError",
		"split": "Kvd2vq_split",
		"gitLogSubject": "Kvd2vq_gitLogSubject",
		"appearanceFieldLabel": "Kvd2vq_appearanceFieldLabel",
		"gitDiffHunkHeader": "Kvd2vq_gitDiffHunkHeader",
		"gitCommitInput": "Kvd2vq_gitCommitInput",
		"selectionPopup": "Kvd2vq_selectionPopup",
		"paneLayoutOption": "Kvd2vq_paneLayoutOption",
		"paneEmptyHeaderText": "Kvd2vq_paneEmptyHeaderText",
		"gitDiffMetaText": "Kvd2vq_gitDiffMetaText",
		"editorDocxZoomRange": "Kvd2vq_editorDocxZoomRange",
		"extPrompt": "Kvd2vq_extPrompt",
		"paneTab": "Kvd2vq_paneTab",
		"dividerRow": "Kvd2vq_dividerRow",
		"paneEmptySubheading": "Kvd2vq_paneEmptySubheading",
		"dropCenter": "Kvd2vq_dropCenter",
		"terminalWrap": "Kvd2vq_terminalWrap",
		"editorError": "Kvd2vq_editorError",
		"gitDiffFilePath": "Kvd2vq_gitDiffFilePath",
		"terminalDepsNote": "Kvd2vq_terminalDepsNote",
		"appearanceSelectItem": "Kvd2vq_appearanceSelectItem",
		"terminalBanner": "Kvd2vq_terminalBanner",
		"gitBadge": "Kvd2vq_gitBadge",
		"editorPdfDragShield": "Kvd2vq_editorPdfDragShield",
		"paneEmptyHeading": "Kvd2vq_paneEmptyHeading",
		"gitCommit": "Kvd2vq_gitCommit",
		"settingsCardTitle": "Kvd2vq_settingsCardTitle",
		"toggleCluster": "Kvd2vq_toggleCluster",
		"browserBlockedDesc": "Kvd2vq_browserBlockedDesc",
		"appearanceField": "Kvd2vq_appearanceField",
		"tabBadge": "Kvd2vq_tabBadge",
		"git": "Kvd2vq_git",
		"tabClose": "Kvd2vq_tabClose",
		"divider": "Kvd2vq_divider",
		"explorerHeader": "Kvd2vq_explorerHeader",
		"browserBar": "Kvd2vq_browserBar",
		"extWarning": "Kvd2vq_extWarning",
		"bottomResizeActive": "Kvd2vq_bottomResizeActive",
		"explorerPillActive": "Kvd2vq_explorerPillActive",
		"terminalRetry": "Kvd2vq_terminalRetry",
		"splitRow": "Kvd2vq_splitRow",
		"dividerCol": "Kvd2vq_dividerCol",
		"editorHtml": "Kvd2vq_editorHtml",
		"explorer": "Kvd2vq_explorer",
		"paneCardIcon": "Kvd2vq_paneCardIcon",
		"tab": "Kvd2vq_tab",
		"gitDiffMeta": "Kvd2vq_gitDiffMeta",
		"gitConfirmDesc": "Kvd2vq_gitConfirmDesc",
		"gitDiff": "Kvd2vq_gitDiff",
		"bottomResize": "Kvd2vq_bottomResize",
		"editorBinaryNotice": "Kvd2vq_editorBinaryNotice",
		"explorerName": "Kvd2vq_explorerName",
		"browserFrame": "Kvd2vq_browserFrame",
		"iconButton": "Kvd2vq_iconButton",
		"gitLogRow": "Kvd2vq_gitLogRow",
		"searchModifierButton": "Kvd2vq_searchModifierButton",
		"sandboxStatusOn": "Kvd2vq_sandboxStatusOn",
		"extList": "Kvd2vq_extList",
		"gitDiffCtx": "Kvd2vq_gitDiffCtx",
		"appearanceSelectTrigger": "Kvd2vq_appearanceSelectTrigger",
		"editorImage": "Kvd2vq_editorImage",
		"gitRow": "Kvd2vq_gitRow",
		"gitDiffTabTitle": "Kvd2vq_gitDiffTabTitle",
		"gitDiffFileOld": "Kvd2vq_gitDiffFileOld",
		"appearanceFieldFull": "Kvd2vq_appearanceFieldFull",
		"pane": "Kvd2vq_pane",
		"splitCol": "Kvd2vq_splitCol",
		"editorPdfFrameBlocked": "Kvd2vq_editorPdfFrameBlocked",
		"appearanceControl": "Kvd2vq_appearanceControl",
		"explorerRow": "Kvd2vq_explorerRow",
		"editorModeActive": "Kvd2vq_editorModeActive",
		"terminalRepairCommand": "Kvd2vq_terminalRepairCommand",
		"searchMatchText": "Kvd2vq_searchMatchText",
		"browserStart": "Kvd2vq_browserStart",
		"gitBranchSelect": "Kvd2vq_gitBranchSelect",
		"bottomPanelHidden": "Kvd2vq_bottomPanelHidden",
		"sandboxStatus": "Kvd2vq_sandboxStatus",
		"tabList": "Kvd2vq_tabList",
		"folderPickerList": "Kvd2vq_folderPickerList",
		"settingsCardSubtitle": "Kvd2vq_settingsCardSubtitle",
		"settingsHint": "Kvd2vq_settingsHint",
		"appearanceSelectCaret": "Kvd2vq_appearanceSelectCaret",
		"gitDiffLine": "Kvd2vq_gitDiffLine",
		"dropDown": "Kvd2vq_dropDown",
		"gitDiffFileTag": "Kvd2vq_gitDiffFileTag",
		"gitDiffHunkSection": "Kvd2vq_gitDiffHunkSection",
		"terminalDepsCommandRow": "Kvd2vq_terminalDepsCommandRow",
		"explorerHeaderPath": "Kvd2vq_explorerHeaderPath",
		"notesTree": "Kvd2vq_notesTree",
		"tabBarPlus": "Kvd2vq_tabBarPlus",
		"producedLabel": "Kvd2vq_producedLabel",
		"dropOverlay": "Kvd2vq_dropOverlay",
		"sandboxStatusOff": "Kvd2vq_sandboxStatusOff",
		"explorerBroken": "Kvd2vq_explorerBroken",
		"editorImageWrap": "Kvd2vq_editorImageWrap",
		"browserBlocked": "Kvd2vq_browserBlocked",
		"editorMd": "Kvd2vq_editorMd",
		"settingsCardToggleOn": "Kvd2vq_settingsCardToggleOn",
		"dropLeft": "Kvd2vq_dropLeft",
		"gitLogLine1": "Kvd2vq_gitLogLine1",
		"searchMatchRow": "Kvd2vq_searchMatchRow",
		"searchModifiers": "Kvd2vq_searchModifiers",
		"tabTitle": "Kvd2vq_tabTitle",
		"gitDiffTabHeader": "Kvd2vq_gitDiffTabHeader",
		"editorCmHidden": "Kvd2vq_editorCmHidden",
		"settingsIntro": "Kvd2vq_settingsIntro",
		"tabBarDrop": "Kvd2vq_tabBarDrop",
		"gitDiffHunk": "Kvd2vq_gitDiffHunk",
		"gitLogMeta": "Kvd2vq_gitLogMeta",
		"paneCardDesc": "Kvd2vq_paneCardDesc",
		"paneCardText": "Kvd2vq_paneCardText",
		"explorerRef": "Kvd2vq_explorerRef",
		"gitLogRef": "Kvd2vq_gitLogRef",
		"gitLogMore": "Kvd2vq_gitLogMore",
		"boundaryError": "Kvd2vq_boundaryError",
		"gitRowSelected": "Kvd2vq_gitRowSelected",
		"paneLayoutOptionSelected": "Kvd2vq_paneLayoutOptionSelected",
		"paneCard": "Kvd2vq_paneCard",
		"extRowRemove": "Kvd2vq_extRowRemove",
		"panelBody": "Kvd2vq_panelBody",
		"explorerRowActive": "Kvd2vq_explorerRowActive",
		"gitLogHash": "Kvd2vq_gitLogHash",
		"panelHidden": "Kvd2vq_panelHidden",
		"editorPdfToolbar": "Kvd2vq_editorPdfToolbar",
		"gitPlaceholder": "Kvd2vq_gitPlaceholder",
		"folderPickerPath": "Kvd2vq_folderPickerPath",
		"browserInput": "Kvd2vq_browserInput",
		"explorerHeaderActions": "Kvd2vq_explorerHeaderActions",
		"editorModeButton": "Kvd2vq_editorModeButton",
		"extPromptActions": "Kvd2vq_extPromptActions",
		"dirtyDot": "Kvd2vq_dirtyDot",
		"browser": "Kvd2vq_browser",
		"settingsCardToggle": "Kvd2vq_settingsCardToggle",
		"browserBlockedTitle": "Kvd2vq_browserBlockedTitle",
		"gitRowMain": "Kvd2vq_gitRowMain",
		"gitDiffFile": "Kvd2vq_gitDiffFile",
		"editor": "Kvd2vq_editor",
		"extHeading": "Kvd2vq_extHeading",
		"browserBlockedActions": "Kvd2vq_browserBlockedActions",
		"terminalDepsActions": "Kvd2vq_terminalDepsActions",
		"dividerActive": "Kvd2vq_dividerActive",
		"paneLayoutRadio": "Kvd2vq_paneLayoutRadio",
		"explorerCopied": "Kvd2vq_explorerCopied",
		"tabBoundaryError": "Kvd2vq_tabBoundaryError",
		"gitDiffAdd": "Kvd2vq_gitDiffAdd",
		"dropRight": "Kvd2vq_dropRight",
		"terminalDepsBanner": "Kvd2vq_terminalDepsBanner",
		"editorPlaceholder": "Kvd2vq_editorPlaceholder",
		"browserBlockedButton": "Kvd2vq_browserBlockedButton",
		"workbench": "Kvd2vq_workbench",
		"extEmpty": "Kvd2vq_extEmpty",
		"gitLink": "Kvd2vq_gitLink",
		"editorDownloadLink": "Kvd2vq_editorDownloadLink",
		"extPromptHint": "Kvd2vq_extPromptHint",
		"editorBinary": "Kvd2vq_editorBinary",
		"bottomClose": "Kvd2vq_bottomClose",
		"sandboxDot": "Kvd2vq_sandboxDot",
		"editorPdfFrame": "Kvd2vq_editorPdfFrame",
		"searchGroup": "Kvd2vq_searchGroup",
		"folderPickerFooter": "Kvd2vq_folderPickerFooter",
		"extSection": "Kvd2vq_extSection",
		"paneContent": "Kvd2vq_paneContent",
		"searchMatchHighlight": "Kvd2vq_searchMatchHighlight",
		"paneCardLabel": "Kvd2vq_paneCardLabel",
		"orphanedType": "Kvd2vq_orphanedType",
		"tabBar": "Kvd2vq_tabBar",
		"dropUp": "Kvd2vq_dropUp",
		"explorerBody": "Kvd2vq_explorerBody",
		"notesRoot": "Kvd2vq_notesRoot",
		"appearanceHint": "Kvd2vq_appearanceHint",
		"explorerPill": "Kvd2vq_explorerPill",
		"extRow": "Kvd2vq_extRow",
		"explorerDir": "Kvd2vq_explorerDir",
		"explorerHidden": "Kvd2vq_explorerHidden",
		"settingsGrid": "Kvd2vq_settingsGrid",
		"appearanceSelectIndicator": "Kvd2vq_appearanceSelectIndicator",
		"terminalDepsTitle": "Kvd2vq_terminalDepsTitle",
		"toggleButton": "Kvd2vq_toggleButton",
		"paneTabHidden": "Kvd2vq_paneTabHidden",
		"paneEmptyControls": "Kvd2vq_paneEmptyControls",
		"editorPdf": "Kvd2vq_editorPdf",
		"gitDiffCode": "Kvd2vq_gitDiffCode",
		"panelResizeActive": "Kvd2vq_panelResizeActive",
		"browserMessage": "Kvd2vq_browserMessage",
		"extPromptField": "Kvd2vq_extPromptField",
		"gitDiffTab": "Kvd2vq_gitDiffTab",
		"extActions": "Kvd2vq_extActions",
		"notesEditor": "Kvd2vq_notesEditor",
		"extPromptPrimary": "Kvd2vq_extPromptPrimary",
		"gitName": "Kvd2vq_gitName",
		"extRowMeta": "Kvd2vq_extRowMeta",
		"explorerRoot": "Kvd2vq_explorerRoot",
		"appearanceGrid": "Kvd2vq_appearanceGrid",
		"appearanceInlineToggle": "Kvd2vq_appearanceInlineToggle",
		"gitDiffExpand": "Kvd2vq_gitDiffExpand",
		"explorerSymlink": "Kvd2vq_explorerSymlink",
		"producedMore": "Kvd2vq_producedMore",
		"editorPptxButton": "Kvd2vq_editorPptxButton",
		"bottomPanel": "Kvd2vq_bottomPanel",
		"dsh-row-in": "Kvd2vq_dsh-row-in",
		"editorBanner": "Kvd2vq_editorBanner",
		"gitCommitButton": "Kvd2vq_gitCommitButton",
		"gitSection": "Kvd2vq_gitSection",
		"extRowPath": "Kvd2vq_extRowPath",
		"searchSummary": "Kvd2vq_searchSummary",
		"cornerHandle": "Kvd2vq_cornerHandle",
		"searchMatchLine": "Kvd2vq_searchMatchLine",
		"producedChip": "Kvd2vq_producedChip",
		"editorModeToggle": "Kvd2vq_editorModeToggle",
		"gitDiffDel": "Kvd2vq_gitDiffDel",
		"terminalDepsHint": "Kvd2vq_terminalDepsHint",
		"extRowIcon": "Kvd2vq_extRowIcon",
		"producedRow": "Kvd2vq_producedRow",
		"extRowBody": "Kvd2vq_extRowBody",
		"appearanceSelectViewport": "Kvd2vq_appearanceSelectViewport",
		"terminal": "Kvd2vq_terminal",
		"sandboxAction": "Kvd2vq_sandboxAction",
		"panelResize": "Kvd2vq_panelResize",
		"paneEmptyCards": "Kvd2vq_paneEmptyCards"
	};
	//#endregion
	//#region src/client/CalendarView.tsx
	/**
	* The Calendar tab: a schedule-x calendar (Month / Week / Day views) over
	* events persisted in a local SQLite DB via the host's
	* `/powerdesk/api/calendar.*` routes (see calendar-api.ts / rust-sqlite-deps.ts
	* on the host half). Built as a lazy chunk (`lib/client-calendar.js`, see
	* chunks/calendar.tsx + tsdown.config.ts) so schedule-x + preact +
	* temporal-polyfill only download on first calendar-open — not at plugin
	* startup, per the lazy-loading requirement.
	*
	* Mount model: vanilla schedule-x (NOT the `@schedule-x/react` adapter — it
	* lags the core 4.6 line and would pin us to 4.1). `createCalendar()` returns
	* a `CalendarApp` with a `render(el)` method. The render is split across two
	* effects: the init effect creates the calendar (after loading deps + events)
	* and sets state to 'ready'; a second effect renders it into the container —
	* which only mounts once state is 'ready'. Calling `render()` while the
	* component is still showing the loading placeholder would pass a null ref
	* (the container div isn't in the DOM yet) and silently skip the render.
	*
	* CRUD is wired through the calendar's `onEventUpdate` callback (drag-resize →
	* DB update) plus a "New event" affordance and `onEventClick` → confirm-delete;
	* each mutation syncs to SQLite via the API, with the DB as source of truth
	* (a failed mutation refetches and reconciles).
	*
	* schedule-x's `CalendarEventExternal` types `start`/`end` as Temporal types
	* but accepts ISO strings at runtime (the documented usage); we cast at the
	* boundary since our wire type stores ISO strings.
	*/
	/** ISO datetime (yyyy-MM-ddTHH:mm) for "now rounded up to the next hour". */
	function nextHourIso() {
		const d = /* @__PURE__ */ new Date();
		d.setMinutes(0, 0, 0);
		d.setHours(d.getHours() + 1);
		return d.toISOString().slice(0, 16);
	}
	/** ISO datetime one hour after the given yyyy-MM-ddTHH:mm. */
	function plusOneHour(iso) {
		const d = /* @__PURE__ */ new Date(`${iso}:00`);
		d.setHours(d.getHours() + 1);
		return d.toISOString().slice(0, 16);
	}
	/** A deps-missing repair banner (mirrors SearchView's SearchDepsBanner). */
	function CalendarDepsBanner(props) {
		const { info } = props;
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: sidebar_module_css_default.terminalDepsBanner,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: sidebar_module_css_default.terminalDepsTitle,
					children: t("calendarDepsFailed")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: sidebar_module_css_default.terminalDepsHint,
					children: t("calendarDepsHint")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: sidebar_module_css_default.terminalDepsCommandRow,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
						className: sidebar_module_css_default.terminalRepairCommand,
						children: info.command
					})
				}),
				info.note !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: sidebar_module_css_default.terminalDepsNote,
					children: info.note
				})
			]
		});
	}
	function CalendarView(props) {
		const { visible = true } = props;
		const containerRef = (0, react.useRef)(null);
		const calendarRef = (0, react.useRef)(null);
		const [state, setState] = (0, react.useState)({ status: "loading" });
		(0, react.useEffect)(() => {
			if (!visible) return;
			let cancelled = false;
			async function init() {
				const deps = await api.calendarDeps();
				if (cancelled) return;
				if (deps.ok === false) {
					setState({
						status: "deps-missing",
						info: deps
					});
					return;
				}
				let events;
				try {
					const result = await api.calendarList();
					if (cancelled) return;
					events = result.events;
				} catch (error) {
					if (cancelled) return;
					setState({
						status: "error",
						message: error instanceof Error ? error.message : String(error)
					});
					return;
				}
				const calendar = createCalendar({
					views: [
						viewMonthGrid,
						viewWeek,
						viewDay
					],
					events,
					isDark: isDarkScheme(),
					callbacks: {
						onEventUpdate: (event) => {
							const id = String(event.id);
							api.calendarUpdate({
								id,
								...event.title !== void 0 ? { title: event.title } : {},
								start: String(event.start),
								end: String(event.end),
								...event.location !== void 0 ? { location: event.location } : {},
								...event.description !== void 0 ? { description: event.description } : {},
								...event.calendarId !== void 0 ? { calendarId: event.calendarId } : {}
							}).catch(() => {
								reconcile(calendarRef.current);
							});
						},
						onEventClick: (event) => {
							const id = String(event.id);
							const label = event.title ?? t("calendarUntitledEvent");
							if (window.confirm(t("calendarDeleteConfirm", { title: label }))) api.calendarDelete(id).then((result) => {
								if (result.changes > 0) calendarRef.current?.events.remove(id);
							}).catch(() => {
								reconcile(calendarRef.current);
							});
						}
					}
				});
				if (cancelled) {
					calendar.destroy();
					return;
				}
				calendarRef.current = calendar;
				setState({ status: "ready" });
			}
			init().catch((error) => {
				if (!cancelled) setState({
					status: "error",
					message: error instanceof Error ? error.message : String(error)
				});
			});
			const unsubscribe = subscribeColorScheme(() => {
				try {
					calendarRef.current?.setTheme(isDarkScheme() ? "dark" : "light");
				} catch {}
			});
			return () => {
				cancelled = true;
				unsubscribe();
				calendarRef.current?.destroy();
				calendarRef.current = null;
			};
		}, [visible]);
		(0, react.useEffect)(() => {
			if (state.status !== "ready") return;
			const cal = calendarRef.current;
			const el = containerRef.current;
			if (cal !== null && el !== null) cal.render(el);
		}, [state.status]);
		/** Create a new 1-hour event (title via prompt; drag to move/resize). */
		function createEvent() {
			const title = window.prompt(t("calendarNewEventPrompt"), t("calendarUntitledEvent"));
			if (title === null) return;
			const start = nextHourIso();
			const event = {
				id: crypto.randomUUID(),
				title: title === "" ? t("calendarUntitledEvent") : title,
				start,
				end: plusOneHour(start)
			};
			api.calendarCreate(event).then(() => {
				calendarRef.current?.events.add(event);
			}).catch((error) => {
				if (error instanceof ResttyApiError) setState({
					status: "error",
					message: error.message
				});
			});
		}
		if (state.status === "loading") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: sidebar_module_css_default.editorPlaceholder,
			children: t("loading")
		});
		if (state.status === "deps-missing") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CalendarDepsBanner, { info: state.info });
		if (state.status === "error") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: sidebar_module_css_default.editorError,
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: state.message })
		});
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				flex: 1,
				minHeight: 0
			},
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					padding: "6px 8px",
					flex: "0 0 auto"
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: sidebar_module_css_default.terminalRetry,
					onClick: createEvent,
					children: t("calendarNewEvent")
				})
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				ref: containerRef,
				style: {
					flex: 1,
					minHeight: 0,
					overflow: "hidden"
				}
			})]
		});
	}
	/** Refetch all events from the DB and reconcile the calendar (source of truth). */
	async function reconcile(calendar) {
		if (calendar === null) return;
		try {
			const result = await api.calendarList();
			calendar.events.set(result.events);
		} catch {}
	}
	//#endregion
	exports.CalendarView = CalendarView;
	return module.exports;
};

//# sourceMappingURL=client-calendar.js.map