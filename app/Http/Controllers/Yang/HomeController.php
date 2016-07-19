<?php

namespace App\Http\Controllers\Yang;


//use Illuminate\Http\Request;
//use App\Http\Requests;
use App\Http\Controllers\Controller;
//use App;
use Auth;
use App\Repositories\UserRepository;
use App\Repositories\CtgRepository;

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
     * @var CtgRepository
     */
    protected $ctg;

    /**
     * HomeController constructor.
     * @param UserRepository                 $user
     * @param CtgRepository $ctg
     */
    public function __construct(UserRepository $user, CtgRepository $ctg)
    {
        $this->user = $user;
        $this->ctg  = $ctg;
    }

    /**
     * Show the application dashboard.
     *
     */
    public function index()
    {
        $user  = Auth::user();
        $theme = $user ? $user->profile->theme : config('view.default_theme');

        return response()->view('yang.home.index', ['user' => $user, 'theme' => $theme]);
    }
}
