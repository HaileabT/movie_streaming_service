export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-6 py-6 text-center text-gray-400">
        <p>MovieStream is a Free Movies streaming site with zero ads. We let you watch movies online without having to register or paying, with diffrent movies and TV-Series.</p>
        <p className="mb-2">© {new Date().getFullYear()} </p>
      </div>
    </footer>
  );
}
