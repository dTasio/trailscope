# TrailScope

\<p align="center">
&#x20; \<img src="src/assets/images/branding/trailscope-logo.png" alt="TrailScope" width="320" />
\</p>

TrailScope es una aplicación web para descubrir rutas de senderismo y lugares naturales, consultar información relevante sobre ellos y organizar futuras escapadas.

El proyecto nace como una pieza de portfolio centrada especialmente en **frontend, experiencia de usuario, consumo de APIs, mapas interactivos y desarrollo con React**.

La aplicación permite explorar contenido geográfico real, guardar favoritos, crear escapadas, consultar meteorología y llevar un registro de rutas completadas.

---

## Funcionalidades

### Explorar rutas y lugares

TrailScope permite buscar contenido dentro de una zona determinada del mapa.

Actualmente se pueden consultar:

- rutas de senderismo;
- cascadas;
- miradores;
- lagos.

Los resultados se muestran tanto visualmente sobre un mapa interactivo como mediante tarjetas de contenido.

Cada ruta o lugar dispone además de una página de detalle con la información disponible obtenida desde los servicios externos utilizados por la aplicación.

### Favoritos

Las rutas y lugares se pueden guardar como favoritos para consultarlos posteriormente.

Los favoritos se almacenan localmente en el navegador mediante `localStorage`.

### Escapadas

El usuario puede crear escapadas indicando:

- nombre;
- fecha de inicio;
- fecha de finalización;
- zona o localidad;
- notas.

Dentro de cada escapada puede buscar rutas y lugares cercanos y añadirlos a su planificación.

### Meteorología

Cuando una escapada tiene una ubicación definida, TrailScope consulta la previsión meteorológica disponible para esa zona y fechas.

Se muestran datos como:

- temperatura máxima y mínima;
- probabilidad de precipitación;
- velocidad del viento;
- estado meteorológico previsto.

### Rutas completadas

Las rutas realizadas pueden marcarse como completadas indicando la fecha en la que se realizaron.

Esto permite mantener un pequeño historial de actividad dentro de la aplicación.

---

## Tecnologías utilizadas

El proyecto ha sido desarrollado principalmente con:

- **React**
- **Vite**
- **JavaScript**
- **React Router**
- **Tailwind CSS**
- **MapLibre GL JS**
- **localStorage**

No utiliza actualmente backend, base de datos ni sistema de autenticación.

La persistencia de favoritos, escapadas y rutas completadas se realiza directamente en el navegador.

---

## APIs y servicios externos

TrailScope utiliza diferentes servicios externos para obtener información real.

### OpenStreetMap y Overpass API

Los datos de rutas y lugares naturales proceden de **OpenStreetMap** y se consultan mediante **Overpass API**.

TrailScope transforma posteriormente estos datos para adaptarlos a la estructura utilizada por la interfaz.

Los datos de OpenStreetMap son creados y mantenidos por su comunidad de colaboradores.

**© OpenStreetMap contributors**

### Open-Meteo

La información meteorológica se obtiene mediante **Open-Meteo**.

La disponibilidad de la previsión depende de las fechas seleccionadas y del periodo meteorológico disponible en cada momento.

### MapLibre y OpenFreeMap

La representación cartográfica de TrailScope utiliza **MapLibre GL JS** junto con mapas proporcionados mediante **OpenFreeMap**.

---

## Dependencia de servicios externos

> **Importante:** TrailScope depende de APIs y servicios externos para obtener rutas, lugares, información geográfica y meteorología.

Esto significa que en determinados momentos una consulta puede tardar más de lo habitual o incluso fallar temporalmente debido a factores ajenos a la propia aplicación, como:

- indisponibilidad temporal de una API;
- límites o saturación del servicio;
- problemas de conexión;
- ausencia de información para una zona determinada;
- datos incompletos en OpenStreetMap.

Por este motivo, ocasionalmente TrailScope puede mostrar mensajes indicando que no se han podido recuperar determinados datos.

Este comportamiento no implica necesariamente un fallo interno de la aplicación, sino que puede deberse a la disponibilidad del servicio externo consultado.

---

## Arquitectura del proyecto

La aplicación está organizada separando responsabilidades entre componentes, páginas, servicios y utilidades.

```text
src/
├── assets/
│   └── images/
├── components/
│   ├── explore/
│   ├── places/
│   ├── routes/
│   └── trips/
├── pages/
├── services/
├── utils/
├── App.jsx
└── main.jsx
```

### `components`

Contiene componentes reutilizables de la interfaz.

### `pages`

Contiene las principales vistas asociadas a las rutas de la aplicación.

### `services`

Centraliza la comunicación con APIs externas y la persistencia mediante `localStorage`.

### `utils`

Agrupa funciones auxiliares para transformar y presentar los datos.

---

## Principales rutas

```text
/                 Inicio
/explore          Exploración
/routes/:id       Detalle de una ruta
/places/:osmKey   Detalle de un lugar
/favorites        Favoritos
/trips            Escapadas
/trips/:id        Planificación de una escapada
/activity         Rutas completadas
```

---

## Persistencia de datos

TrailScope no requiere registro ni cuenta de usuario.

Los siguientes datos se almacenan mediante `localStorage`:

- favoritos;
- escapadas;
- rutas completadas;
- información asociada a la planificación.

Esto permite mantener la información entre sesiones en el mismo navegador.

Al tratarse de almacenamiento local:

- los datos no se sincronizan entre dispositivos;
- borrar los datos del navegador puede eliminar la información guardada;
- actualmente no existe una cuenta desde la que recuperar los datos.

---

## Diseño y experiencia de usuario

Uno de los objetivos principales del proyecto ha sido trabajar especialmente la parte visual y de frontend.

Durante el desarrollo se ha prestado atención a:

- jerarquía visual;
- espaciado;
- tipografía;
- paleta de colores consistente;
- responsive design;
- estados de interacción;
- mapas y contenido visual;
- navegación clara;
- tarjetas y componentes reutilizables;
- adaptación de la interfaz a escritorio y dispositivos móviles.

La identidad visual de TrailScope utiliza principalmente tonos verdes y naturales relacionados con senderismo, montaña y naturaleza.

---

## Imágenes y recursos visuales

TrailScope utiliza distintos tipos de recursos visuales.

Las fotografías de lugares reales utilizadas en la aplicación han sido obtenidas de Wikimedia Commons, respetando su carácter de contenido público y las condiciones asociadas a sus respectivos recursos.

También se han utilizado imágenes generadas mediante Inteligencia Artificial para determinados elementos visuales genéricos o de apoyo, especialmente cuando no representan un lugar real concreto.

El logotipo e identidad visual de TrailScope también han sido desarrollados específicamente para este proyecto con apoyo de herramientas de Inteligencia Artificial.

El objetivo de las imágenes generadas mediante IA es complementar la interfaz, no presentar contenido ficticio como si fuera información geográfica real.

---

## Uso de Inteligencia Artificial durante el desarrollo

La Inteligencia Artificial se ha utilizado como herramienta de apoyo durante diferentes fases del proyecto para:

- resolver dudas técnicas;
- revisar fragmentos de código;
- analizar posibles errores;
- mejorar documentación;
- revisar decisiones de implementación;
- generar determinados recursos visuales.

Durante la fase final del proyecto se utilizó **OpenAI Codex para realizar una revisión global del código**.

Esta revisión sirvió para localizar posibles errores, problemas de consistencia, situaciones límite y oportunidades de mejora antes del cierre del proyecto.

Las correcciones seleccionadas fueron posteriormente revisadas e implementadas de forma consciente dentro del proyecto.

---

## Decisiones técnicas

### React sin backend

Para esta versión se decidió mantener TrailScope como aplicación frontend.

El objetivo principal del proyecto era profundizar en React, interfaces, APIs y experiencia de usuario antes de añadir una infraestructura backend innecesaria para su alcance actual.

### localStorage

Para favoritos, escapadas y actividad se eligió `localStorage` como solución sencilla de persistencia.

Permite desarrollar toda la experiencia principal sin necesidad de cuentas de usuario ni base de datos.

### Datos reales mediante APIs

En lugar de utilizar una base de datos estática creada específicamente para el proyecto, TrailScope consulta fuentes externas para trabajar con información geográfica y meteorológica real.

Esto aporta mayor realismo al proyecto, aunque introduce también dependencia de servicios de terceros.

### MapLibre

MapLibre permite representar las rutas, lugares y zonas de búsqueda de forma interactiva y mantener la solución basada en tecnologías abiertas.

---

## Qué he trabajado con este proyecto

TrailScope me ha permitido reforzar especialmente:

- desarrollo de interfaces con React;
- componentes y reutilización;
- estado y efectos;
- React Router;
- consumo de APIs;
- trabajo con datos asíncronos;
- tratamiento de errores;
- transformación de datos externos;
- mapas interactivos;
- GeoJSON;
- persistencia mediante `localStorage`;
- responsive design;
- Tailwind CSS;
- organización de un proyecto frontend;
- revisión y depuración de código;
- Git y GitHub;
- toma de decisiones técnicas.

También ha sido un proyecto especialmente útil para mejorar mi autonomía al pasar de proyectos más pequeños a una aplicación con varias funcionalidades conectadas entre sí.

---

## Limitaciones actuales

TrailScope es un proyecto de portfolio y no pretende sustituir aplicaciones profesionales de senderismo o navegación.

Actualmente:

- no dispone de cuentas de usuario;
- no existe sincronización entre dispositivos;
- los datos guardados dependen del navegador;
- la disponibilidad de rutas y lugares depende de los datos existentes en OpenStreetMap;
- las consultas pueden fallar temporalmente si un servicio externo no está disponible;
- la meteorología depende del periodo de previsión disponible;
- la aplicación no debe utilizarse como herramienta de seguridad o navegación profesional en montaña.

---

## Posibles mejoras futuras

Algunas posibles evoluciones del proyecto serían:

- incorporar autenticación;
- utilizar una base de datos;
- sincronizar escapadas y favoritos entre dispositivos;
- compartir escapadas;
- mejorar los filtros de búsqueda;
- añadir más categorías de lugares;
- mejorar accesibilidad;
- ampliar información de las rutas;
- añadir tests automatizados;
- mejorar el tratamiento de respuestas asíncronas;
- evolucionar la planificación de escapadas.

Estas mejoras no forman parte del alcance actual porque el objetivo ha sido cerrar primero una versión frontend completa, funcional y presentable.

---

## Estado del proyecto

**Versión actual:** funcional y en fase final de publicación.

La aplicación será desplegada públicamente como parte de mi portfolio de desarrollo web.

---

## Autor

Proyecto desarrollado como parte de mi portfolio personal de desarrollo web y aprendizaje profesional.
