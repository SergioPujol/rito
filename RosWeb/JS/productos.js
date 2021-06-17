fetch(`http://${SERVER_IP}:${SERVER_PORT}/products`)
.then(response => response.json())
.then(data => data.data.forEach(element => {
        addProduct(element)
    })
);

const addProduct = product =>{
    let productHTML = `
    <li class="align-items-center product-list" data-toggle="${product.name}">
    <div class="row">
      <div class="col-4">
        <img src="${product.img_url}" alt="${product.name}">
      </div>
      <article class="col-8">
        <h3>${product.name}</h3>
        <div class="d-flex product-price">
          <h5>${product.weight}g</h5>
          <h3>${product.price}€</h3>
        </div>
        <button type="button" href="#" class="btn btn-outline-success">AÑADIR A LA LISTA DE LA COMPRA</button>
      </article>
    </div>
    <hr>
    </li>
    ` 
    let listaProductos = document.querySelector("#product-list");
    listaProductos.innerHTML += productHTML;
}