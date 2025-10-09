# Microservices Dashboard: MicroManager

Un dashboard moderno y responsive para la gestión y monitoreo de microservicios, construido con React, TypeScript y SASS

## Descripción del Proyecto

Este proyecto proporciona una interfaz de usuario intuitiva para administrar y visualizar microservicios. Incluye funcionalidades como:

- **Dashboard Principal**: Vista general con estadísticas clave y gráficos de actividad
- **Gestión de Microservicios**: CRUD completo para microservicios con tarjetas visuales
- **Monitoreo de Estado**: Visualización del estado de los microservicios
- **Edición de Código**: Modal integrado para editar configuraciones
- **Autenticación**: Sistema de login/registro de usuarios
- **Configuraciones**: Panel de ajustes personalizables

## Tecnologías Utilizadas

### Core
- **React 19.1.1** - Biblioteca de interfaz de usuario
- **TypeScript 5.8.3** - Superset tipado de JavaScript
- **Vite 7.1.6** - Build tool y dev server

### Estilos
- **Sass** - Preprocesador CSS

### Navegación
- **React Router DOM 7.9.1** - Enrutamiento del lado del cliente

### Visualización de Datos
- **Chart.js 4.5.0** - Librería de gráficos
- **react-chartjs-2 5.3.0** - Wrapper de Chart.js para React

### Iconos
- **lucide-react 0.544.0** - Conjunto de iconos modernos

### Herramientas de Desarrollo
- **ESLint** - Linter para código JavaScript/TypeScript
- **@vitejs/plugin-react-swc** - Plugin de React con compilador SWC
- **Autoprefixer** - PostCSS plugin para prefijos CSS

## Estructura del Proyecto

```
my-dashboard/
├── src/
│   ├── assets/              # Recursos estáticos
│   ├── components/          # Componentes reutilizables
│   │   ├── ActivityChart/   # Gráfico de actividad
│   │   ├── CreateMicroserviceModal/  # Modal de creación
│   │   ├── EditCodeModal/   # Modal de edición de código
│   │   ├── Header/          # Encabezado de la aplicación
│   │   ├── Layout/          # Layout principal
│   │   ├── MicroserviceCard/        # Tarjeta de microservicio
│   │   ├── MicroservicesTable/      # Tabla de microservicios
│   │   ├── MicroserviceStatusModal/ # Modal de estado
│   │   ├── Sidebar/         # Barra lateral de navegación
│   │   ├── StatsCard/       # Tarjeta de estadísticas
│   │   └── SystemStatus/    # Estado del sistema
│   ├── Pages/               # Páginas principales
│   │   ├── AuthContainer/   # Autenticación
│   │   ├── Dashboard/       # Dashboard principal
│   │   ├── Microservices/   # Gestión de microservicios
│   │   └── Settings/        # Configuraciones
│   ├── App.tsx              # Componente raíz
│   ├── main.tsx             # Punto de entrada
│   └── main.scss            # Estilos globales
├── package.json             # Dependencias y scripts
├── tsconfig.json            # Configuración de TypeScript
├── vite.config.ts           # Configuración de Vite
└── eslint.config.js         # Configuración de ESLint
```

## Instrucciones de Uso

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm 

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Is-monp/Microservices_f.git
cd Microservices_f/my-dashboard
```

2. Instala las dependencias:
```bash
npm install
```

### Scripts Disponibles

#### Modo Desarrollo
Inicia el servidor de desarrollo con hot-reload:
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

### Características Principales

#### Dashboard
- Visualización de métricas clave (total de microservicios, activos, inactivos)
- Gráficos de actividad
- Estado general del sistema

#### Microservicios
- Vista de tarjetas con información detallada de cada microservicio
- Creación de nuevos microservicios
- Edición de configuraciones
- Eliminación de microservicios

#### Autenticación
- Login de usuarios
- Registro de nuevos usuarios

### Personalización

#### Rutas
Las rutas están definidas en [App.tsx](my-dashboard/src/App.tsx#L14-L27). Para agregar nuevas:

```tsx
<Route path="nueva-ruta" element={<NuevoComponente />} />
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`) :D
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y está en desarrollo.
