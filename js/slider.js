
const preBtn = $.querySelector(".pre-btn")
const nextBtn = $.querySelector(".next-btn")
let products = $.querySelectorAll(".product")
const sliderBox = $.querySelector('.product-slider');
const sliderFirstPosition = -(sliderBox.scrollWidth / products.length)
sliderBox.scrollLeft = sliderFirstPosition


function scrollSlider(eve) {
    const movePixel = 200
    let scrollPosition = sliderBox.scrollLeft
    let direction = eve.target.dataset.dir
    if (direction === "right") {
        scrollPosition -= movePixel
    }
    else {
        scrollPosition += movePixel
    }
    sliderBox.scrollLeft = scrollPosition
}

function infiniteScroll() {
    products = $.querySelectorAll(".product")
    const lastProduct = products[products.length - 1]
    const firstProduct = products[0]
    let scrollPosition = sliderBox.scrollLeft
    const sliderLeftEdge = sliderBox.clientWidth - sliderBox.scrollWidth + 5

    if (scrollPosition > sliderFirstPosition) {
        const lastProductClone = lastProduct.cloneNode(true)
        lastProductClone.addEventListener("click", getProductData)
        sliderBox.insertAdjacentElement("afterbegin", lastProductClone)
        sliderBox.lastElementChild.remove()
    }
    else if (scrollPosition < sliderLeftEdge) {
        const firstProductClone = firstProduct.cloneNode(true)
        firstProductClone.addEventListener("click", getProductData)
        sliderBox.insertAdjacentElement("beforeend", firstProductClone)
        sliderBox.firstElementChild.remove()
    }
}

let movementToggle = true
let sliderStartInterval = null
function sliderMovement(eve) {
    if (eve.type === "mouseleave" && movementToggle) {
        sliderStartInterval = setInterval(() => {
            const moveRight = { target: nextBtn }
            scrollSlider(moveRight)
        }, 2500);
        movementToggle = false
    }
    else {
        clearInterval(sliderStartInterval)
        movementToggle = true
    }

}


sliderBox.addEventListener("mouseenter", sliderMovement)
sliderBox.addEventListener("mouseleave", sliderMovement)
sliderBox.addEventListener("scroll", infiniteScroll)
sliderBox.addEventListener("wheel", (eve) => {eve.preventDefault()})
nextBtn.addEventListener("click", scrollSlider)
preBtn.addEventListener("click", scrollSlider)

sliderMovement({type: "mouseleave"})
