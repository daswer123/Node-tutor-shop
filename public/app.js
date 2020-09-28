const toCurrency = (price) => {
    return new Intl.NumberFormat("en-EN",{
        currency : "USD",
        style : "currency"
    }).format(price)
}


document.querySelectorAll(".price").forEach(elem => {
    elem.textContent = toCurrency(elem.textContent)
})

const cart = document.querySelector("#cart")

if (cart){
    cart.addEventListener("click",(e)=>{
        if(e.target.classList.contains("js-remove")){
            const id = e.target.dataset.id;
            csrf = e.target.dataset.csrf

            fetch("/cart/remove/"+id,{
                method : "DELETE",
                headers : {
                    "X-XSRF-TOKEN" : csrf
                }
            })
            .then(res => res.json())
            .then(result =>{
               if(result.courses.length){
                   html = result.courses.map(course => {
                    return  `
                    <tr>
                         <td>${course.title}</td>
                         <td>${course.count}</td>
                         <td><button class="btn btn-primary js-remove"  data-csrf="${csrf}" data-id="${course.id}">Delete</button></td>
                    </tr>
                    `
                   }).join("")
                   cart.querySelector("tbody").innerHTML = html
                   cart.querySelector(".price").textContent = toCurrency(result.price)
                    
               } else{
                   cart.innerHTML = `<p>Корзина пуста</p>`
               }
            })    
        }
    })
}

const loginScreen = document.querySelector(".auth");

if(loginScreen){
    M.Tabs.init(document.querySelector(".tabs"))
}

