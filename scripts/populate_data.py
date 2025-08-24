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
    
    # Sample courses including tech and other professional areas
    courses = [
        # Tech Courses
        {
            "id": "course-1",
            "title": "Desarrollo Web Full Stack con JavaScript",
            "description": "Aprende HTML, CSS, JavaScript, React y Node.js desde cero hasta convertirte en desarrollador full stack.",
            "provider": "freeCodeCamp Español",
            "url": "https://www.freecodecamp.org/espanol/learn/responsive-web-design/",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Desarrollo Web",
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
            "category": "Cloud Computing",
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
            "category": "Inteligencia Artificial",
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
            "category": "Ciberseguridad",
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
            "category": "Ciencia de Datos",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        # Marketing & Business Courses
        {
            "id": "course-6",
            "title": "Marketing Digital Completo",
            "description": "Domina Google Ads, Facebook Ads, SEO, email marketing y analytics para hacer crecer tu negocio.",
            "provider": "Meta Blueprint",
            "url": "https://www.facebookblueprint.com/student/catalog?locale=es",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Marketing Digital",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "course-7",
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
            "id": "course-8",
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
        # Design Courses
        {
            "id": "course-9",
            "title": "Diseño Gráfico con Adobe Creative Suite",
            "description": "Domina Photoshop, Illustrator e InDesign para crear diseños profesionales e impactantes.",
            "provider": "Adobe Education",
            "url": "https://www.adobe.com/la/education.html",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "Diseño Gráfico",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "course-10",
            "title": "UX/UI Design Fundamentals",
            "description": "Aprende a diseñar experiencias de usuario intuitivas y interfaces atractivas para aplicaciones y websites.",
            "provider": "Google UX Design",
            "url": "https://grow.google/intl/es/courses-and-tools/",
            "language": "es",
            "has_spanish_subtitles": True,
            "category": "UX/UI Design",
            "is_free": True,
            "image_url": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        # Finance & Accounting
        {
            "id": "course-11",
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
        # Communication & Languages
        {
            "id": "course-12",
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
        }
    ]
    
    # Sample events
    events = [
        {
            "id": "event-1",
            "title": "Google DevFest Asunción 2024",
            "description": "El evento tech más grande del año en Paraguay. Charlas sobre Android, Web, Cloud, IA y más.",
            "organizer": "Google Developers Group Asunción",
            "url": "https://gdg.community.dev/events/",
            "event_date": datetime.now(timezone.utc) + timedelta(days=15),
            "location": "Centro de Convenciones Mariscal López",
            "is_online": False,
            "category": "Desarrollo",
            "image_url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "event-2",
            "title": "Webinar: Introducción a AWS Cloud",
            "description": "Sesión online gratuita sobre servicios básicos de Amazon Web Services para principiantes.",
            "organizer": "AWS Training",
            "url": "https://aws.amazon.com/es/training/digital/",
            "event_date": datetime.now(timezone.utc) + timedelta(days=7),
            "location": "Online",
            "is_online": True,
            "category": "Cloud Computing",
            "image_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "event-3",
            "title": "Hackathon: Tech for Good Paraguay",
            "description": "48 horas creando soluciones tecnológicas para problemas sociales. Premios de hasta $5000.",
            "organizer": "Ministerio de Tecnologías de la Información",
            "url": "https://mitic.gov.py/convocatoria2/",
            "event_date": datetime.now(timezone.utc) + timedelta(days=30),
            "location": "UNE - Universidad Nacional del Este",
            "is_online": False,
            "category": "Hackathon",
            "image_url": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "event-4",
            "title": "Microsoft Reactor: IA y Automatización",
            "description": "Charla técnica sobre implementación de IA en procesos empresariales y automatización.",
            "organizer": "Microsoft Reactor",
            "url": "https://developer.microsoft.com/es-es/reactor/",
            "event_date": datetime.now(timezone.utc) + timedelta(days=21),
            "location": "Online",
            "is_online": True,
            "category": "Inteligencia Artificial",
            "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
            "created_at": datetime.now(timezone.utc)
        }
    ]
    
    # Sample job vacancies
    jobs = [
        {
            "id": "job-1",
            "title": "Desarrollador React Junior",
            "company_id": "company-1",
            "company_name": "TechStart Paraguay",
            "description": "Buscamos desarrollador React junior para unirse a nuestro equipo de desarrollo frontend. Trabajarás en proyectos emocionantes con tecnologías modernas.",
            "requirements": [
                "1-2 años de experiencia con React",
                "Conocimiento de JavaScript ES6+",
                "HTML5 y CSS3",
                "Git y GitHub",
                "Inglés técnico básico"
            ],
            "modality": "hibrido",
            "job_type": "junior",
            "seniority_level": "1-2 años",
            "skills_stack": ["React", "JavaScript", "HTML", "CSS", "Git"],
            "city": "Asunción",
            "country": "Paraguay",
            "salary_range": "Gs. 4.000.000 - 6.000.000",
            "apply_type": "interno",
            "apply_url": None,
            "is_active": True,
            "knockout_questions": [
                "¿Tienes experiencia con React Hooks?",
                "¿Puedes trabajar en modalidad híbrida en Asunción?"
            ],
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "job-2",
            "title": "Python Developer - Ciencia de Datos",
            "company_id": "company-2", 
            "company_name": "DataLab Solutions",
            "description": "Únete a nuestro equipo de ciencia de datos trabajando con Python, pandas, y modelos de machine learning para clientes internacionales.",
            "requirements": [
                "Licenciatura en Informática, Matemática o afín",
                "2+ años con Python",
                "Experiencia con pandas, numpy, scikit-learn",
                "SQL avanzado",
                "Inglés fluido"
            ],
            "modality": "remoto",
            "job_type": "medio",
            "seniority_level": "2-4 años",
            "skills_stack": ["Python", "Pandas", "SQL", "Machine Learning", "Jupyter"],
            "city": None,
            "country": "Paraguay",
            "salary_range": "USD 2.500 - 3.500",
            "apply_type": "externo",
            "apply_url": "https://datalab.com.py/careers/python-developer",
            "is_active": True,
            "knockout_questions": [],
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "job-3",
            "title": "Pasantía en Desarrollo Mobile",
            "company_id": "company-3",
            "company_name": "Innovation Hub UPE",
            "description": "Pasantía remunerada para estudiantes de últimos años. Desarrollarás aplicaciones móviles con React Native y Flutter.",
            "requirements": [
                "Estudiante de Ingeniería en Informática o afín",
                "Conocimientos básicos de programación",
                "Interés en desarrollo móvil",
                "Disponibilidad de 6 horas diarias",
                "Proactividad y ganas de aprender"
            ],
            "modality": "presencial",
            "job_type": "pasantia",
            "seniority_level": "Sin experiencia",
            "skills_stack": ["React Native", "Flutter", "JavaScript", "Dart"],
            "city": "Ciudad del Este",
            "country": "Paraguay",
            "salary_range": "Gs. 1.500.000",
            "apply_type": "interno",
            "apply_url": None,
            "is_active": True,
            "knockout_questions": [
                "¿Eres estudiante activo de una carrera relacionada?",
                "¿Puedes trabajar 6 horas diarias en horario flexible?"
            ],
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "job-4",
            "title": "DevOps Engineer Senior",
            "company_id": "company-4",
            "company_name": "CloudTech International",
            "description": "Posición senior para ingeniero DevOps con experiencia en AWS, Kubernetes y CI/CD. Trabajo 100% remoto.",
            "requirements": [
                "5+ años en DevOps/SRE",
                "Experiencia con AWS, GCP o Azure",
                "Kubernetes en producción",
                "CI/CD (Jenkins, GitLab, GitHub Actions)",
                "Infrastructure as Code (Terraform, CloudFormation)",
                "Inglés avanzado"
            ],
            "modality": "remoto",
            "job_type": "senior",
            "seniority_level": "5+ años",
            "skills_stack": ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins"],
            "city": None,
            "country": "Paraguay",
            "salary_range": "USD 4.000 - 6.000",
            "apply_type": "externo",
            "apply_url": "https://cloudtech.international/careers/devops-senior",
            "is_active": True,
            "knockout_questions": [],
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "job-5",
            "title": "Diseñador UX/UI - Fintech",
            "company_id": "company-5",
            "company_name": "PayPy Solutions",
            "description": "Diseñador UX/UI para productos fintech innovadores. Trabajarás en la experiencia de usuario de aplicaciones de pagos digitales.",
            "requirements": [
                "3+ años en diseño UX/UI",
                "Portfolio sólido en aplicaciones móviles",
                "Figma, Sketch, Adobe XD",
                "Experiencia en productos fintech (preferible)",
                "Metodologías ágiles",
                "Inglés intermedio"
            ],
            "modality": "hibrido",
            "job_type": "medio",
            "seniority_level": "3-5 años",
            "skills_stack": ["Figma", "Sketch", "UX Research", "Prototyping", "Design Systems"],
            "city": "Asunción",
            "country": "Paraguay",
            "salary_range": "Gs. 8.000.000 - 12.000.000",
            "apply_type": "interno",
            "apply_url": None,
            "is_active": True,
            "knockout_questions": [
                "¿Tienes experiencia diseñando para productos financieros?",
                "¿Puedes mostrar un portfolio de aplicaciones móviles?"
            ],
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": "job-6",
            "title": "Analista de Marketing Digital",
            "company_id": "company-6",
            "company_name": "E-commerce Paraguay",
            "description": "Analista de marketing digital para e-commerce líder en Paraguay. Manejo de campañas, analytics y growth marketing.",
            "requirements": [
                "Licenciatura en Marketing, Comunicaciones o afín",
                "2+ años en marketing digital",
                "Google Analytics, Google Ads, Facebook Ads",
                "Excel avanzado",
                "Experiencia en e-commerce",
                "Creatividad y análisis de datos"
            ],
            "modality": "presencial",
            "job_type": "medio",
            "seniority_level": "2-3 años",
            "skills_stack": ["Google Analytics", "Google Ads", "Facebook Ads", "Excel", "SEO"],
            "city": "Asunción",
            "country": "Paraguay",
            "salary_range": "Gs. 5.000.000 - 7.000.000",
            "apply_type": "interno",
            "apply_url": None,
            "is_active": True,
            "knockout_questions": [
                "¿Tienes certificaciones en Google Analytics o Google Ads?",
                "¿Has trabajado en el sector e-commerce anteriormente?"
            ],
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