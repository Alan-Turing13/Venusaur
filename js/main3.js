var createTodoUrl = "localhost:63343/untitled/todo.html";

// {# 1: MAKE THE TODO ITEMS #}
function display_task() {
console.log("display_task is working 👍🏻");
$.ajax({
    url : createTodoUrl,
    type : "POST",
    data : { user_task : $('#todo-item').val() },

    success : function(json) {
        $('#todo-item').val('');
        console.log(json);
        console.log("success");

        // {# TODO ITEM + CHECKBOX #}
        var uniqueId = new Date().getTime();
        $('#task-container').append(
            '<li>' +
            '<div class="checkbox">' +
            '<label for="' + uniqueId + '"><span class="strikethrough">' + json.task + '</span>' +
            '<input type="checkbox" id="ch-box' + uniqueId + '" value="1"/></label>' +
            '<button class="deadline-button" id="d-line' + uniqueId + '">add deadline</button>' +
            '<span id="deadlineContainer' + uniqueId + '"></span>' +
            '</div>' +
            '</li>');
    },

    error : function(xhr,errmsg,err) {
        $('#results').html("<div class='alert-box alert radius' data-alert>" +
        "Oops! We have encountered an error: "+errmsg+" <a href='#' class='close'>&times;</a></div>");
        console.log(xhr.status + ": " + xhr.responseText);
    }
    });
};

// {# 2: FORM SUBMISSION #}
$(document).ready(function() {

    var intervalId;

    $("#task-entry").submit(function (event) {
        event.preventDefault();
        display_task();

        // {# LAST UPDATED #}
        var submissionTime = moment(new Date());

        if(intervalId){
            clearInterval(intervalId);
        }

        intervalId = setInterval(function (){
            var now = moment(new Date());
            $('#updated-at').html('<p><span class="time-since"><br>Last updated: ' + submissionTime.fromNow() + '</p></span>');
        }, 1000);
    });

    // {# 3: + DEADLINE CLICK EVENT #}
    var deadlineIntervals = {};

    $(document).on('click', '.deadline-button', function(){
        var buttonId = $(this).attr('id');
        deadline(buttonId);

        // {# ONCE 'ADD DEADLINE' IS CLICKED #}
        function deadline(buttonId) {

            // {# html input form #}
            var datetimeInput = $('<input/>', {
                type: 'datetime-local',
                id: 'deadline' + buttonId,
                onfocus: 'this.showPicker()'
            });

            // {# input form replaces button #}
            $('#' + buttonId).after(datetimeInput);
            $('#' + buttonId).hide();
            datetimeInput.focus();

            // {# user inputs the deadline date #}
            datetimeInput.on('change', function () {
                var now = moment(new Date());
                var selectedDatetime = moment($(this).val());
                if (!selectedDatetime.isAfter(now)) {
                    alert("❗️Please select a deadline in the future.");
                }
                else {
                    datetimeInput.remove();

                    if (deadlineIntervals[buttonId]) {
                        clearInterval(deadlineIntervals[buttonId]);
                    }

                    deadlineIntervals[buttonId] = setInterval(function () {
                        var now = moment(new Date());
                        var deadlineDisplay = '<span class="time-remaining"> (deadline '
                            + selectedDatetime.fromNow() + ')</span>';
                        var containerId = buttonId.replace('d-line', '');
                        $('#deadlineContainer' + containerId).html(deadlineDisplay);

                        if (!selectedDatetime.isAfter(now)) {
                            $('#ch-box' + containerId).remove();
                            $('#deadlineContainer' + containerId).css('color', '#EA4C4C');
                        }
                    }, 1000)};
                });
            }
        });

// {# 4: CHECKBOX FUNCTIONALITY #}
$(document).on('change', 'input[type="checkbox"]', function () {
    if (this.checked) {
        $(this).siblings('span.strikethrough').css('text-decoration', 'line-through');
        var uniqueId = this.id.replace('ch-box', '');
        $('#d-line' + uniqueId).remove();
        $('#deadlineContainer' + uniqueId).remove();
        $(this).prop('disabled', true);

        checkTime = moment(new Date());

        if (intervalId) {
            clearInterval(intervalId);
        }

        intervalId = setInterval(function () {
            var now = moment(new Date());
            $('#updated-at').html('<p><span class="time-since"><br>Last updated: ' + checkTime.fromNow() + '</p></span>');
        }, 1000);

    } else {
        $(this).siblings('span.strikethrough').css('text-decoration', 'none');
    }
    })
});
