<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 16-8-6
 * Time: 下午11:07
 */

namespace App\Repositories;

use App\Space;

class SpaceRepository extends Repository
{

    /**
     * @var Space
     */
    protected $space;


    public function __construct(Space $space)
    {
        parent::__construct();

        $this->space = $space;
    }


    public function showAllSpace(){

        return $this->space->allSpace()->get();
    }

}