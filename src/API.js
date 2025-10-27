const API = "http://localhost:3000/lista";

export async function getList() {
    const response = await fetch(API);
    return await response.json();
}

export async function postList(data) {
    const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const novoItem = await response.json();
    console.log("Item adicionado:", novoItem);
    return novoItem;
}

export async function putList(item) {
    const response = await fetch(`${API}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
    });
    const itemAtualizado = await response.json();
    console.log("Item atualizado:", itemAtualizado);
    return itemAtualizado;
}

export async function deleteList(item) {
    await fetch(`${API}/${item.id}`, {
        method: "DELETE"
    })
    .then(() => console.log(`Item ${item.id} deletado do servidor.`))
    .catch(err => console.error("Erro ao deletar item:", err));
}
