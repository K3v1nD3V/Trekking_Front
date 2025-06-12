import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Traducciones
const resources = {
  en: {
    translation: {
        header: {
            home: "Home",
            packages: "Packages",
            portfolio: "Portfolio",
            about: "About Us",
            services: "Services",
            contact: "Contact",
            login: "Login",
            register: "Register",
            admin: "Go to Admin",
            client: "Go to Client",
            logout: "Logout",
            languaje: "Español",
        },
        hero: {
            title: "Explore the <span>Nature</span> with Trekking <span>San Cristóbal</span>",
            subtitle: "Discover the best destinations and live unforgettable experiences on our trekking routes.",
            contact: "Contact Us",
            learnMore: "Learn More"
        },
        packages: {
            title: "Our Packages",
            otherPackages: "Other Packages",
            contactUs: "Contact Us Now",
            includedServices: "Included Services",
            destination: "Destination",
            date: "Date",
            hour: "Hour",
            meetingPoint: "Meeting Point",
            price: "Price",
            description: "Description",
            noPackages: "Packages could not be loaded, please try again or contact us."
        },
        portfolio: {
            title: "Our Portfolio",
            description: "Each image tells a story, an adventure lived, and a memory that remains. Explore some of our most memorable moments in nature."
        },
        services: {
            title: "Our Services",
        },
        about: {
            title: "About Us",
            highlight: "“Each path we walk is a story we write together in connection with the earth and the soul.”",
            text1: "At <strong>Trekking San Cristóbal</strong>, each route is an invitation to reconnect with the essential: nature, inner silence, and the power of simplicity. Our paths through the mountains and hidden corners of Antioquia awaken the senses, relieve stress, and fill the soul with authentic life.",
            text2: "Here, you don't just walk through landscapes; <strong>you feel them, live them, and carry them with you.</strong> Each experience is designed to transform your day, your mind, and your energy. If you're looking for more than just a hike, if you desire a real moment with yourself and with those who share a passion for nature, this is your place."
        }
    }
  },
  es: {
    translation: {
        header: {
            home: "Inicio",
            packages: "Paquetes",
            portfolio: "Portafolio",
            services: "Servicios",
            about: "Sobre Nosotros",
            contact: "Contacto",
            login: "Ingresar",
            register: "Registrarse",
            admin: "Mi sección",
            client: "Mi sección",
            logout: "Cerrar Sesión",
            languaje: "English"
        },
        hero: {
            title: "Explora la <span>Naturaleza</span> con Trekking <span>San Cristóbal</span>",
            subtitle: "Descubre los mejores destinos y vive experiencias inolvidables en nuestras rutas de trekking.",
            contact: "Contáctanos",
            learnMore: "Conoce Más"
        },
        packages: {
            title: "Nuestros Paquetes",
            otherPackages: "Otros Paquetes",
            contactUs: "Contáctanos Ahora",
            includedServices: "Servicios Incluidos",
            destination: "Destino",
            date: "Fecha",
            hour: "Hora",
            meetingPoint: "Lugar de Encuentro",
            price: "Precio",
            description: "Descripción",
            noPackages: "No se han podido cargar los paquetes, vuelve a intentarlo o contactanos."
        },
        portfolio: {
            title: "Nuestro Portafolio",
            description: "Cada imagen cuenta una historia, una aventura vivida y un recuerdo que permanece. Explora algunos de nuestros momentos más memorables en la naturaleza."
        },
        services: {
            title: "Nuestros Servicios",
        },
        about: {
            title: "Sobre Nosotros",
            highlight: "“Cada sendero recorrido es una historia que escribimos juntos en conexión con la tierra y el alma.”",
            text1: "En <strong>Trekking San Cristóbal</strong>, cada ruta es una invitación a reconectar con lo esencial: la naturaleza, el silencio interior y el poder de lo simple. Nuestros caminos por las montañas y rincones ocultos de Antioquia despiertan sentidos, liberan el estrés y llenan el alma de vida auténtica.",
            text2: "Aquí no solo recorres paisajes; <strong>los sientes, los vives, los llevas contigo.</strong> Cada experiencia está diseñada para transformar tu día, tu mente y tu energía. Si buscas más que una caminata, si deseas un momento real contigo mismo y con quienes comparten la pasión por lo natural, este es tu lugar."
        }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  fallbackLng: 'es', 
  interpolation: {
    escapeValue: false
  }
});

export default i18n;