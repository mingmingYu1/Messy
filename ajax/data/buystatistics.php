<?php
/**返回当前用户按月份统计的消费记录**/
header('Content-Type:  application/json');

//TODO: 按照月份进行分组，查询数据库，得到每个月消费统计
//$stat = ['1月'=>3500, '2月'=>1500];

$stat = [
	['name'=>'1月',   'value'=>3500],
	['name'=>'2月',   'value'=>1500],
	['name'=>'3月',   'value'=>8500],
	['name'=>'4月',   'value'=>4500],
	['name'=>'5月',   'value'=>7550],
	['name'=>'6月',   'value'=>3100],
	['name'=>'7月',   'value'=>5550],
	['name'=>'8月',   'value'=>0],
	['name'=>'9月',   'value'=>9000],
	['name'=>'10月',   'value'=>3800],
	['name'=>'11月',   'value'=>6300],
	['name'=>'12月',   'value'=>7100]
];

//把统计数据以JSON格式输出
echo  json_encode($stat);
?>