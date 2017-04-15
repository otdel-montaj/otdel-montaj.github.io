if (!self.jaNewsflash) {
	var jaNewsflash = {
		get: function() {
			//get a random number
			var news = 0;
			var i = 10;
			while (--i > 0)
			{
				news = Math.floor(jaNewsflash.totalItem*Math.random());
				if(news != jaNewsflash.currentItem) break;
			}
			jaNewsflash.currentItem = news;

			if(!jaNewsflash.cachearray[jaNewsflash.currentItem]){
				url = jaNewsflash.livesite + '/modules/mod_janewsflash/ja_newsflash/ja-newsflashloader.php?curnews=' + jaNewsflash.currentItem + '&loadajax=1&total=' + jaNewsflash.totalItem+'&modid=' + jaNewsflash.modid;
				new Ajax(url,{method:'get',onComplete:jaNewsflash.update}).request(); 
			}else{
				jaNewsflash.update(null);
			}
			return false;	
		},
		
		update: function(request) {
			if (request)
			{
				jaNewsflash.cachearray[jaNewsflash.currentItem] = request;
			}else{
				request = jaNewsflash.cachearray[jaNewsflash.currentItem];
			}
			jaNewsflash.responce = request.split(jaNewsflash.splitter);
			//jaNewsflash.currentItem = jaNewsflash.responce[1];
			jaNewsflash.objs[1].innerHTML = jaNewsflash.responce[0];
			if (isIE6()) {
			   makeTransBg ($$(jaNewsflash.objs[1].getElementsByTagName('IMG')));
			}
			jaNewsflash.e.animation();
			jaNewsflash.timer = setTimeout(jaNewsflash.get, jaNewsflash.delaytime*1000);	
			return false;	
		},
		
		init: function (){
			jaNewsflash.cachearray = new Array(jaNewsflash.totalItem);
			jaNewsflash.timer = setTimeout(jaNewsflash.get, jaNewsflash.delaytime*1000);	

			jaNewsflash.objs = new Array();
			jaNewsflash.objs[0] = document.getElementById("ja-scroll_1");			
			jaNewsflash.objs[1] = document.getElementById("ja-scroll_2");
			if (!jaNewsflash.objs[0] || !jaNewsflash.objs[1])
			{
				return;
			}
			switch(jaNewsflash.animation){
				case 'scroll_right':
					jaNewsflash.e = new scroll_right(jaNewsflash.objs);
					break;
				case 'scroll_up':
					jaNewsflash.e = new scroll_up(jaNewsflash.objs);
					break;
				case 'scroll_down':
					jaNewsflash.e = new scroll_down(jaNewsflash.objs);
					break;
				case 'effect_fade':
					jaNewsflash.e = new effect_fade(jaNewsflash.objs);
					break;
				case 'effect_replace':
					jaNewsflash.e = new effect_replace(jaNewsflash.objs);
					break;
				case 'scroll_left':
				default:
					jaNewsflash.e = new scroll_left(jaNewsflash.objs);
					break;
					
			}
		},
		
		swap: function() {
			term = jaNewsflash.objs[0];
			jaNewsflash.objs[0] = jaNewsflash.objs[1];
			jaNewsflash.objs[1] = term;
		}
		
	}
	jaAddEvent(window,'load', jaNewsflash.init);
}

scroll_base = new Class ({
	animation:function () {
		x = new Fx.Elements(jaNewsflash.objs, { wait: false, duration: jaNewsflash.interval, onComplete:jaNewsflash.swap});
		x.start(this.ef);
		return false;
	}
})
scroll_up = scroll_base.extend({
	initialize: function(objs) {
		this.elements = objs;
		this.elements[0].style.top=0;
		this.elements[1].style.top='100%';
		this.elements[0].style.display="block";
		this.elements[1].style.display="block";
		this.W = this.elements[0].offsetHeight;
		this.elements[0].style.height = this.W + "px";
		this.elements[1].style.height = this.W + "px";
		
		this.ef = {};
		this.ef[0] = { 'top': [ 0 , -this.W] };
		this.ef[1] = { 'top': [ this.W, 0] };

		return false;
	}

});

scroll_down = scroll_base.extend ({
	initialize: function(objs) {
		this.elements = objs;
		this.elements[0].style.top=0;
		this.elements[1].style.top='100%';
		this.elements[0].style.display="block";
		this.elements[1].style.display="block";
		this.W = this.elements[0].offsetHeight;
		this.elements[0].style.height = this.W + "px";
		this.elements[1].style.height = this.W + "px";
		
		this.ef = {};
		this.ef[0] = { 'top': [ 0, this.W] };
		this.ef[1] = { 'top': [ -this.W, 0] };

		return false;
	}
});

scroll_left = scroll_base.extend ({
	initialize: function(objs) {
		this.elements = objs;
		this.elements[0].style.left=0;
		this.elements[1].style.left='100%';
		this.elements[0].style.display="block";
		this.elements[1].style.display="block";
		this.W = this.elements[0].offsetWidth;
		this.elements[0].style.width = this.W + "px";
		this.elements[1].style.width = this.W + "px";
		
		this.ef = {};
		this.ef[0] = { 'left': [ 0 , -this.W] };
		this.ef[1] = { 'left': [ this.W, 0] };

		return false;
	}
});

scroll_right = scroll_base.extend ({
	initialize: function(objs) {
		this.elements = objs;
		this.elements[0].style.left=0;
		this.elements[1].style.left='100%';
		this.elements[0].style.display="block";
		this.elements[1].style.display="block";
		this.W = this.elements[0].offsetWidth;
		this.elements[0].style.width = this.W + "px";
		this.elements[1].style.width = this.W + "px";
		
		this.ef = {};
		this.ef[0] = { 'left': [ 0 , this.W] };
		this.ef[1] = { 'left': [ -this.W, 0] };

		return false;
	}
});

effect_fade = new Class ({
	initialize: function(objs) {
		this.elements = objs;
		this.elements[0].style.display="block";
		this.elements[1].style.display="block";
		new Fx.Style(this.elements[1], 'opacity').set(0);
		return false;
	},

	animation:function () {
		x = new Fx.Elements(jaNewsflash.objs, { wait: false, duration: jaNewsflash.interval, onComplete:jaNewsflash.swap, transition: Fx.Transitions.Expo.easeOut});
		ef = {};
		ef[0] = { 'opacity': [ 1, 0] };
		ef[1] = { 'opacity': [ 0, 1] };
		x.start(ef);
		return false;
	}
})

effect_replace = new Class ({
	initialize: function(objs) {
		this.elements = objs;
		this.elements[0].style.display="block";
		this.elements[1].style.display="none";
		return false;
	},

	animation:function () {
		jaNewsflash.swap();
		this.elements[0].style.display="block";
		this.elements[1].style.display="none";
		return false;
	}
})