import React, { useState, useEffect } from "react";
import ChatComponent from "../ChatComponent/ChatComponent"
import GraphComponent from "../GraphComponent/GraphComponent";
import { stocksData } from "../../stocksData"
import publicIp from "public-ip";

import "./StockDetailPage.css"

const StockDetailPage = (props) => {

    const data = stocksData

    const allStocks = []

    const [userIp, setUserIp] = useState("")

    const getClientIp = async () => setUserIp(await publicIp.v4());
    useState(() => getClientIp(),[])

    //Saving userIp to the session storage
    const saveUserIPToStorage = (ip) => {
        localStorage.setItem("userIP", ip)
    }

    useEffect(() => {
        saveUserIPToStorage(userIp)
    },[userIp])

    data.forEach(item => {
        allStocks.push(item.SYMBOL)
    })

    useEffect(() => {
        const abortController = new AbortController()
        let stockNameInUrl = props.match.params.stockName
        if(!(allStocks.includes(stockNameInUrl))) {
            props.history.push("/error")
        }

        return function cleanup() {
            abortController.abort()
        } 
    },[])

    return (
        <>
            <h1>{props.match.params.stockName}</h1>
            <div className="stockDetailPage-Content">
                <GraphComponent stockName={props.match.params.stockName}/>
                <ChatComponent stockName={props.match.params.stockName} userIp={userIp}/>
            </div>
        </>
    )
}


export default StockDetailPage;