<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


/**
 * App\Profile
 *
 * @property integer $profile_id 用户详情ID
 * @property integer $user_id 用户ID
 * @property string $portrait 头像
 * @property integer $theme_id 主题ID
 * @property \Carbon\Carbon $updated_at 修改时间
 * @property \Carbon\Carbon $created_at 创建时间
 * @property-read \App\User $user
 * @method static \Illuminate\Database\Query\Builder|\App\Profile whereProfileId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Profile whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Profile wherePortrait($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Profile whereThemeId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Profile whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Profile whereCreatedAt($value)
 * @mixin \Eloquent
 * @property string $language 用户语言
 * @method static \Illuminate\Database\Query\Builder|\App\Profile whereLanguage($value)
 */
class Profile extends Model
{
    protected $table = 'profile';


    protected $primaryKey = 'profile_id';


    protected $guarded = [];


    public function user()
    {
        return $this->belongsTo('App\User', 'profile_id');
    }
}
