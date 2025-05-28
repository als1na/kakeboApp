
// src/app/terms/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos de Servicio - KakeboApp',
  description: 'Términos de Servicio de KakeboApp.',
};

const termsOfServiceHtml = `
  <div>
    <h1>Términos de Servicio</h1>
    <p>Fecha de última actualización: 28/05/2025</p>

    <h2>1. Acuerdo de los Términos</h2>
    <p>Estos Términos de Servicio ("Términos") constituyen un acuerdo legalmente vinculante hecho entre tú, ya sea personalmente o en nombre de una entidad ("tú") y KakeboApp ("Compañía", "nosotros", "nos" o "nuestro"), concerniente a tu acceso y uso de la aplicación móvil y web KakeboApp, así como cualquier otra forma de medio, canal de medios, sitio web móvil o aplicación móvil relacionada, vinculada o conectada de otra manera a la misma (colectivamente, el "Sitio" o "Aplicación").</p>
    <p>Aceptas que al acceder al Sitio, has leído, entendido y aceptas estar sujeto a todos estos Términos de Servicio. Si no estás de acuerdo con todos estos Términos de Servicio, entonces se te prohíbe expresamente usar el Sitio y debes discontinuar su uso inmediatamente.</p>
    <p>Términos y condiciones suplementarios o documentos que puedan ser publicados en el Sitio de vez en cuando se incorporan expresamente aquí por referencia. Nos reservamos el derecho, a nuestra sola discreción, de hacer cambios o modificaciones a estos Términos de Servicio en cualquier momento y por cualquier razón.</p>

    <h2>2. Derechos de Propiedad Intelectual</h2>
    <p>A menos que se indique lo contrario, el Sitio es nuestra propiedad propietaria y todo el código fuente, bases de datos, funcionalidad, software, diseños de sitios web, audio, video, texto, fotografías y gráficos en el Sitio (colectivamente, el "Contenido") y las marcas comerciales, marcas de servicio y logotipos contenidos en ella (las "Marcas") son propiedad nuestra o están bajo nuestra licencia, y están protegidos por las leyes de derechos de autor y marcas registradas y varias otras leyes de propiedad intelectual y de competencia desleal de los Estados Unidos, jurisdicciones extranjeras y convenciones internacionales.</p>
    
    <h2>3. Representaciones del Usuario</h2>
    <p>Al usar el Sitio, representas y garantizas que: (1) toda la información de registro que envíes será verdadera, precisa, actual y completa; (2) mantendrás la exactitud de dicha información y la actualizarás puntualmente según sea necesario; (3) tienes la capacidad legal y aceptas cumplir con estos Términos de Servicio; (4) no eres menor de edad en la jurisdicción en la que resides, o si eres menor de edad, has recibido permiso parental para usar el Sitio; (5) no accederás al Sitio a través de medios automatizados o no humanos, ya sea a través de un bot, script o de otra manera; (6) no usarás el Sitio para ningún propósito ilegal o no autorizado; y (7) tu uso del Sitio no violará ninguna ley o regulación aplicable.</p>

    <h2>4. Registro de Usuario</h2>
    <p>Puede que se te requiera registrarte en el Sitio. Aceptas mantener tu contraseña confidencial y serás responsable de todo uso de tu cuenta y contraseña. Nos reservamos el derecho de eliminar, reclamar o cambiar un nombre de usuario que selecciones si determinamos, a nuestra sola discreción, que dicho nombre de usuario es inapropiado, obsceno o de otra manera objetable.</p>
    
    <h2>5. Actividades Prohibidas</h2>
    <p>No puedes acceder o usar el Sitio para ningún propósito que no sea aquel para el cual hacemos disponible el Sitio. El Sitio no puede ser usado en conexión con ningún esfuerzo comercial excepto aquellos que son específicamente respaldados o aprobados por nosotros.</p>

    <h2>6. Terminación</h2>
    <p>Estos Términos de Servicio permanecerán en pleno vigor y efecto mientras uses el Sitio. SIN LIMITAR NINGUNA OTRA DISPOSICIÓN DE ESTOS TÉRMINOS DE SERVICIO, NOS RESERVAMOS EL DERECHO DE, A NUESTRA SOLA DISCRECIÓN Y SIN PREVIO AVISO NI RESPONSABILIDAD, DENEGAR EL ACCESO Y USO DEL SITIO (INCLUYENDO EL BLOQUEO DE CIERTAS DIRECCIONES IP), A CUALQUIER PERSONA POR CUALQUIER RAZÓN O SIN RAZÓN...</p>
    
    <h2>7. Ley Aplicable</h2>
    <p>Estos Términos se regirán e interpretarán de acuerdo con las leyes del estado/país de [Tu Jurisdicción Aquí], sin tener en cuenta sus disposiciones sobre conflicto de leyes.</p>

    <h2>8. Limitaciones de Responsabilidad</h2>
    <p>EN NINGÚN CASO NOSOTROS O NUESTROS DIRECTORES, EMPLEADOS O AGENTES SEREMOS RESPONSABLES ANTE TI O CUALQUIER TERCERO POR CUALQUIER DAÑO DIRECTO, INDIRECTO, CONSECUENTE, EJEMPLAR, INCIDENTAL, ESPECIAL O PUNITIVO, INCLUYENDO PÉRDIDA DE BENEFICIOS, PÉRDIDA DE INGRESOS, PÉRDIDA DE DATOS U OTROS DAÑOS DERIVADOS DE TU USO DEL SITIO, INCLUSO SI HEMOS SIDO ADVERTIDOS DE LA POSIBILIDAD DE TALES DAÑOS.</p>

    <h2>9. Información de Contacto</h2>
    <p>Para resolver una queja sobre el Sitio o para recibir más información sobre el uso del Sitio, por favor contáctanos en: eduardo.alsina@gmail.com</p>
  </div>
`;

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-background text-foreground flex flex-col">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary">KakeboApp</h1>
      </header>
      <main className="flex-grow">
        <article className="prose dark:prose-invert lg:prose-xl max-w-3xl mx-auto bg-card text-card-foreground p-6 sm:p-8 md:p-10 rounded-lg shadow-xl">
          <div dangerouslySetInnerHTML={{ __html: termsOfServiceHtml }} />
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
