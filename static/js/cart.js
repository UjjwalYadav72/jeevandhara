var updateBtns = document.querySelectorAll(".update-cart");
var cartItems = document.querySelectorAll(".cart-items");
var cartTotal = document.querySelectorAll(".cart-total");
var product_prices = document.querySelectorAll(".product-price")
var itemQuantity, itemTotal, a, csrftoken;
const BASE_URL = 'http://127.0.0.1:8000/'
// alert("hello")
document.addEventListener("DOMContentLoaded", () => {
    csrftoken = getToken('csrftoken');

    if (user !== "AnonymousUser") {
        // window.onload = () => {
        updateQuantities();
        swap_prices();
        document.querySelectorAll(".account").forEach(i => {
            i.classList.toggle("d-none")
        })
        // }
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
        // let username = prompt("name")
        // let password = prompt("password")
        // console.log(username, password)
        try {
            fetch(`login?username=Ujjwal&password=1_2_3_4_`, {
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
        a = i.childNodes[1].id.substring(11)
        document.querySelector(`#${i.dataset.productName}incr`).setAttribute("data-product", a)
        document.querySelector(`#${i.dataset.productName}decr`).setAttribute("data-product", a)
        updateQuantities()

    }))
}
function updateQuantities() {
    // if (window.location.href == BASE_URL) {
    // console.log("Hello");
    document.querySelectorAll(".iq_dropdown").forEach(i => {
        console.log(i);
        fetch(`/update_item?id=${i.id.substring(11)}`, {
            method: "GET"
        })
            .then(res => res.json())
            .then(data => {
                if (data.quantity > 0) {
                    i.innerHTML = "x" + data.quantity
                    i.classList.remove("d-none")
                }
            })
    })
    // }
}
// function updateQuantityInFocus(e) {
//     a = e.childNodes[1].childNodes[1].id
//     console.log(a);
//     document.querySelectorAll("." + a).forEach(i => {
//         console.log(i);
//         fetch(`/update_item?id=${i.id.substring(11)}`, {
//             method: "GET"
//         })
//             .then(res => res.json())
//             .then(data => {
//                 if (data.quantity > 0) {
//                     i.innerHTML = "x" + data.quantity
//                     i.classList.remove("d-none")
//                 }
//                 else { i.classList.add("d-none") }
//             })
//     })
// }

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
    // csrftoken = getToken('csrftoken');
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
                    try { document.querySelector(`#iq_dropdown${productId}`).classList.remove("d-none"); } catch { }
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
                            document.querySelector(`.iq_dropdown${productId}`).innerHTML = "x" + data.itemQuantity;
                        }
                    } else {
                        try { document.querySelector(`#iq_dropdown${productId}`).classList.add("d-none"); } catch { }
                        try {
                            document.querySelectorAll(`.row${productId}`).forEach(element => {
                                element.classList.add("d-none");
                            });
                        } catch {
                        }
                    }
                }
                if (cartItems[0].innerHTML == '0') {
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
function submitFormData() {
    console.log(`Payment button clicked`);
    // alert(`Payment button clicked`);
    var userFormData = {
        name: null,
        email: null,
        total: total,
    }
    var shippingInfo = {
        address: form.address.value,
        city: form.city.value,
        state: form.state.value,
        pincode: form.pincode.value,
    }
    if (user == "AnonymousUser") {
        userFormData.name = form.name.value
        userFormData.email = form.email.value
    }

    var url = "/process_order/"
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,

        },
        body: JSON.stringify({ form: userFormData, shipping: shippingInfo, })
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Success: ", data);
            alert("Transation Completed, Redirecting to homepage")
            setTimeout(() =>
                window.location.href = BASE_URL
                , 1000);
        })
}