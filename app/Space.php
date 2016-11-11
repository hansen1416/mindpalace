<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


/**
 * App\Space
 *
 * @property integer $space_id 空间ID
 * @property integer $user_id
 * @property integer $sort
 * @property string $name 空间名称
 * @property boolean $share
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon $created_at
 * @property-read \App\User $user
 * @method static \Illuminate\Database\Query\Builder|\App\Space whereSpaceId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Space whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Space whereSort($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Space whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Space whereShare($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Space whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Space whereCreatedAt($value)
 * @mixin \Eloquent
 */
class Space extends Model
{
    protected $table = 'space';


    protected $primaryKey = 'space_id';


    protected $guarded = [];


    public function user()
    {
        return $this->belongsTo('App\User');
    }
}