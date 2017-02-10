<?php
/**
 * Created by PhpStorm.
 * User: hlz
 * Date: 17-2-10
 * Time: 上午10:27
 */

namespace App\Exceptions;

use Exception;

class SaveFailedException extends Exception
{
    public function __construct($message = "", $code = 0, Exception $previous = null)
    {
        $message = $message ? $message : 'save failed';
        parent::__construct($message, $code, $previous);
    }
}