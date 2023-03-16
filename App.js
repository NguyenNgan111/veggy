function clickImageHandler(event) {
    const overlay = document.querySelector('.overlay')
    overlay.style.display = 'flex'
    const product = {
        image: event.target.getAttribute('src'),
        name: event.target.closest('.contain').querySelector('.content h2').textContent,
        price: event.target.closest('.contain').querySelector('.price').textContent
    }
    const htmls = `
    <div class="overlay-content">
        <button class="exist">x</button>
        <img src="${product.image}" alt="">
        <div class="overlay-discription">
            <h3 class="overlay-name">${product.name}</h3>
            <span class="overlay-price"><i class="fa-solid fa-indian-rupee-sign"></i>${product.price}</span>
        </div>
    </div>
`
    overlay.innerHTML = htmls
    const overlayContent = document.querySelector('.overlay-content')
    overlay.addEventListener('click', function(e) {
        overlay.style.display = 'none'
    })
    overlayContent.addEventListener('click', function(e) {
        e.stopPropagation()
    })
    document.querySelector('.exist').addEventListener('click', function(e) {
        overlay.style.display = 'none'
    })
}
const listCartProducts = []

function substractHandler(event) {
    event.preventDefault();
    const input = event.target.closest('.stepper').querySelector('.stepper--quantity')
    if (input.value > 1) {
        input.value -= 1
    }
}

function plusHandler(event) {
    event.preventDefault();
    const input = event.target.closest('.stepper').querySelector('.stepper--quantity')
    input.value = +input.value + 1
}

function addCartHandler(event) {
    event.target.classList.toggle('added')
    event.target.innerHTML = `<i class="fa-solid fa-check"></i> ADDED`
    setTimeout(() => {
        event.target.classList.toggle('added')
        event.target.innerHTML = `ADD TO CART`
    }, 3000);
    const quantity = event.target.closest('.content').querySelector('.stepper--quantity').value
    const coin = event.target.closest('.content').querySelector('.price').textContent
    document.querySelector('.coin').textContent = Number(document.querySelector('.coin').textContent) + quantity * coin
    document.querySelector('.quantity-product').textContent = Number(document.querySelector('.quantity-product').textContent) + Number(quantity)
    document.querySelector('.cart-icon img').classList.toggle('fadeInCart')
    setTimeout(() => {
        document.querySelector('.cart-icon img').classList.toggle('fadeInCart')
    }, 500);
    if (!listCartProducts.find(el => el.id == event.target.closest('.contain').dataset.id)) {
        listCartProducts.unshift({
            id: event.target.closest('.contain').dataset.id,
            image: event.target.closest('.contain').querySelector('img').getAttribute('src'),
            name: event.target.closest('.content').querySelector('h2').textContent,
            priceOneProduct: event.target.closest('.content').querySelector('.price').textContent,
            quantity: Number(event.target.closest('.content').querySelector('.stepper--quantity').value),
            price: Number(event.target.closest('.content').querySelector('.price').textContent) * event.target.closest('.content').querySelector('.stepper--quantity').value
        })
    } else {
        const index = listCartProducts.findIndex(el => el.id == event.target.closest('.contain').dataset.id)
        listCartProducts[index].quantity = Number(listCartProducts[index].quantity) + Number(event.target.closest('.content').querySelector('.stepper--quantity').value)
        listCartProducts[index].price = listCartProducts[index].priceOneProduct * listCartProducts[index].quantity
    }
}

function filterProductHandler(products) {
    const btn = document.querySelector('.search > form > button')
    btn.addEventListener('click', function(e) {
        e.preventDefault()
        const value = document.querySelector('.search > form > input').value
        const productFiltersList = products.filter(product => {
            return product.name.toLowerCase().indexOf(value.toLowerCase()) >= 0
        })
        renderProductFilterHandler(productFiltersList)
    })
    const inp = document.querySelector('.search > form > input')
    inp.onkeyup = function(e) {
        const value = e.target.value
        const productFiltersList = products.filter(product => {
            return product.name.toLowerCase().indexOf(value.toLowerCase()) >= 0
        })
        renderProductFilterHandler(productFiltersList)
    }
}

function renderListProductCart() {
    const htmls = listCartProducts.map(product => `
        <li class="have-cart__item">
            <div class="have-cart__item--img"><img src="${product.image}" alt=""></div>
            <div class="have-cart__item--description">
                <h4>${product.name}</h4>
                <span class="have-cart__item--priceOne"><i class="fa-solid fa-indian-rupee-sign"></i>${product.priceOneProduct}</span>
            </div>
            <div class="have-cart__item--quantity-price">
                <span class="have-cart__item--quantity">${product.quantity} <span class="have-cart__item--unit">.No</span> </span>
                <span class="have-cart__item--price"><i class="fa-solid fa-indian-rupee-sign"></i>${product.price}</span>
            </div>
            <button class="have-cart__item--close" data-id=${product.id} onclick="removeProductInCart(event)">x</button>
        </li>
    `)
    document.querySelector('.have-cart').innerHTML = htmls.join('')
}

function removeProductInCart(event) {
    const id = listCartProducts.findIndex((product) => product.id == event.target.dataset.id)
    event.target.closest('.have-cart__item').style.display = 'none'
    event.target.closest('.cart').querySelector('.quantity-product').textContent = Number(event.target.closest('.cart').querySelector('.quantity-product').textContent) - Number(listCartProducts[id].quantity)
    event.target.closest('.cart').querySelector('.coin').textContent = Number(event.target.closest('.cart').querySelector('.coin').textContent) - Number(listCartProducts[id].price)
    listCartProducts.splice(id, 1)
    if (listCartProducts.length == 0) {
        event.target.closest('.have-cart').style.display = 'none'
        event.target.closest('.empty-cart').style.display = 'flex'
    }
}
const btnCart = document.querySelector('.cart-icon')
btnCart.addEventListener('click', function(e) {
    const cart = e.target.closest('.cart-icon').querySelector('.cart__product--list')
    cart.style.display = 'block'
    if (e.target.closest('.cart').querySelector('.quantity-product').textContent == 0) {
        cart.querySelector('.empty-cart').style.display = 'flex'
        cart.querySelector('.buy-product').classList.add("empty-button")
    } else {
        cart.querySelector('.empty-cart').style.display = 'none'
        cart.querySelector('.buy-product').classList.remove("empty-button")
        cart.querySelector('.have-cart').style.display = 'block'
        renderListProductCart()
    }
    e.stopPropagation()
    document.addEventListener('click', function(event) {
        cart.style.display = 'none'
    })
})

function renderProductFilterHandler(products) {
    const htmls = products.map(function(product) {
        return `<li class="product__item col-3">
            <div class="contain" data-id=${product.id}>
                <div class="product-img" onclick="clickImageHandler(event)">
                    <img src="${product.image}" alt="">
                </div>
                <div class="content">
                    <h2>${product.name}</h2>
                    <span class="price"><i class="fa-solid fa-indian-rupee-sign"></i>${product.price}</span>
                    <div class="stepper"><a href="#" class="subtract" onclick="substractHandler(event)" ><i class="fa-solid fa-minus"></i></a><input type="number" class="stepper--quantity" value="1">
                        <a href="#" class="plus" onclick="plusHandler(event)"><i class="fa-solid fa-plus"></i></a>
                    </div>
                    <button type="button" class="add-cart" onclick="addCartHandler(event)">ADD TO CART</button>
                </div>
            </div>
        </li>`
    })
    document.querySelector('.product__list').innerHTML = htmls.join('')
}

function renderProducts(products) {
    const htmls = products.map(function(product) {
        return `<li class="product__item col-3">
            <div class="contain" data-id=${product.id}>
                <div class="product-img" onclick="clickImageHandler(event)">
                    <img src="${product.image}" alt="">
                </div>
                <div class="content">
                    <h2>${product.name}</h2>
                    <span class="price"><i class="fa-solid fa-indian-rupee-sign"></i>${product.price}</span>
                    <div class="stepper"><a href="#" class="subtract" onclick="substractHandler(event)" ><i class="fa-solid fa-minus"></i></a><input type="number" class="stepper--quantity" value="1">
                        <a href="#" class="plus" onclick="plusHandler(event)"><i class="fa-solid fa-plus"></i></a>
                    </div>
                    <button type="button" class="add-cart" onclick="addCartHandler(event)">ADD TO CART</button>
                </div>
            </div>
        </li>`
    })
    document.querySelector('.product__list').innerHTML = htmls.join('')
    filterProductHandler(products)
}
fetch('https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json')
    .then(response => response.json())
    .then(renderProducts)