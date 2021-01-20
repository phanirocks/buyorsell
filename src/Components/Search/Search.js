import React, { useState, useEffect } from "react"
import { firestore } from "../../FirebaseFunctions/firebase.utils"
import { stocksData } from "../../stocksData"
import { Link } from "react-router-dom"

import "./Search.css";

const Search = () => {


    const allStocksData = stocksData
    const [searchQuery, setSearchQuery] = useState("")
    const [searchedData, setSearchedData] = useState([])

    // const fetchStocksData = async () => {
    //     let localStocksData = []
    //     let reference = await firestore.collection('StocksData').get()
    //     reference.forEach(item => {
    //         localStocksData.push(item.data())
    //     })
    //     setStocksData(localStocksData)
    // }

    useEffect(() => {
        console.log(22, allStocksData.length)
    },[])

    const handleSearchQueryChange = e => {
        let query = e.target.value
        setSearchQuery(query)

        if(query.length > 0) {
            const filteredItems = allStocksData.filter(item => (item.SYMBOL.toLowerCase().startsWith(query.toLowerCase()) || item['NAME OF COMPANY'].toLowerCase().startsWith(query.toLowerCase())))
            setSearchedData(filteredItems)
            // console.log(32, filteredItems)
        } else {
            setSearchedData([])
        }
    }


    return (
        <div>
            <div className="searchBlock">
                <input type="text" placeholder="Search for a stock..." className="searchBox" onChange={handleSearchQueryChange} value={searchQuery}/>
            </div>
            <div>
                { searchedData.length>0 && 
                    searchedData.map((item, index) => {
                        return (
                            <div key={index}>
                                <Link to={"/stocks/"+item.SYMBOL} target="_blank" className="stockRedirectLink">{ item.SYMBOL }- { item['NAME OF COMPANY'] }</Link>
                            </div>
                        )
                    })    
                }
            </div>
        </div>
    )
}

export default Search;