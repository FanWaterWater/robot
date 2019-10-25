<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function upload()
    {
        $file = request()->file('file');
        if (!$file) {
            return error('文件不能为空');
        }
        $type = 'videos/';
        if (strpos(\File::mimeType($file), 'image') !== false) {
            $type = 'images/';
        }
        $fileName = $type . date('Y/m/d', time());
        $url = Storage::disk('public')->put($fileName, $file);
        if ($url) {
            // return response()->json(['msg' => '上传成功', 'code' => 0, 'data' => ['src' => $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . '/' . 'storage/' . $url]])->setStatusCode(200);
            return response()->json(['msg' => '上传成功', 'code' => 0, 'data' => ['src' => env('APP_URL') . '/' . 'storage/' . $url]])->setStatusCode(200);
        }
        return success('上传失败');
    }
}
