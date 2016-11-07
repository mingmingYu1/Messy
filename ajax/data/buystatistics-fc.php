<?php
/**返回当前用户按月份统计的消费记录**/
header('Content-Type:  application/json');

//TODO: 按照月份进行分组，查询数据库，得到每个月消费统计

$stat = [
	['label'=>'1月',   'value'=>3500],
	['label'=>'2月',   'value'=>1500],
	['label'=>'3月',   'value'=>8500],
	['label'=>'4月',   'value'=>4500],
	['label'=>'5月',   'value'=>7550],
	['label'=>'6月',   'value'=>3100],
	['label'=>'7月',   'value'=>5550],
	['label'=>'8月',   'value'=>0],
	['label'=>'9月',   'value'=>9000],
	['label'=>'10月',   'value'=>3800],
	['label'=>'11月',   'value'=>6300],
	['label'=>'12月',   'value'=>7100]
];

//把统计数据以JSON格式输出
echo  json_encode($stat);
?>