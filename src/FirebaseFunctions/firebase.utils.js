import firebase from "firebase/app"

import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyD2HvwoEqtqIRFTmhfIE-1AXUNH3_o2a9E",
    authDomain: "debate-cf196.firebaseapp.com",
    databaseURL: "https://debate-cf196.firebaseio.com",
    projectId: "debate-cf196",
    storageBucket: "debate-cf196.appspot.com",
    messagingSenderId: "180921421324",
    appId: "1:180921421324:web:8076694811703d4d4de829",
    measurementId: "G-S13X46HEDH"
};

firebase.initializeApp(firebaseConfig);



export const firestore = firebase.firestore()

//Creating stock document
export const createStockDocument = async (stock) => {
    if(stock){
        let reference = firestore.doc(`stockDetails/${stock}`)
        let snapshot = await reference.get()
        if(!snapshot.exists){
            let createdAt = new Date()
            let stockName = stock;
            let chatMessages = []
            let buyPercent = 0
            let sellPercent = 0
            let holdPercent = 0
            try {
                reference.set({
                    stockName,
                    chatMessages,
                    buyPercent,
                    sellPercent,
                    holdPercent,
                    createdAt
                })
            } catch (e) {
                console.log(`${e.message} is the error`)
            }
        } else {
            return stock;
        }
    }
  }