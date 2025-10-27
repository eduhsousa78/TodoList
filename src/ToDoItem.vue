<template>
    <li class="list-group-item" style="font-size: 15px; background: none;">
        <div class="accordion mt-3" :id="'accordion-' + item.id">
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <div class="hstack gap-3 align-items-center">

                        <div class="p-2">
                            <button @click="toggleFavorito" class="botao-imagem btn p-0" style="border: none;">
                                <img :src="item.imagemAtual" alt="estrela"
                                    style="width: 15px; height: 15px; object-fit: contain; display: block;" />
                            </button>
                        </div>

                        <div class="p-2">
                            <input class="form-check-input check" type="checkbox" v-model="item.completo"
                                @change="toggleCompleto" />
                        </div>

                        <div class="p-2 flex-grow-1">
                            <template v-if="editando">
                                <div class="edit-box">
                                    <div class="input-group">
                                        <input type="text" class="form-control" v-model="tituloEditado"
                                            placeholder="Editar título..." @keyup.enter="salvarEdicao"
                                            @blur="salvarEdicaoNoBlur">
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div>
                                    <span class="fw-bold" style="font-size: 20px;"
                                        :style="{ textDecoration: item.completo ? 'line-through' : 'none', color: item.completo ? '#888' : 'inherit' }">
                                        {{ item.titulo }}
                                    </span>
                                </div>
                            </template>
                        </div>

                        <div class="p-2 ms-auto d-flex align-items-center">
                            <span class="botoes me-2">
                                <button class="btn editar p-1" @click="iniciarEdicao">
                                    <img src="/edit.svg"
                                        style="width: 20px; height: 20px; object-fit: contain; display: block;">
                                </button>
                                <button class="btn deletar p-1" @click="$emit('delete', item)">
                                    <img src="/delete.svg"
                                        style="width: 20px; height: 20px; object-fit: contain; display: block;">
                                </button>
                            </span>
                        </div>

                        <div class="p-2">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                :data-bs-target="'#collapse-' + item.id" aria-expanded="false"
                                :aria-controls="'collapse-' + item.id"></button>
                        </div>
                    </div>
                </h2>

                <div :id="'collapse-' + item.id" class="accordion-collapse collapse"
                    :data-bs-parent="'#accordion-' + item.id">
                    <div class="accordion-body">
                        <template v-if="editando">
                            <div class="input-group">
                                <input type="text" class="form-control" v-model="descricaoEditada"
                                    placeholder="Editar descrição..." @keyup.enter="salvarEdicao" @blur="salvarEdicao">
                            </div>
                        </template>
                        <template v-else>
                            <p v-if="item.descricao">{{ item.descricao }}</p>
                            <p v-else class="text-muted fst-italic">Sem descrição.</p>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </li>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    }
});

const emit = defineEmits(['update', 'delete']);

const estrelaTrue = "/star-fill.svg";
const estrelaFalse = "/star.svg";

const editando = ref(false);
const tituloEditado = ref('');
const descricaoEditada = ref('');
let valorAntigoTitulo = '';
let valorAntigoDescricao = '';

const toggleFavorito = () => {
    props.item.favorito = !props.item.favorito;
    props.item.imagemAtual = props.item.favorito ? estrelaTrue : estrelaFalse;
    emit('update', props.item);
};

const toggleCompleto = () => {
    emit('update', props.item);
};

const iniciarEdicao = () => {
    editando.value = true;
    tituloEditado.value = props.item.titulo;
    descricaoEditada.value = props.item.descricao;
    valorAntigoTitulo = props.item.titulo;
    valorAntigoDescricao = props.item.descricao;
};

const salvarEdicaoNoBlur = (event) => {
    if (!event.relatedTarget || !event.relatedTarget.closest('.accordion-item')) {
        salvarEdicao();
    }
}

const salvarEdicao = () => {
    const novoTitulo = tituloEditado.value.trim();
    const novaDescricao = descricaoEditada.value.trim();

    if (novoTitulo.length === 0 && novaDescricao.length === 0) {
        cancelarEdicao();
        return;
    }

    if (novoTitulo !== valorAntigoTitulo || novaDescricao !== valorAntigoDescricao) {
        props.item.titulo = novoTitulo;
        props.item.descricao = novaDescricao;
        emit('update', props.item);
    }

    editando.value = false;
};

const cancelarEdicao = () => {
    props.item.titulo = valorAntigoTitulo;
    props.item.descricao = valorAntigoDescricao;
    editando.value = false;
};

watch(() => props.item.favorito, (novoFavorito) => {
    props.item.imagemAtual = novoFavorito ? estrelaTrue : estrelaFalse;
}, { immediate: true });
</script>

<style scoped>
.accordion-header .btn {
    box-shadow: none !important;
}

.accordion-body {
    background-color: #f8f9fa;
    border-top: 1px solid #dee2e6;
}
</style>