<?php

namespace App\ReportGenerators;

class ReportInterface
{

    public $emails = [
        'ampssupport@cynosure.com',
        'amps@convertiv.com',
        'brad@convertiv.com'
    ];
    public function __construct($email){
        //
        $this->emails[] = $email;
        return $this->process()->send();
    }

    public function process(){
        // The child function should impliment a process queue to write out a file
        return $this;
    }

    public function send(){
        // The child function should send some notifications
        return $this;
    }

}