<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 17-2-6
 * Time: 下午3:56
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Item
 *
 * @property integer $item_id 内容ID
 * @property integer $ctg_id 分类ID
 * @property string $content 内容
 * @property-read \App\Ctg $ctg
 * @method static \Illuminate\Database\Query\Builder|\App\Item whereItemId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Item whereCtgId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Item whereContent($value)
 * @mixin \Eloquent
 */
class Item extends Model
{
    protected $table = 'item';


    protected $primaryKey = 'item_id';


    protected $guarded = [];


    public $timestamps = false;


    public function ctg()
    {
        return $this->belongsTo('App\Ctg');
    }
}