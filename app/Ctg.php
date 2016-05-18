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
	protected $fillable = ['pid', 'tier', 'sort', 'title', 'path', 'tags'];

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
                    ->select('ctg_id', 'pid', 'tier', 'title', 'path');
    }

    /**
     * Scope a query to retrive all categories with tier num less than $tier.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSubset($query, $path)
    {
        return $query->where('path', 'like', '%-' .$path. '-%')
                    ->orderBy('tier', 'asc')
                    ->select('ctg_id', 'pid', 'tier', 'sort', 'title', 'path');
    }

    /**
     * one to many relationship, with table mp_item
     * @return mixed
     */
    public function item()
    {
        return $this->hasMany('App\Item')
            ->select('item_id', 'ctg_id', 'sort', 'title');
    }

    /**
     * 将所有分类用 html 标签包裹，赋予相应的 class 和 dataset
     * @param $array
     *
     * @return string
     */
    public function tagWrap($array)
    {
        $html    = '';
        $section = '';
        $start   = $array[0]->tier;
        $core_id = [];

        //取第一层的所有id
        foreach ($array as $value) {

            $core_id[] = $value->ctg_id;

            if ($value->tier > $start) break;
        }

        foreach ($array as $value) {

            $tier = $value->tier - $start;
            //在其后的子元素中寻找他属于最内层的哪一个分类，咋把它归到哪一个 section 中
            if ($tier) {
                preg_match('/^-('.join('|', $core_id).')-/', $value->path, $match);
                if ($match && isset($match[1])) $section = 'sec-' . $match[1];
            }else{
                $section = 'sec-' . $value->ctg_id;
            }

            $html .= "<div class='tier-{$tier} star {$section}' title='{$value->title}' data-title='{$value->title}' data-ctg_id='{$value->ctg_id}' data-pid='{$value->pid}' data-tier='{$tier}' data-sort='{$value->sort}'>" .
                    $value->title .
                    "</div>";

            if ( count($value->item) ) {
                foreach ($value->item as $item) {
                    $html .= "<div class='tier-{$tier} star {$section}' title='{$item->title}' data-title='{$item->title}' data-pid='{$item->ctg_id}' data-item_id='{$item->ctg_id}' data-tier='{$tier}' data-sort='{$item->sort}'>" .
                             $item->title .
                             "</div>";
                }
            }
        }

        return $html;
    }

}
