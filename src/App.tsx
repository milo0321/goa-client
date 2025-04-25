import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerList from './pages/CustomerList';
import QuotationList from './pages/QuotationList';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<QuotationList />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="quotations" element={<QuotationList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;