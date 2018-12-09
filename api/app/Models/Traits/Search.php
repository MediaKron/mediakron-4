<?php

namespace App\Models\Traits;

/**
 * Permissions fora user
 */
trait Search
{
    /**
     * Create a string index and then insert it into the search index
     *
     * @return void
     */
    public function indexData($type, $stopwords = false)
    {
        if(!isset($this->index_keys)) throw new \Exception("No index set for model");
        DB::table('search')->where('type', $type)->where('sid', $this->id)->delete();
        $index = [];
        foreach($this->index_keys as $key => $boost){
            if(!isset($index[$boost])) $index[$boost] = '';
            if(isset($this->{$key})) $index[$boost] .= ' ' . index_clean($this->{$key});
        }
        $index = $this->indexHook($index);
        // Break it up 
        $i = 0;
        foreach($index as $boost => $string){
            $words = explode(' ', $string);
            if ($stopwords) $words = array_diff($words, $stopwords);
            foreach ($words as $word) {
                if(empty($word)) continue;
                $termFrequency = $this->termFrequency($word, $type, $this->id, count($words));
                $inverseDocumentFrequency = $this->inverseDocumentFrequency($word, $type);
                $score = $termFrequency * $inverseDocumentFrequency;
                $score = $score * $boost;
                if($score === 0){
                    $score = 0.001;// default score
                }
                DB::table('search')->insert(
                    [
                        'word' => $word,
                        'sid' => $this->id,
                        'type' => $type,
                        'boost' => $boost,
                        'position' => $i
                    ]
                );
                $i++;
            }
            
        }
        
        $this->index_pending = 0;
        $this->save();
    }

    /**
     * Calculate frequency
     *
     * @param [type] $word
     * @param [type] $type
     * @param [type] $sid
     * @param [type] $length
     * @return void
     */
    public function termFrequency($word, $type, $sid, $length){
        $count  = DB::table('search')
            ->where('word', $word)
            ->where('type', $type)
            ->where('sid', $sid)->count();

        return $count/$length;
    }

    public $documents = [];

    /**
     * Fetch the number of documents that term appears in
     * and calculate the inverse frequency
     *
     * @param [type] $term
     * @return void
     */
    public function inverseDocumentFrequency($word, $type){

        $count  = DB::table('search')
            ->where('word', $word)
            ->where('type', $type)
            ->count();
        if($count == 0) $count = 1;


        if(!isset($this->documents[$type])){
            $this->documents[$type] = $documents = DB::table('search')
            ->where('type', $type)
            ->count(DB::raw('DISTINCT sid'));
        }else{
            $documents = $this->documents[$type];
        }
        return log($documents / $count, 10);
    }

    /**
     * This acts as a hook for allowing injection of things into theindex
     *
     * @param [type] $index
     * @return void
     */
    public function indexHook($index){
        return $index;
    }
}
