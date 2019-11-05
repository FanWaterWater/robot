<?php

namespace App\Services;

use Maatwebsite\Excel\Facades\Excel;

class LaravelExcel
{
    public static function IntToChr($index, $start = 65)
    {
        $str = '';
        if (floor($index / 26) > 0) {
            $str .= self::IntToChr(floor($index / 26) - 1);
        }
        return $str . chr($index % 26 + $start);
    }

    /**
     * @param $name :文件名
     * @param array $data :[[id,name],[1,'张三']]
     * @param $format :文件格式 xls ,xlsx 默认值为xls
     */
    public static function export($name, array $data, $format = 'xls' ,$zyjs =[])
    {
//        ini_set('memory_limit', '100M');

        $count = count($data);
        if($count>0){
            $title = $data[0];
            $titleCount = count($title);
        }

        $col = self::IntToChr($titleCount - 1);

        //      边框
        $styleThinBlackBorderOutline = array(
            'borders' => array(
                'allborders' => array('style' => 'thin'),
            ),
        );

        Excel::create($name . date('Ymd', time()), function ($excel) use ($data, $col, $count,$titleCount, $styleThinBlackBorderOutline , $zyjs) {
            $excel->sheet('score', function ($sheet) use ($data, $col, $count, $titleCount,$styleThinBlackBorderOutline) {
                $sheet->rows($data);
                $sheet->cells('A1:' . $col . '1', function ($cells) {
                    $cells->setFontFamily('宋体');
                    $cells->setFontWeight('bold');
                    $cells->setFontSize(14);
                    $cells->setAlignment('center');
                    $cells->setValignment('center');
                });


                $sheet->cells('A2:' . $col . $count, function ($cells) {
                    $cells->setFontFamily('宋体');
                    $cells->setFontSize(12);
                    $cells->setBorder('solid', 'solid', 'solid', 'solid');
                    $cells->setAlignment('center');
                    $cells->setValignment('center');
                });
                $sheet->setAutoSize(true);
                $sheet->getStyle('A1:' . $col . $count)->getAlignment()->setWrapText(TRUE);
                $sheet->getStyle('A1:' . $col . $count)->applyFromArray($styleThinBlackBorderOutline);

            });

            if(count($zyjs)>0){
                $excel->sheet('照妖镜',function ($sheet) use ($zyjs){
                    $row_num = 1;
                    foreach($zyjs as $zyj){

                        $objDrawing = new \PHPExcel_Worksheet_MemoryDrawing();
                        $objDrawing->setCoordinates('A' . $row_num);
                        $objDrawing->setImageResource($zyj);
                        $objDrawing->setOffsetX(0);
                        $objDrawing->setOffsetY(0);
                        $objDrawing->setRenderingFunction(\PHPExcel_Worksheet_MemoryDrawing::RENDERING_DEFAULT);//渲染方法
                        $objDrawing->setMimeType(\PHPExcel_Worksheet_MemoryDrawing::MIMETYPE_DEFAULT);
                        $objDrawing->setHeight(700);
                        $objDrawing->setWidth(700);
                        $objDrawing->setOffsetX(0);
                        $objDrawing->setRotation(0);
                        $objDrawing->setWorksheet($sheet);
                        $row_num=$row_num+33;
                    }
                });
            }
        })->export($format);
    }
}
