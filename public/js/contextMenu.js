const $ = require('jquery');

module.exports = {
	openContextMenu: function(_event, _item){
		_event.preventDefault();
		$theMenu = $(".context-menu");
		$xPos = _event.clientX;
		$yPos = _event.clientY;

		$theMenu.slideDown('fast');
		$theMenu.css({
			'background-color': 'orange', 
			'top': $yPos - 10,
			'left': $xPos - 10,
			'width': '30px',
			'height': '30px'
		});
		$theMenu.mouseout(function(){
			$theMenu.slideUp('fast');
		});
		console.log("right clicked");
	}
}