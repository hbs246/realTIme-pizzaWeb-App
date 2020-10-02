import axios from 'axios';
import Noty from 'noty';
import moment from 'moment';
let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.getElementById('cartCounter');

addToCart.forEach((btn) => {

    btn.addEventListener('click', (e) => {

        
         // let admin = btn.dataset;
          if(btn.dataset.pizza){
            let pizza = JSON.parse(btn.dataset.pizza);
            updateCart(pizza);
          }
    });
});

function updateCart(pizza) {

    // Post request send  
    axios.post('/update-cart', pizza).then(res => {
        cartCounter.innerText = res.data.totalQty;

        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item added to cart',
            progressBar: false
        }).show();

    }).catch(err => {
        throw err;
    });
}

const alertMSG = document.querySelector('#success-alert');

if (alertMSG) {

    setTimeout(() => {

        alertMSG.remove();
    }, 3000);
}

const  statuses = document.querySelectorAll('.status_line');
// console.log(statuses);

const orderInput = document.getElementById('orderInput');
let order
if(orderInput){
    order = JSON.parse(orderInput.value);
}
else
    order = null;


export function admin(socket){

    const orderTableBody = document.querySelector('#orderTableBody');
    let orders = [];
    let markup;
    
    axios.get('/admin/orders',{

        headers :{ "X-Requested-With":"XMLHttpRequest" }
    }).then(res =>{

        orders = res.data;
        
        if(orders.length != 0){
           markup = generateMarkup(orders)
           orderTableBody.innerHTML = markup
        }
        else{
            orderTableBody.innerHTML = `<h1 class="my-8 text-red-500 font-bold text-xl ">No Order Found !</h1>`
        }
    }).catch(err => {
        console.log(err);
        
    });

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p>${ menuItem.item.name } - ${ menuItem.qty } pcs </p>
            `
        }).join('')
      }

    function generateMarkup(orders)
	{
        return orders.map(order => {
            return `
              <tr>
                <td class="px-4 py-2">
                    <p class="text-green-500 font-bold hover:text-red-500">${ order._id }</p>
                    <div>${ renderItems(order.itmes) }</div>    
                </td>
                <td class="px-4 py-2">${ order.customerId.name }</td>
                <td class="px-4 py-2 text-red-900">${ order.address }</td>
                <td class="px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${ order._id }">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed"
                                    ${ order.status === 'order_placed' ? 'selected' : '' }>
                                    Placed</option>
                                <option value="confirmed" ${ order.status === 'confirmed' ? 'selected' : '' }>
                                    Confirmed</option>
                                <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                                    Prepared</option>
                                <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                                    Delivered
                                </option>
                                <option value="completed" ${ order.status === 'completed' ? 'selected' : '' }>
                                    Completed
                                </option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-2">
                    ${order.phone}
                </td>
                <td class="px-4 py-2">
                    ${ moment(order.createdAt).format('hh:mm A') }
                </td>
            </tr>
        `
        }).join('')
        
    }
    socket.on('orderAPlaced',(order) => {

        orders.unshift(order);
        orderTableBody.innerHTML = '';
        orderTableBody.innerHTML = generateMarkup(orders);
        console.log(order);
        
    });
}

       
let time = document.createElement('small');
function updateStatus(order){

       
    statuses.forEach((status)=>{

        status.classList.remove('step-completed');
        status.classList.remove('current-status');
    });
    
    let stepCompleted = true;    
    statuses.forEach((status)=>{
        
        let dataStatus = status.dataset.status;

        if(stepCompleted){
            status.classList.add('step-completed');
        }
        if(dataStatus === order.status){
            stepCompleted = false;  
            time.innerText = moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time);
            console.log(status);
            
       //     removeTime(status);
            if(status.nextElementSibling){
                
                status.nextElementSibling.classList.add('current-status');
            }
        }
    });
}


updateStatus(order);


// Client side Socket connection

const socket = io();
admin(socket);
// Join 

if(order){  
    socket.emit('join',`order_${order._id}`);
}

// For Admin 
const adminAreaPath = window.location.pathname;

if(adminAreaPath.includes('admin')){

    socket.emit('join','adminRoom');
}

socket.on('updateOrder',(data) => {

    const updateOrder = { ...order };
    updateOrder.updatedAt = moment().format();
    updateOrder.status = data.status;
    updateStatus(updateOrder);
  //  console.log(updateOrder);
    
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order Updated Successfully',
        progressBar: false
    }).show();

});