<?php

namespace App\Http\Controllers\Yang;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Ctg;
use App\Item;

class UniverseController extends Controller
{

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
        $ctgModel = new Ctg();
        $ctgs     = $ctgModel::untilTier(99)->get();
        //加载 item 表的内容
        if (true) {
            $ctgs->load('item');
        }

        $html = $ctgModel->tagWrap($ctgs);

		return view('yang.universe.index', ['html' => $html]);
	}

	/**
	 * Show the form for creating a new resource.
	 * @param  Request  $request
	 * @return Response
	 */
	public function createCtg(Request $request)
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
            $ctgModel->path  = $parent ? $parent->path : '';
        }

        $ctgModel->save();

        return redirect()->route('universe');
	}

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function updateCtg(Request $request)
    {
		$ctgModel = Ctg::find($request->ctg_id);

		$ctgModel->title = $request->title;

		$res = $ctgModel->save();

		return redirect()->route('universe');
    }

    /**
     * 创建新的同级内容
     * @param Request $request
     * @author Hanlongzhen 2016-05-19 11:17
     * @return \Illuminate\Http\RedirectResponse
     */
    public function createItem(Request $request)
    {
        $itemModel = new Item();

        $itemModel->ctg_id = $request->item_id ? $request->pid : $request->ctg_id;
        $itemModel->title  = $request->title;

        $res = $itemModel->save();

        return redirect()->route('universe');
    }

    /**
     * 编辑内容的标题
     * @param Request $request
     * @author Hanlongzhen 2016-05-29 11:31
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateItem(Request $request)
    {
        $itemModel = Item::find($request->item_id);

        $itemModel->title = $request->title;

        $res = $itemModel->save();

        return redirect()->route('universe');

    }

}
