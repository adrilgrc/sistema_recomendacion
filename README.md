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
- Se encarga de calcular y mostrar la matriz de similitud basada en la correlación de Pearson a partir de los datos de entrada proporcionados en la matriz de utilidad. Permite al usuario alternar la visibilidad de la tabla de resultados y notifica al componente padre cuando el cálculo está completo.
- La interfaz (*template*):
  - Botón para mostrar/ocultar la matriz: Se muestra un botón que permite alternar entre mostrar y ocultar la tabla de la matriz de similitud (“Mostrar Matriz” y “Ocultar Matriz”), siempre y cuando se cumplan las siguientes condiciones:
    - No haya errores (*flag* sea false).
    - La matriz no esté vacía (*matrix.length* > 0).
  - Si *showTable* es true (se cliqueó sobre 'Mostrar' en el botón), se muestra *MatrixDisplay* con la matriz de similitud (matrix) y el título "Matriz de Similitud de Correlación de Pearson".
  - *MatrixDisplay* recibe también el estado flag, que indica si la matriz tiene valores fuera de rango.
- El *script*:
  - **Props**:
    - *content*: es de tipo String y es obligatorio.
      - Contiene los datos de la matriz de utilidad, en formato de texto, que serán procesados para el cálculo de la matriz de similitud.
  - **Data**:
    - *matrix*: Array vacío que almacenará la matriz de similitud calculada mediante la correlación de Pearson.
    - *flag*: Indicador que se activa (`true`) si la matriz contiene valores fuera del rango permitido.
    - *showTable*: Booleano que controla la visibilidad de la tabla.
  - **Components**:
    - Importa y registra el componente *MatrixDisplay* para mostrar la matriz de similitud cuando *showTable* es true.
  -  **Methods**:
    - *toggleTable*: Alterna el valor de *showTable* entre true y false, controlando la visibilidad de la tabla.
    - *calculatePearsonCorrelation*: Calcula la matriz de similitud de Pearson en función de la matriz de utilidad.
      - Se comienza reseteando la varaible *flag* para indicar que todas las valoraciones son válidas inicialmente.
      - Se extraen los datos necesarios mediante la función *parseInputData()*, con el objetivo de obtener el valor mínimos (*minValue*), máximo (*maxValue*) y las filas de usuarios (*userRows*), donde cada fila contiene las valoraciones de un usuario determinado.
      - El número de usuarios (*numUsers*) se obtiene a partir del número de elementos de *userRows*.
        - Con dicho número, se crea una matriz de ceros, de dimensiones *numUsers* x *numUsers*, llamada *matrix*, que almacenará la similitud entre los distintos usuarios (las distancias).
      - Se itera sobre *userRows* para calcular las correlaciones entre cada par de usuarios. La correlación se calcula solo si los valores están dentro del rango permitido (definido por *minValue* y *maxValue*).
      - Si algún valor está fuera de rango, se devuelve `null` y se activa la variable *flag* para indicar que ocurrió un error.
      - Si las valoraciones son válidas y no tienen valores nulos, la función crea una lista de pares de valoraciones *validPairs* de cada determinado ítem, siendo cada elemento del par la valoración de cada usuario del par.
      - Almacena la correlación entre cada par de usuarios en la matriz, siendo 1 para la diagonal (correlación de cada usuario consigo mismo).
      - Emite el evento *matrixComputed* al componente padre, pasando *userRows* como la matriz de utilidad y *matrix* como la matriz de similitud de Pearson.
       
### CosineDistance
- Es responsable de calcular y mostrar la matriz de similitud basada en la distancia coseno a partir de los datos de entrada proporcionados en una matriz de utilidad. Permite al usuario alternar la visibilidad de la tabla de resultados y notifica al componente padre cuando el cálculo está completo.
- Posee una estructura muy similar a *CorrelationPearson*, así que se resaltarán las diferencias:
- La interfaz (*template*):
  - Al igual que *CorrelationPearson* cuenta con un botón para mostrar/ocultar la matriz, con las mismas condiciones mencionadas en el anterior apartado.
- El *script*:
  - **Props**:
    - *content*: es de tipo String y es obligatorio.
      - Contiene los datos de la matriz de utilidad, en formato de texto, que serán procesados para el cálculo de la matriz de similitud.
  - **Data**:
    - *cosineMatrix*: Array vacío que almacenará la matriz de similitud calculada mediante la distancia coseno.
    - *flag*.
    - *showTable*.
  - **Components**:
    - *MatrixDisplay*.
  - **Methods**:
    - *toggleTable*.
    - *calculateCosineDistance*: Calcula la matriz de similitud de distancia coseno en función de la matriz de utilidad proporcionada.
      - Se resetea *flag*.
      - Emplea `parseInputData()`.
      - Itera sobre *userRows*.
      - Se obtiene el número de usuarios *numUsers*.
      - Para el cálculo de similitud coseno:
        - Se calcula el producto entre los valores de cada par de usuarios.
        - Se calculan las magnitudes de los vectores de cada usuario.
        - La distancia coseno es el cociente entre el producto punto y el producto de las magnitudes.
        - Si hay valores fuera de rango o el denominador es 0, asigna null a ese valor en la matriz y activa flag.
        - La matriz resultante almacena las distancias coseno, con 1 en la diagonal para la similitud de un usuario consigo mismo y simetría entre posiciones (i,j) y (j,i).
      - Emite el evento *matrixComputed* al componente padre, pasando *userRows* como la matriz de utilidad y *cosineMatrix* como la matriz de similitud de distancia coseno.

### EuclideanDistance
- Calcula y muestra la matriz de similitud basada en la distancia euclidiana a partir de los datos de entrada proporcionados en una matriz de utilidad.
- Posee una estructura muy similar al resto de métricas, así que se resaltarán las diferencias:
- La interfaz (*template*):
  - Como en el resto de métricas, se cuenta con un botón para mostrar/ocultar la matriz.
- El *script*:
 - **Props**:
    - *content*: es de tipo String y es obligatorio.
      - Contiene los datos de la matriz de utilidad, en formato de texto, que serán procesados para el cálculo de la matriz de similitud.
  - **Data**:
    - *euclideanMatrix*: Array vacío que almacenará la matriz de similitud calculada mediante la distancia euclídea.
    - *flag*.
    - *showTable*.
  - **Methods**:
    - *toggleTable*.
    - *calculateEuclideanDistance*: Calcula la matriz de similitud basada en la distancia euclídea entre cada par de usuarios.
      - Se resetea *flag*.
      - Emplea `parseInputData()`.
      - Itera sobre *userRows*.
      - Se obtiene el número de usuarios *numUsers*.
      - Para el cálculo de similitud euclídea:
        - Se crea una matriz de *numUsers* x *numUsers* inicializada en 0, que se usará para almacenar las distancias euclídeas entre cada par de usuarios.
        - Se itera sobre todos los pares de usuarios en *userRows*, tomando cada par de usuarios.
        - Si ambos usuarios son iguales (i === j), la distancia se define como 0 (la distancia de un usuario consigo mismo).
        - Para cada par de usuarios distintos, se llama al método *euclideanSimilarityByPair*, que calcula la distancia entre ambos.
        - El resultado se almacena en `matrix[i][j]` y `matrix[j][i]`, asegurando que la matriz sea simétrica.
      - Se verifica si existe algún valor en la matriz (*matrix*) que sea `null`. Si encuentra al menos uno, establece *flag* como true. En caso contrario, *flag* continua como false.
      - Se actualiza *euclideanMatrix* con la matriz calculada y se emite el evento *matrixComputed* al componente padre, pasando *userRows* como la matriz de utilidad y *euclideanMatrix* como la matriz de similitud basada en la distancia euclídea.
    - *euclideanSimilarityByPair*: Calcula la distancia euclídea entre dos usuarios (*userAValues* y *userBValues*) en función de sus valores, siempre y cuando estén dentro de un rango permitido (*minValue* y *maxValue*).
      - Se comienza validando el rango de valores:
        - Se verifica si algún valor en *userAValues* o *userBValues* está fuera del rango permitido, es decir, si es menor que *minValue* o mayor que *maxValue*. Si se encuentra algún valor fuera de rango:
         - Se activa *flag* para indicar que hay un error.
         - El método retorna `null`, lo cual señala que la distancia no puede ser calculada para este par de usuarios.
      - Se filtran los valores `null` en ambas listas de valores (*userAValues* y *userBValues*), creando pares solo con valores válidos.
        - *validPairs* contiene únicamente aquellos pares de valores en los que tanto x como y no son `null`.
      - En caso de no encontrar pares válidos (*validPairs* está vacío), el método retorna `null`, indicando que no hay suficiente información para calcular la distancia entre los dos usuarios.
      - Se calcula la suma de los cuadrados de las diferencias entre los valores de cada par (`sqrt(sum((a - b)^2))`).
        - Donde a y b son los valores de cada par correspondiente entre los usuarios.

### SimplePrediction
- Calcula y muestra la predicción simple para cada usuario e ítem, basándose en la matriz de utilidad y la matriz de similitud. Además, predice los valores que faltan en la matriz de utilidad en función de los vecinos más cercanos del usuario.
- Posee una estructura muy similar al resto de componentes, así que se resaltarán las diferencias.
- La interfaz (template):
  - Como en el resto de componentes, cuenta con un botón para mostrar/ocultar la matriz.
  - Si el número de vecinos (*numNeighbors*) no es válido, se muestra el mensaje "No es un número válido de vecinos".
  - Si no hay errores, se muestra el título "Predicción Simple".
- El *script*:
  - **Props**:
    - *numNeighbors*: El número de vecinos que se considerarán para calcular las predicciones (debe ser un número positivo y menor que el número de usuarios).
    - *utilityMatrix*: La matriz de utilidad.
    - *similarityMatrix*: La matriz de similitud entre usuarios.
  - **Data**:
    - *prediction*: Array vacío que almacenará las predicciones calculadas para cada usuario e ítem.
    - *flag*.
    - *showTable*.
  -  **Methods**:
    - *toggleTable*.
    - *calculateSimplePrediction*: Calcula las predicciones para los valores faltantes en la matriz de utilidad.
      - Se verifica que *numNeighbors* sea un número válido, es decir, que sea positivo y menor que el número total de usuarios en *utilityMatrix*.
        - Si *numNeighbors* no es válido, activa *flag* y sale del método sin hacer cálculos.
      - Se crea una matriz *prediction* del mismo tamaño que *utilityMatrix* para almacenar los resultados de predicción.
      - Cálculo de Predicciones:
        - Se itera sobre cada usuario (i) y cada ítem (j):
        - Si el valor ya está disponible en *utilityMatrix[i][j]* (es decir, no es `null`), se copia en *prediction* sin cambios.ç
        - Si el valor es `null`, se realiza la predicción:
          - Selección de Vecinos:
            - Se ordenan los vecinos en función de la similitud en *similarityMatrix* con el usuario actual (i).
            - Filtra a los vecinos que tienen similitud distinta de `null` y selecciona los *numNeighbors* más similares.
          - Calcula la predicción siguiendo la fórmula
            - Si la suma de las similitudes es diferente de 0, la predicción es el promedio ponderado.
            - En caso contrario, la predicción se establece en 0.
        - Se asigna la matriz *prediction* calculada.

### DifferenceAverage
- Calcula y muestra la predicción basada en la diferencia con la media para cada usuario e ítem, utilizando la matriz de utilidad y la matriz de similitud. Además, predice los valores que faltan por definir en la matriz de utilidad ajustando la predicción de acuerdo a la diferencia con la media de los valores conocidos de los vecinos.
- Posee una estructura muy similar al resto de componentes, así que se resaltarán las diferencias.
 - La interfaz (template):
  - Como en el resto de componentes, cuenta con un botón para mostrar/ocultar la matriz.
  - Si el número de vecinos (*numNeighbors*) no es válido, se muestra el mensaje "No es un número válido de vecinos".
  - Si no hay errores, se muestra el título "Predicción Simple".
  - **Props**:
    - *numNeighbors*: El número de vecinos que se considerarán para calcular las predicciones (debe ser un número positivo y menor que el número de usuarios).
    - *utilityMatrix*: La matriz de utilidad.
    - *similarityMatrix*: La matriz de similitud entre usuarios.
  - **Data**:
    - *prediction*: Array vacío que almacenará las predicciones calculadas para cada usuario e ítem.
    - *flag*.
    - *showTable*.
  -  **Methods**:
    - *toggleTable*.
    - *calculateDifferenceAveragePrediction*: Calcula las predicciones para los valores faltantes en la matriz de utilidad, ajustando según la media de los vecinos más cercanos.
      - Se verifica que *numNeighbors* sea un número válido, es decir, que sea positivo y menor que el número total de usuarios en *utilityMatrix*.
        - Si *numNeighbors* no es válido, activa *flag* y sale del método sin hacer cálculos.
      - Se crea una matriz *prediction* del mismo tamaño que *utilityMatrix* para almacenar los resultados de predicción.
      - Cálculo de Predicciones:
        - Se itera sobre cada usuario (i) y cada ítem (j):
        - Si el valor ya está disponible en *utilityMatrix[i][j]* (es decir, no es `null`), se copia en *prediction* sin cambios.ç
        - Si el valor es `null`, se realiza la predicción:
          - Selección de Vecinos:
            - Se ordenan los vecinos en función de la similitud en *similarityMatrix* con el usuario actual (i).
            - Filtra a los vecinos que tienen similitud distinta de `null` y selecciona los *numNeighbors* más similares.
          - Calcula la predicción siguiendo la fórmula
            - Calcula el promedio de las calificaciones del usuario (*AverageUser(i)*) y ajusta cada valor vecino usando su diferencia respecto a su propia media (*AverageUser(user)*).
            - Si la suma de las similitudes es diferente de 0, la predicción es el promedio ponderado; de lo contrario, se establece en la media del usuario i.
        - Se asigna la matriz *prediction* calculada.
        - *AverageUser*:
          - Calcula la media de las calificaciones conocidas de un usuario en *utilityMatrix*.
          - Filtra las calificaciones null y calcula la media de los ítems calificados, devolviendo este valor como la media del usuario.

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

