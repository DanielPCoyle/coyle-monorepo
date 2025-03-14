import React, { ChangeEvent } from "react";

export const AdminLogin = ({ email, setEmail, password, setPassword, handleSubmit }: any) => (
  <>
    <div>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className="inputStyle"
          required />
      </label>
    </div>
    <div>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          className="inputStyle"
          required />
      </label>
    </div>
    <button type="submit" className="buttonStyle">
      Login
    </button>
  </>
);
