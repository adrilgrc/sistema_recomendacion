<template>
  <div>
    <h4 v-if="flag">Alguno de los valores de la matriz de similitud está fuera del rango permitido</h4>
    <h4 v-if="!flag">{{ title }}</h4>

    <!-- Botón para mostrar/ocultar la tabla si no hay error y la matriz está disponible -->
    <div v-if="!flag && matrix.length">
      <button @click="toggleTable">
        {{ this.showTable ? 'Ocultar' : 'Mostrar' }} Matriz
      </button>
    </div>

    <table v-if="this.showTable && !flag && matrix.length && matrix">
      <thead>
        <tr>
          <th>Usuario</th>
          <th v-for="(user, index) in matrix.length" :key="index">Usuario {{ index + 1 }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in matrix" :key="rowIndex">
          <td>Usuario {{ rowIndex + 1 }}</td>
          <td v-for="(value, colIndex) in row" :key="colIndex">{{ value !== null ? value.toFixed(4) : 'N/A' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    matrix: {
      type: Array,
      required: true,
    },
    flag: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showTable: false, // Controla si la tabla debe mostrarse o no
    };
  },
  methods: {
    // Alternar la visibilidad de la tabla
    toggleTable() {
      this.showTable = !this.showTable;
    },
  },
};
</script>