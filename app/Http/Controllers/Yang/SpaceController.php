<?php

namespace App\Http\Controllers\Yang;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use App\Repositories\CtgRepository;
use App\Repositories\ItemRepository;
use Mockery\CountValidator\Exception;

/**
 * Class SpaceController
 * @package App\Http\Controllers\Yang
 */
class SpaceController extends Controller
{

    /**
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
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

//        $status = $request->session()->get('status');
//
//        if ($status) {
//            var_dump($status);die;
//        }

        $pid = $request->input('pid', 0);

        if ($pid) {
            $html = $this->ctg->getDescCtg($pid, true);
        } else {
            $html = $this->ctg->getAllCtg(true);
        }

        return response()->view('yang.space.index', ['html' => $html, 'user' => $this->user->userInfo(), 'pid' => $pid]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createCtg(Request $request)
    {

        $param = [
            $request->input($request->input('act')),
            $this->user->userInfo()->user_id,
            0,
            $request->input('title'),
        ];

        return response()->json(['status' => call_user_func_array([$this->ctg, 'createCtg'], $param)]);

    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateCtg(Request $request)
    {

        $param = [
            $request->input('ctg_id'),
            $request->input('sort'),
            $request->input('title'),
        ];

        return response()->json(['status' => call_user_func_array([$this->ctg, 'updateCtg'], $param)]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCtgDetail(Request $request)
    {

        $param = [
            $request->input('ctg_id'),
            false,
        ];

        $data = call_user_func_array([$this->ctg, 'findCtg'], $param);

        return response()->json(['status' => boolval($data), 'message' => $data]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createItem(Request $request)
    {

        $param = [
            $request->input('ctg_id'),
            $this->user->userInfo()->user_id,
            0,
            $request->input('title'),
            '',
        ];

        return response()->json(['status' => call_user_func_array([$this->item, 'createItem'], $param)]);

    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateItem(Request $request)
    {

        $param = [
            $request->input('item_id'),
            0,
            0,
            $request->input('title'),
            $request->input('content'),
        ];

        return response()->json(['status' => call_user_func_array([$this->item, 'updateItem'], $param)]);

    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getItemDetail(Request $request)
    {

        $item = $this->item->getItemWithContent($request->input('item_id'));

        return response()->json(['status' => boolval($item), 'message' => $item->content]);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllTheme()
    {

        $themes = $this->user->allThemes();

        return response()->json(['status' => '1', 'message' => $themes]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function changeTheme(Request $request)
    {

        $message = 'theme update failed';

        if ($this->user->updateTheme($request->input('theme_id'))) {
            $message = 'theme updated';
        }

        return redirect()->back()->with('status', $message);
    }

}
