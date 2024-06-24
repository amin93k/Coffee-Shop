const $ = document
const searchBox = $.querySelector(".search-box")
const navbar = $.querySelector(".navbar")
const iconBtn = $.querySelector(".icons")
const cartContainer = $.querySelector(".cart-container")
const cartList = $.querySelector(".cart-list")

// Handel click event on header icons search, shopping cart, hamburger menu
iconBtn.addEventListener("click", (eve) => {
    if (eve.target.dataset.icon === "search") {
        searchBox.classList.toggle ("active")
    }
    else if (eve.target.dataset.icon === "shopping-cart") {
        cartContainer.classList.toggle ("active")
    }
    else if (eve.target.dataset.icon === "menu") {
        navbar.classList.toggle ("active")
    }
})

// Add to shopping cart section
const buyBtn = $.querySelectorAll(".add-cart")
let buyItemList = {}

buyBtn.forEach(elem => elem.addEventListener("click", getProductData))

// Get product information from buy button
function getProductData(eve) {
    // Segmentation product information
    const imageSrc = eve.target.parentElement.children[0].children[0].src
    const productName = eve.target.parentElement.children[1].textContent.trim()
    const productPriceContent = eve.target.parentElement.children[2].children[0].textContent.trim().split(" ")
    const price = productPriceContent[0]

    manageLocalStorage(productName, price, imageSrc)
}

// if doesn't exist localStorage create its
if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify([]))
}

function getLocalStorageData () {
    return JSON.parse(localStorage.getItem("products"))
}

// Add products information to local storage
function manageLocalStorage (name, price, img) {
    const localStorageData = getLocalStorageData ()
    // Find the index of item in the local storage
    const indexItem = localStorageData.findIndex(item => item.name === name)

    // If the item is already exist increase the count
    if (indexItem >= 0) {
        localStorageData[indexItem].count ++
        addProductsToCart()
    }
    // If the item is not exist add new item to local storage
    else {
        const newItem = {name, price, img, count: 1}
        localStorageData.push(newItem)
    }

    setLocalStorage (localStorageData)
}

// Set data to local storage
function setLocalStorage (data) {
    localStorage.setItem("products", JSON.stringify(data))
    // Then get data from local storage and add products to shopping cart
    addProductsToCart()
}

// Add and edit products to shopping cart with use local storage data
function addProductsToCart () {
    const localStorageData = getLocalStorageData()
    const fragmentElem = $.createDocumentFragment()
    let ProductsCount = 0

    // Create new element from local storage and insert it to fragment
    for (const item of localStorageData) {

        const newElem = $.createElement("div")
        newElem.setAttribute("class", "cart-item")
        newElem.innerHTML = 
        `
                        <div class="cart-img">
                            <img src=${item.img} alt="coffee">
                        </div>
                        <div class="cart-item-content">
                            <h3>${item.name}</h3>
                            <span class="price"><strong>${item.price}</strong>  تومان</span>
                        </div>
                        <div class="quantity">
                            <span class="plus">+</span>
                            <span style="padding: 0 2px; color: #d6a600;" id="number">${item.count}</span>
                            <span class="minus">-</span>
                        </div>
                        <i class="fas fa-times"></i>`

        fragmentElem.append(newElem)

        ProductsCount += item.count
    }

    cartList.innerHTML = ""
    cartList.append(fragmentElem)
    // update product count on the shopping cart icons
    updateProductCount(ProductsCount)
    totalCartPrice ()
}

// Change number in the shopping cart icon
const cartCount = $.getElementById("cart-count")
function updateProductCount (count) {
    cartCount.textContent = count
}

// Manage Click In The Shopping Cart
cartList.addEventListener("click", (eve) => {
    const target = eve.target.classList

    if (target.contains("fa-times")) {
        removeItemCart(eve)
    }
    else if (target.contains("plus") || target.contains("minus")) {
        changeCount(eve)
    }
})

// remove item when click on closed button in shopping cart item
function removeItemCart (eve) {
    const targetElem = eve.target.parentElement
    const targetName = targetElem.querySelector("h3").textContent
    
    const localStorageData = getLocalStorageData ()
    const index = localStorageData.findIndex(item => item.name === targetName)
    // remove product from storage
    localStorageData.splice(index, 1)
    localStorage.setItem("products", JSON.stringify(localStorageData))
    // update shopping cart base on new storage
    addProductsToCart()
}

// Change item count when click on plus or minus in shopping cart
function changeCount (eve) {
    const operator = eve.target.textContent
    const parentElm = eve.target.parentElement.parentElement
    const itemName = parentElm.querySelector("h3").textContent
    const count = parentElm.querySelector("#number").textContent
    const localStorageData = getLocalStorageData ()
    const index = localStorageData.findIndex(item => item.name === itemName)

    // increase count of cart item
    if (operator === "+") {
        localStorageData[index].count ++
    }
    else {
        if (count <= 1) {
            // when count of item reaches zero call removeItemCart 
            const removeEvent = { target: parentElm.querySelector(".fa-times") }
            return removeItemCart(removeEvent)
        }

        localStorageData[index].count --
    }

    // set again shopping cart
    setLocalStorage(localStorageData)
}

// calculate total price in shopping cart
function totalCartPrice () {
    const totalElm = $.getElementById("total")
    const localStorageData = getLocalStorageData ()
    let totalPrice = 0
    let price = 0

    localStorageData.forEach(item => {
        // Get price string and change to integer
        price = parseInt(item.price.split(",").join(""))
        totalPrice += price * item.count
    })

    totalElm.textContent = addCommaSeparator (totalPrice)
}

function addCommaSeparator (number) {
    number = number.toString()
    let commaNumber = ""
    
    while (number.length) {
        commaNumber = "," + number.slice(-3) + commaNumber
        number = number.slice(0, -3)
    }
    // Remove the extra comma at the beginning
    commaNumber = commaNumber.slice(1);
    return commaNumber
}

// Click buy button in shopping cart
const cartBuyBtn = $.querySelector(".cart-buy")
cartBuyBtn.addEventListener("click", showBuyAlert)

function showBuyAlert () {
    const totalPrice = $.getElementById("total").textContent

    // Remove data in the products local storage then clear all product in shopping cart
    localStorage.setItem("products", JSON.stringify([]))
    // Empty cart list and refresh product count
    addProductsToCart()
    if (totalPrice != "0") {
        alert(`از خرید شما متشکریم.\n\n جمع خرید شما شد : ${totalPrice} تومان`)
    }
}

addProductsToCart()

// Change them mode
const themBtn = $.querySelector(".them-btn")
let themMode = localStorage.getItem("them")

// If doesn't exist them value in local storage create its 
localStorage.getItem("them") ? changeThem() : localStorage.setItem("them", "dark")

themBtn.addEventListener("click", () => {
    if (themMode === "dark") {
        localStorage.setItem("them", "light")
    }
    else {
        localStorage.setItem("them", "dark")
    }
    changeThem()
})

function changeThem () {
    const doc = $.documentElement
    themMode = localStorage.getItem("them")

    if (themMode === "light") {
        doc.style.setProperty("--bg", "#eee")
        doc.style.setProperty("--light-dark", "#201f1f")
        doc.style.setProperty("--main-shadow", "rgba(75, 75, 75, 0.3)")
        localStorage.setItem("them", "light")
    }
    else if (themMode === "dark") {
        doc.style.setProperty("--bg", "#010103")
        doc.style.setProperty("--light-dark", "#fff")
        doc.style.setProperty("--main-shadow", "rgba(255, 255,255, 0.3)")
        localStorage.setItem("them", "dark")
    }
}