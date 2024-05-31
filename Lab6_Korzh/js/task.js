document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('tbody');
    const urlInput = document.getElementById('url-input');
    const messageContainer = document.getElementById('message-container');
    const loadButton = document.querySelector('.load-btn');
    const clearButton = document.querySelector('.clear-btn');
    const displayOptions = document.getElementById('display-options');
    const tableContainer = document.getElementById('table-container');
    const recordCount = document.getElementById('record-count');
    const displayYesBtn = document.getElementById('display-yes-btn');
    const displayNoBtn = document.getElementById('display-no-btn');
    const clearSortingBtn = document.getElementById('clear-sorting-btn');
    let jsonData = [];
    loadButton.addEventListener('click', function() {
        messageContainer.innerHTML = '';
        const url = urlInput.value || 'https://jsonplaceholder.typicode.com/users'; 
        loadButton.disabled = true;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                jsonData = data;
                recordCount.textContent = data.length;
                displayOptions.style.display = 'block';
                clearButton.disabled = false;
            })
            .catch(error => {
                messageContainer.innerHTML = `<div style="color: red; font-weight: bold;">${error.message}</div>`;
                loadButton.disabled = false;
            });
    });
    clearButton.addEventListener('click', function() {
        urlInput.value = ''; 
        messageContainer.innerHTML = '';
    });
    displayYesBtn.addEventListener('click', function() {
        displayTable(jsonData);
    });
    displayNoBtn.addEventListener('click', function() {
        clearUI();
    });
    clearSortingBtn.addEventListener('click', function() {
        const originalData = [jsonData];
        const currentActiveColumn = document.querySelector('.th.active'); 
        if (currentActiveColumn) {
            currentActiveColumn.classList.remove('active'); 
        }
        displayTable(originalData); 
    });
    function displayTable(data, sortedKey = '') {
        tableBody.innerHTML = '';
        data.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.address.city}</td>
                <td>${user.address.zipcode}</td>
                <td>${user.phone}</td>
            `;
            tableBody.appendChild(row);
        });
        document.querySelectorAll('th').forEach(th => {
            if (th.textContent.trim().toLowerCase() === sortedKey) {
                th.classList.add('active');
            } else {
                th.classList.remove('active');
            }
        });
        tableContainer.style.display = 'block';
    }
    function sortData(data, key, th) {
        const isAscending = th.classList.toggle('ascending');
        return data.slice().sort((a, b) => {
            let valA = a[key];
            let valB = b[key];
            if (key === 'city' || key === 'name') {
                valA = a[key];
                valB = b[key];
            } else {
                valA = parseFloat(a.address[key]) || a[key];
                valB = parseFloat(b.address[key]) || b[key];
            }
            if (valA < valB) return isAscending ? -1 : 1;
            if (valA > valB) return isAscending ? 1 : -1;
            return 0;
        });
    }
    function clearUI() {
        tableBody.innerHTML = '';
        messageContainer.innerHTML = '';
        urlInput.value = '';
        displayOptions.style.display = 'none';
        tableContainer.style.display = 'none';
        loadButton.disabled = false;
        clearButton.disabled = true;
    }
});