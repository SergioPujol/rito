/*String --> search 

Función que recibe el valor del input y muestra los productos que coincidan con ese valor*/
function search(inputValue){
    
    //Lista booleana donde cada true es un producto
    var elementsDetected = new Array(document.querySelectorAll('[data-toggle]').length).fill(true)

    var listPosition= 0

    //Para cada elemento ponemos a false el producto si no coincide el valor del input con su titulo
    document.querySelectorAll('[data-toggle]').forEach(element => {

        word= element.getAttribute("data-toggle").toLowerCase()
        for(var i=0; i< inputValue.toLowerCase().length; i++){

            if(word[i] != inputValue.toLowerCase()[i]) elementsDetected[listPosition]= false
        }
        listPosition++
    });

    //Mostramos aquellos productos que estén a true y escondemos aquellos que estén a false
    for(var i=0; i< document.querySelectorAll('[data-toggle]').length; i++){
        
        if(elementsDetected[i]) document.querySelectorAll('[data-toggle]')[i].style.display= "block"
        else document.querySelectorAll('[data-toggle]')[i].setAttribute('style', 'display:none !important');
    }
}