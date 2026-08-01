import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Fingerprint,
  ShieldCheck,
  Upload,
} from "lucide-react";

const timeline = [
  {
    id: "01",
    label: "Captured",
    meta: "Leica SL3 · 06:42 UTC",
    detail: "Original capture signed at source",
    tone: "valid",
  },
  {
    id: "02",
    label: "Adjusted",
    meta: "Lightroom · 07:18 UTC",
    detail: "Exposure and color profile changed",
    tone: "edit",
  },
  {
    id: "03",
    label: "Published",
    meta: "Northstar News · 08:03 UTC",
    detail: "Publisher identity cryptographically signed",
    tone: "valid",
  },
  {
    id: "04",
    label: "Verified",
    meta: "Verity · just now",
    detail: "Credential chain intact",
    tone: "valid",
  },
];

export function ManifestSection() {
  return (
    <section id="how" className="manifest section shell">
      <div className="section-heading" data-reveal>
        <p className="kicker">01 / Provenance, made visible</p>
        <h2>
          A file is not a moment.
          <br />
          <em>It is a chain of events.</em>
        </h2>
        <p className="section-intro">
          Verity reads the cryptographically signed history attached to digital
          media and translates it into evidence people can understand.
        </p>
      </div>
      <div className="trace">
        <div className="trace__visual" data-reveal>
          <div className="trace__frame">
            <div className="trace__scene">
              <div className="trace__sun" />
              <div className="trace__hill trace__hill--one" />
              <div className="trace__hill trace__hill--two" />
            </div>
            <span>ACTIVE MANIFEST</span>
          </div>
          <div className="trace__stamp">
            <Fingerprint size={23} />
            <span>SHA-256</span>
            <b>8f42...a91c</b>
          </div>
        </div>
        <div className="trace__list">
          {timeline.map((item) => (
            <article key={item.id} data-trace-row>
              <div className={`trace__dot trace__dot--${item.tone}`}>
                <span>{item.id}</span>
              </div>
              <div>
                <h3>{item.label}</h3>
                <p>{item.meta}</p>
                <small>{item.detail}</small>
              </div>
              <Check size={17} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WorkspacePreview() {
  const assets = [
    "Northern light.jpg",
    "City archive-04.tif",
    "Interview-final.mp4",
    "Campaign-export.png",
  ];
  return (
    <section id="workspace" className="workspace section shell">
      <div className="workspace__copy" data-reveal>
        <p className="kicker">03 / Built for verification teams</p>
        <h2>
          From one file
          <br />
          to every file.
        </h2>
        <p>
          Review high-volume media, preserve an auditable record, and integrate
          provenance checks into the tools your team already uses.
        </p>
        <Link href="/workspace">
          Explore the workspace <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="workspace__ui" data-reveal>
        <div className="workspace__nav">
          <span className="brand__mark">V</span>
          <div>
            <i />
            <i />
            <i />
            <i />
          </div>
          <span>AD</span>
        </div>
        <div className="workspace__body">
          <div className="workspace__header">
            <div>
              <small>WORKSPACE / DEMONSTRATION</small>
              <h3>Verification queue</h3>
            </div>
            <Link href="/verify">
              <Upload size={14} />
              New verification
            </Link>
          </div>
          <div className="workspace__stats">
            <div>
              <small>SAMPLE ASSETS</small>
              <b>1,284</b>
              <span>Demo data</span>
            </div>
            <div>
              <small>REQUIRES REVIEW</small>
              <b>24</b>
              <span>Simulated</span>
            </div>
            <div>
              <small>AVG. PROCESSING</small>
              <b>1.8s</b>
              <span>Preview</span>
            </div>
          </div>
          <div className="workspace__table">
            <div className="table-head">
              <span>ASSET</span>
              <span>STATUS</span>
              <span>SOURCE</span>
              <span>UPDATED</span>
            </div>
            {assets.map((name, index) => (
              <div className="table-row" key={name}>
                <span>
                  <i className={`mini-media mini-media--${index}`} />
                  <b>{name}</b>
                </span>
                <span>
                  <i className={index === 3 ? "warn" : "ok"} />
                  {index === 3 ? "Review" : "Verified"}
                </span>
                <span>{index % 2 ? "Archive demo" : "Northstar demo"}</span>
                <span>{index + 2} min ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ClosingSection() {
  return (
    <section className="closing">
      <div className="closing__grid" />
      <div className="closing__seal" data-reveal>
        <ShieldCheck />
        <span>
          PROOF
          <br />
          FOUND
        </span>
      </div>
      <div className="closing__copy shell" data-reveal>
        <p className="kicker">The next layer of digital trust</p>
        <h2>
          Don&apos;t guess
          <br />
          what happened.
          <br />
          <em>Trace it.</em>
        </h2>
        <Link href="/verify">
          Verify an asset <ArrowUpRight />
        </Link>
      </div>
      <footer className="shell">
        <div className="brand">
          <span className="brand__mark">V</span>
          <span>VERITY</span>
        </div>
        <p>
          Content provenance infrastructure for a more transparent internet.
        </p>
        <div>
          <Link href="/verify">Verify</Link>
          <a href="https://c2pa.org" target="_blank" rel="noreferrer">
            C2PA
          </a>
          <a
            href="https://github.com/Dpehect/Verity-AI-PHOTO-CHECK-APP"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
        <span>© 2026 VERITY</span>
      </footer>
    </section>
  );
}
