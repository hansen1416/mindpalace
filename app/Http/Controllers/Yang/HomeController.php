<?php

namespace App\Http\Controllers\Yang;


//use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App;
use Auth;
use App\Repositories\UsersRepository;

class HomeController extends Controller
{

    /**
     * 用户仓库的实例
     * @var UsersRepository
     */
    protected $users;

    /**
     * HomeController constructor.
     * @param UsersRepository $users
     */
    public function __construct(UsersRepository $users)
    {
        $this->users = $users;
    }

    /**
     * Show the application dashboard.
     *
     */
    public function index()
    {
        return response()->view('yang.home.index', ['user' => Auth::user()]);
    }
}
