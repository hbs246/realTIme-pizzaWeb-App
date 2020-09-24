import axios from 'axios';
import Noty from 'noty';
let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.getElementById('cartCounter');

addToCart.forEach((btn)=>{

    btn.addEventListener('click',(e)=>{
        
        let pizza = JSON.parse(btn.dataset.pizza);
        //console.log(pizza);

        updateCart(pizza);
    });
});

function updateCart(pizza){

    // Post request send  
    axios.post('/update-cart',pizza).then(res => {

        console.log(res);
        cartCounter.innerText = res.data.totalQty;

        new Noty({
            type : 'success',
            timeout : 1000,
            text : 'Item added to cart',
            progressBar:false
        }).show();

    }).catch(err=>{
        throw err;
    });
}

const userLogout = document.getElementById('login');
userLogout.addEventListener('click',(e)=>{

    new Noty({
                type : 'success',
                timeout : 1000,
                text : 'You logOut Successfully',
                progressBar:false
            }).show();
        
    
})
console.log(userLogout);

// function Message(){
//     new Noty({
//         type : 'success',
//         timeout : 1000,
//         text : 'You logOut Successfully',
//         progressBar:false
//     }).show();

// }
