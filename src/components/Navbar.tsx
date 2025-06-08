import { NavLink } from 'react-router-dom';

// Define the navigation links in an array for easy management
const navLinks = [
  { to: '/quotations', text: 'Quotations' },
  { to: '/orders', text: 'Orders' },
  { to: '/customers', text: 'Customers' },
  { to: '/suppliers', text: 'Suppliers' },
];

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {/* Map over the navLinks array to render each link */}
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                {link.text}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
