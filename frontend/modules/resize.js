export default class {

	constructor(bool){
		this.timing = 0;
		this.waitImg = bool;
	}

	bind(func){
		this.waitImg ? $(window).on('load', func) : func();

		$(window).resize(()=>{

			if ( !this.timing ) {
				this.timing = setTimeout(()=>{
					func();
					this.timing = 0;
				}, 200);
			}

		});
	}

}
