<?php
/**
 * Created by PhpStorm.
 * User: mok
 * Date: 17-2-6
 * Time: 下午3:56
 */

namespace App;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $table = 'item';


    protected $primaryKey = 'item_id';


    protected $guarded = [];


    public function ctg()
    {
        return $this->belongsTo('App\Ctg');
    }
}