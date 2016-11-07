<?php
/**向客户端返回当前用户的所有订单，以JSON格式**/
header('Content-Type:  application/json');

//当前登录的用户名——服务器端有记载
$uname = '强东'; 
//分页查询每页要显示的记录数
$pageSize = 5;
//分页查询要显示的页号
@$pno = $_REQUEST['pno'];
if( !$pno ){
	$pno = 1;
}

//保存当前用户所有订单的大数组
$orders = [  ];

//发起数据库查询，获取当前用户所有的订单记录
$conn = mysqli_connect('127.0.0.1', 'root', '', 'jd');
$sql = 'SET NAMES utf8';
mysqli_query($conn,  $sql);
//获取当前用户订单的总数量
$sql = "SELECT  count(*) FROM jd_orders WHERE user_name='$uname'";
$result = mysqli_query($conn,  $sql);
$row = mysqli_fetch_row( $result ); //上述SQL语句的结果集中有且只有一行一列的数据
$totalCount = $row[0];
//计算出总的页数
$pageCount = ceil( $totalCount/$pageSize );

//根据用户名查询出其所有的订单(分页查询)
$start = ($pno-1)*$pageSize;  //从哪一行开始读取记录
$sql = "SELECT  *  FROM  jd_orders  WHERE  user_name='$uname'  LIMIT  $start,$pageSize"; 
$result = mysqli_query($conn,   $sql);
while(true){
	$row = mysqli_fetch_assoc($result);
	if( !$row ){
		break;
	}
	//获取当前订单所对应的所有商品
	$row['order_product_list'] = [  ];
	$sql = "SELECT  *  FROM  jd_products  WHERE product_id  IN  ( SELECT  product_id  FROM jd_order_product_detail WHERE  order_id=$row[order_id] )";
	$result2 = mysqli_query($conn, $sql);
	while(true){
		$p = mysqli_fetch_assoc($result2); //一个商品的信息
		if(!$p){
			break;
		}
		$row['order_product_list'][] = $p;
	}
	$orders[]  =  $row;
}


/*把所有订单转换为JSON字符串并输出给客户端
/echo  json_encode($orders);*/
/*******向客户端输出如下格式的数据***********
{
	"pno": 1,
	"pageCount": 5,
	"orders": [ {},{},{},{}]
}
***********************************************/
$output = [ ];
$output['pno'] = $pno;  //当前显示的页号
$output['pageCount'] = $pageCount;  //总的页数
$output['orders'] =  $orders;  //当前页面所包含的订单
echo  json_encode($output);
?>