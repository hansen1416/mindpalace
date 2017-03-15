<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:09
 */

namespace App\Services\Contract;


interface SpaceServiceContract
{
    public function allSpace();


    public function searchSpace(string $name);


    public function updateSpace(int $space_id);


    public function createSpace(string $name);


    public function saveWebsite($url);

}