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