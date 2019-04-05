<?php

/**
 * Security related helper functions
 */

 /**
  * Walk through
  *
  * @param [type] $array
  * @return void
  */
 function parameter_walk($array){
     $return = [];
     if(!is_array($array)){
         return sanitize_string($array);
     }
     foreach($array as $key => $value){
         if(is_string($value)){
            $return[$key] = sanitize_string($value);
         }elseif(is_array($value)){
            $return[$key] = parameter_walk($value);
         }elseif(is_numeric($value)){
             $return[$key] = $value;
         }elseif(is_object($value)){
            $return[$key] = parameter_walk((array) $value);
         }
     }
     return $return;
 }

 /**
  * Call this on a variable and it will attempt
  * To sanitize all of the elements passedin
  *
  * @param [type] $array
  * @return void
  */
function xss_sanitize($value){
    return parameter_walk($value);
}

/**
 * Sanitize the string
 * remove things that could be used to inject tags.
 *
 * @param [type] $string
 * @return void
 */
function sanitize_string($string){
    // I think we don't need to do more than this
    return str_replace(['<', '>'], '', strip_tags($string));
    // For good measure 
    //return str_replace(['<', '>'], '', $str);
    //return htmlspecialchars($string, ENT_NOQUOTES, 'UTF-8', false);
}

function extract_id($item){
    if(is_object($item)){
        if(isset($item->id)) return (int) $item->id;
    }
    if (is_array($item)) {
        if (isset($item['id'])) return (int)$item['id'];
    }
    if (is_string($item)) {
        if (isset($item)) return (int)$item;
    }
    if (is_int($item)) {
        if (isset($item)) return (int) $item;
    }
    return $item;
}

/**
 * Sanitize filename for storage
 *
 * @param [type] $source
 * @return void
 */
function process_filename($source, $extension = ''){
    // Remove anything which isn't a word, whitespace, number
    // or any of the following caracters -_~,;[]().
    // If you don't need to handle multi-byte characters
    // you can use preg_replace rather than mb_ereg_replace
    // Thanks @Łukasz Rysiak!
    $file = mb_ereg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $source);
    // Remove any runs of periods (thanks falstro!)
    $file = mb_ereg_replace("([\.]{2,})", '', $file);
    $new_extension = get_extension($file);
    if(empty($new_extension)){
        if(!empty($extension)){
            $file .= '.' . $extension;
        }
    }
    return $file;
}

/**
 * Extract extension from filename
 *
 * @param [type] $source
 * @return void
 */
function get_extension($source){
    $extension = pathinfo($source, PATHINFO_EXTENSION);
    return $extension;
}