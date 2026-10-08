# AgroMatch

**Cada cosecha merece un destino.**

AgroMatch conecta los excedentes del campo con negocios que los necesitan: restaurantes, hoteles, comercios y procesadores de Costa Rica.

Este repositorio tiene el prototipo web del proyecto:

- **Inicio** (`index.html`): la historia, cómo funciona, quiénes somos y preguntas frecuentes.
- **Mercado** (`market.html`): catálogo de lotes con búsqueda, filtros por provincia y categoría, favoritos, carrito, pedidos simulados y publicación de lotes de prueba.
- **Comunidad** (`community.html`): perfiles de agricultores y distribuidores, filtros y búsqueda cercana.
- **Match** (`market.html?view=match`): el comprador cuenta qué necesita y ve los lotes que calzan; el productor ve quién busca cosechas.

Funciona en computadora, iPhone y Android. Es una demostración: no hay cobros ni pedidos reales, y todo lo que se guarda queda solo en el navegador de cada persona.

**Sitio:** https://juan080305.github.io/agromatch/

Proyecto universitario · Universidad Fidélitas · 2026  
Instagram: [@agro.match_](https://www.instagram.com/agro.match_/)

Créditos de las fotos en [`creditos.html`](creditos.html).

## Búsqueda y accesibilidad

El buscador reconoce seis grupos de nombres agrícolas en ambos sentidos (por ejemplo, palta/aguacate), plurales comunes (tomates, limones), mayúsculas y palabras sin tilde. Las equivalencias no hacen aparecer productos que no están disponibles. Las fuentes y las exclusiones para evitar confusiones están en [Terminología](docs/terminologia.md).

El botón «Texto grande» mejora la lectura y recuerda la preferencia. Los controles táctiles tienen mayor tamaño. La historia utiliza indicadores con fotografías de vegetales que se colorean al avanzar; también se pueden activar con teclado. Se respeta la preferencia de movimiento reducido.

## Match entre compradores y lotes

El comprador indica producto, kilos, fecha, provincia de preferencia y precio máximo opcional. Cada lote del mismo producto (con sinónimos y plurales) se compara en cuatro puntos: kilos disponibles, fecha en que está listo, provincia y precio. Los lotes que cumplen todo aparecen primero como «Tenés match»; los demás muestran exactamente qué les falta. Si ningún lote alcanza los kilos solo, se indica cuánto suman juntos. Desde la solicitud se agregan los kilos al carrito.

Si una búsqueda en el mercado no encuentra nada, el botón «Pedir este producto» la convierte en solicitud.

En «Publicar lote», la sección «Quién busca cosechas» muestra las solicitudes (las propias y seis ejemplos ficticios). «Publicar un lote para esta solicitud» llena el formulario con producto, kilos, provincia y precio; al publicar, se avisa con cuántas solicitudes calza el lote. Las solicitudes se guardan solo en este navegador y se eliminan con «Borrar mis datos de prueba».

## Compra, ventas y métodos de pago

El carrito permite agregar lotes, cambiar kilos dentro de los límites de inventario y quitar productos. Los pedidos reservan inventario local; cancelar un pedido no retirado devuelve los kilos al catálogo.

- **SINPE Móvil:** opción de adjuntar un comprobante ahora o después desde Mis pedidos; queda pendiente de revisión. El receptor no está configurado y no se solicita una transferencia real.
- **Comprobantes:** JPG, PNG o PDF de hasta 5 MB, con revisión de extensión, MIME y firma inicial. Se guardan como archivos en IndexedDB del navegador, no en GitHub ni en un servidor. Descargar, reemplazar y eliminar mediante cancelación o borrado de datos es posible. No se realiza verificación bancaria ni escaneo antimalware; usar solo archivos ficticios.
- **Tarjeta:** prueba de resultado aprobado/rechazado sin capturar números, vencimientos ni CVV. Un rechazo conserva el carrito.
- **Al retirar:** pedido con pago pendiente.
- **Mis ventas de prueba:** permite recorrer la revisión o rechazo del comprobante. Las acciones están rotuladas como simulación. No valida pagos reales ni representa permisos entre cuentas reales.

Se conserva la compatibilidad con los pedidos anteriores que no tenían método de pago. «Borrar mis datos de prueba» también elimina los comprobantes locales.

## Pruebas

`node --test tests/search.test.cjs` ejecuta los casos de equivalencias y evita confundir productos distintos. `tests/match.cjs` recorre solicitudes con match completo, parcial y sin lotes, la compra desde el match, la demanda para productores y los anchos de pantalla. `tests/flows.cjs` usa Playwright con el sitio servido localmente (variable `AGRO_TEST_URL`, por defecto `http://127.0.0.1:8766/`). `AGRO_BROWSER_CHANNEL` permite elegir el navegador en todas las pruebas de Playwright (`msedge` por defecto; `chromium` o `chrome` también sirven). `AGRO_SCREENSHOT` selecciona dónde guardar la captura de prueba.

## Comunidad y modelo de ingresos

AgroMatch no cobra comisión por transacción. El modelo propuesto se financia con anuncios y otras formas de publicidad identificadas. Los costos de terceros, como transporte o procesamiento de pagos, son independientes de la comisión de plataforma.

`community.html` contiene perfiles de agricultores y distribuidores ficticios, filtros por provincia y especialidad, y creación/edición de perfiles locales. Los lotes enlazan al perfil de su finca y los perfiles vuelven al catálogo filtrado. Los perfiles locales no son cuentas públicas ni identidades verificadas. Se eliminan con «Borrar mis datos de prueba» en el mercado.

La búsqueda cercana solicita geolocalización solamente al pulsar el botón correspondiente. Calcula distancias Haversine en el dispositivo y no guarda ni envía las coordenadas. Incluye un esquema orientativo, radio configurable, alternativa por provincia y manejo de permiso denegado. Las coordenadas de los negocios de muestra son ficticias; no son destinos ni rutas reales. Los perfiles sin coordenadas se muestran sin filtro de distancia o con «Sin límite».

`node tests/community.cjs` comprueba filtros, búsqueda por sinónimos, creación y edición, persistencia, geolocalización permitida/denegada, enlaces al catálogo y anchos de pantalla.
## Requisitos para operar con dinero real

Este alojamiento estático no aporta cuentas verificadas, base de datos compartida, control de acceso entre productores/compradores, cobro bancario, notificaciones ni logística. Se necesita un servidor y un proveedor de pagos con checkout alojado y confirmación de eventos desde el servidor. Para SINPE se deben definir receptor, conciliación del abono, almacenamiento privado de comprobantes y quién puede revisarlos. Una imagen no sustituye la confirmación del banco. No incorporar claves privadas, números de tarjeta ni CVV a este repositorio.

Protección de compra («pay safe»): falta definir si será una garantía propia o una integración con un proveedor como Paysafe. Esta versión no retiene fondos ni ofrece seguros ni garantía de pago.
