<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-3-31
 * Time: 下午5:44
 */

namespace App\Exceptions;

use Exception;

class DeleteFailedException extends Exception
{
    public function __construct($message = "", $code = 0, Exception $previous = null)
    {
        $message = $message ? $message : 'delete failed';
        parent::__construct($message, $code, $previous);
    }
}