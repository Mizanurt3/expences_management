"use client";
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import DataGrid from '@/components/DataGrid';
import EditTransactionPopup from '@/components/EditTransactionPopup'; // পপ-আপ কম্পোনেন্ট ইম্পোর্ট

export default function Home() {
  const [formData, setFormData] = useState({ 
    
    transaction_type: '', 
    description: '', 
    deposit_amount: 0, 
    withdraw_amount: 0, 
    transaction_date: new Date().toISOString().slice(0, 10) 
  });

  const [selectedTransaction, setSelectedTransaction] = useState(null); // পপ-আপের জন্য নির্বাচন করা লেনদেন
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

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction); // পপ-আপের জন্য নির্বাচন করা লেনদেন
  };

  const handleUpdate = (updatedTransaction) => {
    queryClient.invalidateQueries(['transactions']);
    setSelectedTransaction(null); // পপ-আপ বন্ধ করা
  };

  return (
    <div>
      <h1>লেনদেন ব্যবস্থাপনা</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <input
          type="text"
          placeholder="Transaction Type"
          value={formData.transaction_type}
          onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Deposit"
          value={formData.deposit_amount || ''}
          onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value, withdraw_amount: '' })}
        />
        <input
          type="number"
          placeholder="Withdraw"
          value={formData.withdraw_amount || ''}
          onChange={(e) => setFormData({ ...formData, withdraw_amount: e.target.value, deposit_amount: '' })}
        />
        <input
          type="date"
          value={formData.transaction_date}
          onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
        />
        <button type="submit">Add Transaction</button>
      </form>

      <DataGrid onEditClick={handleEditClick}/> {/* DataGrid থেকে edit ক্লিকের জন্য হ্যান্ডলার */}

      {selectedTransaction && (
        <EditTransactionPopup 
          transaction={selectedTransaction} 
          onClose={() => setSelectedTransaction(null)} 
          onUpdate={handleUpdate} 
        />
      )}
    </div>
  );
}
