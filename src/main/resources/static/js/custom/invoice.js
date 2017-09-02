/**
 * Created by joeketcham on 10/23/2016.
 *
 * This script contains functions related to invoice modules
 *
 */
function goDataTableInvoices(_linkData) {
    if ($("invoices").dataTable != null) {
        $('#invoices').dataTable().fnDestroy();
    }
    $('#invoices').DataTable({
        "bFilter": true,
        "autoWidth": true,
        "processing": false,
        "ajax": _linkData,
        "sAjaxDataProp" : "_embedded.invoices",
        "oLanguage": {
            "sSearch": "<span>Filter:</span> _INPUT_" //search
        },
        columnDefs: [
            { type: "currency", targets: 4 }
        ],
        "columns": [
            { data: "dropoff"},
            { data: "ready" },
            { data: "total_quantity" },
            { data: "total_price" },
            { data: "paid" },
            { "defaultContent": "<button>Edit</button>"}
        ]

    });
    $("#customersContainer").css('display', 'none');
    $("#invoiceContainer").css('display', 'block');

    hookClickEventInvoice();
}
var invoiceId;
var itemLinesHref;
var invoiceEditScreenOpen = false;
var hookClickEventInvoiceFlag = false;
function hookClickEventInvoice(){
        if (!hookClickEventInvoiceFlag) {
            hookClickEventInvoiceFlag = true;
            $('#invoices tbody').on( 'click', 'button', function () {
                invoiceEditScreenOpen = true;
                event.stopPropagation();
                var _closestTr = $(this).closest("tr")
                var table = $('#invoices').DataTable();
                var detail = table.row(_closestTr).data();
                $("#newInvoiceModal").show();
                openInvoiceModal(detail);
            } );
            $('#invoices tbody').on( 'click', 'tr', function () {
                    if (!invoiceEditScreenOpen) {
                        var table = $('#invoices').DataTable();
                        var detail = table.row(this).data();
                        itemLinesHref = detail._links.itemlines.href;
                        goDataTableItemLines(itemLinesHref);
                    }
            } );
        }
}

function openInvoiceModal(detail){

    $("#newInvoiceModal").css('display', 'block');
    $("#updateInvoice").show();
    $("#createInvoice").hide();
    $(document).keyup(function(e) {
        //if (e.keyCode === 13) $('.save').click();     // enter
        if (e.keyCode === 27) {
            $("#newInvoiceModal").css('display', 'none');
            invoiceEditScreenOpen = false;
        }   // esc
    });
    var currDropOffDate = "";
    var currDropOffTime = "";
    var currPickupDate = "";
    var currPickupTime = "";
    invoiceId = getObjectId(detail);
    if (detail != null) {
        if (detail.dropoff != null) {
            currDropOffDate = detail.dropoff.match(/\d{4}-\d{2}-\d{2}/g)[0];
            currDropOffTime = detail.dropoff.match(/\d{2}:\d{2}/g)[0];
            currDropOffTime = convert24to12(currDropOffTime);
        }
        if (detail.ready != null) {
            currPickupDate = detail.ready.match(/\d{4}-\d{2}-\d{2}/g)[0];
            currPickupTime = detail.ready.match(/\d{2}:\d{2}/g)[0];
            currPickupTime = convert24to12(currPickupTime);
        }
        $("#dropOffDate").val(currDropOffDate);
        $("#dropOffTime").val(currDropOffTime);
        $("#pickupDate").val(currPickupDate);
        $("#pickupTime").val(currPickupTime);
        if (detail.paid) {
            $("#paidTrue").checked=true;
        }
        $("#invoiceNote").val(detail.note);
        $("#invoiceDetailForm").attr("action", detail._links.invoice.href);
    } else {
        $("#invoiceDetailForm")[0].reset();
    }
}

function goDataTableItemLines(_linkData) {
    invoiceId = getInvoiceIdFromDetail(_linkData);
    if ($("lines").dataTable != null) {
        $('#lines').dataTable().fnDestroy();
    }
    $('#lines').DataTable({
        "bFilter": true,
        "autoWidth": true,
        "processing": false,
        "ajax": _linkData,
        "sAjaxDataProp" : "_embedded.itemLines",
        "oLanguage": {
            "sSearch": "<span>Filter:</span> _INPUT_" //search
        },
        "columns": [
            { data: "item_category"},
            { data: "item" },
            { data: "quantity" },
            { data: "price" },
            { data: "price_override" }
        ]
    });
    $("#invoiceContainer").css('display', 'none');
    $("#linesContainer").css('display', 'block');

    hookClickEventLines();
}
var hookClickEventLinesCounter = 0;
var lineDetailId = 0;
function hookClickEventLines(){
    if (hookClickEventLinesCounter < 1) {
        hookClickEventLinesCounter++;
        $('#lines tbody').on( 'click', 'tr', function () {
            var table = $('#lines').DataTable();
            var detail = table.row(this).data();
            var _link = detail._links.itemLine.href;
            lineDetailId = detail.id;
            openLineDetailModal(detail);
        } );
    }
}

function closeNewInvoiceModal() {
    $("#newInvoiceModal").css('display', 'none');
    invoiceEditScreenOpen = false;
}

function createInvoice() {
    $(document).keyup(function(e) {
        if (e.keyCode === 27) {
            closeNewInvoiceModal();
        }   // esc
    });
    $("#newInvoiceModal").css('display', 'block');
    document.getElementById("invoiceDetailForm").reset();
    $("#updateInvoice").css("display", 'none');
    $("#createInvoice").css("display", '');
    $("#dropOffDate").datepicker();
    $("#dropOffDate").datepicker('setDate', new Date());
    $("#dropOffTime").timepicker();
    $("#dropOffTime").timepicker('setTime', new Date())
    $("#pickupDate").datepicker();
    $("#pickupTime").timepicker();
}


function createThisInvoice() {
    if (checkPickupDate()) {
        toastr.warning("Invoice Pickup After Drop Off Date");
        return false;
    }

    var submitDropOff = convertDateTimeToPOST($("#dropOffDate").val(), $("#dropOffTime").val());
    var submitPickup = convertDateTimeToPOST($("#pickupDate").val(), $("#pickupTime").val());
    var submitPaidFlag = $('input[name=paid]:checked', '#invoiceDetailForm').val();

    var submitObj = {
        "customerId":customerId,
        "dropoff":submitDropOff,
        "ready":submitPickup,
        "paid":submitPaidFlag,
        "note":$("#invoiceNote").val()
    }

    $.ajax({
        type: "POST",
        //url: $("#invoiceDetailForm").attr('action'),
        url: "inv/create",
        data: JSON.stringify(submitObj),
        success: function(){
            toastr.success("New Invoice Created");
            closeNewInvoiceModal();
            goDataTableInvoices(customerInvoiceListHref);
        },
        error: function() {
            toastr.warning("Invoice NOT Created");
        },
        dataType: "html",
        contentType : "application/json"
    });

}


function checkPickupDate() {
    var createInvoiceDropOff = $("#dropOffDate").val();
    createInvoiceDropOff = convertStringDate(createInvoiceDropOff);
    var createInvoicePickup = $("#pickupDate").val();
    createInvoicePickup = convertStringDate(createInvoicePickup);

    if($("#pickupDate").val() != "" && createInvoicePickup < createInvoiceDropOff) {
        console.log("pickup is before drop off");
        return true;
    } else {
        console.log("pickup is after drop off");
        return false;
    }

}

function convertStringDate(inDate){
    var dropOffMonth = inDate.substring(0,2);
    var dropOffDay = inDate.substring(3,5);
    var dropOffYear = inDate.substring(6,10);
    var createInvoiceDropOffDate = new Date(dropOffYear,dropOffMonth-1,dropOffDay);
    console.log(createInvoiceDropOffDate);
    return createInvoiceDropOffDate;
}



function updateThisInvoice() {
    if (checkPickupDate()) {
        toastr.warning("Invoice Pickup After Drop Off Date");
        return false;
    }

    var submitDropOff = convertDateTimeToPOST($("#dropOffDate").val(), $("#dropOffTime").val());
    var submitPickup = convertDateTimeToPOST($("#pickupDate").val(), $("#pickupTime").val());
    var submitPaidFlag = $('input[name=paid]:checked', '#invoiceDetailForm').val();

    var submitObj = {
        "invoiceId":invoiceId,
        "customerId":customerId,
        "dropoff":submitDropOff,
        "ready":submitPickup,
        "paid":submitPaidFlag,
        "note":$("#invoiceNote").val()
    }

    $.ajax({
        type: "PUT",
        //url: $("#invoiceDetailForm").attr('action'),
        url: "inv/update",
        data: JSON.stringify(submitObj),
        success: function(){
            toastr.success("Invoice Updated");
            goDataTableInvoices(customerInvoiceListHref);
        },
        error: function() {
            toastr.warning("Invoice NOT Updated");
        },
        dataType: "html",
        contentType : "application/json"
    });

}

function getObjectId(detail) {
    //_links.self.href
    let href = detail._links.self.href;
    let invoiceId = href.match(new RegExp('\\d+$'))[0];
    return invoiceId;
}

function getInvoiceIdFromDetail(detail) {
    //let invoiceId = detail.match(new RegExp('\\d+$'))[0];
    let invoiceId = detail.match(new RegExp('invoices\/\\d+'))[0];
    invoiceId = invoiceId.match(new RegExp('\\d+$'));
    return invoiceId[0];
}