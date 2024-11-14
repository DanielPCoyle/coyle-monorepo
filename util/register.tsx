import Cookies from 'js-cookie';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "../util/firebase";

export const register = (props) => {
  const { email, password, first_name, last_name, confirm_password } = props;

  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((response) => {
      const user = response.user;
      // Update the user's display name
      updateProfile(user, {
        displayName: `${first_name} ${last_name}`,
      }).then(() => {
        console.log("User display name updated successfully");
      }).catch((error) => {
        console.error("Error updating user profile", error);
      });

      // Save user info in first-party cookies (e.g., user ID and display name)
      Cookies.set('user_id', user.uid, { expires: 7 }); // expires in 7 days
      Cookies.set('user_name', `${first_name} ${last_name}`, { expires: 7 });
      Cookies.set('user_email', email, { expires: 7 });
      console.log("User registered and cookies set successfully");
    })
    .catch((error) => {
      console.error({ error });
    });
};

export default register;