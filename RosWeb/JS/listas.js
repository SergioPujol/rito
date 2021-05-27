login().then((a)=>{console.log(a);renderLists()});

const renderLists = async()=>{
        const listsService = feathersClient.service('lists')
        let userShoppingLists = await listsService.find();
        let listsList = document.querySelector('#list-list');
        listsList.innerHTML = '';
        userShoppingLists.data.forEach(async element => {
            let id = (element._id)
            let price = 0;
            
            
            await Promise.all(element.products.map(async (i) => {
                await fetch(`http://${SERVER_IP}:${SERVER_PORT}/products/${i.product}`)
                .then(response => response.json())
                .then(data => {price += data.price;}
                )
            }));

            let listaHTML = `
            <li class="label white" data-toggle="${element.title}">
                <div class="d-flex product">
                    <h3>${element.title}</h3>
                    <i class="fa fa-trash" id='dlt-${id}' onclick=deleteList('${id.toString()}')></i>
                </div>
                <div class="d-flex">
                    <h4>${element.products.length} productos</h4>
                    <h3>${price}€</h3>
                </div>
            </li>
            `
            listsList.innerHTML += listaHTML;
            /*document.querySelector(`#dlt-${id}`).addEventListener('click', e =>{
                deleteList(e.target.id.slice(4))
            })*/
            
        });
}


async function deleteList(id){
    console.log(id)
    listsService.remove(id);
    

    
    /*listsService.update(id,{ 
    "title":(new Date).toString(),
    "owner": "60ad021c87666e57dc90e33e",
    "products":[{"product":"60ad0d5eb3a8712518e49943", "quantity": 2, "added_by":"60ad021c87666e57dc90c50e", "in_cart":false},
                {"product":"60ad0d8ba295a6594819028e", "quantity": 2, "added_by":"60ad07c3c300563fa01c7813", "in_cart":false},
                {"product":"60ad0d8ba295a6594819028e", "quantity": 2, "added_by":"60ad07c3c300563fa01c7813", "in_cart":false}],
    "members":[ {"user_id":"60ad007e87666e57dc90c50d"}, 
                {"user_id":"60ad07c3c300563fa01c7813"}]
    },{})*/
}

const listsService = feathersClient.service('lists')

listsService.on('created',(x)=>{console.log("created"+x);let listsList = document.querySelector('#list-list');
listsList.innerHTML = '';renderLists()})
listsService.on('updated',(x)=>{console.log("updated"+x);let listsList = document.querySelector('#list-list');
listsList.innerHTML = '';renderLists()})
listsService.on('removed',(x)=>{console.log("removed"+x);let listsList = document.querySelector('#list-list');
listsList.innerHTML = '';renderLists()})

/*listsService.create({"title":(new Date).toString(),
    "owner": "60ad021c87666e57dc90e33e",
    "products":[{"product":"60ad0d5eb3a8712518e49943", "quantity": 2, "added_by":"60ad021c87666e57dc90c50e", "in_cart":false},
                {"product":"60ad0d8ba295a6594819028e", "quantity": 2, "added_by":"60ad07c3c300563fa01c7813", "in_cart":false}],
    "members":[ {"user_id":"60ad007e87666e57dc90c50d"}, 
                {"user_id":"60ad07c3c300563fa01c7813"}]
    })
    */