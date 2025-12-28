import Footer from '../components/Footer';

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}

export default PublicLayout;
