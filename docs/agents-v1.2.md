# Agents — Portafolio Jeiko Mendiguri (MLP v1.2)

## Objetivo
Construir el portafolio web personal estático de Jeiko Mendiguri Tovar (IT Recruiter & Talent Acquisition). Una página principal con anclas, páginas de detalle de proyecto, una página Eventos y una 404. Versión 1.2: sincronizada con el diseño final de Claude Design (fuente visual: `Portafolio.dc.html`, `Proyecto.dc.html`, `Eventos.dc.html`, `404.dc.html`, `Sistema.dc.html`). Astro en modo estático, contenido en archivos, desplegado en Cloudflare Pages. Sin backend, sin base de datos y sin formularios.

## Alcance
| RF | Enunciado |
|---|---|
| RF-01 | Hero: saludo, nombre, titular con degradado, tagline, descripción, foto circular en marco de vidrio, chips de sectores, CTAs «Ver proyectos» y «Escribir por WhatsApp» (IX-03). Implementa solo la variante «Original»; las cifras van en Sobre mí |
| RF-02 | Sobre mí + cifras + evolución de 5 nodos unidos por «+» (Psicología → Recruiting → IT Recruiting → Data → Tecnología) |
| RF-03 | 4 áreas profesionales |
| RF-04 | 4 franjas estáticas: Gestión, Fuentes de reclutamiento, Data e IA, IA en proceso de selección (scroll horizontal manual). La franja IA usa tarjetas con título, descripción y nivel |
| RF-05 | Experiencia agrupada por sector + bloque secundario de Psicología clínica |
| RF-06 | Tarjetas de proyectos completas enlazadas: portada (captura o marcador con leyenda), estado, resumen, stack y «Ver detalle» |
| RF-07 | Página de detalle por proyecto: encabezado, carrusel de capturas (IX-09), índice lateral ≥ 1024 px, secciones en tarjetas sólidas, diagrama y cuadrícula de entidades; secciones vacías ocultas |
| RF-08 | Cómo trabajo (5 pasos) |
| RF-09 | Evaluación psicológica y competencias |
| RF-10 | Formación (programa, institución, periodo, estado) e idiomas |
| RF-11 | 7 certificados de curso (miniatura + diálogo, horizontal o vertical) y 4 constancias laborales (solo texto) |
| RF-12 | Publicaciones de LinkedIn como tarjetas con enlace |
| RF-13 | Contacto: correo, teléfono (clic copia), WhatsApp, LinkedIn y ubicación. Sin descarga de CV |
| RF-14 | Navbar fija con anclas, botón «Eventos», menú móvil, View Transitions |
| RF-15 | SEO, Open Graph, sitemap, robots |
| RF-16 | 404 |
| RF-17 | Cloudflare Web Analytics (sin cookies) |
| RF-18 | Todo el contenido en colecciones validadas |
| RF-19 | Página `/eventos` con galería de 5 fotos |

## Fuera de alcance (NO implementar)
Formulario de contacto · descarga de CV (retirada en v1.2) · variantes A y B del hero (solo se implementa «Original») · testimonios · blog · multidioma · CMS o panel de administración · base de datos o API · animaciones (scroll reveal, paralaje, marquee, contadores, gradientes animados) · logos de empleadores · imágenes de constancias laborales · formación de piloto aéreo · demos interactivas con backend · cookies o banner.

## Stack obligatorio
| Capa | Tecnología |
|---|---|
| Framework | Astro, última estable, `output: 'static'` |
| Transiciones | `<ClientRouter />` de `astro:transitions` |
| Estilos | CSS propio con variables (sección Design tokens). Sin Tailwind ni librerías de UI |
| Contenido | Content Collections (`src/content.config.ts`) con esquemas Zod |
| Imágenes | `astro:assets` (`<Image>` / `<Picture>`, AVIF + WebP) |
| Iconos | Lucide (`@lucide/astro` o SVG inline). LinkedIn y GitHub: Simple Icons (CC0) si Lucide no los incluye. No uses fuentes de iconos por CDN |
| Logos | SVG de Simple Icons (CC0) en `src/assets/logos/`; si la marca no existe, chip de texto |
| Fuente | `@fontsource-variable/plus-jakarta-sans` (o `@fontsource/plus-jakarta-sans` 400/500/600/700) |
| SEO | `@astrojs/sitemap` |
| Hosting | Cloudflare Pages (Git, rama `main`, build `npm run build`, salida `dist`) |
| Analítica | Cloudflare Web Analytics (snippet condicionado a `PUBLIC_CF_ANALYTICS_TOKEN`) |
| Testing | `astro check`, Playwright, `@axe-core/playwright`, Lighthouse CI |

Verifica la última versión de cada dependencia al instalar; no fijes versiones de memoria.

## Estructura de carpetas
```
/
├─ public/
│  ├─ og/og-default.png                   # 1200×630
│  ├─ favicon.svg                         # monograma JM
│  ├─ robots.txt
│  └─ _headers
├─ src/
│  ├─ assets/{photo/, certificates/, projects/, posts/, events/, logos/}
│  ├─ content/
│  │  ├─ projects/*.md
│  │  └─ posts/*.json (o posts.json)
│  ├─ data/  profile.json · areas.json · tools.json · experience.json · method.json · assessments.json · education.json · languages.json · certificates.json · events.json
│  ├─ content.config.ts
│  ├─ components/  Navbar · Footer · Button · GlassCard · SectionHeader · Badge · Chip · ToolStrip · Timeline · ProjectCard · CertificateCard · CertificateDialog · PostCard · StatCard · SolidCard · AiToolCard · EvolutionChain · ImageCarousel · ProjectToc · ArchDiagram · EntityGrid · ContactRow · EventTile
│  ├─ sections/    Hero · About · Areas · Tools · Experience · Projects · Method · Assessments · Education · Certificates · Posts · Contact · EventsGallery
│  ├─ layouts/     BaseLayout.astro (head, SEO, ClientRouter, analítica)
│  ├─ pages/       index.astro · proyectos/[slug].astro · eventos.astro · 404.astro
│  └─ styles/      tokens.css · global.css
├─ tests/          e2e/*.spec.ts · privacy-scan.mjs
├─ astro.config.mjs
└─ package.json
```

## Modelo de datos (colecciones; todas con esquema Zod, build falla si no valida)
| Colección | Campos (tipo) | Restricciones |
|---|---|---|
| profile | name, greeting, headline, gradientWord, tagline, description, about: string[], evolution: string[5], stats: {value,label}[3], sectors: string[5], photo: image, photoAlt, contact: {email, phoneDisplay, phoneE164, whatsappUrl, linkedinUrl, location}, navSubtitle | stats según RN-05 |
| areas | id, title, description, icon (nombre Lucide), order | exactamente 4 |
| tools | name, group: 'gestion'\|'fuentes'\|'data-ia'\|'ia-seleccion', subgroup?: 'redes'\|'hunting'\|'bolsas'\|'bases', logo?: string, description?: string (obligatorio en ia-seleccion, máx. 120 car.), level?: 'Experiencia profesional'\|'Uso práctico'\|'Intermedio'\|'Fundamentos'\|'En aprendizaje', order | `level` obligatorio si group = 'data-ia' o 'ia-seleccion' |
| experience | id, company, role, start (YYYY-MM), end?: YYYY-MM, current: bool, sector, highlights: string[], secondary: bool, order | role y fechas según CV (RN-09) |
| projects | title, slug, status: 'Idea'\|'Prototipo'\|'En desarrollo'\|'Terminado', summary, problem, solution, stack: string[] (tarjeta), stackDetail?: string[] (encabezado de P-02), cover?: image, coverAlt?, coverNote? (leyenda del marcador sin captura), screenshots?: {image, label}[], diagram?: 'arquitectura-nube'\|'arquitectura-local', entities?: {name, fields[]}[], repoUrl?: url, demoUrl?: url, featured: bool, order; cuerpo MD con `##` opcionales: Contexto, Objetivo, Usuarios, Solución, Arquitectura, Modelo de datos, Tecnologías, Seguridad y privacidad, Calidad y pruebas, Decisiones y dificultades, Resultado, Siguientes mejoras | slug único; capturas solo con datos ficticios |
| method | step (01–05), title, description | exactamente 5 |
| assessments | group: 'Entrevista'\|'Proyectivas'\|'Psicométricas'\|'Evaluación grupal'\|'Incorporación', name, description | — |
| education | institution, program, period, status: 'En curso'\|'Licenciado'\|'Completado' | — |
| languages | name, level | — |
| certificates | type: 'curso'\|'constancia'; curso → title, issuer, date, hours, category: 'Data'\|'RR. HH. y legal'\|'Psicología'\|'Inclusión', image: image, imageAlt, orientation: 'horizontal'\|'vertical'; constancia → company, role, period | `image` y `orientation` prohibidos si type = 'constancia' |
| posts | title, summary (≤ 160 car.), date, url (linkedin.com), cover: image (4:5), coverAlt | 0..n |
| events | image: image, alt (sin empresas ni productos, RN-12), focus (object-position, p. ej. `50% 70%`), order | exactamente 5 |

## Contenido inicial (cargar tal cual)
**profile**
- greeting: "Hola, soy" · name: "Jeiko Mendiguri" · headline: "IT Recruiter & Talent Acquisition" (degradado en "Talent Acquisition") · tagline: "Psicología, datos y tecnología aplicados a la selección de talento."
- description: "Combino experiencia en reclutamiento de distintos sectores —con foco en perfiles TI— con conocimientos de bases de datos, análisis de información e inteligencia artificial. Me interesa convertir necesidades de selección en procesos más claros, medibles y eficientes."
- about: ["Soy psicólogo organizacional y profesional de Talent Acquisition con experiencia en procesos de reclutamiento y selección end to end para distintos sectores: entrevistas por competencias, assessment centers y pruebas psicométricas.", "Hoy mi foco es IT Recruiting. En paralelo estudio Ciencia de Datos en ISIL y desarrollo proyectos que conectan recruiting, bases de datos e IA.", "Mi objetivo es unir la comprensión de las personas con herramientas que ayuden a organizar la información, decidir mejor y optimizar el trabajo."]
- evolution: Psicología · Recruiting · IT Recruiting · Data · Tecnología
- stats: 4+ "años en selección" · 6 "organizaciones" · 5 "sectores"
- sectors: Tecnología · Retail y ferretería · Gastronomía · Educación · Consultoría
- contact: email jeikomt1997@gmail.com · phoneDisplay "+51 948 331 981" · phoneE164 "+51948331981" · whatsappUrl (IX-03) · linkedinUrl https://www.linkedin.com/in/jeiko-mendiguri-tovar-812624232 · location "San Miguel, Lima"
- navSubtitle: "Psicólogo organizacional" (se muestra bajo el nombre en la navbar)

**areas**
| Título | Descripción | Icono |
|---|---|---|
| Talent Acquisition | Reclutamiento end to end, sourcing, hunting, gestión de vacantes en ATS y seguimiento de indicadores. | users |
| Psicología organizacional | Entrevistas por competencias, assessment centers y administración e interpretación de pruebas. | clipboard-list |
| Data y bases de datos | Consultas SQL, modelado de datos y análisis con Excel y Power BI. | database |
| Tecnología e IA | Desarrollo asistido por IA, documentación y diseño de soluciones para procesos de selección. | sparkles |

**tools**
- gestion: Excel · Word · PowerPoint · Outlook · Teams · ATS · Canva · Pulso Salud · Clínica Doktuz (agenda de EMO) · Verificación de antecedentes · Evaluación de riesgo crediticio
- fuentes · redes: Grupos de Facebook · Grupos de WhatsApp · Grupos de LinkedIn · Publicaciones de convocatoria en LinkedIn · GitHub
- fuentes · hunting: LinkedIn · Bumeran · Pandapé
- fuentes · bolsas: Bumeran · Computrabajo · Pandapé · LinkedIn
- fuentes · bases: Bases de procesos anteriores
- data-ia: Excel (Intermedio) · SQL Server (Intermedio) · Power BI (Intermedio) · Python (Intermedio) [S, DP-11]
- ia-seleccion (tarjetas: título · descripción · nivel):
  - Claude Desktop · Análisis de vacantes, redacción de perfiles y publicaciones, y comparación de documentos en una conversación. · Uso práctico
  - Claude Code · Desarrollo de herramientas propias y de este portafolio con apoyo de IA desde la terminal. · Uso práctico
  - Conexión con MCP · Conexión de herramientas externas a Claude para consultar datos y ejecutar tareas desde la conversación. · En aprendizaje
  - Skill de ranking · Compara CVs contra un perfil con una rúbrica de 0 a 100 y genera un shortlist con justificación. · Uso práctico
  - Skill de análisis de perfil · Convierte una vacante en un brief estructurado, detecta vacíos y clasifica requisitos. · Uso práctico
  - Skill de publicaciones · Adapta un mismo perfil al formato de cada bolsa de empleo. · Uso práctico
  - Skill de fichas de candidato · Prepara presentaciones sin datos personales para compartir con el cliente. · Uso práctico

**experience** (sector → orden; cargos y fechas del CV)
| Empresa | Cargo | Periodo | Sector | Highlights |
|---|---|---|---|---|
| GrowBy | IT Recruiter | 2026-04 – actual | Tecnología | Selección de perfiles TI para clientes nacionales e internacionales · Administración del ATS · Seguimiento de time-to-fill y efectividad de fuentes · Mentoring de 2 practicantes |
| Canvia | IT Recruiter | 2025-07 – 2026-03 | Tecnología | Selección TI end to end: kick-off, EMO, antecedentes y contratación · Hunting en LinkedIn, Bumeran y Computrabajo · Flujograma del proceso para capacitación |
| Delibakery | Asistente de Recursos Humanos | 2025-01 – 2025-04 | Gastronomía | Assessment center para puestos administrativos · Pruebas proyectivas y psicométricas · Reclutamiento de cocina, salón y producción |
| Manpower Group | Auxiliar de Reclutamiento | 2024-08 – 2024-12 | Retail y ferretería | Base de más de 400 candidatos · Ferias laborales municipales · Contenido para difundir ofertas |
| Innova Scientific | Auxiliar de RR. HH. | 2022-11 – 2023-02 | Educación | Más de 20 vacantes operativas, comerciales y administrativas · Más de 30 pruebas aplicadas · Inducción |
| DS Consultores | Practicante de RR. HH. | 2022-06 – 2022-11 | Consultoría | Base de más de 600 candidatos · Preselección curricular · Más de 40 pruebas aplicadas |
| Hospital Central PNP Luis N. Sáenz | Practicante de Psicología Clínica | 2023-08 – 2024-07 | Salud (secondary: true) | Atención en neuropsicología, consulta externa y hospitalización · Aplicación de WISC, WAIS, Vineland, Neuropsi y MoCA |

**projects** (estados [S], DP-07)
| slug | Título | Estado | Resumen | Stack |
|---|---|---|---|---|
| interviewnotes | InterviewNotes | En desarrollo | App web para gestionar procesos, preguntas de entrevista, candidatos e informes asistidos por IA. | React · Supabase · Cloudflare · IA |
| transcriptor-markdown | Transcriptor Markdown | Prototipo | Web app local que transcribe audio y video a Markdown en tu computadora, con traducción opcional y sin enviar datos a internet. | FastAPI · faster-whisper · NLLB-200 |
| recruitment-analytics-database | Recruitment Analytics Database | En desarrollo | Base de datos ficticia para analizar fuentes, etapas y tiempos de cobertura con SQL. | SQL Server · Modelado ER |
| talent-hub | Talent Hub | Idea | Repositorio de candidatos para centralizar CV y facilitar búsquedas futuras con revisión humana. | Por definir |
| dashboard-recruiting | Dashboard de recruiting | Idea | Panel de indicadores de selección construido con datos sintéticos. | Power BI · Excel |
Portadas: `interviewnotes-procesos.png` (InterviewNotes) y `transcriptor-portada.png` (Transcriptor Markdown); los otros tres usan marcador con leyenda («diagrama ER · datos ficticios», «diagrama del concepto · datos ficticios», «boceto del panel · datos ficticios»). `problem` y `solution` de cada proyecto = primer párrafo de Contexto y de Solución del detalle.

**projects — contenido de detalle** (fuente: diseño final; copiar tal cual; DP-06, DP-10):

#### interviewnotes — InterviewNotes (En desarrollo)
- stack (detalle): React + TypeScript · Supabase · Cloudflare · Gemini · Workers AI · Culqi
- diagrama (sección Arquitectura): arquitectura-nube
- entidades (sección Modelo de datos): processes [id, user_id, code, puesto] · forms [id, process_id, questions] · candidates [id, process_id, cv_path] · interviews [id, candidate_id, answers] · subscriptions [id, user_id, plan_id] · ai_usage [id, user_id, skill]
- resumen: App web para reclutadores: del JD a las preguntas, de las respuestas al informe, en una sola herramienta y con IA que nunca decide por el reclutador.
- portada sin captura: captura de la app
- capturas (carrusel, en orden): Procesos → interviewnotes-procesos.png · Detalle de proceso → interviewnotes-detalle-proceso.png · Entrevista → interviewnotes-entrevista.png · Métricas → interviewnotes-metricas.png
- **Contexto**: InterviewNotes nació como un MVP local: React con IndexedDB en el navegador y un proxy en Node para la IA. Los datos vivían en un solo equipo, no había cuentas ni forma de cobrar, y la IA dependía de una máquina local con Ollama.
- **Objetivo**: Convertir la herramienta en un SaaS por suscripción, accesible desde cualquier equipo y desplegado a costo cero o casi cero, con un cupo de IA por usuario.
- **Usuarios**: Reclutadores suscriptores, que solo ven y editan sus propios datos y la usan a diario desde desktop. ¶ Administradores del producto, que gestionan usuarios, planes, suscripciones y el uso de IA.
- **Solución**: El reclutador crea un proceso, genera las preguntas desde el JD, registra a los candidatos y toma notas durante la entrevista. La IA propone un resumen y un borrador de conclusión, que siempre se pueden editar. ¶ El producto suma cuentas con correo o Google, suscripción mensual con tarjeta o Yape, panel de administración, tema claro y oscuro, y exportación a PDF, DOCX, XLSX y CSV.
- **Arquitectura** [arch]: Monolito modular: la SPA lee y escribe directo en Supabase, protegida con RLS, sin backend propio para datos. Las Pages Functions existen solo para lo que exige secretos: la IA, los cobros y el webhook de pagos.
- **Modelo de datos** [model]: Entidades principales del flujo de selección y de la suscripción, en Postgres. Cada tabla tiene RLS para que un usuario no vea los datos de otro.
- **Tecnologías**: React 18 con TypeScript, Vite y Tailwind en el frontend. Supabase para autenticación, base de datos y archivos. Cloudflare Pages y Pages Functions para hosting y API. Gemini y Workers AI para la IA, Culqi para los pagos, Resend para correos y Vitest para pruebas.
- **Decisiones y dificultades**: Toda salida de IA es un borrador editable. Un validador revisa que cada respuesta del candidato aparezca en el resumen; si falla, se reintenta con otro modelo. ¶ Se eliminó Ollama y cada tarea de IA tiene un modelo principal y uno de respaldo en la nube. El cupo gratuito de Workers AI se comparte entre usuarios, por eso se fijó un límite mensual por acción. ¶ A la IA solo viajan el puesto, las preguntas, las respuestas y el JD; nunca el teléfono, el correo ni el CV del candidato.
- **Resultado**: El MVP local funciona. La especificación del SaaS va en la versión 1.19 y el desarrollo avanza por fases.
- **Siguientes mejoras**: Fases del roadmap: base en Supabase; cuentas y datos en la nube; IA en la nube con cupo; landing, cobro y panel de administración; mejoras de producto; nueva interfaz y despliegue; dashboard del usuario y soporte.

#### transcriptor-markdown — Transcriptor Markdown (Prototipo)
- stack (detalle): Python · FastAPI · faster-whisper · NLLB-200 · ffmpeg
- resumen: Web app local que transcribe audio y video a Markdown en tu computadora, con traducción opcional y sin enviar ningún dato a internet.
- portada sin captura: captura de la app
- diagrama (sección Arquitectura): arquitectura-local
- capturas (carrusel, en orden): Pantalla principal → transcriptor-portada.png · Selector de idioma → transcriptor-idioma.png · Traducción en curso → transcriptor-a.png · Transcripción completada → transcriptor-b.png
- entidades (sección Modelo de datos): Job (memoria) [id, status, phase, progress] · Job · archivo [original_name, duration_s, size_bytes] · Job · idioma [detected_language, target_language, translated] · Job · resultado [paragraphs, result_text, error_code] · calibracion.json [model, rtf_samples] · Idioma (constante) [code, name_es, nllb_code]
- **Contexto**: Transcribir un audio o video con fidelidad suele implicar pagar un servicio en la nube y entregarle contenido que puede ser sensible. La idea original fue cargar un archivo con drag and drop y obtener su texto en formato Markdown, íntegro y fiel al original.
- **Objetivo**: Validar que una transcripción local, gratuita y privada sea lo bastante fiel para uso real: costo recurrente de 0 USD, fidelidad medida contra un set de evaluación propio y ningún dato fuera del equipo.
- **Usuarios**: Una sola persona que usa la app en su computadora con Windows, sin cuentas ni login. Es una herramienta de uso personal; el servidor solo escucha en 127.0.0.1.
- **Solución**: El usuario suelta un audio o video, elige el idioma del texto y pulsa Transcribir. Se muestran el avance y el tiempo restante, y se puede cancelar. Al terminar descarga un .md con solo el texto, en párrafos y sin muletillas, o lo guarda como Word, PDF, HTML o texto desde la ventana nativa Guardar como. ¶ El idioma del audio se detecta siempre solo. Si el usuario elige otro idioma, el texto se traduce de forma local. Los archivos y el resultado se borran al terminar, sin historial.
- **Arquitectura** [arch2]: Monolito modular: un proceso Python con FastAPI sirve la página estática y la API, y ejecuta la transcripción en un hilo. No hay base de datos, colas ni microservicios, porque es un solo usuario y un trabajo a la vez. El progreso se consulta por polling cada segundo.
- **Modelo de datos** [model]: No hay base de datos. El trabajo vive en memoria y los archivos temporales en una carpeta que se vacía al arrancar. Solo se guarda en disco un JSON de calibración con números, sin contenido del usuario.
- **Tecnologías**: Python con FastAPI y uvicorn en el backend; faster-whisper para la transcripción (modelo large-v3-turbo en int8, con procesamiento por lotes); NLLB-200 sobre CTranslate2 para la traducción; ffmpeg y ffprobe para leer y convertir el audio. La exportación usa python-docx y fpdf2 con fuentes Noto. La interfaz es HTML, CSS y JavaScript sin framework, con Instrument Serif y Barlow locales, y pruebas con pytest y jiwer.
- **Seguridad y privacidad**: Ningún dato sale del equipo: solo hay una descarga única de los modelos desde Hugging Face. Se rechazan peticiones de otros orígenes, los nombres de archivo se sanean, ffmpeg se llama sin shell y el texto transcrito nunca se escribe en los logs.
- **Calidad y pruebas**: Pruebas unitarias del post-proceso con cobertura mínima de 80 %, pruebas de integración de la API y un benchmark que mide WER, velocidad y memoria con y sin lotes sobre audios propios. Meta de fidelidad: WER de 10 % o menos con audio claro en español.
- **Decisiones y dificultades**: La limpieza de texto es determinista y solo quita vocalizaciones sin significado de una lista cerrada; ningún modelo de lenguaje reescribe el contenido. El equipo no tiene GPU, así que se eligió large-v3-turbo en int8 y lotes para ganar velocidad sin perder precisión. ¶ La traducción se hace por oraciones y conserva el número de párrafos. Su licencia (CC-BY-NC) permite uso personal; si el producto se comercializa hay que cambiar el traductor.
- **Resultado**: Prototipo en construcción. La especificación va en la versión 1.4 y la interfaz ya está diseñada y aprobada; el desarrollo avanza por fases.
- **Siguientes mejoras**: Fases del roadmap: base del proyecto; motor, lotes y traducción; API de trabajos y exportación; integración de la interfaz; validación con una transcripción real de más de 2 horas.

#### talent-hub — Talent Hub (Idea)
- stack (detalle): Por definir
- resumen: Repositorio de candidatos para centralizar CV y facilitar búsquedas futuras con revisión humana.
- portada sin captura: diagrama del concepto · datos ficticios
- **Contexto**: Los CV de procesos anteriores suelen quedar dispersos y es difícil volver a encontrarlos cuando se abre una vacante similar.
- **Objetivo**: Centralizar los CV en un repositorio ordenado que facilite búsquedas futuras.
- **Solución**: Un repositorio con etiquetas y filtros, donde cada coincidencia se valida con revisión humana antes de contactar al candidato.

#### recruitment-analytics-database — Recruitment Analytics Database (En desarrollo)
- stack (detalle): SQL Server · Modelado ER
- resumen: Base de datos ficticia para analizar fuentes, etapas y tiempos de cobertura con SQL.
- portada sin captura: diagrama ER · datos ficticios
- **Contexto**: Pendiente de documentar.
- **Objetivo**: Analizar fuentes, etapas y tiempos de cobertura con SQL.
- **Solución**: Base de datos ficticia modelada en SQL Server.

#### dashboard-recruiting — Dashboard de recruiting (Idea)
- stack (detalle): Power BI · Excel
- resumen: Panel de indicadores de selección construido con datos sintéticos.
- portada sin captura: boceto del panel · datos ficticios
- **Contexto**: Pendiente de documentar.
- **Objetivo**: Visualizar indicadores de selección.
- **Solución**: Panel en Power BI con datos sintéticos preparados en Excel.

- **Regla:** Recruitment Analytics Database y Dashboard de recruiting traen «Pendiente de documentar.» en Contexto: no publiques ese texto, oculta la sección hasta tener contenido (CA-07). Los botones «Ver repositorio» y «Ver demo» del diseño apuntan a marcadores (`github.com`, `#`): no los publiques (IX-08, RN-04).
- **Diagramas** (aria-label obligatorio): arquitectura-nube = «la SPA en React habla directo con Supabase (Auth, Postgres con RLS y Storage); para IA y pagos llama a Cloudflare Pages Functions, que conectan con Gemini, Workers AI y Culqi»; arquitectura-local = «el navegador habla con FastAPI en 127.0.0.1; FastAPI usa un gestor de trabajos en memoria que ejecuta ffmpeg, faster-whisper, el post-proceso, NLLB-200 y el exportador; los modelos se descargan una sola vez de Hugging Face».

**method**: 01 Entender · 02 Diseñar el proceso · 03 Ejecutar y evaluar · 04 Analizar · 05 Optimizar (descripciones del plan §10).

**assessments**
| Grupo | Nombre |
|---|---|
| Entrevista | Entrevistas por competencias (STAR) · Entrevistas grupales presenciales y virtuales |
| Evaluación grupal | Assessment center para posiciones ejecutivas y mandos medios |
| Proyectivas | Persona bajo la lluvia · Test de Wartegg |
| Psicométricas | Administración e interpretación de pruebas psicométricas |
| Incorporación | Onboarding e inducción · T-Registro y afiliación al sistema de pensiones |

**education**: Ciencia de Datos — ISIL — Ago. 2025 – actualidad — En curso (remoto) · Psicología — Universidad Tecnológica del Perú — 2018–2024 — Licenciado [S, DP-11].
**languages**: Español (nativo) · Inglés (intermedio) · Lengua de señas peruana (certificada).

**certificates**
| Tipo | Título / Cargo | Emisor / Empresa | Fecha / Periodo | Horas | Categoría |
|---|---|---|---|---|---|
| curso | Microsoft Power BI | WE Educación Ejecutiva | Ago. 2026 | 30 | Data |
| curso | SQL Server for Analytics | WE Educación Ejecutiva | Jul. 2026 | 30 | Data |
| curso | Excel 2019 Básico | Cibertec | Mar. 2021 | 16 | Data |
| curso | Excel 2019 Intermedio | Cibertec | Set. 2021 | 32 | Data |
| curso | Gestión de Riesgo Psicosocial, Factores y Consecuencias | DS Consultores | Oct. 2022 | 4 | Psicología |
| curso | Legislación Laboral y Gestión de Compensaciones | ISIL | Abr.–May. 2023 | 24 | RR. HH. y legal |
| curso | Lengua de Señas Peruana (4 niveles) | Enseñas Perú | Oct. 2019 | 256 | Inclusión |
| constancia | IT Recruiter | Canvia | Jul. 2025 – Mar. 2026 | — | — |
| constancia | Asistente de Recursos Humanos | Delibakery | Ene. – Abr. 2025 | — | — |
| constancia | Auxiliar de Reclutamiento | Manpower Group | Ago. – Dic. 2024 | — | — |
| constancia | Practicante de RR. HH. | DS Consultores | Jun. – Nov. 2022 | — | — |

**certificates — presentación:** orden de visualización más reciente primero (Power BI, SQL Server for Analytics, Legislación Laboral, Riesgo Psicosocial, Excel Intermedio, Excel Básico, Lengua de Señas). `power-bi` y `sql-server-analytics` son verticales (A4: recorte superior en la miniatura, diálogo de 420 px de ancho); el resto, horizontales (1.414:1). Archivos del diseño: `assets/certs/{power-bi, sql-server-analytics, legislacion-laboral, riesgo-psicosocial, excel-intermedio, excel-basico, lengua-de-senas}.png`; verifica RN-01 (DP-04).

**posts** (2; DP-03):
| Fecha | Título | Resumen | URL | Portada |
|---|---|---|---|---|
| 23 set. 2026 | MCP: conecta la IA con tus datos y herramientas | Guía rápida en 11 diapositivas sobre el Model Context Protocol: arquitectura, primitivas y ejemplos. | https://www.linkedin.com/posts/jeiko-mendiguri-tovar-812624232_arquitectura-mcp-activity-7508556203359207424-K0PH | post-mcp-arquitectura.png |
| 24 set. 2026 | Conecta un MCP a tu agente de IA | Paso a paso en Claude Desktop: desde encontrar el servidor hasta usarlo en tu primer chat. | https://www.linkedin.com/posts/jeiko-mendiguri-tovar-812624232_conectando-mcp-a-agente-de-ia-activity-7508888672990048256-cXAV | post-mcp-claude-desktop.png |

**events** (5; DP-09). Alt neutros (reemplazan a los del diseño que nombran empresa o producto):
| # | Archivo | Alt | focus |
|---|---|---|---|
| 1 | eventos-1.jpg | Equipo reunido frente al letrero de la oficina | 50% 70% |
| 2 | eventos-2.jpg | Equipo sentado alrededor de una mesa con un pastel | 50% 72% |
| 3 | eventos-3.jpg | Almuerzo del equipo en un restaurante | 50% 55% |
| 4 | eventos-4.jpg | Asistentes a un evento frente a una pantalla | 50% 62% |
| 5 | eventos-5.png | Tres asistentes en un evento corporativo | 50% 68% |

## Reglas de negocio
- RN-01 Nunca publicar DNI, dirección, firmas de terceros, códigos de certificado, RUC ni datos de candidatos/clientes.
- RN-02 Niveles solo con palabras (5 categorías: Experiencia profesional · Uso práctico · Intermedio · Fundamentos · En aprendizaje); sin porcentajes ni barras.
- RN-03 Todo proyecto muestra badge de estado.
- RN-04 Capturas solo con datos ficticios; sin métricas no medidas.
- RN-05 Cifras: 4+ / 6 / 5.
- RN-06 Constancias: solo texto + "Constancia disponible a solicitud".
- RN-07 Sin nombres de clientes de GrowBy o Canvia.
- RN-08 Ningún texto de contenido dentro de componentes.
- RN-09 Cargos y fechas tal como el CV.
- RN-10 Enlaces externos: `target="_blank" rel="noopener noreferrer"`.
- RN-11 Las tarjetas de la franja IA describen funciones; no mencionan empresas, clientes ni procesos.
- RN-12 Eventos: alt y leyendas sin nombres de empresas, clientes ni productos, ni pantallas legibles; solo fotos con autorización de las personas (DP-09).

## API / acciones
No hay API. Acciones = archivos estáticos, enlaces y un diálogo en cliente (ver contrato).

## Pantallas
| ID | Ruta | Rol | Contenido |
|---|---|---|---|
| P-01 | `/` | Visitante | Navbar → Hero (#inicio) → Sobre mí (#sobre-mi) → Áreas → Herramientas y fuentes (#herramientas) → Experiencia (#experiencia) → Proyectos (#proyectos) → Cómo trabajo → Evaluación → Formación e idiomas → Certificados (#certificados) → Publicaciones → Contacto (#contacto) → Footer |
| P-02 | `/proyectos/[slug]` | Visitante | Volver a proyectos · badge de estado · título · resumen · stack · carrusel de capturas (o marcador con leyenda) · índice «En esta página» (≥ 1024 px) · secciones con contenido en tarjetas sólidas · IX-08 |
| P-03 | `/404` | Visitante | "Esta página no existe." · "Volver al inicio" |
| P-04 | `/eventos` | Visitante | Eyebrow «EVENTOS» · H1 «Eventos corporativos» · galería 4:3 (5 fotos) · «Volver al portafolio» |

Navbar (P-01): monograma JM + «Jeiko Mendiguri» / «Psicólogo organizacional» · Sobre mí · Experiencia · Proyectos · Herramientas · Certificados · Contacto · botón «Eventos» (icono `images`, enlaza a `/eventos`). En < 1024 px los enlaces se ocultan y quedan «Eventos» y el botón «Menú» (`aria-expanded`, `aria-controls="menu-movil"`; abre un panel con los 6 enlaces; cierra con Esc y al elegir un enlace). P-02: monograma + botón «Eventos». P-04: monograma + botón «Inicio» (icono `house`). P-03: sin navbar.

**Comportamientos de diseño:** hero «Original»: texto a la izquierda y foto circular (`foto-jeiko.webp`) en marco de vidrio con acentos decorativos estáticos, sin tarjetas flotantes; «Sectores» debajo. Anclas con `scroll-margin-top` 104 px. P-02: «Volver a proyectos» enlaza a `/#proyectos` y, si el visitante viene de P-01, usa `history.back()` para conservar el scroll [R]; índice sticky a 112 px (columna de 220 px + lectura de 720 px). Carrusel: relación 16/10, fondo `color.media-stage`, imagen `contain`, flechas laterales (ocultas hasta hover o foco), contador «n / N», puntos (activo de 24 px), leyenda «Pantalla: {label}»; teclas ← y →; capturas inactivas con `aria-hidden`. Sin capturas: marcador 21/9 (4/3 en móvil) con leyenda y la nota «Datos ficticios». Contacto: fila Teléfono copia el número (IX-05); fila Ubicación sin enlace.

## Contrato frontend ↔ backend
| ID | Elemento UI (P-xx / sección) | Acción | Endpoint / servicio | Datos enviados | Éxito → mensaje UI | Error (code) → mensaje UI | Origen |
|---|---|---|---|---|---|---|---|
| IX-01 | — | Retirado en v1.2: el diseño final no incluye descarga de CV (ADR-05, DP-01). Se conserva el ID para no renumerar | — | — | — | — | DP-01 |
| IX-02 | P-01 Contacto · «jeikomt1997@gmail.com» | Abrir correo | `mailto:jeikomt1997@gmail.com` | — | Se abre el cliente de correo | — | RF-13, CV |
| IX-03 | P-01 Hero («Escribir por WhatsApp») y Contacto («WhatsApp») | Abrir chat (pestaña nueva) | `https://wa.me/51948331981?text=Hola%20Jeiko%2C%20vi%20tu%20portafolio%20y%20me%20gustar%C3%ADa%20conversar.` | Mensaje prellenado [S] | Se abre WhatsApp | — | RF-01, RF-13, CV |
| IX-04 | P-01 Contacto y footer · "LinkedIn" | Abrir perfil | `https://www.linkedin.com/in/jeiko-mendiguri-tovar-812624232` (pestaña nueva) | — | Se abre LinkedIn | — | RF-13, CV |
| IX-05 | P-01 Contacto · «+51 948 331 981» | Copiar teléfono | Cliente: `navigator.clipboard.writeText("+51948331981")` con método alternativo; el enlace conserva `tel:+51948331981` si el script no carga | — | Etiqueta «Teléfono · Copiado» e icono de verificación durante 2 s | Sin permiso: método alternativo; sin mensaje de error | RF-13, CV |
| IX-06 | P-01 Certificados · "Ver certificado" | Ampliar imagen | Cliente: `<dialog>` nativo | — | Diálogo con imagen y "Cerrar" | IMG_LOAD_ERROR → "No se pudo cargar la imagen del certificado." | RF-11, brief |
| IX-07 | P-01 Publicaciones · "Ver en LinkedIn" | Abrir post | URL del post (pestaña nueva) | — | Se abre el post | — | RF-12, brief |
| IX-08 | P-02 · "Ver repositorio" / "Ver demo" | Abrir enlace | URL del proyecto (pestaña nueva); solo se renderiza si existe | — | Se abre el enlace | — | RF-07 |
| IX-09 | P-02 Carrusel de capturas · flechas, puntos, teclas ← → | Cambiar captura | Cliente: estado local, sin red | — | Se muestra la captura elegida, contador «n / N» y leyenda «Pantalla: …» | — | RF-07 |

Implementa cada fila tal cual. IX-01 está retirado: no agregues botón ni archivo de CV ni comprobación en el build. IX-05: `preventDefault` solo si el script cargó; la etiqueta vuelve a «Teléfono» a los 2 s. IX-06: `showModal()`, cierre con Esc y botón «Cerrar», foco devuelto al disparador, `onerror` de la imagen muestra el mensaje exacto. IX-09: botones con `aria-label` «Imagen anterior» / «Imagen siguiente» y puntos con `aria-label` «Ir a {label}». No agregues acciones fuera del contrato.

## Design tokens
Estilo E06 Aurora/Glass claro en azul. Implementar en `src/styles/tokens.css` como variables CSS; no usar valores fuera de esta tabla.
| Token | Valor |
|---|---|
| color.bg | #F5F8FF |
| color.bg-glow-1 | #DBEAFE (radial estático, opacidad 0.7) |
| color.bg-glow-2 | #E0F2FE (radial estático, opacidad 0.7) |
| color.surface | rgba(255,255,255,0.72) |
| color.surface-solid | #FFFFFF |
| color.text | #0B1B3A |
| color.text-muted | #475569 |
| color.primary | #1D4ED8 |
| color.primary-soft | #E8EFFE |
| color.gradient | linear-gradient(90deg,#1D4ED8,#0EA5E9) — solo texto ≥ 24 px |
| color.btn-dark | #0B1B3A |
| color.primary-contrast | #FFFFFF |
| color.border | rgba(29,78,216,0.14) |
| color.status-idea | #475569 sobre #EEF2F7 |
| color.status-proto | #0369A1 sobre #E0F2FE |
| color.status-dev | #1D4ED8 sobre #E8EFFE |
| color.status-done | #15803D sobre #DCFCE7 |
| color.error | #B91C1C |
| color.error-soft | #FEF2F2 |
| color.text-body | #334155 |
| color.surface-strong | rgba(255,255,255,0.88) |
| color.disabled / color.disabled-text | #CBD5E1 / #475569 |
| color.media-stage | #1A1625 |
| focus.ring | 3 px sólido #1D4ED8, desfase 3 px |
| font.heading / font.body | Plus Jakarta Sans (600–700 / 400–500) |
| type.scale | 12/14/16/18/20/24/32/40/56 |
| space | Escala 4/8 px; secciones 96 px desktop / 64 px móvil; `scroll-margin-top` 104 px en anclas |
| layout.max | 1200 px; gutter 16 px móvil / 32 px desktop |
| radius.sm / md / lg / pill | 10 / 16 / 24 / 999 px |
| shadow.sm / md | 0 1px 2px rgba(11,27,58,.06) / 0 12px 32px rgba(29,78,216,.10) |
| blur.glass | backdrop-filter: blur(16px); fallback color.surface-solid con `@supports not` |
| icons | Lucide, 1.75 px, 20 px |
| motion | View Transitions fundido 200 ms ease-out; fundido 200 ms entre capturas del carrusel; hover solo color/sombra 150 ms; nada con prefers-reduced-motion |

Si el diseño aprobado en Claude Design cambia algún token, actualiza esta tabla primero. El prototipo carga Plus Jakarta Sans desde Google Fonts y Lucide desde un CDN: en producción usa Fontsource y SVG autoalojados (CSP).

## Seguridad obligatoria
- `public/_headers`: `X-Frame-Options: DENY` · `X-Content-Type-Options: nosniff` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=()` · CSP: `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; frame-ancestors 'none'` (ajusta solo si ClientRouter lo exige y documenta).
- Sin `set:html` con contenido de colecciones.
- Imágenes de certificados recortadas sin firmas ni códigos antes de añadirlas (RN-01). Fotos de eventos solo con autorización y con alt neutro (RN-12, DP-09). Capturas de proyectos solo con datos ficticios (DP-10).
- `tests/privacy-scan.mjs` sobre `dist/`: falla si encuentra `76011366`, `DNI`, `RUC` o `CCVFC`, y si el HTML de `/eventos` contiene `growby.tech` o `Ecommerce Hub`.
- Matriz de permisos: No aplica (sin usuarios).

## Orden de implementación
| Fase | Tareas | Terminado cuando |
|---|---|---|
| F0 Base | Proyecto Astro, tokens, BaseLayout con ClientRouter, Navbar, Footer, colecciones y esquemas, deploy a Cloudflare Pages | Preview en `*.pages.dev`; build falla con contenido inválido (CA-14) |
| F1 Perfil y contacto | Hero, Sobre mí, Áreas, Formación e idiomas, Contacto, IX-02–IX-05 | CA-01, CA-02, CA-12, CA-18 |
| F2 Trayectoria y credenciales | Herramientas, Experiencia, Cómo trabajo, Evaluación, Certificados (IX-06), Publicaciones (IX-07) | CA-03–CA-05, CA-09–CA-11, CA-15, CA-17 |
| F3 Proyectos y eventos | Tarjetas con portada, `/proyectos/[slug]` con carrusel (IX-09) e índice lateral, IX-08, `/eventos`, 404 | CA-06–CA-08, CA-19–CA-21 |
| F4 Calidad | SEO/OG, sitemap, robots, analítica, `_headers`, pruebas, Lighthouse | CA-13, CA-14, CA-16; Lighthouse móvil rendimiento ≥ 90, accesibilidad ≥ 95 |

## Pruebas obligatorias
- F0: `astro check`; build con un archivo inválido falla.
- F1: Playwright 360 px y 1440 px (CA-01, CA-02); WhatsApp del hero y de Contacto (CA-12); copia del teléfono con «Teléfono · Copiado» (CA-18); hrefs exactos de IX-02–IX-05.
- F2: franjas recorribles con Tab y sin overflow de página (CA-03); niveles sin porcentajes (CA-04); tarjetas de la franja IA completas y sin empresas ni clientes (CA-17); 7 entradas de experiencia (CA-05); diálogo: apertura, Esc, foco y error forzado (CA-09, CA-10); constancias sin `<img>` (CA-11); estado vacío de publicaciones (CA-15).
- F3: badge e hrefs condicionados (CA-06); sección vacía ausente (CA-07); 404 (CA-08); carrusel con teclado, contador y leyenda, e índice solo ≥ 1024 px (CA-20, CA-21); `/eventos` con 5 fotos y alt neutros (CA-19).
- F4: reduced motion sin transición (CA-13); metadatos de P-01, P-02 y P-04 y sitemap con `/eventos` (CA-16); axe sin violaciones serias en P-01 a P-04; `privacy-scan.mjs` en verde.

## Configuración
- Variables: `PUBLIC_SITE_URL`, `PUBLIC_CF_ANALYTICS_TOKEN`.
- Scripts: `dev`, `build`, `preview`, `check`, `test:e2e`, `test:privacy`.
- Sin migraciones ni seeds de BD.

## Criterios de aceptación
| ID | Dado | Cuando | Entonces |
|---|---|---|---|
| CA-01 | Pantalla de 360 px | Carga P-01 | Nombre, titular y "Ver proyectos" visibles sin scroll |
| CA-02 | P-01 cargada | Se revisan las cifras | Solo 4+ años en selección, 6 organizaciones, 5 sectores |
| CA-03 | Franja más ancha que la pantalla | Se desliza o se usa Tab | Se recorren todos los ítems sin scroll horizontal de la página |
| CA-04 | Herramienta de Data e IA | Se muestra | Etiqueta de nivel en palabras, sin porcentaje |
| CA-05 | Sección Experiencia | Se carga | 6 empresas en 5 sectores + bloque secundario de Psicología clínica; cargos según CV |
| CA-06 | Proyecto "Idea" | Se muestra su tarjeta | Badge "Idea" y sin enlaces inexistentes |
| CA-07 | Proyecto sin "Arquitectura" | Se abre su detalle | La sección no se renderiza |
| CA-08 | Slug inexistente | Se visita `/proyectos/xyz` | Se muestra la 404 |
| CA-09 | Certificado de curso | Clic en "Ver certificado" | Se abre el diálogo; Esc o "Cerrar" lo cierran y el foco vuelve al botón |
| CA-10 | Imagen que falla | Se abre el diálogo | "No se pudo cargar la imagen del certificado." |
| CA-11 | Constancia laboral | Se muestra | Solo empresa, cargo, periodo y "Constancia disponible a solicitud" |
| CA-12 | Hero o Contacto | Clic en «Escribir por WhatsApp» o en la fila WhatsApp | Se abre `wa.me/51948331981` con el mensaje de IX-03 en pestaña nueva |
| CA-13 | Reducción de movimiento activa | Navega a P-02 | Cambio instantáneo |
| CA-14 | Campo obligatorio faltante | Build | Falla indicando archivo y campo |
| CA-15 | P-01 cargada | Se recorre | Áreas, Cómo trabajo, Evaluación, Formación y Publicaciones muestran su colección; 0 publicaciones → "Pronto compartiré nuevas publicaciones." |
| CA-16 | Sitio publicado | Se inspeccionan P-01, P-02 y P-04 | title, description, canonical y og:image propios; `/sitemap-index.xml` (incluye `/eventos`) y `/robots.txt`; analítica solo con token |
| CA-17 | Franja «IA en proceso de selección» | Se recorre | Cada tarjeta tiene título, descripción y nivel; ninguna menciona empresas ni clientes; sin porcentaje |
| CA-18 | Fila Teléfono | Clic | Se copia `+51948331981`, la fila muestra «Teléfono · Copiado» 2 s; sin permiso se usa el método alternativo y no hay error visible |
| CA-19 | P-04 cargada | Se revisa la galería | 5 fotos 4:3; ningún `alt` con empresa o producto; «Inicio» y «Volver al portafolio» regresan a P-01 |
| CA-20 | Proyecto con capturas | Se usan flechas, puntos o ← → | Cambia la captura, contador «n / N» y leyenda «Pantalla: …»; las inactivas con `aria-hidden`; sin capturas, marcador con leyenda |
| CA-21 | P-02 en ≥ 1024 px con 3+ secciones | Se abre | Índice «En esta página» con un enlace por sección presente; en < 1024 px no aparece |

## Decisiones pendientes que bloquean
| DP | Bloquea fase | Qué hacer |
|---|---|---|
| DP-01 Descarga de CV (retirada) | No | No implementar; si el propietario la pide, restaurar IX-01, CA-12 original y la comprobación de build |
| DP-02 Foto final | F1 | Usar `foto-jeiko.webp` del diseño; si mide menos de 1200 px, pedir otra |
| DP-03 Publicaciones de LinkedIn | F2 | Cargar las 2 del contenido inicial; con 0 mostrar el estado vacío |
| DP-04 Imágenes de certificados recortadas | F2 | Verificar las 7 imágenes del diseño; si una trae DNI, firma o código, detenerte y pedir la versión recortada |
| DP-06 Contenido de detalle de proyectos | F3 | Publicar solo las secciones con contenido; nunca «Pendiente de documentar.» |
| DP-07 Estados de proyectos | F3 | Confirmar antes de publicar |
| DP-09 Fotos de Eventos | F3 | Confirmar autorización de las personas antes de publicar; usar los alt neutros |
| DP-10 Capturas de proyectos | F3 | Confirmar que las 8 capturas usan datos ficticios |
| DP-11 Niveles y grado | F2 | Confirmar «Intermedio» (Excel, SQL Server, Power BI, Python) y «Licenciado» antes de publicar |

## Instrucciones de comportamiento
- Implementa solo este alcance, en el orden de fases. Verifica "Terminado cuando" antes de avanzar.
- Respeta nivel, alcance, stack, modelo de datos, RN, seguridad, CA y pruebas.
- No agregues funcionalidades fuera de alcance ni reemplaces tecnologías sin justificarlo y documentarlo.
- No introduzcas backend, base de datos ni animaciones.
- Verifica versiones actuales de dependencias; no las asumas.
- Nunca escribas secretos en el código ni en el repositorio.
- Si llegas a una DP que bloquea tu fase o a una decisión crítica no definida: detente y pide aclaración.
- Documenta cualquier cambio que afecte arquitectura, datos, seguridad o alcance.
- Respeta el contrato: si una pantalla necesita una acción que no está en él, o una fila no tiene pantalla, detente y pide aclaración.
- Si integras el código exportado de Claude Design, conserva su layout pero reemplaza valores fijos por tokens y textos por colecciones. No copies `.dc.html`, `support.js`, `image-slot` ni los CDN del prototipo: reimplementa con Astro y recursos autoalojados.
