<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\Company;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->limit;
        $title = $request->title;
        $orderBy = $request->orderBy ? 'asc' : 'desc';
        $companys = Company::when($title, function ($query) use ($title) {
            return $query->where('title', 'like', '%' . $title . '%');
        })->orderBy('id', $orderBy)->paginate($limit);
        return success($companys);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $company = Company::create($data);
        if (isset($company)) {
            return success();
        }
        return error();
    }

    public function show($id)
    {
        $company = Company::find($id);
        return success($company);
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        if (Company::where('id', $id)->update($data)) {
            return success();
        }
        return error();
    }

    public function destroy($id)
    {
        if (Company::where('id', $id)->delete()) {
            return success();
        }
        return error();
    }
}
