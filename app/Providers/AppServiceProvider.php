<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contract\CtgRepositoryContract;
use App\Repositories\CtgEloquentRepository;
use App\Repositories\Contract\UserRepositoryContract;
use App\Repositories\UserEloquentRepository;
use App\Services\Contract\UserServiceContract;
use App\Services\UserService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(CtgRepositoryContract::class, CtgEloquentRepository::class);
        $this->app->bind(UserRepositoryContract::class, UserEloquentRepository::class);

        $this->app->bind(UserServiceContract::class, UserService::class);
    }
}
