var updateBtns = document.querySelectorAll(".update-cart");
var cartItems = document.querySelectorAll(".cart-items");
var cartTotal = document.querySelectorAll(".cart-total");
var product_prices = document.querySelectorAll(".product-price")
var itemQuantity, itemTotal, a, csrftoken;
const BASE_URL = 'http://127.0.0.1:8000/'
document.addEventListener("DOMContentLoaded", () => {
    csrftoken = getToken('csrftoken');

    if (user !== "AnonymousUser") {
        updateQuantities(); swap_prices();
    }

    if (cartItems[0].innerHTML !== '0') {
        document.querySelectorAll(".cart-box").forEach(element => {
            element.classList.toggle("d-none");

        });
    } else {
        // console.log("fail");
        cartItems[0].classList.add("d-none");
        cartItems[1].classList.remove("d-lg-inline");
    }


});
function login() {
    if (user == 'AnonymousUser' || user == "") {
        let username = prompt("name")
        let password = prompt("password")
        console.log(username, password)
        try {
            fetch(`login?username=${username}&password=${password}`, {
                method: "GET"
            })
                .then(res => res.json())
                .then(data => console.log(data))
            user = username

        } catch { }
    }
    updateQuantities()
}
function logout() {
    if (user != 'AnonymousUser' || user == "") {
        try {
            fetch(`logout`, {
                method: "GET"
            })
                .then(res => res.json())
                .then(data => console.log(data))
            user = username

        } catch { }
    }
}
function swap_prices() {
    document.querySelectorAll(".options").forEach((i) => i.addEventListener("click", () => {
        document.querySelector(`h4[iqMain${i.dataset.productName}]`).innerHTML = i.innerHTML
        a = i.childNodes[1].id.substring(2)
        document.querySelector(`#${i.dataset.productName}incr`).setAttribute("data-product", a)
        document.querySelector(`#${i.dataset.productName}decr`).setAttribute("data-product", a)
        // updateQuantities()

    }))
}
function updateQuantities() {
    if (window.location.href == BASE_URL) {
        // console.log("Hello");
        document.querySelectorAll(".iq").forEach(i => {
            console.log(i);
            fetch(`/update_item?id=${i.id.substring(2)}`, {
                method: "GET"
            })
                .then(res => res.json())
                .then(data => {
                    if (data.quantity > 0) {
                        i.innerHTML = data.quantity + "x"
                        i.classList.remove("d-none")
                    }
                })
        })
    }
}
function updateQuantityInFocus(e) {
    a = e.childNodes[1].childNodes[1].id
    console.log(a);
    document.querySelectorAll("." + a).forEach(i => {
        console.log(i);
        fetch(`/update_item?id=${i.id.substring(2)}`, {
            method: "GET"
        })
            .then(res => res.json())
            .then(data => {
                if (data.quantity > 0) {
                    i.innerHTML = data.quantity + "x"
                    i.classList.remove("d-none")
                }
                else { i.classList.add("d-none") }
            })
    })
}

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
    csrftoken = getToken('csrftoken');
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
                            document.querySelector(`.iq${productId}`).innerHTML = data.itemQuantity + "x";
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
                    if (window.location.href == `${BASE_URL}cart/`) {
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
function getToken(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
