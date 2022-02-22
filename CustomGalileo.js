e// ORIGINAL FILE TAKEN FROM https://www.assessmenttechnology.com/GalileoASP/ASPX/StudentCenter/TakeTest/TakeTestJS.js?v=06112021
// I DID NOT MAKE THE ORIGINAL FILE I JUST MODIFIED PLEASE DON'T SUE


var isMobile = false;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isMobile = true;
}

$(document).ready(function () {

    InitializeQuestionDDL();
    //initialize zoom and IF dropdowns as select2
    $('#ddlZoomSize').select2({
        minimumResultsForSearch: Infinity,
        width: 'auto'
    });

    $('.IFDropDownContainer').find('select').select2({
        minimumResultsForSearch: Infinity,
        width: 'auto'
    });

    //hide all br tags from screen readers
    $("br").attr("aria-hidden", "true");
});

function InitializeQuestionDDL() {
    //update the parent ddl with proper classes & text to show marked items
    UpdateQuestionDDL();

    //turn off all event handlers so we don't get duplicates
    $('#ddlQuestions2').off();

    //initialize question dropdown as select2
    $('#ddlQuestions2').select2({
        minimumResultsForSearch: Infinity,
        templateResult: function (data, container) {
            if (data.element) {
                $(container).addClass($(data.element).attr("class"));
            }
            return data.text;
        }
    });

    //set event handlers
    $('#ddlQuestions2').on('select2:open', function (evt) {
        SaveItemLogicQues(false);
    });

    $('#ddlQuestions2').on('select2:select', function (evt) {
        var isItemCollection = $('#hdnIsItemCollection').val();

        QuestionDropdownChanged(isItemCollection);

        $('.ddlQuestions .select2-hidden-accessible').val($('#ddlQuestions2').val()).trigger('change');

    });

}

//trying to get students to leave test via the exit test button instead of closing out the browser window, 
//but we also try to trigger a save if they close out of the test by closing browser or tab
function SaveTotalScore() {
    //do ajax call to save the test score
    //first get all needed paramaters
    var childID = $('#hdnChildID').val();
    var testID = $('#hdnTestID').val();
    var agencyID = $('#hdnAgencyID').val();
    var programID = $('#hdnProgramID').val();

    SaveItemLogicQues(true);

    $.ajax({
        type: "POST",
        url: "/GalileoASP/ASPX/Testing/WebServices/TestingServices.asmx/SaveTotalScore",
        data: "{ childID: '" + childID + "'," + "testID: '" + testID + "'," + "agencyID: '" + agencyID + "'," + "programID: '" + programID + "'," + "userID: '" + childID + "'" + "}",
        async: false, //needs to be false so the page doesn't close before the save is complete
        timeout: 2000,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
        },
        error: function (xhr) {
            alert(xhr.responseText);
        }

    });

}

function QuestionDropdownChanged(isItemCollection) {
    CancelWindowCloseCheck();
    TurnHighlightingOff(isItemCollection);
}

function BackToTestTypes(instPopupID) {

    ShowPopup('modalInstructionsForBenchmarkOrIE');
    $('#modalInstructionsForBenchmarkOrIE .close').focus();

    //close the sender popup
    $('#' + instPopupID).hide();

}

function LoadTEEM() {

    if (isMobile) {
        //hide the object and show the mobile message
        $('#radTEEMIframe').hide();
        $('#radTEEMIframeForIE').hide();
        $('#mobileMessageTEEM').show();
    } else {
        var objEmbed = document.getElementById("radTEEMIframe");
        var iframe = document.getElementById("radTEEMIframeForIE");

        if (isIE()) {

            iframe.src = "https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Student_Test_Instructions_TEEM.pdf";
            $('#radTEEMIframeForIE').show();
            $('#radTEEMIframe').hide();
        } else {
            objEmbed.setAttribute('data', 'https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Student_Test_Instructions_TEEM.pdf');

            $('#radTEEMIframe').show();
            $('#radTEEMIframeForIE').hide();
        }

        $('#mobileMessageTEEM').hide();
    }

    $('#modalTEEM').css({
        "height": "85vh"
    });
    //show this popup and close the old popup
    ShowPopup('modalTEEM');
    $('#modalTEEM .close').focus();

    //hide the old popup
    $('#modalInstructionsForBenchmarkOrIE').hide();

}

function LoadTEEL() {

    if (isMobile) {
        //hide the object and show the mobile message
        $('#radTEELIframe').hide();
        $('#radTEELIframeForIE').hide();
        $('#mobileMessageTEEL').show();
    } else {
        var objEmbed = document.getElementById("radTEELIframe");
        var iframe = document.getElementById("radTEELIframeForIE");

        if (isIE()) {

            iframe.src = "https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Student_Instructions_TEEL.pdf";
            $('#radTEELIframeForIE').show();
            $('#radTEELIframe').hide();
        } else {
            objEmbed.setAttribute('data', 'https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Student_Instructions_TEEL.pdf');

            $('#radTEELIframe').show();
            $('#radTEELIframeForIE').hide();
        }

        $('#mobileMessageTEEL').hide();
    }

    $('#modalTEEL').css({
        "height": "85vh"
    });
    //show this popup and close the old popup
    ShowPopup('modalTEEL')
    $('#modalTEEL .close').focus();

    //hide the old popup
    $('#modalInstructionsForBenchmarkOrIE').hide();

}

//function LoadFirstGradeTR() {

//    if (isMobile) {
//        //hide the object and show the mobile message
//        $('#radFirstGradeTRIframe').hide();
//        $('#radFirstGradeTRIframeForIE').hide();
//        $('#mobileMessageFirstGradeTR').show();
//    } else {
//        var objEmbed = document.getElementById("radFirstGradeTRIframe");
//        var iframe = document.getElementById("radFirstGradeTRIframeForIE");

//        if (isIE()) {

//            iframe.src = "https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Test_Instructions-Gr1_TR.pdf";
//            $('#radFirstGradeTRIframe').hide();
//            $('#radFirstGradeTRIframeForIE').show();
//        } else {
//            objEmbed.setAttribute('data', 'https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Test_Instructions-Gr1_TR.pdf');

//            $('#radFirstGradeTRIframe').show();
//            $('#radFirstGradeTRIframeForIE').hide();
//        }

//        $('#mobileMessageFirstGradeTR').hide();

//    }

//    $('#modalFirstGradeTR').css({
//        "height": "85vh"
//    });

//    //show this popup and close the old popup
//    ShowPopup('modalFirstGradeTR')
//    $('#modalFirstGradeTR .close').focus();

//    //hide the old popup
//    $('#modalInstructionsForBenchmarkOrIE').hide();

//}

function LoadFirstGradeTRSR() {

    if (isMobile) {
        //hide the object and show the mobile message
        $('#radFirstGradeTRSRIframe').hide();
        $('#radFirstGradeTRSRIframeForIE').hide();
        $('#mobileMessageFirstGradeTRSR').show();
    } else {
        var objEmbed = document.getElementById("radFirstGradeTRSRIframe");
        var iframe = document.getElementById("radFirstGradeTRSRIframeForIE");

        if (isIE()) {
            iframe.src = "https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Student_Instructions_TR.pdf";
            $('#radFirstGradeTRSRIframe').hide();
            $('#radFirstGradeTRSRIframeForIE').show();
        } else {
            objEmbed.setAttribute('data', 'https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Student_Instructions_TR.pdf');

            $('#radFirstGradeTRSRIframe').show();
            $('#radFirstGradeTRSRIframeForIE').hide();
        }

        $('#mobileMessageFirstGradeTRSR').hide();

    }

    $('#modalFirstGradeTRSR').css({
        "height": "85vh"
    });
    //show this popup and close the old popup
    ShowPopup('modalFirstGradeTRSR');
    $('#modalFirstGradeTRSR .close').focus();

    //hide the old popup
    $('#modalInstructionsForBenchmarkOrIE').hide();

}

function LoadSecondGrade() {

    if (isMobile) {
        //hide the object and show the mobile message
        $('#radSecondGradeIframe').hide();
        $('#radSecondGradeIframeForIE').hide();
        $('#mobileMessageSecondGrade').show();
    } else {
        var objEmbed = document.getElementById("radSecondGradeIframe");
        var iframe = document.getElementById("radSecondGradeIframeForIE");

        if (isIE()) {
            iframe.src = "https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Student_Instructions_2Grd_Up.pdf";
            $('#radSecondGradeIframe').hide();
            $('#radSecondGradeIframeForIE').show();
        } else {
            objEmbed.setAttribute('data', 'https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Student_Instructions_2Grd_Up.pdf');

            $('#radSecondGradeIframe').show();
            $('#radSecondGradeIframeForIE').hide();
        }

        $('#mobileMessageSecondGrade').hide();

    }

    $('#modalSecondGrade').css({
        "height": "85vh"
    });

    //show this popup and close the old popup
    ShowPopup('modalSecondGrade');
    $('#modalSecondGrade .close').focus();

    //hide the old popup
    $('#modalInstructionsForBenchmarkOrIE').hide();

}

function LoadSpanish2Up() {
    if (isMobile) {
        //hide the object and show the mobile message
        $('#radSecondGradeIframe').hide();
        $('#radSecondGradeIframeForIE').hide();
        $('#mobileMessageSecondGrade').show();
    } else {
        var objEmbed = document.getElementById("radSecondGradeIframe");
        var iframe = document.getElementById("radSecondGradeIframeForIE");

        if (isIE()) {
            iframe.src = "https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Spanish_Student_Instructions_2Grd_Up.pdf";
            $('#radSecondGradeIframe').hide();
            $('#radSecondGradeIframeForIE').show();
        } else {
            objEmbed.setAttribute('data', 'https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Spanish_Student_Instructions_2Grd_Up.pdf');

            $('#radSecondGradeIframe').show();
            $('#radSecondGradeIframeForIE').hide();
        }

        $('#mobileMessageSecondGrade').hide();

    }

    $('#modalSecondGrade').css({
        "height": "85vh"
    });

    //show this popup and close the old popup
    ShowPopup('modalSecondGrade');
    $('#modalSecondGrade .close').focus();

    //hide the old popup
    $('#modalInstructionsForBenchmarkOrIE').hide();
}

function LoadSpanishK1() {
    if (isMobile) {
        //hide the object and show the mobile message
        $('#radFirstGradeTRSRIframe').hide();
        $('#radFirstGradeTRSRIframeForIE').hide();
        $('#mobileMessageFirstGradeTRSR').show();
    } else {
        var objEmbed = document.getElementById("radFirstGradeTRSRIframe");
        var iframe = document.getElementById("radFirstGradeTRSRIframeForIE");

        if (isIE()) {
            iframe.src = "https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Spanish_Student_Instructions_K-1.pdf";
            $('#radFirstGradeTRSRIframe').hide();
            $('#radFirstGradeTRSRIframeForIE').show();
        } else {
            objEmbed.setAttribute('data', 'https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Spanish_Student_Instructions_K-1.pdf');

            $('#radFirstGradeTRSRIframe').show();
            $('#radFirstGradeTRSRIframeForIE').hide();
        }

        $('#mobileMessageFirstGradeTRSR').hide();

    }

    $('#modalFirstGradeTRSR').css({
        "height": "85vh"
    });
    //show this popup and close the old popup
    ShowPopup('modalFirstGradeTRSR');
    $('#modalFirstGradeTRSR .close').focus();

    //hide the old popup
    $('#modalInstructionsForBenchmarkOrIE').hide();
}

function LoadSpanishELAfrKto1() {
    if (isMobile) {
        //hide the object and show the mobile message
        $('#radFirstGradeTRSRIframe').hide();
        $('#radFirstGradeTRSRIframeForIE').hide();
        $('#mobileMessageFirstGradeTRSR').show();
    } else {
        var objEmbed = document.getElementById("radFirstGradeTRSRIframe");
        var iframe = document.getElementById("radFirstGradeTRSRIframeForIE");

        if (isIE()) {
            iframe.src = "https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Spanish_Student_Instructions_K-1.pdf";
            $('#radFirstGradeTRSRIframe').hide();
            $('#radFirstGradeTRSRIframeForIE').show();
        } else {

            objEmbed.setAttribute('data', 'https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Spanish_Student_Instructions_K-1.pdf');

            $('#radFirstGradeTRSRIframe').show();
            $('#radFirstGradeTRSRIframeForIE').hide();
        }

        $('#mobileMessageFirstGradeTRSR').hide();

    }

    $('#modalFirstGradeTRSR').css({
        "height": "85vh"
    });
    //show this popup and close the old popup
    ShowPopup('modalFirstGradeTRSR');
    $('#modalFirstGradeTRSR .close').focus();

    //hide the old popup
    $('#modalInstructionsForBenchmarkOrIE').hide();
}

function LoadSpanishELA2Up() {
    if (isMobile) {
        //hide the object and show the mobile message
        $('#radFirstGradeTRSRIframe').hide();
        $('#radFirstGradeTRSRIframeForIE').hide();
        $('#mobileMessageFirstGradeTRSR').show();
    } else {
        var objEmbed = document.getElementById("radFirstGradeTRSRIframe");
        var iframe = document.getElementById("radFirstGradeTRSRIframeForIE");

        if (isIE()) {
            iframe.src = "https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Spanish_Student_Instructions_2Grd_Up.pdf";
            $('#radFirstGradeTRSRIframe').hide();
            $('#radFirstGradeTRSRIframeForIE').show();
        } else {
            objEmbed.setAttribute('data', 'https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Spanish_Student_Instructions_2Grd_Up.pdf');

            $('#radFirstGradeTRSRIframe').show();
            $('#radFirstGradeTRSRIframeForIE').hide();
        }

        $('#mobileMessageFirstGradeTRSR').hide();

    }

    $('#modalFirstGradeTRSR').css({
        "height": "85vh"
    });
    //show this popup and close the old popup
    ShowPopup('modalFirstGradeTRSR');
    $('#modalFirstGradeTRSR .close').focus();

    //hide the old popup
    $('#modalInstructionsForBenchmarkOrIE').hide();
}

function LoadDyslexia() {
    if (isMobile) {
        //hide the object and show the mobile message
        $('#radFirstGradeTRSRIframe').hide();
        $('#radFirstGradeTRSRIframeForIE').hide();
        $('#mobileMessageFirstGradeTRSR').show();
    } else {
        var objEmbed = document.getElementById("radFirstGradeTRSRIframe");
        var iframe = document.getElementById("radFirstGradeTRSRIframeForIE");

        if (isIE()) {
            iframe.src = "https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Teacher_Script_Dyslexia_Screener.pdf";
            $('#radFirstGradeTRSRIframe').hide();
            $('#radFirstGradeTRSRIframeForIE').show();
        } else {
            objEmbed.setAttribute('data', 'https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Teacher_Script_Dyslexia_Screener.pdf');

            $('#radFirstGradeTRSRIframe').show();
            $('#radFirstGradeTRSRIframeForIE').hide();
        }

        $('#mobileMessageFirstGradeTRSR').hide();

    }

    $('#modalFirstGradeTRSR').css({
        "height": "85vh"
    });
    //show this popup and close the old popup
    ShowPopup('modalFirstGradeTRSR');
    $('#modalFirstGradeTRSR .close').focus();

    //hide the old popup
    $('#modalInstructionsForBenchmarkOrIE').hide();
}

function OpenInstructions() {
    $('#modalInstructions').css({
        "width": "450px",
        "height": "500px"
    });

    ShowPopup('modalInstructions')
    $('#modalInstructions .close').focus();

}

function OpenInstructionsForBenchmarkOrIE() {
    $('#modalInstructionsForBenchmarkOrIE').css({
        "width": "450px",
        "height": "500px"
    });

    ShowPopup('modalInstructionsForBenchmarkOrIE')
    $('#modalInstructionsForBenchmarkOrIE .close').focus();
}

function OpenHelp() {

    if (isMobile) {
        //hide the object and show the mobile message
        $('#radHelpIframe').hide();
        $('#radHelpIframeForIE').hide();
        $('#mobileMessageHelp').show();
    } else {
        var objEmbed = document.getElementById("radHelpIframe");
        var iframe = document.getElementById("radHelpIframeForIE");

        if (isIE()) {
            iframe.src = "https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Online_Student_Tools.pdf";
            $('#radHelpIframe').hide();
            $('#radHelpIframeForIE').show();
        } else {
            objEmbed.setAttribute('data', 'https://galileocurriculum.s3-us-west-1.amazonaws.com/GalileoPublicFiles/Online_Student_Tools.pdf');

            $('#radHelpIframe').show();
            $('#radHelpIframeForIE').hide();
        }

        $('#mobileMessageHelp').hide();

    }

    $('#modalHelp').css({
        "height": "85vh"
    });

    ShowPopup('modalHelp');
    $('#modalHelp .close').focus();
}

if (isMobile) {
    //alert("is mobile im a mobile browser");
    //for ios devices running safari
    window.addEventListener("pagehide", SaveTotalScore);
    //for other mobile browsers
    //page.addEventListener("onunload", SaveTotalScore);

} else {

    window.onbeforeunload = function (event) {
        // don't show the message if the user is clicking the Review button
        if (document.activeElement.id != "ExitTest" && document.activeElement.id != "exitIcon") {
            SaveTotalScore();

            var message = 'Important: Any changes made on this page may not be saved. ' +
                          'Please click on the \'Review & Exit\' button to review your answers and exit the test.';

            if (typeof event == 'undefined') {
                event = window.event;
            }
            if (event) {
                event.returnValue = message;
            }

            return message;
        }
        else {
            event = window.event;
        }
    };
}

//we set these on click event functions on the page load
//we don't want the above message to happen on certain postback events
//the Cancel function is also called when the item dropdown selection is changed
$("a").click(function () { //any anchor on the page gets this event attached
    CancelWindowCloseCheck();
});

function CancelWindowCloseCheck() {
    window.onbeforeunload = null;
    window.removeEventListener("pagehide", SaveTotalScore);
    //page.removeEventListener("onunload", SaveTotalScore);

}

function readStudentIDsCookie(name) {
    //we have to look through the StudentIDs to find each value
    //the list is structured like a query string

    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        if (c.indexOf('StudentIDs') != -1) {
            //find the name in the string and get the value
            var startPosition = c.search(nameEQ);
            var endPosition = startPosition + nameEQ.length;

            var subString = c.substring(endPosition, c.length - 1)
            var endValueIndex = subString.indexOf('&');
            var value;

            if (endValueIndex == -1) {
                //we return to the end of the string
                endValueIndex = subString.length - 1;
            }

            return subString.substring(0, endValueIndex);
        }
    }

    return null;
}

function CheckTestLocation(direction) {
    //check if it's okay to move forward or backward
    //extra layer of protection 
    var selectedIndex = $('#ddlQuestions2').val() - 1;

    if (selectedIndex === 0 && direction === 'backward') {
        //we are at the beginning and can't move backward anymore
        return false;
    } else {
        // go ahead and move to requested question
        return true;
    }
}

function SaveItemLogicQues(exitTest, clickedID) {
    
    var isItemLogicQues;

    isItemLogicQues = document.getElementById("hdnIsItemLogicQues").value;

    // only call this function from the ItemLogic user control if the 
    // question is an ItemLogic Question, no need to do the work otherwise
    if (isItemLogicQues == "true") {
        SaveItemLogicQuestionFromTakeTest(exitTest, clickedID);
    }
    else {
        ClickHiddenNavigationButton(clickedID);
    }
}

// this fucntion fires the click or change events for the hidden
// controls on the TakeTest page to execute server side code
// because in ItemLogic we have client side callbacks and we need  
// to handle these event and fire them when needed
function ClickHiddenNavigationButton(clickedID) {
    switch (clickedID) {
        case "btnNext":
            $("#btnHiddenNextToNavigate").click();

            break;
        case "btnPrevious":
            $("#btnHiddenPrevToNavigate").click();

            break;
        case "exitIcon":
            $("#btnHiddenExitToNavigate").click();

            break;
        case "ddlQuestions2":
            var isItemCollection = $('#hdnIsItemCollection').val();

            QuestionDropdownChanged(isItemCollection);

            $('.ddlQuestions .select2-hidden-accessible').val($('#ddlQuestions2').val()).trigger('change');

            break;
        default:
            // never should be here
    }
}

function OpenCalculator(calculatorType) {
    var url = "";

    $('#modalCalculator .modal-body').css({
        "padding": "0"
    });

    if (calculatorType == 'BasicCalculator') {
        $('#calculatorIframe').css({
            "width": "285px",
            "height": "270px"
        });

        url = '/GalileoASP/ASPX/StudentCenter/TakeTest/Calculators/GraphingCalculator/TDSCalculator.html?mode=StandardMem';

        $('#calculatorIframe').attr('src', url);

        if (isMobile) {
            $('#modalCalculator').css({
                "width": "345px",
                "height": "365px"
            });
        } else {
            $('#modalCalculator').css({
                "width": "285px",
                "height": "310px"
            });

        }

    }
    else if (calculatorType == 'ScientificCalculator') {
        $('#calculatorIframe').css({
            "width": "370px",
            "height": "460px"
        });

        url = '/GalileoASP/ASPX/StudentCenter/TakeTest/Calculators/GraphingCalculator/TDSCalculator.html?mode=ScientificInv';

        $('#calculatorIframe').attr('src', url);
        $('#modalCalculator').css({
            "width": "347px",
            "height": "430px"
        });
    }
    else if (calculatorType == 'GraphingCalculator') {
        $('#calculatorIframe').css({
            "width": "700px",
            "height": "520px"
        });

        url = '/GalileoASP/ASPX/StudentCenter/TakeTest/Calculators/GraphingCalculator/TDSCalculator.html?mode=ScientificInv,GraphingInv,Regression';

        $('#calculatorIframe').attr('src', url);
        $('#modalCalculator').css({
            "width": "677px",
            "height": "508px",
            "background-color": "#e6e6e6"
        });
    }
    else {
        return alert('Invalid Calculator Type.');
    }


    if (!isMobile) {
        //make popup draggable
        $('#modalCalculator').drags({
            handle: ".modal-header"
        });
    }

    //show popup
    ShowPopup('modalCalculator');

}



//<!-- Zoom Feature always available-->

var currentItemType = parseInt($('#hdnQuestionType').val());

var g_divMain = $("#itemPlaceholder");
var g_iframeForCustomHtml = $('#CustomHTML_frameControl');
var g_hidCurrentZoom = $("#hidCurrentZoom").val();
var g_width_1_0 = "100%";
var g_width_1_5 = "66%";
var g_width_1_75 = "57%";
var g_width_1_75_IE = "58%";
var g_width_2_5 = "40%";
var g_width_2_5_IE = "40%";
var g_width_3_0 = "33%";


//if the item type isn't CTE(18) or SEQ(16) or ItemLogic(20) 
if (currentItemType == 16 || currentItemType == 18 || currentItemType == 20) {
    //we want to disable the zoom dropdown, change tooltip, and switch out the zoom icon
    $('#ddlZoomSize').prop("disabled", true);
    $('#ddlZoomSize').prop("title", "Zoom is not supported for this item.");
    $('#ddlZoomSize').css("cursor", "not-allowed");
    $('#tblZoomTools div').html('<i class="fa fa-search-plus GrayIcon" style="font-size: 16px;" aria-hidden="true"></i><i class="fa fa-ban RedIcon" style="font-size: 20px; margin-left: -15px;" aria-hidden="true"></i>');

    if (currentItemType == 20) {
        $('#ddlZoomSize').css('width', 'auto');
    }
} else {
    $('#ddlZoomSize').prop("disabled", false);
    $('#ddlZoomSize').prop("title", "Change Item Zoom Level");
    $('#ddlZoomSize').css("cursor", "pointer");
    $('#tblZoomTools div').html('<i class="fa fa-search-plus BlueIcon" aria-hidden="true"></i>');
}

//set initial zoom
if (g_hidCurrentZoom != "1") {
    SetZoom(g_hidCurrentZoom);

    // this code handles the iframe zoom in/out for custom html items
    //we are not going to support zoom for H5 items right now
    //g_iframeForCustomHtml.load(function () {
    //    if (g_iframeForCustomHtml != null && g_iframeForCustomHtml != undefined) {
    //        if (document.getElementById("CustomHTML_frameControl") != null) {
    //            document.getElementById("CustomHTML_frameControl").contentWindow.postMessage(g_hidCurrentZoom, document.getElementById("CustomHTML_frameControl").src);
    //        }
    //    }
    //});

}

//set zoom when dropdown is changed
$('#ddlZoomSize').change(function () {
    var g_ddlZoomLevel = $('#ddlZoomSize').val();
    g_ddlZoomLevel = (parseFloat(g_ddlZoomLevel) + parseFloat(.0)).toFixed(2);
    $("#hidCurrentZoom").val(parseFloat(g_ddlZoomLevel));

    SetZoom(g_ddlZoomLevel);

    // this code handles the iframe zoom in/out for custom html items
    //we are not going to support zoom for H5 items right now
    //if (g_iframeForCustomHtml != null && g_iframeForCustomHtml != undefined) {
    //    if (document.getElementById("CustomHTML_frameControl") != null) {
    //        document.getElementById("CustomHTML_frameControl").contentWindow.postMessage(g_ddlZoomLevel, document.getElementById("CustomHTML_frameControl").src);
    //    }
    //}
});

function isIE(userAgent) {
    userAgent = userAgent || navigator.userAgent;
    return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("Edge/") > -1;
}


function SetZoom(zoomValue) {
    if (currentItemType != 16 && currentItemType != 18 && currentItemType != 20) {

        // set the zoom level
        g_divMain.css('zoom', zoomValue);
        g_divMain.css('-ms-zoom', zoomValue);
        g_divMain.css('-webkit-zoom', zoomValue);
        g_divMain.css('-moz-transform', 'scale(' + zoomValue + ')');
        g_divMain.css('-moz-transform-origin', '0 0');

        if (navigator.userAgent.search("Firefox") >= 0) {
            if (zoomValue == 1.0) {
                g_divMain.css('max-width', g_width_1_0);
                g_divMain.css('max-height', g_width_1_0);
            }
            else if (zoomValue == 1.5) {
                g_divMain.css('max-width', g_width_1_5);
                g_divMain.css('max-height', g_width_1_5);
            }
            else if (zoomValue == 1.7) {
                g_divMain.css('max-width', g_width_1_75);
                g_divMain.css('max-height', g_width_1_75);
            }
            else if (zoomValue == 2.5) {
                g_divMain.css('max-width', g_width_2_5);
                g_divMain.css('max-height', g_width_2_5);
            }
            else if (zoomValue == 3.0) {
                g_divMain.css('max-width', g_width_3_0);
                g_divMain.css('max-height', g_width_3_0);
            }
            else {
                g_divMain.css('max-width', g_width_1_0);
                g_divMain.css('max-height', g_width_1_0);
            }
        }

        if (isIE()) {
            if (zoomValue == 1.0) {
                g_divMain.css('max-width', g_width_1_0);
                g_divMain.css('max-height', g_width_1_0);
            }
            else if (zoomValue == 1.5) {
                g_divMain.css('max-width', g_width_1_5);
                g_divMain.css('max-height', g_width_1_5);
            }
            else if (zoomValue == 1.7) {
                g_divMain.css('max-width', g_width_1_75_IE);
                g_divMain.css('max-height', g_width_1_75_IE);
            }
            else if (zoomValue == 2.5) {
                g_divMain.css('max-width', g_width_2_5_IE);
                g_divMain.css('max-height', g_width_2_5_IE);
            }
            else if (zoomValue == 3.0) {
                g_divMain.css('max-width', g_width_3_0);
                g_divMain.css('max-height', g_width_3_0);
            }
            else {
                g_divMain.css('max-width', g_width_1_0);
                g_divMain.css('max-height', g_width_1_0);
            }
        }


        // Fix the flyout menu
        if (zoomValue == 1) {
            $('.FlyoutMenu').removeClass('zoom-top-60');
            $('.FlyoutMenu').addClass('zoom-top-0');
        }
        else {
            $('.FlyoutMenu').removeClass('zoom-top-0');
            $('.FlyoutMenu').addClass('zoom-top-60');
        }

        //fix item family dropdown width
        if (zoomValue == 1) {
            $('.IFDropDownContainer select').css('max-width', '300px');
        }
        else if (zoomValue == 1.5) {
            $('.IFDropDownContainer select').css('max-width', '200px');
        }
        else if (zoomValue == 1.7) {
            $('.IFDropDownContainer select').css('max-width', '150px');
        }
        else if (zoomValue == 2.5 || zoomValue == 3) {
            $('.IFDropDownContainer select').css('max-width', '100px');
        }

        //set any rad editor content area zoom if Mobile
        if (isMobile) {
            var zoomLevel;
            switch (zoomValue) {
                case "1.0":
                    zoomLevel = "100%";
                    break;
                case "1.5":
                    zoomLevel = "105%";
                    break;
                case "1.7":
                    zoomLevel = "110%";
                    break;
                case "2.5":
                    zoomLevel = "115%";
                    break;
                case "3.0":
                    zoomLevel = "120%";
                    break;
                default:
                    zoomLevel = "100%";
            }

            setTimeout(function () {

                $('.reContentArea').css("zoom", zoomLevel);
                $('.reContentArea').css('zoom', zoomLevel);
                $('.reContentArea').css('-ms-zoom', zoomLevel);
                $('.reContentArea').css('-webkit-zoom', zoomLevel);
                $('.reContentArea').css('-moz-transform', 'scale(' + zoomLevel + ')');
                $('.reContentArea').css('-moz-transform-origin', '0 0');


            }, 5);

        }

        //make sure the zoom dropdown gets set with the hdn zoom value
        $('#ddlZoomSize option[value="' + (parseFloat($("#hidCurrentZoom").val()) + parseFloat(.0)).toFixed(1) + '"]').prop('selected', true);

    } else {
        //make sure the zoom dropdown gets set with the hdn zoom value
        $('#ddlZoomSize option[value="' + (parseFloat($("#hidCurrentZoom").val()) + parseFloat(.0)).toFixed(1) + '"]').prop('selected', true);
    }
}



//<%-- Timed Test - Play/Pause Feature --%>
var g_childID = "";
var g_testID = "";
var g_scheduleID = "";
var g_testTimerID = "";
var g_timer = null;
var g_interval = 1000;
var g_saveInterval = 60; // timer informer information saved every one minute (60 seconds)

// tblTestTimer = TestLocked(True, False)
var TEST_TIMER_UP_FALSE = 0;
var TEST_TIMER_UP_TRUE = 1;

// tblTestTimer = Student Status
var ENUMS_TEST_TIMER_STATUS_STUDENT_PAUSE = 0;
var ENUMS_TEST_TIMER_STATUS_STUDENT_PLAY = 1;

// tblTestTimer = Teacher Status
var ENUMS_TEST_TIMER_STATUS_TEACHER_PAUSE = 0;
var ENUMS_TEST_TIMER_STATUS_TEACHER_PLAY = 1;
var ENUMS_TEST_TIMER_STATUS_TEACHER_NONE = 2;

function ShowAlertAndRedirect(header, message, postUrl) {
    // Clear timer and interval
    clearInterval(g_timer);
    g_timer = null;

    // Add spinner around the form tag to prevent students from clicking on any controls.
    $('.overlay').show();
    $('.overlay').addClass('csspinner');
    $('.overlay').addClass('no-overlay');

    // Remove any window listeners because we want to navigate
    // away from this page when this event is fired.
    window.onbeforeunload = null;
    window.removeEventListener("pagehide", SaveTotalScore);

    swal({
        title: header,
        text: message,
        type: "warning",
        timer: 3000,
        showConfirmButton: false,
        showCancelButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        html: true
    },
    function () {
        // Redirect them to the review and exit page
        location.href = postUrl;
    });
}

function SetTimer(timeElapsed) {
    if (g_timer !== null) {
        return;
    }

    g_timer = setInterval(function () {
        // Update timer clock
        timeElapsed = parseInt(timeElapsed) + 1;
        $("#hdnTestTimeElapsed").val(timeElapsed);

        // Show updated time
        ShowTime();

        // If the timer hits it's max limit (meaning time is up for the
        
        // Remove test locking if time is up
        
//         if (parseInt(timeElapsed) >= parseInt($("#hdnTotalTestTimeInMinutes").val()) * 60) {
//             // Pause the test (Status = 0)
//             $("#hdnTimerStudentStatus").val(ENUMS_TEST_TIMER_STATUS_STUDENT_PAUSE);

//             // Lock the 
//             // $("#hdnIsTestTimeUp").val(TEST_TIMER_UP_TRUE);

//             // Update the test timer and test log
//             UpdateTestTimer(g_testTimerID,
//                             timeElapsed,
//                             ENUMS_TEST_TIMER_STATUS_STUDENT_PAUSE,
//                             TEST_TIMER_UP_TRUE);

//             var header = '<hr/>Test time is up.';
//             var msg = '<b>You will be redirected to the student center...</b>';
//             var postUrl = '/GalileoASP/ASPX/StudentCenter/StudentCenterRedirectFromGalileo.aspx';

//             // Call the validate method to handle routing
//             ShowAlertAndRedirect(header, msg, postUrl);
//         }
            // Update the time every 60 seconds under 2 conditions - 
            // Case 1 - Only when the test is in "Play Mode" (Status = 1)
            // Case 2 - Only when the test is not locked (TestLocked = 0)
        if (parseInt(timeElapsed) % g_saveInterval == 0 &&
                 parseInt($("#hdnTimerStudentStatus").val()) == ENUMS_TEST_TIMER_STATUS_STUDENT_PLAY &&
                 ((parseInt($("#hdnTimerTeacherStatus").val()) == ENUMS_TEST_TIMER_STATUS_TEACHER_NONE) ||
                 (parseInt($("#hdnTimerTeacherStatus").val()) == ENUMS_TEST_TIMER_STATUS_TEACHER_PLAY)) &&
                 parseInt($("#hdnIsTestTimeUp").val()) == TEST_TIMER_UP_FALSE) {

            var timeDiff = parseInt($("#hdnTotalTestTimeInMinutes").val()) * 60 - parseInt(timeElapsed);
            // if time difference is less than 10 minutes
            if (timeDiff <= 600) {
                $('#lblTestTimer').css({ 'color': 'red' });
            }
        }
           // Remove teacher being able to pause test
        
//         else if (parseInt($("#hdnTimerTeacherStatus").val()) == ENUMS_TEST_TIMER_STATUS_TEACHER_PAUSE) {
//             // Show an alert to the students informing them that test is paused by the teacher
//             var header = '<hr/>Test paused by your teacher.';
//             var msg = '<b>You will be redirected to the Student Center...</b>';
//             var postUrl = '/GalileoASP/ASPX/StudentCenter/StudentCenterRedirectFromGalileo.aspx';

//             // Call the validate method to handle routing
//             ShowAlertAndRedirect(header, msg, postUrl);
//         }
    },
    g_interval);
}

$(document).ready(function () {
    // Set the fields
    g_childID = $("#hdnChildID").val();
    g_testID = $("#hdnTestID").val();
    g_testTimerID = $('#hdnTestTimerID').val();
    g_scheduleID = $('#hdnScheduleID').val();

    var isTimedTest = $('#hdnShowTestTimer').val();

    if (isTimedTest == 1) {
        // Remove test locking
//         if (parseInt($("#hdnIsTestTimeUp").val()) == TEST_TIMER_UP_FALSE) // Check whether the test is locked
//         {
//             if ((parseInt($("#hdnTimerStudentStatus").val()) == ENUMS_TEST_TIMER_STATUS_STUDENT_PLAY) &&
//                 ((parseInt($("#hdnTimerTeacherStatus").val()) == ENUMS_TEST_TIMER_STATUS_TEACHER_NONE) ||
//                 (parseInt($("#hdnTimerTeacherStatus").val()) == ENUMS_TEST_TIMER_STATUS_TEACHER_PLAY))) {
//                 SetTimer($("#hdnTestTimeElapsed").val());

//                 UpdateTestTimer(g_testTimerID,
//                                 parseInt($("#hdnTestTimeElapsed").val()),
//                                 ENUMS_TEST_TIMER_STATUS_STUDENT_PLAY,
//                                 TEST_TIMER_UP_FALSE);
//             }
//             else {
//                 //This means that the test is paused by the teacher. In this case, we want
//                 // to show them a alert that test is paused by teacher and send them back to the
//                 // student center.
//                 // Show an alert to the students informing them that test is paused by the teacher
//                 var header = '<hr/>Test paused by your teacher.';
//                 var msg = '<b>You will be redirected back to the Student Center...</b>';
//                 var postUrl = '/GalileoASP/ASPX/StudentCenter/StudentCenterRedirectFromGalileo.aspx';

//                 // Call the validate method to handle routing
//                 ShowAlertAndRedirect(header, msg, postUrl);
//             }
//         }
//         else {
//             //If the test is locked (meaning the time is up); we probably dont even want to allow them
//             // into this test. Somehow, they make it here; then we want to show them a message and send them
//             // back to the student center.

//             // Case when the test time is up. We will probably want to
//             // redirect to the student center.
//             var header = '<hr/>Test time is up.';
//             var msg = '<b>You will be redirected to the Student Center...</b>';
//             var postUrl = '/GalileoASP/ASPX/StudentCenter/StudentCenterRedirectFromGalileo.aspx';

//             // Call the validate method to handle routing
//             ShowAlertAndRedirect(header, msg, postUrl);
//         }

        // Show timer
        ShowTime();
    }
});

// Pause Button Event - This will show an alert and redirect the students
// back to the student center. It will also update the last time stamp and
// time elapsed for the child.
$("#btnTimerPause").click(function (e) {
    var pauseMsg = "<hr/><b>Are you sure you want to pause the test?</b>";

    swal({
        title: "Need a break?",
        text: pauseMsg,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3b5998",
        confirmButtonText: "Yes, pause my test!",
        closeOnConfirm: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        html: true
    },
    function () {
        swal({
            title: "Please wait...",
            text: "<b>You are being redirected to the Student Center...</b>",
            showConfirmButton: false,
            showCancelButton: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            html: true
        });

        // Add spinner around the form tag to prevent students from clicking on any controls.
        $('.overlay').show();
        $('.overlay').addClass('csspinner');
        $('.overlay').addClass('no-overlay');

        clearInterval(g_timer);
        g_timer = null;

        // Remove any window listeners because we want to navigate
        // away from this page when this event is fired.
        window.onbeforeunload = null;
        window.removeEventListener("pagehide", SaveTotalScore);

        UpdateTestTimer(g_testTimerID,
                        parseInt($("#hdnTestTimeElapsed").val()),
                        ENUMS_TEST_TIMER_STATUS_STUDENT_PAUSE,
                        TEST_TIMER_UP_FALSE);

        // Redirect them back to the student center
        location.href = '/GalileoASP/ASPX/StudentCenter/StudentCenterRedirectFromGalileo.aspx';
    });
});

// This function will format the time elapsed into HH:MM:SS format and will 
// display it in the interface.
function ShowTime() {
    var totalTestTimeInSecs = parseInt(parseInt($("#hdnTotalTestTimeInMinutes").val()) * 60);
    var totalTimeElapsedInSecs = parseInt($("#hdnTestTimeElapsed").val());
    var totalSec = totalTestTimeInSecs - totalTimeElapsedInSecs;
    var hours = parseInt(parseInt(totalSec) / 3600);
    var mins = parseInt((parseInt(totalSec) % 3600) / 60);
    var secs = parseInt((parseInt(totalSec) % 3600) % 60);

    if (hours.toString().length == 1) {
        hours = '0' + hours.toString();
    }

    if (mins.toString().length == 1) {
        mins = '0' + mins.toString();
    }

    if (secs.toString().length == 1) {
        secs = '0' + secs.toString();
    }

    var timeDiff = parseInt($("#hdnTotalTestTimeInMinutes").val()) * 60 - totalTimeElapsedInSecs;
    // if time difference is less than 10 minutes
    if (timeDiff <= 600) {
        $('#lblTestTimer').css({ 'color': 'red' });
    }

    if (hours < 0 || mins < 0 || secs < 0) {
        $("#lblTestTimer").text('00:00:00');
    }
    else {
        $("#lblTestTimer").text(hours + ':' + mins + ':' + secs);
    }
}

function UpdateTestTimer(timerID,
                         timeElapsed,
                         studentStatus,
                         isTimeUp) {
    //Note: The Async on this one is set to false because we want to make sure
    // that any activity happens only after the timer is updated. There were some
    //issues when the timer was not getting updated and redirect happened too quicky.
    // Let me know if there are any questions. Thx, Manish
    $.ajax({
        type: "POST",
        url: '/GalileoASP/TakeTestServices/UpdateTestTimer',
        data:
             JSON.stringify({
                 timerID: timerID,
                 timeElapsed: timeElapsed,
                 studentStatus: studentStatus,
                 isTimeUp: isTimeUp
             }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        async: false,
        success: function (data) {
            // ignore this.. we may need it later, but since
            // polling is removed it just help us right now.
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // ???? galileo devs on crack?
            // eat this error..
        }
    });
}


//<!-- Dictionary/Thesaurus -->
var g_searchResultModel = null;
var g_thesaurusResultModel = null;

// Function to launch the dictionary/thesaurus modal
function OpenDictionary() {

    ShowPopup('modalDictionary');
    $('#txtSearchWord').focus();
}

$('#txtSearchWord').on('keypress', function (e) {
    if (e.which === 13) {
        DictionaryButtonClicked();
        return false;
    }
});

// This function will handle everything related to the
// word search (including making a call the API).
function DictionaryButtonClicked() {
    $('#divShowResults').addClass('csspinner standard');

    //Clear (necc divs)
    $('#divRunOnWords').html("");

    // set the label
    $('#spnSearchedForLabel').text("Dictionary");

    // Get the word and if it's empty exit out of the function
    var searchWord = $('#txtSearchWord').val();

    if (searchWord == "") {
        // Show a popup indicating the invalid word
        swal({
            title: "Oops.. Something went wrong!",
            text: "You must enter a valid word.",
            type: "error",
            confirmButtonColor: "#3b5998",
            confirmButtonText: "Close"
        });
        return false;
    }

    // Call the Merriam-Webster API and get the result model
    // to populate the modal with search results
    $.ajax({
        type: "POST",
        url: '/GalileoASP/TakeTestServices/GetDictionaryWordItem',
        data:
             JSON.stringify({
                 testID: $("#hdnTestID").val(),
                 word: searchWord,
                 childID: $('#hdnChildID').val()
             }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        async: true,
        success: function (data) {
            // Store the result set in the global variable
            g_searchResultModel = data;

            if (data.length != undefined && data.length != null) {
                // if at least one entry  is found.. populate the modal
                if (data.length > 0) {
                    var entryListHtml = "<div style='padding-left:2px'>";
                    for (var i = 0; i < data.length; i++) {
                        entryListHtml += "<a href='javascript:;' onclick='ShowWordResult(" + data[i].EntryID + ")' style='font-size:16px; text-decoration:none'>" + data[i].EntryWord + "</a><br/>";
                    }
                    entryListHtml += "</div>";

                    // Update the found entry count and write out all
                    // the found words in the "Entries Found" box
                    $('#spnFoundEntriesCount').text(data.length + " entries found:");
                    $('#divAllFoundEntries').html(entryListHtml);

                    $('#divSuggestions').hide();
                    $('#divShowResults').show();

                    // Show the result set for the first word (by default)
                    ShowWordResult(data[0].EntryID);
                }
            }
            else if (data.SuggestionsList.length > 0) {
                //No data found.. check for suggestions
                var suggestionList = data.SuggestionsList;
                var suggestionHtml = "";
                suggestionHtml += "<h4>";
                suggestionHtml += "The word you've entered isn't in the dictionary.";
                suggestionHtml += "Please try one of the following words below by using the search bar above."
                suggestionHtml += "</h4><br/>";
                suggestionHtml += "<ul style='margin-left:20px'>";

                for (var i = 0; i < suggestionList.length; i++) {
                    suggestionHtml += "<li><div style='font-size:14px'>" + suggestionList[i] + "</div></li>";
                }
                suggestionHtml += "</ul><br/>";
                $('#divSuggestions').html(suggestionHtml);
                $('#divSuggestions').show();
                $('#divShowResults').hide();
            }
            else {
                var noResultsFoundHtml = "<h4>";
                noResultsFoundHtml += "No results found. The word you have entered is not found in the dictionary.";
                noResultsFoundHtml += "</h4><br/>";

                $('#divSuggestions').html(noResultsFoundHtml);
                $('#divSuggestions').show();
                $('#divShowResults').hide();

                $('#divThesaurusResults').hide();
                $('#divDicResults').show();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // eat this error..
            // Show a popup indicating the delete status
            swal({
                title: "Oops.. Something went wrong!",
                text: "An error occurred while searching the word.",
                type: "error",
                confirmButtonColor: "#3b5998",
                confirmButtonText: "Close"
            });
        }
    });

    // Stop spinner
    $('#divShowResults').removeClass('csspinner standard');
}

// This function will handle everything related to the
// word search (including making a call the API).
function ThesaurusButtonClicked() {
    g_thesaurusResultModel = null;

    //Clear (necc divs)
    $('#divRunOnWords').html("");

    // set the label
    $('#spnSearchedForLabel').text("Thesaurus");

    // Get the word and if it's empty exit out of the function
    var searchWord = $('#txtSearchWord').val();

    if (searchWord == "") {
        // Show a popup indicating the delete status
        swal({
            title: "Oops.. Something went wrong!",
            text: "You must enter a valid word.",
            type: "error",
            confirmButtonColor: "#3b5998",
            confirmButtonText: "Close"
        });
        return false;
    }

    // Call the Merriam-Webster API and get the result model
    // to populate the modal with search results
    $.ajax({
        type: "POST",
        url: '/GalileoASP/TakeTestServices/GetThesaurusWordItem',
        data:
             JSON.stringify(9{
                 testID: $("#hdnTestID").val(),
                 word: searchWord,
                 childID: $('#hdnChildID').val()
             }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        async: true,
        success: function (data) {
            // Store the result set in the global variable
            g_thesaurusResultModel = data;

            if (data.length != undefined && data.length != null) {
                // if at least one entry  is found.. populate the modal
                if (data.length > 0) {
                    var entryListHtml = "<div style='padding-left:2px'>";
                    for (var i = 0; i < data.length; i++) {
                        entryListHtml += "<a href='javascript:;' onclick='ShowThesaurusResult(" + data[i].EntryID + ")' style='font-size:16px; text-decoration:none'>" + data[i].DisplayTitle + "</a><br/>";
                    }
                    entryListHtml += "</div>";

                    // Update the found entry count and write out all
                    // the found words in the "Entries Found" box
                    $('#spnThesaurusFoundEntriesCount').text(data.length + " entries found:");
                    $('#divThesaurusAllFoundEntries').html(entryListHtml);
                    $('#divThesaurusShowResults').show();
                    $('#divThesaurusFoundEntries').show();
                    $('#divThesaurusResultWindow').show();
                    $('#divNoResultsFound').hide();

                    // Show the result set for the first word (by default)
                    ShowThesaurusResult(data[0].EntryID);
                }
                else {
                    $('#divNoResultsFound').html("<h4>No results found.</h4>");
                    $('#spnMainThesaurusResultWord').text(searchWord);

                    $('#divNoResultsFound').show();
                    $('#divThesaurusMainWord').show();
                    $('#divThesaurusShowResults').show();
                    $('#divThesaurusFoundEntries').hide();
                    $('#divThesaurusResultWindow').hide();
                    $('#divThesaurusResultWindowHeader').hide();

                    $('#divDicResults').hide();
                    $('#divThesaurusResults').show();
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // eat this error..
            // Show a popup indicating the delete status
            swal({
                title: "Oops.. Something went wrong!",
                text: "An error occurred while searching the word.",
                type: "error",
                confirmButtonColor: "#3b5998",
                confirmButtonText: "Close"
            });
        }
    });
}

// Note: This function show the result set of a given word.
// It works off index position for the words found in the 
// entry list box.
function ShowWordResult(index) {
    $('#divThesaurusResults').hide();
    $('#divDicResults').show();

    //Clear (necc divs)
    $('#divRunOnWords').html("");

    var wordItem = null;

    if (g_searchResultModel != null) {
        for (var i = 0; i < g_searchResultModel.length; i++) {
            if (g_searchResultModel[i].EntryID == index) {
                wordItem = g_searchResultModel[i];
                break;
            }
        }

        if (wordItem != null) {
            // Set the word in the placeholder indicating
            // which word you are searching for.
            $('#spnMainResultWord').text(wordItem.EntryWord);

            // Set the inflection (usually this will be empty)
            // but if something is found; it will set that in the
            // placeHolder
            $('#divInflection').html(wordItem.Inflection);

            $('#divWordDefinition').show();
            $('#divMainResultWord').show();
            $('#divResultWindow').show();
            $('#divResultWindowHeader').show();
            $('#divInflection').show();

            $('#spnWordDefinition').text(wordItem.EntryWord)
            $('#spnHeadWord').text(wordItem.SpellWord);
            $('#spnHeadWordSpeech').text(wordItem.PartOfSpeech);

            if (wordItem.NumToWorkDescPairList != null) {
                // Loop the word descriptions and build html
                var descriptionHtml = "";
                descriptionHtml += "<table style='margin-left:20px'>";

                for (var j = 0; j < wordItem.NumToWorkDescPairList.length; j++) {
                    descriptionHtml += "<tr style='padding-top:3px'>";
                    if (wordItem.NumToWorkDescPairList[j].String1.length > 1) {
                        descriptionHtml += "<td style='width:25px; vertical-align:top; text-align:left; font-weight:bold; font-size:14px'>" + wordItem.NumToWorkDescPairList[j].String1 + "</td>";
                    }
                    else {
                        var isNum = IsNumericStr(wordItem.NumToWorkDescPairList[j].String1);
                        if (isNum == true) {
                            descriptionHtml += "<td style='width:25px; vertical-align:top; text-align:left; font-weight:bold; font-size:14px'>" + wordItem.NumToWorkDescPairList[j].String1 + "</td>";
                        }
                        else {
                            descriptionHtml += "<td style='width:25px; vertical-align:top; text-align:right; font-weight:bold; font-size:14px'>" + wordItem.NumToWorkDescPairList[j].String1 + "</td>";
                        }
                    }
                    //descriptionHtml += "<td style='width:30px; vertical-align:top; text-align:right; font-weight:bold; font-size:14px'>" + wordItem.NumToWorkDescPairList[j].String1 + "</td>";
                    descriptionHtml += "<td style='padding-left:5px; font-size:14px; vertical-align:top'>" + wordItem.NumToWorkDescPairList[j].String2 + "</td>";
                    descriptionHtml += "</tr>";
                }

                descriptionHtml += "</table>";

                // Set the word description
                $('#divWordDescription').html(descriptionHtml);
            }

            if (wordItem.RunOnWords != null) {
                // Loop the word descriptions and build html
                var runonWordsHtml = "";
                runonWordsHtml += "<table style='margin-left:20px; margin-bottom:15px'>";

                for (var a = 0; a < wordItem.RunOnWords.length; a++) {
                    runonWordsHtml += "<tr style='padding-top:3px'>";
                    runonWordsHtml += "<td style='width:20px; vertical-align:top; text-align:left; font-weight:bold; font-size:14px'>-&nbsp;" + wordItem.RunOnWords[a].String1 + "</td>";
                    runonWordsHtml += "</tr>";
                    runonWordsHtml += "<tr style='padding-top:3px'>";
                    runonWordsHtml += "<td style='padding-left:15px; font-size:14px; vertical-align:top'>" + wordItem.RunOnWords[a].String2 + "</td>";
                    runonWordsHtml += "</tr>";
                }

                runonWordsHtml += "</table>";

                // Set the word description
                $('#divRunOnWords').html(runonWordsHtml);
            }
        }
    }
}

function ShowThesaurusResult(index) {
    $('#divDicResults').hide();
    $('#divThesaurusResults').show();

    var wordItem = null;

    if (g_thesaurusResultModel != null) {
        for (var i = 0; i < g_thesaurusResultModel.length; i++) {
            if (g_thesaurusResultModel[i].EntryID == index) {
                wordItem = g_thesaurusResultModel[i];
                break;
            }
        }

        if (wordItem != null) {
            // Set the word in the placeholder indicating
            // which word you are searching for.
            $('#spnMainThesaurusResultWord').html(wordItem.DisplayTitle);
            $('#spnThesaurusWordDefinition').text(wordItem.DisplayTitle)
            $('#spnThesaurusHeadWord').text(wordItem.SpellWord);
            $('#spnThesaurusHeadWordSpeech').text(wordItem.PartOfSpeech);
            $('#divThesaurusResultWindowHeader').show();
            $('#divThesaurusMainWord').show();

            // Loop the word descriptions and build html
            var descriptionHtml = "";

            for (var j = 0; j < wordItem.ThesaurusSubItemList.length; j++) {
                var thesaurusSubItem = wordItem.ThesaurusSubItemList[j];

                descriptionHtml += "<table style='margin-left:5px'>";

                if (thesaurusSubItem.MainEntryText != null) {
                    descriptionHtml += "<tr>";
                    descriptionHtml += "<td style='font-size:14px'>" + thesaurusSubItem.MainEntryText + "</td>";
                    descriptionHtml += "</tr>";
                }

                if (thesaurusSubItem.Synonyms != null) {
                    descriptionHtml += "<tr>";
                    descriptionHtml += "<td style='font-size:14px'><b>Synonyms</b>&nbsp;" + thesaurusSubItem.Synonyms + "</td>";
                    descriptionHtml += "</tr>";
                }

                if (thesaurusSubItem.RelatedWords != null) {
                    descriptionHtml += "<tr>";
                    descriptionHtml += "<td style='font-size:14px; vertical-align:top'><b>Related Words</b>&nbsp;" + thesaurusSubItem.RelatedWords + "</td>";
                    descriptionHtml += "</tr>";
                }

                if (thesaurusSubItem.NearAntonyms != null) {
                    descriptionHtml += "<tr>";
                    descriptionHtml += "<td style='font-size:14px; vertical-align:top'><b>Near Antonyms</b>&nbsp;" + thesaurusSubItem.NearAntonyms + "</td>";
                    descriptionHtml += "</tr>";
                }

                if (thesaurusSubItem.Antonyms != null) {
                    descriptionHtml += "<tr>";
                    descriptionHtml += "<td style='font-size:14px; vertical-align:top'><b>Antonyms</b>&nbsp;" + thesaurusSubItem.Antonyms + "</td>";
                    descriptionHtml += "</tr>";
                }

                descriptionHtml += "</table><br/>";
            }

            // Set the word description
            $('#divThesaurusDescription').html(descriptionHtml);
        }
    }
    else {
        // Set the word description
        $('#divThesaurusDescription').html("");
    }
}

function IsNumericStr(str) {
    if (str.length == 1) {
        if (str == "0" ||
            str == "1" ||
            str == "2" ||
            str == "3" ||
            str == "4" ||
            str == "5" ||
            str == "6" ||
            str == "7" ||
            str == "8" ||
            str == "9") {
            return true;
        }
        return false;
    }
}



//draggable code for popups

if (isMobile) {
    var draggable = $('#modalDictionary .modal-content');
    draggable.on('touchmove', function (e) {
        var touch = e.originalEvent.targetTouches[0];

        // Place element where the finger is
        $(this).css({
            "top": (touch.pageY).toString() + "px",
            "left": (touch.pageX).toString() + "px"
        });


        e.preventDefault();
    });
} else {
    (function ($) {
        $.fn.drags = function (opt) {

            opt = $.extend({ handle: "", cursor: "move" }, opt);

            if (opt.handle === "") {
                var $el = this;
            } else {
                var $el = this.find(opt.handle);
            }

            return $el.css('cursor', opt.cursor).on("mousedown", function (e) {
                //first lower z-index of the rest of the popups
                $('.modal-content').css('z-index', 1000);

                if (opt.handle === "") {
                    var $drag = $(this).addClass('draggable');
                } else {
                    var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
                }
                var drg_h = $drag.outerHeight(),
                    drg_w = $drag.outerWidth(),
                    pos_y = $drag.offset().top + drg_h - e.pageY,
                    pos_x = $drag.offset().left + drg_w - e.pageX;
                $drag.css('z-index', 3001).parents().on("mousemove", function (e) {
                    $('.draggable').offset({
                        top: e.pageY + pos_y - drg_h,
                        left: e.pageX + pos_x - drg_w
                    }).on("mouseup", function () {
                        $(this).removeClass('draggable');
                    });
                });
                //e.preventDefault(); // disable selection
            }).on("mouseup", function () {
                if (opt.handle === "") {
                    $(this).removeClass('draggable');
                } else {
                    $(this).removeClass('active-handle').parent().removeClass('draggable');
                }
            });

        }
    })(jQuery);
}


function ShowPopup(popupID) {

    //set position based on width
    var marginLeft = "-" + ($('#' + popupID).width() * .5).toString();
    var marginTop = "-" + ($('#' + popupID).height() * .5).toString();
    $('#' + popupID).css({
        "top": "50%",
        "left": "50%",
        "margin-left": marginLeft + "px",
        "margin-top": marginTop + "px"
    });

    if (!isMobile) {
        //make popup draggable
        $('#' + popupID).drags({
            handle: ".modal-header"
        });
    }

    //show popup
    $('#' + popupID).show();

    // When the user clicks on the popup's <span> (x) with class .close, close the modal
    $('#' + popupID + ' .close').on('click', function (e) {
        //show popup
        $('#' + popupID).hide();

        //figure out where to place the focus now
        if (popupID.indexOf("modalNotes") >= 0) {
            $("a[id*='menuButton']").focus();
        } else if (popupID.indexOf("modalCalculator") >= 0) {
            $("a[id*='lnkCalculator']").focus();
        } else if (popupID.indexOf("modalInstructions") >= 0) {
            $("a[id*='instructionLink']").focus();
        } else if (popupID.indexOf("modalInstructionsForBenchmarkOrIE") >= 0) {
            $("a[id*='instructionLink']").focus();
        } else if (popupID.indexOf("modalDictionary") >= 0) {
            $("a[id*='lnkDictionary']").focus();
        } else if (popupID.indexOf("modalHelp") >= 0) {
            $("a[id*='helpLink']").focus();
        } else if (popupID.indexOf("modalTEEM") >= 0) {
            $("a[id*='instructionLink']").focus();
        } else if (popupID.indexOf("modalTEEL") >= 0) {
            $("a[id*='instructionLink']").focus();
        } else if (popupID.indexOf("modalFirstGradeTR") >= 0) {
            $("a[id*='instructionLink']").focus();
        } else if (popupID.indexOf("modalFirstGradeTRSR") >= 0) {
            $("a[id*='instructionLink']").focus();
        } else if (popupID.indexOf("modalSecondGrade") >= 0) {
            $("a[id*='instructionLink']").focus();
        }
        
    });

}



//<!-- Line Reader -->
//$(document).ready(function () {
//    $(".itemWrapper").hover(function () {
//        $(".highlight", this).show();
//        $(this).mousemove(function (e) {
//            var relativePos = e.pageY - this.offsetTop;
//            var textRow = (Math.ceil(relativePos / 18) * 18) - 18;
//            if (textRow >= 0) { $(".highlight", this).css("top", textRow + "px"); }
//        });
//    }, function () {
//        $(".highlight", this).hide();
//    });
//});

//$(document).ready(function () {
//    //document.body.style.backgroundColor = "#883377";
//    $('*').css('background-color', 'lightblue');
//});

(function (global) {
    'use strict';

    var
        /**
         * Attribute added by default to every highlight.
         * @type {string}
         */
        DATA_ATTR = 'data-highlighted',

        /**
         * Attribute used to group highlight wrappers.
         * @type {string}
         */
        TIMESTAMP_ATTR = 'data-timestamp',

        NODE_TYPE = {
            ELEMENT_NODE: 1,
            TEXT_NODE: 3
        },

        /**
         * Don't highlight content of these tags.
         * @type {string[]}
         */
        IGNORE_TAGS = [
            'SCRIPT', 'STYLE', 'SELECT', 'OPTION', 'BUTTON', 'OBJECT', 'APPLET', 'VIDEO', 'AUDIO', 'CANVAS', 'EMBED',
            'PARAM', 'METER', 'PROGRESS'
        ];

    /**
     * Returns true if elements a i b have the same color.
     * @param {Node} a
     * @param {Node} b
     * @returns {boolean}
     */
    function haveSameColor(a, b) {
        return dom(a).color() === dom(b).color();
    }

    /**
     * Fills undefined values in obj with default properties with the same name from source object.
     * @param {object} obj - target object
     * @param {object} source - source object with default values
     * @returns {object}
     */
    function defaults(obj, source) {
        obj = obj || {};

        for (var prop in source) {
            if (source.hasOwnProperty(prop) && obj[prop] === void 0) {
                obj[prop] = source[prop];
            }
        }

        return obj;
    }

    /**
     * Returns array without duplicated values.
     * @param {Array} arr
     * @returns {Array}
     */
    function unique(arr) {
        return arr.filter(function (value, idx, self) {
            return self.indexOf(value) === idx;
        });
    }

    /**
     * Takes range object as parameter and refines it boundaries
     * @param range
     * @returns {object} refined boundaries and initial state of highlighting algorithm.
     */
    function refineRangeBoundaries(range) {
        var startContainer = range.startContainer,
            endContainer = range.endContainer,
            ancestor = range.commonAncestorContainer,
            goDeeper = true;

        if (range.endOffset === 0) {
            while (!endContainer.previousSibling && endContainer.parentNode !== ancestor) {
                endContainer = endContainer.parentNode;
            }
            endContainer = endContainer.previousSibling;
        } else if (endContainer.nodeType === NODE_TYPE.TEXT_NODE) {
            if (range.endOffset < endContainer.nodeValue.length) {
                endContainer.splitText(range.endOffset);
            }
        } else if (range.endOffset > 0) {
            endContainer = endContainer.childNodes.item(range.endOffset - 1);
        }

        if (startContainer.nodeType === NODE_TYPE.TEXT_NODE) {
            if (range.startOffset === startContainer.nodeValue.length) {
                goDeeper = false;
            } else if (range.startOffset > 0) {
                startContainer = startContainer.splitText(range.startOffset);
                if (endContainer === startContainer.previousSibling) {
                    endContainer = startContainer;
                }
            }
        } else if (range.startOffset < startContainer.childNodes.length) {
            startContainer = startContainer.childNodes.item(range.startOffset);
        } else {
            startContainer = startContainer.nextSibling;
        }

        return {
            startContainer: startContainer,
            endContainer: endContainer,
            goDeeper: goDeeper
        };
    }

    /**
     * Sorts array of DOM elements by its depth in DOM tree.
     * @param {HTMLElement[]} arr - array to sort.
     * @param {boolean} descending - order of sort.
     */
    function sortByDepth(arr, descending) {
        arr.sort(function (a, b) {
            return dom(descending ? b : a).parents().length - dom(descending ? a : b).parents().length;
        });
    }

    /**
     * Groups given highlights by timestamp.
     * @param {Array} highlights
     * @returns {Array} Grouped highlights.
     */
    function groupHighlights(highlights) {
        var order = [],
            chunks = {},
            grouped = [];

        highlights.forEach(function (hl) {
            var timestamp = hl.getAttribute(TIMESTAMP_ATTR);

            if (typeof chunks[timestamp] === 'undefined') {
                chunks[timestamp] = [];
                order.push(timestamp);
            }

            chunks[timestamp].push(hl);
        });

        order.forEach(function (timestamp) {
            var group = chunks[timestamp];

            grouped.push({
                chunks: group,
                timestamp: timestamp,
                toString: function () {
                    return group.map(function (h) {
                        return h.textContent;
                    }).join('');
                }
            });
        });

        return grouped;
    }

    /**
     * Utility functions to make DOM manipulation easier.
     * @param {Node|HTMLElement} [el] - base DOM element to manipulate
     * @returns {object}
     */
    var dom = function (el) {

        return /** @lends dom **/ {

            /**
             * Adds class to element.
             * @param {string} className
             */
            addClass: function (className) {
                if (el.classList) {
                    el.classList.add(className);
                } else {
                    el.className += ' ' + className;
                }
            },

            /**
             * Removes class from element.
             * @param {string} className
             */
            removeClass: function (className) {
                if (el.classList) {
                    el.classList.remove(className);
                } else {
                    el.className = el.className.replace(
                        new RegExp('(^|\\b)' + className + '(\\b|$)', 'gi'), ' '
                    );
                }
            },

            /**
             * Prepends child nodes to base element.
             * @param {Node[]} nodesToPrepend
             */
            prepend: function (nodesToPrepend) {
                var nodes = Array.prototype.slice.call(nodesToPrepend),
                    i = nodes.length;

                while (i--) {
                    el.insertBefore(nodes[i], el.firstChild);
                }
            },

            /**
             * Appends child nodes to base element.
             * @param {Node[]} nodesToAppend
             */
            append: function (nodesToAppend) {
                var nodes = Array.prototype.slice.call(nodesToAppend);

                for (var i = 0, len = nodes.length; i < len; ++i) {
                    el.appendChild(nodes[i]);
                }
            },

            /**
             * Inserts base element after refEl.
             * @param {Node} refEl - node after which base element will be inserted
             * @returns {Node} - inserted element
             */
            insertAfter: function (refEl) {
                return refEl.parentNode.insertBefore(el, refEl.nextSibling);
            },

            /**
             * Inserts base element before refEl.
             * @param {Node} refEl - node before which base element will be inserted
             * @returns {Node} - inserted element
             */
            insertBefore: function (refEl) {
                return refEl.parentNode.insertBefore(el, refEl);
            },

            /**
             * Removes base element from DOM.
             */
            remove: function () {
                el.parentNode.removeChild(el);
                el = null;
            },

            /**
             * Returns true if base element contains given child.
             * @param {Node|HTMLElement} child
             * @returns {boolean}
             */
            contains: function (child) {
                return el !== child && el.contains(child);
            },

            /**
             * Wraps base element in wrapper element.
             * @param {HTMLElement} wrapper
             * @returns {HTMLElement} wrapper element
             */
            wrap: function (wrapper) {
                if (el.parentNode) {
                    el.parentNode.insertBefore(wrapper, el);
                }

                wrapper.appendChild(el);
                return wrapper;
            },

            /**
             * Unwraps base element.
             * @returns {Node[]} - child nodes of unwrapped element.
             */
            unwrap: function () {
                var nodes = Array.prototype.slice.call(el.childNodes),
                    wrapper;

                nodes.forEach(function (node) {
                    wrapper = node.parentNode;
                    dom(node).insertBefore(node.parentNode);
                    dom(wrapper).remove();
                });

                return nodes;
            },

            /**
             * Returns array of base element parents.
             * @returns {HTMLElement[]}
             */
            parents: function () {
                var parent, path = [];

                while (!!(parent = el.parentNode)) {
                    path.push(parent);
                    el = parent;
                }

                return path;
            },

            /**
             * Normalizes text nodes within base element, ie. merges sibling text nodes and assures that every
             * element node has only one text node.
             * It should does the same as standard element.normalize, but IE implements it incorrectly.
             */
            normalizeTextNodes: function () {
                if (!el) {
                    return;
                }

                if (el.nodeType === NODE_TYPE.TEXT_NODE) {
                    while (el.nextSibling && el.nextSibling.nodeType === NODE_TYPE.TEXT_NODE) {
                        el.nodeValue += el.nextSibling.nodeValue;
                        el.parentNode.removeChild(el.nextSibling);
                    }
                } else {
                    dom(el.firstChild).normalizeTextNodes();
                }
                dom(el.nextSibling).normalizeTextNodes();
            },

            /**
             * Returns element background color.
             * @returns {CSSStyleDeclaration.backgroundColor}
             */
            color: function () {
                return el.style.backgroundColor;
            },

            /**
             * Creates dom element from given html string.
             * @param {string} html
             * @returns {NodeList}
             */
            fromHTML: function (html) {
                var div = document.createElement('div');
                div.innerHTML = html;
                return div.childNodes;
            },

            /**
             * Returns first range of the window of base element.
             * @returns {Range}
             */
            getRange: function () {
                var selection = dom(el).getSelection(),
                    range;

                if (selection.rangeCount > 0) {
                    range = selection.getRangeAt(0);
                }

                return range;
            },

            /**
             * Removes all ranges of the window of base element.
             */
            removeAllRanges: function () {
                var selection = dom(el).getSelection();
                selection.removeAllRanges();
            },

            /**
             * Returns selection object of the window of base element.
             * @returns {Selection}
             */
            getSelection: function () {
                return dom(el).getWindow().getSelection();
            },

            /**
             * Returns window of the base element.
             * @returns {Window}
             */
            getWindow: function () {
                return dom(el).getDocument().defaultView;
            },

            /**
             * Returns document of the base element.
             * @returns {HTMLDocument}
             */
            getDocument: function () {
                // if ownerDocument is null then el is the document itself.
                return el.ownerDocument || el;
            }

        };
    };

    function bindEvents(el, scope) {
        el.addEventListener('mouseup', scope.highlightHandler.bind(scope));
        el.addEventListener('touchstart', scope.highlightHandler.bind(scope));
    }

    function unbindEvents(el, scope) {
        el.removeEventListener('mouseup', scope.highlightHandler.bind(scope));
        el.removeEventListener('touchstart', scope.highlightHandler.bind(scope));
    }

    /**
     * Creates TextHighlighter instance and binds to given DOM elements.
     * @param {HTMLElement} element - DOM element to which highlighted will be applied.
     * @param {object} [options] - additional options.
     * @param {string} options.color - highlight color.
     * @param {string} options.highlightedClass - class added to highlight, 'highlighted' by default.
     * @param {string} options.contextClass - class added to element to which highlighter is applied,
     *  'highlighter-context' by default.
     * @param {function} options.onRemoveHighlight - function called before highlight is removed. Highlight is
     *  passed as param. Function should return true if highlight should be removed, or false - to prevent removal.
     * @param {function} options.onBeforeHighlight - function called before highlight is created. Range object is
     *  passed as param. Function should return true to continue processing, or false - to prevent highlighting.
     * @param {function} options.onAfterHighlight - function called after highlight is created. Array of created
     * wrappers is passed as param.
     * @class TextHighlighter
     */
    function TextHighlighter(element, options) {
        if (!element) {
            throw 'Missing anchor element';
        }

        this.el = element;
        this.options = defaults(options, {
            enabled: true,
            color: '#ffff7b',
            highlightedClass: 'highlighted',
            contextClass: 'highlighter-context',
            onRemoveHighlight: function () { return true; },
            onBeforeHighlight: function () { return true; },
            onAfterHighlight: function () { }
        });

        dom(this.el).addClass(this.options.contextClass);
        bindEvents(this.el, this);
        if (this.options.enabled == false) {
            this.disable();
        }
    }

    /**
     * Permanently disables highlighting.
     * Unbinds events and remove context element class.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.destroy = function () {
        unbindEvents(this.el, this);
        dom(this.el).removeClass(this.options.contextClass);
    };

    TextHighlighter.prototype.highlightHandler = function () {
        this.doHighlight();
    };

    /**
     * Highlights current range.
     * @param {boolean} keepRange - Don't remove range after highlighting. Default: false.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.doHighlight = function (keepRange) {

        if (!this.options.enabled) return false;

        var range = dom(this.el).getRange(),
            wrapper,
            createdHighlights,
            normalizedHighlights,
            timestamp;

        if (!range || range.collapsed) {
            return;
        }

        if (this.options.onBeforeHighlight(range) === true) {
            timestamp = +new Date();
            wrapper = TextHighlighter.createWrapper(this.options);
            wrapper.setAttribute(TIMESTAMP_ATTR, timestamp);

            createdHighlights = this.highlightRange(range, wrapper);
            normalizedHighlights = this.normalizeHighlights(createdHighlights);

            this.options.onAfterHighlight(range, normalizedHighlights, timestamp);
        }

        if (!keepRange) {
            dom(this.el).removeAllRanges();
        }
    };

    /**
     * Highlights range.
     * Wraps text of given range object in wrapper element.
     * @param {Range} range
     * @param {HTMLElement} wrapper
     * @returns {Array} - array of created highlights.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.highlightRange = function (range, wrapper) {
        if (!range || range.collapsed) {
            return [];
        }

        var result = refineRangeBoundaries(range),
            startContainer = result.startContainer,
            endContainer = result.endContainer,
            goDeeper = result.goDeeper,
            done = false,
            node = startContainer,
            highlights = [],
            highlight,
            wrapperClone,
            nodeParent;

        do {
            if (goDeeper && node.nodeType === NODE_TYPE.TEXT_NODE) {

                if (IGNORE_TAGS.indexOf(node.parentNode.tagName) === -1 && node.nodeValue.trim() !== '') {
                    wrapperClone = wrapper.cloneNode(true);
                    wrapperClone.setAttribute(DATA_ATTR, true);
                    nodeParent = node.parentNode;

                    // highlight if a node is inside the el
                    if (dom(this.el).contains(nodeParent) || nodeParent === this.el) {
                        highlight = dom(node).wrap(wrapperClone);
                        highlights.push(highlight);
                    }
                }

                goDeeper = false;
            }
            if (node === endContainer && !(endContainer.hasChildNodes() && goDeeper)) {
                done = true;
            }

            if (node.tagName && IGNORE_TAGS.indexOf(node.tagName) > -1) {

                if (endContainer.parentNode === node) {
                    done = true;
                }
                goDeeper = false;
            }
            if (goDeeper && node.hasChildNodes()) {
                node = node.firstChild;
            } else if (node.nextSibling) {
                node = node.nextSibling;
                goDeeper = true;
            } else {
                node = node.parentNode;
                goDeeper = false;
            }
        } while (!done);

        return highlights;
    };

    /**
     * Normalizes highlights. Ensures that highlighting is done with use of the smallest possible number of
     * wrapping HTML elements.
     * Flattens highlights structure and merges sibling highlights. Normalizes text nodes within highlights.
     * @param {Array} highlights - highlights to normalize.
     * @returns {Array} - array of normalized highlights. Order and number of returned highlights may be different than
     * input highlights.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.normalizeHighlights = function (highlights) {
        var normalizedHighlights;

        this.flattenNestedHighlights(highlights);
        this.mergeSiblingHighlights(highlights);

        // omit removed nodes
        normalizedHighlights = highlights.filter(function (hl) {
            return hl.parentElement ? hl : null;
        });

        normalizedHighlights = unique(normalizedHighlights);
        normalizedHighlights.sort(function (a, b) {
            return a.offsetTop - b.offsetTop || a.offsetLeft - b.offsetLeft;
        });

        return normalizedHighlights;
    };

    /**
     * Flattens highlights structure.
     * Note: this method changes input highlights - their order and number after calling this method may change.
     * @param {Array} highlights - highlights to flatten.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.flattenNestedHighlights = function (highlights) {
        var again,
            self = this;

        sortByDepth(highlights, true);

        function flattenOnce() {
            var again = false;

            highlights.forEach(function (hl, i) {
                var parent = hl.parentElement,
                    parentPrev = parent.previousSibling,
                    parentNext = parent.nextSibling;

                if (self.isHighlight(parent)) {

                    if (!haveSameColor(parent, hl)) {

                        if (!hl.nextSibling) {
                            dom(hl).insertBefore(parentNext || parent);
                            again = true;
                        }

                        if (!hl.previousSibling) {
                            dom(hl).insertAfter(parentPrev || parent);
                            again = true;
                        }

                        if (!parent.hasChildNodes()) {
                            dom(parent).remove();
                        }

                    } else {
                        parent.replaceChild(hl.firstChild, hl);
                        highlights[i] = parent;
                        again = true;
                    }

                }

            });

            return again;
        }

        do {
            again = flattenOnce();
        } while (again);
    };

    /**
     * Merges sibling highlights and normalizes descendant text nodes.
     * Note: this method changes input highlights - their order and number after calling this method may change.
     * @param highlights
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.mergeSiblingHighlights = function (highlights) {
        var self = this;

        function shouldMerge(current, node) {
            return node && node.nodeType === NODE_TYPE.ELEMENT_NODE &&
                haveSameColor(current, node) &&
                self.isHighlight(node);
        }

        highlights.forEach(function (highlight) {
            var prev = highlight.previousSibling,
                next = highlight.nextSibling;

            if (shouldMerge(highlight, prev)) {
                dom(highlight).prepend(prev.childNodes);
                dom(prev).remove();
            }
            if (shouldMerge(highlight, next)) {
                dom(highlight).append(next.childNodes);
                dom(next).remove();
            }

            dom(highlight).normalizeTextNodes();
        });
    };

    /**
     * Sets highlighting color.
     * @param {string} color - valid CSS color.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.setColor = function (color) {
        this.options.color = color;
    };

    /**
     * Returns highlighting color.
     * @returns {string}
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.getColor = function () {
        return this.options.color;
    };

    /**
     * Removes highlights from element. If element is a highlight itself, it is removed as well.
     * If no element is given, all highlights all removed.
     * @param {HTMLElement} [element] - element to remove highlights from
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.removeHighlights = function (element) {
        var container = element || this.el,
            highlights = this.getHighlights({ container: container }),
            self = this;

        function mergeSiblingTextNodes(textNode) {
            var prev = textNode.previousSibling,
                next = textNode.nextSibling;

            if (prev && prev.nodeType === NODE_TYPE.TEXT_NODE) {
                textNode.nodeValue = prev.nodeValue + textNode.nodeValue;
                dom(prev).remove();
            }
            if (next && next.nodeType === NODE_TYPE.TEXT_NODE) {
                textNode.nodeValue = textNode.nodeValue + next.nodeValue;
                dom(next).remove();
            }
        }

        function removeHighlight(highlight) {
            var textNodes = dom(highlight).unwrap();

            textNodes.forEach(function (node) {
                mergeSiblingTextNodes(node);
            });
        }

        sortByDepth(highlights, true);

        highlights.forEach(function (hl) {
            if (self.options.onRemoveHighlight(hl) === true) {
                removeHighlight(hl);
            }
        });
    };

    /**
     * Returns highlights from given container.
     * @param params
     * @param {HTMLElement} [params.container] - return highlights from this element. Default: the element the
     * highlighter is applied to.
     * @param {boolean} [params.andSelf] - if set to true and container is a highlight itself, add container to
     * returned results. Default: true.
     * @param {boolean} [params.grouped] - if set to true, highlights are grouped in logical groups of highlights added
     * in the same moment. Each group is an object which has got array of highlights, 'toString' method and 'timestamp'
     * property. Default: false.
     * @returns {Array} - array of highlights.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.getHighlights = function (params) {
        params = defaults(params, {
            container: this.el,
            andSelf: true,
            grouped: false
        });

        var nodeList = params.container.querySelectorAll('[' + DATA_ATTR + ']'),
            highlights = Array.prototype.slice.call(nodeList);

        if (params.andSelf === true && params.container.hasAttribute(DATA_ATTR)) {
            highlights.push(params.container);
        }

        if (params.grouped) {
            highlights = groupHighlights(highlights);
        }

        return highlights;
    };

    /**
     * Returns true if element is a highlight.
     * All highlights have 'data-highlighted' attribute.
     * @param el - element to check.
     * @returns {boolean}
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.isHighlight = function (el) {
        return el && el.nodeType === NODE_TYPE.ELEMENT_NODE && el.hasAttribute(DATA_ATTR);
    };

    /**
     * Serializes all highlights in the element the highlighter is applied to.
     * @returns {string} - stringified JSON with highlights definition
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.serializeHighlights = function () {
        var highlights = this.getHighlights(),
            refEl = this.el,
            hlDescriptors = [];

        function getElementPath(el, refElement) {
            var path = [],
                childNodes;

            do {
                childNodes = Array.prototype.slice.call(el.parentNode.childNodes);
                path.unshift(childNodes.indexOf(el));
                el = el.parentNode;
            } while (el !== refElement || !el);

            return path;
        }

        sortByDepth(highlights, false);

        highlights.forEach(function (highlight) {
            var offset = 0, // Hl offset from previous sibling within parent node.
                length = highlight.textContent.length,
                hlPath = getElementPath(highlight, refEl),
                wrapper = highlight.cloneNode(true);

            wrapper.innerHTML = '';
            wrapper = wrapper.outerHTML;

            if (highlight.previousSibling && highlight.previousSibling.nodeType === NODE_TYPE.TEXT_NODE) {
                offset = highlight.previousSibling.length;
            }

            hlDescriptors.push([
                wrapper,
                highlight.textContent,
                hlPath.join(':'),
                offset,
                length
            ]);
        });

        return JSON.stringify(hlDescriptors);
    };

    /**
     * Deserializes highlights.
     * @throws exception when can't parse JSON or JSON has invalid structure.
     * @param {object} json - JSON object with highlights definition.
     * @returns {Array} - array of deserialized highlights.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.deserializeHighlights = function (json) {
        var hlDescriptors,
            highlights = [],
            self = this;

        if (!json) {
            return highlights;
        }

        try {
            hlDescriptors = JSON.parse(json);
        } catch (e) {
            throw "Can't parse JSON: " + e;
        }

        function deserializationFn(hlDescriptor) {
            var hl = {
                    wrapper: hlDescriptor[0],
                    text: hlDescriptor[1],
                    path: hlDescriptor[2].split(':'),
                    offset: hlDescriptor[3],
                    length: hlDescriptor[4]
                },
                elIndex = hl.path.pop(),
                node = self.el,
                hlNode,
                highlight,
                idx;

            while (!!(idx = hl.path.shift())) {
                node = node.childNodes[idx];
            }

            if (node.childNodes[elIndex-1] && node.childNodes[elIndex-1].nodeType === NODE_TYPE.TEXT_NODE) {
                elIndex -= 1;
            }

            node = node.childNodes[elIndex];
            hlNode = node.splitText(hl.offset);
            hlNode.splitText(hl.length);

            if (hlNode.nextSibling && !hlNode.nextSibling.nodeValue) {
                dom(hlNode.nextSibling).remove();
            }

            if (hlNode.previousSibling && !hlNode.previousSibling.nodeValue) {
                dom(hlNode.previousSibling).remove();
            }

            highlight = dom(hlNode).wrap(dom().fromHTML(hl.wrapper)[0]);
            highlights.push(highlight);
        }

        hlDescriptors.forEach(function (hlDescriptor) {
            try {
                deserializationFn(hlDescriptor);
            } catch (e) {
                if (console && console.warn) {
                    console.warn("Can't deserialize highlight descriptor. Cause: " + e);
                }
            }
        });

        return highlights;
    };

    /**
     * Finds and highlights given text.
     * @param {string} text - text to search for
     * @param {boolean} [caseSensitive] - if set to true, performs case sensitive search (default: true)
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.find = function (text, caseSensitive) {
        var wnd = dom(this.el).getWindow(),
            scrollX = wnd.scrollX,
            scrollY = wnd.scrollY,
            caseSens = (typeof caseSensitive === 'undefined' ? true : caseSensitive);

        dom(this.el).removeAllRanges();

        if (wnd.find) {
            while (wnd.find(text, caseSens)) {
                this.doHighlight(true);
            }
        } else if (wnd.document.body.createTextRange) {
            var textRange = wnd.document.body.createTextRange();
            textRange.moveToElementText(this.el);
            while (textRange.findText(text, 1, caseSens ? 4 : 0)) {
                if (!dom(this.el).contains(textRange.parentElement()) && textRange.parentElement() !== this.el) {
                    break;
                }

                textRange.select();
                this.doHighlight(true);
                textRange.collapse(false);
            }
        }

        dom(this.el).removeAllRanges();
        wnd.scrollTo(scrollX, scrollY);
    };

    TextHighlighter.prototype.disable = function () {
        if (this.options.enabled) {
            unbindEvents(this.el, this);
            this.options.enabled = false;
        }
    };

    TextHighlighter.prototype.enable = function () {
        if (!this.options.enabled) {
            bindEvents(this.el, this);
            this.options.enabled = true;
        }
    };
    /**
     * Creates wrapper for highlights.
     * TextHighlighter instance calls this method each time it needs to create highlights and pass options retrieved
     * in constructor.
     * @param {object} options - the same object as in TextHighlighter constructor.
     * @returns {HTMLElement}
     * @memberof TextHighlighter
     * @static
     */
    TextHighlighter.createWrapper = function (options) {
        var span = document.createElement('span');
        span.style.backgroundColor = options.color;
        span.className = options.highlightedClass;
        return span;
    };

    global.TextHighlighter = TextHighlighter;
})(window);
var UserControlClientID;

var isMobileDevice = false;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isMobileDevice = true;
}

//we need to set this from each item user control's SetJavascript function 
//*if the control isn't a sub item of an item collection*
function GetClientID(clientID) {
    //if clientID of control is ever needed
    UserControlClientID = clientID + "_";
}

function SetClientID(clientID) {
    //if clientID of control is ever needed
    UserControlClientID = clientID + "_";
}

// Remove the stupid custom right click menu that galileo shows 

//if (document.addEventListener) {
//    document.addEventListener('contextmenu', function (e) {
//
//        //if the right click is inside the contents div
//        if ($(e.target).closest('#contents').length) {
//            //get the mouse position
//            var mousePositionX = e.pageX;
//            var mousePositionY = e.pageY - 100;
//
//            DisplayRightClickMenu(mousePositionX, mousePositionY);
//        }
//        e.preventDefault();
//    }, false);
//} else {
//    document.attachEvent('oncontextmenu', function () {
//        window.event.returnValue = false;
//    });
//}

function DisplayRightClickMenu(mouseX, mouseY) {
    //show and position menu
    var menu = document.getElementById(UserControlClientID + "itemMenuContainer");
    menu.style.display = "block";
    positionMenu(menu, mouseX, mouseY);

    //set up listener for any click outside of the answerChoiceTable
    //attach click event to document to hide menu if a user clicks outside of it
    $(document).click(function (event) {
        if (!$(event.target).closest(menu).length && !$(event.target).is('#' + UserControlClientID + 'menuButton') && $(event.target).parents('#' + UserControlClientID + 'menuButton').length < 1) {
            if ($(menu).is(":visible")) {
                $(menu).css({ 'display': 'none' });
            }
        }
    });
}

function ExpandClicked(userControlID) {

    $('#' + userControlID + '_btnExpand').hide();

    $('#' + userControlID + '_btnCollapse').show();
    $('#' + userControlID + '_btnCollapse').focus();

    $('#' + userControlID + '_ItemFamilyPane').addClass('ExpandIF').removeClass('CollapseIF');

    //adjust the item family menu bar so the collapse icon is at right edge of pane
    $('.IFMenuBar').css({
        "width": "99%"
    });

    $('#' + userControlID + '_overlay').css({
        "display": "block"
    });

    setTimeout(ResetScrollDiv, 400);
}

function CollapseClicked(userControlID) {

    $('#' + userControlID + '_btnExpand').show();
    $('#' + userControlID + '_btnExpand').focus();

    $('#' + userControlID + '_btnCollapse').hide();

    $('#' + userControlID + '_ItemFamilyPane').addClass('CollapseIF').removeClass('ExpandIF');

    //adjust the item family menu bar so the collapse icon is at right edge of pane without overlapping scrollbar
    $('.IFMenuBar').css({
        "width": "97%"
    });

    $('#' + userControlID + '_overlay').css({
        "display": "none"
    });

    setTimeout(ResetScrollDiv, 400);
}

function ResetScrollDiv() {
    var IFddl = document.getElementById(UserControlClientID + 'ddlItemFamilies');
    if (IFddl != null) {
        ScrollDiv(IFddl, 'divIFContainer');
    }
}

function ScrollDiv(ddlID, divID) {

    var ddlID_ID = ddlID.id;
    SetClientID(GetUserControlPrefix(ddlID_ID));

    var toID = document.getElementById(ddlID.id).value;
    var tothisDiv = document.getElementById(UserControlClientID + toID);
    var distance = tothisDiv.offsetTop - 75; //75 is the top padding

    var myDiv = document.getElementById(UserControlClientID + divID);
    if (myDiv != null) {
        //somehow multiple choice containing multiple item families need this code in order to scroll to different item family
        myDiv.scrollTop = distance;
    } else {
        //somehow item collection containing multiple item families need this code in order to scroll to different item family
        myDiv = document.getElementById(divID);
        myDiv.scrollTop = distance;
    }

    return false;
}

function ShowHideFlyout(itemMenuContainerID, menuButtonID) {
    //get the menu flyout
    var menu = document.getElementById(itemMenuContainerID);
    if (menu.style.display == "" || menu.style.display == "block") {
        //hide the flyout
        menu.style.display = "none";
        $('#' + menuButtonID).focus();
    } else {
        //show the flyout
        menu.style.display = "block";
        //get the menu button coordinates and set the menu x and y
        var menuButtonPosition = $('#' + menuButtonID).offset();

        //position menu and make sure menu won't cause page overflow
        positionMenu(menu, (menuButtonPosition.left - 150), (menuButtonPosition.top - 60));

        //set focus to the first link in menu (mostly for screen readers)
        var firstMenuLink = $('#' + menu.id).find("a")[0];
        $(firstMenuLink).focus();

        //attach click event to document to hide menu if a user clicks outside of it
        $(document).click(function (event) {
            if (!$(event.target).closest(menu).length && !$(event.target).is('#' + menuButtonID) && $(event.target).parents('#' + menuButtonID).length < 1) {
                if ($(menu).is(":visible")) {
                    menu.style.display = "none";
                    $(document).off("keyup");
                    $(document).off("click");
                }
            }
        });

        //attach listener for esc key, set focus back to menu button
        $(document).keyup(function (e) {
            if (e.key === "Escape") { // escape key maps to keycode `27`
                $('#' + menuButtonID).focus();
                menu.style.display = "none";
                $(document).off("keyup");
                $(document).off("click");

            }
        });

    }

}

function ShowHideTTSFlyout(itemMenuContainerID, menuButtonID, isICSubItem, ifContainerID) {

    //this is needed to start the TTS service properly for mobile devices
    if (isMobileDevice) {
        responsiveVoice.speak("");
    }

    //get the menu flyout
    var menu = document.getElementById(itemMenuContainerID);
    if (menu.style.display == "" || menu.style.display == "block") {
        //hide the flyout
        menu.style.display = "none";

    } else {
        //show the flyout
        menu.style.display = "block";
        //get the menu button coordinates and set the menu x and y
        var menuButtonPosition;

        //need to get the distance that the question container may have been scrolled 
        //so we can correctly position the TTS flyout
        var questionScrollContainer = $('#' + UserControlClientID + 'ICQuestionScrollContainer');
        var scrollTopDistance = questionScrollContainer.scrollTop();

        var itemFamilyContainer = $('#' + ifContainerID);

        //position menu and make sure menu won't cause page overflow
        if (isICSubItem) {
            menuButtonPosition = $('#' + menuButtonID).position();
            positionTTSMenu(menu, (menuButtonPosition.left), (menuButtonPosition.top + 60));
        } else {
            menuButtonPosition = $('#' + menuButtonID).offset();
            if (itemFamilyContainer.is(':visible')) {
                positionTTSMenu(menu, (menuButtonPosition.left + itemFamilyContainer.width()), (menuButtonPosition.top - 60));
            } else {
                positionTTSMenu(menu, (menuButtonPosition.left), (menuButtonPosition.top - 60));
            }
        }


        //attach click event to document to hide menu if a user clicks outside of it
        $(document).click(function (event) {
            if (!$(event.target).closest(menu).length && !$(event.target).is('#' + menuButtonID) && $(event.target).parents('#' + menuButtonID).length < 1) {
                if ($(menu).is(":visible")) {
                    menu.style.display = "none";
                }
            }
        });
    }

}

function ShowHideTTSTextFlyout(itemMenuContainerID, menuButtonID, linkID) {
    //clear the document click event that hides the menu
    $(document).unbind("click");

    //this is needed to start the TTS service properly for mobile devices
    if (isMobileDevice) {
        responsiveVoice.speak("");
    }

    //get the menu flyout
    var menu = document.getElementById(UserControlClientID + itemMenuContainerID);
    if (menu.style.display == "" || menu.style.display == "block") {
        //hide the flyout
        menu.style.display = "none";

    } else {

        //show the appropriate link
        var ttsListItems = $('#' + UserControlClientID + itemMenuContainerID + ' li').each(function (index) {
            if (this.id == UserControlClientID + linkID) {
                this.style.display = "";
            } else {
                this.style.display = "none";
            }

        });

        //show the flyout
        menu.style.display = "block";
        //get the menu button coordinates and set the menu x and y
        var menuButtonPosition = $('#' + UserControlClientID + menuButtonID).offset();

        //need to get the distance that the question container may have been scrolled 
        //so we can correctly position the TTS flyout
        var textScrollContainer = $('#' + UserControlClientID + 'divIFContainer');
        var scrollTopDistance = textScrollContainer.scrollTop();

        //position menu and make sure menu won't cause page overflow
        positionTTSMenu(menu, (menuButtonPosition.left), (menuButtonPosition.top - 60));

        //attach click event to document to hide menu if a user clicks outside of it
        $(document).click(function (event) {
            if (!$(event.target).closest(menu).length && !$(event.target).is('#' + UserControlClientID + menuButtonID) && $(event.target).parents('#' + UserControlClientID + menuButtonID).length < 1) {
                if ($(menu).is(":visible")) {
                    menu.style.display = "none";
                }
            }
        });
    }

}


function positionMenu(menu, clickCoordsX, clickCoordsY) {

    menuWidth = menu.offsetWidth + 4;
    menuHeight = menu.offsetHeight + 4;

    //check to make sure the menu is inside the offset parent container
    var menuOffsetParent = menu.offsetParent;
    var menuParentWidth = $(menuOffsetParent).width();
    var menuParentHeight = $(menuOffsetParent).height();
    windowWidth = window.innerWidth;
    //we need to subtract the height of the navigation bar
    windowHeight = window.innerHeight - 100;

    //checking to make sure menu won't go outside of parent container bounds or window bounds
    if ((menuParentWidth - clickCoordsX) < menuWidth) {
        menu.style.left = menuParentWidth - menuWidth + "px";
    } else {
        if ((windowWidth - clickCoordsX) < menuWidth) {
            menu.style.left = windowWidth - menuWidth + "px";
        } else {
            menu.style.left = clickCoordsX + "px";
        }
    }

    if ((menuParentHeight - clickCoordsY) < menuHeight) {
        menu.style.top = menuParentHeight - menuHeight + "px";
    } else {
        if ((windowHeight - clickCoordsY) < menuHeight) {
            menu.style.top = windowHeight - menuHeight + "px";
        } else {
            menu.style.top = clickCoordsY + "px";
        }
    }

}

function positionTTSMenu(menu, clickCoordsX, clickCoordsY) {

    menuWidth = menu.offsetWidth + 4;
    menuHeight = menu.offsetHeight + 4;

    //check to make sure the menu is inside the offset parent container
    var menuOffsetParent = menu.offsetParent;
    var menuParentWidth = $(menuOffsetParent).width();
    var menuParentHeight = $(menuOffsetParent).height();

    //checking to make sure menu won't go outside of parent container bounds
    if ((menuParentWidth - clickCoordsX) < menuWidth) {
        menu.style.left = menuParentWidth - menuWidth + "px";
    } else {
        menu.style.left = clickCoordsX + "px";
    }

    if ((menuParentHeight - clickCoordsY) < menuHeight) {
        menu.style.top = menuParentHeight - menuHeight + "px";
    } else {
        menu.style.top = clickCoordsY + "px";
    }

}


function ToggleReview(lnkMarkID, linkUnmarkID, imgMarkID, childID, questionID, questionOrderPosition, itemMenuContainerID, menuButtonID) {

    var image = document.getElementById(imgMarkID);
    var lnkMark = document.getElementById(lnkMarkID);
    var lnkUnmark = document.getElementById(linkUnmarkID);
    var markedForReview;

    //unmark for review
    //so hide the image, hide the unmark link, and show the mark link
    if (image.style.display != 'none') {
        image.style.display = 'none';
        lnkMark.style.display = 'block';
        lnkUnmark.style.display = 'none';

        markedForReview = false;

    } else { //marking for review
        image.style.display = 'inline';
        lnkMark.style.display = 'none';
        lnkUnmark.style.display = 'block';

        markedForReview = true;

    }

    MarkQuestionInDropdown(markedForReview, questionOrderPosition);
    ShowHideFlyout(itemMenuContainerID, menuButtonID);


    $.ajax({
        type: "POST",
        url: "/GalileoASP/ASPX/Testing/WebServices/TestingServices.asmx/SaveMarkedForReview",
        data: "{ childID: '" + childID + "'," + "questionID: '" + questionID + "'," + "markedForReview: '" + markedForReview + "'," + "userID: '" + childID + "'" + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
        },
        error: function (xhr) {
            alert(xhr.responseText);
        }

    });
}

var g_imgHasNotesClientID = "";
function OpenNotes(childID, questionID, imgHasNotesClientID, itemMenuContainerID) {

    g_imgHasNotesClientID = imgHasNotesClientID;

    //get student notes
    $.ajax({
        type: "POST",
        url: "/GalileoASP/ASPX/Testing/WebServices/TestingServices.asmx/GetItemStudentNotes",
        data: "{ childID: '" + childID + "'," + "questionID: '" + questionID + "'" + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //set notes content
            if (data.d) {
                $('#txtItemNotes').val(data.d);
            } else {
                $('#txtItemNotes').val("");
            }

        },
        error: function (xhr) {
            alert(xhr.responseText);
        }

    });


    $('#modalNotes').css({
        "width": "515px",
        "height": "475px"
    });

    ShowPopup('modalNotes'); //in taketestscript.js

    $('#txtItemNotes').focus(); //set focus to the notes textbox

    //make sure the item menu is hidden
    menu = document.getElementById(itemMenuContainerID);
    menu.style.display = 'none';

}

function SaveNotes() {

    //get student notes
    var notesText = $('#txtItemNotes').val().replace(/'/g, "\\'");
    var userID = $('#hdnChildID').val();
    var childID = $('#hdnChildID').val();
    var questionID = $('#hdnQuestionID').val();

    //save
    $.ajax({
        type: "POST",
        url: "/GalileoASP/ASPX/Testing/WebServices/TestingServices.asmx/SaveItemStudentNotes",
        data: "{ childID: '" + childID + "'," + "questionID: '" + questionID + "'," + "notesText: '" + notesText + "'," + "userID: '" + userID + "'" + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {

            //close the popup
            $('#modalNotes').hide();
            $("a[id*='menuButton']").focus();

            if (notesText.length > 0) {
                $('#' + g_imgHasNotesClientID).show();
            }
        },
        error: function (xhr) {
            alert(xhr.responseText);
        }

    });

}

function DeleteNotes() {
    var userID = $('#hdnChildID').val();
    var childID = $('#hdnChildID').val();
    var questionID = $('#hdnQuestionID').val();

    //get student notes
    $.ajax({
        type: "POST",
        url: "/GalileoASP/ASPX/Testing/WebServices/TestingServices.asmx/DeleteItemStudentNotes",
        data: "{ childID: '" + childID + "'," + "questionID: '" + questionID + "'," + "userID: '" + userID + "'" + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            //clear the notes text box
            $('#txtItemNotes').val("");
            //close the popup
            $('#modalNotes').hide();
            $('#' + g_imgHasNotesClientID).hide();
            $("a[id*='menuButton']").focus();
        },
        error: function (xhr) {
            alert(xhr.responseText);
        }

    });

}


function MarkQuestionInDropdown(mark, questionOrderPosition) {
    var index = questionOrderPosition - 1;
    AddOrRemoveQuestionToMarkedList(mark, index);
    InitializeQuestionDDL();
}

function UpdateNotesImgVisibility(hasNotes, imgNotesClientID) {
    var imgNotes = document.getElementById(imgNotesClientID);

    if (hasNotes) {
        imgNotes.style.display = 'inline';
    } else {
        imgNotes.style.display = 'none';
    }
}


var highlighterTool;
var contentDiv;

function TurnHighlightingOn() {

    contentDiv = document.getElementById('contents');

    var options = {
        enabled: true,
        onAfterHighlight: function (range, hlts) {
            ShowClearHLMenuOption();
        }

    };

    highlighterTool = new TextHighlighter(contentDiv, options);

    //check if there is already some highlighting
    //and show the clear menu if there is
    var currentHighlights = highlighterTool.getHighlights(); //returns an array
    if (currentHighlights.length > 0) {
        ShowClearHLMenuOption();
    }


    $('#HighlightItem').css({ 'display': 'none' });
    $('#HighlightOff').css({ 'display': '' });
    $('#lnkTurnOffHighlight').addClass('BottomMenuItem');
    $('#' + UserControlClientID + 'itemMenuContainer').css({ 'display': 'none' });
    $('#contents').css({ 'cursor': 'url(../../images/TestAndDialogIcons/highlightCursor.cur), text' });
}

function ClearHighlighting() {

    highlighterTool.removeHighlights();

    $('#HighlightItem').css({ 'display': 'none' });
    $('#HighlightOff').css({ 'display': '' });
    $('#lnkTurnOffHighlight').addClass('BottomMenuItem');
    $('#UnhighlightItem').css({ 'display': 'none' });
    $('#' + UserControlClientID + 'itemMenuContainer').css({ 'display': 'none' });

}

function TurnHighlightingOff(isItemCollection) {

    if (highlighterTool != null && highlighterTool.options.enabled) {
        //save any highlights, do every time
        SaveHighlights(isItemCollection);

        //turn off highlighting
        highlighterTool.options = {
            enabled: false
        }

        $('#HighlightItem').css({ 'display': '' });
        $('#HighlightOff').css({ 'display': 'none' });
        $('#UnhighlightItem').css({ 'display': 'none' });
        $('#' + UserControlClientID + 'itemMenuContainer').css({ 'display': 'none' });

        $('#contents').css({ 'cursor': 'auto' });

    }

}

function ShowClearHLMenuOption() {
    $('#UnhighlightItem').css({ 'display': '' });
    $('#lnkTurnOffHighlight').removeClass('BottomMenuItem');
}

function SaveHighlights(isItemCollection) { //saves highlights for question stem and item families

    if (isItemCollection) {
        SaveSubItemHighlights(); //first save highlighting for any subitems in item collection questions
    }

    var stemDiv = document.getElementById(UserControlClientID + "divStem");
    var itemFamilyCount = document.getElementById(UserControlClientID + "hdnItemFamilyCount").value;
    var ddlItemFamilies = document.getElementById(UserControlClientID + "ddlItemFamilyIDsToName");

    var arrItemFamilyIDs = new Array();
    var arrItemFamilyMarkups = new Array();

    for (var i = 0; i < ddlItemFamilies.options.length; i++) {
        var itemFamilyID = ddlItemFamilies.options[i].text;
        arrItemFamilyIDs.push(itemFamilyID);
    }

    if (itemFamilyCount >= 1) {
        for (var i = 0; i < itemFamilyCount; i++) {
            var ifDiv = document.getElementById(UserControlClientID + "div" + (i + 1));
            var currentHighlightsIF;
            var optionsIF = {
                container: ifDiv,
                andSelf: false,
                grouped: false
            };

            if (ifDiv != null) {
                currentHighlightsIF = highlighterTool.getHighlights(optionsIF); //returns an array
            } else {
                currentHighlightsIF = [];
            }
            var itemFamilyContent = "";

            //if there are highlights in the item
            if (currentHighlightsIF.length > 0) {
                if (ifDiv != null) {
                    //the json encoding doesn't like single quotes as part of the text, so we replace with html number
                    itemFamilyContent = ifDiv.innerHTML.replace(/'/g, "&#39;");
                    // replacing commas with html number so can have comma-delimited string for item family content
                    itemFamilyContent = itemFamilyContent.replace(/,/g, "&#44;");
                }
                else {
                    itemFamilyContent = "";
                }
            }
            else {
                itemFamilyContent = "";
            }

            //Save something  in array for all item family highlightings, whether there is highlighted content or not
            //so the array of item family IDs will correspond to the array of item family markup
            arrItemFamilyMarkups.push(itemFamilyContent);
        }//end for 
    }//end if item family GE 1

    var optionsStem = {
        container: stemDiv,
        andSelf: false,
        grouped: false
    };

    var currentHighlightsStem;

    if (stemDiv != null) {
        currentHighlightsStem = highlighterTool.getHighlights(optionsStem);
    }
    else {
        currentHighlightsStem = [];
    }

    var stemContent = "";

    if (currentHighlightsStem.length > 0) {

        if (stemDiv != null) {
            //the json encoding doesn't like single quotes as part of the text, so we replace with html number
            stemContent = stemDiv.innerHTML.replace(/'/g, "&#39;");

        }
    }

    var childID = readStudentIDsCookie("ChildID");
    var testID = document.getElementById("hdnTestID").value;
    var questionID = document.getElementById("hdnQuestionID").value;

    //async = false so the save executes before the page reposts after navigation is triggered, otherwise we can lose data
    $.ajax({
        type: "POST",
        url: "/GalileoASP/ASPX/Testing/WebServices/TestingServices.asmx/SaveHighlighting",
        data: "{ testID: '" + testID + "'," + "questionID: '" + questionID + "'," + "highlightStem: '" + stemContent + "',"
            + "itemFamilyIDs: '" + arrItemFamilyIDs + "'," + "itemFamilyMarkups: '" + arrItemFamilyMarkups + "'}",
        async: false,
        timeout: 5000,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

        },

        error: function (xhr) {
            alert(xhr.responseText);
        }
    });
}


function SaveSubItemHighlights() {
    //called by SaveHighlights when dealing with an item collection
    //saves the highlights for each subitem in the item collection; does not save for question stem or item family
    var subItemIDs = document.getElementById(UserControlClientID + "hdnSubItemQuestionIDs").value.split(',');
    var subItemControlIDs = document.getElementById(UserControlClientID + "hdnSubItemControlIDs").value.split(',');
    for (var i = 0; i < subItemIDs.length; i++) {
        //save the highlights for stem, if there are any
        var stemDiv = document.getElementById(UserControlClientID + subItemControlIDs[i] + "_divStem");

        var optionsStem = {
            container: stemDiv,
            andSelf: false,
            grouped: false
        };

        var currentHighlightsStem;

        if (stemDiv != null) {
            currentHighlightsStem = highlighterTool.getHighlights(optionsStem);
        } else {
            currentHighlightsStem = [];
        }
        var stemContent = "";

        if (currentHighlightsStem.length > 0) {
            if (stemDiv != null) {
                //the json encoding doesn't like single quotes as part of the text, so we replace with html number
                stemContent = stemDiv.innerHTML.replace(/'/g, "&#39;");
            }
        }

        var childID = readStudentIDsCookie("ChildID");
        var questionID = subItemIDs[i];
        var testID = document.getElementById("hdnTestID").value;

        // set some empty variables so there is something to pass to SaveHighlighting
        var arrItemFamilyIDs = "";
        var arrItemFamilyMarkups = "";

        $.ajax({
            type: "POST",
            url: "/GalileoASP/ASPX/Testing/WebServices/TestingServices.asmx/SaveHighlighting",
            data: "{ testID: '" + testID + "'," + "questionID: '" + questionID + "'," + "highlightStem: '" + stemContent + "',"
                + "itemFamilyIDs: '" + arrItemFamilyIDs + "'," + "itemFamilyMarkups: '" + arrItemFamilyMarkups + "'}",
            async: false,
            timeout: 5000,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

            },

            error: function (xhr) {
                alert(xhr.responseText);
            }
        });

    }//end for

}

function GetMarkedQuestionIndexes() {
    var questionString = document.getElementById("hdnMarkedQuestionList").value;
    var markedQuestArray = questionString.split(",");
    markedQuestArray.sort();

    return markedQuestArray;
}

function AddOrRemoveQuestionToMarkedList(mark, index) {
    var markedQuestArray = GetMarkedQuestionIndexes();

    if (mark) {
        //add the item to the list
        markedQuestArray.push(index);
    } else {
        //remove the item from the list
        var itemIndex = markedQuestArray.indexOf(index.toString());
        if (itemIndex > -1) {
            markedQuestArray.splice(itemIndex, 1);
        }
    }

    markedQuestArray.sort();

    //update the hidden field value
    var hdnMarkedQuestList = document.getElementById("hdnMarkedQuestionList");
    hdnMarkedQuestList.value = markedQuestArray.toString();
}


function UpdateQuestionDDL() {
    var markedQuestArray = GetMarkedQuestionIndexes();

    $('#ddlQuestions2 > option').each(function () {
        var itemNum = $(this).val();
        var inMarkedArray = $.inArray((itemNum - 1).toString(), markedQuestArray); //marked items are stored by index, not item number

        if (inMarkedArray != -1) {
            //item is marked
            $(this).text("Item " + (itemNum) + " *");
            $(this).removeClass("UnmarkedQuestionListItem").addClass("MarkedQuestionListItem");
        } else {
            //item is not marked
            $(this).text("Item " + (itemNum));
            $(this).removeClass("MarkedQuestionListItem").addClass("UnmarkedQuestionListItem");
        }
    });

}

function GetUserControlPrefix(controlID) {
    //example of passed controlID: radListViewQuestion_ctrl1_expandedMCQacf8f999-e02f-4daf-a43b-a891b56fa5ce_btnExpand
    var res = controlID.split("_"); //split the long control id by _ into array
    res.pop(); // pop the last element, btnExpand in this example  
    var newRes = res.join("_");  //radListViewQuestion_ctrl1_expandedMCQacf8f999-e02f-4daf-a43b-a891b56fa5ce in this example  
    return newRes;
}



//Text to Speech
var subdividedText;
var textIndex;

function TTSError() {
    // alert("Text-to-Speech Error!");
}

function GetSubdividedText(text) {
    //instructions from Responsive Voice Rep
    //subdivide your text in paragraphs, 
    //and as text is spoken you increase 
    //the index that tracks the current paragraph. 
    //When resuming, then, you can play the text 
    //from the current paragraph index, so that 
    //you're not relying on the TTS engine.
    //*we will split into sentences to better accommodate
    //the way we need to manually control pausing
    //this also ensures that are requests are small enough that
    //they shouldn't freeze the TTS engines

    //remove whitespace from begin and end of text
    text = text.trim();

    //decode unicode so tts will read the symbols correctly
    text = decodeHtml(text);

    //add a period at the end in case the selected text has no ending punctuation
    //otherwise the last line will get left off
    var lastChar = text[text.length - 1];

    if (lastChar != '.' && lastChar != '!' && lastChar != '?') {
        text += ".";
    }

    if (text.length > 10) {
        //divide the text into an array by splitting at each punctuation mark
        //var dividedTextArray = text.match(/(\w[^.!?]+[.!?]+"?)\s?/g);
        var dividedTextArray;// = text.match(/([^.!?]+[.!?()]+"?)/g);

        dividedTextArray = text.replace(/(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|").split("|")
        return dividedTextArray;
    } else {
        var textArray = [text];
        return textArray;
    }
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
function SpeakText(index) {

    ShowPauseButton();

    //optional pitch (range 0 to 2), rate (range 0 to 1.5), volume (range 0 to 1)
    responsiveVoice.speak(subdividedText[index], "US English Female", {
        volume: 1, rate: .9, pitch: 1, onerror: TTSError, onend: function () {

            textIndex += 1;

            //if we aren't at the end of the text
            if (textIndex <= subdividedText.length - 1) {
                SpeakText(textIndex);
            }

            if (textIndex == subdividedText.length) {
                DisablePauseStop();
            }
        }
    });

}

function TTSIFText(IFDivID, hdnTTSTextboxID) {

    textIndex = 0;
    subdividedText = [];

    //hide the flyout menu
    $('#' + UserControlClientID + 'ttsTextMenuContainer').css({ 'display': 'none' });

    var IFdiv = document.getElementById(UserControlClientID + IFDivID);
    var hdnIFTTS = document.getElementById(UserControlClientID + hdnTTSTextboxID);

    var text;

    if ($(hdnIFTTS).val() != "") {
        text = $(hdnIFTTS).val().trim();
    } else {
        text = IFdiv.textContent.trim();
    }

    //get subdivided text array
    subdividedText = GetSubdividedText(text);

    //loop through array and speak the text at the first index
    SpeakText(textIndex);

}


function TTSStemText(ItemControlClientID) {

    textIndex = 0;
    subdividedText = [];

    //hide the flyout menu
    $('#' + ItemControlClientID + 'ttsMenuContainer').css({ 'display': 'none' });

    var divStem = document.getElementById(ItemControlClientID + 'divStem');
    var hdnStemTTS = document.getElementById(ItemControlClientID + 'hdnTTSStem');

    var text;

    if ($(hdnStemTTS).val() != "") {
        text = $(hdnStemTTS).val().trim();
    } else {
        text = divStem.textContent.trim();
    }

    ShowPauseButton();

    //get subdivided text array
    subdividedText = GetSubdividedText(text);

    //loop through array and speak the text at the first index
    SpeakText(textIndex);

}

function TTSOptionsText(ItemControlClientID) {
    //clear the array
    textIndex = 0;
    subdividedText = [];

    //hide the flyout menu
    $('#' + ItemControlClientID + 'ttsMenuContainer').css({ 'display': 'none' });

    var hiddenTTS = $('#' + ItemControlClientID + 'hdnTTSChoices').val();

    if (hiddenTTS != "") {
        var hiddenTTSArray = hiddenTTS.split('&next');
        $.each(hiddenTTSArray, function (i, val) {
            //if there are multiple characters
            if (val.length > 2) {
                //subdivides the choice and adds the next lines of text to the original array
                $.merge(subdividedText, GetSubdividedText(val));

            } else {
                //otherwise, just add the line to the subdivided array
                subdividedText.push(val);
            }

        });
    } else {
        $('#' + ItemControlClientID + 'answerChoiceTable tr a.AnswerChoiceLink').each(function (i, row) {
            subdividedText.push(row.textContent.trim());
        });
    }

    ShowPauseButton();

    SpeakText(textIndex);

}

function TTSSequenceOptionsText(ItemControlClientID) {
    //clear the array
    textIndex = 0;
    subdividedText = [];

    //hide the flyout menu
    $('#' + ItemControlClientID + 'ttsMenuContainer').css({ 'display': 'none' });

    $('#' + ItemControlClientID + 'startList li').each(function (i, li) {
        //if the option is visible, add it to the array
        if ($(li).hasClass('hideListItem') == false) {
            //find the hidden text area control and add it's content to the array
            var ttsTextAreaText = $(li).find("textarea").val();
            if (ttsTextAreaText.length > 2) {
                //subdivides the choice and adds the next lines of text to the original array
                $.merge(subdividedText, GetSubdividedText(ttsTextAreaText));

            } else {
                //otherwise, just add the line to the subdivided array
                subdividedText.push(ttsTextAreaText);
            }
        }
    });

    ShowPauseButton();

    SpeakText(textIndex);
}

function TTSStemAndOptionsText(ItemControlClientID) {

    //clear the array
    textIndex = 0;
    subdividedText = [];

    //hide the flyout menu
    $('#' + ItemControlClientID + 'ttsMenuContainer').css({ 'display': 'none' });

    var divStem = document.getElementById(ItemControlClientID + 'divStem');
    var hdnStemTTS = document.getElementById(ItemControlClientID + 'hdnTTSStem');

    var text;

    if ($(hdnStemTTS).val() != "") {
        text = $(hdnStemTTS).val().trim();
    } else {
        text = divStem.textContent.trim();
    }

    ShowPauseButton();

    //get subdivided text array
    subdividedText = GetSubdividedText(text);

    var hiddenTTS = $('#' + ItemControlClientID + 'hdnTTSChoices').val();

    //add the options to the stem in the array
    if (hiddenTTS != "") {
        var hiddenTTSArray = hiddenTTS.split('&next');
        $.each(hiddenTTSArray, function (i, val) {
            //if there are multiple characters
            if (val.length > 2) {
                //subdivides the choice and adds the next lines of text to the original array
                $.merge(subdividedText, GetSubdividedText(val));

            } else {
                //otherwise, just add the line to the subdivided array
                subdividedText.push(val);
            }

        });
    } else {
        $('#' + ItemControlClientID + 'answerChoiceTable tr a.AnswerChoiceLink').each(function (i, row) {
            subdividedText.push(row.textContent.trim());
        });
    }
    //loop through array and speak the text at the first index
    SpeakText(textIndex);

}

function TTSSequenceStemAndOptionsText(ItemControlClientID) {

    //clear the array
    textIndex = 0;
    subdividedText = [];

    //hide the flyout menu
    $('#' + ItemControlClientID + 'ttsMenuContainer').css({ 'display': 'none' });

    var divStem = document.getElementById(ItemControlClientID + 'divStem');
    var hdnStemTTS = document.getElementById(ItemControlClientID + 'hdnTTSStem');

    var text;

    if ($(hdnStemTTS).val() != "") {
        text = $(hdnStemTTS).val().trim();
    } else {
        text = divStem.textContent.trim();
    }

    //get subdivided text array
    subdividedText = GetSubdividedText(text);

    ShowPauseButton();

    $('#' + ItemControlClientID + 'startList li').each(function (i, li) {
        //if the option is visible, add it to the array
        if ($(li).hasClass('hideListItem') == false) {
            //find the hidden text area control and add it's content to the array
            var ttsTextAreaText = $(li).find("textarea").val();
            if (ttsTextAreaText.length > 2) {
                //subdivides the choice and adds the next lines of text to the original array
                $.merge(subdividedText, GetSubdividedText(ttsTextAreaText));

            } else {
                //otherwise, just add the line to the subdivided array
                subdividedText.push(ttsTextAreaText);
            }
        }
    });


    //loop through array and speak the text at the first index
    SpeakText(textIndex);

}

function TTSInteractiveTextStemText(ItemControlClientID) {

    //clear the array
    textIndex = 0;
    subdividedText = [];

    //hide the flyout menu
    $('#' + ItemControlClientID + 'ttsMenuContainer').css({ 'display': 'none' });

    var divStem = document.getElementById(ItemControlClientID + 'divStem');
    var text;
    var hiddenStemTTS = $('#' + ItemControlClientID + 'hdnTTSStem').val();

    if (hiddenStemTTS != "") {
        text = hiddenStemTTS;
    } else {
        text = divStem.textContent;
    }


    //get subdivided text array
    subdividedText = GetSubdividedText(text);

    ShowPauseButton();


    //loop through array and speak the text at the first index
    SpeakText(textIndex);



}

function TTSInteractiveTextMarkupText(ItemControlClientID) {

    //clear the array
    textIndex = 0;
    subdividedText = [];

    //hide the flyout menu
    $('#' + ItemControlClientID + 'ttsMenuContainer').css({ 'display': 'none' });

    var divITQuestion = document.getElementById(ItemControlClientID + 'divInteractiveTextQuestion');
    var ITtext;

    var hiddenMarkupTTS = $('#' + ItemControlClientID + 'hdnTTSMarkup').val();

    if (hiddenMarkupTTS != "") {
        ITtext = hiddenMarkupTTS;
    } else {
        ITtext = divITQuestion.textContent;
    }

    //get subdivided text array
    subdividedText = GetSubdividedText(ITtext);

    ShowPauseButton();


    //loop through array and speak the text at the first index
    SpeakText(textIndex);


}

function TTSInteractiveTextStemAndMarkupText(ItemControlClientID) {

    //clear the array
    textIndex = 0;
    subdividedText = [];

    //hide the flyout menu
    $('#' + ItemControlClientID + 'ttsMenuContainer').css({ 'display': 'none' });


    var divStem = document.getElementById(ItemControlClientID + 'divStem');
    var text;
    var hiddenStemTTS = $('#' + ItemControlClientID + 'hdnTTSStem').val();

    if (hiddenStemTTS != "") {
        text = hiddenStemTTS;
    } else {
        text = divStem.textContent;
    }

    //get subdivided text array
    subdividedText = GetSubdividedText(text);

    var divITQuestion = document.getElementById(ItemControlClientID + 'divInteractiveTextQuestion');
    var ITtext;

    var hiddenMarkupTTS = $('#' + ItemControlClientID + 'hdnTTSMarkup').val();

    if (hiddenMarkupTTS != "") {
        ITtext = hiddenMarkupTTS;
    } else {
        ITtext = divITQuestion.textContent;
    }

    //add markup text to subdivided text array
    $.merge(subdividedText, GetSubdividedText(ITtext));

    ShowPauseButton();

    //loop through array and speak the text at the first index
    SpeakText(textIndex);


}


function StopSpeech() {
    if (responsiveVoice.isPlaying()) {
        ShowPauseButton();
        responsiveVoice.cancel();
        DisablePauseStop();
    }
}

function PauseSpeech() {
    if (responsiveVoice.isPlaying()) {
        //** we won't use this because the 
        //TTS engine has a short hard limit 
        //for length of time the text can be paused
        //instead, we keep track of where we are in the text manually
        //and resume play from that position/index
        //responsiveVoice.pause(); 
        responsiveVoice.cancel();
        ShowPlayButton();
    }
}

function ResumeSpeech() {
    SpeakText(textIndex);
    ShowPauseButton();
}

var stopButtonID;
var pauseButtonID;
var playButtonID;


function ShowPauseButton() {
    //display pause btn
    $('#' + playButtonID).css("display", "none");
    $('#' + pauseButtonID).css("display", "block");

}

function ShowPlayButton() {
    //display play/resume btn
    $('#' + playButtonID).css("display", "block");
    $('#' + pauseButtonID).css("display", "none");

}

function EnablePauseStop(stopBtnClientID, pauseBtnClientID, playBtnClientID) {
    //Me.ttsStopButton.Attributes.Add("onclick", "StopSpeech();")
    //'Me.ttsPauseButton.Attributes.Add("onclick", "PauseSpeech();")

    //first ensure all other instances (item families and sub items, etc.) have been inactivated
    //and that the pause buttons are showing
    $('.TTSPause_30x30').addClass("TTSButtonDisable");
    $('.TTSStop_30x30').addClass("TTSButtonDisable");
    $('.TTSPlay_30x30').css("display", "none");
    $('.TTSPause_30x30').css("display", "block");

    //update class
    $('#' + stopBtnClientID).removeClass("TTSButtonDisable");
    $('#' + pauseBtnClientID).removeClass("TTSButtonDisable");

    //add click event
    $('#' + stopBtnClientID).bind("click", function () {
        StopSpeech();
    });

    $('#' + pauseBtnClientID).bind("click", function () {
        PauseSpeech();
    });

    stopButtonID = stopBtnClientID;
    pauseButtonID = pauseBtnClientID;
    playButtonID = playBtnClientID;
}

function DisablePauseStop() {

    //update class
    $('#' + stopButtonID).addClass("TTSButtonDisable");
    $('#' + pauseButtonID).addClass("TTSButtonDisable");

    //remove click event
    $('#' + stopButtonID).unbind("click");
    $('#' + pauseButtonID).unbind("click");

}
//var prevEssayContent;
//var hdnCurrentAnswerClientID;

// need a dictionary because we might have multiple essay items on the same page (item collection)
var g_DicPrevEssayContent = new Object();

function GetPrevValueFromDictionary(myKey) {
    for (var key in g_DicPrevEssayContent) {
        if (myKey == key) {
            return g_DicPrevEssayContent[key];
        }
    }

    return '';
}

function StartAutoSaveEssay(hdnAnswerClientID) {

    prevEssayContent = $('#' + hdnAnswerClientID).val();

    g_DicPrevEssayContent[hdnAnswerClientID] = prevEssayContent;

    //start an interval check to see if the editor content has changed, if it has, autosave
    setInterval(function () {

        SaveEssayItem($('#' + hdnAnswerClientID).val(), hdnAnswerClientID);


    }, 10000); //start with 10 seconds, we can reduce if really necessary but don't want to take too much of a performance hit
}

function SaveEssayItem(answer, hdnAnswerClientID) {
    var prevEssayContent;

    prevEssayContent = GetPrevValueFromDictionary(hdnAnswerClientID);


    //if the content has changed, autosave the essay item
    if (prevEssayContent != $('#' + hdnAnswerClientID).val()) {
        //update variable that stores our comparison value

        //do ajax call to save the essay response
        //first get all needed paramaters
        var questionID = $('#hdnQuestionID').val();
        var childID = $('#hdnChildID').val();
        var scheduleID = $('#hdnScheduleID').val();

        $.ajax({
            type: "POST",
            url: "/GalileoASP/ASPX/Testing/WebServices/TestingServices.asmx/SaveStudentEssayAnswer",
            data: "{ questionID: '" + questionID + "'," + "answer: " + JSON.stringify(answer) + "," +
                "childID: '" + childID + "'," + "scheduleID: '" + scheduleID + "'" + "}",
            async: true,
            timeout: 5000,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
            },
            error: function (xhr) {
                // appears that a student can generate an error on an open response item we think by doing the following:
                // the auto-save is kicked off at the same time the student navigates to another question or exits, etc.
                // Therefore we just don't show the error because we think everything is still saved on navigation.
                //alert(xhr.responseText);
                //we do want to throw an error if we are getting this because autosave isn't working in this case
                if (xhr.responseText == "Auto-save Error") {
                    alert("There was an error auto-saving your answer.");
                }
            }

        });

        g_DicPrevEssayContent[hdnAnswerClientID] = $('#' + hdnAnswerClientID).val();

    }


}



//do not rename this function
function InitializeEditors() {
    InitializeStudentTextEditor('.StudentTextEditor');//in InitializeHTMLEditors.js, loaded by AddFroalaEditorFiles.js

    // loop through each instance


    if (displayMode == 0) { //take test = 0

        // find all editor instances on the page
        $.each($('.StudentTextEditor'), function (index, editor) {
            var editorID;

            editorID = editor.id;

            //keep the hidden answer field updated with the latest student answer
            $('#' + editorID).on('froalaEditor.contentChanged', function (e, editor) {
                var hiddenID;

                hiddenID = editorID.replace("StudentAnswerEditor", "hdnCurrentAnswer");
                $('#' + hiddenID).val($('#' + editorID).froalaEditor('html.get', false));
            });

        });

        $('.StudentTextEditor').on('froalaEditor.focus', function (e, editor) {
            //attach listener for esc key so we can provide a way for a keyboard user to exit the editor
            //we use the tab to provide indent functionality for students
            $(document).keydown(function (e) {
                if (e.key === "Escape") { // escape key maps to keycode `27`
                    var exitFocusDiv = $('.EditorExitFocus')[0];
                    $(exitFocusDiv).focus();
                    $(document).off('keydown');//remove the listener that was added when editor got focus
                }
            });
        });

        $(document).on("click", function (e) {

            $(document).off('keydown');//remove the listener that was added when editor got focus

            var btnExit = $("#ExitTest"),
                btnNext = $("#btnNext"),
                btnPrev = $("#btnPrevious");

            //if the document is clicked outside of the textarea but not on any of the navigation controls
            if (!btnExit.is(e.target) && !btnNext.is(e.target) && !btnPrev.is(e.target) &&
                $(e.target).parents('div.fr-box').length < 1 &&
                $(e.target).parents("#ExitTest").length < 1 &&
                $(e.target).parents("#btnNext").length < 1 &&
                $(e.target).parents("#btnPrevious").length < 1) {


                // find all editor instances on the page
                $.each($('.StudentTextEditor'), function (index, editor) {
                    var editorID;

                    editorID = editor.id;
                    var answer = $('#' + editorID).froalaEditor('html.get', false);
                    SaveEssayItem(answer);

                });


            }

        });

    }

}

/*
 *  calculateMediaDuration() is a way to solve a problem with Chrome not showing the duration of a media file
 *  Returns a promise, that resolves when duration is calculated
 */
function calculateMediaDuration(media) {
    return new Promise((resolve) => {
        media.onloadedmetadata = function () {
            // set the mediaElement.currentTime  to a high value beyond its real duration
            media.currentTime = Number.MAX_SAFE_INTEGER;
            // listen to time position change
            media.ontimeupdate = function () {
                // setting player currentTime back to 0 can be buggy too, set it first to .1 sec
                media.currentTime = 0.1;
                media.currentTime = 0;
                // media.duration should now have its correct value, return it...
                resolve(media.duration);
            }
        }
    });
}
