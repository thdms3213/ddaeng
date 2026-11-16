/* dc-lite: a tiny renderer for the 땡땡이 game pages.
   Reads a <template id="tpl"> written with {{holes}}, <sc-if>, <sc-for>, onX="{{fn}}" and ref="{{fn}}",
   renders it from Component.renderVals() and patches the live DOM in place on every setState. */
(function () {
  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(o) { if (typeof o === 'function') o = o(this.state); Object.assign(this.state, o || {}); if (this.__sched) this.__sched(); }
  }
  window.DCLogic = DCLogic;

  const HOLE = /\{\{\s*([\w.$]+)\s*\}\}/g, ONE = /^\s*\{\{\s*([\w.$]+)\s*\}\}\s*$/;
  function look(scope, path) { let v = scope; for (const k of path.split('.')) { if (v == null) return undefined; v = v[k]; } return v; }
  function val(str, scope) { const m = str.match(ONE); if (m) return look(scope, m[1]); return str.replace(HOLE, (_, p) => { const v = look(scope, p); return v == null ? '' : v; }); }

  function build(node, scope, out) {
    if (node.nodeType === 3) { out.push(document.createTextNode(val(node.nodeValue, scope))); return; }
    if (node.nodeType !== 1) return;
    const tag = node.localName;
    if (tag === 'sc-if') { if (val(node.getAttribute('value') || '', scope)) for (const c of node.childNodes) build(c, scope, out); return; }
    if (tag === 'sc-for') {
      const list = val(node.getAttribute('list') || '', scope) || [], as = node.getAttribute('as') || 'item';
      list.forEach((it) => { const s = Object.create(scope); s[as] = it; for (const c of node.childNodes) build(c, s, out); });
      return;
    }
    const el = node.namespaceURI === 'http://www.w3.org/2000/svg' ? document.createElementNS(node.namespaceURI, tag) : document.createElement(tag);
    el.__ev = {};
    for (const a of node.attributes) {
      const n = a.name;
      if (n.startsWith('hint-')) continue;
      if (n === 'ref') { el.__ref = val(a.value, scope); continue; }
      if (n.length > 2 && n.startsWith('on')) { const f = val(a.value, scope); if (typeof f === 'function') el.__ev[n.slice(2)] = f; continue; }
      const v = val(a.value, scope);
      if (v === false || v == null) continue;
      el.setAttribute(n, v === true ? '' : String(v));
    }
    const kids = []; for (const c of node.childNodes) build(c, scope, kids);
    kids.forEach((k) => el.appendChild(k));
    out.push(el);
  }

  function bindEvents(live, ev) {
    const old = live.__ev || {};
    for (const k in old) if (!(k in ev)) live['on' + k] = null;
    for (const k in ev) live['on' + k] = ev[k];
    live.__ev = ev;
  }
  function attach(el) { // freshly inserted subtree: wire events + refs
    if (el.nodeType !== 1) return;
    const ev = el.__ev || {}; el.__ev = {}; bindEvents(el, ev);
    for (const c of el.childNodes) attach(c);
    if (typeof el.__ref === 'function') el.__ref(el);
  }
  function detach(el) {
    if (el.nodeType !== 1) return;
    for (const c of el.childNodes) detach(c);
    if (typeof el.__ref === 'function') el.__ref(null);
  }
  function patch(live, fresh) {
    if (live.nodeType !== fresh.nodeType || (live.nodeType === 1 && (live.localName !== fresh.localName || live.namespaceURI !== fresh.namespaceURI))) {
      detach(live); live.replaceWith(fresh); attach(fresh); return;
    }
    if (live.nodeType === 3) { if (live.nodeValue !== fresh.nodeValue) live.nodeValue = fresh.nodeValue; return; }
    const isCv = live.localName === 'canvas';
    for (const a of Array.from(live.attributes)) if (!fresh.hasAttribute(a.name) && !(isCv && (a.name === 'width' || a.name === 'height'))) live.removeAttribute(a.name);
    for (const a of fresh.attributes) if (live.getAttribute(a.name) !== a.value) live.setAttribute(a.name, a.value);
    bindEvents(live, fresh.__ev || {});
    if (fresh.__ref !== live.__ref) { if (typeof live.__ref === 'function') live.__ref(null); live.__ref = fresh.__ref; if (typeof live.__ref === 'function') live.__ref(live); }
    patchKids(live, Array.from(fresh.childNodes));
  }
  function patchKids(parent, freshKids) {
    const liveKids = Array.from(parent.childNodes);
    freshKids.forEach((f, i) => { if (i < liveKids.length) patch(liveKids[i], f); else { parent.appendChild(f); attach(f); } });
    for (let i = freshKids.length; i < liveKids.length; i++) { detach(liveKids[i]); liveKids[i].remove(); }
  }

  window.DCLite = {
    mount(host, tpl, Comp) {
      const root = tpl.content.cloneNode(true);
      const helmet = root.querySelector('helmet');
      if (helmet) { Array.from(helmet.children).forEach((c) => document.head.appendChild(c)); helmet.remove(); }
      const comp = new Comp({});
      let queued = false, mounted = false;
      const render = () => {
        queued = false;
        const vals = comp.renderVals();
        const out = []; for (const c of root.childNodes) build(c, vals, out);
        patchKids(host, out.filter((n) => !(n.nodeType === 3 && !n.nodeValue.trim())));
      };
      comp.__sched = () => { if (!mounted || queued) return; queued = true; Promise.resolve().then(render); };
      render(); mounted = true;
      if (comp.componentDidMount) comp.componentDidMount();
      return comp;
    }
  };
})();
