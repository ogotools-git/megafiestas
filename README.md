# Mega Fiestas Yumbo — catálogo MVP

## Qué contiene
- 6 categorías principales visibles.
- Solo Rimax está habilitada por ahora.
- Rimax se construye con los 20 productos reales del CSV.
- Navegación: Rimax → Armarios/Mesas → Segmentos → Productos → Ficha.
- No se inventan precios, stock ni referencias.
- El botón de WhatsApp queda pendiente hasta definir el número real.

## Cómo verlo en Visual Studio Code
1. Abre la carpeta `megafiestasyumbo_catalogo` en VS Code.
2. Instala la extensión **Live Server** si no la tienes.
3. Haz clic derecho sobre `index.html`.
4. Elige **Open with Live Server**.

## Imágenes
El código espera las imágenes de producto siguiendo esta estructura:

`rimax/Armarios/Grandes/archivo.webp`
`rimax/Armarios/Medianos/archivo.webp`
`rimax/Armarios/Infantiles/archivo.webp`
`rimax/Armarios/Multiusos/archivo.webp`
`rimax/Mesas/Auxiliares/archivo.webp`
`rimax/Mesas/Comedor/archivo.webp`

El nombre del archivo se toma exactamente de la columna `ruta imagen` del CSV.

## Archivos
- `data/basededatos.csv`: copia del CSV maestro.
- `js/datos.js`: datos generados desde el CSV para esta versión.
- `js/catalogo.js`: navegación y fichas.
- `css/estilos.css`: diseño.
- `index.html`: estructura principal.

## Importante
Para esta primera versión, `js/datos.js` ya contiene los datos del CSV para evitar problemas al abrir el sitio localmente. Cuando el catálogo esté validado, podemos automatizar la lectura/actualización del CSV o migrar a una base de datos real.
