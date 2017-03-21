<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 16-9-29
 * Time: 下午11:25
 */

namespace App\Http\Controllers;


use App\Repositories\Contract\CtgRepositoryContract;

class WelcomeController extends Controller
{
    public function index(CtgRepositoryContract $ctgRepositoryContract)
    {
        echo phpinfo();
    }
}