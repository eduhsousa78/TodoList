<template>
    <div>
        <div class="container-fluid min-vh-100 d-flex flex-column border-0">
            <div class="row flex-grow-1">

                <div class="border col-3 sticky-top p-3 add border-0">
                    <div class="text-center mb-4 bs-body-bg">
                        <img src="/logo/logo.png" class="img-fluid mb-3" style="max-height: 100px;">
                        
                        <div class="input-group d-block">
                            <label class="form-label text-start d-block">Título de sua tarefa</label>
                            <div class="input-group m-1">
                                <input v-model="tlt" @keyup.enter="adicionarItemToDo" type="text" class="form-control"
                                    placeholder="Digite o titulo da sua tarefa..." aria-describedby="button-addon2">
                            </div>

                            <label class="form-label text-start d-block">Descrição de sua tarefa</label>
                            <div class="input-group m-1">
                                <input v-model="descricao" @keyup.enter="adicionarItemToDo" type="text"
                                    class="form-control" placeholder="Descrição da sua tarefa..."
                                    aria-describedby="button-addon2">
                            </div>

                            <div class="d-grid gap-2 col-8 mx-auto">
                                <button class="btn btn-outline-secondary m-3" type="button" id="button-addon2"
                                    @click="adicionarItemToDo" :disabled="!tlt.trim()">Adicionar tarefa</button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="filtroCompletos" id="checkCompletos">
                                    <label class="form-check-label" for="checkCompletos">
                                        Mostrar Completos
                                    </label>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="filtroFavoritos" id="checkFavoritos">
                                    <label class="form-check-label" for="checkFavoritos">
                                        Mostrar Favoritos
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="border col-9 p-3 list border-0">
                    <ul class="list-group">
                        <ToDoItem v-for="item in listaFiltrada" :key="item.id" :item="item"
                            @update="updateItemToDo" @delete="deleteItemToDo" />

                        <p v-if="todo.length === 0" class="text-center text-muted mt-5">
                            Não há tarefas cadastradas.
                        </p>
                        <p v-else-if="listaFiltrada.length === 0" class="text-center text-muted mt-5">
                            Nenhuma tarefa corresponde aos filtros selecionados.
                        </p>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { ref, onMounted, computed } from "vue";
import ToDoItem from './ToDoItem.vue';
import { getList, postList, putList, deleteList } from './API.js'

const todo = ref([]);
const tlt = ref("");
const descricao = ref("");
const estrelaTrue = "/star-fill.svg";
const estrelaFalse = "/star.svg";


const filtroCompletos = ref(false);
const filtroFavoritos = ref(false);




async function adicionarItemToDo() {
    if (tlt.value.trim().length > 0) {
        const item = {
            titulo: tlt.value.trim(),
            descricao: descricao.value.trim(),
            completo: false,
            favorito: false, 
            imagemAtual: estrelaFalse, 
        };

        const itemComId = await postList(item);
        itemComId.favorito = false;
        itemComId.imagemAtual = estrelaFalse;

        todo.value.push(itemComId);

        tlt.value = "";
        descricao.value = "";
    }
}


async function updateItemToDo(updatedItem) {
    try {
        const index = todo.value.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
            todo.value[index] = { ...todo.value[index], ...updatedItem };
            await putList(updatedItem);
            salvarLocalStorage();
        }
    } catch (error) {
        console.error("Erro ao atualizar item:", error);
    }
}


async function deleteItemToDo(itemToDelete) {
    try {
        await deleteList(itemToDelete);
        todo.value = todo.value.filter(item => item.id !== itemToDelete.id);
        salvarLocalStorage();
    } catch (error) {
        console.error("Erro ao deletar item:", error);
    }
}



const listaFiltrada = computed(() => {
    return todo.value.filter(item => {
        const isCompleto = item.completo;
        const isFavorito = item.favorito;

        
        if (!filtroCompletos.value && !filtroFavoritos.value) {
            return true;
        }
        let passaFiltroCompleto = true;
        if (filtroCompletos.value && !isCompleto) {
            passaFiltroCompleto = false;
        }
        
        let passaFiltroFavorito = true;
        if (filtroFavoritos.value && !isFavorito) {
            passaFiltroFavorito = false;
        }
        if (filtroCompletos.value && filtroFavoritos.value) {
            return isCompleto && isFavorito;
        } else if (filtroCompletos.value) {
            return isCompleto;
        } else if (filtroFavoritos.value) {
            return isFavorito;
        }
        
        return true; 
    }).sort((a, b) => {
      
        if (a.favorito !== b.favorito) {
            return b.favorito - a.favorito; 
        }
        if (a.completo !== b.completo) {
            return a.completo - b.completo;
        }
        return 0;
    });
});




function salvarLocalStorage() {
    localStorage.setItem("Lista To Do", JSON.stringify(todo.value))
}

async function carregarLista() {
   
    const listaJSON = localStorage.getItem("Lista To Do");
    if (listaJSON) {
        todo.value = JSON.parse(listaJSON);
        todo.value.forEach(item => {
            item.imagemAtual = item.favorito ? estrelaTrue : estrelaFalse;
            if (item.editando === undefined) item.editando = false;
        });
    }
    try {
        const listaAPI = await getList();
        const listaMapeada = listaAPI.map(item => ({
            ...item,
            favorito: item.favorito || false,
            imagemAtual: item.favorito ? estrelaTrue : estrelaFalse,
        }));
        todo.value = listaMapeada;
        salvarLocalStorage();

    } catch (error) {
        console.warn("Não foi possível conectar à API. Usando dados do LocalStorage.", error);
    }
}

onMounted(carregarLista);
</script>

<style scoped>
.border{
  border: none;
}
body{
  border: none;
}
.add{
  background: linear-gradient(181deg,rgba(13, 27, 31, 1) 0%, rgba(0, 0, 0, 1) 56%, rgba(97, 97, 97, 1) 100%);;
}
.list{
  background: linear-gradient(0deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(19, 145, 0, 1) 100%);
  border: none;
}
.bg-light {
    background-color: #f8f9fa !important;
}

.sticky-top {
    position: sticky;
    top: 0;
    align-self: flex-start;
    height: 100vh;
    overflow-y: auto;
}
.btn-outline-secondary:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
</style>