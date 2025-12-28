import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const REPORTS_TABS = {
  PENDING_ORDERS: 'Pending Orders',
  CHALLANS: 'Delivery Challans',
  INVENTORY: 'Inventory Report',
  AGING: 'Receivables Aging',
  ANALYSIS: 'Sales Analysis'
};

const Reports = () => {
  const [activeTab, setActiveTab] = useState(REPORTS_TABS.PENDING_ORDERS);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [activeTab]);

  const fetchReportData = async () => {
    setLoading(true);
    setData(null);
    try {
      let res;
      switch (activeTab) {
        case REPORTS_TABS.PENDING_ORDERS:
          res = await authAPI.getPendingOrders({ status: 'PROFORMA' });
          break;
        case REPORTS_TABS.CHALLANS:
          res = await authAPI.getChallans();
          break;
        case REPORTS_TABS.INVENTORY:
          res = await authAPI.getStock(); // Logic to group by warehouse client-side
          break;
        case REPORTS_TABS.AGING:
          res = await authAPI.getAging();
          break;
        case REPORTS_TABS.ANALYSIS:
          res = await authAPI.getSalesAnalysis();
          break;
        default:
          break;
      }
      setData(res?.data);
    } catch (error) {
      console.error('Report fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!data) return;
    
    // Flatten data for CSV
    let rows = [];
    if (Array.isArray(data)) {
      rows = data;
    } else if (data.details) {
      rows = data.details; // For Aging
    } else if (data.byBranch) {
        // Complex object (Analysis), create separate CSVs or combine
        rows = [...data.byBranch.map(b => ({ Type: 'Branch', Name: b.branch, Amount: b.total })), 
                ...data.byMonth.map(m => ({ Type: 'Month', Name: m.month, Amount: m.total }))];
    }

    if (rows.length === 0) return alert('No data to export');

    const headers = Object.keys(rows[0]).join(',');
    const csvContent = [headers, ...rows.map(row => Object.values(row).map(v => `"${v}"`).join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeTab}_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-2xl font-bold text-gray-800">Reports Center</h1>
        <div className="space-x-2">
           <button onClick={handleExport} className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50">
             Export CSV
           </button>
           <button onClick={handlePrint} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
             Print / PDF
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto print:hidden">
        {Object.values(REPORTS_TABS).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px] print:shadow-none print:border-none">
        <div className="mb-6 border-b pb-4">
           <h2 className="text-xl font-bold text-gray-900">{activeTab}</h2>
           <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {loading ? (
            <div className="text-center py-12 text-gray-500">Loading data...</div>
        ) : !data ? (
            <div className="text-center py-12 text-gray-400">No data available</div>
        ) : (
            <div className="overflow-x-auto">
               {/* Render View Based on Tab */}
               {activeTab === REPORTS_TABS.PENDING_ORDERS && (
                   <table className="w-full text-left text-sm">
                       <thead className="bg-gray-50"><tr><th className="p-2">Date</th><th className="p-2">Customer</th><th className="p-2">Amount</th><th className="p-2">Status</th></tr></thead>
                       <tbody>
                           {data.map(o => (
                               <tr key={o.id} className="border-b">
                                   <td className="p-2">{new Date(o.createdAt).toLocaleDateString()}</td>
                                   <td className="p-2">{o.customer?.name}</td>
                                   <td className="p-2 font-medium">₹{o.totalAmount}</td>
                                   <td className="p-2"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">{o.status}</span></td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               )}

               {activeTab === REPORTS_TABS.CHALLANS && (
                   <table className="w-full text-left text-sm">
                       <thead className="bg-gray-50"><tr><th className="p-2">Order #</th><th className="p-2">Customer</th><th className="p-2">Address</th><th className="p-2">Items</th></tr></thead>
                       <tbody>
                           {data.map(c => (
                               <tr key={c.id} className="border-b">
                                   <td className="p-2">SO-{c.id}</td>
                                   <td className="p-2">{c.customer?.name}</td>
                                   <td className="p-2 text-gray-500">{c.customer?.address || 'N/A'}</td>
                                   <td className="p-2">{c.salesOrderItems?.length} Titles</td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               )}

               {activeTab === REPORTS_TABS.AGING && (
                   <div className="space-y-6">
                       <div className="grid grid-cols-4 gap-4 mb-6">
                           {Object.entries(data.summary).map(([bucket, amount]) => (
                               <div key={bucket} className="bg-gray-50 p-4 rounded text-center">
                                   <div className="text-gray-500 text-xs uppercase">{bucket} Days</div>
                                   <div className="text-xl font-bold text-gray-900">₹{amount.toLocaleString()}</div>
                               </div>
                           ))}
                       </div>
                       <table className="w-full text-left text-sm">
                           <thead className="bg-gray-50"><tr><th className="p-2">Inv #</th><th className="p-2">Customer</th><th className="p-2">Days Old</th><th className="p-2 text-right">Amount</th></tr></thead>
                           <tbody>
                               {data.details.map((d, i) => (
                                   <tr key={i} className="border-b">
                                       <td className="p-2">{d.invoiceNumber}</td>
                                       <td className="p-2">{d.customer}</td>
                                       <td className="p-2"><span className={`px-2 py-0.5 rounded ${d.daysOld > 90 ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>{d.daysOld}</span></td>
                                       <td className="p-2 text-right font-medium">₹{d.amount}</td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               )}
               
               {activeTab === REPORTS_TABS.ANALYSIS && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div>
                           <h3 className="font-bold mb-4">Sales by Branch</h3>
                           <table className="w-full text-sm">
                               <thead className="bg-gray-50"><tr><th className="p-2 text-left">Branch</th><th className="p-2 text-right">Total Sales</th></tr></thead>
                               <tbody>
                                   {data.byBranch.map((b, i) => (
                                       <tr key={i} className="border-b"><td className="p-2">{b.branch}</td><td className="p-2 text-right font-medium">₹{b.total.toLocaleString()}</td></tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                       <div>
                           <h3 className="font-bold mb-4">Sales by Month</h3>
                           <table className="w-full text-sm">
                               <thead className="bg-gray-50"><tr><th className="p-2 text-left">Month</th><th className="p-2 text-right">Total Sales</th></tr></thead>
                               <tbody>
                                   {data.byMonth.map((m, i) => (
                                       <tr key={i} className="border-b"><td className="p-2">{m.month}</td><td className="p-2 text-right font-medium">₹{m.total.toLocaleString()}</td></tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                   </div>
               )}

               {activeTab === REPORTS_TABS.INVENTORY && (
                   <table className="w-full text-left text-sm">
                       <thead className="bg-gray-50"><tr><th className="p-2">Book Title</th><th className="p-2">ISBN</th><th className="p-2">Warehouse Report</th><th className="p-2 text-right">Total Qty</th></tr></thead>
                       <tbody>
                           {/* Simplified view: grouping by book and listing warehouses */}
                           {/* Note: data is flat inventory list. Ideally we group it. */}
                           {data.map(item => (
                               <tr key={item.id} className="border-b">
                                   <td className="p-2">{item.bookTitle.title}</td>
                                   <td className="p-2 text-gray-500">{item.bookTitle.isbn}</td>
                                   <td className="p-2">
                                       <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{item.warehouse.name}: {item.quantity}</span>
                                   </td>
                                   <td className="p-2 text-right">{item.quantity}</td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
