import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerList from './features/customer/pages/CustomerList';
import SupplierList from './features/supplier/pages/SupplierList';
import OrderList from './features/order/pages/OrderList';
import QuotationList from './features/quotation/pages/QuotationList';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<QuotationList />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="suppliers" element={<SupplierList />} />
          <Route path="quotations" element={<QuotationList />} />
          <Route path="orders" element={<OrderList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
