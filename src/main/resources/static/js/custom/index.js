/**
 * Created by joeketcham on 10/8/2016.
 */

function appInit() {
    toastr.options.timeOut = 1750;
    window.onbeforeunload = function() { return "Alert: You're work will be lost if you continue."; };
    $( function() {
        $( "#dropOffDate" ).datepicker({ numberOfMonths: 2 });
        $( "#pickupDate" ).datepicker({ numberOfMonths: 2 });

    } );
}
function submitSearch() {
    var optionvalue = $("#searchOption").val();
    var searchvalue = $("#inputCustomer").val();
    var confirmText = "Attention: Appears your searching by phone, do you want to continue the Last Name Search?";
    if(optionvalue === 'findByLastname' && /^\d+$/.test(searchvalue)
        && !confirm(confirmText)) {
        return false;
    }
    $("#invoiceContainer").css('display', 'none');
    $("#linesContainer").css('display', 'none');
    goDataTableCustomers(optionvalue, searchvalue);
}

