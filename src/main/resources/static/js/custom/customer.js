/**
 * Created by joeketcham on 10/23/2016.
 *
 * This script contains functions related to customer modules
 *
 */
var customerId;

function openCustomerModal(detail){
    $("#customerModal").css('display', 'block');

    $(document).keyup(function(e) {
        //if (e.keyCode === 13) $('.save').click();     // enter
        if (e.keyCode === 27) closeCustomerModal();   // esc
    });
    if (detail != null) {
        $("#inputFirstname").val(detail.firstname);
        $("#inputmi").val(detail.mi);
        $("#inputLastname").val(detail.lastname);
        $("#address1").val(detail.address1);
        $("#address2").val(detail.address2);
        $("#city").val(detail.city);
        $("#state").val(detail.state);
        $("#zip").val(detail.zip);
        $("#phone1").val(detail.phone1);
        $("#phone2").val(detail.phone2);
        $("#email").val(detail.email);
        $("#note").val(detail.note);
        customerId = getObjectId(detail);
        $("#customerId").val(customerId);
        setCustomerTypesDropdown(true, detail._links.customerType.href);

    } else {
        customerId = null;
        $("#customerDetailForm")[0].reset();
        setCustomerTypesDropdown(false);
    }
    $('#customerType').empty();

}

function setCustomerTypesDropdown(setDropDown, customerTypeHref){
    $.ajax({
        type: "GET",
        url: "customerTypes?size=1000",
        success: function(data){
            console.log("getAllCategories success");
            let customerType = data._embedded.customerTypes;
            for (i = 0; i < customerType.length; i++) {
                let currentCustomerType = customerType[i];
                $('#customerType').append($('<option>', {
                    value: getObjectId(currentCustomerType),
                    text : currentCustomerType.type
                }))
            }
            if (setDropDown) {
                $.getJSON(customerTypeHref, function(result){
                    $('#customerType option[value=' + result.id + ']').attr('selected', true);
                    console.log(result);
                });
            }
        },
        error: function () {
            toastr.warning("Customer Type list pull failed");
        }
    })
}
function getObjectId(detail) {
    //_links.self.href
    let href = detail._links.self.href;
    let _customerId = href.match(new RegExp('\\d+$'))[0];
    return _customerId;
}
function closeCustomerModal() {
    $('#customerType').empty();
    $("#customerModal").css('display', 'none');
}

function goDataTableCustomers(optionvalue, searchvalue) {
    var searchKey = optionvalue.substring(6,20);
    var _searchUrl;
    if ($("customers").dataTable != null) {
        $('#customers').dataTable().fnDestroy();
    }

    if(searchvalue != ''){
        _searchUrl = "customers/search/" + optionvalue + "?" + searchKey + "=" + searchvalue + "&size=1000";
    } else {
        var _pw = prompt("Enter password for full customer search", "");

        if (_pw != "amy2011") {
            toastr.warning('Invalid password');
            if ($("customers").dataTable != null) {
                $('#customers').dataTable().fnDestroy();
                $("#customersContainer").css('display', 'none');
            }
            return false;
        }
        _searchUrl = "customers?page=0&size=1000";
    }

    $('#customers').DataTable({
        "bFilter": true,
        "autoWidth": true,
        "processing": false,
        "ajax": _searchUrl,
        "sAjaxDataProp" : "_embedded.customers",
        "oLanguage": {
            "sSearch": "<span>Filter:</span> _INPUT_" //search
        },
        "columns": [
            { "data": "firstname" },
            { "data": "lastname" },
            { "data": "address1" },
            { "data": "city" },
            { "data": "zip" },
            { "data": "phone1" },
            { "defaultContent": "<button id='editButton' class='editButton'>Edit</button>"},
            { "defaultContent": "<button id='printButton' class='printButton'>Print</button>"}
        ]
    });
    $("#customersContainer").css('display', 'block');
    hookClickEvent();
}
var customerId;
var customerDetail;
var customerInvoiceListHref;
var hookClickEventCounter = 0;
function hookClickEvent(){
    if (hookClickEventCounter < 1) {
        hookClickEventCounter++;
        $('#customers tbody').on( 'click', 'button.editButton', function (event) {
            event.stopPropagation();
            var _closestTr = $(this).closest("tr");
            var table = $('#customers').DataTable();
            customerDetail = table.row(_closestTr).data();
            $("#updateCustomer").show();
            $("#deleteCustomer").show();
            $("#createCustomer").hide();
            openCustomerModal(customerDetail);
        } );
        $('#customers tbody').on( 'click', 'button.printButton', function (event) {
            event.stopPropagation();
            var _closestTr = $(this).closest("tr");
            var table = $('#customers').DataTable();
            customerDetail = table.row(_closestTr).data();
            console.log('you clicked on printbutton: customerDetail');
        } );
        $('#customers tbody').on( 'click', 'tr', function () {
            var table = $('#customers').DataTable();
            customerDetail = table.row(this).data();
            var link = customerDetail._links.self.href;
            customerId = link.match(/\d+$/g)[0];
            customerInvoiceListHref = customerDetail._links.invoiceList.href;
            goDataTableInvoices(customerInvoiceListHref);
        } );
    }
}

function deleteThisCustomer() {

    var form = $("#customerDetailForm");

    jQuery.ajax({
        url: "customers/"+customerId,
        type: 'DELETE',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(getFormData(form)),
        success: function (data) {
            var table = $('#customers').DataTable();
            toastr.success("Successfully Deleted");
            closeCustomerModal();
            submitSearch();
        },
        error: function () {
            toastr.warning("Customer delete failed");
        }
    });
}

function openEmptyCustomer() {
    $("#updateCustomer").hide();
    $("#deleteCustomer").hide();
    $("#createCustomer").show();
    openCustomerModal(null);
}

function createThisCustomer() {
    var form = $("#customerDetailForm");
    var postData = getFormData(form),
        _url = form.attr("action");
    var _url = _url.replace(/\d+$/i,"");
    _url = _url + "/create";


    jQuery.ajax({
        url: _url,
        type: "POST",
        dataType: "html",
        contentType: "application/json",
        data: JSON.stringify(getFormData(form)),
        success: function (data) {
            toastr.success("Success");
            $("#inputCustomer").val($("#inputLastname").val());
            submitSearch();
        },
        error: function () {
            toastr.warning("customer update failed");
        }
    });

}

function updateThisCustomer() {
    var form = $("#customerDetailForm");
    var postData = getFormData(form),
        _url = form.attr("action");
    _url = _url + "/update";
    console.log(postData);

    jQuery.ajax({
        url: _url,
        type: "PUT",
        dataType: "html",
        contentType: "application/json",
        data: JSON.stringify(getFormData(form)),
        success: function (data) {
            toastr.success("Success");
        },
        error: function () {
            toastr.warning("customer update failed");
        }
    });

    //submitCustomer(_url, 'PUT', form);
    submitSearch();
}

function submitCustomer(_url, method, form){
    jQuery.ajax({
        url: _url,
        type: method,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(getFormData(form)),
        success: function (data) {
            toastr.success("Success");
        },
        error: function () {
            toastr.warning("customer update failed");
        }
    });
}

/*
 ------------------------------------
 Manage Customer Types
 ------------------------------------
 */

function openManageCustomerType() {
    $("#manageCustTypeModal").css('display', 'block');
    $(document).keyup(function(e) {
        //if (e.keyCode === 13) $('.save').click();     // enter
        if (e.keyCode === 27) closeManageCustTypeModal();   // esc
    });
    if ($("#manageCustomerTypes > option").length === 1) {
        getCustomerTypes();
    }

}

function closeManageCustTypeModal() {
    $("#manageCustTypeModal").css('display', 'none');
}

function deleteThisCustType() {
    let selectedVal = $("#manageCustomerTypes option:selected")[0].value;
    let custType = $("#custType")[0].value;
    let previousCustomerType = $("#manageCustomerTypes option:selected").text();
    var submitObj = {
        "type": custType,
        "previousType": previousCustomerType
    }
    if (selectedVal != "None"
        && previousCustomerType != "CARD"
        && previousCustomerType != "POLICE"
        && previousCustomerType != "COUNTER"
    ) {
        $.ajax({
            type: "DELETE",
            url: "customerTypes/" + selectedVal,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(submitObj),
            success: function (data) {
                console.log("Deleted Customer Type " + custType + " Success");
                toastr.success("Deleted Customer Type " + custType + " Success");
                resetManageCustomerTypeDropDown();
            },
            error: function () {
                toastr.warning("Delete Customer Type Failed");
            }
        })
    } else {
        toastr.warning("Delete Customer Type Failed");
    }
}

function createUpdateThisCustType() {
    let selectedVal = $("#manageCustomerTypes option:selected")[0].value;
    let custType = $("#custType")[0].value;
    let previousCustomerType = $("#manageCustomerTypes option:selected").text();
    var submitObj = {
        "type": custType,
        "previousType": previousCustomerType
    }
    if (selectedVal == "None"
        && previousCustomerType != "CARD"
        && previousCustomerType != "POLICE"
        && previousCustomerType != "COUNTER"
    ) {
        $.ajax({
            type: "POST",
            url: "custType/create",
            dataType: "text",
            contentType: "application/json",
            data: JSON.stringify(submitObj),
            success: function (data) {
                console.log("Created Customer Type " + custType + " Success");
                toastr.success("Create Customer Type " + custType + " Success");
                resetManageCustomerTypeDropDown();
            },
            error: function () {
                toastr.warning("Create Customer Type Failed");
            }
        })
    } else if (
        previousCustomerType != "CARD"
    && previousCustomerType != "POLICE"
    && previousCustomerType != "COUNTER"
    ) {
        console.log('Performing update using http PUT');
        //do a put
        $.ajax({
            type: "PUT",
            url: "custType/update",
            dataType: "text",
            contentType: "application/json",
            data: JSON.stringify(submitObj),
            success: function (data) {
                console.log("Updated Customer Type " + custType + " Success");
                toastr.success("Updated Customer Type " + custType + " Success");
                resetManageCustomerTypeDropDown();
            },
            error: function () {
                toastr.warning("Update Customer Type Failed");
            }
        })

    } else {
        toastr.warning("Create Update Customer Type Failed");
    }
}

function resetManageCustomerTypeDropDown() {
    $('#manageCustomerTypes').empty();
    $('#manageCustomerTypes').append($('<option>', {
        value: "None",
        text: "-- Select --"
    }));
    getCustomerTypes();
    $("#custType").val('');
}

function setCustomerType() {
    let selectedCustomerType = $("#manageCustomerTypes option:selected").text();
    $("#custType").val(selectedCustomerType);
}
function getCustomerTypes(){
    $.ajax({
        type: "GET",
        url: "customerTypes?size=1000",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log("getCustomerTypes success");
            var types = data._embedded.customerTypes;
            for (i = 0; i < types.length; i++) {
                let currentType = types[i];
                $('#manageCustomerTypes').append($('<option>', {
                    value: currentType.id,
                    text: currentType.type
                }));
            }
        },
        error: function () {
            toastr.warning("CustomerTypes list pull failed");
        }
    })
}
/*
 ------------------------------------
 Manage Upcharges
 ------------------------------------
 */

function setUpchargeForModal(){
    if ($("#UpchargeModalList option:selected").val() === "None") {
        $("#upchargeModalDescription").val("");
        $("#upchargeModalPrice").val("");
        return false;
    }
    let selectedUpcharge = $("#UpchargeModalList option:selected").text();
    $("#upchargeModalDescription").val(selectedUpcharge);
    $.ajax({
        type: "GET",
        url: "upcharges/"+$("#UpchargeModalList option:selected").val(),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            var upcharge = data.price;
            $("#upchargeModalPrice").val(upcharge);
        },
        error: function () {
            toastr.warning("set Upcharge for modal pull failed");
        }
    })
}
function createUpdateThisUpchargeForModal(){
     let upchargeId = $("#UpchargeModalList option:selected").val();
     if (upchargeId === "None") { //Create new with POST
         var submitObj = {
             "description": $("#upchargeModalDescription").val(),
             "price": $("#upchargeModalPrice").val()
         }
         $.ajax({
             type: "POST",
             url: "upcharges",
             dataType: "text",
             contentType: "application/json",
             data: JSON.stringify(submitObj),
             success: function (data) {
                 console.log("Created Upcharge " + $("#upchargeModalDescription").val() + " Success");
                 toastr.success("Create Upcharge " + $("#upchargeModalDescription").val() + " Success");
                 $("#upchargeModalDescription").val("");
                 $("#upchargeModalPrice").val("");
                 $('#UpchargeModalList').empty();
                 $('#UpchargeModalList').append($('<option>', {
                     value: "None",
                     text: "-- Select --"
                 }));
                 getUpchargeModalList();
             },
             error: function () {
                 toastr.warning("Create Upcharge Failed");
             }
         })
     } else { // Update with PUT
         var submitObj = {
             "description": $("#upchargeModalDescription").val(),
             "price": $("#upchargeModalPrice").val()
         }
         $.ajax({
             type: "PUT",
             url: "upcharges/"+upchargeId,
             dataType: "text",
             contentType: "application/json",
             data: JSON.stringify(submitObj),
             success: function (data) {
                 console.log("Update Upcharge " + $("#upchargeModalDescription").val() + " Success");
                 toastr.success("Update Upcharge " + $("#upchargeModalDescription").val() + " Success");
                 $("#upchargeModalDescription").val("");
                 $("#upchargeModalPrice").val("");
                 $('#UpchargeModalList').empty();
                 $('#UpchargeModalList').append($('<option>', {
                     value: "None",
                     text: "-- Select --"
                 }));
                 getUpchargeModalList();
             },
             error: function () {
                 toastr.warning("Update Upcharge Failed");
             }
         })
     }
}
function deleteThisUpchargeForModal(){
    let upchargeId = $("#UpchargeModalList option:selected").val();
    if (upchargeId === "None") {
        return false;
    } else {
        $.ajax({
            type: "DELETE",
            url: "upcharges/"+upchargeId,
            dataType: "text",
            contentType: "application/json",
            success: function (data) {
                console.log("Delete Upcharge " + $("#upchargeModalDescription").val() + " Success");
                toastr.success("Delete Upcharge " + $("#upchargeModalDescription").val() + " Success");
                $("#upchargeModalDescription").val("");
                $("#upchargeModalPrice").val("");
                $('#UpchargeModalList').empty();
                $('#UpchargeModalList').append($('<option>', {
                    value: "None",
                    text: "-- Select --"
                }));
                getUpchargeModalList();
            },
            error: function () {
                toastr.warning("Delete Upcharge Failed");
            }
        })
    }

}

function openManageUpcharges(){
    $("#manageUpchargeModal").css('display', 'block');
    $(document).keyup(function(e) {
        //if (e.keyCode === 13) $('.save').click();     // enter
        if (e.keyCode === 27) closeManageUpchargesModal();   // esc
    });
    if ($("#UpchargeModalList > option").length === 1) {
        getUpchargeModalList();
    }
}

function getUpchargeModalList(){
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
                $('#UpchargeModalList').append($('<option>', {
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

function closeManageUpchargesModal(){
    $("#manageUpchargeModal").css('display', 'none');
}

/*
------------------------------------
Manage item categories
------------------------------------
 */
function openManageItemCategories() {
    $("#manageItemCategoriesModal").css('display', 'block');
    $(document).keyup(function(e) {
        //if (e.keyCode === 13) $('.save').click();     // enter
        if (e.keyCode === 27) closeManageItemCategoriesModal();   // esc
    });
    if ($("#manageItemCategories > option").length === 1) {
        getItemCustomerTypes();
    }
}

function closeManageItemCategoriesModal() {
    $("#manageItemCategoriesModal").css('display', 'none');
}

function getItemCustomerTypes() {
    //customerTypes
    $.ajax({
        type: "GET",
        url: "customerTypes?size=1000",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log("getItemCustomerTypes success");
            var customerTypes = data._embedded.customerTypes;
            for (i = 0; i < customerTypes.length; i++) {
                let customerType = customerTypes[i];
                $('#manageItemCustomerTypes').append($('<option>', {
                    value: customerType.id,
                    text: customerType.type
                }));
            }
        },
        error: function () {
            toastr.warning("Customer types list pull failed");
        }
    })
}
function getItemCategories(customerTypeId) {
    //http://localhost:8080/categories/search/findByCustomerTypeId?customerTypeId=2
    $.ajax({
        type: "GET",
        url: "categories/search/findByCustomerTypeId?customerTypeId=" + customerTypeId + "&size=1000",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log("getItemCategories success");
            var categories = data._embedded.categories;
            for (i = 0; i < categories.length; i++) {
                let currentCategory = categories[i];
                $('#manageItemCategories').append($('<option>', {
                    value: currentCategory.id,
                    text: currentCategory.description
                }));
            }
        },
        error: function () {
            toastr.warning("Item Categories list pull failed");
        }
    })
}

function setItemCustomerType(customerTypeId) {
    let selectedItemCustomerType = $("#manageItemCustomerTypes option:selected").val();
    getItemCategories(selectedItemCustomerType);
}

function setItemCategory(itemCategory){
    let selectedItemCategory = $("#manageItemCategories option:selected").text();
    $("#itemCategory").val(selectedItemCategory);
}

function deleteThisItemCategory() {
    let selectedVal = $("#manageItemCategories option:selected")[0].value;
    let itemCategory = $("#itemCategory")[0].value;
    let previousItemCategory = $("#manageItemCategories option:selected").text();
    var submitObj = {
        "type": itemCategory,
        "previousType": previousItemCategory
    }
    $.ajax({
        type: "DELETE",
        url: "categories/" + selectedVal,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(submitObj),
        success: function (data) {
            console.log("Deleted Item Category " + itemCategory + " Success");
            toastr.success("Deleted Item Category " + itemCategory + " Success");
            resetItemCategoryDropDown();
        },
        error: function () {
            toastr.warning("Delete Customer Type Failed");
        }
    })
}

function createUpdateThisItemCategory() {
    let selectedVal = $("#manageItemCategories option:selected")[0].value;
    let itemCategory = $("#itemCategory")[0].value;
    let previousCustomerType = $("#manageItemCategories option:selected").text();
    let customerTypeId = $("#manageItemCustomerTypes").val();
    var submitObj = {
        "description": itemCategory,
        "previousDescription": previousCustomerType,
        "customerTypeId": customerTypeId
    }
    if (selectedVal == "None"
    ) {
        $.ajax({
            type: "POST",
            url: "itemCategory/create",
            dataType: "text",
            contentType: "application/json",
            data: JSON.stringify(submitObj),
            success: function (data) {
                console.log("Created Item Category " + itemCategory + " Success");
                toastr.success("Create Item Category " + itemCategory + " Success");
                resetItemCategoryDropDown();
            },
            error: function () {
                toastr.warning("Create Customer Type Failed");
            }
        })
    } else {
        console.log('Performing update using http PUT');
        //do a put
        $.ajax({
            type: "PUT",
            url: "itemCategory/update",
            dataType: "text",
            contentType: "application/json",
            data: JSON.stringify(submitObj),
            success: function (data) {
                console.log("Updated Item Category " + itemCategory + " Success");
                toastr.success("Updated Item Category " + itemCategory + " Success");
                resetItemCategoryDropDown();
            },
            error: function () {
                toastr.warning("Update Customer Type Failed");
            }
        })

    }
}

function resetItemCategoryDropDown() {
    $("#manageItemCustomerTypes").empty();
    $('#manageItemCustomerTypes').append($('<option>', {
        value: "None",
        text: "-- Select --"
    }));
    $('#manageItemCategories').empty();
    $('#manageItemCategories').append($('<option>', {
        value: "None",
        text: "-- Select --"
    }));
    getItemCustomerTypes();
    $("#itemCategory").val('');
}

/*
 ------------------------------------
 Manage items
 ------------------------------------
 */

function openManageItems() {
    $("#manageItemsModal").css('display', 'block');
    $(document).keyup(function(e) {
        //if (e.keyCode === 13) $('.save').click();     // enter
        if (e.keyCode === 27) closeManageItemsModal();   // esc
    });
    if ($("#manageItemsModalCustomerType > option").length === 1) {
        getCustomerTypesForManageItems();
    }
}

function closeManageItemsModal() {
    $("#manageItemsModal").css('display', 'none');
}

function getCustomerTypesForManageItems() {
    $.ajax({
        type: "GET",
        url: "customerTypes?size=1000",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log("getCustomerTypes success");
            var types = data._embedded.customerTypes;
            for (i = 0; i < types.length; i++) {
                let currentType = types[i];
                $('#manageItemsModalCustomerType').append($('<option>', {
                    value: currentType.id,
                    text: currentType.type
                }));
            }
        },
        error: function () {
            toastr.warning("CustomerTypes list pull failed");
        }
    })

}

function getItemsForModal() {
    $.ajax({
        type: "GET",
        url: "items?size=1000",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log("getItemCategories success");
            var items = data._embedded.items;
            for (i = 0; i < items.length; i++) {
                let currentItem = items[i];
                $('#manageItemsModalItemsList').append($('<option>', {
                    value: currentItem.id,
                    text: currentItem.description
                }));
            }
        },
        error: function () {
            toastr.warning("Items list pull failed");
        }
    })
}

//http://localhost:8080/items/search/findByCatandCustType?CategoryId=1&CustomerTypeId=1

function setItemsForModal(selectedCategory){
    if ($("#manageItemsModalItemsList > option").length > 1) {
        $("#manageItemsModalItemsList").empty();
        $('#manageItemsModalItemsList').append($('<option>', {
            value: "None",
            text: "-- Select --"
        }));
        $("#itemModalDescription").val("");
        $("#itemModalPrice").val("");
    }
    let selectedCustomerTypeId = $("#manageItemsModalCustomerType :selected").val();
    if (selectedCategory === "None") {
        return false;
    }
    $.ajax({
        type: "GET",
        url: "items/search/findByCatandCustType?CategoryId="
            + selectedCategory +
            "&CustomerTypeId="
            + selectedCustomerTypeId
            +"&size=1000",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log("getItemCategories success");
            var items = data._embedded.items;
            for (i = 0; i < items.length; i++) {
                let currentItem = items[i];
                $('#manageItemsModalItemsList').append($('<option>', {
                    value: currentItem.id,
                    text: currentItem.description
                }));
            }
        },
        error: function () {
            toastr.warning("Category and Customer Type Items list pull failed");
        }
    })
}

// http://localhost:8080/categories/search/findByCustomerTypeId?customerTypeId=2

function setItemsCategoryForModal(customerTypeId) {
    if ($("#manageItemsModalCategory > option").length > 1) {
        $("#manageItemsModalCategory").empty();
        $('#manageItemsModalCategory').append($('<option>', {
            value: "None",
            text: "-- Select --"
        }));
        $("#manageItemsModalItemsList").empty();
        $('#manageItemsModalItemsList').append($('<option>', {
            value: "None",
            text: "-- Select --"
        }));
        $("#itemModalDescription").val("");
        $("#itemModalPrice").val("");

    }
    if (customerTypeId === "None") {
        return false;
    }
    $.ajax({
        type: "GET",
        url: "categories/search/findByCustomerTypeId?customerTypeId="+customerTypeId+"&size=1000",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log("getItemCategories success");
            var categories = data._embedded.categories;
            for (i = 0; i < categories.length; i++) {
                let currentCategory = categories[i];
                $('#manageItemsModalCategory').append($('<option>', {
                    value: currentCategory.id,
                    text: currentCategory.description
                }));
            }
        },
        error: function () {
            toastr.warning("Item Categories list pull failed");
        }
    })

}

// http://localhost:8080/items/1

function setItemsDetailForModal(itemId) {
    $.ajax({
        type: "GET",
        url: "items/"+itemId,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log("setItemsDetailForModal success");
            //var categories = data.description;
            $("#itemModalDescription").val(data.description);
            $("#itemModalPrice").val(data.price);
        },
        error: function () {
            toastr.warning("Item detail pull failed");
        }
    })

}

function deleteThisItemForModal() {

    var submitObj = {
        "description": $("#itemModalDescription").val(),
        "price": $("#itemModalPrice").val(),
        "id": $("#manageItemsModalItemsList :selected").val()
    }
    var _url = "/items/" + submitObj.id;


    jQuery.ajax({
        url: _url,
        type: 'DELETE',
        dataType: "json",
        contentType: "application/json",
        data: submitObj,
        success: function (data) {
            toastr.success("Successfully Deleted " + submitObj.description);
            setItemsForModal($("#manageItemsModalCategory :selected").val());
        },
        error: function () {
            toastr.warning("Item delete failed");
        }
    });

}

function createUpdateThisItemForModal() {

    if ($("#manageItemsModalCustomerType :selected").val() === "None" ||
        $("#manageItemsModalCategory :selected").val() === "None") {
        toastr.warning("Create / Update Item Failed");
        return false;
    }

    var submitObj = {
        "description": $("#itemModalDescription").val(),
        "price": $("#itemModalPrice").val(),
        "categoryId": $("#manageItemsModalCategory :selected").val(),
        "customerTypeId": $("#manageItemsModalCustomerType :selected").val()
    }

    // if None then POST, else PUT
    if ($("#manageItemsModalItemsList :selected").val() === "None") {
        console.log("performing POST creating new Item");
        $.ajax({
            type: "POST",
            url: "item/create",
            dataType: "text",
            contentType: "application/json",
            data: JSON.stringify(submitObj),
            success: function (data) {
                console.log("Created Item " + $("#itemModalDescription").val() + " Success");
                toastr.success("Create Item " + $("#itemModalDescription").val() + " Success");
                setItemsForModal($("#manageItemsModalCategory :selected").val());
            },
            error: function () {
                toastr.warning("Create Item Failed");
            }
        })
    } else {

        var submitObj = {
            "description": $("#itemModalDescription").val(),
            "price": $("#itemModalPrice").val(),
            "id": $("#manageItemsModalItemsList :selected").val()
        }

        console.log("performing PUT updating existing item");
        $.ajax({
            type: "PUT",
            url: "item/update",
            dataType: "text",
            contentType: "application/json",
            data: JSON.stringify(submitObj),
            success: function (data) {
                console.log("Updated Item " + $("#itemModalDescription").val() + " Success");
                toastr.success("Updated Item " + $("#itemModalDescription").val() + " Success");
                setItemsForModal($("#manageItemsModalCategory :selected").val());
            },
            error: function () {
                toastr.warning("Update Item Failed");
            }
        })
    }

}

