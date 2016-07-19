<?php

namespace App\Http\Controllers\Yang;

use App\Repositories\CtgRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Ctg;
use App\Item;
use Auth;
use App\Repositories\UserRepository;

/**
 * Class SpaceController
 * @package App\Http\Controllers\Yang
 */
class SpaceController extends Controller
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
     * SpaceController constructor.
     * @param UserRepository $user
     * @param CtgRepository  $ctg
     */
    public function __construct(UserRepository $user, CtgRepository $ctg)
    {
        $this->user = $user;
        $this->ctg  = $ctg;
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function index(Request $request)
    {

        $pid = $request->input('pid');

        if ($pid) {
            $html = $this->ctg->getDescCtg($pid, true);
        } else {
            $html = $this->ctg->getAllCtg(true);
        }

        return response()->view('yang.space.index', ['html' => $html, 'user' => Auth::user()]);
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function createCtg(Request $request)
    {

        $param = [
            ($request->input('act') == 'desc') ? $request->input('ctg_id') : $request->input('pid'),
            Auth::user()->user_id,
            0,
            $request->input('title'),
        ];

        return response()->json(['status' => call_user_func_array([$this->ctg, 'createCtg'], $param)]);

    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function updateCtg(Request $request)
    {

        $param = [
            $request->input('ctg_id'),
            $request->input('title'),
        ];

        return response()->json(['status' => call_user_func_array([$this->ctg, 'updateCtg'], $param)]);
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
        $itemModel->ctg_id  = $request->input('item_id') ? $request->input('pid') : $request->input('ctg_id');
        $itemModel->title   = $request->input('title');

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
        $itemModel = Item::find($request->input('item_id'));

        $itemModel->title = $request->input('title');

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

        $itemModel = Item::find($request->input('item_id'));

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
