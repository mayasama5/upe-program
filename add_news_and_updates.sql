-- ============================================
-- Script para agregar tabla News y actualizar configuraciones
-- ============================================

-- 1. Crear tabla News
CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    author TEXT NOT NULL DEFAULT 'TechHub UPE',
    is_published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_is_published ON news(is_published);

-- 3. Actualizar valor por defecto de is_verified para nuevos usuarios
ALTER TABLE users ALTER COLUMN is_verified SET DEFAULT true;

-- 4. Insertar noticias de ejemplo (opcional - puedes comentar esto si no quieres datos de ejemplo)
INSERT INTO news (id, title, excerpt, content, category, image_url, author, is_published, published_at)
VALUES
(
    gen_random_uuid()::text,
    'Bienvenidos a TechHub UPE',
    'Estamos emocionados de lanzar nuestra nueva plataforma educativa y laboral para estudiantes de Paraguay y Latinoamérica.',
    'TechHub UPE es la nueva plataforma que conecta estudiantes con oportunidades educativas y laborales. Ofrecemos cursos gratuitos, eventos, becas y vacantes de empleo especialmente seleccionadas para el sector tecnológico. Nuestro objetivo es ayudar a los estudiantes a desarrollar sus habilidades y encontrar oportunidades que impulsen sus carreras profesionales.',
    'Universidad',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
    'TechHub UPE',
    true,
    CURRENT_TIMESTAMP
),
(
    gen_random_uuid()::text,
    'Nuevos cursos disponibles en la plataforma',
    'Hemos agregado más de 50 cursos gratuitos en tecnología, diseño y desarrollo profesional.',
    'Nos complace anunciar la incorporación de nuevos cursos en áreas como Desarrollo Web, Inteligencia Artificial, Diseño UX/UI, Cloud Computing y más. Todos los cursos incluyen certificados de finalización y están disponibles en español o con subtítulos. Inscríbete ahora y comienza a desarrollar nuevas habilidades.',
    'Educación',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
    'TechHub UPE',
    true,
    CURRENT_TIMESTAMP
),
(
    gen_random_uuid()::text,
    'Próximos eventos tecnológicos',
    'No te pierdas los eventos y workshops que tenemos preparados para este mes.',
    'Participa en nuestros eventos virtuales y presenciales. Este mes contamos con talleres de React, conferencias sobre IA, hackatones y sesiones de networking con empresas tech. Todos los eventos son gratuitos para estudiantes registrados en la plataforma. Revisa el calendario completo en la sección de Eventos.',
    'Eventos',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    'TechHub UPE',
    true,
    CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

-- 5. Verificar que todo se creó correctamente
SELECT 'Tabla news creada exitosamente' as status, COUNT(*) as total_noticias FROM news;
SELECT 'Usuarios configurados como activos por defecto' as status;

-- ============================================
-- Fin del script
-- ============================================
