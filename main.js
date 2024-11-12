const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

const instance = axios.create({
  baseURL: "http://localhost:3000/products",
  headers: { "Content-Type": "application/json" },
});

let editingProductId = null;

const fetchProducts = async () => {
  try {
    const { data } = await instance.get("/");

    await data.forEach((item) => {
      const productItem = document.createElement("tr");
      productItem.innerHTML =  `
          <td>${item.id}</td>
          <td>      
            <button class="product-name" onclick="showDetail(${item.id})">${item.name}</button>
          </td>
          <td>${item.price}</td>
          <td>     
            <button class="btn btn-warning" onclick="editProduct(${item.id})">Edit</button>
            <button class="btn btn-danger" onclick="deleteProduct(${item.id})">Delete</button>
          </td>     
      `;
      productList.appendChild(productItem);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const showDetail = async (id) => {
  console.log(`Hien thi chi tiet: ${id} `);
  const productDetailElement = document.getElementById("productDetail");

  try {
    const response = await instance.get(`/${id}`);
    const productDetails = response.data;
    productDetailElement.innerHTML = `
        <h2>${productDetails.name}</h2>
        <p>Price: ${productDetails.price}</p>
        <p>Description: ${productDetails.desc}</p>
        <!-- Add more details as needed -->
      `;
  } catch (error) {
    console.error("Error fetching product details:", error);
    productDetailElement.innerHTML = "Error fetching product details";
  }
};
const validateForm = ({ name, price, desc }) => {
  if (!name || !price || !desc) {
    alert("All fields are required.");
    return false;
  }
  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    alert("Price must be a valid number greater than 0.");
    return false;
  }
  return true;
};

const performAction = async (apiEndpoint, method, data) => {
  try {
    const response = await instance[method](apiEndpoint, data);
    console.log("Action performed successfully");
    fetchProducts();
    productForm.reset();
    editingProductId = null;
  } catch (error) {
    console.error("Error performing action:", error);
    alert("An error occurred while performing the action.");
  }
};

const addProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData(productForm);
    const data = Object.fromEntries(formData.entries());
    if (validateForm(data)) {
        const apiEndpoint = editingProductId ? `/${editingProductId}` : "";
        const method = editingProductId ? "patch" : "post";
        await performAction(apiEndpoint, method, data);
    }
};

const editProduct = async (id) =>{
    console.log(`Edit: ${id}`);
    editingProductId = id;
    try{
        const {data} = await instance.get(`/${editingProductId}`);
        Object.keys(data).forEach((key) => {
            const inputElement = productForm.querySelector(`[name="${key}"]`);
            if (inputElement) {
                inputElement.value = data[key];
            }
        });
    }catch (error) {
       console.error("Error fetching product data for editing:",error);
        alert("An error occurred while fetching product data for editing.");
    }
};

const resetForm = () => {
    productForm.reset();
    editingProductId = null;
};
 const deleteProduct = async (id) => {
    console.log(`Delete: ${id}`);
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa không?");
    if (confirmDelete) {
        try {
            await instance.delete(`/${id}`);
            console.log("Product deleted successfully");
            fetchProducts();

        }catch (error){
            console.error("Error deleting product:", error);
            alert("An error occurred while deleting the product.");
        }
    }
}