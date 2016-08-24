<?php
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
    protected $fillable = ['ctg_id', 'content'];


    public $timestamps = false;

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function ctg()
    {
        return $this->belongsTo('App\Ctg');
    }

    protected static function boot()
    {
        parent::boot();
    }

}
