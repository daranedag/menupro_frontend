import Header from '../components/Header';
import Footer from '../components/Footer';

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isPublic={true} />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}

export default PublicLayout;
