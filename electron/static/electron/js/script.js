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
    for (let value in data) {
        $(".list-orders").append(`<li class="order"><div class="checkout-product">
                            <a href="#" class="checkout-product-link">
                                <figure class="checkout-product-picture">
                                    <img class="checkout-product-image" id="image" src="${data[value].image}" alt="">
                                </figure>
                            </a>
                            <div class="checkout-product-description">
                                <div class="checkout-product-label">
                                    <a href="#" class="checkout-product-link"><span
                                            class="checkout-product-name" id="product">${data[value].name}</span></a>
                                </div>
                                <div class="checkout-product-cost">
                                    <div class="checkout-product-count">
                                        <span class="checkout-product-price" id="price">
                                        ${data[value].price + ' $'}
                                        </span>
                                        <span class="checkout-product-quantity" id="qty">
                                        ${' x ' + data[value].quantity + ' ед.'}</span>
                                    </div>
                                </div>
                                <div class="checkout-product-amount">
                                    <span class="checkout-product-digit" id="total">${data[value].quantity * data[value].price + " $"}</span>
                                </div>
                            </div>
                        </div>
                        </li>`)
    }

    $("#items-basket").text(count);
    $("#total-price").text(totalPrice + "$");
    if (count > 0) {
        $("#checkout-button").text("Оформление заказа")
    }

    $(".glowing").on("click", function () {
        let button = $("#checkout-button")
        const name = $(this).parent().parent().data("name")
        const price = $(this).parent().parent().data("price")
        const image = $(this).parent().parent().data("image")
        const id = $(this).parent().parent().children("h4").data('product-id')
        let product = {id: {name, price, image, quantity: 1}}
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

    if ((count % 10 === 1 && count % 100 !== 11)) {
        $(".orders-count").text(count + " товар на сумму");
    } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
        $(".orders-count").text(count + " товара на сумму");
    } else {
        $(".orders-count").text(count + " товаров на сумму");
    }
    $(".orders-price").text(totalPrice + "$")


    const location_city = localStorage.getItem('city-location')

    function Filter_list_2(value) {
        console.log(value)
        if (!value)
            return $('.post-office-list li').remove()
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'https://api.novaposhta.ua/v2.0/json/',
            data: JSON.stringify({
                modelName: 'Address',
                calledMethod: "getWarehouses",
                methodProperties: {
                    Warehouse: "1",
                    CityName: location_city,
                    FindByString: value,
                },
                apiKey: '263f6663c61b14b1471c0e7972627700'
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            xhrFields: {
                withCredentials: false
            },
            success: function ({data}) {
                $('.post-office-list li').remove()
                $.each(data, function (i, text) {
                    $('.post-office-list').append(`<li><div class="autocomplete-item" data-post-office='№${text.Number}, ${text.ShortAddress}'><span>№${text.Number}, ${text.ShortAddress}</span></div></li>`);
                });
                console.log(data)
            },
        });
    }

    $(".search-delivery").keyup(debounce(e => {
        Filter_list_2(e.target.value);
    }, 500));

    $('.block_brand_filter').hover(
        function () {
            $(this).find('.filter_name').css({'color': '#f84147'})
        },
        function () {
            $(this).find('.filter_name').css({'color': '#3e77aa'})
        }
    );
    const transform = function (angle) {
        if (angle.css('transform') === 'none') {
            angle.css({'transform': 'rotate(-180deg)'})
        } else {
            angle.css('transform', '')
        }
    }

    $(".alphabet_button").click(function () {
        $('.alphabet_list').toggle();
    });

    $(".letter_link").click(function () {
        let selectedLetter = $(this).data('letter');
        filterBrandsByLetter(selectedLetter);

        let currentText = $("#input_search_brand").val();
        $("#input_search_brand").val(currentText + selectedLetter);

        $("#clear_input").show();
    });

    $("#input_search_brand").on('input', function () {
        let inputText = $(this).val().toUpperCase();

        if (inputText === '') {
            $("#clear_input").hide();
        } else {
            $("#clear_input").show();
        }

        if (inputText === '') {
            $(".brand_item").show();
        } else {
            filterBrandsByLetter(inputText);
        }
    });

    $("#clear_input").click(function () {
        $("#input_search_brand").val('');
        $(".brand_item").show();
        $(this).hide();
    });

    function filterBrandsByLetter(letter) {
        $(".brand_item").hide();

        $(".brand_item a[data-brand^='" + letter + "']").parent().show();
    }

    $("#Color").click(function () {
        let angle = $(this).find('[data-transform="rotate"]');
        $('#color_list').toggle();
        transform(angle)
    });

    $("#Brand").click(function () {
        let angle = $(this).find('[data-transform="rotate"]');
        $('.block_alphabet_cursor').toggle();
        $('.block_brand').toggle();
        transform(angle)
    });

    $("#Price").click(function () {
        let angle = $(this).find('[data-transform="rotate"]');
        $('.wrapper').toggle();
        transform(angle)
    });


    $(".checkbox_filter_link").click(function () {
        $(this).toggleClass("checked");
    });

    $(function () {
        let $slider = $("#slider-range");
        let priceMin = $slider.data("price-min"),
            priceMax = $slider.data("price-max");

        $("#price-filter-min, #price-filter-max").map(function () {
            $(this).attr({
                "min": priceMin,
                "max": priceMax
            });
        });
        $("#price-filter-min").attr({
            "placeholder": "min " + priceMin,
            "value": priceMin
        });
        $("#price-filter-max").attr({
            "placeholder": "max " + priceMax,
            "value": priceMax
        });

        $slider.slider({
            range: true,
            min: Math.max(priceMin, 0),
            max: priceMax,
            values: [priceMin, priceMax],
            slide: function (event, ui) {
                $("#price-filter-min").val(ui.values[0]);
                $("#price-filter-max").val(ui.values[1]);
            }
        });

        $("#price-filter-min, #price-filter-max").map(function () {
            $(this).on("input", function () {
                updateSlider();
            });
        });

        function updateSlider() {
            $slider.slider("values", [$("#price-filter-min").val(), $("#price-filter-max").val()]);
        }
    });
    $('.Arrow').hover(
        function () {
            $('.ArrowImg').css({
                'filter': 'brightness(0.5) sepia(1) hue-rotate(-40deg) saturate(5) brightness(2)'
            });
        },
        function () {
            $('.ArrowImg').css({
                'filter': 'none'
            });
        });
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

const body_content = $('body')

$(".header-location-popular li span").on("click", function () {
    $('.region-post-office').css({'display': 'none'})
    $('.main-location').removeClass("main-location")
    $(this).addClass("main-location")
    $(this).parent().data('main-location', $(this).text());
    $('.location-search input').val($(this).text())
    $('.button-apply').prop('disabled', false).css({
        'color': 'white',
        'background-color': '#00a046',
        'cursor': 'pointer'
    })
    const main_location = $(this).parent().data('main-location')
    localStorage.setItem('location', main_location)
})


$('.button-apply').on("click", function () {
    const main_location = $('.main-location')
    const full_location = main_location.text()
    const city_name = main_location.data('main-location')
    localStorage.setItem('location', full_location)
    localStorage.setItem('city-location', city_name)
    $('.city').text(full_location)
    $('.region').text(full_location)
    $("#myModal").css({'display': 'none'})
    $('.button-apply').prop('disabled', true).css({
        'color': '#a6a5a5',
        'background-color': '#eee',
        'cursor': 'default'
    })
    $('.search-delivery').val('')
    $('.post-office').css({'display': 'none'})
    $('ul .autocomplete-item').remove()
    localStorage.removeItem('number_address')
    $('.button-choice-place').children('span').empty()

    function cityPost(value) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'https://api.novaposhta.ua/v2.0/json/',
            data: JSON.stringify({
                modelName: 'Address',
                calledMethod: "getWarehouses",
                methodProperties: {
                    Warehouse: "1",
                    CityName: city_name,
                    FindByString: value,
                },
                apiKey: '263f6663c61b14b1471c0e7972627700'
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            xhrFields: {
                withCredentials: false
            },
            success: function ({data}) {
                $('.post-office-list li').remove()
                $.each(data, function (i, text) {
                    $('.post-office-list').append(`<li><div class="autocomplete-item" data-post-office='№${text.Number}, ${text.ShortAddress}'><span>№${text.Number}, ${text.ShortAddress}</span></div></li>`);
                });
                console.log(data)
            },
        });
    }

    $(".search-delivery").keyup(debounce(e => {
        cityPost(e.target.value);
    }, 500));
})

const region_location = $('.region-location')

$('.region').text(localStorage.getItem('location'))
region_location.val(localStorage.getItem('location'))

$('.button-choice-place').on("click", function (event) {
    const post_office = $('.post-office')
    if (post_office.css('display') === 'none') {
        post_office.css({'display': 'block'})
    } else {
        post_office.css({'display': 'none'})
    }
})
region_location.on("click", function () {
    const region_post_office = $('.region-post-office')
    if (region_post_office.css('display') === 'none') {
        region_post_office.css({'display': 'block'})
    } else {
        region_post_office.css({'display': 'none'})
    }
})

body_content.on("click", '.autocomplete-item', function () {
    const value = $('.button-choice-place span')
    value.text($(this).text())
    const number_address = $(this).text()
    localStorage.setItem('number_address', JSON.stringify(number_address))
    $('.post-office').css({'display': 'none'})
    $('.search-delivery').val("")
    $('.post-office-list li').remove()
})

const number_address = JSON.parse(localStorage.getItem('number_address'))
$('.button-choice-place span').text("Выберите подходящее отделение")
if (number_address !== null) {
    $('.button-choice-place span').text(number_address)
}

body_content.on("click", '.region_autocomplete_item', function () {
    $('.location-search input').val($(this).text())
    $('.main-location').removeClass("main-location")
    $(this).addClass("main-location")
    $('.region-post-office').css({'display': 'none'})
    $('.button-apply').prop('disabled', false).css({
        'color': 'white',
        'background-color': '#00a046',
        'cursor': 'pointer'
    })
    const main_location = $(this).data('main-location')
    localStorage.setItem('location', main_location)
})


function Filter_list(value) {
    if (!value)
        return $('ul .region_autocomplete_item').remove()
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'https://api.novaposhta.ua/v2.0/json/',
        data: JSON.stringify({
            modelName: 'Address',
            calledMethod: 'getSettlements',
            methodProperties: {
                Warehouse: "1",
                FindByString: value,
            },
            apiKey: '263f6663c61b14b1471c0e7972627700'
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        xhrFields: {
            withCredentials: false
        },
        success: function (data) {
            const location_data = data.data
            console.log(location_data)
            $('ul .region_autocomplete_item').remove()
            for (let text in location_data) {
                $('.region-post-office-list').append(`<li><div class="region_autocomplete_item" data-main-location="${location_data[text].Description}"><span>${location_data[text].SettlementTypeDescription} ${location_data[text].Description}, ${location_data[text].AreaDescription}</span></div></li>`)
            }
        },
    });
}

function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        let context = this, args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

$(".region-location").keyup(debounce(e => {
    Filter_list(e.target.value);
}, 500));


$('.block-content-payment').append(`<li class="checkout-payment-offline">
                        <div class="block-radio-payment" style="padding-bottom: 10px">
                            <input class="checkout-radio-payment" checked type="radio" style="margin-right: 8px">
                            <label class="checkout-variant-payment"></label>
                            <span class="radio-payment-span">Оплатить при получении</span>
                        </div>
                    </li>`)

let userData = JSON.parse(localStorage.getItem('userData'))
let userId = JSON.parse(localStorage.getItem('userId'));
$('#formOrder').submit(function (e) {
    e.preventDefault();
    let formData = $(this).serializeArray();
    formData = [formData[0]]
    const location = $('#location').text()
    const postOfficeAddress = $('#postOfficeAddress').text()
    const amount = $('#amount').text()
    let orderItems = JSON.parse(localStorage.getItem('data'))
    console.log(orderItems)
    let orIt = {}
    for (let i in orderItems) {
        orIt[i] = {'quantity': orderItems[i].quantity}
    }

    formData.push({name: 'location', value: location}, {
        name: 'postOfficeAddress',
        value: postOfficeAddress
    }, {name: 'amount', value: amount}, {name: 'orderItems', value: orIt})
    localStorage.setItem('order', JSON.stringify(formData))
    $(this).css({'display': 'none'})
    let selectPersonInfo = $('.personInfo')
    if (selectPersonInfo.is(':empty')) {
        selectPersonInfo.css({'border': '1px solid #00a046', 'padding': '10px 0'}).append(`<i class="bi fa-2x bi-person-circle" id="personCircle"></i>
         <div class="userInfo"><div><span> ${userData.name} ${userData.last_name}</span></div>
         <div><span>${userData.email}</span></div></div>
         <div style="margin-left: auto; margin-right: 10%"><span>${userData.phone_number}</span></div>
         <i class="bi fa-lg bi-pencil" id="pencilEdit"></i>
    `)
    } else {
        $('.blockPersonInfo').css({'display': 'block'})
        selectPersonInfo.empty()
        selectPersonInfo.css({'border': '1px solid #00a046', 'padding': '10px 0'}).append(`<i class="bi fa-2x bi-person-circle" id="personCircle"></i>
         <div class="userInfo"><div><span> ${userData.name} ${userData.last_name}</span></div>
         <div><span>${userData.email}</span></div></div>
         <div style="margin-left: auto; margin-right: 10%"><span>${userData.phone_number}</span></div>
         <i class="bi fa-lg bi-pencil" id="pencilEdit"></i>
    `)
    }
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$('.userData').on('click', function () {
    let name = $('input[name="firstname"]').val()
    let lastName = $('input[name="lastname"]').val()
    let email = $('input[name="email"]').val()
    let phoneNumber = $('input[name="phone_number"]').val()
    userData = {'email': email, 'last_name': lastName, 'name': name, 'phone_number': phoneNumber}
    localStorage.setItem('userData', JSON.stringify(userData))
})

$('.button-checkout').on('click', function (e) {
    e.preventDefault();
    let formData = JSON.parse(localStorage.getItem('order'))
    formData[4] = {name: 'orderItems', value: JSON.stringify(formData[4].value)}
    if (userId === null) {
        formData.push(
            {name: 'name', value: userData.name},
            {name: 'last_name', value: userData.last_name},
            {name: 'email', value: userData.email},
            {name: 'phone_number', value: userData.phone_number}
        )
    }
    $.ajax({
        url: 'http://127.0.0.1:8000/checkout',
        type: 'POST',
        data: formData,
        success: function (response) {
            localStorage.clear();
            $('.wrap-modal-success').css({'display': 'block'})
            $('#button-OK').on('click', function () {
                window.location.href = '/';
            })
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('.wrap-modal-error').css({'display': 'block'})
            $('#button-Error').on('click', function () {
                $('.wrap-modal-error').css({'display': 'none'})
            })
        }
    });
})

if (userData !== null) {
    $('input[name="firstname"]').val(userData.name)
    $('input[name="lastname"]').val(userData.last_name)
    $('input[name="email"]').val(userData.email)
    $('input[name="phone_number"]').val(userData.phone_number)
}

$('.personInfo').on('click', function () {
    $('.blockPersonInfo').css({'display': 'none'})
    $('#formOrder').css({'display': 'block'})
})


$('#loginForm').submit(function (event) {
    event.preventDefault();

    const email = $('#id_username').val();
    const password = $('#id_password').val();
    $.ajax({
        url: 'http://127.0.0.1:8000/login/',
        type: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        contentType: 'application/json',
        data: JSON.stringify({email: email, password: password}),
        success: function (data) {
            const userId = data.userId;
            window.location.href = '/';
            console.log('Успешный вход. Идентификатор пользователя:', userId);

            localStorage.setItem('userId', userId);
        },
    });
});

if (userId) {
    $.ajax({
        url: `http://127.0.0.1:8000/get_user_data/${userId}/`,
        method: 'GET',
        dataType: 'json',
        success: function (userData) {
            console.log('Получены данные пользователя:', userData);
            localStorage.setItem('userData', JSON.stringify(userData))
        },
        error: function (error) {
            console.error('Ошибка при получении данных:', error);
        }
    });
} else {
    // console.error('Айди пользователя не найден в локальном хранилище.');
}

