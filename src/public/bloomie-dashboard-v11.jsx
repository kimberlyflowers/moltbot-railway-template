// React hooks available as React.useState, React.useEffect, React.useRef
const { useState, useEffect, useRef } = React;

/* ═══════════════════════════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════════════════════════ */
function mk(d){return d?{bg:"#1a1a1a",sf:"#212121",cd:"#262626",ac:"#F4A261",a2:"#E76F8B",gr:"#34A853",gf:"#1a2b1a",tx:"#ececec",so:"#a0a0a0",fa:"#5c5c5c",ln:"#353535",bl:"#5B8FF9",pu:"#A78BFA",inp:"#212121",hv:"#2f2f2f"}:{bg:"#F7F8FA",sf:"#EDEEF2",cd:"#FFFFFF",ac:"#F4A261",a2:"#E76F8B",gr:"#34A853",gf:"#F0FAF0",tx:"#111827",so:"#6B7280",fa:"#D1D5DB",ln:"#E5E7EB",bl:"#3B6FD4",pu:"#7C3AED",inp:"#F4F5F7",hv:"#F0F1F3"}}

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
/* ─── AGENT PHOTO ─── */
var JOHN_IMG="data:image/jpeg;base64,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";
var BLOOMIE_IMG="data:image/png;base64,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";

/* ─── AGENTS ─── */
var AGENTS=[
  {id:"sarah",nm:"Sarah Rodriguez",role:"Growth & Community Lead",img:null,grad:"linear-gradient(135deg,#E76F8B,#A78BFA)",status:"online"},
  {id:"johnathon",nm:"Johnathon",role:"AI Employee",img:JOHN_IMG,grad:"linear-gradient(135deg,#F4A261,#E76F8B)",status:"online"},
  {id:"maya",nm:"Maya",role:"Video Marketing Agent",img:null,grad:"linear-gradient(135deg,#5B8FF9,#34A853)",status:"idle"},
  {id:"bloomie",nm:"Bloomie",role:"Help & Support",img:BLOOMIE_IMG,grad:"linear-gradient(135deg,#F4A261,#E76F8B)",status:"online"}
];

/* ─── BUSINESSES & PROJECTS ─── */
var BIZ=[
  {id:"bloom",nm:"BLOOM",ic:"\u{1F338}",cl:"#E76F8B",pj:[
    {id:"bloomshield",nm:"BloomShield",ic:"\u{1F6E1}"},
    {id:"bloomvault",nm:"BloomVault Extension",ic:"\u{1F512}"},
    {id:"bloombot",nm:"BloomBot Dashboard",ic:"\u{1F916}"},
    {id:"marketing",nm:"Marketing & Growth",ic:"\u{1F4C8}"}
  ]},
  {id:"petal",nm:"Petal Core Beauty",ic:"\u{1F33A}",cl:"#F4A261",pj:[
    {id:"tiktok",nm:"TikTok Shop",ic:"\u{1F3AC}"},
    {id:"product",nm:"Product Line",ic:"\u2728"},
    {id:"influencer",nm:"Influencer Campaigns",ic:"\u{1F4F1}"}
  ]},
  {id:"openclaw",nm:"OpenClaw Services",ic:"\u{1F43E}",cl:"#5B8FF9",pj:[
    {id:"fiverr",nm:"Fiverr Marketplace",ic:"\u{1F4B0}"},
    {id:"maya",nm:"Maya Campaign",ic:"\u{1F3A5}"},
    {id:"dashboard",nm:"Client Dashboard",ic:"\u{1F4CA}"}
  ]}
];

var PJ=[
  {id:"school",ic:"\u{1F3EB}",nm:"The School",cl:"#F4A261",dn:12,tot:185,
    at:{nm:"Demographic Research",pct:60,tm:"12 min left",steps:[
      {t:"Pulling Census data for your area",d:true,tm:"8:01 AM"},
      {t:"Analyzing household income levels",d:true,tm:"8:04 AM"},
      {t:"Counting school-age children by zip code",d:true,tm:"8:07 AM"},
      {t:"Mapping competitor schools within 10 miles",d:false,a:true},
      {t:"Building charts and summary report",d:false}]},
    fin:[{t:"Mission Statement",tm:"Jan 28"},{t:"Vision Statement",tm:"Jan 30"},{t:"School Model Selection",tm:"Feb 1"}],
    nxt:["Market Research Report","Competitor Deep Dive","Stakeholder List"]},
  {id:"book",ic:"\u{1F4D6}",nm:"The Book",cl:"#E76F8B",dn:2,tot:18,
    at:{nm:"Chapter 2: Why Classical Education",pct:65,tm:"25 min left",steps:[
      {t:"Researching classical education history",d:true,tm:"7:30 AM"},
      {t:"Drafting Section 2.1 \u2014 Historical roots",d:true,tm:"7:42 AM"},
      {t:"Drafting Section 2.2 \u2014 Grammar, Logic, Rhetoric",d:true,tm:"7:55 AM"},
      {t:"Drafting Section 2.3 \u2014 Modern application",d:false,a:true},
      {t:"Drafting Section 2.4 \u2014 Underserved communities",d:false},
      {t:"Final review and polish",d:false}]},
    fin:[{t:"Book Outline & Structure",tm:"Feb 1"},{t:"Chapter 1: The Vision",tm:"Feb 2"}],
    nxt:["Chapter 3","Chapter 4","Book Cover Concepts"]},
  {id:"event",ic:"\u{1F3A4}",nm:"March 15 Event",cl:"#6C63FF",dn:2,tot:6,
    at:{nm:"Building the Landing Page",pct:75,tm:"4 min left",steps:[
      {t:"Designing the page layout",d:true,tm:"8:10 AM"},
      {t:"Writing the event description",d:true,tm:"8:13 AM"},
      {t:"Adding the Eventbrite RSVP button",d:true,tm:"8:16 AM"},
      {t:"Testing on mobile and publishing",d:false,a:true}]},
    fin:[{t:"Eventbrite Listing",tm:"Today"},{t:"Event Date Confirmed",tm:"Feb 1"}],
    nxt:["Graphics Package","Email Blast","VIP Invitations"]}
];

var DL=[
  {id:1,nm:"Mission Statement",tp:"doc",ic:"\u{1F4C4}",pj:"school",pji:"\u{1F3EB}",dt:"Jan 28",ds:"2025-01-28",pv:"A clear, compelling mission statement for the Youth Empowerment School.",ct:"The Youth Empowerment School exists to provide a rigorous, classical education that develops the whole person \u2014 mind, body, and spirit \u2014 for students in underserved communities.\n\nOur mission is rooted in the belief that every child, regardless of zip code, deserves access to the kind of education that cultivates critical thinking, eloquent communication, and moral character."},
  {id:2,nm:"Vision Statement",tp:"doc",ic:"\u{1F4C4}",pj:"school",pji:"\u{1F3EB}",dt:"Jan 30",ds:"2025-01-30",pv:"10-year goals and community impact targets.",ct:"By 2035, the Youth Empowerment School will be the premier classical education institution in the region, serving 500+ students across K-12, with a 95% graduation rate."},
  {id:3,nm:"School Model Comparison",tp:"spreadsheet",ic:"\u{1F4CA}",pj:"school",pji:"\u{1F3EB}",dt:"Feb 1",ds:"2025-02-01",pv:"Charter vs private vs hybrid \u2014 pros, cons, and costs.",ct:null},
  {id:4,nm:"Book Outline",tp:"doc",ic:"\u{1F4C4}",pj:"book",pji:"\u{1F4D6}",dt:"Feb 1",ds:"2025-02-01",pv:"Chapter-by-chapter outline with themes and research notes.",ct:"THE SCHOOL THAT SHOULDN'T EXIST\nBy Charles Rodriguez\n\nChapter 1: The Vision\nChapter 2: Why Classical Education\nChapter 3: The Community Need"},
  {id:5,nm:"Chapter 1: The Vision",tp:"doc",ic:"\u{1F4C4}",pj:"book",pji:"\u{1F4D6}",dt:"Feb 2",ds:"2025-02-02",pv:"3,200 words \u2014 Charles\u2019s personal story and the spark.",ct:"CHAPTER 1: THE VISION\n\nI didn\u2019t set out to start a school. Nobody does, really. You set out to solve a problem that keeps you up at night, and sometimes the solution is bigger than you expected."},
  {id:6,nm:"Eventbrite Listing",tp:"link",ic:"\u{1F517}",pj:"event",pji:"\u{1F3A4}",dt:"Feb 3",ds:"2025-02-03",pv:"Live Eventbrite page with RSVP tracking.",ct:null},
  {id:7,nm:"Venue Confirmation Email",tp:"email",ic:"\u2709\uFE0F",pj:"event",pji:"\u{1F3A4}",dt:"Feb 1",ds:"2025-02-01",pv:"Confirmation email to venue for March 15th.",ct:"To: events@communitycenter.org\nSubject: Confirming March 15th \u2014 YES Info Session\n\nHi Maria,\n\nThis confirms our reservation of the Main Hall for Saturday, March 15th, 10:00 AM - 12:30 PM."},
  {id:8,nm:"Community Survey",tp:"doc",ic:"\u{1F4C4}",pj:"school",pji:"\u{1F3EB}",dt:"Jan 25",ds:"2025-01-25",pv:"20-question community needs assessment.",ct:null},
  {id:9,nm:"Board Member Profiles",tp:"doc",ic:"\u{1F4CB}",pj:"school",pji:"\u{1F3EB}",dt:"Jan 22",ds:"2025-01-22",pv:"8 potential board members with contact info.",ct:null},
  {id:10,nm:"Brand Guide",tp:"design",ic:"\u{1F3A8}",pj:"school",pji:"\u{1F3EB}",dt:"Jan 20",ds:"2025-01-20",pv:"Colors, fonts, and usage rules for YES materials.",ct:null}
];

var SS=[
  {id:"s1",tl:"Landing page and event graphics",tm:"Today"},
  {id:"s2",tl:"Book Chapter 1 review",tm:"Today"},
  {id:"s3",tl:"Eventbrite setup and logistics",tm:"Yesterday"},
  {id:"s4",tl:"School model comparison research",tm:"Yesterday"},
  {id:"s5",tl:"Mission statement drafting",tm:"Jan 28"},
  {id:"s6",tl:"Board member research",tm:"Jan 22"}
];

var TIPS=[
  {ic:"\u{1F3AF}",t:"A grant window opens March 1st \u2014 want me to start the application?"},
  {ic:"\u{1F4E7}",t:"Patricia hasn\u2019t replied in 4 days. Should I follow up?"},
  {ic:"\u2728",t:"Research finishes today. Start the next report automatically?"}
];

var CRONS=[
  {id:"c1",nm:"TikTok trend scan",ic:"\u{1F50D}",freq:"Every 6hrs",next:"2:30 PM",last:"8:32 AM",ok:true,on:true},
  {id:"c2",nm:"Daily email digest",ic:"\u{1F4E7}",freq:"Daily 6pm",next:"6:00 PM",last:"Yesterday 6pm",ok:true,on:true},
  {id:"c3",nm:"Competitor price check",ic:"\u{1F4CA}",freq:"Mon 9am",next:"Mon Feb 10",last:"Mon Feb 3",ok:false,on:true},
  {id:"c4",nm:"BloomShield backup",ic:"\u{1F6E1}",freq:"Every 12hrs",next:"11:00 PM",last:"11:02 AM",ok:true,on:true},
  {id:"c5",nm:"Social post scheduler",ic:"\u{1F4F1}",freq:"Daily 10am, 2pm, 7pm",next:"2:00 PM",last:"10:01 AM",ok:true,on:true},
  {id:"c6",nm:"Lead nurture drip",ic:"\u{1F4A7}",freq:"Every 48hrs",next:"Tomorrow 9am",last:"Yesterday 9am",ok:true,on:false}
];

var DNAV=[
  {s:"Control",it:[{ic:"\u{1F4CA}",l:"Overview"},{ic:"\u{1F517}",l:"Channels"},{ic:"\u{1F4E1}",l:"Instances"},{ic:"\u{1F4AC}",l:"Sessions"},{ic:"\u23F1",l:"Cron Jobs"}]},
  {s:"Agent",it:[{ic:"\u26A1",l:"Skills"},{ic:"\u{1F9E9}",l:"Nodes"}]},
  {s:"Settings",it:[{ic:"\u2699\uFE0F",l:"Config"},{ic:"\u{1F527}",l:"Debug"},{ic:"\u{1F4CB}",l:"Logs"}]},
  {s:"Resources",it:[{ic:"\u{1F4D6}",l:"Docs"}]}
];

var PLUS=[
  {s:"Share with Bloomie",it:[
    {ic:"\u{1F4CE}",l:"Upload a file",d:"PDF, doc, image, spreadsheet",a:"upload"},
    {ic:"\u{1F4F7}",l:"Take a photo",d:"Camera capture",a:"camera"},
    {ic:"\u{1F399}",l:"Voice message",d:"Record and send audio",a:"voice"}]},
  {s:"Connect a folder",it:[
    {ic:"\u{1F4BB}",l:"Local files",d:"Browse your hard drive",a:"local"},
    {l:"Google Drive",d:"Read & write to your Drive",a:"gdrive",brand:{bg:"#4285F4"}},
    {l:"Dropbox",d:"Sync a Dropbox folder",a:"dropbox",brand:{bg:"#0061FF"}},
    {l:"Notion",d:"Read & edit Notion pages",a:"notion",brand:{bg:"#000000"}},
    {l:"GitHub",d:"Access repos, push code",a:"github",brand:{bg:"#24292e"}},
    {l:"OneDrive",d:"Microsoft file access",a:"onedrive",brand:{bg:"#0078D4"}}]},
  {s:"Run a skill",it:[
    {ic:"\u{1F310}",l:"Browse the web",d:"Research, scrape, fill forms",a:"sk_browser"},
    {ic:"\u{1F5A5}",l:"Run code",d:"Python or Node.js sandbox",a:"sk_code"},
    {ic:"\u{1F4CA}",l:"Create spreadsheet",d:"Excel, CSV, financial model",a:"sk_sheet"},
    {ic:"\u{1F3AC}",l:"Create presentation",d:"Pitch deck, slides",a:"sk_pptx"},
    {ic:"\u{1F4C4}",l:"Create document",d:"Report, proposal, letter",a:"sk_doc"},
    {ic:"\u{1F4C8}",l:"Create chart",d:"Bar, line, pie visualization",a:"sk_chart"},
    {ic:"\u{1F680}",l:"Deploy to web",d:"Publish a live page",a:"sk_deploy"},
    {ic:"\u{1F3AC}",l:"Download video",d:"YouTube, TikTok, Instagram & more",a:"sk_video"},
    {ic:"\u{1F4E8}",l:"Send to someone",d:"Email, Slack, or share link",a:"sk_send"}]}
];

var MN={auto:"Best for task",opus:"Opus",sonnet:"Sonnet",haiku:"Haiku",gpt4o:"GPT-4o",gemini:"Gemini"};

function BrandLogo({name,sz}){
  var s=sz||18;
  var logos={
    "WhatsApp":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.008a9.876 9.876 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 012.16 12.009C2.162 6.564 6.609 2.12 12.058 2.12a9.84 9.84 0 016.983 2.892 9.84 9.84 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zM20.52 3.449A11.8 11.8 0 0012.05.002C5.464.002.103 5.36.1 11.95a11.88 11.88 0 001.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.585 0 11.946-5.36 11.95-11.95a11.87 11.87 0 00-3.48-8.395z"/></svg>},
    "Telegram":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0 12 12 0 0011.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>},
    "Discord":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/></svg>},
    "Slack":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.163 0a2.528 2.528 0 012.523 2.522v6.312zM15.163 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.163 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 01-2.52-2.523 2.527 2.527 0 012.52-2.52h6.315A2.528 2.528 0 0124 15.163a2.528 2.528 0 01-2.522 2.523h-6.315z"/></svg>},
    "Signal":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M12 1.5C6.21 1.5 1.5 6.21 1.5 12c0 1.83.47 3.55 1.3 5.05L1.5 22.5l5.45-1.3A10.45 10.45 0 0012 22.5c5.79 0 10.5-4.71 10.5-10.5S17.79 1.5 12 1.5zm0 2a8.5 8.5 0 110 17 8.5 8.5 0 010-17z"/></svg>},
    "Web Chat":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>},
    "Gmail":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.73l8.073-6.236C21.691 2.28 24 3.434 24 5.457z"/></svg>},
    "Outlook":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M7.88 12.04q0 .45-.11.87-.11.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.33.58-.52.36-.2.87-.2.49 0 .86.2.36.2.58.55.22.34.33.77.1.43.1.86zm16.12 0l.01 6.54H14V5.42h10v.03c0 .23-.01.45-.04.67l-6.07 4.39v.01l6.11 4.43V12zm-.88-6.54H14V1.96l9.12 3.54zM0 3.42l8.5-1.42v20L0 20.58V3.42z"/></svg>},
    "Google Drive":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M7.71 3.5L1.15 15l3.43 5.91 6.56-11.42L7.71 3.5zM22.85 15L16.29 3.5H9.14l6.56 11.5h7.15zM14.57 15.96l-3.43 5.93h13.72l3.43-5.93H14.57z" fillOpacity=".9"/></svg>},
    "Eventbrite":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm4.95 16.95H7.05v-1.5h9.9v1.5zm0-3.45H7.05V12h9.9v1.5zm0-3.45H7.05V8.55h9.9v1.5z"/></svg>},
    "GoHighLevel":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/><path d="M2 17l10 5 10-5" fill="none" stroke="#fff" strokeWidth="1.5"/><path d="M2 12l10 5 10-5" fill="none" stroke="#fff" strokeWidth="1.5"/></svg>},
    "ClickFunnels":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M12 2 L20 6 L20 10 L16 8 L16 12 L12 10 L12 14 L8 12 L8 16 L4 14 L4 10 L12 2Z"/><path d="M12 14 L12 22 L4 18 L4 14 L8 16 L8 12 L12 14Z" fillOpacity=".7"/><path d="M12 14 L12 22 L20 18 L20 10 L16 12 L16 8 L12 10 L12 14Z" fillOpacity=".5"/></svg>},
    "GitHub":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>},
    "Shopify":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.058-.121-.074l-.914 21.104zM11.592 8.089l-.87 2.875s-.807-.375-1.784-.375c-1.447 0-1.518.907-1.518 1.137 0 1.247 3.263 1.724 3.263 4.648 0 2.298-1.459 3.778-3.425 3.778-2.36 0-3.564-1.467-3.564-1.467l.633-2.089s1.239 1.064 2.286 1.064c.682 0 .961-.537.961-.93 0-1.627-2.677-1.7-2.677-4.376 0-2.252 1.615-4.431 4.876-4.431 1.252 0 1.819.36 1.819.36z"/></svg>},
    "Stripe":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>},
    "Notion":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.934-.56.934-1.166V6.354c0-.606-.233-.933-.747-.886l-15.177.887c-.56.046-.747.326-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.747 0-.934-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.886.747-.933zM1.936 1.035l13.89-.933c1.682-.14 2.101.093 2.8.606l3.876 2.707c.466.326.606.747.606 1.26v17.671c0 1.166-.42 1.679-1.682 1.772L5.159 23.11c-.934.047-1.588.187-2.194-.327l-2.4-1.868c-.467-.373-.7-.746-.7-1.398V3.31c0-.793.327-1.446 1.4-1.679l.67-.596z"/></svg>},
    "Zapier":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.2 8.4l-3.3 3.3 3.3 3.3-1.4 1.4-3.3-3.3-3.3 3.3-1.4-1.4 3.3-3.3-3.3-3.3 1.4-1.4 3.3 3.3 3.3-3.3 1.4 1.4z"/></svg>},
    "TikTok":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>},
    "Instagram":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>},
    "Facebook":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>},
    "YouTube":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>},
    "LinkedIn":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>},
    "X / Twitter":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>},
    "Dropbox":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M6 2l6 3.75L6 9.5 0 5.75zM18 2l6 3.75-6 3.75-6-3.75zM0 13.25L6 9.5l6 3.75L6 17zM18 9.5l6 3.75L18 17l-6-3.75zM6 18.25l6-3.75 6 3.75-6 3.75z"/></svg>},
    "OneDrive":function(){return <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M10.5 6c-2.5 0-4.68 1.56-5.53 3.76A5.5 5.5 0 005.5 21h13a5 5 0 001.64-9.73A6.5 6.5 0 0010.5 6z" fillOpacity=".9"/></svg>}
  };
  var fn=logos[name];
  return fn?fn():null;
}

/* ═══════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════ */
function useW(){var s=useState(typeof window!=="undefined"?window.innerWidth:1200);useEffect(function(){var f=function(){s[1](window.innerWidth)};window.addEventListener("resize",f);return function(){window.removeEventListener("resize",f)};},[]);return s[0];}

/* ═══════════════════════════════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
function Ring({pct,sz,cl,children}){var s=sz||52,r=(s-5)/2,c=2*Math.PI*r;return(<div style={{position:"relative",width:s,height:s,flexShrink:0}}><svg width={s} height={s} style={{transform:"rotate(-90deg)"}}><circle cx={s/2} cy={s/2} r={r} fill="none" stroke="currentColor" opacity={.1} strokeWidth={5}/><circle cx={s/2} cy={s/2} r={r} fill="none" stroke={cl} strokeWidth={5} strokeDasharray={c} strokeDashoffset={c-(pct/100)*c} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s ease"}}/></svg><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>{children}</div></div>);}

function Face({sz,agent,editable}){
  var s=sz||30;var ag=agent||AGENTS[0];
  var editBadge=editable&&s>=36?(
    <div style={{position:"absolute",bottom:-1,right:-1,width:Math.max(16,s*.24),height:Math.max(16,s*.24),borderRadius:"50%",background:"#fff",border:"1.5px solid #ddd",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 4px rgba(0,0,0,.15)",cursor:"pointer",zIndex:2}}>
      <span style={{fontSize:Math.max(8,s*.12)}}>{"✏️"}</span>
    </div>
  ):null;
  if(ag.img){return(
    <div style={{width:s,height:s,flexShrink:0,position:"relative"}}>
      <div style={{width:s,height:s,borderRadius:s*.3,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,.12)",background:ag.grad}}>
        <img src={ag.img} alt={ag.nm} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
      </div>
      {editBadge}
    </div>
  );}
  var ini=ag.nm.split(" ").map(function(w){return w[0]}).join("").slice(0,2);
  return(
    <div style={{width:s,height:s,flexShrink:0,position:"relative"}}>
      <div style={{width:s,height:s,borderRadius:s*.3,overflow:"hidden",background:ag.grad,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,.12)"}}>
        <span style={{fontSize:s*.38,fontWeight:700,color:"#fff"}}>{ini}</span>
      </div>
      {editBadge}
    </div>
  );
}

function Bloom({sz,glow}){var s=sz||36;return(<div style={{position:"relative",width:s,height:s,flexShrink:0}}>{glow&&<div style={{position:"absolute",inset:-4,borderRadius:s*.28+4,background:"radial-gradient(circle,#F4A26140 0%,#E76F8B20 50%,transparent 70%)",animation:"bloomGlow 2.5s ease-in-out infinite"}}/>}<div style={{width:s,height:s,borderRadius:s*.28,overflow:"hidden",background:"linear-gradient(135deg,#F4A261,#E76F8B)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 12px #E76F8B40",position:"relative",zIndex:1}}><svg width={s*.65} height={s*.65} viewBox="0 0 100 100" fill="none">{[0,72,144,216,288].map(function(r,i){return <ellipse key={i} cx="50" cy="38" rx="14" ry="20" fill="#fff" opacity={i%2===0?.9:.8} transform={"rotate("+r+" 50 50)"}/>})}<circle cx="50" cy="50" r="10" fill="#FFE0C2"/><circle cx="50" cy="50" r="5" fill="#F4A261"/></svg></div></div>);}

function Bar({pct,cl}){return(<div style={{width:"100%",height:6,borderRadius:3,background:"currentColor",opacity:.08,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:3,width:pct+"%",background:"linear-gradient(90deg,"+cl+","+cl+"BB)",position:"relative",transition:"width 1.2s cubic-bezier(.4,0,.2,1)"}}><div style={{position:"absolute",right:-1,top:-2,width:10,height:10,borderRadius:"50%",background:cl,boxShadow:"0 0 8px "+cl+"66",animation:"pulse 1.5s ease infinite"}}/></div></div></div>);}

/* ═══════════════════════════════════════════════════════════════
   SCREEN VIEWER — docked / fullscreen / popout
   ═══════════════════════════════════════════════════════════════ */
function Screen({c,mob,live,mode,setMode,onCmd}){
  /* mode: "docked" | "full" | "pop" | "hidden" */
  if(mode==="hidden") return null;
  var _fi=useState(""),fiV=_fi[0],setFiV=_fi[1];
  var _fmic=useState(false),fMic=_fmic[0],setFMic=_fmic[1];
  var _fVis=useState(true),fBarVis=_fVis[0],setFBarVis=_fVis[1];

  var wrap=mode==="full"?{position:"fixed",inset:0,zIndex:300,background:"#000",display:"flex",flexDirection:"column"}
    :mode==="pop"?{position:"fixed",bottom:mob?12:20,right:mob?12:20,width:mob?200:340,height:mob?130:210,zIndex:250,borderRadius:14,overflow:"hidden",boxShadow:"0 12px 48px rgba(0,0,0,.45)",border:"2px solid "+c.ac+"60",resize:"both"}
    :{borderRadius:12,overflow:"hidden",border:"1.5px solid "+(live?c.gr+"50":c.ln),marginBottom:0,maxHeight:"100%"};

  var barH=mob?32:36;

  return(
    <div style={wrap}>
      {/* Bar */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 10px",height:barH,background:mode==="full"?"#111":c.cd,borderBottom:"1px solid "+c.ln,cursor:mode==="pop"?"grab":"default",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:live?"#34A853":c.fa,animation:live?"pulse 1.2s ease infinite":"none"}}/>
          <span style={{fontSize:11,fontWeight:600,color:live?c.gr:c.so}}>{live?"LIVE":"Idle"}</span>
          {live&&<span style={{fontSize:10,color:c.so,marginLeft:2}}>Chromium</span>}
        </div>
        <div style={{display:"flex",gap:4}}>
          {mode!=="pop"&&<button onClick={function(){setMode("pop")}} title="Pop out" style={bBtn(c)}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={c.so} strokeWidth="1.8"><path d="M9 2h5v5M14 2L8 8M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3"/></svg>
          </button>}
          {mode!=="full"&&<button onClick={function(){setMode("full")}} title="Fullscreen" style={bBtn(c)}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={c.so} strokeWidth="1.8"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4"/></svg>
          </button>}
          {mode==="pop"&&<button onClick={function(){setMode("docked")}} title="Dock" style={bBtn(c)}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={c.so} strokeWidth="1.8"><rect x="2" y="2" width="12" height="12" rx="1.5"/><path d="M2 6h12"/></svg>
          </button>}
          {(mode==="full"||mode==="pop")&&<button onClick={function(){setMode(mode==="full"?"docked":"hidden")}} title="Close" style={bBtn(c)}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={c.so} strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8"/></svg>
          </button>}
          {mode==="docked"&&<button onClick={function(){setMode("hidden")}} title="Hide" style={bBtn(c)}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={c.so} strokeWidth="2"><path d="M3 8h10"/></svg>
          </button>}
        </div>
      </div>
      {/* Viewport */}
      <div style={{background:"#0a0a0a",flex:mode==="full"?1:undefined,aspectRatio:mode==="full"?undefined:"16/9",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
        {live?(
          <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:mode==="pop"?(mob?"94%":"90%"):mob?"85%":"65%",background:"#161616",borderRadius:mode==="pop"?4:8,overflow:"hidden",border:"1px solid #333",boxShadow:"0 8px 32px rgba(0,0,0,.5)"}}>
              <div style={{padding:mode==="pop"?"3px 6px":"6px 10px",background:"#1c1c1c",display:"flex",alignItems:"center",gap:mode==="pop"?3:6}}>
                <div style={{display:"flex",gap:mode==="pop"?2:4}}>{["#ff5f57","#febc2e","#28c840"].map(function(co,i){return <div key={i} style={{width:mode==="pop"?5:8,height:mode==="pop"?5:8,borderRadius:"50%",background:co}}/>;})}</div>
                <div style={{flex:1,padding:mode==="pop"?"1px 4px":"3px 8px",borderRadius:4,background:"#111",fontSize:mode==="pop"?7:10,color:"#888",fontFamily:"monospace",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>census.gov/data/datasets/income-poverty</div>
              </div>
              <div style={{padding:mode==="pop"?6:mob?12:20}}>
                <div style={{height:mode==="pop"?5:10,width:"60%",background:"#2a2a2a",borderRadius:3,marginBottom:mode==="pop"?4:8}}/>
                <div style={{height:mode==="pop"?4:8,width:"90%",background:"#222",borderRadius:3,marginBottom:mode==="pop"?3:6}}/>
                <div style={{height:mode==="pop"?4:8,width:"75%",background:"#222",borderRadius:3,marginBottom:mode==="pop"?5:12}}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:mode==="pop"?3:6}}>
                  {[35,55,25].map(function(h,i){return <div key={i} style={{height:mode==="pop"?h*.4:h,background:"linear-gradient(180deg,#F4A261"+(15+i*10)+",#E76F8B15)",borderRadius:3}}/>;})}</div>
                <div style={{height:mode==="pop"?4:8,width:"80%",background:"#222",borderRadius:3,marginTop:mode==="pop"?4:10}}/>
              </div>
            </div>
            {mode!=="pop"&&<div style={{position:"absolute",bottom:mode==="full"?16:8,left:"50%",transform:"translateX(-50%)",fontSize:11,color:"#888",background:"#0a0a0acc",padding:"3px 12px",borderRadius:20}}>Extracting household income data\u2026</div>}
          </div>
        ):(
          <div style={{textAlign:"center",padding:mode==="pop"?10:30}}>
            <div style={{fontSize:mode==="pop"?20:36,marginBottom:mode==="pop"?4:10,opacity:.3}}>{"\u{1F5A5}"}</div>
            {mode!=="pop"&&<><div style={{fontSize:13,color:"#666",marginBottom:4}}>Browser idle</div><div style={{fontSize:11,color:"#555"}}>Activates when Bloomie starts browsing</div></>}
          </div>
        )}
        {live&&<div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.02) 2px,rgba(0,0,0,.02) 4px)",pointerEvents:"none"}}/>}
      </div>

      {/* ── FLOATING COMMAND BAR (fullscreen only) ── */}
      {mode==="full"&&(
        <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:310,display:"flex",flexDirection:"column",alignItems:"center",pointerEvents:"none"}}>
          {/* Fade-in background gradient */}
          <div style={{width:"100%",height:60,background:"linear-gradient(transparent,rgba(0,0,0,.7))",pointerEvents:"none"}}/>
          <div style={{width:"100%",background:"rgba(0,0,0,.7)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",padding:mob?"10px 12px 16px":"12px 20px 20px",pointerEvents:"auto"}}>
            {/* Status line */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:8}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:live?"#34A853":"#888",animation:live?"pulse 1.2s ease infinite":"none"}}/>
              <span style={{fontSize:11,color:"#aaa"}}>{live?"Live \u2022 watching your screen":"Idle"}</span>
              {fMic&&<span style={{fontSize:11,color:"#E76F8B",fontWeight:600}}>{"🎤"} Listening...</span>}
            </div>
            {/* Input row */}
            <div style={{display:"flex",alignItems:"center",gap:8,maxWidth:680,margin:"0 auto"}}>
              <div style={{flex:1,display:"flex",alignItems:"center",background:"rgba(255,255,255,.08)",borderRadius:14,border:"1px solid rgba(255,255,255,.12)",padding:"0 6px",transition:"border .2s"}}>
                <input
                  value={fiV}
                  onChange={function(e){setFiV(e.target.value)}}
                  onKeyDown={function(e){if(e.key==="Enter"&&fiV.trim()){if(onCmd)onCmd(fiV.trim());setFiV("")}}}
                  placeholder={"Tell "+((typeof curAgent!=="undefined"&&curAgent)?curAgent.nm:"agent")+" what to change\u2026"}
                  style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:14,padding:"12px 8px"}}
                />
              </div>
              {/* Voice button — large, glowing when active */}
              <button
                onClick={function(){setFMic(!fMic)}}
                style={{width:44,height:44,borderRadius:"50%",border:fMic?"2px solid #E76F8B":"1.5px solid rgba(255,255,255,.2)",background:fMic?"rgba(231,111,139,.15)":"rgba(255,255,255,.06)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s",boxShadow:fMic?"0 0 16px rgba(231,111,139,.3)":"none"}}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={fMic?"#E76F8B":"#aaa"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="11" rx="3"/>
                  <path d="M5 10a7 7 0 0014 0"/>
                  <line x1="12" y1="17" x2="12" y2="22"/>
                </svg>
              </button>
              {/* Send */}
              {fiV.trim()&&<button
                onClick={function(){if(onCmd)onCmd(fiV.trim());setFiV("")}}
                style={{width:44,height:44,borderRadius:"50%",border:"none",background:"linear-gradient(135deg,#F4A261,#E76F8B)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>}
            </div>
            {/* Hint */}
            <div style={{textAlign:"center",marginTop:6}}>
              <span style={{fontSize:10,color:"#555"}}>Press Esc to exit fullscreen {"\u2022"} Speak or type to direct your agent</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function bBtn(c){return{width:24,height:24,borderRadius:6,border:"1px solid "+c.ln,background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0};}

/* ═══════════════════════════════════════════════════════════════
   PLUS MENU
   ═══════════════════════════════════════════════════════════════ */
function PMenu({c,mob,onClose,onAct}){
  return(
    <div style={{position:"absolute",bottom:"100%",left:0,marginBottom:8,width:mob?"calc(100vw - 24px)":380,maxHeight:440,overflowY:"auto",background:c.cd,borderRadius:16,border:"1px solid "+c.ln,boxShadow:"0 12px 48px rgba(0,0,0,.22)",animation:"pop .2s ease",zIndex:30}}>
      <div style={{padding:"12px 16px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid "+c.ln,position:"sticky",top:0,background:c.cd,zIndex:2}}>
        <span style={{fontSize:14,fontWeight:700,color:c.tx}}>Add to chat</span>
        <button onClick={onClose} style={{width:26,height:26,borderRadius:7,border:"1px solid "+c.ln,background:c.cd,cursor:"pointer",fontSize:13,color:c.so,display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u2715"}</button>
      </div>
      {PLUS.map(function(g,gi){return(
        <div key={gi}>
          <div style={{padding:"10px 16px 4px",fontSize:10,fontWeight:700,color:c.fa,textTransform:"uppercase",letterSpacing:.8}}>{g.s}</div>
          {g.it.map(function(item,ii){return(
            <button key={ii} onClick={function(){onAct(item.a);onClose();}} style={{width:"100%",textAlign:"left",padding:"9px 16px",border:"none",cursor:"pointer",background:"transparent",display:"flex",alignItems:"center",gap:12}} onMouseEnter={function(e){e.currentTarget.style.background=c.hv}} onMouseLeave={function(e){e.currentTarget.style.background="transparent"}}>
              {item.brand?(
                <span style={{width:34,height:34,borderRadius:9,background:item.brand.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,lineHeight:0}}><BrandLogo name={item.l} sz={18}/></span>
              ):(
                <span style={{width:34,height:34,borderRadius:9,background:c.sf,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{item.ic}</span>
              )}
              <div><div style={{fontSize:13,fontWeight:600,color:c.tx}}>{item.l}</div><div style={{fontSize:11,color:c.so,marginTop:1}}>{item.d}</div></div>
            </button>
          );})}
        </div>
      );})}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════ */
function BloomieDashboard(){
  var W=useW(),mob=W<768;
  var _dk=useState(true),dark=_dk[0],setDark=_dk[1];
  var c=mk(dark);

  var _pg=useState("chat"),pg=_pg[0],setPg=_pg[1];
  var _pk=useState("school"),pk=_pk[0],setPk=_pk[1];
  var _biz=useState("bloom"),bizId=_biz[0],setBizId=_biz[1];
  var _bpj=useState("bloombot"),bpjId=_bpj[0],setBpjId=_bpj[1];
  var _agt=useState("sarah"),agtId=_agt[0],setAgtId=_agt[1];
  var _agO=useState(false),agO=_agO[0],setAgO=_agO[1];
  var _bzO=useState(false),bzO=_bzO[0],setBzO=_bzO[1];
  var _bpO=useState(false),bpO=_bpO[0],setBpO=_bpO[1];
  var curBiz=BIZ.find(function(b){return b.id===bizId})||BIZ[0];
  var curBpj=(curBiz.pj||[]).find(function(p){return p.id===bpjId})||(curBiz.pj||[])[0];
  var curAgent=AGENTS.find(function(a){return a.id===agtId})||AGENTS[0];
  var _nw=useState(true),isNew=_nw[0],setNew=_nw[1];
  var _ms=useState([]),ms=_ms[0],setMs=_ms[1];
  var _tx=useState(""),tx=_tx[0],setTx=_tx[1];
  var _si=useState(0),sim=_si[0],setSim=_si[1];
  var _df=useState("recent"),dFilt=_df[0],setDFilt=_df[1];
  var _dp=useState("all"),dProj=_dp[0],setDProj=_dp[1];
  var _pa=useState(null),panel=_pa[0],setPanel=_pa[1];
  var _as=useState("new"),aSess=_as[0],setASess=_as[1];
  var _dv=useState(false),dev=_dv[0],setDev=_dv[1];
  var _dvp=useState("Overview"),dvPg=_dvp[0],setDvPg=_dvp[1];
  var _sb=useState(!mob?"full":"closed"),sbO=_sb[0],setSbO=_sb[1];
  var sbOpen=sbO==="full"||sbO==="mini";
  var _st=useState(false),stO=_st[0],setStO=_st[1];
  var _hlp=useState(false),hlpO=_hlp[0],setHlpO=_hlp[1];
  var _stb=useState("General"),stab=_stb[0],setStab=_stb[1];
  var _md=useState("auto"),mdl=_md[0],setMdl=_md[1];
  var _mn=useState(false),mnO=_mn[0],setMnO=_mn[1];
  var _um=useState(false),umO=_um[0],setUmO=_um[1];
  var _pl=useState(false),plO=_pl[0],setPlO=_pl[1];
  var _scr=useState("docked"),scrM=_scr[0],setScrM=_scr[1];
  var _scrL=useState(true),scrLive=_scrL[0];
  var _vc=useState(false),vcRec=_vc[0],setVcRec=_vc[1];
  var _artFull=useState(false),artFull=_artFull[0],setArtFull=_artFull[1];
  var _rating=useState(null),rating=_rating[0],setRating=_rating[1];
  var _rated=useState(false),rated=_rated[0],setRated=_rated[1];
  var _chatW=useState(340),chatW=_chatW[0],setChatW=_chatW[1];
  var dragRef=useRef(null);
  var vcRef=useRef(null);
  var btm=useRef(null),fRef=useRef(null);
  var pj=PJ.find(function(p){return p.id===pk});

  useEffect(function(){if(btm.current){setTimeout(function(){btm.current&&btm.current.scrollIntoView({behavior:"smooth"})},100);}},[ms]);
  useEffect(function(){if(pg!=="home")return;var t=setInterval(function(){setSim(function(s){return s<3?s+1:s})},3000);return function(){clearInterval(t)};},[pg]);

  /* ── Drag to resize chat/screen split ── */
  function startDrag(e){
    e.preventDefault();
    var startX=e.clientX||e.touches[0].clientX,startW=chatW;
    function onMove(ev){
      var x=ev.clientX||((ev.touches&&ev.touches[0])?ev.touches[0].clientX:startX);
      var nw=startW+(x-startX);
      setChatW(Math.max(150,Math.min(nw,800)));
    }
    function onUp(){document.removeEventListener("mousemove",onMove);document.removeEventListener("mouseup",onUp);document.removeEventListener("touchmove",onMove);document.removeEventListener("touchend",onUp);document.body.style.cursor="";document.body.style.userSelect="";}
    document.body.style.cursor="col-resize";document.body.style.userSelect="none";
    document.addEventListener("mousemove",onMove);document.addEventListener("mouseup",onUp);document.addEventListener("touchmove",onMove);document.addEventListener("touchend",onUp);
  }
  useEffect(function(){if(!umO)return;var h=function(){setUmO(false)};setTimeout(function(){document.addEventListener("click",h)},0);return function(){document.removeEventListener("click",h)};},[umO]);
  useEffect(function(){if(!bzO)return;var h=function(){setBzO(false)};setTimeout(function(){document.addEventListener("click",h)},0);return function(){document.removeEventListener("click",h)};},[bzO]);
  useEffect(function(){if(!bpO)return;var h=function(){setBpO(false)};setTimeout(function(){document.addEventListener("click",h)},0);return function(){document.removeEventListener("click",h)};},[bpO]);
  useEffect(function(){if(!agO)return;var h=function(){setAgO(false)};setTimeout(function(){document.addEventListener("click",h)},0);return function(){document.removeEventListener("click",h)};},[agO]);

  var load=function(sid){setASess(sid);if(sid==="new"){setNew(true);setMs([]);return;}setNew(false);if(mob)setSbO(false);
    if(sid==="s1"){setMs([{id:1,b:true,t:"Hey Charles! I've been working since 7:30 this morning. The Eventbrite is done, and I'm making progress on three things right now.",tm:"8:02 AM"},{id:2,tp:"working"},{id:3,b:false,t:"Nice! Finish the landing page first, then make me the graphics.",tm:"8:15 AM"},{id:4,b:true,t:"Got it. Landing page first, then all 5 graphic sizes by 3pm. I'll send each one for your approval.",tm:"8:15 AM"},{id:5,tp:"done",nm:"Eventbrite Listing",ic:"\u{1F3A4}",did:6},{id:6,b:true,t:"I also finished drafting that confirmation email to the venue. Take a look and approve it if it's good to send.",tm:"8:18 AM"},{id:7,tp:"artifact",ad:DL[6]}]);}
    else{setMs([{id:1,b:true,t:"This is the conversation from \""+(SS.find(function(s){return s.id===sid})||{}).tl+"\". Previous messages would load here.",tm:"Earlier"}]);}};

  var send=function(){if(!tx.trim())return;var t=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});if(isNew){setNew(false);setASess("s1");}setMs(function(p){return p.concat([{id:Date.now(),b:false,t:tx,tm:t}])});setTx("");
    setTimeout(function(){var tm=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});setMs(function(p){return p.concat([{id:Date.now(),b:true,t:"On it, Charles. I\u2019ll show you the progress right here.",tm:tm},{id:Date.now()+1,tp:"working"}])});},1200);
    setTimeout(function(){var tm=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});setMs(function(p){return p.concat([{id:Date.now(),tp:"done",nm:"Eventbrite Listing",ic:"\u{1F517}",did:6},{id:Date.now()+1,b:true,t:"The Eventbrite is live! I also finished the venue confirmation email. Take a look and approve it if it\u2019s good to send.",tm:tm},{id:Date.now()+2,tp:"artifact",ad:DL[6]}])});},4000);
  };

  var plusAct=function(a){if(a==="upload"){if(fRef.current)fRef.current.click();return;}var t=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});var lb={camera:"Opening camera\u2026",voice:"Recording voice message\u2026",local:"Opening file browser \u2014 select a folder to share with Bloomie.",gdrive:"Connecting to Google Drive\u2026",dropbox:"Connecting to Dropbox\u2026",notion:"Connecting to Notion\u2026",github:"Connecting to GitHub\u2026",onedrive:"Connecting to OneDrive\u2026",sk_browser:"What should I look up?",sk_code:"What should the script do?",sk_sheet:"What data should I put in the spreadsheet?",sk_pptx:"What's the presentation about?",sk_doc:"What kind of document do you need?",sk_chart:"What data should I visualize?",sk_deploy:"What should I publish to the web?"};setMs(function(p){return p.concat([{id:Date.now(),b:true,t:lb[a]||"Starting "+a+"\u2026",tm:t}])});if(a==="sk_browser"&&scrM==="hidden")setScrM("docked");};

  var onFile=function(e){var f=e.target.files;if(!f||!f.length)return;var t=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});var n=Array.from(f).map(function(x){return x.name}).join(", ");setMs(function(p){return p.concat([{id:Date.now(),b:false,t:"\u{1F4CE} Shared: "+n,tm:t},{id:Date.now()+1,b:true,t:"Got it! I can see "+(f.length>1?"those files":"\""+f[0].name+"\"")+". What would you like me to do with "+(f.length>1?"them":"it")+"?",tm:t}])});e.target.value="";};

  var toggleVoice=function(){
    if(vcRec){/* stop */if(vcRef.current){try{vcRef.current.stop();}catch(e){}}setVcRec(false);return;}
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setMs(function(p){return p.concat([{id:Date.now(),b:true,t:"Voice input isn\u2019t supported in this browser. Try Chrome or Edge for speech recognition.",tm:new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}])});return;}
    var r=new SR();r.continuous=false;r.interimResults=true;r.lang="en-US";
    r.onresult=function(ev){var t="";for(var i=0;i<ev.results.length;i++){t+=ev.results[i][0].transcript;}setTx(t);};
    r.onend=function(){setVcRec(false);vcRef.current=null;};
    r.onerror=function(){setVcRec(false);vcRef.current=null;};
    vcRef.current=r;r.start();setVcRec(true);
  };;

  var approve=function(){if(!panel)return;setRated(true);};
  var submitRating=function(){if(!panel)return;var t=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});var a=panel;var stars=rating||5;setMs(function(p){return p.concat([{id:Date.now(),tp:"done",nm:a.nm,ic:a.ic,did:a.id},{id:Date.now()+1,b:true,t:'"'+a.nm+'" is approved and saved! Thanks for the '+stars+'-star rating \u2014 helps me learn what you like.',tm:t}])});setPanel(null);setRated(false);setRating(null);};
  var skipRating=function(){if(!panel)return;var t=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});var a=panel;setMs(function(p){return p.concat([{id:Date.now(),tp:"done",nm:a.nm,ic:a.ic,did:a.id},{id:Date.now()+1,b:true,t:'"'+a.nm+'" is approved and saved!',tm:t}])});setPanel(null);setRated(false);setRating(null);};
  var openPanel=function(d){setPanel(d);setRated(false);setRating(null);setArtFull(false);};
  var revise=function(){if(!panel)return;var t=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});setMs(function(p){return p.concat([{id:Date.now(),b:true,t:"No problem \u2014 what would you like me to change on \""+panel.nm+"\"?",tm:t}])});setPanel(null);setRated(false);setRating(null);setPg("chat");};

  var tMdl={"Demographic Research":"sonnet","Chapter 2: Why Classical Education":"opus","Building the Landing Page":"sonnet"};
  var allW=PJ.map(function(p){var m=mdl==="auto"?(tMdl[p.at.nm]||"sonnet"):mdl;return{nm:p.at.nm,ic:p.ic,cl:p.cl,pct:p.at.pct,tm:p.at.tm,mdl:MN[m]||m}});

  var gSim=function(steps){return steps.map(function(s){if(s.d)return s;var pi=steps.filter(function(x){return!x.d}).indexOf(s);if(pi<sim)return Object.assign({},s,{d:true,a:false,tm:"Just now"});if(pi===sim)return Object.assign({},s,{a:true});return Object.assign({},s,{a:false});});};
  var sSteps=gSim(pj.at.steps);
  var sDone=sSteps.filter(function(s){return s.d}).length;
  var sPct=Math.round((sDone/sSteps.length)*100);
  var gFilt=function(){var it=DL.slice();if(dProj!=="all")it=it.filter(function(d){return d.pj===dProj});if(dFilt==="recent")it.sort(function(a,b){return b.ds.localeCompare(a.ds)});if(dFilt==="oldest")it.sort(function(a,b){return a.ds.localeCompare(b.ds)});return it;};
  var shP=panel!==null;

  return(
    <div style={{minHeight:"100vh",background:c.bg,fontFamily:"'Inter',system-ui,-apple-system,sans-serif",color:c.tx}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes bloomGlow{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}@keyframes pop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}@keyframes slideL{from{transform:translateX(-100%)}to{transform:translateX(0)}}@keyframes bloomieWiggle{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}*{box-sizing:border-box;margin:0;padding:0}input:focus,button:focus{outline:none}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:"+c.ln+";border-radius:10px}"}</style>
      <input ref={fRef} type="file" multiple style={{display:"none"}} onChange={onFile}/>

      {/* ── HEADER ── */}
      <div style={{padding:mob?"8px 12px":"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:c.cd,borderBottom:"1px solid "+c.ln,position:"sticky",top:0,zIndex:60,gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:mob?6:10}}>
          {pg==="chat"&&<button onClick={function(){setSbO(sbO==="full"?"mini":sbO==="mini"?"closed":"full")}} style={{width:32,height:32,borderRadius:8,border:"1px solid "+c.ln,background:c.cd,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:c.so,flexShrink:0}}>{"\u2630"}</button>}
          <img src={BLOOMIE_IMG} alt="Bloomie" style={{width:mob?28:32,height:mob?28:32,objectFit:"contain",flexShrink:0,animation:"bloomieWiggle 3s ease-in-out infinite"}}/>
          {!mob&&<span style={{fontSize:16,fontWeight:700,color:c.tx}}>Bloomie</span>}
          {!mob&&<span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:6,background:"#E76F8B20",color:"#E76F8B",letterSpacing:.5}}>BETA</span>}
        </div>

        {/* ── CENTER: Tabs then Biz+Project together ── */}
        <div style={{display:"flex",alignItems:"center",gap:mob?6:12,flexWrap:"nowrap"}}>

          {/* Page tabs */}
          <div style={{display:"flex",gap:mob?2:4,background:c.sf,padding:3,borderRadius:10}}>
            {[{k:"chat",l:mob?"\u{1F4AC}":"\u{1F4AC} Chat"},{k:"home",l:mob?"\u{1F4CA}":"\u{1F4CA} Status"},{k:"files",l:mob?"\u{1F4C1}":"\u{1F4C1} Files"}].map(function(t){return <button key={t.k} onClick={function(){setPg(t.k)}} style={{padding:mob?"7px 10px":"7px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:pg===t.k?c.cd:"transparent",color:pg===t.k?c.tx:c.so,boxShadow:pg===t.k?"0 1px 4px rgba(0,0,0,.06)":"none"}}>{t.l}</button>})}
          </div>

          {/* Divider */}
          {!mob&&<div style={{width:1,height:28,background:c.ln,flexShrink:0}}/>}

          {/* Business + Project dropdowns together */}
          <div style={{display:"flex",gap:mob?4:6,alignItems:"flex-end"}}>

            {/* Business */}
            <div style={{position:"relative",display:"flex",flexDirection:"column",alignItems:mob?"center":"flex-start"}}>
              {!mob&&<div style={{fontSize:9,fontWeight:700,color:c.fa,textTransform:"uppercase",letterSpacing:.8,marginBottom:2,userSelect:"none"}}>Business</div>}
              <button onClick={function(e){e.stopPropagation();setBzO(!bzO);setBpO(false)}} style={{padding:mob?"7px 8px":"5px 10px",borderRadius:8,border:"1.5px dashed "+(bzO?curBiz.cl:c.ln),background:bzO?curBiz.cl+"12":c.cd,cursor:"pointer",fontSize:12,fontWeight:600,color:bzO?curBiz.cl:c.so,display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",transition:"all .15s"}}>
                <span style={{fontSize:14}}>{curBiz.ic}</span>{!mob&&curBiz.nm}<span style={{fontSize:10,opacity:.5,transform:bzO?"rotate(180deg)":"none",transition:"transform .2s"}}>{"\u25BC"}</span>
              </button>
              {bzO&&<div style={{position:"absolute",top:"100%",left:0,marginTop:6,width:220,background:c.cd,borderRadius:12,border:"1px solid "+c.ln,boxShadow:"0 12px 40px rgba(0,0,0,.22)",overflow:"hidden",animation:"pop .2s ease",zIndex:90}}>
                <div style={{padding:"10px 14px",borderBottom:"1px solid "+c.ln}}><div style={{fontSize:10,fontWeight:700,color:c.fa,textTransform:"uppercase",letterSpacing:.5}}>Business</div></div>
                {BIZ.map(function(b){var sel=b.id===bizId;return <button key={b.id} onClick={function(e){e.stopPropagation();setBizId(b.id);setBpjId((b.pj||[])[0]?b.pj[0].id:"");setBzO(false);setPg("home");setSim(0)}} style={{width:"100%",padding:"10px 14px",border:"none",cursor:"pointer",background:sel?b.cl+"12":"transparent",display:"flex",alignItems:"center",gap:10,textAlign:"left",transition:"background .1s"}} onMouseEnter={function(e){if(!sel)e.currentTarget.style.background=c.hv}} onMouseLeave={function(e){if(!sel)e.currentTarget.style.background="transparent"}}>
                  <span style={{width:28,height:28,borderRadius:8,background:b.cl+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{b.ic}</span>
                  <div><div style={{fontSize:13,fontWeight:sel?700:500,color:sel?b.cl:c.tx}}>{b.nm}</div><div style={{fontSize:10,color:c.so}}>{b.pj.length} projects</div></div>
                  {sel&&<span style={{marginLeft:"auto",fontSize:14,color:b.cl}}>{"\u2713"}</span>}
                </button>})}
                <div style={{padding:"8px 14px",borderTop:"1px solid "+c.ln}}><button style={{width:"100%",padding:"8px",borderRadius:8,border:"1.5px dashed "+c.ac+"40",background:"transparent",cursor:"pointer",fontSize:12,color:c.ac,fontWeight:600}}>+ Add Business</button></div>
              </div>}
            </div>

            {/* Project */}
            <div style={{position:"relative",display:"flex",flexDirection:"column",alignItems:mob?"center":"flex-start"}}>
              {!mob&&<div style={{fontSize:9,fontWeight:700,color:c.fa,textTransform:"uppercase",letterSpacing:.8,marginBottom:2,userSelect:"none"}}>Project</div>}
              <button onClick={function(e){e.stopPropagation();setBpO(!bpO);setBzO(false)}} style={{padding:mob?"7px 8px":"5px 10px",borderRadius:8,border:"1.5px dashed "+(bpO?curBiz.cl:c.ln),background:bpO?curBiz.cl+"12":c.cd,cursor:"pointer",fontSize:12,fontWeight:600,color:bpO?curBiz.cl:c.so,display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",transition:"all .15s"}}>
                <span style={{fontSize:14}}>{curBpj?curBpj.ic:"\u{1F4C2}"}</span>{!mob&&(curBpj?curBpj.nm:"Project")}<span style={{fontSize:10,opacity:.5,transform:bpO?"rotate(180deg)":"none",transition:"transform .2s"}}>{"\u25BC"}</span>
              </button>
              {bpO&&<div style={{position:"absolute",top:"100%",right:0,marginTop:6,width:220,background:c.cd,borderRadius:12,border:"1px solid "+c.ln,boxShadow:"0 12px 40px rgba(0,0,0,.22)",overflow:"hidden",animation:"pop .2s ease",zIndex:90}}>
                <div style={{padding:"10px 14px",borderBottom:"1px solid "+c.ln}}><div style={{fontSize:10,fontWeight:700,color:c.fa,textTransform:"uppercase",letterSpacing:.5}}>{curBiz.nm} Projects</div></div>
                {(curBiz.pj||[]).map(function(p){var sel=curBpj&&p.id===curBpj.id;return <button key={p.id} onClick={function(e){e.stopPropagation();setBpjId(p.id);setBpO(false);setPg("home");setSim(0)}} style={{width:"100%",padding:"10px 14px",border:"none",cursor:"pointer",background:sel?curBiz.cl+"12":"transparent",display:"flex",alignItems:"center",gap:10,textAlign:"left",transition:"background .1s"}} onMouseEnter={function(e){if(!sel)e.currentTarget.style.background=c.hv}} onMouseLeave={function(e){if(!sel)e.currentTarget.style.background="transparent"}}>
                  <span style={{fontSize:15}}>{p.ic}</span>
                  <span style={{fontSize:13,fontWeight:sel?700:500,color:sel?curBiz.cl:c.tx}}>{p.nm}</span>
                  {sel&&<span style={{marginLeft:"auto",fontSize:14,color:curBiz.cl}}>{"\u2713"}</span>}
                </button>})}
                <div style={{padding:"8px 14px",borderTop:"1px solid "+c.ln}}><button style={{width:"100%",padding:"8px",borderRadius:8,border:"1.5px dashed "+c.ac+"40",background:"transparent",cursor:"pointer",fontSize:12,color:c.ac,fontWeight:600}}>+ Add Project</button></div>
              </div>}
            </div>

          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,position:"relative"}}>
          {scrM==="hidden"&&<button onClick={function(){setScrM("docked")}} title="Show screen" style={{width:32,height:32,borderRadius:8,border:"1px solid "+c.ln,background:c.cd,cursor:"pointer",fontSize:14,color:c.so,display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u{1F5A5}"}</button>}
          <button onClick={function(){setUmO(!umO)}} style={{width:36,height:36,borderRadius:"50%",border:umO?"2px solid "+c.ac:"2px solid "+c.ln,background:"linear-gradient(135deg,#F4A261,#E76F8B)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff",transition:"border-color .15s"}}>C</button>
          {umO&&(
            <div style={{position:"absolute",top:"100%",right:0,marginTop:8,width:220,background:c.cd,borderRadius:14,border:"1px solid "+c.ln,boxShadow:"0 12px 40px rgba(0,0,0,.22)",overflow:"hidden",animation:"pop .2s ease",zIndex:80}}>
              <div style={{padding:"14px 16px",borderBottom:"1px solid "+c.ln,display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#F4A261,#E76F8B)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0}}>C</div>
                <div><div style={{fontSize:13,fontWeight:700,color:c.tx}}>Charles</div><div style={{fontSize:11,color:c.so}}>Owner</div></div>
              </div>
              <button onClick={function(){setUmO(false);setDark(!dark)}} style={{width:"100%",textAlign:"left",padding:"11px 16px",border:"none",cursor:"pointer",background:"transparent",fontSize:13,color:c.tx,display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid "+c.ln}} onMouseEnter={function(e){e.currentTarget.style.background=c.hv}} onMouseLeave={function(e){e.currentTarget.style.background="transparent"}}>
                <span style={{fontSize:16}}>{dark?"\u2600\uFE0F":"\u{1F319}"}</span>{dark?"Light mode":"Dark mode"}
              </button>
              <button onClick={function(){setUmO(false);setStO(true)}} style={{width:"100%",textAlign:"left",padding:"11px 16px",border:"none",cursor:"pointer",background:"transparent",fontSize:13,color:c.tx,display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid "+c.ln}} onMouseEnter={function(e){e.currentTarget.style.background=c.hv}} onMouseLeave={function(e){e.currentTarget.style.background="transparent"}}>
                <span style={{fontSize:16}}>{"\u2699\uFE0F"}</span>Settings
              </button>
              <button onClick={function(){setUmO(false);setDev(!dev)}} style={{width:"100%",textAlign:"left",padding:"11px 16px",border:"none",cursor:"pointer",background:"transparent",fontSize:13,color:dev?c.ac:c.tx,display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid "+c.ln}} onMouseEnter={function(e){e.currentTarget.style.background=c.hv}} onMouseLeave={function(e){e.currentTarget.style.background="transparent"}}>
                <span style={{fontSize:16}}>{"\u{1F4BB}"}</span>Developer mode{dev?" (ON)":""}
              </button>
              <button style={{width:"100%",textAlign:"left",padding:"11px 16px",border:"none",cursor:"pointer",background:"transparent",fontSize:13,color:"#D44",display:"flex",alignItems:"center",gap:10}} onMouseEnter={function(e){e.currentTarget.style.background=c.hv}} onMouseLeave={function(e){e.currentTarget.style.background="transparent"}}>
                <span style={{fontSize:16}}>{"\u{1F6AA}"}</span>Log out
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{display:"flex",position:"relative"}}>
        {/* Mobile sidebar backdrop */}
        {pg==="chat"&&sbO==="full"&&mob&&<div onClick={function(){setSbO("closed")}} style={{position:"fixed",inset:0,top:52,background:"rgba(0,0,0,.3)",zIndex:45}}/>}

        {/* ── SIDEBAR ── */}
        {pg==="chat"&&sbOpen&&(
          <div style={mob?{position:"fixed",top:52,left:0,bottom:0,zIndex:50,animation:"slideL .2s ease"}:{}}>
            <div style={{width:sbO==="mini"?60:260,height:"calc(100vh - 52px)",background:c.cd,borderRight:"1px solid "+c.ln,display:"flex",flexDirection:"column",flexShrink:0,transition:"width .2s ease",overflow:"hidden"}}>

              {/* ── MINI SIDEBAR (icon strip) ── */}
              {sbO==="mini"&&!dev&&(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"12px 0",gap:4,flex:1}}>
                  <button onClick={function(){load("new")}} title="New chat" style={{width:40,height:40,borderRadius:10,border:"1.5px dashed "+c.ln,background:"transparent",cursor:"pointer",fontSize:16,color:c.so,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  <button onClick={function(){if(AGENTS.length>1)setSbO("full")}} title={curAgent.nm} style={{width:40,height:40,borderRadius:10,border:"none",background:"transparent",cursor:"pointer",padding:2,marginTop:4}}>
                    <Face sz={36} agent={curAgent}/>
                  </button>
                  <div style={{width:32,height:1,background:c.ln,margin:"6px 0"}}/>
                  {SS.slice(0,6).map(function(s,i){return(
                    <button key={s.id} onClick={function(){load(s.id)}} title={s.tl} style={{width:40,height:40,borderRadius:10,border:"none",background:aSess===s.id?c.ac+"15":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:aSess===s.id?c.ac:c.so}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    </button>
                  )})}
                  <div style={{flex:1}}/>
                  {/* Autopilot mini dot */}
                  <button onClick={function(){setPg("home")}} title="Autopilot · 5 jobs" style={{width:40,height:40,borderRadius:10,border:"none",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.so} strokeWidth="2"><path d="M12 8v4l3 3M3 12a9 9 0 1018 0 9 9 0 00-18 0"/></svg>
                    <span style={{position:"absolute",top:8,right:8,width:6,height:6,borderRadius:"50%",background:c.gr,animation:"pulse 1.5s ease infinite"}}/>
                  </button>
                  {/* Settings */}
                  <button onClick={function(){setStO(true)}} title="Settings" style={{width:40,height:40,borderRadius:10,border:"none",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:c.so}}>{"\u2699"}</button>
                  {/* User */}
                  <button onClick={function(){setSbO("full")}} title="Charles" style={{width:40,height:40,borderRadius:10,border:"none",background:c.sf,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:c.tx}}>C</button>
                </div>
              )}

              {/* ── FULL SIDEBAR ── */}
              {sbO==="full"&&!dev?(
                <>
                  <div style={{padding:"14px 14px 8px"}}><button onClick={function(){load("new")}} style={{width:"100%",padding:"10px 0",borderRadius:10,border:"1.5px dashed "+c.ln,background:"transparent",cursor:"pointer",fontSize:13,fontWeight:600,color:c.so}}>+ New chat</button></div>
                  {/* Agent switcher card */}
                  <div style={{margin:"0 14px 10px",position:"relative"}}>
                    <button onClick={function(e){e.stopPropagation();if(AGENTS.length>1)setAgO(!agO)}} style={{width:"100%",padding:"10px 12px",borderRadius:12,background:agO?curAgent.grad.replace("linear-gradient","linear-gradient")+"08":c.sf,border:agO?"1.5px solid "+c.ac:"1px solid "+c.ln,cursor:AGENTS.length>1?"pointer":"default",display:"flex",alignItems:"center",gap:10,textAlign:"left",transition:"all .15s"}}>
                      <Face sz={36} agent={curAgent} editable/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700,color:c.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{curAgent.nm}</div>
                        <div style={{fontSize:11,color:c.so}}>{curAgent.role}</div>
                        <div style={{fontSize:10,color:curAgent.status==="online"?c.gr:curAgent.status==="idle"?c.ac:c.fa,display:"flex",alignItems:"center",gap:4,marginTop:2}}>
                          <span style={{width:5,height:5,borderRadius:"50%",background:curAgent.status==="online"?c.gr:curAgent.status==="idle"?c.ac:c.fa,animation:curAgent.status==="online"?"pulse 1.5s ease infinite":"none"}}/>
                          {curAgent.status==="online"?"Online":curAgent.status==="idle"?"Idle":"Offline"}
                        </div>
                      </div>
                      {AGENTS.length>1&&<span style={{fontSize:10,color:c.fa,transform:agO?"rotate(180deg)":"none",transition:"transform .2s"}}>{"\u25BC"}</span>}
                    </button>
                    {agO&&<div style={{position:"absolute",top:"100%",left:0,right:0,marginTop:4,background:c.cd,borderRadius:12,border:"1px solid "+c.ln,boxShadow:"0 12px 40px rgba(0,0,0,.22)",overflow:"hidden",animation:"pop .2s ease",zIndex:30}}>
                      <div style={{padding:"8px 12px",borderBottom:"1px solid "+c.ln}}><div style={{fontSize:9,fontWeight:700,color:c.fa,textTransform:"uppercase",letterSpacing:.8}}>Your Agents ({AGENTS.length})</div></div>
                      {AGENTS.map(function(ag){var sel=ag.id===agtId;var stCl=ag.status==="online"?c.gr:ag.status==="idle"?c.ac:c.fa;return(
                        <button key={ag.id} onClick={function(e){e.stopPropagation();setAgtId(ag.id);setAgO(false);setNew(true);setMs([]);setASess("new")}} style={{width:"100%",padding:"10px 12px",border:"none",cursor:"pointer",background:sel?c.ac+"12":"transparent",display:"flex",alignItems:"center",gap:10,textAlign:"left",transition:"background .1s"}} onMouseEnter={function(e){if(!sel)e.currentTarget.style.background=c.hv}} onMouseLeave={function(e){if(!sel)e.currentTarget.style.background="transparent"}}>
                          <Face sz={32} agent={ag}/>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:12,fontWeight:sel?700:500,color:sel?c.tx:c.so,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ag.nm}</div>
                            <div style={{fontSize:10,color:c.so}}>{ag.role}</div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:4}}>
                            <span style={{width:6,height:6,borderRadius:"50%",background:stCl,animation:ag.status==="online"?"pulse 1.5s ease infinite":"none"}}/>
                            {sel&&<span style={{fontSize:12,color:c.ac}}>{"\u2713"}</span>}
                          </div>
                        </button>
                      )})}
                      <div style={{padding:"8px 12px",borderTop:"1px solid "+c.ln}}><button style={{width:"100%",padding:"7px",borderRadius:8,border:"1.5px dashed "+c.ac+"40",background:"transparent",cursor:"pointer",fontSize:11,color:c.ac,fontWeight:600}}>+ Add Agent</button></div>
                    </div>}
                  </div>
                  {/* Autopilot mini-strip */}
                  <div style={{margin:"0 14px 8px",padding:"8px 10px",borderRadius:10,background:c.sf,border:"1px solid "+c.ln,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={function(){setPg("home")}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:c.gr,animation:"pulse 1.5s ease infinite",flexShrink:0}}/>
                    <span style={{fontSize:11,fontWeight:600,color:c.tx}}>Autopilot</span>
                    <span style={{fontSize:10,color:c.so,flex:1}}>{CRONS.filter(function(j){return j.on}).length} jobs</span>
                    <span style={{fontSize:9,color:c.gr,fontWeight:600}}>{"\u2713"} All OK</span>
                  </div>
                  <div style={{flex:1,overflowY:"auto",padding:"4px 10px"}}>
                    {SS.map(function(s){var act=s.id===aSess;return <button key={s.id} onClick={function(){load(s.id)}} style={{width:"100%",textAlign:"left",padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",marginBottom:2,background:act?c.ac+"12":"transparent",display:"flex",flexDirection:"column",gap:2}}><div style={{fontSize:13,fontWeight:act?600:500,color:act?c.tx:c.so,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",width:"100%"}}>{s.tl}</div><div style={{fontSize:11,color:c.fa}}>{s.tm}</div></button>})}
                  </div>
                </>
              ):(sbO==="full"&&dev?(
                <div style={{flex:1,overflowY:"auto",padding:"8px 10px"}}>
                  <button onClick={function(){setDev(false)}} style={{width:"100%",textAlign:"left",padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",background:"#E76F8B12",marginBottom:12,fontSize:13,fontWeight:600,color:"#E76F8B"}}>{"\u25C0"} Back to Chat</button>
                  {DNAV.map(function(g){return(<div key={g.s} style={{marginBottom:16}}><div style={{fontSize:11,fontWeight:600,color:c.fa,padding:"6px 12px",textTransform:"uppercase",letterSpacing:.5}}>{g.s}</div>{g.it.map(function(it){var act=dvPg===it.l;return <button key={it.l} onClick={function(){setDvPg(it.l)}} style={{width:"100%",textAlign:"left",padding:"9px 12px",borderRadius:8,border:"none",cursor:"pointer",marginBottom:1,background:act?c.ac+"12":"transparent",fontSize:13,fontWeight:act?600:500,color:act?c.tx:c.so}}><span style={{marginRight:10}}>{it.ic}</span>{it.l}</button>})}</div>)})}
                </div>
              ):null)}
              {sbO==="full"&&(<div style={{padding:"10px 14px",borderTop:"1px solid "+c.ln,position:"relative"}}>
                {mnO&&(<div style={{position:"absolute",bottom:"100%",left:10,right:10,marginBottom:6,background:c.cd,borderRadius:12,border:"1px solid "+c.ln,boxShadow:"0 8px 30px rgba(0,0,0,.18)",overflow:"hidden",animation:"pop .2s ease",zIndex:20}}>
                  <button onClick={function(){setMnO(false);setStO(true)}} style={{width:"100%",textAlign:"left",padding:"11px 16px",border:"none",cursor:"pointer",background:"transparent",fontSize:13,color:c.tx,borderBottom:"1px solid "+c.ln}}>{"\u2699\uFE0F"} Settings</button>
                  <button onClick={function(){setMnO(false);setDev(!dev)}} style={{width:"100%",textAlign:"left",padding:"11px 16px",border:"none",cursor:"pointer",background:"transparent",fontSize:13,color:dev?c.ac:c.tx,borderBottom:"1px solid "+c.ln}}>{"\u{1F4BB}"} Developer Mode{dev?" (ON)":""}</button>
                  <button onClick={function(){setMnO(false);setDark(!dark)}} style={{width:"100%",textAlign:"left",padding:"11px 16px",border:"none",cursor:"pointer",background:"transparent",fontSize:13,color:c.tx,borderBottom:"1px solid "+c.ln}}>{dark?"\u2600\uFE0F":"\u{1F319}"} {dark?"Light Mode":"Dark Mode"}</button>
                  <button style={{width:"100%",textAlign:"left",padding:"11px 16px",border:"none",cursor:"pointer",background:"transparent",fontSize:13,color:c.so}}>{"\u{1F6AA}"} Log out</button>
                </div>)}
                <button onClick={function(){setMnO(!mnO)}} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",background:mnO?c.hv:"transparent",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:32,height:32,borderRadius:8,background:c.sf,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:c.tx}}>C</div>
                  <div style={{flex:1,textAlign:"left"}}><div style={{fontSize:13,fontWeight:600,color:c.tx}}>Charles</div><div style={{fontSize:11,color:c.so}}>Owner</div></div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.so} strokeWidth="2" strokeLinecap="round" style={{transform:mnO?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s",flexShrink:0}}><path d="M6 9l6 6 6-6"/></svg>
                </button>
              </div>)}
            </div>
          </div>
        )}

        {/* ── MAIN ── */}
        <div style={{flex:1,maxWidth:shP&&!mob?"calc(100% - 480px)":undefined,transition:"max-width .25s ease",minWidth:0}}>

          {/* CHAT */}
          {pg==="chat"&&!dev&&(
            <div style={{height:"calc(100vh - 52px)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
              {/* Chat header — only when in active conversation */}
              {!isNew&&(<div style={{padding:mob?"8px 12px":"10px 16px",display:"flex",alignItems:"center",gap:mob?8:10,borderBottom:"1px solid "+c.ln,background:c.cd,flexShrink:0}}>
                <Face sz={mob?28:32} agent={curAgent}/>
                <div style={{flex:1}}><div style={{fontSize:mob?14:15,fontWeight:700,color:c.tx}}>{curAgent.nm}</div><div style={{fontSize:11,color:c.gr,display:"flex",alignItems:"center",gap:5}}><span style={{width:6,height:6,borderRadius:"50%",background:c.gr,animation:"pulse 1.5s ease infinite"}}/> Online</div></div>
                <select value={mdl} onChange={function(e){setMdl(e.target.value)}} style={{padding:"6px 10px",borderRadius:8,border:"1px solid "+c.ln,background:c.sf,fontSize:12,color:c.so,cursor:"pointer"}}><option value="auto">Auto</option><option value="opus">Opus</option><option value="sonnet">Sonnet</option><option value="haiku">Haiku</option></select>
              </div>)}

              {/* Welcome screen — full width centered */}
              {isNew?(
                <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:mob?"20px 16px":"40px 20px"}}>
                  <div style={{width:"100%",maxWidth:620,textAlign:"center"}}>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><Face sz={mob?64:80} agent={curAgent}/></div>
                    <h2 style={{fontSize:mob?22:28,fontWeight:700,color:c.tx,marginTop:18,marginBottom:6}}>What can I help you with?</h2>
                    <p style={{fontSize:mob?13:15,color:c.so,marginBottom:28}}>Tell {curAgent.nm.split(" ")[0]} what you need — {curAgent.nm.split(" ")[0]==="Sarah"?"she":"he"}'ll get to work.</p>
                    <div style={{position:"relative",marginBottom:20}}>
                      {plO&&<PMenu c={c} mob={mob} onClose={function(){setPlO(false)}} onAct={plusAct}/>}
                      <div style={{display:"flex",gap:mob?6:10,alignItems:"center"}}>
                        <button onClick={function(){setPlO(!plO)}} style={{width:44,height:44,borderRadius:12,border:"1.5px solid "+(plO?c.ac:c.ln),background:plO?c.ac+"15":c.cd,cursor:"pointer",fontSize:22,fontWeight:300,color:plO?c.ac:c.so,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s ease"}}>+</button>
                        <input value={tx} onChange={function(e){setTx(e.target.value)}} onKeyDown={function(e){if(e.key==="Enter")send()}} placeholder={vcRec?"Listening\u2026":"Ask anything..."} style={{flex:1,padding:mob?"12px 14px":"14px 18px",borderRadius:14,border:"1.5px solid "+(vcRec?c.ac:c.ln),fontSize:15,fontFamily:"inherit",background:c.inp,color:c.tx,transition:"border-color .2s"}}/>
                        <button onClick={toggleVoice} style={{width:44,height:44,borderRadius:12,border:vcRec?"2px solid "+c.ac:"1.5px solid "+c.ln,cursor:"pointer",background:vcRec?c.ac+"18":c.cd,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s ease",position:"relative"}}>
                          {vcRec&&<span style={{position:"absolute",inset:-4,borderRadius:16,border:"2px solid "+c.ac,animation:"pulse 1.2s ease infinite",opacity:.4}}/>}
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={vcRec?c.ac:c.so} strokeWidth="2" strokeLinecap="round"><rect x="9" y="1" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0"/><path d="M12 17v4M8 21h8"/></svg>
                        </button>
                        <button onClick={send} style={{width:44,height:44,borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#F4A261,#E76F8B)",color:"#fff",fontSize:18,fontWeight:700,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u279C"}</button>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:24}}>
                      {["Draft a grant application","Send a follow-up email","Research competitors","Build me a landing page"].map(function(s,i){
                        return <button key={i} onClick={function(){setTx(s)}} style={{padding:"8px 16px",borderRadius:20,border:"1px solid "+c.ln,background:c.cd,cursor:"pointer",fontSize:12,color:c.so,transition:"border-color .15s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=c.ac}} onMouseLeave={function(e){e.currentTarget.style.borderColor=c.ln}}>{s}</button>
                      })}
                    </div>
                    <div style={{fontSize:11,fontWeight:600,color:c.fa,textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>Currently working on</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
                      {allW.map(function(w,i){return <div key={i} style={{padding:"7px 14px",borderRadius:20,background:w.cl+"10",border:"1px solid "+w.cl+"25",fontSize:12,fontWeight:500,color:w.cl,display:"flex",alignItems:"center",gap:5}}><span style={{width:6,height:6,borderRadius:"50%",background:w.cl,animation:"pulse 1.5s ease infinite"}}/><span>{w.ic}</span> {w.nm} <span style={{fontSize:10,opacity:.5}}>({w.mdl})</span></div>})}
                    </div>
                  </div>
                </div>
              ):(
                /* ═══ SPLIT LAYOUT: Left=Chat, Right=Screen+LiveTask ═══ */
                <div style={{flex:1,display:"flex",minHeight:0,overflow:"hidden"}}>

                  {/* ─── LEFT: Chat messages + input ─── */}
                  <div style={{flex:"0 0 "+chatW+"px",display:"flex",flexDirection:"column",minWidth:0,maxWidth:chatW}}>

                    {/* Mobile screen — collapsible above messages */}
                    {mob&&(
                      <div style={{flexShrink:0,borderBottom:"1px solid "+c.ln}}>
                        {scrM==="hidden"?(
                          <button onClick={function(){setScrM("docked")}} style={{width:"100%",padding:"8px 12px",border:"none",background:c.cd,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontSize:14}}>{"\u{1F5A5}"}</span>
                            <span style={{fontSize:11,fontWeight:600,color:c.so,flex:1,textAlign:"left"}}>{scrLive?"Browser active — tap to show":"Screen hidden"}</span>
                            {scrLive&&<span style={{width:6,height:6,borderRadius:"50%",background:c.gr,animation:"pulse 1.5s ease infinite"}}/>}
                            <span style={{fontSize:12,color:c.fa}}>{"\u25BC"}</span>
                          </button>
                        ):(
                          <div style={{padding:8}}>
                            <div style={{borderRadius:10,overflow:"hidden",border:"1px solid "+c.ln,background:"#0a0a0a"}}>
                              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 8px",background:"#161616",borderBottom:"1px solid #2a2a2a"}}>
                                <div style={{display:"flex",alignItems:"center",gap:6}}>
                                  {scrLive&&<span style={{width:6,height:6,borderRadius:"50%",background:c.gr,animation:"pulse 1.5s ease infinite"}}/>}
                                  <span style={{fontSize:10,fontWeight:600,color:"#aaa"}}>LIVE</span>
                                  <span style={{fontSize:10,color:"#666"}}>Chromium</span>
                                </div>
                                <div style={{display:"flex",gap:4}}>
                                  <button onClick={function(){setScrM("full")}} style={{padding:"2px 6px",borderRadius:4,border:"1px solid #333",background:"transparent",cursor:"pointer",fontSize:10,color:"#888"}}>Full</button>
                                  <button onClick={function(){setScrM("hidden")}} style={{padding:"2px 6px",borderRadius:4,border:"1px solid #333",background:"transparent",cursor:"pointer",fontSize:10,color:"#888"}}>{"\u2212"}</button>
                                </div>
                              </div>
                              <div style={{aspectRatio:"16/9",background:"linear-gradient(180deg,#111 0%,#1a1a1a 100%)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                                <div style={{width:"90%",borderRadius:6,overflow:"hidden"}}>
                                  <div style={{height:20,background:"#222",display:"flex",alignItems:"center",gap:4,padding:"0 6px"}}>
                                    <span style={{width:5,height:5,borderRadius:"50%",background:"#ff5f56"}}/><span style={{width:5,height:5,borderRadius:"50%",background:"#ffbd2e"}}/><span style={{width:5,height:5,borderRadius:"50%",background:"#27c93f"}}/>
                                    <span style={{flex:1,marginLeft:4,height:10,borderRadius:5,background:"#333",fontSize:7,color:"#888",display:"flex",alignItems:"center",paddingLeft:4}}>census.gov/data/datasets...</span>
                                  </div>
                                  <div style={{padding:10,background:"#1c1c1c"}}>
                                    <div style={{height:6,width:"70%",borderRadius:3,background:"#2a2a2a",marginBottom:6}}/>
                                    <div style={{height:6,width:"50%",borderRadius:3,background:"#2a2a2a",marginBottom:8}}/>
                                    <div style={{display:"flex",gap:4}}><div style={{flex:1,height:28,borderRadius:4,background:"#222"}}/><div style={{flex:1,height:28,borderRadius:4,background:"#222"}}/><div style={{flex:1,height:28,borderRadius:4,background:"#222"}}/></div>
                                  </div>
                                </div>
                                <div style={{position:"absolute",bottom:4,left:0,right:0,textAlign:"center",fontSize:9,color:"#555"}}>Extracting household income data{"\u2026"}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Messages */}
                    <div style={{flex:1,minHeight:0,overflowY:"auto",padding:mob?"14px 12px":"18px 20px",background:c.bg}}>
                      {ms.map(function(m){
                        if(m.tp==="working") return(
                          <div key={m.id} style={{display:"flex",gap:8,marginBottom:14}}>
                            <div style={{marginTop:2}}><Face sz={28} agent={curAgent}/></div>
                            <div style={{maxWidth:"82%",padding:"14px 16px",borderRadius:"6px 16px 16px 16px",background:c.cd,border:"1px solid "+c.ln,animation:"pop .3s ease"}}>
                              <div style={{fontSize:12,fontWeight:600,color:c.ac,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><span style={{width:7,height:7,borderRadius:"50%",background:c.ac,animation:"pulse 1.5s ease infinite"}}/> Working on multiple tasks right now</div>
                              {allW.map(function(w,i){return(
                                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:10,background:c.sf,border:"1px solid "+c.ln,marginBottom:i<allW.length-1?6:0}}>
                                  <Ring pct={w.pct} sz={32} cl={w.cl}><span style={{fontSize:8,fontWeight:700,color:w.cl}}>{w.pct}%</span></Ring>
                                  <div style={{flex:1,minWidth:0}}>
                                    <div style={{fontSize:13,fontWeight:600,color:c.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.nm}</div>
                                    <div style={{fontSize:11,color:c.so,marginTop:1}}>{w.tm} remaining · {w.mdl}</div>
                                  </div>
                                </div>
                              )})}
                              <button onClick={function(){setPg("home")}} style={{width:"100%",marginTop:10,padding:"8px 0",borderRadius:10,border:"1.5px solid "+c.ac+"30",background:"transparent",cursor:"pointer",fontSize:12,fontWeight:600,color:c.ac}}>View full progress {"\u2192"}</button>
                            </div>
                          </div>);
                        if(m.tp==="done") return(
                          <div key={m.id} style={{display:"flex",gap:8,marginBottom:14}}>
                            <div style={{marginTop:2}}><Face sz={28} agent={curAgent}/></div>
                            <div style={{padding:"12px 16px",borderRadius:"6px 14px 14px 14px",background:c.gf,border:"1px solid "+c.gr+"30",animation:"pop .3s ease",maxWidth:"82%"}}>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <span style={{width:22,height:22,borderRadius:"50%",background:c.gr,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{"\u2713"}</span>
                                <div>
                                  <div style={{fontSize:13,fontWeight:700,color:c.gr}}>Task completed</div>
                                  <div style={{fontSize:12,color:c.tx,marginTop:2}}>{m.nm}</div>
                                </div>
                              </div>
                            </div>
                          </div>);
                        if(m.tp==="artifact") return(
                          <div key={m.id} style={{display:"flex",gap:8,marginBottom:14}}>
                            <div style={{marginTop:2}}><Face sz={28} agent={curAgent}/></div>
                            <div style={{maxWidth:mob?"85%":340,borderRadius:"6px 16px 16px 16px",overflow:"hidden",border:"1.5px solid "+c.ac+"30",background:c.cd,animation:"pop .3s ease"}}>
                              <div style={{padding:"12px 16px",borderBottom:"1px solid "+c.ln,display:"flex",alignItems:"center",gap:10}}>
                                <span style={{fontSize:22}}>{m.ad.ic}</span>
                                <div style={{flex:1}}>
                                  <div style={{fontSize:14,fontWeight:700,color:c.tx}}>{m.ad.nm}</div>
                                  <div style={{fontSize:11,color:c.so,marginTop:1}}>Ready for your review</div>
                                </div>
                              </div>
                              <div style={{padding:"12px 16px",fontSize:12.5,color:c.so,lineHeight:1.5,maxHeight:80,overflow:"hidden",position:"relative"}}>{m.ad.pv}<div style={{position:"absolute",bottom:0,left:0,right:0,height:30,background:"linear-gradient(transparent,"+c.cd+")"}}/></div>
                              <div style={{padding:"10px 16px",borderTop:"1px solid "+c.ln,display:"flex",gap:8}}>
                                <button onClick={function(){openPanel(m.ad)}} style={{flex:1,padding:"9px 0",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#F4A261,#E76F8B)",color:"#fff",fontSize:13,fontWeight:600}}>Review & Approve</button>
                              </div>
                            </div>
                          </div>);
                        return(
                          <div key={m.id} style={{display:"flex",justifyContent:m.b?"flex-start":"flex-end",marginBottom:14}}>
                            {m.b&&<div style={{marginRight:8,marginTop:2}}><Face sz={mob?26:28} agent={curAgent}/></div>}
                            <div style={{maxWidth:mob?"85%":"82%",padding:"12px 16px",fontSize:mob?13:14,lineHeight:1.55,color:m.b?c.tx:"#fff",borderRadius:m.b?"6px 18px 18px 18px":"18px 6px 18px 18px",background:m.b?c.cd:"linear-gradient(135deg,#F4A261,#E76F8B)",border:m.b?"1px solid "+c.ln:"none"}}>
                              {m.t}
                              <div style={{fontSize:10,opacity:.45,marginTop:5,textAlign:m.b?"left":"right"}}>{m.tm}</div>
                            </div>
                          </div>);
                      })}
                      <div ref={btm}/>
                    </div>

                    {/* Input bar — pinned bottom */}
                    <div style={{flexShrink:0,padding:mob?"6px 10px":"8px 16px",background:c.cd,borderTop:"1px solid "+c.ln,position:"relative"}}>
                      {plO&&<PMenu c={c} mob={mob} onClose={function(){setPlO(false)}} onAct={plusAct}/>}
                      <div style={{display:"flex",alignItems:"center",gap:6,paddingBottom:5}}><span style={{width:5,height:5,borderRadius:"50%",background:c.gr}}/><span style={{fontSize:11,color:c.fa}}>Using: {mdl==="auto"?"Best for task (auto)":MN[mdl]||mdl}</span></div>
                      <div style={{display:"flex",gap:mob?6:8,alignItems:"center"}}>
                        <button onClick={function(){setPlO(!plO)}} style={{width:40,height:40,borderRadius:11,border:"1.5px solid "+(plO?c.ac:c.ln),background:plO?c.ac+"15":c.cd,cursor:"pointer",fontSize:20,fontWeight:300,color:plO?c.ac:c.so,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s ease"}}>+</button>
                        <input value={tx} onChange={function(e){setTx(e.target.value)}} onKeyDown={function(e){if(e.key==="Enter")send()}} placeholder={vcRec?"Listening\u2026":(mob?"Message\u2026":"Tell "+curAgent.nm.split(" ")[0]+" what you need\u2026")} style={{flex:1,padding:mob?"10px 14px":"11px 14px",borderRadius:12,border:"1.5px solid "+(vcRec?c.ac:c.ln),fontSize:14,fontFamily:"inherit",background:c.inp,color:c.tx,transition:"border-color .2s"}}/>
                        <button onClick={toggleVoice} style={{width:40,height:40,borderRadius:11,border:vcRec?"2px solid "+c.ac:"1.5px solid "+c.ln,cursor:"pointer",background:vcRec?c.ac+"18":c.cd,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s ease",position:"relative"}}>
                          {vcRec&&<span style={{position:"absolute",inset:-4,borderRadius:15,border:"2px solid "+c.ac,animation:"pulse 1.2s ease infinite",opacity:.4}}/>}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={vcRec?c.ac:c.so} strokeWidth="2" strokeLinecap="round"><rect x="9" y="1" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0"/><path d="M12 17v4M8 21h8"/></svg>
                        </button>
                        <button onClick={send} style={{padding:mob?"10px 16px":"11px 20px",borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#F4A261,#E76F8B)",color:"#fff",fontSize:14,fontWeight:700,flexShrink:0}}>Send</button>
                      </div>
                    </div>
                  </div>

                  {/* ─── DRAG HANDLE ─── */}
                  {!mob&&(<div onMouseDown={startDrag} onTouchStart={startDrag} style={{width:10,cursor:"col-resize",background:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative",zIndex:5}} title="Drag to resize">
                    <div style={{width:4,display:"flex",flexDirection:"column",gap:3,alignItems:"center",transition:"opacity .15s",opacity:.4}} onMouseEnter={function(e){e.currentTarget.style.opacity="1"}} onMouseLeave={function(e){e.currentTarget.style.opacity=".4"}}>
                      <div style={{width:4,height:4,borderRadius:"50%",background:c.ac}}/><div style={{width:4,height:4,borderRadius:"50%",background:c.ac}}/><div style={{width:4,height:4,borderRadius:"50%",background:c.ac}}/><div style={{width:4,height:4,borderRadius:"50%",background:c.ac}}/><div style={{width:4,height:4,borderRadius:"50%",background:c.ac}}/>
                    </div>
                  </div>)}

                  {/* ─── RIGHT: Screen + Live Task Steps (desktop only) ─── */}
                  {!mob&&(
                    <div style={{flex:1,display:"flex",flexDirection:"column",background:c.bg,overflow:"hidden"}}>

                      {/* 16:9 Browser Screen or collapsed bar */}
                      <div style={{flexShrink:0,padding:"8px 12px"}}>
                        {scrM==="hidden"?(
                          <button onClick={function(){setScrM("docked")}} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid "+c.ln,background:c.cd,cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"border-color .15s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=c.ac}} onMouseLeave={function(e){e.currentTarget.style.borderColor=c.ln}}>
                            <span style={{fontSize:15}}>{"\u{1F5A5}"}</span>
                            <span style={{fontSize:12,fontWeight:600,color:c.so,flex:1,textAlign:"left"}}>{scrLive?"Browser active — click to show":"Screen hidden"}</span>
                            {scrLive&&<span style={{width:7,height:7,borderRadius:"50%",background:c.gr,animation:"pulse 1.2s ease infinite"}}/>}
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={c.so} strokeWidth="1.8"><path d="M4 6l4 4 4-4"/></svg>
                          </button>
                        ):(
                          <Screen c={c} mob={false} live={scrLive} mode="docked" setMode={setScrM}/>
                        )}
                      </div>

                      {/* Live Task Steps */}
                      <div style={{flex:1,minHeight:0,overflowY:"auto",padding:"0 14px 14px"}}>
                        {/* Current task header */}
                        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0 10px",borderBottom:"1px solid "+c.ln,marginBottom:12}}>
                          <Ring pct={sPct} sz={40} cl={pj.cl}><span style={{fontSize:10,fontWeight:700,color:pj.cl}}>{sPct}%</span></Ring>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:13,fontWeight:700,color:c.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pj.at.nm}</div>
                            <div style={{fontSize:11,color:c.so,marginTop:1}}>{sDone} of {sSteps.length} steps \u2022 {pj.at.tm}</div>
                          </div>
                          <span style={{fontSize:16}}>{pj.ic}</span>
                        </div>

                        {/* Step checklist */}
                        {sSteps.map(function(step,i){var d=step.d,a=step.a;return(
                          <div key={i} style={{display:"flex",gap:10,position:"relative",paddingBottom:i<sSteps.length-1?10:0}}>
                            {i<sSteps.length-1&&<div style={{position:"absolute",left:11,top:24,width:1.5,bottom:0,background:d?c.gr+"40":c.ln}}/>}
                            <div style={{width:24,height:24,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,background:d?c.gr:a?pj.cl+"18":"transparent",color:d?"#fff":a?pj.cl:c.fa,border:d?"none":a?"2px solid "+pj.cl:"1.5px solid "+c.ln}}>
                              {d?"\u2713":a?<span style={{width:6,height:6,borderRadius:"50%",background:pj.cl,animation:"pulse 1.2s ease infinite"}}/>:null}
                            </div>
                            <div style={{flex:1,paddingTop:2}}>
                              <div style={{fontSize:12.5,fontWeight:d?500:a?600:400,color:d?c.gr:a?c.tx:c.so,textDecoration:d?"line-through":"none",lineHeight:1.4}}>{step.t}</div>
                              {d&&step.tm&&<div style={{fontSize:10,color:c.fa,marginTop:2}}>{step.tm}</div>}
                              {a&&<div style={{fontSize:11,color:pj.cl,fontWeight:500,marginTop:2}}>{"\u21BB"} Working now\u2026</div>}
                            </div>
                          </div>
                        )})}

                        {/* Project progress mini-bar */}
                        <div style={{marginTop:16,padding:"12px 14px",borderRadius:12,background:c.cd,border:"1px solid "+c.ln}}>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                            <span style={{fontSize:11,fontWeight:600,color:c.so}}>{pj.ic} {pj.nm} overall</span>
                            <span style={{fontSize:11,fontWeight:700,color:pj.cl}}>{pj.dn}/{pj.tot}</span>
                          </div>
                          <Bar pct={Math.round((pj.dn/pj.tot)*100)} cl={pj.cl}/>
                        </div>

                        {/* Up next */}
                        <div style={{marginTop:12}}>
                          <div style={{fontSize:10,fontWeight:600,color:c.fa,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Up next</div>
                          {pj.nxt.slice(0,2).map(function(n,i){return <div key={i} style={{fontSize:12,color:c.so,padding:"6px 0",borderBottom:i<1?"1px solid "+c.ln:"none",display:"flex",alignItems:"center",gap:6}}><span style={{width:16,height:16,borderRadius:"50%",background:c.sf,color:c.fa,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,flexShrink:0}}>{i+1}</span>{n}</div>})}
                        </div>

                        {/* View full status link */}
                        <button onClick={function(){setPg("home")}} style={{width:"100%",marginTop:14,padding:"9px 0",borderRadius:10,border:"1.5px solid "+c.ac+"30",background:"transparent",cursor:"pointer",fontSize:12,fontWeight:600,color:c.ac}}>View full project status {"\u2192"}</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* DEV MODE */}
          {pg==="chat"&&dev&&(
            <div style={{height:"calc(100vh - 52px)",display:"flex",alignItems:"center",justifyContent:"center",background:c.bg}}>
              <div style={{textAlign:"center",padding:40}}>
                <div style={{fontSize:40,marginBottom:16}}>{"\u2699\uFE0F"}</div>
                <h2 style={{fontSize:22,fontWeight:700,color:c.tx,marginBottom:8}}>{dvPg}</h2>
                <p style={{fontSize:14,color:c.so,maxWidth:400}}>Full {dvPg.toLowerCase()} management powered by ClawBot engine.</p>
                <div style={{marginTop:20,padding:"14px 20px",borderRadius:12,background:c.sf,border:"1px solid "+c.ln,display:"inline-block"}}>
                  <span style={{fontSize:13,color:c.so}}>Connects to </span><span style={{fontSize:13,color:c.ac,fontWeight:600}}>your-instance.clawbot.dev</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STATUS ── */}
          {pg==="home"&&(
            <div style={{padding:mob?"16px 12px 40px":"20px 20px 40px",maxWidth:1000,margin:"0 auto"}}>
              {/* Business + Project context */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <span style={{fontSize:18}}>{curBiz.ic}</span>
                <span style={{fontSize:16,fontWeight:700,color:c.tx}}>{curBiz.nm}</span>
                <span style={{fontSize:13,color:c.fa}}>{"\u203A"}</span>
                <span style={{fontSize:14,fontWeight:600,color:curBiz.cl}}>{curBpj?curBpj.ic:""} {curBpj?curBpj.nm:"All"}</span>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
                {PJ.map(function(p){var sel=pk===p.id;return(<button key={p.id} onClick={function(){setPk(p.id);setSim(0)}} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",borderRadius:12,border:"none",cursor:"pointer",background:sel?c.cd:"transparent",boxShadow:sel?"0 4px 16px "+p.cl+"18":"none",outline:sel?"2px solid "+p.cl:"1.5px solid "+c.ln,whiteSpace:"nowrap",flexShrink:0}}><span style={{fontSize:18}}>{p.ic}</span><span style={{fontSize:14,fontWeight:600,color:sel?c.tx:c.so}}>{p.nm}</span><span style={{width:7,height:7,borderRadius:"50%",background:p.cl,animation:"pulse 1.5s ease infinite"}}/></button>)})}
              </div>

              {/* ── GANTT TIMELINE ── */}
              <div style={{padding:20,borderRadius:18,background:c.cd,border:"1px solid "+c.ln,marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <div style={{fontSize:15,fontWeight:700,color:c.tx}}>{"\u{1F4CA}"} Project Timeline</div>
                  <div style={{fontSize:11,color:c.so}}>Feb 2025</div>
                </div>
                {/* Week headers */}
                <div style={{display:"flex",marginBottom:8,paddingLeft:mob?100:160}}>
                  {["Week 1","Week 2","Week 3","Week 4"].map(function(w,i){return <div key={i} style={{flex:1,fontSize:10,fontWeight:600,color:c.fa,textAlign:"center"}}>{w}</div>})}
                </div>
                {/* Gantt rows */}
                {(function(){
                  var rows=[
                    {nm:"Completed",items:pj.fin.map(function(f){return{nm:f.t,s:0,w:25,done:true}})},
                    {nm:"In Progress",items:[{nm:pj.at.nm,s:Math.floor(pj.at.pct*.25),w:Math.max(20,Math.floor(pj.at.pct*.35)),active:true}]},
                    {nm:"Up Next",items:pj.nxt.map(function(n,i){return{nm:n,s:50+i*16,w:18}})}
                  ];
                  return rows.map(function(row,ri){return(
                    <div key={ri} style={{display:"flex",alignItems:"center",marginBottom:6}}>
                      <div style={{width:mob?100:160,flexShrink:0,fontSize:12,fontWeight:600,color:c.so,paddingRight:12,textAlign:"right"}}>{row.nm}</div>
                      <div style={{flex:1,position:"relative",height:28,background:c.sf,borderRadius:6,overflow:"hidden"}}>
                        {/* Grid lines */}
                        {[25,50,75].map(function(p,i){return <div key={i} style={{position:"absolute",left:p+"%",top:0,bottom:0,width:1,background:c.ln}}/>})}
                        {/* Bars */}
                        {row.items.map(function(it,ii){return(
                          <div key={ii} title={it.nm} style={{position:"absolute",left:it.s+"%",width:it.w+"%",top:4,height:20,borderRadius:4,background:it.done?"linear-gradient(90deg,"+c.gr+","+c.gr+"BB)":it.active?"linear-gradient(90deg,"+pj.cl+","+pj.cl+"BB)":c.fa+"40",display:"flex",alignItems:"center",paddingLeft:6,overflow:"hidden"}}>
                            <span style={{fontSize:9,fontWeight:600,color:it.done||it.active?"#fff":c.so,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{it.nm}</span>
                            {it.active&&<div style={{position:"absolute",right:0,top:0,bottom:0,width:4,background:"#fff",opacity:.4,animation:"pulse 1.5s ease infinite"}}/>}
                          </div>
                        )})}
                      </div>
                    </div>
                  )});
                })()}
                <div style={{display:"flex",gap:16,marginTop:14,paddingLeft:mob?100:160}}>
                  {[{cl:c.gr,l:"Done"},{cl:pj.cl,l:"Active"},{cl:c.fa+"60",l:"Upcoming"}].map(function(lg,i){return <div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:c.so}}><div style={{width:10,height:10,borderRadius:3,background:lg.cl}}/>{lg.l}</div>})}
                </div>
              </div>

              <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
                <div style={{flex:"1 1 "+(mob?"100%":"58%"),minWidth:mob?undefined:320}}>
                  <div style={{padding:20,borderRadius:18,marginBottom:20,background:c.cd,border:"1.5px solid "+pj.cl+"20"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <Ring pct={sPct} sz={52} cl={pj.cl}><span style={{fontSize:12,fontWeight:700,color:pj.cl}}>{sPct}%</span></Ring>
                        <div><div style={{fontSize:17,fontWeight:700,color:c.tx}}>{pj.at.nm}</div><div style={{fontSize:13,color:c.so,marginTop:2}}>{sDone} of {sSteps.length} steps</div></div>
                      </div>
                      <div style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:600,background:pj.cl+"10",color:pj.cl}}>{pj.at.tm}</div>
                    </div>
                    <Bar pct={sPct} cl={pj.cl}/>
                  </div>
                  <div style={{padding:"4px 20px 20px",borderRadius:16,background:c.cd,border:"1px solid "+c.ln}}>
                    <div style={{fontSize:12,fontWeight:600,color:c.so,padding:"14px 0 10px",borderBottom:"1px solid "+c.ln,marginBottom:14}}>{"\u26A1"} Live progress</div>
                    {sSteps.map(function(step,i){var d=step.d,a=step.a;return(
                      <div key={i} style={{display:"flex",gap:12,position:"relative"}}>
                        {i<sSteps.length-1&&<div style={{position:"absolute",left:13,top:28,width:2,bottom:-8,background:d?c.gr:c.ln}}/>}
                        <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,background:d?c.gr:a?pj.cl+"15":c.sf,color:d?"#fff":a?pj.cl:c.fa,border:a?"2px solid "+pj.cl:"2px solid transparent"}}>
                          {d?"\u2713":a?<span style={{width:8,height:8,borderRadius:"50%",background:pj.cl,animation:"pulse 1.2s ease infinite"}}/>:<span style={{width:6,height:6,borderRadius:"50%",background:c.fa}}/>}
                        </div>
                        <div style={{paddingTop:3,paddingBottom:14,flex:1}}>
                          <div style={{fontSize:14,fontWeight:d?500:a?600:400,color:d?c.gr:a?c.tx:c.so,textDecoration:d?"line-through":"none"}}>{step.t}</div>
                          {d&&step.tm&&<div style={{fontSize:11,color:c.so,marginTop:2}}>{step.tm}</div>}
                          {a&&<div style={{fontSize:12,color:pj.cl,fontWeight:500,marginTop:3}}>{"\u21BB"} Working now\u2026</div>}
                        </div>
                      </div>)})}
                  </div>

                  {/* ── COMPLETED TASKS ── */}
                  <div style={{marginTop:20,padding:20,borderRadius:16,background:c.cd,border:"1px solid "+c.ln}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                      <div style={{fontSize:14,fontWeight:700,color:c.gr,display:"flex",alignItems:"center",gap:8}}><span style={{width:22,height:22,borderRadius:"50%",background:c.gr,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>{"\u2713"}</span> Completed Tasks</div>
                      <div style={{fontSize:12,color:c.so}}>{pj.fin.length} done</div>
                    </div>
                    {pj.fin.map(function(f,i){return <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:12,background:c.gf,marginBottom:5}}>
                      <span style={{width:20,height:20,borderRadius:"50%",background:c.gr,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>{"\u2713"}</span>
                      <span style={{flex:1,fontSize:14,fontWeight:500,color:c.gr}}>{f.t}</span>
                      <span style={{fontSize:11,color:c.so}}>{f.tm}</span>
                    </div>})}
                    {/* All-projects completed summary */}
                    <div style={{marginTop:12,padding:"12px 14px",borderRadius:10,background:c.sf,border:"1px solid "+c.ln}}>
                      <div style={{fontSize:11,fontWeight:700,color:c.fa,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>All Projects</div>
                      {PJ.map(function(p){return <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontSize:13}}>{p.ic}</span>
                        <span style={{fontSize:12,fontWeight:500,color:c.tx,flex:1}}>{p.nm}</span>
                        <span style={{fontSize:12,fontWeight:700,color:c.gr}}>{p.fin.length}</span>
                        <span style={{fontSize:10,color:c.so}}>done</span>
                      </div>})}
                      <div style={{borderTop:"1px solid "+c.ln,marginTop:8,paddingTop:8,display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontSize:13,fontWeight:700,color:c.tx}}>Total completed</span>
                        <span style={{fontSize:13,fontWeight:700,color:c.gr}}>{PJ.reduce(function(a,p){return a+p.fin.length},0)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{marginTop:20}}><div style={{fontSize:12,fontWeight:600,color:c.so,marginBottom:10}}>Coming up next</div>{pj.nxt.map(function(n,i){return <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:12,background:c.cd,border:"1px solid "+c.ln,marginBottom:5,fontSize:14,fontWeight:500,color:c.so}}><span style={{width:20,height:20,borderRadius:"50%",background:c.sf,color:c.fa,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>{i+1}</span>{n}</div>})}</div>
                </div>
                <div style={{flex:"1 1 "+(mob?"100%":"34%"),minWidth:mob?undefined:270}}>
                  <h2 style={{fontSize:17,fontWeight:700,color:c.tx,marginBottom:14}}>{"\u{1F338}"} Suggestions</h2>
                  {TIPS.map(function(t,i){return(<div key={i} style={{padding:16,borderRadius:14,background:c.cd,border:"1px solid "+c.ln,marginBottom:10}}><div style={{display:"flex",gap:10,marginBottom:12}}><span style={{fontSize:22}}>{t.ic}</span><p style={{fontSize:14,color:c.tx,lineHeight:1.5}}>{t.t}</p></div><div style={{display:"flex",gap:8}}><button style={{padding:"7px 18px",borderRadius:20,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#F4A261,#E76F8B)",color:"#fff",fontSize:13,fontWeight:600}}>Yes please</button><button style={{padding:"7px 18px",borderRadius:20,cursor:"pointer",border:"1px solid "+c.ln,background:"transparent",color:c.so,fontSize:13}}>Not now</button></div></div>)})}

                  {/* ── AUTOPILOT HEARTBEAT ── */}
                  <div style={{padding:0,borderRadius:16,background:c.cd,border:"1px solid "+c.ln,marginTop:10,marginBottom:10,overflow:"hidden"}}>
                    {/* Header with pulse */}
                    <div style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid "+c.ln,background:c.sf}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{position:"relative",width:10,height:10}}>
                          <span style={{position:"absolute",inset:0,borderRadius:"50%",background:c.gr,animation:"pulse 1.5s ease infinite"}}/>
                          <span style={{position:"absolute",inset:2,borderRadius:"50%",background:c.gr}}/>
                        </div>
                        <span style={{fontSize:13,fontWeight:700,color:c.tx}}>Autopilot</span>
                        <span style={{fontSize:11,color:c.so}}>{CRONS.filter(function(j){return j.on}).length} active</span>
                      </div>
                      <span style={{fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:6,background:c.gr+"15",color:c.gr}}>Running</span>
                    </div>

                    {/* Timeline of cron jobs */}
                    <div style={{padding:"8px 0"}}>
                      {CRONS.map(function(job,i){
                        var stCl=!job.on?c.fa:job.ok?c.gr:"#E76F8B";
                        return(
                          <div key={job.id} style={{padding:"9px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:i<CRONS.length-1?"1px solid "+c.ln+"60":"none",opacity:job.on?1:.5}}>
                            {/* Status + icon */}
                            <div style={{position:"relative",flexShrink:0}}>
                              <span style={{fontSize:16}}>{job.ic}</span>
                              <span style={{position:"absolute",bottom:-2,right:-2,width:8,height:8,borderRadius:"50%",background:stCl,border:"1.5px solid "+c.cd}}/>
                            </div>
                            {/* Info */}
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:12,fontWeight:600,color:job.on?c.tx:c.so,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{job.nm}</div>
                              <div style={{fontSize:10,color:c.fa,marginTop:1}}>
                                {job.freq}{" \u2022 "}
                                {job.on?<>Next: <span style={{color:c.tx,fontWeight:500}}>{job.next}</span></>:"Paused"}
                              </div>
                            </div>
                            {/* Last run badge */}
                            {job.on&&<div style={{flexShrink:0,textAlign:"right"}}>
                              <div style={{fontSize:9,color:job.ok?c.gr:"#E76F8B",fontWeight:600,display:"flex",alignItems:"center",gap:3,justifyContent:"flex-end"}}>
                                <span>{job.ok?"\u2713":"\u26A0"}</span>{job.ok?"OK":"Failed"}
                              </div>
                              <div style={{fontSize:9,color:c.fa,marginTop:1}}>{job.last}</div>
                            </div>}
                            {/* Pause/play toggle */}
                            <button style={{width:22,height:22,borderRadius:6,border:"1px solid "+c.ln,background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:c.so,flexShrink:0}}>
                              {job.on?"\u23F8":"\u25B6"}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer with next upcoming */}
                    <div style={{padding:"10px 16px",borderTop:"1px solid "+c.ln,background:c.sf,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{fontSize:10,color:c.so}}>Next run: <span style={{fontWeight:600,color:c.tx}}>{CRONS.filter(function(j){return j.on}).sort(function(a,b){return a.next.localeCompare(b.next)})[0].nm}</span> at {CRONS.filter(function(j){return j.on})[0].next}</div>
                      <button style={{padding:"4px 10px",borderRadius:6,border:"1px solid "+c.ac+"40",background:"transparent",cursor:"pointer",fontSize:10,fontWeight:600,color:c.ac}}>+ Add</button>
                    </div>
                  </div>

                  <div style={{padding:20,borderRadius:16,background:c.cd,border:"1px solid "+c.ln,marginTop:10}}>
                    <div style={{fontSize:12,fontWeight:600,color:c.so,marginBottom:14}}>This week</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                      {[{n:"7",l:"Done",co:c.gr},{n:"3",l:"Working",co:c.ac},{n:"12",l:"Waiting",co:c.so},{n:"4",l:"Emails",co:"#E76F8B"}].map(function(s,i){return <div key={i} style={{textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:s.co}}>{s.n}</div><div style={{fontSize:12,color:c.so,marginTop:2}}>{s.l}</div></div>})}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── FILES ── */}
          {pg==="files"&&(
            <div style={{padding:mob?"16px 12px 40px":"20px 20px 40px",maxWidth:1000,margin:"0 auto"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:24}}>
                <div><h1 style={{fontSize:mob?20:24,fontWeight:700,color:c.tx}}>{curBiz.ic} {curBiz.nm} Files</h1><p style={{fontSize:13,color:c.so,marginTop:2}}>{curBpj?curBpj.nm+" \u2014 ":""}{DL.length} deliverables</p></div>
                <div style={{display:"flex",gap:8}}>
                  <select value={dProj} onChange={function(e){setDProj(e.target.value)}} style={{padding:"8px 12px",borderRadius:10,border:"1.5px solid "+c.ln,background:c.cd,fontSize:13,color:c.tx,cursor:"pointer"}}><option value="all">All {curBiz.nm} Projects</option>{(curBiz.pj||[]).map(function(p){return <option key={p.id} value={p.id}>{p.ic} {p.nm}</option>})}</select>
                  <select value={dFilt} onChange={function(e){setDFilt(e.target.value)}} style={{padding:"8px 12px",borderRadius:10,border:"1.5px solid "+c.ln,background:c.cd,fontSize:13,color:c.tx,cursor:"pointer"}}><option value="recent">Newest</option><option value="oldest">Oldest</option></select>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
                {gFilt().map(function(d){var tc={doc:{bg:c.bl+"12",co:c.bl,l:"Document"},spreadsheet:{bg:c.gr+"12",co:c.gr,l:"Spreadsheet"},design:{bg:"#E76F8B12",co:"#E76F8B",l:"Design"},link:{bg:c.ac+"12",co:c.ac,l:"Live Link"},email:{bg:c.pu+"12",co:c.pu,l:"Email"}}[d.tp]||{bg:c.bl+"12",co:c.bl,l:"Document"};
                  return(<div key={d.id} onClick={function(){openPanel(d)}} style={{padding:18,borderRadius:16,background:c.cd,border:"1px solid "+c.ln,cursor:"pointer",display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:28}}>{d.ic}</span><span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:tc.bg,color:tc.co}}>{tc.l}</span></div>
                    <div style={{fontSize:15,fontWeight:700,color:c.tx}}>{d.nm}</div>
                    <div style={{fontSize:12.5,color:c.so,lineHeight:1.45,flex:1}}>{d.pv.length>90?d.pv.slice(0,90)+"\u2026":d.pv}</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:6,borderTop:"1px solid "+c.ln}}><span style={{fontSize:11,color:c.fa}}>{d.pji} {((curBiz.pj||[]).find(function(p){return p.id===d.pj})||PJ.find(function(p){return p.id===d.pj})||{}).nm||d.pj}</span><span style={{fontSize:11,color:c.fa}}>{d.dt}</span></div>
                  </div>)})}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── POP-OUT SCREEN (persists across tabs) ── */}
      {scrM==="pop"&&<Screen c={c} mob={mob} live={scrLive} mode="pop" setMode={setScrM}/>}
      {scrM==="full"&&<Screen c={c} mob={mob} live={scrLive} mode="full" setMode={setScrM}/>}

      {/* ── BLOOMIE HELP BUBBLE ── */}
      {!hlpO&&!stO&&(
        <button onClick={function(){setHlpO(true)}} style={{position:"fixed",bottom:mob?16:24,right:mob?16:24,width:56,height:56,borderRadius:"50%",border:"none",background:"linear-gradient(135deg,#F4A261,#E76F8B)",cursor:"pointer",boxShadow:"0 4px 20px rgba(231,111,139,.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:90,transition:"transform .2s"}} onMouseEnter={function(e){e.currentTarget.style.transform="scale(1.1)"}} onMouseLeave={function(e){e.currentTarget.style.transform="scale(1)"}}>
          <img src={BLOOMIE_IMG} alt="Help" style={{width:36,height:36,objectFit:"contain",animation:"bloomieWiggle 3s ease-in-out infinite"}}/>
        </button>
      )}

      {/* ── BLOOMIE HELP PANEL ── */}
      {hlpO&&(
        <div style={{position:"fixed",bottom:mob?0:24,right:mob?0:24,width:mob?"100%":380,height:mob?"85vh":520,borderRadius:mob?"20px 20px 0 0":20,background:c.cd,border:"1px solid "+c.ln,boxShadow:"0 12px 48px rgba(0,0,0,.25)",zIndex:95,display:"flex",flexDirection:"column",overflow:"hidden",animation:"pop .2s ease"}}>
          {/* Header */}
          <div style={{padding:"16px 20px",background:"linear-gradient(135deg,#F4A261,#E76F8B)",display:"flex",alignItems:"center",gap:12}}>
            <img src={BLOOMIE_IMG} alt="Bloomie" style={{width:40,height:40,objectFit:"contain",animation:"bloomieWiggle 3s ease-in-out infinite"}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>Bloomie Help</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.8)"}}>Your BloomBot assistant</div>
            </div>
            <button onClick={function(){setHlpO(false)}} style={{width:28,height:28,borderRadius:"50%",border:"1px solid rgba(255,255,255,.3)",background:"rgba(255,255,255,.15)",cursor:"pointer",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u2715"}</button>
          </div>

          {/* Quick help topics */}
          <div style={{flex:1,overflowY:"auto",padding:16}}>
            <div style={{fontSize:12,fontWeight:600,color:c.so,marginBottom:12}}>How can I help?</div>
            {[
              {ic:"\u{1F680}",t:"Getting started",d:"Set up your first AI employee"},
              {ic:"\u{1F4B3}",t:"Billing & plans",d:"Upgrade, downgrade, or manage payments"},
              {ic:"\u{1F527}",t:"Something's not working",d:"Troubleshoot issues with your agents"},
              {ic:"\u{1F517}",t:"Connect a channel",d:"TikTok, email, Slack, and more"},
              {ic:"\u23F0",t:"Cron jobs & automation",d:"Set up recurring tasks"},
              {ic:"\u{1F3A8}",t:"Customize your agent",d:"Change avatar, name, or personality"},
              {ic:"\u{1F4CA}",t:"Understanding your dashboard",d:"What all the stats mean"},
              {ic:"\u{1F6E1}",t:"Security & privacy",d:"How your data is protected"}
            ].map(function(item,i){return(
              <button key={i} style={{width:"100%",textAlign:"left",padding:"12px 14px",borderRadius:12,border:"1px solid "+c.ln,background:c.cd,marginBottom:6,cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"background .15s"}} onMouseEnter={function(e){e.currentTarget.style.background=c.hv}} onMouseLeave={function(e){e.currentTarget.style.background=c.cd}}>
                <span style={{fontSize:20,flexShrink:0}}>{item.ic}</span>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:c.tx}}>{item.t}</div>
                  <div style={{fontSize:11,color:c.so,marginTop:1}}>{item.d}</div>
                </div>
              </button>
            )})}
          </div>

          {/* Chat input to Bloomie */}
          <div style={{padding:"12px 16px",borderTop:"1px solid "+c.ln,display:"flex",alignItems:"center",gap:8}}>
            <input placeholder="Ask Bloomie anything\u2026" style={{flex:1,padding:"10px 14px",borderRadius:12,border:"1.5px solid "+c.ln,background:c.sf,fontSize:13,color:c.tx,outline:"none"}}/>
            <button style={{width:38,height:38,borderRadius:"50%",border:"none",background:"linear-gradient(135deg,#F4A261,#E76F8B)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── SETTINGS MODAL ── */}
      {stO&&(
        <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.5)"}} onClick={function(e){if(e.target===e.currentTarget)setStO(false)}}>
          <div style={{width:mob?"95%":720,maxHeight:"85vh",borderRadius:20,background:c.cd,border:"1px solid "+c.ln,boxShadow:"0 20px 60px rgba(0,0,0,.3)",display:"flex",flexDirection:"column",overflow:"hidden",animation:"pop .2s ease"}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid "+c.ln,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <h2 style={{fontSize:18,fontWeight:700,color:c.tx}}>Settings</h2>
              <button onClick={function(){setStO(false)}} style={{width:30,height:30,borderRadius:8,border:"1px solid "+c.ln,background:c.cd,cursor:"pointer",fontSize:16,color:c.so,display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u2715"}</button>
            </div>
            <div style={{display:"flex",gap:mob?0:undefined,flexDirection:mob?"column":"row",flex:1,overflow:"hidden"}}>
              <div style={{padding:mob?"10px 16px":"16px",borderRight:mob?"none":"1px solid "+c.ln,borderBottom:mob?"1px solid "+c.ln:"none",display:"flex",flexDirection:mob?"row":"column",gap:mob?4:2,overflowX:mob?"auto":"visible",flexShrink:0}}>
                {["General","Agents","Connectors","API Keys","Plan"].map(function(t){return <button key={t} onClick={function(){setStab(t)}} style={{padding:mob?"8px 14px":"10px 16px",borderRadius:10,border:"none",cursor:"pointer",background:stab===t?c.ac+"12":"transparent",fontSize:13,fontWeight:stab===t?600:500,color:stab===t?c.tx:c.so,textAlign:"left",whiteSpace:"nowrap"}}>{t}</button>})}
              </div>
              <div style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:20}}>
                {stab==="General"&&(<div>
                  <div style={{marginBottom:28}}><div style={{fontSize:14,fontWeight:700,color:c.tx,marginBottom:10}}>Default AI Model</div><select value={mdl} onChange={function(e){setMdl(e.target.value)}} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1.5px solid "+c.ln,background:c.sf,fontSize:14,color:c.tx,cursor:"pointer"}}><option value="auto">Best for task (recommended)</option><option value="opus">Claude Opus</option><option value="sonnet">Claude Sonnet</option><option value="haiku">Claude Haiku</option><option value="gpt4o">GPT-4o</option><option value="gemini">Gemini Pro</option></select></div>
                  <div><div style={{fontSize:14,fontWeight:700,color:c.tx,marginBottom:10}}>Notifications</div>{["Email me when tasks complete","Daily summary at 6pm","Alert on errors"].map(function(lbl,i){return <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:i<2?"1px solid "+c.ln:"none"}}><span style={{fontSize:13,color:c.tx}}>{lbl}</span><div style={{width:40,height:22,borderRadius:11,background:i<2?c.gr:c.fa,cursor:"pointer",position:"relative"}}><div style={{position:"absolute",top:2,left:i<2?20:2,width:18,height:18,borderRadius:9,background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,.15)",transition:"left .2s"}}/></div></div>})}</div>
                </div>)}
                {stab==="Agents"&&(<div>
                  {AGENTS.map(function(ag){var isCur=ag.id===agtId;var stCl=ag.status==="online"?c.gr:ag.status==="idle"?c.ac:c.fa;return(
                    <div key={ag.id} style={{padding:20,borderRadius:16,border:isCur?"1.5px solid "+c.ac:"1px solid "+c.ln,background:isCur?c.ac+"06":c.cd,marginBottom:14}}>
                      <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                        {/* Avatar section */}
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                          <Face sz={72} agent={ag} editable/>
                          <div style={{display:"flex",gap:4}}>
                            <button style={{padding:"4px 10px",borderRadius:6,border:"1px solid "+c.ln,background:c.sf,cursor:"pointer",fontSize:10,fontWeight:600,color:c.so}}>Upload</button>
                            <button style={{padding:"4px 10px",borderRadius:6,border:"1px solid "+c.ac+"40",background:c.ac+"08",cursor:"pointer",fontSize:10,fontWeight:600,color:c.ac}}>{"\u2728"} Generate</button>
                          </div>
                          {ag.img&&<button style={{padding:"2px 8px",borderRadius:4,border:"none",background:"transparent",cursor:"pointer",fontSize:10,color:c.fa}}>Remove</button>}
                        </div>
                        {/* Info section */}
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                            <div style={{fontSize:16,fontWeight:700,color:c.tx}}>{ag.nm}</div>
                            {isCur&&<span style={{fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:10,background:c.ac+"15",color:c.ac}}>Active</span>}
                            <span style={{fontSize:10,display:"flex",alignItems:"center",gap:4,color:stCl,marginLeft:"auto"}}><span style={{width:6,height:6,borderRadius:"50%",background:stCl}}/>{ag.status}</span>
                          </div>
                          <div style={{fontSize:12,color:c.so,marginBottom:12}}>{ag.role}</div>
                          {/* Editable fields */}
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                            <div>
                              <div style={{fontSize:10,fontWeight:600,color:c.fa,marginBottom:4}}>Name</div>
                              <input defaultValue={ag.nm} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"1px solid "+c.ln,background:c.sf,fontSize:12,color:c.tx,fontFamily:"inherit"}}/>
                            </div>
                            <div>
                              <div style={{fontSize:10,fontWeight:600,color:c.fa,marginBottom:4}}>Role</div>
                              <input defaultValue={ag.role} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"1px solid "+c.ln,background:c.sf,fontSize:12,color:c.tx,fontFamily:"inherit"}}/>
                            </div>
                          </div>
                          {/* Avatar generation prompt */}
                          <div style={{marginTop:10}}>
                            <div style={{fontSize:10,fontWeight:600,color:c.fa,marginBottom:4}}>Avatar Description</div>
                            <input defaultValue={ag.img?"Custom avatar":"Auto-generated from name"} placeholder="e.g. Professional woman, dark hair, confident smile, business casual" style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"1px solid "+c.ln,background:c.sf,fontSize:12,color:c.tx,fontFamily:"inherit"}}/>
                            <div style={{fontSize:10,color:c.fa,marginTop:4}}>Used when generating AI avatar. Leave blank for auto-generation from agent name.</div>
                          </div>
                          {/* Actions */}
                          <div style={{display:"flex",gap:8,marginTop:12}}>
                            <button style={{padding:"6px 14px",borderRadius:8,border:"none",background:c.ac,cursor:"pointer",fontSize:12,fontWeight:600,color:"#fff"}}>Save Changes</button>
                            {!isCur&&<button style={{padding:"6px 14px",borderRadius:8,border:"1px solid "+c.ln,background:"transparent",cursor:"pointer",fontSize:12,fontWeight:600,color:c.so}}>Switch to Agent</button>}
                            {!isCur&&<button style={{padding:"6px 14px",borderRadius:8,border:"1px solid #f5c6c6",background:"#FFF5F5",cursor:"pointer",fontSize:12,fontWeight:600,color:"#D44",marginLeft:"auto"}}>Delete</button>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )})}
                  {/* Add agent */}
                  <button style={{width:"100%",padding:"16px",borderRadius:16,border:"1.5px dashed "+c.ac+"40",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    <span style={{fontSize:13,fontWeight:600,color:c.ac}}>+ Create New Agent</span>
                  </button>
                  {/* How it works */}
                  <div style={{marginTop:20,padding:16,borderRadius:12,background:c.sf,border:"1px solid "+c.ln}}>
                    <div style={{fontSize:12,fontWeight:700,color:c.tx,marginBottom:8}}>How Agent Avatars Work</div>
                    <div style={{fontSize:11,color:c.so,lineHeight:1.6}}>
                      When you create a new agent, Bloomie auto-generates a unique AI avatar based on the agent's name and description. You can customize the look by editing the avatar description and clicking {"\u2728"} Generate, or upload your own image. Avatars appear in the chat, sidebar, and anywhere your agent is visible to you or your team.
                    </div>
                  </div>
                </div>)}
                {stab==="Connectors"&&(<div>
                  <div style={{fontSize:12,color:c.so,marginBottom:20}}>Connect services so Bloomie can send emails, post events, and reach you on your favorite platforms.</div>
                  {[
                    {tl:"\u{1F4AC} Messaging",it:[
                      {n:"WhatsApp",on:false,bg:"#25D366",ic:"W"},
                      {n:"Telegram",on:false,bg:"#2AABEE",ic:"T"},
                      {n:"Discord",on:false,bg:"#5865F2",ic:"D"},
                      {n:"Slack",on:true,bg:"#4A154B",ic:"S"},
                      {n:"Signal",on:false,bg:"#3A76F0",ic:"Si"},
                      {n:"Web Chat",on:true,bg:c.ac,ic:"\u{1F4AC}"}
                    ]},
                    {tl:"\u{1F6E0}\uFE0F Business Tools",it:[
                      {n:"Gmail",on:false,bg:"#EA4335",ic:"G"},
                      {n:"Outlook",on:true,bg:"#0078D4",ic:"O"},
                      {n:"Google Drive",on:false,bg:"#4285F4",ic:"GD"},
                      {n:"Eventbrite",on:true,bg:"#F05537",ic:"E"},
                      {n:"GoHighLevel",on:false,bg:"#007BFF",ic:"HL"},
                      {n:"ClickFunnels",on:false,bg:"#E43B2C",ic:"CF"},
                      {n:"GitHub",on:false,bg:"#24292e",ic:"\u2687"},
                      {n:"Shopify",on:false,bg:"#96BF48",ic:"S"},
                      {n:"Stripe",on:false,bg:"#635BFF",ic:"St"},
                      {n:"Notion",on:false,bg:"#000000",ic:"N"},
                      {n:"Zapier",on:false,bg:"#FF4F00",ic:"Z"}
                    ]},
                    {tl:"\u{1F3AC} Social",it:[
                      {n:"TikTok",on:false,bg:"#000000",ic:"Tk"},
                      {n:"Instagram",on:false,bg:"#E4405F",ic:"Ig"},
                      {n:"Facebook",on:false,bg:"#1877F2",ic:"f"},
                      {n:"YouTube",on:false,bg:"#FF0000",ic:"\u25B6"},
                      {n:"LinkedIn",on:false,bg:"#0A66C2",ic:"in"},
                      {n:"X / Twitter",on:false,bg:"#000000",ic:"X"}
                    ]}
                  ].map(function(g,gi){return(
                    <div key={gi} style={{marginBottom:24}}>
                      <div style={{fontSize:13,fontWeight:700,color:c.tx,marginBottom:10}}>{g.tl}</div>
                      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:8}}>
                        {g.it.map(function(ch,ci){return(
                          <div key={ci} style={{padding:"10px 12px",borderRadius:12,border:ch.on?"1.5px solid "+c.gr+"40":"1px solid "+c.ln,background:ch.on?c.gf:c.cd,display:"flex",alignItems:"center",gap:10}}>
                            <span style={{width:32,height:32,borderRadius:8,background:ch.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,lineHeight:0}}><BrandLogo name={ch.n} sz={16}/></span>
                            <span style={{flex:1,fontSize:13,fontWeight:600,color:c.tx}}>{ch.n}</span>
                            <button style={{padding:"5px 12px",borderRadius:8,border:ch.on?"1px solid "+c.gr+"40":"1px solid "+c.ln,background:ch.on?c.gr:"transparent",cursor:"pointer",fontSize:11,fontWeight:600,color:ch.on?"#fff":c.so}}>{ch.on?"On":"Connect"}</button>
                          </div>
                        )})}
                      </div>
                    </div>
                  )})}
                </div>)}
                {stab==="API Keys"&&(<div>
                  <div style={{fontSize:12,color:c.so,marginBottom:20}}>API keys let Bloomie access AI models and external services. Keys are encrypted.</div>
                  {[{tl:"AI Model Providers",it:[{n:"Anthropic (Claude)",k:"sk-ant-\u2022\u2022\u2022mPA",on:true},{n:"OpenAI",k:"",on:false},{n:"Google AI",k:"",on:false}]},{tl:"Service API Keys",it:[{n:"Eventbrite",k:"evt-\u2022\u2022\u20222xK",on:true},{n:"Outlook",k:"ms-\u2022\u2022\u20229fR",on:true},{n:"Stripe",k:"",on:false}]}].map(function(g,gi){return(<div key={gi} style={{marginBottom:24}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}><div style={{fontSize:13,fontWeight:700,color:c.tx}}>{g.tl}</div><button style={{padding:"6px 14px",borderRadius:8,border:"1.5px solid "+c.ac+"30",background:"transparent",cursor:"pointer",fontSize:12,fontWeight:600,color:c.ac}}>+ Add key</button></div>{g.it.map(function(k,ki){return(<div key={ki} style={{padding:"14px 16px",borderRadius:12,border:k.on?"1.5px solid "+c.gr+"30":"1px solid "+c.ln,background:k.on?c.gf:c.cd,marginBottom:8,display:"flex",alignItems:"center",gap:12}}><span style={{width:10,height:10,borderRadius:"50%",background:k.on?c.gr:c.fa,flexShrink:0}}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:c.tx}}>{k.n}</div>{k.on?<div style={{fontSize:12,color:c.so,marginTop:2,fontFamily:"monospace"}}>{k.k}</div>:<div style={{fontSize:12,color:c.fa}}>No key added</div>}</div>{k.on?<div style={{display:"flex",gap:6}}><button style={{padding:"5px 10px",borderRadius:6,border:"1px solid "+c.ln,background:c.cd,cursor:"pointer",fontSize:11,color:c.so}}>Edit</button><button style={{padding:"5px 10px",borderRadius:6,border:"1px solid #f5c6c6",background:"#FFF5F5",cursor:"pointer",fontSize:11,color:"#D44"}}>Remove</button></div>:<button style={{padding:"5px 12px",borderRadius:6,border:"1px solid "+c.ac+"40",background:"transparent",cursor:"pointer",fontSize:11,fontWeight:600,color:c.ac}}>Add key</button>}</div>)})}</div>)})}</div>)}
                {stab==="Plan"&&(<div>
                  {/* Founding Member banner */}
                  <div style={{marginBottom:20,padding:24,borderRadius:16,background:"linear-gradient(135deg,#F4A261 0%,#E76F8B 100%)",position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.08)"}}/>
                    <div style={{position:"absolute",bottom:-30,left:-10,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,.05)"}}/>
                    <div style={{position:"relative"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                        <span style={{padding:"3px 10px",borderRadius:6,background:"rgba(255,255,255,.2)",fontSize:10,fontWeight:700,color:"#fff",letterSpacing:.5}}>FOUNDING MEMBER</span>
                        <span style={{fontSize:10,color:"rgba(255,255,255,.7)"}}>#{"\u2068"}047 of 100</span>
                      </div>
                      <div style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:4}}>$500<span style={{fontSize:14,fontWeight:400,opacity:.8}}>/month</span></div>
                      <div style={{fontSize:13,color:"rgba(255,255,255,.85)",marginBottom:12}}>Locked in forever. Public pricing starts at $1,200/mo.</div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <div style={{flex:1,height:6,borderRadius:3,background:"rgba(255,255,255,.2)"}}>
                          <div style={{width:"47%",height:"100%",borderRadius:3,background:"#fff"}}/>
                        </div>
                        <span style={{fontSize:11,color:"rgba(255,255,255,.9)",fontWeight:600,whiteSpace:"nowrap"}}>47 / 100 claimed</span>
                      </div>
                    </div>
                  </div>

                  {/* What you get */}
                  <div style={{marginBottom:20,padding:20,borderRadius:14,border:"1.5px solid "+c.ln,background:c.cd}}>
                    <div style={{fontSize:15,fontWeight:700,color:c.tx,marginBottom:14}}>Your Founding Member plan includes</div>
                    <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:8}}>
                      {[
                        {ic:"\u{1F916}",t:"1 AI employee",d:"Your own Bloomie agent"},
                        {ic:"\u{1F4AC}",t:"Unlimited messages",d:"No caps, ever"},
                        {ic:"\u{1F517}",t:"3 connected channels",d:"TikTok, email, Slack & more"},
                        {ic:"\u{1F5A5}",t:"Browser automation",d:"Vision AI + live screen"},
                        {ic:"\u{1F4C4}",t:"File creation",d:"Docs, slides, spreadsheets"},
                        {ic:"\u23F0",t:"5 cron jobs",d:"Automated recurring tasks"},
                        {ic:"\u{1F3AF}",t:"Custom skills",d:"Teach your agent new abilities"},
                        {ic:"\u2764\uFE0F",t:"Priority support",d:"Direct line to our team"}
                      ].map(function(f,fi){return(
                        <div key={fi} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10,background:c.sf}}>
                          <span style={{fontSize:18,flexShrink:0}}>{f.ic}</span>
                          <div>
                            <div style={{fontSize:12,fontWeight:600,color:c.tx}}>{f.t}</div>
                            <div style={{fontSize:11,color:c.so}}>{f.d}</div>
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>

                  {/* Invite code / coupon */}
                  <div style={{marginBottom:20,padding:16,borderRadius:14,background:c.sf,border:"1px solid "+c.ln}}>
                    <div style={{fontSize:13,fontWeight:600,color:c.tx,marginBottom:8}}>Have an invite code?</div>
                    <div style={{display:"flex",gap:8}}>
                      <input placeholder="e.g. FOUNDER-048" style={{flex:1,padding:"10px 14px",borderRadius:10,border:"1.5px solid "+c.ln,background:c.inp,color:c.tx,fontSize:13,outline:"none",fontFamily:"monospace"}}/>
                      <button style={{padding:"10px 18px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#F4A261,#E76F8B)",color:"#fff",fontSize:13,fontWeight:700,whiteSpace:"nowrap"}}>Redeem</button>
                    </div>
                    <div style={{fontSize:11,color:c.so,marginTop:6}}>Founding member codes lock you in at $500/mo for life</div>
                  </div>

                  {/* Scale up */}
                  <div style={{marginBottom:20,padding:16,borderRadius:14,border:"1.5px dashed "+c.ac+"40",background:c.ac+"04",textAlign:"center"}}>
                    <div style={{fontSize:22,marginBottom:6}}>{"\u{1F338}"}</div>
                    <div style={{fontSize:14,fontWeight:700,color:c.tx,marginBottom:4}}>Need more Bloomies?</div>
                    <div style={{fontSize:12,color:c.so,marginBottom:4}}>Add extra AI employees to your plan</div>
                    <div style={{fontSize:20,fontWeight:700,color:c.ac}}>+$300<span style={{fontSize:12,fontWeight:400,color:c.so}}>/mo per additional agent</span></div>
                  </div>

                  {/* Coming soon tiers - teaser */}
                  <div style={{padding:16,borderRadius:14,background:c.sf,border:"1px solid "+c.ln}}>
                    <div style={{fontSize:13,fontWeight:700,color:c.tx,marginBottom:4}}>Public pricing coming soon</div>
                    <div style={{fontSize:12,color:c.so,lineHeight:1.6}}>When we open to everyone, plans will start at $1,200/mo. As a founding member, your $500/mo rate never changes — even as we add features. You grow, your price stays.</div>
                  </div>
                </div>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ARTIFACT REVIEW PANEL ── */}
      {shP&&(
        <div style={{position:"fixed",top:artFull?0:0,right:0,width:artFull?"100%":(mob?"100%":480),height:"100vh",background:c.cd,borderLeft:artFull?"none":(mob?"none":"1px solid "+c.ln),boxShadow:artFull?"none":"-8px 0 30px rgba(0,0,0,.15)",zIndex:100,display:"flex",flexDirection:"column",animation:"slideIn .25s ease"}}>

          {/* Panel header */}
          <div style={{padding:"12px 20px",borderBottom:"1px solid "+c.ln,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <span style={{fontSize:24}}>{panel.ic}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:15,fontWeight:700,color:c.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{panel.nm}</div>
              <div style={{fontSize:12,color:c.so}}>{panel.pji} {(PJ.find(function(p){return p.id===panel.pj})||{}).nm}</div>
            </div>
            {/* Fullscreen toggle */}
            <button onClick={function(){setArtFull(!artFull)}} title={artFull?"Exit fullscreen":"Fullscreen"} style={{width:32,height:32,borderRadius:8,border:"1px solid "+c.ln,background:c.sf,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {artFull?(
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={c.so} strokeWidth="1.8"><path d="M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4"/></svg>
              ):(
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={c.so} strokeWidth="1.8"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4"/></svg>
              )}
            </button>
            {/* Close */}
            <button onClick={function(){setPanel(null);setRated(false);setRating(null);setArtFull(false)}} style={{width:32,height:32,borderRadius:8,border:"1px solid "+c.ln,background:c.sf,cursor:"pointer",fontSize:16,color:c.so,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{"\u2715"}</button>
          </div>

          {/* Content area */}
          <div style={{flex:1,overflowY:"auto",padding:artFull?"24px 10%":20}}>
            {panel.ct?(
              <div style={{background:c.sf,borderRadius:14,padding:artFull?32:24,border:"1px solid "+c.ln,minHeight:300,maxWidth:artFull?800:undefined,margin:artFull?"0 auto":undefined}}>
                {panel.ct.split("\n").map(function(line,i){
                  var isTitle=line===line.toUpperCase()&&line.length>3;
                  if(isTitle) return <div key={i} style={{fontSize:artFull?22:18,fontWeight:700,color:c.tx,marginTop:i>0?28:0,marginBottom:12}}>{line}</div>;
                  if(line==="") return <div key={i} style={{height:14}}/>;
                  return <div key={i} style={{fontSize:artFull?16:14.5,color:c.tx,lineHeight:1.8}}>{line}</div>;
                })}
              </div>
            ):(
              <div style={{textAlign:"center",color:c.so,padding:60}}>
                <div style={{fontSize:48,marginBottom:16}}>{panel.ic}</div>
                <div style={{fontSize:16,fontWeight:600,color:c.tx,marginBottom:6}}>{panel.nm}</div>
                <div style={{fontSize:13}}>Content preview not available — ready for download</div>
              </div>
            )}
          </div>

          {/* Footer — either approve/revise OR rating step */}
          {!rated?(
            <div style={{padding:"14px 20px",borderTop:"1px solid "+c.ln,flexShrink:0}}>
              <div style={{display:"flex",gap:10}}>
                <button onClick={revise} style={{flex:1,padding:"12px 0",borderRadius:12,border:"1.5px solid "+c.ln,background:c.cd,cursor:"pointer",fontSize:13,fontWeight:600,color:c.so,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.85 0 014 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
                  Request changes
                </button>
                <button onClick={approve} style={{flex:1,padding:"12px 0",borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(135deg,"+c.gr+",#2D8A45)",color:"#fff",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  Approve
                </button>
              </div>
            </div>
          ):(
            <div style={{padding:"20px 20px 24px",borderTop:"1px solid "+c.ln,flexShrink:0,textAlign:"center"}}>
              <div style={{fontSize:18,marginBottom:4}}>{"\u2705"}</div>
              <div style={{fontSize:15,fontWeight:700,color:c.gr,marginBottom:4}}>Approved!</div>
              <div style={{fontSize:13,color:c.so,marginBottom:16}}>How did {curAgent.nm.split(" ")[0]} do on this one?</div>

              {/* Star rating */}
              <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:16}}>
                {[1,2,3,4,5].map(function(s){return(
                  <button key={s} onClick={function(){setRating(s)}} style={{width:40,height:40,borderRadius:10,border:"1.5px solid "+(rating>=s?c.ac:c.ln),background:rating>=s?c.ac+"18":"transparent",cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s ease"}} onMouseEnter={function(e){e.currentTarget.style.transform="scale(1.15)"}} onMouseLeave={function(e){e.currentTarget.style.transform="scale(1)"}}>
                    <span style={{filter:rating>=s?"none":"grayscale(1)",opacity:rating>=s?1:.35}}>{"\u2B50"}</span>
                  </button>
                )})}
              </div>

              {/* Rating labels */}
              {rating&&(
                <div style={{fontSize:12,color:c.ac,fontWeight:600,marginBottom:14,animation:"pop .2s ease"}}>
                  {rating===1?"Needs work":rating===2?"Below expectations":rating===3?"Meets expectations":rating===4?"Great work":rating===5?"Outstanding!":""}
                </div>
              )}

              {/* Submit / Skip */}
              <div style={{display:"flex",gap:10,maxWidth:320,margin:"0 auto"}}>
                <button onClick={skipRating} style={{flex:1,padding:"10px 0",borderRadius:10,border:"1px solid "+c.ln,background:"transparent",cursor:"pointer",fontSize:12,fontWeight:500,color:c.so}}>Skip</button>
                <button onClick={submitRating} disabled={!rating} style={{flex:1,padding:"10px 0",borderRadius:10,border:"none",cursor:rating?"pointer":"default",background:rating?"linear-gradient(135deg,#F4A261,#E76F8B)":c.sf,color:rating?"#fff":c.fa,fontSize:12,fontWeight:700,transition:"all .15s ease"}}>Submit rating</button>
              </div>
            </div>
          )}

          {/* ── FLOATING COMMAND BAR (artifact fullscreen) ── */}
          {artFull&&(
            <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:110,display:"flex",flexDirection:"column",alignItems:"center",pointerEvents:"none"}}>
              <div style={{width:"100%",height:40,background:"linear-gradient(transparent,"+c.cd+")",pointerEvents:"none"}}/>
              <div style={{width:"100%",background:c.cd,borderTop:"1px solid "+c.ln,padding:mob?"10px 12px 16px":"12px 20px 18px",pointerEvents:"auto"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,maxWidth:680,margin:"0 auto"}}>
                  <div style={{flex:1,display:"flex",alignItems:"center",background:c.sf,borderRadius:14,border:"1.5px solid "+c.ln,padding:"0 6px"}}>
                    <input
                      placeholder={"\"Change the headline\" \u2022 \"Make the font bigger\" \u2022 \"Add a CTA button\""}
                      style={{flex:1,background:"transparent",border:"none",outline:"none",color:c.tx,fontSize:14,padding:"12px 8px"}}
                    />
                  </div>
                  <button style={{width:44,height:44,borderRadius:"50%",border:"1.5px solid "+c.ln,background:c.sf,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.so} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="2" width="6" height="11" rx="3"/>
                      <path d="M5 10a7 7 0 0014 0"/>
                      <line x1="12" y1="17" x2="12" y2="22"/>
                    </svg>
                  </button>
                </div>
                <div style={{textAlign:"center",marginTop:5}}>
                  <span style={{fontSize:10,color:c.fa}}>Esc to exit {"\u2022"} Speak or type to direct changes live</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
