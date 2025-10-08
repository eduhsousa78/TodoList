<script setup>
import { ref, onMounted, watch } from "vue";

const descricao = ref("");
const todo = ref([]);
const estrelaTrue = "/estrelaTrue.png";
const estrelaFalse = "/estrelaFalse.png";

function adicionarItemToDo() {
  if (descricao.value.trim().length > 0) {
    todo.value.push({
      titulo: descricao.value.trim(),
      completo: false,
      editando: false,
      imagemAtual: estrelaFalse
    });
    descricao.value = "";
    salvarLocalStorage();
  }
}
function favoritar(index) {
  const item = todo.value[index];
  item.imagemAtual = item.imagemAtual === estrelaFalse ? estrelaTrue : estrelaFalse;
  salvarLocalStorage();
}
function deleteItemToDo(index) {
  todo.value.splice(index, 1);
  salvarLocalStorage();
}
function editarItemToDo(index) {
  todo.value[index].valorAntigo = todo.value[index].titulo;
  todo.value[index].editando = true;
}
function salvarEdicao(index) {
  const titulo = todo.value[index].titulo.trim();
  if (titulo.length === 0) return cancelarEdicao(index);
  todo.value[index].editando = false;
  salvarLocalStorage();
}
function cancelarEdicao(index) {
  if (todo.value[index].valorAntigo) {
    todo.value[index].titulo = todo.value[index].valorAntigo;
    delete todo.value[index].valorAntigo;
  }
  todo.value[index].editando = false;
}
function salvarLocalStorage() {
  localStorage.setItem("Lista To Do", JSON.stringify(todo.value));
}
onMounted(() => {
  const listaJSON = localStorage.getItem("Lista To Do");
  if (listaJSON) {
    todo.value = JSON.parse(listaJSON);
  }
});

</script>

<template>
  <div class="fundo">
    <div class="corpo">
      <div class="logo">
      <img src="/logo/logo.png" style="width: 500px; height: 250%; object-fit: contain; display: center;">
      </div>
      <div class="boxadd">
        <input class="inputadd" v-model="descricao" @keyup.enter="adicionarItemToDo"
          placeholder="Digite a sua tarefa..." />
      </div>
      <div class="add">
        <button class="botaoadd" @click="adicionarItemToDo">
          + Adicionar tarefa
        </button>
      </div>
      <div class="boxlist">
        <ul>
          <li v-for="(item, index) in todo" :key="index" class="inputlist">
            <button @click="favoritar(index)" class="botao-imagem">
              <img :src="item.imagemAtual" alt="estrela" 
                style="width: 25px; height: 25px; object-fit: contain; display: block;" />
            </button>
            <input class="check" type="checkbox" v-model="item.completo" @change="salvarLocalStorage()" />
            <template v-if="item.editando">
              <input class="inputedit" v-model="item.titulo" @keyup.enter="salvarEdicao(index)"
                @blur="salvarEdicao(index)" autofocus />
            </template>
            <template v-else>
              <span class="titulo-tarefa" :style="{ textDecoration: item.completo ? 'line-through' : 'none' }">
                {{ item.titulo }}
              </span>
            </template>
            <div class="botoes">
              <button class="btn editar" @click="editarItemToDo(index)"><img src="/edit.svg" style="width: 35px; height: 35px; object-fit: contain; display: block;"></button>
              <button class="btn deletar" @click="deleteItemToDo(index)"><img src="/delete.svg" style="width: 35px; height: 35px; object-fit: contain; display: block;"></button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  background: linear-gradient(360deg,rgba(0, 0, 0, 1) 0%, rgba(245, 198, 27, 1) 50%, rgba(245, 198, 27, 1) 100%);
  width: 100vw;
  height: 100vh;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  
}


.fundo {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
  color: #fff;
  font-size: 20px;
  
}

.corpo {
  background: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  width: 1200px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  opacity: 0.95;
  
}
.logo{
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
}
.titulo {
  text-align: center;
  margin-bottom: 1rem;
  color: #ffd700;
  font-size: 1.8rem;
  letter-spacing: 1px;
}

.boxadd {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  font-family: 'Montserrat'
}

.botao-imagem {
  background: none;
  border: none;
  padding: 0;
  margin: 0 5px;
  cursor: pointer;
}

.inputadd {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: none;
  outline: none;
  background: #d8d8d8;
  color: #000000;
  font-size: 20px;
  
}

.add {
  text-align: center;
  margin-bottom: 1.5rem;

}

.botaoadd {
  background: #ffd700;
  color: #222;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s ease;
  font-size: 20px;
}


.botaoadd:hover {
  background: #f5c518;
  transform: scale(1.05);
}

.boxlist {
  max-height: 400px;
  overflow-y: auto;
}

.check {
  appearance: none;
  width: 25px;
  height: 25px;
  border: 2px solid #999;
  border-radius: 50%; 
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative; 
}

.check:checked {
  background-color: #f5c518;
  border-color: #f5c518;
  box-shadow: 0 0 5px #585857;
}

.check:checked::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%); 
  color: #fff; 
  font-size: 14px;
  font-weight: bold;
}

.inputlist {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fcfcfc;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  margin-bottom: 0.6rem;
  border: 5px;
}

.inputlist:hover {
  
  background:rgb(235, 234, 234)0;
}

.titulo-tarefa {
  font-size: 20px;
  color: black;
  flex: 1;
  margin-left: 10px;
  font-weight: bold;
  transition: color 0.2s ease;
}

.titulo-tarefa[style*="line-through"] {
  color: #989999;
  font-weight: 600;
  font-size: 20px;
}

.inputedit {
  width: 100%;
  background: #919190;
  border: none;
  outline: none;
  color: #fff;
  border-radius: none;
  padding: 5px 10px;
  font-size: 20px;
  margin-left: 5px;
  border-radius: 5px;
}

.botoes {
  display: flex;
  gap: 5px;
  margin-left: 10px;
}

.btn {
  border: none;
  border-radius: 5px;
  padding: 5px 8px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  transition: 0.2s;
}

.btn:hover {
  transform: scale(1.05);
}

.favoritar {
  background: #ffcc00;
  color: #222;
}

.editar {
  background: #ffffff;
  color: white;
}

.deletar {
  background: #ffffff;
  color: white;
}


.boxlist::-webkit-scrollbar {
  width: 6px;
}

.boxlist::-webkit-scrollbar-thumb {
  background-color: #2b2401;
  border-radius: 10px;
}

.estrela {
  width: 16px;
  height: 16px;
  object-fit: contain;
}
</style>
