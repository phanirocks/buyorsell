import React, { useState, useEffect } from "react";
import { createStockDocument , firestore } from "../../FirebaseFunctions/firebase.utils";
import { useToasts } from 'react-toast-notifications';
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { MdSentimentNeutral } from "react-icons/md";
import bullish from '../../Images/bull.gif'
import bearish from '../../Images/bear.gif'
import holdish from '../../Images/hold.gif'


import "./GraphComponent.css"

const GraphComponent = ({ stockName }) => {

    const [userChoiceFromStorage, setUserChoiceFromStorage] = useState({})
    const [buttonClicked, setButtonClicked] = useState(false)
    const [buyValue, setBuyValue] = useState(0)
    const [sellValue, setSellValue] = useState(0)
    const [holdValue, setHoldValue] = useState(0)
    const [userChoice, setUserChoice] = useState([])
    const [bullAnimValue, setBullAnimValue] = useState(false)
    const [sellAnimValue, setSellAnimValue] = useState(false)
    const [holdAnimValue, setHoldAnimValue] = useState(true)

    const { addToast } = useToasts()

    useEffect(() => {
        createStockDocument(stockName)
    },[])

    const [sessionId, setSessionId] = useState("")
    //Session ID code block ----- CAN BE REMOVED
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

    const getPercentDetailsFirestore = async () => {

            let reference = await firestore.collection('stockDetails').where('stockName','==',stockName).get()
            reference.forEach(item => {
                setBuyValue(parseFloat(item.data().buyPercent))
                setSellValue(parseFloat(item.data().sellPercent))
                setHoldValue(parseFloat(item.data().holdPercent))
                // console.log("item.data.hodlPercent", item.data().holdPercent)
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

    const notify = () => addToast("Duplicate vote!\nTry choosing other options if you change you view about this stock", { appearance : 'error', autoDismiss: true })

    const triggerBuyAnim = () => {
        setHoldAnimValue(false)
        setSellAnimValue(false)
        setBullAnimValue(true)
    }

    const triggerSellAnim = () => {
        setHoldAnimValue(false)
        setBullAnimValue(false)
        setSellAnimValue(true)
    }

    const triggerHoldAnim = () => {
        setBullAnimValue(false)
        setSellAnimValue(false)
        setHoldAnimValue(true)
    }

    const handleBuySellHoldButtonClick = async e => {
        
        let buttonValue = e.target.value
        console.log(47, e.target.className)
        let buttonClassName = e.target.className
        if(buttonClassName.split(" ").includes("disabled")) {
            notify()
        } else {
            if(buttonValue === "Buy") {
                if(localStorage.getItem(`STOCK-${stockName}`)) {
                    let oldValueInLocalStorage = JSON.parse(localStorage.getItem(`STOCK-${stockName}`))
                    console.log(140, oldValueInLocalStorage)

                    //Checking for the old choice
                    oldValueInLocalStorage.action === "SELL"
                        ?
                    (await firestore.doc(`/stockDetails/${stockName}`).update({
                        sellPercent : sellValue - 1
                    }))
                        :
                    await firestore.doc(`/stockDetails/${stockName}`).update({
                        holdPercent : holdValue - 1
                    })
                    //End of check

                    setBuyValue(buyValue + 1)
                    localStorage.setItem(`STOCK-${stockName}`,JSON.stringify({stockName: stockName , action: 'BUY', sessionId: sessionId , expiry: new Date().getTime() + 90000}))
                    await firestore.doc(`/stockDetails/${stockName}`).update({
                        buyPercent : buyValue + 1
                    })
                    setButtonClicked(true)
                    setButtonClicked(false)
                } else {
                    setBuyValue(buyValue + 1)
                    localStorage.setItem(`STOCK-${stockName}`,JSON.stringify({stockName: stockName , action: 'BUY', sessionId: sessionId , expiry: new Date().getTime() + 90000}))
                    await firestore.doc(`/stockDetails/${stockName}`).update({
                        buyPercent : buyValue + 1
                    })
                    setButtonClicked(true)
                    setButtonClicked(false)                    
                }
                triggerBuyAnim()
            } else if(buttonValue === "Sell") {
                if(localStorage.getItem(`STOCK-${stockName}`)) {
                    let oldValueInLocalStorage = JSON.parse(localStorage.getItem(`STOCK-${stockName}`))
                    console.log(140, oldValueInLocalStorage)


                    //Checking for the old choice
                    oldValueInLocalStorage.action === "BUY"
                        ?
                    await firestore.doc(`/stockDetails/${stockName}`).update({
                        buyPercent : buyValue - 1
                    })
                        :
                    await firestore.doc(`/stockDetails/${stockName}`).update({
                        holdPercent : holdValue - 1
                    })
                    //End of check

                    localStorage.setItem(`STOCK-${stockName}`,JSON.stringify({stockName: stockName , action: 'SELL', sessionId: sessionId , expiry: new Date().getTime() + 90000}))
                    await firestore.doc(`/stockDetails/${stockName}`).update({
                        sellPercent : sellValue + 1
                    })
                    setButtonClicked(true)
                    setButtonClicked(false)
                } else {
                    setSellValue(sellValue + 1)
                    localStorage.setItem(`STOCK-${stockName}`,JSON.stringify({stockName: stockName , action: 'SELL', sessionId: sessionId , expiry: new Date().getTime() + 90000}))
                    await firestore.doc(`/stockDetails/${stockName}`).update({
                        sellPercent : sellValue + 1
                    })
                    setButtonClicked(true)
                    setButtonClicked(false)
                }
                triggerSellAnim()
            } else {                
                if(localStorage.getItem(`STOCK-${stockName}`)) {
                    let oldValueInLocalStorage = JSON.parse(localStorage.getItem(`STOCK-${stockName}`))
                    console.log(140, oldValueInLocalStorage)

                    //Checking for the old choice
                    oldValueInLocalStorage.action === "BUY" 
                        ? 
                    await firestore.doc(`/stockDetails/${stockName}`).update({
                        buyPercent : buyValue - 1
                    })
                        :
                    await firestore.doc(`/stockDetails/${stockName}`).update({
                        sellPercent : sellValue - 1
                    })
                    //End of check

                    localStorage.setItem(`STOCK-${stockName}`,JSON.stringify({stockName: stockName , action: 'HOLD', sessionId: sessionId , expiry: new Date().getTime() + 90000}))
                    await firestore.doc(`/stockDetails/${stockName}`).update({
                        holdPercent : holdValue + 1
                    })
                    setButtonClicked(true)
                    setButtonClicked(false)
                } else {
                    // setHoldValue(holdValue + 1)
                    localStorage.setItem(`STOCK-${stockName}`,JSON.stringify({stockName: stockName , action: 'HOLD', sessionId: sessionId , expiry: new Date().getTime() + 90000}))

                    await firestore.doc(`/stockDetails/${stockName}`).update({
                        holdPercent : holdValue + 1
                    })
                    setButtonClicked(true)
                    setButtonClicked(false)
                }
                triggerHoldAnim()
            }
        }
        setButtonClicked(false)   
    }

    //Deleting elements from localstorage based on the expiry key
    const deleteFromLocalStorage = () => {
        
        console.log("Starting", 205)
        let stockListFromLocalStorage = []

        for(let i in localStorage){
            if(i.startsWith("STOCK")) {
                stockListFromLocalStorage.push(i)
            }
        }
        if(stockListFromLocalStorage.length > 0) {
            stockListFromLocalStorage.forEach(item => {
                if(JSON.parse(localStorage[item]).expiry < new Date().getTime() ) {
                    localStorage.removeItem(item)
                }
            })
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            deleteFromLocalStorage()
        },60000)

        return () => clearInterval(interval)
    },[])


    //GETTING USER CHOICE FROM LOCAL STORAGE
    const getUserChoiceFromStorage = () => {
        let storageData = JSON.parse(localStorage.getItem(`STOCK-${stockName}`))
        setUserChoiceFromStorage(storageData)  // SETUSERCHOICE IS A STATE CONTAINER; GETUSERCHOICE IS A FUNCTION
    }

    useEffect(() => {
        let storageData = localStorage.getItem(`STOCK-${stockName}`)
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
            <div className="minColorBlock">
                <div className="minBlockBuy">
                    <div className="buyColorMin"></div>
                    <p>BUY: {buyPercent}%</p>
                </div>
                <div className="minBlockHold">
                    <div className="holdColorMin"></div>
                    <p>HOLD: { holdPercent }%</p>
                </div>
                <div className="minBlockSell">
                    <div className="selLColorMin"></div>
                    <p>SELL: { sellPercent }%</p>
                </div>
            </div>
            { (buyPercent > 0 || sellPercent > 0 || holdPercent > 0) ?
                <div className="barGraph">
                    <div className="buyBlock" style={{ width: buyPercent+"%" }}>
                        {/* {buyPercent > 0 && <p className="barText">BUY</p> } */}
                        {/* {buyPercent > 0 && <p className="barText">{ buyPercent }%</p> } */}
                    </div>
                    <div className="holdBlock" style={{ width: holdPercent+"%" }}>
                        {/* { holdPercent > 0 && <p className="barText">HOLD</p>} */}
                        {/* { holdPercent > 0 && <p className="barText">{ holdPercent }%</p>} */}
                    </div>
                    <div className="sellBlock" style={{ width: sellPercent+"%" }}>
                        {/* {sellPercent >0 && <p className="barText">SELL</p>} */}
                        {/* {sellPercent >0 && <p className="barText">{ sellPercent }%</p>} */}
                    </div>
                </div> :
                <div>
                    <p className="noVotes-text">No votes yet! Choose one below</p>
                </div>
                }
            
            <div className="buttonBlock"> 
                <button onClick={handleBuySellHoldButtonClick} value="Buy" className={displayBuyButton ? "buyButton" : "buyButton disabled"}>Buy</button>
                <button onClick={handleBuySellHoldButtonClick} value="Hold" className={displayHoldButton ? "holdButton" : "holdButton disabled"}>Hold</button>
                <button onClick={handleBuySellHoldButtonClick} value="Sell" className={displaySellButton ? "sellButton" : "sellButton disabled"}>Sell</button>
            </div>
            <div className='animation'>
               {bullAnimValue ? (<div className='buyAnim'>
                    <img src={bullish} />
                </div>) : ''} 
                {sellAnimValue ? (<div className='sellAnim'>
                    <img src={bearish} />
                </div>) : ''}
                {holdAnimValue ? (<div className='holdAnim'>
                    <img src={holdish} />
                </div>) : ''}
            </div>
        </div>
    )
}

export default GraphComponent;