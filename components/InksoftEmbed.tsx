import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

interface InksoftEmbedProps {
  productId: number;
  designId?: number;
}

const InksoftEmbed: React.FC<InksoftEmbedProps> = ({ productId, designId }) => {
  const router = useRouter();
  const launchCount = useRef(0); // Ref to track the number of launches
  const [sessionToken, setSessionToken] = useState('');
  const [guestToken, setGuestToken] = useState('');
  useEffect(() => {
    let scriptElement: HTMLScriptElement | undefined;

    // Function to launch the design studio with specified parameters
    const launchDesignStudio = () => {
      
      console.log({productId,designId,sessionToken})
      if (!document.getElementById('designStudioIframe') && launchCount.current === 0) {
        console.log(`Launching InkSoft Design Studio - Run count: ${launchCount.current}`);
        launchCount.current += 1; // Increment launch count

        (window as any).inksoftApi.launchEmbeddedDesignStudio({
          targetElementId: 'inksoftEmbed',
          domain: 'https://stores.inksoft.com',
          cdnDomain: 'https://cdn.inksoft.com',
          storeUri: process.env.NEXT_PUBLIC_INKSOFT_STORE,
          productId: productId,
          designId: designId,
          // sessionToken: sessionToken,
          sessionToken: sessionToken,
          onDesignerReady: (embedData) => {
            ()=>router.push('/cart');
          },
          onCartTriggered: (embedData) => {
            router.push('/cart');
          }
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
        scriptElement.src = '/designer-embed.js';
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
  }, [router.asPath, productId, designId,sessionToken]);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      // Ensure the message is from the expected origin
          if(event.data.forParent){
            if(!document.cookie.includes('SessionToken')){
                const sessionToken = event.data.data.SessionToken;
                document.cookie = `SessionToken=${sessionToken}; path=/`;
                setGuestToken(sessionToken);
            } else{
              const parseCookies = (cookieString) => {
                return cookieString.split(';').reduce((cookies, cookie) => {
                  const [name, value] = cookie.split('=').map(c => c.trim());
                  cookies[name] = value;
                  return cookies;
                }, {});
              };
          
              const cookies = parseCookies(document.cookie);
              console.log({cookies})
              setSessionToken(cookies.SessionToken);
            }
          }
    });
  }, []);

  useEffect(() => {
    if (sessionToken) {
      launchCount.current = 0; // Reset launch count
      // remove designStudioIframe
      const targetDiv = document.getElementById('inksoftEmbed');
      if (targetDiv) {
        targetDiv.innerHTML = ''; // Clear any initialized content
      }
    }
  }, [sessionToken]);

  return (
    <>
    <div>SESSION TOKEN:{sessionToken}</div>
    <div>GUEST TOKEN:{guestToken}</div>
    <div className="embed-container">
      <div id="inksoftEmbed" style={{ width: '100%', height: '720px', padding: '0', margin: '0', border: '0', maxHeight: '100%' }}></div>
    </div>
    </>
  );
};

export default InksoftEmbed;
