document.addEventListener("DOMContentLoaded", () => {
  const bucket = document.getElementById("ProductBucket");
  const productInput = document.getElementById("product");
  const priceInput = document.getElementById("price");
  const productlist = document.getElementById("productlist");
  const totalCartValueElement = document.getElementById("totalCartValue");

  let totalCartAmount = 0;

  async function renderList() {
    productlist.innerHTML = "";
    const apiUrl =
      "https://crudcrud.com/api/3e43fe0298b9413bbc152ce82f11dd5a/productlist";

    try {
      const response = await axios.get(apiUrl);
      const lists = response.data;
      for (const list of lists) {
        renderLists(list);
      }
      updateTotalCartValue();
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
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
    deleteButton.addEventListener("click", async () => {
      await deleteList(list._id, item);
    });

    totalCartAmount += parseFloat(list.price);
  }

  async function addListToServer(list) {
    const apiUrl =
      "https://crudcrud.com/api/3e43fe0298b9413bbc152ce82f11dd5a/productlist";

    try {
      const response = await axios.post(apiUrl, list);
      renderLists(response.data);
      updateTotalCartValue();
    } catch (error) {
      console.error("Error adding list:", error);
    }
  }

  async function deleteList(list_Id, element) {
    const apiUrl = `https://crudcrud.com/api/3e43fe0298b9413bbc152ce82f11dd5a/productlist/${list_Id}`;

    try {
      await axios.delete(apiUrl);
      if (element) {
        productlist.removeChild(element);
        const deletedProductPrice = parseFloat(
          element.querySelector("p:nth-child(2)").textContent.split(":")[1]
        );
        totalCartAmount -= deletedProductPrice;
        updateTotalCartValue();
      }
    } catch (error) {
      console.error("Error deleting list", error);
    }
  }

  function updateTotalCartValue() {
    totalCartValueElement.textContent = `Total Cart Value: Rs${totalCartAmount.toFixed(
      2
    )}`;
  }

  bucket.addEventListener("submit", async (e) => {
    e.preventDefault();
    const product = productInput.value;
    const price = priceInput.value;

    if (product === "" || price === "") {
      alert("Please fill in all required fields.");
      return;
    }
    await addListToServer({ product, price });
    productInput.value = "";
    priceInput.value = "";
  });

  renderList();
});
