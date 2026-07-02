/****************END OF INPUTMASKS**********************/
    function show_error(message) {
        $.notify({
            message: message
        },{
            type: 'danger',
            z_index: '1051'
        });
        $('[data-notify=container]').removeClass('col-xs-9');
        $('[data-notify=container]').addClass('col-11');
    }
    function password_random(length) {
       let result           = '';
       let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
       let charactersLength = characters.length;
       for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }
    function generate_username(string){
        let result           = '';
        result = string.replace(/\s/g, '').toLowerCase()
        return result;
    }
    var address = encodeURIComponent('Philippines');
    $('#gmap_canvas').attr('src', 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCh8zqgzXMwMUqoxfM4XX6WPP3bxmkqLYw=' + address + '&zoom=13');

    function reset_map(region, province, municipality, barangay){
    	let str = province;
		if(municipality !== '')
			str += ', ' + municipality;
		if(barangay !== '')
			str += ', ' + barangay;
        console.log(str)
		address = encodeURIComponent('Philippines, ' + str);
    	$('#gmap_canvas').attr('src', 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCh8zqgzXMwMUqoxfM4XX6WPP3bxmkqLYw=' + address + '&zoom=13');
    }
    /*****DROPDOWN SELECT EVENT******/
    function reset_dropdown_select(_this, _text)
    {
        $(_this).next().find('.dg-btn-dropdown.onboarding-field').html(_text+' <i class="fa fa-chevron-down ml-1 float-right" aria-hidden="true"></i>');
        $(_this).attr('value', '');
    }
    /*****LOAD JSON FILE******/

    $.getJSON( "/static/json_files/philippines_addresses_v3.json", function( data ) {
        let items = '';
        let _region, _province, _municipality, _barangay = '';
        let _default_region = ($('input[name=region]').val() !== '' && $('input[name=region]').val() != null);
        let _default_province = ($('input[name=province]').val() !== '' && $('input[name=province]').val() != null);
        let _default_city = ($('input[name=city]').val() !== '' && $('input[name=city]').val() != null);
        let _default_barangay = ($('input[name=barangay]').val() !== '' && $('input[name=barangay]').val() != null);
        $.each( data, function( key, val ) {
            if(_default_region && $('input[name=region]').val() === val.region_name)
            {
                _region = key;
            }
            items += '<li><a class="d-block type-event" data-key=' + key + '>' + val.region_name + '</a></li>';
        });
        $('.region').html(items);


        /**************LOAD DEFAULT ADRESSES*****************/
        if(_default_province && _region)
        {

            items = '';
            $.each( data[_region]['province_list'], function( key, val ) {
                items += '<li><a class="d-block type-event" data-key="' + key + '">' + key + '</a></li>';
            });
            $('.province').html(items);
        }
        if(_default_province && _region)
        {
            _province = $('input[name=province]').val();
            items = '';
            $.each( data[_region]['province_list'][_province]['municipality_list'], function( key, val ) {
                items += '<li><a class="d-block type-event" data-key="' + key + '">' + key + '</a></li>';
            });
            $('.city').html(items);
        }
        if(_default_city && _region)
        {
            _municipality = $('input[name=city]').val();
            items = '';
            $.each( data[_region]['province_list'][_province]['municipality_list'][_municipality]['barangay_list'], function( key, val ) {
                items += '<li><a class="d-block type-event" data-key="' + key + '">' + val + '</a></li>';
            });
            $('.barangay').html(items);
        }
        if(_default_barangay && _region)
        {
            _barangay = $('input[name=barangay]').val();
            reset_map($('input[name=region]').val(), _province, _municipality, _barangay);
        }
        /**************END OF LOAD DEFAULT ADRESSES*****************/

        $(document).on('click', '.region li', function(){
        	_region = $(this).children().data('key');
        	items = '';
        	$.each( data[_region]['province_list'], function( key, val ) {
	            items += '<li><a class="d-block type-event" data-key="' + key + '">' + key + '</a></li>';
	        });
            reset_dropdown_select('input[name=province]', 'Province*');
            reset_dropdown_select('input[name=city]', 'City/Municipality*');
            reset_dropdown_select('input[name=barangay]', 'Barangay*');
	        $('.province').html(items);
        });

        $(document).on('click', '.province li', function(){

        	_province = $(this).children().data('key');
        	let _province_name = $(this).children().data('province_name');
        	items = '';
        	if (_region){
        	    $.each( data[_region]['province_list'][_province]['municipality_list'], function( key, val ) {
                    items += '<li><a class="d-block type-event" data-key="' + key + '">' + key + '</a></li>';
                });
            }else {
        	    for(let i = 0;i<data.length;i++){
        	        if (data[i]['province_list'][_province_name]){
        	            $.each( data[i]['province_list'][_province_name]['municipality_list'], function( key, val ) {
                            items += '<li><a class="d-block type-event" data-key="' + key + '">' + key + '</a></li>';
                        });
                    }
                }
            }

            reset_dropdown_select('input[name=city]', 'City/Municipality*');
            reset_dropdown_select('input[name=barangay]', 'Barangay*');
	        $('.city').html(items);
        });

        $(document).on('click', '.city li', function(){

        	_municipality = $(this).children().data('key');
        	let _city_name = $(this).children().data('city_name');
        	let _province_name = $(this).children().data('province_name');
        	items = '';
        	if (_region && _province){
                $.each( data[_region]['province_list'][_province]['municipality_list'][_municipality]['barangay_list'], function( key, val ) {
                    items += '<li><a class="d-block type-event" data-key="' + key + '">' + val + '</a></li>';
                });
        	}else{
        	    for(let i = 0;i<data.length;i++){
        	        if (data[i]['province_list'][_province_name]){
                        $.each( data[i]['province_list'][_province_name]['municipality_list'][_city_name]['barangay_list'], function( key, val ) {
                            items += '<li><a class="d-block type-event" data-key="' + key + '">' + val + '</a></li>';
                        });
                    }
                }
            }
            reset_dropdown_select('input[name=barangay]', 'Barangay*');
	        $('.barangay').html(items);
        });

        $(document).on('click', '.barangay li', function(){

        	_barangay = $(this).children().html();
        	// reset_map(_region, _province, _municipality, _barangay);

        });

    });
    $.getJSON( "/static/json_files/philippines_addresses_v3.json", function( data ) {
        let items = '';
        let _region, _province, _municipality, _barangay = '';
        $.each( data, function( key, val ) {
            items += '<option value="' + val.region_name + '" data-key=' + key + '>' + val.region_name + '</option>'
        });
        $('.kt_select2_region').append(items);

        $('.kt_select2_region').on('change', function (){
            let region_name = $(this).val()
            let items = '';
            $.each( data, function( key, val ) {
                if (data[key]['region_name'] === region_name){
                    _region = key
                    $.each( data[key]['province_list'], function( key, val ) {
                        items += '<option value="' + key + '" data-key=' + key + '>' + key + '</option>';
                    });
                }
	        });
            $('.kt_select2_barangay').html('<option label="Label"></option>');
            $('.kt_select2_barangay').attr('disabled', true);
            $('.kt_select2_city').html('<option label="Label"></option>');
            $('.kt_select2_city').attr('disabled', true);
            $('.kt_select2_province').html('<option label="Label"></option>');
            $('.kt_select2_province').attr('disabled', false);
            $('.kt_select2_province').append(items);
        })
        $('.kt_select2_province').on('change', function (){
            let province_name = $(this).val()
            let items = '';
            _province = province_name
            console.log(province_name)
            $.each( data[_region]['province_list'], function( key, val ) {
                if (key === province_name){
                    $.each( data[_region]['province_list'][key]['municipality_list'], function( key, val ) {
                        items += '<option value="' + key + '" data-key=' + key + '>' + key + '</option>';
                    });
                }
            });
            $('.kt_select2_barangay').html('<option label="Label"></option>');
            $('.kt_select2_barangay').attr('disabled', true);
            $('.kt_select2_city').html('<option label="Label"></option>');
            $('.kt_select2_city').attr('disabled', false);
            $('.kt_select2_city').append(items);
        })
        $('.kt_select2_city').on('change', function (){
            let city_name = $(this).val()
            let items = '';
            _municipality = city_name
            $.each( data[_region]['province_list'][_province]['municipality_list'], function( key, val ) {
                if (key === city_name){
                    $.each( data[_region]['province_list'][_province]['municipality_list'][city_name]['barangay_list'], function( key, val ) {
                        items += '<option value="' + val + '" data-key=' + val + '>' + val + '</option>';
                    });
                }
            });
            $('.kt_select2_barangay').html('<option label="Label"></option>');
            $('.kt_select2_barangay').attr('disabled', false);
            $('.kt_select2_barangay').append(items);
        })

    });
    /*****END OF LOAD JSON FILE******/

    /***********Search event for address fields***********/
