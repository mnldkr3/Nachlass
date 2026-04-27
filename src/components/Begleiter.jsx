"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const c = {
  bg:"#F4EFE8", card:"rgba(255,255,255,0.78)", dark:"#2B3330",
  mid:"#556060", muted:"#8A9D95", faint:"#BBCBC4",
  green:"#4A7C6F", red:"#C0392B", amber:"#D97706",
  border:"rgba(255,255,255,0.92)",
  navBg:"rgba(244,239,232,0.97)",
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
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

// ─── PROVIDERS ────────────────────────────────────────────────────────────────
const mkAddr = (p) => p ? `${p.street}\n${p.plz} ${p.city}`.trim() : "";

const KV_LIST = [
  {id:"tk",    name:"Techniker Krankenkasse (TK)",        type:"GKV",street:"Bramfelder Str. 140",             plz:"22305",city:"Hamburg",    email:"tk@tk.de"},
  {id:"barmer",name:"BARMER",                             type:"GKV",street:"Axel-Springer-Str. 44",           plz:"10969",city:"Berlin",     email:"service@barmer.de"},
  {id:"dak",   name:"DAK-Gesundheit",                     type:"GKV",street:"Nagelsweg 27–31",                 plz:"20097",city:"Hamburg",    email:"service@dak.de"},
  {id:"aok_by",name:"AOK Bayern",                         type:"GKV",street:"Carl-Wery-Str. 28",              plz:"81739",city:"München",    email:"info@by.aok.de"},
  {id:"aok_bw",name:"AOK Baden-Württemberg",              type:"GKV",street:"Presselstr. 19",                  plz:"70191",city:"Stuttgart",  email:"info@bw.aok.de"},
  {id:"aok_no",name:"AOK Nordost",                        type:"GKV",street:"Wilhelmstr. 1",                   plz:"10963",city:"Berlin",     email:"info@nordost.aok.de"},
  {id:"aok_rh",name:"AOK Rheinland/Hamburg",              type:"GKV",street:"Kasernenstr. 61",                 plz:"40213",city:"Düsseldorf", email:"info@rh.aok.de"},
  {id:"aok_he",name:"AOK Hessen",                         type:"GKV",street:"Baseler Str. 2",                  plz:"60329",city:"Frankfurt",  email:"info@he.aok.de"},
  {id:"kkh",   name:"KKH Kaufmännische Krankenkasse",     type:"GKV",street:"Karl-Wiechert-Allee 61",          plz:"30625",city:"Hannover",   email:"service@kkh.de"},
  {id:"ikk",   name:"IKK classic",                        type:"GKV",street:"Tannenstr. 4b",                   plz:"01099",city:"Dresden",    email:"service@ikk-classic.de"},
  {id:"hkk",   name:"hkk Krankenkasse",                   type:"GKV",street:"Bürgermeister-Smidt-Str. 95",    plz:"28195",city:"Bremen",     email:"info@hkk.de"},
  {id:"knapp", name:"Knappschaft",                        type:"GKV",street:"Knappschaftsstr. 1",              plz:"44799",city:"Bochum",     email:"service@knappschaft.de"},
  {id:"bkk",   name:"BKK VBU",                            type:"GKV",street:"Brodschrangen 4",                 plz:"20457",city:"Hamburg",    email:"service@bkk-vbu.de"},
  {id:"dkv",   name:"DKV Deutsche Krankenversicherung",   type:"PKV",street:"Aachener Str. 300",               plz:"50933",city:"Köln",       email:"service@dkv.com"},
  {id:"axa",   name:"AXA Krankenversicherung",            type:"PKV",street:"Colonia-Allee 10–20",             plz:"51067",city:"Köln",       email:"service@axa.de"},
  {id:"debeka",name:"Debeka Krankenversicherung",          type:"PKV",street:"Ferdinand-Sauerbruch-Str. 18",   plz:"56073",city:"Koblenz",    email:"service@debeka.de"},
  {id:"signal",name:"Signal Iduna Krankenversicherung",   type:"PKV",street:"Joseph-Scherer-Str. 3",           plz:"44139",city:"Dortmund",   email:"info@signal-iduna.de"},
  {id:"halle", name:"Hallesche Krankenversicherung",       type:"PKV",street:"Reinsburgstr. 10",               plz:"70178",city:"Stuttgart",  email:"info@hallesche.de"},
  {id:"barm",  name:"Barmenia Krankenversicherung",        type:"PKV",street:"Kronprinzenallee 12–18",         plz:"42094",city:"Wuppertal",  email:"info@barmenia.de"},
  {id:"allianz",name:"Allianz Private Krankenversicherung",type:"PKV",street:"Reinsburgstr. 19",               plz:"70178",city:"Stuttgart",  email:"info@allianz.de"},
];

const INTERNET_LIST = [
  {id:"telekom", name:"Telekom / MagentaZuhause",    domain:"telekom.de",   street:"Postfach 2000",             plz:"53105",city:"Bonn",       email:"kuendigung@telekom.de"},
  {id:"voda",    name:"Vodafone DSL / Kabel",        domain:"vodafone.de",  street:"Postfach 4040",             plz:"40874",city:"Ratingen",   email:"kuendigung@vodafone.de"},
  {id:"o2",      name:"O2 / Telefónica",             domain:"o2online.de",  street:"Postfach 100 740",          plz:"90705",city:"Fürth",      email:"kuendigung@o2online.de"},
  {id:"1und1",   name:"1&1 Versatel",                domain:"1und1.de",     street:"Elgendorfer Str. 57",       plz:"56410",city:"Montabaur",  email:"kuendigung@1und1.de"},
  {id:"unity",   name:"Unitymedia / Vodafone Kabel", domain:"vodafone.de",  street:"Postfach 4040",             plz:"40874",city:"Ratingen",   email:"service@vodafone.de"},
  {id:"congstar",name:"Congstar",                    domain:"congstar.de",  street:"Bayenwerft 12–14",          plz:"50678",city:"Köln",       email:"service@congstar.de"},
  {id:"mnet",    name:"M-net",                       domain:"m-net.de",     street:"Emmy-Noether-Str. 2",       plz:"80992",city:"München",    email:"service@m-net.de"},
  {id:"ewe",     name:"EWE Tel",                     domain:"ewe.de",       street:"Donnerschweer Str. 22",     plz:"26123",city:"Oldenburg",  email:"service@ewe.de"},
  {id:"freenet", name:"Freenet DSL",                 domain:"freenet.de",   street:"Hollerstr. 126",            plz:"24782",city:"Büdelsdorf", email:"kuendigung@freenet.de"},
  {id:"pyur",    name:"PYUR (Tele Columbus)",        domain:"pyur.com",     street:"Kaiserin-Augusta-Allee 108",plz:"10553",city:"Berlin",     email:"service@pyur.com"},
];

const MOBILE_LIST = [
  {id:"tel_m",  name:"Telekom Mobilfunk",  domain:"telekom.de",  street:"Postfach 2000",       plz:"53105",city:"Bonn",      email:"kuendigung@telekom.de"},
  {id:"voda_m", name:"Vodafone Mobilfunk", domain:"vodafone.de", street:"Postfach 4040",       plz:"40874",city:"Ratingen",  email:"kuendigung@vodafone.de"},
  {id:"o2_m",   name:"O2 Mobilfunk",       domain:"o2online.de", street:"Postfach 100 740",    plz:"90705",city:"Fürth",     email:"kuendigung@o2online.de"},
  {id:"1u1_m",  name:"1&1 Mobilfunk",      domain:"1und1.de",    street:"Elgendorfer Str. 57", plz:"56410",city:"Montabaur", email:"kuendigung@1und1.de"},
  {id:"cong_m", name:"Congstar Mobilfunk", domain:"congstar.de", street:"Bayenwerft 12–14",    plz:"50678",city:"Köln",      email:"service@congstar.de"},
  {id:"klarm",  name:"klarmobil",          domain:"klarmobil.de",street:"Reichsstr. 11",       plz:"14052",city:"Berlin",    email:"kuendigung@klarmobil.de"},
];

const BANK_LIST = [
  {id:"sparkasse",name:"Sparkasse (regional)",       domain:"sparkasse.de",     street:"Bitte lokale Filiale aufsuchen",plz:"",     city:"",          email:"–"},
  {id:"voba",     name:"Volksbank / Raiffeisenbank", domain:"vr.de",            street:"Bitte lokale Filiale aufsuchen",plz:"",     city:"",          email:"–"},
  {id:"deba",     name:"Deutsche Bank",              domain:"deutsche-bank.de", street:"Taunusanlage 12",               plz:"60325",city:"Frankfurt",  email:"service@deutsche-bank.de"},
  {id:"commerz",  name:"Commerzbank",                domain:"commerzbank.de",   street:"Kaiserplatz",                   plz:"60261",city:"Frankfurt",  email:"info@commerzbank.de"},
  {id:"hvb",      name:"HypoVereinsbank",            domain:"hvb.de",           street:"Arabellastr. 12",              plz:"81925",city:"München",    email:"info@hvb.de"},
  {id:"dkb",      name:"DKB Deutsche Kreditbank",    domain:"dkb.de",           street:"Taubenstr. 7–9",                plz:"10117",city:"Berlin",     email:"banking@dkb.de"},
  {id:"ing",      name:"ING Deutschland",            domain:"ing.de",           street:"Theodor-Heuss-Allee 106",       plz:"60486",city:"Frankfurt",  email:"service@ing.de"},
  {id:"comdirect",name:"Comdirect",                  domain:"comdirect.de",     street:"Pascalkehre 15",                plz:"25451",city:"Quickborn",  email:"info@comdirect.de"},
  {id:"postbank", name:"Postbank",                   domain:"postbank.de",      street:"Friedrich-Ebert-Allee 114–126", plz:"53113",city:"Bonn",       email:"service@postbank.de"},
  {id:"n26",      name:"N26",                        domain:"n26.com",          street:"Klosterstr. 62",                plz:"10179",city:"Berlin",     email:"support@n26.com"},
  {id:"targo",    name:"TARGOBANK",                  domain:"targobank.de",     street:"Kasernenstr. 10",               plz:"40213",city:"Düsseldorf", email:"info@targobank.de"},
];

const STREAMING_LIST = [
  {id:"netflix", name:"Netflix",      domain:"netflix.com",     street:"c/o Netflix International B.V., Herengracht 597",plz:"1017 CE",city:"Amsterdam",   email:"info@netflix.com",
   digitalUrl:"https://www.netflix.com/cancelplan", digitalSteps:["Auf netflix.com einloggen","Oben rechts auf Profilbild → ‚Konto'","‚Mitgliedschaft kündigen' klicken","Kündigung bestätigen – sofort wirksam"]},
  {id:"amazon",  name:"Amazon Prime", domain:"amazon.de",       street:"Marcel-Breuer-Str. 12",    plz:"80807",city:"München",    email:"cs-reply@amazon.de",
   digitalUrl:"https://www.amazon.de/mc/pipelines/cancellation", digitalSteps:["Auf amazon.de einloggen","‚Konto & Listen' → ‚Prime-Mitgliedschaft'","‚Prime kündigen' wählen","Bestätigen – Ende des Abrechnungszeitraums"]},
  {id:"spotify", name:"Spotify",      domain:"spotify.com",     street:"Regeringsgatan 19",        plz:"111 53",city:"Stockholm",  email:"support@spotify.com",
   digitalUrl:"https://www.spotify.com/de/account/subscription/cancel", digitalSteps:["Auf spotify.com einloggen","‚Abonnement' → ‚Premium kündigen'","Kündigung bestätigen – läuft bis Periodenende"]},
  {id:"disney",  name:"Disney+",      domain:"disneyplus.com",  street:"3 Queen Caroline St",      plz:"W6 9PE",city:"London",     email:"support@disneyplus.com",
   digitalUrl:"https://www.disneyplus.com/de-de/account", digitalSteps:["Auf disneyplus.com einloggen","‚Konto' → ‚Abonnement'","‚Abonnement kündigen' klicken","Bestätigen – Ende des Abrechnungszeitraums"]},
  {id:"dazn",    name:"DAZN",         domain:"dazn.com",        street:"Postfach",                 plz:"60528",city:"Frankfurt",   email:"help@dazn.com",
   digitalUrl:"https://www.dazn.com/de-DE/account", digitalSteps:["Auf dazn.com einloggen","‚Mein Konto' → ‚Abonnement verwalten'","‚Kündigen' wählen und bestätigen"]},
  {id:"sky",     name:"Sky / WOW",    domain:"sky.de",          street:"Medienallee 26",           plz:"85774",city:"Unterföhring",email:"kuendigung@sky.de",
   digitalUrl:"https://www.sky.de/produkte/sky-kuendigen", digitalSteps:["Auf sky.de einloggen → ‚Mein Sky'","‚Vertrag & Kündigung' aufrufen","Online-Kündigungsformular ausfüllen","Alternativ: 0800 / 100 99 00 (kostenlos)"]},
  {id:"appletv", name:"Apple TV+",    domain:"apple.com",       street:"Hollyhill Industrial Est.",plz:"T23 YK84",city:"Cork",     email:"–",
   digitalUrl:"https://appleid.apple.com", digitalSteps:["Auf appleid.apple.com einloggen","‚Abonnements' öffnen","‚Apple TV+' auswählen → ‚Kündigen'","Alternativ: iPhone → Einstellungen → Apple-ID → Abonnements"]},
  {id:"magenta", name:"MagentaTV",    domain:"telekom.de",      street:"Postfach 2000",            plz:"53105",city:"Bonn",        email:"kuendigung@telekom.de",
   digitalUrl:"https://www.telekom.de/hilfe/meintelekom", digitalSteps:["Auf telekom.de → ‚Mein Telekom' einloggen","‚Verträge & Buchungen' öffnen","MagentaTV-Vertrag auswählen → ‚Kündigen'"]},
];

// Versicherungen – erweitert mit Kategorien
const INSURANCE_LIST = [
  {id:"allianz_l",  name:"Allianz Lebensversicherung",       cat:"Leben",    domain:"allianz.de",     street:"Reinsburgstr. 19",            plz:"70178",city:"Stuttgart",  email:"info@allianz.de"},
  {id:"zurich_l",   name:"Zurich Lebensversicherung",        cat:"Leben",    domain:"zurich.de",      street:"Poppelsdorfer Allee 25–33",   plz:"53115",city:"Bonn",       email:"info@zurich.de"},
  {id:"ergo_l",     name:"ERGO Lebensversicherung",          cat:"Leben",    domain:"ergo.de",        street:"Victoriaplatz 2",             plz:"40198",city:"Düsseldorf", email:"info@ergo.de"},
  {id:"rv_l",       name:"R+V Lebensversicherung",           cat:"Leben",    domain:"ruv.de",         street:"Raiffeisenplatz 1",           plz:"65189",city:"Wiesbaden",  email:"info@ruv.de"},
  {id:"generali_l", name:"Generali Lebensversicherung",      cat:"Leben",    domain:"generali.de",    street:"Adenauerring 7",              plz:"81737",city:"München",    email:"info@generali.de"},
  {id:"debeka_l",   name:"Debeka Lebensversicherung",        cat:"Leben",    domain:"debeka.de",      street:"Ferdinand-Sauerbruch-Str. 18",plz:"56073",city:"Koblenz",    email:"service@debeka.de"},
  {id:"wuertt_l",   name:"Württembergische Lebensversicherung",cat:"Leben",  domain:"wuerttembergische.de",street:"Gutenbergstr. 30",         plz:"70176",city:"Stuttgart",  email:"info@wuerttembergische.de"},
  {id:"swiss_l",    name:"Swiss Life",                       cat:"Leben",    domain:"swisslife.de",   street:"Dachauer Str. 169",           plz:"80635",city:"München",    email:"info@swisslife.de"},
  {id:"arag_u",     name:"ARAG Unfallversicherung",          cat:"Unfall",   domain:"arag.de",        street:"ARAG Platz 1",                plz:"40472",city:"Düsseldorf", email:"info@arag.de"},
  {id:"axa_u",      name:"AXA Unfallversicherung",           cat:"Unfall",   domain:"axa.de",         street:"Colonia-Allee 10–20",         plz:"51067",city:"Köln",       email:"service@axa.de"},
  {id:"generali_u", name:"Generali Unfallversicherung",      cat:"Unfall",   domain:"generali.de",    street:"Adenauerring 7",              plz:"81737",city:"München",    email:"info@generali.de"},
  {id:"huk_u",      name:"HUK-COBURG Unfallversicherung",    cat:"Unfall",   domain:"huk.de",         street:"Bahnhofsplatz",               plz:"96444",city:"Coburg",     email:"info@huk.de"},
  {id:"signal_u",   name:"Signal Iduna Unfallversicherung",  cat:"Unfall",   domain:"signal-iduna.de",street:"Joseph-Scherer-Str. 3",       plz:"44139",city:"Dortmund",   email:"info@signal-iduna.de"},
  {id:"allianz_bu", name:"Allianz BU",                       cat:"BU",       domain:"allianz.de",     street:"Reinsburgstr. 19",            plz:"70178",city:"Stuttgart",  email:"info@allianz.de"},
  {id:"zurich_bu",  name:"Zurich BU",                        cat:"BU",       domain:"zurich.de",      street:"Poppelsdorfer Allee 25–33",   plz:"53115",city:"Bonn",       email:"info@zurich.de"},
  {id:"lv1871",     name:"LV 1871",                          cat:"BU",       domain:"lv1871.de",      street:"Maximiliansplatz 5",          plz:"80333",city:"München",    email:"info@lv1871.de"},
  {id:"swiss_bu",   name:"Swiss Life BU",                    cat:"BU",       domain:"swisslife.de",   street:"Dachauer Str. 169",           plz:"80635",city:"München",    email:"info@swisslife.de"},
  {id:"hdi_bu",     name:"HDI Berufsunfähigkeit",            cat:"BU",       domain:"hdi.de",         street:"HDI-Platz 1",                 plz:"30659",city:"Hannover",   email:"info@hdi.de"},
  {id:"huk_kfz",    name:"HUK-COBURG KFZ",                   cat:"KFZ",      domain:"huk.de",         street:"Bahnhofsplatz",               plz:"96444",city:"Coburg",     email:"info@huk.de"},
  {id:"adac_kfz",   name:"ADAC Autoversicherung",            cat:"KFZ",      domain:"adac.de",        street:"Am Westpark 8",               plz:"81373",city:"München",    email:"info@adac.de"},
  {id:"allianz_kfz",name:"Allianz KFZ",                      cat:"KFZ",      domain:"allianz.de",     street:"Reinsburgstr. 19",            plz:"70178",city:"Stuttgart",  email:"info@allianz.de"},
  {id:"axa_kfz",    name:"AXA KFZ",                          cat:"KFZ",      domain:"axa.de",         street:"Colonia-Allee 10–20",         plz:"51067",city:"Köln",       email:"service@axa.de"},
  {id:"vhv_kfz",    name:"VHV Versicherungen",               cat:"KFZ",      domain:"vhv.de",         street:"VHV-Platz 1",                 plz:"30177",city:"Hannover",   email:"info@vhv.de"},
  {id:"allianz_h",  name:"Allianz (Hausrat/Haftpflicht)",    cat:"Hausrat",  domain:"allianz.de",     street:"Reinsburgstr. 19",            plz:"70178",city:"Stuttgart",  email:"info@allianz.de"},
  {id:"axa_h",      name:"AXA (Hausrat/Haftpflicht)",        cat:"Hausrat",  domain:"axa.de",         street:"Colonia-Allee 10–20",         plz:"51067",city:"Köln",       email:"service@axa.de"},
  {id:"ergo_h",     name:"ERGO (Hausrat/Haftpflicht)",       cat:"Hausrat",  domain:"ergo.de",        street:"Victoriaplatz 2",             plz:"40198",city:"Düsseldorf", email:"info@ergo.de"},
  {id:"gothaer",    name:"Gothaer",                          cat:"Hausrat",  domain:"gothaer.de",     street:"Gothaer Allee 1",             plz:"50969",city:"Köln",       email:"info@gothaer.de"},
  {id:"lvm",        name:"LVM Versicherungen",               cat:"Hausrat",  domain:"lvm.de",         street:"Kolde-Ring 21",               plz:"48126",city:"Münster",    email:"info@lvm.de"},
  {id:"hdi_h",      name:"HDI (Haftpflicht)",                cat:"Hausrat",  domain:"hdi.de",         street:"HDI-Platz 1",                 plz:"30659",city:"Hannover",   email:"info@hdi.de"},
  {id:"arag_r",     name:"ARAG Rechtsschutz",                cat:"Rechtsschutz",domain:"arag.de",     street:"ARAG Platz 1",                plz:"40472",city:"Düsseldorf", email:"info@arag.de"},
  {id:"roland",     name:"Roland Rechtsschutz",              cat:"Rechtsschutz",domain:"roland.de",   street:"Deutz-Kalker Str. 46",        plz:"51103",city:"Köln",       email:"info@roland.de"},
  {id:"allianz_r",  name:"Allianz Rechtsschutz",             cat:"Rechtsschutz",domain:"allianz.de",  street:"Reinsburgstr. 19",            plz:"70178",city:"Stuttgart",  email:"info@allianz.de"},
  {id:"debeka_p",   name:"Debeka Pflegeversicherung",        cat:"Pflege",   domain:"debeka.de",      street:"Ferdinand-Sauerbruch-Str. 18",plz:"56073",city:"Koblenz",   email:"service@debeka.de"},
  {id:"signal_p",   name:"Signal Iduna Pflegezusatz",        cat:"Pflege",   domain:"signal-iduna.de",street:"Joseph-Scherer-Str. 3",       plz:"44139",city:"Dortmund",  email:"info@signal-iduna.de"},
  {id:"barmenia_p", name:"Barmenia Pflegeversicherung",      cat:"Pflege",   domain:"barmenia.de",    street:"Kronprinzenallee 12–18",      plz:"42094",city:"Wuppertal", email:"info@barmenia.de"},
];

// ─── LETTER TEMPLATES ─────────────────────────────────────────────────────────
const fmtDate = () => new Date().toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"});

function buildLetter(taskId, d, provider) {
  const abs  = `${d.applicant_name||"[Ihr Name]"}\n${d.applicant_address||"[Ihre Anschrift]"}`;
  const dat  = fmtDate();
  const name = d.deceased_name||"[Name]";
  const geb  = d.deceased_dob||"[Geburtsdatum]";
  const tod  = d.death_date||"[Sterbedatum]";
  const rel  = d.applicant_relation||"[Verhältnis]";
  const sig  = `Mit freundlichen Grüßen\n\n${d.applicant_name||"[Ihr Name]"}\n(${rel} der verstorbenen Person)`;

  if (taskId==="sterbeurkunde") return `${abs}\n\nStandesamt ${d.death_place_plz||"[Ort]"}\n[Straße und Hausnummer]\n${d.death_place_plz||"[PLZ Ort]"}\n\n${dat}\n\nBetreff: Antrag auf Ausstellung einer Sterbeurkunde\n\nSehr geehrte Damen und Herren,\n\nich beantrage die Ausstellung einer Sterbeurkunde sowie drei (3) beglaubigte Abschriften für folgende verstorbene Person:\n\n  Name:             ${name}\n  Geburtsdatum:     ${geb}\n  Letzte Anschrift: ${d.deceased_address||"[Adresse]"}\n  Sterbedatum:      ${tod}\n  Sterbeort:        ${d.death_place_plz||"[Ort]"}\n\nIch bin ${rel} der verstorbenen Person und lege folgende Unterlagen bei:\n– Totenschein (Original)\n– Personalausweis (Kopie)\n– Geburtsurkunde der verstorbenen Person (Kopie)\n\nBitte teilen Sie mir die Gebühren und ggf. einen Termin mit.\n\n${sig}`;

  if (taskId==="unfallversicherung") {
    const empf = provider ? `${provider.name}\n${mkAddr(provider)}` : "[Unfallversicherung]\n[Anschrift]";
    return `${abs}\n\n${empf}\n\n${dat}\n\nBetreff: Todesfall durch Unfall – Versicherungsnummer ${d.unfall_nr||"[Nummer]"}\n\nSehr geehrte Damen und Herren,\n\nich teile Ihnen mit, dass Ihr Versicherungsnehmer\n\n  ${name}, geboren am ${geb},\n\nam ${tod} verstorben ist.\n\nDa der Todesfall durch einen Unfall eingetreten ist, melde ich diesen hiermit fristwahrend und bitte um:\n1. Bestätigung des Eingangs dieser Meldung,\n2. Zusendung der erforderlichen Formulare für die Abwicklung der Versicherungsleistung,\n3. Information über etwaige Fristen und beizufügende Unterlagen.\n\nEine beglaubigte Kopie der Sterbeurkunde sowie der Totenschein liegen bei.\n\n${sig}`;
  }

  if (taskId==="krankenversicherung") {
    const empf = provider ? `${provider.name}\n${mkAddr(provider)}` : "[Krankenkasse]\n[Anschrift]";
    const pkv  = d.kv_type === "PKV";
    return `${abs}\n\n${empf}\n\n${dat}\n\nBetreff: Todesfall – ${pkv?"Versicherungsnummer":"Mitgliedsnummer"} ${d.kv_nr||"[Nummer]"}\n\nSehr geehrte Damen und Herren,\n\nich teile Ihnen mit, dass ${pkv?"Ihr Versicherungsnehmer":"Ihr Mitglied"}\n\n  ${name}, geboren am ${geb},\n\nam ${tod} verstorben ist.\n\nIch bitte Sie:\n1. alle laufenden Zahlungseinzüge sofort einzustellen,\n2. ${pkv?"eine tagesgenaue Abrechnung vorzunehmen und Beiträge nach dem Todestag zu erstatten":"Beitragsanteile nach dem Todestag zu erstatten"},\n3. die ${pkv?"Versicherung":"Mitgliedschaft"} zum Todestag formal zu beenden.\n\nEine beglaubigte Kopie der Sterbeurkunde liegt bei.\n\n${sig}`;
  }

  if (taskId==="rentenversicherung") return `${abs}\n\nDeutsche Rentenversicherung Bund\nRuhrstr. 2\n10709 Berlin\n\n${dat}\n\nBetreff: Todesfall – Einstellung der Rentenzahlungen\n         RV-Nummer: ${d.rentenversicherung_nr||"[Nummer]"}\n\nSehr geehrte Damen und Herren,\n\nich teile Ihnen mit, dass\n\n  ${name}, geboren am ${geb},\n\nam ${tod} verstorben ist.\n\nIch bitte Sie, die Rentenzahlungen sofort einzustellen. Etwaig überzahlte Beträge werde ich zurücküberweisen.\n\nBitte informieren Sie mich, ob Hinterbliebenenrente beantragt werden kann.\n\nEine beglaubigte Kopie der Sterbeurkunde liegt bei.\n\n${sig}`;

  if (taskId==="vermieter") return `${abs}\n\n${d.vermieter_name||"[Vermieter]"}\n[Anschrift des Vermieters]\n\n${dat}\n\nBetreff: Sonderkündigung – ${d.rental_address||"[Mietadresse]"}\n\nSehr geehrte Damen und Herren,\n\nder Mieter ${name} ist am ${tod} verstorben.\n\nAls ${rel} kündige ich das Mietverhältnis gemäß § 564 BGB außerordentlich zum nächstmöglichen Termin.\n\nIch bitte um schriftliche Bestätigung und Mitteilung des Übergabetermins.\n\nEine beglaubigte Kopie der Sterbeurkunde liegt bei.\n\n${sig}`;

  if (taskId==="internet"||taskId==="mobile") {
    const empf = provider ? `${provider.name}\n${mkAddr(provider)}` : "[Anbieter]\n[Anschrift]";
    return `${abs}\n\n${empf}\n\n${dat}\n\nBetreff: Außerordentliche Kündigung – Kundennummer ${d.internet_kundennr||"[Kundennummer]"}\n\nSehr geehrte Damen und Herren,\n\nder Vertragsinhaber ${name}, geboren am ${geb}, ist am ${tod} verstorben.\n\nIch kündige den Vertrag gemäß § 314 BGB außerordentlich zum nächstmöglichen Termin und bitte um Einstellung aller Lastschriften sowie schriftliche Bestätigung.\n\nEine beglaubigte Kopie der Sterbeurkunde liegt bei.\n\n${sig}`;
  }

  if (taskId==="bank") {
    const empf = provider ? `${provider.name}\n${mkAddr(provider)}` : `${d.bank_name||"[Bank]"}\n[Anschrift]`;
    return `${abs}\n\n${empf}\n\n${dat}\n\nBetreff: Todesfall – Kontosperrung, IBAN ${d.bank_kontonr||"[IBAN]"}\n\nSehr geehrte Damen und Herren,\n\nich teile Ihnen mit, dass Ihr Kunde ${name}, geboren am ${geb}, am ${tod} verstorben ist.\n\nIch bitte Sie, alle Konten vorläufig zu sperren, Daueraufträge einzustellen und mir mitzuteilen, welche Unterlagen für die weitere Abwicklung erforderlich sind.\n\nEine beglaubigte Kopie der Sterbeurkunde liegt bei.\n\n${sig}`;
  }

  if (taskId.startsWith("streaming_")) {
    const empf = provider ? `${provider.name}\n${mkAddr(provider)}` : "[Anbieter]\n[Anschrift]";
    return `${abs}\n\n${empf}\n\n${dat}\n\nBetreff: Kündigung des Abonnements nach Todesfall\n\nSehr geehrte Damen und Herren,\n\nder Inhaber des Abonnements, ${name}, geboren am ${geb}, ist am ${tod} verstorben.\n\nIch bitte Sie, das Abonnement zum nächstmöglichen Termin zu kündigen und alle laufenden Zahlungen einzustellen. Für den Zeitraum nach dem Todestag eingezogene Beträge bitte ich zu erstatten.\n\nEine beglaubigte Kopie der Sterbeurkunde liegt bei.\n\n${sig}`;
  }

  if (taskId.startsWith("versicherung_")) {
    const empf = provider ? `${provider.name}\n${mkAddr(provider)}` : "[Versicherung]\n[Anschrift]";
    return `${abs}\n\n${empf}\n\n${dat}\n\nBetreff: Todesfall – Kündigung bestehender Verträge\n\nSehr geehrte Damen und Herren,\n\nich teile Ihnen mit, dass Ihr Versicherungsnehmer ${name}, geboren am ${geb}, am ${tod} verstorben ist.\n\nIch bitte Sie:\n1. alle Versicherungsverträge zum Todestag zu beenden,\n2. zu prüfen, ob Leistungsansprüche (z. B. Lebensversicherung) bestehen,\n3. Prämien nach dem Todestag zu erstatten.\n\nEine beglaubigte Kopie der Sterbeurkunde liegt bei.\n\n${sig}`;
  }

  return "Keine Briefvorlage für diese Aufgabe verfügbar.";
}

// ─── TASKS ────────────────────────────────────────────────────────────────────
const BASE_TASKS = [
  {id:"bestattung",        cat:"urgent",icon:"🕯️",title:"Bestattungsinstitut beauftragen",  inst:"Bestattung",                 desc:"Erster und wichtigster Schritt: Das Institut übernimmt die Überführung, koordiniert den Totenschein und unterstützt bei der Sterbeurkunde. Innerhalb weniger Stunden handeln.",comm:false,isFuneral:true},
  {id:"unfallversicherung",cat:"urgent",icon:"⚡",title:"Unfallversicherung melden",         inst:"Unfallversicherer",           desc:"⚠️ Frist: 48 Stunden! Bei Unfalltod muss die Versicherung sofort informiert werden – sonst droht Anspruchsverlust. Gilt auch für Berufsunfähigkeits­versicherung mit Unfalltod-Klausel.",comm:true,isUV:true},
  {id:"sterbeurkunde",     cat:"urgent",icon:"📄",title:"Sterbeurkunde beantragen",          inst:"Standesamt",                 desc:"Gesetzliche Pflicht – innerhalb von 3 Werktagen beim Standesamt des Sterbeorts. Ohne Sterbeurkunde sind alle weiteren Schritte nicht möglich. Mind. 5 Exemplare ausstellen lassen.",comm:true},
  {id:"testament_abgeben", cat:"urgent",icon:"⚖️",title:"Testament beim Nachlassgericht",   inst:"Nachlassgericht",            desc:"Jedes bekannte Testament muss unverzüglich beim Nachlassgericht abgegeben werden – auch wenn man selbst Erbe ist. Das Gericht eröffnet es und informiert alle Beteiligten.",comm:false},
  {id:"krankenversicherung",cat:"urgent",icon:"🏥",title:"Krankenversicherung kündigen",     inst:"Krankenkasse",               desc:"Einzüge sofort stoppen lassen, Mitgliedschaft zum Todestag beenden, Rückerstattung für Zeitraum nach Tod prüfen.",comm:true,isKV:true},
  {id:"rentenversicherung",cat:"urgent",icon:"💰",title:"Rentenversicherung informieren",    inst:"Deutsche Rentenversicherung",desc:"Überzahlte Rente muss zurücküberwiesen werden – je schneller die Meldung, desto weniger Überzahlung. Hinterbliebenenrente prüfen.",comm:true},
  {id:"bank",              cat:"week",  icon:"🏦",title:"Bank informieren",                  inst:"Hausbank",                   desc:"Konten vorläufig sperren lassen, Daueraufträge einstellen. Klären welche Dokumente (z. B. Erbschein) für die weitere Kontoabwicklung nötig sind.",comm:true},
];

function makeTasks(data, prov) {
  let tasks = BASE_TASKS.map(t => ({
    ...t,
    inst: t.isKV && prov.kv ? prov.kv.name
        : t.isUV && prov.insurance?.length ? prov.insurance.filter(i=>i.cat==="Unfall").map(i=>i.name).join(", ")||t.inst
        : t.inst,
  }));
  if (!prov.insurance?.some(i=>i.cat==="Unfall")) {
    tasks = tasks.map(t => t.id==="unfallversicherung" ? {...t, cat:"week", desc:t.desc+" (Nur relevant bei Unfalltod.)"} : t);
  }
  if (data.had_rental==="yes")
    tasks.splice(4,0,{id:"vermieter",cat:"urgent",icon:"🔑",title:"Vermieter kündigen",inst:data.vermieter_name||"Vermieter",desc:"Sonderkündigungsrecht § 564 BGB. Kündigung zum nächstmöglichen gesetzlichen Termin.",comm:true});
  if (prov.internet)
    tasks.push({id:"internet",cat:"week",icon:"🌐",title:"Internet kündigen",inst:prov.internet.name,desc:"Außerordentliche Kündigung nach § 314 BGB.",comm:true,domain:prov.internet.domain});
  if (prov.mobile)
    tasks.push({id:"mobile",cat:"week",icon:"📱",title:"Mobilfunk kündigen",inst:prov.mobile.name,desc:"Außerordentliche Kündigung nach § 314 BGB.",comm:true,domain:prov.mobile.domain});
  (prov.streaming||[]).forEach(p=>tasks.push({id:`streaming_${p.id}`,cat:"week",icon:"📺",title:`${p.name} kündigen`,inst:p.name,desc:"Abo kündigen und laufende Zahlungen stoppen.",comm:true,streamProv:p,domain:p.domain}));
  (prov.insurance||[]).forEach(p=>tasks.push({id:`versicherung_${p.id}`,cat:"week",icon:"🛡️",title:`${p.name} melden`,inst:p.name,desc:"Verträge zum Todestag beenden, Leistungsansprüche prüfen.",comm:true,insProv:p,domain:p.domain}));
  return tasks;
}

// ─── ONBOARDING STEPS ─────────────────────────────────────────────────────────
const OB = [
  {id:"_intro",   type:"intro"},
  {id:"deceased_name",     type:"text",   grp:"Zur verstorbenen Person", q:"Vollständiger Name der verstorbenen Person",ph:"Vor- und Nachname"},
  {id:"deceased_dob",      type:"date",   grp:"Zur verstorbenen Person", q:"Geburtsdatum",                               ph:"TT.MM.JJJJ"},
  {id:"deceased_address",  type:"text",   grp:"Zur verstorbenen Person", q:"Letzte Wohnadresse",                         ph:"Straße, PLZ Ort"},
  {id:"death_date",        type:"date",   grp:"Zur verstorbenen Person", q:"Sterbedatum",                                ph:"TT.MM.JJJJ"},
  {id:"death_location",    type:"single", grp:"Zur verstorbenen Person", q:"Wo ist die Person verstorben?",
    opts:[{v:"home",l:"Zuhause",i:"🏠"},{v:"hospital",l:"Krankenhaus",i:"🏥"},{v:"nursing",l:"Pflegeheim",i:"🏡"},{v:"abroad",l:"Im Ausland",i:"✈️"}]},
  {id:"death_place_plz",   type:"text",   grp:"Zur verstorbenen Person", q:"Sterbeort (PLZ und Ort)",                    ph:"z. B. 80331 München", hint:"Bestimmt das zuständige Standesamt."},
  {id:"applicant_name",    type:"text",   grp:"Zu Ihrer Person",         q:"Ihr vollständiger Name",                     ph:"Vor- und Nachname"},
  {id:"applicant_relation",type:"single", grp:"Zu Ihrer Person",         q:"Ihr Verhältnis zur verstorbenen Person",
    opts:[{v:"Ehepartner/in",l:"Ehepartner/in",i:"💑"},{v:"Kind",l:"Kind",i:"👨‍👩‍👧"},{v:"Elternteil",l:"Elternteil",i:"👴"},{v:"Geschwister",l:"Geschwister",i:"👫"},{v:"andere/r Verwandte/r",l:"Andere/r Verwandte/r",i:"🤝"}]},
  {id:"applicant_address", type:"text",   grp:"Zu Ihrer Person",         q:"Ihre Anschrift",                             ph:"Straße, PLZ Ort"},
  {id:"testament",         type:"single", grp:"Rechtliche Situation",    q:"Ist ein Testament bekannt?",
    opts:[{v:"yes_known",l:"Ja – bekannter Ort",i:"📄"},{v:"yes_unknown",l:"Ja – Ort unbekannt",i:"🔍"},{v:"no",l:"Kein Testament",i:"✗"},{v:"unsure",l:"Unsicher",i:"?"}]},
  {id:"kv_selection",      type:"kvdrop", grp:"Versicherungen",          q:"Bei welcher Krankenkasse war die Person versichert?",opt:true},
  {id:"kv_nr",             type:"text",   grp:"Versicherungen",          q:"Mitgliedsnummer / Versicherungsnummer",       ph:"Auf der Krankenkassenkarte",opt:true},
  {id:"rentenversicherung_nr",type:"text",grp:"Versicherungen",          q:"Rentenversicherungsnummer (falls bekannt)",   ph:"12-stellige Nummer",opt:true},
  {id:"versicherung_sel",  type:"multidrop",grp:"Versicherungen",        q:"Weitere Versicherungen (Leben, Unfall, KFZ …)",provList:INSURANCE_LIST,opt:true},
  {id:"had_rental",        type:"single", grp:"Wohnsituation",           q:"Hatte die Person eine Mietwohnung?",
    opts:[{v:"yes",l:"Ja",i:"🏠"},{v:"no",l:"Nein / Eigentum",i:"🏡"}]},
  {id:"vermieter_name",    type:"text",   grp:"Wohnsituation",           q:"Name des Vermieters / Hausverwaltung",        ph:"z. B. Muster Immobilien GmbH",cond:{f:"had_rental",v:"yes"}},
  {id:"rental_address",    type:"text",   grp:"Wohnsituation",           q:"Adresse der Mietwohnung",                     ph:"Straße, PLZ Ort",cond:{f:"had_rental",v:"yes"}},
  {id:"internet_sel",      type:"singledrop",grp:"Laufende Verträge",    q:"Internet- / DSL-Anbieter",                   provList:INTERNET_LIST,provKey:"internet",opt:true},
  {id:"mobile_sel",        type:"singledrop",grp:"Laufende Verträge",    q:"Mobilfunkanbieter",                           provList:MOBILE_LIST,  provKey:"mobile",  opt:true},
  {id:"streaming_sel",     type:"multidrop", grp:"Laufende Verträge",    q:"Streaming-Abonnements",                       provList:STREAMING_LIST,provKey:"streaming",opt:true},
  {id:"bank_sel",          type:"singledrop",grp:"Bank & Finanzen",      q:"Hausbank der verstorbenen Person",            provList:BANK_LIST,    provKey:"bank",    opt:true},
  {id:"bank_kontonr",      type:"text",   grp:"Bank & Finanzen",         q:"IBAN / Kontonummer (falls bekannt)",          ph:"DE…",opt:true},
  {id:"support_needs",     type:"multi",  grp:"Womit brauchen Sie Hilfe?",q:"Was belastet Sie aktuell am meisten?",       hint:"Mehrfachauswahl möglich.",
    opts:[{v:"burial",l:"Bestattung",i:"🕯️"},{v:"authorities",l:"Behörden & Ämter",i:"🏛️"},{v:"inheritance",l:"Erbschaft",i:"⚖️"},{v:"contracts",l:"Verträge",i:"📋"},{v:"digital",l:"Digitaler Nachlass",i:"💻"},{v:"emotional",l:"Emotionale Unterstützung",i:"💙"}]},
  {id:"_result", type:"result"},
];

// ─── SERVICE LOGO ────────────────────────────────────────────────────────────
function ServiceLogo({ domain, name, size = 32, fallbackEmoji }) {
  const [imgError, setImgError] = useState(false);
  const initials = (name||"").split(/[\s/&]+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const palette = [c.green, c.dark, "#7B6E8A", "#A57B5B", "#5B7BA5"];
  const colorIdx = (name||" ").charCodeAt(0) % palette.length;

  if (!domain || imgError) {
    if (fallbackEmoji) {
      return (
        <div style={{
          width: size, height: size, borderRadius:"50%",
          background:"rgba(255,255,255,0.85)",
          border:"1px solid rgba(0,0,0,0.06)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize: size * 0.55, flexShrink:0
        }}>
          {fallbackEmoji}
        </div>
      );
    }
    return (
      <div style={{
        width: size, height: size, borderRadius:"50%",
        background: palette[colorIdx],
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize: Math.max(10, size * 0.38), color:"#F4EFE8", fontWeight:700,
        fontFamily:"Georgia,serif", flexShrink:0
      }}>
        {initials || "·"}
      </div>
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius:"50%",
      background:"#fff", border:"1px solid rgba(0,0,0,0.06)",
      display:"flex", alignItems:"center", justifyContent:"center",
      flexShrink:0, overflow:"hidden",
      boxShadow:"0 1px 3px rgba(0,0,0,0.05)"
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
        alt={name||""}
        width={Math.round(size * 0.65)}
        height={Math.round(size * 0.65)}
        onError={() => setImgError(true)}
        style={{ objectFit:"contain" }}
      />
    </div>
  );
}

// ─── DATE INPUT ───────────────────────────────────────────────────────────────
function DateInput({ value, onChange, placeholder, style }) {
  const handleChange = (e) => {
    let raw = e.target.value.replace(/\D/g,"");
    if (raw.length > 8) raw = raw.slice(0,8);
    let formatted = raw;
    if (raw.length >= 3) formatted = raw.slice(0,2) + "." + raw.slice(2);
    if (raw.length >= 5) formatted = raw.slice(0,2) + "." + raw.slice(2,4) + "." + raw.slice(4);
    onChange(formatted);
  };
  return (
    <input
      type="text" inputMode="numeric" maxLength={10}
      value={value||""} onChange={handleChange}
      placeholder={placeholder||"TT.MM.JJJJ"}
      style={style}
    />
  );
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
      <input
        style={inputStyle(!!selected)}
        placeholder={placeholder||"Suchen …"}
        value={shown}
        onChange={e=>{setQ(e.target.value);setOpen(true);if(selected)onSelect(null);}}
        onFocus={()=>setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <div style={ddBoxStyle}>
          {groups
            ? groups.map(g=>{
                const gi=filtered.filter(i=>i[groupKey]===g);
                if(!gi.length) return null;
                return (
                  <div key={g}>
                    <p style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.08em",padding:"10px 13px 4px",margin:0,fontWeight:700}}>{groupLabels?.[g]||g}</p>
                    {gi.map(item=>(
                      <button key={item.id} style={ddOptStyle} onClick={()=>{onSelect(item);setQ("");setOpen(false);}}>
                        <span style={{fontSize:13,color:c.dark,fontFamily:"Georgia,serif"}}>{item.name}</span>
                        {item.street&&<span style={{fontSize:11,color:c.muted}}>{item.street}, {item.plz} {item.city}</span>}
                      </button>
                    ))}
                  </div>
                );
              })
            : filtered.map(item=>(
                <button key={item.id} style={ddOptStyle} onClick={()=>{onSelect(item);setQ("");setOpen(false);}}>
                  <span style={{fontSize:13,color:c.dark,fontFamily:"Georgia,serif"}}>{item.name}</span>
                  {item.street&&<span style={{fontSize:11,color:c.muted}}>{item.street}, {item.plz} {item.city}</span>}
                </button>
              ))
          }
        </div>
      )}
    </div>
  );
}

// ─── TOP NAV ─────────────────────────────────────────────────────────────────
function TopNav({ firstName, onDash, onProfile, currentTab }) {
  return (
    <div style={{
      position:"fixed", top:0, left:0, right:0, height:60, zIndex:50,
      background:c.navBg, backdropFilter:"blur(20px)",
      borderBottom:"1px solid rgba(0,0,0,0.07)",
      display:"flex", alignItems:"center"
    }}>
      <div style={{maxWidth:1200, margin:"0 auto", width:"100%", padding:"0 28px", display:"flex", alignItems:"center"}}>
        <button onClick={onDash} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,padding:0}}>
          <span style={{fontSize:24,lineHeight:1}}>🕊️</span>
          <span style={{fontSize:19,fontWeight:400,color:c.dark,fontStyle:"italic",fontFamily:"Georgia,serif",letterSpacing:"0.02em"}}>Begleiter</span>
        </button>
        <div style={{flex:1}}/>
        <button onClick={onProfile} style={{
          background: currentTab==="profile" ? c.dark : "rgba(255,255,255,0.65)",
          border: `1px solid ${currentTab==="profile" ? c.dark : "rgba(0,0,0,0.08)"}`,
          borderRadius:99, cursor:"pointer", padding:"5px 14px 5px 5px",
          display:"flex", alignItems:"center", gap:9
        }}>
          <div style={{
            width:30, height:30, borderRadius:"50%",
            background: currentTab==="profile" ? "rgba(244,239,232,0.18)" : c.dark,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, color:"#F4EFE8",
            fontWeight:700, fontFamily:"Georgia,serif"
          }}>
            {firstName ? firstName[0].toUpperCase() : "·"}
          </div>
          <span style={{
            fontSize:13, fontFamily:"Georgia,serif",
            color: currentTab==="profile" ? "#F4EFE8" : c.dark
          }}>
            {firstName || "Profil"}
          </span>
        </button>
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
    const userMsg = { role:"user", content:text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ messages:newMsgs, context }),
      });
      if (!res.ok || !res.body) throw new Error("API fail");

      setMessages(m => [...m, { role:"assistant", content:"" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream:true });
        setMessages(m => {
          const next = [...m];
          next[next.length-1] = { role:"assistant", content:acc };
          return next;
        });
      }
    } catch {
      setMessages(m => [...m, { role:"assistant", content:"Verbindung fehlgeschlagen. Bitte erneut versuchen." }]);
    }
    setLoading(false);
  };

  const suggestions = [
    "Was muss ich zuerst erledigen?",
    "Welche Fristen sind kritisch?",
    "Wie schlage ich eine Erbschaft aus?"
  ];

  return (
    <div style={{
      ...cardStyle, padding:0, display:"flex", flexDirection:"column",
      flex:1, minHeight:0, overflow:"hidden"
    }}>
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
            <p style={{fontSize:12,color:c.mid,lineHeight:1.6,margin:"4px 0 6px"}}>
              Stellen Sie Fragen zu Fristen, Schreiben oder den nächsten Schritten – ich beziehe Ihre offenen Aufgaben ein.
            </p>
            {suggestions.map(s => (
              <button key={s} onClick={()=>send(s)}
                style={{padding:"8px 11px",background:"rgba(74,124,111,0.06)",border:"1px solid rgba(74,124,111,0.18)",borderRadius:10,cursor:"pointer",fontSize:12,color:c.green,fontFamily:"Georgia,serif",textAlign:"left"}}>
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m,i)=>(
          <div key={i} style={{
            alignSelf: m.role==="user" ? "flex-end" : "flex-start",
            maxWidth:"90%",
            padding:"9px 12px",
            borderRadius: m.role==="user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
            background: m.role==="user" ? c.dark : "rgba(255,255,255,0.85)",
            border: m.role==="assistant" ? "1px solid rgba(0,0,0,0.06)" : "none"
          }}>
            <p style={{
              fontSize:13,lineHeight:1.6,margin:0,
              color: m.role==="user" ? "#F4EFE8" : c.dark,
              fontFamily:"Georgia,serif",
              whiteSpace:"pre-wrap"
            }}>
              {m.content || (loading && i===messages.length-1 ? "…" : "")}
            </p>
          </div>
        ))}
      </div>

      <div style={{padding:"10px 12px",borderTop:"1px solid rgba(0,0,0,0.06)",display:"flex",gap:8}}>
        <input
          style={{...inputStyle(!!input),flex:1,fontSize:13,padding:"9px 11px"}}
          placeholder="Frage stellen …"
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter" && !e.shiftKey && send()}
          disabled={loading}
        />
        <button onClick={()=>send()} disabled={loading||!input.trim()}
          style={{
            background: loading||!input.trim() ? "rgba(0,0,0,0.08)" : c.dark,
            color: loading||!input.trim() ? c.muted : "#F4EFE8",
            border:"none",borderRadius:10,padding:"0 14px",
            cursor: loading||!input.trim() ? "default" : "pointer",
            fontSize:16, fontWeight:700, minWidth:42
          }}>
          {loading ? "…" : "↑"}
        </button>
      </div>
    </div>
  );
}

// ─── PROFILE VIEW (DATENTRESOR) ───────────────────────────────────────────────
function ProfileView({ formData, setFormData, prov }) {
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
              ? <DateInput value={val} onChange={v=>set(fieldKey,v)} style={{...inputStyle(!!val),flex:1}} placeholder={ph} />
              : <input autoFocus style={{...inputStyle(!!val),flex:1}} value={val} placeholder={ph||"–"} onChange={e=>set(fieldKey,e.target.value)} onBlur={()=>setEditing(null)} onKeyDown={e=>e.key==="Enter"&&setEditing(null)} />
            }
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
        <div style={{width:54,height:54,borderRadius:"50%",background:c.dark,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:24}}>🗄</span>
        </div>
        <div>
          <h1 style={{fontSize:26,fontWeight:400,color:c.dark,fontStyle:"italic",margin:0}}>Datentresor</h1>
          <p style={{fontSize:12,color:c.muted,margin:"2px 0 0"}}>{Object.values(formData).filter(Boolean).length} Felder · automatisch in alle Schreiben eingefügt</p>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div>
          <Section title="Verstorbene Person" icon="🕊️">
            <Field label="Vollständiger Name"  fieldKey="deceased_name"    ph="Vor- und Nachname" />
            <Field label="Geburtsdatum"        fieldKey="deceased_dob"     ph="TT.MM.JJJJ" isDate />
            <Field label="Sterbedatum"         fieldKey="death_date"       ph="TT.MM.JJJJ" isDate />
            <Field label="Letzte Wohnadresse"  fieldKey="deceased_address" ph="Straße, PLZ Ort" />
            <Field label="Sterbeort (PLZ Ort)" fieldKey="death_place_plz"  ph="z. B. 80331 München" />
          </Section>

          <Section title="Versicherungen" icon="🛡️">
            <Field label="KV-Mitgliedsnummer"          fieldKey="kv_nr"                 ph="Nummer von Krankenkassenkarte" />
            <Field label="Rentenversicherungsnummer"   fieldKey="rentenversicherung_nr" ph="12-stellige RV-Nummer" />
            <div style={{padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,0.05)"}}>
              <span style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Krankenkasse</span>
              <p style={{fontSize:14,color:prov.kv?c.dark:c.faint,fontFamily:"Georgia,serif",margin:"4px 0 0"}}>{prov.kv?.name||"Nicht angegeben"}</p>
            </div>
            {prov.insurance?.length>0&&(
              <div style={{padding:"10px 0"}}>
                <span style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Weitere Versicherungen</span>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:6}}>
                  {prov.insurance.map(i=>(
                    <span key={i.id} style={{fontSize:12,background:"rgba(74,124,111,0.08)",color:c.green,border:"1px solid rgba(74,124,111,0.2)",borderRadius:99,padding:"3px 10px"}}>{i.name}</span>
                  ))}
                </div>
              </div>
            )}
          </Section>
        </div>

        <div>
          <Section title="Ihre Person" icon="👤">
            <Field label="Ihr Name"        fieldKey="applicant_name"    ph="Vor- und Nachname" />
            <Field label="Ihre Anschrift"  fieldKey="applicant_address" ph="Straße, PLZ Ort" />
            <div style={{padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,0.05)"}}>
              <span style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Verhältnis zur verstorbenen Person</span>
              <p style={{fontSize:14,color:formData.applicant_relation?c.dark:c.faint,fontFamily:"Georgia,serif",margin:"4px 0 0"}}>{formData.applicant_relation||"Nicht angegeben"}</p>
            </div>
          </Section>

          <Section title="Bank & Finanzen" icon="🏦">
            <Field label="IBAN / Kontonummer" fieldKey="bank_kontonr" ph="DE…" />
            <div style={{padding:"10px 0"}}>
              <span style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Bank</span>
              <p style={{fontSize:14,color:prov.bank?c.dark:c.faint,fontFamily:"Georgia,serif",margin:"4px 0 0"}}>{prov.bank?.name||"Nicht angegeben"}</p>
            </div>
          </Section>

          {formData.had_rental==="yes"&&(
            <Section title="Wohnsituation" icon="🏠">
              <Field label="Vermieter / Hausverwaltung" fieldKey="vermieter_name"  ph="Name" />
              <Field label="Adresse Mietwohnung"        fieldKey="rental_address"  ph="Straße, PLZ Ort" />
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page,      setPage]      = useState("ob");
  const [obStep,    setObStep]    = useState(0);
  const [formData,  setFormData]  = useState({});
  const [prov,      setProv]      = useState({kv:null,internet:null,mobile:null,bank:null,streaming:[],insurance:[]});
  const [tasks,     setTasks]     = useState([]);
  const [dashView,  setDashView]  = useState("list");
  const [active,    setActive]    = useState(null);
  const [letter,    setLetter]    = useState("");
  const [statuses,  setStatuses]  = useState({});
  const [sentMode,  setSentMode]  = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [navTab,    setNavTab]    = useState("dash");
  const [funeralPlz,     setFuneralPlz]     = useState("");
  const [funeralResults, setFuneralResults] = useState([]);
  const [funeralLoading, setFuneralLoading] = useState(false);
  const [funeralSort,    setFuneralSort]    = useState("rating");

  const setField = (k,v) => setFormData(prev=>({...prev,[k]:v}));

  const finishOb = (fd, pr) => {
    const merged = {...fd, kv_name:pr.kv?.name, kv_type:pr.kv?.type, bank_name:pr.bank?.name};
    setFormData(merged);
    setProv(pr);
    setTasks(makeTasks(merged, pr));
    setFuneralPlz(merged.death_place_plz?.split(" ")[0]||"");
    setPage("dash");
  };

  const obAdvance = (fd, pr) => {
    let next = obStep + 1;
    while (next < OB.length) {
      const s = OB[next];
      if (s.cond && fd[s.cond.f] !== s.cond.v) { next++; continue; }
      break;
    }
    if (next >= OB.length) { finishOb(fd, pr); return; }
    if (OB[next].type === "result") { finishOb(fd, pr); return; }
    setObStep(next);
  };

  const obBack = () => {
    let prev = obStep - 1;
    while (prev > 0) {
      const s = OB[prev];
      if (s.cond && formData[s.cond.f] !== s.cond.v) { prev--; continue; }
      break;
    }
    setObStep(Math.max(0, prev));
  };

  const genLetter = (task) => {
    let p = null;
    if (task.isKV)              p = prov.kv;
    else if (task.isUV)         p = prov.insurance?.find(i=>i.cat==="Unfall")||null;
    else if (task.id==="bank")  p = prov.bank;
    else if (task.id==="internet") p = prov.internet;
    else if (task.id==="mobile")   p = prov.mobile;
    else if (task.streamProv)   p = task.streamProv;
    else if (task.insProv)      p = task.insProv;
    setLetter(buildLetter(task.id, formData, p));
    setDashView("letter");
  };

  const doSend = (mode) => {
    setSentMode(mode);
    setStatuses(s=>({...s,[active.id]:{mode,date:fmtDate(),letter}}));
    setDashView("sent");
  };

  const markDone = (id) => {
    setStatuses(s=>({...s,[id]:{mode:"manual",date:fmtDate(),letter:""}}));
    setDashView("list");
    setActive(null);
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
    if (funeralSort==="rating")   return (b.rating||0)-(a.rating||0);
    if (funeralSort==="reviews")  return (b.reviews||0)-(a.reviews||0);
    return 0;
  });

  const CATS = [
    {id:"urgent",label:"Sofort",      color:c.red,   bg:"rgba(192,57,43,0.07)"},
    {id:"week",  label:"Diese Woche", color:c.amber, bg:"rgba(217,119,6,0.07)"},
    {id:"later", label:"Später",      color:c.green, bg:"rgba(74,124,111,0.07)"},
  ];

  const firstName = (formData.applicant_name||"").trim().split(/\s+/)[0] || "";
  const handleNavDash = () => { setNavTab("dash"); setDashView("list"); setActive(null); };
  const handleNavProfile = () => { setNavTab(t => t==="profile" ? "dash" : "profile"); setDashView("list"); };

  const bgGradient = (
    <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse at 15% 10%,#DDD5C8,transparent 55%),radial-gradient(ellipse at 85% 85%,#C8D5D0,transparent 55%)",zIndex:0,pointerEvents:"none"}}/>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // ONBOARDING (centered, no top nav)
  // ════════════════════════════════════════════════════════════════════════════
  if (page==="ob") {
    const cur  = OB[obStep];
    const prog = Math.round((obStep/(OB.length-1))*100);

    const canNext = () => {
      if (!cur) return false;
      if (cur.opt) return true;
      if (cur.type==="intro"||cur.type==="result") return true;
      if (cur.type==="single") return !!formData[cur.id];
      if (cur.type==="multi")  return (formData[cur.id]||[]).length>0;
      if (cur.type==="kvdrop") return !!prov.kv;
      if (cur.type==="singledrop"||cur.type==="multidrop") return true;
      return !!formData[cur.id];
    };

    return (
      <div style={{minHeight:"100vh",background:c.bg,fontFamily:"Georgia,'Times New Roman',serif"}}>
        {bgGradient}
        <div style={{position:"relative",zIndex:1,maxWidth:560,margin:"0 auto",padding:"40px 20px"}}>
          {obStep>0&&(
            <div style={{position:"fixed",top:0,left:0,right:0,height:3,background:"rgba(0,0,0,0.07)",zIndex:99}}>
              <div style={{height:"100%",width:`${prog}%`,background:c.green,transition:"width .3s"}}/>
            </div>
          )}
          <div style={{...cardStyle,padding:0}}>
            {cur.type==="intro"&&(
              <div style={{padding:"50px 36px 40px",display:"flex",flexDirection:"column",alignItems:"center",gap:14,textAlign:"center"}}>
                <div style={{fontSize:54}}>🕊️</div>
                <h1 style={{fontSize:32,fontWeight:400,color:c.dark,margin:0,fontStyle:"italic"}}>Begleiter</h1>
                <p style={{fontSize:11,color:c.muted,letterSpacing:"0.09em",textTransform:"uppercase",margin:0}}>Ihr ruhiger Lotse durch einen schweren Moment</p>
                <p style={{fontSize:14,color:c.mid,lineHeight:1.8,textAlign:"center",maxWidth:380,margin:0}}>Wir begleiten Sie durch alle notwendigen Schritte. Alle Schreiben an Behörden und Unternehmen werden automatisch vorbereitet.</p>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
                  {["🔒 DSGVO","🇩🇪 Deutschland","💙 Kostenlos"].map(t=>(
                    <span key={t} style={{fontSize:12,color:c.green,background:"rgba(74,124,111,0.07)",border:"1px solid rgba(74,124,111,0.18)",borderRadius:99,padding:"4px 12px"}}>{t}</span>
                  ))}
                </div>
                <button style={{...primaryBtn,marginTop:8,maxWidth:280}} onClick={()=>setObStep(1)}>Jetzt beginnen</button>
                <button style={{background:"none",border:"none",color:c.faint,fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif"}} onClick={()=>finishOb(formData,prov)}>Direkt zum Dashboard →</button>
              </div>
            )}

            {(cur.type==="text"||cur.type==="date")&&(
              <div style={{padding:"36px 32px 30px",display:"flex",flexDirection:"column",gap:10}}>
                <button style={backBtn} onClick={obBack}>← Zurück</button>
                <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
                <h2 style={{fontSize:20,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
                {cur.hint&&<p style={{fontSize:13,color:c.muted,margin:0}}>{cur.hint}</p>}
                {cur.opt&&<p style={{fontSize:11,color:c.faint,margin:0}}>Optional</p>}
                {cur.type==="date"
                  ? <DateInput value={formData[cur.id]||""} onChange={v=>setField(cur.id,v)} style={inputStyle(!!formData[cur.id])} placeholder={cur.ph} />
                  : <input autoFocus style={inputStyle(!!formData[cur.id])} placeholder={cur.ph} value={formData[cur.id]||""} onChange={e=>setField(cur.id,e.target.value)} onKeyDown={e=>e.key==="Enter"&&canNext()&&obAdvance(formData,prov)} />
                }
                <button style={{...primaryBtn,opacity:canNext()?1:0.4,marginTop:4}} onClick={()=>canNext()&&obAdvance(formData,prov)} disabled={!canNext()}>
                  {cur.opt&&!formData[cur.id]?"Überspringen →":"Weiter →"}
                </button>
              </div>
            )}

            {cur.type==="single"&&(
              <div style={{padding:"36px 32px 30px",display:"flex",flexDirection:"column",gap:10}}>
                <button style={backBtn} onClick={obBack}>← Zurück</button>
                <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
                <h2 style={{fontSize:20,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
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
                        {on&&<span style={{position:"absolute",top:8,right:10,fontSize:11,color:c.green,fontWeight:"bold"}}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {cur.type==="multi"&&(
              <div style={{padding:"36px 32px 30px",display:"flex",flexDirection:"column",gap:10}}>
                <button style={backBtn} onClick={obBack}>← Zurück</button>
                <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
                <h2 style={{fontSize:20,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
                {cur.hint&&<p style={{fontSize:13,color:c.muted,margin:0}}>{cur.hint}</p>}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                  {cur.opts.map(o=>{
                    const sel=(formData[cur.id]||[]).includes(o.v);
                    return (
                      <button key={o.v} style={optCardStyle(sel)} onClick={()=>{
                        const prev=formData[cur.id]||[];
                        setField(cur.id,sel?prev.filter(x=>x!==o.v):[...prev,o.v]);
                      }}>
                        <span style={{fontSize:20}}>{o.i}</span>
                        <span style={{fontSize:13,color:sel?c.dark:c.mid,fontFamily:"Georgia,serif"}}>{o.l}</span>
                        {sel&&<span style={{position:"absolute",top:8,right:10,fontSize:11,color:c.green,fontWeight:"bold"}}>✓</span>}
                      </button>
                    );
                  })}
                </div>
                <button style={{...primaryBtn,opacity:canNext()?1:0.4,marginTop:4}} onClick={()=>canNext()&&obAdvance(formData,prov)} disabled={!canNext()}>
                  Weiter ({(formData[cur.id]||[]).length} ausgewählt)
                </button>
              </div>
            )}

            {cur.type==="kvdrop"&&(
              <div style={{padding:"36px 32px 30px",display:"flex",flexDirection:"column",gap:10}}>
                <button style={backBtn} onClick={obBack}>← Zurück</button>
                <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
                <h2 style={{fontSize:20,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
                <p style={{fontSize:11,color:c.faint,margin:0}}>Optional</p>
                <SearchDD items={KV_LIST} selected={prov.kv} onSelect={kv=>setProv(p=>({...p,kv}))} placeholder="Krankenkasse suchen …" groupKey="type" groupLabels={{GKV:"Gesetzlich (GKV)",PKV:"Privat (PKV)"}} />
                {prov.kv&&(
                  <div style={infoStyle}>
                    <span style={{fontSize:11,color:c.muted}}>📍 {mkAddr(prov.kv)}</span>
                    <span style={{fontSize:11,color:prov.kv.type==="PKV"?c.red:c.green,fontWeight:600}}>{prov.kv.type==="PKV"?"Privat: tagesgenaue Abrechnung":"Gesetzlich: Einzug stoppen"}</span>
                  </div>
                )}
                <button style={{...primaryBtn,marginTop:4}} onClick={()=>obAdvance(formData,prov)}>{prov.kv?"Weiter →":"Überspringen →"}</button>
              </div>
            )}

            {cur.type==="singledrop"&&(
              <div style={{padding:"36px 32px 30px",display:"flex",flexDirection:"column",gap:10}}>
                <button style={backBtn} onClick={obBack}>← Zurück</button>
                <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
                <h2 style={{fontSize:20,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
                <p style={{fontSize:11,color:c.faint,margin:0}}>Optional</p>
                <SearchDD items={cur.provList} selected={prov[cur.provKey]||null} onSelect={item=>setProv(p=>({...p,[cur.provKey]:item}))} placeholder="Suchen …" />
                {prov[cur.provKey]&&(
                  <div style={infoStyle}>
                    <span style={{fontSize:11,color:c.muted}}>📍 {mkAddr(prov[cur.provKey])}</span>
                    {prov[cur.provKey].email&&prov[cur.provKey].email!=="–"&&<span style={{fontSize:11,color:c.green}}>✉ {prov[cur.provKey].email}</span>}
                  </div>
                )}
                <button style={{...primaryBtn,marginTop:4}} onClick={()=>obAdvance(formData,prov)}>{prov[cur.provKey]?"Weiter →":"Überspringen →"}</button>
              </div>
            )}

            {cur.type==="multidrop"&&(
              <div style={{padding:"36px 32px 30px",display:"flex",flexDirection:"column",gap:10}}>
                <button style={backBtn} onClick={obBack}>← Zurück</button>
                <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
                <h2 style={{fontSize:20,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
                <p style={{fontSize:11,color:c.faint,margin:0}}>Optional – Mehrfachauswahl</p>
                {cur.provList[0]?.cat
                  ? [...new Set(cur.provList.map(i=>i.cat))].map(cat=>(
                      <div key={cat}>
                        <p style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.08em",margin:"8px 0 4px",fontWeight:700}}>{cat}</p>
                        {cur.provList.filter(i=>i.cat===cat).map(item=>{
                          const key=cur.id==="streaming_sel"?"streaming":"insurance";
                          const sel=(prov[key]||[]).some(x=>x.id===item.id);
                          return (
                            <button key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",marginBottom:6,background:"rgba(255,255,255,0.55)",border:`1.5px solid ${sel?"rgba(74,124,111,0.4)":"rgba(0,0,0,0.08)"}`,borderRadius:10,cursor:"pointer",width:"100%"}}
                              onClick={()=>setProv(p=>({...p,[key]:sel?(p[key]||[]).filter(x=>x.id!==item.id):[...(p[key]||[]),item]}))}>
                              <ServiceLogo domain={item.domain} name={item.name} size={26} />
                              <span style={{fontSize:13,flex:1,textAlign:"left",color:sel?c.dark:c.mid,fontFamily:"Georgia,serif"}}>{item.name}</span>
                              {sel&&<span style={{color:c.green,fontWeight:700,fontSize:13}}>✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    ))
                  : cur.provList.map(item=>{
                      const key=cur.id==="streaming_sel"?"streaming":"insurance";
                      const sel=(prov[key]||[]).some(x=>x.id===item.id);
                      return (
                        <button key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",marginBottom:6,background:"rgba(255,255,255,0.55)",border:`1.5px solid ${sel?"rgba(74,124,111,0.4)":"rgba(0,0,0,0.08)"}`,borderRadius:10,cursor:"pointer"}}
                          onClick={()=>setProv(p=>({...p,[key]:sel?(p[key]||[]).filter(x=>x.id!==item.id):[...(p[key]||[]),item]}))}>
                          <ServiceLogo domain={item.domain} name={item.name} size={26} />
                          <span style={{fontSize:13,flex:1,textAlign:"left",color:sel?c.dark:c.mid,fontFamily:"Georgia,serif"}}>{item.name}</span>
                          {sel&&<span style={{color:c.green,fontWeight:700,fontSize:13}}>✓</span>}
                        </button>
                      );
                    })
                }
                <button style={{...primaryBtn,marginTop:4}} onClick={()=>obAdvance(formData,prov)}>
                  {(()=>{const key=cur.id==="streaming_sel"?"streaming":"insurance";const n=(prov[key]||[]).length;return n>0?`Weiter (${n} ausgewählt)`:"Überspringen →";})()}
                </button>
              </div>
            )}

            {cur.type==="result"&&(
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

  // ════════════════════════════════════════════════════════════════════════════
  // DASHBOARD AREA
  // ════════════════════════════════════════════════════════════════════════════
  const done = Object.keys(statuses).length;
  const vis  = catFilter==="all" ? tasks : tasks.filter(t=>t.cat===catFilter);
  const urgentOpen  = tasks.filter(t=>t.cat==="urgent"&&!statuses[t.id]).length;
  const weekOpen    = tasks.filter(t=>t.cat==="week"  &&!statuses[t.id]).length;
  const totalOpen   = tasks.filter(t=>!statuses[t.id]).length;
  const pct         = tasks.length ? Math.round((done/tasks.length)*100) : 0;

  const chatContext = {
    deceased: formData.deceased_name,
    deathDate: formData.death_date,
    deathPlace: formData.death_place_plz,
    completedCount: done,
    totalCount: tasks.length,
    pendingTasks: tasks.filter(t=>!statuses[t.id]).slice(0,12).map(t=>({
      title: t.title, category: t.cat, description: (t.desc||"").slice(0,140)
    }))
  };

  const topNav = (
    <TopNav
      firstName={firstName}
      onDash={handleNavDash}
      onProfile={handleNavProfile}
      currentTab={navTab}
    />
  );

  // Helper to wrap narrow views (task detail, letter, funeral) with TopNav + centered content
  const narrowShell = (children, maxWidth=760) => (
    <div style={{minHeight:"100vh",background:c.bg,fontFamily:"Georgia,'Times New Roman',serif"}}>
      {bgGradient}
      {topNav}
      <div style={{position:"relative",zIndex:1,maxWidth,margin:"0 auto",padding:"84px 28px 48px"}}>
        {children}
      </div>
    </div>
  );

  // PROFILE TAB
  if (navTab==="profile") return narrowShell(
    <ProfileView formData={formData} setFormData={setFormData} prov={prov} />,
    980
  );

  // FUNERAL VIEW
  if (dashView==="funeral") return narrowShell(
    <>
      <button style={backBtn} onClick={()=>setDashView("list")}>← Dashboard</button>
      <h2 style={{fontSize:26,fontWeight:400,color:c.dark,fontStyle:"italic",margin:"0 0 4px"}}>Bestattungsinstitute</h2>
      <p style={{fontSize:13,color:c.muted,marginBottom:20}}>Suche nach Instituten in Ihrer Nähe.</p>

      <div style={{...cardStyle,marginBottom:16}}>
        <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:"0 0 10px"}}>Suche nach PLZ oder Ort</p>
        <div style={{display:"flex",gap:8}}>
          <input
            style={{...inputStyle(!!funeralPlz),flex:1}}
            placeholder="PLZ oder Ort …"
            value={funeralPlz}
            onChange={e=>setFuneralPlz(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&searchFuneral()}
          />
          <button style={{...primaryBtn,width:"auto",padding:"11px 22px",flexShrink:0}} onClick={searchFuneral}>
            {funeralLoading?"…":"Suchen"}
          </button>
        </div>
      </div>

      {sortedFuneral.length>0&&(
        <div style={{display:"flex",gap:6,marginBottom:14,alignItems:"center"}}>
          <span style={{fontSize:11,color:c.muted}}>Sortieren:</span>
          {[{id:"rating",l:"Bewertung"},{ id:"reviews",l:"Beliebtheit"}].map(s=>(
            <button key={s.id} onClick={()=>setFuneralSort(s.id)}
              style={{padding:"5px 12px",borderRadius:99,border:`1.5px solid ${funeralSort===s.id?c.dark:"rgba(0,0,0,0.1)"}`,background:funeralSort===s.id?c.dark:"transparent",color:funeralSort===s.id?"#F4EFE8":c.mid,fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif"}}>
              {s.l}
            </button>
          ))}
        </div>
      )}

      {funeralLoading&&<div style={{textAlign:"center",padding:40,color:c.muted,fontSize:14}}>Suche läuft …</div>}
      {!funeralLoading&&funeralResults.length===0&&funeralPlz&&(
        <div style={{textAlign:"center",padding:32,color:c.muted,fontSize:13}}>Keine Ergebnisse. Bitte PLZ prüfen oder anderen Ort eingeben.</div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {sortedFuneral.map(f=>(
          <div key={f.id} style={{...cardStyle}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{flex:1,paddingRight:8}}>
                <p style={{fontSize:14,fontWeight:700,color:c.dark,fontFamily:"Georgia,serif",margin:"0 0 3px"}}>{f.name}</p>
                <p style={{fontSize:11,color:c.muted,margin:0,lineHeight:1.4}}>{f.addr}</p>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                {f.rating&&<p style={{fontSize:13,color:c.amber,fontWeight:700,margin:0}}>★ {f.rating.toFixed(1)}</p>}
                {f.reviews>0&&<p style={{fontSize:11,color:c.muted,margin:0}}>{f.reviews} Bew.</p>}
                {f.open===true&&<p style={{fontSize:10,color:c.green,margin:"2px 0 0"}}>● Geöffnet</p>}
                {f.open===false&&<p style={{fontSize:10,color:c.red,margin:"2px 0 0"}}>● Geschlossen</p>}
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <a href={f.mapsUrl} target="_blank" rel="noopener noreferrer"
                 style={{...ghostBtn,textDecoration:"none",flex:1,textAlign:"center",padding:"9px",display:"inline-block"}}>
                🗺 Maps
              </a>
              <button style={{...primaryBtn,flex:2,padding:"9px",width:"auto"}}
                onClick={()=>{setStatuses(s=>({...s,bestattung:{mode:"manual",date:fmtDate(),letter:"",note:`${f.name} kontaktiert`}}));setDashView("list");}}>
                Ausgewählt ✓
              </button>
            </div>
          </div>
        ))}
      </div>
    </>,
    1100
  );

  // LETTER VIEW
  if (dashView==="letter") return narrowShell(
    <>
      <button style={backBtn} onClick={()=>setDashView("task")}>← Zurück</button>
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
            <span style={{fontSize:11,color:"rgba(244,239,232,0.5)"}}>Direkte Übermittlung</span>
          </button>
          <button style={sendLightStyle} onClick={()=>doSend("print")}>
            <span style={{fontSize:20}}>🖨</span>
            <span style={{fontSize:13,color:c.dark,fontFamily:"Georgia,serif"}}>Ausdrucken</span>
            <span style={{fontSize:11,color:c.muted}}>Per Briefpost senden</span>
          </button>
        </div>
      </div>
    </>
  );

  // SENT VIEW
  if (dashView==="sent") return narrowShell(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,paddingTop:40,textAlign:"center"}}>
      <div style={{fontSize:56}}>{sentMode==="digital"?"✉":"🖨"}</div>
      <h2 style={{fontSize:26,fontWeight:400,color:c.dark,fontStyle:"italic",margin:0}}>{sentMode==="digital"?"Versandt":"Bereit zum Drucken"}</h2>
      <p style={{fontSize:14,color:c.muted,maxWidth:340,lineHeight:1.6}}>{sentMode==="digital"?`Das Schreiben an ${active.inst} wurde übermittelt.`:"Bitte legen Sie eine Kopie der Sterbeurkunde bei."}</p>
      {sentMode==="print"&&<button style={{...primaryBtn,maxWidth:280}} onClick={()=>window.print()}>🖨 Jetzt drucken</button>}
      <button style={ghostBtn} onClick={()=>{setDashView("list");setActive(null);}}>Zum Dashboard →</button>
    </div>,
    600
  );

  // STATUS VIEW
  if (dashView==="status"&&active) {
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
          {st.note&&<p style={{fontSize:13,color:c.green,marginBottom:12}}>📝 {st.note}</p>}
          {st.letter&&<><p style={{fontSize:11,color:c.muted,marginBottom:6}}>Versandtes Schreiben:</p><textarea style={{...textareaStyle,opacity:.65}} value={st.letter} readOnly/></>}
          <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
            {st.letter&&<button style={ghostBtn} onClick={()=>{setLetter(st.letter);setDashView("letter");}}>Brief bearbeiten</button>}
            <button style={{...ghostBtn,color:c.red,borderColor:"rgba(192,57,43,0.3)"}} onClick={()=>{const n={...statuses};delete n[active.id];setStatuses(n);setDashView("list");}}>Zurücksetzen</button>
          </div>
        </div>
      </>
    );
  }

  // TASK DETAIL
  if (dashView==="task"&&active) {
    if (active.isFuneral) return narrowShell(
      <>
        <button style={backBtn} onClick={()=>setDashView("list")}>← Dashboard</button>
        <div style={cardStyle}>
          <span style={{fontSize:40}}>🕯️</span>
          <h2 style={{fontSize:22,fontWeight:400,color:c.dark,fontStyle:"italic",margin:"10px 0 6px"}}>Bestattungsinstitut beauftragen</h2>
          <p style={{fontSize:14,color:c.mid,lineHeight:1.7,marginBottom:16}}>Wir suchen geprüfte Institute in Ihrer Nähe anhand von Google Maps und OpenStreetMap Einträgen.</p>
          <button style={{...primaryBtn}} onClick={()=>setDashView("funeral")}>Institute in der Nähe suchen →</button>
        </div>
      </>
    );

    const cat=CATS.find(x=>x.id===active.cat)||CATS[0];
    return narrowShell(
      <>
        <button style={backBtn} onClick={()=>setDashView("list")}>← Dashboard</button>
        <div style={{...cardStyle,marginBottom:14}}>
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            {active.domain
              ? <ServiceLogo domain={active.domain} name={active.inst} size={48} />
              : <span style={{fontSize:36,flexShrink:0}}>{active.icon}</span>}
            <div>
              <span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:cat.color,background:cat.bg,padding:"3px 8px",borderRadius:99,display:"inline-block",marginBottom:4}}>{cat.label}</span>
              <h2 style={{fontSize:22,fontWeight:400,color:c.dark,fontStyle:"italic",margin:"2px 0"}}>{active.title}</h2>
              <p style={{fontSize:12,color:c.muted,margin:0}}>📍 {active.inst}</p>
            </div>
          </div>
          <p style={{fontSize:14,color:c.mid,lineHeight:1.7,marginTop:14}}>{active.desc}</p>
        </div>

        {active.streamProv?.digitalSteps&&(
          <div style={{...cardStyle,border:"1px solid rgba(74,124,111,0.2)",marginBottom:10}}>
            <p style={{fontSize:11,color:c.green,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,margin:"0 0 4px"}}>💻 Online kündigen (empfohlen)</p>
            <p style={{fontSize:13,color:c.muted,margin:"0 0 12px"}}>Schnellste Methode – direkt im Kundenkonto:</p>
            <ol style={{margin:"0 0 14px",paddingLeft:18,display:"flex",flexDirection:"column",gap:6}}>
              {active.streamProv.digitalSteps.map((step,i)=>(
                <li key={i} style={{fontSize:13,color:c.dark,lineHeight:1.6}}>{step}</li>
              ))}
            </ol>
            <a href={active.streamProv.digitalUrl} target="_blank" rel="noopener noreferrer"
               style={{...primaryBtn,display:"block",textAlign:"center",textDecoration:"none"}}>
              Direkt zur Kündigung →
            </a>
          </div>
        )}

        {active.comm&&(
          <div style={{...cardStyle,border:active.streamProv?.digitalSteps?"1px dashed rgba(0,0,0,0.1)":"1px solid rgba(74,124,111,0.2)"}}>
            <p style={{fontSize:11,color:active.streamProv?.digitalSteps?c.muted:c.green,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,margin:"0 0 4px"}}>
              {active.streamProv?.digitalSteps?"✉ Alternative: Schriftlich kündigen":"Schreiben vorbereiten"}
            </p>
            <p style={{fontSize:13,color:c.muted,marginBottom:14}}>
              {active.streamProv?.digitalSteps?"Falls kein Zugang zum Konto: formeller Brief per Post.":"Standardisierter DIN-5008-Brief – alle Daten bereits eingefügt."}
            </p>
            <button style={{...primaryBtn,background:active.streamProv?.digitalSteps?c.mid:c.dark}} onClick={()=>genLetter(active)}>Brief vorbereiten →</button>
          </div>
        )}
        {!active.comm&&!active.streamProv&&(
          <div style={cardStyle}>
            <p style={{fontSize:11,color:c.amber,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,margin:"0 0 4px"}}>Persönlich erforderlich</p>
            <p style={{fontSize:13,color:c.muted,marginBottom:14}}>Dieser Schritt muss persönlich erledigt werden.</p>
            <button style={{...primaryBtn,background:c.green}} onClick={()=>markDone(active.id)}>✓ Als erledigt markieren</button>
          </div>
        )}
      </>
    );
  }

  // ─── DASHBOARD LIST (DESKTOP 2-COLUMN) ────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:c.bg,fontFamily:"Georgia,'Times New Roman',serif"}}>
      {bgGradient}
      {topNav}
      <div style={{position:"relative",zIndex:1,maxWidth:1200,margin:"0 auto",padding:"84px 28px 48px"}}>
        <div style={{display:"flex",gap:28,alignItems:"flex-start"}}>

          {/* ── LEFT: TASKS ── */}
          <div style={{flex:1,minWidth:0}}>
            {/* Greeting */}
            <div style={{marginBottom:26}}>
              <h1 style={{fontSize:34,fontWeight:400,color:c.dark,fontStyle:"italic",margin:"0 0 6px",letterSpacing:"0.01em"}}>
                Hallo{firstName ? `, ${firstName}` : ""} <span style={{fontStyle:"normal"}}>👋</span>
              </h1>
              <p style={{fontSize:15,color:c.mid,margin:0,lineHeight:1.5}}>
                {totalOpen===0
                  ? "Sie haben alle Aufgaben erledigt. 💙"
                  : <>Heute gibt es <span style={{fontWeight:700,color:c.dark}}>{totalOpen} Aufgabe{totalOpen!==1?"n":""}</span> zu erledigen{urgentOpen>0 && <> · <span style={{color:c.red,fontWeight:700}}>{urgentOpen} sofort</span></>}.</>
                }
              </p>
            </div>

            {/* Filters */}
            <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
              {[{id:"all",label:"Alle"},...CATS].map(f=>(
                <button key={f.id}
                  style={{padding:"7px 16px",borderRadius:99,border:`1.5px solid ${catFilter===f.id?c.dark:"rgba(0,0,0,0.1)"}`,background:catFilter===f.id?c.dark:"transparent",color:catFilter===f.id?"#F4EFE8":c.mid,fontSize:13,cursor:"pointer",fontFamily:"Georgia,serif"}}
                  onClick={()=>setCatFilter(f.id)}>{f.label}
                </button>
              ))}
            </div>

            {/* Task groups */}
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
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {ct.map(task=>{
                      const st=statuses[task.id];
                      const isDone=!!st;
                      return (
                        <button key={task.id}
                          style={{display:"flex",alignItems:"center",gap:14,padding:"14px 17px",background:isDone?"rgba(255,255,255,0.45)":"rgba(255,255,255,0.78)",backdropFilter:"blur(10px)",border:`1px solid ${isDone?"rgba(0,0,0,0.05)":c.border}`,borderRadius:14,cursor:"pointer",width:"100%",boxShadow:isDone?"none":"0 2px 12px rgba(0,0,0,0.04)",opacity:isDone?0.6:1,transition:"opacity .2s, transform .15s",textAlign:"left"}}
                          onMouseEnter={e=>!isDone&&(e.currentTarget.style.transform="translateY(-1px)")}
                          onMouseLeave={e=>(e.currentTarget.style.transform="translateY(0)")}
                          onClick={()=>{setActive(task);setDashView(isDone?"status":"task");}}>
                          {task.domain
                            ? <ServiceLogo domain={task.domain} name={task.inst} size={40} fallbackEmoji={task.icon} />
                            : <div style={{width:40,height:40,borderRadius:"50%",background:isDone?"rgba(0,0,0,0.04)":cat.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                <span style={{fontSize:20}}>{task.icon}</span>
                              </div>}
                          <div style={{flex:1,minWidth:0}}>
                            <p style={{fontSize:14,color:isDone?c.faint:c.dark,margin:0,textDecoration:isDone?"line-through":"none",fontFamily:"Georgia,serif",fontWeight:isDone?400:600}}>{task.title}</p>
                            <p style={{fontSize:12,margin:"3px 0 0",color:isDone?(st.mode==="digital"?c.green:st.mode==="print"?c.amber:c.muted):c.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                              {isDone
                                ? (st.mode==="digital"?`✉ Versandt · ${st.date}`:st.mode==="print"?`🖨 Gedruckt · ${st.date}`:`✓ Erledigt · ${st.date}`)
                                : task.inst}
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

            {/* Vault badge */}
            <div onClick={handleNavProfile} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 17px",background:"rgba(255,255,255,0.45)",border:"1px dashed rgba(0,0,0,0.12)",borderRadius:12,marginTop:12,cursor:"pointer"}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(74,124,111,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:18}}>🗄</span>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:14,color:c.dark,margin:"0 0 2px",fontFamily:"Georgia,serif",fontWeight:600}}>Datentresor öffnen</p>
                <p style={{fontSize:12,color:c.muted,margin:0}}>{Object.values(formData).filter(Boolean).length} Felder gespeichert · editierbar</p>
              </div>
              <span style={{color:c.faint,fontSize:18}}>›</span>
            </div>
          </div>

          {/* ── RIGHT: SIDEBAR ── */}
          <div style={{
            width:380, flexShrink:0,
            position:"sticky", top:80,
            maxHeight:"calc(100vh - 100px)",
            display:"flex", flexDirection:"column", gap:14
          }}>
            {/* Stats card */}
            <div style={{...cardStyle,padding:18}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,margin:0}}>Fortschritt</p>
                  <p style={{fontSize:13,color:c.dark,fontFamily:"Georgia,serif",margin:"3px 0 0"}}>
                    {formData.deceased_name ? `Nachlass · ${formData.deceased_name}` : "Ihre persönliche Übersicht"}
                  </p>
                </div>
                <div style={{position:"relative",flexShrink:0}}>
                  <svg width="56" height="56" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="4"/>
                    <circle cx="28" cy="28" r="22" fill="none" stroke={pct===100?c.green:c.dark} strokeWidth="4"
                      strokeDasharray={`${pct/100*138.2} 138.2`} strokeLinecap="round"
                      transform="rotate(-90 28 28)" style={{transition:"stroke-dasharray .5s"}}/>
                  </svg>
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:13,fontWeight:700,color:c.dark,lineHeight:1}}>{pct}%</span>
                  </div>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                {[
                  {l:"Sofort",      n:urgentOpen, col:c.red,   bg:"rgba(192,57,43,0.07)"},
                  {l:"Diese Woche", n:weekOpen,   col:c.amber, bg:"rgba(217,119,6,0.07)"},
                  {l:"Erledigt",    n:done,       col:c.green, bg:"rgba(74,124,111,0.07)"},
                ].map(s=>(
                  <div key={s.l} onClick={()=>s.l!=="Erledigt"&&setCatFilter(s.l==="Sofort"?"urgent":"week")}
                    style={{background:s.bg,borderRadius:10,border:`1px solid ${s.col}22`,padding:"10px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:s.l!=="Erledigt"?"pointer":"default"}}>
                    <span style={{fontSize:20,fontWeight:800,color:s.col,lineHeight:1}}>{s.n}</span>
                    <span style={{fontSize:9,color:s.col,fontWeight:600,letterSpacing:"0.04em",textAlign:"center"}}>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat agent */}
            <ChatAgent context={chatContext} />
          </div>
        </div>
      </div>
    </div>
  );
}
