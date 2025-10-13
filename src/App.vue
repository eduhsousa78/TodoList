<script setup>
import { ref, onMounted, watch } from "vue";

const tlt = ref("");
const descricao = ref("")
const todo = ref([]);
const estrelaTrue = "/estrelaTrue.png";
const estrelaFalse = "/estrelaFalse.png";

function adicionarItemToDo() {
  if (tlt.value.trim().length > 0) {
    todo.value.push({
      titulo: tlt.value.trim(),
      descricao: descricao.value.trim(),
      completo: false,
      editando: false,
      imagemAtual: estrelaFalse
    });
    tlt.value = "";
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
    <div class="corpo1">
      <div class="logo">
        <img src="/logo/logo.png" style="width: 400px; height: 250%; object-fit: contain; display: center;">
      </div>
      <div class="boxaddtitulo">
        <input class="tituloadd" v-model="tlt" @keyup.enter="adicionarItemToDo"
          placeholder="Digite o titulo da sua tarefa..." />
      </div>
      <div class="boxadddescricao">
        <textarea class="descricaoadd" v-model="descricao" placeholder="Descrição"
          @keyup.enter="adicionarItemToDo"></textarea>
      </div>
      <div class="add">
        <button class="botaoadd" @click="adicionarItemToDo">
          + Adicionar tarefa
        </button>
      </div>
    </div>
    <div class="corpo2">
      <div class="tituloTarefa">
        <h1>TAREFAS</h1>
      </div>
      <div class="boxlist">
        <ul>

          <li v-for="(item, index) in todo" :key="index" class="inputlist">
            <div class="list">

              <span class="favorito-check">
                <button @click="favoritar(index)" class="botao-imagem">
                  <img :src="item.imagemAtual" alt="estrela"
                    style="width: 25px; height: 25px; object-fit: contain; display: block;" />
                </button>
                <input class="check" type="checkbox" v-model="item.completo" @change="salvarLocalStorage()" />
                <template v-if="item.editando"> <input class="inputedit" v-model="item.titulo"
                    @keyup.enter="salvarEdicao(index)" @blur="salvarEdicao(index)" autofocus /> </template>
                <template v-else>
                  <div class="conteudo-tarefa">
                    <span class="titulo-tarefa" :style="{ textDecoration: item.completo ? 'line-through' : 'none' }"> {{
                      item.titulo }}
                    </span>

                  </div>

                </template>
              </span>
              <span class="botoes">
                <button class="btn editar" @click="editarItemToDo(index)"><img src="/edit.svg"
                    style="width: 35px; height: 35px; object-fit: contain; display: block;"></button>
                <button class="btn deletar" @click="deleteItemToDo(index)"><img src="/delete.svg"
                    style="width: 35px; height: 35px; object-fit: contain; display: block;"></button>
              </span>
            </div>
            <div class="decricaobox">
              <p class="descricao-tarefa" v-if="item.descricao">{{ item.descricao }}</p>
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
  background: linear-gradient(360deg, rgba(0, 0, 0, 1) 0%, rgba(245, 198, 27, 1) 50%, rgba(245, 198, 27, 1) 100%);
  width: 100vw;
  height: 100vh;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 400px;
  margin-left: ;
}


.fundo {
  background-color: #ffffff;
  height: 900px;
  width: 1500px;
  font-family: "Poppins", sans-serif;
  color: #fff;
  font-size: 20px;
  justify-content: flex-end;
  display: flex;
  border-radius: 15px;
}

.corpo1 {
  width: 600px;
  justify-content: center;
  padding: 10px;
  align-items: flex-end;
}

.logo {
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
  padding: 50px;
}

.boxaddtitulo {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  font-family: 'Montserrat'
}

.boxadddescricao {
  resize: none;
  width: 300px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  text-align: left;
  text-justify: top;
  font-size: 16px;
  width: 100%;
  height: 300px;
  padding: 1px;
  border-radius: 8px;
  border: none;
  background: #d5d4d4;
  color: #000000;
  font-size: 20px;
}

.tituloadd {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: none;
  outline: none;
  background: #d8d8d8;
  color: #000000;
  font-size: 20px;

}

.descricaoadd {
  resize: none;
  width: 300px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  text-align: left;
  text-justify: top;
  font-size: 16px;
  width: 100%;
  height: 300px;
  padding: 1px;
  border-radius: 8px;
  border: none;
  background: #d5d4d4;
  color: #000000;
  font-size: 20px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.add {
  justify-content: flex-start;
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 25px;

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

.conteudo-tarefa {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.titulo-tarefa {
  font-weight: bold;
  font-size: 18px;
}

.descricao-tarefa {
  font-size: 15px;
  color: #555;
  margin: 0;
  margin-left: 10px;
  font-style: italic;
}

.corpo2 {
  background: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  justify-content: flex-start;
  width: 900px;
  height: 900px;
  margin-top: auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  opacity: 0.95;

}

.list {
  display: flex;
  justify-content: space-between;

  width: 700px;
}

.tituloTarefa {
  color: black;
  justify-content: center;
  align-items: center;

}

.decricaobox {
  background-color: #dfdfdc;
  width: 700px;
}

.favorito-check {
  display: flex;
  align-items: center;
}

.boxlist {
  max-height: 750px;
  overflow-y: auto;
}

.descricaobox {
  padding: 5px;


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

  align-items: center;
  justify-content: space-between;
  background: #fcfcfc;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  margin-bottom: 0.6rem;
  border: 5px;
}

.botao-imagem {
  background: none;
  border: none;
  padding: 0;
  margin: 0 5px;
  cursor: pointer;
}

.inputlist:hover {

  background: rgb(235, 234, 234)0;
}

.titulo-tarefa {
  font-size: 20px;
  color: black;
  flex: 1;
  margin-left: 10px;
  font-weight: bold;
  transition: color 0.2s ease;
}

.descricao-tarefa {
  font-size: 14px;
  color: #888;
  margin: 0;
  text-align: left;
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
</style>
