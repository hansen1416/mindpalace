<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;


/**
 * App\Friends
 *
 * @property int    $user_id
 * @property int    $friend_id
 * @property string $type
 * @method static \Illuminate\Database\Query\Builder|\App\Friends whereFriendId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Friends whereType($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Friends whereUserId($value)
 * @mixin \Eloquent
 */
class Friends extends Model
{
    protected $table = 'friends';


    public $timestamps = false;


    public $primaryKey = null;


    public $incrementing = false;


    protected $guarded = [];


    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('order', function (Builder $builder) {
            $builder->orderBy('type', 'ASC');
        });
    }


    public function user()
    {
        return $this->belongsTo('App\User', 'user_id');
    }


    public function friend()
    {
        return $this->belongsTo('App\User', 'friend_id');
    }


    public function profile()
    {
        return $this->belongsTo('App\Profile', 'friend_id', 'user_id');
    }


}
