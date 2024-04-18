let updateBtns = document.querySelectorAll(".update-cart");
let cartItems = document.querySelectorAll(".cart-items");
let cartTotal = document.querySelectorAll(".cart-total");
let product_prices = document.querySelectorAll(".product-price")
let itemQuantity, itemTotal;

document.addEventListener("DOMContentLoaded", () => {
    if (cartItems[0].innerHTML !== '0') {
        document.querySelectorAll(".cart-box").forEach(element => {
            element.classList.toggle("d-none");
        });
    } else {
        cartItems[0].classList.add("d-none");
        cartItems[1].classList.remove("d-lg-inline");
    }
});

// product_prices.forEach(i => i.addEventListener("click", () => alert("clicked")))

updateBtns.forEach(btn => {
    btn.addEventListener("click", function () {
        const productId = this.dataset.product;
        const action = this.dataset.action;
        console.log("productId: " + productId + " action: " + action);
        console.log("user:", user);
        if (user == 'AnonymousUser') {
            console.log("Log in first");
        } else {
            updateUserOrder(productId, action);
        }
    });
});

function updateUserOrder(productId, action) {
    console.log("User is logged in, sending data...");
    const url = '/update_item/';
    try {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({ 'productId': productId, 'action': action })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.cartItems >= 0) {
                    cartItems[0].classList.remove("d-none");
                    cartItems[1].classList.add("d-lg-inline");
                    try { document.querySelector(`#iq${productId}`).classList.remove("d-none"); } catch { }
                    cartItems.forEach(item => {
                        item.innerHTML = data.cartItems;
                    });
                    cartTotal.forEach(item => {
                        item.innerHTML = "₹" + data.cartTotal;
                    });
                    itemQuantity = document.querySelector(`#q${productId}`);
                    itemTotal = document.querySelector(`#t${productId}`);
                    if (data.itemQuantity > 0) {
                        try {
                            itemQuantity.innerHTML = data.itemQuantity;
                            itemTotal.innerHTML = `₹${parseFloat(data.itemTotal)}`;
                        } catch {
                            document.querySelector(`#iq${productId}`).innerHTML = data.itemQuantity + "x";
                        }
                    } else {
                        try { document.querySelector(`#iq${productId}`).classList.add("d-none"); } catch { }
                        try {
                            document.querySelectorAll(`.row${productId}`).forEach(element => {
                                element.classList.add("d-none");
                            });
                        } catch {
                        }
                    }
                }
                if (data.cartItems == 0) {
                    cartItems[0].classList.add("d-none");
                    cartItems[1].classList.remove("d-lg-inline");
                    if (window.location.href == "http://127.0.0.1:8000/cart/") {
                        document.querySelectorAll(".box-element").forEach(element => {
                            element.classList.toggle("d-none");
                        });
                    }
                }
            });
    } catch (error) {
        console.error(error);
    }
}
