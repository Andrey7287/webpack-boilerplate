$.fn.ravno = function () {
	var maxH = -1;
	var $cols = $(this).height("auto").each(function () {
		var h = $(this).height();
		maxH = h > maxH ? h : maxH;
	});
	$cols.height(maxH);
};
