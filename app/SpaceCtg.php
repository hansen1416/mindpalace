<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 17-1-10
 * Time: 下午5:34
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\SpaceCtg
 *
 * @property integer $space_id
 * @property integer $ctg_id
 * @property integer $sort
 * @property-read \App\Space $space
 * @property-read \App\Ctg $ctg
 * @method static \Illuminate\Database\Query\Builder|\App\SpaceCtg whereSpaceId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\SpaceCtg whereCtgId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\SpaceCtg whereSort($value)
 * @mixin \Eloquent
 */
class SpaceCtg extends Model
{
    protected $table = 'space_ctg';


    protected $guarded = [];


    public $timestamps = false;


    public $incrementing = false;


    public function space()
    {
        return $this->belongsTo('App\Space');
    }


    public function ctg()
    {
        return $this->belongsTo('App\Ctg');
    }
}