<?php

namespace App\Http\Controllers\Api\Backend;

use App\Models\Receipt;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ReceiptController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->limit;
        $receipts = Receipt::paginate($limit);
        return success($receipts);
    }

    public function receipt()
    {
        $receipt = Receipt::first();
        return success($receipt);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $receipt = Receipt::create($data);
        if (isset($receipt)) {
            return success();
        }
        return error();
    }

    public function show($id)
    {
        $receipt = Receipt::find($id);
        return success($receipt);
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        if (Receipt::where('id', $id)->update($data)) {
            return success();
        }
        return error();
    }

    public function destroy($id)
    {
        if (Receipt::where('id', $id)->delete()) {
            return success();
        }
        return error();
    }
}
