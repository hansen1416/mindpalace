<?php

namespace App\Http\Controllers\Yang;

use App\Repositories\CtgRepository;
use App\Repositories\ItemRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
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
     * @var ItemRepository
     */
    protected $item;

    /**
     * SpaceController constructor.
     * @param UserRepository $user
     * @param CtgRepository  $ctg
     * @param ItemRepository $item
     */
    public function __construct(UserRepository $user, CtgRepository $ctg, ItemRepository $item)
    {
        $this->user = $user;
        $this->ctg  = $ctg;
        $this->item = $item;
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
     * @param Request $request
     * @return mixed
     */
    public function createItem(Request $request)
    {

        $param = [
            $request->input('ctg_id'),
            Auth::user()->user_id,
            0,
            $request->input('title'),
        ];

        return response()->json(['status' => call_user_func_array([$this->item, 'createItem'], $param)]);

    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function updateItem(Request $request)
    {

        $param = [
            $request->input('item_id'),
            0,
            0,
            $request->input('title'),
        ];

        return response()->json(['status' => call_user_func_array([$this->item, 'updateItem'], $param)]);

    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function getItemDetail(Request $request)
    {

        $item = $this->item->getItemWithContent($request->input('item_id'));

        return response()->json(['status' => $item, 'message' => $item->content]);
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function editItemDetail(Request $request)
    {

        $param = [
            $request->input('item_id'),
            0,
            0,
            '',
            $request->input('content'),
        ];

        return response()->json(['status' => call_user_func_array([$this->item, 'updateItem'], $param)]);
    }

}
