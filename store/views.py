import json
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import *
import datetime

products = Product.objects.all()


# Create your views here.
def store(request):
    return HttpResponse("hello")
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
    print(cartItems)

    context = {
        "items": items,
        "products": products,
        "cartItems": cartItems,
        "cartTotal": cartTotal,
    }
    return render(request, "store/store.html", context)


def cart(request):
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
    return JsonResponse("Payment Complete", safe=False)
