function t(t,e,i,s){var o,a=arguments.length,r=a<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var n=t.length-1;n>=0;n--)(o=t[n])&&(r=(a<3?o(r):a>3?o(e,i,r):o(e,i))||r);return a>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let a=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new a(i,t,s)},n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:m,getPrototypeOf:u}=Object,_=globalThis,p=_.trustedTypes,f=p?p.emptyScript:"",g=_.reactiveElementPolyfillSupport,v=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!c(t,e),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const a=s?.call(this);o?.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...m(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const a=o.fromAttribute(e,t.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const a=this.constructor;if(!1===s&&(o=this[t]),i??=a.getPropertyOptions(t),!((i.hasChanged??b)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==o||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,g?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,S=t=>t,k=x.trustedTypes,A=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+T,P=`<${M}>`,I=document,z=()=>I.createComment(""),C=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,R="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,L=/>/g,H=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,D=/"/g,F=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),W=Symbol.for("lit-noChange"),Q=Symbol.for("lit-nothing"),q=new WeakMap,V=I.createTreeWalker(I,129);function X(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,s=[];let o,a=2===e?"<svg>":3===e?"<math>":"",r=U;for(let e=0;e<i;e++){const i=t[e];let n,c,l=-1,h=0;for(;h<i.length&&(r.lastIndex=h,c=r.exec(i),null!==c);)h=r.lastIndex,r===U?"!--"===c[1]?r=O:void 0!==c[1]?r=L:void 0!==c[2]?(F.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=H):void 0!==c[3]&&(r=H):r===H?">"===c[0]?(r=o??U,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,n=c[1],r=void 0===c[3]?H:'"'===c[3]?D:j):r===D||r===j?r=H:r===O||r===L?r=U:(r=H,o=void 0);const d=r===H&&t[e+1].startsWith("/>")?" ":"";a+=r===U?i+P:l>=0?(s.push(n),i.slice(0,l)+E+i.slice(l)+T+d):i+T+(-2===l?e:d)}return[X(t,a+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,a=0;const r=t.length-1,n=this.parts,[c,l]=Y(t,e);if(this.el=G.createElement(c,i),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=V.nextNode())&&n.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=l[a++],i=s.getAttribute(t).split(T),r=/([.?@])?(.*)/.exec(e);n.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?et:"?"===r[1]?it:"@"===r[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(T)&&(n.push({type:6,index:o}),s.removeAttribute(t));if(F.test(s.tagName)){const t=s.textContent.split(T),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],z()),V.nextNode(),n.push({type:2,index:++o});s.append(t[e],z())}}}else if(8===s.nodeType)if(s.data===M)n.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(T,t+1));)n.push({type:7,index:o}),t+=T.length-1}o++}}static createElement(t,e){const i=I.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===W)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const a=C(e)?void 0:e._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),void 0===a?o=void 0:(o=new a(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=J(t,o._$AS(t,e.values),o,s)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??I).importNode(e,!0);V.currentNode=s;let o=V.nextNode(),a=0,r=0,n=i[0];for(;void 0!==n;){if(a===n.index){let e;2===n.type?e=new K(o,o.nextSibling,this,t):1===n.type?e=new n.ctor(o,n.name,n.strings,this,t):6===n.type&&(e=new ot(o,this,t)),this._$AV.push(e),n=i[++r]}a!==n?.index&&(o=V.nextNode(),a++)}return V.currentNode=I,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class K{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=Q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),C(t)?t===Q||null==t||""===t?(this._$AH!==Q&&this._$AR(),this._$AH=Q):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Q&&C(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Z(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new G(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new K(this.O(z()),this.O(z()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=S(t).nextSibling;S(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=Q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Q}_$AI(t,e=this,i,s){const o=this.strings;let a=!1;if(void 0===o)t=J(this,t,e,0),a=!C(t)||t!==this._$AH&&t!==W,a&&(this._$AH=t);else{const s=t;let r,n;for(t=o[0],r=0;r<o.length-1;r++)n=J(this,s[i+r],e,r),n===W&&(n=this._$AH[r]),a||=!C(n)||n!==this._$AH[r],n===Q?t=Q:t!==Q&&(t+=(n??"")+o[r+1]),this._$AH[r]=n}a&&!s&&this.j(t)}j(t){t===Q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Q?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Q)}}class st extends tt{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??Q)===W)return;const i=this._$AH,s=t===Q&&i!==Q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==Q&&(i===Q||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const at=x.litHtmlPolyfillSupport;at?.(G,K),(x.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let nt=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new K(e.insertBefore(z(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},dt=(t=ht,e,i)=>{const{kind:s,metadata:o}=i;let a=globalThis.litPropertyMetadata.get(o);if(void 0===a&&globalThis.litPropertyMetadata.set(o,a=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),a.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function mt(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ut(t){return mt({...t,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _t=1;let pt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ft="important",gt=" !"+ft,vt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends pt{constructor(t){if(super(t),t.type!==_t||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith(gt);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?ft:""):i[t]=s}}return W}}),yt={media_mode:"local",local_media_path:"media-source://media_source/local/screensaver",immich_album_id:void 0,image_fit:"cover",immich_access_mode:"media_source",immich_url:"",immich_api_key:"",immich_image_size:"preview",immich_profiles:[],display_time:30,crossfade_time:2,music_assistant_player:void 0,music_assistant_fallback_image:void 0,weather_entity:"weather.home",outdoor_temp_entity:"sensor.laverton_temp",outdoor_high_entity:"sensor.laverton_temp_max",room_temp_entity:"sensor.office_temperature",room_label:"Office",room_unit:"°C",location_source:"static",location_text:"Home",subtitle_text:"",clock_font_size:"clamp(3.5rem, 9vw, 6rem)",weather_font_size:"clamp(1.2rem, 3vw, 2rem)",room_font_size:"clamp(0.8rem, 1.8vw, 1.2rem)",location_font_size:"clamp(1.2rem, 3vw, 2rem)",subtitle_font_size:"clamp(0.8rem, 1.8vw, 1.2rem)",text_shadow:"0px 2px 12px rgba(0, 0, 0, 0.9)",pixel_shift_distance:6,pixel_shift_period:60,idle_time:120,idle_black_after:600,night_mode_light_sensor_entity:"sensor.room_light_sensor",night_mode_light_threshold:10,night_mode_clock_opacity:10,tap_navigation_path:void 0,brightness_entity:void 0,brightness_day_default:100,debug:!1};async function bt(t,e){return t.callWS({type:"media_source/resolve_media",media_content_id:e})}const $t=[".jpg",".jpeg",".png",".webp",".gif"];function wt(t){if(t.can_expand)return!1;const e=t.media_content_id.toLowerCase();return $t.some(t=>e.endsWith(t))}async function xt(t,e,i=1){const s=await async function(t,e){return t.callWS({type:"media_source/browse_media",media_content_id:e})}(t,e),o=s.children??[],a=o.filter(wt);if(i<=0)return a;const r=o.filter(t=>t.can_expand),n=await Promise.all(r.map(e=>xt(t,e.media_content_id,i-1).catch(()=>[])));return a.concat(...n)}async function St(t,e){return(await Promise.allSettled(e.map(async e=>({url:(await bt(t,e.media_content_id)).url,title:e.title})))).filter(t=>"fulfilled"===t.status).map(t=>t.value)}function kt(t){const e=t.slice();for(let t=e.length-1;t>0;t--){const i=Math.floor(Math.random()*(t+1));[e[t],e[i]]=[e[i],e[t]]}return e}function At(t){return t.immich_url.replace(/\/+$/,"")}async function Et(t,e){const i=await fetch(`${At(t)}/api${e}`,{headers:{"x-api-key":t.immich_api_key,Accept:"application/json"}});if(!i.ok)throw new Error(`Immich GET ${e} failed: ${i.status} ${i.statusText}`);return i.json()}async function Tt(t,e){const i=await fetch(`${At(t)}/api${e}`,{headers:{"x-api-key":t.immich_api_key}});if(!i.ok)throw new Error(`Immich GET ${e} failed: ${i.status} ${i.statusText}`);return i.blob()}async function Mt(t,e){const i=e.pool_size??20;if("memories"===e.type){const e=await Et(t,"/memories?type=ON_THIS_DAY"),s=Array.isArray(e)?e.flatMap(t=>t.assets??[]):[];return s.slice(0,i).map(t=>t.id).filter(t=>!!t)}const s={size:i,type:"IMAGE"};switch(e.type){case"album":e.album_ids?.length&&(s.albumIds=e.album_ids);break;case"people":e.person_ids?.length&&(s.personIds=e.person_ids);break;case"favorites":s.isFavorite=!0;break;case"location":e.city&&(s.city=e.city),e.state&&(s.state=e.state),e.country&&(s.country=e.country)}const o=await async function(t,e,i){const s=await fetch(`${At(t)}/api${e}`,{method:"POST",headers:{"x-api-key":t.immich_api_key,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(i)});if(!s.ok)throw new Error(`Immich POST ${e} failed: ${s.status} ${s.statusText}`);return s.json()}(t,"/search/random",s);return Array.isArray(o)?o.map(t=>t.id).filter(t=>!!t):[]}function Pt(t){const e=t?.exifInfo;if(!e)return;const i=[],s=[e.city,e.state,e.country].filter(Boolean).join(", ");if(s&&i.push(s),e.dateTimeOriginal){const t=new Date(e.dateTimeOriginal);Number.isNaN(t.getTime())||i.push(t.toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"}))}return i.length?i.join(" · "):void 0}class It{constructor(t,e){this.mode="eager",this.eagerQueue=[],this.assetIdQueue=[],this.index=0,this.loaded=!1,this.loading=null,this.recentBlobUrls=[],this.hass=t,this.config=e}updateHass(t){this.hass=t}updateConfig(t){this.config=t,this.loaded=!1,this.loading=null}dispose(){for(const t of this.recentBlobUrls)URL.revokeObjectURL(t);this.recentBlobUrls=[]}async getNext(){return await this.ensureLoaded(),"immich-api"===this.mode?this._nextFromImmichApi():this._nextFromEagerQueue()}_nextFromEagerQueue(){if(0===this.eagerQueue.length)return null;const t=this.eagerQueue[this.index%this.eagerQueue.length];return this.index++,this.index%this.eagerQueue.length===0&&(this.eagerQueue=kt(this.eagerQueue)),t}async _nextFromImmichApi(){if(0===this.assetIdQueue.length)return null;const t=this.assetIdQueue[this.index%this.assetIdQueue.length];this.index++,this.index%this.assetIdQueue.length===0&&(this.assetIdQueue=kt(this.assetIdQueue));try{const e=await async function(t,e){const i="fullsize"===t.immich_image_size?`/assets/${e}/original`:`/assets/${e}/thumbnail?size=${encodeURIComponent(t.immich_image_size??"preview")}`,[s,o]=await Promise.all([Tt(t,i),Et(t,`/assets/${e}`).catch(()=>{})]);return{url:URL.createObjectURL(s),title:Pt(o)}}(this._immichSettings(),t);return this._trackBlobUrl(e.url),e}catch(t){return console.warn("[ambient-screensaver-card] Failed to resolve Immich asset, skipping:",t),null}}_trackBlobUrl(t){t.startsWith("blob:")&&this.recentBlobUrls.push(t)}_immichSettings(){return{immich_url:this.config.immich_url??"",immich_api_key:this.config.immich_api_key??"",immich_image_size:this.config.immich_image_size??"preview",profiles:this.config.immich_profiles??[]}}async ensureLoaded(){this.loaded||(this.loading||(this.loading=this.load()),await this.loading)}async load(){if(this.dispose(),this.index=0,"immich"===this.config.media_mode)if("api"===this.config.immich_access_mode){if(await this._loadImmichApi())return}else{if(await this._loadImmichMediaSource())return}this.mode="eager",this.eagerQueue=kt(await this.loadLocal()),this.loaded=!0}async _loadImmichApi(){if(!this.config.immich_url||!this.config.immich_api_key)return console.warn("[ambient-screensaver-card] Immich API mode selected but immich_url/immich_api_key are not set, falling back to local media source."),!1;try{const t=await async function(t){const e=t.profiles.filter(t=>!1!==t.enabled);if(0===e.length)return[];const i=await Promise.allSettled(e.map(e=>Mt(t,e))),s=new Set;for(const t of i)if("fulfilled"===t.status)for(const e of t.value)s.add(e);else console.warn("[ambient-screensaver-card] Immich profile fetch failed:",t.reason);return Array.from(s)}(this._immichSettings());return 0===t.length?(console.warn("[ambient-screensaver-card] Immich API returned no assets, falling back to local media source."),!1):(this.mode="immich-api",this.assetIdQueue=kt(t),this.loaded=!0,!0)}catch(t){return console.warn("[ambient-screensaver-card] Immich API unavailable, falling back to local media source:",t),!1}}async _loadImmichMediaSource(){try{const t=await async function(t,e){const i=e?`media-source://immich/albums/${e}`:"media-source://immich",s=await xt(t,i,1);if(0===s.length)throw new Error("Immich media-source returned no images - check that the Immich integration is installed and, if `immich_album_id` is set, that the album id is correct.");return St(t,s)}(this.hass,this.config.immich_album_id);return 0!==t.length&&(this.mode="eager",this.eagerQueue=kt(t),this.loaded=!0,!0)}catch(t){return console.warn("[ambient-screensaver-card] Immich media-source unavailable, falling back to local media source:",t),!1}}async loadLocal(){const t=this.config.local_media_path??"media-source://media_source/local/screensaver",e=await xt(this.hass,t,1);return St(this.hass,e)}}function zt(t=new Date){const e=t.getHours();return{time:`${e%12==0?12:e%12}:${t.getMinutes().toString().padStart(2,"0")}`,ampm:e<12?"AM":"PM"}}function Ct(t,e){if(!e)return;const i=t.states[e];return i&&"unknown"!==i.state&&"unavailable"!==i.state?i.state:void 0}const Nt={"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant",exceptional:"mdi:alert-circle-outline"};function Rt(t,e){const i=Ct(t,e);if(void 0===i)return;const s=Number(i);return Number.isFinite(s)?s:void 0}function Ut(t,e){const i=Number(t[e]);return Number.isFinite(i)?i:0}function Ot(t,e){const i=t[e];return"string"==typeof i?i:""}function Lt(t,e,i=Date.now()){if(!e)return;const s=t.states[e];if(!s||"playing"!==s.state&&"paused"!==s.state)return;const o=s.attributes??{},a=Math.max(0,Ut(o,"media_duration")),r=Math.min(a||Number.MAX_SAFE_INTEGER,Math.max(0,function(t,e,i){const s=Ut(t,"media_position");if(!i)return s;const o=Ot(t,"media_position_updated_at");if(!o)return s;const a=Date.parse(o);return Number.isFinite(a)?s+Math.max(0,(e-a)/1e3):s}(o,i,"playing"===s.state)));return{state:s.state,title:Ot(o,"media_title")||"Unknown title",artist:Ot(o,"media_artist"),album:Ot(o,"media_album_name"),albumArtUrl:Ot(o,"entity_picture")||void 0,durationSeconds:a,positionSeconds:r}}class Ht{constructor(){this.intervalId=null,this.positionIndex=0}start(t,e,i){this.stop(),i(0,0),this.intervalId=setInterval(()=>{this.positionIndex=(this.positionIndex+1)%Ht.OFFSETS.length;const[e,s]=Ht.OFFSETS[this.positionIndex];i(e*t,s*t)},1e3*Math.max(1,e))}stop(){null!==this.intervalId&&(clearInterval(this.intervalId),this.intervalId=null)}}Ht.OFFSETS=[[1,0],[.7,.7],[0,1],[-.7,.7],[-1,0],[-.7,-.7],[0,-1],[.7,-.7]];const jt=["pointerdown","pointermove","touchstart","keydown"];class Dt{constructor(){this.idleTimer=null,this.blackTimer=null,this.listening=!1,this.handler=()=>this.reset(),this.onStateChange=()=>{},this.idleSeconds=120,this.blackSeconds=600}start(t,e,i){this.stop(),this.onStateChange=i,this.idleSeconds=t,this.blackSeconds=e;for(const t of jt)window.addEventListener(t,this.handler,{passive:!0});this.listening=!0,this.scheduleTimers()}stop(){if(this.listening){for(const t of jt)window.removeEventListener(t,this.handler);this.listening=!1}this.clearTimers()}reset(){this.onStateChange("active"),this.scheduleTimers()}scheduleTimers(){this.clearTimers(),this.idleTimer=setTimeout(()=>{this.onStateChange("dimmed")},1e3*Math.max(1,this.idleSeconds)),this.blackTimer=setTimeout(()=>{this.onStateChange("black")},1e3*Math.max(this.idleSeconds+1,this.blackSeconds))}clearTimers(){null!==this.idleTimer&&(clearTimeout(this.idleTimer),this.idleTimer=null),null!==this.blackTimer&&(clearTimeout(this.blackTimer),this.blackTimer=null)}}const Ft=r`
  :host {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #000;
    --asc-shift-x: 0px;
    --asc-shift-y: 0px;
  }

  .photo-layer {
    position: absolute;
    inset: 0;
  }

  .photo {
    position: absolute;
    inset: 0;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0;
    transition: opacity var(--asc-crossfade-time, 2s) ease-in-out;
  }

  .photo.cover {
    background-size: cover;
  }

  .photo.contain {
    background-size: contain;
  }

  .photo.visible {
    opacity: var(--asc-dim-opacity, 1);
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr auto;
    padding: 2.5vh 2.5vw;
    box-sizing: border-box;
    pointer-events: none;
    color: #fff;
    transform: translate(var(--asc-shift-x), var(--asc-shift-y));
    transition: transform 3s ease-in-out, opacity 1s ease-in-out;
    opacity: var(--asc-dim-opacity, 1);
  }

  .bottom-left {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-self: start;
    align-self: end;
    gap: 0.2em;
  }

  .bottom-right {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-self: end;
    align-self: end;
    text-align: right;
    gap: 0.2em;
  }

  .clock {
    font-size: var(--asc-clock-font-size, clamp(3.5rem, 9vw, 6rem));
    font-weight: 500;
    line-height: 1;
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .weather-row {
    display: flex;
    align-items: center;
    gap: 0.3em;
    font-size: var(--asc-weather-font-size, clamp(1.2rem, 3vw, 2rem));
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .weather-row ha-icon {
    --mdc-icon-size: 1.1em;
  }

  .room-row {
    font-size: var(--asc-room-font-size, clamp(0.8rem, 1.8vw, 1.2rem));
    opacity: 0.9;
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .location {
    font-size: var(--asc-location-font-size, clamp(1.2rem, 3vw, 2rem));
    font-weight: 500;
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .subtitle {
    font-size: var(--asc-subtitle-font-size, clamp(0.8rem, 1.8vw, 1.2rem));
    opacity: 0.9;
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .black-curtain {
    position: absolute;
    inset: 0;
    background: #000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 2s ease-in-out;
  }

  .black-curtain.visible {
    opacity: 1;
  }

  .night-clock {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: clamp(6rem, 20vw, 14rem);
    font-weight: 500;
    line-height: 1;
    opacity: var(--asc-night-clock-opacity, 0.1);
    text-shadow: var(--asc-text-shadow, 0px 2px 12px rgba(0, 0, 0, 0.9));
  }

  .night-clock-ampm {
    font-size: 0.3em;
    margin-left: 0.1em;
  }

  .music-view {
    position: absolute;
    inset: 0;
    overflow: hidden;
    color: #fff;
    background: #111;
  }

  .music-background,
  .music-scrim {
    position: absolute;
    inset: -32px;
  }

  .music-background {
    background-image: var(--asc-music-art, none);
    background-position: center;
    background-size: cover;
    filter: blur(28px);
    opacity: 0.8;
    transform: scale(1.08);
  }

  .music-scrim {
    background: rgba(0, 0, 0, 0.58);
  }

  .music-content {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(180px, 34vw) minmax(0, 1fr);
    grid-template-rows: 1fr auto auto;
    align-items: end;
    gap: 1.5rem 3vw;
    width: min(1100px, 86vw);
    height: 100%;
    margin: 0 auto;
    padding: 7vh 0 8vh;
    box-sizing: border-box;
  }

  .music-cover {
    grid-column: 1;
    grid-row: 1 / span 2;
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 4px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
  }

  .music-cover-empty {
    background: rgba(255, 255, 255, 0.08);
  }

  .music-details {
    grid-column: 2;
    grid-row: 1;
    align-self: end;
    min-width: 0;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9);
  }

  .music-title {
    font-size: clamp(2rem, 5vw, 5rem);
    font-weight: 600;
    line-height: 1.05;
    overflow-wrap: anywhere;
  }

  .music-artist {
    margin-top: 0.5rem;
    font-size: clamp(1.2rem, 2.5vw, 2.25rem);
  }

  .music-album {
    margin-top: 0.25rem;
    font-size: clamp(0.9rem, 1.5vw, 1.25rem);
    opacity: 0.78;
  }

  .music-controls {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    gap: 0.75rem;
  }

  .music-button {
    display: inline-grid;
    place-items: center;
    width: 3.25rem;
    height: 3.25rem;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: 50%;
    color: #fff;
    background: rgba(0, 0, 0, 0.38);
    cursor: pointer;
  }

  .music-button:hover,
  .music-button:focus-visible {
    background: rgba(255, 255, 255, 0.2);
  }

  .music-button ha-icon {
    --mdc-icon-size: 1.7rem;
  }

  .music-progress {
    grid-column: 1 / -1;
    grid-row: 3;
    width: 100%;
    height: 1.25rem;
    margin: 0;
    appearance: none;
    border-radius: 999px;
    outline: none;
    cursor: pointer;
    background: linear-gradient(
      to right,
      #fff var(--asc-music-progress, 0%),
      rgba(255, 255, 255, 0.3) var(--asc-music-progress, 0%)
    );
  }

  .music-progress::-webkit-slider-thumb {
    width: 0.9rem;
    height: 0.9rem;
    appearance: none;
    border: 0;
    border-radius: 50%;
    background: #fff;
  }

  .music-progress::-moz-range-thumb {
    width: 0.9rem;
    height: 0.9rem;
    border: 0;
    border-radius: 50%;
    background: #fff;
  }

  @media (max-width: 600px) {
    .music-content {
      grid-template-columns: 1fr;
      grid-template-rows: minmax(0, 1fr) auto auto auto;
      gap: 1rem;
      width: 84vw;
      padding: 7vh 0 6vh;
    }

    .music-cover {
      grid-column: 1;
      grid-row: 1;
      align-self: center;
      justify-self: center;
      width: min(62vw, 340px);
    }

    .music-details {
      grid-column: 1;
      grid-row: 2;
    }

    .music-controls {
      grid-column: 1;
      grid-row: 3;
    }

    .music-progress {
      grid-column: 1;
      grid-row: 4;
    }
  }

  .debug-overlay {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 10;
    padding: 6px 10px;
    background: rgba(0, 0, 0, 0.6);
    color: #0f0;
    font-family: monospace;
    font-size: 0.75rem;
    line-height: 1.4;
    pointer-events: none;
    white-space: nowrap;
  }

  .editor-placeholder {
    padding: 16px;
    font-family: var(--primary-font-family, Roboto);
    font-size: 14px;
    color: var(--primary-text-color);
    background: var(--card-background-color, #fff);
    border-radius: var(--ha-card-border-radius, 4px);
    box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14));
    margin: 8px;
  }
`;var Bt,Wt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(Bt||(Bt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(Wt||(Wt={}));const Qt=[{name:"",type:"expandable",title:"Media source",flatten:!0,schema:[{name:"media_mode",selector:{select:{mode:"dropdown",options:[{value:"local",label:"Local media folder"},{value:"immich",label:"Immich (optional)"}]}}},{name:"local_media_path",selector:{text:{}}},{name:"immich_album_id",selector:{text:{}}},{name:"immich_access_mode",selector:{select:{mode:"dropdown",options:[{value:"media_source",label:"Media source (via HA, no CORS setup needed)"},{value:"api",label:"Direct Immich API (profiles, more control)"}]}}},{name:"immich_url",selector:{text:{}}},{name:"immich_api_key",selector:{text:{type:"password"}}},{name:"immich_image_size",selector:{select:{mode:"dropdown",options:["thumbnail","preview","fullsize"]}}},{name:"image_fit",selector:{select:{mode:"dropdown",options:["cover","contain"]}}}]},{name:"",type:"expandable",title:"Timing & transitions",flatten:!0,schema:[{name:"display_time",selector:{number:{mode:"box",min:5,max:3600,unit_of_measurement:"s"}}},{name:"crossfade_time",selector:{number:{mode:"box",min:0,max:30,unit_of_measurement:"s"}}}]},{name:"",type:"expandable",title:"Music Assistant",flatten:!0,schema:[{name:"music_assistant_player",selector:{entity:{domain:"media_player"}}},{name:"music_assistant_fallback_image",selector:{text:{}}}]},{name:"",type:"expandable",title:"Outdoor weather",flatten:!0,schema:[{name:"weather_entity",selector:{entity:{domain:"weather"}}},{name:"outdoor_temp_entity",selector:{entity:{}}},{name:"outdoor_high_entity",selector:{entity:{}}}]},{name:"",type:"expandable",title:"Room temperature",flatten:!0,schema:[{name:"room_temp_entity",selector:{entity:{}}},{name:"room_label",selector:{text:{}}},{name:"room_unit",selector:{text:{}}}]},{name:"",type:"expandable",title:"Location & subtitle",flatten:!0,schema:[{name:"location_source",selector:{select:{mode:"dropdown",options:["static","immich_metadata"]}}},{name:"location_text",selector:{text:{}}},{name:"subtitle_text",selector:{text:{}}}]},{name:"",type:"expandable",title:"Typography",flatten:!0,schema:[{name:"clock_font_size",selector:{text:{}}},{name:"weather_font_size",selector:{text:{}}},{name:"room_font_size",selector:{text:{}}},{name:"location_font_size",selector:{text:{}}},{name:"subtitle_font_size",selector:{text:{}}},{name:"text_shadow",selector:{text:{}}}]},{name:"",type:"expandable",title:"Burn-in protection",flatten:!0,schema:[{name:"pixel_shift_distance",selector:{number:{mode:"box",unit_of_measurement:"px"}}},{name:"pixel_shift_period",selector:{number:{mode:"box",unit_of_measurement:"s"}}},{name:"idle_time",selector:{number:{mode:"box",unit_of_measurement:"s"}}},{name:"idle_black_after",selector:{number:{mode:"box",unit_of_measurement:"s"}}}]},{name:"",type:"expandable",title:"Night mode",flatten:!0,schema:[{name:"night_mode_light_sensor_entity",selector:{entity:{domain:"sensor"}}},{name:"night_mode_light_threshold",selector:{number:{mode:"box"}}},{name:"night_mode_clock_opacity",selector:{number:{mode:"slider",min:0,max:100,step:1,unit_of_measurement:"%"}}}]},{name:"",type:"expandable",title:"Navigation",flatten:!0,schema:[{name:"tap_navigation_path",selector:{text:{}}}]},{name:"",type:"expandable",title:"Display brightness",flatten:!0,schema:[{name:"brightness_entity",selector:{entity:{domain:"number"}}},{name:"brightness_day_default",selector:{number:{mode:"box"}}}]},{name:"",type:"expandable",title:"Debug",flatten:!0,schema:[{name:"debug",selector:{boolean:{}}}]}],qt={media_mode:"Photo source",local_media_path:"Local media folder (media-source content id)",immich_album_id:"Immich album id (media-source mode only)",immich_access_mode:"Immich access method",immich_url:"Immich server URL",immich_api_key:"Immich API key",immich_image_size:"Immich image size",image_fit:"Image fit",display_time:"Display time per photo",crossfade_time:"Crossfade duration",music_assistant_player:"Music Assistant player",music_assistant_fallback_image:"Music fallback image (URL, /local, or media-source)",weather_entity:"Weather entity",outdoor_temp_entity:"Outdoor temperature entity",outdoor_high_entity:"Outdoor high temperature entity",room_temp_entity:"Room temperature entity",room_label:"Room label",room_unit:"Room temperature unit",location_source:"Location/subtitle source",location_text:"Location text",subtitle_text:"Subtitle text",clock_font_size:"Clock font size (CSS, e.g. clamp())",weather_font_size:"Weather font size",room_font_size:"Room temperature font size",location_font_size:"Location font size",subtitle_font_size:"Subtitle font size",text_shadow:"Text shadow (CSS)",pixel_shift_distance:"Pixel-shift distance",pixel_shift_period:"Pixel-shift period",idle_time:"Idle time before dimming",idle_black_after:"Idle time before fading to black",night_mode_light_sensor_entity:"Night mode light sensor",night_mode_light_threshold:"Night mode threshold (state ≤ this = night)",night_mode_clock_opacity:"Night clock opacity",tap_navigation_path:"Tap navigation path",brightness_entity:"Screen brightness entity (number.*)",brightness_day_default:"Day brightness fallback",debug:"Show debug overlay"},Vt=[{value:"random",label:"Random (no filter)"},{value:"album",label:"Album"},{value:"people",label:"People / faces"},{value:"favorites",label:"Favorites only"},{value:"memories",label:"On this day / memories"},{value:"location",label:"Location / trips"}];function Xt(t){return t.split(",").map(t=>t.trim()).filter(Boolean)}let Yt=0;let Gt=class extends nt{constructor(){super(...arguments),this._computeLabel=t=>qt[t.name]??t.title??t.name}setConfig(t){this._config=t}_valueChanged(t){t.stopPropagation(),this._emitConfig(t.detail.value)}_emitConfig(t){const e={...yt,...this._config,...t,type:"custom:ambient-screensaver-card"};this._config=e,function(t,e,i,s){s=s||{},i=null==i?{}:i;var o=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});o.detail=i,t.dispatchEvent(o)}(this,"config-changed",{config:e})}_addProfile(){const t=[...this._config?.immich_profiles??[],(Yt+=1,{id:`profile-${Date.now()}-${Yt}`,type:"random",pool_size:20,enabled:!0})];this._emitConfig({immich_profiles:t})}_removeProfile(t){const e=(this._config?.immich_profiles??[]).filter((e,i)=>i!==t);this._emitConfig({immich_profiles:e})}_updateProfile(t,e){const i=[...this._config?.immich_profiles??[]];i[t]={...i[t],...e},this._emitConfig({immich_profiles:i})}_renderProfilesEditor(t){return B`
      <div class="profiles">
        <h3>Immich profiles</h3>
        <p class="hint">
          Each enabled profile below contributes photos into one shared
          random pool - e.g. combine a "Favorites" profile with an "Album"
          profile to mix both into the same rotation.
        </p>
        ${t.map((t,e)=>this._renderProfileRow(t,e))}
        <mwc-button outlined @click=${this._addProfile}>
          + Add profile
        </mwc-button>
      </div>
    `}_renderProfileRow(t,e){const i=t=>this._updateProfile(e,t);return B`
      <div class="profile-row">
        <ha-selector
          data-field="enabled"
          .hass=${this.hass}
          .selector=${{boolean:{}}}
          .value=${t.enabled??!0}
          label="Enabled"
          @value-changed=${t=>i({enabled:t.detail.value})}
        ></ha-selector>

        <ha-selector
          .hass=${this.hass}
          .selector=${{select:{mode:"dropdown",options:Vt}}}
          .value=${t.type}
          label="Type"
          @value-changed=${t=>i({type:t.detail.value})}
        ></ha-selector>

        <ha-selector
          .hass=${this.hass}
          .selector=${{number:{mode:"box",min:1,max:200}}}
          .value=${t.pool_size??20}
          label="Max photos"
          @value-changed=${t=>i({pool_size:t.detail.value})}
        ></ha-selector>

        ${"album"===t.type?B`
              <ha-selector
                .hass=${this.hass}
                .selector=${{text:{}}}
                .value=${(t.album_ids??[]).join(", ")}
                label="Album IDs (comma-separated)"
                @value-changed=${t=>i({album_ids:Xt(t.detail.value)})}
              ></ha-selector>
            `:Q}
        ${"people"===t.type?B`
              <ha-selector
                .hass=${this.hass}
                .selector=${{text:{}}}
                .value=${(t.person_ids??[]).join(", ")}
                label="Person IDs (comma-separated)"
                @value-changed=${t=>i({person_ids:Xt(t.detail.value)})}
              ></ha-selector>
            `:Q}
        ${"location"===t.type?B`
              <ha-selector
                .hass=${this.hass}
                .selector=${{text:{}}}
                .value=${t.city??""}
                label="City"
                @value-changed=${t=>i({city:t.detail.value})}
              ></ha-selector>
              <ha-selector
                .hass=${this.hass}
                .selector=${{text:{}}}
                .value=${t.state??""}
                label="State"
                @value-changed=${t=>i({state:t.detail.value})}
              ></ha-selector>
              <ha-selector
                .hass=${this.hass}
                .selector=${{text:{}}}
                .value=${t.country??""}
                label="Country"
                @value-changed=${t=>i({country:t.detail.value})}
              ></ha-selector>
            `:Q}

        <mwc-icon-button
          class="remove-button"
          title="Remove profile"
          @click=${()=>this._removeProfile(e)}
        >
          <ha-icon icon="mdi:delete"></ha-icon>
        </mwc-icon-button>
      </div>
    `}render(){if(!this.hass||!this._config)return Q;const t={...yt,...this._config},e="immich"===t.media_mode&&"api"===t.immich_access_mode;return B`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${Qt}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${e?this._renderProfilesEditor(t.immich_profiles??[]):Q}
    `}};Gt.styles=r`
    .profiles {
      margin-top: 16px;
      padding: 8px 0;
      border-top: 1px solid var(--divider-color);
    }
    .profiles h3 {
      margin: 8px 0 0 0;
    }
    .hint {
      margin: 4px 0 12px 0;
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
    .profile-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 8px;
      padding: 12px 8px;
      margin-bottom: 8px;
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .profile-row > * {
      flex: 1 1 160px;
    }
    .profile-row ha-selector[data-field="enabled"] {
      flex: 0 0 auto;
      min-width: 90px;
    }
    .remove-button {
      flex: 0 0 auto;
    }
  `,t([mt({attribute:!1})],Gt.prototype,"hass",void 0),t([ut()],Gt.prototype,"_config",void 0),Gt=t([lt("ambient-screensaver-card-editor")],Gt);let Jt=class extends nt{constructor(){super(...arguments),this._urls={a:"",b:""},this._activeLayer="a",this._clock=zt(),this._idleState="active",this._isNightMode=!1,this._screenWidth=0,this._screenHeight=0,this._devicePixelRatio=1,this._musicFallbackUrl="",this._currentItem=null,this._history=[],this._historyIndex=-1,this._editorMode=!1,this._fallbackRequest=0,this._resolvedFallbackSource="",this._pixelShift=new Ht,this._idle=new Dt,this._pointerStartX=0,this._pointerStartY=0,this._pointerStartTime=0,this._pointerStartTarget=null,this._handleResize=()=>{this._updateScreenSize()},this._handlePointerDown=t=>{this._pointerStartX=t.clientX,this._pointerStartY=t.clientY,this._pointerStartTime=Date.now(),this._pointerStartTarget=t.target},this._handlePointerUp=t=>{if(this._isInteractiveTarget(this._pointerStartTarget,t))return;const e=this._pointerStartX-t.clientX,i=this._pointerStartY-t.clientY,s=Math.max(1,Date.now()-this._pointerStartTime),o=Math.abs(e)/s;if(Math.abs(e)>Math.abs(i)&&Math.abs(e)>50&&o>.2){if(this._isNightMode||this._music)return;return e>0?this._showPrevious():this._showNext(),void this._restartRotationTimer()}Math.abs(e)<50&&Math.abs(i)<50&&this._navigateFromTap()},this._stopInteraction=t=>{t.stopPropagation()},this._toggleMusic=t=>{this._stopInteraction(t);const e=this._config?.music_assistant_player;e&&this.hass.callService("media_player","media_play_pause",{entity_id:e})},this._nextMusic=t=>{this._stopInteraction(t);const e=this._config?.music_assistant_player;e&&this.hass.callService("media_player","media_next_track",{entity_id:e})},this._seekMusic=t=>{this._stopInteraction(t);const e=t.currentTarget,i=this._config?.music_assistant_player;if(!i||!this._music||!this._music.durationSeconds)return;const s=Math.min(this._music.durationSeconds,Math.max(0,Number(e.value)));this.hass.callService("media_player","media_seek",{entity_id:i,seek_position:s})}}static getConfigElement(){return document.createElement("ambient-screensaver-card-editor")}static getStubConfig(){return{type:"custom:ambient-screensaver-card"}}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config={...yt,...t},this._media?.updateConfig(this._config),this._applyHostVariables(),this._resolveMusicFallback(),this.hass&&this._updateMusicState()}getCardSize(){return 5}connectedCallback(){super.connectedCallback(),this._editorMode=this._inEditor(),this._editorMode||(this._clockTimer=setInterval(()=>{this._clock=zt()},1e3),this._idle.start(this._config?.idle_time??yt.idle_time,this._config?.idle_black_after??yt.idle_black_after,t=>{this._idleState=t}),this._pixelShift.start(this._config?.pixel_shift_distance??yt.pixel_shift_distance,this._config?.pixel_shift_period??yt.pixel_shift_period,(t,e)=>{this.style.setProperty("--asc-shift-x",`${t}px`),this.style.setProperty("--asc-shift-y",`${e}px`)}),this._updateScreenSize(),window.addEventListener("resize",this._handleResize),this.addEventListener("pointerdown",this._handlePointerDown,{passive:!0}),this.addEventListener("pointerup",this._handlePointerUp,{passive:!0}))}disconnectedCallback(){super.disconnectedCallback(),this._editorMode||(this._clockTimer&&clearInterval(this._clockTimer),this._rotationTimer&&clearInterval(this._rotationTimer),this._idle.stop(),this._pixelShift.stop(),this._media?.dispose(),this._musicTimer&&clearInterval(this._musicTimer),window.removeEventListener("resize",this._handleResize),this.removeEventListener("pointerdown",this._handlePointerDown),this.removeEventListener("pointerup",this._handlePointerUp))}_inEditor(){let t=this.parentNode;for(;t;){if(t instanceof Element){if(t.tagName.toLowerCase().includes("-editor")||Array.from(t.classList).some(t=>t.includes("editor")))return!0}t=t.parentNode??t.host??null}return!1}_updateScreenSize(){const t=window.devicePixelRatio||1;this._screenWidth=Math.round(window.innerWidth*t),this._screenHeight=Math.round(window.innerHeight*t),this._devicePixelRatio=t,this.style.setProperty("--asc-screen-width",`${this._screenWidth}px`),this.style.setProperty("--asc-screen-height",`${this._screenHeight}px`),this.style.setProperty("--asc-device-pixel-ratio",`${this._devicePixelRatio}`)}_isInteractiveTarget(t,e){const i=e.composedPath();return t&&i.push(t),i.some(t=>t instanceof Element&&Boolean(t.closest("button, input, select, textarea, [data-interactive]")))}_navigateFromTap(){const t=this._config?.tap_navigation_path?.trim();if(!t||!this.hass)return;const e=this.hass;"function"!=typeof e.navigate?(window.history.pushState({},"",t),window.dispatchEvent(new PopStateEvent("popstate"))):e.navigate(t)}updated(t){if(super.updated(t),!this._editorMode){if(t.has("hass")&&this._media&&this._media.updateHass(this.hass),this.hass&&this._config&&!this._media&&(this._media=new It(this.hass,this._config),this._startRotation()),t.has("hass")&&this.hass&&this._config){const t=function(t,e,i){const s=e.night_mode_light_sensor_entity??"sensor.room_light_sensor",o=e.night_mode_light_threshold??0,a=t.states[s];if(!a||"unavailable"===a.state||"unknown"===a.state)return i;const r=parseFloat(a.state);return Number.isNaN(r)?i:r<=o}(this.hass,this._config,this._isNightMode);t!==this._isNightMode&&(this._isNightMode=t,this._handleNightModeChange(t))}t.has("hass")&&this.hass&&this._config&&(this._resolveMusicFallback(),this._updateMusicState())}}_updateMusicState(){const t=Lt(this.hass,this._config?.music_assistant_player),e=Boolean(this._music);this._music=t;const i=Boolean(t);i&&!e?(this._rotationTimer&&(clearInterval(this._rotationTimer),this._rotationTimer=void 0),this._startMusicTimer()):!i&&e&&(this._stopMusicTimer(),this._isNightMode||this._restartRotationTimer())}_startMusicTimer(){this._stopMusicTimer(),this._musicTimer=setInterval(()=>{this._updateMusicState()},1e3)}_stopMusicTimer(){this._musicTimer&&clearInterval(this._musicTimer),this._musicTimer=void 0}async _resolveMusicFallback(){const t=this._config?.music_assistant_fallback_image,e=++this._fallbackRequest;if(!t)return this._musicFallbackUrl="",void(this._resolvedFallbackSource="");if(t!==this._resolvedFallbackSource&&(!t.startsWith("media-source://")||this.hass))try{const i=t.startsWith("media-source://")?(await bt(this.hass,t)).url:t;e===this._fallbackRequest&&(this._musicFallbackUrl=i,this._resolvedFallbackSource=t)}catch(t){console.warn("[ambient-screensaver-card] Failed to resolve music fallback image:",t),e===this._fallbackRequest&&(this._musicFallbackUrl="")}}async _handleNightModeChange(t){t?this._rotationTimer&&(clearInterval(this._rotationTimer),this._rotationTimer=void 0):this._music||this._restartRotationTimer(),await this._setBrightness(t)}async _setBrightness(t){const e=this._config?.brightness_entity;if(e&&this.hass)try{if(t){const t=this.hass.states[e],i=t?parseFloat(t.state):NaN;!Number.isNaN(i)&&i>0&&(this._previousBrightness=i),await this.hass.callService("number","set_value",{entity_id:e,value:0})}else{const t=this._previousBrightness&&this._previousBrightness>0?this._previousBrightness:this._config?.brightness_day_default??yt.brightness_day_default;await this.hass.callService("number","set_value",{entity_id:e,value:t})}}catch(t){console.warn("[ambient-screensaver-card] Failed to update display brightness:",t)}}async _startRotation(){await this._showNext(),this._restartRotationTimer()}_restartRotationTimer(){this._rotationTimer&&clearInterval(this._rotationTimer);const t=this._config?.display_time??yt.display_time;this._rotationTimer=setInterval(()=>{this._showNext()},1e3*Math.max(1,t))}async _showNext(){if(!this._media)return;if(this._historyIndex<this._history.length-1)return this._historyIndex++,void this._displayItem(this._history[this._historyIndex]);const t=await this._media.getNext();t&&(this._history.push(t),this._historyIndex=this._history.length-1,this._trimHistory(),this._displayItem(t))}_showPrevious(){this._historyIndex<=0||(this._historyIndex--,this._displayItem(this._history[this._historyIndex]))}_trimHistory(){for(;this._history.length>50;){const t=this._history.shift();this._historyIndex--,t?.url.startsWith("blob:")&&URL.revokeObjectURL(t.url)}}_displayItem(t){this._currentItem=t;"a"===this._activeLayer?(this._urls={...this._urls,b:t.url},this._activeLayer="b"):(this._urls={...this._urls,a:t.url},this._activeLayer="a")}_applyHostVariables(){if(!this._config)return;const t=this._config;this.style.setProperty("--asc-crossfade-time",`${t.crossfade_time}s`),this.style.setProperty("--asc-clock-font-size",t.clock_font_size??yt.clock_font_size),this.style.setProperty("--asc-weather-font-size",t.weather_font_size??yt.weather_font_size),this.style.setProperty("--asc-room-font-size",t.room_font_size??yt.room_font_size),this.style.setProperty("--asc-location-font-size",t.location_font_size??yt.location_font_size),this.style.setProperty("--asc-subtitle-font-size",t.subtitle_font_size??yt.subtitle_font_size),this.style.setProperty("--asc-text-shadow",t.text_shadow??yt.text_shadow);const e=Math.min(100,Math.max(0,Number(t.night_mode_clock_opacity??10)));this.style.setProperty("--asc-night-clock-opacity",""+e/100)}render(){if(this._editorMode)return B`
        <div class="editor-placeholder">
          <h3>Ambient Screensaver Card</h3>
          <div>Media mode: ${this._config?.media_mode??"local"}</div>
          <div>
            Night mode sensor:
            ${this._config?.night_mode_light_sensor_entity??"not configured"}
          </div>
          <div>
            Brightness entity:
            ${this._config?.brightness_entity??"not configured"}
          </div>
        </div>
      `;if(!this._config||!this.hass)return Q;if(this._isNightMode)return this._renderNightMode();if(this._music)return this._renderMusic();const t=function(t,e){const i=Ct(t,e.weather_entity),s=i&&Nt[i]||"mdi:weather-cloudy",o=Rt(t,e.outdoor_temp_entity),a=Rt(t,e.outdoor_high_entity);if(void 0!==o&&void 0!==a)return{icon:s,outdoorTemp:o,outdoorHigh:a}}(this.hass,this._config),e=function(t,e){const i=Ct(t,e.room_temp_entity);if(void 0===i)return;const s=Number(i);return Number.isFinite(s)?{temp:s,label:e.room_label??"Room",unit:e.room_unit??"°C"}:void 0}(this.hass,this._config),i=function(t,e){const i="immich_metadata"===t.location_source&&e?.title?e.title:t.subtitle_text??"";return{location:t.location_text??"Home",subtitle:i}}(this._config,this._currentItem),s=vt({"--asc-dim-opacity":"black"===this._idleState?0:1});return B`
      <div class="photo-layer" style=${s}>
        <div
          class="photo ${this._config.image_fit} ${"a"===this._activeLayer?"visible":""}"
          style="background-image:url('${this._urls.a}')"
        ></div>
        <div
          class="photo ${this._config.image_fit} ${"b"===this._activeLayer?"visible":""}"
          style="background-image:url('${this._urls.b}')"
        ></div>
      </div>
      <div class="overlay" style=${s}>
        <div class="bottom-left">
          <div class="clock">
            ${this._clock.time}<span style="font-size:0.4em;">
              ${this._clock.ampm}</span
            >
          </div>
          ${t?B`<div class="weather-row">
                <ha-icon icon=${t.icon}></ha-icon>
                <span
                  >${Math.round(t.outdoorTemp)}° /
                  ${Math.round(t.outdoorHigh)}°</span
                >
              </div>`:Q}
          ${e?B`<div class="room-row">
                ${e.label} - ${Math.round(e.temp)}${e.unit}
              </div>`:Q}
        </div>
        <div class="bottom-right">
          <div class="location">${i.location}</div>
          ${i.subtitle?B`<div class="subtitle">${i.subtitle}</div>`:Q}
        </div>
      </div>
      <div
        class="black-curtain ${"black"===this._idleState?"visible":""}"
      ></div>
      ${this._renderDebugOverlay()}
    `}_renderNightMode(){return B`
      <div class="night-clock">
        ${this._clock.time}<span class="night-clock-ampm"
          >${this._clock.ampm}</span
        >
      </div>
      ${this._renderDebugOverlay()}
    `}_renderMusic(){const t=this._music;if(!t)return Q;const e=t.albumArtUrl??this._musicFallbackUrl,i=t.durationSeconds?t.positionSeconds/t.durationSeconds*100:0;return B`
      <div
        class="music-view"
        style=${vt({"--asc-music-art":e?`url("${e}")`:"none"})}
      >
        <div class="music-background"></div>
        <div class="music-scrim"></div>
        <div class="music-content">
          ${e?B`<img class="music-cover" src=${e} alt="Album cover" />`:B`<div class="music-cover music-cover-empty"></div>`}
          <div class="music-details">
            <div class="music-title">${t.title}</div>
            ${t.artist?B`<div class="music-artist">${t.artist}</div>`:Q}
            ${t.album?B`<div class="music-album">${t.album}</div>`:Q}
          </div>
          <div class="music-controls" data-interactive>
            <button
              class="music-button"
              aria-label=${"playing"===t.state?"Pause":"Play"}
              @click=${this._toggleMusic}
            >
              <ha-icon
                icon=${"playing"===t.state?"mdi:pause":"mdi:play"}
              ></ha-icon>
            </button>
            <button
              class="music-button"
              aria-label="Next track"
              @click=${this._nextMusic}
            >
              <ha-icon icon="mdi:skip-next"></ha-icon>
            </button>
          </div>
          <input
            class="music-progress"
            data-interactive
            type="range"
            min="0"
            max=${t.durationSeconds||1}
            step="1"
            .value=${String(t.positionSeconds)}
            style=${vt({"--asc-music-progress":`${i}%`})}
            aria-label="Track progress"
            @input=${this._seekMusic}
          />
        </div>
      </div>
    `}_renderDebugOverlay(){return this._config?.debug?B`
      <div class="debug-overlay">
        <div>editor mode: ${this._editorMode}</div>
        <div>
          night mode: ${this._isNightMode} (sensor:
          ${this._config.night_mode_light_sensor_entity??"-"})
        </div>
        <div>brightness entity: ${this._config.brightness_entity??"none"}</div>
        <div>media mode: ${this._config.media_mode}</div>
        <div>photo: ${this._historyIndex+1} / ${this._history.length}</div>
        <div>idle state: ${this._idleState}</div>
        <div>
          screen: ${this._screenWidth}x${this._screenHeight} @
          ${this._devicePixelRatio}x
        </div>
      </div>
    `:Q}};Jt.styles=Ft,t([mt({attribute:!1})],Jt.prototype,"hass",void 0),t([ut()],Jt.prototype,"_config",void 0),t([ut()],Jt.prototype,"_urls",void 0),t([ut()],Jt.prototype,"_activeLayer",void 0),t([ut()],Jt.prototype,"_clock",void 0),t([ut()],Jt.prototype,"_idleState",void 0),t([ut()],Jt.prototype,"_isNightMode",void 0),t([ut()],Jt.prototype,"_screenWidth",void 0),t([ut()],Jt.prototype,"_screenHeight",void 0),t([ut()],Jt.prototype,"_devicePixelRatio",void 0),t([ut()],Jt.prototype,"_music",void 0),t([ut()],Jt.prototype,"_musicFallbackUrl",void 0),Jt=t([lt("ambient-screensaver-card")],Jt),window.customCards=window.customCards||[],window.customCards.push({type:"ambient-screensaver-card",name:"Ambient Screensaver Card",description:"Full-screen rotating photo ambient screensaver with clock/weather/room-temp overlay and burn-in protection."});export{Jt as AmbientScreensaverCard};
