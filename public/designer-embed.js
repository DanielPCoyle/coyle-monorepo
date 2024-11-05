(function () {
  // Expose all InkSoft client-side api functionality in one global object, like `window.jQuery` or `window.angular`.
  // This object holds an array of api objects that correspond to an embedded widget (and iframe) on the page.
  window.inksoftApi = window.inksoftApi || {};
  let api = window.inksoftApi;

  api.launchEmbeddedDesignStudio = function (params) {
    launchEmbeddedDesignStudio(params);
  };

  function launchEmbeddedDesignStudio(params) {
    api.embeddedDesignStudios = api.embeddedDesignStudios || {};
    // Generate a random ID for this API to differentiate it from other InkSoft apis on the page.
    let id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    // Set up our URL
    let urlBase = (params.domain ? params.domain : '') + '/' + params.storeUri;
    let dsAction = params.orderId || params.cartId ? 'edit' : 'share';
    // Build a share URL for loading the DS with a specified product or design
    let productUrl = '/shop/design-studio/' + dsAction;
    if (dsAction === 'share') {
      productUrl += `/${params.productId || 0}/${params.productStyleId || 0}/${params.productStyleSizeId || 0}/${params.designId || 0}`;
    } else if (dsAction === 'edit') {
      productUrl += `/${params.productId || 0}/${params.productStyleId || 0}/${params.designId || 0}/${params.productStyleSizeId || 0}/${params.cartId || 0}/${params.orderId || 0}`;
    }
    let url = params.url || urlBase + (params.productId ? productUrl : '/shop/design-studio/select-product');

    /**
     * Pass the sessionToken as a query param, otherwise we will end up calling GetOrCreateSession followed by SignInWithSessionToken.
     * This may cause the cart items / quantities to end up out of sync.
     *
     * By passing it as a query param we can detect this in StartupService and create the application session with the SessionToken session up front,
     * and we can check to make sure that we don't try to overwrite the session in DesignerEmbedService
     */

    const paramsToAdd = new URLSearchParams();

    if (params.sessionToken) {
      paramsToAdd.append('SessionToken', params.sessionToken);
    }
    if (params.artPlacement) {
      paramsToAdd.append('ArtPlacement',  JSON.stringify(params.artPlacement));
    }
    url += '?' + paramsToAdd.toString();

    // Create our iFrame
    let iframe = createFrame(url, 'designStudioIframe', 'InkSoft Embedded Design Studio');
    let target = document.getElementById(params.targetElementId);
    // Make sure there's no nonsense causing an issue with 100% width creating scrollbars.
    target.style.border = target.style.margin = target.style.padding = 0;

    api.embeddedDesignStudios[id] = api;

    // Load PostRobot so we can communicate two ways with the Embedded Designer
    loadScript((params.domain ? params.domain : '') + (params.storeUri ? '/FrontendApps/storefront' : '') + '/assets/scripts/post-robot.js', 'post-robot', function () {
      target.appendChild(iframe);

      // postRobot looks for requirejs and registers itself there if possible. Some customers have requirejs on their
      // designer embed pages.
      if (!window.postRobot && window.requirejs) {
        requirejs(['postRobot'], function(pr) {
          setupPostRobot(pr, iframe, params);
        });
      } else {
        setupPostRobot(window.postRobot, iframe, params)
      }
    });
  }

  function setupPostRobot(postRobot, iframe, params) {
    // Pass through parameters to iFrame once it is ready
    postRobot.on('embeddedDsLoaded', { window: iframe.contentWindow }, function() {
      postRobot.send(iframe.contentWindow, 'sendEmbeddedDsParams', params);
    });
  }

  function isIOS() {
    return navigator.userAgent.match(/(iPod|iPhone|iPad)/);
  }

  function createFrame(url, id, title) {
    let iframe = document.createElement('iframe');
    iframe.setAttribute('src', url);
    iframe.setAttribute('id', id);
    iframe.setAttribute('title', title);
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('scrolling', isIOS() ? 'no' : 'yes');
    iframe.style.height = '100%';
    iframe.style.minWidth = '100%';
    iframe.style.width = isIOS() ? '100px' : '100%';

    return iframe;
  }

  let loadScript = function (scriptPath, scriptTagID, success, error) {
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = success;

    if (navigator.userAgent.match(/(MSIE 8)/g)) {
      let done = false;
      script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
          done = true;
          if (success) {
            success();
          }

          // Handle memory leak in IE
          script.onload = script.onreadystatechange = null;
          if (head && script.parentNode) {
            head.removeChild(script);
          }
        }
      };
    }

    try {
      // Throws exception in IE8
      script.onerror = error;
    } catch (ex) {

    }

    script.src = scriptPath;

    if (scriptTagID) {
      script.id = scriptTagID;
    }

    head.appendChild(script);
  };
})();