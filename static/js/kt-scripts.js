
var KTBootstrapSwitch = function() {
    var demos = function() {$('[data-switch=true]').bootstrapSwitch();};
    return {init: function() { demos(); },};
}();

jQuery(document).ready(function() {
KTBootstrapSwitch.init();
});
        // Class definition
var KTSelect2 = function() {
    // Private functions
    var demos = function() {
        // basic
        $('#kt_select2_1').select2({
            placeholder: "Select branch"
        });
        $('.kt_select2_option').select2({
            placeholder: "Select status",
            minimumResultsForSearch: -1
        });
        $('.kt_select2_branch').select2({
            placeholder: "Select branch"
        });

        // nested
        $('#kt_select2_2').select2({
            placeholder: "Select a state"
        });

        // multi select
        $('#kt_select2_3').select2({
            placeholder: "Select a state",
        });

        // basic
        $('.kt_select2_region').select2({
            placeholder: "Select Region",
            allowClear: true
        });
        $('.kt_select2_province').select2({
            placeholder: "Select Province",
            allowClear: true
        });
        $('.kt_select2_city').select2({
            placeholder: "Select City",
            allowClear: true
        });
        $('.kt_select2_barangay').select2({
            placeholder: "Select Barangay",
            allowClear: true
        });
        $('.kt_select2_health_center').select2({
            placeholder: "Select Health Center",
            allowClear: true
        });

        // loading data from array
        var data = [{
            id: 0,
            text: 'Enhancement'
        }, {
            id: 1,
            text: 'Bug'
        }, {
            id: 2,
            text: 'Duplicate'
        }, {
            id: 3,
            text: 'Invalid'
        }, {
            id: 4,
            text: 'Wontfix'
        }];

        $('#kt_select2_5').select2({
            placeholder: "Select a value",
            data: data
        });

        // loading remote data

        function formatRepo(repo) {
            if (repo.loading) return repo.text;
            var markup = "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository__meta'>" +
                "<div class='select2-result-repository__title'>" + repo.full_name + "</div>";
            if (repo.description) {
                markup += "<div class='select2-result-repository__description'>" + repo.description + "</div>";
            }
            markup += "<div class='select2-result-repository__statistics'>" +
                "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> " + repo.forks_count + " Forks</div>" +
                "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> " + repo.stargazers_count + " Stars</div>" +
                "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> " + repo.watchers_count + " Watchers</div>" +
                "</div>" +
                "</div></div>";
            return markup;
        }

        function formatRepoSelection(repo) {
            return repo.full_name || repo.text;
        }

        $("#kt_select2_6").select2({
            placeholder: "Search for git repositories",
            allowClear: true,
            ajax: {
                url: "https://api.github.com/search/repositories",
                dataType: 'json',
                delay: 250,
                data: function(params) {
                    return {
                        q: params.term, // search term
                        page: params.page
                    };
                },
                processResults: function(data, params) {
                    // parse the results into the format expected by Select2
                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data, except to indicate that infinite
                    // scrolling can be used
                    params.page = params.page || 1;

                    return {
                        results: data.items,
                        pagination: {
                            more: (params.page * 30) < data.total_count
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function(markup) {
                return markup;
            }, // let our custom formatter work
            minimumInputLength: 1,
            templateResult: formatRepo, // omitted for brevity, see the source of this page
            templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
        });

        // custom styles

        // tagging support
        $('#kt_select2_12_1, #kt_select2_12_2, #kt_select2_12_3, #kt_select2_12_4').select2({
            placeholder: "Select an option",
        });

        // disabled mode
        $('#kt_select2_7').select2({
            placeholder: "Select an option"
        });

        // disabled results
        $('#kt_select2_8').select2({
            placeholder: "Select an option"
        });

        // limiting the number of selections
        $('#kt_select2_9').select2({
            placeholder: "Select barangay",
            maximumSelectionLength: 2
        });
        $('#kt_assigned_vaccines').select2({
            placeholder: "Select barangay",
            maximumSelectionLength: 2
        });

        // hiding the search boxkt_select2_4
        $('.kt_select2_10').select2({
            placeholder: "Select status",
            minimumResultsForSearch: Infinity
        });
        $('.kt_select2_user_type').select2({
            placeholder: "Select user type",
            minimumResultsForSearch: Infinity
        });
        $('.kt_select2_account_type').select2({
            placeholder: "Select account type",
            minimumResultsForSearch: Infinity
        });
        $('#kt_select2_10').select2({
            placeholder: "Select option",
            minimumResultsForSearch: Infinity
        });
        $('.kt_select2_option_global').select2({
            placeholder: "Select option",
            minimumResultsForSearch: Infinity
        });
        $('.kt_select2_branch_global').select2({
            placeholder: "Select option"
        });
        $('.kt_select2_branch_area').select2({
            placeholder: "Select Branch Area",
            minimumResultsForSearch: Infinity
        });
        $('.kt_select2_shi_category').select2({
            placeholder: "Select SHI Category",
            minimumResultsForSearch: Infinity
        });
        $('.kt_select2_age').select2({
            placeholder: "Filter Age",
            minimumResultsForSearch: Infinity
        });

        // tagging support
        $('#kt_select2_11').select2({
            placeholder: "Add a tag",
            tags: true
        });

        // disabled results
        $('.kt-select2-general, .kt-select2-brand').select2({
            placeholder: "Select an option"
        });
        $('.kt-select2-action').select2({
            placeholder: "Action",
            minimumResultsForSearch: Infinity
        });
    }

    var modalDemos = function() {
        $('#kt_select2_modal').on('shown.bs.modal', function () {
            // basic
            $('#kt_select2_1_modal').select2({
                placeholder: "Select a state"
            });

            // nested
            $('#kt_select2_2_modal').select2({
                placeholder: "Select a state"
            });

            // multi select
            $('#kt_select2_3_modal').select2({
                placeholder: "Select a state",
            });

            // basic
            $('#kt_select2_4_modal').select2({
                placeholder: "Select a state",
                allowClear: true
            });
        });
    }

    // Public functions
    return {
        init: function() {
            demos();
            modalDemos();
        }
    };
}();

// Initialization
jQuery(document).ready(function() {
    KTSelect2.init();
});
$(".form-control").on("keypress", function(event) {
    let input = event.target;
    let val = input.value;
    let end = input.selectionEnd;
    if(event.keyCode === 32 && (val[end - 1] === " " || val[end] === " ")) {
        event.preventDefault();
        return false;
    }
 });

// Class definition
var KTBootstrapDatepicker = function () {

    var arrows;
    if (KTUtil.isRTL()) {
        arrows = {
            leftArrow: '<i class="la la-angle-right"></i>',
            rightArrow: '<i class="la la-angle-left"></i>'
        }
    } else {
        arrows = {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    }

    // Private functions
    var demos = function () {
        // minimum setup
        $('#kt_datepicker_1').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            format: 'YYYY-MM-DD',
            orientation: "bottom left",
            templates: arrows
        });

        // minimum setup for modal demo
        $('#kt_datepicker_1_modal').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            orientation: "bottom left",
            templates: arrows
        });

        // input group layout
        $('#kt_datepicker_2').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            orientation: "bottom left",
            templates: arrows
        });

        // input group layout for modal demo
        $('#kt_datepicker_2_modal').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            orientation: "bottom left",
            templates: arrows
        });

        // enable clear button
        $('#kt_datepicker_3, #kt_datepicker_3_validate').datepicker({
            rtl: KTUtil.isRTL(),
            todayBtn: "linked",
            clearBtn: true,
            todayHighlight: true,
            templates: arrows,
            format: 'yyyy-mm-dd'
        });

        // enable clear button for modal demo
        $('#kt_datepicker_3_modal').datepicker({
            rtl: KTUtil.isRTL(),
            todayBtn: "linked",
            clearBtn: true,
            todayHighlight: true,
            templates: arrows
        });

        // orientation
        $('#kt_datepicker_4_1').datepicker({
            rtl: KTUtil.isRTL(),
            orientation: "top left",
            todayHighlight: true,
            templates: arrows
        });

        $('#kt_datepicker_4_2').datepicker({
            rtl: KTUtil.isRTL(),
            orientation: "top right",
            todayHighlight: true,
            templates: arrows
        });

        $('#kt_datepicker_4_3').datepicker({
            rtl: KTUtil.isRTL(),
            orientation: "bottom left",
            todayHighlight: true,
            templates: arrows
        });

        $('#kt_datepicker_4_4').datepicker({
            rtl: KTUtil.isRTL(),
            orientation: "bottom right",
            todayHighlight: true,
            templates: arrows
        });

        // range picker
        $('#kt_datepicker_5').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            templates: arrows
        });

         // inline picker
        $('#kt_datepicker_6').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            templates: arrows
        });
    }

    return {
        // public functions
        init: function() {
            demos();
        }
    };
}();

jQuery(document).ready(function() {
    KTBootstrapDatepicker.init();
});

var KTBootstrapTimepicker = function () {

    var demos = function () {
        $('#kt_timepicker_1, #kt_timepicker_1_modal').timepicker({
            defaultTime: '',
        });

        $('#kt_timepicker_2, #kt_timepicker_2_modal').timepicker({
            minuteStep: 1,
            defaultTime: '',
            showSeconds: true,
            showMeridian: false,
            snapToStep: true
        });

        $('#kt_timepicker_3, #kt_timepicker_3_modal').timepicker({
            defaultTime: '11:45:20 AM',
            minuteStep: 1,
            showSeconds: true,
            showMeridian: true
        });

        // default time
        $('#kt_timepicker_4, #kt_timepicker_4_modal').timepicker({
            defaultTime: '10:30:20 AM',
            minuteStep: 1,
            showSeconds: true,
            showMeridian: true
        });
    }

    return {
        // public functions
        init: function() {
            demos();
        }
    };
}();

jQuery(document).ready(function() {
    KTBootstrapTimepicker.init();
});

// Demo 1
$('#kt_datetimepicker_1').datetimepicker();

// Demo 2
$('#kt_datetimepicker_2').datetimepicker({
    locale: 'de'
});

// Demo 3
$('#kt_datetimepicker_3').datetimepicker({
    format: 'L'
});

// Demo 4
$('#kt_datetimepicker_4').datetimepicker({
    format: 'LT'
});

// Demo 5
$('#kt_datetimepicker_5').datetimepicker();

// Demo 6
$('#kt_datetimepicker_6').datetimepicker({
    defaultDate: '11/1/2020',
    disabledDates: [
        moment('12/25/2020'),
        new Date(2020, 11 - 1, 21),
        '11/22/2022 00:53'
    ]
});

// Demo 7
$('#kt_datetimepicker_7_1').datetimepicker();
$('#kt_datetimepicker_7_2').datetimepicker({
    useCurrent: false
});

$('#kt_datetimepicker_7_1').on('change.datetimepicker', function(e) {
    $('#kt_datetimepicker_7_2').datetimepicker('minDate', e.date);
});
$('#kt_datetimepicker_7_2').on('change.datetimepicker', function(e) {
    $('#kt_datetimepicker_7_1').datetimepicker('maxDate', e.date);
});

// Demo 8
$('#kt_datetimepicker_8').datetimepicker({
    inline: true,
});

// Demo 9
$('#kt_datetimepicker_9').datetimepicker();

// Demo 10
$('#kt_datetimepicker_10').datetimepicker({
    locale: 'de'
});

// Demo 11
$('#kt_datetimepicker_11').datetimepicker({
    format: 'L'
});