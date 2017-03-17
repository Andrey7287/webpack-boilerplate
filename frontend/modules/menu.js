export default class {

	constructor (duration = 500, menu = '.site-nav', burger = '.c-hamburger') {

		this.menu = menu;
		this.item = `${menu}__item`;
		this.activeItem = `${this.item}--act`;
		this.link = `${menu}__link`;
		this.burger = burger;
		this.duration = duration;
		this.isAnimating = false;
	}

	toggleAnimatingState(duration) {

		this.isAnimating = true;
		setTimeout(()=>{
			this.isAnimating = false;
		}, duration);

	}

	accordion(target, duration) {

		if (this.isAnimating) { return; }
		this.toggleAnimatingState(duration);

		target.toggleClass('mobile-open');
		target.toggleClass('mobile-close');
		if ( target.hasClass('hide') ){
			target.removeClass('hide');
			target.addClass('show');
		} else {
			target.removeClass('show');
			setTimeout(function(){
				target.addClass('hide');
			}, duration);
		}
	}

	toggleActiveItem(old, current) {

		old.removeClass( this.activeItem.slice(1) );
		current.addClass( this.activeItem.slice(1) );

	}

	initBurger() {

		$(this.burger).click((e)=> {

			var $button = $(e.target).is(this.burger) ? $(e.target) : $(e.target).parent();

			this.accordion( $(this.menu), this.duration );
			$button.toggleClass('is-active');

		});

	}

	closeOpened(target) {

		target.removeClass('mobile-open');
		target.addClass('mobile-close');
		target.removeClass('show');
		target.addClass('hide');

	}

	initMobile() {

		$(this.menu).on('click', this.link, (e)=>{


			e.preventDefault();

			var $target = $(e.target).is(this.link) ? $(e.target) : $(e.target).parent(),
					$targetItem = $target.parent(),
					$otherItems = $targetItem.siblings(),
					$otherOpened = $otherItems.find('.show'),
					$otherOpenedItem = $otherOpened.parent(),
					$innerMenu = $target.next();

			if ( !$innerMenu.length ) {
				location.href = $target.attr('href');
				return;
			}

			this.toggleActiveItem($otherItems, $targetItem);

			this.closeOpened($otherOpened);
			this.accordion($innerMenu, this.duration);

		});

	}

	destructMobile() {

		$(this.menu).unbind('click');

	}

}
