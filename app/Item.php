<?php namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Item
 *
 * @property integer $item_id 内容ID
 * @property integer $ctg_id 分类ID
 * @property integer $user_id 用户ID
 * @property integer $sort 排序
 * @property string $title 内容标题
 * @property string $content 内容
 * @property \Carbon\Carbon $updated_at 更新时间
 * @property \Carbon\Carbon $created_at 创建时间
 * @property-read \App\Ctg $ctg
 * @method static \Illuminate\Database\Query\Builder|\App\Item whereItemId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Item whereCtgId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Item whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Item whereSort($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Item whereTitle($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Item whereContent($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Item whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Item whereCreatedAt($value)
 * @mixin \Eloquent
 */
class Item extends Model {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'item';

    /**
     * The primary key used by the model.
     *
     * @var int
     */
    protected $primaryKey = 'item_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['ctg_id', 'sort', 'title', 'content'];

    /**
     * belongsto, many to one relationship, with table mp_ctg
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function ctg()
    {
        return $this->belongsTo('App\Ctg');
    }

}
