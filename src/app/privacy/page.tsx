
// src/app/privacy/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad - KakeboApp',
  description: 'Política de Privacidad de KakeboApp.',
};

const privacyPolicyHtml = `
  <div>
    <h1>Política de Privacidad</h1>
    <p>Fecha de última actualización: 28/05/2025</p>
    
    <h2>1. Introducción</h2>
    <p>Bienvenido a KakeboApp ("nosotros", "nuestro", o "nos"). Nos comprometemos a proteger tu información personal y tu derecho a la privacidad. Si tienes alguna pregunta o inquietud sobre nuestra política, o nuestras prácticas con respecto a tu información personal, por favor contáctanos en eduardo.alsina@gmail.com.</p>
    <p>Cuando visitas nuestra aplicación KakeboApp y usas nuestros servicios, nos confías tu información personal. Nos tomamos tu privacidad muy en serio. En esta política de privacidad, buscamos explicarte de la manera más clara posible qué información recopilamos, cómo la usamos y qué derechos tienes en relación con ella.</p>
    
    <h2>2. ¿Qué Información Recopilamos?</h2>
    <p>Recopilamos información personal que nos proporcionas voluntariamente cuando te registras en la Aplicación, expresas interés en obtener información sobre nosotros o nuestros productos y servicios, cuando participas en actividades en la Aplicación o de otra manera cuando nos contactas.</p>
    <p>La información personal que recopilamos depende del contexto de tus interacciones con nosotros y la Aplicación, las elecciones que haces y los productos y características que usas. La información personal que recopilamos puede incluir lo siguiente:</p>
    <ul>
      <li><strong>Información de Identificación Personal:</strong> Nombre, dirección de correo electrónico, nombre de usuario, contraseña y otra información similar.</li>
      <li><strong>Datos Financieros:</strong> Datos relacionados con tus ingresos, gastos, categorías de transacciones y metas de ahorro que ingresas voluntariamente en la aplicación. No procesamos ni almacenamos información de tarjetas de pago.</li>
    </ul>

    <h2>3. ¿Cómo Usamos Tu Información?</h2>
    <p>Usamos la información personal recopilada a través de nuestra Aplicación para una variedad de propósitos comerciales que se describen a continuación. Procesamos tu información personal para estos propósitos en base a nuestros intereses comerciales legítimos, para celebrar o cumplir un contrato contigo, con tu consentimiento, y/o para cumplir con nuestras obligaciones legales.</p>
    <ul>
      <li>Para facilitar la creación de cuentas y el proceso de inicio de sesión.</li>
      <li>Para enviar información administrativa.</li>
      <li>Para proteger nuestros Servicios.</li>
      <li>Para responder a las solicitudes de los usuarios/ofrecer soporte a los usuarios.</li>
      <li>Para otros fines comerciales, como análisis de datos, identificación de tendencias de uso, determinación de la efectividad de nuestras campañas promocionales y para evaluar y mejorar nuestra Aplicación, productos, marketing y tu experiencia.</li>
    </ul>

    <h2>4. ¿Se Compartirá Tu Información con Alguien?</h2>
    <p>Solo compartimos y divulgamos tu información en las siguientes situaciones:</p>
    <ul>
      <li>Cumplimiento de Leyes.</li>
      <li>Intereses Vitales y Derechos Legales.</li>
      <li>Con tu Consentimiento.</li>
    </ul>
    <p>No compartimos ni vendemos tu información personal a terceros para sus fines de marketing.</p>

    <h2>5. ¿Cuánto Tiempo Conservamos Tu Información?</h2>
    <p>Conservaremos tu información personal solo durante el tiempo que sea necesario para los fines establecidos en esta política de privacidad, a menos que la ley exija o permita un período de retención más largo (como impuestos, contabilidad u otros requisitos legales). Cuando no tengamos una necesidad comercial legítima en curso para procesar tu información personal, la eliminaremos o la anonimizaremos.</p>

    <h2>6. ¿Cómo Mantenemos Segura Tu Información?</h2>
    <p>Hemos implementado medidas de seguridad técnicas y organizativas apropiadas diseñadas para proteger la seguridad de cualquier información personal que procesemos. Sin embargo, recuerda también que no podemos garantizar que internet en sí sea 100% seguro.</p>
    
    <h2>7. ¿Cuáles Son Tus Derechos de Privacidad?</h2>
    <p>En algunas regiones (como el Espacio Económico Europeo), tienes ciertos derechos bajo las leyes de protección de datos aplicables. Estos pueden incluir el derecho (i) a solicitar acceso y obtener una copia de tu información personal, (ii) a solicitar rectificación o eliminación; (iii) a restringir el procesamiento de tu información personal; y (iv) si aplica, a la portabilidad de datos. En ciertas circunstancias, también puedes tener el derecho de oponerte al procesamiento de tu información personal.</p>

    <h2>8. Actualizaciones a Esta Política</h2>
    <p>Podemos actualizar esta política de privacidad de vez en cuando. La versión actualizada será indicada por una fecha de "Última actualización" revisada y la versión actualizada será efectiva tan pronto como sea accesible.</p>

    <h2>9. ¿Cómo Puedes Contactarnos Sobre Esta Política?</h2>
    <p>Si tienes preguntas o comentarios sobre esta política, puedes enviarnos un correo electrónico a eduardo.alsina@gmail.com.</p>
  </div>
`;

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-background text-foreground flex flex-col">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary">KakeboApp</h1>
      </header>
      <main className="flex-grow">
        <article className="prose dark:prose-invert lg:prose-xl max-w-3xl mx-auto bg-card text-card-foreground p-6 sm:p-8 md:p-10 rounded-lg shadow-xl">
          <div dangerouslySetInnerHTML={{ __html: privacyPolicyHtml }} />
        </article>
      </main>
      <footer className="py-8 mt-12 text-center text-xs text-muted-foreground border-t">
        <p>
          Desarrollado por <a href="https://www.eduardoalsina.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">Eduardo J. Alsina E.</a> para <a href="https://www.cesurformacion.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">CESUR</a>.
        </p>
        <p>&copy; 2025 Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
