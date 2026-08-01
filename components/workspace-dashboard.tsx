"use client";

import Link from "next/link";
import { Activity, ArrowUpRight, Clock3, FileSearch, Filter, MoreHorizontal, Search, ShieldAlert, ShieldCheck, Upload, Users, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useMemo, useState } from "react";

const rows = [
  ["Northern-light.jpg", "Verified", "Northstar News", "2 min ago", "editorial"],
  ["City-archive-04.tif", "Verified", "Archive team", "3 min ago", "archive"],
  ["Interview-final.mp4", "Verified", "Northstar News", "5 min ago", "video"],
  ["Campaign-export.png", "Review", "Studio team", "8 min ago", "campaign"],
  ["Social-repost.webp", "No credential", "External", "11 min ago", "social"],
  ["Press-photo-118.jpg", "Verified", "Wire desk", "16 min ago", "press"],
];

export function WorkspaceDashboard() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = useMemo(() => rows.filter((row) => row[0].toLowerCase().includes(query.toLowerCase()) && (filter === "All" || row[1] === filter)), [query, filter]);
  return <AppShell>
    <main className="dashboard shell">
      <header className="dashboard__heading"><div><p className="kicker">WORKSPACE / NORTHSTAR</p><h1>Verification queue</h1><p>Monitor provenance checks and assets that require attention.</p></div><Link href="/verify"><Upload/>New verification</Link></header>
      <section className="dashboard__stats"><article><span><ShieldCheck/>VERIFIED ASSETS</span><b>1,284</b><small>+12.8% this month</small></article><article><span><ShieldAlert/>REQUIRES REVIEW</span><b>24</b><small>6 marked urgent</small></article><article><span><Clock3/>AVG. PROCESSING</span><b>1.8s</b><small>Browser + API average</small></article><article><span><Users/>ACTIVE MEMBERS</span><b>12</b><small>Across 3 teams</small></article></section>
      <section className="dashboard__activity"><div><p className="kicker">VERIFICATION VOLUME</p><h2>Last seven days</h2></div><div className="bars" aria-label="Seven day verification activity chart">{[42,68,54,88,63,95,74].map((height,index)=><span key={index} style={{height:`${height}%`}}><i>{height}</i></span>)}</div><div className="activity-legend"><span><i/>Verified</span><b>4,892 checks</b></div></section>
      <section className="asset-table">
        <header><div><p className="kicker">RECENT ASSETS</p><h2>Evidence library</h2></div><div className="asset-table__controls"><label><Search/><span className="sr-only">Search assets</span><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search assets"/></label><div className="filter-menu"><Filter/>{["All","Verified","Review","No credential"].map(item=><button key={item} className={filter===item?"is-active":""} onClick={()=>setFilter(item)}>{item}</button>)}</div></div></header>
        <div className="asset-table__head"><span>ASSET</span><span>STATUS</span><span>SOURCE</span><span>UPDATED</span><span/></div>
        {filtered.length ? filtered.map((row,index)=><article key={row[0]}><span><i className={`asset-icon asset-icon--${index%4}`}><FileSearch/></i><b>{row[0]}</b></span><span className={`asset-status asset-status--${row[1].toLowerCase().replace(" ","-")}`}><i/>{row[1]}</span><span>{row[2]}</span><span>{row[3]}</span><button aria-label={`View details for ${row[0]}`} onClick={()=>setSelected(row[0])}><MoreHorizontal/></button></article>) : <div className="asset-table__empty"><Search/><p>No assets match your search.</p></div>}
      </section>
      {selected && <div className="dashboard-toast" role="status"><FileSearch/><span><b>{selected}</b>Demo asset actions will connect to the provenance API in the backend phase.</span><button aria-label="Dismiss notification" onClick={()=>setSelected(null)}><X/></button></div>}
      <section className="dashboard__bottom"><article><Activity/><div><p className="kicker">SYSTEM STATUS</p><h3>All verification services operational</h3></div><span><i/>Live</span></article><article><div><p className="kicker">TEAM ACTIVITY</p><h3>18 actions today</h3></div><Link href="#activity">View audit activity <ArrowUpRight/></Link></article></section>
    </main>
  </AppShell>;
}
