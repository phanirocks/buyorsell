import React,{ useState, useEffect, createRef } from "react"
import firebase from "firebase/app";
import { firestore } from "../../FirebaseFunctions/firebase.utils"
import publicIp from "public-ip";
// import { IoIosArrowDropup } from "react-icons/io"

import "./ChatComponent.css"

const ChatComponent = ({ stockName }) => {
    
    const [currentMessage, setCurrentMessage] = useState("")
    const [allMessages, setAllMessages] = useState([])
    const [userIp, setUserIp] = useState("")

    const getClientIp = async () => setUserIp(await publicIp.v4());
    useState(() => getClientIp(),[])

    //Saving userIp to the session storage
    const saveUserIPToStorage = (ip) => {
        sessionStorage.setItem("userIP", ip)
    }

    useEffect(() => {
        saveUserIPToStorage(userIp)
    },[userIp])

    //This ref is attached to the div in chatMessage block below
    const messagesEndRef = createRef()

    useEffect(() => {
        scrollToBottom()
    },[allMessages])

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    //End of ref

    // //Start ref
    // const messageStartRef = createRef()

    // const scrollTop = () => {
    //     messageStartRef.current.scrollIntoView({ behavior: 'smooth' })
    // }
    // //End of the start ref
    
    const handleMessageChange = e => {
        let message = e.target.value
        setCurrentMessage(message)
    }

    const handleSendMessage = async () => {
        if(currentMessage.length>0) {
            setAllMessages([...allMessages, currentMessage])
        }
        setCurrentMessage("")

        await firestore.doc(`/stockDetails/${stockName}`).update({
            chatMessages : firebase.firestore.FieldValue.arrayUnion({
                message: currentMessage,
                userIp
            })
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
            <div className="chatBlock">
                {/* <p className="chatTitle">{stockName} discussion</p> */}
                <div className="chatMessages">
                    {/* <div ref={messageStartRef} /> */}
                    {allMessages && allMessages.map((singleMessage, index) => {
                        return (
                            <div key={index} className={`singleMessage ${(sessionStorage['userIP'] === singleMessage.userIp) ? 'yourMessage' : ''}`}>
                                <p>{singleMessage.message}</p>
                                {/* { (sessionStorage['userIP'] === singleMessage.userIp) ? 
                                        <p>Your Ip</p>
                                        :
                                        <p>Not your Ip</p>
                                } */}
                            </div>
                        )
                    })}
                    {/* <button onClick={scrollTop} className="goTopButton"><IoIosArrowDropup /></button> */}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chatSendBlock">
                    <input type="text" placeholder="enter your message here" onChange={handleMessageChange} value={currentMessage} className="chatSendBlock-input"/>
                    <button onClick={handleSendMessage} className="chatSendBlock-send">Send</button>
                </div>
            </div>
        </div>
    )
}

export default ChatComponent;