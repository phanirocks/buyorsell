import React,{ useState, useEffect } from "react"
import firebase from "firebase/app";
import { firestore } from "../../FirebaseFunctions/firebase.utils"

import "./ChatComponent.css"

const ChatComponent = ({ stockName }) => {
    
    const [currentMessage, setCurrentMessage] = useState("")
    const [allMessages, setAllMessages] = useState([])
    
    const handleMessageChange = e => {
        let message = e.target.value
        setCurrentMessage(message)
    }

    const handleSendMessage = async () => {
        setAllMessages([...allMessages, currentMessage])
        setCurrentMessage("")

        await firestore.doc(`/stockDetails/${stockName}`).update({
            chatMessages : firebase.firestore.FieldValue.arrayUnion(currentMessage)
        })
    }

    const getMessagesFromFirestore = async () => {
        
        //Retrieving the messages on page load
        let reference = await firestore.collection('stockDetails').where('stockName','==',stockName).get()
        reference.forEach(item => {
            setAllMessages(item.data().chatMessages)
        })

        //Retrieving the messages on every snapshot change
        firestore.collection('stockDetails').where('stockName','==', stockName).onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                setAllMessages(change.doc.data().chatMessages)
              });
        })
    }

    useEffect(() => {
        getMessagesFromFirestore()
    },[])

    return (
        <div>
            <h3>Discuss about {stockName}</h3>
            <div className="ChatBlock">
                <div className="chatMessages">
                    {allMessages && allMessages.slice(Math.max(allMessages.length -8,0)).map((message, index) => {
                        return (
                            <div key={index} className="singleMessage">
                                <p>{message}</p>
                            </div>
                        )
                    })}
                </div>
                <div className="chatInputButtons">
                    <input type="text" placeholder="enter your message here" onChange={handleMessageChange} value={currentMessage}/>
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default ChatComponent;