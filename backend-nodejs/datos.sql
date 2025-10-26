-- Limpiar todas las tablas relacionadas antes de poblar datos
TRUNCATE TABLE "job_applications" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "saved_items" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "courses" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "events" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "job_vacancies" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;
-- Agrega aquí cualquier otra tabla dependiente, por ejemplo:
-- TRUNCATE TABLE "notifications" RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE "logs" RESTART IDENTITY CASCADE;
-- Limpiar todas las tablas relacionadas antes de poblar datos
TRUNCATE TABLE "job_applications" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "saved_items" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "courses" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "events" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "job_vacancies" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;
-- Enum para modalidad de trabajo
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'modalitytype') THEN
		CREATE TYPE "ModalityType" AS ENUM ('remoto', 'hibrido', 'presencial');
	END IF;
END$$;
-- POPULATE TABLES WITH REALISTIC SAMPLE DATA
-- Inserta 20 ejemplos realistas por tabla, respetando restricciones y dependencias
-- Usa WHERE NOT EXISTS para evitar duplicados y corrige el error de tipo de arreglo vacío

-- 1. Users (20 registros: 10 estudiantes, 10 empresas)
INSERT INTO "users" (email, name, role, is_verified, github_url, linkedin_url, portfolio_url, skills, bio, company_name, company_document, cv_file_path, certificate_files, degree_files)
SELECT 'ana.garcia@example.com', 'Ana García López', 'estudiante'::"UserRole", true, 'https://github.com/anagarcia', 'https://linkedin.com/in/anagarcia', 'https://anagarcia.dev', ARRAY['JavaScript', 'React', 'CSS']::TEXT[], 'Estudiante de Ingeniería en Sistemas apasionada por el desarrollo web.', NULL, NULL, '/cv/ana_garcia.pdf', ARRAY['{"name": "Certificado JavaScript", "url": "https://platzi.com/cert/js"}'::JSONB]::JSONB[], ARRAY['{"name": "Título Ingeniería", "url": "https://univ.com/degree"}'::JSONB]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'ana.garcia@example.com')
UNION ALL
SELECT 'carlos.lopez@example.com', 'Carlos López Ramírez', 'estudiante'::"UserRole", true, 'https://github.com/carloslopez', 'https://linkedin.com/in/carloslopez', NULL, ARRAY['Python', 'Django', 'SQL']::TEXT[], 'Estudiante de Ciencia de Datos con interés en IA.', NULL, NULL, '/cv/carlos_lopez.pdf', ARRAY['{"name": "Certificado Python", "url": "https://coursera.org/cert/python"}'::JSONB]::JSONB[], ARRAY[]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'carlos.lopez@example.com')
UNION ALL
SELECT 'maria.rodriguez@example.com', 'María Rodríguez Gómez', 'estudiante'::"UserRole", false, 'https://github.com/mariarodriguez', NULL, 'https://mariarodriguez.dev', ARRAY['Java', 'Spring', 'MySQL']::TEXT[], 'Apasionada por el desarrollo backend.', NULL, NULL, '/cv/maria_rodriguez.pdf', ARRAY[]::JSONB[], ARRAY['{"name": "Título Ingeniería", "url": "https://univ.com/degree"}'::JSONB]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'maria.rodriguez@example.com')
UNION ALL
SELECT 'juan.martinez@example.com', 'Juan Martínez Pérez', 'estudiante'::"UserRole", true, 'https://github.com/juanmartinez', 'https://linkedin.com/in/juanmartinez', NULL, ARRAY['Node.js', 'MongoDB', 'Express']::TEXT[], 'Desarrollador full-stack en formación.', NULL, NULL, NULL, ARRAY['{"name": "Certificado Node.js", "url": "https://udemy.com/cert/nodejs"}'::JSONB]::JSONB[], ARRAY[]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'juan.martinez@example.com')
UNION ALL
SELECT 'sofia.hernandez@example.com', 'Sofía Hernández Díaz', 'estudiante'::"UserRole", true, 'https://github.com/sofiahernandez', 'https://linkedin.com/in/sofiahernandez', 'https://sofiahernandez.dev', ARRAY['React', 'TypeScript', 'GraphQL']::TEXT[], 'Estudiante de Informática enfocada en frontend.', NULL, NULL, '/cv/sofia_hernandez.pdf', ARRAY['{"name": "Certificado React", "url": "https://platzi.com/cert/react"}'::JSONB]::JSONB[], ARRAY['{"name": "Título Informática", "url": "https://univ.com/degree"}'::JSONB]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'sofia.hernandez@example.com')
UNION ALL
SELECT 'diego.sanchez@example.com', 'Diego Sánchez Torres', 'estudiante'::"UserRole", false, 'https://github.com/diegosanchez', NULL, NULL, ARRAY['C#', '.NET', 'SQL Server']::TEXT[], 'Apasionado por el desarrollo de aplicaciones empresariales.', NULL, NULL, '/cv/diego_sanchez.pdf', ARRAY[]::JSONB[], ARRAY[]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'diego.sanchez@example.com')
UNION ALL
SELECT 'laura.gomez@example.com', 'Laura Gómez Fernández', 'estudiante'::"UserRole", true, 'https://github.com/lauragomez', 'https://linkedin.com/in/lauragomez', 'https://lauragomez.dev', ARRAY['Python', 'Flask', 'PostgreSQL']::TEXT[], 'Estudiante de Ciencia de Datos con experiencia en APIs.', NULL, NULL, '/cv/laura_gomez.pdf', ARRAY['{"name": "Certificado Flask", "url": "https://udemy.com/cert/flask"}'::JSONB]::JSONB[], ARRAY[]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'laura.gomez@example.com')
UNION ALL
SELECT 'andres.ruiz@example.com', 'Andrés Ruiz Morales', 'estudiante'::"UserRole", true, 'https://github.com/andresruiz', NULL, 'https://andresruiz.dev', ARRAY['JavaScript', 'Vue.js', 'Firebase']::TEXT[], 'Desarrollador frontend con interés en aplicaciones móviles.', NULL, NULL, NULL, ARRAY['{"name": "Certificado Vue.js", "url": "https://coursera.org/cert/vue"}'::JSONB]::JSONB[], ARRAY['{"name": "Título Ingeniería", "url": "https://univ.com/degree"}'::JSONB]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'andres.ruiz@example.com')
UNION ALL
SELECT 'valeria.molina@example.com', 'Valeria Molina Castro', 'estudiante'::"UserRole", false, 'https://github.com/valeriamolina', 'https://linkedin.com/in/valeriamolina', NULL, ARRAY['Go', 'Docker', 'Kubernetes']::TEXT[], 'Estudiante de DevOps con interés en infraestructura.', NULL, NULL, '/cv/valeria_molina.pdf', ARRAY[]::JSONB[], ARRAY[]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'valeria.molina@example.com')
UNION ALL
SELECT 'felipe.torres@example.com', 'Felipe Torres Vargas', 'estudiante'::"UserRole", true, 'https://github.com/felipetorres', 'https://linkedin.com/in/felipetorres', 'https://felipetorres.dev', ARRAY['Angular', 'TypeScript', 'MongoDB']::TEXT[], 'Apasionado por el desarrollo de aplicaciones web modernas.', NULL, NULL, '/cv/felipe_torres.pdf', ARRAY['{"name": "Certificado Angular", "url": "https://platzi.com/cert/angular"}'::JSONB]::JSONB[], ARRAY['{"name": "Título Informática", "url": "https://univ.com/degree"}'::JSONB]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'felipe.torres@example.com')
UNION ALL
SELECT 'hr@tecnosoft.com', 'TecnoSoft S.A.', 'empresa'::"UserRole", true, NULL, 'https://linkedin.com/company/tecnosoft', NULL, ARRAY[]::TEXT[], 'Empresa líder en desarrollo de software.', 'TecnoSoft S.A.', 'RUC1234567890', NULL, ARRAY[]::JSONB[], ARRAY[]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'hr@tecnosoft.com')
UNION ALL
SELECT 'recruit@innovatech.com', 'InnovaTech Ltda.', 'empresa'::"UserRole", true, NULL, 'https://linkedin.com/company/innovatech', NULL, ARRAY[]::TEXT[], 'Especialistas en soluciones de IA.', 'InnovaTech Ltda.', 'RUC9876543210', NULL, ARRAY[]::JSONB[], ARRAY[]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'recruit@innovatech.com')
UNION ALL
SELECT 'jobs@datasolutions.com', 'DataSolutions S.A.', 'empresa'::"UserRole", true, NULL, 'https://linkedin.com/company/datasolutions', NULL, ARRAY[]::TEXT[], 'Consultoría en ciencia de datos.', 'DataSolutions S.A.', 'RUC4567891234', NULL, ARRAY[]::JSONB[], ARRAY[]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'jobs@datasolutions.com')
UNION ALL
SELECT 'careers@codewave.com', 'CodeWave Tech', 'empresa'::"UserRole", true, NULL, 'https://linkedin.com/company/codewave', NULL, ARRAY[]::TEXT[], 'Desarrollo de aplicaciones móviles.', 'CodeWave Tech', 'RUC7891234567', NULL, ARRAY[]::JSONB[], ARRAY[]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'careers@codewave.com')
UNION ALL
SELECT 'hr@nextgen.com', 'NextGen Solutions', 'empresa'::"UserRole", true, NULL, 'https://linkedin.com/company/nextgen', NULL, ARRAY[]::TEXT[], 'Innovación en tecnología blockchain.', 'NextGen Solutions', 'RUC3216549870', NULL, ARRAY[]::JSONB[], ARRAY[]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'hr@nextgen.com')
UNION ALL
SELECT 'recruit@softpeak.com', 'SoftPeak S.A.', 'empresa'::"UserRole", true, NULL, 'https://linkedin.com/company/softpeak', NULL, ARRAY[]::TEXT[], 'Soluciones empresariales en la nube.', 'SoftPeak S.A.', 'RUC6543217890', NULL, ARRAY[]::JSONB[], ARRAY[]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'recruit@softpeak.com')
UNION ALL
SELECT 'jobs@techbridge.com', 'TechBridge Corp.', 'empresa'::"UserRole", true, NULL, 'https://linkedin.com/company/techbridge', NULL, ARRAY[]::TEXT[], 'Desarrollo de software personalizado.', 'TechBridge Corp.', 'RUC1237894560', NULL, ARRAY[]::JSONB[], ARRAY[]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'jobs@techbridge.com')
UNION ALL
SELECT 'hr@digitalflow.com', 'DigitalFlow Ltda.', 'empresa'::"UserRole", true, NULL, 'https://linkedin.com/company/digitalflow', NULL, ARRAY[]::TEXT[], 'Transformación digital para empresas.', 'DigitalFlow Ltda.', 'RUC4561237890', NULL, ARRAY[]::JSONB[], ARRAY[]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'hr@digitalflow.com')
UNION ALL
SELECT 'careers@aiworks.com', 'AIWorks S.A.', 'empresa'::"UserRole", true, NULL, 'https://linkedin.com/company/aiworks', NULL, ARRAY[]::TEXT[], 'Líderes en inteligencia artificial.', 'AIWorks S.A.', 'RUC7894561230', NULL, ARRAY[]::JSONB[], ARRAY[]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'careers@aiworks.com')
UNION ALL
SELECT 'recruit@cloudtech.com', 'CloudTech Solutions', 'empresa'::"UserRole", true, NULL, 'https://linkedin.com/company/cloudtech', NULL, ARRAY[]::TEXT[], 'Especialistas en infraestructura cloud.', 'CloudTech Solutions', 'RUC1472583690', NULL, ARRAY[]::JSONB[], ARRAY[]::JSONB[]
WHERE NOT EXISTS (SELECT 1 FROM "users" WHERE email = 'recruit@cloudtech.com');

-- 2. Courses (20 registros)
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

-- 3. Events (20 registros)
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
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'AI Conference LATAM')
UNION ALL
SELECT 'Taller de Kubernetes', 'Orquestación de contenedores.', 'Udemy', 'https://udemy.com/taller-kubernetes', CURRENT_TIMESTAMP + INTERVAL '28 days', 'Online', true, 'DevOps', 'https://udemy.com/images/kubernetes.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'Taller de Kubernetes')
UNION ALL
SELECT 'Game Dev Meetup', 'Encuentro de desarrolladores de videojuegos.', 'GameDev Community', 'https://gamedev.org/meetup', CURRENT_TIMESTAMP + INTERVAL '38 days', 'Lima, Perú', false, 'Desarrollo de Videojuegos', 'https://gamedev.org/images/gamedev.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'Game Dev Meetup')
UNION ALL
SELECT 'Webinar de SQL', 'Consultas avanzadas en SQL.', 'Coursera', 'https://coursera.org/webinar-sql', CURRENT_TIMESTAMP + INTERVAL '15 days', 'Online', true, 'Bases de Datos', 'https://coursera.org/images/sql.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'Webinar de SQL')
UNION ALL
SELECT 'Startup Tech Fest', 'Evento para startups tecnológicas.', 'TechStars', 'https://techstars.com/fest', CURRENT_TIMESTAMP + INTERVAL '70 days', 'Santiago, Chile', false, 'Emprendimiento', 'https://techstars.com/images/fest.png'
WHERE NOT EXISTS (SELECT 1 FROM "events" WHERE title = 'Startup Tech Fest');

-- 4. Job Vacancies (20 registros)
-- Nota: Usa usuarios con rol 'empresa' (11-20) para posted_by_user_id
INSERT INTO "job_vacancies" (title, description, company, company_logo, location, job_type, modality, salary_range, requirements, responsibilities, benefits, apply_type, external_url, posted_by_user_id, is_active, category, experience_years)
SELECT 'Desarrollador Frontend Junior', 'Desarrollo de interfaces con React.', 'TecnoSoft S.A.', 'https://tecnosoft.com/logo.png', 'Bogotá, Colombia', 'junior'::"JobType", 'remoto'::"JobModality", '$2000-$3000', ARRAY['React', 'JavaScript', 'CSS']::TEXT[], ARRAY['Desarrollo de componentes', 'Pruebas unitarias'], ARRAY['Seguro médico', 'Capacitación'], 'interno'::"ApplyType", NULL, (SELECT id FROM "users" WHERE email = 'hr@tecnosoft.com'), true, 'Desarrollo Web', 1
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Desarrollador Frontend Junior')
UNION ALL
SELECT 'Ingeniero de Software Senior', 'Liderar desarrollo de APIs.', 'InnovaTech Ltda.', 'https://innovatech.com/logo.png', 'Ciudad de México', 'senior'::"JobType", 'hibrido'::"JobModality", '$4000-$5000', ARRAY['Node.js', 'Express', 'MongoDB']::TEXT[], ARRAY['Diseño de APIs', 'Mentoría'], ARRAY['Bonos', 'Vacaciones'], 'externo'::"ApplyType", 'https://innovatech.com/apply', (SELECT id FROM "users" WHERE email = 'recruit@innovatech.com'), true, 'Desarrollo Backend', 5
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Ingeniero de Software Senior')
UNION ALL
SELECT 'Científico de Datos Junior', 'Análisis de datos con Python.', 'DataSolutions S.A.', 'https://datasolutions.com/logo.png', 'Santiago, Chile', 'junior'::"JobType", 'presencial'::"JobModality", '$1800-$2500', ARRAY['Python', 'Pandas', 'SQL']::TEXT[], ARRAY['Análisis de datos', 'Reportes'], ARRAY['Seguro', 'Capacitación'], 'interno'::"ApplyType", NULL, (SELECT id FROM "users" WHERE email = 'jobs@datasolutions.com'), true, 'Ciencia de Datos', 1
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Científico de Datos Junior')
UNION ALL
SELECT 'Desarrollador Móvil', 'Desarrollo de apps con Flutter.', 'CodeWave Tech', 'https://codewave.com/logo.png', 'Lima, Perú', 'medio'::"JobType", 'remoto'::"JobModality", '$2500-$3500', ARRAY['Flutter', 'Dart']::TEXT[], ARRAY['Desarrollo de apps', 'Mantenimiento'], ARRAY['Bonos', 'Horario flexible'], 'externo'::"ApplyType", 'https://codewave.com/apply', (SELECT id FROM "users" WHERE email = 'careers@codewave.com'), true, 'Desarrollo Móvil', 3
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Desarrollador Móvil')
UNION ALL
SELECT 'Ingeniero DevOps', 'Gestión de infraestructura en AWS.', 'NextGen Solutions', 'https://nextgen.com/logo.png', 'Buenos Aires, Argentina', 'senior'::"JobType", 'hibrido'::"JobModality", '$4500-$5500', ARRAY['AWS', 'Docker', 'Kubernetes']::TEXT[], ARRAY['Automatización', 'CI/CD'], ARRAY['Seguro', 'Capacitación'], 'interno'::"ApplyType", NULL, (SELECT id FROM "users" WHERE email = 'hr@nextgen.com'), true, 'DevOps', 5
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Ingeniero DevOps')
UNION ALL
SELECT 'Desarrollador Backend Junior', 'APIs con Python y Django.', 'SoftPeak S.A.', 'https://softpeak.com/logo.png', 'Medellín, Colombia', 'junior'::"JobType", 'remoto'::"JobModality", '$2000-$2800', ARRAY['Python', 'Django', 'PostgreSQL']::TEXT[], ARRAY['Desarrollo de APIs', 'Pruebas'], ARRAY['Horario flexible', 'Capacitación'], 'interno'::"ApplyType", NULL, (SELECT id FROM "users" WHERE email = 'recruit@softpeak.com'), true, 'Desarrollo Backend', 1
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Desarrollador Backend Junior')
UNION ALL
SELECT 'Diseñador UX/UI', 'Diseño de interfaces modernas.', 'TechBridge Corp.', 'https://techbridge.com/logo.png', 'Sao Paulo, Brasil', 'medio'::"JobType", 'hibrido'::"JobModality", '$2200-$3200', ARRAY['Figma', 'Adobe XD']::TEXT[], ARRAY['Diseño de prototipos', 'Pruebas de usuario'], ARRAY['Seguro médico', 'Bonos'], 'externo'::"ApplyType", 'https://techbridge.com/apply', (SELECT id FROM "users" WHERE email = 'jobs@techbridge.com'), true, 'Diseño', 3
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Diseñador UX/UI')
UNION ALL
SELECT 'Analista de Ciberseguridad', 'Protección de sistemas.', 'DigitalFlow Ltda.', 'https://digitalflow.com/logo.png', 'Quito, Ecuador', 'medio'::"JobType", 'presencial'::"JobModality", '$2500-$3500', ARRAY['Ciberseguridad', 'Firewall']::TEXT[], ARRAY['Monitoreo de seguridad', 'Análisis de riesgos'], ARRAY['Seguro', 'Capacitación'], 'interno'::"ApplyType", NULL, (SELECT id FROM "users" WHERE email = 'hr@digitalflow.com'), true, 'Ciberseguridad', 3
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Analista de Ciberseguridad')
UNION ALL
SELECT 'Desarrollador Full-Stack', 'Desarrollo web con MERN.', 'AIWorks S.A.', 'https://aiworks.com/logo.png', 'Bogotá, Colombia', 'medio'::"JobType", 'remoto'::"JobModality", '$3000-$4000', ARRAY['React', 'Node.js', 'MongoDB']::TEXT[], ARRAY['Desarrollo full-stack', 'Mantenimiento'], ARRAY['Bonos', 'Horario flexible'], 'externo'::"ApplyType", 'https://aiworks.com/apply', (SELECT id FROM "users" WHERE email = 'careers@aiworks.com'), true, 'Desarrollo Web', 3
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Desarrollador Full-Stack')
UNION ALL
SELECT 'Ingeniero de Machine Learning', 'Modelos de IA avanzados.', 'CloudTech Solutions', 'https://cloudtech.com/logo.png', 'Santiago, Chile', 'senior'::"JobType", 'hibrido'::"JobModality", '$4500-$6000', ARRAY['Python', 'TensorFlow', 'PyTorch']::TEXT[], ARRAY['Desarrollo de modelos', 'Optimización'], ARRAY['Seguro', 'Bonos'], 'interno'::"ApplyType", NULL, (SELECT id FROM "users" WHERE email = 'recruit@cloudtech.com'), true, 'Inteligencia Artificial', 5
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Ingeniero de Machine Learning')
UNION ALL
SELECT 'Desarrollador Frontend', 'Interfaces con Angular.', 'TecnoSoft S.A.', 'https://tecnosoft.com/logo.png', 'Lima, Perú', 'junior'::"JobType", 'remoto'::"JobModality", '$2000-$2800', ARRAY['Angular', 'TypeScript']::TEXT[], ARRAY['Desarrollo de interfaces', 'Pruebas'], ARRAY['Capacitación', 'Seguro'], 'interno'::"ApplyType", NULL, (SELECT id FROM "users" WHERE email = 'hr@tecnosoft.com'), true, 'Desarrollo Web', 1
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Desarrollador Frontend')
UNION ALL
SELECT 'Ingeniero de Datos', 'Pipelines de datos con Spark.', 'InnovaTech Ltda.', 'https://innovatech.com/logo.png', 'Ciudad de México', 'senior'::"JobType", 'hibrido'::"JobModality", '$4000-$5000', ARRAY['Spark', 'Python', 'SQL']::TEXT[], ARRAY['Construcción de pipelines', 'Optimización'], ARRAY['Bonos', 'Vacaciones'], 'externo'::"ApplyType", 'https://innovatech.com/apply', (SELECT id FROM "users" WHERE email = 'recruit@innovatech.com'), true, 'Ciencia de Datos', 5
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Ingeniero de Datos')
UNION ALL
SELECT 'Desarrollador Backend', 'APIs con Java Spring.', 'DataSolutions S.A.', 'https://datasolutions.com/logo.png', 'Santiago, Chile', 'medio'::"JobType", 'presencial'::"JobModality", '$2500-$3500', ARRAY['Java', 'Spring', 'PostgreSQL']::TEXT[], ARRAY['Desarrollo de APIs', 'Mantenimiento'], ARRAY['Seguro', 'Capacitación'], 'interno'::"ApplyType", NULL, (SELECT id FROM "users" WHERE email = 'jobs@datasolutions.com'), true, 'Desarrollo Backend', 3
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Desarrollador Backend')
UNION ALL
SELECT 'Desarrollador de Videojuegos', 'Juegos con Unity.', 'CodeWave Tech', 'https://codewave.com/logo.png', 'Lima, Perú', 'medio'::"JobType", 'remoto'::"JobModality", '$2200-$3200', ARRAY['Unity', 'C#']::TEXT[], ARRAY['Desarrollo de juegos', 'Optimización'], ARRAY['Bonos', 'Horario flexible'], 'externo'::"ApplyType", 'https://codewave.com/apply', (SELECT id FROM "users" WHERE email = 'careers@codewave.com'), true, 'Desarrollo de Videojuegos', 3
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Desarrollador de Videojuegos')
UNION ALL
SELECT 'Ingeniero Cloud', 'Infraestructura en Azure.', 'NextGen Solutions', 'https://nextgen.com/logo.png', 'Buenos Aires, Argentina', 'senior'::"JobType", 'hibrido'::"JobModality", '$4000-$5000', ARRAY['Azure', 'Docker']::TEXT[], ARRAY['Gestión de infraestructura', 'Automatización'], ARRAY['Seguro', 'Capacitación'], 'interno'::"ApplyType", NULL, (SELECT id FROM "users" WHERE email = 'hr@nextgen.com'), true, 'Cloud Computing', 5
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Ingeniero Cloud')
UNION ALL
SELECT 'Analista QA', 'Pruebas de software automatizadas.', 'SoftPeak S.A.', 'https://softpeak.com/logo.png', 'Medellín, Colombia', 'junior'::"JobType", 'remoto'::"JobModality", '$1800-$2500', ARRAY['Selenium', 'Cypress']::TEXT[], ARRAY['Ejecución de pruebas', 'Reportes'], ARRAY['Horario flexible', 'Capacitación'], 'interno'::"ApplyType", NULL, (SELECT id FROM "users" WHERE email = 'recruit@softpeak.com'), true, 'Calidad', 1
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Analista QA')
UNION ALL
SELECT 'Desarrollador Mobile Senior', 'Apps con React Native.', 'TechBridge Corp.', 'https://techbridge.com/logo.png', 'Sao Paulo, Brasil', 'senior'::"JobType", 'hibrido'::"JobModality", '$4000-$5000', ARRAY['React Native', 'JavaScript']::TEXT[], ARRAY['Desarrollo de apps', 'Mentoría'], ARRAY['Seguro médico', 'Bonos'], 'externo'::"ApplyType", 'https://techbridge.com/apply', (SELECT id FROM "users" WHERE email = 'jobs@techbridge.com'), true, 'Desarrollo Móvil', 5
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Desarrollador Mobile Senior')
UNION ALL
SELECT 'Especialista en Blockchain', 'Desarrollo de contratos inteligentes.', 'DigitalFlow Ltda.', 'https://digitalflow.com/logo.png', 'Quito, Ecuador', 'medio'::"JobType", 'remoto'::"JobModality", '$3000-$4000', ARRAY['Solidity', 'Ethereum']::TEXT[], ARRAY['Desarrollo de contratos', 'Auditorías'], ARRAY['Seguro', 'Capacitación'], 'interno'::"ApplyType", NULL, (SELECT id FROM "users" WHERE email = 'hr@digitalflow.com'), true, 'Blockchain', 3
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Especialista en Blockchain')
UNION ALL
SELECT 'Desarrollador Full-Stack Junior', 'Desarrollo con MERN stack.', 'AIWorks S.A.', 'https://aiworks.com/logo.png', 'Bogotá, Colombia', 'junior'::"JobType", 'remoto'::"JobModality", '$2000-$2800', ARRAY['React', 'Node.js', 'MongoDB']::TEXT[], ARRAY['Desarrollo web', 'Pruebas'], ARRAY['Bonos', 'Horario flexible'], 'externo'::"ApplyType", 'https://aiworks.com/apply', (SELECT id FROM "users" WHERE email = 'careers@aiworks.com'), true, 'Desarrollo Web', 1
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Desarrollador Full-Stack Junior')
UNION ALL
SELECT 'Ingeniero de IA', 'Modelos de deep learning.', 'CloudTech Solutions', 'https://cloudtech.com/logo.png', 'Santiago, Chile', 'senior'::"JobType", 'hibrido'::"JobModality", '$4500-$6000', ARRAY['Python', 'TensorFlow']::TEXT[], ARRAY['Desarrollo de modelos', 'Investigación'], ARRAY['Seguro', 'Bonos'], 'interno'::"ApplyType", NULL, (SELECT id FROM "users" WHERE email = 'recruit@cloudtech.com'), true, 'Inteligencia Artificial', 5
WHERE NOT EXISTS (SELECT 1 FROM "job_vacancies" WHERE title = 'Ingeniero de IA');

-- 5. Saved Items (20 registros)
-- Nota: Asocia usuarios estudiantes (1-10) con courses, events y job_vacancies
INSERT INTO "saved_items" (user_id, item_type, course_id, event_id, job_vacancy_id)
SELECT (SELECT id FROM "users" WHERE email = 'ana.garcia@example.com'), 'course', (SELECT id FROM "courses" WHERE title = 'Fundamentos de JavaScript'), NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'ana.garcia@example.com') AND course_id = (SELECT id FROM "courses" WHERE title = 'Fundamentos de JavaScript'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'carlos.lopez@example.com'), 'course', (SELECT id FROM "courses" WHERE title = 'Python para Data Science'), NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'carlos.lopez@example.com') AND course_id = (SELECT id FROM "courses" WHERE title = 'Python para Data Science'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'maria.rodriguez@example.com'), 'course', (SELECT id FROM "courses" WHERE title = 'Java Spring Boot'), NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'maria.rodriguez@example.com') AND course_id = (SELECT id FROM "courses" WHERE title = 'Java Spring Boot'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'juan.martinez@example.com'), 'course', (SELECT id FROM "courses" WHERE title = 'Node.js y Express'), NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'juan.martinez@example.com') AND course_id = (SELECT id FROM "courses" WHERE title = 'Node.js y Express'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'sofia.hernandez@example.com'), 'course', (SELECT id FROM "courses" WHERE title = 'React.js Avanzado'), NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'sofia.hernandez@example.com') AND course_id = (SELECT id FROM "courses" WHERE title = 'React.js Avanzado'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'diego.sanchez@example.com'), 'event', NULL, (SELECT id FROM "events" WHERE title = 'DevFest 2025'), NULL
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'diego.sanchez@example.com') AND event_id = (SELECT id FROM "events" WHERE title = 'DevFest 2025'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'laura.gomez@example.com'), 'event', NULL, (SELECT id FROM "events" WHERE title = 'JSConf México'), NULL
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'laura.gomez@example.com') AND event_id = (SELECT id FROM "events" WHERE title = 'JSConf México'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'andres.ruiz@example.com'), 'event', NULL, (SELECT id FROM "events" WHERE title = 'Webinar de IA'), NULL
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'andres.ruiz@example.com') AND event_id = (SELECT id FROM "events" WHERE title = 'Webinar de IA'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'valeria.molina@example.com'), 'event', NULL, (SELECT id FROM "events" WHERE title = 'Hackathon UPE'), NULL
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'valeria.molina@example.com') AND event_id = (SELECT id FROM "events" WHERE title = 'Hackathon UPE'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'felipe.torres@example.com'), 'event', NULL, (SELECT id FROM "events" WHERE title = 'AWS Summit Online'), NULL
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'felipe.torres@example.com') AND event_id = (SELECT id FROM "events" WHERE title = 'AWS Summit Online'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'ana.garcia@example.com'), 'job_vacancy', NULL, NULL, (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Frontend Junior')
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'ana.garcia@example.com') AND job_vacancy_id = (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Frontend Junior'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'carlos.lopez@example.com'), 'job_vacancy', NULL, NULL, (SELECT id FROM "job_vacancies" WHERE title = 'Científico de Datos Junior')
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'carlos.lopez@example.com') AND job_vacancy_id = (SELECT id FROM "job_vacancies" WHERE title = 'Científico de Datos Junior'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'maria.rodriguez@example.com'), 'job_vacancy', NULL, NULL, (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Backend')
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'maria.rodriguez@example.com') AND job_vacancy_id = (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Backend'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'juan.martinez@example.com'), 'job_vacancy', NULL, NULL, (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Full-Stack')
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'juan.martinez@example.com') AND job_vacancy_id = (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Full-Stack'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'sofia.hernandez@example.com'), 'job_vacancy', NULL, NULL, (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Frontend')
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'sofia.hernandez@example.com') AND job_vacancy_id = (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Frontend'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'diego.sanchez@example.com'), 'course', (SELECT id FROM "courses" WHERE title = 'Desarrollo con Angular'), NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'diego.sanchez@example.com') AND course_id = (SELECT id FROM "courses" WHERE title = 'Desarrollo con Angular'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'laura.gomez@example.com'), 'course', (SELECT id FROM "courses" WHERE title = 'SQL para Análisis de Datos'), NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'laura.gomez@example.com') AND course_id = (SELECT id FROM "courses" WHERE title = 'SQL para Análisis de Datos'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'andres.ruiz@example.com'), 'event', NULL, (SELECT id FROM "events" WHERE title = 'Taller de Git'), NULL
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'andres.ruiz@example.com') AND event_id = (SELECT id FROM "events" WHERE title = 'Taller de Git'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'valeria.molina@example.com'), 'job_vacancy', NULL, NULL, (SELECT id FROM "job_vacancies" WHERE title = 'Ingeniero DevOps')
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'valeria.molina@example.com') AND job_vacancy_id = (SELECT id FROM "job_vacancies" WHERE title = 'Ingeniero DevOps'))
UNION ALL
SELECT (SELECT id FROM "users" WHERE email = 'felipe.torres@example.com'), 'job_vacancy', NULL, NULL, (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Full-Stack Junior')
WHERE NOT EXISTS (SELECT 1 FROM "saved_items" WHERE user_id = (SELECT id FROM "users" WHERE email = 'felipe.torres@example.com') AND job_vacancy_id = (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Full-Stack Junior'));

-- 6. Job Applications (20 registros)
-- Limpiar todas las tablas relacionadas antes de poblar datos
TRUNCATE TABLE "job_applications" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "saved_items" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "courses" RESTART IDENTITY CASCADE;
TRUNCATE TABLE "events" RESTART IDENTITY CASCADE;
-- Nota: Asocia usuarios estudiantes (1-10) con job_vacancies
INSERT INTO "job_applications" (job_vacancy_id, applicant_id, cover_letter, status)
SELECT * FROM (
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Frontend Junior') AS job_vacancy_id, (SELECT id FROM "users" WHERE email = 'ana.garcia@example.com') AS applicant_id, 'Apasionada por el desarrollo frontend, con experiencia en React.' AS cover_letter, 'nuevo'::"ApplicationStatus" AS status
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Científico de Datos Junior'), (SELECT id FROM "users" WHERE email = 'carlos.lopez@example.com'), 'Interesado en análisis de datos con Python.', 'en_revision'::"ApplicationStatus"
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Backend'), (SELECT id FROM "users" WHERE email = 'maria.rodriguez@example.com'), 'Experiencia en Java y Spring Boot.', 'nuevo'::"ApplicationStatus"
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Full-Stack'), (SELECT id FROM "users" WHERE email = 'juan.martinez@example.com'), 'Conocimientos en MERN stack.', 'entrevista'
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Frontend'), (SELECT id FROM "users" WHERE email = 'sofia.hernandez@example.com'), 'Experiencia en Angular y TypeScript.', 'nuevo'::"ApplicationStatus"
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Backend Junior'), (SELECT id FROM "users" WHERE email = 'diego.sanchez@example.com'), 'Interesado en APIs con Python.', 'en_revision'::"ApplicationStatus"
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Diseñador UX/UI'), (SELECT id FROM "users" WHERE email = 'laura.gomez@example.com'), 'Habilidades en diseño con Figma.', 'nuevo'::"ApplicationStatus"
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Analista QA'), (SELECT id FROM "users" WHERE email = 'andres.ruiz@example.com'), 'Experiencia en pruebas con Selenium.', 'entrevista'
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Ingeniero DevOps'), (SELECT id FROM "users" WHERE email = 'valeria.molina@example.com'), 'Conocimientos en Docker y AWS.', 'nuevo'::"ApplicationStatus"
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Full-Stack Junior'), (SELECT id FROM "users" WHERE email = 'felipe.torres@example.com'), 'Apasionado por el stack MERN.', 'en_revision'::"ApplicationStatus"
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Móvil'), (SELECT id FROM "users" WHERE email = 'ana.garcia@example.com'), 'Experiencia en Flutter.', 'nuevo'::"ApplicationStatus"
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Analista de Ciberseguridad'), (SELECT id FROM "users" WHERE email = 'carlos.lopez@example.com'), 'Interesado en ciberseguridad.', 'entrevista'
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador de Videojuegos'), (SELECT id FROM "users" WHERE email = 'maria.rodriguez@example.com'), 'Habilidades en Unity.', 'nuevo'::"ApplicationStatus"
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Ingeniero Cloud'), (SELECT id FROM "users" WHERE email = 'juan.martinez@example.com'), 'Conocimientos en Azure.', 'en_revision'::"ApplicationStatus"
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Desarrollador Mobile Senior'), (SELECT id FROM "users" WHERE email = 'sofia.hernandez@example.com'), 'Experiencia en React Native.', 'nuevo'::"ApplicationStatus"
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Especialista en Blockchain'), (SELECT id FROM "users" WHERE email = 'diego.sanchez@example.com'), 'Interesado en contratos inteligentes.', 'entrevista'
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Ingeniero de Machine Learning'), (SELECT id FROM "users" WHERE email = 'laura.gomez@example.com'), 'Conocimientos en TensorFlow.', 'nuevo'::"ApplicationStatus"
	UNION ALL
	SELECT (SELECT id FROM "job_vacancies" WHERE title = 'Ingeniero de Datos'), (SELECT id FROM "users" WHERE email = 'andres.ruiz@example.com'), 'Experiencia en Spark.', 'en_revision'::"ApplicationStatus"
) AS new_apps
WHERE NOT EXISTS (
	SELECT 1 FROM "job_applications" ja
	WHERE ja.job_vacancy_id = new_apps.job_vacancy_id AND ja.applicant_id = new_apps.applicant_id
);

-- 7. Scholarships (20 registros)
INSERT INTO "scholarships" (title, description, provider, url, category)
SELECT 'Beca Platzi 2025', 'Beca completa para cursos de Platzi.', 'Platzi', 'https://platzi.com/beca2025', 'Educación'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca Platzi 2025')
UNION ALL
SELECT 'Beca Coursera para LATAM', 'Acceso a cursos de Coursera.', 'Coursera', 'https://coursera.org/beca-latam', 'Educación'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca Coursera para LATAM')
UNION ALL
SELECT 'Beca UPE Tecnología', 'Apoyo para estudiantes de tecnología.', 'UPE', 'https://upe.com/beca-tecnologia', 'Tecnología'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca UPE Tecnología')
UNION ALL
SELECT 'Beca Santander Tech', 'Formación en habilidades digitales.', 'Banco Santander', 'https://santander.com/beca-tech', 'Tecnología'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca Santander Tech')
UNION ALL
SELECT 'Beca Google para Mujeres', 'Apoyo para mujeres en tecnología.', 'Google', 'https://google.com/beca-mujeres', 'Diversidad'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca Google para Mujeres')
UNION ALL
SELECT 'Beca AWS Educate', 'Formación en computación en la nube.', 'AWS', 'https://aws.amazon.com/educate', 'Cloud Computing'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca AWS Educate')
UNION ALL
SELECT 'Beca Microsoft Learn', 'Acceso a cursos de Microsoft.', 'Microsoft', 'https://microsoft.com/learn-beca', 'Tecnología'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca Microsoft Learn')
UNION ALL
SELECT 'Beca Oracle Academy', 'Formación en bases de datos.', 'Oracle', 'https://oracle.com/academy-beca', 'Bases de Datos'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca Oracle Academy')
UNION ALL
SELECT 'Beca edX Global', 'Cursos gratuitos en edX.', 'edX', 'https://edx.org/beca-global', 'Educación'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca edX Global')
UNION ALL
SELECT 'Beca Fundación Telefónica', 'Habilidades digitales para jóvenes.', 'Fundación Telefónica', 'https://telefonica.com/beca', 'Educación'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca Fundación Telefónica')
UNION ALL
SELECT 'Beca BBVA Tech', 'Apoyo para estudiantes de programación.', 'BBVA', 'https://bbva.com/beca-tech', 'Tecnología'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca BBVA Tech')
UNION ALL
SELECT 'Beca IBM Skills', 'Formación en IA y cloud.', 'IBM', 'https://ibm.com/skills-beca', 'Tecnología'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca IBM Skills')
UNION ALL
SELECT 'Beca Cisco Networking', 'Certificaciones en redes.', 'Cisco', 'https://cisco.com/networking-beca', 'Redes'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca Cisco Networking')
UNION ALL
SELECT 'Beca Digital House', 'Cursos de programación intensivos.', 'Digital House', 'https://digitalhouse.com/beca', 'Programación'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca Digital House')
UNION ALL
SELECT 'Beca Coderhouse', 'Formación en desarrollo y diseño.', 'Coderhouse', 'https://coderhouse.com/beca', 'Desarrollo Web'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca Coderhouse')
UNION ALL
SELECT 'Beca Universia', 'Apoyo para estudiantes universitarios.', 'Universia', 'https://universia.net/beca', 'Educación'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca Universia')
UNION ALL
SELECT 'Beca ProFuturo', 'Educación digital para jóvenes.', 'ProFuturo', 'https://profuturo.org/beca', 'Educación'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca ProFuturo')
UNION ALL
SELECT 'Beca Huawei Seeds', 'Formación en tecnología 5G.', 'Huawei', 'https://huawei.com/seeds-beca', 'Tecnología'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca Huawei Seeds')
UNION ALL
SELECT 'Beca Facebook Tech', 'Apoyo para desarrolladores.', 'Facebook', 'https://facebook.com/tech-beca', 'Programación'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca Facebook Tech')
UNION ALL
SELECT 'Beca Mercadolibre Dev', 'Formación en desarrollo web.', 'Mercadolibre', 'https://mercadolibre.com/beca-dev', 'Desarrollo Web'
WHERE NOT EXISTS (SELECT 1 FROM "scholarships" WHERE title = 'Beca Mercadolibre Dev');

-- 8. Certifications (20 registros)
INSERT INTO "certifications" (title, description, provider, url, category)
SELECT 'Certificación JavaScript', 'Certificación oficial de JavaScript.', 'Platzi', 'https://platzi.com/cert/javascript', 'Programación'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación JavaScript')
UNION ALL
SELECT 'Certificación React.js', 'Dominio de React.js.', 'Platzi', 'https://platzi.com/cert/react', 'Programación'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación React.js')
UNION ALL
SELECT 'Certificación Python', 'Certificación en Python.', 'Coursera', 'https://coursera.org/cert/python', 'Programación'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación Python')
UNION ALL
SELECT 'Certificación AWS Developer', 'Desarrollo en AWS.', 'AWS', 'https://aws.amazon.com/cert/developer', 'Cloud Computing'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación AWS Developer')
UNION ALL
SELECT 'Certificación Azure Fundamentals', 'Fundamentos de Azure.', 'Microsoft', 'https://microsoft.com/cert/azure-fundamentals', 'Cloud Computing'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación Azure Fundamentals')
UNION ALL
SELECT 'Certificación Google Data Analytics', 'Análisis de datos.', 'Google', 'https://google.com/cert/data-analytics', 'Ciencia de Datos'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación Google Data Analytics')
UNION ALL
SELECT 'Certificación Cisco CCNA', 'Redes y conectividad.', 'Cisco', 'https://cisco.com/cert/ccna', 'Redes'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación Cisco CCNA')
UNION ALL
SELECT 'Certificación Scrum Master', 'Gestión ágil de proyectos.', 'Scrum.org', 'https://scrum.org/cert/scrum-master', 'Gestión de Proyectos'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación Scrum Master')
UNION ALL
SELECT 'Certificación PMP', 'Gestión profesional de proyectos.', 'PMI', 'https://pmi.org/cert/pmp', 'Gestión de Proyectos'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación PMP')
UNION ALL
SELECT 'Certificación Node.js', 'Desarrollo backend con Node.js.', 'Udemy', 'https://udemy.com/cert/nodejs', 'Programación'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación Node.js')
UNION ALL
SELECT 'Certificación Java SE', 'Programación en Java.', 'Oracle', 'https://oracle.com/cert/java-se', 'Programación' 
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación Java SE')
UNION ALL
SELECT 'Certificación TensorFlow', 'Desarrollo de modelos de IA.', 'TensorFlow', 'https://tensorflow.org/cert', 'Inteligencia Artificial'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación TensorFlow')
UNION ALL
SELECT 'Certificación Kubernetes', 'Orquestación de contenedores.', 'CNCF', 'https://cncf.io/cert/kubernetes', 'DevOps'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación Kubernetes')
UNION ALL
SELECT 'Certificación Flutter', 'Desarrollo móvil con Flutter.', 'Udemy', 'https://udemy.com/cert/flutter', 'Desarrollo Móvil'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación Flutter')
UNION ALL
SELECT 'Certificación Ethical Hacking', 'Seguridad informática.', 'EC-Council', 'https://eccouncil.org/cert/ethical-hacking', 'Ciberseguridad'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación Ethical Hacking')
UNION ALL
SELECT 'Certificación UX Design', 'Diseño de experiencia de usuario.', 'Coursera', 'https://coursera.org/cert/ux-design', 'Diseño'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación UX Design')
UNION ALL
SELECT 'Certificación SQL', 'Consultas avanzadas en SQL.', 'Coursera', 'https://coursera.org/cert/sql', 'Bases de Datos'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación SQL')
UNION ALL
SELECT 'Certificación Unity', 'Desarrollo de videojuegos.', 'Unity', 'https://unity.com/cert', 'Desarrollo de Videojuegos'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación Unity')
UNION ALL
SELECT 'Certificación Git', 'Control de versiones con Git.', 'Platzi', 'https://platzi.com/cert/git', 'Herramientas'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación Git')
UNION ALL
SELECT 'Certificación Blockchain', 'Desarrollo en blockchain.', 'edX', 'https://edx.org/cert/blockchain', 'Blockchain'
WHERE NOT EXISTS (SELECT 1 FROM "certifications" WHERE title = 'Certificación Blockchain');

-- 9. Companies (continuación, completando 20 registros)
INSERT INTO "companies" (name, description, website, logo_url)
SELECT 'MercadoLibre', 'Plataforma de comercio electrónico líder en LATAM.', 'https://mercadolibre.com', 'https://mercadolibre.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'MercadoLibre')
UNION ALL
SELECT 'Globant', 'Soluciones digitales innovadoras.', 'https://globant.com', 'https://globant.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Globant')
UNION ALL
SELECT 'Rappi', 'Plataforma de entrega a domicilio.', 'https://rappi.com', 'https://rappi.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Rappi')
UNION ALL
SELECT 'Despegar', 'Agencia de viajes online líder en LATAM.', 'https://despegar.com', 'https://despegar.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Despegar')
UNION ALL
SELECT 'Nexsys', 'Distribuidor de soluciones tecnológicas.', 'https://nexsysla.com', 'https://nexsysla.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Nexsys')
UNION ALL
SELECT 'BairesDev', 'Desarrollo de software a medida.', 'https://bairesdev.com', 'https://bairesdev.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'BairesDev')
UNION ALL
SELECT 'Accenture', 'Consultoría en tecnología y transformación digital.', 'https://accenture.com', 'https://accenture.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Accenture')
UNION ALL
SELECT 'Softtek', 'Servicios de TI y transformación digital.', 'https://softtek.com', 'https://softtek.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Softtek')
UNION ALL
SELECT 'Sofka', 'Soluciones tecnológicas innovadoras.', 'https://sofka.com.co', 'https://sofka.com.co/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Sofka')
UNION ALL
SELECT 'Tata Consultancy Services', 'Consultoría global en TI.', 'https://tcs.com', 'https://tcs.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Tata Consultancy Services')
UNION ALL
SELECT 'Ualá', 'Fintech para servicios financieros.', 'https://uala.com', 'https://uala.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Ualá')
UNION ALL
SELECT 'Kavak', 'Plataforma de compraventa de autos.', 'https://kavak.com', 'https://kavak.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Kavak')
UNION ALL
SELECT 'Nubank', 'Banco digital líder en LATAM.', 'https://nubank.com', 'https://nubank.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Nubank')
UNION ALL
SELECT 'Belcorp', 'Tecnología para la industria de belleza.', 'https://belcorp.biz', 'https://belcorp.biz/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Belcorp')
UNION ALL
SELECT 'Grupo Sura', 'Soluciones tecnológicas para seguros.', 'https://gruposura.com', 'https://gruposura.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Grupo Sura')
UNION ALL
SELECT 'Claro', 'Telecomunicaciones y soluciones digitales.', 'https://claro.com', 'https://claro.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Claro')
UNION ALL
SELECT 'Movistar', 'Servicios de telecomunicaciones.', 'https://movistar.com', 'https://movistar.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Movistar')
UNION ALL
SELECT 'Falabella', 'Retail con soluciones tecnológicas.', 'https://falabella.com', 'https://falabella.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Falabella')
UNION ALL
SELECT 'BBVA', 'Banca digital y tecnología financiera.', 'https://bbva.com', 'https://bbva.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'BBVA')
UNION ALL
SELECT 'Santander', 'Soluciones tecnológicas para banca.', 'https://santander.com', 'https://santander.com/logo.png'
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE name = 'Santander');

-- 10. Career Advice (20 registros)
INSERT INTO "career_advice" (title, content, author)
SELECT 'Cómo Preparar un CV Efectivo', 'Incluye proyectos relevantes, usa un diseño limpio y destaca tus habilidades técnicas.', 'Equipo UPE'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo Preparar un CV Efectivo')
UNION ALL
SELECT 'Consejos para Entrevistas Técnicas', 'Practica algoritmos, explica tu pensamiento y prepárate para preguntas de comportamiento.', 'Ana García, Desarrolladora'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Consejos para Entrevistas Técnicas')
UNION ALL
SELECT 'Construyendo un Portafolio de Programación', 'Incluye proyectos de código abierto y describe tu contribución en cada uno.', 'Carlos López, Científico de Datos'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Construyendo un Portafolio de Programación')
UNION ALL
SELECT 'Cómo Aprender a Programar desde Cero', 'Comienza con Python o JavaScript, usa plataformas como Platzi y practica diariamente.', 'María Rodríguez, Ingeniera'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo Aprender a Programar desde Cero')
UNION ALL
SELECT 'Habilidades Clave para Desarrolladores', 'Domina Git, aprende a trabajar en equipo y mantente actualizado con nuevas tecnologías.', 'Juan Martínez, Desarrollador'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Habilidades Clave para Desarrolladores')
UNION ALL
SELECT 'Preparándote para un Hackathon', 'Forma un equipo diverso, define roles y planifica tu tiempo cuidadosamente.', 'Sofía Hernández, Desarrolladora'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Preparándote para un Hackathon')
UNION ALL
SELECT 'Cómo Destacar en LinkedIn', 'Optimiza tu perfil, comparte contenido técnico y conecta con profesionales del sector.', 'Diego Sánchez, Ingeniero'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo Destacar en LinkedIn')
UNION ALL
SELECT 'Aprendiendo DevOps desde Cero', 'Familiarízate con Docker, CI/CD y herramientas como Jenkins o GitHub Actions.', 'Laura Gómez, Ingeniera DevOps'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Aprendiendo DevOps desde Cero')
UNION ALL
SELECT 'Consejos para Trabajar Remoto', 'Establece un espacio de trabajo, mantén horarios fijos y comunica claramente.', 'Andrés Ruiz, Desarrollador'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Consejos para Trabajar Remoto')
UNION ALL
SELECT 'Cómo Negociar tu Salario', 'Investiga el mercado, destaca tu valor y sé claro en tus expectativas.', 'Valeria Molina, Especialista'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo Negociar tu Salario')
UNION ALL
SELECT 'Construyendo una Red de Contactos', 'Asiste a eventos, participa en comunidades y mantén relaciones profesionales.', 'Felipe Torres, Desarrollador'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Construyendo una Red de Contactos')
UNION ALL
SELECT 'Cómo Prepararte para una Certificación', 'Estudia con recursos oficiales, practica con exámenes simulados y planifica tu tiempo.', 'Equipo UPE'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo Prepararte para una Certificación')
UNION ALL
SELECT 'Aprender Ciencia de Datos', 'Domina Python, estadísticas y herramientas como Pandas y Scikit-learn.', 'Carlos López, Científico de Datos'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Aprender Ciencia de Datos')
UNION ALL
SELECT 'Mejorando tus Habilidades de UX/UI', 'Usa Figma, realiza pruebas de usuario y estudia principios de diseño.', 'Laura Gómez, Diseñadora'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Mejorando tus Habilidades de UX/UI')
UNION ALL
SELECT 'Cómo Empezar en Ciberseguridad', 'Aprende fundamentos de redes, estudia ethical hacking y obtén certificaciones.', 'Valeria Molina, Especialista'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo Empezar en Ciberseguridad')
UNION ALL
SELECT 'Desarrollo de Videojuegos', 'Comienza con Unity, aprende C# y crea prototipos simples.', 'María Rodríguez, Desarrolladora'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Desarrollo de Videojuegos')
UNION ALL
SELECT 'Cómo Ser un Buen Líder Técnico', 'Fomenta la colaboración, establece metas claras y mentoriza a tu equipo.', 'Diego Sánchez, Ingeniero'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo Ser un Buen Líder Técnico')
UNION ALL
SELECT 'Optimizando tu GitHub', 'Crea repositorios limpios, usa READMEs claros y contribuye a proyectos open source.', 'Andrés Ruiz, Desarrollador'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Optimizando tu GitHub')
UNION ALL
SELECT 'Aprendiendo Blockchain', 'Estudia Solidity, explora Ethereum y participa en hackathons de blockchain.', 'Felipe Torres, Desarrollador'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Aprendiendo Blockchain')
UNION ALL
SELECT 'Cómo Mantenerte Actualizado', 'Sigue blogs, asiste a conferencias y experimenta con nuevas herramientas.', 'Equipo UPE'
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo Mantenerte Actualizado');

-- 11. Stats (20 registros)
INSERT INTO "stats" (name, value)
SELECT 'Usuarios Registrados', 1500
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Usuarios Registrados')
UNION ALL
SELECT 'Cursos Publicados', 120
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Cursos Publicados')
UNION ALL
SELECT 'Eventos Organizados', 45
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Eventos Organizados')
UNION ALL
SELECT 'Vacantes Publicadas', 200
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Vacantes Publicadas')
UNION ALL
SELECT 'Aplicaciones a Vacantes', 350
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Aplicaciones a Vacantes')
UNION ALL
SELECT 'Certificaciones Obtenidas', 180
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Certificaciones Obtenidas')
UNION ALL
SELECT 'Becas Otorgadas', 75
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Becas Otorgadas')
UNION ALL
SELECT 'Empresas Registradas', 50
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Empresas Registradas')
UNION ALL
SELECT 'Estudiantes Activos', 1200
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Estudiantes Activos')
UNION ALL
SELECT 'Proyectos en Portafolios', 600
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Proyectos en Portafolios')
UNION ALL
SELECT 'Eventos Online', 30
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Eventos Online')
UNION ALL
SELECT 'Cursos Gratuitos', 80
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Cursos Gratuitos')
UNION ALL
SELECT 'Participantes en Hackathons', 250
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Participantes en Hackathons')
UNION ALL
SELECT 'Mentores Registrados', 40
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Mentores Registrados')
UNION ALL
SELECT 'Horas de Capacitación', 5000
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Horas de Capacitación')
UNION ALL
SELECT 'Proyectos Open Source', 100
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Proyectos Open Source')
UNION ALL
SELECT 'Usuarios Verificados', 900
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Usuarios Verificados')
UNION ALL
SELECT 'Vacantes Remotas', 120
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Vacantes Remotas')
UNION ALL
SELECT 'Cursos Completados', 400
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Cursos Completados')
UNION ALL
SELECT 'Asistentes a Eventos', 2000
WHERE NOT EXISTS (SELECT 1 FROM "stats" WHERE name = 'Asistentes a Eventos');

-- VERIFICATION QUERIES
-- Verifica las tablas creadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verifica los enums creados
SELECT typname
FROM pg_type
WHERE typtype = 'e'
ORDER BY typname;

-- Verifica el número de registros por tabla
SELECT 'users' AS table_name, COUNT(*) AS count FROM "users"
UNION ALL
SELECT 'courses' AS table_name, COUNT(*) AS count FROM "courses"
UNION ALL
SELECT 'events' AS table_name, COUNT(*) AS count FROM "events"
UNION ALL
SELECT 'job_vacancies' AS table_name, COUNT(*) AS count FROM "job_vacancies"
UNION ALL
SELECT 'saved_items' AS table_name, COUNT(*) AS count FROM "saved_items"
UNION ALL
SELECT 'job_applications' AS table_name, COUNT(*) AS count FROM "job_applications"
UNION ALL
SELECT 'scholarships' AS table_name, COUNT(*) AS count FROM "scholarships"
UNION ALL
SELECT 'certifications' AS table_name, COUNT(*) AS count FROM "certifications"
UNION ALL
SELECT 'companies' AS table_name, COUNT(*) AS count FROM "companies"
UNION ALL
SELECT 'career_advice' AS table_name, COUNT(*) AS count FROM "career_advice"
UNION ALL
SELECT 'stats' AS table_name, COUNT(*) AS count FROM "stats";