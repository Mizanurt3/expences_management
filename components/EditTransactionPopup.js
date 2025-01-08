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
      <div className="popup-content">
        <h2>Edit Transaction</h2>
        <form onSubmit={handleSubmit}>
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
            onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
          />
          <input
            type="number"
            placeholder="Withdraw"
            value={formData.withdraw_amount || ''}
            onChange={(e) => setFormData({ ...formData, withdraw_amount: e.target.value })}
          />
          <input
            type="date"
            value={formData.transaction_date.slice(0, 10)}  // সঠিক তারিখ ফরম্যাট
            onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
          />
          <button type="submit">Update Transaction</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
}
