import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Cookies from 'js-cookie';

const login = ({ email, password }) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((response) => {
            const user = response.user;

            // Set user info in cookies (like UID and displayName)
            Cookies.set('user_id', user.uid, { expires: 7 }); // Expires in 7 days
            Cookies.set('user_name', user.displayName || 'User', { expires: 7 });
            Cookies.set('user_email', user.email, { expires: 7 });

            // do a post fetch on 
              fetch('http://localhost:3000/api/getSession?email='+user.email)
                .then(response => response.json())
                .then(data => {
                    console.log("HERE DAN>",data);
                    Cookies.set('sessionToken', data.SessionToken, { expires: 7 });
                    console.log('sessionToken', data.SessionToken);
                    return data;
                })



        })
        .catch((error) => {
            console.error("Error logging in:", error.message);
        });
};

export default login;
