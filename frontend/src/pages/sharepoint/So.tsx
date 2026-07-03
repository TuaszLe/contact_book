import { useState } from "react";

function App() {
  const [active, setActive] = useState<"DR" | "DCN">("DR");

  const iframes = {
    DR: "https://vetccomvn.sharepoint.com/sites/NOCVETC/_layouts/15/Doc.aspx?sourcedoc={29926fc0-933d-47bc-a801-a85aa0c9f4c1}&action=embedview&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0",
    DCN: "https://vetccomvn.sharepoint.com/sites/NOCVETC/_layouts/15/Doc.aspx?sourcedoc={c94221fd-ceec-48a9-91cf-53e88676df64}&action=embedview&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0",
  };

  const scale = 0.78; // giảm nữa nếu vẫn còn to: 0.72 hoặc 0.7

  return (
    <div
      style={{
        height: "80dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        padding: "8px",
        boxSizing: "border-box",
        gap: "8px",
        background: "#f5f5f5",
      }}
    >
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        {(["DR", "DCN"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            style={{
              padding: "6px 20px",
              fontWeight: 600,
              fontSize: "14px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: active === key ? "#01696f" : "#e0e0e0",
              color: active === key ? "#fff" : "#333",
            }}
          >
            {key}
          </button>
        ))}
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          borderRadius: "8px",
          background: "#fff",
        }}
      >
        <iframe
          src={iframes[active]}
          title={active}
          frameBorder="0"
          scrolling="no"
          style={{
            width: `${100 / scale}%`,
            height: `${100 / scale}%`,
            border: "none",
            display: "block",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>
  );
}

export default App;
