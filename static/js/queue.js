var new_list = false;
    var _rendered = false;
    var _page = 1, _duplicate_page = 1;
    var _current_page = 1, _duplicate_current_page = 1; 
    var show_task = false;

    $(document).on('click', '.error-table-pagination .paginate-right', function(){
        if(_current_page==_page)
        {
            $(this).addClass('text-muted');
            $(this).removeClass('text-dark');
        }
        else
        {   
            $(this).addClass('text-dark');
            $(this).removeClass('text-muted');
            $('.error-table .page-'+_current_page).addClass('d-none');
            _current_page++;
            $('.error-table .page-'+_current_page).removeClass('d-none');
            $(this).parent().find('.display-page').text(_current_page + ' of ' + _page);
        }
        $(this).parent().find('.paginate-left').removeClass('text-muted');
        $(this).parent().find('.paginate-left').addClass('text-dark');
    });
    
    $(document).on('click', '.error-table-pagination .paginate-left', function(){
        if(_current_page==1)
        {
            $(this).addClass('text-muted');
            $(this).removeClass('text-dark');
        }
        else{
            $(this).addClass('text-dark');
            $(this).removeClass('text-muted');
            
            $('.error-table .page-'+_current_page).addClass('d-none');
            _current_page--;
            $('.error-table .page-'+_current_page).removeClass('d-none');
            $(this).parent().find('.display-page').text(_current_page + ' of ' + _page);
        }
        $(this).parent().find('.paginate-right').removeClass('text-muted');
        $(this).parent().find('.paginate-right').addClass('text-dark');
    });

    //===================== Task timer ======================//
    setTimeout(realTime, 5000);
    function realTime() {
        setTimeout(realTime, 1000);
        if(show_task){
            import_member_task();
            
        }
        
    }
    //====================== Import member ajax ======================//
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
                        
                        _rendered = true;
                        $('.success-message').removeClass('d-none');

                        let no_error = true;
                        $('.list-of-error').html('');

                        var error_list = response.message.details.errors.replace(/"/g, '');
                        error_list = JSON.parse(error_list.replace(/'/g, '"'));
                        if(error_list.length == 0){

                        } else {
                            
                        }
                        let _counter = 0;
                        $('.error-table .result-table-container').html('');
                        let _tbodies = '';
                        for (var key in error_list) {
                            _counter++;
                            if(_page==1)
                                _tbodies += '<tr class="page-'+_page+'">';
                            else
                                _tbodies += '<tr class="page-'+_page+' d-none">';

                            let _error = (error_list[key]).split(':');

                            _tbodies += '<td>'+ _error[0] +'</td><td>'+ _error[1] +'</td>';

                            if(_counter==20)
                            {
                                _page++;
                                _counter = 0; 
                            }
                            no_error = false;

                            _tbodies += '</tr>';
                        }
                        $('.error-table .result-table-container').append(_tbodies);

                        if($('tr.page-'+_page).length == 0)
                            _page--;
                        $('.error-table-pagination .display-page').text(_current_page + ' of ' + _page);

                        if(no_error)
                        {
                            $('.error-only-container').addClass('d-none');
                        }
                        else{
                            $('.error-only-container').removeClass('d-none');
                            $('.success-message label').parent().removeClass('bg-success').addClass('bg-danger');
                            let _plural = '';
                            if(error_list.length > 1)
                                _plural = 's';
                            $('.success-message label').text(error_list.length+' error' + _plural + ' were detected.');
                            $('.error-items').text(error_list.length + ' item' + _plural);
                        }

                        reset();
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
    function reset(){
        $('#import_form :input').prop('disabled', false);
        $('#kt_btn_1').html('SUBMIT');
        $('#import_form').trigger("reset");
        $('#display_content').hide()
        show_task = false;
    }



function reset_import_container() {
    $('.import-monitor-container').addClass('d-none');    
    $('.result-container').addClass('d-none');
    $('.error-only-container').addClass('d-none');
    
}