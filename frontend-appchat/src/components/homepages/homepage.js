import React, { useEffect, useState } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import './homepage.css';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput
}
    from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

var stompClient = null;
export default function Homepage() {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });
    useEffect(() => {
        console.log(userData);
    }, [userData]);


    const [password, setPassword] = useState("");

    const login = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": userData.username,
            "password": password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };


        fetch("http://localhost:8081/login", requestOptions)
            .then(response => {
                if (response.status === 200) {
                    registerUser();
                    console.log("login succesful")
                }
            })
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

    }

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({ ...userData, "connected": true });
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        console.log(userData.username);
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);

        console.table(privateChats);
        userJoin();
    }

    const userJoin = () => {
        var chatMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                    console.log(privateChats);
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }

    const onPrivateMessage = (payload) => {
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);

    }

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "message": value });
    }
    const sendValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }

    const sendPrivateValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
                status: "MESSAGE"
            };

            if (userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }

    const handleUsername = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "username": value, "receivername": value });
    }

    const registerUser = () => {
        connect();
    }

    return (
        <div className="container">
            {userData.connected ?
                <div className="chat-box">
                    <div className='header'>
                        <nav class="navbar navbar-light" style={{backgroundColor: "#e3f2fd"}}>
                            <div class="container-fluid">
                                <a class="navbar-brand" href="#">
                                    <img src='https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Messenger_logo_2018.svg' alt="" width="30" height="24" class="d-inline-block align-text-top"></img>
                                        {userData.username}
                                </a>
                            </div>
                        </nav>
                    </div>

                    <div className='content'>
                        <div className="member-list">
                            <ul>
                                <li onClick={() => { setTab("CHATROOM") }} className={`member ${tab === "CHATROOM" && "active"}`}>Chatroom</li>
                                {[...privateChats.keys()].map((name, index) => (
                                    <li onClick={() => { setTab(name) }} className={`member ${tab === name && "active"}`} key={index}>{name}</li>
                                ))}
                            </ul>
                        </div>
                        {tab === "CHATROOM" && <div className="chat-content">
                            <ul className="chat-messages">
                                {publicChats.map((chat, index) => (
                                    <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                        {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                        <div className="message-data">{chat.message}</div>
                                        {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                    </li>
                                ))}
                            </ul>

                            <div className="send-message">
                                <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                                <button type="button" className="send-button" onClick={sendValue}>send</button>
                            </div>
                        </div>}
                        {tab !== "CHATROOM" && <div className="chat-content">
                            <ul className="chat-messages">
                                {[...privateChats.get(tab)].map((chat, index) => (
                                    <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                        {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                        <div className="message-data">{chat.message}</div>
                                        {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                    </li>
                                ))}
                            </ul>

                            <div className="send-message">
                                <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
                                <button type="button" className="send-button" onClick={sendPrivateValue}>send</button>
                            </div>
                        </div>}
                    </div>

                </div>
                :
                <MDBContainer fluid>
                    <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                        <MDBCol col='12'>
                            <MDBCard className='bg-dark text-white my-5 mx-auto'
                                style={{ borderRadius: '1rem', maxWidth: '400px' }}>
                                <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

                                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                    <p className="text-white-50 mb-5">Please enter your login and password!</p>

                                    <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white'
                                        label='Enter your name'
                                        id='user-name'
                                        size="lg"
                                        name="userName"
                                        value={userData.username}
                                        onChange={handleUsername}
                                        margin="normal" />
                                    <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white'
                                        label='Enter your password'
                                        name='password'
                                        onChange={(e) => setPassword(e.target.value)}
                                        id='formControlLg' type='password' size="lg" />

                                    <p className="small mb-3 pb-lg-2"><a className="text-white-50" href="#!">Forgot
                                        password?</a></p>
                                    <button className='mx-2 px-5 btn btn btn-success' onClick={login}>Login
                                    </button>
                                    <br />
                                    <div>
                                        <p className="mb-0">Don't have an account? <Link to="/register">Sign Up</Link></p>
                                    </div>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            }
        </div>
    )
}