webpackJsonp([0],{0:function(t,n){},"1/oy":function(t,n){},"2jGx":function(t,n){},"7Otq":function(t,n,e){t.exports=e.p+"static/img/logo.db4f0c0.png"},"8v7y":function(t,n){},"9M+g":function(t,n){},Id91:function(t,n){},Jmt5:function(t,n){},NHnr:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=e("7+uW"),i=(e("Jmt5"),e("9M+g"),{render:function(){var t=this.$createElement,n=this._self._c||t;return n("div",{attrs:{id:"app"}},[n("b-container",[n("router-view")],1)],1)},staticRenderFns:[]});var o=e("VU/8")({name:"App"},i,!1,function(t){e("8v7y")},null,null).exports,r=e("/ocq"),s={render:function(){var t=this.$createElement,n=this._self._c||t;return n("div",{staticClass:"hello"},[n("b-img",{staticClass:"mb-5 p-5",attrs:{src:e("7Otq"),fluid:"",alt:"Fluid image"}}),this._v(" "),n("b-card",{staticClass:"mb-2",attrs:{title:"授权页面",tag:"article"}},[n("p",{staticClass:"card-text"}),this._v(" "),n("b-form",{attrs:{action:"/api/oauth/logout",method:"get"}},[n("b-button",{attrs:{type:"submit",variant:"primary"}},[this._v("重新绑定")])],1)],1)],1)},staticRenderFns:[]};var c=e("VU/8")({name:"Login",data:function(){return{form:{phone:"",code:""},requestInterval:0,backendError:""}},methods:{onSubmit:function(t){this.$http.get("/api/oauth/logout")},onReset:function(t){t.preventDefault()}}},s,!1,function(t){e("2jGx")},"data-v-4d833f24",null).exports;a.a.use(r.a);var u=new r.a({routes:[{path:"/",name:"Login",component:c}]}),p=e("e6fC"),l=e("8+8L");a.a.use(p.a),a.a.use(l.a),a.a.config.productionTip=!1,new a.a({el:"#app",router:u,components:{App:o},template:"<App/>"})},zj2Q:function(t,n){}},["NHnr"]);
//# sourceMappingURL=app.801629ccd4bc0dd8700f.js.map