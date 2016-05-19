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
        $Ctg  = new Ctg();
        $ctgs = $Ctg::untilTier(99)->get();
        //加载 item 表的内容
        if (true) {
            $ctgs->load('item');
        }

        $html = $Ctg->tagWrap($ctgs);

		return view('yang.universe.index', ['html' => $html]);
	}

	/**
	 * Show the form for creating a new resource.
	 * @param  Request  $request
	 * @return Response
	 */
	public function createItem(Request $request)
	{
        $act      = $request->act;
        $ctgModel = new Ctg();

        if ($act == 'desc') {

            $pid             = $request->ctg_id;
            $parent          = $ctgModel::find($pid);
            $ctgModel->pid   = $pid;
            $ctgModel->tier  = (int)($request->tier) + 1;
            $ctgModel->title = $request->title;
            $ctgModel->path  = $parent->path ? $parent->path . $pid . '-' : '-' . $pid . '-';

        }elseif ($act == 'sibl') {

            $pid             = $request->pid;
            $parent          = $ctgModel::find($pid);
            $ctgModel->pid   = $pid;
            $ctgModel->tier  = $request->tier;
            $ctgModel->title = $request->title;
            $ctgModel->path  = $parent->path;
        }

        $ctgModel->save();

        return redirect()->route('universeIndex');
	}

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function updateItem(Request $request)
    {
		$ctgModel = Ctg::find($request->ctg_id);

		$ctgModel->title = $request->title;

		$res = $ctgModel->save();

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
