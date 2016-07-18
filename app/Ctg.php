<?php namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Ctg
 *
 * @property integer                                                   $ctg_id     分类ID
 * @property integer                                                   $pid        父分类ID
 * @property integer                                                   $user_id    用户ID
 * @property integer                                                   $tier       层序号
 * @property integer                                                   $sort       排序
 * @property string                                                    $path       分类的族谱
 * @property string                                                    $title      分类名
 * @property \Carbon\Carbon                                            $updated_at 更新时间
 * @property \Carbon\Carbon                                            $created_at 创建时间
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Item[] $item
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereCtgId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg wherePid($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereTier($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereSort($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg wherePath($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereTitle($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg son($pid)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg tier($tier)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg untilTier($tier)
 * @method static \Illuminate\Database\Query\Builder|\App\Ctg descendant($ctg_id)
 * @mixin \Eloquent
 */
class Ctg extends Model
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'ctg';

    /**
     * The primary key used by the model.
     *
     * @var int
     */
    protected $primaryKey = 'ctg_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['pid', 'tier', 'sort', 'title', 'path'];

    /**
     * one to many relationship, with table mp_item
     * @return mixed
     */
    public function item()
    {
        return $this->hasMany('App\Item')
                    ->select('item_id', 'ctg_id', 'sort', 'title');
    }

    /**
     * @param $query
     * @return mixed
     */
    public function scopeAllCtg($query)
    {
        return $query->orderBy('tier', 'asc')
                     ->select('ctg_id', 'pid', 'tier', 'title', 'path');
    }

    /**
     * @param $query
     * @param $pid
     * @return mixed
     */
    public function scopeSon($query, $pid)
    {
        return $query->where('pid', '=', $pid)
                     ->orderBy('tier', 'asc')
                     ->select('ctg_id', 'pid', 'tier', 'title', 'path');
    }

    /**
     * @param $query
     * @param $tier
     * @return mixed
     */
    public function scopeTier($query, $tier)
    {
        return $query->where('tier', '=', $tier)
                     ->orderBy('tier', 'asc')
                     ->select('ctg_id', 'pid', 'tier', 'title', 'path');
    }

    /**
     * @param $query
     * @param $tier
     * @return mixed
     */
    public function scopeUntilTier($query, $tier)
    {
        return $query->where('tier', '<=', $tier)
                     ->orderBy('tier', 'asc')
                     ->orderBy('sort', 'asc')
                     ->select('ctg_id', 'pid', 'tier', 'title', 'path');
    }

    /**
     * @param $query
     * @param $ctg_id
     * @return mixed
     */
    public function scopeDescendant($query, $ctg_id)
    {
        return $query->where('path', 'like', '%-' . $ctg_id . '-%')
                     ->orderBy('tier', 'asc')
                     ->orderBy('sort', 'asc')
                     ->select('ctg_id', 'pid', 'tier', 'title', 'path');
    }


}
