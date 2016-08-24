<?php
namespace App\Http\Controllers\Yang;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use App\Repositories\CtgRepository;

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
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
//        $status = $request->session()->get('status');
//
//        if ($status) {
//            var_dump($status);die;
//        }

        $pid      = $request->input('pid', 0);
        $space_id = $request->input('space_id');

        if ($pid) {
            $html = $this->ctg->getDescCtg($pid, $space_id);
        } else {
            $html = $this->ctg->getSpaceCtg($space_id);
        }

        return response()->view('yang.space.index', [
            'html'     => $html,
            'user'     => $this->user->userInfo(),
            'space_id' => $space_id,
            'pid'      => $pid,
        ]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createCtg(Request $request)
    {
        $param = [
            $request->input($request->input('act')),
            $request->input('space_id'),
            $this->user->userInfo()->user_id,
            0,
            $request->input('title'),
            $request->input('private', 0),
            $request->input('content', null),
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
            $request->input('sort', 0),
            $request->input('title', ''),
            $request->input('private', 0),
            $request->input('content'),
        ];

        return $this->jsonResponse(call_user_func_array([$this->ctg, 'updateCtg'], $param));
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function moveCtg(Request $request)
    {
        $param = [
            $request->input('ctg_id'),
            $request->input('pid'),
        ];

        return $this->jsonResponse(call_user_func_array([$this->ctg, 'moveCtg'], $param));
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCtgDetail(Request $request)
    {
        $param = [
            $request->input('ctg_id'),
        ];

        $data = call_user_func_array([$this->ctg, 'findCtg'], $param);

        return response()->json(['status' => boolval($data), 'message' => $data]);
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
