import { useState } from 'react'
import './App.css'

function App() {
  const [language, setLanguage] = useState('es')

  const content = {
    es: {
      title: 'Ágora',
      subtitle: 'Apoyo emocional híbrido - IA + Supervisión Profesional',
      description: 'Un espacio seguro, anónimo y accesible para encontrar apoyo emocional',
      features: [
        { icon: '💬', title: 'Chat 24/7', desc: 'Conversaciones con IA empática disponibles siempre' },
        { icon: '🤝', title: 'Supervisión Profesional', desc: 'Psicólogos certificados monitoreando sesiones' },
        { icon: '🔒', title: 'Totalmente Anónimo', desc: 'Sin necesidad de crear perfil o datos personales' },
        { icon: '⚡', title: 'Respuesta Inmediata', desc: 'Acceso rápido a apoyo emocional en momentos difíciles' }
      ],
      cta: 'Comenzar Sesión',
      about: 'Ágora es una plataforma de apoyo emocional que combina inteligencia artificial con supervisión profesional. Ofrecemos un espacio de escucha y contención para personas que experimentan estrés, ansiedad, duelo o aislamiento emocional.',
      status: 'Beta - En Desarrollo',
      statusDesc: 'La plataforma se está construyendo con las más altas estándares de privacidad y seguridad'
    },
    en: {
      title: 'Ágora',
      subtitle: 'Hybrid Emotional Support - AI + Professional Supervision',
      description: 'A safe, anonymous and accessible space to find emotional support',
      features: [
        { icon: '💬', title: '24/7 Chat', desc: 'Conversations with empathetic AI always available' },
        { icon: '🤝', title: 'Professional Supervision', desc: 'Certified psychologists monitoring sessions' },
        { icon: '🔒', title: 'Completely Anonymous', desc: 'No need to create a profile or provide personal data' },
        { icon: '⚡', title: 'Immediate Response', desc: 'Quick access to emotional support in difficult moments' }
      ],
      cta: 'Start Session',
      about: 'Ágora is an emotional support platform that combines artificial intelligence with professional supervision. We offer a space for listening and support for people experiencing stress, anxiety, grief or emotional isolation.',
      status: 'Beta - In Development',
      statusDesc: 'The platform is being built with the highest privacy and security standards'
    }
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-indigo-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">{t.title}</div>
          <button
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition text-sm font-medium"
          >
            {language === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-indigo-100 rounded-full">
            <span className="text-sm font-medium text-indigo-700">{t.status}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl text-indigo-600 mb-6">
            {t.subtitle}
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            {t.description}
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:shadow-lg hover:scale-105 transition transform font-semibold text-lg">
            {t.cta}
          </button>
        </div>

        {/* Status Badge */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">{t.statusDesc}</span>
          </p>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.map((feature, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition border border-indigo-100"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {language === 'es' ? '¿Qué es Ágora?' : 'What is Ágora?'}
          </h2>
          <p className="text-lg leading-relaxed mb-6 opacity-95">
            {t.about}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition font-semibold">
              {language === 'es' ? 'Saber Más' : 'Learn More'}
            </button>
            <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition font-semibold">
              {language === 'es' ? 'Contacto' : 'Contact'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-indigo-100 py-12 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.title}</h3>
              <p className="text-gray-600 text-sm">{t.description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                {language === 'es' ? 'Información' : 'Information'}
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-indigo-600 transition">About</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                {language === 'es' ? 'Legal' : 'Legal'}
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-indigo-600 transition">{language === 'es' ? 'Privacidad' : 'Privacy'}</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">{language === 'es' ? 'Términos' : 'Terms'}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-indigo-100 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 Ágora. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App