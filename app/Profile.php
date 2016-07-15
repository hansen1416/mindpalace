<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Profile
 *
 * @property integer $profile_id 用户详情ID
 * @property integer $user_id 用户ID
 * @property string $portrait 头像
 * @property string $theme 用户自定义主题
 * @property \Carbon\Carbon $updated_at 修改时间
 * @property \Carbon\Carbon $created_at 创建时间
 * @property-read \App\User $user
 * @method static \Illuminate\Database\Query\Builder|\App\Profile whereProfileId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Profile whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Profile wherePortrait($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Profile whereTheme($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Profile whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Profile whereCreatedAt($value)
 * @mixin \Eloquent
 */
class Profile extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'profile';

    /**
     * The primary key used by the model.
     *
     * @var int
     */
    protected $primaryKey = 'profile_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['portrait', 'theme'];

    /**
     * belongs to User
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo('App\User', 'user_id');
    }
}
