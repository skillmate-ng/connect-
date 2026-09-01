/* ================= Skill Mate — app logic ================= */
const CFG = window.SKILLMATE_CONFIG || {};
const SB = (CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && window.supabase)
  ? window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY) : null;
const MEDIA_API = (CFG.MEDIA_API || "").replace(/\/$/, "");

const STATES = {
  "Abia":[5.532,7.486],"Adamawa":[9.328,12.398],"Akwa Ibom":[5.008,7.851],"Anambra":[6.221,6.937],
  "Bauchi":[10.314,9.846],"Bayelsa":[4.771,6.070],"Benue":[7.336,8.740],"Borno":[11.833,13.151],
  "Cross River":[4.958,8.327],"Delta":[5.888,5.678],"Ebonyi":[6.324,8.113],"Edo":[6.335,5.603],
  "Ekiti":[7.719,5.311],"Enugu":[6.459,7.548],"FCT - Abuja":[9.058,7.494],"Gombe":[10.290,11.167],
  "Imo":[5.572,7.058],"Jigawa":[12.228,9.561],"Kaduna":[10.523,7.440],"Kano":[12.002,8.592],
  "Katsina":[12.988,7.617],"Kebbi":[12.454,4.199],"Kogi":[7.797,6.740],"Kwara":[8.497,4.542],
  "Lagos":[6.5244,3.3792],"Nasarawa":[8.540,8.318],"Niger":[9.930,5.598],"Ogun":[7.160,3.348],
  "Ondo":[7.250,5.195],"Osun":[7.756,4.556],"Oyo":[7.377,3.947],"Plateau":[9.897,8.858],
  "Rivers":[4.815,7.049],"Sokoto":[13.005,5.247],"Taraba":[8.888,11.360],"Yobe":[11.748,11.966],
  "Zamfara":[12.169,6.659]
};

const STATE_CITIES = {
  "Abia":["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obingwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"],
  "Adamawa":["Demsa", "Fufore", "Ganye", "Girei", "Gombi", "Guyuk", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo-Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"],
  "Akwa Ibom":["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"],
  "Anambra":["Aguata", "Awka North", "Awka South", "Anambra East", "Anambra West", "Anaocha", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"],
  "Bauchi":["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama’are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"],
  "Bayelsa":["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"],
  "Benue":["Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"],
  "Borno":["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"],
  "Cross River":["Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja", "Yakurr", "Yala"],
  "Delta":["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"],
  "Ebonyi":["Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"],
  "Edo":["Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba-Okha", "Oredo", "Orhionmwon", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde"],
  "Ekiti":["Ado-Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Gbonyin", "Ido-Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye"],
  "Enugu":["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo-Etiti", "Igbo-Eze North", "Igbo-Eze South", "Isi-Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Oji River", "Udenu", "Udi", "Uzo-Uwani"],
  "Gombe":["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"],
  "Imo":["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor-Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Onuimo", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West"],
  "Jigawa":["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kaugama", "Kazaure", "Kiri Kasama", "Kiyawa", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"],
  "Kaduna":["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema’a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"],
  "Kano":["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Danbatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"],
  "Katsina":["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin-Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai’Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"],
  "Kebbi":["Aleiro", "Arewa-Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Wasagu/Danko", "Yauri", "Zuru"],
  "Kogi":["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela-Odolu", "Ijumu", "Kabba-Bunu", "Kogi", "Lokoja", "Mopa-Muro", "Ofu", "Ogori-Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"],
  "Kwara":["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke-Ero", "Oyun", "Patigi"],
  "Lagos":["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
  "Nasarawa":["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa-Eggon", "Obi", "Toto", "Wamba"],
  "Niger":["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Munya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"],
  "Ogun":["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North", "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North-East", "Ijebu-Ode", "Ikenne", "Imeko-Afon", "Ipokia", "Obafemi-Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Sagamu"],
  "Ondo":["Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West", "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile-Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"],
  "Osun":["Atakunmosa East", "Atakunmosa West", "Aiyedaade", "Aiyedire", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Egbedore", "Ejigbo", "Ife Central", "Ife East", "Ife North", "Ife South", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Olorunda", "Oriade", "Orolu", "Osogbo"],
  "Oyo":["Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Ifelodun", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomoso North", "Ogbomoso South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona-Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere"],
  "Plateau":["Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua’an Pan", "Riyom", "Shendam", "Wase"],
  "Rivers":["Abua-Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme", "Emohua", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"],
  "Sokoto":["Binji", "Bodinga", "Dange-Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamakko", "Wurno", "Yabo"],
  "Taraba":["Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kurmi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"],
  "Yobe":["Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gulani", "Gujba", "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"],
  "Zamfara":["Anka", "Bakura", "Birnin Magaji", "Bukkuyum", "Bungudu", "Gummi", "Gusau", "Kaura-Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Tsafe", "Zurmi"],
  "FCT - Abuja":["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal (Abuja)"]
};
// Fills a <select id=citySelectId> with the cities for whatever state is
// currently chosen in <select id=stateSelectId>. Keeps the previous value
// selected if it still exists in the new list (useful when re-rendering).
function populateCities(stateSelectId, citySelectId, allowAll){
  const stateEl=$(stateSelectId), cityEl=$(citySelectId); if(!stateEl||!cityEl) return;
  const prev=cityEl.value;
  const cities=STATE_CITIES[stateEl.value]||[];
  const opts=(allowAll?[`<option value="">All cities</option>`]:[`<option value="">Select city / LGA</option>`])
    .concat(cities.map(c=>`<option value="${esc(c)}"${c===prev?" selected":""}>${esc(c)}</option>`))
    .concat([`<option value="__custom__">✏️ Type my own city / area</option>`]);
  cityEl.innerHTML=opts.join("");
  cityEl.onchange=function(){ if(this.value==="__custom__"){ const v=prompt("Type your city / area / LGA"); if(v&&v.trim()){ let o=[...this.options].find(x=>x.value===v.trim()); if(!o){o=document.createElement("option");o.value=v.trim();o.textContent=v.trim();this.insertBefore(o,this.lastElementChild);} this.value=v.trim(); } else this.value=prev||""; if(typeof renderBrowse==="function") renderBrowse(); }};
}

const SKILLS = [
  {n:"Hairdressing",e:"💇",g:"Beauty"},{n:"Barbering",e:"💈",g:"Beauty"},{n:"Make-up Artistry",e:"💄",g:"Beauty"},
  {n:"Nail Technology",e:"💅",g:"Beauty"},{n:"Phone Repair",e:"📱",g:"Tech"},{n:"Web Development",e:"💻",g:"Tech"},
  {n:"Software Development",e:"👨‍💻",g:"Tech"},{n:"Graphics Design",e:"🎨",g:"Tech"},{n:"UI/UX Design",e:"🖼️",g:"Tech"},
  {n:"Computer Training",e:"🖥️",g:"Tech"},{n:"Solar Installation",e:"🔆",g:"Tech"},
  {n:"Social Media Management",e:"📲",g:"Digital"},{n:"Content Creation",e:"🎥",g:"Digital"},
  {n:"Digital Marketing",e:"📈",g:"Digital"},{n:"Video Editing",e:"🎞️",g:"Digital"},
  {n:"Auto Mechanic",e:"🔧",g:"Handwork"},{n:"Panel Beating",e:"🚗",g:"Handwork"},{n:"Electrical Work",e:"⚡",g:"Handwork"},
  {n:"Plumbing",e:"🚿",g:"Handwork"},{n:"Welding & Fabrication",e:"🛠️",g:"Handwork"},{n:"Carpentry",e:"🪚",g:"Handwork"},
  {n:"Painting",e:"🖌️",g:"Handwork"},{n:"Tiling",e:"🧱",g:"Handwork"},{n:"POP & Ceiling",e:"🏠",g:"Handwork"},
  {n:"Aluminium Works",e:"🪟",g:"Handwork"},{n:"Generator Repair",e:"🔌",g:"Handwork"},
  {n:"AC & Fridge Repair",e:"❄️",g:"Handwork"},{n:"Fashion Design",e:"👗",g:"Fashion"},{n:"Tailoring",e:"🧵",g:"Fashion"},
  {n:"Shoe Making",e:"👟",g:"Fashion"},{n:"Bag Making",e:"👜",g:"Fashion"},{n:"Catering",e:"🍳",g:"Food"},
  {n:"Baking & Pastry",e:"🎂",g:"Food"},{n:"Bar & Restaurant",e:"🍽️",g:"Food"},{n:"Photography",e:"📸",g:"Creative"},
  {n:"Videography",e:"🎬",g:"Creative"},{n:"Music Production",e:"🎧",g:"Creative"},{n:"Event Planning",e:"🎉",g:"Creative"},
  {n:"Furniture Making",e:"🪑",g:"Handwork"},{n:"Building & Masonry",e:"🏗️",g:"Handwork"},
  {n:"Poultry & Farming",e:"🐔",g:"Agric"},{n:"Fish Farming",e:"🐟",g:"Agric"},{n:"Driving",e:"🚙",g:"Logistics"},
  {n:"Dispatch Rider",e:"🏍️",g:"Logistics"},{n:"Sales & Retail",e:"🛒",g:"Business"},
  {n:"Business / Company Owner",e:"🏢",g:"Business"},{n:"Tutoring",e:"📚",g:"Education"},
  {n:"Nursing Aide",e:"🩺",g:"Health"},{n:"Laundry & Dry Cleaning",e:"🧺",g:"Services"},
  {n:"Cleaning Services",e:"🧹",g:"Services"},{n:"Security",e:"🛡️",g:"Services"}
];

/* ---------- local store / offline fallback ---------- */
const LS = {
  get:(k,d)=>{try{return JSON.parse(localStorage.getItem("sm_"+k))??d}catch(e){return d}},
  set:(k,v)=>{
    try{ localStorage.setItem("sm_"+k,JSON.stringify(v)); return true; }
    catch(e){
      console.warn("localStorage quota exceeded while saving '"+k+"'", e);
      if(typeof toast==="function") toast("⚠️ Device storage is full. Your data may not be saved.");
      return false;
    }
  }
};
let DB = {
  users: LS.get("users",[]),
  requests: LS.get("requests",[]),
  applications: LS.get("applications",[]),
  saved: LS.get("saved",[]),
  reports: LS.get("reports",[]),
  reviews: LS.get("reviews",[]),
  verification_requests: LS.get("verification_requests",[]),
  featured_requests: LS.get("featured_requests",[]),
  messages: LS.get("messages",[]),
  referrals: LS.get("referrals",[]),
  withdrawals: LS.get("withdrawals",[]),
  announcements: LS.get("announcements",[])
};
const save = ()=>{Object.keys(DB).forEach(k=>LS.set(k,DB[k]))};
let ME = LS.get("me",null);

/* ---------- helpers ---------- */
const $ = id=>document.getElementById(id);
const uid = ()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36);
const esc = s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2600)}
function skillEmoji(n){const s=SKILLS.find(s=>s.n.toLowerCase()===String(n||"").toLowerCase());return s?s.e:"🧰"}
function strHash(s){let h=0;for(let i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))|0}return Math.abs(h)}
function km(a,b,c,d){const R=6371,p=Math.PI/180;const x=(c-a)*p,y=(d-b)*p;
  const h=Math.sin(x/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(y/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
function timeAgo(t){const s=(Date.now()-new Date(t))/1000;if(s<3600)return Math.max(1,~~(s/60))+"m ago";
  if(s<86400)return ~~(s/3600)+"h ago";return ~~(s/86400)+"d ago"}

/* ---------- form validation (catches typos before they get submitted) ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
function isValidEmail(e){ return EMAIL_RE.test(String(e||"").trim()); }
// Accepts 080..., 070..., 090..., 081... (11 digits starting with 0) or
// +234 followed by 10 digits — rejects anything too short/long or with letters.
function normalizePhone(p){ return String(p||"").replace(/[\s-]/g,""); }
function isValidPhone(p){
  const v=normalizePhone(p);
  return /^0\d{10}$/.test(v) || /^\+234\d{10}$/.test(v);
}

/* ---------- media upload ---------- */
async function fileToDataURL(f){return new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(f)})}
// Resizes/re-encodes an image before it ever reaches localStorage or the wire —
// this is what actually prevents the "exceeded the quota" crash, since a single
// uncompressed phone photo can be several MB and a signup requires one every time.
function compressImage(file,maxDim,quality){
  return new Promise((resolve)=>{
    if(!file.type||!file.type.startsWith("image")){ fileToDataURL(file).then(resolve); return; }
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        let {width,height}=img;
        if(width>maxDim||height>maxDim){ const s=maxDim/Math.max(width,height); width=Math.round(width*s); height=Math.round(height*s); }
        const canvas=document.createElement("canvas"); canvas.width=width; canvas.height=height;
        canvas.getContext("2d").drawImage(img,0,0,width,height);
        try{ resolve(canvas.toDataURL("image/jpeg",quality)); }
        catch(e){ resolve(reader.result); }
      };
      img.onerror=()=>resolve(reader.result);
      img.src=reader.result;
    };
    reader.onerror=()=>resolve(null);
    reader.readAsDataURL(file);
  });
}
async function uploadMedia(file){
  const isVideo = file.type && file.type.startsWith("video");
  if(isVideo && !MEDIA_API && file.size>8*1024*1024){
    toast("Video too large for this device —  to upload video.");
    return {url:"",type:file.type,id:uid()};
  }
  const compact = isVideo ? await fileToDataURL(file) : await compressImage(file,1000,0.72);
  if(MEDIA_API){
    try{
      const res = await fetch(MEDIA_API+"/api/media",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({filename:file.name,mime:file.type,data:compact,owner:ME?ME.id:"guest"})});
      if(res.ok){const j=await res.json();return {url:MEDIA_API+j.url,type:file.type,id:j.id}}
    }catch(e){console.warn("media server unavailable, using local copy",e)}
  }
  return {url:compact,type:file.type,id:uid()};
}
let PENDING = {media:[],avatar:null};
let PENDING_SIGNUP = null;
async function pickMedia(input,thumbId){
  const box=$(thumbId);
  for(const f of input.files){
    toast("Uploading "+f.name+"…");
    const m=await uploadMedia(f); PENDING.media.push(m);
    const el=document.createElement(m.type.startsWith("video")?"video":"img");
    el.src=m.url; if(el.tagName==="VIDEO"){el.muted=true;el.loop=true;el.play().catch(()=>{})}
    box.appendChild(el);
  }
  input.value="";
}
async function pickAvatar(input){
  const f=input.files[0]; if(!f)return;
  const m=await uploadMedia(f); PENDING.avatar=m.url; $("suAvatarPrev").src=m.url;
}

/* ---------- Supabase-or-local data layer ---------- */
async function apiCreateUser(u){
  if(SB){ const {error}=await SB.from("profiles").insert(u); if(error) throw error; }
  DB.users.push(u); save(); return u;
}
async function apiUpdateUser(id,patch){
  if(SB){ const {error}=await SB.from("profiles").update(patch).eq("id",id); if(error) throw error; }
  const u=DB.users.find(x=>x.id===id); if(u) Object.assign(u,patch);
  if(ME && ME.id===id){ Object.assign(ME,patch); LS.set("me",ME); }
  save();
}
async function apiLoadAll(){
  if(SB){
    const [{data:rq},{data:us},{data:ap},{data:rv},{data:vr},{data:fr},{data:ms},{data:rf},{data:wd},{data:al},{data:an}] = await Promise.all([
      SB.from("requests").select("*").order("created_at",{ascending:false}),
      SB.from("profiles").select("*"),
      SB.from("applications").select("*"),
      SB.from("reviews").select("*"),
      SB.from("verification_requests").select("*"),
      SB.from("featured_requests").select("*"),
      SB.from("messages").select("*").order("created_at",{ascending:true}),
      SB.from("referrals").select("*"),
      SB.from("withdrawals").select("*"),
      SB.from("activity_log").select("*").order("created_at",{ascending:false}),
      SB.from("announcements").select("*").order("created_at",{ascending:false})
    ]);
    if(rq) DB.requests = rq; if(us) DB.users = us; if(ap) DB.applications = ap;
    if(rv) DB.reviews = rv; if(vr) DB.verification_requests = vr; if(fr) DB.featured_requests = fr;
    if(ms) DB.messages = ms; if(rf) DB.referrals = rf; if(wd) DB.withdrawals = wd; if(al) DB.activity_log = al; if(an) DB.announcements = an;
    save();
  } else {
    // Refresh local data so changes appear immediately across open tabs.
    Object.keys(DB).forEach(k=>{ DB[k]=LS.get(k,DB[k]); });
  }
}
async function recordActivity(action,details={}){
  if(!ME)return;
  const row={id:uid(),user_id:ME.id,action,details,created_at:new Date().toISOString()};
  DB.activity_log=DB.activity_log||[];DB.activity_log.unshift(row);save();
  if(SB){const {error}=await SB.from("activity_log").insert(row);if(error)console.warn(error.message);}
}
async function apiInsert(table,row){
  if(SB){ const {error}=await SB.from(table).insert(row); if(error){console.warn(error);} }
  DB[table].push(row); save();
}
// Pulls this user's own profile back from storage — used so that admin actions
// (verifying a user, approving a withdrawal) are reflected in the logged-in
// session without requiring a fresh login. Cheap: one row (SB) or one local read.
async function refreshMe(){
  if(!ME) return;
  if(SB){
    const {data}=await SB.from("profiles").select("*").eq("id",ME.id).single();
    if(data){ ME=data; LS.set("me",ME); }
  } else {
    DB.users = LS.get("users", DB.users);
    const fresh=DB.users.find(u=>u.id===ME.id);
    if(fresh){ ME=fresh; LS.set("me",ME); }
  }
}

/* ================= VIEWS ================= */
const VIEWS=["landing","home","browse","nearby","post","auth","dashboard","settings","profile"];
function go(v,arg){
  if(!ME && ["browse","nearby","post","dashboard","settings","profile"].includes(v)){ if(v==="post"||v==="dashboard"||v==="settings"||v==="profile") return go("auth"); }
  VIEWS.forEach(x=>$("view-"+x).classList.toggle("hidden",x!==v));
  document.querySelectorAll(".bn-item").forEach(a=>a.classList.toggle("active",a.dataset.view===v));
  window.scrollTo({top:0,behavior:"smooth"});
  if(v==="browse") renderBrowse();
  if(v==="nearby") setTimeout(initMap,60);
  if(v==="dashboard"){ renderDashboard(); setTimeout(()=>{ checkClosePrompts(); checkPendingReviews(); },300); }
  if(v==="profile") renderProfile(arg);
  if(v==="settings") renderSettings();
  if(v==="post"){
    if(!ME){ toast("Log in to post a job"); return go("auth"); }
    if(!LS.get("guide_seen",false)) openGuideModal();
  }
}
function authTab(t){
  $("loginBox").classList.toggle("hidden",t!=="login");
  $("signupBox").classList.toggle("hidden",t==="login");
  $("tabLogin").classList.toggle("on",t==="login");
  $("tabSignup").classList.toggle("on",t!=="login");
}

/* ---------- auth ---------- */
async function signup(){
  const req={suName:"full name",suPhone:"phone",suEmail:"email",suPass:"password",suCity:"city",suSkill:"skill"};
  for(const k in req){ if(!$(k).value.trim()) return toast("Please enter your "+req[k]); }
  if(!isValidEmail($("suEmail").value)) return toast("Enter a valid email address (e.g. name@example.com)");
  if(!isValidPhone($("suPhone").value)) return toast("Enter a valid Nigerian phone number (e.g. 08012345678)");
  if($("suPass").value.length<6) return toast("Password must be 6+ characters");
  if(!PENDING.avatar) return toast("Please upload a profile picture");
  const email=$("suEmail").value.trim().toLowerCase();
  if(DB.users.some(u=>u.email===email)) return toast("Email already registered");
  const role=$("suRole").value;
  PENDING_SIGNUP={
    id:uid(), role, name:$("suName").value.trim(), phone:normalizePhone($("suPhone").value),
    email, password:$("suPass").value,
    state:$("suState").value, city:$("suCity").value.trim(), gender:$("suGender").value,
    dob:$("suDob").value, skill:$("suSkill").value.trim(), experience:$("suExp").value,
    business_name:$("suBiz").value.trim(), years:$("suYears").value, address:$("suAddr").value.trim(),
    bio:$("suBio").value.trim(), link:$("suLink").value.trim(), avatar:PENDING.avatar,
    is_content_creator:$("suCreator").checked,
    creator_platforms:$("suCreatorPlatforms").value.trim(),
    creator_followers:Number($("suCreatorFollowers").value||0),
    refer_code:makeReferCode(), referred_by:($("suRefCode")?$("suRefCode").value.trim().toUpperCase():"")||null,
    wallet_balance:0,
    verified:false, email_verified:false, status:"active", created_at:new Date().toISOString()
  };
  requestEmailCode(email);
}
/* ---------- email verification ---------- */
async function requestEmailCode(email){
  if(!MEDIA_API){
    openVerifyModal(email,"212121");
    return;
  }
  toast("Sending a verification code to "+email+"…");
  try{
    const res=await fetch(MEDIA_API+"/api/send-verification",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});
    const j=await res.json().catch(()=>({}));
    if(!res.ok) return toast(j.error||"Could not send verification code");
    openVerifyModal(email, j.devCode);
  }catch(e){ toast("Could not reach verification service. Please try again."); }
}
function openVerifyModal(email, devCode){
  $("modalRoot").innerHTML=`<div class="modal" onclick="if(event.target===this)cancelVerify()"><div class="panel" style="width:min(420px,94vw)">
    <div class="spread"><h2>Verify your email</h2><button class="btn ghost sm" onclick="cancelVerify()">✕</button></div>
    <p class="meta" style="margin:10px 0 16px">We sent a 6-digit code to <b>${esc(email)}</b>. Enter it below to finish creating your account.</p>
    
    <input id="vCode" maxlength="6" placeholder="123456" style="text-align:center;font-size:20px;letter-spacing:6px;margin-bottom:14px"/>
    <button class="btn block" onclick="confirmCode()">Verify &amp; create account</button>
    <button class="btn ghost block" style="margin-top:10px" onclick="requestEmailCode('${esc(email)}')">Resend code</button>
  </div></div>`;
}
function cancelVerify(){ closeModal(); PENDING_SIGNUP=null; }
async function confirmCode(){
  if(!PENDING_SIGNUP) return closeModal();
  const code=$("vCode").value.trim();
  if(!code) return toast("Enter the code we sent you");
  try{
    if(!MEDIA_API){ if(code!=="212121") return toast("Incorrect code, try again"); }
    else {
    const res=await fetch(MEDIA_API+"/api/verify-code",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email:PENDING_SIGNUP.email,code})});
    const j=await res.json().catch(()=>({}));
    if(!res.ok||!j.verified) return toast(j.error||"Incorrect code, try again");
    }
  }catch(e){ return toast("Could not reach verification service"); }
  closeModal();
  PENDING_SIGNUP.email_verified=true;
  await finalizeSignup();
}
async function finalizeSignup(){
  const u=PENDING_SIGNUP; if(!u) return;
  try{ await apiCreateUser(u); }catch(e){ return toast("Sign up failed: "+e.message) }
  if(u.referred_by) await creditReferrer(u.referred_by, u.id); recordActivity("account_created",{role:u.role});
  ME=u; LS.set("me",ME); PENDING={media:[],avatar:null}; PENDING_SIGNUP=null;
  toast("Welcome to Skill Mate, "+u.name.split(" ")[0]+"!");
  paintAuth(); go("dashboard"); loadChat(); checkForceAnnouncements(); updateAnnouncementBadge();
}
function login(){
  const e=$("liEmail").value.trim().toLowerCase(), p=$("liPass").value;
  const u=DB.users.find(u=>u.email===e && u.password===p);
  if(!u) return toast("Invalid email or password");
  if(u.status==="suspended"||u.status==="banned"||u.status==="deleted") return toast("This account is not active. Please contact Skill Mate support.");
  ME=u; LS.set("me",ME); paintAuth(); recordActivity("login"); toast("Logged in"); go("dashboard"); loadChat(); checkForceAnnouncements(); updateAnnouncementBadge();
}
function logout(){ ME=null; LS.set("me",null); paintAuth(); go("landing"); startLanding(); toast("Logged out"); if(window.DM_CLOSE) DM_CLOSE(); }
function paintAuth(){
  $("navAuth").innerHTML = ME
    ? `<span class="row" style="gap:8px;margin-left:8px"><button class="btn ghost sm" onclick="go('settings')">⚙ Settings</button><img class="avatar" src="${esc(ME.avatar)}" onclick="go('profile','${ME.id}')" title="${esc(ME.name)}"/><button class="btn ghost sm" onclick="logout()">Log out</button></span>`
    : `<button class="btn sm" style="margin-left:8px" onclick="go('auth')">Log in / Sign up</button>`;
}

/* ---------- edit profile ---------- */
let EDIT_AVATAR=null;
function openEditProfile(){
  if(!ME) return go("auth");
  EDIT_AVATAR=null;
  $("modalRoot").innerHTML=`<div class="modal" onclick="if(event.target===this)closeModal()"><div class="panel" style="width:min(560px,94vw)">
    <div class="spread"><h2>Edit profile</h2><button class="btn ghost sm" onclick="closeModal()">✕</button></div>
    <div class="form-grid" style="margin-top:12px">
      <div class="full row" style="gap:14px;align-items:center">
        <img id="epAvatarPrev" class="avatar" style="width:64px;height:64px" src="${esc(ME.avatar)}"/>
        <div><div class="upload" style="padding:8px 14px" onclick="document.getElementById('epAvatar').click()">Change photo</div>
        <input type="file" id="epAvatar" class="hidden" accept="image/*" onchange="pickEditAvatar(this)"/></div>
      </div>
      <div class="full"><label>Full name</label><input id="epName" value="${esc(ME.name)}"/></div>
      <div><label>Phone</label><input id="epPhone" value="${esc(ME.phone||"")}"/></div>
      <div><label>Business name</label><input id="epBiz" value="${esc(ME.business_name||"")}"/></div>
      <div><label>State</label><select id="epState" onchange="populateCities('epState','epCity')"></select></div>
      <div><label>City / Area</label><select id="epCity"></select></div>
      <div><label>Skill / Trade</label><input id="epSkill" list="skillList" value="${esc(ME.skill||"")}"/></div>
      <div><label>Experience</label><select id="epExp"><option${ME.experience==="Beginner"?" selected":""}>Beginner</option><option${ME.experience==="Intermediate"?" selected":""}>Intermediate</option><option${ME.experience==="Advanced"?" selected":""}>Advanced</option></select></div>
      <div class="full"><label>Link (portfolio / IG / WhatsApp)</label><input id="epLink" value="${esc(ME.link||"")}"/></div>
      <div class="full"><label>Bio</label><textarea id="epBio" rows="3">${esc(ME.bio||"")}</textarea></div>
      <div class="full row" style="align-items:center"><input type="checkbox" id="epCreator" style="width:auto" ${ME.is_content_creator?"checked":""}/><label for="epCreator" style="margin:0;text-transform:none">🎥 Content creator</label></div>
      <div><label>Creator platforms</label><input id="epCreatorPlatforms" value="${esc(ME.creator_platforms||"")}"/></div>
      <div><label>Audience / followers</label><input id="epCreatorFollowers" type="number" value="${Number(ME.creator_followers||0)}"/></div>
      <div class="full"><button class="btn block" onclick="saveEditProfile()">Save changes</button></div>
      <div class="full"><button class="btn danger block" onclick="deleteMyAccount()">Delete my account</button></div>
    </div>
  </div></div>`;
  const opts=Object.keys(STATES).map(s=>`<option${s===ME.state?" selected":""}>${s}</option>`).join("");
  $("epState").innerHTML=opts;
  populateCities("epState","epCity");
  if(ME.city) $("epCity").value=ME.city;
}
async function pickEditAvatar(input){
  const f=input.files[0]; if(!f) return;
  const m=await uploadMedia(f); EDIT_AVATAR=m.url; $("epAvatarPrev").src=m.url;
}
async function saveEditProfile(){
  const name=$("epName").value.trim(); if(!name) return toast("Name is required");
  const phone=$("epPhone").value.trim();
  if(phone && !isValidPhone(phone)) return toast("Enter a valid Nigerian phone number (e.g. 08012345678)");
  const patch={
    name, phone:phone?normalizePhone(phone):phone, business_name:$("epBiz").value.trim(),
    state:$("epState").value, city:$("epCity").value, skill:$("epSkill").value.trim(),
    experience:$("epExp").value, link:$("epLink").value.trim(), bio:$("epBio").value.trim(),
    is_content_creator:$("epCreator").checked, creator_platforms:$("epCreatorPlatforms").value.trim(),
    creator_followers:Number($("epCreatorFollowers").value||0)
  };
  if(EDIT_AVATAR) patch.avatar=EDIT_AVATAR;
  try{ await apiUpdateUser(ME.id,patch); }catch(e){ return toast("Could not save: "+e.message); }
  closeModal(); recordActivity("profile_updated",{fields:Object.keys(patch)}); toast("Profile updated"); paintAuth(); renderDashboard();
}

/* ---------- posting ---------- */
async function submitPost(){
  if(!ME) return go("auth");
  if(!$("pTitle").value.trim()||!$("pSkill").value.trim()||!$("pCity").value.trim())
    return toast("Title, skill and city are required");
  const phoneToUse=$("pPhone").value.trim()||ME.phone;
  if(phoneToUse && !isValidPhone(phoneToUse)) return toast("Enter a valid Nigerian phone number (e.g. 08012345678)");
  const st=$("pState").value, c=STATES[st]||[9.08,8.67];
  const r={
    id:uid(), user_id:ME.id, type:$("pType").value, skill:$("pSkill").value.trim(),
    title:$("pTitle").value.trim(), state:st, city:$("pCity").value.trim(),
    experience:$("pExp").value, slots:+$("pSlots").value||1, duration:$("pDuration").value.trim(),
    hours:$("pHours").value.trim(), accommodation:$("pAccom").value, meals:$("pMeals").value,
    pay:$("pPay").value.trim(), phone:normalizePhone(phoneToUse), link:$("pLink").value.trim(),
    description:$("pDesc").value.trim(), requirements:$("pReq").value.trim(),
    media:PENDING.media, lat:c[0]+(Math.random()-.5)*.25, lng:c[1]+(Math.random()-.5)*.25,
    hide_contact:$("pHideContact").checked, content_creator_opportunity:$("pCreatorOpportunity").checked, close_prompt_dismissed:false,
    featured:false, status:"active", created_at:new Date().toISOString()
  };
  await apiInsert("requests",r); recordActivity("listing_created",{request_id:r.id,title:r.title,type:r.type});
  PENDING={media:[],avatar:null}; $("pThumbs").innerHTML="";
  ["pTitle","pCity","pDuration","pHours","pPay","pLink","pDesc","pReq"].forEach(i=>$(i).value="");
  $("pHideContact").checked=false; $("pCreatorOpportunity").checked=false;
  toast("Job published 🎉"); renderAll(); go("browse");
}

/* ---------- cards ---------- */
function ownerOf(r){ return DB.users.find(u=>u.id===r.user_id) || {name:"Skill Mate User",avatar:"",verified:false} }
// Contact (phone/link) on a listing can be hidden by its owner. It's revealed to:
// the owner themselves, an admin, or an applicant that owner has already accepted.
function contactVisible(r){
  if(!r.hide_contact) return true;
  if(!ME) return false;
  if(ME.id===r.user_id || ME.role==="admin") return true;
  return DB.applications.some(a=>a.request_id===r.id && a.user_id===ME.id && a.status==="accepted");
}
function card(r){
  const o=ownerOf(r);
  const cover=(r.media||[]).find(m=>m.type&&m.type.startsWith("image"));
  const coverStyle = cover
    ? `background-image:linear-gradient(180deg,rgba(10,14,20,0) 55%,rgba(10,14,20,.45)),url('${esc(cover.url)}')`
    : `background:var(--grad)`;
  return `<article class="card">
    <div class="cover" style="${coverStyle}">
      ${cover?"":`<div style="position:absolute;inset:0;display:grid;place-items:center;font-size:44px;opacity:.9">${skillEmoji(r.skill)}</div>`}
      <div style="position:absolute;top:10px;left:10px" class="row">
        <span class="badge">${esc(r.type)}</span>${r.featured?'<span class="badge gold">★ Featured</span>':''}${r.content_creator_opportunity?'<span class="badge" style="background:rgba(155,89,255,.14);color:#8b5cf6">🎥 Creator</span>':''}
        ${o.is_owner?'<span class="badge gold">👑 Owner</span>':''}${o.verified?'<span class="badge gold">✔ Verified</span>':''}
        ${r.status==="cancelled"?'<span class="badge grey">Closed</span>':''}
      </div>
      <div class="badge grey" style="position:absolute;bottom:10px;right:10px;background:rgba(255,255,255,.92)">${skillEmoji(r.skill)} ${esc(r.skill)}</div>
    </div>
    <div class="body">
      <h3>${esc(r.title)}</h3>
      <div class="meta">📍 ${esc(r.city)}, ${esc(r.state)} • ${esc(r.experience)} accepted</div>
      <div class="row">
        <span class="badge grey">${skillEmoji(r.skill)} ${esc(r.skill)}</span>
        ${r.duration?`<span class="badge grey">⏳ ${esc(r.duration)}</span>`:""}
        <span class="badge grey">🏠 Accom: ${esc(r.accommodation)}</span>
        <span class="badge grey">🍲 Meals: ${esc(r.meals)}</span>
      </div>
      <p class="meta" style="margin:0">${esc((r.description||"").slice(0,110))}${(r.description||"").length>110?"…":""}</p>
      <div class="spread" style="margin-top:auto">
        <span class="meta">${timeAgo(r.created_at)}</span>
        <span class="row"><button class="btn ghost sm" onclick="toggleSave('${r.id}')">${isSaved(r.id)?"★ Saved":"☆ Save"}</button>
        ${ME&&ME.id!==r.user_id?`<button class="btn ghost sm" onclick="openListingChat('${r.id}')">💬 Chat</button>`:""}
        <button class="btn sm" onclick="openRequest('${r.id}')">View & Apply</button></span>
      </div>
    </div></article>`;
}
function isSaved(id){ return ME && DB.saved.some(s=>s.user_id===ME.id&&s.request_id===id) }
function toggleSave(id){
  if(!ME) return go("auth");
  const i=DB.saved.findIndex(s=>s.user_id===ME.id&&s.request_id===id);
  if(i>-1){DB.saved.splice(i,1);toast("Removed from saved")}else{DB.saved.push({user_id:ME.id,request_id:id});toast("Saved ★")}
  save(); renderAll();
}

/* ---------- modal: request detail + apply ---------- */
function openRequest(id){
  const r=DB.requests.find(x=>x.id===id); if(!r)return; const o=ownerOf(r);
  const isOwner = !!(ME && ME.id===r.user_id);
  const media=(r.media||[]).map(m=>m.type&&m.type.startsWith("video")
    ? `<video src="${esc(m.url)}" controls style="width:150px;height:110px;border-radius:12px;object-fit:cover"></video>`
    : `<img src="${esc(m.url)}" style="width:150px;height:110px;border-radius:12px;object-fit:cover"/>`).join("");
  $("modalRoot").innerHTML=`<div class="modal" onclick="if(event.target===this)closeModal()"><div class="panel">
    <div class="spread"><h2>${esc(r.title)}</h2><button class="btn ghost sm" onclick="closeModal()">✕</button></div>
    <div class="row" style="margin:12px 0">
      <span class="badge">${esc(r.type)}</span><span class="badge grey">${skillEmoji(r.skill)} ${esc(r.skill)}</span>
      <span class="badge grey">${esc(r.experience)}</span><span class="badge grey">📍 ${esc(r.city)}, ${esc(r.state)}</span>
      ${o.is_owner?'<span class="badge gold">👑 Skill Mate Owner</span>':(o.verified?'<span class="badge gold">✔ Verified business</span>':'<span class="badge red">Not yet verified</span>')}
    </div>
    <div class="row" style="gap:14px;align-items:center;background:var(--surface-2);padding:12px;border-radius:14px">
      <img class="avatar" style="width:52px;height:52px" src="${esc(o.avatar||'')}"/>
      <div><b>${esc(o.business_name||o.name)}</b><div class="meta">${esc(o.name)} • ${esc(o.city||"")} ${esc(o.state||"")}</div></div>
      <a class="btn ghost sm" style="margin-left:auto" onclick="closeModal();go('profile','${o.id}')">View profile</a>
    </div>
    <div class="form-grid" style="margin-top:16px">
      <div><label>Slots</label><div>${r.slots}</div></div>
      <div><label>Duration</label><div>${esc(r.duration||"—")}</div></div>
      <div><label>Working hours</label><div>${esc(r.hours||"—")}</div></div>
      <div><label>Stipend / Pay</label><div>${esc(r.pay||"—")}</div></div>
      <div><label>Accommodation</label><div>${esc(r.accommodation)}</div></div>
      <div><label>Meals</label><div>${esc(r.meals)}</div></div>
      <div class="full"><label>Description</label><div>${esc(r.description||"—")}</div></div>
      <div class="full"><label>Requirements</label><div>${esc(r.requirements||"—")}</div></div>
      <div><label>Phone</label><div>${!ME?"Log in to view":contactVisible(r)?esc(r.phone||"—"):"🔒 Hidden until you're accepted"}</div></div>
      <div><label>Link</label><div>${!contactVisible(r)?"🔒 Hidden until you're accepted":(r.link?`<a style="color:var(--primary-2)" target="_blank" href="${esc(r.link)}">${esc(r.link)}</a>`:"—")}</div></div>
      ${media?`<div class="full"><label>Photos & videos</label><div class="row">${media}</div></div>`:""}
    </div>
    <hr style="border:0;border-top:1px solid var(--line);margin:20px 0"/>
    ${isOwner ? `
    <div class="panel" style="background:var(--surface-2)">
      <b>This is your own listing.</b>
      <p class="meta" style="margin-top:6px">You can't apply to your own request. Manage it, review applicants, or cancel it from your <a style="color:var(--primary-2)" onclick="closeModal();go('dashboard')">dashboard</a>.</p>
    </div>` : `
    <h3>Apply for this opportunity</h3>
    <div class="form-grid" style="margin-top:10px">
      <div class="full"><label>Message to the business</label><textarea id="apMsg" rows="3" placeholder="Why you want this, what you already know..."></textarea></div>
      <div><label>Your phone</label><input id="apPhone" value="${ME?esc(ME.phone):""}"/></div>
      <div><label>Your link (portfolio / IG / WhatsApp)</label><input id="apLink" value="${ME?esc(ME.link||""):""}"/></div>
      <div class="full"><label>Attach photos / videos of your work</label>
        <div class="upload" onclick="document.getElementById('apMedia').click()">📎 Upload proof of work</div>
        <input type="file" id="apMedia" class="hidden" multiple accept="image/*,video/*" onchange="pickMedia(this,'apThumbs')"/>
        <div class="thumbs" id="apThumbs"></div></div>
      <div class="full row"><button class="btn" onclick="apply('${r.id}')">Send application</button>
        <button class="btn ghost" onclick="openListingChat('${r.id}')">💬 Chat owner</button>
        <button class="btn ghost" onclick="report('${r.id}')">🚩 Report listing</button></div>
    </div>`}
  </div></div>`;
}
function closeModal(){ $("modalRoot").innerHTML=""; PENDING.media=[] }
async function apply(rid){
  if(!ME) { closeModal(); return go("auth") }
  const r=DB.requests.find(x=>x.id===rid);
  if(r && r.user_id===ME.id) { closeModal(); return toast("You can't apply to your own listing"); }
  if(!$("apMsg").value.trim()) return toast("Write a short message");
  const a={id:uid(),request_id:rid,user_id:ME.id,message:$("apMsg").value.trim(),
    phone:$("apPhone").value.trim(),link:$("apLink").value.trim(),media:PENDING.media,
    status:"pending",created_at:new Date().toISOString()};
  await apiInsert("applications",a); recordActivity("application_sent",{request_id:rid}); recordActivity("application_sent",{request_id:rid}); recordActivity("application_sent",{request_id:rid});
  PENDING.media=[]; closeModal(); toast("Application sent ✅");
}
async function report(rid){
  const reason=prompt("Why are you reporting this listing?"); if(!reason)return;
  await apiInsert("reports",{id:uid(),request_id:rid,user_id:ME?ME.id:null,reason,status:"open",created_at:new Date().toISOString()}); recordActivity("listing_reported",{request_id:rid}); recordActivity("listing_reported",{request_id:rid}); recordActivity("listing_reported",{request_id:rid});
  toast("Reported. Our admins will review it.");
}

/* ---------- new-listing guide (skippable, shown once per device) ---------- */
const GUIDE_STEPS=[
  {t:"Use a clear, specific title",c:"Instead of \u201cNeed worker\u201d, try \u201cPhone Repair Apprentice Wanted \u2013 Ikeja\u201d. Specific titles get far more genuine applicants than vague ones."},
  {t:"Be upfront about pay & duration",c:"State the stipend/pay, working hours and how long the role lasts. Listings with real numbers are trusted faster and waste less of your time."},
  {t:"Add real photos",c:"Upload actual photos of your shop, workspace or past work instead of leaving it empty. Real photos make a listing feel genuine and get more replies."},
  {t:"List clear requirements",c:"Say who you're looking for \u2014 age, experience level, location \u2014 so only serious, qualified people apply."},
  {t:"Respond quickly & honestly",c:"Accept or reject applications promptly. Fast, honest responses are exactly what earns you the good reviews that lead to a verified badge."}
];
let GUIDE_STEP=0;
function openGuideModal(){ GUIDE_STEP=0; renderGuideModal(); }
function renderGuideModal(){
  const s=GUIDE_STEPS[GUIDE_STEP], last=GUIDE_STEP===GUIDE_STEPS.length-1;
  $("modalRoot").innerHTML=`<div class="modal" onclick="if(event.target===this)closeGuide()"><div class="panel" style="width:min(480px,94vw)">
    <div class="spread"><span class="badge">Guide ${GUIDE_STEP+1}/${GUIDE_STEPS.length}</span><button class="btn ghost sm" onclick="closeGuide()">Skip ✕</button></div>
    <h2 style="margin:16px 0 8px">${esc(s.t)}</h2>
    <p class="meta" style="font-size:14.5px;line-height:1.65">${esc(s.c)}</p>
    <div class="row" style="margin-top:22px;justify-content:space-between">
      <button class="btn ghost sm" ${GUIDE_STEP===0?"disabled":""} onclick="guideNav(-1)">← Back</button>
      <button class="btn sm" onclick="guideNav(1)">${last?"Got it, let's post →":"Next →"}</button>
    </div>
  </div></div>`;
}
function guideNav(d){
  if(d>0 && GUIDE_STEP===GUIDE_STEPS.length-1) return closeGuide();
  GUIDE_STEP=Math.min(GUIDE_STEPS.length-1,Math.max(0,GUIDE_STEP+d)); renderGuideModal();
}
function closeGuide(){ LS.set("guide_seen",true); closeModal(); }

/* ---------- post-application reviews (feed verified-badge eligibility) ---------- */
function pendingReviewsForMe(){
  if(!ME) return [];
  const ONE_DAY=24*60*60*1000;
  return DB.applications.filter(a=>a.user_id===ME.id
    && (Date.now()-new Date(a.created_at).getTime())>=ONE_DAY
    && !DB.reviews.some(rv=>rv.application_id===a.id && rv.reviewer_id===ME.id));
}
function checkPendingReviews(){ const list=pendingReviewsForMe(); if(list.length) openReviewModal(list[0]); }
let REVIEW_TARGET=null, RV_RATING=0;
function openReviewModal(a){
  REVIEW_TARGET=a; RV_RATING=0;
  const r=DB.requests.find(x=>x.id===a.request_id)||{title:"that listing",user_id:null};
  const o=DB.users.find(x=>x.id===r.user_id)||{name:"the person you applied to"};
  $("modalRoot").innerHTML=`<div class="modal"><div class="panel" style="width:min(460px,94vw)">
    <h2>How did it go with ${esc(o.business_name||o.name)}?</h2>
    <p class="meta" style="margin:8px 0 16px">You applied to "${esc(r.title)}" about a day ago. A quick, honest review helps other job seekers \u2014 and helps good businesses and apprentices earn their verified badge.</p>
    <div id="starPick" class="row" style="gap:6px;font-size:30px;margin-bottom:14px;cursor:pointer">
      ${[1,2,3,4,5].map(n=>`<span data-n="${n}" onclick="pickStar(${n})">☆</span>`).join("")}
    </div>
    <textarea id="rvComment" rows="3" placeholder="Optional: what was your experience?"></textarea>
    <div class="row" style="margin-top:14px;justify-content:space-between">
      <button class="btn ghost sm" onclick="closeModal()">Maybe later</button>
      <button class="btn sm" onclick="submitReview()">Submit review</button>
    </div>
  </div></div>`;
}
function pickStar(n){ RV_RATING=n; document.querySelectorAll("#starPick span").forEach((el,i)=>el.textContent=i<n?"★":"☆"); }
async function submitReview(){
  if(!RV_RATING) return toast("Please pick a star rating");
  const a=REVIEW_TARGET; const r=DB.requests.find(x=>x.id===a.request_id);
  const rv={id:uid(),application_id:a.id,request_id:a.request_id,reviewer_id:ME.id,reviewee_id:r?r.user_id:null,
    rating:RV_RATING,comment:$("rvComment").value.trim(),created_at:new Date().toISOString()};
  await apiInsert("reviews",rv);
  closeModal(); toast("Thanks for your review!");
  setTimeout(checkPendingReviews,400);
}

/* ---------- cancel listing + "still need this?" day-after popup ---------- */
function closePromptCandidates(){
  if(!ME) return [];
  const ONE_DAY=24*60*60*1000;
  return DB.requests.filter(r=>r.user_id===ME.id && r.status==="active" && !r.close_prompt_dismissed &&
    DB.applications.some(a=>a.request_id===r.id && (Date.now()-new Date(a.created_at).getTime())>=ONE_DAY));
}
function checkClosePrompts(){ const list=closePromptCandidates(); if(list.length) openClosePrompt(list[0]); }
function openClosePrompt(r){
  $("modalRoot").innerHTML=`<div class="modal"><div class="panel" style="width:min(440px,94vw)">
    <h2>Still need "${esc(r.title)}"?</h2>
    <p class="meta" style="margin:8px 0 18px">It's been a day since someone applied. If you've already found who you need, close the listing so others stop applying.</p>
    <div class="row" style="justify-content:flex-end">
      <button class="btn ghost sm" onclick="dismissClosePrompt('${r.id}')">Keep it open</button>
      <button class="btn danger sm" onclick="cancelListing('${r.id}',true)">Yes, close listing</button>
    </div>
  </div></div>`;
}
async function dismissClosePrompt(id){
  const r=DB.requests.find(x=>x.id===id);
  if(r){ r.close_prompt_dismissed=true; save(); if(SB) await SB.from("requests").update({close_prompt_dismissed:true}).eq("id",id); }
  closeModal(); setTimeout(checkClosePrompts,300);
}
async function cancelListing(id,fromPrompt){
  const r=DB.requests.find(x=>x.id===id); if(!r) return;
  if(!fromPrompt && !confirm("Cancel this listing? It will no longer be visible to applicants.")) return;
  r.status="cancelled"; r.close_prompt_dismissed=true; save();
  if(SB) await SB.from("requests").update({status:"cancelled",close_prompt_dismissed:true}).eq("id",id);
  toast("Listing cancelled"); closeModal(); renderAll(); renderDashboard();
  setTimeout(checkClosePrompts,300);
}

/* ---------- verification (verified badge) ---------- */
// Manual bank-transfer payment: no payment gateway. Users pay this exact
// account, upload a receipt, and an admin confirms it in the console.
const PAY_BANK = { bank:"Moniepoint", account_number:"5097550936", account_name:"Fortune ukadike chinazaekpere" };
function paymentInstructionsHTML(amount){
  return `<div class="panel" style="background:var(--surface-2);margin-bottom:14px">
    <div class="spread" style="margin-bottom:8px"><b>Bank transfer details</b><span class="badge gold">Send exactly ₦${amount.toLocaleString("en-NG")}</span></div>
    <div class="meta" style="line-height:1.9">
      Bank name: <b>${esc(PAY_BANK.bank)}</b><br>
      Account number: <b>${esc(PAY_BANK.account_number)}</b><br>
      Account name: <b>${esc(PAY_BANK.account_name)}</b>
    </div>
    <p class="meta" style="margin-top:8px;font-size:12.5px">Transfer the exact amount above, then upload your receipt below. An admin confirms it and approves your application — usually within 1–2 days.</p>
  </div>`;
}
let PENDING_RECEIPT=null;
async function pickReceipt(input, thumbId){
  const f=input.files[0]; if(!f) return;
  toast("Uploading receipt…");
  const m=await uploadMedia(f);
  PENDING_RECEIPT=m.url;
  $(thumbId).innerHTML=`<img src="${esc(m.url)}"/>`;
}
function receiptUploadHTML(inputId, thumbId){
  return `<div class="full"><label>Upload payment receipt</label>
    <div class="upload" onclick="document.getElementById('${inputId}').click()">🧾 Click to upload your receipt (screenshot or photo)</div>
    <input type="file" id="${inputId}" class="hidden" accept="image/*" onchange="pickReceipt(this,'${thumbId}')"/>
    <div class="thumbs" id="${thumbId}"></div>
  </div>`;
}
function successfulUses(u){
  return DB.applications.filter(a=>a.status==="accepted" &&
    (a.user_id===u.id || (DB.requests.find(r=>r.id===a.request_id)||{}).user_id===u.id)).length;
}
function goodReviews(u){ return DB.reviews.filter(r=>r.reviewee_id===u.id && r.rating>=4).length }
function myVerificationRequest(){
  return DB.verification_requests.filter(v=>v.user_id===ME.id).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))[0];
}
function verificationPanel(){
  const uses=successfulUses(ME), good=goodReviews(ME), req=myVerificationRequest(), usesOk=uses>=2;
  if(ME.verified) return `<div class="panel" style="margin-bottom:20px;border-color:rgba(255,180,0,.4)">
    <div class="row" style="gap:10px"><span class="badge gold">✔ Verified</span><span class="meta">Your account is verified. Thanks for being trusted on Skill Mate!</span></div></div>`;
  if(req && req.status==="pending") return `<div class="panel" style="margin-bottom:20px">
    <div class="spread"><h3>Verification application submitted</h3><span class="badge gold">Pending review</span></div>
    <p class="meta" style="margin-top:8px">We're reviewing your receipt and details. This usually takes 1–2 days.</p></div>`;
  if(req && req.status==="rejected") return `<div class="panel" style="margin-bottom:20px">
    <div class="spread"><h3>Verification</h3><span class="badge red">Not approved</span></div>
    <p class="meta" style="margin-top:8px">${esc(req.admin_note||"Your last application wasn't approved.")}</p>
    <button class="btn sm" style="margin-top:10px" ${usesOk?"":"disabled"} onclick="openVerifyBadgeModal()">Apply again</button></div>`;
  return `<div class="panel" style="margin-bottom:20px">
    <h3>Get the verified badge ✔</h3>
    <p class="meta" style="margin:8px 0 12px">Verified accounts stand out and get more trust from applicants and businesses.</p>
    <div class="row" style="gap:22px;margin-bottom:12px">
      <div><b style="font-family:Sora;font-size:20px">${uses}/2</b><div class="meta">Successful uses</div></div>
      <div><b style="font-family:Sora;font-size:20px">${good}/2</b><div class="meta">Good reviews (4★+)</div></div>
    </div>
    ${usesOk?`<button class="btn sm" onclick="openVerifyBadgeModal()">Apply for verification — ₦3,999</button>`
      :`<button class="btn ghost sm" disabled>Apply for verification (need ${2-uses} more successful use${2-uses===1?"":"s"})</button>`}
  </div>`;
}
function openVerifyBadgeModal(){
  if(successfulUses(ME)<2) return toast("You need 2 successful uses of Skill Mate before applying");
  PENDING_RECEIPT=null;
  $("modalRoot").innerHTML=`<div class="modal" onclick="if(event.target===this)closeModal()"><div class="panel" style="width:min(500px,94vw)">
    <div class="spread"><h2>Apply for Verification</h2><button class="btn ghost sm" onclick="closeModal()">✕</button></div>
    <p class="meta" style="margin:8px 0 16px">Fill in your details below, pay the exact fee by bank transfer, then upload your receipt.</p>
    <div class="form-grid">
      <div class="full"><label>Full legal name</label><input id="vFullName" value="${esc(ME.name)}"/></div>
      <div><label>ID type</label><select id="vIdType"><option>NIN</option><option>Voter's Card</option><option>Driver's License</option><option>International Passport</option></select></div>
      <div><label>ID number</label><input id="vIdNumber" placeholder="e.g. 12345678901"/></div>
      <div class="full"><label>Address</label><input id="vAddress" placeholder="Current residential/business address"/></div>
      <div class="full">${paymentInstructionsHTML(3999)}</div>
      ${receiptUploadHTML("vReceipt","vReceiptThumb")}
      <div class="full"><label>Payment reference (optional)</label><input id="vPayRef" placeholder="Transaction ID, if you have one"/></div>
      <div class="full"><button class="btn block" onclick="submitVerificationApp()">Submit application</button></div>
    </div>
  </div></div>`;
}
async function submitVerificationApp(){
  const fullName=$("vFullName").value.trim(), idNumber=$("vIdNumber").value.trim(), address=$("vAddress").value.trim();
  if(!fullName||!idNumber||!address) return toast("Please fill in all your details");
  if(!PENDING_RECEIPT) return toast("Please upload your payment receipt");
  const v={id:uid(),user_id:ME.id,full_name:fullName,id_type:$("vIdType").value,id_number:idNumber,address,
    payment_ref:$("vPayRef").value.trim(),receipt_url:PENDING_RECEIPT,amount:3999,status:"pending",created_at:new Date().toISOString()};
  await apiInsert("verification_requests",v);
  PENDING_RECEIPT=null; closeModal(); toast("Verification application submitted!"); renderDashboard();
}

/* ---------- referrals + wallet ---------- */
const NG_BANKS = [
  "Access Bank","Citibank Nigeria","Ecobank Nigeria","Fidelity Bank","First Bank of Nigeria",
  "First City Monument Bank (FCMB)","Globus Bank","Guaranty Trust Bank (GTBank)","Heritage Bank",
  "Jaiz Bank","Keystone Bank","Optimus Bank","Parallex Bank","Polaris Bank","Premium Trust Bank",
  "Providus Bank","Signature Bank","Stanbic IBTC Bank","Standard Chartered Bank Nigeria","Sterling Bank",
  "SunTrust Bank","TAJ Bank","Titan Trust Bank","Union Bank of Nigeria","United Bank for Africa (UBA)",
  "Unity Bank","Wema Bank","Zenith Bank",
  "ALAT by Wema (Online Bank)","Carbon (Online Bank)","Eyowo MFB (Online Bank)","FairMoney MFB (Online Bank)",
  "GoMoney (Online Bank)","Kuda Bank (Online Bank)","Mint MFB / Mintyn (Online Bank)","Moniepoint MFB (Online Bank)",
  "Opay (Online Bank)","Paga (Online Bank)","PalmPay (Online Bank)","Renmoney MFB (Online Bank)",
  "Rubies MFB (Online Bank)","Sparkle Microfinance Bank (Online Bank)","VFD Microfinance Bank (Online Bank)",
  "9PSB — 9Payment Service Bank (Online Bank)"
];
function makeReferCode(){ return "SM"+Math.random().toString(36).slice(2,7).toUpperCase(); }
function referralLink(){ return location.origin+location.pathname+"?ref="+encodeURIComponent(ME.refer_code||""); }
function myReferrals(){ return DB.referrals.filter(r=>r.referrer_id===ME.id); }
function walletBalance(){ return Number(ME.wallet_balance||0); }
function copyReferral(){
  const msg=`Join me on Skill Mate 🇳🇬 — Nigeria's marketplace for jobs & apprentices! Sign up with my referral link and let's both win: ${referralLink()}`;
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(msg).then(()=>toast("Referral message copied — paste it anywhere!"))
      .catch(()=>toast("Couldn't copy — here's your link: "+referralLink()));
  } else toast("Here's your link: "+referralLink());
}
function referralPanel(){
  const refs=myReferrals(), bal=walletBalance();
  return `<div class="panel" style="margin-bottom:20px">
    <div class="spread"><h3>Refer &amp; Earn 🎁</h3><span class="badge gold">₦${bal.toFixed(0)} balance</span></div>
    <p class="meta" style="margin:8px 0 12px">Share your personal referral code with friends — you earn <b>₦10</b> for every person who signs up with it. You can withdraw once your balance reaches <b>₦100</b>.</p>
    <div class="row" style="gap:22px;margin-bottom:12px">
      <div><b style="font-family:Sora;font-size:20px">${esc(ME.refer_code||"—")}</b><div class="meta">Your referral code</div></div>
      <div><b style="font-family:Sora;font-size:20px">${refs.length}</b><div class="meta">People referred</div></div>
    </div>
    <div class="row">
      <button class="btn ghost sm" onclick="copyReferral()">📋 Copy referral message</button>
      <button class="btn sm" ${bal>=100?"":"disabled"} onclick="openWithdrawModal()">💸 ${bal>=100?"Withdraw":"Withdraw (need ₦"+(100-bal).toFixed(0)+" more)"}</button>
    </div>
  </div>`;
}
async function creditReferrer(code, newUserId){
  if(!code) return;
  const referrer=DB.users.find(u=>u.refer_code===code);
  if(!referrer || referrer.id===newUserId) return;
  const bal=Number(referrer.wallet_balance||0)+10;
  referrer.wallet_balance=bal; save();
  const r={id:uid(),referrer_id:referrer.id,referred_id:newUserId,amount:10,created_at:new Date().toISOString()};
  await apiInsert("referrals",r);
  if(SB) await SB.from("profiles").update({wallet_balance:bal}).eq("id",referrer.id);
}
function openWithdrawModal(){
  const bal=walletBalance();
  if(bal<100) return toast("You need at least ₦100 to withdraw");
  $("modalRoot").innerHTML=`<div class="modal" onclick="if(event.target===this)closeModal()"><div class="panel" style="width:min(460px,94vw)">
    <div class="spread"><h2>Withdraw earnings</h2><button class="btn ghost sm" onclick="closeModal()">✕</button></div>
    <p class="meta" style="margin:8px 0 16px">Available balance: <b>₦${bal.toFixed(0)}</b>. Minimum withdrawal is ₦100.</p>
    <div class="form-grid">
      <div class="full"><label>Amount to withdraw (₦)</label><input id="wAmount" type="number" min="100" max="${bal}" value="${bal}"/></div>
      <div class="full"><label>Bank</label><select id="wBank">${NG_BANKS.map(b=>`<option>${esc(b)}</option>`).join("")}</select></div>
      <div><label>Account number</label><input id="wAcctNo" maxlength="10" placeholder="0123456789"/></div>
      <div><label>Account name</label><input id="wAcctName" placeholder="As it appears on your account"/></div>
      <div class="full"><button class="btn block" onclick="submitWithdrawal()">Submit withdrawal request</button></div>
    </div>
  </div></div>`;
}
async function submitWithdrawal(){
  const amt=Math.floor(+$("wAmount").value||0), bank=$("wBank").value,
    acctNo=$("wAcctNo").value.trim(), acctName=$("wAcctName").value.trim();
  const bal=walletBalance();
  if(amt<100) return toast("Minimum withdrawal is ₦100");
  if(amt>bal) return toast("You can't withdraw more than your balance");
  if(!acctNo||acctNo.length<10) return toast("Enter a valid 10-digit account number");
  if(!acctName) return toast("Enter the account name");
  const w={id:uid(),user_id:ME.id,amount:amt,bank_name:bank,account_number:acctNo,account_name:acctName,
    status:"pending",created_at:new Date().toISOString()};
  await apiInsert("withdrawals",w);
  ME.wallet_balance=bal-amt; LS.set("me",ME);
  const idx=DB.users.findIndex(u=>u.id===ME.id); if(idx>-1) DB.users[idx].wallet_balance=ME.wallet_balance;
  save();
  if(SB) await SB.from("profiles").update({wallet_balance:ME.wallet_balance}).eq("id",ME.id);
  closeModal(); toast("Withdrawal requested — we'll process it within 1-2 business days.");
  renderDashboard();
}

/* ---------- get featured (per-listing, open to everyone) ---------- */
let FEATURE_TARGET=null;
function openFeatureModal(rid){
  FEATURE_TARGET=rid; const r=DB.requests.find(x=>x.id===rid); if(!r) return;
  PENDING_RECEIPT=null;
  $("modalRoot").innerHTML=`<div class="modal" onclick="if(event.target===this)closeModal()"><div class="panel" style="width:min(460px,94vw)">
    <div class="spread"><h2>Get Featured</h2><button class="btn ghost sm" onclick="closeModal()">✕</button></div>
    <p class="meta" style="margin:8px 0 16px">Feature "${esc(r.title)}" at the top of Browse and Home. Anyone can apply — verification isn't required.</p>
    ${paymentInstructionsHTML(1999)}
    ${receiptUploadHTML("fReceipt","fReceiptThumb")}
    <label style="display:block;margin-top:14px">Payment reference (optional)</label>
    <input id="featPayRef" placeholder="Transaction ID, if you have one" style="width:100%;margin:6px 0 16px"/>
    <button class="btn block" onclick="submitFeatureApp()">Submit for review</button>
  </div></div>`;
}
async function submitFeatureApp(){
  if(!PENDING_RECEIPT) return toast("Please upload your payment receipt");
  const ref=$("featPayRef").value.trim();
  const f={id:uid(),request_id:FEATURE_TARGET,user_id:ME.id,payment_ref:ref,receipt_url:PENDING_RECEIPT,amount:1999,status:"pending",created_at:new Date().toISOString()};
  await apiInsert("featured_requests",f);
  PENDING_RECEIPT=null; closeModal(); toast("Submitted! We'll feature your listing once payment is confirmed."); renderDashboard();
}

/* ---------- renderers ---------- */
function activeRequests(){ return DB.requests.filter(r=>r.status!=="removed"&&r.status!=="cancelled") }
function renderHome(){
  $("skillGrid").innerHTML=SKILLS.slice(0,18).map(s=>{
    const c=activeRequests().filter(r=>r.skill===s.n).length;
    return `<div class="skill" onclick="$('fSkill').value='${s.n}';go('browse')">
      <div class="thumb" style="background:linear-gradient(135deg,rgba(47,94,255,.14),rgba(0,194,168,.14));display:grid;place-items:center;font-size:26px">${s.e}</div>
      <div class="info"><b>${s.n}</b><span>${c} job${c===1?"":"s"} open</span></div></div>`}).join("");
  const l=activeRequests().slice(0,6);
  $("latestGrid").innerHTML = l.length?l.map(card).join(""):`<div class="empty">No opportunities yet — be the first to post one.</div>`;
  $("sOpps").textContent=activeRequests().length; $("sBiz").textContent=DB.users.filter(u=>u.role==="business").length;
  $("sSkills").textContent=SKILLS.length;
}
function heroSearch(){ $("fSkill").value=$("hSkill").value; $("fState").value=$("hState").value; populateCities("fState","fCity",true); go("browse") }
/* Small Levenshtein distance — used so a typo like "hairdresing" or "fone repair"
   still finds "Hairdressing" / "Phone Repair" instead of returning nothing. */
function levenshtein(a,b){
  if(a===b) return 0;
  const m=a.length,n=b.length; if(!m) return n; if(!n) return m;
  let prev=Array.from({length:n+1},(_,i)=>i);
  for(let i=1;i<=m;i++){
    const cur=[i];
    for(let j=1;j<=n;j++) cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
    prev=cur;
  }
  return prev[n];
}
// How well does `query` match `text`? 0 = no match. Rewards exact substrings
// highest, then falls back to per-word fuzzy similarity so typos and partial
// words still surface relevant results instead of an empty grid.
function searchScore(query,text){
  if(!query) return 1;
  text=String(text||"").toLowerCase();
  if(text.includes(query)) return 100 - Math.abs(text.length-query.length)*0.2;
  const qWords=query.split(/\s+/).filter(Boolean), tWords=text.split(/\s+/).filter(Boolean);
  let score=0;
  for(const qw of qWords){
    let best=0;
    for(const tw of tWords){
      if(tw.includes(qw)||qw.includes(tw)){ best=Math.max(best,10); continue; }
      const dist=levenshtein(qw,tw), maxLen=Math.max(qw.length,tw.length);
      const sim=1-dist/maxLen;
      if(sim>=0.6) best=Math.max(best,sim*10);
    }
    score+=best;
  }
  return score;
}
function renderBrowse(){
  const s=$("fSkill").value.trim().toLowerCase(),st=$("fState").value,c=$("fCity").value,
    e=$("fExp").value,t=$("fType").value,creator=$("fCreator")?.checked;
  let list=activeRequests().filter(r=>
    (!st||r.state===st)&&(!c||r.city===c)&&(!e||r.experience===e)&&(!t||r.type===t)&&(!creator||r.content_creator_opportunity));
  if(s){
    list=list.map(r=>({r,score:Math.max(
        searchScore(s,r.skill), searchScore(s,r.title), searchScore(s,r.description)*0.6
      )})).filter(x=>x.score>2).sort((a,b)=>b.score-a.score).map(x=>x.r);
  }
  $("browseGrid").innerHTML=list.length?list.map(card).join(""):`<div class="empty">No results. Try widening your filters or a different search word.</div>`;
}

/* ---------- map ---------- */
let MAP,MARKERS=[],MYPOS=null;
function initMap(){
  if(!MAP){
    MAP=L.map("map").setView([9.08,8.67],6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {attribution:"© OpenStreetMap contributors",maxZoom:19}).addTo(MAP);
  }
  setTimeout(()=>MAP.invalidateSize(),100); renderNearby();
  if(!AUTO_LOCATE_TRIED){ AUTO_LOCATE_TRIED=true; locateMe(true); }
}
let AUTO_LOCATE_TRIED=false;
function locateMe(silent){
  if(!navigator.geolocation) return silent||toast("Your browser doesn't support location");
  if(window.isSecureContext===false) return silent||toast("Location needs the site to be opened over HTTPS");
  if(!silent) toast("Getting your location…");
  navigator.geolocation.getCurrentPosition(p=>{
    MYPOS=[p.coords.latitude,p.coords.longitude]; MAP.setView(MYPOS,11);
    L.circleMarker(MYPOS,{radius:9,color:"#2f5eff",fillOpacity:.9}).addTo(MAP).bindPopup("You are here");
    renderNearby();
    if(!silent) toast("Location found ✅");
  },(err)=>{
    if(silent) return; // auto-attempt on page load fails quietly — the manual button still works
    if(err.code===1) toast("Location permission denied — allow it in your browser/site settings, or pick a state instead");
    else if(err.code===2) toast("Couldn't determine your location — pick a state instead");
    else if(err.code===3) toast("Location request timed out — try again or pick a state instead");
    else toast("Could not get location — pick a state instead");
  },{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
}
function jumpState(){ const s=$("nState").value; if(!s)return; MYPOS=STATES[s]; MAP.setView(MYPOS,10); renderNearby() }
function renderNearby(){
  if(!MAP)return;
  MARKERS.forEach(m=>MAP.removeLayer(m)); MARKERS=[];
  const rad=+$("nRadius").value;
  let list=activeRequests().map(r=>({...r,dist:MYPOS?km(MYPOS[0],MYPOS[1],r.lat,r.lng):null}));
  if(MYPOS) list=list.filter(r=>r.dist<=rad).sort((a,b)=>a.dist-b.dist);
  list.forEach(r=>{
    const m=L.marker([r.lat,r.lng]).addTo(MAP)
      .bindPopup(`<b>${esc(r.title)}</b><br>${esc(r.city)}, ${esc(r.state)}<br>${skillEmoji(r.skill)} ${esc(r.skill)}`);
    m.on("click",()=>{}); MARKERS.push(m);
  });
  $("nCount").textContent = MYPOS?`— ${list.length} within ${rad>9999?"Nigeria":rad+" km"}`:"— showing all (set your location)";
  $("nearbyGrid").innerHTML=list.length?list.map(r=>card(r).replace("</h3>",
    `</h3>${r.dist!=null?`<div class="badge">${r.dist.toFixed(1)} km away</div>`:""}`)).join("")
    :`<div class="empty">Nothing found in this radius.</div>`;
}

/* ---------- dashboard ---------- */
// Same public card, plus owner-only controls (cancel / get featured) appended below it.
function dashListingCard(r){
  const featReq=DB.featured_requests.find(f=>f.request_id===r.id && f.status==="pending");
  const featBtn = r.featured ? `<span class="badge gold">★ Featured</span>`
    : featReq ? `<span class="badge gold">Feature pending review</span>`
    : (r.status==="active" ? `<button class="btn ghost sm" onclick="openFeatureModal('${r.id}')">🌟 Get Featured — ₦1,999</button>` : "");
  const cancelBtn = r.status==="cancelled" ? `<span class="badge grey">Cancelled by you</span>`
    : r.status==="removed" ? `<span class="badge red">Removed by admin</span>`
    : `<button class="btn ghost sm" onclick="cancelListing('${r.id}')">Cancel listing</button>`;
  const extra=`<div class="row" style="margin:0 15px 15px">${featBtn}${cancelBtn}</div>`;
  return card(r).replace("</article>",extra+"</article>");
}
function renderDashboard(){
  if(!ME){ $("dashBody").innerHTML=`<div class="empty">Please log in to see your dashboard.<br><br><button class="btn" onclick="go('auth')">Log in</button></div>`; return }
  const mine=DB.requests.filter(r=>r.user_id===ME.id);
  const apps=DB.applications.filter(a=>a.user_id===ME.id);
  const received=DB.applications.filter(a=>mine.some(r=>r.id===a.request_id));
  const saved=DB.saved.filter(s=>s.user_id===ME.id).map(s=>DB.requests.find(r=>r.id===s.request_id)).filter(Boolean);
  $("dashBody").innerHTML=`
    <div class="panel spread" style="margin-bottom:20px;flex-wrap:wrap">
      <div class="row" style="gap:14px"><img class="avatar" style="width:64px;height:64px" src="${esc(ME.avatar)}"/>
        <div><h2>${esc(ME.business_name||ME.name)}</h2>
          <div class="meta">${esc(ME.role==="business"?"Business / Artisan":"Apprentice / Job seeker")} • ${esc(ME.city)}, ${esc(ME.state)} • ${esc(ME.skill)}</div></div></div>
      <div class="row"><button class="btn ghost sm" onclick="go('profile','${ME.id}')">My public profile</button>
      <button class="btn ghost sm" onclick="openEditProfile()">✎ Edit profile</button>
      <button class="btn sm" onclick="go('post')">+ Post request</button></div>
    </div>
    ${verificationPanel()}
    ${referralPanel()}
    <h3 style="margin-bottom:12px">My requests (${mine.length})</h3>
    <div class="grid">${mine.length?mine.map(dashListingCard).join(""):`<div class="empty">You haven't posted anything yet.</div>`}</div>
    <h3 style="margin:26px 0 12px">Applications I sent (${apps.length})</h3>
    <div class="grid">${apps.length?apps.map(a=>appRow(a,true)).join(""):`<div class="empty">No applications yet.</div>`}</div>
    <h3 style="margin:26px 0 12px">Applications received (${received.length})</h3>
    <div class="grid">${received.length?received.map(a=>appRow(a,false)).join(""):`<div class="empty">No one has applied yet.</div>`}</div>
    <h3 style="margin:26px 0 12px">Saved opportunities (${saved.length})</h3>
    <div class="grid">${saved.length?saved.map(card).join(""):`<div class="empty">Nothing saved yet.</div>`}</div>`;
}
function appRow(a,sent){
  const r=DB.requests.find(x=>x.id===a.request_id)||{title:"Removed listing"};
  const u=DB.users.find(x=>x.id===a.user_id)||{name:"User",avatar:""};
  const media=(a.media||[]).map(m=>m.type&&m.type.startsWith("video")
    ?`<video src="${esc(m.url)}" controls></video>`:`<img src="${esc(m.url)}"/>`).join("");
  return `<div class="card"><div class="body">
    <div class="row" style="gap:10px"><img class="avatar" src="${esc(sent?"":u.avatar)}" style="${sent?"display:none":""}"/>
      <b>${esc(sent?r.title:u.name)}</b><span class="badge ${a.status==="accepted"?"":"grey"}">${esc(a.status)}</span></div>
    ${sent?"":`<div class="meta">Applied to: ${esc(r.title)}</div>`}
    <p class="meta">${esc(a.message)}</p>
    <div class="meta">📞 ${esc(a.phone||"—")} ${a.link?`• <a style="color:var(--primary-2)" target="_blank" href="${esc(a.link)}">link</a>`:""}</div>
    <div class="thumbs">${media}</div>
    ${sent?"":`<div class="row"><button class="btn sm" onclick="setApp('${a.id}','accepted')">Accept</button>
      <button class="btn ghost sm" onclick="setApp('${a.id}','rejected')">Reject</button></div>`}
  </div></div>`;
}
function setApp(id,st){
  const a=DB.applications.find(x=>x.id===id); if(!a)return; a.status=st; save();
  if(SB) SB.from("applications").update({status:st}).eq("id",id);
  toast("Application "+st); renderDashboard();
}

/* ---------- public profile ---------- */
function renderProfile(id){
  const u=DB.users.find(x=>x.id===id)||ME;
  if(!u){ $("profileBody").innerHTML=`<div class="empty">Profile not found.</div>`; return }
  const posts=activeRequests().filter(r=>r.user_id===u.id);
  $("profileBody").innerHTML=`
  <div class="panel">
    <div class="row" style="gap:18px"><img class="avatar" style="width:96px;height:96px" src="${esc(u.avatar)}"/>
      <div><h2>${esc(u.business_name||u.name)} ${u.is_owner?'<span class="badge gold">👑 Owner</span>':''}${u.verified?'<span class="badge gold">✔ Verified</span>':''}</h2>
        <div class="meta">${esc(u.role==="business"?"Business / Artisan":"Apprentice / Job seeker")} • ${esc(u.skill)} • ${esc(u.experience||"")}</div>
        <div class="meta">📍 ${esc(u.city)}, ${esc(u.state)}</div>
        <div class="meta">📞 ${ME?esc(u.phone):"Log in to see phone"} ${u.link?`• <a style="color:var(--primary-2)" target="_blank" href="${esc(u.link)}">${esc(u.link)}</a>`:""}</div>
      </div></div>
    <p style="margin-top:16px">${esc(u.bio||"No bio yet.")}</p>
  </div>
  <h3 style="margin:26px 0 12px">Requests by ${esc(u.name)} (${posts.length})</h3>
  <div class="grid">${posts.length?posts.map(card).join(""):`<div class="empty">No active requests.</div>`}</div>`;
}

/* ---------- direct listing messages ---------- */
let DM_SELECTED=null, DM_POLL=null;
function dmConversationId(requestId,a,b){ return "listing:"+requestId+":"+[String(a),String(b)].sort().join(":"); }
function dmRowsForUser(){
  if(!ME) return [];
  const rows=(DB.messages||[]).filter(m=>(m.chat_type==="listing") && (m.sender_id===ME.id||m.recipient_id===ME.id));
  const map={};
  for(const m of rows){ const other=m.sender_id===ME.id?m.recipient_id:m.sender_id; if(!other) continue; const key=m.conversation_id||("listing:"+(m.request_id||"")+":"+[ME.id,other].sort().join(":")); (map[key]??=[]).push(m); }
  return Object.entries(map).map(([id,msgs])=>{
    msgs.sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
    const last=msgs[msgs.length-1];
    const otherId=last.sender_id===ME.id?last.recipient_id:last.sender_id;
    const u=DB.users.find(x=>x.id===otherId)||{id:otherId,name:"Skill Mate user",avatar:""};
    const req=DB.requests.find(x=>x.id===last.request_id);
    return {id,msgs,last,other:u,request:req};
  }).sort((a,b)=>new Date(b.last.created_at)-new Date(a.last.created_at));
}
function ensureDMMarkup(){
  if($("dmCenter")) return;
  document.body.insertAdjacentHTML("beforeend",`<div id="dmCenter" class="chat-center hidden">
    <aside class="chat-center-side" id="dmSide"></aside>
    <section class="chat-center-main">
      <div class="chat-center-head"><div><b id="dmTitle">Messages</b><div id="dmSub" class="meta">Chat with a listing owner</div></div><button class="btn ghost sm" onclick="closeMessages()">✕</button></div>
      <div id="dmBody" class="chat-center-body"></div>
      <div class="chat-center-input"><input id="dmInput" placeholder="Write a message…" onkeydown="if(event.key==='Enter'){event.preventDefault();sendDM()}"/><button class="btn" onclick="sendDM()">Send</button></div>
    </section></div>`);
}
function renderDMList(){
  const side=$("dmSide"); if(!side)return;
  const rows=dmRowsForUser();
  side.innerHTML=rows.length?`<div style="padding:12px;border-bottom:1px solid var(--line)"><b>Conversations</b></div>`+rows.map(c=>`<div class="chat-convo ${DM_SELECTED?.id===c.id?"active":""}" onclick="selectDM('${esc(c.id)}')"><img class="av" src="${esc(c.other.avatar||"")}"/><div style="min-width:0;flex:1"><b>${esc(c.other.name)}</b><div class="meta" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(c.request?.title||"Listing chat")}</div><div class="meta" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(c.last.body)}</div></div></div>`).join(""):`<div class="empty">No conversations yet.<br>Open a listing and tap Chat.</div>`;
}
function renderDMThread(){
  if(!DM_SELECTED)return;
  const body=$("dmBody"),title=$("dmTitle"),sub=$("dmSub"); if(!body)return;
  const rows=dmRowsForUser(); const c=rows.find(x=>x.id===DM_SELECTED.id)||DM_SELECTED;
  const other=c.other||DM_SELECTED.owner||{name:"User",avatar:""};
  title.textContent=other.name||"Messages"; sub.textContent=c.request?.title||DM_SELECTED.request?.title||"Listing chat";
  const msgs=c.msgs||dmMessagesById(DM_SELECTED.id);
  body.innerHTML=msgs.length?msgs.map(m=>`<div class="chat-msg ${m.sender_id===ME.id?"me":"admin"}">${esc(m.body)}<span class="t">${m.sender_id===ME.id?"You":esc(other.name)} • ${timeAgo(m.created_at)}</span></div>`).join(""):`<div class="empty">Start the conversation.</div>`;
  body.scrollTop=body.scrollHeight;
}
function dmMessagesById(cid){return (DB.messages||[]).filter(m=>m.chat_type==="listing"&&m.conversation_id===cid).sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));}
async function selectDM(id){ const c=dmRowsForUser().find(x=>x.id===id); if(c) DM_SELECTED=c; renderDMList(); renderDMThread(); await markDMRead(); }
async function markDMRead(){
  if(!DM_SELECTED||!ME)return;
  const rows=dmMessagesById(DM_SELECTED.id).filter(m=>m.recipient_id===ME.id&&!m.read_by_recipient);
  if(!rows.length)return;
  rows.forEach(m=>m.read_by_recipient=true);
  if(SB) await SB.from("messages").update({read_by_recipient:true}).eq("conversation_id",DM_SELECTED.id).eq("recipient_id",ME.id).eq("read_by_recipient",false); else save();
  updateChatBadge();
}
async function sendDM(){
  if(!ME)return go("auth"); if(!DM_SELECTED)return toast("Select a conversation first");
  const input=$("dmInput"), val=input?.value.trim(); if(!val)return;
  const req=DM_SELECTED.request; const owner=DM_SELECTED.owner||DM_SELECTED.other;
  const target=owner?.id || (DM_SELECTED.other&&DM_SELECTED.other.id);
  if(!target)return toast("Recipient unavailable");
  const cid=DM_SELECTED.cid||DM_SELECTED.id||dmConversationId(req?.id||DM_SELECTED.requestId,ME.id,target);
  const m={id:uid(),user_id:ME.id,sender:"user",sender_id:ME.id,recipient_id:target,request_id:req?.id||DM_SELECTED.requestId||null,conversation_id:cid,chat_type:"listing",body:val,read_by_admin:true,read_by_user:true,read_by_recipient:false,created_at:new Date().toISOString()};
  input.value=""; DB.messages.push(m); save();
  if(SB){const {error}=await SB.from("messages").insert(m);if(error){DB.messages.pop();save();return toast("Message failed to send");}}
  DM_SELECTED={...DM_SELECTED,id:cid,cid,request:req,owner:target===ME.id?ME:(DB.users.find(x=>x.id===target)||owner)};
  renderDMList();renderDMThread(); recordActivity("message_sent",{request_id:req?.id||null,recipient_id:target});
}
function openListingChat(rid){
  if(!ME)return go("auth");
  const r=DB.requests.find(x=>x.id===rid); if(!r)return;
  if(r.user_id===ME.id)return toast("This is your listing");
  const other=DB.users.find(x=>x.id===r.user_id)||{id:r.user_id,name:"Listing owner",avatar:""};
  const cid=dmConversationId(r.id,ME.id,r.user_id);
  ensureDMMarkup();
  const existing=dmRowsForUser().find(x=>x.id===cid);
  DM_SELECTED=existing||{id:cid,cid,request:r,owner:other,other,requestId:r.id,msgs:[]};
  $("dmCenter").classList.remove("hidden");
  renderDMList();renderDMThread(); if(!DM_POLL)DM_POLL=setInterval(()=>{ if(!ME||!( $("dmCenter")&&!$("dmCenter").classList.contains("hidden")))return; apiLoadAll().then(()=>{renderDMList();renderDMThread();markDMRead();}); },5000);
  markDMRead();
}
function openMessages(){ if(!ME)return go("auth"); ensureDMMarkup(); const box=$("dmCenter"); box.classList.remove("hidden"); renderDMList(); if(!DM_SELECTED){ const first=dmRowsForUser()[0]; if(first)DM_SELECTED=first; } renderDMThread(); if(!DM_POLL)DM_POLL=setInterval(()=>{if(!ME||box.classList.contains("hidden"))return;apiLoadAll().then(()=>{renderDMList();renderDMThread();markDMRead();});},5000); }
function closeMessages(){ const box=$("dmCenter");if(box)box.classList.add("hidden"); }
function DM_CLOSE(){closeMessages();DM_SELECTED=null;if(DM_POLL){clearInterval(DM_POLL);DM_POLL=null;}}
function updateChatBadge(){
  const b=$("chatBadge");if(!b)return;
  const n=(DB.messages||[]).filter(m=>m.chat_type==="listing"&&m.recipient_id===ME?.id&&!m.read_by_recipient).length + (DB.messages||[]).filter(m=>m.sender==="admin"&&m.user_id===ME?.id&&!m.read_by_user).length;
  b.textContent=n;b.classList.toggle("hidden",!n);
}

/* ---------- customer support chat ---------- */
let CHAT_OPEN=false, CHAT_POLL=null, CHAT_MSGS=[];
function toggleChat(){
  if(!ME){ toast("Log in to chat with support"); return go('auth'); }
  CHAT_OPEN=!CHAT_OPEN;
  $("chatPanel").classList.toggle("hidden",!CHAT_OPEN);
  if(CHAT_OPEN){ loadChat(); if(!CHAT_POLL) CHAT_POLL=setInterval(loadChat,4000); }
  else updateChatBadge();
}
async function loadChat(){
  if(!ME) return;
  if(SB){
    const {data}=await SB.from("messages").select("*").eq("user_id",ME.id).order("created_at",{ascending:true});
    if(data) CHAT_MSGS=data;
  } else {
    // shared "messages" store (same key admin.html reads) so support replies —
    // and the admin seeing this user's messages at all — work in test mode too.
    DB.messages = LS.get("messages", DB.messages);
    CHAT_MSGS = DB.messages.filter(m=>m.user_id===ME.id).sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
  }
  renderChat();
  if(CHAT_OPEN) await markChatRead();
  updateChatBadge();
}
function renderChat(){
  const box=$("chatBody"); if(!box) return;
  box.innerHTML = CHAT_MSGS.length ? CHAT_MSGS.map(m=>
    `<div class="chat-msg ${m.sender==='user'?'me':'admin'}">${esc(m.body)}<span class="t">${m.sender==='user'?'You':'Support'} • ${timeAgo(m.created_at)}</span></div>`
  ).join("") : `<div class="empty" style="padding:20px;font-size:13px">Say hello 👋 — our team usually replies within a day.</div>`;
  box.scrollTop=box.scrollHeight;
}
async function sendChatMsg(){
  if(!ME) return go('auth');
  const val=$("chatInput").value.trim(); if(!val) return;
  const m={id:uid(),user_id:ME.id,sender:"user",body:val,read_by_admin:false,read_by_user:true,created_at:new Date().toISOString()};
  $("chatInput").value="";
  CHAT_MSGS.push(m); renderChat();
  if(SB){ const {error}=await SB.from("messages").insert(m); if(error) toast("Message failed to send"); }
  else { DB.messages.push(m); save(); }
}
async function markChatRead(){
  const unread=CHAT_MSGS.filter(m=>m.sender==="admin"&&!m.read_by_user);
  if(!unread.length) return;
  unread.forEach(m=>m.read_by_user=true);
  if(SB) await SB.from("messages").update({read_by_user:true}).eq("user_id",ME.id).eq("sender","admin").eq("read_by_user",false);
  else save();
}


/* ---------- landing slideshow ---------- */
const LANDING_IMAGES=[
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1800&q=85"
];
LANDING_IMAGES.forEach(src=>{const im=new Image();im.src=src;});
let landingIndex=0;
function renderLanding(){
  const bg=$("landingBg"), dots=$("landingDots"); if(!bg||!dots)return;
  bg.style.backgroundImage=`url("${LANDING_IMAGES[landingIndex]}")`;
  dots.innerHTML=LANDING_IMAGES.map((_,i)=>`<span class="landing-dot ${i===landingIndex?"on":""}"></span>`).join("");
}
function startLanding(){
  renderLanding(); clearInterval(window._landingTimer);
  window._landingTimer=setInterval(()=>{ landingIndex=(landingIndex+1)%LANDING_IMAGES.length; renderLanding(); },5000);
}
function openAnnouncements(){
  const anns=(DB.announcements||[]).filter(x=>x.status!=="archived" && (!x.target_user_id || x.target_user_id===ME?.id));
  $("modalRoot").innerHTML=`<div class="modal" onclick="if(event.target===this)closeModal()"><div class="panel" style="width:min(620px,94vw)">
    <div class="spread"><div><h2>Announcements</h2><p class="meta" style="margin:4px 0 0">Public messages and Skill Mate updates</p></div><button class="btn ghost sm" onclick="closeModal()">✕</button></div>
    <div style="margin-top:18px">${anns.length?anns.map(x=>`<div class="panel" style="padding:16px;margin-bottom:10px"><div class="spread"><b>${esc(x.title)}</b><span class="badge ${x.force?"red":"grey"}">${x.force?"Important":"Update"}</span></div><p style="line-height:1.6;margin:8px 0">${esc(x.message)}</p><div class="meta">${timeAgo(x.created_at)}</div></div>`).join(""):`<div class="empty">No announcements right now.</div>`}</div>
  </div></div>`;
  if(ME) localStorage.setItem("sm_announcements_seen_"+ME.id,JSON.stringify(anns.map(x=>x.id)));
  updateAnnouncementBadge();
}
function updateAnnouncementBadge(){
  const seen=ME?JSON.parse(localStorage.getItem("sm_announcements_seen_"+ME.id)||"[]"):[];
  const unread=(DB.announcements||[]).filter(x=>x.status!=="archived"&&(!x.target_user_id||x.target_user_id===ME?.id)&&!seen.includes(x.id)).length;
  $("announcementUnread")?.classList.toggle("hidden",!unread);
}
function checkForceAnnouncements(){
  const anns=(DB.announcements||[]).filter(x=>x.force&&x.status!=="archived"&&(!x.target_user_id||x.target_user_id===ME?.id));
  const seen=ME?JSON.parse(localStorage.getItem("sm_force_announcements_seen_"+ME.id)||"[]"):[];
  const unseen=anns.filter(x=>!seen.includes(x.id));
  if(!unseen.length)return;
  $("modalRoot").innerHTML=`<div class="modal"><div class="panel" style="width:min(620px,94vw)">
    <div class="spread"><h2>📢 Important announcement</h2><span class="badge red">Please read</span></div>
    <div style="margin-top:16px">${unseen.map(x=>`<div style="padding:14px;border:1px solid var(--line);border-radius:14px;margin-bottom:10px"><h3>${esc(x.title)}</h3><p style="line-height:1.6">${esc(x.message)}</p></div>`).join("")}</div>
    <button class="btn block" onclick="ackForceAnnouncements()">I have read this</button>
  </div></div>`;
}
function ackForceAnnouncements(){
  const anns=(DB.announcements||[]).filter(x=>x.force&&x.status!=="archived"&&(!x.target_user_id||x.target_user_id===ME?.id));
  if(ME)localStorage.setItem("sm_force_announcements_seen_"+ME.id,JSON.stringify(anns.map(x=>x.id)));
  closeModal(); updateAnnouncementBadge();
}
function renderSettings(){
  if(!ME){$("settingsBody").innerHTML=`<div class="empty">Please log in first.</div>`;return;}
  const dark=document.documentElement.dataset.theme==="dark";
  $("settingsBody").innerHTML=`<div class="sec-head"><div><h2>Settings</h2><p>Control how Skill Mate looks and how your account works.</p></div></div>
  <div class="panel"><div class="spread"><div><b>Dark theme</b><div class="meta">Use a complete dark interface across the app.</div></div><button class="btn ${dark?"":"ghost"}" onclick="toggleTheme()">${dark?"🌙 Dark":"☀️ Light"}</button></div></div>
  <hr style="border:0;border-top:1px solid var(--line);margin:20px 0"/>
  <div><b>Account</b><p class="meta">Deleting your account removes your profile and listings. This action cannot be undone.</p><button class="btn danger" onclick="deleteMyAccount()">Delete my account</button></div></div>`;
}
function applyTheme(){
  const theme=localStorage.getItem("sm_theme")||"light";
  document.documentElement.dataset.theme=theme;
}
function toggleTheme(){
  localStorage.setItem("sm_theme",document.documentElement.dataset.theme==="dark"?"light":"dark"); applyTheme(); renderSettings();
}
async function deleteMyAccount(){
  if(!ME)return;
  if(!confirm("Delete your Skill Mate account? Your profile and listings will be removed. This cannot be undone."))return;
  const id=ME.id;
  try{
    if(SB){
      await SB.from("requests").delete().eq("user_id",id);
      const {error}=await SB.from("profiles").delete().eq("id",id);
      if(error) await SB.from("profiles").update({status:"deleted"}).eq("id",id);
    }
    DB.requests=DB.requests.filter(r=>r.user_id!==id); DB.users=DB.users.filter(u=>u.id!==id);
    save(); ME=null; localStorage.removeItem("sm_me"); paintAuth(); closeModal(); go("landing"); toast("Your account has been deleted.");
  }catch(e){toast("Could not delete the account: "+e.message)}
}

/* ---------- seed + boot ---------- */
function seed(){ /* intentionally empty: production starts with no demo listings/users */ }
function renderAll(){ renderHome(); renderBrowse(); if(MAP) renderNearby(); }

(async function boot(){
  applyTheme();
  $("yr").textContent=new Date().getFullYear();
  const opts=`<option value="">All states</option>`+Object.keys(STATES).map(s=>`<option>${s}</option>`).join("");
  ["hState","fState","nState"].forEach(i=>$(i).innerHTML=opts);
  ["pState","suState"].forEach(i=>$(i).innerHTML=Object.keys(STATES).map(s=>`<option>${s}</option>`).join(""));
  $("hState").value="Lagos";
  populateCities("fState","fCity",true);
  populateCities("pState","pCity");
  populateCities("suState","suCity");
  document.getElementById("skillList").innerHTML=SKILLS.map(s=>`<option value="${s.n}">`).join("");
  $("suRole").addEventListener("change",e=>$("bizOnly").classList.toggle("hidden",e.target.value!=="business"));
  $("suCreator").addEventListener("change",e=>$("creatorOnly").classList.toggle("hidden",!e.target.checked));
  const urlRef=new URLSearchParams(location.search).get("ref");
  if(urlRef){
    if($("suRefCode")) $("suRefCode").value=urlRef.toUpperCase();
    if(!ME){ go("auth"); authTab("signup"); toast("Referral code applied — sign up to get started!"); }
  }
  if(!LS.get("launch_clean_2026_08",false)){ DB.requests=[]; save(); LS.set("launch_clean_2026_08",true); }
  seed(); await apiLoadAll(); await refreshMe(); paintAuth(); renderAll(); updateAnnouncementBadge();
  if(ME){ loadChat(); go("home"); checkForceAnnouncements(); setTimeout(()=>{ checkPendingReviews(); checkClosePrompts(); },900); }
  else { go("landing"); startLanding(); }
  setInterval(async()=>{
    if(!ME) return;
    loadChat();
    await refreshMe(); paintAuth();
    if(!$("view-dashboard").classList.contains("hidden")) renderDashboard();
    updateAnnouncementBadge();
  },15000);
  // restore media index after service restart
  if(MEDIA_API) fetch(MEDIA_API+"/api/restore").then(r=>r.json()).then(j=>console.log("media restored:",j.count)).catch(()=>{});
})();
