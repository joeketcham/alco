/*
 ==========================================================================
 Add Update Remove invoice item lines
 ==========================================================================
 */

function createNewItem() {
    $("#lineDetailModal").css('display', 'block');
    $("#lineDetailForm").attr("action", "/createItemLine");
    getCategories();
    getLineDetailUpchargeModalList();
    $(document).keyup(function(e) {
        //if (e.keyCode === 13) $('.save').click();     // enter
        if (e.keyCode === 27) {
            $("#lineDetailModal").css('display', 'none');
        }   // esc
    });
}

function getLineDetailUpchargeModalList(){
    console.log("getLineDetailUpchargeModalList called");
    $.ajax({
        type: "GET",
        url: "upcharges?size=1000",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log("getUpchargeModalList success");
            var upcharges = data._embedded.upcharges;
            for (i = 0; i < upcharges.length; i++) {
                let currentUpcharge = upcharges[i];
                $('#lineDetailUpcharge').append($('<option>', {
                    value: currentUpcharge.id,
                    text: currentUpcharge.description
                }));
            }
        },
        error: function () {
            toastr.warning("Upcharge list pull failed");
        }
    })
}

function assignUpchargePrice(upchargeId) {
    if ($("#lineDetailItem").val() === "None") {
        $("#lineDetailUpcharge").val("None");
        return false;
    }
    if ($("#lineDetailUpcharge").val() === "None") {
        //reset the price, user is removing the upcharge
        priceOverrideFalse();
        assignPrice($('#lineDetailItem').val());
        return false;
    }

/*
    $.ajax({
        type: "GET",
        url: "upcharges/" + upchargeId,
        dataType: "html",
        contentType: "application/json",
        success: function (data) {
            let parsedData = JSON.parse(data);
            let itemLineId = $("#lineDetailItem").val();
            let price = parsedData.price;
            let description = parsedData.description;
            saveItemLineUpcharge(itemLineId, price, description);
        },
        error: function () {
            toastr.warning("Item list pull failed");
        }
    })
*/
}

function deleteThisInvoiceLineDetail() {
    if (lineDetailId != 0) {
        $.ajax({
            type: "DELETE",
            url: "itemLines/" + lineDetailId,
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                console.log("Deleted item "+ lineDetailId + " Success");
                toastr.success("Deleted Item Successfully");
                goDataTableItemLines(itemLinesHref);
                closeLineDetailModal();
            },
            error: function () {
                toastr.warning("Delete Item Failed");
            }
        })
    }
}

function saveItemLineUpcharge(itemLineId, price, description) {
    let submitObj = {
        "itemLineId": itemLineId,
        "description": description,
        "price": price
    };
    $.ajax({
        type: "POST",
        url: "createItemLineUpcharge",
        dataType: "html",
        contentType: "application/json",
        data: JSON.stringify(submitObj),
        success: function (data) {
            console.log("save item line upcharge success");
        },
        error: function () {
            toastr.warning("Save item line upcharge failed");
        }
    })
}

function getCategories() {
    console.log("fired getCategories");

    //get customer type first
    //Pass customer type to the categories query to filter it down

    _url = customerDetail._links.customerType.href;
    let customerTypeId = undefined;
    $.ajax({
        type: "GET",
        url: _url,
        success: function (data) {
            console.log("get customer type success");
            customerTypeId = data.id;
            getFilteredCategory(customerTypeId);
        },
        error: function () {
            toastr.warning("Customer type pull failed");
        }
    })

}

function getFilteredCategory(customerTypeId) {
    // get categories with filter
    // http://localhost:8080/categories/search/findByCustomerTypeId?customerTypeId=2&size=1000
    $("#itemCategories").empty();
    $('#itemCategories').append($('<option>', {
        value: "None",
        text: "-- Select --"
    }));
    $("#lineDetailItem").empty();
    $('#lineDetailItem').append($('<option>', {
        value: "None",
        text: "-- Select --"
    }));
    $("#lineDetailQuantity").val("");
    $("#lineDetailPrice").val("");

    $.ajax({
        type: "GET",
        url: "categories/search/findByCustomerTypeId?customerTypeId=" +
            customerTypeId + "&size=1000",
        success: function (data) {
            console.log("getFilteredCategory success");
            let categories = data._embedded.categories;
            for (i = 0; i < categories.length; i++) {
                let currentCategory = categories[i];
                $('#itemCategories').append($('<option>', {
                    value: getObjectId(currentCategory),
                    text: currentCategory.description
                }))
            }
        },
        error: function () {
            toastr.warning("Filtered Category list pull failed");
        }
    })
}

function getItems(categoryId, detail){


    $('#lineDetailItem').empty();
    $('#lineDetailItem').append($('<option>', {
        value: "None",
        text: "-- Select --"
    }))
    $('#lineDetailQuantity').val('');
    $('#lineDetailPrice').val('');

    if (categoryId === "None") {
        return false;
    }
    var submitObj = {
        "category": categoryId,
        "customerId": customerId
    }
    $.ajax({
        type: "POST",
        url: "itemByCategory/items",
        dataType: "html",
        contentType: "application/json",
        data: JSON.stringify(submitObj),
        success: function (data) {
            console.log("getItems success");

            let items = JSON.parse(data); //lineDetailItem
            $("#lineDetailItem").css('display', 'block');
            for (i = 0; i < items.length; i++) {
                let currentItem = items[i];
                $('#lineDetailItem').append($('<option>', {
                    value: currentItem.id,
                    text: currentItem.description
                }));
            }
            if(detail != undefined && detail != null) {
                $('#lineDetailItem option:contains(' + detail.item + ')').each(function(){
                    if ($(this).text() == detail.item) {
                        $(this).attr('selected', 'selected');
                    }
                });
            } else {
                assignPrice($('#lineDetailItem').val());
            }
        },
        error: function () {
            toastr.warning("Item list pull failed");
        }
    })

}

function assignPrice(itemId){
    priceOverrideFalse();
    $("#lineDetailQuantity").val(1);
    if (itemId === "None") {
        return false;
    }
    $.ajax({
        type: "GET",
        url: "items/"+itemId,
        success: function(data){
            console.log("assignPrice success");
            $("#lineDetailPrice").val(data.price);
        },
        error: function(){
            return 0;
            toastr.warning("Item price pull failed");
        }
    })


}

function insertUpdateThisLineDetail() {
    var form = $("#lineDetailForm");
    var submitObj = {
        "category":$("#itemCategories option:selected").val(),
        "item":$("#lineDetailItem option:selected").val(),
        "price_override":priceOverride,
        "quantity":$("#lineDetailQuantity").val(),
        "price":$("#lineDetailPrice").val(),
        "invoiceId":invoiceId
    }

    var _url = form.attr("action");
    //var _url = _url.replace(/\d+$/i,"");
    jQuery.ajax({
        url: _url,
        type: "POST",
        dataType: "html",
        contentType : "application/json",
        data: JSON.stringify(submitObj),
        success: function (data) {
            toastr.success("Success");
            assignUpchargePrice($('#lineDetailUpcharge').val());
            goDataTableItemLines(itemLinesHref);
        },
        error: function () {
            toastr.warning("Invoice line detail update failed");
        }
    });
}

function submitInvoiceLine(_url, method, form){
    let invoiceLineDetail = createInvoiceLineDetail();
    jQuery.ajax({
        url: _url,
        type: method,
        dataType: "html",
        contentType : "application/json",
        data: JSON.stringify(invoiceLineDetail),
        success: function (data) {
            toastr.success("Success");
            goDataTableItemLines(itemLinesHref);
        },
        error: function () {
            toastr.warning("Invoice line detail update failed");
        }
    });
}

function createInvoiceLineDetail() {
    var submitObj = {
        "invoiceId":invoiceId,
        "category":$("#itemCategories").val(),
        "item":$("#lineDetailItem").val(),
        "quantity":$("#lineDetailQuantity").val(),
        "price":$("#lineDetailPrice").val(),
        "price_override":false
    }
    return submitObj;
}


/*
 ==========================================================================
 ==========================================================================
 */

var hookClickEventInvoiceLineCounter = 0;
var editScreenOpen = false;
function hookClickEventInvoiceLine(){
    if (hookClickEventInvoiceLineCounter < 1) {
        hookClickEventInvoiceLineCounter++;

        $('#lines tbody').on( 'click', 'button', function () {
            event.stopPropagation();
            editScreenOpen = true;
            var _closestTr = $(this).closest("tr")
            var table = $('#lines').DataTable();
            var detail = table.row(_closestTr).data();
            $("#newInvoiceModal").show();

            openItemLineModal(detail);
        } );
        $('#lines tbody').on( 'click', 'tr', function () {
            if (!editScreenOpen){
                var table = $('#lines').DataTable();
                var detail = table.row(this).data();
                itemLinesHref = detail._links.itemline.href;
                goDataTableItemLines(itemLinesHref);
            }
        } );
    }
}

function openItemLineModal(detail){

}

var priceOverride = false;
function priceOverrideTrue() {
    priceOverride = true;
}
function priceOverrideFalse() {
    priceOverride = false;
    $("#lineDetailUpcharge").val("None");
}

var upchargeVal = 0.00;
function multiplyPrice(quantity) {
    quantity = Math.round(quantity);
    $("#lineDetailQuantity").val(quantity);
    if (quantity <= 0 || $("#lineDetailItem").val() === "None") {
        return 0;
    }
    let itemId = $('#lineDetailItem').val();

    $.ajax({
        type: "GET",
        url: "items/"+itemId,
        success: function(data){
            console.log("multiplyPrice success");
            let currentPrice = Number(data.price).toFixed(2);
            let totalPrice = Number((currentPrice + upchargeVal) * quantity).toFixed(2);
            $('#lineDetailPrice').val(totalPrice);
            priceOverride = false;
        },
        error: function(){
            return 0;
            toastr.warning("multiplyPrice pull failed");
        }
    })
}