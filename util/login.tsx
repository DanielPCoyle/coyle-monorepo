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
            console.log("User logged in successfully");
            window.location.href = "/account/designs";

        })
        .catch((error) => {
            console.error("Error logging in:", error.message);
        });
};

export default login;
