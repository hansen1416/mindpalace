<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


/**
 * App\Ctg
 *
 * @property integer                                                    $ctg_id     分类ID
 * @property integer                                                    $user_id    用户ID
 * @property string                                                     $title      分类名
 * @property \Carbon\Carbon                                             $updated_at 更新时间
 * @property \Carbon\Carbon                                             $created_at 创建时间
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Space[] $space
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereCtgId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereTitle($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereCreatedAt($value)
 * @mixin \Eloquent
 * @property-read \App\Item $item
 */
class Ctg extends Model
{

    protected $table = 'ctg';


    protected $primaryKey = 'ctg_id';


    protected $guarded = [];


    public function space()
    {
        return $this->belongsToMany('App\Space', 'space_ctg');
    }


    public function item()
    {
        return $this->hasOne('App\Item');
    }

}
