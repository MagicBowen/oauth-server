webpackJsonp([0], { 0: function (t, e) { }, "1/oy": function (t, e) { }, "1JRU": function (t, e) { }, "7Otq": function (t, e, n) { t.exports = n.p + "static/img/logo.db4f0c0.png" }, "9M+g": function (t, e) { }, Id91: function (t, e) { }, Jmt5: function (t, e) { }, NHnr: function (t, e, n) { "use strict"; Object.defineProperty(e, "__esModule", { value: !0 }); var r = n("7+uW"), a = (n("Jmt5"), n("9M+g"), { render: function () { var t = this.$createElement, e = this._self._c || t; return e("div", { attrs: { id: "app" } }, [e("b-container", [e("b-img", { staticClass: "mb-5 p-5", attrs: { src: n("7Otq"), fluid: "", alt: "Fluid image" } }), this._v(" "), e("router-view")], 1)], 1) }, staticRenderFns: [] }); var o = n("VU/8")({ name: "App" }, a, !1, function (t) { n("1JRU") }, null, null).exports, s = n("/ocq"), i = { name: "Login", data: function () { return { form: { phone: "", code: "" }, requestInterval: 0, backendError: "" } }, computed: { codeText: function () { return this.requestInterval > 0 ? "获取验证码（" + this.requestInterval + "秒）" : "获取验证码" }, validPhone: function () { return /^1(3|4|5|7|8|9)\d{9}$/.test(this.form.phone) }, validCode: function () { return /^\d{6}$/.test(this.form.code) } }, methods: { requestCode: function (t) { this.$http.post("/api/oauth/request/code", { phone: this.form.phone }).then(function (t) { console.log(t), this.restartRequestInterval() }).catch(function (t) { console.log(t) }) }, onSubmit: function (t) { var e = this; this.$http.post("login", this.form).then(function (t) { "redirect_to_auth" === t.data.result ? (console.log("Ok"), e.$router.push("/Grant")) : e.backendError = t.data.result }).catch(function (t) { e.backendError = "something wrong", console.log(t) }), t.preventDefault() }, onReset: function (t) { t.preventDefault() }, restartRequestInterval: function () { var t = this; this.requestInterval = 60, clearInterval(this.intervalId), this.intervalId = setInterval(function () { t.requestInterval-- , 0 === t.requestInterval && clearInterval(t.intervalId) }, 1e3) } }, destroyed: function () { console.log("destroyed"), clearInterval(this.intervalId) } }, c = { render: function () { var t = this, e = t.$createElement, n = t._self._c || e; return n("div", { staticClass: "hello" }, [t._m(0), t._v(" "), n("div", { staticClass: "my-row" }, [t._v("\n      你的手机号只会用来作为登录绑定使用，不会用作其他用途\n  ")]), t._v(" "), n("b-form", { attrs: { action: "login", method: "post" }, on: { submit: t.onSubmit, reset: t.onReset } }, [n("b-alert", { attrs: { show: 0 != t.backendError.length, variant: "danger" } }, [t._v(t._s(t.backendError))]), t._v(" "), n("b-alert", { attrs: { show: !t.validPhone, variant: "danger" } }, [t._v("请输入有效的手机号")]), t._v(" "), n("b-alert", { attrs: { show: t.validPhone && !t.validCode, variant: "danger" } }, [t._v("请输入有效的验证码")]), t._v(" "), n("b-input-group", { attrs: { prepend: "手机号" } }, [n("b-form-input", { attrs: { type: "tel", maxlength: "11", placeholder: "请输入手机号", name: "phone", state: t.validPhone }, model: { value: t.form.phone, callback: function (e) { t.$set(t.form, "phone", e) }, expression: "form.phone" } })], 1), t._v(" "), n("br"), t._v(" "), n("b-input-group", { attrs: { prepend: "验证码" } }, [n("b-form-input", { attrs: { type: "tel", maxlength: "6", name: "verifyCode", placeholder: "请输入六位验证码" }, model: { value: t.form.code, callback: function (e) { t.$set(t.form, "code", e) }, expression: "form.code" } }), t._v(" "), n("b-input-group-append", [n("b-btn", { attrs: { variant: "outline-success", disabled: t.requestInterval > 0 || !t.validPhone }, on: { click: t.requestCode } }, [t._v(t._s(t.codeText))])], 1)], 1), t._v(" "), n("br"), t._v(" "), n("b-button", { staticClass: "btn-block", attrs: { type: "submit", variant: "primary", disabled: !t.validPhone || !t.validCode, size: "lg" } }, [t._v("绑定")])], 1)], 1) }, staticRenderFns: [function () { var t = this.$createElement, e = this._self._c || t; return e("div", { staticClass: "my-row" }, [e("h3", [this._v("\n      绑定手机\n    ")])]) }] }; var l = n("VU/8")(i, c, !1, function (t) { n("mqX8") }, "data-v-68e721e9", null).exports, u = { render: function () { var t = this, e = t.$createElement, n = t._self._c || e; return n("b-card", { staticClass: "mb-2", attrs: { title: "授权页面", tag: "article" } }, [n("p", { staticClass: "card-text" }, [t._v("\n        按下"), n("b", [t._v("确认授权")]), t._v("按钮，将会授权本技能访问您在"), n("b", [t._v("小哒智能助手")]), t._v("上的课表。如果您还没有使用过"), n("b", [t._v("小哒智能助手")]), t._v("，可以在微信小程序中搜索”小哒智能助手“输入课表，并留下您的手机号码。本技能将能够使用您在输入的课表\n    ")]), t._v(" "), n("b-form", { attrs: { action: "/oauth/authorize", method: "post" } }, [n("b-button", { attrs: { type: "submit", variant: "primary" } }, [t._v("确认授权")])], 1)], 1) }, staticRenderFns: [] }; var d = n("VU/8")({ name: "Grant", data: function () { return {} }, computed: {}, methods: {}, destroyed: function () { } }, u, !1, function (t) { n("U3kZ") }, "data-v-4319222e", null).exports; r.a.use(s.a); var v = new s.a({ routes: [{ path: "/", name: "Login", component: l }, { path: "/grant", name: "Grant", component: d }] }), p = n("e6fC"), h = n("8+8L"); r.a.use(p.a), r.a.use(h.a), r.a.config.productionTip = !1, new r.a({ el: "#app", router: v, components: { App: o }, template: "<App/>" }) }, U3kZ: function (t, e) { }, mqX8: function (t, e) { }, zj2Q: function (t, e) { } }, ["NHnr"]);
//# sourceMappingURL=app.2c195ba8e4bb2e28bf70.js.map