// ─── PROVIDERS ────────────────────────────────────────────────────────────────
export const mkAddr = (p) => p ? `${p.street}\n${p.plz} ${p.city}`.trim() : "";

export const KV_LIST = [
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

export const INTERNET_LIST = [
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

export const MOBILE_LIST = [
  {id:"tel_m",  name:"Telekom Mobilfunk",  domain:"telekom.de",  street:"Postfach 2000",       plz:"53105",city:"Bonn",      email:"kuendigung@telekom.de"},
  {id:"voda_m", name:"Vodafone Mobilfunk", domain:"vodafone.de", street:"Postfach 4040",       plz:"40874",city:"Ratingen",  email:"kuendigung@vodafone.de"},
  {id:"o2_m",   name:"O2 Mobilfunk",       domain:"o2online.de", street:"Postfach 100 740",    plz:"90705",city:"Fürth",     email:"kuendigung@o2online.de"},
  {id:"1u1_m",  name:"1&1 Mobilfunk",      domain:"1und1.de",    street:"Elgendorfer Str. 57", plz:"56410",city:"Montabaur", email:"kuendigung@1und1.de"},
  {id:"cong_m", name:"Congstar Mobilfunk", domain:"congstar.de", street:"Bayenwerft 12–14",    plz:"50678",city:"Köln",      email:"service@congstar.de"},
  {id:"klarm",  name:"klarmobil",          domain:"klarmobil.de",street:"Reichsstr. 11",       plz:"14052",city:"Berlin",    email:"kuendigung@klarmobil.de"},
];

export const BANK_LIST = [
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

export const STREAMING_LIST = [
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

export const INSURANCE_LIST = [
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

export const fmtDate = () => new Date().toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"});

export function buildLetter(taskId, d, provider) {
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

export const BASE_TASKS = [
  {id:"bestattung",        cat:"urgent",icon:"🕯️",title:"Bestattungsinstitut beauftragen",  inst:"Bestattung",                 desc:"Erster und wichtigster Schritt: Das Institut übernimmt die Überführung, koordiniert den Totenschein und unterstützt bei der Sterbeurkunde. Innerhalb weniger Stunden handeln.",comm:false,isFuneral:true},
  {id:"unfallversicherung",cat:"urgent",icon:"⚡",title:"Unfallversicherung melden",         inst:"Unfallversicherer",           desc:"⚠️ Frist: 48 Stunden! Bei Unfalltod muss die Versicherung sofort informiert werden – sonst droht Anspruchsverlust. Gilt auch für Berufsunfähigkeits­versicherung mit Unfalltod-Klausel.",comm:true,isUV:true},
  {id:"sterbeurkunde",     cat:"urgent",icon:"📄",title:"Sterbeurkunde beantragen",          inst:"Standesamt",                 desc:"Gesetzliche Pflicht – innerhalb von 3 Werktagen beim Standesamt des Sterbeorts. Ohne Sterbeurkunde sind alle weiteren Schritte nicht möglich. Mind. 5 Exemplare ausstellen lassen.",comm:true},
  {id:"testament_abgeben", cat:"urgent",icon:"⚖️",title:"Testament beim Nachlassgericht",   inst:"Nachlassgericht",            desc:"Jedes bekannte Testament muss unverzüglich beim Nachlassgericht abgegeben werden – auch wenn man selbst Erbe ist. Das Gericht eröffnet es und informiert alle Beteiligten.",comm:false},
  {id:"krankenversicherung",cat:"urgent",icon:"🏥",title:"Krankenversicherung kündigen",     inst:"Krankenkasse",               desc:"Einzüge sofort stoppen lassen, Mitgliedschaft zum Todestag beenden, Rückerstattung für Zeitraum nach Tod prüfen.",comm:true,isKV:true},
  {id:"rentenversicherung",cat:"urgent",icon:"💰",title:"Rentenversicherung informieren",    inst:"Deutsche Rentenversicherung",desc:"Überzahlte Rente muss zurücküberwiesen werden – je schneller die Meldung, desto weniger Überzahlung. Hinterbliebenenrente prüfen.",comm:true},
  {id:"bank",              cat:"week",  icon:"🏦",title:"Bank informieren",                  inst:"Hausbank",                   desc:"Konten vorläufig sperren lassen, Daueraufträge einstellen. Klären welche Dokumente (z. B. Erbschein) für die weitere Kontoabwicklung nötig sind.",comm:true},
];

export function makeTasks(data, prov) {
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

export const OB = [
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

// FAQ pro Aufgaben-ID (oder Pattern). Genutzt im Task-Detail.
const FAQ_GENERIC = [
  {q:"Was passiert, wenn ich die Frist verpasse?", a:"Bei vielen Aufgaben gibt es gesetzliche Fristen (z.B. 48h Unfallversicherung, 3 Werktage Sterbeurkunde, 6 Wochen Erbausschlagung). Versäumte Fristen können zu Anspruchsverlust führen – melden Sie sich nachträglich trotzdem so schnell wie möglich und schildern Sie die Umstände."},
  {q:"Welche Unterlagen brauche ich?", a:"Meist eine beglaubigte Kopie der Sterbeurkunde (Standesamt, ca. 12-15 € pro Stück, mind. 5 Stück empfohlen). Bei Erbangelegenheiten zusätzlich Erbschein oder Testament mit Eröffnungsprotokoll."},
  {q:"Kann ich das auch online machen?", a:"Bei Streaming-Diensten und vielen privaten Anbietern: ja. Bei Behörden meist schriftlich per Post – das Schreiben hier ausdrucken, unterschreiben und mit Sterbeurkunde versenden. Einschreiben empfohlen."},
];

export const FAQ_DATA = {
  bestattung: [
    {q:"Wie viel Zeit habe ich, um ein Bestattungsinstitut zu wählen?", a:"In der Regel müssen Sie sich innerhalb weniger Stunden entscheiden – das Institut übernimmt die Überführung des Verstorbenen. Bei einem Todesfall zu Hause zuerst den Hausarzt oder Notarzt rufen, der den Totenschein ausstellt."},
    {q:"Was kostet eine Bestattung in Deutschland?", a:"Eine einfache Erdbestattung kostet etwa 5.000-8.000 €, eine Feuerbestattung ab 3.000 €. Sozialbestattungen sind möglich, wenn keine Mittel vorhanden sind – Antrag beim Sozialamt."},
    {q:"Erdbestattung oder Feuerbestattung?", a:"Falls keine Verfügung des Verstorbenen vorliegt, entscheiden die Angehörigen. Feuerbestattung ist günstiger und flexibler bei der Beisetzung (Urnenbeisetzung, See-, Wald- oder Friedwaldbestattung möglich)."},
    {q:"Muss ich mehrere Angebote einholen?", a:"Sehr empfohlen. Preise variieren stark. Die Verbraucherzentrale rät zu mindestens drei Vergleichsangeboten – auch in der ersten Trauerphase legitim."},
    ...FAQ_GENERIC,
  ],
  unfallversicherung: [
    {q:"Was zählt rechtlich als Unfalltod?", a:"Ein Unfalltod liegt vor, wenn der Tod durch ein plötzliches, von außen einwirkendes Ereignis verursacht wurde – auch wenn der Tod erst Tage später eintritt (z.B. Spätfolgen eines Verkehrsunfalls). Auch ein Sturz auf der Treppe oder ein Verkehrsunfall mit Wochen späterer Komplikation kann darunter fallen."},
    {q:"Was ist mit Berufsunfähigkeitsversicherung?", a:"Auch BU-Versicherungen mit Todesfallklausel oder Unfall-Zusatz unbedingt prüfen und melden. Die 48h-Frist gilt analog."},
    {q:"Was, wenn ich die Versicherungsnummer nicht kenne?", a:"Schreiben Sie trotzdem fristwahrend und nennen Namen + Geburtsdatum. Die Versicherung kann den Vertrag identifizieren. Suchen Sie parallel im Datentresor nach Unterlagen."},
    {q:"Was ist die Doppelte-Todesfallleistung?", a:"Viele Lebensversicherungen zahlen bei Unfalltod den doppelten Betrag aus. Diese Klausel verfällt aber häufig, wenn die 48h-Meldefrist nicht eingehalten wird."},
    ...FAQ_GENERIC,
  ],
  sterbeurkunde: [
    {q:"Wo bekomme ich die Sterbeurkunde?", a:"Beim Standesamt des Sterbeorts (nicht des Wohnorts!). Falls die Person in einem Krankenhaus verstorben ist, übernimmt oft das Bestattungsinstitut die Beantragung."},
    {q:"Wie viele Exemplare brauche ich?", a:"Mindestens 5-7 beglaubigte Originale: Bank, Krankenkasse, Rentenversicherung, Lebensversicherung, Vermieter, evtl. Nachlassgericht. Eine Kopie reicht nicht – immer Originale verlangen."},
    {q:"Was kostet die Sterbeurkunde?", a:"Etwa 12-15 € pro Original (regional unterschiedlich). Für gleichzeitig ausgestellte Folgeexemplare oft günstiger."},
    {q:"Welche Unterlagen muss ich mitbringen?", a:"Totenschein (vom Arzt), Personalausweis der verstorbenen Person, Geburtsurkunde + Familienstammbuch, eigener Personalausweis."},
    ...FAQ_GENERIC,
  ],
  testament_abgeben: [
    {q:"Muss ich ein Testament abgeben, wenn ich selbst Erbe bin?", a:"Ja – auch wenn Sie der einzige Erbe sind, muss jedes Testament unverzüglich beim Nachlassgericht abgegeben werden (§ 2259 BGB). Wer ein Testament zurückhält, riskiert Strafanzeige wegen Urkundenunterdrückung."},
    {q:"Welches Nachlassgericht ist zuständig?", a:"Das Amtsgericht am letzten Wohnsitz des Verstorbenen. Bei mehreren Wohnsitzen der gewöhnliche Aufenthaltsort."},
    {q:"Was kostet die Testamentseröffnung?", a:"Eine Pauschale von 100 € sowie zusätzliche Gebühren je nach Nachlasswert. Die Kosten trägt der Nachlass."},
    {q:"Was, wenn ich vermute, dass ein Testament existiert?", a:"Beim Zentralen Testamentsregister der Bundesnotarkammer können Sie nachfragen – dort sind alle notariellen und amtlich verwahrten Testamente erfasst."},
    ...FAQ_GENERIC,
  ],
  krankenversicherung: [
    {q:"Bekomme ich Beiträge zurück?", a:"Ja – Beiträge ab dem Todestag werden erstattet (gesetzlich tagesgenau, privat ebenfalls). Schnelle Meldung verhindert weitere Abbuchungen."},
    {q:"Was ist mit Familienversicherten?", a:"Mitversicherte Angehörige können meist 1-3 Monate weiter versichert bleiben (Witwen-/Waisenrente). Danach Anschlussversicherung organisieren – die Krankenkasse berät dazu."},
    {q:"Was, wenn die Person privat versichert war?", a:"Bei PKV gibt es keine kostenfreie Familienversicherung. Hinterbliebene müssen sich selbst versichern. Tagesgenaue Abrechnung verlangen, Restbeiträge zurückfordern."},
    ...FAQ_GENERIC,
  ],
  rentenversicherung: [
    {q:"Wann muss ich die Rente zurückzahlen?", a:"Renten ab dem Sterbemonat sind in der Regel zurückzuzahlen. Schnelle Meldung minimiert die Rückzahlungssumme. Die Rentenversicherung zieht überzahlte Beträge automatisch zurück."},
    {q:"Wer hat Anspruch auf Witwenrente?", a:"Ehepartner/in (auch eingetragene Lebenspartner/in), wenn die Ehe mind. ein Jahr bestand. 25% der Rente des Verstorbenen (kleine WW-Rente, 2 Jahre) oder 55% (große WW-Rente, lebenslang ab 47)."},
    {q:"Wie beantrage ich die Witwenrente?", a:"Online auf eservice-drv.de oder bei jeder DRV-Beratungsstelle. Antrag innerhalb von 30 Tagen stellen, damit das volle Sterbevierteljahr (3 volle Monate Rente des Verstorbenen) gezahlt wird."},
    {q:"Was ist mit Halbwaisenrente?", a:"Kinder bis 18 (mit Ausbildung bis 27) erhalten Halbwaisenrente: 10% der Rente. Vollwaisenrente bei Tod beider Elternteile: 20%."},
    ...FAQ_GENERIC,
  ],
  bank: [
    {q:"Werden Konten automatisch gesperrt?", a:"Sobald die Bank vom Tod erfährt, werden Konten zu Nachlasskonten – Verfügungen sind nur noch eingeschränkt möglich. Daueraufträge laufen oft weiter, bis sie aktiv gestoppt werden."},
    {q:"Brauche ich einen Erbschein?", a:"Bei Konten ohne Vollmacht ja, sobald Beträge größer ca. 5.000 € abgewickelt werden. Mit notariellem Testament + Eröffnungsprotokoll oft kein Erbschein nötig (BGH-Rechtsprechung)."},
    {q:"Wer darf an Konten?", a:"Nur Erben (mit Erbschein) oder bevollmächtigte Personen (Bank- oder transmortale Vollmacht). Bestattungskosten dürfen meist auch ohne Erbschein vom Konto bezahlt werden."},
    {q:"Was passiert mit gemeinschaftlichen Konten?", a:"Bei Oder-Konten ist der überlebende Inhaber weiter verfügungsberechtigt. Das Guthaben fällt aber zur Hälfte in den Nachlass."},
    ...FAQ_GENERIC,
  ],
  vermieter: [
    {q:"Welche Frist gilt bei der Sonderkündigung?", a:"§ 580 BGB: Außerordentliche Kündigung mit gesetzlicher Frist (i.d.R. 3 Monate zum Monatsende). § 564 BGB: Erben treten in den Mietvertrag ein – Sonderkündigungsrecht innerhalb 1 Monat nach Kenntnis."},
    {q:"Wer übernimmt die Wohnung?", a:"Ehepartner/Lebenspartner, mit denen gemeinsam gewohnt wurde, treten automatisch ein. Andere Familienangehörige können beitreten – Vermieter muss innerhalb 1 Monat informiert werden."},
    {q:"Wer zahlt bis zur Räumung?", a:"Der Nachlass. Mietzahlungen aus dem Konto/Erbe – schnelle Kündigung minimiert Kosten. Falls überschuldeter Nachlass: Erbschaftsausschlagung prüfen!"},
    ...FAQ_GENERIC,
  ],
};

export function getFaq(taskId) {
  if (FAQ_DATA[taskId]) return FAQ_DATA[taskId];
  if (taskId?.startsWith("streaming_")) return [
    {q:"Wie schnell sollte ich kündigen?", a:"Sofort – jeden Tag laufen Kosten weiter. Online-Kündigung im Kundenkonto ist am schnellsten. Falls keine Zugangsdaten: Schreiben mit Sterbeurkunde per Post."},
    {q:"Bekomme ich bezahlte Beträge zurück?", a:"Ja – ab Todestag eingezogene Beträge müssen erstattet werden. Im Schreiben explizit fordern."},
    {q:"Was, wenn ich kein Passwort habe?", a:"Schriftliche Kündigung mit Sterbeurkunde-Kopie. Anbieter sind verpflichtet, Verträge nach Todesfall zu beenden."},
    ...FAQ_GENERIC,
  ];
  if (taskId?.startsWith("versicherung_")) return [
    {q:"Welche Versicherungen zahlen aus?", a:"Lebens- und Sterbegeldversicherungen zahlen die vereinbarte Summe. Bei BU mit Todesfall-Zusatz: zusätzliche Leistung möglich. Unfallversicherung bei Unfalltod (48h-Frist!)."},
    {q:"Wer ist Bezugsberechtigter?", a:"Der/die im Vertrag genannte Bezugsberechtigte – nicht zwingend der Erbe. Die Versicherung zahlt direkt an diesen, das Geld fällt nicht in den Nachlass."},
    {q:"Werden Prämien zurückerstattet?", a:"Bei Sachversicherungen (Hausrat, KFZ) anteilig ja. Lebensversicherungen werden mit der Auszahlung verrechnet."},
    ...FAQ_GENERIC,
  ];
  if (taskId === "internet" || taskId === "mobile") return [
    {q:"Welche Frist gilt?", a:"§ 314 BGB: Außerordentliche Kündigung zum nächstmöglichen Termin – Telekommunikationsverträge oft mit 1 Monat Frist."},
    {q:"Was, wenn der Vertrag noch lange läuft?", a:"Bei Telekommunikationsverträgen erlaubt § 314 BGB die außerordentliche Kündigung bei Tod ohne Restlaufzeit-Pflicht. Sterbeurkunde beilegen."},
    {q:"Müssen Geräte zurück?", a:"Ja, Router/SIM-Karten/Hardware muss zurückgesendet werden. Anbieter sendet meist Rücksendelabel zu."},
    ...FAQ_GENERIC,
  ];
  return FAQ_GENERIC;
}
