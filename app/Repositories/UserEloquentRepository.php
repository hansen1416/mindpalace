<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-9-30
 * Time: 下午4:56
 */

namespace App\Repositories;

use Rinvex\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\UserRepositoryContract;

class UserEloquentRepository extends EloquentRepository implements UserRepositoryContract
{

}