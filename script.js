// ЗАДАНИЕ 1

let db;
const dbRequest = indexedDB.open('DataBase', 1);

dbRequest.onupgradeneeded = function () {
    db = dbRequest.result;
    if (!db.objectStoreNames.contains('tableName')) {
        db.createObjectStore('tableName', { keyPath: 'key' });
    }
}

dbRequest.onsuccess = function (e) {
    db = e.target.result;
    console.log('дб работает')
    updateTable()
}

dbRequest.onerror = function (e) {
    console.log('Ошибка: ' + e.target.errorCode);
}


// ЗАДАНИЕ 2
function updateTable() {
    const tbody = document.querySelector("tbody");

    const transaction = db.transaction(['tableName'], 'readwrite');
    const objectStore = transaction.objectStore('tableName');

    const getAllRequest = objectStore.getAll();

    getAllRequest.onsuccess = function (e) {
        const values = e.target.result;

        tbody.innerHTML = "";
        for (let i = 0; i < values.length; i++) {

            let key = values[i].key;
            let value = values[i].value;

            const row = document.createElement("tr");
            const keyCell = document.createElement("td");
            const valueCell = document.createElement("td");
            const changeTD = document.createElement("td");
            const deleteTD = document.createElement("td");
            const spanChange = document.createElement("span");
            const spanDelete = document.createElement("span");

            keyCell.textContent = key;
            valueCell.textContent = value;
            spanChange.textContent = "Изменить";
            spanDelete.textContent = "Удалить";
            spanChange.style.color = "cyan";
            spanDelete.style.color = "red";
            spanChange.onclick = function () {
                updateItem(key)
            };

            spanDelete.onclick = function () {
                deleteItem(key)
            };

            row.appendChild(keyCell);
            row.appendChild(valueCell);
            changeTD.appendChild(spanChange);
            deleteTD.appendChild(spanDelete);
            row.appendChild(changeTD);
            row.appendChild(deleteTD);
            tbody.appendChild(row);
        }
    }
}


// ЗАДАНИЕ 3
function saveItem() {
    const keyInput = document.querySelector("#keyValue");
    const valueInput = document.querySelector("#textValue");

    const transaction = db.transaction(['tableName'], 'readwrite');
    const objectStore = transaction.objectStore('tableName');

    const request = objectStore.add({ key: keyInput.value, value: valueInput.value });

    request.onsuccess = () => {
        alert("Данные успешно добавлены в IndexedDB");
        updateTable();
    };

    request.onerror = () => {
        console.error("Ошибка при добавлении записи:", request.error);
    };

    transaction.oncomplete = function () {
        console.log('Работа по добавлению данных завершена')
    };
}


// ЗАДАНИЕ 4
function updateItem(key) {
    const transaction = db.transaction(['tableName'], 'readwrite');
    const objectStore = transaction.objectStore('tableName');

    const getRequest = objectStore.get(key);

    getRequest.onsuccess = (e) => {
        const data = e.target.result;
        const newValue = prompt("Введите новое значение:");

        if (newValue !== null && newValue !== "") {
            data.value = newValue;
            const updateRequest = objectStore.put(data);
            updateRequest.onsuccess = function () {
                alert('Данные успешно обновлены в IndexedDB');
                updateTable();
            };
            updateRequest.onerror = function () {
                console.log('Ошибка обновления данных в IndexedDB');
            };
        } else {
            console.log('Отменено обновление данных');
        }
    };

    getRequest.onerror = () => {
        console.error("Ошибка при изменении записи:", request.error);
    };

    transaction.oncomplete = function () {
        console.log('Работа по обновлению данных завершена');
    };
};


// задание 5
function deleteItem(key) {
    // Открытие транзакции для чтения и записи
    const transaction = db.transaction(['tableName'], 'readwrite');
    const objectStore = transaction.objectStore('tableName');

    const deleteRequest = objectStore.delete(key);

    deleteRequest.onsuccess = function () {
        alert('Запись успешно удалена из IndexedDB');
        updateTable();
    };
    deleteRequest.onerror = function () {
        console.log('Ошибка удаления данных из IndexedDB');
    };
    transaction.oncomplete = function () {
        console.log('Работа по удалению данных завершена');
    };
}
