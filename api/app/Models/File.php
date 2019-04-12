<?php

namespace App\Models;

use App\Models\BaseModel;
//use App\Http\Middleware\TimeBasedAccessMiddleware;
use Auth;
use Log;
class File extends BaseModel
{
    static $validation = [
        'image' => 'image|max:100000',
        'video' => 'mimes:mp4,wmv,m4v,mpg,mpeg,mov|max:100000',
        'audio' => 'mimes:mp3,m4a|max:100000',
        'file' => 'mimes:jpeg,png,gif,tif,pdf,docx,doc,tiff,txt,html,ppt,pptx|max:100000',
        'pdf' => 'mimes:pdf|max:100000'
    ];

    protected $fillable = [
        'fid',
        'uri',
        'mime',
        'size',
        'name',
        'title',
    ];

    protected $appends = [
        's3',
        'filename'
    ];

    /**
     * Returns download uri
     *
     * @return string
     */
    public function getDownloadUri()
    {
        $value = $this->getOriginal('uri');

        switch ($this->mime) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/jpg':
            case 'image/gif':
                if (strpos($value, 's3://') !== false) {
                    $value = str_replace('s3://', env('IMGIX_URL'), $value);
                }
                if (strpos($value, env('AWS_URL')) !== false) {
                    $value = str_replace(env('AWS_URL'), env('IMGIX_URL'), $value);
                }
                break;
            default:
                if (strpos($value, 's3://') !== false) {
                    $value = str_replace('s3://', env('AWS_URL'), $value);
                }
                break;
        }

        return $value;
    }

    /**
     * Returns download response headers
     *
     * @return array
     */
    public function getDownloadHeaders()
    {
        return [
            'Content-Type' => $this->mime,
            'Content-Length' => $this->size,
            'Content-Disposition' => 'attachment; filename="' . $this->name . '"',
        ];
    }

    /**
     * Display file uri as full urls
     *
     * @param [type] $value
     * @return void
     */
    public function getUriAttribute($value, $skip = false)
    {
        $table = $this->getTable();
        $resource = str_singular($table) . '/';
        // Time based access key
        $key = "key!"; //TimeBasedAccessMiddleware::getKey();

        return $this->api_path . $resource . $this->id . '/download?key=' . $key;
    }

    /**
     * Display file uri as full urls
     *
     * @param [type] $value
     * @return void
     */
    public function getS3Attribute($value)
    {
        $value = $this->getOriginal('uri');
        if (strpos($value, 's3://') !== false) $value = str_replace('s3://', '/', $value);
        return $value;
    }

    /**
     * Display file thumbnail uri as imgix url
     *
     * @param string $value
     * @return string
     */
    public function getFilenameAttribute($value)
    {
        $value = basename($this->getOriginal('uri'));
        return $value;
    }

    /**
     * Display the file name parsed if no title is provided
     *
     * @param [type] $value
     * @return void
     */
    public function getTitleAttribute($value)
    {
        if (empty($value)) {
            return ucwords(
                trim(
                    preg_replace(
                        array(
                            '/\.[^\.]+$/',
                            '/[^a-z0-9]+/',
                        ),
                        array(
                            '',
                            ' ',
                        ),
                        strtolower($this->name)
                    )
                )
            );
        }

        return $value;
    }


    /**
     * Scope a query to only include preview files
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePreview($query)
    {
        return $query->where('display', 'preview');
    }

    /**
     * Scope a query to only include preview files
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeThumbnail($query)
    {
        return $query->where('display', 'thumbnail');
    }

    /**
     * Scope a query to only include preview files
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFile($query)
    {
        return $query->where('display', 'file');
    }

    /**
     * Many Files
     *
     * @return void
     */
    public function asset()
    {
        return $this->morphTo();
    }

    /**
     * Handle the upload
     *
     * @param \App\Models\Site $site
     * @param string $type
     * @param Request $request
     * 
     * @return App\Models\File;
     */
    public static function handleUpload($site, $type, $request)
    {
        $file = false;
        $fields = ['image', 'file', 'pdf', 'logo'];

        if (!$type) {
            $type = 'image';
        }
        // Get user
        $user = Auth::user();

        if ($request->hasFile($type)) {
            $file = $request->file($type);
        }

        if (!$file) {
            throw new \Exception('No File Provided');
        }

        $save = new static();
        $save->site_id = $site->id;
        $save->mime = $file->getMimeType();
        $save->size = $file->getSize();
        $save->name = process_filename($file->getClientOriginalName());

        if ($request->has('title')) {
            $save->title = $request->get('title');
        }

        $save->uri = 's3://' . $file->store(env('AWS_BUCKET_ENV', 'dev') . '/' . $site->uri, 's3');
        $save->save();
        $file = static::find($save->id);

        return $file;
    }

    /**
     * Convert the model instance to an array.
     *
     * @return array
     */
    public function toRelationshipArray()
    {
        $table = $this->getTable();
        $resource = str_singular($table) . '/';
        $array = [
            'id' => $this->id,
            "asset_id" => $this->asset_id,
            "asset_type" => $this->asset_type,
            "display" => $this->display,
            "fid" => $this->fid,
            'uri' => $this->uri,
            'mime' => $this->mime,
            'name' => $this->name,
            'title' => $this->title,
            'alt' => $this->alt,
            's3' => $this->s3,
            'filename' => $this->thumbnail,
            'path' => $this->api_path . $resource . $this->id,
            'created_at' => (string) $this->created_at
        ];
        if ($this->relationLoaded('user')) {
            if ($this->user) {
                $array['user'] = [
                    'id' => $this->user->id,
                    'email' => $this->user->email,
                    'name' => $this->user->name(),
                ];
            } else {
                $array['user'] = null;
            }
        }
        return $array;
    }

    /**
     * Files are created by a user
     *
     * @return void
     */
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    /**
     * Files belong to a site
     *
     * @return void
     */
    public function site()
    {
        return $this->belongsTo('App\Models\Site');
    }
}

