var show_task = false;
var new_list = false;
var _rendered = false;
var _page = 1, _duplicate_page = 1;
var _current_page = 1, _duplicate_current_page = 1; 


setTimeout(realTime, 5000);
function realTime() {
    setTimeout(realTime, 1000);
    if(show_task){
        import_member_task();
        
    }
    
}

function import_member_task() {
    $.ajax({
        url: import_member_task_url,
        type: "POST",
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (response) {
            console.log(response)
            $('.loader-container').addClass('d-none');
            if(!response.message.import_process)
            {
                if (response.message.details.status != 'processed') {
                    $('.import-member-main-container').removeClass('d-none');
                }
                else{
                    $('.import-monitor-container').removeClass('d-none');    
                }
            }
            else{
                $('.import-monitor-container').removeClass('d-none');
                _rendered = false;
                _page = 1;
                _current_page = 1;
            }
            if(response.success) {
                _rendered = false;
                _page = 1;
                $('.inprogress-container').addClass('d-none');
                $('.result-container').removeClass('d-none');
                $('.date-processed').html(response.message.details.date_created);
                $('.current-line').html(response.message.details.current_line);
                $('.total-line').html(response.message.details.lines);
                $('.status').html(response.message.details.status);

                $('.success-message').addClass('d-none');

                let current_line = response.message.details.current_line;
                let total_line = response.message.details.lines;
                let progress = (current_line/total_line)*100;
                $('.progress .progress-bar').addClass('progress-bar-striped progress-bar-animated');
                $('.progress .progress-bar').css('width', progress+'%');
                $('.progress .progress-bar').css('aria-valuenow', progress);
                $('.progress').removeClass('d-none');

            } else {

                if (response.message.details.length == 0) {
                    return false;
                }
                $('.import-member-main-container').removeClass('d-none');
                $('.inprogress-container').addClass('d-none');
                $('.result-container').removeClass('d-none');
                $('.date-processed').html(response.message.details.date_created);
                $('.current-line').html(response.message.details.current_line);
                $('.total-line').html(response.message.details.lines);
                $('.status').html(response.message.details.status);

                let current_line = response.message.details.current_line;
                let total_line = response.message.details.lines;
                let progress = (current_line/total_line)*100;
                $('.progress .progress-bar').removeClass('progress-bar-striped progress-bar-animated');
                $('.progress .progress-bar').css('width', progress+'%');
                $('.progress .progress-bar').css('aria-valuenow', progress);

                setTimeout(function(){ 
                    $('.progress').addClass('d-none fade-out');
                }, 2000);
                if (response.message.details.status == 'processed' && !_rendered) {
                    show_task = false;
                    _rendered = true;
                    setTimeout(function() {
                        $('#modal_export').modal('hide')
                        window.open(response.message.details.export_file_url, '_blank'); 
                    }, 1000);
                   
                
                }
            }
        }
    });
}

function reset_import_result_elements(){
    _page = 1;
    _current_page=1;
    _duplicate_page=1;
    _duplicate_current_page=1;
    $('.inprogress-container').addClass('d-none');
    $('.progress .progress-bar').addClass('progress-bar-striped progress-bar-animated');
    $('.progress .progress-bar').css('width', '1%');
    $('.progress .progress-bar').css('aria-valuenow', '1');
    $('.progress').removeClass('d-none fade-out');

    $('.date-processed').html('<img src="'+_spinner+'" alt="" style="max-width: 20px;">');
    $('.current-line').html('<img src="'+_spinner+'" alt="" style="max-width: 20px;">');
    $('.total-line').html('<img src="'+_spinner+'" alt="" style="max-width: 20px;">');
    $('.status').html('<img src="'+_spinner+'" alt="" style="max-width: 20px;">');
    $('.error-table .result-table-container').html('<tr><td class="text-center" colspan="3"><h3>No data to display...</h3></td></tr>');
    $('.duplicate-table .result-table-container').html('<tr><td class="text-center" colspan="3"><h3>No data to display...</h3></td></tr>');
    $('.error-items').text('0 item');
    $('.error-table-pagination .display-page').text('1 of 1');
    $('.duplicate-table-pagination .display-page').text('1 of 1');

}



function reset_import_container() {
    $('.import-monitor-container').addClass('d-none');    
    $('.result-container').addClass('d-none');
    $('.error-only-container').addClass('d-none');
}