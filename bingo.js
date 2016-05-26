$(function(){
	var bingoTotal = 75;
	
	$('#manualBingo').click(function(){
		if('true' == $('#autoBingo').attr('auto')){
			$('#target').stop();
			$('#autoBingo').trigger('click');
		}else{
			$('#target').stop(true, true);
		}
		ranBingo();
	});
	$('#clearBingo').click(function(){
		set_local_value('oldBingos', '');
		location.reload();

	});
	$('#autoBingo').click(function(){
		if('true' == $('#autoBingo').attr('auto')){
			$('#autoBingo').attr('auto', 'false').text('自动');
			clearTimeout(bingoTimer);
			$('#target').stop();
		}
		else{
			$('#autoBingo').attr('auto', 'true').text('暂停');
			bingoAutoRun();
		}
	});
	
	var oldBingos = get_local_value('oldBingos'),
		bingoMap = {};
	
	if(oldBingos){
		oldBingos = oldBingos.split(',');
	}
	
	oldBingos = oldBingos || [];
	
	for(var i = 0; val = oldBingos[i]; i++){
		if(isNum(val)){
			$('#target').text(val);
			addBingo(val);
		}
		else{
			oldBingos = [];
		}
	}
	
	function bingoAutoRun(){
		var speed = 2000;
		if(oldBingos.length < bingoTotal){
			ranBingo(undefined, speed * 0.75);
			bingoTimer = setTimeout(function(){
				if(oldBingos.length < bingoTotal){
					bingoAutoRun();
				}
			}, speed);
		}
	}
	
	function ranBingo(num, speed){

		var targetVal = num || getRandom();

		if(undefined === targetVal){
			return;
		}
		
		var step = 0,
			stepLength = speed ? 15 : 3;
		$('#target').animateNumber({
				number: targetVal ,
				// color: 'green',
				// 'font-size': '100px',

				numberStep: function(now, tween) {
					var floored_number = now;
					if(now == target){
						floored_number = now;
					}
					else if(step++ % stepLength != 0){
						floored_number = $(tween.elem).text();
					}
					else{
						floored_number = Math.round(Math.random() * 74.9999999) + 1;
					}

					$(tween.elem).text(floored_number);
				}
			}, speed || 'slow', undefined, function(){
				$('#target').text(targetVal);
				addBingo(targetVal);
				storeBingo(targetVal);
		});
	}
	
	
	function addBingo(val){
		var aBingo = $('#bingo-template').clone();
		aBingo.children('.bingo-num').text(val);
		aBingo.attr('id', '').show().appendTo($('.bingo-riget'));
		bingoMap[val] = true;
	}
	
	function storeBingo(val){
		oldBingos[oldBingos.length] = val;
		set_local_value('oldBingos', oldBingos.join(','));
	}
	
	function getRandom(nostore){
		var val = (Math.round(Math.random() * 74.9999999) + 1),
			index = 0;
		while(bingoMap[val] && index++ < bingoTotal){
			val = (val + 1) % 75;
		}
		
		if(!bingoMap[val]){
			if(!nostore){
				bingoMap[val] = true;
			}
			return val;
		}
		else{
			return undefined;
		}
	}
});  

function isNum(num){
	if(0 == num - num){
		return true;
	}
	else{
		return false;
	}
}

function set_local_value(key, val) {
	localStorage.setItem(key, val);
}
//从缓存中获取数据
function get_local_value(key) {
	return localStorage.getItem(key);
}
  