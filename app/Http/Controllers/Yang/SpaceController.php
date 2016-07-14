<?php

namespace App\Http\Controllers\Yang;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Ctg;
use App\Item;
use Auth;
use App\Repositories\UsersRepository;


class SpaceController extends Controller
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
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {

        $ctgModel = new Ctg();

        if ($request->pid) {
            $ctgs = $ctgModel::sons($request->pid)->get();
        } else {
            $ctgs = $ctgModel::untilTier(99)->get();
        }

        //加载 item 表的内容
        if (true) {
            $ctgs->load('item');
        }

        $html = $ctgModel->tagWrap($ctgs);

        return response()->view('yang.space.index', ['html' => $html, 'user' => Auth::user()]);
    }

    /**
     * Show the form for creating a new resource.
     * @param  Request $request
     * @return Response
     */
    public function createCtg(Request $request)
    {
        $act      = $request->act;
        $ctgModel = new Ctg();

        $ctgModel->user_id = Auth::user()->user_id;

        if ($act == 'desc') {

            $pid             = $request->ctg_id;
            $parent          = $ctgModel::find($pid);
            $ctgModel->pid   = $pid;
            $ctgModel->tier  = (int)($request->tier) + 1;
            $ctgModel->title = $request->title;
            $ctgModel->path  = $parent->path ? $parent->path . $pid . '-' : '-' . $pid . '-';

        } elseif ($act == 'sibl') {

            $pid             = $request->pid;
            $parent          = $ctgModel::find($pid);
            $ctgModel->pid   = $pid;
            $ctgModel->tier  = $request->tier;
            $ctgModel->title = $request->title;
            $ctgModel->path  = $parent ? $parent->path : '';
        }

        return response()->json(['status' => $ctgModel->save()]);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @return Response
     */
    public function updateCtg(Request $request)
    {
        $ctgModel = Ctg::find($request->ctg_id);

        $ctgModel->title = $request->title;

        return response()->json(['status' => $ctgModel->save()]);
    }

    /**
     * 创建新的同级内容
     * @param Request $request
     * @author Hanlongzhen 2016-05-19 11:17
     * @return Response
     */
    public function createItem(Request $request)
    {
        $itemModel = new Item();

        $itemModel->user_id = Auth::user()->user_id;
        $itemModel->ctg_id  = $request->item_id ? $request->pid : $request->ctg_id;
        $itemModel->title   = $request->title;

        return response()->json(['status' => $itemModel->save()]);

    }

    /**
     * 编辑内容的标题
     * @param Request $request
     * @author Hanlongzhen 2016-05-29 11:31
     * @return Response
     */
    public function updateItem(Request $request)
    {
        $itemModel = Item::find($request->item_id);

        $itemModel->title = $request->title;

        return response()->json(['status' => $itemModel->save()]);

    }

    /**
     * 获取内容详情
     * @param Request $request
     * @author Hanlongzhen 2016-07-01 17:15
     * @return Response
     */
    public function getItemDetail(Request $request)
    {

        $itemModel = Item::find($request->item_id);

        $content = htmlspecialchars_decode($itemModel->content);

        return response()->json(['status' => $itemModel, 'message' => $content]);

    }

    /**
     * 编辑内容详情
     * @param Request $request
     * @return Response
     */
    public function editItemDetail(Request $request)
    {

        $res = Item::where('item_id', $request->input('item_id'))
                   ->where('ctg_id', $request->input('ctg_id'))
                   ->update(['content' => $request->input('content')]);

        return response()->json(['status' => $res]);
    }

}
