import { useState } from "react";

function App() {
  const [active, setActive] = useState<"DR" | "DCN">("DR");

  const iframes = {
    DR: "https://vetccomvn.sharepoint.com/sites/NOCVETC/_layouts/15/Doc.aspx?sourcedoc={29926fc0-933d-47bc-a801-a85aa0c9f4c1}&action=embedview&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0",
    DCN: "https://vetccomvn.sharepoint.com/sites/NOCVETC/_layouts/15/Doc.aspx?sourcedoc={c94221fd-ceec-48a9-91cf-53e88676df64}&action=embedview&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "12px", boxSizing: "border-box", gap: "10px" }}>
      {/* Nút toggle */}
      <div style={{ display: "flex", gap: "8px" }}>
        {(["DR", "DCN"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            style={{
              padding: "6px 24px",
              fontWeight: 600,
              fontSize: "14px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: active === key ? "#01696f" : "#e0e0e0",
              color: active === key ? "#fff" : "#333",
              transition: "all 0.2s",
            }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* iframe vừa trang */}
      <iframe
        src={iframes[active]}
        style={{ flex: 1, width: "100%", border: "none", borderRadius: "8px" }}
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
}

export default App;
