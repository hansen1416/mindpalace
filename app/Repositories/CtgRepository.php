<?php
namespace App\Repositories;

use App\Ctg;
use Illuminate\Support\Facades\DB;

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
     * @param      $ctg_id
     * @param bool $item
     * @return mixed
     */
    public function findCtg($ctg_id, $item = false)
    {
        return $item ? $this->ctg->with('item')->find($ctg_id) : $this->ctg->find($ctg_id);
    }

    /**
     * @param bool $item
     * @return string
     */
    public function getAllCtg($item = false)
    {

        if ($item) {
            $data = $this->ctg->with('item')->allCtg()->get();
        } else {
            $data = $this->ctg->allCtg()->get();
        }

        return $this->tagWrap($data, $item);
    }

    /**
     * @param      $ctg_id
     * @param bool $item
     * @return string
     */
    public function getDescCtg($ctg_id, $item = false)
    {

        if ($item) {
            $data = $this->ctg->with('item')->descendant($ctg_id)->get();
        } else {
            $data = $this->ctg->descendant($ctg_id)->get();
        }

        return $this->tagWrap($data, $item);
    }

    /**
     * @param      $array
     * @param bool $item
     * @return string
     */
    protected function tagWrap($array, $item = false)
    {

        if (count($array) == 0) {
            return '';
        }

        $html    = '';
        $start   = $array[0]->tier;
        $core_id = [];

        /**
         * 取出第一层所有的 ctg_id
         * 装进数组 core_id
         */
        foreach ($array as $value) {

            if ($value->tier > $start) {
                break;
            }

            $core_id[] = $value->ctg_id;

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
             * 如果没有最内层分类，则直接不取，
             * 此种情况通常不会发生，因为如果一个分类是私有的那么他的所有子分类应该都是私有
             */
            if ($tier) {

                preg_match('/-(' . join('|', $core_id) . ')-/', $value->path, $match);

                if ($match && isset($match[1])) {
                    $section = 'sec-' . $core_id_flip[$match[1]] % 10;
                } else {
                    continue;
                }
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
            if ($item && count($value->item)) {
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

    /**
     * @param $pid
     * @param $user_id
     * @param $sort
     * @param $title
     * @return bool
     */
    public function createCtg($pid, $user_id, $sort, $title)
    {

        $parent = $pid ? $this->findCtg($pid) : null;
        $path   = '-0-';
        $tier   = 0;

        if ($parent) {
            $path = $parent->path . $pid . '-';
            $tier = $parent->tier + 1;
        }

        $this->ctg->pid     = $pid;
        $this->ctg->user_id = $user_id;
        $this->ctg->tier    = $tier;
        $this->ctg->sort    = $sort;
        $this->ctg->path    = $path;
        $this->ctg->title   = $title;

        return $this->ctg->save();
    }

    /**
     * @param $ctg_id
     * @param $pid
     * @param $sort
     * @param $title
     * @return bool
     * @throws \Exception
     */
    public function updateCtg($ctg_id, $pid, $sort, $title)
    {

        $ctg = $this->findCtg($ctg_id);

        if (is_null($pid) || $ctg->pid == $pid) {

            $ctg->sort = $sort;

            if ($title) {
                $ctg->title = $title;
            }

            return $ctg->save();
        }


        DB::beginTransaction();

        try {

            if ($pid) {

                $parent = $this->findCtg($pid);

                /**
                 * 如果目标父级分类是自己的子类，
                 * 那么就抛出错误
                 */
                $pattern = '/\-'.$ctg->ctg_id.'\-/';
                if (preg_match($pattern, $parent->path)) {
                    return ['status' => 0, 'message' => trans('errors.invalid_ctg_pid')];
                }


                $path   = $parent->path . $pid . '-';
                $tier   = $parent->tier + 1;

            } else {

                $path = '-0-';
                $tier = 0;
            }

            $oldPath = $ctg->path . $ctg->ctg_id . '-';

            $ctg->pid  = $pid;
            $ctg->path = $path;
            $ctg->tier = $tier;
            $ctg->save();

        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }

        try {

            $newPath = $ctg->path . $ctg->ctg_id . '-';
            $a       = count(explode('-', $oldPath)) - 3;
            $b       = count(explode('-', $newPath)) - 3;

            $update['path'] = DB::raw("REPLACE(path, '" . $oldPath . "', '" . $newPath . "')");
            $update['tier'] = DB::raw("(tier-{$a}+{$b})");

            $res = $this->ctg->where('path', 'like', $oldPath . '%')
                             ->update($update);

        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }

        DB::commit();

        return ($res !== false);

    }


}