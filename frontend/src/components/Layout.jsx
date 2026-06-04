import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => (
  <div className="shell min-h-screen">
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);

export default Layout;
