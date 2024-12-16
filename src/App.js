// src/components/Transfer.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SimpleTransfer from "./contracts/EtherTransfer.json"; // Assurez-vous que le chemin est correct
import './App.css'
const Transfer = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [web3, setWeb3] = useState(null); // État pour web3
  const [transactions, setTransactions] = useState([]); // Transactions
  const [selectedTransaction, setSelectedTransaction] = useState(null); // Détails de la transaction
  const [isFormOpen, setFormOpen] = useState(false); // État pour gérer l'affichage du formulaire
 

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Récupérer tous les comptes de Ganache ou MetaMask
        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts); // Stocker les comptes

        // Initialisation du contrat
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = SimpleTransfer.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          SimpleTransfer.abi,
          deployedNetwork && deployedNetwork.address
        );
        // console.log(web3Instance.eth.abi.decodeParameter("address","0x1a695230000000000000000000000000a7ea720af8ce30e438c1a252ba6905b5dbe50be6".slice(10)));
        //console.log(abit);
        setContract(contractInstance); // Définir le contrat
        setWeb3(web3Instance); // Stocker l'instance de web3

        // Sélectionner le premier compte par défaut
        if (accounts.length > 0) {
          setSelectedAccount(accounts[0]);
          // Récupérer le solde du compte sélectionné
          const balance = await web3Instance.eth.getBalance(accounts[0]);
          setAccountBalance(web3Instance.utils.fromWei(balance, "ether")); // Convertir en ETH
         // const abi = SimpleTransfer.abi;
          // Charger les transactions du compte principal
          loadTransactions(web3Instance, accounts[0]);
        }
      } catch (error) {
        alert("Error connecting to contract or blockchain");
        console.error("Error connecting to contract or blockchain", error);
      }
    };
    init();
  }, []);

 
  
  
  const loadTransactions = async (web3Instance, account) => {
    //const ab = SimpleTransfer.abi;
    try {
      let latestBlock = await web3Instance.eth.getBlockNumber();
      latestBlock = latestBlock.toString();  // Convertir en chaîne de caractères pour éviter les erreurs BigInt
  
      //console.log(`Dernier bloc : ${latestBlock}`);
  
      const transactions = [];
  
      // Parcourir les blocs récents
      // for (let i = parseInt(latestBlock); i >= parseInt(latestBlock) - 100 && i >= 0; i--) {
      //   const block = await web3Instance.eth.getBlock(i, true);
        
      //   // Vérifier s'il y a des transactions dans le bloc
      //   if (block && block.transactions.length > 0) {
      //     //console.log(`Bloc numéro ${i} contient ${block.transactions.length} transactions`);
          
      //  // console.log(block);
      //     block.transactions.forEach((tx) => {
      //       const decodedTo = web3Instance.eth.abi.decodeParameter("address", tx.input.slice(10)); // Décoder l'adresse "to"
      //       //console.log(decodedTo);
      //       // Afficher chaque transaction pour voir ses champs
      //       //console.log(`Transaction trouvée :`, tx);
      //       //console.log(tx);
           
      //     if ( account.toLowerCase() ===  tx.from.toLowerCase() ||
      //     decodedTo.toLowerCase() === tx.to?.toLowerCase()
      //      ) {
            
      //       const transactionDetails = {
      //         hash: tx.hash,
      //         from: tx.from,
      //         to : decodedTo,
             
      //        // to: web3Instance.eth.abi.decodeParameter("address",tx.input.slice(10)),

      //         value: web3Instance.utils.fromWei(tx.value, "ether"), // Convertir en ETH
      //         timestamp: block.timestamp, // Récupérer le timestamp du bloc
      //         blockNumber: i,
      //         type: tx.from.toLowerCase() === account.toLowerCase() ? "sent" : "received" // Définir le type
      //       };
      //      // console.log(`Hash: ${tx.hash}, From: ${tx.from}, To: ${tx.to}, Value: ${tx.value} ETH, Block: ${tx.blockNumber}, Timestamp: ${new Date(tx.timestamp * 1000).toLocaleString()}`);
            
      //       transactions.push(transactionDetails); 
      //       console.log(transactions);
      //       }
      //     });
      //   } 
      // }
      for (let i = parseInt(latestBlock); i >= parseInt(latestBlock) - 100 && i >= 0; i--) {
        const block = await web3Instance.eth.getBlock(i, true);
        
        if (block && block.transactions.length > 0) {
          block.transactions.forEach((tx) => {
            let transactionDetails ;
            const decodedTo = web3Instance.eth.abi.decodeParameter("address",tx.input.slice(10)); // Décoder l'adresse "to"
            //console.log(tx.from,tx.to,account,decodedTo);
            //console.log(block.blockNumber);
            // Vérifier si l'expéditeur ou le destinataire correspond au compte
            if (tx.from.toLowerCase() === account.toLowerCase()) {
              // Transaction envoyée
              transactionDetails={
                
                hash: tx.hash,
                from: tx.from,
                to: decodedTo,
                value: web3Instance.utils.fromWei(tx.value, "ether"), // Convertir en ETH
                timestamp: block.timestamp,
                blockNumber: i,
                type: 0,
              };
              
            } else if (decodedTo.toLowerCase() === account.toLowerCase()) {
              // Transaction reçue
              console.log(tx.to);
              transactionDetails ={
                
                hash: tx.hash,
                from: tx.from,
                to: decodedTo,
                value: web3Instance.utils.fromWei(tx.value, "ether"), // Convertir en ETH
                timestamp: block.timestamp,
                blockNumber:i ,
                type: 1,
              };
            }
            //console.log(transactionDetails);
              if (transactionDetails) {
                console.log("ok")
               transactions.push(transactionDetails); // Ajouter chaque transaction
              }
            //console.log(transactions);
          });
        }
      }
     
      //console.log("Transactions récupérées : ", transactions);
      //return transactions;
      
      //console.log(`Transactions associées à l'adresse :`, transactions);
       // Mettre à jour l'état avec les transactions trouvées
       setTransactions(transactions);
      // console.log(transactions);
      } catch (error) {
      console.error("Erreur lors de la connexion au contrat ou à la blockchain :", error);
    }
    
  };
  

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
      //alert(`Transfert de ${amount} ETH vers ${recipient} réussi.`)
      setMessage(`Transfert de ${amount} ETH vers ${recipient} réussi.`);
      
      // Mettre à jour le solde du compte après le transfert
      const balance = await web3.eth.getBalance(selectedAccount); // Vérifier le nouveau solde
      setAccountBalance(web3.utils.fromWei(balance, "ether")); // Convertir en ETH
    } catch (error) {
      setMessage("Échec du transfert.");
      console.error(error);
    }
  };

  
  const openForm = () => setFormOpen(true); // Ouvrir le formulaire de transfert
  const closeForm = () => setFormOpen(false); // Fermer le formulaire de transfert
 
  const handleTransactionClick = (tx) => {
      //console.log(tx);
    setSelectedTransaction(tx); 
    // Stocker la transaction sélectionnée pour afficher les détails
    };

  return (
    
    <div className="containr">
      
     {!selectedAccount && (
        <>

      <div className="titre">
        <h1 className="text-center">Bienvenue sur notre DApp</h1>
      </div>
     
      <div className="desc">
        
       <p>Cette application décentralisée permet d'effectuer des transferts sécurisés de cryptomonnaies en utilisant la blockchain Ethereum.
      <br />
      onnectez votre portefeuille et commencez à envoyer des fonds en toute sécurité !</p>
      </div>
</>
      )}

      {!selectedAccount ? (
        <button className="b btn btn-primary" style={{ cursor: "pointer" }} onClick={() => window.ethereum.request({ method: "eth_requestAccounts" })}>
         Se Connecter
        </button>
      ) : (
        
        <>
        <div className="Compte">
          <h2>Mon Compte : </h2>
          <p>{selectedAccount}</p> 
          <p> {accountBalance} ETH </p>
          </div>
          <button className="btn btn-primary t" style={{ cursor: "pointer" }}  onClick={openForm}>Faire un Transfert</button>
          
          <p className="message">{message}</p>

          {/* Formulaire de transfert sous forme de pop-up */}
          {isFormOpen && (
    <div className="modal show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Transférer des Ethers</h5>
          {/* <button type="button" className="close" onClick={closeForm}>
            <span>&times;</span>
          </button> */}
        </div>
        <div className="modal-body">
          <label>Adresse du Destinataire:</label>
          <select className="form-select mb-3" value={recipient} onChange={(e) => setRecipient(e.target.value)}>
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
            className="form-control mb-3"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleTransfer}>Envoyer</button>
          <button className="btn btn-danger" onClick={closeForm}>Fermer</button>
        </div>
      </div>
    </div>
  </div>
)}


  {/* Liste des transactions simplifiée */}
  <h3 className="tr">Mes Transactions </h3>
    <div className="ls">
          <ul className="list-group ">
              <li className="list-group-item  d-flex justify-content-between align-items-center"
                  >
                  <span className="badge rounded-pill">#</span>

                  <p><strong>Hash</strong></p>
                  <p><strong>Montant</strong> </p>
                </li>
            {transactions.length > 0 ? (
              transactions.map((tx, index) => (
                
                <li
                  key={index}
                  className="list-group-item  d-flex justify-content-between align-items-center"
                  onClick={() => handleTransactionClick(tx)}
                  style={{ cursor: "pointer" }}
                      >
                  <span className="badge rounded-pill">{tx.blockNumber}</span>

                  <p><strong> {tx.hash.substring(0, 20)}...</strong></p>
                  <p style={{
              color: tx.type === 0 ? "red" : "green",
              fontWeight: "bold",
            }}>
              <strong> 
            {tx.type === 0 ? `- ${tx.value} ETH` : `+ ${tx.value} ETH`}</strong> </p>
             </li>
              ))
            ) : (
              <p>Aucune transaction trouvée.</p>
            )}
          </ul>
          </div>
          
          {/* Détails de la transaction sélectionnée */}
          {selectedTransaction && (
  <div className="modal show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title"> Transaction {selectedTransaction.blockNumber}</h5>
          {/* <button type="button" className="close" onClick={() => setSelectedTransaction(null)}>
            <span>&times;</span>
          </button> */}
        </div>
        <div className="modal-body">
        <p><strong>Hash:</strong> <span title={selectedTransaction.hash}>{selectedTransaction.hash.substring(0, 20)}...{selectedTransaction.hash.substring(selectedTransaction.hash.length - 20)}</span></p>

          <p><strong> Montant: </strong> {selectedTransaction.value} ETH</p>
          <p>{/* Différenciation Envoi/Réception */}
          {selectedTransaction.type === 0 ? (
            
              <span className="badge bg-danger">Envoyée à </span> 
            
              ) : (
                
              <span className="badge bg-success">Reçue de  </span> 
              )}
              
              {selectedTransaction.type === 0 ? selectedTransaction.to : selectedTransaction.from}
          </p>
         
          <p><strong>Le:</strong> {new Date(selectedTransaction.timestamp.toString() * 1000).toLocaleString()}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={() => setSelectedTransaction(null)}>Fermer</button>
        </div>
      </div>
    </div>
  </div>
)}

        </>
      )}
    </div>
  );
  
};

export default Transfer;
