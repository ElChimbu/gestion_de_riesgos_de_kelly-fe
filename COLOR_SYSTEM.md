# Sistema de Colores - Dark Mode

## 🎨 **Paleta de Colores**

### **Colores Primarios (Azul)**
- `--primary-50` a `--primary-950`: Escala de azules
- **Uso**: Botones principales, enlaces, elementos de acción
- **Clases**: `text-primary`, `bg-primary`, `border-primary`

### **Colores Secundarios (Púrpura)**
- `--secondary-50` a `--secondary-950`: Escala de púrpuras
- **Uso**: Elementos secundarios, acentos, cálculos Kelly
- **Clases**: `text-secondary`, `bg-secondary`, `border-secondary`

### **Colores Terciarios (Verde/Emerald)**
- `--tertiary-50` a `--tertiary-950`: Escala de verdes
- **Uso**: Éxitos, ganancias, elementos positivos
- **Clases**: `text-tertiary`, `bg-tertiary`, `border-tertiary`

## 🌙 **Colores de Fondo**

### **Fondos Principales**
- `--bg-primary`: `#0f0f23` - Fondo principal de la aplicación
- `--bg-secondary`: `#1a1a2e` - Fondo de navbar y elementos secundarios
- `--bg-tertiary`: `#16213e` - Fondo de sidebar y elementos terciarios
- `--bg-card`: `#1e1e3f` - Fondo de tarjetas y contenedores
- `--bg-card-hover`: `#252550` - Fondo de hover en tarjetas

### **Clases de Fondo**
```css
.bg-primary { background-color: var(--bg-primary); }
.bg-secondary { background-color: var(--bg-secondary); }
.bg-tertiary { background-color: var(--bg-tertiary); }
.bg-card { background-color: var(--bg-card); }
.bg-card-hover { background-color: var(--bg-card-hover); }
```

## 📝 **Colores de Texto**

### **Jerarquía de Texto**
- `--text-primary`: `#ffffff` - Texto principal (títulos, encabezados)
- `--text-secondary`: `#e2e8f0` - Texto secundario (descripciones)
- `--text-tertiary`: `#94a3b8` - Texto terciario (subtítulos)
- `--text-muted`: `#64748b` - Texto atenuado (placeholder, info)

### **Clases de Texto**
```css
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-tertiary { color: var(--text-tertiary); }
.text-muted { color: var(--text-muted); }
```

## 🚦 **Colores de Estado**

### **Estados de Interfaz**
- `--success`: `#10b981` - Éxito, ganancias, operaciones ganadas
- `--warning`: `#f59e0b` - Advertencia, riesgo moderado
- `--error`: `#ef4444` - Error, pérdidas, operaciones perdidas
- `--info`: `#3b82f6` - Información, datos neutrales

### **Clases de Estado**
```css
.text-success { color: var(--success); }
.text-warning { color: var(--warning); }
.text-error { color: var(--error); }
.text-info { color: var(--info); }
```

## 🎯 **Gradientes**

### **Gradientes Principales**
```css
.gradient-primary {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-800));
}

.gradient-secondary {
  background: linear-gradient(135deg, var(--secondary-600), var(--secondary-800));
}

.gradient-tertiary {
  background: linear-gradient(135deg, var(--tertiary-600), var(--tertiary-800));
}

.gradient-bg {
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
}
```

## 🧩 **Componentes**

### **Botones**
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
}
```

### **Tarjetas**
```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}
```

### **Badges**
```css
.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-success { background: var(--success); color: white; }
.badge-warning { background: var(--warning); color: white; }
.badge-error { background: var(--error); color: white; }
.badge-info { background: var(--info); color: white; }
```

## 📊 **Uso por Sección**

### **Dashboard**
- **Fondo**: `bg-primary`
- **Tarjetas**: `card` con `bg-card`
- **Estadísticas**: Gradientes según el tipo de dato
- **Acciones**: `btn-primary` con gradientes

### **Riesgo Fijo**
- **Fondo**: `bg-primary`
- **Tarjetas**: `card` con `bg-card`
- **Ganancias**: `text-success` y `badge-success`
- **Pérdidas**: `text-error` y `badge-error`
- **Advertencias**: `text-warning` y `badge-warning`

### **Cálculo Kelly**
- **Fondo**: `bg-primary`
- **Formularios**: `bg-card` con inputs estilizados
- **Resultados**: `text-info` para cálculos
- **Historial**: Tabla con colores según el estado

### **Login**
- **Fondo**: Gradiente oscuro
- **Tarjeta**: `bg-card` con sombras profundas
- **Botón Google**: Estilo oficial de Google
- **Texto**: `text-primary` y `text-secondary`

## 🎨 **Consistencia Visual**

### **Principios de Diseño**
1. **Contraste**: Siempre usar colores con suficiente contraste
2. **Jerarquía**: Usar colores para establecer jerarquía visual
3. **Consistencia**: Mantener coherencia en toda la aplicación
4. **Accesibilidad**: Asegurar que los colores sean accesibles

### **Reglas de Uso**
- ✅ Usar `text-primary` para títulos importantes
- ✅ Usar `text-secondary` para descripciones
- ✅ Usar `text-success` para ganancias y éxitos
- ✅ Usar `text-error` para pérdidas y errores
- ✅ Usar `text-warning` para advertencias
- ✅ Usar `text-info` para información neutral
- ❌ No usar colores claros en fondos oscuros
- ❌ No usar colores sin suficiente contraste

## 🔧 **Personalización**

### **Modificar Colores**
Para cambiar un color, edita la variable CSS correspondiente en `src/styles/colors.css`:

```css
:root {
  --primary-600: #tu-color-aqui;
  --success: #tu-color-de-exito;
}
```

### **Agregar Nuevos Colores**
```css
:root {
  --nuevo-color: #tu-color;
}

.nuevo-color {
  color: var(--nuevo-color);
}
```

**¡El sistema está diseñado para ser consistente y fácil de mantener!** 🎨 