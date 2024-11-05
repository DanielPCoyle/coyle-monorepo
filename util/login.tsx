

async function login({ email, password }) {
  try {
    const response = await fetch(`https://cdn.inksoft.com/${process.env.NEXT_PUBLIC_INKSOFT_STORE}/Api2/SignIn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        Email: email,
        Password: password,
        Format: 'JSON'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const resText = await response.text();
    const resJson = JSON.parse(resText);
    const sessionToken = resJson.Data?.Token;

    if (sessionToken) {
      document.cookie = `SessionToken=${sessionToken}; path=/`;
      window.location = "/account/designs"
    } else {
      console.error('Session token not found in response');
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
}

export default login;