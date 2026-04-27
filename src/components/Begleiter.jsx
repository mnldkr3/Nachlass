"use client";

import { useState } from "react";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const c = {
  bg:"#F4EFE8", card:"rgba(255,255,255,0.78)", dark:"#2B3330",
  mid:"#556060", muted:"#8A9D95", faint:"#BBCBC4",
  green:"#4A7C6F", red:"#C0392B", amber:"#D97706",
  border:"rgba(255,255,255,0.92)",
};

// ─── STYLE OBJECTS (all lowercase to avoid React component confusion) ─────────
const cardStyle   = {background:c.card,backdropFilter:"blur(14px)",borderRadius:18,border:"1px solid "+c.border,boxShadow:"0 6px 32px rgba(0,0,0,0.06)",padding:20};
const primaryBtn  = {padding:"13px 20px",background:c.dark,color:"#F4EFE8",border:"none",borderRadius:12,fontSize:14,fontFamily:"Georgia,serif",cursor:"pointer",fontStyle:"italic",width:"100%"};
const ghostBtn    = {padding:"10px 16px",background:"transparent",color:c.green,border:`1.5px solid rgba(74,124,111,0.3)`,borderRadius:12,fontSize:13,fontFamily:"Georgia,serif",cursor:"pointer"};
const backBtn     = {background:"none",border:"none",color:c.muted,fontSize:13,cursor:"pointer",padding:"0 0 10px",fontFamily:"Georgia,serif",display:"block"};
const inputStyle  = (filled) => ({padding:"11px 13px",borderRadius:10,border:`1.5px solid ${filled?"rgba(74,124,111,0.4)":"rgba(0,0,0,0.1)"}`,background:filled?"rgba(74,124,111,0.04)":"rgba(255,255,255,0.6)",fontSize:14,fontFamily:"Georgia,serif",color:c.dark,outline:"none",width:"100%",boxSizing:"border-box"});
const optCardStyle= (on) => ({display:"flex",flexDirection:"column",alignItems:"flex-start",gap:5,padding:"13px 14px",background:"rgba(255,255,255,0.6)",border:`1.5px solid ${on?c.dark:"rgba(0,0,0,0.09)"}`,borderRadius:12,cursor:"pointer",textAlign:"left",position:"relative"});
const textareaStyle={width:"100%",minHeight:300,padding:13,border:"1.5px solid rgba(0,0,0,0.1)",borderRadius:12,fontFamily:"'Courier New',monospace",fontSize:12,color:c.dark,background:"rgba(244,239,232,0.7)",lineHeight:1.7,resize:"vertical",outline:"none",boxSizing:"border-box"};
const ddBoxStyle  = {position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"rgba(255,255,255,0.98)",backdropFilter:"blur(20px)",border:"1.5px solid rgba(0,0,0,0.1)",borderRadius:12,boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:100,maxHeight:260,overflowY:"auto"};
const ddOptStyle  = {display:"flex",flexDirection:"column",gap:2,padding:"9px 13px",background:"none",border:"none",cursor:"pointer",textAlign:"left",width:"100%",borderBottom:"1px solid rgba(0,0,0,0.04)"};
const infoStyle   = {background:"rgba(74,124,111,0.05)",border:"1px solid rgba(74,124,111,0.15)",borderRadius:10,padding:"10px 12px",display:"flex",flexDirection:"column",gap:4};
const sendDarkStyle={display:"flex",flexDirection:"column",gap:4,padding:16,background:c.dark,border:"none",borderRadius:12,cursor:"pointer",textAlign:"left"};
const sendLightStyle={display:"flex",flexDirection:"column",gap:4,padding:16,background:"transparent",border:"1.5px solid rgba(0,0,0,0.1)",borderRadius:12,cursor:"pointer",textAlign:"left"};

// ─── PROVIDERS ────────────────────────────────────────────────────────────────
const mkAddr = (p) => p ? `${p.street}\n${p.plz} ${p.city}`.trim() : "";

const KV_LIST = [
  {id:"tk",    name:"Techniker Krankenkasse (TK)",       type:"GKV",street:"Bramfelder Str. 140",           plz:"22305",city:"Hamburg",    email:"tk@tk.de"},
  {id:"barmer",name:"BARMER",                            type:"GKV",street:"Axel-Springer-Str. 44",          plz:"10969",city:"Berlin",     email:"service@barmer.de"},
  {id:"dak",   name:"DAK-Gesundheit",                    type:"GKV",street:"Nagelsweg 27–31",                plz:"20097",city:"Hamburg",    email:"service@dak.de"},
  {id:"aok_by",name:"AOK Bayern",                        type:"GKV",street:"Carl-Wery-Str. 28",             plz:"81739",city:"München",    email:"info@by.aok.de"},
  {id:"aok_bw",name:"AOK Baden-Württemberg",             type:"GKV",street:"Presselstr. 19",                 plz:"70191",city:"Stuttgart",  email:"info@bw.aok.de"},
  {id:"aok_no",name:"AOK Nordost",                       type:"GKV",street:"Wilhelmstr. 1",                  plz:"10963",city:"Berlin",     email:"info@nordost.aok.de"},
  {id:"aok_rh",name:"AOK Rheinland/Hamburg",             type:"GKV",street:"Kasernenstr. 61",                plz:"40213",city:"Düsseldorf", email:"info@rh.aok.de"},
  {id:"aok_he",name:"AOK Hessen",                        type:"GKV",street:"Baseler Str. 2",                 plz:"60329",city:"Frankfurt",  email:"info@he.aok.de"},
  {id:"kkh",   name:"KKH Kaufmännische Krankenkasse",    type:"GKV",street:"Karl-Wiechert-Allee 61",         plz:"30625",city:"Hannover",   email:"service@kkh.de"},
  {id:"ikk",   name:"IKK classic",                       type:"GKV",street:"Tannenstr. 4b",                  plz:"01099",city:"Dresden",    email:"service@ikk-classic.de"},
  {id:"hkk",   name:"hkk Krankenkasse",                  type:"GKV",street:"Bürgermeister-Smidt-Str. 95",   plz:"28195",city:"Bremen",     email:"info@hkk.de"},
  {id:"knapp", name:"Knappschaft",                       type:"GKV",street:"Knappschaftsstr. 1",             plz:"44799",city:"Bochum",     email:"service@knappschaft.de"},
  {id:"bkk",   name:"BKK VBU",                           type:"GKV",street:"Brodschrangen 4",                plz:"20457",city:"Hamburg",    email:"service@bkk-vbu.de"},
  {id:"dkv",   name:"DKV Deutsche Krankenversicherung",  type:"PKV",street:"Aachener Str. 300",              plz:"50933",city:"Köln",       email:"service@dkv.com"},
  {id:"axa",   name:"AXA Krankenversicherung",            type:"PKV",street:"Colonia-Allee 10–20",           plz:"51067",city:"Köln",       email:"service@axa.de"},
  {id:"debeka",name:"Debeka Krankenversicherung",         type:"PKV",street:"Ferdinand-Sauerbruch-Str. 18",  plz:"56073",city:"Koblenz",    email:"service@debeka.de"},
  {id:"signal",name:"Signal Iduna Krankenversicherung",  type:"PKV",street:"Joseph-Scherer-Str. 3",          plz:"44139",city:"Dortmund",   email:"info@signal-iduna.de"},
  {id:"halle", name:"Hallesche Krankenversicherung",      type:"PKV",street:"Reinsburgstr. 10",              plz:"70178",city:"Stuttgart",  email:"info@hallesche.de"},
  {id:"barm",  name:"Barmenia Krankenversicherung",       type:"PKV",street:"Kronprinzenallee 12–18",        plz:"42094",city:"Wuppertal",  email:"info@barmenia.de"},
  {id:"allianz",name:"Allianz Private Krankenversicherung",type:"PKV",street:"Reinsburgstr. 19",             plz:"70178",city:"Stuttgart",  email:"info@allianz.de"},
];

const INTERNET_LIST = [
  {id:"telekom", name:"Telekom / MagentaZuhause",    street:"Postfach 2000",           plz:"53105",city:"Bonn",       email:"kuendigung@telekom.de"},
  {id:"voda",    name:"Vodafone DSL / Kabel",        street:"Postfach 4040",           plz:"40874",city:"Ratingen",   email:"kuendigung@vodafone.de"},
  {id:"o2",      name:"O2 / Telefónica",             street:"Postfach 100 740",        plz:"90705",city:"Fürth",      email:"kuendigung@o2online.de"},
  {id:"1und1",   name:"1&1 Versatel",                street:"Elgendorfer Str. 57",     plz:"56410",city:"Montabaur",  email:"kuendigung@1und1.de"},
  {id:"unity",   name:"Unitymedia / Vodafone Kabel", street:"Postfach 4040",           plz:"40874",city:"Ratingen",   email:"service@vodafone.de"},
  {id:"congstar",name:"Congstar",                    street:"Bayenwerft 12–14",        plz:"50678",city:"Köln",       email:"service@congstar.de"},
  {id:"mnet",    name:"M-net",                       street:"Emmy-Noether-Str. 2",     plz:"80992",city:"München",    email:"service@m-net.de"},
  {id:"ewe",     name:"EWE Tel",                     street:"Donnerschweer Str. 22",   plz:"26123",city:"Oldenburg",  email:"service@ewe.de"},
  {id:"freenet", name:"Freenet DSL",                 street:"Hollerstr. 126",          plz:"24782",city:"Büdelsdorf", email:"kuendigung@freenet.de"},
  {id:"pyur",    name:"PYUR (Tele Columbus)",        street:"Kaiserin-Augusta-Allee 108",plz:"10553",city:"Berlin",   email:"service@pyur.com"},
];

const MOBILE_LIST = [
  {id:"tel_m",  name:"Telekom Mobilfunk",  street:"Postfach 2000",      plz:"53105",city:"Bonn",      email:"kuendigung@telekom.de"},
  {id:"voda_m", name:"Vodafone Mobilfunk", street:"Postfach 4040",      plz:"40874",city:"Ratingen",  email:"kuendigung@vodafone.de"},
  {id:"o2_m",   name:"O2 Mobilfunk",       street:"Postfach 100 740",   plz:"90705",city:"Fürth",     email:"kuendigung@o2online.de"},
  {id:"1u1_m",  name:"1&1 Mobilfunk",      street:"Elgendorfer Str. 57",plz:"56410",city:"Montabaur", email:"kuendigung@1und1.de"},
  {id:"cong_m", name:"Congstar Mobilfunk", street:"Bayenwerft 12–14",   plz:"50678",city:"Köln",      email:"service@congstar.de"},
  {id:"klarm",  name:"klarmobil",          street:"Reichsstr. 11",      plz:"14052",city:"Berlin",    email:"kuendigung@klarmobil.de"},
];

const BANK_LIST = [
  {id:"sparkasse",name:"Sparkasse (regional)",       street:"Bitte lokale Filiale aufsuchen",   plz:"",     city:"",          email:"–"},
  {id:"voba",     name:"Volksbank / Raiffeisenbank", street:"Bitte lokale Filiale aufsuchen",   plz:"",     city:"",          email:"–"},
  {id:"deba",     name:"Deutsche Bank",              street:"Taunusanlage 12",                  plz:"60325",city:"Frankfurt",  email:"service@deutsche-bank.de"},
  {id:"commerz",  name:"Commerzbank",                street:"Kaiserplatz",                      plz:"60261",city:"Frankfurt",  email:"info@commerzbank.de"},
  {id:"hvb",      name:"HypoVereinsbank",             street:"Arabellastr. 12",                 plz:"81925",city:"München",    email:"info@hvb.de"},
  {id:"dkb",      name:"DKB Deutsche Kreditbank",    street:"Taubenstr. 7–9",                   plz:"10117",city:"Berlin",     email:"banking@dkb.de"},
  {id:"ing",      name:"ING Deutschland",            street:"Theodor-Heuss-Allee 106",          plz:"60486",city:"Frankfurt",  email:"service@ing.de"},
  {id:"comdirect",name:"Comdirect",                  street:"Pascalkehre 15",                   plz:"25451",city:"Quickborn",  email:"info@comdirect.de"},
  {id:"postbank", name:"Postbank",                   street:"Friedrich-Ebert-Allee 114–126",    plz:"53113",city:"Bonn",       email:"service@postbank.de"},
  {id:"n26",      name:"N26",                        street:"Klosterstr. 62",                   plz:"10179",city:"Berlin",     email:"support@n26.com"},
  {id:"targo",    name:"TARGOBANK",                  street:"Kasernenstr. 10",                  plz:"40213",city:"Düsseldorf", email:"info@targobank.de"},
];

const STREAMING_LIST = [
  {id:"netflix", name:"Netflix",      street:"c/o Netflix International B.V., Herengracht 597",plz:"1017 CE",city:"Amsterdam",  email:"info@netflix.com",
   digitalUrl:"https://www.netflix.com/cancelplan", digitalSteps:["Auf netflix.com einloggen","Oben rechts auf Profilbild → ‚Konto'","‚Mitgliedschaft kündigen' klicken","Kündigung bestätigen – sofort wirksam"]},
  {id:"amazon",  name:"Amazon Prime", street:"Marcel-Breuer-Str. 12",   plz:"80807",city:"München",    email:"cs-reply@amazon.de",
   digitalUrl:"https://www.amazon.de/mc/pipelines/cancellation", digitalSteps:["Auf amazon.de einloggen","‚Konto & Listen' → ‚Prime-Mitgliedschaft'","‚Prime kündigen' wählen","Bestätigen – Ende des Abrechnungszeitraums"]},
  {id:"spotify", name:"Spotify",      street:"Regeringsgatan 19",       plz:"111 53",city:"Stockholm",  email:"support@spotify.com",
   digitalUrl:"https://www.spotify.com/de/account/subscription/cancel", digitalSteps:["Auf spotify.com einloggen","‚Abonnement' → ‚Premium kündigen'","Kündigung bestätigen – läuft bis Periodenende"]},
  {id:"disney",  name:"Disney+",      street:"3 Queen Caroline St",     plz:"W6 9PE",city:"London",     email:"support@disneyplus.com",
   digitalUrl:"https://www.disneyplus.com/de-de/account", digitalSteps:["Auf disneyplus.com einloggen","‚Konto' → ‚Abonnement'","‚Abonnement kündigen' klicken","Bestätigen – Ende des Abrechnungszeitraums"]},
  {id:"dazn",    name:"DAZN",         street:"Postfach",                plz:"60528",city:"Frankfurt",   email:"help@dazn.com",
   digitalUrl:"https://www.dazn.com/de-DE/account", digitalSteps:["Auf dazn.com einloggen","‚Mein Konto' → ‚Abonnement verwalten'","‚Kündigen' wählen und bestätigen"]},
  {id:"sky",     name:"Sky / WOW",    street:"Medienallee 26",          plz:"85774",city:"Unterföhring",email:"kuendigung@sky.de",
   digitalUrl:"https://www.sky.de/produkte/sky-kuendigen", digitalSteps:["Auf sky.de einloggen → ‚Mein Sky'","‚Vertrag & Kündigung' aufrufen","Online-Kündigungsformular ausfüllen","Alternativ: 0800 / 100 99 00 (kostenlos)"]},
  {id:"appletv", name:"Apple TV+",    street:"Hollyhill Industrial Est.",plz:"T23 YK84",city:"Cork, Irland",email:"–",
   digitalUrl:"https://appleid.apple.com", digitalSteps:["Auf appleid.apple.com einloggen","‚Abonnements' öffnen","‚Apple TV+' auswählen → ‚Kündigen'","Alternativ: iPhone → Einstellungen → Apple-ID → Abonnements"]},
  {id:"magenta", name:"MagentaTV",    street:"Postfach 2000",           plz:"53105",city:"Bonn",        email:"kuendigung@telekom.de",
   digitalUrl:"https://www.telekom.de/hilfe/meintelekom", digitalSteps:["Auf telekom.de → ‚Mein Telekom' einloggen","‚Verträge & Buchungen' öffnen","MagentaTV-Vertrag auswählen → ‚Kündigen'"]},
];

const INSURANCE_LIST = [
  {id:"allianz_v",name:"Allianz",       street:"Königinstr. 28",            plz:"80802",city:"München",    email:"info@allianz.de"},
  {id:"axa_v",    name:"AXA",           street:"Colonia-Allee 10–20",       plz:"51067",city:"Köln",       email:"service@axa.de"},
  {id:"ergo",     name:"ERGO",          street:"Victoriaplatz 2",           plz:"40198",city:"Düsseldorf", email:"info@ergo.de"},
  {id:"generali", name:"Generali",      street:"Adenauerring 7",            plz:"81737",city:"München",    email:"info@generali.de"},
  {id:"hdi",      name:"HDI",           street:"HDI-Platz 1",               plz:"30659",city:"Hannover",   email:"info@hdi.de"},
  {id:"zurich",   name:"Zurich",        street:"Poppelsdorfer Allee 25–33", plz:"53115",city:"Bonn",       email:"info@zurich.de"},
  {id:"signal_v", name:"Signal Iduna",  street:"Joseph-Scherer-Str. 3",     plz:"44139",city:"Dortmund",   email:"info@signal-iduna.de"},
  {id:"debeka_v", name:"Debeka",        street:"Ferdinand-Sauerbruch-Str. 18",plz:"56073",city:"Koblenz",  email:"service@debeka.de"},
];

const FUNERAL_LIST = [
  {id:"1",name:"Bestattungen Müller GmbH",    city:"München",  rating:4.8,reviews:127,specs:["Erdbestattung","Feuerbestattung","Seebestattung"],      phone:"089 123456",addr:"Leopoldstr. 42, 80802 München",     cert:true},
  {id:"2",name:"Pietät Hoffmann",             city:"München",  rating:4.6,reviews:89, specs:["Erdbestattung","Feuerbestattung","Waldbestattung"],      phone:"089 234567",addr:"Maximilianstr. 8, 80539 München",   cert:true},
  {id:"3",name:"Bestattungshaus Bauer & Söhne",city:"München", rating:4.9,reviews:203,specs:["Feuerbestattung","Internationale Überführung"],          phone:"089 345678",addr:"Rosenheimer Str. 55, 81669 München", cert:true},
  {id:"4",name:"Rüdinger Bestattungen",       city:"Berlin",   rating:4.7,reviews:156,specs:["Erdbestattung","Feuerbestattung","Seebestattung"],       phone:"030 123456",addr:"Kurfürstendamm 12, 10719 Berlin",   cert:true},
  {id:"5",name:"Trauerhaus Frankfurt",        city:"Frankfurt",rating:4.7,reviews:114,specs:["Erdbestattung","Feuerbestattung","Naturbestattung"],      phone:"069 112233",addr:"Zeil 48, 60313 Frankfurt",           cert:true},
  {id:"6",name:"Bestattungen Schulze",        city:"Hamburg",  rating:4.5,reviews:98, specs:["Feuerbestattung","Erdbestattung"],                       phone:"040 987654",addr:"Alsterchaussee 3, 20149 Hamburg",   cert:false},
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

  if (taskId === "sterbeurkunde") return `${abs}\n\nStandesamt ${d.death_place_plz||"[Ort]"}\n[Straße und Hausnummer]\n${d.death_place_plz||"[PLZ Ort]"}\n\n${dat}\n\nBetreff: Antrag auf Ausstellung einer Sterbeurkunde\n\nSehr geehrte Damen und Herren,\n\nich beantrage die Ausstellung einer Sterbeurkunde sowie drei (3) beglaubigte Abschriften für folgende verstorbene Person:\n\n  Name:             ${name}\n  Geburtsdatum:     ${geb}\n  Letzte Anschrift: ${d.deceased_address||"[Adresse]"}\n  Sterbedatum:      ${tod}\n  Sterbeort:        ${d.death_place_plz||"[Ort]"}\n\nIch bin ${rel} der verstorbenen Person und lege folgende Unterlagen bei:\n– Totenschein (Original)\n– Personalausweis (Kopie)\n– Geburtsurkunde der verstorbenen Person (Kopie)\n\nBitte teilen Sie mir die Gebühren und ggf. einen Termin mit.\n\n${sig}`;

  if (taskId === "krankenversicherung") {
    const empf = provider ? `${provider.name}\n${mkAddr(provider)}` : "[Krankenkasse]\n[Anschrift]";
    const pkv  = d.kv_type === "PKV";
    return `${abs}\n\n${empf}\n\n${dat}\n\nBetreff: Todesfall – ${pkv?"Versicherungsnummer":"Mitgliedsnummer"} ${d.kv_nr||"[Nummer]"}\n\nSehr geehrte Damen und Herren,\n\nich teile Ihnen mit, dass ${pkv?"Ihr Versicherungsnehmer":"Ihr Mitglied"}\n\n  ${name}, geboren am ${geb},\n\nam ${tod} verstorben ist.\n\nIch bitte Sie:\n1. alle laufenden Zahlungseinzüge sofort einzustellen,\n2. ${pkv?"eine tagesgenaue Abrechnung vorzunehmen und Beiträge nach dem Todestag zu erstatten":"Beitragsanteile nach dem Todestag zu erstatten"},\n3. die ${pkv?"Versicherung":"Mitgliedschaft"} zum Todestag formal zu beenden.\n\nEine beglaubigte Kopie der Sterbeurkunde liegt bei.\n\n${sig}`;
  }

  if (taskId === "rentenversicherung") return `${abs}\n\nDeutsche Rentenversicherung Bund\nRuhrstr. 2\n10709 Berlin\n\n${dat}\n\nBetreff: Todesfall – Einstellung der Rentenzahlungen\n         RV-Nummer: ${d.rentenversicherung_nr||"[Nummer]"}\n\nSehr geehrte Damen und Herren,\n\nich teile Ihnen mit, dass\n\n  ${name}, geboren am ${geb},\n\nam ${tod} verstorben ist.\n\nIch bitte Sie, die Rentenzahlungen sofort einzustellen. Etwaig überzahlte Beträge werde ich zurücküberweisen.\n\nBitte informieren Sie mich, ob Hinterbliebenenrente beantragt werden kann.\n\nEine beglaubigte Kopie der Sterbeurkunde liegt bei.\n\n${sig}`;

  if (taskId === "vermieter") return `${abs}\n\n${d.vermieter_name||"[Vermieter]"}\n[Anschrift des Vermieters]\n\n${dat}\n\nBetreff: Sonderkündigung – ${d.rental_address||"[Mietadresse]"}\n\nSehr geehrte Damen und Herren,\n\nder Mieter ${name} ist am ${tod} verstorben.\n\nAls ${rel} kündige ich das Mietverhältnis gemäß § 564 BGB außerordentlich zum nächstmöglichen Termin.\n\nIch bitte um schriftliche Bestätigung und Mitteilung des Übergabetermins.\n\nEine beglaubigte Kopie der Sterbeurkunde liegt bei.\n\n${sig}`;

  if (taskId === "internet" || taskId === "mobile") {
    const empf = provider ? `${provider.name}\n${mkAddr(provider)}` : "[Anbieter]\n[Anschrift]";
    return `${abs}\n\n${empf}\n\n${dat}\n\nBetreff: Außerordentliche Kündigung – Kundennummer ${d.internet_kundennr||"[Kundennummer]"}\n\nSehr geehrte Damen und Herren,\n\nder Vertragsinhaber ${name}, geboren am ${geb}, ist am ${tod} verstorben.\n\nIch kündige den Vertrag gemäß § 314 BGB außerordentlich zum nächstmöglichen Termin und bitte um Einstellung aller Lastschriften sowie schriftliche Bestätigung.\n\nEine beglaubigte Kopie der Sterbeurkunde liegt bei.\n\n${sig}`;
  }

  if (taskId === "bank") {
    const empf = provider ? `${provider.name}\n${mkAddr(provider)}` : `${d.bank_name||"[Bank]"}\n[Anschrift]`;
    return `${abs}\n\n${empf}\n\n${dat}\n\nBetreff: Todesfall – Kontosperrung, IBAN ${d.bank_kontonr||"[IBAN]"}\n\nSehr geehrte Damen und Herren,\n\nnich teile Ihnen mit, dass Ihr Kunde ${name}, geboren am ${geb}, am ${tod} verstorben ist.\n\nIch bitte Sie, alle Konten vorläufig zu sperren, Daueraufträge einzustellen und mir mitzuteilen, welche Unterlagen für die weitere Abwicklung erforderlich sind.\n\nEine beglaubigte Kopie der Sterbeurkunde liegt bei.\n\n${sig}`;
  }

  if (taskId.startsWith("streaming_")) {
    const empf = provider ? `${provider.name}\n${mkAddr(provider)}` : "[Anbieter]\n[Anschrift]";
    return `${abs}\n\n${empf}\n\n${dat}\n\nBetreff: Kündigung des Abonnements nach Todesfall\n\nSehr geehrte Damen und Herren,\n\nder Inhaber des Abonnements, ${name}, geboren am ${geb}, ist am ${tod} verstorben.\n\nIch bitte Sie, das Abonnement zum nächstmöglichen Termin zu kündigen und alle laufenden Zahlungen einzustellen. Für den Zeitraum nach dem Todestag eingezogene Beträge bitte ich zu erstatten.\n\nEine beglaubigte Kopie der Sterbeurkunde liegt bei.\n\n${sig}`;
  }

  if (taskId.startsWith("versicherung_")) {
    const empf = provider ? `${provider.name}\n${mkAddr(provider)}` : "[Versicherung]\n[Anschrift]";
    return `${abs}\n\n${empf}\n\n${dat}\n\nBetreff: Todesfall – Kündigung bestehender Verträge\n\nSehr geehrte Damen und Herren,\n\nnich teile Ihnen mit, dass Ihr Versicherungsnehmer ${name}, geboren am ${geb}, am ${tod} verstorben ist.\n\nIch bitte Sie:\n1. alle Versicherungsverträge zum Todestag zu beenden,\n2. zu prüfen, ob Leistungsansprüche (z. B. Lebensversicherung) bestehen,\n3. Prämien nach dem Todestag zu erstatten.\n\nEine beglaubigte Kopie der Sterbeurkunde liegt bei.\n\n${sig}`;
  }

  return "Kein Briefvorlage für diese Aufgabe verfügbar.";
}

// ─── DEFAULT + DYNAMIC TASKS ──────────────────────────────────────────────────
// Korrekte Reihenfolge nach deutschem Recht:
// 1. Bestatter (sofort – übernimmt Überführung & koordiniert vieles)
// 2. Sterbeurkunde (Pflicht innerhalb 3 Werktage am Standesamt)
// 3. Testament (muss zeitnah beim Nachlassgericht abgegeben werden)
// 4. Krankenversicherung (Einzüge stoppen)
// 5. Rentenversicherung (Überzahlung vermeiden)
// 6. Vermieter – dynamisch per makeTasks() eingefügt
// 7. Bank (diese Woche)
// 8. Internet/Mobil/Streaming/Versicherung – per makeTasks() eingefügt
const BASE_TASKS = [
  {id:"bestattung",         cat:"urgent",icon:"🕯️",title:"Bestattungsinstitut beauftragen", inst:"Bestattung",               desc:"Erster und wichtigster Schritt: Das Institut übernimmt die Überführung, koordiniert den Totenschein und unterstützt bei der Sterbeurkunde. Innerhalb weniger Stunden handeln.",                                     comm:false,isFuneral:true},
  {id:"sterbeurkunde",      cat:"urgent",icon:"📄",title:"Sterbeurkunde beantragen",         inst:"Standesamt",               desc:"Gesetzliche Pflicht – muss innerhalb von 3 Werktagen beim zuständigen Standesamt des Sterbeorts beantragt werden. Ohne Sterbeurkunde sind alle weiteren Schritte nicht möglich.", comm:true},
  {id:"testament_abgeben",  cat:"urgent",icon:"⚖️",title:"Testament beim Nachlassgericht",   inst:"Nachlassgericht",          desc:"Jedes bekannte Testament muss unverzüglich beim Nachlassgericht abgegeben werden – auch wenn man selbst Erbe ist. Das Gericht eröffnet es und informiert alle Beteiligten.", comm:false},
  {id:"krankenversicherung",cat:"urgent",icon:"🏥",title:"Krankenversicherung kündigen",      inst:"Krankenkasse",             desc:"Einzüge sofort stoppen lassen, Mitgliedschaft zum Todestag beenden, Rückerstattung für Zeitraum nach Tod prüfen.",      comm:true,isKV:true},
  {id:"rentenversicherung", cat:"urgent",icon:"💰",title:"Rentenversicherung informieren",    inst:"Deutsche Rentenversicherung",desc:"Überzahlte Rente muss zurücküberwiesen werden – je schneller die Meldung, desto weniger Überzahlung. Hinterbliebenenrente prüfen.", comm:true},
  {id:"bank",               cat:"week",  icon:"🏦",title:"Bank informieren",                  inst:"Hausbank",                 desc:"Konten vorläufig sperren lassen, Daueraufträge einstellen. Klären welche Dokumente (z. B. Erbschein) für die weitere Kontoabwicklung nötig sind.", comm:true},
];

function makeTasks(data, prov) {
  const tasks = BASE_TASKS.map(t => ({
    ...t,
    inst: t.isKV && prov.kv ? prov.kv.name : t.inst,
  }));
  if (data.had_rental === "yes")
    tasks.splice(3,0,{id:"vermieter",cat:"urgent",icon:"🔑",title:"Vermieter kündigen",inst:data.vermieter_name||"Vermieter",desc:"Sonderkündigungsrecht § 564 BGB. Kündigung zum nächstmöglichen gesetzlichen Termin.",comm:true});
  if (prov.internet)
    tasks.push({id:"internet",cat:"week",icon:"🌐",title:"Internet kündigen",inst:prov.internet.name,desc:"Außerordentliche Kündigung nach § 314 BGB zum nächstmöglichen Termin.",comm:true});
  if (prov.mobile)
    tasks.push({id:"mobile",cat:"week",icon:"📱",title:"Mobilfunk kündigen",inst:prov.mobile.name,desc:"Außerordentliche Kündigung nach § 314 BGB.",comm:true});
  (prov.streaming||[]).forEach(p =>
    tasks.push({id:`streaming_${p.id}`,cat:"week",icon:"📺",title:`${p.name} kündigen`,inst:p.name,desc:"Abo kündigen und laufende Zahlungen stoppen.",comm:true,streamProv:p}));
  (prov.insurance||[]).forEach(p =>
    tasks.push({id:`versicherung_${p.id}`,cat:"week",icon:"🛡️",title:`${p.name} melden`,inst:p.name,desc:"Verträge zum Todestag beenden, Leistungsansprüche prüfen.",comm:true,insProv:p}));
  return tasks;
}

// ─── ONBOARDING STEPS ────────────────────────────────────────────────────────
const OB = [
  {id:"_intro",   type:"intro"},
  {id:"deceased_name",    type:"text",  grp:"Zur verstorbenen Person",   q:"Vollständiger Name der verstorbenen Person",  ph:"Vor- und Nachname"},
  {id:"deceased_dob",     type:"text",  grp:"Zur verstorbenen Person",   q:"Geburtsdatum",                                ph:"TT.MM.JJJJ"},
  {id:"deceased_address", type:"text",  grp:"Zur verstorbenen Person",   q:"Letzte Wohnadresse",                          ph:"Straße, PLZ Ort"},
  {id:"death_date",       type:"text",  grp:"Zur verstorbenen Person",   q:"Sterbedatum",                                 ph:"TT.MM.JJJJ"},
  {id:"death_location",   type:"single",grp:"Zur verstorbenen Person",   q:"Wo ist die Person verstorben?",
    opts:[{v:"home",l:"Zuhause",i:"🏠"},{v:"hospital",l:"Krankenhaus",i:"🏥"},{v:"nursing",l:"Pflegeheim",i:"🏡"},{v:"abroad",l:"Im Ausland",i:"✈️"}]},
  {id:"death_place_plz",  type:"text",  grp:"Zur verstorbenen Person",   q:"Sterbeort (PLZ und Ort)",                     ph:"z. B. 80331 München", hint:"Bestimmt das zuständige Standesamt."},
  {id:"applicant_name",   type:"text",  grp:"Zu Ihrer Person",           q:"Ihr vollständiger Name",                      ph:"Vor- und Nachname"},
  {id:"applicant_relation",type:"single",grp:"Zu Ihrer Person",          q:"Ihr Verhältnis zur verstorbenen Person",
    opts:[{v:"Ehepartner/in",l:"Ehepartner/in",i:"💑"},{v:"Kind",l:"Kind",i:"👨‍👩‍👧"},{v:"Elternteil",l:"Elternteil",i:"👴"},{v:"Geschwister",l:"Geschwister",i:"👫"},{v:"andere/r Verwandte/r",l:"Andere/r Verwandte/r",i:"🤝"}]},
  {id:"applicant_address",type:"text",  grp:"Zu Ihrer Person",           q:"Ihre Anschrift",                              ph:"Straße, PLZ Ort"},
  {id:"testament",        type:"single",grp:"Rechtliche Situation",      q:"Ist ein Testament bekannt?",
    opts:[{v:"yes_known",l:"Ja – bekannter Ort",i:"📄"},{v:"yes_unknown",l:"Ja – Ort unbekannt",i:"🔍"},{v:"no",l:"Kein Testament",i:"✗"},{v:"unsure",l:"Unsicher",i:"?"}]},
  {id:"kv_selection",     type:"kvdrop",grp:"Versicherungen",            q:"Bei welcher Krankenkasse war die Person versichert?", opt:true},
  {id:"kv_nr",            type:"text",  grp:"Versicherungen",            q:"Mitgliedsnummer / Versicherungsnummer",        ph:"Auf der Krankenkassenkarte", opt:true},
  {id:"rentenversicherung_nr",type:"text",grp:"Versicherungen",          q:"Rentenversicherungsnummer (falls bekannt)",    ph:"12-stellige Nummer", opt:true},
  {id:"versicherung_sel", type:"multidrop",grp:"Versicherungen",         q:"Weitere Versicherungen (Leben, Hausrat, KFZ …)", provList:INSURANCE_LIST, opt:true},
  {id:"had_rental",       type:"single",grp:"Wohnsituation",             q:"Hatte die Person eine Mietwohnung?",
    opts:[{v:"yes",l:"Ja",i:"🏠"},{v:"no",l:"Nein / Eigentum",i:"🏡"}]},
  {id:"vermieter_name",   type:"text",  grp:"Wohnsituation",             q:"Name des Vermieters / Hausverwaltung",         ph:"z. B. Muster Immobilien GmbH", cond:{f:"had_rental",v:"yes"}},
  {id:"rental_address",   type:"text",  grp:"Wohnsituation",             q:"Adresse der Mietwohnung",                      ph:"Straße, PLZ Ort", cond:{f:"had_rental",v:"yes"}},
  {id:"internet_sel",     type:"singledrop",grp:"Laufende Verträge",     q:"Internet- / DSL-Anbieter",                    provList:INTERNET_LIST, provKey:"internet", opt:true},
  {id:"mobile_sel",       type:"singledrop",grp:"Laufende Verträge",     q:"Mobilfunkanbieter",                            provList:MOBILE_LIST,   provKey:"mobile",   opt:true},
  {id:"streaming_sel",    type:"multidrop", grp:"Laufende Verträge",     q:"Streaming-Abonnements",                        provList:STREAMING_LIST,provKey:"streaming",opt:true},
  {id:"bank_sel",         type:"singledrop",grp:"Bank & Finanzen",       q:"Hausbank der verstorbenen Person",             provList:BANK_LIST,     provKey:"bank",     opt:true},
  {id:"bank_kontonr",     type:"text",  grp:"Bank & Finanzen",           q:"IBAN / Kontonummer (falls bekannt)",           ph:"DE…", opt:true},
  {id:"support_needs",    type:"multi", grp:"Womit brauchen Sie Hilfe?", q:"Was belastet Sie aktuell am meisten?",         hint:"Mehrfachauswahl möglich.",
    opts:[{v:"burial",l:"Bestattung",i:"🕯️"},{v:"authorities",l:"Behörden & Ämter",i:"🏛️"},{v:"inheritance",l:"Erbschaft",i:"⚖️"},{v:"contracts",l:"Verträge",i:"📋"},{v:"digital",l:"Digitaler Nachlass",i:"💻"},{v:"emotional",l:"Emotionale Unterstützung",i:"💙"}]},
  {id:"_result",          type:"result"},
];

// ─── SEARCH DROPDOWN ──────────────────────────────────────────────────────────
function SearchDD({items, selected, onSelect, placeholder, groupKey, groupLabels}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = items.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
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
            ? groups.map(g => {
                const gi = filtered.filter(i=>i[groupKey]===g);
                if (!gi.length) return null;
                return (
                  <div key={g}>
                    <p style={{fontSize:10,color:c.muted,textTransform:"uppercase",letterSpacing:"0.08em",padding:"10px 13px 4px",margin:0,fontWeight:700}}>{groupLabels?.[g]||g}</p>
                    {gi.map(item => (
                      <button key={item.id} style={ddOptStyle} onClick={()=>{onSelect(item);setQ("");setOpen(false);}}>
                        <span style={{fontSize:13,color:c.dark,fontFamily:"Georgia,serif"}}>{item.name}</span>
                        {item.street && <span style={{fontSize:11,color:c.muted}}>{item.street}, {item.plz} {item.city}</span>}
                      </button>
                    ))}
                  </div>
                );
              })
            : filtered.map(item => (
                <button key={item.id} style={ddOptStyle} onClick={()=>{onSelect(item);setQ("");setOpen(false);}}>
                  <span style={{fontSize:13,color:c.dark,fontFamily:"Georgia,serif"}}>{item.name}</span>
                  {item.street && <span style={{fontSize:11,color:c.muted}}>{item.street}, {item.plz} {item.city}</span>}
                </button>
              ))
          }
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page,     setPage]     = useState("ob"); // ob | dash
  const [obStep,   setObStep]   = useState(0);
  const [formData, setFormData] = useState({});
  const [prov,     setProv]     = useState({kv:null,internet:null,mobile:null,bank:null,streaming:[],insurance:[]});
  const [tasks,    setTasks]    = useState([]);
  const [dashView, setDashView] = useState("list");
  const [active,   setActive]   = useState(null);
  const [letter,   setLetter]   = useState("");
  const [statuses, setStatuses] = useState({});
  const [sentMode, setSentMode] = useState(null);
  const [catFilter,setCatFilter]= useState("all");

  const setField = (k,v) => setFormData(prev => ({...prev,[k]:v}));

  // Called with explicit current values to avoid stale closures
  const finishOb = (fd, pr) => {
    const merged = {...fd, kv_name:pr.kv?.name, kv_type:pr.kv?.type, bank_name:pr.bank?.name};
    setFormData(merged);
    setProv(pr);
    setTasks(makeTasks(merged, pr));
    setPage("dash");
  };

  // Advance onboarding, skipping conditional steps
  const obAdvance = (fd, pr) => {
    let next = obStep + 1;
    while (next < OB.length) {
      const s = OB[next];
      if (s.cond && fd[s.cond.f] !== s.cond.v) { next++; continue; }
      break;
    }
    if (next >= OB.length) { finishOb(fd, pr); return; }
    const nextStep = OB[next];
    if (nextStep.type === "result") { finishOb(fd, pr); return; }
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
    if (task.isKV)               p = prov.kv;
    else if (task.id==="bank")   p = prov.bank;
    else if (task.id==="internet") p = prov.internet;
    else if (task.id==="mobile")   p = prov.mobile;
    else if (task.streamProv)    p = task.streamProv;
    else if (task.insProv)       p = task.insProv;
    setLetter(buildLetter(task.id, formData, p));
    setDashView("letter");
  };

  const doSend = (mode) => {
    setSentMode(mode);
    setStatuses(s => ({...s, [active.id]:{mode, date:fmtDate(), letter}}));
    setDashView("sent");
  };

  const markDone = (id) => {
    setStatuses(s => ({...s, [id]:{mode:"manual", date:fmtDate(), letter:""}}));
    setDashView("list");
    setActive(null);
  };

  const CATS = [
    {id:"urgent",label:"Sofort",      color:c.red,   bg:"rgba(192,57,43,0.07)"},
    {id:"week",  label:"Diese Woche", color:c.amber, bg:"rgba(217,119,6,0.07)"},
    {id:"later", label:"Später",      color:c.green, bg:"rgba(74,124,111,0.07)"},
  ];

  // ── WRAPPER ────────────────────────────────────────────────────────────────
  const wrap = (children) => (
    <div style={{minHeight:"100vh",background:c.bg,fontFamily:"Georgia,'Times New Roman',serif"}}>
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse at 15% 10%,#DDD5C8,transparent 55%),radial-gradient(ellipse at 85% 85%,#C8D5D0,transparent 55%)",zIndex:0,pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1,maxWidth:540,margin:"0 auto",padding:"32px 20px 80px"}}>
        {children}
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // ONBOARDING
  // ════════════════════════════════════════════════════════════════════════════
  if (page === "ob") {
    const cur = OB[obStep];
    const prog = Math.round((obStep / (OB.length - 1)) * 100);

    const canNext = () => {
      if (!cur) return false;
      if (cur.opt) return true;
      if (cur.type==="intro"||cur.type==="result") return true;
      if (cur.type==="single")   return !!formData[cur.id];
      if (cur.type==="multi")    return (formData[cur.id]||[]).length > 0;
      if (cur.type==="kvdrop")   return !!prov.kv;
      if (cur.type==="singledrop"||cur.type==="multidrop") return true;
      return !!formData[cur.id];
    };

    return wrap(
      <>
        {obStep > 0 && (
          <div style={{position:"fixed",top:0,left:0,right:0,height:3,background:"rgba(0,0,0,0.07)",zIndex:99}}>
            <div style={{height:"100%",width:`${prog}%`,background:c.green,transition:"width .3s"}}/>
          </div>
        )}

        <div style={{...cardStyle,padding:0}}>

          {/* INTRO */}
          {cur.type==="intro" && (
            <div style={{padding:"44px 32px 36px",display:"flex",flexDirection:"column",alignItems:"center",gap:12,textAlign:"center"}}>
              <div style={{fontSize:48}}>🕊️</div>
              <h1 style={{fontSize:28,fontWeight:400,color:c.dark,margin:0,fontStyle:"italic"}}>Begleiter</h1>
              <p style={{fontSize:11,color:c.muted,letterSpacing:"0.09em",textTransform:"uppercase",margin:0}}>Ihr ruhiger Lotse durch einen schweren Moment</p>
              <p style={{fontSize:13,color:c.mid,lineHeight:1.8,textAlign:"center",maxWidth:340,margin:0}}>Wir begleiten Sie durch alle notwendigen Schritte. Alle Schreiben an Behörden und Unternehmen werden automatisch vorbereitet.</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
                {["🔒 DSGVO","🇩🇪 Deutschland","💙 Kostenlos"].map(t=>(
                  <span key={t} style={{fontSize:12,color:c.green,background:"rgba(74,124,111,0.07)",border:"1px solid rgba(74,124,111,0.18)",borderRadius:99,padding:"4px 12px"}}>{t}</span>
                ))}
              </div>
              <button style={{...primaryBtn,marginTop:8}} onClick={()=>setObStep(1)}>Jetzt beginnen</button>
              <button style={{background:"none",border:"none",color:c.faint,fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif"}} onClick={()=>finishOb(formData,prov)}>Direkt zum Dashboard →</button>
            </div>
          )}

          {/* TEXT */}
          {cur.type==="text" && (
            <div style={{padding:"32px 28px 28px",display:"flex",flexDirection:"column",gap:10}}>
              <button style={backBtn} onClick={obBack}>← Zurück</button>
              <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
              <h2 style={{fontSize:19,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
              {cur.hint&&<p style={{fontSize:13,color:c.muted,margin:0}}>{cur.hint}</p>}
              {cur.opt&&<p style={{fontSize:11,color:c.faint,margin:0}}>Optional</p>}
              <input
                autoFocus
                style={inputStyle(!!formData[cur.id])}
                placeholder={cur.ph}
                value={formData[cur.id]||""}
                onChange={e=>setField(cur.id,e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&canNext()&&obAdvance(formData,prov)}
              />
              <button
                style={{...primaryBtn,opacity:canNext()?1:0.4,marginTop:4}}
                onClick={()=>canNext()&&obAdvance(formData,prov)}
                disabled={!canNext()}
              >
                {cur.opt&&!formData[cur.id]?"Überspringen →":"Weiter →"}
              </button>
            </div>
          )}

          {/* SINGLE CHOICE */}
          {cur.type==="single" && (
            <div style={{padding:"32px 28px 28px",display:"flex",flexDirection:"column",gap:10}}>
              <button style={backBtn} onClick={obBack}>← Zurück</button>
              <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
              <h2 style={{fontSize:19,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                {cur.opts.map(o => {
                  const on = formData[cur.id]===o.v;
                  return (
                    <button key={o.v} style={optCardStyle(on)} onClick={()=>{
                      const fd = {...formData,[cur.id]:o.v};
                      setField(cur.id, o.v);
                      setTimeout(()=>obAdvance(fd, prov), 260);
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

          {/* MULTI CHOICE */}
          {cur.type==="multi" && (
            <div style={{padding:"32px 28px 28px",display:"flex",flexDirection:"column",gap:10}}>
              <button style={backBtn} onClick={obBack}>← Zurück</button>
              <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
              <h2 style={{fontSize:19,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
              {cur.hint&&<p style={{fontSize:13,color:c.muted,margin:0}}>{cur.hint}</p>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                {cur.opts.map(o=>{
                  const sel=(formData[cur.id]||[]).includes(o.v);
                  return (
                    <button key={o.v} style={optCardStyle(sel)} onClick={()=>{
                      const prev=formData[cur.id]||[];
                      setField(cur.id, sel?prev.filter(x=>x!==o.v):[...prev,o.v]);
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

          {/* KV DROPDOWN */}
          {cur.type==="kvdrop" && (
            <div style={{padding:"32px 28px 28px",display:"flex",flexDirection:"column",gap:10}}>
              <button style={backBtn} onClick={obBack}>← Zurück</button>
              <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
              <h2 style={{fontSize:19,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
              <p style={{fontSize:11,color:c.faint,margin:0}}>Optional</p>
              <SearchDD
                items={KV_LIST}
                selected={prov.kv}
                onSelect={kv=>setProv(p=>({...p,kv}))}
                placeholder="Krankenkasse suchen …"
                groupKey="type"
                groupLabels={{GKV:"Gesetzlich (GKV)",PKV:"Privat (PKV)"}}
              />
              {prov.kv && (
                <div style={infoStyle}>
                  <span style={{fontSize:11,color:c.muted}}>📍 {mkAddr(prov.kv)}</span>
                  <span style={{fontSize:11,color:prov.kv.type==="PKV"?c.red:c.green,fontWeight:600}}>
                    {prov.kv.type==="PKV"?"Privat: tagesgenaue Abrechnung":"Gesetzlich: Einzug stoppen"}
                  </span>
                </div>
              )}
              <button style={{...primaryBtn,marginTop:4}} onClick={()=>obAdvance(formData,prov)}>
                {prov.kv?"Weiter →":"Überspringen →"}
              </button>
            </div>
          )}

          {/* SINGLE PROVIDER DROPDOWN */}
          {cur.type==="singledrop" && (
            <div style={{padding:"32px 28px 28px",display:"flex",flexDirection:"column",gap:10}}>
              <button style={backBtn} onClick={obBack}>← Zurück</button>
              <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
              <h2 style={{fontSize:19,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
              <p style={{fontSize:11,color:c.faint,margin:0}}>Optional</p>
              <SearchDD
                items={cur.provList}
                selected={prov[cur.provKey]||null}
                onSelect={item=>setProv(p=>({...p,[cur.provKey]:item}))}
                placeholder="Suchen …"
              />
              {prov[cur.provKey] && (
                <div style={infoStyle}>
                  <span style={{fontSize:11,color:c.muted}}>📍 {mkAddr(prov[cur.provKey])}</span>
                  {prov[cur.provKey].email&&prov[cur.provKey].email!=="–"&&<span style={{fontSize:11,color:c.green}}>✉ {prov[cur.provKey].email}</span>}
                </div>
              )}
              <button style={{...primaryBtn,marginTop:4}} onClick={()=>obAdvance(formData,prov)}>
                {prov[cur.provKey]?"Weiter →":"Überspringen →"}
              </button>
            </div>
          )}

          {/* MULTI PROVIDER DROPDOWN */}
          {cur.type==="multidrop" && (
            <div style={{padding:"32px 28px 28px",display:"flex",flexDirection:"column",gap:10}}>
              <button style={backBtn} onClick={obBack}>← Zurück</button>
              <p style={{fontSize:11,color:c.muted,textTransform:"uppercase",letterSpacing:"0.07em",margin:0}}>{cur.grp}</p>
              <h2 style={{fontSize:19,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.4}}>{cur.q}</h2>
              <p style={{fontSize:11,color:c.faint,margin:0}}>Optional – Mehrfachauswahl</p>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {cur.provList.map(item=>{
                  const key = cur.id==="streaming_sel"?"streaming":"insurance";
                  const sel = (prov[key]||[]).some(x=>x.id===item.id);
                  return (
                    <button key={item.id}
                      style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:"rgba(255,255,255,0.55)",border:`1.5px solid ${sel?"rgba(74,124,111,0.4)":"rgba(0,0,0,0.08)"}`,borderRadius:10,cursor:"pointer"}}
                      onClick={()=>setProv(p=>({...p,[key]:sel?(p[key]||[]).filter(x=>x.id!==item.id):[...(p[key]||[]),item]}))}>
                      <span style={{fontSize:13,flex:1,textAlign:"left",color:sel?c.dark:c.mid,fontFamily:"Georgia,serif"}}>{item.name}</span>
                      {sel&&<span style={{color:c.green,fontWeight:700,fontSize:13}}>✓</span>}
                    </button>
                  );
                })}
              </div>
              <button style={{...primaryBtn,marginTop:4}} onClick={()=>obAdvance(formData,prov)}>
                {(()=>{const key=cur.id==="streaming_sel"?"streaming":"insurance";const n=(prov[key]||[]).length;return n>0?`Weiter (${n})`:"Überspringen →";})()}
              </button>
            </div>
          )}

          {/* RESULT */}
          {cur.type==="result" && (
            <div style={{padding:"44px 32px 36px",display:"flex",flexDirection:"column",alignItems:"center",gap:12,textAlign:"center"}}>
              <div style={{fontSize:44}}>📋</div>
              <h2 style={{fontSize:26,fontWeight:400,color:c.dark,margin:0,fontStyle:"italic"}}>Ihr Plan ist bereit</h2>
              <p style={{fontSize:13,color:c.mid,lineHeight:1.8,maxWidth:320,margin:0}}>Alle Schreiben werden automatisch mit Ihren Angaben ausgefüllt.</p>
              <button style={{...primaryBtn,marginTop:8}} onClick={()=>finishOb(formData,prov)}>Zum Dashboard →</button>
            </div>
          )}

        </div>
      </>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ════════════════════════════════════════════════════════════════════════════
  const done = Object.keys(statuses).length;
  const vis  = catFilter==="all" ? tasks : tasks.filter(t=>t.cat===catFilter);

  // FUNERAL VIEW
  if (dashView==="funeral") return wrap(
    <>
      <button style={backBtn} onClick={()=>setDashView("list")}>← Dashboard</button>
      <h2 style={{fontSize:24,fontWeight:400,color:c.dark,fontStyle:"italic",margin:"0 0 4px"}}>Bestattungsinstitute</h2>
      <p style={{fontSize:13,color:c.muted,marginBottom:16}}>Empfehlungen in Ihrer Nähe – geprüft und bewertet.</p>
      {FUNERAL_LIST.map(f=>(
        <div key={f.id} style={{...cardStyle,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontSize:14,fontWeight:700,color:c.dark,fontFamily:"Georgia,serif"}}>{f.name}</span>
                {f.cert&&<span style={{fontSize:10,background:"rgba(74,124,111,0.1)",color:c.green,border:"1px solid rgba(74,124,111,0.2)",borderRadius:99,padding:"2px 8px"}}>✓ Zertifiziert</span>}
              </div>
              <p style={{fontSize:11,color:c.muted,margin:0}}>{f.addr}</p>
            </div>
            <div style={{textAlign:"right"}}>
              <p style={{fontSize:13,color:c.amber,fontWeight:700,margin:0}}>★ {f.rating}</p>
              <p style={{fontSize:11,color:c.muted,margin:0}}>{f.reviews} Bewertungen</p>
            </div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",margin:"10px 0"}}>
            {f.specs.map(s=><span key={s} style={{fontSize:11,background:"rgba(0,0,0,0.05)",borderRadius:6,padding:"3px 8px",color:c.mid}}>{s}</span>)}
          </div>
          <div style={{display:"flex",gap:8}}>
            <a href={`tel:${f.phone}`} style={{...ghostBtn,textDecoration:"none",flex:1,textAlign:"center",padding:"9px"}}>📞 {f.phone}</a>
            <button style={{...primaryBtn,flex:1,padding:"9px",width:"auto"}} onClick={()=>{setStatuses(s=>({...s,bestattung:{mode:"manual",date:fmtDate(),letter:"",note:`${f.name} kontaktiert`}}));setDashView("list");}}>Ausgewählt ✓</button>
          </div>
        </div>
      ))}
    </>
  );

  // LETTER VIEW
  if (dashView==="letter") return wrap(
    <>
      <button style={backBtn} onClick={()=>setDashView("task")}>← Zurück</button>
      <div style={cardStyle}>
        <span style={{fontSize:11,background:"rgba(74,124,111,0.08)",color:c.green,border:"1px solid rgba(74,124,111,0.2)",borderRadius:99,padding:"3px 10px",display:"inline-block",marginBottom:8}}>Briefentwurf</span>
        <h2 style={{fontSize:18,fontWeight:400,color:c.dark,margin:"0 0 4px",fontStyle:"italic"}}>{active.title}</h2>
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
  if (dashView==="sent") return wrap(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,paddingTop:60,textAlign:"center"}}>
      <div style={{fontSize:52}}>{sentMode==="digital"?"✉":"🖨"}</div>
      <h2 style={{fontSize:24,fontWeight:400,color:c.dark,fontStyle:"italic",margin:0}}>{sentMode==="digital"?"Versandt":"Bereit zum Drucken"}</h2>
      <p style={{fontSize:13,color:c.muted,maxWidth:300,lineHeight:1.6}}>{sentMode==="digital"?`Das Schreiben an ${active.inst} wurde übermittelt.`:"Bitte legen Sie eine Kopie der Sterbeurkunde bei."}</p>
      {sentMode==="print"&&<button style={primaryBtn} onClick={()=>window.print()}>🖨 Jetzt drucken</button>}
      <button style={ghostBtn} onClick={()=>{setDashView("list");setActive(null);}}>Zum Dashboard →</button>
    </div>
  );

  // STATUS VIEW
  if (dashView==="status"&&active) {
    const st = statuses[active.id];
    return wrap(
      <>
        <button style={backBtn} onClick={()=>setDashView("list")}>← Dashboard</button>
        <div style={cardStyle}>
          <span style={{fontSize:11,background:"rgba(74,124,111,0.08)",color:c.green,border:"1px solid rgba(74,124,111,0.2)",borderRadius:99,padding:"3px 10px",display:"inline-block",marginBottom:8}}>
            {st.mode==="digital"?"✉ Versandt":st.mode==="print"?"🖨 Gedruckt":"✓ Erledigt"} · {st.date}
          </span>
          <h2 style={{fontSize:18,fontWeight:400,color:c.dark,margin:"4px 0 2px",fontStyle:"italic"}}>{active.title}</h2>
          <p style={{fontSize:11,color:c.muted,margin:"0 0 14px"}}>{active.inst}</p>
          {st.note&&<p style={{fontSize:13,color:c.green,marginBottom:12}}>📝 {st.note}</p>}
          {st.letter&&<>
            <p style={{fontSize:11,color:c.muted,marginBottom:6}}>Versandtes Schreiben:</p>
            <textarea style={{...textareaStyle,opacity:.65}} value={st.letter} readOnly/>
          </>}
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
    if (active.isFuneral) return wrap(
      <>
        <button style={backBtn} onClick={()=>setDashView("list")}>← Dashboard</button>
        <div style={cardStyle}>
          <span style={{fontSize:36}}>🕯️</span>
          <h2 style={{fontSize:20,fontWeight:400,color:c.dark,fontStyle:"italic",margin:"10px 0 6px"}}>Bestattungsinstitut wählen</h2>
          <p style={{fontSize:13,color:c.mid,lineHeight:1.7}}>Wir zeigen Ihnen geprüfte Institute in Ihrer Nähe mit Bewertungen und Kontaktdaten.</p>
          <button style={{...primaryBtn,marginTop:14}} onClick={()=>setDashView("funeral")}>Institute anzeigen →</button>
        </div>
      </>
    );

    const cat = CATS.find(x=>x.id===active.cat)||CATS[0];
    return wrap(
      <>
        <button style={backBtn} onClick={()=>setDashView("list")}>← Dashboard</button>
        <div style={{...cardStyle,marginBottom:14}}>
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            <span style={{fontSize:32,flexShrink:0}}>{active.icon}</span>
            <div>
              <span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:cat.color,background:cat.bg,padding:"3px 8px",borderRadius:99,display:"inline-block",marginBottom:4}}>{cat.label}</span>
              <h2 style={{fontSize:20,fontWeight:400,color:c.dark,fontStyle:"italic",margin:"2px 0"}}>{active.title}</h2>
              <p style={{fontSize:11,color:c.muted,margin:0}}>📍 {active.inst}</p>
            </div>
          </div>
          <p style={{fontSize:13,color:c.mid,lineHeight:1.7,marginTop:12}}>{active.desc}</p>
        </div>
        {/* Streaming: digitale Kündigung + Brief als Alternative */}
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
              {active.streamProv?.digitalSteps
                ? "Falls kein Zugang zum Konto: Formeller Brief per Post."
                : "Standardisierter DIN-5008-Brief – alle Daten bereits eingefügt."}
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

  // DASHBOARD LIST
  return wrap(
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
        <div>
          <h1 style={{fontSize:28,fontWeight:400,color:c.dark,fontStyle:"italic",letterSpacing:"0.04em",margin:0}}>Begleiter</h1>
          <p style={{fontSize:11,color:c.muted,margin:"4px 0 0"}}>Ihre persönliche Übersicht</p>
        </div>
        <svg width="52" height="52" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="4"/>
          <circle cx="26" cy="26" r="20" fill="none" stroke={c.green} strokeWidth="4"
            strokeDasharray={`${tasks.length?(done/tasks.length)*125.6:0} 125.6`}
            strokeLinecap="round" transform="rotate(-90 26 26)" style={{transition:"stroke-dasharray .5s"}}/>
          <text x="26" y="31" textAnchor="middle" style={{fontSize:12,fill:c.dark,fontFamily:"Georgia,serif"}}>{done}/{tasks.length}</text>
        </svg>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
        {[
          {l:"Sofort",       n:tasks.filter(t=>t.cat==="urgent"&&!statuses[t.id]).length,col:c.red},
          {l:"Diese Woche",  n:tasks.filter(t=>t.cat==="week"  &&!statuses[t.id]).length,col:c.amber},
          {l:"Erledigt",     n:done, col:c.green},
        ].map(s=>(
          <div key={s.l} style={{background:"rgba(255,255,255,0.72)",borderRadius:12,border:"1px solid rgba(255,255,255,0.9)",padding:"12px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <span style={{fontSize:22,fontWeight:700,color:s.col,lineHeight:1}}>{s.n}</span>
            <span style={{fontSize:11,color:c.muted}}>{s.l}</span>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
        {[{id:"all",label:"Alle"},...CATS].map(f=>(
          <button key={f.id}
            style={{padding:"6px 14px",borderRadius:99,border:`1.5px solid ${catFilter===f.id?c.dark:"rgba(0,0,0,0.1)"}`,background:catFilter===f.id?c.dark:"transparent",color:catFilter===f.id?"#F4EFE8":"#7A8C84",fontSize:12,cursor:"pointer",fontFamily:"Georgia,serif"}}
            onClick={()=>setCatFilter(f.id)}>{f.label}</button>
        ))}
      </div>

      {/* Task groups */}
      {CATS.filter(cat=>catFilter==="all"||catFilter===cat.id).map(cat=>{
        const ct = vis.filter(t=>t.cat===cat.id);
        if (!ct.length) return null;
        return (
          <div key={cat.id} style={{marginBottom:22}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:cat.color,display:"inline-block"}}/>
              <span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:cat.color}}>{cat.label}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {ct.map(task=>{
                const st  = statuses[task.id];
                const isDone = !!st;
                return (
                  <button key={task.id}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",background:"rgba(255,255,255,0.72)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.9)",borderRadius:13,cursor:"pointer",width:"100%",boxShadow:"0 2px 10px rgba(0,0,0,0.04)",opacity:isDone?0.65:1}}
                    onClick={()=>{setActive(task);setDashView(isDone?"status":"task");}}>
                    <span style={{fontSize:20,flexShrink:0}}>{task.icon}</span>
                    <div style={{flex:1,textAlign:"left"}}>
                      <p style={{fontSize:13,color:isDone?c.faint:c.dark,margin:0,textDecoration:isDone?"line-through":"none",fontFamily:"Georgia,serif"}}>{task.title}</p>
                      <p style={{fontSize:11,margin:"2px 0 0",color:isDone?(st.mode==="digital"?c.green:st.mode==="print"?c.amber:c.muted):c.muted}}>
                        {isDone?(st.mode==="digital"?`✉ Versandt · ${st.date}`:st.mode==="print"?`🖨 Gedruckt · ${st.date}`:`✓ Erledigt · ${st.date}`):task.inst}
                      </p>
                    </div>
                    <span style={{color:c.faint,fontSize:16}}>›</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Vault */}
      <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"13px 15px",background:"rgba(255,255,255,0.45)",border:"1px dashed rgba(0,0,0,0.1)",borderRadius:12,marginTop:8}}>
        <span style={{fontSize:18}}>🗄</span>
        <div>
          <p style={{fontSize:13,color:c.dark,margin:"0 0 2px",fontFamily:"Georgia,serif"}}>Datentresor</p>
          <p style={{fontSize:11,color:c.muted,margin:0}}>{Object.values(formData).filter(Boolean).length} Felder gespeichert · automatisch in alle Schreiben eingefügt</p>
        </div>
      </div>
    </>
  );
}
