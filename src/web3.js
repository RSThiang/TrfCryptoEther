// src/web3.js
import Web3 from "web3";
import SimpleTransfer from "./contracts/EtherTransfer.json"; // Assurez-vous que le chemin est correct

const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Ganache");
        resolve(web3);
      }
    });
  });
};

const getContract = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = SimpleTransfer.networks[networkId];
  const instance = new web3.eth.Contract(
    SimpleTransfer.abi,
    deployedNetwork && deployedNetwork.address
  );
  return instance;
};

export { getWeb3, getContract };
