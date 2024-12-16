// src/components/Transfer.js
import React, { useState, useEffect } from "react";
import { getWeb3, getContract } from "../web3"; // Assurez-vous que cela pointe vers le bon fichier

const Transfer = ({ selectedAccount }) => {
  const [contract, setContract] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState("");
  const [web3, setWeb3] = useState(null); // État pour web3

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = await getWeb3();
        const accounts = await web3Instance.eth.getAccounts(); // Récupérer tous les comptes de Ganache
        const contract = await getContract(web3Instance);

        console.log("Accounts from Ganache:", accounts); // Débogage : afficher les comptes
        setAccounts(accounts); // Stocker les comptes
        setContract(contract);
        setRecipient(accounts[1]); // Sélectionner le deuxième compte par défaut

        // Récupérer le solde du compte sélectionné
        const balance = await web3Instance.eth.getBalance(selectedAccount); // Vérifier le solde du compte sélectionné
        setAccountBalance(web3Instance.utils.fromWei(balance, "ether")); // Convertir en ETH
        setWeb3(web3Instance); // Stocker l'instance de web3
      } catch (error) {
        console.error("Error connecting to contract or blockchain", error);
      }
    };
    init();
  }, [selectedAccount]); // Dépendance sur le compte sélectionné

  const handleTransfer = async () => {
    if (!recipient || !amount) {
      setMessage("Veuillez entrer une adresse et un montant valides.");
      return;
    }

    const value = Number(amount);
    if (value <= 0 || value > accountBalance) {
      setMessage("Le montant doit être supérieur à 0 et ne peut pas dépasser le solde.");
      return;
    }

    try {
      await contract.methods.transfer(recipient).send({
       
        from: selectedAccount, // Utiliser le compte sélectionné
        value: web3.utils.toWei(amount, "ether"), // Utiliser l'instance de web3
      });
      setMessage(`Transfert de ${amount} ETH vers ${recipient} réussi.`);
      
      // Mettre à jour le solde du compte après le transfert
      const balance = await web3.eth.getBalance(selectedAccount); // Vérifier le nouveau solde
      setAccountBalance(web3.utils.fromWei(balance, "ether")); // Convertir en ETH
    } catch (error) {
      setMessage("Échec du transfert.");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Transfert de Cryptomonnaie</h1>
      <h2>Compte : {selectedAccount}</h2>
      <h2>Solde : {accountBalance} ETH</h2>
      
      <label>Adresse du Destinataire:</label>
      <select value={recipient} onChange={(e) => setRecipient(e.target.value)}>
        <option value="">Sélectionnez une adresse</option>
        {accounts.map((account, index) => (
          <option key={index} value={account}>
            {account}
          </option>
        ))}
      </select>

      <label>Montant (ETH):</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handleTransfer}>Envoyer</button>
      <p>{message}</p>
    </div>
  );
};

export default Transfer;
