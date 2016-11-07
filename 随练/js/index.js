$(function(){
	var lis=$(".left-list>li");
	lis.click(function(){
		$(".left-list2").hide();
		lis.find("a").removeClass("active");
		$(this).find(".left-list2").show();
		$(this).find("a").addClass("active");
	})
	$(".left-list2 a").click(function(event){
		event.preventDefault();
		var href=$(this).attr("href")
		$(".right>div").hide();
		$(href).show();
	})
})