<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 16-9-29
 * Time: 下午6:00
 */

namespace App\Repositories;

use Hansen1416\Repository\Repositories\EloquentRepository;
use App\Repositories\Contract\CtgRepositoryContract;
use App\Exceptions\SaveFailedException;
use App\Ctg;

class CtgEloquentRepository extends EloquentRepository implements CtgRepositoryContract
{
    protected $repositoryId = 'rinvex.repository.ctg';

    protected $model = 'App\Ctg';

    /**
     * @param array $data
     * @return Ctg
     * @throws SaveFailedException
     */
    public function ctgRepositoryCreate(array $data): Ctg
    {
        $res = $this->create($data);

        if (!$res[0]) {
            throw new SaveFailedException();
        }

        return $res[1];
    }

    /**
     * @param int   $ctg_id
     * @param array $data
     * @return Ctg
     * @throws SaveFailedException
     */
    public function ctgRepositoryUpdate(int $ctg_id, array $data): Ctg
    {
        $res = $this->update($ctg_id, $data);

        if (!$res[0]) {
            throw new SaveFailedException();
        }

        return $res[1];
    }

}