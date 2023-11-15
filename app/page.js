'use client';
import Image from 'next/image'
import { db } from './firebaseConfig';
import React, { useEffect, useState } from 'react';
import { collection, addDoc ,getDoc, query , querySnapshot, onSnapshot, doc, deleteDoc } from 'firebase/firestore';


export default function Home() { 
    const [items , setItems] =useState([
        // {name:'car' , price:'400$'},
        // {name:'Home' , price:'40$'},
        // {name:'jar' , price:'10$'},
    ]);
    const [newItem,setNewItem] = useState({name:'' , price:''});
    const [total , setTotal]=useState(0);

    // Add data to database
    const addItem = async (e) =>{
        e.preventDefault();
        if (newItem.name !=='' && newItem.price !== '') {
            // setItems([...items,newItem]);
            await addDoc(collection(db,"items"),{
                name: newItem.name.trim(),
                price : newItem.price,
            });
            setNewItem ({name:'' , price:''});
        }
    };

    // fetch data from database
    useEffect (() =>{
        const q = query(collection(db,"items"));
        const unsubscribe = onSnapshot(q , (querySnapshot) => {
            let itemsArr =[];

            querySnapshot.forEach((doc) => {
                itemsArr.push({...doc.data() , id:doc.id});
            });
            setItems(itemsArr); 
            // Read total from itemsArr
            const sumOfTotal = () =>{
                const totalPrice = itemsArr.reduce((sum,item) => sum + parseFloat(item.price),0);
                setTotal(totalPrice);
            };
                sumOfTotal();
                return () => unsubscribe();  
        });
    }, []);

    // Delete items from databse
    const deleteItem = async (id) => {
        await deleteDoc(doc(db,"items",id));
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
            <div className='z-10 w-full max-w-5xl items-center justify-between font-mono tesxt-sm lg:flex'>
                <h1
                    className='text-4xl font-bold p-4'>
                    Todo
                </h1>
                <div className='bg-slate-800 p-4 rounded-lg'>
                    <form className='grid grid-cols-6 items-center text-black'>
                        <input
                         value={newItem.name} 
                         onChange={(e) => setNewItem({...newItem , name: e.target.value})}
                         className='col-span-3 p-3 border ' type='text' placeholder='Title'/>
                        <input
                         value={newItem.price}
                          onChange={(e) => setNewItem({...newItem , price: e.target.value})}
                         className='col-span-2 p-3 border mx-3' type='number' placeholder='$'/>
                        <button
                        onClick={addItem}
                        className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl' type='submit'>save</button>
                    </form>
                    <ul>
                        {items.map((item,id)=>
                        (
                            <li key={id} className='my-4 w-full flex justify-between bg-slate-950'>
                                <div className='p-4 w-full flex justify-between text-white'>
                                    <span className='capitalize'>{item.name}</span>
                                    <span>${item.price}</span>
                                </div>
                                <button 
                                onClick={() => deleteItem(item.id)}
                                className='ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-20 rounded text-white'>remove</button>
                            </li>
                        )
                        )}
                    </ul>
                    {items.length < 1 ? ('') : (
                        <div className='flex justify-between p-3 text-white'>
                            <span>Total</span>
                            <span>${total}</span>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
