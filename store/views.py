import json
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import *
import datetime


# Views
def login_view(request):
    username = request.GET.get("username")
    password = request.GET.get("password")
    user = authenticate(request=request, username=username, password=password)
    if user is None:
        return HttpResponse(user)
    try:
        login(request, user)
    except Exception:
        print(Exception)
    print(request.user)
    return redirect("store")


def logout_view(request):
    print(request.user)
    logout(request)
    print(request.user)
    return redirect("store")


def store(request):
    print(request.user)
    OrderItem.objects.filter(quantity=0).delete()
    products = Product.objects.all().order_by("name")
    product_list = {i.name: [] for i in products}
    for i in products:
        product_list[i.name].append(i)  # return HttpResponse("hello")
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
        cartItems = order.get_cart_items
        cartTotal = order.get_cart_total

    else:
        items = []
        order = {"get_cart_total": 0, "get_cart_items": 0}
        cartItems = order["get_cart_items"]
        cartTotal = 0
    # print(cartItems)

    context = {
        "items": items,
        "products": product_list,
        "cartItems": cartItems,
        "cartTotal": cartTotal,
    }
    return render(request, "store/store.html", context)


def cart(request):
    OrderItem.objects.filter(quantity=0).delete()
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
        cartItems = order.get_cart_items
        cartTotal = order.get_cart_total
    else:
        items = []
        order = {"get_cart_total": 0, "get_cart_items": 0}
        cartItems = order["get_cart_items"]
        cartTotal = 0

    context = {
        "items": items,
        "order": order,
        "cartItems": cartItems,
        "cartTotal": cartTotal,
    }
    return render(request, "store/cart.html", context)


def checkout(request):
    OrderItem.objects.filter(quantity=0).delete()
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
        cartItems = order.get_cart_items
        cartTotal = order.get_cart_total

    else:
        items = []
        order = {"get_cart_total": 0, "get_cart_items": 0}
        cartItems = order["get_cart_items"]
        cartTotal = 0

    context = {
        "items": items,
        "order": order,
        "cartItems": cartItems,
        "cartTotal": cartTotal,
    }

    return render(request, "store/checkout.html", context)


def updateItem(request):
    OrderItem.objects.filter(quantity=0).delete()
    if request.method == "POST":
        data = json.loads(request.body)
        productId = data["productId"]
        action = data["action"]
        print("Action:", action)
        print("Product:", productId)
        customer = request.user.customer
        product = Product.objects.get(id=productId)
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        orderItem, created = OrderItem.objects.get_or_create(
            order=order, product=product
        )

        if action == "add":
            orderItem.quantity += 1
        elif action == "remove":
            orderItem.quantity -= 1
        orderItem.save()

        if orderItem.quantity <= 0:
            orderItem.delete()

        return JsonResponse(
            {
                # "order": order,
                "cartItems": order.get_cart_items,
                "cartTotal": order.get_cart_total,
                "itemQuantity": orderItem.quantity,
                "itemTotal": orderItem.get_total,
            }
        )
    else:
        productId = request.GET.get("id")
        customer = request.user.customer
        product = Product.objects.get(id=productId)
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        orderItem, created = OrderItem.objects.get_or_create(
            order=order, product=product
        )
        print("GET", customer, productId, orderItem.quantity)
        context = {"quantity": orderItem.quantity}
        if orderItem.quantity == 0:
            orderItem.delete()
        return JsonResponse(context, safe=False)


def processOrder(request):
    print("Data", request.body)
    transaction_id = datetime.datetime.now().timestamp()
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
    return JsonResponse({"message": "Payment Complete"})


def clear_cart(request):
    user = User.objects.get(username=request.user)
    customer = Customer.objects.get(user=user)
    order = Order.objects.get(customer=customer)
    orderItem = OrderItem.objects.filter(order=order)
    orderItem.delete()
    print(user)
    return redirect("store")
