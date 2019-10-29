<?php

namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        Schema::defaultStringLength(191);
        Carbon::setLocale('zh');
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // \DB::listen(function ($query) {
        //     $tmp = str_replace('?', '"'.'%s'.'"', $query->sql);
        //     $qBindings = [];
        //     foreach ($query->bindings as $key => $value) {
        //         if (is_numeric($key)) {
        //             $qBindings[] = $value;
        //         } else {
        //             $tmp = str_replace(':'.$key, '"'.$value.'"', $tmp);
        //         }
        //     }
        //     $tmp = vsprintf($tmp, $qBindings);
        //     $tmp = str_replace("\\", "", $tmp);
        //     \Log::info('request:' . request()->fullUrl() . '; execution time: '.$query->time.'ms; '.$tmp."\n\n\t");
        // });
    }
}
