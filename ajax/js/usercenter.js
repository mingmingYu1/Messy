$('.menu a').click(function( event ){
	event.preventDefault( ) ;  //阻止点击超链接后的锚点跳转
	
	$('.menu a').removeClass('active');
	$(this).addClass('active');

	var divID = $(this).attr('href');
	$('.center > div').hide();
	$(divID).show();
});

/**页面加载完成时，向服务器异步请求当前用户的订单信息**/
/*<tr>
								<td colspan="6">
									订单编号：234213413
									<a href="#">京东自营</a>
								</td>
							</tr>
							<tr>
								<td>
									<a href="#"><img src="img/prod1.jpg"></a>
									<a href="#"><img src="img/prod2.jpg"></a>
								</td>
								<td>强东</td>
								<td>￥212.50<br>在线支付</td>
								<td>2010-10-15<br>10:22:35</td>
								<td>等待收货</td>
								<td>
									<a href="#">查看</a><br>
									<a href="#">确认收货</a><br>
									<a href="#">取消订单</a>
								</td>
							</tr>*/
$(function(){
	loadOrders(1);
});
//加载订单：
//   页面加载完成后，调用此方法加载第一页订单；
//   点击分页条上的某个超链接，调用此方法加载第n也订单
function loadOrders(pno){
	$.getJSON('data/userorder_list.php?pno='+pno, function(data){
		//console.log( data );
		//填充订单表格
		var orders = data.orders;
		var trs = '';  //把所有的订单封装为一个大的字符串 
		for(var i=0; i<orders.length; i++){
			var o = orders[i];
			trs += '<tr><td colspan="6">	订单编号：'+o.order_num+'<a href="'+o.shop_url+'">'+o.shop_name+'</a></td></tr>';
			trs += '<tr><td>';
			for(var j=0;  j<o.order_product_list.length; j++){
					var p = o.order_product_list[j];
					trs+='<a href="'+p.product_url+'"><img src="'+p.product_img+'"></a>';
			}
			trs +=			'<td>'+o.user_name+'</td>'+
								'<td>￥'+o.price+'<br>'+o.payment_mode+'</td>'+
								'<td>'+o.submit_time+'</td>'+
								'<td>'+orderStatus(o.order_state)+'</td>'+
								'<td>'+
									'<a href="#">查看</a><br>'+
									'<a href="#">确认收货</a><br>'+
									'<a href="#">取消订单</a>'+
								'</td></tr>';
		}
		$('#my-order table tbody').html(trs);
		
		//填充分页条
		var pager = '';
		data.pno = parseInt(data.pno); //把string解析为int
		if(data.pno-2>0){
			pager += '<li><a href="javascript: loadOrders('+(data.pno-2)+')">'+(data.pno-2)+'</a></li>';
		}
		if(data.pno-1>0){
			pager += '<li><a href="javascript: loadOrders('+(data.pno-1)+')">'+(data.pno-1)+'</a></li>';
		}
		pager += '<li class="active">'+data.pno+'</li>';
		if(data.pno+1<=data.pageCount){
			pager += '<li><a href="javascript: loadOrders('+(data.pno+1)+')">'+(data.pno+1)+'</a></li>';
		}
		if(data.pno+2<=data.pageCount){
			pager += '<li><a href="javascript: loadOrders('+(data.pno+2)+')">'+(data.pno+2)+'</a></li>';
		}


		$('.pager  ul').html(pager);
	});
}

function orderStatus(num){
	switch(num){
		case '1':{
			return '等待付款';
		}
		case '2':{
			return '等待发货';
		}
		case '3':{
			return '派货中';
		}
		case '4':{
			return '订单完成';
		}
		case '5':{
			return '订单取消';
		}
	}
}


/**页面加载完成时，绘制消费统计图**/
$(function(){
	//发起异步的AJAX请求，获取消费统计数据
	$.getJSON('data/buystatistics.php', {}, function(data){
		//console.log(data);  //12个月的消费统计
		drawStatistics( data ) ;  //绘制统计图
	})

	function drawStatistics( data ) {
		var statCanvas = $('#statistics').get(0);
		var w = statCanvas.width;    //canvas的宽
		var h = statCanvas.height;   //canvas的高

		var padding = 75;	//canvas中的图形距离边界的填充距离
		var origin = {x: padding,  y: (h-padding)};  //坐标轴的原点
		var leftTop = {x:  padding,  y:  padding }; //Y轴的顶点坐标
		var rightBottom = {x: w-padding  , y: (h-padding) }; //X轴的最有端点坐标

		var ctx = statCanvas.getContext('2d'); //获取2D绘图上下文对象
		console.log(ctx);

		/*****绘制坐标轴-X******/
		ctx.lineWidth = 2;   //路径线的宽度
		ctx.strokeStyle = '#666'; //路径线的颜色
		ctx.beginPath();
		ctx.moveTo(origin.x,  origin.y);
		ctx.lineTo(rightBottom.x,  rightBottom.y);
		ctx.lineTo(rightBottom.x-10,  rightBottom.y-10);
		ctx.moveTo(rightBottom.x,  rightBottom.y);
		ctx.lineTo(rightBottom.x-10,  rightBottom.y+10);
		var xGap =  (rightBottom.x-origin.x-30)/(data.length-1); //X轴上的坐标点的间距
		ctx.font = '16px  SimHei';
		for(var i=0; i<data.length;  i++){
			if(i!=0){
				ctx.moveTo(origin.x+ i*xGap,  origin.y);
				ctx.lineTo(origin.x+i*xGap,  origin.y-10);
			}
			ctx.fillText( data[i].name,  origin.x+ i*xGap-ctx.measureText(data[i].name).width/2,  origin.y+18);
		}

		/*****绘制坐标轴-Y******/
		ctx.moveTo(origin.x,  origin.y);
		ctx.lineTo(leftTop.x,  leftTop.y);
		ctx.lineTo(leftTop.x-10,  leftTop.y+10);
		ctx.moveTo(leftTop.x,  leftTop.y);
		ctx.lineTo(leftTop.x+10,  leftTop.y+10);
		var yGap = (origin.y-leftTop.y-30)/6;  //Y轴上的单元格间距
		var max = 0;
		for(var i=0; i<data.length; i++){	//获取消费金额的最大值
			if(data[i].value>max){
				max = data[i].value;
			}
		}
		for(var i=1;  i<7;  i++){
			ctx.moveTo(origin.x,  origin.y- i*yGap );
			ctx.lineTo(origin.x+10,  origin.y- i*yGap );
			var txt = Math.round(max/6*i);
			ctx.fillText(txt ,  origin.x-ctx.measureText(txt).width-2,  origin.y- i*yGap+6 );
		}
		
		/*****绘制折线图*******/
		for(var i=0; i<data.length;  i++){
			var x = origin.x + i*xGap;
			var y = origin.y - data[i].value*(origin.y-leftTop.y-30)/max;
			var txt = data[i].value;
			ctx.fillText(txt,  x-ctx.measureText(txt).width/2,  y-5);
			if(i==0){
				ctx.moveTo(x,  y);
			}else{
				ctx.lineTo(x,  y);
			}
		}
		ctx.stroke();

		/******绘制每个数值点处小圆圈******/
		for(var i=0; i<data.length;  i++){
			var x = origin.x + i*xGap;
			var y = origin.y - data[i].value*(origin.y-leftTop.y-30)/max;
			ctx.beginPath();
			ctx.fillStyle = rc();  //'#f00';
			ctx.arc(x,  y,  5,  0,  2*Math.PI);
			ctx.fill( );	//填充一个实心圆
		}
	}
});
/**返回一个随机的颜色值，形如：#ffffff**/
function rc(){
	var c = '#';
	for(var i=0; i<6; i++){
		c += parseInt(Math.random()*16).toString(16);
	}
	return c;
}


/*****页面加载完成后，请求消费统计信息，显示在FusionCharts图中******/
$(function(){
	$.getJSON('data/buystatistics-fc.php', function(data){
		//把服务器返回的数据显示在一个FC图中
		var fc = new FusionCharts({
			type: 'column2d',	//90+图之一  column2d  column3d  pie2d  pie3d  line  doughnut2d doughnut3d
			renderAt:  'buy-statistics-fc',  
			width: '750',
			height: '500',
			dataFormat: 'json',
			dataSource: {
				data: data
			}
		});
		fc.render( ); //渲染出图形
	});
});


/**当页面加载完成时，
	向服务器异步请求：当前用户可用的抽奖次数；
	加载抽奖的圆盘以及指针**/
$(function(){
	//初始时先禁用“开始抽奖”按钮
	$('#luck-lottery  button').attr('disabled', true);
	
	//获取剩余抽奖次数
	$.getJSON('data/lottery_count.php', function(data){
		//console.log(data); //Object {lottery_total: 39, lottery_used: 3}
		if(data.lottery_total>data.lottery_used){
			$('#luck-lottery  button')
				.html('开始抽奖(剩余抽奖次数'+(data.lottery_total-data.lottery_used)+')')
				.css('display', 'block')
				.click(function(){
					//创建定时器，每隔15毫秒在Canvas上绘制旋转后的圆饼和指针
					setLotteryTimer();
				});
		}else {
			$('#luck-lottery  button').hide();
			alert('您的剩余抽奖次数为0！');
		}
	});

	//“开始抽奖”按钮被单击后，每隔15毫秒在Canvas上绘制旋转后的圆饼和指针
	function setLotteryTimer(){
		$('#luck-lottery button').attr('disabled', true); //旋转过程中，按钮不能再被点击了

		var angle  = 0;   //画笔旋转的角度
		var duration = parseInt(Math.random()*5000) + 5000; //圆饼的旋转持续时间，在5~10s之间随机
		var startTime = new Date().getTime();//旋转开始的时间
		var canvas = $('#lottery').get(0);
		var ctx = canvas.getContext('2d');
		
		var timer = setInterval(function(){	//每50ms旋转n(20~0)度
			angle += 20*(startTime+duration-new Date().getTime())/duration;
			angle %= 360;
			ctx.rotate(angle* Math.PI/180);
			ctx.drawImage(pie,  -pie.width/2,  -pie.height/2);
			ctx.rotate(-angle* Math.PI/180);
			ctx.drawImage(pin,  -pin.width/2,  -pin.height/2);
			//实际旋转的时间若已经超过了预设的随机持续时间，则停止旋转
			if( (new Date().getTime() - startTime) >= duration ){
				clearInterval(timer);
				$('#luck-lottery button').attr('disabled', false); 
			}
		},  50);
	}

	/**必须保证圆饼和指针都加载成功后才开始绘制Canvas**/
	var pieLoaded = false;
	var pie = new Image();
	pie.src = 'img/as.png';	//类似的 异步加载图片
	pie.onload = function(){
		pieLoaded = true;
		if(pinLoaded){
			drawLotteryCanvas( );
		}
	}

	var pinLoaded = false;
	var pin = new Image();
	pin.src = 'img/pin.png';  //类似的 异步加载图片
	pin.onload = function(){
		pinLoaded = true;
		if(pieLoaded){
			drawLotteryCanvas( );
		}
	}

	function drawLotteryCanvas(){
		var canvas = $('#lottery').get(0);
		var w = canvas.width;
		var h = canvas.height;
		
		var ctx = canvas.getContext('2d');
		ctx.translate(w/2,  h/2);	 //修改画布的轴点

		//1最基础的绘制图像
		ctx.drawImage(pie,  -pie.width/2,  -pie.height/2);
		ctx.drawImage(pin,  -pin.width/2,  -pin.height/2);
		//静态的圆饼和指针绘制完毕，可以启用“开始抽奖”按钮了
		$('#luck-lottery button').attr('disabled',  false); 
		
		//2添加旋转 绘制图像 —— 无法旋转图像，只能旋转画布
		//ctx.rotate(45 * Math.PI/180);
		//ctx.drawImage(pie,  -pie.width/2,  -pie.height/2);
		//ctx.drawImage(pin,  -pin.width/2,  -pin.height/2);

		//3添加旋转 绘制图像 —— 仅圆饼转，指针不转
		//注意：ctx不应该翻译为“画布”，应该翻译为“绘图上下文”或“绘图对象”或“画笔对象”
		//rotate()方法旋转的是画笔，不是画布
		/*ctx.rotate(45 * Math.PI/180);
		ctx.drawImage(pie,  -pie.width/2,  -pie.height/2);
		ctx.rotate(-45 * Math.PI/180);
		ctx.drawImage(pin,  -pin.width/2,  -pin.height/2);*/

		//4使用定时器，不停地修改画笔旋转的角度
		/*var  angle = 0;
		setInterval( function(){		//每15毫秒转角+5度
			angle+=5;
			angle %= 360;  //防止angle的值变的太大
			ctx.rotate(angle * Math.PI/180);
			ctx.drawImage(pie,  -pie.width/2,  -pie.height/2);
			ctx.rotate(-angle * Math.PI/180);
			ctx.drawImage(pin,  -pin.width/2,  -pin.height/2);
		},  15);*/
	}
});
