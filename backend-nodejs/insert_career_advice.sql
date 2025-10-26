-- Inserta datos de ejemplo en la tabla career_advice
INSERT INTO "career_advice" (id, title, description, author, url, image_url, created_at)
SELECT gen_random_uuid(), 'Cómo Preparar un CV Efectivo', 'Incluye proyectos relevantes, usa un diseño limpio y destaca tus habilidades técnicas.', 'Equipo UPE', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo Preparar un CV Efectivo')
UNION ALL
SELECT gen_random_uuid(), 'Consejos para Entrevistas Técnicas', 'Practica algoritmos, explica tu pensamiento y prepárate para preguntas de comportamiento.', 'Ana García, Desarrolladora', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Consejos para Entrevistas Técnicas')
UNION ALL
SELECT gen_random_uuid(), 'Construyendo un Portafolio de Programación', 'Incluye proyectos de código abierto y describe tu contribución en cada uno.', 'Carlos López, Científico de Datos', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Construyendo un Portafolio de Programación')
UNION ALL
SELECT gen_random_uuid(), 'Cómo Aprender a Programar desde Cero', 'Comienza con Python o JavaScript, usa plataformas como Platzi y practica diariamente.', 'María Rodríguez, Ingeniera', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo Aprender a Programar desde Cero')
UNION ALL
SELECT gen_random_uuid(), 'Habilidades Clave para Desarrolladores', 'Domina Git, aprende a trabajar en equipo y mantente actualizado con nuevas tecnologías.', 'Juan Martínez, Desarrollador', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Habilidades Clave para Desarrolladores')
UNION ALL
SELECT gen_random_uuid(), 'Preparándote para un Hackathon', 'Forma un equipo diverso, define roles y planifica tu tiempo cuidadosamente.', 'Sofía Hernández, Desarrolladora', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Preparándote para un Hackathon')
UNION ALL
SELECT gen_random_uuid(), 'Cómo Destacar en LinkedIn', 'Optimiza tu perfil, comparte contenido técnico y conecta con profesionales del sector.', 'Diego Sánchez, Ingeniero', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo Destacar en LinkedIn')
UNION ALL
SELECT gen_random_uuid(), 'Aprendiendo DevOps desde Cero', 'Familiarízate con Docker, CI/CD y herramientas como Jenkins o GitHub Actions.', 'Laura Gómez, Ingeniera DevOps', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Aprendiendo DevOps desde Cero')
UNION ALL
SELECT gen_random_uuid(), 'Cómo negociar tu primer salario', 'Investiga el rango salarial, destaca tus logros y prepárate para negociar con argumentos sólidos.', 'Equipo UPE', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo negociar tu primer salario')
UNION ALL
SELECT gen_random_uuid(), 'Cómo elegir una especialidad tecnológica', 'Explora diferentes áreas, consulta con profesionales y elige según tus intereses y oportunidades laborales.', 'Carlos López, Científico de Datos', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo elegir una especialidad tecnológica')
UNION ALL
SELECT gen_random_uuid(), 'Cómo mejorar tu perfil en GitHub', 'Contribuye a proyectos open source, documenta bien tu código y mantén tu repositorio actualizado.', 'Ana García, Desarrolladora', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo mejorar tu perfil en GitHub')
UNION ALL
SELECT gen_random_uuid(), 'Cómo prepararte para trabajar remoto', 'Organiza tu espacio, comunica tus avances y utiliza herramientas colaborativas.', 'Sofía Hernández, Desarrolladora', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo prepararte para trabajar remoto')
UNION ALL
SELECT gen_random_uuid(), 'Cómo aprender inglés técnico', 'Lee documentación, mira tutoriales en inglés y practica con comunidades internacionales.', 'María Rodríguez, Ingeniera', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo aprender inglés técnico')
UNION ALL
SELECT gen_random_uuid(), 'Cómo destacar en entrevistas grupales', 'Participa activamente, respeta turnos y demuestra liderazgo colaborativo.', 'Juan Martínez, Desarrollador', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo destacar en entrevistas grupales')
UNION ALL
SELECT gen_random_uuid(), 'Cómo crear una red de contactos profesional', 'Asiste a eventos, participa en comunidades y mantén contacto con colegas.', 'Equipo UPE', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo crear una red de contactos profesional')
UNION ALL
SELECT gen_random_uuid(), 'Cómo organizar tu portafolio digital', 'Agrupa tus proyectos por categoría, incluye descripciones claras y enlaces funcionales.', 'Laura Gómez, Ingeniera DevOps', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo organizar tu portafolio digital')
UNION ALL
SELECT gen_random_uuid(), 'Cómo mantenerte actualizado en tecnología', 'Sigue blogs, realiza cursos y participa en webinars regularmente.', 'Diego Sánchez, Ingeniero', NULL, NULL, NOW()
WHERE NOT EXISTS (SELECT 1 FROM "career_advice" WHERE title = 'Cómo mantenerte actualizado en tecnología');
