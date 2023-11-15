'use client'
import Image from 'next/image'
import { db } from '../firebaseConfig'
import { collection , addDoc , getDocs, query, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import React, {useEffect,useState} from 'react'
import Link from 'next/link'

async function addDataToFirestore(name,email,detail) {
  try {
    const docRef = await addDoc(collection(db,"messages"), {
      name:name,
      email : email,
      detail : detail,
    });
    console.log("documant wrriten with id:", docRef.id);
    return true;
  } catch (error) {
    console.error("Error",error);
    return false;
  }
}
// fetch data
async function fetchDataFromFirestore() {
  const messageCollection = collection(db,"messages");
  const querySnapshot = await getDocs(query(messageCollection));

  const messages =[];
  querySnapshot.forEach((doc) => {
     const messageData = doc.data();
     messages.push({id :doc.id , ...messageData});
  });
  return messages;
}
// deleting
  async function deleteMessageFromFirestore(messageid) {
    try {
      console.log("Deleting Message with Id:" , messageid);
      await deleteDoc(doc(db,"messages", messageid));
      return messageid;
    } catch (error) {
      console.error("Error",error);
      return null;
    }
  }


export default function Home() {
  const [name , setName] = useState("");
  const [email , setEmail] = useState("");
  const [detail , setDetail] = useState("");

 
const [messages , setMessages] = useState([]);

const [selectedMessage, setSelectedMessage] = useState(null);

const [isUpdateMode , setIsUpdateMode] = useState(false);

 const handleSubmit = async (e)=>{
  e.preventDefault();
  if (isUpdateMode) {
    if (selectedMessage) {
      try {
        const UpdatedMessage = {
          name,
          email,
          detail,
        };
        
        const messageRef =doc(db,"messages",selectedMessage.id);
        await updateDoc(messageRef,UpdatedMessage);
        //reset
        setName("");
        setEmail("");
        setDetail("");
        setSelectedMessage(null);
        setIsUpdateMode(false);

        alert("data updated successfully");
      } catch (error) {
        console.error("error ocured".error);
      }
    }
  }else{
    const added = await addDataToFirestore(name,email,detail);
      if (added) {
        setName("");
        setEmail("");
        setDetail("");
  
        alert("data added");
      }
  }
 };

 useEffect(() => {
  async function fetchData(){
      const messages = await fetchDataFromFirestore();
      setMessages(messages);
  }
  fetchData();
} , []);


const handleUpdateClick = (message) => {
  setName(message.name || "");
  setEmail(message.email || "");
  setDetail(message.detail || "");

  selectedMessage(message);
  
  setIsUpdateMode(true);
}

useEffect(() => {
  async function fetchData(){
      const messages = await fetchDataFromFirestore();
      setDetail(messages);
  }
  fetchData();
} , []);
 
//
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <h1
      className='text-5xl font-bold m-10'>
      Add Data to Firestore Database
     </h1>
     <h2
     className='text-3xl m-5'
     >
      {isUpdateMode ? "Update Data" : "Create Data "}
     </h2>
     <form onSubmit={handleSubmit} className='max-w-md w-full bg-dark mx-auto p-4'>
        <div className='mb-4'>
          <label htmlFor='name' className='block text-gray-700 font-bold'>
            Name:
          </label>
          <input
          type='text'
          name='name'
          id='name'
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
          value={name}
          onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='email' className='block text-gray-700 font-bold'>
           Email:
          </label>
          <input
          type='text'
          name='email'
          id='email'
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='detail' className='block text-gray-700 font-bold'>
            Message:
          </label>
          <textarea
          name='detail'
          id='detail'
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          ></textarea>
        </div>
        <div className='flex justify-between'>
          <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg'
          >
            {isUpdateMode? "Update" : "Submit"}
          </button>
          <Link href="./data"
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-2 rounded-lg'
          >Show Data</Link>
        </div>
     </form>
     <div className='py-10'>
      <h2 className='text-5xl font-bold m-10'>Data Lists</h2>
      {messages.map((message) => (
        <div key={message.id} className='border p-4 rounded-md'>
          <h3 className='text-lg font-semibold text-gray-900 break-words'>{message.name}</h3>
          <p className='text-sm text-gray-500'>{message.email}</p>
          <p className='text-sm text-gray-500'>{message.detail}</p>
          <div>
          <button
          type='button'
          onClick={()=> handleUpdateClick(message)}
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 my-3 rounded-lg'
          >
            Update
          </button>
          <button
          type='button'
          onClick={async ()=>{
            const deleteMessageid = await deleteMessageFromFirestore(message.id);
            if (deleteMessageid) {
              const updateMessage = messages.filter((t)=> t.id !== deleteMessageid);
              setMessages(updateMessage);
            }
          }}
          className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 my-3 rounded-lg'
          >
            Delete
          </button>
          </div>
        </div>
      ))}
     </div>
    </main>
  )
}
