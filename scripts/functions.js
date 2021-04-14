const getSaveProducts = () => {
  const productsJSON = localStorage.getItem("products");
  try {
    return productsJSON !== null ? JSON.parse(productsJSON) : [];
  } catch (error) {
    return [];
  }
};

const saveProducts = (products) => {
  localStorage.setItem("products", JSON.stringify(products));
};

const removeProduct = (id) => {
  const productIndex = products.findIndex((item) => item.id === id);
  if (productIndex > -1) {
    products.splice(productIndex, 1);
  }
};

const toggleProduct = (id) => {
  const product = products.find((item) => item.id === id);
  if (product !== undefined) {
    product.exist = !product.exist;
  }
};

const sortProducts = (products, sortBy) => {
  if (sortBy === "byEdited") {
    return products.sort((a, b) => {
      if (a.updated > b.updated) {
        return -1;
      } else if (a.updated < b.updated) {
        return 1;
      } else {
        return 0;
      }
    });
  } else if (sortBy === "byCreated") {
    return products.sort((a, b) => {
      if (a.created > b.created) {
        return -1;
      } else if (a.created < b.created) {
        return 1;
      } else {
        return 0;
      }
    });
  } else {
    return products;
  }
};

const renderProducts = (products, filters) => {
  products = sortProducts(products, filters.sortBy);
  let filteredProducts = products.filter((item) => {
    return item.title.toLowerCase().includes(filters.searchItem.toLowerCase());
  });
  filteredProducts = filteredProducts.filter((item) => {
    if (filters.availableProducts) {
      return item.exist;
    } else {
      return true;
    }
  });
  document.querySelector("#products").innerHTML = "";
  filteredProducts.forEach((item) => {
    document.querySelector("#products").appendChild(createProductDOM(item));
  });
};

const createProductDOM = (product) => {
  const productEl = document.createElement("div");
  const checkbox = document.createElement("input");
  const productItem = document.createElement("a");
  const removeButton = document.createElement("button");
  const productPrice = document.createElement("p");

  productEl.style.margin = "15px";

  checkbox.setAttribute("type", "checkbox");
  checkbox.checked = !product.exist;
  productEl.appendChild(checkbox);
  checkbox.addEventListener("change", () => {
    toggleProduct(product.id);
    saveProducts(products);
    renderProducts(products, filters);
  });

  productItem.textContent = product.title;
  productItem.setAttribute("href", `edit-product.html#${product.id}`);
  productItem.style.margin = "0 8px";
  productItem.style.textDecoration = "none";
  productEl.appendChild(productItem);

  productPrice.textContent = product.price;
  productPrice.style.display = "inline-block";
  productPrice.style.margin = "0 30px 0 0";
  productEl.appendChild(productPrice);

  removeButton.textContent = "Remove";
  removeButton.style.padding = "5px 25px";
  removeButton.style.cursor = "pointer";
  removeButton.style.background = "#e55039";
  removeButton.style.color = "#ffffff";
  removeButton.style.border = "none";
  removeButton.style.borderRadius = "5px";
  productEl.appendChild(removeButton);
  removeButton.addEventListener("click", () => {
    removeProduct(product.id);
    saveProducts(products);
    renderProducts(products, filters);
  });

  return productEl;
};

const lastEditMessage = (timestamp) => {
  return `Last Edit : ${moment(timestamp).fromNow()}`;
};

// Persian Time :
// const lastEditMessage = (timestamp) => {
//   return `آخرین ویرایش : ${moment(timestamp).locale("fa").fromNow()}`;
// };
