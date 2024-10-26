# Sistema de Recomendación

## Instalaciones previas: Dependencias 
Las dependencias que se deben instalar son las siguientes: 
- vue, se debe poseer una versión igual o superior a la 3.5.12: `npm install vue`
- core-js, se debe poseer una versión igual o superior a la 3.8.3: `npm install core-js`
- se debe incluir también @vue/compiler-sfc con 3.5.12 o superior: `npm install @vue/compiler-sfc`
- angular: `npm install -g @angular/cli`

### Project setup
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




## Descripción del código 
### Organización en ficheros
El programa se ha agrupado en una serie de componentes separados en diferentes ficheros:
- FileReader.vue: Responsable de la gestión del archivo de texto adjuntado que contiene la matriz de utilidad

- CalculationResults.vue: Responsable de concentrar las funciones que realizan cálculos con la matriz de utilidad entrante, derivando en nuevas matrices
- RecommendationMenu.vue: Responsable de gestionar el menú de opciones para generar nuevas matrices a partir de la matriz de utilidad
- CorrelationPearson.vue: Se desarrolla una nueva matriz basada en la Correlación de Pearson
- CosineDistance.vue: Se desarrolla una nueva matriz basada en la Distancia Coseno
- EuclideanDistance.vue: Se desarrolla una nueva matriz basada en la Distancia Euclídea
- SimplePrediction.vue: Se desarrolla una nueva matriz basada en la Predicción Simple
- DifferenceAverage.vue: Se desarrolla una nueva matriz basada en la Diferencia con la media
  
La estructura empleada permite la modularidad del programa, favoreciendo las posibles futuras necesidades de escalabilidad. 

### FileReader
- El código está compuesto de tres partes: el template (interfaz), el script (lógica), y los estilos (apariencia).
  - La interfaz (template): Se encarga de que cuando el usuario sube un archivo .txt con la matriz de utilidad, pulsando el botón "Seleccionar archivo", se llame a una función capaz de almacenarlo.
  - El script: Emplea el objeto FileReader de JavaScript para leer el archivo como texto y emitir el contenido leído al componente padre a través del evento fileContentLoaded.
  - Los estilos (style): Define el diseño visual del componente, en este caso se dispone de un botón para la selección del archivo y un contenedor.

- En fileContent se almacena el contenido del archivo


### CalculationResults
- La función está diseñada para mostrar los resultados de los cálculos de las métricas de similitud y predicciones a partir de una matriz de utilidad.
- Permite al usuario elegir diferentes tipos de cálculos, según la métrica o el tipo de predicción, y descargar la matriz resultante en un archivo de texto.

- La interfaz (*template*): 
  - Se muestra el título "Resultados de Cálculo".
  - En el caso de que se haya cargado un archivo (fileContent), se renderiza dinámicamente un componente basado en la métrica seleccionada (pearson, cosine, euclidean) para calcular la matriz de similitud.
  - En función del tipo de predicción (simple o meanDifference) se muestra el componente correspondiente para calcular la predicción.
  - Proporciona un botón para descargar la matriz de similitud en un archivo de texto (.txt), en el caso de que se haya calculado.
  - Si no hay contenido de archivo disponible, muestra el mensaje "No hay contenido del archivo disponible".

- El *script*:
  - En **Props** se definen los datos que se espera recibir desde su componente padre:
      - *selectedMetric*: La métrica seleccionada en cuestión ("pearson", "cosine" o "euclidean"). Es importante para decidir qué componente de similitud se debe cargar.
      - *fileContent*: Recibe el contenido del archivo que ha sido cargado, es decir, la matriz de utilidad.
      - *numNeighbors*: Define el número de vecinos que se van a considerar en el cálculo de predicciones.
      - *selectedPredictionType*: Especifica el tipo de predicción que se debe realizar ("simple" o "meanDifference"). Es importante para elegir qué tipo de predicción aplicar a los datos una vez calculada la matriz de similitud.

  - En **Data** se encuentran las variables internas del componente que se inicializan cuando éste se crea.
      - *utilityMatrix*: Es un array vacío, se inicializará al cargar el componente. Contendrá la matriz de utilidad.
      - *similarityMatrix*: Es un array vacío, se inicializará al cargar el componente. Contendrá la matriz de similitud.

  - En **Computed** se establecen las propiedades computadas, es decir, aquellos valores derivados que dependen de otras propiedades y que se actualizan automáticamente cuando cambian sus dependencias.
      - *selectedMetric*: El switch permite, en función del valor de selectedMetric, seleccionar el componente correspondiente:
        - Si es 'pearson', devuelve el componente 'PearsonCorrelation'.
        - Si es 'cosine', devuelve el componente 'CosineDistance'.
        - Si es 'euclidean', devuelve el componente 'EuclideanDistance'.
        - Si no coincide con ninguno de estos valores, devuelve null, lo que significa que no se selecciona ningún componente de los contemplados.
  - En **Components**: Se define una lista de componentes importados que el componente actual utilizará en la plantilla.
  - En **Methods**: Se definen los métodos del componente.
      - *updateMatrices*: El método se encarga de actualizar las matrices de utilidad y similitud y emite un evento (*matrixUpdated*) al componente padre, pasando *utilityMatrix* y *similarityMatrix*.
      - *downloadSimilarityMatrix*: Muestra cuál es la métrica elegida, el número de vecinos, tipo de predicción, la matriz de similitud y los vecinos seleccionados para cada usuario, junto con las valoraciones para cada uno de los ítems, en un archivo .txt.


### RecommendationMenu
- La función está diseñada para permitir al usuario seleccionar la métrica de similitud, el tipo de predicción y el número de vecinos necesarios para realizar cálculos a partir de una matriz de utilidad.

- La interfaz (*template*):
  - Se muestra el título "Selecciona la métrica y el tipo de predicción".
  - Tipo de Métrica (*selectedMetric*):
    - Se presenta un menú desplegable de opciones que permite al usuario seleccionar la métrica de similitud (Pearson, Coseno, o Euclidiana) que desea obtener.
  - Número de vecinos (*neighbors*): 
    - Un campo de entrada permite al usuario definir el número de vecinos (se establece un mínimo de 1).
  - Tipo de predicción (*predictionType*):
    - Un segundo menú desplegable permite elegir entre predicciones simples o basadas en la diferencia con la media.
  - Visualización de las opciones escogidas:
    - Se muestra un cuadro de texto con un resumen de las opciones seleccionadas (métrica, número de vecinos y tipo de predicción).
    - En caso de que no se seleccionen opciones, se muestran valores predeterminados ("Ninguna seleccionada" o "No especificado").
- El *script*:
  - **Data**:
    - *selectedMetric*: Guarda el nombre de la métrica de similitud seleccionada (inicialmente vacía).
    - *selectedPredictionType*: Guarda el nombre del tipo de predicción seleccionada (inicialmente vacío).
    - *numNeighbors*: Almacena el número de vecinos introducido por el usuario (inicialmente null).
  - **Methods**:
    - *emitSelection*: El método es llamado cada vez que el usuario cambia una de las opciones (métrica, vecinos, tipo de predicción).
      - Emite un evento *updateMetrics* con las selecciones actuales (selectedMetric, selectedPredictionType y numNeighbors), lo que permite que el componente padre actualice su configuración de cálculo.



### CorrelationPearson

### CosineDistance

### EuclideanDistance

### SimplePrediction

### DifferenceAverage


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
  - Predicción simple
  - Diferencia con la media
  
En el recuadro (5) se mostrará las opciones elegidas, es decir, la métrica seleccionada, número de vecinos y el tipo de predicción.

![EjemploUso](/ejemplouso.png)

Si se han proporcionado adecuadamente todos los datos requeridos, en la parte inferior, se mostrarán una serie de botones:
- Para decidir si mostrar u ocultar la matriz resultante con la métrica seleccionada (6)
- Para decidir si mostrar u ocultar la matriz resultante con la predicción escogida (7)
- Para poder descargar un archivo en formato .txt con la matriz de utilidad, los vecinos seleccionados para cada usuario, así como su similitud (8)

![EjemploUso](/ejemplouso2.png)

