<?php namespace App\Http\Controllers\Yang;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Ctg;
use App\Helpers\Helper;

class stdClass {

}

class UniverseController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{

		// $top = Ctg::top()->get();

		// foreach ($top as $key => $value) {
  //           $res[] = array('id'=>$value->id, 'pid'=>$value->pid, 'tier'=>$value->tier, 'sort'=>$value->sort, 'title'=>$value->title);
  //       }

		// $ctgs = Helper::multiDimen(new Ctg(), $res, 2);
		// 
		$ctgs = Ctg::tierOrder()->get();

		$html = Helper::tagWrap($ctgs);

		return view('yang.universe.index', ['html' => $html]);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}

}
