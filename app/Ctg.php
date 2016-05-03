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
     * The primary key used by the model.
     *
     * @var int
     */
    protected $primaryKey = 'ctg_id';

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

    /**
     * Scope a query to retrive all categories order by tier ASC.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeTierOrder($query)
    {
        return $query->orderBy('tier', 'asc')->select('ctg_id', 'pid', 'tier', 'sort', 'title');
    }

    /**
     * Scope a query to retrive all categories with tier num less than $tier.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeUntilTier($query, $tier)
    {
        return $query->where('tier', '<=', $tier)
                    ->orderBy('tier', 'asc')
                    ->select('ctg_id', 'pid', 'tier', 'sort', 'title');
    }

    /**
     * Scope a query to retrive all categories with tier num less than $tier.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSubset($query, $path)
    {
        return $query->where('path', 'like', '%-' .$path. '%-')
                    ->orderBy('tier', 'asc')
                    ->select('ctg_id', 'pid', 'tier', 'sort', 'title');
    }

    public static function tagWrap($array)
    {
        $html  = '';
        $start = $array[0]->tier;
        foreach ($array as $key => $value) {

            $tier = $value->tier - $start;

            $html .= "<div class='tier-{$tier} star' data-ctg_id={$value->ctg_id} data-pid={$value->pid} data-tier={$tier} data-sort={$value->sort}>" .
                    $value->title .
                    "</div>";
        }

        return $html;
    }

}
