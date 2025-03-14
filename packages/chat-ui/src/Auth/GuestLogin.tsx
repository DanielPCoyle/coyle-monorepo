import React, { ChangeEvent } from "react";

export const GuestLogin = ({ userName, setUserName, email, setEmail }: {
  userName: string;
  setUserName: (userName: string) => void;
  email: string;
  setEmail: (email: string) => void;
}) => (
  <>
    <div>
      <label>
        Name:
        <input
          type="text"
          value={userName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUserName(e.target.value)
          }
          className="inputStyle"
          required
        />
      </label>
    </div>
    <div>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          className="inputStyle"
          required
        />
      </label>
    </div>
    <button type="submit" className="buttonStyle">
      Chat Now
    </button>
  </>
);
