import React from "react";
import ChatComponent from "../ChatComponent/ChatComponent"
import GraphComponent from "../GraphComponent/GraphComponent";

import "./StockDetailPage.css"

const StockDetailPage = (props) => {

    return (
        <>
            <h1>{props.match.params.stockName}</h1>
            <div className="stockDetailPage-Content">
                <GraphComponent stockName={props.match.params.stockName}/>
                <ChatComponent stockName={props.match.params.stockName}/>
            </div>
        </>
    )
}


export default StockDetailPage;