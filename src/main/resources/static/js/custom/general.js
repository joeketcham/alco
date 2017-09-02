/**
 * Created by joeketcham on 10/23/2016.
 *
 * This script contains shared functions app wide
 *
 */

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function backToCustomers() {
    $("#invoiceContainer").css('display', 'none');
    $("#customersContainer").css('display', 'block');
}

function backToInvoice() {
    $("#linesContainer").css('display', 'none');
    goDataTableInvoices(customerInvoiceListHref);
    $("#invoiceContainer").css('display', 'block' );
}

function getTimeZoneOffSet() {
    var timeZoneOffSetd = new Date()
    var timeZoneOffSetn = timeZoneOffSetd.getTimezoneOffset();
    timeZoneOffSetn = timeZoneOffSetn / 60;
    timeZoneOffSetn = timeZoneOffSetn * -100;
    timeZoneOffSetn = timeZoneOffSetn.toString();
    if (timeZoneOffSetn.length < 5) {
        timeZoneOffSetOut = timeZoneOffSetn.substring(0,1) + "0" + timeZoneOffSetn.substring(1,5);
        return timeZoneOffSetOut;
    } else {
        return timeZoneOffSetn;
    }
}

function convertDateTimeToPOST(inDate, inTime) {
    if ((inDate != undefined && inDate != "") && (inTime == undefined || inTime == "")) {
        inTime = "08:00am";
    }
    if ((inTime != undefined && inTime != "") && (inDate == undefined || inDate == "")) {
        toastr.warning("Time set but no DATE!!!");
        thisFunctionDoesNotExistAndWasCreatedWithTheOnlyPurposeOfStopJavascriptExecutionOfAllTypesIncludingCatchAndAnyArbitraryWeirdScenario;
    }

    var patt = new RegExp("^\\d{4}-");
    let correctedDate = "";
    if (patt.test(inDate)){
        let in_year = inDate.substring(0,4);
        let in_month = inDate.substring(5,7);
        let in_day = inDate.substring(8,10);
        correctedDate = in_month + "-" + in_day + "-" + in_year;
    } else {
        correctedDate = inDate;
    }
    var combineDateTime = correctedDate + " " + inTime;
    combineDateTime = combineDateTime.replace(new RegExp('(\/)', 'g'),"-");
    var ampm = " " + combineDateTime.match(new RegExp('[A-Za-z]{2}$')) + " " + getTimeZoneOffSet();
    ampm = ampm.toUpperCase();
    combineDateTime = combineDateTime.replace(new RegExp('[A-Za-z]{2}$'), ampm);
    return combineDateTime;
}

function convertTimeFromJSON(inTime) {
    let hour = inTime.substring(0,2);
    let ampm = "AM";
    if (hour > 11) {
        ampm = "PM";
    }
    return ampm;
}

function convert24to12(inTime) {
    let timeSplit = inTime.match(/\d{2}/g);
    let hour = timeSplit[0];
    let min = timeSplit[1];
    if (hour < 12) {
        return inTime + "am";
    } else {
        hour = hour - 12;
        let newTime = hour + ":" + min + "pm";
    }
}


function formatDate(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return monthNames[monthIndex] + ' ' + day + ', ' + year;
}

console.log(formatDate(new Date()));
