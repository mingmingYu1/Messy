<?php
/**返回当前登录用户总抽奖次数、已经使用的抽奖次数，以JSON格式**/
header('Content-Type:  application/json');

$user_name = '强东' ;
$lottery_total = 0;	//可用的总抽奖次数
$lottery_used = 0;	//已经使用的抽奖次数

$conn = mysqli_connect('127.0.0.1',  'root',  '',  'jd');
$sql = 'SET  NAMES  UTF8';
mysqli_query($conn,  $sql);
//获取当前用户所有订单的总金额
$sql = "SELECT  SUM(price)  FROM  jd_orders  WHERE  user_name='$user_name'    ";
$result = mysqli_query($conn,  $sql); //sum()函数返回的结果集中有且只有一行一列
$row = mysqli_fetch_row($result);
$sum = $row[0];
$lottery_total  = floor( $sum / 100 ) ;

//获取已经使用的抽奖次数
$sql = "SELECT  COUNT(id)  FROM  jd_lottery  WHERE user_name='$user_name'   ";
$result = mysqli_query($conn,  $sql);
$row = mysqli_fetch_row($result);
$lottery_used = intval($row[0]);  //intval()把字符串解析为int

//JSON:  {"lotterry_total":  39,  "lottery_used":  3}
$output = [ 
						'lottery_total'=>$lottery_total, 
						'lottery_used'=>$lottery_used
				  ];
echo   json_encode( $output );
?>