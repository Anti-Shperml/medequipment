$(function() {
    $("#feedback_phone").mask("+7(999)999-99-99");

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async function notification(title, text) {
        let elem = "<div class=\"notification\"><h2>" + title + "</h2><p>" + text + "</p></div>";
        let x = $(elem).appendTo(".notifications__wrapper");
        await sleep(5000);
        $(".notification").last().remove();
    }

    function changeAuthRegScreen() {
        $("#auth-wrapper").slideToggle(300);
        $("#reg-wrapper").slideToggle(300);
    }

    $("#menu-catalog-link").on("mouseover", (e) => {
        $("#menu-catalog-link ul").css("opacity", 1);
        $("#menu-catalog-link ul").css("visibility", "visible");
        $("header").css("border-radius", 0)
    })

    $("#menu-catalog-link").on("mouseout", (e) => {
        $("#menu-catalog-link ul").css("opacity", 0);
        $("#menu-catalog-link ul").css("visibility", "hidden");
        $("header").css("border-radius", "0 0 1.625em 1.625em")
    })
    
    $(".change__screen span").on("click", changeAuthRegScreen);

    $("#auth-form").on("submit", (e) => {
        e.preventDefault();
        // Авторизация
        
        let email = $("#auth_email").val(),
            password = $("#auth_password").val();

        $.ajax({
            url: '../../core/signin.php',
            type: 'POST',
            dataType: 'json',
            data: {
                email: email,
                password: password
            },
            success (data) {
                if (data.status) {
                    window.location.replace("/");
                    notification("Успешно", "Вы авторизированы!");
                } 
                else {
                    notification("Ошибка", data.message);
                }
            },
            error(data){
                console.log(data.responseText);
            }
        });
    })

    $("#reg-form").on("submit", (e) => {
        e.preventDefault();
        // Регистрация

        let email = $("#reg_email").val(),
            fio = $("#reg_name").val(),
            password = $("#reg_password").val(),
            password_confirmation = $("#reg_password_confirm").val();

        $.ajax({
            url: '../../core/signup.php',
            type: 'POST',
            dataType: 'json',
            data: {
                email: email,
                fio: fio,
                password: password,
                password_confirm: password_confirmation
            },
            success (data) {
                if (data.status) {
                    notification("Успешно", data.message);
                } 
                else {
                    notification("Ошибка", data.message);
                }
            },
            error(data){
                console.log(data.responseText);
            }
        })
    })

    $(".close__wrapper").on("click", () => {
        $(".cart_list").hide(300);
        $(".cart").show(300);
    })

    $(".cart").on("click", () => {
        if($(".cart__item").length > 0){
            $(".cart").hide(300);
            $(".cart_list").show(300);
        }
        else{
            notification("Ошибка", "Ваша корзина пуста");
        }
        
    })

    $("#feedback-form").on("submit", (e) => {
        e.preventDefault();
        // Фидбек
        
        let cname = $("#feedback_cname").val(),
            representer = $("#feedback_representer").val(),
            phone = $("#feedback_phone").val();

        $.ajax({
            url: '../../core/feedback.php',
            type: 'POST',
            dataType: 'json',
            data: {
                cname: cname,
                representer: representer,
                phone: phone
            },
            success (data) {
                if (data.status) {
                    notification("Успешно", "Заявка оставлена, ожидайте звонка!");
                    $("#feedback-form")[0].reset();
                    console.log(data.message);
                } 
                else {
                    notification("Ошибка", data.message);
                }
            },
            error(data){
                console.log(data.responseText);
            }
        });
    })

    $("body").on("click", ".catalog__item__btn", (e) => {
        e.preventDefault();
        let itemId = $(e.target).data()["itemId"];

        $.ajax({
            url: '../../core/add_to_cart.php',
            type: 'POST',
            dataType: 'json',
            data: {
                itemId: itemId
            },
            success (data) {
                if (data.status) {
                    if (data.isAdded) {
                        let elem = 
                        `<div class="cart__item" id="cart_item${itemId}">
                            <h4>${data.itemName}</h4>
                            <div class="count__panel">
                                <button class="decrement" data-item-id="${itemId}">-</button>
                                <span>1</span>
                                <button class="increment" data-item-id="${itemId}">+</button>
                            </div>
                        </div>`;
                        $(elem).insertAfter($(".cart__title__wrapper"));
                        e.currentTarget.innerText = "В корзине";
                    }
                    else {
                        $("#cart_item"+itemId).remove();
                        e.currentTarget.innerText = "В корзину";
                    }
                    notification("Успешно", data.message);
                    
                } 
                else {
                    notification("Ошибка", data.message);
                }
            },
            error(data){
                console.log(data.responseText);
            }
        });
    })

    $("body").on("click", ".count__panel button", (e) => {
        e.preventDefault();
        let itemId = $(e.target).data()["itemId"],
            isAdd = false;

        if(e.currentTarget.className === "increment") {
            isAdd = true;
        }

        $.ajax({
            url: '../../core/change_count.php',
            type: 'POST',
            dataType: 'json',
            data: {
                itemId: itemId,
                isAdd: isAdd
            },
            success (data) {
                if (data.status) {
                    if(data.isDeleted){
                        $("#cart_item"+itemId).remove();
                    } else {
                        e.currentTarget.parentElement.children[1].innerText = data.newCount;
                    }
                } 
                else {
                    notification("Ошибка", data.message);
                }
            },
            error(data){
                console.log(data.responseText);
            }
        });
    })

    $("body").on("click", ".cart_list .smb", (e) => {
        e.preventDefault();
        console.log("start");

        $.ajax({
            url: '../../core/make_order.php',
            type: 'POST',
            dataType: 'json',
            data: {
                mark: 1
            },
            success (data) {
                if (data.status) {
                    notification("Успешно", data.message);
                    window.location.reload();
                } 
                else {
                    notification("Ошибка", data.message);
                }
            },
            error(data){
                console.log(data.responseText);
            }
        });
    })

    
})