(() => {
  const productos = (window.CATALOGO_PRODUCTOS || []).map(p => ({
    ...p,
    categoria: limpio(p["categorias"]),
    subcategoria: limpio(p["subcategoria"]),
    segmento: limpio(p["Segmento"])
  }));

  const app = document.getElementById("catalogApp");
  const crumbs = document.getElementById("breadcrumbs");
  const modal = document.getElementById("productModal");
  const modalBody = document.getElementById("modalBody");

  const state = { nivel: "categorias", subcategoria: null, segmento: null };

  const categorias = [
    ["Juguetería","Diversión y entretenimiento","jugueteria"],
    ["Ferretería","Herramientas y reparaciones","ferreteria"],
    ["Piñatería","Decoración y celebraciones","pinateria"],
    ["Papelería","Escolar y oficina","papeleria"],
    ["Hogar","Artículos para el hogar","hogar"],
    ["Rimax","Catálogo disponible","rimax"]
  ];

  function limpio(v){ return String(v ?? "").trim().replace(/\/+$/,""); }
  function normaliza(v){ return limpio(v).toLowerCase(); }
  function esc(v){ return String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c])); }

  function imagenProducto(p){
    return `rimax/${encodeURIComponent(p.subcategoria)}/${encodeURIComponent(p.segmento)}/${encodeURIComponent(p["ruta imagen"])}`;
  }

  function renderCrumbs(){
    const items = [{label:"Categorías", action:"inicio"}];
    if(state.nivel !== "categorias") items.push({label:"Rimax", action:"rimax"});
    if(state.subcategoria) items.push({label:state.subcategoria, action:"subcategoria"});
    if(state.segmento) items.push({label:state.segmento, action:null});
    crumbs.innerHTML = items.map((x,i) =>
      `${i ? '<span class="sep">›</span>' : ''}<button class="crumb ${!x.action?'current':''}" ${x.action?`data-action="${x.action}"`:"disabled"}>${esc(x.label)}</button>`
    ).join("");
  }

  function encabezado(titulo, subtitulo, volver){
    return `<div class="view-head">
      <div><h2>${esc(titulo)}</h2>${subtitulo?`<p>${esc(subtitulo)}</p>`:""}</div>
      ${volver?`<button type="button" class="back-btn" data-action="${volver.action}">← ${esc(volver.label)}</button>`:""}
    </div>`;
  }

  function renderCategorias(){
    state.nivel="categorias"; state.subcategoria=null; state.segmento=null;
    renderCrumbs();
    app.innerHTML = encabezado("Nuestras Categorías Principales","Explora la variedad de productos que tenemos para ti") +
      `<div class="grid">${categorias.map(([n,d,k]) =>
        `<article class="category-card ${k!=="rimax"?"inactive":""}" ${k==="rimax"?'data-action="rimax"':''}>
          <div class="icon-circle">${esc(n.charAt(0))}</div><h3>${esc(n)}</h3><p>${esc(d)}</p>
        </article>`).join("")}</div>`;
  }

  function renderRimax(){
    state.nivel="rimax"; state.subcategoria=null; state.segmento=null;
    renderCrumbs();
    const subs=[...new Set(productos.filter(p=>normaliza(p.categoria)==="rimax").map(p=>p.subcategoria))];
    app.innerHTML = encabezado("Rimax","Selecciona una subcategoría",{label:"Volver a Categorías",action:"inicio"}) +
      `<div class="grid">${subs.map(s=>`<article class="category-card" data-action="abrir-subcategoria" data-value="${esc(s)}"><div class="icon-circle">${esc(s.charAt(0))}</div><h3>${esc(s)}</h3></article>`).join("")}</div>`;
  }

  function renderSubcategoria(nombre){
    state.nivel="subcategoria"; state.subcategoria=nombre; state.segmento=null;
    renderCrumbs();
    const segs=[...new Set(productos.filter(p=>normaliza(p.categoria)==="rimax" && normaliza(p.subcategoria)===normaliza(nombre)).map(p=>p.segmento))];
    app.innerHTML = encabezado(nombre,"Selecciona un segmento",{label:"Volver a Rimax",action:"rimax"}) +
      `<div class="grid">${segs.map(s=>`<article class="segment-card" data-action="abrir-segmento" data-value="${esc(s)}"><div class="icon-circle">${esc(s.charAt(0))}</div><h3>${esc(s)}</h3></article>`).join("")}</div>`;
  }

  function renderSegmento(nombre){
    state.nivel="segmento"; state.segmento=nombre; renderCrumbs();
    const lista=productos.filter(p=>normaliza(p.categoria)==="rimax" && normaliza(p.subcategoria)===normaliza(state.subcategoria) && normaliza(p.segmento)===normaliza(nombre));
    app.innerHTML = encabezado("Productos","",{label:`Volver a ${state.subcategoria}`,action:"subcategoria"}) +
      (lista.length ? `<div class="product-grid">${lista.map((p,i)=>tarjetaProducto(p,i)).join("")}</div>` : `<div class="empty">No hay productos para mostrar.</div>`);
  }

  function tarjetaProducto(p,i){
    return `<article class="product-card" data-action="producto" data-index="${productos.indexOf(p)}" tabindex="0">
      <div class="product-image">
        <img src="${imagenProducto(p)}" alt="${esc(p["nombre producto"])}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <div class="img-fallback" style="display:none">${esc(p["nombre producto"])}</div>
      </div>
      <div class="product-content">
        <h3>${esc(p["nombre producto"])}</h3>
        <div class="meta"><span class="pill">Código: ${esc(p["código:"])}</span><span class="pill">Color: ${esc(p["Color:"])}</span></div>
      </div>
    </article>`;
  }

  function abrirProducto(p){
    modalBody.innerHTML = `<div class="detail">
      <div class="detail-grid">
        <div class="detail-image"><img src="${imagenProducto(p)}" alt="${esc(p["nombre producto"])}" onerror="this.outerHTML='<div class=&quot;img-fallback&quot;>${esc(p["nombre producto"])}</div>'"></div>
        <div>
          <h2 id="modalTitle">${esc(p["nombre producto"])}</h2>
          <div class="meta"><span class="pill">Código: ${esc(p["código:"])}</span><span class="pill">Color: ${esc(p["Color:"])}</span></div>
          <div class="description"><strong>Descripción</strong><p>${esc(p["Descripción Breve:"])}</p></div>
          <button class="whatsapp-disabled" type="button" disabled>WhatsApp pendiente de configurar</button>
        </div>
      </div>
    </div>`;
    modal.classList.add("open"); modal.setAttribute("aria-hidden","false");
  }

  function cerrarModal(){ modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); }

  document.addEventListener("click", e => {
    const el=e.target.closest("[data-action]"); if(!el) return;
    const a=el.dataset.action;
    if(a==="inicio") renderCategorias();
    if(a==="rimax") renderRimax();
    if(a==="subcategoria" && state.subcategoria) renderSubcategoria(state.subcategoria);
    if(a==="abrir-subcategoria") renderSubcategoria(el.dataset.value);
    if(a==="abrir-segmento") renderSegmento(el.dataset.value);
    if(a==="producto") abrirProducto(productos[Number(el.dataset.index)]);
    if(a==="cerrar-modal") cerrarModal();
  });

  document.addEventListener("keydown", e => {
    if(e.key==="Escape") cerrarModal();
    const card=e.target.closest?.(".product-card");
    if(card && (e.key==="Enter" || e.key===" ")){ e.preventDefault(); abrirProducto(productos[Number(card.dataset.index)]); }
  });

  renderCategorias();
})();
