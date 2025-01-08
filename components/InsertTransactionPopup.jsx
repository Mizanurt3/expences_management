"use client";
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import styles from '@/styles/Home.module.css'
export default function InsertTransactionPopup({onClose}) {
  const [formData, setFormData] = useState({ 
    
    transaction_type: '', 
    description: '', 
    deposit_amount: 0, 
    withdraw_amount: 0, 
    transaction_date: new Date().toISOString().slice(0, 10) 
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newTransaction) => {
      return axios.post("http://localhost:3000/api/transactions", newTransaction);
    },
    onMutate: (data) => {
      console.log("onMutate", data);
    },
    onError: (error, variables, context) => {
      console.error("There was an error", error.message);
    },
    onSuccess: (data, variables, context) => {
      console.log("Transaction added successfully", data);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    }
  });

  const handleSubmit = () => {
    const currentDateTime = new Date(); // বর্তমান তারিখ ও সময়
    const formattedDateTime = `${currentDateTime.getFullYear()}-${String(currentDateTime.getMonth() + 1).padStart(2, '0')}-${String(currentDateTime.getDate()).padStart(2, '0')} ` +
                              `${String(currentDateTime.getHours()).padStart(2, '0')}:${String(currentDateTime.getMinutes()).padStart(2, '0')}:${String(currentDateTime.getSeconds()).padStart(2, '0')}.${String(currentDateTime.getMilliseconds()).padStart(3, '0')}`;
  
    const transactionData = {
      transaction_type: formData.transaction_type,
      transaction_date: formattedDateTime,  // সঠিক তারিখ ও সময়
      description: formData.description,
      deposit_amount: parseInt(formData.deposit_amount) || 0,
      withdraw_amount: parseInt(formData.withdraw_amount) || 0
    };
    
    mutation.mutate(transactionData);
    setFormData({ transaction_type: '', transaction_date: '', description: '', deposit_amount: '', withdraw_amount: '' });
  };





  return (
    <div className="popup">
      <div className="bg-white p-7 rounded-lg">
        <h2>Edit Transaction</h2>
      
      <form 
            className="bg-amber-400 p-4 w-full max-w-lg mx-auto rounded-lg shadow-lg flex flex-col gap-4"
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
          >
            
              <select
                className="p-2 border rounded-md flex-1"
                value={formData.transaction_type}
                onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
              >
                <option value="" disabled>
                  জমা/খরচ
                </option>
                <option value="জমা">জমা</option>
                <option value="খরচ">খরচ</option>
              </select>

              <input
                type="date"
                className="p-2 border rounded-md flex-1"
                value={formData.transaction_date}
                onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              />
              
            

            <input
              type="text"
              className="p-2 border rounded-md w-full"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <div className="flex gap-4">
              <input
                type="number"
                className="p-2 border rounded-md flex-1"
                placeholder="Deposit"
                value={formData.deposit_amount || ''}
                onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value, withdraw_amount: '' })}
              />
              <input
                type="number"
                className="p-2 border rounded-md flex-1"
                placeholder="Withdraw"
                value={formData.withdraw_amount || ''}
                onChange={(e) => setFormData({ ...formData, withdraw_amount: e.target.value, deposit_amount: '' })}
              />
            </div>

            <button 
              className="border-2 px-4 py-2 bg-lime-500 text-white font-bold rounded-md w-full hover:bg-lime-600 transition-all"
              type="submit"
            >
              Add Transaction
            </button>
            <button type="button" onClick={onClose}>Close</button>
          </form>
          
          </div>
    </div>
  );
}
