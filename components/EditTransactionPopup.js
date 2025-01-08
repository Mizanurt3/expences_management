import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EditTransactionPopup({ transaction, onClose, onUpdate }) {
  const [formData, setFormData] = useState(transaction);

  useEffect(() => {
    setFormData(transaction);
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/transactions`, formData);  // API PUT রিকোয়েস্ট
      onUpdate(formData);  // আপডেট সফল হলে প্যারেন্ট কম্পোনেন্টে ইনফর্ম করবে
      onClose();  // পপ-আপ বন্ধ করবে
    } catch (error) {
      console.error("Error updating transaction", error);
    }
  };

  return (
    <div className="popup">
      <div className="bg-white p-7 rounded-lg w-full">
        <h2>Edit Transaction</h2>
        <form
        className="bg-amber-400 p-4 w-full max-w-lg mx-auto rounded-lg shadow-lg flex flex-col gap-4"
        onSubmit={handleSubmit}>

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
                value={formData.transaction_date.slice(0, 10)}  // সঠিক তারিখ ফরম্যাট
            onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              />
              <input

            type="text"
             className="p-2 border rounded-md flex-1"
            placeholder="Transaction Type"
            value={formData.transaction_type}
            onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
          />


          <input
            type="text"
            placeholder="Description"
            className="p-2 border rounded-md flex-1"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="number"
            className="p-2 border rounded-md flex-1"
            placeholder="Deposit"
            value={formData.deposit_amount || ''}
            onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
          />
          <input
            type="number"
             className="p-2 border rounded-md flex-1"
            placeholder="Withdraw"
            value={formData.withdraw_amount || ''}
            onChange={(e) => setFormData({ ...formData, withdraw_amount: e.target.value })}
          />
          
          <button type="submit">Update Transaction</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
}
