document.addEventListener("DOMContentLoaded", () => {
  const bucket = document.getElementById("ProductBucket");
  const productInput = document.getElementById("product");
  const priceInput = document.getElementById("price");
  const productlist = document.getElementById("productlist");
  const totalCartValueElement = document.getElementById("totalCartValue");

  let totalCartAmount = 0;

  function renderList() {
    productlist.innerHTML = "";
    const apiUrl =
      "https://crudcrud.com/api/914122a9771c4fb5bef5d534c9b5c110/productlist";

    axios
      .get(apiUrl)
      .then((response) => {
        const lists = response.data;
        lists.forEach((list) => {
          renderLists(list);
        });
        updateTotalCartValue();
      })
      .catch((error) => {
        console.error("Error while fetching data:", error);
      });
  }

  function renderLists(list) {
    const item = document.createElement("div");
    item.innerHTML = `
      <p>Product: ${list.product}</p>
      <p>Price: ${list.price}</p>
      <button class="delete-button" data-id="${list._id}">Delete</button> 
    `;
    productlist.appendChild(item);

    const deleteButton = item.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
      deleteList(list._id, item);
    });

    totalCartAmount += parseFloat(list.price);
  }

  function addListToServer(list) {
    const apiUrl =
      "https://crudcrud.com/api/914122a9771c4fb5bef5d534c9b5c110/productlist";

    axios
      .post(apiUrl, list)
      .then((response) => {
        renderLists(response.data);
        updateTotalCartValue();
      })
      .catch((error) => {
        console.error("Error adding list:", error);
      });
  }

  function deleteList(list_Id, element) {
    const apiUrl = `https://crudcrud.com/api/914122a9771c4fb5bef5d534c9b5c110/productlist/${list_Id}`;

    axios
      .delete(apiUrl)
      .then(() => {
        if (element) {
          productlist.removeChild(element);
          const deletedProductPrice = parseFloat(element.querySelector("p:nth-child(2)").textContent.split(":")[1]);
          totalCartAmount -= deletedProductPrice;
          updateTotalCartValue();
        }
         
      })
      .catch((error) => {
        console.error("Error deleting list", error);
      });
  }

  function updateTotalCartValue() {
    totalCartValueElement.textContent = `Total Cart Value: Rs${totalCartAmount.toFixed(2)}`;
  }

  bucket.addEventListener("submit", (e) => {
    e.preventDefault();
    const product = productInput.value;
    const price = priceInput.value;

    if (product === "" || price === "") {
      alert("Please fill in all required fields.");
      return;
    }
    addListToServer({ product, price });
    productInput.value = "";
    priceInput.value = "";
  });

  renderList();
});

