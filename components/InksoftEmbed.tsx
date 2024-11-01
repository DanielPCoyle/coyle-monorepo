import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

interface InksoftEmbedProps {
  productId: number;
  designId?: number;
}

const InksoftEmbed: React.FC<InksoftEmbedProps> = ({ productId, designId }) => {
  const router = useRouter();
  const launchCount = useRef(0); // Ref to track the number of launches

  useEffect(() => {
    let scriptElement: HTMLScriptElement | undefined;

    // Function to launch the design studio with specified parameters
    const launchDesignStudio = () => {
      launchCount.current += 1; // Increment launch count
      console.log(`Launching InkSoft Design Studio - Run count: ${launchCount.current}`);
      
      if (!document.getElementById('designStudioIframe') && launchCount.current === 1) {
        (window as any).inksoftApi.launchEmbeddedDesignStudio({
          targetElementId: 'inksoftEmbed',
          domain: 'https://stores.inksoft.com',
          cdnDomain: 'https://cdn.inksoft.com',
          storeUri: 'DS369379180',
          productId: productId,
          designId: designId,
        });
      }
    };

    // Function to initialize the InkSoft embed script if not already loaded
    const initScript = () => {
      if (!document.getElementById('inksoftScript')) {
        scriptElement = document.createElement('script');
        scriptElement.id = 'inksoftScript';
        scriptElement.type = 'text/javascript';
        scriptElement.async = true;
        scriptElement.src = 'https://cdn.inksoft.com/FrontendApps/storefront/assets/scripts/designer-embed.js';
        scriptElement.onload = launchDesignStudio;
        document.body.appendChild(scriptElement);
      } else {
        launchDesignStudio();
      }
    };

    // Initialize the script or run `launchDesignStudio` if script is already loaded
    initScript();

    // Cleanup on route change or component unmount
    return () => {
      if (scriptElement) {
        scriptElement.remove();
      }
      const targetDiv = document.getElementById('inksoftEmbed');
      if (targetDiv) {
        targetDiv.innerHTML = ''; // Clear any initialized content
      }
    };
  }, [router.asPath, productId, designId]);

  return (
    <div className="embed-container">
      <div id="inksoftEmbed"></div>
    </div>
  );
};

export default InksoftEmbed;
