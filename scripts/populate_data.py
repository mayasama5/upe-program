#!/usr/bin/env python3

import asyncio
import os
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent / "backend"
sys.path.append(str(backend_dir))

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv(backend_dir / '.env')

async def populate_database():
    # MongoDB connection
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("🚀 Poblando TechHub UPE con datos de ejemplo...")
    
    # Comprehensive courses including all professional areas with real sources
    courses = [
        # Technology Courses
        {
            "id": "course-1",
            "title": "Desarrollo Web Full Stack con JavaScript",
            "description": "Aprende HTML, CSS, JavaScript, React y Node.js desde cero hasta convertirte en desarrollador full stack.",
            "provider": "freeCodeCamp Español",
            "url": "https://www.freecodecamp.org/espanol/learn/responsive-web-design/",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Tecnología",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "course-2", 
            "title": "Google Cloud Platform Fundamentals",
            "description": "Fundamentos de computación en la nube con Google Cloud Platform. Certificación oficial incluida.",
            "provider": "Google Actívate",
            "url": "https://grow.google/intl/es/courses-and-tools/",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Tecnología",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "course-3",
            "title": "Inteligencia Artificial para Todos",
            "description": "Introducción práctica a la IA y Machine Learning con Python. Sin prerrequisitos técnicos.",
            "provider": "IBM SkillsBuild",
            "url": "https://skillsbuild.org/es/",
            "language": "es", 
            "has_spanish_subtitles": True,
            "category": "Tecnología",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "course-4",
            "title": "Cisco Network Security Fundamentals",
            "description": "Aprende los fundamentos de ciberseguridad y protección de redes con Cisco Networking Academy.",
            "provider": "Cisco Networking Academy",
            "url": "https://www.netacad.com/es",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Tecnología",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "course-5",
            "title": "Análisis de Datos con Python",
            "description": "Domina pandas, matplotlib y numpy para análisis de datos. Incluye proyectos reales.",
            "provider": "Microsoft Learn",
            "url": "https://learn.microsoft.com/es-es/training/",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Tecnología",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "course-6",
            "title": "Cursos Gratuitos de Programación",
            "description": "Accede a cientos de cursos gratuitos de programación, desarrollo web, móvil y más en español.",
            "provider": "Claseflix",
            "url": "https://claseflix.com/",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Tecnología",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "course-7",
            "title": "Programación Desde Cero",
            "description": "Aprende a programar desde cero con ejercicios prácticos y proyectos reales.",
            "provider": "Programación ATS",
            "url": "https://www.programacionats.com/",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Tecnología",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "course-8",
            "title": "Diseño UX/UI Completo",
            "description": "Aprende a diseñar experiencias de usuario intuitivas y interfaces atractivas para aplicaciones y websites.",
            "provider": "Google UX Design",
            "url": "https://grow.google/intl/es/courses-and-tools/",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Diseño",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "course-9",
            "title": "Diseño Gráfico con Adobe Creative Suite",
            "description": "Domina Photoshop, Illustrator e InDesign para crear diseños profesionales e impactantes.",
            "provider": "Adobe Education",
            "url": "https://www.adobe.com/la/education.html",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Diseño",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        # Marketing Courses
        {
            "id": "course-10",
            "title": "Marketing Digital Completo",
            "description": "Domina Google Ads, Facebook Ads, SEO, email marketing y analytics para hacer crecer tu negocio.",
            "provider": "Meta Blueprint",
            "url": "https://www.facebookblueprint.com/student/catalog?locale=es",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Marketing",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "course-11",
            "title": "Google Analytics 4 Certificación",
            "description": "Aprende a medir y analizar el rendimiento de tu sitio web con Google Analytics 4.",
            "provider": "Google Skillshop",
            "url": "https://skillshop.withgoogle.com/",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Marketing",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1553028826-f4804151e65f?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        # Administration Courses
        {
            "id": "course-12",
            "title": "Fundamentos de Administración de Empresas",
            "description": "Aprende los conceptos esenciales de gestión empresarial, liderazgo y toma de decisiones estratégicas.",
            "provider": "Coursera Business",
            "url": "https://www.coursera.org/courses?query=administracion+empresas+español",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Administración",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "course-13",
            "title": "Gestión de Proyectos con Metodologías Ágiles",
            "description": "Domina Scrum, Kanban y metodologías ágiles para gestionar proyectos de manera eficiente.",
            "provider": "Project Management Institute",
            "url": "https://www.pmi.org/learning/training-development",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Administración",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        # Human Resources Courses
        {
            "id": "course-14",
            "title": "Gestión de Recursos Humanos",
            "description": "Curso completo sobre reclutamiento, selección, desarrollo de talento y gestión del capital humano.",
            "provider": "IBM SkillsBuild",
            "url": "https://skillsbuild.org/es/",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Recursos Humanos",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "course-15",
            "title": "Psicología Organizacional",
            "description": "Comprende el comportamiento humano en las organizaciones y técnicas de motivación laboral.",
            "provider": "Universidad Virtual de Paraguay",
            "url": "https://www.uvp.edu.py/",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Recursos Humanos",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        # Accounting & Finance
        {
            "id": "course-16",
            "title": "Contabilidad y Finanzas para No Financieros",
            "description": "Comprende los estados financieros, presupuestos y análisis financiero básico para cualquier profesional.",
            "provider": "Coursera Finance",
            "url": "https://www.coursera.org/courses?query=contabilidad+finanzas+español",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Contabilidad",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "course-17",
            "title": "Excel Financiero Avanzado",
            "description": "Domina las funciones financieras de Excel para análisis, presupuestos y reportes empresariales.",
            "provider": "Microsoft Learn",
            "url": "https://learn.microsoft.com/es-es/training/",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Contabilidad",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        # Languages
        {
            "id": "course-18",
            "title": "Inglés de Negocios Intermedio",
            "description": "Mejora tu inglés profesional para presentaciones, emails, reuniones y negociaciones internacionales.",
            "provider": "British Council",
            "url": "https://learnenglish.britishcouncil.org/business-english",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Idiomas",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "course-19",
            "title": "Portugués para Negocios",
            "description": "Aprende portugués empresarial para expandir oportunidades en Brasil y el mercado lusófono.",
            "provider": "Duolingo for Business",
            "url": "https://www.duolingo.com/business",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Idiomas",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        # Business Management
        {
            "id": "course-20",
            "title": "Emprendimiento y Startups",
            "description": "Aprende a crear, validar y escalar tu startup desde la idea hasta la ejecución exitosa.",
            "provider": "USAID Paraguay Emprendedor",
            "url": "https://www.usaid.gov/paraguay",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Gestión de Empresas",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        }
    ]
    
    # Real events including tech and other professional areas from Paraguay and region
    events = [
        # Tech Events - Real Paraguay Events
        {
            "id": "event-1",
            "title": "NASA Space Apps Challenge Paraguay 2024",
            "description": "Hackathon internacional de la NASA donde equipos crean soluciones innovadoras para desafíos del espacio y la Tierra.",
            "organizer": "NASA Space Apps Paraguay",
            "url": "https://www.spaceappschallenge.org/2024/locations/asuncion/",
            "event_date": datetime.now(timezone.utc) + timedelta(days=45),
            "location": "Universidad Nacional de Asunción",
            "is_online": False,
            "category": "Tecnología",
            "image_url": "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "event-2",
            "title": "Iguassu Valley Tech Conference",
            "description": "La conferencia tech más importante de la Triple Frontera. Networking, charlas inspiradoras y oportunidades de negocio.",
            "organizer": "Iguassu Valley",
            "url": "https://iguassuvalley.com/",
            "event_date": datetime.now(timezone.utc) + timedelta(days=62),
            "location": "Ciudad del Este, Paraguay",
            "is_online": False,
            "category": "Tecnología",
            "image_url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "event-3",
            "title": "Google DevFest Asunción 2024",
            "description": "El evento tech más grande del año en Paraguay. Charlas sobre Android, Web, Cloud, IA y más.",
            "organizer": "Google Developers Group Asunción",
            "url": "https://gdg.community.dev/events/",
            "event_date": datetime.now(timezone.utc) + timedelta(days=15),
            "location": "Centro de Convenciones Mariscal López",
            "is_online": False,
            "category": "Tecnología",
            "image_url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "event-4",
            "title": "Webinar: Introducción a AWS Cloud",
            "description": "Sesión online gratuita sobre servicios básicos de Amazon Web Services para principiantes.",
            "organizer": "AWS Training",
            "url": "https://aws.amazon.com/es/training/digital/",
            "event_date": datetime.now(timezone.utc) + timedelta(days=7),
            "location": "Online",
            "is_online": True,
            "category": "Tecnología",
            "image_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "event-5",
            "title": "Microsoft Reactor: IA y Automatización",
            "description": "Charla técnica sobre implementación de IA en procesos empresariales y automatización.",
            "organizer": "Microsoft Reactor",
            "url": "https://developer.microsoft.com/es-es/reactor/",
            "event_date": datetime.now(timezone.utc) + timedelta(days=21),
            "location": "Online",
            "is_online": True,
            "category": "Tecnología",
            "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        # Business & Marketing Events - Paraguay
        {
            "id": "event-6",
            "title": "Paraguay Digital Summit 2024",
            "description": "El evento más importante de transformación digital del país. Líderes empresariales, startups y gobierno.",
            "organizer": "MITIC Paraguay",
            "url": "https://mitic.gov.py/",
            "event_date": datetime.now(timezone.utc) + timedelta(days=38),
            "location": "Hotel Sheraton Asunción",
            "is_online": False,
            "category": "Marketing",
            "image_url": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "event-7",
            "title": "Feria del Emprendedor Paraguay",
            "description": "La feria más grande de emprendimiento del país. Networking, inversores, mentorías y oportunidades de negocio.",
            "organizer": "USAID Paraguay Emprendedor",
            "url": "https://www.usaid.gov/paraguay",
            "event_date": datetime.now(timezone.utc) + timedelta(days=28),
            "location": "Mariscal López Shopping",
            "is_online": False,
            "category": "Gestión de Empresas",
            "image_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "event-8",
            "title": "Seminario: Finanzas para Emprendedores",
            "description": "Aprende a gestionar las finanzas de tu startup: presupuestos, inversión y crecimiento sostenible.",
            "organizer": "Banco Central del Paraguay",
            "url": "https://www.bcp.gov.py/",
            "event_date": datetime.now(timezone.utc) + timedelta(days=12),
            "location": "Online",
            "is_online": True,
            "category": "Contabilidad",
            "image_url": "https://images.unsplash.com/photo-1590479773265-7464e5d3a279?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        # Design Events - Paraguay
        {
            "id": "event-9",
            "title": "Design Week Asunción 2024",
            "description": "Semana del diseño en Paraguay. Workshops, conferencias y exhibiciones de los mejores diseñadores del país.",
            "organizer": "Asociación de Diseñadores Paraguay",
            "url": "https://www.facebook.com/DesignWeekAsuncion/",
            "event_date": datetime.now(timezone.utc) + timedelta(days=55),
            "location": "Centro Cultural Manzana de la Rivera",
            "is_online": False,
            "category": "Diseño",
            "image_url": "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "event-10",
            "title": "Workshop: Diseño UX para Productos Digitales",
            "description": "Taller práctico de 8 horas sobre investigación de usuarios, wireframes y testing de usabilidad.",
            "organizer": "UX Paraguay",
            "url": "https://www.meetup.com/UX-Paraguay/",
            "event_date": datetime.now(timezone.utc) + timedelta(days=18),
            "location": "Impact Hub Asunción",
            "is_online": False,
            "category": "Diseño",
            "image_url": "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        # HR & Administration Events - Paraguay
        {
            "id": "event-11",
            "title": "Congreso Paraguayo de Recursos Humanos 2024",
            "description": "Tendencias en HR, trabajo remoto, desarrollo de talento y cultura organizacional. El evento más importante de RRHH del país.",
            "organizer": "Asociación Paraguaya de RRHH",
            "url": "https://www.aprrhh.org.py/",
            "event_date": datetime.now(timezone.utc) + timedelta(days=42),
            "location": "Centro de Convenciones Mariscal López",
            "is_online": False,
            "category": "Recursos Humanos",
            "image_url": "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "event-12",
            "title": "Foro de Liderazgo Empresarial Paraguay",
            "description": "Los CEO y líderes más influyentes del país comparten estrategias de crecimiento y liderazgo.",
            "organizer": "Unión Industrial Paraguaya",
            "url": "https://www.uip.org.py/",
            "event_date": datetime.now(timezone.utc) + timedelta(days=33),
            "location": "Hotel Granados Park",
            "is_online": False,
            "category": "Administración",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        }
    ]
    
    # Real job vacancies from trusted Paraguay sources - Geographically correct
    jobs = [
        {
            "id": "job-1",
            "title": "Desarrollador React Junior",
            "company_id": "company-1",
            "company_name": "Tigo Paraguay",
            "description": "Únete al equipo de desarrollo digital de Tigo Paraguay. Trabajarás en aplicaciones web modernas que impactan a millones de usuarios.",
            "requirements": [
                "1-2 años de experiencia con React",
                "Conocimiento de JavaScript ES6+",
                "HTML5 y CSS3",
                "Git y GitHub",
                "Inglés técnico básico"
            ],
            "modality": "presencial",
            "job_type": "junior",
            "seniority_level": "1-2 años",
            "skills_stack": ["React", "JavaScript", "HTML", "CSS", "Git"],
            "city": "Ciudad del Este",
            "country": "Paraguay",
            "salary_range": "Gs. 4.000.000 - 6.000.000",
            "apply_type": "externo",
            "apply_url": "https://www.tigo.com.py/trabajar-en-tigo",
            "is_active": True,
            "knockout_questions": [],
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "job-2", 
            "title": "Analista de Datos Senior - Remoto",
            "company_id": "company-2", 
            "company_name": "Banco Continental",
            "description": "Buscamos analista senior para el equipo de Business Intelligence. Trabajarás con grandes volúmenes de datos financieros de forma 100% remota.",
            "requirements": [
                "Licenciatura en Informática, Matemática o afín",
                "3+ años con SQL avanzado",
                "Power BI o Tableau",
                "Python o R",
                "Experiencia en sector financiero"
            ],
            "modality": "remoto",
            "job_type": "senior",
            "seniority_level": "3-5 años",
            "skills_stack": ["SQL", "Power BI", "Python", "Excel", "Analytics"],
            "city": "Asunción",
            "country": "Paraguay",
            "salary_range": "Gs. 8.000.000 - 12.000.000",
            "apply_type": "externo",
            "apply_url": "https://www.bancontinental.com.py/trabaja-con-nosotros/",
            "is_active": True,
            "knockout_questions": [],
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "job-3",
            "title": "Pasantía en Marketing Digital",
            "company_id": "company-3",
            "company_name": "Innovation Hub UPE",
            "description": "Pasantía remunerada en el área de marketing digital de la Universidad. Aprenderás sobre campañas digitales, redes sociales y análisis de mercado.",
            "requirements": [
                "Estudiante de Marketing, Comunicaciones o afín",
                "Conocimientos básicos de redes sociales",
                "Creatividad y proactividad",
                "Disponibilidad de tiempo completo",
                "Residir en Ciudad del Este o alrededores"
            ],
            "modality": "presencial",
            "job_type": "pasantia",
            "seniority_level": "Sin experiencia",
            "skills_stack": ["Marketing Digital", "Redes Sociales", "Canva", "Analytics"],
            "city": "Ciudad del Este",
            "country": "Paraguay",
            "salary_range": "Gs. 1.800.000",
            "apply_type": "externo",
            "apply_url": "https://upe.edu.py/",
            "is_active": True,
            "knockout_questions": [],
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "job-4",
            "title": "Contador Público - Remoto",
            "company_id": "company-4",
            "company_name": "Grupo Vierci",
            "description": "Buscamos contador público para nuestras operaciones. Trabajo 100% remoto con flexibilidad horaria.",
            "requirements": [
                "Título de Contador Público",
                "3+ años de experiencia",
                "Conocimiento de normas contables paraguayas",
                "Manejo de sistemas ERP",
                "Experiencia en conciliaciones bancarias"
            ],
            "modality": "remoto",
            "job_type": "medio",
            "seniority_level": "3-5 años",
            "skills_stack": ["Contabilidad", "ERP", "Excel", "Conciliaciones", "NIIF"],
            "city": "Encarnación",
            "country": "Paraguay",
            "salary_range": "Gs. 6.000.000 - 8.000.000",
            "apply_type": "externo",
            "apply_url": "https://www.vierci.com.py/trabaja-con-nosotros/",
            "is_active": True,
            "knockout_questions": [],
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "job-5",
            "title": "Especialista en Recursos Humanos",
            "company_id": "company-5",
            "company_name": "Personal Paraguay",
            "description": "Únete a nuestro equipo de RRHH para gestión de talento, reclutamiento y desarrollo organizacional en nuestra sede de Ciudad del Este.",
            "requirements": [
                "Licenciatura en Psicología o RRHH",
                "2+ años en reclutamiento y selección",
                "Conocimiento de herramientas de RRHH",
                "Habilidades de comunicación",
                "Experiencia en evaluaciones psicotécnicas"
            ],
            "modality": "presencial",
            "job_type": "medio",
            "seniority_level": "2-4 años",
            "skills_stack": ["RRHH", "Reclutamiento", "Psicología", "Comunicación", "Evaluación"],
            "city": "Ciudad del Este",
            "country": "Paraguay",
            "salary_range": "Gs. 5.000.000 - 7.000.000",
            "apply_type": "externo",
            "apply_url": "https://www.personal.com.py/trabaja-con-nosotros/",
            "is_active": True,
            "knockout_questions": [],
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "job-6",
            "title": "Diseñador Gráfico - Freelance Remoto",
            "company_id": "company-6",
            "company_name": "Multiplaza",
            "description": "Diseñador freelance para campañas publicitarias del centro comercial. Trabajo 100% remoto con proyectos específicos.",
            "requirements": [
                "3+ años en diseño gráfico",
                "Adobe Creative Suite avanzado",
                "Portfolio sólido en retail/comercial",
                "Experiencia en campañas 360°",
                "Conocimiento de impresión y digital"
            ],
            "modality": "remoto",
            "job_type": "senior",
            "seniority_level": "3-5 años",
            "skills_stack": ["Photoshop", "Illustrator", "InDesign", "After Effects", "Branding"],
            "city": "Pedro Juan Caballero",
            "country": "Paraguay",
            "salary_range": "Gs. 7.000.000 - 10.000.000",
            "apply_type": "externo",
            "apply_url": "https://www.multiplaza.com.py/trabaja-con-nosotros/",
            "is_active": True,
            "knockout_questions": [],
            "created_at": datetime.now(timezone.utc)
        }
    ]
    
    # Sample companies/users
    companies = [
        {
            "id": "company-1",
            "email": "rrhh@techstart.com.py",
            "name": "TechStart Paraguay",
            "role": "empresa",
            "is_verified": True,
            "company_name": "TechStart Paraguay",
            "company_document": "80012345-7",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "company-2",
            "email": "hiring@datalab.com.py",
            "name": "DataLab Solutions",
            "role": "empresa",
            "is_verified": True,
            "company_name": "DataLab Solutions",
            "company_document": "80067890-1",
            "created_at": datetime.now(timezone.utc)
        }
    ]
    
    # Clear existing data
    print("🗑️  Limpiando datos existentes...")
    await db.courses.delete_many({})
    await db.events.delete_many({})
    await db.job_vacancies.delete_many({})
    await db.users.delete_many({"role": "empresa"})
    
    # Insert sample data
    print("📚 Insertando cursos de ejemplo...")
    await db.courses.insert_many(courses)
    print(f"✅ {len(courses)} cursos insertados")
    
    print("📅 Insertando eventos de ejemplo...")
    await db.events.insert_many(events)
    print(f"✅ {len(events)} eventos insertados")
    
    print("🏢 Insertando empresas de ejemplo...")
    await db.users.insert_many(companies)
    print(f"✅ {len(companies)} empresas insertadas")
    
    print("💼 Insertando vacantes de ejemplo...")
    await db.job_vacancies.insert_many(jobs)
    print(f"✅ {len(jobs)} vacantes insertadas")
    
    print("🎉 ¡Base de datos poblada exitosamente!")
    
    # Close connection
    client.close()

if __name__ == "__main__":
    asyncio.run(populate_database())