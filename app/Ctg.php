<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Ctg
 *
 * @mixin \Eloquent
 * @property integer $ctg_id 分类ID
 * @property integer $pid 父分类ID
 * @property integer $space_id 空间ID
 * @property integer $user_id 用户ID
 * @property integer $tier 层序号
 * @property integer $sort 排序
 * @property string $path 分类的族谱
 * @property string $title 分类名
 * @property integer $private
 * @property \Carbon\Carbon $updated_at 更新时间
 * @property \Carbon\Carbon $created_at 创建时间
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereCtgId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg wherePid($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereSpaceId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereTier($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereSort($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg wherePath($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereTitle($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg wherePrivate($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereCreatedAt($value)
 */
class Ctg extends Model
{

    protected $table = 'ctg';


    protected $primaryKey = 'ctg_id';


    protected $guarded = [];



}
