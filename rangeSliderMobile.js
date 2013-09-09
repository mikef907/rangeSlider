(function ($) {
    $.fn.rangeSliderMobile = function (options) {
		var settings = $.extend({
			'min' : 0,
			'max' : 20,
			'v1'  : document.createElement("SPAN"),
			'v2'  : document.createElement("SPAN"),
			'out' : document.createElement("DIV"),
			'pre' : '$',
			'cb': function () { return console.log('default cb');}
		}, options)
		
		var callbacks = $.Callbacks();
		callbacks.add(settings['cb']);
        var _r1 = false;
		var _r2 = false;
		var min = settings['min'];
		var max = settings['max'];
        
		//Vars for values
		var v1 = min;
		var v2 = max;
		settings['v1'].id = 'v1';
		settings['v2'].id = 'v2';
		settings['v1'].innerHTML = settings['min'];
		settings['v2'].innerHTML = settings['max'];

		settings['out'].innerHTML = settings['pre'];
		settings['out'].innerHTML += '<span id="v1">' + settings['v1'].innerHTML + '</span> - ' + settings['pre'];
		settings['out'].innerHTML += '<span id="v2">' + settings['v2'].innerHTML + '</span>';

		var el = this;
        //el.attr('style', 'display:block; position:relative; margin-left:10px;');
		el.attr('style', 'display:block; position:relative; margin-left:10px;');
		var _cur;
		var _x
        //Bar for pointers
		var bar = document.createElement("DIV");
		bar.className = "bar";
		//Range pointers
		var r1 = document.createElement("DIV");
		r1.id = "r1";
		r1.className = "pointer";
		var r2 = document.createElement("DIV");
		r2.id = "r2";
		r2.className = "pointer";
		el.append(r1);
		el.append(r2);
		el.append(bar);
		var offset = $('.pointer').width();
		_offset0 = $('.bar').offset()['left'] - $(r1).width() / 2;
		_offset1 = $('.bar').width() + $('.bar').offset()['left'] - $(r1).width() / 2;

		$(r1).offset({left:_offset0});
		$(r2).offset({left:_offset1});
		
		$('#r1').bind('touchstart mousedown', function (e) {
		    e.preventDefault();
			_r1 = true;
			$(this).bind('touchend', function (e) { _r1 = false; })
		})
			
		$('#r2').bind('touchstart mousedown', function (e) {
			e.preventDefault();
			_r2 = true;
			$(this).bind('touchend', function (e) { _r2 = false; })
		})
        
		$(document).on('mouseup', function (e) {
			_r1 = false;
			_r2 = false;
		})
        
		$(window).resize(function () {
		    var tmp0 = $('.bar').offset()['left'] - $(r1).width() / 2;
		    var tmp1 =  $('.bar').width() + $('.bar').offset()['left'] - $(r1).width() / 2;
		    var changed = false;

		    if (_offset0 != tmp0) {
		        _offset0 = tmp0;
		        $('#r1').offset({ left: _offset0 });
		        settings['v1'].innerHTML = settings['min'];
		        changed = true;
		    }
		    if (_offset1 != tmp1) {
		        _offset1 = tmp1;
		        $('#r2').offset({ left: _offset1 });
		        settings['v2'].innerHTML = settings['max'];
		        changed = true;
		    }
		    if (changed) {
		        settings['out'].innerHTML = settings['pre'];
		        settings['out'].innerHTML += '<span id="v1">' + settings['v1'].innerHTML + '</span>';
		        settings['out'].innerHTML += " - " + settings['pre'];
		        settings['out'].innerHTML += '<span id="v2">' + settings['v2'].innerHTML + '</span>';
		        callbacks.fire();
		    }
		})
        
	    $(document).bind('touchmove mousemove', function (e) {
		    if(_r1 === true || _r2 === true){
			    if(e.type === 'touchmove')
			    {
				    _x = e.originalEvent.touches[0].pageX;
			    }
			    else
			    {
				    _x = e.originalEvent.pageX;
			    }

			    if(($(r1).offset()['left'] + offset) >= $(r2).offset()['left']
			    && ((_r1 === true && $(r1).offset()['left'] < _x)
			    || (_r2 === true && ($(r1).offset()['left'] + offset + 10) > _x)))
			    {
				    var _v = _r1 === true ? settings['v1'] : settings['v2'];
				    var r = _r1 === true ? r1 :r2;
				    $(r).offset({ left: r === r1 ? $(r2).offset()['left'] - offset : $(r1).offset()['left'] + offset })
				    _v.innerHTML = _v === settings['v1'] ? settings['v2'].innerHTML : settings['v1'].innerHTML;
				    if(_r1 === true)
				    {
					    settings['v1'].innerHTML = settings['v2'].innerHTML;
				    }
				    else{
					    settings['v2'].innerHTML = settings['v1'].innerHTML;
				    }
			    }
			    else if (_r1 === true) {
				    settings['v1'].innerHTML = move(e, r1);
			    }
			    else if(_r2 === true){
				    settings['v2'].innerHTML = move(e, r2);
			    }
			    settings['out'].innerHTML = settings['pre'];
			    settings['out'].innerHTML += '<span id="v1">' + settings['v1'].innerHTML + '</span>';
			    settings['out'].innerHTML += " - " + settings['pre'];
			    settings['out'].innerHTML += '<span id="v2">' + settings['v2'].innerHTML + '</span>';
                callbacks.fire();
		    }
	    })
		
		function move(e, p){
			var _min = $('.bar').offset()['left'] ;
			var _max = $('.bar').width() + $('.bar').offset()['left'];

			if (e.originalEvent.touches !== undefined) {
			    _cur = e.originalEvent.touches[0].pageX;
			}
			else {
			    _cur = e.pageX
			}
			var posX = _cur - ($(p).width() / 2);
			var pct = (posX - _min + offset) / (_max - _min);
			pct = pct > 1 ? 1 : pct;
			pct = pct < 0 ? 0 : pct;
			if(posX < (_min - ($(p).width() / 2))) { 
				posX = _min - ($(p).width() / 2); 
				pct = 0;
			}
			else if(posX > (_max - ($(p).width() / 2))) {
				posX = _max - ($(p).width() / 2);
				pct = 1;
			}

			$(p).offset({ left: posX })
            
			return parseInt(max * pct);
		}
        
    };
})(jQuery);
