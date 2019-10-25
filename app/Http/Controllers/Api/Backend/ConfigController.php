<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\Config;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ConfigController extends Controller
{
    public function index()
    {
        $configs = Config::get();
        return success($configs);
    }

    public function format()
    {
        $configs = Config::getFormat();
        return success($configs);
    }

    public function show($id)
    {
        $config = Config::find($id);
        return success($config);
    }

    public function store()
    {
        $data = request()->all();
        if ($config = Config::create($data)) {
            return success($config);
        }
        return error();
    }

    public function update($id)
    {
        $data = request()->all();
        if (Config::where('id', $id)->update($data)) {
            $config = Config::find($id);
            $config->save();
            return success();
        }
        return error();
    }

    public function destroy($id)
    {
        if (Config::where('id', $id)->delete()) {
            return success();
        }
        return error();
    }
}
