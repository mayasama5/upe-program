# Quick Start - Documentación UPE Program

## ⚡ Inicio Rápido

### 1. Instalación Inicial

```bash
# Desde la raíz del proyecto
npm run install:all
```

Esto instalará todas las dependencias de:
- Frontend (React + Storybook + Styleguidist)
- Backend (Node.js + Express + Prisma)
- Docs (Docusaurus)

### 1.5. Configurar Base de Datos

**Opción A: Supabase (Recomendado para producción)**

1. Crea una cuenta gratuita en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia la `DATABASE_URL` desde Settings > Database > Connection string
4. Pega la URL en `backend-nodejs/.env`:
   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"
   ```

**Opción B: PostgreSQL Local**

```bash
# Instalar PostgreSQL localmente
# Crear base de datos
createdb techhub_upe

# Configurar en backend-nodejs/.env
DATABASE_URL="postgresql://user:password@localhost:5432/techhub_upe"
```

**Ejecutar migraciones:**
```bash
npm run db:migrate
npm run db:generate
```

### 2. Ejecutar Toda la Documentación

```bash
npm run docs:dev
```

Esto abrirá simultáneamente:
- 📖 **Storybook**: http://localhost:6006
- 📝 **Styleguidist**: http://localhost:6060
- 🦕 **Docusaurus**: http://localhost:3000

### 3. Build de Producción

```bash
# Generar toda la documentación estática
npm run docs:build
```

Salida:
- `/frontend/storybook-static/`
- `/frontend/styleguide-build/`
- `/docs/build/`

## 📚 Comandos por Herramienta

### Storybook

```bash
# Desarrollo
npm run docs:storybook
# o
cd frontend && npm run storybook

# Build
npm run docs:build:storybook
# o
cd frontend && npm run build-storybook

# Output: frontend/storybook-static/
```

### Styleguidist

```bash
# Desarrollo
npm run docs:styleguide
# o
cd frontend && npm run styleguide

# Build
npm run docs:build:styleguide
# o
cd frontend && npm run styleguide:build

# Output: frontend/styleguide-build/
```

### Docusaurus

```bash
# Desarrollo
npm run docs:docusaurus
# o
cd docs && npm start

# Build
npm run docs:build:docusaurus
# o
cd docs && npm run build

# Output: docs/build/
```

## 🎯 Uso Común

### Desarrollo Local

```bash
# Opción 1: Solo una herramienta
npm run docs:storybook

# Opción 2: Todas las herramientas
npm run docs:dev
```

### Preview de Builds

```bash
# Build todo primero
npm run docs:build

# Servir localmente
npm run docs:serve

# O manualmente:
cd frontend && npx http-server storybook-static -p 6006
cd frontend && npx http-server styleguide-build -p 6060
cd docs && npm run serve  # puerto 3000
```

### Agregar Nuevo Componente

```bash
# 1. Crear componente en frontend/src/components/ui/
# 2. Agregar JSDoc comments
# 3. Crear archivo .stories.jsx
# 4. Verificar en Storybook
npm run docs:storybook
```

## 🚀 Deploy en Vercel

### Opción 1: CLI

```bash
# Frontend + Docs embebidas
cd frontend
npm run build
npm run build-storybook
npm run styleguide:build
vercel --prod

# Docusaurus separado
cd docs
npm run build
vercel --prod
```

### Opción 2: Dashboard

1. Ir a https://vercel.com/new
2. Importar repositorio
3. Crear proyectos:

**Proyecto 1: Frontend**
```
Name: upe-frontend
Root Directory: frontend
Build Command: npm run build && npm run build-storybook && npm run styleguide:build
Output Directory: build
```

**Proyecto 2: Docs**
```
Name: upe-docs
Root Directory: docs
Build Command: npm run build
Output Directory: build
```

### URLs Resultantes

- Frontend: `https://techhubupe.com`
- Storybook: `https://techhubupe.com/storybook`
- Styleguidist: `https://techhubupe.com/styleguide`
- Docs: `https://docs.techhubupe.com`

## 🔧 Configuración de URLs

### Desarrollo

Ya configuradas:
- Storybook: http://localhost:6006
- Styleguidist: http://localhost:6060
- Docusaurus: http://localhost:3000

### Producción

Agregar al `frontend/.env.production`:
```env
PUBLIC_URL=/
REACT_APP_STORYBOOK_URL=/storybook
REACT_APP_STYLEGUIDE_URL=/styleguide
```

## 📁 Archivos Importantes

### Storybook
```
frontend/
├── .storybook/
│   ├── main.js          # Configuración principal
│   └── preview.js       # Theming y global config
└── src/
    └── components/ui/
        └── *.stories.jsx  # Historias de componentes
```

### Styleguidist
```
frontend/
├── styleguide.config.js  # Configuración
├── docs/
│   └── introduction.md   # Intro
└── src/
    └── components/ui/
        └── *.jsx         # Con JSDoc
```

### Docusaurus
```
docs/
├── docusaurus.config.ts  # Configuración
├── sidebars.ts          # Navegación
└── docs/
    ├── intro.md
    ├── api/
    ├── architecture/
    └── deployment/
```

## 🎨 Personalización

### Cambiar tema de Storybook

Editar `frontend/.storybook/preview.js`:
```javascript
export default {
  parameters: {
    backgrounds: {
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#000000' },
      ],
    },
  },
};
```

### Cambiar tema de Docusaurus

Editar `docs/docusaurus.config.ts`:
```typescript
themeConfig: {
  navbar: {
    title: 'UPE Program',
    logo: {
      src: 'img/logo.svg',
    },
  },
  colorMode: {
    defaultMode: 'light',
    respectPrefersColorScheme: true,
  },
},
```

## 🐛 Troubleshooting

### Puerto ocupado

```bash
# Cambiar puerto de Storybook
cd frontend && npm run storybook -- -p 6007

# Cambiar puerto de Docusaurus
cd docs && npm start -- --port 3001
```

### Error de dependencias

```bash
# Limpiar e reinstalar
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf backend-nodejs/node_modules backend-nodejs/package-lock.json
rm -rf docs/node_modules docs/package-lock.json

npm run install:all
```

### Build falla

```bash
# Ver logs detallados
cd frontend && npm run build-storybook -- --loglevel verbose
cd frontend && npm run styleguide:build -- --verbose
cd docs && npm run build -- --verbose
```

## 📊 Scripts Disponibles

### Raíz del Proyecto

```bash
npm run install:all         # Instalar todas las deps
npm run docs:dev            # Dev: todas las docs
npm run docs:build          # Build: todas las docs
npm run docs:storybook      # Dev: solo Storybook
npm run docs:styleguide     # Dev: solo Styleguidist
npm run docs:docusaurus     # Dev: solo Docusaurus
npm run docs:build:storybook    # Build: solo Storybook
npm run docs:build:styleguide   # Build: solo Styleguidist
npm run docs:build:docusaurus   # Build: solo Docusaurus
```

### Frontend

```bash
cd frontend
npm start                   # App principal
npm run storybook          # Storybook dev
npm run build-storybook    # Storybook build
npm run styleguide         # Styleguidist dev
npm run styleguide:build   # Styleguidist build
```

### Docs

```bash
cd docs
npm start                  # Docusaurus dev
npm run build             # Docusaurus build
npm run serve             # Preview build local
```

## 🎓 Para Tesis

### Generar Screenshots

```bash
# 1. Ejecutar toda la documentación
npm run docs:dev

# 2. Tomar screenshots de:
# - http://localhost:6006 (Storybook)
# - http://localhost:6060 (Styleguidist)
# - http://localhost:3000 (Docusaurus)

# 3. Guardar en /thesis/screenshots/
```

### Exportar Documentación

```bash
# Build todo
npm run docs:build

# Copiar builds a carpeta de tesis
mkdir -p thesis/documentation
cp -r frontend/storybook-static thesis/documentation/storybook
cp -r frontend/styleguide-build thesis/documentation/styleguide
cp -r docs/build thesis/documentation/docs
```

### Generar PDF de Docs

```bash
# Instalar docusaurus-prince-pdf
cd docs
npm install docusaurus-prince-pdf

# Generar PDF
npm run docs:pdf
```

## ✅ Checklist Final

Antes de presentar:

- [ ] `npm run install:all` ejecutado correctamente
- [ ] `npm run docs:dev` funciona y abre las 3 herramientas
- [ ] `npm run docs:build` completa sin errores
- [ ] Storybook muestra todos los componentes
- [ ] Styleguidist muestra documentación JSDoc
- [ ] Docusaurus tiene todas las páginas
- [ ] Screenshots tomados para tesis
- [ ] Código pusheado a GitHub
- [ ] Deploy en Vercel exitoso
- [ ] URLs accesibles públicamente

## 📞 Soporte

Si encuentras problemas:

1. Revisar [DOCUMENTATION.md](./DOCUMENTATION.md)
2. Revisar [TESIS_GUIDE.md](./TESIS_GUIDE.md)
3. Buscar en issues del repo
4. Crear nuevo issue con detalles del error

---

**¡Todo listo para generar documentación profesional! 🚀**
