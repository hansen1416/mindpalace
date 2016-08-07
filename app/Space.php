<?php
namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Auth;


/**
 * App\Space
 *
 * @property integer                                                  $space_id 空间ID
 * @property integer                                                  $user_id
 * @property integer                                                  $sort
 * @property string                                                   $name     空间名称
 * @property boolean                                                  $private
 * @property \Carbon\Carbon                                           $updated_at
 * @property \Carbon\Carbon                                           $created_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Ctg[] $ctg
 * @method static \Illuminate\Database\Query\Builder|\App\Space whereSpaceId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Space whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Space whereSort($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Space whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Space wherePrivate($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Space whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Space whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Space allSpace()
 * @mixin \Eloquent
 */
class Space extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'space';

    /**
     * The primary key used by the model.
     *
     * @var int
     */
    protected $primaryKey = 'space_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['user_id', 'sort', 'name', 'private'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function ctg()
    {
        return $this->hasMany('App\Ctg');
    }


    protected static function boot()
    {
        parent::boot();

        /**
         * 全局查询范围
         * 共有的或者作者是当前用户的
         */
        static::addGlobalScope('private', function (Builder $builder) {

            if (Auth::user()) {
                $builder->where('private', '=', 0)
                        ->orWhere('user_id', '=', Auth::user()->user_id);
            } else {
                $builder->where('private', '=', 0);
            }

        });
    }

    /**
     * @param Builder $query
     * @return mixed
     */
    public function scopeAllSpace(Builder $query)
    {
        return $query->orderBy('sort', 'asc');
    }

}