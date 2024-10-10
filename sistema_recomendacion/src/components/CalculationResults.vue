<template>
  <div class="calculation-results">
    <h3>Resultados de Cálculo</h3>
    <p>Métrica seleccionada: <strong>{{ selectedMetric }}</strong></p>
    <p>Tipo de predicción seleccionado: <strong>{{ selectedPredictionType }}</strong></p>
    
    <div v-if="fileContent" class="file-output">
      <h4>Contenido del archivo:</h4>
      <pre>{{ fileContent }}</pre>
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
