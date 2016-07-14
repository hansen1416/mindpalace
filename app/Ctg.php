<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Ctg extends Model
{

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
    protected $fillable = ['pid', 'tier', 'sort', 'title', 'path'];

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
        return $query->where('pid', '=', $pid)
                     ->orderBy('tier', 'asc')
                     ->select('ctg_id', 'pid', 'tier', 'title', 'path');
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
        return $query->where('path', 'like', '%-' . $path . '-%')
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
     * @return html
     */
    public function tagWrap($array)
    {
        $html    = '';
        $section = '';
        $start   = $array[0]->tier;
        $core_id = [];

        /**
         * 取出第一层所有的 ctg_id
         * 装进数组 core_id
         */
        foreach ($array as $value) {

            $core_id[] = $value->ctg_id;

            if ($value->tier > $start)
                break;
        }

        /**
         * $core_id_flip 代表每一个最内层分类对应的 section
         * 从 0 - 9 大于9的取 10 的余数
         * 他的子集元素全部继承最内层的 section
         * .sec-0, .sec-1 ... .sec-9
         */
        $core_id_flip = array_flip($core_id);

        foreach ($array as $value) {

            /**
             * $start 可能是 0 也可能不是
             * $tier 是相对于最内层的层数
             */
            $tier = $value->tier - $start;

            /**
             * 在其后的子元素中寻找他属于最内层的哪一个分类
             * 继承最内层的 section
             */
            if ($tier) {
                preg_match('/^-(' . join('|', $core_id) . ')-/', $value->path, $match);
                if ($match && isset($match[1]))
                    $section = 'sec-' . $core_id_flip[$match[1]] % 10;
            } else {
                $section = 'sec-' . $core_id_flip[$value->ctg_id] % 10;
            }

            /**
             * 组合分类的 html
             */
            $html .= "<div class='tier-{$tier} star {$section} ctg' title='{$value->title}' data-title='{$value->title}' data-ctg_id='{$value->ctg_id}' data-pid='{$value->pid}' data-tier='{$tier}' data-sort='{$value->sort}'>" .
                     $value->title .
                     "</div>";

            /**
             * 如果有内容元素
             * 拼接内容元素的 html
             */
            if (count($value->item)) {
                $tier = $tier + 1;
                foreach ($value->item as $item) {
                    $html .= "<div class='tier-{$tier} star {$section} item' title='{$item->title}' data-title='{$item->title}' data-pid='{$item->ctg_id}' data-item_id='{$item->item_id}' data-tier='{$tier}' data-sort='{$item->sort}'>" .
                             $item->title .
                             "</div>";
                }
            }

        }

        return $html;
    }

}
