import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([{ bookTitleId: '', quantity: '' }]);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // In a real app we'd fetch book list for autocomplete
    // For now we assume they know IDs or we fetch stock
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await authAPI.getBooks(); // Assume this returns book catalog
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to load books', err);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { bookTitleId: '', quantity: '' }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        items: items.map(i => ({
          bookTitleId: parseInt(i.bookTitleId),
          quantity: parseInt(i.quantity)
        }))
      };
      await authAPI.placeBulkOrder(payload);
      alert('Order placed successfully! Pending confirmation.');
      navigate('/my-orders');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // Helper to find book title by ID
  const getBookTitle = (id) => {
    const book = books.find(b => b.bookTitleId === parseInt(id) || b.id === parseInt(id)); 
    // ^ Handling inconsistency if API returns wrapped object or direct
    return book ? (book.bookTitle?.title || book.title) : '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Place Bulk Order</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
             <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-2">Book ID</div>
                <div className="col-span-6">Title</div>
                <div className="col-span-3">Quantity</div>
                <div className="col-span-1"></div>
             </div>
             
             {items.map((item, idx) => (
               <div key={idx} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2">
                     <input 
                       required 
                       type="number" 
                       className="w-full border rounded-lg p-2" 
                       value={item.bookTitleId} 
                       onChange={e => updateItem(idx, 'bookTitleId', e.target.value)} 
                       placeholder="ID"
                     />
                  </div>
                  <div className="col-span-6 text-gray-700 truncate px-2">
                     {item.bookTitleId && getBookTitle(item.bookTitleId)}
                  </div>
                  <div className="col-span-3">
                     <input 
                       required 
                       type="number" 
                       className="w-full border rounded-lg p-2" 
                       value={item.quantity} 
                       onChange={e => updateItem(idx, 'quantity', e.target.value)} 
                       placeholder="Qty"
                     />
                  </div>
                  <div className="col-span-1 text-center">
                     {items.length > 1 && (
                       <button type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600">
                         ×
                       </button>
                     )}
                  </div>
               </div>
             ))}
          </div>

          <div className="flex justify-between pt-4 border-t">
             <button type="button" onClick={handleAddItem} className="text-indigo-600 font-medium hover:text-indigo-800">
               + Add Another Item
             </button>
             <button 
               type="submit" 
               disabled={loading}
               className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md disabled:opacity-50"
             >
               {loading ? 'Processing...' : 'Submit Order'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
