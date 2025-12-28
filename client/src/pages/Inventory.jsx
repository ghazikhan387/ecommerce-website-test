import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const Inventory = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);

  // Forms State
  const [transferData, setTransferData] = useState({ sourceWarehouseId: '', targetWarehouseId: '', bookTitleId: '', quantity: '' });
  const [bookData, setBookData] = useState({ isbn: '', title: '', author: '', publisher: '', price: '' });

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const response = await authAPI.getStock();
      setStock(response.data);
    } catch (error) {
      console.error('Error fetching stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await authAPI.transferStock(transferData);
      alert('Stock transferred successfully!');
      setShowTransferModal(false);
      fetchStock(); // Refresh
    } catch (error) {
      alert(error.response?.data?.error || 'Transfer failed');
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await authAPI.createBook({ ...bookData, price: parseFloat(bookData.price) });
      alert('Book added successfully!');
      setShowAddBookModal(false);
      // Ideally refresh stock, but new books have 0 stock so won't show immediately in stock view unless we filter.
      // For now, simpler to just close.
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add book');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading inventory...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <div className="space-x-4">
          <button 
            onClick={() => setShowAddBookModal(true)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            + New Book
          </button>
          <button 
            onClick={() => setShowTransferModal(true)}
            className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 font-medium shadow-sm transition-colors"
          >
            Transfer Stock
          </button>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Book Title</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ISBN</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Quantity</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Selling Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stock.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.bookTitle.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.bookTitle.isbn}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {item.warehouse.name}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm text-right font-medium ${item.quantity <= item.minStock ? 'text-red-600' : 'text-gray-900'}`}>
                    {item.quantity}
                    {item.quantity <= item.minStock && (
                      <span className="ml-2 text-xs text-red-500 bg-red-50 px-1 rounded">Low</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-500">₹{item.bookTitle.price}</td>
                </tr>
              ))}
              {stock.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">No stock found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Transfer Stock</h3>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Book Title ID</label>
                <input required type="number" className="w-full border rounded-lg p-2" value={transferData.bookTitleId} onChange={e => setTransferData({...transferData, bookTitleId: e.target.value})} placeholder="Enter Book ID" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Warehouse ID</label>
                  <input required type="number" className="w-full border rounded-lg p-2" value={transferData.sourceWarehouseId} onChange={e => setTransferData({...transferData, sourceWarehouseId: e.target.value})} placeholder="Src ID" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">To Warehouse ID</label>
                   <input required type="number" className="w-full border rounded-lg p-2" value={transferData.targetWarehouseId} onChange={e => setTransferData({...transferData, targetWarehouseId: e.target.value})} placeholder="Tgt ID" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input required type="number" className="w-full border rounded-lg p-2" value={transferData.quantity} onChange={e => setTransferData({...transferData, quantity: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowTransferModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Book Title</h3>
            <form onSubmit={handleAddBook} className="space-y-4">
              <input required className="w-full border rounded-lg p-2" value={bookData.isbn} onChange={e => setBookData({...bookData, isbn: e.target.value})} placeholder="ISBN" />
              <input required className="w-full border rounded-lg p-2" value={bookData.title} onChange={e => setBookData({...bookData, title: e.target.value})} placeholder="Book Title" />
              <input required className="w-full border rounded-lg p-2" value={bookData.author} onChange={e => setBookData({...bookData, author: e.target.value})} placeholder="Author" />
              <input className="w-full border rounded-lg p-2" value={bookData.publisher} onChange={e => setBookData({...bookData, publisher: e.target.value})} placeholder="Publisher (Optional)" />
              <input required type="number" step="0.01" className="w-full border rounded-lg p-2" value={bookData.price} onChange={e => setBookData({...bookData, price: e.target.value})} placeholder="Selling Price" />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowAddBookModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
