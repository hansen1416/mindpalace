<?php

namespace App\Http\Controllers\Yang;


//use Illuminate\Http\Request;
//use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use App\Repositories\SpaceRepository;

/**
 * Class HomeController
 * @package App\Http\Controllers\Yang
 * @author  Hanlongzhen ${DATE}
 */
class HomeController extends Controller
{

    /**
     * 用户仓库的实例
     * @var UserRepository
     */
    protected $user;

    /**
     * @var SpaceRepository
     */
    protected $space;

    /**
     * HomeController constructor.
     * @param UserRepository  $user
     * @param SpaceRepository $space
     */
    public function __construct(UserRepository $user, SpaceRepository $space)
    {
        $this->user  = $user;
        $this->space = $space;
    }

    /**
     * Show the application dashboard.
     *
     */
    public function index()
    {
        return response()->view('yang.home.index', [
            'user'   => $this->user->userInfo(),
            'theme'  => $this->user->getDefaultTheme(),
            'spaces' => $this->space->showAllSpace(),
        ]);
    }
}
