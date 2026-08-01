export function EvidenceArtwork() {
  return (
    <div className="evidence-artwork" aria-hidden="true">
      <div className="evidence-artwork__registration">
        <span>ORIGINAL</span>
        <span>8F42—A91C</span>
      </div>
      <div className="evidence-artwork__image">
        <div className="evidence-artwork__sun" />
        <div className="evidence-artwork__ridge evidence-artwork__ridge--far" />
        <div className="evidence-artwork__ridge evidence-artwork__ridge--near" />
        <div className="evidence-artwork__scan" data-scan-frame />
        <div className="evidence-artwork__crop">
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="evidence-artwork__caption">
        <b>01</b>
        <span>PROVENANCE RECORD</span>
        <span>CAPTURE → EDIT → EXPORT</span>
      </div>
    </div>
  );
}
