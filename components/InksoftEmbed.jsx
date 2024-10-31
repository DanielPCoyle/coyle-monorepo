import React, { useEffect } from 'react';

function DesignerEmbed({ productId, designId }) {
  useEffect(() => {
    // Check if script is already loaded
    if (!document.querySelector('script[src="https://cdn.inksoft.com/FrontendApps/storefront/assets/scripts/designer-embed.js"]')) {
      const scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.async = true;
      scriptElement.src = 'https://cdn.inksoft.com/FrontendApps/storefront/assets/scripts/designer-embed.js';
      scriptElement.onload = function () { launchDesignStudio(); };
      document.body.appendChild(scriptElement);
    } else {
      // Script already exists, directly launch design studio
      launchDesignStudio();
    }

    function launchDesignStudio() {
      if (window.inksoftApi) {
        window.inksoftApi.launchEmbeddedDesignStudio({
          targetElementId: 'inksoftEmbed',
          domain: 'https://stores.inksoft.com',
          cdnDomain: 'https://cdn.inksoft.com',
          storeUri: 'philadelphiascreenprinting',
          productId: productId || 0,
          designId: designId || 0,
        });
      }
    }
  }, [productId, designId]); // Only re-run if productId or designId changes

  return (
    <div className="embed-container">
      <div
        id="inksoftEmbed"
        style={{ width: "100%", height: "720px", padding: 0, margin: 0, border: 0, maxHeight: "100%" }}
      ></div>
    </div>
  );
}

export default DesignerEmbed;
