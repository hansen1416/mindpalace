<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Ctg extends Model {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'ctg';
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['pid', 'tier', 'sort', 'title', 'tags'];

	/**
     * Scope a query to only top categories to be retrived.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeTop($query)
    {
        return $query->where('pid', '=', 0);
    }

    /**
     * Scope a query to retrive sons categories from a certain category.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSons($query, $pid)
    {
        return $query->where('pid', '=', $pid);
    }

    /**
     * Scope a query to retrive sons categories from a certain category.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeTier($query, $tier)
    {
        return $query->where('tier', '=', $tier);
    }

}
