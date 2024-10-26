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