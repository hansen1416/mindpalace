<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 16-9-29
 * Time: 下午11:25
 */

namespace App\Http\Controllers;


use App\Repositories\Contract\CtgRepositoryContract;
use App\Repositories\Contract\SpaceCtgRepositoryContract;
use App\Repositories\Contract\SpaceRepositoryContract;
use App\Services\SpaceService;

class WelcomeController extends Controller
{
    public function index(CtgRepositoryContract $ctgRepositoryContract)
    {
        echo phpinfo();
    }


    public function test(SpaceService $spaceService)
    {
        $d = $spaceService->spaceServiceHomeSpaces();

        print_r($d);
    }
}