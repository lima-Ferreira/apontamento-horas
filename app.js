
const K={config:"apontamento_v1_config",items:"apontamento_v1_items"};
// V1.6 mantém as mesmas chaves para preservar os dados já existentes no aparelho.
const $=id=>document.getElementById(id);
let mode="direct",editingId=null;
const load=k=>{try{return JSON.parse(localStorage.getItem(k))}catch{return null}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const items=()=>load(K.items)||[];
const pendentes=()=>items().filter(i=>!i.enviadoEm);
const pad=n=>String(n).padStart(2,"0");
const hhmm=m=>`${pad(Math.floor((m||0)/60))}:${pad((m||0)%60)}`;
const br=d=>{if(!d)return"";const [y,m,day]=d.split("-");return `${day}/${m}/${y}`};
const today=()=>{const d=new Date(),o=d.getTimezoneOffset();return new Date(d.getTime()-o*60000).toISOString().slice(0,10)};
const esc=s=>String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const uid=()=>crypto?.randomUUID?crypto.randomUUID():`apt-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const clean=s=>(s||"apontamento").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9_-]+/g,"-");

function config(){return load(K.config)||{}}
function refreshIdentity(){
  const c=config();
  $("whoName").textContent=c.nome||"Configure seu nome";
  $("whoStore").textContent=c.loja||"";
  $("avatar").textContent=(c.nome||"?").split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase();
  $("cfgNome").value=c.nome||"";$("cfgLoja").value=c.loja||"";$("cfgDestino").value=c.destino||"Lima";
  if(!c.nome)$("configCard").classList.remove("hidden");
}
function setMode(m){
  mode=m;$("modeDirect").classList.toggle("active",m==="direct");$("modeTimes").classList.toggle("active",m==="times");
  $("directFields").classList.toggle("hidden",m!=="direct");$("timeFields").classList.toggle("hidden",m!=="times");
}
function extraMinutes(){
  const h=Number((mode==="direct"?$("extraHoras"):$("extraHoras2")).value||0);
  const m=Number((mode==="direct"?$("extraMinutos"):$("extraMinutos2")).value||0);
  return h*60+m;
}
function resetForm(){
  editingId=null;$("data").value=today();$("extraHoras").value="";$("extraMinutos").value="";
  $("inicio").value="";$("fim").value="";$("intervaloHoras").value="1";$("intervaloMinutos").value="0";
  $("extraHoras2").value="";$("extraMinutos2").value="";$("motivo").value="";$("companhia").value="";$("observacao").value="";
  $("btnAdicionar").textContent="+ Adicionar apontamento";setMode("direct");
}
function render(){
  const arr=items().sort((a,b)=>b.data.localeCompare(a.data)||b.createdAt.localeCompare(a.createdAt));
  const qtdPendentes=arr.filter(i=>!i.enviadoEm).length;
  $("countText").textContent=arr.length?`${arr.length} salvo(s) · ${qtdPendentes} pendente(s) de envio.`:"Nenhum apontamento salvo.";
  $("emptyState").classList.toggle("hidden",!!arr.length);$("summary").classList.toggle("hidden",!arr.length);
  $("totalHoras").textContent=hhmm(arr.reduce((s,i)=>s+i.extraMinutos,0));
  $("lista").innerHTML=arr.map(i=>`<article class="item">
    <div class="item-top"><div><div class="item-date">${br(i.data)}</div><span class="send-status ${i.enviadoEm?"sent":"pending"}">${i.enviadoEm?"Enviado":"Pendente"}</span></div><div class="item-hours">+${hhmm(i.extraMinutos)}</div></div>
    <div class="item-reason">${esc(i.motivo)}</div>
    ${i.companhia?`<div class="item-meta"><b>Com:</b> ${esc(i.companhia)}</div>`:""}
    ${i.mode==="times"?`<div class="item-meta">Horário: ${esc(i.inicio||"--:--")} → ${esc(i.fim||"--:--")} · Intervalo ${hhmm(i.intervaloMinutos||0)}</div>`:""}
    ${i.observacao?`<div class="item-meta"><b>Obs.:</b> ${esc(i.observacao)}</div>`:""}
    <div class="item-code">Código: ${esc(i.id)}</div>
    <div class="item-actions"><button class="mini copy" data-id="${i.id}">Copiar dados</button><button class="mini edit" data-id="${i.id}">Editar</button>${i.enviadoEm?`<button class="mini resend" data-id="${i.id}">Reenviar</button>`:""}<button class="mini delete" data-id="${i.id}">Excluir</button></div>
  </article>`).join("");
  document.querySelectorAll(".copy").forEach(b=>b.onclick=()=>copiarDadosItem(b.dataset.id,b));
  document.querySelectorAll(".edit").forEach(b=>b.onclick=()=>editItem(b.dataset.id));
  document.querySelectorAll(".delete").forEach(b=>b.onclick=()=>deleteItem(b.dataset.id));
  document.querySelectorAll(".resend").forEach(b=>b.onclick=()=>marcarParaReenvio(b.dataset.id));
  const btn=$("btnSendText"); if(btn){btn.textContent=qtdPendentes?`Enviar ${qtdPendentes} pendente(s) para o WhatsApp`:"Nenhum apontamento pendente";btn.disabled=!qtdPendentes;}
  const cp=$("btnCopyPacket"); if(cp) cp.disabled=!qtdPendentes;
  const box=$("packetCopyBox"), preview=$("packetCopyPreview"), status=$("packetCopyStatus");
  if(box&&preview&&status){
    box.classList.toggle("disabled",!qtdPendentes);
    if(qtdPendentes){
      const codigo=pacoteTexto(arr.filter(i=>!i.enviadoEm));
      preview.textContent=codigo.slice(0,78)+(codigo.length>78?"…":"");
      status.textContent=`${qtdPendentes} pendente(s) · toque para copiar somente o código BHAP1.`;
    }else{preview.textContent="Nenhum pacote pendente";status.textContent="Crie ou marque um apontamento para reenvio.";}
  }
  const ex=$("btnExport"); if(ex) ex.disabled=!qtdPendentes;
  const dl=$("btnDownloadImport"); if(dl) dl.disabled=!qtdPendentes;
}
function addOrUpdate(){
  const c=config();if(!c.nome){alert("Primeiro configure o nome neste aparelho.");$("configCard").classList.remove("hidden");return}
  const data=$("data").value,extra=extraMinutes(),motivo=$("motivo").value.trim();
  if(!data)return alert("Informe a data.");if(extra<=0)return alert("Informe a quantidade de hora extra.");if(!motivo)return alert("Informe o motivo.");
  let arr=items();const old=editingId?arr.find(x=>x.id===editingId):null;
  const rec={id:old?.id||uid(),schemaVersion:1,pessoa:c.nome,loja:c.loja||"",data,mode,extraMinutos:extra,motivo,
    companhia:$("companhia").value.trim(),observacao:$("observacao").value.trim(),
    inicio:mode==="times"?$("inicio").value:"",fim:mode==="times"?$("fim").value:"",
    intervaloMinutos:mode==="times"?(Number($("intervaloHoras").value||0)*60+Number($("intervaloMinutos").value||0)):0,
    createdAt:old?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString(),status:"informado",
    // Ao editar um registro já enviado, ele volta a ficar pendente para que a correção possa ser enviada novamente.
    enviadoEm:null};
  if(old)arr[arr.findIndex(x=>x.id===editingId)]=rec;else arr.push(rec);save(K.items,arr);resetForm();render();
}

function textoDadosItem(i){
  let t=`${i.pessoa||config().nome||""}\nData: ${br(i.data)}\nHora extra: ${hhmm(i.extraMinutos)}\nMotivo: ${i.motivo||""}`;
  if(i.mode==="times") t+=`\nEntrada: ${i.inicio||"--:--"}\nSaída: ${i.fim||"--:--"}\nIntervalo: ${hhmm(i.intervaloMinutos||0)}`;
  if(i.companhia) t+=`\nCom: ${i.companhia}`;
  if(i.observacao) t+=`\nObservação: ${i.observacao}`;
  return t;
}
async function copiarDadosItem(id,btn){
  const i=items().find(x=>x.id===id);if(!i)return;
  const txt=textoDadosItem(i);
  try{
    await navigator.clipboard.writeText(txt);
    if(btn){const old=btn.textContent;btn.textContent="Copiado ✓";btn.classList.add("copied");setTimeout(()=>{btn.textContent=old;btn.classList.remove("copied")},1600)}
  }catch{
    prompt("Copie os dados abaixo:",txt);
  }
}

function editItem(id){
  const i=items().find(x=>x.id===id);if(!i)return;editingId=id;$("data").value=i.data;setMode(i.mode||"direct");
  const h=Math.floor(i.extraMinutos/60),m=i.extraMinutos%60;
  if(mode==="direct"){$("extraHoras").value=h;$("extraMinutos").value=m}else{
    $("extraHoras2").value=h;$("extraMinutos2").value=m;$("inicio").value=i.inicio||"";$("fim").value=i.fim||"";
    $("intervaloHoras").value=Math.floor((i.intervaloMinutos||0)/60);$("intervaloMinutos").value=(i.intervaloMinutos||0)%60}
  $("motivo").value=i.motivo||"";$("companhia").value=i.companhia||"";$("observacao").value=i.observacao||"";
  $("btnAdicionar").textContent="Salvar alteração";window.scrollTo({top:0,behavior:"smooth"});
}
function deleteItem(id){if(confirm("Excluir este apontamento?")){save(K.items,items().filter(x=>x.id!==id));render()}}
function marcarParaReenvio(id){
  const arr=items();const idx=arr.findIndex(x=>x.id===id);if(idx<0)return;
  arr[idx]={...arr[idx],enviadoEm:null};save(K.items,arr);render();
}
function payload(tipo,arrSelecionados=null){
  const c=config(),arr=arrSelecionados||items();return {schema:"lojas-maravilha-apontamento-horas",schemaVersion:1,tipo,geradoEm:new Date().toISOString(),
    origem:{pessoa:c.nome||"",loja:c.loja||"",destino:c.destino||"Lima"},quantidade:arr.length,totalMinutos:arr.reduce((s,i)=>s+i.extraMinutos,0),apontamentos:arr}
}
function marcarPendentesComoEnviados(ids){
  const agora=new Date().toISOString(),setIds=new Set(ids),arr=items().map(i=>setIds.has(i.id)?{...i,enviadoEm:agora}:i);
  save(K.items,arr);render();
}
function download(data,name){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download=name;document.body.appendChild(a);a.click();a.remove()}
function summaryText(){
  const c=config(),arr=items().sort((a,b)=>a.data.localeCompare(b.data));let t=`*APONTAMENTO DE HORAS*\n${c.nome||"Funcionário"}${c.loja?` — ${c.loja}`:""}\n\n`;
  arr.forEach(i=>{t+=`${br(i.data)} — *${hhmm(i.extraMinutos)}*\n${i.motivo}\n`;if(i.companhia)t+=`Com: ${i.companhia}\n`;if(i.observacao)t+=`Obs.: ${i.observacao}\n`;if(i.mode==="times")t+=`Horário: ${i.inicio||"--:--"} → ${i.fim||"--:--"} | Intervalo ${hhmm(i.intervaloMinutos||0)}\n`;t+="\n"});
  t+=`*Total informado: ${hhmm(arr.reduce((s,i)=>s+i.extraMinutos,0))}*`;return t
}

function pacoteTexto(arrSelecionados=pendentes()){
  const json=JSON.stringify(payload("importacao",arrSelecionados));
  const bytes=new TextEncoder().encode(json);
  let bin=""; bytes.forEach(b=>bin+=String.fromCharCode(b));
  return "BHAP1:"+btoa(bin);
}
async function copiarPacote(){
  const arr=pendentes();if(!arr.length)return alert("Não há apontamentos pendentes de envio.");
  const txt=pacoteTexto(arr),box=$("packetCopyBox"),status=$("packetCopyStatus");
  try{
    await navigator.clipboard.writeText(txt);
    if(box)box.classList.add("copied");
    if(status)status.textContent="Código BHAP1 copiado ✓ Agora é só colar.";
    setTimeout(()=>{if(box)box.classList.remove("copied");if(status)status.textContent=`${pendentes().length} pendente(s) · toque para copiar somente o código BHAP1.`},1800);
  }catch{prompt("Copie todo o código BHAP1 abaixo:",txt)}
}
function enviarPacoteTexto(){
  const arr=pendentes();if(!arr.length)return alert("Não há apontamentos pendentes de envio.");
  const c=config();
  const text=`APONTAMENTOS PARA O BANCO DE HORAS\n${c.nome||""}${c.loja?` — ${c.loja}`:""}\n${arr.length} apontamento(s) novo(s)\n\nCopie o código abaixo inteiro e cole no Banco de Horas:\n\n${pacoteTexto(arr)}`;
  // Consideramos os registros como enviados quando o WhatsApp é aberto. Se o usuário desistir do envio,
  // basta tocar em “Reenviar” no registro para colocá-lo novamente na fila.
  marcarPendentesComoEnviados(arr.map(i=>i.id));
  const url="https://api.whatsapp.com/send?text="+encodeURIComponent(text);
  window.location.href=url;
}

async function shareImportFile(){
  const c=config(),arr=pendentes();
  if(!arr.length){alert("Não há apontamentos pendentes de envio.");return}
  const d=arr.map(x=>x.data).sort();
  const filename=`Apontamentos-${clean(c.nome)}-${d[0]}-a-${d[d.length-1]}.json`;
  const blob=new Blob([JSON.stringify(payload("importacao"),null,2)],{type:"application/json"});
  const file=new File([blob],filename,{type:"application/json"});
  if(navigator.share && (!navigator.canShare || navigator.canShare({files:[file]}))){
    try{
      await navigator.share({
        title:"Arquivo para importar no Banco de Horas",
        text:`Apontamentos de ${c.nome}${c.loja?` — ${c.loja}`:""}`,
        files:[file]
      });
      marcarPendentesComoEnviados(arr.map(i=>i.id));
      return;
    }catch(e){ if(e && e.name==="AbortError") return; }
  }
  download(payload("importacao"),filename);
  alert("Este navegador não permitiu compartilhar o arquivo diretamente. O JSON foi salvo no aparelho para você anexar no WhatsApp.");
}

async function share(){
  const text=summaryText();if(navigator.share){try{await navigator.share({title:"Apontamento de Horas",text});return}catch{}}
  window.open("https://wa.me/?text="+encodeURIComponent(text),"_blank")
}
$("btnConfig").onclick=()=>$("configCard").classList.toggle("hidden");
$("btnFecharConfig").onclick=()=>$("configCard").classList.add("hidden");
$("btnSalvarConfig").onclick=()=>{const nome=$("cfgNome").value.trim();if(!nome)return alert("Informe o nome.");save(K.config,{nome,loja:$("cfgLoja").value.trim(),destino:$("cfgDestino").value.trim()||"Lima"});refreshIdentity();$("configCard").classList.add("hidden")};
$("modeDirect").onclick=()=>setMode("direct");$("modeTimes").onclick=()=>setMode("times");$("btnAdicionar").onclick=addOrUpdate;
$("btnWhats").onclick=share;
$("btnSendText").onclick=enviarPacoteTexto;
$("btnCopyPacket").onclick=copiarPacote;
const packetBox=$("packetCopyBox"); if(packetBox){packetBox.onclick=copiarPacote;packetBox.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();copiarPacote()}};}
$("btnExport").onclick=shareImportFile;
$("btnBackup").onclick=()=>download(payload("backup"),`Backup-Apontamentos-${clean(config().nome)}-${today()}.json`);
$("restoreInput").onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{const d=JSON.parse(await f.text());if(d.schema!=="lojas-maravilha-apontamento-horas"||!Array.isArray(d.apontamentos))throw 0;if(!confirm(`Restaurar ${d.apontamentos.length} apontamento(s)?`))return;save(K.items,d.apontamentos);if(d.origem?.pessoa)save(K.config,{nome:d.origem.pessoa,loja:d.origem.loja||"",destino:d.origem.destino||"Lima"});refreshIdentity();render();alert("Backup restaurado.")}catch{alert("Arquivo inválido.")}e.target.value=""};
$("btnLimpar").onclick=()=>{if(items().length&&confirm("Apagar todos os apontamentos deste aparelho?")){save(K.items,[]);render()}};
$("data").value=today();refreshIdentity();render();setMode("direct");
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));

const btnDownloadImport=$("btnDownloadImport"); if(btnDownloadImport) btnDownloadImport.onclick=()=>{const c=config(),arr=pendentes();if(!arr.length)return alert("Não há apontamentos pendentes de envio.");const d=arr.map(x=>x.data).sort();download(payload("importacao",arr),`Apontamentos-${clean(c.nome)}-${d[0]}-a-${d[d.length-1]}.json`)};
