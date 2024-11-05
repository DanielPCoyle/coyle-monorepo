async function logout() {
    try {
        const response = await fetch(`https://cdn.inksoft.com/${process.env.NEXT_PUBLIC_INKSOFT_STORE}/Api2/SignOut`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // matches the dataType: 'text' in the original AJAX
          },
          body: 'Format=JSON', // send data in the same format as the original request
          mode: 'cors', // equivalent to crossDomain: true
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    
        const result = await response.text(); // process response as text
        console.log("RESULT",result); // call success callback function with the result
        // if (!response.ok) {
        //     throw new Error(`HTTP error! Status: ${response.status}`);
        //   }
    
          document.cookie = "SessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "GuestSessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

          if(window.location.pathname.includes('/account/')) {
            window.location = "/"; // Redirect to the home page after logout
          }
      } catch (error) {
        error(error.message); // call error callback function with the error message
      }
  }
  
  export default logout;
  