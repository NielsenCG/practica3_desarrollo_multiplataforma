# MovieApp - Práctica 3 React Native

**Aplicación de explorador de películas** desarrollada con React Native y Expo para la Práctica de Evaluación Continua 3.

## 📱 Características Implementadas

### ✅ Requisitos Funcionales Completados

1. **Página Principal (Home)**
   - ✓ Muestra películas populares al cargar inicialmente
   - ✓ Barra de búsqueda para buscar películas por título
   - ✓ Indicador de carga mientras se obtienen datos
   - ✓ Manejo de errores con opción de reintentar

2. **Sistema de Favoritos**
   - ✓ Botón en cada tarjeta para agregar/quitar favoritos
   - ✓ Indicador visual con corazón (❤️ activo / 🤍 inactivo)
   - ✓ Persistencia usando AsyncStorage (equivalente a localStorage)
   - ✓ Página dedicada para visualizar favoritos

3. **Navegación**
   - ✓ React Navigation con Stack Navigator
   - ✓ Barra de navegación con logo y título
   - ✓ Enlaces entre Home y Favorites
   - ✓ Headers personalizados con botones de navegación

4. **Tarjetas de Películas (MovieCard)**
   - ✓ Imagen del póster de la película
   - ✓ Título de la película
   - ✓ Año de lanzamiento
   - ✓ Rating con estrellas
   - ✓ Botón de favoritos en overlay

## 📂 Estructura del Proyecto

```
practica3RN/
├── App.js                      # Componente principal con navegación
├── index.js                    # Punto de entrada
├── package.json               # Dependencias
├── app.json                   # Configuración de Expo
└── src/
    ├── components/
    │   ├── MovieCard.jsx      # Tarjeta individual de película
    │   └── NavBar.jsx         # Componente de navegación (referencia)
    ├── context/
    │   └── MovieContext.jsx   # Context API para favoritos
    ├── screens/
    │   ├── Home.jsx           # Pantalla principal
    │   └── Favorites.jsx      # Pantalla de favoritos
    ├── services/
    │   └── api.js             # Servicio API de TMDB
    └── utils/
        └── storage.js         # Utilidades de AsyncStorage
```

## 🛠️ Tecnologías Utilizadas

- **React Native** 0.74.5
- **Expo SDK** 51.0.28
- **React Navigation** 6.x
- **Axios** - Peticiones HTTP
- **AsyncStorage** - Persistencia local
- **TMDB API** - Base de datos de películas

## 🎯 Hooks de React Utilizados

### 1. **useState**
- Gestión de películas (`movies`)
- Query de búsqueda (`searchQuery`)
- Estado de carga (`loading`)
- Mensajes de error (`error`)
- Lista de favoritos (`favorites`)

### 2. **useEffect**
- Carga de películas populares al montar componente
- Carga de favoritos desde AsyncStorage al iniciar

### 3. **useContext**
- Consumir el MovieContext
- Acceso global a favoritos y funciones

### 4. **createContext**
- Crear contexto para compartir estado de favoritos
- Provider para envolver la aplicación

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js instalado
- Expo Go app en tu móvil (iOS/Android)

### Pasos

1. **Instalar dependencias**
```bash
npm install
```

2. **Iniciar servidor de desarrollo**
```bash
npm start
```

3. **Visualizar en el móvil**
   - Escanea el QR con Expo Go (Android)
   - Escanea con la cámara (iOS)

4. **O usar emulador**
```bash
npm run android  # Para Android
npm run ios      # Para iOS (solo Mac)
```

## 🌐 API de TMDB

### Configuración
- **API Key**: Configurada en `src/services/api.js`
- **Base URL**: `https://api.themoviedb.org/3`
- **Idioma**: Español (es-ES)

### Endpoints Utilizados
- `GET /movie/popular` - Películas populares
- `GET /search/movie` - Búsqueda de películas

## 📱 Funcionalidades Principales

### Búsqueda de Películas
- Input de búsqueda en tiempo real
- Botón de búsqueda dedicado (🔍)
- Botón para limpiar búsqueda (✕)
- Volver a películas populares al limpiar

### Sistema de Favoritos
- Agregar/quitar con un toque
- Persistencia automática en AsyncStorage
- Sincronización en todas las pantallas
- Contador de favoritos

### Diseño Responsivo
- Grid de 2 columnas
- Adaptable a diferentes tamaños de pantalla
- Tema oscuro moderno
- Animaciones suaves

## 🎨 Diseño UI/UX

- **Tema**: Oscuro (#121212, #1a1a1a)
- **Color principal**: Rojo Netflix (#e50914)
- **Tipografía**: System default
- **Iconos**: Emojis nativos (🎬, ❤️, 🏠, ⭐)

## 📊 Estados de la Aplicación

### Home
- **Inicial**: Carga películas populares
- **Buscando**: Muestra indicador de carga
- **Resultados**: Grid de películas
- **Sin resultados**: Mensaje informativo
- **Error**: Mensaje con botón de reintentar

### Favorites
- **Con favoritos**: Grid de películas guardadas
- **Sin favoritos**: Mensaje motivacional para agregar

## 🔧 Componentes Detallados

### App.js
- Configuración de React Navigation
- Stack Navigator con 2 pantallas
- Provider de MovieContext
- Headers personalizados

### MovieCard.jsx
- Poster de película (500x750)
- Overlay con botón de favorito
- Información: título, año, rating
- Responsive (2 columnas)

### Home.jsx
- Barra de búsqueda funcional
- FlatList con 2 columnas
- Manejo de estados de carga
- Integración con API

### Favorites.jsx
- Lista de favoritos persistentes
- Contador dinámico
- Mensaje cuando está vacío
- Mismo diseño que Home

### MovieContext.jsx
- Estado global de favoritos
- Funciones: add, remove, toggle, isFavorite
- Persistencia automática
- Custom hook: useMovieContext

## 📝 Problemas y Dificultades Encontrados

### 1. AsyncStorage vs localStorage
- **Problema**: localStorage no existe en React Native
- **Solución**: Uso de @react-native-async-storage/async-storage
- **Diferencia**: API asíncrona en lugar de síncrona

### 2. Navegación
- **Problema**: React Router no es compatible con React Native
- **Solución**: Implementación de React Navigation
- **Cambio**: Stack Navigator en lugar de BrowserRouter

### 3. Estilos CSS
- **Problema**: No hay CSS tradicional ni hover
- **Solución**: StyleSheet de React Native
- **Adaptación**: Overlay visible siempre en lugar de hover

### 4. Responsive Design
- **Problema**: No hay media queries
- **Solución**: Dimensions API y Flexbox
- **Implementación**: Cálculo dinámico de anchos

## ✅ Criterios de Evaluación

- ✓ La app cumple con toda la funcionalidad requerida
- ✓ La app es responsive y se ajusta correctamente en móvil
- ✓ La app se visualiza correctamente en Expo Go
- ✓ Código bien documentado y organizado
- ✓ Todos los hooks requeridos implementados

## 👥 Desarrollo

**Desarrollador**: [Tu nombre/grupo]
**Fecha**: Diciembre 2025
**Asignatura**: Desarrollo Multiplataforma

## 📄 Licencia

Este proyecto es parte de una práctica académica.

---

**¡Disfruta explorando películas! 🎬✨**
