# AgroMatch

**Cada cosecha merece un destino.**

AgroMatch conecta los excedentes del campo con negocios que los necesitan: restaurantes, hoteles, comercios y procesadoras de Costa Rica.

Este repositorio tiene el prototipo web del proyecto:

- **Inicio** (`index.html`): la historia, cómo funciona, quiénes somos y preguntas frecuentes.
- **Mercado** (`mercado.html`): catálogo de lotes con búsqueda, filtros por provincia y categoría, favoritos, carrito, pedidos simulados y publicación de lotes de prueba.
- **Solicitudes de compra** (`mercado.html?vista=solicitudes`): el comprador cuenta qué necesita y ve los lotes que calzan; el productor ve quién busca cosechas.
- **Comunidad** (`comunidad.html`): perfiles de agricultores y distribuidores, filtros y búsqueda cercana.

Funciona en computadora, iPhone y Android. Es una demostración: no hay cobros ni pedidos reales, y todo lo que se guarda queda solo en el navegador de cada persona.

**Sitio:** https://juan080305.github.io/agromatch/

Proyecto universitario · Universidad Fidélitas · 2026  
Instagram: [@agro.match_](https://www.instagram.com/agro.match_/)

Créditos de las fotos en [`creditos.html`](creditos.html).

## Organización de los archivos

| Carpeta o archivo | Contenido |
| --- | --- |
| `index.html`, `inicio.js`, `estilos.css` | Página de inicio y estilos generales |
| `mercado.html`, `mercado.js`, `mercado.css` | Mercado: catálogo, carrito y pedidos |
| `mercado-mejoras.js` | Filtro por finca, perfil al publicar y «Volver a comprar» |
| `solicitudes.js`, `solicitudes.css` | Solicitudes de compra y lotes que calzan |
| `pagos.js`, `comprobantes.js` | Métodos de pago simulados y comprobantes |
| `comunidad.html`, `comunidad.js`, `comunidad.css` | Perfiles de agricultores y distribuidores |
| `diccionario-busqueda.js` | Sinónimos y plurales del buscador |
| `accesibilidad.js`, `accesibilidad.css` | Texto grande y controles táctiles |
| `imagenes/` | Fotos, íconos y vista previa para compartir |
| `documentacion/` | Fuentes de la terminología agrícola |
| `pruebas/` | Pruebas automáticas |
| `404.html` | Página de error; redirige los enlaces de versiones anteriores |

## Búsqueda y accesibilidad

El buscador reconoce seis grupos de nombres agrícolas en ambos sentidos (por ejemplo, palta y aguacate), plurales comunes (tomates, limones), mayúsculas y palabras sin tilde. Las equivalencias no hacen aparecer productos que no están disponibles. Las fuentes y las exclusiones para evitar confusiones están en [Terminología](documentacion/terminologia.md).

El botón «Texto grande» mejora la lectura y recuerda la preferencia. Los controles táctiles tienen mayor tamaño. La historia utiliza indicadores con fotografías de vegetales que se colorean al avanzar; también se pueden activar con teclado. Se respeta la preferencia de movimiento reducido.

## Solicitudes de compra

En «Hacer match», el comprador indica producto, kilos, fecha, provincia de preferencia y precio máximo opcional. Cada lote del mismo producto (con sinónimos y plurales) se compara en cuatro puntos: kilos disponibles, fecha en que está listo, provincia y precio. Los lotes que cumplen todo aparecen primero; los demás muestran exactamente qué les falta. Si ningún lote alcanza los kilos por sí solo, se indica cuánto suman juntos. Desde la solicitud se agregan los kilos al carrito.

Si una búsqueda en el mercado no encuentra nada, el botón «Pedir este producto» la convierte en solicitud.

En «Publicar lote», la sección «Quién busca cosechas» muestra las solicitudes (las propias y seis ejemplos ficticios). «Publicar un lote para esta solicitud» llena el formulario con producto, kilos, provincia y precio; al publicar, se avisa con cuántas solicitudes calza el lote. Las solicitudes se guardan solo en este navegador y se eliminan con «Borrar mis datos de prueba».

## Compra, ventas y métodos de pago

El carrito permite agregar lotes, cambiar kilos dentro de los límites de inventario y quitar productos. Los pedidos reservan inventario local; cancelar un pedido no retirado devuelve los kilos al catálogo.

- **SINPE Móvil:** opción de adjuntar un comprobante ahora o después desde Mis pedidos; queda pendiente de revisión. El receptor no está configurado y no se solicita una transferencia real.
- **Comprobantes:** JPG, PNG o PDF de hasta 5 MB, con revisión de extensión, tipo de archivo y firma inicial. Se guardan en el almacenamiento interno del navegador, no en GitHub ni en un servidor. Se pueden descargar, reemplazar y eliminar al cancelar el pedido o borrar los datos. No hay verificación bancaria ni análisis antivirus; usar solo archivos ficticios.
- **Tarjeta:** prueba de resultado aprobado o rechazado sin pedir números, vencimiento ni código de seguridad. Un rechazo conserva el carrito.
- **Al retirar:** pedido con pago pendiente.
- **Mis ventas de prueba:** permite recorrer la revisión o el rechazo del comprobante. Las acciones están rotuladas como simulación. No valida pagos reales ni representa permisos entre cuentas reales.

Se conserva la compatibilidad con los pedidos anteriores que no tenían método de pago. «Borrar mis datos de prueba» también elimina los comprobantes locales.

## Comunidad y modelo de ingresos

AgroMatch no cobra comisión por transacción. El modelo propuesto se financia con anuncios y otras formas de publicidad identificadas. Los costos de terceros, como transporte o procesamiento de pagos, son independientes de la comisión de plataforma.

`comunidad.html` contiene perfiles ficticios de agricultores y distribuidores, filtros por provincia y especialidad, y creación y edición de perfiles locales. Los lotes enlazan al perfil de su finca y los perfiles vuelven al catálogo filtrado. Los perfiles locales no son cuentas públicas ni identidades verificadas. Se eliminan con «Borrar mis datos de prueba» en el mercado.

La búsqueda cercana pide la ubicación solamente al pulsar el botón correspondiente. Calcula las distancias en línea recta (fórmula del semiverseno) en el mismo dispositivo y no guarda ni envía las coordenadas. Incluye un esquema orientativo, radio configurable, alternativa por provincia y manejo del permiso denegado o sin respuesta. Las coordenadas de los negocios de muestra son ficticias; no son destinos ni rutas reales. Los perfiles sin coordenadas se muestran sin filtro de distancia o con «Sin límite».

## Pruebas

Con el sitio servido localmente (por ejemplo, `python -m http.server 8766`):

- `node --test pruebas/busqueda.test.cjs`: sinónimos, plurales y casos que no deben confundirse.
- `node pruebas/recorridos.cjs`: carrito, pagos simulados, comprobantes, ventas, cancelación, texto grande y anchos de pantalla.
- `node pruebas/solicitudes.cjs`: solicitudes con coincidencia completa, parcial y sin lotes, compra desde la solicitud y demanda para productores.
- `node pruebas/comunidad.cjs`: filtros, perfiles, ubicación permitida y denegada, y enlaces al catálogo.
- `node pruebas/mejoras.cjs`: filtro por finca, perfil al publicar y «Volver a comprar».

Las pruebas con navegador usan Playwright. Variables opcionales: `AGRO_URL_PRUEBA` (dirección del sitio, por defecto `http://127.0.0.1:8766/`), `AGRO_NAVEGADOR` (`msedge` por defecto; también `chromium` o `chrome`) y `AGRO_CAPTURA` (dónde guardar la captura de la prueba de recorridos).

## Requisitos para operar con dinero real

Este alojamiento estático no ofrece cuentas verificadas, base de datos compartida, control de acceso entre productores y compradores, cobro bancario, notificaciones ni logística. Se necesita un servidor y un proveedor de pagos con su propia página de pago y confirmación de cada cobro desde el servidor. Para SINPE se deben definir el receptor, la conciliación del abono, el almacenamiento privado de comprobantes y quién puede revisarlos. Una imagen no sustituye la confirmación del banco. No incorporar claves privadas, números de tarjeta ni códigos de seguridad a este repositorio.

Protección de compra: falta definir si será una garantía propia o un servicio de un proveedor externo. Esta versión no retiene fondos ni ofrece seguros ni garantía de pago.
