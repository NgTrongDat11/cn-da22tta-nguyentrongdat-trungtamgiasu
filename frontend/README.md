# Frontend - Trung Tâm Gia Sư

## Cấu trúc thư mục

```
src/
├── components/      # Reusable components (Button, Input, Layout, etc)
├── pages/           # Page components (HomePage, LoginPage, etc)
├── services/        # API calls (authService, tutorService, etc)
├── hooks/           # Custom hooks (useAuth, useFetch, etc)
├── utils/           # Utilities (constants, helpers)
├── types/           # Type definitions
├── styles/          # Global CSS (components, variables)
├── context/         # React Context (Auth, global state)
└── assets/          # Images, icons
```

## Packages sẵn có

- **React 18** - UI library
- **React Router v6** - Routing
- **Axios** - HTTP client

## CSS Organization

- `index.css` - Global styles
- `App.css` - App-level styles
- `styles/components.css` - Component styles
- `styles/variables.css` - CSS variables (colors, spacing, etc)

## Cách sử dụng

Tạo các page trong `pages/` và import trong `App.jsx`

Các component reusable nên được tạo trong `components/` folder

API calls nên sử dụng các service files trong `services/`
