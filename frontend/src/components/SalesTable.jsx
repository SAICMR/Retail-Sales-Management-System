import '../styles/SalesTable.css';

function SalesTable({ data }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="table-container">
      <table className="sales-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer Name</th>
            <th>Phone</th>
            <th>Region</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Product</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price/Unit</th>
            <th>Discount</th>
            <th>Total Amount</th>
            <th>Final Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sale) => (
            <tr key={sale.id}>
              <td>{formatDate(sale.date)}</td>
              <td>{sale.customerName}</td>
              <td>{sale.phoneNumber}</td>
              <td>{sale.customerRegion}</td>
              <td>{sale.gender}</td>
              <td>{sale.age}</td>
              <td>{sale.productName}</td>
              <td>{sale.productCategory}</td>
              <td>{sale.quantity}</td>
              <td>{formatCurrency(sale.pricePerUnit)}</td>
              <td>{sale.discountPercentage}%</td>
              <td>{formatCurrency(sale.totalAmount)}</td>
              <td className="final-amount">{formatCurrency(sale.finalAmount)}</td>
              <td>{sale.paymentMethod}</td>
              <td>
                <span className={`status-badge status-${sale.orderStatus.toLowerCase()}`}>
                  {sale.orderStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesTable;


