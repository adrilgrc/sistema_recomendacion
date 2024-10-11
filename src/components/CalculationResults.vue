<template>
  <div class="calculation-results">
    <h3>Resultados de Cálculo</h3>
    <p>Métrica seleccionada: <strong>{{ selectedMetric }}</strong></p>
    <p>Tipo de predicción seleccionado: <strong>{{ selectedPredictionType }}</strong></p>

    <div v-if="fileContent" class="file-output">
      <h4>Contenido del archivo:</h4>
      <pre>{{ fileContent }}</pre>
      <h4>Correlación de Pearson: <strong>{{ pearsonCorrelation }}</strong></h4>
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
    }
  },
  data() {
    return {
      pearsonCorrelation: null
    };
  },
  watch: {
    fileContent(newContent) {
      if (newContent) {
        this.calculatePearsonCorrelation(newContent);
      }
    }
  },
  methods: {
    // Función para parsear los datos y calcular la correlación de Pearson
    calculatePearsonCorrelation(content) {
      // Asumiendo que el contenido es un CSV con dos columnas separadas por comas
      const rows = content.trim().split('\n');
      const xValues = [];
      const yValues = [];
      
      rows.forEach(row => {
        const [x, y] = row.split(',').map(Number); // Parsear los valores a números
        xValues.push(x);
        yValues.push(y);
      });

      const n = xValues.length;
      if (n !== yValues.length || n === 0) {
        this.pearsonCorrelation = 'Error en los datos';
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
  color: #34495e; /* Color para el título del contenido del archivo */
}

.file-output {
  background-color: #ecf0f1; /* Fondo del contenido del archivo */
  padding: 10px; /* Espaciado interno */
  border-radius: 5px; /* Esquinas redondeadas */
  overflow-x: auto; /* Habilita el desplazamiento horizontal */
  white-space: pre-wrap; /* Permite que el texto se ajuste en lugar de desbordarse */
}

pre {
  margin: 0; /* Elimina el margen del elemento pre */
  font-family: monospace; /* Fuente monoespaciada para mayor legibilidad */
  color: #333; /* Color del texto */
}
</style>