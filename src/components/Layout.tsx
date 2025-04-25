import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

// 不需要接收 children
export default function Layout() {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Outlet />
        </main>
        <footer className="border-t bg-white py-4">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Sales Management System
          </div>
        </footer>
      </div>
    );
  }