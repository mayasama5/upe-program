import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Lightbulb, TrendingUp, Users, Target, Briefcase, Award, BookOpen, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import Header from '../components/Header';

export default function CareerAdvice() {
  const { user, loading, logout } = useAuth();
  const [selectedAdvice, setSelectedAdvice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const careerAdviceData = [
    {
      id: 1,
      title: "Networking Digital Efectivo",
      icon: Users,
      category: "Networking",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
      borderColor: "border-cyan-400/30",
      summary: "Construye conexiones profesionales efectivas usando plataformas digitales.",
      content: `
## ¿Por qué es importante?

El networking digital se ha convertido en una herramienta fundamental para el crecimiento profesional. Más del 85% de las posiciones laborales se llenan a través de contactos profesionales.

## Estrategias Clave

### 1. Optimiza tu perfil de LinkedIn
- **Foto profesional**: Usa una imagen de alta calidad con fondo neutro
- **Título atractivo**: No solo tu cargo, sino tu propuesta de valor
- **Resumen impactante**: Cuenta tu historia profesional en 3-4 párrafos
- **Experiencia detallada**: Incluye logros cuantificables
- **Habilidades relevantes**: Prioriza las más demandadas en tu sector

### 2. Participa activamente
- Comenta en publicaciones de tu industria
- Comparte contenido de valor (no solo autopromocional)
- Únete a grupos relevantes de tu sector
- Publica artículos sobre tu área de expertise
- Celebra logros de tus contactos

### 3. Construye relaciones genuinas
- Personaliza tus solicitudes de conexión
- Agradece cuando alguien te ayude o recomiende
- Ofrece ayuda antes de pedirla
- Mantén conversaciones regulares con contactos clave
- No pidas favores inmediatamente después de conectar

### 4. Usa otras plataformas
- **Twitter/X**: Para conversaciones técnicas y tendencias
- **GitHub**: Si eres desarrollador, muestra tu código
- **Medium**: Comparte conocimiento a través de artículos
- **Stack Overflow**: Ayuda a otros y construye reputación

## Consejos Prácticos

- Dedica 15-20 minutos diarios a actividades de networking
- Sigue a líderes de tu industria y aprende de ellos
- Asiste a eventos virtuales y presenciales
- Ofrece mentoría a profesionales junior
- Mantén actualizado tu perfil constantemente

## Errores a Evitar

❌ Usar LinkedIn solo para buscar empleo
❌ Enviar mensajes genéricos de venta
❌ Agregar a personas sin contexto
❌ No responder a mensajes de tu red
❌ Compartir solo contenido de autopromoción
      `,
    },
    {
      id: 2,
      title: "Crea un Portafolio Profesional Destacado",
      icon: Briefcase,
      category: "Desarrollo Personal",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-400/30",
      summary: "Diseña un portafolio que muestre tus mejores proyectos y habilidades.",
      content: `
## ¿Por qué necesitas un portafolio?

Un portafolio profesional es tu carta de presentación visual. Permite a empleadores y clientes ver exactamente lo que puedes hacer, más allá de lo que dices en tu CV.

## Elementos Esenciales

### 1. Sección "Sobre Mí"
- **Foto profesional**: Transmite confianza y accesibilidad
- **Bio concisa**: 2-3 párrafos sobre tu trayectoria
- **Propuesta de valor**: ¿Qué te hace único?
- **Datos de contacto**: Email, LinkedIn, GitHub

### 2. Proyectos Destacados
Selecciona 3-6 proyectos que demuestren:
- **Variedad de habilidades**
- **Resolución de problemas complejos**
- **Impacto medible**

Para cada proyecto incluye:
- Título y descripción breve
- Tu rol específico
- Tecnologías utilizadas
- Desafíos superados
- Resultados obtenidos (con métricas si es posible)
- Capturas de pantalla o demos en vivo
- Links al proyecto (si está público)
- Código fuente (GitHub)

### 3. Habilidades Técnicas
- Lenguajes de programación
- Frameworks y librerías
- Herramientas y software
- Metodologías (Agile, Scrum, etc.)
- Nivel de competencia en cada una

### 4. Experiencia Profesional
- Posiciones anteriores
- Logros destacados
- Responsabilidades clave
- Duración en cada rol

### 5. Educación y Certificaciones
- Títulos universitarios
- Bootcamps y cursos
- Certificaciones profesionales
- Premios y reconocimientos

## Plataformas Recomendadas

### Para Desarrolladores
- **GitHub Pages**: Gratis y fácil de configurar
- **Vercel/Netlify**: Deploy automático desde GitHub
- **Portfolio personal**: Usando React, Next.js o Vue

### Para Diseñadores
- **Behance**: Red social para creativos
- **Dribbble**: Muestra trabajos de diseño
- **Adobe Portfolio**: Integrado con Creative Cloud

### Para Todos
- **Notion**: Crea un portafolio con páginas interactivas
- **Webflow**: Sin código, diseño profesional
- **WordPress**: Personalizable y escalable

## Tips de Diseño

✅ **Simplicidad**: Menos es más
✅ **Navegación clara**: 3-5 secciones máximo
✅ **Responsive**: Debe verse bien en móvil
✅ **Velocidad**: Optimiza imágenes y código
✅ **Accesibilidad**: Contraste, tamaño de fuente
✅ **Call to Action**: Botón de contacto visible

## Mantenimiento

- Actualiza cada 3 meses con nuevos proyectos
- Elimina proyectos antiguos o menos relevantes
- Revisa links rotos regularmente
- Añade nuevas certificaciones
- Mejora descripciones basándote en feedback

## Ejemplo de Estructura

\`\`\`
/
├── Inicio
│   ├── Hero con nombre y título
│   ├── Breve introducción
│   └── CTA (Ver proyectos / Contactar)
├── Sobre Mí
│   ├── Bio detallada
│   ├── Foto profesional
│   └── Skills técnicos
├── Proyectos
│   ├── Proyecto 1 (featured)
│   ├── Proyecto 2 (featured)
│   └── Otros proyectos (grid)
├── Experiencia
│   └── Timeline de trabajos
├── Educación
│   └── Certificaciones y títulos
└── Contacto
    └── Formulario + Links sociales
\`\`\`
      `,
    },
    {
      id: 3,
      title: "Domina las Entrevistas Remotas",
      icon: Zap,
      category: "Entrevistas",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-400/30",
      summary: "Prepárate para destacar en entrevistas virtuales con estos consejos.",
      content: `
## La Nueva Normalidad

Las entrevistas remotas se han convertido en el estándar. Requieren preparación específica diferente a las presenciales.

## Preparación Técnica

### Antes de la Entrevista

**Equipamiento:**
- ✅ Cámara de buena calidad (mínimo 720p)
- ✅ Micrófono funcional (audífonos con mic recomendado)
- ✅ Iluminación frontal adecuada
- ✅ Fondo limpio y profesional (o blur)
- ✅ Conexión a internet estable (preferible cable)

**Software:**
- Instala y prueba la plataforma (Zoom, Meet, Teams)
- Actualiza la aplicación a la última versión
- Prueba audio y video 1 hora antes
- Ten el número de teléfono del entrevistador (backup)
- Cierra aplicaciones innecesarias

**Espacio:**
- Habitación silenciosa y privada
- Silla cómoda y mesa estable
- Cámara a la altura de los ojos
- Elimina distracciones visuales del fondo

## Preparación de Contenido

### Investiga la Empresa

- Historia y misión de la empresa
- Productos o servicios principales
- Competidores y posición en el mercado
- Noticias recientes sobre la compañía
- Cultura organizacional
- Equipo de liderazgo

### Prepara Respuestas

**Preguntas comunes:**

1. **"Háblame de ti"**
   - Elevator pitch de 2 minutos
   - Experiencia relevante
   - Por qué te interesa el rol

2. **"¿Por qué quieres trabajar aquí?"**
   - Conexión con la misión de la empresa
   - Entusiasmo por el producto/servicio
   - Oportunidades de crecimiento

3. **"¿Cuál es tu mayor debilidad?"**
   - Ser honesto pero estratégico
   - Mencionar cómo estás trabajando en mejorar
   - Convertirlo en fortaleza

4. **Preguntas técnicas**
   - Repasa fundamentos de tu área
   - Practica coding/diseño en pizarra virtual
   - Ten ejemplos de proyectos pasados

### Método STAR para Respuestas

**S**ituación: Contexto del desafío
**T**area: Tu responsabilidad específica
**A**cción: Pasos que tomaste
**R**esultado: Impacto medible

Ejemplo:
> "En mi anterior trabajo (S), necesitábamos reducir el tiempo de carga del sitio (T). Implementé lazy loading y optimicé imágenes (A), reduciendo el tiempo de carga en 60% y aumentando conversiones en 25% (R)."

## Durante la Entrevista

### Lenguaje Corporal

- 👀 Mira a la cámara, no a la pantalla
- 😊 Sonríe y muestra entusiasmo
- 🙋 Gesticula naturalmente (manos visibles)
- 📏 Mantén postura erguida
- 👔 Viste profesionalmente (de la cintura para arriba mínimo)

### Comunicación Efectiva

- Habla claro y a buen volumen
- Haz pausas entre ideas
- Pide aclaraciones si no entiendes
- Evita muletillas ("ehh", "umm")
- Toma notas durante la entrevista

### Engagement Virtual

- Asiente para mostrar que escuchas
- Usa el nombre del entrevistador
- Haz contacto visual con la cámara
- Responde con energía (sin exagerar)
- Menciona información de tu investigación

## Tipos de Entrevistas Remotas

### 1. Video en Vivo
- Más común y tradicional
- Requiere buena conexión
- Interacción en tiempo real

### 2. Video Pregrabado
- Respondes preguntas grabadas
- Tiempo limitado por pregunta
- Practica antes para cronometrar

### 3. Coding en Vivo
- **Plataformas**: CoderPad, HackerRank
- **Tips**:
  - Piensa en voz alta
  - Explica tu razonamiento
  - Escribe código limpio
  - Considera edge cases

### 4. Diseño en Vivo
- **Plataformas**: Figma, Miro
- **Tips**:
  - Pregunta sobre restricciones
  - Muestra tu proceso
  - Justifica decisiones
  - Itera basándote en feedback

## Tus Preguntas al Entrevistador

Siempre prepara 3-5 preguntas inteligentes:

📌 Sobre el rol:
- "¿Cómo se ve el éxito en esta posición a los 3/6/12 meses?"
- "¿Cuáles son los mayores desafíos del equipo actualmente?"

📌 Sobre el equipo:
- "¿Cómo es la cultura del equipo?"
- "¿Qué oportunidades de mentoría existen?"

📌 Sobre la empresa:
- "¿Cuáles son las prioridades de la empresa este año?"
- "¿Cómo apoya la empresa el desarrollo profesional?"

📌 Sobre próximos pasos:
- "¿Cuál es el timeline del proceso?"
- "¿Hay algo de mi experiencia que quisieran que clarificara?"

## Después de la Entrevista

**Dentro de 24 horas:**
- Envía email de agradecimiento
- Menciona algo específico de la conversación
- Reitera tu interés en el rol
- Ofrece información adicional si la solicitaron

**Seguimiento:**
- Si no recibes respuesta en el tiempo indicado, haz follow-up
- Mantén profesionalismo siempre
- Continúa con otras oportunidades

## Errores Comunes a Evitar

❌ Llegar tarde (conéctate 5 min antes)
❌ No probar la tecnología previamente
❌ Interrupciones (familia, mascotas, notificaciones)
❌ Multitasking durante la entrevista
❌ Mala iluminación o ángulo de cámara
❌ Conexión inestable sin plan B
❌ No investigar sobre la empresa
❌ Criticar empleadores anteriores
❌ No tener preguntas para el entrevistador
❌ Mentir sobre habilidades o experiencia

## Checklist Final

✅ Investigación de empresa completa
✅ Respuestas preparadas (método STAR)
✅ Equipo técnico probado
✅ Espacio ordenado y silencioso
✅ Outfit profesional
✅ CV y notas a mano
✅ Preguntas para el entrevistador
✅ Agua a mano
✅ Actitud positiva y confiada
      `,
    },
    {
      id: 4,
      title: "Desarrolla Habilidades Blandas",
      icon: Target,
      category: "Desarrollo Personal",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-400/30",
      summary: "Las soft skills son tan importantes como las habilidades técnicas.",
      content: `
## ¿Qué son las Habilidades Blandas?

Son competencias interpersonales y de comportamiento que determinan cómo interactúas con otros, resuelves problemas y te adaptas a situaciones.

## Top 10 Soft Skills Más Demandadas

### 1. Comunicación Efectiva

**¿Por qué importa?**
El 90% de los empleadores la consideran crítica.

**Cómo desarrollarla:**
- Practica la escucha activa
- Sé claro y conciso en emails
- Presenta ideas regularmente
- Pide feedback sobre tu comunicación
- Lee en voz alta para mejorar dicción
- Toma cursos de oratoria

**Ejercicio práctico:**
Graba un video explicando un concepto técnico a alguien no técnico. Revisa y mejora.

### 2. Trabajo en Equipo

**¿Por qué importa?**
Muy pocas tareas se hacen en total aislamiento.

**Cómo desarrollarla:**
- Participa en proyectos colaborativos
- Aprende a dar y recibir feedback
- Celebra logros del equipo
- Resuelve conflictos constructivamente
- Comprende diferentes estilos de trabajo

**Ejercicio práctico:**
Únete a un proyecto open source o hackathon.

### 3. Adaptabilidad

**¿Por qué importa?**
El cambio es la única constante en tech.

**Cómo desarrollarla:**
- Sal de tu zona de confort regularmente
- Aprende tecnologías nuevas
- Acepta feedback y pivotea
- Mantén mentalidad de crecimiento
- Practica la resiliencia

**Ejercicio práctico:**
Cada mes, aprende algo completamente nuevo (no relacionado a tu trabajo).

### 4. Resolución de Problemas

**¿Por qué importa?**
Es la esencia de cualquier rol profesional.

**Cómo desarrollarla:**
- Descompón problemas grandes en pequeños
- Usa frameworks como "5 Whys"
- Practica pensamiento crítico
- Aprende de errores pasados
- Documenta tus procesos de resolución

**Ejercicio práctico:**
Resuelve puzzles lógicos o challenges de coding diariamente.

### 5. Gestión del Tiempo

**¿Por qué importa?**
La productividad es clave para cumplir deadlines.

**Cómo desarrollarla:**
- Usa técnica Pomodoro (25 min trabajo, 5 min descanso)
- Prioriza con matriz de Eisenhower
- Aprende a decir "no"
- Elimina distracciones
- Automatiza tareas repetitivas

**Ejercicio práctico:**
Durante una semana, registra cómo usas cada hora. Analiza y optimiza.

### 6. Liderazgo

**¿Por qué importa?**
No necesitas ser manager para liderar.

**Cómo desarrollarla:**
- Toma iniciativa en proyectos
- Mentoriza a juniors
- Propón mejoras de procesos
- Aprende a delegar
- Desarrolla inteligencia emocional

**Ejercicio práctico:**
Lidera un proyecto pequeño en tu equipo o comunidad.

### 7. Creatividad e Innovación

**¿Por qué importa?**
Diferencia entre copiar y crear valor.

**Cómo desarrollarla:**
- Practica brainstorming regular
- Combina ideas de diferentes industrias
- Cuestiona el status quo
- Experimenta sin miedo al fracaso
- Consume contenido diverso

**Ejercicio práctico:**
Dedica 30 min semanales a "modo exploración" - aprende algo random.

### 8. Inteligencia Emocional

**¿Por qué importa?**
Fundamental para relaciones profesionales saludables.

**Componentes:**
- **Autoconciencia**: Reconocer tus emociones
- **Autorregulación**: Controlar tus reacciones
- **Motivación**: Mantener enfoque en objetivos
- **Empatía**: Entender emociones de otros
- **Habilidades sociales**: Manejar relaciones

**Cómo desarrollarla:**
- Practica mindfulness
- Journaling emocional
- Pide feedback sobre cómo te perciben otros
- Lee sobre lenguaje corporal
- Desarrolla empatía activamente

**Ejercicio práctico:**
Antes de reaccionar en una situación tensa, pausa 10 segundos y respira.

### 9. Pensamiento Crítico

**¿Por qué importa?**
Evita decisiones basadas en suposiciones.

**Cómo desarrollarla:**
- Cuestiona información antes de aceptarla
- Busca múltiples perspectivas
- Identifica sesgos cognitivos
- Practica debate constructivo
- Lee filosofía y lógica

**Ejercicio práctico:**
Al leer noticias, identifica: ¿Qué asume el autor? ¿Hay otra interpretación?

### 10. Ética de Trabajo

**¿Por qué importa?**
La base de la confiabilidad profesional.

**Componentes:**
- Puntualidad
- Responsabilidad
- Integridad
- Dedicación
- Profesionalismo

**Cómo desarrollarla:**
- Cumple tus compromisos
- Sé transparente sobre limitaciones
- Aprende continuamente
- Respeta a todos por igual
- Mantén estándares altos

## Plan de Desarrollo de 90 Días

### Mes 1: Autoconocimiento
- Identifica tus 3 mayores fortalezas
- Identifica tus 3 áreas de mejora
- Pide feedback a 5 personas diferentes
- Define objetivos SMART

### Mes 2: Práctica Deliberada
- Elige 2 habilidades para enfocarte
- Lee 1 libro sobre cada una
- Practica diariamente (aunque sea 15 min)
- Busca oportunidades de aplicarlas

### Mes 3: Consolidación
- Evalúa tu progreso
- Ajusta tu enfoque según resultados
- Comparte lo aprendido con otros
- Establece próximos objetivos

## Recursos Recomendados

### Libros
- "Inteligencia Emocional" - Daniel Goleman
- "Las 7 Habilidades de la Gente Altamente Efectiva" - Stephen Covey
- "Crucial Conversations" - Kerry Patterson
- "Mindset" - Carol Dweck

### Cursos Online
- Coursera: Soft Skills Professional Certificate
- LinkedIn Learning: Communication Foundations
- edX: Leadership and Emotional Intelligence

### Podcasts
- The Tim Ferriss Show
- WorkLife with Adam Grant
- HBR IdeaCast

## Cómo Demostrar Soft Skills

### En el CV
No escribas "Excelentes habilidades de comunicación"

✅ En su lugar:
"Presenté propuesta técnica a stakeholders no técnicos, resultando en aprobación de presupuesto de $50K"

### En la Entrevista
Usa el método STAR para ejemplos concretos

### En el Trabajo
- Documenta logros que requirieron soft skills
- Pide recomendaciones en LinkedIn específicas
- Crea portfolio de liderazgo de proyectos

## Medición de Progreso

**Indicadores cualitativos:**
- Feedback de colegas
- Autoevaluación trimestral
- 360° reviews

**Indicadores cuantitativos:**
- Número de presentaciones dadas
- Proyectos liderados
- Certificaciones obtenidas
- Conflictos resueltos exitosamente

## Recuerda

Las habilidades blandas NO son innatas. Se pueden aprender y mejorar con práctica deliberada y consistencia.

El 85% de tu éxito profesional depende de soft skills, solo el 15% de habilidades técnicas.

Invierte en desarrollarte como persona integral, no solo como técnico.
      `,
    },
    {
      id: 5,
      title: "Construye tu Marca Personal",
      icon: Award,
      category: "Marketing Personal",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-400/30",
      summary: "Diferénciate en el mercado laboral con una marca personal sólida.",
      content: `
## ¿Qué es la Marca Personal?

Es la percepción que otros tienen de ti como profesional. Es lo que dice Google cuando alguien busca tu nombre.

## ¿Por qué importa?

- **Visibilidad**: Los reclutadores te encuentran más fácil
- **Credibilidad**: Demuestras expertise
- **Oportunidades**: Atraes proyectos y ofertas
- **Red**: Conectas con personas relevantes
- **Valor**: Puedes negociar mejor compensación

## Fundamentos de la Marca Personal

### 1. Define tu Identidad Profesional

**Haz estas preguntas:**
- ¿En qué soy excepcionalmente bueno?
- ¿Qué me apasiona hacer?
- ¿Qué valor único aporto?
- ¿A quién quiero ayudar?
- ¿Cómo quiero ser recordado?

**Crea tu declaración de marca:**
Formato: "Ayudo a [audiencia] a [lograr resultado] mediante [tu enfoque único]"

Ejemplo:
> "Ayudo a startups latinoamericanas a escalar sus productos digitales mediante arquitecturas cloud robustas y equipos ágiles."

### 2. Consistencia Visual

**Logo o Marca Personal:**
- Usa las mismas fotos profesionales
- Colores consistentes
- Tipografía coherente
- Mismo username en plataformas

**Foto de Perfil:**
- Profesional pero accesible
- Fondo neutro
- Buena iluminación
- Actualizada (máximo 2 años)
- La misma en todas las plataformas

### 3. Presencia Online

**Plataformas Esenciales:**

**LinkedIn** (Obligatorio)
- Perfil 100% completo
- Título optimizado con keywords
- Resumen que cuenta tu historia
- Experiencia con logros medibles
- Recomendaciones de colegas
- Publicaciones semanales

**GitHub** (Para developers)
- Repos bien documentados
- Contribuciones regulares
- README atractivos
- Proyectos pinneados destacados

**Twitter/X**
- Comparte aprendizajes
- Participa en conversaciones de tu industria
- Sigue y aprende de líderes

**Medium/Dev.to**
- Escribe sobre temas de expertise
- Tutoriales técnicos
- Experiencias y aprendizajes

**YouTube** (Opcional pero poderoso)
- Tutoriales en video
- Talks y presentaciones
- Live coding sessions

### 4. Creación de Contenido

**Estrategia de Contenido:**

**Pilares de contenido (elige 3-4):**
- Tutoriales técnicos
- Lecciones aprendidas
- Tendencias de la industria
- Reviews de herramientas
- Casos de estudio
- Opiniones y análisis

**Calendario de Publicación:**
- **LinkedIn**: 2-3 posts/semana
- **Twitter**: 1-2 posts/día
- **Blog**: 1-2 artículos/mes
- **YouTube**: 1 video/semana (si aplica)

**Tipos de Contenido Efectivos:**

1. **How-To / Tutoriales**
   - "Cómo implementé autenticación JWT en Next.js"
   - Paso a paso con código
   - Screenshots o videos

2. **Lecciones Aprendidas**
   - "5 errores que cometí en mi primera startup"
   - Honesto y vulnerable
   - Valor accionable

3. **Micro-contenido**
   - Tips rápidos
   - Code snippets útiles
   - Infografías

4. **Storytelling**
   - Tu journey profesional
   - Decisiones de carrera
   - Superación de obstáculos

5. **Curación de Contenido**
   - Resúmenes de artículos importantes
   - Recomendaciones de recursos
   - Tu perspectiva única

### 5. Networking Estratégico

**Online:**
- Comenta en posts de influencers de tu nicho
- Comparte contenido de otros (con tu opinión)
- Participa en AMAs (Ask Me Anything)
- Únete a comunidades de Slack/Discord

**Offline:**
- Asiste a meetups locales
- Habla en conferencias (empieza pequeño)
- Organiza workshops
- Mentoriza en programas

### 6. Establece tu Expertise

**Posicionamiento:**
- Elige un nicho específico
- Sé conocido por "algo" concreto
- Profundiza más que amplía

**Ejemplo de evolución:**
"Desarrollador" → "Frontend Developer" → "React Specialist" → "Expert en Performance de React Apps"

**Formas de demostrar expertise:**
- Certificaciones reconocidas
- Proyectos de portfolio impresionantes
- Contribuciones open source significativas
- Artículos técnicos de calidad
- Talks en conferencias
- Menciones de otros expertos

## Plan de Construcción de Marca (6 Meses)

### Mes 1-2: Fundación
- ✅ Define tu identidad profesional
- ✅ Optimiza todos tus perfiles online
- ✅ Crea contenido base (bio, about, etc.)
- ✅ Identifica tu audiencia objetivo

### Mes 3-4: Contenido
- ✅ Publica contenido regularmente
- ✅ Interactúa con tu industria
- ✅ Construye tu portafolio
- ✅ Empieza email newsletter (opcional)

### Mes 5-6: Amplificación
- ✅ Colabora con otros profesionales
- ✅ Aplica a dar charlas
- ✅ Aumenta frecuencia de publicación
- ✅ Analiza y optimiza

## Métricas de Éxito

**Métricas de Vanidad (no te obsesiones):**
- Followers/Conexiones
- Likes y comentarios
- Visualizaciones

**Métricas que Importan:**
- Ofertas de trabajo no solicitadas
- Invitaciones a proyectos/colaboraciones
- Mensajes de personas que te descubrieron
- Oportunidades de speaking
- Consultas sobre tus servicios
- Crecimiento de red de calidad

## Herramientas Útiles

**Gestión de Redes Sociales:**
- Buffer / Hootsuite: Programar posts
- Canva: Diseño de gráficos
- Grammarly: Revisar escritura

**Creación de Contenido:**
- Notion: Organizar ideas
- Hemingway: Mejorar escritura
- Loom: Videos rápidos

**Analytics:**
- LinkedIn Analytics
- Google Analytics (para blog)
- Twitter Analytics

## Errores Comunes a Evitar

❌ **Inconsistencia**: Publicar mucho 1 semana, nada por 2 meses
❌ **Autopromoción excesiva**: 80% debería ser valor, 20% promoción
❌ **Comprar followers**: Credibilidad > Números
❌ **No interactuar**: Responde comentarios y mensajes
❌ **Copiar sin aportar**: Cura con tu perspectiva
❌ **Ser genérico**: "Hago desarrollo web" vs "Especialista en e-commerce con Shopify"
❌ **No tener website propio**: Tu hub central
❌ **Ignorar SEO**: Usa keywords relevantes
❌ **No pedir recomendaciones**: Social proof es poderoso
❌ **Rendirse rápido**: Toma 6-12 meses ver resultados

## Plantilla de Bio Profesional

**Estructura:**
1. **Hook**: Lo más interesante de ti
2. **Expertise**: En qué eres bueno
3. **Experiencia**: Dónde has trabajado/estudiado
4. **Valor**: Cómo ayudas a otros
5. **Personal**: 1-2 datos humanos
6. **CTA**: Cómo contactarte

**Ejemplo:**
> "Frontend Developer obsesionado con crear interfaces que los usuarios aman 🚀
>
> Especializado en React, Next.js y performance optimization. He construido productos para +2M usuarios en startups latinoamericanas.
>
> Ex-desarrollador en Mercado Libre. Ingeniero en Sistemas por UCA.
>
> Ayudo a equipos a crear aplicaciones web rápidas y mantenibles mediante clean code y mejores prácticas.
>
> Amante del mate, el fútbol y los asados 🧉⚽🥩
>
> 📧 contacto@ejemplo.com | 🔗 linkedin.com/in/ejemplo"

## Casos de Éxito

**Ejemplo 1: Developer Advocate**
- Empezó compartiendo code snippets en Twitter
- Creó tutorial series en YouTube
- Habló en meetups locales
- Fue contratado como Developer Advocate en empresa Fortune 500

**Ejemplo 2: Freelancer Top**
- Escribió 50 artículos en Medium sobre React
- Hizo portfolio impresionante
- Compartió journey en LinkedIn
- Genera $120K+ anuales con clientes de EEUU

## Recuerda

Tu marca personal no se construye de la noche a la mañana. Es un maratón, no un sprint.

La autenticidad gana siempre. No intentes ser alguien que no eres.

El contenido de calidad y la constancia son las claves del éxito.

Empieza hoy. Tu "yo" del futuro te lo agradecerá.
      `,
    },
    {
      id: 6,
      title: "Aprende Continuamente",
      icon: BookOpen,
      category: "Educación",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-400/30",
      summary: "Mantente relevante con aprendizaje constante y estratégico.",
      content: `
## La Importancia del Aprendizaje Continuo

En tecnología, lo que sabes hoy puede quedar obsoleto en 2-3 años. El aprendizaje continuo no es opcional, es supervivencia profesional.

## Estadísticas Clave

- **50%** de las habilidades técnicas quedan obsoletas en 2-4 años
- **94%** de empleados permanecerían más tiempo si la empresa invirtiera en su desarrollo
- **$1,200** es el promedio que profesionales gastan anualmente en auto-capacitación

## Modelo de Aprendizaje 70-20-10

### 70% - Aprender Haciendo
**Experiencial**: La mayoría del aprendizaje viene de la práctica.

**Estrategias:**
- Proyectos personales desafiantes
- Contribuciones open source
- Freelancing en áreas nuevas
- Implementar lo aprendido inmediatamente
- Enseñar a otros (aprende 2x)

**Ejemplo:**
Si aprendes GraphQL, crea una API completa con él, no solo hagas el tutorial.

### 20% - Aprender de Otros
**Social**: Aprende de experiencias de otros.

**Estrategias:**
- Pair programming
- Code reviews activos
- Mentoría (dar y recibir)
- Asistir a meetups y conferencias
- Participar en comunidades online

**Ejemplo:**
Únete a un Discord/Slack de tu tecnología favorita y participa activamente.

### 10% - Aprendizaje Formal
**Estructurado**: Cursos, libros, certificaciones.

**Estrategias:**
- Cursos online (Platzi, Udemy, Coursera)
- Libros técnicos
- Certificaciones profesionales
- Bootcamps especializados
- Documentación oficial

**Ejemplo:**
Lee el libro oficial de tu framework principal una vez al año.

## Construye tu Curriculum de Aprendizaje

### 1. Auditoría de Skills

**Inventario actual:**
- Tecnologías que dominas
- Tecnologías que conoces
- Tecnologías que has usado
- Gaps identificados

**Demanda del mercado:**
- Revisa job postings de tu rol ideal
- Identifica skills recurrentes
- Compara con tu inventario

**Priorización:**
- Alto impacto, alta demanda → Prioridad 1
- Alto impacto, baja demanda → Prioridad 2
- Bajo impacto, alta demanda → Prioridad 3
- Bajo impacto, baja demanda → Ignorar

### 2. Crea tu Plan de Aprendizaje

**Framework SMART:**
- **S**pecific: "Aprender React" → "Crear 3 apps con React y TypeScript"
- **M**easurable: Define entregables concretos
- **A**chievable: Realista con tu tiempo
- **R**elevant: Alineado con tus objetivos de carrera
- **T**ime-bound: Deadlines claros

**Plantilla trimestral:**

\`\`\`
Q1 2025: Frontend Specialist

Meta Principal: Dominar Next.js y arquitecturas modernas

Habilidad 1: Next.js App Router
- ✅ Curso oficial de Vercel (2 semanas)
- ✅ Migrar proyecto personal a App Router (2 semanas)
- ✅ Artículo sobre patrones aprendidos (1 semana)

Habilidad 2: Testing Avanzado
- ✅ Jest + React Testing Library deep dive (1 semana)
- ✅ Implementar tests en proyecto (3 semanas)
- ✅ TDD en nuevo feature (1 semana)

Habilidad 3: Performance Optimization
- ✅ Libro "Web Performance in Action" (1 mes)
- ✅ Auditar y optimizar app (2 semanas)
- ✅ Talk en meetup sobre findings (1 día)
\`\`\`

### 3. Métodos de Aprendizaje Efectivos

**Feynman Technique:**
1. Estudia el concepto
2. Explícalo a un niño de 12 años
3. Identifica gaps en tu entendimiento
4. Revisa y simplifica más

**Active Recall:**
- No re-leas pasivamente
- Cierra el libro y recuerda
- Usa flashcards (Anki)
- Explica en voz alta

**Spaced Repetition:**
- Día 1: Aprende concepto
- Día 2: Repasa
- Día 7: Repasa
- Día 30: Repasa
- Día 90: Repasa

**Learning by Teaching:**
- Escribe blog posts
- Graba videos tutoriales
- Da charlas en meetups
- Ayuda en foros/Stack Overflow

### 4. Fuentes de Aprendizaje

**Plataformas Online (Español):**
- **Platzi**: Cursos tech en español
- **EDteam**: Frontend, backend, diseño
- **Codelyplatzi**: Software craftsmanship
- **Udemy español**: Amplio catálogo

**Plataformas Online (Inglés):**
- **Frontend Masters**: Lo mejor en frontend
- **Egghead.io**: Videos cortos y prácticos
- **Pluralsight**: Paths de aprendizaje
- **Coursera**: Certificados universitarios
- **freeCodeCamp**: Gratis y completo

**Documentación Oficial:**
- Siempre empieza aquí
- Más actualizada que cualquier curso
- Ejemplos oficiales son gold

**Libros Clásicos:**
- "Clean Code" - Robert Martin
- "The Pragmatic Programmer" - Hunt & Thomas
- "You Don't Know JS" - Kyle Simpson
- "Designing Data-Intensive Applications" - Martin Kleppmann

**YouTube Channels:**
- Traversy Media
- Fireship
- ThePrimeagen
- Ben Awad
- Coding Garden

**Podcasts:**
- Syntax.fm
- Shop Talk Show
- Full Stack Radio
- JS Party

**Newsletters:**
- JavaScript Weekly
- React Status
- Node Weekly
- CSS Tricks

### 5. Tiempo y Hábitos

**Bloques de Aprendizaje:**

**Método 1: Morning Learning**
- 5:30 AM - 7:00 AM
- 1.5 hrs antes del trabajo
- Mente fresca

**Método 2: Pomodoro Nights**
- 8:00 PM - 10:00 PM
- 4 bloques de 25 min
- Con descansos

**Método 3: Weekends Deep Dive**
- Sábado 9 AM - 1 PM
- Domingo 9 AM - 1 PM
- 8 hrs de aprendizaje profundo

**Construye el Hábito:**
1. **Cue**: Alarma / Después del café
2. **Routine**: Sesión de aprendizaje
3. **Reward**: Check en tracker / Streak

**Stack de Hábitos:**
"Después de [hábito existente], haré [nuevo hábito de aprendizaje]"

Ejemplo: "Después de mi café de la mañana, haré 1 Pomodoro de coding practice"

### 6. Proyecto-Based Learning

**Framework:**
1. Elige proyecto ligeramente fuera de tu zona de confort
2. Define scope claro
3. Aprende solo lo necesario para avanzar
4. Itera y mejora
5. Publica y comparte

**Ideas de Proyectos:**

**Nivel Junior:**
- Todo app con CRUD completo
- Weather app con API
- Portfolio personal
- Blog con Markdown

**Nivel Mid:**
- E-commerce con Stripe
- Real-time chat con WebSockets
- Dashboard con visualizaciones
- Social media clone

**Nivel Senior:**
- Microservicios con Docker
- App multi-tenant SaaS
- Editor colaborativo en tiempo real
- Sistema de diseño completo

### 7. Certificaciones Estratégicas

**Cuándo valen la pena:**
- ✅ Cloud (AWS, Azure, GCP)
- ✅ Kubernetes (CKA, CKAD)
- ✅ Seguridad (CEH, CISSP)
- ✅ Project Management (PMP, Scrum)
- ✅ Primeras etapas de carrera

**Cuándo NO:**
- ❌ Frameworks específicos (React, Vue)
- ❌ Etapas avanzadas de carrera
- ❌ Solo para "coleccionar certificados"

**ROI de Certificaciones:**
- AWS Solutions Architect: +15-20% salario
- Google Cloud Professional: +10-15% salario
- Portfolio sólido: +20-30% salario

## Evita estos Errores

❌ **Tutorial Hell**: Solo ver tutoriales, nunca construir
❌ **Shiny Object Syndrome**: Nueva tecnología cada semana
❌ **No aplicar lo aprendido**: Olvidar en 2 semanas
❌ **Aprender sin dirección**: Sin plan claro
❌ **Compararte con otros**: Tu journey es único
❌ **No tomar notas**: Contar solo con memoria
❌ **Aprender en aislamiento**: Sin comunidad
❌ **Perfectionism**: Esperar entender 100% antes de avanzar

## Sistema de Tracking

**Herramientas:**
- **Notion**: Curriculum + notas
- **Todoist**: Tasks de aprendizaje
- **Beeminder**: Accountability con dinero
- **GitHub**: Commits diarios
- **Spreadsheet**: Horas por skill

**Métricas a Trackear:**
- Horas por semana de aprendizaje
- Proyectos completados
- Artículos escritos
- Talks dados
- Certificaciones obtenidas

## Mantén la Motivación

**Mindset Growth:**
- "Todavía no lo sé" vs "No lo sé"
- Celebra pequeños wins
- Documenta tu progreso
- Comparte tus aprendizajes

**Accountability:**
- Encuentra un learning buddy
- Comparte metas públicamente
- Únete a #100DaysOfCode
- Reporta progreso semanalmente

**Recompensas:**
- Nuevo gadget cada trimestre completado
- Celebración al lograr hito importante
- Upgrade de setup después de certificación

## Plan de Acción Inmediata

**Esta semana:**
1. [ ] Haz auditoría de skills
2. [ ] Identifica 3 skills para próximo trimestre
3. [ ] Encuentra 1 curso/recurso para cada uno
4. [ ] Crea plan de aprendizaje semanal
5. [ ] Configura sistema de tracking
6. [ ] Comparte plan con alguien (accountability)

**Este mes:**
1. [ ] Completa primer módulo/sección
2. [ ] Construye mini-proyecto
3. [ ] Escribe sobre lo aprendido
4. [ ] Ajusta plan según feedback

**Este trimestre:**
1. [ ] Domina skill #1
2. [ ] Construye proyecto significativo
3. [ ] Comparte conocimiento (talk/artículo)
4. [ ] Obtén feedback de expertos
5. [ ] Planea siguiente trimestre

## Recuerda

El aprendizaje es un maratón, no un sprint.

La consistencia gana sobre la intensidad. 1 hora diaria > 7 horas el domingo.

No necesitas saberlo todo. Necesitas saber suficiente para resolver problemas reales.

Los mejores desarrolladores son aprendices perpétuos.

Empieza hoy. El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora.
      `,
    },
  ];

  const handleCardClick = (advice) => {
    setSelectedAdvice(advice);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-white">Cargando...</div></div>;
  }
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header user={user} logout={logout} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Lightbulb className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Consejos de Crecimiento Profesional</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Guías completas para impulsar tu carrera y destacar en el mercado laboral
          </p>
        </div>
      </section>

      {/* Advice Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerAdviceData.map((advice) => {
            const Icon = advice.icon;
            return (
              <Card
                key={advice.id}
                className={`bg-slate-800 border-slate-700 hover:${advice.borderColor} hover:border-2 transition-all cursor-pointer h-64 flex flex-col`}
                onClick={() => handleCardClick(advice)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`${advice.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-8 h-8 ${advice.color}`} />
                    </div>
                    <span className={`text-xs ${advice.color} font-semibold`}>
                      {advice.category}
                    </span>
                  </div>
                  <CardTitle className="text-white text-lg leading-tight">
                    {advice.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <CardDescription className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {advice.summary}
                  </CardDescription>
                  <Button
                    size="sm"
                    className={`w-full ${advice.bgColor} ${advice.color} hover:opacity-80 font-semibold border ${advice.borderColor}`}
                    variant="outline"
                  >
                    Leer Guía Completa <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 text-white border-slate-700">
          {selectedAdvice && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${selectedAdvice.bgColor} p-3 rounded-lg`}>
                    {React.createElement(selectedAdvice.icon, {
                      className: `w-6 h-6 ${selectedAdvice.color}`
                    })}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl text-white">
                      {selectedAdvice.title}
                    </DialogTitle>
                    <span className={`text-sm ${selectedAdvice.color}`}>
                      {selectedAdvice.category}
                    </span>
                  </div>
                </div>
                <DialogDescription className="text-gray-400 text-base">
                  {selectedAdvice.summary}
                </DialogDescription>
              </DialogHeader>
              <div className="prose prose-invert prose-cyan max-w-none mt-6">
                <div
                  className="text-gray-300 leading-relaxed"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {selectedAdvice.content.split('\n').map((line, index) => {
                    // Headers
                    if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-semibold text-cyan-400 mt-6 mb-3">{line.replace('### ', '')}</h3>;
                    }
                    // Bold text
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={index} className="font-bold text-white my-2">{line.replace(/\*\*/g, '')}</p>;
                    }
                    // Lists
                    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                      return <li key={index} className="ml-6 my-1">{line.trim().substring(2)}</li>;
                    }
                    if (line.trim().match(/^\d+\./)) {
                      return <li key={index} className="ml-6 my-1 list-decimal">{line.trim().substring(line.indexOf('.') + 1)}</li>;
                    }
                    // Checkmarks
                    if (line.includes('✅')) {
                      return <p key={index} className="text-green-400 my-1">{line}</p>;
                    }
                    if (line.includes('❌')) {
                      return <p key={index} className="text-red-400 my-1">{line}</p>;
                    }
                    // Code blocks
                    if (line.trim() === '```') {
                      return null;
                    }
                    // Quotes
                    if (line.trim().startsWith('>')) {
                      return <blockquote key={index} className="border-l-4 border-cyan-500 pl-4 italic text-gray-400 my-3">{line.replace('>', '')}</blockquote>;
                    }
                    // Empty lines
                    if (line.trim() === '') {
                      return <br key={index} />;
                    }
                    // Regular paragraphs
                    return <p key={index} className="my-2">{line}</p>;
                  })}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
