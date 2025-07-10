console.log("Products frontend javascript file");

$(function () {
    $(".product-collection").on("change", () => {
        const selectedValue = $(".product-collection").val();
        if(selectedValue === "DRINK") {
            $("#product-collection").hide();
            $("#product-volume").show();
        } else {
            $("#product-volume").hide();
            $("#product-collection").show();
        }
    });

    $("#process-btn").on("click", () => {
        $(".dish-container").slideToggle(500);
        $("#process-btn").css("display", "none");
    });

    $("#cancel-btn").on("click", () => {
        $(".dish-container").slideToggle(100);
        $("#process-btn").css("display", "flex");
    });

    $(".new-product-status").on("change", async function(e) {
        const id = e.target.id,
            productStatus = $(`#${id}.new-product-status`).val();

        try {
            const response = await axios.post(`/admin/product/${id}`, {productStatus: productStatus});
            console.log("response:", response);
            const result = response.data;
           
            console.log("result:", result);
            if(result.data) {
                $(".new-product-status").blur();
            } else alert("Product update failed!")
        } catch(err) {
            console.log(err);
            alert("Product update failed!");
        }
    })
});

function validateForm() {
    const productName = $(".product-name").val(),
        productStatus = $(".product-status").val(),
        productPrice = $(".product-price").val(),
        productLeftCount = $(".product-left-count").val(),
        productCollection = $(".product-collection").val(),
        productDesc = $(".product-desc").val();

    if(
        productName ==="" || 
        productStatus ==="" || 
        productPrice ==="" ||
        productLeftCount ==="" ||
        productCollection ==="" ||
        productDesc ===""
    ) {
        alert("Please insert all details!");
        return false;
    } else return true;

}

function previewFileHandler(input, order) {
    const imgClassName = input.className;
    console.log("input:", input);
    const file = $(`.${imgClassName}`).get(0).files[0];
    const fileType = file['type'];
    const validImageType = ["image/jpg", "image/jpeg", "image/webp", "image/png"];

    if(!validImageType.includes(fileType)) {
        alert("Please input only jpg, jpeg, webp and png!");
    } else {
        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                $(`#image-section-${order}`).attr("src", reader.result);
            };
            reader.readAsDataURL(file)
        }
    }

}