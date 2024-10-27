<template>
  <div>
    <h4 v-if="flag">No es un número válido de vecinos</h4>
    <h4 v-if="!flag"> {{ predictionTypeStr }}</h4>

    <!-- Mostrar/ocultar botón si hay predicciones y no hay error -->
    <div v-if="!flag && prediction.length">
      <button @click="toggleTable">
        {{ showTable ? 'Ocultar' : 'Mostrar' }} Predicciones
      </button>
    </div>

    <div v-if="showTable && !flag && prediction.length">
      <table>
        <thead>
          <tr>
            <th>Usuario/Ítem</th>
            <!-- Generar encabezados dinámicamente para los ítems -->
            <th v-for="(itemPred, itemIndex) in prediction[0]" :key="itemIndex">Ítem {{ itemIndex + 1 }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Filas para cada usuario -->
          <tr v-for="(userPredictions, userIndex) in prediction" :key="userIndex">
            <td>Usuario {{ userIndex + 1 }}</td>
            <!-- Celdas para cada predicción de ítem -->
            <td v-for="(itemPred, itemIndex) in userPredictions" :key="itemIndex">
              {{ isNumeric(itemPred) ? itemPred.toFixed(4) : 'N/A' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { isNumeric } from '@/utils/utils';
export default {
  props: {
    numNeighbors: {
      type: Number,
      required: true
    },
    utilityMatrix: {
      type: Array,
      required: true
    },
		similarityMatrix: {
			type: Array,
			required: true
		},
    prediction: {
      type: Array,
      required: true
    },
    predictionTypeStr: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      flag: false,
      showTable: false // Controla si la tabla debe mostrarse o no
    };
  },
  methods: {
    // Alternar la visibilidad de la tabla
    toggleTable() {
      this.showTable = !this.showTable;
    },
    isNumeric
  }
};
</script>


<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th, td {
  border: 1px solid #dee2e6;
  padding: 8px;
  text-align: center;
}

.custom-file-upload {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3498db; /* Color de fondo azul */
  color: #fff; /* Texto en blanco */
  font-size: 16px;
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cambia el cursor a puntero */
  transition: background-color 0.3s ease; /* Transición suave al pasar el ratón */
}

.custom-file-upload:hover {
  background-color: #2980b9; /* Color de fondo más oscuro cuando el ratón está encima */
}

/* Estilos del contenedor y del input de archivo */
.file-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  text-align: center;
}

input[type="file"] {
  display: none; /* Ocultar input de archivo */
}

.custom-file-upload {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.custom-file-upload:hover {
  background-color: #2980b9;
}

button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  font-size: 16px;
  border-radius: 5px;
  border-color: #3498db;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.file-output {
  margin-top: 20px;
  text-align: left;
}

</style>