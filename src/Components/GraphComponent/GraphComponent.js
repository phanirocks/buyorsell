import React, { useState, useEffect } from "react";
import DonutChart from 'react-donut-chart';
import { createStockDocument , firestore } from "../../FirebaseFunctions/firebase.utils";

import "./GraphComponent.css"

const GraphComponent = ({ stockName }) => {

    const [userChoiceFromStorage, setUserChoiceFromStorage] = useState({})
    const [buttonClicked, setButtonClicked] = useState(false)
    const [buyValue, setBuyValue] = useState(0)
    const [sellValue, setSellValue] = useState(0)
    const [holdValue, setHoldValue] = useState(0)

    useEffect(() => {
        createStockDocument(stockName)
    },[])

    const getPercentDetailsFirestore = async () => {
        let reference = await firestore.collection('stockDetails').where('stockName','==',stockName).get()
        reference.forEach(item => {
            setBuyValue(item.data().buyPercent)
            setSellValue(item.data().sellPercent)
            setHoldValue(item.data().holdPercent)
        })

        //Retrieving the chart data on every snapshot change
        firestore.collection('stockDetails').where('stockName','==', stockName).onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                setBuyValue(change.doc.data().buyPercent)
                setSellValue(change.doc.data().sellPercent)
                setHoldValue(change.doc.data().holdPercent)
              });
        })
        
    }

    //This is to update the page on the page load
    useEffect(() => {
        getPercentDetailsFirestore()
    },[])


    const handleBuySellHoldPercent = async e => {
        let buttonValue = e.target.value
        
        if(buttonValue === "Buy") {
            setButtonClicked(true)
            setBuyValue(buyValue + 1)
            localStorage.setItem(`${stockName}`,JSON.stringify({stockName: stockName , action: 'BUY'}))
            await firestore.doc(`/stockDetails/${stockName}`).update({
                buyPercent : buyValue + 1
            })
            setButtonClicked(false)
        } else if(buttonValue === "Sell") {
            setButtonClicked(true)
            setSellValue(sellValue + 1)
            localStorage.setItem(`${stockName}`,JSON.stringify({stockName: stockName , action: 'SELL'}))
            await firestore.doc(`/stockDetails/${stockName}`).update({
                sellPercent : sellValue + 1
            })
            setButtonClicked(false)
        } else {
            setButtonClicked(true)
            setHoldValue(holdValue + 1)
            localStorage.setItem(`${stockName}`,JSON.stringify({stockName: stockName , action: 'HOLD'}))
            await firestore.doc(`/stockDetails/${stockName}`).update({
                holdPercent : holdValue + 1
            })
            setButtonClicked(false)
        }
    }

    //Removing LocalStorage after 15 mins
    useEffect(() => {
        if(localStorage.getItem(`${stockName}`)) {
            setTimeout(() => {
                localStorage.removeItem(`${stockName}`)
            }, 900000)  // set for 15 minutes currently
        }
        
    },[buttonClicked])

    //GETTING USER CHOICE FROM STORAGE
    const getUserChoiceFromStorage = () => {
        let storageData = JSON.parse(localStorage.getItem(`${stockName}`))
        setUserChoiceFromStorage(storageData)  // SETUSERCHOICE IS A STATE CONTAINER; GETUSERCHOICE IS A FUNCTION
    }

    useEffect(() => {
        let storageData = localStorage.getItem(`${stockName}`)
        if(!storageData) {
            setUserChoiceFromStorage({})
        } else {
            setUserChoiceFromStorage(JSON.parse(storageData))
        }
    },[])

    useEffect(() => {
        if(buttonClicked) {
            getUserChoiceFromStorage()
        }
    },[buttonClicked])
 
    const totalValue = buyValue + sellValue + holdValue

    const buyPercent = buyValue > 0 ? parseFloat(((buyValue/totalValue)* 100).toFixed(2)) :  0
    const sellPercent = sellValue > 0 ? parseFloat(((sellValue/totalValue)* 100).toFixed(2)) : 0
    const holdPercent = holdValue > 0 ? parseFloat(((holdValue/totalValue)* 100).toFixed(2)) : 0


    return (
        <div>
                    {/* Donut chart */}
                    <DonutChart 
                        data = {[
                            {
                                label: 'Buy',
                                value: buyPercent
                            },
                            {
                                label: 'Sell',
                                value: sellPercent
                            },
                            {
                                label: 'Hold',
                                value: holdPercent
                            }
                        ]}
                        colors = {['#2a9d8f' , '#e76f51', '#e9c46a']}
                        onMouseEnter = {() => false}
                    />
                    <div className="buttonBlock"> 
                        {/* Condition for buy button to display */}
                        { (userChoiceFromStorage.stockName !== stockName 
                            || 
                        ((userChoiceFromStorage.action !== "BUY" ) && (userChoiceFromStorage.stockName === stockName || !userChoiceFromStorage.stockName ))) 
                        && 
                        <button onClick={handleBuySellHoldPercent} value="Buy" className="buyButton">Buy</button>} 

                        {/* Condition for sell button to display */}
                        { (userChoiceFromStorage.stockName !== stockName 
                            || 
                        ((userChoiceFromStorage.action !== "SELL") && (userChoiceFromStorage.stockName === stockName || !userChoiceFromStorage.stockName ))) 
                        && 
                        <button onClick={handleBuySellHoldPercent} value="Sell" className="sellButton">Sell</button>}

                        {/* Condition for hold button to display */}
                        { (userChoiceFromStorage.stockName !== stockName 
                            || 
                        ((userChoiceFromStorage.action !== "HOLD") && (userChoiceFromStorage.stockName === stockName || !userChoiceFromStorage.stockName ))) 
                        && 
                        <button onClick={handleBuySellHoldPercent} value="Hold" className="holdButton">Hold</button>}                    
                    </div>
                </div>
    )
}

export default GraphComponent;