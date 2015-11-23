<?php namespace App\Helpers;

class Helper {

    public static function MultiDimen($model, &$arr)
    {

        foreach($arr as $key => &$value){

            foreach ($model::where("pid", $value['id'])->get() as $k => $v) {
                $value['desc'][] = array('id'=>$v->id, 'pid'=>$v->pid, 'tier'=>$v->tier, 'sort'=>$v->sort, 'title'=>$v->title);
            }

            if(isset($value['desc'])){
                Helper::MultiDimen($model, $value['desc']);
            }
        }

        return $arr;

    }

}
