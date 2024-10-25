# Sistema de Llamados y Análisis de CVs

Este proyecto es un sistema web que permite crear llamados laborales y analizar currículums enviados por los postulantes en formato PDF. Utiliza **Bootstrap** para el diseño de la interfaz, **Chart.js** para gráficos de análisis de coincidencias, y **PDF.js** para procesar los archivos PDF.

## Características

- **Creación de Llamados**: Permite registrar información sobre un llamado laboral, incluyendo el nombre de la empresa, una descripción del puesto, y las aptitudes requeridas.
- **Subida de Currículums**: Los usuarios pueden subir múltiples archivos PDF con sus currículums para su análisis.
- **Análisis Automático de Coincidencias**: El sistema analiza el contenido del currículum y lo compara con las aptitudes requeridas en el llamado, mostrando un porcentaje de coincidencia.
- **Visualización de Resultados**: Muestra los 5 mejores currículums que coinciden con el llamado a través de gráficos tipo dona, indicando también si el currículum incluye una imagen o fotografía.

## Tecnologías Utilizadas

- **HTML5** y **Bootstrap 5.3.2**: Para la estructura y el diseño responsivo de la aplicación.
- **FontAwesome 6.4.0**: Para el uso de iconos en la interfaz.
- **Chart.js 3.9.1**: Para la generación de gráficos que muestran el análisis de coincidencias entre el currículum y el llamado.
- **PDF.js 3.11.174**: Para la conversión y análisis del contenido de los archivos PDF.
- **JavaScript**: Para manejar la lógica de la aplicación, incluyendo el análisis de aptitudes, procesamiento de archivos, y la visualización de resultados.

## Estructura del Proyecto

- `index.html`: Contiene la interfaz de usuario, formularios de creación de llamados y subida de currículums, además de la lógica de análisis y visualización de resultados.
- `css/`: Directorio que almacena los estilos adicionales (si es necesario).
- `js/`: Directorio donde se podrían incluir scripts personalizados.
- `assets/`: Directorio donde se pueden almacenar imágenes, iconos u otros recursos.

## Instalación y Uso

1. **Descargar el Proyecto**: Clona el repositorio o descarga los archivos en tu equipo.
   
git clone https://github.com/ferqueve/llamados-cv.git

Abrir el archivo index.html: Simplemente abre el archivo index.html en un navegador web para acceder a la aplicación.

Crear un Llamado: Completa el formulario para crear un llamado, especificando las aptitudes requeridas.

Subir Currículums: Sube uno o más currículums en formato PDF para que el sistema los analice y muestre las mejores coincidencias.

Requisitos
Navegador moderno con soporte para JavaScript.
Conexión a internet para cargar las dependencias externas (Bootstrap, FontAwesome, Chart.js, PDF.js).
Contribución
Si deseas contribuir a este proyecto, puedes seguir los siguientes pasos:

Haz un fork del proyecto.
Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
Realiza los cambios y haz commit (git commit -m 'Añadir nueva funcionalidad').
Envía tus cambios (git push origin feature/nueva-funcionalidad).
Abre un Pull Request.
Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.