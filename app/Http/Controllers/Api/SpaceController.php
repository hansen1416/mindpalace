<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-10-27
 * Time: 下午5:46
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Contract\SpaceServiceContract;
use Illuminate\Http\Request;

class SpaceController extends Controller
{
    private $space;

    public function __construct(
        SpaceServiceContract $spaceServiceContract
    )
    {
        $this->space = $spaceServiceContract;
    }

    public function home()
    {
        return response()->json($this->space->allSpace());
    }


    public function update()
    {
        $this->space->updateSpace(1);
    }


    public function create(Request $request)
    {
        return response()->json([
                                    'res' => $this->space->createSpace($request->input('name')),
                                ]);
    }

}