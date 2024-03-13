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

    $(document).on("click", ".glowing", function () {
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
            updateDetailData()
        });

        localStorage.setItem('count', count)
        localStorage.setItem('totalPrice', totalPrice)
        $("#items-basket").text(count);
        $("#total-price").text(totalPrice + "$");


    });

    function addDetailItem() {
        $(".add").click(function (event) {
            let data = JSON.parse(localStorage.getItem('data'))
            let totalPrice = parseInt(localStorage.getItem('totalPrice'))
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
    }

    addDetailItem()

    function subDetailItem() {

        $(".sub").click(function (event) {
            let data = JSON.parse(localStorage.getItem('data'))
            let totalPrice = localStorage.getItem('totalPrice')
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
    }

    subDetailItem()

    function removeCartItem() {

        $(".remove").on("click", function (event) {
            let data = JSON.parse(localStorage.getItem('data'))
            let totalPrice = localStorage.getItem('totalPrice')
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
            updateDetailData()
        });
    }

    removeCartItem()

    if ((count % 10 === 1 && count % 100 !== 11)) {
        $(".orders-count").text(count + " товар на сумму");
    } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
        $(".orders-count").text(count + " товара на сумму");
    } else {
        $(".orders-count").text(count + " товаров на сумму");
    }
    $(".orders-price").text(totalPrice + "$")


    function Filter_list_2(value) {
        const location_city = localStorage.getItem('city-location')
        console.log(location_city)
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
            },
        });
    }

    $(document).on('keyup', '.search-delivery', debounce(function (e) {
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
        console.log(letter)
        $(".brand_item").hide();
        $(".brand_item a[data-filter-value^='" + letter + "']").parent().show();
    }

    $("#Color").click(function () {
        let angle = $(this).find('[data-transform="rotate"]');
        $('#color_list').toggle();
        transform(angle)
    });

    function BrandPrice() {
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
    }

    BrandPrice()

    function initializeSlider() {
        let $slider = $("#slider-range");
        let priceMin = $slider.data("price-min");
        let priceMax = $slider.data("price-max");

        let initialValues = [priceMin, priceMax];

        $("#price-filter-min, #price-filter-max").attr({
            "min": priceMin,
            "max": priceMax
        });

        $slider.slider({
            range: true,
            min: Math.max(priceMin, 0),
            max: priceMax,
            values: initialValues,
            slide: function (event, ui) {
                $("#price-filter-min").val(ui.values[0]);
                $("#price-filter-max").val(ui.values[1]);
            }
        });

        $("#price-filter-min, #price-filter-max").on("input", function () {
            updateSlider();
        });

        function updateSlider() {
            $slider.slider("values", [$("#price-filter-min").val(), $("#price-filter-max").val()]);
        }
    }

    initializeSlider();

    function saveSliderValues() {
        let filters = localStorage.getItem('filters')
        filters = JSON.parse(filters);
        let parsedValues = filters === null ? [1550, 59809] : [filters.priceMin, filters.priceMax]
        parsedValues = parsedValues[0] !== null ? parsedValues : [1550, 59809]
        localStorage.setItem('sliderValues', JSON.stringify(parsedValues));
    }

    function restoreSliderValues() {
        let $slider = $("#slider-range");
        let storedValues = JSON.parse(localStorage.getItem('sliderValues'));
        storedValues = storedValues && storedValues[0] !== null ? storedValues : [1550, 59809];
        storedValues = urlParams.has('producer') !== true ? storedValues : JSON.parse(localStorage.getItem('filters_search')).price || [1550, 59809];

        if (storedValues) {
            let parsedValues = storedValues;
            $slider.slider("values", parsedValues);

            $("#price-filter-min").val(parsedValues[0]);
            $("#price-filter-max").val(parsedValues[1]);
        } else {
            let parsedValues = storedValues
            $slider.slider("values", parsedValues);

            $("#price-filter-min").val(parsedValues[0]);
            $("#price-filter-max").val(parsedValues[1]);
        }
    }

    saveSliderValues()
    $(document).ready(restoreSliderValues);
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

    let urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.get('page');


    if (page == null) {
        $('a[href$="?page=1"]').addClass('active').css({'border-color': '#3e77aa'});
    }

    $(document).on('click', '.paginationLink', function (e) {
        e.preventDefault();
        const link = $(this);
        const url = link.attr("href");
        let currentUrl = window.location.href
        let urlParams = new URLSearchParams(window.location.search);
        let urlParamsKey = urlParams.has('producer')


        if (currentUrl.split('&').length !== 1 && urlParamsKey !== true) {
            loadData(link.html())
            $('#product-list').empty()
        } else if (urlParamsKey === true) {
            $('.container_product_list').remove()
            let page = link.html()
            searchProduct(urlParams.get('producer'), page)
        } else {
            $('.paginationLink').removeClass('active').css({'border-color': ''});
            link.addClass('active').css({'border-color': '#3e77aa'});
            $("#product-list").load(url + " #product-list > *", function () {
                window.history.pushState({}, '', url);
            });
        }
    });


    function ArrowRight() {
        $('.ArrowRight').on('click', function (e) {
            e.preventDefault();
            let urlParams = new URLSearchParams(window.location.search);
            let urlParamsKey = urlParams.has('producer')
            let page = urlParams.get('page');
            let lastPage = $('.paginationLink').last().html()

            if (parseInt(page) !== parseInt($('.paginationItem').length) && (window.location.href.split('&').length === 1)) {
                const link = $('.paginationLink.active').last();
                let arrowUrl = '?page=' + (parseInt(link.html()) + 1)
                $('.paginationLink').removeClass('active').css({'border-color': ''});
                $(`a[href$="${arrowUrl}"]`).addClass('active').css({'border-color': '#3e77aa'});
                $("#product-list").load(arrowUrl + " #product-list > *", function () {
                    window.history.pushState({}, '', arrowUrl);
                });
            } else if (parseInt(page) !== parseInt($('.paginationItem').length) && urlParamsKey !== true) {
                const link = $('.paginationLink.active').last()
                loadData(parseInt(link.html()) + 1)
                $('#product-list').empty()
            } else if (urlParamsKey === true && page < lastPage) {
                page = parseInt(page) + 1
                $('.container_product_list').remove()
                searchProduct(urlParams.get('producer'), page)
            }
        });
    }

    ArrowRight()

    function ArrowLeft() {
        $('.ArrowLeft').on('click', function (e) {
            e.preventDefault();
            let urlParams = new URLSearchParams(window.location.search);
            let urlParamsKey = urlParams.has('producer')
            let page = urlParams.get('page');
            let firstPage = $('.paginationLink').first().html()
            if (parseInt(page) !== 1 && window.location.href.split('&').length === 1) {
                const link = $('.paginationLink.active');
                link.removeClass('active').css({'border-color': ''});
                let arrowUrl = '?page=' + (parseInt(link.html()) - 1)
                $(`a[href$="${arrowUrl}"]`).addClass('active').css({'border-color': '#3e77aa'});
                $("#product-list").load(arrowUrl + " #product-list > *", function () {
                    window.history.pushState({}, '', arrowUrl);
                });
            } else if (parseInt(page) !== 1 && urlParamsKey !== true) {
                const link = $('.paginationLink.active').last()
                if (parseInt(link.html()) === 1) {
                    loadData(parseInt(link.html()))
                    $('#product-list').empty()
                } else if (parseInt(link.html()) > 1) {
                    loadData(parseInt(link.html()) - 1)
                    $('#product-list').empty()
                }
            } else if (urlParamsKey === true && page > firstPage) {
                page = parseInt(page) - 1
                $('.container_product_list').remove()
                searchProduct(urlParams.get('producer'), page)
            }
        })
    }

    ArrowLeft()

    $(`a[href$="?page=${page}"]`).addClass('active').css({'border-color': '#3e77aa'})
    let loading = false;

    $('#showMore').on('click', function () {
        let urlParams = new URLSearchParams(window.location.search);
        let page = urlParams.get('page');
        let infinityPage = page !== null ? parseInt(page) + 1 : 2
        let linkInfinity = $(`a[href$="?page=${infinityPage}"]`)
        if (window.location.href.split('&').length === 1) {
            linkInfinity.addClass('active').css({'border-color': '#3e77aa'})
            window.history.pushState({}, '', '?page=' + infinityPage);

            if (loading) {
                return;
            }

            loading = true;
            $.ajax({
                url: window.location.href + '&page=' + infinityPage,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Infinite-Scroll': 'true'
                },
                success: function (data) {
                    if (data.products.length > 0 && window.location.href.split('&').length === 1) {
                        let productItem
                        data.products.forEach(function (product) {
                            productItem =
                                `<li class="item" data-price =${product.price} data-image=${product.image}
                data-name =${product.name} data-brand=${product.brand} data-color=${product.color}>
                <div style="display: flex; justify-content: center; align-items: center; position: absolute; right: 20px"
                             data-product-id=${product.id}>
                            <button class="heartButton">
                                <img src="/static/electron/images/heart.png" class="heart"
                                     alt="Heart">
                            </button>
                            <span class="wishlist-count">${product.count_like}</span>
                            </div>
                <h4 data-product-id=${product.id}></h4>
            <img class="contain" src="${product.image}" alt="Card image cap">
                <a href="http://127.0.0.1:8000/detail/${product.slug}" class="product_name">${product.name}</a>
                <div style="display: flex; align-items: center; text-align: center; justify-content: space-between">
                    <h3 style="margin-bottom: 0; color: #f84147; font-size: 20px">${product.price}₴</h3>
                    <button class="glowing"><i class="bi bi-cart4 fa-xl" style="color:#00a046;"></i>
                    </button>
                </div>
                <div style="display: flex; align-items: center; text-align: center; margin-top: 10px">
                    <span style="color: #00a046; font-size: 12px;">Готов к отправке</span>
                    <i class="fa-solid fa-truck"
                       style="color: #00a046; margin-left: 10px; width: 16px; height: 16px"></i>
                </div>
            </li>`
                            $('#product-list').append(productItem);
                        })
                    } else {
                        $('#showMore').hide();
                    }
                    loading = false;
                },
                error: function (error) {
                    console.error('Ошибка при загрузке данных:', error);
                },
            });
        } else {
            const link = $('.paginationLink.active').last()
            let nextPage = parseInt(link.html()) + 1
            loadData(nextPage)
        }
    });

    function buttonPrice() {
        $('.button_OK').on('click', function () {
            let priceMin = $('#price-filter-min').val();
            let priceMax = $('#price-filter-max').val();
            let producer = JSON.parse(localStorage.getItem('filters_search'))
            let currentUrl = window.location.href
            if (currentUrl.includes('sub_category/notebooks')) {
                let storedData = localStorage.getItem('filters');
                let filters = storedData ? JSON.parse(storedData) : {};

                filters.priceMin = priceMin;
                filters.priceMax = priceMax;

                $('#product-list').empty();
                localStorage.setItem('filters', JSON.stringify(filters));
                loadData(1);
            } else {
                let filtersSearch = JSON.parse(localStorage.getItem('filters_search'));

                $('.container_product_list').remove();
                filtersSearch['price'] = [priceMin, priceMax]
                let updatedFilters = JSON.stringify(filtersSearch)
                localStorage.setItem('filters_search', updatedFilters);
                let queryProducer = producer.producer[0]
                searchProduct(queryProducer, 1);

                let storedData = localStorage.getItem('filters');
                let filters = storedData ? JSON.parse(storedData) : {};

                filters.priceMin = priceMin;
                filters.priceMax = priceMax;

                $('#product-list').empty();
                localStorage.setItem('filters', JSON.stringify(filters));
                loadData(1);
            }
        });
    }

    buttonPrice()

    $(".checkbox_filter_link").click(function () {
        $(this).toggleClass("checked");

        let filterName = $(this).data('filter-name');
        let filterValue = $(this).data('filter-value');

        let storedData = localStorage.getItem('filters');
        let filters = storedData ? JSON.parse(storedData) : {};

        if (!filters.hasOwnProperty(filterName)) {
            filters[filterName] = [];
        }

        if (!filters[filterName].includes(filterValue)) {
            filters[filterName].push(filterValue);
        } else {
            filters[filterName] = filters[filterName].filter(value => value !== filterValue);
        }

        if (filters[filterName].length === 0) {
            delete filters[filterName];
        }

        $('#product-list').empty();
        localStorage.setItem('filters', JSON.stringify(filters));
        loadData(1);
    });

    function loadData(choicePage = null) {
        let url = window.location.href;
        let urlParams = new URLSearchParams(window.location.search);
        let page = urlParams.get('page') || 1;
        page = choicePage !== null ? choicePage : page

        let filters = JSON.parse(localStorage.getItem('filters'))

        let newUrl = addFiltersToUrl(url, filters);
        window.history.pushState({path: newUrl}, '', newUrl);
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                page: page,
                filters: JSON.stringify(filters),
            },
            dataType: 'json',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Infinite-Scroll': 'true'
            },
            success: function (data) {
                updatePage(data);
                $(`a[href$="?page=${page}"]`).addClass('active').css({'border-color': '#3e77aa'})
                let newPage = $(`a[href$="?page=${page}"]`).html()
                let searchParams = new URLSearchParams(window.location.search);
                searchParams.set('page', newPage);
                window.history.pushState({}, '', `${decodeURIComponent(window.location.pathname)}?${decodeURIComponent(searchParams.toString())}`);
            },
        });
    }

    // window.onpopstate = function (event) {
    //     loadData();
    // };

    if (JSON.parse(localStorage.getItem('filters')) !== null) {
        $('#product-list').empty();

        loadData()

        function getFiltersFromUrl() {
            let urlParams = new URLSearchParams(window.location.search);
            let brandFilters = urlParams.getAll('brand').flatMap(brand => brand.split(','));
            let colorFilters = urlParams.getAll('color').flatMap(color => color.split(','));
            return {
                brand: brandFilters,
                color: colorFilters,
            };
        }

        let filters = getFiltersFromUrl();

        function applyFiltersState(filters) {
            $(".checkbox_filter_link").each(function () {
                let filterName = $(this).data('filter-name');
                let filterValue = $(this).data('filter-value');

                if (filters[filterName] && filters[filterName].includes(filterValue)) {
                    $(this).addClass("checked");
                }
            });
        }

        applyFiltersState(filters);
    }

    function updatePage(data) {

        if (data.products.length > 0) {
            data.products.forEach(function (product) {
                let productItem = `
                        <li class="item" data-price="${product.price}" data-image="${product.image}"
                            data-name="${product.name}" data-brand="${product.brand}" data-color="${product.color}">
                             <div style="display: flex; justify-content: center; align-items: center; position: absolute; right: 20px"
                             data-product-id=${product.id}>
                            <button class="heartButton">
                                <img src="/static/electron/images/heart.png" class="heart"
                                     alt="Heart">
                            </button>
                            <span class="wishlist-count">${product.count_like}</span>
                            </div>
                            <h4 data-product-id="${product.id}"></h4>
                            <img class="contain" src="${product.image}" alt="Card image cap">
                            <a href="http://127.0.0.1:8000/detail/${product.slug}" class="product_name">${product.name}</a>
                            <div style="display: flex; align-items: center; text-align: center; justify-content: space-between">
                                <h3 style="margin-bottom: 0; color: #f84147; font-size: 20px">${product.price}₴</h3>
                                <button class="glowing"><i class="bi bi-cart4 fa-xl" style="color:#00a046;"></i></button>
                            </div>
                            <div style="display: flex; align-items: center; text-align: center; margin-top: 10px">
                                <span style="color: #00a046; font-size: 12px;">Готов к отправке</span>
                                <i class="fa-solid fa-truck" style="color: #00a046; margin-left: 10px; width: 16px; height: 16px"></i>
                            </div>
                        </li>`;
                $('#product-list').append(productItem);
            });
        }
        updatePagination(data.amount_pages);
    }

    function updatePagination(amountPages) {
        const paginationList = $('.paginationList');
        paginationList.empty();

        for (let page = 1; page <= amountPages; page++) {
            const paginationItem = $('<li class="paginationItem" style="width: 42px; height: 41px"></li>');
            const paginationLink = $('<a class="paginationLink"></a>').attr('href', `?page=${page}`).text(page);
            paginationItem.append(paginationLink);
            paginationList.append(paginationItem);
        }
    }

    function addFiltersToUrl(url, filters) {
        let urlObject = new URL(decodeURIComponent(url));

        let priceMin = filters['priceMin'];
        let priceMax = filters['priceMax'];

        if (priceMin !== undefined && priceMax !== undefined) {
            urlObject.searchParams.set('price', `${priceMin}-${priceMax}`);
        } else {
            urlObject.searchParams.delete('price');
        }
        let brand = filters['brand'];
        let color = filters['color'];

        if (brand !== undefined) {
            let decodedBrand = decodeURIComponent(brand);
            urlObject.searchParams.set('brand', decodedBrand);
        } else {
            urlObject.searchParams.delete('brand');
        }

        if (color !== undefined) {
            let decodedColor = decodeURIComponent(color);
            urlObject.searchParams.set('color', decodedColor);
        } else {
            urlObject.searchParams.delete('color');
        }

        return decodeURIComponent(urlObject.toString());
    }

    function resetSlider() {
        let $slider = $("#slider-range");
        let priceMin = $slider.data("price-min"),
            priceMax = $slider.data("price-max");

        let initialValues = [priceMin, priceMax]

        $slider.slider({
            range: true,
            min: Math.max(priceMin, 0),
            max: priceMax,
            values: initialValues,
            slide: function (event, ui) {
                $("#price-filter-min").val(ui.values[0]);
                $("#price-filter-max").val(ui.values[1]);
            }
        });
    }

    $('#initialValue').click(function () {
        $('#price-filter-min').val(1550);
        $('#price-filter-max').val(59809);
        resetSlider()
        let storedData = localStorage.getItem('filters');
        let filters = storedData ? JSON.parse(storedData) : {};
        delete filters['priceMin']
        delete filters['priceMax']
        localStorage.setItem('filters', JSON.stringify(filters));
        $('#product-list').empty();
        loadData(1)
        localStorage.setItem('sliderValues', JSON.stringify([1550, 59809]))
    })


    const $searchInput = $('#searchInput');
    const $historyList = $('#historyList');
    const $searchHistory = $('#searchHistory');
    const $overlay = $('#overlay');

    const debouncedSearch = debounce(function (query) {
        searchFunction(query);
    }, 300);

    $historyList.on('click', '.main_search_story', function () {
        $historyList.empty();
        localStorage.removeItem('story_search')
        $overlay.hide();
    });

    $historyList.on('click', '.search_story', function (event) {
        $('.container_product_list').remove()
        localStorage.removeItem('filters_search')
        searchProduct(event.target.id)
        $searchHistory.hide();
        $overlay.hide();
    })

    $searchInput.focus(function () {
        $searchHistory.show();
        $overlay.show();
    });

    $overlay.click(function () {
        $searchHistory.hide();
        $overlay.hide();
    });

    function addToHistory(query) {
        let searchHistory = JSON.parse(localStorage.getItem('story_search')) || [];
        if (!searchHistory.includes(query) && query !== '') {
            searchHistory.push(query);
            localStorage.setItem('story_search', JSON.stringify(searchHistory));
        }
        $historyList.empty();

        const initialListItem = $('<li>', {
            class: 'main_search_story',
            html: '<span>Story search</span>' +
                '<button type="button" class="button_clear_list" id="searchButton"> Clear list</button>'
        });
        $historyList.append(initialListItem);

        searchHistory.forEach(function (historyItem) {
            const listItem = $('<li>', {
                class: 'search_story',
                text: historyItem,
                id: historyItem,
            });
            $historyList.append(listItem);
        });
    }

    addToHistory('')

    $searchInput.on('input', function () {
        if ($(this).val().length > 0) {
            $historyList.hide();
        } else {
            $historyList.show();
        }
    });

    $searchInput.keyup(debounce(e => {
        searchFunction(e.target.value);
    }, 500));


    function searchFunction(query) {
        if (!query)
            return $('.searchResults').empty()
        $.ajax({
            url: '/search/',
            type: 'GET',
            dataType: 'json',
            data: {query: query},
            success: function (data) {
                $('.searchResults').empty();
                if (data.results.length > 0) {
                    data.results.forEach(function (result) {
                        const resultItem = $('<li>', {
                            class: 'searchResults',
                        });
                        const resultLink = $('<a>', {
                            href: 'http://127.0.0.1:8000/detail/' + result.slug,
                            class: 'product_name',
                            text: result.name
                        });
                        resultItem.append(resultLink);
                        $('#blocklSearchResult').append(resultItem);
                    });

                }
            },
            error: function (error) {
                console.error('Ошибка поиска:', error);
            }
        });
    }


    function searchProduct(query, page = 1) {
        let filters = localStorage.getItem('filters_search')
        $.ajax({
            url: '/search_products/',
            type: 'GET',
            dataType: 'html',
            data: {query: query, page: page, filters: filters},
            success: function (data) {
                let tempContainer = $('<div>').html(data);
                let resultBlock = tempContainer.find('.container_product_list');
                $('.containerContent').remove()
                $('header').after(resultBlock)
                initializeSlider()
                BrandPrice()
                ArrowLeft()
                ArrowRight()
                buttonPrice()
                saveSliderValues()
                $(document).ready(restoreSliderValues);
                let producer = resultBlock.find('.checkbox_filter_link')
                producer.addClass("checked")
                $(`a[href$="?page=${page}"]`).addClass('active').css({'border-color': '#3e77aa'});
                let filterPrice = filters !== null && JSON.parse(filters).price !== undefined ? JSON.parse(filters).price : [1550, 59809]
                console.log(filterPrice)
                filterPrice = filterPrice.length > 0 ? `&priceSearch=${filterPrice[0]}-${filterPrice[1]}` : filterPrice
                history.pushState(null, null, '/search_products/' + `?text=${query}` + '&producer=' + producer.html().trim() + '&page=' + page + filterPrice);
                let filtersData = JSON.parse(filters) || {};
                filtersData.producer = [producer.html().trim()];
                localStorage.setItem('filters_search', JSON.stringify(filtersData));
            },
            error: function (error) {
                console.error(error);
            }
        });
    }

    $(document).on('click', '.button_search', function (event) {
        localStorage.removeItem('filters_search')
        const inputValue = $searchInput.val().trim();
        event.preventDefault();

        if (inputValue) {
            $('.containerContent').empty()
            $('.container_product_list').remove()
            $('#blocklSearchResult').empty()
            $searchHistory.hide();
            $overlay.hide();
            searchProduct(inputValue);
            addToHistory(inputValue);
        }
    });
    let thisPage = urlParams.has('producer')
    if (thisPage === true) {
        let queryProducer = urlParams.get('producer')
        localStorage.removeItem('filters')
        let lastPage = urlParams.get('page')
        $('.container_product_list').remove()
        searchProduct(queryProducer, parseInt(lastPage))
    }


    function detailPage(productSlug, productName, tab = '') {
        $.ajax({
            url: `/detail/${productSlug}/${tab}`,
            type: 'GET',
            dataType: 'html',
            data: {productName: productName},
            success: function (data) {
                let detailContainer = $('<div>').html(data)
                detailContainer = detailContainer.find('.detail_container')
                $('.detail_container').remove()
                $('header').after(detailContainer)
                carousel()
                tabsList()
                updateDetailData()
                reviewRating()
                avgRating()
            },
            error: function (error) {
                console.error('Ошибка поиска:', error);
            }
        });
    }


    function carousel() {
        let carousel = $('.carousel .product-image-list');
        carousel.slick({
            autoplay: false,
            autoplaySpeed: 2000,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            fade: true
        });

        function goToSlide(slideIndex) {
            carousel.slick('slickGoTo', slideIndex);
        }

        window.goToSlide = goToSlide;

        $('.slick-prev').click(function () {
            carousel.slick('slickPrev');
        });

        $('.slick-next').click(function () {
            carousel.slick('slickNext');
        });
    }

    carousel()

    function tabsList() {
        let tabs__list = $('.tabs__list')

        tabs__list.on('click', '.tabs__link', function (e) {
            e.preventDefault()
            let slug = tabs__list.data('product-slug')
            let productName = tabs__list.data('product-name')
            let tab = $(this).parent().data('tab')
            detailPage(slug, productName, tab)
            history.pushState(null, null, e.target.href)
        })
    }

    tabsList()

    let container_product_list = $('.container_product_list')
    container_product_list.on('click', '.product_name', function (e) {
        e.preventDefault()
        let currentUrl = e.target.href
        let segments = currentUrl.split('/');
        let slug = segments[segments.length - 2];
        let productName = $(this).html()
        container_product_list.remove()
        detailPage(slug, productName)
        history.pushState(null, null, e.target.href)
    })


    function updateDetailData() {
        let productItem = $('.product-image-item')
        let productId = productItem.data('product-id')
        let checkDetailData = JSON.parse(localStorage.getItem('data'))
        if (!checkDetailData || !checkDetailData.hasOwnProperty(productId)) {
            $('.checkProduct').hide()
            $('.glowingDetail').show()
        } else {
            $('.glowingDetail').hide()
            $('.DeatailBuyProduct').show();
            $('.checkProduct').on('click', function () {
                $('#cart-items').slideToggle()
            })
        }
    }

    updateDetailData();

    $(document).on('click', '.glowingDetail', function () {
        let data = JSON.parse(localStorage.getItem('data'))
        let carousel = $('.carousel')
        let name = carousel.find('[data-name]').data('name')
        let price = carousel.find('[data-price]').data('price')
        let image = carousel.find('[data-image]').data('image')
        let id = carousel.find('[data-product-id]').data('product-id')
        const sub = `<span class='sub' id='${id}'>-</span>`
        const add = `<span class='add' id='${id}'>+</span>`
        const remove = `<button id='${id}' class='remove'> X </button>`;
        let order = `<li>${name} - <span>${price}</span>
        ${sub}<span id='quantity' data-product-id='${id}'>
        1 </span>
        ${add}${remove}</li>`;
        $("#list-item").append(order);
        let product = {id: {name, price, image, quantity: 1}}
        data[id] = product.id

        let totalPrice = localStorage.getItem('totalPrice') === null ? 0 :
            JSON.parse(localStorage.getItem('totalPrice'))

        let count = localStorage.getItem('count')
        count = count ? count : 0
        count = parseInt(count) + 1
        totalPrice += price

        $("#items-basket").text(count);
        $("#total-price").text(totalPrice + "$");
        if (count > 0) {
            $("#checkout-button").text("Оформление заказа")
        }
        localStorage.setItem('data', JSON.stringify(data))
        localStorage.setItem('count', JSON.stringify(count))
        localStorage.setItem('totalPrice', totalPrice)
        $('.glowingDetail').hide()
        $('.checkProduct').show()
        $('.checkProduct').on('click', function () {
            $('#cart-items').slideToggle()
        })
        removeCartItem()
        subDetailItem()
        addDetailItem()
    })
    let productId = $('.carousel').find('[data-product-id]').data('product-id')
    let option = $(`#id_product option[value="${productId}"]`);
    if (option.length) {
        $('#id_product').val(option.val())
    }

    $(document).on('click', '.modalReviewClose, .modal_background_successDeleteAcc, .modal__close, .modal_background, .modal_background_login, .modal_background_registration, .modal_background_success', function (e) {
        e.preventDefault()
        $('.reviewWrapper').hide()
        $('.reviewWrapperSuccess').hide()
        $('.loginWrapper').hide()
        $('.registrationWrapper').hide()
        $('.editNameWrapper').hide()
        $('.deleteAccountWrapperSuccess').hide()
        $('#loginForm').validate().resetForm()
        $('#registrationForm').validate().resetForm()
        $('#loginForm').find('.error-border').removeClass('error-border');
        $('#registrationForm').find('.error-border').removeClass('error-border');
    })

    $(document).on('click', '.user', function () {
        $('.loginWrapper').css({'display': 'flex'})
        $('#id_email').val('')
        $('#id_phone_number').val('')
    })

    $(document).on('click', '#buttonChoiceRegistration', function () {
        $('.loginWrapper').css({'display': 'none'})
        $('.registrationWrapper').css({'display': 'flex'})
        let modalHeaderRegistration = $('.modalHeaderRegistration');
        let scrollTop = modalHeaderRegistration.scrollTop()
        modalHeaderRegistration.scrollTop(0)
        $('#id_email').val('')
        $('#id_phone_number').val('')
        $('#id_name').val('')
        $('#id_last_name').val('')
        $('#id_password2').val('')
    })

    $(document).on('click', '#buttonChoiceLogin', function () {
        $('.registrationWrapper').css({'display': 'none'})
        $('.loginWrapper').css({'display': 'flex'})
    })

    $(document).on('click', '.reviewButton', function () {
        $('#id_text').val('')
        $('#id_rating').val('')
        $('.star').removeClass('selected').css({'color': '#d2d2d2'})
        let reviewWrapper = $('.reviewWrapper');
        reviewWrapper.show();
        reviewWrapper.css({'display': 'flex'});
        let productId = $('.carousel').find('[data-product-id]').data('product-id')
        let option = $(`#id_product option[value="${productId}"]`);
        if (option.length) {
            $('#id_product').val(option.val())
        }
    });

    $(document).on('click', '.modalReviewAdd', function (e) {
        e.preventDefault()
        let formData = $('#reviewForm').serialize();
        let currentUrl = window.location.href
        $.ajax({
            type: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            url: currentUrl,
            data: formData,
            success: function (data) {
                let tempElement = $('<div>');
                tempElement.html(data);
                let status = tempElement.find('.productReviews').data('response')
                let updateBlockDetail = $('.updateBlockDetail')
                if (status === 200) {
                    updateBlockDetail.empty();
                    updateBlockDetail.html(tempElement.find('.updateBlockDetail').html());
                    $('#id_text').val('');
                    $('.checkProduct').hide()
                    $.ajax({
                        type: 'GET',
                        url: currentUrl,
                        success: function (data) {
                            let tempElement = $('<div>');
                            tempElement.html(data);
                            let avg_Rating = $('.avgRating')
                            data = $(data).find('.avgRating')
                            avg_Rating.replaceWith(data)
                            avgRating()
                            $('body').find('.reviewWrapper').html(tempElement.find('.reviewWrapper').html())
                            reviewRating()
                            $('body').css({'overflow-y': 'scroll'})
                        }
                    })
                    $('.reviewWrapperSuccess').css({'display': 'flex'})
                } else {
                    updateBlockDetail.find('.reviewWrapper').html(tempElement.find('.reviewWrapper').html())
                    $('.checkProduct').hide()
                    $('#id_text').css({
                        'border-color': '#f84147',
                        'background': `url(/static/electron/images/warning.png) center right no-repeat`,
                        'background-size': '20px 20px',
                        'background-position': 'calc(100% - 12px) center'
                    })
                }
            },
            error: function (error) {
                console.log('Error:', error);
            }
        });
    })


    $(document).on('click', '.hide', function () {
        let passwordInput = $(this).parent().find('input[type="password"]');
        passwordInput.attr('type', 'text');
        $(this).find('.hideWindow').css({'display': 'none'})
        $(this).find('.visibleWindow').css({'display': 'block'})
        $(this).removeClass('hide').addClass('visible')
    });

    $(document).on('click', '.visible', function () {
        let passwordInput = $(this).parent().find('input[type="text"]');
        passwordInput.attr('type', 'password');
        $(this).find('.hideWindow').css({'display': 'block'})
        $(this).find('.visibleWindow').css({'display': 'none'})
        $(this).removeClass('visible').addClass('hide')
    });

    $(document).on('click', '#buttonLogin', function (event) {
        event.preventDefault();
        const dataForm = $('#loginForm').serialize()
        if ($('#loginForm').valid()) {
            $.ajax({
                type: 'POST',
                url: '/login/',
                data: dataForm,
                success: function (data) {
                    if ($(data).find('#logout').length) {
                        const user = $('.user')
                        let leftPartContent = $(data).find('.leftPartContent');
                        let cabinetUser = $(data).find('.cabinet__user');
                        $('.leftPartContent').replaceWith(leftPartContent)
                        $('.cabinet__user').replaceWith(cabinetUser)
                        $('.loginWrapper').remove()
                        reviewRating()
                        avgRating()
                        user.hide()
                    }
                },
            });
        }
    });

    function redirectHomePage() {
        $.ajax({
            type: 'GET',
            url: '/',
            success: function (data) {
                let detailContainer = $('<div>').html(data)
                let catalogWrapper = detailContainer.find('.catalogWrapper')
                let cabinet__user = detailContainer.find('.cabinet__user')
                detailContainer = detailContainer.find('.header').next('div, ul')
                $('body').find('.header').next('div, ul').replaceWith(detailContainer)
                $('body').find('.catalogWrapper').replaceWith(catalogWrapper)
                $('body').find('.cabinet__user').replaceWith(cabinet__user)
                history.pushState(null, null, '/');
            }
        })
    }

    $(document).on('click', '#logout, #cabinetLogout', function (event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/logout/',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            success: function (data) {
                setTimeout(function () {
                    let updateBlockDetail = $(data).find('.updateBlockDetail')
                    $('.updateBlockDetail').replaceWith(updateBlockDetail)
                    let cabinetUser = $(data).find('.cabinet__user');
                    $('.cabinet__user').replaceWith(cabinetUser)
                    $('.loginWrapper').remove()
                    $('.registrationWrapper').remove()
                    let loginWrapper = $(data).find('.loginWrapper')
                    let registrationWrapper = $(data).find('.registrationWrapper')
                    const user = $('.user')
                    user.after(loginWrapper)
                    $('.loginWrapper').after(registrationWrapper)
                    reviewRating()
                    avgRating()
                    user.show()
                    $('.checkProduct').css({'display': 'none'})
                    redirectHomePage()
                    initializeValidation()
                }, 500);
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });

    $(document).on('click', '#buttonRegistration', function (event) {
        event.preventDefault();
        const dataForm = $('#registrationForm').serialize()
        if ($('#registrationForm').valid()) {
            $.ajax({
                type: 'POST',
                url: '/register/',
                data: dataForm,
                success: function (data) {
                    if ($(data).find('#logout').length) {
                        const user = $('.user')
                        let leftPartContent = $(data).find('.leftPartContent');
                        $('.leftPartContent').replaceWith(leftPartContent)
                        let cabinetUser = $(data).find('.cabinet__user');
                        $('.cabinet__user').replaceWith(cabinetUser)
                        $('.registrationWrapper').css({'display': 'none'})
                        $('.loginWrapper').remove()
                        reviewRating()
                        avgRating()
                        user.hide()
                    }
                },
            });
        }
    });
    $(document).on("mouseenter", ".star", function () {
        let value = parseInt($(this).attr("data-value"));
        $(".star").removeClass("orange");
        $(".star[data-value]").each(function () {
            if (parseInt($(this).attr("data-value")) <= value) {
                $(this).addClass("orange");
            }
        });
    });

    $(document).on("mouseleave", ".star", function () {
        $(".star").removeClass("orange");
    });

    $(document).on("click", ".star", function () {
        let value = parseInt($(this).attr("data-value"));
        $(".star").removeClass("selected");
        $(this).addClass("selected");
        $("#id_rating").val($(this).data('value'))
        resetStars();
        highlightStars(value);
    });

    function resetStars() {
        $(".star").css("color", "#d2d2d2");
    }

    function highlightStars(value) {
        $(".star:lt(" + value + ")").css("color", "orange");
    }

    function reviewRating() {
        $('.review_rating').each(function () {
            let rating = parseFloat($(this).data('review-mark'));

            $(this).find('.review_star').each(function (index) {
                if (index < rating) {
                    $(this).css('color', '#ffa900');
                } else {
                    $(this).css('color', '#d2d2d2');
                }
            });
        });
    }

    function avgRating() {
        const rating = $("#rating")
        $(function () {
            rating.rateYo({
                rating: 5,
                starWidth: "30px",
                numStars: 5,
                precision: 1,
                minValue: 0,
                maxValue: 5,
                fullStar: true,
                ratedFill: "#ffa900",
                normalFill: "#d2d2d2",
                readOnly: true
            });
            let avg_rating = rating.data('avg_rating')
            rating.rateYo("rating", avg_rating);
        });
    }

    reviewRating()
    avgRating()
    if ($('#logout').length > 0) {
        $('.user').hide();
    }

    $(document).on("click", ".burger-icon", function () {
        const userAccountWrapper = $('.userAccountWrapper')
        userAccountWrapper.css({opacity: 0});
        $("#userAccount").toggleClass("active");
        userAccountWrapper.show().animate({opacity: 1}, 300)
        $(".burger-icon").hide();
    })

    $(document).on("click", ".closeCabinet, .modal_background_userAccount, #logout", function () {
        $("#userAccount").toggleClass("active");
        $(".burger-icon").show();
        $('.userAccountWrapper').animate({opacity: 0}, 500)
        setTimeout(function () {
            $('.userAccountWrapper').hide()
        }, 500);
    });

    $(document).on('click', '.user__info', function (e) {
        e.preventDefault()
        $("#userAccount").toggleClass("active");
        $(".burger-icon").show();
        $('.userAccountWrapper').animate({opacity: 0}, 500)
        $('body').css({'overflow-y': 'scroll'})
        setTimeout(function () {
            $('.userAccountWrapper').hide()
        }, 500);
        $.ajax({
            type: 'GET',
            url: '/cabinet/personal-information',
            success: function (data) {
                let changeComponent = $('<div>').html(data)
                $('.header').next().remove()
                $('.header').next().replaceWith(changeComponent.find('.container-personal__cabinet'))
                $('.container-personal__cabinet').next().replaceWith(changeComponent.find('.changePassWrap'))
                $('.changePassWrap').next().replaceWith(changeComponent.find('.changePassWrapperSuccess'))
                history.pushState(null, null, '/cabinet/personal-information');
                checkInput()
            },
            error: function (xhr, errmsg, err) {
                console.log('Ошибка при обновлении профиля:', errmsg);
            }
        });
    })

    $(document).on('click', '.buttonLoginCabinet, .buttonRegistrationCabinet, .side-menu__button__catalog, .side-menu__button__shop-cart', function () {
        $("#userAccount").toggleClass("active");
        $('body').css({'overflow': 'auto'});
        $(".burger-icon").show();
        $('.userAccountWrapper').animate({opacity: 0}, 500)
        if ($(this).hasClass('buttonLoginCabinet')) {
            $('.loginWrapper').css({'display': 'flex', 'z-index': '50'})
        } else if ($(this).hasClass('side-menu__button__catalog')) {
            $(".menuCategory li:first-child").addClass('active')
            $('.catalog').find('img').attr('src', '/media/images/redclose.png')
            const catalogWrapper = $('.catalogWrapper')
            catalogWrapper.css({'display': 'flex', 'opacity': 0})
            catalogWrapper.animate({opacity: 1}, 500)
        } else if ($(this).hasClass('side-menu__button__shop-cart')) {
            $("#cart-items").slideToggle();
        } else if ($(this).hasClass('buttonRegistrationCabinet')) {
            $('.registrationWrapper').css({'display': 'flex', 'z-index': '50'})
        }
        setTimeout(function () {
            $('.userAccountWrapper').hide()
        }, 500);
    })

    $(document).on('click', '.catalog', function () {
        $(".subcategory_list").hide()
        $(".subcategory_list").each(function () {
            if ($(this).data("category") === $(".menuCategory li:first-child a span").text()) {
                $(this).show();
            }
        });
        if ($(this).find('img').attr('src') === '/media/images/redclose.png') {
            $('.catalog').find('img').attr('src', '/media/images/category.png')
            $('.catalogWrapper').animate({opacity: 0}, 500)
            setTimeout(function () {
                $('.catalogWrapper').css({'display': 'none'})
            }, 500);
        } else {
            $(".menuCategory li:first-child").addClass('active')
            $(this).find('img').attr('src', '/media/images/redclose.png')
            const catalogWrapper = $('.catalogWrapper')
            catalogWrapper.css({'display': 'flex', 'opacity': 0})
            catalogWrapper.animate({opacity: 1}, 500)
        }
    })

    $(document).on("mouseenter", ".category_list", function () {
        let hoverCategory = $(this);
        $(".category_list").removeClass("active");
        $(this).addClass("active");
        $(".subcategory_list").hide();
        $(".subcategory_list").each(function () {
            if ($(this).data("category") === hoverCategory.find('span').text()) {
                $(this).show();
            }
        });
    });

    $(document).on("mouseleave", ".category_list", function () {
        $(".category_list").not(this).removeClass("active");
    });

    $(document).on('click', '.modal_background_catalog', function () {
        $('.catalogWrapper').animate({opacity: 0}, 500)
        $('.catalog').find('img').attr('src', '/media/images/category.png')
        setTimeout(function () {
            $('.catalogWrapper').css({'display': 'none'})
        }, 500);
    })

    $(document).on('click', '.personal-section__header', function () {
        $(this).next('.personal-section__body').toggle();
        $(this).find("img:eq(1)").toggleClass("rotated");
    });

    $(".login__edit").hover(
        function () {
            $(this).find('.changeLogin').css({background: "url(/media/images/rededit.png) center no-repeat"});
        },
        function () {
            $(this).find('.changeLogin').css({background: "url(/media/images/edit.png) center no-repeat"});
        }
    );
    $(document).on("click", ".cabinet-navigation__item", function () {
        if ($(this).find('#user-cabinet__cart').length) {
            $("#cart-items").slideToggle();
        }
    });
    $(document).on('click', '#changePassword', function () {
        $('.changePassWrap').css({'opacity': '0'})
        $('.changePassWrap').css({'display': 'flex'}).animate({opacity: 1}, 500)
    })

    $(document).on('click', '.modal__close, .modal_background_changePass, .cancelChangePassword', function () {
        $('.changePassWrap').animate({opacity: 0}, 500)
        setTimeout(function () {
            $('form input:not([name="csrfmiddlewaretoken"]), form textarea').val('');
            $('.changePassWrap').hide()
        }, 500);
    })

    $(document).on('click', '.saveNewPassword', function (event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/change-password/',
            data: $('#changePasswordForm').serialize(),
            success: function (response) {
                if (response.success) {
                    $('.changePassWrap').hide()
                    $('form input, form textarea').val('');
                    $('.changePassWrapperSuccess').css({'display': 'flex'})
                    $('.modal__close, .modal_background_successChangePass').on('click', function () {
                        $('.changePassWrapperSuccess').css({'opacity': '1'})
                        $('.changePassWrapperSuccess').animate({opacity: 0}, 500)
                        setTimeout(function () {
                            $('.changePassWrapperSuccess').hide()
                        }, 500);
                    })
                } else {
                    // Обработка ошибок формы
                }
                console.log(response)
            },
            error: function (xhr, status, error) {
            }
        });
    })

    $(document).on('click', '#deleteAccount', function (event) {
        event.preventDefault()
        $.ajax({
            url: '/delete-account/',
            type: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            success: function (data) {
                $('.deleteAccountWrapperSuccess').css({'display': 'flex'})
                let detailContainer = $('<div>').html(data)
                let catalogWrapper = detailContainer.find('.catalogWrapper')
                let cabinet__user = detailContainer.find('.cabinet__user')
                detailContainer = detailContainer.find('.header').next('div, ul')
                $('body').find('.header').next('div, ul').replaceWith(detailContainer)
                $('body').find('.catalogWrapper').replaceWith(catalogWrapper)
                $('body').find('.cabinet__user').replaceWith(cabinet__user)
                $('.loginWrapper').remove()
                $('.registrationWrapper').remove()
                let loginWrapper = $(data).find('.loginWrapper')
                let registrationWrapper = $(data).find('.registrationWrapper')
                const user = $('.user')
                user.after(loginWrapper)
                $('.loginWrapper').after(registrationWrapper)
                $('.user').show()
                history.pushState(null, null, '/');
            },
            error: function (xhr, status, error) {
                // Обработка ошибки
            }
        });
    })

    $(document).on('click', '.personal-data__edit', function () {
        $('#notChangeData').hide()
        $('#ChangeUserProfileData').show()
    })

    $(document).on('click', '.login__data__edit', function () {
        $('#ContactsUser').hide()
        $('#ChangeContactsUser').show()
    })

    $(document).on('click', '.cancelChangePersonalData', function () {
        $('.validation_type_error ').show()
        $('#ChangeUserProfileData input[type="text"]').val('');
        $('#ChangeUserProfileData input[type="date"]').val('');
        $('#ChangeContactsUser input[type="email"]').val('');
        $('#ChangeContactsUser input[type="tel"]').val('');
        $('#ChangeUserProfileData select').val('');
        $('#ChangeUserProfileData').hide()
        $('#ChangeContactsUser').hide()
        $('#ContactsUser').show()
        $('#notChangeData').show()
        showError($('#id_change_last_name'))
        showError($('#id_change_name'))
        showError($('#id_change_email'))
        showError($('#id_change_phone_number'))
    })

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhoneNumber(phoneNumber) {
        const phoneRegex = /^\+?(\d{1,3})?[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;
        return phoneRegex.test(phoneNumber);
    }

    function checkInput() {
        let lastName = $('#id_change_last_name');
        let name = $('#id_change_name');
        let email = $('#id_change_email');
        let phoneNumber = $('#id_change_phone_number');

        if (lastName.length && name.length && email.length && phoneNumber.length) {
            if (lastName.val().length >= 2 && name.val().length >= 2) {
                $('.personal-data__save').prop('disabled', false);
            } else {
                $('.personal-data__save').prop('disabled', true);
            }

            if (validateEmail(email.val()) && validatePhoneNumber(phoneNumber.val())) {
                $('.contacts__save').prop('disabled', false);
            } else {
                $('.contacts__save').prop('disabled', true);
            }
        }
    }

    $(document).on('input', '#id_change_last_name, #id_change_name, #id_change_email, #id_change_phone_number', function () {
        checkInput();

        let id = $(this).attr('id');
        let inputValue = $(this).val();

        if ((id === 'id_change_last_name' || id === 'id_change_name') && inputValue.length < 2) {
            showError($(this));
        } else if (id === 'id_change_email' && !validateEmail(inputValue)) {
            showError($(this));
        } else if (id === 'id_change_phone_number' && !validatePhoneNumber(inputValue)) {
            showError($(this));
        } else {
            hideError($(this));
        }
    });

    function showError(element) {
        element.next().show();
        element.css({
            'border': '1px solid #f84147',
            'background': 'url(/media/images/warning.png) right 12px center no-repeat'
        });
    }

    function hideError(element) {
        element.css({'border': '1px solid #d2d2d2', 'background': 'none'});
        element.next().hide();
    }

    checkInput()

    $(document).on('click', '.personal-data__save', function (event) {
        event.preventDefault();

        let formData = $('#ChangeUserProfileData').serialize();
        formData = formData.replace(/[^=&]+=(&|$)/g, '');

        $.ajax({
            type: 'POST',
            url: '/cabinet/personal-information',
            data: formData,
            success: function (data) {
                let changeComponent = $('<div>').html(data)
                $('#notChangeData').replaceWith(changeComponent.find('#notChangeData'))
                $('#ChangeUserProfileData input[type="text"]').val('');
                $('#ChangeUserProfileData input[type="date"]').val('');
                $('#ChangeUserProfileData select').val('');
                $('#ChangeUserProfileData').hide()
                $('#notChangeData').show()
                $('.validation_type_error').show()
                showError($('#id_change_last_name'))
                showError($('#id_change_name'))
                checkInput()
            },
            error: function (xhr, errmsg, err) {
                console.log('Ошибка при обновлении профиля:', errmsg);
            }
        });
    })

    $(document).on('click', '.contacts__save', function (event) {
        event.preventDefault();
        let formData = $('#ChangeContactsUser').serialize();
        formData = formData.replace(/[^=&]+=(&|$)/g, '');
        $.ajax({
            type: 'POST',
            url: '/cabinet/personal-information',
            data: formData,
            success: function (data) {
                let changeComponent = $('<div>').html(data)
                $('#ContactsUser').replaceWith(changeComponent.find('#ContactsUser'))
                $('#ChangeContactsUser input[type="email"]').val('');
                $('#ChangeContactsUser input[type="tel"]').val('');
                $('#ChangeContactsUser').hide()
                $('#ContactsUser').show()
                $('.validation_type_error').show()
                showError($('#id_change_email'))
                showError($('#id_change_phone_number'))
                checkInput()
            },
            error: function (xhr, errmsg, err) {
                console.log('Ошибка при обновлении профиля:', errmsg);
            }
        });
    })

    $(document).on('click', '#myReviews', function (event) {
        event.preventDefault();
        $.ajax({
            type: 'GET',
            url: '/cabinet/reviews',
            success: function (data) {
                let changeComponent = $('<div>').html(data)
                $('#cabinet-content').replaceWith(changeComponent.find('#cabinet-content'))
                reviewRating()
                history.pushState(null, null, '/cabinet/reviews');
            },
            error: function (xhr, errmsg, err) {
                console.log('Ошибка при обновлении профиля:', errmsg);
            }
        });
    })

    $(document).on('click', '.cabinet-user__link', function (event) {
        event.preventDefault();
        $.ajax({
            type: 'GET',
            url: '/cabinet/personal-information',
            success: function (data) {
                let changeComponent = $('<div>').html(data)
                $('#cabinet-content').replaceWith(changeComponent.find('#cabinet-content'))
                reviewRating()
                history.pushState(null, null, '/cabinet/personal-information');
                checkInput()
            },
            error: function (xhr, errmsg, err) {
                console.log('Ошибка при обновлении профиля:', errmsg);
            }
        });
    })

    $(document).on('click', '.pagination a', function (e) {
        e.preventDefault();
        let url = $(this).attr('href');
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'html',
            success: function (data) {
                let changeComponent = $('<div>').html(data)
                $('#cabinet-content').replaceWith(changeComponent.find('#cabinet-content'))
                reviewRating()
                history.pushState(null, null, '/cabinet/reviews' + url);
            },
            error: function (xhr, errmsg, err) {
                console.log('Error:', errmsg);
            }
        });
    });

    $(document).on('click', '.heartButton', function (e) {
        let productId = $(this).parent().data('product-id');
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/wishlist/add/',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            data: {
                'product_id': productId
            },
            success: function (data) {
                let detailItem = $(e.target).closest('[data-product-id]')
                if (detailItem.length > 0) {
                    detailItem.find('.wishlist-count').text(data.count);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.error('Error:', errorThrown);
            }
        });
    });

    $(document).on('click', function (event) {
        let className = event.target.className
        let modalEditName = $(event.target).closest('.modalEditName').attr('class')
        if (className === 'cancelChangeEditName' || className === 'modal__close' || className === 'edit-name__save') {
            $('.dropdown-css__container').hide()
        } else if (event.target.id === 'dropdown_wishlist' || className === 'rename_wishlist' || modalEditName === 'modalEditName') {
            $('.dropdown-css__container').show();
        } else {
            $('.dropdown-css__container').hide();
        }
    });


    $(document).on('click', ".checkbox_selectItem", function () {
        $(this).toggleClass("checked");
        let allUnchecked = $('.checkbox_selectItem').not('.checked').length === $('.checkbox_selectItem').length;
        let allChecked = $('.checkbox_selectItem').filter('.checked').length === $('.checkbox_selectItem').length;
        $('.removeAllProducts').prop('disabled', allUnchecked);

        if (allUnchecked) {
            $('.resetAllProducts').hide();
            $('.choiceAllProducts').show();
        } else if (allChecked) {
            $('.choiceAllProducts').hide();
            $('.resetAllProducts').show();
        } else {
            $('.resetAllProducts').hide();
            $('.choiceAllProducts').show();
        }
    });

    $(document).on('click', ".choiceAllProducts", function () {
        $('.choiceAllProducts').hide();
        $('.resetAllProducts').show();
        $('.checkbox_selectItem').addClass('checked');
        $('.removeAllProducts').prop('disabled', false);
    });

    $(document).on('click', ".resetAllProducts", function () {
        $('.resetAllProducts').hide();
        $('.choiceAllProducts').show();
        $('.checkbox_selectItem').removeClass('checked');
        $('.removeAllProducts').prop('disabled', true);
    });
    $(document).on('click', '.rename_wishlist', function () {
        $('.editNameWrapper').css({'display': 'flex'})
        $('#inputEditName').val($('.wish-details__heading').html())
    })

    $(document).on('input', '#inputEditName', function () {
        let inputValueLength = $(this).val();
        let headingLength = $('.wish-details__heading').text();

        if (inputValueLength !== headingLength) {
            $('.edit-name__save').prop('disabled', false);
        } else {
            $('.edit-name__save').prop('disabled', true);
        }
    });

    $(document).on('click', '.cancelChangeEditName, .modal_background_editName', function () {
        $('.editNameWrapper').hide()
    })

    $(document).on('click', '.removeAllProducts', function (event) {
        event.preventDefault()
        let selectedItemsIds = $('.checkbox_selectItem.checked').map(function () {
            return $(this).data('item-id');
        }).get();

        let itemsToRemove = $('.item').has('.checkbox_selectItem.checked');
        itemsToRemove.remove()

        $.ajax({
            url: '/wishlist/remove-selected/',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            type: 'DELETE',
            data: {selected_items: selectedItemsIds},
            success: function (response) {
                if ($('.item').length === 0) {
                    $('.removeAllProducts').prop('disabled', true)
                    $('.choiceAllProducts').show()
                    $('.resetAllProducts').hide()
                    $('.wish-details__actions').hide();
                    $('.wish-list__empty').show();
                }
            },
        });
    });
    if ($('.item').length === 0) {
        $('.wish-details__actions').hide();
        $('.wish-list__empty').show();
    }
    $(document).on('click', '.edit-name__save', function () {
        $('.wish-details__heading').html($('#inputEditName').val())
        $('.editNameWrapper').hide()
        $(this).prop('disabled', true)
    })

    $(document).on('click', '#wishList', function (event) {
        event.preventDefault();
        $.ajax({
            type: 'GET',
            url: '/cabinet/wishlist',
            success: function (data) {
                let changeComponent = $('<div>').html(data)
                $('#cabinet-content').replaceWith(changeComponent.find('#cabinet-content'))
                if ($('.item').length === 0) {
                    $('.wish-details__actions').hide();
                    $('.wish-list__empty').show();
                }
                history.pushState(null, null, '/cabinet/wishlist');
            },
        });
    })

})

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


$(document).on("click", '.button-apply', function () {
    $('.deliveries-city').removeClass('error-border').next().hide()
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
})


const region_location = $('.region-location')

$('.region').text(localStorage.getItem('location'))
region_location.val(localStorage.getItem('location'))


$(document).on('input', '.region-location', function () {
    setTimeout(function () {
        $('.region-post-office').show();
    }, 500);
})

$(document).on('click', function (event) {
    let regionPostOffice = event.target.className
    let location = localStorage.getItem('location')
    if (regionPostOffice !== 'region-location') {
        $('.region-post-office').hide()
        $('.region-location').val(location)
    }
})

$(document).on('click', function (event) {
    let targetClass = $(event.target).closest('.search-post-office, .search-delivery').attr('class');
    if (targetClass === 'search-post-office') {
        $('.post-office').toggle();
    } else if (targetClass === 'search-delivery') {
        $('.post-office').show();
    } else {
        $('.post-office').hide();
    }
});
body_content.on("click", '.autocomplete-item', function () {
    $('.button-choice-place').removeClass('error-border')
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
        return $('.region-post-office-list li').remove()
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
            $('.region-post-office-list li').remove()
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
$('#formOrder').submit(function (e) {
    e.preventDefault();
    if ($("#formOrder").valid()) {
        let name = $('input[name="firstname"]').val()
        let lastName = $('input[name="lastname"]').val()
        let email = $('input[name="email"]').val()
        let phoneNumber = $('input[name="phone_number"]').val()
        userData = {'email': email, 'last_name': lastName, 'name': name, 'phone_number': phoneNumber}
        const location = $('#location').text()
        const postOfficeAddress = $('#postOfficeAddress').text()
        const amount = $('#amount').text()
        let orderItems = JSON.parse(localStorage.getItem('data'))
        let orIt = {}
        for (let i in orderItems) {
            orIt[i] = {'quantity': orderItems[i].quantity}
        }

        let formData = {
            'location': location,
            'postOfficeAddress': postOfficeAddress,
            'amount': amount,
            'orderItems': orIt
        }
        localStorage.setItem('order', JSON.stringify(formData))
        $(this).css({'display': 'none'})
        let selectPersonInfo = $('.personInfo')
        if (selectPersonInfo.is(':empty')) {
            selectPersonInfo.css({'border': '1px solid #00a046', 'padding': '10px 0'}).append(`<i class="bi fa-2x bi-person-circle" id="personCircle"></i>
         <div class="userInfo"><div><span> ${userData.name} ${userData.last_name}</span></div>
         <div><span>${userData.email}</span></div></div>
         <div style="margin-left: auto; margin-right: 10%"><span>${userData.phone_number}</span></div>
         <i class="bi fa-lg bi-pencil" id="pencilEdit"></i>`)
        } else {
            $('.blockPersonInfo').css({'display': 'block'})
            selectPersonInfo.empty()
            selectPersonInfo.css({'border': '1px solid #00a046', 'padding': '10px 0'}).append(`<i class="bi fa-2x bi-person-circle" id="personCircle"></i>
         <div class="userInfo"><div><span> ${userData.name} ${userData.last_name}</span></div>
         <div><span>${userData.email}</span></div></div>
         <div style="margin-left: auto; margin-right: 10%"><span>${userData.phone_number}</span></div>
         <i class="bi fa-lg bi-pencil" id="pencilEdit"></i>`)
        }
        localStorage.setItem('userData', JSON.stringify(userData))
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


function initializeValidation() {
    $('#loginForm').validate(
        {
            rules: {
                username: {
                    required: true,
                    email: true
                },
                password: "required"
            },
            messages: {
                username: "Введите ваш адрес электронной почты",
                password: "Введите ваш пароль",
            },
            errorClass: "input-error",
            errorElement: "span",
            highlight: function (element) {
                $(element).addClass("error-border");
            },
            unhighlight: function (element) {
                $(element).removeClass("error-border");
            },
            errorPlacement: function (error, element) {
                if (element.is(":input[name='password']")) {
                    error.insertAfter(".passwordField");
                } else {
                    error.insertAfter(element);
                }
            }
        })

    $('#registrationForm').validate(
        {
            rules: {
                email: {
                    required: true,
                    email: true
                },
                name: "required",
                last_name: "required",
                phone_number: {
                    required: true,
                    minlength: 10,
                    digits: true
                },
                password1: "required",
                password2: "required",
            },
            messages: {
                email: "Введите ваш адрес электронной почты",
                name: "Введите ваше имя",
                last_name: "Введите вашу фамилию",
                phone_number: "Введите ваш номер телефона",
                password1: "Введите ваш пароль",
                password2: "Подтвердите ваш пароль",
            },
            errorClass: "input-error",
            errorElement: "span",
            highlight: function (element) {
                $(element).addClass("error-border");
            },
            unhighlight: function (element) {
                $(element).removeClass("error-border");
            },
            errorPlacement: function (error, element) {
                if (element.is(":input[name='password1']")) {
                    error.insertAfter(".password1Field"); // Вставить ошибку после поля password1
                } else if (element.is(":input[name='password2']")) {
                    error.insertAfter(".password2Field"); // Вставить ошибку после поля password2
                } else {
                    error.insertAfter(element);
                }
            }
        })

    $("#formOrder").validate({
        rules: {
            firstname: "required",
            lastname: "required",
            email: {
                required: true,
                email: true
            },
            phone_number: {
                required: true,
                minlength: 10,
                digits: true
            }
        },
        messages: {
            firstname: "Введите ваше имя",
            lastname: "Введите вашу фамилию",
            email: {
                required: "Введите ваш адрес электронной почты",
                email: "Введите корректный адрес электронной почты"
            },
            phone_number: {
                required: "Введите ваш номер телефона",
                minlength: "Введите не менее 10 цифр",
                digits: "Введите только цифры"
            }
        },
        errorClass: "input-error", // Класс, который будет добавляться к невалидному полю
        errorElement: "span", // Элемент, который будет создаваться для отображения сообщений об ошибке
        highlight: function (element) {
            $(element).addClass("error-border");
        },
        unhighlight: function (element) {
            $(element).removeClass("error-border");
        }
    });
}

initializeValidation()

$('.button-checkout').on('click', function (e) {
    e.preventDefault();
    let order = localStorage.getItem('order')
    let data = {
        formData: $('#formOrder').serialize(),
        order: order,
    };
    $.ajax({
        url: 'http://127.0.0.1:8000/checkout',
        type: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        data: data,
        success: function (response) {
            console.log('success')
            localStorage.clear();
            $('.wrap-modal-success').show()
            $('#button-OK, .wrap-modal-success').on('click', function () {
                window.location.href = '/';
            })
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('.wrap-modal-error').css({'display': 'block'})
            $('#button-Error, .wrap-modal-error').on('click', function () {
                $('.wrap-modal-error').css({'display': 'none'})
            })
            const location = $('#location').text()
            const postOfficeAddress = $('#postOfficeAddress').text()
            if (!location.trim()) {
                const deliveriesCity = $('.deliveries-city')
                deliveriesCity.addClass('error-border').css({'background-position': 'center right 120px'})
                deliveriesCity.next().show()
            }
            if (!postOfficeAddress.trim() || postOfficeAddress.trim() === 'Выберите подходящее отделение') {
                const choicePlace = $('.button-choice-place')
                choicePlace.addClass('error-border').css({'background-position': 'center right 40px'})
                choicePlace.next().show()
            }
            $("#formOrder").valid()
        }
    });
})

const userDataString = localStorage.getItem('userData');

if (userDataString) {
    const userData = JSON.parse(userDataString);

    $('#formOrder input[name="firstname"]').val(userData.name);
    $('#formOrder input[name="lastname"]').val(userData.last_name);
    $('#formOrder input[name="email"]').val(userData.email);
    $('#formOrder input[name="phone_number"]').val(userData.phone_number);
}

$(document).on('click', '.search-post-office', function () {
    $(this).find('.validation_type_error ').hide()
})

function removeFiltersIfNotNeeded() {
    var currentUrl = window.location.href;
    if (!currentUrl.includes("sub_category/notebooks")) {
        localStorage.removeItem('filters');
    }
}

removeFiltersIfNotNeeded()


$('.personInfo').on('click', function () {
    $('.blockPersonInfo').css({'display': 'none'})
    $('#formOrder').css({'display': 'block'})
})
