# sistema_recomendacion

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).






## Ejemplo de uso

Para ejecutar el programa se debe iniciar en una terminal "npm run serve", a continuación mediante un navegador web se abre la IP en cuestión con el puerto 8080.

Una vez en el navegador web:
- Se debe adjuntar un archivo que contenga la matriz de utilidad (1)
- Se debe seleccionar la métrica deseada (2) de las opciones posibles:
-- Correlación de Pearson
-- Distancia coseno
-- Distancia euclídea
- Se debe introducir el número de vecinos (3)
- Se debe seleccionar el tipo de predicción (4) de las opciones posibles:
-- Predicción simple
-- Diferencia con la media
  
En el recuadro (5) se mostrará las opciones elegidas, es decir, la métrica seleccionada, número de vecinos y el tipo de predicción.

[!EjemploUso](/ejemplouso.png)](https://nodesource.com/products/nsolid)

Si se han proporcionado adecuadamente todos los datos requeridos, en la parte inferior, se mostrarán una serie de botones:
- Para decidir si mostrar u ocultar la matriz resultante con la métrica seleccionada (6)
- Para decidir si mostrar u ocultar la matriz resultante con la predicción escogida (7)
- Para poder descargar un archivo en formato .txt con la matriz de utilidad, los vecinos seleccionados para cada usuario, así como su similitud (8)

[!EjemploUso2](ejemplouso2.png)](ejemplouso2.png)


