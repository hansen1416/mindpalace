<?php

namespace App\Http\Controllers\Yang;


//use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App;
use Auth;

class HomeController extends Controller
{

    /**
     * Show the application dashboard.
     *
     */
    public function index()
    {
        return view('yang.home.index', ['user' => Auth::user()]);
    }
}
