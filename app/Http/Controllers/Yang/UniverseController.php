<?php namespace App\Http\Controllers\Yang;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Ctg;
//use App\Helpers\Helper;

class UniverseController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{

		$ctgs = Ctg::untilTier(10)->get();

		$html = Ctg::tagWrap($ctgs);

		return view('yang.universe.index', ['html' => $html]);
	}

	/**
	 * Show the form for creating a new resource.
	 * @param  Request  $request
	 * @return Response
	 */
	public function create(Request $request)
	{
        $ctgModel = new Ctg();

        $ctgModel->pid   = $request->pid;
        $ctgModel->tier  = $request->tier;
        $ctgModel->title = $request->title;

        $ctgModel->save();

        return redirect()->route('universeIndex');
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
