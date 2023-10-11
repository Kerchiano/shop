$(document).ready(function () {
    $("#cart-items").hide();
    $(".cart").on("click", function () {
        $("#cart-items").slideToggle();
    });

    let totalPrice = localStorage.getItem('totalPrice') === null ? 0 :
        JSON.parse(localStorage.getItem('totalPrice'))
    let count = localStorage.getItem('count')
    count = count ? count : 0
    let data = JSON.parse(localStorage.getItem('data'))
    for (let value in data) {
        $("#list-item").append(`<li>${data[value].name} - <span>${data[value].price}
        </span><span class='sub' id='${value}'>-</span>
        <span id='quantity' data-product-id='${value}'> ${data[value].quantity} </span>
        <span class='add' id='${value}'>+</span>
        <button id='${value}' class='remove'> X </button></li>`);
    }
    $("#items-basket").text(count);
    $("#total-price").text(totalPrice + "$");
    if (count > 0) {
        $("#checkout-button").text("Оформление заказа")
    }

    $(".glowing-btn").on("click", function () {
        let button = $("#checkout-button")
        const name = $(this).parent().data("name")
        const price = $(this).parent().data("price")
        const id = $(this).parent().children("h4").data('product-id')
        let product = {id: {name, price, quantity: 1}}
        const sub = `<span class='sub' id='${id}'>-</span>`
        const add = `<span class='add' id='${id}'>+</span>`
        const remove = `<button id='${id}' class='remove'> X </button>`;
        let count = 0
        let store = JSON.parse(localStorage.getItem("data"))
        let data = store === null ? {} : store
        let order;
        if (data[id] === undefined) {
            data[id] = product.id
            order = `<li>${name} - <span>${price}</span>
        ${sub}<span id='quantity' data-product-id='${id}'> 
        ${data[id].quantity} </span>
        ${add}${remove}</li>`;
            $("#list-item").append(order);
            button.text("Оформление заказа")

        } else {
            data[id].quantity += 1
            document.querySelector("[data-product-id='" + id + "']").textContent = " " + data[id].quantity + " ";
        }
        localStorage.setItem("data", JSON.stringify(data))
        for (let value in data) {
            count += data[value].quantity
        }
        totalPrice += price * product.id.quantity

        $(".add").click(function (event) {
            totalPrice = 0
            let product_id = event.target.id
            data[product_id].quantity += 1
            document.querySelector("[data-product-id='" + product_id + "']").textContent =
                " " + data[product_id].quantity + " ";
            for (let value in data) {
                totalPrice += data[value].quantity * data[value].price
            }
            count += 1
            localStorage.setItem('totalPrice', totalPrice)
            localStorage.setItem('count', count)
            localStorage.setItem("data", JSON.stringify(data))
            $("#items-basket").text(count);
            $("#total-price").text(totalPrice + "$")
        });


        $(".sub").click(function (event) {
            totalPrice = 0
            let product_id = event.target.id
            if (data[product_id].quantity > 1) {
                data[product_id].quantity -= 1
                count -= 1
            }
            for (let value in data) {
                totalPrice += data[value].quantity * data[value].price
            }
            document.querySelector("[data-product-id='" + product_id + "']").textContent =
                " " + data[product_id].quantity + " ";
            localStorage.setItem("data", JSON.stringify(data))
            localStorage.setItem('totalPrice', totalPrice)
            localStorage.setItem('count', JSON.stringify(count))
            $("#items-basket").text(count);
            $("#total-price").text(totalPrice + "$");
        });

        $(".remove").on("click", function (event) {
            totalPrice = 0
            let product_id = event.target.id
            count -= data[product_id].quantity
            delete data[product_id]
            for (let value in data) {
                totalPrice += data[value].quantity * data[value].price
            }

            localStorage.setItem('data', JSON.stringify(data))
            localStorage.setItem('count', JSON.stringify(count))
            localStorage.setItem('totalPrice', totalPrice)
            $("#items-basket").text(count);
            $("#total-price").text(totalPrice + "$");
            $(this).parent().remove()
            button.empty()
            if (count > 0) {
                button.text("Оформление заказа")
            }
        });

        localStorage.setItem('count', count)
        localStorage.setItem('totalPrice', totalPrice)
        $("#items-basket").text(count);
        $("#total-price").text(totalPrice + "$");
    });


    $(".add").click(function (event) {
        let product_id = event.target.id
        data[product_id].quantity += 1
        document.querySelector("[data-product-id='" + product_id + "']").textContent = " " + data[product_id].quantity + " ";
        totalPrice += data[product_id].price
        count = JSON.parse(localStorage.getItem('count'))
        count += 1
        localStorage.setItem('totalPrice', totalPrice)
        localStorage.setItem('count', JSON.stringify(count))
        localStorage.setItem("data", JSON.stringify(data))
        $("#items-basket").text(count);
        $("#total-price").text(totalPrice + "$");
    });

    $(".sub").click(function (event) {
        let product_id = event.target.id
        count = JSON.parse(localStorage.getItem('count'))
        if (data[product_id].quantity > 1) {
            data[product_id].quantity -= 1
            count -= 1
            totalPrice -= data[product_id].price
        }
        document.querySelector("[data-product-id='" + product_id + "']").textContent =
            " " + data[product_id].quantity + " ";
        localStorage.setItem("data", JSON.stringify(data))
        localStorage.setItem('totalPrice', totalPrice)
        localStorage.setItem('count', JSON.stringify(count))
        $("#items-basket").text(count);
        $("#total-price").text(totalPrice + "$");
    });


    $(".remove").on("click", function (event) {
        let button = $("#checkout-button")
        let product_id = event.target.id
        count = JSON.parse(localStorage.getItem('count'))
        count -= data[product_id].quantity
        totalPrice -= data[product_id].quantity * data[product_id].price
        delete data[product_id]
        localStorage.setItem('data', JSON.stringify(data))
        localStorage.setItem('count', JSON.stringify(count))
        localStorage.setItem('totalPrice', totalPrice)
        $("#items-basket").text(count);
        $("#total-price").text(totalPrice + "$");
        $(this).parent().remove()
        button.empty()
        if (count > 0) {
            button.text("Оформление заказа")
        }
    });


    if (count === '1') {
        $(".orders-count").text(count + " товар на сумму");
    } else if (count % 10 === 1 && count > 11) {
        $(".orders-count").text(count + " товар на сумму");
    } else if (count < 5 && count > 0) {
        $(".orders-count").text(count + " товара на сумму");
    } else if (count < 21) {
        $(".orders-count").text(count + " товаров на сумму");
    } else if (count % 10 < 5) {
        $(".orders-count").text(count + " товара на сумму");
    } else {
        $(".orders-count").text(count + " товаров на сумму");
    }
    $(".orders-price").text(totalPrice + "$")
});

$("#Btn").on("click", function () {
    $("#myModal").css({'display': 'block'})
})

$(".x-mark").on("click", function () {
    $("#myModal").css({'display': 'none'})
})

const modal = document.getElementById("myModal");

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}