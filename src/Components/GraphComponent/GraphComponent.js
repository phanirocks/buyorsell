import React, { useState, useEffect } from "react";
import DonutChart from 'react-donut-chart';
import { createStockDocument , firestore } from "../../FirebaseFunctions/firebase.utils";
import { useToasts } from 'react-toast-notifications';

import "./GraphComponent.css"

const GraphComponent = ({ stockName }) => {

    const [userChoiceFromStorage, setUserChoiceFromStorage] = useState({})
    const [buttonClicked, setButtonClicked] = useState(false)
    const [buyValue, setBuyValue] = useState(0)
    const [sellValue, setSellValue] = useState(0)
    const [holdValue, setHoldValue] = useState(0)
    const [userChoice, setUserChoice] = useState([])

    const { addToast } = useToasts()

    useEffect(() => {
        createStockDocument(stockName)
    },[])

    const [sessionId, setSessionId] = useState("")
    //Session ID code block
        const generateSessionId = () => {
            const now = new Date()

            setSessionId(now.getTime())
        }

        useEffect(() => {
            generateSessionId()
            console.log(19, sessionId)
        },[])

        useEffect(() => {
            const interval = setInterval(() => {
                generateSessionId()
            },[90000])

            return () => clearInterval(interval)
        },[])
    //End of sessionid block


    // useEffect(() => {
    //     let currentStock;

    //     if(localStorage.getItem(stockName)) {
    //         let data = JSON.parse(localStorage.getItem(`${stockName}`))
    //         currentStock = data.stockName
    //     }

    //     if(!localStorage.getItem(stockName) && currentStock !== stockName) {
    //         if(sessionId) {
    //             // createSessionIdDocument(sessionId, stockName)
    //             if(localStorage['sessionIdList']) {
    //                 let sessionListFromStorage = JSON.parse(localStorage['sessionIdList'])
    //                 sessionListFromStorage.push(sessionId)
    //                 localStorage.setItem("sessionIdList", JSON.stringify(sessionListFromStorage))
    //             } else {
    //                 let sessionIdList = []
    //                 sessionIdList.push(sessionId)

    //                 localStorage.setItem("sessionIdList", JSON.stringify(sessionIdList))
    //             }
    //         }
    //     }
    // },[sessionId])

    const getPercentDetailsFirestore = async () => {

        // let ar1 = ['1234567890','1611210407790']

            // let buyCount = 0
            // let sellCount = 0
            // let hodlCount = 0

            // let userChoiceList = []

            let reference = await firestore.collection('stockDetails').where('stockName','==',stockName).get()
            // reference.forEach(item => {
            //     console.log(73,item.data().choice)
            //     if(item.data().choice === "SELL") {
            //         sellCount = sellCount + 1
            //         console.log(sellCount)
            //         setSellValue(sellCount)
            //     } else if(item.data().choice === "BUY") {
            //         buyCount = buyCount + 1
            //         console.log(buyCount)
            //         setBuyValue(buyCount)
            //     } else if(item.data().choice === "HOLD") {
            //         setSellValue(sellValue + 1)
            //     }
            // })
            // console.log(reference.length, reference)
            reference.forEach(item => {
                // console.log(item.data().choice)
                // // if(item.data().choice === "BUY") {
                // //     buyCount++
                // // }
                // // setBuyValue(buyCount)
                // userChoiceList.push(item.data().choice)
                setBuyValue(item.data().buyPercent)
                setSellValue(item.data().sellPercent)
                setHoldValue(item.data().holdPercent)
            })
            // setUserChoice(userChoiceList)

            //Retrieving the chart data on every snapshot change
            firestore.collection('stockDetails').where('stockName','==', stockName).onSnapshot(querySnapshot => {
                querySnapshot.docChanges().forEach(change => {
                    setBuyValue(change.doc.data().buyPercent)
                    setSellValue(change.doc.data().sellPercent)
                    setHoldValue(change.doc.data().holdPercent)
                    // // setUserChoice(change.doc.data().choice)
                    // console.log(110,change.doc.data())
                });
            })        
    }

    //This is to update the page on the page load
    useEffect(() => {
        getPercentDetailsFirestore()
    },[])

    const notify = () => addToast("Duplicate vote!\nTry choosing other options if you change you view about this stock", { appearance : 'error', autoDismiss: true })

    const handleBuySellHoldButtonClick = async e => {
        let buttonValue = e.target.value
        console.log(47, e.target.className)
        let buttonClassName = e.target.className
        if(buttonClassName.split(" ").includes("disabled")) {
            notify()
        } else {
            if(buttonValue === "Buy") {
                setButtonClicked(true)
                setBuyValue(buyValue + 1)
                localStorage.setItem(`${stockName}`,JSON.stringify({stockName: stockName , action: 'BUY', sessionId: sessionId}))
                await firestore.doc(`/stockDetails/${stockName}`).update({
                    buyPercent : buyValue + 1
                })
                setButtonClicked(false)
            } else if(buttonValue === "Sell") {
                setButtonClicked(true)
                setSellValue(sellValue + 1)
                localStorage.setItem(`${stockName}`,JSON.stringify({stockName: stockName , action: 'SELL', sessionId: sessionId}))
                await firestore.doc(`/stockDetails/${stockName}`).update({
                    sellPercent : sellValue + 1
                })
                setButtonClicked(false)
            } else {
                setButtonClicked(true)
                setHoldValue(holdValue + 1)
                localStorage.setItem(`${stockName}`,JSON.stringify({stockName: stockName , action: 'HOLD', sessionId: sessionId}))
                await firestore.doc(`/stockDetails/${stockName}`).update({
                    holdPercent : holdValue + 1
                })
                setButtonClicked(false)
            }
        }   
    }

    //Deleting firestore document after 15 mins
    // const deleteDocumentFromFirestore = async () => {
    //     if(localStorage.getItem(`${stockName}`)) {
    //         let data = JSON.parse(localStorage.getItem(`${stockName}`))
    //         // data.sessionId
    //         await firestore.collection('stockDetails').doc(String(data.sessionId)).delete()
    //     }
    // }
    // This deletes the sessions if only a user selects a choice like "Buy/sell/hold". If the user didnt select anything, the sessions will still be present in the database
    // To tackle that, we are maintaining a sessionList in localstorage which stores every session.
    // In regular intervals, it iterates through the list and if any item in that list is not present in the localstorage(i.e sessions where user didnt select any options), 
    //      it will delete them in the firestore. (This is yet to be implemented)
    // This way we delete all the documents of session in the firestore collection 


    //Removing LocalStorage after 15 mins
    useEffect(() => {
        console.log(128, sessionId)
        if(localStorage.getItem(`${stockName}`)) {
            // setTimeout(() => {
            //     deleteDocumentFromFirestore()
            // },5000)
            setTimeout(() => {
                localStorage.removeItem(`${stockName}`)
            }, 6000)  // set for 15 minutes currently
        }
        
    },[])

    // useEffect(() => {
    //     deleteDocumentFromFirestore()
    // },[])

    //GETTING USER CHOICE FROM LOCAL STORAGE
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

    let displayBuyButton = 
        (userChoiceFromStorage.stockName !== stockName 
            || 
        ((userChoiceFromStorage.action !== "BUY" ) && (userChoiceFromStorage.stockName === stockName || !userChoiceFromStorage.stockName )))
        ? true : false
    
    let displaySellButton = 
        (userChoiceFromStorage.stockName !== stockName 
            || 
        ((userChoiceFromStorage.action !== "SELL") && (userChoiceFromStorage.stockName === stockName || !userChoiceFromStorage.stockName )))
        ? true : false

    let displayHoldButton = 
        (userChoiceFromStorage.stockName !== stockName 
            || 
        ((userChoiceFromStorage.action !== "HOLD") && (userChoiceFromStorage.stockName === stockName || !userChoiceFromStorage.stockName )))
        ? true : false

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
                        <button onClick={handleBuySellHoldButtonClick} value="Buy" className={displayBuyButton ? "buyButton" : "buyButton disabled"}>Buy</button>

                        <button onClick={handleBuySellHoldButtonClick} value="Sell" className={displaySellButton ? "sellButton" : "sellButton disabled"}>Sell</button>

                        <button onClick={handleBuySellHoldButtonClick} value="Hold" className={displayHoldButton ? "holdButton" : "holdButton disabled"}>Hold</button>

                    </div>
                </div>
    )
}

export default GraphComponent;