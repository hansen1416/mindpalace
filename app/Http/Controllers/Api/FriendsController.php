<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-3-6
 * Time: 下午6:06
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Contract\FriendsServiceContract;
use Illuminate\Http\Request;

class FriendsController extends Controller
{
    private $friends;

    public function __construct(
        FriendsServiceContract $friendsServiceContract
    )
    {
        $this->friends = $friendsServiceContract;
    }
}