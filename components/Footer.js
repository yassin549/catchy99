import { FaMapMarkerAlt, FaPhone, FaInstagram, FaTiktok, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center justify-center md:justify-start"><FaMapMarkerAlt className="mr-2" /> Adresse</h3>
          <p>Av. Mohamed Rached El Baji, Ariana, Tunisie, 2037</p>
          <p>Ennasser, à côté de @catchy_outlet99</p>
          <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 inline-block mt-2">Voir sur Google Maps</a>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center justify-center md:justify-start"><FaPhone className="mr-2" /> Contact</h3>
          <p>Téléphone / WhatsApp: <a href="tel:+21658674386" className="hover:text-cyan-300">58 674 386</a></p>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Réseaux sociaux</h3>
          <div className="flex justify-center md:justify-start space-x-6 text-2xl">
            <a href="https://www.instagram.com/catchy_99" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors duration-300"><FaInstagram /></a>
            <a href="https://www.instagram.com/catchy_outlet99" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors duration-300"><FaInstagram /></a>
            <a href="https://www.tiktok.com/@catchy99store" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors duration-300"><FaTiktok /></a>
            <a href="https://www.facebook.com/catchy99" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors duration-300"><FaFacebook /></a>
          </div>
        </div>

      </div>
      <div className="text-center text-gray-500 mt-10 pt-6 border-t border-gray-700">
        <p>&copy; {new Date().getFullYear()} catchy. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
