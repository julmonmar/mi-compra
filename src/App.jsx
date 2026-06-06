import { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const CATEGORIAS = [
  "Frutas y verduras","Carnes y embutidos","Pescados y mariscos",
  "Lácteos y huevos","Legumbres y conservas",
  "Panadería, bollería y snacks","Aceites, salsas y condimentos",
  "Congelados","Bebidas","Limpieza","Cosmética y cuidado personal","Otros"
];
const ICONOS = {
  "Frutas y verduras":"🥦","Carnes y embutidos":"🥩","Pescados y mariscos":"🐟",
  "Lácteos y huevos":"🥚","Legumbres y conservas":"🫙",
  "Panadería, bollería y snacks":"🍞","Aceites, salsas y condimentos":"🫒",
  "Congelados":"🧊","Bebidas":"🧃","Limpieza":"🧹",
  "Cosmética y cuidado personal":"🧴","Otros":"📦",
};
const COLORES = ["#C8A96E","#7EB8A4","#C47E7E","#7E9BC4","#B4A86E","#9E7EC4","#7EC47E"];

const PRODUCTOS_INIT = [
  {id:"p1",  nombre:"Lentejas",        unidad:"g",    categoria:"Legumbres y conservas", favorito:false},
  {id:"p2",  nombre:"Chorizo",         unidad:"g",    categoria:"Carnes y embutidos",    favorito:false},
  {id:"p3",  nombre:"Pollo",           unidad:"kg",   categoria:"Carnes y embutidos",    favorito:false},
  {id:"p4",  nombre:"Patatas",         unidad:"kg",   categoria:"Frutas y verduras",     favorito:false},
  {id:"p5",  nombre:"Arroz",           unidad:"g",    categoria:"Legumbres y conservas", favorito:false},
  {id:"p6",  nombre:"Atún lata",       unidad:"lata", categoria:"Legumbres y conservas", favorito:false},
  {id:"p7",  nombre:"Merluza",         unidad:"g",    categoria:"Pescados y mariscos",   favorito:false},
  {id:"p8",  nombre:"Pasta",           unidad:"g",    categoria:"Legumbres y conservas", favorito:false},
  {id:"p9",  nombre:"Carne picada",    unidad:"g",    categoria:"Carnes y embutidos",    favorito:false},
  {id:"p10", nombre:"Tomate frito",    unidad:"bote", categoria:"Legumbres y conservas", favorito:false},
  {id:"p11", nombre:"Huevos",          unidad:"ud",   categoria:"Lácteos y huevos",      favorito:false},
  {id:"p12", nombre:"Champiñones",     unidad:"g",    categoria:"Frutas y verduras",     favorito:false},
  {id:"p13", nombre:"Cebolla",         unidad:"ud",   categoria:"Frutas y verduras",     favorito:false},
  {id:"p14", nombre:"Lechuga",         unidad:"ud",   categoria:"Frutas y verduras",     favorito:false},
  {id:"p15", nombre:"Tomate",          unidad:"g",    categoria:"Frutas y verduras",     favorito:false},
  {id:"p16", nombre:"Aceite oliva",    unidad:"L",    categoria:"Aceites y salsas",      favorito:true},
  {id:"p17", nombre:"Gambas",          unidad:"g",    categoria:"Pescados y mariscos",   favorito:false},
  {id:"p18", nombre:"Pechuga",         unidad:"g",    categoria:"Carnes y embutidos",    favorito:false},
  {id:"p19", nombre:"Calabaza",        unidad:"g",    categoria:"Frutas y verduras",     favorito:false},
  {id:"p20", nombre:"Bacalao",         unidad:"g",    categoria:"Pescados y mariscos",   favorito:false},
  {id:"p21", nombre:"Costillas",       unidad:"kg",   categoria:"Carnes y embutidos",    favorito:false},
  {id:"p22", nombre:"Leche",           unidad:"L",    categoria:"Lácteos y huevos",      favorito:true},
  {id:"p23", nombre:"Pimiento rojo",   unidad:"ud",   categoria:"Frutas y verduras",     favorito:false},
  {id:"p24", nombre:"Salmón",          unidad:"g",    categoria:"Pescados y mariscos",   favorito:false},
  {id:"p25", nombre:"Mozzarella",      unidad:"g",    categoria:"Lácteos y huevos",      favorito:false},
  {id:"p26", nombre:"Bechamel",        unidad:"bote", categoria:"Legumbres y conservas", favorito:false},
  {id:"p27", nombre:"Queso rallado",   unidad:"g",    categoria:"Lácteos y huevos",      favorito:false},
  {id:"p28", nombre:"Puerros",         unidad:"ud",   categoria:"Frutas y verduras",     favorito:false},
  {id:"p29", nombre:"Fabes",           unidad:"g",    categoria:"Legumbres y conservas", favorito:false},
  {id:"p30", nombre:"Morcilla",        unidad:"g",    categoria:"Carnes y embutidos",    favorito:false},
  {id:"p31", nombre:"Fruta variada",   unidad:"kg",   categoria:"Frutas y verduras",     favorito:true},
  {id:"p32", nombre:"Pan",             unidad:"ud",   categoria:"Panadería",             favorito:true},
  {id:"p33", nombre:"Papel higiénico", unidad:"paq",  categoria:"Limpieza",              favorito:true},
];

const PLATOS_INIT = [
  {id:"pl1",  nombre:"Lentejas con chorizo",   tipo:"almuerzo", prods:[{pid:"p1",c:500},{pid:"p2",c:200},{pid:"p13",c:1}]},
  {id:"pl2",  nombre:"Pollo al horno",         tipo:"almuerzo", prods:[{pid:"p3",c:1.2},{pid:"p4",c:1},{pid:"p16",c:0.05}]},
  {id:"pl3",  nombre:"Arroz con atún",         tipo:"almuerzo", prods:[{pid:"p5",c:300},{pid:"p6",c:2},{pid:"p15",c:200}]},
  {id:"pl4",  nombre:"Merluza al vapor",       tipo:"almuerzo", prods:[{pid:"p7",c:600},{pid:"p4",c:0.5}]},
  {id:"pl5",  nombre:"Pasta boloñesa",         tipo:"almuerzo", prods:[{pid:"p8",c:500},{pid:"p9",c:400},{pid:"p10",c:1}]},
  {id:"pl6",  nombre:"Paella de pollo",        tipo:"almuerzo", prods:[{pid:"p3",c:1},{pid:"p5",c:400},{pid:"p23",c:2}]},
  {id:"pl7",  nombre:"Cocido madrileño",       tipo:"almuerzo", prods:[{pid:"p9",c:300},{pid:"p1",c:200},{pid:"p29",c:200},{pid:"p30",c:150}]},
  {id:"pl8",  nombre:"Salmón al horno",        tipo:"almuerzo", prods:[{pid:"p24",c:600},{pid:"p4",c:400}]},
  {id:"pl9",  nombre:"Macarrones gratinados",  tipo:"almuerzo", prods:[{pid:"p8",c:500},{pid:"p26",c:1},{pid:"p27",c:200}]},
  {id:"pl10", nombre:"Tortilla de patatas",    tipo:"cena",     prods:[{pid:"p11",c:6},{pid:"p4",c:0.5},{pid:"p16",c:0.05}]},
  {id:"pl11", nombre:"Crema de verduras",      tipo:"cena",     prods:[{pid:"p19",c:500},{pid:"p28",c:2},{pid:"p22",c:0.2}]},
  {id:"pl12", nombre:"Huevos con champiñones", tipo:"cena",     prods:[{pid:"p11",c:4},{pid:"p12",c:300}]},
  {id:"pl13", nombre:"Ensalada mixta",         tipo:"cena",     prods:[{pid:"p14",c:1},{pid:"p15",c:200},{pid:"p16",c:0.03}]},
  {id:"pl14", nombre:"Revuelto de gambas",     tipo:"cena",     prods:[{pid:"p17",c:300},{pid:"p11",c:4}]},
  {id:"pl15", nombre:"Crema de calabaza",      tipo:"cena",     prods:[{pid:"p19",c:800},{pid:"p22",c:0.2}]},
  {id:"pl16", nombre:"Ensalada caprese",       tipo:"cena",     prods:[{pid:"p15",c:300},{pid:"p25",c:250}]},
];

const SEMANAS_INIT = [
  {id:"s1",nombre:"Semana A",color:"#C8A96E",almuerzos:["pl1","pl2","pl3","pl4","pl5"],cenas:["pl10","pl11","pl12","pl13"]},
  {id:"s2",nombre:"Semana B",color:"#7EB8A4",almuerzos:["pl6","pl7","pl8","pl9","pl2"],cenas:["pl14","pl15","pl16","pl10"]},
  {id:"s3",nombre:"Semana C",color:"#C47E7E",almuerzos:["pl1","pl4","pl5","pl8","pl6"],cenas:["pl10","pl13","pl14","pl16"]},
];

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const DOC_ID = "familia";
const guardandoRef = { current: false };
const timerRef = { current: null };

function guardarFirebase(estado) {
  if (timerRef.current) clearTimeout(timerRef.current);
  timerRef.current = setTimeout(() => {
    guardandoRef.current = true;
    setDoc(doc(db, "compra", DOC_ID), estado).finally(() => {
      setTimeout(() => { guardandoRef.current = false; }, 500);
    });
  }, 800);
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function fmt(cantidad, unidad) {
  if (!cantidad && cantidad !== 0) return "";
  const n = parseFloat(cantidad);
  if (isNaN(n) || n === 0) return "";
  if (Number.isInteger(n)) return `${n} ${unidad}`;
  return `${parseFloat(n.toFixed(2))} ${unidad}`;
}

// Construye mapa nombre->cantidad sumando menú + favoritos
function calcMapaMenu(semana, platos, productos, quitados) {
  const mapa = {};

  // 1. Sumar productos del menú activo
  const activos = [
    ...(semana?.almuerzos||[]).filter(id=>!quitados.includes(id+"|a")),
    ...(semana?.cenas||[]).filter(id=>!quitados.includes(id+"|c")),
  ];
  activos.forEach(platId => {
    const plato = platos.find(p=>p.id===platId);
    if (!plato) return;
    plato.prods.forEach(({pid,c}) => {
      const prod = productos.find(p=>p.id===pid);
      if (!prod) return;
      const cantidad = parseFloat(c) || 0;
      if (mapa[pid]) mapa[pid].cantidad += cantidad;
      else mapa[pid] = { pid, nombre:prod.nombre, cantidad, unidad:prod.unidad, categoria:prod.categoria };
    });
  });

  // 2. Sumar favoritos (cantidad fija de 1 por defecto si no tienen cantidad definida)
  productos.filter(p=>p.favorito).forEach(prod => {
    const cantFav = parseFloat(prod.cantidadFav) || 1;
    if (mapa[prod.id]) mapa[prod.id].cantidad += cantFav;
    else mapa[prod.id] = { pid:prod.id, nombre:prod.nombre, cantidad:cantFav, unidad:prod.unidad, categoria:prod.categoria };
  });

  return mapa;
}

// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [pantalla,      setPantalla]      = useState("lista");
  const [productos,     setProductos]     = useState(PRODUCTOS_INIT);
  const [platos,        setPlatos]        = useState(PLATOS_INIT);
  const [semanas,       setSemanas]       = useState(SEMANAS_INIT);
  const [idxSemana,     setIdxSemana]     = useState(0);
  const [quitados,      setQuitados]      = useState([]);
  const [checks,        setChecks]        = useState({});
  const [listaSuper,    setListaSuper]    = useState([]);
  const [manuales,      setManuales]      = useState([]);
  const [cargado,       setCargado]       = useState(false);
  const estadoRef = useRef({});

  // ── Carga desde Firebase ──
  useEffect(() => {
    const ref = doc(db, "compra", DOC_ID);
    const unsub = onSnapshot(ref, (snap) => {
      if (guardandoRef.current) return;
      if (snap.exists()) {
        const d = snap.data();
        if (d.productos)  setProductos(d.productos);
        if (d.platos)     setPlatos(d.platos);
        if (d.semanas)    setSemanas(d.semanas);
        if (d.idxSemana !== undefined) setIdxSemana(d.idxSemana);
        if (d.quitados)   setQuitados(d.quitados);
        if (d.checks)     setChecks(d.checks);
        if (d.listaSuper) setListaSuper(d.listaSuper);
        if (d.manuales)   setManuales(d.manuales||[]);
        const pa = d.pantalla || "lista";
        setPantalla(pa==="super" && (d.listaSuper||[]).length>0 ? "super" : pa==="ajustes" ? "ajustes" : "lista");
      } else {
        const inicial = {
          pantalla:"lista", productos:PRODUCTOS_INIT, platos:PLATOS_INIT,
          semanas:SEMANAS_INIT, idxSemana:0, quitados:[], checks:{},
          listaSuper:[], manuales:[],
        };
        setDoc(ref, inicial);
      }
      setCargado(true);
    });
    return () => unsub();
  }, []);

  // ── Guardar en Firebase cuando cambia el estado ──
  useEffect(() => {
    if (!cargado) return;
    const estado = {
      pantalla, productos, platos, semanas, idxSemana,
      quitados, checks, listaSuper, manuales,
    };
    guardarFirebase(estado);
  }, [pantalla, productos, platos, semanas, idxSemana, quitados, checks, listaSuper, manuales, cargado]);

  const semana = semanas[idxSemana % Math.max(semanas.length,1)] || semanas[0];

  function rotarSemana() {
    const nuevaIdx   = (idxSemana + 1) % semanas.length;
    const nuevaSemana= semanas[nuevaIdx % Math.max(semanas.length,1)] || semanas[0];
    const nuevoMapa  = calcMapaMenu(nuevaSemana, platos, productos, []);
    const idsNuevoMenu = new Set(Object.keys(nuevoMapa));
    const idsFav     = new Set(productos.filter(p=>p.favorito).map(p=>p.id));

    // Productos manuales: marcados en checks, no favoritos, no en menú actual
    // y no tachados en el supermercado
    const idsTachados = new Set(listaSuper.filter(p=>p.comprado).map(p=>p.id));
    const manualesVivos = productos.filter(prod => {
      const esManual = checks[prod.id] === true && !idsFav.has(prod.id) && !Object.keys(calcMapaMenu(semana, platos, productos, quitados)).includes(prod.id);
      const noTachado = !idsTachados.has(prod.id);
      return esManual && noTachado;
    }).map(prod => ({
      id: prod.id, nombre: prod.nombre, cantidad: 1,
      unidad: prod.unidad, categoria: prod.categoria,
      comprado: false, manual: true,
    }));

    const idsYaEnLista = new Set(manualesVivos.map(p=>p.id));

    // Nueva lista base: menú nuevo + favoritos
    const nuevaLista = [];
    productos.forEach(prod => {
      const enMenu = nuevoMapa[prod.id];
      const esFav  = prod.favorito;
      if ((enMenu || esFav) && !idsYaEnLista.has(prod.id)) {
        nuevaLista.push({
          id: prod.id, nombre: prod.nombre,
          cantidad: enMenu ? enMenu.cantidad : (parseFloat(prod.cantidadFav)||1),
          unidad: prod.unidad, categoria: prod.categoria,
          comprado: false, manual: false,
        });
      }
    });

    // Preservar checks manuales vivos para la nueva semana
    const nuevosChecks = {};
    manualesVivos.forEach(p => { nuevosChecks[p.id] = true; });

    setIdxSemana(nuevaIdx);
    setQuitados([]);
    setChecks(nuevosChecks);
    setListaSuper([...manualesVivos, ...nuevaLista]);
    setManuales(manualesVivos.map(p=>p.id));
  }

  function toggleCheck(pid) {
    const mapaMenu  = calcMapaMenu(semana, platos, productos, quitados);
    const idsActivos = new Set([
      ...Object.keys(mapaMenu),
      ...productos.filter(p=>p.favorito).map(p=>p.id)
    ]);
    const actual = checks[pid] !== undefined ? checks[pid] : idsActivos.has(pid);
    const nuevoValor = !actual;
    const prod = productos.find(p=>p.id===pid);
    if (!prod) return;
    const esFav    = prod.favorito;
    const enMenu   = mapaMenu[pid];
    const esManual = !enMenu && !esFav;

    setChecks(ch=>({...ch,[pid]:nuevoValor}));

    // Actualizar estado manuales siempre (independiente del supermercado)
    if (esManual) {
      if (nuevoValor) {
        setManuales(m=>[...new Set([...m, pid])]);
      } else {
        setManuales(m=>m.filter(id=>id!==pid));
      }
    }

    // Sincronizar listaSuper si está activa
    if (listaSuper.length > 0) {
      if (nuevoValor) {
        if (!listaSuper.find(p=>p.id===pid)) {
          setListaSuper(l=>[...l, {
            id: prod.id, nombre: prod.nombre,
            cantidad: enMenu ? enMenu.cantidad : 1,
            unidad: prod.unidad, categoria: prod.categoria,
            comprado: false, manual: esManual,
          }]);
        }
      } else {
        setListaSuper(l=>l.filter(p=>!(p.id===pid && !p.comprado)));
      }
    }
  }

  function quitarPlato(platId, tipo) {
    const key = `${platId}|${tipo==="almuerzo"?"a":"c"}`;
    setQuitados(q=>q.includes(key)?q.filter(k=>k!==key):[...q,key]);
  }

  function quitarTodos() {
    const todosAlm = (semana?.almuerzos||[]).map(id=>id+"|a");
    const todosCen = (semana?.cenas||[]).map(id=>id+"|c");
    const todos = [...todosAlm,...todosCen];
    const yaQuitados = todos.every(k=>quitados.includes(k));
    setQuitados(yaQuitados ? [] : todos);
  }

  function irAlSuper() {
    if (listaSuper.length > 0) {
      setPantalla("super");
      return;
    }
    // Generar lista por primera vez
    const mapaMenu = calcMapaMenu(semana, platos, productos, quitados);
    const lista = [];
    productos.forEach(prod => {
      const enMenu  = mapaMenu[prod.id];
      const esFav   = prod.favorito;
      const esManual = !enMenu && !esFav && checks[prod.id] === true;
      const checked = checks[prod.id] !== undefined ? checks[prod.id] : (!!enMenu || esFav);
      if (checked) {
        lista.push({
          id: prod.id,
          nombre: prod.nombre,
          cantidad: enMenu ? enMenu.cantidad : 1,
          unidad: prod.unidad,
          categoria: prod.categoria,
          comprado: false,
          manual: esManual,
        });
      }
    });
    setListaSuper(lista);
    setPantalla("super");
  }

  function marcarComprado(id) {
    setListaSuper(l=>l.map(p=>p.id===id?{...p,comprado:!p.comprado}:p));
  }

  if (!cargado) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",
      height:"100vh",background:"#0F0E0C",flexDirection:"column",gap:12}}>
      <div style={{fontSize:40}}>🛒</div>
      <div style={{color:"#444",fontSize:13}}>Cargando...</div>
    </div>
  );

  if (pantalla==="ajustes") return (
    <Ajustes productos={productos} setProductos={setProductos}
      platos={platos} setPlatos={setPlatos}
      semanas={semanas} setSemanas={setSemanas}
      volver={()=>setPantalla("lista")} />
  );

  if (pantalla==="super") return (
    <Super lista={listaSuper} marcarComprado={marcarComprado}
      volver={()=>setPantalla("lista")}
      siguienteSemana={rotarSemana} />
  );

  return (
    <Lista
      semana={semana} platos={platos} productos={productos}
      quitados={quitados} quitarPlato={quitarPlato} quitarTodos={quitarTodos}
      checks={checks} toggleCheck={toggleCheck}
      irAlSuper={irAlSuper}
      rotarSemana={rotarSemana}
      abrirAjustes={()=>setPantalla("ajustes")} />
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PANTALLA LISTA
// ══════════════════════════════════════════════════════════════════════════════
function Lista({ semana, platos, productos, quitados, quitarPlato, quitarTodos,
  checks, toggleCheck, irAlSuper, rotarSemana,
  abrirAjustes }) {

  const [tab, setTab] = useState("lista");
  const color = semana?.color || "#C8A96E";

  // IDs de productos que toca esta semana (menú activo)
  const mapaMenu  = calcMapaMenu(semana, platos, productos, quitados);
  const idsMenu   = new Set(Object.keys(mapaMenu));
  const idsFav    = new Set(productos.filter(p=>p.favorito).map(p=>p.id));
  const idsActivos= new Set([...idsMenu,...idsFav]);

  // Para cada producto, ¿está marcado?
  function isChecked(pid) {
    if (checks[pid] !== undefined) return checks[pid];
    return idsActivos.has(pid);
  }

  const totalComprar = productos.filter(p=>isChecked(p.id)).length;

  // Todos los platos quitados?
  const totalPlatos = (semana?.almuerzos?.length||0) + (semana?.cenas?.length||0);
  const todosQuitados = quitados.length === totalPlatos && totalPlatos > 0;

  return (
    <div style={S.app}>
      <div style={S.glow}/>

      {/* HEADER */}
      <div style={S.header}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div>
            {/* Semana como etiqueta pequeña encima */}
            <div style={{fontSize:10,color:color,
              fontWeight:"700",letterSpacing:"0.15em",textTransform:"uppercase",
              marginBottom:4,opacity:0.85}}>
              {semana?.nombre}
            </div>
            {/* Título principal con punto */}
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{...S.titulo,fontSize:28,letterSpacing:"-1px"}}>
                La Compra
              </div>
              <div style={{width:10,height:10,borderRadius:"50%",
                background:color,boxShadow:`0 0 8px ${color}88`,
                marginBottom:2,flexShrink:0}}/>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={abrirAjustes} style={S.btnIcon}>⚙️</button>
          </div>
        </div>
        <div style={{marginTop:12}}><Tabs tab={tab} setTab={setTab} color={color}
          tabs={[["lista","📝 Lista"],["menu","🍽 Menú"]]}/></div>
      </div>

      {/* CONTENIDO */}
      <div style={S.scroll}>
        {/* ── TAB MENÚ ── */}
        {tab==="menu" && (
          <TabMenu semana={semana} platos={platos} productos={productos} quitados={quitados}
            quitarPlato={quitarPlato} quitarTodos={quitarTodos}
            todosQuitados={todosQuitados} color={color} rotarSemana={rotarSemana}/>
        )}
        {/* ── TAB LISTA ── */}
        {tab==="lista" && (
          <TabLista productos={productos} idsActivos={idsActivos}
            mapaMenu={mapaMenu} checks={checks} toggleCheck={toggleCheck}
            color={color} totalComprar={totalComprar}/>
        )}
        <div style={{height:110}}/>
      </div>

      {/* FOOTER */}
      <div style={S.footer}>
        <button onClick={irAlSuper} disabled={totalComprar===0}
          style={{...S.btnSuper,background:color,
            opacity:totalComprar===0?0.35:1,
            boxShadow:`0 4px 24px ${color}44`}}>
          <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              <span style={{background:"rgba(0,0,0,0.2)",borderRadius:"50%",
                width:30,height:30,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:15,flexShrink:0}}>
                🛒
              </span>
              Ir al supermercado · {totalComprar} productos
            </span>
        </button>
      </div>
    </div>
  );
}

// ── TAB MENÚ ──────────────────────────────────────────────────────────────────
function TabMenu({ semana, platos, productos, quitados, quitarPlato, quitarTodos, todosQuitados, color, rotarSemana }) {
  return (
    <div style={{padding:"18px 20px 0"}}>
      {/* Botones superiores */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <button onClick={quitarTodos}
          style={{...S.btnGhost,flex:1,fontSize:12,padding:"8px",
            borderColor:todosQuitados?"#C47E7E55":"#2a2720",
            color:todosQuitados?"#C47E7E":"#666"}}>
          {todosQuitados?"✓ Activar todos":"✗ Quitar todos"}
        </button>
        <button onClick={rotarSemana}
          style={{...S.btnGhost,flex:1,fontSize:12,padding:"8px"}}>
          🔄 Rotar semana
        </button>
      </div>

      <div style={{color:"#555",fontSize:12,marginBottom:14,lineHeight:1.6}}>
        Toca un plato para quitarlo esta semana. Sus productos se eliminarán de la lista.
      </div>

      {[["almuerzo","🍽 Almuerzos",semana?.almuerzos||[]],
        ["cena","🌙 Cenas",semana?.cenas||[]]].map(([tipo,label,ids])=>(
        <div key={tipo} style={{marginBottom:22}}>
          <div style={S.catHeaderEl}>
            <span>{label}</span>
            <span style={{marginLeft:"auto",fontSize:11,color:"#555"}}>
              {ids.filter(id=>!quitados.includes(id+"|"+(tipo==="almuerzo"?"a":"c"))).length} activos
            </span>
          </div>
          {ids.map(platId => {
            const plato = platos.find(p=>p.id===platId);
            if (!plato) return null;
            const key  = platId+"|"+(tipo==="almuerzo"?"a":"c");
            const fuera= quitados.includes(key);
            return (
              <div key={platId} onClick={()=>quitarPlato(platId,tipo)}
                style={{...S.platoCard,opacity:fuera?0.32:1,
                  borderColor:fuera?"#1E1C18":`${color}40`,
                  background:fuera?"#141312":"#1C1A17"}}>
                <div style={{...S.dot,background:fuera?"#2a2a2a":color}}/>
                <span style={{flex:1,fontSize:15,color:fuera?"#444":"#F0EAD6",
                  textDecoration:fuera?"line-through":"none"}}>
                  {plato.nombre}
                </span>
                <span style={{fontSize:11,color:fuera?"#333":"#555"}}>
                  {fuera?"quitado":`${plato.prods.filter(pr=>productos.find(p=>p.id===pr.pid)).length} prod.`}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── TAB LISTA ─────────────────────────────────────────────────────────────────
function TabLista({ productos, idsActivos, mapaMenu, checks, toggleCheck, color, totalComprar }) {
  return (
    <div style={{padding:"18px 20px 0"}}>
      <div style={S.infoRow}>
        <span style={{color:"#5a5650",fontSize:11,letterSpacing:"0.03em"}}>Marca lo que necesitas comprar</span>
        <span style={{color,fontSize:13,fontWeight:"bold"}}>{totalComprar} productos</span>
      </div>

      {CATEGORIAS.map(cat => {
        const prodsEnCat = productos
          .filter(p=>p.categoria===cat)
          .sort((a,b)=>a.nombre.localeCompare(b.nombre,"es"));
        if (!prodsEnCat.length) return null;

        const activos   = prodsEnCat.filter(p=>idsActivos.has(p.id));
        const restantes = prodsEnCat.filter(p=>!idsActivos.has(p.id));

        return (
          <div key={cat} style={{marginBottom:22}}>
            {/* Cabecera categoría */}
            <div style={S.catHeaderEl}>
              <span>{ICONOS[cat]||"📦"}</span>
              <span style={{flex:1}}>{cat}</span>
              <span style={{color:"#444",fontSize:11}}>
                {prodsEnCat.filter(p=>{
                  const ch=checks[p.id];
                  return ch!==undefined?ch:idsActivos.has(p.id);
                }).length}/{prodsEnCat.length}
              </span>
            </div>

            {/* Productos activos (menú + favoritos) */}
            {activos.map(p => {
              const checked = checks[p.id]!==undefined ? checks[p.id] : true;
              const enMenu  = mapaMenu[p.id];
              return (
                <div key={p.id} onClick={()=>toggleCheck(p.id)}
                  style={{...S.itemRow,opacity:checked?1:0.6}}>
                  <div style={{...S.check,background:checked?color:"transparent",
                    borderColor:checked?color:"#2a2720"}}>
                    {checked&&<span style={{color:"#0F0E0C",fontSize:10,fontWeight:"bold",lineHeight:1}}>✓</span>}
                  </div>
                  <span style={{flex:1,fontSize:15,color:checked?"#F0EAD6":"#555",
                    
                    textDecoration:checked?"none":"line-through"}}>
                    {p.nombre}
                  </span>
                  {p.favorito && <span style={{fontSize:10,color:"#C8A96E",marginRight:2}}>⭐</span>}
                  {enMenu && <span style={{fontSize:11,color:"#555"}}>{fmt(enMenu.cantidad,enMenu.unidad)}</span>}
                </div>
              );
            })}

            {/* Divisor si hay restantes */}
            {restantes.length>0 && activos.length>0 && (
              <div style={{borderTop:"1px dashed #1E1C18",margin:"6px 0 4px",opacity:0.5}}/>
            )}

            {/* Productos restantes (no tocan, pero disponibles) */}
            {restantes.map(p => {
              const checked = checks[p.id] === true;
              return (
                <div key={p.id} onClick={()=>toggleCheck(p.id)}
                  style={{...S.itemRow,opacity:checked?0.85:0.5,background:"#161412"}}>
                  <div style={{...S.check,background:checked?color:"transparent",
                    borderColor:checked?color:"#252220"}}>
                    {checked&&<span style={{color:"#0F0E0C",fontSize:10,fontWeight:"bold",lineHeight:1}}>✓</span>}
                  </div>
                  <span style={{flex:1,fontSize:15,color:checked?"#C8B89A":"#444",
                    }}>
                    {p.nombre}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SUPERMERCADO
// ══════════════════════════════════════════════════════════════════════════════
function Super({ lista, marcarComprado, volver, siguienteSemana }) {
  const total     = lista.length;
  const comprados = lista.filter(p=>p.comprado).length;
  const pct       = total>0?Math.round((comprados/total)*100):0;
  const listo     = comprados===total && total>0;

  const porCat = CATEGORIAS.reduce((acc,cat)=>{
    const items = [...lista.filter(p=>p.categoria===cat)]
      .sort((a,b)=>a.nombre.localeCompare(b.nombre,"es"));
    if(items.length) acc[cat]=items;
    return acc;
  },{});

  function compartirWhatsApp() {
    let texto = "🛒 *Lista de la compra*\n";
    CATEGORIAS.forEach(cat => {
      const items = lista.filter(p=>p.categoria===cat);
      if (!items.length) return;
      const icono = {"Frutas y verduras":"🥦","Carnes y embutidos":"🥩","Pescados y mariscos":"🐟",
        "Lácteos y huevos":"🥚","Legumbres y conservas":"🫙","Panadería":"🍞",
        "Aceites y salsas":"🫒","Bebidas":"🧃","Limpieza":"🧹",
        "Cosmética y cuidado personal":"🧴","Otros":"📦"}[cat]||"📦";
      texto += `\n${icono} *${cat}*\n`;
      items.sort((a,b)=>a.nombre.localeCompare(b.nombre,"es"))
        .forEach(p => {
          const cant = p.cantidad && p.unidad ? ` (${p.cantidad} ${p.unidad})` : "";
          const tachado = p.comprado ? "✅ ~" : "☐ ";
          const cierre  = p.comprado ? "~" : "";
          texto += `  ${tachado}${p.nombre}${cant}${cierre}\n`;
        });
    });
    if (navigator.share) {
      navigator.share({ text: texto });
    } else {
      const url = "https://wa.me/?text=" + encodeURIComponent(texto);
      window.open(url, "_blank");
    }
  }

  return (
    <div style={S.app}>
      <div style={{...S.glow,background:"radial-gradient(ellipse 80% 40% at 50% -10%, #7EB8A418 0%, transparent 70%)"}}/>
      <div style={S.header}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <button onClick={volver} style={S.btnBack}>‹</button>
          <div style={{...S.titulo,flex:1}}>Supermercado</div>
          <button onClick={compartirWhatsApp}
            title="Compartir lista"
            style={{background:"#4A9ECC",border:"none",color:"#fff",
              width:38,height:38,borderRadius:8,cursor:"pointer",
              fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
            📤
          </button>

        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <span style={{fontSize:12,color:"#555"}}>{comprados} de {total} productos</span>
          <span style={{fontSize:12,color:listo?"#7EB8A4":"#555"}}>
            {listo?"🎉 ¡Listo!":pct+"%"}
          </span>
        </div>
        <div style={{background:"#1A1815",borderRadius:3,height:5,overflow:"hidden"}}>
          <div style={{height:"100%",background:"#7EB8A4",borderRadius:3,
            width:pct+"%",transition:"width .5s cubic-bezier(.4,0,.2,1)"}}/>
        </div>
      </div>

      <div style={{...S.scroll,padding:'0 20px'}}>
        <div style={{height:8}}/>
        {Object.entries(porCat).map(([cat,items])=>(
          <div key={cat} style={{marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",gap:10,
              marginBottom:6,paddingBottom:8,marginTop:24,
              borderBottom:"2px solid #1E1C18"}}>
              <span style={{fontSize:18}}>{ICONOS[cat]||"📦"}</span>
              <span style={{flex:1,fontSize:13,color:"#C8A96E",fontWeight:"900",
                letterSpacing:"0.08em",
                textTransform:"uppercase"}}>{cat}</span>
              <span style={{fontSize:11,color:"#666",background:"#1C1A17",
                padding:"3px 10px",borderRadius:10,border:"1px solid #252220"}}>
                {items.filter(i=>i.comprado).length}/{items.length}
              </span>
            </div>
            {items.map(p=>(
              <div key={p.id} onClick={()=>marcarComprado(p.id)}
                style={{...S.itemRow,cursor:"pointer",opacity:p.comprado?0.28:1,
                  background:p.comprado?"#141312":"#1C1A17"}}>
                <div style={{...S.check,
                  background:p.comprado?"#7EB8A4":"transparent",
                  borderColor:p.comprado?"#7EB8A4":"#333"}}>
                  {p.comprado&&<span style={{color:"#0F0E0C",fontSize:10,fontWeight:"bold",lineHeight:1}}>✓</span>}
                </div>
                <span style={{flex:1,fontSize:15,
                  textDecoration:p.comprado?"line-through":"none",
                  color:p.comprado?"#444":"#F0EAD6"}}>
                  {p.nombre}
                </span>
                <span style={{fontSize:12,color:"#444"}}>{fmt(p.cantidad,p.unidad)}</span>
              </div>
            ))}
          </div>
        ))}

        {listo && (
          <div style={{textAlign:"center",padding:"24px 0 40px"}}>
            <div style={{fontSize:44,marginBottom:10}}>🎉</div>
            <div style={{color:"#7EB8A4",fontSize:16,marginBottom:6}}>
              ¡Compra completada!
            </div>
            <div style={{color:"#444",fontSize:12,marginBottom:24,lineHeight:1.6}}>
              La semana rotará automáticamente el próximo lunes.
            </div>
            <button onClick={volver}
              style={{...S.btnPrimary,background:"#7EB8A4",color:"#0F0E0C",padding:"14px 32px",fontSize:15}}>
              ← Volver
            </button>
          </div>
        )}
        <div style={{height:40}}/>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AJUSTES
// ══════════════════════════════════════════════════════════════════════════════
function Ajustes({productos,setProductos,platos,setPlatos,semanas,setSemanas,volver}) {
  const [sec,setSec] = useState("productos");
  const secs = [
    ["productos","🥕 Productos"],
    ["platos","👨‍🍳 Recetas"],
    ["semanas","📅 Semanas"]
  ];
  return (
    <div style={S.app}>
      <div style={S.glow}/>
      <div style={S.header}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:0}}>
          <button onClick={volver} style={S.btnBack}>‹</button>
          <div style={S.titulo}>Ajustes</div>
        </div>
        <div style={{display:"flex",gap:2,marginTop:4}}>
          {secs.map(([k,l])=>(
            <button key={k} onClick={()=>setSec(k)}
              style={{flex:1,padding:"13px 4px",
                border:"none",background:"transparent",
                color:sec===k?"#C8A96E":"#444",cursor:"pointer",
                fontSize:15,
                fontWeight:sec===k?"700":"400",
                letterSpacing:"0.01em",
                borderBottom:`3px solid ${sec===k?"#C8A96E":"transparent"}`,
                transition:"all .2s"}}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div style={{...S.scroll,padding:"20px 20px 0"}}>
        {sec==="semanas"   && <SecSemanas  semanas={semanas}  setSemanas={setSemanas}  platos={platos} productos={productos}/>}
        {sec==="platos"    && <SecPlatos   platos={platos}    setPlatos={setPlatos}    productos={productos} setProductos={setProductos}/>}
        {sec==="productos" && <SecProductos productos={productos} setProductos={setProductos} platos={platos}/>}
        <div style={{height:60}}/>
      </div>
    </div>
  );
}

function SecSemanas({semanas,setSemanas,platos,productos}) {
  const [open,setOpen]=useState(null);
  const [sub,setSub]=useState("almuerzos");
  const [ren,setRen]=useState(null);

  function añadir(){
    const letras="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const usadas=new Set(semanas.map(s=>s.nombre.split(" ").pop()));
    const l=letras.split("").find(x=>!usadas.has(x))||`${semanas.length+1}`;
    setSemanas(s=>[...s,{id:`s${Date.now()}`,nombre:`Semana ${l}`,
      color:COLORES[semanas.length%COLORES.length],almuerzos:[],cenas:[]}]);
  }
  function eliminar(id){
    if(semanas.length<=1)return;
    setSemanas(s=>s.filter(x=>x.id!==id));
    if(open===id)setOpen(null);
  }
  function togglePlato(semId,platId,tipo){
    setSemanas(s=>s.map(se=>{
      if(se.id!==semId)return se;
      const arr=se[tipo]||[];
      return{...se,[tipo]:arr.includes(platId)?arr.filter(x=>x!==platId):[...arr,platId]};
    }));
  }
  const filtrados=(tipo)=>platos.filter(p=>p.tipo===(tipo==="almuerzos"?"almuerzo":"cena"))
    .sort((a,b)=>a.nombre.localeCompare(b.nombre,"es"));

  return(
    <div>
      <Hint>Configura los platos de cada semana. La rotación es automática cada lunes.</Hint>
      {semanas.map(sem=>(
        <div key={sem.id} style={{...S.card,borderColor:`${sem.color}30`,marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:8,background:sem.color,flexShrink:0}}/>
            <div style={{flex:1,cursor:"pointer"}} onClick={()=>setOpen(o=>o===sem.id?null:sem.id)}>
              {ren===sem.id
                ?<input autoFocus style={S.input} defaultValue={sem.nombre}
                   onBlur={e=>{setSemanas(s=>s.map(x=>x.id===sem.id?{...x,nombre:e.target.value.trim()||x.nombre}:x));setRen(null);}}
                   onKeyDown={e=>e.key==="Enter"&&e.target.blur()}/>
                :<div style={{color:"#F0EAD6",fontSize:15}}>{sem.nombre}</div>}
              <div style={{color:"#555",fontSize:11,marginTop:2}}>
                {sem.almuerzos?.length||0} almuerzos · {sem.cenas?.length||0} cenas
              </div>
            </div>
            <button style={S.btnIcon} onClick={()=>setRen(sem.id)}>✏️</button>
            {semanas.length>1&&<button style={{...S.btnIcon,color:"#C47E7E"}} onClick={()=>eliminar(sem.id)}>🗑</button>}
            <button style={S.btnIcon} onClick={()=>setOpen(o=>o===sem.id?null:sem.id)}>
              {open===sem.id?"▲":"▼"}
            </button>
          </div>
          <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
            {COLORES.map(c=>(
              <div key={c} onClick={()=>setSemanas(s=>s.map(x=>x.id===sem.id?{...x,color:c}:x))}
                style={{width:22,height:22,borderRadius:"50%",background:c,cursor:"pointer",
                  border:sem.color===c?"2px solid #F0EAD6":"2px solid transparent"}}/>
            ))}
          </div>
          {open===sem.id&&(
            <div style={{marginTop:14,borderTop:"1px solid #1E1C18",paddingTop:14}}>
              <Tabs tab={sub} setTab={setSub} color={sem.color}
                tabs={[["almuerzos","🍽 Almuerzos"],["cenas","🌙 Cenas"]]} small/>
              <div style={{marginTop:10}}>
                {filtrados(sub).map(pl=>{
                  const activo=(sub==="almuerzos"?sem.almuerzos:sem.cenas)?.includes(pl.id);
                  return(
                    <div key={pl.id} onClick={()=>togglePlato(sem.id,pl.id,sub)}
                      style={{...S.itemRow,opacity:activo?1:0.4}}>
                      <div style={{...S.check,background:activo?sem.color:"transparent",
                        borderColor:activo?sem.color:"#2a2720"}}>
                        {activo&&<span style={{color:"#0F0E0C",fontSize:10,fontWeight:"bold",lineHeight:1}}>✓</span>}
                      </div>
                      <span style={{flex:1,fontSize:15,color:activo?"#F0EAD6":"#555"}}>{pl.nombre}</span>
                      <span style={{fontSize:11,color:"#555"}}>{pl.prods.filter(pr=>productos.find(p=>p.id===pr.pid)).length} prod.</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}
      <button onClick={añadir} style={{...S.btnGhost,width:"100%",borderStyle:"dashed",marginTop:4}}>
        + Nueva semana
      </button>
    </div>
  );
}

function SecPlatos({platos,setPlatos,productos,setProductos}) {
  const [open,setOpen]       = useState(null);
  const [nuevo,setNuevo]     = useState(null);
  const [ia,setIa]           = useState(null); // { tipo, texto, analizando, resultado }

  function guardar(){
    if(!nuevo?.nombre?.trim())return;
    setPlatos(p=>[...p,nuevo]);
    setNuevo(null);
  }
  function eliminar(id){setPlatos(p=>p.filter(x=>x.id!==id));}
  function toggleProd(platId,prodId){
    setPlatos(p=>p.map(pl=>{
      if(pl.id!==platId)return pl;
      const tiene=pl.prods.find(x=>x.pid===prodId);
      return{...pl,prods:tiene?pl.prods.filter(x=>x.pid!==prodId):[...pl.prods,{pid:prodId,c:1}]};
    }));
  }
  function setCantidad(platId,prodId,val){
    setPlatos(p=>p.map(pl=>{
      if(pl.id!==platId)return pl;
      // Allow empty/partial input during editing, store as-is
      const num = val === "" ? "" : parseFloat(val);
      return{...pl,prods:pl.prods.map(x=>x.pid===prodId?{...x,c:num}:x)};
    }));
  }
  function fijarCantidad(platId,prodId,val){
    // On blur, ensure valid number
    const num = parseFloat(val);
    if(!num || num <= 0){
      setPlatos(p=>p.map(pl=>{
        if(pl.id!==platId)return pl;
        return{...pl,prods:pl.prods.map(x=>x.pid===prodId?{...x,c:1}:x)};
      }));
    }
  }

  async function analizarReceta() {
    if (!ia?.texto?.trim() && !ia?.imagen) return;
    setIa(s=>({...s,analizando:true,resultado:null,error:null}));
    const CATS = ["Frutas y verduras","Carnes y embutidos","Pescados y mariscos","Lácteos y huevos","Legumbres y conservas","Panadería, bollería y snacks","Aceites, salsas y condimentos","Congelados","Bebidas","Limpieza","Cosmética y cuidado personal","Otros"];
    const PROMPT = `Analiza esta receta y extrae el nombre del plato y los ingredientes con cantidades.
Responde SOLO con JSON válido, sin texto adicional, sin bloques de código:
{"nombre":"nombre del plato","ingredientes":[{"nombre":"ingrediente","cantidad":número,"unidad":"ud|kg|L","categoria":"categoría"}]}
Unidades: ud (unidades/piezas/latas/botes), kg (kilos/gramos como decimales ej 0.5), L (litros/ml como decimales ej 0.25). Si no hay cantidad clara usa 1 ud.
Categorías disponibles (elige la más apropiada): ${CATS.join(", ")}.`;

    try {
      let content;
      if (ia.imagen) {
        content = [
          {type:"image",source:{type:"base64",media_type:ia.imagenTipo,data:ia.imagen}},
          {type:"text",text:PROMPT}
        ];
      } else {
        content = `${PROMPT}
Receta: ${ia.texto}`;
      }
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{role:"user",content}]
        })
      });
      const data = await res.json();
      const txt  = data.content.map(i=>i.text||"").join("");
      const clean= txt.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      setIa(s=>({...s,analizando:false,resultado:{...parsed,tipo:s.tipo}}));
    } catch(e) {
      setIa(s=>({...s,analizando:false,error:"No se pudo analizar. Inténtalo de nuevo."}));
    }
  }

  function handleImagen(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const base64 = ev.target.result.split(",")[1];
      setIa(s=>({...s,imagen:base64,imagenTipo:file.type,texto:""}));
    };
    reader.readAsDataURL(file);
  }

  function confirmarReceta() {
    if (!ia?.resultado) return;
    const r = ia.resultado;
    const nuevosProds = [];
    const prodsPlato  = [];

    r.ingredientes.forEach(ing => {
      // Buscar si ya existe en catálogo
      const existe = productos.find(p=>
        p.nombre.toLowerCase().trim() === ing.nombre.toLowerCase().trim()
      );
      if (existe) {
        prodsPlato.push({pid:existe.id, c:ing.cantidad||1});
      } else {
        const id = `p${Date.now()}${Math.random().toString(36).slice(2,6)}`;
        const unidad = ["ud","kg","L"].includes(ing.unidad) ? ing.unidad : "ud";
        const catValida = ["Frutas y verduras","Carnes y embutidos","Pescados y mariscos","Lácteos y huevos","Legumbres y conservas","Panadería, bollería y snacks","Aceites, salsas y condimentos","Congelados","Bebidas","Limpieza","Cosmética y cuidado personal","Otros"];
        const categoria = catValida.includes(ing.categoria) ? ing.categoria : "Otros";
        nuevosProds.push({id, nombre:ing.nombre, unidad, categoria, favorito:false});
        prodsPlato.push({pid:id, c:ing.cantidad||1});
      }
    });

    if (nuevosProds.length > 0) {
      setProductos(p=>[...p,...nuevosProds]);
    }
    setPlatos(p=>[...p,{
      id:`pl${Date.now()}`,
      nombre:r.nombre,
      tipo:r.tipo,
      prods:prodsPlato
    }]);
    setIa(null);
  }

  return(
    <div>
      <Hint>Cada receta tiene su lista de productos y cantidades.</Hint>
      {[["almuerzo","🍽 Almuerzos"],["cena","🌙 Cenas"]].map(([tipo,label])=>(
        <div key={tipo} style={{marginBottom:24}}>
          <div style={S.catHeaderEl}><span>{label}</span></div>
          {platos.filter(p=>p.tipo===tipo).sort((a,b)=>a.nombre.localeCompare(b.nombre,"es")).map(pl=>(
            <div key={pl.id} style={{...S.card,marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{flex:1,cursor:"pointer",color:"#F0EAD6",fontSize:15}}
                  onClick={()=>setOpen(o=>o===pl.id?null:pl.id)}>
                  {pl.nombre}
                  <span style={{color:"#555",fontSize:11,marginLeft:8}}>{pl.prods.filter(pr=>productos.find(p=>p.id===pr.pid)).length} prod.</span>
                </div>
                <button style={S.btnIcon} onClick={()=>setOpen(o=>o===pl.id?null:pl.id)}>
                  {open===pl.id?"▲":"▼"}
                </button>
                <button style={{...S.btnIcon,color:"#C47E7E"}} onClick={()=>eliminar(pl.id)}>🗑</button>
              </div>
              {open===pl.id&&(
                <div style={{marginTop:12,borderTop:"1px solid #1E1C18",paddingTop:12}}>
                  <div style={{color:"#555",fontSize:11,marginBottom:8}}>Toca para añadir/quitar:</div>
                  {[...productos].sort((a,b)=>a.nombre.localeCompare(b.nombre,"es")).map(prod=>{
                    const en=pl.prods.find(x=>x.pid===prod.id);
                    return(
                      <div key={prod.id} style={{...S.itemRow,opacity:en?1:0.4}}>
                        <div onClick={()=>toggleProd(pl.id,prod.id)}
                          style={{...S.check,background:en?"#C8A96E":"transparent",
                            borderColor:en?"#C8A96E":"#333",cursor:"pointer"}}>
                          {en&&<span style={{color:"#0F0E0C",fontSize:10,fontWeight:"bold"}}>✓</span>}
                        </div>
                        <span style={{flex:1,fontSize:13,color:en?"#F0EAD6":"#555"}}>{prod.nombre}</span>
                        {en&&<>
                          <input key={`${pl.id}-${prod.id}`} type="number" step="0.01" min="0"
                            defaultValue={en.c}
                            onBlur={e=>fijarCantidad(pl.id,prod.id,e.target.value)}
                            style={{...S.input,width:60,padding:"3px 8px",fontSize:12,textAlign:"right"}}/>
                          <span style={{fontSize:11,color:"#555",marginLeft:4,minWidth:24}}>{prod.unidad}</span>
                        </>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      {/* ── Formulario IA ── */}
      {ia && !ia.resultado && (
        <div style={{...S.card,marginBottom:10,borderColor:"#C8A96E44"}}>
          <div style={{color:"#C8A96E",fontSize:13,marginBottom:10,fontWeight:"bold"}}>
            ✨ Añadir plato con IA
          </div>
          <select value={ia.tipo} onChange={e=>setIa(s=>({...s,tipo:e.target.value}))}
            style={{...S.input,width:"100%",boxSizing:"border-box",marginBottom:10}}>
            <option value="almuerzo">Almuerzo</option>
            <option value="cena">Cena</option>
          </select>

          {/* Tabs texto / imagen */}
          <div style={{display:"flex",gap:4,marginBottom:10}}>
            <button onClick={()=>setIa(s=>({...s,modo:"texto",imagen:null}))}
              style={{flex:1,padding:"7px",border:"none",borderRadius:6,cursor:"pointer",
                fontSize:12,
                background:(!ia.modo||ia.modo==="texto")?"#C8A96E22":"transparent",
                color:(!ia.modo||ia.modo==="texto")?"#C8A96E":"#555",
                borderBottom:`2px solid ${(!ia.modo||ia.modo==="texto")?"#C8A96E":"transparent"}`}}>
              📝 Texto
            </button>
            <button onClick={()=>setIa(s=>({...s,modo:"imagen",texto:""}))}
              style={{flex:1,padding:"7px",border:"none",borderRadius:6,cursor:"pointer",
                fontSize:12,
                background:ia.modo==="imagen"?"#C8A96E22":"transparent",
                color:ia.modo==="imagen"?"#C8A96E":"#555",
                borderBottom:`2px solid ${ia.modo==="imagen"?"#C8A96E":"transparent"}`}}>
              📷 Imagen
            </button>
          </div>

          {(!ia.modo||ia.modo==="texto") && (
            <textarea
              placeholder="Pega aquí la receta..."
              value={ia.texto}
              onChange={e=>setIa(s=>({...s,texto:e.target.value}))}
              rows={5}
              style={{...S.input,width:"100%",boxSizing:"border-box",
                marginBottom:10,resize:"vertical",lineHeight:1.5}}/>
          )}

          {ia.modo==="imagen" && (
            <div style={{marginBottom:10}}>
              <label style={{display:"block",cursor:"pointer"}}>
                <div style={{...S.input,width:"100%",boxSizing:"border-box",
                  textAlign:"center",padding:"20px 12px",borderStyle:"dashed",
                  color:ia.imagen?"#7EB8A4":"#555",cursor:"pointer"}}>
                  {ia.imagen ? "✓ Imagen cargada — pulsa Analizar" : "📷 Toca para subir foto de la receta"}
                </div>
                <input type="file" accept="image/*" onChange={handleImagen}
                  style={{display:"none"}}/>
              </label>
              {ia.imagen && (
                <button onClick={()=>setIa(s=>({...s,imagen:null,imagenTipo:null}))}
                  style={{...S.btnGhost,width:"100%",marginTop:6,fontSize:12}}>
                  ✕ Quitar imagen
                </button>
              )}
            </div>
          )}

          <div style={{display:"flex",gap:8}}>
            <button onClick={analizarReceta}
              disabled={ia.analizando||(!ia.texto?.trim()&&!ia.imagen)}
              style={{...S.btnPrimary,flex:2,background:"#C8A96E",color:"#0F0E0C",
                opacity:(ia.analizando||(!ia.texto?.trim()&&!ia.imagen))?0.4:1}}>
              {ia.analizando?"⏳ Analizando...":"✨ Analizar"}
            </button>
            <button onClick={()=>setIa(null)} style={{...S.btnGhost,flex:1}}>Cancelar</button>
          </div>
          {ia.error&&<div style={{color:"#C47E7E",fontSize:12,marginTop:8}}>{ia.error}</div>}
        </div>
      )}

      {/* ── Vista previa resultado IA ── */}
      {ia?.resultado && (
        <div style={{...S.card,marginBottom:10,borderColor:"#7EB8A444"}}>
          <div style={{color:"#7EB8A4",fontSize:13,marginBottom:12,fontWeight:"bold"}}>
            ✓ Revisión antes de guardar
          </div>
          <div style={{color:"#F0EAD6",fontSize:15,marginBottom:4}}>{ia.resultado.nombre}</div>
          <div style={{color:"#888",fontSize:11,marginBottom:12}}>
            {ia.resultado.tipo} · {ia.resultado.ingredientes?.length} ingredientes
          </div>
          {ia.resultado.ingredientes?.map((ing,i)=>{
            const existe = productos.find(p=>p.nombre.toLowerCase()===ing.nombre.toLowerCase());
            return(
              <div key={i} style={{flexDirection:"column",background:"#1C1A17",
                borderRadius:8,padding:"8px 10px",marginBottom:4}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:existe?0:6}}>
                  <span style={{fontSize:11,color:existe?"#7EB8A4":"#C8A96E",minWidth:14}}>
                    {existe?"✓":"＋"}
                  </span>
                  <span style={{flex:1,fontSize:13,color:"#F0EAD6"}}>{ing.nombre}</span>
                  <span style={{fontSize:12,color:"#666"}}>{ing.cantidad} {ing.unidad}</span>
                </div>
                {!existe && (
                  <select value={ing.categoria||"Otros"}
                    onChange={e=>{
                      const nuevos = [...ia.resultado.ingredientes];
                      nuevos[i] = {...nuevos[i], categoria:e.target.value};
                      setIa(s=>({...s,resultado:{...s.resultado,ingredientes:nuevos}}));
                    }}
                    style={{...S.input,width:"100%",fontSize:11,padding:"4px 8px",marginTop:4}}>
                    {["Frutas y verduras","Carnes y embutidos","Pescados y mariscos","Lácteos y huevos","Legumbres y conservas","Panadería, bollería y snacks","Aceites, salsas y condimentos","Congelados","Bebidas","Limpieza","Cosmética y cuidado personal","Otros"].map(c=>(
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
          <div style={{fontSize:11,color:"#555",margin:"10px 0",lineHeight:1.5}}>
            ✓ verde = ya en tu catálogo &nbsp;·&nbsp; ＋ dorado = nuevo (cambia categoría si hace falta)
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={confirmarReceta}
              style={{...S.btnPrimary,flex:2,background:"#7EB8A4",color:"#0F0E0C"}}>
              ✓ Guardar plato
            </button>
            <button onClick={()=>setIa(null)} style={{...S.btnGhost,flex:1}}>Cancelar</button>
          </div>
        </div>
      )}

      {/* ── Formulario manual ── */}
      {nuevo?(
        <div style={S.card}>
          <div style={{color:"#666",fontSize:12,marginBottom:10}}>Nueva receta manual</div>
          <input placeholder="Nombre del plato" value={nuevo.nombre}
            onChange={e=>setNuevo(n=>({...n,nombre:e.target.value}))}
            style={{...S.input,width:"100%",boxSizing:"border-box",marginBottom:8}}/>
          <select value={nuevo.tipo} onChange={e=>setNuevo(n=>({...n,tipo:e.target.value}))}
            style={{...S.input,width:"100%",boxSizing:"border-box",marginBottom:10}}>
            <option value="almuerzo">Almuerzo</option>
            <option value="cena">Cena</option>
          </select>
          <div style={{display:"flex",gap:8}}>
            <button onClick={guardar} style={{...S.btnPrimary,flex:1,background:"#C8A96E",color:"#0F0E0C"}}>Guardar</button>
            <button onClick={()=>setNuevo(null)} style={{...S.btnGhost,flex:1}}>Cancelar</button>
          </div>
        </div>
      ):(
        <div style={{display:"flex",gap:8,marginTop:4}}>
          <button onClick={()=>setIa({tipo:"almuerzo",texto:"",analizando:false,resultado:null})}
            style={{...S.btnPrimary,flex:1,background:"#C8A96E22",color:"#C8A96E",
              border:"1px solid #C8A96E44"}}>
            ✨ Con IA
          </button>
          <button onClick={()=>setNuevo({id:`pl${Date.now()}`,nombre:"",tipo:"almuerzo",prods:[]})}
            style={{...S.btnGhost,flex:1,borderStyle:"dashed"}}>
            + Manual
          </button>
        </div>
      )}
    </div>
  );
}

function SecProductos({productos,setProductos,platos}) {
  const [nuevo,setNuevo]         = useState(null);
  const [confirmando,setConfirm] = useState(null);
  const [editando,setEdit]       = useState(null); // {id,nombre,unidad,categoria}

  function guardar(){
    if(!nuevo?.nombre?.trim())return;
    setProductos(p=>[...p,{...nuevo,favorito:false,id:`p${Date.now()}`}]);
    setNuevo(null);
  }
  function toggleFav(id){
    setProductos(p=>p.map(x=>x.id===id
      ?{...x, favorito:!x.favorito, cantidadFav: x.favorito ? undefined : (x.cantidadFav||1)}
      :x));
  }
  function setCantidadFav(id, val){
    // Allow empty string during editing
    setProductos(p=>p.map(x=>x.id===id?{...x,cantidadFav:val===""?"":val}:x));
  }
  function fijarCantidadFav(id, val){
    const num = parseFloat(val);
    setProductos(p=>p.map(x=>x.id===id?{...x,cantidadFav:(!num||num<=0)?1:num}:x));
  }

  function pedirConfirmacion(prod){
    // prods puede llamarse 'prods' o 'productos' según versión guardada
    const afectados=(platos||[]).filter(pl=>{
      const lista = pl.prods || pl.productos || [];
      return lista.some(pr=>(pr.pid||pr.id)===prod.id);
    });
    if(afectados.length===0){
      setProductos(p=>p.filter(x=>x.id!==prod.id));
    } else {
      setConfirm({id:prod.id,nombre:prod.nombre,platosAfectados:afectados});
    }
  }

  function confirmarEliminar(){
    if(!confirmando)return;
    setProductos(p=>p.filter(x=>x.id!==confirmando.id));
    setConfirm(null);
  }

  const porCat=CATEGORIAS.reduce((acc,cat)=>{
    const items=productos.filter(p=>p.categoria===cat)
      .sort((a,b)=>{
        if(a.favorito&&!b.favorito)return -1;
        if(!a.favorito&&b.favorito)return 1;
        return a.nombre.localeCompare(b.nombre,"es");
      });
    if(items.length) acc[cat]=items;
    return acc;
  },{});

  function guardarEdicion(){
    if(!editando?.nombre?.trim())return;
    setProductos(p=>p.map(x=>x.id===editando.id
      ?{...x,nombre:editando.nombre.trim(),unidad:editando.unidad,categoria:editando.categoria}
      :x));
    setEdit(null);
  }

  return(
    <div>
      <Hint>⭐ Toca la estrella para que un producto aparezca automáticamente todas las semanas.</Hint>

      {/* Formulario edición inline */}
      {editando && (
        <div style={{...S.card,marginBottom:12,borderColor:"#C8A96E44"}}>
          <div style={{color:"#C8A96E",fontSize:12,marginBottom:10}}>Editando producto</div>
          <input autoFocus placeholder="Nombre" value={editando.nombre}
            onChange={e=>setEdit(ed=>({...ed,nombre:e.target.value}))}
            style={{...S.input,width:"100%",boxSizing:"border-box",marginBottom:8}}/>
          <select value={editando.unidad}
            onChange={e=>setEdit(ed=>({...ed,unidad:e.target.value}))}
            style={{...S.input,width:"100%",boxSizing:"border-box",marginBottom:8}}>
            <option value="ud">ud — unidades</option>
            <option value="kg">kg — kilos</option>
            <option value="L">L — litros</option>
          </select>
          <select value={editando.categoria}
            onChange={e=>setEdit(ed=>({...ed,categoria:e.target.value}))}
            style={{...S.input,width:"100%",boxSizing:"border-box",marginBottom:10}}>
            {CATEGORIAS.map(c=><option key={c}>{c}</option>)}
          </select>
          <div style={{display:"flex",gap:8}}>
            <button onClick={guardarEdicion}
              style={{...S.btnPrimary,flex:1,background:"#C8A96E",color:"#0F0E0C"}}>
              Guardar
            </button>
            <button onClick={()=>setEdit(null)} style={{...S.btnGhost,flex:1}}>Cancelar</button>
          </div>
        </div>
      )}

      {confirmando && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:100,
          display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{...S.card,maxWidth:340,width:"100%",borderColor:"#C47E7E55"}}>
            <div style={{fontSize:16,color:"#F0EAD6",marginBottom:8}}>
              ⚠️ Eliminar producto
            </div>
            <div style={{fontSize:13,color:"#aaa",marginBottom:12,lineHeight:1.6}}>
              <strong style={{color:"#F0EAD6"}}>{confirmando.nombre}</strong> se usa en {confirmando.platosAfectados.length} {confirmando.platosAfectados.length===1?"plato":"platos"}:
            </div>
            <div style={{marginBottom:16}}>
              {confirmando.platosAfectados.map(pl=>(
                <div key={pl.id} style={{fontSize:13,color:"#888",padding:"3px 0",
                  borderBottom:"1px solid #1E1C18",display:"flex",alignItems:"center",gap:6}}>
                  <span style={{color:"#C47E7E",fontSize:10}}>·</span> {pl.nombre}
                </div>
              ))}
            </div>
            <div style={{fontSize:12,color:"#666",marginBottom:16}}>
              Si lo eliminas, se borrará de todos ellos.
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setConfirm(null)}
                style={{...S.btnGhost,flex:1}}>Cancelar</button>
              <button onClick={confirmarEliminar}
                style={{...S.btnPrimary,flex:1,background:"#C47E7E",color:"#fff"}}>
                Eliminar igualmente
              </button>
            </div>
          </div>
        </div>
      )}

      {Object.entries(porCat).map(([cat,items])=>(
        <div key={cat} style={{marginBottom:20}}>
          <div style={S.catHeaderEl}>{ICONOS[cat]||"📦"} {cat}</div>
          {items.map(p=>(
            <div key={p.id} style={{...S.itemRow,cursor:"default",
              background:p.favorito?"#1f1d19":"#1C1A17",
              borderLeft:p.favorito?"2px solid #C8A96E55":"2px solid transparent"}}>
              <button onClick={()=>toggleFav(p.id)}
                style={{...S.btnIcon,fontSize:16,padding:"2px 5px",
                  color:p.favorito?"#C8A96E":"#444"}}>
                {p.favorito?"⭐":"☆"}
              </button>
              <span style={{flex:1,fontSize:15,color:"#F0EAD6"}}>{p.nombre}</span>
              {/* Acciones agrupadas a la derecha sin espacio entre ellas */}
              <div style={{display:"flex",alignItems:"center",gap:2,flexShrink:0}}>
                {p.favorito ? (
                  <>
                    <input key={p.id} type="number" step="0.01" min="0"
                      defaultValue={p.cantidadFav||1}
                      onBlur={e=>fijarCantidadFav(p.id,e.target.value)}
                      style={{...S.input,width:42,padding:"3px 4px",fontSize:12,textAlign:"right"}}/>
                    <span style={{fontSize:11,color:"#888",minWidth:16}}>{p.unidad}</span>
                  </>
                ) : (
                  <span style={{fontSize:11,color:"#555",marginRight:4}}>{p.unidad}</span>
                )}
                <button style={S.btnIcon} onClick={()=>setEdit({id:p.id,nombre:p.nombre,unidad:p.unidad,categoria:p.categoria})}>✏️</button>
                <button style={{...S.btnIcon,color:"#C47E7E"}} onClick={()=>pedirConfirmacion(p)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      ))}
      {nuevo?(
        <div style={S.card}>
          <div style={{color:"#666",fontSize:12,marginBottom:10}}>Nuevo producto</div>
          <input placeholder="Nombre" value={nuevo.nombre||""}
            onChange={e=>setNuevo(n=>({...n,nombre:e.target.value}))}
            style={{...S.input,width:"100%",boxSizing:"border-box",marginBottom:8}}/>
          <select value={nuevo.unidad||"ud"}
            onChange={e=>setNuevo(n=>({...n,unidad:e.target.value}))}
            style={{...S.input,width:"100%",boxSizing:"border-box",marginBottom:8}}>
            <option value="ud">ud — unidades</option>
            <option value="kg">kg — kilos</option>
            <option value="L">L — litros</option>
          </select>
          <select value={nuevo.categoria||"Otros"} onChange={e=>setNuevo(n=>({...n,categoria:e.target.value}))}
            style={{...S.input,width:"100%",boxSizing:"border-box",marginBottom:10}}>
            {CATEGORIAS.map(c=><option key={c}>{c}</option>)}
          </select>
          <div style={{display:"flex",gap:8}}>
            <button onClick={guardar} style={{...S.btnPrimary,flex:1,background:"#C8A96E",color:"#0F0E0C"}}>Guardar</button>
            <button onClick={()=>setNuevo(null)} style={{...S.btnGhost,flex:1}}>Cancelar</button>
          </div>
        </div>
      ):(
        <button onClick={()=>setNuevo({nombre:"",unidad:"ud",categoria:"Otros"})}
          style={{...S.btnGhost,width:"100%",borderStyle:"dashed"}}>
          + Nuevo producto
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENTES REUTILIZABLES
// ══════════════════════════════════════════════════════════════════════════════
function Tabs({tab,setTab,color,tabs,small}) {
  return(
    <div style={{display:"flex",gap:2}}>
      {tabs.map(([k,l])=>(
        <button key={k} onClick={()=>setTab(k)}
          style={{flex:1,padding:small?"7px 4px":"13px 4px",
            border:"none",background:"transparent",
            color:tab===k?color:"#444",cursor:"pointer",
            fontSize:small?12:15,
            
            fontWeight:tab===k?"700":"400",
            letterSpacing:"0.01em",
            borderBottom:`3px solid ${tab===k?color:"transparent"}`,
            transition:"all .2s"}}>
          {l}
        </button>
      ))}
    </div>
  );
}

function Hint({children}) {
  return(
    <div style={{fontSize:12,color:"#555",marginBottom:16,lineHeight:1.6,
      padding:"8px 12px",background:"#161412",borderRadius:8,borderLeft:"2px solid #2a2720"}}>
      {children}
    </div>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const S = {
  app:        {minHeight:"100vh",background:"#0D0C0A",color:"#F0EAD6",
               fontFamily:"system-ui,-apple-system,sans-serif",
               display:"flex",flexDirection:"column",position:"relative"},
  glow:       {position:"fixed",top:0,left:0,right:0,height:320,zIndex:0,pointerEvents:"none",
               background:"radial-gradient(ellipse 100% 50% at 50% -5%, #C8A96E12 0%, transparent 70%)"},
  header:     {background:"rgba(13,12,10,0.97)",borderBottom:"1px solid #1E1C18",
               padding:"20px 20px 0",position:"sticky",top:0,zIndex:10,
               backdropFilter:"blur(12px)"},
  titulo:     {fontSize:24,fontWeight:"bold",color:"#F0EAD6",letterSpacing:"-0.8px",
               lineHeight:1.1},
  chip:       {display:"inline-flex",alignItems:"center",padding:"4px 12px",
               borderRadius:20,border:"1px solid",fontSize:11,fontWeight:"bold",
               letterSpacing:"0.03em"},
  scroll:     {flex:1,overflowY:"auto",padding:"0",position:"relative",zIndex:1},
  infoRow:    {display:"flex",justifyContent:"space-between",alignItems:"center",
               marginBottom:18,paddingBottom:14,borderBottom:"1px solid #1A1815"},
  catHeaderEl:{display:"flex",alignItems:"center",gap:10,
               fontSize:13,color:"#C8A96E",fontWeight:"900",
               letterSpacing:"0.08em",textTransform:"uppercase",
               
               marginBottom:6,paddingBottom:8,marginTop:24,
               borderBottom:"2px solid #1E1C18"},
  itemRow:    {display:"flex",alignItems:"center",gap:12,padding:"12px 10px",
               borderRadius:10,marginBottom:2,background:"#161412",cursor:"pointer",
               transition:"all .15s",border:"1px solid transparent"},
  check:      {width:22,height:22,borderRadius:6,border:"1.5px solid",flexShrink:0,
               display:"flex",alignItems:"center",justifyContent:"center",
               transition:"all .2s"},
  footer:     {position:"sticky",bottom:0,padding:"12px 20px 24px",zIndex:10,
               background:"linear-gradient(transparent,#0D0C0A 35%)"},
  btnSuper:   {width:"100%",border:"none",color:"#0D0C0A",padding:"17px",
               borderRadius:14,cursor:"pointer",fontSize:15,fontWeight:"bold",
               letterSpacing:"-0.2px",
               transition:"transform .1s, box-shadow .2s"},
  btnBack:    {background:"#1C1A17",border:"1px solid #252220",color:"#C8B89A",
               width:52,height:52,borderRadius:14,cursor:"pointer",fontSize:34,
               display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  btnIcon:    {background:"transparent",border:"none",fontSize:16,cursor:"pointer",
               padding:"6px",lineHeight:1,color:"#666",borderRadius:6},
  btnPrimary: {background:"#C8A96E",border:"none",color:"#0D0C0A",padding:"11px 18px",
               borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:"bold",
               letterSpacing:"0.01em"},
  btnGhost:   {background:"transparent",border:"1px solid #252220",color:"#777",
               padding:"11px 18px",borderRadius:10,cursor:"pointer",fontSize:13,
               },
  platoCard:  {display:"flex",alignItems:"center",gap:12,padding:"12px 10px",
               borderRadius:10,marginBottom:4,border:"1px solid",cursor:"pointer",
               transition:"all .2s"},
  dot:        {width:9,height:9,borderRadius:"50%",flexShrink:0},
  card:       {background:"#161412",border:"1px solid #222",borderRadius:14,padding:16},
  input:      {background:"#0F0E0C",border:"1px solid #2a2720",color:"#F0EAD6",
               padding:"10px 13px",borderRadius:10,fontSize:13,
               outline:"none"},
};
