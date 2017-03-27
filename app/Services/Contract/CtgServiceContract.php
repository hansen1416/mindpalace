<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-11-18
 * Time: 下午5:48
 */

namespace App\Services\Contract;

use App\Item;

interface CtgServiceContract
{
    public function spaceCtg(int $space_id);

    public function ctgDescendant(int $space_id, int $ctg_id);

    public function moveCtg(int $space_id, int $ctg_id, int $pid);

    /**
     * @param int $ctg_id
     * @return Item
     */
    public function ctgServiceCtgContent(int $ctg_id): Item;

    /**
     * @param int    $ctg_id
     * @param string $content
     * @return mixed
     */
    public function ctgServiceSaveCtgContent(int $ctg_id, string $content): Item;

    /**
     * create a ctg,
     * fetch the parent ctg first
     * insert it into ctg table, get the ctg_id thereafter
     * insert it into spaceCtg table, get pid, tier, path value from parent ctg
     * @param string $title
     * @param int    $pid
     * @param int    $space_id
     * @return \App\SpaceCtg | array
     */
    public function ctgServiceCreate(string $title, int $pid, int $space_id);

    /**
     * @param string $title
     * @param int    $pid
     * @param int    $space_id
     * @param        $tier
     * @param        $path
     * @return \App\SpaceCtg
     * @throws \App\Exceptions\CantFindException
     */
    public function ctgServiceCreateNestable(string $title, int $pid, int $space_id, $tier = null, $path = null);
}