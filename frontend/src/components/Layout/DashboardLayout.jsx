/**
 * MAIN LAYOUT WRAPPER
 */
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './Layout.css';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-main">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
