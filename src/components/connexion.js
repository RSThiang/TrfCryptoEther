// src/components/Login.js
import React from "react";

const Login = ({ onLogin }) => {
  const handleLogin = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      onLogin(); // Appelle la fonction de connexion passée en props
    } catch (error) {
      console.error("User denied account access", error);
      alert("Veuillez autoriser l'accès à votre compte MetaMask.");
    }
  };

  return (
    <div>
      <h1>Bienvenue dans votre application de Cryptomonnaie</h1>
      <button onClick={handleLogin}>Connecter le Compte Principal</button>
    </div>
  );
};

export default Login;
