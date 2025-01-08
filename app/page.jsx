"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import DataGrid from '@/components/DataGrid';
import EditTransactionPopup from '@/components/EditTransactionPopup'; 
import styles from '@/styles/Home.module.css';
import InsertTransactionPopup from '@/components/InsertTransactionPopup';

// Importing the local image
import coverImage from '@/public/images/cover-image.jpg'; // Make sure the path is correct

export default function Home() {
  const [selectedTransaction, setSelectedTransaction] = useState(null); 
  const queryClient = useQueryClient();
  

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleUpdate = (updatedTransaction) => {
    queryClient.invalidateQueries(['transactions']);
    setSelectedTransaction(null);
  };

  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className={styles.container}>
      

      <div 
  style={{
    height: '200px',
    width: '100%',
    backgroundImage: `url(${coverImage.src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'brightness(0.9)',
    display: 'flex', // Centering requires flex display
    justifyContent: 'center', // Horizontal centering
    alignItems: 'center', // Vertical centering
  }}
>
  <h1 
    style={{
      backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      fontSize: '24px',
      textAlign: 'center',
    }}
  >
    বাড়ী তৈরিতে মোট ব্যায়ের হিসাব
  </h1>
</div>


      
      
      
      

      <DataGrid onEditClick={handleEditClick} />

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
