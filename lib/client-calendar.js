globalThis.__dshPowerdeskChunks__ = globalThis.__dshPowerdeskChunks__ || {};
globalThis.__dshPowerdeskChunks__["calendar"] = (require) => {
	var module = { exports: {} };
	var exports = module.exports;
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
	//#region \0rolldown/runtime.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __esmMin = (fn, res, err) => () => {
		if (err) throw err[0];
		try {
			return fn && (res = fn(fn = 0)), res;
		} catch (e) {
			throw err = [e], e;
		}
	};
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	var __toCommonJS = (mod) => __hasOwnProp.call(mod, "module.exports") ? mod["module.exports"] : __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	//#endregion
	let react = require("react");
	let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
	let react_jsx_runtime = require("react/jsx-runtime");
	//#region node_modules/.pnpm/preact@10.12.1/node_modules/preact/dist/preact.module.js
	var preact_module_exports = /* @__PURE__ */ __exportAll({
		Component: () => x$2,
		Fragment: () => _$1,
		cloneElement: () => F$2,
		createContext: () => G$1,
		createElement: () => y$1,
		createRef: () => d$1,
		h: () => y$1,
		hydrate: () => E$1,
		isValidElement: () => i$1,
		options: () => l$1,
		render: () => D$1,
		toChildArray: () => j$2
	});
	function h$1(n, l) {
		for (var u in l) n[u] = l[u];
		return n;
	}
	function v$1(n) {
		var l = n.parentNode;
		l && l.removeChild(n);
	}
	function y$1(l, u, i) {
		var t, r, o, f = {};
		for (o in u) "key" == o ? t = u[o] : "ref" == o ? r = u[o] : f[o] = u[o];
		if (arguments.length > 2 && (f.children = arguments.length > 3 ? n.call(arguments, 2) : i), "function" == typeof l && null != l.defaultProps) for (o in l.defaultProps) void 0 === f[o] && (f[o] = l.defaultProps[o]);
		return p$1(l, f, t, r, null);
	}
	function p$1(n, i, t, r, o) {
		var f = {
			type: n,
			props: i,
			key: t,
			ref: r,
			__k: null,
			__: null,
			__b: 0,
			__e: null,
			__d: void 0,
			__c: null,
			__h: null,
			constructor: void 0,
			__v: null == o ? ++u$1 : o
		};
		return null == o && null != l$1.vnode && l$1.vnode(f), f;
	}
	function d$1() {
		return { current: null };
	}
	function _$1(n) {
		return n.children;
	}
	function k$2(n, l, u, i, t) {
		var r;
		for (r in u) "children" === r || "key" === r || r in l || g$2(n, r, null, u[r], i);
		for (r in l) t && "function" != typeof l[r] || "children" === r || "key" === r || "value" === r || "checked" === r || u[r] === l[r] || g$2(n, r, l[r], u[r], i);
	}
	function b$1(n, l, u) {
		"-" === l[0] ? n.setProperty(l, null == u ? "" : u) : n[l] = null == u ? "" : "number" != typeof u || a$1.test(l) ? u : u + "px";
	}
	function g$2(n, l, u, i, t) {
		var r;
		n: if ("style" === l) if ("string" == typeof u) n.style.cssText = u;
		else {
			if ("string" == typeof i && (n.style.cssText = i = ""), i) for (l in i) u && l in u || b$1(n.style, l, "");
			if (u) for (l in u) i && u[l] === i[l] || b$1(n.style, l, u[l]);
		}
		else if ("o" === l[0] && "n" === l[1]) r = l !== (l = l.replace(/Capture$/, "")), l = l.toLowerCase() in n ? l.toLowerCase().slice(2) : l.slice(2), n.l || (n.l = {}), n.l[l + r] = u, u ? i || n.addEventListener(l, r ? w$2 : m$1, r) : n.removeEventListener(l, r ? w$2 : m$1, r);
		else if ("dangerouslySetInnerHTML" !== l) {
			if (t) l = l.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
			else if ("width" !== l && "height" !== l && "href" !== l && "list" !== l && "form" !== l && "tabIndex" !== l && "download" !== l && l in n) try {
				n[l] = null == u ? "" : u;
				break n;
			} catch (n) {}
			"function" == typeof u || (null == u || !1 === u && -1 == l.indexOf("-") ? n.removeAttribute(l) : n.setAttribute(l, u));
		}
	}
	function m$1(n) {
		t$2 = !0;
		try {
			return this.l[n.type + !1](l$1.event ? l$1.event(n) : n);
		} finally {
			t$2 = !1;
		}
	}
	function w$2(n) {
		t$2 = !0;
		try {
			return this.l[n.type + !0](l$1.event ? l$1.event(n) : n);
		} finally {
			t$2 = !1;
		}
	}
	function x$2(n, l) {
		this.props = n, this.context = l;
	}
	function A$2(n, l) {
		if (null == l) return n.__ ? A$2(n.__, n.__.__k.indexOf(n) + 1) : null;
		for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
		return "function" == typeof n.type ? A$2(n) : null;
	}
	function P$2(n) {
		var l, u;
		if (null != (n = n.__) && null != n.__c) {
			for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) {
				n.__e = n.__c.base = u.__e;
				break;
			}
			return P$2(n);
		}
	}
	function C$1(n) {
		t$2 ? setTimeout(n) : f$1(n);
	}
	function T$2(n) {
		(!n.__d && (n.__d = !0) && r$1.push(n) && !$$1.__r++ || o$1 !== l$1.debounceRendering) && ((o$1 = l$1.debounceRendering) || C$1)($$1);
	}
	function $$1() {
		var n, l, u, i, t, o, f, e;
		for (r$1.sort(function(n, l) {
			return n.__v.__b - l.__v.__b;
		}); n = r$1.shift();) n.__d && (l = r$1.length, i = void 0, t = void 0, f = (o = (u = n).__v).__e, (e = u.__P) && (i = [], (t = h$1({}, o)).__v = o.__v + 1, M$1(e, o, t, u.__n, void 0 !== e.ownerSVGElement, null != o.__h ? [f] : null, i, null == f ? A$2(o) : f, o.__h), N$1(i, o), o.__e != f && P$2(o)), r$1.length > l && r$1.sort(function(n, l) {
			return n.__v.__b - l.__v.__b;
		}));
		$$1.__r = 0;
	}
	function H$1(n, l, u, i, t, r, o, f, e, a) {
		var h, v, y, d, k, b, g, m = i && i.__k || s$1, w = m.length;
		for (u.__k = [], h = 0; h < l.length; h++) if (null != (d = u.__k[h] = null == (d = l[h]) || "boolean" == typeof d ? null : "string" == typeof d || "number" == typeof d || "bigint" == typeof d ? p$1(null, d, null, null, d) : Array.isArray(d) ? p$1(_$1, { children: d }, null, null, null) : d.__b > 0 ? p$1(d.type, d.props, d.key, d.ref ? d.ref : null, d.__v) : d)) {
			if (d.__ = u, d.__b = u.__b + 1, null === (y = m[h]) || y && d.key == y.key && d.type === y.type) m[h] = void 0;
			else for (v = 0; v < w; v++) {
				if ((y = m[v]) && d.key == y.key && d.type === y.type) {
					m[v] = void 0;
					break;
				}
				y = null;
			}
			M$1(n, d, y = y || c$1, t, r, o, f, e, a), k = d.__e, (v = d.ref) && y.ref != v && (g || (g = []), y.ref && g.push(y.ref, null, d), g.push(v, d.__c || k, d)), null != k ? (b ??= k, "function" == typeof d.type && d.__k === y.__k ? d.__d = e = I$1(d, e, n) : e = z$2(n, d, y, m, k, e), "function" == typeof u.type && (u.__d = e)) : e && y.__e == e && e.parentNode != n && (e = A$2(y));
		}
		for (u.__e = b, h = w; h--;) null != m[h] && ("function" == typeof u.type && null != m[h].__e && m[h].__e == u.__d && (u.__d = L$1(i).nextSibling), q$2(m[h], m[h]));
		if (g) for (h = 0; h < g.length; h++) S(g[h], g[++h], g[++h]);
	}
	function I$1(n, l, u) {
		for (var i, t = n.__k, r = 0; t && r < t.length; r++) (i = t[r]) && (i.__ = n, l = "function" == typeof i.type ? I$1(i, l, u) : z$2(u, i, i, t, i.__e, l));
		return l;
	}
	function j$2(n, l) {
		return l = l || [], null == n || "boolean" == typeof n || (Array.isArray(n) ? n.some(function(n) {
			j$2(n, l);
		}) : l.push(n)), l;
	}
	function z$2(n, l, u, i, t, r) {
		var o, f, e;
		if (void 0 !== l.__d) o = l.__d, l.__d = void 0;
		else if (null == u || t != r || null == t.parentNode) n: if (null == r || r.parentNode !== n) n.appendChild(t), o = null;
		else {
			for (f = r, e = 0; (f = f.nextSibling) && e < i.length; e += 1) if (f == t) break n;
			n.insertBefore(t, r), o = r;
		}
		return void 0 !== o ? o : t.nextSibling;
	}
	function L$1(n) {
		var l, u, i;
		if (null == n.type || "string" == typeof n.type) return n.__e;
		if (n.__k) {
			for (l = n.__k.length - 1; l >= 0; l--) if ((u = n.__k[l]) && (i = L$1(u))) return i;
		}
		return null;
	}
	function M$1(n, u, i, t, r, o, f, e, c) {
		var s, a, v, y, p, d, k, b, g, m, w, A, P, C, T, $ = u.type;
		if (void 0 !== u.constructor) return null;
		null != i.__h && (c = i.__h, e = u.__e = i.__e, u.__h = null, o = [e]), (s = l$1.__b) && s(u);
		try {
			n: if ("function" == typeof $) {
				if (b = u.props, g = (s = $.contextType) && t[s.__c], m = s ? g ? g.props.value : s.__ : t, i.__c ? k = (a = u.__c = i.__c).__ = a.__E : ("prototype" in $ && $.prototype.render ? u.__c = a = new $(b, m) : (u.__c = a = new x$2(b, m), a.constructor = $, a.render = B$2), g && g.sub(a), a.props = b, a.state || (a.state = {}), a.context = m, a.__n = t, v = a.__d = !0, a.__h = [], a._sb = []), a.__s ?? (a.__s = a.state), null != $.getDerivedStateFromProps && (a.__s == a.state && (a.__s = h$1({}, a.__s)), h$1(a.__s, $.getDerivedStateFromProps(b, a.__s))), y = a.props, p = a.state, a.__v = u, v) null == $.getDerivedStateFromProps && null != a.componentWillMount && a.componentWillMount(), null != a.componentDidMount && a.__h.push(a.componentDidMount);
				else {
					if (null == $.getDerivedStateFromProps && b !== y && null != a.componentWillReceiveProps && a.componentWillReceiveProps(b, m), !a.__e && null != a.shouldComponentUpdate && !1 === a.shouldComponentUpdate(b, a.__s, m) || u.__v === i.__v) {
						for (u.__v !== i.__v && (a.props = b, a.state = a.__s, a.__d = !1), u.__e = i.__e, u.__k = i.__k, u.__k.forEach(function(n) {
							n && (n.__ = u);
						}), w = 0; w < a._sb.length; w++) a.__h.push(a._sb[w]);
						a._sb = [], a.__h.length && f.push(a);
						break n;
					}
					null != a.componentWillUpdate && a.componentWillUpdate(b, a.__s, m), null != a.componentDidUpdate && a.__h.push(function() {
						a.componentDidUpdate(y, p, d);
					});
				}
				if (a.context = m, a.props = b, a.__P = n, A = l$1.__r, P = 0, "prototype" in $ && $.prototype.render) {
					for (a.state = a.__s, a.__d = !1, A && A(u), s = a.render(a.props, a.state, a.context), C = 0; C < a._sb.length; C++) a.__h.push(a._sb[C]);
					a._sb = [];
				} else do
					a.__d = !1, A && A(u), s = a.render(a.props, a.state, a.context), a.state = a.__s;
				while (a.__d && ++P < 25);
				a.state = a.__s, null != a.getChildContext && (t = h$1(h$1({}, t), a.getChildContext())), v || null == a.getSnapshotBeforeUpdate || (d = a.getSnapshotBeforeUpdate(y, p)), T = null != s && s.type === _$1 && null == s.key ? s.props.children : s, H$1(n, Array.isArray(T) ? T : [T], u, i, t, r, o, f, e, c), a.base = u.__e, u.__h = null, a.__h.length && f.push(a), k && (a.__E = a.__ = null), a.__e = !1;
			} else null == o && u.__v === i.__v ? (u.__k = i.__k, u.__e = i.__e) : u.__e = O$1(i.__e, u, i, t, r, o, f, c);
			(s = l$1.diffed) && s(u);
		} catch (n) {
			u.__v = null, (c || null != o) && (u.__e = e, u.__h = !!c, o[o.indexOf(e)] = null), l$1.__e(n, u, i);
		}
	}
	function N$1(n, u) {
		l$1.__c && l$1.__c(u, n), n.some(function(u) {
			try {
				n = u.__h, u.__h = [], n.some(function(n) {
					n.call(u);
				});
			} catch (n) {
				l$1.__e(n, u.__v);
			}
		});
	}
	function O$1(l, u, i, t, r, o, f, e) {
		var s, a, h, y = i.props, p = u.props, d = u.type, _ = 0;
		if ("svg" === d && (r = !0), null != o) {
			for (; _ < o.length; _++) if ((s = o[_]) && "setAttribute" in s == !!d && (d ? s.localName === d : 3 === s.nodeType)) {
				l = s, o[_] = null;
				break;
			}
		}
		if (null == l) {
			if (null === d) return document.createTextNode(p);
			l = r ? document.createElementNS("http://www.w3.org/2000/svg", d) : document.createElement(d, p.is && p), o = null, e = !1;
		}
		if (null === d) y === p || e && l.data === p || (l.data = p);
		else {
			if (o = o && n.call(l.childNodes), a = (y = i.props || c$1).dangerouslySetInnerHTML, h = p.dangerouslySetInnerHTML, !e) {
				if (null != o) for (y = {}, _ = 0; _ < l.attributes.length; _++) y[l.attributes[_].name] = l.attributes[_].value;
				(h || a) && (h && (a && h.__html == a.__html || h.__html === l.innerHTML) || (l.innerHTML = h && h.__html || ""));
			}
			if (k$2(l, p, y, r, e), h) u.__k = [];
			else if (_ = u.props.children, H$1(l, Array.isArray(_) ? _ : [_], u, i, t, r && "foreignObject" !== d, o, f, o ? o[0] : i.__k && A$2(i, 0), e), null != o) for (_ = o.length; _--;) null != o[_] && v$1(o[_]);
			e || ("value" in p && void 0 !== (_ = p.value) && (_ !== l.value || "progress" === d && !_ || "option" === d && _ !== y.value) && g$2(l, "value", _, y.value, !1), "checked" in p && void 0 !== (_ = p.checked) && _ !== l.checked && g$2(l, "checked", _, y.checked, !1));
		}
		return l;
	}
	function S(n, u, i) {
		try {
			"function" == typeof n ? n(u) : n.current = u;
		} catch (n) {
			l$1.__e(n, i);
		}
	}
	function q$2(n, u, i) {
		var t, r;
		if (l$1.unmount && l$1.unmount(n), (t = n.ref) && (t.current && t.current !== n.__e || S(t, null, u)), null != (t = n.__c)) {
			if (t.componentWillUnmount) try {
				t.componentWillUnmount();
			} catch (n) {
				l$1.__e(n, u);
			}
			t.base = t.__P = null, n.__c = void 0;
		}
		if (t = n.__k) for (r = 0; r < t.length; r++) t[r] && q$2(t[r], u, i || "function" != typeof n.type);
		i || null == n.__e || v$1(n.__e), n.__ = n.__e = n.__d = void 0;
	}
	function B$2(n, l, u) {
		return this.constructor(n, u);
	}
	function D$1(u, i, t) {
		var r, o, f;
		l$1.__ && l$1.__(u, i), o = (r = "function" == typeof t) ? null : t && t.__k || i.__k, f = [], M$1(i, u = (!r && t || i).__k = y$1(_$1, null, [u]), o || c$1, c$1, void 0 !== i.ownerSVGElement, !r && t ? [t] : o ? null : i.firstChild ? n.call(i.childNodes) : null, f, !r && t ? t : o ? o.__e : i.firstChild, r), N$1(f, u);
	}
	function E$1(n, l) {
		D$1(n, l, E$1);
	}
	function F$2(l, u, i) {
		var t, r, o, f = h$1({}, l.props);
		for (o in u) "key" == o ? t = u[o] : "ref" == o ? r = u[o] : f[o] = u[o];
		return arguments.length > 2 && (f.children = arguments.length > 3 ? n.call(arguments, 2) : i), p$1(l.type, f, t || l.key, r || l.ref, null);
	}
	function G$1(n, l) {
		var u = {
			__c: l = "__cC" + e$1++,
			__: n,
			Consumer: function(n, l) {
				return n.children(l);
			},
			Provider: function(n) {
				var u, i;
				return this.getChildContext || (u = [], (i = {})[l] = this, this.getChildContext = function() {
					return i;
				}, this.shouldComponentUpdate = function(n) {
					this.props.value !== n.value && u.some(function(n) {
						n.__e = !0, T$2(n);
					});
				}, this.sub = function(n) {
					u.push(n);
					var l = n.componentWillUnmount;
					n.componentWillUnmount = function() {
						u.splice(u.indexOf(n), 1), l && l.call(n);
					};
				}), n.children;
			}
		};
		return u.Provider.__ = u.Consumer.contextType = u;
	}
	var n, l$1, u$1, i$1, t$2, r$1, o$1, f$1, e$1, c$1, s$1, a$1;
	var init_preact_module = __esmMin((() => {
		c$1 = {};
		s$1 = [];
		a$1 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
		n = s$1.slice, l$1 = { __e: function(n, l, u, i) {
			for (var t, r, o; l = l.__;) if ((t = l.__c) && !t.__) try {
				if ((r = t.constructor) && null != r.getDerivedStateFromError && (t.setState(r.getDerivedStateFromError(n)), o = t.__d), null != t.componentDidCatch && (t.componentDidCatch(n, i || {}), o = t.__d), o) return t.__E = t;
			} catch (l) {
				n = l;
			}
			throw n;
		} }, u$1 = 0, i$1 = function(n) {
			return null != n && void 0 === n.constructor;
		}, t$2 = !1, x$2.prototype.setState = function(n, l) {
			var u = null != this.__s && this.__s !== this.state ? this.__s : this.__s = h$1({}, this.state);
			"function" == typeof n && (n = n(h$1({}, u), this.props)), n && h$1(u, n), null != n && this.__v && (l && this._sb.push(l), T$2(this));
		}, x$2.prototype.forceUpdate = function(n) {
			this.__v && (this.__e = !0, n && this.__h.push(n), T$2(this));
		}, x$2.prototype.render = _$1, r$1 = [], f$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, $$1.__r = 0, e$1 = 0;
	}));
	//#endregion
	//#region node_modules/.pnpm/preact@10.12.1/node_modules/preact/hooks/dist/hooks.module.js
	function d(t, u) {
		l$1.__h && l$1.__h(r, t, o || u), o = 0;
		var i = r.__H || (r.__H = {
			__: [],
			__h: []
		});
		return t >= i.__.length && i.__.push({ __V: c }), i.__[t];
	}
	function p(n) {
		return o = 1, y(B$1, n);
	}
	function y(n, u, i) {
		var o = d(t$1++, 2);
		if (o.t = n, !o.__c && (o.__ = [i ? i(u) : B$1(void 0, u), function(n) {
			var t = o.__N ? o.__N[0] : o.__[0], r = o.t(t, n);
			t !== r && (o.__N = [r, o.__[1]], o.__c.setState({}));
		}], o.__c = r, !r.u)) {
			r.u = !0;
			var f = r.shouldComponentUpdate;
			r.shouldComponentUpdate = function(n, t, r) {
				if (!o.__c.__H) return !0;
				var u = o.__c.__H.__.filter(function(n) {
					return n.__c;
				});
				if (u.every(function(n) {
					return !n.__N;
				})) return !f || f.call(this, n, t, r);
				var i = !1;
				return u.forEach(function(n) {
					if (n.__N) {
						var t = n.__[0];
						n.__ = n.__N, n.__N = void 0, t !== n.__[0] && (i = !0);
					}
				}), !(!i && o.__c.props === n) && (!f || f.call(this, n, t, r));
			};
		}
		return o.__N || o.__;
	}
	function h(u, i) {
		var o = d(t$1++, 3);
		!l$1.__s && z$1(o.__H, i) && (o.__ = u, o.i = i, r.__H.__h.push(o));
	}
	function s(u, i) {
		var o = d(t$1++, 4);
		!l$1.__s && z$1(o.__H, i) && (o.__ = u, o.i = i, r.__h.push(o));
	}
	function _(n) {
		return o = 5, F$1(function() {
			return { current: n };
		}, []);
	}
	function A$1(n, t, r) {
		o = 6, s(function() {
			return "function" == typeof n ? (n(t()), function() {
				return n(null);
			}) : n ? (n.current = t(), function() {
				return n.current = null;
			}) : void 0;
		}, null == r ? r : r.concat(n));
	}
	function F$1(n, r) {
		var u = d(t$1++, 7);
		return z$1(u.__H, r) ? (u.__V = n(), u.i = r, u.__h = n, u.__V) : u.__;
	}
	function T$1(n, t) {
		return o = 8, F$1(function() {
			return n;
		}, t);
	}
	function q$1(n) {
		var u = r.context[n.__c], i = d(t$1++, 9);
		return i.c = n, u ? (i.__ ?? (i.__ = !0, u.sub(r)), u.props.value) : n.__;
	}
	function x$1(t, r) {
		l$1.useDebugValue && l$1.useDebugValue(r ? r(t) : t);
	}
	function P$1(n) {
		var u = d(t$1++, 10), i = p();
		return u.__ = n, r.componentDidCatch || (r.componentDidCatch = function(n, t) {
			u.__ && u.__(n, t), i[1](n);
		}), [i[0], function() {
			i[1](void 0);
		}];
	}
	function V$1() {
		var n = d(t$1++, 11);
		if (!n.__) {
			for (var u = r.__v; null !== u && !u.__m && null !== u.__;) u = u.__;
			var i = u.__m || (u.__m = [0, 0]);
			n.__ = "P" + i[0] + "-" + i[1]++;
		}
		return n.__;
	}
	function b() {
		for (var t; t = f.shift();) if (t.__P && t.__H) try {
			t.__H.__h.forEach(k$1), t.__H.__h.forEach(w$1), t.__H.__h = [];
		} catch (r) {
			t.__H.__h = [], l$1.__e(r, t.__v);
		}
	}
	function j$1(n) {
		var t, r = function() {
			clearTimeout(u), g$1 && cancelAnimationFrame(t), setTimeout(n);
		}, u = setTimeout(r, 100);
		g$1 && (t = requestAnimationFrame(r));
	}
	function k$1(n) {
		var t = r, u = n.__c;
		"function" == typeof u && (n.__c = void 0, u()), r = t;
	}
	function w$1(n) {
		var t = r;
		n.__c = n.__(), r = t;
	}
	function z$1(n, t) {
		return !n || n.length !== t.length || t.some(function(t, r) {
			return t !== n[r];
		});
	}
	function B$1(n, t) {
		return "function" == typeof t ? t(n) : t;
	}
	var t$1, r, u, i, o, f, c, e, a, v, l, m, g$1;
	var init_hooks_module = __esmMin((() => {
		init_preact_module();
		o = 0;
		f = [];
		c = [];
		e = l$1.__b;
		a = l$1.__r;
		v = l$1.diffed;
		l = l$1.__c;
		m = l$1.unmount;
		l$1.__b = function(n) {
			r = null, e && e(n);
		}, l$1.__r = function(n) {
			a && a(n), t$1 = 0;
			var i = (r = n.__c).__H;
			i && (u === r ? (i.__h = [], r.__h = [], i.__.forEach(function(n) {
				n.__N && (n.__ = n.__N), n.__V = c, n.__N = n.i = void 0;
			})) : (i.__h.forEach(k$1), i.__h.forEach(w$1), i.__h = [])), u = r;
		}, l$1.diffed = function(t) {
			v && v(t);
			var o = t.__c;
			o && o.__H && (o.__H.__h.length && (1 !== f.push(o) && i === l$1.requestAnimationFrame || ((i = l$1.requestAnimationFrame) || j$1)(b)), o.__H.__.forEach(function(n) {
				n.i && (n.__H = n.i), n.__V !== c && (n.__ = n.__V), n.i = void 0, n.__V = c;
			})), u = r = null;
		}, l$1.__c = function(t, r) {
			r.some(function(t) {
				try {
					t.__h.forEach(k$1), t.__h = t.__h.filter(function(n) {
						return !n.__ || w$1(n);
					});
				} catch (u) {
					r.some(function(n) {
						n.__h && (n.__h = []);
					}), r = [], l$1.__e(u, t.__v);
				}
			}), l && l(t, r);
		}, l$1.unmount = function(t) {
			m && m(t);
			var r, u = t.__c;
			u && u.__H && (u.__H.__.forEach(function(n) {
				try {
					k$1(n);
				} catch (n) {
					r = n;
				}
			}), u.__H = void 0, r && l$1.__e(r, u.__v));
		};
		g$1 = "function" == typeof requestAnimationFrame;
	}));
	//#endregion
	//#region node_modules/.pnpm/preact@10.12.1/node_modules/preact/compat/dist/compat.module.js
	var compat_module_exports = /* @__PURE__ */ __exportAll({
		Children: () => O,
		Component: () => x$2,
		Fragment: () => _$1,
		PureComponent: () => w,
		StrictMode: () => vn,
		Suspense: () => D,
		SuspenseList: () => V,
		__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: () => rn,
		cloneElement: () => cn,
		createContext: () => G$1,
		createElement: () => y$1,
		createFactory: () => on,
		createPortal: () => j,
		createRef: () => d$1,
		default: () => bn,
		findDOMNode: () => an,
		flushSync: () => hn,
		forwardRef: () => k,
		hydrate: () => q,
		isValidElement: () => ln,
		lazy: () => M,
		memo: () => R,
		render: () => Y,
		startTransition: () => dn,
		unmountComponentAtNode: () => fn,
		unstable_batchedUpdates: () => sn,
		useCallback: () => T$1,
		useContext: () => q$1,
		useDebugValue: () => x$1,
		useDeferredValue: () => pn,
		useEffect: () => h,
		useErrorBoundary: () => P$1,
		useId: () => V$1,
		useImperativeHandle: () => A$1,
		useInsertionEffect: () => yn,
		useLayoutEffect: () => s,
		useMemo: () => F$1,
		useReducer: () => y,
		useRef: () => _,
		useState: () => p,
		useSyncExternalStore: () => _n,
		useTransition: () => mn,
		version: () => un
	});
	function g(n, t) {
		for (var e in t) n[e] = t[e];
		return n;
	}
	function C(n, t) {
		for (var e in n) if ("__source" !== e && !(e in t)) return !0;
		for (var r in t) if ("__source" !== r && n[r] !== t[r]) return !0;
		return !1;
	}
	function E(n, t) {
		return n === t && (0 !== n || 1 / n == 1 / t) || n != n && t != t;
	}
	function w(n) {
		this.props = n;
	}
	function R(n, e) {
		function r(n) {
			var t = this.props.ref, r = t == n.ref;
			return !r && t && (t.call ? t(null) : t.current = null), e ? !e(this.props, n) || !r : C(this.props, n);
		}
		function u(e) {
			return this.shouldComponentUpdate = r, y$1(n, e);
		}
		return u.displayName = "Memo(" + (n.displayName || n.name) + ")", u.prototype.isReactComponent = !0, u.__f = !0, u;
	}
	function k(n) {
		function t(t) {
			var e = g({}, t);
			return delete e.ref, n(e, t.ref || null);
		}
		return t.$$typeof = N, t.render = t, t.prototype.isReactComponent = t.__f = !0, t.displayName = "ForwardRef(" + (n.displayName || n.name) + ")", t;
	}
	function L(n, t, e) {
		return n && (n.__c && n.__c.__H && (n.__c.__H.__.forEach(function(n) {
			"function" == typeof n.__c && n.__c();
		}), n.__c.__H = null), null != (n = g({}, n)).__c && (n.__c.__P === e && (n.__c.__P = t), n.__c = null), n.__k = n.__k && n.__k.map(function(n) {
			return L(n, t, e);
		})), n;
	}
	function U(n, t, e) {
		return n && (n.__v = null, n.__k = n.__k && n.__k.map(function(n) {
			return U(n, t, e);
		}), n.__c && n.__c.__P === t && (n.__e && e.insertBefore(n.__e, n.__d), n.__c.__e = !0, n.__c.__P = e)), n;
	}
	function D() {
		this.__u = 0, this.t = null, this.__b = null;
	}
	function F(n) {
		var t = n.__.__c;
		return t && t.__a && t.__a(n);
	}
	function M(n) {
		var e, r, u;
		function o(o) {
			if (e || (e = n()).then(function(n) {
				r = n.default || n;
			}, function(n) {
				u = n;
			}), u) throw u;
			if (!r) throw e;
			return y$1(r, o);
		}
		return o.displayName = "Lazy", o.__f = !0, o;
	}
	function V() {
		this.u = null, this.o = null;
	}
	function P(n) {
		return this.getChildContext = function() {
			return n.context;
		}, n.children;
	}
	function $(n) {
		var e = this, r = n.i;
		e.componentWillUnmount = function() {
			D$1(null, e.l), e.l = null, e.i = null;
		}, e.i && e.i !== r && e.componentWillUnmount(), n.__v ? (e.l || (e.i = r, e.l = {
			nodeType: 1,
			parentNode: r,
			childNodes: [],
			appendChild: function(n) {
				this.childNodes.push(n), e.i.appendChild(n);
			},
			insertBefore: function(n, t) {
				this.childNodes.push(n), e.i.appendChild(n);
			},
			removeChild: function(n) {
				this.childNodes.splice(this.childNodes.indexOf(n) >>> 1, 1), e.i.removeChild(n);
			}
		}), D$1(y$1(P, { context: e.context }, n.__v), e.l)) : e.l && e.componentWillUnmount();
	}
	function j(n, e) {
		var r = y$1($, {
			__v: n,
			i: e
		});
		return r.containerInfo = e, r;
	}
	function Y(n, t, e) {
		return t.__k ?? (t.textContent = ""), D$1(n, t), "function" == typeof e && e(), n ? n.__c : null;
	}
	function q(n, t, e) {
		return E$1(n, t), "function" == typeof e && e(), n ? n.__c : null;
	}
	function J() {}
	function K() {
		return this.cancelBubble;
	}
	function Q() {
		return this.defaultPrevented;
	}
	function on(n) {
		return y$1.bind(null, n);
	}
	function ln(n) {
		return !!n && n.$$typeof === z;
	}
	function cn(n) {
		return ln(n) ? F$2.apply(null, arguments) : n;
	}
	function fn(n) {
		return !!n.__k && (D$1(null, n), !0);
	}
	function an(n) {
		return n && (n.base || 1 === n.nodeType && n) || null;
	}
	function dn(n) {
		n();
	}
	function pn(n) {
		return n;
	}
	function mn() {
		return [!1, dn];
	}
	function _n(n, t) {
		var e = t(), r = p({ h: {
			__: e,
			v: t
		} }), u = r[0].h, o = r[1];
		return s(function() {
			u.__ = e, u.v = t, E(u.__, t()) || o({ h: u });
		}, [
			n,
			e,
			t
		]), h(function() {
			return E(u.__, u.v()) || o({ h: u }), n(function() {
				E(u.__, u.v()) || o({ h: u });
			});
		}, [n]), e;
	}
	var x, N, A, O, T, I, W, z, B, H, Z, G, X, nn, tn, en$1, rn, un, sn, hn, vn, yn, bn;
	var init_compat_module = __esmMin((() => {
		init_preact_module();
		init_hooks_module();
		init_hooks_module();
		(w.prototype = new x$2()).isPureReactComponent = !0, w.prototype.shouldComponentUpdate = function(n, t) {
			return C(this.props, n) || C(this.state, t);
		};
		x = l$1.__b;
		l$1.__b = function(n) {
			n.type && n.type.__f && n.ref && (n.props.ref = n.ref, n.ref = null), x && x(n);
		};
		N = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
		A = function(n, t) {
			return null == n ? null : j$2(j$2(n).map(t));
		};
		O = {
			map: A,
			forEach: A,
			count: function(n) {
				return n ? j$2(n).length : 0;
			},
			only: function(n) {
				var t = j$2(n);
				if (1 !== t.length) throw "Children.only";
				return t[0];
			},
			toArray: j$2
		};
		T = l$1.__e;
		l$1.__e = function(n, t, e, r) {
			if (n.then) {
				for (var u, o = t; o = o.__;) if ((u = o.__c) && u.__c) return t.__e ?? (t.__e = e.__e, t.__k = e.__k), u.__c(n, t);
			}
			T(n, t, e, r);
		};
		I = l$1.unmount;
		l$1.unmount = function(n) {
			var t = n.__c;
			t && t.__R && t.__R(), t && !0 === n.__h && (n.type = null), I && I(n);
		}, (D.prototype = new x$2()).__c = function(n, t) {
			var e = t.__c, r = this;
			r.t ??= [], r.t.push(e);
			var u = F(r.__v), o = !1, i = function() {
				o || (o = !0, e.__R = null, u ? u(l) : l());
			};
			e.__R = i;
			var l = function() {
				if (!--r.__u) {
					if (r.state.__a) {
						var n = r.state.__a;
						r.__v.__k[0] = U(n, n.__c.__P, n.__c.__O);
					}
					var t;
					for (r.setState({ __a: r.__b = null }); t = r.t.pop();) t.forceUpdate();
				}
			}, c = !0 === t.__h;
			r.__u++ || c || r.setState({ __a: r.__b = r.__v.__k[0] }), n.then(i, i);
		}, D.prototype.componentWillUnmount = function() {
			this.t = [];
		}, D.prototype.render = function(n, e) {
			if (this.__b) {
				if (this.__v.__k) {
					var r = document.createElement("div"), o = this.__v.__k[0].__c;
					this.__v.__k[0] = L(this.__b, r, o.__O = o.__P);
				}
				this.__b = null;
			}
			var i = e.__a && y$1(_$1, null, n.fallback);
			return i && (i.__h = null), [y$1(_$1, null, e.__a ? null : n.children), i];
		};
		W = function(n, t, e) {
			if (++e[1] === e[0] && n.o.delete(t), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.o.size)) for (e = n.u; e;) {
				for (; e.length > 3;) e.pop()();
				if (e[1] < e[0]) break;
				n.u = e = e[2];
			}
		};
		(V.prototype = new x$2()).__a = function(n) {
			var t = this, e = F(t.__v), r = t.o.get(n);
			return r[0]++, function(u) {
				var o = function() {
					t.props.revealOrder ? (r.push(u), W(t, n, r)) : u();
				};
				e ? e(o) : o();
			};
		}, V.prototype.render = function(n) {
			this.u = null, this.o = /* @__PURE__ */ new Map();
			var t = j$2(n.children);
			n.revealOrder && "b" === n.revealOrder[0] && t.reverse();
			for (var e = t.length; e--;) this.o.set(t[e], this.u = [
				1,
				0,
				this.u
			]);
			return n.children;
		}, V.prototype.componentDidUpdate = V.prototype.componentDidMount = function() {
			var n = this;
			this.o.forEach(function(t, e) {
				W(n, e, t);
			});
		};
		z = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
		B = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
		H = "undefined" != typeof document;
		Z = function(n) {
			return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/i : /fil|che|ra/i).test(n);
		};
		x$2.prototype.isReactComponent = {}, [
			"componentWillMount",
			"componentWillReceiveProps",
			"componentWillUpdate"
		].forEach(function(t) {
			Object.defineProperty(x$2.prototype, t, {
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
		G = l$1.event;
		l$1.event = function(n) {
			return G && (n = G(n)), n.persist = J, n.isPropagationStopped = K, n.isDefaultPrevented = Q, n.nativeEvent = n;
		};
		nn = {
			configurable: !0,
			get: function() {
				return this.class;
			}
		};
		tn = l$1.vnode;
		l$1.vnode = function(n) {
			var t = n.type, e = n.props, u = e;
			if ("string" == typeof t) {
				var o = -1 === t.indexOf("-");
				for (var i in u = {}, e) {
					var l = e[i];
					H && "children" === i && "noscript" === t || "value" === i && "defaultValue" in e && null == l || ("defaultValue" === i && "value" in e && null == e.value ? i = "value" : "download" === i && !0 === l ? l = "" : /ondoubleclick/i.test(i) ? i = "ondblclick" : /^onchange(textarea|input)/i.test(i + t) && !Z(e.type) ? i = "oninput" : /^onfocus$/i.test(i) ? i = "onfocusin" : /^onblur$/i.test(i) ? i = "onfocusout" : /^on(Ani|Tra|Tou|BeforeInp|Compo)/.test(i) ? i = i.toLowerCase() : o && B.test(i) ? i = i.replace(/[A-Z0-9]/g, "-$&").toLowerCase() : null === l && (l = void 0), /^oninput$/i.test(i) && (i = i.toLowerCase(), u[i] && (i = "oninputCapture")), u[i] = l);
				}
				"select" == t && u.multiple && Array.isArray(u.value) && (u.value = j$2(e.children).forEach(function(n) {
					n.props.selected = -1 != u.value.indexOf(n.props.value);
				})), "select" == t && null != u.defaultValue && (u.value = j$2(e.children).forEach(function(n) {
					n.props.selected = u.multiple ? -1 != u.defaultValue.indexOf(n.props.value) : u.defaultValue == n.props.value;
				})), n.props = u, e.class != e.className && (nn.enumerable = "className" in e, null != e.className && (u.class = e.className), Object.defineProperty(u, "className", nn));
			}
			n.$$typeof = z, tn && tn(n);
		};
		en$1 = l$1.__r;
		l$1.__r = function(n) {
			en$1 && en$1(n), X = n.__c;
		};
		rn = { ReactCurrentDispatcher: { current: { readContext: function(n) {
			return X.__n[n.__c].props.value;
		} } } };
		un = "17.0.2";
		sn = function(n, t) {
			return n(t);
		};
		hn = function(n, t) {
			return n(t);
		};
		vn = _$1;
		yn = s;
		bn = {
			useState: p,
			useId: V$1,
			useReducer: y,
			useEffect: h,
			useLayoutEffect: s,
			useInsertionEffect: yn,
			useTransition: mn,
			useDeferredValue: pn,
			useSyncExternalStore: _n,
			startTransition: dn,
			useRef: _,
			useImperativeHandle: A$1,
			useMemo: F$1,
			useCallback: T$1,
			useContext: q$1,
			useDebugValue: x$1,
			version: "17.0.2",
			Children: O,
			render: Y,
			hydrate: q,
			unmountComponentAtNode: fn,
			createPortal: j,
			createElement: y$1,
			createContext: G$1,
			createFactory: on,
			cloneElement: cn,
			createRef: d$1,
			Fragment: _$1,
			isValidElement: ln,
			findDOMNode: an,
			Component: x$2,
			PureComponent: w,
			memo: R,
			forwardRef: k,
			flushSync: hn,
			unstable_batchedUpdates: sn,
			StrictMode: vn,
			Suspense: D,
			SuspenseList: V,
			lazy: M,
			__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: rn
		};
	}));
	//#endregion
	//#region node_modules/.pnpm/@fullcalendar+core@6.1.21/node_modules/@fullcalendar/core/internal-common.cjs
	var require_internal_common = /* @__PURE__ */ __commonJSMin(((exports) => {
		var preact = (init_preact_module(), __toCommonJS(preact_module_exports));
		var compat = (init_compat_module(), __toCommonJS(compat_module_exports));
		function _interopNamespace(e) {
			if (e && e.__esModule) return e;
			var n = Object.create(null);
			if (e) Object.keys(e).forEach(function(k) {
				if (k !== "default") {
					var d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: function() {
							return e[k];
						}
					});
				}
			});
			n["default"] = e;
			return Object.freeze(n);
		}
		var preact__namespace = /*#__PURE__*/ _interopNamespace(preact);
		const styleTexts = [];
		const styleEls = /* @__PURE__ */ new Map();
		function injectStyles(styleText) {
			styleTexts.push(styleText);
			styleEls.forEach((styleEl) => {
				appendStylesTo(styleEl, styleText);
			});
		}
		function ensureElHasStyles(el) {
			if (el.isConnected && el.getRootNode) registerStylesRoot(el.getRootNode());
		}
		function registerStylesRoot(rootNode) {
			let styleEl = styleEls.get(rootNode);
			if (!styleEl || !styleEl.isConnected) {
				styleEl = rootNode.querySelector("style[data-fullcalendar]");
				if (!styleEl) {
					styleEl = document.createElement("style");
					styleEl.setAttribute("data-fullcalendar", "");
					const nonce = getNonceValue();
					if (nonce) styleEl.nonce = nonce;
					const parentEl = rootNode === document ? document.head : rootNode;
					const insertBefore = rootNode === document ? parentEl.querySelector("script,link[rel=stylesheet],link[as=style],style") : parentEl.firstChild;
					parentEl.insertBefore(styleEl, insertBefore);
				}
				styleEls.set(rootNode, styleEl);
				hydrateStylesRoot(styleEl);
			}
		}
		function hydrateStylesRoot(styleEl) {
			for (const styleText of styleTexts) appendStylesTo(styleEl, styleText);
		}
		function appendStylesTo(styleEl, styleText) {
			const { sheet } = styleEl;
			const ruleCnt = sheet.cssRules.length;
			styleText.split("}").forEach((styleStr, i) => {
				styleStr = styleStr.trim();
				if (styleStr) sheet.insertRule(styleStr + "}", ruleCnt + i);
			});
		}
		let queriedNonceValue;
		function getNonceValue() {
			if (queriedNonceValue === void 0) queriedNonceValue = queryNonceValue();
			return queriedNonceValue;
		}
		function queryNonceValue() {
			const metaWithNonce = document.querySelector("meta[name=\"csp-nonce\"]");
			if (metaWithNonce && metaWithNonce.hasAttribute("content")) return metaWithNonce.getAttribute("content");
			const elWithNonce = document.querySelector("script[nonce]");
			if (elWithNonce) return elWithNonce.nonce || "";
			return "";
		}
		if (typeof document !== "undefined") registerStylesRoot(document);
		injectStyles(":root{--fc-small-font-size:.85em;--fc-page-bg-color:#fff;--fc-neutral-bg-color:hsla(0,0%,82%,.3);--fc-neutral-text-color:grey;--fc-border-color:#ddd;--fc-button-text-color:#fff;--fc-button-bg-color:#2c3e50;--fc-button-border-color:#2c3e50;--fc-button-hover-bg-color:#1e2b37;--fc-button-hover-border-color:#1a252f;--fc-button-active-bg-color:#1a252f;--fc-button-active-border-color:#151e27;--fc-event-bg-color:#3788d8;--fc-event-border-color:#3788d8;--fc-event-text-color:#fff;--fc-event-selected-overlay-color:rgba(0,0,0,.25);--fc-more-link-bg-color:#d0d0d0;--fc-more-link-text-color:inherit;--fc-event-resizer-thickness:8px;--fc-event-resizer-dot-total-width:8px;--fc-event-resizer-dot-border-width:1px;--fc-non-business-color:hsla(0,0%,84%,.3);--fc-bg-event-color:#8fdf82;--fc-bg-event-opacity:0.3;--fc-highlight-color:rgba(188,232,241,.3);--fc-today-bg-color:rgba(255,220,40,.15);--fc-now-indicator-color:red}.fc-not-allowed,.fc-not-allowed .fc-event{cursor:not-allowed}.fc{display:flex;flex-direction:column;font-size:1em}.fc,.fc *,.fc :after,.fc :before{box-sizing:border-box}.fc table{border-collapse:collapse;border-spacing:0;font-size:1em}.fc th{text-align:center}.fc td,.fc th{padding:0;vertical-align:top}.fc a[data-navlink]{cursor:pointer}.fc a[data-navlink]:hover{text-decoration:underline}.fc-direction-ltr{direction:ltr;text-align:left}.fc-direction-rtl{direction:rtl;text-align:right}.fc-theme-standard td,.fc-theme-standard th{border:1px solid var(--fc-border-color)}.fc-liquid-hack td,.fc-liquid-hack th{position:relative}@font-face{font-family:fcicons;font-style:normal;font-weight:400;src:url(\"data:application/x-font-ttf;charset=utf-8;base64,AAEAAAALAIAAAwAwT1MvMg8SBfAAAAC8AAAAYGNtYXAXVtKNAAABHAAAAFRnYXNwAAAAEAAAAXAAAAAIZ2x5ZgYydxIAAAF4AAAFNGhlYWQUJ7cIAAAGrAAAADZoaGVhB20DzAAABuQAAAAkaG10eCIABhQAAAcIAAAALGxvY2ED4AU6AAAHNAAAABhtYXhwAA8AjAAAB0wAAAAgbmFtZXsr690AAAdsAAABhnBvc3QAAwAAAAAI9AAAACAAAwPAAZAABQAAApkCzAAAAI8CmQLMAAAB6wAzAQkAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADpBgPA/8AAQAPAAEAAAAABAAAAAAAAAAAAAAAgAAAAAAADAAAAAwAAABwAAQADAAAAHAADAAEAAAAcAAQAOAAAAAoACAACAAIAAQAg6Qb//f//AAAAAAAg6QD//f//AAH/4xcEAAMAAQAAAAAAAAAAAAAAAQAB//8ADwABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAABAWIAjQKeAskAEwAAJSc3NjQnJiIHAQYUFwEWMjc2NCcCnuLiDQ0MJAz/AA0NAQAMJAwNDcni4gwjDQwM/wANIwz/AA0NDCMNAAAAAQFiAI0CngLJABMAACUBNjQnASYiBwYUHwEHBhQXFjI3AZ4BAA0N/wAMJAwNDeLiDQ0MJAyNAQAMIw0BAAwMDSMM4uINIwwNDQAAAAIA4gC3Ax4CngATACcAACUnNzY0JyYiDwEGFB8BFjI3NjQnISc3NjQnJiIPAQYUHwEWMjc2NCcB87e3DQ0MIw3VDQ3VDSMMDQ0BK7e3DQ0MJAzVDQ3VDCQMDQ3zuLcMJAwNDdUNIwzWDAwNIwy4twwkDA0N1Q0jDNYMDA0jDAAAAgDiALcDHgKeABMAJwAAJTc2NC8BJiIHBhQfAQcGFBcWMjchNzY0LwEmIgcGFB8BBwYUFxYyNwJJ1Q0N1Q0jDA0Nt7cNDQwjDf7V1Q0N1QwkDA0Nt7cNDQwkDLfWDCMN1Q0NDCQMt7gMIw0MDNYMIw3VDQ0MJAy3uAwjDQwMAAADAFUAAAOrA1UAMwBoAHcAABMiBgcOAQcOAQcOARURFBYXHgEXHgEXHgEzITI2Nz4BNz4BNz4BNRE0JicuAScuAScuASMFITIWFx4BFx4BFx4BFREUBgcOAQcOAQcOASMhIiYnLgEnLgEnLgE1ETQ2Nz4BNz4BNz4BMxMhMjY1NCYjISIGFRQWM9UNGAwLFQkJDgUFBQUFBQ4JCRULDBgNAlYNGAwLFQkJDgUFBQUFBQ4JCRULDBgN/aoCVgQIBAQHAwMFAQIBAQIBBQMDBwQECAT9qgQIBAQHAwMFAQIBAQIBBQMDBwQECASAAVYRGRkR/qoRGRkRA1UFBAUOCQkVDAsZDf2rDRkLDBUJCA4FBQUFBQUOCQgVDAsZDQJVDRkLDBUJCQ4FBAVVAgECBQMCBwQECAX9qwQJAwQHAwMFAQICAgIBBQMDBwQDCQQCVQUIBAQHAgMFAgEC/oAZEhEZGRESGQAAAAADAFUAAAOrA1UAMwBoAIkAABMiBgcOAQcOAQcOARURFBYXHgEXHgEXHgEzITI2Nz4BNz4BNz4BNRE0JicuAScuAScuASMFITIWFx4BFx4BFx4BFREUBgcOAQcOAQcOASMhIiYnLgEnLgEnLgE1ETQ2Nz4BNz4BNz4BMxMzFRQWMzI2PQEzMjY1NCYrATU0JiMiBh0BIyIGFRQWM9UNGAwLFQkJDgUFBQUFBQ4JCRULDBgNAlYNGAwLFQkJDgUFBQUFBQ4JCRULDBgN/aoCVgQIBAQHAwMFAQIBAQIBBQMDBwQECAT9qgQIBAQHAwMFAQIBAQIBBQMDBwQECASAgBkSEhmAERkZEYAZEhIZgBEZGREDVQUEBQ4JCRUMCxkN/asNGQsMFQkIDgUFBQUFBQ4JCBUMCxkNAlUNGQsMFQkJDgUEBVUCAQIFAwIHBAQIBf2rBAkDBAcDAwUBAgICAgEFAwMHBAMJBAJVBQgEBAcCAwUCAQL+gIASGRkSgBkSERmAEhkZEoAZERIZAAABAOIAjQMeAskAIAAAExcHBhQXFjI/ARcWMjc2NC8BNzY0JyYiDwEnJiIHBhQX4uLiDQ0MJAzi4gwkDA0N4uINDQwkDOLiDCQMDQ0CjeLiDSMMDQ3h4Q0NDCMN4uIMIw0MDOLiDAwNIwwAAAABAAAAAQAAa5n0y18PPPUACwQAAAAAANivOVsAAAAA2K85WwAAAAADqwNVAAAACAACAAAAAAAAAAEAAAPA/8AAAAQAAAAAAAOrAAEAAAAAAAAAAAAAAAAAAAALBAAAAAAAAAAAAAAAAgAAAAQAAWIEAAFiBAAA4gQAAOIEAABVBAAAVQQAAOIAAAAAAAoAFAAeAEQAagCqAOoBngJkApoAAQAAAAsAigADAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAA4ArgABAAAAAAABAAcAAAABAAAAAAACAAcAYAABAAAAAAADAAcANgABAAAAAAAEAAcAdQABAAAAAAAFAAsAFQABAAAAAAAGAAcASwABAAAAAAAKABoAigADAAEECQABAA4ABwADAAEECQACAA4AZwADAAEECQADAA4APQADAAEECQAEAA4AfAADAAEECQAFABYAIAADAAEECQAGAA4AUgADAAEECQAKADQApGZjaWNvbnMAZgBjAGkAYwBvAG4Ac1ZlcnNpb24gMS4wAFYAZQByAHMAaQBvAG4AIAAxAC4AMGZjaWNvbnMAZgBjAGkAYwBvAG4Ac2ZjaWNvbnMAZgBjAGkAYwBvAG4Ac1JlZ3VsYXIAUgBlAGcAdQBsAGEAcmZjaWNvbnMAZgBjAGkAYwBvAG4Ac0ZvbnQgZ2VuZXJhdGVkIGJ5IEljb01vb24uAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAEkAYwBvAE0AbwBvAG4ALgAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=\") format(\"truetype\")}.fc-icon{speak:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;display:inline-block;font-family:fcicons!important;font-style:normal;font-variant:normal;font-weight:400;height:1em;line-height:1;text-align:center;text-transform:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:1em}.fc-icon-chevron-left:before{content:\"\\e900\"}.fc-icon-chevron-right:before{content:\"\\e901\"}.fc-icon-chevrons-left:before{content:\"\\e902\"}.fc-icon-chevrons-right:before{content:\"\\e903\"}.fc-icon-minus-square:before{content:\"\\e904\"}.fc-icon-plus-square:before{content:\"\\e905\"}.fc-icon-x:before{content:\"\\e906\"}.fc .fc-button{border-radius:0;font-family:inherit;font-size:inherit;line-height:inherit;margin:0;overflow:visible;text-transform:none}.fc .fc-button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}.fc .fc-button{-webkit-appearance:button}.fc .fc-button:not(:disabled){cursor:pointer}.fc .fc-button{background-color:transparent;border:1px solid transparent;border-radius:.25em;display:inline-block;font-size:1em;font-weight:400;line-height:1.5;padding:.4em .65em;text-align:center;-webkit-user-select:none;-moz-user-select:none;user-select:none;vertical-align:middle}.fc .fc-button:hover{text-decoration:none}.fc .fc-button:focus{box-shadow:0 0 0 .2rem rgba(44,62,80,.25);outline:0}.fc .fc-button:disabled{opacity:.65}.fc .fc-button-primary{background-color:var(--fc-button-bg-color);border-color:var(--fc-button-border-color);color:var(--fc-button-text-color)}.fc .fc-button-primary:hover{background-color:var(--fc-button-hover-bg-color);border-color:var(--fc-button-hover-border-color);color:var(--fc-button-text-color)}.fc .fc-button-primary:disabled{background-color:var(--fc-button-bg-color);border-color:var(--fc-button-border-color);color:var(--fc-button-text-color)}.fc .fc-button-primary:focus{box-shadow:0 0 0 .2rem rgba(76,91,106,.5)}.fc .fc-button-primary:not(:disabled).fc-button-active,.fc .fc-button-primary:not(:disabled):active{background-color:var(--fc-button-active-bg-color);border-color:var(--fc-button-active-border-color);color:var(--fc-button-text-color)}.fc .fc-button-primary:not(:disabled).fc-button-active:focus,.fc .fc-button-primary:not(:disabled):active:focus{box-shadow:0 0 0 .2rem rgba(76,91,106,.5)}.fc .fc-button .fc-icon{font-size:1.5em;vertical-align:middle}.fc .fc-button-group{display:inline-flex;position:relative;vertical-align:middle}.fc .fc-button-group>.fc-button{flex:1 1 auto;position:relative}.fc .fc-button-group>.fc-button.fc-button-active,.fc .fc-button-group>.fc-button:active,.fc .fc-button-group>.fc-button:focus,.fc .fc-button-group>.fc-button:hover{z-index:1}.fc-direction-ltr .fc-button-group>.fc-button:not(:first-child){border-bottom-left-radius:0;border-top-left-radius:0;margin-left:-1px}.fc-direction-ltr .fc-button-group>.fc-button:not(:last-child){border-bottom-right-radius:0;border-top-right-radius:0}.fc-direction-rtl .fc-button-group>.fc-button:not(:first-child){border-bottom-right-radius:0;border-top-right-radius:0;margin-right:-1px}.fc-direction-rtl .fc-button-group>.fc-button:not(:last-child){border-bottom-left-radius:0;border-top-left-radius:0}.fc .fc-toolbar{align-items:center;display:flex;justify-content:space-between}.fc .fc-toolbar.fc-header-toolbar{margin-bottom:1.5em}.fc .fc-toolbar.fc-footer-toolbar{margin-top:1.5em}.fc .fc-toolbar-title{font-size:1.75em;margin:0}.fc-direction-ltr .fc-toolbar>*>:not(:first-child){margin-left:.75em}.fc-direction-rtl .fc-toolbar>*>:not(:first-child){margin-right:.75em}.fc-direction-rtl .fc-toolbar-ltr{flex-direction:row-reverse}.fc .fc-scroller{-webkit-overflow-scrolling:touch;position:relative}.fc .fc-scroller-liquid{height:100%}.fc .fc-scroller-liquid-absolute{bottom:0;left:0;position:absolute;right:0;top:0}.fc .fc-scroller-harness{direction:ltr;overflow:hidden;position:relative}.fc .fc-scroller-harness-liquid{height:100%}.fc-direction-rtl .fc-scroller-harness>.fc-scroller{direction:rtl}.fc-theme-standard .fc-scrollgrid{border:1px solid var(--fc-border-color)}.fc .fc-scrollgrid,.fc .fc-scrollgrid table{table-layout:fixed;width:100%}.fc .fc-scrollgrid table{border-left-style:hidden;border-right-style:hidden;border-top-style:hidden}.fc .fc-scrollgrid{border-bottom-width:0;border-collapse:separate;border-right-width:0}.fc .fc-scrollgrid-liquid{height:100%}.fc .fc-scrollgrid-section,.fc .fc-scrollgrid-section table,.fc .fc-scrollgrid-section>td{height:1px}.fc .fc-scrollgrid-section-liquid>td{height:100%}.fc .fc-scrollgrid-section>*{border-left-width:0;border-top-width:0}.fc .fc-scrollgrid-section-footer>*,.fc .fc-scrollgrid-section-header>*{border-bottom-width:0}.fc .fc-scrollgrid-section-body table,.fc .fc-scrollgrid-section-footer table{border-bottom-style:hidden}.fc .fc-scrollgrid-section-sticky>*{background:var(--fc-page-bg-color);position:sticky;z-index:3}.fc .fc-scrollgrid-section-header.fc-scrollgrid-section-sticky>*{top:0}.fc .fc-scrollgrid-section-footer.fc-scrollgrid-section-sticky>*{bottom:0}.fc .fc-scrollgrid-sticky-shim{height:1px;margin-bottom:-1px}.fc-sticky{position:sticky}.fc .fc-view-harness{flex-grow:1;position:relative}.fc .fc-view-harness-active>.fc-view{bottom:0;left:0;position:absolute;right:0;top:0}.fc .fc-col-header-cell-cushion{display:inline-block;padding:2px 4px}.fc .fc-bg-event,.fc .fc-highlight,.fc .fc-non-business{bottom:0;left:0;position:absolute;right:0;top:0}.fc .fc-non-business{background:var(--fc-non-business-color)}.fc .fc-bg-event{background:var(--fc-bg-event-color);opacity:var(--fc-bg-event-opacity)}.fc .fc-bg-event .fc-event-title{font-size:var(--fc-small-font-size);font-style:italic;margin:.5em}.fc .fc-highlight{background:var(--fc-highlight-color)}.fc .fc-cell-shaded,.fc .fc-day-disabled{background:var(--fc-neutral-bg-color)}a.fc-event,a.fc-event:hover{text-decoration:none}.fc-event.fc-event-draggable,.fc-event[href]{cursor:pointer}.fc-event .fc-event-main{position:relative;z-index:2}.fc-event-dragging:not(.fc-event-selected){opacity:.75}.fc-event-dragging.fc-event-selected{box-shadow:0 2px 7px rgba(0,0,0,.3)}.fc-event .fc-event-resizer{display:none;position:absolute;z-index:4}.fc-event-selected .fc-event-resizer,.fc-event:hover .fc-event-resizer{display:block}.fc-event-selected .fc-event-resizer{background:var(--fc-page-bg-color);border-color:inherit;border-radius:calc(var(--fc-event-resizer-dot-total-width)/2);border-style:solid;border-width:var(--fc-event-resizer-dot-border-width);height:var(--fc-event-resizer-dot-total-width);width:var(--fc-event-resizer-dot-total-width)}.fc-event-selected .fc-event-resizer:before{bottom:-20px;content:\"\";left:-20px;position:absolute;right:-20px;top:-20px}.fc-event-selected,.fc-event:focus{box-shadow:0 2px 5px rgba(0,0,0,.2)}.fc-event-selected:before,.fc-event:focus:before{bottom:0;content:\"\";left:0;position:absolute;right:0;top:0;z-index:3}.fc-event-selected:after,.fc-event:focus:after{background:var(--fc-event-selected-overlay-color);bottom:-1px;content:\"\";left:-1px;position:absolute;right:-1px;top:-1px;z-index:1}.fc-h-event{background-color:var(--fc-event-bg-color);border:1px solid var(--fc-event-border-color);display:block}.fc-h-event .fc-event-main{color:var(--fc-event-text-color)}.fc-h-event .fc-event-main-frame{display:flex}.fc-h-event .fc-event-time{max-width:100%;overflow:hidden}.fc-h-event .fc-event-title-container{flex-grow:1;flex-shrink:1;min-width:0}.fc-h-event .fc-event-title{display:inline-block;left:0;max-width:100%;overflow:hidden;right:0;vertical-align:top}.fc-h-event.fc-event-selected:before{bottom:-10px;top:-10px}.fc-direction-ltr .fc-daygrid-block-event:not(.fc-event-start),.fc-direction-rtl .fc-daygrid-block-event:not(.fc-event-end){border-bottom-left-radius:0;border-left-width:0;border-top-left-radius:0}.fc-direction-ltr .fc-daygrid-block-event:not(.fc-event-end),.fc-direction-rtl .fc-daygrid-block-event:not(.fc-event-start){border-bottom-right-radius:0;border-right-width:0;border-top-right-radius:0}.fc-h-event:not(.fc-event-selected) .fc-event-resizer{bottom:0;top:0;width:var(--fc-event-resizer-thickness)}.fc-direction-ltr .fc-h-event:not(.fc-event-selected) .fc-event-resizer-start,.fc-direction-rtl .fc-h-event:not(.fc-event-selected) .fc-event-resizer-end{cursor:w-resize;left:calc(var(--fc-event-resizer-thickness)*-.5)}.fc-direction-ltr .fc-h-event:not(.fc-event-selected) .fc-event-resizer-end,.fc-direction-rtl .fc-h-event:not(.fc-event-selected) .fc-event-resizer-start{cursor:e-resize;right:calc(var(--fc-event-resizer-thickness)*-.5)}.fc-h-event.fc-event-selected .fc-event-resizer{margin-top:calc(var(--fc-event-resizer-dot-total-width)*-.5);top:50%}.fc-direction-ltr .fc-h-event.fc-event-selected .fc-event-resizer-start,.fc-direction-rtl .fc-h-event.fc-event-selected .fc-event-resizer-end{left:calc(var(--fc-event-resizer-dot-total-width)*-.5)}.fc-direction-ltr .fc-h-event.fc-event-selected .fc-event-resizer-end,.fc-direction-rtl .fc-h-event.fc-event-selected .fc-event-resizer-start{right:calc(var(--fc-event-resizer-dot-total-width)*-.5)}.fc .fc-popover{box-shadow:0 2px 6px rgba(0,0,0,.15);position:absolute;z-index:9999}.fc .fc-popover-header{align-items:center;display:flex;flex-direction:row;justify-content:space-between;padding:3px 4px}.fc .fc-popover-title{margin:0 2px}.fc .fc-popover-close{cursor:pointer;font-size:1.1em;opacity:.65}.fc-theme-standard .fc-popover{background:var(--fc-page-bg-color);border:1px solid var(--fc-border-color)}.fc-theme-standard .fc-popover-header{background:var(--fc-neutral-bg-color)}");
		var DelayedRunner = class {
			constructor(drainedOption) {
				this.drainedOption = drainedOption;
				this.isRunning = false;
				this.isDirty = false;
				this.pauseDepths = {};
				this.timeoutId = 0;
			}
			request(delay) {
				this.isDirty = true;
				if (!this.isPaused()) {
					this.clearTimeout();
					if (delay == null) this.tryDrain();
					else this.timeoutId = setTimeout(this.tryDrain.bind(this), delay);
				}
			}
			pause(scope = "") {
				let { pauseDepths } = this;
				pauseDepths[scope] = (pauseDepths[scope] || 0) + 1;
				this.clearTimeout();
			}
			resume(scope = "", force) {
				let { pauseDepths } = this;
				if (scope in pauseDepths) {
					if (force) delete pauseDepths[scope];
					else {
						pauseDepths[scope] -= 1;
						if (pauseDepths[scope] <= 0) delete pauseDepths[scope];
					}
					this.tryDrain();
				}
			}
			isPaused() {
				return Object.keys(this.pauseDepths).length;
			}
			tryDrain() {
				if (!this.isRunning && !this.isPaused()) {
					this.isRunning = true;
					while (this.isDirty) {
						this.isDirty = false;
						this.drained();
					}
					this.isRunning = false;
				}
			}
			clear() {
				this.clearTimeout();
				this.isDirty = false;
				this.pauseDepths = {};
			}
			clearTimeout() {
				if (this.timeoutId) {
					clearTimeout(this.timeoutId);
					this.timeoutId = 0;
				}
			}
			drained() {
				if (this.drainedOption) this.drainedOption();
			}
		};
		function removeElement(el) {
			if (el.parentNode) el.parentNode.removeChild(el);
		}
		function elementClosest(el, selector) {
			if (el.closest) return el.closest(selector);
			if (!document.documentElement.contains(el)) return null;
			do {
				if (elementMatches(el, selector)) return el;
				el = el.parentElement || el.parentNode;
			} while (el !== null && el.nodeType === 1);
			return null;
		}
		function elementMatches(el, selector) {
			return (el.matches || el.matchesSelector || el.msMatchesSelector).call(el, selector);
		}
		function findElements(container, selector) {
			let containers = container instanceof HTMLElement ? [container] : container;
			let allMatches = [];
			for (let i = 0; i < containers.length; i += 1) {
				let matches = containers[i].querySelectorAll(selector);
				for (let j = 0; j < matches.length; j += 1) allMatches.push(matches[j]);
			}
			return allMatches;
		}
		function findDirectChildren(parent, selector) {
			let parents = parent instanceof HTMLElement ? [parent] : parent;
			let allMatches = [];
			for (let i = 0; i < parents.length; i += 1) {
				let childNodes = parents[i].children;
				for (let j = 0; j < childNodes.length; j += 1) {
					let childNode = childNodes[j];
					if (!selector || elementMatches(childNode, selector)) allMatches.push(childNode);
				}
			}
			return allMatches;
		}
		const PIXEL_PROP_RE = /(top|left|right|bottom|width|height)$/i;
		function applyStyle(el, props) {
			for (let propName in props) applyStyleProp(el, propName, props[propName]);
		}
		function applyStyleProp(el, name, val) {
			if (val == null) el.style[name] = "";
			else if (typeof val === "number" && PIXEL_PROP_RE.test(name)) el.style[name] = `${val}px`;
			else el.style[name] = val;
		}
		function getEventTargetViaRoot(ev) {
			var _a, _b;
			return (_b = (_a = ev.composedPath) === null || _a === void 0 ? void 0 : _a.call(ev)[0]) !== null && _b !== void 0 ? _b : ev.target;
		}
		let guid$1 = 0;
		function getUniqueDomId() {
			guid$1 += 1;
			return "fc-dom-" + guid$1;
		}
		function preventDefault(ev) {
			ev.preventDefault();
		}
		function buildDelegationHandler(selector, handler) {
			return (ev) => {
				let matchedChild = elementClosest(ev.target, selector);
				if (matchedChild) handler.call(matchedChild, ev, matchedChild);
			};
		}
		function listenBySelector(container, eventType, selector, handler) {
			let attachedHandler = buildDelegationHandler(selector, handler);
			container.addEventListener(eventType, attachedHandler);
			return () => {
				container.removeEventListener(eventType, attachedHandler);
			};
		}
		function listenToHoverBySelector(container, selector, onMouseEnter, onMouseLeave) {
			let currentMatchedChild;
			return listenBySelector(container, "mouseover", selector, (mouseOverEv, matchedChild) => {
				if (matchedChild !== currentMatchedChild) {
					currentMatchedChild = matchedChild;
					onMouseEnter(mouseOverEv, matchedChild);
					let realOnMouseLeave = (mouseLeaveEv) => {
						currentMatchedChild = null;
						onMouseLeave(mouseLeaveEv, matchedChild);
						matchedChild.removeEventListener("mouseleave", realOnMouseLeave);
					};
					matchedChild.addEventListener("mouseleave", realOnMouseLeave);
				}
			});
		}
		const transitionEventNames = [
			"webkitTransitionEnd",
			"otransitionend",
			"oTransitionEnd",
			"msTransitionEnd",
			"transitionend"
		];
		function whenTransitionDone(el, callback) {
			let realCallback = (ev) => {
				callback(ev);
				transitionEventNames.forEach((eventName) => {
					el.removeEventListener(eventName, realCallback);
				});
			};
			transitionEventNames.forEach((eventName) => {
				el.addEventListener(eventName, realCallback);
			});
		}
		function createAriaClickAttrs(handler) {
			return Object.assign({ onClick: handler }, createAriaKeyboardAttrs(handler));
		}
		function createAriaKeyboardAttrs(handler) {
			return {
				tabIndex: 0,
				onKeyDown(ev) {
					if (ev.key === "Enter" || ev.key === " ") {
						handler(ev);
						ev.preventDefault();
					}
				}
			};
		}
		let guidNumber = 0;
		function guid() {
			guidNumber += 1;
			return String(guidNumber);
		}
		function disableCursor() {
			document.body.classList.add("fc-not-allowed");
		}
		function enableCursor() {
			document.body.classList.remove("fc-not-allowed");
		}
		function preventSelection(el) {
			el.style.userSelect = "none";
			el.style.webkitUserSelect = "none";
			el.addEventListener("selectstart", preventDefault);
		}
		function allowSelection(el) {
			el.style.userSelect = "";
			el.style.webkitUserSelect = "";
			el.removeEventListener("selectstart", preventDefault);
		}
		function preventContextMenu(el) {
			el.addEventListener("contextmenu", preventDefault);
		}
		function allowContextMenu(el) {
			el.removeEventListener("contextmenu", preventDefault);
		}
		function parseFieldSpecs(input) {
			let specs = [];
			let tokens = [];
			let i;
			let token;
			if (typeof input === "string") tokens = input.split(/\s*,\s*/);
			else if (typeof input === "function") tokens = [input];
			else if (Array.isArray(input)) tokens = input;
			for (i = 0; i < tokens.length; i += 1) {
				token = tokens[i];
				if (typeof token === "string") specs.push(token.charAt(0) === "-" ? {
					field: token.substring(1),
					order: -1
				} : {
					field: token,
					order: 1
				});
				else if (typeof token === "function") specs.push({ func: token });
			}
			return specs;
		}
		function compareByFieldSpecs(obj0, obj1, fieldSpecs) {
			let i;
			let cmp;
			for (i = 0; i < fieldSpecs.length; i += 1) {
				cmp = compareByFieldSpec(obj0, obj1, fieldSpecs[i]);
				if (cmp) return cmp;
			}
			return 0;
		}
		function compareByFieldSpec(obj0, obj1, fieldSpec) {
			if (fieldSpec.func) return fieldSpec.func(obj0, obj1);
			return flexibleCompare(obj0[fieldSpec.field], obj1[fieldSpec.field]) * (fieldSpec.order || 1);
		}
		function flexibleCompare(a, b) {
			if (!a && !b) return 0;
			if (b == null) return -1;
			if (a == null) return 1;
			if (typeof a === "string" || typeof b === "string") return String(a).localeCompare(String(b));
			return a - b;
		}
		function padStart(val, len) {
			let s = String(val);
			return "000".substr(0, len - s.length) + s;
		}
		function formatWithOrdinals(formatter, args, fallbackText) {
			if (typeof formatter === "function") return formatter(...args);
			if (typeof formatter === "string") return args.reduce((str, arg, index) => str.replace("$" + index, arg || ""), formatter);
			return fallbackText;
		}
		function compareNumbers(a, b) {
			return a - b;
		}
		function isInt(n) {
			return n % 1 === 0;
		}
		function computeSmallestCellWidth(cellEl) {
			let allWidthEl = cellEl.querySelector(".fc-scrollgrid-shrink-frame");
			let contentWidthEl = cellEl.querySelector(".fc-scrollgrid-shrink-cushion");
			if (!allWidthEl) throw new Error("needs fc-scrollgrid-shrink-frame className");
			if (!contentWidthEl) throw new Error("needs fc-scrollgrid-shrink-cushion className");
			return cellEl.getBoundingClientRect().width - allWidthEl.getBoundingClientRect().width + contentWidthEl.getBoundingClientRect().width;
		}
		const INTERNAL_UNITS = [
			"years",
			"months",
			"days",
			"milliseconds"
		];
		const PARSE_RE = /^(-?)(?:(\d+)\.)?(\d+):(\d\d)(?::(\d\d)(?:\.(\d\d\d))?)?/;
		function createDuration(input, unit) {
			if (typeof input === "string") return parseString(input);
			if (typeof input === "object" && input) return parseObject(input);
			if (typeof input === "number") return parseObject({ [unit || "milliseconds"]: input });
			return null;
		}
		function parseString(s) {
			let m = PARSE_RE.exec(s);
			if (m) {
				let sign = m[1] ? -1 : 1;
				return {
					years: 0,
					months: 0,
					days: sign * (m[2] ? parseInt(m[2], 10) : 0),
					milliseconds: sign * ((m[3] ? parseInt(m[3], 10) : 0) * 60 * 60 * 1e3 + (m[4] ? parseInt(m[4], 10) : 0) * 60 * 1e3 + (m[5] ? parseInt(m[5], 10) : 0) * 1e3 + (m[6] ? parseInt(m[6], 10) : 0))
				};
			}
			return null;
		}
		function parseObject(obj) {
			let duration = {
				years: obj.years || obj.year || 0,
				months: obj.months || obj.month || 0,
				days: obj.days || obj.day || 0,
				milliseconds: (obj.hours || obj.hour || 0) * 60 * 60 * 1e3 + (obj.minutes || obj.minute || 0) * 60 * 1e3 + (obj.seconds || obj.second || 0) * 1e3 + (obj.milliseconds || obj.millisecond || obj.ms || 0)
			};
			let weeks = obj.weeks || obj.week;
			if (weeks) {
				duration.days += weeks * 7;
				duration.specifiedWeeks = true;
			}
			return duration;
		}
		function durationsEqual(d0, d1) {
			return d0.years === d1.years && d0.months === d1.months && d0.days === d1.days && d0.milliseconds === d1.milliseconds;
		}
		function asCleanDays(dur) {
			if (!dur.years && !dur.months && !dur.milliseconds) return dur.days;
			return 0;
		}
		function addDurations(d0, d1) {
			return {
				years: d0.years + d1.years,
				months: d0.months + d1.months,
				days: d0.days + d1.days,
				milliseconds: d0.milliseconds + d1.milliseconds
			};
		}
		function subtractDurations(d1, d0) {
			return {
				years: d1.years - d0.years,
				months: d1.months - d0.months,
				days: d1.days - d0.days,
				milliseconds: d1.milliseconds - d0.milliseconds
			};
		}
		function multiplyDuration(d, n) {
			return {
				years: d.years * n,
				months: d.months * n,
				days: d.days * n,
				milliseconds: d.milliseconds * n
			};
		}
		function asRoughYears(dur) {
			return asRoughDays(dur) / 365;
		}
		function asRoughMonths(dur) {
			return asRoughDays(dur) / 30;
		}
		function asRoughDays(dur) {
			return asRoughMs(dur) / 864e5;
		}
		function asRoughMinutes(dur) {
			return asRoughMs(dur) / 6e4;
		}
		function asRoughSeconds(dur) {
			return asRoughMs(dur) / 1e3;
		}
		function asRoughMs(dur) {
			return dur.years * 31536e6 + dur.months * 2592e6 + dur.days * 864e5 + dur.milliseconds;
		}
		function wholeDivideDurations(numerator, denominator) {
			let res = null;
			for (let i = 0; i < INTERNAL_UNITS.length; i += 1) {
				let unit = INTERNAL_UNITS[i];
				if (denominator[unit]) {
					let localRes = numerator[unit] / denominator[unit];
					if (!isInt(localRes) || res !== null && res !== localRes) return null;
					res = localRes;
				} else if (numerator[unit]) return null;
			}
			return res;
		}
		function greatestDurationDenominator(dur) {
			let ms = dur.milliseconds;
			if (ms) {
				if (ms % 1e3 !== 0) return {
					unit: "millisecond",
					value: ms
				};
				if (ms % 6e4 !== 0) return {
					unit: "second",
					value: ms / 1e3
				};
				if (ms % 36e5 !== 0) return {
					unit: "minute",
					value: ms / 6e4
				};
				if (ms) return {
					unit: "hour",
					value: ms / 36e5
				};
			}
			if (dur.days) {
				if (dur.specifiedWeeks && dur.days % 7 === 0) return {
					unit: "week",
					value: dur.days / 7
				};
				return {
					unit: "day",
					value: dur.days
				};
			}
			if (dur.months) return {
				unit: "month",
				value: dur.months
			};
			if (dur.years) return {
				unit: "year",
				value: dur.years
			};
			return {
				unit: "millisecond",
				value: 0
			};
		}
		function removeExact(array, exactVal) {
			let removeCnt = 0;
			let i = 0;
			while (i < array.length) if (array[i] === exactVal) {
				array.splice(i, 1);
				removeCnt += 1;
			} else i += 1;
			return removeCnt;
		}
		function isArraysEqual(a0, a1, equalityFunc) {
			if (a0 === a1) return true;
			let len = a0.length;
			let i;
			if (len !== a1.length) return false;
			for (i = 0; i < len; i += 1) if (!(equalityFunc ? equalityFunc(a0[i], a1[i]) : a0[i] === a1[i])) return false;
			return true;
		}
		const DAY_IDS = [
			"sun",
			"mon",
			"tue",
			"wed",
			"thu",
			"fri",
			"sat"
		];
		function addWeeks(m, n) {
			let a = dateToUtcArray(m);
			a[2] += n * 7;
			return arrayToUtcDate(a);
		}
		function addDays(m, n) {
			let a = dateToUtcArray(m);
			a[2] += n;
			return arrayToUtcDate(a);
		}
		function addMs(m, n) {
			let a = dateToUtcArray(m);
			a[6] += n;
			return arrayToUtcDate(a);
		}
		function diffWeeks(m0, m1) {
			return diffDays(m0, m1) / 7;
		}
		function diffDays(m0, m1) {
			return (m1.valueOf() - m0.valueOf()) / 864e5;
		}
		function diffHours(m0, m1) {
			return (m1.valueOf() - m0.valueOf()) / 36e5;
		}
		function diffMinutes(m0, m1) {
			return (m1.valueOf() - m0.valueOf()) / 6e4;
		}
		function diffSeconds(m0, m1) {
			return (m1.valueOf() - m0.valueOf()) / 1e3;
		}
		function diffDayAndTime(m0, m1) {
			let m0day = startOfDay(m0);
			let m1day = startOfDay(m1);
			return {
				years: 0,
				months: 0,
				days: Math.round(diffDays(m0day, m1day)),
				milliseconds: m1.valueOf() - m1day.valueOf() - (m0.valueOf() - m0day.valueOf())
			};
		}
		function diffWholeWeeks(m0, m1) {
			let d = diffWholeDays(m0, m1);
			if (d !== null && d % 7 === 0) return d / 7;
			return null;
		}
		function diffWholeDays(m0, m1) {
			if (timeAsMs(m0) === timeAsMs(m1)) return Math.round(diffDays(m0, m1));
			return null;
		}
		function startOfDay(m) {
			return arrayToUtcDate([
				m.getUTCFullYear(),
				m.getUTCMonth(),
				m.getUTCDate()
			]);
		}
		function startOfHour(m) {
			return arrayToUtcDate([
				m.getUTCFullYear(),
				m.getUTCMonth(),
				m.getUTCDate(),
				m.getUTCHours()
			]);
		}
		function startOfMinute(m) {
			return arrayToUtcDate([
				m.getUTCFullYear(),
				m.getUTCMonth(),
				m.getUTCDate(),
				m.getUTCHours(),
				m.getUTCMinutes()
			]);
		}
		function startOfSecond(m) {
			return arrayToUtcDate([
				m.getUTCFullYear(),
				m.getUTCMonth(),
				m.getUTCDate(),
				m.getUTCHours(),
				m.getUTCMinutes(),
				m.getUTCSeconds()
			]);
		}
		function weekOfYear(marker, dow, doy) {
			let y = marker.getUTCFullYear();
			let w = weekOfGivenYear(marker, y, dow, doy);
			if (w < 1) return weekOfGivenYear(marker, y - 1, dow, doy);
			let nextW = weekOfGivenYear(marker, y + 1, dow, doy);
			if (nextW >= 1) return Math.min(w, nextW);
			return w;
		}
		function weekOfGivenYear(marker, year, dow, doy) {
			let firstWeekStart = arrayToUtcDate([
				year,
				0,
				1 + firstWeekOffset(year, dow, doy)
			]);
			let dayStart = startOfDay(marker);
			let days = Math.round(diffDays(firstWeekStart, dayStart));
			return Math.floor(days / 7) + 1;
		}
		function firstWeekOffset(year, dow, doy) {
			let fwd = 7 + dow - doy;
			return -((7 + arrayToUtcDate([
				year,
				0,
				fwd
			]).getUTCDay() - dow) % 7) + fwd - 1;
		}
		function dateToLocalArray(date) {
			return [
				date.getFullYear(),
				date.getMonth(),
				date.getDate(),
				date.getHours(),
				date.getMinutes(),
				date.getSeconds(),
				date.getMilliseconds()
			];
		}
		function arrayToLocalDate(a) {
			return new Date(a[0], a[1] || 0, a[2] == null ? 1 : a[2], a[3] || 0, a[4] || 0, a[5] || 0);
		}
		function dateToUtcArray(date) {
			return [
				date.getUTCFullYear(),
				date.getUTCMonth(),
				date.getUTCDate(),
				date.getUTCHours(),
				date.getUTCMinutes(),
				date.getUTCSeconds(),
				date.getUTCMilliseconds()
			];
		}
		function arrayToUtcDate(a) {
			if (a.length === 1) a = a.concat([0]);
			return new Date(Date.UTC(...a));
		}
		function isValidDate(m) {
			return !isNaN(m.valueOf());
		}
		function timeAsMs(m) {
			return m.getUTCHours() * 1e3 * 60 * 60 + m.getUTCMinutes() * 1e3 * 60 + m.getUTCSeconds() * 1e3 + m.getUTCMilliseconds();
		}
		function buildIsoString(marker, timeZoneOffset, stripZeroTime = false) {
			let s = marker.toISOString();
			s = s.replace(".000", "");
			if (stripZeroTime) s = s.replace("T00:00:00Z", "");
			if (s.length > 10) {
				if (timeZoneOffset == null) s = s.replace("Z", "");
				else if (timeZoneOffset !== 0) s = s.replace("Z", formatTimeZoneOffset(timeZoneOffset, true));
			}
			return s;
		}
		function formatDayString(marker) {
			return marker.toISOString().replace(/T.*$/, "");
		}
		function formatIsoMonthStr(marker) {
			return marker.toISOString().match(/^\d{4}-\d{2}/)[0];
		}
		function formatIsoTimeString(marker) {
			return padStart(marker.getUTCHours(), 2) + ":" + padStart(marker.getUTCMinutes(), 2) + ":" + padStart(marker.getUTCSeconds(), 2);
		}
		function formatTimeZoneOffset(minutes, doIso = false) {
			let sign = minutes < 0 ? "-" : "+";
			let abs = Math.abs(minutes);
			let hours = Math.floor(abs / 60);
			let mins = Math.round(abs % 60);
			if (doIso) return `${sign + padStart(hours, 2)}:${padStart(mins, 2)}`;
			return `GMT${sign}${hours}${mins ? `:${padStart(mins, 2)}` : ""}`;
		}
		function memoize(workerFunc, resEquality, teardownFunc) {
			let currentArgs;
			let currentRes;
			return function(...newArgs) {
				if (!currentArgs) currentRes = workerFunc.apply(this, newArgs);
				else if (!isArraysEqual(currentArgs, newArgs)) {
					if (teardownFunc) teardownFunc(currentRes);
					let res = workerFunc.apply(this, newArgs);
					if (!resEquality || !resEquality(res, currentRes)) currentRes = res;
				}
				currentArgs = newArgs;
				return currentRes;
			};
		}
		function memoizeObjArg(workerFunc, resEquality, teardownFunc) {
			let currentArg;
			let currentRes;
			return (newArg) => {
				if (!currentArg) currentRes = workerFunc.call(this, newArg);
				else if (!isPropsEqual(currentArg, newArg)) {
					if (teardownFunc) teardownFunc(currentRes);
					let res = workerFunc.call(this, newArg);
					if (!resEquality || !resEquality(res, currentRes)) currentRes = res;
				}
				currentArg = newArg;
				return currentRes;
			};
		}
		function memoizeArraylike(workerFunc, resEquality, teardownFunc) {
			let currentArgSets = [];
			let currentResults = [];
			return (newArgSets) => {
				let currentLen = currentArgSets.length;
				let newLen = newArgSets.length;
				let i = 0;
				for (; i < currentLen; i += 1) if (!newArgSets[i]) {
					if (teardownFunc) teardownFunc(currentResults[i]);
				} else if (!isArraysEqual(currentArgSets[i], newArgSets[i])) {
					if (teardownFunc) teardownFunc(currentResults[i]);
					let res = workerFunc.apply(this, newArgSets[i]);
					if (!resEquality || !resEquality(res, currentResults[i])) currentResults[i] = res;
				}
				for (; i < newLen; i += 1) currentResults[i] = workerFunc.apply(this, newArgSets[i]);
				currentArgSets = newArgSets;
				currentResults.splice(newLen);
				return currentResults;
			};
		}
		function memoizeHashlike(workerFunc, resEquality, teardownFunc) {
			let currentArgHash = {};
			let currentResHash = {};
			return (newArgHash) => {
				let newResHash = {};
				for (let key in newArgHash) if (!currentResHash[key]) newResHash[key] = workerFunc.apply(this, newArgHash[key]);
				else if (!isArraysEqual(currentArgHash[key], newArgHash[key])) {
					if (teardownFunc) teardownFunc(currentResHash[key]);
					let res = workerFunc.apply(this, newArgHash[key]);
					newResHash[key] = resEquality && resEquality(res, currentResHash[key]) ? currentResHash[key] : res;
				} else newResHash[key] = currentResHash[key];
				currentArgHash = newArgHash;
				currentResHash = newResHash;
				return newResHash;
			};
		}
		const EXTENDED_SETTINGS_AND_SEVERITIES = {
			week: 3,
			separator: 9,
			omitZeroMinute: 9,
			meridiem: 9,
			omitCommas: 9
		};
		const STANDARD_DATE_PROP_SEVERITIES = {
			timeZoneName: 7,
			era: 6,
			year: 5,
			month: 4,
			day: 2,
			weekday: 2,
			hour: 1,
			minute: 1,
			second: 1
		};
		const MERIDIEM_RE = /\s*([ap])\.?m\.?/i;
		const COMMA_RE = /,/g;
		const MULTI_SPACE_RE = /\s+/g;
		const LTR_RE = /\u200e/g;
		const UTC_RE = /UTC|GMT/;
		var NativeFormatter = class {
			constructor(formatSettings) {
				let standardDateProps = {};
				let extendedSettings = {};
				let smallestUnitNum = 9;
				for (let name in formatSettings) if (name in EXTENDED_SETTINGS_AND_SEVERITIES) {
					extendedSettings[name] = formatSettings[name];
					if (EXTENDED_SETTINGS_AND_SEVERITIES[name] < 9) smallestUnitNum = Math.min(EXTENDED_SETTINGS_AND_SEVERITIES[name], smallestUnitNum);
				} else {
					standardDateProps[name] = formatSettings[name];
					if (name in STANDARD_DATE_PROP_SEVERITIES) smallestUnitNum = Math.min(STANDARD_DATE_PROP_SEVERITIES[name], smallestUnitNum);
				}
				this.standardDateProps = standardDateProps;
				this.extendedSettings = extendedSettings;
				this.smallestUnitNum = smallestUnitNum;
				this.buildFormattingFunc = memoize(buildFormattingFunc);
			}
			format(date, context) {
				return this.buildFormattingFunc(this.standardDateProps, this.extendedSettings, context)(date);
			}
			formatRange(start, end, context, betterDefaultSeparator) {
				let { standardDateProps, extendedSettings } = this;
				let diffSeverity = computeMarkerDiffSeverity(start.marker, end.marker, context.calendarSystem);
				if (!diffSeverity) return this.format(start, context);
				let biggestUnitForPartial = diffSeverity;
				if (biggestUnitForPartial > 1 && (standardDateProps.year === "numeric" || standardDateProps.year === "2-digit") && (standardDateProps.month === "numeric" || standardDateProps.month === "2-digit") && (standardDateProps.day === "numeric" || standardDateProps.day === "2-digit")) biggestUnitForPartial = 1;
				let full0 = this.format(start, context);
				let full1 = this.format(end, context);
				if (full0 === full1) return full0;
				let partialFormattingFunc = buildFormattingFunc(computePartialFormattingOptions(standardDateProps, biggestUnitForPartial), extendedSettings, context);
				let partial0 = partialFormattingFunc(start);
				let partial1 = partialFormattingFunc(end);
				let insertion = findCommonInsertion(full0, partial0, full1, partial1);
				let separator = extendedSettings.separator || betterDefaultSeparator || context.defaultSeparator || "";
				if (insertion) return insertion.before + partial0 + separator + partial1 + insertion.after;
				return full0 + separator + full1;
			}
			getSmallestUnit() {
				switch (this.smallestUnitNum) {
					case 7:
					case 6:
					case 5: return "year";
					case 4: return "month";
					case 3: return "week";
					case 2: return "day";
					default: return "time";
				}
			}
		};
		function buildFormattingFunc(standardDateProps, extendedSettings, context) {
			let standardDatePropCnt = Object.keys(standardDateProps).length;
			if (standardDatePropCnt === 1 && standardDateProps.timeZoneName === "short") return (date) => formatTimeZoneOffset(date.timeZoneOffset);
			if (standardDatePropCnt === 0 && extendedSettings.week) return (date) => formatWeekNumber(context.computeWeekNumber(date.marker), context.weekText, context.weekTextLong, context.locale, extendedSettings.week);
			return buildNativeFormattingFunc(standardDateProps, extendedSettings, context);
		}
		function buildNativeFormattingFunc(standardDateProps, extendedSettings, context) {
			standardDateProps = Object.assign({}, standardDateProps);
			extendedSettings = Object.assign({}, extendedSettings);
			sanitizeSettings(standardDateProps, extendedSettings);
			standardDateProps.timeZone = "UTC";
			let normalFormat = new Intl.DateTimeFormat(context.locale.codes, standardDateProps);
			let zeroFormat;
			if (extendedSettings.omitZeroMinute) {
				let zeroProps = Object.assign({}, standardDateProps);
				delete zeroProps.minute;
				zeroFormat = new Intl.DateTimeFormat(context.locale.codes, zeroProps);
			}
			return (date) => {
				let { marker } = date;
				let format;
				if (zeroFormat && !marker.getUTCMinutes()) format = zeroFormat;
				else format = normalFormat;
				return postProcess(format.format(marker), date, standardDateProps, extendedSettings, context);
			};
		}
		function sanitizeSettings(standardDateProps, extendedSettings) {
			if (standardDateProps.timeZoneName) {
				if (!standardDateProps.hour) standardDateProps.hour = "2-digit";
				if (!standardDateProps.minute) standardDateProps.minute = "2-digit";
			}
			if (standardDateProps.timeZoneName === "long") standardDateProps.timeZoneName = "short";
			if (extendedSettings.omitZeroMinute && (standardDateProps.second || standardDateProps.millisecond)) delete extendedSettings.omitZeroMinute;
		}
		function postProcess(s, date, standardDateProps, extendedSettings, context) {
			s = s.replace(LTR_RE, "");
			if (standardDateProps.timeZoneName === "short") s = injectTzoStr(s, context.timeZone === "UTC" || date.timeZoneOffset == null ? "UTC" : formatTimeZoneOffset(date.timeZoneOffset));
			if (extendedSettings.omitCommas) s = s.replace(COMMA_RE, "").trim();
			if (extendedSettings.omitZeroMinute) s = s.replace(":00", "");
			if (extendedSettings.meridiem === false) s = s.replace(MERIDIEM_RE, "").trim();
			else if (extendedSettings.meridiem === "narrow") s = s.replace(MERIDIEM_RE, (m0, m1) => m1.toLocaleLowerCase());
			else if (extendedSettings.meridiem === "short") s = s.replace(MERIDIEM_RE, (m0, m1) => `${m1.toLocaleLowerCase()}m`);
			else if (extendedSettings.meridiem === "lowercase") s = s.replace(MERIDIEM_RE, (m0) => m0.toLocaleLowerCase());
			s = s.replace(MULTI_SPACE_RE, " ");
			s = s.trim();
			return s;
		}
		function injectTzoStr(s, tzoStr) {
			let replaced = false;
			s = s.replace(UTC_RE, () => {
				replaced = true;
				return tzoStr;
			});
			if (!replaced) s += ` ${tzoStr}`;
			return s;
		}
		function formatWeekNumber(num, weekText, weekTextLong, locale, display) {
			let parts = [];
			if (display === "long") parts.push(weekTextLong);
			else if (display === "short" || display === "narrow") parts.push(weekText);
			if (display === "long" || display === "short") parts.push(" ");
			parts.push(locale.simpleNumberFormat.format(num));
			if (locale.options.direction === "rtl") parts.reverse();
			return parts.join("");
		}
		function computeMarkerDiffSeverity(d0, d1, ca) {
			if (ca.getMarkerYear(d0) !== ca.getMarkerYear(d1)) return 5;
			if (ca.getMarkerMonth(d0) !== ca.getMarkerMonth(d1)) return 4;
			if (ca.getMarkerDay(d0) !== ca.getMarkerDay(d1)) return 2;
			if (timeAsMs(d0) !== timeAsMs(d1)) return 1;
			return 0;
		}
		function computePartialFormattingOptions(options, biggestUnit) {
			let partialOptions = {};
			for (let name in options) if (!(name in STANDARD_DATE_PROP_SEVERITIES) || STANDARD_DATE_PROP_SEVERITIES[name] <= biggestUnit) partialOptions[name] = options[name];
			return partialOptions;
		}
		function findCommonInsertion(full0, partial0, full1, partial1) {
			let i0 = 0;
			while (i0 < full0.length) {
				let found0 = full0.indexOf(partial0, i0);
				if (found0 === -1) break;
				let before0 = full0.substr(0, found0);
				i0 = found0 + partial0.length;
				let after0 = full0.substr(i0);
				let i1 = 0;
				while (i1 < full1.length) {
					let found1 = full1.indexOf(partial1, i1);
					if (found1 === -1) break;
					let before1 = full1.substr(0, found1);
					i1 = found1 + partial1.length;
					let after1 = full1.substr(i1);
					if (before0 === before1 && after0 === after1) return {
						before: before0,
						after: after0
					};
				}
			}
			return null;
		}
		function expandZonedMarker(dateInfo, calendarSystem) {
			let a = calendarSystem.markerToArray(dateInfo.marker);
			return {
				marker: dateInfo.marker,
				timeZoneOffset: dateInfo.timeZoneOffset,
				array: a,
				year: a[0],
				month: a[1],
				day: a[2],
				hour: a[3],
				minute: a[4],
				second: a[5],
				millisecond: a[6]
			};
		}
		function createVerboseFormattingArg(start, end, context, betterDefaultSeparator) {
			let startInfo = expandZonedMarker(start, context.calendarSystem);
			return {
				date: startInfo,
				start: startInfo,
				end: end ? expandZonedMarker(end, context.calendarSystem) : null,
				timeZone: context.timeZone,
				localeCodes: context.locale.codes,
				defaultSeparator: betterDefaultSeparator || context.defaultSeparator
			};
		}
		var CmdFormatter = class {
			constructor(cmdStr) {
				this.cmdStr = cmdStr;
			}
			format(date, context, betterDefaultSeparator) {
				return context.cmdFormatter(this.cmdStr, createVerboseFormattingArg(date, null, context, betterDefaultSeparator));
			}
			formatRange(start, end, context, betterDefaultSeparator) {
				return context.cmdFormatter(this.cmdStr, createVerboseFormattingArg(start, end, context, betterDefaultSeparator));
			}
		};
		var FuncFormatter = class {
			constructor(func) {
				this.func = func;
			}
			format(date, context, betterDefaultSeparator) {
				return this.func(createVerboseFormattingArg(date, null, context, betterDefaultSeparator));
			}
			formatRange(start, end, context, betterDefaultSeparator) {
				return this.func(createVerboseFormattingArg(start, end, context, betterDefaultSeparator));
			}
		};
		function createFormatter(input) {
			if (typeof input === "object" && input) return new NativeFormatter(input);
			if (typeof input === "string") return new CmdFormatter(input);
			if (typeof input === "function") return new FuncFormatter(input);
			return null;
		}
		const BASE_OPTION_REFINERS = {
			navLinkDayClick: identity,
			navLinkWeekClick: identity,
			duration: createDuration,
			bootstrapFontAwesome: identity,
			buttonIcons: identity,
			customButtons: identity,
			defaultAllDayEventDuration: createDuration,
			defaultTimedEventDuration: createDuration,
			nextDayThreshold: createDuration,
			scrollTime: createDuration,
			scrollTimeReset: Boolean,
			slotMinTime: createDuration,
			slotMaxTime: createDuration,
			dayPopoverFormat: createFormatter,
			slotDuration: createDuration,
			snapDuration: createDuration,
			headerToolbar: identity,
			footerToolbar: identity,
			defaultRangeSeparator: String,
			titleRangeSeparator: String,
			forceEventDuration: Boolean,
			dayHeaders: Boolean,
			dayHeaderFormat: createFormatter,
			dayHeaderClassNames: identity,
			dayHeaderContent: identity,
			dayHeaderDidMount: identity,
			dayHeaderWillUnmount: identity,
			dayCellClassNames: identity,
			dayCellContent: identity,
			dayCellDidMount: identity,
			dayCellWillUnmount: identity,
			initialView: String,
			aspectRatio: Number,
			weekends: Boolean,
			weekNumberCalculation: identity,
			weekNumbers: Boolean,
			weekNumberClassNames: identity,
			weekNumberContent: identity,
			weekNumberDidMount: identity,
			weekNumberWillUnmount: identity,
			editable: Boolean,
			viewClassNames: identity,
			viewDidMount: identity,
			viewWillUnmount: identity,
			nowIndicator: Boolean,
			nowIndicatorSnap: identity,
			nowIndicatorClassNames: identity,
			nowIndicatorContent: identity,
			nowIndicatorDidMount: identity,
			nowIndicatorWillUnmount: identity,
			showNonCurrentDates: Boolean,
			lazyFetching: Boolean,
			startParam: String,
			endParam: String,
			timeZoneParam: String,
			timeZone: String,
			locales: identity,
			locale: identity,
			themeSystem: String,
			dragRevertDuration: Number,
			dragScroll: Boolean,
			allDayMaintainDuration: Boolean,
			unselectAuto: Boolean,
			dropAccept: identity,
			eventOrder: parseFieldSpecs,
			eventOrderStrict: Boolean,
			handleWindowResize: Boolean,
			windowResizeDelay: Number,
			longPressDelay: Number,
			eventDragMinDistance: Number,
			expandRows: Boolean,
			height: identity,
			contentHeight: identity,
			direction: String,
			weekNumberFormat: createFormatter,
			eventResizableFromStart: Boolean,
			displayEventTime: Boolean,
			displayEventEnd: Boolean,
			weekText: String,
			weekTextLong: String,
			progressiveEventRendering: Boolean,
			businessHours: identity,
			initialDate: identity,
			now: identity,
			eventDataTransform: identity,
			stickyHeaderDates: identity,
			stickyFooterScrollbar: identity,
			viewHeight: identity,
			defaultAllDay: Boolean,
			eventSourceFailure: identity,
			eventSourceSuccess: identity,
			eventDisplay: String,
			eventStartEditable: Boolean,
			eventDurationEditable: Boolean,
			eventOverlap: identity,
			eventConstraint: identity,
			eventAllow: identity,
			eventBackgroundColor: String,
			eventBorderColor: String,
			eventTextColor: String,
			eventColor: String,
			eventClassNames: identity,
			eventContent: identity,
			eventDidMount: identity,
			eventWillUnmount: identity,
			selectConstraint: identity,
			selectOverlap: identity,
			selectAllow: identity,
			droppable: Boolean,
			unselectCancel: String,
			slotLabelFormat: identity,
			slotLaneClassNames: identity,
			slotLaneContent: identity,
			slotLaneDidMount: identity,
			slotLaneWillUnmount: identity,
			slotLabelClassNames: identity,
			slotLabelContent: identity,
			slotLabelDidMount: identity,
			slotLabelWillUnmount: identity,
			dayMaxEvents: identity,
			dayMaxEventRows: identity,
			dayMinWidth: Number,
			slotLabelInterval: createDuration,
			allDayText: String,
			allDayClassNames: identity,
			allDayContent: identity,
			allDayDidMount: identity,
			allDayWillUnmount: identity,
			slotMinWidth: Number,
			navLinks: Boolean,
			eventTimeFormat: createFormatter,
			rerenderDelay: Number,
			moreLinkText: identity,
			moreLinkHint: identity,
			selectMinDistance: Number,
			selectable: Boolean,
			selectLongPressDelay: Number,
			eventLongPressDelay: Number,
			selectMirror: Boolean,
			eventMaxStack: Number,
			eventMinHeight: Number,
			eventMinWidth: Number,
			eventShortHeight: Number,
			slotEventOverlap: Boolean,
			plugins: identity,
			firstDay: Number,
			dayCount: Number,
			dateAlignment: String,
			dateIncrement: createDuration,
			hiddenDays: identity,
			fixedWeekCount: Boolean,
			validRange: identity,
			visibleRange: identity,
			titleFormat: identity,
			eventInteractive: Boolean,
			noEventsText: String,
			viewHint: identity,
			navLinkHint: identity,
			closeHint: String,
			timeHint: String,
			eventHint: String,
			moreLinkClick: identity,
			moreLinkClassNames: identity,
			moreLinkContent: identity,
			moreLinkDidMount: identity,
			moreLinkWillUnmount: identity,
			monthStartFormat: createFormatter,
			handleCustomRendering: identity,
			customRenderingMetaMap: identity,
			customRenderingReplaces: Boolean
		};
		const BASE_OPTION_DEFAULTS = {
			eventDisplay: "auto",
			defaultRangeSeparator: " - ",
			titleRangeSeparator: " – ",
			defaultTimedEventDuration: "01:00:00",
			defaultAllDayEventDuration: { day: 1 },
			forceEventDuration: false,
			nextDayThreshold: "00:00:00",
			dayHeaders: true,
			initialView: "",
			aspectRatio: 1.35,
			headerToolbar: {
				start: "title",
				center: "",
				end: "today prev,next"
			},
			weekends: true,
			weekNumbers: false,
			weekNumberCalculation: "local",
			editable: false,
			nowIndicator: false,
			scrollTime: "06:00:00",
			scrollTimeReset: true,
			slotMinTime: "00:00:00",
			slotMaxTime: "24:00:00",
			showNonCurrentDates: true,
			lazyFetching: true,
			startParam: "start",
			endParam: "end",
			timeZoneParam: "timeZone",
			timeZone: "local",
			locales: [],
			locale: "",
			themeSystem: "standard",
			dragRevertDuration: 500,
			dragScroll: true,
			allDayMaintainDuration: false,
			unselectAuto: true,
			dropAccept: "*",
			eventOrder: "start,-duration,allDay,title",
			dayPopoverFormat: {
				month: "long",
				day: "numeric",
				year: "numeric"
			},
			handleWindowResize: true,
			windowResizeDelay: 100,
			longPressDelay: 1e3,
			eventDragMinDistance: 5,
			expandRows: false,
			navLinks: false,
			selectable: false,
			eventMinHeight: 15,
			eventMinWidth: 30,
			eventShortHeight: 30,
			monthStartFormat: {
				month: "long",
				day: "numeric"
			},
			nowIndicatorSnap: "auto"
		};
		const CALENDAR_LISTENER_REFINERS = {
			datesSet: identity,
			eventsSet: identity,
			eventAdd: identity,
			eventChange: identity,
			eventRemove: identity,
			windowResize: identity,
			eventClick: identity,
			eventMouseEnter: identity,
			eventMouseLeave: identity,
			select: identity,
			unselect: identity,
			loading: identity,
			_unmount: identity,
			_beforeprint: identity,
			_afterprint: identity,
			_noEventDrop: identity,
			_noEventResize: identity,
			_resize: identity,
			_scrollRequest: identity
		};
		const CALENDAR_OPTION_REFINERS = {
			buttonText: identity,
			buttonHints: identity,
			views: identity,
			plugins: identity,
			initialEvents: identity,
			events: identity,
			eventSources: identity
		};
		const COMPLEX_OPTION_COMPARATORS = {
			headerToolbar: isMaybeObjectsEqual,
			footerToolbar: isMaybeObjectsEqual,
			buttonText: isMaybeObjectsEqual,
			buttonHints: isMaybeObjectsEqual,
			buttonIcons: isMaybeObjectsEqual,
			dateIncrement: isMaybeObjectsEqual,
			plugins: isMaybeArraysEqual,
			events: isMaybeArraysEqual,
			eventSources: isMaybeArraysEqual,
			["resources"]: isMaybeArraysEqual
		};
		function isMaybeObjectsEqual(a, b) {
			if (typeof a === "object" && typeof b === "object" && a && b) return isPropsEqual(a, b);
			return a === b;
		}
		function isMaybeArraysEqual(a, b) {
			if (Array.isArray(a) && Array.isArray(b)) return isArraysEqual(a, b);
			return a === b;
		}
		const VIEW_OPTION_REFINERS = {
			type: String,
			component: identity,
			buttonText: String,
			buttonTextKey: String,
			dateProfileGeneratorClass: identity,
			usesMinMaxTime: Boolean,
			classNames: identity,
			content: identity,
			didMount: identity,
			willUnmount: identity
		};
		function mergeRawOptions(optionSets) {
			return mergeProps(optionSets, COMPLEX_OPTION_COMPARATORS);
		}
		function refineProps(input, refiners) {
			let refined = {};
			let extra = {};
			for (let propName in refiners) if (propName in input) refined[propName] = refiners[propName](input[propName]);
			for (let propName in input) if (!(propName in refiners)) extra[propName] = input[propName];
			return {
				refined,
				extra
			};
		}
		function identity(raw) {
			return raw;
		}
		const { hasOwnProperty } = Object.prototype;
		function mergeProps(propObjs, complexPropsMap) {
			let dest = {};
			if (complexPropsMap) {
				for (let name in complexPropsMap) if (complexPropsMap[name] === isMaybeObjectsEqual) {
					let complexObjs = [];
					for (let i = propObjs.length - 1; i >= 0; i -= 1) {
						let val = propObjs[i][name];
						if (typeof val === "object" && val) complexObjs.unshift(val);
						else if (val !== void 0) {
							dest[name] = val;
							break;
						}
					}
					if (complexObjs.length) dest[name] = mergeProps(complexObjs);
				}
			}
			for (let i = propObjs.length - 1; i >= 0; i -= 1) {
				let props = propObjs[i];
				for (let name in props) if (!(name in dest)) dest[name] = props[name];
			}
			return dest;
		}
		function filterHash(hash, func) {
			let filtered = {};
			for (let key in hash) if (func(hash[key], key)) filtered[key] = hash[key];
			return filtered;
		}
		function mapHash(hash, func) {
			let newHash = {};
			for (let key in hash) newHash[key] = func(hash[key], key);
			return newHash;
		}
		function arrayToHash(a) {
			let hash = {};
			for (let item of a) hash[item] = true;
			return hash;
		}
		function hashValuesToArray(obj) {
			let a = [];
			for (let key in obj) a.push(obj[key]);
			return a;
		}
		function isPropsEqual(obj0, obj1) {
			if (obj0 === obj1) return true;
			for (let key in obj0) if (hasOwnProperty.call(obj0, key)) {
				if (!(key in obj1)) return false;
			}
			for (let key in obj1) if (hasOwnProperty.call(obj1, key)) {
				if (obj0[key] !== obj1[key]) return false;
			}
			return true;
		}
		const HANDLER_RE = /^on[A-Z]/;
		function isNonHandlerPropsEqual(obj0, obj1) {
			const keys = getUnequalProps(obj0, obj1);
			for (let key of keys) if (!HANDLER_RE.test(key)) return false;
			return true;
		}
		function getUnequalProps(obj0, obj1) {
			let keys = [];
			for (let key in obj0) if (hasOwnProperty.call(obj0, key)) {
				if (!(key in obj1)) keys.push(key);
			}
			for (let key in obj1) if (hasOwnProperty.call(obj1, key)) {
				if (obj0[key] !== obj1[key]) keys.push(key);
			}
			return keys;
		}
		function compareObjs(oldProps, newProps, equalityFuncs = {}) {
			if (oldProps === newProps) return true;
			for (let key in newProps) if (key in oldProps && isObjValsEqual(oldProps[key], newProps[key], equalityFuncs[key]));
			else return false;
			for (let key in oldProps) if (!(key in newProps)) return false;
			return true;
		}
		function isObjValsEqual(val0, val1, comparator) {
			if (val0 === val1 || comparator === true) return true;
			if (comparator) return comparator(val0, val1);
			return false;
		}
		function collectFromHash(hash, startIndex = 0, endIndex, step = 1) {
			let res = [];
			if (endIndex == null) endIndex = Object.keys(hash).length;
			for (let i = startIndex; i < endIndex; i += step) {
				let val = hash[i];
				if (val !== void 0) res.push(val);
			}
			return res;
		}
		let calendarSystemClassMap = {};
		function registerCalendarSystem(name, theClass) {
			calendarSystemClassMap[name] = theClass;
		}
		function createCalendarSystem(name) {
			return new calendarSystemClassMap[name]();
		}
		var GregorianCalendarSystem = class {
			getMarkerYear(d) {
				return d.getUTCFullYear();
			}
			getMarkerMonth(d) {
				return d.getUTCMonth();
			}
			getMarkerDay(d) {
				return d.getUTCDate();
			}
			arrayToMarker(arr) {
				return arrayToUtcDate(arr);
			}
			markerToArray(marker) {
				return dateToUtcArray(marker);
			}
		};
		registerCalendarSystem("gregory", GregorianCalendarSystem);
		const ISO_RE = /^\s*(\d{4})(-?(\d{2})(-?(\d{2})([T ](\d{2}):?(\d{2})(:?(\d{2})(\.(\d+))?)?(Z|(([-+])(\d{2})(:?(\d{2}))?))?)?)?)?$/;
		function parse(str) {
			let m = ISO_RE.exec(str);
			if (m) {
				let marker = new Date(Date.UTC(Number(m[1]), m[3] ? Number(m[3]) - 1 : 0, Number(m[5] || 1), Number(m[7] || 0), Number(m[8] || 0), Number(m[10] || 0), m[12] ? Number(`0.${m[12]}`) * 1e3 : 0));
				if (isValidDate(marker)) {
					let timeZoneOffset = null;
					if (m[13]) timeZoneOffset = (m[15] === "-" ? -1 : 1) * (Number(m[16] || 0) * 60 + Number(m[18] || 0));
					return {
						marker,
						isTimeUnspecified: !m[6],
						timeZoneOffset
					};
				}
			}
			return null;
		}
		var DateEnv = class {
			constructor(settings) {
				let timeZone = this.timeZone = settings.timeZone;
				let isNamedTimeZone = timeZone !== "local" && timeZone !== "UTC";
				if (settings.namedTimeZoneImpl && isNamedTimeZone) this.namedTimeZoneImpl = new settings.namedTimeZoneImpl(timeZone);
				this.canComputeOffset = Boolean(!isNamedTimeZone || this.namedTimeZoneImpl);
				this.calendarSystem = createCalendarSystem(settings.calendarSystem);
				this.locale = settings.locale;
				this.weekDow = settings.locale.week.dow;
				this.weekDoy = settings.locale.week.doy;
				if (settings.weekNumberCalculation === "ISO") {
					this.weekDow = 1;
					this.weekDoy = 4;
				}
				if (typeof settings.firstDay === "number") this.weekDow = settings.firstDay;
				if (typeof settings.weekNumberCalculation === "function") this.weekNumberFunc = settings.weekNumberCalculation;
				this.weekText = settings.weekText != null ? settings.weekText : settings.locale.options.weekText;
				this.weekTextLong = (settings.weekTextLong != null ? settings.weekTextLong : settings.locale.options.weekTextLong) || this.weekText;
				this.cmdFormatter = settings.cmdFormatter;
				this.defaultSeparator = settings.defaultSeparator;
			}
			createMarker(input) {
				let meta = this.createMarkerMeta(input);
				if (meta === null) return null;
				return meta.marker;
			}
			createNowMarker() {
				if (this.canComputeOffset) return this.timestampToMarker((/* @__PURE__ */ new Date()).valueOf());
				return arrayToUtcDate(dateToLocalArray(/* @__PURE__ */ new Date()));
			}
			createMarkerMeta(input) {
				if (typeof input === "string") return this.parse(input);
				let marker = null;
				if (typeof input === "number") marker = this.timestampToMarker(input);
				else if (input instanceof Date) {
					input = input.valueOf();
					if (!isNaN(input)) marker = this.timestampToMarker(input);
				} else if (Array.isArray(input)) marker = arrayToUtcDate(input);
				if (marker === null || !isValidDate(marker)) return null;
				return {
					marker,
					isTimeUnspecified: false,
					forcedTzo: null
				};
			}
			parse(s) {
				let parts = parse(s);
				if (parts === null) return null;
				let { marker } = parts;
				let forcedTzo = null;
				if (parts.timeZoneOffset !== null) {
					if (this.canComputeOffset) marker = this.timestampToMarker(marker.valueOf() - parts.timeZoneOffset * 60 * 1e3);
					else forcedTzo = parts.timeZoneOffset;
				}
				return {
					marker,
					isTimeUnspecified: parts.isTimeUnspecified,
					forcedTzo
				};
			}
			getYear(marker) {
				return this.calendarSystem.getMarkerYear(marker);
			}
			getMonth(marker) {
				return this.calendarSystem.getMarkerMonth(marker);
			}
			getDay(marker) {
				return this.calendarSystem.getMarkerDay(marker);
			}
			add(marker, dur) {
				let a = this.calendarSystem.markerToArray(marker);
				a[0] += dur.years;
				a[1] += dur.months;
				a[2] += dur.days;
				a[6] += dur.milliseconds;
				return this.calendarSystem.arrayToMarker(a);
			}
			subtract(marker, dur) {
				let a = this.calendarSystem.markerToArray(marker);
				a[0] -= dur.years;
				a[1] -= dur.months;
				a[2] -= dur.days;
				a[6] -= dur.milliseconds;
				return this.calendarSystem.arrayToMarker(a);
			}
			addYears(marker, n) {
				let a = this.calendarSystem.markerToArray(marker);
				a[0] += n;
				return this.calendarSystem.arrayToMarker(a);
			}
			addMonths(marker, n) {
				let a = this.calendarSystem.markerToArray(marker);
				a[1] += n;
				return this.calendarSystem.arrayToMarker(a);
			}
			diffWholeYears(m0, m1) {
				let { calendarSystem } = this;
				if (timeAsMs(m0) === timeAsMs(m1) && calendarSystem.getMarkerDay(m0) === calendarSystem.getMarkerDay(m1) && calendarSystem.getMarkerMonth(m0) === calendarSystem.getMarkerMonth(m1)) return calendarSystem.getMarkerYear(m1) - calendarSystem.getMarkerYear(m0);
				return null;
			}
			diffWholeMonths(m0, m1) {
				let { calendarSystem } = this;
				if (timeAsMs(m0) === timeAsMs(m1) && calendarSystem.getMarkerDay(m0) === calendarSystem.getMarkerDay(m1)) return calendarSystem.getMarkerMonth(m1) - calendarSystem.getMarkerMonth(m0) + (calendarSystem.getMarkerYear(m1) - calendarSystem.getMarkerYear(m0)) * 12;
				return null;
			}
			greatestWholeUnit(m0, m1) {
				let n = this.diffWholeYears(m0, m1);
				if (n !== null) return {
					unit: "year",
					value: n
				};
				n = this.diffWholeMonths(m0, m1);
				if (n !== null) return {
					unit: "month",
					value: n
				};
				n = diffWholeWeeks(m0, m1);
				if (n !== null) return {
					unit: "week",
					value: n
				};
				n = diffWholeDays(m0, m1);
				if (n !== null) return {
					unit: "day",
					value: n
				};
				n = diffHours(m0, m1);
				if (isInt(n)) return {
					unit: "hour",
					value: n
				};
				n = diffMinutes(m0, m1);
				if (isInt(n)) return {
					unit: "minute",
					value: n
				};
				n = diffSeconds(m0, m1);
				if (isInt(n)) return {
					unit: "second",
					value: n
				};
				return {
					unit: "millisecond",
					value: m1.valueOf() - m0.valueOf()
				};
			}
			countDurationsBetween(m0, m1, d) {
				let diff;
				if (d.years) {
					diff = this.diffWholeYears(m0, m1);
					if (diff !== null) return diff / asRoughYears(d);
				}
				if (d.months) {
					diff = this.diffWholeMonths(m0, m1);
					if (diff !== null) return diff / asRoughMonths(d);
				}
				if (d.days) {
					diff = diffWholeDays(m0, m1);
					if (diff !== null) return diff / asRoughDays(d);
				}
				return (m1.valueOf() - m0.valueOf()) / asRoughMs(d);
			}
			startOf(m, unit) {
				if (unit === "year") return this.startOfYear(m);
				if (unit === "month") return this.startOfMonth(m);
				if (unit === "week") return this.startOfWeek(m);
				if (unit === "day") return startOfDay(m);
				if (unit === "hour") return startOfHour(m);
				if (unit === "minute") return startOfMinute(m);
				if (unit === "second") return startOfSecond(m);
				return null;
			}
			startOfYear(m) {
				return this.calendarSystem.arrayToMarker([this.calendarSystem.getMarkerYear(m)]);
			}
			startOfMonth(m) {
				return this.calendarSystem.arrayToMarker([this.calendarSystem.getMarkerYear(m), this.calendarSystem.getMarkerMonth(m)]);
			}
			startOfWeek(m) {
				return this.calendarSystem.arrayToMarker([
					this.calendarSystem.getMarkerYear(m),
					this.calendarSystem.getMarkerMonth(m),
					m.getUTCDate() - (m.getUTCDay() - this.weekDow + 7) % 7
				]);
			}
			computeWeekNumber(marker) {
				if (this.weekNumberFunc) return this.weekNumberFunc(this.toDate(marker));
				return weekOfYear(marker, this.weekDow, this.weekDoy);
			}
			format(marker, formatter, dateOptions = {}) {
				return formatter.format({
					marker,
					timeZoneOffset: dateOptions.forcedTzo != null ? dateOptions.forcedTzo : this.offsetForMarker(marker)
				}, this);
			}
			formatRange(start, end, formatter, dateOptions = {}) {
				if (dateOptions.isEndExclusive) end = addMs(end, -1);
				return formatter.formatRange({
					marker: start,
					timeZoneOffset: dateOptions.forcedStartTzo != null ? dateOptions.forcedStartTzo : this.offsetForMarker(start)
				}, {
					marker: end,
					timeZoneOffset: dateOptions.forcedEndTzo != null ? dateOptions.forcedEndTzo : this.offsetForMarker(end)
				}, this, dateOptions.defaultSeparator);
			}
			formatIso(marker, extraOptions = {}) {
				let timeZoneOffset = null;
				if (!extraOptions.omitTimeZoneOffset) {
					if (extraOptions.forcedTzo != null) timeZoneOffset = extraOptions.forcedTzo;
					else timeZoneOffset = this.offsetForMarker(marker);
				}
				return buildIsoString(marker, timeZoneOffset, extraOptions.omitTime);
			}
			timestampToMarker(ms) {
				if (this.timeZone === "local") return arrayToUtcDate(dateToLocalArray(new Date(ms)));
				if (this.timeZone === "UTC" || !this.namedTimeZoneImpl) return new Date(ms);
				return arrayToUtcDate(this.namedTimeZoneImpl.timestampToArray(ms));
			}
			offsetForMarker(m) {
				if (this.timeZone === "local") return -arrayToLocalDate(dateToUtcArray(m)).getTimezoneOffset();
				if (this.timeZone === "UTC") return 0;
				if (this.namedTimeZoneImpl) return this.namedTimeZoneImpl.offsetForArray(dateToUtcArray(m));
				return null;
			}
			toDate(m, forcedTzo) {
				if (this.timeZone === "local") return arrayToLocalDate(dateToUtcArray(m));
				if (this.timeZone === "UTC") return new Date(m.valueOf());
				if (!this.namedTimeZoneImpl) return new Date(m.valueOf() - (forcedTzo || 0));
				return /* @__PURE__ */ new Date(m.valueOf() - this.namedTimeZoneImpl.offsetForArray(dateToUtcArray(m)) * 1e3 * 60);
			}
		};
		var Theme = class {
			constructor(calendarOptions) {
				if (this.iconOverrideOption) this.setIconOverride(calendarOptions[this.iconOverrideOption]);
			}
			setIconOverride(iconOverrideHash) {
				let iconClassesCopy;
				let buttonName;
				if (typeof iconOverrideHash === "object" && iconOverrideHash) {
					iconClassesCopy = Object.assign({}, this.iconClasses);
					for (buttonName in iconOverrideHash) iconClassesCopy[buttonName] = this.applyIconOverridePrefix(iconOverrideHash[buttonName]);
					this.iconClasses = iconClassesCopy;
				} else if (iconOverrideHash === false) this.iconClasses = {};
			}
			applyIconOverridePrefix(className) {
				let prefix = this.iconOverridePrefix;
				if (prefix && className.indexOf(prefix) !== 0) className = prefix + className;
				return className;
			}
			getClass(key) {
				return this.classes[key] || "";
			}
			getIconClass(buttonName, isRtl) {
				let className;
				if (isRtl && this.rtlIconClasses) className = this.rtlIconClasses[buttonName] || this.iconClasses[buttonName];
				else className = this.iconClasses[buttonName];
				if (className) return `${this.baseIconClass} ${className}`;
				return "";
			}
			getCustomButtonIconClass(customButtonProps) {
				let className;
				if (this.iconOverrideCustomButtonOption) {
					className = customButtonProps[this.iconOverrideCustomButtonOption];
					if (className) return `${this.baseIconClass} ${this.applyIconOverridePrefix(className)}`;
				}
				return "";
			}
		};
		Theme.prototype.classes = {};
		Theme.prototype.iconClasses = {};
		Theme.prototype.baseIconClass = "";
		Theme.prototype.iconOverridePrefix = "";
		function flushSync(runBeforeFlush) {
			runBeforeFlush();
			let oldDebounceRendering = preact__namespace.options.debounceRendering;
			let callbackQ = [];
			function execCallbackSync(callback) {
				callbackQ.push(callback);
			}
			preact__namespace.options.debounceRendering = execCallbackSync;
			preact__namespace.render(preact__namespace.createElement(FakeComponent, {}), document.createElement("div"));
			while (callbackQ.length) callbackQ.shift()();
			preact__namespace.options.debounceRendering = oldDebounceRendering;
		}
		var FakeComponent = class extends preact__namespace.Component {
			render() {
				return preact__namespace.createElement("div", {});
			}
			componentDidMount() {
				this.setState({});
			}
		};
		function createContext(defaultValue) {
			let ContextType = preact__namespace.createContext(defaultValue);
			let origProvider = ContextType.Provider;
			ContextType.Provider = function() {
				let isNew = !this.getChildContext;
				let children = origProvider.apply(this, arguments);
				if (isNew) {
					let subs = [];
					this.shouldComponentUpdate = (_props) => {
						if (this.props.value !== _props.value) subs.forEach((c) => {
							c.context = _props.value;
							c.forceUpdate();
						});
					};
					this.sub = (c) => {
						subs.push(c);
						let old = c.componentWillUnmount;
						c.componentWillUnmount = () => {
							subs.splice(subs.indexOf(c), 1);
							old && old.call(c);
						};
					};
				}
				return children;
			};
			return ContextType;
		}
		var ScrollResponder = class {
			constructor(execFunc, emitter, scrollTime, scrollTimeReset) {
				this.execFunc = execFunc;
				this.emitter = emitter;
				this.scrollTime = scrollTime;
				this.scrollTimeReset = scrollTimeReset;
				this.handleScrollRequest = (request) => {
					this.queuedRequest = Object.assign({}, this.queuedRequest || {}, request);
					this.drain();
				};
				emitter.on("_scrollRequest", this.handleScrollRequest);
				this.fireInitialScroll();
			}
			detach() {
				this.emitter.off("_scrollRequest", this.handleScrollRequest);
			}
			update(isDatesNew) {
				if (isDatesNew && this.scrollTimeReset) this.fireInitialScroll();
				else this.drain();
			}
			fireInitialScroll() {
				this.handleScrollRequest({ time: this.scrollTime });
			}
			drain() {
				if (this.queuedRequest && this.execFunc(this.queuedRequest)) this.queuedRequest = null;
			}
		};
		const ViewContextType = createContext({});
		function buildViewContext(viewSpec, viewApi, viewOptions, dateProfileGenerator, dateEnv, nowManager, theme, pluginHooks, dispatch, getCurrentData, emitter, calendarApi, registerInteractiveComponent, unregisterInteractiveComponent) {
			return {
				dateEnv,
				nowManager,
				options: viewOptions,
				pluginHooks,
				emitter,
				dispatch,
				getCurrentData,
				calendarApi,
				viewSpec,
				viewApi,
				dateProfileGenerator,
				theme,
				isRtl: viewOptions.direction === "rtl",
				addResizeHandler(handler) {
					emitter.on("_resize", handler);
				},
				removeResizeHandler(handler) {
					emitter.off("_resize", handler);
				},
				createScrollResponder(execFunc) {
					return new ScrollResponder(execFunc, emitter, createDuration(viewOptions.scrollTime), viewOptions.scrollTimeReset);
				},
				registerInteractiveComponent,
				unregisterInteractiveComponent
			};
		}
		var PureComponent = class extends preact.Component {
			shouldComponentUpdate(nextProps, nextState) {
				return !compareObjs(this.props, nextProps, this.propEquality) || !compareObjs(this.state, nextState, this.stateEquality);
			}
			safeSetState(newState) {
				if (!compareObjs(this.state, Object.assign(Object.assign({}, this.state), newState), this.stateEquality)) this.setState(newState);
			}
		};
		PureComponent.addPropsEquality = addPropsEquality;
		PureComponent.addStateEquality = addStateEquality;
		PureComponent.contextType = ViewContextType;
		PureComponent.prototype.propEquality = {};
		PureComponent.prototype.stateEquality = {};
		var BaseComponent = class extends PureComponent {};
		BaseComponent.contextType = ViewContextType;
		function addPropsEquality(propEquality) {
			let hash = Object.create(this.prototype.propEquality);
			Object.assign(hash, propEquality);
			this.prototype.propEquality = hash;
		}
		function addStateEquality(stateEquality) {
			let hash = Object.create(this.prototype.stateEquality);
			Object.assign(hash, stateEquality);
			this.prototype.stateEquality = hash;
		}
		function setRef(ref, current) {
			if (typeof ref === "function") ref(current);
			else if (ref) ref.current = current;
		}
		var ContentInjector = class extends BaseComponent {
			constructor() {
				super(...arguments);
				this.id = guid();
				this.queuedDomNodes = [];
				this.currentDomNodes = [];
				this.handleEl = (el) => {
					const { options } = this.context;
					const { generatorName } = this.props;
					if (!options.customRenderingReplaces || !hasCustomRenderingHandler(generatorName, options)) this.updateElRef(el);
				};
				this.updateElRef = (el) => {
					if (this.props.elRef) setRef(this.props.elRef, el);
				};
			}
			render() {
				const { props, context } = this;
				const { options } = context;
				const { customGenerator, defaultGenerator, renderProps } = props;
				const attrs = buildElAttrs(props, [], this.handleEl);
				let useDefault = false;
				let innerContent;
				let queuedDomNodes = [];
				let currentGeneratorMeta;
				if (customGenerator != null) {
					const customGeneratorRes = typeof customGenerator === "function" ? customGenerator(renderProps, preact.createElement) : customGenerator;
					if (customGeneratorRes === true) useDefault = true;
					else {
						const isObject = customGeneratorRes && typeof customGeneratorRes === "object";
						if (isObject && "html" in customGeneratorRes) attrs.dangerouslySetInnerHTML = { __html: customGeneratorRes.html };
						else if (isObject && "domNodes" in customGeneratorRes) queuedDomNodes = Array.prototype.slice.call(customGeneratorRes.domNodes);
						else if (isObject ? preact.isValidElement(customGeneratorRes) : typeof customGeneratorRes !== "function") innerContent = customGeneratorRes;
						else currentGeneratorMeta = customGeneratorRes;
					}
				} else useDefault = !hasCustomRenderingHandler(props.generatorName, options);
				if (useDefault && defaultGenerator) innerContent = defaultGenerator(renderProps);
				this.queuedDomNodes = queuedDomNodes;
				this.currentGeneratorMeta = currentGeneratorMeta;
				return preact.createElement(props.elTag, attrs, innerContent);
			}
			componentDidMount() {
				this.applyQueueudDomNodes();
				this.triggerCustomRendering(true);
			}
			componentDidUpdate() {
				this.applyQueueudDomNodes();
				this.triggerCustomRendering(true);
			}
			componentWillUnmount() {
				this.triggerCustomRendering(false);
			}
			triggerCustomRendering(isActive) {
				var _a;
				const { props, context } = this;
				const { handleCustomRendering, customRenderingMetaMap } = context.options;
				if (handleCustomRendering) {
					const generatorMeta = (_a = this.currentGeneratorMeta) !== null && _a !== void 0 ? _a : customRenderingMetaMap === null || customRenderingMetaMap === void 0 ? void 0 : customRenderingMetaMap[props.generatorName];
					if (generatorMeta) handleCustomRendering(Object.assign(Object.assign({
						id: this.id,
						isActive,
						containerEl: this.base,
						reportNewContainerEl: this.updateElRef,
						generatorMeta
					}, props), { elClasses: (props.elClasses || []).filter(isTruthy) }));
				}
			}
			applyQueueudDomNodes() {
				const { queuedDomNodes, currentDomNodes } = this;
				const el = this.base;
				if (!isArraysEqual(queuedDomNodes, currentDomNodes)) {
					currentDomNodes.forEach(removeElement);
					for (let newNode of queuedDomNodes) el.appendChild(newNode);
					this.currentDomNodes = queuedDomNodes;
				}
			}
		};
		ContentInjector.addPropsEquality({
			elClasses: isArraysEqual,
			elStyle: isPropsEqual,
			elAttrs: isNonHandlerPropsEqual,
			renderProps: isPropsEqual
		});
		function hasCustomRenderingHandler(generatorName, options) {
			var _a;
			return Boolean(options.handleCustomRendering && generatorName && ((_a = options.customRenderingMetaMap) === null || _a === void 0 ? void 0 : _a[generatorName]));
		}
		function buildElAttrs(props, extraClassNames, elRef) {
			const attrs = Object.assign(Object.assign({}, props.elAttrs), { ref: elRef });
			if (props.elClasses || extraClassNames) attrs.className = (props.elClasses || []).concat(extraClassNames || []).concat(attrs.className || []).filter(Boolean).join(" ");
			if (props.elStyle) attrs.style = props.elStyle;
			return attrs;
		}
		function isTruthy(val) {
			return Boolean(val);
		}
		const RenderId = createContext(0);
		var ContentContainer = class extends preact.Component {
			constructor() {
				super(...arguments);
				this.InnerContent = InnerContentInjector.bind(void 0, this);
				this.handleEl = (el) => {
					this.el = el;
					if (this.props.elRef) {
						setRef(this.props.elRef, el);
						if (el && this.didMountMisfire) this.componentDidMount();
					}
				};
			}
			render() {
				const { props } = this;
				const generatedClassNames = generateClassNames(props.classNameGenerator, props.renderProps);
				if (props.children) {
					const elAttrs = buildElAttrs(props, generatedClassNames, this.handleEl);
					const children = props.children(this.InnerContent, props.renderProps, elAttrs);
					if (props.elTag) return preact.createElement(props.elTag, elAttrs, children);
					else return children;
				} else return preact.createElement(ContentInjector, Object.assign(Object.assign({}, props), {
					elRef: this.handleEl,
					elTag: props.elTag || "div",
					elClasses: (props.elClasses || []).concat(generatedClassNames),
					renderId: this.context
				}));
			}
			componentDidMount() {
				var _a, _b;
				if (this.el) (_b = (_a = this.props).didMount) === null || _b === void 0 || _b.call(_a, Object.assign(Object.assign({}, this.props.renderProps), { el: this.el }));
				else this.didMountMisfire = true;
			}
			componentWillUnmount() {
				var _a, _b;
				(_b = (_a = this.props).willUnmount) === null || _b === void 0 || _b.call(_a, Object.assign(Object.assign({}, this.props.renderProps), { el: this.el }));
			}
		};
		ContentContainer.contextType = RenderId;
		function InnerContentInjector(containerComponent, props) {
			const parentProps = containerComponent.props;
			return preact.createElement(ContentInjector, Object.assign({
				renderProps: parentProps.renderProps,
				generatorName: parentProps.generatorName,
				customGenerator: parentProps.customGenerator,
				defaultGenerator: parentProps.defaultGenerator,
				renderId: containerComponent.context
			}, props));
		}
		function generateClassNames(classNameGenerator, renderProps) {
			const classNames = typeof classNameGenerator === "function" ? classNameGenerator(renderProps) : classNameGenerator || [];
			return typeof classNames === "string" ? [classNames] : classNames;
		}
		var ViewContainer = class extends BaseComponent {
			render() {
				let { props, context } = this;
				let { options } = context;
				let renderProps = { view: context.viewApi };
				return preact.createElement(ContentContainer, {
					elRef: props.elRef,
					elTag: props.elTag || "div",
					elAttrs: props.elAttrs,
					elClasses: [...buildViewClassNames(props.viewSpec), ...props.elClasses || []],
					elStyle: props.elStyle,
					renderProps,
					classNameGenerator: options.viewClassNames,
					generatorName: void 0,
					didMount: options.viewDidMount,
					willUnmount: options.viewWillUnmount
				}, () => props.children);
			}
		};
		function buildViewClassNames(viewSpec) {
			return [`fc-${viewSpec.type}-view`, "fc-view"];
		}
		function parseRange(input, dateEnv) {
			let start = null;
			let end = null;
			if (input.start) start = dateEnv.createMarker(input.start);
			if (input.end) end = dateEnv.createMarker(input.end);
			if (!start && !end) return null;
			if (start && end && end < start) return null;
			return {
				start,
				end
			};
		}
		function invertRanges(ranges, constraintRange) {
			let invertedRanges = [];
			let { start } = constraintRange;
			let i;
			let dateRange;
			ranges.sort(compareRanges);
			for (i = 0; i < ranges.length; i += 1) {
				dateRange = ranges[i];
				if (dateRange.start > start) invertedRanges.push({
					start,
					end: dateRange.start
				});
				if (dateRange.end > start) start = dateRange.end;
			}
			if (start < constraintRange.end) invertedRanges.push({
				start,
				end: constraintRange.end
			});
			return invertedRanges;
		}
		function compareRanges(range0, range1) {
			return range0.start.valueOf() - range1.start.valueOf();
		}
		function intersectRanges(range0, range1) {
			let { start, end } = range0;
			let newRange = null;
			if (range1.start !== null) {
				if (start === null) start = range1.start;
				else start = new Date(Math.max(start.valueOf(), range1.start.valueOf()));
			}
			if (range1.end != null) {
				if (end === null) end = range1.end;
				else end = new Date(Math.min(end.valueOf(), range1.end.valueOf()));
			}
			if (start === null || end === null || start < end) newRange = {
				start,
				end
			};
			return newRange;
		}
		function rangesEqual(range0, range1) {
			return (range0.start === null ? null : range0.start.valueOf()) === (range1.start === null ? null : range1.start.valueOf()) && (range0.end === null ? null : range0.end.valueOf()) === (range1.end === null ? null : range1.end.valueOf());
		}
		function rangesIntersect(range0, range1) {
			return (range0.end === null || range1.start === null || range0.end > range1.start) && (range0.start === null || range1.end === null || range0.start < range1.end);
		}
		function rangeContainsRange(outerRange, innerRange) {
			return (outerRange.start === null || innerRange.start !== null && innerRange.start >= outerRange.start) && (outerRange.end === null || innerRange.end !== null && innerRange.end <= outerRange.end);
		}
		function rangeContainsMarker(range, date) {
			return (range.start === null || date >= range.start) && (range.end === null || date < range.end);
		}
		function constrainMarkerToRange(date, range) {
			if (range.start != null && date < range.start) return range.start;
			if (range.end != null && date >= range.end) return /* @__PURE__ */ new Date(range.end.valueOf() - 1);
			return date;
		}
		function computeAlignedDayRange(timedRange) {
			let dayCnt = Math.floor(diffDays(timedRange.start, timedRange.end)) || 1;
			let start = startOfDay(timedRange.start);
			return {
				start,
				end: addDays(start, dayCnt)
			};
		}
		function computeVisibleDayRange(timedRange, nextDayThreshold = createDuration(0)) {
			let startDay = null;
			let endDay = null;
			if (timedRange.end) {
				endDay = startOfDay(timedRange.end);
				let endTimeMS = timedRange.end.valueOf() - endDay.valueOf();
				if (endTimeMS && endTimeMS >= asRoughMs(nextDayThreshold)) endDay = addDays(endDay, 1);
			}
			if (timedRange.start) {
				startDay = startOfDay(timedRange.start);
				if (endDay && endDay <= startDay) endDay = addDays(startDay, 1);
			}
			return {
				start: startDay,
				end: endDay
			};
		}
		function isMultiDayRange(range) {
			let visibleRange = computeVisibleDayRange(range);
			return diffDays(visibleRange.start, visibleRange.end) > 1;
		}
		function diffDates(date0, date1, dateEnv, largeUnit) {
			if (largeUnit === "year") return createDuration(dateEnv.diffWholeYears(date0, date1), "year");
			if (largeUnit === "month") return createDuration(dateEnv.diffWholeMonths(date0, date1), "month");
			return diffDayAndTime(date0, date1);
		}
		var DateProfileGenerator = class {
			constructor(props) {
				this.props = props;
				this.initHiddenDays();
			}
			buildPrev(currentDateProfile, currentDate, forceToValid) {
				let { dateEnv } = this.props;
				let prevDate = dateEnv.subtract(dateEnv.startOf(currentDate, currentDateProfile.currentRangeUnit), currentDateProfile.dateIncrement);
				return this.build(prevDate, -1, forceToValid);
			}
			buildNext(currentDateProfile, currentDate, forceToValid) {
				let { dateEnv } = this.props;
				let nextDate = dateEnv.add(dateEnv.startOf(currentDate, currentDateProfile.currentRangeUnit), currentDateProfile.dateIncrement);
				return this.build(nextDate, 1, forceToValid);
			}
			build(currentDate, direction, forceToValid = true) {
				let { props } = this;
				let validRange;
				let currentInfo;
				let isRangeAllDay;
				let renderRange;
				let activeRange;
				let isValid;
				validRange = this.buildValidRange();
				validRange = this.trimHiddenDays(validRange);
				if (forceToValid) currentDate = constrainMarkerToRange(currentDate, validRange);
				currentInfo = this.buildCurrentRangeInfo(currentDate, direction);
				isRangeAllDay = /^(year|month|week|day)$/.test(currentInfo.unit);
				renderRange = this.buildRenderRange(this.trimHiddenDays(currentInfo.range), currentInfo.unit, isRangeAllDay);
				renderRange = this.trimHiddenDays(renderRange);
				activeRange = renderRange;
				if (!props.showNonCurrentDates) activeRange = intersectRanges(activeRange, currentInfo.range);
				activeRange = this.adjustActiveRange(activeRange);
				activeRange = intersectRanges(activeRange, validRange);
				isValid = rangesIntersect(currentInfo.range, validRange);
				if (!rangeContainsMarker(renderRange, currentDate)) currentDate = renderRange.start;
				return {
					currentDate,
					validRange,
					currentRange: currentInfo.range,
					currentRangeUnit: currentInfo.unit,
					isRangeAllDay,
					activeRange,
					renderRange,
					slotMinTime: props.slotMinTime,
					slotMaxTime: props.slotMaxTime,
					isValid,
					dateIncrement: this.buildDateIncrement(currentInfo.duration)
				};
			}
			buildValidRange() {
				let input = this.props.validRangeInput;
				let simpleInput = typeof input === "function" ? input.call(this.props.calendarApi, this.props.dateEnv.toDate(this.props.nowManager.getDateMarker())) : input;
				return this.refineRange(simpleInput) || {
					start: null,
					end: null
				};
			}
			buildCurrentRangeInfo(date, direction) {
				let { props } = this;
				let duration = null;
				let unit = null;
				let range = null;
				let dayCount;
				if (props.duration) {
					duration = props.duration;
					unit = props.durationUnit;
					range = this.buildRangeFromDuration(date, direction, duration, unit);
				} else if (dayCount = this.props.dayCount) {
					unit = "day";
					range = this.buildRangeFromDayCount(date, direction, dayCount);
				} else if (range = this.buildCustomVisibleRange(date)) unit = props.dateEnv.greatestWholeUnit(range.start, range.end).unit;
				else {
					duration = this.getFallbackDuration();
					unit = greatestDurationDenominator(duration).unit;
					range = this.buildRangeFromDuration(date, direction, duration, unit);
				}
				return {
					duration,
					unit,
					range
				};
			}
			getFallbackDuration() {
				return createDuration({ day: 1 });
			}
			adjustActiveRange(range) {
				let { dateEnv, usesMinMaxTime, slotMinTime, slotMaxTime } = this.props;
				let { start, end } = range;
				if (usesMinMaxTime) {
					if (asRoughDays(slotMinTime) < 0) {
						start = startOfDay(start);
						start = dateEnv.add(start, slotMinTime);
					}
					if (asRoughDays(slotMaxTime) > 1) {
						end = startOfDay(end);
						end = addDays(end, -1);
						end = dateEnv.add(end, slotMaxTime);
					}
				}
				return {
					start,
					end
				};
			}
			buildRangeFromDuration(date, direction, duration, unit) {
				let { dateEnv, dateAlignment } = this.props;
				let start;
				let end;
				let res;
				if (!dateAlignment) {
					let { dateIncrement } = this.props;
					if (dateIncrement) {
						if (asRoughMs(dateIncrement) < asRoughMs(duration)) dateAlignment = greatestDurationDenominator(dateIncrement).unit;
						else dateAlignment = unit;
					} else dateAlignment = unit;
				}
				if (asRoughDays(duration) <= 1) {
					if (this.isHiddenDay(start)) {
						start = this.skipHiddenDays(start, direction);
						start = startOfDay(start);
					}
				}
				function computeRes() {
					start = dateEnv.startOf(date, dateAlignment);
					end = dateEnv.add(start, duration);
					res = {
						start,
						end
					};
				}
				computeRes();
				if (!this.trimHiddenDays(res)) {
					date = this.skipHiddenDays(date, direction);
					computeRes();
				}
				return res;
			}
			buildRangeFromDayCount(date, direction, dayCount) {
				let { dateEnv, dateAlignment } = this.props;
				let runningCount = 0;
				let start = date;
				let end;
				if (dateAlignment) start = dateEnv.startOf(start, dateAlignment);
				start = startOfDay(start);
				start = this.skipHiddenDays(start, direction);
				end = start;
				do {
					end = addDays(end, 1);
					if (!this.isHiddenDay(end)) runningCount += 1;
				} while (runningCount < dayCount);
				return {
					start,
					end
				};
			}
			buildCustomVisibleRange(date) {
				let { props } = this;
				let input = props.visibleRangeInput;
				let simpleInput = typeof input === "function" ? input.call(props.calendarApi, props.dateEnv.toDate(date)) : input;
				let range = this.refineRange(simpleInput);
				if (range && (range.start == null || range.end == null)) return null;
				return range;
			}
			buildRenderRange(currentRange, currentRangeUnit, isRangeAllDay) {
				return currentRange;
			}
			buildDateIncrement(fallback) {
				let { dateIncrement } = this.props;
				let customAlignment;
				if (dateIncrement) return dateIncrement;
				if (customAlignment = this.props.dateAlignment) return createDuration(1, customAlignment);
				if (fallback) return fallback;
				return createDuration({ days: 1 });
			}
			refineRange(rangeInput) {
				if (rangeInput) {
					let range = parseRange(rangeInput, this.props.dateEnv);
					if (range) range = computeVisibleDayRange(range);
					return range;
				}
				return null;
			}
			initHiddenDays() {
				let hiddenDays = this.props.hiddenDays || [];
				let isHiddenDayHash = [];
				let dayCnt = 0;
				let i;
				if (this.props.weekends === false) hiddenDays.push(0, 6);
				for (i = 0; i < 7; i += 1) if (!(isHiddenDayHash[i] = hiddenDays.indexOf(i) !== -1)) dayCnt += 1;
				if (!dayCnt) throw new Error("invalid hiddenDays");
				this.isHiddenDayHash = isHiddenDayHash;
			}
			trimHiddenDays(range) {
				let { start, end } = range;
				if (start) start = this.skipHiddenDays(start);
				if (end) end = this.skipHiddenDays(end, -1, true);
				if (start == null || end == null || start < end) return {
					start,
					end
				};
				return null;
			}
			isHiddenDay(day) {
				if (day instanceof Date) day = day.getUTCDay();
				return this.isHiddenDayHash[day];
			}
			skipHiddenDays(date, inc = 1, isExclusive = false) {
				while (this.isHiddenDayHash[(date.getUTCDay() + (isExclusive ? inc : 0) + 7) % 7]) date = addDays(date, inc);
				return date;
			}
		};
		function createEventInstance(defId, range, forcedStartTzo, forcedEndTzo) {
			return {
				instanceId: guid(),
				defId,
				range,
				forcedStartTzo: forcedStartTzo == null ? null : forcedStartTzo,
				forcedEndTzo: forcedEndTzo == null ? null : forcedEndTzo
			};
		}
		function parseRecurring(refined, defaultAllDay, dateEnv, recurringTypes) {
			for (let i = 0; i < recurringTypes.length; i += 1) {
				let parsed = recurringTypes[i].parse(refined, dateEnv);
				if (parsed) {
					let { allDay } = refined;
					if (allDay == null) {
						allDay = defaultAllDay;
						if (allDay == null) {
							allDay = parsed.allDayGuess;
							if (allDay == null) allDay = false;
						}
					}
					return {
						allDay,
						duration: parsed.duration,
						typeData: parsed.typeData,
						typeId: i
					};
				}
			}
			return null;
		}
		function expandRecurring(eventStore, framingRange, context) {
			let { dateEnv, pluginHooks, options } = context;
			let { defs, instances } = eventStore;
			instances = filterHash(instances, (instance) => !defs[instance.defId].recurringDef);
			for (let defId in defs) {
				let def = defs[defId];
				if (def.recurringDef) {
					let { duration } = def.recurringDef;
					if (!duration) duration = def.allDay ? options.defaultAllDayEventDuration : options.defaultTimedEventDuration;
					let starts = expandRecurringRanges(def, duration, framingRange, dateEnv, pluginHooks.recurringTypes);
					for (let start of starts) {
						let instance = createEventInstance(defId, {
							start,
							end: dateEnv.add(start, duration)
						});
						instances[instance.instanceId] = instance;
					}
				}
			}
			return {
				defs,
				instances
			};
		}
		function expandRecurringRanges(eventDef, duration, framingRange, dateEnv, recurringTypes) {
			let markers = recurringTypes[eventDef.recurringDef.typeId].expand(eventDef.recurringDef.typeData, {
				start: dateEnv.subtract(framingRange.start, duration),
				end: framingRange.end
			}, dateEnv);
			if (eventDef.allDay) markers = markers.map(startOfDay);
			return markers;
		}
		const EVENT_NON_DATE_REFINERS = {
			id: String,
			groupId: String,
			title: String,
			url: String,
			interactive: Boolean
		};
		const EVENT_DATE_REFINERS = {
			start: identity,
			end: identity,
			date: identity,
			allDay: Boolean
		};
		const EVENT_REFINERS = Object.assign(Object.assign(Object.assign({}, EVENT_NON_DATE_REFINERS), EVENT_DATE_REFINERS), { extendedProps: identity });
		function parseEvent(raw, eventSource, context, allowOpenRange, refiners = buildEventRefiners(context), defIdMap, instanceIdMap) {
			let { refined, extra } = refineEventDef(raw, context, refiners);
			let defaultAllDay = computeIsDefaultAllDay(eventSource, context);
			let recurringRes = parseRecurring(refined, defaultAllDay, context.dateEnv, context.pluginHooks.recurringTypes);
			if (recurringRes) {
				let def = parseEventDef(refined, extra, eventSource ? eventSource.sourceId : "", recurringRes.allDay, Boolean(recurringRes.duration), context, defIdMap);
				def.recurringDef = {
					typeId: recurringRes.typeId,
					typeData: recurringRes.typeData,
					duration: recurringRes.duration
				};
				return {
					def,
					instance: null
				};
			}
			let singleRes = parseSingle(refined, defaultAllDay, context, allowOpenRange);
			if (singleRes) {
				let def = parseEventDef(refined, extra, eventSource ? eventSource.sourceId : "", singleRes.allDay, singleRes.hasEnd, context, defIdMap);
				let instance = createEventInstance(def.defId, singleRes.range, singleRes.forcedStartTzo, singleRes.forcedEndTzo);
				if (instanceIdMap && def.publicId && instanceIdMap[def.publicId]) instance.instanceId = instanceIdMap[def.publicId];
				return {
					def,
					instance
				};
			}
			return null;
		}
		function refineEventDef(raw, context, refiners = buildEventRefiners(context)) {
			return refineProps(raw, refiners);
		}
		function buildEventRefiners(context) {
			return Object.assign(Object.assign(Object.assign({}, EVENT_UI_REFINERS), EVENT_REFINERS), context.pluginHooks.eventRefiners);
		}
		function parseEventDef(refined, extra, sourceId, allDay, hasEnd, context, defIdMap) {
			let def = {
				title: refined.title || "",
				groupId: refined.groupId || "",
				publicId: refined.id || "",
				url: refined.url || "",
				recurringDef: null,
				defId: (defIdMap && refined.id ? defIdMap[refined.id] : "") || guid(),
				sourceId,
				allDay,
				hasEnd,
				interactive: refined.interactive,
				ui: createEventUi(refined, context),
				extendedProps: Object.assign(Object.assign({}, refined.extendedProps || {}), extra)
			};
			for (let memberAdder of context.pluginHooks.eventDefMemberAdders) Object.assign(def, memberAdder(refined));
			Object.freeze(def.ui.classNames);
			Object.freeze(def.extendedProps);
			return def;
		}
		function parseSingle(refined, defaultAllDay, context, allowOpenRange) {
			let { allDay } = refined;
			let startMeta;
			let startMarker = null;
			let hasEnd = false;
			let endMeta;
			let endMarker = null;
			let startInput = refined.start != null ? refined.start : refined.date;
			startMeta = context.dateEnv.createMarkerMeta(startInput);
			if (startMeta) startMarker = startMeta.marker;
			else if (!allowOpenRange) return null;
			if (refined.end != null) endMeta = context.dateEnv.createMarkerMeta(refined.end);
			if (allDay == null) {
				if (defaultAllDay != null) allDay = defaultAllDay;
				else allDay = (!startMeta || startMeta.isTimeUnspecified) && (!endMeta || endMeta.isTimeUnspecified);
			}
			if (allDay && startMarker) startMarker = startOfDay(startMarker);
			if (endMeta) {
				endMarker = endMeta.marker;
				if (allDay) endMarker = startOfDay(endMarker);
				if (startMarker && endMarker <= startMarker) endMarker = null;
			}
			if (endMarker) hasEnd = true;
			else if (!allowOpenRange) {
				hasEnd = context.options.forceEventDuration || false;
				endMarker = context.dateEnv.add(startMarker, allDay ? context.options.defaultAllDayEventDuration : context.options.defaultTimedEventDuration);
			}
			return {
				allDay,
				hasEnd,
				range: {
					start: startMarker,
					end: endMarker
				},
				forcedStartTzo: startMeta ? startMeta.forcedTzo : null,
				forcedEndTzo: endMeta ? endMeta.forcedTzo : null
			};
		}
		function computeIsDefaultAllDay(eventSource, context) {
			let res = null;
			if (eventSource) res = eventSource.defaultAllDay;
			if (res == null) res = context.options.defaultAllDay;
			return res;
		}
		function parseEvents(rawEvents, eventSource, context, allowOpenRange, defIdMap, instanceIdMap) {
			let eventStore = createEmptyEventStore();
			let eventRefiners = buildEventRefiners(context);
			for (let rawEvent of rawEvents) {
				let tuple = parseEvent(rawEvent, eventSource, context, allowOpenRange, eventRefiners, defIdMap, instanceIdMap);
				if (tuple) eventTupleToStore(tuple, eventStore);
			}
			return eventStore;
		}
		function eventTupleToStore(tuple, eventStore = createEmptyEventStore()) {
			eventStore.defs[tuple.def.defId] = tuple.def;
			if (tuple.instance) eventStore.instances[tuple.instance.instanceId] = tuple.instance;
			return eventStore;
		}
		function getRelevantEvents(eventStore, instanceId) {
			let instance = eventStore.instances[instanceId];
			if (instance) {
				let def = eventStore.defs[instance.defId];
				let newStore = filterEventStoreDefs(eventStore, (lookDef) => isEventDefsGrouped(def, lookDef));
				newStore.defs[def.defId] = def;
				newStore.instances[instance.instanceId] = instance;
				return newStore;
			}
			return createEmptyEventStore();
		}
		function isEventDefsGrouped(def0, def1) {
			return Boolean(def0.groupId && def0.groupId === def1.groupId);
		}
		function createEmptyEventStore() {
			return {
				defs: {},
				instances: {}
			};
		}
		function mergeEventStores(store0, store1) {
			return {
				defs: Object.assign(Object.assign({}, store0.defs), store1.defs),
				instances: Object.assign(Object.assign({}, store0.instances), store1.instances)
			};
		}
		function filterEventStoreDefs(eventStore, filterFunc) {
			let defs = filterHash(eventStore.defs, filterFunc);
			return {
				defs,
				instances: filterHash(eventStore.instances, (instance) => defs[instance.defId])
			};
		}
		function excludeSubEventStore(master, sub) {
			let { defs, instances } = master;
			let filteredDefs = {};
			let filteredInstances = {};
			for (let defId in defs) if (!sub.defs[defId]) filteredDefs[defId] = defs[defId];
			for (let instanceId in instances) if (!sub.instances[instanceId] && filteredDefs[instances[instanceId].defId]) filteredInstances[instanceId] = instances[instanceId];
			return {
				defs: filteredDefs,
				instances: filteredInstances
			};
		}
		function normalizeConstraint(input, context) {
			if (Array.isArray(input)) return parseEvents(input, null, context, true);
			if (typeof input === "object" && input) return parseEvents([input], null, context, true);
			if (input != null) return String(input);
			return null;
		}
		function parseClassNames(raw) {
			if (Array.isArray(raw)) return raw;
			if (typeof raw === "string") return raw.split(/\s+/);
			return [];
		}
		const EVENT_UI_REFINERS = {
			display: String,
			editable: Boolean,
			startEditable: Boolean,
			durationEditable: Boolean,
			constraint: identity,
			overlap: identity,
			allow: identity,
			className: parseClassNames,
			classNames: parseClassNames,
			color: String,
			backgroundColor: String,
			borderColor: String,
			textColor: String
		};
		const EMPTY_EVENT_UI = {
			display: null,
			startEditable: null,
			durationEditable: null,
			constraints: [],
			overlap: null,
			allows: [],
			backgroundColor: "",
			borderColor: "",
			textColor: "",
			classNames: []
		};
		function createEventUi(refined, context) {
			let constraint = normalizeConstraint(refined.constraint, context);
			return {
				display: refined.display || null,
				startEditable: refined.startEditable != null ? refined.startEditable : refined.editable,
				durationEditable: refined.durationEditable != null ? refined.durationEditable : refined.editable,
				constraints: constraint != null ? [constraint] : [],
				overlap: refined.overlap != null ? refined.overlap : null,
				allows: refined.allow != null ? [refined.allow] : [],
				backgroundColor: refined.backgroundColor || refined.color || "",
				borderColor: refined.borderColor || refined.color || "",
				textColor: refined.textColor || "",
				classNames: (refined.className || []).concat(refined.classNames || [])
			};
		}
		function combineEventUis(uis) {
			return uis.reduce(combineTwoEventUis, EMPTY_EVENT_UI);
		}
		function combineTwoEventUis(item0, item1) {
			return {
				display: item1.display != null ? item1.display : item0.display,
				startEditable: item1.startEditable != null ? item1.startEditable : item0.startEditable,
				durationEditable: item1.durationEditable != null ? item1.durationEditable : item0.durationEditable,
				constraints: item0.constraints.concat(item1.constraints),
				overlap: typeof item1.overlap === "boolean" ? item1.overlap : item0.overlap,
				allows: item0.allows.concat(item1.allows),
				backgroundColor: item1.backgroundColor || item0.backgroundColor,
				borderColor: item1.borderColor || item0.borderColor,
				textColor: item1.textColor || item0.textColor,
				classNames: item0.classNames.concat(item1.classNames)
			};
		}
		const EVENT_SOURCE_REFINERS = {
			id: String,
			defaultAllDay: Boolean,
			url: String,
			format: String,
			events: identity,
			eventDataTransform: identity,
			success: identity,
			failure: identity
		};
		function parseEventSource(raw, context, refiners = buildEventSourceRefiners(context)) {
			let rawObj;
			if (typeof raw === "string") rawObj = { url: raw };
			else if (typeof raw === "function" || Array.isArray(raw)) rawObj = { events: raw };
			else if (typeof raw === "object" && raw) rawObj = raw;
			if (rawObj) {
				let { refined, extra } = refineProps(rawObj, refiners);
				let metaRes = buildEventSourceMeta(refined, context);
				if (metaRes) return {
					_raw: raw,
					isFetching: false,
					latestFetchId: "",
					fetchRange: null,
					defaultAllDay: refined.defaultAllDay,
					eventDataTransform: refined.eventDataTransform,
					success: refined.success,
					failure: refined.failure,
					publicId: refined.id || "",
					sourceId: guid(),
					sourceDefId: metaRes.sourceDefId,
					meta: metaRes.meta,
					ui: createEventUi(refined, context),
					extendedProps: extra
				};
			}
			return null;
		}
		function buildEventSourceRefiners(context) {
			return Object.assign(Object.assign(Object.assign({}, EVENT_UI_REFINERS), EVENT_SOURCE_REFINERS), context.pluginHooks.eventSourceRefiners);
		}
		function buildEventSourceMeta(raw, context) {
			let defs = context.pluginHooks.eventSourceDefs;
			for (let i = defs.length - 1; i >= 0; i -= 1) {
				let meta = defs[i].parseMeta(raw);
				if (meta) return {
					sourceDefId: i,
					meta
				};
			}
			return null;
		}
		function reduceEventStore(eventStore, action, eventSources, dateProfile, context) {
			switch (action.type) {
				case "RECEIVE_EVENTS": return receiveRawEvents(eventStore, eventSources[action.sourceId], action.fetchId, action.fetchRange, action.rawEvents, context);
				case "RESET_RAW_EVENTS": return resetRawEvents(eventStore, eventSources[action.sourceId], action.rawEvents, dateProfile.activeRange, context);
				case "ADD_EVENTS": return addEvent(eventStore, action.eventStore, dateProfile ? dateProfile.activeRange : null, context);
				case "RESET_EVENTS": return action.eventStore;
				case "MERGE_EVENTS": return mergeEventStores(eventStore, action.eventStore);
				case "PREV":
				case "NEXT":
				case "CHANGE_DATE":
				case "CHANGE_VIEW_TYPE":
					if (dateProfile) return expandRecurring(eventStore, dateProfile.activeRange, context);
					return eventStore;
				case "REMOVE_EVENTS": return excludeSubEventStore(eventStore, action.eventStore);
				case "REMOVE_EVENT_SOURCE": return excludeEventsBySourceId(eventStore, action.sourceId);
				case "REMOVE_ALL_EVENT_SOURCES": return filterEventStoreDefs(eventStore, (eventDef) => !eventDef.sourceId);
				case "REMOVE_ALL_EVENTS": return createEmptyEventStore();
				default: return eventStore;
			}
		}
		function receiveRawEvents(eventStore, eventSource, fetchId, fetchRange, rawEvents, context) {
			if (eventSource && fetchId === eventSource.latestFetchId) {
				let subset = parseEvents(transformRawEvents(rawEvents, eventSource, context), eventSource, context);
				if (fetchRange) subset = expandRecurring(subset, fetchRange, context);
				return mergeEventStores(excludeEventsBySourceId(eventStore, eventSource.sourceId), subset);
			}
			return eventStore;
		}
		function resetRawEvents(existingEventStore, eventSource, rawEvents, activeRange, context) {
			const { defIdMap, instanceIdMap } = buildPublicIdMaps(existingEventStore);
			return expandRecurring(parseEvents(transformRawEvents(rawEvents, eventSource, context), eventSource, context, false, defIdMap, instanceIdMap), activeRange, context);
		}
		function transformRawEvents(rawEvents, eventSource, context) {
			let calEachTransform = context.options.eventDataTransform;
			let sourceEachTransform = eventSource ? eventSource.eventDataTransform : null;
			if (sourceEachTransform) rawEvents = transformEachRawEvent(rawEvents, sourceEachTransform);
			if (calEachTransform) rawEvents = transformEachRawEvent(rawEvents, calEachTransform);
			return rawEvents;
		}
		function transformEachRawEvent(rawEvents, func) {
			let refinedEvents;
			if (!func) refinedEvents = rawEvents;
			else {
				refinedEvents = [];
				for (let rawEvent of rawEvents) {
					let refinedEvent = func(rawEvent);
					if (refinedEvent) refinedEvents.push(refinedEvent);
					else if (refinedEvent == null) refinedEvents.push(rawEvent);
				}
			}
			return refinedEvents;
		}
		function addEvent(eventStore, subset, expandRange, context) {
			if (expandRange) subset = expandRecurring(subset, expandRange, context);
			return mergeEventStores(eventStore, subset);
		}
		function rezoneEventStoreDates(eventStore, oldDateEnv, newDateEnv) {
			let { defs } = eventStore;
			return {
				defs,
				instances: mapHash(eventStore.instances, (instance) => {
					if (defs[instance.defId].allDay) return instance;
					return Object.assign(Object.assign({}, instance), {
						range: {
							start: newDateEnv.createMarker(oldDateEnv.toDate(instance.range.start, instance.forcedStartTzo)),
							end: newDateEnv.createMarker(oldDateEnv.toDate(instance.range.end, instance.forcedEndTzo))
						},
						forcedStartTzo: newDateEnv.canComputeOffset ? null : instance.forcedStartTzo,
						forcedEndTzo: newDateEnv.canComputeOffset ? null : instance.forcedEndTzo
					});
				})
			};
		}
		function excludeEventsBySourceId(eventStore, sourceId) {
			return filterEventStoreDefs(eventStore, (eventDef) => eventDef.sourceId !== sourceId);
		}
		function excludeInstances(eventStore, removals) {
			return {
				defs: eventStore.defs,
				instances: filterHash(eventStore.instances, (instance) => !removals[instance.instanceId])
			};
		}
		function buildPublicIdMaps(eventStore) {
			const { defs, instances } = eventStore;
			const defIdMap = {};
			const instanceIdMap = {};
			for (let defId in defs) {
				const { publicId } = defs[defId];
				if (publicId) defIdMap[publicId] = defId;
			}
			for (let instanceId in instances) {
				const { publicId } = defs[instances[instanceId].defId];
				if (publicId) instanceIdMap[publicId] = instanceId;
			}
			return {
				defIdMap,
				instanceIdMap
			};
		}
		var Emitter = class {
			constructor() {
				this.handlers = {};
				this.thisContext = null;
			}
			setThisContext(thisContext) {
				this.thisContext = thisContext;
			}
			setOptions(options) {
				this.options = options;
			}
			on(type, handler) {
				addToHash(this.handlers, type, handler);
			}
			off(type, handler) {
				removeFromHash(this.handlers, type, handler);
			}
			trigger(type, ...args) {
				let attachedHandlers = this.handlers[type] || [];
				let optionHandler = this.options && this.options[type];
				let handlers = [].concat(optionHandler || [], attachedHandlers);
				for (let handler of handlers) handler.apply(this.thisContext, args);
			}
			hasHandlers(type) {
				return Boolean(this.handlers[type] && this.handlers[type].length || this.options && this.options[type]);
			}
		};
		function addToHash(hash, type, handler) {
			(hash[type] || (hash[type] = [])).push(handler);
		}
		function removeFromHash(hash, type, handler) {
			if (handler) {
				if (hash[type]) hash[type] = hash[type].filter((func) => func !== handler);
			} else delete hash[type];
		}
		const DEF_DEFAULTS = {
			startTime: "09:00",
			endTime: "17:00",
			daysOfWeek: [
				1,
				2,
				3,
				4,
				5
			],
			display: "inverse-background",
			classNames: "fc-non-business",
			groupId: "_businessHours"
		};
		function parseBusinessHours(input, context) {
			return parseEvents(refineInputs(input), null, context);
		}
		function refineInputs(input) {
			let rawDefs;
			if (input === true) rawDefs = [{}];
			else if (Array.isArray(input)) rawDefs = input.filter((rawDef) => rawDef.daysOfWeek);
			else if (typeof input === "object" && input) rawDefs = [input];
			else rawDefs = [];
			rawDefs = rawDefs.map((rawDef) => Object.assign(Object.assign({}, DEF_DEFAULTS), rawDef));
			return rawDefs;
		}
		function triggerDateSelect(selection, pev, context) {
			context.emitter.trigger("select", Object.assign(Object.assign({}, buildDateSpanApiWithContext(selection, context)), {
				jsEvent: pev ? pev.origEvent : null,
				view: context.viewApi || context.calendarApi.view
			}));
		}
		function triggerDateUnselect(pev, context) {
			context.emitter.trigger("unselect", {
				jsEvent: pev ? pev.origEvent : null,
				view: context.viewApi || context.calendarApi.view
			});
		}
		function buildDateSpanApiWithContext(dateSpan, context) {
			let props = {};
			for (let transform of context.pluginHooks.dateSpanTransforms) Object.assign(props, transform(dateSpan, context));
			Object.assign(props, buildDateSpanApi(dateSpan, context.dateEnv));
			return props;
		}
		function getDefaultEventEnd(allDay, marker, context) {
			let { dateEnv, options } = context;
			let end = marker;
			if (allDay) {
				end = startOfDay(end);
				end = dateEnv.add(end, options.defaultAllDayEventDuration);
			} else end = dateEnv.add(end, options.defaultTimedEventDuration);
			return end;
		}
		function applyMutationToEventStore(eventStore, eventConfigBase, mutation, context) {
			let eventConfigs = compileEventUis(eventStore.defs, eventConfigBase);
			let dest = createEmptyEventStore();
			for (let defId in eventStore.defs) {
				let def = eventStore.defs[defId];
				dest.defs[defId] = applyMutationToEventDef(def, eventConfigs[defId], mutation, context);
			}
			for (let instanceId in eventStore.instances) {
				let instance = eventStore.instances[instanceId];
				let def = dest.defs[instance.defId];
				dest.instances[instanceId] = applyMutationToEventInstance(instance, def, eventConfigs[instance.defId], mutation, context);
			}
			return dest;
		}
		function applyMutationToEventDef(eventDef, eventConfig, mutation, context) {
			let standardProps = mutation.standardProps || {};
			if (standardProps.hasEnd == null && eventConfig.durationEditable && (mutation.startDelta || mutation.endDelta)) standardProps.hasEnd = true;
			let copy = Object.assign(Object.assign(Object.assign({}, eventDef), standardProps), { ui: Object.assign(Object.assign({}, eventDef.ui), standardProps.ui) });
			if (mutation.extendedProps) copy.extendedProps = Object.assign(Object.assign({}, copy.extendedProps), mutation.extendedProps);
			for (let applier of context.pluginHooks.eventDefMutationAppliers) applier(copy, mutation, context);
			if (!copy.hasEnd && context.options.forceEventDuration) copy.hasEnd = true;
			return copy;
		}
		function applyMutationToEventInstance(eventInstance, eventDef, eventConfig, mutation, context) {
			let { dateEnv } = context;
			let forceAllDay = mutation.standardProps && mutation.standardProps.allDay === true;
			let clearEnd = mutation.standardProps && mutation.standardProps.hasEnd === false;
			let copy = Object.assign({}, eventInstance);
			if (forceAllDay) copy.range = computeAlignedDayRange(copy.range);
			if (mutation.datesDelta && eventConfig.startEditable) copy.range = {
				start: dateEnv.add(copy.range.start, mutation.datesDelta),
				end: dateEnv.add(copy.range.end, mutation.datesDelta)
			};
			if (mutation.startDelta && eventConfig.durationEditable) copy.range = {
				start: dateEnv.add(copy.range.start, mutation.startDelta),
				end: copy.range.end
			};
			if (mutation.endDelta && eventConfig.durationEditable) copy.range = {
				start: copy.range.start,
				end: dateEnv.add(copy.range.end, mutation.endDelta)
			};
			if (clearEnd) copy.range = {
				start: copy.range.start,
				end: getDefaultEventEnd(eventDef.allDay, copy.range.start, context)
			};
			if (eventDef.allDay) copy.range = {
				start: startOfDay(copy.range.start),
				end: startOfDay(copy.range.end)
			};
			if (copy.range.end < copy.range.start) copy.range.end = getDefaultEventEnd(eventDef.allDay, copy.range.start, context);
			return copy;
		}
		var EventSourceImpl = class {
			constructor(context, internalEventSource) {
				this.context = context;
				this.internalEventSource = internalEventSource;
			}
			remove() {
				this.context.dispatch({
					type: "REMOVE_EVENT_SOURCE",
					sourceId: this.internalEventSource.sourceId
				});
			}
			refetch() {
				this.context.dispatch({
					type: "FETCH_EVENT_SOURCES",
					sourceIds: [this.internalEventSource.sourceId],
					isRefetch: true
				});
			}
			get id() {
				return this.internalEventSource.publicId;
			}
			get url() {
				return this.internalEventSource.meta.url;
			}
			get format() {
				return this.internalEventSource.meta.format;
			}
		};
		var EventImpl = class EventImpl {
			constructor(context, def, instance) {
				this._context = context;
				this._def = def;
				this._instance = instance || null;
			}
			setProp(name, val) {
				if (name in EVENT_DATE_REFINERS) console.warn("Could not set date-related prop 'name'. Use one of the date-related methods instead.");
				else if (name === "id") {
					val = EVENT_NON_DATE_REFINERS[name](val);
					this.mutate({ standardProps: { publicId: val } });
				} else if (name in EVENT_NON_DATE_REFINERS) {
					val = EVENT_NON_DATE_REFINERS[name](val);
					this.mutate({ standardProps: { [name]: val } });
				} else if (name in EVENT_UI_REFINERS) {
					let ui = EVENT_UI_REFINERS[name](val);
					if (name === "color") ui = {
						backgroundColor: val,
						borderColor: val
					};
					else if (name === "editable") ui = {
						startEditable: val,
						durationEditable: val
					};
					else ui = { [name]: val };
					this.mutate({ standardProps: { ui } });
				} else console.warn(`Could not set prop '${name}'. Use setExtendedProp instead.`);
			}
			setExtendedProp(name, val) {
				this.mutate({ extendedProps: { [name]: val } });
			}
			setStart(startInput, options = {}) {
				let { dateEnv } = this._context;
				let start = dateEnv.createMarker(startInput);
				if (start && this._instance) {
					let instanceRange = this._instance.range;
					let startDelta = diffDates(instanceRange.start, start, dateEnv, options.granularity);
					if (options.maintainDuration) this.mutate({ datesDelta: startDelta });
					else this.mutate({ startDelta });
				}
			}
			setEnd(endInput, options = {}) {
				let { dateEnv } = this._context;
				let end;
				if (endInput != null) {
					end = dateEnv.createMarker(endInput);
					if (!end) return;
				}
				if (this._instance) {
					if (end) {
						let endDelta = diffDates(this._instance.range.end, end, dateEnv, options.granularity);
						this.mutate({ endDelta });
					} else this.mutate({ standardProps: { hasEnd: false } });
				}
			}
			setDates(startInput, endInput, options = {}) {
				let { dateEnv } = this._context;
				let standardProps = { allDay: options.allDay };
				let start = dateEnv.createMarker(startInput);
				let end;
				if (!start) return;
				if (endInput != null) {
					end = dateEnv.createMarker(endInput);
					if (!end) return;
				}
				if (this._instance) {
					let instanceRange = this._instance.range;
					if (options.allDay === true) instanceRange = computeAlignedDayRange(instanceRange);
					let startDelta = diffDates(instanceRange.start, start, dateEnv, options.granularity);
					if (end) {
						let endDelta = diffDates(instanceRange.end, end, dateEnv, options.granularity);
						if (durationsEqual(startDelta, endDelta)) this.mutate({
							datesDelta: startDelta,
							standardProps
						});
						else this.mutate({
							startDelta,
							endDelta,
							standardProps
						});
					} else {
						standardProps.hasEnd = false;
						this.mutate({
							datesDelta: startDelta,
							standardProps
						});
					}
				}
			}
			moveStart(deltaInput) {
				let delta = createDuration(deltaInput);
				if (delta) this.mutate({ startDelta: delta });
			}
			moveEnd(deltaInput) {
				let delta = createDuration(deltaInput);
				if (delta) this.mutate({ endDelta: delta });
			}
			moveDates(deltaInput) {
				let delta = createDuration(deltaInput);
				if (delta) this.mutate({ datesDelta: delta });
			}
			setAllDay(allDay, options = {}) {
				let standardProps = { allDay };
				let { maintainDuration } = options;
				if (maintainDuration == null) maintainDuration = this._context.options.allDayMaintainDuration;
				if (this._def.allDay !== allDay) standardProps.hasEnd = maintainDuration;
				this.mutate({ standardProps });
			}
			formatRange(formatInput) {
				let { dateEnv } = this._context;
				let instance = this._instance;
				let formatter = createFormatter(formatInput);
				if (this._def.hasEnd) return dateEnv.formatRange(instance.range.start, instance.range.end, formatter, {
					forcedStartTzo: instance.forcedStartTzo,
					forcedEndTzo: instance.forcedEndTzo
				});
				return dateEnv.format(instance.range.start, formatter, { forcedTzo: instance.forcedStartTzo });
			}
			mutate(mutation) {
				let instance = this._instance;
				if (instance) {
					let def = this._def;
					let context = this._context;
					let { eventStore } = context.getCurrentData();
					let relevantEvents = getRelevantEvents(eventStore, instance.instanceId);
					relevantEvents = applyMutationToEventStore(relevantEvents, { "": {
						display: "",
						startEditable: true,
						durationEditable: true,
						constraints: [],
						overlap: null,
						allows: [],
						backgroundColor: "",
						borderColor: "",
						textColor: "",
						classNames: []
					} }, mutation, context);
					let oldEvent = new EventImpl(context, def, instance);
					this._def = relevantEvents.defs[def.defId];
					this._instance = relevantEvents.instances[instance.instanceId];
					context.dispatch({
						type: "MERGE_EVENTS",
						eventStore: relevantEvents
					});
					context.emitter.trigger("eventChange", {
						oldEvent,
						event: this,
						relatedEvents: buildEventApis(relevantEvents, context, instance),
						revert() {
							context.dispatch({
								type: "RESET_EVENTS",
								eventStore
							});
						}
					});
				}
			}
			remove() {
				let context = this._context;
				let asStore = eventApiToStore(this);
				context.dispatch({
					type: "REMOVE_EVENTS",
					eventStore: asStore
				});
				context.emitter.trigger("eventRemove", {
					event: this,
					relatedEvents: [],
					revert() {
						context.dispatch({
							type: "MERGE_EVENTS",
							eventStore: asStore
						});
					}
				});
			}
			get source() {
				let { sourceId } = this._def;
				if (sourceId) return new EventSourceImpl(this._context, this._context.getCurrentData().eventSources[sourceId]);
				return null;
			}
			get start() {
				return this._instance ? this._context.dateEnv.toDate(this._instance.range.start) : null;
			}
			get end() {
				return this._instance && this._def.hasEnd ? this._context.dateEnv.toDate(this._instance.range.end) : null;
			}
			get startStr() {
				let instance = this._instance;
				if (instance) return this._context.dateEnv.formatIso(instance.range.start, {
					omitTime: this._def.allDay,
					forcedTzo: instance.forcedStartTzo
				});
				return "";
			}
			get endStr() {
				let instance = this._instance;
				if (instance && this._def.hasEnd) return this._context.dateEnv.formatIso(instance.range.end, {
					omitTime: this._def.allDay,
					forcedTzo: instance.forcedEndTzo
				});
				return "";
			}
			get id() {
				return this._def.publicId;
			}
			get groupId() {
				return this._def.groupId;
			}
			get allDay() {
				return this._def.allDay;
			}
			get title() {
				return this._def.title;
			}
			get url() {
				return this._def.url;
			}
			get display() {
				return this._def.ui.display || "auto";
			}
			get startEditable() {
				return this._def.ui.startEditable;
			}
			get durationEditable() {
				return this._def.ui.durationEditable;
			}
			get constraint() {
				return this._def.ui.constraints[0] || null;
			}
			get overlap() {
				return this._def.ui.overlap;
			}
			get allow() {
				return this._def.ui.allows[0] || null;
			}
			get backgroundColor() {
				return this._def.ui.backgroundColor;
			}
			get borderColor() {
				return this._def.ui.borderColor;
			}
			get textColor() {
				return this._def.ui.textColor;
			}
			get classNames() {
				return this._def.ui.classNames;
			}
			get extendedProps() {
				return this._def.extendedProps;
			}
			toPlainObject(settings = {}) {
				let def = this._def;
				let { ui } = def;
				let { startStr, endStr } = this;
				let res = { allDay: def.allDay };
				if (def.title) res.title = def.title;
				if (startStr) res.start = startStr;
				if (endStr) res.end = endStr;
				if (def.publicId) res.id = def.publicId;
				if (def.groupId) res.groupId = def.groupId;
				if (def.url) res.url = def.url;
				if (ui.display && ui.display !== "auto") res.display = ui.display;
				if (settings.collapseColor && ui.backgroundColor && ui.backgroundColor === ui.borderColor) res.color = ui.backgroundColor;
				else {
					if (ui.backgroundColor) res.backgroundColor = ui.backgroundColor;
					if (ui.borderColor) res.borderColor = ui.borderColor;
				}
				if (ui.textColor) res.textColor = ui.textColor;
				if (ui.classNames.length) res.classNames = ui.classNames;
				if (Object.keys(def.extendedProps).length) {
					if (settings.collapseExtendedProps) Object.assign(res, def.extendedProps);
					else res.extendedProps = def.extendedProps;
				}
				return res;
			}
			toJSON() {
				return this.toPlainObject();
			}
		};
		function eventApiToStore(eventApi) {
			let def = eventApi._def;
			let instance = eventApi._instance;
			return {
				defs: { [def.defId]: def },
				instances: instance ? { [instance.instanceId]: instance } : {}
			};
		}
		function buildEventApis(eventStore, context, excludeInstance) {
			let { defs, instances } = eventStore;
			let eventApis = [];
			let excludeInstanceId = excludeInstance ? excludeInstance.instanceId : "";
			for (let id in instances) {
				let instance = instances[id];
				let def = defs[instance.defId];
				if (instance.instanceId !== excludeInstanceId) eventApis.push(new EventImpl(context, def, instance));
			}
			return eventApis;
		}
		function sliceEventStore(eventStore, eventUiBases, framingRange, nextDayThreshold) {
			let inverseBgByGroupId = {};
			let inverseBgByDefId = {};
			let defByGroupId = {};
			let bgRanges = [];
			let fgRanges = [];
			let eventUis = compileEventUis(eventStore.defs, eventUiBases);
			for (let defId in eventStore.defs) {
				let def = eventStore.defs[defId];
				if (eventUis[def.defId].display === "inverse-background") {
					if (def.groupId) {
						inverseBgByGroupId[def.groupId] = [];
						if (!defByGroupId[def.groupId]) defByGroupId[def.groupId] = def;
					} else inverseBgByDefId[defId] = [];
				}
			}
			for (let instanceId in eventStore.instances) {
				let instance = eventStore.instances[instanceId];
				let def = eventStore.defs[instance.defId];
				let ui = eventUis[def.defId];
				let origRange = instance.range;
				let normalRange = !def.allDay && nextDayThreshold ? computeVisibleDayRange(origRange, nextDayThreshold) : origRange;
				let slicedRange = intersectRanges(normalRange, framingRange);
				if (slicedRange) {
					if (ui.display === "inverse-background") {
						if (def.groupId) inverseBgByGroupId[def.groupId].push(slicedRange);
						else inverseBgByDefId[instance.defId].push(slicedRange);
					} else if (ui.display !== "none") (ui.display === "background" ? bgRanges : fgRanges).push({
						def,
						ui,
						instance,
						range: slicedRange,
						isStart: normalRange.start && normalRange.start.valueOf() === slicedRange.start.valueOf(),
						isEnd: normalRange.end && normalRange.end.valueOf() === slicedRange.end.valueOf()
					});
				}
			}
			for (let groupId in inverseBgByGroupId) {
				let ranges = inverseBgByGroupId[groupId];
				let invertedRanges = invertRanges(ranges, framingRange);
				for (let invertedRange of invertedRanges) {
					let def = defByGroupId[groupId];
					let ui = eventUis[def.defId];
					bgRanges.push({
						def,
						ui,
						instance: null,
						range: invertedRange,
						isStart: false,
						isEnd: false
					});
				}
			}
			for (let defId in inverseBgByDefId) {
				let ranges = inverseBgByDefId[defId];
				let invertedRanges = invertRanges(ranges, framingRange);
				for (let invertedRange of invertedRanges) bgRanges.push({
					def: eventStore.defs[defId],
					ui: eventUis[defId],
					instance: null,
					range: invertedRange,
					isStart: false,
					isEnd: false
				});
			}
			return {
				bg: bgRanges,
				fg: fgRanges
			};
		}
		function hasBgRendering(def) {
			return def.ui.display === "background" || def.ui.display === "inverse-background";
		}
		function setElSeg(el, seg) {
			el.fcSeg = seg;
		}
		function getElSeg(el) {
			return el.fcSeg || el.parentNode.fcSeg || null;
		}
		function compileEventUis(eventDefs, eventUiBases) {
			return mapHash(eventDefs, (eventDef) => compileEventUi(eventDef, eventUiBases));
		}
		function compileEventUi(eventDef, eventUiBases) {
			let uis = [];
			if (eventUiBases[""]) uis.push(eventUiBases[""]);
			if (eventUiBases[eventDef.defId]) uis.push(eventUiBases[eventDef.defId]);
			uis.push(eventDef.ui);
			return combineEventUis(uis);
		}
		function sortEventSegs(segs, eventOrderSpecs) {
			let objs = segs.map(buildSegCompareObj);
			objs.sort((obj0, obj1) => compareByFieldSpecs(obj0, obj1, eventOrderSpecs));
			return objs.map((c) => c._seg);
		}
		function buildSegCompareObj(seg) {
			let { eventRange } = seg;
			let eventDef = eventRange.def;
			let range = eventRange.instance ? eventRange.instance.range : eventRange.range;
			let start = range.start ? range.start.valueOf() : 0;
			let end = range.end ? range.end.valueOf() : 0;
			return Object.assign(Object.assign(Object.assign({}, eventDef.extendedProps), eventDef), {
				id: eventDef.publicId,
				start,
				end,
				duration: end - start,
				allDay: Number(eventDef.allDay),
				_seg: seg
			});
		}
		function computeSegDraggable(seg, context) {
			let { pluginHooks } = context;
			let transformers = pluginHooks.isDraggableTransformers;
			let { def, ui } = seg.eventRange;
			let val = ui.startEditable;
			for (let transformer of transformers) val = transformer(val, def, ui, context);
			return val;
		}
		function computeSegStartResizable(seg, context) {
			return seg.isStart && seg.eventRange.ui.durationEditable && context.options.eventResizableFromStart;
		}
		function computeSegEndResizable(seg, context) {
			return seg.isEnd && seg.eventRange.ui.durationEditable;
		}
		function buildSegTimeText(seg, timeFormat, context, defaultDisplayEventTime, defaultDisplayEventEnd, startOverride, endOverride) {
			let { dateEnv, options } = context;
			let { displayEventTime, displayEventEnd } = options;
			let eventDef = seg.eventRange.def;
			let eventInstance = seg.eventRange.instance;
			if (displayEventTime == null) displayEventTime = defaultDisplayEventTime !== false;
			if (displayEventEnd == null) displayEventEnd = defaultDisplayEventEnd !== false;
			let wholeEventStart = eventInstance.range.start;
			let wholeEventEnd = eventInstance.range.end;
			let segStart = startOverride || seg.start || seg.eventRange.range.start;
			let segEnd = endOverride || seg.end || seg.eventRange.range.end;
			let isStartDay = startOfDay(wholeEventStart).valueOf() === startOfDay(segStart).valueOf();
			let isEndDay = startOfDay(addMs(wholeEventEnd, -1)).valueOf() === startOfDay(addMs(segEnd, -1)).valueOf();
			if (displayEventTime && !eventDef.allDay && (isStartDay || isEndDay)) {
				segStart = isStartDay ? wholeEventStart : segStart;
				segEnd = isEndDay ? wholeEventEnd : segEnd;
				if (displayEventEnd && eventDef.hasEnd) return dateEnv.formatRange(segStart, segEnd, timeFormat, {
					forcedStartTzo: startOverride ? null : eventInstance.forcedStartTzo,
					forcedEndTzo: endOverride ? null : eventInstance.forcedEndTzo
				});
				return dateEnv.format(segStart, timeFormat, { forcedTzo: startOverride ? null : eventInstance.forcedStartTzo });
			}
			return "";
		}
		function getSegMeta(seg, todayRange, nowDate) {
			let segRange = seg.eventRange.range;
			return {
				isPast: segRange.end <= (nowDate || todayRange.start),
				isFuture: segRange.start >= (nowDate || todayRange.end),
				isToday: todayRange && rangeContainsMarker(todayRange, segRange.start)
			};
		}
		function getEventClassNames(props) {
			let classNames = ["fc-event"];
			if (props.isMirror) classNames.push("fc-event-mirror");
			if (props.isDraggable) classNames.push("fc-event-draggable");
			if (props.isStartResizable || props.isEndResizable) classNames.push("fc-event-resizable");
			if (props.isDragging) classNames.push("fc-event-dragging");
			if (props.isResizing) classNames.push("fc-event-resizing");
			if (props.isSelected) classNames.push("fc-event-selected");
			if (props.isStart) classNames.push("fc-event-start");
			if (props.isEnd) classNames.push("fc-event-end");
			if (props.isPast) classNames.push("fc-event-past");
			if (props.isToday) classNames.push("fc-event-today");
			if (props.isFuture) classNames.push("fc-event-future");
			return classNames;
		}
		function buildEventRangeKey(eventRange) {
			return eventRange.instance ? eventRange.instance.instanceId : `${eventRange.def.defId}:${eventRange.range.start.toISOString()}`;
		}
		function getSegAnchorAttrs(seg, context) {
			let { def, instance } = seg.eventRange;
			let { url } = def;
			if (url) return { href: url };
			let { emitter, options } = context;
			let { eventInteractive } = options;
			if (eventInteractive == null) {
				eventInteractive = def.interactive;
				if (eventInteractive == null) eventInteractive = Boolean(emitter.hasHandlers("eventClick"));
			}
			if (eventInteractive) return createAriaKeyboardAttrs((ev) => {
				emitter.trigger("eventClick", {
					el: ev.target,
					event: new EventImpl(context, def, instance),
					jsEvent: ev,
					view: context.viewApi
				});
			});
			return {};
		}
		const STANDARD_PROPS = {
			start: identity,
			end: identity,
			allDay: Boolean
		};
		function parseDateSpan(raw, dateEnv, defaultDuration) {
			let span = parseOpenDateSpan(raw, dateEnv);
			let { range } = span;
			if (!range.start) return null;
			if (!range.end) {
				if (defaultDuration == null) return null;
				range.end = dateEnv.add(range.start, defaultDuration);
			}
			return span;
		}
		function parseOpenDateSpan(raw, dateEnv) {
			let { refined: standardProps, extra } = refineProps(raw, STANDARD_PROPS);
			let startMeta = standardProps.start ? dateEnv.createMarkerMeta(standardProps.start) : null;
			let endMeta = standardProps.end ? dateEnv.createMarkerMeta(standardProps.end) : null;
			let { allDay } = standardProps;
			if (allDay == null) allDay = startMeta && startMeta.isTimeUnspecified && (!endMeta || endMeta.isTimeUnspecified);
			return Object.assign({
				range: {
					start: startMeta ? startMeta.marker : null,
					end: endMeta ? endMeta.marker : null
				},
				allDay
			}, extra);
		}
		function isDateSpansEqual(span0, span1) {
			return rangesEqual(span0.range, span1.range) && span0.allDay === span1.allDay && isSpanPropsEqual(span0, span1);
		}
		function isSpanPropsEqual(span0, span1) {
			for (let propName in span1) if (propName !== "range" && propName !== "allDay") {
				if (span0[propName] !== span1[propName]) return false;
			}
			for (let propName in span0) if (!(propName in span1)) return false;
			return true;
		}
		function buildDateSpanApi(span, dateEnv) {
			return Object.assign(Object.assign({}, buildRangeApi(span.range, dateEnv, span.allDay)), { allDay: span.allDay });
		}
		function buildRangeApiWithTimeZone(range, dateEnv, omitTime) {
			return Object.assign(Object.assign({}, buildRangeApi(range, dateEnv, omitTime)), { timeZone: dateEnv.timeZone });
		}
		function buildRangeApi(range, dateEnv, omitTime) {
			return {
				start: dateEnv.toDate(range.start),
				end: dateEnv.toDate(range.end),
				startStr: dateEnv.formatIso(range.start, { omitTime }),
				endStr: dateEnv.formatIso(range.end, { omitTime })
			};
		}
		function fabricateEventRange(dateSpan, eventUiBases, context) {
			let res = refineEventDef({ editable: false }, context);
			let def = parseEventDef(res.refined, res.extra, "", dateSpan.allDay, true, context);
			return {
				def,
				ui: compileEventUi(def, eventUiBases),
				instance: createEventInstance(def.defId, dateSpan.range),
				range: dateSpan.range,
				isStart: true,
				isEnd: true
			};
		}
		function unpromisify(func, normalizedSuccessCallback, normalizedFailureCallback) {
			let isResolved = false;
			let wrappedSuccess = function(res) {
				if (!isResolved) {
					isResolved = true;
					normalizedSuccessCallback(res);
				}
			};
			let wrappedFailure = function(error) {
				if (!isResolved) {
					isResolved = true;
					normalizedFailureCallback(error);
				}
			};
			let res = func(wrappedSuccess, wrappedFailure);
			if (res && typeof res.then === "function") res.then(wrappedSuccess, wrappedFailure);
		}
		var JsonRequestError = class extends Error {
			constructor(message, response) {
				super(message);
				this.response = response;
			}
		};
		function requestJson(method, url, params) {
			method = method.toUpperCase();
			const fetchOptions = { method };
			if (method === "GET") url += (url.indexOf("?") === -1 ? "?" : "&") + new URLSearchParams(params);
			else {
				fetchOptions.body = new URLSearchParams(params);
				fetchOptions.headers = { "Content-Type": "application/x-www-form-urlencoded" };
			}
			return fetch(url, fetchOptions).then((fetchRes) => {
				if (fetchRes.ok) return fetchRes.json().then((parsedResponse) => {
					return [parsedResponse, fetchRes];
				}, () => {
					throw new JsonRequestError("Failure parsing JSON", fetchRes);
				});
				else throw new JsonRequestError("Request failed", fetchRes);
			});
		}
		let canVGrowWithinCell;
		function getCanVGrowWithinCell() {
			if (canVGrowWithinCell == null) canVGrowWithinCell = computeCanVGrowWithinCell();
			return canVGrowWithinCell;
		}
		function computeCanVGrowWithinCell() {
			if (typeof document === "undefined") return true;
			let el = document.createElement("div");
			el.style.position = "absolute";
			el.style.top = "0px";
			el.style.left = "0px";
			el.innerHTML = "<table><tr><td><div></div></td></tr></table>";
			el.querySelector("table").style.height = "100px";
			el.querySelector("div").style.height = "100%";
			document.body.appendChild(el);
			let possible = el.querySelector("div").offsetHeight > 0;
			document.body.removeChild(el);
			return possible;
		}
		var CalendarRoot = class extends BaseComponent {
			constructor() {
				super(...arguments);
				this.state = { forPrint: false };
				this.handleBeforePrint = () => {
					flushSync(() => {
						this.setState({ forPrint: true });
					});
				};
				this.handleAfterPrint = () => {
					flushSync(() => {
						this.setState({ forPrint: false });
					});
				};
			}
			render() {
				let { props } = this;
				let { options } = props;
				let { forPrint } = this.state;
				let isHeightAuto = forPrint || options.height === "auto" || options.contentHeight === "auto";
				let height = !isHeightAuto && options.height != null ? options.height : "";
				let classNames = [
					"fc",
					forPrint ? "fc-media-print" : "fc-media-screen",
					`fc-direction-${options.direction}`,
					props.theme.getClass("root")
				];
				if (!getCanVGrowWithinCell()) classNames.push("fc-liquid-hack");
				return props.children(classNames, height, isHeightAuto, forPrint);
			}
			componentDidMount() {
				let { emitter } = this.props;
				emitter.on("_beforeprint", this.handleBeforePrint);
				emitter.on("_afterprint", this.handleAfterPrint);
			}
			componentWillUnmount() {
				let { emitter } = this.props;
				emitter.off("_beforeprint", this.handleBeforePrint);
				emitter.off("_afterprint", this.handleAfterPrint);
			}
		};
		var Interaction = class {
			constructor(settings) {
				this.component = settings.component;
				this.isHitComboAllowed = settings.isHitComboAllowed || null;
			}
			destroy() {}
		};
		function parseInteractionSettings(component, input) {
			return {
				component,
				el: input.el,
				useEventCenter: input.useEventCenter != null ? input.useEventCenter : true,
				isHitComboAllowed: input.isHitComboAllowed || null
			};
		}
		function interactionSettingsToStore(settings) {
			return { [settings.component.uid]: settings };
		}
		const interactionSettingsStore = {};
		var NowTimer = class extends preact.Component {
			constructor(props, context) {
				super(props, context);
				this.handleRefresh = () => {
					let timing = this.computeTiming();
					if (timing.state.nowDate.valueOf() !== this.state.nowDate.valueOf()) this.setState(timing.state);
					this.clearTimeout();
					this.setTimeout(timing.waitMs);
				};
				this.handleVisibilityChange = () => {
					if (!document.hidden) this.handleRefresh();
				};
				this.state = this.computeTiming().state;
			}
			render() {
				let { props, state } = this;
				return props.children(state.nowDate, state.todayRange);
			}
			componentDidMount() {
				this.setTimeout();
				this.context.nowManager.addResetListener(this.handleRefresh);
				document.addEventListener("visibilitychange", this.handleVisibilityChange);
			}
			componentDidUpdate(prevProps) {
				if (prevProps.unit !== this.props.unit) {
					this.clearTimeout();
					this.setTimeout();
				}
			}
			componentWillUnmount() {
				this.clearTimeout();
				this.context.nowManager.removeResetListener(this.handleRefresh);
				document.removeEventListener("visibilitychange", this.handleVisibilityChange);
			}
			computeTiming() {
				let { props, context } = this;
				let unroundedNow = context.nowManager.getDateMarker();
				let { nowIndicatorSnap } = context.options;
				if (nowIndicatorSnap === "auto") nowIndicatorSnap = /year|month|week|day/.test(props.unit) || (props.unitValue || 1) === 1;
				let nowDate;
				let waitMs;
				if (nowIndicatorSnap) {
					nowDate = context.dateEnv.startOf(unroundedNow, props.unit);
					waitMs = context.dateEnv.add(nowDate, createDuration(1, props.unit)).valueOf() - unroundedNow.valueOf();
				} else {
					nowDate = unroundedNow;
					waitMs = 6e4;
				}
				waitMs = Math.min(864e5, waitMs);
				return {
					state: {
						nowDate,
						todayRange: buildDayRange(nowDate)
					},
					waitMs
				};
			}
			setTimeout(waitMs = this.computeTiming().waitMs) {
				this.timeoutId = setTimeout(() => {
					const timing = this.computeTiming();
					this.setState(timing.state, () => {
						this.setTimeout(timing.waitMs);
					});
				}, waitMs);
			}
			clearTimeout() {
				if (this.timeoutId) clearTimeout(this.timeoutId);
			}
		};
		NowTimer.contextType = ViewContextType;
		function buildDayRange(date) {
			let start = startOfDay(date);
			return {
				start,
				end: addDays(start, 1)
			};
		}
		var CalendarImpl = class {
			getCurrentData() {
				return this.currentDataManager.getCurrentData();
			}
			dispatch(action) {
				this.currentDataManager.dispatch(action);
			}
			get view() {
				return this.getCurrentData().viewApi;
			}
			batchRendering(callback) {
				callback();
			}
			updateSize() {
				this.trigger("_resize", true);
			}
			setOption(name, val) {
				this.dispatch({
					type: "SET_OPTION",
					optionName: name,
					rawOptionValue: val
				});
			}
			getOption(name) {
				return this.currentDataManager.currentCalendarOptionsInput[name];
			}
			getAvailableLocaleCodes() {
				return Object.keys(this.getCurrentData().availableRawLocales);
			}
			on(handlerName, handler) {
				let { currentDataManager } = this;
				if (currentDataManager.currentCalendarOptionsRefiners[handlerName]) currentDataManager.emitter.on(handlerName, handler);
				else console.warn(`Unknown listener name '${handlerName}'`);
			}
			off(handlerName, handler) {
				this.currentDataManager.emitter.off(handlerName, handler);
			}
			trigger(handlerName, ...args) {
				this.currentDataManager.emitter.trigger(handlerName, ...args);
			}
			changeView(viewType, dateOrRange) {
				this.batchRendering(() => {
					this.unselect();
					if (dateOrRange) {
						if (dateOrRange.start && dateOrRange.end) {
							this.dispatch({
								type: "CHANGE_VIEW_TYPE",
								viewType
							});
							this.dispatch({
								type: "SET_OPTION",
								optionName: "visibleRange",
								rawOptionValue: dateOrRange
							});
						} else {
							let { dateEnv } = this.getCurrentData();
							this.dispatch({
								type: "CHANGE_VIEW_TYPE",
								viewType,
								dateMarker: dateEnv.createMarker(dateOrRange)
							});
						}
					} else this.dispatch({
						type: "CHANGE_VIEW_TYPE",
						viewType
					});
				});
			}
			zoomTo(dateMarker, viewType) {
				let state = this.getCurrentData();
				let spec;
				viewType = viewType || "day";
				spec = state.viewSpecs[viewType] || this.getUnitViewSpec(viewType);
				this.unselect();
				if (spec) this.dispatch({
					type: "CHANGE_VIEW_TYPE",
					viewType: spec.type,
					dateMarker
				});
				else this.dispatch({
					type: "CHANGE_DATE",
					dateMarker
				});
			}
			getUnitViewSpec(unit) {
				let { viewSpecs, toolbarConfig } = this.getCurrentData();
				let viewTypes = [].concat(toolbarConfig.header ? toolbarConfig.header.viewsWithButtons : [], toolbarConfig.footer ? toolbarConfig.footer.viewsWithButtons : []);
				let i;
				let spec;
				for (let viewType in viewSpecs) viewTypes.push(viewType);
				for (i = 0; i < viewTypes.length; i += 1) {
					spec = viewSpecs[viewTypes[i]];
					if (spec) {
						if (spec.singleUnit === unit) return spec;
					}
				}
				return null;
			}
			prev() {
				this.unselect();
				this.dispatch({ type: "PREV" });
			}
			next() {
				this.unselect();
				this.dispatch({ type: "NEXT" });
			}
			prevYear() {
				let state = this.getCurrentData();
				this.unselect();
				this.dispatch({
					type: "CHANGE_DATE",
					dateMarker: state.dateEnv.addYears(state.currentDate, -1)
				});
			}
			nextYear() {
				let state = this.getCurrentData();
				this.unselect();
				this.dispatch({
					type: "CHANGE_DATE",
					dateMarker: state.dateEnv.addYears(state.currentDate, 1)
				});
			}
			today() {
				let state = this.getCurrentData();
				this.unselect();
				this.dispatch({
					type: "CHANGE_DATE",
					dateMarker: state.nowManager.getDateMarker()
				});
			}
			gotoDate(zonedDateInput) {
				let state = this.getCurrentData();
				this.unselect();
				this.dispatch({
					type: "CHANGE_DATE",
					dateMarker: state.dateEnv.createMarker(zonedDateInput)
				});
			}
			incrementDate(deltaInput) {
				let state = this.getCurrentData();
				let delta = createDuration(deltaInput);
				if (delta) {
					this.unselect();
					this.dispatch({
						type: "CHANGE_DATE",
						dateMarker: state.dateEnv.add(state.currentDate, delta)
					});
				}
			}
			getDate() {
				let state = this.getCurrentData();
				return state.dateEnv.toDate(state.currentDate);
			}
			formatDate(d, formatter) {
				let { dateEnv } = this.getCurrentData();
				return dateEnv.format(dateEnv.createMarker(d), createFormatter(formatter));
			}
			formatRange(d0, d1, settings) {
				let { dateEnv } = this.getCurrentData();
				return dateEnv.formatRange(dateEnv.createMarker(d0), dateEnv.createMarker(d1), createFormatter(settings), settings);
			}
			formatIso(d, omitTime) {
				let { dateEnv } = this.getCurrentData();
				return dateEnv.formatIso(dateEnv.createMarker(d), { omitTime });
			}
			select(dateOrObj, endDate) {
				let selectionInput;
				if (endDate == null) {
					if (dateOrObj.start != null) selectionInput = dateOrObj;
					else selectionInput = {
						start: dateOrObj,
						end: null
					};
				} else selectionInput = {
					start: dateOrObj,
					end: endDate
				};
				let state = this.getCurrentData();
				let selection = parseDateSpan(selectionInput, state.dateEnv, createDuration({ days: 1 }));
				if (selection) {
					this.dispatch({
						type: "SELECT_DATES",
						selection
					});
					triggerDateSelect(selection, null, state);
				}
			}
			unselect(pev) {
				let state = this.getCurrentData();
				if (state.dateSelection) {
					this.dispatch({ type: "UNSELECT_DATES" });
					triggerDateUnselect(pev, state);
				}
			}
			addEvent(eventInput, sourceInput) {
				if (eventInput instanceof EventImpl) {
					let def = eventInput._def;
					let instance = eventInput._instance;
					if (!this.getCurrentData().eventStore.defs[def.defId]) {
						this.dispatch({
							type: "ADD_EVENTS",
							eventStore: eventTupleToStore({
								def,
								instance
							})
						});
						this.triggerEventAdd(eventInput);
					}
					return eventInput;
				}
				let state = this.getCurrentData();
				let eventSource;
				if (sourceInput instanceof EventSourceImpl) eventSource = sourceInput.internalEventSource;
				else if (typeof sourceInput === "boolean") {
					if (sourceInput) [eventSource] = hashValuesToArray(state.eventSources);
				} else if (sourceInput != null) {
					let sourceApi = this.getEventSourceById(sourceInput);
					if (!sourceApi) {
						console.warn(`Could not find an event source with ID "${sourceInput}"`);
						return null;
					}
					eventSource = sourceApi.internalEventSource;
				}
				let tuple = parseEvent(eventInput, eventSource, state, false);
				if (tuple) {
					let newEventApi = new EventImpl(state, tuple.def, tuple.def.recurringDef ? null : tuple.instance);
					this.dispatch({
						type: "ADD_EVENTS",
						eventStore: eventTupleToStore(tuple)
					});
					this.triggerEventAdd(newEventApi);
					return newEventApi;
				}
				return null;
			}
			triggerEventAdd(eventApi) {
				let { emitter } = this.getCurrentData();
				emitter.trigger("eventAdd", {
					event: eventApi,
					relatedEvents: [],
					revert: () => {
						this.dispatch({
							type: "REMOVE_EVENTS",
							eventStore: eventApiToStore(eventApi)
						});
					}
				});
			}
			getEventById(id) {
				let state = this.getCurrentData();
				let { defs, instances } = state.eventStore;
				id = String(id);
				for (let defId in defs) {
					let def = defs[defId];
					if (def.publicId === id) {
						if (def.recurringDef) return new EventImpl(state, def, null);
						for (let instanceId in instances) {
							let instance = instances[instanceId];
							if (instance.defId === def.defId) return new EventImpl(state, def, instance);
						}
					}
				}
				return null;
			}
			getEvents() {
				let currentData = this.getCurrentData();
				return buildEventApis(currentData.eventStore, currentData);
			}
			removeAllEvents() {
				this.dispatch({ type: "REMOVE_ALL_EVENTS" });
			}
			getEventSources() {
				let state = this.getCurrentData();
				let sourceHash = state.eventSources;
				let sourceApis = [];
				for (let internalId in sourceHash) sourceApis.push(new EventSourceImpl(state, sourceHash[internalId]));
				return sourceApis;
			}
			getEventSourceById(id) {
				let state = this.getCurrentData();
				let sourceHash = state.eventSources;
				id = String(id);
				for (let sourceId in sourceHash) if (sourceHash[sourceId].publicId === id) return new EventSourceImpl(state, sourceHash[sourceId]);
				return null;
			}
			addEventSource(sourceInput) {
				let state = this.getCurrentData();
				if (sourceInput instanceof EventSourceImpl) {
					if (!state.eventSources[sourceInput.internalEventSource.sourceId]) this.dispatch({
						type: "ADD_EVENT_SOURCES",
						sources: [sourceInput.internalEventSource]
					});
					return sourceInput;
				}
				let eventSource = parseEventSource(sourceInput, state);
				if (eventSource) {
					this.dispatch({
						type: "ADD_EVENT_SOURCES",
						sources: [eventSource]
					});
					return new EventSourceImpl(state, eventSource);
				}
				return null;
			}
			removeAllEventSources() {
				this.dispatch({ type: "REMOVE_ALL_EVENT_SOURCES" });
			}
			refetchEvents() {
				this.dispatch({
					type: "FETCH_EVENT_SOURCES",
					isRefetch: true
				});
			}
			scrollToTime(timeInput) {
				let time = createDuration(timeInput);
				if (time) this.trigger("_scrollRequest", { time });
			}
		};
		function pointInsideRect(point, rect) {
			return point.left >= rect.left && point.left < rect.right && point.top >= rect.top && point.top < rect.bottom;
		}
		function intersectRects(rect1, rect2) {
			let res = {
				left: Math.max(rect1.left, rect2.left),
				right: Math.min(rect1.right, rect2.right),
				top: Math.max(rect1.top, rect2.top),
				bottom: Math.min(rect1.bottom, rect2.bottom)
			};
			if (res.left < res.right && res.top < res.bottom) return res;
			return false;
		}
		function translateRect(rect, deltaX, deltaY) {
			return {
				left: rect.left + deltaX,
				right: rect.right + deltaX,
				top: rect.top + deltaY,
				bottom: rect.bottom + deltaY
			};
		}
		function constrainPoint(point, rect) {
			return {
				left: Math.min(Math.max(point.left, rect.left), rect.right),
				top: Math.min(Math.max(point.top, rect.top), rect.bottom)
			};
		}
		function getRectCenter(rect) {
			return {
				left: (rect.left + rect.right) / 2,
				top: (rect.top + rect.bottom) / 2
			};
		}
		function diffPoints(point1, point2) {
			return {
				left: point1.left - point2.left,
				top: point1.top - point2.top
			};
		}
		const EMPTY_EVENT_STORE = createEmptyEventStore();
		var Splitter = class {
			constructor() {
				this.getKeysForEventDefs = memoize(this._getKeysForEventDefs);
				this.splitDateSelection = memoize(this._splitDateSpan);
				this.splitEventStore = memoize(this._splitEventStore);
				this.splitIndividualUi = memoize(this._splitIndividualUi);
				this.splitEventDrag = memoize(this._splitInteraction);
				this.splitEventResize = memoize(this._splitInteraction);
				this.eventUiBuilders = {};
			}
			splitProps(props) {
				let keyInfos = this.getKeyInfo(props);
				let defKeys = this.getKeysForEventDefs(props.eventStore);
				let dateSelections = this.splitDateSelection(props.dateSelection);
				let individualUi = this.splitIndividualUi(props.eventUiBases, defKeys);
				let eventStores = this.splitEventStore(props.eventStore, defKeys);
				let eventDrags = this.splitEventDrag(props.eventDrag);
				let eventResizes = this.splitEventResize(props.eventResize);
				let splitProps = {};
				this.eventUiBuilders = mapHash(keyInfos, (info, key) => this.eventUiBuilders[key] || memoize(buildEventUiForKey));
				for (let key in keyInfos) {
					let keyInfo = keyInfos[key];
					let eventStore = eventStores[key] || EMPTY_EVENT_STORE;
					let buildEventUi = this.eventUiBuilders[key];
					splitProps[key] = {
						businessHours: keyInfo.businessHours || props.businessHours,
						dateSelection: dateSelections[key] || null,
						eventStore,
						eventUiBases: buildEventUi(props.eventUiBases[""], keyInfo.ui, individualUi[key]),
						eventSelection: eventStore.instances[props.eventSelection] ? props.eventSelection : "",
						eventDrag: eventDrags[key] || null,
						eventResize: eventResizes[key] || null
					};
				}
				return splitProps;
			}
			_splitDateSpan(dateSpan) {
				let dateSpans = {};
				if (dateSpan) {
					let keys = this.getKeysForDateSpan(dateSpan);
					for (let key of keys) dateSpans[key] = dateSpan;
				}
				return dateSpans;
			}
			_getKeysForEventDefs(eventStore) {
				return mapHash(eventStore.defs, (eventDef) => this.getKeysForEventDef(eventDef));
			}
			_splitEventStore(eventStore, defKeys) {
				let { defs, instances } = eventStore;
				let splitStores = {};
				for (let defId in defs) for (let key of defKeys[defId]) {
					if (!splitStores[key]) splitStores[key] = createEmptyEventStore();
					splitStores[key].defs[defId] = defs[defId];
				}
				for (let instanceId in instances) {
					let instance = instances[instanceId];
					for (let key of defKeys[instance.defId]) if (splitStores[key]) splitStores[key].instances[instanceId] = instance;
				}
				return splitStores;
			}
			_splitIndividualUi(eventUiBases, defKeys) {
				let splitHashes = {};
				for (let defId in eventUiBases) if (defId) for (let key of defKeys[defId]) {
					if (!splitHashes[key]) splitHashes[key] = {};
					splitHashes[key][defId] = eventUiBases[defId];
				}
				return splitHashes;
			}
			_splitInteraction(interaction) {
				let splitStates = {};
				if (interaction) {
					let affectedStores = this._splitEventStore(interaction.affectedEvents, this._getKeysForEventDefs(interaction.affectedEvents));
					let mutatedKeysByDefId = this._getKeysForEventDefs(interaction.mutatedEvents);
					let mutatedStores = this._splitEventStore(interaction.mutatedEvents, mutatedKeysByDefId);
					let populate = (key) => {
						if (!splitStates[key]) splitStates[key] = {
							affectedEvents: affectedStores[key] || EMPTY_EVENT_STORE,
							mutatedEvents: mutatedStores[key] || EMPTY_EVENT_STORE,
							isEvent: interaction.isEvent
						};
					};
					for (let key in affectedStores) populate(key);
					for (let key in mutatedStores) populate(key);
				}
				return splitStates;
			}
		};
		function buildEventUiForKey(allUi, eventUiForKey, individualUi) {
			let baseParts = [];
			if (allUi) baseParts.push(allUi);
			if (eventUiForKey) baseParts.push(eventUiForKey);
			let stuff = { "": combineEventUis(baseParts) };
			if (individualUi) Object.assign(stuff, individualUi);
			return stuff;
		}
		function getDateMeta(date, todayRange, nowDate, dateProfile) {
			return {
				dow: date.getUTCDay(),
				isDisabled: Boolean(dateProfile && (!dateProfile.activeRange || !rangeContainsMarker(dateProfile.activeRange, date))),
				isOther: Boolean(dateProfile && !rangeContainsMarker(dateProfile.currentRange, date)),
				isToday: Boolean(todayRange && rangeContainsMarker(todayRange, date)),
				isPast: Boolean(nowDate ? date < nowDate : todayRange ? date < todayRange.start : false),
				isFuture: Boolean(nowDate ? date > nowDate : todayRange ? date >= todayRange.end : false)
			};
		}
		function getDayClassNames(meta, theme) {
			let classNames = ["fc-day", `fc-day-${DAY_IDS[meta.dow]}`];
			if (meta.isDisabled) classNames.push("fc-day-disabled");
			else {
				if (meta.isToday) {
					classNames.push("fc-day-today");
					classNames.push(theme.getClass("today"));
				}
				if (meta.isPast) classNames.push("fc-day-past");
				if (meta.isFuture) classNames.push("fc-day-future");
				if (meta.isOther) classNames.push("fc-day-other");
			}
			return classNames;
		}
		function getSlotClassNames(meta, theme) {
			let classNames = ["fc-slot", `fc-slot-${DAY_IDS[meta.dow]}`];
			if (meta.isDisabled) classNames.push("fc-slot-disabled");
			else {
				if (meta.isToday) {
					classNames.push("fc-slot-today");
					classNames.push(theme.getClass("today"));
				}
				if (meta.isPast) classNames.push("fc-slot-past");
				if (meta.isFuture) classNames.push("fc-slot-future");
			}
			return classNames;
		}
		const DAY_FORMAT = createFormatter({
			year: "numeric",
			month: "long",
			day: "numeric"
		});
		const WEEK_FORMAT = createFormatter({ week: "long" });
		function buildNavLinkAttrs(context, dateMarker, viewType = "day", isTabbable = true) {
			const { dateEnv, options, calendarApi } = context;
			let dateStr = dateEnv.format(dateMarker, viewType === "week" ? WEEK_FORMAT : DAY_FORMAT);
			if (options.navLinks) {
				let zonedDate = dateEnv.toDate(dateMarker);
				const handleInteraction = (ev) => {
					let customAction = viewType === "day" ? options.navLinkDayClick : viewType === "week" ? options.navLinkWeekClick : null;
					if (typeof customAction === "function") customAction.call(calendarApi, dateEnv.toDate(dateMarker), ev);
					else {
						if (typeof customAction === "string") viewType = customAction;
						calendarApi.zoomTo(dateMarker, viewType);
					}
				};
				return Object.assign({
					title: formatWithOrdinals(options.navLinkHint, [dateStr, zonedDate], dateStr),
					"data-navlink": ""
				}, isTabbable ? createAriaClickAttrs(handleInteraction) : { onClick: handleInteraction });
			}
			return { "aria-label": dateStr };
		}
		let _isRtlScrollbarOnLeft = null;
		function getIsRtlScrollbarOnLeft() {
			if (_isRtlScrollbarOnLeft === null) _isRtlScrollbarOnLeft = computeIsRtlScrollbarOnLeft();
			return _isRtlScrollbarOnLeft;
		}
		function computeIsRtlScrollbarOnLeft() {
			let outerEl = document.createElement("div");
			applyStyle(outerEl, {
				position: "absolute",
				top: -1e3,
				left: 0,
				border: 0,
				padding: 0,
				overflow: "scroll",
				direction: "rtl"
			});
			outerEl.innerHTML = "<div></div>";
			document.body.appendChild(outerEl);
			let res = outerEl.firstChild.getBoundingClientRect().left > outerEl.getBoundingClientRect().left;
			removeElement(outerEl);
			return res;
		}
		let _scrollbarWidths;
		function getScrollbarWidths() {
			if (!_scrollbarWidths) _scrollbarWidths = computeScrollbarWidths();
			return _scrollbarWidths;
		}
		function computeScrollbarWidths() {
			let el = document.createElement("div");
			el.style.overflow = "scroll";
			el.style.position = "absolute";
			el.style.top = "-9999px";
			el.style.left = "-9999px";
			document.body.appendChild(el);
			let res = computeScrollbarWidthsForEl(el);
			document.body.removeChild(el);
			return res;
		}
		function computeScrollbarWidthsForEl(el) {
			return {
				x: el.offsetHeight - el.clientHeight,
				y: el.offsetWidth - el.clientWidth
			};
		}
		function computeEdges(el, getPadding = false) {
			let computedStyle = window.getComputedStyle(el);
			let borderLeft = parseInt(computedStyle.borderLeftWidth, 10) || 0;
			let borderRight = parseInt(computedStyle.borderRightWidth, 10) || 0;
			let borderTop = parseInt(computedStyle.borderTopWidth, 10) || 0;
			let borderBottom = parseInt(computedStyle.borderBottomWidth, 10) || 0;
			let badScrollbarWidths = computeScrollbarWidthsForEl(el);
			let scrollbarLeftRight = badScrollbarWidths.y - borderLeft - borderRight;
			let res = {
				borderLeft,
				borderRight,
				borderTop,
				borderBottom,
				scrollbarBottom: badScrollbarWidths.x - borderTop - borderBottom,
				scrollbarLeft: 0,
				scrollbarRight: 0
			};
			if (getIsRtlScrollbarOnLeft() && computedStyle.direction === "rtl") res.scrollbarLeft = scrollbarLeftRight;
			else res.scrollbarRight = scrollbarLeftRight;
			if (getPadding) {
				res.paddingLeft = parseInt(computedStyle.paddingLeft, 10) || 0;
				res.paddingRight = parseInt(computedStyle.paddingRight, 10) || 0;
				res.paddingTop = parseInt(computedStyle.paddingTop, 10) || 0;
				res.paddingBottom = parseInt(computedStyle.paddingBottom, 10) || 0;
			}
			return res;
		}
		function computeInnerRect(el, goWithinPadding = false, doFromWindowViewport) {
			let outerRect = doFromWindowViewport ? el.getBoundingClientRect() : computeRect(el);
			let edges = computeEdges(el, goWithinPadding);
			let res = {
				left: outerRect.left + edges.borderLeft + edges.scrollbarLeft,
				right: outerRect.right - edges.borderRight - edges.scrollbarRight,
				top: outerRect.top + edges.borderTop,
				bottom: outerRect.bottom - edges.borderBottom - edges.scrollbarBottom
			};
			if (goWithinPadding) {
				res.left += edges.paddingLeft;
				res.right -= edges.paddingRight;
				res.top += edges.paddingTop;
				res.bottom -= edges.paddingBottom;
			}
			return res;
		}
		function computeRect(el) {
			let rect = el.getBoundingClientRect();
			return {
				left: rect.left + window.scrollX,
				top: rect.top + window.scrollY,
				right: rect.right + window.scrollX,
				bottom: rect.bottom + window.scrollY
			};
		}
		function computeClippedClientRect(el) {
			let clippingParents = getClippingParents(el);
			let rect = el.getBoundingClientRect();
			for (let clippingParent of clippingParents) {
				let intersection = intersectRects(rect, clippingParent.getBoundingClientRect());
				if (intersection) rect = intersection;
				else return null;
			}
			return rect;
		}
		function getClippingParents(el) {
			let parents = [];
			while (el instanceof HTMLElement) {
				let computedStyle = window.getComputedStyle(el);
				if (computedStyle.position === "fixed") break;
				if (/(auto|scroll)/.test(computedStyle.overflow + computedStyle.overflowY + computedStyle.overflowX)) parents.push(el);
				el = el.parentNode;
			}
			return parents;
		}
		var PositionCache = class {
			constructor(originEl, els, isHorizontal, isVertical) {
				this.els = els;
				let originClientRect = this.originClientRect = originEl.getBoundingClientRect();
				if (isHorizontal) this.buildElHorizontals(originClientRect.left);
				if (isVertical) this.buildElVerticals(originClientRect.top);
			}
			buildElHorizontals(originClientLeft) {
				let lefts = [];
				let rights = [];
				for (let el of this.els) {
					let rect = el.getBoundingClientRect();
					lefts.push(rect.left - originClientLeft);
					rights.push(rect.right - originClientLeft);
				}
				this.lefts = lefts;
				this.rights = rights;
			}
			buildElVerticals(originClientTop) {
				let tops = [];
				let bottoms = [];
				for (let el of this.els) {
					let rect = el.getBoundingClientRect();
					tops.push(rect.top - originClientTop);
					bottoms.push(rect.bottom - originClientTop);
				}
				this.tops = tops;
				this.bottoms = bottoms;
			}
			leftToIndex(leftPosition) {
				let { lefts, rights } = this;
				let len = lefts.length;
				let i;
				for (i = 0; i < len; i += 1) if (leftPosition >= lefts[i] && leftPosition < rights[i]) return i;
			}
			topToIndex(topPosition) {
				let { tops, bottoms } = this;
				let len = tops.length;
				let i;
				for (i = 0; i < len; i += 1) if (topPosition >= tops[i] && topPosition < bottoms[i]) return i;
			}
			getWidth(leftIndex) {
				return this.rights[leftIndex] - this.lefts[leftIndex];
			}
			getHeight(topIndex) {
				return this.bottoms[topIndex] - this.tops[topIndex];
			}
			similarTo(otherCache) {
				return similarNumArrays(this.tops || [], otherCache.tops || []) && similarNumArrays(this.bottoms || [], otherCache.bottoms || []) && similarNumArrays(this.lefts || [], otherCache.lefts || []) && similarNumArrays(this.rights || [], otherCache.rights || []);
			}
		};
		function similarNumArrays(a, b) {
			const len = a.length;
			if (len !== b.length) return false;
			for (let i = 0; i < len; i++) if (Math.round(a[i]) !== Math.round(b[i])) return false;
			return true;
		}
		var ScrollController = class {
			getMaxScrollTop() {
				return this.getScrollHeight() - this.getClientHeight();
			}
			getMaxScrollLeft() {
				return this.getScrollWidth() - this.getClientWidth();
			}
			canScrollVertically() {
				return this.getMaxScrollTop() > 0;
			}
			canScrollHorizontally() {
				return this.getMaxScrollLeft() > 0;
			}
			canScrollUp() {
				return this.getScrollTop() > 0;
			}
			canScrollDown() {
				return this.getScrollTop() < this.getMaxScrollTop();
			}
			canScrollLeft() {
				return this.getScrollLeft() > 0;
			}
			canScrollRight() {
				return this.getScrollLeft() < this.getMaxScrollLeft();
			}
		};
		var ElementScrollController = class extends ScrollController {
			constructor(el) {
				super();
				this.el = el;
			}
			getScrollTop() {
				return this.el.scrollTop;
			}
			getScrollLeft() {
				return this.el.scrollLeft;
			}
			setScrollTop(top) {
				this.el.scrollTop = top;
			}
			setScrollLeft(left) {
				this.el.scrollLeft = left;
			}
			getScrollWidth() {
				return this.el.scrollWidth;
			}
			getScrollHeight() {
				return this.el.scrollHeight;
			}
			getClientHeight() {
				return this.el.clientHeight;
			}
			getClientWidth() {
				return this.el.clientWidth;
			}
		};
		var WindowScrollController = class extends ScrollController {
			getScrollTop() {
				return window.scrollY;
			}
			getScrollLeft() {
				return window.scrollX;
			}
			setScrollTop(n) {
				window.scroll(window.scrollX, n);
			}
			setScrollLeft(n) {
				window.scroll(n, window.scrollY);
			}
			getScrollWidth() {
				return document.documentElement.scrollWidth;
			}
			getScrollHeight() {
				return document.documentElement.scrollHeight;
			}
			getClientHeight() {
				return document.documentElement.clientHeight;
			}
			getClientWidth() {
				return document.documentElement.clientWidth;
			}
		};
		var DateComponent = class extends BaseComponent {
			constructor() {
				super(...arguments);
				this.uid = guid();
			}
			prepareHits() {}
			queryHit(positionLeft, positionTop, elWidth, elHeight) {
				return null;
			}
			isValidSegDownEl(el) {
				return !this.props.eventDrag && !this.props.eventResize && !elementClosest(el, ".fc-event-mirror");
			}
			isValidDateDownEl(el) {
				return !elementClosest(el, ".fc-event:not(.fc-bg-event)") && !elementClosest(el, ".fc-more-link") && !elementClosest(el, "a[data-navlink]") && !elementClosest(el, ".fc-popover");
			}
		};
		var NamedTimeZoneImpl = class {
			constructor(timeZoneName) {
				this.timeZoneName = timeZoneName;
			}
		};
		var SegHierarchy = class {
			constructor(getEntryThickness = (entry) => {
				return entry.thickness || 1;
			}) {
				this.getEntryThickness = getEntryThickness;
				this.strictOrder = false;
				this.allowReslicing = false;
				this.maxCoord = -1;
				this.maxStackCnt = -1;
				this.levelCoords = [];
				this.entriesByLevel = [];
				this.stackCnts = {};
			}
			addSegs(inputs) {
				let hiddenEntries = [];
				for (let input of inputs) this.insertEntry(input, hiddenEntries);
				return hiddenEntries;
			}
			insertEntry(entry, hiddenEntries) {
				let insertion = this.findInsertion(entry);
				if (this.isInsertionValid(insertion, entry)) this.insertEntryAt(entry, insertion);
				else this.handleInvalidInsertion(insertion, entry, hiddenEntries);
			}
			isInsertionValid(insertion, entry) {
				return (this.maxCoord === -1 || insertion.levelCoord + this.getEntryThickness(entry) <= this.maxCoord) && (this.maxStackCnt === -1 || insertion.stackCnt < this.maxStackCnt);
			}
			handleInvalidInsertion(insertion, entry, hiddenEntries) {
				if (this.allowReslicing && insertion.touchingEntry) {
					const hiddenEntry = Object.assign(Object.assign({}, entry), { span: intersectSpans(entry.span, insertion.touchingEntry.span) });
					hiddenEntries.push(hiddenEntry);
					this.splitEntry(entry, insertion.touchingEntry, hiddenEntries);
				} else hiddenEntries.push(entry);
			}
			splitEntry(entry, barrier, hiddenEntries) {
				let entrySpan = entry.span;
				let barrierSpan = barrier.span;
				if (entrySpan.start < barrierSpan.start) this.insertEntry({
					index: entry.index,
					thickness: entry.thickness,
					span: {
						start: entrySpan.start,
						end: barrierSpan.start
					}
				}, hiddenEntries);
				if (entrySpan.end > barrierSpan.end) this.insertEntry({
					index: entry.index,
					thickness: entry.thickness,
					span: {
						start: barrierSpan.end,
						end: entrySpan.end
					}
				}, hiddenEntries);
			}
			insertEntryAt(entry, insertion) {
				let { entriesByLevel, levelCoords } = this;
				if (insertion.lateral === -1) {
					insertAt(levelCoords, insertion.level, insertion.levelCoord);
					insertAt(entriesByLevel, insertion.level, [entry]);
				} else insertAt(entriesByLevel[insertion.level], insertion.lateral, entry);
				this.stackCnts[buildEntryKey(entry)] = insertion.stackCnt;
			}
			findInsertion(newEntry) {
				let { levelCoords, entriesByLevel, strictOrder, stackCnts } = this;
				let levelCnt = levelCoords.length;
				let candidateCoord = 0;
				let touchingLevel = -1;
				let touchingLateral = -1;
				let touchingEntry = null;
				let stackCnt = 0;
				for (let trackingLevel = 0; trackingLevel < levelCnt; trackingLevel += 1) {
					const trackingCoord = levelCoords[trackingLevel];
					if (!strictOrder && trackingCoord >= candidateCoord + this.getEntryThickness(newEntry)) break;
					let trackingEntries = entriesByLevel[trackingLevel];
					let trackingEntry;
					let searchRes = binarySearch(trackingEntries, newEntry.span.start, getEntrySpanEnd);
					let lateralIndex = searchRes[0] + searchRes[1];
					while ((trackingEntry = trackingEntries[lateralIndex]) && trackingEntry.span.start < newEntry.span.end) {
						let trackingEntryBottom = trackingCoord + this.getEntryThickness(trackingEntry);
						if (trackingEntryBottom > candidateCoord) {
							candidateCoord = trackingEntryBottom;
							touchingEntry = trackingEntry;
							touchingLevel = trackingLevel;
							touchingLateral = lateralIndex;
						}
						if (trackingEntryBottom === candidateCoord) stackCnt = Math.max(stackCnt, stackCnts[buildEntryKey(trackingEntry)] + 1);
						lateralIndex += 1;
					}
				}
				let destLevel = 0;
				if (touchingEntry) {
					destLevel = touchingLevel + 1;
					while (destLevel < levelCnt && levelCoords[destLevel] < candidateCoord) destLevel += 1;
				}
				let destLateral = -1;
				if (destLevel < levelCnt && levelCoords[destLevel] === candidateCoord) destLateral = binarySearch(entriesByLevel[destLevel], newEntry.span.end, getEntrySpanEnd)[0];
				return {
					touchingLevel,
					touchingLateral,
					touchingEntry,
					stackCnt,
					levelCoord: candidateCoord,
					level: destLevel,
					lateral: destLateral
				};
			}
			toRects() {
				let { entriesByLevel, levelCoords } = this;
				let levelCnt = entriesByLevel.length;
				let rects = [];
				for (let level = 0; level < levelCnt; level += 1) {
					let entries = entriesByLevel[level];
					let levelCoord = levelCoords[level];
					for (let entry of entries) rects.push(Object.assign(Object.assign({}, entry), {
						thickness: this.getEntryThickness(entry),
						levelCoord
					}));
				}
				return rects;
			}
		};
		function getEntrySpanEnd(entry) {
			return entry.span.end;
		}
		function buildEntryKey(entry) {
			return entry.index + ":" + entry.span.start;
		}
		function groupIntersectingEntries(entries) {
			let merges = [];
			for (let entry of entries) {
				let filteredMerges = [];
				let hungryMerge = {
					span: entry.span,
					entries: [entry]
				};
				for (let merge of merges) if (intersectSpans(merge.span, hungryMerge.span)) hungryMerge = {
					entries: merge.entries.concat(hungryMerge.entries),
					span: joinSpans(merge.span, hungryMerge.span)
				};
				else filteredMerges.push(merge);
				filteredMerges.push(hungryMerge);
				merges = filteredMerges;
			}
			return merges;
		}
		function joinSpans(span0, span1) {
			return {
				start: Math.min(span0.start, span1.start),
				end: Math.max(span0.end, span1.end)
			};
		}
		function intersectSpans(span0, span1) {
			let start = Math.max(span0.start, span1.start);
			let end = Math.min(span0.end, span1.end);
			if (start < end) return {
				start,
				end
			};
			return null;
		}
		function insertAt(arr, index, item) {
			arr.splice(index, 0, item);
		}
		function binarySearch(a, searchVal, getItemVal) {
			let startIndex = 0;
			let endIndex = a.length;
			if (!endIndex || searchVal < getItemVal(a[startIndex])) return [0, 0];
			if (searchVal > getItemVal(a[endIndex - 1])) return [endIndex, 0];
			while (startIndex < endIndex) {
				let middleIndex = Math.floor(startIndex + (endIndex - startIndex) / 2);
				let middleVal = getItemVal(a[middleIndex]);
				if (searchVal < middleVal) endIndex = middleIndex;
				else if (searchVal > middleVal) startIndex = middleIndex + 1;
				else return [middleIndex, 1];
			}
			return [startIndex, 0];
		}
		var ElementDragging = class {
			constructor(el, selector) {
				this.emitter = new Emitter();
			}
			destroy() {}
			setMirrorIsVisible(bool) {}
			setMirrorNeedsRevert(bool) {}
			setAutoScrollEnabled(bool) {}
		};
		const config = {};
		const DRAG_META_REFINERS = {
			startTime: createDuration,
			duration: createDuration,
			create: Boolean,
			sourceId: String
		};
		function parseDragMeta(raw) {
			let { refined, extra } = refineProps(raw, DRAG_META_REFINERS);
			return {
				startTime: refined.startTime || null,
				duration: refined.duration || null,
				create: refined.create != null ? refined.create : true,
				sourceId: refined.sourceId,
				leftoverProps: extra
			};
		}
		function computeFallbackHeaderFormat(datesRepDistinctDays, dayCnt) {
			if (!datesRepDistinctDays || dayCnt > 10) return createFormatter({ weekday: "short" });
			if (dayCnt > 1) return createFormatter({
				weekday: "short",
				month: "numeric",
				day: "numeric",
				omitCommas: true
			});
			return createFormatter({ weekday: "long" });
		}
		const CLASS_NAME = "fc-col-header-cell";
		function renderInner$1(renderProps) {
			return renderProps.text;
		}
		var TableDateCell = class extends BaseComponent {
			render() {
				let { dateEnv, options, theme, viewApi } = this.context;
				let { props } = this;
				let { date, dateProfile } = props;
				let dayMeta = getDateMeta(date, props.todayRange, null, dateProfile);
				let classNames = [CLASS_NAME].concat(getDayClassNames(dayMeta, theme));
				let text = dateEnv.format(date, props.dayHeaderFormat);
				let navLinkAttrs = !dayMeta.isDisabled && props.colCnt > 1 ? buildNavLinkAttrs(this.context, date) : {};
				let publicDate = dateEnv.toDate(date);
				if (dateEnv.namedTimeZoneImpl) publicDate = addMs(publicDate, 36e5);
				let renderProps = Object.assign(Object.assign(Object.assign({
					date: publicDate,
					view: viewApi
				}, props.extraRenderProps), { text }), dayMeta);
				return preact.createElement(ContentContainer, {
					elTag: "th",
					elClasses: classNames,
					elAttrs: Object.assign({
						role: "columnheader",
						colSpan: props.colSpan,
						"data-date": !dayMeta.isDisabled ? formatDayString(date) : void 0
					}, props.extraDataAttrs),
					renderProps,
					generatorName: "dayHeaderContent",
					customGenerator: options.dayHeaderContent,
					defaultGenerator: renderInner$1,
					classNameGenerator: options.dayHeaderClassNames,
					didMount: options.dayHeaderDidMount,
					willUnmount: options.dayHeaderWillUnmount
				}, (InnerContainer) => preact.createElement("div", { className: "fc-scrollgrid-sync-inner" }, !dayMeta.isDisabled && preact.createElement(InnerContainer, {
					elTag: "a",
					elAttrs: navLinkAttrs,
					elClasses: ["fc-col-header-cell-cushion", props.isSticky && "fc-sticky"]
				})));
			}
		};
		const WEEKDAY_FORMAT = createFormatter({ weekday: "long" });
		var TableDowCell = class extends BaseComponent {
			render() {
				let { props } = this;
				let { dateEnv, theme, viewApi, options } = this.context;
				let date = addDays(/* @__PURE__ */ new Date(2592e5), props.dow);
				let dateMeta = {
					dow: props.dow,
					isDisabled: false,
					isFuture: false,
					isPast: false,
					isToday: false,
					isOther: false
				};
				let text = dateEnv.format(date, props.dayHeaderFormat);
				let renderProps = Object.assign(Object.assign(Object.assign(Object.assign({ date }, dateMeta), { view: viewApi }), props.extraRenderProps), { text });
				return preact.createElement(ContentContainer, {
					elTag: "th",
					elClasses: [
						CLASS_NAME,
						...getDayClassNames(dateMeta, theme),
						...props.extraClassNames || []
					],
					elAttrs: Object.assign({
						role: "columnheader",
						colSpan: props.colSpan
					}, props.extraDataAttrs),
					renderProps,
					generatorName: "dayHeaderContent",
					customGenerator: options.dayHeaderContent,
					defaultGenerator: renderInner$1,
					classNameGenerator: options.dayHeaderClassNames,
					didMount: options.dayHeaderDidMount,
					willUnmount: options.dayHeaderWillUnmount
				}, (InnerContent) => preact.createElement("div", { className: "fc-scrollgrid-sync-inner" }, preact.createElement(InnerContent, {
					elTag: "a",
					elClasses: ["fc-col-header-cell-cushion", props.isSticky && "fc-sticky"],
					elAttrs: { "aria-label": dateEnv.format(date, WEEKDAY_FORMAT) }
				})));
			}
		};
		var DayHeader = class extends BaseComponent {
			constructor() {
				super(...arguments);
				this.createDayHeaderFormatter = memoize(createDayHeaderFormatter);
			}
			render() {
				let { context } = this;
				let { dates, dateProfile, datesRepDistinctDays, renderIntro } = this.props;
				let dayHeaderFormat = this.createDayHeaderFormatter(context.options.dayHeaderFormat, datesRepDistinctDays, dates.length);
				return preact.createElement(NowTimer, { unit: "day" }, (nowDate, todayRange) => preact.createElement("tr", { role: "row" }, renderIntro && renderIntro("day"), dates.map((date) => datesRepDistinctDays ? preact.createElement(TableDateCell, {
					key: date.toISOString(),
					date,
					dateProfile,
					todayRange,
					colCnt: dates.length,
					dayHeaderFormat
				}) : preact.createElement(TableDowCell, {
					key: date.getUTCDay(),
					dow: date.getUTCDay(),
					dayHeaderFormat
				}))));
			}
		};
		function createDayHeaderFormatter(explicitFormat, datesRepDistinctDays, dateCnt) {
			return explicitFormat || computeFallbackHeaderFormat(datesRepDistinctDays, dateCnt);
		}
		var DaySeriesModel = class {
			constructor(range, dateProfileGenerator) {
				let date = range.start;
				let { end } = range;
				let indices = [];
				let dates = [];
				let dayIndex = -1;
				while (date < end) {
					if (dateProfileGenerator.isHiddenDay(date)) indices.push(dayIndex + .5);
					else {
						dayIndex += 1;
						indices.push(dayIndex);
						dates.push(date);
					}
					date = addDays(date, 1);
				}
				this.dates = dates;
				this.indices = indices;
				this.cnt = dates.length;
			}
			sliceRange(range) {
				let firstIndex = this.getDateDayIndex(range.start);
				let lastIndex = this.getDateDayIndex(addDays(range.end, -1));
				let clippedFirstIndex = Math.max(0, firstIndex);
				let clippedLastIndex = Math.min(this.cnt - 1, lastIndex);
				clippedFirstIndex = Math.ceil(clippedFirstIndex);
				clippedLastIndex = Math.floor(clippedLastIndex);
				if (clippedFirstIndex <= clippedLastIndex) return {
					firstIndex: clippedFirstIndex,
					lastIndex: clippedLastIndex,
					isStart: firstIndex === clippedFirstIndex,
					isEnd: lastIndex === clippedLastIndex
				};
				return null;
			}
			getDateDayIndex(date) {
				let { indices } = this;
				let dayOffset = Math.floor(diffDays(this.dates[0], date));
				if (dayOffset < 0) return indices[0] - 1;
				if (dayOffset >= indices.length) return indices[indices.length - 1] + 1;
				return indices[dayOffset];
			}
		};
		var DayTableModel = class {
			constructor(daySeries, breakOnWeeks) {
				let { dates } = daySeries;
				let daysPerRow;
				let firstDay;
				let rowCnt;
				if (breakOnWeeks) {
					firstDay = dates[0].getUTCDay();
					for (daysPerRow = 1; daysPerRow < dates.length; daysPerRow += 1) if (dates[daysPerRow].getUTCDay() === firstDay) break;
					rowCnt = Math.ceil(dates.length / daysPerRow);
				} else {
					rowCnt = 1;
					daysPerRow = dates.length;
				}
				this.rowCnt = rowCnt;
				this.colCnt = daysPerRow;
				this.daySeries = daySeries;
				this.cells = this.buildCells();
				this.headerDates = this.buildHeaderDates();
			}
			buildCells() {
				let rows = [];
				for (let row = 0; row < this.rowCnt; row += 1) {
					let cells = [];
					for (let col = 0; col < this.colCnt; col += 1) cells.push(this.buildCell(row, col));
					rows.push(cells);
				}
				return rows;
			}
			buildCell(row, col) {
				let date = this.daySeries.dates[row * this.colCnt + col];
				return {
					key: date.toISOString(),
					date
				};
			}
			buildHeaderDates() {
				let dates = [];
				for (let col = 0; col < this.colCnt; col += 1) dates.push(this.cells[0][col].date);
				return dates;
			}
			sliceRange(range) {
				let { colCnt } = this;
				let seriesSeg = this.daySeries.sliceRange(range);
				let segs = [];
				if (seriesSeg) {
					let { firstIndex, lastIndex } = seriesSeg;
					let index = firstIndex;
					while (index <= lastIndex) {
						let row = Math.floor(index / colCnt);
						let nextIndex = Math.min((row + 1) * colCnt, lastIndex + 1);
						segs.push({
							row,
							firstCol: index % colCnt,
							lastCol: (nextIndex - 1) % colCnt,
							isStart: seriesSeg.isStart && index === firstIndex,
							isEnd: seriesSeg.isEnd && nextIndex - 1 === lastIndex
						});
						index = nextIndex;
					}
				}
				return segs;
			}
		};
		var Slicer = class {
			constructor() {
				this.sliceBusinessHours = memoize(this._sliceBusinessHours);
				this.sliceDateSelection = memoize(this._sliceDateSpan);
				this.sliceEventStore = memoize(this._sliceEventStore);
				this.sliceEventDrag = memoize(this._sliceInteraction);
				this.sliceEventResize = memoize(this._sliceInteraction);
				this.forceDayIfListItem = false;
			}
			sliceProps(props, dateProfile, nextDayThreshold, context, ...extraArgs) {
				let { eventUiBases } = props;
				let eventSegs = this.sliceEventStore(props.eventStore, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs);
				return {
					dateSelectionSegs: this.sliceDateSelection(props.dateSelection, dateProfile, nextDayThreshold, eventUiBases, context, ...extraArgs),
					businessHourSegs: this.sliceBusinessHours(props.businessHours, dateProfile, nextDayThreshold, context, ...extraArgs),
					fgEventSegs: eventSegs.fg,
					bgEventSegs: eventSegs.bg,
					eventDrag: this.sliceEventDrag(props.eventDrag, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs),
					eventResize: this.sliceEventResize(props.eventResize, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs),
					eventSelection: props.eventSelection
				};
			}
			sliceNowDate(date, dateProfile, nextDayThreshold, context, ...extraArgs) {
				return this._sliceDateSpan({
					range: {
						start: date,
						end: addMs(date, 1)
					},
					allDay: false
				}, dateProfile, nextDayThreshold, {}, context, ...extraArgs);
			}
			_sliceBusinessHours(businessHours, dateProfile, nextDayThreshold, context, ...extraArgs) {
				if (!businessHours) return [];
				return this._sliceEventStore(expandRecurring(businessHours, computeActiveRange(dateProfile, Boolean(nextDayThreshold)), context), {}, dateProfile, nextDayThreshold, ...extraArgs).bg;
			}
			_sliceEventStore(eventStore, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs) {
				if (eventStore) {
					let rangeRes = sliceEventStore(eventStore, eventUiBases, computeActiveRange(dateProfile, Boolean(nextDayThreshold)), nextDayThreshold);
					return {
						bg: this.sliceEventRanges(rangeRes.bg, extraArgs),
						fg: this.sliceEventRanges(rangeRes.fg, extraArgs)
					};
				}
				return {
					bg: [],
					fg: []
				};
			}
			_sliceInteraction(interaction, eventUiBases, dateProfile, nextDayThreshold, ...extraArgs) {
				if (!interaction) return null;
				let rangeRes = sliceEventStore(interaction.mutatedEvents, eventUiBases, computeActiveRange(dateProfile, Boolean(nextDayThreshold)), nextDayThreshold);
				return {
					segs: this.sliceEventRanges(rangeRes.fg, extraArgs),
					affectedInstances: interaction.affectedEvents.instances,
					isEvent: interaction.isEvent
				};
			}
			_sliceDateSpan(dateSpan, dateProfile, nextDayThreshold, eventUiBases, context, ...extraArgs) {
				if (!dateSpan) return [];
				let activeRange = computeActiveRange(dateProfile, Boolean(nextDayThreshold));
				let activeDateSpanRange = intersectRanges(dateSpan.range, activeRange);
				if (activeDateSpanRange) {
					dateSpan = Object.assign(Object.assign({}, dateSpan), { range: activeDateSpanRange });
					let eventRange = fabricateEventRange(dateSpan, eventUiBases, context);
					let segs = this.sliceRange(dateSpan.range, ...extraArgs);
					for (let seg of segs) seg.eventRange = eventRange;
					return segs;
				}
				return [];
			}
			sliceEventRanges(eventRanges, extraArgs) {
				let segs = [];
				for (let eventRange of eventRanges) segs.push(...this.sliceEventRange(eventRange, extraArgs));
				return segs;
			}
			sliceEventRange(eventRange, extraArgs) {
				let dateRange = eventRange.range;
				if (this.forceDayIfListItem && eventRange.ui.display === "list-item") dateRange = {
					start: dateRange.start,
					end: addDays(dateRange.start, 1)
				};
				let segs = this.sliceRange(dateRange, ...extraArgs);
				for (let seg of segs) {
					seg.eventRange = eventRange;
					seg.isStart = eventRange.isStart && seg.isStart;
					seg.isEnd = eventRange.isEnd && seg.isEnd;
				}
				return segs;
			}
		};
		function computeActiveRange(dateProfile, isComponentAllDay) {
			let range = dateProfile.activeRange;
			if (isComponentAllDay) return range;
			return {
				start: addMs(range.start, dateProfile.slotMinTime.milliseconds),
				end: addMs(range.end, dateProfile.slotMaxTime.milliseconds - 864e5)
			};
		}
		function isInteractionValid(interaction, dateProfile, context) {
			let { instances } = interaction.mutatedEvents;
			for (let instanceId in instances) if (!rangeContainsRange(dateProfile.validRange, instances[instanceId].range)) return false;
			return isNewPropsValid({ eventDrag: interaction }, context);
		}
		function isDateSelectionValid(dateSelection, dateProfile, context) {
			if (!rangeContainsRange(dateProfile.validRange, dateSelection.range)) return false;
			return isNewPropsValid({ dateSelection }, context);
		}
		function isNewPropsValid(newProps, context) {
			let calendarState = context.getCurrentData();
			let props = Object.assign({
				businessHours: calendarState.businessHours,
				dateSelection: "",
				eventStore: calendarState.eventStore,
				eventUiBases: calendarState.eventUiBases,
				eventSelection: "",
				eventDrag: null,
				eventResize: null
			}, newProps);
			return (context.pluginHooks.isPropsValid || isPropsValid)(props, context);
		}
		function isPropsValid(state, context, dateSpanMeta = {}, filterConfig) {
			if (state.eventDrag && !isInteractionPropsValid(state, context, dateSpanMeta, filterConfig)) return false;
			if (state.dateSelection && !isDateSelectionPropsValid(state, context, dateSpanMeta, filterConfig)) return false;
			return true;
		}
		function isInteractionPropsValid(state, context, dateSpanMeta, filterConfig) {
			let currentState = context.getCurrentData();
			let interaction = state.eventDrag;
			let subjectEventStore = interaction.mutatedEvents;
			let subjectDefs = subjectEventStore.defs;
			let subjectInstances = subjectEventStore.instances;
			let subjectConfigs = compileEventUis(subjectDefs, interaction.isEvent ? state.eventUiBases : { "": currentState.selectionConfig });
			if (filterConfig) subjectConfigs = mapHash(subjectConfigs, filterConfig);
			let otherEventStore = excludeInstances(state.eventStore, interaction.affectedEvents.instances);
			let otherDefs = otherEventStore.defs;
			let otherInstances = otherEventStore.instances;
			let otherConfigs = compileEventUis(otherDefs, state.eventUiBases);
			for (let subjectInstanceId in subjectInstances) {
				let subjectInstance = subjectInstances[subjectInstanceId];
				let subjectRange = subjectInstance.range;
				let subjectConfig = subjectConfigs[subjectInstance.defId];
				let subjectDef = subjectDefs[subjectInstance.defId];
				if (!allConstraintsPass(subjectConfig.constraints, subjectRange, otherEventStore, state.businessHours, context)) return false;
				let { eventOverlap } = context.options;
				let eventOverlapFunc = typeof eventOverlap === "function" ? eventOverlap : null;
				for (let otherInstanceId in otherInstances) {
					let otherInstance = otherInstances[otherInstanceId];
					if (rangesIntersect(subjectRange, otherInstance.range)) {
						if (otherConfigs[otherInstance.defId].overlap === false && interaction.isEvent) return false;
						if (subjectConfig.overlap === false) return false;
						if (eventOverlapFunc && !eventOverlapFunc(new EventImpl(context, otherDefs[otherInstance.defId], otherInstance), new EventImpl(context, subjectDef, subjectInstance))) return false;
					}
				}
				let calendarEventStore = currentState.eventStore;
				for (let subjectAllow of subjectConfig.allows) {
					let subjectDateSpan = Object.assign(Object.assign({}, dateSpanMeta), {
						range: subjectInstance.range,
						allDay: subjectDef.allDay
					});
					let origDef = calendarEventStore.defs[subjectDef.defId];
					let origInstance = calendarEventStore.instances[subjectInstanceId];
					let eventApi;
					if (origDef) eventApi = new EventImpl(context, origDef, origInstance);
					else eventApi = new EventImpl(context, subjectDef);
					if (!subjectAllow(buildDateSpanApiWithContext(subjectDateSpan, context), eventApi)) return false;
				}
			}
			return true;
		}
		function isDateSelectionPropsValid(state, context, dateSpanMeta, filterConfig) {
			let relevantEventStore = state.eventStore;
			let relevantDefs = relevantEventStore.defs;
			let relevantInstances = relevantEventStore.instances;
			let selection = state.dateSelection;
			let selectionRange = selection.range;
			let { selectionConfig } = context.getCurrentData();
			if (filterConfig) selectionConfig = filterConfig(selectionConfig);
			if (!allConstraintsPass(selectionConfig.constraints, selectionRange, relevantEventStore, state.businessHours, context)) return false;
			let { selectOverlap } = context.options;
			let selectOverlapFunc = typeof selectOverlap === "function" ? selectOverlap : null;
			for (let relevantInstanceId in relevantInstances) {
				let relevantInstance = relevantInstances[relevantInstanceId];
				if (rangesIntersect(selectionRange, relevantInstance.range)) {
					if (selectionConfig.overlap === false) return false;
					if (selectOverlapFunc && !selectOverlapFunc(new EventImpl(context, relevantDefs[relevantInstance.defId], relevantInstance), null)) return false;
				}
			}
			for (let selectionAllow of selectionConfig.allows) if (!selectionAllow(buildDateSpanApiWithContext(Object.assign(Object.assign({}, dateSpanMeta), selection), context), null)) return false;
			return true;
		}
		function allConstraintsPass(constraints, subjectRange, otherEventStore, businessHoursUnexpanded, context) {
			for (let constraint of constraints) if (!anyRangesContainRange(constraintToRanges(constraint, subjectRange, otherEventStore, businessHoursUnexpanded, context), subjectRange)) return false;
			return true;
		}
		function constraintToRanges(constraint, subjectRange, otherEventStore, businessHoursUnexpanded, context) {
			if (constraint === "businessHours") return eventStoreToRanges(expandRecurring(businessHoursUnexpanded, subjectRange, context));
			if (typeof constraint === "string") return eventStoreToRanges(filterEventStoreDefs(otherEventStore, (eventDef) => eventDef.groupId === constraint));
			if (typeof constraint === "object" && constraint) return eventStoreToRanges(expandRecurring(constraint, subjectRange, context));
			return [];
		}
		function eventStoreToRanges(eventStore) {
			let { instances } = eventStore;
			let ranges = [];
			for (let instanceId in instances) ranges.push(instances[instanceId].range);
			return ranges;
		}
		function anyRangesContainRange(outerRanges, innerRange) {
			for (let outerRange of outerRanges) if (rangeContainsRange(outerRange, innerRange)) return true;
			return false;
		}
		const VISIBLE_HIDDEN_RE = /^(visible|hidden)$/;
		var Scroller = class extends BaseComponent {
			constructor() {
				super(...arguments);
				this.handleEl = (el) => {
					this.el = el;
					setRef(this.props.elRef, el);
				};
			}
			render() {
				let { props } = this;
				let { liquid, liquidIsAbsolute } = props;
				let isAbsolute = liquid && liquidIsAbsolute;
				let className = ["fc-scroller"];
				if (liquid) {
					if (liquidIsAbsolute) className.push("fc-scroller-liquid-absolute");
					else className.push("fc-scroller-liquid");
				}
				return preact.createElement("div", {
					ref: this.handleEl,
					className: className.join(" "),
					style: {
						overflowX: props.overflowX,
						overflowY: props.overflowY,
						left: isAbsolute && -(props.overcomeLeft || 0) || "",
						right: isAbsolute && -(props.overcomeRight || 0) || "",
						bottom: isAbsolute && -(props.overcomeBottom || 0) || "",
						marginLeft: !isAbsolute && -(props.overcomeLeft || 0) || "",
						marginRight: !isAbsolute && -(props.overcomeRight || 0) || "",
						marginBottom: !isAbsolute && -(props.overcomeBottom || 0) || "",
						maxHeight: props.maxHeight || ""
					}
				}, props.children);
			}
			needsXScrolling() {
				if (VISIBLE_HIDDEN_RE.test(this.props.overflowX)) return false;
				let { el } = this;
				let realClientWidth = this.el.getBoundingClientRect().width - this.getYScrollbarWidth();
				let { children } = el;
				for (let i = 0; i < children.length; i += 1) if (children[i].getBoundingClientRect().width > realClientWidth) return true;
				return false;
			}
			needsYScrolling() {
				if (VISIBLE_HIDDEN_RE.test(this.props.overflowY)) return false;
				let { el } = this;
				let realClientHeight = this.el.getBoundingClientRect().height - this.getXScrollbarWidth();
				let { children } = el;
				for (let i = 0; i < children.length; i += 1) if (children[i].getBoundingClientRect().height > realClientHeight) return true;
				return false;
			}
			getXScrollbarWidth() {
				if (VISIBLE_HIDDEN_RE.test(this.props.overflowX)) return 0;
				return this.el.offsetHeight - this.el.clientHeight;
			}
			getYScrollbarWidth() {
				if (VISIBLE_HIDDEN_RE.test(this.props.overflowY)) return 0;
				return this.el.offsetWidth - this.el.clientWidth;
			}
		};
		var RefMap = class {
			constructor(masterCallback) {
				this.masterCallback = masterCallback;
				this.currentMap = {};
				this.depths = {};
				this.callbackMap = {};
				this.handleValue = (val, key) => {
					let { depths, currentMap } = this;
					let removed = false;
					let added = false;
					if (val !== null) {
						removed = key in currentMap;
						currentMap[key] = val;
						depths[key] = (depths[key] || 0) + 1;
						added = true;
					} else {
						depths[key] -= 1;
						if (!depths[key]) {
							delete currentMap[key];
							delete this.callbackMap[key];
							removed = true;
						}
					}
					if (this.masterCallback) {
						if (removed) this.masterCallback(null, String(key));
						if (added) this.masterCallback(val, String(key));
					}
				};
			}
			createRef(key) {
				let refCallback = this.callbackMap[key];
				if (!refCallback) refCallback = this.callbackMap[key] = (val) => {
					this.handleValue(val, String(key));
				};
				return refCallback;
			}
			collect(startIndex, endIndex, step) {
				return collectFromHash(this.currentMap, startIndex, endIndex, step);
			}
			getAll() {
				return hashValuesToArray(this.currentMap);
			}
		};
		function computeShrinkWidth(chunkEls) {
			let shrinkCells = findElements(chunkEls, ".fc-scrollgrid-shrink");
			let largestWidth = 0;
			for (let shrinkCell of shrinkCells) largestWidth = Math.max(largestWidth, computeSmallestCellWidth(shrinkCell));
			return Math.ceil(largestWidth);
		}
		function getSectionHasLiquidHeight(props, sectionConfig) {
			return props.liquid && sectionConfig.liquid;
		}
		function getAllowYScrolling(props, sectionConfig) {
			return sectionConfig.maxHeight != null || getSectionHasLiquidHeight(props, sectionConfig);
		}
		function renderChunkContent(sectionConfig, chunkConfig, arg, isHeader) {
			let { expandRows } = arg;
			return typeof chunkConfig.content === "function" ? chunkConfig.content(arg) : preact.createElement("table", {
				role: "presentation",
				className: [chunkConfig.tableClassName, sectionConfig.syncRowHeights ? "fc-scrollgrid-sync-table" : ""].join(" "),
				style: {
					minWidth: arg.tableMinWidth,
					width: arg.clientWidth,
					height: expandRows ? arg.clientHeight : ""
				}
			}, arg.tableColGroupNode, preact.createElement(isHeader ? "thead" : "tbody", { role: "presentation" }, typeof chunkConfig.rowContent === "function" ? chunkConfig.rowContent(arg) : chunkConfig.rowContent));
		}
		function isColPropsEqual(cols0, cols1) {
			return isArraysEqual(cols0, cols1, isPropsEqual);
		}
		function renderMicroColGroup(cols, shrinkWidth) {
			let colNodes = [];
			for (let colProps of cols) {
				let span = colProps.span || 1;
				for (let i = 0; i < span; i += 1) colNodes.push(preact.createElement("col", { style: {
					width: colProps.width === "shrink" ? sanitizeShrinkWidth(shrinkWidth) : colProps.width || "",
					minWidth: colProps.minWidth || ""
				} }));
			}
			return preact.createElement("colgroup", {}, ...colNodes);
		}
		function sanitizeShrinkWidth(shrinkWidth) {
			return shrinkWidth == null ? 4 : shrinkWidth;
		}
		function hasShrinkWidth(cols) {
			for (let col of cols) if (col.width === "shrink") return true;
			return false;
		}
		function getScrollGridClassNames(liquid, context) {
			let classNames = ["fc-scrollgrid", context.theme.getClass("table")];
			if (liquid) classNames.push("fc-scrollgrid-liquid");
			return classNames;
		}
		function getSectionClassNames(sectionConfig, wholeTableVGrow) {
			let classNames = [
				"fc-scrollgrid-section",
				`fc-scrollgrid-section-${sectionConfig.type}`,
				sectionConfig.className
			];
			if (wholeTableVGrow && sectionConfig.liquid && sectionConfig.maxHeight == null) classNames.push("fc-scrollgrid-section-liquid");
			if (sectionConfig.isSticky) classNames.push("fc-scrollgrid-section-sticky");
			return classNames;
		}
		function renderScrollShim(arg) {
			return preact.createElement("div", {
				className: "fc-scrollgrid-sticky-shim",
				style: {
					width: arg.clientWidth,
					minWidth: arg.tableMinWidth
				}
			});
		}
		function getStickyHeaderDates(options) {
			let { stickyHeaderDates } = options;
			if (stickyHeaderDates == null || stickyHeaderDates === "auto") stickyHeaderDates = options.height === "auto" || options.viewHeight === "auto";
			return stickyHeaderDates;
		}
		function getStickyFooterScrollbar(options) {
			let { stickyFooterScrollbar } = options;
			if (stickyFooterScrollbar == null || stickyFooterScrollbar === "auto") stickyFooterScrollbar = options.height === "auto" || options.viewHeight === "auto";
			return stickyFooterScrollbar;
		}
		var SimpleScrollGrid = class extends BaseComponent {
			constructor() {
				super(...arguments);
				this.processCols = memoize((a) => a, isColPropsEqual);
				this.renderMicroColGroup = memoize(renderMicroColGroup);
				this.scrollerRefs = new RefMap();
				this.scrollerElRefs = new RefMap(this._handleScrollerEl.bind(this));
				this.state = {
					shrinkWidth: null,
					forceYScrollbars: false,
					scrollerClientWidths: {},
					scrollerClientHeights: {}
				};
				this.handleSizing = () => {
					this.safeSetState(Object.assign({ shrinkWidth: this.computeShrinkWidth() }, this.computeScrollerDims()));
				};
			}
			render() {
				let { props, state, context } = this;
				let sectionConfigs = props.sections || [];
				let cols = this.processCols(props.cols);
				let microColGroupNode = this.renderMicroColGroup(cols, state.shrinkWidth);
				let classNames = getScrollGridClassNames(props.liquid, context);
				if (props.collapsibleWidth) classNames.push("fc-scrollgrid-collapsible");
				let configCnt = sectionConfigs.length;
				let configI = 0;
				let currentConfig;
				let headSectionNodes = [];
				let bodySectionNodes = [];
				let footSectionNodes = [];
				while (configI < configCnt && (currentConfig = sectionConfigs[configI]).type === "header") {
					headSectionNodes.push(this.renderSection(currentConfig, microColGroupNode, true));
					configI += 1;
				}
				while (configI < configCnt && (currentConfig = sectionConfigs[configI]).type === "body") {
					bodySectionNodes.push(this.renderSection(currentConfig, microColGroupNode, false));
					configI += 1;
				}
				while (configI < configCnt && (currentConfig = sectionConfigs[configI]).type === "footer") {
					footSectionNodes.push(this.renderSection(currentConfig, microColGroupNode, true));
					configI += 1;
				}
				let isBuggy = !getCanVGrowWithinCell();
				const roleAttrs = { role: "rowgroup" };
				return preact.createElement("table", {
					role: "grid",
					className: classNames.join(" "),
					style: { height: props.height }
				}, Boolean(!isBuggy && headSectionNodes.length) && preact.createElement("thead", roleAttrs, ...headSectionNodes), Boolean(!isBuggy && bodySectionNodes.length) && preact.createElement("tbody", roleAttrs, ...bodySectionNodes), Boolean(!isBuggy && footSectionNodes.length) && preact.createElement("tfoot", roleAttrs, ...footSectionNodes), isBuggy && preact.createElement("tbody", roleAttrs, ...headSectionNodes, ...bodySectionNodes, ...footSectionNodes));
			}
			renderSection(sectionConfig, microColGroupNode, isHeader) {
				if ("outerContent" in sectionConfig) return preact.createElement(preact.Fragment, { key: sectionConfig.key }, sectionConfig.outerContent);
				return preact.createElement("tr", {
					key: sectionConfig.key,
					role: "presentation",
					className: getSectionClassNames(sectionConfig, this.props.liquid).join(" ")
				}, this.renderChunkTd(sectionConfig, microColGroupNode, sectionConfig.chunk, isHeader));
			}
			renderChunkTd(sectionConfig, microColGroupNode, chunkConfig, isHeader) {
				if ("outerContent" in chunkConfig) return chunkConfig.outerContent;
				let { props } = this;
				let { forceYScrollbars, scrollerClientWidths, scrollerClientHeights } = this.state;
				let needsYScrolling = getAllowYScrolling(props, sectionConfig);
				let isLiquid = getSectionHasLiquidHeight(props, sectionConfig);
				let overflowY = !props.liquid ? "visible" : forceYScrollbars ? "scroll" : !needsYScrolling ? "hidden" : "auto";
				let sectionKey = sectionConfig.key;
				let content = renderChunkContent(sectionConfig, chunkConfig, {
					tableColGroupNode: microColGroupNode,
					tableMinWidth: "",
					clientWidth: !props.collapsibleWidth && scrollerClientWidths[sectionKey] !== void 0 ? scrollerClientWidths[sectionKey] : null,
					clientHeight: scrollerClientHeights[sectionKey] !== void 0 ? scrollerClientHeights[sectionKey] : null,
					expandRows: sectionConfig.expandRows,
					syncRowHeights: false,
					rowSyncHeights: [],
					reportRowHeightChange: () => {}
				}, isHeader);
				return preact.createElement(isHeader ? "th" : "td", {
					ref: chunkConfig.elRef,
					role: "presentation"
				}, preact.createElement("div", { className: `fc-scroller-harness${isLiquid ? " fc-scroller-harness-liquid" : ""}` }, preact.createElement(Scroller, {
					ref: this.scrollerRefs.createRef(sectionKey),
					elRef: this.scrollerElRefs.createRef(sectionKey),
					overflowY,
					overflowX: !props.liquid ? "visible" : "hidden",
					maxHeight: sectionConfig.maxHeight,
					liquid: isLiquid,
					liquidIsAbsolute: true
				}, content)));
			}
			_handleScrollerEl(scrollerEl, key) {
				let section = getSectionByKey(this.props.sections, key);
				if (section) setRef(section.chunk.scrollerElRef, scrollerEl);
			}
			componentDidMount() {
				this.handleSizing();
				this.context.addResizeHandler(this.handleSizing);
			}
			componentDidUpdate() {
				this.handleSizing();
			}
			componentWillUnmount() {
				this.context.removeResizeHandler(this.handleSizing);
			}
			computeShrinkWidth() {
				return hasShrinkWidth(this.props.cols) ? computeShrinkWidth(this.scrollerElRefs.getAll()) : 0;
			}
			computeScrollerDims() {
				let scrollbarWidth = getScrollbarWidths();
				let { scrollerRefs, scrollerElRefs } = this;
				let forceYScrollbars = false;
				let scrollerClientWidths = {};
				let scrollerClientHeights = {};
				for (let sectionKey in scrollerRefs.currentMap) {
					let scroller = scrollerRefs.currentMap[sectionKey];
					if (scroller && scroller.needsYScrolling()) {
						forceYScrollbars = true;
						break;
					}
				}
				for (let section of this.props.sections) {
					let sectionKey = section.key;
					let scrollerEl = scrollerElRefs.currentMap[sectionKey];
					if (scrollerEl) {
						let harnessEl = scrollerEl.parentNode;
						scrollerClientWidths[sectionKey] = Math.floor(harnessEl.getBoundingClientRect().width - (forceYScrollbars ? scrollbarWidth.y : 0));
						scrollerClientHeights[sectionKey] = Math.floor(harnessEl.getBoundingClientRect().height);
					}
				}
				return {
					forceYScrollbars,
					scrollerClientWidths,
					scrollerClientHeights
				};
			}
		};
		SimpleScrollGrid.addStateEquality({
			scrollerClientWidths: isPropsEqual,
			scrollerClientHeights: isPropsEqual
		});
		function getSectionByKey(sections, key) {
			for (let section of sections) if (section.key === key) return section;
			return null;
		}
		var EventContainer = class extends BaseComponent {
			constructor() {
				super(...arguments);
				this.buildPublicEvent = memoize((context, eventDef, eventInstance) => new EventImpl(context, eventDef, eventInstance));
				this.handleEl = (el) => {
					this.el = el;
					setRef(this.props.elRef, el);
					if (el) setElSeg(el, this.props.seg);
				};
			}
			render() {
				const { props, context } = this;
				const { options } = context;
				const { seg } = props;
				const { eventRange } = seg;
				const { ui } = eventRange;
				const renderProps = {
					event: this.buildPublicEvent(context, eventRange.def, eventRange.instance),
					view: context.viewApi,
					timeText: props.timeText,
					textColor: ui.textColor,
					backgroundColor: ui.backgroundColor,
					borderColor: ui.borderColor,
					isDraggable: !props.disableDragging && computeSegDraggable(seg, context),
					isStartResizable: !props.disableResizing && computeSegStartResizable(seg, context),
					isEndResizable: !props.disableResizing && computeSegEndResizable(seg),
					isMirror: Boolean(props.isDragging || props.isResizing || props.isDateSelecting),
					isStart: Boolean(seg.isStart),
					isEnd: Boolean(seg.isEnd),
					isPast: Boolean(props.isPast),
					isFuture: Boolean(props.isFuture),
					isToday: Boolean(props.isToday),
					isSelected: Boolean(props.isSelected),
					isDragging: Boolean(props.isDragging),
					isResizing: Boolean(props.isResizing)
				};
				return preact.createElement(ContentContainer, {
					elRef: this.handleEl,
					elTag: props.elTag,
					elAttrs: props.elAttrs,
					elClasses: [
						...getEventClassNames(renderProps),
						...seg.eventRange.ui.classNames,
						...props.elClasses || []
					],
					elStyle: props.elStyle,
					renderProps,
					generatorName: "eventContent",
					customGenerator: options.eventContent,
					defaultGenerator: props.defaultGenerator,
					classNameGenerator: options.eventClassNames,
					didMount: options.eventDidMount,
					willUnmount: options.eventWillUnmount
				}, props.children);
			}
			componentDidUpdate(prevProps) {
				if (this.el && this.props.seg !== prevProps.seg) setElSeg(this.el, this.props.seg);
			}
		};
		var StandardEvent = class extends BaseComponent {
			render() {
				let { props, context } = this;
				let { options } = context;
				let { seg } = props;
				let { ui } = seg.eventRange;
				let timeText = buildSegTimeText(seg, options.eventTimeFormat || props.defaultTimeFormat, context, props.defaultDisplayEventTime, props.defaultDisplayEventEnd);
				return preact.createElement(EventContainer, Object.assign({}, props, {
					elTag: "a",
					elStyle: {
						borderColor: ui.borderColor,
						backgroundColor: ui.backgroundColor
					},
					elAttrs: getSegAnchorAttrs(seg, context),
					defaultGenerator: renderInnerContent$1,
					timeText
				}), (InnerContent, eventContentArg) => preact.createElement(preact.Fragment, null, preact.createElement(InnerContent, {
					elTag: "div",
					elClasses: ["fc-event-main"],
					elStyle: { color: eventContentArg.textColor }
				}), Boolean(eventContentArg.isStartResizable) && preact.createElement("div", { className: "fc-event-resizer fc-event-resizer-start" }), Boolean(eventContentArg.isEndResizable) && preact.createElement("div", { className: "fc-event-resizer fc-event-resizer-end" })));
			}
		};
		StandardEvent.addPropsEquality({ seg: isPropsEqual });
		function renderInnerContent$1(innerProps) {
			return preact.createElement("div", { className: "fc-event-main-frame" }, innerProps.timeText && preact.createElement("div", { className: "fc-event-time" }, innerProps.timeText), preact.createElement("div", { className: "fc-event-title-container" }, preact.createElement("div", { className: "fc-event-title fc-sticky" }, innerProps.event.title || preact.createElement(preact.Fragment, null, "\xA0"))));
		}
		const NowIndicatorContainer = (props) => preact.createElement(ViewContextType.Consumer, null, (context) => {
			let { options } = context;
			let renderProps = {
				isAxis: props.isAxis,
				date: context.dateEnv.toDate(props.date),
				view: context.viewApi
			};
			return preact.createElement(ContentContainer, {
				elRef: props.elRef,
				elTag: props.elTag || "div",
				elAttrs: props.elAttrs,
				elClasses: props.elClasses,
				elStyle: props.elStyle,
				renderProps,
				generatorName: "nowIndicatorContent",
				customGenerator: options.nowIndicatorContent,
				classNameGenerator: options.nowIndicatorClassNames,
				didMount: options.nowIndicatorDidMount,
				willUnmount: options.nowIndicatorWillUnmount
			}, props.children);
		});
		const DAY_NUM_FORMAT = createFormatter({ day: "numeric" });
		var DayCellContainer = class extends BaseComponent {
			constructor() {
				super(...arguments);
				this.refineRenderProps = memoizeObjArg(refineRenderProps);
			}
			render() {
				let { props, context } = this;
				let { options } = context;
				let renderProps = this.refineRenderProps({
					date: props.date,
					dateProfile: props.dateProfile,
					todayRange: props.todayRange,
					isMonthStart: props.isMonthStart || false,
					showDayNumber: props.showDayNumber,
					extraRenderProps: props.extraRenderProps,
					viewApi: context.viewApi,
					dateEnv: context.dateEnv,
					monthStartFormat: options.monthStartFormat
				});
				return preact.createElement(ContentContainer, {
					elRef: props.elRef,
					elTag: props.elTag,
					elAttrs: Object.assign(Object.assign({}, props.elAttrs), renderProps.isDisabled ? {} : { "data-date": formatDayString(props.date) }),
					elClasses: [...getDayClassNames(renderProps, context.theme), ...props.elClasses || []],
					elStyle: props.elStyle,
					renderProps,
					generatorName: "dayCellContent",
					customGenerator: options.dayCellContent,
					defaultGenerator: props.defaultGenerator,
					classNameGenerator: renderProps.isDisabled ? void 0 : options.dayCellClassNames,
					didMount: options.dayCellDidMount,
					willUnmount: options.dayCellWillUnmount
				}, props.children);
			}
		};
		function hasCustomDayCellContent(options) {
			return Boolean(options.dayCellContent || hasCustomRenderingHandler("dayCellContent", options));
		}
		function refineRenderProps(raw) {
			let { date, dateEnv, dateProfile, isMonthStart } = raw;
			let dayMeta = getDateMeta(date, raw.todayRange, null, dateProfile);
			let dayNumberText = raw.showDayNumber ? dateEnv.format(date, isMonthStart ? raw.monthStartFormat : DAY_NUM_FORMAT) : "";
			return Object.assign(Object.assign(Object.assign({
				date: dateEnv.toDate(date),
				view: raw.viewApi
			}, dayMeta), {
				isMonthStart,
				dayNumberText
			}), raw.extraRenderProps);
		}
		var BgEvent = class extends BaseComponent {
			render() {
				let { props } = this;
				let { seg } = props;
				return preact.createElement(EventContainer, {
					elTag: "div",
					elClasses: ["fc-bg-event"],
					elStyle: { backgroundColor: seg.eventRange.ui.backgroundColor },
					defaultGenerator: renderInnerContent,
					seg,
					timeText: "",
					isDragging: false,
					isResizing: false,
					isDateSelecting: false,
					isSelected: false,
					isPast: props.isPast,
					isFuture: props.isFuture,
					isToday: props.isToday,
					disableDragging: true,
					disableResizing: true
				});
			}
		};
		function renderInnerContent(props) {
			let { title } = props.event;
			return title && preact.createElement("div", { className: "fc-event-title" }, props.event.title);
		}
		function renderFill(fillType) {
			return preact.createElement("div", { className: `fc-${fillType}` });
		}
		const WeekNumberContainer = (props) => preact.createElement(ViewContextType.Consumer, null, (context) => {
			let { dateEnv, options } = context;
			let { date } = props;
			let format = options.weekNumberFormat || props.defaultFormat;
			let renderProps = {
				num: dateEnv.computeWeekNumber(date),
				text: dateEnv.format(date, format),
				date
			};
			return preact.createElement(ContentContainer, {
				elRef: props.elRef,
				elTag: props.elTag,
				elAttrs: props.elAttrs,
				elClasses: props.elClasses,
				elStyle: props.elStyle,
				renderProps,
				generatorName: "weekNumberContent",
				customGenerator: options.weekNumberContent,
				defaultGenerator: renderInner,
				classNameGenerator: options.weekNumberClassNames,
				didMount: options.weekNumberDidMount,
				willUnmount: options.weekNumberWillUnmount
			}, props.children);
		});
		function renderInner(innerProps) {
			return innerProps.text;
		}
		const PADDING_FROM_VIEWPORT = 10;
		var Popover = class extends BaseComponent {
			constructor() {
				super(...arguments);
				this.state = { titleId: getUniqueDomId() };
				this.handleRootEl = (el) => {
					this.rootEl = el;
					if (this.props.elRef) setRef(this.props.elRef, el);
				};
				this.handleDocumentMouseDown = (ev) => {
					const target = getEventTargetViaRoot(ev);
					if (!this.rootEl.contains(target)) this.handleCloseClick();
				};
				this.handleDocumentKeyDown = (ev) => {
					if (ev.key === "Escape") this.handleCloseClick();
				};
				this.handleCloseClick = () => {
					let { onClose } = this.props;
					if (onClose) onClose();
				};
			}
			render() {
				let { theme, options } = this.context;
				let { props, state } = this;
				let classNames = ["fc-popover", theme.getClass("popover")].concat(props.extraClassNames || []);
				return compat.createPortal(preact.createElement("div", Object.assign({}, props.extraAttrs, {
					id: props.id,
					className: classNames.join(" "),
					"aria-labelledby": state.titleId,
					ref: this.handleRootEl
				}), preact.createElement("div", { className: "fc-popover-header " + theme.getClass("popoverHeader") }, preact.createElement("span", {
					className: "fc-popover-title",
					id: state.titleId
				}, props.title), preact.createElement("span", {
					className: "fc-popover-close " + theme.getIconClass("close"),
					title: options.closeHint,
					onClick: this.handleCloseClick
				})), preact.createElement("div", { className: "fc-popover-body " + theme.getClass("popoverContent") }, props.children)), props.parentEl);
			}
			componentDidMount() {
				document.addEventListener("mousedown", this.handleDocumentMouseDown);
				document.addEventListener("keydown", this.handleDocumentKeyDown);
				this.updateSize();
			}
			componentWillUnmount() {
				document.removeEventListener("mousedown", this.handleDocumentMouseDown);
				document.removeEventListener("keydown", this.handleDocumentKeyDown);
			}
			updateSize() {
				let { isRtl } = this.context;
				let { alignmentEl, alignGridTop } = this.props;
				let { rootEl } = this;
				let alignmentRect = computeClippedClientRect(alignmentEl);
				if (alignmentRect) {
					let popoverDims = rootEl.getBoundingClientRect();
					let popoverTop = alignGridTop ? elementClosest(alignmentEl, ".fc-scrollgrid").getBoundingClientRect().top : alignmentRect.top;
					let popoverLeft = isRtl ? alignmentRect.right - popoverDims.width : alignmentRect.left;
					popoverTop = Math.max(popoverTop, PADDING_FROM_VIEWPORT);
					popoverLeft = Math.min(popoverLeft, document.documentElement.clientWidth - PADDING_FROM_VIEWPORT - popoverDims.width);
					popoverLeft = Math.max(popoverLeft, PADDING_FROM_VIEWPORT);
					let origin = rootEl.offsetParent.getBoundingClientRect();
					applyStyle(rootEl, {
						top: popoverTop - origin.top,
						left: popoverLeft - origin.left
					});
				}
			}
		};
		var MorePopover = class extends DateComponent {
			constructor() {
				super(...arguments);
				this.handleRootEl = (rootEl) => {
					this.rootEl = rootEl;
					if (rootEl) this.context.registerInteractiveComponent(this, {
						el: rootEl,
						useEventCenter: false
					});
					else this.context.unregisterInteractiveComponent(this);
				};
			}
			render() {
				let { options, dateEnv } = this.context;
				let { props } = this;
				let { startDate, todayRange, dateProfile } = props;
				let title = dateEnv.format(startDate, options.dayPopoverFormat);
				return preact.createElement(DayCellContainer, {
					elRef: this.handleRootEl,
					date: startDate,
					dateProfile,
					todayRange
				}, (InnerContent, renderProps, elAttrs) => preact.createElement(Popover, {
					elRef: elAttrs.ref,
					id: props.id,
					title,
					extraClassNames: ["fc-more-popover"].concat(elAttrs.className || []),
					extraAttrs: elAttrs,
					parentEl: props.parentEl,
					alignmentEl: props.alignmentEl,
					alignGridTop: props.alignGridTop,
					onClose: props.onClose
				}, hasCustomDayCellContent(options) && preact.createElement(InnerContent, {
					elTag: "div",
					elClasses: ["fc-more-popover-misc"]
				}), props.children));
			}
			queryHit(positionLeft, positionTop, elWidth, elHeight) {
				let { rootEl, props } = this;
				if (positionLeft >= 0 && positionLeft < elWidth && positionTop >= 0 && positionTop < elHeight) return {
					dateProfile: props.dateProfile,
					dateSpan: Object.assign({
						allDay: !props.forceTimed,
						range: {
							start: props.startDate,
							end: props.endDate
						}
					}, props.extraDateSpan),
					dayEl: rootEl,
					rect: {
						left: 0,
						top: 0,
						right: elWidth,
						bottom: elHeight
					},
					layer: 1
				};
				return null;
			}
		};
		var MoreLinkContainer = class extends BaseComponent {
			constructor() {
				super(...arguments);
				this.state = {
					isPopoverOpen: false,
					popoverId: getUniqueDomId()
				};
				this.handleLinkEl = (linkEl) => {
					this.linkEl = linkEl;
					if (this.props.elRef) setRef(this.props.elRef, linkEl);
				};
				this.handleClick = (ev) => {
					let { props, context } = this;
					let { moreLinkClick } = context.options;
					let date = computeRange(props).start;
					function buildPublicSeg(seg) {
						let { def, instance, range } = seg.eventRange;
						return {
							event: new EventImpl(context, def, instance),
							start: context.dateEnv.toDate(range.start),
							end: context.dateEnv.toDate(range.end),
							isStart: seg.isStart,
							isEnd: seg.isEnd
						};
					}
					if (typeof moreLinkClick === "function") moreLinkClick = moreLinkClick({
						date,
						allDay: Boolean(props.allDayDate),
						allSegs: props.allSegs.map(buildPublicSeg),
						hiddenSegs: props.hiddenSegs.map(buildPublicSeg),
						jsEvent: ev,
						view: context.viewApi
					});
					if (!moreLinkClick || moreLinkClick === "popover") this.setState({ isPopoverOpen: true });
					else if (typeof moreLinkClick === "string") context.calendarApi.zoomTo(date, moreLinkClick);
				};
				this.handlePopoverClose = () => {
					this.setState({ isPopoverOpen: false });
				};
			}
			render() {
				let { props, state } = this;
				return preact.createElement(ViewContextType.Consumer, null, (context) => {
					let { viewApi, options, calendarApi } = context;
					let { moreLinkText } = options;
					let { moreCnt } = props;
					let range = computeRange(props);
					let text = typeof moreLinkText === "function" ? moreLinkText.call(calendarApi, moreCnt) : `+${moreCnt} ${moreLinkText}`;
					let hint = formatWithOrdinals(options.moreLinkHint, [moreCnt], text);
					let renderProps = {
						num: moreCnt,
						shortText: `+${moreCnt}`,
						text,
						view: viewApi
					};
					return preact.createElement(preact.Fragment, null, Boolean(props.moreCnt) && preact.createElement(ContentContainer, {
						elTag: props.elTag || "a",
						elRef: this.handleLinkEl,
						elClasses: [...props.elClasses || [], "fc-more-link"],
						elStyle: props.elStyle,
						elAttrs: Object.assign(Object.assign(Object.assign({}, props.elAttrs), createAriaClickAttrs(this.handleClick)), {
							title: hint,
							"aria-expanded": state.isPopoverOpen,
							"aria-controls": state.isPopoverOpen ? state.popoverId : ""
						}),
						renderProps,
						generatorName: "moreLinkContent",
						customGenerator: options.moreLinkContent,
						defaultGenerator: props.defaultGenerator || renderMoreLinkInner,
						classNameGenerator: options.moreLinkClassNames,
						didMount: options.moreLinkDidMount,
						willUnmount: options.moreLinkWillUnmount
					}, props.children), state.isPopoverOpen && preact.createElement(MorePopover, {
						id: state.popoverId,
						startDate: range.start,
						endDate: range.end,
						dateProfile: props.dateProfile,
						todayRange: props.todayRange,
						extraDateSpan: props.extraDateSpan,
						parentEl: this.parentEl,
						alignmentEl: props.alignmentElRef ? props.alignmentElRef.current : this.linkEl,
						alignGridTop: props.alignGridTop,
						forceTimed: props.forceTimed,
						onClose: this.handlePopoverClose
					}, props.popoverContent()));
				});
			}
			componentDidMount() {
				this.updateParentEl();
			}
			componentDidUpdate() {
				this.updateParentEl();
			}
			updateParentEl() {
				if (this.linkEl) this.parentEl = elementClosest(this.linkEl, ".fc-view-harness");
			}
		};
		function renderMoreLinkInner(props) {
			return props.text;
		}
		function computeRange(props) {
			if (props.allDayDate) return {
				start: props.allDayDate,
				end: addDays(props.allDayDate, 1)
			};
			let { hiddenSegs } = props;
			return {
				start: computeEarliestSegStart(hiddenSegs),
				end: computeLatestSegEnd(hiddenSegs)
			};
		}
		function computeEarliestSegStart(segs) {
			return segs.reduce(pickEarliestStart).eventRange.range.start;
		}
		function pickEarliestStart(seg0, seg1) {
			return seg0.eventRange.range.start < seg1.eventRange.range.start ? seg0 : seg1;
		}
		function computeLatestSegEnd(segs) {
			return segs.reduce(pickLatestEnd).eventRange.range.end;
		}
		function pickLatestEnd(seg0, seg1) {
			return seg0.eventRange.range.end > seg1.eventRange.range.end ? seg0 : seg1;
		}
		var Store = class {
			constructor() {
				this.handlers = [];
			}
			set(value) {
				this.currentValue = value;
				for (let handler of this.handlers) handler(value);
			}
			subscribe(handler) {
				this.handlers.push(handler);
				if (this.currentValue !== void 0) handler(this.currentValue);
			}
		};
		var CustomRenderingStore = class extends Store {
			constructor() {
				super(...arguments);
				this.map = /* @__PURE__ */ new Map();
			}
			handle(customRendering) {
				const { map } = this;
				let updated = false;
				if (customRendering.isActive) {
					map.set(customRendering.id, customRendering);
					updated = true;
				} else if (map.has(customRendering.id)) {
					map.delete(customRendering.id);
					updated = true;
				}
				if (updated) this.set(map);
			}
		};
		exports.BASE_OPTION_DEFAULTS = BASE_OPTION_DEFAULTS;
		exports.BASE_OPTION_REFINERS = BASE_OPTION_REFINERS;
		exports.BaseComponent = BaseComponent;
		exports.BgEvent = BgEvent;
		exports.CALENDAR_LISTENER_REFINERS = CALENDAR_LISTENER_REFINERS;
		exports.CALENDAR_OPTION_REFINERS = CALENDAR_OPTION_REFINERS;
		exports.COMPLEX_OPTION_COMPARATORS = COMPLEX_OPTION_COMPARATORS;
		exports.CalendarImpl = CalendarImpl;
		exports.CalendarRoot = CalendarRoot;
		exports.ContentContainer = ContentContainer;
		exports.CustomRenderingStore = CustomRenderingStore;
		exports.DateComponent = DateComponent;
		exports.DateEnv = DateEnv;
		exports.DateProfileGenerator = DateProfileGenerator;
		exports.DayCellContainer = DayCellContainer;
		exports.DayHeader = DayHeader;
		exports.DaySeriesModel = DaySeriesModel;
		exports.DayTableModel = DayTableModel;
		exports.DelayedRunner = DelayedRunner;
		exports.ElementDragging = ElementDragging;
		exports.ElementScrollController = ElementScrollController;
		exports.Emitter = Emitter;
		exports.EventContainer = EventContainer;
		exports.EventImpl = EventImpl;
		exports.Interaction = Interaction;
		exports.JsonRequestError = JsonRequestError;
		exports.MoreLinkContainer = MoreLinkContainer;
		exports.NamedTimeZoneImpl = NamedTimeZoneImpl;
		exports.NowIndicatorContainer = NowIndicatorContainer;
		exports.NowTimer = NowTimer;
		exports.PositionCache = PositionCache;
		exports.PureComponent = PureComponent;
		exports.RefMap = RefMap;
		exports.RenderId = RenderId;
		exports.ScrollController = ScrollController;
		exports.ScrollResponder = ScrollResponder;
		exports.Scroller = Scroller;
		exports.SegHierarchy = SegHierarchy;
		exports.SimpleScrollGrid = SimpleScrollGrid;
		exports.Slicer = Slicer;
		exports.Splitter = Splitter;
		exports.StandardEvent = StandardEvent;
		exports.TableDateCell = TableDateCell;
		exports.TableDowCell = TableDowCell;
		exports.Theme = Theme;
		exports.VIEW_OPTION_REFINERS = VIEW_OPTION_REFINERS;
		exports.ViewContainer = ViewContainer;
		exports.ViewContextType = ViewContextType;
		exports.WeekNumberContainer = WeekNumberContainer;
		exports.WindowScrollController = WindowScrollController;
		exports.addDays = addDays;
		exports.addDurations = addDurations;
		exports.addMs = addMs;
		exports.addWeeks = addWeeks;
		exports.allowContextMenu = allowContextMenu;
		exports.allowSelection = allowSelection;
		exports.applyMutationToEventStore = applyMutationToEventStore;
		exports.applyStyle = applyStyle;
		exports.applyStyleProp = applyStyleProp;
		exports.arrayToHash = arrayToHash;
		exports.asCleanDays = asCleanDays;
		exports.asRoughMinutes = asRoughMinutes;
		exports.asRoughMs = asRoughMs;
		exports.asRoughSeconds = asRoughSeconds;
		exports.binarySearch = binarySearch;
		exports.buildElAttrs = buildElAttrs;
		exports.buildEntryKey = buildEntryKey;
		exports.buildEventApis = buildEventApis;
		exports.buildEventRangeKey = buildEventRangeKey;
		exports.buildEventSourceRefiners = buildEventSourceRefiners;
		exports.buildIsoString = buildIsoString;
		exports.buildNavLinkAttrs = buildNavLinkAttrs;
		exports.buildRangeApiWithTimeZone = buildRangeApiWithTimeZone;
		exports.buildSegTimeText = buildSegTimeText;
		exports.buildViewClassNames = buildViewClassNames;
		exports.buildViewContext = buildViewContext;
		exports.collectFromHash = collectFromHash;
		exports.combineEventUis = combineEventUis;
		exports.compareByFieldSpecs = compareByFieldSpecs;
		exports.compareNumbers = compareNumbers;
		exports.compareObjs = compareObjs;
		exports.computeEarliestSegStart = computeEarliestSegStart;
		exports.computeEdges = computeEdges;
		exports.computeFallbackHeaderFormat = computeFallbackHeaderFormat;
		exports.computeInnerRect = computeInnerRect;
		exports.computeRect = computeRect;
		exports.computeShrinkWidth = computeShrinkWidth;
		exports.computeVisibleDayRange = computeVisibleDayRange;
		exports.config = config;
		exports.constrainPoint = constrainPoint;
		exports.createContext = createContext;
		exports.createDuration = createDuration;
		exports.createEmptyEventStore = createEmptyEventStore;
		exports.createEventInstance = createEventInstance;
		exports.createEventUi = createEventUi;
		exports.createFormatter = createFormatter;
		exports.diffDates = diffDates;
		exports.diffDayAndTime = diffDayAndTime;
		exports.diffDays = diffDays;
		exports.diffPoints = diffPoints;
		exports.diffWeeks = diffWeeks;
		exports.diffWholeDays = diffWholeDays;
		exports.diffWholeWeeks = diffWholeWeeks;
		exports.disableCursor = disableCursor;
		exports.elementClosest = elementClosest;
		exports.elementMatches = elementMatches;
		exports.enableCursor = enableCursor;
		exports.ensureElHasStyles = ensureElHasStyles;
		exports.eventTupleToStore = eventTupleToStore;
		exports.filterHash = filterHash;
		exports.findDirectChildren = findDirectChildren;
		exports.findElements = findElements;
		exports.flexibleCompare = flexibleCompare;
		exports.flushSync = flushSync;
		exports.formatDayString = formatDayString;
		exports.formatIsoMonthStr = formatIsoMonthStr;
		exports.formatIsoTimeString = formatIsoTimeString;
		exports.formatWithOrdinals = formatWithOrdinals;
		exports.getAllowYScrolling = getAllowYScrolling;
		exports.getCanVGrowWithinCell = getCanVGrowWithinCell;
		exports.getClippingParents = getClippingParents;
		exports.getDateMeta = getDateMeta;
		exports.getDayClassNames = getDayClassNames;
		exports.getDefaultEventEnd = getDefaultEventEnd;
		exports.getElSeg = getElSeg;
		exports.getEntrySpanEnd = getEntrySpanEnd;
		exports.getEventTargetViaRoot = getEventTargetViaRoot;
		exports.getIsRtlScrollbarOnLeft = getIsRtlScrollbarOnLeft;
		exports.getRectCenter = getRectCenter;
		exports.getRelevantEvents = getRelevantEvents;
		exports.getScrollGridClassNames = getScrollGridClassNames;
		exports.getScrollbarWidths = getScrollbarWidths;
		exports.getSectionClassNames = getSectionClassNames;
		exports.getSectionHasLiquidHeight = getSectionHasLiquidHeight;
		exports.getSegAnchorAttrs = getSegAnchorAttrs;
		exports.getSegMeta = getSegMeta;
		exports.getSlotClassNames = getSlotClassNames;
		exports.getStickyFooterScrollbar = getStickyFooterScrollbar;
		exports.getStickyHeaderDates = getStickyHeaderDates;
		exports.getUniqueDomId = getUniqueDomId;
		exports.greatestDurationDenominator = greatestDurationDenominator;
		exports.groupIntersectingEntries = groupIntersectingEntries;
		exports.guid = guid;
		exports.hasBgRendering = hasBgRendering;
		exports.hasCustomDayCellContent = hasCustomDayCellContent;
		exports.hasShrinkWidth = hasShrinkWidth;
		exports.hashValuesToArray = hashValuesToArray;
		exports.identity = identity;
		exports.injectStyles = injectStyles;
		exports.interactionSettingsStore = interactionSettingsStore;
		exports.interactionSettingsToStore = interactionSettingsToStore;
		exports.intersectRanges = intersectRanges;
		exports.intersectRects = intersectRects;
		exports.intersectSpans = intersectSpans;
		exports.isArraysEqual = isArraysEqual;
		exports.isColPropsEqual = isColPropsEqual;
		exports.isDateSelectionValid = isDateSelectionValid;
		exports.isDateSpansEqual = isDateSpansEqual;
		exports.isInt = isInt;
		exports.isInteractionValid = isInteractionValid;
		exports.isMultiDayRange = isMultiDayRange;
		exports.isPropsEqual = isPropsEqual;
		exports.isPropsValid = isPropsValid;
		exports.isValidDate = isValidDate;
		exports.listenBySelector = listenBySelector;
		exports.listenToHoverBySelector = listenToHoverBySelector;
		exports.mapHash = mapHash;
		exports.memoize = memoize;
		exports.memoizeArraylike = memoizeArraylike;
		exports.memoizeHashlike = memoizeHashlike;
		exports.memoizeObjArg = memoizeObjArg;
		exports.mergeEventStores = mergeEventStores;
		exports.mergeProps = mergeProps;
		exports.mergeRawOptions = mergeRawOptions;
		exports.multiplyDuration = multiplyDuration;
		exports.padStart = padStart;
		exports.parse = parse;
		exports.parseBusinessHours = parseBusinessHours;
		exports.parseClassNames = parseClassNames;
		exports.parseDragMeta = parseDragMeta;
		exports.parseEventDef = parseEventDef;
		exports.parseEventSource = parseEventSource;
		exports.parseFieldSpecs = parseFieldSpecs;
		exports.parseInteractionSettings = parseInteractionSettings;
		exports.pointInsideRect = pointInsideRect;
		exports.preventContextMenu = preventContextMenu;
		exports.preventDefault = preventDefault;
		exports.preventSelection = preventSelection;
		exports.rangeContainsMarker = rangeContainsMarker;
		exports.rangeContainsRange = rangeContainsRange;
		exports.rangesEqual = rangesEqual;
		exports.rangesIntersect = rangesIntersect;
		exports.reduceEventStore = reduceEventStore;
		exports.refineEventDef = refineEventDef;
		exports.refineProps = refineProps;
		exports.removeElement = removeElement;
		exports.removeExact = removeExact;
		exports.renderChunkContent = renderChunkContent;
		exports.renderFill = renderFill;
		exports.renderMicroColGroup = renderMicroColGroup;
		exports.renderScrollShim = renderScrollShim;
		exports.requestJson = requestJson;
		exports.rezoneEventStoreDates = rezoneEventStoreDates;
		exports.sanitizeShrinkWidth = sanitizeShrinkWidth;
		exports.setRef = setRef;
		exports.sliceEventStore = sliceEventStore;
		exports.sortEventSegs = sortEventSegs;
		exports.startOfDay = startOfDay;
		exports.subtractDurations = subtractDurations;
		exports.translateRect = translateRect;
		exports.triggerDateSelect = triggerDateSelect;
		exports.unpromisify = unpromisify;
		exports.whenTransitionDone = whenTransitionDone;
		exports.wholeDivideDurations = wholeDivideDurations;
	}));
	//#endregion
	//#region node_modules/.pnpm/@fullcalendar+core@6.1.21/node_modules/@fullcalendar/core/index.cjs
	var require_core = /* @__PURE__ */ __commonJSMin(((exports) => {
		Object.defineProperty(exports, "__esModule", { value: true });
		var internalCommon = require_internal_common();
		var preact = (init_preact_module(), __toCommonJS(preact_module_exports));
		init_compat_module();
		const globalLocales = [];
		const MINIMAL_RAW_EN_LOCALE = {
			code: "en",
			week: {
				dow: 0,
				doy: 4
			},
			direction: "ltr",
			buttonText: {
				prev: "prev",
				next: "next",
				prevYear: "prev year",
				nextYear: "next year",
				year: "year",
				today: "today",
				month: "month",
				week: "week",
				day: "day",
				list: "list"
			},
			weekText: "W",
			weekTextLong: "Week",
			closeHint: "Close",
			timeHint: "Time",
			eventHint: "Event",
			allDayText: "all-day",
			moreLinkText: "more",
			noEventsText: "No events to display"
		};
		const RAW_EN_LOCALE = Object.assign(Object.assign({}, MINIMAL_RAW_EN_LOCALE), {
			buttonHints: {
				prev: "Previous $0",
				next: "Next $0",
				today(buttonText, unit) {
					return unit === "day" ? "Today" : `This ${buttonText}`;
				}
			},
			viewHint: "$0 view",
			navLinkHint: "Go to $0",
			moreLinkHint(eventCnt) {
				return `Show ${eventCnt} more event${eventCnt === 1 ? "" : "s"}`;
			}
		});
		function organizeRawLocales(explicitRawLocales) {
			let defaultCode = explicitRawLocales.length > 0 ? explicitRawLocales[0].code : "en";
			let allRawLocales = globalLocales.concat(explicitRawLocales);
			let rawLocaleMap = { en: RAW_EN_LOCALE };
			for (let rawLocale of allRawLocales) rawLocaleMap[rawLocale.code] = rawLocale;
			return {
				map: rawLocaleMap,
				defaultCode
			};
		}
		function buildLocale(inputSingular, available) {
			if (typeof inputSingular === "object" && !Array.isArray(inputSingular)) return parseLocale(inputSingular.code, [inputSingular.code], inputSingular);
			return queryLocale(inputSingular, available);
		}
		function queryLocale(codeArg, available) {
			let codes = [].concat(codeArg || []);
			return parseLocale(codeArg, codes, queryRawLocale(codes, available) || RAW_EN_LOCALE);
		}
		function queryRawLocale(codes, available) {
			for (let i = 0; i < codes.length; i += 1) {
				let parts = codes[i].toLocaleLowerCase().split("-");
				for (let j = parts.length; j > 0; j -= 1) {
					let simpleId = parts.slice(0, j).join("-");
					if (available[simpleId]) return available[simpleId];
				}
			}
			return null;
		}
		function parseLocale(codeArg, codes, raw) {
			let merged = internalCommon.mergeProps([MINIMAL_RAW_EN_LOCALE, raw], ["buttonText"]);
			delete merged.code;
			let { week } = merged;
			delete merged.week;
			return {
				codeArg,
				codes,
				week,
				simpleNumberFormat: new Intl.NumberFormat(codeArg),
				options: merged
			};
		}
		function createPlugin(input) {
			return {
				id: internalCommon.guid(),
				name: input.name,
				premiumReleaseDate: input.premiumReleaseDate ? new Date(input.premiumReleaseDate) : void 0,
				deps: input.deps || [],
				reducers: input.reducers || [],
				isLoadingFuncs: input.isLoadingFuncs || [],
				contextInit: [].concat(input.contextInit || []),
				eventRefiners: input.eventRefiners || {},
				eventDefMemberAdders: input.eventDefMemberAdders || [],
				eventSourceRefiners: input.eventSourceRefiners || {},
				isDraggableTransformers: input.isDraggableTransformers || [],
				eventDragMutationMassagers: input.eventDragMutationMassagers || [],
				eventDefMutationAppliers: input.eventDefMutationAppliers || [],
				dateSelectionTransformers: input.dateSelectionTransformers || [],
				datePointTransforms: input.datePointTransforms || [],
				dateSpanTransforms: input.dateSpanTransforms || [],
				views: input.views || {},
				viewPropsTransformers: input.viewPropsTransformers || [],
				isPropsValid: input.isPropsValid || null,
				externalDefTransforms: input.externalDefTransforms || [],
				viewContainerAppends: input.viewContainerAppends || [],
				eventDropTransformers: input.eventDropTransformers || [],
				componentInteractions: input.componentInteractions || [],
				calendarInteractions: input.calendarInteractions || [],
				themeClasses: input.themeClasses || {},
				eventSourceDefs: input.eventSourceDefs || [],
				cmdFormatter: input.cmdFormatter,
				recurringTypes: input.recurringTypes || [],
				namedTimeZonedImpl: input.namedTimeZonedImpl,
				initialView: input.initialView || "",
				elementDraggingImpl: input.elementDraggingImpl,
				optionChangeHandlers: input.optionChangeHandlers || {},
				scrollGridImpl: input.scrollGridImpl || null,
				listenerRefiners: input.listenerRefiners || {},
				optionRefiners: input.optionRefiners || {},
				propSetHandlers: input.propSetHandlers || {}
			};
		}
		function buildPluginHooks(pluginDefs, globalDefs) {
			let currentPluginIds = {};
			let hooks = {
				premiumReleaseDate: void 0,
				reducers: [],
				isLoadingFuncs: [],
				contextInit: [],
				eventRefiners: {},
				eventDefMemberAdders: [],
				eventSourceRefiners: {},
				isDraggableTransformers: [],
				eventDragMutationMassagers: [],
				eventDefMutationAppliers: [],
				dateSelectionTransformers: [],
				datePointTransforms: [],
				dateSpanTransforms: [],
				views: {},
				viewPropsTransformers: [],
				isPropsValid: null,
				externalDefTransforms: [],
				viewContainerAppends: [],
				eventDropTransformers: [],
				componentInteractions: [],
				calendarInteractions: [],
				themeClasses: {},
				eventSourceDefs: [],
				cmdFormatter: null,
				recurringTypes: [],
				namedTimeZonedImpl: null,
				initialView: "",
				elementDraggingImpl: null,
				optionChangeHandlers: {},
				scrollGridImpl: null,
				listenerRefiners: {},
				optionRefiners: {},
				propSetHandlers: {}
			};
			function addDefs(defs) {
				for (let def of defs) {
					const pluginName = def.name;
					const currentId = currentPluginIds[pluginName];
					if (currentId === void 0) {
						currentPluginIds[pluginName] = def.id;
						addDefs(def.deps);
						hooks = combineHooks(hooks, def);
					} else if (currentId !== def.id) console.warn(`Duplicate plugin '${pluginName}'`);
				}
			}
			if (pluginDefs) addDefs(pluginDefs);
			addDefs(globalDefs);
			return hooks;
		}
		function buildBuildPluginHooks() {
			let currentOverrideDefs = [];
			let currentGlobalDefs = [];
			let currentHooks;
			return (overrideDefs, globalDefs) => {
				if (!currentHooks || !internalCommon.isArraysEqual(overrideDefs, currentOverrideDefs) || !internalCommon.isArraysEqual(globalDefs, currentGlobalDefs)) currentHooks = buildPluginHooks(overrideDefs, globalDefs);
				currentOverrideDefs = overrideDefs;
				currentGlobalDefs = globalDefs;
				return currentHooks;
			};
		}
		function combineHooks(hooks0, hooks1) {
			return {
				premiumReleaseDate: compareOptionalDates(hooks0.premiumReleaseDate, hooks1.premiumReleaseDate),
				reducers: hooks0.reducers.concat(hooks1.reducers),
				isLoadingFuncs: hooks0.isLoadingFuncs.concat(hooks1.isLoadingFuncs),
				contextInit: hooks0.contextInit.concat(hooks1.contextInit),
				eventRefiners: Object.assign(Object.assign({}, hooks0.eventRefiners), hooks1.eventRefiners),
				eventDefMemberAdders: hooks0.eventDefMemberAdders.concat(hooks1.eventDefMemberAdders),
				eventSourceRefiners: Object.assign(Object.assign({}, hooks0.eventSourceRefiners), hooks1.eventSourceRefiners),
				isDraggableTransformers: hooks0.isDraggableTransformers.concat(hooks1.isDraggableTransformers),
				eventDragMutationMassagers: hooks0.eventDragMutationMassagers.concat(hooks1.eventDragMutationMassagers),
				eventDefMutationAppliers: hooks0.eventDefMutationAppliers.concat(hooks1.eventDefMutationAppliers),
				dateSelectionTransformers: hooks0.dateSelectionTransformers.concat(hooks1.dateSelectionTransformers),
				datePointTransforms: hooks0.datePointTransforms.concat(hooks1.datePointTransforms),
				dateSpanTransforms: hooks0.dateSpanTransforms.concat(hooks1.dateSpanTransforms),
				views: Object.assign(Object.assign({}, hooks0.views), hooks1.views),
				viewPropsTransformers: hooks0.viewPropsTransformers.concat(hooks1.viewPropsTransformers),
				isPropsValid: hooks1.isPropsValid || hooks0.isPropsValid,
				externalDefTransforms: hooks0.externalDefTransforms.concat(hooks1.externalDefTransforms),
				viewContainerAppends: hooks0.viewContainerAppends.concat(hooks1.viewContainerAppends),
				eventDropTransformers: hooks0.eventDropTransformers.concat(hooks1.eventDropTransformers),
				calendarInteractions: hooks0.calendarInteractions.concat(hooks1.calendarInteractions),
				componentInteractions: hooks0.componentInteractions.concat(hooks1.componentInteractions),
				themeClasses: Object.assign(Object.assign({}, hooks0.themeClasses), hooks1.themeClasses),
				eventSourceDefs: hooks0.eventSourceDefs.concat(hooks1.eventSourceDefs),
				cmdFormatter: hooks1.cmdFormatter || hooks0.cmdFormatter,
				recurringTypes: hooks0.recurringTypes.concat(hooks1.recurringTypes),
				namedTimeZonedImpl: hooks1.namedTimeZonedImpl || hooks0.namedTimeZonedImpl,
				initialView: hooks0.initialView || hooks1.initialView,
				elementDraggingImpl: hooks0.elementDraggingImpl || hooks1.elementDraggingImpl,
				optionChangeHandlers: Object.assign(Object.assign({}, hooks0.optionChangeHandlers), hooks1.optionChangeHandlers),
				scrollGridImpl: hooks1.scrollGridImpl || hooks0.scrollGridImpl,
				listenerRefiners: Object.assign(Object.assign({}, hooks0.listenerRefiners), hooks1.listenerRefiners),
				optionRefiners: Object.assign(Object.assign({}, hooks0.optionRefiners), hooks1.optionRefiners),
				propSetHandlers: Object.assign(Object.assign({}, hooks0.propSetHandlers), hooks1.propSetHandlers)
			};
		}
		function compareOptionalDates(date0, date1) {
			if (date0 === void 0) return date1;
			if (date1 === void 0) return date0;
			return new Date(Math.max(date0.valueOf(), date1.valueOf()));
		}
		var StandardTheme = class extends internalCommon.Theme {};
		StandardTheme.prototype.classes = {
			root: "fc-theme-standard",
			tableCellShaded: "fc-cell-shaded",
			buttonGroup: "fc-button-group",
			button: "fc-button fc-button-primary",
			buttonActive: "fc-button-active"
		};
		StandardTheme.prototype.baseIconClass = "fc-icon";
		StandardTheme.prototype.iconClasses = {
			close: "fc-icon-x",
			prev: "fc-icon-chevron-left",
			next: "fc-icon-chevron-right",
			prevYear: "fc-icon-chevrons-left",
			nextYear: "fc-icon-chevrons-right"
		};
		StandardTheme.prototype.rtlIconClasses = {
			prev: "fc-icon-chevron-right",
			next: "fc-icon-chevron-left",
			prevYear: "fc-icon-chevrons-right",
			nextYear: "fc-icon-chevrons-left"
		};
		StandardTheme.prototype.iconOverrideOption = "buttonIcons";
		StandardTheme.prototype.iconOverrideCustomButtonOption = "icon";
		StandardTheme.prototype.iconOverridePrefix = "fc-icon-";
		function compileViewDefs(defaultConfigs, overrideConfigs) {
			let hash = {};
			let viewType;
			for (viewType in defaultConfigs) ensureViewDef(viewType, hash, defaultConfigs, overrideConfigs);
			for (viewType in overrideConfigs) ensureViewDef(viewType, hash, defaultConfigs, overrideConfigs);
			return hash;
		}
		function ensureViewDef(viewType, hash, defaultConfigs, overrideConfigs) {
			if (hash[viewType]) return hash[viewType];
			let viewDef = buildViewDef(viewType, hash, defaultConfigs, overrideConfigs);
			if (viewDef) hash[viewType] = viewDef;
			return viewDef;
		}
		function buildViewDef(viewType, hash, defaultConfigs, overrideConfigs) {
			let defaultConfig = defaultConfigs[viewType];
			let overrideConfig = overrideConfigs[viewType];
			let queryProp = (name) => defaultConfig && defaultConfig[name] !== null ? defaultConfig[name] : overrideConfig && overrideConfig[name] !== null ? overrideConfig[name] : null;
			let theComponent = queryProp("component");
			let superType = queryProp("superType");
			let superDef = null;
			if (superType) {
				if (superType === viewType) throw new Error("Can't have a custom view type that references itself");
				superDef = ensureViewDef(superType, hash, defaultConfigs, overrideConfigs);
			}
			if (!theComponent && superDef) theComponent = superDef.component;
			if (!theComponent) return null;
			return {
				type: viewType,
				component: theComponent,
				defaults: Object.assign(Object.assign({}, superDef ? superDef.defaults : {}), defaultConfig ? defaultConfig.rawOptions : {}),
				overrides: Object.assign(Object.assign({}, superDef ? superDef.overrides : {}), overrideConfig ? overrideConfig.rawOptions : {})
			};
		}
		function parseViewConfigs(inputs) {
			return internalCommon.mapHash(inputs, parseViewConfig);
		}
		function parseViewConfig(input) {
			let rawOptions = typeof input === "function" ? { component: input } : input;
			let { component } = rawOptions;
			if (rawOptions.content) component = createViewHookComponent(rawOptions);
			else if (component && !(component.prototype instanceof internalCommon.BaseComponent)) component = createViewHookComponent(Object.assign(Object.assign({}, rawOptions), { content: component }));
			return {
				superType: rawOptions.type,
				component,
				rawOptions
			};
		}
		function createViewHookComponent(options) {
			return (viewProps) => preact.createElement(internalCommon.ViewContextType.Consumer, null, (context) => preact.createElement(internalCommon.ContentContainer, {
				elTag: "div",
				elClasses: internalCommon.buildViewClassNames(context.viewSpec),
				renderProps: Object.assign(Object.assign({}, viewProps), { nextDayThreshold: context.options.nextDayThreshold }),
				generatorName: void 0,
				customGenerator: options.content,
				classNameGenerator: options.classNames,
				didMount: options.didMount,
				willUnmount: options.willUnmount
			}));
		}
		function buildViewSpecs(defaultInputs, optionOverrides, dynamicOptionOverrides, localeDefaults) {
			let defaultConfigs = parseViewConfigs(defaultInputs);
			let overrideConfigs = parseViewConfigs(optionOverrides.views);
			let viewDefs = compileViewDefs(defaultConfigs, overrideConfigs);
			return internalCommon.mapHash(viewDefs, (viewDef) => buildViewSpec(viewDef, overrideConfigs, optionOverrides, dynamicOptionOverrides, localeDefaults));
		}
		function buildViewSpec(viewDef, overrideConfigs, optionOverrides, dynamicOptionOverrides, localeDefaults) {
			let durationInput = viewDef.overrides.duration || viewDef.defaults.duration || dynamicOptionOverrides.duration || optionOverrides.duration;
			let duration = null;
			let durationUnit = "";
			let singleUnit = "";
			let singleUnitOverrides = {};
			if (durationInput) {
				duration = createDurationCached(durationInput);
				if (duration) {
					let denom = internalCommon.greatestDurationDenominator(duration);
					durationUnit = denom.unit;
					if (denom.value === 1) {
						singleUnit = durationUnit;
						singleUnitOverrides = overrideConfigs[durationUnit] ? overrideConfigs[durationUnit].rawOptions : {};
					}
				}
			}
			let queryButtonText = (optionsSubset) => {
				let buttonTextMap = optionsSubset.buttonText || {};
				let buttonTextKey = viewDef.defaults.buttonTextKey;
				if (buttonTextKey != null && buttonTextMap[buttonTextKey] != null) return buttonTextMap[buttonTextKey];
				if (buttonTextMap[viewDef.type] != null) return buttonTextMap[viewDef.type];
				if (buttonTextMap[singleUnit] != null) return buttonTextMap[singleUnit];
				return null;
			};
			let queryButtonTitle = (optionsSubset) => {
				let buttonHints = optionsSubset.buttonHints || {};
				let buttonKey = viewDef.defaults.buttonTextKey;
				if (buttonKey != null && buttonHints[buttonKey] != null) return buttonHints[buttonKey];
				if (buttonHints[viewDef.type] != null) return buttonHints[viewDef.type];
				if (buttonHints[singleUnit] != null) return buttonHints[singleUnit];
				return null;
			};
			return {
				type: viewDef.type,
				component: viewDef.component,
				duration,
				durationUnit,
				singleUnit,
				optionDefaults: viewDef.defaults,
				optionOverrides: Object.assign(Object.assign({}, singleUnitOverrides), viewDef.overrides),
				buttonTextOverride: queryButtonText(dynamicOptionOverrides) || queryButtonText(optionOverrides) || viewDef.overrides.buttonText,
				buttonTextDefault: queryButtonText(localeDefaults) || viewDef.defaults.buttonText || queryButtonText(internalCommon.BASE_OPTION_DEFAULTS) || viewDef.type,
				buttonTitleOverride: queryButtonTitle(dynamicOptionOverrides) || queryButtonTitle(optionOverrides) || viewDef.overrides.buttonHint,
				buttonTitleDefault: queryButtonTitle(localeDefaults) || viewDef.defaults.buttonHint || queryButtonTitle(internalCommon.BASE_OPTION_DEFAULTS)
			};
		}
		let durationInputMap = {};
		function createDurationCached(durationInput) {
			let json = JSON.stringify(durationInput);
			let res = durationInputMap[json];
			if (res === void 0) {
				res = internalCommon.createDuration(durationInput);
				durationInputMap[json] = res;
			}
			return res;
		}
		function reduceViewType(viewType, action) {
			switch (action.type) {
				case "CHANGE_VIEW_TYPE": viewType = action.viewType;
			}
			return viewType;
		}
		function reduceCurrentDate(currentDate, action) {
			switch (action.type) {
				case "CHANGE_DATE": return action.dateMarker;
				default: return currentDate;
			}
		}
		function getInitialDate(options, dateEnv, nowManager) {
			let initialDateInput = options.initialDate;
			if (initialDateInput != null) return dateEnv.createMarker(initialDateInput);
			return nowManager.getDateMarker();
		}
		function reduceDynamicOptionOverrides(dynamicOptionOverrides, action) {
			switch (action.type) {
				case "SET_OPTION": return Object.assign(Object.assign({}, dynamicOptionOverrides), { [action.optionName]: action.rawOptionValue });
				default: return dynamicOptionOverrides;
			}
		}
		function reduceDateProfile(currentDateProfile, action, currentDate, dateProfileGenerator) {
			let dp;
			switch (action.type) {
				case "CHANGE_VIEW_TYPE": return dateProfileGenerator.build(action.dateMarker || currentDate);
				case "CHANGE_DATE": return dateProfileGenerator.build(action.dateMarker);
				case "PREV":
					dp = dateProfileGenerator.buildPrev(currentDateProfile, currentDate);
					if (dp.isValid) return dp;
					break;
				case "NEXT":
					dp = dateProfileGenerator.buildNext(currentDateProfile, currentDate);
					if (dp.isValid) return dp;
			}
			return currentDateProfile;
		}
		function initEventSources(calendarOptions, dateProfile, context) {
			let activeRange = dateProfile ? dateProfile.activeRange : null;
			return addSources({}, parseInitialSources(calendarOptions, context), activeRange, context);
		}
		function reduceEventSources(eventSources, action, dateProfile, context) {
			let activeRange = dateProfile ? dateProfile.activeRange : null;
			switch (action.type) {
				case "ADD_EVENT_SOURCES": return addSources(eventSources, action.sources, activeRange, context);
				case "REMOVE_EVENT_SOURCE": return removeSource(eventSources, action.sourceId);
				case "PREV":
				case "NEXT":
				case "CHANGE_DATE":
				case "CHANGE_VIEW_TYPE":
					if (dateProfile) return fetchDirtySources(eventSources, activeRange, context);
					return eventSources;
				case "FETCH_EVENT_SOURCES": return fetchSourcesByIds(eventSources, action.sourceIds ? internalCommon.arrayToHash(action.sourceIds) : excludeStaticSources(eventSources, context), activeRange, action.isRefetch || false, context);
				case "RECEIVE_EVENTS":
				case "RECEIVE_EVENT_ERROR": return receiveResponse(eventSources, action.sourceId, action.fetchId, action.fetchRange);
				case "REMOVE_ALL_EVENT_SOURCES": return {};
				default: return eventSources;
			}
		}
		function reduceEventSourcesNewTimeZone(eventSources, dateProfile, context) {
			let activeRange = dateProfile ? dateProfile.activeRange : null;
			return fetchSourcesByIds(eventSources, excludeStaticSources(eventSources, context), activeRange, true, context);
		}
		function computeEventSourcesLoading(eventSources) {
			for (let sourceId in eventSources) if (eventSources[sourceId].isFetching) return true;
			return false;
		}
		function addSources(eventSourceHash, sources, fetchRange, context) {
			let hash = {};
			for (let source of sources) hash[source.sourceId] = source;
			if (fetchRange) hash = fetchDirtySources(hash, fetchRange, context);
			return Object.assign(Object.assign({}, eventSourceHash), hash);
		}
		function removeSource(eventSourceHash, sourceId) {
			return internalCommon.filterHash(eventSourceHash, (eventSource) => eventSource.sourceId !== sourceId);
		}
		function fetchDirtySources(sourceHash, fetchRange, context) {
			return fetchSourcesByIds(sourceHash, internalCommon.filterHash(sourceHash, (eventSource) => isSourceDirty(eventSource, fetchRange, context)), fetchRange, false, context);
		}
		function isSourceDirty(eventSource, fetchRange, context) {
			if (!doesSourceNeedRange(eventSource, context)) return !eventSource.latestFetchId;
			return !context.options.lazyFetching || !eventSource.fetchRange || eventSource.isFetching || fetchRange.start < eventSource.fetchRange.start || fetchRange.end > eventSource.fetchRange.end;
		}
		function fetchSourcesByIds(prevSources, sourceIdHash, fetchRange, isRefetch, context) {
			let nextSources = {};
			for (let sourceId in prevSources) {
				let source = prevSources[sourceId];
				if (sourceIdHash[sourceId]) nextSources[sourceId] = fetchSource(source, fetchRange, isRefetch, context);
				else nextSources[sourceId] = source;
			}
			return nextSources;
		}
		function fetchSource(eventSource, fetchRange, isRefetch, context) {
			let { options, calendarApi } = context;
			let sourceDef = context.pluginHooks.eventSourceDefs[eventSource.sourceDefId];
			let fetchId = internalCommon.guid();
			sourceDef.fetch({
				eventSource,
				range: fetchRange,
				isRefetch,
				context
			}, (res) => {
				let { rawEvents } = res;
				if (options.eventSourceSuccess) rawEvents = options.eventSourceSuccess.call(calendarApi, rawEvents, res.response) || rawEvents;
				if (eventSource.success) rawEvents = eventSource.success.call(calendarApi, rawEvents, res.response) || rawEvents;
				context.dispatch({
					type: "RECEIVE_EVENTS",
					sourceId: eventSource.sourceId,
					fetchId,
					fetchRange,
					rawEvents
				});
			}, (error) => {
				let errorHandled = false;
				if (options.eventSourceFailure) {
					options.eventSourceFailure.call(calendarApi, error);
					errorHandled = true;
				}
				if (eventSource.failure) {
					eventSource.failure(error);
					errorHandled = true;
				}
				if (!errorHandled) console.warn(error.message, error);
				context.dispatch({
					type: "RECEIVE_EVENT_ERROR",
					sourceId: eventSource.sourceId,
					fetchId,
					fetchRange,
					error
				});
			});
			return Object.assign(Object.assign({}, eventSource), {
				isFetching: true,
				latestFetchId: fetchId
			});
		}
		function receiveResponse(sourceHash, sourceId, fetchId, fetchRange) {
			let eventSource = sourceHash[sourceId];
			if (eventSource && fetchId === eventSource.latestFetchId) return Object.assign(Object.assign({}, sourceHash), { [sourceId]: Object.assign(Object.assign({}, eventSource), {
				isFetching: false,
				fetchRange
			}) });
			return sourceHash;
		}
		function excludeStaticSources(eventSources, context) {
			return internalCommon.filterHash(eventSources, (eventSource) => doesSourceNeedRange(eventSource, context));
		}
		function parseInitialSources(rawOptions, context) {
			let refiners = internalCommon.buildEventSourceRefiners(context);
			let rawSources = [].concat(rawOptions.eventSources || []);
			let sources = [];
			if (rawOptions.initialEvents) rawSources.unshift(rawOptions.initialEvents);
			if (rawOptions.events) rawSources.unshift(rawOptions.events);
			for (let rawSource of rawSources) {
				let source = internalCommon.parseEventSource(rawSource, context, refiners);
				if (source) sources.push(source);
			}
			return sources;
		}
		function doesSourceNeedRange(eventSource, context) {
			return !context.pluginHooks.eventSourceDefs[eventSource.sourceDefId].ignoreRange;
		}
		function reduceDateSelection(currentSelection, action) {
			switch (action.type) {
				case "UNSELECT_DATES": return null;
				case "SELECT_DATES": return action.selection;
				default: return currentSelection;
			}
		}
		function reduceSelectedEvent(currentInstanceId, action) {
			switch (action.type) {
				case "UNSELECT_EVENT": return "";
				case "SELECT_EVENT": return action.eventInstanceId;
				default: return currentInstanceId;
			}
		}
		function reduceEventDrag(currentDrag, action) {
			let newDrag;
			switch (action.type) {
				case "UNSET_EVENT_DRAG": return null;
				case "SET_EVENT_DRAG":
					newDrag = action.state;
					return {
						affectedEvents: newDrag.affectedEvents,
						mutatedEvents: newDrag.mutatedEvents,
						isEvent: newDrag.isEvent
					};
				default: return currentDrag;
			}
		}
		function reduceEventResize(currentResize, action) {
			let newResize;
			switch (action.type) {
				case "UNSET_EVENT_RESIZE": return null;
				case "SET_EVENT_RESIZE":
					newResize = action.state;
					return {
						affectedEvents: newResize.affectedEvents,
						mutatedEvents: newResize.mutatedEvents,
						isEvent: newResize.isEvent
					};
				default: return currentResize;
			}
		}
		function parseToolbars(calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi) {
			return {
				header: calendarOptions.headerToolbar ? parseToolbar(calendarOptions.headerToolbar, calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi) : null,
				footer: calendarOptions.footerToolbar ? parseToolbar(calendarOptions.footerToolbar, calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi) : null
			};
		}
		function parseToolbar(sectionStrHash, calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi) {
			let sectionWidgets = {};
			let viewsWithButtons = [];
			let hasTitle = false;
			for (let sectionName in sectionStrHash) {
				let sectionStr = sectionStrHash[sectionName];
				let sectionRes = parseSection(sectionStr, calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi);
				sectionWidgets[sectionName] = sectionRes.widgets;
				viewsWithButtons.push(...sectionRes.viewsWithButtons);
				hasTitle = hasTitle || sectionRes.hasTitle;
			}
			return {
				sectionWidgets,
				viewsWithButtons,
				hasTitle
			};
		}
		function parseSection(sectionStr, calendarOptions, calendarOptionOverrides, theme, viewSpecs, calendarApi) {
			let isRtl = calendarOptions.direction === "rtl";
			let calendarCustomButtons = calendarOptions.customButtons || {};
			let calendarButtonTextOverrides = calendarOptionOverrides.buttonText || {};
			let calendarButtonText = calendarOptions.buttonText || {};
			let calendarButtonHintOverrides = calendarOptionOverrides.buttonHints || {};
			let calendarButtonHints = calendarOptions.buttonHints || {};
			let sectionSubstrs = sectionStr ? sectionStr.split(" ") : [];
			let viewsWithButtons = [];
			let hasTitle = false;
			return {
				widgets: sectionSubstrs.map((buttonGroupStr) => buttonGroupStr.split(",").map((buttonName) => {
					if (buttonName === "title") {
						hasTitle = true;
						return { buttonName };
					}
					let customButtonProps;
					let viewSpec;
					let buttonClick;
					let buttonIcon;
					let buttonText;
					let buttonHint;
					if (customButtonProps = calendarCustomButtons[buttonName]) {
						buttonClick = (ev) => {
							if (customButtonProps.click) customButtonProps.click.call(ev.target, ev, ev.target);
						};
						(buttonIcon = theme.getCustomButtonIconClass(customButtonProps)) || (buttonIcon = theme.getIconClass(buttonName, isRtl)) || (buttonText = customButtonProps.text);
						buttonHint = customButtonProps.hint || customButtonProps.text;
					} else if (viewSpec = viewSpecs[buttonName]) {
						viewsWithButtons.push(buttonName);
						buttonClick = () => {
							calendarApi.changeView(buttonName);
						};
						(buttonText = viewSpec.buttonTextOverride) || (buttonIcon = theme.getIconClass(buttonName, isRtl)) || (buttonText = viewSpec.buttonTextDefault);
						let textFallback = viewSpec.buttonTextOverride || viewSpec.buttonTextDefault;
						buttonHint = internalCommon.formatWithOrdinals(viewSpec.buttonTitleOverride || viewSpec.buttonTitleDefault || calendarOptions.viewHint, [textFallback, buttonName], textFallback);
					} else if (calendarApi[buttonName]) {
						buttonClick = () => {
							calendarApi[buttonName]();
						};
						(buttonText = calendarButtonTextOverrides[buttonName]) || (buttonIcon = theme.getIconClass(buttonName, isRtl)) || (buttonText = calendarButtonText[buttonName]);
						if (buttonName === "prevYear" || buttonName === "nextYear") {
							let prevOrNext = buttonName === "prevYear" ? "prev" : "next";
							buttonHint = internalCommon.formatWithOrdinals(calendarButtonHintOverrides[prevOrNext] || calendarButtonHints[prevOrNext], [calendarButtonText.year || "year", "year"], calendarButtonText[buttonName]);
						} else buttonHint = (navUnit) => internalCommon.formatWithOrdinals(calendarButtonHintOverrides[buttonName] || calendarButtonHints[buttonName], [calendarButtonText[navUnit] || navUnit, navUnit], calendarButtonText[buttonName]);
					}
					return {
						buttonName,
						buttonClick,
						buttonIcon,
						buttonText,
						buttonHint
					};
				})),
				viewsWithButtons,
				hasTitle
			};
		}
		var ViewImpl = class {
			constructor(type, getCurrentData, dateEnv) {
				this.type = type;
				this.getCurrentData = getCurrentData;
				this.dateEnv = dateEnv;
			}
			get calendar() {
				return this.getCurrentData().calendarApi;
			}
			get title() {
				return this.getCurrentData().viewTitle;
			}
			get activeStart() {
				return this.dateEnv.toDate(this.getCurrentData().dateProfile.activeRange.start);
			}
			get activeEnd() {
				return this.dateEnv.toDate(this.getCurrentData().dateProfile.activeRange.end);
			}
			get currentStart() {
				return this.dateEnv.toDate(this.getCurrentData().dateProfile.currentRange.start);
			}
			get currentEnd() {
				return this.dateEnv.toDate(this.getCurrentData().dateProfile.currentRange.end);
			}
			getOption(name) {
				return this.getCurrentData().options[name];
			}
		};
		const arrayEventSourcePlugin = createPlugin({
			name: "array-event-source",
			eventSourceDefs: [{
				ignoreRange: true,
				parseMeta(refined) {
					if (Array.isArray(refined.events)) return refined.events;
					return null;
				},
				fetch(arg, successCallback) {
					successCallback({ rawEvents: arg.eventSource.meta });
				}
			}]
		});
		const funcEventSourcePlugin = createPlugin({
			name: "func-event-source",
			eventSourceDefs: [{
				parseMeta(refined) {
					if (typeof refined.events === "function") return refined.events;
					return null;
				},
				fetch(arg, successCallback, errorCallback) {
					const { dateEnv } = arg.context;
					const func = arg.eventSource.meta;
					internalCommon.unpromisify(func.bind(null, internalCommon.buildRangeApiWithTimeZone(arg.range, dateEnv)), (rawEvents) => successCallback({ rawEvents }), errorCallback);
				}
			}]
		});
		const jsonFeedEventSourcePlugin = createPlugin({
			name: "json-event-source",
			eventSourceRefiners: {
				method: String,
				extraParams: internalCommon.identity,
				startParam: String,
				endParam: String,
				timeZoneParam: String
			},
			eventSourceDefs: [{
				parseMeta(refined) {
					if (refined.url && (refined.format === "json" || !refined.format)) return {
						url: refined.url,
						format: "json",
						method: (refined.method || "GET").toUpperCase(),
						extraParams: refined.extraParams,
						startParam: refined.startParam,
						endParam: refined.endParam,
						timeZoneParam: refined.timeZoneParam
					};
					return null;
				},
				fetch(arg, successCallback, errorCallback) {
					const { meta } = arg.eventSource;
					const requestParams = buildRequestParams(meta, arg.range, arg.context);
					internalCommon.requestJson(meta.method, meta.url, requestParams).then(([rawEvents, response]) => {
						successCallback({
							rawEvents,
							response
						});
					}, errorCallback);
				}
			}]
		});
		function buildRequestParams(meta, range, context) {
			let { dateEnv, options } = context;
			let startParam;
			let endParam;
			let timeZoneParam;
			let customRequestParams;
			let params = {};
			startParam = meta.startParam;
			if (startParam == null) startParam = options.startParam;
			endParam = meta.endParam;
			if (endParam == null) endParam = options.endParam;
			timeZoneParam = meta.timeZoneParam;
			if (timeZoneParam == null) timeZoneParam = options.timeZoneParam;
			if (typeof meta.extraParams === "function") customRequestParams = meta.extraParams();
			else customRequestParams = meta.extraParams || {};
			Object.assign(params, customRequestParams);
			params[startParam] = dateEnv.formatIso(range.start);
			params[endParam] = dateEnv.formatIso(range.end);
			if (dateEnv.timeZone !== "local") params[timeZoneParam] = dateEnv.timeZone;
			return params;
		}
		const simpleRecurringEventsPlugin = createPlugin({
			name: "simple-recurring-event",
			recurringTypes: [{
				parse(refined, dateEnv) {
					if (refined.daysOfWeek || refined.startTime || refined.endTime || refined.startRecur || refined.endRecur) {
						let recurringData = {
							daysOfWeek: refined.daysOfWeek || null,
							startTime: refined.startTime || null,
							endTime: refined.endTime || null,
							startRecur: refined.startRecur ? dateEnv.createMarker(refined.startRecur) : null,
							endRecur: refined.endRecur ? dateEnv.createMarker(refined.endRecur) : null,
							dateEnv
						};
						let duration;
						if (refined.duration) duration = refined.duration;
						if (!duration && refined.startTime && refined.endTime) duration = internalCommon.subtractDurations(refined.endTime, refined.startTime);
						return {
							allDayGuess: Boolean(!refined.startTime && !refined.endTime),
							duration,
							typeData: recurringData
						};
					}
					return null;
				},
				expand(typeData, framingRange, dateEnv) {
					let clippedFramingRange = internalCommon.intersectRanges(framingRange, {
						start: typeData.startRecur,
						end: typeData.endRecur
					});
					if (clippedFramingRange) return expandRanges(typeData.daysOfWeek, typeData.startTime, typeData.dateEnv, dateEnv, clippedFramingRange);
					return [];
				}
			}],
			eventRefiners: {
				daysOfWeek: internalCommon.identity,
				startTime: internalCommon.createDuration,
				endTime: internalCommon.createDuration,
				duration: internalCommon.createDuration,
				startRecur: internalCommon.identity,
				endRecur: internalCommon.identity
			}
		});
		function expandRanges(daysOfWeek, startTime, eventDateEnv, calendarDateEnv, framingRange) {
			let dowHash = daysOfWeek ? internalCommon.arrayToHash(daysOfWeek) : null;
			let dayMarker = internalCommon.startOfDay(framingRange.start);
			let endMarker = framingRange.end;
			let instanceStarts = [];
			if (startTime) {
				if (startTime.milliseconds < 0) endMarker = internalCommon.addDays(endMarker, 1);
				else if (startTime.milliseconds >= 864e5) dayMarker = internalCommon.addDays(dayMarker, -1);
			}
			while (dayMarker < endMarker) {
				let instanceStart;
				if (!dowHash || dowHash[dayMarker.getUTCDay()]) {
					if (startTime) instanceStart = calendarDateEnv.add(dayMarker, startTime);
					else instanceStart = dayMarker;
					instanceStarts.push(calendarDateEnv.createMarker(eventDateEnv.toDate(instanceStart)));
				}
				dayMarker = internalCommon.addDays(dayMarker, 1);
			}
			return instanceStarts;
		}
		const changeHandlerPlugin = createPlugin({
			name: "change-handler",
			optionChangeHandlers: {
				events(events, context) {
					handleEventSources([events], context);
				},
				eventSources: handleEventSources
			}
		});
		function handleEventSources(inputs, context) {
			let unfoundSources = internalCommon.hashValuesToArray(context.getCurrentData().eventSources);
			if (unfoundSources.length === 1 && inputs.length === 1 && Array.isArray(unfoundSources[0]._raw) && Array.isArray(inputs[0])) {
				context.dispatch({
					type: "RESET_RAW_EVENTS",
					sourceId: unfoundSources[0].sourceId,
					rawEvents: inputs[0]
				});
				return;
			}
			let newInputs = [];
			for (let input of inputs) {
				let inputFound = false;
				for (let i = 0; i < unfoundSources.length; i += 1) if (unfoundSources[i]._raw === input) {
					unfoundSources.splice(i, 1);
					inputFound = true;
					break;
				}
				if (!inputFound) newInputs.push(input);
			}
			for (let unfoundSource of unfoundSources) context.dispatch({
				type: "REMOVE_EVENT_SOURCE",
				sourceId: unfoundSource.sourceId
			});
			for (let newInput of newInputs) context.calendarApi.addEventSource(newInput);
		}
		function handleDateProfile(dateProfile, context) {
			context.emitter.trigger("datesSet", Object.assign(Object.assign({}, internalCommon.buildRangeApiWithTimeZone(dateProfile.activeRange, context.dateEnv)), { view: context.viewApi }));
		}
		function handleEventStore(eventStore, context) {
			let { emitter } = context;
			if (emitter.hasHandlers("eventsSet")) emitter.trigger("eventsSet", internalCommon.buildEventApis(eventStore, context));
		}
		const globalPlugins = [
			arrayEventSourcePlugin,
			funcEventSourcePlugin,
			jsonFeedEventSourcePlugin,
			simpleRecurringEventsPlugin,
			changeHandlerPlugin,
			createPlugin({
				name: "misc",
				isLoadingFuncs: [(state) => computeEventSourcesLoading(state.eventSources)],
				propSetHandlers: {
					dateProfile: handleDateProfile,
					eventStore: handleEventStore
				}
			})
		];
		var TaskRunner = class {
			constructor(runTaskOption, drainedOption) {
				this.runTaskOption = runTaskOption;
				this.drainedOption = drainedOption;
				this.queue = [];
				this.delayedRunner = new internalCommon.DelayedRunner(this.drain.bind(this));
			}
			request(task, delay) {
				this.queue.push(task);
				this.delayedRunner.request(delay);
			}
			pause(scope) {
				this.delayedRunner.pause(scope);
			}
			resume(scope, force) {
				this.delayedRunner.resume(scope, force);
			}
			drain() {
				let { queue } = this;
				while (queue.length) {
					let completedTasks = [];
					let task;
					while (task = queue.shift()) {
						this.runTask(task);
						completedTasks.push(task);
					}
					this.drained(completedTasks);
				}
			}
			runTask(task) {
				if (this.runTaskOption) this.runTaskOption(task);
			}
			drained(completedTasks) {
				if (this.drainedOption) this.drainedOption(completedTasks);
			}
		};
		function buildTitle(dateProfile, viewOptions, dateEnv) {
			let range;
			if (/^(year|month)$/.test(dateProfile.currentRangeUnit)) range = dateProfile.currentRange;
			else range = dateProfile.activeRange;
			return dateEnv.formatRange(range.start, range.end, internalCommon.createFormatter(viewOptions.titleFormat || buildTitleFormat(dateProfile)), {
				isEndExclusive: dateProfile.isRangeAllDay,
				defaultSeparator: viewOptions.titleRangeSeparator
			});
		}
		function buildTitleFormat(dateProfile) {
			let { currentRangeUnit } = dateProfile;
			if (currentRangeUnit === "year") return { year: "numeric" };
			if (currentRangeUnit === "month") return {
				year: "numeric",
				month: "long"
			};
			let days = internalCommon.diffWholeDays(dateProfile.currentRange.start, dateProfile.currentRange.end);
			if (days !== null && days > 1) return {
				year: "numeric",
				month: "short",
				day: "numeric"
			};
			return {
				year: "numeric",
				month: "long",
				day: "numeric"
			};
		}
		var CalendarNowManager = class {
			constructor() {
				this.resetListeners = /* @__PURE__ */ new Set();
			}
			handleInput(dateEnv, nowInput) {
				const oldDateEnv = this.dateEnv;
				if (dateEnv !== oldDateEnv) {
					if (typeof nowInput === "function") this.nowFn = nowInput;
					else if (!oldDateEnv) {
						this.nowAnchorDate = dateEnv.toDate(nowInput ? dateEnv.createMarker(nowInput) : dateEnv.createNowMarker());
						this.nowAnchorQueried = Date.now();
					}
					this.dateEnv = dateEnv;
					if (oldDateEnv) for (const resetListener of this.resetListeners.values()) resetListener();
				}
			}
			getDateMarker() {
				return this.nowAnchorDate ? this.dateEnv.timestampToMarker(this.nowAnchorDate.valueOf() + (Date.now() - this.nowAnchorQueried)) : this.dateEnv.createMarker(this.nowFn());
			}
			addResetListener(handler) {
				this.resetListeners.add(handler);
			}
			removeResetListener(handler) {
				this.resetListeners.delete(handler);
			}
		};
		var CalendarDataManager = class {
			constructor(props) {
				this.computeCurrentViewData = internalCommon.memoize(this._computeCurrentViewData);
				this.organizeRawLocales = internalCommon.memoize(organizeRawLocales);
				this.buildLocale = internalCommon.memoize(buildLocale);
				this.buildPluginHooks = buildBuildPluginHooks();
				this.buildDateEnv = internalCommon.memoize(buildDateEnv$1);
				this.buildTheme = internalCommon.memoize(buildTheme);
				this.parseToolbars = internalCommon.memoize(parseToolbars);
				this.buildViewSpecs = internalCommon.memoize(buildViewSpecs);
				this.buildDateProfileGenerator = internalCommon.memoizeObjArg(buildDateProfileGenerator);
				this.buildViewApi = internalCommon.memoize(buildViewApi);
				this.buildViewUiProps = internalCommon.memoizeObjArg(buildViewUiProps);
				this.buildEventUiBySource = internalCommon.memoize(buildEventUiBySource, internalCommon.isPropsEqual);
				this.buildEventUiBases = internalCommon.memoize(buildEventUiBases);
				this.parseContextBusinessHours = internalCommon.memoizeObjArg(parseContextBusinessHours);
				this.buildTitle = internalCommon.memoize(buildTitle);
				this.nowManager = new CalendarNowManager();
				this.emitter = new internalCommon.Emitter();
				this.actionRunner = new TaskRunner(this._handleAction.bind(this), this.updateData.bind(this));
				this.currentCalendarOptionsInput = {};
				this.currentCalendarOptionsRefined = {};
				this.currentViewOptionsInput = {};
				this.currentViewOptionsRefined = {};
				this.currentCalendarOptionsRefiners = {};
				this.optionsForRefining = [];
				this.optionsForHandling = [];
				this.getCurrentData = () => this.data;
				this.dispatch = (action) => {
					this.actionRunner.request(action);
				};
				this.props = props;
				this.actionRunner.pause();
				this.nowManager = new CalendarNowManager();
				let dynamicOptionOverrides = {};
				let optionsData = this.computeOptionsData(props.optionOverrides, dynamicOptionOverrides, props.calendarApi);
				let currentViewType = optionsData.calendarOptions.initialView || optionsData.pluginHooks.initialView;
				let currentViewData = this.computeCurrentViewData(currentViewType, optionsData, props.optionOverrides, dynamicOptionOverrides);
				props.calendarApi.currentDataManager = this;
				this.emitter.setThisContext(props.calendarApi);
				this.emitter.setOptions(currentViewData.options);
				let calendarContext = {
					nowManager: this.nowManager,
					dateEnv: optionsData.dateEnv,
					options: optionsData.calendarOptions,
					pluginHooks: optionsData.pluginHooks,
					calendarApi: props.calendarApi,
					dispatch: this.dispatch,
					emitter: this.emitter,
					getCurrentData: this.getCurrentData
				};
				let currentDate = getInitialDate(optionsData.calendarOptions, optionsData.dateEnv, this.nowManager);
				let dateProfile = currentViewData.dateProfileGenerator.build(currentDate);
				if (!internalCommon.rangeContainsMarker(dateProfile.activeRange, currentDate)) currentDate = dateProfile.currentRange.start;
				for (let callback of optionsData.pluginHooks.contextInit) callback(calendarContext);
				let eventSources = initEventSources(optionsData.calendarOptions, dateProfile, calendarContext);
				let initialState = {
					dynamicOptionOverrides,
					currentViewType,
					currentDate,
					dateProfile,
					businessHours: this.parseContextBusinessHours(calendarContext),
					eventSources,
					eventUiBases: {},
					eventStore: internalCommon.createEmptyEventStore(),
					renderableEventStore: internalCommon.createEmptyEventStore(),
					dateSelection: null,
					eventSelection: "",
					eventDrag: null,
					eventResize: null,
					selectionConfig: this.buildViewUiProps(calendarContext).selectionConfig
				};
				let contextAndState = Object.assign(Object.assign({}, calendarContext), initialState);
				for (let reducer of optionsData.pluginHooks.reducers) Object.assign(initialState, reducer(null, null, contextAndState));
				if (computeIsLoading(initialState, calendarContext)) this.emitter.trigger("loading", true);
				this.state = initialState;
				this.updateData();
				this.actionRunner.resume();
			}
			resetOptions(optionOverrides, changedOptionNames) {
				let { props } = this;
				if (changedOptionNames === void 0) props.optionOverrides = optionOverrides;
				else {
					props.optionOverrides = Object.assign(Object.assign({}, props.optionOverrides || {}), optionOverrides);
					this.optionsForRefining.push(...changedOptionNames);
				}
				if (changedOptionNames === void 0 || changedOptionNames.length) this.actionRunner.request({ type: "NOTHING" });
			}
			_handleAction(action) {
				let { props, state, emitter } = this;
				let dynamicOptionOverrides = reduceDynamicOptionOverrides(state.dynamicOptionOverrides, action);
				let optionsData = this.computeOptionsData(props.optionOverrides, dynamicOptionOverrides, props.calendarApi);
				let currentViewType = reduceViewType(state.currentViewType, action);
				let currentViewData = this.computeCurrentViewData(currentViewType, optionsData, props.optionOverrides, dynamicOptionOverrides);
				props.calendarApi.currentDataManager = this;
				emitter.setThisContext(props.calendarApi);
				emitter.setOptions(currentViewData.options);
				let calendarContext = {
					nowManager: this.nowManager,
					dateEnv: optionsData.dateEnv,
					options: optionsData.calendarOptions,
					pluginHooks: optionsData.pluginHooks,
					calendarApi: props.calendarApi,
					dispatch: this.dispatch,
					emitter,
					getCurrentData: this.getCurrentData
				};
				let { currentDate, dateProfile } = state;
				if (this.data && this.data.dateProfileGenerator !== currentViewData.dateProfileGenerator) dateProfile = currentViewData.dateProfileGenerator.build(currentDate);
				currentDate = reduceCurrentDate(currentDate, action);
				dateProfile = reduceDateProfile(dateProfile, action, currentDate, currentViewData.dateProfileGenerator);
				if (action.type === "PREV" || action.type === "NEXT" || !internalCommon.rangeContainsMarker(dateProfile.currentRange, currentDate)) currentDate = dateProfile.currentRange.start;
				let eventSources = reduceEventSources(state.eventSources, action, dateProfile, calendarContext);
				let eventStore = internalCommon.reduceEventStore(state.eventStore, action, eventSources, dateProfile, calendarContext);
				let renderableEventStore = computeEventSourcesLoading(eventSources) && !currentViewData.options.progressiveEventRendering ? state.renderableEventStore || eventStore : eventStore;
				let { eventUiSingleBase, selectionConfig } = this.buildViewUiProps(calendarContext);
				let eventUiBySource = this.buildEventUiBySource(eventSources);
				let eventUiBases = this.buildEventUiBases(renderableEventStore.defs, eventUiSingleBase, eventUiBySource);
				let newState = {
					dynamicOptionOverrides,
					currentViewType,
					currentDate,
					dateProfile,
					eventSources,
					eventStore,
					renderableEventStore,
					selectionConfig,
					eventUiBases,
					businessHours: this.parseContextBusinessHours(calendarContext),
					dateSelection: reduceDateSelection(state.dateSelection, action),
					eventSelection: reduceSelectedEvent(state.eventSelection, action),
					eventDrag: reduceEventDrag(state.eventDrag, action),
					eventResize: reduceEventResize(state.eventResize, action)
				};
				let contextAndState = Object.assign(Object.assign({}, calendarContext), newState);
				for (let reducer of optionsData.pluginHooks.reducers) Object.assign(newState, reducer(state, action, contextAndState));
				let wasLoading = computeIsLoading(state, calendarContext);
				let isLoading = computeIsLoading(newState, calendarContext);
				if (!wasLoading && isLoading) emitter.trigger("loading", true);
				else if (wasLoading && !isLoading) emitter.trigger("loading", false);
				this.state = newState;
				if (props.onAction) props.onAction(action);
			}
			updateData() {
				let { props, state } = this;
				let oldData = this.data;
				let optionsData = this.computeOptionsData(props.optionOverrides, state.dynamicOptionOverrides, props.calendarApi);
				let currentViewData = this.computeCurrentViewData(state.currentViewType, optionsData, props.optionOverrides, state.dynamicOptionOverrides);
				let data = this.data = Object.assign(Object.assign(Object.assign({
					nowManager: this.nowManager,
					viewTitle: this.buildTitle(state.dateProfile, currentViewData.options, optionsData.dateEnv),
					calendarApi: props.calendarApi,
					dispatch: this.dispatch,
					emitter: this.emitter,
					getCurrentData: this.getCurrentData
				}, optionsData), currentViewData), state);
				let changeHandlers = optionsData.pluginHooks.optionChangeHandlers;
				let oldCalendarOptions = oldData && oldData.calendarOptions;
				let newCalendarOptions = optionsData.calendarOptions;
				if (oldCalendarOptions && oldCalendarOptions !== newCalendarOptions) {
					if (oldCalendarOptions.timeZone !== newCalendarOptions.timeZone) {
						state.eventSources = data.eventSources = reduceEventSourcesNewTimeZone(data.eventSources, state.dateProfile, data);
						state.eventStore = data.eventStore = internalCommon.rezoneEventStoreDates(data.eventStore, oldData.dateEnv, data.dateEnv);
						state.renderableEventStore = data.renderableEventStore = internalCommon.rezoneEventStoreDates(data.renderableEventStore, oldData.dateEnv, data.dateEnv);
					}
					for (let optionName in changeHandlers) if (this.optionsForHandling.indexOf(optionName) !== -1 || oldCalendarOptions[optionName] !== newCalendarOptions[optionName]) changeHandlers[optionName](newCalendarOptions[optionName], data);
				}
				this.optionsForHandling = [];
				if (props.onData) props.onData(data);
			}
			computeOptionsData(optionOverrides, dynamicOptionOverrides, calendarApi) {
				if (!this.optionsForRefining.length && optionOverrides === this.stableOptionOverrides && dynamicOptionOverrides === this.stableDynamicOptionOverrides) return this.stableCalendarOptionsData;
				let { refinedOptions, pluginHooks, localeDefaults, availableLocaleData, extra } = this.processRawCalendarOptions(optionOverrides, dynamicOptionOverrides);
				warnUnknownOptions(extra);
				let dateEnv = this.buildDateEnv(refinedOptions.timeZone, refinedOptions.locale, refinedOptions.weekNumberCalculation, refinedOptions.firstDay, refinedOptions.weekText, pluginHooks, availableLocaleData, refinedOptions.defaultRangeSeparator);
				let viewSpecs = this.buildViewSpecs(pluginHooks.views, this.stableOptionOverrides, this.stableDynamicOptionOverrides, localeDefaults);
				let theme = this.buildTheme(refinedOptions, pluginHooks);
				let toolbarConfig = this.parseToolbars(refinedOptions, this.stableOptionOverrides, theme, viewSpecs, calendarApi);
				return this.stableCalendarOptionsData = {
					calendarOptions: refinedOptions,
					pluginHooks,
					dateEnv,
					viewSpecs,
					theme,
					toolbarConfig,
					localeDefaults,
					availableRawLocales: availableLocaleData.map
				};
			}
			processRawCalendarOptions(optionOverrides, dynamicOptionOverrides) {
				let { locales, locale } = internalCommon.mergeRawOptions([
					internalCommon.BASE_OPTION_DEFAULTS,
					optionOverrides,
					dynamicOptionOverrides
				]);
				let availableLocaleData = this.organizeRawLocales(locales);
				let availableRawLocales = availableLocaleData.map;
				let localeDefaults = this.buildLocale(locale || availableLocaleData.defaultCode, availableRawLocales).options;
				let pluginHooks = this.buildPluginHooks(optionOverrides.plugins || [], globalPlugins);
				let refiners = this.currentCalendarOptionsRefiners = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, internalCommon.BASE_OPTION_REFINERS), internalCommon.CALENDAR_LISTENER_REFINERS), internalCommon.CALENDAR_OPTION_REFINERS), pluginHooks.listenerRefiners), pluginHooks.optionRefiners);
				let extra = {};
				let raw = internalCommon.mergeRawOptions([
					internalCommon.BASE_OPTION_DEFAULTS,
					localeDefaults,
					optionOverrides,
					dynamicOptionOverrides
				]);
				let refined = {};
				let currentRaw = this.currentCalendarOptionsInput;
				let currentRefined = this.currentCalendarOptionsRefined;
				let anyChanges = false;
				for (let optionName in raw) if (this.optionsForRefining.indexOf(optionName) === -1 && (raw[optionName] === currentRaw[optionName] || internalCommon.COMPLEX_OPTION_COMPARATORS[optionName] && optionName in currentRaw && internalCommon.COMPLEX_OPTION_COMPARATORS[optionName](currentRaw[optionName], raw[optionName]))) refined[optionName] = currentRefined[optionName];
				else if (refiners[optionName]) {
					refined[optionName] = refiners[optionName](raw[optionName]);
					anyChanges = true;
				} else extra[optionName] = currentRaw[optionName];
				if (anyChanges) {
					this.currentCalendarOptionsInput = raw;
					this.currentCalendarOptionsRefined = refined;
					this.stableOptionOverrides = optionOverrides;
					this.stableDynamicOptionOverrides = dynamicOptionOverrides;
				}
				this.optionsForHandling.push(...this.optionsForRefining);
				this.optionsForRefining = [];
				return {
					rawOptions: this.currentCalendarOptionsInput,
					refinedOptions: this.currentCalendarOptionsRefined,
					pluginHooks,
					availableLocaleData,
					localeDefaults,
					extra
				};
			}
			_computeCurrentViewData(viewType, optionsData, optionOverrides, dynamicOptionOverrides) {
				let viewSpec = optionsData.viewSpecs[viewType];
				if (!viewSpec) throw new Error(`viewType "${viewType}" is not available. Please make sure you've loaded all neccessary plugins`);
				let { refinedOptions, extra } = this.processRawViewOptions(viewSpec, optionsData.pluginHooks, optionsData.localeDefaults, optionOverrides, dynamicOptionOverrides);
				warnUnknownOptions(extra);
				this.nowManager.handleInput(optionsData.dateEnv, refinedOptions.now);
				return {
					viewSpec,
					options: refinedOptions,
					dateProfileGenerator: this.buildDateProfileGenerator({
						dateProfileGeneratorClass: viewSpec.optionDefaults.dateProfileGeneratorClass,
						nowManager: this.nowManager,
						duration: viewSpec.duration,
						durationUnit: viewSpec.durationUnit,
						usesMinMaxTime: viewSpec.optionDefaults.usesMinMaxTime,
						dateEnv: optionsData.dateEnv,
						calendarApi: this.props.calendarApi,
						slotMinTime: refinedOptions.slotMinTime,
						slotMaxTime: refinedOptions.slotMaxTime,
						showNonCurrentDates: refinedOptions.showNonCurrentDates,
						dayCount: refinedOptions.dayCount,
						dateAlignment: refinedOptions.dateAlignment,
						dateIncrement: refinedOptions.dateIncrement,
						hiddenDays: refinedOptions.hiddenDays,
						weekends: refinedOptions.weekends,
						validRangeInput: refinedOptions.validRange,
						visibleRangeInput: refinedOptions.visibleRange,
						fixedWeekCount: refinedOptions.fixedWeekCount
					}),
					viewApi: this.buildViewApi(viewType, this.getCurrentData, optionsData.dateEnv)
				};
			}
			processRawViewOptions(viewSpec, pluginHooks, localeDefaults, optionOverrides, dynamicOptionOverrides) {
				let raw = internalCommon.mergeRawOptions([
					internalCommon.BASE_OPTION_DEFAULTS,
					viewSpec.optionDefaults,
					localeDefaults,
					optionOverrides,
					viewSpec.optionOverrides,
					dynamicOptionOverrides
				]);
				let refiners = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, internalCommon.BASE_OPTION_REFINERS), internalCommon.CALENDAR_LISTENER_REFINERS), internalCommon.CALENDAR_OPTION_REFINERS), internalCommon.VIEW_OPTION_REFINERS), pluginHooks.listenerRefiners), pluginHooks.optionRefiners);
				let refined = {};
				let currentRaw = this.currentViewOptionsInput;
				let currentRefined = this.currentViewOptionsRefined;
				let anyChanges = false;
				let extra = {};
				for (let optionName in raw) if (raw[optionName] === currentRaw[optionName] || internalCommon.COMPLEX_OPTION_COMPARATORS[optionName] && internalCommon.COMPLEX_OPTION_COMPARATORS[optionName](raw[optionName], currentRaw[optionName])) refined[optionName] = currentRefined[optionName];
				else {
					if (raw[optionName] === this.currentCalendarOptionsInput[optionName] || internalCommon.COMPLEX_OPTION_COMPARATORS[optionName] && internalCommon.COMPLEX_OPTION_COMPARATORS[optionName](raw[optionName], this.currentCalendarOptionsInput[optionName])) {
						if (optionName in this.currentCalendarOptionsRefined) refined[optionName] = this.currentCalendarOptionsRefined[optionName];
					} else if (refiners[optionName]) refined[optionName] = refiners[optionName](raw[optionName]);
					else extra[optionName] = raw[optionName];
					anyChanges = true;
				}
				if (anyChanges) {
					this.currentViewOptionsInput = raw;
					this.currentViewOptionsRefined = refined;
				}
				return {
					rawOptions: this.currentViewOptionsInput,
					refinedOptions: this.currentViewOptionsRefined,
					extra
				};
			}
		};
		function buildDateEnv$1(timeZone, explicitLocale, weekNumberCalculation, firstDay, weekText, pluginHooks, availableLocaleData, defaultSeparator) {
			let locale = buildLocale(explicitLocale || availableLocaleData.defaultCode, availableLocaleData.map);
			return new internalCommon.DateEnv({
				calendarSystem: "gregory",
				timeZone,
				namedTimeZoneImpl: pluginHooks.namedTimeZonedImpl,
				locale,
				weekNumberCalculation,
				firstDay,
				weekText,
				cmdFormatter: pluginHooks.cmdFormatter,
				defaultSeparator
			});
		}
		function buildTheme(options, pluginHooks) {
			return new (pluginHooks.themeClasses[options.themeSystem] || StandardTheme)(options);
		}
		function buildDateProfileGenerator(props) {
			return new (props.dateProfileGeneratorClass || internalCommon.DateProfileGenerator)(props);
		}
		function buildViewApi(type, getCurrentData, dateEnv) {
			return new ViewImpl(type, getCurrentData, dateEnv);
		}
		function buildEventUiBySource(eventSources) {
			return internalCommon.mapHash(eventSources, (eventSource) => eventSource.ui);
		}
		function buildEventUiBases(eventDefs, eventUiSingleBase, eventUiBySource) {
			let eventUiBases = { "": eventUiSingleBase };
			for (let defId in eventDefs) {
				let def = eventDefs[defId];
				if (def.sourceId && eventUiBySource[def.sourceId]) eventUiBases[defId] = eventUiBySource[def.sourceId];
			}
			return eventUiBases;
		}
		function buildViewUiProps(calendarContext) {
			let { options } = calendarContext;
			return {
				eventUiSingleBase: internalCommon.createEventUi({
					display: options.eventDisplay,
					editable: options.editable,
					startEditable: options.eventStartEditable,
					durationEditable: options.eventDurationEditable,
					constraint: options.eventConstraint,
					overlap: typeof options.eventOverlap === "boolean" ? options.eventOverlap : void 0,
					allow: options.eventAllow,
					backgroundColor: options.eventBackgroundColor,
					borderColor: options.eventBorderColor,
					textColor: options.eventTextColor,
					color: options.eventColor
				}, calendarContext),
				selectionConfig: internalCommon.createEventUi({
					constraint: options.selectConstraint,
					overlap: typeof options.selectOverlap === "boolean" ? options.selectOverlap : void 0,
					allow: options.selectAllow
				}, calendarContext)
			};
		}
		function computeIsLoading(state, context) {
			for (let isLoadingFunc of context.pluginHooks.isLoadingFuncs) if (isLoadingFunc(state)) return true;
			return false;
		}
		function parseContextBusinessHours(calendarContext) {
			return internalCommon.parseBusinessHours(calendarContext.options.businessHours, calendarContext);
		}
		function warnUnknownOptions(options, viewName) {
			for (let optionName in options) console.warn(`Unknown option '${optionName}'` + (viewName ? ` for view '${viewName}'` : ""));
		}
		var ToolbarSection = class extends internalCommon.BaseComponent {
			render() {
				let children = this.props.widgetGroups.map((widgetGroup) => this.renderWidgetGroup(widgetGroup));
				return preact.createElement("div", { className: "fc-toolbar-chunk" }, ...children);
			}
			renderWidgetGroup(widgetGroup) {
				let { props } = this;
				let { theme } = this.context;
				let children = [];
				let isOnlyButtons = true;
				for (let widget of widgetGroup) {
					let { buttonName, buttonClick, buttonText, buttonIcon, buttonHint } = widget;
					if (buttonName === "title") {
						isOnlyButtons = false;
						children.push(preact.createElement("h2", {
							className: "fc-toolbar-title",
							id: props.titleId
						}, props.title));
					} else {
						let isPressed = buttonName === props.activeButton;
						let isDisabled = !props.isTodayEnabled && buttonName === "today" || !props.isPrevEnabled && buttonName === "prev" || !props.isNextEnabled && buttonName === "next";
						let buttonClasses = [`fc-${buttonName}-button`, theme.getClass("button")];
						if (isPressed) buttonClasses.push(theme.getClass("buttonActive"));
						children.push(preact.createElement("button", {
							type: "button",
							title: typeof buttonHint === "function" ? buttonHint(props.navUnit) : buttonHint,
							disabled: isDisabled,
							"aria-pressed": isPressed,
							className: buttonClasses.join(" "),
							onClick: buttonClick
						}, buttonText || (buttonIcon ? preact.createElement("span", {
							className: buttonIcon,
							role: "img"
						}) : "")));
					}
				}
				if (children.length > 1) {
					let groupClassName = isOnlyButtons && theme.getClass("buttonGroup") || "";
					return preact.createElement("div", { className: groupClassName }, ...children);
				}
				return children[0];
			}
		};
		var Toolbar = class extends internalCommon.BaseComponent {
			render() {
				let { model, extraClassName } = this.props;
				let forceLtr = false;
				let startContent;
				let endContent;
				let sectionWidgets = model.sectionWidgets;
				let centerContent = sectionWidgets.center;
				if (sectionWidgets.left) {
					forceLtr = true;
					startContent = sectionWidgets.left;
				} else startContent = sectionWidgets.start;
				if (sectionWidgets.right) {
					forceLtr = true;
					endContent = sectionWidgets.right;
				} else endContent = sectionWidgets.end;
				let classNames = [
					extraClassName || "",
					"fc-toolbar",
					forceLtr ? "fc-toolbar-ltr" : ""
				];
				return preact.createElement("div", { className: classNames.join(" ") }, this.renderSection("start", startContent || []), this.renderSection("center", centerContent || []), this.renderSection("end", endContent || []));
			}
			renderSection(key, widgetGroups) {
				let { props } = this;
				return preact.createElement(ToolbarSection, {
					key,
					widgetGroups,
					title: props.title,
					navUnit: props.navUnit,
					activeButton: props.activeButton,
					isTodayEnabled: props.isTodayEnabled,
					isPrevEnabled: props.isPrevEnabled,
					isNextEnabled: props.isNextEnabled,
					titleId: props.titleId
				});
			}
		};
		var ViewHarness = class extends internalCommon.BaseComponent {
			constructor() {
				super(...arguments);
				this.state = { availableWidth: null };
				this.handleEl = (el) => {
					this.el = el;
					internalCommon.setRef(this.props.elRef, el);
					this.updateAvailableWidth();
				};
				this.handleResize = () => {
					this.updateAvailableWidth();
				};
			}
			render() {
				let { props, state } = this;
				let { aspectRatio } = props;
				let classNames = ["fc-view-harness", aspectRatio || props.liquid || props.height ? "fc-view-harness-active" : "fc-view-harness-passive"];
				let height = "";
				let paddingBottom = "";
				if (aspectRatio) {
					if (state.availableWidth !== null) height = state.availableWidth / aspectRatio;
					else paddingBottom = `${1 / aspectRatio * 100}%`;
				} else height = props.height || "";
				return preact.createElement("div", {
					"aria-labelledby": props.labeledById,
					ref: this.handleEl,
					className: classNames.join(" "),
					style: {
						height,
						paddingBottom
					}
				}, props.children);
			}
			componentDidMount() {
				this.context.addResizeHandler(this.handleResize);
			}
			componentWillUnmount() {
				this.context.removeResizeHandler(this.handleResize);
			}
			updateAvailableWidth() {
				if (this.el && this.props.aspectRatio) this.setState({ availableWidth: this.el.offsetWidth });
			}
		};
		var EventClicking = class extends internalCommon.Interaction {
			constructor(settings) {
				super(settings);
				this.handleSegClick = (ev, segEl) => {
					let { component } = this;
					let { context } = component;
					let seg = internalCommon.getElSeg(segEl);
					if (seg && component.isValidSegDownEl(ev.target)) {
						let hasUrlContainer = internalCommon.elementClosest(ev.target, ".fc-event-forced-url");
						let url = hasUrlContainer ? hasUrlContainer.querySelector("a[href]").href : "";
						context.emitter.trigger("eventClick", {
							el: segEl,
							event: new internalCommon.EventImpl(component.context, seg.eventRange.def, seg.eventRange.instance),
							jsEvent: ev,
							view: context.viewApi
						});
						if (url && !ev.defaultPrevented) window.location.href = url;
					}
				};
				this.destroy = internalCommon.listenBySelector(settings.el, "click", ".fc-event", this.handleSegClick);
			}
		};
		var EventHovering = class extends internalCommon.Interaction {
			constructor(settings) {
				super(settings);
				this.handleEventElRemove = (el) => {
					if (el === this.currentSegEl) this.handleSegLeave(null, this.currentSegEl);
				};
				this.handleSegEnter = (ev, segEl) => {
					if (internalCommon.getElSeg(segEl)) {
						this.currentSegEl = segEl;
						this.triggerEvent("eventMouseEnter", ev, segEl);
					}
				};
				this.handleSegLeave = (ev, segEl) => {
					if (this.currentSegEl) {
						this.currentSegEl = null;
						this.triggerEvent("eventMouseLeave", ev, segEl);
					}
				};
				this.removeHoverListeners = internalCommon.listenToHoverBySelector(settings.el, ".fc-event", this.handleSegEnter, this.handleSegLeave);
			}
			destroy() {
				this.removeHoverListeners();
			}
			triggerEvent(publicEvName, ev, segEl) {
				let { component } = this;
				let { context } = component;
				let seg = internalCommon.getElSeg(segEl);
				if (!ev || component.isValidSegDownEl(ev.target)) context.emitter.trigger(publicEvName, {
					el: segEl,
					event: new internalCommon.EventImpl(context, seg.eventRange.def, seg.eventRange.instance),
					jsEvent: ev,
					view: context.viewApi
				});
			}
		};
		var CalendarContent = class extends internalCommon.PureComponent {
			constructor() {
				super(...arguments);
				this.buildViewContext = internalCommon.memoize(internalCommon.buildViewContext);
				this.buildViewPropTransformers = internalCommon.memoize(buildViewPropTransformers);
				this.buildToolbarProps = internalCommon.memoize(buildToolbarProps);
				this.headerRef = preact.createRef();
				this.footerRef = preact.createRef();
				this.interactionsStore = {};
				this.state = { viewLabelId: internalCommon.getUniqueDomId() };
				this.registerInteractiveComponent = (component, settingsInput) => {
					let settings = internalCommon.parseInteractionSettings(component, settingsInput);
					let interactions = [EventClicking, EventHovering].concat(this.props.pluginHooks.componentInteractions).map((TheInteractionClass) => new TheInteractionClass(settings));
					this.interactionsStore[component.uid] = interactions;
					internalCommon.interactionSettingsStore[component.uid] = settings;
				};
				this.unregisterInteractiveComponent = (component) => {
					let listeners = this.interactionsStore[component.uid];
					if (listeners) {
						for (let listener of listeners) listener.destroy();
						delete this.interactionsStore[component.uid];
					}
					delete internalCommon.interactionSettingsStore[component.uid];
				};
				this.resizeRunner = new internalCommon.DelayedRunner(() => {
					this.props.emitter.trigger("_resize", true);
					this.props.emitter.trigger("windowResize", { view: this.props.viewApi });
				});
				this.handleWindowResize = (ev) => {
					let { options } = this.props;
					if (options.handleWindowResize && ev.target === window) this.resizeRunner.request(options.windowResizeDelay);
				};
			}
			render() {
				let { props } = this;
				let { toolbarConfig, options } = props;
				let viewVGrow = false;
				let viewHeight = "";
				let viewAspectRatio;
				if (props.isHeightAuto || props.forPrint) viewHeight = "";
				else if (options.height != null) viewVGrow = true;
				else if (options.contentHeight != null) viewHeight = options.contentHeight;
				else viewAspectRatio = Math.max(options.aspectRatio, .5);
				let viewContext = this.buildViewContext(props.viewSpec, props.viewApi, props.options, props.dateProfileGenerator, props.dateEnv, props.nowManager, props.theme, props.pluginHooks, props.dispatch, props.getCurrentData, props.emitter, props.calendarApi, this.registerInteractiveComponent, this.unregisterInteractiveComponent);
				let viewLabelId = toolbarConfig.header && toolbarConfig.header.hasTitle ? this.state.viewLabelId : void 0;
				return preact.createElement(internalCommon.ViewContextType.Provider, { value: viewContext }, preact.createElement(internalCommon.NowTimer, { unit: "day" }, (nowDate) => {
					let toolbarProps = this.buildToolbarProps(props.viewSpec, props.dateProfile, props.dateProfileGenerator, props.currentDate, nowDate, props.viewTitle);
					return preact.createElement(preact.Fragment, null, toolbarConfig.header && preact.createElement(Toolbar, Object.assign({
						ref: this.headerRef,
						extraClassName: "fc-header-toolbar",
						model: toolbarConfig.header,
						titleId: viewLabelId
					}, toolbarProps)), preact.createElement(ViewHarness, {
						liquid: viewVGrow,
						height: viewHeight,
						aspectRatio: viewAspectRatio,
						labeledById: viewLabelId
					}, this.renderView(props), this.buildAppendContent()), toolbarConfig.footer && preact.createElement(Toolbar, Object.assign({
						ref: this.footerRef,
						extraClassName: "fc-footer-toolbar",
						model: toolbarConfig.footer,
						titleId: ""
					}, toolbarProps)));
				}));
			}
			componentDidMount() {
				let { props } = this;
				this.calendarInteractions = props.pluginHooks.calendarInteractions.map((CalendarInteractionClass) => new CalendarInteractionClass(props));
				window.addEventListener("resize", this.handleWindowResize);
				let { propSetHandlers } = props.pluginHooks;
				for (let propName in propSetHandlers) propSetHandlers[propName](props[propName], props);
			}
			componentDidUpdate(prevProps) {
				let { props } = this;
				let { propSetHandlers } = props.pluginHooks;
				for (let propName in propSetHandlers) if (props[propName] !== prevProps[propName]) propSetHandlers[propName](props[propName], props);
			}
			componentWillUnmount() {
				window.removeEventListener("resize", this.handleWindowResize);
				this.resizeRunner.clear();
				for (let interaction of this.calendarInteractions) interaction.destroy();
				this.props.emitter.trigger("_unmount");
			}
			buildAppendContent() {
				let { props } = this;
				let children = props.pluginHooks.viewContainerAppends.map((buildAppendContent) => buildAppendContent(props));
				return preact.createElement(preact.Fragment, {}, ...children);
			}
			renderView(props) {
				let { pluginHooks } = props;
				let { viewSpec } = props;
				let viewProps = {
					dateProfile: props.dateProfile,
					businessHours: props.businessHours,
					eventStore: props.renderableEventStore,
					eventUiBases: props.eventUiBases,
					dateSelection: props.dateSelection,
					eventSelection: props.eventSelection,
					eventDrag: props.eventDrag,
					eventResize: props.eventResize,
					isHeightAuto: props.isHeightAuto,
					forPrint: props.forPrint
				};
				let transformers = this.buildViewPropTransformers(pluginHooks.viewPropsTransformers);
				for (let transformer of transformers) Object.assign(viewProps, transformer.transform(viewProps, props));
				let ViewComponent = viewSpec.component;
				return preact.createElement(ViewComponent, Object.assign({}, viewProps));
			}
		};
		function buildToolbarProps(viewSpec, dateProfile, dateProfileGenerator, currentDate, now, title) {
			let todayInfo = dateProfileGenerator.build(now, void 0, false);
			let prevInfo = dateProfileGenerator.buildPrev(dateProfile, currentDate, false);
			let nextInfo = dateProfileGenerator.buildNext(dateProfile, currentDate, false);
			return {
				title,
				activeButton: viewSpec.type,
				navUnit: viewSpec.singleUnit,
				isTodayEnabled: todayInfo.isValid && !internalCommon.rangeContainsMarker(dateProfile.currentRange, now),
				isPrevEnabled: prevInfo.isValid,
				isNextEnabled: nextInfo.isValid
			};
		}
		function buildViewPropTransformers(theClasses) {
			return theClasses.map((TheClass) => new TheClass());
		}
		var Calendar = class extends internalCommon.CalendarImpl {
			constructor(el, optionOverrides = {}) {
				super();
				this.isRendering = false;
				this.isRendered = false;
				this.currentClassNames = [];
				this.customContentRenderId = 0;
				this.handleAction = (action) => {
					switch (action.type) {
						case "SET_EVENT_DRAG":
						case "SET_EVENT_RESIZE": this.renderRunner.tryDrain();
					}
				};
				this.handleData = (data) => {
					this.currentData = data;
					this.renderRunner.request(data.calendarOptions.rerenderDelay);
				};
				this.handleRenderRequest = () => {
					if (this.isRendering) {
						this.isRendered = true;
						let { currentData } = this;
						internalCommon.flushSync(() => {
							preact.render(preact.createElement(internalCommon.CalendarRoot, {
								options: currentData.calendarOptions,
								theme: currentData.theme,
								emitter: currentData.emitter
							}, (classNames, height, isHeightAuto, forPrint) => {
								this.setClassNames(classNames);
								this.setHeight(height);
								return preact.createElement(internalCommon.RenderId.Provider, { value: this.customContentRenderId }, preact.createElement(CalendarContent, Object.assign({
									isHeightAuto,
									forPrint
								}, currentData)));
							}), this.el);
						});
					} else if (this.isRendered) {
						this.isRendered = false;
						preact.render(null, this.el);
						this.setClassNames([]);
						this.setHeight("");
					}
				};
				internalCommon.ensureElHasStyles(el);
				this.el = el;
				this.renderRunner = new internalCommon.DelayedRunner(this.handleRenderRequest);
				new CalendarDataManager({
					optionOverrides,
					calendarApi: this,
					onAction: this.handleAction,
					onData: this.handleData
				});
			}
			render() {
				let wasRendering = this.isRendering;
				if (!wasRendering) this.isRendering = true;
				else this.customContentRenderId += 1;
				this.renderRunner.request();
				if (wasRendering) this.updateSize();
			}
			destroy() {
				if (this.isRendering) {
					this.isRendering = false;
					this.renderRunner.request();
				}
			}
			updateSize() {
				internalCommon.flushSync(() => {
					super.updateSize();
				});
			}
			batchRendering(func) {
				this.renderRunner.pause("batchRendering");
				func();
				this.renderRunner.resume("batchRendering");
			}
			pauseRendering() {
				this.renderRunner.pause("pauseRendering");
			}
			resumeRendering() {
				this.renderRunner.resume("pauseRendering", true);
			}
			resetOptions(optionOverrides, changedOptionNames) {
				this.currentDataManager.resetOptions(optionOverrides, changedOptionNames);
			}
			setClassNames(classNames) {
				if (!internalCommon.isArraysEqual(classNames, this.currentClassNames)) {
					let { classList } = this.el;
					for (let className of this.currentClassNames) classList.remove(className);
					for (let className of classNames) classList.add(className);
					this.currentClassNames = classNames;
				}
			}
			setHeight(height) {
				internalCommon.applyStyleProp(this.el, "height", height);
			}
		};
		function formatDate(dateInput, options = {}) {
			let dateEnv = buildDateEnv(options);
			let formatter = internalCommon.createFormatter(options);
			let dateMeta = dateEnv.createMarkerMeta(dateInput);
			if (!dateMeta) return "";
			return dateEnv.format(dateMeta.marker, formatter, { forcedTzo: dateMeta.forcedTzo });
		}
		function formatRange(startInput, endInput, options) {
			let dateEnv = buildDateEnv(typeof options === "object" && options ? options : {});
			let formatter = internalCommon.createFormatter(options);
			let startMeta = dateEnv.createMarkerMeta(startInput);
			let endMeta = dateEnv.createMarkerMeta(endInput);
			if (!startMeta || !endMeta) return "";
			return dateEnv.formatRange(startMeta.marker, endMeta.marker, formatter, {
				forcedStartTzo: startMeta.forcedTzo,
				forcedEndTzo: endMeta.forcedTzo,
				isEndExclusive: options.isEndExclusive,
				defaultSeparator: internalCommon.BASE_OPTION_DEFAULTS.defaultRangeSeparator
			});
		}
		function buildDateEnv(settings) {
			let locale = buildLocale(settings.locale || "en", organizeRawLocales([]).map);
			return new internalCommon.DateEnv(Object.assign(Object.assign({
				timeZone: internalCommon.BASE_OPTION_DEFAULTS.timeZone,
				calendarSystem: "gregory"
			}, settings), { locale }));
		}
		function sliceEvents(props, allDay) {
			return internalCommon.sliceEventStore(props.eventStore, props.eventUiBases, props.dateProfile.activeRange, allDay ? props.nextDayThreshold : null).fg;
		}
		const version = "6.1.21";
		exports.JsonRequestError = internalCommon.JsonRequestError;
		exports.Calendar = Calendar;
		exports.createPlugin = createPlugin;
		exports.formatDate = formatDate;
		exports.formatRange = formatRange;
		exports.globalLocales = globalLocales;
		exports.globalPlugins = globalPlugins;
		exports.sliceEvents = sliceEvents;
		exports.version = version;
	}));
	//#endregion
	//#region node_modules/.pnpm/@fullcalendar+core@6.1.21/node_modules/@fullcalendar/core/internal.cjs
	var require_internal$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
		Object.defineProperty(exports, "__esModule", { value: true });
		var internalCommon = require_internal_common();
		init_preact_module();
		init_compat_module();
		exports.BASE_OPTION_DEFAULTS = internalCommon.BASE_OPTION_DEFAULTS;
		exports.BaseComponent = internalCommon.BaseComponent;
		exports.BgEvent = internalCommon.BgEvent;
		exports.CalendarImpl = internalCommon.CalendarImpl;
		exports.CalendarRoot = internalCommon.CalendarRoot;
		exports.ContentContainer = internalCommon.ContentContainer;
		exports.CustomRenderingStore = internalCommon.CustomRenderingStore;
		exports.DateComponent = internalCommon.DateComponent;
		exports.DateEnv = internalCommon.DateEnv;
		exports.DateProfileGenerator = internalCommon.DateProfileGenerator;
		exports.DayCellContainer = internalCommon.DayCellContainer;
		exports.DayHeader = internalCommon.DayHeader;
		exports.DaySeriesModel = internalCommon.DaySeriesModel;
		exports.DayTableModel = internalCommon.DayTableModel;
		exports.DelayedRunner = internalCommon.DelayedRunner;
		exports.ElementDragging = internalCommon.ElementDragging;
		exports.ElementScrollController = internalCommon.ElementScrollController;
		exports.Emitter = internalCommon.Emitter;
		exports.EventContainer = internalCommon.EventContainer;
		exports.EventImpl = internalCommon.EventImpl;
		exports.Interaction = internalCommon.Interaction;
		exports.MoreLinkContainer = internalCommon.MoreLinkContainer;
		exports.NamedTimeZoneImpl = internalCommon.NamedTimeZoneImpl;
		exports.NowIndicatorContainer = internalCommon.NowIndicatorContainer;
		exports.NowTimer = internalCommon.NowTimer;
		exports.PositionCache = internalCommon.PositionCache;
		exports.RefMap = internalCommon.RefMap;
		exports.ScrollController = internalCommon.ScrollController;
		exports.ScrollResponder = internalCommon.ScrollResponder;
		exports.Scroller = internalCommon.Scroller;
		exports.SegHierarchy = internalCommon.SegHierarchy;
		exports.SimpleScrollGrid = internalCommon.SimpleScrollGrid;
		exports.Slicer = internalCommon.Slicer;
		exports.Splitter = internalCommon.Splitter;
		exports.StandardEvent = internalCommon.StandardEvent;
		exports.TableDateCell = internalCommon.TableDateCell;
		exports.TableDowCell = internalCommon.TableDowCell;
		exports.Theme = internalCommon.Theme;
		exports.ViewContainer = internalCommon.ViewContainer;
		exports.ViewContextType = internalCommon.ViewContextType;
		exports.WeekNumberContainer = internalCommon.WeekNumberContainer;
		exports.WindowScrollController = internalCommon.WindowScrollController;
		exports.addDays = internalCommon.addDays;
		exports.addDurations = internalCommon.addDurations;
		exports.addMs = internalCommon.addMs;
		exports.addWeeks = internalCommon.addWeeks;
		exports.allowContextMenu = internalCommon.allowContextMenu;
		exports.allowSelection = internalCommon.allowSelection;
		exports.applyMutationToEventStore = internalCommon.applyMutationToEventStore;
		exports.applyStyle = internalCommon.applyStyle;
		exports.asCleanDays = internalCommon.asCleanDays;
		exports.asRoughMinutes = internalCommon.asRoughMinutes;
		exports.asRoughMs = internalCommon.asRoughMs;
		exports.asRoughSeconds = internalCommon.asRoughSeconds;
		exports.binarySearch = internalCommon.binarySearch;
		exports.buildElAttrs = internalCommon.buildElAttrs;
		exports.buildEntryKey = internalCommon.buildEntryKey;
		exports.buildEventApis = internalCommon.buildEventApis;
		exports.buildEventRangeKey = internalCommon.buildEventRangeKey;
		exports.buildIsoString = internalCommon.buildIsoString;
		exports.buildNavLinkAttrs = internalCommon.buildNavLinkAttrs;
		exports.buildSegTimeText = internalCommon.buildSegTimeText;
		exports.collectFromHash = internalCommon.collectFromHash;
		exports.combineEventUis = internalCommon.combineEventUis;
		exports.compareByFieldSpecs = internalCommon.compareByFieldSpecs;
		exports.compareNumbers = internalCommon.compareNumbers;
		exports.compareObjs = internalCommon.compareObjs;
		exports.computeEarliestSegStart = internalCommon.computeEarliestSegStart;
		exports.computeEdges = internalCommon.computeEdges;
		exports.computeFallbackHeaderFormat = internalCommon.computeFallbackHeaderFormat;
		exports.computeInnerRect = internalCommon.computeInnerRect;
		exports.computeRect = internalCommon.computeRect;
		exports.computeShrinkWidth = internalCommon.computeShrinkWidth;
		exports.computeVisibleDayRange = internalCommon.computeVisibleDayRange;
		exports.config = internalCommon.config;
		exports.constrainPoint = internalCommon.constrainPoint;
		exports.createDuration = internalCommon.createDuration;
		exports.createEmptyEventStore = internalCommon.createEmptyEventStore;
		exports.createEventInstance = internalCommon.createEventInstance;
		exports.createEventUi = internalCommon.createEventUi;
		exports.createFormatter = internalCommon.createFormatter;
		exports.diffDates = internalCommon.diffDates;
		exports.diffDayAndTime = internalCommon.diffDayAndTime;
		exports.diffDays = internalCommon.diffDays;
		exports.diffPoints = internalCommon.diffPoints;
		exports.diffWeeks = internalCommon.diffWeeks;
		exports.diffWholeDays = internalCommon.diffWholeDays;
		exports.diffWholeWeeks = internalCommon.diffWholeWeeks;
		exports.disableCursor = internalCommon.disableCursor;
		exports.elementClosest = internalCommon.elementClosest;
		exports.elementMatches = internalCommon.elementMatches;
		exports.enableCursor = internalCommon.enableCursor;
		exports.eventTupleToStore = internalCommon.eventTupleToStore;
		exports.filterHash = internalCommon.filterHash;
		exports.findDirectChildren = internalCommon.findDirectChildren;
		exports.findElements = internalCommon.findElements;
		exports.flexibleCompare = internalCommon.flexibleCompare;
		exports.formatDayString = internalCommon.formatDayString;
		exports.formatIsoMonthStr = internalCommon.formatIsoMonthStr;
		exports.formatIsoTimeString = internalCommon.formatIsoTimeString;
		exports.getAllowYScrolling = internalCommon.getAllowYScrolling;
		exports.getCanVGrowWithinCell = internalCommon.getCanVGrowWithinCell;
		exports.getClippingParents = internalCommon.getClippingParents;
		exports.getDateMeta = internalCommon.getDateMeta;
		exports.getDayClassNames = internalCommon.getDayClassNames;
		exports.getDefaultEventEnd = internalCommon.getDefaultEventEnd;
		exports.getElSeg = internalCommon.getElSeg;
		exports.getEntrySpanEnd = internalCommon.getEntrySpanEnd;
		exports.getEventTargetViaRoot = internalCommon.getEventTargetViaRoot;
		exports.getIsRtlScrollbarOnLeft = internalCommon.getIsRtlScrollbarOnLeft;
		exports.getRectCenter = internalCommon.getRectCenter;
		exports.getRelevantEvents = internalCommon.getRelevantEvents;
		exports.getScrollGridClassNames = internalCommon.getScrollGridClassNames;
		exports.getScrollbarWidths = internalCommon.getScrollbarWidths;
		exports.getSectionClassNames = internalCommon.getSectionClassNames;
		exports.getSectionHasLiquidHeight = internalCommon.getSectionHasLiquidHeight;
		exports.getSegAnchorAttrs = internalCommon.getSegAnchorAttrs;
		exports.getSegMeta = internalCommon.getSegMeta;
		exports.getSlotClassNames = internalCommon.getSlotClassNames;
		exports.getStickyFooterScrollbar = internalCommon.getStickyFooterScrollbar;
		exports.getStickyHeaderDates = internalCommon.getStickyHeaderDates;
		exports.getUniqueDomId = internalCommon.getUniqueDomId;
		exports.greatestDurationDenominator = internalCommon.greatestDurationDenominator;
		exports.groupIntersectingEntries = internalCommon.groupIntersectingEntries;
		exports.guid = internalCommon.guid;
		exports.hasBgRendering = internalCommon.hasBgRendering;
		exports.hasCustomDayCellContent = internalCommon.hasCustomDayCellContent;
		exports.hasShrinkWidth = internalCommon.hasShrinkWidth;
		exports.identity = internalCommon.identity;
		exports.injectStyles = internalCommon.injectStyles;
		exports.interactionSettingsStore = internalCommon.interactionSettingsStore;
		exports.interactionSettingsToStore = internalCommon.interactionSettingsToStore;
		exports.intersectRanges = internalCommon.intersectRanges;
		exports.intersectRects = internalCommon.intersectRects;
		exports.intersectSpans = internalCommon.intersectSpans;
		exports.isArraysEqual = internalCommon.isArraysEqual;
		exports.isColPropsEqual = internalCommon.isColPropsEqual;
		exports.isDateSelectionValid = internalCommon.isDateSelectionValid;
		exports.isDateSpansEqual = internalCommon.isDateSpansEqual;
		exports.isInt = internalCommon.isInt;
		exports.isInteractionValid = internalCommon.isInteractionValid;
		exports.isMultiDayRange = internalCommon.isMultiDayRange;
		exports.isPropsEqual = internalCommon.isPropsEqual;
		exports.isPropsValid = internalCommon.isPropsValid;
		exports.isValidDate = internalCommon.isValidDate;
		exports.mapHash = internalCommon.mapHash;
		exports.memoize = internalCommon.memoize;
		exports.memoizeArraylike = internalCommon.memoizeArraylike;
		exports.memoizeHashlike = internalCommon.memoizeHashlike;
		exports.memoizeObjArg = internalCommon.memoizeObjArg;
		exports.mergeEventStores = internalCommon.mergeEventStores;
		exports.multiplyDuration = internalCommon.multiplyDuration;
		exports.padStart = internalCommon.padStart;
		exports.parseBusinessHours = internalCommon.parseBusinessHours;
		exports.parseClassNames = internalCommon.parseClassNames;
		exports.parseDragMeta = internalCommon.parseDragMeta;
		exports.parseEventDef = internalCommon.parseEventDef;
		exports.parseFieldSpecs = internalCommon.parseFieldSpecs;
		exports.parseMarker = internalCommon.parse;
		exports.pointInsideRect = internalCommon.pointInsideRect;
		exports.preventContextMenu = internalCommon.preventContextMenu;
		exports.preventDefault = internalCommon.preventDefault;
		exports.preventSelection = internalCommon.preventSelection;
		exports.rangeContainsMarker = internalCommon.rangeContainsMarker;
		exports.rangeContainsRange = internalCommon.rangeContainsRange;
		exports.rangesEqual = internalCommon.rangesEqual;
		exports.rangesIntersect = internalCommon.rangesIntersect;
		exports.refineEventDef = internalCommon.refineEventDef;
		exports.refineProps = internalCommon.refineProps;
		exports.removeElement = internalCommon.removeElement;
		exports.removeExact = internalCommon.removeExact;
		exports.renderChunkContent = internalCommon.renderChunkContent;
		exports.renderFill = internalCommon.renderFill;
		exports.renderMicroColGroup = internalCommon.renderMicroColGroup;
		exports.renderScrollShim = internalCommon.renderScrollShim;
		exports.requestJson = internalCommon.requestJson;
		exports.sanitizeShrinkWidth = internalCommon.sanitizeShrinkWidth;
		exports.setRef = internalCommon.setRef;
		exports.sliceEventStore = internalCommon.sliceEventStore;
		exports.sortEventSegs = internalCommon.sortEventSegs;
		exports.startOfDay = internalCommon.startOfDay;
		exports.translateRect = internalCommon.translateRect;
		exports.triggerDateSelect = internalCommon.triggerDateSelect;
		exports.unpromisify = internalCommon.unpromisify;
		exports.whenTransitionDone = internalCommon.whenTransitionDone;
		exports.wholeDivideDurations = internalCommon.wholeDivideDurations;
	}));
	//#endregion
	//#region node_modules/.pnpm/@fullcalendar+react@6.1.21_@fullcalendar+core@6.1.21_react-dom@18.2.0_react@18.3.1__react@18.3.1/node_modules/@fullcalendar/react/dist/index.cjs
	var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
		Object.defineProperty(exports, "__esModule", { value: true });
		var React = require("react");
		var reactDom = require("react-dom");
		var index_cjs = require_core();
		var internal_cjs = require_internal$2();
		function _interopDefaultLegacy(e) {
			return e && typeof e === "object" && "default" in e ? e : { "default": e };
		}
		var React__default = /*#__PURE__*/ _interopDefaultLegacy(React);
		const syncRenderingByDefault = parseInt(String(React__default["default"].version).split(".")[0]) < 18;
		var FullCalendar = class extends React.Component {
			constructor() {
				super(...arguments);
				this.elRef = React.createRef();
				this.isUpdating = false;
				this.isUnmounting = false;
				this.state = { customRenderingMap: /* @__PURE__ */ new Map() };
				this.requestResize = () => {
					if (!this.isUnmounting) {
						this.cancelResize();
						this.resizeId = requestAnimationFrame(() => {
							this.doResize();
						});
					}
				};
			}
			render() {
				const customRenderingNodes = [];
				for (const customRendering of this.state.customRenderingMap.values()) customRenderingNodes.push(React__default["default"].createElement(CustomRenderingComponent, {
					key: customRendering.id,
					customRendering
				}));
				return React__default["default"].createElement("div", { ref: this.elRef }, customRenderingNodes);
			}
			componentDidMount() {
				this.isUnmounting = false;
				const customRenderingStore = new internal_cjs.CustomRenderingStore();
				this.handleCustomRendering = customRenderingStore.handle.bind(customRenderingStore);
				this.calendar = new index_cjs.Calendar(this.elRef.current, Object.assign(Object.assign({}, this.props), { handleCustomRendering: this.handleCustomRendering }));
				this.calendar.render();
				this.calendar.on("_beforeprint", () => {
					reactDom.flushSync(() => {});
				});
				let lastRequestTimestamp;
				customRenderingStore.subscribe((customRenderingMap) => {
					const requestTimestamp = Date.now();
					const isMounting = !lastRequestTimestamp;
					(syncRenderingByDefault || isMounting || this.isUpdating || this.isUnmounting || requestTimestamp - lastRequestTimestamp < 100 ? runNow : reactDom.flushSync)(() => {
						this.setState({ customRenderingMap }, () => {
							lastRequestTimestamp = requestTimestamp;
							if (isMounting) this.doResize();
							else this.requestResize();
						});
					});
				});
			}
			componentDidUpdate() {
				this.isUpdating = true;
				this.calendar.resetOptions(Object.assign(Object.assign({}, this.props), { handleCustomRendering: this.handleCustomRendering }));
				this.isUpdating = false;
			}
			componentWillUnmount() {
				this.isUnmounting = true;
				this.cancelResize();
				this.calendar.destroy();
			}
			doResize() {
				this.calendar.updateSize();
			}
			cancelResize() {
				if (this.resizeId !== void 0) {
					cancelAnimationFrame(this.resizeId);
					this.resizeId = void 0;
				}
			}
			getApi() {
				return this.calendar;
			}
		};
		FullCalendar.act = runNow;
		var CustomRenderingComponent = class extends React.PureComponent {
			render() {
				const { customRendering } = this.props;
				const { generatorMeta } = customRendering;
				const vnode = typeof generatorMeta === "function" ? generatorMeta(customRendering.renderProps) : generatorMeta;
				return reactDom.createPortal(vnode, customRendering.containerEl);
			}
		};
		function runNow(f) {
			f();
		}
		exports["default"] = FullCalendar;
	}));
	//#endregion
	//#region node_modules/.pnpm/@fullcalendar+core@6.1.21/node_modules/@fullcalendar/core/preact.cjs
	var require_preact = /* @__PURE__ */ __commonJSMin(((exports) => {
		Object.defineProperty(exports, "__esModule", { value: true });
		var preact = (init_preact_module(), __toCommonJS(preact_module_exports));
		var compat = (init_compat_module(), __toCommonJS(compat_module_exports));
		var internalCommon = require_internal_common();
		Object.defineProperty(exports, "createPortal", {
			enumerable: true,
			get: function() {
				return compat.createPortal;
			}
		});
		exports.createContext = internalCommon.createContext;
		exports.flushSync = internalCommon.flushSync;
		Object.keys(preact).forEach(function(k) {
			if (k !== "default" && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
				enumerable: true,
				get: function() {
					return preact[k];
				}
			});
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/@fullcalendar+daygrid@6.1.21_@fullcalendar+core@6.1.21/node_modules/@fullcalendar/daygrid/internal.cjs
	var require_internal$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
		Object.defineProperty(exports, "__esModule", { value: true });
		var internal_cjs = require_internal$2();
		var preact_cjs = require_preact();
		var TableView = class extends internal_cjs.DateComponent {
			constructor() {
				super(...arguments);
				this.headerElRef = preact_cjs.createRef();
			}
			renderSimpleLayout(headerRowContent, bodyContent) {
				let { props, context } = this;
				let sections = [];
				let stickyHeaderDates = internal_cjs.getStickyHeaderDates(context.options);
				if (headerRowContent) sections.push({
					type: "header",
					key: "header",
					isSticky: stickyHeaderDates,
					chunk: {
						elRef: this.headerElRef,
						tableClassName: "fc-col-header",
						rowContent: headerRowContent
					}
				});
				sections.push({
					type: "body",
					key: "body",
					liquid: true,
					chunk: { content: bodyContent }
				});
				return preact_cjs.createElement(internal_cjs.ViewContainer, {
					elClasses: ["fc-daygrid"],
					viewSpec: context.viewSpec
				}, preact_cjs.createElement(internal_cjs.SimpleScrollGrid, {
					liquid: !props.isHeightAuto && !props.forPrint,
					collapsibleWidth: props.forPrint,
					cols: [],
					sections
				}));
			}
			renderHScrollLayout(headerRowContent, bodyContent, colCnt, dayMinWidth) {
				let ScrollGrid = this.context.pluginHooks.scrollGridImpl;
				if (!ScrollGrid) throw new Error("No ScrollGrid implementation");
				let { props, context } = this;
				let stickyHeaderDates = !props.forPrint && internal_cjs.getStickyHeaderDates(context.options);
				let stickyFooterScrollbar = !props.forPrint && internal_cjs.getStickyFooterScrollbar(context.options);
				let sections = [];
				if (headerRowContent) sections.push({
					type: "header",
					key: "header",
					isSticky: stickyHeaderDates,
					chunks: [{
						key: "main",
						elRef: this.headerElRef,
						tableClassName: "fc-col-header",
						rowContent: headerRowContent
					}]
				});
				sections.push({
					type: "body",
					key: "body",
					liquid: true,
					chunks: [{
						key: "main",
						content: bodyContent
					}]
				});
				if (stickyFooterScrollbar) sections.push({
					type: "footer",
					key: "footer",
					isSticky: true,
					chunks: [{
						key: "main",
						content: internal_cjs.renderScrollShim
					}]
				});
				return preact_cjs.createElement(internal_cjs.ViewContainer, {
					elClasses: ["fc-daygrid"],
					viewSpec: context.viewSpec
				}, preact_cjs.createElement(ScrollGrid, {
					liquid: !props.isHeightAuto && !props.forPrint,
					forPrint: props.forPrint,
					collapsibleWidth: props.forPrint,
					colGroups: [{ cols: [{
						span: colCnt,
						minWidth: dayMinWidth
					}] }],
					sections
				}));
			}
		};
		function splitSegsByRow(segs, rowCnt) {
			let byRow = [];
			for (let i = 0; i < rowCnt; i += 1) byRow[i] = [];
			for (let seg of segs) byRow[seg.row].push(seg);
			return byRow;
		}
		function splitSegsByFirstCol(segs, colCnt) {
			let byCol = [];
			for (let i = 0; i < colCnt; i += 1) byCol[i] = [];
			for (let seg of segs) byCol[seg.firstCol].push(seg);
			return byCol;
		}
		function splitInteractionByRow(ui, rowCnt) {
			let byRow = [];
			if (!ui) for (let i = 0; i < rowCnt; i += 1) byRow[i] = null;
			else {
				for (let i = 0; i < rowCnt; i += 1) byRow[i] = {
					affectedInstances: ui.affectedInstances,
					isEvent: ui.isEvent,
					segs: []
				};
				for (let seg of ui.segs) byRow[seg.row].segs.push(seg);
			}
			return byRow;
		}
		const DEFAULT_TABLE_EVENT_TIME_FORMAT = internal_cjs.createFormatter({
			hour: "numeric",
			minute: "2-digit",
			omitZeroMinute: true,
			meridiem: "narrow"
		});
		function hasListItemDisplay(seg) {
			let { display } = seg.eventRange.ui;
			return display === "list-item" || display === "auto" && !seg.eventRange.def.allDay && seg.firstCol === seg.lastCol && seg.isStart && seg.isEnd;
		}
		var TableBlockEvent = class extends internal_cjs.BaseComponent {
			render() {
				let { props } = this;
				return preact_cjs.createElement(internal_cjs.StandardEvent, Object.assign({}, props, {
					elClasses: [
						"fc-daygrid-event",
						"fc-daygrid-block-event",
						"fc-h-event"
					],
					defaultTimeFormat: DEFAULT_TABLE_EVENT_TIME_FORMAT,
					defaultDisplayEventEnd: props.defaultDisplayEventEnd,
					disableResizing: !props.seg.eventRange.def.allDay
				}));
			}
		};
		var TableListItemEvent = class extends internal_cjs.BaseComponent {
			render() {
				let { props, context } = this;
				let { options } = context;
				let { seg } = props;
				let timeFormat = options.eventTimeFormat || DEFAULT_TABLE_EVENT_TIME_FORMAT;
				let timeText = internal_cjs.buildSegTimeText(seg, timeFormat, context, true, props.defaultDisplayEventEnd);
				return preact_cjs.createElement(internal_cjs.EventContainer, Object.assign({}, props, {
					elTag: "a",
					elClasses: ["fc-daygrid-event", "fc-daygrid-dot-event"],
					elAttrs: internal_cjs.getSegAnchorAttrs(props.seg, context),
					defaultGenerator: renderInnerContent,
					timeText,
					isResizing: false,
					isDateSelecting: false
				}));
			}
		};
		function renderInnerContent(renderProps) {
			return preact_cjs.createElement(preact_cjs.Fragment, null, preact_cjs.createElement("div", {
				className: "fc-daygrid-event-dot",
				style: { borderColor: renderProps.borderColor || renderProps.backgroundColor }
			}), renderProps.timeText && preact_cjs.createElement("div", { className: "fc-event-time" }, renderProps.timeText), preact_cjs.createElement("div", { className: "fc-event-title" }, renderProps.event.title || preact_cjs.createElement(preact_cjs.Fragment, null, "\xA0")));
		}
		var TableCellMoreLink = class extends internal_cjs.BaseComponent {
			constructor() {
				super(...arguments);
				this.compileSegs = internal_cjs.memoize(compileSegs);
			}
			render() {
				let { props } = this;
				let { allSegs, invisibleSegs } = this.compileSegs(props.singlePlacements);
				return preact_cjs.createElement(internal_cjs.MoreLinkContainer, {
					elClasses: ["fc-daygrid-more-link"],
					dateProfile: props.dateProfile,
					todayRange: props.todayRange,
					allDayDate: props.allDayDate,
					moreCnt: props.moreCnt,
					allSegs,
					hiddenSegs: invisibleSegs,
					alignmentElRef: props.alignmentElRef,
					alignGridTop: props.alignGridTop,
					extraDateSpan: props.extraDateSpan,
					popoverContent: () => {
						let isForcedInvisible = (props.eventDrag ? props.eventDrag.affectedInstances : null) || (props.eventResize ? props.eventResize.affectedInstances : null) || {};
						return preact_cjs.createElement(preact_cjs.Fragment, null, allSegs.map((seg) => {
							let instanceId = seg.eventRange.instance.instanceId;
							return preact_cjs.createElement("div", {
								className: "fc-daygrid-event-harness",
								key: instanceId,
								style: { visibility: isForcedInvisible[instanceId] ? "hidden" : "" }
							}, hasListItemDisplay(seg) ? preact_cjs.createElement(TableListItemEvent, Object.assign({
								seg,
								isDragging: false,
								isSelected: instanceId === props.eventSelection,
								defaultDisplayEventEnd: false
							}, internal_cjs.getSegMeta(seg, props.todayRange))) : preact_cjs.createElement(TableBlockEvent, Object.assign({
								seg,
								isDragging: false,
								isResizing: false,
								isDateSelecting: false,
								isSelected: instanceId === props.eventSelection,
								defaultDisplayEventEnd: false
							}, internal_cjs.getSegMeta(seg, props.todayRange))));
						}));
					}
				});
			}
		};
		function compileSegs(singlePlacements) {
			let allSegs = [];
			let invisibleSegs = [];
			for (let placement of singlePlacements) {
				allSegs.push(placement.seg);
				if (!placement.isVisible) invisibleSegs.push(placement.seg);
			}
			return {
				allSegs,
				invisibleSegs
			};
		}
		const DEFAULT_WEEK_NUM_FORMAT = internal_cjs.createFormatter({ week: "narrow" });
		var TableCell = class extends internal_cjs.DateComponent {
			constructor() {
				super(...arguments);
				this.rootElRef = preact_cjs.createRef();
				this.state = { dayNumberId: internal_cjs.getUniqueDomId() };
				this.handleRootEl = (el) => {
					internal_cjs.setRef(this.rootElRef, el);
					internal_cjs.setRef(this.props.elRef, el);
				};
			}
			render() {
				let { context, props, state, rootElRef } = this;
				let { options, dateEnv } = context;
				let { date, dateProfile } = props;
				const isMonthStart = props.showDayNumber && shouldDisplayMonthStart(date, dateProfile.currentRange, dateEnv);
				return preact_cjs.createElement(internal_cjs.DayCellContainer, {
					elTag: "td",
					elRef: this.handleRootEl,
					elClasses: ["fc-daygrid-day", ...props.extraClassNames || []],
					elAttrs: Object.assign(Object.assign(Object.assign({}, props.extraDataAttrs), props.showDayNumber ? { "aria-labelledby": state.dayNumberId } : {}), { role: "gridcell" }),
					defaultGenerator: renderTopInner,
					date,
					dateProfile,
					todayRange: props.todayRange,
					showDayNumber: props.showDayNumber,
					isMonthStart,
					extraRenderProps: props.extraRenderProps
				}, (InnerContent, renderProps) => preact_cjs.createElement("div", {
					ref: props.innerElRef,
					className: "fc-daygrid-day-frame fc-scrollgrid-sync-inner",
					style: { minHeight: props.minHeight }
				}, props.showWeekNumber && preact_cjs.createElement(internal_cjs.WeekNumberContainer, {
					elTag: "a",
					elClasses: ["fc-daygrid-week-number"],
					elAttrs: internal_cjs.buildNavLinkAttrs(context, date, "week"),
					date,
					defaultFormat: DEFAULT_WEEK_NUM_FORMAT
				}), !renderProps.isDisabled && (props.showDayNumber || internal_cjs.hasCustomDayCellContent(options) || props.forceDayTop) ? preact_cjs.createElement("div", { className: "fc-daygrid-day-top" }, preact_cjs.createElement(InnerContent, {
					elTag: "a",
					elClasses: ["fc-daygrid-day-number", isMonthStart && "fc-daygrid-month-start"],
					elAttrs: Object.assign(Object.assign({}, internal_cjs.buildNavLinkAttrs(context, date)), { id: state.dayNumberId })
				})) : props.showDayNumber ? preact_cjs.createElement("div", {
					className: "fc-daygrid-day-top",
					style: { visibility: "hidden" }
				}, preact_cjs.createElement("a", { className: "fc-daygrid-day-number" }, "\xA0")) : void 0, preact_cjs.createElement("div", {
					className: "fc-daygrid-day-events",
					ref: props.fgContentElRef
				}, props.fgContent, preact_cjs.createElement("div", {
					className: "fc-daygrid-day-bottom",
					style: { marginTop: props.moreMarginTop }
				}, preact_cjs.createElement(TableCellMoreLink, {
					allDayDate: date,
					singlePlacements: props.singlePlacements,
					moreCnt: props.moreCnt,
					alignmentElRef: rootElRef,
					alignGridTop: !props.showDayNumber,
					extraDateSpan: props.extraDateSpan,
					dateProfile: props.dateProfile,
					eventSelection: props.eventSelection,
					eventDrag: props.eventDrag,
					eventResize: props.eventResize,
					todayRange: props.todayRange
				}))), preact_cjs.createElement("div", { className: "fc-daygrid-day-bg" }, props.bgContent)));
			}
		};
		function renderTopInner(props) {
			return props.dayNumberText || preact_cjs.createElement(preact_cjs.Fragment, null, "\xA0");
		}
		function shouldDisplayMonthStart(date, currentRange, dateEnv) {
			const { start: currentStart, end: currentEnd } = currentRange;
			const currentEndIncl = internal_cjs.addMs(currentEnd, -1);
			const currentFirstYear = dateEnv.getYear(currentStart);
			const currentFirstMonth = dateEnv.getMonth(currentStart);
			const currentLastYear = dateEnv.getYear(currentEndIncl);
			const currentLastMonth = dateEnv.getMonth(currentEndIncl);
			return !(currentFirstYear === currentLastYear && currentFirstMonth === currentLastMonth) && Boolean(date.valueOf() === currentStart.valueOf() || dateEnv.getDay(date) === 1 && date.valueOf() < currentEnd.valueOf());
		}
		function generateSegKey(seg) {
			return seg.eventRange.instance.instanceId + ":" + seg.firstCol;
		}
		function generateSegUid(seg) {
			return generateSegKey(seg) + ":" + seg.lastCol;
		}
		function computeFgSegPlacement(segs, dayMaxEvents, dayMaxEventRows, strictOrder, segHeights, maxContentHeight, cells) {
			let hierarchy = new DayGridSegHierarchy((segEntry) => {
				return segHeights[segs[segEntry.index].eventRange.instance.instanceId + ":" + segEntry.span.start + ":" + (segEntry.span.end - 1)] || 1;
			});
			hierarchy.allowReslicing = true;
			hierarchy.strictOrder = strictOrder;
			if (dayMaxEvents === true || dayMaxEventRows === true) {
				hierarchy.maxCoord = maxContentHeight;
				hierarchy.hiddenConsumes = true;
			} else if (typeof dayMaxEvents === "number") hierarchy.maxStackCnt = dayMaxEvents;
			else if (typeof dayMaxEventRows === "number") {
				hierarchy.maxStackCnt = dayMaxEventRows;
				hierarchy.hiddenConsumes = true;
			}
			let segInputs = [];
			let unknownHeightSegs = [];
			for (let i = 0; i < segs.length; i += 1) {
				let seg = segs[i];
				if (segHeights[generateSegUid(seg)] != null) segInputs.push({
					index: i,
					span: {
						start: seg.firstCol,
						end: seg.lastCol + 1
					}
				});
				else unknownHeightSegs.push(seg);
			}
			let hiddenEntries = hierarchy.addSegs(segInputs);
			let { singleColPlacements, multiColPlacements, leftoverMargins } = placeRects(hierarchy.toRects(), segs, cells);
			let moreCnts = [];
			let moreMarginTops = [];
			for (let seg of unknownHeightSegs) {
				multiColPlacements[seg.firstCol].push({
					seg,
					isVisible: false,
					isAbsolute: true,
					absoluteTop: 0,
					marginTop: 0
				});
				for (let col = seg.firstCol; col <= seg.lastCol; col += 1) singleColPlacements[col].push({
					seg: resliceSeg(seg, col, col + 1, cells),
					isVisible: false,
					isAbsolute: false,
					absoluteTop: 0,
					marginTop: 0
				});
			}
			for (let col = 0; col < cells.length; col += 1) moreCnts.push(0);
			for (let hiddenEntry of hiddenEntries) {
				let seg = segs[hiddenEntry.index];
				let hiddenSpan = hiddenEntry.span;
				multiColPlacements[hiddenSpan.start].push({
					seg: resliceSeg(seg, hiddenSpan.start, hiddenSpan.end, cells),
					isVisible: false,
					isAbsolute: true,
					absoluteTop: 0,
					marginTop: 0
				});
				for (let col = hiddenSpan.start; col < hiddenSpan.end; col += 1) {
					moreCnts[col] += 1;
					singleColPlacements[col].push({
						seg: resliceSeg(seg, col, col + 1, cells),
						isVisible: false,
						isAbsolute: false,
						absoluteTop: 0,
						marginTop: 0
					});
				}
			}
			for (let col = 0; col < cells.length; col += 1) moreMarginTops.push(leftoverMargins[col]);
			return {
				singleColPlacements,
				multiColPlacements,
				moreCnts,
				moreMarginTops
			};
		}
		function placeRects(allRects, segs, cells) {
			let rectsByEachCol = groupRectsByEachCol(allRects, cells.length);
			let singleColPlacements = [];
			let multiColPlacements = [];
			let leftoverMargins = [];
			for (let col = 0; col < cells.length; col += 1) {
				let rects = rectsByEachCol[col];
				let singlePlacements = [];
				let currentHeight = 0;
				let currentMarginTop = 0;
				for (let rect of rects) {
					let seg = segs[rect.index];
					singlePlacements.push({
						seg: resliceSeg(seg, col, col + 1, cells),
						isVisible: true,
						isAbsolute: false,
						absoluteTop: rect.levelCoord,
						marginTop: rect.levelCoord - currentHeight
					});
					currentHeight = rect.levelCoord + rect.thickness;
				}
				let multiPlacements = [];
				currentHeight = 0;
				currentMarginTop = 0;
				for (let rect of rects) {
					let seg = segs[rect.index];
					let isAbsolute = rect.span.end - rect.span.start > 1;
					let isFirstCol = rect.span.start === col;
					currentMarginTop += rect.levelCoord - currentHeight;
					currentHeight = rect.levelCoord + rect.thickness;
					if (isAbsolute) {
						currentMarginTop += rect.thickness;
						if (isFirstCol) multiPlacements.push({
							seg: resliceSeg(seg, rect.span.start, rect.span.end, cells),
							isVisible: true,
							isAbsolute: true,
							absoluteTop: rect.levelCoord,
							marginTop: 0
						});
					} else if (isFirstCol) {
						multiPlacements.push({
							seg: resliceSeg(seg, rect.span.start, rect.span.end, cells),
							isVisible: true,
							isAbsolute: false,
							absoluteTop: rect.levelCoord,
							marginTop: currentMarginTop
						});
						currentMarginTop = 0;
					}
				}
				singleColPlacements.push(singlePlacements);
				multiColPlacements.push(multiPlacements);
				leftoverMargins.push(currentMarginTop);
			}
			return {
				singleColPlacements,
				multiColPlacements,
				leftoverMargins
			};
		}
		function groupRectsByEachCol(rects, colCnt) {
			let rectsByEachCol = [];
			for (let col = 0; col < colCnt; col += 1) rectsByEachCol.push([]);
			for (let rect of rects) for (let col = rect.span.start; col < rect.span.end; col += 1) rectsByEachCol[col].push(rect);
			return rectsByEachCol;
		}
		function resliceSeg(seg, spanStart, spanEnd, cells) {
			if (seg.firstCol === spanStart && seg.lastCol === spanEnd - 1) return seg;
			let eventRange = seg.eventRange;
			let origRange = eventRange.range;
			let slicedRange = internal_cjs.intersectRanges(origRange, {
				start: cells[spanStart].date,
				end: internal_cjs.addDays(cells[spanEnd - 1].date, 1)
			});
			return Object.assign(Object.assign({}, seg), {
				firstCol: spanStart,
				lastCol: spanEnd - 1,
				eventRange: {
					def: eventRange.def,
					ui: Object.assign(Object.assign({}, eventRange.ui), { durationEditable: false }),
					instance: eventRange.instance,
					range: slicedRange
				},
				isStart: seg.isStart && slicedRange.start.valueOf() === origRange.start.valueOf(),
				isEnd: seg.isEnd && slicedRange.end.valueOf() === origRange.end.valueOf()
			});
		}
		var DayGridSegHierarchy = class extends internal_cjs.SegHierarchy {
			constructor() {
				super(...arguments);
				this.hiddenConsumes = false;
				this.forceHidden = {};
			}
			addSegs(segInputs) {
				const hiddenSegs = super.addSegs(segInputs);
				const { entriesByLevel } = this;
				const excludeHidden = (entry) => !this.forceHidden[internal_cjs.buildEntryKey(entry)];
				for (let level = 0; level < entriesByLevel.length; level += 1) entriesByLevel[level] = entriesByLevel[level].filter(excludeHidden);
				return hiddenSegs;
			}
			handleInvalidInsertion(insertion, entry, hiddenEntries) {
				const { entriesByLevel, forceHidden } = this;
				const { touchingEntry, touchingLevel, touchingLateral } = insertion;
				if (this.hiddenConsumes && touchingEntry) {
					const touchingEntryId = internal_cjs.buildEntryKey(touchingEntry);
					if (!forceHidden[touchingEntryId]) {
						if (this.allowReslicing) {
							const hiddenEntry = Object.assign(Object.assign({}, touchingEntry), { span: internal_cjs.intersectSpans(touchingEntry.span, entry.span) });
							const hiddenEntryId = internal_cjs.buildEntryKey(hiddenEntry);
							forceHidden[hiddenEntryId] = true;
							entriesByLevel[touchingLevel][touchingLateral] = hiddenEntry;
							hiddenEntries.push(hiddenEntry);
							this.splitEntry(touchingEntry, entry, hiddenEntries);
						} else {
							forceHidden[touchingEntryId] = true;
							hiddenEntries.push(touchingEntry);
						}
					}
				}
				super.handleInvalidInsertion(insertion, entry, hiddenEntries);
			}
		};
		var TableRow = class extends internal_cjs.DateComponent {
			constructor() {
				super(...arguments);
				this.cellElRefs = new internal_cjs.RefMap();
				this.frameElRefs = new internal_cjs.RefMap();
				this.fgElRefs = new internal_cjs.RefMap();
				this.segHarnessRefs = new internal_cjs.RefMap();
				this.rootElRef = preact_cjs.createRef();
				this.state = {
					framePositions: null,
					maxContentHeight: null,
					segHeights: {}
				};
				this.handleResize = (isForced) => {
					if (isForced) this.updateSizing(true);
				};
			}
			render() {
				let { props, state, context } = this;
				let { options } = context;
				let colCnt = props.cells.length;
				let businessHoursByCol = splitSegsByFirstCol(props.businessHourSegs, colCnt);
				let bgEventSegsByCol = splitSegsByFirstCol(props.bgEventSegs, colCnt);
				let highlightSegsByCol = splitSegsByFirstCol(this.getHighlightSegs(), colCnt);
				let mirrorSegsByCol = splitSegsByFirstCol(this.getMirrorSegs(), colCnt);
				let { singleColPlacements, multiColPlacements, moreCnts, moreMarginTops } = computeFgSegPlacement(internal_cjs.sortEventSegs(props.fgEventSegs, options.eventOrder), props.dayMaxEvents, props.dayMaxEventRows, options.eventOrderStrict, state.segHeights, state.maxContentHeight, props.cells);
				let isForcedInvisible = props.eventDrag && props.eventDrag.affectedInstances || props.eventResize && props.eventResize.affectedInstances || {};
				return preact_cjs.createElement("tr", {
					ref: this.rootElRef,
					role: "row"
				}, props.renderIntro && props.renderIntro(), props.cells.map((cell, col) => {
					let normalFgNodes = this.renderFgSegs(col, props.forPrint ? singleColPlacements[col] : multiColPlacements[col], props.todayRange, isForcedInvisible);
					let mirrorFgNodes = this.renderFgSegs(col, buildMirrorPlacements(mirrorSegsByCol[col], multiColPlacements), props.todayRange, {}, Boolean(props.eventDrag), Boolean(props.eventResize), false);
					return preact_cjs.createElement(TableCell, {
						key: cell.key,
						elRef: this.cellElRefs.createRef(cell.key),
						innerElRef: this.frameElRefs.createRef(cell.key),
						dateProfile: props.dateProfile,
						date: cell.date,
						showDayNumber: props.showDayNumbers,
						showWeekNumber: props.showWeekNumbers && col === 0,
						forceDayTop: props.showWeekNumbers,
						todayRange: props.todayRange,
						eventSelection: props.eventSelection,
						eventDrag: props.eventDrag,
						eventResize: props.eventResize,
						extraRenderProps: cell.extraRenderProps,
						extraDataAttrs: cell.extraDataAttrs,
						extraClassNames: cell.extraClassNames,
						extraDateSpan: cell.extraDateSpan,
						moreCnt: moreCnts[col],
						moreMarginTop: moreMarginTops[col],
						singlePlacements: singleColPlacements[col],
						fgContentElRef: this.fgElRefs.createRef(cell.key),
						fgContent: preact_cjs.createElement(preact_cjs.Fragment, null, preact_cjs.createElement(preact_cjs.Fragment, null, normalFgNodes), preact_cjs.createElement(preact_cjs.Fragment, null, mirrorFgNodes)),
						bgContent: preact_cjs.createElement(preact_cjs.Fragment, null, this.renderFillSegs(highlightSegsByCol[col], "highlight"), this.renderFillSegs(businessHoursByCol[col], "non-business"), this.renderFillSegs(bgEventSegsByCol[col], "bg-event")),
						minHeight: props.cellMinHeight
					});
				}));
			}
			componentDidMount() {
				this.updateSizing(true);
				this.context.addResizeHandler(this.handleResize);
			}
			componentDidUpdate(prevProps, prevState) {
				let currentProps = this.props;
				this.updateSizing(!internal_cjs.isPropsEqual(prevProps, currentProps));
			}
			componentWillUnmount() {
				this.context.removeResizeHandler(this.handleResize);
			}
			getHighlightSegs() {
				let { props } = this;
				if (props.eventDrag && props.eventDrag.segs.length) return props.eventDrag.segs;
				if (props.eventResize && props.eventResize.segs.length) return props.eventResize.segs;
				return props.dateSelectionSegs;
			}
			getMirrorSegs() {
				let { props } = this;
				if (props.eventResize && props.eventResize.segs.length) return props.eventResize.segs;
				return [];
			}
			renderFgSegs(col, segPlacements, todayRange, isForcedInvisible, isDragging, isResizing, isDateSelecting) {
				let { context } = this;
				let { eventSelection } = this.props;
				let { framePositions } = this.state;
				let defaultDisplayEventEnd = this.props.cells.length === 1;
				let isMirror = isDragging || isResizing || isDateSelecting;
				let nodes = [];
				if (framePositions) for (let placement of segPlacements) {
					let { seg } = placement;
					let { instanceId } = seg.eventRange.instance;
					let isVisible = placement.isVisible && !isForcedInvisible[instanceId];
					let isAbsolute = placement.isAbsolute;
					let left = "";
					let right = "";
					if (isAbsolute) {
						if (context.isRtl) {
							right = 0;
							left = framePositions.lefts[seg.lastCol] - framePositions.lefts[seg.firstCol];
						} else {
							left = 0;
							right = framePositions.rights[seg.firstCol] - framePositions.rights[seg.lastCol];
						}
					}
					nodes.push(preact_cjs.createElement("div", {
						className: "fc-daygrid-event-harness" + (isAbsolute ? " fc-daygrid-event-harness-abs" : ""),
						key: generateSegKey(seg),
						ref: isMirror ? null : this.segHarnessRefs.createRef(generateSegUid(seg)),
						style: {
							visibility: isVisible ? "" : "hidden",
							marginTop: isAbsolute ? "" : placement.marginTop,
							top: isAbsolute ? placement.absoluteTop : "",
							left,
							right
						}
					}, hasListItemDisplay(seg) ? preact_cjs.createElement(TableListItemEvent, Object.assign({
						seg,
						isDragging,
						isSelected: instanceId === eventSelection,
						defaultDisplayEventEnd
					}, internal_cjs.getSegMeta(seg, todayRange))) : preact_cjs.createElement(TableBlockEvent, Object.assign({
						seg,
						isDragging,
						isResizing,
						isDateSelecting,
						isSelected: instanceId === eventSelection,
						defaultDisplayEventEnd
					}, internal_cjs.getSegMeta(seg, todayRange)))));
				}
				return nodes;
			}
			renderFillSegs(segs, fillType) {
				let { isRtl } = this.context;
				let { todayRange } = this.props;
				let { framePositions } = this.state;
				let nodes = [];
				if (framePositions) for (let seg of segs) {
					let leftRightCss = isRtl ? {
						right: 0,
						left: framePositions.lefts[seg.lastCol] - framePositions.lefts[seg.firstCol]
					} : {
						left: 0,
						right: framePositions.rights[seg.firstCol] - framePositions.rights[seg.lastCol]
					};
					nodes.push(preact_cjs.createElement("div", {
						key: internal_cjs.buildEventRangeKey(seg.eventRange),
						className: "fc-daygrid-bg-harness",
						style: leftRightCss
					}, fillType === "bg-event" ? preact_cjs.createElement(internal_cjs.BgEvent, Object.assign({ seg }, internal_cjs.getSegMeta(seg, todayRange))) : internal_cjs.renderFill(fillType)));
				}
				return preact_cjs.createElement(preact_cjs.Fragment, {}, ...nodes);
			}
			updateSizing(isExternalSizingChange) {
				let { props, state, frameElRefs } = this;
				if (!props.forPrint && props.clientWidth !== null) {
					if (isExternalSizingChange) {
						let frameEls = props.cells.map((cell) => frameElRefs.currentMap[cell.key]);
						if (frameEls.length) {
							let originEl = this.rootElRef.current;
							let newPositionCache = new internal_cjs.PositionCache(originEl, frameEls, true, false);
							if (!state.framePositions || !state.framePositions.similarTo(newPositionCache)) this.setState({ framePositions: new internal_cjs.PositionCache(originEl, frameEls, true, false) });
						}
					}
					const oldSegHeights = this.state.segHeights;
					const newSegHeights = this.querySegHeights();
					const limitByContentHeight = props.dayMaxEvents === true || props.dayMaxEventRows === true;
					this.safeSetState({
						segHeights: Object.assign(Object.assign({}, oldSegHeights), newSegHeights),
						maxContentHeight: limitByContentHeight ? this.computeMaxContentHeight() : null
					});
				}
			}
			querySegHeights() {
				let segElMap = this.segHarnessRefs.currentMap;
				let segHeights = {};
				for (let segUid in segElMap) {
					let height = Math.round(segElMap[segUid].getBoundingClientRect().height);
					segHeights[segUid] = Math.max(segHeights[segUid] || 0, height);
				}
				return segHeights;
			}
			computeMaxContentHeight() {
				let firstKey = this.props.cells[0].key;
				let cellEl = this.cellElRefs.currentMap[firstKey];
				let fcContainerEl = this.fgElRefs.currentMap[firstKey];
				return cellEl.getBoundingClientRect().bottom - fcContainerEl.getBoundingClientRect().top;
			}
			getCellEls() {
				let elMap = this.cellElRefs.currentMap;
				return this.props.cells.map((cell) => elMap[cell.key]);
			}
		};
		TableRow.addStateEquality({ segHeights: internal_cjs.isPropsEqual });
		function buildMirrorPlacements(mirrorSegs, colPlacements) {
			if (!mirrorSegs.length) return [];
			let topsByInstanceId = buildAbsoluteTopHash(colPlacements);
			return mirrorSegs.map((seg) => ({
				seg,
				isVisible: true,
				isAbsolute: true,
				absoluteTop: topsByInstanceId[seg.eventRange.instance.instanceId],
				marginTop: 0
			}));
		}
		function buildAbsoluteTopHash(colPlacements) {
			let topsByInstanceId = {};
			for (let placements of colPlacements) for (let placement of placements) topsByInstanceId[placement.seg.eventRange.instance.instanceId] = placement.absoluteTop;
			return topsByInstanceId;
		}
		var TableRows = class extends internal_cjs.DateComponent {
			constructor() {
				super(...arguments);
				this.splitBusinessHourSegs = internal_cjs.memoize(splitSegsByRow);
				this.splitBgEventSegs = internal_cjs.memoize(splitAllDaySegsByRow);
				this.splitFgEventSegs = internal_cjs.memoize(splitSegsByRow);
				this.splitDateSelectionSegs = internal_cjs.memoize(splitSegsByRow);
				this.splitEventDrag = internal_cjs.memoize(splitInteractionByRow);
				this.splitEventResize = internal_cjs.memoize(splitInteractionByRow);
				this.rowRefs = new internal_cjs.RefMap();
			}
			render() {
				let { props, context } = this;
				let rowCnt = props.cells.length;
				let businessHourSegsByRow = this.splitBusinessHourSegs(props.businessHourSegs, rowCnt);
				let bgEventSegsByRow = this.splitBgEventSegs(props.bgEventSegs, rowCnt);
				let fgEventSegsByRow = this.splitFgEventSegs(props.fgEventSegs, rowCnt);
				let dateSelectionSegsByRow = this.splitDateSelectionSegs(props.dateSelectionSegs, rowCnt);
				let eventDragByRow = this.splitEventDrag(props.eventDrag, rowCnt);
				let eventResizeByRow = this.splitEventResize(props.eventResize, rowCnt);
				let cellMinHeight = rowCnt >= 7 && props.clientWidth ? props.clientWidth / context.options.aspectRatio / 6 : null;
				return preact_cjs.createElement(internal_cjs.NowTimer, { unit: "day" }, (nowDate, todayRange) => preact_cjs.createElement(preact_cjs.Fragment, null, props.cells.map((cells, row) => preact_cjs.createElement(TableRow, {
					ref: this.rowRefs.createRef(row),
					key: cells.length ? cells[0].date.toISOString() : row,
					showDayNumbers: rowCnt > 1,
					showWeekNumbers: props.showWeekNumbers,
					todayRange,
					dateProfile: props.dateProfile,
					cells,
					renderIntro: props.renderRowIntro,
					businessHourSegs: businessHourSegsByRow[row],
					eventSelection: props.eventSelection,
					bgEventSegs: bgEventSegsByRow[row],
					fgEventSegs: fgEventSegsByRow[row],
					dateSelectionSegs: dateSelectionSegsByRow[row],
					eventDrag: eventDragByRow[row],
					eventResize: eventResizeByRow[row],
					dayMaxEvents: props.dayMaxEvents,
					dayMaxEventRows: props.dayMaxEventRows,
					clientWidth: props.clientWidth,
					clientHeight: props.clientHeight,
					cellMinHeight,
					forPrint: props.forPrint
				}))));
			}
			componentDidMount() {
				this.registerInteractiveComponent();
			}
			componentDidUpdate() {
				this.registerInteractiveComponent();
			}
			registerInteractiveComponent() {
				if (!this.rootEl) {
					const firstCellEl = this.rowRefs.currentMap[0].getCellEls()[0];
					const rootEl = firstCellEl ? firstCellEl.closest(".fc-daygrid-body") : null;
					if (rootEl) {
						this.rootEl = rootEl;
						this.context.registerInteractiveComponent(this, {
							el: rootEl,
							isHitComboAllowed: this.props.isHitComboAllowed
						});
					}
				}
			}
			componentWillUnmount() {
				if (this.rootEl) {
					this.context.unregisterInteractiveComponent(this);
					this.rootEl = null;
				}
			}
			prepareHits() {
				this.rowPositions = new internal_cjs.PositionCache(this.rootEl, this.rowRefs.collect().map((rowObj) => rowObj.getCellEls()[0]), false, true);
				this.colPositions = new internal_cjs.PositionCache(this.rootEl, this.rowRefs.currentMap[0].getCellEls(), true, false);
			}
			queryHit(positionLeft, positionTop) {
				let { colPositions, rowPositions } = this;
				let col = colPositions.leftToIndex(positionLeft);
				let row = rowPositions.topToIndex(positionTop);
				if (row != null && col != null) {
					let cell = this.props.cells[row][col];
					return {
						dateProfile: this.props.dateProfile,
						dateSpan: Object.assign({
							range: this.getCellRange(row, col),
							allDay: true
						}, cell.extraDateSpan),
						dayEl: this.getCellEl(row, col),
						rect: {
							left: colPositions.lefts[col],
							right: colPositions.rights[col],
							top: rowPositions.tops[row],
							bottom: rowPositions.bottoms[row]
						},
						layer: 0
					};
				}
				return null;
			}
			getCellEl(row, col) {
				return this.rowRefs.currentMap[row].getCellEls()[col];
			}
			getCellRange(row, col) {
				let start = this.props.cells[row][col].date;
				return {
					start,
					end: internal_cjs.addDays(start, 1)
				};
			}
		};
		function splitAllDaySegsByRow(segs, rowCnt) {
			return splitSegsByRow(segs.filter(isSegAllDay), rowCnt);
		}
		function isSegAllDay(seg) {
			return seg.eventRange.def.allDay;
		}
		var Table = class extends internal_cjs.DateComponent {
			constructor() {
				super(...arguments);
				this.elRef = preact_cjs.createRef();
				this.needsScrollReset = false;
			}
			render() {
				let { props } = this;
				let { dayMaxEventRows, dayMaxEvents, expandRows } = props;
				let limitViaBalanced = dayMaxEvents === true || dayMaxEventRows === true;
				if (limitViaBalanced && !expandRows) {
					limitViaBalanced = false;
					dayMaxEventRows = null;
					dayMaxEvents = null;
				}
				let classNames = [
					"fc-daygrid-body",
					limitViaBalanced ? "fc-daygrid-body-balanced" : "fc-daygrid-body-unbalanced",
					expandRows ? "" : "fc-daygrid-body-natural"
				];
				return preact_cjs.createElement("div", {
					ref: this.elRef,
					className: classNames.join(" "),
					style: {
						width: props.clientWidth,
						minWidth: props.tableMinWidth
					}
				}, preact_cjs.createElement("table", {
					role: "presentation",
					className: "fc-scrollgrid-sync-table",
					style: {
						width: props.clientWidth,
						minWidth: props.tableMinWidth,
						height: expandRows ? props.clientHeight : ""
					}
				}, props.colGroupNode, preact_cjs.createElement("tbody", { role: "presentation" }, preact_cjs.createElement(TableRows, {
					dateProfile: props.dateProfile,
					cells: props.cells,
					renderRowIntro: props.renderRowIntro,
					showWeekNumbers: props.showWeekNumbers,
					clientWidth: props.clientWidth,
					clientHeight: props.clientHeight,
					businessHourSegs: props.businessHourSegs,
					bgEventSegs: props.bgEventSegs,
					fgEventSegs: props.fgEventSegs,
					dateSelectionSegs: props.dateSelectionSegs,
					eventSelection: props.eventSelection,
					eventDrag: props.eventDrag,
					eventResize: props.eventResize,
					dayMaxEvents,
					dayMaxEventRows,
					forPrint: props.forPrint,
					isHitComboAllowed: props.isHitComboAllowed
				}))));
			}
			componentDidMount() {
				this.requestScrollReset();
			}
			componentDidUpdate(prevProps) {
				if (prevProps.dateProfile !== this.props.dateProfile) this.requestScrollReset();
				else this.flushScrollReset();
			}
			requestScrollReset() {
				this.needsScrollReset = true;
				this.flushScrollReset();
			}
			flushScrollReset() {
				if (this.needsScrollReset && this.props.clientWidth) {
					const subjectEl = getScrollSubjectEl(this.elRef.current, this.props.dateProfile);
					if (subjectEl) {
						const originEl = subjectEl.closest(".fc-daygrid-body");
						const scrollEl = originEl.closest(".fc-scroller");
						const scrollTop = subjectEl.getBoundingClientRect().top - originEl.getBoundingClientRect().top;
						scrollEl.scrollTop = scrollTop ? scrollTop + 1 : 0;
					}
					this.needsScrollReset = false;
				}
			}
		};
		function getScrollSubjectEl(containerEl, dateProfile) {
			let el;
			if (dateProfile.currentRangeUnit.match(/year|month/)) el = containerEl.querySelector(`[data-date="${internal_cjs.formatIsoMonthStr(dateProfile.currentDate)}-01"]`);
			if (!el) el = containerEl.querySelector(`[data-date="${internal_cjs.formatDayString(dateProfile.currentDate)}"]`);
			return el;
		}
		var DayTableSlicer = class extends internal_cjs.Slicer {
			constructor() {
				super(...arguments);
				this.forceDayIfListItem = true;
			}
			sliceRange(dateRange, dayTableModel) {
				return dayTableModel.sliceRange(dateRange);
			}
		};
		var DayTable = class extends internal_cjs.DateComponent {
			constructor() {
				super(...arguments);
				this.slicer = new DayTableSlicer();
				this.tableRef = preact_cjs.createRef();
			}
			render() {
				let { props, context } = this;
				return preact_cjs.createElement(Table, Object.assign({ ref: this.tableRef }, this.slicer.sliceProps(props, props.dateProfile, props.nextDayThreshold, context, props.dayTableModel), {
					dateProfile: props.dateProfile,
					cells: props.dayTableModel.cells,
					colGroupNode: props.colGroupNode,
					tableMinWidth: props.tableMinWidth,
					renderRowIntro: props.renderRowIntro,
					dayMaxEvents: props.dayMaxEvents,
					dayMaxEventRows: props.dayMaxEventRows,
					showWeekNumbers: props.showWeekNumbers,
					expandRows: props.expandRows,
					headerAlignElRef: props.headerAlignElRef,
					clientWidth: props.clientWidth,
					clientHeight: props.clientHeight,
					forPrint: props.forPrint
				}));
			}
		};
		var DayTableView = class extends TableView {
			constructor() {
				super(...arguments);
				this.buildDayTableModel = internal_cjs.memoize(buildDayTableModel);
				this.headerRef = preact_cjs.createRef();
				this.tableRef = preact_cjs.createRef();
			}
			render() {
				let { options, dateProfileGenerator } = this.context;
				let { props } = this;
				let dayTableModel = this.buildDayTableModel(props.dateProfile, dateProfileGenerator);
				let headerContent = options.dayHeaders && preact_cjs.createElement(internal_cjs.DayHeader, {
					ref: this.headerRef,
					dateProfile: props.dateProfile,
					dates: dayTableModel.headerDates,
					datesRepDistinctDays: dayTableModel.rowCnt === 1
				});
				let bodyContent = (contentArg) => preact_cjs.createElement(DayTable, {
					ref: this.tableRef,
					dateProfile: props.dateProfile,
					dayTableModel,
					businessHours: props.businessHours,
					dateSelection: props.dateSelection,
					eventStore: props.eventStore,
					eventUiBases: props.eventUiBases,
					eventSelection: props.eventSelection,
					eventDrag: props.eventDrag,
					eventResize: props.eventResize,
					nextDayThreshold: options.nextDayThreshold,
					colGroupNode: contentArg.tableColGroupNode,
					tableMinWidth: contentArg.tableMinWidth,
					dayMaxEvents: options.dayMaxEvents,
					dayMaxEventRows: options.dayMaxEventRows,
					showWeekNumbers: options.weekNumbers,
					expandRows: !props.isHeightAuto,
					headerAlignElRef: this.headerElRef,
					clientWidth: contentArg.clientWidth,
					clientHeight: contentArg.clientHeight,
					forPrint: props.forPrint
				});
				return options.dayMinWidth ? this.renderHScrollLayout(headerContent, bodyContent, dayTableModel.colCnt, options.dayMinWidth) : this.renderSimpleLayout(headerContent, bodyContent);
			}
		};
		function buildDayTableModel(dateProfile, dateProfileGenerator) {
			let daySeries = new internal_cjs.DaySeriesModel(dateProfile.renderRange, dateProfileGenerator);
			return new internal_cjs.DayTableModel(daySeries, /year|month|week/.test(dateProfile.currentRangeUnit));
		}
		var TableDateProfileGenerator = class extends internal_cjs.DateProfileGenerator {
			buildRenderRange(currentRange, currentRangeUnit, isRangeAllDay) {
				let renderRange = super.buildRenderRange(currentRange, currentRangeUnit, isRangeAllDay);
				let { props } = this;
				return buildDayTableRenderRange({
					currentRange: renderRange,
					snapToWeek: /^(year|month)$/.test(currentRangeUnit),
					fixedWeekCount: props.fixedWeekCount,
					dateEnv: props.dateEnv
				});
			}
		};
		function buildDayTableRenderRange(props) {
			let { dateEnv, currentRange } = props;
			let { start, end } = currentRange;
			let endOfWeek;
			if (props.snapToWeek) {
				start = dateEnv.startOfWeek(start);
				endOfWeek = dateEnv.startOfWeek(end);
				if (endOfWeek.valueOf() !== end.valueOf()) end = internal_cjs.addWeeks(endOfWeek, 1);
			}
			if (props.fixedWeekCount) {
				let lastMonthRenderStart = dateEnv.startOfWeek(dateEnv.startOfMonth(internal_cjs.addDays(currentRange.end, -1)));
				let rowCnt = Math.ceil(internal_cjs.diffWeeks(lastMonthRenderStart, end));
				end = internal_cjs.addWeeks(end, 6 - rowCnt);
			}
			return {
				start,
				end
			};
		}
		internal_cjs.injectStyles(":root{--fc-daygrid-event-dot-width:8px}.fc-daygrid-day-events:after,.fc-daygrid-day-events:before,.fc-daygrid-day-frame:after,.fc-daygrid-day-frame:before,.fc-daygrid-event-harness:after,.fc-daygrid-event-harness:before{clear:both;content:\"\";display:table}.fc .fc-daygrid-body{position:relative;z-index:1}.fc .fc-daygrid-day.fc-day-today{background-color:var(--fc-today-bg-color)}.fc .fc-daygrid-day-frame{min-height:100%;position:relative}.fc .fc-daygrid-day-top{display:flex;flex-direction:row-reverse}.fc .fc-day-other .fc-daygrid-day-top{opacity:.3}.fc .fc-daygrid-day-number{padding:4px;position:relative;z-index:4}.fc .fc-daygrid-month-start{font-size:1.1em;font-weight:700}.fc .fc-daygrid-day-events{margin-top:1px}.fc .fc-daygrid-body-balanced .fc-daygrid-day-events{left:0;position:absolute;right:0}.fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events{min-height:2em;position:relative}.fc .fc-daygrid-body-natural .fc-daygrid-day-events{margin-bottom:1em}.fc .fc-daygrid-event-harness{position:relative}.fc .fc-daygrid-event-harness-abs{left:0;position:absolute;right:0;top:0}.fc .fc-daygrid-bg-harness{bottom:0;position:absolute;top:0}.fc .fc-daygrid-day-bg .fc-non-business{z-index:1}.fc .fc-daygrid-day-bg .fc-bg-event{z-index:2}.fc .fc-daygrid-day-bg .fc-highlight{z-index:3}.fc .fc-daygrid-event{margin-top:1px;z-index:6}.fc .fc-daygrid-event.fc-event-mirror{z-index:7}.fc .fc-daygrid-day-bottom{font-size:.85em;margin:0 2px}.fc .fc-daygrid-day-bottom:after,.fc .fc-daygrid-day-bottom:before{clear:both;content:\"\";display:table}.fc .fc-daygrid-more-link{border-radius:3px;cursor:pointer;line-height:1;margin-top:1px;max-width:100%;overflow:hidden;padding:2px;position:relative;white-space:nowrap;z-index:4}.fc .fc-daygrid-more-link:hover{background-color:rgba(0,0,0,.1)}.fc .fc-daygrid-week-number{background-color:var(--fc-neutral-bg-color);color:var(--fc-neutral-text-color);min-width:1.5em;padding:2px;position:absolute;text-align:center;top:0;z-index:5}.fc .fc-more-popover .fc-popover-body{min-width:220px;padding:10px}.fc-direction-ltr .fc-daygrid-event.fc-event-start,.fc-direction-rtl .fc-daygrid-event.fc-event-end{margin-left:2px}.fc-direction-ltr .fc-daygrid-event.fc-event-end,.fc-direction-rtl .fc-daygrid-event.fc-event-start{margin-right:2px}.fc-direction-ltr .fc-daygrid-more-link{float:left}.fc-direction-ltr .fc-daygrid-week-number{border-radius:0 0 3px 0;left:0}.fc-direction-rtl .fc-daygrid-more-link{float:right}.fc-direction-rtl .fc-daygrid-week-number{border-radius:0 0 0 3px;right:0}.fc-liquid-hack .fc-daygrid-day-frame{position:static}.fc-daygrid-event{border-radius:3px;font-size:var(--fc-small-font-size);position:relative;white-space:nowrap}.fc-daygrid-block-event .fc-event-time{font-weight:700}.fc-daygrid-block-event .fc-event-time,.fc-daygrid-block-event .fc-event-title{padding:1px}.fc-daygrid-dot-event{align-items:center;display:flex;padding:2px 0}.fc-daygrid-dot-event .fc-event-title{flex-grow:1;flex-shrink:1;font-weight:700;min-width:0;overflow:hidden}.fc-daygrid-dot-event.fc-event-mirror,.fc-daygrid-dot-event:hover{background:rgba(0,0,0,.1)}.fc-daygrid-dot-event.fc-event-selected:before{bottom:-10px;top:-10px}.fc-daygrid-event-dot{border:calc(var(--fc-daygrid-event-dot-width)/2) solid var(--fc-event-border-color);border-radius:calc(var(--fc-daygrid-event-dot-width)/2);box-sizing:content-box;height:0;margin:0 4px;width:0}.fc-direction-ltr .fc-daygrid-event .fc-event-time{margin-right:3px}.fc-direction-rtl .fc-daygrid-event .fc-event-time{margin-left:3px}");
		exports.DayGridView = DayTableView;
		exports.DayTable = DayTable;
		exports.DayTableSlicer = DayTableSlicer;
		exports.Table = Table;
		exports.TableDateProfileGenerator = TableDateProfileGenerator;
		exports.TableRows = TableRows;
		exports.TableView = TableView;
		exports.buildDayTableModel = buildDayTableModel;
		exports.buildDayTableRenderRange = buildDayTableRenderRange;
	}));
	//#endregion
	//#region node_modules/.pnpm/@fullcalendar+daygrid@6.1.21_@fullcalendar+core@6.1.21/node_modules/@fullcalendar/daygrid/index.cjs
	var require_daygrid = /* @__PURE__ */ __commonJSMin(((exports) => {
		Object.defineProperty(exports, "__esModule", { value: true });
		var index_cjs = require_core();
		var internalCommon = require_internal$1();
		require_internal$2();
		require_preact();
		exports["default"] = index_cjs.createPlugin({
			name: "@fullcalendar/daygrid",
			initialView: "dayGridMonth",
			views: {
				dayGrid: {
					component: internalCommon.DayGridView,
					dateProfileGeneratorClass: internalCommon.TableDateProfileGenerator
				},
				dayGridDay: {
					type: "dayGrid",
					duration: { days: 1 }
				},
				dayGridWeek: {
					type: "dayGrid",
					duration: { weeks: 1 }
				},
				dayGridMonth: {
					type: "dayGrid",
					duration: { months: 1 },
					fixedWeekCount: true
				},
				dayGridYear: {
					type: "dayGrid",
					duration: { years: 1 }
				}
			}
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/@fullcalendar+timegrid@6.1.21_@fullcalendar+core@6.1.21/node_modules/@fullcalendar/timegrid/internal.cjs
	var require_internal = /* @__PURE__ */ __commonJSMin(((exports) => {
		Object.defineProperty(exports, "__esModule", { value: true });
		var internal_cjs = require_internal$2();
		var preact_cjs = require_preact();
		var internal_cjs$1 = require_internal$1();
		var AllDaySplitter = class extends internal_cjs.Splitter {
			getKeyInfo() {
				return {
					allDay: {},
					timed: {}
				};
			}
			getKeysForDateSpan(dateSpan) {
				if (dateSpan.allDay) return ["allDay"];
				return ["timed"];
			}
			getKeysForEventDef(eventDef) {
				if (!eventDef.allDay) return ["timed"];
				if (internal_cjs.hasBgRendering(eventDef)) return ["timed", "allDay"];
				return ["allDay"];
			}
		};
		const DEFAULT_SLAT_LABEL_FORMAT = internal_cjs.createFormatter({
			hour: "numeric",
			minute: "2-digit",
			omitZeroMinute: true,
			meridiem: "short"
		});
		function TimeColsAxisCell(props) {
			let classNames = [
				"fc-timegrid-slot",
				"fc-timegrid-slot-label",
				props.isLabeled ? "fc-scrollgrid-shrink" : "fc-timegrid-slot-minor"
			];
			return preact_cjs.createElement(internal_cjs.ViewContextType.Consumer, null, (context) => {
				if (!props.isLabeled) return preact_cjs.createElement("td", {
					className: classNames.join(" "),
					"data-time": props.isoTimeStr
				});
				let { dateEnv, options, viewApi } = context;
				let labelFormat = options.slotLabelFormat == null ? DEFAULT_SLAT_LABEL_FORMAT : Array.isArray(options.slotLabelFormat) ? internal_cjs.createFormatter(options.slotLabelFormat[0]) : internal_cjs.createFormatter(options.slotLabelFormat);
				let renderProps = {
					level: 0,
					time: props.time,
					date: dateEnv.toDate(props.date),
					view: viewApi,
					text: dateEnv.format(props.date, labelFormat)
				};
				return preact_cjs.createElement(internal_cjs.ContentContainer, {
					elTag: "td",
					elClasses: classNames,
					elAttrs: { "data-time": props.isoTimeStr },
					renderProps,
					generatorName: "slotLabelContent",
					customGenerator: options.slotLabelContent,
					defaultGenerator: renderInnerContent,
					classNameGenerator: options.slotLabelClassNames,
					didMount: options.slotLabelDidMount,
					willUnmount: options.slotLabelWillUnmount
				}, (InnerContent) => preact_cjs.createElement("div", { className: "fc-timegrid-slot-label-frame fc-scrollgrid-shrink-frame" }, preact_cjs.createElement(InnerContent, {
					elTag: "div",
					elClasses: ["fc-timegrid-slot-label-cushion", "fc-scrollgrid-shrink-cushion"]
				})));
			});
		}
		function renderInnerContent(props) {
			return props.text;
		}
		var TimeBodyAxis = class extends internal_cjs.BaseComponent {
			render() {
				return this.props.slatMetas.map((slatMeta) => preact_cjs.createElement("tr", { key: slatMeta.key }, preact_cjs.createElement(TimeColsAxisCell, Object.assign({}, slatMeta))));
			}
		};
		const DEFAULT_WEEK_NUM_FORMAT = internal_cjs.createFormatter({ week: "short" });
		const AUTO_ALL_DAY_MAX_EVENT_ROWS = 5;
		var TimeColsView = class extends internal_cjs.DateComponent {
			constructor() {
				super(...arguments);
				this.allDaySplitter = new AllDaySplitter();
				this.headerElRef = preact_cjs.createRef();
				this.rootElRef = preact_cjs.createRef();
				this.scrollerElRef = preact_cjs.createRef();
				this.state = { slatCoords: null };
				this.handleScrollTopRequest = (scrollTop) => {
					let scrollerEl = this.scrollerElRef.current;
					if (scrollerEl) scrollerEl.scrollTop = scrollTop;
				};
				this.renderHeadAxis = (rowKey, frameHeight = "") => {
					let { options } = this.context;
					let { dateProfile } = this.props;
					let range = dateProfile.renderRange;
					let navLinkAttrs = internal_cjs.diffDays(range.start, range.end) === 1 ? internal_cjs.buildNavLinkAttrs(this.context, range.start, "week") : {};
					if (options.weekNumbers && rowKey === "day") return preact_cjs.createElement(internal_cjs.WeekNumberContainer, {
						elTag: "th",
						elClasses: ["fc-timegrid-axis", "fc-scrollgrid-shrink"],
						elAttrs: { "aria-hidden": true },
						date: range.start,
						defaultFormat: DEFAULT_WEEK_NUM_FORMAT
					}, (InnerContent) => preact_cjs.createElement("div", {
						className: [
							"fc-timegrid-axis-frame",
							"fc-scrollgrid-shrink-frame",
							"fc-timegrid-axis-frame-liquid"
						].join(" "),
						style: { height: frameHeight }
					}, preact_cjs.createElement(InnerContent, {
						elTag: "a",
						elClasses: [
							"fc-timegrid-axis-cushion",
							"fc-scrollgrid-shrink-cushion",
							"fc-scrollgrid-sync-inner"
						],
						elAttrs: navLinkAttrs
					})));
					return preact_cjs.createElement("th", {
						"aria-hidden": true,
						className: "fc-timegrid-axis"
					}, preact_cjs.createElement("div", {
						className: "fc-timegrid-axis-frame",
						style: { height: frameHeight }
					}));
				};
				this.renderTableRowAxis = (rowHeight) => {
					let { options, viewApi } = this.context;
					let renderProps = {
						text: options.allDayText,
						view: viewApi
					};
					return preact_cjs.createElement(internal_cjs.ContentContainer, {
						elTag: "td",
						elClasses: ["fc-timegrid-axis", "fc-scrollgrid-shrink"],
						elAttrs: { "aria-hidden": true },
						renderProps,
						generatorName: "allDayContent",
						customGenerator: options.allDayContent,
						defaultGenerator: renderAllDayInner,
						classNameGenerator: options.allDayClassNames,
						didMount: options.allDayDidMount,
						willUnmount: options.allDayWillUnmount
					}, (InnerContent) => preact_cjs.createElement("div", {
						className: [
							"fc-timegrid-axis-frame",
							"fc-scrollgrid-shrink-frame",
							rowHeight == null ? " fc-timegrid-axis-frame-liquid" : ""
						].join(" "),
						style: { height: rowHeight }
					}, preact_cjs.createElement(InnerContent, {
						elTag: "span",
						elClasses: [
							"fc-timegrid-axis-cushion",
							"fc-scrollgrid-shrink-cushion",
							"fc-scrollgrid-sync-inner"
						]
					})));
				};
				this.handleSlatCoords = (slatCoords) => {
					this.setState({ slatCoords });
				};
			}
			renderSimpleLayout(headerRowContent, allDayContent, timeContent) {
				let { context, props } = this;
				let sections = [];
				let stickyHeaderDates = internal_cjs.getStickyHeaderDates(context.options);
				if (headerRowContent) sections.push({
					type: "header",
					key: "header",
					isSticky: stickyHeaderDates,
					chunk: {
						elRef: this.headerElRef,
						tableClassName: "fc-col-header",
						rowContent: headerRowContent
					}
				});
				if (allDayContent) {
					sections.push({
						type: "body",
						key: "all-day",
						chunk: { content: allDayContent }
					});
					sections.push({
						type: "body",
						key: "all-day-divider",
						outerContent: preact_cjs.createElement("tr", {
							role: "presentation",
							className: "fc-scrollgrid-section"
						}, preact_cjs.createElement("td", { className: "fc-timegrid-divider " + context.theme.getClass("tableCellShaded") }))
					});
				}
				sections.push({
					type: "body",
					key: "body",
					liquid: true,
					expandRows: Boolean(context.options.expandRows),
					chunk: {
						scrollerElRef: this.scrollerElRef,
						content: timeContent
					}
				});
				return preact_cjs.createElement(internal_cjs.ViewContainer, {
					elRef: this.rootElRef,
					elClasses: ["fc-timegrid"],
					viewSpec: context.viewSpec
				}, preact_cjs.createElement(internal_cjs.SimpleScrollGrid, {
					liquid: !props.isHeightAuto && !props.forPrint,
					collapsibleWidth: props.forPrint,
					cols: [{ width: "shrink" }],
					sections
				}));
			}
			renderHScrollLayout(headerRowContent, allDayContent, timeContent, colCnt, dayMinWidth, slatMetas, slatCoords) {
				let ScrollGrid = this.context.pluginHooks.scrollGridImpl;
				if (!ScrollGrid) throw new Error("No ScrollGrid implementation");
				let { context, props } = this;
				let stickyHeaderDates = !props.forPrint && internal_cjs.getStickyHeaderDates(context.options);
				let stickyFooterScrollbar = !props.forPrint && internal_cjs.getStickyFooterScrollbar(context.options);
				let sections = [];
				if (headerRowContent) sections.push({
					type: "header",
					key: "header",
					isSticky: stickyHeaderDates,
					syncRowHeights: true,
					chunks: [{
						key: "axis",
						rowContent: (arg) => preact_cjs.createElement("tr", { role: "presentation" }, this.renderHeadAxis("day", arg.rowSyncHeights[0]))
					}, {
						key: "cols",
						elRef: this.headerElRef,
						tableClassName: "fc-col-header",
						rowContent: headerRowContent
					}]
				});
				if (allDayContent) {
					sections.push({
						type: "body",
						key: "all-day",
						syncRowHeights: true,
						chunks: [{
							key: "axis",
							rowContent: (contentArg) => preact_cjs.createElement("tr", { role: "presentation" }, this.renderTableRowAxis(contentArg.rowSyncHeights[0]))
						}, {
							key: "cols",
							content: allDayContent
						}]
					});
					sections.push({
						key: "all-day-divider",
						type: "body",
						outerContent: preact_cjs.createElement("tr", {
							role: "presentation",
							className: "fc-scrollgrid-section"
						}, preact_cjs.createElement("td", {
							colSpan: 2,
							className: "fc-timegrid-divider " + context.theme.getClass("tableCellShaded")
						}))
					});
				}
				let isNowIndicator = context.options.nowIndicator;
				sections.push({
					type: "body",
					key: "body",
					liquid: true,
					expandRows: Boolean(context.options.expandRows),
					chunks: [{
						key: "axis",
						content: (arg) => preact_cjs.createElement("div", { className: "fc-timegrid-axis-chunk" }, preact_cjs.createElement("table", {
							"aria-hidden": true,
							style: { height: arg.expandRows ? arg.clientHeight : "" }
						}, arg.tableColGroupNode, preact_cjs.createElement("tbody", null, preact_cjs.createElement(TimeBodyAxis, { slatMetas }))), preact_cjs.createElement("div", { className: "fc-timegrid-now-indicator-container" }, preact_cjs.createElement(internal_cjs.NowTimer, { unit: isNowIndicator ? "minute" : "day" }, (nowDate) => {
							let nowIndicatorTop = isNowIndicator && slatCoords && slatCoords.safeComputeTop(nowDate);
							if (typeof nowIndicatorTop === "number") return preact_cjs.createElement(internal_cjs.NowIndicatorContainer, {
								elClasses: ["fc-timegrid-now-indicator-arrow"],
								elStyle: { top: nowIndicatorTop },
								isAxis: true,
								date: nowDate
							});
							return null;
						})))
					}, {
						key: "cols",
						scrollerElRef: this.scrollerElRef,
						content: timeContent
					}]
				});
				if (stickyFooterScrollbar) sections.push({
					key: "footer",
					type: "footer",
					isSticky: true,
					chunks: [{
						key: "axis",
						content: internal_cjs.renderScrollShim
					}, {
						key: "cols",
						content: internal_cjs.renderScrollShim
					}]
				});
				return preact_cjs.createElement(internal_cjs.ViewContainer, {
					elRef: this.rootElRef,
					elClasses: ["fc-timegrid"],
					viewSpec: context.viewSpec
				}, preact_cjs.createElement(ScrollGrid, {
					liquid: !props.isHeightAuto && !props.forPrint,
					forPrint: props.forPrint,
					collapsibleWidth: false,
					colGroups: [{
						width: "shrink",
						cols: [{ width: "shrink" }]
					}, { cols: [{
						span: colCnt,
						minWidth: dayMinWidth
					}] }],
					sections
				}));
			}
			getAllDayMaxEventProps() {
				let { dayMaxEvents, dayMaxEventRows } = this.context.options;
				if (dayMaxEvents === true || dayMaxEventRows === true) {
					dayMaxEvents = void 0;
					dayMaxEventRows = AUTO_ALL_DAY_MAX_EVENT_ROWS;
				}
				return {
					dayMaxEvents,
					dayMaxEventRows
				};
			}
		};
		function renderAllDayInner(renderProps) {
			return renderProps.text;
		}
		var TimeColsSlatsCoords = class {
			constructor(positions, dateProfile, slotDuration) {
				this.positions = positions;
				this.dateProfile = dateProfile;
				this.slotDuration = slotDuration;
			}
			safeComputeTop(date) {
				let { dateProfile } = this;
				if (internal_cjs.rangeContainsMarker(dateProfile.currentRange, date)) {
					let startOfDayDate = internal_cjs.startOfDay(date);
					let timeMs = date.valueOf() - startOfDayDate.valueOf();
					if (timeMs >= internal_cjs.asRoughMs(dateProfile.slotMinTime) && timeMs < internal_cjs.asRoughMs(dateProfile.slotMaxTime)) return this.computeTimeTop(internal_cjs.createDuration(timeMs));
				}
				return null;
			}
			computeDateTop(when, startOfDayDate) {
				if (!startOfDayDate) startOfDayDate = internal_cjs.startOfDay(when);
				return this.computeTimeTop(internal_cjs.createDuration(when.valueOf() - startOfDayDate.valueOf()));
			}
			computeTimeTop(duration) {
				let { positions, dateProfile } = this;
				let len = positions.els.length;
				let slatCoverage = (duration.milliseconds - internal_cjs.asRoughMs(dateProfile.slotMinTime)) / internal_cjs.asRoughMs(this.slotDuration);
				let slatIndex;
				let slatRemainder;
				slatCoverage = Math.max(0, slatCoverage);
				slatCoverage = Math.min(len, slatCoverage);
				slatIndex = Math.floor(slatCoverage);
				slatIndex = Math.min(slatIndex, len - 1);
				slatRemainder = slatCoverage - slatIndex;
				return positions.tops[slatIndex] + positions.getHeight(slatIndex) * slatRemainder;
			}
		};
		var TimeColsSlatsBody = class extends internal_cjs.BaseComponent {
			render() {
				let { props, context } = this;
				let { options } = context;
				let { slatElRefs } = props;
				return preact_cjs.createElement("tbody", null, props.slatMetas.map((slatMeta, i) => {
					let renderProps = {
						time: slatMeta.time,
						date: context.dateEnv.toDate(slatMeta.date),
						view: context.viewApi
					};
					return preact_cjs.createElement("tr", {
						key: slatMeta.key,
						ref: slatElRefs.createRef(slatMeta.key)
					}, props.axis && preact_cjs.createElement(TimeColsAxisCell, Object.assign({}, slatMeta)), preact_cjs.createElement(internal_cjs.ContentContainer, {
						elTag: "td",
						elClasses: [
							"fc-timegrid-slot",
							"fc-timegrid-slot-lane",
							!slatMeta.isLabeled && "fc-timegrid-slot-minor"
						],
						elAttrs: { "data-time": slatMeta.isoTimeStr },
						renderProps,
						generatorName: "slotLaneContent",
						customGenerator: options.slotLaneContent,
						classNameGenerator: options.slotLaneClassNames,
						didMount: options.slotLaneDidMount,
						willUnmount: options.slotLaneWillUnmount
					}));
				}));
			}
		};
		var TimeColsSlats = class extends internal_cjs.BaseComponent {
			constructor() {
				super(...arguments);
				this.rootElRef = preact_cjs.createRef();
				this.slatElRefs = new internal_cjs.RefMap();
			}
			render() {
				let { props, context } = this;
				return preact_cjs.createElement("div", {
					ref: this.rootElRef,
					className: "fc-timegrid-slots"
				}, preact_cjs.createElement("table", {
					"aria-hidden": true,
					className: context.theme.getClass("table"),
					style: {
						minWidth: props.tableMinWidth,
						width: props.clientWidth,
						height: props.minHeight
					}
				}, props.tableColGroupNode, preact_cjs.createElement(TimeColsSlatsBody, {
					slatElRefs: this.slatElRefs,
					axis: props.axis,
					slatMetas: props.slatMetas
				})));
			}
			componentDidMount() {
				this.updateSizing();
			}
			componentDidUpdate() {
				this.updateSizing();
			}
			componentWillUnmount() {
				if (this.props.onCoords) this.props.onCoords(null);
			}
			updateSizing() {
				let { context, props } = this;
				if (props.onCoords && props.clientWidth !== null) {
					if (this.rootElRef.current.offsetHeight) props.onCoords(new TimeColsSlatsCoords(new internal_cjs.PositionCache(this.rootElRef.current, collectSlatEls(this.slatElRefs.currentMap, props.slatMetas), false, true), this.props.dateProfile, context.options.slotDuration));
				}
			}
		};
		function collectSlatEls(elMap, slatMetas) {
			return slatMetas.map((slatMeta) => elMap[slatMeta.key]);
		}
		function splitSegsByCol(segs, colCnt) {
			let segsByCol = [];
			let i;
			for (i = 0; i < colCnt; i += 1) segsByCol.push([]);
			if (segs) for (i = 0; i < segs.length; i += 1) segsByCol[segs[i].col].push(segs[i]);
			return segsByCol;
		}
		function splitInteractionByCol(ui, colCnt) {
			let byRow = [];
			if (!ui) for (let i = 0; i < colCnt; i += 1) byRow[i] = null;
			else {
				for (let i = 0; i < colCnt; i += 1) byRow[i] = {
					affectedInstances: ui.affectedInstances,
					isEvent: ui.isEvent,
					segs: []
				};
				for (let seg of ui.segs) byRow[seg.col].segs.push(seg);
			}
			return byRow;
		}
		var TimeColMoreLink = class extends internal_cjs.BaseComponent {
			render() {
				let { props } = this;
				return preact_cjs.createElement(internal_cjs.MoreLinkContainer, {
					elClasses: ["fc-timegrid-more-link"],
					elStyle: {
						top: props.top,
						bottom: props.bottom
					},
					allDayDate: null,
					moreCnt: props.hiddenSegs.length,
					allSegs: props.hiddenSegs,
					hiddenSegs: props.hiddenSegs,
					extraDateSpan: props.extraDateSpan,
					dateProfile: props.dateProfile,
					todayRange: props.todayRange,
					popoverContent: () => renderPlainFgSegs(props.hiddenSegs, props),
					defaultGenerator: renderMoreLinkInner,
					forceTimed: true
				}, (InnerContent) => preact_cjs.createElement(InnerContent, {
					elTag: "div",
					elClasses: ["fc-timegrid-more-link-inner", "fc-sticky"]
				}));
			}
		};
		function renderMoreLinkInner(props) {
			return props.shortText;
		}
		function buildPositioning(segInputs, strictOrder, maxStackCnt) {
			let hierarchy = new internal_cjs.SegHierarchy();
			if (strictOrder != null) hierarchy.strictOrder = strictOrder;
			if (maxStackCnt != null) hierarchy.maxStackCnt = maxStackCnt;
			let hiddenEntries = hierarchy.addSegs(segInputs);
			let hiddenGroups = internal_cjs.groupIntersectingEntries(hiddenEntries);
			let web = buildWeb(hierarchy);
			web = stretchWeb(web, 1);
			return {
				segRects: webToRects(web),
				hiddenGroups
			};
		}
		function buildWeb(hierarchy) {
			const { entriesByLevel } = hierarchy;
			const buildNode = cacheable((level, lateral) => level + ":" + lateral, (level, lateral) => {
				let nextLevelRes = buildNodes(findNextLevelSegs(hierarchy, level, lateral), buildNode);
				let entry = entriesByLevel[level][lateral];
				return [Object.assign(Object.assign({}, entry), { nextLevelNodes: nextLevelRes[0] }), entry.thickness + nextLevelRes[1]];
			});
			return buildNodes(entriesByLevel.length ? {
				level: 0,
				lateralStart: 0,
				lateralEnd: entriesByLevel[0].length
			} : null, buildNode)[0];
		}
		function buildNodes(siblingRange, buildNode) {
			if (!siblingRange) return [[], 0];
			let { level, lateralStart, lateralEnd } = siblingRange;
			let lateral = lateralStart;
			let pairs = [];
			while (lateral < lateralEnd) {
				pairs.push(buildNode(level, lateral));
				lateral += 1;
			}
			pairs.sort(cmpDescPressures);
			return [pairs.map(extractNode), pairs[0][1]];
		}
		function cmpDescPressures(a, b) {
			return b[1] - a[1];
		}
		function extractNode(a) {
			return a[0];
		}
		function findNextLevelSegs(hierarchy, subjectLevel, subjectLateral) {
			let { levelCoords, entriesByLevel } = hierarchy;
			let subjectEntry = entriesByLevel[subjectLevel][subjectLateral];
			let afterSubject = levelCoords[subjectLevel] + subjectEntry.thickness;
			let levelCnt = levelCoords.length;
			let level = subjectLevel;
			for (; level < levelCnt && levelCoords[level] < afterSubject; level += 1);
			for (; level < levelCnt; level += 1) {
				let entries = entriesByLevel[level];
				let entry;
				let searchIndex = internal_cjs.binarySearch(entries, subjectEntry.span.start, internal_cjs.getEntrySpanEnd);
				let lateralStart = searchIndex[0] + searchIndex[1];
				let lateralEnd = lateralStart;
				while ((entry = entries[lateralEnd]) && entry.span.start < subjectEntry.span.end) lateralEnd += 1;
				if (lateralStart < lateralEnd) return {
					level,
					lateralStart,
					lateralEnd
				};
			}
			return null;
		}
		function stretchWeb(topLevelNodes, totalThickness) {
			const stretchNode = cacheable((node, startCoord, prevThickness) => internal_cjs.buildEntryKey(node), (node, startCoord, prevThickness) => {
				let { nextLevelNodes, thickness } = node;
				let allThickness = thickness + prevThickness;
				let thicknessFraction = thickness / allThickness;
				let endCoord;
				let newChildren = [];
				if (!nextLevelNodes.length) endCoord = totalThickness;
				else for (let childNode of nextLevelNodes) if (endCoord === void 0) {
					let res = stretchNode(childNode, startCoord, allThickness);
					endCoord = res[0];
					newChildren.push(res[1]);
				} else {
					let res = stretchNode(childNode, endCoord, 0);
					newChildren.push(res[1]);
				}
				let newThickness = (endCoord - startCoord) * thicknessFraction;
				return [endCoord - newThickness, Object.assign(Object.assign({}, node), {
					thickness: newThickness,
					nextLevelNodes: newChildren
				})];
			});
			return topLevelNodes.map((node) => stretchNode(node, 0, 0)[1]);
		}
		function webToRects(topLevelNodes) {
			let rects = [];
			const processNode = cacheable((node, levelCoord, stackDepth) => internal_cjs.buildEntryKey(node), (node, levelCoord, stackDepth) => {
				let rect = Object.assign(Object.assign({}, node), {
					levelCoord,
					stackDepth,
					stackForward: 0
				});
				rects.push(rect);
				return rect.stackForward = processNodes(node.nextLevelNodes, levelCoord + node.thickness, stackDepth + 1) + 1;
			});
			function processNodes(nodes, levelCoord, stackDepth) {
				let stackForward = 0;
				for (let node of nodes) stackForward = Math.max(processNode(node, levelCoord, stackDepth), stackForward);
				return stackForward;
			}
			processNodes(topLevelNodes, 0, 0);
			return rects;
		}
		function cacheable(keyFunc, workFunc) {
			const cache = {};
			return (...args) => {
				let key = keyFunc(...args);
				return key in cache ? cache[key] : cache[key] = workFunc(...args);
			};
		}
		function computeSegVCoords(segs, colDate, slatCoords = null, eventMinHeight = 0) {
			let vcoords = [];
			if (slatCoords) for (let i = 0; i < segs.length; i += 1) {
				let seg = segs[i];
				let spanStart = slatCoords.computeDateTop(seg.start, colDate);
				let spanEnd = Math.max(spanStart + (eventMinHeight || 0), slatCoords.computeDateTop(seg.end, colDate));
				vcoords.push({
					start: Math.round(spanStart),
					end: Math.round(spanEnd)
				});
			}
			return vcoords;
		}
		function computeFgSegPlacements(segs, segVCoords, eventOrderStrict, eventMaxStack) {
			let segInputs = [];
			let dumbSegs = [];
			for (let i = 0; i < segs.length; i += 1) {
				let vcoords = segVCoords[i];
				if (vcoords) segInputs.push({
					index: i,
					thickness: 1,
					span: vcoords
				});
				else dumbSegs.push(segs[i]);
			}
			let { segRects, hiddenGroups } = buildPositioning(segInputs, eventOrderStrict, eventMaxStack);
			let segPlacements = [];
			for (let segRect of segRects) segPlacements.push({
				seg: segs[segRect.index],
				rect: segRect
			});
			for (let dumbSeg of dumbSegs) segPlacements.push({
				seg: dumbSeg,
				rect: null
			});
			return {
				segPlacements,
				hiddenGroups
			};
		}
		const DEFAULT_TIME_FORMAT = internal_cjs.createFormatter({
			hour: "numeric",
			minute: "2-digit",
			meridiem: false
		});
		var TimeColEvent = class extends internal_cjs.BaseComponent {
			render() {
				return preact_cjs.createElement(internal_cjs.StandardEvent, Object.assign({}, this.props, {
					elClasses: [
						"fc-timegrid-event",
						"fc-v-event",
						this.props.isShort && "fc-timegrid-event-short"
					],
					defaultTimeFormat: DEFAULT_TIME_FORMAT
				}));
			}
		};
		var TimeCol = class extends internal_cjs.BaseComponent {
			constructor() {
				super(...arguments);
				this.sortEventSegs = internal_cjs.memoize(internal_cjs.sortEventSegs);
			}
			render() {
				let { props, context } = this;
				let { options } = context;
				let isSelectMirror = options.selectMirror;
				let mirrorSegs = props.eventDrag && props.eventDrag.segs || props.eventResize && props.eventResize.segs || isSelectMirror && props.dateSelectionSegs || [];
				let interactionAffectedInstances = props.eventDrag && props.eventDrag.affectedInstances || props.eventResize && props.eventResize.affectedInstances || {};
				let sortedFgSegs = this.sortEventSegs(props.fgEventSegs, options.eventOrder);
				return preact_cjs.createElement(internal_cjs.DayCellContainer, {
					elTag: "td",
					elRef: props.elRef,
					elClasses: ["fc-timegrid-col", ...props.extraClassNames || []],
					elAttrs: Object.assign({ role: "gridcell" }, props.extraDataAttrs),
					date: props.date,
					dateProfile: props.dateProfile,
					todayRange: props.todayRange,
					extraRenderProps: props.extraRenderProps
				}, (InnerContent) => preact_cjs.createElement("div", { className: "fc-timegrid-col-frame" }, preact_cjs.createElement("div", { className: "fc-timegrid-col-bg" }, this.renderFillSegs(props.businessHourSegs, "non-business"), this.renderFillSegs(props.bgEventSegs, "bg-event"), this.renderFillSegs(props.dateSelectionSegs, "highlight")), preact_cjs.createElement("div", { className: "fc-timegrid-col-events" }, this.renderFgSegs(sortedFgSegs, interactionAffectedInstances, false, false, false)), preact_cjs.createElement("div", { className: "fc-timegrid-col-events" }, this.renderFgSegs(mirrorSegs, {}, Boolean(props.eventDrag), Boolean(props.eventResize), Boolean(isSelectMirror), "mirror")), preact_cjs.createElement("div", { className: "fc-timegrid-now-indicator-container" }, this.renderNowIndicator(props.nowIndicatorSegs)), internal_cjs.hasCustomDayCellContent(options) && preact_cjs.createElement(InnerContent, {
					elTag: "div",
					elClasses: ["fc-timegrid-col-misc"]
				})));
			}
			renderFgSegs(sortedFgSegs, segIsInvisible, isDragging, isResizing, isDateSelecting, forcedKey) {
				let { props } = this;
				if (props.forPrint) return renderPlainFgSegs(sortedFgSegs, props);
				return this.renderPositionedFgSegs(sortedFgSegs, segIsInvisible, isDragging, isResizing, isDateSelecting, forcedKey);
			}
			renderPositionedFgSegs(segs, segIsInvisible, isDragging, isResizing, isDateSelecting, forcedKey) {
				let { eventMaxStack, eventShortHeight, eventOrderStrict, eventMinHeight } = this.context.options;
				let { date, slatCoords, eventSelection, todayRange, nowDate } = this.props;
				let isMirror = isDragging || isResizing || isDateSelecting;
				let { segPlacements, hiddenGroups } = computeFgSegPlacements(segs, computeSegVCoords(segs, date, slatCoords, eventMinHeight), eventOrderStrict, eventMaxStack);
				return preact_cjs.createElement(preact_cjs.Fragment, null, this.renderHiddenGroups(hiddenGroups, segs), segPlacements.map((segPlacement) => {
					let { seg, rect } = segPlacement;
					let instanceId = seg.eventRange.instance.instanceId;
					let isVisible = isMirror || Boolean(!segIsInvisible[instanceId] && rect);
					let vStyle = computeSegVStyle(rect && rect.span);
					let hStyle = !isMirror && rect ? this.computeSegHStyle(rect) : {
						left: 0,
						right: 0
					};
					let isInset = Boolean(rect) && rect.stackForward > 0;
					let isShort = Boolean(rect) && rect.span.end - rect.span.start < eventShortHeight;
					return preact_cjs.createElement("div", {
						className: "fc-timegrid-event-harness" + (isInset ? " fc-timegrid-event-harness-inset" : ""),
						key: forcedKey || instanceId,
						style: Object.assign(Object.assign({ visibility: isVisible ? "" : "hidden" }, vStyle), hStyle)
					}, preact_cjs.createElement(TimeColEvent, Object.assign({
						seg,
						isDragging,
						isResizing,
						isDateSelecting,
						isSelected: instanceId === eventSelection,
						isShort
					}, internal_cjs.getSegMeta(seg, todayRange, nowDate))));
				}));
			}
			renderHiddenGroups(hiddenGroups, segs) {
				let { extraDateSpan, dateProfile, todayRange, nowDate, eventSelection, eventDrag, eventResize } = this.props;
				return preact_cjs.createElement(preact_cjs.Fragment, null, hiddenGroups.map((hiddenGroup) => {
					let positionCss = computeSegVStyle(hiddenGroup.span);
					let hiddenSegs = compileSegsFromEntries(hiddenGroup.entries, segs);
					return preact_cjs.createElement(TimeColMoreLink, {
						key: internal_cjs.buildIsoString(internal_cjs.computeEarliestSegStart(hiddenSegs)),
						hiddenSegs,
						top: positionCss.top,
						bottom: positionCss.bottom,
						extraDateSpan,
						dateProfile,
						todayRange,
						nowDate,
						eventSelection,
						eventDrag,
						eventResize
					});
				}));
			}
			renderFillSegs(segs, fillType) {
				let { props, context } = this;
				let children = computeSegVCoords(segs, props.date, props.slatCoords, context.options.eventMinHeight).map((vcoords, i) => {
					let seg = segs[i];
					return preact_cjs.createElement("div", {
						key: internal_cjs.buildEventRangeKey(seg.eventRange),
						className: "fc-timegrid-bg-harness",
						style: computeSegVStyle(vcoords)
					}, fillType === "bg-event" ? preact_cjs.createElement(internal_cjs.BgEvent, Object.assign({ seg }, internal_cjs.getSegMeta(seg, props.todayRange, props.nowDate))) : internal_cjs.renderFill(fillType));
				});
				return preact_cjs.createElement(preact_cjs.Fragment, null, children);
			}
			renderNowIndicator(segs) {
				let { slatCoords, date } = this.props;
				if (!slatCoords) return null;
				return segs.map((seg, i) => preact_cjs.createElement(internal_cjs.NowIndicatorContainer, {
					key: i,
					elClasses: ["fc-timegrid-now-indicator-line"],
					elStyle: { top: slatCoords.computeDateTop(seg.start, date) },
					isAxis: false,
					date
				}));
			}
			computeSegHStyle(segHCoords) {
				let { isRtl, options } = this.context;
				let shouldOverlap = options.slotEventOverlap;
				let nearCoord = segHCoords.levelCoord;
				let farCoord = segHCoords.levelCoord + segHCoords.thickness;
				let left;
				let right;
				if (shouldOverlap) farCoord = Math.min(1, nearCoord + (farCoord - nearCoord) * 2);
				if (isRtl) {
					left = 1 - farCoord;
					right = nearCoord;
				} else {
					left = nearCoord;
					right = 1 - farCoord;
				}
				let props = {
					zIndex: segHCoords.stackDepth + 1,
					left: left * 100 + "%",
					right: right * 100 + "%"
				};
				if (shouldOverlap && !segHCoords.stackForward) props[isRtl ? "marginLeft" : "marginRight"] = 20;
				return props;
			}
		};
		function renderPlainFgSegs(sortedFgSegs, { todayRange, nowDate, eventSelection, eventDrag, eventResize }) {
			let hiddenInstances = (eventDrag ? eventDrag.affectedInstances : null) || (eventResize ? eventResize.affectedInstances : null) || {};
			return preact_cjs.createElement(preact_cjs.Fragment, null, sortedFgSegs.map((seg) => {
				let instanceId = seg.eventRange.instance.instanceId;
				return preact_cjs.createElement("div", {
					key: instanceId,
					style: { visibility: hiddenInstances[instanceId] ? "hidden" : "" }
				}, preact_cjs.createElement(TimeColEvent, Object.assign({
					seg,
					isDragging: false,
					isResizing: false,
					isDateSelecting: false,
					isSelected: instanceId === eventSelection,
					isShort: false
				}, internal_cjs.getSegMeta(seg, todayRange, nowDate))));
			}));
		}
		function computeSegVStyle(segVCoords) {
			if (!segVCoords) return {
				top: "",
				bottom: ""
			};
			return {
				top: segVCoords.start,
				bottom: -segVCoords.end
			};
		}
		function compileSegsFromEntries(segEntries, allSegs) {
			return segEntries.map((segEntry) => allSegs[segEntry.index]);
		}
		var TimeColsContent = class extends internal_cjs.BaseComponent {
			constructor() {
				super(...arguments);
				this.splitFgEventSegs = internal_cjs.memoize(splitSegsByCol);
				this.splitBgEventSegs = internal_cjs.memoize(splitSegsByCol);
				this.splitBusinessHourSegs = internal_cjs.memoize(splitSegsByCol);
				this.splitNowIndicatorSegs = internal_cjs.memoize(splitSegsByCol);
				this.splitDateSelectionSegs = internal_cjs.memoize(splitSegsByCol);
				this.splitEventDrag = internal_cjs.memoize(splitInteractionByCol);
				this.splitEventResize = internal_cjs.memoize(splitInteractionByCol);
				this.rootElRef = preact_cjs.createRef();
				this.cellElRefs = new internal_cjs.RefMap();
			}
			render() {
				let { props, context } = this;
				let nowIndicatorTop = context.options.nowIndicator && props.slatCoords && props.slatCoords.safeComputeTop(props.nowDate);
				let colCnt = props.cells.length;
				let fgEventSegsByRow = this.splitFgEventSegs(props.fgEventSegs, colCnt);
				let bgEventSegsByRow = this.splitBgEventSegs(props.bgEventSegs, colCnt);
				let businessHourSegsByRow = this.splitBusinessHourSegs(props.businessHourSegs, colCnt);
				let nowIndicatorSegsByRow = this.splitNowIndicatorSegs(props.nowIndicatorSegs, colCnt);
				let dateSelectionSegsByRow = this.splitDateSelectionSegs(props.dateSelectionSegs, colCnt);
				let eventDragByRow = this.splitEventDrag(props.eventDrag, colCnt);
				let eventResizeByRow = this.splitEventResize(props.eventResize, colCnt);
				return preact_cjs.createElement("div", {
					className: "fc-timegrid-cols",
					ref: this.rootElRef
				}, preact_cjs.createElement("table", {
					role: "presentation",
					style: {
						minWidth: props.tableMinWidth,
						width: props.clientWidth
					}
				}, props.tableColGroupNode, preact_cjs.createElement("tbody", { role: "presentation" }, preact_cjs.createElement("tr", { role: "row" }, props.axis && preact_cjs.createElement("td", {
					"aria-hidden": true,
					className: "fc-timegrid-col fc-timegrid-axis"
				}, preact_cjs.createElement("div", { className: "fc-timegrid-col-frame" }, preact_cjs.createElement("div", { className: "fc-timegrid-now-indicator-container" }, typeof nowIndicatorTop === "number" && preact_cjs.createElement(internal_cjs.NowIndicatorContainer, {
					elClasses: ["fc-timegrid-now-indicator-arrow"],
					elStyle: { top: nowIndicatorTop },
					isAxis: true,
					date: props.nowDate
				})))), props.cells.map((cell, i) => preact_cjs.createElement(TimeCol, {
					key: cell.key,
					elRef: this.cellElRefs.createRef(cell.key),
					dateProfile: props.dateProfile,
					date: cell.date,
					nowDate: props.nowDate,
					todayRange: props.todayRange,
					extraRenderProps: cell.extraRenderProps,
					extraDataAttrs: cell.extraDataAttrs,
					extraClassNames: cell.extraClassNames,
					extraDateSpan: cell.extraDateSpan,
					fgEventSegs: fgEventSegsByRow[i],
					bgEventSegs: bgEventSegsByRow[i],
					businessHourSegs: businessHourSegsByRow[i],
					nowIndicatorSegs: nowIndicatorSegsByRow[i],
					dateSelectionSegs: dateSelectionSegsByRow[i],
					eventDrag: eventDragByRow[i],
					eventResize: eventResizeByRow[i],
					slatCoords: props.slatCoords,
					eventSelection: props.eventSelection,
					forPrint: props.forPrint
				}))))));
			}
			componentDidMount() {
				this.updateCoords();
			}
			componentDidUpdate() {
				this.updateCoords();
			}
			updateCoords() {
				let { props } = this;
				if (props.onColCoords && props.clientWidth !== null) props.onColCoords(new internal_cjs.PositionCache(this.rootElRef.current, collectCellEls(this.cellElRefs.currentMap, props.cells), true, false));
			}
		};
		function collectCellEls(elMap, cells) {
			return cells.map((cell) => elMap[cell.key]);
		}
		var TimeCols = class extends internal_cjs.DateComponent {
			constructor() {
				super(...arguments);
				this.processSlotOptions = internal_cjs.memoize(processSlotOptions);
				this.state = { slatCoords: null };
				this.handleRootEl = (el) => {
					if (el) this.context.registerInteractiveComponent(this, {
						el,
						isHitComboAllowed: this.props.isHitComboAllowed
					});
					else this.context.unregisterInteractiveComponent(this);
				};
				this.handleScrollRequest = (request) => {
					let { onScrollTopRequest } = this.props;
					let { slatCoords } = this.state;
					if (onScrollTopRequest && slatCoords) {
						if (request.time) {
							let top = slatCoords.computeTimeTop(request.time);
							top = Math.ceil(top);
							if (top) top += 1;
							onScrollTopRequest(top);
						}
						return true;
					}
					return false;
				};
				this.handleColCoords = (colCoords) => {
					this.colCoords = colCoords;
				};
				this.handleSlatCoords = (slatCoords) => {
					this.setState({ slatCoords });
					if (this.props.onSlatCoords) this.props.onSlatCoords(slatCoords);
				};
			}
			render() {
				let { props, state } = this;
				return preact_cjs.createElement("div", {
					className: "fc-timegrid-body",
					ref: this.handleRootEl,
					style: {
						width: props.clientWidth,
						minWidth: props.tableMinWidth
					}
				}, preact_cjs.createElement(TimeColsSlats, {
					axis: props.axis,
					dateProfile: props.dateProfile,
					slatMetas: props.slatMetas,
					clientWidth: props.clientWidth,
					minHeight: props.expandRows ? props.clientHeight : "",
					tableMinWidth: props.tableMinWidth,
					tableColGroupNode: props.axis ? props.tableColGroupNode : null,
					onCoords: this.handleSlatCoords
				}), preact_cjs.createElement(TimeColsContent, {
					cells: props.cells,
					axis: props.axis,
					dateProfile: props.dateProfile,
					businessHourSegs: props.businessHourSegs,
					bgEventSegs: props.bgEventSegs,
					fgEventSegs: props.fgEventSegs,
					dateSelectionSegs: props.dateSelectionSegs,
					eventSelection: props.eventSelection,
					eventDrag: props.eventDrag,
					eventResize: props.eventResize,
					todayRange: props.todayRange,
					nowDate: props.nowDate,
					nowIndicatorSegs: props.nowIndicatorSegs,
					clientWidth: props.clientWidth,
					tableMinWidth: props.tableMinWidth,
					tableColGroupNode: props.tableColGroupNode,
					slatCoords: state.slatCoords,
					onColCoords: this.handleColCoords,
					forPrint: props.forPrint
				}));
			}
			componentDidMount() {
				this.scrollResponder = this.context.createScrollResponder(this.handleScrollRequest);
			}
			componentDidUpdate(prevProps) {
				this.scrollResponder.update(prevProps.dateProfile !== this.props.dateProfile);
			}
			componentWillUnmount() {
				this.scrollResponder.detach();
			}
			queryHit(positionLeft, positionTop) {
				let { dateEnv, options } = this.context;
				let { colCoords } = this;
				let { dateProfile } = this.props;
				let { slatCoords } = this.state;
				let { snapDuration, snapsPerSlot } = this.processSlotOptions(this.props.slotDuration, options.snapDuration);
				let colIndex = colCoords.leftToIndex(positionLeft);
				let slatIndex = slatCoords.positions.topToIndex(positionTop);
				if (colIndex != null && slatIndex != null) {
					let cell = this.props.cells[colIndex];
					let slatTop = slatCoords.positions.tops[slatIndex];
					let slatHeight = slatCoords.positions.getHeight(slatIndex);
					let partial = (positionTop - slatTop) / slatHeight;
					let localSnapIndex = Math.floor(partial * snapsPerSlot);
					let snapIndex = slatIndex * snapsPerSlot + localSnapIndex;
					let dayDate = this.props.cells[colIndex].date;
					let time = internal_cjs.addDurations(dateProfile.slotMinTime, internal_cjs.multiplyDuration(snapDuration, snapIndex));
					let start = dateEnv.add(dayDate, time);
					let end = dateEnv.add(start, snapDuration);
					return {
						dateProfile,
						dateSpan: Object.assign({
							range: {
								start,
								end
							},
							allDay: false
						}, cell.extraDateSpan),
						dayEl: colCoords.els[colIndex],
						rect: {
							left: colCoords.lefts[colIndex],
							right: colCoords.rights[colIndex],
							top: slatTop,
							bottom: slatTop + slatHeight
						},
						layer: 0
					};
				}
				return null;
			}
		};
		function processSlotOptions(slotDuration, snapDurationOverride) {
			let snapDuration = snapDurationOverride || slotDuration;
			let snapsPerSlot = internal_cjs.wholeDivideDurations(slotDuration, snapDuration);
			if (snapsPerSlot === null) {
				snapDuration = slotDuration;
				snapsPerSlot = 1;
			}
			return {
				snapDuration,
				snapsPerSlot
			};
		}
		var DayTimeColsSlicer = class extends internal_cjs.Slicer {
			sliceRange(range, dayRanges) {
				let segs = [];
				for (let col = 0; col < dayRanges.length; col += 1) {
					let segRange = internal_cjs.intersectRanges(range, dayRanges[col]);
					if (segRange) segs.push({
						start: segRange.start,
						end: segRange.end,
						isStart: segRange.start.valueOf() === range.start.valueOf(),
						isEnd: segRange.end.valueOf() === range.end.valueOf(),
						col
					});
				}
				return segs;
			}
		};
		var DayTimeCols = class extends internal_cjs.DateComponent {
			constructor() {
				super(...arguments);
				this.buildDayRanges = internal_cjs.memoize(buildDayRanges);
				this.slicer = new DayTimeColsSlicer();
				this.timeColsRef = preact_cjs.createRef();
			}
			render() {
				let { props, context } = this;
				let { dateProfile, dayTableModel } = props;
				let { nowIndicator, nextDayThreshold } = context.options;
				let dayRanges = this.buildDayRanges(dayTableModel, dateProfile, context.dateEnv);
				return preact_cjs.createElement(internal_cjs.NowTimer, { unit: nowIndicator ? "minute" : "day" }, (nowDate, todayRange) => preact_cjs.createElement(TimeCols, Object.assign({ ref: this.timeColsRef }, this.slicer.sliceProps(props, dateProfile, null, context, dayRanges), {
					forPrint: props.forPrint,
					axis: props.axis,
					dateProfile,
					slatMetas: props.slatMetas,
					slotDuration: props.slotDuration,
					cells: dayTableModel.cells[0],
					tableColGroupNode: props.tableColGroupNode,
					tableMinWidth: props.tableMinWidth,
					clientWidth: props.clientWidth,
					clientHeight: props.clientHeight,
					expandRows: props.expandRows,
					nowDate,
					nowIndicatorSegs: nowIndicator && this.slicer.sliceNowDate(nowDate, dateProfile, nextDayThreshold, context, dayRanges),
					todayRange,
					onScrollTopRequest: props.onScrollTopRequest,
					onSlatCoords: props.onSlatCoords
				})));
			}
		};
		function buildDayRanges(dayTableModel, dateProfile, dateEnv) {
			let ranges = [];
			for (let date of dayTableModel.headerDates) ranges.push({
				start: dateEnv.add(date, dateProfile.slotMinTime),
				end: dateEnv.add(date, dateProfile.slotMaxTime)
			});
			return ranges;
		}
		const STOCK_SUB_DURATIONS = [
			{ hours: 1 },
			{ minutes: 30 },
			{ minutes: 15 },
			{ seconds: 30 },
			{ seconds: 15 }
		];
		function buildSlatMetas(slotMinTime, slotMaxTime, explicitLabelInterval, slotDuration, dateEnv) {
			let dayStart = /* @__PURE__ */ new Date(0);
			let slatTime = slotMinTime;
			let slatIterator = internal_cjs.createDuration(0);
			let labelInterval = explicitLabelInterval || computeLabelInterval(slotDuration);
			let metas = [];
			while (internal_cjs.asRoughMs(slatTime) < internal_cjs.asRoughMs(slotMaxTime)) {
				let date = dateEnv.add(dayStart, slatTime);
				let isLabeled = internal_cjs.wholeDivideDurations(slatIterator, labelInterval) !== null;
				metas.push({
					date,
					time: slatTime,
					key: date.toISOString(),
					isoTimeStr: internal_cjs.formatIsoTimeString(date),
					isLabeled
				});
				slatTime = internal_cjs.addDurations(slatTime, slotDuration);
				slatIterator = internal_cjs.addDurations(slatIterator, slotDuration);
			}
			return metas;
		}
		function computeLabelInterval(slotDuration) {
			let i;
			let labelInterval;
			let slotsPerLabel;
			for (i = STOCK_SUB_DURATIONS.length - 1; i >= 0; i -= 1) {
				labelInterval = internal_cjs.createDuration(STOCK_SUB_DURATIONS[i]);
				slotsPerLabel = internal_cjs.wholeDivideDurations(labelInterval, slotDuration);
				if (slotsPerLabel !== null && slotsPerLabel > 1) return labelInterval;
			}
			return slotDuration;
		}
		var DayTimeColsView = class extends TimeColsView {
			constructor() {
				super(...arguments);
				this.buildTimeColsModel = internal_cjs.memoize(buildTimeColsModel);
				this.buildSlatMetas = internal_cjs.memoize(buildSlatMetas);
			}
			render() {
				let { options, dateEnv, dateProfileGenerator } = this.context;
				let { props } = this;
				let { dateProfile } = props;
				let dayTableModel = this.buildTimeColsModel(dateProfile, dateProfileGenerator);
				let splitProps = this.allDaySplitter.splitProps(props);
				let slatMetas = this.buildSlatMetas(dateProfile.slotMinTime, dateProfile.slotMaxTime, options.slotLabelInterval, options.slotDuration, dateEnv);
				let { dayMinWidth } = options;
				let hasAttachedAxis = !dayMinWidth;
				let hasDetachedAxis = dayMinWidth;
				let headerContent = options.dayHeaders && preact_cjs.createElement(internal_cjs.DayHeader, {
					dates: dayTableModel.headerDates,
					dateProfile,
					datesRepDistinctDays: true,
					renderIntro: hasAttachedAxis ? this.renderHeadAxis : null
				});
				let allDayContent = options.allDaySlot !== false && ((contentArg) => preact_cjs.createElement(internal_cjs$1.DayTable, Object.assign({}, splitProps.allDay, {
					dateProfile,
					dayTableModel,
					nextDayThreshold: options.nextDayThreshold,
					tableMinWidth: contentArg.tableMinWidth,
					colGroupNode: contentArg.tableColGroupNode,
					renderRowIntro: hasAttachedAxis ? this.renderTableRowAxis : null,
					showWeekNumbers: false,
					expandRows: false,
					headerAlignElRef: this.headerElRef,
					clientWidth: contentArg.clientWidth,
					clientHeight: contentArg.clientHeight,
					forPrint: props.forPrint
				}, this.getAllDayMaxEventProps())));
				let timeGridContent = (contentArg) => preact_cjs.createElement(DayTimeCols, Object.assign({}, splitProps.timed, {
					dayTableModel,
					dateProfile,
					axis: hasAttachedAxis,
					slotDuration: options.slotDuration,
					slatMetas,
					forPrint: props.forPrint,
					tableColGroupNode: contentArg.tableColGroupNode,
					tableMinWidth: contentArg.tableMinWidth,
					clientWidth: contentArg.clientWidth,
					clientHeight: contentArg.clientHeight,
					onSlatCoords: this.handleSlatCoords,
					expandRows: contentArg.expandRows,
					onScrollTopRequest: this.handleScrollTopRequest
				}));
				return hasDetachedAxis ? this.renderHScrollLayout(headerContent, allDayContent, timeGridContent, dayTableModel.colCnt, dayMinWidth, slatMetas, this.state.slatCoords) : this.renderSimpleLayout(headerContent, allDayContent, timeGridContent);
			}
		};
		function buildTimeColsModel(dateProfile, dateProfileGenerator) {
			let daySeries = new internal_cjs.DaySeriesModel(dateProfile.renderRange, dateProfileGenerator);
			return new internal_cjs.DayTableModel(daySeries, false);
		}
		internal_cjs.injectStyles(".fc-v-event{background-color:var(--fc-event-bg-color);border:1px solid var(--fc-event-border-color);display:block}.fc-v-event .fc-event-main{color:var(--fc-event-text-color);height:100%}.fc-v-event .fc-event-main-frame{display:flex;flex-direction:column;height:100%}.fc-v-event .fc-event-time{flex-grow:0;flex-shrink:0;max-height:100%;overflow:hidden}.fc-v-event .fc-event-title-container{flex-grow:1;flex-shrink:1;min-height:0}.fc-v-event .fc-event-title{bottom:0;max-height:100%;overflow:hidden;top:0}.fc-v-event:not(.fc-event-start){border-top-left-radius:0;border-top-right-radius:0;border-top-width:0}.fc-v-event:not(.fc-event-end){border-bottom-left-radius:0;border-bottom-right-radius:0;border-bottom-width:0}.fc-v-event.fc-event-selected:before{left:-10px;right:-10px}.fc-v-event .fc-event-resizer-start{cursor:n-resize}.fc-v-event .fc-event-resizer-end{cursor:s-resize}.fc-v-event:not(.fc-event-selected) .fc-event-resizer{height:var(--fc-event-resizer-thickness);left:0;right:0}.fc-v-event:not(.fc-event-selected) .fc-event-resizer-start{top:calc(var(--fc-event-resizer-thickness)/-2)}.fc-v-event:not(.fc-event-selected) .fc-event-resizer-end{bottom:calc(var(--fc-event-resizer-thickness)/-2)}.fc-v-event.fc-event-selected .fc-event-resizer{left:50%;margin-left:calc(var(--fc-event-resizer-dot-total-width)/-2)}.fc-v-event.fc-event-selected .fc-event-resizer-start{top:calc(var(--fc-event-resizer-dot-total-width)/-2)}.fc-v-event.fc-event-selected .fc-event-resizer-end{bottom:calc(var(--fc-event-resizer-dot-total-width)/-2)}.fc .fc-timegrid .fc-daygrid-body{z-index:2}.fc .fc-timegrid-divider{padding:0 0 2px}.fc .fc-timegrid-body{min-height:100%;position:relative;z-index:1}.fc .fc-timegrid-axis-chunk{position:relative}.fc .fc-timegrid-axis-chunk>table,.fc .fc-timegrid-slots{position:relative;z-index:1}.fc .fc-timegrid-slot{border-bottom:0;height:1.5em}.fc .fc-timegrid-slot:empty:before{content:\"\\00a0\"}.fc .fc-timegrid-slot-minor{border-top-style:dotted}.fc .fc-timegrid-slot-label-cushion{display:inline-block;white-space:nowrap}.fc .fc-timegrid-slot-label{vertical-align:middle}.fc .fc-timegrid-axis-cushion,.fc .fc-timegrid-slot-label-cushion{padding:0 4px}.fc .fc-timegrid-axis-frame-liquid{height:100%}.fc .fc-timegrid-axis-frame{align-items:center;display:flex;justify-content:flex-end;overflow:hidden}.fc .fc-timegrid-axis-cushion{flex-shrink:0;max-width:60px}.fc-direction-ltr .fc-timegrid-slot-label-frame{text-align:right}.fc-direction-rtl .fc-timegrid-slot-label-frame{text-align:left}.fc-liquid-hack .fc-timegrid-axis-frame-liquid{bottom:0;height:auto;left:0;position:absolute;right:0;top:0}.fc .fc-timegrid-col.fc-day-today{background-color:var(--fc-today-bg-color)}.fc .fc-timegrid-col-frame{min-height:100%;position:relative}.fc-media-screen.fc-liquid-hack .fc-timegrid-col-frame{bottom:0;height:auto;left:0;position:absolute;right:0;top:0}.fc-media-screen .fc-timegrid-cols{bottom:0;left:0;position:absolute;right:0;top:0}.fc-media-screen .fc-timegrid-cols>table{height:100%}.fc-media-screen .fc-timegrid-col-bg,.fc-media-screen .fc-timegrid-col-events,.fc-media-screen .fc-timegrid-now-indicator-container{left:0;position:absolute;right:0;top:0}.fc .fc-timegrid-col-bg{z-index:2}.fc .fc-timegrid-col-bg .fc-non-business{z-index:1}.fc .fc-timegrid-col-bg .fc-bg-event{z-index:2}.fc .fc-timegrid-col-bg .fc-highlight{z-index:3}.fc .fc-timegrid-bg-harness{left:0;position:absolute;right:0}.fc .fc-timegrid-col-events{z-index:3}.fc .fc-timegrid-now-indicator-container{bottom:0;overflow:hidden}.fc-direction-ltr .fc-timegrid-col-events{margin:0 2.5% 0 2px}.fc-direction-rtl .fc-timegrid-col-events{margin:0 2px 0 2.5%}.fc-timegrid-event-harness{position:absolute}.fc-timegrid-event-harness>.fc-timegrid-event{bottom:0;left:0;position:absolute;right:0;top:0}.fc-timegrid-event-harness-inset .fc-timegrid-event,.fc-timegrid-event.fc-event-mirror,.fc-timegrid-more-link{box-shadow:0 0 0 1px var(--fc-page-bg-color)}.fc-timegrid-event,.fc-timegrid-more-link{border-radius:3px;font-size:var(--fc-small-font-size)}.fc-timegrid-event{margin-bottom:1px}.fc-timegrid-event .fc-event-main{padding:1px 1px 0}.fc-timegrid-event .fc-event-time{font-size:var(--fc-small-font-size);margin-bottom:1px;white-space:nowrap}.fc-timegrid-event-short .fc-event-main-frame{flex-direction:row;overflow:hidden}.fc-timegrid-event-short .fc-event-time:after{content:\"\\00a0-\\00a0\"}.fc-timegrid-event-short .fc-event-title{font-size:var(--fc-small-font-size)}.fc-timegrid-more-link{background:var(--fc-more-link-bg-color);color:var(--fc-more-link-text-color);cursor:pointer;margin-bottom:1px;position:absolute;z-index:9999}.fc-timegrid-more-link-inner{padding:3px 2px;top:0}.fc-direction-ltr .fc-timegrid-more-link{right:0}.fc-direction-rtl .fc-timegrid-more-link{left:0}.fc .fc-timegrid-now-indicator-arrow,.fc .fc-timegrid-now-indicator-line{pointer-events:none}.fc .fc-timegrid-now-indicator-line{border-color:var(--fc-now-indicator-color);border-style:solid;border-width:1px 0 0;left:0;position:absolute;right:0;z-index:4}.fc .fc-timegrid-now-indicator-arrow{border-color:var(--fc-now-indicator-color);border-style:solid;margin-top:-5px;position:absolute;z-index:4}.fc-direction-ltr .fc-timegrid-now-indicator-arrow{border-bottom-color:transparent;border-top-color:transparent;border-width:5px 0 5px 6px;left:0}.fc-direction-rtl .fc-timegrid-now-indicator-arrow{border-bottom-color:transparent;border-top-color:transparent;border-width:5px 6px 5px 0;right:0}");
		exports.DayTimeCols = DayTimeCols;
		exports.DayTimeColsSlicer = DayTimeColsSlicer;
		exports.DayTimeColsView = DayTimeColsView;
		exports.TimeCols = TimeCols;
		exports.TimeColsSlatsCoords = TimeColsSlatsCoords;
		exports.TimeColsView = TimeColsView;
		exports.buildDayRanges = buildDayRanges;
		exports.buildSlatMetas = buildSlatMetas;
		exports.buildTimeColsModel = buildTimeColsModel;
	}));
	//#endregion
	//#region node_modules/.pnpm/@fullcalendar+timegrid@6.1.21_@fullcalendar+core@6.1.21/node_modules/@fullcalendar/timegrid/index.cjs
	var require_timegrid = /* @__PURE__ */ __commonJSMin(((exports) => {
		Object.defineProperty(exports, "__esModule", { value: true });
		var index_cjs = require_core();
		var internalCommon = require_internal();
		require_internal$2();
		require_preact();
		require_internal$1();
		const OPTION_REFINERS = { allDaySlot: Boolean };
		exports["default"] = index_cjs.createPlugin({
			name: "@fullcalendar/timegrid",
			initialView: "timeGridWeek",
			optionRefiners: OPTION_REFINERS,
			views: {
				timeGrid: {
					component: internalCommon.DayTimeColsView,
					usesMinMaxTime: true,
					allDaySlot: true,
					slotDuration: "00:30:00",
					slotEventOverlap: true
				},
				timeGridDay: {
					type: "timeGrid",
					duration: { days: 1 }
				},
				timeGridWeek: {
					type: "timeGrid",
					duration: { weeks: 1 }
				}
			}
		});
	}));
	//#endregion
	//#region node_modules/.pnpm/@fullcalendar+interaction@6.1.21_@fullcalendar+core@6.1.21/node_modules/@fullcalendar/interaction/index.cjs
	var require_interaction = /* @__PURE__ */ __commonJSMin(((exports) => {
		Object.defineProperty(exports, "__esModule", { value: true });
		var index_cjs = require_core();
		var internal_cjs = require_internal$2();
		internal_cjs.config.touchMouseIgnoreWait = 500;
		let ignoreMouseDepth = 0;
		let listenerCnt = 0;
		let isWindowTouchMoveCancelled = false;
		var PointerDragging = class {
			constructor(containerEl) {
				this.subjectEl = null;
				this.selector = "";
				this.handleSelector = "";
				this.shouldIgnoreMove = false;
				this.shouldWatchScroll = true;
				this.isDragging = false;
				this.isTouchDragging = false;
				this.wasTouchScroll = false;
				this.handleMouseDown = (ev) => {
					if (!this.shouldIgnoreMouse() && isPrimaryMouseButton(ev) && this.tryStart(ev)) {
						let pev = this.createEventFromMouse(ev, true);
						this.emitter.trigger("pointerdown", pev);
						this.initScrollWatch(pev);
						if (!this.shouldIgnoreMove) document.addEventListener("mousemove", this.handleMouseMove);
						document.addEventListener("mouseup", this.handleMouseUp);
					}
				};
				this.handleMouseMove = (ev) => {
					let pev = this.createEventFromMouse(ev);
					this.recordCoords(pev);
					this.emitter.trigger("pointermove", pev);
				};
				this.handleMouseUp = (ev) => {
					document.removeEventListener("mousemove", this.handleMouseMove);
					document.removeEventListener("mouseup", this.handleMouseUp);
					this.emitter.trigger("pointerup", this.createEventFromMouse(ev));
					this.cleanup();
				};
				this.handleTouchStart = (ev) => {
					if (this.tryStart(ev)) {
						this.isTouchDragging = true;
						let pev = this.createEventFromTouch(ev, true);
						this.emitter.trigger("pointerdown", pev);
						this.initScrollWatch(pev);
						let targetEl = ev.target;
						if (!this.shouldIgnoreMove) targetEl.addEventListener("touchmove", this.handleTouchMove);
						targetEl.addEventListener("touchend", this.handleTouchEnd);
						targetEl.addEventListener("touchcancel", this.handleTouchEnd);
						window.addEventListener("scroll", this.handleTouchScroll, true);
					}
				};
				this.handleTouchMove = (ev) => {
					let pev = this.createEventFromTouch(ev);
					this.recordCoords(pev);
					this.emitter.trigger("pointermove", pev);
				};
				this.handleTouchEnd = (ev) => {
					if (this.isDragging) {
						let targetEl = ev.target;
						targetEl.removeEventListener("touchmove", this.handleTouchMove);
						targetEl.removeEventListener("touchend", this.handleTouchEnd);
						targetEl.removeEventListener("touchcancel", this.handleTouchEnd);
						window.removeEventListener("scroll", this.handleTouchScroll, true);
						this.emitter.trigger("pointerup", this.createEventFromTouch(ev));
						this.cleanup();
						this.isTouchDragging = false;
						startIgnoringMouse();
					}
				};
				this.handleTouchScroll = () => {
					this.wasTouchScroll = true;
				};
				this.handleScroll = (ev) => {
					if (!this.shouldIgnoreMove) {
						let pageX = window.scrollX - this.prevScrollX + this.prevPageX;
						let pageY = window.scrollY - this.prevScrollY + this.prevPageY;
						this.emitter.trigger("pointermove", {
							origEvent: ev,
							isTouch: this.isTouchDragging,
							subjectEl: this.subjectEl,
							pageX,
							pageY,
							deltaX: pageX - this.origPageX,
							deltaY: pageY - this.origPageY
						});
					}
				};
				this.containerEl = containerEl;
				this.emitter = new internal_cjs.Emitter();
				containerEl.addEventListener("mousedown", this.handleMouseDown);
				containerEl.addEventListener("touchstart", this.handleTouchStart, { passive: true });
				listenerCreated();
			}
			destroy() {
				this.containerEl.removeEventListener("mousedown", this.handleMouseDown);
				this.containerEl.removeEventListener("touchstart", this.handleTouchStart, { passive: true });
				listenerDestroyed();
			}
			tryStart(ev) {
				let subjectEl = this.querySubjectEl(ev);
				let downEl = ev.target;
				if (subjectEl && (!this.handleSelector || internal_cjs.elementClosest(downEl, this.handleSelector))) {
					this.subjectEl = subjectEl;
					this.isDragging = true;
					this.wasTouchScroll = false;
					return true;
				}
				return false;
			}
			cleanup() {
				isWindowTouchMoveCancelled = false;
				this.isDragging = false;
				this.subjectEl = null;
				this.destroyScrollWatch();
			}
			querySubjectEl(ev) {
				if (this.selector) return internal_cjs.elementClosest(ev.target, this.selector);
				return this.containerEl;
			}
			shouldIgnoreMouse() {
				return ignoreMouseDepth || this.isTouchDragging;
			}
			cancelTouchScroll() {
				if (this.isDragging) isWindowTouchMoveCancelled = true;
			}
			initScrollWatch(ev) {
				if (this.shouldWatchScroll) {
					this.recordCoords(ev);
					window.addEventListener("scroll", this.handleScroll, true);
				}
			}
			recordCoords(ev) {
				if (this.shouldWatchScroll) {
					this.prevPageX = ev.pageX;
					this.prevPageY = ev.pageY;
					this.prevScrollX = window.scrollX;
					this.prevScrollY = window.scrollY;
				}
			}
			destroyScrollWatch() {
				if (this.shouldWatchScroll) window.removeEventListener("scroll", this.handleScroll, true);
			}
			createEventFromMouse(ev, isFirst) {
				let deltaX = 0;
				let deltaY = 0;
				if (isFirst) {
					this.origPageX = ev.pageX;
					this.origPageY = ev.pageY;
				} else {
					deltaX = ev.pageX - this.origPageX;
					deltaY = ev.pageY - this.origPageY;
				}
				return {
					origEvent: ev,
					isTouch: false,
					subjectEl: this.subjectEl,
					pageX: ev.pageX,
					pageY: ev.pageY,
					deltaX,
					deltaY
				};
			}
			createEventFromTouch(ev, isFirst) {
				let touches = ev.touches;
				let pageX;
				let pageY;
				let deltaX = 0;
				let deltaY = 0;
				if (touches && touches.length) {
					pageX = touches[0].pageX;
					pageY = touches[0].pageY;
				} else {
					pageX = ev.pageX;
					pageY = ev.pageY;
				}
				if (isFirst) {
					this.origPageX = pageX;
					this.origPageY = pageY;
				} else {
					deltaX = pageX - this.origPageX;
					deltaY = pageY - this.origPageY;
				}
				return {
					origEvent: ev,
					isTouch: true,
					subjectEl: this.subjectEl,
					pageX,
					pageY,
					deltaX,
					deltaY
				};
			}
		};
		function isPrimaryMouseButton(ev) {
			return ev.button === 0 && !ev.ctrlKey;
		}
		function startIgnoringMouse() {
			ignoreMouseDepth += 1;
			setTimeout(() => {
				ignoreMouseDepth -= 1;
			}, internal_cjs.config.touchMouseIgnoreWait);
		}
		function listenerCreated() {
			listenerCnt += 1;
			if (listenerCnt === 1) window.addEventListener("touchmove", onWindowTouchMove, { passive: false });
		}
		function listenerDestroyed() {
			listenerCnt -= 1;
			if (!listenerCnt) window.removeEventListener("touchmove", onWindowTouchMove, { passive: false });
		}
		function onWindowTouchMove(ev) {
			if (isWindowTouchMoveCancelled) ev.preventDefault();
		}
		var ElementMirror = class {
			constructor() {
				this.isVisible = false;
				this.sourceEl = null;
				this.mirrorEl = null;
				this.sourceElRect = null;
				this.parentNode = document.body;
				this.zIndex = 9999;
				this.revertDuration = 0;
			}
			start(sourceEl, pageX, pageY) {
				this.sourceEl = sourceEl;
				this.sourceElRect = this.sourceEl.getBoundingClientRect();
				this.origScreenX = pageX - window.scrollX;
				this.origScreenY = pageY - window.scrollY;
				this.deltaX = 0;
				this.deltaY = 0;
				this.updateElPosition();
			}
			handleMove(pageX, pageY) {
				this.deltaX = pageX - window.scrollX - this.origScreenX;
				this.deltaY = pageY - window.scrollY - this.origScreenY;
				this.updateElPosition();
			}
			setIsVisible(bool) {
				if (bool) {
					if (!this.isVisible) {
						if (this.mirrorEl) this.mirrorEl.style.display = "";
						this.isVisible = bool;
						this.updateElPosition();
					}
				} else if (this.isVisible) {
					if (this.mirrorEl) this.mirrorEl.style.display = "none";
					this.isVisible = bool;
				}
			}
			stop(needsRevertAnimation, callback) {
				let done = () => {
					this.cleanup();
					callback();
				};
				if (needsRevertAnimation && this.mirrorEl && this.isVisible && this.revertDuration && (this.deltaX || this.deltaY)) this.doRevertAnimation(done, this.revertDuration);
				else setTimeout(done, 0);
			}
			doRevertAnimation(callback, revertDuration) {
				let mirrorEl = this.mirrorEl;
				let finalSourceElRect = this.sourceEl.getBoundingClientRect();
				mirrorEl.style.transition = "top " + revertDuration + "ms,left " + revertDuration + "ms";
				internal_cjs.applyStyle(mirrorEl, {
					left: finalSourceElRect.left,
					top: finalSourceElRect.top
				});
				internal_cjs.whenTransitionDone(mirrorEl, () => {
					mirrorEl.style.transition = "";
					callback();
				});
			}
			cleanup() {
				if (this.mirrorEl) {
					internal_cjs.removeElement(this.mirrorEl);
					this.mirrorEl = null;
				}
				this.sourceEl = null;
			}
			updateElPosition() {
				if (this.sourceEl && this.isVisible) internal_cjs.applyStyle(this.getMirrorEl(), {
					left: this.sourceElRect.left + this.deltaX,
					top: this.sourceElRect.top + this.deltaY
				});
			}
			getMirrorEl() {
				let sourceElRect = this.sourceElRect;
				let mirrorEl = this.mirrorEl;
				if (!mirrorEl) {
					mirrorEl = this.mirrorEl = this.sourceEl.cloneNode(true);
					mirrorEl.style.userSelect = "none";
					mirrorEl.style.webkitUserSelect = "none";
					mirrorEl.style.pointerEvents = "none";
					mirrorEl.classList.add("fc-event-dragging");
					internal_cjs.applyStyle(mirrorEl, {
						position: "fixed",
						zIndex: this.zIndex,
						visibility: "",
						boxSizing: "border-box",
						width: sourceElRect.right - sourceElRect.left,
						height: sourceElRect.bottom - sourceElRect.top,
						right: "auto",
						bottom: "auto",
						margin: 0
					});
					this.parentNode.appendChild(mirrorEl);
				}
				return mirrorEl;
			}
		};
		var ScrollGeomCache = class extends internal_cjs.ScrollController {
			constructor(scrollController, doesListening) {
				super();
				this.handleScroll = () => {
					this.scrollTop = this.scrollController.getScrollTop();
					this.scrollLeft = this.scrollController.getScrollLeft();
					this.handleScrollChange();
				};
				this.scrollController = scrollController;
				this.doesListening = doesListening;
				this.scrollTop = this.origScrollTop = scrollController.getScrollTop();
				this.scrollLeft = this.origScrollLeft = scrollController.getScrollLeft();
				this.scrollWidth = scrollController.getScrollWidth();
				this.scrollHeight = scrollController.getScrollHeight();
				this.clientWidth = scrollController.getClientWidth();
				this.clientHeight = scrollController.getClientHeight();
				this.clientRect = this.computeClientRect();
				if (this.doesListening) this.getEventTarget().addEventListener("scroll", this.handleScroll);
			}
			destroy() {
				if (this.doesListening) this.getEventTarget().removeEventListener("scroll", this.handleScroll);
			}
			getScrollTop() {
				return this.scrollTop;
			}
			getScrollLeft() {
				return this.scrollLeft;
			}
			setScrollTop(top) {
				this.scrollController.setScrollTop(top);
				if (!this.doesListening) {
					this.scrollTop = Math.max(Math.min(top, this.getMaxScrollTop()), 0);
					this.handleScrollChange();
				}
			}
			setScrollLeft(top) {
				this.scrollController.setScrollLeft(top);
				if (!this.doesListening) {
					this.scrollLeft = Math.max(Math.min(top, this.getMaxScrollLeft()), 0);
					this.handleScrollChange();
				}
			}
			getClientWidth() {
				return this.clientWidth;
			}
			getClientHeight() {
				return this.clientHeight;
			}
			getScrollWidth() {
				return this.scrollWidth;
			}
			getScrollHeight() {
				return this.scrollHeight;
			}
			handleScrollChange() {}
		};
		var ElementScrollGeomCache = class extends ScrollGeomCache {
			constructor(el, doesListening) {
				super(new internal_cjs.ElementScrollController(el), doesListening);
			}
			getEventTarget() {
				return this.scrollController.el;
			}
			computeClientRect() {
				return internal_cjs.computeInnerRect(this.scrollController.el);
			}
		};
		var WindowScrollGeomCache = class extends ScrollGeomCache {
			constructor(doesListening) {
				super(new internal_cjs.WindowScrollController(), doesListening);
			}
			getEventTarget() {
				return window;
			}
			computeClientRect() {
				return {
					left: this.scrollLeft,
					right: this.scrollLeft + this.clientWidth,
					top: this.scrollTop,
					bottom: this.scrollTop + this.clientHeight
				};
			}
			handleScrollChange() {
				this.clientRect = this.computeClientRect();
			}
		};
		const getTime = typeof performance === "function" ? performance.now : Date.now;
		var AutoScroller = class {
			constructor() {
				this.isEnabled = true;
				this.scrollQuery = [window, ".fc-scroller"];
				this.edgeThreshold = 50;
				this.maxVelocity = 300;
				this.pointerScreenX = null;
				this.pointerScreenY = null;
				this.isAnimating = false;
				this.scrollCaches = null;
				this.everMovedUp = false;
				this.everMovedDown = false;
				this.everMovedLeft = false;
				this.everMovedRight = false;
				this.animate = () => {
					if (this.isAnimating) {
						let edge = this.computeBestEdge(this.pointerScreenX + window.scrollX, this.pointerScreenY + window.scrollY);
						if (edge) {
							let now = getTime();
							this.handleSide(edge, (now - this.msSinceRequest) / 1e3);
							this.requestAnimation(now);
						} else this.isAnimating = false;
					}
				};
			}
			start(pageX, pageY, scrollStartEl) {
				if (this.isEnabled) {
					this.scrollCaches = this.buildCaches(scrollStartEl);
					this.pointerScreenX = null;
					this.pointerScreenY = null;
					this.everMovedUp = false;
					this.everMovedDown = false;
					this.everMovedLeft = false;
					this.everMovedRight = false;
					this.handleMove(pageX, pageY);
				}
			}
			handleMove(pageX, pageY) {
				if (this.isEnabled) {
					let pointerScreenX = pageX - window.scrollX;
					let pointerScreenY = pageY - window.scrollY;
					let yDelta = this.pointerScreenY === null ? 0 : pointerScreenY - this.pointerScreenY;
					let xDelta = this.pointerScreenX === null ? 0 : pointerScreenX - this.pointerScreenX;
					if (yDelta < 0) this.everMovedUp = true;
					else if (yDelta > 0) this.everMovedDown = true;
					if (xDelta < 0) this.everMovedLeft = true;
					else if (xDelta > 0) this.everMovedRight = true;
					this.pointerScreenX = pointerScreenX;
					this.pointerScreenY = pointerScreenY;
					if (!this.isAnimating) {
						this.isAnimating = true;
						this.requestAnimation(getTime());
					}
				}
			}
			stop() {
				if (this.isEnabled) {
					this.isAnimating = false;
					for (let scrollCache of this.scrollCaches) scrollCache.destroy();
					this.scrollCaches = null;
				}
			}
			requestAnimation(now) {
				this.msSinceRequest = now;
				requestAnimationFrame(this.animate);
			}
			handleSide(edge, seconds) {
				let { scrollCache } = edge;
				let { edgeThreshold } = this;
				let invDistance = edgeThreshold - edge.distance;
				let velocity = invDistance * invDistance / (edgeThreshold * edgeThreshold) * this.maxVelocity * seconds;
				let sign = 1;
				switch (edge.name) {
					case "left": sign = -1;
					case "right":
						scrollCache.setScrollLeft(scrollCache.getScrollLeft() + velocity * sign);
						break;
					case "top": sign = -1;
					case "bottom": scrollCache.setScrollTop(scrollCache.getScrollTop() + velocity * sign);
				}
			}
			computeBestEdge(left, top) {
				let { edgeThreshold } = this;
				let bestSide = null;
				let scrollCaches = this.scrollCaches || [];
				for (let scrollCache of scrollCaches) {
					let rect = scrollCache.clientRect;
					let leftDist = left - rect.left;
					let rightDist = rect.right - left;
					let topDist = top - rect.top;
					let bottomDist = rect.bottom - top;
					if (leftDist >= 0 && rightDist >= 0 && topDist >= 0 && bottomDist >= 0) {
						if (topDist <= edgeThreshold && this.everMovedUp && scrollCache.canScrollUp() && (!bestSide || bestSide.distance > topDist)) bestSide = {
							scrollCache,
							name: "top",
							distance: topDist
						};
						if (bottomDist <= edgeThreshold && this.everMovedDown && scrollCache.canScrollDown() && (!bestSide || bestSide.distance > bottomDist)) bestSide = {
							scrollCache,
							name: "bottom",
							distance: bottomDist
						};
						if (leftDist <= edgeThreshold && this.everMovedLeft && scrollCache.canScrollLeft() && (!bestSide || bestSide.distance > leftDist)) bestSide = {
							scrollCache,
							name: "left",
							distance: leftDist
						};
						if (rightDist <= edgeThreshold && this.everMovedRight && scrollCache.canScrollRight() && (!bestSide || bestSide.distance > rightDist)) bestSide = {
							scrollCache,
							name: "right",
							distance: rightDist
						};
					}
				}
				return bestSide;
			}
			buildCaches(scrollStartEl) {
				return this.queryScrollEls(scrollStartEl).map((el) => {
					if (el === window) return new WindowScrollGeomCache(false);
					return new ElementScrollGeomCache(el, false);
				});
			}
			queryScrollEls(scrollStartEl) {
				let els = [];
				for (let query of this.scrollQuery) if (typeof query === "object") els.push(query);
				else els.push(...Array.prototype.slice.call(scrollStartEl.getRootNode().querySelectorAll(query)));
				return els;
			}
		};
		var FeaturefulElementDragging = class extends internal_cjs.ElementDragging {
			constructor(containerEl, selector) {
				super(containerEl);
				this.containerEl = containerEl;
				this.delay = null;
				this.minDistance = 0;
				this.touchScrollAllowed = true;
				this.mirrorNeedsRevert = false;
				this.isInteracting = false;
				this.isDragging = false;
				this.isDelayEnded = false;
				this.isDistanceSurpassed = false;
				this.delayTimeoutId = null;
				this.onPointerDown = (ev) => {
					if (!this.isDragging) {
						this.isInteracting = true;
						this.isDelayEnded = false;
						this.isDistanceSurpassed = false;
						internal_cjs.preventSelection(document.body);
						internal_cjs.preventContextMenu(document.body);
						if (!ev.isTouch) ev.origEvent.preventDefault();
						this.emitter.trigger("pointerdown", ev);
						if (this.isInteracting && !this.pointer.shouldIgnoreMove) {
							this.mirror.setIsVisible(false);
							this.mirror.start(ev.subjectEl, ev.pageX, ev.pageY);
							this.startDelay(ev);
							if (!this.minDistance) this.handleDistanceSurpassed(ev);
						}
					}
				};
				this.onPointerMove = (ev) => {
					if (this.isInteracting) {
						this.emitter.trigger("pointermove", ev);
						if (!this.isDistanceSurpassed) {
							let minDistance = this.minDistance;
							let distanceSq;
							let { deltaX, deltaY } = ev;
							distanceSq = deltaX * deltaX + deltaY * deltaY;
							if (distanceSq >= minDistance * minDistance) this.handleDistanceSurpassed(ev);
						}
						if (this.isDragging) {
							if (ev.origEvent.type !== "scroll") {
								this.mirror.handleMove(ev.pageX, ev.pageY);
								this.autoScroller.handleMove(ev.pageX, ev.pageY);
							}
							this.emitter.trigger("dragmove", ev);
						}
					}
				};
				this.onPointerUp = (ev) => {
					if (this.isInteracting) {
						this.isInteracting = false;
						internal_cjs.allowSelection(document.body);
						internal_cjs.allowContextMenu(document.body);
						this.emitter.trigger("pointerup", ev);
						if (this.isDragging) {
							this.autoScroller.stop();
							this.tryStopDrag(ev);
						}
						if (this.delayTimeoutId) {
							clearTimeout(this.delayTimeoutId);
							this.delayTimeoutId = null;
						}
					}
				};
				let pointer = this.pointer = new PointerDragging(containerEl);
				pointer.emitter.on("pointerdown", this.onPointerDown);
				pointer.emitter.on("pointermove", this.onPointerMove);
				pointer.emitter.on("pointerup", this.onPointerUp);
				if (selector) pointer.selector = selector;
				this.mirror = new ElementMirror();
				this.autoScroller = new AutoScroller();
			}
			destroy() {
				this.pointer.destroy();
				this.onPointerUp({});
			}
			startDelay(ev) {
				if (typeof this.delay === "number") this.delayTimeoutId = setTimeout(() => {
					this.delayTimeoutId = null;
					this.handleDelayEnd(ev);
				}, this.delay);
				else this.handleDelayEnd(ev);
			}
			handleDelayEnd(ev) {
				this.isDelayEnded = true;
				this.tryStartDrag(ev);
			}
			handleDistanceSurpassed(ev) {
				this.isDistanceSurpassed = true;
				this.tryStartDrag(ev);
			}
			tryStartDrag(ev) {
				if (this.isDelayEnded && this.isDistanceSurpassed) {
					if (!this.pointer.wasTouchScroll || this.touchScrollAllowed) {
						this.isDragging = true;
						this.mirrorNeedsRevert = false;
						this.autoScroller.start(ev.pageX, ev.pageY, this.containerEl);
						this.emitter.trigger("dragstart", ev);
						if (this.touchScrollAllowed === false) this.pointer.cancelTouchScroll();
					}
				}
			}
			tryStopDrag(ev) {
				this.mirror.stop(this.mirrorNeedsRevert, this.stopDrag.bind(this, ev));
			}
			stopDrag(ev) {
				this.isDragging = false;
				this.emitter.trigger("dragend", ev);
			}
			setIgnoreMove(bool) {
				this.pointer.shouldIgnoreMove = bool;
			}
			setMirrorIsVisible(bool) {
				this.mirror.setIsVisible(bool);
			}
			setMirrorNeedsRevert(bool) {
				this.mirrorNeedsRevert = bool;
			}
			setAutoScrollEnabled(bool) {
				this.autoScroller.isEnabled = bool;
			}
		};
		var OffsetTracker = class {
			constructor(el) {
				this.el = el;
				this.origRect = internal_cjs.computeRect(el);
				this.scrollCaches = internal_cjs.getClippingParents(el).map((scrollEl) => new ElementScrollGeomCache(scrollEl, true));
			}
			destroy() {
				for (let scrollCache of this.scrollCaches) scrollCache.destroy();
			}
			computeLeft() {
				let left = this.origRect.left;
				for (let scrollCache of this.scrollCaches) left += scrollCache.origScrollLeft - scrollCache.getScrollLeft();
				return left;
			}
			computeTop() {
				let top = this.origRect.top;
				for (let scrollCache of this.scrollCaches) top += scrollCache.origScrollTop - scrollCache.getScrollTop();
				return top;
			}
			isWithinClipping(pageX, pageY) {
				let point = {
					left: pageX,
					top: pageY
				};
				for (let scrollCache of this.scrollCaches) if (!isIgnoredClipping(scrollCache.getEventTarget()) && !internal_cjs.pointInsideRect(point, scrollCache.clientRect)) return false;
				return true;
			}
		};
		function isIgnoredClipping(node) {
			let tagName = node.tagName;
			return tagName === "HTML" || tagName === "BODY";
		}
		var HitDragging = class {
			constructor(dragging, droppableStore) {
				this.useSubjectCenter = false;
				this.requireInitial = true;
				this.disablePointCheck = false;
				this.initialHit = null;
				this.movingHit = null;
				this.finalHit = null;
				this.handlePointerDown = (ev) => {
					let { dragging } = this;
					this.initialHit = null;
					this.movingHit = null;
					this.finalHit = null;
					this.prepareHits();
					this.processFirstCoord(ev);
					if (this.initialHit || !this.requireInitial) {
						dragging.setIgnoreMove(false);
						this.emitter.trigger("pointerdown", ev);
					} else dragging.setIgnoreMove(true);
				};
				this.handleDragStart = (ev) => {
					this.emitter.trigger("dragstart", ev);
					this.handleMove(ev, true);
				};
				this.handleDragMove = (ev) => {
					this.emitter.trigger("dragmove", ev);
					this.handleMove(ev);
				};
				this.handlePointerUp = (ev) => {
					this.releaseHits();
					this.emitter.trigger("pointerup", ev);
				};
				this.handleDragEnd = (ev) => {
					if (this.movingHit) this.emitter.trigger("hitupdate", null, true, ev);
					this.finalHit = this.movingHit;
					this.movingHit = null;
					this.emitter.trigger("dragend", ev);
				};
				this.droppableStore = droppableStore;
				dragging.emitter.on("pointerdown", this.handlePointerDown);
				dragging.emitter.on("dragstart", this.handleDragStart);
				dragging.emitter.on("dragmove", this.handleDragMove);
				dragging.emitter.on("pointerup", this.handlePointerUp);
				dragging.emitter.on("dragend", this.handleDragEnd);
				this.dragging = dragging;
				this.emitter = new internal_cjs.Emitter();
			}
			processFirstCoord(ev) {
				let origPoint = {
					left: ev.pageX,
					top: ev.pageY
				};
				let adjustedPoint = origPoint;
				let subjectEl = ev.subjectEl;
				let subjectRect;
				if (subjectEl instanceof HTMLElement) {
					subjectRect = internal_cjs.computeRect(subjectEl);
					adjustedPoint = internal_cjs.constrainPoint(adjustedPoint, subjectRect);
				}
				let initialHit = this.initialHit = this.queryHitForOffset(adjustedPoint.left, adjustedPoint.top);
				if (initialHit) {
					if (this.useSubjectCenter && subjectRect) {
						let slicedSubjectRect = internal_cjs.intersectRects(subjectRect, initialHit.rect);
						if (slicedSubjectRect) adjustedPoint = internal_cjs.getRectCenter(slicedSubjectRect);
					}
					this.coordAdjust = internal_cjs.diffPoints(adjustedPoint, origPoint);
				} else this.coordAdjust = {
					left: 0,
					top: 0
				};
			}
			handleMove(ev, forceHandle) {
				let hit = this.queryHitForOffset(ev.pageX + this.coordAdjust.left, ev.pageY + this.coordAdjust.top);
				if (forceHandle || !isHitsEqual(this.movingHit, hit)) {
					this.movingHit = hit;
					this.emitter.trigger("hitupdate", hit, false, ev);
				}
			}
			prepareHits() {
				this.offsetTrackers = internal_cjs.mapHash(this.droppableStore, (interactionSettings) => {
					interactionSettings.component.prepareHits();
					return new OffsetTracker(interactionSettings.el);
				});
			}
			releaseHits() {
				let { offsetTrackers } = this;
				for (let id in offsetTrackers) offsetTrackers[id].destroy();
				this.offsetTrackers = {};
			}
			queryHitForOffset(offsetLeft, offsetTop) {
				let { droppableStore, offsetTrackers } = this;
				let bestHit = null;
				for (let id in droppableStore) {
					let component = droppableStore[id].component;
					let offsetTracker = offsetTrackers[id];
					if (offsetTracker && offsetTracker.isWithinClipping(offsetLeft, offsetTop)) {
						let originLeft = offsetTracker.computeLeft();
						let originTop = offsetTracker.computeTop();
						let positionLeft = offsetLeft - originLeft;
						let positionTop = offsetTop - originTop;
						let { origRect } = offsetTracker;
						let width = origRect.right - origRect.left;
						let height = origRect.bottom - origRect.top;
						if (positionLeft >= 0 && positionLeft < width && positionTop >= 0 && positionTop < height) {
							let hit = component.queryHit(positionLeft, positionTop, width, height);
							if (hit && internal_cjs.rangeContainsRange(hit.dateProfile.activeRange, hit.dateSpan.range) && (this.disablePointCheck || offsetTracker.el.contains(offsetTracker.el.getRootNode().elementFromPoint(positionLeft + originLeft - window.scrollX, positionTop + originTop - window.scrollY))) && (!bestHit || hit.layer > bestHit.layer)) {
								hit.componentId = id;
								hit.context = component.context;
								hit.rect.left += originLeft;
								hit.rect.right += originLeft;
								hit.rect.top += originTop;
								hit.rect.bottom += originTop;
								bestHit = hit;
							}
						}
					}
				}
				return bestHit;
			}
		};
		function isHitsEqual(hit0, hit1) {
			if (!hit0 && !hit1) return true;
			if (Boolean(hit0) !== Boolean(hit1)) return false;
			return internal_cjs.isDateSpansEqual(hit0.dateSpan, hit1.dateSpan);
		}
		function buildDatePointApiWithContext(dateSpan, context) {
			let props = {};
			for (let transform of context.pluginHooks.datePointTransforms) Object.assign(props, transform(dateSpan, context));
			Object.assign(props, buildDatePointApi(dateSpan, context.dateEnv));
			return props;
		}
		function buildDatePointApi(span, dateEnv) {
			return {
				date: dateEnv.toDate(span.range.start),
				dateStr: dateEnv.formatIso(span.range.start, { omitTime: span.allDay }),
				allDay: span.allDay
			};
		}
		var DateClicking = class extends internal_cjs.Interaction {
			constructor(settings) {
				super(settings);
				this.handlePointerDown = (pev) => {
					let { dragging } = this;
					let downEl = pev.origEvent.target;
					dragging.setIgnoreMove(!this.component.isValidDateDownEl(downEl));
				};
				this.handleDragEnd = (ev) => {
					let { component } = this;
					let { pointer } = this.dragging;
					if (!pointer.wasTouchScroll) {
						let { initialHit, finalHit } = this.hitDragging;
						if (initialHit && finalHit && isHitsEqual(initialHit, finalHit)) {
							let { context } = component;
							let arg = Object.assign(Object.assign({}, buildDatePointApiWithContext(initialHit.dateSpan, context)), {
								dayEl: initialHit.dayEl,
								jsEvent: ev.origEvent,
								view: context.viewApi || context.calendarApi.view
							});
							context.emitter.trigger("dateClick", arg);
						}
					}
				};
				this.dragging = new FeaturefulElementDragging(settings.el);
				this.dragging.autoScroller.isEnabled = false;
				let hitDragging = this.hitDragging = new HitDragging(this.dragging, internal_cjs.interactionSettingsToStore(settings));
				hitDragging.emitter.on("pointerdown", this.handlePointerDown);
				hitDragging.emitter.on("dragend", this.handleDragEnd);
			}
			destroy() {
				this.dragging.destroy();
			}
		};
		var DateSelecting = class extends internal_cjs.Interaction {
			constructor(settings) {
				super(settings);
				this.dragSelection = null;
				this.handlePointerDown = (ev) => {
					let { component, dragging } = this;
					let { options } = component.context;
					let canSelect = options.selectable && component.isValidDateDownEl(ev.origEvent.target);
					dragging.setIgnoreMove(!canSelect);
					dragging.delay = ev.isTouch ? getComponentTouchDelay$1(component) : null;
				};
				this.handleDragStart = (ev) => {
					this.component.context.calendarApi.unselect(ev);
				};
				this.handleHitUpdate = (hit, isFinal) => {
					let { context } = this.component;
					let dragSelection = null;
					let isInvalid = false;
					if (hit) {
						let initialHit = this.hitDragging.initialHit;
						if (!(hit.componentId === initialHit.componentId && this.isHitComboAllowed && !this.isHitComboAllowed(initialHit, hit))) dragSelection = joinHitsIntoSelection(initialHit, hit, context.pluginHooks.dateSelectionTransformers);
						if (!dragSelection || !internal_cjs.isDateSelectionValid(dragSelection, hit.dateProfile, context)) {
							isInvalid = true;
							dragSelection = null;
						}
					}
					if (dragSelection) context.dispatch({
						type: "SELECT_DATES",
						selection: dragSelection
					});
					else if (!isFinal) context.dispatch({ type: "UNSELECT_DATES" });
					if (!isInvalid) internal_cjs.enableCursor();
					else internal_cjs.disableCursor();
					if (!isFinal) this.dragSelection = dragSelection;
				};
				this.handlePointerUp = (pev) => {
					if (this.dragSelection) {
						internal_cjs.triggerDateSelect(this.dragSelection, pev, this.component.context);
						this.dragSelection = null;
					}
				};
				let { component } = settings;
				let { options } = component.context;
				let dragging = this.dragging = new FeaturefulElementDragging(settings.el);
				dragging.touchScrollAllowed = false;
				dragging.minDistance = options.selectMinDistance || 0;
				dragging.autoScroller.isEnabled = options.dragScroll;
				let hitDragging = this.hitDragging = new HitDragging(this.dragging, internal_cjs.interactionSettingsToStore(settings));
				hitDragging.emitter.on("pointerdown", this.handlePointerDown);
				hitDragging.emitter.on("dragstart", this.handleDragStart);
				hitDragging.emitter.on("hitupdate", this.handleHitUpdate);
				hitDragging.emitter.on("pointerup", this.handlePointerUp);
			}
			destroy() {
				this.dragging.destroy();
			}
		};
		function getComponentTouchDelay$1(component) {
			let { options } = component.context;
			let delay = options.selectLongPressDelay;
			if (delay == null) delay = options.longPressDelay;
			return delay;
		}
		function joinHitsIntoSelection(hit0, hit1, dateSelectionTransformers) {
			let dateSpan0 = hit0.dateSpan;
			let dateSpan1 = hit1.dateSpan;
			let ms = [
				dateSpan0.range.start,
				dateSpan0.range.end,
				dateSpan1.range.start,
				dateSpan1.range.end
			];
			ms.sort(internal_cjs.compareNumbers);
			let props = {};
			for (let transformer of dateSelectionTransformers) {
				let res = transformer(hit0, hit1);
				if (res === false) return null;
				if (res) Object.assign(props, res);
			}
			props.range = {
				start: ms[0],
				end: ms[3]
			};
			props.allDay = dateSpan0.allDay;
			return props;
		}
		var EventDragging = class EventDragging extends internal_cjs.Interaction {
			constructor(settings) {
				super(settings);
				this.subjectEl = null;
				this.subjectSeg = null;
				this.isDragging = false;
				this.eventRange = null;
				this.relevantEvents = null;
				this.receivingContext = null;
				this.validMutation = null;
				this.mutatedRelevantEvents = null;
				this.handlePointerDown = (ev) => {
					let origTarget = ev.origEvent.target;
					let { component, dragging } = this;
					let { mirror } = dragging;
					let { options } = component.context;
					let initialContext = component.context;
					this.subjectEl = ev.subjectEl;
					let subjectSeg = this.subjectSeg = internal_cjs.getElSeg(ev.subjectEl);
					let eventInstanceId = (this.eventRange = subjectSeg.eventRange).instance.instanceId;
					this.relevantEvents = internal_cjs.getRelevantEvents(initialContext.getCurrentData().eventStore, eventInstanceId);
					dragging.minDistance = ev.isTouch ? 0 : options.eventDragMinDistance;
					dragging.delay = ev.isTouch && eventInstanceId !== component.props.eventSelection ? getComponentTouchDelay(component) : null;
					if (options.fixedMirrorParent) mirror.parentNode = options.fixedMirrorParent;
					else mirror.parentNode = internal_cjs.elementClosest(origTarget, ".fc");
					mirror.revertDuration = options.dragRevertDuration;
					let isValid = component.isValidSegDownEl(origTarget) && !internal_cjs.elementClosest(origTarget, ".fc-event-resizer");
					dragging.setIgnoreMove(!isValid);
					this.isDragging = isValid && ev.subjectEl.classList.contains("fc-event-draggable");
				};
				this.handleDragStart = (ev) => {
					let initialContext = this.component.context;
					let eventRange = this.eventRange;
					let eventInstanceId = eventRange.instance.instanceId;
					if (ev.isTouch) {
						if (eventInstanceId !== this.component.props.eventSelection) initialContext.dispatch({
							type: "SELECT_EVENT",
							eventInstanceId
						});
					} else initialContext.dispatch({ type: "UNSELECT_EVENT" });
					if (this.isDragging) {
						initialContext.calendarApi.unselect(ev);
						initialContext.emitter.trigger("eventDragStart", {
							el: this.subjectEl,
							event: new internal_cjs.EventImpl(initialContext, eventRange.def, eventRange.instance),
							jsEvent: ev.origEvent,
							view: initialContext.viewApi
						});
					}
				};
				this.handleHitUpdate = (hit, isFinal) => {
					if (!this.isDragging) return;
					let relevantEvents = this.relevantEvents;
					let initialHit = this.hitDragging.initialHit;
					let initialContext = this.component.context;
					let receivingContext = null;
					let mutation = null;
					let mutatedRelevantEvents = null;
					let isInvalid = false;
					let interaction = {
						affectedEvents: relevantEvents,
						mutatedEvents: internal_cjs.createEmptyEventStore(),
						isEvent: true
					};
					if (hit) {
						receivingContext = hit.context;
						let receivingOptions = receivingContext.options;
						if (initialContext === receivingContext || receivingOptions.editable && receivingOptions.droppable) {
							mutation = computeEventMutation(initialHit, hit, this.eventRange.instance.range.start, receivingContext.getCurrentData().pluginHooks.eventDragMutationMassagers);
							if (mutation) {
								mutatedRelevantEvents = internal_cjs.applyMutationToEventStore(relevantEvents, receivingContext.getCurrentData().eventUiBases, mutation, receivingContext);
								interaction.mutatedEvents = mutatedRelevantEvents;
								if (!internal_cjs.isInteractionValid(interaction, hit.dateProfile, receivingContext)) {
									isInvalid = true;
									mutation = null;
									mutatedRelevantEvents = null;
									interaction.mutatedEvents = internal_cjs.createEmptyEventStore();
								}
							}
						} else receivingContext = null;
					}
					this.displayDrag(receivingContext, interaction);
					if (!isInvalid) internal_cjs.enableCursor();
					else internal_cjs.disableCursor();
					if (!isFinal) {
						if (initialContext === receivingContext && isHitsEqual(initialHit, hit)) mutation = null;
						this.dragging.setMirrorNeedsRevert(!mutation);
						this.dragging.setMirrorIsVisible(!hit || !this.subjectEl.getRootNode().querySelector(".fc-event-mirror"));
						this.receivingContext = receivingContext;
						this.validMutation = mutation;
						this.mutatedRelevantEvents = mutatedRelevantEvents;
					}
				};
				this.handlePointerUp = () => {
					if (!this.isDragging) this.cleanup();
				};
				this.handleDragEnd = (ev) => {
					if (this.isDragging) {
						let initialContext = this.component.context;
						let initialView = initialContext.viewApi;
						let { receivingContext, validMutation } = this;
						let eventDef = this.eventRange.def;
						let eventInstance = this.eventRange.instance;
						let eventApi = new internal_cjs.EventImpl(initialContext, eventDef, eventInstance);
						let relevantEvents = this.relevantEvents;
						let mutatedRelevantEvents = this.mutatedRelevantEvents;
						let { finalHit } = this.hitDragging;
						this.clearDrag();
						initialContext.emitter.trigger("eventDragStop", {
							el: this.subjectEl,
							event: eventApi,
							jsEvent: ev.origEvent,
							view: initialView
						});
						if (validMutation) {
							if (receivingContext === initialContext) {
								let updatedEventApi = new internal_cjs.EventImpl(initialContext, mutatedRelevantEvents.defs[eventDef.defId], eventInstance ? mutatedRelevantEvents.instances[eventInstance.instanceId] : null);
								initialContext.dispatch({
									type: "MERGE_EVENTS",
									eventStore: mutatedRelevantEvents
								});
								let eventChangeArg = {
									oldEvent: eventApi,
									event: updatedEventApi,
									relatedEvents: internal_cjs.buildEventApis(mutatedRelevantEvents, initialContext, eventInstance),
									revert() {
										initialContext.dispatch({
											type: "MERGE_EVENTS",
											eventStore: relevantEvents
										});
									}
								};
								let transformed = {};
								for (let transformer of initialContext.getCurrentData().pluginHooks.eventDropTransformers) Object.assign(transformed, transformer(validMutation, initialContext));
								initialContext.emitter.trigger("eventDrop", Object.assign(Object.assign(Object.assign({}, eventChangeArg), transformed), {
									el: ev.subjectEl,
									delta: validMutation.datesDelta,
									jsEvent: ev.origEvent,
									view: initialView
								}));
								initialContext.emitter.trigger("eventChange", eventChangeArg);
							} else if (receivingContext) {
								let eventRemoveArg = {
									event: eventApi,
									relatedEvents: internal_cjs.buildEventApis(relevantEvents, initialContext, eventInstance),
									revert() {
										initialContext.dispatch({
											type: "MERGE_EVENTS",
											eventStore: relevantEvents
										});
									}
								};
								initialContext.emitter.trigger("eventLeave", Object.assign(Object.assign({}, eventRemoveArg), {
									draggedEl: ev.subjectEl,
									view: initialView
								}));
								initialContext.dispatch({
									type: "REMOVE_EVENTS",
									eventStore: relevantEvents
								});
								initialContext.emitter.trigger("eventRemove", eventRemoveArg);
								let addedEventDef = mutatedRelevantEvents.defs[eventDef.defId];
								let addedEventInstance = mutatedRelevantEvents.instances[eventInstance.instanceId];
								let addedEventApi = new internal_cjs.EventImpl(receivingContext, addedEventDef, addedEventInstance);
								receivingContext.dispatch({
									type: "MERGE_EVENTS",
									eventStore: mutatedRelevantEvents
								});
								let eventAddArg = {
									event: addedEventApi,
									relatedEvents: internal_cjs.buildEventApis(mutatedRelevantEvents, receivingContext, addedEventInstance),
									revert() {
										receivingContext.dispatch({
											type: "REMOVE_EVENTS",
											eventStore: mutatedRelevantEvents
										});
									}
								};
								receivingContext.emitter.trigger("eventAdd", eventAddArg);
								if (ev.isTouch) receivingContext.dispatch({
									type: "SELECT_EVENT",
									eventInstanceId: eventInstance.instanceId
								});
								receivingContext.emitter.trigger("drop", Object.assign(Object.assign({}, buildDatePointApiWithContext(finalHit.dateSpan, receivingContext)), {
									draggedEl: ev.subjectEl,
									jsEvent: ev.origEvent,
									view: finalHit.context.viewApi
								}));
								receivingContext.emitter.trigger("eventReceive", Object.assign(Object.assign({}, eventAddArg), {
									draggedEl: ev.subjectEl,
									view: finalHit.context.viewApi
								}));
							}
						} else initialContext.emitter.trigger("_noEventDrop");
					}
					this.cleanup();
				};
				let { component } = this;
				let { options } = component.context;
				let dragging = this.dragging = new FeaturefulElementDragging(settings.el);
				dragging.pointer.selector = EventDragging.SELECTOR;
				dragging.touchScrollAllowed = false;
				dragging.autoScroller.isEnabled = options.dragScroll;
				let hitDragging = this.hitDragging = new HitDragging(this.dragging, internal_cjs.interactionSettingsStore);
				hitDragging.useSubjectCenter = settings.useEventCenter;
				hitDragging.emitter.on("pointerdown", this.handlePointerDown);
				hitDragging.emitter.on("dragstart", this.handleDragStart);
				hitDragging.emitter.on("hitupdate", this.handleHitUpdate);
				hitDragging.emitter.on("pointerup", this.handlePointerUp);
				hitDragging.emitter.on("dragend", this.handleDragEnd);
			}
			destroy() {
				this.dragging.destroy();
			}
			displayDrag(nextContext, state) {
				let initialContext = this.component.context;
				let prevContext = this.receivingContext;
				if (prevContext && prevContext !== nextContext) {
					if (prevContext === initialContext) prevContext.dispatch({
						type: "SET_EVENT_DRAG",
						state: {
							affectedEvents: state.affectedEvents,
							mutatedEvents: internal_cjs.createEmptyEventStore(),
							isEvent: true
						}
					});
					else prevContext.dispatch({ type: "UNSET_EVENT_DRAG" });
				}
				if (nextContext) nextContext.dispatch({
					type: "SET_EVENT_DRAG",
					state
				});
			}
			clearDrag() {
				let initialCalendar = this.component.context;
				let { receivingContext } = this;
				if (receivingContext) receivingContext.dispatch({ type: "UNSET_EVENT_DRAG" });
				if (initialCalendar !== receivingContext) initialCalendar.dispatch({ type: "UNSET_EVENT_DRAG" });
			}
			cleanup() {
				this.subjectSeg = null;
				this.isDragging = false;
				this.eventRange = null;
				this.relevantEvents = null;
				this.receivingContext = null;
				this.validMutation = null;
				this.mutatedRelevantEvents = null;
			}
		};
		EventDragging.SELECTOR = ".fc-event-draggable, .fc-event-resizable";
		function computeEventMutation(hit0, hit1, eventInstanceStart, massagers) {
			let dateSpan0 = hit0.dateSpan;
			let dateSpan1 = hit1.dateSpan;
			let date0 = dateSpan0.range.start;
			let date1 = dateSpan1.range.start;
			let standardProps = {};
			if (dateSpan0.allDay !== dateSpan1.allDay) {
				standardProps.allDay = dateSpan1.allDay;
				standardProps.hasEnd = hit1.context.options.allDayMaintainDuration;
				if (dateSpan1.allDay) date0 = internal_cjs.startOfDay(eventInstanceStart);
				else date0 = eventInstanceStart;
			}
			let delta = internal_cjs.diffDates(date0, date1, hit0.context.dateEnv, hit0.componentId === hit1.componentId ? hit0.largeUnit : null);
			if (delta.milliseconds) standardProps.allDay = false;
			let mutation = {
				datesDelta: delta,
				standardProps
			};
			for (let massager of massagers) massager(mutation, hit0, hit1);
			return mutation;
		}
		function getComponentTouchDelay(component) {
			let { options } = component.context;
			let delay = options.eventLongPressDelay;
			if (delay == null) delay = options.longPressDelay;
			return delay;
		}
		var EventResizing = class extends internal_cjs.Interaction {
			constructor(settings) {
				super(settings);
				this.draggingSegEl = null;
				this.draggingSeg = null;
				this.eventRange = null;
				this.relevantEvents = null;
				this.validMutation = null;
				this.mutatedRelevantEvents = null;
				this.handlePointerDown = (ev) => {
					let { component } = this;
					let segEl = this.querySegEl(ev);
					let seg = internal_cjs.getElSeg(segEl);
					let eventRange = this.eventRange = seg.eventRange;
					this.dragging.minDistance = component.context.options.eventDragMinDistance;
					this.dragging.setIgnoreMove(!this.component.isValidSegDownEl(ev.origEvent.target) || ev.isTouch && this.component.props.eventSelection !== eventRange.instance.instanceId);
				};
				this.handleDragStart = (ev) => {
					let { context } = this.component;
					let eventRange = this.eventRange;
					this.relevantEvents = internal_cjs.getRelevantEvents(context.getCurrentData().eventStore, this.eventRange.instance.instanceId);
					let segEl = this.querySegEl(ev);
					this.draggingSegEl = segEl;
					this.draggingSeg = internal_cjs.getElSeg(segEl);
					context.calendarApi.unselect();
					context.emitter.trigger("eventResizeStart", {
						el: segEl,
						event: new internal_cjs.EventImpl(context, eventRange.def, eventRange.instance),
						jsEvent: ev.origEvent,
						view: context.viewApi
					});
				};
				this.handleHitUpdate = (hit, isFinal, ev) => {
					let { context } = this.component;
					let relevantEvents = this.relevantEvents;
					let initialHit = this.hitDragging.initialHit;
					let eventInstance = this.eventRange.instance;
					let mutation = null;
					let mutatedRelevantEvents = null;
					let isInvalid = false;
					let interaction = {
						affectedEvents: relevantEvents,
						mutatedEvents: internal_cjs.createEmptyEventStore(),
						isEvent: true
					};
					if (hit) {
						if (!(hit.componentId === initialHit.componentId && this.isHitComboAllowed && !this.isHitComboAllowed(initialHit, hit))) mutation = computeMutation(initialHit, hit, ev.subjectEl.classList.contains("fc-event-resizer-start"), eventInstance.range);
					}
					if (mutation) {
						mutatedRelevantEvents = internal_cjs.applyMutationToEventStore(relevantEvents, context.getCurrentData().eventUiBases, mutation, context);
						interaction.mutatedEvents = mutatedRelevantEvents;
						if (!internal_cjs.isInteractionValid(interaction, hit.dateProfile, context)) {
							isInvalid = true;
							mutation = null;
							mutatedRelevantEvents = null;
							interaction.mutatedEvents = null;
						}
					}
					if (mutatedRelevantEvents) context.dispatch({
						type: "SET_EVENT_RESIZE",
						state: interaction
					});
					else context.dispatch({ type: "UNSET_EVENT_RESIZE" });
					if (!isInvalid) internal_cjs.enableCursor();
					else internal_cjs.disableCursor();
					if (!isFinal) {
						if (mutation && isHitsEqual(initialHit, hit)) mutation = null;
						this.validMutation = mutation;
						this.mutatedRelevantEvents = mutatedRelevantEvents;
					}
				};
				this.handleDragEnd = (ev) => {
					let { context } = this.component;
					let eventDef = this.eventRange.def;
					let eventInstance = this.eventRange.instance;
					let eventApi = new internal_cjs.EventImpl(context, eventDef, eventInstance);
					let relevantEvents = this.relevantEvents;
					let mutatedRelevantEvents = this.mutatedRelevantEvents;
					context.emitter.trigger("eventResizeStop", {
						el: this.draggingSegEl,
						event: eventApi,
						jsEvent: ev.origEvent,
						view: context.viewApi
					});
					if (this.validMutation) {
						let updatedEventApi = new internal_cjs.EventImpl(context, mutatedRelevantEvents.defs[eventDef.defId], eventInstance ? mutatedRelevantEvents.instances[eventInstance.instanceId] : null);
						context.dispatch({
							type: "MERGE_EVENTS",
							eventStore: mutatedRelevantEvents
						});
						let eventChangeArg = {
							oldEvent: eventApi,
							event: updatedEventApi,
							relatedEvents: internal_cjs.buildEventApis(mutatedRelevantEvents, context, eventInstance),
							revert() {
								context.dispatch({
									type: "MERGE_EVENTS",
									eventStore: relevantEvents
								});
							}
						};
						context.emitter.trigger("eventResize", Object.assign(Object.assign({}, eventChangeArg), {
							el: this.draggingSegEl,
							startDelta: this.validMutation.startDelta || internal_cjs.createDuration(0),
							endDelta: this.validMutation.endDelta || internal_cjs.createDuration(0),
							jsEvent: ev.origEvent,
							view: context.viewApi
						}));
						context.emitter.trigger("eventChange", eventChangeArg);
					} else context.emitter.trigger("_noEventResize");
					this.draggingSeg = null;
					this.relevantEvents = null;
					this.validMutation = null;
				};
				let { component } = settings;
				let dragging = this.dragging = new FeaturefulElementDragging(settings.el);
				dragging.pointer.selector = ".fc-event-resizer";
				dragging.touchScrollAllowed = false;
				dragging.autoScroller.isEnabled = component.context.options.dragScroll;
				let hitDragging = this.hitDragging = new HitDragging(this.dragging, internal_cjs.interactionSettingsToStore(settings));
				hitDragging.emitter.on("pointerdown", this.handlePointerDown);
				hitDragging.emitter.on("dragstart", this.handleDragStart);
				hitDragging.emitter.on("hitupdate", this.handleHitUpdate);
				hitDragging.emitter.on("dragend", this.handleDragEnd);
			}
			destroy() {
				this.dragging.destroy();
			}
			querySegEl(ev) {
				return internal_cjs.elementClosest(ev.subjectEl, ".fc-event");
			}
		};
		function computeMutation(hit0, hit1, isFromStart, instanceRange) {
			let dateEnv = hit0.context.dateEnv;
			let date0 = hit0.dateSpan.range.start;
			let date1 = hit1.dateSpan.range.start;
			let delta = internal_cjs.diffDates(date0, date1, dateEnv, hit0.largeUnit);
			if (isFromStart) {
				if (dateEnv.add(instanceRange.start, delta) < instanceRange.end) return { startDelta: delta };
			} else if (dateEnv.add(instanceRange.end, delta) > instanceRange.start) return { endDelta: delta };
			return null;
		}
		var UnselectAuto = class {
			constructor(context) {
				this.context = context;
				this.isRecentPointerDateSelect = false;
				this.matchesCancel = false;
				this.matchesEvent = false;
				this.onSelect = (selectInfo) => {
					if (selectInfo.jsEvent) this.isRecentPointerDateSelect = true;
				};
				this.onDocumentPointerDown = (pev) => {
					let unselectCancel = this.context.options.unselectCancel;
					let downEl = internal_cjs.getEventTargetViaRoot(pev.origEvent);
					this.matchesCancel = !!internal_cjs.elementClosest(downEl, unselectCancel);
					this.matchesEvent = !!internal_cjs.elementClosest(downEl, EventDragging.SELECTOR);
				};
				this.onDocumentPointerUp = (pev) => {
					let { context } = this;
					let { documentPointer } = this;
					let calendarState = context.getCurrentData();
					if (!documentPointer.wasTouchScroll) {
						if (calendarState.dateSelection && !this.isRecentPointerDateSelect) {
							let unselectAuto = context.options.unselectAuto;
							if (unselectAuto && (!unselectAuto || !this.matchesCancel)) context.calendarApi.unselect(pev);
						}
						if (calendarState.eventSelection && !this.matchesEvent) context.dispatch({ type: "UNSELECT_EVENT" });
					}
					this.isRecentPointerDateSelect = false;
				};
				let documentPointer = this.documentPointer = new PointerDragging(document);
				documentPointer.shouldIgnoreMove = true;
				documentPointer.shouldWatchScroll = false;
				documentPointer.emitter.on("pointerdown", this.onDocumentPointerDown);
				documentPointer.emitter.on("pointerup", this.onDocumentPointerUp);
				context.emitter.on("select", this.onSelect);
			}
			destroy() {
				this.context.emitter.off("select", this.onSelect);
				this.documentPointer.destroy();
			}
		};
		const OPTION_REFINERS = { fixedMirrorParent: internal_cjs.identity };
		const LISTENER_REFINERS = {
			dateClick: internal_cjs.identity,
			eventDragStart: internal_cjs.identity,
			eventDragStop: internal_cjs.identity,
			eventDrop: internal_cjs.identity,
			eventResizeStart: internal_cjs.identity,
			eventResizeStop: internal_cjs.identity,
			eventResize: internal_cjs.identity,
			drop: internal_cjs.identity,
			eventReceive: internal_cjs.identity,
			eventLeave: internal_cjs.identity
		};
		var ExternalElementDragging = class {
			constructor(dragging, suppliedDragMeta) {
				this.receivingContext = null;
				this.droppableEvent = null;
				this.suppliedDragMeta = null;
				this.dragMeta = null;
				this.handleDragStart = (ev) => {
					this.dragMeta = this.buildDragMeta(ev.subjectEl);
				};
				this.handleHitUpdate = (hit, isFinal, ev) => {
					let { dragging } = this.hitDragging;
					let receivingContext = null;
					let droppableEvent = null;
					let isInvalid = false;
					let interaction = {
						affectedEvents: internal_cjs.createEmptyEventStore(),
						mutatedEvents: internal_cjs.createEmptyEventStore(),
						isEvent: this.dragMeta.create
					};
					if (hit) {
						receivingContext = hit.context;
						if (this.canDropElOnCalendar(ev.subjectEl, receivingContext)) {
							droppableEvent = computeEventForDateSpan(hit.dateSpan, this.dragMeta, receivingContext);
							interaction.mutatedEvents = internal_cjs.eventTupleToStore(droppableEvent);
							isInvalid = !internal_cjs.isInteractionValid(interaction, hit.dateProfile, receivingContext);
							if (isInvalid) {
								interaction.mutatedEvents = internal_cjs.createEmptyEventStore();
								droppableEvent = null;
							}
						}
					}
					this.displayDrag(receivingContext, interaction);
					dragging.setMirrorIsVisible(isFinal || !droppableEvent || !document.querySelector(".fc-event-mirror"));
					if (!isInvalid) internal_cjs.enableCursor();
					else internal_cjs.disableCursor();
					if (!isFinal) {
						dragging.setMirrorNeedsRevert(!droppableEvent);
						this.receivingContext = receivingContext;
						this.droppableEvent = droppableEvent;
					}
				};
				this.handleDragEnd = (pev) => {
					let { receivingContext, droppableEvent } = this;
					this.clearDrag();
					if (receivingContext && droppableEvent) {
						let finalHit = this.hitDragging.finalHit;
						let finalView = finalHit.context.viewApi;
						let dragMeta = this.dragMeta;
						receivingContext.emitter.trigger("drop", Object.assign(Object.assign({}, buildDatePointApiWithContext(finalHit.dateSpan, receivingContext)), {
							draggedEl: pev.subjectEl,
							jsEvent: pev.origEvent,
							view: finalView
						}));
						if (dragMeta.create) {
							let addingEvents = internal_cjs.eventTupleToStore(droppableEvent);
							receivingContext.dispatch({
								type: "MERGE_EVENTS",
								eventStore: addingEvents
							});
							if (pev.isTouch) receivingContext.dispatch({
								type: "SELECT_EVENT",
								eventInstanceId: droppableEvent.instance.instanceId
							});
							receivingContext.emitter.trigger("eventReceive", {
								event: new internal_cjs.EventImpl(receivingContext, droppableEvent.def, droppableEvent.instance),
								relatedEvents: [],
								revert() {
									receivingContext.dispatch({
										type: "REMOVE_EVENTS",
										eventStore: addingEvents
									});
								},
								draggedEl: pev.subjectEl,
								view: finalView
							});
						}
					}
					this.receivingContext = null;
					this.droppableEvent = null;
				};
				let hitDragging = this.hitDragging = new HitDragging(dragging, internal_cjs.interactionSettingsStore);
				hitDragging.requireInitial = false;
				hitDragging.emitter.on("dragstart", this.handleDragStart);
				hitDragging.emitter.on("hitupdate", this.handleHitUpdate);
				hitDragging.emitter.on("dragend", this.handleDragEnd);
				this.suppliedDragMeta = suppliedDragMeta;
			}
			buildDragMeta(subjectEl) {
				if (typeof this.suppliedDragMeta === "object") return internal_cjs.parseDragMeta(this.suppliedDragMeta);
				if (typeof this.suppliedDragMeta === "function") return internal_cjs.parseDragMeta(this.suppliedDragMeta(subjectEl));
				return getDragMetaFromEl(subjectEl);
			}
			displayDrag(nextContext, state) {
				let prevContext = this.receivingContext;
				if (prevContext && prevContext !== nextContext) prevContext.dispatch({ type: "UNSET_EVENT_DRAG" });
				if (nextContext) nextContext.dispatch({
					type: "SET_EVENT_DRAG",
					state
				});
			}
			clearDrag() {
				if (this.receivingContext) this.receivingContext.dispatch({ type: "UNSET_EVENT_DRAG" });
			}
			canDropElOnCalendar(el, receivingContext) {
				let dropAccept = receivingContext.options.dropAccept;
				if (typeof dropAccept === "function") return dropAccept.call(receivingContext.calendarApi, el);
				if (typeof dropAccept === "string" && dropAccept) return Boolean(internal_cjs.elementMatches(el, dropAccept));
				return true;
			}
		};
		function computeEventForDateSpan(dateSpan, dragMeta, context) {
			let defProps = Object.assign({}, dragMeta.leftoverProps);
			for (let transform of context.pluginHooks.externalDefTransforms) Object.assign(defProps, transform(dateSpan, dragMeta));
			let { refined, extra } = internal_cjs.refineEventDef(defProps, context);
			let def = internal_cjs.parseEventDef(refined, extra, dragMeta.sourceId, dateSpan.allDay, context.options.forceEventDuration || Boolean(dragMeta.duration), context);
			let start = dateSpan.range.start;
			if (dateSpan.allDay && dragMeta.startTime) start = context.dateEnv.add(start, dragMeta.startTime);
			let end = dragMeta.duration ? context.dateEnv.add(start, dragMeta.duration) : internal_cjs.getDefaultEventEnd(dateSpan.allDay, start, context);
			return {
				def,
				instance: internal_cjs.createEventInstance(def.defId, {
					start,
					end
				})
			};
		}
		function getDragMetaFromEl(el) {
			let str = getEmbeddedElData(el, "event");
			let obj = str ? JSON.parse(str) : { create: false };
			return internal_cjs.parseDragMeta(obj);
		}
		internal_cjs.config.dataAttrPrefix = "";
		function getEmbeddedElData(el, name) {
			let prefix = internal_cjs.config.dataAttrPrefix;
			let prefixedName = (prefix ? prefix + "-" : "") + name;
			return el.getAttribute("data-" + prefixedName) || "";
		}
		var ExternalDraggable = class {
			constructor(el, settings = {}) {
				this.handlePointerDown = (ev) => {
					let { dragging } = this;
					let { minDistance, longPressDelay } = this.settings;
					dragging.minDistance = minDistance != null ? minDistance : ev.isTouch ? 0 : internal_cjs.BASE_OPTION_DEFAULTS.eventDragMinDistance;
					dragging.delay = ev.isTouch ? longPressDelay != null ? longPressDelay : internal_cjs.BASE_OPTION_DEFAULTS.longPressDelay : 0;
				};
				this.handleDragStart = (ev) => {
					if (ev.isTouch && this.dragging.delay && ev.subjectEl.classList.contains("fc-event")) this.dragging.mirror.getMirrorEl().classList.add("fc-event-selected");
				};
				this.settings = settings;
				let dragging = this.dragging = new FeaturefulElementDragging(el);
				dragging.touchScrollAllowed = false;
				if (settings.itemSelector != null) dragging.pointer.selector = settings.itemSelector;
				if (settings.appendTo != null) dragging.mirror.parentNode = settings.appendTo;
				dragging.emitter.on("pointerdown", this.handlePointerDown);
				dragging.emitter.on("dragstart", this.handleDragStart);
				new ExternalElementDragging(dragging, settings.eventData);
			}
			destroy() {
				this.dragging.destroy();
			}
		};
		var InferredElementDragging = class extends internal_cjs.ElementDragging {
			constructor(containerEl) {
				super(containerEl);
				this.shouldIgnoreMove = false;
				this.mirrorSelector = "";
				this.currentMirrorEl = null;
				this.handlePointerDown = (ev) => {
					this.emitter.trigger("pointerdown", ev);
					if (!this.shouldIgnoreMove) this.emitter.trigger("dragstart", ev);
				};
				this.handlePointerMove = (ev) => {
					if (!this.shouldIgnoreMove) this.emitter.trigger("dragmove", ev);
				};
				this.handlePointerUp = (ev) => {
					this.emitter.trigger("pointerup", ev);
					if (!this.shouldIgnoreMove) this.emitter.trigger("dragend", ev);
				};
				let pointer = this.pointer = new PointerDragging(containerEl);
				pointer.emitter.on("pointerdown", this.handlePointerDown);
				pointer.emitter.on("pointermove", this.handlePointerMove);
				pointer.emitter.on("pointerup", this.handlePointerUp);
			}
			destroy() {
				this.pointer.destroy();
			}
			setIgnoreMove(bool) {
				this.shouldIgnoreMove = bool;
			}
			setMirrorIsVisible(bool) {
				if (bool) {
					if (this.currentMirrorEl) {
						this.currentMirrorEl.style.visibility = "";
						this.currentMirrorEl = null;
					}
				} else {
					let mirrorEl = this.mirrorSelector ? document.querySelector(this.mirrorSelector) : null;
					if (mirrorEl) {
						this.currentMirrorEl = mirrorEl;
						mirrorEl.style.visibility = "hidden";
					}
				}
			}
		};
		var ThirdPartyDraggable = class {
			constructor(containerOrSettings, settings) {
				let containerEl = document;
				if (containerOrSettings === document || containerOrSettings instanceof Element) {
					containerEl = containerOrSettings;
					settings = settings || {};
				} else settings = containerOrSettings || {};
				let dragging = this.dragging = new InferredElementDragging(containerEl);
				if (typeof settings.itemSelector === "string") dragging.pointer.selector = settings.itemSelector;
				else if (containerEl === document) dragging.pointer.selector = "[data-event]";
				if (typeof settings.mirrorSelector === "string") dragging.mirrorSelector = settings.mirrorSelector;
				let externalDragging = new ExternalElementDragging(dragging, settings.eventData);
				externalDragging.hitDragging.disablePointCheck = true;
			}
			destroy() {
				this.dragging.destroy();
			}
		};
		var index = index_cjs.createPlugin({
			name: "@fullcalendar/interaction",
			componentInteractions: [
				DateClicking,
				DateSelecting,
				EventDragging,
				EventResizing
			],
			calendarInteractions: [UnselectAuto],
			elementDraggingImpl: FeaturefulElementDragging,
			optionRefiners: OPTION_REFINERS,
			listenerRefiners: LISTENER_REFINERS
		});
		exports.Draggable = ExternalDraggable;
		exports.ThirdPartyDraggable = ThirdPartyDraggable;
		exports["default"] = index;
	}));
	//#endregion
	//#region src/client/api.ts
	var import_dist = /* @__PURE__ */ __toESM(require_dist(), 1);
	var import_daygrid = /* @__PURE__ */ __toESM(require_daygrid(), 1);
	var import_timegrid = /* @__PURE__ */ __toESM(require_timegrid(), 1);
	var import_interaction = /* @__PURE__ */ __toESM(require_interaction(), 1);
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
		calendarUntitledEvent: "Untitled event",
		calendarDeleteConfirm: "Delete \"{title}\"?",
		calendarEventModalTitle: "New event",
		calendarEventTitleLabel: "Title",
		calendarEventTitlePlaceholder: "Untitled event",
		calendarEventStartLabel: "Starts",
		calendarEventEndLabel: "Ends",
		calendarEventLocationLabel: "Location",
		calendarEventLocationPlaceholder: "Add a location",
		calendarEventDescriptionLabel: "Description",
		calendarEventDescriptionPlaceholder: "Add a description",
		calendarEventCreate: "Create",
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
			calendarUntitledEvent: "未命名事件",
			calendarDeleteConfirm: "删除「{title}」？",
			calendarEventModalTitle: "新建事件",
			calendarEventTitleLabel: "标题",
			calendarEventTitlePlaceholder: "未命名事件",
			calendarEventStartLabel: "开始时间",
			calendarEventEndLabel: "结束时间",
			calendarEventLocationLabel: "地点",
			calendarEventLocationPlaceholder: "添加地点",
			calendarEventDescriptionLabel: "描述",
			calendarEventDescriptionPlaceholder: "添加描述",
			calendarEventCreate: "创建",
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
	const css = ".Kvd2vq_toggleCluster{z-index:45;flex-direction:row;gap:4px;display:flex;position:fixed;top:3px;right:10px}.Kvd2vq_panel:not(.Kvd2vq_panelHidden) .Kvd2vq_tabBar{padding-right:72px}.Kvd2vq_toggleButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out), color var(--ds-transition-duration-slow) var(--ds-ease-in-out);background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;display:flex}.Kvd2vq_toggleButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_toggleButton:disabled{opacity:.4;cursor:default}.Kvd2vq_panel{z-index:41;background:var(--dsw-alias-bg-layer-1);border-left:1px solid var(--dsw-alias-border-l2);transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), width var(--ds-transition-duration-slow) var(--ds-ease-in-out);flex-direction:column;display:flex;position:fixed;top:0;bottom:0;right:0}.Kvd2vq_panelHidden{pointer-events:none;visibility:hidden;transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), width var(--ds-transition-duration-slow) var(--ds-ease-in-out), visibility 0s linear var(--ds-transition-duration-slow);transform:translate(102%)}.Kvd2vq_panel[data-dragging]{transition:none}.Kvd2vq_panelResize{cursor:col-resize;z-index:2;touch-action:none;width:8px;position:absolute;top:0;bottom:0;left:-4px}.Kvd2vq_panelResizeActive{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_panelBody{flex:1;min-width:0;min-height:0;display:flex}.Kvd2vq_bottomPanel{z-index:40;background:var(--dsw-alias-bg-layer-1);border-top:1px solid var(--dsw-alias-border-l2);transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), height var(--ds-transition-duration-slow) var(--ds-ease-in-out);flex-direction:column;display:flex;position:fixed;bottom:0;right:0}.Kvd2vq_bottomPanelHidden{pointer-events:none;visibility:hidden;transition:transform var(--ds-transition-duration-slow) var(--ds-ease-in-out), height var(--ds-transition-duration-slow) var(--ds-ease-in-out), visibility 0s linear var(--ds-transition-duration-slow);transform:translateY(102%)}.Kvd2vq_bottomPanel[data-dragging]{transition:none}.Kvd2vq_bottomResize{cursor:row-resize;z-index:2;touch-action:none;height:8px;position:absolute;top:-4px;left:0;right:0}.Kvd2vq_bottomResizeActive{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_bottomClose{z-index:4;width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex;position:absolute;top:3px;right:6px}.Kvd2vq_bottomClose:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_bottomPanel .Kvd2vq_tabBar{padding-right:40px}body[data-dsh-title-bar-compat] .Kvd2vq_panel{padding-top:var(--dsh-title-bar-strip,40px)}.Kvd2vq_cornerHandle{left:-6px;bottom:calc(var(--dsh-sidebar-height,0px) + 6px);z-index:2;cursor:nwse-resize;touch-action:none;width:12px;height:12px;position:absolute}.Kvd2vq_cornerHandle:hover,.Kvd2vq_cornerHandle[data-dragging]{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_iconButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.Kvd2vq_iconButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_iconButton:disabled{opacity:.4;cursor:default}.Kvd2vq_workbench,.Kvd2vq_split{flex:1;min-width:0;min-height:0;display:flex}.Kvd2vq_splitRow{flex-direction:row}.Kvd2vq_splitCol{flex-direction:column}.Kvd2vq_splitChild{display:flex;position:relative;overflow:hidden}.Kvd2vq_divider{z-index:3;touch-action:none;flex:none;position:relative}.Kvd2vq_dividerRow:after,.Kvd2vq_dividerCol:after{content:\"\";background:var(--dsw-alias-border-l2);transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out);position:absolute}.Kvd2vq_dividerRow{cursor:col-resize;width:7px;margin:0 -2px}.Kvd2vq_dividerRow:after{width:1px;top:0;bottom:0;left:50%;transform:translate(-50%)}.Kvd2vq_dividerCol{cursor:row-resize;height:7px;margin:-2px 0}.Kvd2vq_dividerCol:after{height:1px;top:50%;left:0;right:0;transform:translateY(-50%)}.Kvd2vq_divider:hover:after,.Kvd2vq_dividerActive:after{background:var(--dsw-alias-interactive-bg-hover-accent)}.Kvd2vq_pane{background:var(--dsw-alias-bg-base);flex-direction:column;flex:1;min-width:0;min-height:0;display:flex;position:relative}.Kvd2vq_paneDrop{outline:1px solid var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-1px}.Kvd2vq_dropOverlay{z-index:6;pointer-events:none;background:var(--dsw-alias-interactive-bg-hover-accent);opacity:.5;position:absolute}.Kvd2vq_dropLeft{width:25%;top:0;bottom:0;left:0}.Kvd2vq_dropRight{width:25%;top:0;bottom:0;right:0}.Kvd2vq_dropUp{height:25%;top:0;left:0;right:0}.Kvd2vq_dropDown{height:25%;bottom:0;left:0;right:0}.Kvd2vq_dropCenter{outline:2px dashed var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-2px;background:0 0;inset:25%}.Kvd2vq_paneContent{flex-direction:column;flex:1;min-height:0;display:flex;overflow:hidden}.Kvd2vq_paneTab{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex}.Kvd2vq_paneTabHidden{display:none}.Kvd2vq_paneEmptyCards{flex-direction:column;flex:1;gap:20px;min-height:0;padding:28px 20px 20px;display:flex;overflow:hidden}.Kvd2vq_paneEmptyHeader{text-align:left;flex-direction:row;flex:none;justify-content:space-between;align-items:flex-start;gap:12px;display:flex}.Kvd2vq_paneEmptyHeaderText{flex-direction:column;gap:4px;min-width:0;display:flex}.Kvd2vq_paneEmptyHeading{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);margin:0;line-height:1.3}.Kvd2vq_paneEmptySubheading{font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-tertiary);margin:0;line-height:1.4}.Kvd2vq_paneLayoutRadio{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:8px;flex:none;align-items:center;gap:2px;padding:2px;display:inline-flex}.Kvd2vq_paneLayoutOption{width:28px;height:28px;color:var(--dsw-alias-label-tertiary);cursor:pointer;transition:background .12s var(--dsh-ease-in-out,ease), color .12s var(--dsh-ease-in-out,ease);background:0 0;border:none;border-radius:6px;justify-content:center;align-items:center;display:inline-flex}.Kvd2vq_paneLayoutOption:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_paneLayoutOptionSelected,.Kvd2vq_paneLayoutOptionSelected:hover{background:var(--dsw-alias-interactive-bg-active);color:var(--dsw-alias-brand-primary)}.Kvd2vq_paneEmptyControls{flex:none;align-items:center;gap:8px;display:inline-flex}.Kvd2vq_paneCardGrid{flex:1;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));align-content:start;gap:12px;min-height:0;display:grid}.Kvd2vq_paneCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);min-width:0;color:var(--dsw-alias-label-secondary);cursor:pointer;text-align:left;transition:background .12s var(--dsh-ease-in-out,ease), border-color .12s var(--dsh-ease-in-out,ease), transform .12s var(--dsh-ease-in-out,ease), box-shadow .12s var(--dsh-ease-in-out,ease);border-radius:10px;flex-direction:row;align-items:flex-start;gap:12px;padding:14px;display:flex}.Kvd2vq_paneCardIcon{background:var(--dsw-alias-interactive-bg-hover-accent);width:36px;height:36px;color:var(--dsw-alias-brand-primary);border-radius:8px;flex:none;justify-content:center;align-items:center;font-size:16px;display:flex}.Kvd2vq_paneCardText{flex-direction:column;gap:2px;min-width:0;display:flex}.Kvd2vq_paneCardLabel{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.Kvd2vq_paneCardDesc{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.4;display:-webkit-box;overflow:hidden}.Kvd2vq_paneCard:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l2);transform:translateY(-1px);box-shadow:0 2px 8px #0000001f}.Kvd2vq_paneCard:hover:not(:disabled) .Kvd2vq_paneCardIcon{background:var(--dsw-alias-interactive-bg-active)}.Kvd2vq_paneCard:active:not(:disabled){box-shadow:none;transform:translateY(0)}.Kvd2vq_paneCard:disabled{opacity:.45;cursor:default}.Kvd2vq_tabBar{border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);flex:none;align-items:stretch;height:34px;display:flex}.Kvd2vq_tabBarDrop{outline:1px dashed var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-1px}.Kvd2vq_tabList{scrollbar-width:none;flex:1;min-width:0;display:flex;overflow-x:auto}.Kvd2vq_tabList::-webkit-scrollbar{display:none}.Kvd2vq_tab{min-width:64px;max-width:160px;font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);border-right:1px solid var(--dsw-alias-border-l1);cursor:pointer;user-select:none;background:0 0;flex:none;align-items:center;gap:4px;padding:0 4px 0 10px;display:flex}.Kvd2vq_tab:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_tabActive{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-active)}.Kvd2vq_tabTitle{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.Kvd2vq_tabBadge{min-width:16px;height:15px;font:var(--dsw-font-xxxs-strong-11);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-brand-primary);border-radius:8px;flex:none;justify-content:center;align-items:center;padding:0 4px;display:inline-flex}.Kvd2vq_tabClose{width:18px;height:18px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:4px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.Kvd2vq_tabClose:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_tabBarPlus{background:var(--dsw-alias-bg-layer-1);width:22px;height:22px;color:var(--dsw-alias-label-tertiary);cursor:pointer;border:none;border-radius:5px;flex:none;justify-content:center;align-self:center;align-items:center;margin:0 6px;padding:0;display:inline-flex;position:sticky;right:0}.Kvd2vq_tabBarPlus:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_explorer{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex}.Kvd2vq_explorerHeader{flex:none;align-items:center;gap:8px;height:36px;padding:0 8px 0 12px;display:flex}.Kvd2vq_explorerHeaderPath{flex:1;align-items:center;gap:2px;min-width:0;display:flex}.Kvd2vq_explorerHeaderActions{flex:none;align-items:center;gap:4px;display:flex}.Kvd2vq_explorerRoot{min-width:0;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-secondary);text-overflow:ellipsis;white-space:nowrap;text-align:left;flex:1;display:block;overflow:hidden}.Kvd2vq_explorerBody{flex:1;min-width:0;min-height:0;padding:2px 6px 8px;overflow:hidden auto}.Kvd2vq_explorerRow{box-sizing:border-box;width:100%;min-width:0;height:34px;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);text-align:left;cursor:pointer;white-space:nowrap;animation:Kvd2vq_dsh-row-in .15s var(--ds-ease-in-out);background:0 0;border:none;border-radius:8px;align-items:center;gap:6px;padding:0 8px;display:flex;overflow:hidden}.Kvd2vq_explorerRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_explorerDir{font:var(--dsw-font-s-strong-14)}.Kvd2vq_explorerRowActive{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_explorerHidden{opacity:.45}.Kvd2vq_explorerSymlink{color:var(--dsw-alias-label-tertiary);flex:none}.Kvd2vq_explorerBroken .Kvd2vq_explorerName{color:var(--dsw-alias-state-error-primary)}.Kvd2vq_explorerName{text-overflow:ellipsis;flex:1;min-width:0;overflow:hidden}.Kvd2vq_explorerRef{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);height:20px;color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;border-radius:999px;flex:none;align-items:center;padding:0 8px;display:none}.Kvd2vq_explorerRef:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_explorerRow:hover .Kvd2vq_explorerRef,.Kvd2vq_explorerRow:focus-within .Kvd2vq_explorerRef{display:inline-flex}.Kvd2vq_explorerPill{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);height:20px;color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;border-radius:999px;flex:none;align-items:center;padding:0 8px;display:inline-flex}.Kvd2vq_explorerPill:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_explorerPill:disabled{opacity:.4;cursor:default}.Kvd2vq_explorerPillActive{background:var(--dsw-alias-interactive-bg-active);color:var(--dsw-alias-brand-primary)}.Kvd2vq_explorerCopied{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);flex:none}.Kvd2vq_explorerError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);cursor:default}@keyframes Kvd2vq_dsh-row-in{0%{opacity:0}}.Kvd2vq_explorerEmpty{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-align:center;padding:16px}.Kvd2vq_searchSummary{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);padding:8px 12px 4px}.Kvd2vq_searchGroup{margin-bottom:4px}.Kvd2vq_searchMatchRow{cursor:pointer;text-align:left;background:0 0;border:none;border-radius:8px;align-items:flex-start;gap:8px;width:100%;min-width:0;min-height:26px;padding:4px 8px 4px 30px;display:flex}.Kvd2vq_searchMatchRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_searchMatchLine{min-width:24px;font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);text-align:right;user-select:none;flex:none;padding-top:1px}.Kvd2vq_searchMatchText{white-space:pre-wrap;overflow-wrap:anywhere;min-width:0;color:var(--dsw-alias-label-secondary);flex:1;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:1.5}.Kvd2vq_searchMatchHighlight{background:color-mix(in srgb, var(--dsw-alias-state-warn-primary) 55%, transparent);color:var(--dsw-alias-label-primary);border-radius:2px}.Kvd2vq_searchModifiers{flex:none;align-items:center;gap:2px;display:flex}.Kvd2vq_searchModifierButton{width:22px;height:22px;color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;background:0 0;border:none;border-radius:5px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.Kvd2vq_searchModifierButton:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_searchModifierUnderline{text-decoration:underline}.Kvd2vq_editor{flex-direction:column;flex:1;min-height:0;display:flex}.Kvd2vq_dirtyDot{background:var(--dsw-alias-state-warn-primary);border-radius:50%;flex:none;width:7px;height:7px}.Kvd2vq_editorPlaceholder{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-align:center;flex:1;justify-content:center;align-items:center;padding:16px;display:flex}.Kvd2vq_orphanedType{opacity:.7;overflow-wrap:anywhere;margin-top:8px;font-size:12px;display:block}.Kvd2vq_editorBinary{text-align:center;flex-direction:column;flex:1;justify-content:center;align-items:center;gap:12px;padding:24px 16px;display:flex}.Kvd2vq_editorBinaryNotice{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_editorDownloadLink{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-strong-12);cursor:pointer;transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out), border-color var(--ds-transition-duration-slow) var(--ds-ease-in-out);border-radius:6px;align-items:center;gap:6px;padding:6px 14px;text-decoration:none;display:inline-flex}.Kvd2vq_editorDownloadLink:hover{background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-border-l2)}.Kvd2vq_editorError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);padding:12px 16px}.Kvd2vq_editorBanner{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex:none;padding:4px 12px}.Kvd2vq_sandboxStatus{font:var(--dsw-font-xxxs-11);flex:none;align-items:center;gap:8px;padding:4px 10px;display:flex}.Kvd2vq_sandboxStatusOn{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border-bottom:1px solid var(--dsw-alias-border-l1)}.Kvd2vq_sandboxStatusOff{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);border-bottom:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 45%, transparent)}.Kvd2vq_sandboxDot{background:var(--dsw-alias-state-success-primary);border-radius:50%;flex:none;width:6px;height:6px}.Kvd2vq_sandboxStatusOff .Kvd2vq_sandboxDot{background:var(--dsw-alias-state-error-primary)}.Kvd2vq_sandboxStatusText{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;overflow:hidden}.Kvd2vq_sandboxAction{border:1px solid var(--dsw-alias-border-l2);font:inherit;color:inherit;cursor:pointer;background:0 0;border-radius:6px;flex:none;padding:2px 8px}.Kvd2vq_sandboxAction:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_editorHtml{background:var(--dsw-alias-bg-base);border:none;flex:1;width:100%;min-height:0}.Kvd2vq_browser{flex-direction:column;flex:1;min-height:0;display:flex}.Kvd2vq_browserBar{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;align-items:center;gap:4px;padding:6px 8px;display:flex}.Kvd2vq_browserInput{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);min-width:0;height:28px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:6px;flex:1;padding:0 10px}.Kvd2vq_browserInput:focus{border-color:var(--dsw-alias-border-l2);outline:none}.Kvd2vq_browserMessage{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex:none;padding:4px 12px}.Kvd2vq_browserFrame{background:var(--dsw-alias-bg-base);border:none;flex:1;width:100%;min-height:0}.Kvd2vq_browserStart{text-align:center;min-height:0;font:var(--dsw-font-xs-13);color:var(--dsw-alias-label-tertiary);flex:1;justify-content:center;align-items:center;padding:20px;display:flex}.Kvd2vq_browserBlocked{text-align:center;min-height:0;color:var(--dsw-alias-state-warn-primary);flex-direction:column;flex:1;justify-content:center;align-items:center;gap:6px;padding:24px;display:flex}.Kvd2vq_browserBlockedTitle{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-primary)}.Kvd2vq_browserBlockedDesc{max-width:280px;font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-secondary)}.Kvd2vq_browserBlockedActions{gap:8px;margin-top:6px;display:flex}.Kvd2vq_browserBlockedButton{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxxs-11);cursor:pointer;border-radius:6px;padding:4px 12px}.Kvd2vq_browserBlockedButton:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_editorCm{background:0 0;flex:1;min-height:0;overflow:hidden}.Kvd2vq_editorCmHidden{display:none}.Kvd2vq_editorCm .cm-editor{height:100%}.Kvd2vq_editorCm .cm-editor.cm-focused{outline:none}.Kvd2vq_editorModeToggle{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:6px;flex:none;align-items:center;gap:2px;padding:2px;display:inline-flex}.Kvd2vq_editorModeButton{color:var(--dsw-alias-label-tertiary);font:var(--dsw-font-xxxs-11);cursor:pointer;background:0 0;border:none;border-radius:4px;padding:2px 8px}.Kvd2vq_editorModeButton:hover{color:var(--dsw-alias-label-primary)}.Kvd2vq_editorModeActive{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}.Kvd2vq_editorImageWrap{flex:1;justify-content:center;align-items:center;min-height:0;padding:12px;display:flex;overflow:auto}.Kvd2vq_editorImage{object-fit:contain;max-width:100%;max-height:100%}.Kvd2vq_editorMd{min-height:0;font:var(--dsw-font-xs-13);flex:1;padding:10px 14px;overflow-y:auto}.Kvd2vq_selectionPopup{z-index:60;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);height:28px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxxs-strong-11);white-space:nowrap;cursor:pointer;border-radius:6px;align-items:center;padding:0 10px;display:inline-flex;position:fixed;transform:translate(-50%,calc(-100% - 8px))}.Kvd2vq_selectionPopup:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_editorPdf{background:var(--dsw-alias-bg-base);flex-direction:column;flex:1;min-height:0;display:flex}.Kvd2vq_editorPdfToolbar{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;justify-content:flex-end;padding:6px 8px;display:flex}.Kvd2vq_editorPdfStage{flex:1;min-height:0;display:flex;position:relative}.Kvd2vq_editorPdfFrame{background:var(--dsw-alias-bg-base);border:none;flex:1;width:100%;min-height:0}.Kvd2vq_editorPdfFrameBlocked{pointer-events:none}.Kvd2vq_editorPdfDragShield{z-index:4;pointer-events:none;background:0 0;position:absolute;inset:0}.Kvd2vq_editorPdfDragShieldActive{pointer-events:auto}body[data-dsh-tab-dragging] .Kvd2vq_editorPdfFrame{pointer-events:none!important}body[data-dsh-tab-dragging] .Kvd2vq_editorPdfDragShield{pointer-events:auto!important}.Kvd2vq_terminalWrap{background:var(--dsw-alias-bg-base);flex-direction:column;flex:1;min-height:0;display:flex;position:relative}.Kvd2vq_terminal{flex:1;min-height:0;padding:6px 4px 6px 8px}.Kvd2vq_terminal .xterm{height:100%}.Kvd2vq_terminalBanner{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex-wrap:wrap;flex:none;align-items:center;gap:8px;padding:3px 10px;display:flex}.Kvd2vq_terminalBannerUrl{word-break:break-all;opacity:.85;flex-basis:100%;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.Kvd2vq_boundaryError{z-index:50;background:var(--dsw-alias-bg-layer-1);border-left:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);flex-direction:column;align-items:flex-start;gap:8px;padding:16px;display:flex;position:fixed;top:0;bottom:0;right:0;overflow:auto}.Kvd2vq_terminalRetry{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxxs-strong-11);cursor:pointer;border-radius:999px;flex:none;padding:1px 8px}.Kvd2vq_terminalRetry:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_terminalDepsBanner{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-warn-label);background:var(--dsw-alias-state-warn-tertiary);flex-direction:column;flex:none;gap:6px;padding:10px;display:flex}.Kvd2vq_terminalDepsTitle{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-state-warn-primary)}.Kvd2vq_terminalDepsHint{opacity:.9}.Kvd2vq_terminalDepsCommandRow{align-items:flex-start;gap:8px;display:flex}.Kvd2vq_terminalRepairCommand{white-space:pre-wrap;word-break:break-all;user-select:text;min-width:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:4px;flex:1;max-height:160px;margin:0;padding:6px 8px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.5;overflow:auto}.Kvd2vq_terminalDepsNote{opacity:.85}.Kvd2vq_terminalDepsActions{align-items:center;gap:8px;display:flex}.Kvd2vq_tabBoundaryError{min-height:0;font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);flex-direction:column;flex:1;align-items:flex-start;gap:8px;padding:12px 16px;display:flex;overflow:auto}.Kvd2vq_git{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex;overflow:hidden auto}.Kvd2vq_gitHeader{flex:none;align-items:center;gap:8px;height:36px;padding:0 8px 0 12px;display:flex}.Kvd2vq_gitBranchSelect{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);min-width:0;height:26px;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:6px;flex:1;padding:0 6px}.Kvd2vq_gitSection{border-top:1px solid var(--dsw-alias-border-l1)}.Kvd2vq_gitSectionHeader{font:var(--dsw-font-xxxs-strong-11);color:var(--dsw-alias-label-tertiary);text-transform:uppercase;justify-content:space-between;align-items:center;padding:6px 12px 4px;display:flex}.Kvd2vq_gitLink{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-brand-primary);cursor:pointer;background:0 0;border:none;padding:0}.Kvd2vq_gitLink:hover:not(:disabled){text-decoration:underline}.Kvd2vq_gitLink:disabled{opacity:.4;cursor:default}.Kvd2vq_gitRow{min-height:34px;animation:Kvd2vq_dsh-row-in .15s var(--ds-ease-in-out);border-radius:8px;align-items:center;gap:6px;margin:0 6px;padding:0 8px;display:flex}.Kvd2vq_gitRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_gitRowSelected{background:var(--dsw-alias-interactive-bg-active)}.Kvd2vq_gitRowMain{cursor:pointer;text-align:left;background:0 0;border:none;flex:1;align-items:center;gap:8px;min-width:0;padding:3px 0;display:flex}.Kvd2vq_gitBadge{width:20px;height:16px;font:var(--dsw-font-xxxs-strong-11);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary);border-radius:4px;flex:none;justify-content:center;align-items:center;display:inline-flex}.Kvd2vq_gitName{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);flex:1;overflow:hidden}.Kvd2vq_gitEmpty{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);padding:4px 12px 8px}.Kvd2vq_gitPlaceholder{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);text-align:center;padding:16px}.Kvd2vq_gitError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-state-error-primary);white-space:pre-wrap;padding:8px 12px}.Kvd2vq_gitDiff{border-top:1px solid var(--dsw-alias-border-l1);padding:8px}.Kvd2vq_gitDiffTab{flex-direction:column;flex:1;min-width:0;min-height:0;display:flex;overflow:hidden auto}.Kvd2vq_gitDiffTabHeader{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;align-items:center;gap:8px;height:36px;padding:0 8px 0 12px;display:flex}.Kvd2vq_gitDiffTabTitle{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-primary);flex:1;overflow:hidden}.Kvd2vq_gitDiffFile{align-items:baseline;gap:6px;padding:8px 2px 2px;display:flex}.Kvd2vq_gitDiffFilePath{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-primary);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Kvd2vq_gitDiffFileOld{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;flex:none;max-width:40%;overflow:hidden}.Kvd2vq_gitDiffFileTag{border:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-xxxs-strong-11);color:var(--dsw-alias-label-secondary);border-radius:999px;flex:none;padding:0 6px}.Kvd2vq_gitDiffHunk{font:var(--dsw-font-markdown-code-block-small);color:var(--dsw-alias-label-tertiary);gap:8px;padding:3px 2px;display:flex}.Kvd2vq_gitDiffHunkHeader{color:var(--dsw-alias-label-secondary);flex:none}.Kvd2vq_gitDiffHunkSection{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Kvd2vq_gitDiffLine{font:var(--dsw-font-markdown-code-block-small);white-space:pre-wrap;overflow-wrap:anywhere;align-items:stretch;min-width:0;line-height:20px;display:flex}.Kvd2vq_gitDiffNum{text-align:right;width:36px;color:var(--dsw-alias-label-tertiary);user-select:none;flex:none;padding-right:8px}.Kvd2vq_gitDiffCode{flex:1;min-width:0;overflow:visible}.Kvd2vq_gitDiffCtx{color:var(--dsw-alias-label-primary)}.Kvd2vq_gitDiffDel{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent)}.Kvd2vq_gitDiffAdd{color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 12%, transparent)}.Kvd2vq_gitDiffMeta{padding-left:2px}.Kvd2vq_gitDiffMetaText{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary);font-style:italic}.Kvd2vq_gitDiffExpand{width:100%;font:var(--dsw-font-xxs-12);color:var(--dsw-alias-brand-primary);cursor:pointer;text-align:center;background:0 0;border:none;margin:4px 0;display:block}.Kvd2vq_gitDiffExpand:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_gitConfirmDesc{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);white-space:pre-wrap;margin:0}.Kvd2vq_gitCommit{border-top:1px solid var(--dsw-alias-border-l1);align-items:center;gap:6px;padding:8px 12px;display:flex}.Kvd2vq_gitCommitInput{flex:1;min-width:0}.Kvd2vq_gitCommitButton{background:var(--dsw-alias-button-primary-fill);height:26px;color:var(--dsw-alias-label-primary-inverted);font:var(--dsw-font-xxs-strong-12);cursor:pointer;border:none;border-radius:6px;flex:none;padding:0 12px}.Kvd2vq_gitCommitButton:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}.Kvd2vq_gitCommitButton:disabled{opacity:.45;cursor:default}.Kvd2vq_gitLogRow{cursor:pointer;border-radius:8px;flex-direction:column;gap:2px;padding:5px 12px;display:flex}.Kvd2vq_gitLogRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_gitLogLine1{align-items:baseline;gap:8px;min-width:0;display:flex}.Kvd2vq_gitLogHash{font:var(--dsw-font-markdown-code-block-small);color:var(--dsw-alias-label-tertiary);flex:none}.Kvd2vq_gitLogLine2{flex-wrap:wrap;align-items:center;gap:6px;min-width:0;display:flex}.Kvd2vq_gitLogRef{border:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-xxxs-strong-11);color:var(--dsw-alias-brand-primary);white-space:nowrap;border-radius:999px;flex:none;padding:0 5px}.Kvd2vq_gitLogSubject{text-overflow:ellipsis;white-space:nowrap;min-width:0;font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);flex:1;overflow:hidden}.Kvd2vq_gitLogMeta{font:var(--dsw-font-xxxs-11);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_gitLogMore{border:1px solid var(--dsw-alias-border-l2);width:calc(100% - 24px);font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border-radius:6px;margin:4px 12px 8px;padding:6px 0;display:block}.Kvd2vq_gitLogMore:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_gitLogMore:disabled{opacity:.5;cursor:default}.Kvd2vq_producedRow{flex-wrap:wrap;align-items:center;gap:8px;padding:4px 0;display:flex}.Kvd2vq_producedLabel{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_producedChip{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);max-width:200px;color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxs-12);cursor:pointer;border-radius:999px;align-items:center;gap:4px;padding:2px 8px;display:inline-flex;overflow:hidden}.Kvd2vq_producedChip:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Kvd2vq_producedChip span{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.Kvd2vq_producedMore{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_toggleButton:focus-visible,.Kvd2vq_bottomClose:focus-visible,.Kvd2vq_iconButton:focus-visible,.Kvd2vq_tab:focus-visible,.Kvd2vq_tabClose:focus-visible,.Kvd2vq_tabBarPlus:focus-visible,.Kvd2vq_paneCard:focus-visible,.Kvd2vq_paneLayoutOption:focus-visible,.Kvd2vq_explorerRow:focus-visible,.Kvd2vq_explorerRef:focus-visible,.Kvd2vq_gitRowMain:focus-visible,.Kvd2vq_gitLink:focus-visible,.Kvd2vq_gitCommitButton:focus-visible,.Kvd2vq_gitLogRow:focus-visible,.Kvd2vq_gitLogMore:focus-visible,.Kvd2vq_gitDiffExpand:focus-visible,.Kvd2vq_terminalRetry:focus-visible,.Kvd2vq_editorModeButton:focus-visible,.Kvd2vq_editorDownloadLink:focus-visible,.Kvd2vq_editorPptxButton:focus-visible,.Kvd2vq_editorDocxZoomRange:focus-visible{outline:2px solid var(--dsw-alias-interactive-bg-hover-accent);outline-offset:-1px}@media (prefers-reduced-motion:reduce){.Kvd2vq_panel,.Kvd2vq_panelHidden,.Kvd2vq_bottomPanel,.Kvd2vq_bottomPanelHidden,.Kvd2vq_toggleCluster,.Kvd2vq_toggleButton,.Kvd2vq_tab,.Kvd2vq_tabBarPlus,.Kvd2vq_paneCard,.Kvd2vq_explorerRow,.Kvd2vq_gitRow,.Kvd2vq_divider,.Kvd2vq_dividerRow:after,.Kvd2vq_dividerCol:after{transition:none;animation:none}}@media (width<=767px){.Kvd2vq_panel:not(.Kvd2vq_panelHidden) .Kvd2vq_tabBar{padding-right:40px}.Kvd2vq_tab{min-width:48px;max-width:128px}}.Kvd2vq_settingsIntro{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-secondary);margin:0 0 12px}.Kvd2vq_settingsGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;display:grid}.Kvd2vq_settingsCard{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);cursor:pointer;text-align:left;transition:background var(--ds-transition-duration-slow) var(--ds-ease-in-out);border-radius:12px;flex-direction:column;gap:8px;padding:14px;display:flex;position:relative}.Kvd2vq_settingsCard:hover{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_settingsCardIcon{background:var(--dsw-alias-bg-layer-2);width:32px;height:32px;color:var(--dsw-alias-label-primary);border-radius:9px;justify-content:center;align-items:center;display:flex}.Kvd2vq_settingsCardTitle{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary)}.Kvd2vq_settingsCardSubtitle{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary)}.Kvd2vq_settingsCardToggle{border:1px solid var(--dsw-alias-border-l2);color:#0000;cursor:pointer;background:0 0;border-radius:50%;justify-content:center;align-items:center;width:22px;height:22px;display:flex;position:absolute;top:12px;right:12px}.Kvd2vq_settingsCardToggleOn{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-base);border-color:#0000}.Kvd2vq_settingsHint{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);margin:12px 0 0}.Kvd2vq_settingsMissing{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border-radius:10px;margin:0;padding:12px}.Kvd2vq_notesRoot{flex:1;min-height:0;display:flex}.Kvd2vq_notesTree{flex-direction:column;flex:none;min-width:0;display:flex;overflow:hidden}.Kvd2vq_notesEditor{flex-direction:column;flex:1;min-width:0;display:flex}.Kvd2vq_notesBindPrompt{text-align:center;flex-direction:column;flex:1;justify-content:center;align-items:center;gap:10px;padding:24px;display:flex}.Kvd2vq_folderPickerPath{border-bottom:1px solid var(--dsw-alias-border-l1);align-items:center;gap:8px;margin-bottom:4px;padding-bottom:10px;display:flex}.Kvd2vq_folderPickerList{height:320px;overflow:hidden auto}.Kvd2vq_folderPickerFooter{justify-content:flex-end;gap:8px;display:flex}.Kvd2vq_extSection{border-top:1px solid var(--dsw-alias-border-l1);margin-top:20px;padding-top:16px}.Kvd2vq_extHeading{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);margin:0 0 8px}.Kvd2vq_extWarning{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:10px;margin:0 0 12px;padding:10px 12px}.Kvd2vq_extActions{gap:8px;margin-bottom:12px;display:flex}.Kvd2vq_extActions button,.Kvd2vq_extPromptActions button{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);cursor:pointer;border-radius:8px;padding:6px 12px}.Kvd2vq_extActions button:disabled,.Kvd2vq_extPromptActions button:disabled{opacity:.5;cursor:default}.Kvd2vq_extPromptPrimary{background:var(--dsw-alias-label-primary)!important;color:var(--dsw-alias-bg-base)!important;border-color:#0000!important}.Kvd2vq_extList{flex-direction:column;gap:8px;display:flex}.Kvd2vq_extRow{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:10px;align-items:flex-start;gap:10px;padding:10px 12px;display:flex}.Kvd2vq_extRowIcon{background:var(--dsw-alias-bg-layer-2);border-radius:8px;flex:none;justify-content:center;align-items:center;width:28px;height:28px;font-size:15px;line-height:1;display:flex}.Kvd2vq_extRowBody{flex-direction:column;flex:auto;gap:2px;min-width:0;display:flex}.Kvd2vq_extRowTitle{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary)}.Kvd2vq_extRowMeta{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere}.Kvd2vq_extRowPath{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);opacity:.75;overflow-wrap:anywhere}.Kvd2vq_extRowRemove{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);font:var(--dsw-font-xxs-12);cursor:pointer;background:0 0;border-radius:8px;flex:none;align-self:center;padding:5px 10px}.Kvd2vq_extRowRemove:disabled{opacity:.5;cursor:default}.Kvd2vq_extEmpty{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);margin:0}.Kvd2vq_extError{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);overflow-wrap:anywhere;border-radius:10px;margin:12px 0 0;padding:10px 12px}.Kvd2vq_extPrompt{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:10px;flex-direction:column;gap:8px;margin-bottom:12px;padding:12px;display:flex}.Kvd2vq_extPromptHint{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);margin:0}.Kvd2vq_extPromptFile{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere;margin:0}.Kvd2vq_extPromptField{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);flex-direction:column;gap:4px;display:flex}.Kvd2vq_extPromptField input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:8px;padding:6px 10px}.Kvd2vq_extPromptActions{justify-content:flex-end;gap:8px;display:flex}.Kvd2vq_appearanceSection{border-top:1px solid var(--dsw-alias-border-l1);margin-top:20px;padding-top:16px}.Kvd2vq_appearanceHeading{font:var(--dsw-font-s-strong-14);color:var(--dsw-alias-label-primary);margin:0 0 8px}.Kvd2vq_appearanceGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:12px;display:grid}.Kvd2vq_appearanceFieldFull{grid-column:1/-1}.Kvd2vq_appearanceField{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary);flex-direction:column;gap:4px;display:flex}.Kvd2vq_appearanceFieldLabel{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-secondary)}.Kvd2vq_appearanceControl{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:var(--dsw-font-s-14);box-sizing:border-box;border-radius:8px;width:100%;padding:6px 10px}.Kvd2vq_appearanceControl:focus{border-color:var(--dsw-alias-border-l3,var(--dsw-alias-border-l2));outline:none}.Kvd2vq_appearanceSelectTrigger{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:var(--dsw-font-s-14);box-sizing:border-box;cursor:pointer;text-align:left;border-radius:8px;justify-content:space-between;align-items:center;gap:8px;width:100%;padding:6px 10px;display:flex}.Kvd2vq_appearanceSelectTrigger:hover{border-color:var(--dsw-alias-border-l3,var(--dsw-alias-border-l2))}.Kvd2vq_appearanceSelectTrigger:focus-visible{border-color:var(--dsw-alias-border-l3,var(--dsw-alias-border-l2));box-shadow:0 0 0 2px var(--dsw-alias-interactive-bg-active,transparent);outline:none}.Kvd2vq_appearanceSelectTrigger[data-placeholder]{color:var(--dsw-alias-label-tertiary)}.Kvd2vq_appearanceSelectTrigger:disabled{opacity:.6;cursor:default}.Kvd2vq_appearanceSelectCaret{color:var(--dsw-alias-label-tertiary);flex-shrink:0;align-items:center;display:inline-flex}.Kvd2vq_appearanceSelectContent{min-width:var(--radix-select-trigger-width);max-height:var(--radix-select-content-available-height,280px);border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-elevated,var(--dsw-alias-bg-base));z-index:1000;border-radius:8px;overflow:hidden;box-shadow:0 6px 24px #0000002e}.Kvd2vq_appearanceSelectViewport{padding:4px}.Kvd2vq_appearanceSelectItem{font:var(--dsw-font-s-14);color:var(--dsw-alias-label-primary);cursor:pointer;user-select:none;border-radius:6px;outline:none;align-items:center;gap:6px;padding:6px 8px;display:flex}.Kvd2vq_appearanceSelectItem[data-highlighted]{background:var(--dsw-alias-interactive-bg-hover)}.Kvd2vq_appearanceSelectItem[data-disabled]{opacity:.5;cursor:default}.Kvd2vq_appearanceSelectIndicator{color:var(--dsw-alias-label-primary);flex-shrink:0;align-items:center;display:inline-flex}.Kvd2vq_appearanceInlineToggle{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);cursor:pointer;text-underline-offset:2px;background:0 0;border:none;align-self:flex-start;margin-top:2px;padding:0;text-decoration:underline}.Kvd2vq_appearanceInlineToggle:hover{color:var(--dsw-alias-label-secondary)}.Kvd2vq_appearanceHint{font:var(--dsw-font-xxs-12);color:var(--dsw-alias-label-tertiary);margin:8px 0 0}.Kvd2vq_calendarContainer{height:100%}.Kvd2vq_calendarContainer .fc{height:100%;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);--fc-border-color:var(--dsw-alias-border-l2);--fc-page-bg-color:transparent;--fc-neutral-bg-color:var(--dsw-alias-bg-layer-2);--fc-list-event-hover-bg-color:var(--dsw-alias-interactive-bg-hover);--fc-today-bg-color:var(--dsw-alias-interactive-bg-hover-accent);--fc-now-indicator-color:var(--dsw-alias-state-error-primary);--fc-event-bg-color:var(--dsw-alias-brand-primary);--fc-event-border-color:var(--dsw-alias-brand-primary);--fc-event-text-color:var(--dsw-alias-label-primary-inverted);--fc-button-text-color:var(--dsw-alias-label-secondary);--fc-button-bg-color:var(--dsw-alias-bg-layer-2);--fc-button-border-color:var(--dsw-alias-border-l2);--fc-button-hover-bg-color:var(--dsw-alias-interactive-bg-hover);--fc-button-hover-border-color:var(--dsw-alias-border-l2);--fc-button-active-bg-color:var(--dsw-alias-interactive-bg-active);--fc-button-active-border-color:var(--dsw-alias-border-l2)}.Kvd2vq_calendarContainer .fc .fc-toolbar-title{font:var(--dsw-font-xxs-strong-12)}.Kvd2vq_calendarContainer .fc .fc-button{text-transform:capitalize;box-shadow:none}.Kvd2vq_calendarEventForm{flex-direction:column;gap:12px;display:flex}.Kvd2vq_calendarEventRow{gap:12px;display:flex}.Kvd2vq_calendarEventRow .Kvd2vq_calendarEventField{flex:1;min-width:0}.Kvd2vq_calendarEventField{flex-direction:column;gap:4px;display:flex}.Kvd2vq_calendarEventLabel{font:var(--dsw-font-xxs-strong-12);color:var(--dsw-alias-label-secondary)}.Kvd2vq_calendarEventDateInput,.Kvd2vq_calendarEventTextarea{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);width:100%;color:var(--dsw-alias-label-primary);font:var(--dsw-font-xxs-12);border-radius:8px;padding:6px 10px}.Kvd2vq_calendarEventTextarea{resize:vertical;font-family:inherit}.Kvd2vq_calendarEventDateInput:focus,.Kvd2vq_calendarEventTextarea:focus{border-color:var(--dsw-alias-brand-primary);outline:none}";
	const tagId = "dsh-powerdesk/sidebar.module.css";
	if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
		const tag = document.createElement("style");
		tag.dataset.plugin = "dsh-powerdesk";
		tag.dataset.pluginCss = tagId;
		tag.textContent = css;
		document.head.appendChild(tag);
	}
	var sidebar_module_css_default = {
		"editorError": "Kvd2vq_editorError",
		"cornerHandle": "Kvd2vq_cornerHandle",
		"tabBarDrop": "Kvd2vq_tabBarDrop",
		"gitDiffHunk": "Kvd2vq_gitDiffHunk",
		"extRowTitle": "Kvd2vq_extRowTitle",
		"appearanceControl": "Kvd2vq_appearanceControl",
		"settingsMissing": "Kvd2vq_settingsMissing",
		"extRowRemove": "Kvd2vq_extRowRemove",
		"explorerRef": "Kvd2vq_explorerRef",
		"browserFrame": "Kvd2vq_browserFrame",
		"searchModifiers": "Kvd2vq_searchModifiers",
		"gitLogMore": "Kvd2vq_gitLogMore",
		"explorerSymlink": "Kvd2vq_explorerSymlink",
		"gitDiffFilePath": "Kvd2vq_gitDiffFilePath",
		"pane": "Kvd2vq_pane",
		"gitDiffAdd": "Kvd2vq_gitDiffAdd",
		"editorPdfToolbar": "Kvd2vq_editorPdfToolbar",
		"gitDiffFileTag": "Kvd2vq_gitDiffFileTag",
		"gitDiffFileOld": "Kvd2vq_gitDiffFileOld",
		"appearanceGrid": "Kvd2vq_appearanceGrid",
		"extRowMeta": "Kvd2vq_extRowMeta",
		"settingsCardSubtitle": "Kvd2vq_settingsCardSubtitle",
		"calendarEventLabel": "Kvd2vq_calendarEventLabel",
		"calendarEventDateInput": "Kvd2vq_calendarEventDateInput",
		"tab": "Kvd2vq_tab",
		"appearanceField": "Kvd2vq_appearanceField",
		"iconButton": "Kvd2vq_iconButton",
		"gitLogLine2": "Kvd2vq_gitLogLine2",
		"explorerBody": "Kvd2vq_explorerBody",
		"extHeading": "Kvd2vq_extHeading",
		"gitDiffTab": "Kvd2vq_gitDiffTab",
		"split": "Kvd2vq_split",
		"notesBindPrompt": "Kvd2vq_notesBindPrompt",
		"explorerBroken": "Kvd2vq_explorerBroken",
		"editorPdfDragShield": "Kvd2vq_editorPdfDragShield",
		"paneCardLabel": "Kvd2vq_paneCardLabel",
		"editorPdfDragShieldActive": "Kvd2vq_editorPdfDragShieldActive",
		"gitPlaceholder": "Kvd2vq_gitPlaceholder",
		"appearanceInlineToggle": "Kvd2vq_appearanceInlineToggle",
		"folderPickerPath": "Kvd2vq_folderPickerPath",
		"gitBranchSelect": "Kvd2vq_gitBranchSelect",
		"explorerRow": "Kvd2vq_explorerRow",
		"gitDiffTabTitle": "Kvd2vq_gitDiffTabTitle",
		"terminalRetry": "Kvd2vq_terminalRetry",
		"sandboxStatusText": "Kvd2vq_sandboxStatusText",
		"gitLogMeta": "Kvd2vq_gitLogMeta",
		"extPromptHint": "Kvd2vq_extPromptHint",
		"calendarEventTextarea": "Kvd2vq_calendarEventTextarea",
		"extPromptActions": "Kvd2vq_extPromptActions",
		"explorer": "Kvd2vq_explorer",
		"terminalDepsCommandRow": "Kvd2vq_terminalDepsCommandRow",
		"editorModeToggle": "Kvd2vq_editorModeToggle",
		"browserBlockedButton": "Kvd2vq_browserBlockedButton",
		"workbench": "Kvd2vq_workbench",
		"explorerPill": "Kvd2vq_explorerPill",
		"panelResizeActive": "Kvd2vq_panelResizeActive",
		"tabActive": "Kvd2vq_tabActive",
		"splitCol": "Kvd2vq_splitCol",
		"gitDiffMetaText": "Kvd2vq_gitDiffMetaText",
		"extWarning": "Kvd2vq_extWarning",
		"sandboxDot": "Kvd2vq_sandboxDot",
		"extSection": "Kvd2vq_extSection",
		"gitDiffFile": "Kvd2vq_gitDiffFile",
		"settingsCardIcon": "Kvd2vq_settingsCardIcon",
		"paneEmptyControls": "Kvd2vq_paneEmptyControls",
		"tabClose": "Kvd2vq_tabClose",
		"gitError": "Kvd2vq_gitError",
		"panel": "Kvd2vq_panel",
		"explorerHeaderPath": "Kvd2vq_explorerHeaderPath",
		"searchGroup": "Kvd2vq_searchGroup",
		"gitLink": "Kvd2vq_gitLink",
		"orphanedType": "Kvd2vq_orphanedType",
		"editorModeActive": "Kvd2vq_editorModeActive",
		"gitHeader": "Kvd2vq_gitHeader",
		"appearanceHeading": "Kvd2vq_appearanceHeading",
		"appearanceFieldFull": "Kvd2vq_appearanceFieldFull",
		"editorHtml": "Kvd2vq_editorHtml",
		"appearanceSelectCaret": "Kvd2vq_appearanceSelectCaret",
		"appearanceSelectItem": "Kvd2vq_appearanceSelectItem",
		"gitDiff": "Kvd2vq_gitDiff",
		"dropLeft": "Kvd2vq_dropLeft",
		"extPromptFile": "Kvd2vq_extPromptFile",
		"editorModeButton": "Kvd2vq_editorModeButton",
		"terminalRepairCommand": "Kvd2vq_terminalRepairCommand",
		"tabBoundaryError": "Kvd2vq_tabBoundaryError",
		"explorerHidden": "Kvd2vq_explorerHidden",
		"editorCmHidden": "Kvd2vq_editorCmHidden",
		"gitDiffExpand": "Kvd2vq_gitDiffExpand",
		"gitDiffDel": "Kvd2vq_gitDiffDel",
		"notesEditor": "Kvd2vq_notesEditor",
		"explorerError": "Kvd2vq_explorerError",
		"gitCommitButton": "Kvd2vq_gitCommitButton",
		"paneContent": "Kvd2vq_paneContent",
		"explorerHeader": "Kvd2vq_explorerHeader",
		"explorerHeaderActions": "Kvd2vq_explorerHeaderActions",
		"paneDrop": "Kvd2vq_paneDrop",
		"gitCommit": "Kvd2vq_gitCommit",
		"editorBanner": "Kvd2vq_editorBanner",
		"paneEmptyHeaderText": "Kvd2vq_paneEmptyHeaderText",
		"searchSummary": "Kvd2vq_searchSummary",
		"boundaryError": "Kvd2vq_boundaryError",
		"paneCardText": "Kvd2vq_paneCardText",
		"browser": "Kvd2vq_browser",
		"editorBinary": "Kvd2vq_editorBinary",
		"editorPdfStage": "Kvd2vq_editorPdfStage",
		"settingsCard": "Kvd2vq_settingsCard",
		"extPromptPrimary": "Kvd2vq_extPromptPrimary",
		"extRowPath": "Kvd2vq_extRowPath",
		"extRowIcon": "Kvd2vq_extRowIcon",
		"editorDocxZoomRange": "Kvd2vq_editorDocxZoomRange",
		"gitEmpty": "Kvd2vq_gitEmpty",
		"dirtyDot": "Kvd2vq_dirtyDot",
		"explorerRoot": "Kvd2vq_explorerRoot",
		"extRow": "Kvd2vq_extRow",
		"explorerRowActive": "Kvd2vq_explorerRowActive",
		"explorerPillActive": "Kvd2vq_explorerPillActive",
		"terminalDepsBanner": "Kvd2vq_terminalDepsBanner",
		"paneCardGrid": "Kvd2vq_paneCardGrid",
		"selectionPopup": "Kvd2vq_selectionPopup",
		"bottomPanel": "Kvd2vq_bottomPanel",
		"settingsCardToggleOn": "Kvd2vq_settingsCardToggleOn",
		"paneLayoutOption": "Kvd2vq_paneLayoutOption",
		"git": "Kvd2vq_git",
		"paneTab": "Kvd2vq_paneTab",
		"gitDiffHunkHeader": "Kvd2vq_gitDiffHunkHeader",
		"editorPdfFrameBlocked": "Kvd2vq_editorPdfFrameBlocked",
		"producedRow": "Kvd2vq_producedRow",
		"gitRowMain": "Kvd2vq_gitRowMain",
		"searchMatchRow": "Kvd2vq_searchMatchRow",
		"gitDiffHunkSection": "Kvd2vq_gitDiffHunkSection",
		"sandboxAction": "Kvd2vq_sandboxAction",
		"dividerActive": "Kvd2vq_dividerActive",
		"appearanceHint": "Kvd2vq_appearanceHint",
		"divider": "Kvd2vq_divider",
		"gitLogHash": "Kvd2vq_gitLogHash",
		"dropOverlay": "Kvd2vq_dropOverlay",
		"gitRowSelected": "Kvd2vq_gitRowSelected",
		"producedMore": "Kvd2vq_producedMore",
		"explorerName": "Kvd2vq_explorerName",
		"explorerEmpty": "Kvd2vq_explorerEmpty",
		"editorPdf": "Kvd2vq_editorPdf",
		"editorImage": "Kvd2vq_editorImage",
		"paneEmptySubheading": "Kvd2vq_paneEmptySubheading",
		"sandboxStatusOn": "Kvd2vq_sandboxStatusOn",
		"terminalWrap": "Kvd2vq_terminalWrap",
		"gitCommitInput": "Kvd2vq_gitCommitInput",
		"editorDownloadLink": "Kvd2vq_editorDownloadLink",
		"browserBlockedDesc": "Kvd2vq_browserBlockedDesc",
		"terminalBannerUrl": "Kvd2vq_terminalBannerUrl",
		"paneTabHidden": "Kvd2vq_paneTabHidden",
		"gitLogSubject": "Kvd2vq_gitLogSubject",
		"paneEmptyCards": "Kvd2vq_paneEmptyCards",
		"paneLayoutOptionSelected": "Kvd2vq_paneLayoutOptionSelected",
		"gitDiffTabHeader": "Kvd2vq_gitDiffTabHeader",
		"tabTitle": "Kvd2vq_tabTitle",
		"extEmpty": "Kvd2vq_extEmpty",
		"editor": "Kvd2vq_editor",
		"editorCm": "Kvd2vq_editorCm",
		"tabBar": "Kvd2vq_tabBar",
		"panelBody": "Kvd2vq_panelBody",
		"splitChild": "Kvd2vq_splitChild",
		"paneCardDesc": "Kvd2vq_paneCardDesc",
		"settingsIntro": "Kvd2vq_settingsIntro",
		"bottomClose": "Kvd2vq_bottomClose",
		"browserBar": "Kvd2vq_browserBar",
		"calendarContainer": "Kvd2vq_calendarContainer",
		"browserStart": "Kvd2vq_browserStart",
		"extPromptField": "Kvd2vq_extPromptField",
		"dropDown": "Kvd2vq_dropDown",
		"editorPdfFrame": "Kvd2vq_editorPdfFrame",
		"gitDiffLine": "Kvd2vq_gitDiffLine",
		"splitRow": "Kvd2vq_splitRow",
		"producedChip": "Kvd2vq_producedChip",
		"searchModifierUnderline": "Kvd2vq_searchModifierUnderline",
		"gitDiffCode": "Kvd2vq_gitDiffCode",
		"appearanceSelectIndicator": "Kvd2vq_appearanceSelectIndicator",
		"folderPickerFooter": "Kvd2vq_folderPickerFooter",
		"searchMatchLine": "Kvd2vq_searchMatchLine",
		"gitDiffMeta": "Kvd2vq_gitDiffMeta",
		"appearanceSection": "Kvd2vq_appearanceSection",
		"browserMessage": "Kvd2vq_browserMessage",
		"dsh-row-in": "Kvd2vq_dsh-row-in",
		"terminal": "Kvd2vq_terminal",
		"gitLogLine1": "Kvd2vq_gitLogLine1",
		"searchMatchHighlight": "Kvd2vq_searchMatchHighlight",
		"notesTree": "Kvd2vq_notesTree",
		"tabList": "Kvd2vq_tabList",
		"toggleButton": "Kvd2vq_toggleButton",
		"tabBarPlus": "Kvd2vq_tabBarPlus",
		"searchMatchText": "Kvd2vq_searchMatchText",
		"browserBlocked": "Kvd2vq_browserBlocked",
		"editorPlaceholder": "Kvd2vq_editorPlaceholder",
		"settingsGrid": "Kvd2vq_settingsGrid",
		"sandboxStatusOff": "Kvd2vq_sandboxStatusOff",
		"bottomResizeActive": "Kvd2vq_bottomResizeActive",
		"settingsHint": "Kvd2vq_settingsHint",
		"extPrompt": "Kvd2vq_extPrompt",
		"calendarEventForm": "Kvd2vq_calendarEventForm",
		"gitSectionHeader": "Kvd2vq_gitSectionHeader",
		"calendarEventRow": "Kvd2vq_calendarEventRow",
		"folderPickerList": "Kvd2vq_folderPickerList",
		"extList": "Kvd2vq_extList",
		"terminalBanner": "Kvd2vq_terminalBanner",
		"settingsCardToggle": "Kvd2vq_settingsCardToggle",
		"paneLayoutRadio": "Kvd2vq_paneLayoutRadio",
		"gitDiffCtx": "Kvd2vq_gitDiffCtx",
		"editorBinaryNotice": "Kvd2vq_editorBinaryNotice",
		"appearanceFieldLabel": "Kvd2vq_appearanceFieldLabel",
		"gitRow": "Kvd2vq_gitRow",
		"settingsCardTitle": "Kvd2vq_settingsCardTitle",
		"editorMd": "Kvd2vq_editorMd",
		"explorerCopied": "Kvd2vq_explorerCopied",
		"dropRight": "Kvd2vq_dropRight",
		"dropUp": "Kvd2vq_dropUp",
		"extActions": "Kvd2vq_extActions",
		"extRowBody": "Kvd2vq_extRowBody",
		"gitLogRow": "Kvd2vq_gitLogRow",
		"searchModifierButton": "Kvd2vq_searchModifierButton",
		"bottomPanelHidden": "Kvd2vq_bottomPanelHidden",
		"paneCardIcon": "Kvd2vq_paneCardIcon",
		"gitDiffNum": "Kvd2vq_gitDiffNum",
		"gitConfirmDesc": "Kvd2vq_gitConfirmDesc",
		"bottomResize": "Kvd2vq_bottomResize",
		"paneCard": "Kvd2vq_paneCard",
		"appearanceSelectTrigger": "Kvd2vq_appearanceSelectTrigger",
		"terminalDepsHint": "Kvd2vq_terminalDepsHint",
		"gitLogRef": "Kvd2vq_gitLogRef",
		"appearanceSelectContent": "Kvd2vq_appearanceSelectContent",
		"appearanceSelectViewport": "Kvd2vq_appearanceSelectViewport",
		"editorPptxButton": "Kvd2vq_editorPptxButton",
		"explorerDir": "Kvd2vq_explorerDir",
		"editorImageWrap": "Kvd2vq_editorImageWrap",
		"notesRoot": "Kvd2vq_notesRoot",
		"toggleCluster": "Kvd2vq_toggleCluster",
		"dropCenter": "Kvd2vq_dropCenter",
		"terminalDepsTitle": "Kvd2vq_terminalDepsTitle",
		"browserBlockedTitle": "Kvd2vq_browserBlockedTitle",
		"sandboxStatus": "Kvd2vq_sandboxStatus",
		"browserBlockedActions": "Kvd2vq_browserBlockedActions",
		"producedLabel": "Kvd2vq_producedLabel",
		"dividerRow": "Kvd2vq_dividerRow",
		"terminalDepsActions": "Kvd2vq_terminalDepsActions",
		"dividerCol": "Kvd2vq_dividerCol",
		"gitSection": "Kvd2vq_gitSection",
		"paneEmptyHeading": "Kvd2vq_paneEmptyHeading",
		"calendarEventField": "Kvd2vq_calendarEventField",
		"panelHidden": "Kvd2vq_panelHidden",
		"extError": "Kvd2vq_extError",
		"gitName": "Kvd2vq_gitName",
		"browserInput": "Kvd2vq_browserInput",
		"panelResize": "Kvd2vq_panelResize",
		"terminalDepsNote": "Kvd2vq_terminalDepsNote",
		"paneEmptyHeader": "Kvd2vq_paneEmptyHeader",
		"gitBadge": "Kvd2vq_gitBadge",
		"tabBadge": "Kvd2vq_tabBadge"
	};
	//#endregion
	//#region src/client/CalendarEventModal.tsx
	/**
	* The "create event" modal for the Calendar tab: replaces a bare
	* `window.prompt()` (title-only, no location/description, and start/end
	* times fixed to wherever the drag landed with no way to fine-tune them)
	* with a real form. Opened by CalendarView after a drag-to-create selection;
	* closing without submitting leaves nothing behind (the calendar's
	* `unselect()` already clears the drag highlight independently of this
	* modal's own open/close state).
	*/
	/** Pad a number to 2 digits (for building `datetime-local` input values). */
	function pad2$1(n) {
		return n < 10 ? `0${n}` : String(n);
	}
	/** A `Date` to the value a `<input type="datetime-local">` expects
	*  ('yyyy-MM-ddTHH:mm', local wall-clock — matches what the input gives
	*  back, so no timezone math is needed on either side of this round trip). */
	function toLocalInputValue(d) {
		return `${d.getFullYear()}-${pad2$1(d.getMonth() + 1)}-${pad2$1(d.getDate())}T${pad2$1(d.getHours())}:${pad2$1(d.getMinutes())}`;
	}
	function CalendarEventModal(props) {
		const { open, initialStart, initialEnd, onCreate, onClose } = props;
		const [title, setTitle] = (0, react.useState)("");
		const [location, setLocation] = (0, react.useState)("");
		const [description, setDescription] = (0, react.useState)("");
		const [startValue, setStartValue] = (0, react.useState)("");
		const [endValue, setEndValue] = (0, react.useState)("");
		(0, react.useEffect)(() => {
			if (!open) return;
			setTitle("");
			setLocation("");
			setDescription("");
			setStartValue(initialStart !== null ? toLocalInputValue(initialStart) : "");
			setEndValue(initialEnd !== null ? toLocalInputValue(initialEnd) : "");
		}, [
			open,
			initialStart,
			initialEnd
		]);
		function handleCreate() {
			if (startValue === "" || endValue === "") return;
			const start = new Date(startValue);
			const end = new Date(endValue);
			if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;
			onCreate({
				title: title.trim() === "" ? t("calendarUntitledEvent") : title.trim(),
				start,
				end,
				location: location.trim(),
				description: description.trim()
			});
		}
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
			open,
			onClose,
			title: t("calendarEventModalTitle"),
			closeLabel: t("close"),
			footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: sidebar_module_css_default.folderPickerFooter,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: sidebar_module_css_default.explorerPill,
					onClick: onClose,
					children: t("cancel")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: sidebar_module_css_default.explorerPill,
					onClick: handleCreate,
					children: t("calendarEventCreate")
				})]
			}),
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: sidebar_module_css_default.calendarEventForm,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: sidebar_module_css_default.calendarEventField,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: sidebar_module_css_default.calendarEventLabel,
							children: t("calendarEventTitleLabel")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
							value: title,
							onChange: (e) => {
								setTitle(e.target.value);
							},
							placeholder: t("calendarEventTitlePlaceholder"),
							autoFocus: true
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: sidebar_module_css_default.calendarEventRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: sidebar_module_css_default.calendarEventField,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: sidebar_module_css_default.calendarEventLabel,
								children: t("calendarEventStartLabel")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "datetime-local",
								className: sidebar_module_css_default.calendarEventDateInput,
								value: startValue,
								onChange: (e) => {
									setStartValue(e.target.value);
								}
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: sidebar_module_css_default.calendarEventField,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: sidebar_module_css_default.calendarEventLabel,
								children: t("calendarEventEndLabel")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "datetime-local",
								className: sidebar_module_css_default.calendarEventDateInput,
								value: endValue,
								onChange: (e) => {
									setEndValue(e.target.value);
								}
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: sidebar_module_css_default.calendarEventField,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: sidebar_module_css_default.calendarEventLabel,
							children: t("calendarEventLocationLabel")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
							value: location,
							onChange: (e) => {
								setLocation(e.target.value);
							},
							placeholder: t("calendarEventLocationPlaceholder")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: sidebar_module_css_default.calendarEventField,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: sidebar_module_css_default.calendarEventLabel,
							children: t("calendarEventDescriptionLabel")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
							className: sidebar_module_css_default.calendarEventTextarea,
							value: description,
							onChange: (e) => {
								setDescription(e.target.value);
							},
							placeholder: t("calendarEventDescriptionPlaceholder"),
							rows: 3
						})]
					})
				]
			})
		});
	}
	//#endregion
	//#region src/client/CalendarView.tsx
	/**
	* The Calendar tab: a FullCalendar (Month / Week / Day views) over events
	* persisted in a local SQLite DB via the host's `/powerdesk/api/calendar.*`
	* routes (see calendar-api.ts / rust-sqlite-deps.ts on the host half). Built
	* as a lazy chunk (`lib/client-calendar.js`, see chunks/calendar.tsx +
	* tsdown.config.ts) so FullCalendar only downloads on first calendar-open —
	* not at plugin startup, per the lazy-loading requirement.
	*
	* Library choice: FullCalendar replaced schedule-x (see git history) because
	* schedule-x gates drag-to-create ("draw" a new event by dragging empty grid
	* space) behind a paid Premium tier — everything else (drag-move, resize)
	* is free, but drag-to-create was the one feature actually asked for.
	* FullCalendar's `@fullcalendar/interaction` plugin ships drag-move, resize,
	* AND drag-to-create (`selectable` + `select`) as MIT-licensed core
	* features, no license key. Pinned to the 6.1.x line (not the 7.x line,
	* which is a very recent rewrite whose daygrid/timegrid/interaction plugins
	* haven't been republished to match yet — installing 7.x core with 6.x
	* plugins would mismatch peer deps).
	*
	* Mount model: the official `@fullcalendar/react` adapter (unlike
	* schedule-x, where we deliberately avoided its React adapter because it
	* lagged the core version line — FullCalendar's stays in lockstep). This is
	* a normal controlled React component: events live in this component's own
	* state (fetched once on mount, kept in sync by each CRUD callback), passed
	* straight into the `events` prop — no imperative `calendar.events.add()`
	* escape hatch needed the way schedule-x required.
	*
	* Time handling: FullCalendar's default `timeZone: 'local'` parses a
	* timezone-less ISO string (our SQLite store's naive wall-clock format,
	* e.g. '2026-08-18T10:00:00') as local time directly — no Temporal
	* conversion layer needed at all (schedule-x required one; see the removed
	* toTemporal/toIso machinery in git history). Callbacks hand back native
	* `Date` objects in the browser's local time; `dateToNaiveIso()` converts
	* those back to the naive local string the DB expects, using local getters
	* (not `toISOString()`, which would shift by the UTC offset).
	*
	* CRUD: `editable` enables both drag-move (`eventDrop`) and resize
	* (`eventResize`) — both persist via `calendarUpdate` and call
	* `info.revert()` on failure so the UI snaps back immediately rather than
	* silently drifting from the DB. `selectable` + `select` is genuine
	* drag-to-create: drag across empty grid space, release, open
	* CalendarEventModal seeded with the dragged range (a bare `window.prompt`
	* only asked for a title and gave no way to add a location/description or
	* fine-tune the times after a rough drag). `eventClick` → confirm-delete,
	* same as before. No standalone "new event" affordance — drag-to-create on
	* the grid is the only entry point, since the modal needs a start/end to
	* seed itself with and a button click has no natural one to anchor to.
	*
	* Theming: FullCalendar themes purely through CSS custom properties on its
	* own `.fc` root class (see sidebar.module.css's Calendar section) — our
	* design tokens are already light/dark-reactive, so unlike schedule-x
	* (which needed an explicit `setTheme()` call on scheme flips) or
	* ResttyTerminal's canvas renderer (which can't read CSS vars at all and
	* needs isDark injected at construction), no JS-driven theme tracking is
	* needed here.
	*/
	/**
	* Work around a CJS/ESM interop bug shared by every `@fullcalendar/*`
	* package: their `dist|index.cjs` builds do `exports["default"] = X`
	* without setting `exports.__esModule = true`. tsdown's CJS output picks
	* those `.cjs` builds (rolldown prefers the `require` condition when the
	* bundle format is `cjs`), and esbuild-style interop helpers can't tell
	* they're already default exports, so they wrap them AGAIN — `import X from
	* '@fullcalendar/...'` then resolves to `{ default: X }` (an object)
	* instead of the real value. For the React component this crashes render
	* ("Element type is invalid ... got: object", React error #130); for a
	* plugin passed into `plugins={[...]}` it crashes FullCalendar's own init
	* ("defs is not iterable", since it iterates the plugin's `.defs` and gets
	* `undefined` off the wrapper object instead). Unwrap defensively: if the
	* import still carries a nested `.default`, that's the double-wrap.
	*/
	function unwrapDefault(imported) {
		return imported.default ?? imported;
	}
	const FullCalendar = unwrapDefault(import_dist.default);
	const dayGridPlugin = unwrapDefault(import_daygrid.default);
	const timeGridPlugin = unwrapDefault(import_timegrid.default);
	const interactionPlugin = unwrapDefault(import_interaction.default);
	/** Pad a number to 2 digits (for building local-time ISO strings). */
	function pad2(n) {
		return n < 10 ? `0${n}` : String(n);
	}
	/** A `Date` (browser local time) to the naive local-wall-clock ISO string
	*  the SQLite store expects — local getters, not `toISOString()` (UTC). */
	function dateToNaiveIso(d) {
		return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
	}
	/** Map a host `CalendarEvent` to the shape FullCalendar's `events` prop wants. */
	function toEventInput(e) {
		return {
			id: e.id,
			title: e.title ?? t("calendarUntitledEvent"),
			start: e.start,
			end: e.end
		};
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
		const calendarApiRef = (0, react.useRef)(null);
		const [state, setState] = (0, react.useState)({ status: "loading" });
		const [events, setEvents] = (0, react.useState)([]);
		const [draftRange, setDraftRange] = (0, react.useState)(null);
		(0, react.useEffect)(() => {
			if (!visible || state.status !== "loading") return;
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
				try {
					const result = await api.calendarList();
					if (cancelled) return;
					setEvents(result.events.map(toEventInput));
					setState({ status: "ready" });
				} catch (error) {
					if (cancelled) return;
					setState({
						status: "error",
						message: error instanceof Error ? error.message : String(error)
					});
				}
			}
			init().catch((error) => {
				if (!cancelled) setState({
					status: "error",
					message: error instanceof Error ? error.message : String(error)
				});
			});
			return () => {
				cancelled = true;
			};
		}, [visible, state.status]);
		/** Refetch all events from the DB (DB is the source of truth; used to
		*  reconcile the local view after a failed mutation). */
		function reconcile() {
			api.calendarList().then((result) => {
				setEvents(result.events.map(toEventInput));
			}).catch(() => {});
		}
		function handleSelect(info) {
			setDraftRange({
				start: info.start,
				end: info.end
			});
		}
		function closeDraftModal() {
			setDraftRange(null);
			calendarApiRef.current?.unselect();
		}
		function handleCreate(draft) {
			const event = {
				id: crypto.randomUUID(),
				title: draft.title,
				start: dateToNaiveIso(draft.start),
				end: dateToNaiveIso(draft.end),
				...draft.location !== "" ? { location: draft.location } : {},
				...draft.description !== "" ? { description: draft.description } : {}
			};
			api.calendarCreate(event).then(() => {
				setEvents((prev) => [...prev, toEventInput(event)]);
			}).catch((error) => {
				if (error instanceof ResttyApiError) setState({
					status: "error",
					message: error.message
				});
			});
			closeDraftModal();
		}
		function handleEventDrop(info) {
			const { event } = info;
			if (event.start === null || event.end === null) return;
			api.calendarUpdate({
				id: event.id,
				start: dateToNaiveIso(event.start),
				end: dateToNaiveIso(event.end)
			}).catch(() => {
				info.revert();
				reconcile();
			});
		}
		function handleEventResize(info) {
			const { event } = info;
			if (event.start === null || event.end === null) return;
			api.calendarUpdate({
				id: event.id,
				start: dateToNaiveIso(event.start),
				end: dateToNaiveIso(event.end)
			}).catch(() => {
				info.revert();
				reconcile();
			});
		}
		function handleEventClick(info) {
			const id = info.event.id;
			const label = info.event.title === "" ? t("calendarUntitledEvent") : info.event.title;
			if (window.confirm(t("calendarDeleteConfirm", { title: label }))) api.calendarDelete(id).then((result) => {
				if (result.changes > 0) info.event.remove();
			}).catch(() => {
				reconcile();
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
				className: sidebar_module_css_default.calendarContainer,
				style: {
					flex: 1,
					minHeight: 0,
					overflow: "hidden"
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FullCalendar, {
					ref: (instance) => {
						calendarApiRef.current = instance?.getApi() ?? null;
					},
					plugins: [
						dayGridPlugin,
						timeGridPlugin,
						interactionPlugin
					],
					initialView: "timeGridWeek",
					headerToolbar: {
						left: "prev,next today",
						center: "title",
						right: "dayGridMonth,timeGridWeek,timeGridDay"
					},
					height: "100%",
					timeZone: "local",
					editable: true,
					selectable: true,
					selectMirror: true,
					events,
					eventClick: handleEventClick,
					eventDrop: handleEventDrop,
					eventResize: handleEventResize,
					select: handleSelect
				})
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CalendarEventModal, {
				open: draftRange !== null,
				initialStart: draftRange?.start ?? null,
				initialEnd: draftRange?.end ?? null,
				onCreate: handleCreate,
				onClose: closeDraftModal
			})]
		});
	}
	//#endregion
	exports.CalendarView = CalendarView;
	return module.exports;
};

//# sourceMappingURL=client-calendar.js.map