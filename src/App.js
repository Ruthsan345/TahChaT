import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDrfbr6yNHtxO2K1Edws2eOChdHZDtpkLw",
  authDomain: "tahchat-1cdb7.firebaseapp.com",
  projectId: "tahchat-1cdb7",
  storageBucket: "tahchat-1cdb7.appspot.com",
  messagingSenderId: "29752742120",
  appId: "1:29752742120:web:01b43bdcd530db1b22b95d"
})

const auth=firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user]= useAuthState(auth);

  return (
    <div className="App">
      <header >
      <h1>💬 TahChaT</h1>
      <SignOut/>
      </header>
      <section>
        {user? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn(){


  const signInWithGoogle=() => {
    const provider=new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);

  }
  return(<>
   <div class="welcome">Welcome to TahChaT!!</div> 
   <br></br>
    <button className="sign-in" onClick={signInWithGoogle}>👾 Sign in with Google</button>
    </>
  )
}


function SignOut(){
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out </button>
  )
}

function ChatRoom(){

  const dummy =useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query,{idField:'id'});

  const[formValue, setFormValue] = useState('');

  const sendMessage =async(e)=>{
    e.preventDefault();
    const { uid , photoURL }=auth.currentUser;

    await messagesRef.add({
      text:formValue,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({behavior :"smooth"});

  }

  
  return(<>
    <main>
          {messages && messages.map(msg => <ChatMessage Key={msg.id} message={msg}/>)}
  <span ref={dummy}></span>
    </main>
    <form onSubmit={sendMessage}>
    <input value={formValue} onChange={(e) =>setFormValue(e.target.value)} placeholder="Type Something"/>
    <button type="submit" disabled={!formValue}>Hit 🚀</button>


    </form>
    </>
  )

}

function ChatMessage(props){
  const {text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={'message ${messageClass}'}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
