<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Theme
 *
 * @property integer                                                      $theme_id 主题ID
 * @property string                                                       $name     主题名称
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Profile[] $profile
 * @method static \Illuminate\Database\Query\Builder|\App\Theme whereThemeId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Theme whereName($value)
 * @mixin \Eloquent
 * @method static \Illuminate\Database\Query\Builder|\App\Theme allTheme()
 */
class Theme extends Model
{

    protected $table = 'theme';

    protected $primaryKey = 'theme_id';

    protected $fillable = ['name'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function profile()
    {
        return $this->hasMany('App\Profile', 'theme_id');
    }

    /**
     * @param $query
     * @return mixed
     */
    public function scopeAllTheme($query)
    {
        return $query->orderBy($this->primaryKey, 'ASC');
    }

}