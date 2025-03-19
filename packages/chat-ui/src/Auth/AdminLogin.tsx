import React, { ChangeEvent } from "react";
import { AdminLoginProps } from "../../types";

export const AdminLogin = ({
  email,
  setEmail,
  password,
  setPassword,
}: AdminLoginProps) => (
  <>
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
    <div>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          className="inputStyle"
          required
        />
      </label>
    </div>
    <button type="submit" className="buttonStyle">
      Login
    </button>
  </>
);
