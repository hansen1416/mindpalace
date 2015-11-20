<?php namespace App\Helpers;

class Helper {

    public static function MultiDimen($singleDimen)
    {
    	$result = array();

    	foreach ($singleDimen as $key => $value) {

    		if($value->pid == 0){
    			$result[$value->id] = $value;
    		}else{
    			if(isset($result[$value->pid]) && $result[$value->pid]){
    				$result[$value->pid]['desc'] = $value;
    			}
    		}

    	}

        return $result;
    }

}
