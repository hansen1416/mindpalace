<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-11-18
 * Time: 下午5:48
 */

namespace App\Services\Contract;

use App\Exceptions\CantFindException;
use App\Item;
use App\SpaceCtg;

interface CtgServiceContract
{
    /**
     * @param int $space_id
     * @return array
     */
    public function ctgServiceSpaceCtg(int $space_id): array;

    /**
     * @param int $space_id
     * @param int $ctg_id
     * @return array
     */
    public function ctgServiceCtgDescendant(int $space_id, int $ctg_id): array;

    /**
     * change the pid of a ctg and it's path, tier and all it's descendant's path tier
     * @param int $space_id
     * @param int $ctg_id
     * @param int $pid
     * @return array
     * @throws CantFindException
     */
    public function moveCtg(int $space_id, int $ctg_id, int $pid): array;

    /**
     * @param int $ctg_id
     * @return Item
     */
    public function ctgServiceCtgContent(int $ctg_id): Item;

    /**
     * save ctg content to item table
     * @param int    $ctg_id
     * @param string $content
     * @return Item
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
     * @param null   $tier
     * @param null   $path
     * @return SpaceCtg
     * @throws CantFindException
     */
    public function ctgServiceCreate(string $title, int $pid, int $space_id, $tier = null, $path = null): SpaceCtg;

    /**
     * @param int $ctg_id
     * @return array
     */
    public function ctgServiceDeleteCtg(int $ctg_id): array;

}