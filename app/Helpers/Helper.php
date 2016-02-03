<?php namespace App\Helpers;

class Helper {
    /**
     * [multiDimen description]
     * @AuthorName lzhan<lzhan@3ti.us>
     * @DateTime   2016-02-03T12:16:16+0800
     * @param      [type] $model [description]
     * @param      [type] &$arr [description]
     * @param      integer $endtier [description]
     * @return     [type] [description]
     */
    public static function multiDimen($model, &$arr, $endtier=0)
    {

        foreach($arr as $key => &$value){

            foreach ($model::where("pid", $value['id'])->get() as $k => $v) {

                if($endtier && (int)$v->tier > $endtier){
                    continue;
                }else{
                    $value['desc'][] = array('id'=>$v->id, 'pid'=>$v->pid, 'tier'=>$v->tier, 'sort'=>$v->sort, 'title'=>$v->title);
                }
            }

            if(isset($value['desc'])){
                Helper::MultiDimen($model, $value['desc'], $endtier);
            }
        }

        return $arr;

    }

    /**
     * [infinite description]
     * @AuthorName lzhan<lzhan@3ti.us>
     * @DateTime   2016-02-03T12:16:21+0800
     * @param      [type] $model [description]
     * @param      [type] &$arr [description]
     * @return     [type] [description]
     */
    public static function infinite($model, &$arr)
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

    /**
     * [tagWrap description]
     * @AuthorName lzhan<lzhan@3ti.us>
     * @DateTime   2016-02-03T12:16:26+0800
     * @param      [type] $array [description]
     * @return     [type] [description]
     */
    public static function tagWrap($array)
    {
        $html = '';

        foreach ($array as $key => $value) {
            $html .= "<div class='star' data-id=".$value->id." data-pid=".$value->pid." data-tier=".$value->tier." data-sort=".$value->sort.">".$value->title."</div>";
        }

        return $html;

    }

}
