-- Inserta datos de ejemplo en la tabla courses
INSERT INTO "courses" (title, description, provider, url, language, has_spanish_subtitles, category, is_free, image_url)
SELECT 'Fundamentos de JavaScript', 'Aprende JavaScript desde cero.', 'Platzi', 'https://platzi.com/cursos/javascript', 'es', true, 'Programación', true, 'https://platzi.com/images/js.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Fundamentos de JavaScript')
UNION ALL
SELECT 'React.js Avanzado', 'Domina React con hooks y context.', 'Platzi', 'https://platzi.com/cursos/react-avanzado', 'es', true, 'Programación', false, 'https://platzi.com/images/react.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'React.js Avanzado')
UNION ALL
SELECT 'Python para Data Science', 'Introducción a Python para análisis de datos.', 'Coursera', 'https://coursera.org/python-data-science', 'en', true, 'Ciencia de Datos', false, 'https://coursera.org/images/python.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Python para Data Science')
UNION ALL
SELECT 'Desarrollo Web con HTML y CSS', 'Crea sitios web modernos.', 'Udemy', 'https://udemy.com/html-css', 'es', true, 'Desarrollo Web', true, 'https://udemy.com/images/html.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Desarrollo Web con HTML y CSS')
UNION ALL
SELECT 'Node.js y Express', 'Construye APIs con Node.js.', 'Platzi', 'https://platzi.com/cursos/nodejs', 'es', true, 'Programación', false, 'https://platzi.com/images/nodejs.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Node.js y Express')
UNION ALL
SELECT 'Machine Learning con Python', 'Aprende algoritmos de machine learning.', 'Coursera', 'https://coursera.org/ml-python', 'en', false, 'Ciencia de Datos', false, 'https://coursera.org/images/ml.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Machine Learning con Python')
UNION ALL
SELECT 'Java Spring Boot', 'Desarrollo de aplicaciones backend con Java.', 'Udemy', 'https://udemy.com/spring-boot', 'es', true, 'Programación', false, 'https://udemy.com/images/spring.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Java Spring Boot')
UNION ALL
SELECT 'Diseño UX/UI', 'Crea interfaces atractivas y funcionales.', 'Domestika', 'https://domestika.org/ux-ui', 'es', true, 'Diseño', true, 'https://domestika.org/images/uxui.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Diseño UX/UI')
UNION ALL
SELECT 'TypeScript desde Cero', 'Aprende TypeScript para aplicaciones modernas.', 'Platzi', 'https://platzi.com/cursos/typescript', 'es', true, 'Programación', false, 'https://platzi.com/images/typescript.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'TypeScript desde Cero')
UNION ALL
SELECT 'AWS Cloud Practitioner', 'Certificación introductoria de AWS.', 'AWS Training', 'https://aws.training/cloud-practitioner', 'en', true, 'Cloud Computing', false, 'https://aws.training/images/aws.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'AWS Cloud Practitioner')
UNION ALL
SELECT 'Desarrollo de Apps con Flutter', 'Crea aplicaciones móviles multiplataforma.', 'Udemy', 'https://udemy.com/flutter', 'es', true, 'Desarrollo Móvil', false, 'https://udemy.com/images/flutter.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Desarrollo de Apps con Flutter')
UNION ALL
SELECT 'SQL para Análisis de Datos', 'Domina consultas SQL avanzadas.', 'Coursera', 'https://coursera.org/sql-data', 'en', true, 'Bases de Datos', false, 'https://coursera.org/images/sql.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'SQL para Análisis de Datos')
UNION ALL
SELECT 'Vue.js para Principiantes', 'Construye aplicaciones con Vue.js.', 'Platzi', 'https://platzi.com/cursos/vuejs', 'es', true, 'Programación', true, 'https://platzi.com/images/vue.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Vue.js para Principiantes')
UNION ALL
SELECT 'Ciberseguridad Básica', 'Introducción a la seguridad informática.', 'edX', 'https://edx.org/ciberseguridad', 'es', true, 'Ciberseguridad', true, 'https://edx.org/images/cyber.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Ciberseguridad Básica')
UNION ALL
SELECT 'Desarrollo con Angular', 'Crea aplicaciones SPA con Angular.', 'Udemy', 'https://udemy.com/angular', 'es', true, 'Programación', false, 'https://udemy.com/images/angular.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Desarrollo con Angular')
UNION ALL
SELECT 'Big Data con Hadoop', 'Procesamiento de datos a gran escala.', 'Coursera', 'https://coursera.org/hadoop', 'en', false, 'Big Data', false, 'https://coursera.org/images/hadoop.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Big Data con Hadoop')
UNION ALL
SELECT 'Desarrollo de Videojuegos con Unity', 'Crea juegos 2D y 3D.', 'Domestika', 'https://domestika.org/unity', 'es', true, 'Desarrollo de Videojuegos', false, 'https://domestika.org/images/unity.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Desarrollo de Videojuegos con Unity')
UNION ALL
SELECT 'Kubernetes para DevOps', 'Orquestación de contenedores con Kubernetes.', 'Udemy', 'https://udemy.com/kubernetes', 'es', true, 'DevOps', false, 'https://udemy.com/images/kubernetes.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Kubernetes para DevOps')
UNION ALL
SELECT 'Git y GitHub', 'Control de versiones con Git.', 'Platzi', 'https://platzi.com/cursos/git', 'es', true, 'Herramientas', true, 'https://platzi.com/images/git.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Git y GitHub')
UNION ALL
SELECT 'Introducción a Blockchain', 'Conceptos básicos de blockchain.', 'edX', 'https://edx.org/blockchain', 'en', true, 'Blockchain', false, 'https://edx.org/images/blockchain.png'
WHERE NOT EXISTS (SELECT 1 FROM "courses" WHERE title = 'Introducción a Blockchain');

-- Inserta datos de ejemplo en la tabla events
INSERT INTO "events" (title, description, organizer, url, event_date, location, is_online, category, image_url)
SELECT 'DevFest 2025', 'Conferencia de desarrolladores de Google.', 'GDG Bogotá', 'https://devfest.co/2025', CURRENT_TIMESTAMP + INTERVAL '30 days', 'Bogotá, Colombia', false, 'Tecnología', 'https://devfest.co/images/2025.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'DevFest 2025')
UNION ALL
SELECT 'JSConf México', 'Evento de JavaScript en México.', 'JSConf', 'https://jsconf.mx', CURRENT_TIMESTAMP + INTERVAL '45 days', 'Ciudad de México', false, 'Programación', 'https://jsconf.mx/images/jsconf.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'JSConf México')
UNION ALL
SELECT 'Webinar de IA', 'Explora avances en inteligencia artificial.', 'Platzi', 'https://platzi.com/webinar-ia', CURRENT_TIMESTAMP + INTERVAL '15 days', 'Online', true, 'Inteligencia Artificial', 'https://platzi.com/images/ia.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'Webinar de IA')
UNION ALL
SELECT 'Hackathon UPE', 'Competencia de programación.', 'UPE', 'https://upe.com/hackathon', CURRENT_TIMESTAMP + INTERVAL '60 days', 'Lima, Perú', false, 'Programación', 'https://upe.com/images/hackathon.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'Hackathon UPE')
UNION ALL
SELECT 'AWS Summit Online', 'Evento sobre servicios en la nube.', 'AWS', 'https://aws.amazon.com/summit', CURRENT_TIMESTAMP + INTERVAL '20 days', 'Online', true, 'Cloud Computing', 'https://aws.amazon.com/images/summit.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'AWS Summit Online')
UNION ALL
SELECT 'Taller de React', 'Taller práctico de React.js.', 'CódigoFacilito', 'https://codigofacilito.com/taller-react', CURRENT_TIMESTAMP + INTERVAL '25 days', 'Online', true, 'Programación', 'https://codigofacilito.com/images/react.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'Taller de React')
UNION ALL
SELECT 'Data Science Meetup', 'Encuentro de profesionales de datos.', 'Data Community', 'https://datacommunity.org/meetup', CURRENT_TIMESTAMP + INTERVAL '35 days', 'Santiago, Chile', false, 'Ciencia de Datos', 'https://datacommunity.org/images/meetup.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'Data Science Meetup')
UNION ALL
SELECT 'PyCon Argentina', 'Conferencia de Python.', 'PyCon', 'https://pycon.ar', CURRENT_TIMESTAMP + INTERVAL '50 days', 'Buenos Aires, Argentina', false, 'Programación', 'https://pycon.ar/images/pycon.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'PyCon Argentina')
UNION ALL
SELECT 'Webinar de Ciberseguridad', 'Protege tus aplicaciones.', 'edX', 'https://edx.org/webinar-cyber', CURRENT_TIMESTAMP + INTERVAL '10 days', 'Online', true, 'Ciberseguridad', 'https://edx.org/images/cyber.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'Webinar de Ciberseguridad')
UNION ALL
SELECT 'UX Day Bogotá', 'Evento sobre diseño de experiencia.', 'UXPA', 'https://uxpa.org/bogota', CURRENT_TIMESTAMP + INTERVAL '40 days', 'Bogotá, Colombia', false, 'Diseño', 'https://uxpa.org/images/uxday.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'UX Day Bogotá')
UNION ALL
SELECT 'Taller de Docker', 'Aprende contenedores con Docker.', 'CódigoFacilito', 'https://codigofacilito.com/taller-docker', CURRENT_TIMESTAMP + INTERVAL '22 days', 'Online', true, 'DevOps', 'https://codigofacilito.com/images/docker.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'Taller de Docker')
UNION ALL
SELECT 'Node.js Summit', 'Conferencia sobre Node.js.', 'NodeConf', 'https://nodeconf.org', CURRENT_TIMESTAMP + INTERVAL '55 days', 'Sao Paulo, Brasil', false, 'Programación', 'https://nodeconf.org/images/node.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'Node.js Summit')
UNION ALL
SELECT 'Webinar de Blockchain', 'Explora tecnología blockchain.', 'Platzi', 'https://platzi.com/webinar-blockchain', CURRENT_TIMESTAMP + INTERVAL '18 days', 'Online', true, 'Blockchain', 'https://platzi.com/images/blockchain.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'Webinar de Blockchain')
UNION ALL
SELECT 'Flutter Meetup', 'Encuentro de desarrolladores Flutter.', 'Flutter Community', 'https://fluttercommunity.dev/meetup', CURRENT_TIMESTAMP + INTERVAL '32 days', 'Medellín, Colombia', false, 'Desarrollo Móvil', 'https://fluttercommunity.dev/images/flutter.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'Flutter Meetup')
UNION ALL
SELECT 'Taller de Git', 'Control de versiones con Git.', 'CódigoFacilito', 'https://codigofacilito.com/taller-git', CURRENT_TIMESTAMP + INTERVAL '12 days', 'Online', true, 'Herramientas', 'https://codigofacilito.com/images/git.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'Taller de Git')
UNION ALL
SELECT 'AI Conference LATAM', 'Conferencia de IA en América Latina.', 'AI LATAM', 'https://ailatam.org/conference', CURRENT_TIMESTAMP + INTERVAL '65 days', 'Ciudad de México', false, 'Inteligencia Artificial', 'https://ailatam.org/images/ai.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'AI Conference LATAM');

-- Inserta datos de ejemplo en la tabla job_vacancies
INSERT INTO "job_vacancies" (title, description, company, location, job_type, modality, salary_range, requirements, apply_type, external_url, is_active, category)
SELECT 'Desarrollador Full Stack', 'Buscamos desarrollador con experiencia en React y Node.js', 'TechCorp', 'Asunción, Paraguay', 'junior', 'hibrido', 'Gs. 5.000.000 - 8.000.000', ARRAY['React', 'Node.js', '2+ años experiencia'], 'externo', 'https://techcorp.com/jobs/1', true, 'Tecnología'
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Desarrollador Full Stack' AND company = 'TechCorp')
UNION ALL
SELECT 'Diseñador UX/UI', 'Diseñador creativo para productos digitales', 'Design Studio', 'Remoto', 'medio', 'remoto', 'Gs. 6.000.000 - 10.000.000', ARRAY['Figma', 'Adobe XD', 'Portfolio'], 'externo', 'https://designstudio.com/jobs/2', true, 'Diseño'
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Diseñador UX/UI' AND company = 'Design Studio')
UNION ALL
SELECT 'Analista de Datos', 'Análisis y visualización de datos', 'Data Analytics Co', 'Ciudad del Este, Paraguay', 'junior', 'presencial', 'Gs. 4.500.000 - 7.000.000', ARRAY['SQL', 'Python', 'Power BI'], 'externo', 'https://dataanalytics.com/jobs/3', true, 'Tecnología'
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Analista de Datos' AND company = 'Data Analytics Co')
UNION ALL
SELECT 'Desarrollador Frontend React', 'Desarrollo de interfaces modernas', 'Software Factory', 'Remoto', 'senior', 'remoto', 'Gs. 8.000.000 - 12.000.000', ARRAY['React', 'TypeScript', '5+ años'], 'externo', 'https://softwarefactory.com/jobs/4', true, 'Tecnología'
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Desarrollador Frontend React' AND company = 'Software Factory')
UNION ALL
SELECT 'Especialista en Marketing Digital', 'Gestión de campañas digitales', 'Marketing Hub', 'Asunción, Paraguay', 'medio', 'hibrido', 'Gs. 5.500.000 - 9.000.000', ARRAY['Google Ads', 'Meta Ads', 'Analytics'], 'externo', 'https://marketinghub.com/jobs/5', true, 'Marketing'
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Especialista en Marketing Digital' AND company = 'Marketing Hub')
UNION ALL
SELECT 'DevOps Engineer', 'Automatización y CI/CD', 'Cloud Services SA', 'Remoto', 'senior', 'remoto', 'Gs. 9.000.000 - 15.000.000', ARRAY['AWS', 'Docker', 'Kubernetes'], 'externo', 'https://cloudservices.com/jobs/6', true, 'Tecnología'
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'DevOps Engineer' AND company = 'Cloud Services SA')
UNION ALL
SELECT 'Desarrollador Backend Python', 'APIs y microservicios', 'Tech Solutions PY', 'Asunción, Paraguay', 'medio', 'presencial', 'Gs. 7.000.000 - 11.000.000', ARRAY['Python', 'Django', 'PostgreSQL'], 'externo', 'https://techsolutions.com/jobs/7', true, 'Tecnología'
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Desarrollador Backend Python' AND company = 'Tech Solutions PY')
UNION ALL
SELECT 'Community Manager', 'Gestión de redes sociales', 'Digital Marketing Pro', 'Remoto', 'junior', 'remoto', 'Gs. 3.500.000 - 5.500.000', ARRAY['Redes Sociales', 'Canva', 'Copywriting'], 'externo', 'https://digitalmarketing.com/jobs/8', true, 'Marketing'
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Community Manager' AND company = 'Digital Marketing Pro')
UNION ALL
SELECT 'QA Tester Automation', 'Testing automatizado', 'Innovate Labs', 'Ciudad del Este, Paraguay', 'medio', 'hibrido', 'Gs. 6.000.000 - 9.500.000', ARRAY['Selenium', 'Cypress', 'Testing'], 'externo', 'https://innovatelabs.com/jobs/9', true, 'Tecnología'
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'QA Tester Automation' AND company = 'Innovate Labs')
UNION ALL
SELECT 'Product Manager', 'Gestión de productos digitales', 'StartUp Hub', 'Remoto', 'senior', 'remoto', 'Gs. 10.000.000 - 16.000.000', ARRAY['Product Management', 'Agile', 'Roadmapping'], 'externo', 'https://startuphub.com/jobs/10', true, 'Gestión'
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Product Manager' AND company = 'StartUp Hub')
UNION ALL
SELECT 'Desarrollador Mobile Flutter', 'Apps iOS y Android', 'App Factory', 'Asunción, Paraguay', 'medio', 'hibrido', 'Gs. 6.500.000 - 10.000.000', ARRAY['Flutter', 'Dart', 'Firebase'], 'externo', 'https://appfactory.com/jobs/11', true, 'Tecnología'
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Desarrollador Mobile Flutter' AND company = 'App Factory')
UNION ALL
SELECT 'Scrum Master', 'Facilitador de metodologías ágiles', 'Consulting Group', 'Remoto', 'senior', 'remoto', 'Gs. 8.500.000 - 13.000.000', ARRAY['Scrum', 'Agile', 'Certificación CSM'], 'externo', 'https://consultinggroup.com/jobs/12', true, 'Gestión'
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Scrum Master' AND company = 'Consulting Group')
UNION ALL
SELECT 'Data Scientist', 'Machine Learning y análisis predictivo', 'AI Research Center', 'Remoto', 'senior', 'remoto', 'Gs. 11.000.000 - 18.000.000', ARRAY['Python', 'TensorFlow', 'ML'], 'externo', 'https://airesearch.com/jobs/13', true, 'Tecnología'
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Data Scientist' AND company = 'AI Research Center')
UNION ALL
SELECT 'Diseñador Gráfico', 'Diseño visual y branding', 'Creative Agency', 'Asunción, Paraguay', 'junior', 'presencial', 'Gs. 4.000.000 - 6.500.000', ARRAY['Photoshop', 'Illustrator', 'Portfolio'], 'externo', 'https://creativeagency.com/jobs/14', true, 'Diseño'
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Diseñador Gráfico' AND company = 'Creative Agency')
UNION ALL
SELECT 'Arquitecto de Software', 'Diseño de arquitectura de sistemas', 'Enterprise Solutions', 'Remoto', 'senior', 'remoto', 'Gs. 12.000.000 - 20.000.000', ARRAY['Microservicios', 'Cloud', '10+ años'], 'externo', 'https://enterprisesolutions.com/jobs/15', true, 'Tecnología'
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Arquitecto de Software' AND company = 'Enterprise Solutions');
