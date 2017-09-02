/*
 ======================================================
 Invoice Line Item Detail
 ======================================================
 */

function openLineDetailModal(detail){
    $("#lineDetailModal").css('display', 'block');

    $(document).keyup(function(e) {
        //if (e.keyCode === 13) $('.save').click();     // enter
        if (e.keyCode === 27) closeLineDetailModal();   // esc
    });
    //================================================================
    getCategoriesForEdit(detail);
    //================================================================


    //$("#lineDetailForm")[0].reset();
    //$("#insertLineDetail").show();
    //$("#updateLineDetail").hide();

}

function getCategoriesForEdit(detail) {
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
            getFilteredCategoryForEdit(customerTypeId, detail);
        },
        error: function () {
            toastr.warning("Customer type pull failed");
        }
    })

}

function getFilteredCategoryForEdit(customerTypeId, detail) {
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
            $('#itemCategories option:contains(' + detail.item_category + ')').each(function(){
                if ($(this).text() == detail.item_category) {
                    $(this).attr('selected', 'selected');
                    getItems($(this)[0].value, detail);
                }
            });
            $("#lineDetailCategory").val(detail.item_category);
            $("#lineDetailItem").val(detail.item);
            $("#lineDetailQuantity").val(detail.quantity);
            $("#lineDetailPrice").val(detail.price);
            $("#lineDetailPriceOverride").val(detail.price_override);
            $("#lineDetailForm").attr("action", detail._links.itemLine.href);
        },
        error: function () {
            toastr.warning("Filtered Category list pull failed");
        }
    })
}


function closeLineDetailModal() {
    lineDetailId = 0;
    $("#lineDetailModal").css('display', 'none');
}

function updateThisLineDetail() {
    var form = $("#lineDetailForm");
    var postData = getFormData(form),
        _url = form.attr("action");
    console.log(postData);
    submitCustomer(_url, 'PUT', form);
}

function deleteThisLineDetail() {

    var form = $("#lineDetailForm");
    var _url = form.attr("action");

    jQuery.ajax({
        url: _url,
        type: 'DELETE',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(getFormData(form)),
        success: function (data) {
            var table = $('#lines').DataTable();
            toastr.success("Delete Success");
            closeLineDetailModal();
        },
        error: function () {
            toastr.warning("Customer delete failed");
        }
    });
}



function goDataTableItemLineDetail(_linkData) {
    if ($("upcharges").dataTable != null) {
        $('#upcharges').dataTable().fnDestroy();
    }
    $('#upcharges').DataTable({
        "bFilter": true,
        "autoWidth": true,
        "processing": false,
        "ajax": _linkData,
        "sAjaxDataProp" : "_embedded.itemLineUpcharges",
        "oLanguage": {
            "sSearch": "<span>Filter:</span> _INPUT_" //search
        },
        "columns": [
            { data: "upcharge" },
            { data: "price" }
        ]
    });
    $("#upchargesContainer").css('display', 'block');
    hookClickEventUpchargeLines();
}

function hookClickEventUpchargeLines(){

}
