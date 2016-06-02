<?php

namespace App\Http\Controllers\Yang;

use App;
use Auth;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class HomeController extends Controller
{

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('yang.home.index', ['user' => Auth::user()]);
    }
}
