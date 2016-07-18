<?php
namespace App\Repositories;

use App\Ctg;

/**
 * Class CtgRepository
 * @package App\Repositories
 */
class CtgRepository
{
    /**
     * @var Ctg
     */
    protected $ctg;

    /**
     * CtgRepository constructor.
     * @param Ctg $ctg
     */
    public function __construct(Ctg $ctg)
    {
        $this->ctg = $ctg;
    }


    /**
     * @param bool $item
     * @return string
     */
    public function getAllCtg($item = true)
    {
        $data = $this->ctg->allCtg()->get();

        if ($item) {
            $data->load('item');
        }

        return $this->tagWrap($data);
    }

    /**
     * @param bool $item
     * @param      $ctg_id
     * @return string
     */
    public function getDescCtg($item = true, $ctg_id)
    {

        $data = $this->ctg->descendant($ctg_id)->get();

        if ($item) {
            $data->load('item');
        }

        return $this->tagWrap($data);

    }

    /**
     * @param $array
     * @return string
     */
    protected function tagWrap($array)
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
            $html .= "<div class='tier-{$tier} star {$section} ctg' title='{$value->title}' data-title='{$value->title}' data-ctg_id='{$value->ctg_id}' data-pid='{$value->pid}' data-tier='{$tier}'>" .
                     $value->title .
                     "</div>";

            /**
             * 如果有内容元素
             * 拼接内容元素的 html
             */
            if (count($value->item)) {
                $tier = $tier + 1;
                foreach ($value->item as $item) {
                    $html .= "<div class='tier-{$tier} star {$section} item' title='{$item->title}' data-title='{$item->title}' data-pid='{$item->ctg_id}' data-item_id='{$item->item_id}' data-tier='{$tier}'>" .
                             $item->title .
                             "</div>";
                }
            }

        }

        return $html;
    }


}