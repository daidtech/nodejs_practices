(function () {
  var apiUrl = '/api/products';
  var form = document.getElementById('product-form');
  var productIdInput = document.getElementById('product-id');
  var nameInput = document.getElementById('name');
  var priceInput = document.getElementById('price');
  var categoryInput = document.getElementById('category');
  var descriptionInput = document.getElementById('description');
  var inStockInput = document.getElementById('inStock');
  var resetButton = document.getElementById('reset-form');
  var refreshButton = document.getElementById('refresh-products');
  var statusMessage = document.getElementById('status-message');
  var productList = document.getElementById('products-list');
  var emptyState = document.getElementById('products-empty');

  function showMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'mt-4 rounded-lg px-4 py-3 text-sm font-medium';

    if (type === 'error') {
      statusMessage.classList.add('bg-red-100', 'text-red-700');
    } else {
      statusMessage.classList.add('bg-emerald-100', 'text-emerald-700');
    }
  }

  function clearMessage() {
    statusMessage.textContent = '';
    statusMessage.className = 'mt-4 hidden rounded-lg px-4 py-3 text-sm font-medium';
  }

  function resetForm() {
    productIdInput.value = '';
    form.reset();
    inStockInput.checked = true;
    clearMessage();
  }

  function fillForm(product) {
    productIdInput.value = product._id;
    nameInput.value = product.name || '';
    priceInput.value = product.price || '';
    categoryInput.value = product.category || '';
    descriptionInput.value = product.description || '';
    inStockInput.checked = Boolean(product.inStock);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleResponse(response) {
    var data = await response.json().catch(function () {
      return { message: 'Unexpected server response' };
    });

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  function renderProducts(products) {
    productList.innerHTML = '';

    if (!products.length) {
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    products.forEach(function (product) {
      var card = document.createElement('article');
      card.className = 'rounded-xl border border-slate-200 bg-slate-50 p-4';

      var title = document.createElement('h3');
      title.className = 'text-base font-semibold text-slate-900';
      title.textContent = product.name + ' — $' + Number(product.price).toFixed(2);

      var meta = document.createElement('p');
      meta.className = 'mt-1 text-sm text-slate-600';
      meta.textContent = 'Category: ' + (product.category || 'general') + ' • ' + (product.inStock ? 'In stock' : 'Out of stock');

      var description = document.createElement('p');
      description.className = 'mt-2 text-sm text-slate-500';
      description.textContent = product.description || 'No description provided.';

      var actions = document.createElement('div');
      actions.className = 'mt-4 flex gap-2';

      var editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-600';
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', function () {
        fillForm(product);
      });

      var deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', async function () {
        var confirmed = window.confirm('Delete ' + product.name + '?');
        if (!confirmed) {
          return;
        }

        try {
          var response = await fetch(apiUrl + '/' + product._id, { method: 'DELETE' });
          var result = await handleResponse(response);
          showMessage(result.message || 'Product deleted successfully');
          resetForm();
          loadProducts();
        } catch (error) {
          showMessage(error.message, 'error');
        }
      });

      actions.appendChild(editButton);
      actions.appendChild(deleteButton);

      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(description);
      card.appendChild(actions);
      productList.appendChild(card);
    });
  }

  async function loadProducts() {
    productList.innerHTML = '<p class="text-sm text-slate-500">Loading products...</p>';

    try {
      var response = await fetch(apiUrl);
      var products = await handleResponse(response);
      renderProducts(products);
    } catch (error) {
      productList.innerHTML = '<p class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">' + error.message + '</p>';
      emptyState.classList.add('hidden');
    }
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearMessage();

    var payload = {
      name: nameInput.value.trim(),
      price: Number(priceInput.value),
      category: categoryInput.value.trim() || 'general',
      description: descriptionInput.value.trim(),
      inStock: inStockInput.checked
    };

    var isEditing = Boolean(productIdInput.value);
    var url = isEditing ? apiUrl + '/' + productIdInput.value : apiUrl;
    var method = isEditing ? 'PUT' : 'POST';

    try {
      var response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      await handleResponse(response);
      showMessage(isEditing ? 'Product updated successfully' : 'Product created successfully');
      resetForm();
      loadProducts();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  });

  resetButton.addEventListener('click', resetForm);
  refreshButton.addEventListener('click', loadProducts);

  loadProducts();
})();
