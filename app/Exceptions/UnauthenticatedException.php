<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-3-28
 * Time: 下午1:56
 */

namespace App\Exceptions;

use Exception;

class UnauthenticatedException extends Exception
{
    public function __construct($message = "", $code = 0, Exception $previous = null)
    {
        $message = $message ? $message : 'no login user';
        parent::__construct($message, $code, $previous);
    }
}