import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styles from '../styles/Home.module.css';
import axios from 'axios';

// API থেকে লেনদেন তথ্য পেতে ফাংশন
const fetchTransactions = async () => {
  const res = await axios.get('/api/transactions');
  return res.data; // পুরো JSON অবজেক্ট রিটার্ন হবে
};

export default function DataGrid({ onEditClick }) {
  const queryClient = useQueryClient();

  // লেনদেন মুছে ফেলার জন্য mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/transactions?id=${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      alert('লেনদেন সফলভাবে মুছে ফেলা হয়েছে!');
    },
    onError: (error) => {
      alert(`ত্রুটি ঘটেছে: ${error.response?.data?.message || error.message}`);
    },
  });

  // লেনদেন মুছে ফেলার জন্য ফাংশন
  const handleDelete = (id) => {
    if (confirm('আপনি কি নিশ্চিত যে আপনি এই লেনদেনটি মুছে ফেলতে চান?')) {
      deleteMutation.mutate(id); // axios mutation ব্যবহার
    }
  };

  // Query থেকে লেনদেন ডাটা লোড করা
  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  if (isLoading) return <p>লোড হচ্ছে...</p>;
  if (error) return <p>ত্রুটি: {error.message}</p>;

  // তারিখ ফরম্যাট করার ফাংশন
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  // মোট জমা, মোট খরচ, এবং ব্যালেন্স ক্যালকুলেট
  const totalDeposit = data.result.reduce((acc, item) => acc + (item.deposit_amount || 0), 0);
  const totalWithdraw = data.result.reduce((acc, item) => acc + (item.withdraw_amount || 0), 0);
  const balance = totalDeposit - totalWithdraw;

  return (
    <div>
      <div className={styles.summary}>
        <p>মোট জমা: {totalDeposit}</p>
        <p>মোট খরচ: {totalWithdraw}</p>
        <p>বর্তমান ব্যালেন্স: {balance}</p>
      </div>
      
      <table className={styles.table}>
        <thead>
          <tr>
            <th>লেনদেনের প্রকার</th>
            <th>তারিখ</th>
            <th>বিবরণ</th>
            <th>জমার পরিমাণ</th>
            <th>খরচের পরিমাণ</th>
            <th>সম্পাদনা</th>
            <th>মুছুন</th>
          </tr>
        </thead>
        <tbody>
          {data.result.map((item) => (
            <tr key={item.id}>
              <td>{item.transaction_type}</td>
              <td>{formatDate(item.transaction_date)}</td>
              <td>{item.description}</td>
              <td>{item.deposit_amount}</td>
              <td>{item.withdraw_amount}</td>
              <td>
                <button onClick={() => onEditClick(item)}>✏️</button>
              </td>
              <td>
                <button onClick={() => handleDelete(item.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
