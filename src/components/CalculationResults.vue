<template>
  <div class="calculation-results">
    <h3>Resultados de Cálculo</h3>
    <p>Métrica seleccionada: <strong>{{ selectedMetric }}</strong></p>
    <p>Tipo de predicción seleccionado: <strong>{{ selectedPredictionType }}</strong></p>
    <p>Número de vecinos: <strong>{{ numNeighbors }}</strong></p>
    
    <div v-if="fileContent" class="file-output">
      <h4>Contenido del archivo:</h4>
      <pre>{{ fileContent }}</pre>
      <h4>Correlación de Pearson: <strong>{{ pearsonCorrelation }}</strong></h4>
      <h4>Distancia Coseno: <strong>{{ cosineDistance }}</strong></h4>
      <h4>Distancia Euclídea: <strong>{{ euclideanDistance }}</strong></h4>
      <h4>Predicción Simple: <strong>{{ simplePrediction }}</strong></h4> <!-- Añadido aquí -->
    </div>
    
    <div v-else>
      <p>No hay contenido del archivo disponible.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedMetric: {
      type: String,
      required: true
    },
    selectedPredictionType: {
      type: String,
      required: true
    },
    fileContent: {
      type: String,
      default: ''
    }, 
    numNeighbors: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      pearsonCorrelation: null,
      cosineDistance: null, // Almacenamos la distancia coseno
      euclideanDistance: null, // Almacenamos la distancia euclídea
      simplePrediction: null // Almacenamos la predicción simple
    };
  },
  watch: {
    fileContent(newContent) {
      if (newContent) {
        this.calculateMetrics(newContent);
        this.calculateSimplePrediction(newContent); // Llamamos a la función de predicción simple
      }
    }
  },
  methods: {
    // Función para calcular métricas
    calculateMetrics(content) {
      if (this.selectedMetric === 'pearson') {
        this.calculatePearsonCorrelation(content);
      } else if (this.selectedMetric === 'cosine') {
        this.calculateCosineDistance(content);
      } else if (this.selectedMetric === 'euclidean') {
        this.calculateEuclideanDistance(content);
      }
    },

    // Función para calcular la correlación de Pearson
    calculatePearsonCorrelation(content) {
      const rows = content.trim().split('\n');
      const userRows = rows.slice(2);
      const xValues = [];
      const yValues = [];

      userRows.forEach(row => {
        const values = row.split(' ').map(val => (val === '-' ? null : Number(val)));

        if (!values.includes(null)) {
          xValues.push(values[0]);
          yValues.push(values[1]);
        }
      });

      const n = xValues.length;
      if (n === 0 || xValues.length !== yValues.length) {
        this.pearsonCorrelation = 'Error en los datos o no suficientes datos válidos';
        return;
      }

      const sumX = xValues.reduce((a, b) => a + b, 0);
      const sumY = yValues.reduce((a, b) => a + b, 0);
      const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
      const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);
      const sumY2 = yValues.reduce((sum, y) => sum + y * y, 0);

      const numerator = (n * sumXY) - (sumX * sumY);
      const denominator = Math.sqrt(
        (n * sumX2 - Math.pow(sumX, 2)) * (n * sumY2 - Math.pow(sumY, 2))
      );

      if (denominator === 0) {
        this.pearsonCorrelation = 'División por cero';
      } else {
        this.pearsonCorrelation = (numerator / denominator).toFixed(4);
      }
    },

    // Función para calcular la distancia coseno
    calculateCosineDistance(content) {
      const rows = content.trim().split('\n');
      const userRows = rows.slice(2);
      const xValues = [];
      const yValues = [];

      userRows.forEach(row => {
        const values = row.split(' ').map(val => (val === '-' ? null : Number(val)));

        if (!values.includes(null)) {
          xValues.push(values[0]);
          yValues.push(values[1]);
        }
      });

      if (xValues.length === 0 || yValues.length === 0) {
        this.cosineDistance = 'Error en los datos o no suficientes datos válidos';
        return;
      }

      // Calcular el producto punto y las magnitudes
      const dotProduct = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
      const magnitudeX = Math.sqrt(xValues.reduce((sum, x) => sum + x * x, 0));
      const magnitudeY = Math.sqrt(yValues.reduce((sum, y) => sum + y * y, 0));

      // Calcular la distancia coseno
      if (magnitudeX === 0 || magnitudeY === 0) {
        this.cosineDistance = 'División por cero';
      } else {
        const cosineSimilarity = dotProduct / (magnitudeX * magnitudeY);
        this.cosineDistance = (1 - cosineSimilarity).toFixed(4); // La distancia coseno es 1 - similitud
      }
    },

    // Función para calcular la distancia euclídea
    calculateEuclideanDistance(content) {
      const rows = content.trim().split('\n');
      const userRows = rows.slice(2);
      const xValues = [];
      const yValues = [];

      userRows.forEach(row => {
        const values = row.split(' ').map(val => (val === '-' ? null : Number(val)));

        if (!values.includes(null)) {
          xValues.push(values[0]);
          yValues.push(values[1]);
        }
      });

      if (xValues.length === 0 || yValues.length === 0) {
        this.euclideanDistance = 'Error en los datos o no suficientes datos válidos';
        return;
      }

      // Calcular la distancia euclídea
      const distance = Math.sqrt(
        xValues.reduce((sum, x, i) => sum + Math.pow(x - yValues[i], 2), 0)
      );

      this.euclideanDistance = distance.toFixed(4);
    },

    // Función para calcular la predicción simple
    calculateSimplePrediction(content) {
      const rows = content.trim().split('\n');
      const userRows = rows.slice(2);
      const values = [];

      userRows.forEach(row => {
        const value = row.split(' ').map(val => (val === '-' ? null : Number(val)));
        if (!value.includes(null)) {
          values.push(value[1]); // Supongamos que queremos predecir basándonos en la segunda columna
        }
      });

      if (values.length === 0) {
        this.simplePrediction = 'Error en los datos o no suficientes datos válidos';
        return;
      }

      // Calcular la media de los valores de los vecinos más cercanos
      const sortedValues = values.slice(0, this.numNeighbors).sort((a, b) => a - b);
      const sum = sortedValues.reduce((a, b) => a + b, 0);
      this.simplePrediction = (sum / sortedValues.length).toFixed(4);
    }
  }
};
</script>

<style scoped>
.calculation-results {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #2980b9;
  margin-bottom: 10px;
}

h4 {
  color: #34495e;
}

.file-output {
  background-color: #ecf0f1;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
  white-space: pre-wrap;
}

pre {
  margin: 0;
  font-family: monospace;
  color: #333;
}
</style>
