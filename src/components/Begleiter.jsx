"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  KV_LIST,
  mkAddr, fmtDate, buildLetter, makeTasks, OB, getFaq
} from "@/lib/begleiter-data";
import {
  signIn, signUp, signOut, getCurrentUser, onAuthChange,
  loadEstate, saveEstate,
  loadStatuses, upsertStatus, deleteStatus,
  loadDocuments, uploadDocument, deleteDocument, getDocumentUrl,
  loadMessages, insertMessage, markMessageRead, deleteMessage,
} from "@/lib/store";
import { supabaseAvailable } from "@/lib/supabase";

// ─── TOKENS & STYLES ─────────────────────────────────────────────────────────
const c = {
  bg:"#F4EFE8", card:"rgba(255,255,255,0.78)", dark:"#2B3330",
  mid:"#556060", muted:"#8A9D95", faint:"#BBCBC4",
  green:"#4A7C6F", red:"#C0392B", amber:"#D97706",
  border:"rgba(255,255,255,0.92)",
  navBg:"rgba(244,239,232,0.97)",
};

const cardStyle    = {background:c.card,backdropFilter:"blur(14px)",borderRadius:18,border:"1px solid "+c.border,boxShadow:"0 6px 32px rgba(0,0,0,0.06)",padding:20};
const primaryBtn   = {padding:"13px 20px",background:c.dark,color:"#F4EFE8",border:"none",borderRadius:12,fontSize:14,fontFamily:"Georgia,serif",cursor:"pointer",fontStyle:"italic",width:"100%"};
const ghostBtn     = {padding:"10px 16px",background:"transparent",color:c.green,border:`1.5px solid rgba(74,124,111,0.3)`,borderRadius:12,fontSize:13,fontFamily:"Georgia,serif",cursor:"pointer"};
const backBtn      = {background:"none",border:"none",color:c.muted,fontSize:13,cursor:"pointer",padding:"0 0 10px",fontFamily:"Georgia,serif",display:"block"};
const inputStyle   = (filled) => ({padding:"11px 13px",borderRadius:10,border:`1.5px solid ${filled?"rgba(74,124,111,0.4)":"rgba(0,0,0,0.1)"}`,background:filled?"rgba(74,124,111,0.04)":"rgba(255,255,255,0.6)",fontSize:14,fontFamily:"Georgia,serif",color:c.dark,outline:"none",width:"100%",boxSizing:"border-box"});
const optCardStyle = (on) => ({display:"flex",flexDirection:"column",alignItems:"flex-start",gap:5,padding:"13px 14px",background:"rgba(255,255,255,0.6)",border:`1.5px solid ${on?c.dark:"rgba(0,0,0,0.09)"}`,borderRadius:12,cursor:"pointer",textAlign:"left",position:"relative"});
const textareaStyle= {width:"100%",minHeight:300,padding:13,border:"1.5px solid rgba(0,0,0,0.1)",borderRadius:12,fontFamily:"'Courier New',monospace",fontSize:12,color:c.dark,background:"rgba(244,239,232,0.7)",lineHeight:1.7,resize:"vertical",outline:"none",boxSizing:"border-box"};
const ddBoxStyle   = {position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"rgba(255,255,255,0.98)",backdropFilter:"blur(20px)",border:"1.5px solid rgba(0,0,0,0.1)",borderRadius:12,boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:100,maxHeight:260,overflowY:"auto"};
const ddOptStyle   = {display:"flex",flexDirection:"column",gap:2,padding:"9px 13px",background:"none",border:"none",cursor:"pointer",textAlign:"left",width:"100%",borderBottom:"1px solid rgba(0,0,0,0.04)"};
const infoStyle    = {background:"rgba(74,124,111,0.05)",border:"1px solid rgba(74,124,111,0.15)",borderRadius:10,padding:"10px 12px",display:"flex",flexDirection:"column",gap:4};
const sendDarkStyle= {display:"flex",flexDirection:"column",gap:4,padding:16,background:c.dark,border:"none",borderRadius:12,cursor:"pointer",textAlign:"left"};
const sendLightStyle={display:"flex",flexDirection:"column",gap:4,padding:16,background:"transparent",border:"1.5px solid rgba(0,0,0,0.1)",borderRadius:12,cursor:"pointer",textAlign:"left"};

const bgGradient = (
  <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse at 15% 10%,#DDD5C8,transparent 55%),radial-gradient(ellipse at 85% 85%,#C8D5D0,transparent 55%)",zIndex:0,pointerEvents:"none"}}/>
);

// Debounce helper for autosave
function useDebouncedEffect(cb, deps, delay) {
  useEffect(() => {
    const t = setTimeout(cb, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ─── SERVICE LOGO ────────────────────────────────────────────────────────────
function ServiceLogo({ domain, name, size = 32, fallbackEmoji }) {
  const [imgError, setImgError] = useState(false);
  const initials = (name||"").split(/[\s/&]+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const palette = [c.green, c.dark, "#7B6E8A", "#A57B5B", "#5B7BA5"];
  const colorIdx = (name||" ").charCodeAt(0) % palette.length;

  if (!domain || imgError) {
    if (fallbackEmoji) return (
      <div style={{width:size,height:size,borderRadius:"50%",background:"rgba(255,255,255,0.85)",border:"1px solid rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.55,flexShrink:0}}>{fallbackEmoji}</div>
    );
    return (
      <div style={{width:size,height:size,borderRadius:"50%",background:palette[colorIdx],display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.max(10,size*0.38),color:"#F4EFE8",fontWeight:700,fontFamily:"Georgia,serif",flexShrink:0}}>{initials||"·"}</div>
    );
  }

  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:"#fff",border:"1px solid rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt={name||""} width={Math.round(size*0.65)} height={Math.round(size*0.65)} onError={()=>setImgError(true)} style={{objectFit:"contain"}}/>
    </div>
  );
}

// ─── DATE INPUT ──────────────────────────────────────────────────────────────
function DateInput({ value, onChange, placeholder, style }) {
  const handleChange = (e) => {
    let raw = e.target.value.replace(/\D/g,"");
    if (raw.length > 8) raw = raw.slice(0,8);
    let formatted = raw;
    if (raw.length >= 3) formatted = raw.slice(0,2) + "." + raw.slice(2);
    if (raw.length >= 5) formatted = raw.slice(0,2) + "." + raw.slice(2,4) + "." + raw.slice(4);
    onChange(formatted);
  };
  return <input type="text" inputMode="numeric" maxLength={10} value={value||""} onChange={handleChange} placeholder={placeholder||"TT.MM.JJJJ"} style={style}/>;
}

// ─── SEARCH DROPDOWN ─────────────────────────────────────────────────────────
function SearchDD({items, selected, onSelect, placeholder, groupKey, groupLabels}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = items.filter(i=>i.name.toLowerCase().includes(q.toLowerCase()));
  const groups = groupKey ? [...new Set(items.map(i=>i[groupKey]))] : null;
  const shown = selected ? selected.name : q;
  return (
    <div style={{position:"relative",width:"100%"}}>
      <input style={inputStyle(!!selected)} placeholder={placeholder||"Suchen …"} value={shown} onChange={e=>{setQ(e.target.value);setOpen(true);if(selected)onSelect(null);}} onFocus={()=>setOpen(true)}/>
      {open && filtered.length > 0 && (
        <div style={ddBoxStyle}>
          {groups
            ? groups.map(g=>{const gi=filtered.filter(i=>i[groupKey]===g);if(!gi.length) return null;return (
                <div key={g}>
                  <p style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.08em",padding:"10px 13px 4px",margin:0,fontWeight:700}}>{groupLabels?.[g]||g}</p>
                  {gi.map(item=>(
                    <button key={item.id} style={ddOptStyle} onClick={()=>{onSelect(item);setQ("");setOpen(false);}}>
                      <span style={{fontSize:13,color:c.dark,fontFamily:"Georgia,serif"}}>{item.name}</span>
                      {item.street&&<span style={{fontSize:11,color:c.muted}}>{item.street}, {item.plz} {item.city}</span>}
                    </button>
                  ))}
                </div>);})
            : filtered.map(item=>(
                <button key={item.id} style={ddOptStyle} onClick={()=>{onSelect(item);setQ("");setOpen(false);}}>
                  <span style={{fontSize:13,color:c.dark,fontFamily:"Georgia,serif"}}>{item.name}</span>
                  {item.street&&<span style={{fontSize:11,color:c.muted}}>{item.street}, {item.plz} {item.city}</span>}
                </button>))}
        </div>
      )}
    </div>
  );
}

// ─── TOP NAV ─────────────────────────────────────────────────────────────────
function TopNav({ firstName, currentTab, unread, onNav, onLogout }) {
  const tabs = [
    {id:"dash",     label:"Übersicht", icon:"◉"},
    {id:"messages", label:"Nachrichten", icon:"✉"},
    {id:"documents",label:"Dokumente", icon:"📁"},
  ];
  return (
    <div style={{position:"fixed",top:0,left:0,right:0,height:60,zIndex:50,background:c.navBg,backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,0,0,0.07)",display:"flex",alignItems:"center"}}>
      <div style={{maxWidth:1280,margin:"0 auto",width:"100%",padding:"0 28px",display:"flex",alignItems:"center",gap:24}}>
        <button onClick={()=>onNav("dash")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,padding:0}}>
          <span style={{fontSize:24,lineHeight:1}}>🕊️</span>
          <span style={{fontSize:19,fontWeight:400,color:c.dark,fontStyle:"italic",fontFamily:"Georgia,serif",letterSpacing:"0.02em"}}>Begleiter</span>
        </button>
        <nav style={{display:"flex",gap:4,marginLeft:8}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>onNav(t.id)} style={{
              background: currentTab===t.id ? "rgba(74,124,111,0.1)" : "transparent",
              border:"none",borderRadius:10,padding:"7px 13px",cursor:"pointer",
              display:"flex",alignItems:"center",gap:6,
              color: currentTab===t.id ? c.green : c.mid,
              fontFamily:"Georgia,serif",fontSize:13,position:"relative"
            }}>
              <span style={{fontSize:12}}>{t.icon}</span>
              {t.label}
              {t.id==="messages" && unread>0 && (
                <span style={{position:"absolute",top:2,right:2,minWidth:16,height:16,borderRadius:99,background:c.red,color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{unread}</span>
              )}
            </button>
          ))}
        </nav>
        <div style={{flex:1}}/>
        <button onClick={()=>onNav("profile")} style={{
          background: currentTab==="profile" ? c.dark : "rgba(255,255,255,0.65)",
          border:`1px solid ${currentTab==="profile" ? c.dark : "rgba(0,0,0,0.08)"}`,
          borderRadius:99,cursor:"pointer",padding:"5px 14px 5px 5px",display:"flex",alignItems:"center",gap:9
        }}>
          <div style={{width:30,height:30,borderRadius:"50%",background:currentTab==="profile" ? "rgba(244,239,232,0.18)" : c.dark,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#F4EFE8",fontWeight:700,fontFamily:"Georgia,serif"}}>
            {firstName ? firstName[0].toUpperCase() : "·"}
          </div>
          <span style={{fontSize:13,fontFamily:"Georgia,serif",color:currentTab==="profile" ? "#F4EFE8" : c.dark}}>{firstName || "Profil"}</span>
        </button>
        <button onClick={onLogout} title="Abmelden" style={{background:"transparent",border:"1px solid rgba(0,0,0,0.08)",borderRadius:8,cursor:"pointer",padding:"7px 11px",fontSize:13,color:c.muted,fontFamily:"Georgia,serif"}}>↪</button>
      </div>
    </div>
  );
}

// ─── CHAT AGENT ──────────────────────────────────────────────────────────────
function ChatAgent({ context }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;
    const newMsgs = [...messages, { role:"user", content:text }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ messages:newMsgs, context }),
      });

      if (!res.ok) {
        const errText = await res.text();
        setMessages(m => [...m, { role:"assistant", content:`⚠️ ${errText}` }]);
        setLoading(false); return;
      }
      if (!res.body) throw new Error("Kein Response-Body");

      setMessages(m => [...m, { role:"assistant", content:"" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream:true });
        setMessages(m => { const next=[...m]; next[next.length-1]={role:"assistant",content:acc}; return next; });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unbekannter Fehler";
      setMessages(m => [...m, { role:"assistant", content:`⚠️ Verbindung fehlgeschlagen: ${msg}` }]);
    }
    setLoading(false);
  };

  const suggestions = ["Was muss ich zuerst erledigen?","Welche Fristen sind kritisch?","Wie schlage ich eine Erbschaft aus?"];

  return (
    <div style={{...cardStyle,padding:0,display:"flex",flexDirection:"column",flex:1,minHeight:0,overflow:"hidden"}}>
      <div style={{padding:"14px 16px 11px",borderBottom:"1px solid rgba(0,0,0,0.06)",display:"flex",alignItems:"center",gap:9}}>
        <div style={{width:30,height:30,borderRadius:"50%",background:"rgba(74,124,111,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
        <div>
          <p style={{fontSize:13,fontWeight:700,color:c.dark,fontFamily:"Georgia,serif",margin:0}}>KI-Assistent</p>
          <p style={{fontSize:10,color:c.muted,margin:0,letterSpacing:"0.04em"}}>Kennt Ihre offenen Aufgaben</p>
        </div>
      </div>
      <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:10,minHeight:0}}>
        {messages.length===0 && (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <p style={{fontSize:12,color:c.mid,lineHeight:1.6,margin:"4px 0 6px"}}>Stellen Sie Fragen zu Fristen, Schreiben oder den nächsten Schritten – ich beziehe Ihre offenen Aufgaben ein.</p>
            {suggestions.map(s => (
              <button key={s} onClick={()=>send(s)} style={{padding:"8px 11px",background:"rgba(74,124,111,0.06)",border:"1px solid rgba(74,124,111,0.18)",borderRadius:10,cursor:"pointer",fontSize:12,color:c.green,fontFamily:"Georgia,serif",textAlign:"left"}}>{s}</button>
            ))}
          </div>
        )}
        {messages.map((m,i)=>(
          <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"90%",padding:"9px 12px",borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.role==="user"?c.dark:"rgba(255,255,255,0.85)",border:m.role==="assistant"?"1px solid rgba(0,0,0,0.06)":"none"}}>
            <p style={{fontSize:13,lineHeight:1.6,margin:0,color:m.role==="user"?"#F4EFE8":c.dark,fontFamily:"Georgia,serif",whiteSpace:"pre-wrap"}}>{m.content || (loading && i===messages.length-1 ? "…" : "")}</p>
          </div>
        ))}
      </div>
      <div style={{padding:"10px 12px",borderTop:"1px solid rgba(0,0,0,0.06)",display:"flex",gap:8}}>
        <input style={{...inputStyle(!!input),flex:1,fontSize:13,padding:"9px 11px"}} placeholder="Frage stellen …" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} disabled={loading}/>
        <button onClick={()=>send()} disabled={loading||!input.trim()} style={{background:loading||!input.trim()?"rgba(0,0,0,0.08)":c.dark,color:loading||!input.trim()?c.muted:"#F4EFE8",border:"none",borderRadius:10,padding:"0 14px",cursor:loading||!input.trim()?"default":"pointer",fontSize:16,fontWeight:700,minWidth:42}}>{loading?"…":"↑"}</button>
      </div>
    </div>
  );
}

// ─── FAQ SECTION ─────────────────────────────────────────────────────────────
function FaqSection({ taskId }) {
  const [openIdx, setOpenIdx] = useState(null);
  const items = getFaq(taskId);
  if (!items?.length) return null;
  return (
    <div style={{...cardStyle,marginTop:14}}>
      <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,margin:"0 0 12px"}}>❓ Häufige Fragen</p>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {items.map((f,i)=>{
          const open = openIdx===i;
          return (
            <div key={i} style={{borderRadius:10,border:"1px solid rgba(0,0,0,0.08)",background:"rgba(255,255,255,0.5)",overflow:"hidden"}}>
              <button onClick={()=>setOpenIdx(open?null:i)} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"left"}}>
                <span style={{flex:1,fontSize:13,color:c.dark,fontFamily:"Georgia,serif",fontWeight:600}}>{f.q}</span>
                <span style={{color:c.muted,fontSize:14,transform:open?"rotate(180deg)":"rotate(0)",transition:"transform .2s"}}>▾</span>
              </button>
              {open && (
                <div style={{padding:"0 14px 12px",fontSize:13,color:c.mid,lineHeight:1.7,fontFamily:"Georgia,serif"}}>
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── AUTH VIEW ───────────────────────────────────────────────────────────────
function AuthView({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr("");
    if (!supabaseAvailable()) {
      setErr("Supabase nicht konfiguriert. NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local setzen.");
      return;
    }
    if (!email.includes("@")) { setErr("Bitte gültige E-Mail eingeben."); return; }
    if (pwd.length < 6) { setErr("Passwort: mind. 6 Zeichen."); return; }
    if (mode==="register" && !name.trim()) { setErr("Name eingeben."); return; }
    setBusy(true);
    try {
      if (mode==="register") {
        await signUp(email, pwd, name.trim());
        // Bei aktivierter E-Mail-Verifizierung: User ist noch nicht eingeloggt
        // Wir versuchen direkt Login (klappt, wenn Confirmation deaktiviert ist)
        try { await signIn(email, pwd); }
        catch { setErr("Bitte E-Mail bestätigen und dann anmelden."); setBusy(false); return; }
      } else {
        await signIn(email, pwd);
      }
      // onAuthChange im App-Root übernimmt den Rest
      onAuth();
    } catch (e) {
      setErr(e?.message || "Fehler bei der Anmeldung.");
    }
    setBusy(false);
  };

  return (
    <div style={{minHeight:"100vh",background:c.bg,fontFamily:"Georgia,'Times New Roman',serif",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      {bgGradient}
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:920,display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,...cardStyle,padding:0,overflow:"hidden"}}>
        <div style={{padding:"48px 40px",background:"linear-gradient(135deg,rgba(74,124,111,0.08),rgba(43,51,48,0.04))",display:"flex",flexDirection:"column",justifyContent:"center",gap:14,borderRight:"1px solid rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:48}}>🕊️</div>
          <h1 style={{fontSize:32,fontWeight:400,color:c.dark,margin:0,fontStyle:"italic"}}>Begleiter</h1>
          <p style={{fontSize:11,color:c.muted,letterSpacing:"0.09em",textTransform:"uppercase",margin:0}}>Ihr ruhiger Lotse</p>
          <p style={{fontSize:14,color:c.mid,lineHeight:1.7,margin:"8px 0 0"}}>Wir begleiten Sie durch alle notwendigen Schritte nach einem Todesfall – vom Bestatter bis zum Erbschein. Alle Schreiben werden für Sie vorbereitet.</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
            {["🔒 DSGVO","🇩🇪 DE","💙 Kostenlos"].map(t=>(<span key={t} style={{fontSize:11,color:c.green,background:"rgba(74,124,111,0.07)",border:"1px solid rgba(74,124,111,0.18)",borderRadius:99,padding:"3px 10px"}}>{t}</span>))}
          </div>
        </div>
        <div style={{padding:"44px 40px",display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",gap:4,padding:3,background:"rgba(0,0,0,0.04)",borderRadius:10,marginBottom:6}}>
            {[{id:"login",l:"Anmelden"},{id:"register",l:"Registrieren"}].map(t=>(
              <button key={t.id} onClick={()=>{setMode(t.id);setErr("");}} style={{flex:1,padding:"8px 12px",background:mode===t.id?"#fff":"transparent",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif",color:mode===t.id?c.dark:c.muted,fontWeight:mode===t.id?600:400}}>{t.l}</button>
            ))}
          </div>
          <h2 style={{fontSize:22,fontWeight:400,color:c.dark,fontStyle:"italic",margin:"4px 0 0"}}>{mode==="login"?"Willkommen zurück":"Konto erstellen"}</h2>
          <p style={{fontSize:12,color:c.muted,margin:0}}>{mode==="login"?"Setzen Sie Ihren Plan fort.":"In wenigen Sekunden eingerichtet."}</p>
          {mode==="register" && (
            <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:6}}>
              <span style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Name</span>
              <input style={inputStyle(!!name)} value={name} onChange={e=>setName(e.target.value)} placeholder="Vorname Nachname"/>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <span style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>E-Mail</span>
            <input type="email" style={inputStyle(!!email)} value={email} onChange={e=>setEmail(e.target.value)} placeholder="ihre@email.de"/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <span style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Passwort</span>
            <input type="password" style={inputStyle(!!pwd)} value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="mind. 6 Zeichen" onKeyDown={e=>e.key==="Enter"&&submit()}/>
          </div>
          {err && <p style={{fontSize:12,color:c.red,margin:"4px 0 0",background:"rgba(192,57,43,0.06)",padding:"7px 11px",borderRadius:8,border:"1px solid rgba(192,57,43,0.2)"}}>{err}</p>}
          <button onClick={submit} disabled={busy} style={{...primaryBtn,marginTop:10,opacity:busy?0.6:1}}>{busy?"…":(mode==="login"?"Anmelden →":"Konto erstellen →")}</button>
          <p style={{fontSize:11,color:c.faint,textAlign:"center",margin:"8px 0 0",lineHeight:1.5}}>🔒 Daten sicher in Supabase EU.<br/>Verschlüsselt & DSGVO-konform.</p>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE VIEW ────────────────────────────────────────────────────────────
function ProfileView({ formData, setFormData, prov, user }) {
  const [editing, setEditing] = useState(null);
  const set = (k,v) => setFormData(p=>({...p,[k]:v}));

  const Field = ({label, fieldKey, ph, isDate}) => {
    const val = formData[fieldKey]||"";
    const isEdit = editing===fieldKey;
    return (
      <div style={{display:"flex",flexDirection:"column",gap:4,padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,0.05)"}}>
        <span style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</span>
        {isEdit ? (
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {isDate
              ? <DateInput value={val} onChange={v=>set(fieldKey,v)} style={{...inputStyle(!!val),flex:1}} placeholder={ph}/>
              : <input autoFocus style={{...inputStyle(!!val),flex:1}} value={val} placeholder={ph||"–"} onChange={e=>set(fieldKey,e.target.value)} onBlur={()=>setEditing(null)} onKeyDown={e=>e.key==="Enter"&&setEditing(null)}/>}
            <button onClick={()=>setEditing(null)} style={{...ghostBtn,padding:"8px 12px",flexShrink:0}}>✓</button>
          </div>
        ) : (
          <button onClick={()=>setEditing(fieldKey)} style={{background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:14,color:val?c.dark:c.faint,fontFamily:"Georgia,serif"}}>{val||"Nicht angegeben"}</span>
            <span style={{fontSize:12,color:c.faint}}>✎</span>
          </button>
        )}
      </div>
    );
  };

  const Section = ({title, icon, children}) => (
    <div style={{...cardStyle,marginBottom:14}}>
      <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,margin:"0 0 4px"}}>{icon} {title}</p>
      {children}
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
        <div style={{width:54,height:54,borderRadius:"50%",background:c.dark,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:24}}>🗄</span></div>
        <div>
          <h1 style={{fontSize:26,fontWeight:400,color:c.dark,fontStyle:"italic",margin:0}}>Datentresor</h1>
          <p style={{fontSize:12,color:c.muted,margin:"2px 0 0"}}>{Object.values(formData).filter(Boolean).length} Felder · automatisch in alle Schreiben eingefügt</p>
        </div>
      </div>

      {user && (
        <div style={{...cardStyle,marginBottom:14,background:"rgba(74,124,111,0.05)",border:"1px solid rgba(74,124,111,0.15)"}}>
          <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,margin:"0 0 6px"}}>👤 Konto</p>
          <p style={{fontSize:14,color:c.dark,margin:0,fontFamily:"Georgia,serif"}}>{user.name}</p>
          <p style={{fontSize:12,color:c.muted,margin:"2px 0 0"}}>{user.email}</p>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div>
          <Section title="Verstorbene Person" icon="🕊️">
            <Field label="Vollständiger Name" fieldKey="deceased_name" ph="Vor- und Nachname"/>
            <Field label="Geburtsdatum" fieldKey="deceased_dob" ph="TT.MM.JJJJ" isDate/>
            <Field label="Sterbedatum" fieldKey="death_date" ph="TT.MM.JJJJ" isDate/>
            <Field label="Letzte Wohnadresse" fieldKey="deceased_address" ph="Straße, PLZ Ort"/>
            <Field label="Sterbeort (PLZ Ort)" fieldKey="death_place_plz" ph="z. B. 80331 München"/>
          </Section>
          <Section title="Versicherungen" icon="🛡️">
            <Field label="KV-Mitgliedsnummer" fieldKey="kv_nr" ph="Nummer von Krankenkassenkarte"/>
            <Field label="Rentenversicherungsnummer" fieldKey="rentenversicherung_nr" ph="12-stellige RV-Nummer"/>
            <div style={{padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,0.05)"}}>
              <span style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Krankenkasse</span>
              <p style={{fontSize:14,color:prov.kv?c.dark:c.faint,fontFamily:"Georgia,serif",margin:"4px 0 0"}}>{prov.kv?.name||"Nicht angegeben"}</p>
            </div>
            {prov.insurance?.length>0&&(
              <div style={{padding:"10px 0"}}>
                <span style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Weitere Versicherungen</span>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:6}}>
                  {prov.insurance.map(i=>(<span key={i.id} style={{fontSize:12,background:"rgba(74,124,111,0.08)",color:c.green,border:"1px solid rgba(74,124,111,0.2)",borderRadius:99,padding:"3px 10px"}}>{i.name}</span>))}
                </div>
              </div>
            )}
          </Section>
        </div>
        <div>
          <Section title="Ihre Person" icon="👤">
            <Field label="Ihr Name" fieldKey="applicant_name" ph="Vor- und Nachname"/>
            <Field label="Ihre Anschrift" fieldKey="applicant_address" ph="Straße, PLZ Ort"/>
            <div style={{padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,0.05)"}}>
              <span style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Verhältnis zur verstorbenen Person</span>
              <p style={{fontSize:14,color:formData.applicant_relation?c.dark:c.faint,fontFamily:"Georgia,serif",margin:"4px 0 0"}}>{formData.applicant_relation||"Nicht angegeben"}</p>
            </div>
          </Section>
          <Section title="Bank & Finanzen" icon="🏦">
            <Field label="IBAN / Kontonummer" fieldKey="bank_kontonr" ph="DE…"/>
            <div style={{padding:"10px 0"}}>
              <span style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Bank</span>
              <p style={{fontSize:14,color:prov.bank?c.dark:c.faint,fontFamily:"Georgia,serif",margin:"4px 0 0"}}>{prov.bank?.name||"Nicht angegeben"}</p>
            </div>
          </Section>
          {formData.had_rental==="yes"&&(
            <Section title="Wohnsituation" icon="🏠">
              <Field label="Vermieter / Hausverwaltung" fieldKey="vermieter_name" ph="Name"/>
              <Field label="Adresse Mietwohnung" fieldKey="rental_address" ph="Straße, PLZ Ort"/>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DOCUMENTS VIEW ──────────────────────────────────────────────────────────
function DocumentsView({ documents, setDocuments, userId }) {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = async (files) => {
    setErr("");
    if (!userId) { setErr("Bitte erst anmelden."); return; }
    setBusy(true);
    for (const file of Array.from(files)) {
      if (file.size > 25 * 1024 * 1024) { setErr(`${file.name} > 25MB.`); continue; }
      try {
        const doc = await uploadDocument(userId, file);
        if (doc) setDocuments(d => [doc, ...d]);
      } catch (e) {
        setErr(`Upload fehlgeschlagen: ${e?.message || e}`);
      }
    }
    setBusy(false);
  };

  const handleDelete = async (doc) => {
    setDocuments(arr => arr.filter(x => x.id !== doc.id));
    await deleteDocument(doc);
  };

  const handleDownload = async (doc) => {
    const url = await getDocumentUrl(doc.storage_path);
    if (url) window.open(url, "_blank");
  };

  const formatSize = (b) => b < 1024 ? b+"B" : b < 1024*1024 ? (b/1024).toFixed(1)+"KB" : (b/1024/1024).toFixed(1)+"MB";
  const iconFor = (type) => {
    if (type?.startsWith("image/")) return "🖼️";
    if (type === "application/pdf") return "📄";
    if (type?.includes("word")) return "📝";
    return "📎";
  };

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
        <div style={{width:54,height:54,borderRadius:"50%",background:c.dark,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:24}}>📁</span></div>
        <div style={{flex:1}}>
          <h1 style={{fontSize:26,fontWeight:400,color:c.dark,fontStyle:"italic",margin:0}}>Dokumente</h1>
          <p style={{fontSize:12,color:c.muted,margin:"2px 0 0"}}>{documents.length} Dokument{documents.length!==1?"e":""} · zum Anhängen an Schreiben</p>
        </div>
        <button onClick={()=>fileRef.current?.click()} disabled={busy} style={{...primaryBtn,width:"auto",padding:"11px 20px",opacity:busy?0.6:1}}>{busy?"Lädt …":"+ Hochladen"}</button>
        <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.doc,.docx" style={{display:"none"}} onChange={e=>e.target.files&&handleUpload(e.target.files)}/>
      </div>

      {err && <p style={{fontSize:13,color:c.red,background:"rgba(192,57,43,0.06)",border:"1px solid rgba(192,57,43,0.2)",borderRadius:10,padding:"10px 14px",marginBottom:14}}>{err}</p>}

      <div style={{...cardStyle,marginBottom:14,background:"rgba(74,124,111,0.04)",border:"1px dashed rgba(74,124,111,0.25)"}} onDragOver={e=>{e.preventDefault();e.stopPropagation();}} onDrop={e=>{e.preventDefault();e.stopPropagation();if(e.dataTransfer.files)handleUpload(e.dataTransfer.files);}}>
        <p style={{fontSize:13,color:c.green,fontFamily:"Georgia,serif",margin:0,textAlign:"center"}}>📥 Dateien hierhin ziehen oder oben hochladen</p>
        <p style={{fontSize:11,color:c.muted,margin:"4px 0 0",textAlign:"center"}}>Sterbeurkunde, Totenschein, Personalausweis, Versicherungspolicen … (max. 25MB pro Datei)</p>
      </div>

      {documents.length===0 ? (
        <div style={{...cardStyle,textAlign:"center",padding:"40px 20px",color:c.muted,fontSize:14}}>Noch keine Dokumente hochgeladen.</div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
          {documents.map(d=>(
            <div key={d.id} style={{...cardStyle,padding:14,display:"flex",flexDirection:"column",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:28,lineHeight:1}}>{iconFor(d.type)}</span>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:13,color:c.dark,fontFamily:"Georgia,serif",margin:0,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{d.name}</p>
                  <p style={{fontSize:11,color:c.muted,margin:"2px 0 0"}}>{formatSize(d.size)} · {new Date(d.created_at).toLocaleDateString("de-DE")}</p>
                </div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>handleDownload(d)} style={{...ghostBtn,flex:1,textAlign:"center",padding:"7px",fontSize:12}}>↓ Öffnen</button>
                <button onClick={()=>handleDelete(d)} style={{...ghostBtn,padding:"7px 11px",fontSize:12,color:c.red,borderColor:"rgba(192,57,43,0.3)"}}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MESSAGES VIEW ───────────────────────────────────────────────────────────
function MessagesView({ messages, setMessages }) {
  const [activeId, setActiveId] = useState(null);
  const sorted = [...messages].sort((a,b)=>new Date(b.received_at)-new Date(a.received_at));
  const active = sorted.find(m=>m.id===activeId);

  const markRead = async (id) => {
    setMessages(m=>m.map(x=>x.id===id?{...x,read:true}:x));
    await markMessageRead(id);
  };
  const handleDelete = async (id) => {
    setMessages(m=>m.filter(x=>x.id!==id));
    await deleteMessage(id);
    setActiveId(null);
  };

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
        <div style={{width:54,height:54,borderRadius:"50%",background:c.dark,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:24}}>✉</span></div>
        <div style={{flex:1}}>
          <h1 style={{fontSize:26,fontWeight:400,color:c.dark,fontStyle:"italic",margin:0}}>Nachrichten-Center</h1>
          <p style={{fontSize:12,color:c.muted,margin:"2px 0 0"}}>{sorted.filter(m=>!m.read).length} ungelesen · Antworten auf digital versandte Schreiben</p>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"320px 1fr",gap:14,minHeight:500}}>
        <div style={{...cardStyle,padding:0,maxHeight:600,overflowY:"auto"}}>
          {sorted.length===0 ? (
            <div style={{padding:30,textAlign:"center",color:c.muted,fontSize:13}}>Keine Nachrichten.<br/>Antworten auf digitale Schreiben erscheinen hier.</div>
          ) : sorted.map(m=>(
            <button key={m.id} onClick={()=>{setActiveId(m.id);if(!m.read)markRead(m.id);}} style={{
              display:"block",width:"100%",padding:"13px 16px",background:active?.id===m.id?"rgba(74,124,111,0.07)":"transparent",
              border:"none",borderBottom:"1px solid rgba(0,0,0,0.05)",cursor:"pointer",textAlign:"left"
            }}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                {!m.read && <span style={{width:7,height:7,borderRadius:"50%",background:c.green,flexShrink:0}}/>}
                <span style={{fontSize:13,color:c.dark,fontFamily:"Georgia,serif",fontWeight:m.read?400:700,flex:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.from_name}</span>
                <span style={{fontSize:10,color:c.muted}}>{new Date(m.received_at).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})}</span>
              </div>
              <p style={{fontSize:12,color:c.dark,margin:"0 0 2px",fontWeight:m.read?400:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.subject}</p>
              <p style={{fontSize:11,color:c.muted,margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.body.slice(0,80)}…</p>
            </button>
          ))}
        </div>

        <div style={{...cardStyle,padding:0,minHeight:400}}>
          {active ? (
            <div style={{padding:24}}>
              <div style={{paddingBottom:14,borderBottom:"1px solid rgba(0,0,0,0.06)",marginBottom:16}}>
                <p style={{fontSize:11,color:c.muted,letterSpacing:"0.08em",textTransform:"uppercase",margin:0}}>Von</p>
                <p style={{fontSize:15,color:c.dark,fontFamily:"Georgia,serif",margin:"2px 0 8px",fontWeight:600}}>{active.from_name}</p>
                <p style={{fontSize:11,color:c.muted,letterSpacing:"0.08em",textTransform:"uppercase",margin:0}}>Betreff</p>
                <p style={{fontSize:18,color:c.dark,fontFamily:"Georgia,serif",fontStyle:"italic",margin:"2px 0 8px"}}>{active.subject}</p>
                <p style={{fontSize:11,color:c.muted,margin:0}}>{new Date(active.received_at).toLocaleString("de-DE")}</p>
              </div>
              <p style={{fontSize:14,color:c.dark,fontFamily:"Georgia,serif",lineHeight:1.7,whiteSpace:"pre-wrap",margin:0}}>{active.body}</p>
              <div style={{display:"flex",gap:8,marginTop:24,paddingTop:14,borderTop:"1px solid rgba(0,0,0,0.06)"}}>
                <button style={ghostBtn}>↩ Antworten</button>
                <button onClick={()=>handleDelete(active.id)} style={{...ghostBtn,color:c.red,borderColor:"rgba(192,57,43,0.3)"}}>🗑 Löschen</button>
              </div>
            </div>
          ) : (
            <div style={{padding:60,textAlign:"center",color:c.muted,fontSize:14}}>{sorted.length>0 ? "Nachricht auswählen, um sie zu lesen." : "Noch keine Nachrichten."}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  // Auth & persistence
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("auth");
  const [obStep, setObStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [prov, setProv] = useState({kv:null,internet:null,mobile:null,bank:null,streaming:[],insurance:[]});
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [documents, setDocuments] = useState([]);
  const [chatMessages, setChatMessages] = useState([]); // for inbox / message-center

  // UI state
  const [dashView, setDashView] = useState("list");
  const [active, setActive] = useState(null);
  const [letter, setLetter] = useState("");
  const [sentMode, setSentMode] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [navTab, setNavTab] = useState("dash");
  const [letterDocIds, setLetterDocIds] = useState([]); // attachments for current letter
  const [funeralPlz, setFuneralPlz] = useState("");
  const [funeralResults, setFuneralResults] = useState([]);
  const [funeralLoading, setFuneralLoading] = useState(false);
  const [funeralSort, setFuneralSort] = useState("rating");

  // Estate ID for the active nachlass record
  const [estateId, setEstateId] = useState(null);

  // Load user data from Supabase
  const loadUserData = async (authUser) => {
    if (!authUser) return;
    const fullName = authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "";
    setUser({ id: authUser.id, email: authUser.email, name: fullName });

    // Load estate
    const estate = await loadEstate(authUser.id);
    if (estate) {
      setEstateId(estate.id);
      const fd = estate.form_data || {};
      const pr = estate.providers || {kv:null,internet:null,mobile:null,bank:null,streaming:[],insurance:[]};
      setFormData(fd);
      setProv(pr);

      // Load statuses
      const sts = await loadStatuses(estate.id);
      const stMap = {};
      sts.forEach(s => { stMap[s.task_id] = { mode:s.mode, date:new Date(s.status_date).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"}), letter:s.letter||"", note:s.note||"", attachments:s.attachments||[] }; });
      setStatuses(stMap);

      // Generate tasks
      if (fd.deceased_name) { setTasks(makeTasks(fd, pr)); setPage("dash"); }
      else setPage("ob");
    } else {
      setEstateId(null);
      setPage("ob");
    }

    // Load documents + messages in parallel
    const [docs, msgs] = await Promise.all([loadDocuments(authUser.id), loadMessages(authUser.id)]);
    setDocuments(docs);

    // Seed welcome message if completely empty
    if (msgs.length === 0) {
      const welcome = await insertMessage(authUser.id, {
        from_name: "Begleiter-Team",
        subject: "Willkommen im Begleiter",
        body: "Schön, dass Sie da sind.\n\nIm Nachrichten-Center sehen Sie Antworten auf alle digital versandten Schreiben. Antworten von Behörden und Versicherungen werden hier automatisch zugeordnet.\n\nDer KI-Assistent rechts auf dem Dashboard kennt Ihre Aufgaben und hilft mit Fristen, Schritten und Briefen.\n\nIhr Begleiter-Team"
      });
      setChatMessages(welcome ? [welcome] : []);
    } else {
      setChatMessages(msgs);
    }
  };

  // On mount: check session + listen for auth changes
  useEffect(() => {
    if (!supabaseAvailable()) { setHydrated(true); setPage("auth"); return; }
    (async () => {
      const u = await getCurrentUser();
      if (u) await loadUserData(u);
      else setPage("auth");
      setHydrated(true);
    })();
    const { data:{ subscription } } = onAuthChange(async (u) => {
      if (u) { await loadUserData(u); }
      else { setUser(null); setPage("auth"); setEstateId(null); }
    });
    return () => subscription?.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced save of estate (form_data + providers)
  useDebouncedEffect(() => {
    if (!hydrated || !user) return;
    if (!formData.deceased_name && !estateId) return; // nothing to save yet
    saveEstate(user.id, estateId, formData, prov).then(saved => {
      if (saved && !estateId) setEstateId(saved.id);
    });
  }, [formData, prov, user, hydrated], 800);

  const setField = (k,v) => setFormData(prev=>({...prev,[k]:v}));

  const handleAuth = () => {
    // onAuthChange listener im Mount-useEffect übernimmt das Laden
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setEstateId(null);
    setFormData({}); setProv({kv:null,internet:null,mobile:null,bank:null,streaming:[],insurance:[]});
    setTasks([]); setStatuses({}); setDocuments([]); setChatMessages([]);
    setPage("auth"); setNavTab("dash"); setDashView("list");
  };

  const finishOb = (fd, pr) => {
    const merged = {...fd, kv_name:pr.kv?.name, kv_type:pr.kv?.type, bank_name:pr.bank?.name};
    setFormData(merged); setProv(pr);
    setTasks(makeTasks(merged, pr));
    setFuneralPlz(merged.death_place_plz?.split(" ")[0]||"");
    setPage("dash");
  };

  const obAdvance = (fd, pr) => {
    let next = obStep + 1;
    while (next < OB.length) { const s = OB[next]; if (s.cond && fd[s.cond.f] !== s.cond.v) { next++; continue; } break; }
    if (next >= OB.length) { finishOb(fd, pr); return; }
    if (OB[next].type === "result") { finishOb(fd, pr); return; }
    setObStep(next);
  };

  const obBack = () => {
    let prev = obStep - 1;
    while (prev > 0) { const s = OB[prev]; if (s.cond && formData[s.cond.f] !== s.cond.v) { prev--; continue; } break; }
    setObStep(Math.max(0, prev));
  };

  const genLetter = (task) => {
    let p = null;
    if (task.isKV) p = prov.kv;
    else if (task.isUV) p = prov.insurance?.find(i=>i.cat==="Unfall")||null;
    else if (task.id==="bank") p = prov.bank;
    else if (task.id==="internet") p = prov.internet;
    else if (task.id==="mobile") p = prov.mobile;
    else if (task.streamProv) p = task.streamProv;
    else if (task.insProv) p = task.insProv;
    setLetter(buildLetter(task.id, formData, p));
    setLetterDocIds([]);
    setDashView("letter");
  };

  const doSend = async (mode) => {
    setSentMode(mode);
    setStatuses(s=>({...s,[active.id]:{mode,date:fmtDate(),letter,attachments:letterDocIds}}));
    setDashView("sent");
    if (user && estateId) {
      await upsertStatus(user.id, estateId, active.id, {
        mode, status_date: new Date().toISOString().slice(0,10),
        letter, attachments: letterDocIds
      });
    }
    if (mode === "digital" && user) {
      // Mock-Eingangsbestätigung 3s später in DB einfügen
      setTimeout(async () => {
        const msg = await insertMessage(user.id, {
          task_id: active.id,
          from_name: active.inst,
          subject: `Eingangsbestätigung – ${active.title}`,
          body: `Sehr geehrte/r Antragsteller/in,\n\nvielen Dank für Ihre Nachricht. Wir haben Ihr Anliegen erhalten und werden uns innerhalb der gesetzlichen Frist bei Ihnen melden.\n\nBei Rückfragen geben Sie bitte das Datum vom ${fmtDate()} an.\n\nMit freundlichen Grüßen\n${active.inst}`
        });
        if (msg) setChatMessages(m => [msg, ...m]);
      }, 3000);
    }
  };

  const markDone = async (id) => {
    setStatuses(s=>({...s,[id]:{mode:"manual",date:fmtDate(),letter:""}}));
    setDashView("list"); setActive(null);
    if (user && estateId) {
      await upsertStatus(user.id, estateId, id, {
        mode:"manual", status_date: new Date().toISOString().slice(0,10), letter:""
      });
    }
  };

  const resetStatus = async (id) => {
    setStatuses(s => { const n={...s}; delete n[id]; return n; });
    if (estateId) await deleteStatus(estateId, id);
    setDashView("list");
  };

  const searchFuneral = useCallback(async () => {
    if (!funeralPlz.trim()) return;
    setFuneralLoading(true);
    try {
      const res = await fetch(`/api/bestatter?plz=${encodeURIComponent(funeralPlz)}`);
      const data = await res.json();
      setFuneralResults(data.results||[]);
    } catch { setFuneralResults([]); }
    setFuneralLoading(false);
  }, [funeralPlz]);

  const sortedFuneral = [...funeralResults].sort((a,b)=>{
    if (funeralSort==="rating") return (b.rating||0)-(a.rating||0);
    if (funeralSort==="reviews") return (b.reviews||0)-(a.reviews||0);
    return 0;
  });

  const CATS = [
    {id:"urgent",label:"Sofort",color:c.red,bg:"rgba(192,57,43,0.07)"},
    {id:"week",label:"Diese Woche",color:c.amber,bg:"rgba(217,119,6,0.07)"},
    {id:"later",label:"Später",color:c.green,bg:"rgba(74,124,111,0.07)"},
  ];

  // Don't render until hydrated (prevents flash of auth screen)
  if (!hydrated) return <div style={{minHeight:"100vh",background:c.bg}}/>;

  // ── AUTH ─────────────────────────────────────────────────────────────────
  if (page==="auth") return <AuthView onAuth={handleAuth}/>;

  const firstName = user?.name?.split(/\s+/)[0] || (formData.applicant_name||"").trim().split(/\s+/)[0] || "";
  const handleNav = (tab) => {
    if (tab === "dash") { setNavTab("dash"); setDashView("list"); setActive(null); return; }
    if (tab === "profile") { setNavTab(t => t==="profile" ? "dash" : "profile"); setDashView("list"); return; }
    setNavTab(tab); setDashView("list");
  };

  // ── ONBOARDING ───────────────────────────────────────────────────────────
  if (page==="ob") {
    const cur = OB[obStep];
    const prog = Math.round((obStep/(OB.length-1))*100);
    const canNext = () => {
      if (!cur) return false;
      if (cur.opt) return true;
      if (cur.type==="intro"||cur.type==="result") return true;
      if (cur.type==="single") return !!formData[cur.id];
      if (cur.type==="multi") return (formData[cur.id]||[]).length>0;
      if (cur.type==="kvdrop") return !!prov.kv;
      if (cur.type==="singledrop"||cur.type==="multidrop") return true;
      return !!formData[cur.id];
    };

    // Determine width based on step type
    const isWide = cur.type === "multidrop" || cur.type === "single" || cur.type === "multi";
    const maxW = cur.type === "intro" || cur.type === "result" ? 600 : (isWide ? 720 : 600);
    const gridCols = cur.type === "single" ? "1fr 1fr 1fr" : cur.type === "multi" ? "1fr 1fr 1fr" : "1fr 1fr";

    return (
      <div style={{minHeight:"100vh",background:c.bg,fontFamily:"Georgia,'Times New Roman',serif"}}>
        {bgGradient}
        {/* Progress bar */}
        {obStep>0 && (
          <div style={{position:"fixed",top:0,left:0,right:0,height:3,background:"rgba(0,0,0,0.07)",zIndex:99}}>
            <div style={{height:"100%",width:`${prog}%`,background:c.green,transition:"width .3s"}}/>
          </div>
        )}
        {/* Mini header */}
        <div style={{position:"fixed",top:8,right:24,zIndex:50,fontSize:12,color:c.muted,fontFamily:"Georgia,serif"}}>
          {obStep>0 && `Schritt ${obStep} von ${OB.length-2}`}
          <button onClick={handleLogout} style={{marginLeft:14,background:"none",border:"1px solid rgba(0,0,0,0.08)",borderRadius:6,padding:"3px 9px",fontSize:11,cursor:"pointer",color:c.muted,fontFamily:"Georgia,serif"}}>Abmelden</button>
        </div>
        <div style={{position:"relative",zIndex:1,maxWidth:maxW,margin:"0 auto",padding:"50px 20px"}}>
          <div style={{...cardStyle,padding:0}}>
            {cur.type==="intro" && (
              <div style={{padding:"50px 36px 40px",display:"flex",flexDirection:"column",alignItems:"center",gap:14,textAlign:"center"}}>
                <div style={{fontSize:54}}>🕊️</div>
                <h1 style={{fontSize:32,fontWeight:400,color:c.dark,margin:0,fontStyle:"italic"}}>Begleiter</h1>
                <p style={{fontSize:11,color:c.muted,letterSpacing:"0.09em",textTransform:"uppercase",margin:0}}>Hallo {firstName} – wir richten Ihren Plan ein</p>
                <p style={{fontSize:14,color:c.mid,lineHeight:1.8,textAlign:"center",maxWidth:380,margin:0}}>In den nächsten Schritten erfassen wir die wichtigsten Informationen. Alle Schreiben werden danach automatisch ausgefüllt.</p>
                <button style={{...primaryBtn,marginTop:8,maxWidth:280}} onClick={()=>setObStep(1)}>Jetzt beginnen</button>
                <button style={{background:"none",border:"none",color:c.faint,fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif"}} onClick={()=>finishOb(formData,prov)}>Direkt zum Dashboard →</button>
              </div>
            )}
            {(cur.type==="text"||cur.type==="date") && (
              <div style={{padding:"36px 32px 30px",display:"flex",flexDirection:"column",gap:10}}>
                <button style={backBtn} onClick={obBack}>← Zurück</button>
                <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
                <h2 style={{fontSize:20,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
                {cur.hint && <p style={{fontSize:13,color:c.muted,margin:0}}>{cur.hint}</p>}
                {cur.opt && <p style={{fontSize:11,color:c.faint,margin:0}}>Optional</p>}
                {cur.type==="date"
                  ? <DateInput value={formData[cur.id]||""} onChange={v=>setField(cur.id,v)} style={inputStyle(!!formData[cur.id])} placeholder={cur.ph}/>
                  : <input autoFocus style={inputStyle(!!formData[cur.id])} placeholder={cur.ph} value={formData[cur.id]||""} onChange={e=>setField(cur.id,e.target.value)} onKeyDown={e=>e.key==="Enter"&&canNext()&&obAdvance(formData,prov)}/>}
                <button style={{...primaryBtn,opacity:canNext()?1:0.4,marginTop:4}} onClick={()=>canNext()&&obAdvance(formData,prov)} disabled={!canNext()}>{cur.opt&&!formData[cur.id]?"Überspringen →":"Weiter →"}</button>
              </div>
            )}
            {cur.type==="single" && (
              <div style={{padding:"36px 32px 30px",display:"flex",flexDirection:"column",gap:10}}>
                <button style={backBtn} onClick={obBack}>← Zurück</button>
                <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
                <h2 style={{fontSize:20,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
                <div style={{display:"grid",gridTemplateColumns:gridCols,gap:9}}>
                  {cur.opts.map(o=>{
                    const on=formData[cur.id]===o.v;
                    return (
                      <button key={o.v} style={optCardStyle(on)} onClick={()=>{
                        const fd={...formData,[cur.id]:o.v};
                        setField(cur.id,o.v);
                        setTimeout(()=>obAdvance(fd,prov),260);
                      }}>
                        <span style={{fontSize:20}}>{o.i}</span>
                        <span style={{fontSize:13,color:on?c.dark:c.mid,fontFamily:"Georgia,serif"}}>{o.l}</span>
                        {on && <span style={{position:"absolute",top:8,right:10,fontSize:11,color:c.green,fontWeight:"bold"}}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {cur.type==="multi" && (
              <div style={{padding:"36px 32px 30px",display:"flex",flexDirection:"column",gap:10}}>
                <button style={backBtn} onClick={obBack}>← Zurück</button>
                <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
                <h2 style={{fontSize:20,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
                {cur.hint && <p style={{fontSize:13,color:c.muted,margin:0}}>{cur.hint}</p>}
                <div style={{display:"grid",gridTemplateColumns:gridCols,gap:9}}>
                  {cur.opts.map(o=>{
                    const sel=(formData[cur.id]||[]).includes(o.v);
                    return (
                      <button key={o.v} style={optCardStyle(sel)} onClick={()=>{
                        const prev=formData[cur.id]||[];
                        setField(cur.id,sel?prev.filter(x=>x!==o.v):[...prev,o.v]);
                      }}>
                        <span style={{fontSize:20}}>{o.i}</span>
                        <span style={{fontSize:13,color:sel?c.dark:c.mid,fontFamily:"Georgia,serif"}}>{o.l}</span>
                        {sel && <span style={{position:"absolute",top:8,right:10,fontSize:11,color:c.green,fontWeight:"bold"}}>✓</span>}
                      </button>
                    );
                  })}
                </div>
                <button style={{...primaryBtn,opacity:canNext()?1:0.4,marginTop:4}} onClick={()=>canNext()&&obAdvance(formData,prov)} disabled={!canNext()}>Weiter ({(formData[cur.id]||[]).length} ausgewählt)</button>
              </div>
            )}
            {cur.type==="kvdrop" && (
              <div style={{padding:"36px 32px 30px",display:"flex",flexDirection:"column",gap:10}}>
                <button style={backBtn} onClick={obBack}>← Zurück</button>
                <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
                <h2 style={{fontSize:20,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
                <p style={{fontSize:11,color:c.faint,margin:0}}>Optional</p>
                <SearchDD items={KV_LIST} selected={prov.kv} onSelect={kv=>setProv(p=>({...p,kv}))} placeholder="Krankenkasse suchen …" groupKey="type" groupLabels={{GKV:"Gesetzlich (GKV)",PKV:"Privat (PKV)"}}/>
                {prov.kv && (
                  <div style={infoStyle}>
                    <span style={{fontSize:11,color:c.muted}}>📍 {mkAddr(prov.kv)}</span>
                    <span style={{fontSize:11,color:prov.kv.type==="PKV"?c.red:c.green,fontWeight:600}}>{prov.kv.type==="PKV"?"Privat: tagesgenaue Abrechnung":"Gesetzlich: Einzug stoppen"}</span>
                  </div>
                )}
                <button style={{...primaryBtn,marginTop:4}} onClick={()=>obAdvance(formData,prov)}>{prov.kv?"Weiter →":"Überspringen →"}</button>
              </div>
            )}
            {cur.type==="singledrop" && (
              <div style={{padding:"36px 32px 30px",display:"flex",flexDirection:"column",gap:10}}>
                <button style={backBtn} onClick={obBack}>← Zurück</button>
                <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
                <h2 style={{fontSize:20,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
                <p style={{fontSize:11,color:c.faint,margin:0}}>Optional</p>
                <SearchDD items={cur.provList} selected={prov[cur.provKey]||null} onSelect={item=>setProv(p=>({...p,[cur.provKey]:item}))} placeholder="Suchen …"/>
                {prov[cur.provKey] && (
                  <div style={infoStyle}>
                    <span style={{fontSize:11,color:c.muted}}>📍 {mkAddr(prov[cur.provKey])}</span>
                    {prov[cur.provKey].email && prov[cur.provKey].email!=="–" && <span style={{fontSize:11,color:c.green}}>✉ {prov[cur.provKey].email}</span>}
                  </div>
                )}
                <button style={{...primaryBtn,marginTop:4}} onClick={()=>obAdvance(formData,prov)}>{prov[cur.provKey]?"Weiter →":"Überspringen →"}</button>
              </div>
            )}
            {cur.type==="multidrop" && (
              <div style={{padding:"36px 32px 30px",display:"flex",flexDirection:"column",gap:10}}>
                <button style={backBtn} onClick={obBack}>← Zurück</button>
                <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
                <h2 style={{fontSize:20,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
                <p style={{fontSize:11,color:c.faint,margin:0}}>Optional – Mehrfachauswahl</p>
                {cur.provList[0]?.cat
                  ? [...new Set(cur.provList.map(i=>i.cat))].map(cat=>(
                      <div key={cat}>
                        <p style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.08em",margin:"8px 0 6px",fontWeight:700}}>{cat}</p>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                          {cur.provList.filter(i=>i.cat===cat).map(item=>{
                            const key=cur.id==="streaming_sel"?"streaming":"insurance";
                            const sel=(prov[key]||[]).some(x=>x.id===item.id);
                            return (
                              <button key={item.id} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 12px",background:"rgba(255,255,255,0.55)",border:`1.5px solid ${sel?"rgba(74,124,111,0.4)":"rgba(0,0,0,0.08)"}`,borderRadius:10,cursor:"pointer",width:"100%"}}
                                onClick={()=>setProv(p=>({...p,[key]:sel?(p[key]||[]).filter(x=>x.id!==item.id):[...(p[key]||[]),item]}))}>
                                <ServiceLogo domain={item.domain} name={item.name} size={24}/>
                                <span style={{fontSize:12,flex:1,textAlign:"left",color:sel?c.dark:c.mid,fontFamily:"Georgia,serif"}}>{item.name}</span>
                                {sel && <span style={{color:c.green,fontWeight:700,fontSize:13}}>✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  : (
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                      {cur.provList.map(item=>{
                        const key=cur.id==="streaming_sel"?"streaming":"insurance";
                        const sel=(prov[key]||[]).some(x=>x.id===item.id);
                        return (
                          <button key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",background:"rgba(255,255,255,0.55)",border:`1.5px solid ${sel?"rgba(74,124,111,0.4)":"rgba(0,0,0,0.08)"}`,borderRadius:10,cursor:"pointer"}}
                            onClick={()=>setProv(p=>({...p,[key]:sel?(p[key]||[]).filter(x=>x.id!==item.id):[...(p[key]||[]),item]}))}>
                            <ServiceLogo domain={item.domain} name={item.name} size={26}/>
                            <span style={{fontSize:13,flex:1,textAlign:"left",color:sel?c.dark:c.mid,fontFamily:"Georgia,serif"}}>{item.name}</span>
                            {sel && <span style={{color:c.green,fontWeight:700,fontSize:13}}>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                <button style={{...primaryBtn,marginTop:4}} onClick={()=>obAdvance(formData,prov)}>
                  {(()=>{const key=cur.id==="streaming_sel"?"streaming":"insurance";const n=(prov[key]||[]).length;return n>0?`Weiter (${n} ausgewählt)`:"Überspringen →";})()}
                </button>
              </div>
            )}
            {cur.type==="result" && (
              <div style={{padding:"50px 36px 40px",display:"flex",flexDirection:"column",alignItems:"center",gap:14,textAlign:"center"}}>
                <div style={{fontSize:48}}>📋</div>
                <h2 style={{fontSize:28,fontWeight:400,color:c.dark,margin:0,fontStyle:"italic"}}>Ihr Plan ist bereit</h2>
                <p style={{fontSize:14,color:c.mid,lineHeight:1.8,maxWidth:340,margin:0}}>Alle Schreiben werden automatisch mit Ihren Angaben ausgefüllt.</p>
                <button style={{...primaryBtn,marginTop:8,maxWidth:280}} onClick={()=>finishOb(formData,prov)}>Zum Dashboard →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD AREA ───────────────────────────────────────────────────────
  const done = Object.keys(statuses).length;
  const vis = catFilter==="all" ? tasks : tasks.filter(t=>t.cat===catFilter);
  const urgentOpen = tasks.filter(t=>t.cat==="urgent"&&!statuses[t.id]).length;
  const weekOpen = tasks.filter(t=>t.cat==="week"&&!statuses[t.id]).length;
  const totalOpen = tasks.filter(t=>!statuses[t.id]).length;
  const pct = tasks.length ? Math.round((done/tasks.length)*100) : 0;
  const unread = chatMessages.filter(m=>!m.read).length;

  const chatContext = {
    deceased: formData.deceased_name,
    deathDate: formData.death_date,
    deathPlace: formData.death_place_plz,
    completedCount: done,
    totalCount: tasks.length,
    pendingTasks: tasks.filter(t=>!statuses[t.id]).slice(0,12).map(t=>({title:t.title,category:t.cat,description:(t.desc||"").slice(0,140)}))
  };

  const topNav = <TopNav firstName={firstName} currentTab={navTab} unread={unread} onNav={handleNav} onLogout={handleLogout}/>;

  const narrowShell = (children, maxWidth=820) => (
    <div style={{minHeight:"100vh",background:c.bg,fontFamily:"Georgia,'Times New Roman',serif"}}>
      {bgGradient}
      {topNav}
      <div style={{position:"relative",zIndex:1,maxWidth,margin:"0 auto",padding:"84px 28px 48px"}}>{children}</div>
    </div>
  );
  const wideShell = (children, maxWidth=1280) => (
    <div style={{minHeight:"100vh",background:c.bg,fontFamily:"Georgia,'Times New Roman',serif"}}>
      {bgGradient}
      {topNav}
      <div style={{position:"relative",zIndex:1,maxWidth,margin:"0 auto",padding:"84px 28px 48px"}}>{children}</div>
    </div>
  );

  // PROFILE
  if (navTab==="profile") return wideShell(<ProfileView formData={formData} setFormData={setFormData} prov={prov} user={user}/>, 1100);
  // MESSAGES
  if (navTab==="messages") return wideShell(<MessagesView messages={chatMessages} setMessages={setChatMessages}/>, 1100);
  // DOCUMENTS
  if (navTab==="documents") return wideShell(<DocumentsView documents={documents} setDocuments={setDocuments} userId={user?.id}/>, 1100);

  // FUNERAL
  if (dashView==="funeral") return narrowShell(
    <>
      <button style={backBtn} onClick={()=>setDashView("list")}>← Dashboard</button>
      <h2 style={{fontSize:26,fontWeight:400,color:c.dark,fontStyle:"italic",margin:"0 0 4px"}}>Bestattungsinstitute</h2>
      <p style={{fontSize:13,color:c.muted,marginBottom:20}}>Suche nach Instituten in Ihrer Nähe.</p>
      <div style={{...cardStyle,marginBottom:16}}>
        <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:"0 0 10px"}}>Suche nach PLZ oder Ort</p>
        <div style={{display:"flex",gap:8}}>
          <input style={{...inputStyle(!!funeralPlz),flex:1}} placeholder="PLZ oder Ort …" value={funeralPlz} onChange={e=>setFuneralPlz(e.target.value)} onKeyDown={e=>e.key==="Enter"&&searchFuneral()}/>
          <button style={{...primaryBtn,width:"auto",padding:"11px 22px",flexShrink:0}} onClick={searchFuneral}>{funeralLoading?"…":"Suchen"}</button>
        </div>
      </div>
      {sortedFuneral.length>0 && (
        <div style={{display:"flex",gap:6,marginBottom:14,alignItems:"center"}}>
          <span style={{fontSize:11,color:c.muted}}>Sortieren:</span>
          {[{id:"rating",l:"Bewertung"},{id:"reviews",l:"Beliebtheit"}].map(s=>(
            <button key={s.id} onClick={()=>setFuneralSort(s.id)} style={{padding:"5px 12px",borderRadius:99,border:`1.5px solid ${funeralSort===s.id?c.dark:"rgba(0,0,0,0.1)"}`,background:funeralSort===s.id?c.dark:"transparent",color:funeralSort===s.id?"#F4EFE8":c.mid,fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif"}}>{s.l}</button>
          ))}
        </div>
      )}
      {funeralLoading && <div style={{textAlign:"center",padding:40,color:c.muted,fontSize:14}}>Suche läuft …</div>}
      {!funeralLoading && funeralResults.length===0 && funeralPlz && <div style={{textAlign:"center",padding:32,color:c.muted,fontSize:13}}>Keine Ergebnisse. Bitte PLZ prüfen.</div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {sortedFuneral.map(f=>(
          <div key={f.id} style={{...cardStyle}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{flex:1,paddingRight:8}}>
                <p style={{fontSize:14,fontWeight:700,color:c.dark,fontFamily:"Georgia,serif",margin:"0 0 3px"}}>{f.name}</p>
                <p style={{fontSize:11,color:c.muted,margin:0,lineHeight:1.4}}>{f.addr}</p>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                {f.rating && <p style={{fontSize:13,color:c.amber,fontWeight:700,margin:0}}>★ {f.rating.toFixed(1)}</p>}
                {f.reviews>0 && <p style={{fontSize:11,color:c.muted,margin:0}}>{f.reviews} Bew.</p>}
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <a href={f.mapsUrl} target="_blank" rel="noopener noreferrer" style={{...ghostBtn,textDecoration:"none",flex:1,textAlign:"center",padding:"9px",display:"inline-block"}}>🗺 Maps</a>
              <button style={{...primaryBtn,flex:2,padding:"9px",width:"auto"}} onClick={async ()=>{
                setStatuses(s=>({...s,bestattung:{mode:"manual",date:fmtDate(),letter:"",note:`${f.name} kontaktiert`}}));
                setDashView("list");
                if (user && estateId) await upsertStatus(user.id, estateId, "bestattung", {mode:"manual",status_date:new Date().toISOString().slice(0,10),letter:"",note:`${f.name} kontaktiert`});
              }}>Ausgewählt ✓</button>
            </div>
          </div>
        ))}
      </div>
    </>, 1100
  );

  // LETTER
  if (dashView==="letter") return narrowShell(
    <>
      <button style={backBtn} onClick={()=>setDashView("task")}>← Zurück</button>
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:16}}>
        <div style={cardStyle}>
          <span style={{fontSize:11,background:"rgba(74,124,111,0.08)",color:c.green,border:"1px solid rgba(74,124,111,0.2)",borderRadius:99,padding:"3px 10px",display:"inline-block",marginBottom:8}}>Briefentwurf</span>
          <h2 style={{fontSize:20,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic"}}>{active.title}</h2>
          <p style={{fontSize:11,color:c.muted,marginBottom:12}}>Text prüfen und ggf. anpassen:</p>
          <textarea style={textareaStyle} value={letter} onChange={e=>setLetter(e.target.value)}/>
          <p style={{fontSize:11,color:c.muted,margin:"14px 0 8px"}}>Versand wählen:</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <button style={sendDarkStyle} onClick={()=>doSend("digital")}>
              <span style={{fontSize:20}}>✉</span>
              <span style={{fontSize:13,color:"#F4EFE8",fontFamily:"Georgia,serif"}}>Digital senden</span>
              <span style={{fontSize:11,color:"rgba(244,239,232,0.5)"}}>Direkte Übermittlung{letterDocIds.length>0?` · ${letterDocIds.length} Anhang`:""}</span>
            </button>
            <button style={sendLightStyle} onClick={()=>doSend("print")}>
              <span style={{fontSize:20}}>🖨</span>
              <span style={{fontSize:13,color:c.dark,fontFamily:"Georgia,serif"}}>Ausdrucken</span>
              <span style={{fontSize:11,color:c.muted}}>Per Briefpost</span>
            </button>
          </div>
        </div>
        {/* Attachments sidebar */}
        <div style={{...cardStyle,padding:16,alignSelf:"start"}}>
          <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,margin:"0 0 4px"}}>📎 Anhänge</p>
          <p style={{fontSize:12,color:c.muted,margin:"0 0 12px"}}>Wählen Sie Dokumente aus dem Tresor:</p>
          {documents.length===0 ? (
            <p style={{fontSize:12,color:c.faint,margin:0}}>Keine Dokumente. <button onClick={()=>handleNav("documents")} style={{background:"none",border:"none",color:c.green,cursor:"pointer",padding:0,fontSize:12,fontFamily:"Georgia,serif",textDecoration:"underline"}}>→ Hochladen</button></p>
          ) : documents.map(d=>{
            const checked = letterDocIds.includes(d.id);
            return (
              <label key={d.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",cursor:"pointer",borderBottom:"1px solid rgba(0,0,0,0.05)"}}>
                <input type="checkbox" checked={checked} onChange={()=>setLetterDocIds(ids=>checked?ids.filter(x=>x!==d.id):[...ids,d.id])} style={{accentColor:c.green}}/>
                <span style={{flex:1,fontSize:12,color:c.dark,fontFamily:"Georgia,serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{d.name}</span>
              </label>
            );
          })}
          {letterDocIds.length>0 && (
            <p style={{fontSize:11,color:c.green,margin:"10px 0 0",fontWeight:600}}>{letterDocIds.length} Anhang gewählt</p>
          )}
        </div>
      </div>
    </>, 1100
  );

  // SENT
  if (dashView==="sent") return narrowShell(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,paddingTop:40,textAlign:"center"}}>
      <div style={{fontSize:56}}>{sentMode==="digital"?"✉":"🖨"}</div>
      <h2 style={{fontSize:26,fontWeight:400,color:c.dark,fontStyle:"italic",margin:0}}>{sentMode==="digital"?"Versandt":"Bereit zum Drucken"}</h2>
      <p style={{fontSize:14,color:c.muted,maxWidth:340,lineHeight:1.6}}>{sentMode==="digital"?`Das Schreiben an ${active.inst} wurde übermittelt. Antwort wird im Nachrichten-Center erscheinen.`:"Bitte legen Sie eine Kopie der Sterbeurkunde bei."}</p>
      {sentMode==="print" && <button style={{...primaryBtn,maxWidth:280}} onClick={()=>window.print()}>🖨 Jetzt drucken</button>}
      <button style={ghostBtn} onClick={()=>{setDashView("list");setActive(null);}}>Zum Dashboard →</button>
    </div>, 600
  );

  // STATUS
  if (dashView==="status" && active) {
    const st=statuses[active.id];
    return narrowShell(
      <>
        <button style={backBtn} onClick={()=>setDashView("list")}>← Dashboard</button>
        <div style={cardStyle}>
          <span style={{fontSize:11,background:"rgba(74,124,111,0.08)",color:c.green,border:"1px solid rgba(74,124,111,0.2)",borderRadius:99,padding:"3px 10px",display:"inline-block",marginBottom:8}}>
            {st.mode==="digital"?"✉ Versandt":st.mode==="print"?"🖨 Gedruckt":"✓ Erledigt"} · {st.date}
          </span>
          <h2 style={{fontSize:20,fontWeight:400,color:c.dark,margin:"4px 0 2px",fontStyle:"italic"}}>{active.title}</h2>
          <p style={{fontSize:12,color:c.muted,margin:"0 0 14px"}}>{active.inst}</p>
          {st.note && <p style={{fontSize:13,color:c.green,marginBottom:12}}>📝 {st.note}</p>}
          {st.attachments?.length>0 && (
            <div style={{marginBottom:12,padding:"10px 12px",background:"rgba(74,124,111,0.05)",borderRadius:10,border:"1px solid rgba(74,124,111,0.15)"}}>
              <p style={{fontSize:11,color:c.muted,margin:"0 0 4px",letterSpacing:"0.05em"}}>📎 Mit Anhängen:</p>
              {st.attachments.map(id => { const d=documents.find(x=>x.id===id); return d?<p key={id} style={{fontSize:12,color:c.dark,margin:"2px 0"}}>• {d.name}</p>:null; })}
            </div>
          )}
          {st.letter && <><p style={{fontSize:11,color:c.muted,marginBottom:6}}>Versandtes Schreiben:</p><textarea style={{...textareaStyle,opacity:.65}} value={st.letter} readOnly/></>}
          <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
            {st.letter && <button style={ghostBtn} onClick={()=>{setLetter(st.letter);setDashView("letter");}}>Brief bearbeiten</button>}
            <button style={{...ghostBtn,color:c.red,borderColor:"rgba(192,57,43,0.3)"}} onClick={()=>resetStatus(active.id)}>Zurücksetzen</button>
          </div>
        </div>
        <FaqSection taskId={active.id}/>
      </>
    );
  }

  // TASK DETAIL
  if (dashView==="task" && active) {
    if (active.isFuneral) return narrowShell(
      <>
        <button style={backBtn} onClick={()=>setDashView("list")}>← Dashboard</button>
        <div style={cardStyle}>
          <span style={{fontSize:40}}>🕯️</span>
          <h2 style={{fontSize:22,fontWeight:400,color:c.dark,fontStyle:"italic",margin:"10px 0 6px"}}>Bestattungsinstitut beauftragen</h2>
          <p style={{fontSize:14,color:c.mid,lineHeight:1.7,marginBottom:16}}>Wir suchen geprüfte Institute in Ihrer Nähe anhand von Google Maps und OpenStreetMap Einträgen.</p>
          <button style={{...primaryBtn}} onClick={()=>setDashView("funeral")}>Institute in der Nähe suchen →</button>
        </div>
        <FaqSection taskId={active.id}/>
      </>
    );

    const cat=CATS.find(x=>x.id===active.cat)||CATS[0];
    return narrowShell(
      <>
        <button style={backBtn} onClick={()=>setDashView("list")}>← Dashboard</button>
        <div style={{...cardStyle,marginBottom:14}}>
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            {active.domain
              ? <ServiceLogo domain={active.domain} name={active.inst} size={48}/>
              : <span style={{fontSize:36,flexShrink:0}}>{active.icon}</span>}
            <div>
              <span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:cat.color,background:cat.bg,padding:"3px 8px",borderRadius:99,display:"inline-block",marginBottom:4}}>{cat.label}</span>
              <h2 style={{fontSize:22,fontWeight:400,color:c.dark,fontStyle:"italic",margin:"2px 0"}}>{active.title}</h2>
              <p style={{fontSize:12,color:c.muted,margin:0}}>📍 {active.inst}</p>
            </div>
          </div>
          <p style={{fontSize:14,color:c.mid,lineHeight:1.7,marginTop:14}}>{active.desc}</p>
        </div>

        {active.streamProv?.digitalSteps && (
          <div style={{...cardStyle,border:"1px solid rgba(74,124,111,0.2)",marginBottom:10}}>
            <p style={{fontSize:11,color:c.green,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,margin:"0 0 4px"}}>💻 Online kündigen (empfohlen)</p>
            <p style={{fontSize:13,color:c.muted,margin:"0 0 12px"}}>Schnellste Methode – direkt im Kundenkonto:</p>
            <ol style={{margin:"0 0 14px",paddingLeft:18,display:"flex",flexDirection:"column",gap:6}}>
              {active.streamProv.digitalSteps.map((step,i)=>(<li key={i} style={{fontSize:13,color:c.dark,lineHeight:1.6}}>{step}</li>))}
            </ol>
            <a href={active.streamProv.digitalUrl} target="_blank" rel="noopener noreferrer" style={{...primaryBtn,display:"block",textAlign:"center",textDecoration:"none"}}>Direkt zur Kündigung →</a>
          </div>
        )}

        {active.comm && (
          <div style={{...cardStyle,border:active.streamProv?.digitalSteps?"1px dashed rgba(0,0,0,0.1)":"1px solid rgba(74,124,111,0.2)"}}>
            <p style={{fontSize:11,color:active.streamProv?.digitalSteps?c.muted:c.green,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,margin:"0 0 4px"}}>{active.streamProv?.digitalSteps?"✉ Alternative: Schriftlich":"Schreiben vorbereiten"}</p>
            <p style={{fontSize:13,color:c.muted,marginBottom:14}}>{active.streamProv?.digitalSteps?"Falls kein Zugang zum Konto: formeller Brief per Post.":"Standardisierter DIN-5008-Brief – alle Daten bereits eingefügt."}</p>
            <button style={{...primaryBtn,background:active.streamProv?.digitalSteps?c.mid:c.dark}} onClick={()=>genLetter(active)}>Brief vorbereiten →</button>
          </div>
        )}
        {!active.comm && !active.streamProv && (
          <div style={cardStyle}>
            <p style={{fontSize:11,color:c.amber,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,margin:"0 0 4px"}}>Persönlich erforderlich</p>
            <p style={{fontSize:13,color:c.muted,marginBottom:14}}>Dieser Schritt muss persönlich erledigt werden.</p>
            <button style={{...primaryBtn,background:c.green}} onClick={()=>markDone(active.id)}>✓ Als erledigt markieren</button>
          </div>
        )}

        <FaqSection taskId={active.id}/>
      </>
    );
  }

  // ── DASHBOARD LIST ───────────────────────────────────────────────────────
  return wideShell(
    <div style={{display:"flex",gap:28,alignItems:"flex-start"}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{marginBottom:26}}>
          <h1 style={{fontSize:34,fontWeight:400,color:c.dark,fontStyle:"italic",margin:"0 0 6px",letterSpacing:"0.01em"}}>
            Hallo{firstName?`, ${firstName}`:""} <span style={{fontStyle:"normal"}}>👋</span>
          </h1>
          <p style={{fontSize:15,color:c.mid,margin:0,lineHeight:1.5}}>
            {totalOpen===0
              ? "Sie haben alle Aufgaben erledigt. 💙"
              : <>Heute gibt es <span style={{fontWeight:700,color:c.dark}}>{totalOpen} Aufgabe{totalOpen!==1?"n":""}</span> zu erledigen{urgentOpen>0 && <> · <span style={{color:c.red,fontWeight:700}}>{urgentOpen} sofort</span></>}.</>}
          </p>
        </div>

        <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
          {[{id:"all",label:"Alle"},...CATS].map(f=>(
            <button key={f.id} style={{padding:"7px 16px",borderRadius:99,border:`1.5px solid ${catFilter===f.id?c.dark:"rgba(0,0,0,0.1)"}`,background:catFilter===f.id?c.dark:"transparent",color:catFilter===f.id?"#F4EFE8":c.mid,fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif"}} onClick={()=>setCatFilter(f.id)}>{f.label}</button>
          ))}
        </div>

        {CATS.filter(cat=>catFilter==="all"||catFilter===cat.id).map(cat=>{
          const ct=vis.filter(t=>t.cat===cat.id);
          if (!ct.length) return null;
          return (
            <div key={cat.id} style={{marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:cat.color,display:"inline-block"}}/>
                <span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:cat.color}}>{cat.label}</span>
                <span style={{fontSize:11,color:c.faint}}>· {ct.filter(t=>!statuses[t.id]).length} offen</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:ct.length>1?"1fr 1fr":"1fr",gap:10}}>
                {ct.map(task=>{
                  const st=statuses[task.id];
                  const isDone=!!st;
                  return (
                    <button key={task.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 17px",background:isDone?"rgba(255,255,255,0.45)":"rgba(255,255,255,0.78)",backdropFilter:"blur(10px)",border:`1px solid ${isDone?"rgba(0,0,0,0.05)":c.border}`,borderRadius:14,cursor:"pointer",width:"100%",boxShadow:isDone?"none":"0 2px 12px rgba(0,0,0,0.04)",opacity:isDone?0.6:1,transition:"opacity .2s, transform .15s",textAlign:"left"}}
                      onMouseEnter={e=>!isDone&&(e.currentTarget.style.transform="translateY(-1px)")}
                      onMouseLeave={e=>(e.currentTarget.style.transform="translateY(0)")}
                      onClick={()=>{setActive(task);setDashView(isDone?"status":"task");}}>
                      {task.domain
                        ? <ServiceLogo domain={task.domain} name={task.inst} size={40} fallbackEmoji={task.icon}/>
                        : <div style={{width:40,height:40,borderRadius:"50%",background:isDone?"rgba(0,0,0,0.04)":cat.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:20}}>{task.icon}</span></div>}
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:14,color:isDone?c.faint:c.dark,margin:0,textDecoration:isDone?"line-through":"none",fontFamily:"Georgia,serif",fontWeight:isDone?400:600}}>{task.title}</p>
                        <p style={{fontSize:12,margin:"3px 0 0",color:isDone?(st.mode==="digital"?c.green:st.mode==="print"?c.amber:c.muted):c.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                          {isDone?(st.mode==="digital"?`✉ Versandt · ${st.date}`:st.mode==="print"?`🖨 Gedruckt · ${st.date}`:`✓ Erledigt · ${st.date}`):task.inst}
                        </p>
                      </div>
                      <span style={{color:isDone?c.faint:c.muted,fontSize:18}}>›</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{width:380,flexShrink:0,position:"sticky",top:80,maxHeight:"calc(100vh - 100px)",display:"flex",flexDirection:"column",gap:14}}>
        <div style={{...cardStyle,padding:18}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div>
              <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,margin:0}}>Fortschritt</p>
              <p style={{fontSize:13,color:c.dark,fontFamily:"Georgia,serif",margin:"3px 0 0"}}>{formData.deceased_name?`Nachlass · ${formData.deceased_name}`:"Ihre persönliche Übersicht"}</p>
            </div>
            <div style={{position:"relative",flexShrink:0}}>
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="4"/>
                <circle cx="28" cy="28" r="22" fill="none" stroke={pct===100?c.green:c.dark} strokeWidth="4" strokeDasharray={`${pct/100*138.2} 138.2`} strokeLinecap="round" transform="rotate(-90 28 28)" style={{transition:"stroke-dasharray .5s"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:13,fontWeight:700,color:c.dark,lineHeight:1}}>{pct}%</span>
              </div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {[{l:"Sofort",n:urgentOpen,col:c.red,bg:"rgba(192,57,43,0.07)"},{l:"Diese Woche",n:weekOpen,col:c.amber,bg:"rgba(217,119,6,0.07)"},{l:"Erledigt",n:done,col:c.green,bg:"rgba(74,124,111,0.07)"}].map(s=>(
              <div key={s.l} onClick={()=>s.l!=="Erledigt"&&setCatFilter(s.l==="Sofort"?"urgent":"week")} style={{background:s.bg,borderRadius:10,border:`1px solid ${s.col}22`,padding:"10px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:s.l!=="Erledigt"?"pointer":"default"}}>
                <span style={{fontSize:20,fontWeight:800,color:s.col,lineHeight:1}}>{s.n}</span>
                <span style={{fontSize:9,color:s.col,fontWeight:600,letterSpacing:"0.04em",textAlign:"center"}}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
        <ChatAgent context={chatContext}/>
      </div>
    </div>
  );
}
