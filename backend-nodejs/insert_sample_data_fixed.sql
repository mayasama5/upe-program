-- =====================================================
-- INSERTAR DATOS DE EJEMPLO - VERSION CORREGIDA
-- =====================================================
-- Este script inserta datos con IDs generados automáticamente usando uuid_generate_v4()

-- =====================================================
-- COURSES
-- =====================================================
INSERT INTO "courses" (id, title, description, provider, url, language, has_spanish_subtitles, category, is_free, image_url)
VALUES
  (uuid_generate_v4()::text, 'Fundamentos de JavaScript', 'Aprende JavaScript desde cero.', 'Platzi', 'https://platzi.com/cursos/javascript', 'es', true, 'Programación', true, 'https://platzi.com/images/js.png'),
  (uuid_generate_v4()::text, 'React.js Avanzado', 'Domina React con hooks y context.', 'Platzi', 'https://platzi.com/cursos/react-avanzado', 'es', true, 'Programación', false, 'https://platzi.com/images/react.png'),
  (uuid_generate_v4()::text, 'Python para Data Science', 'Introducción a Python para análisis de datos.', 'Coursera', 'https://coursera.org/python-data-science', 'en', true, 'Ciencia de Datos', false, 'https://coursera.org/images/python.png'),
  (uuid_generate_v4()::text, 'Desarrollo Web con HTML y CSS', 'Crea sitios web modernos.', 'Udemy', 'https://udemy.com/html-css', 'es', true, 'Desarrollo Web', true, 'https://udemy.com/images/html.png'),
  (uuid_generate_v4()::text, 'Node.js y Express', 'Construye APIs con Node.js.', 'Platzi', 'https://platzi.com/cursos/nodejs', 'es', true, 'Programación', false, 'https://platzi.com/images/nodejs.png'),
  (uuid_generate_v4()::text, 'Machine Learning con Python', 'Aprende algoritmos de machine learning.', 'Coursera', 'https://coursera.org/ml-python', 'en', false, 'Ciencia de Datos', false, 'https://coursera.org/images/ml.png'),
  (uuid_generate_v4()::text, 'Java Spring Boot', 'Desarrollo de aplicaciones backend con Java.', 'Udemy', 'https://udemy.com/spring-boot', 'es', true, 'Programación', false, 'https://udemy.com/images/spring.png'),
  (uuid_generate_v4()::text, 'Diseño UX/UI', 'Crea interfaces atractivas y funcionales.', 'Domestika', 'https://domestika.org/ux-ui', 'es', true, 'Diseño', true, 'https://domestika.org/images/uxui.png'),
  (uuid_generate_v4()::text, 'TypeScript desde Cero', 'Aprende TypeScript para aplicaciones modernas.', 'Platzi', 'https://platzi.com/cursos/typescript', 'es', true, 'Programación', false, 'https://platzi.com/images/typescript.png'),
  (uuid_generate_v4()::text, 'AWS Cloud Practitioner', 'Certificación introductoria de AWS.', 'AWS Training', 'https://aws.training/cloud-practitioner', 'en', true, 'Cloud Computing', false, 'https://aws.training/images/aws.png'),
  (uuid_generate_v4()::text, 'Desarrollo de Apps con Flutter', 'Crea aplicaciones móviles multiplataforma.', 'Udemy', 'https://udemy.com/flutter', 'es', true, 'Desarrollo Móvil', false, 'https://udemy.com/images/flutter.png'),
  (uuid_generate_v4()::text, 'SQL para Análisis de Datos', 'Domina consultas SQL avanzadas.', 'Coursera', 'https://coursera.org/sql-data', 'en', true, 'Bases de Datos', false, 'https://coursera.org/images/sql.png'),
  (uuid_generate_v4()::text, 'Vue.js para Principiantes', 'Construye aplicaciones con Vue.js.', 'Platzi', 'https://platzi.com/cursos/vuejs', 'es', true, 'Programación', true, 'https://platzi.com/images/vue.png'),
  (uuid_generate_v4()::text, 'Ciberseguridad Básica', 'Introducción a la seguridad informática.', 'edX', 'https://edx.org/ciberseguridad', 'es', true, 'Ciberseguridad', true, 'https://edx.org/images/cyber.png'),
  (uuid_generate_v4()::text, 'Desarrollo con Angular', 'Crea aplicaciones SPA con Angular.', 'Udemy', 'https://udemy.com/angular', 'es', true, 'Programación', false, 'https://udemy.com/images/angular.png'),
  (uuid_generate_v4()::text, 'Big Data con Hadoop', 'Procesamiento de datos a gran escala.', 'Coursera', 'https://coursera.org/hadoop', 'en', false, 'Big Data', false, 'https://coursera.org/images/hadoop.png'),
  (uuid_generate_v4()::text, 'Desarrollo de Videojuegos con Unity', 'Crea juegos 2D y 3D.', 'Domestika', 'https://domestika.org/unity', 'es', true, 'Desarrollo de Videojuegos', false, 'https://domestika.org/images/unity.png'),
  (uuid_generate_v4()::text, 'Kubernetes para DevOps', 'Orquestación de contenedores con Kubernetes.', 'Udemy', 'https://udemy.com/kubernetes', 'es', true, 'DevOps', false, 'https://udemy.com/images/kubernetes.png'),
  (uuid_generate_v4()::text, 'Git y GitHub', 'Control de versiones con Git.', 'Platzi', 'https://platzi.com/cursos/git', 'es', true, 'Herramientas', true, 'https://platzi.com/images/git.png'),
  (uuid_generate_v4()::text, 'Introducción a Blockchain', 'Conceptos básicos de blockchain.', 'edX', 'https://edx.org/blockchain', 'en', true, 'Blockchain', false, 'https://edx.org/images/blockchain.png')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- EVENTS
-- =====================================================
INSERT INTO "events" (id, title, description, organizer, url, event_date, location, is_online, category, image_url)
VALUES
  (uuid_generate_v4()::text, 'DevFest 2025', 'Conferencia de desarrolladores de Google.', 'GDG Bogotá', 'https://devfest.co/2025', CURRENT_TIMESTAMP + INTERVAL '30 days', 'Bogotá, Colombia', false, 'Tecnología', 'https://devfest.co/images/2025.png'),
  (uuid_generate_v4()::text, 'JSConf México', 'Evento de JavaScript en México.', 'JSConf', 'https://jsconf.mx', CURRENT_TIMESTAMP + INTERVAL '45 days', 'Ciudad de México', false, 'Programación', 'https://jsconf.mx/images/jsconf.png'),
  (uuid_generate_v4()::text, 'Webinar de IA', 'Explora avances en inteligencia artificial.', 'Platzi', 'https://platzi.com/webinar-ia', CURRENT_TIMESTAMP + INTERVAL '15 days', 'Online', true, 'Inteligencia Artificial', 'https://platzi.com/images/ia.png'),
  (uuid_generate_v4()::text, 'Hackathon UPE', 'Competencia de programación.', 'UPE', 'https://upe.com/hackathon', CURRENT_TIMESTAMP + INTERVAL '60 days', 'Lima, Perú', false, 'Programación', 'https://upe.com/images/hackathon.png'),
  (uuid_generate_v4()::text, 'AWS Summit Online', 'Evento sobre servicios en la nube.', 'AWS', 'https://aws.amazon.com/summit', CURRENT_TIMESTAMP + INTERVAL '20 days', 'Online', true, 'Cloud Computing', 'https://aws.amazon.com/images/summit.png'),
  (uuid_generate_v4()::text, 'Taller de React', 'Taller práctico de React.js.', 'CódigoFacilito', 'https://codigofacilito.com/taller-react', CURRENT_TIMESTAMP + INTERVAL '25 days', 'Online', true, 'Programación', 'https://codigofacilito.com/images/react.png'),
  (uuid_generate_v4()::text, 'Data Science Meetup', 'Encuentro de profesionales de datos.', 'Data Community', 'https://datacommunity.org/meetup', CURRENT_TIMESTAMP + INTERVAL '35 days', 'Santiago, Chile', false, 'Ciencia de Datos', 'https://datacommunity.org/images/meetup.png'),
  (uuid_generate_v4()::text, 'PyCon Argentina', 'Conferencia de Python.', 'PyCon', 'https://pycon.ar', CURRENT_TIMESTAMP + INTERVAL '50 days', 'Buenos Aires, Argentina', false, 'Programación', 'https://pycon.ar/images/pycon.png'),
  (uuid_generate_v4()::text, 'Webinar de Ciberseguridad', 'Protege tus aplicaciones.', 'edX', 'https://edx.org/webinar-cyber', CURRENT_TIMESTAMP + INTERVAL '10 days', 'Online', true, 'Ciberseguridad', 'https://edx.org/images/cyber.png'),
  (uuid_generate_v4()::text, 'UX Day Bogotá', 'Evento sobre diseño de experiencia.', 'UXPA', 'https://uxpa.org/bogota', CURRENT_TIMESTAMP + INTERVAL '40 days', 'Bogotá, Colombia', false, 'Diseño', 'https://uxpa.org/images/uxday.png'),
  (uuid_generate_v4()::text, 'Taller de Docker', 'Aprende contenedores con Docker.', 'CódigoFacilito', 'https://codigofacilito.com/taller-docker', CURRENT_TIMESTAMP + INTERVAL '22 days', 'Online', true, 'DevOps', 'https://codigofacilito.com/images/docker.png'),
  (uuid_generate_v4()::text, 'Node.js Summit', 'Conferencia sobre Node.js.', 'NodeConf', 'https://nodeconf.org', CURRENT_TIMESTAMP + INTERVAL '55 days', 'Sao Paulo, Brasil', false, 'Programación', 'https://nodeconf.org/images/node.png'),
  (uuid_generate_v4()::text, 'Webinar de Blockchain', 'Explora tecnología blockchain.', 'Platzi', 'https://platzi.com/webinar-blockchain', CURRENT_TIMESTAMP + INTERVAL '18 days', 'Online', true, 'Blockchain', 'https://platzi.com/images/blockchain.png'),
  (uuid_generate_v4()::text, 'Flutter Meetup', 'Encuentro de desarrolladores Flutter.', 'Flutter Community', 'https://fluttercommunity.dev/meetup', CURRENT_TIMESTAMP + INTERVAL '32 days', 'Medellín, Colombia', false, 'Desarrollo Móvil', 'https://fluttercommunity.dev/images/flutter.png'),
  (uuid_generate_v4()::text, 'Taller de Git', 'Control de versiones con Git.', 'CódigoFacilito', 'https://codigofacilito.com/taller-git', CURRENT_TIMESTAMP + INTERVAL '12 days', 'Online', true, 'Herramientas', 'https://codigofacilito.com/images/git.png'),
  (uuid_generate_v4()::text, 'AI Conference LATAM', 'Conferencia de IA en América Latina.', 'AI LATAM', 'https://ailatam.org/conference', CURRENT_TIMESTAMP + INTERVAL '65 days', 'Ciudad de México', false, 'Inteligencia Artificial', 'https://ailatam.org/images/ai.png')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- JOB_VACANCIES
-- =====================================================
INSERT INTO "job_vacancies" (id, title, description, company, location, job_type, modality, salary_range, requirements, apply_type, external_url, is_active, category)
VALUES
  (uuid_generate_v4()::text, 'Desarrollador Full Stack', 'Buscamos desarrollador con experiencia en React y Node.js', 'TechCorp', 'Asunción, Paraguay', 'junior', 'hibrido', 'Gs. 5.000.000 - 8.000.000', ARRAY['React', 'Node.js', '2+ años experiencia'], 'externo', 'https://techcorp.com/jobs/1', true, 'Tecnología'),
  (uuid_generate_v4()::text, 'Diseñador UX/UI', 'Diseñador creativo para productos digitales', 'Design Studio', 'Remoto', 'medio', 'remoto', 'Gs. 6.000.000 - 10.000.000', ARRAY['Figma', 'Adobe XD', 'Portfolio'], 'externo', 'https://designstudio.com/jobs/2', true, 'Diseño'),
  (uuid_generate_v4()::text, 'Analista de Datos', 'Análisis y visualización de datos', 'Data Analytics Co', 'Ciudad del Este, Paraguay', 'junior', 'presencial', 'Gs. 4.500.000 - 7.000.000', ARRAY['SQL', 'Python', 'Power BI'], 'externo', 'https://dataanalytics.com/jobs/3', true, 'Tecnología'),
  (uuid_generate_v4()::text, 'Desarrollador Frontend React', 'Desarrollo de interfaces modernas', 'Software Factory', 'Remoto', 'senior', 'remoto', 'Gs. 8.000.000 - 12.000.000', ARRAY['React', 'TypeScript', '5+ años'], 'externo', 'https://softwarefactory.com/jobs/4', true, 'Tecnología'),
  (uuid_generate_v4()::text, 'Especialista en Marketing Digital', 'Gestión de campañas digitales', 'Marketing Hub', 'Asunción, Paraguay', 'medio', 'hibrido', 'Gs. 5.500.000 - 9.000.000', ARRAY['Google Ads', 'Meta Ads', 'Analytics'], 'externo', 'https://marketinghub.com/jobs/5', true, 'Marketing'),
  (uuid_generate_v4()::text, 'DevOps Engineer', 'Automatización y CI/CD', 'Cloud Services SA', 'Remoto', 'senior', 'remoto', 'Gs. 9.000.000 - 15.000.000', ARRAY['AWS', 'Docker', 'Kubernetes'], 'externo', 'https://cloudservices.com/jobs/6', true, 'Tecnología'),
  (uuid_generate_v4()::text, 'Desarrollador Backend Python', 'APIs y microservicios', 'Tech Solutions PY', 'Asunción, Paraguay', 'medio', 'presencial', 'Gs. 7.000.000 - 11.000.000', ARRAY['Python', 'Django', 'PostgreSQL'], 'externo', 'https://techsolutions.com/jobs/7', true, 'Tecnología'),
  (uuid_generate_v4()::text, 'Community Manager', 'Gestión de redes sociales', 'Digital Marketing Pro', 'Remoto', 'junior', 'remoto', 'Gs. 3.500.000 - 5.500.000', ARRAY['Redes Sociales', 'Canva', 'Copywriting'], 'externo', 'https://digitalmarketing.com/jobs/8', true, 'Marketing'),
  (uuid_generate_v4()::text, 'QA Tester Automation', 'Testing automatizado', 'Innovate Labs', 'Ciudad del Este, Paraguay', 'medio', 'hibrido', 'Gs. 6.000.000 - 9.500.000', ARRAY['Selenium', 'Cypress', 'Testing'], 'externo', 'https://innovatelabs.com/jobs/9', true, 'Tecnología'),
  (uuid_generate_v4()::text, 'Product Manager', 'Gestión de productos digitales', 'StartUp Hub', 'Remoto', 'senior', 'remoto', 'Gs. 10.000.000 - 16.000.000', ARRAY['Product Management', 'Agile', 'Roadmapping'], 'externo', 'https://startuphub.com/jobs/10', true, 'Gestión'),
  (uuid_generate_v4()::text, 'Desarrollador Mobile Flutter', 'Apps iOS y Android', 'App Factory', 'Asunción, Paraguay', 'medio', 'hibrido', 'Gs. 6.500.000 - 10.000.000', ARRAY['Flutter', 'Dart', 'Firebase'], 'externo', 'https://appfactory.com/jobs/11', true, 'Tecnología'),
  (uuid_generate_v4()::text, 'Scrum Master', 'Facilitador de metodologías ágiles', 'Consulting Group', 'Remoto', 'senior', 'remoto', 'Gs. 8.500.000 - 13.000.000', ARRAY['Scrum', 'Agile', 'Certificación CSM'], 'externo', 'https://consultinggroup.com/jobs/12', true, 'Gestión'),
  (uuid_generate_v4()::text, 'Data Scientist', 'Machine Learning y análisis predictivo', 'AI Research Center', 'Remoto', 'senior', 'remoto', 'Gs. 11.000.000 - 18.000.000', ARRAY['Python', 'TensorFlow', 'ML'], 'externo', 'https://airesearch.com/jobs/13', true, 'Tecnología'),
  (uuid_generate_v4()::text, 'Diseñador Gráfico', 'Diseño visual y branding', 'Creative Agency', 'Asunción, Paraguay', 'junior', 'presencial', 'Gs. 4.000.000 - 6.500.000', ARRAY['Photoshop', 'Illustrator', 'Portfolio'], 'externo', 'https://creativeagency.com/jobs/14', true, 'Diseño'),
  (uuid_generate_v4()::text, 'Arquitecto de Software', 'Diseño de arquitectura de sistemas', 'Enterprise Solutions', 'Remoto', 'senior', 'remoto', 'Gs. 12.000.000 - 20.000.000', ARRAY['Microservicios', 'Cloud', '10+ años'], 'externo', 'https://enterprisesolutions.com/jobs/15', true, 'Tecnología')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
SELECT 'courses' AS tabla, COUNT(*) AS total FROM courses
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'job_vacancies', COUNT(*) FROM job_vacancies WHERE is_active = true
UNION ALL
SELECT 'career_advice', COUNT(*) FROM career_advice;
