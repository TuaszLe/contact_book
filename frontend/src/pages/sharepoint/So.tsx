function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px" }}>
      {/* Iframe cũ - full width */}
      <div style={{ height: "80vh" }}>
        <iframe
          src="https://vetccomvn.sharepoint.com/sites/NOCVETC/_layouts/15/Doc.aspx?sourcedoc={b9e3282e-10da-43ab-9dfc-75a57c7aee07}&action=embedview&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True"
          width="100%"
          height="100%"
          frameBorder="0"
        />
      </div>

      {/* 2 iframe cảnh báo - bố trí ngang */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <iframe
          width="402"
          height="346"
          frameBorder="0"
          scrolling="no"
          src="https://vetccomvn.sharepoint.com/sites/NOCVETC/_layouts/15/Doc.aspx?sourcedoc={29926fc0-933d-47bc-a801-a85aa0c9f4c1}&action=embedview&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0"
        />
        <iframe
          width="402"
          height="346"
          frameBorder="0"
          scrolling="no"
          src="https://vetccomvn.sharepoint.com/sites/NOCVETC/_layouts/15/Doc.aspx?sourcedoc={c94221fd-ceec-48a9-91cf-53e88676df64}&action=embedview&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0"
        />
      </div>
    </div>
  );
}

export default App;
