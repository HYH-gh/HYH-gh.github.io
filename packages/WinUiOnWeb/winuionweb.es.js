import { Comment as e, Fragment as t, Teleport as n, Text as r, Transition as i, TransitionGroup as a, computed as o, createBlock as s, createCommentVNode as c, createElementBlock as l, createElementVNode as u, createSlots as d, createStaticVNode as f, createTextVNode as p, createVNode as m, defineComponent as h, getCurrentInstance as g, h as _, inject as v, isRef as y, mergeProps as b, nextTick as x, normalizeClass as S, normalizeStyle as C, onBeforeUnmount as w, onMounted as ee, onUnmounted as T, onUpdated as E, openBlock as D, provide as O, reactive as k, ref as A, renderList as j, renderSlot as M, resolveComponent as N, resolveDynamicComponent as P, shallowReactive as F, shallowRef as I, toDisplayString as L, toRaw as R, unref as z, useAttrs as te, useSlots as ne, vShow as B, watch as V, withCtx as H, withDirectives as U, withKeys as W, withModifiers as G } from "vue";
//#region src/components/xamlRuntime.ts
var re = Symbol("WinUIonWeb.xamlScope"), K = Symbol("WinUIonWeb.xamlNameScope"), q = new Set(/* @__PURE__ */ "arguments.eval.await.yield.class.function.var.let.const.if.else.return.switch.case.default.delete.new.this.super.typeof.void.in.instanceof.true.false.null.undefined".split(".")), J = new Set(/* @__PURE__ */ "Click.Checked.Unchecked.Indeterminate.SelectionChanged.Selected.Select.ValueChanged.TextChanged.TextSubmitted.IsCheckedChanged.IsOnChanged.Toggled.DropDownOpened.DropDownClosed.Opening.Opened.Closing.Closed.Expanding.Expanded.Collapsing.Collapsed.DateChanged.ColorChanged.QuerySubmitted.ItemClick.GettingFocus.KeyDown.PointerPressed.PointerReleased.Tapped.Loaded.PrimaryButtonClick.SecondaryButtonClick.CloseButtonClick.ActionButtonClick".split(".")), ie = (e) => `on${e}`, Y = /* @__PURE__ */ new WeakMap(), X = new Set(/* @__PURE__ */ "AutoSuggestBox.Border.Button.CheckBox.ColorPicker.ComboBox.ContentDialog.ControlExample.DropDownButton.Expander.ExpanderBase.Flyout.FontIcon.HyperlinkButton.Image.Popup.RadioButton.RadioButtons.Rating.Rectangle.RepeatButton.RichEditBox.RichTextBlock.Slider.SplitButton.SymbolIcon.TeachingTip.TextBlock.TextBox.ToggleButton.ToggleSplitButton.ToggleSwitch.ToolTip".split(".")), Z = (e) => {
	if (!e || typeof e != "object") return "";
	let t = e;
	return t.name || t.__name || t.__file?.split(/[\\/]/).pop()?.replace(/\.vue$/, "") || "";
}, ae = (e) => y(e) ? e.value : e, Q = (e) => {
	let t = {}, n = (e) => {
		if (!e) return;
		let n = [];
		try {
			n = Object.keys(e);
		} catch {
			return;
		}
		for (let r of n) if (!(r in t)) try {
			t[r] = ae(e[r]);
		} catch {}
	}, r = e?.parent ?? null;
	for (; r;) {
		let e = String(r.type?.__file ?? "").replace(/\\/g, "/");
		/\/gallery\/(?:pages|components)\//.test(e) && n(r.setupState), r = r.parent;
	}
	let i = e?.parent?.provides?.[re];
	n(i);
	let a = e?.parent?.provides?.[K];
	n(a);
	let o = e?.appContext.config.globalProperties;
	if (o) {
		let e = [];
		try {
			e = Object.keys(o);
		} catch {
			e = [];
		}
		for (let n of e) if (!(n !== "$t" && n in t)) try {
			t[n] = ae(o[n]);
		} catch {}
		try {
			typeof o.$t == "function" && (t.$t = o.$t);
		} catch {}
	}
	return typeof t.$t == "function" && !t.t && (t.t = t.$t), t;
}, oe = (e) => {
	let t = e.match(/^\{(?:x:Bind|Binding)\s+([\s\S]*?)\}$/);
	return t ? t[1].replace(/,\s*Mode\s*=\s*(?:OneWay|TwoWay|OneTime)\s*$/, "").trim() : e;
}, se = (e) => e.trim().match(/^\{\s*(?:ThemeResource|StaticResource)\s+([^\s}]+)\s*\}$/i)?.[1] ?? "", ce = (e) => e ? `var(--${{
	AcrylicBackgroundFillColorDefaultBrush: "AcrylicInAppFillColorDefaultBrush",
	OverlayCornerRadius: "OverlayCornerRadius",
	SurfaceStrokeColorDefaultBrush: "SurfaceStrokeColorDefaultBrush",
	SurfaceStrokeColorFlyoutBrush: "SurfaceStrokeColorFlyoutBrush",
	LayerFillColorAltBrush: "LayerFillColorAltBrush",
	SolidBackgroundFillColorBaseBrush: "SolidBackgroundFillColorBaseBrush",
	SolidBackgroundFillColorTertiaryBrush: "SolidBackgroundFillColorTertiaryBrush",
	SmokeFillColorDefaultBrush: "SmokeFillColorDefaultBrush"
}[e] ?? e})` : "", le = (e) => {
	let t = e.match(/^\{(?:x:Bind|Binding)\s+([\s\S]*?)\}$/);
	if (!t) return {
		expression: e,
		twoWay: !1
	};
	let n = t[1];
	return {
		expression: n.replace(/,\s*Mode\s*=\s*(?:OneWay|TwoWay|OneTime)\s*$/, "").trim(),
		twoWay: /,\s*Mode\s*=\s*TwoWay\s*$/i.test(n)
	};
}, ue = (e) => e.replace(/^\((?:x:Double|x:Int32|x:String)\)/, "").replace(/\?\./g, ".").split(".").map((e) => e.trim()).filter(Boolean), de = (e, t) => {
	let n = e.trim();
	if (n === "x:True" || n === "True") return !0;
	if (n === "x:False" || n === "False") return !1;
	if (n === "x:Null" || n === "Null") return null;
	if (/^-?\d+(?:\.\d+)?$/.test(n)) return Number(n);
	if (/^'.*'$|^".*"$/.test(n)) return n.slice(1, -1);
	let r = n.match(/^\$?t\(\s*(['"])(.*?)\1\s*\)$/s);
	if (r && typeof (t.$t ?? t.t) == "function") return (t.$t ?? t.t)(r[2]);
	let i = n.match(/^(.*)\.Equals\((x:)?(True|False|Null)\)$/);
	if (i) {
		let e = de(i[1], t), n = de(`${i[2] ?? ""}${i[3]}`, t);
		return ae(e) === n;
	}
	let a = n.match(/^(.*)\.ToString\(\)$/);
	if (a) return String(ae(de(a[1], t)) ?? "");
	if (n.startsWith("String(") && n.endsWith(")")) return String(ae(de(n.slice(7, -1), t)) ?? "");
	if (/[$A-Za-z_(]/.test(n)) try {
		let e = n.replace(/\bx:(True|False|Null)\b/g, (e, t) => t === "True" ? "true" : t === "False" ? "false" : "null"), r = Object.entries(t).filter(([e]) => /^[A-Za-z_$][\w$]*$/.test(e) && !q.has(e));
		return ae(Function(...r.map(([e]) => e), `return (${e})`)(...r.map(([, e]) => e)));
	} catch {}
	let o = n.match(/^([A-Za-z_$][\w$]*)/);
	if (!o) return;
	let s = t[o[1]];
	n = n.slice(o[0].length);
	for (let e of ue(n)) {
		if (s = ae(s), s == null) return;
		(e === "IsChecked" || e === "Value") && (typeof s == "boolean" || typeof s == "number" || typeof s == "string") || (s = s[e]);
	}
	return ae(s);
}, fe = (e) => {
	let t = e.trim();
	return /^\$t\s*\(/.test(t) || /^t\s*\(/.test(t) || /^\$\{\s*t\s*\(/.test(t);
}, $ = (e, t) => {
	if (typeof e != "string") return e;
	if (e === "True") return !0;
	if (e === "False") return !1;
	let n = e.trim(), r = se(n);
	if (r) return ce(r);
	let i = oe(e), a = fe(n) ? n.replace(/^\$\{\s*/, "").replace(/\s*\}$/, "") : i;
	if (a === e && !e.includes("{") && !fe(e)) return e;
	let o;
	try {
		o = de(a, Q(t));
	} catch {
		o = void 0;
	}
	if (o !== void 0) return o;
	if (!(/^\{\s*(?:x:Bind|Binding)\b/.test(e) || fe(e))) return e;
}, pe = (e, t, n) => {
	let r = ue(e);
	if (!r.length) return;
	let i = n;
	for (; i;) {
		if (Object.prototype.hasOwnProperty.call(i.setupState, r[0])) {
			let e = i.setupState;
			for (let t = 0; t < r.length - 1; t += 1) {
				let n = r[t];
				if (e = ae(e[n]), e == null) return;
			}
			let n = r[r.length - 1], a = e, o = a[n];
			y(o) ? o.value = t : y(a) ? a.value = t : a[n] = t;
			return;
		}
		i = i.parent;
	}
	for (i = n; i;) {
		let e = i.provides?.[K];
		if (e && Object.prototype.hasOwnProperty.call(e, r[0])) {
			let n = ae(e[r[0]]);
			for (let e = 1; e < r.length - 1; e += 1) if (n = ae(n?.[r[e]]), n == null) return;
			let i = r[r.length - 1], a = n;
			if (!a) return;
			let o = a[i];
			y(o) ? o.value = t : a[i] = t;
			return;
		}
		i = i.parent;
	}
}, me = (e, t, n) => {
	if (typeof e != "string") return;
	let r = le(e);
	r.twoWay && pe(r.expression, t, n);
}, he = (e, t, n) => {
	let r = e.trim(), i = de(r, t);
	if (typeof i == "function") return (...e) => i(...e);
	let a = r.match(/^([A-Za-z_$][\w$]*)\((.*)\)$/s);
	if (!a || typeof t[a[1]] != "function") return;
	let o = a[2].trim();
	try {
		let e = Object.entries(t).filter(([e]) => /^[A-Za-z_$][\w$]*$/.test(e) && !q.has(e)), r = o ? Function(...e.map(([e]) => e), "$event", `return [${o}]`)(...e.map(([, e]) => e), n) : [];
		return (...e) => t[a[1]](...r, ...e);
	} catch {
		return (...e) => t[a[1]](...e);
	}
}, ge = (e, t) => {
	if (typeof e == "function") return e;
	if (typeof e != "string") return;
	let n = oe(e), r = Q(t), i = n.match(/^([A-Za-z_$][\w$]*)\s*=\s*\$event(?:\.([A-Za-z_$][\w$]*))?(?:\s*(===|!==|==|!=)\s*(['"]?[^\s'"]+['"]?))?$/);
	if (i) return (e) => {
		let n = e;
		if (i[2] && (n = n?.[i[2]]), i[3]) {
			let e = i[4]?.replace(/^['"]|['"]$/g, ""), t = e === "true" ? !0 : e === "false" ? !1 : Number.isNaN(Number(e)) ? e : Number(e);
			n = i[3] === "===" ? n === t : i[3] === "!==" ? n !== t : i[3] === "==" ? n == t : n != t;
		}
		pe(i[1], n, t);
	};
	let a = n.match(/^([A-Za-z_$][\w$]*)\s*=\s*(['"].*['"])$/s);
	return a ? () => pe(a[1], a[2].slice(1, -1), t) : he(n, r, void 0);
}, _e = (e, t) => {
	let n = { ...e.props ?? {} }, r = Y.get(e) ?? { ...n };
	Y.set(e, r);
	for (let [i, a] of Object.entries(r)) if (!(i.startsWith("on") || i === "key" || i === "class" || i === "style")) {
		if (i === "ref" || /^x:name$/i.test(i)) {
			if (typeof a == "string" && a.trim() && (n["data-xaml-ref"] = a.trim()), /^x:name$/i.test(i) && typeof a == "string" && a.trim()) {
				let e = t?.provides?.[K];
				if (e) {
					let t = a.trim(), r = null, i = null, o = (n) => {
						let a = n.component, o = a?.exposed;
						if (o) {
							(r !== o || !i) && (r = o, i = new Proxy(o, {
								get(e, t, n) {
									return ae(Reflect.get(e, t, n));
								},
								set(e, t, n, r) {
									let i = Reflect.get(e, t, r);
									return y(i) && !y(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
								}
							})), e[t] = i;
							return;
						}
						e[t] = a?.exposeProxy ?? a?.proxy ?? n.el ?? void 0;
					}, s = n.onVnodeMounted, c = n.onVnodeUpdated, l = n.onVnodeBeforeUnmount;
					n.onVnodeMounted = (e) => {
						typeof s == "function" && s(e), o(e);
					}, n.onVnodeUpdated = (e) => {
						typeof c == "function" && c(e), o(e);
					}, n.onVnodeBeforeUnmount = (n) => {
						typeof l == "function" && l(n), delete e[t];
					};
				}
			}
			/^x:name$/i.test(i) && delete n[i];
			continue;
		}
		if (J.has(i)) {
			let e = ge(a, t);
			e && (n[ie(i)] = e), delete n[i];
			continue;
		}
		if (typeof a == "string" && a.startsWith("{")) {
			let r = le(a), o = $(a, t);
			n[i] = typeof e.type == "string" || se(a) || !X.has(Z(e.type)) ? o : a, r.twoWay && !i.includes(".") && (n[`onUpdate:${i}`] = (e) => pe(r.expression, e, t));
		}
		if (typeof e.type == "string" && (i === "Background" || i === "BorderBrush" || i === "Foreground")) {
			let e = $(a, t), r = typeof n.style == "object" && n.style !== null ? { ...n.style } : {};
			i === "Background" && (r.background = e), i === "BorderBrush" && (r.borderColor = e), i === "Foreground" && (r.color = e), n.style = r, delete n[i];
		}
		typeof e.type == "string" && i === "Source" && (n.src = $(a, t), delete n[i]);
	}
	if (Array.isArray(e.children) && (e.children = e.children.map((e) => e && typeof e == "object" && "type" in e ? _e(e, t) : e)), e.children && typeof e.children == "object" && !Array.isArray(e.children)) {
		let n = { ...e.children };
		for (let [e, r] of Object.entries(n)) typeof r == "function" && (n[e] = (...e) => {
			let n = r(...e);
			return Array.isArray(n) ? n.map((e) => e && typeof e == "object" && "type" in e ? _e(e, t) : e) : n;
		});
		e.children = n;
	}
	return e.props = Object.keys(n).length || e.props ? n : e.props, e;
}, ve = (e, t = g()) => e.map((e) => _e(e, t)), ye = Symbol("winui-grid-definitions"), be = Symbol("winui-grid-definition-target"), xe = (e) => {
	if (e === "" || e == null) return "";
	if (typeof e == "number" && Number.isFinite(e)) return `${e}px`;
	let t = String(e).trim();
	return t ? Number.isFinite(Number(t)) ? `${Number(t)}px` : t : "";
}, Se = (e) => {
	if (e === "" || e == null) return "";
	let t = String(e).split(",").map((e) => xe(e.trim()));
	return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : String(e);
}, Ce = (e, t) => {
	let n = String(e ?? "");
	return t === "horizontal" ? {
		Left: "start",
		Center: "center",
		Right: "end",
		Stretch: "stretch"
	}[n] ?? "" : {
		Top: "start",
		Center: "center",
		Bottom: "end",
		Stretch: "stretch"
	}[n] ?? "";
}, we = (e) => typeof e == "boolean" ? e : /^(true|1|yes)$/i.test(String(e ?? "").trim()), Te = (e, t) => {
	let n = t.toLowerCase();
	return e.getAttributeNames().find((e) => e.toLowerCase() === n);
}, Ee = (e, t) => {
	let n = Te(e, t);
	return n === void 0 ? void 0 : e.getAttribute(n) ?? "";
}, De = (e, t, n) => {
	let r = Number(Ee(e, t));
	return Number.isFinite(r) ? Math.max(0, Math.floor(r)) : n;
}, Oe = (e, t, n = 1) => Math.max(1, De(e, t, n)), ke = (e, t, n) => {
	e.style[t] = n === null || n === "" ? "" : String(n);
}, Ae = (e) => {
	let t = Ee(e, "Width"), n = Ee(e, "Height"), r = Ee(e, "MinWidth"), i = Ee(e, "MaxWidth"), a = Ee(e, "MinHeight"), o = Ee(e, "MaxHeight"), s = Ee(e, "Margin"), c = Ee(e, "Padding");
	t !== void 0 && ke(e, "width", xe(t)), n !== void 0 && ke(e, "height", xe(n)), r !== void 0 && ke(e, "minWidth", xe(r)), i !== void 0 && ke(e, "maxWidth", xe(i)), a !== void 0 && ke(e, "minHeight", xe(a)), o !== void 0 && ke(e, "maxHeight", xe(o)), s !== void 0 && ke(e, "margin", Se(s)), c !== void 0 && ke(e, "padding", Se(c));
}, je = (e) => {
	Array.from(e.children).forEach((e) => {
		let t = e;
		Ae(t);
		let n = Ee(t, "Grid.Row"), r = Ee(t, "Grid.Column"), i = Ee(t, "Grid.RowSpan"), a = Ee(t, "Grid.ColumnSpan");
		(n !== void 0 || i !== void 0) && ke(t, "gridRow", `${De(t, "Grid.Row", 0) + 1} / span ${Oe(t, "Grid.RowSpan")}`), (r !== void 0 || a !== void 0) && ke(t, "gridColumn", `${De(t, "Grid.Column", 0) + 1} / span ${Oe(t, "Grid.ColumnSpan")}`);
		let o = Ee(t, "HorizontalAlignment"), s = Ee(t, "VerticalAlignment");
		o !== void 0 && ke(t, "justifySelf", Ce(o, "horizontal")), s !== void 0 && ke(t, "alignSelf", Ce(s, "vertical"));
	});
}, Me = (e, t) => {
	let n = t === "Horizontal";
	Array.from(e.children).forEach((e) => {
		let t = e;
		Ae(t);
		let r = Ee(t, n ? "VerticalAlignment" : "HorizontalAlignment");
		r !== void 0 && ke(t, "alignSelf", Ce(r, n ? "vertical" : "horizontal"));
	});
}, Ne = (e) => {
	Array.from(e.children).forEach((e) => {
		let t = e;
		Ae(t), t.style.position = "absolute";
		let n = Ee(t, "Canvas.Left"), r = Ee(t, "Canvas.Top"), i = Ee(t, "Canvas.ZIndex");
		n !== void 0 && ke(t, "left", xe(n)), r !== void 0 && ke(t, "top", xe(r)), i !== void 0 && ke(t, "zIndex", Number(i) || 0);
	});
}, Pe = (e) => Ee(e, "x:Name") ?? Ee(e, "Name"), Fe = (e) => {
	let t = Array.from(e.children).map((e) => e), n = /* @__PURE__ */ new Map();
	t.forEach((e) => {
		let t = Pe(e);
		t && n.set(t, e);
	});
	let r = e.clientWidth, i = e.clientHeight;
	t.forEach((e) => {
		if (Ae(e), e.style.position = "absolute", ![
			"LeftOf",
			"RightOf",
			"Above",
			"Below",
			"AlignHorizontalCenterWith",
			"AlignVerticalCenterWith",
			"AlignLeftWith",
			"AlignTopWith",
			"AlignRightWith",
			"AlignBottomWith",
			"AlignLeftWithPanel",
			"AlignTopWithPanel",
			"AlignRightWithPanel",
			"AlignBottomWithPanel",
			"AlignHorizontalCenterWithPanel",
			"AlignVerticalCenterWithPanel"
		].some((t) => Ee(e, `RelativePanel.${t}`) !== void 0)) return;
		let t = (Ee(e, "Margin") ?? "").split(",").map(Number).map((e) => Number.isFinite(e) ? e : 0), a = t[0] ?? 0, o = t[1] ?? a, s = t[2] ?? a, c = t[3] ?? o, l = e.offsetWidth, u = e.offsetHeight, d = e.offsetLeft, f = e.offsetTop, p = (t) => n.get(Ee(e, `RelativePanel.${t}`) ?? "");
		we(Ee(e, "RelativePanel.AlignLeftWithPanel")) && (d = a), we(Ee(e, "RelativePanel.AlignRightWithPanel")) && (d = r - l - s), we(Ee(e, "RelativePanel.AlignHorizontalCenterWithPanel")) && (d = (r - l) / 2 + (a - s) / 2), we(Ee(e, "RelativePanel.AlignTopWithPanel")) && (f = o), we(Ee(e, "RelativePanel.AlignBottomWithPanel")) && (f = i - u - c), we(Ee(e, "RelativePanel.AlignVerticalCenterWithPanel")) && (f = (i - u) / 2 + (o - c) / 2);
		let m = p("RightOf"), h = p("LeftOf"), g = p("Below"), _ = p("Above");
		m && (d = m.offsetLeft + m.offsetWidth + a), h && (d = h.offsetLeft - l - s), g && (f = g.offsetTop + g.offsetHeight + o), _ && (f = _.offsetTop - u - c);
		let v = p("AlignHorizontalCenterWith"), y = p("AlignVerticalCenterWith");
		v && (d = v.offsetLeft + (v.offsetWidth - l) / 2 + (a - s) / 2), y && (f = y.offsetTop + (y.offsetHeight - u) / 2 + (o - c) / 2);
		let b = p("AlignLeftWith"), x = p("AlignRightWith"), S = p("AlignTopWith"), C = p("AlignBottomWith");
		b && (d = b.offsetLeft + a), x && (d = x.offsetLeft + x.offsetWidth - l - s), S && (f = S.offsetTop + o), C && (f = C.offsetTop + C.offsetHeight - u - c), ke(e, "left", `${d}px`), ke(e, "top", `${f}px`);
	});
}, Ie = (e) => {
	Array.from(e.children).forEach((e) => {
		let t = e;
		Ae(t);
		let n = Ee(t, "VariableSizedWrapGrid.RowSpan"), r = Ee(t, "VariableSizedWrapGrid.ColumnSpan");
		n !== void 0 && ke(t, "gridRow", `span ${Oe(t, "VariableSizedWrapGrid.RowSpan")}`), r !== void 0 && ke(t, "gridColumn", `span ${Oe(t, "VariableSizedWrapGrid.ColumnSpan")}`);
	});
}, Le = (e, t) => {
	let n, r = () => void x(t);
	ee(() => {
		r(), e.value && (n = new MutationObserver(r), n.observe(e.value, {
			childList: !0,
			subtree: !0,
			attributes: !0,
			attributeFilter: /* @__PURE__ */ "Grid.Row,Grid.Column,Grid.RowSpan,Grid.ColumnSpan,Canvas.Left,Canvas.Top,Canvas.ZIndex,VariableSizedWrapGrid.RowSpan,VariableSizedWrapGrid.ColumnSpan,RelativePanel.LeftOf,RelativePanel.RightOf,RelativePanel.Above,RelativePanel.Below,RelativePanel.AlignHorizontalCenterWith,RelativePanel.AlignVerticalCenterWith,RelativePanel.AlignLeftWith,RelativePanel.AlignTopWith,RelativePanel.AlignRightWith,RelativePanel.AlignBottomWith,RelativePanel.AlignLeftWithPanel,RelativePanel.AlignTopWithPanel,RelativePanel.AlignRightWithPanel,RelativePanel.AlignBottomWithPanel,RelativePanel.AlignHorizontalCenterWithPanel,RelativePanel.AlignVerticalCenterWithPanel,HorizontalAlignment,VerticalAlignment,Width,Height,Margin,Padding".split(",")
		}));
	}), E(r), w(() => n?.disconnect());
}, Re = {
	Origin: "edge",
	Direction: "top",
	Duration: 800,
	Easing: "cubic-bezier(0.092,1.003,0.028,0.997)",
	Margin: 15,
	StripSize: 36,
	RespectReducedMotion: !0
}, ze = (e) => typeof e == "function" ? e() : e, Be = (e, t, n) => Math.max(t, Math.min(n, e)), Ve = (e) => `polygon(${e.left}px ${e.top}px, ${e.right}px ${e.top}px, ${e.right}px ${e.bottom}px, ${e.left}px ${e.bottom}px)`, He = (e, t) => {
	let n = ze(t);
	return n ? typeof n == "string" ? e?.querySelector(n) ?? null : n instanceof HTMLElement ? n : n.value instanceof HTMLElement ? n.value : null : null;
}, Ue = (e, t, n) => {
	let r = Math.max(1, Math.min(ze(n) ?? Re.StripSize, t === "left" || t === "right" ? e.width : e.height));
	switch (t) {
		case "bottom": return {
			left: 0,
			right: e.width,
			top: e.height - r,
			bottom: e.height
		};
		case "left": return {
			left: 0,
			right: r,
			top: 0,
			bottom: e.height
		};
		case "right": return {
			left: e.width - r,
			right: e.width,
			top: 0,
			bottom: e.height
		};
		default: return {
			left: 0,
			right: e.width,
			top: 0,
			bottom: r
		};
	}
}, We = (e) => ({
	left: 0,
	right: e.width,
	top: e.height / 2 - 2 / 2,
	bottom: e.height / 2 + 2 / 2
}), Ge = (e, t, n) => {
	let r = He(e, n);
	if (!r) return null;
	let i = r.getBoundingClientRect(), a = Be(i.left - t.left, 0, t.width), o = Be(i.right - t.left, a, t.width), s = Be(i.top - t.top, 0, t.height), c = Be(i.bottom - t.top, s, t.height);
	return c - s > 0 && o - a > 0 ? {
		left: a,
		right: o,
		top: s,
		bottom: c
	} : null;
}, Ke = (e, t) => {
	let n = typeof t == "function" ? t(e) : t;
	if (!n) return null;
	let r = Be(n.left ?? 0, 0, e.width), i = Be(n.right ?? e.width, r, e.width), a = Be(n.top ?? 0, 0, e.height), o = Be(n.bottom ?? e.height, a, e.height);
	return o - a > 0 && i - r > 0 ? {
		left: r,
		right: i,
		top: a,
		bottom: o
	} : null;
}, qe = (e, t, n) => {
	let r = ze(n.Origin) ?? Re.Origin;
	return (r === "element" ? Ge(e, t, n.OriginElement) : r === "rect" ? Ke(t, n.StartRect) : r === "center" ? We(t) : null) ?? Ue(t, ze(n.Direction) ?? Re.Direction, n.StripSize);
}, Je = (e, t = {}) => {
	let n = A(!1), r = null, i = () => {
		if (e instanceof HTMLElement) return e;
		let t = typeof e == "function" ? e() : e.value;
		return t instanceof HTMLElement ? t : null;
	}, a = () => {
		r &&= (r.cancel(), null);
		let e = i();
		e && (e.style.clipPath = ""), n.value = !1;
	}, o = (e) => {
		a();
		let o = i();
		if (!o || ze(t.RespectReducedMotion) !== !1 && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let s = o.getBoundingClientRect();
		if (s.width === 0 || s.height === 0) return;
		let c = qe(o, s, t), l = ze(t.Margin) ?? Re.Margin, u = {
			left: -l,
			right: s.width + l,
			top: -l,
			bottom: s.height + l
		}, d = ze(t.Duration) ?? Re.Duration, f = ze(t.Easing) ?? Re.Easing, p = o.animate(e ? [{ clipPath: Ve(u) }, { clipPath: Ve(c) }] : [{ clipPath: Ve(c) }, { clipPath: Ve(u) }], {
			duration: d,
			easing: f,
			fill: "none"
		});
		r = p, n.value = !0, p.onfinish = () => {
			r === p && (r = null, o.style.clipPath = "", n.value = !1);
		}, p.oncancel = () => {
			r === p && (r = null, n.value = !1);
		};
	};
	return w(a), {
		play: () => o(!1),
		playReverse: () => o(!0),
		cancel: a,
		isPlaying: n
	};
}, Ye = class {
	AccessKey = "";
	Command;
	CommandParameter;
	Description = "";
	IconSource;
	KeyboardAccelerators = [];
	Label = "";
	ExecuteRequested;
	CanExecuteRequested;
	CanExecuteChanged;
	constructor(e = {}) {
		Object.assign(this, e), this.KeyboardAccelerators = [...e.KeyboardAccelerators ?? []];
	}
	CanExecute(e = this.CommandParameter) {
		let t = {
			Parameter: e,
			CanExecute: !0
		};
		return this.CanExecuteRequested?.(this, t), t.CanExecute && (this.Command?.CanExecute?.(e) ?? !0);
	}
	Execute(e = this.CommandParameter) {
		this.ExecuteRequested?.(this, { Parameter: e }), this.Command?.Execute(e);
	}
	NotifyCanExecuteChanged() {
		this.CanExecuteChanged?.(this);
	}
	MatchesKeyboardEvent(e) {
		return this.KeyboardAccelerators.some((t) => {
			let n = new Set(t.Modifiers ?? []), r = n.has("Control") || n.has("Ctrl"), i = n.has("Alt"), a = n.has("Shift"), o = n.has("Windows") || n.has("Meta");
			return e.key.toLowerCase() === t.Key.toLowerCase() && e.ctrlKey === r && e.altKey === i && e.shiftKey === a && e.metaKey === o;
		});
	}
	AttachKeyboardAccelerators(e = window) {
		let t = (e) => {
			!this.MatchesKeyboardEvent(e) || !this.CanExecute() || (e.preventDefault(), this.Execute());
		};
		return e.addEventListener("keydown", t), () => e.removeEventListener("keydown", t);
	}
}, Xe = {
	"command.standard.Backward": "Back",
	"command.standard.Close": "Close",
	"command.standard.Copy": "Copy",
	"command.standard.Cut": "Cut",
	"command.standard.Delete": "Delete",
	"command.standard.Forward": "Forward",
	"command.standard.Open": "Open",
	"command.standard.Paste": "Paste",
	"command.standard.Pause": "Pause",
	"command.standard.Play": "Play",
	"command.standard.Redo": "Redo",
	"command.standard.Save": "Save",
	"command.standard.SelectAll": "Select all",
	"command.standard.Share": "Share",
	"command.standard.Stop": "Stop",
	"command.standard.Undo": "Undo",
	"text.accept": "Accept",
	"text.aspect-ratio": "Aspect ratio",
	"text.back": "Back",
	"text.b": "B",
	"text.bold": "Bold",
	"text.breadcrumb": "Breadcrumb",
	"text.bullets": "Bullets",
	"text.c": "C#",
	"text.camera-api-is-not-available-in-this-browser": "Camera API is not available in this browser.",
	"text.camera-permission-was-denied": "Camera permission was denied.",
	"text.captured": "Captured:",
	"text.cast": "Cast",
	"text.clear-formatting": "Clear formatting",
	"text.clear-text": "Clear text",
	"text.close": "Close",
	"text.close-overflow-menu": "Close overflow menu",
	"text.command-bar": "Command bar",
	"text.copy": "Copy",
	"text.cut": "Cut",
	"text.g": "G",
	"text.hue": "Hue",
	"text.integrated-camera": "Integrated camera",
	"text.italic": "Italic",
	"text.more": "More",
	"text.more-options": "More options",
	"text.less-app-bar": "Less app bar",
	"text.see-more": "See more",
	"text.see-less": "See less",
	"text.mute": "Mute",
	"text.media-failed": "Media failed to load.",
	"text.media-transport-controls": "Media transport controls",
	"text.navigation-menu": "Navigation menu",
	"text.open-navigation": "Open navigation",
	"text.close-navigation": "Close navigation",
	"text.next": "Next",
	"text.navigationview": "NavigationView",
	"text.navigationview-description": "The NavigationView control provides a common vertical layout for top-level areas of your app via a collapsible navigation menu.",
	"sample.navigationview.default-header": "NavigationView with default PaneDisplayMode",
	"sample.navigationview.top-header": "NavigationView with PaneDisplayMode set to Top",
	"sample.navigationview.adaptive-header": "NavigationView that switches pane orientation based on window width",
	"sample.navigationview.tabs-header": "Tying selection and focus - Tabs",
	"sample.navigationview.data-binding-header": "Data binding",
	"sample.navigationview.footer-header": "NavigationView with Footer Menu Items",
	"sample.navigationview.hierarchical-header": "Hierarchical NavigationView",
	"sample.navigationview.api-header": "API in action",
	"sample.navigationview.default-description": "If you have five or more equally important navigation categories that should prominently appear on larger window widths, consider using a left navigation pane.",
	"sample.navigationview.top-description": "If you have equally important navigation categories that should be de-emphasized relative to the content of your app, consider using a top navigation pane.",
	"sample.navigationview.adaptive-description": "If you have equally important navigation categories and limited app content space, consider using a top navigation pane on larger window widths and a minimal left navigation pane on smaller window widths.",
	"sample.navigationview.tabs-description": "For the tabs pattern, ensure that you unify selection and focus by setting the SelectionFollowsFocus property to Enabled. If using a Frame to swap out content, then navigating between items shouldn't be recorded into the Frame's navigation stack. Please see the C# in the sample below to understand how to do this.",
	"sample.navigationview.data-binding-description": "When data binding, use the MenuItemsSource property to bind to an observable collection of items, and do not set the MenuItems property. In addition, set the MenuItemTemplate property and use a NavigationViewItem as the data template. If you wish to bind to the header content as well, use data template selectors via the MenuItemTemplateSelector property.",
	"sample.navigationview.footer-description": "You can add clickable menu items to the footer of your NavigationView that participate in the same selection model as items in the main menu. In Top PaneDisplayMode, these items will appear aligned to the right of the NavigationView. In Left PaneDisplayMode, these items will appear aligned to the bottom of the NavigationView.",
	"sample.navigationview.hierarchy-description-1": "NavigationView supports hierarchy in Left, LeftCompact, and Top display modes.",
	"sample.navigationview.hierarchy-description-2": "In the example below, the \"Account\" tab navigates to its own page while \"Document options\" only opens its subtree of items. This is done by setting the SelectsOnInvoked property to false on the Document options NavigationView item.",
	"sample.navigationview.hierarchy-description-3": "In both Top and Left modes, clicking the arrows on NavigationViewItems will expand or collapse the subtree. Clicking or tapping elsewhere on the NavigationViewItem will also collapse or expand the subtree.",
	"sample.navigationview.hierarchy-description-4": "Switch between the three pane display modes on the right.",
	"sample.navigationview.header-text": "This is Header Text",
	"sample.navigationview.menu-item-1": "Menu Item1",
	"sample.navigationview.menu-item-2": "Menu Item2",
	"sample.navigationview.menu-item-3": "Menu Item3",
	"sample.navigationview.menu-item-4": "Menu Item4",
	"sample.navigationview.item-1": "Item1",
	"sample.navigationview.item-2": "Item2",
	"sample.navigationview.item-3": "Item3",
	"sample.navigationview.item-4": "Item4",
	"sample.navigationview.sample-page": "Sample Page {number}",
	"sample.navigationview.settings-page": "Sample Settings Page",
	"sample.navigationview.lorem-title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
	"sample.navigationview.lorem-body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	"sample.navigationview.category": "Category {number}",
	"sample.navigationview.category-tooltip": "This is category {number}",
	"sample.navigationview.browse": "Browse",
	"sample.navigationview.track-order": "Track an Order",
	"sample.navigationview.order-history": "Order History",
	"sample.navigationview.account": "Account",
	"sample.navigationview.your-cart": "Your Cart",
	"sample.navigationview.help": "Help",
	"sample.navigationview.pane-position": "Pane position:",
	"sample.navigationview.pane-position-property": "PanePosition:",
	"sample.navigationview.left-mode": "Left mode",
	"sample.navigationview.top-mode": "Top mode",
	"sample.navigationview.left-compact-mode": "LeftCompact mode",
	"sample.navigationview.home": "Home",
	"sample.navigationview.mail": "Mail",
	"sample.navigationview.calendar": "Calendar",
	"sample.navigationview.document-options": "Document options",
	"sample.navigationview.create-new": "Create new",
	"sample.navigationview.upload-file": "Upload file",
	"sample.navigationview.settings-visible": "Settings item visible",
	"sample.navigationview.back-visible": "Back button visible",
	"sample.navigationview.back-enabled": "Back button enabled",
	"sample.navigationview.autosuggest-visible": "AutoSuggestBox visible",
	"sample.navigationview.header-label": "Header:",
	"sample.navigationview.header-value": "Header",
	"sample.navigationview.always-show-header": "Always show header",
	"sample.navigationview.pane-title-label": "PaneTitle:",
	"sample.navigationview.pane-title-value": "Pane Title",
	"sample.navigationview.pane-custom-visible": "PaneCustomContent visible",
	"sample.navigationview.pane-footer-visible": "PaneFooter visible",
	"sample.navigationview.left": "Left",
	"sample.navigationview.top": "Top",
	"sample.navigationview.keyboard-selection-follows-focus": "Keyboard SelectionFollowsFocus",
	"sample.navigationview.suppress-menu-item-2": "Selection of Menu Item2 suppressed",
	"sample.navigationview.actions": "Actions",
	"sample.navigationview.more-info": "More info",
	"sample.navigationview.search": "Search",
	"sample.navigationview.download": "Download",
	"sample.navigationview.favorite": "Favorite",
	"sample.navigationview.change-theme": "Change theme",
	"sample.navigationview.add-favorite": "Add to favorites",
	"sample.navigationview.remove-favorite": "Remove from favorites",
	"text.numbering": "Numbering",
	"text.off": "Off",
	"text.on": "On",
	"sample.opacity": "Opacity",
	"text.paste": "Paste",
	"text.pause": "Pause",
	"text.play": "Play",
	"text.previous": "Previous",
	"text.r": "R",
	"text.redo": "Redo",
	"text.requesting-camera-permission": "Requesting camera permission...",
	"text.reveal-password": "Reveal password",
	"text.scroll-left": "Scroll left",
	"text.scroll-right": "Scroll right",
	"text.search": "Search",
	"text.select": "Select...",
	"text.select-all": "Select all",
	"text.full-screen": "Full screen",
	"text.exit-full-screen": "Exit full screen",
	"text.settings": "Settings",
	"text.source-code": "Source code",
	"text.saturation": "Saturation",
	"text.submit-query": "Submit query",
	"text.switch-to-zoomed-out-view": "Switch to zoomed out view",
	"text.cancel": "Cancel",
	"text.unable-to-start-the-camera": "Unable to start the camera.",
	"text.underline": "Underline",
	"text.undo": "Undo",
	"text.unmute": "Unmute",
	"text.value": "Value",
	"text.volume": "Volume",
	"text.vue": "Vue",
	"text.xaml": "XAML",
	"control.infobadge.value": "{value} notifications",
	"control.infobadge.icon": "Notification",
	"control.infobadge.dot": "New notification",
	"control.infobar.close-button-name": "Close",
	"control.infobar.close-button-tooltip": "Close"
}, Ze = {
	"command.standard.Backward": "后退",
	"command.standard.Close": "关闭",
	"command.standard.Copy": "复制",
	"command.standard.Cut": "剪切",
	"command.standard.Delete": "删除",
	"command.standard.Forward": "前进",
	"command.standard.Open": "打开",
	"command.standard.Paste": "粘贴",
	"command.standard.Pause": "暂停",
	"command.standard.Play": "播放",
	"command.standard.Redo": "重做",
	"command.standard.Save": "保存",
	"command.standard.SelectAll": "全选",
	"command.standard.Share": "共享",
	"command.standard.Stop": "停止",
	"command.standard.Undo": "撤消",
	"text.accept": "确定",
	"text.aspect-ratio": "纵横比",
	"text.back": "后退",
	"text.b": "B",
	"text.bold": "加粗",
	"text.breadcrumb": "面包屑",
	"text.bullets": "项目符号",
	"text.c": "C#",
	"text.camera-api-is-not-available-in-this-browser": "此浏览器不支持摄像头 API。",
	"text.camera-permission-was-denied": "摄像头权限被拒绝。",
	"text.captured": "已捕获：",
	"text.cast": "投放",
	"text.clear-formatting": "清除格式",
	"text.clear-text": "清除文本",
	"text.close": "关闭",
	"text.close-overflow-menu": "关闭溢出菜单",
	"text.command-bar": "命令栏",
	"text.copy": "复制",
	"text.cut": "剪切",
	"text.g": "G",
	"text.hue": "色相",
	"text.integrated-camera": "内置摄像头",
	"text.italic": "斜体",
	"text.more": "更多",
	"text.more-options": "更多选项",
	"text.less-app-bar": "更少应用栏",
	"text.see-more": "查看更多",
	"text.see-less": "查看更少",
	"text.mute": "静音",
	"text.media-failed": "媒体加载失败。",
	"text.media-transport-controls": "媒体传输控件",
	"text.navigation-menu": "导航菜单",
	"text.open-navigation": "打开导航",
	"text.close-navigation": "关闭导航",
	"text.next": "下一项",
	"text.navigationview": "导航视图",
	"text.navigationview-description": "NavigationView 控件通过可折叠导航菜单，为应用的顶级区域提供通用的垂直布局。",
	"sample.navigationview.default-header": "使用默认 PaneDisplayMode 的 NavigationView",
	"sample.navigationview.top-header": "将 PaneDisplayMode 设置为 Top 的 NavigationView",
	"sample.navigationview.adaptive-header": "根据窗口宽度切换窗格方向的 NavigationView",
	"sample.navigationview.tabs-header": "关联选择与焦点 - 选项卡",
	"sample.navigationview.data-binding-header": "数据绑定",
	"sample.navigationview.footer-header": "带页脚菜单项的 NavigationView",
	"sample.navigationview.hierarchical-header": "层级 NavigationView",
	"sample.navigationview.api-header": "API 实际应用",
	"sample.navigationview.default-description": "如果有五个或更多同等重要的导航类别，且这些类别应在较大的窗口宽度下突出显示，请考虑使用左侧导航窗格。",
	"sample.navigationview.top-description": "如果有同等重要的导航类别，但相对于应用内容应弱化显示，请考虑使用顶部导航窗格。",
	"sample.navigationview.adaptive-description": "如果导航类别同等重要且应用内容空间有限，请考虑在较大的窗口宽度下使用顶部导航窗格，在较小的窗口宽度下使用最小化左侧导航窗格。",
	"sample.navigationview.tabs-description": "对于选项卡模式，请将 SelectionFollowsFocus 属性设置为 Enabled，使选择与焦点保持一致。如果使用 Frame 切换内容，则不应将项目之间的导航记录到 Frame 的导航堆栈中。请参阅下方示例中的 C# 代码了解具体做法。",
	"sample.navigationview.data-binding-description": "进行数据绑定时，请使用 MenuItemsSource 属性绑定可观察的项目集合，并且不要设置 MenuItems 属性。此外，请设置 MenuItemTemplate 属性并使用 NavigationViewItem 作为数据模板。如果还希望绑定标题内容，请通过 MenuItemTemplateSelector 属性使用数据模板选择器。",
	"sample.navigationview.footer-description": "可以向 NavigationView 的页脚添加可点击菜单项，这些项目与主菜单项目使用相同的选择模型。在 Top PaneDisplayMode 中，这些项目会在 NavigationView 右侧对齐；在 Left PaneDisplayMode 中，这些项目会在 NavigationView 底部对齐。",
	"sample.navigationview.hierarchy-description-1": "NavigationView 在 Left、LeftCompact 和 Top 显示模式中支持层级结构。",
	"sample.navigationview.hierarchy-description-2": "在下面的示例中，“帐户”选项卡会导航到自己的页面，而“文档选项”只会展开其子项目。实现方式是将“文档选项”NavigationView 项的 SelectsOnInvoked 属性设置为 false。",
	"sample.navigationview.hierarchy-description-3": "在 Top 和 Left 模式中，点击 NavigationViewItem 上的箭头会展开或折叠子树。点击或轻触 NavigationViewItem 的其他位置也会折叠或展开子树。",
	"sample.navigationview.hierarchy-description-4": "请在右侧切换三种窗格显示模式。",
	"sample.navigationview.header-text": "这是标题文本",
	"sample.navigationview.menu-item-1": "菜单项 1",
	"sample.navigationview.menu-item-2": "菜单项 2",
	"sample.navigationview.menu-item-3": "菜单项 3",
	"sample.navigationview.menu-item-4": "菜单项 4",
	"sample.navigationview.item-1": "项目 1",
	"sample.navigationview.item-2": "项目 2",
	"sample.navigationview.item-3": "项目 3",
	"sample.navigationview.item-4": "项目 4",
	"sample.navigationview.sample-page": "示例页面 {number}",
	"sample.navigationview.settings-page": "示例设置页",
	"sample.navigationview.lorem-title": "这是示例页面的标题内容",
	"sample.navigationview.lorem-body": "这是用于展示页面布局的示例正文。它用于说明内容在不同窗口宽度和导航窗格状态下如何排列、换行与滚动，并确保页面底部内容始终可以完整查看。",
	"sample.navigationview.category": "类别 {number}",
	"sample.navigationview.category-tooltip": "这是类别 {number}",
	"sample.navigationview.browse": "浏览",
	"sample.navigationview.track-order": "跟踪订单",
	"sample.navigationview.order-history": "订单历史记录",
	"sample.navigationview.account": "帐户",
	"sample.navigationview.your-cart": "购物车",
	"sample.navigationview.help": "帮助",
	"sample.navigationview.pane-position": "窗格位置：",
	"sample.navigationview.pane-position-property": "窗格位置：",
	"sample.navigationview.left-mode": "Left 模式",
	"sample.navigationview.top-mode": "Top 模式",
	"sample.navigationview.left-compact-mode": "LeftCompact 模式",
	"sample.navigationview.home": "主页",
	"sample.navigationview.mail": "邮件",
	"sample.navigationview.calendar": "日历",
	"sample.navigationview.document-options": "文档选项",
	"sample.navigationview.create-new": "新建",
	"sample.navigationview.upload-file": "上传文件",
	"sample.navigationview.settings-visible": "显示设置项",
	"sample.navigationview.back-visible": "显示后退按钮",
	"sample.navigationview.back-enabled": "启用后退按钮",
	"sample.navigationview.autosuggest-visible": "显示 AutoSuggestBox",
	"sample.navigationview.header-label": "Header：",
	"sample.navigationview.header-value": "标题",
	"sample.navigationview.always-show-header": "始终显示标题",
	"sample.navigationview.pane-title-label": "PaneTitle：",
	"sample.navigationview.pane-title-value": "窗格标题",
	"sample.navigationview.pane-custom-visible": "显示 PaneCustomContent",
	"sample.navigationview.pane-footer-visible": "显示 PaneFooter",
	"sample.navigationview.left": "Left",
	"sample.navigationview.top": "Top",
	"sample.navigationview.keyboard-selection-follows-focus": "键盘 SelectionFollowsFocus",
	"sample.navigationview.suppress-menu-item-2": "禁止选择菜单项 2",
	"sample.navigationview.actions": "操作",
	"sample.navigationview.more-info": "更多信息",
	"sample.navigationview.search": "搜索",
	"sample.navigationview.download": "下载",
	"sample.navigationview.favorite": "收藏",
	"sample.navigationview.change-theme": "切换主题",
	"sample.navigationview.add-favorite": "添加到收藏",
	"sample.navigationview.remove-favorite": "从收藏中移除",
	"text.numbering": "编号",
	"text.off": "关",
	"text.on": "开",
	"sample.opacity": "不透明度",
	"text.paste": "粘贴",
	"text.pause": "暂停",
	"text.play": "播放",
	"text.previous": "上一项",
	"text.r": "R",
	"text.redo": "重做",
	"text.requesting-camera-permission": "正在请求摄像头权限...",
	"text.reveal-password": "显示密码",
	"text.scroll-left": "向左滚动",
	"text.scroll-right": "向右滚动",
	"text.search": "搜索",
	"text.select": "选择...",
	"text.select-all": "全选",
	"text.full-screen": "全屏",
	"text.exit-full-screen": "退出全屏",
	"text.settings": "设置",
	"text.source-code": "源代码",
	"text.saturation": "饱和度",
	"text.submit-query": "提交查询",
	"text.switch-to-zoomed-out-view": "切换到缩小视图",
	"text.cancel": "取消",
	"text.unable-to-start-the-camera": "无法启动摄像头。",
	"text.underline": "下划线",
	"text.undo": "撤消",
	"text.unmute": "取消静音",
	"text.value": "明度",
	"text.volume": "音量",
	"text.vue": "Vue",
	"text.xaml": "XAML",
	"control.infobadge.value": "{value} 条通知",
	"control.infobadge.icon": "通知",
	"control.infobadge.dot": "新通知",
	"control.infobar.close-button-name": "关闭",
	"control.infobar.close-button-tooltip": "关闭"
}, Qe = Symbol.for("WinUIonWeb.i18n"), $e = {
	"en-US": Xe,
	"zh-CN": Ze
}, et = (e) => (e || "en-US").toLowerCase().startsWith("zh") ? "zh-CN" : "en-US", tt = (e, t) => t ? e.replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? "")) : e, nt = (e = navigator.language, t) => {
	let n = et(e), r = {
		...$e[n],
		...t?.[n]
	}, i = {
		...$e["en-US"],
		...t?.["en-US"]
	};
	return {
		locale: n,
		t: (e, t) => tt(r[e] ?? i[e] ?? e, t)
	};
}, rt = () => v(Qe, nt("en-US")), it = {
	Cut: {
		Symbol: "Cut",
		KeyboardAccelerators: [{
			Key: "X",
			Modifiers: ["Control"]
		}]
	},
	Copy: {
		Symbol: "Copy",
		KeyboardAccelerators: [{
			Key: "C",
			Modifiers: ["Control"]
		}]
	},
	Paste: {
		Symbol: "Paste",
		KeyboardAccelerators: [{
			Key: "V",
			Modifiers: ["Control"]
		}]
	},
	SelectAll: {
		Symbol: "SelectAll",
		KeyboardAccelerators: [{
			Key: "A",
			Modifiers: ["Control"]
		}]
	},
	Delete: {
		Symbol: "Delete",
		KeyboardAccelerators: [{ Key: "Delete" }]
	},
	Share: {
		Symbol: "Share",
		KeyboardAccelerators: []
	},
	Save: {
		Symbol: "Save",
		KeyboardAccelerators: [{
			Key: "S",
			Modifiers: ["Control"]
		}]
	},
	Open: {
		Symbol: "OpenFile",
		KeyboardAccelerators: [{
			Key: "O",
			Modifiers: ["Control"]
		}]
	},
	Close: {
		Symbol: "Cancel",
		KeyboardAccelerators: [{
			Key: "W",
			Modifiers: ["Control"]
		}]
	},
	Pause: {
		Symbol: "Pause",
		KeyboardAccelerators: []
	},
	Play: {
		Symbol: "Play",
		KeyboardAccelerators: []
	},
	Stop: {
		Symbol: "Stop",
		KeyboardAccelerators: []
	},
	Forward: {
		Symbol: "Forward",
		KeyboardAccelerators: []
	},
	Backward: {
		Symbol: "Back",
		KeyboardAccelerators: []
	},
	Undo: {
		Symbol: "Undo",
		KeyboardAccelerators: [{
			Key: "Z",
			Modifiers: ["Control"]
		}]
	},
	Redo: {
		Symbol: "Redo",
		KeyboardAccelerators: [{
			Key: "Y",
			Modifiers: ["Control"]
		}]
	}
}, at = (e) => {
	let t = et(typeof document < "u" ? document.documentElement.lang : typeof navigator < "u" ? navigator.language : "en-US"), n = `command.standard.${e}`;
	return $e[t][n] ?? $e["en-US"][n] ?? e;
}, ot = class extends Ye {
	Kind;
	constructor(e, t = {}) {
		let n = e === "None" ? void 0 : it[e], r = e === "None" ? void 0 : at(e);
		super({
			Label: r,
			Description: r,
			IconSource: n ? { Symbol: n.Symbol } : void 0,
			KeyboardAccelerators: n?.KeyboardAccelerators,
			...t
		}), this.Kind = e;
	}
};
//#endregion
//#region src/components/TitleBarDragRegion.ts
function st(e, t) {
	e && (t === !0 || t === !1 ? e.setAttribute("IsDragRegion", String(t)) : e.removeAttribute("IsDragRegion"));
}
function ct(e) {
	if (!e || typeof e.getAttribute != "function") return null;
	let t = e.getAttribute("IsDragRegion");
	return t === null ? null : t === "true" ? !0 : t === "false" ? !1 : null;
}
function lt(e) {
	e && e.removeAttribute("IsDragRegion");
}
//#endregion
//#region src/components/Grid.vue?vue&type=script&setup=true&lang.ts
var ut = /*@__PURE__*/ h({
	__name: "Grid",
	props: {
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		MaxHeight: {
			type: [String, Number],
			default: ""
		},
		Background: {
			type: String,
			default: ""
		},
		BackgroundSizing: {
			type: String,
			default: ""
		},
		BorderBrush: {
			type: String,
			default: ""
		},
		BorderThickness: {
			type: [String, Number],
			default: ""
		},
		CornerRadius: {
			type: [String, Number],
			default: ""
		},
		Padding: {
			type: [String, Number],
			default: ""
		},
		Margin: {
			type: [String, Number],
			default: ""
		},
		ColumnDefinitions: {
			type: [
				String,
				Array,
				Object
			],
			default: ""
		},
		RowDefinitions: {
			type: [
				String,
				Array,
				Object
			],
			default: ""
		},
		ColumnSpacing: {
			type: [String, Number],
			default: 0
		},
		RowSpacing: {
			type: [String, Number],
			default: 0
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	setup(e) {
		let t = e, n = A(null), r = A([]), i = A([]);
		O(ye, { registerDefinition: (e, t) => {
			let n = e === "columns" ? r : i;
			return n.value = [...n.value, t], () => {
				n.value = n.value.filter((e) => e !== t);
			};
		} });
		let a = (e, t) => {
			if (typeof e == "object" && e) {
				let n = e[t];
				return n === void 0 || n === "" ? "auto" : String(n);
			}
			return String(e ?? "auto");
		}, s = (e, t) => (Array.isArray(e) ? e : e && typeof e == "object" ? [e] : String(e ?? "").split(/[;,]/).map((e) => e.trim()).filter(Boolean)).map((e) => {
			let n = typeof e == "object" && e ? e : null, r = t === "Width" ? "MinWidth" : "MinHeight", i = t === "Width" ? "MaxWidth" : "MaxHeight", o = n?.[r] ? xe(n[r]) : "0px", s = n?.[i] ? xe(n[i]) : "", c = a(e, t).trim();
			if (!c || c.toLowerCase() === "auto") return o !== "0px" || s ? `minmax(${o}, ${s || "auto"})` : "auto";
			if (c === "*") return `minmax(${o}, ${s || "1fr"})`;
			let l = c.match(/^([0-9]+(?:\.[0-9]+)?)\s*\*$/);
			if (l) return `minmax(${o}, ${s || `${l[1]}fr`})`;
			let u = xe(c);
			return o !== "0px" || s ? `minmax(${o}, ${s || u})` : u;
		}).join(" "), c = o(() => {
			let e = {};
			for (let [n, r] of Object.entries({
				Width: t.Width,
				Height: t.Height,
				MinWidth: t.MinWidth,
				MinHeight: t.MinHeight,
				MaxWidth: t.MaxWidth,
				MaxHeight: t.MaxHeight
			})) r !== "" && (e[n.charAt(0).toLowerCase() + n.slice(1)] = xe(r));
			t.Background && (e.background = t.Background), t.BorderBrush && (e.borderColor = t.BorderBrush), t.BorderThickness !== "" && (e.borderWidth = xe(t.BorderThickness)), (t.BorderBrush || t.BorderThickness !== "") && (e.borderStyle = "solid"), t.CornerRadius !== "" && (e.borderRadius = xe(t.CornerRadius)), t.Padding !== "" && (e.padding = Se(t.Padding)), t.Margin !== "" && (e.margin = Se(t.Margin));
			let n = r.value.length ? s(r.value, "Width") : s(t.ColumnDefinitions, "Width"), a = i.value.length ? s(i.value, "Height") : s(t.RowDefinitions, "Height");
			return n && (e.gridTemplateColumns = n), a && (e.gridTemplateRows = a), t.ColumnSpacing !== "" && (e.columnGap = xe(t.ColumnSpacing)), t.RowSpacing !== "" && (e.rowGap = xe(t.RowSpacing)), t.HorizontalAlignment && (e.justifySelf = Ce(t.HorizontalAlignment, "horizontal")), t.VerticalAlignment && (e.alignSelf = Ce(t.VerticalAlignment, "vertical")), e;
		});
		return Le(n, () => {
			n.value && je(n.value);
		}), (e, t) => (D(), l("div", {
			ref_key: "root",
			ref: n,
			class: "win-grid",
			style: C(c.value)
		}, [M(e.$slots, "default", {}, void 0, !0)], 4));
	}
}), dt = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, ft = /*#__PURE__*/ dt(ut, [["__scopeId", "data-v-074264d6"]]), pt = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "StackPanel",
	props: {
		Orientation: {
			type: String,
			default: "Vertical"
		},
		Spacing: {
			type: [String, Number],
			default: 0
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		MaxHeight: {
			type: [String, Number],
			default: ""
		},
		Background: {
			type: String,
			default: ""
		},
		BackgroundSizing: {
			type: String,
			default: ""
		},
		BorderBrush: {
			type: String,
			default: ""
		},
		BorderThickness: {
			type: [String, Number],
			default: ""
		},
		CornerRadius: {
			type: [String, Number],
			default: ""
		},
		Padding: {
			type: [String, Number],
			default: ""
		},
		Margin: {
			type: [String, Number],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	setup(e) {
		let t = e, n = A(null), r = o(() => {
			let e = {
				flexDirection: t.Orientation === "Horizontal" ? "row" : "column",
				gap: xe(t.Spacing),
				alignItems: "stretch"
			};
			for (let [n, r] of Object.entries({
				Width: t.Width,
				Height: t.Height,
				MinWidth: t.MinWidth,
				MinHeight: t.MinHeight,
				MaxWidth: t.MaxWidth,
				MaxHeight: t.MaxHeight
			})) r !== "" && (e[n.charAt(0).toLowerCase() + n.slice(1)] = xe(r));
			return t.Background && (e.background = t.Background), t.BorderBrush && (e.borderColor = t.BorderBrush), t.BorderThickness !== "" && (e.borderWidth = xe(t.BorderThickness)), (t.BorderBrush || t.BorderThickness !== "") && (e.borderStyle = "solid"), t.CornerRadius !== "" && (e.borderRadius = xe(t.CornerRadius)), t.Padding !== "" && (e.padding = Se(t.Padding)), t.Margin !== "" && (e.margin = Se(t.Margin)), t.HorizontalAlignment && (e.justifySelf = Ce(t.HorizontalAlignment, "horizontal")), t.VerticalAlignment && (e.alignSelf = Ce(t.VerticalAlignment, "vertical")), e;
		});
		return Le(n, () => {
			n.value && Me(n.value, t.Orientation);
		}), (e, t) => (D(), l("div", {
			class: "win-stack-panel",
			style: C(r.value)
		}, [M(e.$slots, "default", {}, void 0, !0)], 4));
	}
}), [["__scopeId", "data-v-0f6b528b"]]), mt = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "RelativePanel",
	props: {
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		MaxHeight: {
			type: [String, Number],
			default: ""
		},
		Background: {
			type: String,
			default: ""
		},
		BackgroundSizing: {
			type: String,
			default: ""
		},
		BorderBrush: {
			type: String,
			default: ""
		},
		BorderThickness: {
			type: [String, Number],
			default: ""
		},
		CornerRadius: {
			type: [String, Number],
			default: ""
		},
		Padding: {
			type: [String, Number],
			default: ""
		},
		Margin: {
			type: [String, Number],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	setup(e) {
		let t = e, n = A(null), r = o(() => {
			let e = {};
			for (let [n, r] of Object.entries({
				Width: t.Width,
				Height: t.Height,
				MinWidth: t.MinWidth,
				MinHeight: t.MinHeight,
				MaxWidth: t.MaxWidth,
				MaxHeight: t.MaxHeight
			})) r !== "" && (e[n.charAt(0).toLowerCase() + n.slice(1)] = xe(r));
			return t.Background && (e.background = t.Background), t.BorderBrush && (e.borderColor = t.BorderBrush), t.BorderThickness !== "" && (e.borderWidth = xe(t.BorderThickness)), (t.BorderBrush || t.BorderThickness !== "") && (e.borderStyle = "solid"), t.CornerRadius !== "" && (e.borderRadius = xe(t.CornerRadius)), t.Padding !== "" && (e.padding = Se(t.Padding)), t.Margin !== "" && (e.margin = Se(t.Margin)), t.HorizontalAlignment && (e.justifySelf = Ce(t.HorizontalAlignment, "horizontal")), t.VerticalAlignment && (e.alignSelf = Ce(t.VerticalAlignment, "vertical")), e;
		});
		return Le(n, () => {
			n.value && Fe(n.value);
		}), (e, t) => (D(), l("div", {
			class: "win-relative-panel",
			style: C(r.value)
		}, [M(e.$slots, "default", {}, void 0, !0)], 4));
	}
}), [["__scopeId", "data-v-558ac6de"]]), ht = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "VariableSizedWrapGrid",
	props: {
		Orientation: {
			type: String,
			default: "Vertical"
		},
		ItemWidth: {
			type: [String, Number],
			default: 44
		},
		ItemHeight: {
			type: [String, Number],
			default: 44
		},
		MaximumRowsOrColumns: {
			type: [String, Number],
			default: -1
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		MaxHeight: {
			type: [String, Number],
			default: ""
		},
		Background: {
			type: String,
			default: ""
		},
		Padding: {
			type: [String, Number],
			default: ""
		},
		Margin: {
			type: [String, Number],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		},
		HorizontalChildrenAlignment: {
			type: String,
			default: "Stretch"
		},
		VerticalChildrenAlignment: {
			type: String,
			default: "Stretch"
		}
	},
	setup(e) {
		let t = e, n = A(null), r = o(() => t.Orientation === "Horizontal" ? "orientation-horizontal" : "orientation-vertical"), i = o(() => {
			let e = Number(t.MaximumRowsOrColumns), n = Number.isFinite(e) && e > 0, r = t.Orientation === "Horizontal", i = {
				"--vsg-item-width": xe(t.ItemWidth),
				"--vsg-item-height": xe(t.ItemHeight)
			};
			for (let [e, n] of Object.entries({
				Width: t.Width,
				Height: t.Height,
				MinWidth: t.MinWidth,
				MinHeight: t.MinHeight,
				MaxWidth: t.MaxWidth,
				MaxHeight: t.MaxHeight
			})) n !== "" && (i[e.charAt(0).toLowerCase() + e.slice(1)] = xe(n));
			return t.Background && (i.background = t.Background), t.Padding !== "" && (i.padding = Se(t.Padding)), t.Margin !== "" && (i.margin = Se(t.Margin)), t.HorizontalAlignment && (i.justifySelf = Ce(t.HorizontalAlignment, "horizontal")), t.VerticalAlignment && (i.alignSelf = Ce(t.VerticalAlignment, "vertical")), r ? (i.gridAutoFlow = "row", i.gridAutoColumns = "var(--vsg-item-width)", n && (i.gridTemplateColumns = `repeat(${e}, var(--vsg-item-width))`)) : (i.gridAutoFlow = "column", i.gridAutoRows = "var(--vsg-item-height)", n && (i.gridTemplateRows = `repeat(${e}, var(--vsg-item-height))`)), i;
		});
		return Le(n, () => {
			n.value && Ie(n.value);
		}), (e, t) => (D(), l("div", {
			class: S(["win-variable-sized-wrap-grid", r.value]),
			style: C(i.value)
		}, [M(e.$slots, "default", {}, void 0, !0)], 6));
	}
}), [["__scopeId", "data-v-503824ed"]]), gt = /* @__PURE__ */ h({
	inheritAttrs: !1,
	__name: "Border",
	props: {
		Background: {
			type: [String, Object],
			default: ""
		},
		BorderBrush: {
			type: [String, Object],
			default: ""
		},
		BorderThickness: {
			type: [String, Number],
			default: ""
		},
		CornerRadius: {
			type: [String, Number],
			default: ""
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		MaxHeight: {
			type: [String, Number],
			default: ""
		},
		Margin: {
			type: [String, Number],
			default: ""
		},
		Padding: {
			type: [String, Number],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	setup(e) {
		let t = e, n = te(), r = g(), i = (e) => {
			let t = $(e, r);
			return t === "" || t == null ? "" : typeof t == "number" || /^-?\d+(?:\.\d+)?$/.test(String(t).trim()) ? `${t}px` : String(t);
		}, a = (e) => {
			let t = $(e, r);
			if (t === "" || t == null) return "";
			let n = String(t).split(",").map((e) => i(e.trim()));
			return n.length === 1 ? n[0] : n.length === 2 ? `${n[1]} ${n[0]}` : n.length === 4 ? `${n[1]} ${n[2]} ${n[3]} ${n[0]}` : String(t);
		}, s = (e) => {
			let t = $(e, r);
			if (t === "" || t == null) return "";
			let n = String(t).split(",").map((e) => i(e.trim()));
			return n.length > 1 ? n.join(" ") : n[0];
		}, c = (e, t) => {
			let n = String($(e, r) || "");
			return (t === "horizontal" ? {
				Left: "flex-start",
				Center: "center",
				Right: "flex-end",
				Stretch: "stretch"
			} : {
				Top: "flex-start",
				Center: "center",
				Bottom: "flex-end",
				Stretch: "stretch"
			})[n] || "";
		}, u = o(() => {
			let { class: e, style: t, ...r } = n;
			return r;
		}), d = o(() => {
			let e = {}, o = $(t.Background, r), l = $(t.BorderBrush, r);
			o && (e.background = String(o)), l && (e.borderColor = String(l), e.borderStyle = "solid"), t.BorderThickness !== "" && (e.borderWidth = i(t.BorderThickness), e.borderStyle = "solid"), t.CornerRadius !== "" && (e.borderRadius = s(t.CornerRadius));
			for (let [n, r] of Object.entries({
				Width: t.Width,
				Height: t.Height,
				MinWidth: t.MinWidth,
				MinHeight: t.MinHeight,
				MaxWidth: t.MaxWidth,
				MaxHeight: t.MaxHeight
			})) {
				let t = i(r);
				t && (e[n.charAt(0).toLowerCase() + n.slice(1)] = t);
			}
			return t.Margin !== "" && (e.margin = a(t.Margin)), t.Padding !== "" && (e.padding = a(t.Padding)), t.HorizontalAlignment && (e.alignSelf = c(t.HorizontalAlignment, "horizontal")), t.VerticalAlignment && (e.alignSelf = c(t.VerticalAlignment, "vertical")), [n.style, e];
		});
		return (e, t) => (D(), l("div", b(u.value, {
			class: ["win-border", z(n).class],
			style: d.value
		}), [M(e.$slots, "default")], 16));
	}
}), _t = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "Canvas",
	props: {
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		MaxHeight: {
			type: [String, Number],
			default: ""
		},
		Background: {
			type: String,
			default: ""
		},
		BackgroundSizing: {
			type: String,
			default: ""
		},
		BorderBrush: {
			type: String,
			default: ""
		},
		BorderThickness: {
			type: [String, Number],
			default: ""
		},
		CornerRadius: {
			type: [String, Number],
			default: ""
		},
		Padding: {
			type: [String, Number],
			default: ""
		},
		Margin: {
			type: [String, Number],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	setup(e) {
		let t = e, n = A(null), r = o(() => {
			let e = {};
			for (let [n, r] of Object.entries({
				Width: t.Width,
				Height: t.Height,
				MinWidth: t.MinWidth,
				MinHeight: t.MinHeight,
				MaxWidth: t.MaxWidth,
				MaxHeight: t.MaxHeight
			})) r !== "" && (e[n.charAt(0).toLowerCase() + n.slice(1)] = xe(r));
			return t.Background && (e.background = t.Background), t.BorderBrush && (e.borderColor = t.BorderBrush), t.BorderThickness !== "" && (e.borderWidth = xe(t.BorderThickness)), (t.BorderBrush || t.BorderThickness !== "") && (e.borderStyle = "solid"), t.CornerRadius !== "" && (e.borderRadius = xe(t.CornerRadius)), t.Padding !== "" && (e.padding = Se(t.Padding)), t.Margin !== "" && (e.margin = Se(t.Margin)), t.HorizontalAlignment && (e.justifySelf = Ce(t.HorizontalAlignment, "horizontal")), t.VerticalAlignment && (e.alignSelf = Ce(t.VerticalAlignment, "vertical")), e;
		});
		return Le(n, () => {
			n.value && Ne(n.value);
		}), (e, t) => (D(), l("div", {
			class: "win-canvas",
			style: C(r.value)
		}, [M(e.$slots, "default", {}, void 0, !0)], 4));
	}
}), [["__scopeId", "data-v-863d864a"]]), vt = /* @__PURE__ */ h({
	inheritAttrs: !1,
	__name: "Rectangle",
	props: {
		Fill: {
			type: [String, Object],
			default: ""
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		RadiusX: {
			type: [String, Number],
			default: ""
		},
		RadiusY: {
			type: [String, Number],
			default: ""
		},
		Margin: {
			type: [String, Number],
			default: ""
		}
	},
	setup(e) {
		let t = e, n = te(), r = g(), i = (e) => {
			let t = $(e, r);
			return t === "" || t == null ? "" : /^-?\d+(?:\.\d+)?$/.test(String(t).trim()) ? `${t}px` : String(t);
		}, a = o(() => {
			let { class: e, style: t, ...r } = n;
			return r;
		}), s = o(() => {
			let e = $(t.Fill, r), a = i(t.RadiusX), o = i(t.RadiusY);
			return [n.style, {
				width: i(t.Width) || void 0,
				height: i(t.Height) || void 0,
				margin: i(t.Margin) || void 0,
				background: e ? String(e) : void 0,
				borderRadius: a || o ? `${a || o} ${o || a}` : void 0
			}];
		});
		return (e, t) => (D(), l("div", b({
			class: "win-rectangle",
			style: s.value
		}, a.value), null, 16));
	}
}), yt = /*#__PURE__*/ dt({
	__name: "Viewbox",
	props: {
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		Stretch: {
			type: String,
			default: "Uniform"
		},
		StretchDirection: {
			type: String,
			default: "Both"
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	setup(e) {
		let t = e, n = A(null), r = A(null), i = A(1), a = A(1), s, c = [], d = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, f = o(() => {
			let e = {};
			return t.Width !== "" && (e.width = d(t.Width)), t.Height !== "" && (e.height = d(t.Height)), t.HorizontalAlignment && (e.justifySelf = t.HorizontalAlignment.toLowerCase()), t.VerticalAlignment && (e.alignSelf = t.VerticalAlignment.toLowerCase()), e;
		}), p = (e) => t.StretchDirection === "UpOnly" ? Math.max(1, e) : t.StretchDirection === "DownOnly" ? Math.min(1, e) : e, m = o(() => {
			let e = n.value, r = e?.clientWidth || Number(t.Width) || i.value, o = e?.clientHeight || Number(t.Height) || a.value, s = r / i.value, c = o / a.value, l = "none";
			return t.Stretch === "Fill" ? l = `scale(${p(s)}, ${p(c)})` : t.Stretch === "Uniform" ? l = `scale(${p(Math.min(s, c))})` : t.Stretch === "UniformToFill" && (l = `scale(${p(Math.max(s, c))})`), {
				width: `${i.value}px`,
				height: `${a.value}px`,
				transform: l,
				transformOrigin: "0 0"
			};
		}), h = () => {
			let e = r.value;
			if (!e) return;
			let t = e.style.transform;
			e.style.transform = "none", i.value = Math.max(1, e.scrollWidth || e.offsetWidth), a.value = Math.max(1, e.scrollHeight || e.offsetHeight), e.style.transform = t;
		}, g = () => {
			(r.value?.querySelectorAll?.("img") ?? []).forEach((e) => {
				let t = () => void x(h);
				e.addEventListener("load", t, { once: !0 }), c.push([e, t]);
			});
		};
		return ee(async () => {
			await x(), h(), g(), s = new ResizeObserver(h), r.value && s.observe(r.value), n.value && s.observe(n.value);
		}), w(() => {
			s?.disconnect(), c.forEach(([e, t]) => e.removeEventListener("load", t));
		}), V(() => [
			t.Stretch,
			t.StretchDirection,
			t.Width,
			t.Height
		], () => {
			x(h);
		}), (e, t) => (D(), l("div", {
			ref_key: "rootRef",
			ref: n,
			class: "win-viewbox",
			style: C(f.value)
		}, [u("div", {
			ref_key: "contentRef",
			ref: r,
			class: "win-viewbox-content",
			style: C(m.value)
		}, [M(e.$slots, "default", {}, void 0, !0)], 4)], 4));
	}
}, [["__scopeId", "data-v-65f36990"]]), bt = {
	class: "win-grid-definitions",
	"aria-hidden": "true"
}, xt = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "GridDefinitions",
	props: { axis: {} },
	setup(e) {
		return (e, t) => (D(), l("span", bt, [M(e.$slots, "default", {}, void 0, !0)]));
	}
}), [["__scopeId", "data-v-0d81ff2a"]]), St = /* @__PURE__ */ h({
	__name: "GridColumnDefinitions",
	setup(e) {
		return (e, t) => (D(), s(xt, { axis: "columns" }, {
			default: H(() => [M(e.$slots, "default")]),
			_: 3
		}));
	}
}), Ct = /* @__PURE__ */ h({
	__name: "GridRowDefinitions",
	setup(e) {
		return (e, t) => (D(), s(xt, { axis: "rows" }, {
			default: H(() => [M(e.$slots, "default")]),
			_: 3
		}));
	}
}), wt = {
	class: "win-definition",
	"aria-hidden": "true"
}, Tt = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "ColumnDefinition",
	props: {
		Width: {
			type: [String, Number],
			default: "*"
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		}
	},
	setup(e) {
		let t = e, n = v(ye, null), r = {
			Width: t.Width,
			MinWidth: t.MinWidth,
			MaxWidth: t.MaxWidth
		}, i;
		return ee(() => {
			i = n?.registerDefinition("columns", r);
		}), w(() => i?.()), (e, t) => (D(), l("span", wt));
	}
}), [["__scopeId", "data-v-44fd6a01"]]), Et = {
	class: "win-definition",
	"aria-hidden": "true"
}, Dt = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "RowDefinition",
	props: {
		Height: {
			type: [String, Number],
			default: "*"
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		MaxHeight: {
			type: [String, Number],
			default: ""
		}
	},
	setup(e) {
		let t = e, n = v(ye, null), r = {
			Height: t.Height,
			MinHeight: t.MinHeight,
			MaxHeight: t.MaxHeight
		}, i;
		return ee(() => {
			i = n?.registerDefinition("rows", r);
		}), w(() => i?.()), (e, t) => (D(), l("span", Et));
	}
}), [["__scopeId", "data-v-62bae243"]]), Ot = ["tabindex"], kt = {
	key: 2,
	class: "scrollbar-corner"
}, At = 0, jt = 16, Mt = .9995, Nt = 7.600855902349023, Pt = .001, Ft = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "ScrollViewer",
	props: {
		ZoomMode: { default: "Disabled" },
		MinZoomFactor: { default: .1 },
		MaxZoomFactor: { default: 10 },
		ZoomFactor: { default: 1 },
		HorizontalScrollMode: { default: "Auto" },
		VerticalScrollMode: { default: "Auto" },
		HorizontalScrollBarVisibility: { default: "Auto" },
		VerticalScrollBarVisibility: { default: "Auto" },
		IsVerticalScrollChainingEnabled: {
			type: Boolean,
			default: !0
		},
		IsHorizontalScrollChainingEnabled: {
			type: Boolean,
			default: !0
		},
		IsTabStop: {
			type: Boolean,
			default: !1
		},
		Width: { default: NaN },
		Height: { default: NaN },
		HorizontalAlignment: { default: "Stretch" },
		VerticalAlignment: { default: "Stretch" }
	},
	emits: [
		"ViewChanged",
		"ViewChanging",
		"DirectManipulationStarted",
		"DirectManipulationCompleted"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, a = A(), s = A(), d = A(), f = A(), p = A(), m = A(r.ZoomFactor), h = A(!1), g = A(!1), _ = A(!1), v = A(!1), y = A(!1), b = A(!1), T = A(!1), E = A(!1), O = A(), k = A(null), j = A(null), N = A(!1), P = A(!1), F = A(0), I = A(1), L = A(), R = A(), z = A(), te = A(), ne = A(), B = A(), H = A(), U = A(!1), W = A(!1), re = A(!1), K = A(!1), q = A(0), J = A(0), ie = A(0), Y = A(null), X = A(null), Z = A(null), ae = A(), Q = A(), oe = A(0), se = A(0), ce = A(null), le = A(null), ue = A(0), de = A(0), fe = A(0), $ = A(0), pe = A(0), me = A(0), he, ge = o(() => r.ZoomMode), _e = o(() => r.MinZoomFactor), ve = o(() => r.MaxZoomFactor), ye = o(() => r.ZoomFactor), be = o(() => r.HorizontalScrollMode), xe = o(() => r.VerticalScrollMode), Se = o(() => r.HorizontalScrollBarVisibility), Ce = o(() => r.VerticalScrollBarVisibility), we = o(() => r.IsVerticalScrollChainingEnabled), Te = o(() => r.IsHorizontalScrollChainingEnabled), Ee = o(() => r.IsTabStop), De = o(() => r.Width), Oe = o(() => r.Height), ke = o(() => r.HorizontalAlignment), Ae = o(() => r.VerticalAlignment), je = (e) => e != null && e !== "" && !(typeof e == "number" && Number.isNaN(e)), Me = (e) => typeof e == "number" || typeof e == "string" && /^-?\d+(?:\.\d+)?$/.test(e.trim()) ? `${Number(e)}px` : e, Ne = o(() => {
			let e = {};
			je(De.value) && (e.width = Me(De.value) ?? ""), je(Oe.value) && (e.height = Me(Oe.value) ?? "");
			let t = {
				Left: "flex-start",
				Center: "center",
				Right: "flex-end",
				Stretch: "stretch"
			}[ke.value];
			return e.justifySelf = t, e.alignSelf = t, Ae.value !== "Stretch" && (e.verticalAlign = {
				Top: "top",
				Center: "middle",
				Bottom: "bottom"
			}[Ae.value] ?? "top"), e;
		}), Pe = o(() => {
			let e = {}, t = He(be.value, Se.value), n = He(xe.value, Ce.value);
			return e.overflowX = t, e.overflowY = n, e;
		}), Fe = o(() => {
			let e = {}, t = Math.max(_e.value, Math.min(ve.value, m.value));
			return e.zoom = String(t), e.display = "block", e.width = "100%", e.minWidth = "0", e;
		}), Ie = o(() => (pe.value, Ce.value === "Disabled" || Ce.value === "Hidden" ? "hidden" : Ce.value === "Visible" ? "visible" : s.value && s.value.scrollHeight > s.value.clientHeight ? "auto" : "hidden")), Le = o(() => (pe.value, Se.value === "Disabled" || Se.value === "Hidden" ? "hidden" : Se.value === "Visible" ? "visible" : s.value && s.value.scrollWidth > s.value.clientWidth ? "auto" : "hidden")), Re = o(() => Ie.value !== "hidden"), ze = o(() => Le.value !== "hidden"), Be = o(() => {
			if (me.value, !s.value) return {};
			let e = s.value, t = Ke("vertical"), n = Math.max(30, e.clientHeight / e.scrollHeight * t.trackLength), r = Math.max(0, t.trackLength - n), i = Math.max(1, e.scrollHeight - e.clientHeight), a = t.trackStart + e.scrollTop / i * r;
			return {
				height: `${n}px`,
				transform: `translateY(${a}px)`
			};
		}), Ve = o(() => {
			if (me.value, !s.value) return {};
			let e = s.value, t = Ke("horizontal"), n = Math.max(30, e.clientWidth / e.scrollWidth * t.trackLength), r = Math.max(0, t.trackLength - n), i = Math.max(1, e.scrollWidth - e.clientWidth), a = t.trackStart + e.scrollLeft / i * r;
			return {
				width: `${n}px`,
				transform: `translateX(${a}px)`
			};
		});
		function He(e, t) {
			return e === "Disabled" || t === "Disabled" ? "hidden" : t === "Hidden" || t === "Visible" ? "scroll" : "auto";
		}
		function Ue(e) {
			if (!s.value) return;
			let t = {
				HorizontalOffset: s.value.scrollLeft,
				VerticalOffset: s.value.scrollTop,
				ZoomFactor: m.value
			};
			e && i("ViewChanging", {
				NextView: t,
				FinalView: t,
				IsInertial: !1
			}), i("ViewChanged", { IsIntermediate: e });
		}
		function We() {
			P.value || (P.value = !0, i("DirectManipulationStarted", {}));
		}
		function Ge() {
			P.value && (P.value = !1, i("DirectManipulationCompleted", {}));
		}
		function Ke(e) {
			let t = s.value;
			if (!t) return {
				trackStart: 0,
				trackLength: 0
			};
			let n = e === "vertical", r = (n ? f.value : p.value)?.getBoundingClientRect(), i = r ? n ? r.height : r.width : 0, a = n ? ze.value : Re.value, o = i || (n ? t.clientHeight : t.clientWidth), c = 12 + (a ? 12 : 0);
			return {
				trackStart: 12,
				trackLength: Math.max(30, o - 12 - c)
			};
		}
		function qe() {
			St(), Lt(), me.value += 1, We(), h.value = !0, L.value && clearTimeout(L.value), Ue(!0), L.value = window.setTimeout(() => {
				h.value = !1, Ue(!1), Ge();
			}, 150), Je();
		}
		function Je() {
			s.value && (_.value = Re.value, v.value = ze.value);
		}
		function Ye(e) {
			e === "vertical" ? (R.value && clearTimeout(R.value), te.value && clearTimeout(te.value), B.value && clearTimeout(B.value), R.value = void 0, te.value = void 0, B.value = void 0) : (z.value && clearTimeout(z.value), ne.value && clearTimeout(ne.value), H.value && clearTimeout(H.value), z.value = void 0, ne.value = void 0, H.value = void 0);
		}
		function Xe(e) {
			return e === "vertical" ? q.value : J.value;
		}
		function Ze(e) {
			return e === "vertical" ? (q.value += 1, q.value) : (J.value += 1, J.value);
		}
		function Qe(e) {
			let t = Ze(e);
			return Ye(e), e === "vertical" ? (T.value = !1, _.value = Re.value) : (E.value = !1, v.value = ze.value), me.value += 1, Je(), t;
		}
		function $e(e, t = Xe(e)) {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					if (t === Xe(e)) {
						if (e === "vertical") {
							if (!U.value && Z.value?.orientation !== "vertical" && !re.value) return;
							T.value = !1, y.value = Re.value;
						} else {
							if (!W.value && Z.value?.orientation !== "horizontal" && !K.value) return;
							E.value = !1, b.value = ze.value;
						}
						me.value += 1, Je();
					}
				});
			});
		}
		function et(e) {
			let t = Qe(e);
			return e === "vertical" ? y.value = Re.value : b.value = ze.value, me.value += 1, Je(), t;
		}
		function tt(e) {
			e.pointerType !== "mouse" && (ie.value = performance.now());
		}
		function nt() {
			return performance.now() - ie.value < 800;
		}
		function rt(e) {
			if (e.pointerType !== "mouse") try {
				navigator.vibrate?.(12);
			} catch {}
		}
		function it(e, t) {
			let n = t.currentTarget?.getBoundingClientRect();
			if (!n) return 0;
			if (e === "vertical") {
				let e = t.clientY - n.top;
				return e <= 12 ? -1 : +(e >= n.height - 12);
			}
			let r = t.clientX - n.left;
			return r <= 12 ? -1 : +(r >= n.width - 12);
		}
		function at(e, t) {
			t.pointerType === "mouse" && (nt() || (e === "vertical" ? U.value = !0 : W.value = !0, $e(e, Qe(e))));
		}
		function ot(e, t) {
			if (t.pointerType === "mouse" || (tt(t), t.target?.closest(".scrollbar-thumb, .scrollbar-button"))) return;
			rt(t);
			let n = it(e, t);
			if (n !== 0) {
				t.preventDefault(), ut(e, n, t);
				return;
			}
			et(e), t.preventDefault();
		}
		function st(e) {
			if (e === "vertical") {
				U.value = !1, !re.value && Z.value?.orientation !== "vertical" && ct("vertical");
				return;
			}
			W.value = !1, !K.value && Z.value?.orientation !== "horizontal" && ct("horizontal");
		}
		function ct(e) {
			let t = Ze(e), n = e === "vertical" ? te : ne;
			n.value && clearTimeout(n.value), n.value = window.setTimeout(() => {
				if (t === Xe(e)) {
					if (e === "vertical") {
						if (U.value || re.value || Z.value?.orientation === "vertical" || !y.value) return;
						B.value && clearTimeout(B.value), T.value = !0, y.value = !1, me.value += 1, B.value = window.setTimeout(() => {
							if (t === Xe(e)) {
								if (U.value || re.value || Z.value?.orientation === "vertical") {
									T.value = !1, y.value = Re.value;
									return;
								}
								T.value = !1, me.value += 1;
							}
						}, 667);
					} else {
						if (W.value || K.value || Z.value?.orientation === "horizontal" || !b.value) return;
						H.value && clearTimeout(H.value), E.value = !0, b.value = !1, me.value += 1, H.value = window.setTimeout(() => {
							if (t === Xe(e)) {
								if (W.value || K.value || Z.value?.orientation === "horizontal") {
									E.value = !1, b.value = ze.value;
									return;
								}
								E.value = !1, me.value += 1;
							}
						}, 667);
					}
					me.value += 1, Je();
				}
			}, At);
		}
		function lt(e, t, n = jt) {
			if (!s.value) return !1;
			let r = n * t, i = !1;
			return i = e === "vertical" ? _t(0, r, !0) : _t(r, 0, !0), i;
		}
		function ut(e, t, n) {
			if (s.value) {
				if (tt(n), rt(n), et(e), n.currentTarget?.setPointerCapture?.(n.pointerId), ft(), Z.value = {
					orientation: e,
					direction: t,
					lastTime: performance.now()
				}, !lt(e, t)) {
					Z.value = null;
					return;
				}
				document.addEventListener("pointerup", ft), document.addEventListener("pointercancel", ft), ae.value = requestAnimationFrame(dt);
			}
		}
		function dt(e) {
			let t = Z.value;
			if (!t) return;
			let n = Math.min(50, e - t.lastTime);
			if (t.lastTime = e, !lt(t.orientation, t.direction, 320 * n / 1e3)) {
				pt(!1);
				return;
			}
			ae.value = requestAnimationFrame(dt);
		}
		function ft() {
			pt(!0);
		}
		function pt(e) {
			let t = Z.value?.orientation;
			Z.value = null, ae.value !== void 0 && (cancelAnimationFrame(ae.value), ae.value = void 0), document.removeEventListener("pointerup", ft), document.removeEventListener("pointercancel", ft), e && (t === "vertical" && !U.value && !re.value && ct("vertical"), t === "horizontal" && !W.value && !K.value && ct("horizontal"));
		}
		function mt(e) {
			if (xt(), e.ctrlKey && ge.value !== "Disabled") {
				let t = -e.deltaY > 0 ? 1.1 : .9;
				Et(m.value * t), e.preventDefault(), e.stopPropagation();
				return;
			}
			if (!we.value && s.value) {
				let t = s.value.scrollTop === 0, n = s.value.scrollTop + s.value.clientHeight >= s.value.scrollHeight;
				(e.deltaY < 0 && t || e.deltaY > 0 && n) && e.preventDefault();
			}
			if (!Te.value && s.value) {
				let t = s.value.scrollLeft === 0, n = s.value.scrollLeft + s.value.clientWidth >= s.value.scrollWidth;
				(e.deltaX < 0 && t || e.deltaX > 0 && n) && e.preventDefault();
			}
		}
		function ht(e) {
			let t = e.deltaX, n = e.deltaY;
			return e.deltaMode === WheelEvent.DOM_DELTA_LINE ? (t *= 16, n *= 16) : e.deltaMode === WheelEvent.DOM_DELTA_PAGE && s.value && (t *= s.value.clientWidth, n *= s.value.clientHeight), {
				deltaX: t,
				deltaY: n
			};
		}
		function gt(e) {
			let { deltaX: t, deltaY: n } = ht(e);
			if (_t(t, n, !0)) {
				e.preventDefault(), e.stopPropagation();
				return;
			}
			let r = !we.value && n !== 0, i = !Te.value && t !== 0;
			(r || i) && (e.preventDefault(), e.stopPropagation());
		}
		function _t(e = 0, t = 0, n = !0) {
			let r = s.value;
			if (!r) return !1;
			let i = Math.max(0, r.scrollWidth - r.clientWidth), a = Math.max(0, r.scrollHeight - r.clientHeight), o = Q.value === void 0 ? r.scrollLeft : oe.value, c = Q.value === void 0 ? r.scrollTop : se.value, l = Math.max(0, Math.min(i, o + e)), u = Math.max(0, Math.min(a, c + t));
			l - 0 < Pt && (l = 0), i - l < Pt && (l = i), u - 0 < Pt && (u = 0), a - u < Pt && (u = a);
			let d = e !== 0 && (Math.abs(l - r.scrollLeft) > .01 || Math.abs(l - oe.value) > .01), f = t !== 0 && (Math.abs(u - r.scrollTop) > .01 || Math.abs(u - se.value) > .01);
			return d || f ? (It(), oe.value = l, se.value = u, n ? vt() : (r.scrollLeft = l, r.scrollTop = u, me.value += 1, Je(), Ue(!1)), !0) : !1;
		}
		function vt() {
			s.value && (N.value = !0, Q.value === void 0 && (Q.value = requestAnimationFrame(yt)));
		}
		function yt() {
			let e = s.value;
			if (!e) {
				bt();
				return;
			}
			let t = oe.value - e.scrollLeft, n = se.value - e.scrollTop, r = Math.abs(t) < .5, i = Math.abs(n) < .5;
			if (r && i) {
				e.scrollLeft = oe.value, e.scrollTop = se.value, ce.value = e.scrollLeft, le.value = e.scrollTop, me.value += 1, Ue(!1), bt();
				return;
			}
			let a = Math.min(.45, Math.max(.24, 1 / Math.sqrt(Nt)));
			r || (e.scrollLeft += t * a), i || (e.scrollTop += n * a), ce.value = e.scrollLeft, le.value = e.scrollTop, me.value += 1, Je(), Ue(!0), Q.value = requestAnimationFrame(yt);
		}
		function bt() {
			Q.value !== void 0 && (cancelAnimationFrame(Q.value), Q.value = void 0), s.value && (oe.value = s.value.scrollLeft, se.value = s.value.scrollTop), ce.value = null, le.value = null, N.value = !1;
		}
		function xt() {
			pt(!1), It(), bt();
		}
		function St() {
			let e = s.value;
			if (!e || Q.value === void 0) return;
			let t = ce.value, n = le.value;
			if (t === null || n === null) {
				bt();
				return;
			}
			Math.abs(e.scrollLeft - t) < .75 && Math.abs(e.scrollTop - n) < .75 || bt();
		}
		function Ct(e) {
			if (xt(), ge.value === "Disabled" || e.touches.length !== 2) return;
			We();
			let t = e.touches[0], n = e.touches[1];
			F.value = Math.hypot(n.clientX - t.clientX, n.clientY - t.clientY), I.value = m.value;
		}
		function wt(e) {
			if (ge.value === "Disabled" || e.touches.length !== 2) return;
			let t = e.touches[0], n = e.touches[1], r = Math.hypot(n.clientX - t.clientX, n.clientY - t.clientY) / F.value;
			Et(I.value * r), g.value = !0;
		}
		function Tt() {
			g.value && (g.value = !1, Ue(!1), Ge());
		}
		function Et(e) {
			m.value = Math.max(_e.value, Math.min(ve.value, e)), pe.value += 1, me.value += 1, Ue(!0);
		}
		function Dt(e, t, n) {
			return s.value ? (xt(), Ft(e, t), n != null && Et(n), Ue(!1), !0) : !1;
		}
		function Ft(e, t) {
			s.value && (e != null && (s.value.scrollLeft = e), t != null && (s.value.scrollTop = t), me.value += 1);
		}
		function It() {
			O.value !== void 0 && (cancelAnimationFrame(O.value), O.value = void 0), k.value = null, j.value = null;
		}
		function Lt() {
			let e = s.value;
			if (!e || O.value === void 0) return;
			let t = k.value, n = j.value;
			if (t === null || n === null) {
				It();
				return;
			}
			Math.abs(e.scrollLeft - t) < .75 && Math.abs(e.scrollTop - n) < .75 || It();
		}
		function Rt(e) {
			return Et(e), 0;
		}
		function zt(e) {
			return Et(m.value + e), 0;
		}
		function Bt(e, t) {
			return xt(), Ft(e, t), Ue(!1), 0;
		}
		function Vt(e, t) {
			return _t(e, t, !0), 0;
		}
		function Ht(e, t = Mt) {
			xt();
			let n = Array.isArray(e) ? e[0] : e.x ?? 0, r = Array.isArray(e) ? e[1] : e.y ?? 0, i = performance.now(), a = (e) => {
				if (!s.value) return;
				let o = Math.min(.05, Math.max(0, (e - i) / 1e3));
				i = e;
				let c = s.value, l = Math.max(0, c.scrollWidth - c.clientWidth), u = Math.max(0, c.scrollHeight - c.clientHeight), d = Math.max(0, Math.min(l, c.scrollLeft + n * o)), f = Math.max(0, Math.min(u, c.scrollTop + r * o)), p = Math.abs(d - c.scrollLeft) > .01 || Math.abs(f - c.scrollTop) > .01;
				c.scrollLeft = d, c.scrollTop = f, k.value = c.scrollLeft, j.value = c.scrollTop, me.value += 1, Je(), Ue(!0);
				let m = t ** (o * 1e3);
				if (n *= m, r *= m, !p || Math.abs(n) < .5 && Math.abs(r) < .5) {
					O.value = void 0, k.value = null, j.value = null, Ue(!1);
					return;
				}
				O.value = requestAnimationFrame(a);
			};
			return O.value = requestAnimationFrame(a), 0;
		}
		function Ut(e) {
			xt(), tt(e), rt(e), et("vertical"), re.value = !0, Y.value = e.pointerId, e.currentTarget?.setPointerCapture?.(e.pointerId), ue.value = e.clientY, fe.value = s.value?.scrollTop || 0, document.addEventListener("pointermove", Wt), document.addEventListener("pointerup", Gt), document.addEventListener("pointercancel", Gt), e.preventDefault();
		}
		function Wt(e) {
			if (!re.value || !s.value || Y.value !== null && e.pointerId !== Y.value) return;
			let t = e.clientY - ue.value, n = Ke("vertical"), r = Math.max(30, s.value.clientHeight / s.value.scrollHeight * n.trackLength), i = Math.max(1, n.trackLength - r), a = Math.max(1, s.value.scrollHeight - s.value.clientHeight);
			s.value.scrollTop = fe.value + t / i * a, me.value += 1, e.preventDefault();
		}
		function Gt(e) {
			e && Y.value !== null && e.pointerId !== Y.value || (re.value = !1, Y.value = null, document.removeEventListener("pointermove", Wt), document.removeEventListener("pointerup", Gt), document.removeEventListener("pointercancel", Gt), U.value || ct("vertical"));
		}
		function Kt(e) {
			xt(), tt(e), rt(e), et("horizontal"), K.value = !0, X.value = e.pointerId, e.currentTarget?.setPointerCapture?.(e.pointerId), de.value = e.clientX, $.value = s.value?.scrollLeft || 0, document.addEventListener("pointermove", qt), document.addEventListener("pointerup", Jt), document.addEventListener("pointercancel", Jt), e.preventDefault();
		}
		function qt(e) {
			if (!K.value || !s.value || X.value !== null && e.pointerId !== X.value) return;
			let t = e.clientX - de.value, n = Ke("horizontal"), r = Math.max(30, s.value.clientWidth / s.value.scrollWidth * n.trackLength), i = Math.max(1, n.trackLength - r), a = Math.max(1, s.value.scrollWidth - s.value.clientWidth);
			s.value.scrollLeft = $.value + t / i * a, me.value += 1, e.preventDefault();
		}
		function Jt(e) {
			e && X.value !== null && e.pointerId !== X.value || (K.value = !1, X.value = null, document.removeEventListener("pointermove", qt), document.removeEventListener("pointerup", Jt), document.removeEventListener("pointercancel", Jt), W.value || ct("horizontal"));
		}
		return V(ye, (e) => {
			m.value = e;
		}), t({
			zoomToFactor: Et,
			ChangeView: Dt,
			ZoomTo: Rt,
			ZoomBy: zt,
			ZoomToFactor: Rt,
			ZoomFactor: o(() => m.value),
			HorizontalOffset: o(() => s.value?.scrollLeft || 0),
			VerticalOffset: o(() => s.value?.scrollTop || 0),
			ViewportWidth: o(() => s.value?.clientWidth || 0),
			ViewportHeight: o(() => s.value?.clientHeight || 0),
			ExtentWidth: o(() => s.value?.scrollWidth || 0),
			ExtentHeight: o(() => s.value?.scrollHeight || 0),
			ScrollableWidth: o(() => Math.max(0, (s.value?.scrollWidth || 0) - (s.value?.clientWidth || 0))),
			ScrollableHeight: o(() => Math.max(0, (s.value?.scrollHeight || 0) - (s.value?.clientHeight || 0))),
			ComputedHorizontalScrollBarVisibility: o(() => ze.value ? "Visible" : "Collapsed"),
			ComputedVerticalScrollBarVisibility: o(() => Re.value ? "Visible" : "Collapsed"),
			ScrollTo: Bt,
			ScrollBy: Vt,
			AddScrollVelocity: Ht,
			CancelScrollVelocity: It,
			scrollViewerRef: s,
			scrollTop: o(() => s.value?.scrollTop || 0),
			scrollLeft: o(() => s.value?.scrollLeft || 0),
			scrollHeight: o(() => s.value?.scrollHeight || 0),
			scrollWidth: o(() => s.value?.scrollWidth || 0),
			clientHeight: o(() => s.value?.clientHeight || 0),
			clientWidth: o(() => s.value?.clientWidth || 0)
		}), ee(() => {
			x(() => {
				Je(), s.value && Ue(!1), he = new ResizeObserver(() => {
					pe.value += 1, me.value += 1, Je();
				}), a.value && he.observe(a.value), s.value && he.observe(s.value), d.value && he.observe(d.value);
			});
		}), w(() => {
			L.value && clearTimeout(L.value), R.value && clearTimeout(R.value), z.value && clearTimeout(z.value), te.value && clearTimeout(te.value), ne.value && clearTimeout(ne.value), B.value && clearTimeout(B.value), H.value && clearTimeout(H.value), pt(!1), bt(), he?.disconnect(), It(), document.removeEventListener("pointermove", Wt), document.removeEventListener("pointerup", Gt), document.removeEventListener("pointercancel", Gt), document.removeEventListener("pointermove", qt), document.removeEventListener("pointerup", Jt), document.removeEventListener("pointercancel", Jt);
		}), (e, t) => (D(), l("div", {
			ref_key: "rootRef",
			ref: a,
			class: S(["win-scroll-viewer", [`zoom-mode-${ge.value.toLowerCase()}`, {
				scrolling: h.value,
				zooming: g.value,
				"has-vertical-scrollbar": Re.value,
				"has-horizontal-scrollbar": ze.value,
				"scrollbar-corner-visible": Re.value && ze.value && (y.value || b.value),
				"vertical-contracting": T.value,
				"horizontal-contracting": E.value
			}]]),
			style: C(Ne.value)
		}, [
			u("div", {
				ref_key: "scrollViewerRef",
				ref: s,
				class: "win-scroll-viewer-viewport",
				style: C(Pe.value),
				tabindex: Ee.value ? 0 : -1,
				onScroll: qe,
				onWheel: mt,
				onTouchstartPassive: Ct,
				onTouchmovePassive: wt,
				onTouchendPassive: Tt
			}, [u("div", {
				ref_key: "contentRef",
				ref: d,
				class: "scroll-content",
				style: C(Fe.value)
			}, [M(e.$slots, "default", {}, void 0, !0)], 4)], 44, Ot),
			Re.value ? (D(), l("div", {
				key: 0,
				ref_key: "verticalScrollBarRef",
				ref: f,
				class: S(["scrollbar scrollbar-vertical", {
					visible: _.value,
					expanded: y.value,
					contracting: T.value,
					dragging: re.value,
					"line-scrolling": Z.value?.orientation === "vertical" || N.value,
					"has-cross-scrollbar": ze.value
				}]),
				onPointerenter: t[2] ||= (e) => at("vertical", e),
				onPointerleave: t[3] ||= (e) => st("vertical"),
				onPointerdown: t[4] ||= (e) => ot("vertical", e),
				onWheel: gt
			}, [
				u("button", {
					class: "scrollbar-button decrease icon",
					type: "button",
					"aria-hidden": "true",
					tabindex: "-1",
					onPointerdown: t[0] ||= G((e) => ut("vertical", -1, e), ["prevent"])
				}, "", 32),
				t[10] ||= u("div", { class: "scrollbar-track" }, null, -1),
				u("div", {
					class: "scrollbar-thumb",
					style: C(Be.value),
					onPointerdown: G(Ut, ["prevent", "stop"])
				}, null, 36),
				u("button", {
					class: "scrollbar-button increase icon",
					type: "button",
					"aria-hidden": "true",
					tabindex: "-1",
					onPointerdown: t[1] ||= G((e) => ut("vertical", 1, e), ["prevent"])
				}, "", 32)
			], 34)) : c("", !0),
			ze.value ? (D(), l("div", {
				key: 1,
				ref_key: "horizontalScrollBarRef",
				ref: p,
				class: S(["scrollbar scrollbar-horizontal", {
					visible: v.value,
					expanded: b.value,
					contracting: E.value,
					dragging: K.value,
					"line-scrolling": Z.value?.orientation === "horizontal" || N.value,
					"has-cross-scrollbar": Re.value
				}]),
				onPointerenter: t[7] ||= (e) => at("horizontal", e),
				onPointerleave: t[8] ||= (e) => st("horizontal"),
				onPointerdown: t[9] ||= (e) => ot("horizontal", e),
				onWheel: gt
			}, [
				u("button", {
					class: "scrollbar-button decrease icon",
					type: "button",
					"aria-hidden": "true",
					tabindex: "-1",
					onPointerdown: t[5] ||= G((e) => ut("horizontal", -1, e), ["prevent"])
				}, "", 32),
				t[11] ||= u("div", { class: "scrollbar-track" }, null, -1),
				u("div", {
					class: "scrollbar-thumb",
					style: C(Ve.value),
					onPointerdown: G(Kt, ["prevent", "stop"])
				}, null, 36),
				u("button", {
					class: "scrollbar-button increase icon",
					type: "button",
					"aria-hidden": "true",
					tabindex: "-1",
					onPointerdown: t[6] ||= G((e) => ut("horizontal", 1, e), ["prevent"])
				}, "", 32)
			], 34)) : c("", !0),
			Re.value && ze.value ? (D(), l("div", kt)) : c("", !0)
		], 6));
	}
}), [["__scopeId", "data-v-093a3aa5"]]), It = {
	__name: "MenuFlyout",
	props: {
		Open: Boolean,
		AnchorRect: Object,
		Items: {
			type: Array,
			default: () => []
		},
		Placement: {
			type: String,
			default: "Bottom"
		},
		MinWidth: {
			type: [Number, String],
			default: 96
		},
		Theme: {
			type: String,
			default: ""
		},
		Gap: {
			type: Number,
			default: 6
		},
		CloseAnimation: {
			type: String,
			default: ""
		},
		OverlayInputPassThroughElement: Boolean
	},
	emits: [
		"Close",
		"Select",
		"PointerEnter",
		"PointerLeave"
	],
	setup(e, { emit: t }) {
		let r = e, i = t, a = v("winuiTheme", A("")), d = A(!1), f = A(!1), p = A(0), g = A(typeof window > "u" ? 600 : window.innerHeight), y, b = !1, T = o(() => {
			let e = String(r.Theme || a?.value || "").toLowerCase();
			return e === "light" || e === "dark" ? e : "";
		}), E = o(() => T.value ? `win-theme-scope theme-${T.value}` : ""), O = o(() => T.value === "dark" ? {
			"--MenuFlyoutPresenterBorderBrush": "rgba(0, 0, 0, 0.20)",
			"--SurfaceStrokeColorFlyoutBrush": "rgba(0, 0, 0, 0.20)",
			"--surface-stroke-color-flyout": "rgba(0, 0, 0, 0.20)",
			"--DividerStrokeColorDefaultBrush": "rgba(255, 255, 255, 0.0824)",
			"--divider-stroke-default": "rgba(255, 255, 255, 0.0824)",
			"--stroke-divider": "rgba(255, 255, 255, 0.0824)"
		} : T.value === "light" ? {
			"--MenuFlyoutPresenterBorderBrush": "rgba(0, 0, 0, 0.0588)",
			"--SurfaceStrokeColorFlyoutBrush": "rgba(0, 0, 0, 0.0588)",
			"--surface-stroke-color-flyout": "rgba(0, 0, 0, 0.0588)",
			"--DividerStrokeColorDefaultBrush": "rgba(0, 0, 0, 0.0588)",
			"--divider-stroke-default": "rgba(0, 0, 0, 0.0588)",
			"--stroke-divider": "rgba(0, 0, 0, 0.0588)"
		} : {}), k = o(() => r.Items.some((e) => ["MenuFlyoutSubItem", "SplitMenuFlyoutItem"].includes(J(e)))), j = h({
			name: "MenuFlyoutItems",
			props: {
				Items: {
					type: Array,
					default: () => []
				},
				IsSubmenu: Boolean,
				IsClosing: Boolean
			},
			emits: [
				"Select",
				"Dismiss",
				"RequestClose",
				"PointerEnter",
				"PointerLeave"
			],
			setup(e, { emit: t }) {
				let r = A(null), i = A(null), a = A(0), s = A([]), c = A(null), l = A(null), u, d, f = o(() => e.Items.some((e) => ["ToggleMenuFlyoutItem", "RadioMenuFlyoutItem"].includes(J(e)))), p = o(() => e.Items.some((e) => !!X(e))), m = o(() => r.value === null ? null : e.Items[r.value] ?? null), h = o(() => {
					let e = i.value;
					if (!e) return !1;
					let t = K(m.value?.Items || []);
					return e.top + t + 8 > window.innerHeight && e.bottom >= t + 8;
				}), g = o(() => {
					let e = i.value;
					if (!e) return {};
					let t = q(m.value?.Items || []), n = K(m.value?.Items || []), r = e.right + t + 8 > window.innerWidth && e.left >= t + 8, a = Math.max(8, window.innerHeight - n - 8), o = Math.min(Math.max(8, e.top - 4), a);
					return {
						left: r ? "auto" : `${e.right - 4}px`,
						right: r ? `${window.innerWidth - e.left - 4}px` : "auto",
						top: `${o}px`,
						"--flyout-min-width": "96px",
						"--flyout-max-height": `${Math.max(120, window.innerHeight - o - 8)}px`
					};
				}), v = () => {
					u !== void 0 && window.clearTimeout(u), u = void 0;
				}, y = () => {
					d !== void 0 && window.clearTimeout(d), d = void 0;
				}, b = () => {
					y(), t("PointerEnter");
				}, S = (e = !1) => {
					v(), y();
					let t = r.value;
					r.value = null, i.value = null, e && t !== null && x(() => s.value[t]?.focus({ preventScroll: !0 }));
				}, C = (t, n) => {
					Q(e.Items[t]) || (v(), y(), r.value = t, i.value = n.getBoundingClientRect(), a.value += 1, b());
				}, T = (e, t, n = !1) => {
					let i = t.currentTarget;
					if (v(), b(), r.value !== e) {
						if (n) {
							C(e, i);
							return;
						}
						t.pointerType !== "touch" && (u = window.setTimeout(() => C(e, i), 400));
					}
				}, D = () => {
					v(), y(), r.value !== null && (d = window.setTimeout(() => S(), 400));
				}, k = (e, n, r) => {
					Q(e) || (e?.Command?.Execute?.(e.CommandParameter), e?.Click?.(r, e), t("Select", {
						item: e,
						index: n
					}));
				}, M = (t) => {
					let n = s.value[t];
					n && !Q(e.Items[t]) && n.focus({ preventScroll: !0 });
				}, N = (t, n) => {
					let r = e.Items.length;
					if (r) for (let i = 1; i <= r; i += 1) {
						let a = (t + n * i + r) % r;
						if (J(e.Items[a]) !== "MenuFlyoutSeparator" && !Q(e.Items[a])) {
							M(a);
							return;
						}
					}
				}, P = (n, r, i, a) => {
					switch (n.key) {
						case "ArrowDown":
							n.preventDefault(), N(i, 1);
							break;
						case "ArrowUp":
							n.preventDefault(), N(i, -1);
							break;
						case "Home": {
							n.preventDefault();
							let t = e.Items.findIndex((e) => J(e) !== "MenuFlyoutSeparator" && !Q(e));
							t >= 0 && M(t);
							break;
						}
						case "End": {
							n.preventDefault();
							let t = e.Items.findLastIndex((e) => J(e) !== "MenuFlyoutSeparator" && !Q(e));
							t >= 0 && M(t);
							break;
						}
						case "ArrowRight":
							a && (n.preventDefault(), C(i, a), x(() => l.value?.querySelector(".win-menu-flyout-item:not(:disabled)")?.focus({ preventScroll: !0 })));
							break;
						case "ArrowLeft":
							e.IsSubmenu && (n.preventDefault(), t("RequestClose"));
							break;
						case "Enter":
						case " ":
							n.preventDefault(), a ? C(i, a) : k(r, i, n);
							break;
						case "Escape":
							n.preventDefault(), e.IsSubmenu ? t("RequestClose") : t("Dismiss");
							break;
						default: break;
					}
				}, F = (t) => {
					if (t.defaultPrevented) return;
					let n = e.Items.findIndex((e) => !Q(e) && ae(e, t));
					n < 0 || (t.preventDefault(), k(e.Items[n], n, t));
				}, I = (e, t, n, r) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault(), k(t, n, e);
						return;
					}
					P(e, t, n, r);
				}, L = (e, t) => {
					t ? s.value[e] = t : delete s.value[e];
				}, R = (e, t) => {
					let n = X(e), r = t === "ToggleMenuFlyoutItem" || t === "RadioMenuFlyoutItem", i = [];
					return f.value && i.push(_("span", {
						class: "win-menu-flyout-leading-slot win-menu-flyout-check-slot",
						"aria-hidden": !0
					}, r && oe(e) ? _("span", { class: "icon win-menu-flyout-check" }, t === "RadioMenuFlyoutItem" ? "" : "") : null)), p.value && i.push(_("span", {
						class: "win-menu-flyout-leading-slot win-menu-flyout-icon-slot",
						"aria-hidden": !0
					}, n ? _("span", { class: "icon win-menu-flyout-icon" }, n) : null)), i;
				}, z = (e, t) => {
					let n = J(e), i = e?.Text || e?.Command?.Label || String(e), a = e.Foreground && !Q(e) ? e.Foreground : "", o = {
						...a ? { color: a } : {},
						...e.Background ? { "--win-menu-flyout-item-background": e.Background } : {}
					};
					if (n === "MenuFlyoutSeparator") return _("div", {
						key: t,
						class: "win-menu-flyout-separator",
						role: "separator"
					}, _("span", {
						class: "win-menu-flyout-separator-line",
						"aria-hidden": !0
					}));
					if (n === "MenuFlyoutSubItem" || n === "SplitMenuFlyoutItem") {
						let s = n === "SplitMenuFlyoutItem", c = Q(e);
						if (s) {
							let s;
							return _("div", {
								key: t,
								class: [
									"win-menu-flyout-item",
									"win-menu-flyout-subitem",
									"win-menu-flyout-splititem",
									{
										"is-disabled": c,
										"is-open": r.value === t
									}
								],
								role: "group",
								"aria-disabled": c,
								style: o,
								onPointerleave: D
							}, [
								_("button", {
									ref: (e) => L(t, e),
									class: "win-menu-flyout-split-primary",
									type: "button",
									tabindex: -1,
									disabled: c,
									"aria-label": i,
									onPointerenter: () => S(),
									onClick: (n) => {
										n.stopPropagation(), k(e, t, n);
									},
									onKeydown: (n) => I(n, e, t, s)
								}),
								_("span", {
									class: "win-menu-flyout-split-divider",
									"aria-hidden": !0
								}),
								_("button", {
									ref: (e) => {
										s = e;
									},
									class: "win-menu-flyout-chevron-button",
									type: "button",
									tabindex: -1,
									disabled: c,
									"aria-label": i,
									"aria-haspopup": !0,
									"aria-expanded": r.value === t,
									onPointerenter: (e) => T(t, e),
									onClick: (e) => {
										let n = e.currentTarget;
										e.stopPropagation(), C(t, n);
									},
									onKeydown: (n) => P(n, e, t, n.currentTarget)
								}),
								_("div", {
									class: "win-menu-flyout-split-content",
									"aria-hidden": !0
								}, [
									...R(e, n),
									_(Rt, {
										class: "win-menu-flyout-label",
										Foreground: a,
										Text: i
									}),
									_("span", { class: "icon win-menu-flyout-chevron" }, "")
								])
							]);
						}
						let l;
						return _("button", {
							key: t,
							ref: (e) => {
								l = e, L(t, e);
							},
							class: [
								"win-menu-flyout-item",
								"win-menu-flyout-subitem",
								{
									"is-disabled": c,
									"is-open": r.value === t
								}
							],
							role: "menuitem",
							type: "button",
							tabindex: -1,
							disabled: c,
							style: o,
							"aria-disabled": c,
							"aria-haspopup": !0,
							"aria-expanded": r.value === t,
							onPointerenter: (e) => T(t, e),
							onPointerleave: D,
							onClick: (e) => {
								let n = e.currentTarget;
								e.stopPropagation(), C(t, n);
							},
							onKeydown: (n) => P(n, e, t, l)
						}, [
							...R(e, n),
							_(Rt, {
								class: "win-menu-flyout-label",
								Foreground: a,
								Text: i
							}),
							_("span", {
								class: "icon win-menu-flyout-chevron",
								"aria-hidden": !0
							}, "")
						]);
					}
					let s = Z(e);
					return _("button", {
						key: t,
						ref: (e) => L(t, e),
						class: ["win-menu-flyout-item", {
							"is-disabled": Q(e),
							"is-checked": oe(e),
							"is-toggle": n === "ToggleMenuFlyoutItem",
							"is-radio": n === "RadioMenuFlyoutItem"
						}],
						type: "button",
						role: n === "RadioMenuFlyoutItem" ? "menuitemradio" : n === "ToggleMenuFlyoutItem" ? "menuitemcheckbox" : "menuitem",
						tabindex: -1,
						disabled: Q(e),
						style: o,
						"aria-checked": n === "ToggleMenuFlyoutItem" || n === "RadioMenuFlyoutItem" ? oe(e) : void 0,
						onPointerenter: () => S(),
						onClick: (n) => k(e, t, n),
						onKeydown: (n) => P(n, e, t)
					}, [
						...R(e, n),
						_(Rt, {
							class: "win-menu-flyout-label",
							Foreground: a,
							Text: i
						}),
						s ? _(Rt, {
							class: "win-menu-flyout-accelerator",
							Text: s
						}) : null
					]);
				};
				return ee(() => {
					!e.IsSubmenu && !e.IsClosing && x(() => {
						let t = e.Items.findIndex((e) => J(e) !== "MenuFlyoutSeparator" && !Q(e));
						t >= 0 ? M(t) : c.value?.focus({ preventScroll: !0 });
					});
				}), w(() => {
					v(), y();
				}), () => [_("div", {
					ref: c,
					class: "win-menu-flyout-items",
					role: "menu",
					tabindex: -1,
					onKeydown: F
				}, e.Items.map(z)), m.value ? _(n, { to: "body" }, _("div", {
					key: a.value,
					ref: l,
					class: [
						"win-menu-flyout-wrap",
						"win-menu-submenu-wrap",
						E.value,
						{
							"from-bottom": h.value,
							"is-closing": e.IsClosing
						}
					],
					style: {
						...g.value,
						...O.value
					},
					onPointerenter: b,
					onPointerleave: () => {
						D(), t("PointerLeave");
					},
					onFocusout: () => {
						window.setTimeout(() => {
							document.activeElement?.closest?.(".win-menu-flyout-wrap") || t("Dismiss");
						}, 0);
					}
				}, _("div", { class: "win-menu-submenu-motion" }, [_("div", {
					class: "win-menu-flyout-shadow",
					"aria-hidden": !0
				}), _("div", { class: "win-menu-submenu-flyout" }, _(j, {
					key: a.value,
					Items: m.value.Items || [],
					IsSubmenu: !0,
					onSelect: (e) => t("Select", e),
					onDismiss: () => t("Dismiss"),
					onRequestClose: () => S(!0),
					onPointerEnter: b,
					onPointerLeave: () => t("PointerLeave")
				}))]))) : null];
			}
		}), N = () => {
			g.value = window.innerHeight;
		}, P = () => {
			!r.Open || b || (b = !0, i("Close"));
		}, F = (e) => {
			if (!r.Open) return;
			let t = e.composedPath?.() || [], n = t.some((e) => e?.classList?.contains("win-menu-flyout-wrap")), i = t.some((e) => e?.classList?.contains("win-menu-bar")), a = t.some((e) => e?.classList?.contains("win-commandbar"));
			!n && !i && !a && P();
		}, I = () => {
			window.setTimeout(() => {
				let e = document.activeElement, t = e?.closest?.(".win-commandbar, .win-menu-bar");
				r.Open && e && !e.closest?.(".win-menu-flyout-wrap") && !t && P();
			}, 0);
		}, L = (e) => {
			let t = e?.target;
			if (!(t instanceof Element) || t.closest(".win-menu-flyout-item")) return;
			let n = t.closest("button, [role=\"button\"]");
			n && !n.hasAttribute("disabled") && !n.getAttribute("aria-disabled") && P();
		}, R = () => {
			r.Open && P();
		}, te = () => {
			document.visibilityState === "hidden" && r.Open && P();
		};
		ee(() => {
			N(), window.addEventListener("resize", N), window.addEventListener("blur", R), document.addEventListener("pointerdown", F, !0), document.addEventListener("visibilitychange", te);
		}), w(() => {
			window.removeEventListener("resize", N), window.removeEventListener("blur", R), document.removeEventListener("pointerdown", F, !0), document.removeEventListener("visibilitychange", te), y !== void 0 && window.clearTimeout(y);
		}), V(() => r.Open, (e) => {
			if (e) b = !1, y !== void 0 && window.clearTimeout(y), y = void 0, d.value = !0, f.value = !1, p.value += 1;
			else if (d.value) {
				f.value = !0, (r.CloseAnimation === "Reverse" || r.CloseAnimation === "CommandBar") && (p.value += 1);
				let e = r.CloseAnimation === "Reverse" ? 250 : r.CloseAnimation === "CommandBar" ? 167 : 83;
				y = window.setTimeout(() => {
					d.value = !1, f.value = !1, y = void 0;
				}, e);
			}
		}, { immediate: !0 }), V(() => r.AnchorRect, () => {
			r.Open && (p.value += 1);
		});
		let ne = ({ item: e, index: t }) => {
			Q(e) || (re(e), G(e), i("Select", e, t), P());
		}, B = o(() => {
			if (!r.AnchorRect || r.Placement === "Right" || r.Placement === "RightEdgeAlignedTop") return "down";
			let e = r.Gap, t = g.value - r.AnchorRect.bottom - e - 8, n = r.AnchorRect.top - e - 8;
			return t >= K(r.Items) || t >= n ? "down" : "up";
		}), U = o(() => {
			if (!r.AnchorRect) return {};
			let e = r.AnchorRect, t = g.value, n = r.Placement === "Right" || r.Placement === "RightEdgeAlignedTop" ? 0 : r.Gap, i = t - e.bottom - n - 8, a = e.top - n - 8, o = W(r.MinWidth);
			if (r.Placement === "Right" || r.Placement === "RightEdgeAlignedTop") return {
				top: `${e.top}px`,
				left: `${e.right}px`,
				"--flyout-max-height": `${Math.max(0, t - e.top - 8)}px`,
				"--flyout-min-width": o
			};
			let s = r.Placement === "BottomEdgeAlignedRight", c = r.Placement === "BottomEdgeAlignedLeft";
			return B.value === "down" ? {
				top: `${e.bottom + n}px`,
				left: s ? `${e.right}px` : c ? `${e.left}px` : `${e.left + e.width / 2}px`,
				transform: s ? "translateX(-100%)" : c ? void 0 : "translateX(-50%)",
				"--flyout-max-height": `${Math.max(0, i)}px`,
				"--flyout-min-width": o
			} : {
				bottom: `${t - e.top + n}px`,
				left: s ? `${e.right}px` : c ? `${e.left}px` : `${e.left + e.width / 2}px`,
				transform: s ? "translateX(-100%)" : c ? void 0 : "translateX(-50%)",
				"--flyout-max-height": `${Math.max(0, a)}px`,
				"--flyout-min-width": o
			};
		}), W = (e) => typeof e == "number" ? `${e}px` : e, G = (e) => {
			if (!e?.GroupName) return;
			let t = (n) => {
				n.forEach((n) => {
					n.GroupName === e.GroupName && (n.IsChecked = n === e), n.Items && t(n.Items);
				});
			};
			t(r.Items);
		}, re = (e) => {
			J(e) === "ToggleMenuFlyoutItem" && (e.IsChecked = !e.IsChecked);
		}, K = (e) => {
			let t = e.filter((e) => J(e) !== "MenuFlyoutSeparator").length, n = e.length - t;
			return 4 + t * 36 + n * 3;
		}, q = (e) => {
			if (!e.length) return 96;
			let t = e.some((e) => ["ToggleMenuFlyoutItem", "RadioMenuFlyoutItem"].includes(J(e))), n = e.some((e) => !!X(e));
			return Math.max(96, Math.min(320, ...e.map((e) => {
				let r = e?.Text || e?.Command?.Label || "", i = Z(e);
				return 30 + String(r).length * 7.2 + (t ? 28 : 0) + (n ? 28 : 0) + (i ? 24 + i.length * 6.5 : 0);
			})));
		}, J = (e) => e?.Kind ?? (e?.Items ? "MenuFlyoutSubItem" : ""), ie = {
			Cut: "",
			Copy: "",
			Paste: "",
			SelectAll: "",
			Delete: "",
			Share: "",
			Save: "",
			OpenFile: "",
			Cancel: "",
			Pause: "",
			Play: "",
			Stop: "",
			Forward: "",
			Back: "",
			Undo: "",
			Redo: ""
		}, Y = (e) => typeof e == "string" ? e : e?.Glyph || ie[e?.Symbol] || "", X = (e) => e?.Icon || Y(e?.Command?.IconSource), Z = (e) => {
			if (e?.KeyboardAcceleratorTextOverride) return e.KeyboardAcceleratorTextOverride;
			let t = e?.KeyboardAccelerators?.[0] || e?.Command?.KeyboardAccelerators?.[0];
			if (!t) return "";
			let n = Array.isArray(t.Modifiers) ? t.Modifiers : String(t.Modifiers || "").split(/[,+\s]+/).filter(Boolean), r = [];
			if ((n.includes("Control") || n.includes("Ctrl")) && r.push("Ctrl"), n.includes("Shift") && r.push("Shift"), n.includes("Alt") && r.push("Alt"), (n.includes("Windows") || n.includes("Meta")) && r.push("Win"), t.Key) {
				let e = String(t.Key);
				r.push(e.length === 1 ? e.toUpperCase() : e);
			}
			return r.join("+");
		}, ae = (e, t) => (e?.KeyboardAccelerators || e?.Command?.KeyboardAccelerators || []).some((e) => {
			let n = new Set(Array.isArray(e.Modifiers) ? e.Modifiers : String(e.Modifiers || "").split(/[,+\s]+/).filter(Boolean));
			return t.key.toLowerCase() === String(e.Key || "").toLowerCase() && t.ctrlKey === (n.has("Control") || n.has("Ctrl")) && t.shiftKey === n.has("Shift") && t.altKey === n.has("Alt") && t.metaKey === (n.has("Windows") || n.has("Meta"));
		}), Q = (e) => e?.IsEnabled === !1 ? !0 : typeof e?.Command?.CanExecute == "function" && e.Command.CanExecute(e.CommandParameter) === !1, oe = (e) => !!e?.IsChecked;
		return (t, r) => (D(), s(n, { to: "body" }, [d.value ? (D(), l("div", {
			key: 0,
			class: S(["win-menu-flyout-overlay", { "allows-anchor-hover": e.OverlayInputPassThroughElement }]),
			onPointerdown: P
		}, null, 34)) : c("", !0), d.value ? (D(), l("div", {
			key: 1,
			class: S(["win-menu-flyout-wrap", [
				E.value,
				f.value ? "is-closing" : "",
				e.CloseAnimation === "Reverse" ? "reverse-close" : "",
				e.CloseAnimation === "CommandBar" ? "commandbar-close" : "",
				B.value === "up" ? "from-bottom" : ""
			]]),
			style: C([U.value, O.value]),
			onPointerenter: r[2] ||= (e) => i("PointerEnter"),
			onPointerleave: r[3] ||= (e) => i("PointerLeave")
		}, [(D(), l("div", {
			key: p.value,
			class: "win-menu-flyout-motion"
		}, [r[4] ||= u("div", {
			class: "win-menu-flyout-shadow",
			"aria-hidden": "true"
		}, null, -1), u("div", {
			class: "win-menu-flyout",
			onFocusout: I,
			onClick: L
		}, [m(Ft, {
			class: S(["win-menu-flyout-scroll", { "has-submenu": k.value }]),
			VerticalScrollMode: "Auto",
			VerticalScrollBarVisibility: "Auto",
			HorizontalScrollMode: "Disabled",
			HorizontalScrollBarVisibility: "Disabled"
		}, {
			default: H(() => [m(z(j), {
				Items: e.Items,
				IsClosing: f.value,
				onSelect: ne,
				onDismiss: P,
				onPointerEnter: r[0] ||= (e) => i("PointerEnter"),
				onPointerLeave: r[1] ||= (e) => i("PointerLeave")
			}, null, 8, ["Items", "IsClosing"]), M(t.$slots, "default")]),
			_: 3
		}, 8, ["class"])], 32)]))], 38)) : c("", !0)]));
	}
}, Lt = { key: 0 }, Rt = /*@__PURE__*/ Object.assign({ inheritAttrs: !1 }, {
	__name: "TextBlock",
	props: {
		Text: {
			type: [String, Number],
			default: ""
		},
		Style: {
			type: String,
			default: ""
		},
		CharacterSpacing: {
			type: [String, Number],
			default: ""
		},
		FontFamily: {
			type: String,
			default: ""
		},
		FontSize: {
			type: [String, Number],
			default: ""
		},
		FontStretch: {
			type: String,
			default: ""
		},
		FontStyle: {
			type: String,
			default: ""
		},
		FontWeight: {
			type: [String, Number],
			default: ""
		},
		Foreground: {
			type: String,
			default: ""
		},
		HorizontalTextAlignment: {
			type: String,
			default: ""
		},
		IsColorFontEnabled: {
			type: Boolean,
			default: !0
		},
		IsTextSelectionEnabled: {
			type: Boolean,
			default: !1
		},
		IsTextScaleFactorEnabled: {
			type: Boolean,
			default: !0
		},
		LineHeight: {
			type: [String, Number],
			default: ""
		},
		LineStackingStrategy: {
			type: String,
			default: ""
		},
		Margin: {
			type: String,
			default: ""
		},
		MaxLines: {
			type: [String, Number],
			default: ""
		},
		OpticalMarginAlignment: {
			type: String,
			default: ""
		},
		Padding: {
			type: String,
			default: ""
		},
		SelectionFlyout: {
			type: [String, Object],
			default: ""
		},
		SelectionHighlightColor: {
			type: String,
			default: ""
		},
		TextAlignment: {
			type: String,
			default: ""
		},
		TextDecorations: {
			type: String,
			default: ""
		},
		TextLineBounds: {
			type: String,
			default: ""
		},
		TextReadingOrder: {
			type: String,
			default: ""
		},
		TextTrimming: {
			type: String,
			default: ""
		},
		TextWrapping: {
			type: String,
			default: ""
		}
	},
	setup(e) {
		let { t: n } = rt(), r = e, i = te(), a = g(), s = o(() => $(r.Text, a)), d = A(null), f = A(!1), p = A(null), h = A(""), _ = o(() => {
			let e = d.value?.textContent?.length > 0, t = [];
			return h.value && t.push({
				Text: n("text.copy"),
				Icon: "",
				Value: "copy"
			}), e && t.push({
				Text: n("text.select-all"),
				Icon: "",
				Value: "selectAll"
			}), t;
		}), v = o(() => {
			let { class: e, style: t, ...n } = i;
			return n;
		}), y = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, x = (e) => {
			if (!e) return "";
			let t = String(e).split(",").map((e) => y(Number.isNaN(Number(e.trim())) ? e.trim() : Number(e.trim())));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : e;
		}, S = o(() => {
			switch (r.TextWrapping) {
				case "Wrap":
				case "WrapWholeWords": return "normal";
				case "NoWrap": return "nowrap";
				default: return "";
			}
		}), C = o(() => {
			switch (r.TextWrapping) {
				case "Wrap": return "anywhere";
				case "WrapWholeWords": return "normal";
				default: return "";
			}
		}), ee = o(() => {
			let e = {};
			return r.CharacterSpacing !== "" && (e.letterSpacing = `${Number(r.CharacterSpacing) / 1e3}em`), r.FontFamily && (e.fontFamily = r.FontFamily), r.FontSize !== "" && (e.fontSize = y(r.FontSize)), r.FontStretch && (e.fontStretch = r.FontStretch.toLowerCase()), r.FontStyle && (e.fontStyle = r.FontStyle.toLowerCase()), r.FontWeight !== "" && (e.fontWeight = r.FontWeight), r.Foreground && (e.color = r.Foreground), r.HorizontalTextAlignment && (e.textAlign = r.HorizontalTextAlignment.toLowerCase()), r.LineHeight === "" ? r.FontSize !== "" && (e.lineHeight = "normal") : e.lineHeight = y(r.LineHeight), r.Margin && (e.margin = x(r.Margin)), r.Padding && (e.padding = x(r.Padding)), r.SelectionHighlightColor && (e["--TextBlockSelectionHighlightColor"] = r.SelectionHighlightColor), r.TextAlignment && (e.textAlign = r.TextAlignment.toLowerCase()), r.TextDecorations && (e.textDecorationLine = r.TextDecorations.toLowerCase()), S.value && (e.whiteSpace = S.value), C.value && (e.overflowWrap = C.value), r.IsTextSelectionEnabled && (e.userSelect = "text", e.cursor = "text"), r.TextTrimming && r.TextTrimming !== "None" && (e.overflow = "hidden", e.textOverflow = "ellipsis", e.whiteSpace = "nowrap"), r.MaxLines !== "" && (e.display = "-webkit-box", e.overflow = "hidden", e.WebkitLineClamp = String(r.MaxLines), e.WebkitBoxOrient = "vertical"), [i.style, e];
		}), T = o(() => ({ CustomTextBlockStyle: r.Style.includes("CustomTextBlockStyle") })), E = (e) => {
			r.IsTextSelectionEnabled || e.preventDefault();
		}, O = () => {
			let e = d.value, t = window.getSelection?.();
			if (!e || !t || t.rangeCount === 0) return "";
			let n = t.getRangeAt(0), r = e.contains(n.startContainer), i = e.contains(n.endContainer);
			return r && i ? t.toString() : "";
		}, k = (e) => {
			let t = O();
			t && (e.clipboardData?.setData("text/plain", t), e.preventDefault());
		}, j = (e) => {
			if (!r.IsTextSelectionEnabled || (e.preventDefault(), f.value = !1, h.value = O(), !_.value.length)) return;
			let t = e.clientX, n = e.clientY;
			p.value = {
				x: t,
				y: n,
				top: n,
				bottom: n,
				left: t,
				right: t,
				width: 0,
				height: 0
			}, f.value = !0;
		}, N = () => {
			f.value = !1;
		}, P = () => {
			let e = h.value || O();
			e && navigator.clipboard?.writeText(e);
		}, F = () => {
			let e = d.value;
			if (!e) return;
			let t = document.createRange();
			t.selectNodeContents(e);
			let n = window.getSelection?.();
			n?.removeAllRanges(), n?.addRange(t), h.value = e.textContent ?? "";
		}, I = (e) => {
			e.Value && (N(), e.Value === "copy" && P(), e.Value === "selectAll" && F());
		};
		return w(() => {
			f.value = !1;
		}), (e, n) => (D(), l(t, null, [u("span", b({
			ref_key: "rootRef",
			ref: d
		}, v.value, {
			class: ["win-text-block", [T.value, z(i).class]],
			style: ee.value,
			onContextmenu: j,
			onCopy: k,
			onSelectstart: E
		}), [e.$slots.default ? c("", !0) : (D(), l("span", Lt, L(s.value), 1)), M(e.$slots, "default")], 16), m(It, {
			Open: f.value,
			AnchorRect: p.value,
			Items: _.value,
			MinWidth: 160,
			Placement: "Right",
			onClose: N,
			onSelect: I
		}, null, 8, [
			"Open",
			"AnchorRect",
			"Items"
		])], 64));
	}
}), zt = {
	key: 0,
	class: "win-textbox-header"
}, Bt = { class: "win-textbox-content" }, Vt = [
	"value",
	"placeholder",
	"readonly",
	"disabled",
	"maxlength",
	"spellcheck",
	"inputmode",
	"autocomplete",
	"autocapitalize",
	"autocorrect"
], Ht = [
	"value",
	"placeholder",
	"readonly",
	"disabled",
	"maxlength",
	"spellcheck",
	"inputmode",
	"autocomplete",
	"autocapitalize",
	"autocorrect"
], Ut = ["aria-label"], Wt = {
	key: 1,
	class: "win-textbox-description"
}, Gt = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "TextBox",
	props: {
		Text: {},
		PlaceholderText: { default: "" },
		Header: { default: "" },
		Description: { default: "" },
		AcceptsReturn: {
			type: Boolean,
			default: !1
		},
		IsReadOnly: {
			type: Boolean,
			default: !1
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		MaxLength: { default: 0 },
		TextWrapping: { default: "NoWrap" },
		TextAlignment: { default: "Left" },
		IsSpellCheckEnabled: {
			type: Boolean,
			default: !0
		},
		IsTextPredictionEnabled: {
			type: Boolean,
			default: !0
		},
		InputScope: { default: "Default" },
		CharacterCasing: { default: "Normal" },
		SelectionHighlightColor: { default: "" },
		DesiredCandidateWindowAlignment: { default: "Default" },
		IsColorFontEnabled: {
			type: Boolean,
			default: !0
		},
		PreventKeyboardDisplayOnProgrammaticFocus: {
			type: Boolean,
			default: !1
		},
		ShowDeleteButton: {
			type: Boolean,
			default: !0
		},
		FontFamily: { default: "" },
		FontSize: { default: "" },
		FontStyle: { default: "Normal" },
		FontWeight: { default: "" },
		Foreground: { default: "" },
		CharacterSpacing: { default: 0 },
		MinWidth: { default: "" },
		MaxWidth: { default: "" },
		MinHeight: { default: "" },
		MaxHeight: { default: "" }
	},
	emits: [
		"update:Text",
		"BeforeTextChanging",
		"TextChanging",
		"TextChanged",
		"SelectionChanged",
		"SelectionChanging",
		"GotFocus",
		"LostFocus",
		"Paste",
		"CuttingToClipboard",
		"CopyingToClipboard",
		"CandidateWindowBoundsChanged",
		"TextCompositionStarted",
		"TextCompositionChanged",
		"TextCompositionEnded"
	],
	setup(e, { expose: t, emit: n }) {
		let { t: r } = rt(), i = g(), a = e, s = o(() => $(a.Header, i)), d = o(() => $(a.Description, i)), f = n, h = A(null), _ = A(!1), v = A(!1), y = A(a.Text ?? ""), T = A([]), E = A([]), O = A(""), k = A(!1), j = A(!1), N = A(null), P = A({
			start: 0,
			length: 0,
			text: ""
		}), F = o(() => a.Text !== void 0), I = o(() => F.value ? a.Text ?? "" : y.value), R = o(() => !a.IsEnabled), te = o(() => I.value.length > 0), ne = o(() => a.ShowDeleteButton && te.value && !a.AcceptsReturn && !a.IsReadOnly && a.IsEnabled && _.value), B = o(() => {
			switch (a.InputScope) {
				case "Number":
				case "NumericPin":
				case "Digits": return "numeric";
				case "TelephoneNumber": return "tel";
				case "EmailNameOrAddress":
				case "EmailSmtpAddress": return "email";
				case "Url": return "url";
				case "Search": return "search";
				case "CurrencyAmount":
				case "CurrencyAmountAndSymbol":
				case "Decimal": return "decimal";
				default: return "text";
			}
		}), H = o(() => a.IsTextPredictionEnabled ? "on" : "off"), U = o(() => (a.TextAlignment || "Left").toLowerCase()), W = (e) => {
			if (!(e === void 0 || e === "")) return typeof e == "number" ? `${e}px` : e;
		}, re = o(() => {
			let e = {};
			return a.SelectionHighlightColor && (e["--textbox-selection-background"] = a.SelectionHighlightColor), a.MinWidth !== "" && (e.minWidth = W(a.MinWidth)), a.MaxWidth !== "" && (e.maxWidth = W(a.MaxWidth)), a.MinHeight !== "" && (e.minHeight = W(a.MinHeight)), a.MaxHeight !== "" && (e.maxHeight = W(a.MaxHeight)), e;
		}), K = o(() => {
			let e = { textAlign: U.value };
			return a.FontFamily && (e.fontFamily = a.FontFamily), a.FontSize !== "" && (e.fontSize = W(a.FontSize)), a.FontStyle && a.FontStyle !== "Normal" && (e.fontStyle = a.FontStyle.toLowerCase()), a.FontWeight !== "" && (e.fontWeight = a.FontWeight), a.Foreground && (e.color = a.Foreground), a.CharacterSpacing && (e.letterSpacing = `${a.CharacterSpacing / 1e3}em`), a.AcceptsReturn && (e.whiteSpace = a.TextWrapping === "NoWrap" ? "pre" : "pre-wrap", e.overflowWrap = a.TextWrapping === "WrapWholeWords" ? "normal" : "break-word"), e;
		}), q = o(() => T.value.length > 0), J = o(() => E.value.length > 0), ie = o(() => {
			let e = [], t = P.value.length > 0, n = I.value.length > 0, i = !a.IsReadOnly && a.IsEnabled, o = i && O.value.length > 0;
			return t && (i && e.push({
				Text: r("text.cut"),
				Icon: "",
				Value: "cut"
			}), e.push({
				Text: r("text.copy"),
				Icon: "",
				Value: "copy"
			})), o && e.push({
				Text: r("text.paste"),
				Icon: "",
				Value: "paste"
			}), q.value && e.push({
				Text: r("text.undo"),
				Icon: "",
				Value: "undo"
			}), J.value && e.push({
				Text: r("text.redo"),
				Icon: "",
				Value: "redo"
			}), n && e.push({
				Text: r("text.select-all"),
				Icon: "",
				Value: "selectAll"
			}), e;
		}), Y = (e) => {
			T.value.at(-1) !== e && (T.value.push(e), E.value = []);
		}, X = (e, t, n = {}) => {
			let r = I.value;
			n.undo && Y(r), F.value || (y.value = e), f("update:Text", e), f("TextChanged");
		}, Z = () => {
			let e = h.value;
			!e || !a.AcceptsReturn || !(e instanceof HTMLTextAreaElement) || (e.style.height = "auto", e.style.height = `${e.scrollHeight}px`);
		};
		V(() => a.Text, () => {
			y.value = a.Text ?? "", x(Z);
		}, { immediate: !0 });
		let ae = (e) => {
			let t = e;
			return a.CharacterCasing === "Upper" && (t = t.toUpperCase()), a.CharacterCasing === "Lower" && (t = t.toLowerCase()), a.MaxLength > 0 && t.length > a.MaxLength && (t = t.slice(0, a.MaxLength)), t;
		}, Q = (e) => {
			let t = e.target, n = ae(t.value), r = {
				NewText: n,
				Cancel: !1
			};
			if (f("BeforeTextChanging", r), r.Cancel) {
				t.value = I.value;
				return;
			}
			f("TextChanging", { IsContentChanging: n !== I.value }), t.value !== n && (t.value = n), X(n, "UserInput", { undo: !0 }), Z();
		}, oe = () => {
			_.value = !0, le(), f("GotFocus"), Z();
		}, se = () => {
			k.value || j.value || (_.value = !1, le("Default"), f("LostFocus"));
		}, ce = () => {
			let e = h.value;
			e && e.style.setProperty("-ms-ime-align", a.DesiredCandidateWindowAlignment === "BottomEdge" ? "after" : "auto");
		}, le = (e = a.DesiredCandidateWindowAlignment) => {
			ce();
			let t = h.value;
			if (!t) return;
			let n = (t.closest(".win-textbox-border") ?? t).getBoundingClientRect(), r = {
				x: n.x,
				y: n.y,
				top: n.top,
				bottom: n.bottom,
				left: n.left,
				right: n.right,
				width: n.width,
				height: n.height
			};
			window.chrome?.webview?.postMessage?.({
				source: "WinUIonWeb",
				type: "desiredCandidateWindowAlignmentChanged",
				DesiredCandidateWindowAlignment: e,
				TextEditControlBounds: r,
				devicePixelRatio: window.devicePixelRatio,
				visualViewport: window.visualViewport ? {
					offsetLeft: window.visualViewport.offsetLeft,
					offsetTop: window.visualViewport.offsetTop,
					scale: window.visualViewport.scale
				} : null
			});
		}, ue = () => {
			le(), f("TextCompositionStarted");
		}, de = () => {
			le(), f("TextCompositionChanged");
		}, fe = () => {
			f("TextCompositionEnded");
		};
		V(() => a.DesiredCandidateWindowAlignment, () => {
			x(() => {
				ce(), _.value && le();
			});
		});
		let pe = () => {
			v.value = !0;
		}, me = () => {
			v.value = !1;
		}, he = (e) => {
			e.key === "Enter" && !a.AcceptsReturn && e.preventDefault();
		}, ge = () => {
			let e = h.value;
			if (!e) return {
				start: 0,
				length: 0,
				text: ""
			};
			let t = e.selectionStart ?? 0, n = e.selectionEnd ?? 0, r = Math.min(t, n), i = Math.max(t, n);
			return {
				start: r,
				length: i - r,
				text: e.value.substring(r, i)
			};
		}, _e = () => {
			let e = ge(), t = {
				SelectionStart: e.start,
				SelectionLength: e.length,
				Cancel: !1
			};
			f("SelectionChanging", t), !t.Cancel && f("SelectionChanged");
		}, ve = (e) => {
			let t = { Handled: !1 };
			f("CuttingToClipboard", t), t.Handled && e.preventDefault();
		}, ye = (e) => {
			let t = { Handled: !1 };
			f("CopyingToClipboard", t), t.Handled && e.preventDefault();
		}, be = (e) => {
			let t = { Handled: !1 };
			f("Paste", t), t.Handled && e.preventDefault();
		}, xe = async () => {
			try {
				return await navigator.clipboard?.readText() ?? "";
			} catch {
				return "";
			}
		}, Se = async (e) => {
			if (e.preventDefault(), R.value || (k.value = !1, P.value = ge(), O.value = await xe(), !ie.value.length)) return;
			let t = e.clientX, n = e.clientY;
			N.value = {
				x: t,
				y: n,
				top: n,
				bottom: n,
				left: t,
				right: t,
				width: 0,
				height: 0
			}, j.value = !0, k.value = !0;
		}, Ce = () => {
			X("", "ProgrammaticChange", { undo: !0 }), requestAnimationFrame(() => {
				h.value?.focus(), Z();
			});
		}, we = () => {
			k.value = !1, x(() => {
				Ee(), requestAnimationFrame(() => {
					j.value = !1;
				});
			});
		}, Te = (e) => {
			if (!e.Value) return;
			let t = e.Value;
			we(), t === "cut" && Re(), t === "copy" && Le(), t === "paste" && Ie(), t === "undo" && Me(), t === "redo" && Ne(), t === "selectAll" && De();
		}, Ee = (e = {}) => {
			h.value?.focus({ preventScroll: a.PreventKeyboardDisplayOnProgrammaticFocus || e.preventScroll });
		}, De = () => {
			h.value?.select(), _e();
		}, Oe = (e, t) => {
			let n = h.value;
			if (!n) return;
			let r = Math.max(0, Math.min(e, n.value.length)), i = Math.max(r, Math.min(r + t, n.value.length));
			n.setSelectionRange(r, i), _e();
		}, ke = (e, t = !1) => {
			let n = h.value;
			if (!n || typeof document > "u") return {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			};
			let r = n.getBoundingClientRect(), i = getComputedStyle(n), a = document.createElement("canvas").getContext("2d"), o = Math.max(0, Math.min(e, n.value.length)), s = 0;
			a && (a.font = `${i.fontStyle} ${i.fontWeight} ${i.fontSize} ${i.fontFamily}`, s = a.measureText(n.value.slice(0, o)).width);
			let c = parseFloat(i.paddingLeft) || 0, l = parseFloat(i.paddingTop) || 0, u = parseFloat(i.lineHeight) || 20;
			return {
				x: r.left + c + s + +!!t,
				y: r.top + l,
				width: 1,
				height: u
			};
		}, Ae = (e) => {
			if (!h.value) return;
			let t = ge();
			je(t.start, t.length, e);
		}, je = (e, t, n) => {
			let r = h.value;
			if (!r) return;
			let i = Math.max(0, Math.min(e, r.value.length)), a = Math.max(0, Math.min(t, r.value.length - i)), o = ae(r.value.slice(0, i) + n + r.value.slice(i + a));
			r.value = o, X(o, "ProgrammaticChange", { undo: !0 }), requestAnimationFrame(Z);
		}, Me = () => {
			if (!T.value.length) return;
			let e = T.value.pop() ?? "";
			E.value.push(I.value), X(e, "ProgrammaticChange"), requestAnimationFrame(Z);
		}, Ne = () => {
			if (!E.value.length) return;
			let e = E.value.pop() ?? "";
			T.value.push(I.value), X(e, "ProgrammaticChange"), requestAnimationFrame(Z);
		}, Pe = () => {
			let e = ge();
			e.text && navigator.clipboard?.writeText(e.text);
		}, Fe = () => {
			let e = ge();
			e.text && (navigator.clipboard?.writeText(e.text), Ae(""));
		}, Ie = async () => {
			let e = await navigator.clipboard?.readText();
			e !== void 0 && Ae(e);
		}, Le = () => {
			P.value.text && navigator.clipboard?.writeText(P.value.text);
		}, Re = () => {
			P.value.text && (navigator.clipboard?.writeText(P.value.text), je(P.value.start, P.value.length, ""));
		};
		return ee(ce), w(() => {
			_.value && le("Default"), T.value = [], E.value = [], k.value = !1, j.value = !1;
		}), t({
			Focus: Ee,
			SelectAll: De,
			Select: Oe,
			GetRectFromCharacterIndex: ke,
			Undo: Me,
			Redo: Ne,
			CopySelectionToClipboard: Pe,
			CutSelectionToClipboard: Fe,
			PasteFromClipboard: Ie,
			get CanUndo() {
				return q.value;
			},
			get CanRedo() {
				return J.value;
			},
			get SelectedText() {
				return ge().text;
			},
			set SelectedText(e) {
				Ae(e);
			},
			get SelectionStart() {
				return ge().start;
			},
			get SelectionLength() {
				return ge().length;
			}
		}), (t, n) => (D(), l("div", {
			class: S(["win-textbox", {
				"is-readonly": e.IsReadOnly,
				"is-disabled": R.value,
				"is-focused": _.value,
				"is-hovered": v.value,
				"candidate-window-bottom-edge": e.DesiredCandidateWindowAlignment === "BottomEdge"
			}]),
			style: C(re.value)
		}, [
			s.value || t.$slots.header ? (D(), l("div", zt, [M(t.$slots, "header", {}, () => [p(L(s.value), 1)])])) : c("", !0),
			u("div", {
				class: "win-textbox-border",
				onPointerenter: pe,
				onPointerleave: me
			}, [n[2] ||= u("div", {
				class: "win-textbox-focus-border",
				"aria-hidden": "true"
			}, null, -1), u("div", Bt, [
				M(t.$slots, "field", {
					onFocus: oe,
					onBlur: se,
					onPointerEnter: pe,
					onPointerLeave: me
				}, () => [e.AcceptsReturn ? (D(), l("textarea", {
					key: 0,
					ref_key: "fieldRef",
					ref: h,
					class: "win-textbox-field win-textbox-textarea",
					value: I.value,
					placeholder: e.PlaceholderText,
					readonly: e.IsReadOnly,
					disabled: R.value,
					maxlength: e.MaxLength > 0 ? e.MaxLength : void 0,
					spellcheck: e.IsSpellCheckEnabled,
					inputmode: B.value,
					autocomplete: e.IsTextPredictionEnabled ? "on" : "off",
					autocapitalize: H.value,
					autocorrect: H.value,
					style: C(K.value),
					onInput: Q,
					onFocus: oe,
					onBlur: se,
					onKeydown: he,
					onPaste: be,
					onContextmenu: Se,
					onSelect: _e,
					onCut: ve,
					onCopy: ye,
					onCompositionstart: ue,
					onCompositionupdate: de,
					onCompositionend: fe,
					onPointerenter: pe,
					onPointerleave: me
				}, null, 44, Vt)) : (D(), l("input", {
					key: 1,
					ref_key: "fieldRef",
					ref: h,
					class: "win-textbox-field",
					type: "text",
					value: I.value,
					placeholder: e.PlaceholderText,
					readonly: e.IsReadOnly,
					disabled: R.value,
					maxlength: e.MaxLength > 0 ? e.MaxLength : void 0,
					spellcheck: e.IsSpellCheckEnabled,
					inputmode: B.value,
					autocomplete: e.IsTextPredictionEnabled ? "on" : "off",
					autocapitalize: H.value,
					autocorrect: H.value,
					style: C(K.value),
					onInput: Q,
					onFocus: oe,
					onBlur: se,
					onKeydown: he,
					onPaste: be,
					onContextmenu: Se,
					onSelect: _e,
					onCut: ve,
					onCopy: ye,
					onCompositionstart: ue,
					onCompositionupdate: de,
					onCompositionend: fe,
					onPointerenter: pe,
					onPointerleave: me
				}, null, 44, Ht))]),
				ne.value ? (D(), l("button", b({
					key: 0,
					class: "win-textbox-delete-button",
					type: "button",
					"aria-label": z(r)("text.clear-text")
				}, { "tooltipservice.tooltip": z(r)("text.clear-text") }, {
					onPointerdown: n[0] ||= G(() => {}, ["prevent"]),
					onClick: Ce
				}), [...n[1] ||= [u("span", { class: "win-textbox-delete-button-layout" }, [u("span", { class: "win-textbox-delete-glyph" }, "")], -1)]], 16, Ut)) : c("", !0),
				M(t.$slots, "actions")
			])], 32),
			d.value || t.$slots.description ? (D(), l("div", Wt, [M(t.$slots, "description", {}, () => [p(L(d.value), 1)])])) : c("", !0),
			m(It, {
				Open: k.value,
				AnchorRect: N.value,
				Items: ie.value,
				MinWidth: 160,
				Placement: "Right",
				onClose: we,
				onSelect: Te
			}, null, 8, [
				"Open",
				"AnchorRect",
				"Items"
			])
		], 6));
	}
}), [["__scopeId", "data-v-178c4dad"]]), Kt = [
	"disabled",
	"aria-label",
	"aria-haspopup",
	"aria-expanded"
], qt = { class: "appbar-button-content-root" }, Jt = {
	key: 0,
	class: "appbar-button-icon"
}, Yt = ["data-symbol"], Xt = {
	key: 1,
	class: "appbar-button-label"
}, Zt = {
	key: 2,
	class: "icon appbar-button-chevron",
	"aria-hidden": "true"
}, Qt = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	Flyout: h({
		name: "AppBarButton.Flyout",
		__appBarButtonProperty: "flyout",
		setup(e, { slots: t }) {
			return () => _("span", { class: "appbar-button-property" }, t.default?.());
		}
	}),
	__name: "AppBarButton",
	props: {
		Command: { default: void 0 },
		CommandParameter: { default: void 0 },
		Flyout: { default: void 0 },
		Icon: { default: void 0 },
		Label: { default: "" },
		IsCompact: {
			type: Boolean,
			default: !1
		},
		LabelPosition: { default: "Default" },
		IsEnabled: {
			type: Boolean,
			default: void 0
		},
		Visibility: { default: "Visible" },
		"ToolTipService.ToolTip": { default: void 0 },
		"AutomationProperties.Name": { default: void 0 },
		AllowFocusOnInteraction: {
			type: Boolean,
			default: !1
		},
		KeyboardAccelerators: { default: void 0 },
		KeyboardAcceleratorTextOverride: { default: void 0 },
		Background: { default: void 0 },
		Foreground: { default: void 0 },
		BorderBrush: { default: void 0 },
		BorderThickness: { default: void 0 },
		CornerRadius: { default: void 0 },
		Margin: { default: void 0 },
		Padding: { default: void 0 },
		Width: { default: void 0 },
		Height: { default: void 0 },
		MinWidth: { default: void 0 },
		MinHeight: { default: void 0 },
		MaxWidth: { default: void 0 },
		MaxHeight: { default: void 0 },
		FontFamily: { default: void 0 },
		FontWeight: { default: void 0 },
		FontSize: { default: void 0 },
		HorizontalAlignment: { default: void 0 },
		VerticalAlignment: { default: void 0 }
	},
	emits: ["Click", "Select"],
	setup(e, { emit: n }) {
		let r = (e) => !("Items" in e) && ("ShowAt" in e && typeof e.ShowAt == "function" || "Hide" in e && typeof e.Hide == "function" || "Toggle" in e && typeof e.Toggle == "function" || "IsOpen" in e), i = e, a = n, d = ne(), f = A();
		O("buttonFlyoutAnchor", f);
		let p = A(), m = A(!1), g = A(!1), v = A(!1), y = o(() => {
			let e = [], t = [];
			for (let n of d.default?.() ?? []) {
				let r = n?.type;
				if ((r && typeof r == "object" ? r.__appBarButtonProperty : void 0) === "flyout") {
					let e = n.children && typeof n.children == "object" ? n.children.default : void 0;
					e && t.push(...e());
				} else e.push(n);
			}
			return {
				content: e,
				flyout: t
			};
		}), x = o(() => y.value.flyout), S = o(() => y.value.content), C = h({
			name: "AppBarButtonContentOutlet",
			setup() {
				return () => _(t, S.value);
			}
		}), T = h({
			name: "AppBarButtonFlyoutOutlet",
			setup() {
				return () => _(t, x.value);
			}
		}), E = o(() => Array.isArray(i.Flyout) || !!(i.Flyout && "Items" in i.Flyout)), k = o(() => {
			let e = i.Flyout;
			return !e || Array.isArray(e) || !r(e) ? null : e;
		}), j = o(() => E.value || k.value !== null || x.value.length > 0), N = o(() => k.value?.IsOpen ?? v.value), P = o(() => Array.isArray(i.Flyout) ? { Items: i.Flyout } : i.Flyout && "Items" in i.Flyout ? i.Flyout : { Items: [] }), F = o(() => P.value.Items || []), I = o(() => {
			let e = i.Command?.IconSource;
			return typeof e == "string" ? e : e?.Symbol;
		}), R = o(() => i.Icon ?? I.value), te = o(() => i.Label || i.Command?.Label || ""), B = o(() => i.IsCompact), V = o(() => i.LabelPosition === "Collapsed"), H = o(() => i.IsEnabled === void 0 ? i.Command?.CanExecute?.(i.CommandParameter) ?? !0 : i.IsEnabled), U = o(() => i["ToolTipService.ToolTip"] || (B.value || V.value ? i.Command?.Description || te.value : "")), W = o(() => i["AutomationProperties.Name"]), G = o(() => !!(d.content || R.value)), re = (e) => {
			if (!(e === void 0 || e === "")) return typeof e == "number" || !Number.isNaN(Number(e)) ? `${Number(e)}px` : e;
		}, K = (e) => {
			if (e === void 0 || e === "") return;
			let t = String(e).split(",").map((e) => re(e.trim()) || "0");
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : String(e);
		}, q = o(() => ({
			"--AppBarButtonBackground": i.Background || void 0,
			"--AppBarButtonForeground": i.Foreground || void 0,
			"--AppBarButtonBorderBrush": i.BorderBrush || void 0,
			"--AppBarButtonBorderThickness": K(i.BorderThickness),
			"--AppBarButtonCornerRadius": re(i.CornerRadius),
			margin: K(i.Margin),
			width: re(i.Width),
			height: re(i.Height),
			minWidth: re(i.MinWidth),
			minHeight: re(i.MinHeight),
			maxWidth: re(i.MaxWidth),
			maxHeight: re(i.MaxHeight),
			fontFamily: i.FontFamily,
			fontWeight: i.FontWeight,
			fontSize: re(i.FontSize),
			justifySelf: i.HorizontalAlignment ? {
				Left: "start",
				Center: "center",
				Right: "end",
				Stretch: "stretch"
			}[i.HorizontalAlignment] : void 0,
			alignSelf: i.VerticalAlignment ? {
				Top: "start",
				Center: "center",
				Bottom: "end",
				Stretch: "stretch"
			}[i.VerticalAlignment] : void 0
		})), J = o(() => ({
			"win-appbar-button": !0,
			compact: B.value,
			collapsed: i.Visibility === "Collapsed",
			"pointer-over": m.value && H.value,
			pressed: g.value && H.value,
			"label-right": i.LabelPosition === "Right",
			"label-collapsed": V.value,
			"has-flyout": j.value
		})), ie = {
			Accept: "",
			Add: "",
			AttachCamera: "",
			Back: "",
			Cancel: "",
			Close: "",
			Copy: "",
			Cut: "",
			Delete: "",
			Dislike: "",
			Edit: "",
			Favorite: "",
			Flag: "",
			FontDecrease: "",
			FontIncrease: "",
			Forward: "",
			Like: "",
			Help: "",
			More: "",
			OpenFile: "",
			Paste: "",
			Pause: "",
			Play: "",
			Redo: "",
			Refresh: "",
			Save: "",
			SelectAll: "",
			Send: "",
			Setting: "",
			Share: "",
			Sort: "",
			Stop: "",
			Orientation: "",
			Undo: "",
			Bold: "",
			Italic: "",
			Underline: ""
		}, Y = (e) => ie[e] ?? "", X = () => {
			let e = f.value?.getBoundingClientRect();
			e && (p.value = e);
		}, Z = () => {
			v.value = !1;
		}, ae = (e) => a("Select", e), Q = (e) => {
			g.value = !0, m.value = e.pointerType !== "touch", i.AllowFocusOnInteraction || e.preventDefault();
		}, oe = (e) => {
			m.value = e.pointerType !== "touch";
		}, se = () => {
			m.value = !1, g.value = !1;
		}, ce = () => {
			g.value = !1;
		}, le = () => {
			m.value = !1, g.value = !1;
		}, ue = (e) => {
			if (e.pointerType === "touch") {
				m.value = !1;
				return;
			}
			let t = document.elementFromPoint(e.clientX, e.clientY);
			m.value = !!(f.value && t && f.value.contains(t));
		}, de = (e) => {
			H.value && (i.Command?.Execute?.(i.CommandParameter), k.value ? k.value.ShowAt?.(f.value) : E.value ? (X(), v.value = !v.value) : x.value.length && window.dispatchEvent(new CustomEvent("winui-flyout-toggle")), g.value = !1, a("Click", e));
		}, fe = (e) => {
			!v.value || f.value?.contains(e.target) || e.target instanceof Element && e.target.closest(".win-menu-flyout-wrap") || Z();
		}, $ = () => Z(), pe = (e) => {
			if (e.key === "Escape" && v.value) {
				e.preventDefault(), Z();
				return;
			}
			let t = i.KeyboardAccelerators?.[0];
			if (!t || !H.value) return;
			let n = t.Modifiers || [];
			e.key.toLowerCase() === t.Key.toLowerCase() && e.ctrlKey === n.includes("Control") && e.shiftKey === n.includes("Shift") && e.altKey === n.includes("Alt") && (e.preventDefault(), f.value?.click());
		};
		return ee(() => {
			document.addEventListener("pointerdown", fe, !0), document.addEventListener("pointermove", ue, !0), document.addEventListener("pointerup", ce, !0), document.addEventListener("pointercancel", ce, !0), window.addEventListener("blur", $), window.addEventListener("resize", X), document.addEventListener("keydown", pe, !0);
		}), w(() => {
			document.removeEventListener("pointerdown", fe, !0), document.removeEventListener("pointermove", ue, !0), document.removeEventListener("pointerup", ce, !0), document.removeEventListener("pointercancel", ce, !0), window.removeEventListener("blur", $), window.removeEventListener("resize", X), document.removeEventListener("keydown", pe, !0);
		}), (e, n) => (D(), l(t, null, [
			u("button", b({
				ref_key: "buttonRef",
				ref: f,
				class: J.value,
				disabled: !H.value,
				"aria-label": W.value || te.value || void 0,
				"aria-haspopup": j.value ? E.value ? "menu" : "dialog" : void 0,
				"aria-expanded": j.value ? N.value : void 0,
				style: q.value
			}, {
				...e.$attrs,
				...U.value ? { "tooltipservice.tooltip": U.value } : {}
			}, {
				type: "button",
				onClick: de,
				onPointerenter: oe,
				onPointerleave: se,
				onPointerdown: Q,
				onPointerup: ce,
				onPointercancel: ce,
				onLostpointercapture: ce
			}), [n[0] ||= u("span", {
				class: "appbar-button-inner-border",
				"aria-hidden": "true"
			}, null, -1), u("span", qt, [
				G.value ? (D(), l("span", Jt, [S.value.length ? (D(), s(z(C), { key: 0 })) : M(e.$slots, "content", { key: 1 }, () => [R.value ? (D(), l("span", {
					key: 0,
					class: "symbol-icon",
					"data-symbol": R.value
				}, L(Y(R.value)), 9, Yt)) : c("", !0)], !0)])) : c("", !0),
				!B.value && !V.value && te.value ? (D(), l("span", Xt, L(te.value), 1)) : c("", !0),
				j.value ? (D(), l("span", Zt, "")) : c("", !0)
			])], 16, Kt),
			E.value ? (D(), s(It, {
				key: 0,
				Open: v.value,
				AnchorRect: p.value,
				Items: F.value,
				Placement: P.value.Placement || "Bottom",
				Theme: P.value.Theme || "",
				onClose: Z,
				onPointerEnter: le,
				onSelect: ae
			}, null, 8, [
				"Open",
				"AnchorRect",
				"Items",
				"Placement",
				"Theme"
			])) : c("", !0),
			x.value.length ? (D(), s(z(T), { key: 1 })) : c("", !0)
		], 64));
	}
}), [["__scopeId", "data-v-9d5a7d4e"]]), $t = /* @__PURE__ */ h({
	inheritAttrs: !1,
	__name: "AppBarToggleButton",
	props: {
		IsChecked: {
			type: [
				Boolean,
				null,
				String
			],
			default: !1
		},
		IsThreeState: {
			type: [Boolean, String],
			default: !1
		}
	},
	emits: [
		"Click",
		"Checked",
		"Unchecked",
		"Indeterminate",
		"update:IsChecked"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = (e) => e === !0 || e === "True" || e === "true", a = (e) => e === null || e === "Null" || e === "null", o = (e) => a(e) ? null : i(e), c = () => i(n.IsThreeState), l = A(o(n.IsChecked));
		V(() => n.IsChecked, (e) => {
			l.value = o(e);
		});
		let u = () => c() ? l.value === !1 ? !0 : l.value === !0 ? null : !1 : l.value !== !0, f = (e) => {
			let t = u();
			l.value = t, r("update:IsChecked", t), r(t === !0 ? "Checked" : t === !1 ? "Unchecked" : "Indeterminate", e), r("Click", e);
		};
		return (e, t) => (D(), s(Qt, b(e.$attrs, {
			class: {
				"win-appbar-toggle-button": !0,
				"appbar-toggle-button-checked": l.value === !0 || l.value === null,
				"appbar-toggle-button-indeterminate": l.value === null
			},
			"aria-pressed": l.value === null ? "mixed" : l.value,
			onClick: f
		}), d({ _: 2 }, [e.$slots.content || e.$slots.default ? {
			name: "content",
			fn: H(() => [M(e.$slots, "content", {}, () => [M(e.$slots, "default")])]),
			key: "0"
		} : void 0]), 1040, ["class", "aria-pressed"]));
	}
}), en = [
	"tabindex",
	"aria-orientation",
	"aria-hidden"
], tn = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	inheritAttrs: !0,
	__name: "AppBarSeparator",
	props: {
		IsCompact: {
			type: [Boolean, String],
			default: !1
		},
		UseOverflowStyle: {
			type: [Boolean, String],
			default: !1
		},
		IsInOverflow: {
			type: [Boolean, String],
			default: !1
		},
		DynamicOverflowOrder: { default: -1 },
		IsTabStop: {
			type: [Boolean, String],
			default: !1
		},
		Visibility: { default: "Visible" },
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		Foreground: { default: void 0 },
		Padding: { default: void 0 },
		Margin: { default: void 0 },
		Width: { default: void 0 },
		Height: { default: void 0 },
		HorizontalAlignment: { default: void 0 },
		VerticalAlignment: { default: void 0 }
	},
	setup(e) {
		let t = e, n = te(), r = o(() => !!n.class?.split(" ").includes("is-horizontal")), i = (e) => e === !0 || e === "True", a = o(() => i(t.UseOverflowStyle) || i(t.IsInOverflow)), s = (e) => {
			if (!(e === void 0 || e === "")) return typeof e == "number" || !Number.isNaN(Number(e)) ? `${Number(e)}px` : String(e);
		}, d = (e) => {
			if (e === void 0 || e === "") return;
			let t = String(e).split(",").map((e) => s(e.trim()) || "0");
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : String(e);
		}, f = o(() => ({
			"win-appbar-separator": !0,
			"is-compact": i(t.IsCompact),
			"is-overflow": a.value,
			"is-disabled": !i(t.IsEnabled),
			"is-hidden": t.Visibility === "Hidden"
		})), p = o(() => ({
			"--AppBarSeparatorForeground": t.Foreground || void 0,
			padding: d(t.Padding),
			margin: d(t.Margin),
			width: s(t.Width),
			height: s(t.Height),
			justifySelf: t.HorizontalAlignment ? {
				Left: "start",
				Center: "center",
				Right: "end",
				Stretch: "stretch"
			}[t.HorizontalAlignment] : void 0,
			alignSelf: t.VerticalAlignment ? {
				Top: "start",
				Center: "center",
				Bottom: "end",
				Stretch: "stretch"
			}[t.VerticalAlignment] : void 0
		}));
		return (t, n) => e.Visibility === "Collapsed" ? c("", !0) : (D(), l("div", {
			key: 0,
			class: S(f.value),
			style: C(p.value),
			role: "separator",
			tabindex: i(e.IsTabStop) ? 0 : -1,
			"aria-orientation": a.value || r.value ? "horizontal" : "vertical",
			"aria-hidden": e.Visibility === "Hidden" ? "true" : void 0
		}, [...n[0] ||= [u("div", {
			class: "separator-line",
			"aria-hidden": "true"
		}, null, -1)]], 14, en));
	}
}), [["__scopeId", "data-v-625ef65c"]]), nn = ["aria-label", "aria-expanded"], rn = { class: "commandbar-surface" }, an = ["aria-label", "aria-expanded"], on = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "CommandBar",
	props: {
		IsOpen: { type: Boolean },
		IsSticky: { type: Boolean },
		DefaultLabelPosition: {},
		PrimaryCommands: {},
		SecondaryCommands: {},
		IsDynamicOverflowEnabled: { type: Boolean },
		OverflowButtonVisibility: {},
		Background: {},
		Foreground: {},
		CornerRadius: {},
		HorizontalAlignment: {},
		"AutomationProperties.Name": {},
		Theme: {}
	},
	emits: [
		"Opening",
		"Opened",
		"Closing",
		"Closed",
		"DynamicOverflowItemsChanging",
		"update:IsOpen"
	],
	setup(e, { expose: n, emit: r }) {
		let { t: i } = rt(), a = e, d = r, f = A(), p = A(), m = A(), h = A(null), g = A(a.IsOpen ?? !1), _ = A(!1), v = A([]), y = A([]), T, E = 0, O = o(() => a.PrimaryCommands ?? []), k = o(() => a.SecondaryCommands ?? []), M = o(() => a.IsSticky ?? !1), N = o(() => a.DefaultLabelPosition ?? "Bottom"), F = o(() => a.IsDynamicOverflowEnabled ?? !0), I = o(() => a.OverflowButtonVisibility ?? "Auto"), L = o(() => a["AutomationProperties.Name"] || i("text.command-bar")), R = o(() => g.value), te = (e) => {
			if (!(e === void 0 || e === "")) return typeof e == "number" || !Number.isNaN(Number(e)) ? `${Number(e)}px` : e;
		}, ne = o(() => a.HorizontalAlignment ?? "Stretch"), B = o(() => ne.value === "Stretch"), H = o(() => ({
			"--CommandBarBackground": a.Background || void 0,
			"--CommandBarForeground": a.Foreground || void 0,
			"--CommandBarCornerRadius": te(a.CornerRadius),
			width: B.value ? void 0 : "max-content",
			maxWidth: B.value ? void 0 : "100%",
			alignSelf: {
				Left: "flex-start",
				Center: "center",
				Right: "flex-end",
				Stretch: "stretch"
			}[ne.value],
			justifySelf: {
				Left: "start",
				Center: "center",
				Right: "end",
				Stretch: "stretch"
			}[ne.value]
		})), U = o(() => ({
			Bottom: "Default",
			Right: "Right",
			Collapsed: "Collapsed"
		})[N.value]), W = o(() => k.value.length > 0), re = o(() => I.value === "Collapsed" ? !1 : I.value === "Visible" ? !0 : O.value.length > 0 || W.value || y.value.length > 0), K = o(() => ({
			"win-commandbar": !0,
			open: R.value,
			"has-overflow": re.value,
			"label-bottom": N.value === "Bottom",
			"label-right": N.value === "Right",
			"label-collapsed": N.value === "Collapsed"
		})), q = (e) => e.Component, J = (e) => e.Props ?? {}, ie = (e, t, n = "primary") => e.Key ?? `${n}-${t}`, Y = {
			Accept: "",
			Add: "",
			Back: "",
			Cancel: "",
			Close: "",
			Copy: "",
			Cut: "",
			Delete: "",
			Edit: "",
			Favorite: "",
			Flag: "",
			FontDecrease: "",
			FontIncrease: "",
			Forward: "",
			Help: "",
			More: "",
			OpenFile: "",
			Paste: "",
			Pause: "",
			Play: "",
			Redo: "",
			Refresh: "",
			Save: "",
			SelectAll: "",
			Send: "",
			Setting: "",
			Share: "",
			Sort: "",
			Stop: "",
			Undo: "",
			Bold: "",
			Italic: "",
			Underline: ""
		}, X = (e) => e.Component === tn, Z = (e) => e.Props?.Command, ae = (e) => {
			let t = e.Props?.Label;
			return typeof t == "string" ? t : Z(e)?.Label ?? "";
		}, Q = (e) => {
			let t = e.Props?.Icon ?? Z(e)?.IconSource, n = typeof t == "string" ? t : t && typeof t == "object" && "Symbol" in t && typeof t.Symbol == "string" ? t.Symbol : "";
			return n ? Y[n] ?? n : "";
		}, oe = (e) => {
			if (X(e)) return { Kind: "MenuFlyoutSeparator" };
			let t = Z(e), n = e.Props?.CommandParameter, r = e.Props?.IsEnabled;
			return {
				Kind: "MenuFlyoutItem",
				Text: ae(e),
				Icon: Q(e),
				IsEnabled: r === void 0 ? t?.CanExecute?.(n) ?? !0 : r !== !1,
				KeyboardAccelerators: e.Props?.KeyboardAccelerators ?? t?.KeyboardAccelerators,
				KeyboardAcceleratorTextOverride: e.Props?.KeyboardAcceleratorTextOverride,
				Command: { Execute: () => {
					t?.Execute?.(n), e.Click?.();
				} }
			};
		}, se = o(() => {
			let e = y.value.map(oe), t = k.value.map(oe);
			return e.length && t.length ? [
				...e,
				{ Kind: "MenuFlyoutSeparator" },
				...t
			] : [...e, ...t];
		}), ce = (e) => {
			g.value = e, d("update:IsOpen", e);
		}, le = () => {
			h.value = m.value?.getBoundingClientRect() ?? null;
		}, ue = async () => {
			!re.value || !se.value.length || (await x(), le(), h.value && (_.value = !0));
		}, de = async () => {
			R.value || (le(), d("Opening"), ce(!0), await x(), le(), d("Opened")), await ue();
		}, fe = async (e = !0) => {
			R.value && (!e && M.value || (d("Closing"), _.value = !1, ce(!1), await x(), d("Closed")));
		}, $ = () => {
			R.value ? fe(!0) : de();
		}, pe = async () => {
			if (R.value) {
				_.value ? me() : await fe(!0);
				return;
			}
			await de();
		}, me = () => {
			_.value = !1, R.value && fe(!0);
		}, he = (e, t) => {
			e.Click?.(t), R.value && !M.value && fe(!1);
		}, ge = () => {
			me();
		}, _e = () => {
			me();
		}, ve = (e) => {
			if (e.key === "Escape") {
				if (_.value) {
					e.preventDefault(), me();
					return;
				}
				R.value && (e.preventDefault(), fe(!0));
			}
		}, ye = (e) => {
			!R.value || se.value.length || M.value || (e.composedPath?.() || []).some((e) => e instanceof Element && e.classList.contains("win-commandbar")) || fe(!0);
		}, be = async () => {
			let e = ++E;
			if (v.value = [...O.value], y.value = [], await x(), e !== E || !F.value || !f.value || !p.value) return;
			let t = Array.from(p.value.children);
			if (!t.length) return;
			let n = f.value.clientWidth, r = t.reduce((e, t) => e + t.getBoundingClientRect().width, 0), i = W.value || I.value === "Visible", a = Math.max(0, n - 4);
			if (!i && r <= a) return;
			let o = Math.max(0, n - 52), s = 0, c = 0;
			for (let e of t) {
				let t = e.getBoundingClientRect().width;
				if (s + t > o) break;
				s += t, c += 1;
			}
			c < O.value.length && (d("DynamicOverflowItemsChanging"), v.value = O.value.slice(0, c), y.value = O.value.slice(c));
		};
		return V(() => a.IsOpen, (e) => {
			e === void 0 || e === R.value || (e ? de() : fe(!0));
		}), V(O, () => void be(), {
			deep: !0,
			immediate: !0
		}), V(k, () => void be(), { deep: !0 }), V([
			F,
			I,
			N
		], () => void be()), ee(async () => {
			typeof ResizeObserver < "u" && f.value && (T = new ResizeObserver(() => {
				be(), (R.value || _.value) && le();
			}), T.observe(f.value)), window.addEventListener("resize", le), document.addEventListener("pointerdown", ye, !0), le(), await be(), R.value && await ue();
		}), w(() => {
			T?.disconnect(), window.removeEventListener("resize", le), document.removeEventListener("pointerdown", ye, !0);
		}), n({
			Open: de,
			Close: fe,
			Toggle: $,
			IsOpen: R
		}), (n, r) => (D(), l("div", {
			ref_key: "commandBarRoot",
			ref: f,
			class: S(K.value),
			role: "toolbar",
			"aria-label": L.value,
			"aria-expanded": R.value,
			style: C(H.value),
			onKeydown: ve
		}, [u("div", rn, [u("div", {
			ref_key: "primaryContent",
			ref: p,
			class: "commandbar-primary-content"
		}, [(D(!0), l(t, null, j(v.value, (e, t) => (D(), s(P(q(e)), b({ key: ie(e, t) }, { ref_for: !0 }, J(e), {
			LabelPosition: U.value,
			onClick: (t) => he(e, t)
		}), null, 16, ["LabelPosition", "onClick"]))), 128))], 512), re.value ? (D(), l("button", b({
			key: 0,
			ref_key: "overflowButton",
			ref: m,
			class: ["commandbar-overflow-button", { "is-active": R.value }],
			type: "button",
			"aria-label": R.value ? z(i)("text.less-app-bar") : z(i)("text.more-options"),
			"aria-expanded": R.value
		}, { "tooltipservice.tooltip": R.value ? z(i)("text.see-less") : z(i)("text.see-more") }, { onClick: G(pe, ["stop"]) }), [...r[0] ||= [u("span", {
			class: "commandbar-ellipsis",
			"aria-hidden": "true"
		}, "", -1)]], 16, an)) : c("", !0)]), h.value && se.value.length ? (D(), s(It, {
			key: 0,
			Open: _.value,
			AnchorRect: h.value,
			Items: se.value,
			Placement: "BottomEdgeAlignedRight",
			MinWidth: 160,
			Gap: 0,
			OverlayInputPassThroughElement: "",
			CloseAnimation: "CommandBar",
			Theme: e.Theme,
			onClose: ge,
			onSelect: _e
		}, null, 8, [
			"Open",
			"AnchorRect",
			"Items",
			"Theme"
		])) : c("", !0)], 46, nn));
	}
}), [["__scopeId", "data-v-3ee998d2"]]), sn = { class: "win-cbf-layout-root" }, cn = { class: "win-cbf-outer-content-root" }, ln = { class: "win-cbf-content-root" }, un = { class: "win-cbf-primary-items-root" }, dn = {
	key: 0,
	class: "win-cbf-primary-items-control",
	role: "toolbar"
}, fn = ["aria-label", "aria-expanded"], pn = {
	key: 0,
	class: "win-cbf-outer-overflow-content-root"
}, mn = { class: "win-cbf-overflow-content-root" }, hn = {
	class: "win-cbf-secondary-items-control",
	role: "menu"
}, gn = [
	"aria-label",
	"aria-haspopup",
	"aria-pressed",
	"disabled",
	"onClick"
], _n = {
	key: 0,
	class: "win-cbf-overflow-check",
	"aria-hidden": "true"
}, vn = { class: "win-cbf-overflow-label" }, yn = {
	key: 2,
	class: "win-cbf-overflow-accelerator"
}, bn = {
	key: 3,
	class: "win-cbf-overflow-chevron",
	"aria-hidden": "true"
}, xn = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "CommandBarFlyout",
	props: {
		Open: {
			type: Boolean,
			default: !1
		},
		AnchorRect: { default: null },
		PrimaryCommands: { default: () => [] },
		SecondaryCommands: { default: () => [] },
		AlwaysExpanded: {
			type: Boolean,
			default: !1
		},
		Placement: { default: "Auto" },
		ShowMode: { default: "Standard" },
		MinWidth: { default: 0 },
		Theme: { default: "" }
	},
	emits: [
		"Close",
		"Click",
		"Opening",
		"Opened",
		"Closing",
		"Closed"
	],
	setup(e, { expose: r, emit: a }) {
		let { t: d } = rt(), f = e, p = a, h = A(null), g = A(f.Open), _ = A(f.AlwaysExpanded), v = A(f.AlwaysExpanded), y = A(""), T = A({
			right: "0px",
			bottom: "0px"
		}), E = A(f.AnchorRect), O = A(f.Placement), k = A({
			top: 0,
			left: 0
		}), M = o(() => f.PrimaryCommands ?? []), N = o(() => f.SecondaryCommands ?? []), P = o(() => N.value.some((e) => !!e.Icon)), F = o(() => f.AlwaysExpanded), I = o(() => f.Theme === "light" || f.Theme === "dark" ? `win-theme-scope theme-${f.Theme}` : ""), R = 0, te = o(() => N.value.length > 0 && v.value), ne = o(() => ({
			"is-expanded": v.value,
			"is-panel-expanding-setup": y.value === "expanding-setup",
			"is-panel-expanding": y.value === "expanding",
			"is-panel-collapsing": y.value === "collapsing"
		})), B = o(() => ({
			top: `${k.value.top}px`,
			left: `${k.value.left}px`,
			minWidth: f.MinWidth ? `${f.MinWidth}px` : void 0,
			"--cbf-collapsed-right": T.value.right,
			"--cbf-collapsed-bottom": T.value.bottom
		})), U = (e) => e.Name || e.Label, W = (e) => e["ToolTipService.ToolTip"] ? { "tooltipservice.tooltip": e["ToolTipService.ToolTip"] } : {}, re = o(() => M.value.map((e) => ({
			Component: e.IsToggle ? $t : Qt,
			Props: {
				Icon: e.Icon,
				Label: e.Label,
				IsEnabled: e.IsEnabled,
				IsChecked: e.IsChecked,
				"ToolTipService.ToolTip": e["ToolTipService.ToolTip"],
				KeyboardAcceleratorTextOverride: e.KeyboardAcceleratorTextOverride,
				AllowFocusOnInteraction: !1
			},
			Key: U(e),
			Click: (t) => {
				t && fe(e, t);
			}
		}))), K = (e) => ({
			"is-toggle": e.IsToggle,
			"is-checked": e.IsChecked,
			"has-check": e.IsToggle,
			"has-menu-icon": P.value,
			"has-keyboard-accelerator": !!e.KeyboardAcceleratorTextOverride,
			"has-flyout": !!e.Flyout
		}), q = {
			Share: "",
			Save: "",
			Delete: "",
			Cut: "",
			Copy: "",
			Paste: "",
			Undo: "",
			Redo: "",
			SelectAll: "",
			Bold: "",
			Italic: "",
			Underline: ""
		}, J = (e) => q[e] ?? e, ie = () => {
			let e = h.value;
			if (!e) return {
				width: 0,
				height: 0
			};
			let t = e.querySelector(".win-cbf-primary-items-root");
			return {
				width: Math.max(1, t?.offsetWidth ?? 0),
				height: Math.max(1, t?.offsetHeight ?? 0)
			};
		}, Y = (e, t = ie()) => {
			T.value = {
				right: `${Math.max(0, e.width - t.width)}px`,
				bottom: `${Math.max(0, e.height - t.height)}px`
			};
		}, X = () => {
			R &&= (window.clearTimeout(R), 0);
		}, Z = () => {
			y.value === "collapsing" && (v.value = !1), y.value = "", R = 0, x(se);
		}, ae = (e = 200) => {
			X(), R = window.setTimeout(Z, e);
		}, Q = () => new Promise((e) => window.requestAnimationFrame(() => e())), oe = (e, t) => {
			if (t !== "Auto") return t;
			let n = window.innerHeight - e.bottom, r = e.top, i = window.innerWidth - e.right, a = e.left;
			return n >= 120 ? "Bottom" : r >= 120 ? "Top" : i >= 180 ? "Right" : a >= 180 ? "Left" : "Bottom";
		}, se = async () => {
			let e = E.value;
			if (!e) return;
			O.value = oe(e, f.Placement);
			let t = e.bottom, n = e.left;
			O.value.includes("Top") && (t = e.top), O.value.includes("Bottom") && (t = e.bottom), O.value.includes("Left") && (t = e.top, n = e.left), O.value.includes("Right") && (t = e.top, n = e.right), O.value.includes("AlignedBottom") && (t = e.bottom), O.value.includes("AlignedRight") && (n = e.right), k.value = {
				top: t,
				left: n
			}, await x();
			let r = h.value;
			if (!r) return;
			let i = r.getBoundingClientRect(), a = k.value.top, o = k.value.left;
			O.value.includes("Top") && (a -= i.height), O.value.includes("Left") && (o -= i.width), O.value.includes("AlignedRight") && (o -= i.width), o = Math.max(8, Math.min(window.innerWidth - i.width - 8, o)), a = Math.max(8, Math.min(window.innerHeight - i.height - 8, a)), k.value = {
				top: a,
				left: o
			};
		}, ce = async (e, t = {}) => {
			E.value = e, O.value = t.Placement ?? f.Placement, _.value = f.AlwaysExpanded, v.value = f.AlwaysExpanded, y.value = "", p("Opening"), g.value = !0, await x(), await se(), p("Opened");
		}, le = async (e, t = {}) => {
			await ce(e.getBoundingClientRect(), {
				Placement: t.Placement,
				ShowMode: t.ShowMode
			});
		}, ue = () => {
			g.value && (p("Closing"), X(), g.value = !1, _.value = f.AlwaysExpanded, v.value = f.AlwaysExpanded, y.value = "", p("Close"), p("Closed"));
		}, de = async () => {
			if (!N.value.length || f.AlwaysExpanded) return;
			if (_.value) {
				let e = h.value;
				e && Y(e.getBoundingClientRect()), _.value = !1, y.value = "collapsing", ae(167);
				return;
			}
			let e = ie();
			v.value = !0, _.value = !0, await x(), await se(), h.value && Y(h.value.getBoundingClientRect(), e), y.value = "expanding-setup", await Q(), y.value = "expanding", ae(200);
		}, fe = (e, t) => {
			e.IsEnabled !== !1 && (e.Click?.(e, t), p("Click", e, t), ue());
		}, $ = (e) => {
			e.key === "Escape" && (e.preventDefault(), ue());
		}, pe = (e) => {
			g.value && (h.value?.contains(e.target) || ue());
		};
		return V(() => f.Open, (e) => {
			e && f.AnchorRect ? ce(f.AnchorRect) : e || ue();
		}), V(() => f.AnchorRect, (e) => {
			E.value = e, g.value && se();
		}), ee(() => {
			document.addEventListener("pointerdown", pe), window.addEventListener("resize", se), window.addEventListener("scroll", se, !0);
		}), w(() => {
			X(), document.removeEventListener("pointerdown", pe), window.removeEventListener("resize", se), window.removeEventListener("scroll", se, !0);
		}), r({
			showAt: le,
			hide: ue,
			openAt: ce,
			isOpen: g
		}), (r, a) => (D(), s(n, { to: "body" }, [m(i, { name: "cbf-flyout" }, {
			default: H(() => [g.value ? (D(), l("div", {
				key: 0,
				ref_key: "flyoutRef",
				ref: h,
				class: S(["win-commandbar-flyout", [
					I.value,
					`placement-${O.value.toLowerCase()}`,
					ne.value
				]]),
				style: C(B.value),
				role: "menu",
				onKeydown: $,
				onPointerdown: a[0] ||= G(() => {}, ["stop"])
			}, [u("div", sn, [u("div", cn, [u("div", ln, [u("div", un, [M.value.length ? (D(), l("div", dn, [m(on, {
				class: "win-cbf-commandbar",
				IsOpen: !0,
				IsSticky: !0,
				IsDynamicOverflowEnabled: !1,
				OverflowButtonVisibility: "Collapsed",
				DefaultLabelPosition: "Collapsed",
				HorizontalAlignment: "Left",
				PrimaryCommands: re.value,
				SecondaryCommands: [],
				Theme: e.Theme
			}, null, 8, ["PrimaryCommands", "Theme"])])) : c("", !0), N.value.length && !F.value ? (D(), l("button", b({
				key: 1,
				class: "win-cbf-more-button",
				type: "button",
				"aria-label": _.value ? z(d)("text.see-less") : z(d)("text.see-more")
			}, { "tooltipservice.tooltip": _.value ? z(d)("text.see-less") : z(d)("text.see-more") }, {
				"aria-expanded": _.value,
				onClick: de
			}), [...a[1] ||= [u("span", {
				class: "win-cbf-ellipsis-icon",
				"aria-hidden": "true"
			}, "", -1)]], 16, fn)) : c("", !0)]), te.value ? (D(), l("div", pn, [u("div", mn, [u("div", hn, [(D(!0), l(t, null, j(N.value, (e) => (D(), l("button", b({
				key: U(e),
				class: ["win-cbf-overflow-button", K(e)],
				type: "button",
				role: "menuitem",
				"aria-label": e.Label,
				"aria-haspopup": e.Flyout ? "menu" : void 0,
				"aria-pressed": e.IsToggle ? !!e.IsChecked : void 0
			}, { ref_for: !0 }, W(e), {
				disabled: e.IsEnabled === !1,
				onClick: (t) => fe(e, t)
			}), [
				e.IsToggle ? (D(), l("span", _n, "")) : c("", !0),
				P.value ? (D(), l("span", {
					key: 1,
					class: S(["win-cbf-overflow-icon", { "is-placeholder": !e.Icon }]),
					"aria-hidden": "true"
				}, L(e.Icon ? J(e.Icon) : ""), 3)) : c("", !0),
				u("span", vn, L(e.Label), 1),
				e.KeyboardAcceleratorTextOverride ? (D(), l("span", yn, L(e.KeyboardAcceleratorTextOverride), 1)) : c("", !0),
				e.Flyout ? (D(), l("span", bn, "")) : c("", !0)
			], 16, gn))), 128))])])])) : c("", !0)])])])], 38)) : c("", !0)]),
			_: 1
		})]));
	}
}), [["__scopeId", "data-v-a55bba48"]]), Sn = [
	"contenteditable",
	"data-placeholder",
	"spellcheck",
	"autocomplete",
	"aria-readonly",
	"onFocus",
	"onBlur",
	"onPointerenter",
	"onPointerleave"
], Cn = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "RichEditBox",
	props: {
		Text: { default: "" },
		Html: { default: "" },
		AcceptsReturn: {
			type: Boolean,
			default: !0
		},
		CharacterCasing: { default: "Normal" },
		ClipboardCopyFormat: { default: "AllFormats" },
		Description: { default: "" },
		DesiredCandidateWindowAlignment: { default: "Default" },
		DisabledFormattingAccelerators: { default: "None" },
		Header: { default: "" },
		HeaderPlacement: { default: "Top" },
		HeaderTemplate: { default: void 0 },
		HorizontalTextAlignment: { default: "Left" },
		InputScope: { default: "Default" },
		IsColorFontEnabled: {
			type: Boolean,
			default: !0
		},
		IsReadOnly: {
			type: Boolean,
			default: !1
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		IsSpellCheckEnabled: {
			type: Boolean,
			default: !0
		},
		IsTextPredictionEnabled: {
			type: Boolean,
			default: !0
		},
		MaxLength: { default: 0 },
		PlaceholderText: { default: "" },
		PreventKeyboardDisplayOnProgrammaticFocus: {
			type: Boolean,
			default: !1
		},
		ProofingMenuFlyout: { default: void 0 },
		SelectionFlyout: { default: void 0 },
		SelectionHighlightColor: { default: "" },
		SelectionHighlightColorWhenNotFocused: { default: "" },
		ShowFormattingCommands: {
			type: Boolean,
			default: !0
		},
		PrimaryCommands: { default: () => [] },
		SecondaryCommands: { default: () => [] },
		TextAlignment: { default: "Left" },
		TextReadingOrder: { default: "DetectFromContent" },
		TextWrapping: { default: "Wrap" },
		Width: { default: "" },
		Height: { default: "" },
		MinHeight: { default: "" }
	},
	emits: [
		"update:Text",
		"update:Html",
		"TextChanged",
		"SelectionChanged",
		"SelectionChanging",
		"ContextMenuOpening",
		"Paste",
		"CopyingToClipboard",
		"CuttingToClipboard",
		"TextChanging",
		"TextCompositionStarted",
		"TextCompositionChanged",
		"TextCompositionEnded",
		"CandidateWindowBoundsChanged",
		"GotFocus",
		"LostFocus"
	],
	setup(e, { expose: n, emit: r }) {
		let { t: i } = rt(), a = g(), s = e, c = o(() => $(s.Header, a)), f = o(() => $(s.Description, a)), h = o(() => String($(s.Text, a) ?? "")), _ = o(() => String($(s.Html, a) ?? "")), v = o(() => $(s.Width, a)), y = o(() => $(s.Height, a)), b = o(() => $(s.MinHeight, a)), S = r, T = A(null), E = A(!1), O = A(!1), k = A(null), j = A(_.value || U(h.value)), N = A(null), P = o(() => s.DisabledFormattingAccelerators.toLowerCase()), F = (e) => P.value.includes("all") || P.value.includes(e), I = o(() => {
			let e = [];
			return s.ShowFormattingCommands && (F("bold") || e.push({
				Name: "BoldButton",
				Label: i("sample.richeditbox.bold"),
				Icon: "Bold",
				"ToolTipService.ToolTip": i("sample.richeditbox.bold"),
				Click: () => void ve("bold"),
				IsToggle: !0,
				IsChecked: ie("bold")
			}), F("italic") || e.push({
				Name: "ItalicButton",
				Label: i("sample.richeditbox.italic"),
				Icon: "Italic",
				"ToolTipService.ToolTip": i("sample.richeditbox.italic"),
				Click: () => void ve("italic"),
				IsToggle: !0,
				IsChecked: ie("italic")
			}), F("underline") || e.push({
				Name: "UnderlineButton",
				Label: i("sample.richeditbox.underline"),
				Icon: "Underline",
				"ToolTipService.ToolTip": i("sample.richeditbox.underline"),
				Click: () => void ve("underline"),
				IsToggle: !0,
				IsChecked: ie("underline")
			})), e.push(...s.PrimaryCommands), e;
		}), R = o(() => {
			let e = J(), t = !s.IsReadOnly && s.IsEnabled, n = [];
			return e && t && n.push({
				Name: "CutButton",
				Label: i("sample.menubar.cut"),
				Icon: "Cut",
				Click: () => void ve("cut")
			}), e && n.push({
				Name: "CopyButton",
				Label: i("sample.copy"),
				Icon: "Copy",
				Click: () => void ve("copy")
			}), t && n.push({
				Name: "PasteButton",
				Label: i("sample.menubar.paste"),
				Icon: "Paste",
				Click: () => void ve("paste")
			}), n.push({
				Name: "UndoButton",
				Label: i("sample.menubar.undo"),
				Icon: "Undo",
				Click: () => void ve("undo")
			}), n.push({
				Name: "RedoButton",
				Label: i("sample.menubar.redo"),
				Icon: "Redo",
				Click: () => void ve("redo")
			}), n.push({
				Name: "SelectAllButton",
				Label: i("sample.select-all"),
				Icon: "",
				Click: () => void ve("selectAll")
			}), n.push(...s.SecondaryCommands), n;
		}), z = (e) => e === "" ? void 0 : typeof e == "number" ? `${e}px` : e, te = o(() => ({
			width: z(v.value ?? ""),
			"--reb-selection-background-blur": s.SelectionHighlightColorWhenNotFocused || void 0
		})), ne = o(() => ({
			height: z(y.value ?? ""),
			minHeight: z(b.value ?? "") || "118px"
		})), B = o(() => ({
			textAlign: (s.TextAlignment || s.HorizontalTextAlignment || "Left").toLowerCase(),
			whiteSpace: s.TextWrapping === "NoWrap" ? "pre" : "pre-wrap",
			overflowWrap: s.TextWrapping === "WrapWholeWords" ? "normal" : "break-word",
			direction: s.TextReadingOrder === "UseFlowDirection" ? "inherit" : void 0
		}));
		function U(e) {
			let t = document.createElement("div");
			return t.innerText = e ?? "", t.innerHTML;
		}
		let W = () => T.value?.innerText.replace(/\n$/, "") ?? "", G = () => {
			!T.value || E.value || (T.value.innerHTML = j.value);
		}, re = (e) => {
			let t = e;
			return s.CharacterCasing === "Upper" && (t = t.toUpperCase()), s.CharacterCasing === "Lower" && (t = t.toLowerCase()), s.MaxLength > 0 && t.length > s.MaxLength && (t = t.slice(0, s.MaxLength)), t;
		}, K = () => {
			let e = window.getSelection();
			e && e.rangeCount > 0 && T.value?.contains(e.anchorNode) && (N.value = e.getRangeAt(0).cloneRange());
		}, q = () => {
			let e = N.value, t = window.getSelection();
			!e || !t || (t.removeAllRanges(), t.addRange(e));
		}, J = () => {
			let e = window.getSelection();
			return !e || e.rangeCount === 0 || !T.value?.contains(e.anchorNode) ? "" : e.toString();
		};
		function ie(e) {
			try {
				return q(), document.queryCommandState(e);
			} catch {
				return !1;
			}
		}
		let Y = () => {
			let e = T.value;
			if (!e) return;
			let t = re(W());
			t !== W() && (e.innerText = t), j.value = e.innerHTML, S("TextChanging", { IsContentChanging: !0 }), S("update:Text", t), S("update:Html", j.value), me(s.Text, t, a), me(s.Html, j.value, a), S("TextChanged");
		}, X = () => {
			let e = {
				SelectionStart: 0,
				SelectionLength: J().length,
				Cancel: !1
			};
			S("SelectionChanging", e), !e.Cancel && S("SelectionChanged");
		}, Z = async () => {
			K(), X(), await x(), le();
		}, ae = (e) => e instanceof Element ? !!e.closest(".scrollbar, .scrollbar-button, .scrollbar-thumb, .scrollbar-track") : !1, Q = (e) => e instanceof Node && !!T.value?.contains(e), oe = (e) => {
			e.button !== 0 || ae(e.target) || Q(e.target) || xe();
		}, se = (e) => !(e instanceof Element) || ae(e) || Q(e) || e.closest(".win-textbox-header, .win-textbox-description") || e.closest("button, a, input, textarea, select, [role=\"button\"]") ? !1 : !!e.closest(".win-textbox-border, .win-textbox-content, .win-reb-editor-scroll, .win-scroll-viewer-viewport, .scroll-content"), ce = (e) => {
			e.button !== 0 || !se(e.target) || xe();
		}, le = () => {
			if (!s.IsEnabled || s.SelectionFlyout === !1) return;
			let e = window.getSelection();
			if (!e || e.rangeCount === 0 || !J()) {
				O.value = !1;
				return;
			}
			k.value = e.getRangeAt(0).getBoundingClientRect(), O.value = I.value.length > 0 || R.value.length > 0;
		}, ue = (e) => {
			if (e.key === "Enter" && !s.AcceptsReturn && e.preventDefault(), !(e.ctrlKey || e.metaKey)) return;
			let t = e.key.toLowerCase();
			t === "b" && !F("bold") && (e.preventDefault(), ve("bold")), t === "i" && !F("italic") && (e.preventDefault(), ve("italic")), t === "u" && !F("underline") && (e.preventDefault(), ve("underline"));
		}, de = (e) => {
			ae(e.target) || Q(e.target) || (xe(), _e(e));
		}, fe = (e) => {
			se(e.target) && (e.stopPropagation(), xe(), _e(e));
		}, pe = (e) => {
			let t = { Handled: !1 };
			S("Paste", t), t.Handled && e.preventDefault();
		}, he = (e) => {
			let t = { Handled: !1 };
			S("CopyingToClipboard", t), t.Handled && e.preventDefault();
			let n = J();
			s.ClipboardCopyFormat === "PlainText" && n && (e.clipboardData?.setData("text/plain", n), e.preventDefault());
		}, ge = (e) => {
			let t = { Handled: !1 };
			S("CuttingToClipboard", t), t.Handled && e.preventDefault();
		}, _e = (e) => {
			let t = {
				Handled: !1,
				CursorLeft: e.clientX,
				CursorTop: e.clientY
			};
			S("ContextMenuOpening", t), !t.Handled && (e.preventDefault(), K(), k.value = {
				x: e.clientX,
				y: e.clientY,
				top: e.clientY,
				bottom: e.clientY,
				left: e.clientX,
				right: e.clientX,
				width: 0,
				height: 0
			}, O.value = I.value.length > 0 || R.value.length > 0);
		}, ve = async (e) => {
			if (s.IsEnabled) {
				if (q(), e === "copy") document.execCommand("copy");
				else if (e === "cut" && !s.IsReadOnly) document.execCommand("cut");
				else if (e === "paste" && !s.IsReadOnly) {
					let e = await navigator.clipboard?.readText().catch(() => "");
					e && document.execCommand("insertText", !1, e);
				} else if (e === "selectAll") {
					let e = document.createRange();
					if (T.value) {
						e.selectNodeContents(T.value);
						let t = window.getSelection();
						t?.removeAllRanges(), t?.addRange(e), K();
					}
				} else e === "undo" ? document.execCommand("undo") : e === "redo" ? document.execCommand("redo") : s.IsReadOnly || document.execCommand(e, !1);
				O.value = !1, Y(), le();
			}
		}, ye = (e) => {
			e?.(), E.value = !0, S("GotFocus");
		}, be = (e) => {
			e?.(), E.value = !1, S("LostFocus");
		}, xe = () => {
			!s.IsEnabled || s.IsReadOnly || T.value?.focus({ preventScroll: s.PreventKeyboardDisplayOnProgrammaticFocus });
		}, Se = () => {
			let e = window.getSelection();
			return e?.rangeCount && T.value?.contains(e.anchorNode) ? !e.getRangeAt(0).collapsed : !!(N.value && !N.value.collapsed);
		}, Ce = (e) => {
			xe(), q();
			try {
				return document.queryCommandState(e);
			} catch {
				return !1;
			}
		}, we = (e, t) => {
			xe(), q(), document.execCommand(e, !1, t), K(), Y();
		}, Te = (e, t = !0) => {
			if (!T.value || s.IsReadOnly || !s.IsEnabled) return;
			xe(), q();
			let n = window.getSelection();
			if (!(n?.rangeCount && T.value.contains(n.anchorNode) && n && !n.getRangeAt(0).collapsed) && t) {
				let e = document.createRange();
				e.selectNodeContents(T.value), n?.removeAllRanges(), n?.addRange(e);
			}
			document.execCommand("foreColor", !1, e), K(), Y();
		}, Ee = (e) => {
			let t = T.value;
			t && (t.querySelectorAll("ol, ul").forEach((t) => {
				t instanceof HTMLElement && (t.style.listStyleType = e), t instanceof HTMLOListElement && (e === "upper-roman" ? t.type = "I" : e === "decimal" && (t.type = "1"));
			}), Y());
		}, De = (e) => {
			j.value = U(e), T.value && (T.value.innerText = e), Y();
		}, Oe = (e) => {
			j.value = e, T.value && (T.value.innerHTML = e), Y();
		}, ke = () => S("TextCompositionStarted"), Ae = () => S("TextCompositionChanged"), je = () => S("TextCompositionEnded");
		return V(h, (e) => {
			_.value || (j.value = U(e ?? ""), G());
		}), V(_, (e) => {
			j.value = e ?? "", G();
		}), ee(() => {
			G(), T.value?.addEventListener("compositionstart", ke), T.value?.addEventListener("compositionupdate", Ae), T.value?.addEventListener("compositionend", je);
		}), w(() => {
			T.value?.removeEventListener("compositionstart", ke), T.value?.removeEventListener("compositionupdate", Ae), T.value?.removeEventListener("compositionend", je);
		}), n({
			focus: xe,
			execCommand: we,
			applyForegroundColor: Te,
			queryCommandState: Ce,
			hasSelection: Se,
			setText: De,
			setHtml: Oe,
			setListStyleType: Ee,
			getText: W,
			getHtml: () => T.value?.innerHTML ?? "",
			Document: {
				getText: W,
				setText: De,
				setHtml: Oe,
				getHtml: () => T.value?.innerHTML ?? ""
			},
			TextDocument: {
				getText: W,
				setText: De,
				setHtml: Oe,
				getHtml: () => T.value?.innerHTML ?? ""
			}
		}), (n, r) => (D(), l(t, null, [m(Gt, {
			class: "win-rich-edit-box",
			style: C(te.value),
			Header: e.Header,
			Description: e.Description,
			AcceptsReturn: e.AcceptsReturn,
			IsReadOnly: e.IsReadOnly,
			IsEnabled: e.IsEnabled,
			MaxLength: e.MaxLength,
			TextWrapping: e.TextWrapping,
			TextAlignment: e.TextAlignment,
			IsSpellCheckEnabled: e.IsSpellCheckEnabled,
			IsTextPredictionEnabled: e.IsTextPredictionEnabled,
			InputScope: e.InputScope,
			CharacterCasing: e.CharacterCasing,
			SelectionHighlightColor: e.SelectionHighlightColor,
			PreventKeyboardDisplayOnProgrammaticFocus: e.PreventKeyboardDisplayOnProgrammaticFocus,
			ShowDeleteButton: !1,
			onPointerdownCapture: ce,
			onContextmenuCapture: fe
		}, d({
			field: H(({ onFocus: t, onBlur: n, onPointerEnter: r, onPointerLeave: i }) => [m(Ft, {
				class: "win-reb-editor-scroll",
				style: C(ne.value),
				VerticalScrollMode: "Auto",
				VerticalScrollBarVisibility: "Auto",
				HorizontalScrollMode: "Auto",
				HorizontalScrollBarVisibility: "Auto",
				onPointerdown: oe,
				onContextmenu: de
			}, {
				default: H(() => [u("div", {
					ref_key: "editorRef",
					ref: T,
					class: "win-reb-editor",
					contenteditable: e.IsEnabled && !e.IsReadOnly,
					"data-placeholder": e.PlaceholderText,
					spellcheck: e.IsSpellCheckEnabled,
					autocomplete: e.IsTextPredictionEnabled ? "on" : "off",
					style: C(B.value),
					role: "textbox",
					"aria-multiline": "true",
					"aria-readonly": e.IsReadOnly,
					onInput: Y,
					onFocus: (e) => ye(t),
					onBlur: (e) => be(n),
					onKeydown: ue,
					onPaste: pe,
					onCopy: he,
					onCut: ge,
					onContextmenu: _e,
					onMouseup: Z,
					onKeyup: Z,
					onPointerenter: r,
					onPointerleave: i
				}, null, 44, Sn)]),
				_: 2
			}, 1032, ["style"])]),
			_: 2
		}, [c.value || n.$slots.header ? {
			name: "header",
			fn: H(() => [M(n.$slots, "header", {}, () => [p(L(c.value), 1)], !0)]),
			key: "0"
		} : void 0, f.value || n.$slots.description ? {
			name: "description",
			fn: H(() => [M(n.$slots, "description", {}, () => [p(L(f.value), 1)], !0)]),
			key: "1"
		} : void 0]), 1032, [
			"style",
			"Header",
			"Description",
			"AcceptsReturn",
			"IsReadOnly",
			"IsEnabled",
			"MaxLength",
			"TextWrapping",
			"TextAlignment",
			"IsSpellCheckEnabled",
			"IsTextPredictionEnabled",
			"InputScope",
			"CharacterCasing",
			"SelectionHighlightColor",
			"PreventKeyboardDisplayOnProgrammaticFocus"
		]), m(xn, {
			Open: O.value,
			AnchorRect: k.value,
			PrimaryCommands: I.value,
			SecondaryCommands: R.value,
			Placement: "Auto",
			ShowMode: "Standard",
			onClose: r[0] ||= (e) => O.value = !1
		}, null, 8, [
			"Open",
			"AnchorRect",
			"PrimaryCommands",
			"SecondaryCommands"
		])], 64));
	}
}), [["__scopeId", "data-v-9e2003c3"]]), wn = /*@__PURE__*/ Object.assign({ inheritAttrs: !1 }, {
	__name: "RichTextBlock",
	props: {
		Text: {
			type: [String, Number],
			default: ""
		},
		FontFamily: {
			type: String,
			default: ""
		},
		FontSize: {
			type: [String, Number],
			default: ""
		},
		FontStyle: {
			type: String,
			default: ""
		},
		FontWeight: {
			type: [String, Number],
			default: ""
		},
		Foreground: {
			type: String,
			default: ""
		},
		IsTextSelectionEnabled: {
			type: Boolean,
			default: !1
		},
		LineHeight: {
			type: [String, Number],
			default: ""
		},
		MaxLines: {
			type: [String, Number],
			default: ""
		},
		TextAlignment: {
			type: String,
			default: ""
		},
		TextTrimming: {
			type: String,
			default: ""
		},
		TextWrapping: {
			type: String,
			default: "Wrap"
		}
	},
	setup(e) {
		let t = e, n = te(), r = g(), i = o(() => $(t.Text, r)), a = o(() => {
			let { class: e, style: t, ...r } = n;
			return r;
		}), s = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, c = o(() => {
			let e = {};
			return t.FontFamily && (e.fontFamily = t.FontFamily), t.FontSize !== "" && (e.fontSize = s(t.FontSize)), t.FontStyle && (e.fontStyle = t.FontStyle.toLowerCase()), t.FontWeight !== "" && (e.fontWeight = t.FontWeight), t.Foreground && (e.color = t.Foreground), t.LineHeight !== "" && (e.lineHeight = s(t.LineHeight)), t.TextAlignment && (e.textAlign = t.TextAlignment.toLowerCase()), t.TextWrapping === "NoWrap" && (e.whiteSpace = "nowrap"), (t.TextWrapping === "Wrap" || t.TextWrapping === "WrapWholeWords") && (e.whiteSpace = "normal"), t.TextTrimming && t.TextTrimming !== "None" && (e.overflow = "hidden", e.textOverflow = "ellipsis", e.whiteSpace = "nowrap"), t.MaxLines !== "" && (e.display = "-webkit-box", e.overflow = "hidden", e.WebkitLineClamp = String(t.MaxLines), e.WebkitBoxOrient = "vertical"), [n.style, e];
		});
		return (t, r) => (D(), l("div", b(a.value, {
			class: ["win-rich-text-block", [z(n).class, { "is-selectable": e.IsTextSelectionEnabled }]],
			style: c.value
		}), [M(t.$slots, "default", {}, () => [p(L(i.value), 1)])], 16));
	}
}), Tn = ["disabled", "aria-label"], En = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "PasswordBox",
	props: {
		Password: { default: "" },
		Header: { default: "" },
		HeaderTemplate: { default: void 0 },
		Description: { default: "" },
		PlaceholderText: { default: "" },
		PasswordChar: { default: "●" },
		PasswordRevealMode: { default: "Peek" },
		MaxLength: { default: 0 },
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		CanPasteClipboardContent: {
			type: Boolean,
			default: !0
		},
		InputScope: { default: "Password" },
		SelectionFlyout: { default: void 0 },
		SelectionHighlightColor: { default: "" },
		TextReadingOrder: { default: "Default" },
		PreventKeyboardDisplayOnProgrammaticFocus: {
			type: Boolean,
			default: !1
		},
		Width: { default: "" }
	},
	emits: [
		"update:Password",
		"PasswordChanging",
		"PasswordChanged",
		"GotFocus",
		"LostFocus"
	],
	setup(e, { emit: t }) {
		let { t: n } = rt(), r = e, i = t, a = A(r.Password), s = A(!1), d = A(!1), f = o(() => ({ width: r.Width === "" ? void 0 : typeof r.Width == "number" ? `${r.Width}px` : r.Width })), p = o(() => r.PasswordRevealMode !== "Hidden" && a.value.length > 0), h = o(() => r.PasswordRevealMode === "Visible" || s.value || d.value), g = o(() => h.value ? a.value : r.PasswordChar.repeat(a.value.length)), _ = (e) => {
			let t = r.MaxLength > 0 ? e.slice(0, r.MaxLength) : e;
			i("PasswordChanging", { IsContentChanging: t !== a.value }), a.value = t, i("update:Password", t), i("PasswordChanged");
		}, v = (e) => {
			if (h.value) {
				_(e);
				return;
			}
			e.length < a.value.length ? _(a.value.slice(0, e.length)) : e.length > a.value.length && _(a.value + e.slice(a.value.length).replaceAll(r.PasswordChar, ""));
		}, y = (e) => {
			r.CanPasteClipboardContent || (e.Handled = !0);
		}, x = () => {
			r.PasswordRevealMode === "Peek" && (s.value = !0);
		}, S = () => {
			r.PasswordRevealMode === "Peek" && (s.value = !1);
		}, w = () => {
			r.PasswordRevealMode !== "Visible" && r.PasswordRevealMode !== "Peek" && (d.value = !d.value);
		};
		return V(() => r.Password, (e) => {
			a.value = e ?? "";
		}), (t, r) => (D(), l("div", {
			class: "win-password-box",
			style: C(f.value)
		}, [m(Gt, {
			ref: "textBoxRef",
			class: "win-password-textbox",
			Text: g.value,
			Header: e.Header,
			Description: e.Description,
			PlaceholderText: e.PlaceholderText,
			MaxLength: e.MaxLength,
			IsEnabled: e.IsEnabled,
			InputScope: e.InputScope,
			SelectionHighlightColor: e.SelectionHighlightColor,
			PreventKeyboardDisplayOnProgrammaticFocus: e.PreventKeyboardDisplayOnProgrammaticFocus,
			"onUpdate:Text": v,
			onGotFocus: r[0] ||= (e) => i("GotFocus"),
			onLostFocus: r[1] ||= (e) => i("LostFocus"),
			onPaste: y
		}, {
			actions: H(() => [p.value ? (D(), l("button", b({
				key: 0,
				class: "win-textbox-action-button win-password-reveal",
				type: "button",
				disabled: !e.IsEnabled,
				"aria-label": z(n)("text.reveal-password")
			}, { "tooltipservice.tooltip": z(n)("text.reveal-password") }, {
				onPointerdown: G(x, ["prevent"]),
				onPointerup: G(S, ["prevent"]),
				onPointerleave: S,
				onClick: w
			}), [...r[2] ||= [u("span", null, "", -1)]], 16, Tn)) : c("", !0)]),
			_: 1
		}, 8, [
			"Text",
			"Header",
			"Description",
			"PlaceholderText",
			"MaxLength",
			"IsEnabled",
			"InputScope",
			"SelectionHighlightColor",
			"PreventKeyboardDisplayOnProgrammaticFocus"
		])], 4));
	}
}), [["__scopeId", "data-v-423ceb63"]]), Dn = {
	key: 0,
	class: "win-asb-header"
}, On = ["disabled", "aria-label"], kn = { class: "win-asb-icon" }, An = {
	key: 1,
	class: "win-asb-description"
}, jn = [
	"disabled",
	"aria-selected",
	"onMouseenter",
	"onClick"
], Mn = { class: "win-asb-item-title" }, Nn = {
	key: 0,
	class: "win-asb-item-subtitle"
}, Pn = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "AutoSuggestBox",
	props: {
		Text: { default: "" },
		PlaceholderText: { default: "" },
		Header: { default: "" },
		Description: { default: "" },
		QueryIcon: { default: "" },
		ItemsSource: { default: () => [] },
		TextMemberPath: { default: "" },
		UpdateTextOnSelect: {
			type: Boolean,
			default: !0
		},
		IsSuggestionListOpen: {
			type: Boolean,
			default: !1
		},
		MaxSuggestionListHeight: { default: 300 },
		AutoMaximizeSuggestionArea: {
			type: Boolean,
			default: !1
		},
		DesiredCandidateWindowAlignment: { default: "BottomEdge" },
		LightDismissOverlayMode: { default: "Auto" },
		TextBoxStyle: { default: void 0 },
		KeepInteriorCornersSquare: {
			type: Boolean,
			default: !1
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		Width: { default: "" },
		OpenOnFocus: {
			type: Boolean,
			default: !0
		}
	},
	emits: [
		"update:Text",
		"update:IsSuggestionListOpen",
		"TextChanged",
		"SuggestionChosen",
		"QuerySubmitted"
	],
	setup(e, { emit: r }) {
		let { t: a } = rt(), d = e, f = g(), h = o(() => $(d.Header, f)), _ = o(() => $(d.Description, f)), y = r, T = A(null), E = A(null), O = A(null), k = A(d.Text), N = A(d.IsSuggestionListOpen), P = A(!1), F = A(!1), I = A(-1), R = A(0), te = A({}), ne = A("down"), B = A(!1), U = Je(O, {
			Origin: "edge",
			Direction: () => ne.value === "up" ? "bottom" : "top",
			StripSize: 32
		}), W = v("winuiTheme", null), re = A(""), K = o(() => N.value && d.IsEnabled), q = o(() => d.ItemsSource ?? []), J = o(() => d.Text ?? k.value), ie = o(() => d.QueryIcon === "Find" ? "" : d.QueryIcon), Y = o(() => a("text.no-results-found")), X = o(() => {
			let e = W?.value || re.value;
			return e === "light" || e === "dark" ? `theme-${e}` : "";
		}), Z = o(() => ({
			width: d.Width === "" ? void 0 : typeof d.Width == "number" ? `${d.Width}px` : d.Width,
			"--asb-input-bottom-radius": K.value && ne.value === "down" ? "0" : "4px"
		})), ae = (e) => {
			if (e && typeof e == "object") {
				let t = d.TextMemberPath || "title";
				return String(e[t] ?? e.text ?? e.name ?? "");
			}
			return String(e ?? "");
		}, Q = (e) => e && typeof e == "object" ? String(e.subtitle ?? "") : "", oe = "";
		V(() => q.value.map((e) => ae(e)).join("|"), (e) => {
			e !== oe && (oe = e, R.value += 1);
		}, { immediate: !0 });
		let se = (e) => {
			if (e && typeof e == "object" && e.noResults === !0) return !0;
			let t = ae(e).trim();
			return t.toLowerCase() === "no results found" || t === Y.value.trim();
		}, ce = o(() => q.value.map((e, t) => se(e) ? -1 : t).filter((e) => e >= 0)), le = async (e) => {
			let t = N.value;
			e && q.value.length > 0 ? (I.value = -1, ve(), N.value = !0, y("update:IsSuggestionListOpen", !0), await x(), ve(), await x(), t || U.play()) : (N.value = !1, y("update:IsSuggestionListOpen", !1), U.cancel());
		}, ue = (e) => {
			k.value = e, y("update:Text", e), y("TextChanged", { Reason: "UserInput" }), F.value = !0, x(() => {
				P.value && F.value && le(q.value.length > 0);
			});
		}, de = () => {
			P.value = !0, d.OpenOnFocus && q.value.length && le(!0);
		}, fe = () => {
			P.value = !1, F.value = !1, B.value = !1, window.setTimeout(() => le(!1), 120);
		}, pe = (e) => {
			let t = q.value[e];
			if (t === void 0 || se(t)) return;
			let n = ae(t);
			y("SuggestionChosen", { SelectedItem: t }), d.UpdateTextOnSelect && (k.value = n, y("update:Text", n), y("TextChanged", { Reason: "SuggestionChosen" })), he(t, n);
		}, me = (e) => {
			pe(e), E.value?.querySelector("input, textarea")?.blur();
		}, he = (e = null, t = J.value) => {
			F.value = !1, y("QuerySubmitted", {
				QueryText: t,
				ChosenSuggestion: e
			}), le(!1);
		}, ge = (e) => {
			if (!K.value || !q.value.length) {
				e.key === "Enter" && he();
				return;
			}
			if (e.key === "ArrowDown") {
				e.preventDefault();
				let t = ce.value, n = t.indexOf(I.value);
				I.value = t[Math.min(n + 1, t.length - 1)] ?? -1;
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				let t = ce.value, n = t.indexOf(I.value);
				I.value = t[Math.max(n - 1, 0)] ?? -1;
			} else e.key === "Enter" ? (e.preventDefault(), I.value >= 0 ? pe(I.value) : he()) : e.key === "Escape" && (e.preventDefault(), F.value = !1, le(!1));
		}, _e = () => {
			let e = T.value?.closest(".theme-light, .theme-dark");
			return e?.classList.contains("theme-dark") ? "dark" : e?.classList.contains("theme-light") ? "light" : "";
		}, ve = () => {
			re.value = _e();
			let e = (E.value?.querySelector(".win-textbox-border"))?.getBoundingClientRect() ?? E.value?.getBoundingClientRect() ?? T.value?.getBoundingClientRect();
			if (!e) return;
			let t = window.visualViewport, n = t?.offsetTop ?? 0, r = n + (t?.height ?? window.innerHeight), i = typeof d.MaxSuggestionListHeight == "number" ? d.MaxSuggestionListHeight : Number(d.MaxSuggestionListHeight) || 300, a = B.value && d.DesiredCandidateWindowAlignment === "BottomEdge", o = a ? 40 : 0, s = r - e.bottom - o - 8, c = e.top - n - o - 8;
			if (ne.value = a || s >= Math.min(i, 160) || s >= c ? "down" : "up", ne.value === "up") {
				te.value = {
					left: `${e.left}px`,
					bottom: `${window.innerHeight - e.top + o}px`,
					width: `${e.width}px`,
					maxHeight: `${d.AutoMaximizeSuggestionArea ? Math.max(120, c) : Math.min(i, Math.max(80, c))}px`,
					"--asb-input-bottom-radius": "4px",
					"--asb-popup-radius": "8px 8px 0 0"
				};
				return;
			}
			te.value = {
				left: `${e.left}px`,
				top: `${e.bottom + o}px`,
				width: `${e.width}px`,
				maxHeight: `${d.AutoMaximizeSuggestionArea ? Math.max(120, s) : Math.min(i, Math.max(80, s))}px`,
				"--asb-input-bottom-radius": N.value ? "0" : "4px",
				"--asb-popup-radius": "0 0 8px 8px"
			};
		}, ye = () => {
			B.value = !0, K.value && ve();
		}, be = () => {
			B.value = !1, K.value && requestAnimationFrame(ve);
		}, xe = (e) => {
			let t = e.target;
			T.value?.contains(t) || O.value?.contains(t) || (F.value = !1, le(!1));
		};
		return V(() => d.Text, (e) => {
			k.value = e ?? "", y("TextChanged", { Reason: "ProgrammaticChange" });
		}), V(() => d.IsSuggestionListOpen, (e) => le(!!e)), V(() => d.ItemsSource, () => {
			(K.value || P.value && F.value) && le(q.value.length > 0);
		}, { deep: !0 }), ee(() => {
			document.addEventListener("pointerdown", xe), window.addEventListener("resize", ve), window.addEventListener("scroll", ve, !0), window.visualViewport?.addEventListener("resize", ve), window.visualViewport?.addEventListener("scroll", ve);
		}), w(() => {
			document.removeEventListener("pointerdown", xe), window.removeEventListener("resize", ve), window.removeEventListener("scroll", ve, !0), window.visualViewport?.removeEventListener("resize", ve), window.visualViewport?.removeEventListener("scroll", ve);
		}), (r, o) => (D(), l("div", {
			ref_key: "rootRef",
			ref: T,
			class: S(["win-auto-suggest-box", {
				"is-suggestion-open-down": K.value && ne.value === "down",
				"is-suggestion-open-up": K.value && ne.value === "up"
			}]),
			style: C(Z.value)
		}, [
			h.value || r.$slots.header ? (D(), l("div", Dn, [M(r.$slots, "header", {}, () => [p(L(h.value), 1)], !0)])) : c("", !0),
			u("div", {
				ref_key: "anchorRef",
				ref: E,
				class: "win-asb-anchor"
			}, [m(Gt, {
				class: "win-asb-textbox",
				Text: J.value,
				PlaceholderText: e.PlaceholderText,
				IsEnabled: e.IsEnabled,
				Description: "",
				DesiredCandidateWindowAlignment: e.DesiredCandidateWindowAlignment,
				"onUpdate:Text": ue,
				onGotFocus: de,
				onLostFocus: fe,
				onKeydownCapture: ge,
				onTextCompositionStarted: ye,
				onTextCompositionEnded: be
			}, {
				actions: H(() => [e.QueryIcon ? (D(), l("button", b({
					key: 0,
					class: "win-textbox-action-button win-textbox-action-query win-asb-query-button",
					type: "button",
					disabled: !e.IsEnabled,
					"aria-label": z(a)("text.submit-query")
				}, { "tooltipservice.tooltip": z(a)("text.submit-query") }, {
					onPointerdown: o[0] ||= G(() => {}, ["prevent"]),
					onClick: o[1] ||= (e) => he()
				}), [u("span", kn, L(ie.value), 1)], 16, On)) : c("", !0)]),
				_: 1
			}, 8, [
				"Text",
				"PlaceholderText",
				"IsEnabled",
				"DesiredCandidateWindowAlignment"
			])], 512),
			_.value || r.$slots.description ? (D(), l("div", An, [M(r.$slots, "description", {}, () => [p(L(_.value), 1)], !0)])) : c("", !0),
			(D(), s(n, { to: "body" }, [K.value && q.value.length ? (D(), l("div", {
				key: 0,
				ref_key: "popupRef",
				ref: O,
				class: S(["win-asb-popup win-theme-scope", [ne.value === "up" ? "opens-up" : "opens-down", X.value]]),
				style: C(te.value),
				role: "listbox"
			}, [m(Ft, {
				class: "win-asb-popup-scroll",
				VerticalScrollMode: "Auto",
				VerticalScrollBarVisibility: "Auto",
				HorizontalScrollMode: "Disabled",
				HorizontalScrollBarVisibility: "Disabled"
			}, {
				default: H(() => [m(i, {
					name: "asb-results",
					mode: "out-in"
				}, {
					default: H(() => [(D(), l("div", {
						key: R.value,
						class: "win-asb-results"
					}, [(D(!0), l(t, null, j(q.value, (e, t) => (D(), l("button", {
						key: `${ae(e)}-${t}`,
						class: S(["win-asb-item", {
							"is-highlighted": I.value === t,
							"is-disabled": se(e)
						}]),
						type: "button",
						role: "option",
						disabled: se(e),
						"aria-selected": I.value === t,
						onMouseenter: (n) => I.value = se(e) ? I.value : t,
						onClick: (e) => me(t)
					}, [u("span", Mn, L(ae(e)), 1), Q(e) ? (D(), l("span", Nn, L(Q(e)), 1)) : c("", !0)], 42, jn))), 128))]))]),
					_: 1
				})]),
				_: 1
			})], 6)) : c("", !0)]))
		], 6));
	}
}), [["__scopeId", "data-v-24ee6516"]]), Fn = { class: "win-number-shell" }, In = {
	key: 0,
	class: "win-number-spin inline"
}, Ln = ["disabled"], Rn = ["disabled"], zn = {
	key: 1,
	class: "win-number-compact-indicator",
	"aria-hidden": "true"
}, Bn = ["disabled"], Vn = ["disabled"], Hn = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "NumberBox",
	props: {
		Value: { default: NaN },
		Text: { default: "" },
		Minimum: { default: -Infinity },
		Maximum: { default: Infinity },
		SmallChange: { default: 1 },
		LargeChange: { default: 10 },
		Header: { default: "" },
		HeaderTemplate: { default: void 0 },
		Description: { default: "" },
		PlaceholderText: { default: "" },
		InputScope: { default: "Decimal" },
		SelectionFlyout: { default: void 0 },
		SelectionHighlightColor: { default: "" },
		TextReadingOrder: { default: "Default" },
		PreventKeyboardDisplayOnProgrammaticFocus: {
			type: Boolean,
			default: !1
		},
		NumberFormatter: { default: null },
		SpinButtonPlacementMode: { default: "Hidden" },
		ValidationMode: { default: "InvalidInputOverwritten" },
		IsWrapEnabled: {
			type: Boolean,
			default: !1
		},
		AcceptsExpression: {
			type: Boolean,
			default: !1
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		TextAlignment: { default: "Left" },
		MinWidth: { default: 64 },
		MinHeight: { default: "" },
		MaxWidth: { default: "" },
		MaxHeight: { default: "" },
		VerticalAlignment: { default: "Stretch" },
		HorizontalAlignment: { default: "Stretch" },
		Width: { default: "" }
	},
	emits: [
		"update:Value",
		"update:Text",
		"ValueChanged"
	],
	setup(e, { emit: t }) {
		let r = e, i = t, a = A(null), d = A(!1), f = A({}), p = v("winuiTheme", null), h = A(""), g = (e) => Number.isNaN(e) ? "" : r.NumberFormatter?.format(e) ?? String(e), _ = A(r.Text || g(r.Value)), y = o(() => _.value), b = o(() => r.SpinButtonPlacementMode === "Compact" && r.IsEnabled && d.value), T = o(() => {
			let e = p?.value || h.value;
			return e === "light" || e === "dark" ? `theme-${e}` : "";
		}), E = (e, t) => {
			let n = String(e || "").toLowerCase();
			return t === "vertical" ? {
				center: "center",
				top: "flex-start",
				bottom: "flex-end",
				stretch: "stretch"
			}[n] || "stretch" : {
				left: "flex-start",
				center: "center",
				right: "flex-end",
				stretch: "stretch"
			}[n] || "stretch";
		}, O = o(() => ({
			width: r.Width === "" ? void 0 : typeof r.Width == "number" ? `${r.Width}px` : r.Width,
			minWidth: typeof r.MinWidth == "number" ? `${r.MinWidth}px` : r.MinWidth,
			minHeight: r.MinHeight === "" ? void 0 : typeof r.MinHeight == "number" ? `${r.MinHeight}px` : r.MinHeight,
			maxWidth: r.MaxWidth === "" ? void 0 : typeof r.MaxWidth == "number" ? `${r.MaxWidth}px` : r.MaxWidth,
			maxHeight: r.MaxHeight === "" ? void 0 : typeof r.MaxHeight == "number" ? `${r.MaxHeight}px` : r.MaxHeight,
			alignSelf: E(r.VerticalAlignment, "vertical"),
			justifySelf: E(r.HorizontalAlignment, "horizontal")
		})), k = o(() => r.IsEnabled && (Number.isNaN(r.Value) || r.Value + r.SmallChange <= r.Maximum)), j = o(() => r.IsEnabled && (Number.isNaN(r.Value) || r.Value - r.SmallChange >= r.Minimum)), M = (e) => Math.min(r.Maximum, Math.max(r.Minimum, e)), N = (e) => {
			let t = e.replace(/\^/g, "**");
			if (!/^[\d+\-*/().\s%*]+$/.test(t)) return NaN;
			try {
				return Number(Function(`"use strict"; return (${t});`)());
			} catch {
				return NaN;
			}
		}, P = (e) => {
			let t = e.replace(/,/g, ""), n = r.AcceptsExpression ? N(t) : Number(t);
			return Number.isFinite(n) ? n : NaN;
		}, F = (e) => {
			let t = r.AcceptsExpression ? /[0-9+\-*/().%\s^]/ : /[0-9+\-.]/, n = "";
			for (let r of e) t.test(r) && (n += r);
			if (!r.AcceptsExpression) {
				n = n.replace(/(?!^)-/g, "");
				let e = n.indexOf(".");
				e !== -1 && (n = n.slice(0, e + 1) + n.slice(e + 1).replace(/\./g, ""));
			}
			return n;
		}, I = (e, t = r.Value) => {
			let n = Number.isNaN(e) ? NaN : M(e);
			return _.value = g(n), i("update:Value", n), i("update:Text", _.value), Object.is(t, n) || i("ValueChanged", {
				OldValue: t,
				NewValue: n
			}), n;
		}, L = (e) => {
			let t = F(e);
			_.value = t, i("update:Text", t);
		}, R = () => {
			let e = a.value?.closest(".theme-light, .theme-dark");
			return e?.classList.contains("theme-dark") ? "dark" : e?.classList.contains("theme-light") ? "light" : "";
		}, z = async () => {
			if (!a.value) return;
			h.value = R();
			let e = a.value.querySelector(".win-textbox-border")?.getBoundingClientRect() ?? a.value.getBoundingClientRect();
			f.value = {
				left: `${e.right - 44}px`,
				top: `${e.top + e.height / 2 - 88 / 2}px`
			}, await x();
		}, te = () => {
			d.value = !0, z();
		}, ne = () => {
			window.setTimeout(() => {
				d.value = !1, B();
			}, 120);
		}, B = () => {
			if (_.value.trim() === "") return I(NaN);
			let e = P(_.value);
			return Number.isNaN(e) ? (r.ValidationMode === "InvalidInputOverwritten" && (_.value = g(r.Value)), r.Value) : I(e);
		}, U = (e) => {
			let t = B();
			I((Number.isNaN(t) ? 0 : t) + e, t);
		}, W = (e) => {
			e.ctrlKey || e.metaKey || e.altKey || (e.key.length === 1 && F(e.key) !== e.key && e.preventDefault(), e.key === "Enter" && (e.preventDefault(), B()), e.key === "ArrowUp" && (e.preventDefault(), U(e.shiftKey ? r.LargeChange : r.SmallChange)), e.key === "ArrowDown" && (e.preventDefault(), U(e.shiftKey ? -r.LargeChange : -r.SmallChange)), e.key === "PageUp" && (e.preventDefault(), U(r.LargeChange)), e.key === "PageDown" && (e.preventDefault(), U(-r.LargeChange)));
		}, re = () => {
			b.value && z();
		};
		return V(() => r.Value, (e) => {
			_.value = g(e);
		}), V(() => r.NumberFormatter, () => {
			_.value = g(r.Value);
		}), V(() => r.Text, (e) => {
			e !== void 0 && e !== _.value && (_.value = e);
		}), ee(() => {
			window.addEventListener("resize", re), window.addEventListener("scroll", re, !0);
		}), w(() => {
			window.removeEventListener("resize", re), window.removeEventListener("scroll", re, !0);
		}), (t, r) => (D(), l("div", {
			ref_key: "rootRef",
			ref: a,
			class: S(["win-number-box", {
				"is-disabled": !e.IsEnabled,
				"is-inline": e.SpinButtonPlacementMode === "Inline",
				"is-compact": e.SpinButtonPlacementMode === "Compact"
			}]),
			style: C(O.value)
		}, [u("div", Fn, [m(Gt, {
			class: "win-number-textbox",
			Text: y.value,
			Header: e.Header,
			Description: e.Description,
			PlaceholderText: e.PlaceholderText,
			IsEnabled: e.IsEnabled,
			InputScope: e.InputScope || "Decimal",
			AcceptsReturn: e.IsWrapEnabled,
			TextAlignment: e.TextAlignment,
			SelectionHighlightColor: e.SelectionHighlightColor,
			PreventKeyboardDisplayOnProgrammaticFocus: e.PreventKeyboardDisplayOnProgrammaticFocus,
			ShowDeleteButton: !1,
			"onUpdate:Text": L,
			onGotFocus: te,
			onLostFocus: ne,
			onKeydownCapture: W
		}, {
			actions: H(() => [e.SpinButtonPlacementMode === "Inline" ? (D(), l("div", In, [u("button", {
				type: "button",
				class: "win-textbox-action-button win-number-spin-button",
				disabled: !k.value,
				onPointerdown: r[0] ||= G(() => {}, ["prevent"]),
				onClick: r[1] ||= (t) => U(e.SmallChange)
			}, [...r[7] ||= [u("span", null, "", -1)]], 40, Ln), u("button", {
				type: "button",
				class: "win-textbox-action-button win-number-spin-button",
				disabled: !j.value,
				onPointerdown: r[2] ||= G(() => {}, ["prevent"]),
				onClick: r[3] ||= (t) => U(-e.SmallChange)
			}, [...r[8] ||= [u("span", null, "", -1)]], 40, Rn)])) : e.SpinButtonPlacementMode === "Compact" ? (D(), l("span", zn, [...r[9] ||= [u("span", null, "", -1)]])) : c("", !0)]),
			_: 1
		}, 8, [
			"Text",
			"Header",
			"Description",
			"PlaceholderText",
			"IsEnabled",
			"InputScope",
			"AcceptsReturn",
			"TextAlignment",
			"SelectionHighlightColor",
			"PreventKeyboardDisplayOnProgrammaticFocus"
		])]), (D(), s(n, { to: "body" }, [b.value ? (D(), l("div", {
			key: 0,
			class: S(["win-number-compact-popup win-theme-scope", T.value]),
			style: C(f.value),
			onPointerdown: r[6] ||= G(() => {}, ["prevent"])
		}, [u("button", {
			type: "button",
			class: "win-number-popup-button",
			disabled: !k.value,
			onClick: r[4] ||= (t) => U(e.SmallChange)
		}, [...r[10] ||= [u("span", null, "", -1)]], 8, Bn), u("button", {
			type: "button",
			class: "win-number-popup-button",
			disabled: !j.value,
			onClick: r[5] ||= (t) => U(-e.SmallChange)
		}, [...r[11] ||= [u("span", null, "", -1)]], 8, Vn)], 38)) : c("", !0)]))], 6));
	}
}), [["__scopeId", "data-v-cb02591d"]]), Un = ["disabled"], Wn = { key: 0 }, Gn = h({
	name: "Button.Flyout",
	__buttonProperty: "flyout",
	setup(e, { slots: t }) {
		return () => _("span", { class: "button-flyout-property" }, t.default?.());
	}
}), Kn = /* @__PURE__ */ h({
	Flyout: Gn,
	inheritAttrs: !1,
	__name: "Button",
	props: {
		Style: {
			type: String,
			default: ""
		},
		Content: {
			type: [String, Number],
			default: ""
		},
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		Background: {
			type: String,
			default: ""
		},
		BackgroundSizing: {
			type: String,
			default: ""
		},
		Foreground: {
			type: String,
			default: ""
		},
		BorderBrush: {
			type: String,
			default: ""
		},
		BorderThickness: {
			type: [String, Number],
			default: ""
		},
		Padding: {
			type: String,
			default: ""
		},
		Margin: {
			type: String,
			default: ""
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		MaxHeight: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		},
		HorizontalContentAlignment: {
			type: String,
			default: ""
		},
		VerticalContentAlignment: {
			type: String,
			default: ""
		},
		FontFamily: {
			type: String,
			default: ""
		},
		FontWeight: {
			type: String,
			default: ""
		},
		FontSize: {
			type: [String, Number],
			default: ""
		},
		UseSystemFocusVisuals: {
			type: Boolean,
			default: !0
		},
		FocusVisualMargin: {
			type: [String, Number],
			default: ""
		},
		CornerRadius: {
			type: [String, Number],
			default: ""
		}
	},
	emits: ["Click"],
	setup(e, { emit: n }) {
		let r = e, i = n, a = te(), d = g(), f = ne(), m = A(null);
		O("buttonFlyoutAnchor", m);
		let v = o(() => {
			let e = [], t = [];
			for (let n of f.default?.() ?? []) {
				let r = n?.type;
				if ((r && typeof r == "object" ? r.__buttonProperty : void 0) === "flyout") {
					let e = n.children && typeof n.children == "object" ? n.children.default : void 0;
					e && t.push(...e());
				} else e.push(n);
			}
			return {
				content: e,
				flyout: t
			};
		}), y = h({
			name: "ButtonContentOutlet",
			setup() {
				return () => _(t, v.value.content);
			}
		}), x = h({
			name: "ButtonFlyoutOutlet",
			setup() {
				return () => _(t, v.value.flyout);
			}
		}), S = o(() => {
			let e = { ...a };
			delete e.class, delete e.style, delete e.disabled, delete e.Click;
			let t = (t) => Object.keys(e).find((e) => e.toLowerCase() === t.toLowerCase()), n = t("ToolTipService.ToolTip"), r = t("AutomationProperties.Name"), i = n ? e[n] : void 0, o = r ? e[r] : void 0;
			n && delete e[n], r && delete e[r];
			let s = $(i, d), c = $(o, d);
			return s != null && s !== "" && (e["tooltipservice.tooltip"] = String(s)), c != null && c !== "" && (e["aria-label"] = String(c)), e;
		}), C = o(() => $(r.IsEnabled, d)), w = o(() => $(r.Content, d)), ee = o(() => String($(r.Style, d) || "")), T = o(() => C.value === !1), E = (e) => ({
			Left: "flex-start",
			Center: "center",
			Right: "flex-end",
			Stretch: "stretch",
			Top: "flex-start",
			Bottom: "flex-end"
		})[e] ?? "", k = o(() => ({
			DefaultButtonStyle: !ee.value || ee.value.includes("DefaultButtonStyle"),
			AccentButtonStyle: ee.value.includes("AccentButtonStyle"),
			SubtleButtonStyle: ee.value.includes("SubtleButtonStyle")
		})), j = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, N = (e) => {
			if (!e) return "";
			let t = String(e).split(",").map((e) => j(Number.isNaN(Number(e.trim())) ? e.trim() : Number(e.trim())));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : e;
		}, P = o(() => {
			let e = {};
			return r.Background && (e["--ButtonBackground"] = r.Background), r.Foreground && (e["--ButtonForeground"] = r.Foreground), r.BorderBrush && (e["--ButtonBorderBrush"] = r.BorderBrush, e["--ButtonBorderBrushTop"] = r.BorderBrush, e["--ButtonBorderBrushBottom"] = r.BorderBrush), r.BorderThickness !== "" && (e["--ButtonBorderThemeThickness"] = j(r.BorderThickness)), r.Padding && (e.padding = N(r.Padding)), r.Margin && (e.margin = N(r.Margin)), r.Width !== "" && (e.width = j(r.Width)), r.Height !== "" && (e.height = j(r.Height)), r.MaxWidth !== "" && (e.maxWidth = j(r.MaxWidth)), r.MaxHeight !== "" && (e.maxHeight = j(r.MaxHeight)), r.MinWidth !== "" && (e.minWidth = j(r.MinWidth)), r.MinHeight !== "" && (e.minHeight = j(r.MinHeight)), r.HorizontalAlignment && (e.justifySelf = r.HorizontalAlignment.toLowerCase()), r.VerticalAlignment && (e.alignSelf = r.VerticalAlignment.toLowerCase()), r.HorizontalContentAlignment && (e.justifyContent = r.HorizontalContentAlignment === "Stretch" ? "flex-start" : E(r.HorizontalContentAlignment)), r.VerticalContentAlignment && (e.alignItems = E(r.VerticalContentAlignment)), r.FontFamily && (e.fontFamily = r.FontFamily), r.FontWeight && (e.fontWeight = r.FontWeight), r.FontSize !== "" && (e.fontSize = j(r.FontSize)), r.FocusVisualMargin !== "" && (e.outlineOffset = j(r.FocusVisualMargin)), r.CornerRadius !== "" && (e["--ButtonCornerRadius"] = j(r.CornerRadius)), [a.style, e];
		}), F = (e) => {
			T.value || (i("Click", e), ge(a.Click, d)?.(e));
		};
		return (n, r) => (D(), l(t, null, [u("button", b({
			ref_key: "buttonRef",
			ref: m,
			type: "button"
		}, S.value, {
			class: ["win-btn", [
				k.value,
				{
					"content-horizontal-stretch": e.HorizontalContentAlignment === "Stretch",
					"content-vertical-stretch": e.VerticalContentAlignment === "Stretch"
				},
				z(a).class
			]],
			style: P.value,
			disabled: T.value,
			onClick: F
		}), [v.value.content.length ? (D(), s(z(y), { key: 0 })) : (D(), l(t, { key: 1 }, [v.value.flyout.length ? (D(), l("span", Wn, L(w.value), 1)) : M(n.$slots, "default", { key: 1 }, () => [p(L(w.value), 1)])], 64))], 16, Un), v.value.flyout.length ? (D(), s(z(x), { key: 0 })) : c("", !0)], 64));
	}
}), qn = /* @__PURE__ */ h({
	inheritAttrs: !1,
	__name: "ToggleButton",
	props: {
		IsChecked: {
			type: [
				Boolean,
				null,
				String
			],
			default: !1
		},
		IsThreeState: {
			type: Boolean,
			default: !1
		},
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		Content: { default: "" },
		Background: { default: "" },
		BackgroundSizing: { default: "InnerBorderEdge" },
		Foreground: { default: "" },
		BorderBrush: { default: "" },
		BorderThickness: { default: "" },
		Padding: { default: "" },
		Margin: { default: "" },
		Width: { default: "" },
		Height: { default: "" },
		MaxWidth: { default: "" },
		MaxHeight: { default: "" },
		MinWidth: { default: "" },
		MinHeight: { default: "" },
		HorizontalAlignment: { default: "" },
		VerticalAlignment: { default: "" },
		FontFamily: { default: "" },
		FontWeight: { default: "" },
		FontSize: { default: "" },
		UseSystemFocusVisuals: {
			type: Boolean,
			default: !0
		},
		FocusVisualMargin: { default: "" },
		CornerRadius: { default: "" }
	},
	emits: [
		"update:IsChecked",
		"Click",
		"Checked",
		"Unchecked",
		"Indeterminate"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = te(), a = g(), c = o(() => {
			let { class: e, style: t, disabled: n, Click: r, Checked: a, Unchecked: o, Indeterminate: s, ...c } = i;
			return {
				...c,
				"aria-pressed": x.value
			};
		}), l = o(() => $(n.IsEnabled, a)), u = o(() => $(n.IsChecked, a)), d = o(() => $(n.Content, a)), f = A(void 0), m = A(!1);
		V(u, (e) => {
			m.value || (f.value = e);
		}, { immediate: !0 });
		let h = o(() => l.value === !1), _ = o(() => f.value === void 0 ? u.value ?? !1 : f.value), v = o(() => _.value === !0), y = o(() => _.value === null), x = o(() => y.value ? "mixed" : v.value), S = o(() => v.value || y.value ? "AccentButtonStyle" : ""), C = o(() => ({
			"is-checked": v.value,
			"is-indeterminate": y.value,
			"is-disabled": h.value,
			"use-system-focus-visuals": n.UseSystemFocusVisuals
		})), w = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, ee = (e) => {
			if (e === "" || e == null) return "";
			let t = String(e).split(",").map((e) => {
				let t = e.trim();
				return w(Number.isNaN(Number(t)) ? t : Number(t));
			});
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : String(e);
		}, T = o(() => {
			let e = {};
			return n.Background && (e["--ButtonBackground"] = n.Background), n.Foreground && (e["--ButtonForeground"] = n.Foreground), n.BorderBrush && (e["--ButtonBorderBrush"] = n.BorderBrush), n.BorderThickness !== "" && (e["--ButtonBorderThemeThickness"] = w(n.BorderThickness)), n.Padding && (e.padding = ee(n.Padding)), n.Margin && (e.margin = ee(n.Margin)), n.Width !== "" && (e.width = w(n.Width)), n.Height !== "" && (e.height = w(n.Height)), n.MaxWidth !== "" && (e.maxWidth = w(n.MaxWidth)), n.MaxHeight !== "" && (e.maxHeight = w(n.MaxHeight)), n.MinWidth !== "" && (e.minWidth = w(n.MinWidth)), n.MinHeight !== "" && (e.minHeight = w(n.MinHeight)), n.HorizontalAlignment && (e.justifySelf = n.HorizontalAlignment.toLowerCase()), n.VerticalAlignment && (e.alignSelf = n.VerticalAlignment.toLowerCase()), n.FontFamily && (e.fontFamily = n.FontFamily), n.FontWeight !== "" && (e.fontWeight = n.FontWeight), n.FontSize !== "" && (e.fontSize = w(n.FontSize)), n.FocusVisualMargin !== "" && (e.outlineOffset = w(n.FocusVisualMargin)), n.CornerRadius !== "" && (e.borderRadius = w(n.CornerRadius)), [i.style, e];
		}), E = () => n.IsThreeState ? _.value === !1 ? !0 : _.value === !0 ? null : !1 : !v.value;
		return O(re, {
			buttonStyleName: S,
			resolvedIsEnabled: l,
			OnButtonClick: (e) => {
				if (h.value) return;
				let t = E();
				f.value = t, m.value = !0, r("Click", e), ge(i.Click, a)?.(e), r("update:IsChecked", t), me(n.IsChecked, t, a), m.value = !1, t === !0 ? (r("Checked", e), ge(i.Checked, a)?.(e)) : t === !1 ? (r("Unchecked", e), ge(i.Unchecked, a)?.(e)) : (r("Indeterminate", e), ge(i.Indeterminate, a)?.(e));
			}
		}), (e, t) => (D(), s(Kn, b(c.value, {
			class: ["win-toggle-button", [C.value, z(i).class]],
			style: T.value,
			Style: "{x:Bind buttonStyleName, Mode=OneWay}",
			IsEnabled: "{x:Bind resolvedIsEnabled, Mode=OneWay}",
			Click: "OnButtonClick"
		}), {
			default: H(() => [M(e.$slots, "default", {}, () => [p(L(d.value), 1)])]),
			_: 3
		}, 16, ["class", "style"]));
	}
}), Jn = ["disabled"], Yn = /*@__PURE__*/ Object.assign({ inheritAttrs: !1 }, {
	__name: "RepeatButton",
	props: {
		Content: {
			type: [String, Number],
			default: ""
		},
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		Delay: {
			type: [Number, String],
			default: 250
		},
		Interval: {
			type: [Number, String],
			default: 150
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		Margin: {
			type: String,
			default: ""
		},
		Padding: {
			type: String,
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	emits: ["Click"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = te(), a = g(), s = o(() => $(n.Content, a)), c = null, u = null, d = (e) => {
			r("Click", e), ge(i.Click, a)?.(e);
		}, f = o(() => {
			let { class: e, style: t, disabled: n, ...r } = i;
			return r;
		}), m = o(() => $(n.IsEnabled, a) !== !1), h = o(() => !m.value), _ = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, v = (e) => {
			if (!e) return "";
			let t = String(e).split(",").map((e) => _(Number.isNaN(Number(e.trim())) ? e.trim() : Number(e.trim())));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : e;
		}, y = o(() => {
			let e = {};
			return n.Width !== "" && (e.width = _(n.Width)), n.Height !== "" && (e.height = _(n.Height)), n.Margin && (e.margin = v(n.Margin)), n.Padding && (e.padding = v(n.Padding)), n.HorizontalAlignment && (e.justifySelf = n.HorizontalAlignment.toLowerCase()), n.VerticalAlignment && (e.alignSelf = n.VerticalAlignment.toLowerCase()), [i.style, e];
		}), x = (e) => {
			h.value || (e.currentTarget.setPointerCapture(e.pointerId), d(e), c = setTimeout(() => {
				u = setInterval(() => {
					d(e);
				}, Number($(n.Interval, a)) || 150);
			}, Number($(n.Delay, a)) || 250));
		}, S = () => {
			c &&= (clearTimeout(c), null), u &&= (clearInterval(u), null);
		};
		return w(S), (e, t) => (D(), l("button", b(f.value, {
			class: ["win-btn DefaultButtonStyle", z(i).class],
			style: y.value,
			disabled: h.value,
			onPointerdown: x,
			onPointerup: S,
			onPointerleave: S,
			onPointercancel: S,
			onContextmenu: t[0] ||= G(() => {}, ["prevent"])
		}), [M(e.$slots, "default", {}, () => [p(L(s.value), 1)])], 16, Jn));
	}
}), Xn = [
	"href",
	"target",
	"rel",
	"aria-disabled"
], Zn = ["disabled"], Qn = /*@__PURE__*/ Object.assign({ inheritAttrs: !1 }, {
	__name: "HyperlinkButton",
	props: {
		Content: {
			type: [String, Number],
			default: ""
		},
		NavigateUri: {
			type: String,
			default: ""
		},
		TargetName: {
			type: String,
			default: ""
		},
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		Background: {
			type: String,
			default: ""
		},
		Foreground: {
			type: String,
			default: ""
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		Margin: {
			type: String,
			default: ""
		},
		Padding: {
			type: String,
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		},
		FontFamily: {
			type: String,
			default: ""
		},
		FontSize: {
			type: [String, Number],
			default: ""
		},
		CornerRadius: {
			type: [String, Number],
			default: ""
		}
	},
	emits: ["Click"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = te(), a = g(), s = o(() => $(n.Content, a)), c = o(() => {
			let { class: e, style: t, disabled: n, ...r } = i;
			return r;
		}), u = o(() => $(n.IsEnabled, a) !== !1), d = o(() => !u.value), f = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, m = (e) => {
			if (!e) return "";
			let t = String(e).split(",").map((e) => f(Number.isNaN(Number(e.trim())) ? e.trim() : Number(e.trim())));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : e;
		}, h = o(() => {
			let e = {};
			return n.Width !== "" && (e.width = f(n.Width)), n.Height !== "" && (e.height = f(n.Height)), n.Margin && (e.margin = m(n.Margin)), n.Padding && (e.padding = m(n.Padding)), n.Background && (e.background = n.Background), n.Foreground && (e.color = n.Foreground), n.FontFamily && (e.fontFamily = n.FontFamily), n.FontSize !== "" && (e.fontSize = f(n.FontSize)), n.CornerRadius !== "" && (e.borderRadius = f(n.CornerRadius)), n.HorizontalAlignment && (e.alignSelf = {
				left: "flex-start",
				center: "center",
				right: "flex-end",
				stretch: "stretch",
				auto: "auto"
			}[n.HorizontalAlignment.toLowerCase()] || n.HorizontalAlignment.toLowerCase()), n.VerticalAlignment && (e.justifySelf = {
				top: "flex-start",
				center: "center",
				bottom: "flex-end",
				stretch: "stretch",
				auto: "auto"
			}[n.VerticalAlignment.toLowerCase()] || n.VerticalAlignment.toLowerCase()), [i.style, e];
		}), _ = (e) => {
			if (!d.value) {
				r("Click", e), ge(i.Click, a)?.(e);
				return;
			}
			e.preventDefault(), e.stopPropagation();
		}, v = (e) => {
			d.value || (r("Click", e), ge(i.Click, a)?.(e));
		};
		return (t, n) => e.NavigateUri ? (D(), l("a", b({ key: 0 }, c.value, {
			class: ["win-hyperlink-button", [{ disabled: d.value }, z(i).class]],
			style: h.value,
			href: e.NavigateUri,
			target: e.TargetName || "_self",
			rel: e.TargetName === "_blank" ? "noopener noreferrer" : void 0,
			"aria-disabled": d.value,
			onClick: _
		}), [M(t.$slots, "default", {}, () => [p(L(s.value), 1)])], 16, Xn)) : (D(), l("button", b({ key: 1 }, c.value, {
			class: ["win-hyperlink-button", z(i).class],
			style: h.value,
			disabled: d.value,
			onClick: v
		}), [M(t.$slots, "default", {}, () => [p(L(s.value), 1)])], 16, Zn));
	}
}), $n = h({
	name: "DropDownButton.Flyout",
	__dropDownButtonProperty: "flyout",
	setup(e, { slots: t }) {
		return () => _("span", { class: "dropdown-button-property" }, t.default?.());
	}
}), er = h({
	name: "DropDownButton.Content",
	__dropDownButtonProperty: "content",
	setup(e, { slots: t }) {
		return () => _("span", { class: "dropdown-button-property" }, t.default?.());
	}
}), tr = h({
	name: "MenuFlyout",
	__menuFlyoutDefinition: !0,
	props: {
		Placement: {
			type: String,
			default: "Bottom"
		},
		Theme: {
			type: String,
			default: ""
		}
	},
	setup(e, { slots: t }) {
		return () => _("span", {
			class: "menu-flyout-definition",
			"data-placement": e.Placement
		}, t.default?.());
	}
}), nr = h({
	name: "MenuFlyoutItem",
	__menuFlyoutItem: !0,
	props: {
		Text: {
			type: String,
			default: ""
		},
		Icon: {
			type: [String, Object],
			default: ""
		},
		Value: {
			type: [
				String,
				Number,
				Boolean
			],
			default: void 0
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		}
	},
	setup() {
		return () => null;
	}
}), rr = h({
	name: "MenuFlyoutItem.Icon",
	__menuFlyoutItemProperty: "icon",
	setup(e, { slots: t }) {
		return () => _("span", { class: "menu-flyout-item-property" }, t.default?.());
	}
}), ir = (e) => e.type?.__dropDownButtonProperty, ar = ["disabled"], or = { class: "win-dropdown-content" }, sr = { key: 1 }, cr = /* @__PURE__ */ h({
	Flyout: $n,
	Content: er,
	inheritAttrs: !1,
	__name: "DropDownButton",
	props: {
		Content: {
			type: [String, Number],
			default: ""
		},
		Flyout: {
			type: [Object, Array],
			default: () => ({ Items: [] })
		},
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		MaxHeight: {
			type: [String, Number],
			default: ""
		},
		Margin: {
			type: String,
			default: ""
		},
		Padding: {
			type: String,
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	emits: ["Click", "Select"],
	setup(e, { emit: n }) {
		let r = e, i = n, a = te(), c = ne(), d = g(), f = A(null), p = A(!1), v = A(null), y = A(""), x = !1, C = !1, w = o(() => {
			let { class: e, style: t, disabled: n, ...r } = a;
			return r;
		}), ee = o(() => $(r.IsEnabled, d) !== !1), T = o(() => !ee.value), E = o(() => $(r.Content, d)), O = o(() => {
			let e = [], n = [], r = (i) => {
				for (let a of i) {
					if (a?.type === t && Array.isArray(a.children)) {
						r(a.children);
						continue;
					}
					let i = ir(a) ?? (typeof a?.type == "string" && a.type.endsWith(".Flyout") ? "flyout" : void 0) ?? (typeof a?.type == "string" && a.type.endsWith(".Content") ? "content" : void 0);
					if (!i) {
						e.push(a);
						continue;
					}
					let o = a.children && typeof a.children == "object" ? a.children.default : void 0;
					o && (i === "content" ? e : n).push(...o());
				}
			};
			return r(c.default?.() ?? []), {
				content: e,
				flyout: n
			};
		}), k = o(() => O.value.content), j = o(() => O.value.flyout), M = h({ setup() {
			return () => _(t, k.value);
		} }), N = (e, t, n) => {
			let r = e?.type;
			return r && (typeof r == "object" || typeof r == "function") && r[t] ? !0 : typeof r == "string" && (r === n || r.endsWith(`.${n.split(".").pop()}`));
		}, P = (e) => {
			let n = [];
			for (let r of e || []) r?.type === t && Array.isArray(r.children) ? n.push(...P(r.children)) : r && n.push(r);
			return n;
		}, F = (e) => {
			if (Array.isArray(e?.children)) return P(e.children);
			let t = e?.children && typeof e.children == "object" ? e.children.default : void 0;
			return typeof t == "function" ? P(t()) : [];
		}, I = (e) => {
			if (!e) return [];
			if (Array.isArray(e)) return P(e);
			let t = e.children;
			return Array.isArray(t) ? P(t) : t && typeof t == "object" ? P(Object.values(t).filter((e) => typeof e == "function").flatMap((e) => {
				try {
					return e();
				} catch {
					return [];
				}
			})) : [];
		}, R = (e) => {
			if (!e) return;
			let t = e.props ?? {};
			for (let e of [
				"Glyph",
				"Symbol",
				"Text",
				"Icon"
			]) if (t[e] !== void 0) return $(t[e], d);
			let n = I(e);
			return n.length ? R(n[0]) : void 0;
		}, B = (e) => {
			for (let t of P(e)) {
				let e = R(t);
				if (e !== void 0) return e;
				let n = B(I(t));
				if (n !== void 0) return n;
			}
		}, V = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, H = (e) => {
			if (!e) return "";
			let t = String(e).split(",").map((e) => V(Number.isNaN(Number(e.trim())) ? e.trim() : Number(e.trim())));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : e;
		}, U = o(() => {
			let e = j.value.find((e) => N(e, "__menuFlyoutDefinition", "MenuFlyout"));
			if (!e) return null;
			let t = e.props ?? {}, n = F(e).flatMap((e) => {
				if (!N(e, "__menuFlyoutItem", "MenuFlyoutItem")) return [];
				let t = { ...e.props ?? {} }, n = F(e), r = R(n.find((e) => N(e, "__menuFlyoutItemProperty", "MenuFlyoutItem.Icon"))) ?? B(n);
				return r !== void 0 && (t.Icon = r), [{
					...t,
					Text: $(t.Text ?? "", d),
					Value: $(t.Value ?? t.Text, d),
					IsEnabled: $(t.IsEnabled ?? !0, d) !== !1
				}];
			});
			return {
				...t,
				Items: n
			};
		}), W = o(() => U.value ? U.value : Array.isArray(r.Flyout) ? { Items: r.Flyout } : r.Flyout || { Items: [] }), G = o(() => W.value.Placement || "Bottom"), re = o(() => (W.value.Items || []).map((e) => {
			if (typeof e == "string") {
				let t = $(e, d);
				return {
					Text: t,
					Value: t
				};
			}
			let t = $(e.Text ?? e.Content ?? e.label ?? String(e), d), n = e.Icon === void 0 ? void 0 : $(e.Icon, d);
			return {
				...e,
				Text: t,
				...n === void 0 ? {} : { Icon: n }
			};
		})), K = o(() => {
			let e = {};
			return r.Width !== "" && (e.width = V(r.Width)), r.Height !== "" && (e.height = V(r.Height)), r.MinWidth !== "" && (e.minWidth = V(r.MinWidth)), r.MinHeight !== "" && (e.minHeight = V(r.MinHeight)), r.MaxWidth !== "" && (e.maxWidth = V(r.MaxWidth)), r.MaxHeight !== "" && (e.maxHeight = V(r.MaxHeight)), r.Margin && (e.margin = H(r.Margin)), r.Padding && (e.padding = H(r.Padding)), r.HorizontalAlignment && (e.justifySelf = r.HorizontalAlignment.toLowerCase()), r.VerticalAlignment && (e.alignSelf = r.VerticalAlignment.toLowerCase()), [a.style, e];
		}), q = () => {
			x = !0, C = !1, y.value = "pressing";
		}, J = () => {
			x && ie();
		}, ie = () => {
			y.value !== "" && (x = !1, C && (y.value = "releasing"));
		}, Y = ie, X = (e) => {
			y.value === "pressing" && e.animationName === "chevron-press" ? (C = !0, x || (y.value = "releasing")) : y.value === "releasing" && e.animationName === "chevron-release" && (y.value = "", C = !1);
		}, Z = (e) => {
			if (T.value) return;
			if (i("Click", e), ge(a.Click, d)?.(e), p.value) {
				p.value = !1;
				return;
			}
			let t = f.value.getBoundingClientRect();
			v.value = {
				top: t.top,
				bottom: t.bottom,
				left: t.left,
				right: t.right,
				width: t.width,
				height: t.height
			}, p.value = !0;
		}, ae = (e) => {
			i("Select", e), ge(a.Select, d)?.(e), p.value = !1;
		};
		return (e, t) => (D(), l("div", {
			class: "win-dropdown-btn-wrap",
			ref_key: "wrap",
			ref: f
		}, [u("button", b(w.value, {
			class: ["win-btn DefaultButtonStyle win-dropdown-btn", z(a).class],
			style: K.value,
			disabled: T.value,
			onClick: Z,
			onMousedown: q,
			onMouseup: J,
			onMouseleave: t[0] ||= (...e) => z(Y) && z(Y)(...e)
		}), [u("span", or, [k.value.length ? (D(), s(z(M), { key: 0 })) : (D(), l("span", sr, L(E.value), 1))]), u("span", {
			class: S(["icon win-dd-chevron chevron-animate", [y.value, { open: p.value }]]),
			"aria-hidden": "true",
			onAnimationend: X
		}, null, 34)], 16, ar), m(It, {
			Open: p.value,
			AnchorRect: v.value,
			Items: re.value,
			Placement: G.value,
			onClose: t[1] ||= (e) => p.value = !1,
			onSelect: ae
		}, null, 8, [
			"Open",
			"AnchorRect",
			"Items",
			"Placement"
		])], 512));
	}
}), lr = h({
	name: "SplitButton.Flyout",
	__splitButtonProperty: "flyout",
	setup(e, { slots: t }) {
		return () => _("span", { class: "split-button-property" }, t.default?.());
	}
}), ur = /* @__PURE__ */ h({
	Flyout: lr,
	inheritAttrs: !1,
	__name: "SplitButton",
	props: {
		Content: {
			type: [String, Number],
			default: ""
		},
		Flyout: {
			type: [Object, Array],
			default: () => ({ Items: [] })
		},
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		Theme: {
			type: String,
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		Padding: {
			type: String,
			default: ""
		},
		Margin: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	emits: ["Click", "Select"],
	setup(e, { emit: n }) {
		let r = e, i = n, a = te(), c = ne(), d = g(), f = d?.provides?.[re] ?? {}, v = (e) => {
			let t = e?.type;
			if (!t || typeof t != "object") return !1;
			let n = t.name || t.__name;
			return n === "Flyout" || n === "Flyout";
		}, y = o(() => {
			let e = [], t = [], n = "", r = (e) => {
				for (let i of e ?? []) if (v(i)) {
					let e = i.props?.Placement;
					e && (n = e);
					let t = i.children && typeof i.children == "object" ? i.children.default : void 0;
					t && r(t());
				} else t.push(i);
			};
			for (let t of c.default?.() ?? []) {
				let n = t.type;
				if (typeof n == "object" && n?.__splitButtonProperty === "flyout") {
					let e = t.children && typeof t.children == "object" ? t.children.default : void 0;
					e && r(e());
				} else e.push(t);
			}
			return {
				main: e,
				flyout: t,
				placement: n
			};
		}), b = h({ setup() {
			return () => _(t, y.value.main);
		} }), x = h({ setup() {
			return () => _(t, y.value.flyout);
		} }), T = o(() => y.value.main), E = o(() => y.value.flyout), k = A(null), j = A(!1), N = A(null), P = A(""), F = A(""), I = !1, R = !1, B, V = o(() => $(r.IsEnabled, d) !== !1), U = o(() => !V.value), W = o(() => !U.value), G = o(() => $(r.Content, d)), K = o(() => $(r.Flyout, d)), q = o(() => $(r.Theme, d)), J = o(() => $(r.MinWidth, d)), ie = o(() => $(r.MinHeight, d)), Y = o(() => $(r.Padding, d)), X = o(() => $(r.Margin, d)), Z = o(() => $(r.VerticalAlignment, d)), ae = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, Q = (e) => {
			if (!e) return "";
			let t = String(e).split(",").map((e) => ae(Number.isNaN(Number(e.trim())) ? e.trim() : Number(e.trim())));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : e;
		}, oe = o(() => Array.isArray(K.value) ? { Items: K.value } : K.value || { Items: [] }), se = o(() => y.value.placement || oe.value.Placement || "Bottom"), ce = o(() => oe.value.Items ?? []), le = o(() => ce.value.map((e) => typeof e == "string" ? {
			Text: e,
			Value: e
		} : {
			...e,
			Text: e.Text ?? e.Content ?? e.label ?? String(e)
		})), ue = o(() => {
			let e = {};
			return J.value !== "" && (e.minWidth = ae(J.value)), ie.value !== "" && (e.minHeight = ae(ie.value)), Y.value && (e["--SplitButtonPadding"] = Q(Y.value)), X.value && (e.margin = Q(X.value)), Z.value && (e.alignSelf = String(Z.value).toLowerCase()), [a.style, e];
		}), de = o(() => q.value || F.value), fe = () => {
			let e = k.value?.closest(".theme-light, .theme-dark");
			return e?.classList.contains("theme-dark") ? "dark" : e?.classList.contains("theme-light") ? "light" : "";
		}, pe = () => {
			B?.disconnect();
			let e = k.value?.closest(".theme-light, .theme-dark");
			F.value = fe(), e && (B = new MutationObserver(() => {
				F.value = fe();
			}), B.observe(e, {
				attributes: !0,
				attributeFilter: ["class"]
			}));
		}, me = () => {
			I = !0, R = !1, P.value = "pressing";
		}, he = () => {
			I && _e();
		}, _e = () => {
			P.value !== "" && (I = !1, R && (P.value = "releasing"));
		}, ve = (e) => {
			P.value === "pressing" && e.animationName === "chevron-press" ? (R = !0, I || (P.value = "releasing")) : P.value === "releasing" && e.animationName === "chevron-release" && (P.value = "", R = !1);
		}, ye = () => {
			if (U.value) return;
			if (j.value) {
				j.value = !1;
				return;
			}
			let e = k.value.getBoundingClientRect();
			N.value = {
				top: e.top,
				bottom: e.bottom,
				left: e.left,
				right: e.right,
				width: e.width,
				height: e.height
			}, j.value = !0;
		}, be = () => {
			j.value = !1;
		}, xe = (e) => {
			U.value || (i("Click", e), ge(a.Click, d)?.(e));
		}, Se = (e) => {
			i("Select", e), ge(a.Select, d)?.(e), j.value = !1;
		};
		return O(re, {
			...f,
			buttonIsEnabled: W,
			OnMainButtonClick: xe,
			OnFlyoutButtonClick: ye
		}), ee(pe), w(() => B?.disconnect()), (e, t) => (D(), l("div", {
			class: S(["win-split-button", [z(a).class, { "is-open": j.value }]]),
			style: C(ue.value),
			ref_key: "wrap",
			ref: k
		}, [
			M(e.$slots, "main", {
				isDisabled: U.value,
				onClick: xe
			}, () => [m(Kn, {
				class: "win-split-main-button",
				IsEnabled: "{x:Bind buttonIsEnabled, Mode=OneWay}",
				Click: "OnMainButtonClick"
			}, {
				default: H(() => [T.value.length ? (D(), s(z(b), { key: 0 })) : M(e.$slots, "default", { key: 1 }, () => [p(L(G.value), 1)])]),
				_: 3
			})]),
			t[1] ||= u("div", { class: "win-btn-separator" }, null, -1),
			m(Kn, {
				class: "win-btn-chevron",
				IsEnabled: "{x:Bind buttonIsEnabled, Mode=OneWay}",
				Width: "35",
				MinWidth: "35",
				Padding: "0,0,12,0",
				Click: "OnFlyoutButtonClick",
				onMousedown: me,
				onMouseup: he,
				onMouseleave: _e,
				onPointercancel: _e,
				onLostpointercapture: _e,
				onBlur: _e
			}, {
				default: H(() => [u("span", {
					class: S(["icon chevron-animate", P.value]),
					"aria-hidden": "true",
					onAnimationend: ve
				}, null, 34)]),
				_: 1
			}),
			m(It, {
				Open: j.value,
				AnchorRect: N.value,
				Items: le.value,
				Placement: se.value,
				Theme: de.value,
				onClose: t[0] ||= (e) => j.value = !1,
				onSelect: Se
			}, {
				default: H(() => [E.value.length ? (D(), s(z(x), { key: 0 })) : M(e.$slots, "flyout", {
					key: 1,
					close: be
				})]),
				_: 3
			}, 8, [
				"Open",
				"AnchorRect",
				"Items",
				"Placement",
				"Theme"
			])
		], 6));
	}
}), dr = h({
	name: "ToggleSplitButton.Flyout",
	__splitButtonProperty: "flyout",
	setup(e, { slots: t }) {
		return () => _("span", { class: "split-button-property" }, t.default?.());
	}
}), fr = /* @__PURE__ */ h({
	Flyout: dr,
	inheritAttrs: !1,
	__name: "ToggleSplitButton",
	props: {
		Content: {
			type: [String, Number],
			default: ""
		},
		IsChecked: {
			type: [Boolean, String],
			default: void 0
		},
		Flyout: {
			type: [Object, Array],
			default: () => ({ Items: [] })
		},
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		Theme: {
			type: String,
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		Padding: {
			type: String,
			default: ""
		},
		Margin: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	emits: [
		"update:IsChecked",
		"Click",
		"IsCheckedChanged",
		"Select"
	],
	setup(e, { emit: n }) {
		let r = e, i = n, a = te(), l = ne(), u = g(), d = o(() => $(r.Content, u)), f = (e) => e.type?.__splitButtonProperty === "flyout", p = (e) => {
			let t = e?.type, n = t?.name || t?.__name;
			return n === "Flyout" || n === "Flyout";
		}, v = o(() => {
			let e = [], n = [], r = (i) => {
				for (let a of i) {
					if (f(a)) {
						let e = a.children && typeof a.children == "object" ? a.children.default : void 0;
						if (e) for (let t of e()) if (p(t)) {
							let e = t.children && typeof t.children == "object" ? t.children.default : void 0;
							e && n.push(...e());
						} else n.push(t);
						continue;
					}
					if (a.type === t && Array.isArray(a.children)) {
						r(a.children);
						continue;
					}
					e.push(a);
				}
			};
			return r(l.default?.() ?? []), {
				main: e,
				flyout: n
			};
		}), y = o(() => v.value.main), b = o(() => v.value.flyout), x = h({
			name: "ToggleSplitButtonMainOutlet",
			setup() {
				return () => y.value.length ? _(t, y.value) : String(d.value ?? "");
			}
		}), w = h({
			name: "ToggleSplitButtonFlyoutOutlet",
			setup() {
				return () => _(t, b.value);
			}
		}), ee = o(() => $(r.IsChecked, u)), T = o(() => $(r.IsEnabled, u) !== !1), E = A(void 0), k = A(!1);
		V(ee, (e) => {
			k.value || (E.value = e === !0);
		}, { immediate: !0 });
		let j = o(() => E.value === void 0 ? ee.value === !0 : E.value), M = o(() => !T.value), N = o(() => Array.isArray(r.Flyout) ? { Items: r.Flyout } : r.Flyout || { Items: [] }), P = o(() => N.value.Items ?? []), F = o(() => P.value.map((e, t) => typeof e == "string" ? {
			Text: e,
			Value: t
		} : {
			...e,
			Text: e.Text ?? e.Content ?? e.label ?? String(e),
			Value: e.Value ?? t
		})), I = o(() => ({
			...N.value,
			Items: F.value
		})), L = (e, t) => {
			M.value || (E.value = e, k.value = !0, i("update:IsChecked", e), me(r.IsChecked, e, u), k.value = !1, i("Click", t), ge(a.Click, u)?.(t), i("IsCheckedChanged", { IsChecked: e }), ge(a.IsCheckedChanged, u)?.({ IsChecked: e }));
		};
		return O(re, {
			splitFlyout: I,
			resolvedIsEnabled: T,
			Theme: o(() => r.Theme),
			MinWidth: o(() => r.MinWidth),
			MinHeight: o(() => r.MinHeight),
			Padding: o(() => r.Padding),
			Margin: o(() => r.Margin),
			VerticalAlignment: o(() => r.VerticalAlignment),
			OnSplitClick: (e) => {
				L(!j.value, e);
			},
			OnSelect: (e) => {
				i("Select", e), ge(a.Select, u)?.(e);
			}
		}), (e, t) => (D(), s(ur, {
			class: S([z(a).class, { "is-checked": j.value }]),
			style: C(z(a).style),
			Flyout: "{x:Bind splitFlyout, Mode=OneWay}",
			IsEnabled: "{x:Bind resolvedIsEnabled, Mode=OneWay}",
			Theme: "{x:Bind Theme, Mode=OneWay}",
			MinWidth: "{x:Bind MinWidth, Mode=OneWay}",
			MinHeight: "{x:Bind MinHeight, Mode=OneWay}",
			Padding: "{x:Bind Padding, Mode=OneWay}",
			Margin: "{x:Bind Margin, Mode=OneWay}",
			VerticalAlignment: "{x:Bind VerticalAlignment, Mode=OneWay}",
			Click: "OnSplitClick",
			Select: "OnSelect"
		}, {
			flyout: H(() => [b.value.length ? (D(), s(z(w), { key: 0 })) : c("", !0)]),
			default: H(() => [m(z(x))]),
			_: 1
		}, 8, ["class", "style"]));
	}
}), pr = [
	"tabindex",
	"aria-checked",
	"aria-disabled",
	"onKeydown"
], mr = {
	class: "checkbox-box",
	"aria-hidden": "true"
}, hr = {
	key: 0,
	class: "checkbox-glyph indeterminate-glyph"
}, gr = { class: "checkbox-content" }, _r = "", vr = /* @__PURE__ */ h({
	__name: "CheckBox",
	props: {
		Content: {
			type: [String, Number],
			default: ""
		},
		IsChecked: {
			type: [
				Boolean,
				String,
				null
			],
			default: void 0
		},
		IsThreeState: {
			type: [Boolean, String],
			default: void 0
		},
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		Margin: {
			type: String,
			default: ""
		},
		modelValue: {
			type: [Boolean, null],
			default: void 0
		},
		isThreeState: {
			type: Boolean,
			default: !1
		},
		indeterminate: {
			type: Boolean,
			default: void 0
		},
		disabled: Boolean
	},
	emits: [
		"update:modelValue",
		"update:IsChecked",
		"Checked",
		"Unchecked",
		"Indeterminate",
		"checked",
		"unchecked",
		"indeterminate"
	],
	setup(e, { emit: t }) {
		let n = e, r = g(), i = te(), a = o(() => $(n.Content, r)), s = o(() => $(n.IsChecked, r)), d = o(() => $(n.IsThreeState, r)), f = o(() => $(n.IsEnabled, r) !== !1), m = t, h = A(!1), _ = A(void 0);
		o(() => n.IsChecked !== void 0 || n.modelValue !== void 0 || n.indeterminate !== void 0);
		let v = o(() => d.value ?? n.isThreeState), y = o(() => n.disabled || !f.value), b = o(() => n.indeterminate === !0 ? null : _.value === void 0 ? h.value : _.value);
		V([
			s,
			() => n.modelValue,
			() => n.indeterminate
		], ([e, t, n]) => {
			n === !0 ? _.value = null : e === void 0 ? t === void 0 ? _.value = void 0 : _.value = t : _.value = e === null ? null : e === !0, t !== void 0 && (h.value = t);
		}, { immediate: !0 });
		let x = o(() => b.value === !0), w = o(() => v.value && b.value === null), ee = o(() => w.value ? "mixed" : String(x.value)), T = o(() => ({
			"is-checked": x.value,
			"is-unchecked": !x.value && !w.value,
			"is-indeterminate": w.value,
			"is-disabled": y.value
		})), E = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, O = (e) => {
			if (!e) return "";
			let t = String(e).split(",").map((e) => E(Number.isNaN(Number(e.trim())) ? e.trim() : Number(e.trim())));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : e;
		}, k = o(() => n.Margin ? { margin: O(n.Margin) } : {}), j = (e) => {
			_.value = e, h.value = e === !0, m("update:modelValue", e), m("update:IsChecked", e), e === !0 ? (m("Checked", e), ge(i.Checked, r)?.(e), m("checked", e)) : e === null ? (m("Indeterminate", e), ge(i.Indeterminate, r)?.(e), m("indeterminate", e)) : (m("Unchecked", e), ge(i.Unchecked, r)?.(e), m("unchecked", e));
		}, N = () => {
			if (!y.value) {
				if (v.value) {
					b.value === !1 ? j(!0) : b.value === !0 ? j(null) : j(!1);
					return;
				}
				j(!x.value);
			}
		};
		return (e, t) => (D(), l("div", {
			class: S(["win-checkbox", T.value]),
			style: C(k.value),
			tabindex: y.value ? -1 : 0,
			role: "checkbox",
			"aria-checked": ee.value,
			"aria-disabled": y.value,
			onClick: N,
			onKeydown: [W(G(N, ["prevent"]), ["space"]), W(G(N, ["prevent"]), ["enter"])]
		}, [u("span", mr, [u("span", { class: S(["checkbox-glyph check-glyph", {
			checked: x.value,
			hidden: w.value
		}]) }, "", 2), w.value ? (D(), l("span", hr, L(_r))) : c("", !0)]), u("span", gr, [M(e.$slots, "default", {}, () => [p(L(a.value), 1)])])], 46, pr));
	}
}), yr = [
	"checked",
	"disabled",
	"onChange"
], br = [
	"name",
	"checked",
	"disabled"
], xr = {
	__name: "RadioButton",
	props: {
		Content: {
			type: [String, Number],
			default: ""
		},
		IsChecked: {
			type: [Boolean, String],
			default: void 0
		},
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		GroupName: {
			type: String,
			default: ""
		},
		name: {
			type: String,
			default: ""
		},
		Header: {
			type: String,
			default: ""
		},
		ItemsSource: {
			type: [Array, String],
			default: () => []
		},
		SelectedIndex: {
			type: [Number, String],
			default: void 0
		},
		SelectedItem: {
			type: null,
			default: void 0
		},
		MaxColumns: {
			type: [Number, String],
			default: 1
		},
		Margin: {
			type: String,
			default: ""
		},
		value: {
			type: [
				String,
				Number,
				Boolean,
				Object
			],
			default: void 0
		},
		modelValue: {
			type: [
				String,
				Number,
				Boolean,
				Object
			],
			default: void 0
		}
	},
	emits: [
		"update:IsChecked",
		"Checked",
		"Unchecked",
		"update:modelValue",
		"update:SelectedIndex",
		"update:SelectedItem",
		"SelectionChanged"
	],
	setup(e, { emit: n }) {
		let r = Symbol.for("WinUIonWeb.RadioButtons"), i = e, a = n, d = `win-radio-buttons-${Math.random().toString(36).slice(2)}`, f = g(), h = te(), _ = o(() => {
			let e = $(i.ItemsSource, f);
			return Array.isArray(e) ? e : [];
		}), y = o(() => $(i.Header, f)), b = o(() => $(i.IsEnabled, f) !== !1), x = o(() => $(i.IsChecked, f)), w = o(() => {
			let e = $(i.SelectedIndex, f);
			return e === void 0 || e === "" ? void 0 : Number(e);
		}), ee = A(w.value ?? -1), T = v(r, null), E = T?.register?.(), k = 0, N = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, P = (e) => {
			if (!e) return "";
			let t = String(e).split(",").map((e) => N(Number.isNaN(Number(e.trim())) ? e.trim() : Number(e.trim())));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : e;
		}, F = o(() => y.value !== "" || _.value.length > 0 || w.value !== void 0 || i.SelectedItem !== void 0), I = o(() => _.value.map((e) => typeof e == "string" || typeof e == "number" ? {
			Text: String(e),
			Value: e
		} : {
			...e,
			Text: e.Text ?? e.Content ?? e.label ?? String(e),
			Value: e.Value ?? e
		})), R = o(() => w.value ?? ee.value), z = o(() => i.GroupName || i.name), ne = o(() => x.value === void 0 ? T && E !== void 0 ? T.selectedIndex.value === E : i.modelValue === i.value : x.value === !0), B = o(() => {
			let e = $(i.Content, f);
			return e == null ? "" : String(e);
		}), V = o(() => y.value), U = o(() => B.value), W = o(() => i.Margin ? { margin: P($(i.Margin, f)) } : {}), G = o(() => {
			let e = Math.max(1, Number(i.MaxColumns) || 1);
			return e > 1 ? { gridTemplateColumns: `repeat(${e}, max-content)` } : { gridTemplateColumns: "max-content" };
		}), K = () => {
			b.value && (T && E !== void 0 && T.select(E), a("update:IsChecked", !0), a("Checked"), ge(h.Checked, f)?.(), i.value !== void 0 && a("update:modelValue", i.value));
		}, q = (e) => {
			if (!b.value) return;
			let t = I.value[R.value], n = I.value[e];
			ee.value = e, a("update:SelectedIndex", e), a("update:SelectedItem", n?.Value ?? n);
			let r = {
				SelectedIndex: e,
				SelectedItem: n?.Value ?? n,
				AddedItems: n ? [n.Value ?? n] : [],
				RemovedItems: t ? [t.Value ?? t] : []
			};
			a("SelectionChanged", r), ge(h.SelectionChanged, f)?.(r);
		};
		return O(re, {
			RadioButtonsHeader: V,
			RadioContent: U
		}), O(r, {
			selectedIndex: R,
			register: () => k++,
			select: q
		}), (e, n) => F.value ? (D(), l("div", {
			key: 0,
			class: S(["win-radio-buttons", { "is-disabled": !b.value }]),
			style: C(W.value)
		}, [y.value ? (D(), s(Rt, {
			key: 0,
			class: "win-radio-buttons-header",
			Text: "{x:Bind RadioButtonsHeader}"
		})) : c("", !0), u("div", {
			class: "win-radio-buttons-items",
			style: C(G.value)
		}, [(D(!0), l(t, null, j(I.value, (e, t) => (D(), l("label", {
			key: t,
			class: S(["win-radio-button", {
				"is-checked": R.value === t,
				"is-disabled": !b.value
			}])
		}, [
			u("input", {
				class: "win-radio-input",
				type: "radio",
				name: d,
				checked: R.value === t,
				disabled: !b.value,
				onChange: (e) => q(t)
			}, null, 40, yr),
			n[0] ||= u("span", {
				class: "win-radio-glyph",
				"aria-hidden": "true"
			}, [u("span", { class: "win-radio-check" })], -1),
			m(Rt, { class: "win-radio-content" }, {
				default: H(() => [p(L(e.Text), 1)]),
				_: 2
			}, 1024)
		], 2))), 128)), I.value.length === 0 ? M(e.$slots, "default", { key: 0 }) : c("", !0)], 4)], 6)) : (D(), l("label", {
			key: 1,
			class: S(["win-radio-button", {
				"is-checked": ne.value,
				"is-disabled": !b.value
			}]),
			style: C(W.value)
		}, [
			u("input", {
				class: "win-radio-input",
				type: "radio",
				name: z.value || void 0,
				checked: ne.value,
				disabled: !b.value,
				onChange: K
			}, null, 40, br),
			n[1] ||= u("span", {
				class: "win-radio-glyph",
				"aria-hidden": "true"
			}, [u("span", { class: "win-radio-check" })], -1),
			m(Rt, {
				class: "win-radio-content",
				Text: "{x:Bind RadioContent}"
			}, {
				default: H(() => [M(e.$slots, "default", {}, () => [p(L(B.value), 1)])]),
				_: 3
			})
		], 6));
	}
}, Sr = {
	__name: "RadioButtons",
	props: {
		Header: {
			type: [String, Number],
			default: ""
		},
		ItemsSource: {
			type: [Array, String],
			default: () => []
		},
		SelectedIndex: {
			type: [Number, String],
			default: void 0
		},
		SelectedItem: {
			type: null,
			default: void 0
		},
		MaxColumns: {
			type: [Number, String],
			default: 1
		},
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		Margin: {
			type: String,
			default: ""
		}
	},
	emits: [
		"update:SelectedIndex",
		"update:SelectedItem",
		"SelectionChanged"
	],
	setup(e, { emit: n }) {
		let r = Symbol.for("WinUIonWeb.RadioButtons"), i = e, a = n, d = g(), f = ne(), { t: p } = rt(), m = o(() => $(i.Header, d)), h = o(() => $(i.IsEnabled, d) !== !1), _ = o(() => {
			let e = [], t = (e) => {
				if (e == null) return "";
				if (Array.isArray(e)) return e.map(t).join("");
				if (typeof e == "string" || typeof e == "number") return String(e);
				if (typeof e != "object") return "";
				let n = e.children;
				if (typeof n == "string" || typeof n == "number") return String(n);
				if (n && typeof n == "object" && typeof n.default == "function") try {
					return t(n.default());
				} catch {
					return "";
				}
				return t(n);
			}, n = (r) => {
				if (r) {
					if (Array.isArray(r)) {
						r.forEach(n);
						return;
					}
					if (typeof r == "object") {
						let n = r.type, i = typeof n == "string" ? n : n?.name || n?.__name || "";
						if (String(i).toLowerCase() === "x:string") {
							let n = t(r.children).trim();
							n && e.push(n);
						}
					}
				}
			};
			return n(f.default?.()), e;
		}), v = o(() => {
			let e = $(i.ItemsSource, d);
			return Array.isArray(e) && e.length ? e : _.value;
		}), y = o(() => {
			let e = $(i.SelectedIndex, d);
			return e === void 0 || e === "" ? void 0 : Number(e);
		}), b = A(y.value ?? -1);
		V(y, (e) => {
			e !== void 0 && e !== b.value && (b.value = e);
		});
		let x = 0, w = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, ee = (e) => {
			if (!e) return "";
			let t = String(e).split(",").map((e) => w(Number.isNaN(Number(e.trim())) ? e.trim() : Number(e.trim())));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : e;
		}, T = (e) => {
			let t = {
				Blue: "text.blue",
				Green: "text.green",
				Red: "text.red",
				Yellow: "text.yellow",
				White: "text.white",
				Black: "sample.black",
				StepValues: "sample.step-values",
				Ticks: "sample.ticks"
			}[String(e)];
			return t ? p(t) : String(e);
		}, E = o(() => v.value.map((e) => typeof e == "string" || typeof e == "number" ? {
			Text: T(e),
			Value: e
		} : {
			...e,
			Text: e.Text ?? e.Content ?? String(e),
			Value: e.Value ?? e
		})), k = o(() => b.value), N = o(() => i.Margin ? { margin: ee(i.Margin) } : {}), P = o(() => {
			let e = Math.max(1, Number(i.MaxColumns) || 1);
			return { gridTemplateColumns: e > 1 ? `repeat(${e}, max-content)` : "max-content" };
		}), F = (e) => {
			if (!h.value) return;
			let t = E.value[k.value], n = E.value[e];
			b.value = e, a("update:SelectedIndex", e), a("update:SelectedItem", n?.Value ?? n), a("SelectionChanged", {
				SelectedIndex: e,
				SelectedItem: n?.Value ?? n,
				AddedItems: n ? [n.Value ?? n] : [],
				RemovedItems: t ? [t.Value ?? t] : []
			});
		};
		return O(r, {
			selectedIndex: k,
			register: () => x++,
			select: F
		}), (e, n) => (D(), l("div", {
			class: S(["win-radio-buttons", { "is-disabled": !h.value }]),
			style: C(N.value)
		}, [m.value ? (D(), s(Rt, {
			key: 0,
			class: "win-radio-buttons-header",
			Text: m.value
		}, null, 8, ["Text"])) : c("", !0), u("div", {
			class: "win-radio-buttons-items",
			style: C(P.value)
		}, [(D(!0), l(t, null, j(E.value, (e, t) => (D(), s(xr, {
			key: t,
			Content: e.Text,
			IsChecked: k.value === t,
			IsEnabled: h.value,
			onChecked: (e) => F(t)
		}, null, 8, [
			"Content",
			"IsChecked",
			"IsEnabled",
			"onChecked"
		]))), 128)), E.value.length === 0 ? M(e.$slots, "default", { key: 0 }) : c("", !0)], 4)], 6));
	}
}, Cr = 0, wr = 20, Tr = 3, Er = {
	__name: "ToggleSwitch",
	props: {
		IsOn: {
			type: [Boolean, String],
			default: void 0
		},
		Header: {
			type: [String, Number],
			default: ""
		},
		OnContent: {
			type: [String, Number],
			default: ""
		},
		OffContent: {
			type: [String, Number],
			default: ""
		},
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		modelValue: {
			type: Boolean,
			default: void 0
		},
		onContent: {
			type: String,
			default: ""
		},
		offContent: {
			type: String,
			default: ""
		},
		disabled: Boolean
	},
	emits: [
		"update:IsOn",
		"Toggled",
		"update:modelValue"
	],
	setup(e, { emit: t }) {
		let { t: n } = rt(), r = g(), i = te(), a = e, d = t, f = A(!1), p = A(!1), m = A(0), h = o(() => $(a.IsOn, r)), _ = o(() => $(a.modelValue, r)), v = A(h.value ?? _.value ?? !1), y = o(() => h.value ?? _.value ?? v.value), b = o(() => $(a.IsEnabled, r) !== !1 && !a.disabled), x = o(() => $(a.Header, r)), w = o(() => $(a.OnContent || a.onContent || n("text.on"), r)), ee = o(() => $(a.OffContent || a.offContent || n("text.off"), r)), T = o(() => x.value), E = o(() => y.value ? w.value : ee.value), k = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, j = o(() => a.Width === "" ? {} : { width: k(a.Width) }), N = 0, P = !1, F = !1, I = !1;
		V(y, (e) => {
			f.value || (m.value = e ? wr : Cr);
		}, { immediate: !0 });
		let L = o(() => f.value || p.value ? { "--tx": m.value + "px" } : {}), R = () => {
			if (b.value) {
				if (I) {
					I = !1;
					return;
				}
				z(!y.value);
			}
		}, z = (e) => {
			v.value = e, d("update:IsOn", e), d("update:modelValue", e);
			let t = { IsOn: e };
			d("Toggled", t), ge(i.Toggled, r)?.(t);
		};
		O(re, {
			ToggleSwitchHeader: T,
			ToggleSwitchContent: E
		});
		let ne = (e) => {
			b.value && (p.value = !0, f.value = !0, F = !1, I = !1, N = e.clientX, P = y.value, m.value = P ? wr : Cr, e.currentTarget.setPointerCapture(e.pointerId));
		}, B = (e) => {
			if (!f.value) return;
			let t = e.clientX - N;
			Math.abs(t) > Tr && (F = !0);
			let n = P ? wr + t : Cr + t;
			m.value = Math.max(Cr, Math.min(wr, n));
		}, U = (e) => {
			if (f.value) if (f.value = !1, p.value = !1, e.currentTarget.hasPointerCapture?.(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId), I = !0, F) {
				let e = (wr - Cr) / 2;
				z((P ? m.value <= e : m.value >= e) ? !P : P);
			} else z(!P);
		};
		return (e, t) => (D(), l("div", {
			class: "win-switch-root",
			style: C(j.value)
		}, [x.value ? (D(), s(Rt, {
			key: 0,
			class: "win-switch-header",
			Text: "{x:Bind ToggleSwitchHeader}"
		})) : c("", !0), u("div", {
			class: S(["win-switch-wrap", { "is-disabled": !b.value }]),
			onClick: R
		}, [u("div", {
			class: S(["win-switch", {
				"is-on": y.value,
				dragging: f.value,
				"is-pressed": p.value,
				"is-disabled": !b.value
			}]),
			onPointerdown: G(ne, ["stop"]),
			onPointermove: B,
			onPointerup: U,
			onPointercancel: U
		}, [t[1] ||= u("div", { class: "track" }, null, -1), u("div", {
			class: "knob",
			style: C(L.value)
		}, [...t[0] ||= [u("div", { class: "thumb" }, null, -1)]], 4)], 34), e.$slots.default ? (D(), s(Rt, {
			key: 0,
			class: "win-switch-label"
		}, {
			default: H(() => [M(e.$slots, "default")]),
			_: 3
		})) : (D(), s(Rt, {
			key: 1,
			class: "win-switch-label",
			Text: "{x:Bind ToggleSwitchContent}"
		}))], 2)], 4));
	}
}, Dr = ["aria-describedby", "aria-label"], Or = /* @__PURE__ */ h({
	name: "ToolTip",
	inheritAttrs: !1,
	__name: "ToolTip",
	props: {
		Content: {
			type: [
				String,
				Number,
				Object
			],
			default: ""
		},
		IsOpen: {
			type: [Boolean, String],
			default: void 0
		},
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		Placement: {
			type: String,
			default: "Mouse"
		},
		PlacementTarget: {
			type: [Object, String],
			default: null
		},
		PlacementPoint: {
			type: Object,
			default: null
		},
		PlacementRect: {
			type: [Object, String],
			default: null
		},
		HorizontalOffset: {
			type: [String, Number],
			default: 0
		},
		VerticalOffset: {
			type: [String, Number],
			default: 0
		},
		Background: {
			type: String,
			default: ""
		},
		Foreground: {
			type: String,
			default: ""
		},
		BorderBrush: {
			type: String,
			default: ""
		},
		BorderThickness: {
			type: [String, Number],
			default: ""
		},
		Padding: {
			type: String,
			default: ""
		},
		FontFamily: {
			type: String,
			default: ""
		},
		FontSize: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: 320
		},
		CornerRadius: {
			type: [String, Number],
			default: ""
		},
		BackgroundSizing: {
			type: String,
			default: "InnerBorderEdge"
		},
		InitialShowDelay: {
			type: Number,
			default: 800
		},
		BetweenShowDelay: {
			type: Number,
			default: 200
		},
		ShowOnDisabled: {
			type: Boolean,
			default: !1
		},
		IsServiceHost: {
			type: Boolean,
			default: !1
		},
		Theme: {
			type: String,
			default: ""
		},
		UseNativeToolTip: {
			type: Boolean,
			default: !0
		},
		NativeToolTip: {
			type: [String, Boolean],
			default: ""
		},
		"ToolTipService.ToolTip": {
			type: [
				String,
				Number,
				Object
			],
			default: ""
		},
		"ToolTipService.Placement": {
			type: String,
			default: ""
		},
		"ToolTipService.PlacementTarget": {
			type: [Object, String],
			default: null
		}
	},
	emits: [
		"update:IsOpen",
		"Opened",
		"Closed",
		"Opening",
		"Closing",
		"tooltip-pointer-enter",
		"tooltip-pointer-leave"
	],
	setup(e, { expose: r, emit: a }) {
		let u = e, d = a, f = g(), p = te(), h = ne(), _ = v("winuiTheme", null), y = A(null), b = A(null), T = A(void 0), E = A(!1), k = A(!1), j = A(null), N = A({
			top: 0,
			left: 0
		}), P = A(!1), F = A(!1), I = A("Mouse"), L = A("body"), R = `tooltip-${Math.random().toString(36).slice(2, 10)}`, B, U, W = 0, G = o(() => $(u.IsEnabled, f) !== !1), K = o(() => $(u.IsOpen, f)), q = o(() => T.value === void 0 ? K.value : T.value), J = o(() => q.value && G.value), ie = o(() => u["ToolTipService.ToolTip"]), Y = o(() => {
			let e = $(u.Content, f);
			return e !== "" && e !== null ? e : $(ie.value, f);
		}), X = o(() => {
			let e = Y.value;
			if (e && typeof e == "object") {
				let t = e;
				return String(t.Content ?? t.content ?? "");
			}
			return String(e ?? "");
		});
		O(re, { ToolTipContent: o(() => X.value) });
		let Z = o(() => $(u["ToolTipService.Placement"] || u.Placement || "Mouse", f)), ae = o(() => $(u["ToolTipService.PlacementTarget"] || u.PlacementTarget, f)), Q = o(() => {
			let e = String(u.Theme || "").toLowerCase();
			if (e === "light" || e === "dark") return e;
			let t = String(z(_) || "").toLowerCase();
			return t === "light" || t === "dark" ? t : "";
		}), oe = o(() => Q.value ? `win-theme-scope theme-${Q.value}` : "tooltip-theme"), se = o(() => ({
			FromHorizontalOffset: Number(u.HorizontalOffset || 0),
			FromVerticalOffset: Number(u.VerticalOffset || 0)
		})), ce = (e) => e === "" || e == null ? "" : typeof e == "number" || typeof e == "string" && /^-?\d+(\.\d+)?$/.test(e.trim()) ? `${e}px` : e, le = (e) => {
			if (!e) return "";
			let t = String(e).split(",").map((e) => ce(e.trim()));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : e;
		}, ue = o(() => ({
			top: `${N.value.top}px`,
			left: `${N.value.left}px`,
			visibility: P.value ? void 0 : "hidden",
			animationPlayState: P.value ? "running" : "paused",
			background: u.Background || void 0,
			backgroundImage: u.Background ? "none" : void 0,
			color: u.Foreground || void 0,
			borderColor: u.BorderBrush || void 0,
			borderWidth: u.BorderThickness === "" ? void 0 : ce(u.BorderThickness),
			padding: u.Padding ? le(u.Padding) : void 0,
			fontFamily: u.FontFamily || void 0,
			fontSize: u.FontSize === "" ? void 0 : ce(u.FontSize),
			maxWidth: ce(u.MaxWidth),
			borderRadius: u.CornerRadius === "" ? void 0 : ce(u.CornerRadius),
			boxSizing: u.BackgroundSizing === "InnerBorderEdge" ? "border-box" : void 0
		}));
		function de() {
			let e = ae.value;
			if (!e) return y.value;
			if (typeof e == "string") return document.querySelector(e) || y.value;
			if (e instanceof HTMLElement) return e;
			let t = e;
			return t.$el instanceof HTMLElement ? t.$el : t.value instanceof HTMLElement ? t.value : t.value?.$el instanceof HTMLElement ? t.value.$el : y.value;
		}
		function fe() {
			let e = u.PlacementRect;
			if (!e) return null;
			if (typeof e != "string" && typeof e.getBoundingClientRect == "function") return e.getBoundingClientRect();
			let t = typeof e == "string" ? e.split(",").map((e) => Number(e.trim())) : null;
			if (t && (t.length !== 4 || t.some((e) => !Number.isFinite(e)))) return null;
			let n = de()?.getBoundingClientRect(), r = typeof e == "string" ? null : e, i = t ? t[0] : Number(r?.x ?? r?.left ?? 0), a = t ? t[1] : Number(r?.y ?? r?.top ?? 0), o = t ? t[2] : Number(r?.width ?? 0), s = t ? t[3] : Number(r?.height ?? 0), c = (n?.left ?? 0) + i, l = (n?.top ?? 0) + a;
			return {
				left: c,
				top: l,
				right: c + o,
				bottom: l + s,
				width: o,
				height: s
			};
		}
		function pe(e, t = !1, n = !1) {
			e === q.value && !t || (e && !n ? P.value = !1 : k.value = !1, T.value = e, d("update:IsOpen", e), me(u.IsOpen, e, f));
		}
		V(K, (e) => {
			e !== void 0 && (T.value = e === !0);
		}, { immediate: !0 });
		function he() {
			B !== void 0 && window.clearTimeout(B), U !== void 0 && window.clearTimeout(U), B = void 0, U = void 0;
		}
		function _e(e = !1, t) {
			let n = de(), r = !!(n?.matches?.(":disabled") || n?.querySelector?.(":disabled"));
			if (!G.value || r && !u.ShowOnDisabled || !X.value && !h.content || (he(), q.value)) return;
			let i = e ? 0 : Math.max(0, t ?? u.InitialShowDelay);
			B = window.setTimeout(async () => {
				pe(!0), await x(), await ke();
			}, i);
		}
		function ve(e = !1) {
			he(), !(!e && (E.value || k.value)) && q.value && pe(!1);
		}
		function ye() {
			q.value ? ve(!0) : _e(!0);
		}
		function be(e) {
			e.pointerType !== "touch" && (F.value || (E.value = !0, q.value || (j.value = {
				x: e.clientX,
				y: e.clientY
			}), _e(!1)));
		}
		function xe(e) {
			e.pointerType === "touch" || q.value || !E.value || (j.value = {
				x: e.clientX,
				y: e.clientY
			});
		}
		function Se() {
			E.value = !1, F.value = !1, ve();
		}
		function Ce(e) {
			j.value = {
				x: e.clientX,
				y: e.clientY
			}, e.pointerType === "touch" ? (E.value = !0, W = performance.now() + 100, _e(!1, u.InitialShowDelay / 2)) : (F.value = !0, ve(!0));
		}
		function we() {
			if (F.value || performance.now() < W) return;
			let e = de()?.getBoundingClientRect();
			e && (j.value = {
				x: e.left + e.width / 2,
				y: e.top + e.height / 2
			}), _e(!1);
		}
		function Te() {
			E.value = !1, ve();
		}
		function Ee() {
			k.value = !0, U !== void 0 && window.clearTimeout(U), U = void 0, d("tooltip-pointer-enter"), u.IsOpen === void 0 && !q.value && pe(!0, !0, !0);
		}
		function De() {
			k.value = !1, d("tooltip-pointer-leave"), ve();
		}
		function Oe(e, t, n) {
			return n < t ? t : Math.max(t, Math.min(n, e));
		}
		async function ke() {
			await x();
			let e = b.value;
			if (!e) return;
			let t = fe(), n = t || de()?.getBoundingClientRect();
			if (!n) return;
			let r = e.getBoundingClientRect(), i = String(Z.value || "Mouse").toLowerCase(), a = [
				"bottom",
				"left",
				"mouse",
				"right",
				"top"
			].includes(i) ? i : "mouse", o = u.PlacementPoint, s = o && Number.isFinite(o.x) && Number.isFinite(o.y) ? {
				x: Number(o.x),
				y: Number(o.y)
			} : j.value || {
				x: n.left + n.width / 2,
				y: n.top + n.height / 2
			}, c = Number(u.HorizontalOffset || 0), l = Number(u.VerticalOffset || 0), d = t ? s.x - r.width / 2 : n.left + (n.width - r.width) / 2, f = t ? s.y - r.height / 2 : n.top + (n.height - r.height) / 2, p = {
				top: {
					top: n.top - r.height - 20 - l,
					left: d
				},
				bottom: {
					top: n.bottom + 20 + l,
					left: d
				},
				left: {
					top: f,
					left: n.left - r.width - 20 - c
				},
				right: {
					top: f,
					left: n.right + 20 + c
				}
			}, m = {
				top: [
					"top",
					"bottom",
					"left",
					"right"
				],
				bottom: [
					"bottom",
					"top",
					"left",
					"right"
				],
				left: [
					"left",
					"right",
					"top",
					"bottom"
				],
				right: [
					"right",
					"left",
					"top",
					"bottom"
				]
			}, h = (e) => {
				let t = p[e];
				return e === "top" ? t.top >= 8 : e === "bottom" ? t.top + r.height <= window.innerHeight - 8 : e === "left" ? t.left >= 8 : t.left + r.width <= window.innerWidth - 8;
			}, g, _;
			if (a === "mouse") {
				let e = s.x - r.width / 2 + c, t = {
					top: s.y - r.height - 20,
					left: e
				}, n = {
					top: s.y + 20,
					left: e
				};
				if (l !== 0) {
					let i = {
						top: s.y - l,
						left: e
					}, a = i.top + r.height / 2 < s.y, o = i.top >= 8 && i.top + r.height <= window.innerHeight - 8, c = a ? n : t, u = c.top >= 8 && c.top + r.height <= window.innerHeight - 8;
					o ? (g = a ? "top" : "bottom", _ = i) : u ? (g = a ? "bottom" : "top", _ = c) : (g = a ? "top" : "bottom", _ = i);
				} else t.top >= 8 ? (g = "top", _ = t) : n.top + r.height <= window.innerHeight - 8 ? (g = "bottom", _ = n) : (g = "top", _ = t);
			} else g = m[a].find(h) || a, _ = p[g];
			N.value = {
				top: Oe(_.top, 8, window.innerHeight - r.height - 8),
				left: Oe(_.left, 8, window.innerWidth - r.width - 8)
			}, I.value = g[0].toUpperCase() + g.slice(1), P.value = !0;
		}
		V(q, async (e, t) => {
			if (e === t) return;
			he();
			let n = e ? "Opening" : "Closing";
			d(n), ge(p[n], f)?.(), e && (await x(), await ke());
			let r = e ? "Opened" : "Closed";
			d(r), ge(p[r], f)?.();
		}), V([
			J,
			Z,
			ae,
			() => u.PlacementPoint,
			() => u.PlacementRect,
			() => u.HorizontalOffset,
			() => u.VerticalOffset,
			X
		], () => {
			J.value && ke();
		}, { deep: !0 });
		function Ae() {
			J.value && ke();
		}
		function je() {
			L.value = document.fullscreenElement || "body", J.value && ke();
		}
		return ee(() => {
			L.value = document.fullscreenElement || "body", window.addEventListener("resize", Ae), window.addEventListener("scroll", Ae, !0), document.addEventListener("fullscreenchange", je), J.value && ke();
		}), w(() => {
			he(), window.removeEventListener("resize", Ae), window.removeEventListener("scroll", Ae, !0), document.removeEventListener("fullscreenchange", je);
		}), r({
			show: _e,
			hide: ve,
			toggle: ye,
			updatePosition: ke,
			IsOpen: J,
			TemplateSettings: se
		}), (r, a) => (D(), l(t, null, [e.IsServiceHost ? c("", !0) : (D(), l("span", {
			key: 0,
			ref_key: "anchorRef",
			ref: y,
			class: "tooltip-anchor",
			"aria-describedby": J.value ? R : void 0,
			"aria-label": X.value || void 0,
			onPointerenter: be,
			onPointermove: xe,
			onPointerleave: Se,
			onPointerdown: Ce,
			onFocusin: we,
			onFocusout: Te
		}, [M(r.$slots, "target", {}, () => [M(r.$slots, "default")])], 40, Dr)), (D(), s(n, { to: L.value }, [m(i, { name: "tooltip" }, {
			default: H(() => [J.value ? (D(), l("div", {
				key: 0,
				id: R,
				ref_key: "tooltipRef",
				ref: b,
				class: S(["tooltip", [oe.value, `placement-${I.value.toLowerCase()}`]]),
				style: C(ue.value),
				role: "tooltip",
				onPointerenter: Ee,
				onPointerleave: De
			}, [r.$slots.content ? M(r.$slots, "content", { key: 0 }) : (D(), s(Rt, {
				key: 1,
				Text: "{x:Bind ToolTipContent}",
				TextWrapping: "WrapWholeWords"
			}))], 38)) : c("", !0)]),
			_: 3
		})], 8, ["to"]))], 64));
	}
}), kr = { class: "win-slider-track" }, Ar = 18, jr = 20, Mr = /*@__PURE__*/ Object.assign({ inheritAttrs: !1 }, {
	__name: "Slider",
	props: {
		Value: {
			type: [Number, String],
			default: 0
		},
		Minimum: {
			type: [Number, String],
			default: 0
		},
		Maximum: {
			type: [Number, String],
			default: 100
		},
		SmallChange: {
			type: [Number, String],
			default: 1
		},
		StepFrequency: {
			type: [Number, String],
			default: 1
		},
		Header: {
			type: [String, Number],
			default: ""
		},
		Orientation: {
			type: String,
			default: "Horizontal"
		},
		TickFrequency: {
			type: [Number, String],
			default: 0
		},
		TickPlacement: {
			type: String,
			default: "None"
		},
		SnapsTo: {
			type: String,
			default: "StepValues"
		},
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		IsThumbToolTipEnabled: {
			type: [Boolean, String],
			default: !0
		},
		ThumbToolTipValueConverter: {
			type: [Function, Object],
			default: null
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		Margin: {
			type: String,
			default: ""
		},
		modelValue: {
			type: Number,
			default: void 0
		},
		min: {
			type: Number,
			default: void 0
		},
		max: {
			type: Number,
			default: void 0
		},
		step: {
			type: Number,
			default: void 0
		},
		vertical: {
			type: Boolean,
			default: !1
		},
		showTicks: {
			type: Boolean,
			default: !1
		},
		tickFrequency: {
			type: Number,
			default: void 0
		}
	},
	emits: [
		"update:Value",
		"ValueChanged",
		"update:modelValue"
	],
	setup(e, { expose: n, emit: r }) {
		let i = e, a = r, d = te(), f = g(), p = o(() => $(i.Header, f)), h = o(() => p.value), _ = o(() => $(i.Value, f)), v = o(() => $(i.Minimum, f)), y = o(() => $(i.Maximum, f));
		o(() => $(i.SmallChange, f));
		let b = o(() => $(i.StepFrequency, f)), ee = o(() => $(i.TickFrequency, f)), T = o(() => $(i.IsEnabled, f) !== !1), E = o(() => $(i.IsThumbToolTipEnabled, f) !== !1), k = o(() => $(i.SnapsTo, f)), M = o(() => $(i.Orientation, f)), N = o(() => $(i.Width, f)), P = o(() => $(i.Height, f)), F = o(() => $(i.TickPlacement, f)), I = o(() => i.showTicks === !0 || F.value && F.value !== "None" && ce.value > 0), L = A(null), R = A(null), z = A(null), ne = A(null), B = A(null), H = A(!1), U = A(!1), W = A(!1), K = A(!1), q = A(!1), J = Ar / 2, ie = (Ar - 1) / 2, Y = (e, t = 0) => {
			let n = Number(e);
			return Number.isFinite(n) ? n : t;
		}, X = o(() => Y(i.min ?? v.value)), Z = o(() => Math.max(X.value, Y(i.max ?? y.value, 100))), ae = o(() => i.modelValue ?? _.value), Q = o(() => Math.max(X.value, Math.min(Z.value, Y(ne.value ?? B.value ?? ae.value)))), oe = o(() => Math.max(0, Y(i.step ?? b.value, 1))), se = o(() => i.vertical ? "Vertical" : M.value), ce = o(() => Math.max(0, Y(i.tickFrequency ?? ee.value))), le = o(() => I.value), ue = o(() => String(F.value || (i.showTicks ? "Outside" : "None")).toLowerCase()), de = o(() => `placement-${ue.value}`), fe = o(() => ue.value === "outside" || ue.value === "topleft"), pe = o(() => ue.value === "outside" || ue.value === "bottomright" || ue.value === "inline" || I.value), he = o(() => Math.max(1e-4, Z.value - X.value)), _e = o(() => Math.max(0, Math.min(100, (Q.value - X.value) / he.value * 100))), ve = o(() => se.value === "Vertical" ? "Left" : "Top"), ye = o(() => {
			let e = oe.value, t = 0, n = e;
			for (; t < 4 && Math.abs(n - Math.round(n)) > 1e-5;) t += 1, n *= 10;
			return t;
		}), be = (e) => {
			let t = i.ThumbToolTipValueConverter;
			if (t) try {
				let n = typeof t == "function" ? t(e) : typeof t.convert == "function" ? t.convert(e) : typeof t.Convert == "function" ? t.Convert(e) : void 0;
				if (n != null) return String(n);
			} catch {}
			return Number(e).toFixed(ye.value);
		}, xe = o(() => be(Le(Q.value))), Se = K, Ce = o(() => T.value && E.value), we = o(() => xe.value), Te = o(() => ve.value), Ee = o(() => R.value), De = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, Oe = (e) => {
			if (!e) return "";
			let t = String(e).split(",").map((e) => De(Number.isNaN(Number(e.trim())) ? e.trim() : Number(e.trim())));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : e;
		}, ke = o(() => [d.style, i.Margin ? { margin: Oe($(i.Margin, f)) } : {}]), Ae = o(() => ({
			width: N.value === "" ? se.value === "Vertical" ? "100px" : "200px" : De(N.value),
			height: P.value === "" ? se.value === "Vertical" ? "100px" : "32px" : De(P.value)
		})), je = (e, t) => {
			if (typeof e == "number") return e;
			if (typeof e == "string") {
				let t = e.trim().match(/^(-?\d+(?:\.\d+)?)(px)?$/);
				if (t) return Number(t[1]);
			}
			return t;
		}, Me = o(() => se.value === "Vertical" ? je(P.value, 100) : je(N.value, 200)), Ne = o(() => se.value === "Vertical" ? { height: `calc(${_e.value}% - ${_e.value * Ar / 100}px)` } : { width: `calc(${_e.value}% - ${_e.value * Ar / 100}px)` }), Pe = o(() => se.value === "Vertical" ? { bottom: `calc(${J}px + ${_e.value}% - ${_e.value * Ar / 100}px)` } : { left: `calc(${J}px + ${_e.value}% - ${_e.value * Ar / 100}px)` }), Fe = o(() => {
			if (!le.value) return [];
			let e = ce.value || oe.value || 1;
			if (!Number.isFinite(e) || e <= 0) return [];
			let t = Math.max(1, (Z.value - X.value) / e), n = Math.max(1, Me.value - Ar), r = Math.max(1, n / t), i = Math.floor(t), a = 1;
			r < jr && (a = Math.ceil(jr / r), r *= a, i = Math.floor(i / a));
			let o = [];
			for (let t = 0; t <= i && o.length < 1e3; t += 1) {
				let n = X.value + t * e * a;
				n <= Z.value + 1e-4 && o.push(n);
			}
			return o;
		}), Ie = (e) => {
			let t = (e - X.value) / he.value * 100, n = 100 - t;
			return se.value === "Vertical" ? { top: `calc(${ie}px + ${n}% - ${n * Ar / 100}px)` } : { left: `calc(${ie}px + ${t}% - ${t * Ar / 100}px)` };
		}, Le = (e) => {
			let t = String(k.value).toLowerCase() === "ticks" && ce.value > 0 ? ce.value : oe.value, n = Math.max(X.value, Math.min(Z.value, e));
			if (!Number.isFinite(t) || t <= 0) return Number(n.toFixed(4));
			let r = X.value + Math.round((n - X.value) / t) * t;
			return Number(Math.max(X.value, Math.min(Z.value, r)).toFixed(4));
		}, Re = (e, { commit: t = !0 } = {}) => {
			let n = Y(B.value ?? ae.value, X.value), r = Number(e), o = Number(Math.max(X.value, Math.min(Z.value, Number.isFinite(r) ? r : X.value)).toFixed(4)), s = Le(o), c = t ? s : o;
			if (ne.value = c, !t) {
				a("update:Value", s), a("update:modelValue", s), me(i.Value, s, f);
				return;
			}
			if (B.value = c, a("update:Value", c), a("update:modelValue", c), me(i.Value, c, f), n !== c) {
				let e = {
					OldValue: n,
					NewValue: c
				};
				a("ValueChanged", e), ge(d.ValueChanged, f)?.(e);
			}
		};
		n({
			Value: o({
				get: () => Le(Q.value),
				set: (e) => Re(e, { commit: !0 })
			}),
			IsDragging: q
		}), O(re, {
			SliderHeader: h,
			IsThumbToolTipOpen: Se,
			IsThumbToolTipActive: Ce,
			ThumbToolTipContent: we,
			ThumbToolTipPlacement: Te,
			ThumbToolTipTarget: Ee
		});
		let ze = (e = !0) => {
			if (!(!T.value || !E.value)) {
				if (e) {
					K.value = !0, x(() => z.value?.updatePosition?.());
					return;
				}
				z.value?.show?.(!1);
			}
		}, Be = () => {
			z.value?.hide?.(!0), K.value = !1;
		}, Ve = () => {
			H.value = !0, !U.value && !W.value && ze(!1);
		}, He = () => {
			H.value = !1, !U.value && !W.value && Be();
		}, Ue = (e) => {
			let t = L.value.getBoundingClientRect(), n = Math.max(1, (se.value === "Vertical" ? t.height : t.width) - Ar), r = e.clientX - Ke, i = e.clientY - Ke, a = se.value === "Vertical" ? (t.bottom - i - J) / n : (r - t.left - J) / n;
			Re(X.value + Math.max(0, Math.min(1, a)) * he.value, { commit: !1 });
		}, We = null, Ge = null, Ke = 0, qe = () => {
			window.addEventListener("pointermove", Xe, {
				capture: !0,
				passive: !1
			}), window.addEventListener("pointerup", Ze, !0), window.addEventListener("pointercancel", Qe, !0);
		}, Je = () => {
			window.removeEventListener("pointermove", Xe, !0), window.removeEventListener("pointerup", Ze, !0), window.removeEventListener("pointercancel", Qe, !0);
		}, Ye = (e = !0) => {
			if (We === null) return;
			e && ne.value !== null && Re(ne.value, { commit: !0 });
			let t = We, n = Ge;
			We = null, Ge = null, Ke = 0, ne.value = null, q.value = !1, U.value = !1, W.value = !1, Je(), n?.hasPointerCapture?.(t) && n.releasePointerCapture(t), Be();
		}, Xe = (e) => {
			e.pointerId === We && (e.preventDefault(), Ue(e));
		}, Ze = (e) => {
			e.pointerId === We && Ye(!0);
		}, Qe = (e) => {
			e.pointerId === We && Ye(!1);
		}, $e = (e, t) => {
			if (!(!T.value || !L.value)) {
				if (We !== null && Ye(!1), e.preventDefault(), e.stopPropagation(), U.value = t, W.value = !t, q.value = !0, We = e.pointerId, Ge = t ? R.value : L.value, t && R.value) {
					let t = R.value.getBoundingClientRect();
					Ke = se.value === "Vertical" ? e.clientY - (t.top + t.height / 2) : e.clientX - (t.left + t.width / 2);
				} else Ke = 0;
				qe();
				try {
					Ge?.setPointerCapture?.(e.pointerId);
				} catch {}
				t || Ue(e), ze(!0);
			}
		}, et = (e) => $e(e, !1), tt = (e) => $e(e, !0);
		return w(() => Ye(!1)), V(ae, (e) => {
			ne.value === null && (B.value = Y(e, B.value ?? X.value));
		}, { immediate: !0 }), V(Q, () => {
			K.value && x(() => z.value?.updatePosition?.());
		}), V([T, E], ([e, t]) => {
			(!e || !t) && Be();
		}), (e, n) => (D(), l("div", {
			class: S(["win-slider-root", { "is-disabled": !T.value }]),
			style: C(ke.value)
		}, [
			p.value ? (D(), s(Rt, {
				key: 0,
				class: "win-slider-header",
				Text: "{x:Bind SliderHeader}"
			})) : c("", !0),
			u("div", {
				ref_key: "trackRef",
				ref: L,
				class: S(["win-slider", {
					vertical: se.value === "Vertical",
					"has-ticks": le.value
				}]),
				style: C(Ae.value),
				onPointerdown: et
			}, [
				u("div", kr, [u("div", {
					class: "win-slider-fill",
					style: C(Ne.value)
				}, null, 4)]),
				le.value ? (D(), l("div", {
					key: 0,
					class: S(["win-slider-ticks", de.value])
				}, [fe.value ? (D(!0), l(t, { key: 0 }, j(Fe.value, (e) => (D(), l("span", {
					key: `top-left-${e}`,
					class: "win-slider-tick top-left",
					style: C(Ie(e))
				}, null, 4))), 128)) : c("", !0), pe.value ? (D(!0), l(t, { key: 1 }, j(Fe.value, (e) => (D(), l("span", {
					key: `bottom-right-${e}`,
					class: "win-slider-tick bottom-right",
					style: C(Ie(e))
				}, null, 4))), 128)) : c("", !0)], 2)) : c("", !0),
				u("div", {
					ref_key: "thumbRef",
					ref: R,
					class: S(["win-slider-thumb", {
						"is-pointer-over": H.value && !W.value,
						"is-pressed": U.value
					}]),
					style: C(Pe.value),
					onPointerdown: G(tt, ["stop"]),
					onPointerenter: Ve,
					onPointerleave: He
				}, null, 38)
			], 38),
			m(Or, {
				ref_key: "thumbToolTipRef",
				ref: z,
				IsServiceHost: "",
				IsOpen: "{x:Bind IsThumbToolTipOpen, Mode=TwoWay}",
				IsEnabled: "{x:Bind IsThumbToolTipActive}",
				Content: "{x:Bind ThumbToolTipContent}",
				Placement: "{x:Bind ThumbToolTipPlacement}",
				PlacementTarget: "{x:Bind ThumbToolTipTarget}",
				Padding: "8,3,8,5",
				FontSize: "15"
			}, null, 512)
		], 6));
	}
}), Nr = [
	"aria-valuemax",
	"aria-valuenow",
	"aria-readonly",
	"aria-disabled",
	"tabindex"
], Pr = { class: "win-rating-caption-stack" }, Fr = {
	class: "win-rating-foreground-presenter",
	"aria-hidden": "true"
}, Ir = { class: "win-rating-foreground-outer" }, Lr = { class: "win-rating-foreground-stack" }, Rr = -1, zr = {
	__name: "Rating",
	props: {
		Value: {
			type: [Number, String],
			default: Rr
		},
		MaxRating: {
			type: [Number, String],
			default: 5
		},
		PlaceholderValue: {
			type: [Number, String],
			default: Rr
		},
		Caption: {
			type: String,
			default: ""
		},
		InitialSetValue: {
			type: [Number, String],
			default: 1
		},
		IsClearEnabled: {
			type: [Boolean, String],
			default: !0
		},
		IsReadOnly: {
			type: [Boolean, String],
			default: !1
		},
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		modelValue: {
			type: Number,
			default: void 0
		},
		max: {
			type: Number,
			default: void 0
		},
		disabled: {
			type: Boolean,
			default: !1
		}
	},
	emits: [
		"update:Value",
		"ValueChanged",
		"update:modelValue"
	],
	setup(e, { emit: n }) {
		let r = e, i = g(), a = te(), d = o(() => $(r.Caption, i)), f = o(() => d.value), p = o(() => $(r.Value, i)), m = o(() => $(r.MaxRating, i)), h = o(() => $(r.PlaceholderValue, i)), _ = o(() => $(r.InitialSetValue, i)), v = o(() => $(r.IsClearEnabled, i) !== !1), y = o(() => $(r.IsReadOnly, i) === !0), b = o(() => $(r.IsEnabled, i) !== !1), x = n, w = A(null), ee = A(!1), T = A(!1), E = A(0), k = A(Rr), M = (e, t = 0) => {
			let n = Number(e);
			return Number.isFinite(n) ? n : t;
		}, N = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, P = (e) => {
			let t = M(e, Rr);
			return t < 0 ? Rr : t <= 1 ? 1 : t > F.value ? F.value : t;
		}, F = o(() => Math.max(1, Math.trunc(M(r.max ?? m.value, 5)))), I = o(() => b.value && !r.disabled), L = o(() => k.value), R = o(() => P(h.value)), z = o(() => {
			let e = String(r.PlaceholderValue ?? "").match(/^\{(?:x:Bind|Binding)\s+([A-Za-z_$][\w$]*)\./);
			return e && $(`{x:Bind ${e[1]}}`, i) || null;
		}), ne = o(() => !!z.value?.IsDragging), B = o(() => Math.max(1, Math.min(F.value, Math.trunc(M(_.value, 1))))), H = o(() => Array.from({ length: F.value }, (e, t) => t + 1));
		V(() => [
			r.modelValue,
			p.value,
			F.value
		], () => {
			k.value = P(r.modelValue ?? p.value);
		}, { immediate: !0 }), V([
			R,
			h,
			ne
		], ([e, t, n]) => {
			!n && e > Rr && e !== t && me(r.PlaceholderValue, e, i);
		}, { immediate: !0 });
		let U = o(() => ee.value && !y.value && I.value ? Math.max(0, Math.min(F.value, E.value)) : L.value > Rr ? L.value : R.value > Rr ? R.value : 0), W = o(() => I.value ? ee.value && !y.value ? L.value > Rr ? "pointer-over-set" : "pointer-over-placeholder" : L.value > Rr ? "set" : R.value > Rr ? "placeholder" : "unset" : "disabled"), G = o(() => ({
			"is-readonly": y.value,
			"is-disabled": !I.value,
			[`state-${W.value}`]: !0
		})), K = o(() => Math.max(0, L.value)), q = o(() => r.Width === "" ? {} : { width: N(r.Width) }), J = (e) => ({ clipPath: `inset(0 ${100 - Math.max(0, Math.min(1, U.value - (e - 1))) * 100}% 0 0)` }), ie = (e) => {
			let t = w.value?.getBoundingClientRect();
			if (!t || t.width <= 0) return 0;
			let n = (e.clientX - t.left) / t.width;
			return Math.max(0, Math.min(F.value, Math.ceil(n * F.value)));
		}, Y = (e) => {
			E.value = ie(e);
		}, X = (e, t = !1) => {
			let n = L.value, r = Math.max(0, Math.min(F.value, e)), o = n;
			if ((n > Rr || r !== 0) && (o = !v.value && r <= 0 ? 1 : r === n && v.value && (r !== F.value || t) ? Rr : r > 0 ? r : Rr), o !== n) {
				k.value = o, x("update:Value", o), x("update:modelValue", o);
				let e = {
					OldValue: n,
					NewValue: o
				};
				x("ValueChanged", e), ge(a.ValueChanged, i)?.(e);
			}
		};
		O(re, { RatingCaption: f });
		let Z = (e, t = !1) => {
			if (e === 0) return;
			let n;
			n = L.value === Rr ? B.value : Math.trunc(L.value) === L.value ? L.value + e : e === -1 ? Math.trunc(L.value) : Math.trunc(L.value) + e, X(n, t);
		}, ae = (e) => {
			!I.value || y.value || (ee.value = !0, Y(e));
		}, Q = (e) => {
			!I.value || y.value || Y(e);
		}, oe = () => {
			T.value || (ee.value = !1);
		}, se = (e) => {
			T.value = !1, w.value?.hasPointerCapture?.(e.pointerId) && w.value.releasePointerCapture(e.pointerId), ee.value = !1;
		}, ce = () => {
			T.value = !1;
		}, le = (e) => {
			!I.value || y.value || (T.value = !0, w.value?.setPointerCapture?.(e.pointerId));
		}, ue = (e) => {
			!I.value || y.value || (X(ie(e), !0), T.value = !1, w.value?.hasPointerCapture?.(e.pointerId) && w.value.releasePointerCapture(e.pointerId), ee.value = w.value?.matches(":hover") ?? !1, ee.value && Y(e));
		}, de = (e) => {
			if (!I.value || y.value) return;
			let t = !0;
			switch (e.key) {
				case "ArrowLeft":
				case "ArrowDown":
					Z(-1);
					break;
				case "ArrowRight":
				case "ArrowUp":
					Z(1);
					break;
				case "Home":
					X(0);
					break;
				case "End":
					X(F.value);
					break;
				default:
					t = !1;
					break;
			}
			t && e.preventDefault();
		};
		return (e, n) => (D(), l("div", {
			class: S(["win-rating-control", G.value]),
			style: C(q.value),
			role: "slider",
			"aria-valuemin": 0,
			"aria-valuemax": F.value,
			"aria-valuenow": K.value,
			"aria-readonly": y.value,
			"aria-disabled": !I.value,
			tabindex: I.value ? 0 : -1,
			onKeydown: de
		}, [u("div", Pr, [u("div", {
			ref_key: "itemsRef",
			ref: w,
			class: "win-rating-background-stack",
			onPointerenter: ae,
			onPointermove: Q,
			onPointerleave: oe,
			onPointercancel: se,
			onLostpointercapture: ce,
			onPointerdown: le,
			onPointerup: ue
		}, [(D(!0), l(t, null, j(H.value, (e) => (D(), l("span", {
			key: `background-${e}`,
			class: "win-rating-item win-rating-background-item",
			"aria-hidden": "true"
		}, [...n[0] ||= [u("span", { class: "win-rating-glyph" }, "", -1)]]))), 128))], 544), d.value ? (D(), s(Rt, {
			key: 0,
			class: "win-rating-caption",
			Text: "{x:Bind RatingCaption}"
		})) : c("", !0)]), u("div", Fr, [u("div", Ir, [u("div", Lr, [(D(!0), l(t, null, j(H.value, (e) => (D(), l("span", {
			key: `foreground-${e}`,
			class: "win-rating-item win-rating-foreground-item",
			style: C(J(e))
		}, [...n[1] ||= [u("span", { class: "win-rating-glyph" }, "", -1)]], 4))), 128))])])])], 46, Nr));
	}
}, Br = [
	"aria-expanded",
	"aria-label",
	"disabled"
], Vr = ["aria-label", "disabled"], Hr = [
	"aria-expanded",
	"aria-label",
	"disabled"
], Ur = [
	"aria-selected",
	"tabindex",
	"onClick"
], Wr = { class: "win-combo-item-layout" }, Gr = {
	key: 0,
	class: "win-combo-item-pill"
}, Kr = { class: "win-combo-item-content" }, qr = 9, Jr = 4, Yr = 36, Xr = {
	__name: "ComboBox",
	props: {
		ItemsSource: {
			type: [Array, String],
			default: () => []
		},
		Header: {
			type: [String, Number],
			default: ""
		},
		PlaceholderText: {
			type: [String, Number],
			default: ""
		},
		IsEditable: {
			type: [Boolean, String],
			default: !1
		},
		IsEnabled: {
			type: [Boolean, String],
			default: !0
		},
		IsDropDownOpen: {
			type: [Boolean, String],
			default: void 0
		},
		SelectedIndex: {
			type: [Number, String],
			default: void 0
		},
		SelectedItem: {
			type: null,
			default: void 0
		},
		SelectedValue: {
			type: null,
			default: void 0
		},
		SelectedValuePath: {
			type: [String, Number],
			default: ""
		},
		DisplayMemberPath: {
			type: [String, Number],
			default: ""
		},
		Text: {
			type: [String, Number],
			default: void 0
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		MaxDropDownHeight: {
			type: [Number, String],
			default: 504
		},
		Theme: {
			type: String,
			default: ""
		}
	},
	emits: [
		"update:IsDropDownOpen",
		"update:SelectedIndex",
		"update:SelectedItem",
		"update:SelectedValue",
		"update:Text",
		"DropDownOpened",
		"DropDownClosed",
		"SelectionChanged",
		"TextSubmitted"
	],
	setup(e, { emit: r }) {
		let i = {
			Top: 4,
			Bottom: 4
		}, { t: a } = rt(), d = e, f = g(), p = ne(), h = o(() => {
			let e = [], t = (e) => {
				if (e == null) return "";
				if (Array.isArray(e)) return e.map(t).join("");
				if (typeof e == "string" || typeof e == "number") return String(e);
				if (typeof e != "object") return "";
				let n = e.children;
				if (typeof n == "string" || typeof n == "number") return String(n);
				if (n && typeof n == "object" && typeof n.default == "function") try {
					return t(n.default());
				} catch {
					return "";
				}
				return t(n);
			}, n = (r) => {
				if (r) {
					if (Array.isArray(r)) {
						r.forEach(n);
						return;
					}
					if (typeof r == "object") {
						let n = r.type, i = typeof n == "string" ? n : n?.name || n?.__name || "";
						if (String(i).toLowerCase() === "x:string") {
							let n = t(r.children).trim();
							n && e.push(n);
						}
					}
				}
			};
			return n(p.default?.()), e;
		}), _ = o(() => {
			let e = $(d.ItemsSource, f);
			return Array.isArray(e) && e.length ? e : h.value;
		}), y = o(() => $(d.Header, f)), b = o(() => $(d.PlaceholderText, f)), T = o(() => $(d.IsEditable, f) === !0), E = o(() => $(d.IsEnabled, f) !== !1), O = o(() => {
			let e = $(d.IsDropDownOpen, f);
			return e === void 0 ? void 0 : e === !0;
		}), k = o(() => {
			let e = $(d.SelectedIndex, f);
			return e === void 0 || e === "" ? void 0 : Number(e);
		}), M = o(() => $(d.SelectedItem, f)), N = o(() => $(d.SelectedValue, f)), P = o(() => $(d.Text, f)), F = o(() => $(d.Width, f)), I = o(() => $(d.MinWidth, f)), R = o(() => $(d.MaxWidth, f)), te = o(() => Number($(d.MaxDropDownHeight, f)) || 504), B = r, U = A(null), W = A(null), re = A(null), K = A(null), q = A(null), J = A(null), ie = A([]), Y = A(-1), X = A(!!O.value), Z = A(!1), ae = A(!1), Q = A(!1), oe = A({ visibility: "hidden" }), se = A("Mouse"), ce = A(-1), le = A(void 0), ue = A(P.value === void 0 ? "" : String(P.value)), de = A(""), fe = v("winuiTheme", null), pe = `win-combo-box-${Math.random().toString(36).slice(2)}`, me = Je(K, {
			Origin: () => T.value ? "edge" : "element",
			OriginElement: () => {
				if (T.value || _.value.length === 0) return null;
				let e = ce.value >= 0 ? ce.value : Math.floor(_.value.length / 2);
				return ie.value[e] ?? null;
			},
			Direction: () => Q.value ? "bottom" : "top",
			StripSize: Yr
		}), he = o(() => me.isPlaying.value), ge = A(""), _e = !1, ve = !1, ye = null, be = null, xe = 0, Se = "Mouse", Ce = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, we = o(() => {
			let e = {};
			return F.value !== "" && (e.width = Ce(F.value)), I.value !== "" && (e.minWidth = Ce(I.value)), R.value !== "" && (e.maxWidth = Ce(R.value)), e;
		}), Te = o(() => {
			let e = d.Theme || fe?.value || de.value;
			return e === "light" || e === "dark" ? `theme-${e}` : "";
		}), Ee = (e, t) => t ? t.split(".").reduce((e, t) => e?.[t], e) : e, De = (e) => {
			let t = $(d.DisplayMemberPath, f), n = t ? Ee(e, t) : e;
			return n == null ? "" : String(typeof n == "object" ? n.label ?? n.Text ?? n.Name ?? n.Content ?? n.Value ?? n.value ?? n : n);
		}, Oe = (e) => {
			let t = $(d.SelectedValuePath, f);
			return t ? Ee(e, t) : e;
		}, ke = (e, t) => e && typeof e == "object" ? e.Key ?? e.Id ?? e.id ?? t : `${String(e)}-${t}`, Ae = (e) => _.value.findIndex((t) => Object.is(t, e)), je = (e) => _.value.findIndex((t) => Object.is(Oe(t), e)), Me = o(() => le.value === void 0 ? b.value || a("text.select") : De(le.value)), Ne = o(() => ue.value || Me.value), Pe = (e, t, n = !0) => {
			ce.value = e, le.value = t, n && (ue.value = t === void 0 ? "" : De(t));
		}, Fe = () => {
			let e, t;
			if (k.value !== void 0) e = k.value >= 0 && k.value < _.value.length ? k.value : -1, t = e >= 0 ? _.value[e] : void 0;
			else if (M.value !== void 0) e = Ae(M.value), t = M.value;
			else if (N.value !== void 0) e = je(N.value), t = e >= 0 ? _.value[e] : void 0;
			else return;
			Pe(e, t, P.value === void 0);
		}, Ie = (e, t, n) => {
			B("update:SelectedIndex", n), B("update:SelectedItem", t), B("update:SelectedValue", t === void 0 ? void 0 : Oe(t)), B("update:Text", ue.value), B("SelectionChanged", {
				AddedItems: t === void 0 ? [] : [t],
				RemovedItems: e === void 0 ? [] : [e]
			});
		}, Le = (e) => {
			let t = e >= 0 && e < _.value.length ? e : -1, n = t >= 0 ? _.value[t] : void 0, r = le.value;
			t === ce.value && Object.is(n, r) || (Pe(t, n), Ie(r, n, t));
		}, Re = () => {
			_e = !0, ve = !1, ge.value = "pressing";
		}, ze = () => {
			_e && Be();
		}, Be = () => {
			ge.value !== "" && (_e = !1, ve && (ge.value = "releasing"));
		}, Ve = Be, He = (e) => {
			ge.value === "pressing" && e.animationName === "chevron-press" ? (ve = !0, _e || (ge.value = "releasing")) : ge.value === "releasing" && e.animationName === "chevron-release" && (ge.value = "", ve = !1);
		}, Ue = () => {
			let e = U.value?.closest(".theme-light, .theme-dark");
			return e?.classList.contains("theme-dark") ? "dark" : e?.classList.contains("theme-light") ? "light" : "";
		}, We = () => {
			be?.disconnect();
			let e = U.value?.closest(".theme-light, .theme-dark");
			de.value = Ue(), e && (be = new MutationObserver(() => {
				de.value = Ue(), Qe();
			}), be.observe(e, {
				attributes: !0,
				attributeFilter: ["class"]
			}));
		}, Ge = (e) => {
			let t = ie.value[e];
			if (!t) return Yr;
			let n = window.getComputedStyle(t);
			return t.getBoundingClientRect().height + Number.parseFloat(n.marginTop || "0") + Number.parseFloat(n.marginBottom || "0");
		}, Ke = (e, t, n, r, i, a, o) => {
			let s = o, c = 0;
			if ((t < e || e < 0) && (e = Math.floor(t / 2)), t === 0) return {
				popupY: n,
				popupMaxHeight: r,
				offset: c
			};
			let l = Ge(e);
			n + r >= a.Height && (n = a.Height - r);
			let u = n + r / 2 - l / 2 - i.Top, d = Math.max(u, 0), f = Math.max(n + r / 2 - s / 2, 0), p = d + l + i.Top + i.Bottom, m = Math.min(p, a.Height), h = Math.min(f + s, a.Height), g = e - 1, _ = e + 1, v = 1, y = Math.min(Jr, t), b = Math.min(qr, t);
			if (p > a.Height && (d = Math.max(d - p + a.Height, 0)), g >= 0) for (l = Ge(g); g >= 0 && d - l >= f && v < y;) d -= l, v++, g--, g >= 0 && (l = Ge(g));
			if (_ < t) for (l = Ge(_); _ < t && m + l < h && m - d < s && v < b;) m += l, v++, _++, _ < t && (l = Ge(_));
			if (g >= 0 || _ < t) {
				let e = g >= 0, n = e ? g : _;
				for (l = Ge(n); m - d + l <= s && (m + l < a.Height || d - l >= 0) && v < b;) e ? g-- : _++, d - l <= 0 ? m += l : d -= l, v++, (g >= 0 || _ < t) && (e = g >= 0, n = e ? g : _, l = Ge(n));
			}
			c = g + 1;
			let x = d;
			return s = m - d, {
				popupY: x,
				popupMaxHeight: s,
				offset: c
			};
		}, qe = (e, t, n, r, i) => {
			if (e === 0) return {
				popupY: t,
				popupMaxHeight: n,
				offset: 0,
				openedUp: !1
			};
			let a = t + n, o = Math.max(a, 0), s = o + r.Top + r.Bottom, c = 0, l = 0, u = Math.min(qr, e);
			for (; c < e && l < u;) s += Ge(c), l++, c++;
			let d = o, f = s - o, p = !1;
			return d + f > i.Height && t - f >= 0 && (d = Math.max(t - f, 0), p = !0), {
				popupY: d,
				popupMaxHeight: f,
				offset: 0,
				openedUp: p
			};
		}, Ye = (e, t, n, r, i, a, o) => {
			let s = o;
			(t < e || e < 0) && (e = Math.floor(t / 2));
			let c = Ge(e), l = Math.min((s - r) / 2, n), u = Math.min(s - l - r, Math.max(0, a.Height - n - c)), d = Math.floor(Math.min(Jr, (t - 1) / 2)), f = Math.floor(Math.min(Jr, (t - 1) / 2)), p = 0, m = 0, h = e - 1 >= 0 ? e - 1 : t - 1;
			h >= 0 && (m = Ge(h));
			let g = Math.max(Math.min(n, a.Height - c), 0);
			for (; c + m <= s && p < d && l - m > 0;) p++, c += m, l -= m, g -= m, h = h - 1 >= 0 ? h - 1 : t - 1, h >= 0 && (m = Ge(h));
			let _ = e - p, v = 0;
			for (m = 0, h = e + 1 < t ? e + 1 : 0, h < t && (m = Ge(h)); c + m <= s && v < f && u - m > 0;) v++, c += m, u -= m, h = h + 1 < t ? h + 1 : 0, h < t && (m = Ge(h));
			for (l >= m / 2 && (c += m / 2, g -= m / 2, _ -= .5), s = Math.min(s, c); _ < 0;) _ += t + 1;
			for (; _ >= t + 1;) _ -= t + 1;
			return {
				popupY: g,
				popupMaxHeight: s,
				offset: _,
				childHeight: i
			};
		}, Xe = (e, t, n, r = i) => e <= 0 ? !1 : e > qr ? !0 : (t = Math.min(t, n.Height), _.value.reduce((e, t, n) => e + Ge(n), r.Top + r.Bottom) > t), Ze = async () => {
			if (!X.value || !W.value || !K.value) return;
			me.cancel(), await x();
			let e = W.value.getBoundingClientRect(), t = {
				Width: window.innerWidth,
				Height: window.innerHeight
			};
			if (t.Width === 0 || t.Height === 0 || e.width === 0 || e.height === 0) return;
			let n = Math.min(te.value, t.Height), r = se.value === "Touch", a = r ? {
				Top: 0,
				Bottom: 0
			} : i, o = Math.max(r ? 240 : 80, e.width);
			ae.value = !1, oe.value = {
				top: "0px",
				left: "0px",
				minWidth: `${o}px`,
				maxWidth: `${t.Width}px`,
				maxHeight: `${n}px`,
				visibility: "hidden"
			}, await x();
			let s = Math.max(e.width, Math.min(K.value.getBoundingClientRect().width, t.Width)), c = window.getComputedStyle(W.value).direction === "rtl" ? e.right - s : e.left, l = Math.round(Math.max(0, Math.min(c, t.Width - s))), u = Xe(_.value.length, n, t, a), d = T.value ? qe(_.value.length, e.top, e.height, a, t) : r && u ? Ye(ce.value, _.value.length, e.top, e.height, K.value.getBoundingClientRect().height, t, n) : Ke(ce.value, _.value.length, e.top, e.height, a, t, n), f = d.popupY, p = Math.max(e.height, Math.min(d.popupMaxHeight, n));
			f + p > t.Height && (f = Math.max(f - (f + p - t.Height), 0));
			let m = Math.round(f);
			if (Q.value = d.openedUp ?? m < e.top, oe.value = {
				top: `${m}px`,
				left: `${l}px`,
				width: `${Math.ceil(s)}px`,
				minWidth: `${o}px`,
				maxWidth: `${t.Width}px`,
				height: `${Math.ceil(p + 2)}px`,
				maxHeight: `${Math.ceil(p + 2)}px`,
				visibility: "visible"
			}, await x(), J.value) {
				let e = Math.floor(d.offset), t = d.offset - e, n = Array.from({ length: e }, (e, t) => Ge(t)).reduce((e, t) => e + t, 0) + (t > 0 ? Ge(e) * t : 0);
				q.value?.ChangeView(null, n, null);
			}
			ae.value = !0, _.value.length > 0 && me.play();
		}, Qe = () => {
			!X.value || xe || (xe = window.requestAnimationFrame(() => {
				xe = 0, Ze();
			}));
		}, $e = (e) => {
			K.value?.contains(e.target) || Qe();
		}, et = async (e) => {
			e === X.value || e && !E.value || (X.value = e, B("update:IsDropDownOpen", e), e ? (me.cancel(), se.value = Se, de.value = Ue(), ae.value = !1, B("DropDownOpened"), await x(), await Ze()) : (me.cancel(), ae.value = !1, B("DropDownClosed")));
		}, tt = () => et(!0), nt = () => et(!1), it = () => et(!X.value), at = () => {
			if (!T.value) {
				W.value?.focus();
				return;
			}
			Z.value ? re.value?.Focus() : W.value?.querySelector(".win-combo-edit-display")?.focus();
		}, ot = (e = !1) => {
			re.value?.Focus(), e && re.value?.SelectAll();
		}, st = () => {
			E.value && (Z.value = !0, x(() => ot(!0)));
		}, ct = (e = !1) => {
			Z.value && (Z.value = !1, e && x(at));
		}, lt = () => {
			if (X.value) {
				nt(), ct(!0);
				return;
			}
			st(), tt();
		}, ut = (e) => {
			Le(e), Z.value = !1, nt(), x(at);
		}, dt = (e) => {
			let t = e.clientX, n = e.clientY;
			for (let e = 0; e < ie.value.length; e += 1) {
				let r = ie.value[e];
				if (!r) continue;
				let i = r.getBoundingClientRect();
				if (t >= i.left && t <= i.right && n >= i.top && n <= i.bottom) return e;
			}
			return -1;
		}, ft = (e) => {
			Y.value = dt(e);
		}, pt = (e) => {
			if (e.target instanceof Element && e.target.closest(".win-combo-item")) return;
			let t = dt(e);
			t >= 0 && ut(t);
		}, mt = (e) => {
			ue.value = e, B("update:Text", ue.value);
		}, ht = () => {
			x(() => {
				let e = document.activeElement;
				W.value?.contains(e) || K.value?.contains(e) || ct();
			});
		}, gt = {};
		Object.defineProperties(gt, {
			Text: {
				get: () => ue.value,
				set: (e) => {
					ue.value = e == null ? "" : String(e), B("update:Text", ue.value);
				}
			},
			SelectedIndex: {
				get: () => ce.value,
				set: (e) => Le(Number(e))
			},
			SelectedItem: {
				get: () => le.value,
				set: (e) => {
					let t = le.value, n = Ae(e);
					n === ce.value && Object.is(e, t) || (Pe(n, e), Ie(t, e, n));
				}
			},
			SelectedValue: { get: () => le.value === void 0 ? void 0 : Oe(le.value) }
		});
		let _t = () => {
			let e = { Handled: !1 };
			if (B("TextSubmitted", gt, e), !e.Handled) {
				let e = _.value.findIndex((e) => De(e) === ue.value);
				e >= 0 && Le(e);
			}
			nt(), ct(!0);
		}, vt = (e) => {
			_.value.length !== 0 && Le(Math.min(_.value.length - 1, Math.max(0, ce.value < 0 ? e > 0 ? 0 : _.value.length - 1 : ce.value + e)));
		}, yt = (e) => {
			if (_.value.length === 0) return;
			let t = Math.min(_.value.length - 1, Math.max(0, e));
			ie.value[t]?.focus(), ie.value[t]?.scrollIntoView({ block: "nearest" });
		}, bt = (e) => {
			e.key === "ArrowDown" && !e.altKey && !X.value ? (e.preventDefault(), vt(1)) : e.key === "ArrowUp" && !X.value ? (e.preventDefault(), vt(-1)) : (e.key === "ArrowDown" || e.key === "F4" || e.key === "Enter" || e.key === " ") && (e.preventDefault(), tt(), x(() => yt(ce.value < 0 ? 0 : ce.value)));
		}, xt = (e) => {
			e.key === "Enter" || e.key === "F2" || e.key === " " ? (e.preventDefault(), st()) : e.key === "F4" || e.altKey && e.key === "ArrowDown" ? (e.preventDefault(), tt(), x(() => yt(ce.value < 0 ? 0 : ce.value))) : e.key === "ArrowDown" ? (e.preventDefault(), vt(1)) : e.key === "ArrowUp" && (e.preventDefault(), vt(-1));
		}, St = (e) => {
			e.key === "Enter" ? (e.preventDefault(), _t()) : e.key === "Escape" && X.value ? (e.preventDefault(), nt()) : e.key === "Escape" ? (e.preventDefault(), ct(!0)) : e.key === "ArrowDown" && !X.value && (e.preventDefault(), tt());
		}, Ct = (e) => {
			let t = ie.value.indexOf(document.activeElement);
			e.key === "Escape" ? (e.preventDefault(), nt(), x(at)) : e.key === "ArrowDown" ? (e.preventDefault(), yt(t < 0 ? 0 : t + 1)) : e.key === "ArrowUp" ? (e.preventDefault(), yt(t < 0 ? _.value.length - 1 : t - 1)) : e.key === "Home" ? (e.preventDefault(), yt(0)) : e.key === "End" && (e.preventDefault(), yt(_.value.length - 1));
		}, wt = (e, t) => {
			ie.value[t] = e;
		}, Tt = (e) => {
			Se = e.pointerType === "touch" ? "Touch" : "Mouse";
		}, Et = (e) => {
			Se = "Keyboard", e.key === "Escape" && X.value && (e.preventDefault(), nt(), T.value && ct(!0));
		}, Dt = (e) => {
			let t = U.value?.contains(e.target), n = K.value?.contains(e.target);
			Z.value && !t && !n && ct(), !(!X.value || t || n) && nt();
		};
		return V(() => [
			_.value,
			k.value,
			M.value,
			N.value
		], () => {
			Fe(), X.value && x(Qe);
		}, { immediate: !0 }), V(P, (e) => {
			e !== void 0 && (ue.value = String(e));
		}), V(O, (e) => {
			e !== void 0 && et(e);
		}), V(E, (e) => {
			e || (ct(), nt());
		}), V(T, (e) => {
			e || ct();
		}), ee(() => {
			ye = new ResizeObserver(Qe), W.value && ye.observe(W.value), We(), window.addEventListener("resize", Qe), window.addEventListener("scroll", $e, !0), document.addEventListener("pointerdown", Dt);
		}), w(() => {
			ye?.disconnect(), be?.disconnect(), me.cancel(), window.removeEventListener("resize", Qe), window.removeEventListener("scroll", $e, !0), document.removeEventListener("pointerdown", Dt), xe && window.cancelAnimationFrame(xe);
		}), (e, r) => (D(), l("div", {
			ref_key: "comboRef",
			ref: U,
			class: S(["win-combo-box", {
				"is-disabled": !E.value,
				"is-drop-down-open": X.value,
				"is-editable": T.value
			}]),
			style: C(we.value),
			onKeydownCapture: Et,
			onPointerdownCapture: Tt
		}, [
			y.value ? (D(), s(Rt, {
				key: 0,
				class: "win-combo-header",
				Text: y.value
			}, null, 8, ["Text"])) : c("", !0),
			T.value ? (D(), l("div", {
				key: 1,
				ref_key: "backgroundRef",
				ref: W,
				class: "win-combo-editable"
			}, [
				Z.value ? (D(), s(Gt, {
					key: 1,
					ref_key: "inputRef",
					ref: re,
					class: "win-combo-textbox",
					role: "combobox",
					"aria-controls": pe,
					"aria-expanded": X.value,
					"aria-label": y.value || b.value,
					IsEnabled: E.value,
					PlaceholderText: b.value,
					ShowDeleteButton: !1,
					Text: ue.value,
					onLostFocus: ht,
					"onUpdate:Text": mt,
					onKeydown: St
				}, null, 8, [
					"aria-expanded",
					"aria-label",
					"IsEnabled",
					"PlaceholderText",
					"Text"
				])) : (D(), l("button", {
					key: 0,
					class: "win-btn DefaultButtonStyle win-combo-btn win-combo-edit-display",
					type: "button",
					role: "combobox",
					"aria-controls": pe,
					"aria-expanded": X.value,
					"aria-label": y.value || b.value,
					disabled: !E.value,
					onClick: st,
					onKeydown: xt
				}, [u("span", { class: S(["win-combo-content", { "is-placeholder": !ue.value && le.value === void 0 }]) }, L(Ne.value), 3)], 40, Br)),
				u("button", {
					class: "win-combo-drop-down-button",
					type: "button",
					tabindex: "-1",
					"aria-label": z(a)("text.select"),
					disabled: !E.value,
					onClick: lt,
					onPointerdown: G(Re, ["prevent"]),
					onPointerup: ze,
					onPointercancel: r[0] ||= (...e) => z(Ve) && z(Ve)(...e),
					onPointerleave: r[1] ||= (...e) => z(Ve) && z(Ve)(...e)
				}, null, 40, Vr),
				u("span", {
					class: S(["icon chevron chevron-animate win-combo-chevron", ge.value]),
					"aria-hidden": "true",
					onAnimationend: He
				}, null, 34)
			], 512)) : (D(), l("button", {
				key: 2,
				ref_key: "backgroundRef",
				ref: W,
				class: "win-btn DefaultButtonStyle win-combo-btn",
				type: "button",
				role: "combobox",
				"aria-controls": pe,
				"aria-expanded": X.value,
				"aria-label": y.value || b.value,
				disabled: !E.value,
				onClick: it,
				onKeydown: bt,
				onPointerdown: Re,
				onPointerup: ze,
				onPointercancel: r[2] ||= (...e) => z(Ve) && z(Ve)(...e),
				onPointerleave: r[3] ||= (...e) => z(Ve) && z(Ve)(...e)
			}, [u("span", { class: S(["win-combo-content", { "is-placeholder": ce.value < 0 && le.value === void 0 }]) }, L(Me.value), 3), u("span", {
				class: S(["icon chevron chevron-animate win-combo-chevron", ge.value]),
				"aria-hidden": "true",
				onAnimationend: He
			}, null, 34)], 40, Hr)),
			(D(), s(n, { to: "body" }, [
				X.value ? (D(), l("div", {
					key: 0,
					class: "win-combo-overlay",
					onContextmenu: G(nt, ["prevent"]),
					onPointerdown: nt
				}, null, 32)) : c("", !0),
				X.value ? (D(), l("div", {
					key: 1,
					id: pe,
					ref_key: "flyoutRef",
					ref: K,
					class: S(["win-combo-flyout win-theme-scope", [Te.value, {
						"is-positioned": ae.value,
						"opens-up": Q.value,
						"touch-input": se.value === "Touch",
						"edge-square-top": T.value && !Q.value,
						"edge-square-bottom": T.value && Q.value
					}]]),
					style: C(oe.value),
					role: "listbox",
					onKeydown: Ct,
					onPointerdown: r[4] ||= G(() => {}, ["stop"])
				}, [u("div", {
					class: "win-combo-flyout-hit-root",
					onPointermove: ft,
					onClick: pt
				}, [m(Ft, {
					ref_key: "scrollViewerRef",
					ref: q,
					class: "win-combo-scroll-viewer",
					HorizontalScrollMode: "Disabled",
					HorizontalScrollBarVisibility: "Disabled",
					VerticalScrollMode: "Auto",
					VerticalScrollBarVisibility: "Auto",
					IsVerticalScrollChainingEnabled: !1,
					IsTabStop: !1
				}, {
					default: H(() => [u("div", {
						ref_key: "itemsPresenterRef",
						ref: J,
						class: "win-combo-items-presenter"
					}, [(D(!0), l(t, null, j(_.value, (e, t) => (D(), l("button", {
						key: ke(e, t),
						ref_for: !0,
						ref: (e) => wt(e, t),
						class: S(["win-combo-item", {
							selected: ce.value === t,
							hovered: Y.value === t
						}]),
						type: "button",
						role: "option",
						"aria-selected": ce.value === t,
						tabindex: ce.value === t ? 0 : -1,
						onClick: (e) => ut(t)
					}, [u("span", Wr, [ce.value === t ? (D(), l("span", Gr)) : c("", !0), u("span", Kr, L(De(e)), 1)])], 10, Ur))), 128))], 512)]),
					_: 1
				}, 512)], 32)], 38)) : c("", !0),
				X.value && he.value ? (D(), l("div", {
					key: 2,
					class: "win-combo-flyout-hit-overlay",
					style: C(oe.value),
					onPointerdown: r[5] ||= G(() => {}, ["stop"]),
					onPointermove: ft,
					onClick: pt
				}, null, 36)) : c("", !0)
			]))
		], 38));
	}
}, Zr = { class: "cp-spectrum-grid" }, Qr = {
	key: 0,
	class: "cp-preview-bar"
}, $r = {
	key: 0,
	class: "cp-sliders"
}, ei = {
	key: 1,
	class: "cp-more-row"
}, ti = { class: "icon" }, ni = {
	key: 2,
	class: "cp-details-grid"
}, ri = 256, ii = {
	__name: "ColorPicker",
	props: {
		Color: {
			type: [String, Object],
			default: void 0
		},
		ColorSpectrumShape: {
			type: [String, Number],
			default: void 0
		},
		IsMoreButtonVisible: {
			type: [Boolean, String],
			default: !1
		},
		IsColorPreviewVisible: {
			type: [Boolean, String],
			default: void 0
		},
		IsColorSliderVisible: {
			type: [Boolean, String],
			default: void 0
		},
		IsColorChannelTextInputVisible: {
			type: [Boolean, String],
			default: void 0
		},
		IsHexInputVisible: {
			type: [Boolean, String],
			default: void 0
		},
		IsAlphaEnabled: {
			type: [Boolean, String],
			default: void 0
		},
		IsAlphaSliderVisible: {
			type: [Boolean, String],
			default: void 0
		},
		IsAlphaTextInputVisible: {
			type: [Boolean, String],
			default: void 0
		},
		modelValue: {
			type: String,
			default: "#0067C0"
		},
		isColorPreviewVisible: {
			type: Boolean,
			default: !0
		},
		isColorSliderVisible: {
			type: Boolean,
			default: !0
		},
		isColorChannelTextInputVisible: {
			type: Boolean,
			default: !0
		},
		isHexInputVisible: {
			type: Boolean,
			default: !0
		},
		isAlphaEnabled: {
			type: Boolean,
			default: !1
		},
		isAlphaSliderVisible: {
			type: Boolean,
			default: !0
		},
		previousColor: {
			type: String,
			default: null
		},
		colorSpectrumShape: {
			type: String,
			default: "Box"
		}
	},
	emits: [
		"update:modelValue",
		"update:Color",
		"ColorChanged"
	],
	setup(e, { emit: n }) {
		let { t: r } = rt(), i = g(), a = te(), d = e, f = n, p = A(null), h = A(null), _ = A(null), v = A(null), y = A(null), b = k({
			h: 0,
			s: 1,
			v: 1
		}), w = A(1), T = A(!1), E = A(""), O = A(0), j = o(() => String($(d.Color, i) ?? d.modelValue ?? "#0067C0")), M = A(j.value), N = !1, P = !1, F = !1, I = A(!1), R = (e, t) => {
			let n = $(e, i);
			return n === void 0 ? t : n === !0;
		}, ne = o(() => R(d.IsMoreButtonVisible, !1)), B = o(() => String($(d.ColorSpectrumShape, i) ?? d.colorSpectrumShape)), U = o(() => R(d.IsColorPreviewVisible, d.isColorPreviewVisible)), W = o(() => R(d.IsColorSliderVisible, d.isColorSliderVisible)), G = o(() => R(d.IsColorChannelTextInputVisible, d.isColorChannelTextInputVisible)), re = o(() => R(d.IsHexInputVisible, d.isHexInputVisible)), K = o(() => R(d.IsAlphaEnabled, d.isAlphaEnabled)), q = o(() => R(d.IsAlphaSliderVisible, d.isAlphaSliderVisible)), J = o(() => R(d.IsAlphaTextInputVisible, d.isAlphaTextInputVisible)), ie = o(() => !ne.value || T.value), Y = o(() => ["RGB", "HSV"]), X = o(() => O.value === 1 ? "HSV" : "RGB"), Z = o(() => B.value === "Ring"), ae = o(() => T.value ? "" : ""), Q = o(() => {
			let { r: e, g: t, b: n } = _e(b.h, b.s, b.v);
			return {
				r: e,
				g: t,
				b: n
			};
		}), oe = o(() => {
			let { r: e, g: t, b: n } = Q.value, r = "#" + [
				e,
				t,
				n
			].map((e) => e.toString(16).padStart(2, "0")).join("");
			return K.value && w.value < 1 ? r + Math.round(w.value * 255).toString(16).padStart(2, "0") : r;
		}), se = o(() => oe.value.toUpperCase()), ce = o(() => se.value), le = o(() => Math.round(w.value * 100)), ue = o(() => Math.round(b.h) % 360), de = o(() => Math.round(b.s * 100)), fe = o(() => Math.round(b.v * 100)), pe = o(() => `linear-gradient(to right, rgb(0,0,0), ${ve(b.h, b.s, 1)})`), he = o(() => {
			b.v > .6 && b.s;
			let e = b.v > .5 && b.s < .5 ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)";
			if (Z.value) {
				let t = ri / 2, n = ri / 2, r = ri / 2 - 2, i = (b.h - 90) * Math.PI / 180, a = b.s * r, o = t + Math.cos(i) * a, s = n + Math.sin(i) * a;
				return {
					left: o + "px",
					top: s + "px",
					"--spectrum-thumb-color": e
				};
			}
			let t = b.h / 360 * ri, n = (1 - b.s) * ri;
			return {
				left: t + "px",
				top: n + "px",
				"--spectrum-thumb-color": e
			};
		});
		function _e(e, t, n) {
			let r, i, a, o = Math.floor(e / 60) % 6, s = e / 60 - Math.floor(e / 60), c = n * (1 - t), l = n * (1 - s * t), u = n * (1 - (1 - s) * t);
			switch (o) {
				case 0:
					r = n, i = u, a = c;
					break;
				case 1:
					r = l, i = n, a = c;
					break;
				case 2:
					r = c, i = n, a = u;
					break;
				case 3:
					r = c, i = l, a = n;
					break;
				case 4:
					r = u, i = c, a = n;
					break;
				case 5:
					r = n, i = c, a = l;
					break;
			}
			return {
				r: Math.round(r * 255),
				g: Math.round(i * 255),
				b: Math.round(a * 255)
			};
		}
		function ve(e, t, n) {
			let { r, g: i, b: a } = _e(e, t, n);
			return `rgb(${r},${i},${a})`;
		}
		function ye(e, t, n) {
			e /= 255, t /= 255, n /= 255;
			let r = Math.max(e, t, n), i = r - Math.min(e, t, n), a = 0, o = r === 0 ? 0 : i / r, s = r;
			if (i !== 0) switch (r) {
				case e:
					a = ((t - n) / i + (t < n ? 6 : 0)) * 60;
					break;
				case t:
					a = ((n - e) / i + 2) * 60;
					break;
				case n:
					a = ((e - t) / i + 4) * 60;
					break;
			}
			return {
				h: a,
				s: o,
				v: s
			};
		}
		function be(e) {
			let t = String(e ?? "#0067C0").replace("#", "");
			t.length === 3 && (t = t.split("").map((e) => e + e).join(""));
			let n = parseInt(t.slice(0, 2), 16) || 0, r = parseInt(t.slice(2, 4), 16) || 0, i = parseInt(t.slice(4, 6), 16) || 0, a = 1;
			return t.length === 8 && (a = (parseInt(t.slice(6, 8), 16) || 0) / 255), {
				r: n,
				g: r,
				b: i,
				a
			};
		}
		function xe() {
			let e = p.value;
			if (!e) return;
			let t = e.getContext("2d"), n = ri, r = ri;
			t.clearRect(0, 0, n, r), Z.value ? Ce(t, n, r) : Se(t, n, r);
		}
		function Se(e, t, n) {
			let r = e.createImageData(t, n), i = r.data;
			for (let e = 0; e < n; e++) {
				let r = 1 - e / (n - 1);
				for (let n = 0; n < t; n++) {
					let { r: a, g: o, b: s } = _e(n / (t - 1) * 360, r, b.v), c = (e * t + n) * 4;
					i[c] = a, i[c + 1] = o, i[c + 2] = s, i[c + 3] = 255;
				}
			}
			e.putImageData(r, 0, 0);
		}
		function Ce(e, t, n) {
			let r = t / 2, i = n / 2, a = t / 2 - 1, o = e.createImageData(t, n), s = o.data;
			for (let e = 0; e < n; e++) for (let n = 0; n < t; n++) {
				let o = n - r, c = e - i, l = Math.sqrt(o * o + c * c), u = (e * t + n) * 4;
				if (l <= a) {
					let e = Math.atan2(c, o) * 180 / Math.PI + 90;
					e < 0 && (e += 360);
					let t = Math.min(1, l / a), { r: n, g: r, b: i } = _e(e % 360, t, b.v);
					s[u] = n, s[u + 1] = r, s[u + 2] = i, s[u + 3] = 255;
				} else s[u + 3] = 0;
			}
			e.putImageData(o, 0, 0);
		}
		function we() {
			let e = {
				OldColor: M.value,
				NewColor: oe.value
			};
			f("update:modelValue", oe.value), f("update:Color", oe.value), me(d.Color, oe.value, i), f("ColorChanged", e), ge(a.ColorChanged, i)?.(e), M.value = oe.value;
		}
		V(se, (e) => {
			E.value = e;
		}, { immediate: !0 });
		function Te(e) {
			N = !0, e.currentTarget.focus?.({ preventScroll: !0 }), e.currentTarget.setPointerCapture(e.pointerId), je(e), I.value = !0;
		}
		function Ee(e) {
			N && je(e);
		}
		function De(e) {
			N = !1, e.currentTarget.hasPointerCapture?.(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId);
		}
		function Oe(e) {
			N = !1, e.currentTarget.hasPointerCapture?.(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId);
		}
		function ke() {
			I.value = !0;
		}
		function Ae() {
			N = !1, I.value = !1;
		}
		function je(e) {
			let t = p.value.getBoundingClientRect(), n = e.clientX - t.left, r = e.clientY - t.top;
			if (Z.value) {
				let e = ri / 2, t = ri / 2, i = ri / 2 - 2, a = n - e, o = r - t, s = Math.atan2(o, a) * 180 / Math.PI + 90;
				s < 0 && (s += 360);
				let c = Math.min(i, Math.sqrt(a * a + o * o));
				b.h = s % 360, b.s = c / i;
			} else {
				let e = Math.max(0, Math.min(ri - 1, n)), t = Math.max(0, Math.min(ri - 1, r));
				b.h = e / (ri - 1) * 360, b.s = 1 - t / (ri - 1);
			}
			we();
		}
		function Me(e) {
			P = !0, e.currentTarget.setPointerCapture(e.pointerId), Ne(e);
			let t = e.currentTarget;
			t.onpointermove = (e) => {
				P && Ne(e);
			}, t.onpointerup = () => {
				P = !1, t.onpointermove = null;
			};
		}
		function Ne(e) {
			let t = v.value.getBoundingClientRect();
			b.v = Math.max(0, Math.min(t.width, e.clientX - t.left)) / t.width, xe(), we();
		}
		function Pe(e) {
			F = !0, e.currentTarget.setPointerCapture(e.pointerId), Fe(e);
			let t = e.currentTarget;
			t.onpointermove = (e) => {
				F && Fe(e);
			}, t.onpointerup = () => {
				F = !1, t.onpointermove = null;
			};
		}
		function Fe(e) {
			let t = y.value.getBoundingClientRect();
			w.value = Math.max(0, Math.min(t.width, e.clientX - t.left)) / t.width, we();
		}
		function Ie(e, t) {
			let n = parseInt(t) || 0;
			n = Math.max(0, Math.min(255, n));
			let r = ye(e === "r" ? n : Q.value.r, e === "g" ? n : Q.value.g, e === "b" ? n : Q.value.b);
			b.h = r.h, b.s = r.s, b.v = r.v, xe(), we();
		}
		function Le(e, t) {
			Ie(e, t);
		}
		function Re(e, t) {
			let n = Number(t) || 0;
			e === "h" && (b.h = Math.max(0, Math.min(359, n))), e === "s" && (b.s = Math.max(0, Math.min(100, n)) / 100), e === "v" && (b.v = Math.max(0, Math.min(100, n)) / 100), xe(), we();
		}
		function ze(e) {
			O.value = e ?? 0;
		}
		function Be(e) {
			w.value = Math.max(0, Math.min(100, Number(e) || 0)) / 100, we();
		}
		function Ve(e) {
			E.value = e, e.replace("#", "").trim().length >= 6 && He(e);
		}
		function He(e) {
			let t = String(e).replace("#", "").trim();
			if (t.length >= 6) {
				let { r: e, g: n, b: r, a: i } = be(t), a = ye(e, n, r);
				b.h = a.h, b.s = a.s, b.v = a.v, K.value && (w.value = i), xe(), we();
			}
		}
		function Ue(e) {
			let { r: t, g: n, b: r, a: i } = be(e), a = ye(t, n, r);
			b.h = a.h, b.s = a.s, b.v = a.v, K.value && (w.value = i), x(() => xe());
		}
		return V(j, (e) => {
			e && e.toLowerCase() !== oe.value.toLowerCase() && (Ue(e), M.value = e);
		}), V(B, () => {
			x(() => xe());
		}), V(() => b.v, () => {}), V([ce, he], () => {
			I.value && x(() => _.value?.updatePosition?.());
		}, { deep: !0 }), ee(() => {
			Ue(j.value), M.value = j.value;
		}), (n, i) => (D(), l("div", { class: S(["win-color-picker", {
			"cp-has-preview": U.value,
			"cp-no-preview": !U.value
		}]) }, [
			u("div", Zr, [u("div", { class: S(["cp-spectrum-area", { "cp-ring": Z.value }]) }, [u("canvas", {
				ref_key: "spectrumCanvas",
				ref: p,
				class: "cp-spectrum",
				width: ri,
				height: ri,
				tabindex: "0",
				onPointerdown: Te,
				onPointermove: Ee,
				onPointerup: De,
				onPointercancel: Oe,
				onFocus: ke,
				onBlur: Ae
			}, null, 544), u("div", {
				ref_key: "spectrumThumbRef",
				ref: h,
				class: "cp-spectrum-thumb",
				style: C(he.value)
			}, null, 4)], 2), U.value ? (D(), l("div", Qr, [u("div", {
				class: "cp-preview-current",
				style: C({ background: oe.value })
			}, null, 4), e.previousColor ? (D(), l("div", {
				key: 0,
				class: "cp-preview-previous",
				style: C({ background: e.previousColor })
			}, null, 4)) : c("", !0)])) : c("", !0)]),
			W.value ? (D(), l("div", $r, [u("div", {
				class: "cp-slider-row",
				onPointerdown: Me
			}, [u("div", {
				class: "cp-value-track",
				ref_key: "valueTrack",
				ref: v,
				style: C({ background: pe.value })
			}, [u("div", {
				class: "cp-slider-thumb",
				style: C({ left: b.v * 100 + "%" })
			}, null, 4)], 4)], 32), K.value && q.value ? (D(), l("div", {
				key: 0,
				class: "cp-slider-row",
				onPointerdown: Pe
			}, [u("div", {
				class: "cp-alpha-track",
				ref_key: "alphaTrack",
				ref: y,
				style: C({ "--alpha-color": ve(b.h, b.s, 1) })
			}, [u("div", {
				class: "cp-slider-thumb",
				style: C({ left: w.value * 100 + "%" })
			}, null, 4)], 4)], 32)) : c("", !0)])) : c("", !0),
			ne.value ? (D(), l("div", ei, [m(Kn, {
				class: "cp-more-button",
				Style: "SubtleButtonStyle",
				onClick: i[0] ||= (e) => T.value = !T.value
			}, {
				default: H(() => [m(Rt, {
					class: "cp-more-label",
					Text: z(r)("text.more")
				}, null, 8, ["Text"]), u("span", ti, L(ae.value), 1)]),
				_: 1
			})])) : c("", !0),
			ie.value ? (D(), l("div", ni, [
				m(Xr, {
					Width: "120",
					ItemsSource: Y.value,
					SelectedIndex: O.value,
					"onUpdate:SelectedIndex": ze
				}, null, 8, ["ItemsSource", "SelectedIndex"]),
				re.value ? (D(), s(Gt, {
					key: 0,
					class: "cp-hex-box",
					Text: E.value,
					MaxWidth: 132,
					MaxLength: K.value ? 9 : 7,
					"onUpdate:Text": Ve
				}, null, 8, ["Text", "MaxLength"])) : c("", !0),
				G.value && X.value === "RGB" ? (D(), l(t, { key: 1 }, [
					m(Hn, {
						Width: "120",
						Value: Q.value.r,
						Minimum: 0,
						Maximum: 255,
						"onUpdate:Value": i[1] ||= (e) => Le("r", e)
					}, null, 8, ["Value"]),
					m(Rt, { Text: z(r)("text.red") }, null, 8, ["Text"]),
					m(Hn, {
						Width: "120",
						Value: Q.value.g,
						Minimum: 0,
						Maximum: 255,
						"onUpdate:Value": i[2] ||= (e) => Le("g", e)
					}, null, 8, ["Value"]),
					m(Rt, { Text: z(r)("text.green") }, null, 8, ["Text"]),
					m(Hn, {
						Width: "120",
						Value: Q.value.b,
						Minimum: 0,
						Maximum: 255,
						"onUpdate:Value": i[3] ||= (e) => Le("b", e)
					}, null, 8, ["Value"]),
					m(Rt, { Text: z(r)("text.blue") }, null, 8, ["Text"])
				], 64)) : c("", !0),
				G.value && X.value === "HSV" ? (D(), l(t, { key: 2 }, [
					m(Hn, {
						Width: "120",
						Value: ue.value,
						Minimum: 0,
						Maximum: 359,
						"onUpdate:Value": i[4] ||= (e) => Re("h", e)
					}, null, 8, ["Value"]),
					m(Rt, { Text: z(r)("text.hue") }, null, 8, ["Text"]),
					m(Hn, {
						Width: "120",
						Value: de.value,
						Minimum: 0,
						Maximum: 100,
						"onUpdate:Value": i[5] ||= (e) => Re("s", e)
					}, null, 8, ["Value"]),
					m(Rt, { Text: z(r)("text.saturation") }, null, 8, ["Text"]),
					m(Hn, {
						Width: "120",
						Value: fe.value,
						Minimum: 0,
						Maximum: 100,
						"onUpdate:Value": i[6] ||= (e) => Re("v", e)
					}, null, 8, ["Value"]),
					m(Rt, { Text: z(r)("text.value") }, null, 8, ["Text"])
				], 64)) : c("", !0),
				K.value && J.value ? (D(), l(t, { key: 3 }, [m(Hn, {
					Width: "120",
					Value: le.value,
					Minimum: 0,
					Maximum: 100,
					"onUpdate:Value": Be
				}, null, 8, ["Value"]), m(Rt, { Text: z(r)("sample.opacity") }, null, 8, ["Text"])], 64)) : c("", !0)
			])) : c("", !0),
			m(Or, {
				ref_key: "spectrumToolTipRef",
				ref: _,
				IsServiceHost: "",
				IsOpen: I.value,
				Content: ce.value,
				Placement: "Top",
				PlacementTarget: h.value
			}, null, 8, [
				"IsOpen",
				"Content",
				"PlacementTarget"
			])
		], 2));
	}
}, ai = { class: "win-list-box-items" }, oi = ["onClick"], si = {
	__name: "ListBox",
	props: {
		ItemsSource: {
			type: Array,
			default: null
		},
		SelectedIndex: {
			type: Number,
			default: void 0
		},
		SelectedItem: {
			type: [
				Object,
				String,
				Number,
				Boolean
			],
			default: void 0
		},
		SelectedItems: {
			type: Array,
			default: null
		},
		SelectionMode: {
			type: String,
			default: void 0
		},
		items: {
			type: Array,
			default: () => []
		},
		selectedIndex: {
			type: Number,
			default: -1
		},
		selectionMode: {
			type: String,
			default: "Single"
		}
	},
	emits: [
		"update:SelectedIndex",
		"update:SelectedItem",
		"update:SelectedItems",
		"SelectionChanged",
		"update:selectedIndex",
		"selectionChanged"
	],
	setup(e, { emit: n }) {
		let r = e, i = n, a = A([]), c = o(() => r.ItemsSource ?? r.items), d = o(() => r.SelectionMode ?? r.selectionMode), f = o(() => r.SelectedIndex ?? r.selectedIndex), p = o(() => r.SelectedItems ?? a.value), h = (e, t) => R(e) === R(t), g = (e, t) => d.value === "Multiple" || d.value === "Extended" ? p.value.some((t) => h(t, e)) : f.value === t || h(r.SelectedItem, e), _ = (e) => {
			let t = c.value[e];
			if (d.value !== "None") {
				if (d.value === "Multiple" || d.value === "Extended") {
					let e = [...p.value], n = e.findIndex((e) => h(e, t));
					n >= 0 ? e.splice(n, 1) : e.push(t), a.value = e, i("update:SelectedItems", e), i("SelectionChanged", {
						AddedItems: n >= 0 ? [] : [t],
						RemovedItems: n >= 0 ? [t] : [],
						SelectedItems: e
					}), i("selectionChanged", e);
					return;
				}
				i("update:SelectedIndex", e), i("update:SelectedItem", t), i("update:selectedIndex", e), i("SelectionChanged", {
					AddedItems: [t],
					RemovedItems: [],
					SelectedIndex: e,
					SelectedItem: t
				}), i("selectionChanged", e);
			}
		};
		return (e, n) => (D(), s(Ft, {
			class: "win-list-box",
			VerticalScrollMode: "Auto",
			VerticalScrollBarVisibility: "Auto",
			HorizontalScrollMode: "Disabled",
			HorizontalScrollBarVisibility: "Disabled"
		}, {
			default: H(() => [u("div", ai, [(D(!0), l(t, null, j(c.value, (t, n) => (D(), l("div", {
				key: n,
				class: S(["win-list-box-item", { selected: g(t, n) }]),
				onClick: (e) => _(n)
			}, [M(e.$slots, "item", { item: t }, () => [m(Rt, { Text: String(t) }, null, 8, ["Text"])])], 10, oi))), 128))])]),
			_: 3
		}));
	}
}, ci = ["aria-label"], li = ["onClick"], ui = {
	class: "picker-mask",
	"aria-hidden": "true"
}, di = 40, fi = 7, pi = 40, mi = 150, hi = 120, gi = 80, _i = 50, vi = 40, yi = 800, bi = 120, xi = 400, Si = 400, Ci = 80, wi = 3e3, Ti = /*#__PURE__*/ dt({
	__name: "PickerColumn",
	props: {
		items: {
			type: Array,
			default: () => []
		},
		value: {
			type: Number,
			default: 0
		},
		wrap: {
			type: Boolean,
			default: !0
		},
		canScrollUp: {
			type: Boolean,
			default: !0
		},
		canScrollDown: {
			type: Boolean,
			default: !0
		},
		ariaLabel: {
			type: String,
			default: ""
		}
	},
	emits: ["change"],
	setup(e, { expose: n, emit: r }) {
		let i = e, a = r, s = fi * di, c = (s - di) / 2, d = di, f = typeof window < "u" && ("onscrollend" in window || typeof Element < "u" && ("onscrollend" in Element.prototype || "scrollend" in Element.prototype)), p = A(null), h = A(null), g = A(null), _ = A(!1), v = A(!1), y = A(-1), b = o(() => i.items.length), w = o(() => Math.max(di, b.value * di)), E = o(() => Math.max(2, Math.ceil(c / w.value) + 1)), O = o(() => E.value + 1 + Math.ceil((s - c) / w.value)), k = o(() => i.wrap ? b.value * O.value : Math.max(9, b.value)), M = o(() => i.wrap ? 0 : Math.max(0, Math.ceil((k.value - b.value) / 2))), N = o(() => i.wrap ? E.value * w.value - c : -120), P = o(() => k.value * di), F = o(() => {
			if (i.wrap) {
				let e = [];
				for (let t = 0; t < O.value; t++) e.push(...i.items);
				return e;
			}
			let e = [];
			for (let t = 0; t < k.value; t++) {
				let n = t - M.value;
				e.push(n >= 0 && n < b.value ? i.items[n] : "");
			}
			return e;
		}), I = "none", R = 0, z = 0, te = 0, ne = 0, W = 0, G = 0, re = !1, K = null, q = 0, J = 0, ie = !1, Y = -1, X = !1, Z = !1, ae = 0, Q = !1, oe = !1, se = 0, ce = 0, le = (e) => Math.max(0, Math.min(b.value - 1, e)), ue = (e) => b.value === 0 ? 0 : (e % b.value + b.value) % b.value, de = (e) => {
			let t = i.wrap ? ue(e) : le(e);
			return i.wrap ? N.value + t * di : (M.value + t) * di - c;
		}, fe = (e, t, n) => {
			if (!i.wrap) return t;
			let r = w.value, a = k.value * di - s, o = [];
			for (let e = -1; e <= 1; e++) {
				let n = t + e * r;
				n >= 0 && n <= a && o.push(n);
			}
			let c = null;
			for (let t of o) n > 0 && t < e || n < 0 && t > e || (c === null || Math.abs(t - e) < Math.abs(c - e)) && (c = t);
			if (c === null) for (let t of o) (c === null || Math.abs(t - e) < Math.abs(c - e)) && (c = t);
			return c ?? t;
		}, $ = () => {
			let e = h.value;
			return !e || !i.wrap ? 0 : (e.scrollTop - N.value) / di;
		}, pe = () => {
			let e = h.value;
			if (!e || b.value === 0) return 0;
			let t = e.scrollTop;
			if (i.wrap) return ue(Math.round((t - N.value) / di));
			let n = M.value, r = M.value + b.value - 1, a = Math.round((t + c) / di);
			return le(Math.max(n, Math.min(r, a)) - M.value);
		}, me = () => {
			let e = h.value, t = g.value;
			!e || !t || (t.style.transform = `translate3d(0, ${-e.scrollTop}px, 0)`);
		}, he = () => {
			let e = h.value;
			if (!e || !i.wrap) return;
			let t = e.scrollTop;
			t < N.value - w.value ? (se++, e.scrollTop = t + w.value) : t > N.value + w.value && (se++, e.scrollTop = t - w.value);
		}, ge = () => {
			window.clearTimeout(ce), ce = 0;
		}, _e = () => {
			cancelAnimationFrame(G), G = 0, re = !1, K = null, se = 0, we(), ge(), v.value = !1, y.value = -1;
		}, ve = () => {
			!h.value || b.value === 0 || ke(i.wrap ? N.value + Math.round($()) * di : de(pe()), hi);
		}, ye = () => {
			f && (ge(), ce = window.setTimeout(() => {
				ce = 0, !(se > 0 || re) && (he(), me(), ve());
			}, wi));
		}, be = () => {
			if (f) {
				if (se > 0) {
					se--;
					return;
				}
				ge(), !(re || I === "mouse") && (we(), v.value = !1, y.value = -1, he(), me(), ve());
			}
		}, xe = (e) => {
			ie = e !== i.value, Y = e, a("change", e);
		}, Se = () => {
			let e = h.value;
			e && (v.value = !0, y.value = (Math.round((e.scrollTop + c) / di) % k.value + k.value) % k.value);
		}, Ce = () => {
			let e = pe();
			e !== Y && xe(e), Se();
		}, we = () => {
			window.clearTimeout(W), W = 0;
		}, Te = () => {
			let e = performance.now();
			if (z = e, I === "touch" ? oe && (Q = !0) : I === "trackpad" && e - R > vi && (Q = !0), !re && !f && he(), me(), f) {
				!re && se === 0 && (v.value = !1, y.value = -1, ye());
				return;
			}
			I === "trackpad" && !re && De();
		}, Ee = () => {
			if (!(I === "trackpad" || I === "touch") || re || !h.value || b.value === 0) return;
			let e = performance.now();
			Z && e - ae > 3e3 && (Z = !1);
			let t = Z && X, n = oe ? Q ? gi : 0 : Q ? gi : yi, r = e - z >= n && e - R >= n, a = I === "touch" && oe && !Q ? e - z >= bi : !0;
			if (t || !r || !a) {
				W = window.setTimeout(Ee, _i);
				return;
			}
			v.value && pe() === Y || ke(i.wrap ? N.value + Math.round($()) * di : de(pe()), hi);
		}, De = () => {
			we(), W = window.setTimeout(Ee, _i);
		}, Oe = () => {
			let e = h.value;
			e && (he(), me(), K = i.wrap ? Math.round((e.scrollTop - N.value) / di) : null, Ce());
		}, ke = (e, t) => {
			let n = h.value;
			if (!n || b.value === 0) return;
			cancelAnimationFrame(G), we(), v.value = !1, y.value = -1;
			let r = n.scrollTop, i = e;
			if (Math.abs(i - r) < 1) {
				n.scrollTop = e, se++, re = !1, Oe();
				return;
			}
			re = !0, se++;
			let a = performance.now(), o = (e) => 1 - (1 - e) ** 3, s = (e) => {
				let c = Math.min(1, (e - a) / t);
				n.scrollTop = r + (i - r) * o(c), me(), c < 1 ? G = requestAnimationFrame(s) : (re = !1, Oe());
			};
			G = requestAnimationFrame(s);
		}, Ae = (e) => {
			let t = h.value;
			if (!(!t || b.value === 0)) if (i.wrap) {
				let n = K === null ? Math.round($()) + e : K + e, r = fe(t.scrollTop, N.value + n * di, e);
				K = Math.round((r - N.value) / di), ke(r, mi);
			} else {
				let t = K === null ? pe() : K, n = le(t + e);
				if (n === t) return;
				K = n, ke(de(n), mi);
			}
		}, je = (e) => {
			if (!F.value[e]) return;
			K = null;
			let t = h.value?.scrollTop ?? 0, n = e * di - c, r = fe(t, n, n >= t ? 1 : -1), i = Math.abs(r - t);
			ke(r, Math.min(400, mi + i * .25));
		}, Me = (e) => {
			e.key === "ArrowUp" ? (e.preventDefault(), i.canScrollUp && Ae(-1)) : e.key === "ArrowDown" && (e.preventDefault(), i.canScrollDown && Ae(1));
		}, Ne = (e) => e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * s : e.deltaY, Pe = (e) => {
			_e();
			let t = performance.now();
			v.value = !1, y.value = -1, X = !0, oe = !1, Q = !1, Z && t - ae > 3e3 && (Z = !1), t - R > xi && (I = "none", ne = 0, te = 0), R = t, te++;
			let n = Ne(e);
			I === "none" ? I = Math.abs(n) >= pi ? "mouse" : "trackpad" : I === "mouse" && te >= 6 && Math.abs(n) < 25 && (I = "trackpad"), I === "mouse" && (e.preventDefault(), we(), Math.abs(n) >= pi ? (Ae(n > 0 ? 1 : -1), ne = 0) : (ne += n, Math.abs(ne) >= d && (Ae(ne > 0 ? 1 : -1), ne = 0)));
		}, Fe = (e) => e.pointerType === "touch" || e.pointerType === "pen" || e.pointerType === "touchpad", Ie = (e) => {
			Fe(e) && (_e(), ae = performance.now(), Z = !0, X = !0, oe = !1, Q = !1, (e.pointerType === "touch" || e.pointerType === "pen") && (I = "touch"));
		}, Le = (e) => {
			Fe(e) && (e.pointerType !== "touchpad" && e.buttons === 0 || (_e(), ae = performance.now(), Z = !0, X = !0));
		}, Re = (e) => {
			Fe(e) && (ae = performance.now(), Z = !0, X = !1, oe = !0, ge(), (I === "touch" || !f && I === "trackpad") && De());
		}, ze = (e) => {
			Be(), q = window.setTimeout(() => {
				Ae(e), J = window.setInterval(() => Ae(e), Ci);
			}, Si);
		}, Be = () => {
			window.clearTimeout(q), window.clearInterval(J), q = 0, J = 0;
		}, Ve = async () => {
			await x();
			let e = h.value;
			e && (cancelAnimationFrame(G), we(), ge(), re = !1, K = null, se++, e.scrollTop = de(i.value), me(), Y = i.value, Se());
		};
		return n({ flush: () => {
			if (!h.value) return;
			we(), ge(), re = !1, K = null;
			let e = pe();
			e !== Y && xe(e), Se();
		} }), V([() => i.items, () => i.value], () => {
			if (ie) {
				ie = !1;
				return;
			}
			Ve();
		}), ee(() => {
			h.value?.addEventListener("wheel", Pe, { passive: !1 }), f && h.value?.addEventListener("scrollend", be), window.addEventListener("pointerdown", Ie, !0), window.addEventListener("pointermove", Le, !0), window.addEventListener("pointerup", Re, !0), window.addEventListener("pointercancel", Re, !0), Ve();
		}), T(() => {
			h.value?.removeEventListener("wheel", Pe), f && h.value?.removeEventListener("scrollend", be), window.removeEventListener("pointerdown", Ie, !0), window.removeEventListener("pointermove", Le, !0), window.removeEventListener("pointerup", Re, !0), window.removeEventListener("pointercancel", Re, !0), cancelAnimationFrame(G), we(), ge(), Be();
		}), (n, r) => (D(), l("div", {
			ref_key: "rootEl",
			ref: p,
			class: "picker-col-root",
			onMouseenter: r[4] ||= (e) => _.value = !0,
			onMouseleave: r[5] ||= (e) => _.value = !1
		}, [
			U(m(Kn, {
				Style: "SubtleButtonStyle",
				class: "picker-arrow picker-arrow-up",
				Padding: "0",
				MinWidth: "0",
				MinHeight: "0",
				CornerRadius: "0",
				FontSize: "8",
				onPointerdown: r[0] ||= (e) => ze(-1),
				onPointerup: Be,
				onPointercancel: Be,
				onPointerleave: Be,
				onClick: r[1] ||= (e) => Ae(-1)
			}, {
				default: H(() => [...r[6] ||= [u("span", {
					class: "icon",
					"aria-hidden": "true"
				}, "", -1)]]),
				_: 1
			}, 512), [[B, _.value && e.canScrollUp]]),
			u("div", {
				ref_key: "scrollEl",
				ref: h,
				class: "picker-col-scroll",
				tabindex: "0",
				"aria-label": e.ariaLabel,
				onScroll: Te,
				onKeydown: Me
			}, [u("div", {
				class: "picker-list",
				style: C({ height: P.value + "px" })
			}, [(D(!0), l(t, null, j(F.value, (e, t) => (D(), l("div", {
				key: "o" + t,
				class: S(["picker-item", { empty: !e }]),
				onClick: (e) => je(t)
			}, L(e), 11, li))), 128))], 4)], 40, ci),
			u("div", ui, [u("div", {
				ref_key: "maskEl",
				ref: g,
				class: "picker-list picker-mask-list",
				style: C({ height: P.value + "px" })
			}, [(D(!0), l(t, null, j(F.value, (e, t) => (D(), l("div", {
				key: "m" + t,
				class: S(["picker-item picker-mask-item", {
					empty: !e,
					settled: v.value && t === y.value
				}])
			}, L(e), 3))), 128))], 4)]),
			U(m(Kn, {
				Style: "SubtleButtonStyle",
				class: "picker-arrow picker-arrow-down",
				Padding: "0",
				MinWidth: "0",
				MinHeight: "0",
				CornerRadius: "0",
				FontSize: "8",
				onPointerdown: r[2] ||= (e) => ze(1),
				onPointerup: Be,
				onPointercancel: Be,
				onPointerleave: Be,
				onClick: r[3] ||= (e) => Ae(1)
			}, {
				default: H(() => [...r[7] ||= [u("span", {
					class: "icon",
					"aria-hidden": "true"
				}, "", -1)]]),
				_: 1
			}, 512), [[B, _.value && e.canScrollDown]])
		], 544));
	}
}, [["__scopeId", "data-v-1a21500d"]]), Ei = {
	key: 0,
	class: "picker-column-text picker-month-text"
}, Di = {
	key: 1,
	class: "picker-column-text picker-day-text"
}, Oi = {
	key: 2,
	class: "picker-column-text picker-year-text"
}, ki = { class: "picker-columns" }, Ai = {
	key: 1,
	class: "picker-col-divider"
}, ji = {
	key: 0,
	class: "picker-col-divider"
}, Mi = { class: "picker-actions" }, Ni = 8, Pi = /*#__PURE__*/ dt({
	__name: "DatePicker",
	props: {
		CalendarIdentifier: {
			type: String,
			default: "GregorianCalendar"
		},
		Date: {
			type: Date,
			default: null
		},
		DayFormat: {
			type: String,
			default: "day.integer"
		},
		DayVisible: {
			type: Boolean,
			default: !0
		},
		Header: {
			type: String,
			default: ""
		},
		HeaderPlacement: {
			type: String,
			default: "Top"
		},
		HeaderTemplate: {
			type: Object,
			default: null
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		Language: {
			type: String,
			default: ""
		},
		LightDismissOverlayMode: {
			type: String,
			default: "Auto"
		},
		MaxYear: {
			type: Date,
			default: () => new globalThis.Date(new globalThis.Date().getFullYear() + 50, 11, 31)
		},
		MinYear: {
			type: Date,
			default: () => new globalThis.Date(new globalThis.Date().getFullYear() - 50, 0, 1)
		},
		MonthFormat: {
			type: String,
			default: "month.full"
		},
		MonthVisible: {
			type: Boolean,
			default: !0
		},
		Orientation: {
			type: String,
			default: "Horizontal"
		},
		SelectedDate: {
			type: Date,
			default: null
		},
		YearFormat: {
			type: String,
			default: "year.full"
		},
		YearVisible: {
			type: Boolean,
			default: !0
		}
	},
	emits: [
		"update:Date",
		"update:SelectedDate",
		"DateChanged",
		"SelectedDateChanged"
	],
	setup(e, { emit: r }) {
		let i = e, a = r, { t: d, locale: f } = rt(), p = A(!1), h = A(!1), g = A(!1), _ = A(null), v = A(null), y = A({}), w = A(null), ee = A(null), T = A(null), E = Je(v, { Origin: "center" }), O = A(1), k = A(1), j = A(2024), M = A(null), N = o(() => i.Language || f), P = o(() => Array.from({ length: 12 }, (e, t) => new Intl.DateTimeFormat(N.value, { month: "long" }).format(new globalThis.Date(2024, t, 1)))), F = o(() => Array.from({ length: 12 }, (e, t) => new Intl.DateTimeFormat(N.value, { month: "short" }).format(new globalThis.Date(2024, t, 1)))), I = (e) => e instanceof globalThis.Date && !Number.isNaN(e.getTime()), R = o(() => I(i.SelectedDate) || I(i.Date) || I(M.value)), te = o(() => I(i.SelectedDate) ? i.SelectedDate : I(i.Date) ? i.Date : I(M.value) ? M.value : new globalThis.Date()), ne = o(() => I(i.MinYear) ? i.MinYear.getFullYear() : new globalThis.Date().getFullYear() - 50), B = o(() => I(i.MaxYear) ? i.MaxYear.getFullYear() : new globalThis.Date().getFullYear() + 50), U = o(() => {
			let e = Math.min(ne.value, B.value), t = Math.max(ne.value, B.value);
			return Array.from({ length: t - e + 1 }, (t, n) => e + n);
		}), W = o(() => new globalThis.Date(j.value, O.value, 0).getDate()), G = (e) => i.MonthFormat.includes("abbreviated") ? F.value[e.getMonth()] : i.MonthFormat.includes("integer") ? String(e.getMonth() + 1) : P.value[e.getMonth()], re = (e) => {
			let t = e.getDate(), n = i.DayFormat.includes("integer(2)") ? String(t).padStart(2, "0") : String(t);
			return i.DayFormat.includes("dayofweek.abbreviated") ? `${n} (${e.toLocaleDateString(N.value, { weekday: "short" })})` : i.DayFormat.includes("dayofweek.full") ? `${n} (${e.toLocaleDateString(N.value, { weekday: "long" })})` : n;
		}, K = (e) => i.YearFormat.includes("abbreviated") ? String(e.getFullYear()).slice(-2) : String(e.getFullYear()), q = o(() => R.value ? G(te.value) : d("control.datepicker.month")), J = o(() => R.value ? re(te.value) : d("control.datepicker.day")), ie = o(() => R.value ? K(te.value) : d("control.datepicker.year")), Y = o(() => P.value), X = o(() => Math.max(0, O.value - 1)), Z = o(() => Array.from({ length: W.value }, (e, t) => re(new globalThis.Date(j.value, O.value - 1, t + 1)))), ae = o(() => Math.min(k.value - 1, Z.value.length - 1)), Q = o(() => U.value.map(String)), oe = o(() => {
			let e = U.value.indexOf(j.value);
			return e >= 0 ? e : 0;
		}), se = (e) => {
			O.value = e + 1;
		}, ce = (e) => {
			k.value = e + 1;
		}, le = (e) => {
			j.value = U.value[e];
		};
		V([O, j], () => {
			k.value > W.value && (k.value = W.value);
		});
		let ue = (e) => I(i.MinYear) && e < i.MinYear ? new globalThis.Date(i.MinYear) : I(i.MaxYear) && e > i.MaxYear ? new globalThis.Date(i.MaxYear) : e, de = async () => {
			if (!i.IsEnabled) return;
			if (h.value) {
				fe(!1);
				return;
			}
			let e = ue(te.value);
			O.value = e.getMonth() + 1, k.value = e.getDate(), j.value = Math.max(ne.value, Math.min(B.value, e.getFullYear())), p.value = !0, h.value = !0, g.value = !1, await x();
			let t = _.value.getBoundingClientRect(), n = t.top + t.height / 2, r = v.value?.getBoundingClientRect(), a = r?.height || 323, o = r?.width || t.width, s = n - 141, c = Math.max(Ni, window.innerHeight - a - Ni), l = Math.min(Math.max(Ni, s), c), u = Math.min(Math.max(Ni, t.left), Math.max(Ni, window.innerWidth - o - Ni));
			y.value = {
				top: `${l}px`,
				left: `${u}px`,
				width: `${t.width}px`,
				transformOrigin: "center center"
			}, await x(), E.play();
		}, fe = (e) => {
			if (E.cancel(), e) {
				w.value?.flush(), ee.value?.flush(), T.value?.flush();
				let e = Math.min(k.value, new globalThis.Date(j.value, O.value, 0).getDate()), t = te.value, n = ue(new globalThis.Date(j.value, O.value - 1, e));
				!I(i.Date) && !I(i.SelectedDate) && (M.value = n), a("update:Date", n), a("update:SelectedDate", n), a("DateChanged", {
					oldDate: t,
					newDate: n
				}), a("SelectedDateChanged", {
					oldDate: t,
					newDate: n
				});
			}
			g.value = !0, h.value = !1;
		}, $ = () => {
			g.value &&= (p.value = !1, !1);
		};
		return (r, i) => (D(), l("div", {
			class: "win-date-picker",
			ref_key: "containerRef",
			ref: _
		}, [
			e.Header ? (D(), s(Rt, {
				key: 0,
				class: "picker-header",
				Text: e.Header
			}, null, 8, ["Text"])) : c("", !0),
			m(Kn, {
				class: S(["picker-btn", { "has-no-date": !R.value }]),
				Padding: "0",
				MinHeight: "32",
				IsEnabled: e.IsEnabled,
				onClick: de
			}, {
				default: H(() => [
					e.MonthVisible ? (D(), l("div", Ei, L(q.value), 1)) : c("", !0),
					e.DayVisible ? (D(), l("div", Di, L(J.value), 1)) : c("", !0),
					e.YearVisible ? (D(), l("div", Oi, L(ie.value), 1)) : c("", !0)
				]),
				_: 1
			}, 8, ["class", "IsEnabled"]),
			(D(), s(n, { to: "body" }, [p.value ? (D(), l("div", {
				key: 0,
				class: "picker-overlay",
				onClick: i[0] ||= (e) => fe(!1)
			})) : c("", !0), p.value ? (D(), l("div", {
				key: 1,
				ref_key: "flyoutRef",
				ref: v,
				class: S(["picker-flyout", { "picker-flyout-closing": g.value }]),
				style: C(y.value),
				onAnimationend: $
			}, [u("div", ki, [
				e.MonthVisible ? (D(), s(Ti, {
					key: 0,
					ref_key: "monthColRef",
					ref: w,
					class: "picker-month",
					items: Y.value,
					value: X.value,
					wrap: !0,
					"aria-label": z(d)("control.datepicker.month"),
					onChange: se
				}, null, 8, [
					"items",
					"value",
					"aria-label"
				])) : c("", !0),
				e.MonthVisible && e.DayVisible ? (D(), l("div", Ai)) : c("", !0),
				e.DayVisible ? (D(), s(Ti, {
					key: 2,
					ref_key: "dayColRef",
					ref: ee,
					class: "picker-day",
					items: Z.value,
					value: ae.value,
					wrap: !0,
					"aria-label": z(d)("control.datepicker.day"),
					onChange: ce
				}, null, 8, [
					"items",
					"value",
					"aria-label"
				])) : c("", !0),
				e.YearVisible ? (D(), l(t, { key: 3 }, [e.MonthVisible || e.DayVisible ? (D(), l("div", ji)) : c("", !0), m(Ti, {
					ref_key: "yearColRef",
					ref: T,
					class: "picker-year",
					items: Q.value,
					value: oe.value,
					wrap: !0,
					"aria-label": z(d)("control.datepicker.year"),
					onChange: le
				}, null, 8, [
					"items",
					"value",
					"aria-label"
				])], 64)) : c("", !0)
			]), u("div", Mi, [m(Kn, b({
				Style: "SubtleButtonStyle",
				class: "picker-action-btn",
				"aria-label": z(d)("text.accept")
			}, { "tooltipservice.tooltip": z(d)("text.accept") }, {
				Padding: "0",
				Margin: "4",
				MinWidth: "0",
				MinHeight: "0",
				FontSize: "16",
				onClick: i[1] ||= (e) => fe(!0)
			}), {
				default: H(() => [...i[3] ||= [u("span", {
					class: "icon",
					"aria-hidden": "true"
				}, "", -1)]]),
				_: 1
			}, 16, ["aria-label"]), m(Kn, b({
				Style: "SubtleButtonStyle",
				class: "picker-action-btn",
				"aria-label": z(d)("text.cancel")
			}, { "tooltipservice.tooltip": z(d)("text.cancel") }, {
				Padding: "0",
				Margin: "4",
				MinWidth: "0",
				MinHeight: "0",
				FontSize: "16",
				onClick: i[2] ||= (e) => fe(!1)
			}), {
				default: H(() => [...i[4] ||= [u("span", {
					class: "icon",
					"aria-hidden": "true"
				}, "", -1)]]),
				_: 1
			}, 16, ["aria-label"])])], 38)) : c("", !0)]))
		], 512));
	}
}, [["__scopeId", "data-v-a7cd35f4"]]), Fi = { class: "picker-column-text" }, Ii = { class: "picker-column-text" }, Li = {
	key: 0,
	class: "picker-column-text"
}, Ri = { class: "picker-columns" }, zi = { class: "picker-actions" }, Bi = 8, Vi = /*#__PURE__*/ dt({
	__name: "TimePicker",
	props: {
		ClockIdentifier: {
			type: String,
			default: "12HourClock"
		},
		Header: {
			type: String,
			default: ""
		},
		HeaderPlacement: {
			type: String,
			default: "Top"
		},
		HeaderTemplate: {
			type: Object,
			default: null
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		Language: {
			type: String,
			default: ""
		},
		LightDismissOverlayMode: {
			type: String,
			default: "Auto"
		},
		MinuteIncrement: {
			type: Number,
			default: 1
		},
		SelectedTime: {
			type: Object,
			default: null
		},
		Time: {
			type: Object,
			default: null
		}
	},
	emits: [
		"update:Time",
		"update:SelectedTime",
		"TimeChanged",
		"SelectedTimeChanged"
	],
	setup(e, { emit: r }) {
		let i = e, a = r, { t: d, locale: f } = rt(), p = A(!1), h = A(!1), g = A(!1), _ = A(null), v = A(null), y = A({}), w = A(null), ee = A(null), T = A(null), E = Je(v, { Origin: "center" }), O = A(0), k = A(0), j = A("AM"), M = A(null), N = o(() => {
			let e = Math.trunc(i.MinuteIncrement);
			return e > 0 && e <= 59 ? e : 1;
		}), P = o(() => i.Language || f), F = (e) => new Intl.DateTimeFormat(P.value, {
			hour: "numeric",
			hour12: !0
		}).formatToParts(new globalThis.Date(2024, 0, 1, e)).find((e) => e.type === "dayPeriod")?.value || d(e < 12 ? "control.timepicker.am" : "control.timepicker.pm"), I = o(() => F(9)), R = o(() => F(15)), te = (e) => Number.isFinite(e?.hour) && Number.isFinite(e?.minute), ne = o(() => te(i.SelectedTime) || te(i.Time) || te(M.value)), B = o(() => K(i.SelectedTime ?? i.Time ?? M.value ?? {
			hour: 0,
			minute: 0
		})), V = o(() => i.ClockIdentifier === "12HourClock" ? Array.from({ length: 12 }, (e, t) => t + 1) : Array.from({ length: 24 }, (e, t) => t)), U = o(() => {
			let e = Math.ceil(60 / N.value);
			return Array.from({ length: e }, (e, t) => Math.min(59, t * N.value));
		}), W = o(() => {
			if (!ne.value) return d("control.timepicker.hour");
			let e = B.value.hour;
			if (i.ClockIdentifier === "24HourClock") return String(e).padStart(2, "0");
			let t = e % 12;
			return t === 0 ? 12 : t;
		}), G = o(() => ne.value ? String(B.value.minute).padStart(2, "0") : d("control.timepicker.minute")), re = o(() => ne.value && B.value.hour >= 12 ? R.value : I.value);
		function K(e) {
			let t = Number.isFinite(e?.hour) ? e.hour : 0, n = Number.isFinite(e?.minute) ? e.minute : 0;
			return {
				hour: Math.max(0, Math.min(23, Math.trunc(t))),
				minute: Math.max(0, Math.min(59, Math.trunc(n)))
			};
		}
		let q = o(() => V.value.map((e) => i.ClockIdentifier === "12HourClock" ? String(e) : String(e).padStart(2, "0"))), J = o(() => {
			let e = V.value.indexOf(O.value);
			return e >= 0 ? e : 0;
		}), ie = o(() => U.value.map((e) => String(e).padStart(2, "0"))), Y = o(() => {
			let e = U.value.indexOf(k.value);
			return e >= 0 ? e : 0;
		}), X = o(() => [I.value, R.value]), Z = o(() => +(j.value === "PM")), ae = (e) => {
			O.value = V.value[e];
		}, Q = (e) => {
			k.value = U.value[e];
		}, oe = (e) => {
			j.value = e === 1 ? "PM" : "AM";
		}, se = async () => {
			if (!i.IsEnabled) return;
			if (h.value) {
				ce(!1);
				return;
			}
			let e = B.value.hour;
			if (i.ClockIdentifier === "12HourClock") {
				let t = e % 12;
				O.value = t === 0 ? 12 : t, j.value = e >= 12 ? "PM" : "AM";
			} else O.value = e;
			k.value = B.value.minute - B.value.minute % N.value, p.value = !0, h.value = !0, g.value = !1, await x();
			let t = _.value.getBoundingClientRect(), n = t.top + t.height / 2, r = v.value?.getBoundingClientRect(), a = r?.height || 323, o = r?.width || t.width, s = n - 141, c = Math.max(Bi, window.innerHeight - a - Bi), l = Math.min(Math.max(Bi, s), c), u = Math.min(Math.max(Bi, t.left), Math.max(Bi, window.innerWidth - o - Bi));
			y.value = {
				top: `${l}px`,
				left: `${u}px`,
				width: `${t.width}px`,
				transformOrigin: "center center"
			}, await x(), E.play();
		}, ce = (e) => {
			if (E.cancel(), e) {
				w.value?.flush(), ee.value?.flush(), T.value?.flush();
				let e = B.value, t = O.value;
				i.ClockIdentifier === "12HourClock" && (j.value === "PM" && t !== 12 && (t += 12), j.value === "AM" && t === 12 && (t = 0));
				let n = {
					hour: t,
					minute: k.value
				};
				!i.SelectedTime && !i.Time && (M.value = n), a("update:Time", n), a("update:SelectedTime", n), a("TimeChanged", {
					oldTime: e,
					newTime: n
				}), a("SelectedTimeChanged", {
					oldTime: e,
					newTime: n
				});
			}
			g.value = !0, h.value = !1;
		}, le = () => {
			g.value &&= (p.value = !1, !1);
		};
		return (r, i) => (D(), l("div", {
			class: "win-time-picker",
			ref_key: "containerRef",
			ref: _
		}, [
			e.Header ? (D(), s(Rt, {
				key: 0,
				class: "picker-header",
				Text: e.Header
			}, null, 8, ["Text"])) : c("", !0),
			m(Kn, {
				class: S(["picker-btn", { "has-no-time": !ne.value }]),
				Padding: "0",
				MinHeight: "32",
				IsEnabled: e.IsEnabled,
				onClick: se
			}, {
				default: H(() => [
					u("div", Fi, L(W.value), 1),
					u("div", Ii, L(G.value), 1),
					e.ClockIdentifier === "12HourClock" ? (D(), l("div", Li, L(re.value), 1)) : c("", !0)
				]),
				_: 1
			}, 8, ["class", "IsEnabled"]),
			(D(), s(n, { to: "body" }, [p.value ? (D(), l("div", {
				key: 0,
				class: "picker-overlay",
				onClick: i[0] ||= (e) => ce(!1)
			})) : c("", !0), p.value ? (D(), l("div", {
				key: 1,
				ref_key: "flyoutRef",
				ref: v,
				class: S(["picker-flyout", { "picker-flyout-closing": g.value }]),
				style: C(y.value),
				onAnimationend: le
			}, [u("div", Ri, [
				m(Ti, {
					ref_key: "hourColRef",
					ref: w,
					class: "picker-col-flex",
					items: q.value,
					value: J.value,
					wrap: !0,
					"aria-label": z(d)("control.timepicker.hour"),
					onChange: ae
				}, null, 8, [
					"items",
					"value",
					"aria-label"
				]),
				i[4] ||= u("div", { class: "picker-col-divider" }, null, -1),
				m(Ti, {
					ref_key: "minuteColRef",
					ref: ee,
					class: "picker-col-flex",
					items: ie.value,
					value: Y.value,
					wrap: !0,
					"aria-label": z(d)("control.timepicker.minute"),
					onChange: Q
				}, null, 8, [
					"items",
					"value",
					"aria-label"
				]),
				e.ClockIdentifier === "12HourClock" ? (D(), l(t, { key: 0 }, [i[3] ||= u("div", { class: "picker-col-divider" }, null, -1), m(Ti, {
					ref_key: "ampmColRef",
					ref: T,
					class: "picker-col-flex",
					items: X.value,
					value: Z.value,
					wrap: !1,
					"can-scroll-up": Z.value > 0,
					"can-scroll-down": Z.value < X.value.length - 1,
					"aria-label": `${z(d)("control.timepicker.am")}/${z(d)("control.timepicker.pm")}`,
					onChange: oe
				}, null, 8, [
					"items",
					"value",
					"can-scroll-up",
					"can-scroll-down",
					"aria-label"
				])], 64)) : c("", !0)
			]), u("div", zi, [m(Kn, b({
				Style: "SubtleButtonStyle",
				class: "picker-action-btn",
				"aria-label": z(d)("text.accept")
			}, { "tooltipservice.tooltip": z(d)("text.accept") }, {
				Padding: "0",
				Margin: "4",
				MinWidth: "0",
				MinHeight: "0",
				FontSize: "16",
				onClick: i[1] ||= (e) => ce(!0)
			}), {
				default: H(() => [...i[5] ||= [u("span", {
					class: "icon",
					"aria-hidden": "true"
				}, "", -1)]]),
				_: 1
			}, 16, ["aria-label"]), m(Kn, b({
				Style: "SubtleButtonStyle",
				class: "picker-action-btn",
				"aria-label": z(d)("text.cancel")
			}, { "tooltipservice.tooltip": z(d)("text.cancel") }, {
				Padding: "0",
				Margin: "4",
				MinWidth: "0",
				MinHeight: "0",
				FontSize: "16",
				onClick: i[2] ||= (e) => ce(!1)
			}), {
				default: H(() => [...i[6] ||= [u("span", {
					class: "icon",
					"aria-hidden": "true"
				}, "", -1)]]),
				_: 1
			}, 16, ["aria-label"])])], 38)) : c("", !0)]))
		], 512));
	}
}, [["__scopeId", "data-v-c3c9a3b9"]]), Hi = { class: "win-calendar-view" }, Ui = { class: "calendar-header" }, Wi = ["disabled"], Gi = { class: "calendar-nav" }, Ki = ["disabled", "aria-label"], qi = ["disabled", "aria-label"], Ji = { class: "calendar-view-body" }, Yi = {
	key: "day",
	class: "calendar-panel"
}, Xi = { class: "calendar-day-headers" }, Zi = { class: "calendar-grid" }, Qi = ["disabled", "onClick"], $i = { class: "day-text" }, ea = {
	key: "month",
	class: "calendar-panel"
}, ta = { class: "calendar-large-grid" }, na = ["disabled", "onClick"], ra = {
	key: "year",
	class: "calendar-panel"
}, ia = { class: "calendar-large-grid" }, aa = ["disabled", "onClick"], oa = 40, sa = 60, ca = 4, la = 3, ua = 1440 * 60 * 1e3, da = 10, fa = 4, pa = /*#__PURE__*/ dt({
	__name: "CalendarView",
	props: {
		CalendarIdentifier: {
			type: String,
			default: "GregorianCalendar"
		},
		DayOfWeekFormat: {
			type: String,
			default: "{dayofweek.abbreviated(2)}"
		},
		DisplayMode: {
			type: String,
			default: "Month"
		},
		FirstDayOfWeek: {
			type: String,
			default: "Sunday"
		},
		IsGroupLabelVisible: {
			type: Boolean,
			default: !0
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		IsOutOfScopeEnabled: {
			type: Boolean,
			default: !0
		},
		IsTodayHighlighted: {
			type: Boolean,
			default: !0
		},
		MaxDate: {
			type: Date,
			default: () => new globalThis.Date(2120, 11, 31)
		},
		MinDate: {
			type: Date,
			default: () => new globalThis.Date(1920, 0, 1)
		},
		NumberOfWeeksInView: {
			type: Number,
			default: 6
		},
		SelectedDates: {
			type: Array,
			default: null
		},
		SelectionMode: {
			type: String,
			default: "Single"
		},
		Language: {
			type: String,
			default: "en-US"
		}
	},
	emits: [
		"update:SelectedDates",
		"SelectedDatesChanged",
		"CalendarViewDayItemChanging"
	],
	setup(e, { emit: n }) {
		let { t: r } = rt(), a = e, s = n, d = /* @__PURE__ */ new Date(), f = d.getFullYear(), p = d.getMonth(), h = d.toDateString(), g = A({
			Month: 0,
			Year: 1,
			Decade: 2
		}[a.DisplayMode] ?? 0), _ = A("out"), v = A(null), y = A(null), w = A(null), T = A(null), E = A(p), O = A(f), k = A(Math.floor(f / 10) * 10), M = A([]), N = o(() => Array.isArray(a.SelectedDates) ? a.SelectedDates : M.value), P = {
			GregorianCalendar: "gregory",
			HebrewCalendar: "hebrew",
			HijriCalendar: "islamic",
			JapaneseCalendar: "japanese",
			JulianCalendar: "gregory",
			KoreanCalendar: "gregory",
			PersianCalendar: "persian",
			TaiwanCalendar: "roc",
			ThaiCalendar: "buddhist",
			UmAlQuraCalendar: "islamic-umalqura"
		}, F = o(() => {
			let e = `${a.Language}-u-ca-${P[a.CalendarIdentifier] ?? "gregory"}`;
			try {
				return new Intl.DateTimeFormat(e).format(), e;
			} catch {
				return a.Language;
			}
		}), I = (e, t) => new Intl.DateTimeFormat(F.value, { month: t }).format(new Date(2024, e, 1)), R = o(() => Array.from({ length: 12 }, (e, t) => I(t, "short")));
		o(() => Array.from({ length: 12 }, (e, t) => I(t, "long")));
		let te = {
			Sunday: 0,
			Monday: 1,
			Tuesday: 2,
			Wednesday: 3,
			Thursday: 4,
			Friday: 5,
			Saturday: 6
		}[a.FirstDayOfWeek] ?? 0, ne = o(() => {
			let e = new Intl.DateTimeFormat(F.value, { weekday: "short" }), t = Array.from({ length: 7 }, (t, n) => e.format(new Date(2024, 0, 7 + n)).slice(0, 2));
			return [...t.slice(te), ...t.slice(0, te)];
		}), B = (e) => new Intl.NumberFormat(F.value, { useGrouping: !1 }).format(e.getDate()), U = o(() => {
			let e = new Date(O.value, E.value, 1);
			return g.value === 0 ? new Intl.DateTimeFormat(F.value, {
				month: "long",
				year: "numeric"
			}).format(e) : g.value === 1 ? new Intl.DateTimeFormat(F.value, { year: "numeric" }).format(e) : `${k.value} - ${k.value + 9}`;
		}), W = a.MinDate.getFullYear(), G = a.MaxDate.getFullYear(), re = sa * ca, K = sa * la, q = (e, t, n) => Math.floor(Date.UTC(e, t, n) / ua), J = (e) => ((/* @__PURE__ */ new Date(e * ua)).getUTCDay() - te + 7) % 7, ie = (e) => {
			let t = /* @__PURE__ */ new Date(e * ua);
			return new Date(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
		}, Y = (() => {
			let e = q(W, 0, 1), t = q(G, 11, 31), n = e - J(e), r = t + (6 - J(t)), i = [];
			for (let e = W; e <= G; e++) for (let t = 0; t < 12; t++) {
				let r = q(e, t, 1);
				i.push({
					y: e,
					m: t,
					startRow: Math.floor((r - n) / 7)
				});
			}
			return {
				data: i,
				startSerial: n,
				totalRows: Math.floor((r - n) / 7) + 1
			};
		})(), X = A(0), Z = A(0), ae = A([]), Q = o(() => Y.totalRows * oa), oe = () => {
			let e = X.value, t = Math.max(0, Math.floor(e / oa) - 4), n = Math.min(Y.totalRows, Math.floor((e + 240) / oa) + 5);
			Z.value = t * oa;
			let r = e, i = e + 240, a = Math.max(0, Math.floor(r / oa)), o = Math.min(Y.totalRows - 1, Math.floor((i - 1) / oa)), s = /* @__PURE__ */ new Map();
			for (let e = a; e <= o; e++) {
				let t = e * oa, n = t + oa, a = Math.min(n, i) - Math.max(t, r);
				if (!(a <= 0)) for (let t = 0; t < 7; t++) {
					let n = ie(Y.startSerial + e * 7 + t), r = `${n.getFullYear()}-${n.getMonth()}`, i = s.get(r);
					i ? i.px += a : s.set(r, {
						year: n.getFullYear(),
						month: n.getMonth(),
						px: a
					});
				}
			}
			let c = null;
			s.forEach((e) => {
				(!c || e.px > c.px) && (c = e);
			}), c && (E.value = c.month, O.value = c.year);
			let l = E.value, u = O.value, d = [];
			for (let e = t; e < n; e++) for (let t = 0; t < 7; t++) {
				let n = ie(Y.startSerial + e * 7 + t), r = n.getFullYear(), i = n.getMonth(), a = n.getDate();
				d.push({
					key: `${e}-${t}`,
					date: B(n),
					month: i,
					year: r,
					outOfScope: r !== u || i !== l,
					isToday: n.toDateString() === h,
					showLabel: a === 1,
					labelText: R.value[i],
					fullDate: n
				});
			}
			ae.value = d;
		}, se = A(0), ce = A(0), le = A([]), ue = G - W + 1, de = o(() => ue * K), fe = () => {
			let e = se.value, t = re, n = e, r = e + t, i = Math.max(0, Math.floor(e / sa) - 1), a = Math.min(ue * la, Math.ceil(r / sa) + 1);
			ce.value = i * sa;
			let o = Math.floor(n / sa), s = Math.floor((r - 1) / sa), c = W, l = 0, u = o;
			for (; u <= s;) {
				let e = W + Math.floor(u / la), t = (e - W + 1) * la - 1, i = Math.min(t, s), a = Math.max(u * sa, n), o = Math.min((i + 1) * sa, r) - a;
				o > l && (l = o, c = e), u = i + 1;
			}
			O.value = c;
			let d = [];
			for (let e = i; e < a; e++) {
				let t = Math.floor(e / la), n = e - t * la, r = W + t;
				for (let t = 0; t < 4; t++) {
					let i = n * 4 + t;
					d.push({
						key: `m${e}-${t}`,
						month: i,
						year: r,
						text: R.value[i],
						outOfScope: r !== O.value,
						isTodayMonth: i === p && r === f,
						showLabel: i === 0 && t === 0,
						labelText: `${r}`
					});
				}
			}
			le.value = d;
		}, $ = (e) => N.value.length ? N.value.some((t) => t && t.getFullYear() === e.year && t.getMonth() === e.month) : !1, pe = A(0), me = A(0), he = A([]), ge = Math.ceil((G - W + 1) / fa), _e = o(() => ge * sa), ve = () => {
			let e = pe.value, t = re, n = e, r = e + t, i = Math.max(0, Math.floor(e / sa) - 1), a = Math.min(ge, Math.ceil(r / sa) + 1);
			me.value = i * sa;
			let o = Math.max(0, Math.floor(n / sa)), s = Math.min(ge - 1, Math.floor((r - 1) / sa)), c = /* @__PURE__ */ new Map();
			for (let e = o; e <= s; e++) {
				let t = e * sa, i = t + sa, a = Math.min(i, r) - Math.max(t, n);
				if (!(a <= 0)) for (let t = 0; t < fa; t++) {
					let n = W + e * fa + t;
					if (n > G) continue;
					let r = Math.floor(n / da) * da, i = c.get(r);
					c.set(r, (i || 0) + a);
				}
			}
			let l = k.value, u = 0;
			c.forEach((e, t) => {
				e > u && (u = e, l = t);
			}), k.value = l;
			let d = [];
			for (let e = i; e < a; e++) for (let t = 0; t < fa; t++) {
				let n = W + e * fa + t;
				n > G || d.push({
					key: `y${e}-${t}`,
					year: n,
					outOfScope: n < k.value || n >= k.value + da
				});
			}
			he.value = d;
		}, ye = (e) => {
			if (!N.value.length) return !1;
			let t = e.fullDate;
			return N.value.some((e) => e.toDateString() === t.toDateString());
		}, be = (e) => e.isTodayMonth ? !1 : $(e), xe = (e) => e.isToday ? !1 : ye(e), Se = (e) => {
			X.value = e?.verticalOffset ?? v.value?.scrollTop ?? 0, oe();
		}, Ce = (e) => {
			se.value = e?.verticalOffset ?? y.value?.scrollTop ?? 0, fe();
		}, we = (e) => {
			pe.value = e?.verticalOffset ?? w.value?.scrollTop ?? 0, ve();
		}, Te = (e) => e?.scrollViewerRef?.value ?? e?.scrollViewerRef ?? null, Ee = (e) => {
			x(() => {
				let t = globalThis.requestAnimationFrame ?? ((e) => globalThis.setTimeout(e, 0));
				t(() => t(e));
			});
		}, De = (e, t, n = !1) => {
			let r = Te(e);
			if (n && r?.scrollTo) {
				r.scrollTo({
					top: t,
					behavior: "smooth"
				});
				return;
			}
			e?.ChangeView ? e.ChangeView(null, t, null) : e?.ScrollTo?.(0, t);
		}, Oe = (e, t) => (e - W) * 12 + t, ke = (e, t, n = !1) => {
			let r = Oe(e, t), i = Y.data[r];
			if (!i) return;
			let a = i.startRow * oa;
			Ee(() => {
				v.value && (n ? De(v.value, a, !0) : (De(v.value, a), X.value = a, oe()));
			});
		}, Ae = (e, t = !1) => {
			let n = (e - W) * K;
			Ee(() => {
				y.value && (t ? De(y.value, n, !0) : (De(y.value, n), se.value = n, fe()));
			});
		}, je = (e, t = !1) => {
			let n = Math.max(0, Math.min(ge - 1, Math.floor((e - W) / fa))) * sa;
			Ee(() => {
				w.value && (t ? De(w.value, n, !0) : (De(w.value, n), pe.value = n, ve()));
			});
		}, Me = (e) => {
			if (_.value = e > 0 ? "forward" : "backward", g.value === 0) {
				let t = E.value + e, n = O.value;
				t > 11 ? (t = 0, n++) : t < 0 && (t = 11, n--), ke(n, t, !0);
			} else g.value === 1 ? Ae(O.value + e, !0) : je(k.value + e * da, !0);
		}, Ne = () => {
			if (g.value === 0) {
				let e = O.value;
				_.value = "out", T.value = {
					mode: 1,
					year: e
				}, g.value = 1, Ae(e);
			} else if (g.value === 1) {
				let e = Math.floor(O.value / da) * da;
				_.value = "out", T.value = {
					mode: 2,
					decade: e
				}, g.value = 2, je(e);
			}
		}, Pe = (e) => {
			_.value = "in", E.value = e.month, O.value = e.year, T.value = {
				mode: 0,
				year: e.year,
				month: e.month
			}, g.value = 0;
		}, Fe = (e) => {
			_.value = "in", O.value = e.year, T.value = {
				mode: 1,
				year: e.year
			}, g.value = 1;
		}, Ie = (e) => {
			if (!a.IsEnabled || e.outOfScope && !a.IsOutOfScopeEnabled || a.SelectionMode === "None") return;
			let t = [...N.value];
			if (a.SelectionMode === "Single") {
				let n = N.value.some((t) => t.toDateString() === e.fullDate.toDateString()), r = n ? [] : [e.fullDate];
				Array.isArray(a.SelectedDates) || (M.value = r), s("update:SelectedDates", r), s("SelectedDatesChanged", {
					addedDates: n ? [] : r,
					removedDates: n ? t : t.filter((t) => t.toDateString() !== e.fullDate.toDateString())
				});
			} else if (a.SelectionMode === "Multiple") {
				let t = [...N.value], n = t.findIndex((t) => t.toDateString() === e.fullDate.toDateString()), r = [], i = [];
				n >= 0 ? i.push(...t.splice(n, 1)) : (t.push(e.fullDate), r.push(e.fullDate)), s("update:SelectedDates", t), Array.isArray(a.SelectedDates) || (M.value = t), s("SelectedDatesChanged", {
					addedDates: r,
					removedDates: i
				});
			}
		}, Le = (e) => {
			e.style.position = "absolute", e.style.inset = "0";
		}, Re = (e, t) => {
			let n = _.value === "forward" ? "calendar-view-enter-forward" : _.value === "backward" ? "calendar-view-enter-backward" : _.value === "out" ? "calendar-view-enter-out" : "calendar-view-enter-in";
			e.classList.add(n);
			let r = !1, i = () => {
				r || (r = !0, e.classList.remove(n), e.style.position = "", e.style.inset = "", t());
			};
			e.addEventListener("animationend", i, { once: !0 }), setTimeout(i, 333);
			let a = T.value;
			if (a?.mode === g.value) {
				T.value = null, a.mode === 0 ? ke(a.year, a.month) : a.mode === 1 ? Ae(a.year) : je(a.decade);
				return;
			}
			g.value === 0 ? ke(O.value, E.value) : g.value === 1 ? Ae(O.value) : je(k.value);
		}, ze = (e) => {
			e.style.position = "absolute", e.style.inset = "0";
		}, Be = (e, t) => {
			let n = _.value === "forward" ? "calendar-view-leave-forward" : _.value === "backward" ? "calendar-view-leave-backward" : _.value === "out" ? "calendar-view-leave-out" : "calendar-view-leave-in";
			e.classList.add(n);
			let r = !1, i = () => {
				r || (r = !0, e.classList.remove(n), t());
			};
			e.addEventListener("animationend", i, { once: !0 }), setTimeout(i, 333);
		};
		return ee(() => {
			x(() => x(() => ke(f, p)));
		}), V([() => a.Language, () => a.CalendarIdentifier], () => {
			x(() => {
				oe(), fe(), ve();
			});
		}), (n, a) => (D(), l("div", Hi, [
			u("div", Ui, [u("button", {
				class: "win-btn DefaultButtonStyle subtle calendar-title-btn",
				onClick: Ne,
				disabled: !e.IsEnabled || g.value === 2
			}, [u("span", null, L(U.value), 1)], 8, Wi), u("div", Gi, [u("button", b({
				class: "icon-btn",
				disabled: !e.IsEnabled,
				"aria-label": z(r)("text.previous")
			}, { "tooltipservice.tooltip": z(r)("text.previous") }, { onClick: a[0] ||= (e) => Me(-1) }), "", 16, Ki), u("button", b({
				class: "icon-btn",
				disabled: !e.IsEnabled,
				"aria-label": z(r)("text.next")
			}, { "tooltipservice.tooltip": z(r)("text.next") }, { onClick: a[1] ||= (e) => Me(1) }), "", 16, qi)])]),
			a[2] ||= u("div", { class: "calendar-divider" }, null, -1),
			u("div", Ji, [m(i, {
				css: !1,
				onBeforeLeave: ze,
				onLeave: Be,
				onBeforeEnter: Le,
				onEnter: Re
			}, {
				default: H(() => [g.value === 0 ? (D(), l("div", Yi, [u("div", Xi, [(D(!0), l(t, null, j(ne.value, (e) => (D(), l("div", {
					key: e,
					class: "calendar-day-header"
				}, L(e), 1))), 128))]), m(Ft, {
					class: "calendar-scroll",
					ref_key: "dayScrollEl",
					ref: v,
					VerticalScrollMode: "Auto",
					VerticalScrollBarVisibility: "Hidden",
					HorizontalScrollMode: "Disabled",
					HorizontalScrollBarVisibility: "Disabled",
					onViewChanged: Se
				}, {
					default: H(() => [u("div", { style: C({
						height: Q.value + "px",
						position: "relative"
					}) }, [u("div", { style: C({
						position: "absolute",
						top: Z.value + "px",
						left: 0,
						right: 0
					}) }, [u("div", Zi, [(D(!0), l(t, null, j(ae.value, (t) => (D(), l("button", {
						key: t.key,
						class: S(["calendar-day", {
							"out-of-scope": t.outOfScope,
							hidden: t.outOfScope && !e.IsOutOfScopeEnabled,
							today: t.isToday && e.IsTodayHighlighted,
							selected: ye(t)
						}]),
						disabled: !e.IsEnabled,
						onClick: (e) => Ie(t)
					}, [t.showLabel && e.IsGroupLabelVisible ? (D(), l("span", {
						key: 0,
						class: S(["group-label", { "label-accent": xe(t) }])
					}, L(t.labelText), 3)) : c("", !0), u("span", $i, L(t.date), 1)], 10, Qi))), 128))])], 4)], 4)]),
					_: 1
				}, 512)])) : g.value === 1 ? (D(), l("div", ea, [m(Ft, {
					class: "calendar-scroll large-scroll",
					ref_key: "monthScrollEl",
					ref: y,
					VerticalScrollMode: "Auto",
					VerticalScrollBarVisibility: "Hidden",
					HorizontalScrollMode: "Disabled",
					HorizontalScrollBarVisibility: "Disabled",
					onViewChanged: Ce
				}, {
					default: H(() => [u("div", { style: C({
						height: de.value + "px",
						position: "relative"
					}) }, [u("div", { style: C({
						position: "absolute",
						top: ce.value + "px",
						left: 0,
						right: 0
					}) }, [u("div", ta, [(D(!0), l(t, null, j(le.value, (t) => (D(), l("button", {
						key: t.key,
						class: S(["calendar-large-btn", {
							"out-of-scope": t.outOfScope,
							current: t.isTodayMonth,
							selected: $(t)
						}]),
						disabled: !e.IsEnabled,
						onClick: (e) => Pe(t)
					}, [t.showLabel && e.IsGroupLabelVisible ? (D(), l("span", {
						key: 0,
						class: S(["group-label", { "label-accent": be(t) }])
					}, L(t.labelText), 3)) : c("", !0), u("span", null, L(t.text), 1)], 10, na))), 128))])], 4)], 4)]),
					_: 1
				}, 512)])) : (D(), l("div", ra, [m(Ft, {
					class: "calendar-scroll large-scroll",
					ref_key: "yearScrollEl",
					ref: w,
					VerticalScrollMode: "Auto",
					VerticalScrollBarVisibility: "Hidden",
					HorizontalScrollMode: "Disabled",
					HorizontalScrollBarVisibility: "Disabled",
					onViewChanged: we
				}, {
					default: H(() => [u("div", { style: C({
						height: _e.value + "px",
						position: "relative"
					}) }, [u("div", { style: C({
						position: "absolute",
						top: me.value + "px",
						left: 0,
						right: 0
					}) }, [u("div", ia, [(D(!0), l(t, null, j(he.value, (t) => (D(), l("button", {
						key: t.key,
						class: S(["calendar-large-btn", {
							"out-of-scope": t.outOfScope,
							current: t.year === z(f)
						}]),
						disabled: !e.IsEnabled,
						onClick: (e) => Fe(t)
					}, [u("span", null, L(t.year), 1)], 10, aa))), 128))])], 4)], 4)]),
					_: 1
				}, 512)]))]),
				_: 1
			})])
		]));
	}
}, [["__scopeId", "data-v-3ad44fb4"]]), ma = 8, ha = 4, ga = /*#__PURE__*/ dt({
	__name: "CalendarDatePicker",
	props: {
		CalendarIdentifier: {
			type: String,
			default: "GregorianCalendar"
		},
		CalendarViewStyle: {
			type: Object,
			default: null
		},
		Date: {
			type: Date,
			default: null
		},
		DateFormat: {
			type: String,
			default: "shortdate"
		},
		DayOfWeekFormat: {
			type: String,
			default: "{dayofweek.abbreviated(2)}"
		},
		Description: {
			type: String,
			default: ""
		},
		DisplayMode: {
			type: String,
			default: "Month"
		},
		FirstDayOfWeek: {
			type: String,
			default: "Sunday"
		},
		Header: {
			type: String,
			default: ""
		},
		HeaderPlacement: {
			type: String,
			default: "Top"
		},
		HeaderTemplate: {
			type: Object,
			default: null
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		IsCalendarOpen: {
			type: Boolean,
			default: !1
		},
		IsGroupLabelVisible: {
			type: Boolean,
			default: !0
		},
		IsOutOfScopeEnabled: {
			type: Boolean,
			default: !0
		},
		IsTodayHighlighted: {
			type: Boolean,
			default: !0
		},
		LightDismissOverlayMode: {
			type: String,
			default: "Auto"
		},
		MaxDate: {
			type: Date,
			default: () => new globalThis.Date(2120, 11, 31)
		},
		MinDate: {
			type: Date,
			default: () => new globalThis.Date(1920, 0, 1)
		},
		PlaceholderText: {
			type: String,
			default: "Select a date"
		}
	},
	emits: [
		"update:Date",
		"update:IsCalendarOpen",
		"DateChanged",
		"Opened",
		"Closed",
		"CalendarViewDayItemChanging"
	],
	setup(e, { emit: t }) {
		let r = e, i = t, a = A(null), d = A(null), f = A({}), p = A(!1), h = A(!1), g = A(!1), _ = A(null), v = o(() => r.Date ?? _.value), y = o(() => v.value ? [v.value] : []), b = o(() => r.IsCalendarOpen || p.value), w = o(() => v.value ? r.DateFormat === "longdate" ? v.value.toLocaleDateString(void 0, { dateStyle: "long" }) : v.value.toLocaleDateString() : r.PlaceholderText), ee = async () => {
			if (!r.IsEnabled) return;
			if (b.value) {
				T();
				return;
			}
			p.value = !0, h.value = !0, g.value = !1, i("update:IsCalendarOpen", !0), i("Opened"), await x();
			let e = a.value.getBoundingClientRect(), t = d.value?.getBoundingClientRect(), n = t?.width || 304, o = t?.height || 404, s = e.bottom + ha, c = e.top - o - ha, l = s + o <= window.innerHeight - ma, u = c >= ma, m = Math.max(ma, window.innerHeight - o - ma), _ = l ? s : u ? c : Math.min(Math.max(ma, s), m), v = Math.min(Math.max(ma, e.left), Math.max(ma, window.innerWidth - n - ma));
			f.value = {
				top: `${_}px`,
				left: `${v}px`,
				transformOrigin: _ < e.top ? "bottom center" : "top center"
			};
		}, T = () => {
			!h.value || g.value || (p.value = !1, i("update:IsCalendarOpen", !1), g.value = !0);
		}, E = () => {
			g.value && (h.value = !1, g.value = !1, i("Closed"));
		}, O = (e) => {
			let t = v.value, n = e[0] ?? null;
			r.Date === null && (_.value = n), i("update:Date", n), i("DateChanged", {
				oldDate: t,
				newDate: n
			}), T();
		};
		return (t, r) => (D(), l("div", {
			class: "win-calendar-date-picker",
			ref_key: "containerRef",
			ref: a
		}, [
			e.Header ? (D(), s(Rt, {
				key: 0,
				class: "picker-header",
				Text: e.Header
			}, null, 8, ["Text"])) : c("", !0),
			m(Kn, {
				class: "calendar-date-picker-button",
				Padding: "0",
				MinHeight: "32",
				IsEnabled: e.IsEnabled,
				onClick: ee
			}, {
				default: H(() => [u("span", { class: S(["picker-text", { placeholder: !v.value }]) }, L(w.value), 3), r[0] ||= u("span", {
					class: "picker-icon",
					"aria-hidden": "true"
				}, "", -1)]),
				_: 1
			}, 8, ["IsEnabled"]),
			e.Description ? (D(), s(Rt, {
				key: 1,
				class: "picker-description",
				Text: e.Description
			}, null, 8, ["Text"])) : c("", !0),
			(D(), s(n, { to: "body" }, [h.value ? (D(), l("div", {
				key: 0,
				class: "picker-overlay",
				onClick: T
			})) : c("", !0), h.value ? (D(), l("div", {
				key: 1,
				ref_key: "flyoutRef",
				ref: d,
				class: S(["picker-flyout", g.value ? "picker-flyout-closing" : "picker-flyout-animate"]),
				style: C(f.value),
				onAnimationend: E
			}, [m(pa, {
				CalendarIdentifier: e.CalendarIdentifier,
				DayOfWeekFormat: e.DayOfWeekFormat,
				DisplayMode: e.DisplayMode,
				FirstDayOfWeek: e.FirstDayOfWeek,
				IsGroupLabelVisible: e.IsGroupLabelVisible,
				IsEnabled: e.IsEnabled,
				IsOutOfScopeEnabled: e.IsOutOfScopeEnabled,
				IsTodayHighlighted: e.IsTodayHighlighted,
				MinDate: e.MinDate,
				MaxDate: e.MaxDate,
				SelectedDates: y.value,
				SelectionMode: "Single",
				"onUpdate:SelectedDates": O
			}, null, 8, [
				"CalendarIdentifier",
				"DayOfWeekFormat",
				"DisplayMode",
				"FirstDayOfWeek",
				"IsGroupLabelVisible",
				"IsEnabled",
				"IsOutOfScopeEnabled",
				"IsTodayHighlighted",
				"MinDate",
				"MaxDate",
				"SelectedDates"
			])], 38)) : c("", !0)]))
		], 512));
	}
}, [["__scopeId", "data-v-ee513814"]]), _a = ["aria-disabled", "aria-multiselectable"], va = [
	"draggable",
	"tabindex",
	"aria-selected",
	"onClick",
	"onKeydown",
	"onDragstart"
], ya = [
	"draggable",
	"tabindex",
	"aria-selected",
	"onClick",
	"onKeydown",
	"onDragstart"
], ba = /* @__PURE__ */ h({
	__name: "ListView",
	props: {
		ItemsSource: { default: () => [] },
		IsGrouped: {
			type: Boolean,
			default: !1
		},
		IsItemClickEnabled: {
			type: Boolean,
			default: !1
		},
		CanDragItems: {
			type: Boolean,
			default: !1
		},
		CanReorderItems: {
			type: Boolean,
			default: !1
		},
		AllowDrop: {
			type: Boolean,
			default: !1
		},
		AreStickyGroupHeadersEnabled: {
			type: Boolean,
			default: !1
		},
		SelectionMode: { default: "Single" },
		SelectedItems: { default: void 0 },
		SelectedItem: { default: void 0 },
		SelectedIndex: { default: -1 },
		ItemContainerStyle: { default: () => ({}) },
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		Width: { default: "" },
		Height: { default: "" },
		MinWidth: { default: "" },
		MinHeight: { default: "" },
		MaxWidth: { default: "" },
		MaxHeight: { default: "" },
		Margin: { default: "" },
		Padding: { default: "" },
		Background: { default: "" },
		BorderBrush: { default: "" },
		BorderThickness: { default: "" },
		CornerRadius: { default: "" }
	},
	emits: [
		"ItemClick",
		"SelectionChanged",
		"DragItemsStarting",
		"DragItemsCompleted",
		"DragOver",
		"Drop",
		"update:SelectedItems",
		"update:SelectedItem",
		"update:SelectedIndex",
		"update:ItemsSource"
	],
	setup(e, { emit: n }) {
		let r = ne(), i = o(() => !!r.header), a = e, s = n, d = o(() => a.ItemsSource), f = o(() => a.IsGrouped), h = o(() => a.IsItemClickEnabled), g = o(() => a.CanDragItems && a.IsEnabled), _ = o(() => a.CanReorderItems), v = o(() => a.AllowDrop), y = o(() => a.AreStickyGroupHeadersEnabled), b = o(() => a.SelectionMode), w = (e) => e?.Items ?? [], ee = (e, t) => e?.Key ?? t, T = (e) => e?.Key ?? "", E = (e, t) => {
			let n = e;
			return n?.Key ?? n?.Id ?? t;
		}, O = A([]), k = o(() => f.value ? d.value.flatMap((e) => w(e)) : B.value), N = o(() => a.SelectedItems === void 0 ? a.SelectedItem !== void 0 && a.SelectedItem !== null ? [a.SelectedItem] : a.SelectedIndex >= 0 && k.value[a.SelectedIndex] !== void 0 ? [k.value[a.SelectedIndex]] : O.value : a.SelectedItems), P = (e) => e === "" || e == null ? "" : typeof e == "number" || !Number.isNaN(Number(String(e).trim())) ? `${Number(e)}px` : String(e), F = (e) => {
			if (e === "" || e == null) return "";
			let t = String(e).split(",").map((e) => P(e.trim()));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : String(e);
		}, I = (e) => ({
			Left: "flex-start",
			Center: "center",
			Right: "flex-end",
			Stretch: "stretch",
			Top: "flex-start",
			Bottom: "flex-end"
		})[e || ""] || void 0, z = o(() => ({
			width: P(a.Width) || void 0,
			height: P(a.Height) || void 0,
			minWidth: P(a.MinWidth) || void 0,
			minHeight: P(a.MinHeight) || void 0,
			maxWidth: P(a.MaxWidth) || void 0,
			maxHeight: P(a.MaxHeight) || void 0,
			margin: F(a.Margin) || void 0,
			padding: F(a.Padding) || void 0,
			background: a.Background || void 0,
			borderColor: a.BorderBrush || void 0,
			borderWidth: F(a.BorderThickness) || void 0,
			borderStyle: a.BorderThickness !== "" && a.BorderThickness !== 0 ? "solid" : void 0,
			borderRadius: P(a.CornerRadius) || void 0
		})), te = o(() => ({
			height: P(a.ItemContainerStyle.Height) || void 0,
			minHeight: P(a.ItemContainerStyle.MinHeight) || void 0,
			padding: F(a.ItemContainerStyle.Padding) || void 0,
			borderColor: a.ItemContainerStyle.BorderBrush || void 0,
			borderWidth: F(a.ItemContainerStyle.BorderThickness) || void 0,
			borderStyle: a.ItemContainerStyle.BorderThickness !== void 0 && a.ItemContainerStyle.BorderThickness !== 0 ? "solid" : void 0,
			borderRadius: P(a.ItemContainerStyle.CornerRadius) || void 0,
			justifyContent: I(a.ItemContainerStyle.HorizontalContentAlignment),
			alignItems: I(a.ItemContainerStyle.VerticalContentAlignment)
		})), B = A([...d.value]);
		V(d, (e) => {
			B.value = [...e];
			let t = a.IsGrouped ? e.flatMap((e) => w(e)) : e;
			O.value = O.value.filter((e) => t.some((t) => R(t) === R(e)));
		}, { deep: !0 });
		let U = A(), re = A(), K = A([]), q = A(!1), J = A(!1), ie = A([]), Y = A(-1), X = 0, Z = null, ae = 0, Q = [], oe = (e) => {
			let t = R(e);
			return N.value.some((e) => R(e) === t);
		}, se = (e, t = -1) => ({
			selected: oe(e),
			interactive: a.IsEnabled && b.value !== "None",
			"content-stretch": (a.ItemContainerStyle.HorizontalContentAlignment ?? "Stretch") === "Stretch",
			"drag-shrink": t >= 0 && q.value && !ie.value.includes(t),
			"dragging-source": t >= 0 && q.value && ie.value.includes(t)
		}), ce = (e) => {
			let t = N.value, n = e.filter((e) => !t.some((t) => R(t) === R(e))), r = t.filter((t) => !e.some((e) => R(e) === R(t))), i = e[0] ?? null, a = i === null ? -1 : k.value.findIndex((e) => R(e) === R(i));
			O.value = [...e], s("update:SelectedItems", e), s("update:SelectedItem", i), s("update:SelectedIndex", a), s("SelectionChanged", {
				AddedItems: n,
				RemovedItems: r,
				SelectedItems: e
			});
		}, le = (e, t) => {
			if (!a.IsEnabled || q.value) return;
			let n = R(t);
			if (h.value && s("ItemClick", {
				ClickedItem: t,
				OriginalSource: e.target
			}), b.value === "None") return;
			let r = [...N.value], i = k.value.findIndex((e) => R(e) === n);
			if (b.value === "Single") r = [n], Z = i;
			else if (b.value === "Multiple") {
				let e = r.findIndex((e) => R(e) === n);
				e > -1 ? r.splice(e, 1) : r.push(n), Z = i;
			} else if (b.value === "Extended") if (e.ctrlKey) {
				let e = r.findIndex((e) => R(e) === n);
				e > -1 ? r.splice(e, 1) : r.push(n), Z = i;
			} else if (e.shiftKey && Z !== null) {
				let e = i, t = Math.min(Z, e), n = Math.max(Z, e);
				r = k.value.slice(t, n + 1).map((e) => R(e));
			} else r = [n], Z = i;
			ce(r);
		}, ue = (e) => {
			if (!q.value || ie.value.includes(e)) return;
			let t = "scale(0.99)";
			if (Y.value === -1) return { transform: t };
			let n = 0;
			for (let t = 0; t < e; t++) ie.value.includes(t) || n++;
			let r;
			if (Y.value >= d.value.length) r = d.value.length - ie.value.length;
			else {
				r = 0;
				for (let e = 0; e < Y.value; e++) ie.value.includes(e) || r++;
			}
			return n >= r ? { transform: `${t} translateY(${X}px)` } : { transform: t };
		}, de = () => {
			let e = re.value;
			if (!e) return;
			let t = e.querySelectorAll(".win-list-item");
			Q = [], t.forEach((e, t) => {
				let n = e.getBoundingClientRect();
				Q.push({
					index: t,
					midY: n.top + n.height / 2
				});
			});
		}, fe = (e, t) => {
			if (!g.value || f.value) return;
			let n = e.currentTarget;
			n && (X = n.offsetHeight), oe(d.value[t]) && N.value.length > 1 ? ie.value = d.value.map((e, t) => N.value.some((t) => R(t) === R(e)) ? t : -1).filter((e) => e !== -1) : ie.value = [t], s("DragItemsStarting", { Items: ie.value.map((e) => B.value[e]) }), e.dataTransfer && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", "")), requestAnimationFrame(() => {
				q.value = !0, x(() => {
					de();
				});
			});
		}, $ = (e, t) => {
			g.value && e.dataTransfer && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", ""));
		}, pe = (e) => {
			if (!v.value || f.value || q.value && !_.value) return;
			q.value || (J.value = !0), e.dataTransfer && (e.dataTransfer.dropEffect = "move"), s("DragOver", {
				DataTransfer: e.dataTransfer,
				AcceptedOperation: "Move",
				OriginalSource: e.target
			});
			let t = Date.now();
			if (t - ae < 40) return;
			ae = t;
			let n = e.clientY;
			Q.length === 0 && de();
			let r = Q.filter((e) => !ie.value.includes(e.index));
			if (r.length === 0) return;
			let i = d.value.length;
			for (let e = 0; e < r.length; e++) if (n < r[e].midY) {
				i = r[e].index;
				break;
			}
			let a = [...ie.value].sort((e, t) => e - t), o = a[0], c = a[a.length - 1];
			if (c - o + 1 === a.length && i >= o && i <= c + 1) {
				Y.value !== -1 && (Y.value = -1);
				return;
			}
			i !== Y.value && (Y.value = i);
		}, me = (e) => {
			let t = re.value;
			if (!t) return;
			let n = e.relatedTarget;
			n instanceof Node && t.contains(n) || (Y.value = -1, J.value = !1);
		}, he = (e) => {
			if (J.value && !q.value) {
				let t = Y.value < 0 ? B.value.length : Y.value;
				s("Drop", {
					DataTransfer: e.dataTransfer,
					AcceptedOperation: "Move",
					InsertIndex: t,
					OriginalSource: e.target
				}), ge();
				return;
			}
			if (!_.value || !q.value || Y.value === -1) {
				ge();
				return;
			}
			let t = ie.value.sort((e, t) => e - t).map((e) => B.value[e]), n = B.value.filter((e, t) => !ie.value.includes(t)), r;
			if (Y.value >= B.value.length) r = n.length;
			else {
				r = 0;
				for (let e = 0; e < Y.value; e++) ie.value.includes(e) || r++;
			}
			let i = [...n];
			i.splice(r, 0, ...t), B.value = i, s("update:ItemsSource", i), s("Drop", {
				DataTransfer: e.dataTransfer,
				AcceptedOperation: "Move",
				InsertIndex: r,
				OriginalSource: e.target
			}), s("DragItemsCompleted", {
				Items: t,
				DropResult: "Move"
			}), ge();
		}, ge = () => {
			q.value = !1, J.value = !1, ie.value = [], Y.value = -1, Q = [];
		}, _e = () => {
			ge();
		};
		return (n, r) => (D(), l("div", {
			ref_key: "containerRef",
			ref: U,
			class: S(["win-list-view", { disabled: !e.IsEnabled }]),
			style: C(z.value),
			role: "listbox",
			"aria-disabled": !e.IsEnabled,
			"aria-multiselectable": e.SelectionMode === "Multiple" || e.SelectionMode === "Extended"
		}, [m(Ft, {
			class: "win-list-viewport",
			VerticalScrollMode: "Auto",
			VerticalScrollBarVisibility: "Auto",
			HorizontalScrollMode: "Disabled",
			HorizontalScrollBarVisibility: "Disabled"
		}, {
			default: H(() => [u("div", {
				ref_key: "listRef",
				ref: re,
				class: "win-list-content",
				onDragover: G(pe, ["prevent"]),
				onDrop: G(he, ["prevent"]),
				onDragleave: me
			}, [f.value ? (D(!0), l(t, { key: 0 }, j(d.value, (i, a) => (D(), l("div", {
				key: ee(i, a),
				class: "win-list-group"
			}, [u("div", { class: S(["win-list-header", { sticky: y.value }]) }, [M(n.$slots, "header", { group: i }, () => [p(L(T(i)), 1)])], 2), (D(!0), l(t, null, j(w(i), (t, o) => (D(), l("div", {
				key: E(t, o),
				class: S(["win-list-item", se(t)]),
				style: C(te.value),
				draggable: g.value,
				tabindex: e.IsEnabled && e.SelectionMode !== "None" ? 0 : -1,
				"aria-selected": e.SelectionMode === "None" ? void 0 : oe(t),
				onClick: (e) => le(e, t),
				onKeydown: [W(G((e) => le(e, t), ["prevent"]), ["enter"]), W(G((e) => le(e, t), ["prevent"]), ["space"])],
				onDragstart: (e) => $(e, {
					gIdx: a,
					idx: o
				}),
				onDragover: r[0] ||= G(() => {}, ["prevent"]),
				onDrop: r[1] ||= G(() => {}, ["prevent"])
			}, [
				b.value === "Multiple" ? (D(), l("span", {
					key: 0,
					class: S(["list-selection-box", { checked: oe(t) }]),
					"aria-hidden": "true"
				}, "", 2)) : c("", !0),
				M(n.$slots, "item", {
					item: t,
					index: o,
					group: i
				}),
				b.value === "Single" || b.value === "Extended" ? (D(), l("div", {
					key: 1,
					class: S(["win-list-view-selection-indicator", { active: oe(t) }]),
					"aria-hidden": "true"
				}, null, 2)) : c("", !0)
			], 46, va))), 128))]))), 128)) : (D(), l(t, { key: 1 }, [i.value ? (D(), l("div", {
				key: 0,
				class: S(["win-list-header", { sticky: y.value }])
			}, [M(n.$slots, "header")], 2)) : c("", !0), (D(!0), l(t, null, j(B.value, (t, r) => (D(), l("div", {
				key: E(t, r),
				ref_for: !0,
				ref_key: "itemEls",
				ref: K,
				class: S(["win-list-item", se(t, r)]),
				style: C([te.value, ue(r)]),
				draggable: g.value,
				tabindex: e.IsEnabled && e.SelectionMode !== "None" ? 0 : -1,
				"aria-selected": e.SelectionMode === "None" ? void 0 : oe(t),
				onClick: (e) => le(e, t),
				onKeydown: [W(G((e) => le(e, t), ["prevent"]), ["enter"]), W(G((e) => le(e, t), ["prevent"]), ["space"])],
				onDragstart: (e) => fe(e, r),
				onDragend: _e
			}, [
				b.value === "Multiple" ? (D(), l("span", {
					key: 0,
					class: S(["list-selection-box", { checked: oe(t) }]),
					"aria-hidden": "true"
				}, "", 2)) : c("", !0),
				M(n.$slots, "item", {
					item: t,
					index: r
				}),
				b.value === "Single" || b.value === "Extended" ? (D(), l("div", {
					key: 1,
					class: S(["win-list-view-selection-indicator", { active: oe(t) }]),
					"aria-hidden": "true"
				}, null, 2)) : c("", !0)
			], 46, ya))), 128))], 64))], 544)]),
			_: 3
		})], 14, _a));
	}
}), xa = {
	key: 0,
	class: "win-grid-groups"
}, Sa = ["onClick"], Ca = { class: "win-grid-view-inner win-grid-group-items" }, wa = ["onClick"], Ta = { class: "grid-item-inner" }, Ea = [
	"draggable",
	"onClick",
	"onDragstart",
	"onDragend"
], Da = { class: "grid-item-inner" }, Oa = {
	key: 1,
	class: "drag-count-badge"
}, ka = /* @__PURE__ */ h({
	__name: "GridView",
	props: {
		ItemsSource: {
			type: Array,
			default: null
		},
		IsItemClickEnabled: {
			type: Boolean,
			default: void 0
		},
		CanDragItems: {
			type: Boolean,
			default: void 0
		},
		CanReorderItems: {
			type: Boolean,
			default: void 0
		},
		AllowDrop: {
			type: Boolean,
			default: void 0
		},
		SelectionMode: {
			type: String,
			default: void 0
		},
		SelectedItems: {
			type: Array,
			default: null
		},
		items: {
			type: Array,
			default: () => []
		},
		isItemClickEnabled: {
			type: Boolean,
			default: !0
		},
		canDragItems: {
			type: Boolean,
			default: !1
		},
		canReorderItems: {
			type: Boolean,
			default: !1
		},
		allowDrop: {
			type: Boolean,
			default: !1
		},
		selectionMode: {
			type: String,
			default: "Single"
		},
		selectedItems: {
			type: Array,
			default: () => []
		}
	},
	emits: [
		"ItemClick",
		"SelectionChanged",
		"DragItemsStarting",
		"DragItemsCompleted",
		"itemClick",
		"selectionChanged",
		"update:SelectedItems",
		"update:selectedItems",
		"reorder"
	],
	setup(e, { expose: n, emit: r }) {
		let i = e, d = r, f = A(null), h = A(null), g = A(!1), _ = A([]), v = A(-1), y = A(-1), b = A(0), w = A(0), ee = null, T = 0, E = [], O = /* @__PURE__ */ new Map(), k = ne(), N = o(() => i.ItemsSource ?? i.items), P = o(() => !!k.groupHeader && N.value.some((e) => Array.isArray(e?.Items) || Array.isArray(e?.items))), F = o(() => i.IsItemClickEnabled ?? i.isItemClickEnabled), I = o(() => i.CanDragItems ?? i.canDragItems), R = o(() => i.CanReorderItems ?? i.canReorderItems), z = o(() => i.AllowDrop ?? i.allowDrop), te = o(() => i.SelectionMode ?? i.selectionMode), B = o(() => i.SelectedItems ?? i.selectedItems), V = (e, t) => e.id || e.title || e.Title || t, U = (e) => e?.Items ?? e?.items ?? [], W = (e, t) => e?.id || e?.key || e?.title || e?.Title || t, re = (e) => e?.title || e?.Title || e?.key || "", K = (e) => B.value.includes(e), q = (e, t) => {
			t ? O.set(e, t) : O.delete(e);
		}, J = (e) => {
			let t = O.get(e);
			if (!t) return !1;
			let n = t.closest(".win-scroll-viewer-viewport");
			if (n instanceof HTMLElement) {
				let e = t.getBoundingClientRect(), r = n.getBoundingClientRect(), i = n.scrollTop + e.top - r.top, a = Math.max(0, n.scrollHeight - n.clientHeight);
				return n.scrollTop = Math.max(0, Math.min(a, i)), !0;
			}
			return !1;
		}, ie = (e, t) => {
			e.currentTarget.dispatchEvent(new CustomEvent("semanticzoomrequest", {
				bubbles: !0,
				detail: {
					Item: t,
					OriginalSource: e.currentTarget
				}
			}));
		}, Y = (e) => {
			d("update:SelectedItems", e), d("update:selectedItems", e), d("SelectionChanged", {
				AddedItems: e,
				RemovedItems: [],
				SelectedItems: e
			}), d("selectionChanged", e);
		}, X = (e, t) => {
			let n = [...B.value], r = n.indexOf(t);
			e && r === -1 ? n.push(t) : !e && r > -1 && n.splice(r, 1), Y(n);
		}, Z = (e, t, n) => {
			if (te.value === "None") {
				F.value && (d("ItemClick", {
					ClickedItem: t,
					OriginalSource: e.target
				}), d("itemClick", {
					ClickedItem: t,
					OriginalSource: e.target
				}));
				return;
			}
			if (te.value === "Single") {
				F.value && (d("ItemClick", {
					ClickedItem: t,
					OriginalSource: e.target
				}), d("itemClick", {
					ClickedItem: t,
					OriginalSource: e.target
				})), Y([t]), ee = n;
				return;
			}
			if (te.value === "Multiple") {
				let n = [...B.value], r = n.indexOf(t);
				r > -1 ? n.splice(r, 1) : n.push(t), Y(n), F.value && (d("ItemClick", {
					ClickedItem: t,
					OriginalSource: e.target
				}), d("itemClick", {
					ClickedItem: t,
					OriginalSource: e.target
				}));
				return;
			}
			if (te.value === "Extended") {
				let r = [...B.value];
				if (e.ctrlKey) {
					let e = r.indexOf(t);
					e > -1 ? r.splice(e, 1) : r.push(t), ee = n;
				} else if (e.shiftKey && ee !== null) {
					let e = Math.min(ee, n), t = Math.max(ee, n);
					r = N.value.slice(e, t + 1);
				} else r = [t], ee = n;
				Y(r), F.value && (d("ItemClick", {
					ClickedItem: t,
					OriginalSource: e.target
				}), d("itemClick", {
					ClickedItem: t,
					OriginalSource: e.target
				}));
			}
		}, ae = () => {
			let e = h.value?.$el || h.value;
			if (!e) return;
			let t = Array.from(e.querySelectorAll(".win-grid-item:not(.dragging-source)")), n = [];
			for (let e = 0; e < N.value.length; e++) _.value.includes(e) || n.push(e);
			E = [];
			for (let e = 0; e < Math.min(n.length, t.length); e++) E.push({
				itemIndex: n[e],
				rect: t[e].getBoundingClientRect()
			});
		}, Q = (e, t) => {
			if (E.length === 0) return -1;
			let n = E, r = [], i = -Infinity;
			for (let e of n) Math.abs(e.rect.top - i) > e.rect.height * .4 && (r.push([]), i = e.rect.top), r[r.length - 1].push(e);
			let a = null;
			for (let e of r) {
				let n = Math.min(...e.map((e) => e.rect.top)), r = Math.max(...e.map((e) => e.rect.bottom));
				if (t >= n && t <= r) {
					a = e;
					break;
				}
			}
			if (!a) if (r.length > 0 && t < r[0][0].rect.top) a = r[0];
			else if (r.length > 0) a = r[r.length - 1];
			else return -1;
			for (let t = 0; t < a.length; t++) {
				let n = a[t];
				if (e < n.rect.left + n.rect.width / 2) return n.itemIndex;
			}
			return N.value.length;
		}, oe = (e) => {
			if (!g.value || y.value === -1 || _.value.includes(e) || y.value >= N.value.length) return !1;
			let t = 0;
			for (let n = 0; n < e; n++) _.value.includes(n) || t++;
			let n = 0;
			for (let e = 0; e < y.value; e++) _.value.includes(e) || n++;
			return t === n && !_.value.includes(e);
		}, se = o(() => {
			let e = [];
			for (let t = 0; t < N.value.length; t++) oe(t) && e.push({
				type: "placeholder",
				key: "ph"
			}), e.push({
				type: "item",
				key: "item-" + V(N.value[t], t),
				item: N.value[t],
				index: t
			});
			return g.value && y.value !== -1 && y.value >= N.value.length && e.push({
				type: "placeholder",
				key: "ph"
			}), e;
		}), ce = (e, t) => {
			if (!I.value) return;
			let n = e.currentTarget;
			n && (b.value = n.offsetWidth, w.value = n.offsetHeight), K(N.value[t]) && B.value.length > 1 ? _.value = N.value.map((e, t) => B.value.includes(e) ? t : -1).filter((e) => e !== -1) : _.value = [t], v.value = t, y.value = -1, d("DragItemsStarting", { Items: _.value.map((e) => N.value[e]) }), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", ""), requestAnimationFrame(() => {
				g.value = !0, x(() => {
					ae();
				});
			});
		}, le = (e) => {
			if (!R.value || !z.value) return;
			e.dataTransfer.dropEffect = "move";
			let t = Date.now();
			if (t - T < 50) return;
			T = t;
			let n = Q(e.clientX, e.clientY);
			if (n === y.value || n === -1) return;
			let r = [..._.value].sort((e, t) => e - t), i = r[0], a = r[r.length - 1], o = !0;
			for (let e = i; e <= a; e++) if (!_.value.includes(e)) {
				o = !1;
				break;
			}
			if (o && n >= i && n <= a + 1) {
				y.value !== -1 && (y.value = -1);
				return;
			}
			y.value = n;
		}, ue = (e) => {
			if (!f.value) return;
			let t = e.relatedTarget;
			t && f.value.contains(t) || (y.value = -1);
		}, de = (e) => {
			!R.value || !g.value || (e.preventDefault(), fe());
		}, fe = () => {
			if (_.value.length === 0 || y.value === -1) {
				$();
				return;
			}
			let e = _.value.map((e) => N.value[e]), t = N.value.filter((e, t) => !_.value.includes(t)), n;
			if (y.value >= N.value.length) n = t.length;
			else {
				let e = N.value[y.value];
				n = t.indexOf(e), n === -1 && (n = t.length);
			}
			let r = [...t];
			r.splice(n, 0, ...e), $(), d("DragItemsCompleted", {
				Items: e,
				DropResult: "Move"
			}), d("reorder", r);
		}, $ = () => {
			g.value = !1, _.value = [], v.value = -1, y.value = -1, E = [];
		}, pe = () => {
			$();
		};
		return n({ ScrollIntoGroup: J }), (e, n) => (D(), l("div", {
			class: "win-grid-view",
			ref_key: "containerRef",
			ref: f,
			onDragover: G(le, ["prevent"]),
			onDrop: de,
			onDragleave: ue
		}, [P.value ? (D(), l("div", xa, [(D(!0), l(t, null, j(N.value, (r, i) => (D(), l("section", {
			key: W(r, i),
			ref_for: !0,
			ref: (e) => q(r, e),
			class: "win-grid-group"
		}, [u("button", {
			class: "win-grid-group-header",
			type: "button",
			onClick: (e) => ie(e, r)
		}, [M(e.$slots, "groupHeader", {
			group: r,
			index: i
		}, () => [p(L(re(r)), 1)]), n[2] ||= u("span", {
			class: "win-grid-group-divider",
			"aria-hidden": "true"
		}, null, -1)], 8, Sa), u("div", Ca, [(D(!0), l(t, null, j(U(r), (t, n) => (D(), l("div", {
			key: "group-" + i + "-" + V(t, n),
			class: S(["win-grid-item", {
				selected: K(t),
				clickEnabled: F.value
			}]),
			onClick: (e) => Z(e, t, n)
		}, [u("div", Ta, [M(e.$slots, "item", {
			item: t,
			index: n,
			group: r
		})])], 10, wa))), 128))])]))), 128))])) : (D(), s(a, {
			key: 1,
			name: "grid-flip",
			tag: "div",
			class: "win-grid-view-inner",
			ref_key: "innerRef",
			ref: h
		}, {
			default: H(() => [(D(!0), l(t, null, j(se.value, (r) => (D(), l("div", {
				key: r.key,
				class: S(r.type === "placeholder" ? "win-grid-drop-placeholder" : {
					"win-grid-item": !0,
					selected: K(r.item),
					clickEnabled: F.value && !g.value,
					"drag-shrink": g.value && !_.value.includes(r.index),
					"dragging-source": g.value && _.value.includes(r.index)
				}),
				style: C(r.type === "placeholder" ? {
					width: b.value + "px",
					height: w.value + "px"
				} : void 0),
				draggable: r.type === "item" ? I.value : !1,
				onClick: (e) => r.type === "item" ? Z(e, r.item, r.index) : null,
				onDragstart: (e) => r.type === "item" ? ce(e, r.index) : null,
				onDragend: (e) => r.type === "item" ? pe() : null
			}, [r.type === "item" ? (D(), l(t, { key: 0 }, [
				te.value === "Multiple" || te.value === "Extended" ? (D(), l("div", {
					key: 0,
					class: "grid-checkbox",
					onClick: n[0] ||= G(() => {}, ["stop"]),
					onMousedown: n[1] ||= G(() => {}, ["stop"])
				}, [m(vr, {
					modelValue: K(r.item),
					"onUpdate:modelValue": (e) => X(e, r.item)
				}, null, 8, ["modelValue", "onUpdate:modelValue"])], 32)) : c("", !0),
				u("div", Da, [M(e.$slots, "item", {
					item: r.item,
					index: r.index
				})]),
				g.value && r.index === v.value && _.value.length > 1 ? (D(), l("div", Oa, L(_.value.length), 1)) : c("", !0)
			], 64)) : c("", !0)], 46, Ea))), 128))]),
			_: 3
		}, 512))], 544));
	}
}), Aa = { class: "icon flip-arrow" }, ja = { class: "icon flip-arrow" }, Ma = {
	__name: "FlipView",
	props: {
		ItemsSource: {
			type: Array,
			default: null
		},
		SelectedIndex: {
			type: Number,
			default: void 0
		},
		SelectedItem: {
			type: [
				Object,
				String,
				Number,
				Boolean
			],
			default: void 0
		},
		Orientation: {
			type: String,
			default: void 0
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		items: {
			type: Array,
			default: () => []
		},
		orientation: {
			type: String,
			default: "horizontal"
		}
	},
	emits: [
		"SelectionChanged",
		"update:SelectedIndex",
		"update:SelectedItem"
	],
	setup(e, { emit: n }) {
		let r = e, i = n, a = A(!1), s = A(0), c = 0, d = o(() => r.ItemsSource ?? r.items), f = o(() => r.Orientation ?? r.orientation), p = o(() => String(f.value).toLowerCase()), m = o(() => r.SelectedIndex ?? s.value);
		function h(e, t) {
			return e?.id ?? e?.title ?? e?.alt ?? t;
		}
		function g(e) {
			let t = Math.max(0, Math.min(d.value.length - 1, e));
			if (t === m.value) return;
			let n = d.value[m.value], r = d.value[t];
			s.value = t, i("update:SelectedIndex", t), i("update:SelectedItem", r), i("SelectionChanged", {
				AddedItems: r === void 0 ? [] : [r],
				RemovedItems: n === void 0 ? [] : [n],
				SelectedIndex: t,
				SelectedItem: r
			});
		}
		function _() {
			r.IsEnabled && m.value > 0 && g(m.value - 1);
		}
		function v() {
			r.IsEnabled && m.value < d.value.length - 1 && g(m.value + 1);
		}
		function y(e) {
			if (!r.IsEnabled) return;
			let t = p.value === "vertical" ? e.deltaY : e.deltaX || e.deltaY;
			t > 0 ? v() : t < 0 && _();
		}
		function b(e) {
			let t = e.touches[0];
			r.IsEnabled && (c = p.value === "vertical" ? t.clientY : t.clientX);
		}
		function x(e) {
			let t = e.changedTouches[0];
			if (!r.IsEnabled) return;
			let n = p.value === "vertical" ? t.clientY : t.clientX, i = c - n;
			i > 30 ? v() : i < -30 && _();
		}
		let w = o(() => p.value === "vertical" ? { transform: `translateY(-${m.value * 100}%)` } : { transform: `translateX(-${m.value * 100}%)` });
		return (e, n) => (D(), l("div", {
			class: S(["win-flip-view", p.value]),
			onMouseenter: n[0] ||= (e) => a.value = !0,
			onMouseleave: n[1] ||= (e) => a.value = !1,
			onWheel: G(y, ["prevent"]),
			onTouchstart: b,
			onTouchend: x
		}, [
			u("div", {
				class: "flip-view-track",
				style: C(w.value)
			}, [(D(!0), l(t, null, j(d.value, (t, n) => (D(), l("div", {
				key: h(t, n),
				class: "flip-view-item"
			}, [M(e.$slots, "item", { item: t })]))), 128))], 4),
			U(u("button", {
				class: "flip-btn prev",
				onClick: _
			}, [u("span", Aa, L(p.value === "vertical" ? "" : ""), 1)], 512), [[B, a.value && m.value > 0]]),
			U(u("button", {
				class: "flip-btn next",
				onClick: v
			}, [u("span", ja, L(p.value === "vertical" ? "" : ""), 1)], 512), [[B, a.value && m.value < d.value.length - 1]])
		], 34));
	}
}, Na = [
	"data-index",
	"aria-selected",
	"onClick",
	"onDblclick",
	"onKeydown"
], Pa = /*#__PURE__*/ dt({
	__name: "ItemsView",
	props: {
		ItemsSource: {
			type: Array,
			default: () => []
		},
		ItemTemplate: {
			type: [
				String,
				Object,
				Function
			],
			default: void 0
		},
		Layout: {
			type: [String, Object],
			default: "StackLayout"
		},
		SelectionMode: {
			type: String,
			default: "None",
			validator: (e) => [
				"None",
				"Single",
				"Multiple",
				"Extended"
			].includes(e)
		},
		SelectedItem: {
			type: null,
			default: void 0
		},
		SelectedItems: {
			type: Array,
			default: () => []
		},
		IsItemInvokedEnabled: {
			type: Boolean,
			default: !1
		}
	},
	emits: [
		"ItemInvoked",
		"SelectionChanged",
		"update:SelectedItem",
		"update:SelectedItems"
	],
	setup(e, { emit: n }) {
		let r = e, i = n, a = A(null), d = A(-1), f = o(() => r.ItemsSource ?? []), p = o(() => {
			let e = r.Layout, t = typeof e == "object" && e ? e : { Type: e };
			return {
				Type: t.Type ?? t.type ?? "StackLayout",
				Orientation: t.Orientation ?? t.orientation ?? "Vertical",
				Spacing: Number(t.Spacing ?? t.spacing ?? t.LineSpacing ?? t.lineSpacing ?? 0),
				MinItemWidth: Number(t.MinItemWidth ?? t.minItemWidth ?? t.ItemWidth ?? t.itemWidth ?? 150),
				MinItemHeight: Number(t.MinItemHeight ?? t.minItemHeight ?? t.ItemHeight ?? t.itemHeight ?? 80),
				MinRowSpacing: Number(t.MinRowSpacing ?? t.minRowSpacing ?? t.LineSpacing ?? t.lineSpacing ?? 0),
				MinColumnSpacing: Number(t.MinColumnSpacing ?? t.minColumnSpacing ?? t.MinItemSpacing ?? t.minItemSpacing ?? 0),
				MaximumRowsOrColumns: Number(t.MaximumRowsOrColumns ?? t.maximumRowsOrColumns ?? 0),
				LineHeight: Number(t.LineHeight ?? t.lineHeight ?? 160)
			};
		}), h = o(() => {
			let e = p.value;
			return [`layout-${e.Type.toLowerCase()}`, e.Orientation === "Horizontal" ? "orientation-horizontal" : "orientation-vertical"];
		}), g = o(() => {
			let e = p.value, t = {
				"--items-view-spacing": `${e.Spacing}px`,
				"--items-view-min-item-width": `${e.MinItemWidth}px`,
				"--items-view-min-item-height": `${e.MinItemHeight}px`,
				"--items-view-row-spacing": `${e.MinRowSpacing}px`,
				"--items-view-column-spacing": `${e.MinColumnSpacing}px`,
				"--items-view-line-height": `${e.LineHeight}px`
			};
			return e.MaximumRowsOrColumns > 0 && (t["--items-view-grid-template"] = `repeat(${e.MaximumRowsOrColumns}, max-content)`), t;
		}), _ = o(() => r.SelectionMode === "Single" ? r.SelectedItem === void 0 ? r.SelectedItems : [r.SelectedItem] : r.SelectedItems), v = o(() => r.SelectionMode === "Multiple" || r.SelectionMode === "Extended"), y = (e, t) => R(e) === R(t), b = (e) => _.value.some((t) => y(t, e)), x = (e, t) => e && typeof e == "object" ? e.Id ?? e.ID ?? e.id ?? e.Key ?? e.key ?? e.Title ?? e.title ?? t : t, w = (e, t) => {
			let n = _.value, r = e.filter((e) => !n.some((t) => y(t, e))), a = n.filter((t) => !e.some((e) => y(e, t)));
			i("update:SelectedItems", e), i("update:SelectedItem", e[0] ?? null), i("SelectionChanged", {
				AddedItems: r,
				RemovedItems: a,
				SelectedItems: e,
				OriginalSource: t
			});
		}, ee = (e, t, n, i = void 0) => {
			if (r.SelectionMode === "None") return;
			if (r.SelectionMode === "Single") {
				d.value = n, w([t], e?.target);
				return;
			}
			let a = [..._.value], o = a.findIndex((e) => y(e, t));
			if (r.SelectionMode === "Multiple") {
				i === !0 || i === void 0 && o === -1 ? o === -1 && a.push(t) : o !== -1 && a.splice(o, 1), d.value = n, w(a, e?.target);
				return;
			}
			if (e?.shiftKey && d.value !== -1) {
				let e = Math.min(d.value, n), t = Math.max(d.value, n);
				a = f.value.slice(e, t + 1);
			} else e?.ctrlKey || i !== void 0 ? (i === !0 || i === void 0 && o === -1 ? o === -1 && a.push(t) : o !== -1 && a.splice(o, 1), d.value = n) : (a = [t], d.value = n);
			w(a, e?.target);
		}, T = (e, t, n) => ee(e, t, n), E = (e, t, n) => ee({ target: a.value }, t, n, e === !0), O = (e, t, n) => {
			r.IsItemInvokedEnabled && i("ItemInvoked", {
				InvokedItem: t,
				OriginalSource: e?.target,
				Index: n
			});
		};
		return V(() => r.SelectionMode, () => {
			d.value = -1;
		}), (n, r) => (D(), s(Ft, {
			ref_key: "rootRef",
			ref: a,
			class: "win-items-view",
			role: "listbox",
			VerticalScrollMode: "Auto",
			VerticalScrollBarVisibility: "Auto",
			HorizontalScrollMode: "Auto",
			HorizontalScrollBarVisibility: "Auto"
		}, {
			default: H(() => [u("div", {
				class: S(["win-items-view-layout", h.value]),
				style: C(g.value)
			}, [(D(!0), l(t, null, j(f.value, (t, i) => (D(), l("div", {
				key: x(t, i),
				class: S(["win-items-view-item", {
					selected: b(t),
					invokable: e.IsItemInvokedEnabled
				}]),
				"data-index": i,
				"aria-selected": b(t),
				tabindex: 0,
				role: "option",
				onClick: (e) => T(e, t, i),
				onDblclick: (e) => O(e, t, i),
				onKeydown: [W(G((e) => O(e, t, i), ["prevent"]), ["enter"]), W(G((e) => T(e, t, i), ["prevent"]), ["space"])]
			}, [v.value ? (D(), s(vr, {
				key: 0,
				class: "selection-checkbox",
				IsChecked: b(t),
				"onUpdate:IsChecked": (e) => E(e, t, i),
				onClick: r[0] ||= G(() => {}, ["stop"]),
				onKeydown: r[1] ||= G(() => {}, ["stop"])
			}, null, 8, ["IsChecked", "onUpdate:IsChecked"])) : c("", !0), M(n.$slots, "item", {
				item: t,
				index: i
			}, () => [M(n.$slots, "default", {
				item: t,
				index: i
			}, () => [m(Rt, { Text: String(t) }, null, 8, ["Text"])], !0)], !0)], 42, Na))), 128))], 6)]),
			_: 3
		}, 512));
	}
}, [["__scopeId", "data-v-6b813d06"]]), Fa = ["data-index"], Ia = /*#__PURE__*/ dt({
	__name: "ItemsRepeater",
	props: {
		ItemsSource: {
			type: [Array, Object],
			default: () => []
		},
		ItemTemplate: {
			type: [
				String,
				Object,
				Function
			],
			default: void 0
		},
		Layout: {
			type: [String, Object],
			default: "StackLayout"
		},
		HorizontalAlignment: {
			type: String,
			default: "Stretch"
		},
		VerticalAlignment: {
			type: String,
			default: "Top"
		},
		Margin: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: void 0
		}
	},
	emits: [
		"ElementPrepared",
		"ElementClearing",
		"ElementIndexChanged",
		"GettingFocus",
		"KeyDown"
	],
	setup(e, { expose: n, emit: r }) {
		let i = e, a = r, s = A(null), c = o(() => {
			let e = i.ItemsSource;
			if (Array.isArray(e)) return {
				Count: e.length,
				GetAt: (t) => e[t],
				IndexOf: (t) => e.indexOf(t),
				Source: e
			};
			if (e && typeof e == "object") {
				let t = e.Count ?? e.count ?? 0, n = e.GetAt ?? e.getAt;
				return {
					Count: t,
					GetAt: (t) => n?.call(e, t),
					IndexOf: (t) => e.IndexOf?.(t) ?? e.indexOf?.(t) ?? -1,
					Source: e
				};
			}
			return {
				Count: 0,
				GetAt: () => void 0,
				IndexOf: () => -1,
				Source: []
			};
		}), u = o(() => {
			let e = c.value;
			return Array.from({ length: e.Count }, (t, n) => e.GetAt(n));
		}), d = o(() => {
			let e = i.Layout, t = typeof e == "object" && e ? e : { Type: e };
			return {
				Type: t.Type ?? t.type ?? t.Name ?? t.name ?? "StackLayout",
				Orientation: t.Orientation ?? t.orientation ?? "Vertical",
				Spacing: Number(t.Spacing ?? t.spacing ?? 0),
				MinItemWidth: Number(t.MinItemWidth ?? t.minItemWidth ?? t.ItemWidth ?? t.itemWidth ?? 120),
				MinItemHeight: Number(t.MinItemHeight ?? t.minItemHeight ?? t.ItemHeight ?? t.itemHeight ?? 80),
				MinRowSpacing: Number(t.MinRowSpacing ?? t.minRowSpacing ?? t.RowSpacing ?? t.rowSpacing ?? t.Spacing ?? 0),
				MinColumnSpacing: Number(t.MinColumnSpacing ?? t.minColumnSpacing ?? t.ColumnSpacing ?? t.columnSpacing ?? t.Spacing ?? 0),
				MaximumRowsOrColumns: Number(t.MaximumRowsOrColumns ?? t.maximumRowsOrColumns ?? 0)
			};
		}), f = o(() => {
			let e = d.value;
			return [`layout-${e.Type.toLowerCase()}`, e.Orientation === "Horizontal" ? "orientation-horizontal" : "orientation-vertical"];
		}), p = (e) => {
			if (!(e == null || e === "")) return typeof e == "number" || /^[0-9.]+$/.test(String(e)) ? `${e}px` : String(e);
		}, h = (e) => {
			if (e == null || e === "") return;
			let t = String(e).split(",").map((e) => p(e.trim()));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : String(e);
		}, g = o(() => {
			let e = d.value, t = {
				"--items-repeater-spacing": `${e.Spacing}px`,
				"--items-repeater-min-item-width": `${e.MinItemWidth}px`,
				"--items-repeater-min-item-height": `${e.MinItemHeight}px`,
				"--items-repeater-row-spacing": `${e.MinRowSpacing}px`,
				"--items-repeater-column-spacing": `${e.MinColumnSpacing}px`
			}, n = e.MaximumRowsOrColumns;
			return n > 0 && (t["--items-repeater-grid-template"] = `repeat(${n}, minmax(${e.MinItemWidth}px, 1fr))`), i.Margin && (t.margin = h(i.Margin)), i.MaxWidth !== void 0 && (t.maxWidth = p(i.MaxWidth)), i.HorizontalAlignment === "Left" && (t.justifyItems = "start"), i.HorizontalAlignment === "Center" && (t.justifyItems = "center"), i.HorizontalAlignment === "Right" && (t.justifyItems = "end"), i.VerticalAlignment === "Center" && (t.alignItems = "center"), i.VerticalAlignment === "Bottom" && (t.alignItems = "end"), t;
		}), _ = (e, t) => e && typeof e == "object" ? e.Id ?? e.ID ?? e.id ?? e.Key ?? e.key ?? t : t, v = (e) => {
			let t = e?.dataset?.index;
			return t === void 0 ? -1 : Number(t);
		}, y = (e) => s.value?.querySelector(`[data-index="${e}"]`) ?? null, b = (e) => y(e), ee = (e) => a("GettingFocus", e), T = (e) => a("KeyDown", e);
		return V(u, async (e, t) => {
			t?.length && t.forEach((t, n) => {
				e.includes(t) || a("ElementClearing", {
					Element: y(n),
					Index: n
				});
			}), await x(), e.forEach((e, t) => {
				a("ElementPrepared", {
					Element: y(t),
					Index: t,
					Data: e
				});
			});
		}, { immediate: !0 }), w(() => {
			u.value.forEach((e, t) => {
				a("ElementClearing", {
					Element: y(t),
					Index: t,
					Data: e
				});
			});
		}), n({
			ItemsSourceView: c,
			GetElementIndex: v,
			TryGetElement: y,
			GetOrCreateElement: b
		}), (e, n) => (D(), l("div", {
			ref_key: "rootRef",
			ref: s,
			class: S(["win-items-repeater", f.value]),
			style: C(g.value),
			role: "list"
		}, [(D(!0), l(t, null, j(u.value, (t, n) => (D(), l("div", {
			key: _(t, n),
			class: "win-items-repeater-element",
			"data-index": n,
			role: "listitem",
			onFocusin: ee,
			onKeydown: T
		}, [M(e.$slots, "default", {
			item: t,
			index: n
		}, () => [m(Rt, { Text: String(t) }, null, 8, ["Text"])], !0)], 40, Fa))), 128))], 6));
	}
}, [["__scopeId", "data-v-9cc4dd90"]]), La = [
	"draggable",
	"onDragstart",
	"onDragover",
	"onDragleave",
	"onDrop",
	"onClick"
], Ra = ["onClick"], za = { class: "tree-item-content" }, Ba = {
	key: 0,
	class: "tree-children"
}, Va = {
	__name: "TreeView",
	props: {
		ItemsSource: {
			type: Array,
			default: null
		},
		SelectionMode: {
			type: String,
			default: void 0
		},
		CanDragItems: {
			type: Boolean,
			default: void 0
		},
		AllowDrop: {
			type: Boolean,
			default: void 0
		},
		SelectedItem: {
			type: Object,
			default: null
		},
		SelectedItems: {
			type: Array,
			default: null
		},
		items: {
			type: Array,
			default: () => []
		},
		selectionMode: {
			type: String,
			default: "Single"
		},
		canDragItems: {
			type: Boolean,
			default: !1
		},
		allowDrop: {
			type: Boolean,
			default: !1
		},
		depth: {
			type: Number,
			default: 0
		},
		rootItems: {
			type: Array,
			default: null
		}
	},
	emits: [
		"update:ItemsSource",
		"update:SelectedItem",
		"update:SelectedItems",
		"SelectionChanged",
		"ItemInvoked",
		"Expanding",
		"Collapsed",
		"update:items"
	],
	setup(e, { emit: n }) {
		let r = e, i = n, a = o(() => r.ItemsSource ?? r.items), s = o(() => r.SelectionMode ?? r.selectionMode), d = o(() => r.CanDragItems ?? r.canDragItems), f = o(() => r.AllowDrop ?? r.allowDrop), p = o(() => r.rootItems || a.value), h = A({
			idx: -1,
			pos: null
		}), g = (e) => e.children && e.children.length > 0, _ = (e) => g(e) ? e.children.every((e) => _(e)) : !!e.selected, v = (e) => g(e) ? e.children.some((e) => v(e)) : !!e.selected, y = (e) => g(e) ? _(e) ? !0 : v(e) ? null : !1 : !!e.selected, b = (e, t) => {
			e.selected = t, e.children && e.children.forEach((e) => b(e, t));
		}, x = (e, t) => {
			y(e) === null ? b(e, !1) : b(e, t), i("update:ItemsSource", [...a.value]), i("update:items", [...a.value]);
		}, w = (e) => s.value === "Multiple" ? y(e) === !0 : e.selected, ee = (e) => {
			for (let t of e) t.selected = !1, t.children && ee(t.children);
		}, T = (e) => {
			s.value === "Single" ? (ee(p.value), e.selected = !0, i("update:SelectedItem", e)) : s.value === "Multiple" && x(e, y(e) !== !0), i("ItemInvoked", { InvokedItem: e }), i("SelectionChanged", {
				SelectedItem: e,
				SelectedItems: p.value.filter?.((e) => e.selected) ?? []
			}), i("update:ItemsSource", [...a.value]), i("update:items", [...a.value]);
		}, E = (e) => {
			e.expanded = !e.expanded, i(e.expanded ? "Expanding" : "Collapsed", {
				Node: e,
				Item: e
			}), i("update:ItemsSource", [...a.value]), i("update:items", [...a.value]);
		}, O = (e, t, n, r) => {
			d.value && (window.__treeDrag = {
				node: t,
				parentArr: n,
				idx: r
			}, e.dataTransfer.effectAllowed = "move");
		}, k = (e, t) => {
			if (!f.value) return;
			e.preventDefault(), e.stopPropagation(), e.dataTransfer.dropEffect = "move";
			let n = e.currentTarget.getBoundingClientRect(), r = e.clientY - n.top, i = "inside";
			r < n.height * .25 ? i = "top" : r > n.height * .75 && (i = "bottom"), h.value = {
				idx: t,
				pos: i
			};
		}, P = (e) => {
			h.value.idx === e && (h.value = {
				idx: -1,
				pos: null
			});
		}, F = () => {
			let e = window.__treeDrag;
			if (!e) return;
			let t = e.parentArr.indexOf(e.node);
			t > -1 && e.parentArr.splice(t, 1);
		}, I = (e, t) => {
			if (!e.children) return !1;
			for (let n of e.children) if (n === t || I(n, t)) return !0;
			return !1;
		}, L = (e, t, n) => {
			if (!f.value) return;
			e.stopPropagation();
			let r = h.value.pos || "inside";
			h.value = {
				idx: -1,
				pos: null
			};
			let o = window.__treeDrag;
			if (!o || o.node === t || I(o.node, t)) return;
			F();
			let s = a.value.indexOf(t);
			s === -1 && (s = n), r === "top" ? a.value.splice(s, 0, o.node) : r === "bottom" ? a.value.splice(s + 1, 0, o.node) : (t.children ||= [], t.children.push(o.node), t.expanded = !0), window.__treeDrag = null, i("update:ItemsSource", [...a.value]), i("update:items", [...a.value]);
		}, R = (e) => {
			f.value && (e.preventDefault(), e.dataTransfer.dropEffect = "move");
		}, z = (e) => {
			if (!f.value) return;
			e.stopPropagation();
			let t = window.__treeDrag;
			t && (F(), a.value.push(t.node), window.__treeDrag = null, i("update:ItemsSource", [...a.value]), i("update:items", [...a.value]));
		};
		return (n, r) => {
			let i = N("TreeView", !0);
			return D(), l("div", {
				class: S(["win-tree-view", { "is-root": e.depth === 0 }]),
				onDragover: G(R, ["prevent"]),
				onDrop: G(z, ["stop"])
			}, [(D(!0), l(t, null, j(a.value, (t, o) => (D(), l("div", {
				key: o,
				class: "win-tree-node"
			}, [u("div", {
				class: S(["tree-item", [{ selected: w(t) }, h.value.idx === o ? `drop-${h.value.pos}` : ""]]),
				style: C({ paddingLeft: `${e.depth * 16 + 8}px` }),
				draggable: d.value,
				onDragstart: G((e) => O(e, t, a.value, o), ["stop"]),
				onDragover: G((e) => k(e, o), ["prevent"]),
				onDragleave: (e) => P(o),
				onDrop: G((e) => L(e, t, o), ["stop"]),
				onClick: (e) => T(t)
			}, [
				u("span", {
					class: S(["icon tree-chevron", {
						expanded: t.expanded,
						hidden: !g(t)
					}]),
					onClick: G((e) => E(t), ["stop"])
				}, "", 10, Ra),
				s.value === "Multiple" || s.value === "Extended" ? (D(), l("div", {
					key: 0,
					class: "tree-checkbox",
					onClick: r[0] ||= G(() => {}, ["stop"])
				}, [m(vr, {
					IsThreeState: !0,
					IsChecked: y(t),
					"onUpdate:IsChecked": (e) => x(t, e)
				}, null, 8, ["IsChecked", "onUpdate:IsChecked"])])) : c("", !0),
				u("div", za, [M(n.$slots, "item", { item: t })])
			], 46, La), t.expanded && g(t) ? (D(), l("div", Ba, [m(i, {
				ItemsSource: t.children,
				"onUpdate:ItemsSource": (e) => t.children = e,
				SelectionMode: s.value,
				CanDragItems: d.value,
				AllowDrop: f.value,
				depth: e.depth + 1,
				rootItems: p.value
			}, {
				item: H(({ item: e }) => [M(n.$slots, "item", { item: e })]),
				_: 3
			}, 8, [
				"ItemsSource",
				"onUpdate:ItemsSource",
				"SelectionMode",
				"CanDragItems",
				"AllowDrop",
				"depth",
				"rootItems"
			])])) : c("", !0)]))), 128))], 34);
		};
	}
}, Ha = /* @__PURE__ */ h({
	name: "Flyout",
	__name: "Flyout",
	props: {
		Content: { default: void 0 },
		IsOpen: {
			type: [Boolean, String],
			default: void 0
		},
		Placement: {
			type: String,
			default: "Bottom"
		},
		ShowMode: {
			type: String,
			default: "Standard"
		},
		IsLightDismissEnabled: {
			type: [Boolean, String],
			default: !0
		},
		LightDismissOverlayMode: {
			type: String,
			default: "Auto"
		},
		Theme: {
			type: String,
			default: ""
		}
	},
	emits: [
		"update:IsOpen",
		"Opened",
		"Closed",
		"Opening",
		"Closing"
	],
	setup(e, { expose: r, emit: a }) {
		let u = e, d = a, f = A(null), h = v("buttonFlyoutAnchor", null), _ = A(null), y = A(!1), b = A({
			top: 0,
			left: 0,
			maxHeight: 0,
			minWidth: 0
		}), T = A("down"), E = A("body"), O = te(), k = ne(), j = v("winuiTheme", null), N = g(), P = (e) => $(e, N), F = o(() => {
			let e = P(u.IsOpen);
			return e == null ? void 0 : e === !0 || e === "True";
		}), I = o(() => y.value), R = o(() => P(u.Content)), B = o(() => {
			let e = String(P(u.Theme) || "").toLowerCase(), t = String(z(j) || "").toLowerCase(), n = e === "light" || e === "dark" ? e : t;
			return n === "light" || n === "dark" ? `win-theme-scope theme-${n}` : "";
		}), U = o(() => String(P(u.Placement) || "Bottom")), W = o(() => P(u.IsLightDismissEnabled) !== !1), re = o(() => ({
			top: `${b.value.top}px`,
			left: `${b.value.left}px`,
			minWidth: b.value.minWidth ? `${b.value.minWidth}px` : void 0,
			maxHeight: b.value.maxHeight ? `${b.value.maxHeight}px` : void 0
		})), K = (e) => {
			if (e === I.value) return;
			d("update:IsOpen", e);
			let t = typeof u.IsOpen == "string" ? u.IsOpen.match(/^\{(?:x:Bind|Binding)\s+([\s\S]*?)\}$/) : null;
			t && ge(`${t[1].replace(/,\s*Mode\s*=\s*(?:OneWay|TwoWay|OneTime)\s*$/, "").trim()} = $event`, N)?.(e), y.value = e;
		}, q = async () => {
			let e = h?.value || f.value;
			if (!e) return;
			let t = e.getBoundingClientRect(), n = U.value, r = n.startsWith("Top"), i = n === "Top" || n === "Bottom", a = n.endsWith("EdgeAlignedRight"), o = r ? t.top - 6 : t.bottom + 6, s = t.left;
			b.value = {
				top: o,
				left: s,
				maxHeight: Math.max(120, window.innerHeight - 16),
				minWidth: t.width
			}, await x();
			let c = _.value;
			if (!c) return;
			let l = c.getBoundingClientRect(), u = window.innerHeight - t.bottom - 6 - 8, d = t.top - 6 - 8, p = r || u < l.height && d > u;
			T.value = p ? "up" : "down", o = p ? t.top - 6 - l.height : t.bottom + 6, s = i ? t.left + t.width / 2 - l.width / 2 : a ? t.right - l.width : t.left, s = Math.max(8, Math.min(window.innerWidth - l.width - 8, s)), o = Math.max(8, Math.min(window.innerHeight - l.height - 8, o)), b.value = {
				top: o,
				left: s,
				maxHeight: Math.max(120, p ? d : u),
				minWidth: t.width
			};
		}, J = async () => {
			K(!0), await x(), await q();
		}, ie = () => {
			I.value && K(!1);
		}, Y = () => {
			I.value ? ie() : J();
		}, X = {
			ShowAt: () => {
				J();
			},
			Hide: ie,
			Toggle: Y,
			get IsOpen() {
				return I.value;
			}
		}, Z = () => {
			W.value && ie();
		}, ae = () => ie();
		V(F, (e) => {
			e !== void 0 && (y.value = e);
		}, {
			immediate: !0,
			flush: "sync"
		});
		let Q = 0;
		V(I, async (e, t) => {
			if (e === t) return;
			let n = ++Q;
			d(e ? "Opening" : "Closing"), ge(e ? O.Opening : O.Closing, N)?.(), e ? (await x(), await q(), n === Q && I.value && (d("Opened"), ge(O.Opened, N)?.())) : (await x(), n === Q && !I.value && (d("Closed"), ge(O.Closed, N)?.()));
		}, { flush: "sync" });
		let oe = () => {
			I.value && q();
		}, se = () => {
			I.value && W.value && ie();
		}, ce = (e) => {
			e.key !== "Escape" || !I.value || (e.preventDefault(), ie());
		}, le = () => {
			E.value = document.fullscreenElement || "body", I.value && q();
		};
		return ee(() => {
			E.value = document.fullscreenElement || "body", window.addEventListener("resize", oe), window.addEventListener("scroll", oe, !0), window.addEventListener("blur", se), document.addEventListener("keydown", ce, !0), document.addEventListener("fullscreenchange", le), window.addEventListener("winui-flyout-hide", ae);
			let e = h?.value;
			k.trigger || e?.addEventListener("click", Y);
		}), w(() => {
			window.removeEventListener("resize", oe), window.removeEventListener("scroll", oe, !0), window.removeEventListener("blur", se), document.removeEventListener("keydown", ce, !0), document.removeEventListener("fullscreenchange", le), window.removeEventListener("winui-flyout-hide", ae), k.trigger || h?.value?.removeEventListener("click", Y);
		}), r({
			show: J,
			hide: ie,
			toggle: Y,
			IsOpen: I
		}), (e, r) => (D(), l("span", {
			class: "flyout-anchor",
			ref_key: "anchorRef",
			ref: f
		}, [M(e.$slots, "trigger", { Flyout: X }), (D(), s(n, { to: E.value }, [I.value ? (D(), l("div", {
			key: 0,
			class: "flyout-dismiss-layer",
			onPointerdown: Z
		}, null, 32)) : c("", !0), m(i, { name: T.value === "up" ? "flyout-up" : "flyout-down" }, {
			default: H(() => [I.value ? (D(), l("div", {
				key: 0,
				ref_key: "flyoutRef",
				ref: _,
				class: S(["flyout", [B.value, T.value === "up" ? "opens-up" : "opens-down"]]),
				style: C(re.value),
				onPointerdown: r[0] ||= G(() => {}, ["stop"])
			}, [m(Ft, {
				class: "flyout-scroll",
				VerticalScrollMode: "Auto",
				VerticalScrollBarVisibility: "Auto",
				HorizontalScrollMode: "Disabled",
				HorizontalScrollBarVisibility: "Disabled"
			}, {
				default: H(() => [z(k).default ? M(e.$slots, "default", { key: 0 }) : (D(), l(t, { key: 1 }, [p(L(R.value), 1)], 64))]),
				_: 3
			})], 38)) : c("", !0)]),
			_: 3
		}, 8, ["name"])], 8, ["to"]))], 512));
	}
}), Ua = /* @__PURE__ */ h({
	__name: "FlyoutAnimation",
	props: {
		Open: {
			type: Boolean,
			default: void 0
		},
		Autoplay: {
			type: Boolean,
			default: !0
		},
		Origin: {
			type: String,
			default: "edge"
		},
		Direction: {
			type: String,
			default: "top"
		},
		OriginElement: {
			type: [
				String,
				Object,
				Function
			],
			default: null
		},
		StartRect: {
			type: [Object, Function],
			default: null
		},
		Duration: {
			type: Number,
			default: 750
		},
		Easing: {
			type: String,
			default: "cubic-bezier(0.102, 0.700, 0.000, 1.007)"
		},
		Margin: {
			type: Number,
			default: 15
		},
		StripSize: {
			type: Number,
			default: 36
		},
		RespectReducedMotion: {
			type: Boolean,
			default: !0
		}
	},
	setup(e, { expose: t }) {
		let n = e, r = A(null), { play: i, cancel: a, isPlaying: o } = Je(r, n);
		return ee(async () => {
			await x(), n.Autoplay && (n.Open === void 0 || n.Open === !0) && i();
		}), V(() => n.Open, (e) => {
			e !== void 0 && (e ? i() : a());
		}), t({
			play: i,
			cancel: a,
			isPlaying: o
		}), (e, t) => (D(), l("div", {
			ref_key: "rootRef",
			ref: r,
			class: S(["win-flyout-animation", { "is-playing": z(o) }])
		}, [M(e.$slots, "default")], 2));
	}
}), Wa = ["aria-labelledby"], Ga = { class: "content-dialog-body" }, Ka = /*@__PURE__*/ Object.assign({ name: "ContentDialog" }, {
	__name: "ContentDialog",
	props: {
		IsOpen: {
			type: [Boolean, String],
			default: void 0
		},
		Title: {
			type: [String, Number],
			default: ""
		},
		Content: {
			type: [String, Number],
			default: ""
		},
		PrimaryButtonText: {
			type: [String, Number],
			default: ""
		},
		SecondaryButtonText: {
			type: [String, Number],
			default: ""
		},
		CloseButtonText: {
			type: [String, Number],
			default: ""
		},
		DefaultButton: {
			type: String,
			default: "None"
		},
		IsPrimaryButtonEnabled: {
			type: [Boolean, String],
			default: !0
		},
		IsSecondaryButtonEnabled: {
			type: [Boolean, String],
			default: !0
		},
		FullSizeDesired: {
			type: [Boolean, String],
			default: !1
		},
		IsLightDismissEnabled: {
			type: [Boolean, String],
			default: !1
		},
		Theme: {
			type: String,
			default: ""
		}
	},
	emits: [
		"update:IsOpen",
		"PrimaryButtonClick",
		"SecondaryButtonClick",
		"CloseButtonClick",
		"Closed",
		"Opened"
	],
	setup(e, { expose: t, emit: r }) {
		let a = e, d = r, f = A(!1), p = g(), h = te(), _ = ne(), y = v("winuiTheme", null), b = `content-dialog-title-${Math.random().toString(36).slice(2)}`, x = (e) => $(e, p), w = o(() => x(a.IsOpen) ?? f.value), ee = o(() => x(a.Title)), T = o(() => x(a.Content)), E = o(() => ee.value), k = o(() => T.value), j = o(() => x(a.PrimaryButtonText)), N = o(() => x(a.SecondaryButtonText)), P = o(() => x(a.CloseButtonText)), F = o(() => x(a.IsPrimaryButtonEnabled) !== !1), I = o(() => x(a.IsSecondaryButtonEnabled) !== !1), L = o(() => {
			let e = String(x(a.Theme) || "").toLowerCase(), t = String(z(y) || "").toLowerCase(), n = typeof document < "u" ? document.documentElement : null, r = typeof window < "u" && window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light", i = e === "light" || e === "dark" ? e : t === "light" || t === "dark" ? t : n?.classList.contains("theme-dark") || n?.dataset.theme === "dark" ? "dark" : n?.classList.contains("theme-light") || n?.dataset.theme === "light" ? "light" : r;
			return i === "light" || i === "dark" ? `theme-${i}` : "";
		}), R = o(() => (L.value === "theme-dark" ? "dark" : "light") == "dark" ? {
			"--ContentDialogBackground": "#2C2C2C",
			"--ContentDialogTopOverlay": "rgba(43, 43, 43, 0)",
			"--ContentDialogCommandSpaceBackground": "#202020",
			"--ContentDialogForeground": "#FFFFFF",
			"--TextFillColorPrimaryBrush": "#FFFFFF",
			"--LayerFillColorAltBrush": "rgba(255, 255, 255, 0.051)",
			"--SolidBackgroundFillColorBaseBrush": "#202020",
			"--content-dialog-content-bg": "rgba(43, 43, 43, 0)",
			"--content-dialog-command-bg": "#202020"
		} : {
			"--ContentDialogBackground": "#F3F3F3",
			"--ContentDialogTopOverlay": "#FFFFFF",
			"--ContentDialogCommandSpaceBackground": "#F3F3F3",
			"--ContentDialogForeground": "rgba(0, 0, 0, 0.8956)",
			"--TextFillColorPrimaryBrush": "rgba(0, 0, 0, 0.8956)",
			"--LayerFillColorAltBrush": "#FFFFFF",
			"--SolidBackgroundFillColorBaseBrush": "#F3F3F3",
			"--content-dialog-content-bg": "#FFFFFF",
			"--content-dialog-command-bg": "#F3F3F3"
		}), B = o(() => x(a.DefaultButton) || "None"), V = o(() => B.value === "Primary" ? "AccentButtonStyle" : "DefaultButtonStyle"), U = o(() => B.value === "Secondary" ? "AccentButtonStyle" : "DefaultButtonStyle"), W = o(() => B.value === "Close" ? "AccentButtonStyle" : "DefaultButtonStyle"), K = o(() => !!j.value), q = o(() => !!N.value), J = o(() => !!P.value), ie = o(() => !!_.default), Y = o(() => K.value || q.value || J.value), X = o(() => ({
			"all-visible": K.value && q.value && J.value,
			"primary-visible": K.value && !q.value && !J.value,
			"secondary-visible": !K.value && q.value && !J.value,
			"close-visible": !K.value && !q.value && J.value,
			"primary-secondary-visible": K.value && q.value && !J.value,
			"primary-close-visible": K.value && !q.value && J.value,
			"secondary-close-visible": !K.value && q.value && J.value
		})), Z = (e) => {
			f.value = e, d("update:IsOpen", e);
			let t = typeof a.IsOpen == "string" ? a.IsOpen.match(/^\{(?:x:Bind|Binding)\s+([\s\S]*?)\}$/) : null;
			t && ge(`${t[1].replace(/,\s*Mode\s*=\s*(?:OneWay|TwoWay|OneTime)\s*$/, "").trim()} = $event`, p)?.(e), e && (d("Opened"), ge(h.Opened, p)?.());
		}, ae = () => (Z(!0), new Promise((e) => {
			Q = e;
		})), Q = null, oe = (e) => {
			e === "Primary" ? (d("PrimaryButtonClick"), ge(h.PrimaryButtonClick, p)?.()) : e === "Secondary" ? (d("SecondaryButtonClick"), ge(h.SecondaryButtonClick, p)?.()) : (d("CloseButtonClick"), ge(h.CloseButtonClick, p)?.()), Z(!1), d("Closed", e), ge(h.Closed, p)?.(e), Q?.(e), Q = null;
		};
		O(re, {
			OnPrimaryButtonClick: () => oe("Primary"),
			OnSecondaryButtonClick: () => oe("Secondary"),
			OnCloseButtonClick: () => oe("None"),
			PrimaryButtonText: j,
			SecondaryButtonText: N,
			CloseButtonText: P,
			IsPrimaryButtonEnabled: F,
			IsSecondaryButtonEnabled: I,
			PrimaryButtonStyle: V,
			SecondaryButtonStyle: U,
			CloseButtonStyle: W,
			DialogTitle: E,
			DialogContent: k
		});
		let se = () => {
			x(a.IsLightDismissEnabled) && oe("None");
		};
		return t({
			ShowAsync: ae,
			showAsync: ae,
			hide: () => oe("None")
		}), (e, t) => (D(), s(n, { to: "body" }, [m(i, {
			appear: "",
			name: "content-dialog",
			duration: {
				enter: 250,
				leave: 167
			}
		}, {
			default: H(() => [w.value ? (D(), l("div", {
				key: 0,
				class: S(["content-dialog-overlay win-theme-scope", L.value]),
				style: C(R.value),
				onPointerdown: G(se, ["self"])
			}, [u("section", {
				class: "content-dialog",
				role: "dialog",
				"aria-modal": "true",
				"aria-labelledby": ee.value ? b : void 0
			}, [m(Ft, {
				class: "content-dialog-content",
				VerticalScrollMode: "Auto",
				VerticalScrollBarVisibility: "Auto",
				HorizontalScrollMode: "Disabled",
				HorizontalScrollBarVisibility: "Disabled"
			}, {
				default: H(() => [ee.value ? (D(), s(Rt, {
					key: 0,
					id: b,
					class: "content-dialog-title",
					Text: "{x:Bind DialogTitle}",
					FontSize: "20",
					FontWeight: "600",
					TextWrapping: "WrapWholeWords"
				})) : c("", !0), u("div", Ga, [ie.value ? M(e.$slots, "default", { key: 0 }) : T.value ? (D(), s(Rt, {
					key: 1,
					Text: "{x:Bind DialogContent}",
					TextWrapping: "WrapWholeWords"
				})) : c("", !0)])]),
				_: 3
			}), Y.value ? (D(), l("div", {
				key: 0,
				class: S(["content-dialog-command-space", X.value])
			}, [
				j.value ? (D(), s(Kn, {
					key: 0,
					class: "content-dialog-button content-dialog-primary",
					Style: "{x:Bind PrimaryButtonStyle}",
					IsEnabled: "{x:Bind IsPrimaryButtonEnabled}",
					Click: "OnPrimaryButtonClick"
				}, {
					default: H(() => [m(Rt, {
						Text: "{x:Bind PrimaryButtonText}",
						FontSize: "14",
						FontWeight: "400"
					})]),
					_: 1
				})) : c("", !0),
				N.value ? (D(), s(Kn, {
					key: 1,
					class: "content-dialog-button content-dialog-secondary",
					Style: "{x:Bind SecondaryButtonStyle}",
					IsEnabled: "{x:Bind IsSecondaryButtonEnabled}",
					Click: "OnSecondaryButtonClick"
				}, {
					default: H(() => [m(Rt, {
						Text: "{x:Bind SecondaryButtonText}",
						FontSize: "14",
						FontWeight: "400"
					})]),
					_: 1
				})) : c("", !0),
				P.value ? (D(), s(Kn, {
					key: 2,
					class: "content-dialog-button content-dialog-close",
					Style: "{x:Bind CloseButtonStyle}",
					Click: "OnCloseButtonClick"
				}, {
					default: H(() => [m(Rt, {
						Text: "{x:Bind CloseButtonText}",
						FontSize: "14",
						FontWeight: "400"
					})]),
					_: 1
				})) : c("", !0)
			], 2)) : c("", !0)], 8, Wa)], 38)) : c("", !0)]),
			_: 3
		})]));
	}
}), qa = /* @__PURE__ */ h({
	name: "Popup",
	__name: "Popup",
	props: {
		IsOpen: {
			type: [Boolean, String],
			default: void 0
		},
		HorizontalOffset: {
			type: [Number, String],
			default: 0
		},
		VerticalOffset: {
			type: [Number, String],
			default: 0
		},
		IsLightDismissEnabled: {
			type: [Boolean, String],
			default: !0
		},
		Theme: {
			type: String,
			default: ""
		}
	},
	emits: [
		"update:IsOpen",
		"Opened",
		"Closed"
	],
	setup(e, { expose: t, emit: r }) {
		let a = e, u = r, d = A(null), f = A(null), p = A(!1), h = A({
			top: 0,
			left: 0
		}), _ = te(), y = v("winuiTheme", null), b = g(), T = (e) => $(e, b), E = o(() => {
			let e = T(a.IsOpen);
			return e == null ? void 0 : e === !0 || e === "True";
		}), O = o(() => p.value), k = o(() => Number(T(a.HorizontalOffset) ?? 0)), j = o(() => Number(T(a.VerticalOffset) ?? 0)), N = o(() => T(a.IsLightDismissEnabled) !== !1), P = o(() => {
			let e = String(T(a.Theme) || "").toLowerCase(), t = String(z(y) || "").toLowerCase(), n = e === "light" || e === "dark" ? e : t;
			return n === "light" || n === "dark" ? `win-theme-scope theme-${n}` : "";
		}), F = o(() => ({
			top: `${h.value.top}px`,
			left: `${h.value.left}px`
		})), I = (e) => {
			if (e === O.value) return;
			u("update:IsOpen", e);
			let t = typeof a.IsOpen == "string" ? a.IsOpen.match(/^\{(?:x:Bind|Binding)\s+([\s\S]*?)\}$/) : null;
			t && ge(`${t[1].replace(/,\s*Mode\s*=\s*(?:OneWay|TwoWay|OneTime)\s*$/, "").trim()} = $event`, b)?.(e), p.value = e;
		}, L = async () => {
			await x();
			let e = d.value, t = f.value;
			if (!e || !t) return;
			let n = (e.querySelector("[data-popup-trigger]") || e.firstElementChild || e.parentElement || e).getBoundingClientRect(), r = t.getBoundingClientRect(), i = Math.max(8, Math.min(window.innerWidth - r.width - 8, n.left + k.value));
			h.value = {
				top: Math.max(8, Math.min(window.innerHeight - r.height - 8, n.top + j.value)),
				left: i
			};
		}, R = async () => {
			I(!0), await L();
		}, ne = () => {
			O.value && I(!1);
		}, B = (e) => {
			if (!O.value || !N.value) return;
			let t = e.target;
			t instanceof Node && (f.value?.contains(t) || d.value?.contains(t)) || ne();
		};
		V(E, (e) => {
			e !== void 0 && (p.value = e);
		}, {
			immediate: !0,
			flush: "sync"
		});
		let U = 0;
		return V(O, async (e, t) => {
			if (e === t) return;
			let n = ++U;
			e ? (await L(), n === U && O.value && (u("Opened"), ge(_.Opened, b)?.())) : (await x(), n === U && !O.value && (u("Closed"), ge(_.Closed, b)?.()));
		}, { flush: "sync" }), V([k, j], () => {
			O.value && L();
		}), ee(() => document.addEventListener("pointerdown", B, !0)), w(() => document.removeEventListener("pointerdown", B, !0)), t({
			open: R,
			close: ne
		}), (e, t) => (D(), l("span", {
			class: "popup-anchor",
			ref_key: "anchorRef",
			ref: d
		}, [M(e.$slots, "trigger"), (D(), s(n, { to: "body" }, [m(i, { name: "popup" }, {
			default: H(() => [O.value ? (D(), l("div", {
				key: 0,
				ref_key: "popupRef",
				ref: f,
				class: S(["popup", P.value]),
				style: C(F.value),
				onPointerdown: t[0] ||= G(() => {}, ["stop"])
			}, [M(e.$slots, "default")], 38)) : c("", !0)]),
			_: 3
		})]))], 512));
	}
}), Ja = (e) => h({
	name: `TeachingTip.${e[0].toUpperCase()}${e.slice(1)}`,
	__teachingTipProperty: e,
	setup(e, { slots: t }) {
		return () => _("span", { class: "teaching-tip-property" }, t.default?.());
	}
}), Ya = Ja("heroContent"), Xa = Ja("content"), Za = Ja("iconSource"), Qa = (e) => e.type?.__teachingTipProperty, $a = {
	key: 0,
	class: "teaching-tip-hero"
}, eo = {
	key: 0,
	class: "teaching-tip-icon"
}, to = { class: "teaching-tip-text" }, no = {
	key: 2,
	class: "teaching-tip-content"
}, ro = {
	key: 2,
	class: "teaching-tip-tail",
	viewBox: "0 0 20 10",
	preserveAspectRatio: "none",
	"aria-hidden": "true"
}, io = ["points"], ao = ["points"], oo = /* @__PURE__ */ h({
	HeroContent: Ya,
	Content: Xa,
	IconSource: Za,
	name: "TeachingTip",
	__name: "TeachingTip",
	props: {
		IsOpen: {
			type: [Boolean, String],
			default: void 0
		},
		Target: {
			type: [Object, String],
			default: null
		},
		Title: {
			type: String,
			default: ""
		},
		Subtitle: {
			type: String,
			default: ""
		},
		Content: {
			type: [
				String,
				Number,
				Object
			],
			default: ""
		},
		HeroContent: {
			type: [
				String,
				Number,
				Object
			],
			default: null
		},
		TailVisibility: {
			type: String,
			default: "Auto"
		},
		PreferredPlacement: {
			type: String,
			default: "Auto"
		},
		PlacementMargin: {
			type: [
				String,
				Number,
				Object
			],
			default: 0
		},
		ShouldConstrainToRootBounds: {
			type: Boolean,
			default: !0
		},
		IsLightDismissEnabled: {
			type: Boolean,
			default: !1
		},
		HeroContentPlacement: {
			type: String,
			default: "Auto"
		},
		Theme: {
			type: String,
			default: ""
		},
		ActionButtonContent: {
			type: [
				String,
				Number,
				Object
			],
			default: ""
		},
		ActionButtonStyle: {
			type: [String, Object],
			default: ""
		},
		ActionButtonCommand: {
			type: [Function, Object],
			default: null
		},
		ActionButtonCommandParameter: {
			type: [
				String,
				Number,
				Boolean,
				Object
			],
			default: null
		},
		CloseButtonContent: {
			type: [
				String,
				Number,
				Object
			],
			default: ""
		},
		CloseButtonStyle: {
			type: [String, Object],
			default: ""
		},
		CloseButtonCommand: {
			type: [Function, Object],
			default: null
		},
		CloseButtonCommandParameter: {
			type: [
				String,
				Number,
				Boolean,
				Object
			],
			default: null
		},
		IconSource: {
			type: [String, Object],
			default: ""
		},
		isTargeted: {
			type: Boolean,
			default: void 0
		}
	},
	emits: [
		"update:IsOpen",
		"ActionButtonClick",
		"CloseButtonClick",
		"Opened",
		"Closed"
	],
	setup(e, { expose: r, emit: a }) {
		let { t: d } = rt(), f = e, y = a, b = A(null), T = g(), E = te(), k = ne(), j = A(!1), N = A({
			top: 0,
			left: 0,
			tailLeft: 160
		}), P = A("Bottom"), F = v("winuiTheme", null), I = A(""), R = A(""), B = null, U = (e) => $(e, T), W = o(() => U(f.IsOpen) ?? j.value), K = o(() => U(f.Target)), q = o(() => f.isTargeted ?? !!Ie()), J = o(() => U(f.Title)), ie = o(() => U(f.Subtitle)), Y = o(() => U(f.PreferredPlacement) || "Auto"), X = o(() => U(f.ActionButtonContent)), Z = o(() => typeof U(f.ActionButtonStyle) == "string" ? U(f.ActionButtonStyle) : ""), ae = o(() => U(f.CloseButtonContent)), Q = o(() => typeof U(f.CloseButtonStyle) == "string" ? U(f.CloseButtonStyle) : ""), oe = o(() => Z.value || "DefaultButtonStyle"), se = o(() => Q.value || "DefaultButtonStyle"), ce = o(() => J.value), le = o(() => ie.value), ue = o(() => d("text.close")), de = o(() => U(f.IsLightDismissEnabled) === !0), fe = o(() => Xe(U(f.TailVisibility))), pe = o(() => U(f.ShouldConstrainToRootBounds) !== !1), me = o(() => Ze(U(f.HeroContentPlacement))), he = o(() => Le(U(f.Theme)) || (I.value ? I.value : Le(z(F)) || R.value)), _e = o(() => he.value ? `win-theme-scope theme-${he.value}` : ""), ye = o(() => !ae.value && !de.value), be = o(() => q.value && fe.value !== "Collapsed"), xe = o(() => P.value === "Top" ? "0,0 10,10 20,0" : "0,10 10,0 20,10"), Se = o(() => {
			let e = {
				heroContent: [],
				content: [],
				iconSource: []
			}, t = [];
			for (let n of k.default?.() ?? []) {
				let r = Qa(n);
				if (!r || !n.children || typeof n.children != "object") {
					t.push(n);
					continue;
				}
				let i = n.children.default;
				i && (e[r] = ve(i(), T));
			}
			return e.content.length || (e.content = ve(t, T)), e;
		}), Ce = (e) => h({
			name: `TeachingTip${e[0].toUpperCase()}${e.slice(1)}Outlet`,
			setup() {
				return () => _(t, Se.value[e]);
			}
		}), we = Ce("heroContent"), Te = Ce("content"), Ee = Ce("iconSource"), De = o(() => U(f.HeroContent)), Oe = o(() => U(f.IconSource)), ke = o(() => U(f.Content)), Ae = o(() => Se.value.heroContent.length > 0 || !!De.value || !!(k.HeroContent || k.hero)), je = o(() => Se.value.content.length > 0 || !!ke.value || !!k.content), Me = o(() => Se.value.iconSource.length > 0 || !!Oe.value || !!(k.IconSource || k.icon)), Ne = o(() => Oe.value === "Refresh" ? "" : Oe.value), Pe = o(() => {
			let e = de.value ? "var(--TeachingTipTransientBackground, var(--AcrylicInAppFillColorDefaultBrush, var(--flyout-bg)))" : "var(--TeachingTipBackgroundBrush, var(--SolidBackgroundFillColorTertiaryBrush, var(--ctrl-fill-tertiary, var(--flyout-bg))))";
			return {
				top: `${N.value.top}px`,
				left: `${N.value.left}px`,
				"--teaching-tip-tail-left": `${N.value.tailLeft}px`,
				"--teaching-tip-background": e,
				"--win-acrylic-fill": e
			};
		});
		function Fe() {
			let e = typeof f.Target == "string" ? f.Target.match(/^\{(?:x:Bind|Binding)\s+([A-Za-z_$][\w$]*)[\s\S]*\}$/)?.[1] : "";
			if (!e) return null;
			let t = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(e) : e.replace(/[^A-Za-z0-9_-]/g, "\\$&");
			return document.querySelector(`[data-xaml-ref="${t}"]`) || document.querySelector(`[data-xaml-ref~="${t}"]`);
		}
		function Ie() {
			let e = K.value, t = Fe();
			return e ? e instanceof HTMLElement ? e : e && typeof e == "object" && e.$el instanceof HTMLElement ? e.$el : e && typeof e == "object" && e.value instanceof HTMLElement ? e.value : e && typeof e == "object" && e.value?.$el instanceof HTMLElement ? e.value.$el : t : t;
		}
		function Le(e) {
			let t = String(e || "").toLowerCase();
			return t === "light" || t === "dark" ? t : "";
		}
		function Re() {
			let e = Ie()?.closest?.(".theme-light, .theme-dark");
			return e?.classList.contains("theme-dark") ? "dark" : e?.classList.contains("theme-light") ? "light" : "";
		}
		function ze() {
			let e = document.documentElement;
			return e.classList.contains("theme-dark") || e.dataset.theme === "dark" ? "dark" : e.classList.contains("theme-light") || e.dataset.theme === "light" ? "light" : window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		}
		function Be() {
			B?.disconnect(), I.value = Re(), R.value = ze(), B = new MutationObserver(() => {
				I.value = Re(), R.value = ze();
			});
			let e = Ie()?.closest?.(".theme-light, .theme-dark");
			e && B.observe(e, {
				attributes: !0,
				attributeFilter: ["class", "data-theme"]
			}), document.documentElement !== e && B.observe(document.documentElement, {
				attributes: !0,
				attributeFilter: ["class", "data-theme"]
			});
		}
		let Ve = (e) => {
			j.value = e, y("update:IsOpen", e);
			let t = typeof f.IsOpen == "string" ? f.IsOpen.match(/^\{(?:x:Bind|Binding)\s+([\s\S]*?)\}$/) : null;
			t && ge(`${t[1].replace(/,\s*Mode\s*=\s*(?:OneWay|TwoWay|OneTime)\s*$/, "").trim()} = $event`, T)?.(e), y(e ? "Opened" : "Closed");
		}, He = () => {
			W.value && (y("CloseButtonClick"), ge(E.CloseButtonClick, T)?.(), Ve(!1));
		}, Ue = () => {
			Ge(f.ActionButtonCommand, f.ActionButtonCommandParameter), y("ActionButtonClick"), ge(E.ActionButtonClick, T)?.();
		}, We = () => {
			Ge(f.CloseButtonCommand, f.CloseButtonCommandParameter), He();
		};
		O(re, {
			OnTeachingTipCloseButtonClick: () => We(),
			OnTeachingTipActionButtonClick: () => Ue(),
			TipTitle: ce,
			TipSubtitle: le,
			ActionButtonContent: X,
			CloseButtonContent: ae,
			ActionButtonStyleName: oe,
			CloseButtonStyleName: se,
			CloseButtonLabel: ue
		});
		function Ge(e, t) {
			typeof e == "function" ? e(t) : e && typeof e.Execute == "function" && e.Execute(t);
		}
		let Ke = async () => {
			await x();
			let e = b.value;
			if (!e) return;
			let t = {
				width: e.offsetWidth,
				height: e.offsetHeight
			}, n = qe(f.PlacementMargin), r = window.innerWidth, i = window.innerHeight, a = Ie();
			if (!a) {
				let e = i - t.height - 24 - n.bottom, a = 24 + n.top, o = e >= 24, s = a + t.height <= i - 24;
				P.value = o || !s ? "Bottom" : "Top", N.value = {
					top: $e(P.value === "Bottom" ? e : a, 24, i - t.height - 24),
					left: $e((r - t.width) / 2, n.left, r - t.width - n.right),
					tailLeft: t.width / 2
				};
				return;
			}
			let o = a.getBoundingClientRect(), s = Ye(Y.value), c = be.value ? 9 : 0, l = t.height + c, u = i - o.bottom - n.bottom, d = Qe(s, l, o.top - n.top, u);
			P.value = d;
			let p = d === "Top" ? o.top - t.height - c - n.top : o.bottom + c + n.bottom, m = o.left + o.width / 2 - t.width / 2;
			if (pe.value) {
				let e = d === "Bottom" ? n.top + c : n.top, a = i - t.height - n.bottom - (d === "Top" ? c : 0);
				p = $e(p, e, a), m = $e(m, n.left, r - t.width - n.right);
			}
			let h = $e(o.left + o.width / 2 - m, 18, t.width - 18);
			N.value = {
				top: p,
				left: m,
				tailLeft: h
			};
		};
		function qe(e) {
			if (e && typeof e == "object") return {
				top: Je(e.top ?? e.Top),
				right: Je(e.right ?? e.Right),
				bottom: Je(e.bottom ?? e.Bottom),
				left: Je(e.left ?? e.Left)
			};
			let t = String(e ?? "0").split(",").map((e) => Number(e.trim())).filter(Number.isFinite);
			return t.length === 1 ? {
				top: t[0],
				right: t[0],
				bottom: t[0],
				left: t[0]
			} : t.length === 2 ? {
				top: t[1],
				right: t[0],
				bottom: t[1],
				left: t[0]
			} : t.length === 4 ? {
				top: t[1],
				right: t[2],
				bottom: t[3],
				left: t[0]
			} : {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			};
		}
		function Je(e) {
			let t = Number(e);
			return Number.isFinite(t) ? t : 0;
		}
		function Ye(e) {
			let t = String(e || "Auto").toLowerCase();
			return [
				"Top",
				"Bottom",
				"Left",
				"Right",
				"TopRight",
				"TopLeft",
				"BottomRight",
				"BottomLeft",
				"LeftTop",
				"LeftBottom",
				"RightTop",
				"RightBottom",
				"Center"
			].find((e) => e.toLowerCase() === t) || "Auto";
		}
		function Xe(e) {
			let t = String(e || "Auto").toLowerCase();
			return t === "visible" ? "Visible" : t === "collapsed" ? "Collapsed" : "Auto";
		}
		function Ze(e) {
			let t = String(e || "Auto").toLowerCase();
			return t === "bottom" ? "Bottom" : t === "top" ? "Top" : "Auto";
		}
		function Qe(e, t, n, r) {
			let i = n >= t, a = r >= t;
			return e === "Top" ? i || !a ? "Top" : "Bottom" : e === "Bottom" ? a || !i ? "Bottom" : "Top" : i ? "Top" : a ? "Bottom" : n >= r ? "Top" : "Bottom";
		}
		function $e(e, t, n) {
			return n < t ? t : Math.max(t, Math.min(n, e));
		}
		V(W, (e) => {
			e && (Be(), Ke());
		}), V(K, () => {
			x(Be), W.value && (x(() => Ke()), requestAnimationFrame(() => {
				W.value && Ke();
			}));
		}), V(W, (e) => {
			e && (x(() => Ke()), requestAnimationFrame(() => {
				W.value && Ke();
			}));
		}), V(() => [
			f.PlacementMargin,
			f.PreferredPlacement,
			f.ShouldConstrainToRootBounds,
			f.TailVisibility,
			f.Title,
			f.Subtitle,
			f.Content,
			f.ActionButtonContent,
			f.CloseButtonContent
		], () => {
			W.value && Ke();
		});
		let et = () => {
			W.value && Ke();
		}, tt = (e) => {
			if (!W.value || !de.value) return;
			let t = e.target;
			t instanceof Node && (b.value?.contains(t) || Ie()?.contains(t) || Ve(!1));
		};
		return ee(() => {
			Be(), window.addEventListener("resize", et), window.addEventListener("scroll", et, !0), document.addEventListener("pointerdown", tt, !0);
		}), w(() => {
			B?.disconnect(), window.removeEventListener("resize", et), window.removeEventListener("scroll", et, !0), document.removeEventListener("pointerdown", tt, !0);
		}), r({
			close: He,
			updatePosition: Ke
		}), (e, r) => (D(), s(n, { to: "body" }, [m(i, { name: "teaching-tip" }, {
			default: H(() => [W.value ? (D(), l("section", {
				key: 0,
				ref_key: "tipRef",
				ref: b,
				class: S(["teaching-tip", [
					q.value ? "is-targeted" : "is-untargeted",
					de.value ? "is-light-dismiss" : "is-normal-dismiss",
					_e.value,
					`placement-${P.value.toLowerCase()}`,
					`hero-placement-${me.value.toLowerCase()}`
				]]),
				style: C(Pe.value),
				role: "dialog",
				onPointerdown: r[0] ||= G(() => {}, ["stop"])
			}, [
				Ae.value ? (D(), l("div", $a, [Se.value.heroContent.length ? (D(), s(z(we), { key: 0 })) : M(e.$slots, "HeroContent", { key: 1 }, () => [M(e.$slots, "hero", {}, () => [typeof De.value == "string" || typeof De.value == "number" ? (D(), l(t, { key: 0 }, [p(L(De.value), 1)], 64)) : c("", !0)])])])) : c("", !0),
				u("div", { class: S(["teaching-tip-main", { "has-alternate-close": ye.value }]) }, [
					Me.value ? (D(), l("div", eo, [Se.value.iconSource.length ? (D(), s(z(Ee), { key: 0 })) : M(e.$slots, "IconSource", { key: 1 }, () => [M(e.$slots, "icon", {}, () => [p(L(Ne.value), 1)])])])) : c("", !0),
					u("div", to, [
						J.value ? (D(), s(Rt, {
							key: 0,
							class: "teaching-tip-title",
							Text: "{x:Bind TipTitle}",
							TextWrapping: "WrapWholeWords"
						})) : c("", !0),
						ie.value ? (D(), s(Rt, {
							key: 1,
							class: "teaching-tip-subtitle",
							Text: "{x:Bind TipSubtitle}",
							TextWrapping: "WrapWholeWords"
						})) : c("", !0),
						je.value ? (D(), l("div", no, [Se.value.content.length ? (D(), s(z(Te), { key: 0 })) : M(e.$slots, "default", { key: 1 }, () => [p(L(ke.value), 1)])])) : c("", !0)
					]),
					ye.value ? (D(), s(Kn, {
						key: 1,
						class: "teaching-tip-close",
						Style: "SubtleButtonStyle",
						Width: "40",
						Height: "40",
						Padding: "4",
						Margin: "0",
						BorderThickness: "1",
						CornerRadius: "var(--ControlCornerRadius, 4px)",
						FocusVisualMargin: "-3",
						Content: "",
						FontFamily: "var(--SymbolThemeFontFamily, 'Segoe Fluent Icons', 'Segoe MDL2 Assets')",
						FontSize: "16",
						"AutomationProperties.Name": "{x:Bind CloseButtonLabel}",
						"ToolTipService.ToolTip": "{x:Bind CloseButtonLabel}",
						Click: "OnTeachingTipCloseButtonClick"
					})) : c("", !0)
				], 2),
				X.value || ae.value || e.$slots.actions ? (D(), l("div", {
					key: 1,
					class: S(["teaching-tip-actions", { "both-buttons-visible": X.value && ae.value }])
				}, [M(e.$slots, "actions", {}, () => [X.value ? (D(), s(Kn, {
					key: 0,
					class: "teaching-tip-action-button",
					Style: "{x:Bind ActionButtonStyleName}",
					Click: "OnTeachingTipActionButtonClick"
				}, {
					default: H(() => [m(Rt, { Text: "{x:Bind ActionButtonContent}" })]),
					_: 1
				})) : c("", !0), ae.value ? (D(), s(Kn, {
					key: 1,
					class: "teaching-tip-close-button",
					Style: "{x:Bind CloseButtonStyleName}",
					Click: "OnTeachingTipCloseButtonClick"
				}, {
					default: H(() => [m(Rt, { Text: "{x:Bind CloseButtonContent}" })]),
					_: 1
				})) : c("", !0)])], 2)) : c("", !0),
				be.value ? (D(), l("svg", ro, [u("polygon", { points: xe.value }, null, 8, io), u("polyline", { points: xe.value }, null, 8, ao)])) : c("", !0)
			], 38)) : c("", !0)]),
			_: 3
		})]));
	}
}), so = "tooltipservice.tooltip", co = "tooltipservice.placement", lo = "tooltipservice.placementtarget", uo = "[tooltipservice\\.tooltip]", fo = 400, po = 200, mo = 167, ho = /* @__PURE__ */ h({
	__name: "ToolTipService",
	setup(e) {
		let t = fo * 2, n = fo * 1.5, r = fo, i = A(!1), a = A(""), o = A("Mouse"), c = I(null), l = A(null), u = A(""), d = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new WeakMap(), p = null, m = null, h = null, g, _, v, y = -Infinity, b = !1, x = null, S = null, C = !1, T = !1;
		function E(e) {
			return e.getAttribute(so);
		}
		function O(e) {
			let t = E(e);
			if (t === null) {
				p === e ? H() : d.has(e) && k(e);
				return;
			}
			d.has(e) || (f.set(e, e.getAttribute("title")), d.add(e)), p === e && i.value ? (a.value = t, o.value = e.getAttribute(co) || "Mouse", c.value = F(e)) : e.removeAttribute("title");
		}
		function k(e) {
			let t = f.get(e);
			t == null ? e.removeAttribute("title") : e.setAttribute("title", t), f.delete(e), d.delete(e);
		}
		function j(e) {
			E(e) === null ? k(e) : e.removeAttribute("title");
		}
		function M(e) {
			e instanceof Element && (e instanceof HTMLElement && e.hasAttribute(so) && O(e), e.querySelectorAll(uo).forEach(O));
		}
		function N(e) {
			e instanceof Element && (e instanceof HTMLElement && e.hasAttribute(so) ? [e, ...e.querySelectorAll(uo)] : [...e.querySelectorAll(uo)]).forEach((e) => {
				p === e && H(), m === e && R(), x === e && (x = null), d.has(e) && k(e);
			});
		}
		function P(e) {
			let t = e instanceof HTMLElement ? e : e instanceof Node ? e.parentElement : null;
			for (; t;) {
				if (t.hasAttribute(so)) return t;
				t = t.parentElement;
			}
			return null;
		}
		function F(e) {
			let t = e.getAttribute(lo);
			if (!t) return e;
			try {
				return document.querySelector(t) || e;
			} catch {
				return e;
			}
		}
		function L(e) {
			let t = e.closest(".theme-light, .theme-dark");
			return t?.classList.contains("theme-dark") ? "dark" : t?.classList.contains("theme-light") ? "light" : "";
		}
		function R() {
			g !== void 0 && window.clearTimeout(g), g = void 0, m = null;
		}
		function z() {
			_ !== void 0 && window.clearTimeout(_), _ = void 0;
		}
		function te() {
			v !== void 0 && window.clearTimeout(v), v = void 0;
		}
		function ne(e) {
			let t = e.getBoundingClientRect();
			return {
				x: t.left + t.width / 2,
				y: t.top + t.height / 2
			};
		}
		function B(e) {
			let t = E(e);
			t !== null && (z(), C = !1, T = !1, p && p !== e && j(p), p = e, m = null, a.value = t, o.value = e.getAttribute(co) || "Mouse", c.value = F(e), u.value = L(e), e.removeAttribute("title"), i.value = !0);
		}
		function V(e, a, o) {
			if (x === e) return;
			if (p === e && C && T) {
				z(), C = !1, T = !1, e.removeAttribute("title"), i.value = !0;
				return;
			}
			if (p === e && i.value) {
				z();
				return;
			}
			if (m === e) return;
			let s = !!(p && p !== e && i.value);
			s ? H() : (R(), z()), m = e, l.value = o || ne(e);
			let c = performance.now() - y <= po, u = s || c, d = a === "touch" ? u ? 0 : r : a === "mouse" && u ? n : t;
			g = window.setTimeout(() => B(e), d);
		}
		function H(e = !1) {
			let t = !!(p && i.value), n = p;
			if (R(), z(), te(), b = !1, n && j(n), i.value = !1, t && (y = performance.now()), !n) {
				C = !1, T = !1, c.value = null, l.value = null, a.value = "";
				return;
			}
			C = !0, T = e, _ = window.setTimeout(() => {
				_ = void 0, !(!C || i.value || p !== n) && (p = null, C = !1, T = !1, c.value = null, l.value = null, a.value = "");
			}, mo);
		}
		function U(e) {
			m !== e && p !== e || (R(), !b && H(!0));
		}
		function W(e) {
			let t = P(e.target);
			t && e.pointerType !== "touch" && (S = "mouse", V(t, "mouse", {
				x: e.clientX,
				y: e.clientY
			}));
		}
		function G(e) {
			e.pointerType === "touch" || !m || P(e.target) === m && (l.value = {
				x: e.clientX,
				y: e.clientY
			});
		}
		function re(e) {
			let t = P(e.target);
			if (!t) return;
			let n = e.relatedTarget;
			n instanceof Node && t.contains(n) || (x === t && (x = null), U(t));
		}
		function K(e) {
			S = e.pointerType === "touch" ? "touch" : "mouse";
			let t = P(e.target);
			e.pointerType === "touch" && t ? (V(t, "touch", {
				x: e.clientX,
				y: e.clientY
			}), te(), v = window.setTimeout(H, 5e3)) : t ? (x = t, (p === t || m === t) && H()) : !t && p && H();
		}
		function q(e) {
			let t = P(e.target);
			t && S === "keyboard" && V(t, "keyboard", ne(t));
		}
		function J(e) {
			let t = P(e.target);
			t && U(t);
		}
		function ie() {
			S = "keyboard";
		}
		function Y() {
			b = !0, z(), p && C && T && x !== p && (C = !1, T = !1, p.removeAttribute("title"), i.value = !0);
		}
		function X() {
			b = !1, p && U(p);
		}
		return ee(() => {
			document.querySelectorAll(uo).forEach(O), h = new MutationObserver((e) => {
				e.forEach((e) => {
					e.type === "attributes" && e.target instanceof HTMLElement && (e.attributeName === so && O(e.target), e.attributeName === "class" && p && (e.target === p || e.target.contains(p)) && (u.value = L(p))), e.addedNodes.forEach(M), e.removedNodes.forEach(N);
				});
			}), h.observe(document.body, {
				attributes: !0,
				attributeFilter: [so, "class"],
				childList: !0,
				subtree: !0
			}), document.addEventListener("pointerover", W, !0), document.addEventListener("pointermove", G, !0), document.addEventListener("pointerout", re, !0), document.addEventListener("pointerdown", K, !0), document.addEventListener("keydown", ie, !0), document.addEventListener("focusin", q, !0), document.addEventListener("focusout", J, !0);
		}), w(() => {
			h?.disconnect(), R(), z(), te(), d.forEach(k), document.removeEventListener("pointerover", W, !0), document.removeEventListener("pointermove", G, !0), document.removeEventListener("pointerout", re, !0), document.removeEventListener("pointerdown", K, !0), document.removeEventListener("keydown", ie, !0), document.removeEventListener("focusin", q, !0), document.removeEventListener("focusout", J, !0);
		}), (e, t) => (D(), s(Or, {
			IsOpen: i.value,
			Content: a.value,
			Placement: o.value,
			PlacementTarget: c.value || void 0,
			PlacementPoint: l.value || void 0,
			Theme: u.value,
			UseNativeToolTip: !1,
			IsServiceHost: "",
			onTooltipPointerEnter: Y,
			onTooltipPointerLeave: X
		}, null, 8, [
			"IsOpen",
			"Content",
			"Placement",
			"PlacementTarget",
			"PlacementPoint",
			"Theme"
		]));
	}
}), go = ["aria-label"], _o = [
	"aria-expanded",
	"aria-disabled",
	"disabled",
	"tabindex",
	"onPointerenter",
	"onPointerleave",
	"onPointerdown",
	"onKeydown",
	"onFocus"
], vo = /*#__PURE__*/ dt({
	__name: "MenuBar",
	props: {
		Items: {
			type: Array,
			required: !0
		},
		"AutomationProperties.Name": {
			type: String,
			default: "Menu"
		},
		Theme: {
			type: String,
			default: ""
		}
	},
	emits: ["ItemClick"],
	setup(e, { emit: n }) {
		let r = e, i = n, a = A(null), s = A(null), c = A(0), d = A(null), f = A(null), p = A(null), h = A(null), g = A(96), _ = o(() => r.Items), v = o(() => s.value === null ? null : _.value[s.value]), y = (e) => e?.IsEnabled === !1 || e?.Command?.CanExecute?.(e.CommandParameter) === !1, b = (e) => {
			let t = a.value?.querySelectorAll(".win-menu-bar-button")[e];
			if (!t) return;
			let n = t.getBoundingClientRect();
			h.value = n, g.value = Math.max(n.width, 96);
		}, C = async (e) => {
			let t = _.value[e];
			if (!t || y(t) || !t.Items?.length) return;
			let n = s.value;
			s.value = e, c.value = e, await x(), (n !== e || !h.value) && b(e);
		}, w = () => {
			s.value = null, d.value = null, p.value = null;
		}, E = (e, t) => {
			f.value = t, e.pointerType !== "touch" && s.value !== null && s.value !== t && (d.value = t, C(t));
		}, O = (e) => {
			f.value === e && (f.value = null), d.value === e && (d.value = null);
		}, k = (e, t) => {
			if (e.preventDefault(), p.value = t, s.value === t) {
				d.value === t ? (d.value = null, b(t)) : w();
				return;
			}
			d.value = null, C(t);
		}, M = (e) => {
			if (!e?.GroupName || !v.value) return;
			let t = (n) => {
				n.forEach((n) => {
					n.GroupName === e.GroupName && (n.IsChecked = n === e), n.Items && t(n.Items);
				});
			};
			t(v.value.Items);
		}, N = (e) => {
			y(e) || (M(e), i("ItemClick", { Item: e }), w());
		}, P = (e) => {
			let t = _.value.length, n = c.value;
			do
				n = (n + e + t) % t;
			while (y(_.value[n]) && n !== c.value);
			c.value = n, a.value?.querySelectorAll(".win-menu-bar-button")[n]?.focus(), s.value !== null && C(n);
		}, F = (e, t) => {
			e.key === "ArrowRight" ? (e.preventDefault(), P(1)) : e.key === "ArrowLeft" ? (e.preventDefault(), P(-1)) : e.key === "ArrowDown" || e.key === "Enter" || e.key === " " ? (e.preventDefault(), C(t)) : e.key === "Escape" && (e.preventDefault(), w());
		}, I = (e) => e?.KeyboardAccelerators?.[0] ?? null, L = (e) => {
			s.value === null && _.value.forEach((t) => {
				t.Items?.forEach((t) => {
					let n = I(t);
					if (!n) return;
					let { Key: r, Modifiers: a = [] } = n;
					e.key.toUpperCase() === String(r).toUpperCase() && a.includes("Control") === e.ctrlKey && a.includes("Shift") === e.shiftKey && a.includes("Alt") === e.altKey && (e.preventDefault(), i("ItemClick", { Item: t }));
				});
			});
		}, R = (e) => {
			if (s.value === null) return;
			let t = e.target;
			a.value?.contains(t) || t instanceof Element && t.closest(".win-menu-flyout-wrap") || (w(), f.value = null);
		};
		return V(s, (e) => {
			e !== null && x(() => b(e));
		}), ee(() => {
			document.addEventListener("keydown", L), document.addEventListener("pointerdown", R, !0);
		}), T(() => {
			document.removeEventListener("keydown", L), document.removeEventListener("pointerdown", R, !0);
		}), (n, i) => (D(), l(t, null, [u("nav", {
			ref_key: "menuBarRef",
			ref: a,
			class: "win-menu-bar",
			role: "menubar",
			"aria-label": r["AutomationProperties.Name"]
		}, [(D(!0), l(t, null, j(_.value, (e, t) => (D(), l("div", {
			key: t,
			class: S(["win-menu-bar-item", {
				"is-open": s.value === t,
				"is-pointer-over": f.value === t,
				"is-pressed": p.value === t,
				"is-disabled": y(e)
			}]),
			role: "none"
		}, [u("button", {
			class: "win-menu-bar-button",
			type: "button",
			role: "menuitem",
			"aria-haspopup": !0,
			"aria-expanded": s.value === t,
			"aria-disabled": y(e),
			disabled: y(e),
			tabindex: c.value === t ? 0 : -1,
			onPointerenter: (e) => E(e, t),
			onPointerleave: (e) => O(t),
			onPointerdown: (e) => k(e, t),
			onPointerup: i[0] ||= (e) => p.value = null,
			onPointercancel: i[1] ||= (e) => p.value = null,
			onKeydown: (e) => F(e, t),
			onFocus: (e) => c.value = t
		}, [m(Rt, { Text: e.Title }, null, 8, ["Text"])], 40, _o)], 2))), 128))], 8, go), m(It, {
			Open: s.value !== null,
			AnchorRect: h.value,
			Items: v.value?.Items || [],
			MinWidth: g.value,
			Theme: e.Theme,
			Gap: 0,
			OverlayInputPassThroughElement: "",
			Placement: "BottomEdgeAlignedLeft",
			onClose: w,
			onSelect: N
		}, null, 8, [
			"Open",
			"AnchorRect",
			"Items",
			"MinWidth",
			"Theme"
		])], 64));
	}
}, [["__scopeId", "data-v-9f07c9fc"]]), yo = {
	__name: "SplitView",
	props: {
		IsPaneOpen: {
			type: Boolean,
			default: void 0
		},
		DisplayMode: {
			type: String,
			default: ""
		},
		PanePlacement: {
			type: String,
			default: ""
		},
		OpenPaneLength: {
			type: Number,
			default: void 0
		},
		CompactPaneLength: {
			type: Number,
			default: void 0
		},
		PaneBackground: {
			type: String,
			default: ""
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		IsTabStop: {
			type: Boolean,
			default: !1
		},
		isPaneOpen: {
			type: Boolean,
			default: !0
		},
		displayMode: {
			type: String,
			default: "Inline"
		},
		placement: {
			type: String,
			default: "Left"
		},
		openPaneLength: {
			type: Number,
			default: 256
		},
		compactPaneLength: {
			type: Number,
			default: 48
		},
		paneBackground: {
			type: String,
			default: ""
		}
	},
	emits: ["update:IsPaneOpen", "update:isPaneOpen"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = o(() => n.IsPaneOpen ?? n.isPaneOpen), a = o(() => n.DisplayMode || n.displayMode), s = o(() => n.PanePlacement || n.placement), c = o(() => n.OpenPaneLength ?? n.openPaneLength), d = o(() => n.CompactPaneLength ?? n.compactPaneLength), f = o(() => n.PaneBackground || n.paneBackground), p = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, h = o(() => ({
			Inline: "mode-inline",
			CompactInline: "mode-compact-inline",
			Overlay: "mode-overlay",
			CompactOverlay: "mode-compact-overlay"
		})[a.value] || "mode-inline"), g = o(() => {
			if (i.value) return c.value;
			switch (a.value) {
				case "CompactInline":
				case "CompactOverlay": return d.value;
				default: return 0;
			}
		}), _ = o(() => {
			let e = { width: g.value + "px" };
			return f.value && (e.background = f.value), e;
		}), v = o(() => {
			let e = {};
			return n.Width !== "" && (e.width = p(n.Width)), n.Height !== "" && (e.height = p(n.Height)), n.MaxWidth !== "" && (e.maxWidth = p(n.MaxWidth)), e;
		}), y = () => {
			i.value && (a.value === "Overlay" || a.value === "CompactOverlay") && (r("update:IsPaneOpen", !1), r("update:isPaneOpen", !1));
		};
		return (e, t) => (D(), l("div", {
			class: S(["win-split-view", [
				h.value,
				s.value === "Right" ? "placement-right" : "placement-left",
				{ "is-open": i.value }
			]]),
			style: C(v.value),
			onClick: y
		}, [u("div", {
			class: "split-view-pane",
			style: C(_.value),
			onClick: t[0] ||= G(() => {}, ["stop"])
		}, [u("div", {
			class: "split-view-pane-inner",
			style: C({ width: c.value + "px" })
		}, [M(e.$slots, "Pane", {}, () => [M(e.$slots, "pane")])], 4)], 4), m(Ft, {
			class: "split-view-content",
			VerticalScrollMode: "Auto",
			VerticalScrollBarVisibility: "Auto",
			HorizontalScrollMode: "Disabled",
			HorizontalScrollBarVisibility: "Disabled"
		}, {
			default: H(() => [M(e.$slots, "default")]),
			_: 3
		})], 6));
	}
}, bo = ["aria-label"], xo = {
	key: 1,
	class: "win-infobadge-icon-presenter",
	"aria-hidden": "true"
}, So = /*#__PURE__*/ dt(/* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
	__name: "InfoBadge",
	props: {
		Value: {
			type: Number,
			default: -1
		},
		IconSource: {
			type: Object,
			default: null
		},
		Style: {
			type: String,
			default: ""
		},
		Background: {
			type: String,
			default: ""
		},
		Foreground: {
			type: String,
			default: ""
		},
		Opacity: {
			type: Number,
			default: 1
		},
		Padding: {
			type: [String, Number],
			default: ""
		},
		CornerRadius: {
			type: [String, Number],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		MaxHeight: {
			type: [String, Number],
			default: ""
		},
		Margin: {
			type: [String, Number],
			default: ""
		}
	},
	setup(e) {
		let { t } = rt(), n = te(), r = A(null), i = A(""), a = A(""), u = null, d = e, f = o(() => d.Style.trim().match(/^\{StaticResource (Attention|Informational|Success|Caution|Critical)(Dot|Value|Icon)InfoBadgeStyle\}$/)), p = o(() => f.value?.[1] ?? "Default"), h = o(() => f.value?.[2] ?? ""), g = o(() => {
			let e = Math.trunc(d.Value);
			if (e < -1) throw RangeError("InfoBadge Value must be equal to or greater than -1.");
			return e;
		}), _ = o(() => {
			if (h.value !== "Icon") return null;
			switch (p.value) {
				case "Attention": return { Glyph: "" };
				case "Informational": return { Glyph: "" };
				case "Success": return { Symbol: "Accept" };
				case "Caution": return { Symbol: "Important" };
				case "Critical": return { Symbol: "Cancel" };
				default: return null;
			}
		}), v = o(() => d.IconSource ?? _.value), y = {
			Accept: "",
			Cancel: "",
			Important: "",
			Sync: "",
			Mail: "",
			Contact: "",
			Home: ""
		}, S = (e) => {
			let t = String(e ?? "");
			return t.startsWith("\\u") ? String.fromCodePoint(Number.parseInt(t.slice(2), 16)) : t.startsWith("&#x") && t.endsWith(";") ? String.fromCodePoint(Number.parseInt(t.slice(3, -1), 16)) : t.startsWith("0x") || /^[0-9A-Fa-f]{4,5}$/.test(t) ? String.fromCodePoint(Number.parseInt(t, 16)) : t;
		}, C = o(() => {
			let e = v.value;
			return e ? e.Glyph === void 0 ? e.Symbol === void 0 ? "" : y[e.Symbol] ?? String(e.Symbol) : S(e.Glyph) : "";
		}), T = o(() => g.value >= 0 ? "Value" : C.value ? v.value?.Glyph === void 0 ? "Icon" : "FontIcon" : "Dot"), E = o(() => String(g.value)), O = o(() => v.value?.FontFamily || "WinUIonWebIcons"), k = o(() => d.Foreground || "var(--InfoBadgeForeground, var(--TextOnAccentFillColorPrimaryBrush, var(--accent-text, #ffffff)))"), j = o(() => v.value?.Foreground || k.value), M = o(() => v.value?.FontSize === void 0 ? (T.value, 8) : v.value.FontSize), N = o(() => M.value), P = o(() => {
			let { class: e, style: t, ...r } = n;
			return r;
		}), F = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, I = (e) => {
			if (e === "" || e == null) return "";
			let t = String(e).split(",").map((e) => {
				let t = e.trim();
				return F(Number.isNaN(Number(t)) ? t : Number(t));
			});
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : String(e);
		}, L = (e) => {
			let t = String(e).split(",").map((e) => F(e.trim()));
			return t.length === 4 ? t.join(" ") : F(e);
		}, R = (e) => ({
			Left: "start",
			Center: "center",
			Right: "end",
			Stretch: "stretch",
			Top: "start",
			Bottom: "end"
		})[e] ?? "", ne = o(() => `${T.value === "Dot" ? 2 : 8}px`), B = () => {
			if (!r.value) return;
			let { width: e, height: t } = r.value.getBoundingClientRect();
			d.CornerRadius === "" && t > 0 && (i.value = `${t / 2}px`), d.Width === "" && d.MinWidth === "" && e > 0 && e < t ? a.value = `${t}px` : a.value && e > t + .5 && (a.value = "");
		}, H = o(() => {
			let e = {};
			return d.Background && (e["--InfoBadgeBackground"] = d.Background), d.Foreground && (e["--InfoBadgeForeground"] = d.Foreground), v.value?.Foreground && (e["--InfoBadgeIconForeground"] = v.value.Foreground), d.Opacity !== 1 && (e.opacity = d.Opacity), d.Padding !== "" && (e.padding = I(d.Padding)), d.CornerRadius === "" ? e["--InfoBadgeCornerRadius"] = i.value || ne.value : e.borderRadius = L(d.CornerRadius), a.value && (e.minWidth = a.value), d.Width !== "" && (e.width = F(d.Width)), d.Height !== "" && (e.height = F(d.Height)), d.MinWidth !== "" && (e.minWidth = F(d.MinWidth)), d.MinHeight !== "" && (e.minHeight = F(d.MinHeight)), d.MaxWidth !== "" && (e.maxWidth = F(d.MaxWidth)), d.MaxHeight !== "" && (e.maxHeight = F(d.MaxHeight)), d.Margin !== "" && (e.margin = I(d.Margin)), d.HorizontalAlignment && (e.justifySelf = R(d.HorizontalAlignment)), d.VerticalAlignment && (e.alignSelf = R(d.VerticalAlignment)), [n.style, e];
		}), U = o(() => ({
			"win-infobadge-attention": p.value === "Attention",
			"win-infobadge-informational": p.value === "Informational",
			"win-infobadge-success": p.value === "Success",
			"win-infobadge-caution": p.value === "Caution",
			"win-infobadge-critical": p.value === "Critical",
			"win-infobadge-style-fonticon-padding": h.value === "Icon" && ["Attention", "Informational"].includes(p.value)
		})), W = o(() => `win-infobadge-${T.value.toLowerCase()}`), G = o(() => ({ "win-infobadge-single-value": T.value === "Value" && g.value <= 9 })), re = o(() => ({
			"horizontal-left": d.HorizontalAlignment === "Left",
			"horizontal-center": d.HorizontalAlignment === "Center",
			"horizontal-right": d.HorizontalAlignment === "Right",
			"vertical-top": d.VerticalAlignment === "Top",
			"vertical-center": d.VerticalAlignment === "Center",
			"vertical-bottom": d.VerticalAlignment === "Bottom"
		})), K = o(() => T.value === "Value" ? t("control.infobadge.value", { value: g.value }) : T.value === "Dot" ? t("control.infobadge.dot") : t("control.infobadge.icon"));
		return ee(() => {
			B(), u = new ResizeObserver(B), r.value && u.observe(r.value);
		}), V(() => [
			T.value,
			d.Padding,
			d.Width,
			d.Height,
			d.MinWidth,
			d.MinHeight,
			d.MaxWidth,
			d.MaxHeight
		], () => x(B)), w(() => u?.disconnect()), (e, t) => (D(), l("span", b({
			ref_key: "rootRef",
			ref: r
		}, P.value, {
			class: ["win-infobadge", [
				U.value,
				W.value,
				G.value,
				re.value,
				z(n).class
			]],
			style: H.value,
			role: "status",
			"aria-label": K.value
		}), [T.value === "Value" ? (D(), s(Rt, {
			key: 0,
			class: "win-infobadge-value-text",
			Text: E.value,
			Foreground: k.value,
			FontSize: "11",
			LineHeight: "14"
		}, null, 8, ["Text", "Foreground"])) : T.value === "Dot" ? c("", !0) : (D(), l("span", xo, [m(Rt, {
			class: "win-infobadge-icon-glyph",
			Text: C.value,
			FontFamily: O.value,
			Foreground: j.value,
			FontSize: M.value,
			LineHeight: N.value
		}, null, 8, [
			"Text",
			"FontFamily",
			"Foreground",
			"FontSize",
			"LineHeight"
		])]))], 16, bo));
	}
}), [["__scopeId", "data-v-5413df73"]]), Co = new Set(["FromRight", "FromLeft"]), wo = new Set([
	"NavigationTrigger_NavigatingTo",
	"NavigationTrigger_NavigatingAway",
	"NavigationTrigger_BackNavigatingTo",
	"NavigationTrigger_BackNavigatingAway"
]), To = "NavigationTrigger_NavigatingTo", Eo = "NavigationTrigger_NavigatingAway", Do = "NavigationTrigger_BackNavigatingTo", Oo = "NavigationTrigger_BackNavigatingAway", ko = () => ({ Type: "EntranceNavigationTransitionInfo" }), Ao = () => ({ Type: "DrillInNavigationTransitionInfo" }), jo = () => ({ Type: "SuppressNavigationTransitionInfo" }), Mo = () => ({ Type: "CommonNavigationTransitionInfo" }), No = () => ({ Type: "ContinuumNavigationTransitionInfo" }), Po = (e = "FromRight") => ({
	Type: "SlideNavigationTransitionInfo",
	Effect: Co.has(e) ? e : "FromRight"
}), Fo = (e) => {
	if (!e) return null;
	let { Type: t } = e;
	return t === "EntranceNavigationTransitionInfo" ? ko() : t === "DrillInNavigationTransitionInfo" ? Ao() : t === "SuppressNavigationTransitionInfo" ? jo() : t === "CommonNavigationTransitionInfo" ? Mo() : t === "ContinuumNavigationTransitionInfo" ? No() : t === "SlideNavigationTransitionInfo" ? Po(e.Effect) : null;
}, Io = (e = To) => {
	let t = String(e ?? "").trim();
	if (wo.has(t)) return t;
	let n = `NavigationTrigger_${t}`;
	return wo.has(n) ? n : To;
}, Lo = (e, t = To) => {
	let n = Fo(e), r = Io(t);
	return n ? n.Type === "SlideNavigationTransitionInfo" ? `SlideNavigationTransitionInfo ${n.Effect} ${r}` : `${n.Type} ${r}` : `DefaultNavigationTransitionInfo ${r}`;
}, Ro = ["disabled", "aria-label"], zo = {
	key: 1,
	class: "win-nav-top-fixed win-nav-top-pane-header"
}, Bo = {
	key: 0,
	class: "win-nav-item-header"
}, Vo = {
	key: 1,
	class: "win-nav-item-separator"
}, Ho = ["aria-disabled", "onClick"], Uo = {
	key: 0,
	class: "icon"
}, Wo = ["aria-disabled", "onClick"], Go = {
	key: 0,
	class: "icon"
}, Ko = ["onClick"], qo = ["aria-label"], Jo = { class: "win-nav-top-pane-custom-content" }, Yo = {
	key: 3,
	class: "win-nav-top-fixed win-nav-top-pane-search"
}, Xo = {
	key: 4,
	class: "win-nav-top-fixed win-nav-top-pane-footer"
}, Zo = {
	key: 0,
	class: "win-nav-item-header"
}, Qo = {
	key: 1,
	class: "win-nav-item-separator"
}, $o = ["aria-disabled", "onClick"], es = {
	key: 0,
	class: "icon"
}, ts = ["data-value"], ns = ["data-value"], rs = ["data-value"], is = {
	key: 0,
	class: "icon"
}, as = {
	key: 2,
	class: "icon win-nav-group-chevron"
}, os = {
	class: "win-nav-item win-nav-more-button",
	"data-value": "__more"
}, ss = ["disabled", "aria-label"], cs = {
	key: 1,
	class: "win-nav-pane-command-row"
}, ls = ["aria-label"], us = ["aria-hidden", "inert"], ds = {
	key: 0,
	class: "win-nav-pane-title-holder"
}, fs = { class: "win-nav-pane-search" }, ps = ["aria-label"], ms = {
	key: 3,
	class: "win-nav-pane-custom-content"
}, hs = { class: "win-nav-menu" }, gs = {
	key: 0,
	class: "win-nav-item-header"
}, _s = {
	key: 1,
	class: "win-nav-item-separator"
}, vs = ["aria-disabled", "onClick"], ys = {
	key: 0,
	class: "icon"
}, bs = ["aria-disabled", "onClick"], xs = {
	key: 0,
	class: "icon"
}, Ss = ["onClick"], Cs = ["aria-hidden", "inert"], ws = ["aria-disabled", "onClick"], Ts = {
	key: 0,
	class: "icon"
}, Es = { class: "win-nav-footer" }, Ds = {
	key: 0,
	class: "win-nav-pane-footer"
}, Os = {
	key: 0,
	class: "win-nav-item-header"
}, ks = {
	key: 1,
	class: "win-nav-item-separator"
}, As = ["aria-disabled", "onClick"], js = {
	key: 0,
	class: "icon"
}, Ms = { class: "win-nav-content" }, Ns = {
	key: 0,
	class: "win-nav-page-header"
}, Ps = { class: "win-nav-content-inner" }, Fs = {
	key: 1,
	class: "win-nav-content-overlay"
}, Is = { class: "win-nav-more-panel" }, Ls = {
	key: 0,
	class: "win-nav-item-header"
}, Rs = {
	key: 1,
	class: "win-nav-item-separator"
}, zs = ["aria-disabled", "onClick"], Bs = {
	key: 0,
	class: "icon"
}, Vs = ["aria-disabled", "onClick"], Hs = {
	key: 0,
	class: "icon"
}, Us = ["onClick"], Ws = { class: "win-nav-group-children-inner" }, Gs = ["aria-disabled", "onClick"], Ks = {
	key: 0,
	class: "icon"
}, qs = 16, Js = "cubic-bezier(0.1, 0.9, 0.2, 1)", Ys = "cubic-bezier(0.4, 0.0, 0.7, 0.3)", Xs = {
	__name: "NavigationView",
	props: {
		PaneDisplayMode: {
			type: String,
			default: "Auto"
		},
		SelectedItem: {
			type: [
				Object,
				String,
				Number
			],
			default: null
		},
		MenuItems: {
			type: Array,
			default: () => []
		},
		MenuItemsSource: {
			type: [Array, Object],
			default: null
		},
		FooterMenuItems: {
			type: Array,
			default: () => []
		},
		FooterMenuItemsSource: {
			type: [Array, Object],
			default: null
		},
		IsBackButtonVisible: {
			type: String,
			default: "Auto"
		},
		IsBackEnabled: {
			type: Boolean,
			default: !1
		},
		IsSettingsVisible: {
			type: Boolean,
			default: !0
		},
		IsNavigationPending: {
			type: Boolean,
			default: !1
		},
		IsPaneToggleButtonVisible: {
			type: Boolean,
			default: !0
		},
		IsPaneOpen: {
			type: Boolean,
			default: !0
		},
		IsPaneVisible: {
			type: Boolean,
			default: !0
		},
		OpenPaneLength: {
			type: Number,
			default: 320
		},
		CompactPaneLength: {
			type: Number,
			default: 48
		},
		CompactModeThresholdWidth: {
			type: Number,
			default: 641
		},
		ExpandedModeThresholdWidth: {
			type: Number,
			default: 1008
		},
		PaneTitle: {
			type: String,
			default: ""
		},
		Header: {
			type: [
				String,
				Number,
				Object
			],
			default: ""
		},
		HeaderTemplate: {
			type: [Object, Function],
			default: null
		},
		PaneToggleButtonStyle: {
			type: [Object, String],
			default: null
		},
		MenuItemTemplate: {
			type: [Object, Function],
			default: null
		},
		MenuItemTemplateSelector: {
			type: [Object, Function],
			default: null
		},
		MenuItemContainerStyle: {
			type: [Object, String],
			default: null
		},
		MenuItemContainerStyleSelector: {
			type: [Object, Function],
			default: null
		},
		AutoSuggestBox: {
			type: Object,
			default: null
		},
		PaneFooter: {
			type: Object,
			default: null
		},
		PaneHeader: {
			type: Object,
			default: null
		},
		PaneCustomContent: {
			type: Object,
			default: null
		},
		ContentOverlay: {
			type: Object,
			default: null
		},
		AlwaysShowHeader: {
			type: Boolean,
			default: !0
		},
		SelectionFollowsFocus: {
			type: String,
			default: "Disabled"
		},
		ShoulderNavigationEnabled: {
			type: String,
			default: "Never"
		},
		OverflowLabelMode: {
			type: String,
			default: "NoLabel"
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		MaxHeight: {
			type: [String, Number],
			default: ""
		},
		Margin: {
			type: [String, Number],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	emits: [
		"update:SelectedItem",
		"update:IsPaneOpen",
		"SelectionChanged",
		"ItemInvoked",
		"DisplayModeChanged",
		"BackRequested",
		"PaneOpening",
		"PaneOpened",
		"PaneClosing",
		"PaneClosed",
		"Expanding",
		"Collapsed"
	],
	setup(e, { expose: n, emit: r }) {
		let { t: i } = rt(), a = ne(), d = e, f = g(), p = Object.keys(f?.vnode.props ?? {}).some((e) => e.replace(/-/g, "").toLowerCase() === "selecteditem"), h = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, _ = (e) => {
			if (e === "" || e == null) return "";
			let t = String(e).split(",").map((e) => h(e.trim()));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : String(e);
		}, v = (e) => ({
			Left: "start",
			Center: "center",
			Right: "end",
			Stretch: "stretch",
			Top: "start",
			Bottom: "end"
		})[e] ?? "", y = (e) => e && typeof e == "object" ? e.Tag ?? e.Value ?? e.Name ?? e.value : e, T = /* @__PURE__ */ new WeakMap(), E = 0, O = (e, t) => {
			if (!e || typeof e != "object") return y(e) ?? t;
			let n = R(e);
			return T.has(n) || (E += 1, T.set(n, `nvi-${E}`)), T.get(n);
		}, N = (e, t = "item") => {
			let n = e?.Type ?? e?.type ?? (e?.IsHeader ? "Header" : e?.IsSeparator ? "Separator" : "Item"), r = n === "NavigationViewItemHeader" ? "Header" : n === "NavigationViewItemSeparator" ? "Separator" : n, i = e?.MenuItems ?? e?.children;
			return {
				value: O(e, `__${String(r).toLowerCase()}-${t}`),
				tag: y(e),
				label: e?.Content ?? e?.Name ?? e?.Text ?? e?.label ?? "",
				icon: e?.Icon ?? e?.Glyph ?? e?.icon ?? "",
				infoBadge: e?.InfoBadge ?? null,
				automationName: e?.["AutomationProperties.Name"] ?? e?.AutomationProperties?.Name ?? "",
				tooltip: e?.ToolTip ?? e?.Tooltip ?? e?.tooltip ?? "",
				type: r,
				children: Array.isArray(i) ? i.map((e, n) => N(e, `${t}-${n}`)) : null,
				isEnabled: (e?.IsEnabled ?? e?.isEnabled ?? !(e?.Disabled ?? e?.disabled ?? !1)) !== !1,
				selectsOnInvoked: (e?.SelectsOnInvoked ?? e?.selectsOnInvoked) !== !1,
				source: e
			};
		}, P = (e, t) => Array.isArray(e) && e.length ? e : Array.isArray(t) ? t : [], F = o(() => P(d.MenuItems, d.MenuItemsSource).map((e, t) => N(e, `menu-${t}`))), I = o(() => P(d.FooterMenuItems, d.FooterMenuItemsSource).map((e, t) => N(e, `footer-${t}`))), te = A(d.SelectedItem), W = o(() => [...F.value, ...I.value].flatMap((e) => [e, ...e.children || []])), re = (e) => {
			if (e?.IsSettingsItem || y(e) === "settings") return "settings";
			if (e && typeof e == "object") {
				let t = R(e), n = W.value.find((n) => n.source === e || R(n.source) === t);
				if (n) return n.value;
			}
			let t = y(e);
			return W.value.find((e) => e.tag === t)?.value ?? t;
		}, K = o(() => re(te.value)), q = {
			get paneDisplayMode() {
				return d.PaneDisplayMode;
			},
			get selectedValue() {
				return K.value;
			},
			get menuItems() {
				return F.value;
			},
			get footerItems() {
				return I.value;
			},
			get isBackButtonVisible() {
				return d.IsBackButtonVisible;
			},
			get isSettingsVisible() {
				return d.IsSettingsVisible;
			},
			get isPaneToggleButtonVisible() {
				return d.IsPaneToggleButtonVisible;
			},
			get isPaneOpen() {
				return d.IsPaneOpen;
			},
			get openPaneLength() {
				return d.OpenPaneLength;
			},
			get compactPaneLength() {
				return d.CompactPaneLength;
			},
			get compactModeThresholdWidth() {
				return d.CompactModeThresholdWidth;
			},
			get expandedModeThresholdWidth() {
				return d.ExpandedModeThresholdWidth;
			},
			get paneTitle() {
				return d.PaneTitle;
			},
			get header() {
				return d.Header;
			},
			get settingsValue() {
				return "settings";
			},
			get settingsLabel() {
				return i("text.settings");
			},
			get settingsIcon() {
				return "";
			}
		}, J = o(() => q.settingsLabel), ie = r, Y = A(!d.IsPaneOpen || d.PaneDisplayMode === "LeftMinimal"), X = A(""), Z = A(null), ae = A(null), Q = A(null), oe = A(null), se = A(null), ce = A(null), le = A(null), ue = A(null), de = A(null), fe = A(null), $ = A({ opacity: "0" }), pe = A(!1), me = k({}), he = k({}), ge = k({}), _e = k({}), ve = A(!1), ye = A(null), be = A([]), xe = A(null), Se = A(!1), Ce = A(null), we = A(Infinity), Te = A({}), Ee = A(40), De = A(typeof window > "u" ? q.expandedModeThresholdWidth : window.innerWidth), Oe = o(() => q.paneDisplayMode), ke = o(() => {
			if (Oe.value !== "Auto") return Oe.value;
			let e = De.value || (typeof window > "u" ? q.expandedModeThresholdWidth : window.innerWidth);
			return e >= q.expandedModeThresholdWidth ? "Left" : e >= q.compactModeThresholdWidth ? "LeftCompact" : "LeftMinimal";
		}), Ae = o(() => ke.value === "Top"), je = o(() => Ae.value ? "Bottom" : "RightEdgeAlignedTop"), Me = o(() => ke.value === "LeftMinimal"), Ne = o(() => ke.value === "LeftCompact"), Pe = o(() => Me.value || Ne.value), Fe = o(() => !Me.value || !Y.value || X.value === "closing"), Ie = o(() => !Ae.value && Y.value && !Me.value), Le = o(() => !Ie.value && (!Me.value || !Y.value)), Re = (e) => {
			let t = e?.tooltip || (!Ae.value && Ie.value ? e?.label : "");
			return {
				tabindex: e?.isEnabled === !1 ? -1 : 0,
				...e?.automationName ? { "aria-label": e.automationName } : {},
				...t ? { "tooltipservice.tooltip": t } : {}
			};
		};
		o(() => Me.value && Y.value && X.value === "closing");
		let ze = o(() => Fe.value && !Ie.value), Be = o(() => ze.value && !Y.value), Ve = o(() => Be.value), He = o(() => i(Y.value ? "text.open-navigation" : "text.close-navigation")), Ue = o(() => Ae.value || Me.value ? "Minimal" : Ne.value ? "Compact" : "Expanded"), We = o(() => q.isSettingsVisible), Ge = o(() => q.isPaneToggleButtonVisible), Ke = o(() => q.paneTitle), qe = o(() => q.header), Je = o(() => !!(qe.value || a.Header) && (d.AlwaysShowHeader || !Ae.value && Ue.value === "Minimal")), Ye = o(() => q.settingsValue);
		o(() => q.settingsLabel);
		let Xe = o(() => q.settingsIcon), Ze = o(() => q.isBackButtonVisible === "Visible" ? !0 : q.isBackButtonVisible !== "Collapsed"), Qe = o(() => Ze.value && !Ae.value), $e = o(() => Me.value || Ne.value ? {
			openDurationMs: 350,
			closeDurationMs: 120,
			easing: "cubic-bezier(0.1, 0.9, 0.2, 1)"
		} : {
			openDurationMs: 200,
			closeDurationMs: 200,
			easing: "cubic-bezier(0, 0.35, 0.15, 1)"
		}), et = (e, t = $e.value) => e ? t.closeDurationMs : t.openDurationMs, tt = o(() => ({
			"--win-nav-open-pane-length": `${q.openPaneLength}px`,
			"--win-nav-compact-pane-length": `${q.compactPaneLength}px`,
			"--win-nav-header-margin-left": `${Me.value ? (Ge.value ? 40 : 0) + (Qe.value ? 40 : 0) - 24 : 56}px`,
			"--win-nav-pane-duration": `${et(Y.value)}ms`,
			"--win-nav-pane-open-duration": `${$e.value.openDurationMs}ms`,
			"--win-nav-pane-close-duration": `${$e.value.closeDurationMs}ms`,
			"--win-nav-pane-easing": $e.value.easing
		})), nt = o(() => {
			let e = { ...tt.value };
			return d.Width !== "" && (e.width = h(d.Width)), d.Height !== "" && (e.height = h(d.Height)), d.MinWidth !== "" && (e.minWidth = h(d.MinWidth)), d.MinHeight !== "" && (e.minHeight = h(d.MinHeight)), d.MaxWidth !== "" && (e.maxWidth = h(d.MaxWidth)), d.MaxHeight !== "" && (e.maxHeight = h(d.MaxHeight)), d.Margin !== "" && (e.margin = _(d.Margin)), d.HorizontalAlignment && (e.justifySelf = v(d.HorizontalAlignment)), d.VerticalAlignment && (e.alignSelf = v(d.VerticalAlignment)), e;
		}), it = o(() => [
			Ae.value ? "is-top" : "is-left",
			Pe.value ? "is-overlay-left" : "",
			Me.value ? "is-left-minimal" : "",
			Ne.value ? "is-left-compact" : "",
			d.IsPaneVisible ? "" : "is-pane-hidden"
		]), at = {}, ot = {}, st = null, ct = null, lt = !1, ut = null, dt = null, ft = null, pt = !1, mt = 0, ht = !1, gt = null, _t = d.IsPaneOpen === !1, vt = !1, yt = -Infinity, bt = 0, xt = 0, St = null, Ct = !1, wt = A(""), Tt = A(""), Et = A(""), Dt = !1, Ot = !1, kt = !1, At = !1, jt = !1, Mt = !1, Nt = !1, Pt = !1, Lt = o(() => d.IsBackEnabled), zt = (e, t, n) => {
			let r = Math.abs(n - t), i = Math.min(t, n), a = (t) => e === "x" ? `translateX(${t}px)` : `translateY(${t}px)`, o = e === "x" ? "width" : "height";
			return [
				{
					transform: a(t),
					[o]: `${qs}px`,
					offset: 0,
					easing: "cubic-bezier(0.9, 0.1, 1, 0.2)"
				},
				{
					transform: a(i),
					[o]: `${r + qs}px`,
					offset: .333,
					easing: Js
				},
				{
					transform: a(n),
					[o]: `${qs}px`,
					offset: 1
				}
			];
		}, Bt = (e) => {
			let t = 0, n = 0, r = e;
			for (; r;) t += r.offsetLeft || 0, n += r.offsetTop || 0, r = r.offsetParent;
			let i = e?.parentElement;
			for (; i;) t -= i.scrollLeft || 0, n -= i.scrollTop || 0, i = i.parentElement;
			return {
				left: t,
				top: n
			};
		}, Vt = (e) => {
			let t = Bt(e);
			return {
				left: t.left,
				top: t.top,
				width: e.offsetWidth || 1,
				height: e.offsetHeight || 1
			};
		}, Ht = (e, t, n = Vt(t)) => {
			let r = Bt(e), i = r.left - n.left, a = r.top - n.top;
			return {
				left: i,
				right: i + e.offsetWidth,
				top: a,
				bottom: a + e.offsetHeight
			};
		}, Ut = (e) => {
			e.style.maskImage = "", e.style.maskSize = "", e.style.maskPosition = "", e.style.maskRepeat = "", e.style.removeProperty("-webkit-mask-image"), e.style.removeProperty("-webkit-mask-size"), e.style.removeProperty("-webkit-mask-position"), e.style.removeProperty("-webkit-mask-repeat");
		}, Wt = (e, t, n, r = null) => {
			let i = Vt(e), a = t === "x" ? i.width : i.height, o = t === "x" ? "left" : "top", s = t === "x" ? "right" : "bottom", c = (e) => {
				if (!e) return null;
				let t = Math.max(0, Math.min(a, e[o])), n = Math.max(t, Math.min(a, e[s]));
				return n > t ? {
					start: t,
					end: n
				} : null;
			}, l = c(n), u = c(r);
			if (!l) {
				Ut(e), e.style.clipPath = "inset(0 100% 0 0)";
				return;
			}
			let d = u && l.start <= u.end && u.start <= l.end;
			if (!u || d) {
				Ut(e);
				let n = u ? Math.min(l.start, u.start) : l.start, r = u ? Math.max(l.end, u.end) : l.end;
				e.style.clipPath = t === "x" ? `inset(0px ${Math.max(0, a - r)}px 0px ${n}px)` : `inset(${n}px 0px ${Math.max(0, a - r)}px 0px)`;
				return;
			}
			let f = "linear-gradient(#000 0 0), linear-gradient(#000 0 0)", p = t === "x" ? `${l.end - l.start}px 100%, ${u.end - u.start}px 100%` : `100% ${l.end - l.start}px, 100% ${u.end - u.start}px`, m = t === "x" ? `${l.start}px 0px, ${u.start}px 0px` : `0px ${l.start}px, 0px ${u.start}px`;
			e.style.clipPath = "none", e.style.maskImage = f, e.style.maskSize = p, e.style.maskPosition = m, e.style.maskRepeat = "no-repeat", e.style.setProperty("-webkit-mask-image", f), e.style.setProperty("-webkit-mask-size", p), e.style.setProperty("-webkit-mask-position", m), e.style.setProperty("-webkit-mask-repeat", "no-repeat");
		}, Gt = (e, t) => {
			let n = $.value || {};
			for (let r of Object.keys(n)) r in t || (e.style[r] = "");
			for (let [n, r] of Object.entries(t)) e.style[n] = r;
			$.value = t;
		}, Kt = (e, t, n) => {
			let r = getComputedStyle(e).transform;
			if (r && r !== "none") {
				let e = r.match(/^matrix3d\((.+)\)$/);
				if (e) {
					let n = e[1].split(",").map((e) => Number.parseFloat(e.trim())), r = t === "x" ? n[12] : n[13];
					if (Number.isFinite(r)) return r;
				}
				let n = r.match(/^matrix\((.+)\)$/);
				if (n) {
					let e = n[1].split(",").map((e) => Number.parseFloat(e.trim())), r = t === "x" ? e[4] : e[5];
					if (Number.isFinite(r)) return r;
				}
			}
			let i = ($.value.transform || "").match(t === "x" ? /translateX\(([-\d.]+)px\)/ : /translateY\(([-\d.]+)px\)/);
			return i ? Number.parseFloat(i[1]) : n;
		}, qt = (e) => (mt += 1, e?.getAnimations().forEach((e) => e.cancel()), mt);
		o(() => {
			let e = {};
			for (let t of q.menuItems) if (t.children) for (let n of t.children) e[n.value] = t.value;
			return e;
		});
		let Jt = o(() => {
			let e = tn(q.selectedValue);
			return e ? e.value : q.menuItems.some((e) => e.value === q.selectedValue) ? q.selectedValue : null;
		}), Yt = (e) => {
			let t = Te.value[e];
			if (Number.isFinite(t) && t > 0) return t;
			let n = q.menuItems.find((t) => t.value === e);
			if (!n) return 84;
			let r = String(n.label || "").length * 7.5, i = n.icon ? 56 : 32, a = n.infoBadge ? 28 : 0, o = n.children ? n.icon ? 24 : 28 : 0;
			return Math.ceil(r + i + a + o);
		}, Xt = (e) => e.length ? e.reduce((e, t) => e + Yt(t), 0) : 0, Zt = o(() => {
			if (!Ae.value) return {
				visibleValues: q.menuItems.map((e) => e.value),
				overflowValues: []
			};
			let e = q.menuItems.map((e) => e.value), t = we.value;
			if (!Number.isFinite(t) || t <= 0 || Xt(e) <= t) return {
				visibleValues: e,
				overflowValues: []
			};
			let n = Jt.value, r = e.includes(n) ? n : null, i = Ee.value, a = Math.max(0, t - i), o = [];
			for (let t of e) for ((Xt([...o, t]) <= a || t === r) && o.push(t); Xt(o) > a && o.length > 1;) {
				let e = [...o].reverse().findIndex((e) => e !== r);
				if (e < 0) break;
				o.splice(o.length - 1 - e, 1);
			}
			r && !o.includes(r) && (o = [r]);
			let s = new Set(o);
			return {
				visibleValues: o,
				overflowValues: e.filter((e) => !s.has(e))
			};
		}), Qt = o(() => {
			if (!Ae.value) return q.menuItems;
			let e = new Set(Zt.value.visibleValues);
			return q.menuItems.filter((t) => e.has(t.value));
		}), $t = o(() => {
			if (!Ae.value) return [];
			let e = new Set(Zt.value.overflowValues);
			return q.menuItems.filter((t) => e.has(t.value));
		}), en = (e) => e.children ? e.children.some((e) => e.value === q.selectedValue) : !1, tn = (e) => q.menuItems.find((t) => t.children && t.children.some((t) => t.value === e)), nn = (e) => {
			for (let t of [...q.menuItems, ...q.footerItems]) {
				if (t.value === e) return t;
				let n = t.children?.find((t) => t.value === e);
				if (n) return n;
			}
			return null;
		}, rn = () => ({
			Content: J.value,
			Tag: q.settingsValue,
			Icon: q.settingsIcon,
			IsSettingsItem: !0
		}), an = (e, t = !1) => {
			if (t || e === Ye.value) return q.menuItems.length + q.footerItems.length;
			let n = tn(e), r = n && Ae.value ? n.value : e;
			return [...q.menuItems, ...q.footerItems].findIndex((e) => e.value === r);
		}, on = (e, t = !1) => {
			if (!Ae.value) return ko();
			let n = an(K.value, K.value === Ye.value), r = an(e, t);
			return n < 0 || r < 0 || n === r ? ko() : Po(r > n ? "FromRight" : "FromLeft");
		}, sn = null, cn = (e, { invoked: t = !0, isSettings: n = !1, collapsePane: r = !1 } = {}) => {
			let i = n ? null : nn(e), a = n ? rn() : i?.source;
			if (!a || !n && i.isEnabled === !1) return !1;
			let o = on(e, n);
			return t && ie("ItemInvoked", {
				InvokedItem: a.Content ?? a.label,
				IsSettingsInvoked: n,
				InvokedItemContainer: a,
				RecommendedNavigationTransitionInfo: o
			}), !n && (a.SelectsOnInvoked ?? a.selectsOnInvoked) === !1 ? !1 : K.value === e ? !0 : (p ? sn = {
				value: e,
				collapsePane: r
			} : te.value = a, ie("update:SelectedItem", typeof d.SelectedItem == "object" ? a : y(a)), ie("SelectionChanged", {
				SelectedItem: a,
				IsSettingsSelected: n,
				SelectedItemContainer: a,
				RecommendedNavigationTransitionInfo: o
			}), !0);
		}, ln = (e) => e === Ye.value || q.footerItems.some((t) => t.value === e), un = (e) => {
			for (let [t, n] of Object.entries(at)) if (n === e) return t;
			return null;
		}, dn = (e, t) => {
			t ? at[e] = t : delete at[e];
		}, fn = (e, t) => {
			t ? ot[e] = t : delete ot[e];
		}, pn = (e) => {
			let t = re(e), n = nn(t);
			if (n?.children) {
				if (me[t]) {
					delete he[t];
					return;
				}
				ie("Expanding", {
					ExpandingItemContainer: n.source,
					ExpandingItem: n.source
				}), delete he[t], me[t] = !0, x(() => gn(t));
			}
		}, mn = (e) => {
			let t = re(e), n = nn(t);
			!n?.children || !me[t] || (he[t] = !0, me[t] = !1, ie("Collapsed", {
				CollapsedItemContainer: n.source,
				CollapsedItem: n.source
			}));
		};
		n({
			DisplayMode: Ue,
			SettingsItem: o(rn),
			MenuItemFromContainer: (e) => {
				let t = un(e);
				return t === q.settingsValue ? rn() : nn(t)?.source ?? null;
			},
			ContainerFromMenuItem: (e) => at[re(e)] ?? null,
			Expand: pn,
			Collapse: mn
		});
		let hn = (e) => _e[e] || "", gn = (e) => {
			let t = ot[e];
			t && (ge[e] = t.scrollHeight);
		}, _n = () => {
			for (let e of q.menuItems) e.children && gn(e.value);
		}, vn = () => {
			!Pe.value || Y.value || requestAnimationFrame(() => {
				Pe.value && !Y.value && Qn();
			});
		}, yn = (e) => {
			let t = tn(e);
			return t && (Ae.value || Ie.value) ? {
				value: t.value,
				isChild: !1
			} : {
				value: e,
				isChild: !!t
			};
		}, bn = (e) => {
			let t = yn(e);
			Wn(t.value, t.isChild);
		}, xn = (e) => {
			let t = tn(e);
			t && !Ae.value && !Ie.value && !me[t.value] && (delete he[t.value], me[t.value] = !0, x(() => gn(t.value)));
		}, Sn = (e, { collapsePane: t = !1 } = {}) => {
			if (e == null || e === "") {
				ct = null, lt = !1, ht = !1, $.value = {
					opacity: "0",
					transition: "none"
				};
				return;
			}
			xn(e), x(() => {
				kn(), x(() => {
					let n = yn(e);
					if (Me.value && Y.value && X.value !== "closing") {
						ct = at[n.value] || null, lt = n.isChild, pe.value = n.isChild, ht = !1, $.value = {
							opacity: "0",
							transition: "none"
						};
						return;
					}
					Wn(n.value, n.isChild), t && vn();
				});
			});
		}, Cn = (e, t = null, { collapsePane: n = !0 } = {}) => {
			if (cn(e, { collapsePane: n })) {
				if (p) {
					K.value === e && n && vn();
					return;
				}
				xn(e), x(() => {
					kn(), x(() => {
						t === null ? bn(e) : Wn(e, t), n && vn();
					});
				});
			}
		}, wn = (e) => {
			e.isEnabled && Cn(e.value, !1);
		}, Tn = (e, t) => {
			t.isEnabled && Cn(t.value, !0);
		}, En = (e) => {
			if (e.key !== "Enter" && e.key !== " ") return;
			let t = e.target?.closest?.(".win-nav-item");
			if (!t) return;
			let n = un(t);
			if (!n) return;
			if (e.preventDefault(), n === Ye.value) {
				Jn();
				return;
			}
			let r = nn(n);
			if (!r || !r.isEnabled) return;
			let i = tn(n);
			i ? Tn(i, r) : r.children ? zn(r) : wn(r);
		}, Dn = () => {
			yt = performance.now();
		}, On = (e) => {
			if (d.SelectionFollowsFocus !== "Enabled") return;
			let t = e.target?.closest?.(".win-nav-item");
			if (!t || t.classList.contains("is-disabled") || performance.now() - yt < 1e3 || !t.matches(":focus-visible")) return;
			let n = un(t);
			if (!n) return;
			if (n === Ye.value) {
				Jn();
				return;
			}
			let r = nn(n);
			!r || !r.isEnabled || r.children || wn(r);
		}, kn = () => {
			if (!Ae.value) return;
			let e = ae.value, t = le.value, n = fe.value, r = ue.value;
			if (!e) return;
			let i = e.clientWidth || e.offsetWidth, a = t?.offsetWidth || 0, o = n?.offsetWidth || 0, s = Array.from(e.children).filter((e) => e.classList.contains("win-nav-top-fixed")).reduce((e, t) => e + t.offsetWidth, 0), c = Math.max(0, i - a - o - s);
			if (Math.abs(we.value - c) >= .5 && (we.value = c), r) {
				let e = {};
				r.querySelectorAll("[data-value]").forEach((t) => {
					let n = t.getAttribute("data-value"), r = getComputedStyle(t), i = Number.parseFloat(r.marginLeft || "0") + Number.parseFloat(r.marginRight || "0"), a = Math.ceil(t.offsetWidth + i);
					n === "__more" ? Ee.value = a : n && (e[n] = a);
				});
				let t = Te.value, n = Object.keys(e);
				(Object.keys(t).length !== n.length || n.some((n) => t[n] !== e[n])) && (Te.value = e);
			}
		}, An = () => {
			let e = de.value;
			e && (Ce.value = e.getBoundingClientRect(), Se.value = !0);
		}, jn = () => {
			Se.value = !1;
		}, Mn = () => {
			Se.value ? jn() : An();
		}, Nn = (e) => {
			e.isEnabled && (jn(), Cn(e.value, !1));
		}, Pn = (e, t) => {
			t.isEnabled && (jn(), Cn(t.value, !0));
		}, Fn = (e) => {
			if (e.isEnabled) {
				if (e.selectsOnInvoked !== !1 && !en(e)) {
					Cn(e.value, !1), jn();
					return;
				}
				e.selectsOnInvoked === !1 && cn(e.value), me[e.value] ? mn(e.source) : pn(e.source), _e[e.value] = me[e.value] ? "chevron-open" : "chevron-close";
			}
		}, In = (e) => {
			e.isEnabled && (me[e.value] ? mn(e.source) : pn(e.source), _e[e.value] = me[e.value] ? "chevron-open" : "chevron-close");
		}, Ln = (e) => {
			let t = me[e.value], n = en(e), r = Q.value, i = n && !t ? at[e.value] : null, a = i && r ? Ht(i, r) : null, o = a ? a.top + (a.bottom - a.top) / 2 - 8 : null;
			t ? (he[e.value] = !0, mn(e.source)) : (delete he[e.value], pn(e.source)), x(() => gn(e.value)), n ? x(() => {
				gn(e.value);
				let n = t ? at[e.value] : at[q.selectedValue];
				if (n) {
					if (st = ct, ct = n, lt = !t, t) {
						Dr({
							sourceY: o,
							sourceRect: a,
							sourceIsChild: !0,
							target: n,
							targetIsChild: !1,
							hideSourceImmediately: !0
						}) || (pt = !0, vr(), requestAnimationFrame(() => {
							pt = !1;
						}));
						return;
					}
					Dr({
						sourceY: o,
						sourceRect: a,
						sourceIsChild: !1,
						target: n,
						targetIsChild: !0,
						expandDown: !0
					}) || (pt = !0, vr(), requestAnimationFrame(() => {
						pt = !1;
					}));
				}
			}) : Vn();
		}, Rn = (e) => {
			if (e.isEnabled) {
				if (Ae.value || Y.value) {
					zn(e, !1);
					return;
				}
				Ln(e);
			}
		}, zn = (e, t = !0) => {
			if (e.isEnabled) {
				if (Ae.value) {
					t && (e.selectsOnInvoked === !1 ? cn(e.value) : Cn(e.value, !1, { collapsePane: !1 }));
					let n = at[e.value];
					if (n) {
						ye.value = n.getBoundingClientRect(), xe.value = e.value;
						let t = [];
						e.selectsOnInvoked !== !1 && t.push({
							Text: e.label,
							Value: e.value,
							Icon: e.icon,
							IsHeader: !0,
							IsEnabled: e.isEnabled
						});
						for (let n of e.children || []) t.push({
							Text: n.label,
							Value: n.value,
							Icon: n.icon,
							IsEnabled: n.isEnabled
						});
						be.value = t, ve.value = !ve.value, ve.value ? ie("Expanding", {
							ExpandingItemContainer: e.source,
							ExpandingItem: e.source
						}) : ie("Collapsed", {
							CollapsedItemContainer: e.source,
							CollapsedItem: e.source
						}), _e[e.value] = ve.value ? "chevron-open" : "chevron-close";
					}
					return;
				}
				if (Y.value) {
					t && (e.selectsOnInvoked === !1 ? cn(e.value) : Cn(e.value, !1, { collapsePane: !1 }));
					let n = at[e.value];
					if (n) {
						let t = n.getBoundingClientRect(), r = ae.value?.getBoundingClientRect(), i = r ? r.left + q.compactPaneLength : t.right;
						ye.value = {
							left: i,
							right: i,
							top: t.top,
							bottom: t.bottom,
							width: 0,
							height: t.height
						}, xe.value = e.value;
						let a = [];
						e.selectsOnInvoked !== !1 && a.push({
							Text: e.label,
							Value: e.value,
							Icon: e.icon,
							IsHeader: !0,
							IsEnabled: e.isEnabled
						});
						for (let t of e.children || []) a.push({
							Text: t.label,
							Value: t.value,
							Icon: t.icon,
							IsEnabled: t.isEnabled
						});
						be.value = a, ve.value = !0, ie("Expanding", {
							ExpandingItemContainer: e.source,
							ExpandingItem: e.source
						}), _e[e.value] = "chevron-open";
					}
					return;
				}
				e.selectsOnInvoked === !1 ? e.selectsOnInvoked === !1 && cn(e.value) : Cn(e.value, !1, { collapsePane: !1 }), Ln(e);
			}
		}, Bn = null, Vn = () => {
			Bn && cancelAnimationFrame(Bn);
			let e = Q.value, t = e?.querySelector(".win-nav-indicator");
			if (!e || !t || !ct || !ae.value) return;
			t.getAnimations().forEach((e) => e.cancel());
			let n = performance.now(), r = () => {
				if (!ct || !ae.value || !ae.value.contains(ct)) {
					Bn = null;
					return;
				}
				let t = Ht(ct, e), i = t.top + (t.bottom - t.top) / 2 - 8;
				Wt(e, "y", t), $.value = {
					transform: `translateY(${i}px)`,
					height: "16px",
					opacity: "1",
					transition: "none"
				}, Bn = performance.now() - n < 350 ? requestAnimationFrame(r) : null;
			};
			Bn = requestAnimationFrame(r);
		}, Hn = () => {
			ve.value = !1, xe.value && (_e[xe.value] = "chevron-close");
		}, Un = (e) => {
			if (e.IsEnabled === !1) return;
			let t = e.Value, n = e.IsHeader;
			if (Ae.value && xe.value && !n && (vt = !0), cn(t, { collapsePane: !0 })) {
				if (ve.value = !1, xe.value && (_e[xe.value] = "chevron-close"), p) {
					K.value === t && vn();
					return;
				}
				x(() => {
					if (Ae.value) {
						let e = at[xe.value];
						e && !n ? Gn(e, !1) : Wn(t, !1);
					} else {
						let e = tn(t);
						e ? Gn(at[e.value], !1) : Wn(t, !1);
					}
					vn();
				});
			}
		}, Wn = (e, t) => {
			let n = at[e];
			n && Gn(n, t);
		}, Gn = (e, t) => {
			st = ct, ct = e, lt = t, vr({ animateSelectionChange: !0 });
		}, Kn = () => {
			Lt.value && ie("BackRequested", {});
		}, qn = () => {
			Lt.value && Kn();
		}, Jn = () => {
			if (We.value) {
				if (kt = !0, !cn(Ye.value, {
					isSettings: !0,
					collapsePane: !0
				})) {
					kt = !1;
					return;
				}
				if (x(() => {
					kt && !d.IsNavigationPending && (kt = !1);
				}), p) {
					K.value === Ye.value && vn();
					return;
				}
				x(() => {
					Wn(Ye.value, !1), vn();
				});
			}
		}, Yn = () => {
			Y.value ? (_t = !1, Zn()) : (_t = !0, Qn());
		}, Xn = (e, t = !0) => {
			if (e === Y.value) return;
			if (e) {
				let e = { Cancel: !1 };
				if (ie("PaneClosing", e), e.Cancel) return;
			} else ie("PaneOpening", {});
			X.value = e ? "closing" : "opening", gt && clearTimeout(gt);
			let n = et(e);
			gt = setTimeout(() => {
				X.value = "", gt = null, ie(e ? "PaneClosed" : "PaneOpened", {}), x(() => yr());
			}, n), Y.value = e, t && ie("update:IsPaneOpen", !e);
		}, Zn = (e = !0) => Xn(!1, e), Qn = (e = !0) => Xn(!0, e), $n = () => {
			Ie.value && (_t = !1, Zn(), x(() => {
				requestAnimationFrame(() => {
					(se.value?.querySelector?.("input, textarea, [contenteditable=\"true\"], [tabindex]:not([tabindex=\"-1\"])"))?.focus?.({ preventScroll: !0 });
				});
			}));
		}, er = () => {
			let e = Oe.value === "Auto";
			if (e && Pe.value) {
				Y.value || (gt && clearTimeout(gt), gt = null, X.value = "", Y.value = !0, ie("update:IsPaneOpen", !1), x(() => yr()));
				return;
			}
			if (e && ke.value === "Left") {
				_t || Zn();
				return;
			}
			if (Oe.value === "Left") {
				typeof q.isPaneOpen == "boolean" && (Y.value = !q.isPaneOpen);
				return;
			}
			if (Me.value) Y.value = !0;
			else if (typeof q.isPaneOpen == "boolean") {
				Y.value = !q.isPaneOpen;
				return;
			}
			Pe.value ? Y.value = !0 : Ae.value || (Y.value = !1);
		}, tr = (e) => {
			if (!Pe.value || Y.value) return;
			let t = e.target;
			ae.value?.contains(t) || t?.closest?.(".win-menu-flyout-wrap") || t?.closest?.("[data-nav-pane-toggle]") || Qn();
		}, nr = () => {
			Dt = !0, Ot = !1, wt.value = "gear-rewind";
		}, rr = () => {
			Dt && (Dt = !1, Ot && (wt.value = "gear-spin"));
		}, ir = () => {
			Dt && (Dt = !1, Ot && (wt.value = "gear-spin"));
		}, ar = () => {
			wt.value === "gear-rewind" ? (Ot = !0, Dt || (wt.value = "gear-spin")) : wt.value === "gear-spin" && (wt.value = "", Ot = !1);
		}, or = () => {
			jt = !0, Mt = !1, Tt.value = "pressing";
		}, sr = () => {
			jt && (jt = !1, Mt && (Tt.value = "releasing"));
		}, cr = () => {
			jt && (jt = !1, Mt && (Tt.value = "releasing"));
		}, lr = (e) => {
			Tt.value === "pressing" && e.animationName === "hamburger-press" ? (Mt = !0, jt || (Tt.value = "releasing")) : Tt.value === "releasing" && e.animationName === "hamburger-release" && (Tt.value = "", Mt = !1);
		}, ur = () => {
			Lt.value && (Nt = !0, Pt = !1, Et.value = "pressing");
		}, dr = () => {
			Nt && (Nt = !1, Pt && (Et.value = "releasing"));
		}, fr = () => {
			Nt && (Nt = !1, Pt && (Et.value = "releasing"));
		}, pr = (e) => {
			Et.value === "pressing" && e.animationName === "animated-icon-back-press" ? (Pt = !0, Nt || (Et.value = "releasing")) : Et.value === "releasing" && e.animationName === "animated-icon-back-release" && (Et.value = "", Pt = !1);
		}, mr = () => {
			if (Ct) return;
			let e = gr();
			e && !Y.value && (xt = e.scrollTop), ct && ae.value && ae.value.contains(ct) && (pt = !0, vr(), requestAnimationFrame(() => {
				pt = !1;
			}));
		}, hr = () => {
			ft && cancelAnimationFrame(ft), ft = requestAnimationFrame(() => {
				ft = null, Sr(), _n(), Ae.value && kn(), yr();
			});
		}, gr = () => oe.value?.scrollViewerRef?.value ?? oe.value?.scrollViewerRef ?? oe.value ?? null, _r = ({ restoreScrollOffset: e = !1 } = {}) => {
			St && cancelAnimationFrame(St);
			let t = performance.now(), n = Math.max(400, et(Y.value) + 200), r = 0, i = null, a = null;
			Ct = !0, pt = !0;
			let o = (s) => {
				let c = gr();
				if (e && c) {
					let e = Math.max(0, c.scrollHeight - c.clientHeight);
					c.scrollTop = Math.min(xt, e);
				}
				let l = Q.value?.querySelector(".win-nav-indicator");
				if (l?.getAnimations().some((e) => e.playState === "running") && ct && Q.value) {
					let e = Ht(ct, Q.value), t = e.top + (e.bottom - e.top) / 2 - 8;
					i !== ct && (i = ct, a = t), l.style.translate = `0 ${t - a}px`;
				} else l && (l.style.translate = ""), i = null, a = null, yr();
				if (s - t < n || r < 2) {
					s - t >= n && (r += 1), St = requestAnimationFrame(o);
					return;
				}
				if (e && c) {
					let e = Math.max(0, c.scrollHeight - c.clientHeight);
					c.scrollTop = Math.min(xt, e);
				}
				St = requestAnimationFrame(() => {
					St = null, Ct = !1;
					let e = Q.value?.querySelector(".win-nav-indicator");
					e && (e.style.translate = ""), yr(), pt = !1;
				});
			};
			St = requestAnimationFrame(o);
		}, vr = ({ animateSelectionChange: e = !1 } = {}) => {
			let t = st && st !== ct ? st : null, n = pe.value;
			if (st = ct, !ae.value || !ct || !ae.value.contains(ct)) return;
			let r = Q.value, i = r?.querySelector(".win-nav-indicator");
			if (!r || !i) return;
			let a = Vt(r), o = (e) => Ht(e, r, a), s = o(ct), c = t && ae.value.contains(t) ? o(t) : null, l = (e) => {
				let t = gr();
				if (Ae.value) {
					let t = un(e);
					if (t) return ln(t) ? "top-footer" : "top-menu";
					let n = ae.value ? Array.from(ae.value.querySelectorAll(".win-nav-menu")) : [], r = e?.closest?.(".win-nav-menu");
					return n.indexOf(r) <= 0 ? "top-menu" : "top-footer";
				}
				return t && t.contains(e) ? "menu" : "footer";
			}, u = (e, t, n) => {
				requestAnimationFrame(() => {
					if (!ct || !ae.value || !ae.value.contains(ct)) return;
					let e = Ht(ct, r), n;
					t === "x" ? (n = e.left + (e.right - e.left) / 2 - 8, Wt(r, "x", e), Gt(i, {
						transform: `translateX(${n}px)`,
						width: "16px",
						opacity: "1",
						transition: "none"
					})) : (n = e.top + (e.bottom - e.top) / 2 - 8, Wt(r, "y", e), Gt(i, {
						transform: `translateY(${n}px)`,
						height: "16px",
						opacity: "1",
						transition: "none"
					})), qt(i);
				});
			};
			if (Ae.value) {
				ht = !1;
				let n = s.left + (s.right - s.left) / 2 - 8;
				if (!e && pt || $.value.opacity === "0") {
					qt(i), Wt(r, "x", s), $.value = {
						transition: "none",
						transform: `translateX(${n}px)`,
						width: "16px",
						opacity: "1"
					};
					return;
				}
				let a = Kt(i, "x", n);
				if (Math.abs(n - a) < 1) {
					Wt(r, "x", s), $.value = {
						transform: `translateX(${n}px)`,
						width: "16px",
						opacity: "1"
					};
					return;
				}
				Gt(i, {
					transform: `translateX(${n}px)`,
					width: "16px",
					opacity: "1",
					transition: "none"
				});
				let o = qt(i), d = l(t || ct), f = l(ct);
				if (c && Math.abs(c.top - s.top) < 1 && d === f) {
					Wt(r, "x", s, c);
					let e = zt("x", a, n), t = i.animate(e, {
						duration: 600,
						fill: "forwards"
					});
					t.onfinish = () => {
						o === mt && u(`translateX(${n}px)`, "x", "16px");
					};
					return;
				}
				Wt(r, "x", s, c);
				let p = n > a, m = p ? [{
					transform: `translateX(${a}px)`,
					width: "16px",
					offset: 0,
					easing: Ys
				}, {
					transform: `translateX(${a + 16}px)`,
					width: "0px",
					offset: 1
				}] : [{
					transform: `translateX(${a}px)`,
					width: "16px",
					offset: 0,
					easing: Ys
				}, {
					transform: `translateX(${a}px)`,
					width: "0px",
					offset: 1
				}], h = p ? [{
					transform: `translateX(${n}px)`,
					width: "0px",
					offset: 0,
					easing: Js
				}, {
					transform: `translateX(${n}px)`,
					width: "16px",
					offset: 1
				}] : [{
					transform: `translateX(${n + 16}px)`,
					width: "0px",
					offset: 0,
					easing: Js
				}, {
					transform: `translateX(${n}px)`,
					width: "16px",
					offset: 1
				}], g = i.animate(m, {
					duration: 300,
					fill: "forwards"
				});
				g.onfinish = () => {
					if (o !== mt) return;
					g.cancel();
					let e = i.animate(h, {
						duration: 300,
						fill: "forwards"
					});
					e.onfinish = () => {
						o === mt && u(`translateX(${n}px)`, "x", "16px");
					};
				};
			} else {
				let o = s.top + (s.bottom - s.top) / 2 - 8, l = gr(), d = 0, f = a.height;
				if (l) {
					let e = Ht(l, r, a);
					d = e.top, f = e.bottom;
				}
				let p = !l || !l.contains(ct);
				p && (d = 0, f = a.height);
				let m = {
					top: p ? s.top : Math.max(s.top, d),
					bottom: p ? s.bottom : Math.min(s.bottom, f),
					left: s.left,
					right: s.right
				};
				if (m.top >= m.bottom) {
					qt(i), ht = !0, Gt(i, {
						transform: `translateY(${o}px)`,
						height: "16px",
						opacity: "0",
						transition: "none"
					});
					return;
				}
				let h = ht;
				if (ht = !1, !e && pt || $.value.opacity === "0" && !h) {
					qt(i), Wt(r, "y", m), $.value = {
						transition: "none",
						transform: `translateY(${o}px)`,
						height: "16px",
						opacity: "1"
					}, pe.value = lt;
					return;
				}
				let g = h && c ? c.top + (c.bottom - c.top) / 2 - 8 : Kt(i, "y", o);
				if (Math.abs(o - g) < 1) {
					Wt(r, "y", m), $.value = {
						transform: `translateY(${o}px)`,
						height: "16px",
						opacity: "1"
					}, pe.value = lt;
					return;
				}
				let _ = c;
				if (c && l && (t && !l.contains(t) || (_ = {
					top: Math.max(c.top, d),
					bottom: Math.min(c.bottom, f),
					left: c.left,
					right: c.right
				}, _.top >= _.bottom && (_ = null))), c && n !== lt && Dr({
					sourceY: g,
					sourceRect: _ ?? c,
					sourceIsChild: n,
					target: ct,
					targetIsChild: lt,
					expandDown: o > g
				})) return;
				Wt(r, "y", m, _), Gt(i, {
					transform: `translateY(${o}px)`,
					height: "16px",
					opacity: "1",
					transition: "none"
				});
				let v = qt(i);
				pe.value = lt;
				let y = zt("y", g, o), b = i.animate(y, {
					duration: 600,
					fill: "forwards"
				});
				b.onfinish = () => {
					v === mt && u(`translateY(${o}px)`, "y", "16px");
				};
			}
		}, yr = () => {
			if (Me.value && Y.value) return;
			let e = q.selectedValue;
			if (!e || !ae.value) return;
			let t = tn(e), n = t && !me[t.value], r = t && (Ie.value || n) ? at[t.value] : at[e] || (e === Ye.value ? at[Ye.value] : null), i = Q.value?.querySelector(".win-nav-indicator");
			!r || !i || i.getAnimations().some((e) => e.playState === "running") || (ct = r, lt = !!t && !Ie.value && !n, pe.value = lt, pt = !0, qt(i), vr(), requestAnimationFrame(() => {
				pt = !1;
			}));
		}, br = null, xr = () => {
			let e = Z.value?.clientWidth || Z.value?.offsetWidth || window.innerWidth, t = Math.abs(e - bt) >= .5;
			bt = e, Oe.value === "Auto" && (De.value = e || (typeof window > "u" ? q.expandedModeThresholdWidth : window.innerWidth)), kn();
			let n = (Q.value?.querySelector(".win-nav-indicator"))?.getAnimations().some((e) => e.playState === "running");
			if (!(!t && n)) {
				if (pt = !0, br && cancelAnimationFrame(br), !ct || !ae.value || !ae.value.contains(ct)) {
					let e = q.selectedValue;
					if (e) {
						let t = tn(e);
						t && (Ae.value || Ie.value) ? (ct = at[t.value] || null, lt = !1) : (ct = at[e] || null, lt = !!t && !Ie.value);
					}
				}
				vr(), br = requestAnimationFrame(() => {
					vr(), br = requestAnimationFrame(() => {
						vr(), br = requestAnimationFrame(() => {
							pt = !1;
						});
					});
				});
			}
		}, Sr = () => {
			ut && (Z.value && ut.observe(Z.value), ae.value && ut.observe(ae.value), le.value && ut.observe(le.value), fe.value && ut.observe(fe.value), ae.value && ae.value.querySelectorAll(".win-nav-pane-top, .win-nav-pane-header, .win-nav-pane-custom-content, .win-nav-pane-footer").forEach((e) => ut.observe(e)));
		}, Cr = () => {
			ut && ut.disconnect(), ut = new ResizeObserver(xr), Sr();
		}, wr = () => {
			dt && (dt.disconnect(), ae.value && dt.observe(ae.value, {
				childList: !0,
				subtree: !0,
				characterData: !0
			}));
		}, Tr = () => {
			pt = !0, x(() => {
				Cr(), wr(), _n(), kn();
				let e = q.selectedValue;
				if (e) {
					let t = tn(e);
					t ? Ae.value || Ie.value ? (ct = at[t.value], lt = !1) : (ct = at[e], lt = !0) : (ct = at[e], lt = !1), vr();
				}
				requestAnimationFrame(() => {
					pt = !1;
				});
			});
		}, Er = () => {
			pt = !0;
			let e = () => {
				requestAnimationFrame(() => {
					yr(), requestAnimationFrame(() => {
						yr(), pt = !1;
					});
				});
			};
			x(() => {
				_n(), kn();
				let t = q.selectedValue;
				if (t) {
					let n = tn(t);
					if (n) if (!Ae.value && !Ie.value) {
						if (!me[n.value]) {
							me[n.value] = !0, x(() => {
								gn(n.value), x(() => {
									ct = at[t], lt = !0, pe.value = !0, vr(), e();
								});
							});
							return;
						}
						ct = at[t], lt = !0, pe.value = !0;
					} else ct = at[n.value], lt = !1;
					else ct = at[t], lt = !1;
					vr();
				}
				e();
			});
		};
		ee(() => {
			De.value = Z.value?.clientWidth || Z.value?.offsetWidth || window.innerWidth, bt = De.value, er(), Cr(), dt = new MutationObserver(hr), wr(), window.addEventListener("resize", xr), document.addEventListener("pointerdown", tr, !0), Er();
		}), w(() => {
			ut && ut.disconnect(), dt && dt.disconnect(), ft && cancelAnimationFrame(ft), St && cancelAnimationFrame(St), gt && clearTimeout(gt), window.removeEventListener("resize", xr), document.removeEventListener("pointerdown", tr, !0);
		}), V(() => q.paneDisplayMode, (e, t) => {
			e !== t && (_t = !1), er();
		}), V(ke, (e, t) => {
			e !== t && (gt && clearTimeout(gt), gt = null, X.value = ""), er(), e !== t && x(er), Tr(), e !== t && ie("DisplayModeChanged", { DisplayMode: Ue.value });
		}), V(() => q.isPaneOpen, (e) => {
			let t = !e;
			t !== Y.value && (_t = t), t ? Qn(!1) : Zn(!1);
		}), V(() => d.SelectedItem, (e) => {
			let t = re(te.value), n = re(e), r = sn?.value === n ? sn : null;
			(r || t !== n) && (sn = null), t !== n && Ae.value && tn(n) && (vt = !0), te.value = e, t !== n && Sn(n, { collapsePane: r?.collapsePane === !0 });
		}), V(() => d.IsNavigationPending, (e, t) => {
			if (e) {
				if (!kt) return;
				kt = !1, At = !0, wt.value = "gear-navigation-hold";
				return;
			}
			t && At && (At = !1, wt.value = "gear-spin");
		}), V(We, (e) => {
			e || (delete at[Ye.value], q.selectedValue === Ye.value && Cn(q.menuItems[0]?.value || "", !1));
		});
		let Dr = ({ sourceY: e, sourceRect: t, sourceIsChild: n, target: r, targetIsChild: i, expandDown: a = !1, hideSourceImmediately: o = !1, onComplete: s }) => {
			let c = Q.value, l = c?.querySelector(".win-nav-indicator");
			if (!c || !l || !r || !o && !Number.isFinite(e)) return !1;
			let u = qt(l), d = (e = null) => {
				if (u !== mt) return;
				let t = Ht(r, c), n = t.top + (t.bottom - t.top) / 2 - 8, o = n + (a ? 0 : 16);
				pe.value = i, Wt(c, "y", t), Gt(l, {
					transform: `translateY(${o}px)`,
					height: "0px",
					opacity: "1",
					transition: "none"
				}), e?.cancel();
				let d = l.animate([{
					transform: `translateY(${o}px)`,
					height: "0px",
					offset: 0,
					easing: Js
				}, {
					transform: `translateY(${n}px)`,
					height: "16px",
					offset: 1
				}], {
					duration: 300,
					fill: "forwards"
				});
				d.onfinish = () => {
					if (u !== mt) return;
					let e = Ht(r, c), t = e.top + (e.bottom - e.top) / 2 - 8;
					Wt(c, "y", e), Gt(l, {
						transform: `translateY(${t}px)`,
						height: "16px",
						opacity: "1",
						transition: "none"
					}), qt(l), s?.();
				};
			};
			if (o) return d(), !0;
			let f = t ?? {
				top: e,
				bottom: e + 16
			};
			pe.value = n, Wt(c, "y", f), $.value = {
				transform: `translateY(${e}px)`,
				height: "16px",
				opacity: "1",
				transition: "none"
			};
			let p = l.animate([{
				transform: `translateY(${e}px)`,
				height: "16px",
				offset: 0,
				easing: Ys
			}, {
				transform: `translateY(${e + (a ? 16 : 0)}px)`,
				height: "0px",
				offset: 1
			}], {
				duration: 200,
				fill: "forwards"
			});
			return p.onfinish = () => d(p), !0;
		};
		return V(Y, (e) => {
			let t = gr();
			if (e && t && (xt = t.scrollTop), x(() => _r({ restoreScrollOffset: !e })), Me.value) {
				if (!e) {
					let e = tn(q.selectedValue);
					e ? he[e.value] ? x(() => {
						_n(), yr();
					}) : (me[e.value] = !0, x(() => {
						gn(e.value), requestAnimationFrame(() => yr());
					})) : requestAnimationFrame(() => yr());
				}
				return;
			}
			if (e) {
				let e = tn(q.selectedValue);
				e && he[e.value] ? x(() => yr()) : e && x(() => {
					let t = at[e.value];
					t && (st = ct, ct = t, lt = !1, Dr({
						sourceY: null,
						sourceRect: null,
						sourceIsChild: !0,
						target: t,
						targetIsChild: !1,
						hideSourceImmediately: !0
					}) || (pt = !0, vr(), requestAnimationFrame(() => {
						pt = !1;
					})));
				});
			} else {
				let e = tn(q.selectedValue);
				if (e && he[e.value]) x(() => {
					_n(), yr();
				});
				else if (e) {
					let t = Q.value, n = at[e.value], r = n && t ? Ht(n, t) : null, i = r ? r.top + (r.bottom - r.top) / 2 - 8 : null, a = r;
					me[e.value] = !0, x(() => {
						_n(), gn(e.value);
						let t = at[q.selectedValue];
						t && (st = ct, ct = t, lt = !0, Dr({
							sourceY: i,
							sourceRect: a,
							sourceIsChild: !1,
							target: t,
							targetIsChild: !0,
							expandDown: !0
						}) || (pt = !0, vr(), requestAnimationFrame(() => {
							pt = !1;
						})));
					});
				} else x(() => {
					_n(), yr();
				});
			}
		}), V(() => q.selectedValue, (e) => {
			if (!e) return;
			let t = tn(e);
			if (Ae.value && kn(), Ae.value && t) {
				if (vt) {
					vt = !1;
					return;
				}
				x(() => {
					let e = at[t.value];
					e && Gn(e, !1);
				});
			}
		}), (e, n) => (D(), l("div", {
			class: S(["win-nav-shell", it.value]),
			style: C(nt.value),
			ref_key: "shellRef",
			ref: Z
		}, [
			Ae.value ? (D(), l("nav", {
				key: 0,
				class: "win-nav-top-bar",
				ref_key: "navRef",
				ref: ae,
				onKeydown: En,
				onFocusin: On,
				onPointerdownCapture: Dn,
				onTouchstartCapture: Dn
			}, [
				u("div", {
					class: "win-nav-indicator-track",
					ref_key: "indicatorTrack",
					ref: Q
				}, [u("div", {
					class: "win-nav-indicator",
					style: C($.value)
				}, null, 4)], 512),
				Ze.value ? (D(), l("button", b({
					key: 0,
					class: "win-nav-back-button",
					disabled: !Lt.value,
					"aria-label": z(i)("text.back")
				}, { "tooltipservice.tooltip": z(i)("text.back") }, {
					onClick: qn,
					onMousedown: ur,
					onMouseup: dr,
					onMouseleave: fr,
					ref_key: "topBackButtonRef",
					ref: fe
				}), [u("span", {
					class: S(["icon animated-icon animated-icon-back", Et.value]),
					onAnimationend: pr
				}, "", 34)], 16, Ro)) : c("", !0),
				e.$slots.PaneHeader ? (D(), l("div", zo, [M(e.$slots, "PaneHeader")])) : Ke.value && !Ge.value ? (D(), s(Rt, {
					key: 2,
					class: "win-nav-top-fixed win-nav-top-pane-title",
					Text: Ke.value
				}, null, 8, ["Text"])) : c("", !0),
				u("div", {
					class: "win-nav-menu win-nav-top-primary-menu",
					ref_key: "topPrimaryMenuRef",
					ref: ce
				}, [(D(!0), l(t, null, j(Qt.value, (e) => (D(), l(t, { key: e.value }, [e.type === "Header" ? (D(), l("div", Bo, [m(Rt, { Text: e.label }, null, 8, ["Text"])])) : e.type === "Separator" ? (D(), l("div", Vo)) : e.children ? (D(), l("div", {
					key: 3,
					class: S(["win-nav-group", { "is-child-selected": en(e) }])
				}, [u("div", b({
					class: ["win-nav-item win-nav-group-header", {
						"is-selected": e.selectsOnInvoked !== !1 && K.value === e.value,
						"is-disabled": !e.isEnabled
					}],
					role: "button",
					"aria-disabled": !e.isEnabled || void 0
				}, { ref_for: !0 }, Re(e), {
					onClick: (t) => zn(e),
					ref_for: !0,
					ref: (t) => dn(e.value, t)
				}), [
					e.icon ? (D(), l("span", Go, L(e.icon), 1)) : c("", !0),
					m(Rt, {
						class: "label",
						Text: e.label
					}, null, 8, ["Text"]),
					e.infoBadge ? (D(), s(So, b({
						key: 1,
						class: "win-nav-infobadge"
					}, { ref_for: !0 }, e.infoBadge), null, 16)) : c("", !0),
					u("span", {
						class: S(["icon win-nav-group-chevron", hn(e.value)]),
						onClick: G((t) => Rn(e), ["stop"])
					}, "", 10, Ko)
				], 16, Wo)], 2)) : (D(), l("div", b({
					key: 2,
					class: ["win-nav-item", {
						"is-selected": K.value === e.value,
						"is-disabled": !e.isEnabled
					}],
					role: "button",
					"aria-disabled": !e.isEnabled || void 0
				}, { ref_for: !0 }, Re(e), {
					onClick: (t) => wn(e),
					ref_for: !0,
					ref: (t) => dn(e.value, t)
				}), [
					e.icon ? (D(), l("span", Uo, L(e.icon), 1)) : c("", !0),
					m(Rt, {
						class: "label",
						Text: e.label
					}, null, 8, ["Text"]),
					e.infoBadge ? (D(), s(So, b({
						key: 1,
						class: "win-nav-infobadge"
					}, { ref_for: !0 }, e.infoBadge), null, 16)) : c("", !0)
				], 16, Ho))], 64))), 128)), $t.value.length ? (D(), l("div", b({
					key: 0,
					class: "win-nav-item win-nav-more-button",
					role: "button",
					tabindex: "0",
					"aria-label": z(i)("text.more")
				}, { "tooltipservice.tooltip": z(i)("text.more") }, {
					onClick: Mn,
					ref_key: "moreButtonRef",
					ref: de
				}), [n[0] ||= u("span", { class: "icon" }, "", -1), d.OverflowLabelMode === "MoreLabel" ? (D(), s(Rt, {
					key: 0,
					class: "label",
					Text: z(i)("text.more")
				}, null, 8, ["Text"])) : c("", !0)], 16, qo)) : c("", !0)], 512),
				u("div", Jo, [M(e.$slots, "PaneCustomContent")]),
				e.$slots.AutoSuggestBox ? (D(), l("div", Yo, [M(e.$slots, "AutoSuggestBox")])) : c("", !0),
				e.$slots.PaneFooter ? (D(), l("div", Xo, [M(e.$slots, "PaneFooter")])) : c("", !0),
				u("div", {
					class: "win-nav-menu win-nav-top-footer-menu",
					ref_key: "topFooterMenuRef",
					ref: le
				}, [(D(!0), l(t, null, j(I.value, (e) => (D(), l(t, { key: e.value }, [e.type === "Header" ? (D(), l("div", Zo, [m(Rt, { Text: e.label }, null, 8, ["Text"])])) : e.type === "Separator" ? (D(), l("div", Qo)) : (D(), l("div", b({
					key: 2,
					class: ["win-nav-item", {
						"is-selected": K.value === e.value,
						"is-disabled": !e.isEnabled
					}],
					role: "button",
					"aria-disabled": !e.isEnabled || void 0
				}, { ref_for: !0 }, Re(e), {
					onClick: (t) => wn(e),
					ref_for: !0,
					ref: (t) => dn(e.value, t)
				}), [
					e.icon ? (D(), l("span", es, L(e.icon), 1)) : c("", !0),
					m(Rt, {
						class: "label",
						Text: e.label
					}, null, 8, ["Text"]),
					e.infoBadge ? (D(), s(So, b({
						key: 1,
						class: "win-nav-infobadge"
					}, { ref_for: !0 }, e.infoBadge), null, 16)) : c("", !0)
				], 16, $o))], 64))), 128)), We.value ? (D(), l("div", b({
					key: 0,
					class: ["win-nav-item win-nav-settings-item", { "is-selected": K.value === Ye.value }],
					role: "button",
					tabindex: "0"
				}, { "tooltipservice.tooltip": J.value }, {
					onClick: Jn,
					onMousedown: nr,
					onMouseup: rr,
					onMouseleave: ir,
					ref: (e) => dn(Ye.value, e)
				}), [u("span", {
					class: S(["icon animated-icon animated-icon-gear", wt.value]),
					onAnimationend: ar
				}, L(Xe.value), 35), m(Rt, {
					class: "label",
					Text: J.value
				}, null, 8, ["Text"])], 16)) : c("", !0)], 512),
				u("div", {
					class: "win-nav-top-measure",
					ref_key: "topMeasureRef",
					ref: ue,
					"aria-hidden": "true"
				}, [(D(!0), l(t, null, j(F.value, (e) => (D(), l(t, { key: e.value }, [e.type === "Header" ? (D(), l("div", {
					key: 0,
					class: "win-nav-item-header",
					"data-value": e.value
				}, [m(Rt, { Text: e.label }, null, 8, ["Text"])], 8, ts)) : e.type === "Separator" ? (D(), l("div", {
					key: 1,
					class: "win-nav-item-separator",
					"data-value": e.value
				}, null, 8, ns)) : (D(), l("div", {
					key: 2,
					class: "win-nav-item",
					"data-value": e.value
				}, [
					e.icon ? (D(), l("span", is, L(e.icon), 1)) : c("", !0),
					m(Rt, {
						class: "label",
						Text: e.label
					}, null, 8, ["Text"]),
					e.infoBadge ? (D(), s(So, b({
						key: 1,
						class: "win-nav-infobadge"
					}, { ref_for: !0 }, e.infoBadge), null, 16)) : c("", !0),
					e.children ? (D(), l("span", as, "")) : c("", !0)
				], 8, rs))], 64))), 128)), u("div", os, [n[1] ||= u("span", { class: "icon" }, "", -1), d.OverflowLabelMode === "MoreLabel" ? (D(), s(Rt, {
					key: 0,
					class: "label",
					Text: z(i)("text.more")
				}, null, 8, ["Text"])) : c("", !0)])], 512)
			], 544)) : (D(), l("nav", {
				key: 1,
				class: S(["win-nav-left-panel", [
					"win-nav-left-panel",
					{
						"is-compact": Y.value,
						"is-closed-compact": Ie.value,
						"is-minimal": Me.value,
						"has-back-button": Qe.value,
						"has-pane-toggle-button": Ge.value
					},
					X.value ? `is-pane-${X.value}` : ""
				]]),
				style: C(tt.value),
				ref_key: "navRef",
				ref: ae,
				onKeydown: En,
				onFocusin: On,
				onPointerdownCapture: Dn,
				onTouchstartCapture: Dn
			}, [
				Qe.value ? (D(), l("button", b({
					key: 0,
					class: "win-nav-back-button",
					disabled: !Lt.value,
					"aria-label": z(i)("text.back")
				}, { "tooltipservice.tooltip": z(i)("text.back") }, {
					onClick: qn,
					onMousedown: ur,
					onMouseup: dr,
					onMouseleave: fr
				}), [u("span", {
					class: S(["icon animated-icon animated-icon-back", Et.value]),
					onAnimationend: pr
				}, "", 34)], 16, ss)) : c("", !0),
				Ge.value ? (D(), l("div", cs, [Ge.value ? (D(), l("button", b({
					key: 0,
					class: ["win-nav-hamburger", { "has-pane-title": Ke.value && Ve.value }],
					"aria-label": He.value
				}, { "tooltipservice.tooltip": He.value }, {
					onClick: Yn,
					onMousedown: or,
					onMouseup: sr,
					onMouseleave: cr
				}), [u("span", {
					class: S(["icon animated-icon animated-icon-hamburger", Tt.value]),
					onAnimationend: lr
				}, "", 34), Ke.value && Be.value ? (D(), s(Rt, {
					key: 0,
					class: "win-nav-pane-title",
					Text: Ke.value
				}, null, 8, ["Text"])) : c("", !0)], 16, ls)) : c("", !0)])) : c("", !0),
				U(u("div", {
					class: "win-nav-pane-surface",
					"aria-hidden": Me.value && Y.value ? "true" : void 0,
					inert: Me.value && Y.value
				}, [
					u("div", {
						class: "win-nav-indicator-track",
						ref_key: "indicatorTrack",
						ref: Q
					}, [u("div", {
						class: S(["win-nav-indicator", { "is-child": pe.value }]),
						style: C($.value)
					}, null, 6)], 512),
					!Ge.value && Ke.value && Be.value ? (D(), l("div", ds, [m(Rt, {
						class: "win-nav-pane-title",
						Text: Ke.value
					}, null, 8, ["Text"])])) : c("", !0),
					e.$slots.PaneHeader ? U((D(), l("div", {
						key: 1,
						class: S(["win-nav-pane-header", { "has-pane-toggle": Ge.value }])
					}, [M(e.$slots, "PaneHeader")], 2)), [[B, ze.value]]) : c("", !0),
					e.$slots.AutoSuggestBox ? (D(), l("div", {
						key: 2,
						class: S(["win-nav-pane-top", { "is-closed-compact": Ie.value }])
					}, [u("div", fs, [U(u("div", {
						class: "win-nav-pane-search-presenter",
						ref_key: "paneAutoSuggestPresenterRef",
						ref: se
					}, [M(e.$slots, "AutoSuggestBox")], 512), [[B, !Ie.value]]), U(u("button", b({
						class: "win-nav-pane-search-button",
						"aria-label": z(i)("text.search")
					}, { "tooltipservice.tooltip": z(i)("text.search") }, { onClick: $n }), [...n[2] ||= [u("span", { class: "icon" }, "", -1)]], 16, ps), [[B, Ie.value]])])], 2)) : c("", !0),
					e.$slots.PaneCustomContent ? (D(), l("div", ms, [M(e.$slots, "PaneCustomContent")])) : c("", !0),
					m(Ft, {
						class: "win-nav-left-scrollable",
						ref_key: "scrollArea",
						ref: oe,
						VerticalScrollMode: "Auto",
						VerticalScrollBarVisibility: "Auto",
						HorizontalScrollMode: "Disabled",
						HorizontalScrollBarVisibility: "Disabled",
						onViewChanged: mr
					}, {
						default: H(() => [u("div", hs, [(D(!0), l(t, null, j(F.value, (e) => (D(), l(t, { key: e.value }, [e.type === "Header" ? (D(), l("div", gs, [m(Rt, { Text: e.label }, null, 8, ["Text"])])) : e.type === "Separator" ? (D(), l("div", _s)) : e.children ? (D(), l("div", {
							key: 3,
							class: S(["win-nav-group", {
								"is-expanded": me[e.value] && Le.value,
								"is-child-selected": en(e)
							}])
						}, [u("div", b({
							class: ["win-nav-item win-nav-group-header", {
								"is-selected": e.selectsOnInvoked !== !1 && K.value === e.value,
								"is-disabled": !e.isEnabled
							}],
							role: "button",
							"aria-disabled": !e.isEnabled || void 0
						}, { ref_for: !0 }, Re(e), {
							onClick: (t) => zn(e),
							ref_for: !0,
							ref: (t) => dn(e.value, t)
						}), [
							e.icon ? (D(), l("span", xs, L(e.icon), 1)) : c("", !0),
							m(Rt, {
								class: "label",
								Text: e.label
							}, null, 8, ["Text"]),
							e.infoBadge ? (D(), s(So, b({
								key: 1,
								class: "win-nav-infobadge"
							}, { ref_for: !0 }, e.infoBadge), null, 16)) : c("", !0),
							u("span", {
								class: S(["icon win-nav-group-chevron", hn(e.value)]),
								onClick: G((t) => Rn(e), ["stop"])
							}, "", 10, Ss)
						], 16, bs), u("div", {
							class: "win-nav-group-children",
							style: C({ height: me[e.value] && Le.value ? (ge[e.value] || 0) + "px" : "0px" }),
							"aria-hidden": Le.value ? void 0 : "true",
							inert: Le.value ? void 0 : ""
						}, [u("div", {
							class: "win-nav-group-children-inner",
							ref_for: !0,
							ref: (t) => fn(e.value, t)
						}, [(D(!0), l(t, null, j(e.children, (t) => (D(), l("div", b({
							key: t.value,
							class: ["win-nav-item win-nav-group-child", {
								"is-selected": K.value === t.value,
								"is-disabled": !t.isEnabled
							}],
							role: "button",
							"aria-disabled": !t.isEnabled || void 0
						}, { ref_for: !0 }, Re(t), {
							onClick: (n) => Tn(e, t),
							ref_for: !0,
							ref: (e) => dn(t.value, e)
						}), [
							t.icon ? (D(), l("span", Ts, L(t.icon), 1)) : c("", !0),
							m(Rt, {
								class: "label",
								Text: t.label
							}, null, 8, ["Text"]),
							t.infoBadge ? (D(), s(So, b({
								key: 1,
								class: "win-nav-infobadge"
							}, { ref_for: !0 }, t.infoBadge), null, 16)) : c("", !0)
						], 16, ws))), 128))], 512)], 12, Cs)], 2)) : (D(), l("div", b({
							key: 2,
							class: ["win-nav-item", {
								"is-selected": K.value === e.value,
								"is-disabled": !e.isEnabled
							}],
							role: "button",
							"aria-disabled": !e.isEnabled || void 0
						}, { ref_for: !0 }, Re(e), {
							onClick: (t) => wn(e),
							ref_for: !0,
							ref: (t) => dn(e.value, t)
						}), [
							e.icon ? (D(), l("span", ys, L(e.icon), 1)) : c("", !0),
							m(Rt, {
								class: "label",
								Text: e.label
							}, null, 8, ["Text"]),
							e.infoBadge ? (D(), s(So, b({
								key: 1,
								class: "win-nav-infobadge"
							}, { ref_for: !0 }, e.infoBadge), null, 16)) : c("", !0)
						], 16, vs))], 64))), 128))])]),
						_: 1
					}, 512),
					u("div", Es, [
						e.$slots.PaneFooter ? (D(), l("div", Ds, [M(e.$slots, "PaneFooter")])) : c("", !0),
						(D(!0), l(t, null, j(I.value, (e) => (D(), l(t, { key: e.value }, [e.type === "Header" ? (D(), l("div", Os, [m(Rt, { Text: e.label }, null, 8, ["Text"])])) : e.type === "Separator" ? (D(), l("div", ks)) : (D(), l("div", b({
							key: 2,
							class: ["win-nav-item", {
								"is-selected": K.value === e.value,
								"is-disabled": !e.isEnabled
							}],
							role: "button",
							"aria-disabled": !e.isEnabled || void 0
						}, { ref_for: !0 }, Re(e), {
							onClick: (t) => wn(e),
							ref_for: !0,
							ref: (t) => dn(e.value, t)
						}), [
							e.icon ? (D(), l("span", js, L(e.icon), 1)) : c("", !0),
							m(Rt, {
								class: "label",
								Text: e.label
							}, null, 8, ["Text"]),
							e.infoBadge ? (D(), s(So, b({
								key: 1,
								class: "win-nav-infobadge"
							}, { ref_for: !0 }, e.infoBadge), null, 16)) : c("", !0)
						], 16, As))], 64))), 128)),
						We.value ? (D(), l("div", b({
							key: 1,
							class: ["win-nav-item win-nav-settings-item", { "is-selected": K.value === Ye.value }],
							role: "button",
							tabindex: "0"
						}, Ae.value || Ie.value ? { "tooltipservice.tooltip": J.value } : {}, {
							onClick: Jn,
							onMousedown: nr,
							onMouseup: rr,
							onMouseleave: ir,
							ref: (e) => dn(Ye.value, e)
						}), [u("span", {
							class: S(["icon animated-icon animated-icon-gear", wt.value]),
							onAnimationend: ar
						}, L(Xe.value), 35), m(Rt, {
							class: "label",
							Text: J.value
						}, null, 8, ["Text"])], 16)) : c("", !0)
					])
				], 8, us), [[B, Fe.value]])
			], 38)),
			u("main", Ms, [
				Je.value ? (D(), l("div", Ns, [M(e.$slots, "Header", {}, () => [m(Rt, { Text: qe.value }, null, 8, ["Text"])])])) : c("", !0),
				u("div", Ps, [M(e.$slots, "default")]),
				e.$slots.ContentOverlay ? (D(), l("div", Fs, [M(e.$slots, "ContentOverlay")])) : c("", !0)
			]),
			m(It, {
				Open: ve.value,
				AnchorRect: ye.value,
				Items: be.value,
				Placement: je.value,
				onClose: Hn,
				onSelect: Un
			}, null, 8, [
				"Open",
				"AnchorRect",
				"Items",
				"Placement"
			]),
			m(It, {
				Open: Se.value,
				AnchorRect: Ce.value,
				Items: [],
				Placement: "BottomEdgeAlignedRight",
				onClose: jn
			}, {
				default: H(() => [u("div", Is, [(D(!0), l(t, null, j($t.value, (e) => (D(), l(t, { key: e.value }, [e.type === "Header" ? (D(), l("div", Ls, [m(Rt, { Text: e.label }, null, 8, ["Text"])])) : e.type === "Separator" ? (D(), l("div", Rs)) : e.children ? (D(), l("div", {
					key: 3,
					class: S(["win-nav-group", {
						"is-expanded": me[e.value],
						"is-child-selected": en(e)
					}])
				}, [u("div", b({
					class: ["win-nav-item win-nav-group-header", {
						"is-selected": e.selectsOnInvoked !== !1 && K.value === e.value,
						"is-disabled": !e.isEnabled
					}],
					role: "button",
					"aria-disabled": !e.isEnabled || void 0
				}, { ref_for: !0 }, Re(e), { onClick: (t) => Fn(e) }), [
					e.icon ? (D(), l("span", Hs, L(e.icon), 1)) : c("", !0),
					m(Rt, {
						class: "label",
						Text: e.label
					}, null, 8, ["Text"]),
					e.infoBadge ? (D(), s(So, b({
						key: 1,
						class: "win-nav-infobadge"
					}, { ref_for: !0 }, e.infoBadge), null, 16)) : c("", !0),
					u("span", {
						class: S(["icon win-nav-group-chevron", hn(e.value)]),
						onClick: G((t) => In(e), ["stop"])
					}, "", 10, Us)
				], 16, Vs), u("div", {
					class: "win-nav-group-children",
					style: C({ height: me[e.value] ? (e.children?.length || 0) * 36 + "px" : "0px" })
				}, [u("div", Ws, [(D(!0), l(t, null, j(e.children, (t) => (D(), l("div", b({
					key: t.value,
					class: ["win-nav-item win-nav-group-child", {
						"is-selected": K.value === t.value,
						"is-disabled": !t.isEnabled
					}],
					role: "button",
					"aria-disabled": !t.isEnabled || void 0
				}, { ref_for: !0 }, Re(t), { onClick: (n) => Pn(e, t) }), [
					t.icon ? (D(), l("span", Ks, L(t.icon), 1)) : c("", !0),
					m(Rt, {
						class: "label",
						Text: t.label
					}, null, 8, ["Text"]),
					t.infoBadge ? (D(), s(So, b({
						key: 1,
						class: "win-nav-infobadge"
					}, { ref_for: !0 }, t.infoBadge), null, 16)) : c("", !0)
				], 16, Gs))), 128))])], 4)], 2)) : (D(), l("div", b({
					key: 2,
					class: ["win-nav-item", {
						"is-selected": K.value === e.value,
						"is-disabled": !e.isEnabled
					}],
					role: "button",
					"aria-disabled": !e.isEnabled || void 0
				}, { ref_for: !0 }, Re(e), { onClick: (t) => Nn(e) }), [
					e.icon ? (D(), l("span", Bs, L(e.icon), 1)) : c("", !0),
					m(Rt, {
						class: "label",
						Text: e.label
					}, null, 8, ["Text"]),
					e.infoBadge ? (D(), s(So, b({
						key: 1,
						class: "win-nav-infobadge"
					}, { ref_for: !0 }, e.infoBadge), null, 16)) : c("", !0)
				], 16, zs))], 64))), 128))])]),
				_: 1
			}, 8, ["Open", "AnchorRect"])
		], 6));
	}
}, Zs = ["dir", "aria-disabled"], Qs = {
	key: 0,
	class: "win-pivot-title-content-control"
}, $s = { class: "win-pivot-layout-element" }, ec = {
	key: 0,
	class: "win-pivot-left-header-presenter"
}, tc = { class: "win-pivot-header-clipper" }, nc = {
	key: 1,
	class: "win-pivot-right-header-presenter"
}, rc = {
	class: "win-pivot-item-presenter",
	role: "tabpanel"
}, ic = /*#__PURE__*/ dt(/* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
	__name: "Pivot",
	props: {
		Title: {
			type: [String, Number],
			default: ""
		},
		SelectedIndex: {
			type: Number,
			default: void 0
		},
		SelectedItem: {
			type: [
				Object,
				String,
				Number
			],
			default: null
		},
		IsLocked: {
			type: Boolean,
			default: !1
		},
		IsHeaderItemsCarouselEnabled: {
			type: Boolean,
			default: !0
		},
		HeaderTemplate: {
			type: [
				Object,
				Function,
				String
			],
			default: null
		},
		TitleTemplate: {
			type: [
				Object,
				Function,
				String
			],
			default: null
		},
		LeftHeader: {
			type: [String, Number],
			default: ""
		},
		LeftHeaderTemplate: {
			type: [
				Object,
				Function,
				String
			],
			default: null
		},
		RightHeader: {
			type: [String, Number],
			default: ""
		},
		RightHeaderTemplate: {
			type: [
				Object,
				Function,
				String
			],
			default: null
		},
		HeaderFocusVisualPlacement: {
			type: String,
			default: "SelectedItemHeader"
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		Padding: {
			type: [String, Number],
			default: ""
		},
		FlowDirection: {
			type: String,
			default: ""
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		}
	},
	emits: [
		"SelectionChanged",
		"PivotItemLoading",
		"PivotItemLoaded",
		"PivotItemUnloading",
		"PivotItemUnloaded",
		"update:SelectedIndex",
		"update:SelectedItem"
	],
	setup(n, { expose: i, emit: a }) {
		let d = n, f = a, p = g(), _ = ne(), v = te(), y = A(null), T = A(null), E = A(null), O = A(null), k = /* @__PURE__ */ new Map(), N = A(d.SelectedIndex ?? 0), F = A(N.value), I = A(N.value), L = A("Idle"), R = A(!1), W = A(!1), G = A(!1), re = A("ltr"), K, q = 0, J = 0, ie = [], Y = null, X = 0, Z = /* @__PURE__ */ new Map(), ae = h({
			name: "PivotRenderVNode",
			props: { vnode: {
				type: Object,
				required: !0
			} },
			setup(e) {
				return () => e.vnode;
			}
		}), Q = o(() => {
			let { class: e, style: t, ...n } = v;
			return n;
		}), oe = o(() => d.Title), se = o(() => oe.value !== "" || _.TitleTemplate || d.TitleTemplate), ce = o(() => d.TitleTemplate), le = o(() => d.HeaderTemplate), ue = o(() => d.IsLocked), de = o(() => d.IsEnabled !== !1), fe = o(() => d.IsHeaderItemsCarouselEnabled), $ = o(() => we.value[N.value] ?? null), pe = o(() => we.value[F.value] ?? null), me = o(() => fe.value && G.value && R.value), he = o(() => fe.value && G.value && W.value), ge = o(() => d.FlowDirection === "RightToLeft" ? "rtl" : d.FlowDirection === "LeftToRight" ? "ltr" : re.value), _e = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, ve = (e) => {
			if (e === "" || e == null) return "";
			let t = String(e).split(",").map((e) => _e(Number.isNaN(Number(e.trim())) ? e.trim() : Number(e.trim())));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : String(e);
		}, ye = o(() => {
			let e = {};
			return d.MinHeight !== "" && (e.minHeight = _e(d.MinHeight)), e;
		}), be = o(() => ({ margin: ve(d.Padding) })), xe = (n) => {
			let i = [];
			for (let a of n ?? []) if (!(!a || a.type === e || a.type === r)) {
				if (a.type === t && Array.isArray(a.children)) {
					i.push(...xe(a.children));
					continue;
				}
				i.push(a);
			}
			return i;
		}, Se = (e) => !e || typeof e.type == "string" ? "" : e.type?.name || e.type?.__name || "", Ce = (e, t, n = void 0) => e ? e[t] === void 0 ? n : e[t] : n, we = o(() => xe(_.default?.() ?? []).filter((e) => Se(e) === "PivotItem" || Ce(e.props, "Header") !== void 0).map((e, t) => {
			let n = Ce(e.props, "Header", ""), r = Ce(e.props, "IsEnabled", !0), i = e.props ?? { Header: n };
			return {
				Header: n,
				IsEnabled: r,
				Source: i,
				VNode: e,
				Key: Te(e, i, t)
			};
		})), Te = (e, t, n) => e.key ?? t?.Key ?? t?.Id ?? t?.id ?? n, Ee = (e, t) => e.Key ?? Te(e.VNode, e.Source, t), De = (e) => e.Header === null || e.Header === void 0 ? "" : String(e.Header), Oe = (e) => e.IsEnabled === !1, ke = (e) => {
			let t = typeof e;
			return t === "symbol" || t === "object" || t === "function" ? (Z.has(e) || Z.set(e, ++X), `${t}:${Z.get(e)}`) : `${t}:${String(e)}`;
		}, Ae = o(() => we.value.map((e) => ke(e.Key)).join("")), je = (e, t) => ({
			"is-selected": t === N.value,
			"is-unselected": t !== N.value,
			"is-disabled": Oe(e) || !de.value,
			"is-unselected-locked": ue.value && t !== N.value
		}), Me = (e) => e?.$el ?? e ?? null, Ne = (e, t) => {
			t ? k.set(e, Me(t)) : k.delete(e);
		}, Pe = () => {
			let e = we.value.length;
			if (!e) {
				++J, Re(), L.value = "Idle", Y = null, N.value = -1, F.value = -1, I.value = -1;
				return;
			}
			let t = Math.min(Math.max(N.value, 0), e - 1);
			N.value = t, (F.value < 0 || F.value >= e) && (F.value = t), (I.value < 0 || I.value >= e) && (I.value = t);
		}, Fe = () => p?.proxy, Ie = (e) => Object.freeze({ Item: e?.Source ?? null }), Le = () => typeof window < "u" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches, Re = () => {
			for (let e of ie) e.cancel();
			ie = [];
		}, ze = async (e, t, n, r, i, a, o = !1) => {
			let s = O.value;
			if (!s || Le() || typeof s.animate != "function") return !0;
			Re();
			let c = [];
			try {
				if (c.push(s.animate(e, {
					duration: n,
					easing: i,
					fill: "both"
				})), c.push(s.animate(t, {
					duration: r,
					easing: a,
					fill: "both"
				})), ie = c, await Promise.all(c.map((e) => e.finished)), o) for (let e of c) try {
					e.commitStyles?.();
				} catch {}
				return !0;
			} catch {
				return !1;
			} finally {
				for (let e of c) e.cancel();
				ie === c && (ie = []);
			}
		}, Be = (e) => ze([{ transform: "translate3d(0, 0, 0)" }, { transform: `translate3d(${e === "right" ? -7 : 7}px, 0, 0)` }], [{ opacity: 1 }, { opacity: 0 }], 83, 67, "linear", "linear", !0), Ve = (e) => ze([{ transform: `translate3d(${e === "right" ? 20 : -20}px, 0, 0)` }, { transform: "translate3d(0, 0, 0)" }], [{ opacity: 0 }, { opacity: 1 }], 767, 333, "cubic-bezier(0.1, 0.9, 0.2, 1)", "cubic-bezier(0.1, 0.9, 0.2, 1)"), He = (e, t, n) => n || we.value.length <= 2 || !fe.value ? e < t ? "left" : "right" : e === (t - 1 + we.value.length) % we.value.length ? "left" : "right", Ue = (e, t, n, r) => {
			N.value = e, F.value = e, I.value = e, f("update:SelectedIndex", e), f("update:SelectedItem", n.Source), f("SelectionChanged", r, Object.freeze({
				AddedItems: [n.Source],
				RemovedItems: t ? [t.Source] : []
			}));
		}, We = async (e, t = !1, n = !0) => {
			if (!de.value || n && ue.value || e < 0 || e >= we.value.length) return;
			let r = we.value[e];
			if (!r || n && Oe(r)) return;
			if (L.value !== "Idle") {
				if (L.value === "FlyIn" && e === N.value) {
					Y = null, t && qe(e);
					return;
				}
				Y = {
					Index: e,
					shouldFocus: t,
					isUserInitiated: n
				};
				return;
			}
			if (e === N.value) {
				t && qe(e);
				return;
			}
			let i = N.value, a = we.value[i] ?? null, o = Fe(), s = ++J, c = He(e, i, n);
			if (f("PivotItemUnloading", o, Ie(a)), f("PivotItemLoading", o, Ie(r)), Le()) {
				Ue(e, a, r, o), await x(), Qe(), t && qe(e), f("PivotItemUnloaded", o, Ie(a)), f("PivotItemLoaded", o, Ie(r));
				return;
			}
			L.value = "FlyOut";
			try {
				if (!await Be(c) || s !== J || (Ue(e, a, r, o), f("PivotItemUnloaded", o, Ie(a)), await x(), s !== J) || (Qe(), t && qe(e), L.value = "FlyIn", !await Ve(c) || s !== J)) return;
				f("PivotItemLoaded", o, Ie(r));
			} finally {
				if (s !== J) return;
				Re(), L.value = "Idle";
				let e = Y;
				Y = null, e && e.Index !== N.value ? We(e.Index, e.shouldFocus, e.isUserInitiated) : e?.shouldFocus && qe(N.value);
			}
		}, Ge = (e) => {
			I.value = e;
		}, Ke = () => we.value.map((e, t) => !Oe(e) && de.value ? t : null).filter((e) => e !== null), qe = (e) => {
			x(() => k.get(e)?.focus());
		}, Je = (e, t) => {
			if (!de.value || ue.value) return;
			let n = ge.value === "rtl" ? "ArrowLeft" : "ArrowRight", r = ge.value === "rtl" ? "ArrowRight" : "ArrowLeft", i = Ke(), a = i.indexOf(t);
			if (a < 0) return;
			let o = a;
			if (e.key === n) o = Math.min(i.length - 1, a + 1);
			else if (e.key === r) o = Math.max(0, a - 1);
			else if (e.key === "Home") o = 0;
			else if (e.key === "End") o = i.length - 1;
			else if (e.key === "Enter" || e.key === " ") {
				e.preventDefault(), We(t, !0, !0);
				return;
			} else return;
			e.preventDefault(), We(i[o], !0, !0);
		}, Ye = () => {
			let e = T.value, t = e?.scrollViewerRef;
			return t?.value ?? t ?? e?.$el?.querySelector?.(".win-scroll-viewer-viewport") ?? null;
		}, Xe = () => {
			q && cancelAnimationFrame(q), q = requestAnimationFrame(() => {
				q = 0;
				let e = Ye();
				if (!e) {
					G.value = !1, R.value = !1, W.value = !1;
					return;
				}
				re.value = getComputedStyle(y.value ?? e).direction === "rtl" ? "rtl" : "ltr";
				let t = Math.max(0, e.scrollWidth - e.clientWidth), n = Math.max(0, Math.min(t, Math.abs(e.scrollLeft)));
				G.value = t > 1, R.value = n > 1, W.value = n < t - 1;
			});
		}, Ze = (e) => {
			let t = Ye();
			if (!t) return;
			let n = ge.value === "rtl" ? -e : e;
			t.scrollBy({
				left: n * Math.max(48, t.clientWidth * .8),
				behavior: "smooth"
			});
		}, Qe = () => {
			let e = Ye(), t = k.get(N.value);
			if (!e || !t || !fe.value) {
				Xe();
				return;
			}
			let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
			r.left < n.left ? e.scrollBy({
				left: r.left - n.left - 20,
				behavior: "smooth"
			}) : r.right > n.right && e.scrollBy({
				left: r.right - n.right + 20,
				behavior: "smooth"
			}), Xe();
		};
		return V(() => d.SelectedIndex, (e) => {
			e !== void 0 && e !== N.value && We(e, !1, !1);
		}), V(() => d.SelectedItem, (e) => {
			if (e == null) return;
			let t = we.value.findIndex((t) => t.Source === e || t.Header === e);
			t >= 0 && t !== N.value && We(t, !1, !1);
		}), V(Ae, async () => {
			++J, Re(), L.value = "Idle", Y = null, Pe(), F.value = N.value, await x(), Xe(), Qe();
		}), ee(async () => {
			Pe(), K = new ResizeObserver(Xe), await x(), y.value && K.observe(y.value), Ye() && K.observe(Ye()), E.value && K.observe(E.value), Xe(), Qe(), document.fonts?.ready.then(Xe);
		}), w(() => {
			++J, Re(), L.value = "Idle", Y = null, K?.disconnect(), q && cancelAnimationFrame(q);
		}), i({
			get SelectedIndex() {
				return N.value;
			},
			get SelectedItem() {
				return $.value?.Source ?? null;
			},
			get Items() {
				return we.value.map((e) => e.Source);
			}
		}), (e, r) => (D(), l("div", b({
			ref_key: "rootRef",
			ref: y
		}, Q.value, {
			class: [
				"win-pivot",
				z(v).class,
				{
					"is-locked": ue.value,
					"is-disabled": !de.value
				}
			],
			style: [z(v).style, ye.value],
			role: "presentation",
			dir: ge.value,
			"aria-disabled": de.value ? void 0 : "true"
		}), [se.value ? (D(), l("div", Qs, [M(e.$slots, "TitleTemplate", { Title: oe.value }, () => [ce.value ? (D(), s(P(ce.value), {
			key: 0,
			Title: oe.value
		}, null, 8, ["Title"])) : (D(), s(Rt, {
			key: 1,
			class: "win-pivot-title",
			Text: oe.value,
			FontSize: "14",
			FontWeight: "700",
			TextWrapping: "NoWrap"
		}, null, 8, ["Text"]))], !0)])) : c("", !0), u("div", {
			class: "win-pivot-template-grid",
			style: C(be.value)
		}, [u("div", $s, [
			e.$slots.LeftHeader || n.LeftHeader || n.LeftHeaderTemplate ? (D(), l("div", ec, [M(e.$slots, "LeftHeader", {}, () => [n.LeftHeaderTemplate ? (D(), s(P(n.LeftHeaderTemplate), {
				key: 0,
				Content: n.LeftHeader
			}, null, 8, ["Content"])) : (D(), s(Rt, {
				key: 1,
				Text: n.LeftHeader,
				TextWrapping: "NoWrap"
			}, null, 8, ["Text"]))], !0)])) : c("", !0),
			u("div", tc, [
				m(Ft, {
					ref_key: "headerScrollerRef",
					ref: T,
					class: "win-pivot-header-scroll-viewer",
					HorizontalScrollMode: "Auto",
					HorizontalScrollBarVisibility: "Hidden",
					VerticalScrollMode: "Disabled",
					VerticalScrollBarVisibility: "Disabled",
					ZoomMode: "Disabled",
					IsTabStop: !1,
					onViewChanged: Xe
				}, {
					default: H(() => [u("div", {
						ref_key: "headerPanelRef",
						ref: E,
						class: "win-pivot-header-panel",
						role: "tablist"
					}, [(D(!0), l(t, null, j(we.value, (t, n) => (D(), s(Kn, {
						key: Ee(t, n),
						ref_for: !0,
						ref: (e) => Ne(n, e),
						class: S(["win-pivot-header-item", je(t, n)]),
						IsEnabled: de.value && !Oe(t),
						tabindex: n === N.value ? 0 : -1,
						role: "tab",
						"aria-selected": n === N.value,
						"aria-disabled": Oe(t) || !de.value ? "true" : void 0,
						onClick: (e) => We(n, !1, !0),
						onFocus: (e) => Ge(n),
						onKeydown: (e) => Je(e, n)
					}, {
						default: H(() => [M(e.$slots, "HeaderTemplate", {
							Item: t.Source,
							Index: n
						}, () => [le.value ? (D(), s(P(le.value), {
							key: 0,
							Item: t.Source,
							Index: n
						}, null, 8, ["Item", "Index"])) : (D(), s(Rt, {
							key: 1,
							class: "win-pivot-header-content",
							Text: De(t),
							FontSize: "24",
							FontWeight: "300",
							CharacterSpacing: "-25",
							TextWrapping: "NoWrap",
							OpticalMarginAlignment: "TrimSideBearings"
						}, null, 8, ["Text"]))], !0), r[2] ||= u("div", {
							class: "win-pivot-selected-pipe",
							"aria-hidden": "true"
						}, null, -1)]),
						_: 2
					}, 1032, [
						"class",
						"IsEnabled",
						"tabindex",
						"aria-selected",
						"aria-disabled",
						"onClick",
						"onFocus",
						"onKeydown"
					]))), 128))], 512)]),
					_: 3
				}, 512),
				U(m(Kn, {
					class: "win-pivot-nav-button win-pivot-previous-button",
					IsEnabled: de.value && R.value,
					tabindex: -1,
					"aria-hidden": !0,
					onClick: r[0] ||= (e) => Ze(-1)
				}, {
					default: H(() => [m(Rt, {
						class: "win-pivot-nav-glyph",
						Text: "",
						FontFamily: "var(--SymbolThemeFontFamily, 'Segoe Fluent Icons')",
						FontSize: "12",
						IsTextScaleFactorEnabled: !1
					})]),
					_: 1
				}, 8, ["IsEnabled"]), [[B, me.value]]),
				U(m(Kn, {
					class: "win-pivot-nav-button win-pivot-next-button",
					IsEnabled: de.value && W.value,
					tabindex: -1,
					"aria-hidden": !0,
					onClick: r[1] ||= (e) => Ze(1)
				}, {
					default: H(() => [m(Rt, {
						class: "win-pivot-nav-glyph",
						Text: "",
						FontFamily: "var(--SymbolThemeFontFamily, 'Segoe Fluent Icons')",
						FontSize: "12",
						IsTextScaleFactorEnabled: !1
					})]),
					_: 1
				}, 8, ["IsEnabled"]), [[B, he.value]])
			]),
			e.$slots.RightHeader || n.RightHeader || n.RightHeaderTemplate ? (D(), l("div", nc, [M(e.$slots, "RightHeader", {}, () => [n.RightHeaderTemplate ? (D(), s(P(n.RightHeaderTemplate), {
				key: 0,
				Content: n.RightHeader
			}, null, 8, ["Content"])) : (D(), s(Rt, {
				key: 1,
				Text: n.RightHeader,
				TextWrapping: "NoWrap"
			}, null, 8, ["Text"]))], !0)])) : c("", !0),
			u("div", rc, [pe.value ? (D(), l("div", {
				ref_key: "itemHostRef",
				ref: O,
				key: pe.value.Key,
				class: "win-pivot-item-host"
			}, [(D(), s(P(z(ae)), { vnode: pe.value.VNode }, null, 8, ["vnode"]))])) : c("", !0)])
		])], 4)], 16, Zs));
	}
}), [["__scopeId", "data-v-ac0bb807"]]), ac = ["aria-disabled"], oc = /*#__PURE__*/ dt(/* @__PURE__ */ Object.assign({ name: "PivotItem" }, {
	__name: "PivotItem",
	props: {
		Header: {
			type: [
				String,
				Number,
				Object
			],
			default: ""
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		}
	},
	setup(e, { expose: t }) {
		let n = e;
		return t({
			get Header() {
				return n.Header;
			},
			get IsEnabled() {
				return n.IsEnabled;
			}
		}), (t, n) => (D(), l("div", {
			class: "win-pivot-item",
			"aria-disabled": e.IsEnabled ? void 0 : "true"
		}, [M(t.$slots, "default", {}, void 0, !0)], 8, ac));
	}
}), [["__scopeId", "data-v-03d9b339"]]), sc = ["aria-disabled"], cc = [
	"disabled",
	"tabindex",
	"aria-selected",
	"aria-disabled",
	"onClick",
	"onFocus",
	"onKeydown"
], lc = { class: "win-selector-bar-item-content" }, uc = {
	key: 0,
	class: "win-selector-bar-item-icon",
	"aria-hidden": "true"
}, dc = ["innerHTML"], fc = {
	key: 1,
	class: "win-selector-bar-item-icon-glyph icon"
}, pc = {
	key: 1,
	class: "win-selector-bar-item-text"
}, mc = /*#__PURE__*/ dt(/* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
	__name: "SelectorBar",
	props: {
		Items: {
			type: Array,
			default: void 0
		},
		SelectedItem: {
			type: null,
			default: void 0
		},
		Padding: {
			type: [String, Number],
			default: "0,4"
		},
		Background: {
			type: String,
			default: "transparent"
		},
		BorderBrush: {
			type: String,
			default: "transparent"
		},
		CornerRadius: {
			type: [String, Number],
			default: "0"
		},
		TabNavigation: {
			type: String,
			default: "Once"
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		MaxHeight: {
			type: [String, Number],
			default: ""
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: "Left"
		},
		VerticalAlignment: {
			type: String,
			default: "Top"
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		}
	},
	emits: ["SelectionChanged", "update:SelectedItem"],
	setup(n, { expose: i, emit: a }) {
		let s = n, d = a, f = ne(), p = te(), m = A(null), h = /* @__PURE__ */ new Map(), g = A(-1), _ = A(-1), v = 0, y = /* @__PURE__ */ new WeakMap(), w = {
			Accept: "",
			Add: "",
			Back: "",
			Calendar: "",
			Cancel: "",
			Clock: "",
			Contact: "",
			Delete: "",
			Edit: "",
			Favorite: "",
			Filter: "",
			Home: "",
			Mail: "",
			More: "",
			Play: "",
			Refresh: "",
			Save: "",
			Search: "",
			Setting: "",
			Settings: "",
			Share: "",
			Sort: "",
			Star: "",
			Sync: ""
		}, T = o(() => {
			let { class: e, style: t, ...n } = p;
			return n;
		}), E = o(() => s.IsEnabled !== !1), O = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, k = (e) => {
			if (e === "" || e == null) return "";
			let t = String(e).split(",").map((e) => {
				let t = e.trim();
				return O(Number.isNaN(Number(t)) ? t : Number(t));
			});
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : String(e);
		}, M = (e) => ({
			Left: "start",
			Center: "center",
			Right: "end",
			Stretch: "stretch",
			Top: "start",
			Bottom: "end"
		})[e] ?? void 0, N = (e) => ({
			Left: "flex-start",
			Center: "center",
			Right: "flex-end",
			Stretch: "stretch"
		})[e] ?? "center", P = (e) => ({
			Top: "flex-start",
			Center: "center",
			Bottom: "flex-end",
			Stretch: "stretch"
		})[e] ?? "center", F = (e, t = !1) => {
			if (e == null) return t;
			if (e === "") return !0;
			if (typeof e == "boolean") return e;
			let n = String(e).trim().toLowerCase();
			return [
				"true",
				"1",
				"yes"
			].includes(n) ? !0 : [
				"false",
				"0",
				"no"
			].includes(n) ? !1 : !!e;
		}, I = (e, t) => R(e) === R(t), B = (n) => {
			let i = [];
			for (let a of n ?? []) if (!(!a || a.type === e || a.type === r)) {
				if (a.type === t && Array.isArray(a.children)) {
					i.push(...B(a.children));
					continue;
				}
				i.push(a);
			}
			return i;
		}, H = (e) => !e || typeof e.type == "string" ? "" : e.type?.name || e.type?.__name || "", U = (e, t, n = void 0) => e ? e[t] === void 0 ? n : e[t] : n, W = (e, t, n = null) => {
			let r = n?.key ?? e?.Key ?? e?.Id ?? e?.Name;
			if (r != null) return r;
			if (n && e?.Text !== void 0 && e?.Text !== null) return `slot:${t}:${String(e.Text)}`;
			if (e && typeof e == "object") {
				let t = R(e);
				return y.has(t) || y.set(t, ++v), `object:${y.get(t)}`;
			}
			return `${t}:${String(e ?? "")}`;
		}, G = (e, t, n = null) => ({
			Source: e,
			Key: W(e, t, n),
			Text: U(e, "Text", ""),
			Icon: U(e, "Icon", ""),
			IsSelected: F(U(e, "IsSelected", !1)),
			IsEnabled: F(U(e, "IsEnabled", !0), !0),
			Padding: U(e, "Padding", "12,10,12,7"),
			Width: U(e, "Width", ""),
			Height: U(e, "Height", ""),
			MinWidth: U(e, "MinWidth", ""),
			MaxWidth: U(e, "MaxWidth", ""),
			HorizontalContentAlignment: U(e, "HorizontalContentAlignment", "Center"),
			VerticalContentAlignment: U(e, "VerticalContentAlignment", "Center")
		}), re = o(() => B(f.default?.() ?? []).filter((e) => H(e) === "SelectorBarItem" || U(e.props, "Text") !== void 0).map((e, t) => G(e.props ?? {}, t, e))), K = o(() => Array.isArray(s.Items) ? s.Items.map((e, t) => G(e, t)) : re.value), q = o(() => {
			let e = {
				background: s.Background,
				borderColor: s.BorderBrush,
				borderRadius: O(s.CornerRadius)
			};
			return s.Width !== "" && (e.width = O(s.Width)), s.Height !== "" && (e.height = O(s.Height)), s.MinWidth !== "" && (e.minWidth = O(s.MinWidth)), s.MinHeight !== "" && (e.minHeight = O(s.MinHeight)), s.MaxWidth !== "" && (e.maxWidth = O(s.MaxWidth)), s.MaxHeight !== "" && (e.maxHeight = O(s.MaxHeight)), s.HorizontalAlignment && (e.justifySelf = M(s.HorizontalAlignment)), s.VerticalAlignment && (e.alignSelf = M(s.VerticalAlignment)), e;
		}), J = o(() => {
			let e = { padding: k(s.Padding) };
			return s.MaxWidth !== "" && (e.maxWidth = O(s.MaxWidth)), s.MaxHeight !== "" && (e.maxHeight = O(s.MaxHeight)), e;
		}), ie = o(() => K.value[g.value] ?? null), Y = (e, t) => e.Key ?? W(e.Source, t), X = (e) => e.Text === void 0 || e.Text === null ? "" : String(e.Text), Z = (e) => X(e).length > 0, ae = (e) => e.Icon !== void 0 && e.Icon !== null && String(e.Icon).length > 0, Q = (e) => e.IsEnabled !== !1, oe = (e) => String(e ?? "").trim().startsWith("<") || String(e ?? "").trim().startsWith("&"), se = (e) => {
			let t = String(e ?? "");
			return w[t] ?? t;
		}, ce = (e, t) => ({
			"is-selected": t === g.value,
			"is-unselected": t !== g.value,
			"is-disabled": !E.value || !Q(e),
			"has-icon": ae(e),
			"has-text": Z(e)
		}), le = (e) => {
			let t = {
				"--win-selector-bar-item-padding": k(e.Padding),
				justifyContent: N(e.HorizontalContentAlignment),
				alignItems: P(e.VerticalContentAlignment)
			};
			return e.Width !== "" && (t.width = O(e.Width)), e.Height !== "" && (t.height = O(e.Height)), e.MinWidth !== "" && (t.minWidth = O(e.MinWidth)), e.MaxWidth !== "" && (t.maxWidth = O(e.MaxWidth)), t;
		}, ue = () => K.value.findIndex((e) => Q(e)), de = (e, t) => !E.value || !Q(e) ? -1 : g.value >= 0 ? t === g.value ? 0 : -1 : t === ue() ? 0 : -1, fe = (e, t) => {
			t ? h.set(e, t) : h.delete(e);
		}, $ = () => {
			if (!K.value.length) return -1;
			if (s.SelectedItem !== void 0 && s.SelectedItem !== null) {
				let e = K.value.findIndex((e) => I(e.Source, s.SelectedItem));
				if (e < 0) throw Error("SelectedItem must be an element of Items.");
				return e;
			}
			return s.SelectedItem === null ? -1 : K.value.findIndex((e) => e.IsSelected);
		}, pe = () => {
			let e = $();
			e !== g.value && (g.value = e, _.value = e);
		}, me = () => {
			if (s.SelectedItem !== void 0) {
				pe();
				return;
			}
			g.value >= K.value.length && (g.value = -1, _.value = -1), g.value < 0 && pe();
		}, he = async (e, t = !1) => {
			if (!E.value || e < 0 || e >= K.value.length) return;
			let n = K.value[e];
			!n || !Q(n) || e !== g.value && (g.value = e, _.value = e, d("update:SelectedItem", n.Source), d("SelectionChanged", be(), Object.freeze({})), t && (await x(), h.get(e)?.focus?.({ preventScroll: !0 })));
		}, ge = () => K.value.map((e) => e.Source), _e = () => ie.value?.Source ?? null, ve = (e) => {
			let t = K.value.findIndex((t) => I(t.Source, e));
			if (t < 0 && e != null) throw Error("SelectedItem must be an element of Items.");
			t !== g.value && (g.value = t, _.value = t, d("update:SelectedItem", e ?? null), d("SelectionChanged", be(), Object.freeze({})));
		}, ye = {
			get Items() {
				return ge();
			},
			get SelectedItem() {
				return _e();
			},
			set SelectedItem(e) {
				ve(e);
			}
		}, be = () => ye, xe = () => K.value.map((e, t) => Q(e) && E.value ? t : null).filter((e) => e !== null), Se = (e, t) => {
			let n = xe(), r = n.indexOf(t);
			if (r < 0) return;
			let i = r;
			if (e.key === "ArrowRight") i = Math.min(n.length - 1, r + 1);
			else if (e.key === "ArrowLeft") i = Math.max(0, r - 1);
			else if (e.key === "Home") i = 0;
			else if (e.key === "End") i = n.length - 1;
			else if (e.key === "Enter" || e.key === " ") {
				e.preventDefault(), he(t, !0);
				return;
			} else return;
			e.preventDefault(), he(n[i], !0);
		};
		return V(() => s.SelectedItem, pe), V(K, me, { immediate: !0 }), ee(() => {
			pe();
		}), i({
			get Items() {
				return ge();
			},
			get SelectedItem() {
				return _e();
			},
			set SelectedItem(e) {
				ve(e);
			}
		}), (e, n) => (D(), l("div", b({
			ref_key: "rootRef",
			ref: m
		}, T.value, {
			class: [
				"win-selector-bar",
				z(p).class,
				{ "is-disabled": !E.value }
			],
			style: [z(p).style, q.value],
			role: "tablist",
			"aria-disabled": E.value ? void 0 : "true"
		}), [u("div", {
			class: "win-selector-bar-items-view",
			style: C(J.value)
		}, [(D(!0), l(t, null, j(K.value, (e, t) => (D(), l("button", {
			key: Y(e, t),
			ref_for: !0,
			ref: (e) => fe(t, e),
			class: S(["win-selector-bar-item", ce(e, t)]),
			style: C(le(e)),
			disabled: !E.value || !Q(e),
			tabindex: de(e, t),
			role: "tab",
			type: "button",
			"aria-selected": t === g.value,
			"aria-disabled": !E.value || !Q(e) ? "true" : void 0,
			onClick: (e) => he(t, !0),
			onFocus: (e) => _.value = t,
			onKeydown: (e) => Se(e, t)
		}, [
			u("span", lc, [ae(e) ? (D(), l("span", uc, [oe(e.Icon) ? (D(), l("span", {
				key: 0,
				class: "win-selector-bar-item-icon-glyph icon",
				innerHTML: se(e.Icon)
			}, null, 8, dc)) : (D(), l("span", fc, L(se(e.Icon)), 1))])) : c("", !0), Z(e) ? (D(), l("span", pc, L(X(e)), 1)) : c("", !0)]),
			n[0] ||= u("span", {
				class: "win-selector-bar-item-selection-visual",
				"aria-hidden": "true"
			}, null, -1),
			n[1] ||= u("span", {
				class: "win-selector-bar-item-common-visual",
				"aria-hidden": "true"
			}, null, -1)
		], 46, cc))), 128))], 4)], 16, sc));
	}
}), [["__scopeId", "data-v-1b97a436"]]), hc = ["aria-disabled"], gc = /*#__PURE__*/ dt(/* @__PURE__ */ Object.assign({ name: "SelectorBarItem" }, {
	__name: "SelectorBarItem",
	props: {
		Text: {
			type: [String, Number],
			default: ""
		},
		Icon: {
			type: [String, Object],
			default: ""
		},
		IsSelected: {
			type: [Boolean, String],
			default: !1
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		Padding: {
			type: [String, Number],
			default: void 0
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		HorizontalContentAlignment: {
			type: String,
			default: "Center"
		},
		VerticalContentAlignment: {
			type: String,
			default: "Center"
		}
	},
	setup(e, { expose: t }) {
		let n = e;
		return t({
			get Text() {
				return n.Text;
			},
			get Icon() {
				return n.Icon;
			},
			get IsSelected() {
				return n.IsSelected;
			},
			get IsEnabled() {
				return n.IsEnabled;
			}
		}), (t, n) => (D(), l("div", {
			class: "win-selector-bar-item-host",
			"aria-disabled": e.IsEnabled ? void 0 : "true"
		}, [M(t.$slots, "default", {}, void 0, !0)], 8, hc));
	}
}), [["__scopeId", "data-v-994936e1"]]), _c = ["aria-disabled", "dir"], vc = { class: "win-breadcrumb-items-repeater" }, yc = ["aria-hidden", "inert"], bc = ["aria-hidden", "inert"], xc = [
	"aria-disabled",
	"tabindex",
	"aria-posinset",
	"aria-setsize",
	"onFocus",
	"onKeydown"
], Sc = {
	class: "win-breadcrumb-flyout-items",
	role: "menu"
}, Cc = -1, wc = /*#__PURE__*/ dt(/* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
	__name: "BreadcrumbBar",
	props: {
		ItemsSource: {
			type: [Array, Object],
			default: null
		},
		ItemTemplate: {
			type: [
				Object,
				Function,
				String
			],
			default: null
		},
		FlowDirection: {
			type: String,
			default: ""
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		}
	},
	emits: ["ItemClicked"],
	setup(e, { emit: n }) {
		let r = g(), i = e, a = n, { t: d } = rt(), f = te(), p = o(() => {
			let { class: e, style: t, ...n } = f;
			return n;
		}), h = `breadcrumb-${r?.uid ?? 0}`, _ = A(null), v = A(null), y = A(null), C = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), O = A(0), k = A(!1), N = A(!1), F = A(null), I = A(null), L = A("ltr"), R, ne = 0, B = 0, U = /* @__PURE__ */ new WeakMap(), W = o(() => Array.isArray(i.ItemsSource) ? i.ItemsSource : i.ItemsSource && typeof i.ItemsSource[Symbol.iterator] == "function" ? Array.from(i.ItemsSource) : []), G = o(() => i.FlowDirection === "RightToLeft" ? "rtl" : i.FlowDirection === "LeftToRight" ? "ltr" : L.value), re = o(() => G.value === "rtl" ? "" : ""), K = o(() => Math.max(0, W.value.length - O.value)), q = o(() => W.value.slice(0, O.value).map((e, t) => ({
			Item: e,
			Index: t
		})).reverse()), J = (e) => e?.$el ?? e ?? null, ie = (e, t) => e && typeof e == "object" ? e.Key ?? e.Id ?? e.id ?? (U.has(e) || U.set(e, ++B), `object:${U.get(e)}`) : `${t}:${String(e)}`, Y = (e) => e == null ? "" : String(e), X = (e) => i.IsEnabled && e?.IsEnabled !== !1, Z = (e) => k.value && e < O.value, ae = (e, t) => {
			t ? C.set(e, J(t)) : C.delete(e);
		}, Q = (e, t) => {
			t ? T.set(e, J(t)) : T.delete(e);
		}, oe = (e, t) => {
			t ? E.set(e, J(t)) : E.delete(e);
		}, se = () => {
			if (!i.IsEnabled || !W.value.length) return null;
			if (k.value) return Cc;
			let e = W.value.findIndex((e) => X(e));
			return e >= 0 ? e : null;
		}, ce = (e) => (I.value ?? se()) === e ? 0 : -1, le = () => {
			let e = [];
			i.IsEnabled && k.value && e.push(Cc);
			for (let t = O.value; t < W.value.length; t += 1) X(W.value[t]) && e.push(t);
			return e;
		}, ue = (e) => e === Cc ? J(y.value) : T.get(e) ?? null, de = (e) => {
			I.value = e, x(() => ue(e)?.focus());
		}, fe = () => {
			let e = le();
			if (!e.length) {
				I.value = null;
				return;
			}
			e.includes(I.value) || (I.value = e[0]);
		}, $ = () => {
			ne = 0;
			let e = _.value;
			if (!e || !W.value.length) {
				k.value = !1, O.value = 0, fe();
				return;
			}
			L.value = getComputedStyle(e).direction === "rtl" ? "rtl" : "ltr";
			let t = e.clientWidth, n = W.value.map((e, t) => C.get(t)?.getBoundingClientRect().width ?? 0), r = n.reduce((e, t) => e + t, 0) > t;
			if (k.value = r, !r) {
				O.value = 0, fe();
				return;
			}
			let i = J(v.value)?.getBoundingClientRect().width ?? 0, a = W.value.length - 1, o = (n[a] ?? 0) + i;
			for (let e = W.value.length - 2; e >= 0; --e) {
				let r = o + (n[e] ?? 0);
				if (r > t) break;
				o = r, a = e;
			}
			O.value = a, fe();
		}, pe = () => {
			ne && cancelAnimationFrame(ne), ne = requestAnimationFrame($);
		}, me = () => {
			R && (R.disconnect(), _.value && R.observe(_.value), J(v.value) && R.observe(J(v.value)), C.forEach((e) => R.observe(e)));
		}, he = (e, t) => {
			X(e) && a("ItemClicked", r?.proxy, Object.freeze({
				Index: t,
				Item: e
			}));
		}, ge = (e) => {
			I.value = e;
		}, _e = async () => {
			if (!i.IsEnabled || !k.value || !q.value.length) return;
			let e = ue(Cc);
			e && (F.value = e.getBoundingClientRect(), N.value = !0, await x(), requestAnimationFrame(() => {
				let e = q.value.findIndex(({ Item: e }) => X(e));
				e >= 0 && E.get(e)?.focus();
			}));
		}, ve = () => {
			N.value = !1;
		}, ye = (e, t) => {
			X(e) && (ve(), he(e, t));
		}, be = (e, t) => {
			let n = G.value === "rtl" ? "ArrowLeft" : "ArrowRight", r = G.value === "rtl" ? "ArrowRight" : "ArrowLeft";
			if (e.key === "Enter" || e.key === " ") {
				t === W.value.length - 1 && (e.preventDefault(), he(W.value[t], t));
				return;
			}
			if (e.key !== n && e.key !== r) return;
			let i = le(), a = i.indexOf(t);
			if (a < 0) return;
			let o = a + (e.key === n ? 1 : -1);
			o < 0 || o >= i.length || (e.preventDefault(), de(i[o]));
		}, xe = (e, t) => {
			if (e.key === "Escape") {
				e.preventDefault(), ve(), de(Cc);
				return;
			}
			let n = q.value.map(({ Item: e }, t) => X(e) ? t : null).filter((e) => e !== null), r = n.indexOf(t);
			if (r < 0) return;
			let i = r;
			if (e.key === "ArrowDown") i = Math.min(n.length - 1, r + 1);
			else if (e.key === "ArrowUp") i = Math.max(0, r - 1);
			else if (e.key === "Home") i = 0;
			else if (e.key === "End") i = n.length - 1;
			else return;
			e.preventDefault(), E.get(n[i])?.focus();
		};
		return V(() => i.ItemsSource, async () => {
			ve(), await x(), me(), pe();
		}, { deep: !0 }), V(() => i.ItemTemplate, async () => {
			await x(), me(), pe();
		}), ee(async () => {
			R = new ResizeObserver(pe), await x(), me(), pe(), document.fonts?.ready.then(pe);
		}), w(() => {
			R?.disconnect(), ne && cancelAnimationFrame(ne);
		}), (n, r) => (D(), l(t, null, [u("nav", b({
			ref_key: "rootRef",
			ref: _
		}, p.value, {
			class: ["win-breadcrumb-bar", z(f).class],
			style: z(f).style,
			role: "navigation",
			"aria-disabled": e.IsEnabled ? void 0 : "true",
			dir: G.value
		}), [u("div", vc, [u("div", {
			ref_key: "ellipsisLayoutRef",
			ref: v,
			class: S(["win-breadcrumb-layout-root win-breadcrumb-ellipsis-item", { "is-crumbled": !k.value }]),
			"aria-hidden": k.value ? void 0 : "true",
			inert: k.value ? void 0 : ""
		}, [m(Kn, {
			ref_key: "ellipsisButtonRef",
			ref: y,
			class: "win-breadcrumb-item-button win-breadcrumb-ellipsis-button",
			IsEnabled: e.IsEnabled,
			tabindex: ce(Cc),
			"aria-label": z(d)("text.more"),
			onFocus: r[0] ||= (e) => ge(Cc),
			onClick: _e,
			onKeydown: r[1] ||= (e) => be(e, Cc)
		}, {
			default: H(() => [m(Rt, {
				class: "win-breadcrumb-ellipsis-glyph icon",
				Text: "",
				FontFamily: "var(--SymbolThemeFontFamily, 'Segoe Fluent Icons')",
				IsTextScaleFactorEnabled: !1
			})]),
			_: 1
		}, 8, [
			"IsEnabled",
			"tabindex",
			"aria-label"
		]), m(Rt, {
			class: "win-breadcrumb-chevron icon",
			Text: re.value,
			FontFamily: "var(--SymbolThemeFontFamily, 'Segoe Fluent Icons')",
			FontSize: "12",
			IsTextScaleFactorEnabled: !1,
			"aria-hidden": "true"
		}, null, 8, ["Text"])], 10, yc), (D(!0), l(t, null, j(W.value, (t, r) => (D(), l("div", {
			key: ie(t, r),
			ref_for: !0,
			ref: (e) => ae(r, e),
			class: S(["win-breadcrumb-layout-root", {
				"is-current": r === W.value.length - 1,
				"is-crumbled": Z(r),
				"is-disabled": !X(t)
			}]),
			"aria-hidden": Z(r) ? "true" : void 0,
			inert: Z(r) ? "" : void 0
		}, [r < W.value.length - 1 ? (D(), s(Kn, {
			key: 0,
			ref_for: !0,
			ref: (e) => Q(r, e),
			class: "win-breadcrumb-item-button",
			IsEnabled: X(t),
			tabindex: Z(r) ? -1 : ce(r),
			"aria-posinset": Z(r) ? void 0 : r - O.value + 1,
			"aria-setsize": Z(r) ? void 0 : K.value,
			onFocus: (e) => ge(r),
			onClick: (e) => he(t, r),
			onKeydown: (e) => be(e, r)
		}, {
			default: H(() => [M(n.$slots, "ItemTemplate", {
				Item: t,
				Index: r
			}, () => [e.ItemTemplate ? (D(), s(P(e.ItemTemplate), {
				key: 0,
				Item: t,
				Index: r
			}, null, 8, ["Item", "Index"])) : (D(), s(Rt, {
				key: 1,
				class: "win-breadcrumb-item-content",
				Text: Y(t),
				LineHeight: "20",
				TextWrapping: "NoWrap"
			}, null, 8, ["Text"]))], !0)]),
			_: 2
		}, 1032, [
			"IsEnabled",
			"tabindex",
			"aria-posinset",
			"aria-setsize",
			"onFocus",
			"onClick",
			"onKeydown"
		])) : (D(), l("div", {
			key: 1,
			ref_for: !0,
			ref: (e) => Q(r, e),
			class: S(["win-breadcrumb-current-item", { "is-disabled": !X(t) }]),
			role: "button",
			"aria-disabled": X(t) ? void 0 : "true",
			tabindex: Z(r) ? -1 : ce(r),
			"aria-posinset": Z(r) ? void 0 : r - O.value + 1,
			"aria-setsize": Z(r) ? void 0 : K.value,
			onFocus: (e) => ge(r),
			onKeydown: (e) => be(e, r)
		}, [M(n.$slots, "ItemTemplate", {
			Item: t,
			Index: r
		}, () => [e.ItemTemplate ? (D(), s(P(e.ItemTemplate), {
			key: 0,
			Item: t,
			Index: r
		}, null, 8, ["Item", "Index"])) : (D(), s(Rt, {
			key: 1,
			class: "win-breadcrumb-item-content",
			Text: Y(t),
			LineHeight: "20",
			TextWrapping: "NoWrap"
		}, null, 8, ["Text"]))], !0)], 42, xc)), r < W.value.length - 1 ? (D(), s(Rt, {
			key: 2,
			class: "win-breadcrumb-chevron icon",
			Text: re.value,
			FontFamily: "var(--SymbolThemeFontFamily, 'Segoe Fluent Icons')",
			FontSize: "12",
			IsTextScaleFactorEnabled: !1,
			"aria-hidden": "true"
		}, null, 8, ["Text"])) : c("", !0)], 10, bc))), 128))])], 16, _c), m(It, {
			Open: N.value,
			AnchorRect: F.value,
			Placement: "Bottom",
			MinWidth: 20,
			onClose: ve
		}, {
			default: H(() => [u("div", Sc, [(D(!0), l(t, null, j(q.value, ({ Item: t, Index: r }, i) => (D(), s(Kn, {
				key: ie(t, r),
				ref_for: !0,
				ref: (e) => oe(i, e),
				class: "win-breadcrumb-flyout-item",
				Style: "{StaticResource SubtleButtonStyle}",
				IsEnabled: X(t),
				role: "menuitem",
				"data-breadcrumb-owner": h,
				"aria-posinset": i + 1,
				"aria-setsize": q.value.length,
				onClick: (e) => ye(t, r),
				onKeydown: (e) => xe(e, i)
			}, {
				default: H(() => [M(n.$slots, "ItemTemplate", {
					Item: t,
					Index: r
				}, () => [e.ItemTemplate ? (D(), s(P(e.ItemTemplate), {
					key: 0,
					Item: t,
					Index: r
				}, null, 8, ["Item", "Index"])) : (D(), s(Rt, {
					key: 1,
					class: "win-breadcrumb-flyout-item-content",
					Text: Y(t),
					LineHeight: "20",
					TextWrapping: "NoWrap"
				}, null, 8, ["Text"]))], !0)]),
				_: 2
			}, 1032, [
				"IsEnabled",
				"aria-posinset",
				"aria-setsize",
				"onClick",
				"onKeydown"
			]))), 128))])]),
			_: 3
		}, 8, ["Open", "AnchorRect"])], 64));
	}
}), [["__scopeId", "data-v-51816560"]]), Tc = ["disabled", "aria-label"], Ec = [
	"disabled",
	"aria-label",
	"aria-posinset",
	"aria-setsize",
	"onClick"
], Dc = ["disabled", "aria-label"], Oc = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "PipsPager",
	props: {
		NumberOfPages: { default: -1 },
		SelectedPageIndex: { default: 0 },
		MaxVisiblePips: { default: 5 },
		Orientation: { default: "Horizontal" },
		PreviousButtonVisibility: { default: "Collapsed" },
		NextButtonVisibility: { default: "Collapsed" },
		PreviousButtonStyle: {},
		NextButtonStyle: {},
		SelectedPipStyle: {},
		NormalPipStyle: {},
		WrapMode: { default: "None" },
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		Background: { default: "transparent" },
		Width: {},
		Height: {},
		Margin: {},
		HorizontalAlignment: { default: "Left" },
		VerticalAlignment: { default: "Top" }
	},
	emits: ["update:SelectedPageIndex", "SelectedIndexChanged"],
	setup(e, { expose: n, emit: r }) {
		let i = e, { t: a } = rt(), s = r, d = A(!1), f = A(!1), p = A(i.SelectedPageIndex), m = o(() => i.NumberOfPages === 0 || i.MaxVisiblePips <= 0 ? 0 : i.NumberOfPages > 0 ? i.NumberOfPages : Math.max(i.MaxVisiblePips, p.value + 2)), h = o(() => i.NumberOfPages > 0 ? Math.min(Math.max(0, p.value), i.NumberOfPages - 1) : Math.max(0, p.value)), g = o(() => Array.from({ length: m.value }, (e, t) => t)), _ = o(() => Math.min(Math.max(0, i.MaxVisiblePips), m.value)), v = o(() => i.Orientation === "Horizontal"), y = o(() => i.WrapMode === "Wrap" && i.NumberOfPages > 1), x = o(() => m.value > 0 && (h.value > 0 || y.value)), w = o(() => m.value > 0 && (i.NumberOfPages < 0 || h.value < i.NumberOfPages - 1 || y.value)), ee = o(() => d.value || f.value), T = o(() => m.value > 0 && x.value && (i.PreviousButtonVisibility === "Visible" || ee.value)), E = o(() => m.value > 0 && w.value && (i.NextButtonVisibility === "Visible" || ee.value)), O = o(() => {
			let e = _.value;
			if (e <= 0 || m.value <= e) return 0;
			let t = h.value - Math.floor(e / 2);
			return Math.min(Math.max(0, t), m.value - e);
		}), k = (e) => {
			if (!(e === void 0 || e === "")) return typeof e == "number" || !Number.isNaN(Number(e)) ? `${Number(e)}px` : e;
		}, M = (e) => {
			if (e === void 0 || e === "") return;
			let t = String(e).split(",").map((e) => k(e.trim()));
			return t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : t[0];
		}, N = o(() => ({
			Left: "flex-start",
			Center: "center",
			Right: "flex-end",
			Stretch: "stretch"
		})[i.HorizontalAlignment] ?? "flex-start"), P = o(() => ({
			width: k(i.Width),
			height: k(i.Height),
			margin: M(i.Margin),
			justifySelf: N.value,
			alignSelf: N.value,
			background: i.Background
		})), F = o(() => v.value ? {
			width: `${_.value * 12}px`,
			height: m.value ? "24px" : "0px"
		} : {
			width: m.value ? "24px" : "0px",
			height: `${_.value * 12}px`
		}), I = o(() => ({ transform: v.value ? `translateX(${-O.value * 12}px)` : `translateY(${-O.value * 12}px)` })), L = (e) => {
			if (!i.IsEnabled || m.value === 0) return;
			let t = e;
			t = i.NumberOfPages > 0 ? y.value ? (e + i.NumberOfPages) % i.NumberOfPages : Math.min(Math.max(0, e), i.NumberOfPages - 1) : Math.max(0, e), t !== h.value && (p.value = t, s("update:SelectedPageIndex", t), s("SelectedIndexChanged", {}));
		}, R = () => L(h.value - 1), te = () => L(h.value + 1), ne = (e) => {
			if (!i.IsEnabled) return;
			let t = v.value ? "ArrowLeft" : "ArrowUp", n = v.value ? "ArrowRight" : "ArrowDown";
			e.key === t ? (e.preventDefault(), R()) : e.key === n ? (e.preventDefault(), te()) : e.key === "Home" ? (e.preventDefault(), L(0)) : e.key === "End" && i.NumberOfPages > 0 && (e.preventDefault(), L(i.NumberOfPages - 1));
		};
		return V(() => i.SelectedPageIndex, (e) => {
			p.value = e;
		}), V(() => i.NumberOfPages, () => {
			i.NumberOfPages <= 0 || p.value === h.value || (p.value = h.value, s("update:SelectedPageIndex", h.value));
		}), n({
			GoToPreviousPage: R,
			GoToNextPage: te,
			SetSelectedPageIndex: L
		}), (n, r) => (D(), l("div", {
			class: S(["win-pips-pager", [`orientation-${e.Orientation.toLowerCase()}`, { "is-disabled": !e.IsEnabled }]]),
			style: C(P.value),
			role: "group",
			onPointerenter: r[0] ||= (e) => d.value = !0,
			onPointerleave: r[1] ||= (e) => d.value = !1,
			onFocusin: r[2] ||= (e) => f.value = !0,
			onFocusout: r[3] ||= (e) => f.value = !1,
			onKeydown: ne
		}, [
			e.PreviousButtonVisibility === "Collapsed" ? c("", !0) : (D(), l("button", b({
				key: 0,
				class: ["navigation-button previous-page-button", { hidden: !T.value }],
				disabled: !e.IsEnabled || !x.value,
				style: e.PreviousButtonStyle,
				type: "button",
				"aria-label": z(a)("text.previous-page")
			}, { "tooltipservice.tooltip": z(a)("text.previous-page") }, { onClick: R }), [...r[4] ||= [u("span", { "aria-hidden": "true" }, "", -1)]], 16, Tc)),
			u("div", {
				class: "pips-viewport",
				style: C(F.value)
			}, [u("div", {
				class: "pips-repeater",
				style: C(I.value)
			}, [(D(!0), l(t, null, j(g.value, (t) => (D(), l("button", {
				key: t,
				class: S(["pip-button", { selected: t === h.value }]),
				disabled: !e.IsEnabled,
				style: C(t === h.value ? e.SelectedPipStyle : e.NormalPipStyle),
				type: "button",
				"aria-label": z(a)("text.page-number", { page: t + 1 }),
				"aria-posinset": t + 1,
				"aria-setsize": e.NumberOfPages > 0 ? e.NumberOfPages : void 0,
				onClick: (e) => L(t)
			}, [...r[5] ||= [u("span", {
				class: "pip-glyph",
				"aria-hidden": "true"
			}, "", -1)]], 14, Ec))), 128))], 4)], 4),
			e.NextButtonVisibility === "Collapsed" ? c("", !0) : (D(), l("button", b({
				key: 1,
				class: ["navigation-button next-page-button", { hidden: !E.value }],
				disabled: !e.IsEnabled || !w.value,
				style: e.NextButtonStyle,
				type: "button",
				"aria-label": z(a)("text.next-page")
			}, { "tooltipservice.tooltip": z(a)("text.next-page") }, { onClick: te }), [...r[6] ||= [u("span", { "aria-hidden": "true" }, "", -1)]], 16, Dc))
		], 38));
	}
}), [["__scopeId", "data-v-3265587f"]]), kc = [
	"aria-valuenow",
	"aria-valuemin",
	"aria-valuemax",
	"aria-busy"
], Ac = { class: "LayoutRoot" }, jc = { class: "ProgressBarRoot" }, Mc = { class: "ProgressBarClip" }, Nc = /*@__PURE__*/ Object.assign({ inheritAttrs: !1 }, {
	__name: "ProgressBar",
	props: {
		Value: {
			type: Number,
			default: 0
		},
		Minimum: {
			type: Number,
			default: 0
		},
		Maximum: {
			type: Number,
			default: 100
		},
		IsIndeterminate: {
			type: [Boolean, String],
			default: !1
		},
		ShowError: {
			type: [Boolean, String],
			default: !1
		},
		ShowPaused: {
			type: [Boolean, String],
			default: !1
		},
		Width: {
			type: [Number, String],
			default: ""
		},
		Height: {
			type: [Number, String],
			default: ""
		},
		MinHeight: {
			type: [Number, String],
			default: 3
		},
		Margin: {
			type: [Number, String],
			default: ""
		},
		Padding: {
			type: [Number, String],
			default: ""
		},
		BorderThickness: {
			type: [Number, String],
			default: 0
		},
		BorderBrush: {
			type: [String, Object],
			default: ""
		},
		Background: {
			type: [String, Object],
			default: ""
		},
		Foreground: {
			type: [String, Object],
			default: ""
		},
		CornerRadius: {
			type: [Number, String],
			default: 1.5
		},
		HorizontalAlignment: {
			type: String,
			default: "Stretch"
		},
		VerticalAlignment: {
			type: String,
			default: "Center"
		},
		Visibility: {
			type: String,
			default: "Visible"
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		}
	},
	emits: ["update:Value", "ValueChanged"],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, a = te(), s = A(null), c = A({
			width: 0,
			height: 0
		}), d, f = (e, t) => {
			let n = Number(e);
			return Number.isFinite(n) ? n : t;
		}, p = (e) => e === !0 || e === "True" || e === "true", m = o(() => f(r.Minimum, 0)), h = o(() => f(r.Maximum, 100)), g = o(() => h.value - m.value), _ = o(() => {
			let e = f(r.Value, m.value);
			return g.value <= 0 ? m.value : Math.min(h.value, Math.max(m.value, e));
		}), v = o(() => g.value <= 0 ? 0 : (_.value - m.value) / g.value * 100), y = o(() => r.Visibility === "Collapsed"), S = o(() => p(r.IsIndeterminate) && r.Visibility === "Visible"), T = o(() => S.value ? p(r.ShowError) ? "IndeterminateError" : p(r.ShowPaused) ? "IndeterminatePaused" : "Indeterminate" : p(r.ShowError) ? "Error" : p(r.ShowPaused) ? "Paused" : "Determinate"), E = o(() => ({
			"is-indeterminate": S.value,
			"is-paused": T.value === "Paused" || T.value === "IndeterminatePaused",
			"is-error": T.value === "Error" || T.value === "IndeterminateError",
			"is-disabled": !r.IsEnabled,
			"is-collapsed": y.value,
			[`state-${T.value}`]: !0
		})), O = (e) => {
			if (e === "" || e == null) return;
			if (typeof e == "number") return `${e}px`;
			let t = String(e).trim();
			if (t) return /^-?\d+(?:\.\d+)?$/.test(t) ? `${t}px` : t;
		}, k = (e) => {
			if (e === "" || e == null) return;
			let t = String(e).split(",").map((e) => O(e.trim()));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : O(e);
		}, j = (e) => {
			if (e === "" || e == null) return;
			let t = String(e).split(",").map((e) => O(e.trim()));
			return t.length === 1 ? t[0] : t.length === 4 ? `${t[0]} ${t[1]} ${t[2]} ${t[3]}` : O(e);
		}, M = (e) => {
			if (e) {
				if (typeof e == "string") return e;
				if (typeof e == "object") return e.Color || e.color || e.Value || e.value;
			}
		}, N = (e, t) => {
			let n = String(e || "").toLowerCase();
			return t === "vertical" ? {
				center: "center",
				top: "flex-start",
				bottom: "flex-end",
				stretch: "stretch"
			}[n] || "center" : {
				left: "flex-start",
				center: "center",
				right: "flex-end",
				stretch: "stretch"
			}[n] || "stretch";
		}, P = o(() => {
			let e = { ...a };
			delete e.class, delete e.style, delete e.role, delete e["aria-valuenow"], delete e["aria-valuemin"], delete e["aria-valuemax"], delete e["aria-busy"];
			let t = e["AutomationProperties.Name"];
			return t && !e["aria-label"] && (e["aria-label"] = t), delete e["AutomationProperties.Name"], e;
		}), F = o(() => {
			let e = M(r.Foreground), t = M(r.Background), n = M(r.BorderBrush);
			return [a.style, {
				width: r.Width === "" ? "100%" : O(r.Width),
				height: O(r.Height) || O(r.MinHeight),
				minHeight: O(r.MinHeight),
				margin: k(r.Margin),
				padding: k(r.Padding),
				borderWidth: k(r.BorderThickness),
				borderStyle: k(r.BorderThickness) ? "solid" : void 0,
				borderColor: n || "var(--ProgressBarBorderBrush, var(--ControlStrokeColorDefaultBrush, var(--ctrl-border)))",
				borderRadius: j(r.CornerRadius),
				display: y.value ? "none" : "inline-block",
				visibility: r.Visibility === "Hidden" ? "hidden" : void 0,
				alignSelf: N(r.VerticalAlignment, "vertical"),
				justifySelf: N(r.HorizontalAlignment, "horizontal"),
				"--ProgressBarForeground": e,
				"--ProgressBarBackground": t,
				"--ProgressBarBorderBrush": n,
				"--ProgressBarMinHeight": O(r.MinHeight),
				"--ProgressBarCornerRadius": j(r.CornerRadius)
			}];
		}), I = o(() => ({ width: `${v.value}%` }));
		t({ TemplateSettings: o(() => {
			let e = c.value.width, t = c.value.height, n = e * .4, r = e * .6;
			return {
				ContainerAnimationStartPosition: n * -1,
				ContainerAnimationEndPosition: n * 3,
				Container2AnimationStartPosition: r * -1.5,
				Container2AnimationEndPosition: r * 1.66,
				ContainerAnimationMidPosition: 0,
				IndicatorLengthDelta: 0,
				ClipRect: {
					X: 0,
					Y: 0,
					Width: e,
					Height: t
				},
				EllipseAnimationEndPosition: e / 3,
				EllipseAnimationWellPosition: e * 2 / 3,
				EllipseDiameter: e <= 180 ? 4 : e <= 280 ? 5 : 6,
				EllipseOffset: e <= 180 ? 4 : e <= 280 ? 7 : 9
			};
		}) });
		let L = () => {
			s.value && (c.value = {
				width: s.value.clientWidth,
				height: s.value.clientHeight
			});
		};
		return ee(async () => {
			await x(), L(), typeof ResizeObserver < "u" && (d = new ResizeObserver(L), d.observe(s.value));
		}), w(() => d?.disconnect()), V(() => r.Value, (e, t) => {
			t === void 0 || Object.is(e, t) || i("ValueChanged", {
				OldValue: t,
				NewValue: e
			});
		}), (e, t) => (D(), l("div", b({
			ref_key: "rootRef",
			ref: s
		}, P.value, {
			class: ["win-progress-bar", E.value],
			style: F.value,
			role: "progressbar",
			"aria-valuenow": S.value ? void 0 : _.value,
			"aria-valuemin": S.value ? void 0 : m.value,
			"aria-valuemax": S.value ? void 0 : h.value,
			"aria-busy": S.value ? "true" : void 0
		}), [u("div", Ac, [u("div", jc, [u("div", Mc, [
			t[0] ||= u("div", { class: "ProgressBarTrack" }, null, -1),
			u("div", {
				class: "DeterminateProgressBarIndicator",
				style: C(I.value)
			}, null, 4),
			t[1] ||= u("div", { class: "IndeterminateProgressBarIndicator" }, null, -1),
			t[2] ||= u("div", { class: "IndeterminateProgressBarIndicator2" }, null, -1)
		])])])], 16, kc));
	}
}), Pc = [
	"tabindex",
	"aria-valuenow",
	"aria-valuemin",
	"aria-valuemax",
	"aria-busy",
	"aria-hidden"
], Fc = { class: "LayoutRoot" }, Ic = {
	class: "ProgressRingVisual",
	viewBox: "0 0 100 100",
	role: "presentation",
	"aria-hidden": "true"
}, Lc = /*@__PURE__*/ Object.assign({ inheritAttrs: !1 }, {
	__name: "ProgressRing",
	props: {
		IsActive: {
			type: [Boolean, String],
			default: !0
		},
		IsIndeterminate: {
			type: [Boolean, String],
			default: !0
		},
		DeterminateSource: {
			type: Object,
			default: null
		},
		IndeterminateSource: {
			type: Object,
			default: null
		},
		Value: {
			type: Number,
			default: 0
		},
		Minimum: {
			type: Number,
			default: 0
		},
		Maximum: {
			type: Number,
			default: 100
		},
		Width: {
			type: [Number, String],
			default: 32
		},
		Height: {
			type: [Number, String],
			default: 32
		},
		MinWidth: {
			type: [Number, String],
			default: 16
		},
		MinHeight: {
			type: [Number, String],
			default: 16
		},
		MaxWidth: {
			type: [Number, String],
			default: ""
		},
		MaxHeight: {
			type: [Number, String],
			default: ""
		},
		Margin: {
			type: [Number, String],
			default: ""
		},
		Foreground: {
			type: [String, Object],
			default: ""
		},
		Background: {
			type: [String, Object],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: "Center"
		},
		VerticalAlignment: {
			type: String,
			default: "Center"
		},
		IsHitTestVisible: {
			type: Boolean,
			default: !1
		},
		IsTabStop: {
			type: Boolean,
			default: !1
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		Visibility: {
			type: String,
			default: "Visible"
		}
	},
	emits: ["ValueChanged"],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, a = te(), s = A(null), c = A(null), d = A(null), f = A({
			width: 0,
			height: 0
		}), p, m = 0, h = 0, g = (e) => e === !0 || e === "True" || e === "true", _ = o(() => g(r.IsActive)), v = o(() => g(r.IsIndeterminate)), y = o(() => Number.isFinite(Number(r.Minimum)) ? Number(r.Minimum) : 0), S = o(() => {
			let e = Number.isFinite(Number(r.Maximum)) ? Number(r.Maximum) : 100;
			return Math.max(y.value, e);
		}), T = o(() => {
			let e = Number(r.Value);
			return Number.isFinite(e) ? Math.min(S.value, Math.max(y.value, e)) : y.value;
		}), E = o(() => {
			let e = S.value - y.value;
			return e > 0 ? (T.value - y.value) / e : 0;
		}), O = (e) => {
			if (e === "" || e == null) return;
			if (typeof e == "number") return `${e}px`;
			let t = String(e).trim();
			if (t) return /^-?\d+(?:\.\d+)?$/.test(t) ? `${t}px` : t;
		}, k = (e) => {
			if (e === "" || e == null) return;
			let t = String(e).split(",").map((e) => O(e.trim()));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : O(e);
		}, j = (e) => {
			if (e) {
				if (typeof e == "string") return e;
				if (typeof e == "object") return e.Color || e.color || e.Value || e.value;
			}
		}, M = (e, t) => {
			let n = String(e || "").toLowerCase();
			return t === "vertical" ? {
				center: "center",
				top: "flex-start",
				bottom: "flex-end",
				stretch: "stretch"
			}[n] || "center" : {
				left: "flex-start",
				center: "center",
				right: "flex-end",
				stretch: "stretch"
			}[n] || "center";
		}, N = o(() => {
			let e = { ...a };
			delete e.class, delete e.style, delete e.role, delete e["aria-valuenow"], delete e["aria-valuemin"], delete e["aria-valuemax"], delete e["aria-busy"], delete e["aria-hidden"];
			let t = e["AutomationProperties.Name"];
			return t && !e["aria-label"] && (e["aria-label"] = t), delete e["AutomationProperties.Name"], e;
		}), P = o(() => ({
			"is-active": _.value,
			"is-inactive": !_.value,
			"is-indeterminate": v.value,
			"is-determinate": !v.value,
			"is-disabled": !r.IsEnabled,
			"is-hidden": r.Visibility === "Hidden",
			"is-collapsed": r.Visibility === "Collapsed"
		})), F = o(() => {
			let e = j(r.Foreground), t = j(r.Background);
			return [a.style, {
				width: O(r.Width),
				height: O(r.Height),
				minWidth: O(r.MinWidth),
				minHeight: O(r.MinHeight),
				maxWidth: O(r.MaxWidth),
				maxHeight: O(r.MaxHeight),
				margin: k(r.Margin),
				alignSelf: M(r.VerticalAlignment, "vertical"),
				justifySelf: M(r.HorizontalAlignment, "horizontal"),
				pointerEvents: r.IsHitTestVisible ? void 0 : "none",
				"--ProgressRingForeground": e || "var(--AccentFillColorDefaultBrush, var(--accent-base))",
				"--ProgressRingBackground": t || "transparent"
			}];
		}), I = o(() => ({ strokeDashoffset: `${100 - E.value * 100}` }));
		t({ TemplateSettings: o(() => {
			let e = f.value.width, t = e > 0 ? e * .1 + +(e <= 40) : 0;
			return {
				EllipseDiameter: t,
				EllipseOffset: {
					Left: 0,
					Top: e * .5 - t,
					Right: 0,
					Bottom: 0
				},
				MaxSideLength: e
			};
		}) });
		let L = () => {
			s.value && (f.value = {
				width: s.value.getBoundingClientRect().width,
				height: s.value.getBoundingClientRect().height
			});
		}, R = (e) => e, z = (e, t, n, r) => {
			if (!e) return;
			let i = Math.max(1e-4, (n - t) * 100), a = Math.max(1e-4, 100 - i);
			e.style.strokeDasharray = `${i} ${a}`, e.style.strokeDashoffset = `${-t * 100}`, e.style.opacity = String(r);
		}, ne = (e) => {
			h ||= e;
			let t = (e - h) % 2e3 / 2e3, n = t < .5, r = R(n ? t * 2 : (t - .5) * 2), i = `rotate(${(n ? r * .5 : .5 + r * .5) * 900 - 90} 50 50)`;
			c.value?.setAttribute("transform", i), d.value?.setAttribute("transform", i), n ? (z(c.value, 0, .5, 0), z(d.value, 0, 1e-4 + r * .5, 1)) : (z(c.value, r * .5, .5, 1), z(d.value, 0, .5, 0)), m = window.requestAnimationFrame(ne);
		}, B = () => {
			m && window.cancelAnimationFrame(m), m = 0, h = 0;
		}, H = () => {
			B(), _.value && v.value && typeof window < "u" && (m = window.requestAnimationFrame(ne));
		};
		return V(() => r.Value, (e, t) => {
			t !== void 0 && !Object.is(e, t) && i("ValueChanged", {
				OldValue: t,
				NewValue: e
			});
		}), V([_, v], H), ee(async () => {
			await x(), L(), H(), typeof ResizeObserver < "u" && s.value && (p = new ResizeObserver(L), p.observe(s.value));
		}), w(() => {
			p?.disconnect(), B();
		}), (t, n) => (D(), l("div", b({
			ref_key: "rootRef",
			ref: s
		}, N.value, {
			class: ["win-progress-ring", P.value],
			style: F.value,
			tabindex: e.IsTabStop ? 0 : -1,
			role: "progressbar",
			"aria-valuenow": v.value || !_.value ? void 0 : T.value,
			"aria-valuemin": v.value || !_.value ? void 0 : y.value,
			"aria-valuemax": v.value || !_.value ? void 0 : S.value,
			"aria-busy": v.value && _.value ? "true" : void 0,
			"aria-hidden": _.value ? void 0 : "true"
		}), [u("div", Fc, [(D(), l("svg", Ic, [
			n[0] ||= u("circle", {
				class: "ProgressRingTrack",
				cx: "50",
				cy: "50",
				r: "42"
			}, null, -1),
			u("circle", {
				class: "ProgressRingDeterminateIndicator",
				cx: "50",
				cy: "50",
				r: "42",
				pathLength: "100",
				style: C(I.value)
			}, null, 4),
			u("circle", {
				ref_key: "indeterminateRef",
				ref: c,
				class: "ProgressRingIndeterminateIndicator ProgressRingIndeterminateIndicatorA",
				cx: "50",
				cy: "50",
				r: "42",
				pathLength: "100"
			}, null, 512),
			u("circle", {
				ref_key: "indeterminateBRef",
				ref: d,
				class: "ProgressRingIndeterminateIndicator ProgressRingIndeterminateIndicatorB",
				cx: "50",
				cy: "50",
				r: "42",
				pathLength: "100"
			}, null, 512)
		]))])], 16, Pc));
	}
}), Rc = ["aria-live"], zc = {
	key: 0,
	class: "win-infobar-standard-icon-area",
	"aria-hidden": "true"
}, Bc = {
	key: 1,
	class: "win-infobar-user-icon-box",
	"aria-hidden": "true"
}, Vc = { class: "win-infobar-content-area" }, Hc = /*#__PURE__*/ dt(/* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
	__name: "InfoBar",
	props: {
		IsOpen: {
			type: Boolean,
			default: !1
		},
		Title: {
			type: String,
			default: ""
		},
		Message: {
			type: String,
			default: ""
		},
		Severity: {
			type: String,
			default: "Informational",
			validator: (e) => [
				"Informational",
				"Success",
				"Warning",
				"Error"
			].includes(e)
		},
		IconSource: {
			type: Object,
			default: null
		},
		IsIconVisible: {
			type: Boolean,
			default: !0
		},
		IsClosable: {
			type: Boolean,
			default: !0
		},
		CloseButtonStyle: {
			type: String,
			default: "{StaticResource InfoBarCloseButtonStyle}"
		},
		CloseButtonCommand: {
			type: [Function, Object],
			default: null
		},
		CloseButtonCommandParameter: {
			type: null,
			default: null
		},
		ActionButton: {
			type: [Object, Function],
			default: null
		},
		Content: {
			type: null,
			default: null
		},
		ContentTemplate: {
			type: [Object, Function],
			default: null
		},
		Background: {
			type: String,
			default: ""
		},
		Foreground: {
			type: String,
			default: ""
		},
		BorderBrush: {
			type: String,
			default: ""
		},
		BorderThickness: {
			type: [String, Number],
			default: ""
		},
		CornerRadius: {
			type: [String, Number],
			default: ""
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		Margin: {
			type: [String, Number],
			default: ""
		}
	},
	emits: [
		"update:IsOpen",
		"CloseButtonClick",
		"Closing",
		"Closed",
		"Opened"
	],
	setup(e, { emit: t }) {
		let { t: n } = rt(), r = te(), i = e, a = t, d = A(null), f = A(null), p = A(null), h = A(null), g = A(null), _ = A(null), v = A(i.IsOpen), y = A(!1), C = A(!!i.ActionButton), T = o(() => i.IsIconVisible && !i.IconSource), O = o(() => i.IsIconVisible && !!i.IconSource), k = o(() => i.CloseButtonStyle === "{StaticResource InfoBarCloseButtonStyle}"), j = {
			Informational: "",
			Success: "",
			Warning: "",
			Error: ""
		}, N = {
			Accept: "",
			Cancel: "",
			Important: "",
			Sync: "",
			Warning: "",
			Info: ""
		}, F = (e) => {
			let t = String(e ?? "");
			return t.startsWith("\\u") ? String.fromCodePoint(Number.parseInt(t.slice(2), 16)) : t.startsWith("&#x") && t.endsWith(";") ? String.fromCodePoint(Number.parseInt(t.slice(3, -1), 16)) : t.startsWith("0x") || /^[0-9A-Fa-f]{4,5}$/.test(t) ? String.fromCodePoint(Number.parseInt(t, 16)) : t;
		}, I = o(() => j[i.Severity] ?? j.Informational), L = o(() => "var(--InfoBarSeverityIconBackground)"), R = o(() => i.IconSource?.Glyph === void 0 ? i.IconSource?.Symbol === void 0 ? "" : N[i.IconSource.Symbol] ?? String(i.IconSource.Symbol) : F(i.IconSource.Glyph)), ne = o(() => i.IconSource?.FontFamily || "WinUIOnWebIcons"), B = o(() => i.IconSource?.Foreground || ""), U = o(() => i.Foreground || "var(--InfoBarTitleForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)))"), W = o(() => `win-infobar-${i.Severity.toLowerCase()}`), G = o(() => ({
			"banner-content": i.Title || i.Message || C.value,
			"no-banner-content": !i.Title && !i.Message && !C.value
		})), re = o(() => ({
			"is-vertical": y.value,
			"has-title": !!i.Title,
			"has-message": !!i.Message,
			"has-action": C.value
		})), K = o(() => {
			let { class: e, style: t, ...n } = r;
			return n;
		}), q = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, J = (e) => {
			if (e === "" || e == null) return "";
			let t = String(e).split(",").map((e) => {
				let t = e.trim();
				return q(Number.isNaN(Number(t)) ? t : Number(t));
			});
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : String(e);
		}, ie = (e) => {
			let t = String(e).split(",").map((e) => q(e.trim()));
			return t.length === 4 ? t.join(" ") : q(e);
		}, Y = o(() => {
			let e = {};
			return i.Background && (e["--InfoBarBackground"] = i.Background), i.Foreground && (e["--InfoBarForeground"] = i.Foreground), i.BorderBrush && (e["--InfoBarBorderBrush"] = i.BorderBrush), i.BorderThickness !== "" && (e["--InfoBarBorderThickness"] = J(i.BorderThickness)), i.CornerRadius !== "" && (e["--InfoBarCornerRadius"] = ie(i.CornerRadius)), i.Width !== "" && (e.width = q(i.Width)), i.MinWidth !== "" && (e.minWidth = q(i.MinWidth)), i.MaxWidth !== "" && (e.maxWidth = q(i.MaxWidth)), i.Margin !== "" && (e.margin = J(i.Margin)), [r.style, e];
		}), X = (e) => e?.$el ?? e ?? null, Z = () => p.value?.querySelector(":scope > .win-infobar-title") ?? null, ae = () => p.value?.querySelector(":scope > .win-infobar-message") ?? null, Q = (e) => {
			let t = X(e);
			if (!t) return {
				Width: 0,
				Height: 0
			};
			let n = t.getBoundingClientRect();
			return {
				Width: n.width,
				Height: n.height
			};
		}, oe = () => h.value ? Array.from(h.value.childNodes).filter((e) => e.nodeType === Node.TEXT_NODE ? e.textContent.trim().length > 0 : e.nodeType === Node.ELEMENT_NODE ? !e.hidden && window.getComputedStyle(e).display !== "none" : !1) : [], se = (e) => {
			e.nodeType === Node.ELEMENT_NODE && (e.removeAttribute("id"), e.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id")));
		}, ce = (e) => {
			if (!_.value) return;
			let t = e.map((e) => {
				let t = e.cloneNode(!0);
				return se(t), t;
			});
			_.value.replaceChildren(...t);
		}, le = null, ue = null, de = 0, fe = () => {
			let e = oe(), t = !!i.ActionButton || e.length > 0;
			C.value !== t && (C.value = t), ce(e);
		}, $ = (e, t) => {
			let n = X(e);
			if (!n) return {
				Width: 0,
				Height: 0
			};
			let r = n.cloneNode(!0);
			Object.assign(r.style, {
				position: "fixed",
				left: "-10000px",
				top: "0",
				width: "max-content",
				minWidth: "0",
				maxWidth: "none",
				margin: "0",
				whiteSpace: "pre",
				visibility: "hidden",
				pointerEvents: "none"
			}), r.textContent = String(t ?? ""), document.body.appendChild(r);
			let i = Q(r);
			return r.remove(), i;
		}, pe = () => {
			if (de = 0, !v.value || !p.value) return;
			fe();
			let e = g.value;
			e && (e.style.display = "block");
			try {
				let e = p.value.getBoundingClientRect().width;
				if (e <= 0) return;
				let t = [];
				i.Title && t.push({
					...$(Z(), i.Title),
					HorizontalMarginLeft: 0,
					HorizontalMarginTop: 14
				}), i.Message && t.push({
					...$(ae(), i.Message),
					HorizontalMarginLeft: 12,
					HorizontalMarginTop: 14
				}), C.value && t.push({
					...Q(_.value),
					HorizontalMarginLeft: 16,
					HorizontalMarginTop: 8
				});
				let n = t.filter((e) => e.Width > 0 && e.Height > 0), r = n.reduce((e, t, n) => e + t.Width + (n > 0 ? t.HorizontalMarginLeft : 0), 0), a = n.reduce((e, t) => Math.max(e, t.Height + t.HorizontalMarginTop), 0);
				y.value = n.length === 1 || r > e || a > 48;
			} finally {
				e && (e.style.display = "none");
			}
		}, me = () => {
			de && cancelAnimationFrame(de), de = requestAnimationFrame(pe);
		}, he = () => {
			le?.disconnect(), le = new ResizeObserver(me), d.value && le.observe(d.value), f.value && le.observe(f.value), p.value && le.observe(p.value), h.value && le.observe(h.value), ue?.disconnect(), ue = new MutationObserver(() => x(me)), h.value && ue.observe(h.value, {
				attributes: !0,
				attributeFilter: [
					"class",
					"hidden",
					"style"
				],
				childList: !0,
				subtree: !0
			}), me();
		}, ge = () => {
			v.value || (v.value = !0, a("Opened", {}), x(he));
		}, _e = (e, t) => {
			if (!v.value) return;
			let n = {
				Reason: e,
				Cancel: !1
			};
			if (a("Closing", n), n.Cancel) {
				i.IsOpen || a("update:IsOpen", !0);
				return;
			}
			t && a("update:IsOpen", !1), v.value = !1, le?.disconnect(), ue?.disconnect(), a("Closed", { Reason: e });
		}, ve = () => {
			a("CloseButtonClick", null), typeof i.CloseButtonCommand == "function" ? i.CloseButtonCommand(i.CloseButtonCommandParameter) : i.CloseButtonCommand?.Execute?.(i.CloseButtonCommandParameter), _e("CloseButton", !0);
		};
		return V(() => i.IsOpen, (e) => {
			e ? ge() : _e("Programmatic", !1);
		}), V(() => [
			i.Title,
			i.Message,
			i.IsClosable,
			i.IsIconVisible,
			i.IconSource,
			i.ActionButton
		], () => x(me), { deep: !0 }), ee(() => {
			v.value && he(), document.fonts?.ready.then(me);
		}), E(() => {
			fe(), me();
		}), w(() => {
			le?.disconnect(), ue?.disconnect(), de && cancelAnimationFrame(de);
		}), (t, i) => v.value ? (D(), l("section", b({
			key: 0,
			ref_key: "rootRef",
			ref: d
		}, K.value, {
			class: ["win-infobar", [
				W.value,
				G.value,
				z(r).class
			]],
			style: Y.value,
			role: "alert",
			"aria-live": e.Severity === "Error" ? "assertive" : "polite"
		}), [u("div", {
			ref_key: "layoutRef",
			ref: f,
			class: "win-infobar-layout"
		}, [
			T.value ? (D(), l("div", zc, [m(Rt, {
				class: "win-infobar-standard-icon",
				Text: I.value,
				Foreground: L.value,
				FontFamily: "WinUIOnWebIcons",
				FontSize: "16",
				LineHeight: "16"
			}, null, 8, ["Text", "Foreground"])])) : O.value ? (D(), l("div", Bc, [m(Rt, {
				class: "win-infobar-user-icon",
				Text: R.value,
				FontFamily: ne.value,
				Foreground: B.value,
				FontSize: "16",
				LineHeight: "16"
			}, null, 8, [
				"Text",
				"FontFamily",
				"Foreground"
			])])) : c("", !0),
			u("div", {
				ref_key: "panelRef",
				ref: p,
				class: S(["win-infobar-panel", re.value])
			}, [
				e.Title ? (D(), s(Rt, {
					key: 0,
					class: "win-infobar-title",
					Text: e.Title,
					Foreground: U.value,
					TextWrapping: "WrapWholeWords",
					FontSize: "14",
					FontWeight: "600",
					LineHeight: "20"
				}, null, 8, ["Text", "Foreground"])) : c("", !0),
				e.Message ? (D(), s(Rt, {
					key: 1,
					class: "win-infobar-message",
					Text: e.Message,
					Foreground: U.value,
					TextWrapping: "WrapWholeWords",
					FontSize: "14",
					FontWeight: "400",
					LineHeight: "20"
				}, null, 8, ["Text", "Foreground"])) : c("", !0),
				u("div", {
					ref_key: "actionRef",
					ref: h,
					class: "win-infobar-action"
				}, [M(t.$slots, "ActionButton", {}, () => [e.ActionButton ? (D(), s(P(e.ActionButton), { key: 0 })) : c("", !0)], !0)], 512),
				u("div", {
					ref_key: "measureLayerRef",
					ref: g,
					class: "win-infobar-measure-layer",
					"aria-hidden": "true"
				}, [u("div", {
					ref_key: "actionMeasureRef",
					ref: _,
					class: "win-infobar-action-measure"
				}, null, 512)], 512)
			], 2),
			u("div", Vc, [M(t.$slots, "default", {}, () => [e.ContentTemplate ? (D(), s(P(e.ContentTemplate), {
				key: 0,
				Content: e.Content
			}, null, 8, ["Content"])) : e.Content !== null && e.Content !== void 0 ? (D(), s(Rt, {
				key: 1,
				Text: e.Content,
				TextWrapping: "WrapWholeWords"
			}, null, 8, ["Text"])) : c("", !0)], !0)]),
			e.IsClosable ? (D(), s(Kn, b({
				key: 2,
				class: ["win-infobar-close-button", { "uses-default-close-button-style": k.value }],
				Style: e.CloseButtonStyle,
				"aria-label": z(n)("control.infobar.close-button-name")
			}, { "tooltipservice.tooltip": z(n)("control.infobar.close-button-tooltip") }, { onClick: ve }), {
				default: H(() => [m(Rt, {
					class: "win-infobar-close-glyph",
					Text: "",
					FontFamily: "WinUIOnWebIcons",
					FontSize: "12",
					LineHeight: "16"
				})]),
				_: 1
			}, 16, [
				"class",
				"Style",
				"aria-label"
			])) : c("", !0)
		], 512)], 16, Rc)) : c("", !0);
	}
}), [["__scopeId", "data-v-bb434725"]]), Uc = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "ScrollView",
	props: {
		HorizontalScrollBarVisibility: { default: "Auto" },
		VerticalScrollBarVisibility: { default: "Auto" },
		ContentOrientation: { default: "Vertical" },
		HorizontalScrollChainMode: { default: "Auto" },
		VerticalScrollChainMode: { default: "Auto" },
		HorizontalScrollRailMode: { default: "Enabled" },
		VerticalScrollRailMode: { default: "Enabled" },
		HorizontalScrollMode: { default: "Auto" },
		VerticalScrollMode: { default: "Auto" },
		ZoomChainMode: { default: "Auto" },
		ZoomMode: { default: "Disabled" },
		IgnoredInputKinds: { default: "None" },
		MinZoomFactor: { default: .1 },
		MaxZoomFactor: { default: 10 },
		ZoomFactor: { default: 1 },
		HorizontalAnchorRatio: { default: 0 },
		VerticalAnchorRatio: { default: 0 },
		IsTabStop: {
			type: Boolean,
			default: !1
		},
		Width: {},
		Height: {},
		HorizontalAlignment: { default: "Stretch" },
		VerticalAlignment: { default: "Stretch" }
	},
	emits: [
		"ExtentChanged",
		"StateChanged",
		"ViewChanged",
		"ScrollCompleted",
		"ZoomCompleted",
		"ScrollAnimationStarting",
		"ZoomAnimationStarting",
		"ScrollStarting",
		"ZoomStarting"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, a = A(), c = A({
			IsIntermediate: !1,
			HorizontalOffset: 0,
			VerticalOffset: 0,
			ZoomFactor: r.ZoomFactor
		}), l = A(c.value), u = A("Idle"), d = (e) => {
			u.value === "Idle" && (l.value = c.value, u.value = "Interaction");
			let t = e.NextView, n = {
				IsIntermediate: !0,
				HorizontalOffset: t.HorizontalOffset,
				VerticalOffset: t.VerticalOffset,
				ZoomFactor: t.ZoomFactor
			};
			c.value = n, i("StateChanged", n);
		}, f = (e) => {
			let t = {
				IsIntermediate: e.IsIntermediate,
				HorizontalOffset: Number(a.value?.HorizontalOffset ?? 0),
				VerticalOffset: Number(a.value?.VerticalOffset ?? 0),
				ZoomFactor: Number(a.value?.ZoomFactor ?? r.ZoomFactor)
			}, n = u.value === "Idle" ? c.value : l.value;
			c.value = t, i("ViewChanged", t), !t.IsIntermediate && (t.ZoomFactor !== n.ZoomFactor && i("ZoomCompleted", t), (t.HorizontalOffset !== n.HorizontalOffset || t.VerticalOffset !== n.VerticalOffset) && i("ScrollCompleted", t), u.value = "Idle");
		}, p = (e, t, n) => a.value?.ScrollTo(e, t) ?? -1, m = (e, t, n) => a.value?.ScrollBy(e, t) ?? -1, h = (e, t) => a.value?.AddScrollVelocity(e, t) ?? -1, g = () => a.value?.CancelScrollVelocity(), _ = (e, t, n) => a.value?.ZoomTo(e) ?? -1;
		return t({
			ScrollTo: p,
			ScrollBy: m,
			AddScrollVelocity: h,
			CancelScrollVelocity: g,
			ZoomTo: _,
			ZoomBy: (e, t, n) => _(c.value.ZoomFactor + e, t, n),
			AddZoomVelocity: (e) => _(c.value.ZoomFactor + e / 10),
			RegisterAnchorCandidate: (e) => {},
			UnregisterAnchorCandidate: (e) => {},
			ScrollPresenter: a,
			CurrentAnchor: A(null),
			State: o(() => u.value),
			HorizontalOffset: o(() => c.value.HorizontalOffset),
			VerticalOffset: o(() => c.value.VerticalOffset),
			ZoomFactor: o(() => c.value.ZoomFactor),
			ExtentWidth: o(() => a.value?.scrollWidth ?? 0),
			ExtentHeight: o(() => a.value?.scrollHeight ?? 0),
			ViewportWidth: o(() => a.value?.clientWidth ?? 0),
			ViewportHeight: o(() => a.value?.clientHeight ?? 0),
			ScrollableWidth: o(() => Math.max(0, (a.value?.scrollWidth ?? 0) - (a.value?.clientWidth ?? 0))),
			ScrollableHeight: o(() => Math.max(0, (a.value?.scrollHeight ?? 0) - (a.value?.clientHeight ?? 0))),
			ComputedHorizontalScrollBarVisibility: o(() => {
				let e = a.value?.scrollWidth ?? 0, t = a.value?.clientWidth ?? 0;
				return r.HorizontalScrollBarVisibility === "Visible" ? "Visible" : r.HorizontalScrollBarVisibility === "Hidden" ? "Collapsed" : e > t ? "Visible" : "Collapsed";
			}),
			ComputedVerticalScrollBarVisibility: o(() => {
				let e = a.value?.scrollHeight ?? 0, t = a.value?.clientHeight ?? 0;
				return r.VerticalScrollBarVisibility === "Visible" ? "Visible" : r.VerticalScrollBarVisibility === "Hidden" ? "Collapsed" : e > t ? "Visible" : "Collapsed";
			}),
			ComputedHorizontalScrollMode: o(() => r.HorizontalScrollMode === "Disabled" ? "Disabled" : r.HorizontalScrollMode === "Enabled" || r.ZoomMode === "Enabled" || (a.value?.scrollWidth ?? 0) > (a.value?.clientWidth ?? 0) ? "Enabled" : "Disabled"),
			ComputedVerticalScrollMode: o(() => r.VerticalScrollMode === "Disabled" ? "Disabled" : r.VerticalScrollMode === "Enabled" || r.ZoomMode === "Enabled" || (a.value?.scrollHeight ?? 0) > (a.value?.clientHeight ?? 0) ? "Enabled" : "Disabled")
		}), (t, n) => (D(), s(Ft, {
			ref_key: "scrollPresenterRef",
			ref: a,
			class: S(["win-scroll-view", `content-orientation-${e.ContentOrientation.toLowerCase()}`]),
			Width: e.Width,
			Height: e.Height,
			HorizontalAlignment: e.HorizontalAlignment,
			VerticalAlignment: e.VerticalAlignment,
			IsTabStop: e.IsTabStop,
			ZoomMode: e.ZoomMode,
			MinZoomFactor: e.MinZoomFactor,
			MaxZoomFactor: e.MaxZoomFactor,
			ZoomFactor: e.ZoomFactor,
			HorizontalScrollMode: e.HorizontalScrollMode,
			VerticalScrollMode: e.VerticalScrollMode,
			HorizontalScrollBarVisibility: e.HorizontalScrollBarVisibility,
			VerticalScrollBarVisibility: e.VerticalScrollBarVisibility,
			IsHorizontalScrollChainingEnabled: e.HorizontalScrollChainMode !== "Never",
			IsVerticalScrollChainingEnabled: e.VerticalScrollChainMode !== "Never",
			onViewChanging: d,
			onViewChanged: f
		}, {
			default: H(() => [M(t.$slots, "default", {}, void 0, !0)]),
			_: 3
		}, 8, [
			"class",
			"Width",
			"Height",
			"HorizontalAlignment",
			"VerticalAlignment",
			"IsTabStop",
			"ZoomMode",
			"MinZoomFactor",
			"MaxZoomFactor",
			"ZoomFactor",
			"HorizontalScrollMode",
			"VerticalScrollMode",
			"HorizontalScrollBarVisibility",
			"VerticalScrollBarVisibility",
			"IsHorizontalScrollChainingEnabled",
			"IsVerticalScrollChainingEnabled"
		]));
	}
}), [["__scopeId", "data-v-dd1816d6"]]), Wc = /*#__PURE__*/ dt({
	__name: "ScrollBar",
	props: {
		orientation: {
			type: String,
			default: "Vertical",
			validator: (e) => ["Vertical", "Horizontal"].includes(e)
		},
		indicatorMode: {
			type: String,
			default: "MouseIndicator",
			validator: (e) => [
				"None",
				"TouchIndicator",
				"MouseIndicator"
			].includes(e)
		},
		viewportSize: {
			type: Number,
			default: 0
		},
		value: {
			type: Number,
			default: 0
		},
		minimum: {
			type: Number,
			default: 0
		},
		maximum: {
			type: Number,
			default: 100
		},
		smallChange: {
			type: Number,
			default: 1
		},
		largeChange: {
			type: Number,
			default: 10
		},
		visualMode: {
			type: String,
			default: "Normal",
			validator: (e) => ["Thin", "Normal"].includes(e)
		}
	},
	emits: ["update:value", "scroll"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = A(null), a = A(null), s = A(!1), c = A(!1), d = A(0), f = A(0), p = o(() => n.orientation === "Vertical"), m = o(() => p.value ? "vertical" : "horizontal"), h = o(() => `mode-${n.indicatorMode.toLowerCase()}`), g = o(() => {
			let e = n.maximum - n.minimum;
			if (e === 0) return 100;
			let t = n.viewportSize / (e + n.viewportSize) * 100;
			return Math.max(10, Math.min(100, t));
		}), _ = o(() => {
			let e = n.maximum - n.minimum;
			if (e === 0) return 0;
			let t = 100 - g.value;
			return n.value / e * t;
		}), v = o(() => p.value ? {
			height: g.value + "%",
			top: _.value + "%"
		} : {
			width: g.value + "%",
			left: _.value + "%"
		}), y = () => {
			s.value = !0;
		}, b = () => {
			s.value = !1;
		}, x = (e) => {
			if (!i.value) return;
			let t = i.value.getBoundingClientRect(), a;
			a = p.value ? (e.clientY - t.top) / t.height : (e.clientX - t.left) / t.width;
			let o = 1 - g.value / 100, s = Math.max(0, Math.min(o, a - g.value / 200)), c = n.maximum - n.minimum, l = s / o * c, u = Math.max(n.minimum, Math.min(n.maximum, l));
			r("update:value", u), r("scroll", u);
		}, w = (e) => {
			c.value = !0, d.value = n.value, p.value ? f.value = e.clientY : f.value = e.clientX;
			let t = i.value;
			t.setPointerCapture(e.pointerId), t.onpointermove = (e) => {
				if (!c.value || !i.value) return;
				let t = i.value.getBoundingClientRect(), a;
				a = p.value ? (e.clientY - f.value) / t.height : (e.clientX - f.value) / t.width;
				let o = 1 - g.value / 100, s = n.maximum - n.minimum, l = a / o * s, u = d.value + l, m = Math.max(n.minimum, Math.min(n.maximum, u));
				r("update:value", m), r("scroll", m);
			}, t.onpointerup = () => {
				c.value = !1, t.onpointermove = null, t.onpointerup = null, t.releasePointerCapture(e.pointerId);
			};
		};
		return (e, t) => (D(), l("div", {
			class: S(["win-scrollbar", [
				m.value,
				h.value,
				{ "auto-hide": !s.value && !c.value }
			]]),
			onMouseenter: y,
			onMouseleave: b,
			ref_key: "scrollbar",
			ref: i
		}, [u("div", {
			class: "win-scrollbar-track",
			onPointerdown: x
		}, [u("div", {
			class: "win-scrollbar-thumb",
			style: C(v.value),
			onPointerdown: G(w, ["stop"]),
			ref_key: "thumb",
			ref: a
		}, null, 36)], 32)], 34));
	}
}, [["__scopeId", "data-v-f845910f"]]), Gc = ["onClick"], Kc = /*#__PURE__*/ dt({
	__name: "AnnotatedScrollBar",
	props: {
		Labels: {
			type: Array,
			default: () => []
		},
		ScrollController: {
			type: Object,
			default: null
		},
		MaxHeight: {
			type: Number,
			default: NaN
		},
		HorizontalAlignment: {
			type: String,
			default: "Stretch",
			validator: (e) => [
				"Left",
				"Center",
				"Right",
				"Stretch"
			].includes(e)
		},
		disabled: {
			type: Boolean,
			default: !1
		}
	},
	emits: ["DetailLabelRequested", "scrollOffsetChanged"],
	setup(e, { expose: n, emit: r }) {
		let a = e, s = r, d = A(null), f = A(null), p = A(null), h = A(null), g = A(!1), _ = A(!1), v = A(!1), y = A(""), b = A(0), x = A({
			isDragging: !1,
			startY: 0,
			startScrollOffset: 0
		}), ee = o(() => ({
			"is-disabled": a.disabled,
			"is-pointer-over": g.value && !a.disabled,
			"is-pressed": _.value && !a.disabled
		})), T = o(() => {
			let e = {};
			switch (isNaN(a.MaxHeight) || (e.maxHeight = `${a.MaxHeight}px`), a.HorizontalAlignment) {
				case "Left":
					e.alignSelf = "flex-start";
					break;
				case "Center":
					e.alignSelf = "center";
					break;
				case "Right":
					e.alignSelf = "flex-end";
					break;
				default:
					e.alignSelf = "stretch";
					break;
			}
			return e;
		}), E = o(() => {
			if (!a.ScrollController) return 0;
			let { scrollOffset: e = 0, maxScrollOffset: t = 1 } = a.ScrollController;
			return t === 0 ? 0 : Math.max(0, Math.min(1, e / t));
		}), O = o(() => {
			if (!a.ScrollController || !f.value) return {
				height: "0px",
				transform: "translateY(0px)"
			};
			let { viewport: e = 100, maxScrollOffset: t = 0 } = a.ScrollController, n = e + t, r = f.value.clientHeight, i = Math.max(40, e / n * r), o = r - i, s = E.value * o;
			return {
				height: `${i}px`,
				transform: `translateY(${s}px)`
			};
		}), k = o(() => {
			if (!a.Labels || a.Labels.length === 0) return [];
			let e = f.value?.clientHeight || 0;
			return e === 0 ? a.Labels : !isNaN(a.MaxHeight) && e < a.MaxHeight ? M(a.Labels, e) : a.Labels;
		}), M = (e, t) => {
			let n = [...e].sort((e, t) => e.offset - t.offset), r = [], i = -20;
			for (let e of n) {
				let n = e.offset / 100 * t;
				n - i >= 24 && (r.push(e), i = n);
			}
			return r;
		}, N = (e) => {
			let t = f.value?.clientHeight || 0;
			return { top: `${e.offset / 100 * t}px` };
		}, P = o(() => {
			let e = f.value?.clientHeight || 0, t = b.value / 100 * e;
			return { top: `${Math.max(10, Math.min(e - 30, t))}px` };
		}), F = () => {
			a.disabled || (g.value = !0);
		}, I = () => {
			g.value = !1, v.value = !1;
		}, R = (e) => {
			if (a.disabled || !f.value) return;
			let t = f.value.getBoundingClientRect(), n = t.height, r = e.clientY - t.top, i = Math.max(0, Math.min(1, r / n)), o = {
				ScrollOffset: i * (a.ScrollController?.maxScrollOffset || 0),
				Content: null
			};
			s("DetailLabelRequested", o), o.Content ? (y.value = o.Content, b.value = i * 100, v.value = !0) : v.value = !1;
		}, z = (e) => {
			if (a.disabled || !f.value || !a.ScrollController) return;
			let t = f.value.getBoundingClientRect(), n = t.height, r = e.clientY - t.top;
			s("scrollOffsetChanged", Math.max(0, Math.min(1, r / n)) * (a.ScrollController.maxScrollOffset || 0));
		}, te = (e) => {
			if (a.disabled || !a.ScrollController) return;
			let t = a.ScrollController.maxScrollOffset || 0;
			s("scrollOffsetChanged", e.offset / 100 * t);
		}, ne = (e) => {
			a.disabled || !a.ScrollController || (e.preventDefault(), _.value = !0, x.value = {
				isDragging: !0,
				startY: e.clientY,
				startScrollOffset: a.ScrollController.scrollOffset || 0
			}, document.addEventListener("mousemove", B), document.addEventListener("mouseup", V));
		}, B = (e) => {
			if (!x.value.isDragging || !f.value || !a.ScrollController) return;
			let t = e.clientY - x.value.startY, n = f.value.clientHeight - (h.value?.clientHeight || 0), r = a.ScrollController.maxScrollOffset || 0, i = t / n * r;
			s("scrollOffsetChanged", Math.max(0, Math.min(r, x.value.startScrollOffset + i)));
		}, V = () => {
			_.value = !1, x.value.isDragging = !1, document.removeEventListener("mousemove", B), document.removeEventListener("mouseup", V);
		};
		return w(() => {
			document.removeEventListener("mousemove", B), document.removeEventListener("mouseup", V);
		}), n({
			scrollTo: (e) => {
				s("scrollOffsetChanged", e);
			},
			getScrollOffset: () => a.ScrollController?.scrollOffset || 0,
			getMaxScrollOffset: () => a.ScrollController?.maxScrollOffset || 0
		}), (e, n) => (D(), l("div", {
			class: S(["win-annotated-scrollbar", ee.value]),
			style: C(T.value),
			ref_key: "containerRef",
			ref: d,
			onMouseenter: F,
			onMouseleave: I
		}, [u("div", {
			class: "scrollbar-rail",
			ref_key: "railRef",
			ref: f,
			onClick: z,
			onMousemove: R
		}, [u("div", {
			class: "scrollbar-labels",
			ref_key: "labelsRef",
			ref: p
		}, [(D(!0), l(t, null, j(k.value, (e, t) => (D(), l("div", {
			key: t,
			class: "scrollbar-label",
			style: C(N(e)),
			onClick: G((t) => te(e), ["stop"])
		}, L(e.text), 13, Gc))), 128))], 512), u("div", {
			class: "scrollbar-thumb",
			style: C(O.value),
			ref_key: "thumbRef",
			ref: h,
			onMousedown: ne
		}, null, 36)], 544), m(i, { name: "detail-fade" }, {
			default: H(() => [v.value && y.value ? (D(), l("div", {
				key: 0,
				class: "detail-label",
				style: C(P.value)
			}, L(y.value), 5)) : c("", !0)]),
			_: 1
		})], 38));
	}
}, [["__scopeId", "data-v-72770195"]]), qc = { class: "win-horizontal-scroll-container" }, Jc = { class: "win-horizontal-scroll-content" }, Yc = ["aria-label"], Xc = ["aria-label"], Zc = 2, Qc = /*#__PURE__*/ dt({
	__name: "HorizontalScrollContainer",
	setup(e) {
		let { t } = rt(), n = A(null), r = A(null), i = A(null), a = A(!1), o = A(!1), s = null, c = 0, d = 0, f = () => {
			let e = n.value;
			return e ? Math.max(0, e.scrollWidth - e.clientWidth) : 0;
		}, p = () => {
			let e = n.value;
			if (!e) {
				a.value = !1, o.value = !1;
				return;
			}
			let t = f(), r = c ? d : e.scrollLeft;
			a.value = r > Zc, o.value = t > Zc && r < t - Zc;
		}, m = (e) => {
			let t = n.value;
			t && g(t.scrollLeft + e);
		}, h = () => {
			c &&= (cancelAnimationFrame(c), 0);
		}, g = (e) => {
			d = Math.max(0, Math.min(f(), e)), p(), c || S();
		}, _ = () => {
			let e = n.value;
			e && (m(-e.clientWidth), x(() => i.value?.focus()));
		}, v = () => {
			let e = n.value;
			e && (m(e.clientWidth), x(() => r.value?.focus()));
		}, y = (e) => {
			let t = n.value;
			if (!t || f() <= 0) return;
			let r = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
			r !== 0 && (e.preventDefault(), e.deltaMode === WheelEvent.DOM_DELTA_LINE ? r *= 16 : e.deltaMode === WheelEvent.DOM_DELTA_PAGE && (r *= t.clientWidth), g((c ? d : t.scrollLeft) + r));
		}, S = () => {
			let e = n.value;
			if (!e) {
				c = 0;
				return;
			}
			let t = d - e.scrollLeft;
			if (Math.abs(t) < .5) {
				e.scrollLeft = d, c = 0, p();
				return;
			}
			e.scrollLeft += t * .22, p(), c = requestAnimationFrame(S);
		};
		return ee(() => {
			x(p), s = new ResizeObserver(p), n.value && (s.observe(n.value), n.value.firstElementChild && s.observe(n.value.firstElementChild));
		}), w(() => {
			h(), s?.disconnect();
		}), (e, s) => (D(), l("div", qc, [
			u("div", {
				ref_key: "scroller",
				ref: n,
				class: "win-horizontal-scroll-scroller",
				onScroll: p,
				onWheel: y
			}, [u("div", Jc, [M(e.$slots, "default", {}, void 0, !0)])], 544),
			U(u("button", b({
				ref_key: "scrollBackButton",
				ref: r,
				class: "win-horizontal-scroll-button scroll-back",
				type: "button",
				"aria-label": z(t)("text.scroll-left")
			}, { "tooltipservice.tooltip": z(t)("text.scroll-left") }, { onClick: _ }), [...s[0] ||= [u("span", { class: "icon win-horizontal-scroll-arrow" }, "", -1)]], 16, Yc), [[B, a.value]]),
			U(u("button", b({
				ref_key: "scrollForwardButton",
				ref: i,
				class: "win-horizontal-scroll-button scroll-forward",
				type: "button",
				"aria-label": z(t)("text.scroll-right")
			}, { "tooltipservice.tooltip": z(t)("text.scroll-right") }, { onClick: v }), [...s[1] ||= [u("span", { class: "icon win-horizontal-scroll-arrow" }, "", -1)]], 16, Xc), [[B, o.value]])
		]));
	}
}, [["__scopeId", "data-v-4b6389c7"]]), $c = 100, el = {
	__name: "PullToRefresh",
	props: {
		RefreshVisualizer: {
			type: String,
			default: ""
		},
		PullDirection: {
			type: String,
			default: "TopToBottom"
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		icon: {
			type: String,
			default: ""
		}
	},
	emits: ["RefreshRequested", "refresh"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = A(0), a = A(0), s = A(!1), c = A(!1), d = o(() => Math.max(0, a.value - i.value)), f = o(() => Math.min(d.value / $c, 1)), p = o(() => d.value >= $c), m = o(() => c.value ? 50 : s.value ? d.value <= $c ? d.value * .5 : $c * .5 + (d.value - $c) * .15 : 0), h = o(() => ({
			transform: `translateY(${m.value - 40}px)`,
			transition: s.value ? "none" : "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
		})), g = o(() => ({
			transform: `translateY(${m.value}px)`,
			transition: s.value ? "none" : "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
		})), _ = o(() => {
			if (c.value) return {
				opacity: 1,
				transform: "scale(1.0)",
				transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
			};
			let e = -180 + f.value * 180, t = p.value ? 1.2 : 1, n = .3 + f.value * .7;
			return {
				transform: `rotate(${e}deg) scale(${t})`,
				opacity: n,
				transition: s.value ? "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
			};
		}), v = (e) => {
			n.IsEnabled && e.currentTarget.scrollTop === 0 && !c.value && (i.value = e.touches[0].clientY, a.value = i.value, s.value = !0);
		}, y = (e) => {
			n.IsEnabled && s.value && (a.value = e.touches[0].clientY, a.value > i.value && e.preventDefault());
		}, b = () => {
			if (n.IsEnabled && s.value) if (s.value = !1, p.value) {
				c.value = !0;
				let e = () => {
					c.value = !1, i.value = 0, a.value = 0;
				};
				r("RefreshRequested", {
					GetDeferral: () => ({ Complete: e }),
					Complete: e
				}), r("refresh", e);
			} else i.value = 0, a.value = 0;
		};
		return (t, n) => (D(), l("div", {
			class: "win-pull-to-refresh",
			onTouchstart: v,
			onTouchmove: y,
			onTouchend: b
		}, [u("div", {
			class: "ptr-indicator",
			style: C(h.value)
		}, [u("span", {
			class: S(["ptr-icon-wrapper", { "is-refreshing": c.value }]),
			style: C(_.value)
		}, L(e.icon), 7)], 4), u("div", {
			class: "ptr-content",
			style: C(g.value)
		}, [M(t.$slots, "default")], 4)], 32));
	}
}, tl = { class: "default-visualizer" }, nl = ["fill"], rl = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "RefreshVisualizer",
	props: {
		refreshState: { default: 0 },
		orientation: { default: "Top" },
		content: {}
	},
	emits: ["refreshStateChanged"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = o(() => n.refreshState === 4), a = o(() => {
			switch (n.refreshState) {
				case 0: return "state-idle";
				case 1: return "state-peeking";
				case 2: return "state-interacting";
				case 3: return "state-pending";
				case 4: return "state-refreshing";
				default: return "state-idle";
			}
		}), s = o(() => ({
			opacity: n.refreshState === 0 ? 0 : 1,
			transform: `scale(${n.refreshState === 1 ? .8 : 1})`,
			transition: n.refreshState === 0 ? "opacity 0.2s ease-out, transform 0.2s ease-out" : "transform 0.2s ease-out"
		})), c = o(() => {
			switch (n.refreshState) {
				case 3: return "var(--win-accent-color, #0078d4)";
				case 4: return "var(--win-accent-color, #0078d4)";
				default: return "var(--win-text-secondary, #605e5c)";
			}
		}), d = n.refreshState, f = (e) => {
			d !== e && (r("refreshStateChanged", {
				oldState: d,
				newState: e
			}), d = e);
		};
		return V(() => n.refreshState, (e) => {
			f(e);
		}), (e, t) => (D(), l("div", {
			class: S(["win-refresh-visualizer", a.value]),
			style: C(s.value)
		}, [M(e.$slots, "default", {}, () => [u("div", tl, [(D(), l("svg", {
			class: S(["refresh-icon", { spinning: i.value }]),
			width: "24",
			height: "24",
			viewBox: "0 0 24 24",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg"
		}, [u("path", {
			d: "M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z",
			fill: c.value
		}, null, 8, nl)], 2))])], !0)], 6));
	}
}), [["__scopeId", "data-v-b2a3bb27"]]), il = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "RefreshContainer",
	props: {
		pullThreshold: { default: 100 },
		visualizer: {}
	},
	emits: ["refreshRequested"],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, a = A(null), s = A(), c = A(0), d = A(0), f = A(!1), p = A(0), h = A(0), g = A(!1), _ = A([]), v = o(() => ({
			height: `${Math.min(p.value, r.pullThreshold * 1.5)}px`,
			opacity: +(p.value > 0),
			transform: `translateY(${Math.max(0, p.value - r.pullThreshold)}px)`
		})), y = o(() => ({
			transform: `translateY(${p.value}px)`,
			transition: g.value ? "none" : "transform 0.3s ease-out"
		})), b = (e) => {
			f.value || c.value === 0 && (h.value = e.touches[0].clientY, g.value = !0, d.value = 1);
		}, x = (e) => {
			if (!g.value || f.value) return;
			let t = e.touches[0].clientY - h.value;
			t > 0 && (e.preventDefault(), p.value = Math.min(t * .5, r.pullThreshold * 1.5), p.value >= r.pullThreshold ? d.value = 3 : p.value > 0 && (d.value = 2));
		}, w = () => {
			!g.value || f.value || (g.value = !1, p.value >= r.pullThreshold ? O() : k());
		}, E = (e) => {
			if (!f.value && c.value === 0) {
				h.value = e.clientY, g.value = !0, d.value = 1;
				let t = (e) => {
					if (!g.value) return;
					let t = e.clientY - h.value;
					t > 0 && (p.value = Math.min(t * .5, r.pullThreshold * 1.5), p.value >= r.pullThreshold ? d.value = 3 : p.value > 0 && (d.value = 2));
				}, n = () => {
					g.value && (g.value = !1, p.value >= r.pullThreshold ? O() : k(), document.removeEventListener("mousemove", t), document.removeEventListener("mouseup", n));
				};
				document.addEventListener("mousemove", t), document.addEventListener("mouseup", n);
			}
		}, O = () => {
			f.value = !0, d.value = 4, p.value = r.pullThreshold;
			let e = !1, t = { complete: () => {
				e || (e = !0, _.value.forEach((e) => e()), _.value = [], setTimeout(() => {
					f.value = !1, k();
				}, 300));
			} };
			i("refreshRequested", { getDeferral: () => t }), setTimeout(() => {
				e || t.complete();
			}, 3e3);
		}, k = () => {
			p.value = 0, d.value = 0;
		}, j = () => {
			c.value = Number(s.value?.VerticalOffset ?? 0);
		}, N = (e) => {
			d.value = e.newState;
		};
		return ee(() => {}), T(() => {}), t({ requestRefresh: () => {
			f.value || O();
		} }), (e, t) => (D(), l("div", {
			ref_key: "containerRef",
			ref: a,
			class: S(["win-refresh-container", { refreshing: f.value }]),
			onTouchstart: b,
			onTouchmove: x,
			onTouchend: w,
			onMousedown: E
		}, [u("div", {
			class: "refresh-visualizer-host",
			style: C(v.value)
		}, [M(e.$slots, "visualizer", {}, () => [m(rl, {
			refreshState: d.value,
			onRefreshStateChanged: N
		}, null, 8, ["refreshState"])], !0)], 4), m(Ft, {
			ref_key: "contentRef",
			ref: s,
			class: "refresh-container-content",
			style: C(y.value),
			VerticalScrollMode: "Auto",
			VerticalScrollBarVisibility: "Auto",
			HorizontalScrollMode: "Disabled",
			HorizontalScrollBarVisibility: "Disabled",
			onViewChanged: j
		}, {
			default: H(() => [M(e.$slots, "default", {}, void 0, !0)]),
			_: 3
		}, 8, ["style"])], 34));
	}
}), [["__scopeId", "data-v-088041e5"]]), al = ["aria-label"], ol = ["src", "alt"], sl = ["src"], cl = {
	__name: "Image",
	props: {
		Source: {
			type: [String, Object],
			default: ""
		},
		Stretch: {
			type: String,
			default: "Uniform"
		},
		NineGrid: {
			type: [String, Number],
			default: ""
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		},
		Margin: {
			type: [String, Number],
			default: ""
		},
		Opacity: {
			type: [String, Number],
			default: ""
		}
	},
	emits: ["ImageOpened", "ImageFailed"],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, a = te(), s = g(), d = A(null), f = A(null), p = A(null), m = A(!1), h = o(() => {
			let e = $(r.Source, s);
			return typeof e == "string" ? e : e && typeof e == "object" && e.UriSource || "";
		}), _ = o(() => ({
			UriSource: typeof r.Source == "object" ? r.Source.UriSource || "" : h.value,
			AutoPlay: typeof r.Source == "object" ? r.Source.AutoPlay !== !1 : !0
		})), v = o(() => {
			let e = a["AutomationProperties.Name"];
			return typeof e == "string" ? e : "";
		}), y = o(() => /\.gif(?:$|[?#])/i.test(h.value)), b = (e) => {
			if (!(e === "" || e == null)) return typeof e == "number" || /^-?\d+(\.\d+)?$/.test(String(e).trim()) ? `${e}px` : String(e);
		}, x = {
			Left: "flex-start",
			Center: "center",
			Right: "flex-end",
			Stretch: "stretch"
		}, w = o(() => {
			let e = String(r.NineGrid || "").split(",").map((e) => Number.parseFloat(e.trim())).filter((e) => Number.isFinite(e));
			return e.length === 4 ? e : null;
		}), ee = o(() => w.value?.map((e) => `${e}px`).join(" ") || ""), T = o(() => w.value?.join(" ") || ""), E = o(() => ({
			width: ee.value ? b(r.Width || r.Height) : b(r.Width),
			height: b(r.Height),
			margin: b(r.Margin),
			opacity: r.Opacity === "" ? void 0 : Number(r.Opacity),
			alignSelf: x[r.HorizontalAlignment] || void 0
		})), O = o(() => `stretch-${String(r.Stretch || "Uniform").toLowerCase()}`), k = o(() => String(r.Stretch || "Uniform").toLowerCase() === "none"), j = o(() => ({
			width: k.value ? "auto" : b(r.Width) || "auto",
			height: k.value ? "auto" : b(r.Height) || "auto",
			maxWidth: k.value ? "none" : r.Width || r.Height ? "100%" : void 0,
			maxHeight: k.value ? "none" : r.Width || r.Height ? "100%" : void 0,
			objectPosition: "center"
		})), N = o(() => ({
			width: "100%",
			height: "100%",
			borderStyle: "solid",
			borderColor: "transparent",
			borderWidth: ee.value,
			borderImageSource: `url(${h.value})`,
			borderImageSlice: `${T.value} fill`,
			borderImageWidth: ee.value,
			borderImageRepeat: "stretch",
			backgroundImage: `url(${h.value})`,
			backgroundSize: "100% 100%",
			boxSizing: "border-box"
		})), P = (e) => {
			i("ImageOpened", e), requestAnimationFrame(I);
		}, F = (e) => i("ImageFailed", e), I = () => {
			let e = f.value, t = p.value;
			!e || !t || !y.value || (t.width = e.naturalWidth || 1, t.height = e.naturalHeight || 1, t.getContext("2d")?.drawImage(e, 0, 0));
		};
		return t({
			Play: () => {
				!f.value || _.value.AutoPlay || !y.value || (m.value = !0);
			},
			Stop: () => {
				let e = f.value;
				!e || _.value.AutoPlay || !y.value || (m.value = !1, e.src = "", requestAnimationFrame(() => {
					e.src = h.value;
				}));
			},
			rootRef: d,
			imageRef: f,
			canvasRef: p
		}), (e, t) => (D(), l("div", {
			ref_key: "rootRef",
			ref: d,
			class: S(["win-image-host", { "has-nine-grid": !!ee.value }]),
			style: C(E.value),
			role: "img",
			"aria-label": v.value
		}, [
			!_.value.AutoPlay && y.value && !m.value && !ee.value ? (D(), l("canvas", {
				key: 0,
				ref_key: "canvasRef",
				ref: p,
				class: S(["win-image", O.value]),
				style: C(j.value),
				"aria-hidden": "true"
			}, null, 6)) : c("", !0),
			ee.value ? (D(), l("div", {
				key: 2,
				class: "win-image-nine-grid",
				style: C(N.value),
				"aria-hidden": "true"
			}, [u("img", {
				class: "win-image-nine-grid-image",
				src: h.value,
				alt: ""
			}, null, 8, sl)], 4)) : (D(), l("img", {
				key: 1,
				ref_key: "imageRef",
				ref: f,
				class: S(["win-image", [O.value, { "is-hidden": !_.value.AutoPlay && y.value && !m.value }]]),
				src: h.value,
				alt: v.value,
				style: C(j.value),
				decoding: "async",
				onLoad: P,
				onError: F
			}, null, 46, ol)),
			M(e.$slots, "default")
		], 14, al));
	}
}, ll = { class: "win-media-player-surface" }, ul = ["poster", "autoplay"], dl = ["src", "type"], fl = ["src"], pl = {
	key: 0,
	class: "win-media-error",
	role: "alert"
}, ml = {
	key: 1,
	class: "win-media-timeline-border"
}, hl = { class: "win-media-timeline-grid" }, gl = { class: "win-media-progress-host" }, _l = { class: "win-media-progress-slider" }, vl = {
	key: 0,
	class: "win-media-loading-progress"
}, yl = { class: "win-media-time-text-grid" }, bl = { class: "win-media-command-border" }, xl = ["aria-label"], Sl = { class: "win-media-command-left" }, Cl = ["aria-label"], wl = {
	class: "win-media-glyph",
	"aria-hidden": "true"
}, Tl = { class: "win-media-volume-panel" }, El = ["aria-label"], Dl = {
	class: "win-media-glyph",
	"aria-hidden": "true"
}, Ol = { class: "win-media-volume-slider" }, kl = { class: "win-media-volume-value" }, Al = { class: "win-media-command-center" }, jl = ["aria-label"], Ml = {
	class: "win-media-glyph",
	"aria-hidden": "true"
}, Nl = { class: "win-media-command-right" }, Pl = ["aria-label"], Fl = ["aria-label"], Il = ["aria-label"], Ll = {
	class: "win-media-glyph",
	"aria-hidden": "true"
}, Rl = /* @__PURE__ */ h({
	__name: "MediaPlayerElement",
	props: {
		Source: {
			type: [String, Object],
			default: ""
		},
		AreTransportControlsEnabled: {
			type: Boolean,
			default: !1
		},
		PosterSource: {
			type: [String, Object],
			default: ""
		},
		Stretch: {
			type: String,
			default: "Uniform"
		},
		AutoPlay: {
			type: Boolean,
			default: !1
		},
		IsFullWindow: {
			type: Boolean,
			default: !1
		},
		TransportControls: {
			type: Object,
			default: null
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		MaxHeight: {
			type: [String, Number],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	emits: [
		"MediaOpened",
		"MediaFailed",
		"IsFullWindowChanged"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, { t: a } = rt(), d = v("winuiTheme", null), f = A(null), p = A(null), h = A(null), g = A(null), _ = A(r.Stretch), y = A(!1), T = A(!1), E = A(0), O = A(0), k = A(50), j = A(!1), M = A(!1), N = A(!1), P = A(!1), F = A(!1), I = A(!0), R = A(!1), te = A(!1), ne = A(!1), B = A(!1), U = A(""), W = null, re = null, K = null, q = null, J = null, ie = (e) => {
			if (!(e === "" || e == null)) return typeof e == "number" || /^-?\d+(\.\d+)?$/.test(String(e).trim()) ? `${e}px` : String(e);
		}, Y = (e) => typeof e == "string" ? e : e && typeof e == "object" ? String(e.UriSource || "") : "", X = o(() => Y(r.Source)), Z = o(() => Y(r.PosterSource)), ae = o(() => {
			let e = X.value.split(/[?#]/, 1)[0].toLowerCase();
			return e.endsWith(".mp4") || e.endsWith(".m4v") ? "video/mp4" : e.endsWith(".webm") ? "video/webm" : e.endsWith(".ogv") || e.endsWith(".ogg") ? "video/ogg" : "";
		}), Q = () => {
			let e = f.value?.closest?.(".theme-light, .theme-dark");
			return e?.classList.contains("theme-dark") ? "dark" : e?.classList.contains("theme-light") ? "light" : "";
		}, oe = o(() => {
			let e = String(U.value || "").toLowerCase();
			if (e === "light" || e === "dark") return e;
			let t = String(z(d) || "").toLowerCase();
			if (t === "light" || t === "dark") return t;
			if (typeof document < "u") {
				let e = document.documentElement;
				if (e.classList.contains("theme-dark") || e.dataset.theme === "dark") return "dark";
				if (e.classList.contains("theme-light") || e.dataset.theme === "light") return "light";
			}
			return "";
		}), se = o(() => r.TransportControls || {}), ce = o(() => se.value.IsSeekBarVisible !== !1), le = o(() => se.value.IsVolumeButtonVisible !== !1), ue = o(() => se.value.IsZoomButtonVisible !== !1), de = o(() => se.value.IsCastButtonVisible !== !1), fe = o(() => se.value.IsFullWindowButtonVisible !== !1), $ = o(() => se.value.ShowAndHideAutomatically !== !1), pe = o(() => ({
			None: "none",
			Fill: "fill",
			Uniform: "contain",
			UniformToFill: "cover"
		})[_.value] || "contain"), me = o(() => ({ objectFit: pe.value })), he = o(() => F.value), ge = o(() => ({
			width: ie(r.Width),
			height: ie(r.Height),
			minWidth: ie(r.MinWidth),
			minHeight: ie(r.MinHeight),
			maxWidth: he.value ? void 0 : ie(r.MaxWidth),
			maxHeight: ie(r.MaxHeight),
			justifySelf: {
				Left: "start",
				Center: "center",
				Right: "end",
				Stretch: "stretch"
			}[r.HorizontalAlignment] || void 0,
			alignSelf: {
				Top: "start",
				Center: "center",
				Bottom: "end",
				Stretch: "stretch"
			}[r.VerticalAlignment] || void 0
		})), _e = o(() => y.value ? "" : ""), ve = o(() => T.value || k.value === 0 ? "" : ""), ye = () => {
			let e = p.value;
			e && (E.value = e.currentTime || 0, O.value = Number.isFinite(e.duration) ? e.duration : 0, T.value = e.muted, k.value = Math.round((e.volume || 0) * 100), e.readyState >= 1 && i("MediaOpened", e));
		}, be = () => {
			q && window.clearTimeout(q), q = null;
		}, xe = () => {
			be(), X.value && (q = window.setTimeout(() => {
				N.value && !j.value && Te({
					type: "error",
					target: p.value
				});
			}, 12e3));
		}, Se = () => {
			be(), j.value = !1, M.value = !1, N.value = !1, ye();
		}, Ce = () => {
			M.value = !0;
			let e = p.value;
			e && e.readyState >= 2 && (N.value = !1), We(), W && window.clearTimeout(W);
		}, we = () => {
			be(), M.value = !1, N.value = !1, Ge();
		}, Te = (e) => {
			be(), j.value = !0, M.value = !1, N.value = !1, We(), W && window.clearTimeout(W), W = null, i("MediaFailed", e);
		}, Ee = () => {
			y.value = !0, We();
		}, De = () => {
			y.value = !1, W && window.clearTimeout(W), W = null, I.value = !0;
		}, Oe = () => {
			let e = p.value;
			e && (e.paused ? e.play().catch(() => {}) : e.pause());
		}, ke = () => h.value?.toggle?.(), Ae = () => {
			let e = p.value;
			e && (e.muted = !e.muted, T.value = e.muted, !e.muted && e.volume === 0 && (e.volume = 1, k.value = 100));
		}, je = (e) => {
			let t = p.value;
			if (!t) return;
			let n = Math.max(0, Math.min(100, Number(e && typeof e == "object" && "NewValue" in e ? e.NewValue : e)));
			t.volume = n / 100, t.muted = n === 0, k.value = n, T.value = t.muted;
		}, Me = () => {
			let e = f.value;
			return !!(e && (document.fullscreenElement === e || e.matches(":fullscreen")));
		}, Ne = () => {
			let e = Me();
			F.value = e, e || (P.value = !1), i("IsFullWindowChanged", e);
		}, Pe = async () => {
			let e = f.value;
			if (e?.requestFullscreen) try {
				await e.requestFullscreen();
			} catch {
				F.value = !1;
			} finally {
				Ne();
			}
		}, Fe = async () => {
			try {
				document.fullscreenElement && document.exitFullscreen && await document.exitFullscreen();
			} catch {} finally {
				F.value = !1, Ne();
			}
		}, Ie = () => {
			Me() ? Fe() : Pe();
		}, Le = () => Ne(), Re = (e) => {
			let t = p.value;
			t && (t.currentTime = Number(e && typeof e == "object" && "NewValue" in e ? e.NewValue : e), ye());
		}, ze = () => {
			let e = [
				"Uniform",
				"Fill",
				"UniformToFill",
				"None"
			];
			_.value = e[(e.indexOf(_.value) + 1) % e.length];
		}, Be = () => {
			let e = window.chrome?.webview;
			return e?.postMessage ? (e.postMessage({
				source: "WinUIonWeb",
				type: "mediaCastRequested",
				sourceUri: p.value?.currentSrc || X.value
			}), !0) : !1;
		}, Ve = async () => {
			let e = p.value?.remote;
			if (e?.prompt) try {
				await e.prompt();
				return;
			} catch {}
			Be();
		}, He = () => {
			let e = p.value;
			!e || !("remote" in e) || (J = e.remote, J.onconnecting = () => We(), J.onconnect = () => We(), J.ondisconnect = () => We());
		}, Ue = () => {
			J &&= (J.onconnecting = null, J.onconnect = null, J.ondisconnect = null, null);
		}, We = () => {
			I.value = !0, W && window.clearTimeout(W), re && window.clearTimeout(re), re = window.setTimeout(() => {
				re = null, Ge();
			}, 0);
		}, Ge = () => {
			W && window.clearTimeout(W), W = null, !(!$.value || !y.value || M.value || j.value || R.value || te.value || ne.value || B.value || P.value) && (W = window.setTimeout(() => {
				I.value = !1, W = null;
			}, 3e3));
		}, Ke = () => {
			R.value = !0, W && window.clearTimeout(W);
		}, qe = () => {
			R.value = !1, Ge();
		}, Je = () => {
			te.value = !0, ne.value = !1, W && window.clearTimeout(W);
		}, Ye = () => {
			te.value = !1, Ge();
		}, Xe = (e) => {
			B.value = !1, te.value = !1;
			let t = e && Number.isFinite(e.clientX) && Number.isFinite(e.clientY) ? e : null, n = t ? document.elementFromPoint(t.clientX, t.clientY) : null;
			R.value = !!(n && g.value?.contains(n)), R.value || Ge();
		}, Ze = () => {
			te.value || (ne.value = !0, W && window.clearTimeout(W));
		}, Qe = (e) => {
			let t = e.relatedTarget;
			t instanceof Node && e.currentTarget.contains(t) || (ne.value = !1, Ge());
		}, $e = () => {
			B.value = !0, ne.value = !1, W && window.clearTimeout(W), We();
		}, et = () => {
			B.value = !1, Ge();
		}, tt = () => {
			B.value = !1, Ge();
		}, nt = () => {
			B.value = !1, R.value = !1, Ge();
		}, it = () => {
			y.value = !1, W && window.clearTimeout(W), W = null, I.value = !0;
		}, at = (e) => {
			let t = Math.max(0, Math.floor(Number(e) || 0)), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60), i = String(t % 60).padStart(2, "0");
			return n > 0 ? `${n}:${String(r).padStart(2, "0")}:${i}` : `${r}:${i}`;
		};
		return V(X, async () => {
			be(), j.value = !1, M.value = !0, N.value = !!X.value, We(), xe(), await x(), p.value && (p.value.load(), r.AutoPlay && p.value.play().catch(() => {}));
		}), V(() => r.AutoPlay, (e) => {
			e ? p.value?.play().catch(() => {}) : p.value?.pause();
		}), V(() => r.IsFullWindow, (e) => {
			e && !Me() ? Pe() : !e && Me() && Fe();
		}), V(P, (e) => {
			e ? We() : Ge();
		}), V($, (e) => {
			e ? Ge() : (W && window.clearTimeout(W), W = null, I.value = !0);
		}), V(() => r.Stretch, (e) => {
			_.value = e;
		}), ee(() => {
			document.addEventListener("fullscreenchange", Le), document.addEventListener("webkitfullscreenchange", Le), U.value = Q(), K = new MutationObserver(() => {
				U.value = Q();
			});
			let e = f.value?.closest?.(".theme-light, .theme-dark");
			e && K.observe(e, {
				attributes: !0,
				attributeFilter: ["class"]
			}), document.documentElement !== e && K.observe(document.documentElement, {
				attributes: !0,
				attributeFilter: ["class", "data-theme"]
			}), p.value && (N.value = !!X.value, M.value = !!X.value, xe(), p.value.load(), p.value.muted = !1, p.value.volume = .5, He(), r.AutoPlay && p.value.play().catch(() => {})), r.IsFullWindow && Pe();
		}), w(() => {
			document.removeEventListener("fullscreenchange", Le), document.removeEventListener("webkitfullscreenchange", Le), Ue(), K?.disconnect(), W && window.clearTimeout(W), re && window.clearTimeout(re), be();
		}), t({ MediaPlayer: p }), (t, n) => (D(), l("div", {
			ref_key: "rootRef",
			ref: f,
			class: S(["win-media-player-element", { "is-full-window": he.value }]),
			style: C(ge.value),
			onPointermove: We,
			onPointerleave: nt,
			onPointerdown: $e,
			onPointerup: et,
			onPointercancel: et,
			onLostpointercapture: tt
		}, [u("div", ll, [
			u("video", {
				ref_key: "videoRef",
				ref: p,
				class: S(["win-media-player-video", { "is-media-error": j.value }]),
				poster: Z.value,
				autoplay: e.AutoPlay,
				crossorigin: "anonymous",
				preload: "metadata",
				style: C(me.value),
				playsinline: "",
				onLoadedmetadata: ye,
				onTimeupdate: ye,
				onDurationchange: ye,
				onLoadeddata: Se,
				onError: Te,
				onWaiting: Ce,
				onCanplay: we,
				onPlaying: we,
				onPlay: Ee,
				onPause: De,
				onEnded: it
			}, [X.value ? (D(), l("source", {
				key: 0,
				src: X.value,
				type: ae.value || void 0
			}, null, 8, dl)) : c("", !0)], 46, ul),
			j.value && Z.value ? (D(), l("img", {
				key: 0,
				class: "win-media-player-poster-fallback",
				src: Z.value,
				alt: ""
			}, null, 8, fl)) : c("", !0),
			e.AreTransportControlsEnabled ? (D(), l("div", {
				key: 1,
				class: S(["win-media-transport-controls", {
					visible: I.value,
					"is-media-loading": N.value || j.value
				}])
			}, [u("div", {
				ref_key: "controlPanelRef",
				ref: g,
				class: "win-media-transport-panel",
				onPointerenter: Ke,
				onPointerleave: qe,
				onPointerdown: Je,
				onPointerup: Ye,
				onPointercancel: Ye,
				onLostpointercapture: Xe,
				onFocusin: Ze,
				onFocusout: Qe
			}, [
				j.value ? (D(), l("div", pl, L(z(a)("text.media-failed")), 1)) : c("", !0),
				ce.value ? (D(), l("div", ml, [u("div", hl, [u("div", gl, [u("div", _l, [m(Mr, {
					Value: E.value,
					Minimum: 0,
					Maximum: O.value || 1,
					SmallChange: 1,
					StepFrequency: .01,
					IsThumbToolTipEnabled: !1,
					Width: "100%",
					Height: "32",
					"onUpdate:Value": Re
				}, null, 8, ["Value", "Maximum"])]), M.value || j.value ? (D(), l("div", vl, [m(Nc, {
					IsIndeterminate: M.value || j.value,
					ShowError: j.value,
					Width: "100%",
					Height: "4"
				}, null, 8, ["IsIndeterminate", "ShowError"])])) : c("", !0)]), u("div", yl, [u("span", null, L(at(E.value)), 1), u("span", null, L(at(Math.max(0, O.value - E.value))), 1)])])])) : c("", !0),
				u("div", bl, [u("div", {
					class: "win-media-command-bar",
					role: "toolbar",
					"aria-label": z(a)("text.media-transport-controls")
				}, [
					u("div", Sl, [le.value ? (D(), s(Ha, {
						key: 0,
						ref_key: "volumeFlyoutRef",
						ref: h,
						IsOpen: P.value,
						"onUpdate:IsOpen": n[0] ||= (e) => P.value = e,
						Placement: "Top",
						Theme: oe.value
					}, {
						trigger: H(() => [u("button", b({
							class: "win-media-appbar-button",
							type: "button",
							"aria-label": z(a)("text.volume")
						}, { "tooltipservice.tooltip": z(a)("text.volume") }, { onClick: G(ke, ["stop"]) }), [u("span", wl, L(ve.value), 1)], 16, Cl)]),
						default: H(() => [u("div", Tl, [
							u("button", b({
								class: "win-media-appbar-button",
								type: "button",
								"aria-label": T.value ? z(a)("text.unmute") : z(a)("text.mute")
							}, { "tooltipservice.tooltip": T.value ? z(a)("text.unmute") : z(a)("text.mute") }, { onClick: Ae }), [u("span", Dl, L(ve.value), 1)], 16, El),
							u("div", Ol, [m(Mr, {
								Value: k.value,
								Minimum: 0,
								Maximum: 100,
								SmallChange: 1,
								StepFrequency: 1,
								IsThumbToolTipEnabled: !1,
								Width: "190",
								Height: "32",
								"onUpdate:Value": je
							}, null, 8, ["Value"])]),
							u("span", kl, L(Math.round(k.value)), 1)
						])]),
						_: 1
					}, 8, ["IsOpen", "Theme"])) : c("", !0)]),
					u("div", Al, [u("button", b({
						class: "win-media-appbar-button",
						type: "button",
						"aria-label": y.value ? z(a)("text.pause") : z(a)("text.play")
					}, { "tooltipservice.tooltip": y.value ? z(a)("text.pause") : z(a)("text.play") }, { onClick: Oe }), [u("span", Ml, L(_e.value), 1)], 16, jl)]),
					u("div", Nl, [
						ue.value ? (D(), l("button", b({
							key: 0,
							class: "win-media-appbar-button",
							type: "button",
							"aria-label": z(a)("text.aspect-ratio")
						}, { "tooltipservice.tooltip": z(a)("text.aspect-ratio") }, { onClick: ze }), [...n[1] ||= [u("span", {
							class: "win-media-glyph",
							"aria-hidden": "true"
						}, "", -1)]], 16, Pl)) : c("", !0),
						de.value ? (D(), l("button", b({
							key: 1,
							class: "win-media-appbar-button",
							type: "button",
							"aria-label": z(a)("text.cast")
						}, { "tooltipservice.tooltip": z(a)("text.cast") }, { onClick: Ve }), [...n[2] ||= [u("span", {
							class: "win-media-glyph",
							"aria-hidden": "true"
						}, "", -1)]], 16, Fl)) : c("", !0),
						fe.value ? (D(), l("button", b({
							key: 2,
							class: "win-media-appbar-button",
							type: "button",
							"aria-label": he.value ? z(a)("text.exit-full-screen") : z(a)("text.full-screen")
						}, { "tooltipservice.tooltip": he.value ? z(a)("text.exit-full-screen") : z(a)("text.full-screen") }, { onClick: Ie }), [u("span", Ll, L(he.value ? "" : ""), 1)], 16, Il)) : c("", !0)
					])
				], 8, xl)])
			], 544)], 2)) : c("", !0)
		])], 38));
	}
}), zl = { class: "win-capture-element" }, Bl = { class: "win-capture-container" }, Vl = { class: "win-capture-snapshots" }, Hl = ["src"], Ul = {
	__name: "CaptureElement",
	emits: ["Ready", "PhotoCaptured"],
	setup(e, { expose: n, emit: r }) {
		let i = r, a = A(null), o = A(""), s = A([]), c = A(!1), d = null, f = async () => {
			if (i("Ready", !1), !navigator.mediaDevices?.getUserMedia) return o.value = "No camera devices found.", !1;
			try {
				return d = await navigator.mediaDevices.getUserMedia({
					video: !0,
					audio: !1
				}), a.value ? (a.value.srcObject = d, await new Promise((e, t) => {
					a.value.onloadedmetadata = e, a.value.onerror = t;
				}), await a.value.play(), o.value = `Viewing: ${d.getVideoTracks()[0]?.label || "Integrated camera"}`, await x(), i("Ready", !0), !0) : !1;
			} catch (e) {
				return o.value = "No camera devices found.", o.value = e?.name === "NotAllowedError" ? "Camera access denied." : "Unable to start the camera.", i("Ready", !1), !1;
			}
		}, p = () => {
			d?.getTracks().forEach((e) => e.stop()), d = null, a.value && (a.value.srcObject = null), i("Ready", !1);
		};
		return w(p), n({
			StartCaptureElement: f,
			StopCaptureElement: p,
			CapturePhoto: () => {
				let e = a.value;
				if (!e || !d || !e.videoWidth) return null;
				let t = document.createElement("canvas");
				t.width = e.videoWidth, t.height = e.videoHeight;
				let n = t.getContext("2d");
				if (!n) return null;
				n.drawImage(e, 0, 0, t.width, t.height);
				let r = t.toDataURL("image/jpeg", .92), o = {
					id: `${Date.now()}-${s.value.length}`,
					source: r
				};
				return s.value.unshift(o), i("PhotoCaptured", o), o;
			},
			SetMirrorPreview: (e) => {
				c.value = !!e;
			},
			snapshots: s,
			mirrorPreview: c
		}), (e, n) => (D(), l("div", zl, [
			u("div", { class: S(["win-capture-frame-source", { empty: !o.value }]) }, L(o.value), 3),
			u("div", { class: S(["win-capture-captured-label", { visible: s.value.length > 0 }]) }, "Captured:", 2),
			u("div", { class: S(["win-capture-preview", { mirrored: c.value }]) }, [u("video", {
				ref_key: "videoRef",
				ref: a,
				autoplay: "",
				muted: "",
				playsinline: ""
			}, null, 512)], 2),
			u("div", Bl, [m(Ft, {
				class: "win-capture-snapshots-scroll",
				VerticalScrollMode: "Auto",
				VerticalScrollBarVisibility: "Auto",
				HorizontalScrollMode: "Disabled",
				HorizontalScrollBarVisibility: "Disabled"
			}, {
				default: H(() => [u("div", Vl, [(D(!0), l(t, null, j(s.value, (e) => (D(), l("img", {
					key: e.id,
					src: e.source,
					alt: "Captured photo"
				}, null, 8, Hl))), 128))])]),
				_: 1
			})])
		]));
	}
}, Wl = ["aria-label"], Gl = ["src"], Kl = {
	key: 1,
	class: "win-person-picture-initials"
}, ql = {
	key: 2,
	class: "icon win-person-picture-placeholder"
}, Jl = {
	key: 3,
	class: "win-person-picture-badge"
}, Yl = ["src"], Xl = { key: 1 }, Zl = {
	key: 2,
	class: "icon"
}, Ql = /* @__PURE__ */ h({
	__name: "PersonPicture",
	props: {
		BadgeNumber: {
			type: Number,
			default: 0
		},
		BadgeGlyph: {
			type: String,
			default: ""
		},
		BadgeImageSource: {
			type: [String, Object],
			default: ""
		},
		BadgeText: {
			type: String,
			default: ""
		},
		IsGroup: {
			type: Boolean,
			default: !1
		},
		Contact: {
			type: Object,
			default: null
		},
		DisplayName: {
			type: String,
			default: ""
		},
		Initials: {
			type: String,
			default: ""
		},
		PreferSmallImage: {
			type: Boolean,
			default: !1
		},
		ProfilePicture: {
			type: [String, Object],
			default: ""
		},
		Width: {
			type: [String, Number],
			default: 96
		},
		Height: {
			type: [String, Number],
			default: 96
		},
		Foreground: {
			type: String,
			default: ""
		},
		Background: {
			type: String,
			default: ""
		},
		BorderBrush: {
			type: String,
			default: ""
		},
		BorderThickness: {
			type: [String, Number],
			default: 1
		},
		FontFamily: {
			type: String,
			default: ""
		},
		FontWeight: {
			type: [String, Number],
			default: "600"
		},
		VerticalAlignment: {
			type: String,
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		}
	},
	setup(e) {
		let t = e, n = (e) => {
			if (!(e === "" || e == null)) return typeof e == "number" || /^-?\d+(\.\d+)?$/.test(String(e).trim()) ? `${e}px` : String(e);
		}, r = o(() => t.Contact?.DisplayName || t.DisplayName || ""), i = (e) => typeof e == "string" ? e : e && typeof e == "object" ? String(e.UriSource || "") : "", a = o(() => i(t.ProfilePicture) || i(t.Contact?.ProfilePicture)), s = o(() => i(t.BadgeImageSource)), u = (e) => String(e || "").trim().match(/[\p{L}\p{N}]/u)?.[0] || "", d = o(() => {
			if (t.IsGroup) return "";
			if (t.Initials) return t.Initials.slice(0, 2).toUpperCase();
			let e = r.value.replace(/\s*[({\[][^)}\]]*[)}\]]\s*$/, "").trim().split(/\s+/).filter(Boolean);
			return e.length ? (u(e[0]) + (e.length > 1 ? u(e[e.length - 1]) : "")).toUpperCase() : "";
		}), f = o(() => !!s.value || t.BadgeNumber > 0 || !!t.BadgeGlyph), p = (e) => {
			let t = n(e);
			return t && t !== "auto" ? t : "96px";
		}, m = o(() => {
			let e = p(t.Width), n = p(t.Height);
			return e === n ? e : `min(${e}, ${n})`;
		}), h = o(() => ({
			width: n(m.value),
			height: n(m.value),
			"--win-person-picture-size": n(m.value),
			color: t.Foreground || "var(--PersonPictureForegroundThemeBrush, var(--text-primary))",
			background: t.Background || "var(--PersonPictureEllipseFillThemeBrush, var(--ctrl-fill-secondary))",
			borderColor: t.BorderBrush || "var(--PersonPictureEllipseFillStrokeBrush, var(--card-stroke))",
			borderWidth: n(t.BorderThickness),
			fontFamily: t.FontFamily || "var(--font-family-content, Segoe UI)",
			fontWeight: t.FontWeight,
			alignSelf: {
				Top: "flex-start",
				Center: "center",
				Bottom: "flex-end",
				Stretch: "stretch"
			}[t.VerticalAlignment] || void 0,
			justifySelf: {
				Left: "start",
				Center: "center",
				Right: "end",
				Stretch: "stretch"
			}[t.HorizontalAlignment] || void 0
		})), g = o(() => t.BadgeText ? `${r.value}, ${t.BadgeText}` : r.value || d.value || void 0);
		return (t, n) => (D(), l("div", {
			class: S(["win-person-picture", {
				"has-photo": a.value,
				"has-badge": f.value
			}]),
			style: C(h.value),
			"aria-label": g.value
		}, [a.value ? (D(), l("img", {
			key: 0,
			class: "win-person-picture-image",
			src: a.value,
			alt: ""
		}, null, 8, Gl)) : !e.IsGroup && d.value ? (D(), l("span", Kl, L(d.value), 1)) : (D(), l("span", ql, L(e.IsGroup ? "" : ""), 1)), f.value ? (D(), l("span", Jl, [s.value ? (D(), l("img", {
			key: 0,
			src: s.value,
			alt: ""
		}, null, 8, Yl)) : e.BadgeNumber > 0 ? (D(), l("span", Xl, L(e.BadgeNumber > 99 ? "99+" : e.BadgeNumber), 1)) : e.BadgeGlyph ? (D(), l("span", Zl, L(e.BadgeGlyph), 1)) : c("", !0)])) : c("", !0)], 14, Wl));
	}
}), $l = ["src"], eu = {
	key: 1,
	class: "win-animated-visual",
	viewBox: "0 0 375 667",
	preserveAspectRatio: "xMidYMid meet",
	"aria-hidden": "true"
}, tu = {
	key: 2,
	class: "win-animated-visual-fallback-content"
}, nu = {
	__name: "AnimatedVisualPlayer",
	props: {
		Source: {
			type: [String, Object],
			default: null
		},
		FallbackContent: {
			type: [String, Object],
			default: null
		},
		AutoPlay: {
			type: Boolean,
			default: !0
		},
		AnimationOptimization: {
			type: String,
			default: "Latency"
		},
		PlaybackRate: {
			type: Number,
			default: 1
		},
		Stretch: {
			type: String,
			default: "Uniform"
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		MaxHeight: {
			type: [String, Number],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	setup(e, { expose: t }) {
		let n = e, r = A(null), i = A(!1), a = A(!1), s = A(0), u = A(5967), d = null, p = null, m = (e) => {
			if (!(e === "" || e == null)) return typeof e == "number" || /^-?\d+(\.\d+)?$/.test(String(e).trim()) ? `${e}px` : String(e);
		}, h = o(() => typeof n.Source == "string" ? n.Source : n.Source && typeof n.Source == "object" ? n.Source.UriSource || "" : typeof n.FallbackContent == "string" && /^(https?:|data:|\/)/.test(n.FallbackContent) ? n.FallbackContent : ""), g = o(() => ({
			width: m(n.Width),
			height: m(n.Height),
			minWidth: m(n.MinWidth),
			minHeight: m(n.MinHeight),
			maxWidth: m(n.MaxWidth),
			maxHeight: m(n.MaxHeight),
			justifySelf: {
				Left: "start",
				Center: "center",
				Right: "end",
				Stretch: "stretch"
			}[n.HorizontalAlignment] || void 0,
			alignSelf: {
				Top: "start",
				Center: "center",
				Bottom: "end",
				Stretch: "stretch"
			}[n.VerticalAlignment] || void 0,
			"--win-avp-rate": String(Math.abs(n.PlaybackRate) || 1),
			"--win-avp-direction": n.PlaybackRate < 0 ? "reverse" : "normal",
			"--win-avp-progress": String(s.value)
		})), _ = () => {
			d && window.clearTimeout(d), d = null, p &&= (p(), null);
		}, v = () => {
			i.value = !1, d &&= (window.clearTimeout(d), null);
		}, y = () => {
			n.PlaybackRate !== 0 && (i.value = !0);
		}, b = () => {
			_(), i.value = !1, s.value = 0;
		}, x = (e = 0, t = 1, r = !1) => (_(), s.value = Math.max(0, Math.min(1, Number(e))), i.value = n.PlaybackRate !== 0, i.value ? new Promise((e) => {
			p = e, !r && (d = window.setTimeout(() => {
				s.value = Math.max(0, Math.min(1, Number(t))), i.value = !1, d = null, p = null, e();
			}, u.value / Math.max(Math.abs(n.PlaybackRate), .01)));
		}) : Promise.resolve());
		return ee(() => {
			a.value = !0, n.AutoPlay && x(0, 1, !0);
		}), V(() => n.AutoPlay, (e) => {
			e ? x(s.value, 1, !0) : v();
		}), V(() => n.PlaybackRate, (e) => {
			e === 0 && v();
		}), V(() => n.Source, () => {
			a.value = !1, requestAnimationFrame(() => {
				a.value = !0;
			});
		}), w(_), t({
			Diagnostics: null,
			Duration: u,
			IsAnimatedVisualLoaded: a,
			IsPlaying: i,
			ProgressObject: null,
			Pause: v,
			PlayAsync: x,
			Resume: y,
			SetProgress: (e) => {
				s.value = Math.max(0, Math.min(1, Number(e)));
			},
			Stop: b,
			rootRef: r
		}), (e, t) => (D(), l("div", {
			ref_key: "rootRef",
			ref: r,
			class: S(["win-animated-visual-player", {
				"is-playing": i.value,
				"is-loaded": a.value
			}]),
			style: C(g.value),
			role: "img"
		}, [h.value ? (D(), l("img", {
			key: 0,
			class: "win-animated-visual-fallback",
			src: h.value,
			alt: ""
		}, null, 8, $l)) : (D(), l("svg", eu, [...t[0] ||= [f("<rect class=\"lottie-background\" x=\"0\" y=\"0\" width=\"375\" height=\"667\"></rect><g class=\"lottie-mark\"><path class=\"mark-stroke mark-stroke-1\" d=\"M112 333h151\"></path><path class=\"mark-stroke mark-stroke-2\" d=\"M145 287v92\"></path><path class=\"mark-stroke mark-stroke-3\" d=\"M188 268v131\"></path><path class=\"mark-stroke mark-stroke-4\" d=\"M231 287v92\"></path><circle class=\"mark-dot mark-dot-1\" cx=\"112\" cy=\"333\" r=\"10\"></circle><circle class=\"mark-dot mark-dot-2\" cx=\"145\" cy=\"287\" r=\"10\"></circle><circle class=\"mark-dot mark-dot-3\" cx=\"188\" cy=\"268\" r=\"10\"></circle><circle class=\"mark-dot mark-dot-4\" cx=\"231\" cy=\"287\" r=\"10\"></circle><circle class=\"mark-dot mark-dot-5\" cx=\"263\" cy=\"333\" r=\"10\"></circle></g>", 2)]])), !a.value && e.$slots.FallbackContent ? (D(), l("div", tu, [M(e.$slots, "FallbackContent")])) : c("", !0)], 6));
	}
}, ru = /*#__PURE__*/ dt({
	__name: "ParallaxView",
	props: {
		Source: {
			type: [
				String,
				Object,
				Function
			],
			default: null
		},
		HorizontalShift: {
			type: Number,
			default: 0
		},
		VerticalShift: {
			type: Number,
			default: 0
		},
		HorizontalSourceStartOffset: {
			type: Number,
			default: 0
		},
		HorizontalSourceEndOffset: {
			type: Number,
			default: 0
		},
		VerticalSourceStartOffset: {
			type: Number,
			default: 0
		},
		VerticalSourceEndOffset: {
			type: Number,
			default: 0
		},
		HorizontalSourceOffsetKind: {
			type: String,
			default: "Relative"
		},
		VerticalSourceOffsetKind: {
			type: String,
			default: "Relative"
		},
		IsHorizontalShiftClamped: {
			type: Boolean,
			default: !0
		},
		IsVerticalShiftClamped: {
			type: Boolean,
			default: !0
		},
		MaxHorizontalShiftRatio: {
			type: Number,
			default: 1
		},
		MaxVerticalShiftRatio: {
			type: Number,
			default: 1
		}
	},
	setup(e, { expose: t }) {
		let n = e, r = A(null), i = A(null), a = A(null), s = A(0), c = A(0), d = (e) => e && typeof e == "object" && !(e instanceof HTMLElement) && "value" in e ? e.value : e, f = (e) => {
			if (typeof e == "function" && (e = e()), !e) return null;
			let t = d(e);
			if (typeof t == "string") t = document.querySelector(t);
			else if (t && typeof t == "object" && !(t instanceof HTMLElement) && "$el" in t) {
				let e = d(t.scrollViewerRef);
				if (e instanceof HTMLElement) return e;
				t = t.$el;
			}
			return t instanceof HTMLElement ? t.classList.contains("win-scroll-viewer-viewport") ? t : t.querySelector(".win-scroll-viewer-viewport") || t : null;
		}, p = (e, t, n, r, i, a, o) => {
			if (!n || t <= 0) return 0;
			let s = i - r;
			if (s <= 0) return 0;
			let c = e, l;
			return n > 0 ? (l = -Math.min(Math.max(0, a), n / s) * (c - r), o && (l = Math.max(-n, Math.min(0, l)))) : (l = Math.min(Math.max(0, a), -n / s) * (c - i), o && (l = Math.max(n, Math.min(0, l)))), l;
		}, m = () => {
			let e = a.value;
			if (!e) return;
			let t = e.scrollWidth - e.clientWidth, r = e.scrollHeight - e.clientHeight, o = n.HorizontalSourceStartOffset, l = n.HorizontalSourceEndOffset;
			n.HorizontalSourceOffsetKind === "Relative" && (l = Math.max(0, t + n.HorizontalSourceEndOffset));
			let u = n.VerticalSourceStartOffset, d = n.VerticalSourceEndOffset;
			n.VerticalSourceOffsetKind === "Relative" && (d = Math.max(0, r + n.VerticalSourceEndOffset));
			let f = p(e.scrollLeft, t, n.HorizontalShift, o, l, n.MaxHorizontalShiftRatio, n.IsHorizontalShiftClamped), m = p(e.scrollTop, r, n.VerticalShift, u, d, n.MaxVerticalShiftRatio, n.IsVerticalShiftClamped), h = i.value;
			if (h) {
				let e = `translate3d(${f}px, ${m}px, 0)`;
				h.style.transform !== e && (h.style.transform = e);
			}
			s.value = f, c.value = m;
		}, h = () => {
			m();
		}, g = o(() => {
			let e = {
				transform: `translate3d(${s.value}px, ${c.value}px, 0)`,
				willChange: "transform"
			};
			return n.HorizontalShift !== 0 && (e.width = `calc(100% + ${Math.abs(n.HorizontalShift)}px)`), n.VerticalShift !== 0 && (e.height = `calc(100% + ${Math.abs(n.VerticalShift)}px)`), e;
		}), _ = () => {
			v(), a.value = f(n.Source), a.value && (a.value.addEventListener("scroll", h, { passive: !0 }), m());
		}, v = () => {
			a.value && a.value.removeEventListener("scroll", h), a.value = null;
		};
		return V(o(() => d(typeof n.Source == "function" ? n.Source() : n.Source)), () => x(_)), V(() => [
			n.HorizontalShift,
			n.VerticalShift,
			n.HorizontalSourceStartOffset,
			n.HorizontalSourceEndOffset,
			n.VerticalSourceStartOffset,
			n.VerticalSourceEndOffset,
			n.HorizontalSourceOffsetKind,
			n.VerticalSourceOffsetKind,
			n.IsHorizontalShiftClamped,
			n.IsVerticalShiftClamped,
			n.MaxHorizontalShiftRatio,
			n.MaxVerticalShiftRatio
		], m), ee(() => x(_)), w(() => {
			v();
		}), t({ refresh: m }), (e, t) => (D(), l("div", {
			class: "win-parallax-view",
			ref_key: "containerRef",
			ref: r
		}, [u("div", {
			class: "parallax-child",
			style: C(g.value),
			ref_key: "childRef",
			ref: i
		}, [M(e.$slots, "child", {}, void 0, !0)], 4)], 512));
	}
}, [["__scopeId", "data-v-56f58f35"]]), iu = /* @__PURE__ */ h({
	inheritAttrs: !1,
	__name: "FontIcon",
	props: {
		Glyph: {
			type: [String, Number],
			default: ""
		},
		FontSize: {
			type: [String, Number],
			default: ""
		},
		Foreground: {
			type: String,
			default: ""
		}
	},
	setup(e) {
		let t = e, n = te(), r = g(), i = o(() => String($(t.Glyph, r) ?? "")), a = o(() => ({
			fontSize: t.FontSize ? `${$(t.FontSize, r)}px` : void 0,
			color: $(t.Foreground, r) || void 0
		}));
		return (e, t) => (D(), l("span", b(z(n), {
			class: "win-font-icon",
			style: a.value
		}), L(i.value), 17));
	}
}), au = /* @__PURE__ */ h({
	inheritAttrs: !1,
	__name: "SymbolIcon",
	props: {
		Symbol: {
			type: [String, Number],
			default: ""
		},
		FontSize: {
			type: [String, Number],
			default: ""
		},
		Foreground: {
			type: String,
			default: ""
		}
	},
	setup(e) {
		let t = e, n = te(), r = g(), i = {
			List: "",
			Bullets: "",
			Refresh: "",
			Find: "",
			Share: "",
			Save: "",
			Copy: "",
			Delete: ""
		}, a = o(() => {
			let e = String($(t.Symbol, r) ?? "");
			return i[e] ?? e;
		}), s = o(() => ({
			fontSize: t.FontSize ? `${$(t.FontSize, r)}px` : void 0,
			color: $(t.Foreground, r) || void 0
		}));
		return (e, t) => (D(), l("span", b({ class: "win-symbol-icon" }, z(n), { style: s.value }), L(a.value), 17));
	}
}), ou = ["aria-expanded"], su = { class: "win-expander-header-main" }, cu = {
	key: 0,
	class: "win-expander-header-icon icon",
	"aria-hidden": "true"
}, lu = ["innerHTML"], uu = { class: "win-expander-header-content" }, du = {
	key: 0,
	class: "win-expander-header-controls"
}, fu = { class: "win-expander-grid" }, pu = { class: "win-expander-inner" }, mu = /*#__PURE__*/ dt({
	__name: "ExpanderBase",
	props: {
		Header: {
			type: [String, Number],
			default: ""
		},
		Content: {
			type: [String, Number],
			default: ""
		},
		Description: {
			type: [String, Number],
			default: ""
		},
		HeaderIcon: {
			type: String,
			default: ""
		},
		HeaderTemplate: {
			type: [
				Object,
				Function,
				String
			],
			default: null
		},
		HeaderTemplateSelector: {
			type: [
				Object,
				Function,
				String
			],
			default: null
		},
		IsExpanded: {
			type: [Boolean, String],
			default: !1
		},
		ExpandDirection: {
			type: [String, Number],
			default: "Down"
		},
		Padding: {
			type: [String, Number],
			default: "16"
		},
		HorizontalContentAlignment: {
			type: String,
			default: "Stretch"
		},
		VerticalContentAlignment: {
			type: String,
			default: "Stretch"
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	emits: [
		"update:IsExpanded",
		"Expanding",
		"Collapsed"
	],
	setup(e, { emit: n }) {
		let r = e, i = n, a = ne(), d = g(), f = o(() => $(r.IsExpanded, d) === !0), m = o(() => $(r.ExpandDirection, d) || "Down"), h = o(() => $(r.Padding, d)), _ = o(() => $(r.HorizontalContentAlignment, d)), v = o(() => $(r.VerticalContentAlignment, d)), y = A(f.value), b = o(() => $(r.Header, d)), x = o(() => $(r.Content, d)), w = o(() => $(r.Description, d)), ee = o(() => $(r.HeaderIcon, d)), T = o(() => !!ee.value || !!a.HeaderIcon), E = o(() => !!a.HeaderControls), O = o(() => !!b.value || !!w.value || T.value || !!a.Header || !!a.Description || E.value), k = o(() => String(ee.value || "").trim().startsWith("<")), j = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, N = (e) => {
			let t = j(e);
			if (!t || t === "auto") return "";
			let n = typeof e == "number" ? e : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? Number(e.trim()) : null;
			return n === null ? `calc(${t} - 2px)` : `${Math.max(n - 2, 0)}px`;
		}, P = (e) => {
			if (e === "" || e == null) return "";
			let t = String(e).split(",").map((e) => {
				let t = e.trim();
				return j(Number.isNaN(Number(t)) ? t : Number(t));
			});
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : String(e);
		}, F = (e) => ({
			Left: "flex-start",
			Center: "center",
			Right: "flex-end",
			Stretch: "stretch"
		})[e] ?? "stretch", I = (e) => ({
			Top: "flex-start",
			Center: "center",
			Bottom: "flex-end",
			Stretch: "flex-start"
		})[e] ?? "flex-start", R = (e) => ({
			Top: "flex-start",
			Center: "center",
			Bottom: "flex-end",
			Stretch: "stretch"
		})[e] ?? "stretch", z = (e) => ({
			Left: "start",
			Center: "center",
			Right: "end",
			Stretch: "stretch"
		})[e] ?? "stretch", te = o(() => ({
			padding: P(h.value),
			alignItems: F(_.value),
			justifyContent: I(v.value)
		})), B = o(() => {
			let e = {};
			if (r.Height !== "") {
				let t = j(r.Height);
				if (t) {
					e.minHeight = t;
					let n = N(r.Height);
					n && (e["--win-expander-header-height"] = n);
				}
			}
			return r.Width !== "" && (e.width = j(r.Width)), r.MinWidth !== "" && (e.minWidth = j(r.MinWidth)), r.MaxWidth !== "" && (e.maxWidth = j(r.MaxWidth)), r.HorizontalAlignment && (e.justifySelf = z(r.HorizontalAlignment)), r.VerticalAlignment && (e.alignSelf = R(r.VerticalAlignment)), e;
		});
		V(f, (e) => {
			y.value = e;
		});
		let H = [
			"button",
			"a[href]",
			"input",
			"select",
			"textarea",
			"summary",
			"[contenteditable=\"\"]",
			"[contenteditable=\"true\"]",
			"[role=\"button\"]",
			"[role=\"checkbox\"]",
			"[role=\"link\"]",
			"[role=\"menuitem\"]",
			"[role=\"menuitemcheckbox\"]",
			"[role=\"menuitemradio\"]",
			"[role=\"option\"]",
			"[role=\"radio\"]",
			"[role=\"switch\"]",
			"[role=\"tab\"]",
			"[role=\"textbox\"]",
			"[tabindex]:not([tabindex=\"-1\"])"
		].join(","), U = (e) => {
			let t = e.target, n = e.currentTarget;
			if (!t?.closest || !n?.contains) return !1;
			let r = t.closest(H);
			return !!(r && r !== n && n.contains(r));
		}, W = (e) => {
			e.defaultPrevented || U(e) || re();
		}, G = (e) => {
			e.defaultPrevented || U(e) || e.key !== "Enter" && e.key !== " " || (e.preventDefault(), re());
		}, re = () => {
			let e = !y.value;
			y.value = e, i("update:IsExpanded", e), i(e ? "Expanding" : "Collapsed");
		};
		return (e, n) => (D(), l("div", {
			class: S(["win-expander", {
				"is-expanded": y.value,
				"expand-up": m.value === "Up",
				"has-header-content": O.value,
				"has-header-controls": E.value
			}]),
			style: C(B.value)
		}, [u("div", {
			class: "win-expander-header",
			onClick: W,
			onKeydown: G,
			"aria-expanded": y.value,
			role: "button",
			tabindex: "0"
		}, [
			u("div", su, [T.value ? (D(), l("span", cu, [M(e.$slots, "HeaderIcon", {}, () => [k.value ? (D(), l("span", {
				key: 0,
				innerHTML: ee.value
			}, null, 8, lu)) : (D(), l(t, { key: 1 }, [p(L(ee.value), 1)], 64))])])) : c("", !0), u("div", uu, [M(e.$slots, "Header", {}, () => [b.value ? (D(), s(Rt, {
				key: 0,
				class: "win-expander-header-text",
				Text: b.value,
				FontSize: "14",
				LineHeight: "20",
				TextWrapping: "Wrap"
			}, null, 8, ["Text"])) : c("", !0)]), M(e.$slots, "Description", {}, () => [w.value ? (D(), s(Rt, {
				key: 0,
				class: "win-expander-description",
				Text: w.value,
				FontSize: "var(--SettingsCardDescriptionFontSize, 12px)",
				LineHeight: "16",
				Foreground: "var(--TextFillColorSecondaryBrush, var(--text-secondary))",
				TextWrapping: "Wrap"
			}, null, 8, ["Text"])) : c("", !0)])])]),
			E.value ? (D(), l("div", du, [M(e.$slots, "HeaderControls")])) : c("", !0),
			n[0] ||= u("span", {
				class: "win-expander-chevron",
				"aria-hidden": "true"
			}, [u("span", { class: "icon win-expander-arrow" }, "")], -1)
		], 40, ou), u("div", fu, [u("div", pu, [u("div", {
			class: "win-expander-content",
			style: C(te.value)
		}, [M(e.$slots, "default", {}, () => [p(L(x.value), 1)])], 4)])])], 6));
	}
}, [["__scopeId", "data-v-9624bca5"]]), hu = (e) => h({
	name: `Expander.${e[0].toUpperCase()}${e.slice(1)}`,
	__expanderProperty: e,
	setup(e, { slots: t }) {
		return () => _("span", { class: "expander-property" }, t.default?.());
	}
}), gu = hu("header"), _u = hu("content"), vu = hu("description"), yu = hu("headerIcon"), bu = hu("headerControls"), xu = (e) => e.type?.__expanderProperty, Su = /* @__PURE__ */ h({
	Header: gu,
	Content: _u,
	Description: vu,
	HeaderIcon: yu,
	HeaderControls: bu,
	inheritAttrs: !1,
	__name: "Expander",
	props: {
		Header: {
			type: [String, Number],
			default: ""
		},
		Content: {
			type: [String, Number],
			default: ""
		},
		Description: {
			type: [String, Number],
			default: ""
		},
		HeaderIcon: {
			type: String,
			default: ""
		},
		IsExpanded: {
			type: [Boolean, String],
			default: !1
		},
		ExpandDirection: {
			type: [String, Number],
			default: "Down"
		},
		Padding: {
			type: [String, Number],
			default: "16"
		},
		HorizontalContentAlignment: {
			type: String,
			default: "Stretch"
		},
		VerticalContentAlignment: {
			type: String,
			default: "Stretch"
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	emits: [
		"update:IsExpanded",
		"Expanding",
		"Collapsed"
	],
	setup(e) {
		let n = ne(), r = o(() => {
			let e = {
				header: [],
				content: [],
				description: [],
				headerIcon: [],
				headerControls: []
			}, t = [];
			for (let r of n.default?.() ?? []) {
				let n = xu(r);
				if (!n || !r.children || typeof r.children != "object") {
					t.push(r);
					continue;
				}
				let i = r.children.default;
				i && (e[n] = i());
			}
			return e.content.length || (e.content = t), e;
		}), i = (e) => h({
			name: `Expander${e[0].toUpperCase()}${e.slice(1)}Outlet`,
			setup() {
				return () => _(t, r.value[e]);
			}
		}), a = i("header"), l = i("description"), u = i("headerIcon"), f = i("headerControls"), p = i("content"), g = o(() => r.value.header), v = o(() => r.value.description), y = o(() => r.value.headerIcon), x = o(() => r.value.headerControls), S = o(() => r.value.content);
		return (t, n) => (D(), s(mu, b(t.$attrs, {
			Header: e.Header,
			Content: e.Content,
			Description: e.Description,
			HeaderIcon: e.HeaderIcon,
			IsExpanded: e.IsExpanded,
			ExpandDirection: e.ExpandDirection,
			Padding: e.Padding,
			HorizontalContentAlignment: e.HorizontalContentAlignment,
			VerticalContentAlignment: e.VerticalContentAlignment,
			Width: e.Width,
			MinWidth: e.MinWidth,
			Height: e.Height,
			MaxWidth: e.MaxWidth,
			HorizontalAlignment: e.HorizontalAlignment,
			VerticalAlignment: e.VerticalAlignment,
			"onUpdate:IsExpanded": n[0] ||= (e) => t.$emit("update:IsExpanded", e),
			onExpanding: n[1] ||= (e) => t.$emit("Expanding", e),
			onCollapsed: n[2] ||= (e) => t.$emit("Collapsed", e)
		}), d({
			default: H(() => [S.value.length ? (D(), s(z(p), { key: 0 })) : c("", !0)]),
			_: 2
		}, [
			g.value.length ? {
				name: "Header",
				fn: H(() => [m(z(a))]),
				key: "0"
			} : void 0,
			v.value.length ? {
				name: "Description",
				fn: H(() => [m(z(l))]),
				key: "1"
			} : void 0,
			y.value.length ? {
				name: "HeaderIcon",
				fn: H(() => [m(z(u))]),
				key: "2"
			} : void 0,
			x.value.length ? {
				name: "HeaderControls",
				fn: H(() => [m(z(f))]),
				key: "3"
			} : void 0
		]), 1040, [
			"Header",
			"Content",
			"Description",
			"HeaderIcon",
			"IsExpanded",
			"ExpandDirection",
			"Padding",
			"HorizontalContentAlignment",
			"VerticalContentAlignment",
			"Width",
			"MinWidth",
			"Height",
			"MaxWidth",
			"HorizontalAlignment",
			"VerticalAlignment"
		]));
	}
}), Cu = ["aria-label"], wu = [
	"aria-label",
	"disabled",
	"onClick"
], Tu = { class: "swipe-item-content" }, Eu = {
	key: 1,
	class: "swipe-item-icon",
	"aria-hidden": "true"
}, Du = {
	key: 2,
	class: "swipe-item-text"
}, Ou = 68, ku = 60, Au = 100, ju = 10, Mu = 200, Nu = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "SwipeControl",
	props: {
		LeftItems: { default: void 0 },
		RightItems: { default: void 0 },
		TopItems: { default: void 0 },
		BottomItems: { default: void 0 },
		Background: { default: "transparent" },
		BorderBrush: { default: "transparent" },
		BorderThickness: { default: 0 },
		CornerRadius: { default: 0 },
		Padding: { default: 0 },
		Margin: { default: 0 },
		Width: { default: void 0 },
		Height: { default: void 0 },
		MinWidth: { default: 40 },
		MinHeight: { default: 40 },
		"AutomationProperties.Name": { default: "" }
	},
	emits: [
		"PointerEntered",
		"PointerExited",
		"ContextRequested"
	],
	setup(e, { expose: n, emit: r }) {
		let i = e, a = r, s = o(() => i["AutomationProperties.Name"]), d = (e) => a("ContextRequested", e), f = A(), p = A(), m = A(!1), h = A(!1), g = A(!1), _ = A(), v = A(), y = A(0), b = A(0), x, T = 0, E = 0, O = (e) => {
			if (e === void 0 || e === "") return;
			if (typeof e == "number") return `${e}px`;
			let t = e.trim();
			return t !== "" && !Number.isNaN(Number(t)) ? `${Number(t)}px` : t;
		}, k = (e) => {
			if (e === void 0 || e === "") return;
			if (typeof e == "number") return `${e}px`;
			let t = e.split(",").map((e) => O(e.trim()));
			if (t.length !== 4) return O(e) ?? e;
			let [n, r, i, a] = t;
			return `${r} ${i} ${a} ${n}`;
		}, N = o(() => !!(i.LeftItems?.Items.length || i.RightItems?.Items.length)), P = o(() => !!(i.TopItems?.Items.length || i.BottomItems?.Items.length)), F = o(() => ({
			width: O(i.Width),
			height: O(i.Height),
			minWidth: O(i.MinWidth),
			minHeight: O(i.MinHeight),
			margin: k(i.Margin),
			touchAction: N.value && P.value ? "none" : N.value ? "pan-y" : P.value ? "pan-x" : "auto"
		})), I = o(() => ({
			interacting: m.value,
			open: h.value,
			"threshold-reached": g.value
		})), R = o(() => ({
			transform: `translate3d(${y.value}px, ${b.value}px, 0)`,
			padding: k(i.Padding),
			borderColor: i.BorderBrush,
			borderWidth: k(i.BorderThickness),
			borderRadius: O(i.CornerRadius),
			background: i.Background
		})), z = o(() => v.value?.Mode ?? "Reveal"), te = o(() => !v.value || !_.value ? 0 : z.value === "Execute" ? _.value === "Left" || _.value === "Right" ? f.value?.clientWidth ?? 0 : f.value?.clientHeight ?? 0 : v.value.Items.length * (_.value === "Left" || _.value === "Right" ? Ou : ku)), ne = o(() => Math.abs(_.value === "Left" || _.value === "Right" ? y.value : b.value)), B = o(() => {
			let e = Math.max(0, ne.value), t = f.value?.clientWidth ?? 0, n = f.value?.clientHeight ?? 0, r = Math.max(0, t - e), i = Math.max(0, n - e);
			return { clipPath: _.value === "Left" ? `inset(0 ${r}px 0 0)` : _.value === "Right" ? `inset(0 0 0 ${r}px)` : _.value === "Top" ? `inset(0 0 ${i}px 0)` : `inset(${i}px 0 0 0)` };
		}), H = o(() => {
			if (!v.value || !_.value) return {};
			let e = _.value === "Left" || _.value === "Right", t = z.value === "Execute", n = v.value.Items[0], r;
			if (t) {
				let e = f.value?.clientWidth ?? 0, t = f.value?.clientHeight ?? 0;
				_.value === "Left" && (r = `translate3d(${(y.value - e) / 2}px, 0, 0)`), _.value === "Right" && (r = `translate3d(${(y.value + e) / 2}px, 0, 0)`), _.value === "Top" && (r = `translate3d(0, ${(b.value - t) / 2}px, 0)`), _.value === "Bottom" && (r = `translate3d(0, ${(b.value + t) / 2}px, 0)`);
			}
			return {
				width: e ? t ? "100%" : `${te.value}px` : "100%",
				height: e || t ? "100%" : `${te.value}px`,
				flexDirection: e ? "row" : "column",
				transform: r,
				background: t ? n?.Background ?? (g.value ? "var(--SwipeItemPostThresholdExecuteBackground, var(--accent-base))" : "var(--SwipeItemPreThresholdExecuteBackground, var(--ctrl-fill-tertiary))") : void 0
			};
		}), U = (e) => ({
			Left: i.LeftItems,
			Right: i.RightItems,
			Top: i.TopItems,
			Bottom: i.BottomItems
		})[e], W = (e) => {
			if (!e?.Items.length) return !1;
			if ((e.Mode ?? "Reveal") === "Execute" && e.Items.length > 1) throw Error("SwipeItems in Execute mode must contain exactly one SwipeItem.");
			return !0;
		};
		V(() => [
			i.LeftItems,
			i.RightItems,
			i.TopItems,
			i.BottomItems
		], ([e, t, n, r]) => {
			[
				e,
				t,
				n,
				r
			].forEach((e) => W(e));
			let i = !!(e?.Items.length || t?.Items.length), a = !!(n?.Items.length || r?.Items.length);
			if (i && a) throw Error("SwipeControl can't have both horizontal items and vertical items set at the same time.");
		}, {
			immediate: !0,
			deep: !0
		});
		let re = (e, t) => {
			if (!(Math.abs(e) < ju && Math.abs(t) < ju)) return Math.abs(e) >= Math.abs(t) ? e > 0 ? "Left" : "Right" : t > 0 ? "Top" : "Bottom";
		}, K = (e) => {
			let t = U(e);
			return W(t) ? (_.value = e, v.value = t, !0) : !1;
		}, q = () => Math.max(0, te.value), J = (e, t) => {
			if (!_.value) return;
			let n = q();
			_.value === "Left" && (y.value = Math.min(Math.max(0, e), n)), _.value === "Right" && (y.value = Math.max(Math.min(0, e), -n)), _.value === "Top" && (b.value = Math.min(Math.max(0, t), n)), _.value === "Bottom" && (b.value = Math.max(Math.min(0, t), -n));
			let r = Math.min(te.value, Au);
			g.value = ne.value > Math.max(0, r - 1);
		}, ie = (e) => {
			if (e.pointerType === "touch" && !(e.button !== 0 || x !== void 0)) {
				if (h.value) {
					ge(), e.preventDefault();
					return;
				}
				x = e.pointerId, T = e.clientX, E = e.clientY, m.value = !0, f.value?.setPointerCapture(e.pointerId);
			}
		}, Y = (e) => {
			if (!m.value || x !== e.pointerId) return;
			let t = e.clientX - T, n = e.clientY - E;
			if (!_.value) {
				let e = re(t, n);
				if (!e || !K(e)) return;
			}
			J(t, n), e.preventDefault();
		}, X = () => {
			let e = x;
			x = void 0, m.value = !1, e !== void 0 && f.value?.hasPointerCapture(e) && f.value.releasePointerCapture(e);
		}, Z = () => {
			_.value && (h.value = !0, _.value === "Left" && (y.value = te.value), _.value === "Right" && (y.value = -te.value), _.value === "Top" && (b.value = te.value), _.value === "Bottom" && (b.value = -te.value));
		}, ae = (e) => {
			if (x !== e.pointerId) return;
			let t = g.value && z.value === "Execute", n = g.value && z.value === "Reveal";
			X(), t && v.value ? he(v.value.Items[0]) : n ? Z() : ge();
		}, Q = (e) => {
			x === e.pointerId && (X(), ge());
		}, oe = (e) => {
			x === e.pointerId && (x = void 0, m.value = !1, ge());
		}, se = (e) => {
			if (typeof e == "object") return e.UriSource;
			if (typeof e == "string" && /^(?:https?:|data:|\/|\.\/|\.\.\/)/.test(e)) return e;
		}, ce = (e) => {
			let t = se(e);
			return t ? { "--swipe-item-bitmap-source": `url("${t}")` } : {};
		}, le = (e) => e.Text || e.Command?.Label || "", ue = (e) => e.IconSource ?? e.Command?.IconSource, de = {
			Accept: "",
			Add: "",
			Back: "",
			Cancel: "",
			Close: "",
			Copy: "",
			Cut: "",
			Delete: "",
			Edit: "",
			Favorite: "",
			Flag: "",
			FontDecrease: "",
			FontIncrease: "",
			Forward: "",
			OpenFile: "",
			Paste: "",
			Pause: "",
			Play: "",
			Redo: "",
			Save: "",
			SelectAll: "",
			Share: "",
			Stop: "",
			Undo: ""
		}, fe = (e) => typeof e == "object" ? e.Glyph ?? (e.Symbol ? de[e.Symbol] : void 0) : se(e) ? void 0 : e, $ = (e) => e.Command?.CanExecute?.(e.CommandParameter) ?? !0, pe = (e) => {
			let t = z.value === "Execute";
			return {
				background: t ? "transparent" : e.Background ?? "var(--SwipeItemBackground, var(--ctrl-fill-tertiary))",
				color: e.Foreground ?? (t ? g.value ? "var(--SwipeItemPostThresholdExecuteForeground, var(--accent-text))" : "var(--SwipeItemPreThresholdExecuteForeground, var(--ctrl-strong-fill))" : "var(--SwipeItemForeground, var(--text-primary))")
			};
		}, me = {
			Close: () => ge(),
			get Content() {
				return p.value;
			},
			get Element() {
				return f.value;
			}
		}, he = (e) => {
			$(e) && (e.Invoked?.(e, { SwipeControl: me }), e.Command?.Execute(e.CommandParameter), (e.BehaviorOnInvoked ?? "Auto") === "RemainOpen" ? Z() : ge());
		};
		function ge() {
			h.value = !1, g.value = !1, y.value = 0, b.value = 0, window.setTimeout(() => {
				h.value || m.value || (_.value = void 0, v.value = void 0);
			}, Mu);
		}
		let _e = () => z.value === "Execute" && v.value?.Items[0]?.BehaviorOnInvoked === "RemainOpen", ve = (e) => {
			h.value && !_e() && !f.value?.contains(e.target) && ge();
		};
		return ee(() => document.addEventListener("pointerdown", ve, !0)), w(() => document.removeEventListener("pointerdown", ve, !0)), n({ Close: ge }), (e, n) => (D(), l("div", {
			ref_key: "swipeControlRoot",
			ref: f,
			class: S(["win-swipe-control", I.value]),
			style: C(F.value),
			"aria-label": s.value || void 0,
			onPointerenter: n[1] ||= (e) => a("PointerEntered", e),
			onPointerleave: n[2] ||= (e) => a("PointerExited", e),
			onContextmenu: G(d, ["prevent"]),
			onPointerdown: ie,
			onPointermove: Y,
			onPointerup: ae,
			onPointercancel: Q,
			onLostpointercapture: oe
		}, [v.value ? (D(), l("div", {
			key: 0,
			class: S(["swipe-content-root", [`side-${_.value?.toLowerCase()}`, `mode-${z.value.toLowerCase()}`]]),
			style: C(B.value)
		}, [u("div", {
			class: "swipe-items-panel",
			style: C(H.value)
		}, [(D(!0), l(t, null, j(v.value.Items, (e, t) => (D(), l("button", {
			key: t,
			type: "button",
			class: "swipe-item",
			style: C(pe(e)),
			"aria-label": le(e) || s.value || void 0,
			disabled: !$(e),
			onPointerdown: n[0] ||= G(() => {}, ["stop"]),
			onClick: G((t) => he(e), ["stop"])
		}, [u("span", Tu, [se(ue(e)) ? (D(), l("span", {
			key: 0,
			class: "swipe-item-bitmap",
			style: C(ce(ue(e))),
			"aria-hidden": "true"
		}, null, 4)) : fe(ue(e)) ? (D(), l("span", Eu, L(fe(ue(e))), 1)) : c("", !0), le(e) ? (D(), l("span", Du, L(le(e)), 1)) : c("", !0)])], 44, wu))), 128))], 4)], 6)) : c("", !0), u("div", {
			ref_key: "contentRoot",
			ref: p,
			class: "swipe-control-content",
			style: C(R.value)
		}, [M(e.$slots, "default", {}, void 0, !0)], 4)], 46, Cu));
	}
}), [["__scopeId", "data-v-9cfe8b4c"]]), Pu = {
	key: 0,
	class: "win-case-content"
}, Fu = {
	__name: "Case",
	props: {
		Content: {
			type: [
				String,
				Number,
				Object,
				Array
			],
			default: null
		},
		Value: {
			type: [
				String,
				Number,
				Boolean,
				Object
			],
			default: null
		},
		IsDefault: {
			type: Boolean,
			default: !1
		}
	},
	setup(e, { expose: t }) {
		let n = e, r = v("win-switch-presenter", null), a = g(), u = o(() => $(n.Content, a)), d = r?.registerCase(() => ({
			Value: n.Value,
			IsDefault: n.IsDefault,
			Content: n.Content
		})), f = o(() => r ? r.isCaseActive(n.Value, n.IsDefault) : n.IsDefault), m = {
			enter: 400,
			leave: 200
		};
		return t({
			Content: o(() => n.Content),
			IsDefault: o(() => n.IsDefault),
			Value: o(() => n.Value)
		}), w(() => d?.()), (e, t) => (D(), s(i, {
			name: "win-switch-presenter-case",
			duration: m
		}, {
			default: H(() => [f.value ? (D(), l("div", Pu, [M(e.$slots, "default", {}, () => [p(L(u.value), 1)])])) : c("", !0)]),
			_: 3
		}));
	}
}, Iu = /*@__PURE__*/ Object.assign({ inheritAttrs: !1 }, {
	__name: "SwitchPresenter",
	props: {
		Value: {
			type: [
				String,
				Number,
				Boolean,
				Object
			],
			default: null
		},
		SwitchCases: {
			type: Array,
			default: () => []
		},
		TargetType: {
			type: [
				String,
				Object,
				Function
			],
			default: null
		}
	},
	setup(e, { expose: t }) {
		let n = e, r = A([]), i = 0, a = (e, t) => n.TargetType === String ? String(e) === String(t) : n.TargetType === Number ? Number(e) === Number(t) : Object.is(e, t) || String(e) === String(t), s = o(() => [...r.value.map((e) => e.get()), ...n.SwitchCases.map((e) => ({
			Value: e?.Value,
			IsDefault: e?.IsDefault === !0,
			Content: e?.Content
		}))]), c = o(() => {
			let e = s.value;
			return e.find((e) => a(e.Value, n.Value)) || e.find((e) => e.IsDefault) || null;
		});
		return O("win-switch-presenter", {
			isCaseActive: (e, t = !1) => a(e, n.Value) ? !0 : t && !c.value,
			registerCase: (e) => {
				let t = i++;
				return r.value = [...r.value, {
					id: t,
					get: e
				}], () => {
					r.value = r.value.filter((e) => e.id !== t);
				};
			},
			CurrentCase: c
		}), t({
			Value: o(() => n.Value),
			SwitchCases: o(() => n.SwitchCases),
			CurrentCase: c,
			TargetType: o(() => n.TargetType)
		}), w(() => {
			r.value = [];
		}), (e, t) => (D(), l("div", b({ class: "win-switch-presenter" }, e.$attrs), [M(e.$slots, "default")], 16));
	}
}), Lu = { class: "win-settings-card-surface" }, Ru = {
	key: 0,
	class: "win-settings-card-header"
}, zu = {
	key: 0,
	class: "win-settings-card-icon icon",
	"aria-hidden": "true"
}, Bu = ["innerHTML"], Vu = { class: "win-settings-card-text" }, Hu = { class: "win-settings-card-content" }, Uu = {
	key: 1,
	class: "win-settings-card-action-icon icon",
	"aria-hidden": "true"
}, Wu = ["innerHTML"], Gu = {
	__name: "SettingsCard",
	props: {
		Header: {
			type: [String, Number],
			default: ""
		},
		Description: {
			type: [String, Number],
			default: ""
		},
		HeaderIcon: {
			type: String,
			default: ""
		},
		ActionIcon: {
			type: String,
			default: ""
		},
		ActionIconToolTip: {
			type: String,
			default: ""
		},
		IsClickEnabled: {
			type: Boolean,
			default: !1
		},
		ContentAlignment: {
			type: String,
			default: "Right"
		},
		IsActionIconVisible: {
			type: Boolean,
			default: !0
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		Width: {
			type: [String, Number],
			default: ""
		}
	},
	emits: ["Click"],
	setup(e, { emit: n }) {
		let r = e, i = n, a = ne(), d = g(), f = o(() => $(r.Header, d)), m = o(() => $(r.Description, d)), h = o(() => $(r.HeaderIcon, d)), _ = o(() => $(r.ActionIcon, d)), v = o(() => !!h.value || !!a.HeaderIcon), y = o(() => !!f.value || !!m.value || v.value || !!a.Header || !!a.Description), x = o(() => String(h.value || "").trim().startsWith("<")), S = o(() => String(_.value || "").trim().startsWith("<")), C = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, w = o(() => {
			let e = {};
			return r.Height !== "" && (e.minHeight = C(r.Height)), r.Width !== "" && (e.width = C(r.Width)), e;
		}), ee = (e) => {
			r.IsClickEnabled && i("Click", e);
		};
		return (n, r) => (D(), s(P(e.IsClickEnabled ? "button" : "div"), b({
			class: ["win-settings-card", {
				clickable: e.IsClickEnabled,
				"content-left": e.ContentAlignment === "Left",
				"content-vertical": e.ContentAlignment === "Vertical",
				"has-header-content": y.value
			}],
			style: w.value,
			onClick: ee,
			type: e.IsClickEnabled ? "button" : void 0,
			role: e.IsClickEnabled ? void 0 : "group"
		}, e.ActionIconToolTip ? { "tooltipservice.tooltip": e.ActionIconToolTip } : {}), {
			default: H(() => [u("div", Lu, [
				e.ContentAlignment === "Left" ? c("", !0) : (D(), l("div", Ru, [v.value ? (D(), l("span", zu, [M(n.$slots, "HeaderIcon", {}, () => [x.value ? (D(), l("span", {
					key: 0,
					innerHTML: h.value
				}, null, 8, Bu)) : (D(), l(t, { key: 1 }, [p(L(h.value), 1)], 64))])])) : c("", !0), u("div", Vu, [M(n.$slots, "Header", {}, () => [f.value ? (D(), s(Rt, {
					key: 0,
					class: "win-settings-card-title",
					Text: f.value,
					FontSize: "14",
					LineHeight: "20",
					TextWrapping: "Wrap"
				}, null, 8, ["Text"])) : c("", !0)]), M(n.$slots, "Description", {}, () => [m.value ? (D(), s(Rt, {
					key: 0,
					class: "win-settings-card-desc",
					Text: m.value,
					FontSize: "var(--SettingsCardDescriptionFontSize, 12px)",
					LineHeight: "16",
					Foreground: "var(--TextFillColorSecondaryBrush, var(--text-secondary))",
					TextWrapping: "Wrap"
				}, null, 8, ["Text"])) : c("", !0)])])])),
				u("div", Hu, [M(n.$slots, "default")]),
				e.IsClickEnabled && e.IsActionIconVisible ? (D(), l("span", Uu, [M(n.$slots, "ActionIcon", {}, () => [S.value ? (D(), l("span", {
					key: 0,
					innerHTML: _.value
				}, null, 8, Wu)) : (D(), l(t, { key: 1 }, [p(L(_.value), 1)], 64))])])) : c("", !0)
			])]),
			_: 3
		}, 16, [
			"class",
			"style",
			"type",
			"role"
		]));
	}
}, Ku = ["tabindex"], qu = { class: "semantic-zoom-scroll-viewer" }, Ju = ["aria-hidden", "inert"], Yu = ["aria-hidden", "inert"], Xu = ["disabled", "aria-label"], Zu = 167, Qu = .9, $u = .6, ed = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "SemanticZoom",
	props: {
		ZoomedInView: {},
		ZoomedOutView: {},
		IsZoomedInViewActive: {
			type: Boolean,
			default: !0
		},
		CanChangeViews: {
			type: Boolean,
			default: !0
		},
		IsZoomOutButtonEnabled: {
			type: Boolean,
			default: !1
		},
		IsEnabled: {
			type: Boolean,
			default: !0
		},
		IsTabStop: {
			type: Boolean,
			default: !1
		},
		TabNavigation: { default: "Once" },
		Width: {},
		Height: {},
		Background: { default: "transparent" },
		BorderBrush: { default: "transparent" },
		BorderThickness: { default: 0 },
		Padding: { default: 0 },
		"ScrollViewer.HorizontalScrollMode": { default: "Disabled" },
		"ScrollViewer.IsHorizontalRailEnabled": {
			type: Boolean,
			default: !1
		},
		"ScrollViewer.VerticalScrollMode": { default: "Disabled" },
		"ScrollViewer.IsVerticalRailEnabled": {
			type: Boolean,
			default: !1
		},
		"ScrollViewer.ZoomMode": { default: "Disabled" }
	},
	emits: [
		"update:IsZoomedInViewActive",
		"ViewChangeStarted",
		"ViewChangeCompleted"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, { t: a } = rt(), d = A(), f = A(), p = A(), m = A(r.IsZoomedInViewActive), h = A(!1), g = A(!1), _ = A(null), v = /* @__PURE__ */ new Map(), y, b, ee = 0, T = 1, E = !0, O = !1, k = 0, j = [], N, F = Ao(), I = A(""), L = A(""), R = (e) => {
			if (e == null || e === "") return;
			if (typeof e == "number") return `${e}px`;
			let t = e.trim();
			return t !== "" && !Number.isNaN(Number(t)) ? `${Number(t)}px` : e;
		}, te = (e) => {
			if (e == null || e === "") return;
			if (typeof e == "number") return `${e}px`;
			let t = e.split(",").map((e) => R(e.trim()));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : e;
		}, ne = o(() => ({
			width: R(r.Width),
			height: R(r.Height),
			border: "0 solid transparent"
		})), B = o(() => ({
			background: r.Background,
			borderColor: r.BorderBrush,
			borderWidth: te(r.BorderThickness),
			borderStyle: "solid",
			padding: te(r.Padding)
		})), H = o(() => _.value ?? (m.value ? 1 : .5)), U = o(() => ({ transform: _.value === null ? "none" : `scale(${H.value})` })), W = o(() => ({ transform: _.value === null ? "none" : `scale(${H.value * 2})` })), G = o(() => _.value !== null && !h.value), re = () => typeof window < "u" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : Zu, K = (e, t = null) => {
			let n = d.value?.getBoundingClientRect(), r = e?.getBoundingClientRect();
			return {
				Item: t,
				Bounds: {
					X: r && n ? r.left - n.left : 0,
					Y: r && n ? r.top - n.top : 0,
					Width: r?.width ?? 0,
					Height: r?.height ?? 0
				}
			};
		}, q = (e, t) => ({
			IsSourceZoomedInView: e,
			SourceItem: K(t?.OriginalSource ?? (e ? f.value : p.value), t?.Item),
			DestinationItem: K(e ? p.value : f.value)
		}), J = () => {
			for (let e of j) e.cancel();
			j = [];
		}, ie = (e) => {
			if (re() === 0) return Promise.resolve();
			let t = e ? p.value : f.value, n = e ? f.value : p.value;
			if (!t || !n || typeof t.animate != "function") return Promise.resolve();
			let r = [...t.getAnimations(), ...n.getAnimations()];
			return j = r, Promise.all(r.map((e) => e.finished.catch(() => void 0))).then(() => void 0);
		}, Y = () => {
			y !== void 0 && window.clearTimeout(y), y = void 0, g.value = !1;
		}, X = (e, t) => {
			if (!r.CanChangeViews || e === m.value) return !1;
			if (h.value) return N = {
				targetIsZoomedInView: e,
				request: t
			}, !0;
			let n = q(m.value, t);
			J(), Y(), h.value = !0, _.value = null;
			let a = (e) => Lo(F, e);
			e ? (I.value = a(To), L.value = a(Eo)) : (I.value = a(Oo), L.value = a(Do)), i("ViewChangeStarted", n), m.value = e, i("update:IsZoomedInViewActive", e);
			let o = ++k;
			return x().then(() => ie(e)).then(() => {
				if (o !== k) return;
				J(), h.value = !1, I.value = "", L.value = "", i("ViewChangeCompleted", n);
				let e = N;
				N = void 0, e && e.targetIsZoomedInView !== m.value && X(e.targetIsZoomedInView, e.request);
			}), !0;
		}, Z = (e) => {
			X(!m.value, e);
		}, ae = (e) => {
			Z(e.detail), e.stopPropagation();
		}, Q = () => {
			!r.IsEnabled || !r.IsZoomOutButtonEnabled || !m.value || h.value || (g.value = !0, y !== void 0 && window.clearTimeout(y), y = window.setTimeout(Y, re() + 3e3));
		}, oe = () => {
			let e = [...v.values()];
			return e.length < 2 ? 0 : Math.hypot(e[0].x - e[1].x, e[0].y - e[1].y);
		}, se = () => {
			!r.IsEnabled || !r.CanChangeViews || r["ScrollViewer.ZoomMode"] === "Disabled" || h.value || v.size !== 2 || (ee = oe(), !(ee <= 0) && (E = m.value, T = E ? 1 : .5, _.value = T, O = !0));
		}, ce = (e) => {
			if (!O || ee <= 0) return;
			let t = Math.max(.5, Math.min(1, T * (oe() / ee)));
			_.value = t, e.preventDefault(), E && t < Qu ? (O = !1, X(!1)) : !E && t > $u && (O = !1, X(!0));
		}, le = () => {
			O && (O = !1, _.value = null, b !== void 0 && window.clearTimeout(b), b = window.setTimeout(() => {
				b = void 0;
			}, re()));
		}, ue = (e) => {
			e.pointerType === "touch" && (v.set(e.pointerId, {
				x: e.clientX,
				y: e.clientY
			}), d.value?.setPointerCapture?.(e.pointerId), v.size === 2 && se());
		}, de = (e) => {
			e.pointerType !== "touch" && Q(), v.has(e.pointerId) && (v.set(e.pointerId, {
				x: e.clientX,
				y: e.clientY
			}), v.size === 2 && ce(e));
		}, fe = (e) => {
			v.has(e.pointerId) && (v.delete(e.pointerId), d.value?.hasPointerCapture?.(e.pointerId) && d.value.releasePointerCapture(e.pointerId), v.size < 2 && le());
		}, $ = (e) => {
			if (!e.ctrlKey || !r.IsEnabled || !r.CanChangeViews || r["ScrollViewer.ZoomMode"] === "Disabled") return;
			let t = e.deltaY < 0;
			t !== m.value && X(t) && e.preventDefault();
		}, pe = (e) => {
			if (!e.ctrlKey || e.altKey || e.metaKey || !r.IsEnabled || !r.CanChangeViews) return;
			let t = e.key === "-" || e.key === "_" || e.code === "NumpadSubtract", n = e.key === "+" || e.key === "=" || e.code === "NumpadAdd";
			if (!t && !n) return;
			let i = n;
			i !== m.value && X(i) && (e.preventDefault(), e.stopPropagation());
		}, me = () => {
			r.IsEnabled && X(!1);
		};
		return V(() => r.IsZoomedInViewActive, (e) => {
			e !== m.value && X(e);
		}), V(() => r.CanChangeViews, (e) => {
			e && r.IsZoomedInViewActive !== m.value && X(r.IsZoomedInViewActive);
		}), V([
			() => r.IsZoomOutButtonEnabled,
			() => r.IsEnabled,
			m
		], ([e, t, n]) => {
			(!e || !t || !n) && Y();
		}), w(() => {
			k += 1, J(), Y(), b !== void 0 && window.clearTimeout(b), v.clear();
		}), t({ ToggleActiveView: Z }), (t, n) => (D(), l("div", {
			ref_key: "rootRef",
			ref: d,
			class: S(["win-semantic-zoom", {
				"zoomed-in": m.value,
				"zoomed-out": !m.value,
				"is-changing-view": h.value,
				"is-manipulating": G.value,
				"is-disabled": !e.IsEnabled
			}]),
			style: C(ne.value),
			tabindex: e.IsEnabled && e.IsTabStop ? 0 : -1,
			onKeydown: pe,
			onPointerdown: ue,
			onPointermove: de,
			onPointerup: fe,
			onPointercancel: fe,
			onSemanticzoomrequest: ae,
			onWheel: $
		}, [u("div", qu, [u("div", {
			class: "semantic-zoom-surface",
			style: C(B.value)
		}, [u("div", {
			ref_key: "zoomedInPresenterRef",
			ref: f,
			class: S(["semantic-zoom-presenter zoomed-in-presenter", I.value]),
			style: C(U.value),
			"aria-hidden": !m.value,
			inert: m.value ? void 0 : !0
		}, [M(t.$slots, "zoomedInView", {}, () => [e.ZoomedInView ? (D(), s(P(e.ZoomedInView), { key: 0 })) : c("", !0)], !0)], 14, Ju), u("div", {
			ref_key: "zoomedOutPresenterRef",
			ref: p,
			class: S(["semantic-zoom-presenter zoomed-out-presenter", L.value]),
			style: C(W.value),
			"aria-hidden": m.value,
			inert: m.value ? !0 : void 0
		}, [M(t.$slots, "zoomedOutView", {}, () => [e.ZoomedOutView ? (D(), s(P(e.ZoomedOutView), { key: 0 })) : c("", !0)], !0)], 14, Yu)], 4)]), e.IsZoomOutButtonEnabled && g.value ? (D(), l("button", {
			key: 0,
			class: S(["zoom-out-button", { visible: g.value }]),
			type: "button",
			tabindex: "-1",
			disabled: !e.IsEnabled,
			"aria-label": z(a)("text.zoom-out"),
			onClick: me
		}, [...n[0] ||= [u("span", { "aria-hidden": "true" }, "", -1)]], 10, Xu)) : c("", !0)], 46, Ku));
	}
}), [["__scopeId", "data-v-9da232ad"]]);
//#endregion
//#region src/components/titleBarDragRegion.ts
function td(e, t) {
	e && (t === !0 || t === !1 ? e.setAttribute("IsDragRegion", String(t)) : e.removeAttribute("IsDragRegion"));
}
function nd(e) {
	if (!e || typeof e.getAttribute != "function") return null;
	let t = e.getAttribute("IsDragRegion");
	return t === null ? null : t === "true" ? !0 : t === "false" ? !1 : null;
}
function rd(e) {
	e && e.removeAttribute("IsDragRegion");
}
//#endregion
//#region src/components/TitleBar.vue
var id = ["disabled", "aria-label"], ad = ["aria-label"], od = {
	key: 3,
	class: "win-titlebar-icon",
	"aria-hidden": "true"
}, sd = ["src"], cd = 32, ld = 480, ud = /*#__PURE__*/ dt({
	__name: "TitleBar",
	props: {
		Title: {
			type: String,
			default: ""
		},
		Subtitle: {
			type: String,
			default: ""
		},
		IconSource: {
			type: [String, Object],
			default: null
		},
		IsBackButtonVisible: {
			type: Boolean,
			default: !1
		},
		IsBackButtonEnabled: {
			type: Boolean,
			default: !0
		},
		IsPaneToggleButtonVisible: {
			type: Boolean,
			default: !1
		},
		PreferredHeightOption: {
			type: String,
			default: "Default"
		},
		AutoRefreshDragRegions: {
			type: Boolean,
			default: !1
		},
		TitleBarContentHorizontalAlignment: {
			type: String,
			default: "Center"
		},
		TitleBarContentVerticalAlignment: {
			type: String,
			default: "Center"
		},
		TitleBarLeftHeaderHorizontalAlignment: {
			type: String,
			default: "Left"
		},
		TitleBarLeftHeaderVerticalAlignment: {
			type: String,
			default: "Center"
		},
		TitleBarRightHeaderHorizontalAlignment: {
			type: String,
			default: "Right"
		},
		TitleBarRightHeaderVerticalAlignment: {
			type: String,
			default: "Center"
		},
		Background: {
			type: String,
			default: ""
		},
		Foreground: {
			type: String,
			default: ""
		},
		Width: {
			type: [String, Number],
			default: ""
		},
		Height: {
			type: [String, Number],
			default: ""
		},
		MinWidth: {
			type: [String, Number],
			default: ""
		},
		MinHeight: {
			type: [String, Number],
			default: ""
		},
		MaxWidth: {
			type: [String, Number],
			default: ""
		},
		MaxHeight: {
			type: [String, Number],
			default: ""
		},
		Margin: {
			type: [String, Number],
			default: ""
		},
		HorizontalAlignment: {
			type: String,
			default: ""
		},
		VerticalAlignment: {
			type: String,
			default: ""
		}
	},
	emits: ["BackRequested", "PaneToggleRequested"],
	setup(e, { expose: t, emit: n }) {
		let { t: r } = rt(), i = ne(), a = e, d = n, f = A(null), p = A(null), m = A(!1), h = A(!1), g = A(!1), _ = A(0), v = 0, y = 240, T = "", E = "", O = null, k = null, j = null, N = null, P = o(() => !!(i.Content || i.default)), F = o(() => a.PreferredHeightOption === "Tall"), I = o(() => F.value || P.value || !!(i.LeftHeader || i.RightHeader)), R = o(() => a.Title !== ""), te = o(() => a.Subtitle !== ""), B = o(() => a.IsBackButtonVisible !== a.IsPaneToggleButtonVisible), H = o(() => ({
			"is-expanded-height": I.value,
			"is-compact-height": !I.value,
			"is-compact": h.value,
			"is-deactivated": m.value,
			"is-narrow": g.value,
			"is-negative-inset-spacing": B.value
		})), U = (e) => e === "" || e == null ? "" : typeof e == "string" && e.trim() !== "" && !Number.isNaN(Number(e.trim())) ? `${Number(e.trim())}px` : typeof e == "number" ? `${e}px` : e, W = (e) => {
			if (e === "" || e == null) return "";
			let t = String(e).split(",").map((e) => U(e.trim()));
			return t.length === 1 ? t[0] : t.length === 2 ? `${t[1]} ${t[0]}` : t.length === 4 ? `${t[1]} ${t[2]} ${t[3]} ${t[0]}` : String(e);
		}, G = (e) => ({
			Left: "start",
			Center: "center",
			Right: "end",
			Stretch: "stretch"
		})[e] ?? "center", re = (e) => ({
			Top: "start",
			Center: "center",
			Bottom: "end",
			Stretch: "stretch"
		})[e] ?? "center", K = (e) => ({
			Left: "flex-start",
			Center: "center",
			Right: "flex-end"
		})[e] ?? "center", q = o(() => {
			let e = {};
			return a.Width !== "" && (e.width = U(a.Width)), a.Height !== "" && (e.height = U(a.Height)), a.MinWidth !== "" && (e.minWidth = U(a.MinWidth)), a.MinHeight !== "" && (e.minHeight = U(a.MinHeight)), a.MaxWidth !== "" && (e.maxWidth = U(a.MaxWidth)), a.MaxHeight !== "" && (e.maxHeight = U(a.MaxHeight)), a.Margin !== "" && (e.margin = W(a.Margin)), a.HorizontalAlignment !== "" && (e.justifySelf = G(a.HorizontalAlignment)), a.VerticalAlignment !== "" && (e.alignSelf = re(a.VerticalAlignment)), a.Background !== "" && (e.background = a.Background), a.Foreground !== "" && (e.color = a.Foreground, e["--TitleBarForegroundBrush"] = a.Foreground), e;
		}), J = o(() => ({
			justifySelf: G(a.TitleBarLeftHeaderHorizontalAlignment),
			alignSelf: re(a.TitleBarLeftHeaderVerticalAlignment)
		})), ie = o(() => ({
			justifySelf: G(a.TitleBarRightHeaderHorizontalAlignment),
			alignSelf: re(a.TitleBarRightHeaderVerticalAlignment)
		})), Y = o(() => a.TitleBarContentHorizontalAlignment === "Stretch"), X = o(() => {
			let e = { alignItems: re(a.TitleBarContentVerticalAlignment) };
			return h.value ? (e.justifyContent = "flex-start", e.padding = "var(--TitleBarCompactContentMargin)") : e.justifyContent = K(a.TitleBarContentHorizontalAlignment), e;
		}), Z = (e) => {
			let t = String(e ?? "");
			return /^(data:|blob:|https?:|\/)/i.test(t) || /\.(png|jpe?g|gif|svg|ico|webp|bmp)([?#]|$)/i.test(t);
		}, ae = (e) => {
			let t = String(e ?? "");
			return t.startsWith("\\u") ? String.fromCodePoint(Number.parseInt(t.slice(2), 16)) : t.startsWith("&#x") && t.endsWith(";") ? String.fromCodePoint(Number.parseInt(t.slice(3, -1), 16)) : t.startsWith("0x") || /^[0-9A-Fa-f]{4,5}$/.test(t) ? String.fromCodePoint(Number.parseInt(t, 16)) : t;
		}, Q = {
			Accept: "",
			Cancel: "",
			Home: "",
			Refresh: "",
			Find: "",
			Settings: "",
			Favorite: ""
		}, oe = o(() => a.IconSource && typeof a.IconSource == "object" ? a.IconSource : null), se = o(() => {
			if (!a.IconSource) return null;
			if (typeof a.IconSource == "string") return Z(a.IconSource) ? "image" : "glyph";
			let e = oe.value;
			return e?.ImageSource || e?.UriSource || e?.Source || e?.src ? "image" : e?.Glyph !== void 0 || e?.Symbol !== void 0 ? "glyph" : null;
		}), ce = o(() => {
			if (typeof a.IconSource == "string") return a.IconSource;
			let e = oe.value;
			return e?.ImageSource ?? e?.UriSource ?? e?.Source ?? e?.src ?? "";
		}), le = o(() => {
			let e = oe.value;
			return typeof a.IconSource == "string" ? ae(a.IconSource) : e?.Glyph === void 0 ? e?.Symbol === void 0 ? "" : Q[e.Symbol] ?? String(e.Symbol) : ae(e.Glyph);
		}), ue = o(() => ({
			fontFamily: oe.value?.FontFamily || "WinUIonWebIcons",
			fontSize: oe.value?.FontSize === void 0 ? "16px" : U(oe.value.FontSize),
			color: oe.value?.Foreground || ""
		})), de = () => {
			a.Title !== "" && document.title !== a.Title && (E = a.Title, document.title = a.Title);
		}, fe = () => {
			E && document.title === E && (document.title = T), E = "";
		}, $ = () => {
			let e = f.value, t = p.value;
			if (!e || !t) return;
			let n = t.firstElementChild;
			if (n) {
				let e = n.getBoundingClientRect().width;
				e > y && (y = e);
			}
			let r = t.clientWidth, i = e.getBoundingClientRect().width;
			g.value = i < ld;
			let a = r < y - 1;
			h.value ? i >= v + cd && (v = 0, h.value = !1) : a && !v && (v = i, h.value = !0);
		}, pe = () => {
			N &&= (N.disconnect(), null);
		}, me = () => {
			pe();
			let e = p.value;
			e && (N = new MutationObserver(() => {
				$(), a.AutoRefreshDragRegions ? he() : pe();
			}), N.observe(e, {
				childList: !0,
				subtree: !0,
				attributes: !0,
				characterData: !0
			}));
		}, he = () => {
			let e = f.value;
			e && (e.querySelectorAll("[IsDragRegion]").forEach((e) => {
				let t = e.getAttribute("IsDragRegion");
				t !== "true" && t !== "false" && e.removeAttribute("IsDragRegion");
			}), e.getBoundingClientRect(), _.value += 1, $());
		}, ge = () => {
			m.value = !1;
		}, _e = () => {
			m.value = !0;
		}, ve = A(""), ye = A(""), be = !1, xe = !1, Se = !1, Ce = !1, we = () => {
			be = !0, xe = !1, ve.value = "pressing";
		}, Te = () => {
			be && (be = !1, xe && (ve.value = "releasing"));
		}, Ee = () => {
			be && (be = !1, xe && (ve.value = "releasing"));
		}, De = (e) => {
			ve.value === "pressing" && e.animationName === "animated-icon-back-press" ? (xe = !0, be || (ve.value = "releasing")) : ve.value === "releasing" && e.animationName === "animated-icon-back-release" && (ve.value = "", xe = !1);
		}, Oe = () => {
			be = !1, xe = !1, ve.value = "";
		}, ke = () => {
			Se = !0, Ce = !1, ye.value = "pressing";
		}, Ae = () => {
			Se && (Se = !1, Ce && (ye.value = "releasing"));
		}, je = () => {
			Se && (Se = !1, Ce && (ye.value = "releasing"));
		}, Me = (e) => {
			ye.value === "pressing" && e.animationName === "hamburger-press" ? (Ce = !0, Se || (ye.value = "releasing")) : ye.value === "releasing" && e.animationName === "hamburger-release" && (ye.value = "", Ce = !1);
		};
		return ee(async () => {
			m.value = !document.hasFocus(), T = document.title, de(), O = ge, k = _e, window.addEventListener("focus", O), window.addEventListener("blur", k), await x(), $(), p.value && me(), typeof ResizeObserver < "u" && (j = new ResizeObserver(() => $()), f.value && j.observe(f.value));
		}), w(() => {
			O && window.removeEventListener("focus", O), k && window.removeEventListener("blur", k), j && j.disconnect(), pe(), fe();
		}), V(() => a.Title, (e, t) => {
			t !== "" && e === "" ? fe() : de();
		}), V(() => a.IsBackButtonVisible, (e) => {
			e || Oe();
		}, { flush: "sync" }), V(() => a.AutoRefreshDragRegions, (e) => {
			e && p.value ? me() : pe();
		}), V(P, (e) => {
			e ? x(() => {
				$(), me();
			}) : pe();
		}), t({
			RecomputeDragRegions: he,
			isCompact: h,
			isNarrow: g,
			setIsDragRegion: td,
			getIsDragRegion: nd,
			clearIsDragRegion: rd
		}), (t, n) => (D(), l("div", {
			ref_key: "rootRef",
			ref: f,
			class: S(["win-titlebar", H.value]),
			style: C(q.value)
		}, [
			n[2] ||= u("div", {
				class: "win-titlebar-left-padding",
				"aria-hidden": "true"
			}, null, -1),
			e.IsBackButtonVisible ? (D(), l("button", b({
				key: 0,
				class: "win-titlebar-back-button",
				type: "button",
				disabled: !e.IsBackButtonEnabled,
				"aria-label": z(r)("text.back")
			}, { "tooltipservice.tooltip": z(r)("text.back") }, {
				onMousedown: we,
				onMouseup: Te,
				onMouseleave: Ee,
				onClick: n[0] ||= (e) => d("BackRequested")
			}), [u("span", {
				class: S(["icon animated-icon animated-icon-back", ve.value]),
				"aria-hidden": "true",
				onAnimationend: De
			}, "", 34)], 16, id)) : c("", !0),
			e.IsPaneToggleButtonVisible ? (D(), l("button", b({
				key: 1,
				class: "win-titlebar-pane-toggle-button",
				type: "button",
				"data-nav-pane-toggle": "",
				"aria-label": z(r)("text.navigation-menu")
			}, { "tooltipservice.tooltip": z(r)("text.navigation-menu") }, {
				onMousedown: ke,
				onMouseup: Ae,
				onMouseleave: je,
				onClick: n[1] ||= (e) => d("PaneToggleRequested")
			}), [u("span", {
				class: S(["icon animated-icon animated-icon-hamburger", ye.value]),
				"aria-hidden": "true",
				onAnimationend: Me
			}, "", 34)], 16, ad)) : c("", !0),
			t.$slots.LeftHeader ? (D(), l("div", {
				key: 2,
				class: "win-titlebar-left-header",
				style: C(J.value)
			}, [M(t.$slots, "LeftHeader", {}, void 0, !0)], 4)) : c("", !0),
			n[3] ||= u("div", {
				class: "win-titlebar-left-header-padding",
				"aria-hidden": "true"
			}, null, -1),
			se.value ? (D(), l("div", od, [se.value === "image" ? (D(), l("img", {
				key: 0,
				src: ce.value,
				alt: ""
			}, null, 8, sd)) : (D(), l("span", {
				key: 1,
				class: "win-titlebar-icon-glyph",
				style: C(ue.value)
			}, L(le.value), 5))])) : c("", !0),
			R.value ? (D(), s(Rt, {
				key: 4,
				class: "win-titlebar-title",
				Text: e.Title,
				TextTrimming: "CharacterEllipsis",
				TextWrapping: "NoWrap"
			}, null, 8, ["Text"])) : c("", !0),
			te.value ? (D(), s(Rt, {
				key: 5,
				class: "win-titlebar-subtitle",
				Text: e.Subtitle,
				TextTrimming: "CharacterEllipsis",
				TextWrapping: "NoWrap"
			}, null, 8, ["Text"])) : c("", !0),
			P.value ? (D(), l("div", {
				key: 6,
				ref_key: "contentAreaRef",
				ref: p,
				class: S(["win-titlebar-content", {
					"is-compact": h.value,
					"is-content-stretch": Y.value
				}]),
				style: C(X.value)
			}, [M(t.$slots, "Content", {}, () => [M(t.$slots, "default", {}, void 0, !0)], !0)], 6)) : c("", !0),
			t.$slots.RightHeader ? (D(), l("div", {
				key: 7,
				class: "win-titlebar-right-header",
				style: C(ie.value)
			}, [M(t.$slots, "RightHeader", {}, void 0, !0)], 4)) : c("", !0),
			n[4] ||= u("div", {
				class: "win-titlebar-min-drag-region",
				"aria-hidden": "true"
			}, null, -1),
			n[5] ||= u("div", {
				class: "win-titlebar-right-padding",
				"aria-hidden": "true"
			}, null, -1)
		], 6));
	}
}, [["__scopeId", "data-v-d1762191"]]), dd = { class: "row-content" }, fd = { class: "example-cell" }, pd = { class: "font-cell" }, md = { class: "cell-text" }, hd = { class: "size-cell" }, gd = { class: "cell-text" }, _d = { class: "style-cell" }, vd = { class: "resource-text" }, yd = ["aria-label"], bd = /*#__PURE__*/ dt({
	__name: "TypographyRow",
	props: {
		example: {
			type: String,
			required: !0
		},
		variableFont: {
			type: String,
			required: !0
		},
		sizeLineHeight: {
			type: String,
			required: !0
		},
		resourceName: {
			type: String,
			required: !0
		},
		styleClass: {
			type: String,
			required: !0
		},
		background: {
			type: Boolean,
			default: !1
		}
	},
	setup(e) {
		let t = e, n = async () => {
			try {
				await navigator.clipboard.writeText(t.resourceName);
			} catch (e) {
				console.error("Failed to copy:", e);
			}
		};
		return (t, r) => (D(), l("div", { class: S(["typography-row", { "has-background": e.background }]) }, [u("div", dd, [
			u("div", fd, [u("span", { class: S(["example-text", e.styleClass]) }, L(e.example), 3)]),
			u("div", pd, [u("span", md, L(e.variableFont), 1)]),
			u("div", hd, [u("span", gd, L(e.sizeLineHeight), 1)]),
			u("div", _d, [u("span", vd, L(e.resourceName), 1), u("button", b({
				class: "copy-button",
				"aria-label": `Copy ${e.resourceName}`
			}, { "tooltipservice.tooltip": `Copy ${e.resourceName}` }, { onClick: n }), [...r[0] ||= [u("span", { class: "icon" }, "📋", -1)]], 16, yd)])
		])], 2));
	}
}, [["__scopeId", "data-v-a3c3325e"]]), xd = { class: "page-header-actions" }, Sd = { class: "icon" }, Cd = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "PageHeader",
	props: {
		isFavorite: {
			type: Boolean,
			default: !1
		},
		currentTheme: { default: "system" },
		showFavoriteButton: {
			type: Boolean,
			default: !0
		},
		showThemeButton: {
			type: Boolean,
			default: !0
		}
	},
	emits: ["theme-toggle", "favorite-toggle"],
	setup(e, { emit: t }) {
		let n = e, r = o(() => {
			let e = n.currentTheme;
			return e === "light" ? "Switch to dark theme" : e === "dark" ? "Switch to system theme" : "Switch to light theme";
		});
		return (t, n) => (D(), l("div", xd, [e.showThemeButton ? (D(), s(Kn, b({
			key: 0,
			class: "header-action"
		}, { "tooltipservice.tooltip": r.value }, { onClick: n[0] ||= (e) => t.$emit("theme-toggle") }), {
			default: H(() => [...n[2] ||= [u("span", { class: "icon" }, "", -1)]]),
			_: 1
		}, 16)) : c("", !0), e.showFavoriteButton ? (D(), s(qn, b({
			key: 1,
			class: "header-action",
			IsChecked: e.isFavorite
		}, { "tooltipservice.tooltip": e.isFavorite ? "Remove from favorites" : "Add to favorites" }, { "onUpdate:IsChecked": n[1] ||= (e) => t.$emit("favorite-toggle") }), {
			default: H(() => [u("span", Sd, L(e.isFavorite ? "" : ""), 1)]),
			_: 1
		}, 16, ["IsChecked"])) : c("", !0)]));
	}
}), [["__scopeId", "data-v-47560510"]]), wd = ["data-theme"], Td = /* @__PURE__ */ h({
	__name: "ThemeWrapper",
	props: { theme: {} },
	setup(e) {
		let t = e, n = o(() => {
			if (!t.theme || t.theme === "system") {
				let e = document.documentElement;
				return e.classList.contains("theme-dark") ? "dark" : e.classList.contains("theme-light") ? "light" : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			}
			return t.theme;
		}), r = o(() => `theme-${n.value}`);
		return O("winuiTheme", n), (e, t) => (D(), l("div", {
			class: S(["example-theme-wrapper", r.value]),
			"data-theme": n.value
		}, [M(e.$slots, "default")], 10, wd));
	}
}), Ed = { class: "control-example-root" }, Dd = { class: "control-example-frame" }, Od = ["data-theme"], kd = {
	key: 0,
	class: "example-output"
}, Ad = {
	key: 1,
	class: "example-options"
}, jd = { class: "source-code-presenter" }, Md = { class: "sample-code-presenter" }, Nd = { class: "code-content" }, Pd = { class: "copy-button-border" }, Fd = /*#__PURE__*/ dt(/* @__PURE__ */ h({
	__name: "ControlExampleBase",
	props: {
		headerText: {
			type: String,
			default: ""
		},
		exampleHeight: {
			type: [String, Number],
			default: "auto"
		},
		webViewHeight: {
			type: Number,
			default: 400
		},
		webViewWidth: {
			type: Number,
			default: 800
		},
		HorizontalContentAlignment: {
			type: String,
			default: "Left"
		},
		sourceCodeVisibility: {
			type: [Boolean, String],
			default: !0
		},
		theme: {
			type: String,
			default: "light"
		},
		options: {
			type: [
				String,
				Number,
				Boolean,
				Object
			],
			default: null
		},
		xaml: {
			type: String,
			default: ""
		},
		cSharp: {
			type: String,
			default: ""
		},
		vue: {
			type: String,
			default: ""
		},
		xamlSource: {
			type: String,
			default: ""
		},
		cSharpSource: {
			type: String,
			default: ""
		},
		sampleDefinition: {
			type: String,
			default: ""
		},
		substitutions: {
			type: Array,
			default: () => []
		}
	},
	setup(e) {
		let { t } = rt(), n = e, r = o(() => n.theme), i = A(0), a = ne(), d = (e) => (a[e]?.() ?? []).some((e) => typeof e.children == "string" ? e.children.trim().length > 0 : e.children !== null || e.shapeFlag > 1), f = (e) => {
			if (!(e === "auto" || e == null || e === "")) return typeof e == "number" ? `${e}px` : String(e);
		}, h = o(() => {
			let e = [];
			return n.vue && e.push({
				text: t("text.vue"),
				code: n.vue
			}), (n.xaml || n.xamlSource) && e.push({
				text: t("text.xaml"),
				code: n.xaml || n.xamlSource
			}), (n.cSharp || n.cSharpSource) && e.push({
				text: t("text.c"),
				code: n.cSharp || n.cSharpSource
			}), e;
		}), g = o(() => h.value.map(({ text: e }) => ({ Text: e }))), _ = o(() => h.value[i.value]?.code ?? ""), v = o(() => n.sourceCodeVisibility !== !1 && n.sourceCodeVisibility !== "Collapsed" && h.value.length > 0), y = o(() => n.options !== null || d("options")), x = o(() => d("output"));
		V(h, (e) => {
			i.value >= e.length && (i.value = 0);
		});
		let w = o(() => ({
			height: f(n.exampleHeight),
			width: "100%",
			justifyContent: {
				Left: "flex-start",
				Center: "center",
				Right: "flex-end",
				Stretch: "stretch"
			}[n.HorizontalContentAlignment] ?? "flex-start",
			alignItems: "flex-start"
		})), ee = (e) => {
			let t = e?.Items?.indexOf(e?.SelectedItem) ?? 0;
			i.value = Math.max(0, t);
		}, T = async () => {
			_.value && await navigator.clipboard?.writeText(_.value);
		};
		return (n, a) => (D(), l("section", Ed, [e.headerText ? (D(), s(Rt, {
			key: 0,
			class: "control-example-header",
			Text: e.headerText,
			FontSize: "14",
			FontWeight: "600",
			LineHeight: "20",
			Margin: "0,12"
		}, null, 8, ["Text"])) : c("", !0), u("div", Dd, [m(Td, { theme: r.value }, {
			default: H(() => [u("div", { class: S(["example-container", {
				"has-output": x.value,
				"has-options": y.value
			}]) }, [
				u("div", {
					class: "example-display",
					"data-theme": e.theme,
					style: C(w.value)
				}, [M(n.$slots, "example", {}, () => [M(n.$slots, "default", {}, void 0, !0)], !0)], 12, Od),
				x.value ? (D(), l("aside", kd, [m(Rt, { Text: z(t)("sample.menubar.output") }, null, 8, ["Text"]), M(n.$slots, "output", {}, void 0, !0)])) : c("", !0),
				y.value ? (D(), l("aside", Ad, [M(n.$slots, "options", {}, () => [p(L(e.options), 1)], !0)])) : c("", !0)
			], 2)]),
			_: 3
		}, 8, ["theme"]), v.value ? (D(), s(Su, {
			key: 0,
			IsExpanded: !1,
			Header: z(t)("text.source-code"),
			Padding: "0",
			class: "code-expander"
		}, {
			default: H(() => [u("div", jd, [m(mc, {
				Items: g.value,
				SelectedItem: g.value[i.value],
				onSelectionChanged: ee
			}, null, 8, ["Items", "SelectedItem"]), u("div", Md, [m(Ft, {
				class: "source-code-scroll",
				VerticalScrollMode: "Auto",
				VerticalScrollBarVisibility: "Auto",
				HorizontalScrollMode: "Auto",
				HorizontalScrollBarVisibility: "Auto"
			}, {
				default: H(() => [u("div", Nd, [m(Rt, {
					class: "code-block",
					Text: _.value,
					IsTextSelectionEnabled: ""
				}, null, 8, ["Text"])])]),
				_: 1
			}), u("div", Pd, [m(Kn, b({
				class: "copy-code-button",
				Width: "30",
				Height: "30",
				MinWidth: "0",
				MinHeight: "0",
				Padding: "6"
			}, { "tooltipservice.tooltip": z(t)("text.copy") }, { onClick: T }), {
				default: H(() => [m(Rt, {
					class: "icon",
					Text: "",
					FontSize: "16",
					LineHeight: "16"
				})]),
				_: 1
			}, 16)])])])]),
			_: 1
		}, 8, ["Header"])) : c("", !0)])]));
	}
}), [["__scopeId", "data-v-b27479e5"]]), Id = (e) => h({
	name: `ControlExample.${e[0].toUpperCase()}${e.slice(1)}`,
	__controlExampleProperty: e,
	setup(e, { slots: t }) {
		return () => _("span", { class: "control-example-property" }, t.default?.());
	}
}), Ld = Id("example"), Rd = Id("output"), zd = Id("options"), Bd = (e) => e.type?.__controlExampleProperty, Vd = /* @__PURE__ */ h({
	Example: Ld,
	Output: Rd,
	Options: zd,
	inheritAttrs: !1,
	__name: "ControlExample",
	props: {
		HeaderText: {
			type: String,
			default: ""
		},
		ExampleHeight: {
			type: [String, Number],
			default: "auto"
		},
		WebViewHeight: {
			type: Number,
			default: 400
		},
		WebViewWidth: {
			type: Number,
			default: 800
		},
		HorizontalContentAlignment: {
			type: String,
			default: "Left"
		},
		SourceCodeVisibility: {
			type: [Boolean, String],
			default: !0
		},
		Theme: {
			type: String,
			default: "light"
		},
		Options: {
			type: [
				String,
				Number,
				Boolean,
				Object
			],
			default: null
		},
		Xaml: {
			type: String,
			default: ""
		},
		CSharp: {
			type: String,
			default: ""
		},
		Vue: {
			type: String,
			default: ""
		},
		XamlSource: {
			type: String,
			default: ""
		},
		CSharpSource: {
			type: String,
			default: ""
		},
		SampleDefinition: {
			type: String,
			default: ""
		},
		Substitutions: {
			type: Array,
			default: () => []
		}
	},
	setup(e) {
		let n = ne(), r = g();
		O(K, F({}));
		let i = (e) => $(e, r), a = o(() => {
			let e = {
				example: [],
				output: [],
				options: []
			}, i = [], a = (n) => {
				for (let o of n) {
					if (o?.type === t && Array.isArray(o.children)) {
						a(o.children);
						continue;
					}
					let n = Bd(o);
					if (!n) {
						i.push(o);
						continue;
					}
					if (!o.children || typeof o.children != "object") continue;
					let s = o.children.default;
					s && (e[n] = ve(s(), r));
				}
			};
			return a(n.default?.() ?? []), e.example.length || (e.example = ve(i, r)), e;
		}), c = (e) => h({
			name: `ControlExample${e[0].toUpperCase()}${e.slice(1)}Outlet`,
			setup() {
				return () => _(t, a.value[e]);
			}
		}), l = c("example"), u = c("output"), f = c("options"), p = o(() => a.value.output.length > 0), v = o(() => a.value.options.length > 0);
		return (t, n) => (D(), s(Fd, b(t.$attrs, {
			headerText: i(e.HeaderText),
			exampleHeight: i(e.ExampleHeight),
			webViewHeight: i(e.WebViewHeight),
			webViewWidth: i(e.WebViewWidth),
			HorizontalContentAlignment: i(e.HorizontalContentAlignment),
			sourceCodeVisibility: i(e.SourceCodeVisibility),
			theme: i(e.Theme),
			options: i(e.Options),
			xaml: i(e.Xaml),
			cSharp: i(e.CSharp),
			vue: i(e.Vue),
			xamlSource: i(e.XamlSource),
			cSharpSource: i(e.CSharpSource),
			sampleDefinition: i(e.SampleDefinition),
			substitutions: i(e.Substitutions)
		}), d({
			example: H(() => [m(z(l))]),
			_: 2
		}, [p.value ? {
			name: "output",
			fn: H(() => [m(z(u))]),
			key: "0"
		} : void 0, v.value ? {
			name: "options",
			fn: H(() => [m(z(f))]),
			key: "1"
		} : void 0]), 1040, [
			"headerText",
			"exampleHeight",
			"webViewHeight",
			"webViewWidth",
			"HorizontalContentAlignment",
			"sourceCodeVisibility",
			"theme",
			"options",
			"xaml",
			"cSharp",
			"vue",
			"xamlSource",
			"cSharpSource",
			"sampleDefinition",
			"substitutions"
		]));
	}
}), Hd = h({
	name: "ToolTipService.ToolTip",
	__toolTipServiceProperty: !0,
	setup(e, { slots: t }) {
		let n = o(() => (t.default?.() ?? [])[0]);
		return () => {
			let e = n.value?.props ?? {}, t = e.Content ?? e.content ?? "", r = e.Placement ?? e.placement, i = e.PlacementRect ?? e.placementRect;
			return _("span", {
				class: "tooltip-service-property",
				"tooltipservice.tooltip": t,
				...r ? { "tooltipservice.placement": r } : {},
				...i ? { "tooltipservice.placementrect": i } : {}
			});
		};
	}
}), Ud = { install(e, t) {
	let { registerAll: n = !0, installGlobalProperties: r = !0 } = t ?? {}, i = nt(t?.locale ?? (typeof navigator < "u" ? navigator.language : "en-US"), t?.extraResources);
	if (e.provide(Qe, i), r && (e.config.globalProperties.$t = i.t), n) {
		let t = {
			Grid: ft,
			StackPanel: pt,
			RelativePanel: mt,
			VariableSizedWrapGrid: ht,
			Border: gt,
			Canvas: _t,
			Rectangle: vt,
			Viewbox: yt,
			GridColumnDefinitions: St,
			GridRowDefinitions: Ct,
			ColumnDefinition: Tt,
			RowDefinition: Dt,
			GridDefinitions: xt,
			TextBlock: Rt,
			TextBox: Gt,
			RichEditBox: Cn,
			RichTextBlock: wn,
			PasswordBox: En,
			AutoSuggestBox: Pn,
			NumberBox: Hn,
			Button: Kn,
			ToggleButton: qn,
			RepeatButton: Yn,
			HyperlinkButton: Qn,
			DropDownButton: cr,
			SplitButton: ur,
			ToggleSplitButton: fr,
			AppBarButton: Qt,
			AppBarToggleButton: $t,
			AppBarSeparator: tn,
			CheckBox: vr,
			RadioButton: xr,
			RadioButtons: Sr,
			ToggleSwitch: Er,
			Slider: Mr,
			Rating: zr,
			ColorPicker: ii,
			ComboBox: Xr,
			ListBox: si,
			DatePicker: Pi,
			TimePicker: Vi,
			CalendarDatePicker: ga,
			CalendarView: pa,
			ListView: ba,
			GridView: ka,
			FlipView: Ma,
			ItemsView: Pa,
			ItemsRepeater: Ia,
			TreeView: Va,
			PickerColumn: Ti,
			Flyout: Ha,
			FlyoutAnimation: Ua,
			MenuFlyout: It,
			ContentDialog: Ka,
			Popup: qa,
			TeachingTip: oo,
			ToolTip: Or,
			ToolTipService: ho,
			CommandBarFlyout: xn,
			MenuBar: vo,
			CommandBar: on,
			SplitView: yo,
			NavigationView: Xs,
			Pivot: ic,
			PivotItem: oc,
			SelectorBar: mc,
			SelectorBarItem: gc,
			BreadcrumbBar: wc,
			PipsPager: Oc,
			ProgressBar: Nc,
			ProgressRing: Lc,
			InfoBar: Hc,
			InfoBadge: So,
			ScrollViewer: Ft,
			ScrollView: Uc,
			ScrollBar: Wc,
			AnnotatedScrollBar: Kc,
			HorizontalScrollContainer: Qc,
			PullToRefresh: el,
			RefreshContainer: il,
			RefreshVisualizer: rl,
			Image: cl,
			MediaPlayerElement: Rl,
			CaptureElement: Ul,
			PersonPicture: Ql,
			AnimatedVisualPlayer: nu,
			ParallaxView: ru,
			FontIcon: iu,
			SymbolIcon: au,
			Expander: Su,
			ExpanderBase: mu,
			SwipeControl: Nu,
			Case: Fu,
			SwitchPresenter: Iu,
			SettingsCard: Gu,
			SemanticZoom: ed,
			TitleBar: ud,
			TypographyRow: bd,
			PageHeader: Cd,
			ControlExample: Vd,
			ControlExampleBase: Fd,
			ThemeWrapper: Td,
			"Button.Flyout": Gn,
			"SplitButton.Flyout": lr,
			"ToggleSplitButton.Flyout": dr,
			"ControlExample.Example": Ld,
			"ControlExample.Output": Rd,
			"ControlExample.Options": zd,
			"Expander.Header": gu,
			"Expander.Content": _u,
			"Expander.Description": vu,
			"Expander.HeaderIcon": yu,
			"Expander.HeaderControls": bu,
			"TeachingTip.HeroContent": Ya,
			"TeachingTip.Content": Xa,
			"TeachingTip.IconSource": Za,
			"DropDownButton.Flyout": $n,
			"DropDownButton.Content": er,
			"ToolTipService.ToolTip": Hd,
			MenuFlyoutItem: nr,
			"MenuFlyoutItem.Icon": rr
		};
		for (let [n, r] of Object.entries(t)) r && e.component(n, r);
	}
} };
//#endregion
export { nu as AnimatedVisualPlayer, Kc as AnnotatedScrollBar, Qt as AppBarButton, tn as AppBarSeparator, $t as AppBarToggleButton, Pn as AutoSuggestBox, gt as Border, wc as BreadcrumbBar, Kn as Button, Gn as ButtonFlyout, ga as CalendarDatePicker, pa as CalendarView, _t as Canvas, Ul as CaptureElement, Fu as Case, vr as CheckBox, ii as ColorPicker, Tt as ColumnDefinition, Xr as ComboBox, on as CommandBar, xn as CommandBarFlyout, Ka as ContentDialog, Vd as ControlExample, Fd as ControlExampleBase, Ld as ControlExampleExample, zd as ControlExampleOptions, Rd as ControlExampleOutput, Pi as DatePicker, cr as DropDownButton, er as DropDownButtonContent, $n as DropDownButtonFlyout, tr as DropDownMenuFlyout, Su as Expander, mu as ExpanderBase, _u as ExpanderContent, vu as ExpanderDescription, gu as ExpanderHeader, bu as ExpanderHeaderControls, yu as ExpanderHeaderIcon, Ma as FlipView, Ha as Flyout, Ua as FlyoutAnimation, Re as FlyoutAnimationDefaults, iu as FontIcon, ft as Grid, St as GridColumnDefinitions, xt as GridDefinitions, Ct as GridRowDefinitions, ka as GridView, Qc as HorizontalScrollContainer, Qn as HyperlinkButton, cl as Image, So as InfoBadge, Hc as InfoBar, Ia as ItemsRepeater, Pa as ItemsView, si as ListBox, ba as ListView, Rl as MediaPlayerElement, vo as MenuBar, It as MenuFlyout, nr as MenuFlyoutItem, rr as MenuFlyoutItemIcon, Xs as NavigationView, Hn as NumberBox, Cd as PageHeader, ru as ParallaxView, En as PasswordBox, Ql as PersonPicture, Ti as PickerColumn, Oc as PipsPager, ic as Pivot, oc as PivotItem, qa as Popup, Nc as ProgressBar, Lc as ProgressRing, el as PullToRefresh, xr as RadioButton, Sr as RadioButtons, zr as Rating, vt as Rectangle, il as RefreshContainer, rl as RefreshVisualizer, mt as RelativePanel, Yn as RepeatButton, Cn as RichEditBox, wn as RichTextBlock, Dt as RowDefinition, Wc as ScrollBar, Uc as ScrollView, Ft as ScrollViewer, mc as SelectorBar, gc as SelectorBarItem, ed as SemanticZoom, Gu as SettingsCard, Mr as Slider, ur as SplitButton, lr as SplitButtonFlyout, yo as SplitView, pt as StackPanel, ot as StandardUICommand, Nu as SwipeControl, Iu as SwitchPresenter, au as SymbolIcon, oo as TeachingTip, Xa as TeachingTipContent, Ya as TeachingTipHeroContent, Za as TeachingTipIconSource, Rt as TextBlock, Gt as TextBox, Td as ThemeWrapper, Vi as TimePicker, ud as TitleBar, qn as ToggleButton, fr as ToggleSplitButton, dr as ToggleSplitButtonFlyout, Er as ToggleSwitch, Or as ToolTip, ho as ToolTipService, Hd as ToolTipServiceToolTip, Va as TreeView, bd as TypographyRow, ht as VariableSizedWrapGrid, yt as Viewbox, Ye as XamlUICommand, Ce as alignment, Ne as applyCanvasChildren, je as applyGridChildren, Fe as applyRelativeChildren, Me as applyStackChildren, Ie as applyVariableSizedChildren, Ee as attachedValue, we as boolValue, lt as clearIsDragRegion, $e as componentResources, nt as createI18n, xe as cssLength, Ud as default, ct as getIsDragRegion, ye as gridDefinitionContextKey, be as gridDefinitionTargetKey, Qe as i18nKey, et as normalizeLocale, ve as normalizeXamlNodes, _e as normalizeXamlVNode, ge as resolveXamlHandler, $ as resolveXamlValue, st as setIsDragRegion, me as updateXamlBinding, Je as useFlyoutAnimation, rt as useI18n, Le as useLayoutObserver, K as xamlNameScopeKey, re as xamlScopeKey, Se as xamlThickness };

//# sourceMappingURL=winuionweb.es.js.map