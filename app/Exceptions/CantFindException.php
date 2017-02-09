<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-2-9
 * Time: 下午2:14
 */

namespace App\Exceptions;

use Exception;

class CantFindException extends Exception
{
    public function __construct($message = "", $code = 0, Exception $previous = null)
    {
        $message = $message ? $message : 'can\'t find ctg';
        parent::__construct($message, $code, $previous);
    }
}