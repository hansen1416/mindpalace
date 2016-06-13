<?php namespace App;

use Illuminate\Database\Eloquent\Model;

class Item extends Model {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'item';

    /**
     * The primary key used by the model.
     *
     * @var int
     */
    protected $primaryKey = 'item_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['ctg_id', 'sort', 'title', 'tags', 'content'];

    /**
     * belongsto, many to one relationship, with table mp_ctg
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function ctg()
    {
        return $this->belongsTo('App\Ctg');
    }

}
