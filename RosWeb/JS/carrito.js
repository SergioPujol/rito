const labelPrice = document.querySelector("#precio")
const labelProducts = document.querySelector("#productos")

fetch(`http://${SERVER_IP}:${SERVER_PORT}/cart`)
.then(response => response.json())
.then(data => data.data.forEach(element => {
    login().then((data)=> {if(element.user == data.user._id && !element.paid)cart(element);})})
);

const cart = async info => {
    let quantity= 0
    let price= 0
    await Promise.all(info.products.map(async (i) => {
        await fetch(`http://${SERVER_IP}:${SERVER_PORT}/products/${i.product}`)
        .then(response => response.json())
        .then(product => {price+= product.price * i.quantity; quantity+= i.quantity;addProduct(product, i.quantity)}
        )
    }));

    labelPrice.innerHTML= price + "€"
    labelProducts.innerHTML= quantity + " productos"
}

const addProduct = (product, quantity) =>{
    let productHTML = `
    <li class="d-flex align-items-center product-list"">
        <div class="col-4">
            <img src="${product.img_url}" alt="${product.name}">
        </div>
        <article class="col-8">
            <h4>${product.name}</h4>
            <h5>${product.weight}g</h5>
            <div class="d-flex product-price">
                <h5>${quantity} x</h5>
                <h3>${product.price}€</h3>
            </div>
        </article>
    </li>
    <hr>
    ` 
    let listaProductos = document.querySelector("#cart-list");
    listaProductos.innerHTML += productHTML;
}