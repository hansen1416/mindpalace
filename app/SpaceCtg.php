<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 17-1-10
 * Time: 下午5:34
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;


/**
 * App\SpaceCtg
 *
 * @property integer $ctg_id 分类ID
 * @property integer $pid 父分类ID
 * @property integer $space_id 空间ID
 * @property integer $tier 层序号
 * @property integer $sort 排序
 * @property string $path 分类的族谱
 * @property-read \App\Space $space
 * @property-read \App\Ctg $ctg
 * @method static \Illuminate\Database\Query\Builder|\App\SpaceCtg whereCtgId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\SpaceCtg wherePid($value)
 * @method static \Illuminate\Database\Query\Builder|\App\SpaceCtg whereSpaceId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\SpaceCtg whereTier($value)
 * @method static \Illuminate\Database\Query\Builder|\App\SpaceCtg whereSort($value)
 * @method static \Illuminate\Database\Query\Builder|\App\SpaceCtg wherePath($value)
 * @mixin \Eloquent
 */
class SpaceCtg extends Model
{
    protected $table = 'space_ctg';


    protected $guarded = [];


    public $timestamps = false;


    public $incrementing = false;


    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('order', function (Builder $builder) {
            $builder->orderBy('tier', 'ASC')
                    ->orderBy('sort', 'ASC')
                    ->orderBy('ctg_id', 'DESC');
        });
    }


    public function space()
    {
        return $this->belongsTo('App\Space');
    }


    public function ctg()
    {
        return $this->belongsTo('App\Ctg');
    }
}