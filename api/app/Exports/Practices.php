<?php

namespace App\ReportGenerators;

use App\ReportGenerators\ReportInterface;
use App\Models\Practice;
use App\Notifications\Reports\Practice as Notice;
use Excel;
use App\Exports\PracticesExport;

class Practices extends ReportInterface
{

    public $emails = [
        'ampssupport@cynosure.com',
        'amps@convertiv.com',
        'brad@convertiv.com'
    ];

    public function __construct($email){
        $this->user = User::where('email', $email)->first();
        return parent::__construct($email);
    }

    public function process(){
        $name = 'practices_' . bin2hex(random_bytes(5)) . '.xlsx';
        Excel::store(new PracticesExport(), $name, 'local');
        return $this;
    }

    public function send(){
        // The child function should send some notifications
        $user->notify(new Notice());
        return $this;
    }

}