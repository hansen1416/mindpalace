<?php

itms-apps://itunes.apple.com/app/id583700738

题客剩余
支付

权限

定时任务

---------------------
以下功能放二期,有做的代码留着,不显示,不用再调试:

教师端
注册隐去

教师端、学生端
更多->法务须知,代理加盟,建议反馈隐去   

后台
整个账号管理隐去
公告管理->我的公告隐去
更多-法务须知,代理加盟,建议反馈隐去 
去掉省级管理员,仲裁员,代理商,财务专员角色保留他们的权限,方便二期开发

SML
大库统计需要加退货

下订单时   	普通商品和套餐从 replenish & product 中减库存，这一步需要递归，
		明日达商品中的 complexity = hard 的商品，从大库 goods->actual_inventory 中减库存，
		代购商品和明日达商品中的 complexity = easy 不减库存，
		所有的关于库存的字段都是单件的数量，所以如果 buy_type 是 whole 的，计算总价的时候，需要把数量除以 relation

取消订单	普通商品和套餐需要把 replenish & product 中的库存加回去，
		明日达商品中的 complexity = hard 的商品，把大库 goods->actual_inventory 中的库存加回去，
		其他类型的订单，只需要改订单状态即可，

订单退款    普通类型的需要把 product 中的库存加回去，
            明日达中 complexity = hard 类型的，需要把 goods 中的库存加回去，
            除了代购类型的商品，普通和明日达商品把 replenish_detail 的已售出数量减掉，剩余数量加上去，
            如果有优惠券，优惠券变成可用，
            最后修改订单状态，并且 refund_amount = total_amount

一键铺货	所有 goods 表中的商品带入 product 表，
		并且对于普通类型的商品，生成 replenish & replenish_detail ，
            需要递归的从 whin 中取库存，
            并且也要减去大库 goods->actual_inventory 中的库存，
            如果大库剩余库存小于推荐加盟商最大库存，则补货数量就是大库剩余库存，
            如果大库剩余库存大于等于推荐加盟商最大库存，则补货数量就是推荐加盟商最大库存，

手动补货	只有普通类型的商品可以手动补货，生成 replenish & replenish_detail ，
            需要递归的从 whin 中取库存，
            并且也要减去大库 goods->actual_inventory 中的库存，但是，如果是 complexity = hard 的商品则不需要减去 

自动补货	对于上架的普通商品，
            并且加盟商库存小于了最小库存，
            如果加盟商余额足够，
            并且大库库存足够，就是(推荐最大库存 - 加盟商剩余库存) 大于等于 大库实际库存，那么就认为库存足够
            则自动生成补货订单，逻辑和手动补货类似

添加商品	新增商品时，会把新增的商品给所有已经补过货的加盟商的 product 新增一条数据，
            图片上传验证比例必须是 1:1，
            商品置顶，最多10个，从大到小排列

添加套餐    图片上传验证比例必须是 1:1

明日达补货	给待支付和已支付的明日达订单补货，补货数量就是下单数量，
            并且更新 order_detail 表中的 trade_price，
			生成 replenish & replenish_detail 的逻辑和手动补货类似，
            区别是这里在收货的时候，不需要给 product 表中加库存，
            另外如果是 complexity = hard 的商品则不需要减去大库 goods->actual_inventory 中的库存

补货收货	普通商品需要把 product 中的库存加上去，其他类型的商品不加

补货退货    只有未处理的可以处理，
            complexity != hard 的商品把 goods->actual_inventory 中的库存　加上去，
            找到对应进货价，并且售出数量大于等于退货数量的最后一条入库记录，把库存加回去

大库统计    统计补货单，需要减去退货部分，

利润统计    大库取 replenish_detail ，group by goods_id
            大库的 采购价，整件批发价，和单品批发价使用了AVG()，没有考虑每一条数据的 buy_num 可能不完全准确，
            加盟商取 order_detail ， group by goods_id
            settlement 取 order_detail ，gtoup by order_id

特价活动    查找该商品已存在的其它特价活动，
            并且找到的活动的结束时间比当前添加/编辑的特价活动的开始时间晚/相等，
            如果找到符合上述情况的特价活动，则不允许添加

