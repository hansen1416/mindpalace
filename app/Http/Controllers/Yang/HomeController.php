<?php

namespace App\Http\Controllers\Yang;


//use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App;
use Auth;
use App\Repositories\UserRepository;

class HomeController extends Controller
{

    /**
     * 用户仓库的实例
     * @var UserRepository
     */
    protected $user;

    /**
     * HomeController constructor.
     * @param UserRepository $user
     */
    public function __construct(UserRepository $user)
    {
        $this->user = $user;
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
